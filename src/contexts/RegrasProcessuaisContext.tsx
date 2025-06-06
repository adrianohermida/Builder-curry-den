import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import regrasProcessuaisData from "@/data/regrasProcessuais.json";

export interface RegraProcessual {
  prazo: number;
  unidade: "dias_uteis" | "dias_corridos";
  origem: string;
  descricao: string;
}

export interface TipoProcesso {
  nome: string;
  prazos: Record<string, RegraProcessual>;
}

export interface TipoParte {
  multiplicador: number;
  adicionalDias?: number;
  descricao: string;
}

export interface ConfiguracaoSistema {
  modoContagem: "manual" | "automatica" | "ia";
  tipoProcessoPadrao: "cpc" | "penal" | "trabalhista" | "jef";
  notificacaoAntecipada: number;
  integracaoIA: boolean;
  backupLocal: boolean;
}

export interface RegrasProcessuaisData {
  versao: string;
  dataAtualizacao: string;
  regrasGerais: {
    djen: {
      nome: string;
      prazoBase: number;
      unidade: string;
      descricao: string;
    };
    domicilioJudicial: {
      intimacaoConfirmada: RegraProcessual;
      intimacaoNaoConfirmada: RegraProcessual;
      citacaoConfirmada: RegraProcessual;
    };
  };
  tiposProcesso: Record<string, TipoProcesso>;
  tiposPartes: Record<string, TipoParte>;
  feriados: {
    nacionais: string[];
    pontosFacultativos: string[];
  };
  configuracao: ConfiguracaoSistema;
}

interface RegrasProcessuaisContextType {
  regras: RegrasProcessuaisData;
  configuracao: ConfiguracaoSistema;
  updateConfiguracao: (novaConfig: Partial<ConfiguracaoSistema>) => void;
  getRegraProcesso: (
    tipoProcesso: string,
    tipoAto: string,
  ) => RegraProcessual | null;
  getTipoParte: (tipoParte: string) => TipoParte | null;
  exportarRegras: () => string;
  importarRegras: (dadosJson: string) => boolean;
  resetarRegras: () => void;
}

const RegrasProcessuaisContext = createContext<
  RegrasProcessuaisContextType | undefined
>(undefined);

const STORAGE_KEY = "lawdesk_regras_processuais";
const CONFIG_KEY = "lawdesk_configuracao_prazos";

export function RegrasProcessuaisProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [regras, setRegras] = useState<RegrasProcessuaisData>(
    regrasProcessuaisData,
  );
  const [configuracao, setConfiguracao] = useState<ConfiguracaoSistema>(
    regrasProcessuaisData.configuracao,
  );

  // Carregar configurações do localStorage na inicialização
  useEffect(() => {
    try {
      const savedRegras = localStorage.getItem(STORAGE_KEY);
      const savedConfig = localStorage.getItem(CONFIG_KEY);

      if (savedRegras) {
        const parsedRegras = JSON.parse(savedRegras);
        setRegras(parsedRegras);
      }

      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setConfiguracao(parsedConfig);
      }
    } catch (error) {
      console.error(
        "Erro ao carregar regras processuais do localStorage:",
        error,
      );
    }
  }, []);

  // Salvar no localStorage quando houver mudanças
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(regras));
    } catch (error) {
      console.error(
        "Erro ao salvar regras processuais no localStorage:",
        error,
      );
    }
  }, [regras]);

  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(configuracao));
    } catch (error) {
      console.error("Erro ao salvar configurações no localStorage:", error);
    }
  }, [configuracao]);

  const updateConfiguracao = (novaConfig: Partial<ConfiguracaoSistema>) => {
    setConfiguracao((prev) => ({ ...prev, ...novaConfig }));
  };

  const getRegraProcesso = (
    tipoProcesso: string,
    tipoAto: string,
  ): RegraProcessual | null => {
    const processo = regras.tiposProcesso[tipoProcesso];
    if (!processo || !processo.prazos[tipoAto]) {
      return null;
    }
    return processo.prazos[tipoAto];
  };

  const getTipoParte = (tipoParte: string): TipoParte | null => {
    return regras.tiposPartes[tipoParte] || null;
  };

  const exportarRegras = (): string => {
    return JSON.stringify(regras, null, 2);
  };

  const importarRegras = (dadosJson: string): boolean => {
    try {
      const novasRegras = JSON.parse(dadosJson);

      // Validação básica da estrutura
      if (!novasRegras.tiposProcesso || !novasRegras.configuracao) {
        throw new Error("Estrutura de dados inválida");
      }

      setRegras(novasRegras);
      return true;
    } catch (error) {
      console.error("Erro ao importar regras:", error);
      return false;
    }
  };

  const resetarRegras = () => {
    setRegras(regrasProcessuaisData);
    setConfiguracao(regrasProcessuaisData.configuracao);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CONFIG_KEY);
  };

  const value: RegrasProcessuaisContextType = {
    regras,
    configuracao,
    updateConfiguracao,
    getRegraProcesso,
    getTipoParte,
    exportarRegras,
    importarRegras,
    resetarRegras,
  };

  return (
    <RegrasProcessuaisContext.Provider value={value}>
      {children}
    </RegrasProcessuaisContext.Provider>
  );
}

export function useRegrasProcessuais() {
  const context = useContext(RegrasProcessuaisContext);
  if (context === undefined) {
    throw new Error(
      "useRegrasProcessuais deve ser usado dentro de um RegrasProcessuaisProvider",
    );
  }
  return context;
}
