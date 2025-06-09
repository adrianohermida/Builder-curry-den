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
  // Campos adicionais para funcionalidades avançadas
  prioridade?: "baixa" | "media" | "alta" | "critica";
  instancia?: "primeira" | "segunda" | "superior" | "supremo";
  rito?: "comum" | "sumario" | "sumarissimo" | "especial";
  segredoJustica?: boolean;
  valorCausa?: number;
  custas?: number;
  honorarios?: number;
  enderecoTribunal?: string;
  telefoneCartorio?: string;
  emailCartorio?: string;
  numeroDistribuicao?: string;
  classeJudicial?: string;
  competencia?: string;
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
export type ModuloCRM = "clientes" | "processos" | "contratos" | "agenda";

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

// Dados mock expandidos para desenvolvimento
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
    valorTotal: 45000,
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
    valorTotal: 280000,
    tags: ["Corporativo", "Premium"],
    responsavel: "Dra. Ana Costa",
    origem: "Marketing Digital",
  },
  {
    id: "cli-003",
    nome: "Maria Santos",
    documento: "987.654.321-00",
    tipo: "PF",
    email: "maria@email.com",
    telefone: "(11) 99999-0003",
    endereco: {
      cep: "04567-890",
      logradouro: "Rua dos Trabalhadores",
      numero: "456",
      bairro: "Vila Madalena",
      cidade: "São Paulo",
      uf: "SP",
    },
    status: "prospecto",
    dataCadastro: new Date("2024-01-22"),
    valorTotal: 25000,
    tags: ["Trabalhista", "Novo"],
    responsavel: "Dr. Carlos Silva",
    origem: "Site",
  },
  {
    id: "cli-004",
    nome: "Carlos Pereira",
    documento: "456.789.123-00",
    tipo: "PF",
    email: "carlos@email.com",
    telefone: "(11) 99999-0004",
    endereco: {
      cep: "02468-135",
      logradouro: "Av. Brasil",
      numero: "789",
      bairro: "Liberdade",
      cidade: "São Paulo",
      uf: "SP",
    },
    status: "ativo",
    dataCadastro: new Date("2023-12-10"),
    valorTotal: 65000,
    tags: ["Criminal", "Complexo"],
    responsavel: "Dra. Maria Oliveira",
    origem: "Indicação",
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
    tribunal: "TJSP - Tribunal de Justiça de São Paulo",
    vara: "1ª Vara de Família",
    assunto: "Divórcio consensual com partilha de bens",
    observacoes:
      "Cliente solicitou celeridade no processo. Documentos completos.",
    tags: ["Urgente", "Consensual"],
    proximaAudiencia: new Date("2024-02-15T14:00:00"),
    risco: "baixo",
    prioridade: "alta",
    instancia: "primeira",
    rito: "comum",
    segredoJustica: false,
    valorCausa: 450000,
    custas: 2500,
    honorarios: 15000,
    enderecoTribunal: "Praça da Sé, s/n - Centro, São Paulo - SP",
    telefoneCartorio: "(11) 3241-5000",
    emailCartorio: "1varafamilia@tjsp.jus.br",
    numeroDistribuicao: "2024-0100-15",
    classeJudicial: "Ação de Divórcio",
    competencia: "Direito de Família",
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
    tribunal: "TRT-2 - Tribunal Regional do Trabalho 2ª Região",
    vara: "5ª Vara do Trabalho",
    assunto: "Ação trabalhista - Horas extras e adicional noturno",
    observacoes:
      "Reclamação de ex-funcionário. Empresa contesta valores. Audiência de conciliação marcada.",
    tags: ["Complexo", "Alto Valor", "Conciliação"],
    proximaAudiencia: new Date("2024-02-20T09:30:00"),
    risco: "alto",
    prioridade: "critica",
    instancia: "primeira",
    rito: "sumarissimo",
    segredoJustica: false,
    valorCausa: 350000,
    custas: 8500,
    honorarios: 80000,
    enderecoTribunal:
      "Rua Doutor Villa Nova, 168 - Vila Buarque, São Paulo - SP",
    telefoneCartorio: "(11) 3150-7000",
    emailCartorio: "5varatra@trt2.jus.br",
    numeroDistribuicao: "2024-0200-10",
    classeJudicial: "Reclamação Trabalhista",
    competencia: "Direito do Trabalho",
  },
  {
    id: "proc-003",
    numero: "5555555-55.2024.8.26.0300",
    clienteId: "cli-003",
    cliente: "Maria Santos",
    area: "Trabalhista",
    status: "suspenso",
    valor: 25000,
    dataInicio: new Date("2024-01-22"),
    responsavel: "Dr. Carlos Silva",
    tribunal: "TRT-2 - Tribunal Regional do Trabalho 2ª Região",
    vara: "12ª Vara do Trabalho",
    assunto: "Rescisão indireta por assédio moral",
    observacoes:
      "Processo suspenso para perícia psicológica. Aguardando nomeação de perito.",
    tags: ["Assédio", "Perícia", "Suspenso"],
    risco: "medio",
    prioridade: "media",
    instancia: "primeira",
    rito: "comum",
    segredoJustica: true,
    valorCausa: 180000,
    custas: 3200,
    honorarios: 25000,
    enderecoTribunal:
      "Rua Doutor Villa Nova, 168 - Vila Buarque, São Paulo - SP",
    telefoneCartorio: "(11) 3150-7012",
    emailCartorio: "12varatra@trt2.jus.br",
    numeroDistribuicao: "2024-0300-22",
    classeJudicial: "Ação Ordinária Trabalhista",
    competencia: "Direito do Trabalho",
  },
  {
    id: "proc-004",
    numero: "7777777-77.2023.8.26.0400",
    clienteId: "cli-004",
    cliente: "Carlos Pereira",
    area: "Criminal",
    status: "encerrado",
    valor: 50000,
    dataInicio: new Date("2023-12-10"),
    dataEncerramento: new Date("2024-01-25"),
    responsavel: "Dra. Maria Oliveira",
    tribunal: "TJSP - Tribunal de Justiça de São Paulo",
    vara: "3ª Vara Criminal",
    assunto: "Ação penal - Crimes contra a honra",
    observacoes:
      "Processo encerrado com sentença favorável ao cliente. Réu condenado.",
    tags: ["Encerrado", "Vitória", "Honra"],
    risco: "baixo",
    prioridade: "baixa",
    instancia: "primeira",
    rito: "comum",
    segredoJustica: false,
    valorCausa: 75000,
    custas: 4500,
    honorarios: 50000,
    enderecoTribunal: "Praça da Sé, s/n - Centro, São Paulo - SP",
    telefoneCartorio: "(11) 3241-5003",
    emailCartorio: "3varacriminal@tjsp.jus.br",
    numeroDistribuicao: "2023-0400-10",
    classeJudicial: "Ação Penal",
    competencia: "Direito Criminal",
  },
  {
    id: "proc-005",
    numero: "3333333-33.2024.8.26.0500",
    clienteId: "cli-001",
    cliente: "João Silva",
    area: "Cível",
    status: "arquivado",
    valor: 30000,
    dataInicio: new Date("2024-01-05"),
    responsavel: "Dr. Pedro Santos",
    tribunal: "TJSP - Tribunal de Justiça de São Paulo",
    vara: "8ª Vara Cível",
    assunto: "Ação de cobrança - Contrato de prestação de serviços",
    observacoes: "Processo arquivado por acordo extrajudicial entre as partes.",
    tags: ["Acordo", "Arquivado", "Cobrança"],
    risco: "baixo",
    prioridade: "baixa",
    instancia: "primeira",
    rito: "comum",
    segredoJustica: false,
    valorCausa: 120000,
    custas: 2800,
    honorarios: 30000,
    enderecoTribunal: "Praça da Sé, s/n - Centro, São Paulo - SP",
    telefoneCartorio: "(11) 3241-5008",
    emailCartorio: "8varacivel@tjsp.jus.br",
    numeroDistribuicao: "2024-0500-05",
    classeJudicial: "Ação de Cobrança",
    competencia: "Direito Civil",
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
    valor: 45000,
    dataInicio: new Date("2024-01-15"),
    dataVencimento: new Date("2024-12-31"),
    responsavel: "Dr. Pedro Santos",
    clausulas: [
      "Pagamento em 12 parcelas mensais",
      "Reajuste anual pelo IPCA",
      "Foro da comarca de São Paulo",
    ],
    tags: ["Mensal", "PF", "Família"],
    observacoes: "Contrato padrão para pessoa física. Cliente preferencial.",
  },
  {
    id: "cont-002",
    numero: "CONT-2024-002",
    clienteId: "cli-002",
    cliente: "Empresa XYZ Ltda",
    tipo: "Assessoria Jurídica",
    status: "vigente",
    valor: 280000,
    dataInicio: new Date("2024-01-10"),
    dataVencimento: new Date("2025-01-09"),
    responsavel: "Dra. Ana Costa",
    clausulas: [
      "Pagamento trimestral",
      "Inclui consultoria trabalhista",
      "Atendimento 24/7 para emergências",
      "Relatórios mensais de atividades",
    ],
    tags: ["Trimestral", "PJ", "Premium"],
    observacoes:
      "Contrato corporativo. Inclui todos os serviços do escritório.",
  },
];

