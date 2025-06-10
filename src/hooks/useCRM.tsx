import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";

// ===== TYPES =====
export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  documento: string; // CPF ou CNPJ
  tipo: "PF" | "PJ"; // Pessoa Física ou Jurídica
  status: "ativo" | "inativo" | "prospecto" | "novo";
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  responsavel: string; // Advogado responsável
  origem: string; // Como chegou até o escritório
  dataCadastro: Date;
  ultimoContato?: Date;
  valorTotal: number; // Valor total dos contratos/casos
  tags: string[];
  observacoes?: string;
}

export interface Processo {
  id: string;
  numero: string;
  clienteId: string;
  cliente?: Cliente;
  area: string; // Área do direito
  vara: string;
  comarca: string;
  status: "ativo" | "suspenso" | "arquivado" | "finalizado";
  fase: string; // Fase processual atual
  dataDistribuicao: Date;
  dataUltimaMovimentacao?: Date;
  proximaAudiencia?: Date;
  valor: number;
  tipo: "acao" | "defesa" | "recurso" | "execucao";
  prioridade: "baixa" | "media" | "alta" | "urgente";
  responsavel: string;
  observacoes?: string;
  tags: string[];
}

export interface Contrato {
  id: string;
  numero: string;
  clienteId: string;
  cliente?: Cliente;
  tipo: string; // Tipo de contrato
  status: "vigente" | "vencido" | "cancelado" | "renovado";
  dataInicio: Date;
  dataVencimento: Date;
  valor: number;
  modalidadePagamento:
    | "mensal"
    | "trimestral"
    | "semestral"
    | "anual"
    | "unico";
  responsavel: string;
  observacoes?: string;
  clausulas: string[];
  anexos: string[];
}

export interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string;
  status: "pendente" | "em_andamento" | "concluida" | "cancelada";
  prioridade: "baixa" | "media" | "alta" | "urgente";
  dataVencimento?: Date;
  dataConclusao?: Date;
  responsavel: string;
  clienteId?: string;
  processoId?: string;
  contratoId?: string;
  tipo: "geral" | "processual" | "comercial" | "administrativo";
  tags: string[];
}

export type ModuloCRM = "clientes" | "processos" | "contratos" | "tarefas";

export type ViewMode = "lista" | "kanban" | "cards";

export interface FiltrosCRM {
  busca: string;
  status: string;
  responsavel: string;
  dataInicio?: Date;
  dataFim?: Date;
}

export interface EstatisticasCRM {
  clientes: {
    total: number;
    ativos: number;
    novos: number;
    prospectos: number;
  };
  processos: {
    total: number;
    ativos: number;
    finalizados: number;
    urgentes: number;
  };
  contratos: {
    total: number;
    vigentes: number;
    vencidos: number;
    valor_total: number;
  };
  tarefas: {
    total: number;
    pendentes: number;
    concluidas: number;
    atrasadas: number;
  };
}

