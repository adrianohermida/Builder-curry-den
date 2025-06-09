import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";

export interface Cliente {
  id: string;
  nome: string;
  documento: string;
  tipo: "PF" | "PJ";
  email: string;
  telefone: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
  };
  status: "novo" | "ativo" | "inativo" | "prospecto";
  dataCadastro: Date;
  ultimoContato?: Date;
  valorTotal: number;
  observacoes?: string;
  tags: string[];
  responsavel: string;
  origem: string;
}

export interface Processo {
  id: string;
  numero: string;
  clienteId: string;
  cliente: string;
  area: string;
  status: "ativo" | "arquivado" | "suspenso" | "encerrado";
  valor: number;
  dataInicio: Date;
  dataEncerramento?: Date;
  responsavel: string;
  tribunal: string;
  vara: string;
  assunto: string;
  observacoes?: string;
  tags: string[];
  proximaAudiencia?: Date;
  risco: "baixo" | "medio" | "alto";
}

export interface Contrato {
  id: string;
  numero: string;
  clienteId: string;
  cliente: string;
  tipo: string;
  status: "vigente" | "vencido" | "cancelado" | "suspenso";
  valor: number;
  dataInicio: Date;
  dataVencimento: Date;
  dataRenovacao?: Date;
  responsavel: string;
  arquivo?: string;
  observacoes?: string;
  clausulas: string[];
  tags: string[];
}

export type ViewMode = "lista" | "kanban";
export type ModuloCRM = "clientes" | "processos" | "contratos";

interface UseCRMReturn {
  // Estado
  moduloAtivo: ModuloCRM;
  viewMode: ViewMode;
  clientes: Cliente[];
  processos: Processo[];
  contratos: Contrato[];
  loading: boolean;

  // Filtros
  filtros: {
    busca: string;
    status: string;
    area: string;
    responsavel: string;
    periodo: { inicio?: Date; fim?: Date };
    tags: string[];
  };

  // Ações
  setModuloAtivo: (modulo: ModuloCRM) => void;
  setViewMode: (mode: ViewMode) => void;

  // Clientes
  adicionarCliente: (
    cliente: Omit<Cliente, "id" | "dataCadastro">,
  ) => Promise<void>;
  editarCliente: (id: string, dados: Partial<Cliente>) => Promise<void>;
  excluirCliente: (id: string) => Promise<void>;
  obterCliente: (id: string) => Cliente | undefined;

  // Processos
  adicionarProcesso: (processo: Omit<Processo, "id">) => Promise<void>;
  editarProcesso: (id: string, dados: Partial<Processo>) => Promise<void>;
  excluirProcesso: (id: string) => Promise<void>;
  obterProcesso: (id: string) => Processo | undefined;
  importarProcessos: (arquivo: File) => Promise<void>;

  // Contratos
  adicionarContrato: (contrato: Omit<Contrato, "id">) => Promise<void>;
  editarContrato: (id: string, dados: Partial<Contrato>) => Promise<void>;
  excluirContrato: (id: string) => Promise<void>;
  obterContrato: (id: string) => Contrato | undefined;

  // Filtros
  atualizarFiltros: (novosFiltros: Partial<typeof filtros>) => void;
  limparFiltros: () => void;

  // Dados filtrados
  clientesFiltrados: Cliente[];
  processosFiltrados: Processo[];
  contratosFiltrados: Contrato[];

  // Utilitários
  exportarDados: (modulo: ModuloCRM) => void;
  estatisticas: {
    totalClientes: number;
    totalProcessos: number;
    totalContratos: number;
    receitaTotal: number;
    clientesAtivos: number;
    processosAtivos: number;
    contratosVigentes: number;
  };
}

// Dados mock para desenvolvimento
const clientesMock: Cliente[] = [
  {
    id: "cli-001",
    nome: "João Silva",
    documento: "123.456.789-00",
    tipo: "PF",
    email: "joao@email.com",
    telefone: "(11) 99999-0001",
    endereco: {
      cep: "01234-567",
      logradouro: "Rua das Flores",
      numero: "123",
      bairro: "Centro",
      cidade: "São Paulo",
      uf: "SP",
    },
    status: "ativo",
    dataCadastro: new Date("2024-01-15"),
    ultimoContato: new Date("2024-01-20"),
    valorTotal: 25000,
    tags: ["VIP", "Família"],
    responsavel: "Dr. Pedro Santos",
    origem: "Indicação",
  },
  {
    id: "cli-002",
    nome: "Empresa XYZ Ltda",
    documento: "12.345.678/0001-90",
    tipo: "PJ",
    email: "contato@empresaxyz.com",
    telefone: "(11) 99999-0002",
    endereco: {
      cep: "01234-567",
      logradouro: "Av. Paulista",
      numero: "1000",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      uf: "SP",
    },
    status: "ativo",
    dataCadastro: new Date("2024-01-10"),
    valorTotal: 150000,
    tags: ["Corporativo", "Premium"],
    responsavel: "Dra. Ana Costa",
    origem: "Marketing Digital",
  },
];