export function useCRM(): UseCRMReturn {
  // Estado principal
  const [moduloAtivo, setModuloAtivo] = useState<ModuloCRM>("processos");
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
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

  // Função para simular delay de API
  const simulateApiDelay = () =>
    new Promise((resolve) => setTimeout(resolve, 1000));

  // Ações para clientes
  const adicionarCliente = useCallback(
    async (novoCliente: Omit<Cliente, "id" | "dataCadastro">) => {
      try {
        setLoading(true);
        await simulateApiDelay();

        const cliente: Cliente = {
          ...novoCliente,
          id: `cli-${Date.now()}`,
          dataCadastro: new Date(),
        };
        setClientes((prev) => [...prev, cliente]);
        toast.success("Cliente adicionado com sucesso!");
      } catch (error) {
        toast.error("Erro ao adicionar cliente");
        throw error;
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
        await simulateApiDelay();

        setClientes((prev) =>
          prev.map((cliente) =>
            cliente.id === id ? { ...cliente, ...dados } : cliente,
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
    try {
      setLoading(true);
      await simulateApiDelay();

      setClientes((prev) => prev.filter((cliente) => cliente.id !== id));
      toast.success("Cliente excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir cliente");
      throw error;
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
        await simulateApiDelay();

        const processo: Processo = {
          ...novoProcesso,
          id: `proc-${Date.now()}`,
        };
        setProcessos((prev) => [...prev, processo]);
        toast.success("Processo adicionado com sucesso!");
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
    async (id: string, dados: Partial<Processo>) => {
      try {
        setLoading(true);
        await simulateApiDelay();

        setProcessos((prev) =>
          prev.map((processo) =>
            processo.id === id ? { ...processo, ...dados } : processo,
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
    try {
      setLoading(true);
      await simulateApiDelay();

      setProcessos((prev) => prev.filter((processo) => processo.id !== id));
      toast.success("Processo excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir processo");
      throw error;
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
      await simulateApiDelay();

      // Simular importação - em produção seria feito parse do arquivo
      const novosProcessos: Processo[] = [
        {
          id: `proc-import-${Date.now()}`,
          numero: "1111111-11.2024.8.26.0999",
          clienteId: "cli-001",
          cliente: "Cliente Importado",
          area: "Cível",
          status: "ativo",
          valor: 20000,
          dataInicio: new Date(),
          responsavel: "Dr. Pedro Santos",
          tribunal: "TJSP",
          vara: "1ª Vara Cível",
          assunto: "Processo importado via planilha",
          tags: ["Importado"],
          risco: "baixo",
        },
      ];

      setProcessos((prev) => [...prev, ...novosProcessos]);
      toast.success(
        `${novosProcessos.length} processos importados com sucesso!`,
      );
    } catch (error) {
      toast.error("Erro ao importar processos");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Ações para contratos
  const adicionarContrato = useCallback(
    async (novoContrato: Omit<Contrato, "id">) => {
      try {
        setLoading(true);
        await simulateApiDelay();

        const contrato: Contrato = {
          ...novoContrato,
          id: `cont-${Date.now()}`,
        };
        setContratos((prev) => [...prev, contrato]);
        toast.success("Contrato adicionado com sucesso!");
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
    async (id: string, dados: Partial<Contrato>) => {
      try {
        setLoading(true);
        await simulateApiDelay();

        setContratos((prev) =>
          prev.map((contrato) =>
            contrato.id === id ? { ...contrato, ...dados } : contrato,
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
    try {
      setLoading(true);
      await simulateApiDelay();

      setContratos((prev) => prev.filter((contrato) => contrato.id !== id));
      toast.success("Contrato excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir contrato");
      throw error;
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

  // Gerenciamento de filtros
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

  // Aplicação de filtros
  const aplicarFiltros = useCallback(
    <T extends { [key: string]: any }>(
      items: T[],
      campos: (keyof T)[],
    ): T[] => {
      return items.filter((item) => {
        // Filtro de busca
        if (filtros.busca) {
          const busca = filtros.busca.toLowerCase();
          const matchesBusca = campos.some((campo) => {
            const valor = item[campo];
            if (Array.isArray(valor)) {
              return valor.some((v) => String(v).toLowerCase().includes(busca));
            }
            return String(valor).toLowerCase().includes(busca);
          });
          if (!matchesBusca) return false;
        }

        // Filtro de status
        if (filtros.status && item.status !== filtros.status) {
          return false;
        }

        // Filtro de área (para processos)
        if (filtros.area && item.area && item.area !== filtros.area) {
          return false;
        }

        // Filtro de responsável
        if (filtros.responsavel && item.responsavel !== filtros.responsavel) {
          return false;
        }

        // Filtro de período
        if (filtros.periodo.inicio || filtros.periodo.fim) {
          const dataItem = item.dataInicio || item.dataCadastro;
          if (dataItem) {
            const data = new Date(dataItem);
            if (filtros.periodo.inicio && data < filtros.periodo.inicio) {
              return false;
            }
            if (filtros.periodo.fim && data > filtros.periodo.fim) {
              return false;
            }
          }
        }

        // Filtro de tags
        if (filtros.tags.length > 0 && item.tags) {
          const hasMatchingTag = filtros.tags.some((tag) =>
            item.tags.includes(tag),
          );
          if (!hasMatchingTag) return false;
        }

        return true;
      });
    },
    [filtros],
  );

  // Dados filtrados
  const clientesFiltrados = useMemo(
    () => aplicarFiltros(clientes, ["nome", "email", "documento", "tags"]),
    [clientes, aplicarFiltros],
  );

  const processosFiltrados = useMemo(
    () => aplicarFiltros(processos, ["numero", "cliente", "assunto", "tags"]),
    [processos, aplicarFiltros],
  );

  const contratosFiltrados = useMemo(
    () => aplicarFiltros(contratos, ["numero", "cliente", "tipo", "tags"]),
    [contratos, aplicarFiltros],
  );

  // Exportação de dados
  const exportarDados = useCallback(
    (modulo: ModuloCRM) => {
      const dados = {
        clientes: clientesFiltrados,
        processos: processosFiltrados,
        contratos: contratosFiltrados,
      };

      const dataToExport = dados[modulo];
      const csvContent = convertToCSV(dataToExport);
      downloadCSV(
        csvContent,
        `${modulo}-${new Date().toISOString().split("T")[0]}.csv`,
      );

      toast.success(`Dados de ${modulo} exportados com sucesso!`);
    },
    [clientesFiltrados, processosFiltrados, contratosFiltrados],
  );

  // Utilitários para exportação
  const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return "";

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            if (value === null || value === undefined) return "";
            if (typeof value === "object") return JSON.stringify(value);
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(","),
      ),
    ];

    return csvRows.join("\n");
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Estatísticas
  const estatisticas = useMemo(() => {
    const totalClientes = clientes.length;
    const totalProcessos = processos.length;
    const totalContratos = contratos.length;
    const receitaTotal = [...processos, ...contratos].reduce(
      (total, item) => total + item.valor,
      0,
    );
    const clientesAtivos = clientes.filter((c) => c.status === "ativo").length;
    const processosAtivos = processos.filter(
      (p) => p.status === "ativo",
    ).length;
    const contratosVigentes = contratos.filter(
      (c) => c.status === "vigente",
    ).length;

    return {
      totalClientes,
      totalProcessos,
      totalContratos,
      receitaTotal,
      clientesAtivos,
      processosAtivos,
      contratosVigentes,
    };
  }, [clientes, processos, contratos]);

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
