import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";

export interface Contrato {
  id: string;
  titulo: string;
  descricao: string;
  cliente: {
    id: string;
    nome: string;
    tipo: "fisica" | "juridica";
    email: string;
    telefone: string;
    documento: string;
  };
  advogado: {
    id: string;
    nome: string;
    oab: string;
    email: string;
  };
  tipo:
    | "prestacao_servicos"
    | "retainer"
    | "success_fee"
    | "fixo"
    | "por_audiencia";
  status:
    | "rascunho"
    | "aguardando_assinatura"
    | "ativo"
    | "vencido"
    | "cancelado"
    | "finalizado";
  valor: number;
  tipoPagamento: "mensal" | "avulso" | "por_sucesso" | "parcelas";
  dataInicio: string;
  dataFim?: string;
  dataAssinatura?: string;
  assinaturas: {
    cliente: boolean;
    advogado: boolean;
    testemunha?: boolean;
  };
  clausulas: string[];
  anexos: string[];
  processosRelacionados: string[];
  configFaturamento: {
    frequencia: "mensal" | "trimestral" | "semestral" | "anual";
    diaVencimento: number;
    multaAtraso: number;
    jurosAtraso: number;
    diasLembrete: number[];
  };
  stripeConfig?: {
    habilitado: boolean;
    precoId?: string;
    subscriptionId?: string;
  };
  aiInsights?: {
    riskScore: number;
    recomendacoes: string[];
    ultimaAnalise: string;
  };
  template?: string;
  versao: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ContractTemplate {
  id: string;
  nome: string;
  descricao: string;
  categoria: "civil" | "trabalhista" | "tributario" | "empresarial" | "familia";
  clausulasPadrao: string[];
  camposPersonalizados: {
    nome: string;
    tipo: string;
    obrigatorio: boolean;
  }[];
  conteudo: string;
}

export interface ContratoFilters {
  busca: string;
  status: string;
  tipo: string;
  clienteId?: string;
  advogadoId?: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface ContratoStats {
  total: number;
  ativos: number;
  pendentesAssinatura: number;
  vencidos: number;
  receitaMensal: number;
  stripeIntegrados: number;
  riskScoreMedio: number;
}

const mockContratos: Contrato[] = [
  {
    id: "cont-001",
    titulo: "Prestação de Serviços - João Silva",
    descricao: "Serviços advocatícios em direito civil",
    cliente: {
      id: "cli-001",
      nome: "João Silva",
      tipo: "fisica",
      email: "joao@email.com",
      telefone: "(11) 99999-9999",
      documento: "123.456.789-00",
    },
    advogado: {
      id: "adv-001",
      nome: "Dr. Maria Santos",
      oab: "SP123456",
      email: "maria@escritorio.com",
    },
    tipo: "prestacao_servicos",
    status: "ativo",
    valor: 5000,
    tipoPagamento: "mensal",
    dataInicio: "2024-01-01",
    dataFim: "2024-12-31",
    dataAssinatura: "2024-01-01",
    assinaturas: {
      cliente: true,
      advogado: true,
    },
    clausulas: [
      "O CONTRATADO prestará serviços advocatícios na área civil",
      "O pagamento será realizado mensalmente até o dia 10",
      "O contrato terá vigência de 12 meses",
    ],
    anexos: ["contrato_assinado.pdf"],
    processosRelacionados: ["proc-001"],
    configFaturamento: {
      frequencia: "mensal",
      diaVencimento: 10,
      multaAtraso: 2,
      jurosAtraso: 1,
      diasLembrete: [7, 3, 1],
    },
    stripeConfig: {
      habilitado: true,
      precoId: "price_123",
      subscriptionId: "sub_123",
    },
    aiInsights: {
      riskScore: 15,
      recomendacoes: ["Contrato bem estruturado", "Pagamentos em dia"],
      ultimaAnalise: "2024-01-20T10:00:00Z",
    },
    versao: 1,
    criadoEm: "2024-01-01",
    atualizadoEm: "2024-01-15",
  },
];

const mockTemplates: ContractTemplate[] = [
  {
    id: "tpl-001",
    nome: "Prestação de Serviços Jurídicos",
    descricao: "Template padrão para contratos de prestação de serviços",
    categoria: "civil",
    clausulasPadrao: [
      "O CONTRATADO prestará serviços advocatícios",
      "O pagamento será realizado mensalmente",
      "O contrato poderá ser rescindido por qualquer das partes",
    ],
    camposPersonalizados: [
      { nome: "cliente_nome", tipo: "text", obrigatorio: true },
      { nome: "servico_descricao", tipo: "textarea", obrigatorio: true },
      { nome: "valor_mensal", tipo: "number", obrigatorio: true },
    ],
    conteudo: "CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS...",
  },
];

export function useContratos() {
  const [contratos, setContratos] = useState<Contrato[]>(mockContratos);
  const [templates, setTemplates] = useState<ContractTemplate[]>(mockTemplates);
  const [filtros, setFiltros] = useState<ContratoFilters>({
    busca: "",
    status: "all",
    tipo: "all",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Contratos filtrados
  const contratosFiltrados = useMemo(() => {
    let filtered = contratos;

    if (filtros.busca) {
      const searchTerm = filtros.busca.toLowerCase();
      filtered = filtered.filter(
        (contrato) =>
          contrato.titulo.toLowerCase().includes(searchTerm) ||
          contrato.cliente.nome.toLowerCase().includes(searchTerm) ||
          contrato.descricao.toLowerCase().includes(searchTerm),
      );
    }

    if (filtros.status !== "all") {
      filtered = filtered.filter(
        (contrato) => contrato.status === filtros.status,
      );
    }

    if (filtros.tipo !== "all") {
      filtered = filtered.filter((contrato) => contrato.tipo === filtros.tipo);
    }

    if (filtros.clienteId) {
      filtered = filtered.filter(
        (contrato) => contrato.cliente.id === filtros.clienteId,
      );
    }

    if (filtros.advogadoId) {
      filtered = filtered.filter(
        (contrato) => contrato.advogado.id === filtros.advogadoId,
      );
    }

    return filtered;
  }, [contratos, filtros]);

  // Estatísticas
  const stats: ContratoStats = useMemo(() => {
    const total = contratos.length;
    const ativos = contratos.filter((c) => c.status === "ativo").length;
    const pendentesAssinatura = contratos.filter(
      (c) => c.status === "aguardando_assinatura",
    ).length;
    const vencidos = contratos.filter((c) => c.status === "vencido").length;
    const receitaMensal = contratos
      .filter((c) => c.status === "ativo")
      .reduce((sum, c) => sum + c.valor, 0);
    const stripeIntegrados = contratos.filter(
      (c) => c.stripeConfig?.habilitado,
    ).length;
    const riskScoreMedio =
      contratos.reduce((sum, c) => sum + (c.aiInsights?.riskScore || 0), 0) /
      contratos.length;

    return {
      total,
      ativos,
      pendentesAssinatura,
      vencidos,
      receitaMensal,
      stripeIntegrados,
      riskScoreMedio: Math.round(riskScoreMedio),
    };
  }, [contratos]);

  // Criar contrato
  const criarContrato = useCallback(
    async (dadosContrato: Partial<Contrato>) => {
      setLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simular API

        const novoContrato: Contrato = {
          id: `cont-${Date.now()}`,
          titulo: dadosContrato.titulo || "",
          descricao: dadosContrato.descricao || "",
          cliente: dadosContrato.cliente!,
          advogado: dadosContrato.advogado!,
          tipo: dadosContrato.tipo || "prestacao_servicos",
          status: "rascunho",
          valor: dadosContrato.valor || 0,
          tipoPagamento: dadosContrato.tipoPagamento || "mensal",
          dataInicio:
            dadosContrato.dataInicio || new Date().toISOString().split("T")[0],
          assinaturas: {
            cliente: false,
            advogado: false,
          },
          clausulas: dadosContrato.clausulas || [],
          anexos: [],
          processosRelacionados: [],
          configFaturamento: dadosContrato.configFaturamento || {
            frequencia: "mensal",
            diaVencimento: 10,
            multaAtraso: 2,
            jurosAtraso: 1,
            diasLembrete: [7, 3, 1],
          },
          versao: 1,
          criadoEm: new Date().toISOString(),
          atualizadoEm: new Date().toISOString(),
        };

        setContratos((prev) => [...prev, novoContrato]);
        toast.success("Contrato criado com sucesso!");

        return novoContrato;
      } catch (error) {
        setError("Erro ao criar contrato");
        toast.error("Erro ao criar contrato");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Atualizar contrato
  const atualizarContrato = useCallback(
    async (id: string, dadosAtualizados: Partial<Contrato>) => {
      setLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 800));

        setContratos((prev) =>
          prev.map((contrato) =>
            contrato.id === id
              ? {
                  ...contrato,
                  ...dadosAtualizados,
                  atualizadoEm: new Date().toISOString(),
                  versao: contrato.versao + 1,
                }
              : contrato,
          ),
        );

        toast.success("Contrato atualizado com sucesso!");
      } catch (error) {
        setError("Erro ao atualizar contrato");
        toast.error("Erro ao atualizar contrato");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Excluir contrato
  const excluirContrato = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setContratos((prev) => prev.filter((contrato) => contrato.id !== id));
      toast.success("Contrato excluído com sucesso!");
    } catch (error) {
      setError("Erro ao excluir contrato");
      toast.error("Erro ao excluir contrato");
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar contrato por ID
  const buscarContratoPorId = useCallback(
    (id: string) => {
      return contratos.find((contrato) => contrato.id === id) || null;
    },
    [contratos],
  );

  // Atualizar filtros
  const atualizarFiltros = useCallback(
    (novosFiltros: Partial<ContratoFilters>) => {
      setFiltros((prev) => ({ ...prev, ...novosFiltros }));
    },
    [],
  );

  // Limpar filtros
  const limparFiltros = useCallback(() => {
    setFiltros({
      busca: "",
      status: "all",
      tipo: "all",
    });
  }, []);

  // Análise de IA
  const analisarContratoIA = useCallback(async (contratoId: string) => {
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simular análise IA

      const insights = {
        riskScore: Math.floor(Math.random() * 100),
        recomendacoes: [
          "Contrato estruturado adequadamente",
          "Recomenda-se revisão das cláusulas de pagamento",
          "Cliente com bom histórico de pagamentos",
        ],
        ultimaAnalise: new Date().toISOString(),
      };

      setContratos((prev) =>
        prev.map((contrato) =>
          contrato.id === contratoId
            ? { ...contrato, aiInsights: insights }
            : contrato,
        ),
      );

      toast.success("Análise de IA concluída!");
      return insights;
    } catch (error) {
      toast.error("Erro na análise de IA");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Gerar PDF do contrato
  const gerarPDFContrato = useCallback(async (contratoId: string) => {
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simular geração de PDF
      const pdfUrl = `https://example.com/contratos/${contratoId}.pdf`;

      toast.success("PDF gerado com sucesso!");

      // Simular download
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `contrato-${contratoId}.pdf`;
      link.click();

      return pdfUrl;
    } catch (error) {
      toast.error("Erro ao gerar PDF");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Enviar contrato por email
  const enviarContratoPorEmail = useCallback(
    async (contratoId: string, destinatarios: string[]) => {
      setLoading(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast.success(
          `Contrato enviado para ${destinatarios.length} destinatário(s)!`,
        );
      } catch (error) {
        toast.error("Erro ao enviar contrato");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Configurar Stripe
  const configurarStripe = useCallback(
    async (contratoId: string, stripeConfig: any) => {
      setLoading(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1200));

        setContratos((prev) =>
          prev.map((contrato) =>
            contrato.id === contratoId
              ? { ...contrato, stripeConfig }
              : contrato,
          ),
        );

        toast.success("Configuração Stripe atualizada!");
      } catch (error) {
        toast.error("Erro ao configurar Stripe");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Atualizar status de assinatura
  const atualizarStatusAssinatura = useCallback(
    async (
      contratoId: string,
      tipoAssinatura: "cliente" | "advogado",
      assinado: boolean,
    ) => {
      setLoading(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 800));

        setContratos((prev) =>
          prev.map((contrato) => {
            if (contrato.id === contratoId) {
              const novasAssinaturas = {
                ...contrato.assinaturas,
                [tipoAssinatura]: assinado,
              };

              // Verificar se todas as assinaturas foram coletadas
              const todasAssinadas =
                novasAssinaturas.cliente && novasAssinaturas.advogado;
              const novoStatus = todasAssinadas ? "ativo" : contrato.status;

              return {
                ...contrato,
                assinaturas: novasAssinaturas,
                status: novoStatus,
                dataAssinatura: todasAssinadas
                  ? new Date().toISOString()
                  : contrato.dataAssinatura,
              };
            }
            return contrato;
          }),
        );

        toast.success("Status de assinatura atualizado!");
      } catch (error) {
        toast.error("Erro ao atualizar assinatura");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Criar template
  const criarTemplate = useCallback(
    async (dadosTemplate: Partial<ContractTemplate>) => {
      setLoading(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const novoTemplate: ContractTemplate = {
          id: `tpl-${Date.now()}`,
          nome: dadosTemplate.nome || "",
          descricao: dadosTemplate.descricao || "",
          categoria: dadosTemplate.categoria || "civil",
          clausulasPadrao: dadosTemplate.clausulasPadrao || [],
          camposPersonalizados: dadosTemplate.camposPersonalizados || [],
          conteudo: dadosTemplate.conteudo || "",
        };

        setTemplates((prev) => [...prev, novoTemplate]);
        toast.success("Template criado com sucesso!");

        return novoTemplate;
      } catch (error) {
        toast.error("Erro ao criar template");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    // Dados
    contratos,
    contratosFiltrados,
    templates,
    stats,
    filtros,
    loading,
    error,

    // Ações de contratos
    criarContrato,
    atualizarContrato,
    excluirContrato,
    buscarContratoPorId,

    // Filtros
    atualizarFiltros,
    limparFiltros,

    // Funcionalidades avançadas
    analisarContratoIA,
    gerarPDFContrato,
    enviarContratoPorEmail,
    configurarStripe,
    atualizarStatusAssinatura,

    // Templates
    criarTemplate,
  };
}

export default useContratos;
