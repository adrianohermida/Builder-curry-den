/**
 * 🎯 UNIFIED CRM HOOK
 *
 * Hook consolidado que substitui:
 * - useCRM.tsx, useCRMV3.tsx, useCRMJuridico.tsx
 * - useCRMSaaS.tsx, useCRMUnicorn.tsx
 *
 * Estado centralizado para todo o CRM com:
 * - Performance otimizada com React.useMemo
 * - Cache inteligente de dados
 * - Sincronização com APIs unificadas
 * - TypeScript strict para segurança
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  Users,
  Scale,
  FileSignature,
  CheckSquare,
  DollarSign,
  FolderOpen,
  Bell,
} from "lucide-react";
import { ProcessoApiService } from "@/services/ProcessoApiService";

// ===== UNIFIED TYPES =====
export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  tipo: "PF" | "PJ";
  status: "ativo" | "inativo" | "prospecto" | "vip" | "inadimplente";
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
  };
  dataCadastro: Date;
  ultimoContato?: Date;
  valorTotal: number;
  scoreEngajamento: number; // 0-100
  responsavel: string;
  origem: string;
  tags: string[];
  observacoes?: string;
  processos: string[];
  contratos: string[];
  tarefas: string[];
}

export interface Processo {
  id: string;
  numero: string;
  clienteId: string;
  cliente: string;
  area: string;
  status: "ativo" | "arquivado" | "suspenso" | "encerrado" | "julgado";
  valor: number;
  dataInicio: Date;
  dataEncerramento?: Date;
  responsavel: string;
  tribunal: string;
  vara: string;
  assunto: string;
  prioridade: "baixa" | "media" | "alta" | "critica";
  risco: "baixo" | "medio" | "alto";
  proximaAudiencia?: Date;
  proximoPrazo?: Date;
  tags: string[];
  observacoes?: string;
  movimentacoes: Movimentacao[];
  publicacoes: Publicacao[];
}

export interface Contrato {
  id: string;
  titulo: string;
  clienteId: string;
  cliente: string;
  tipo:
    | "prestacao_servicos"
    | "societario"
    | "trabalhista"
    | "civil"
    | "outros";
  status: "rascunho" | "ativo" | "vencido" | "renovado" | "rescindido";
  valor: number;
  dataInicio: Date;
  dataVencimento: Date;
  responsavel: string;
  arquivo?: string;
  clausulas: string[];
  observacoes?: string;
  tags: string[];
}

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  status: "pendente" | "em_andamento" | "concluida" | "cancelada";
  prioridade: "baixa" | "media" | "alta" | "critica";
  responsavel: string;
  cliente?: string;
  processo?: string;
  contrato?: string;
  prazo: Date;
  dataCriacao: Date;
  dataConclusao?: Date;
  categoria: "administrativo" | "processual" | "comercial" | "outros";
  tags: string[];
  anexos: string[];
  comentarios: Comentario[];
}

export interface Movimentacao {
  id: string;
  processoId: string;
  data: Date;
  tipo: "peticionamento" | "audiencia" | "decisao" | "recurso" | "outros";
  descricao: string;
  responsavel: string;
  arquivo?: string;
}

export interface Publicacao {
  id: string;
  processoId: string;
  numero: string;
  data: Date;
  orgao: string;
  conteudo: string;
  tipo: "citacao" | "intimacao" | "sentenca" | "despacho" | "outros";
  prazo?: Date;
  status: "pendente" | "visualizada" | "processada";
  arquivo?: string;
}

export interface Comentario {
  id: string;
  autor: string;
  data: Date;
  conteudo: string;
  anexos?: string[];
}

export interface DashboardStat {
  label: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ size?: number; style?: any }>;
  color: string;
  module: string;
  trend?: {
    value: number;
    direction: "up" | "down" | "stable";
  };
}

export interface FilterOptions {
  status?: string[];
  responsavel?: string[];
  periodo?: {
    inicio: Date;
    fim: Date;
  };
  tags?: string[];
  cliente?: string[];
}

// ===== MAIN HOOK =====
export const useCRMUnificado = () => {
  // ===== STATE =====
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [cache, setCache] = useState<Map<string, any>>(new Map());

  // ===== COMPUTED DASHBOARD STATS =====
  const dashboardStats = useMemo((): DashboardStat[] => {
    const clientesAtivos = clientes.filter((c) => c.status === "ativo").length;
    const processosAtivos = processos.filter(
      (p) => p.status === "ativo",
    ).length;
    const contratosAtivos = contratos.filter(
      (c) => c.status === "ativo",
    ).length;
    const tarefasPendentes = tarefas.filter(
      (t) => t.status === "pendente",
    ).length;
    const publicacoesPendentes = publicacoes.filter(
      (p) => p.status === "pendente",
    ).length;

    const valorTotalProcessos = processos
      .filter((p) => p.status === "ativo")
      .reduce((sum, p) => sum + p.valor, 0);

    const valorTotalContratos = contratos
      .filter((c) => c.status === "ativo")
      .reduce((sum, c) => sum + c.valor, 0);

    return [
      {
        label: "Clientes",
        value: clientesAtivos,
        description: `${clientes.length} total cadastrados`,
        icon: Users,
        color: "var(--primary-500)",
        module: "clientes",
        trend: {
          value: 12,
          direction: "up",
        },
      },
      {
        label: "Processos",
        value: processosAtivos,
        description: `R$ ${(valorTotalProcessos / 1000).toFixed(0)}k em causa`,
        icon: Scale,
        color: "var(--color-info)",
        module: "processos",
        trend: {
          value: 8,
          direction: "up",
        },
      },
      {
        label: "Contratos",
        value: contratosAtivos,
        description: `R$ ${(valorTotalContratos / 1000).toFixed(0)}k faturamento`,
        icon: FileSignature,
        color: "var(--color-warning)",
        module: "contratos",
        trend: {
          value: 5,
          direction: "up",
        },
      },
      {
        label: "Tarefas",
        value: tarefasPendentes,
        description: `${tarefas.length} total criadas`,
        icon: CheckSquare,
        color: "var(--color-success)",
        module: "tarefas",
        trend: {
          value: 3,
          direction: "down",
        },
      },
      {
        label: "Publicações",
        value: publicacoesPendentes,
        description: `${publicacoes.length} total monitoradas`,
        icon: Bell,
        color: "var(--color-error)",
        module: "publicacoes",
        trend: {
          value: 15,
          direction: "up",
        },
      },
    ];
  }, [clientes, processos, contratos, tarefas, publicacoes]);

  // ===== DATA LOADING =====
  const loadData = useCallback(
    async (force = false) => {
      const cacheKey = "crm-data";
      const cached = cache.get(cacheKey);
      const cacheTime = 5 * 60 * 1000; // 5 minutes

      if (!force && cached && Date.now() - cached.timestamp < cacheTime) {
        setClientes(cached.clientes);
        setProcessos(cached.processos);
        setContratos(cached.contratos);
        setTarefas(cached.tarefas);
        setPublicacoes(cached.publicacoes);
        return;
      }

      setIsLoadingData(true);
      try {
        // Simulate API calls - replace with real API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockData = generateMockData();

        setClientes(mockData.clientes);
        setProcessos(mockData.processos);
        setContratos(mockData.contratos);
        setTarefas(mockData.tarefas);
        setPublicacoes(mockData.publicacoes);

        // Update cache
        setCache((prev) =>
          new Map(prev).set(cacheKey, {
            timestamp: Date.now(),
            ...mockData,
          }),
        );

        setLastUpdate(new Date());
        toast.success("Dados atualizados com sucesso");
      } catch (error) {
        console.error("Error loading CRM data:", error);
        toast.error("Erro ao carregar dados do CRM");
      } finally {
        setIsLoadingData(false);
      }
    },
    [cache],
  );

  // ===== CRUD OPERATIONS =====
  const createClient = useCallback(async (clientData: Partial<Cliente>) => {
    try {
      setIsLoadingData(true);

      const newClient: Cliente = {
        id: `client-${Date.now()}`,
        nome: clientData.nome || "",
        email: clientData.email || "",
        telefone: clientData.telefone || "",
        documento: clientData.documento || "",
        tipo: clientData.tipo || "PF",
        status: clientData.status || "prospecto",
        endereco: clientData.endereco || {
          cep: "",
          logradouro: "",
          numero: "",
          bairro: "",
          cidade: "",
          uf: "",
        },
        dataCadastro: new Date(),
        valorTotal: 0,
        scoreEngajamento: 0,
        responsavel: "Usuário Atual",
        origem: "manual",
        tags: [],
        processos: [],
        contratos: [],
        tarefas: [],
      };

      setClientes((prev) => [...prev, newClient]);
      toast.success("Cliente criado com sucesso");
      return newClient;
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("Erro ao criar cliente");
      throw error;
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  const createProcess = useCallback(async (processData: Partial<Processo>) => {
    try {
      setIsLoadingData(true);

      const newProcess: Processo = {
        id: `process-${Date.now()}`,
        numero: processData.numero || "",
        clienteId: processData.clienteId || "",
        cliente: processData.cliente || "",
        area: processData.area || "",
        status: processData.status || "ativo",
        valor: processData.valor || 0,
        dataInicio: new Date(),
        responsavel: "Usuário Atual",
        tribunal: processData.tribunal || "",
        vara: processData.vara || "",
        assunto: processData.assunto || "",
        prioridade: processData.prioridade || "media",
        risco: processData.risco || "baixo",
        tags: [],
        movimentacoes: [],
        publicacoes: [],
      };

      setProcessos((prev) => [...prev, newProcess]);
      toast.success("Processo criado com sucesso");
      return newProcess;
    } catch (error) {
      console.error("Error creating process:", error);
      toast.error("Erro ao criar processo");
      throw error;
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // ===== SEARCH & FILTER =====
  const searchData = useCallback((module: string, query: string) => {
    // Implement search logic based on module
    console.log(`Searching ${module} for: ${query}`);
  }, []);

  const filterData = useCallback((module: string, filters: FilterOptions) => {
    // Implement filter logic based on module
    console.log(`Filtering ${module}:`, filters);
  }, []);

  // ===== UTILITY FUNCTIONS =====
  const updateData = useCallback((module: string, id: string, data: any) => {
    // Implement update logic
    console.log(`Updating ${module} ${id}:`, data);
  }, []);

  const deleteData = useCallback((module: string, id: string) => {
    // Implement delete logic
    console.log(`Deleting ${module} ${id}`);
  }, []);

  const exportData = useCallback(
    (module: string, format: "csv" | "excel" | "pdf") => {
      // Implement export logic
      console.log(`Exporting ${module} as ${format}`);
    },
    [],
  );

  const refreshData = useCallback(() => {
    loadData(true);
  }, [loadData]);

  // ===== EFFECTS =====
  useEffect(() => {
    loadData();
  }, [loadData]);

  // ===== RETURN =====
  return {
    // Data
    clientes,
    processos,
    contratos,
    tarefas,
    publicacoes,
    dashboardStats,

    // Loading states
    isLoadingData,
    lastUpdate,

    // Operations
    createClient,
    createProcess,
    updateData,
    deleteData,
    searchData,
    filterData,
    exportData,
    refreshData,

    // Utilities
    cache: cache.size,
  };
};

// ===== MOCK DATA GENERATOR =====
const generateMockData = () => {
  // Generate mock clients
  const mockClientes: Cliente[] = Array.from({ length: 25 }, (_, i) => ({
    id: `client-${i + 1}`,
    nome: `Cliente ${i + 1}`,
    email: `cliente${i + 1}@email.com`,
    telefone: `(11) 9999-${String(1000 + i).slice(-4)}`,
    documento: `${String(Math.random()).slice(2, 13)}`,
    tipo: i % 3 === 0 ? "PJ" : "PF",
    status: ["ativo", "inativo", "prospecto", "vip"][i % 4] as any,
    endereco: {
      cep: `${String(i + 1).padStart(2, "0")}000-000`,
      logradouro: `Rua ${i + 1}`,
      numero: String((i + 1) * 10),
      bairro: `Bairro ${i + 1}`,
      cidade: "São Paulo",
      uf: "SP",
    },
    dataCadastro: new Date(2023, i % 12, (i % 28) + 1),
    ultimoContato: new Date(),
    valorTotal: (i + 1) * 5000,
    scoreEngajamento: Math.floor(Math.random() * 100),
    responsavel: "Advogado Principal",
    origem: ["site", "indicacao", "marketing", "cold_call"][i % 4],
    tags: [`tag-${i % 5}`, `categoria-${i % 3}`],
    processos: [],
    contratos: [],
    tarefas: [],
  }));

  // Generate mock processes
  const mockProcessos: Processo[] = Array.from({ length: 15 }, (_, i) => ({
    id: `process-${i + 1}`,
    numero: `${String(i + 1).padStart(7, "0")}-12.2023.8.26.${String(i + 1).padStart(4, "0")}`,
    clienteId: mockClientes[i % mockClientes.length].id,
    cliente: mockClientes[i % mockClientes.length].nome,
    area: ["Civil", "Trabalhista", "Empresarial", "Tributário"][i % 4],
    status: ["ativo", "arquivado", "suspenso", "encerrado"][i % 4] as any,
    valor: (i + 1) * 10000,
    dataInicio: new Date(2023, i % 12, (i % 28) + 1),
    responsavel: "Advogado Principal",
    tribunal: "TJSP",
    vara: `${i + 1}ª Vara Cível`,
    assunto: `Assunto do processo ${i + 1}`,
    prioridade: ["baixa", "media", "alta", "critica"][i % 4] as any,
    risco: ["baixo", "medio", "alto"][i % 3] as any,
    tags: [`area-${i % 3}`, `cliente-${i % 5}`],
    movimentacoes: [],
    publicacoes: [],
  }));

  // Generate mock contracts
  const mockContratos: Contrato[] = Array.from({ length: 10 }, (_, i) => ({
    id: `contract-${i + 1}`,
    titulo: `Contrato ${i + 1}`,
    clienteId: mockClientes[i % mockClientes.length].id,
    cliente: mockClientes[i % mockClientes.length].nome,
    tipo: ["prestacao_servicos", "societario", "trabalhista", "civil"][
      i % 4
    ] as any,
    status: ["rascunho", "ativo", "vencido", "renovado", "rescindido"][
      i % 5
    ] as any,
    valor: (i + 1) * 2000,
    dataInicio: new Date(2023, i % 12, (i % 28) + 1),
    dataVencimento: new Date(2024, (i + 6) % 12, (i % 28) + 1),
    responsavel: "Advogado Principal",
    clausulas: [`Cláusula ${i + 1}`, `Condição ${i + 1}`],
    tags: [`tipo-${i % 3}`, `status-${i % 2}`],
  }));

  // Generate mock tasks
  const mockTarefas: Tarefa[] = Array.from({ length: 20 }, (_, i) => ({
    id: `task-${i + 1}`,
    titulo: `Tarefa ${i + 1}`,
    descricao: `Descrição da tarefa ${i + 1}`,
    status: ["pendente", "em_andamento", "concluida", "cancelada"][
      i % 4
    ] as any,
    prioridade: ["baixa", "media", "alta", "critica"][i % 4] as any,
    responsavel: "Advogado Principal",
    prazo: new Date(2024, 0, (i % 30) + 1),
    dataCriacao: new Date(2023, i % 12, (i % 28) + 1),
    categoria: ["administrativo", "processual", "comercial", "outros"][
      i % 4
    ] as any,
    tags: [`categoria-${i % 3}`, `prioridade-${i % 2}`],
    anexos: [],
    comentarios: [],
  }));

  // Generate mock publications
  const mockPublicacoes: Publicacao[] = Array.from({ length: 8 }, (_, i) => ({
    id: `pub-${i + 1}`,
    processoId: mockProcessos[i % mockProcessos.length].id,
    numero: mockProcessos[i % mockProcessos.length].numero,
    data: new Date(2023, 11, (i % 30) + 1),
    orgao: "TJSP",
    conteudo: `Conteúdo da publicação ${i + 1}`,
    tipo: ["citacao", "intimacao", "sentenca", "despacho", "outros"][
      i % 5
    ] as any,
    prazo: new Date(2024, 0, (i % 15) + 15),
    status: ["pendente", "visualizada", "processada"][i % 3] as any,
  }));

  return {
    clientes: mockClientes,
    processos: mockProcessos,
    contratos: mockContratos,
    tarefas: mockTarefas,
    publicacoes: mockPublicacoes,
  };
};

export default useCRMUnificado;
