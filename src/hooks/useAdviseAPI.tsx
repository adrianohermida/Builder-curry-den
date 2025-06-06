import { useState, useEffect, useCallback } from "react";
import { useStorageConfig } from "./useStorageConfig";

export interface PublicacaoAdvise {
  id: string;
  numeroProcesso: string;
  tribunal: string;
  dataPublicacao: string;
  conteudo: string;
  tipo:
    | "intimacao"
    | "citacao"
    | "despacho"
    | "sentenca"
    | "acordao"
    | "outros";
  partes: string[];
  urgencia: "baixa" | "media" | "alta" | "urgente";
  status: "nao_lida" | "lida" | "processada";
  origem: "djen" | "domicilio_judicial" | "tribunal_local";
  metadados: {
    segredoJustica: boolean;
    valorCausa?: number;
    classe: string;
    assunto: string;
  };
}

export interface ConfigAdvise {
  apiKey: string;
  endpoint: string;
  intervalSync: number; // em minutos
  filtros: {
    tribunais: string[];
    tipos: string[];
    apenas_urgentes: boolean;
  };
  ativo: boolean;
}

interface UseAdviseAPIReturn {
  publicacoes: PublicacaoAdvise[];
  loading: boolean;
  error: string | null;
  config: ConfigAdvise;
  updateConfig: (config: Partial<ConfigAdvise>) => void;
  syncPublicacoes: () => Promise<void>;
  marcarComoLida: (id: string) => Promise<void>;
  processarPublicacao: (id: string, acao: string) => Promise<void>;
  testarConexao: () => Promise<boolean>;
  ultimaSync: Date | null;
}

const defaultConfig: ConfigAdvise = {
  apiKey: "",
  endpoint: "https://api.advise.com.br/v1",
  intervalSync: 30,
  filtros: {
    tribunais: [],
    tipos: ["intimacao", "citacao", "sentenca"],
    apenas_urgentes: false,
  },
  ativo: false,
};