// ===== MOCK DATA =====
const CLIENTES_MOCK: Cliente[] = [
  {
    id: "1",
    nome: "Maria Silva Santos",
    email: "maria.santos@email.com",
    telefone: "(11) 99999-0001",
    documento: "123.456.789-00",
    tipo: "PF",
    status: "ativo",
    endereco: {
      logradouro: "Rua das Flores",
      numero: "123",
      complemento: "Apto 45",
      bairro: "Centro",
      cidade: "São Paulo",
      uf: "SP",
      cep: "01234-567",
    },
    responsavel: "Dr. João Silva",
    origem: "Indicação",
    dataCadastro: new Date("2024-01-15"),
    ultimoContato: new Date("2024-01-20"),
    valorTotal: 25000,
    tags: ["VIP", "Família"],
    observacoes: "Cliente muito solícito e pontual nos pagamentos.",
  },
  {
    id: "2",
    nome: "Empresa ABC Ltda",
    email: "contato@empresaabc.com",
    telefone: "(11) 99999-0002",
    documento: "12.345.678/0001-90",
    tipo: "PJ",
    status: "ativo",
    endereco: {
      logradouro: "Av. Paulista",
      numero: "1000",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      uf: "SP",
      cep: "01310-100",
    },
    responsavel: "Dra. Ana Costa",
    origem: "Website",
    dataCadastro: new Date("2024-01-10"),
    ultimoContato: new Date("2024-01-18"),
    valorTotal: 85000,
    tags: ["Empresarial", "Contratos"],
  },
  {
    id: "3",
    nome: "Carlos Eduardo Oliveira",
    email: "carlos.oliveira@email.com",
    telefone: "(11) 99999-0003",
    documento: "987.654.321-00",
    tipo: "PF",
    status: "prospecto",
    endereco: {
      logradouro: "Rua Augusta",
      numero: "456",
      bairro: "Consolação",
      cidade: "São Paulo",
      uf: "SP",
      cep: "01305-000",
    },
    responsavel: "Dr. Pedro Santos",
    origem: "Redes Sociais",
    dataCadastro: new Date("2024-01-20"),
    valorTotal: 12000,
    tags: ["Trabalhista"],
  },
];

const PROCESSOS_MOCK: Processo[] = [
  {
    id: "1",
    numero: "1234567-89.2024.8.26.0100",
    clienteId: "1",
    area: "Família",
    vara: "1ª Vara de Família",
    comarca: "São Paulo",
    status: "ativo",
    fase: "Instrução",
    dataDistribuicao: new Date("2024-01-15"),
    dataUltimaMovimentacao: new Date("2024-01-18"),
    proximaAudiencia: new Date("2024-02-15"),
    valor: 15000,
    tipo: "acao",
    prioridade: "media",
    responsavel: "Dr. João Silva",
    tags: ["Divórcio", "Urgente"],
  },
  {
    id: "2",
    numero: "5555555-55.2024.8.26.0300",
    clienteId: "2",
    area: "Empresarial",
    vara: "1ª Vara Empresarial",
    comarca: "São Paulo",
    status: "ativo",
    fase: "Contestação",
    dataDistribuicao: new Date("2024-01-20"),
    dataUltimaMovimentacao: new Date("2024-01-22"),
    valor: 50000,
    tipo: "defesa",
    prioridade: "alta",
    responsavel: "Dra. Ana Costa",
    tags: ["Contrato", "Comercial"],
  },
];

const CONTRATOS_MOCK: Contrato[] = [
  {
    id: "1",
    numero: "CONT-2024-001",
    clienteId: "1",
    tipo: "Honorários Advocatícios",
    status: "vigente",
    dataInicio: new Date("2024-01-15"),
    dataVencimento: new Date("2024-12-31"),
    valor: 25000,
    modalidadePagamento: "mensal",
    responsavel: "Dr. João Silva",
    clausulas: ["Cláusula de confidencialidade", "Cláusula de exclusividade"],
    anexos: ["contrato_assinado.pdf"],
  },
  {
    id: "2",
    numero: "CONT-2024-002",
    clienteId: "2",
    tipo: "Assessoria Jurídica",
    status: "vigente",
    dataInicio: new Date("2024-01-10"),
    dataVencimento: new Date("2024-12-31"),
    valor: 85000,
    modalidadePagamento: "trimestral",
    responsavel: "Dra. Ana Costa",
    clausulas: ["Cláusula de renovação automática"],
    anexos: ["contrato_empresarial.pdf"],
  },
];

const TAREFAS_MOCK: Tarefa[] = [
  {
    id: "1",
    titulo: "Petição inicial - Divórcio",
    descricao: "Elaborar petição inicial para processo de divórcio",
    status: "em_andamento",
    prioridade: "alta",
    dataVencimento: new Date("2024-01-25"),
    responsavel: "Dr. João Silva",
    clienteId: "1",
    processoId: "1",
    tipo: "processual",
    tags: ["Petição", "Família"],
  },
  {
    id: "2",
    titulo: "Análise de contrato comercial",
    descricao: "Revisar e analisar minutas do contrato comercial",
    status: "pendente",
    prioridade: "media",
    dataVencimento: new Date("2024-01-30"),
    responsavel: "Dra. Ana Costa",
    clienteId: "2",
    contratoId: "2",
    tipo: "comercial",
    tags: ["Contrato", "Análise"],
  },
];