const processosMock: Processo[] = [
  {
    id: "proc-001",
    numero: "1234567-89.2024.8.26.0100",
    clienteId: "cli-001",
    cliente: "João Silva",
    area: "Família",
    status: "ativo",
    valor: 15000,
    dataInicio: new Date("2024-01-15"),
    responsavel: "Dr. Pedro Santos",
    tribunal: "TJSP",
    vara: "1ª Vara de Família",
    assunto: "Divórcio consensual",
    tags: ["Urgente", "Consensual"],
    proximaAudiencia: new Date("2024-02-15"),
    risco: "baixo",
  },
  {
    id: "proc-002",
    numero: "9876543-21.2024.8.26.0200",
    clienteId: "cli-002",
    cliente: "Empresa XYZ Ltda",
    area: "Trabalhista",
    status: "ativo",
    valor: 80000,
    dataInicio: new Date("2024-01-10"),
    responsavel: "Dra. Ana Costa",
    tribunal: "TRT-2",
    vara: "5ª Vara do Trabalho",
    assunto: "Ação trabalhista",
    tags: ["Complexo", "Alto Valor"],
    risco: "alto",
  },
];

const contratosMock: Contrato[] = [
  {
    id: "cont-001",
    numero: "CONT-2024-001",
    clienteId: "cli-001",
    cliente: "João Silva",
    tipo: "Honorários",
    status: "vigente",
    valor: 25000,
    dataInicio: new Date("2024-01-15"),
    dataVencimento: new Date("2024-12-31"),
    responsavel: "Dr. Pedro Santos",
    clausulas: ["Pagamento em 12x", "Reajuste anual"],
    tags: ["Mensal", "PF"],
  },
];