export function useAdviseAPI(): UseAdviseAPIReturn {
  const [publicacoes, setPublicacoes] = useState<PublicacaoAdvise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<ConfigAdvise>(defaultConfig);
  const [ultimaSync, setUltimaSync] = useState<Date | null>(null);
  const { uploadFile, activeProvider } = useStorageConfig();

  // Carregar configuração do localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem("lawdesk_advise_config");
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error("Erro ao carregar config Advise:", error);
      }
    }
  }, []);

  // Salvar configuração no localStorage
  useEffect(() => {
    localStorage.setItem("lawdesk_advise_config", JSON.stringify(config));
  }, [config]);

  // Auto-sync baseado no intervalo configurado
  useEffect(() => {
    if (!config.ativo || !config.apiKey) return;

    const interval = setInterval(
      () => {
        syncPublicacoes();
      },
      config.intervalSync * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [config]);

  const updateConfig = useCallback((newConfig: Partial<ConfigAdvise>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const makeAdviseRequest = async (
    endpoint: string,
    options: RequestInit = {},
  ) => {
    const response = await fetch(`${config.endpoint}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(
        `Erro na API Advise: ${response.status} - ${response.statusText}`,
      );
    }

    return response.json();
  };

  const testarConexao = useCallback(async (): Promise<boolean> => {
    if (!config.apiKey || !config.endpoint) {
      setError("API Key ou endpoint não configurados");
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      await makeAdviseRequest("/health");
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro desconhecido na conexão",
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, [config]);

  const syncPublicacoes = useCallback(async () => {
    if (!config.ativo || !config.apiKey) return;

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limite: "100",
        status: "nao_lida",
        ...(config.filtros.tribunais.length && {
          tribunais: config.filtros.tribunais.join(","),
        }),
        ...(config.filtros.tipos.length && {
          tipos: config.filtros.tipos.join(","),
        }),
        ...(config.filtros.apenas_urgentes && { urgencia: "alta,urgente" }),
      });

      const response = await makeAdviseRequest(`/publicacoes?${params}`);

      // Processar e enriquecer dados
      const publicacoesEnriquecidas = response.data.map((pub: any) => ({
        ...pub,
        id: pub.id || `pub_${Date.now()}_${Math.random()}`,
        urgencia: determinarUrgencia(pub.conteudo, pub.tipo),
        metadados: {
          ...pub.metadados,
          segredoJustica: pub.conteudo
            .toLowerCase()
            .includes("segredo de justiça"),
        },
      }));

      setPublicacoes((prev) => {
        // Evitar duplicatas
        const novasPublicacoes = publicacoesEnriquecidas.filter(
          (nova: PublicacaoAdvise) =>
            !prev.some((existente) => existente.id === nova.id),
        );
        return [...prev, ...novasPublicacoes];
      });

      setUltimaSync(new Date());

      // Backup automático das publicações
      if (activeProvider !== "lawdesk-cloud") {
        const backupData = {
          timestamp: new Date().toISOString(),
          publicacoes: publicacoesEnriquecidas,
          origem: "advise_api",
        };

        await uploadFile(
          new Blob([JSON.stringify(backupData, null, 2)], {
            type: "application/json",
          }),
          `backups/publicacoes_${new Date().toISOString().split("T")[0]}.json`,
          "system",
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro na sincronização");
    } finally {
      setLoading(false);
    }
  }, [config, activeProvider, uploadFile]);

  const marcarComoLida = useCallback(
    async (id: string) => {
      try {
        await makeAdviseRequest(`/publicacoes/${id}/lida`, {
          method: "PATCH",
        });

        setPublicacoes((prev) =>
          prev.map((pub) => (pub.id === id ? { ...pub, status: "lida" } : pub)),
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao marcar como lida",
        );
      }
    },
    [config],
  );

  const processarPublicacao = useCallback(
    async (id: string, acao: string) => {
      try {
        await makeAdviseRequest(`/publicacoes/${id}/processar`, {
          method: "POST",
          body: JSON.stringify({ acao }),
        });

        setPublicacoes((prev) =>
          prev.map((pub) =>
            pub.id === id ? { ...pub, status: "processada" } : pub,
          ),
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao processar publicação",
        );
      }
    },
    [config],
  );

  return {
    publicacoes,
    loading,
    error,
    config,
    updateConfig,
    syncPublicacoes,
    marcarComoLida,
    processarPublicacao,
    testarConexao,
    ultimaSync,
  };
}

// Função auxiliar para determinar urgência baseada no conteúdo
function determinarUrgencia(
  conteudo: string,
  tipo: string,
): "baixa" | "media" | "alta" | "urgente" {
  const conteudoLower = conteudo.toLowerCase();

  // Palavras que indicam urgência máxima
  const palavrasUrgentes = [
    "liminar",
    "tutela de urgência",
    "medida cautelar",
    "prisão",
    "mandado de segurança",
    "habeas corpus",
    "busca e apreensão",
    "sequestro",
    "arresto",
    "penhora",
  ];

  // Palavras que indicam alta prioridade
  const palavrasAltas = [
    "sentença",
    "apelação",
    "recurso",
    "embargos",
    "agravo",
    "contestação",
    "impugnação",
    "exceção",
    "reconvenção",
  ];

  // Palavras que indicam média prioridade
  const palavrasMedias = [
    "despacho",
    "decisão interlocutória",
    "manifestação",
    "petição",
    "juntada",
  ];

  if (palavrasUrgentes.some((palavra) => conteudoLower.includes(palavra))) {
    return "urgente";
  }

  if (
    tipo === "citacao" ||
    palavrasAltas.some((palavra) => conteudoLower.includes(palavra))
  ) {
    return "alta";
  }

  if (
    tipo === "intimacao" ||
    palavrasMedias.some((palavra) => conteudoLower.includes(palavra))
  ) {
    return "media";
  }

  return "baixa";
}