// ===== CUSTOM HOOK =====
export const useCRM = () => {
  // ===== STATE =====
  const [clientes, setClientes] = useState<Cliente[]>(CLIENTES_MOCK);
  const [processos, setProcessos] = useState<Processo[]>(PROCESSOS_MOCK);
  const [contratos, setContratos] = useState<Contrato[]>(CONTRATOS_MOCK);
  const [tarefas, setTarefas] = useState<Tarefa[]>(TAREFAS_MOCK);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("lista");
  const [filtros, setFiltros] = useState<FiltrosCRM>({
    busca: "",
    status: "",
    responsavel: "",
  });

  // ===== COMPUTED VALUES =====
  const estatisticas = useMemo<EstatisticasCRM>(() => {
    return {
      clientes: {
        total: clientes.length,
        ativos: clientes.filter((c) => c.status === "ativo").length,
        novos: clientes.filter((c) => c.status === "novo").length,
        prospectos: clientes.filter((c) => c.status === "prospecto").length,
      },
      processos: {
        total: processos.length,
        ativos: processos.filter((p) => p.status === "ativo").length,
        finalizados: processos.filter((p) => p.status === "finalizado").length,
        urgentes: processos.filter((p) => p.prioridade === "urgente").length,
      },
      contratos: {
        total: contratos.length,
        vigentes: contratos.filter((c) => c.status === "vigente").length,
        vencidos: contratos.filter((c) => c.status === "vencido").length,
        valor_total: contratos
          .filter((c) => c.status === "vigente")
          .reduce((sum, c) => sum + c.valor, 0),
      },
      tarefas: {
        total: tarefas.length,
        pendentes: tarefas.filter((t) => t.status === "pendente").length,
        concluidas: tarefas.filter((t) => t.status === "concluida").length,
        atrasadas: tarefas.filter(
          (t) =>
            t.status !== "concluida" &&
            t.dataVencimento &&
            t.dataVencimento < new Date(),
        ).length,
      },
    };
  }, [clientes, processos, contratos, tarefas]);

  // Filtros aplicados
  const clientesFiltrados = useMemo(() => {
    return clientes.filter((cliente) => {
      const matchesBusca =
        !filtros.busca ||
        cliente.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        cliente.email.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        cliente.documento.includes(filtros.busca);

      const matchesStatus =
        !filtros.status || cliente.status === filtros.status;
      const matchesResponsavel =
        !filtros.responsavel || cliente.responsavel === filtros.responsavel;

      return matchesBusca && matchesStatus && matchesResponsavel;
    });
  }, [clientes, filtros]);

  const processosFiltrados = useMemo(() => {
    return processos.filter((processo) => {
      const matchesBusca =
        !filtros.busca ||
        processo.numero.includes(filtros.busca) ||
        processo.area.toLowerCase().includes(filtros.busca.toLowerCase());

      const matchesStatus =
        !filtros.status || processo.status === filtros.status;
      const matchesResponsavel =
        !filtros.responsavel || processo.responsavel === filtros.responsavel;

      return matchesBusca && matchesStatus && matchesResponsavel;
    });
  }, [processos, filtros]);

  const contratosFiltrados = useMemo(() => {
    return contratos.filter((contrato) => {
      const matchesBusca =
        !filtros.busca ||
        contrato.numero.includes(filtros.busca) ||
        contrato.tipo.toLowerCase().includes(filtros.busca.toLowerCase());

      const matchesStatus =
        !filtros.status || contrato.status === filtros.status;
      const matchesResponsavel =
        !filtros.responsavel || contrato.responsavel === filtros.responsavel;

      return matchesBusca && matchesStatus && matchesResponsavel;
    });
  }, [contratos, filtros]);

  const tarefasFiltradas = useMemo(() => {
    return tarefas.filter((tarefa) => {
      const matchesBusca =
        !filtros.busca ||
        tarefa.titulo.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        (tarefa.descricao &&
          tarefa.descricao.toLowerCase().includes(filtros.busca.toLowerCase()));

      const matchesStatus = !filtros.status || tarefa.status === filtros.status;
      const matchesResponsavel =
        !filtros.responsavel || tarefa.responsavel === filtros.responsavel;

      return matchesBusca && matchesStatus && matchesResponsavel;
    });
  }, [tarefas, filtros]);

  // ===== ACTIONS =====
  const atualizarFiltros = useCallback((novosFiltros: Partial<FiltrosCRM>) => {
    setFiltros((prev) => ({ ...prev, ...novosFiltros }));
  }, []);

  // Cliente actions
  const adicionarCliente = useCallback(async (cliente: Omit<Cliente, "id">) => {
    setLoading(true);
    try {
      const novoCliente: Cliente = {
        ...cliente,
        id: Date.now().toString(),
      };
      setClientes((prev) => [...prev, novoCliente]);
      toast.success("Cliente adicionado com sucesso!");
      return novoCliente;
    } catch (error) {
      toast.error("Erro ao adicionar cliente");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const editarCliente = useCallback(
    async (id: string, dadosAtualizados: Partial<Cliente>) => {
      setLoading(true);
      try {
        setClientes((prev) =>
          prev.map((cliente) =>
            cliente.id === id ? { ...cliente, ...dadosAtualizados } : cliente,
          ),
        );
        toast.success("Cliente atualizado com sucesso!");
      } catch (error) {
        toast.error("Erro ao atualizar cliente");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const excluirCliente = useCallback(async (id: string) => {
    setLoading(true);
    try {
      setClientes((prev) => prev.filter((cliente) => cliente.id !== id));
      toast.success("Cliente removido com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover cliente");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Processo actions
  const adicionarProcesso = useCallback(
    async (processo: Omit<Processo, "id">) => {
      setLoading(true);
      try {
        const novoProcesso: Processo = {
          ...processo,
          id: Date.now().toString(),
        };
        setProcessos((prev) => [...prev, novoProcesso]);
        toast.success("Processo adicionado com sucesso!");
        return novoProcesso;
      } catch (error) {
        toast.error("Erro ao adicionar processo");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const editarProcesso = useCallback(
    async (id: string, dadosAtualizados: Partial<Processo>) => {
      setLoading(true);
      try {
        setProcessos((prev) =>
          prev.map((processo) =>
            processo.id === id
              ? { ...processo, ...dadosAtualizados }
              : processo,
          ),
        );
        toast.success("Processo atualizado com sucesso!");
      } catch (error) {
        toast.error("Erro ao atualizar processo");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const excluirProcesso = useCallback(async (id: string) => {
    setLoading(true);
    try {
      setProcessos((prev) => prev.filter((processo) => processo.id !== id));
      toast.success("Processo removido com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover processo");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Contrato actions
  const adicionarContrato = useCallback(
    async (contrato: Omit<Contrato, "id">) => {
      setLoading(true);
      try {
        const novoContrato: Contrato = {
          ...contrato,
          id: Date.now().toString(),
        };
        setContratos((prev) => [...prev, novoContrato]);
        toast.success("Contrato adicionado com sucesso!");
        return novoContrato;
      } catch (error) {
        toast.error("Erro ao adicionar contrato");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const editarContrato = useCallback(
    async (id: string, dadosAtualizados: Partial<Contrato>) => {
      setLoading(true);
      try {
        setContratos((prev) =>
          prev.map((contrato) =>
            contrato.id === id
              ? { ...contrato, ...dadosAtualizados }
              : contrato,
          ),
        );
        toast.success("Contrato atualizado com sucesso!");
      } catch (error) {
        toast.error("Erro ao atualizar contrato");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const excluirContrato = useCallback(async (id: string) => {
    setLoading(true);
    try {
      setContratos((prev) => prev.filter((contrato) => contrato.id !== id));
      toast.success("Contrato removido com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover contrato");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Tarefa actions
  const adicionarTarefa = useCallback(async (tarefa: Omit<Tarefa, "id">) => {
    setLoading(true);
    try {
      const novaTarefa: Tarefa = {
        ...tarefa,
        id: Date.now().toString(),
      };
      setTarefas((prev) => [...prev, novaTarefa]);
      toast.success("Tarefa adicionada com sucesso!");
      return novaTarefa;
    } catch (error) {
      toast.error("Erro ao adicionar tarefa");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const editarTarefa = useCallback(
    async (id: string, dadosAtualizados: Partial<Tarefa>) => {
      setLoading(true);
      try {
        setTarefas((prev) =>
          prev.map((tarefa) =>
            tarefa.id === id ? { ...tarefa, ...dadosAtualizados } : tarefa,
          ),
        );
        toast.success("Tarefa atualizada com sucesso!");
      } catch (error) {
        toast.error("Erro ao atualizar tarefa");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const excluirTarefa = useCallback(async (id: string) => {
    setLoading(true);
    try {
      setTarefas((prev) => prev.filter((tarefa) => tarefa.id !== id));
      toast.success("Tarefa removida com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover tarefa");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Utility functions
  const obterCliente = useCallback(
    (id: string) => {
      return clientes.find((cliente) => cliente.id === id);
    },
    [clientes],
  );

  const obterProcesso = useCallback(
    (id: string) => {
      return processos.find((processo) => processo.id === id);
    },
    [processos],
  );

  const obterContrato = useCallback(
    (id: string) => {
      return contratos.find((contrato) => contrato.id === id);
    },
    [contratos],
  );

  const obterTarefa = useCallback(
    (id: string) => {
      return tarefas.find((tarefa) => tarefa.id === id);
    },
    [tarefas],
  );

  const exportarDados = useCallback(
    async (modulo: ModuloCRM, formato: "csv" | "excel" = "csv") => {
      setLoading(true);
      try {
        let dados: any[] = [];
        let filename = "";

        switch (modulo) {
          case "clientes":
            dados = clientesFiltrados;
            filename = "clientes";
            break;
          case "processos":
            dados = processosFiltrados;
            filename = "processos";
            break;
          case "contratos":
            dados = contratosFiltrados;
            filename = "contratos";
            break;
          case "tarefas":
            dados = tarefasFiltradas;
            filename = "tarefas";
            break;
        }

        // Simular export (em produção, usar uma biblioteca como xlsx)
        const dataStr = JSON.stringify(dados, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filename}_${new Date().toISOString().split("T")[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);

        toast.success(`Dados de ${modulo} exportados com sucesso!`);
      } catch (error) {
        toast.error("Erro ao exportar dados");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [
      clientesFiltrados,
      processosFiltrados,
      contratosFiltrados,
      tarefasFiltradas,
    ],
  );

  // ===== RETURN =====
  return {
    // Data
    clientes,
    processos,
    contratos,
    tarefas,
    estatisticas,

    // Filtered data
    clientesFiltrados,
    processosFiltrados,
    contratosFiltrados,
    tarefasFiltradas,

    // State
    loading,
    viewMode,
    filtros,

    // Actions
    setViewMode,
    atualizarFiltros,

    // Cliente actions
    adicionarCliente,
    editarCliente,
    excluirCliente,
    obterCliente,

    // Processo actions
    adicionarProcesso,
    editarProcesso,
    excluirProcesso,
    obterProcesso,

    // Contrato actions
    adicionarContrato,
    editarContrato,
    excluirContrato,
    obterContrato,

    // Tarefa actions
    adicionarTarefa,
    editarTarefa,
    excluirTarefa,
    obterTarefa,

    // Utilities
    exportarDados,
  };
};

export default useCRM;