export function useCRM(): UseCRMReturn {
  // Estado principal
  const [moduloAtivo, setModuloAtivo] = useState<ModuloCRM>("clientes");
  const [viewMode, setViewMode] = useState<ViewMode>("lista");
  const [loading, setLoading] = useState(false);

  // Dados
  const [clientes, setClientes] = useState<Cliente[]>(clientesMock);
  const [processos, setProcessos] = useState<Processo[]>(processosMock);
  const [contratos, setContratos] = useState<Contrato[]>(contratosMock);

  // Filtros
  const [filtros, setFiltros] = useState({
    busca: "",
    status: "",
    area: "",
    responsavel: "",
    periodo: {
      inicio: undefined as Date | undefined,
      fim: undefined as Date | undefined,
    },
    tags: [] as string[],
  });

  // Ações para clientes
  const adicionarCliente = useCallback(
    async (novoCliente: Omit<Cliente, "id" | "dataCadastro">) => {
      try {
        setLoading(true);
        const cliente: Cliente = {
          ...novoCliente,
          id: `cli-${Date.now()}`,
          dataCadastro: new Date(),
        };
        setClientes((prev) => [...prev, cliente]);
        toast.success("Cliente adicionado com sucesso!");
      } catch (error) {
        toast.error("Erro ao adicionar cliente");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const editarCliente = useCallback(
    async (id: string, dados: Partial<Cliente>) => {
      try {
        setLoading(true);
        setClientes((prev) =>
          prev.map((cliente) =>
            cliente.id === id ? { ...cliente, ...dados } : cliente,
          ),
        );
        toast.success("Cliente atualizado com sucesso!");
      } catch (error) {
        toast.error("Erro ao atualizar cliente");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const excluirCliente = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setClientes((prev) => prev.filter((cliente) => cliente.id !== id));
      toast.success("Cliente excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir cliente");
    } finally {
      setLoading(false);
    }
  }, []);

  const obterCliente = useCallback(
    (id: string) => {
      return clientes.find((cliente) => cliente.id === id);
    },
    [clientes],
  );

  // Ações para processos
  const adicionarProcesso = useCallback(
    async (novoProcesso: Omit<Processo, "id">) => {
      try {
        setLoading(true);
        const processo: Processo = {
          ...novoProcesso,
          id: `proc-${Date.now()}`,
        };
        setProcessos((prev) => [...prev, processo]);
        toast.success("Processo adicionado com sucesso!");
      } catch (error) {
        toast.error("Erro ao adicionar processo");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const editarProcesso = useCallback(
    async (id: string, dados: Partial<Processo>) => {
      try {
        setLoading(true);
        setProcessos((prev) =>
          prev.map((processo) =>
            processo.id === id ? { ...processo, ...dados } : processo,
          ),
        );
        toast.success("Processo atualizado com sucesso!");
      } catch (error) {
        toast.error("Erro ao atualizar processo");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const excluirProcesso = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setProcessos((prev) => prev.filter((processo) => processo.id !== id));
      toast.success("Processo excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir processo");
    } finally {
      setLoading(false);
    }
  }, []);

  const obterProcesso = useCallback(
    (id: string) => {
      return processos.find((processo) => processo.id === id);
    },
    [processos],
  );

  const importarProcessos = useCallback(async (arquivo: File) => {
    try {
      setLoading(true);
      // Simular importação
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Processos importados com sucesso!");
    } catch (error) {
      toast.error("Erro ao importar processos");
    } finally {
      setLoading(false);
    }
  }, []);

  // Ações para contratos
  const adicionarContrato = useCallback(
    async (novoContrato: Omit<Contrato, "id">) => {
      try {
        setLoading(true);
        const contrato: Contrato = {
          ...novoContrato,
          id: `cont-${Date.now()}`,
        };
        setContratos((prev) => [...prev, contrato]);
        toast.success("Contrato adicionado com sucesso!");
      } catch (error) {
        toast.error("Erro ao adicionar contrato");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const editarContrato = useCallback(
    async (id: string, dados: Partial<Contrato>) => {
      try {
        setLoading(true);
        setContratos((prev) =>
          prev.map((contrato) =>
            contrato.id === id ? { ...contrato, ...dados } : contrato,
          ),
        );
        toast.success("Contrato atualizado com sucesso!");
      } catch (error) {
        toast.error("Erro ao atualizar contrato");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const excluirContrato = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setContratos((prev) => prev.filter((contrato) => contrato.id !== id));
      toast.success("Contrato excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir contrato");
    } finally {
      setLoading(false);
    }
  }, []);

  const obterContrato = useCallback(
    (id: string) => {
      return contratos.find((contrato) => contrato.id === id);
    },
    [contratos],
  );

  // Filtros
  const atualizarFiltros = useCallback(
    (novosFiltros: Partial<typeof filtros>) => {
      setFiltros((prev) => ({ ...prev, ...novosFiltros }));
    },
    [],
  );

  const limparFiltros = useCallback(() => {
    setFiltros({
      busca: "",
      status: "",
      area: "",
      responsavel: "",
      periodo: { inicio: undefined, fim: undefined },
      tags: [],
    });
  }, []);

  // Dados filtrados
  const clientesFiltrados = useMemo(() => {
    return clientes.filter((cliente) => {
      if (
        filtros.busca &&
        !cliente.nome.toLowerCase().includes(filtros.busca.toLowerCase()) &&
        !cliente.documento.includes(filtros.busca) &&
        !cliente.email.toLowerCase().includes(filtros.busca.toLowerCase())
      ) {
        return false;
      }
      if (filtros.status && cliente.status !== filtros.status) return false;
      if (filtros.responsavel && cliente.responsavel !== filtros.responsavel)
        return false;
      return true;
    });
  }, [clientes, filtros]);

  const processosFiltrados = useMemo(() => {
    return processos.filter((processo) => {
      if (
        filtros.busca &&
        !processo.numero.includes(filtros.busca) &&
        !processo.cliente.toLowerCase().includes(filtros.busca.toLowerCase()) &&
        !processo.assunto.toLowerCase().includes(filtros.busca.toLowerCase())
      ) {
        return false;
      }
      if (filtros.status && processo.status !== filtros.status) return false;
      if (filtros.area && processo.area !== filtros.area) return false;
      if (filtros.responsavel && processo.responsavel !== filtros.responsavel)
        return false;
      return true;
    });
  }, [processos, filtros]);

  const contratosFiltrados = useMemo(() => {
    return contratos.filter((contrato) => {
      if (
        filtros.busca &&
        !contrato.numero.includes(filtros.busca) &&
        !contrato.cliente.toLowerCase().includes(filtros.busca.toLowerCase()) &&
        !contrato.tipo.toLowerCase().includes(filtros.busca.toLowerCase())
      ) {
        return false;
      }
      if (filtros.status && contrato.status !== filtros.status) return false;
      if (filtros.responsavel && contrato.responsavel !== filtros.responsavel)
        return false;
      return true;
    });
  }, [contratos, filtros]);

  // Exportar dados
  const exportarDados = useCallback((modulo: ModuloCRM) => {
    // Implementar exportação
    toast.success(`Dados de ${modulo} exportados com sucesso!`);
  }, []);

  // Estatísticas
  const estatisticas = useMemo(
    () => ({
      totalClientes: clientes.length,
      totalProcessos: processos.length,
      totalContratos: contratos.length,
      receitaTotal: clientes.reduce(
        (total, cliente) => total + cliente.valorTotal,
        0,
      ),
      clientesAtivos: clientes.filter((c) => c.status === "ativo").length,
      processosAtivos: processos.filter((p) => p.status === "ativo").length,
      contratosVigentes: contratos.filter((c) => c.status === "vigente").length,
    }),
    [clientes, processos, contratos],
  );

  return {
    // Estado
    moduloAtivo,
    viewMode,
    clientes,
    processos,
    contratos,
    loading,

    // Filtros
    filtros,

    // Ações
    setModuloAtivo,
    setViewMode,

    // Clientes
    adicionarCliente,
    editarCliente,
    excluirCliente,
    obterCliente,

    // Processos
    adicionarProcesso,
    editarProcesso,
    excluirProcesso,
    obterProcesso,
    importarProcessos,

    // Contratos
    adicionarContrato,
    editarContrato,
    excluirContrato,
    obterContrato,

    // Filtros
    atualizarFiltros,
    limparFiltros,

    // Dados filtrados
    clientesFiltrados,
    processosFiltrados,
    contratosFiltrados,

    // Utilitários
    exportarDados,
    estatisticas,
  };
}
