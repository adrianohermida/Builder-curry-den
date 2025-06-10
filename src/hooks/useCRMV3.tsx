/**
 * 🤖 CRM JURÍDICO V3 - HOOK DE ESTADO COM INTELIGÊNCIA CONTEXTUAL
 *
 * Estado centralizado para CRM minimalista com:
 * - Agrupamento automático de registros similares
 * - Insights de performance e sugestões de follow-up
 * - Score dinâmico de engajamento do cliente
 * - Detecção de clientes duplicados
 * - Métricas unificadas em cards deslizantes
 */

import { useState, useEffect, useMemo } from "react";

export type CRMV3Module =
  | "dashboard"
  | "clientes"
  | "processos"
  | "contratos"
  | "tarefas"
  | "financeiro"
  | "documentos";

export type ViewMode = "cards" | "kanban" | "list" | "360";

export type StatusColor =
  | "ativo" // Verde - Clientes ativos
  | "vip" // Dourado - Clientes VIP
  | "prospecto" // Azul - Prospects/Leads
  | "inadimplente" // Vermelho - Inadimplentes
  | "inativo" // Cinza - Inativos
  | "negociacao"; // Laranja - Em negociação

export interface ClienteV3 {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  status: StatusColor;
  scoreEngajamento: number; // 0-100
  ultimaInteracao: Date;
  valorPotencial: number;
  processos: string[];
  contratos: string[];
  tarefas: string[];
  duplicatoPotencial?: string[]; // IDs de possíveis duplicatas
  proximaAcao?: {
    tipo: "follow-up" | "renovacao" | "cobranca" | "reuniao";
    prazo: Date;
    descricao: string;
  };
}

export interface ProcessoV3 {
  id: string;
  numero: string;
  cliente: string;
  titulo: string;
  status: "ativo" | "finalizado" | "suspenso" | "arquivo";
  prioridade: "baixa" | "media" | "alta" | "urgente";
  dataInicio: Date;
  prazoFinal?: Date;
  valor?: number;
  advogadoResponsavel: string;
  proximoPrazo?: Date;
  alertas: number;
}

export interface ContratoV3 {
  id: string;
  numero: string;
  cliente: string;
  tipo: string;
  status: "vigente" | "vencido" | "renovacao" | "cancelado";
  valorMensal: number;
  dataInicio: Date;
  dataVencimento: Date;
  renovacaoAutomatica: boolean;
}

export interface TarefaV3 {
  id: string;
  titulo: string;
  cliente?: string;
  processo?: string;
  tipo: "juridica" | "administrativa" | "comercial" | "follow-up";
  prioridade: "baixa" | "media" | "alta" | "urgente";
  status: "pendente" | "andamento" | "concluida" | "cancelada";
  prazo: Date;
  responsavel: string;
  tempoEstimado?: number; // em horas
}

export interface DashboardStatsV3 {
  clientes: {
    total: number;
    ativos: number;
    vips: number;
    prospects: number;
    inadimplentes: number;
    scoreEngajamentoMedio: number;
    crescimentoMensal: number;
  };
  processos: {
    total: number;
    ativos: number;
    urgentes: number;
    prazoHoje: number;
    taxaSucesso: number;
  };
  contratos: {
    total: number;
    vigentes: number;
    vencendoEm30Dias: number;
    valorMensalTotal: number;
    taxaRenovacao: number;
  };
  tarefas: {
    total: number;
    pendentes: number;
    atrasadas: number;
    concluidasHoje: number;
    produtividade: number;
  };
  financeiro: {
    receitaMensal: number;
    crescimentoMensal: number;
    ticketMedio: number;
    inadimplencia: number;
    projecaoAnual: number;
  };
  documentos: {
    total: number;
    processsados: number;
    pendentes: number;
    classificados: number;
  };
}

export interface AIInsight {
  id: string;
  tipo: "oportunidade" | "risco" | "otimizacao" | "alerta";
  titulo: string;
  descricao: string;
  prioridade: "baixa" | "media" | "alta";
  modulo: CRMV3Module;
  acaoSugerida?: string;
  impactoEstimado?: string;
  dataDeteccao: Date;
}

export interface QuickFilter {
  key: string;
  label: string;
  value: any;
  active: boolean;
  count?: number;
}

export function useCRMV3() {
  const [activeModule, setActiveModule] = useState<CRMV3Module>("dashboard");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [isLoading, setIsLoading] = useState(false);
  const [quickFilters, setQuickFilters] = useState<QuickFilter[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Estados dos dados
  const [clientes, setClientes] = useState<ClienteV3[]>([]);
  const [processos, setProcessos] = useState<ProcessoV3[]>([]);
  const [contratos, setContratos] = useState<ContratoV3[]>([]);
  const [tarefas, setTarefas] = useState<TarefaV3[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);

  // Dados mockados para demonstração
  useEffect(() => {
    const loadMockData = () => {
      setClientes([
        {
          id: "1",
          nome: "João Silva Advocacia",
          email: "joao@silva.adv.br",
          telefone: "(11) 99999-9999",
          empresa: "Silva & Associados",
          status: "vip",
          scoreEngajamento: 95,
          ultimaInteracao: new Date(Date.now() - 86400000), // 1 dia atrás
          valorPotencial: 50000,
          processos: ["proc1", "proc2"],
          contratos: ["cont1"],
          tarefas: ["task1"],
          proximaAcao: {
            tipo: "reuniao",
            prazo: new Date(Date.now() + 604800000), // 7 dias
            descricao: "Reunião de alinhamento estratégico",
          },
        },
        {
          id: "2",
          nome: "Maria Santos",
          email: "maria@santos.com.br",
          telefone: "(11) 88888-8888",
          status: "ativo",
          scoreEngajamento: 78,
          ultimaInteracao: new Date(Date.now() - 432000000), // 5 dias atrás
          valorPotencial: 25000,
          processos: ["proc3"],
          contratos: [],
          tarefas: ["task2"],
          duplicatoPotencial: ["3"], // Possível duplicata
          proximaAcao: {
            tipo: "follow-up",
            prazo: new Date(Date.now() + 259200000), // 3 dias
            descricao: "Acompanhar proposta de honorários",
          },
        },
        {
          id: "3",
          nome: "Maria C. Santos",
          email: "maria.santos@email.com",
          telefone: "(11) 88888-7777",
          status: "prospecto",
          scoreEngajamento: 45,
          ultimaInteracao: new Date(Date.now() - 1209600000), // 14 dias atrás
          valorPotencial: 15000,
          processos: [],
          contratos: [],
          tarefas: [],
          duplicatoPotencial: ["2"], // Possível duplicata
        },
      ]);

      setProcessos([
        {
          id: "proc1",
          numero: "001/2024",
          cliente: "1",
          titulo: "Ação Trabalhista - Horas Extras",
          status: "ativo",
          prioridade: "alta",
          dataInicio: new Date(Date.now() - 2592000000), // 30 dias atrás
          prazoFinal: new Date(Date.now() + 1209600000), // 14 dias
          valor: 50000,
          advogadoResponsavel: "Dr. Carlos",
          proximoPrazo: new Date(Date.now() + 172800000), // 2 dias
          alertas: 1,
        },
        {
          id: "proc2",
          numero: "002/2024",
          cliente: "1",
          titulo: "Revisão Contratual",
          status: "ativo",
          prioridade: "media",
          dataInicio: new Date(Date.now() - 1814400000), // 21 dias atrás
          valor: 25000,
          advogadoResponsavel: "Dra. Ana",
          alertas: 0,
        },
      ]);

      setContratos([
        {
          id: "cont1",
          numero: "CT001/2024",
          cliente: "1",
          tipo: "Consultoria Jurídica Mensal",
          status: "vigente",
          valorMensal: 5000,
          dataInicio: new Date(Date.now() - 7776000000), // 90 dias atrás
          dataVencimento: new Date(Date.now() + 23328000000), // 270 dias
          renovacaoAutomatica: true,
        },
      ]);

      setTarefas([
        {
          id: "task1",
          titulo: "Preparar documentação para audiência",
          cliente: "1",
          processo: "proc1",
          tipo: "juridica",
          prioridade: "alta",
          status: "andamento",
          prazo: new Date(Date.now() + 86400000), // 1 dia
          responsavel: "Dr. Carlos",
          tempoEstimado: 4,
        },
        {
          id: "task2",
          titulo: "Follow-up proposta comercial",
          cliente: "2",
          tipo: "comercial",
          prioridade: "media",
          status: "pendente",
          prazo: new Date(Date.now() + 259200000), // 3 dias
          responsavel: "Equipe Comercial",
          tempoEstimado: 1,
        },
      ]);

      // Gerar insights de IA
      setInsights([
        {
          id: "1",
          tipo: "oportunidade",
          titulo: "Cliente VIP com baixa atividade",
          descricao:
            "João Silva não tem novas tarefas há 7 dias. Considere um follow-up proativo.",
          prioridade: "media",
          modulo: "clientes",
          acaoSugerida: "Agendar reunião de check-in",
          impactoEstimado: "Manter engajamento de cliente VIP",
          dataDeteccao: new Date(),
        },
        {
          id: "2",
          tipo: "risco",
          titulo: "Possíveis clientes duplicados detectados",
          descricao:
            "Maria Santos e Maria C. Santos parecem ser a mesma pessoa.",
          prioridade: "alta",
          modulo: "clientes",
          acaoSugerida: "Revisar e unificar registros",
          impactoEstimado: "Evitar comunicação duplicada",
          dataDeteccao: new Date(),
        },
        {
          id: "3",
          tipo: "alerta",
          titulo: "Prazo processual se aproximando",
          descricao: "Processo 001/2024 tem prazo crítico em 2 dias.",
          prioridade: "alta",
          modulo: "processos",
          acaoSugerida: "Verificar status da documentação",
          dataDeteccao: new Date(),
        },
      ]);
    };

    loadMockData();
  }, []);

  // Estatísticas calculadas dinamicamente
  const dashboardStats: DashboardStatsV3 = useMemo(() => {
    const activeClientes = clientes.filter((c) => c.status === "ativo").length;
    const vipClientes = clientes.filter((c) => c.status === "vip").length;
    const prospectClientes = clientes.filter(
      (c) => c.status === "prospecto",
    ).length;
    const inadimplenteClientes = clientes.filter(
      (c) => c.status === "inadimplente",
    ).length;

    const scoreEngajamentoMedio =
      clientes.length > 0
        ? clientes.reduce((acc, c) => acc + c.scoreEngajamento, 0) /
          clientes.length
        : 0;

    const processosAtivos = processos.filter(
      (p) => p.status === "ativo",
    ).length;
    const processosUrgentes = processos.filter(
      (p) => p.prioridade === "urgente",
    ).length;
    const processosPrazoHoje = processos.filter(
      (p) =>
        p.proximoPrazo && p.proximoPrazo <= new Date(Date.now() + 86400000),
    ).length;

    const contratosVigentes = contratos.filter(
      (c) => c.status === "vigente",
    ).length;
    const valorMensalTotal = contratos
      .filter((c) => c.status === "vigente")
      .reduce((acc, c) => acc + c.valorMensal, 0);

    const tarefasPendentes = tarefas.filter(
      (t) => t.status === "pendente",
    ).length;
    const tarefasAtrasadas = tarefas.filter(
      (t) => t.status !== "concluida" && t.prazo < new Date(),
    ).length;

    return {
      clientes: {
        total: clientes.length,
        ativos: activeClientes,
        vips: vipClientes,
        prospects: prospectClientes,
        inadimplentes: inadimplenteClientes,
        scoreEngajamentoMedio: Math.round(scoreEngajamentoMedio),
        crescimentoMensal: 12, // Mock
      },
      processos: {
        total: processos.length,
        ativos: processosAtivos,
        urgentes: processosUrgentes,
        prazoHoje: processosPrazoHoje,
        taxaSucesso: 85, // Mock
      },
      contratos: {
        total: contratos.length,
        vigentes: contratosVigentes,
        vencendoEm30Dias: 2, // Mock
        valorMensalTotal,
        taxaRenovacao: 92, // Mock
      },
      tarefas: {
        total: tarefas.length,
        pendentes: tarefasPendentes,
        atrasadas: tarefasAtrasadas,
        concluidasHoje: 3, // Mock
        produtividade: 87, // Mock
      },
      financeiro: {
        receitaMensal: valorMensalTotal,
        crescimentoMensal: 8.5, // Mock
        ticketMedio: valorMensalTotal / Math.max(contratosVigentes, 1),
        inadimplencia: 2.3, // Mock
        projecaoAnual: valorMensalTotal * 12 * 1.15, // Mock
      },
      documentos: {
        total: 1247, // Mock
        processsados: 1198, // Mock
        pendentes: 49, // Mock
        classificados: 1150, // Mock
      },
    };
  }, [clientes, processos, contratos, tarefas]);

  // Funções de filtros rápidos
  const initializeQuickFilters = (module: CRMV3Module) => {
    const filters: QuickFilter[] = [];

    switch (module) {
      case "clientes":
        filters.push(
          {
            key: "vip",
            label: "VIP",
            value: "vip",
            active: false,
            count: dashboardStats.clientes.vips,
          },
          {
            key: "ativo",
            label: "Ativo",
            value: "ativo",
            active: false,
            count: dashboardStats.clientes.ativos,
          },
          {
            key: "prospecto",
            label: "Prospect",
            value: "prospecto",
            active: false,
            count: dashboardStats.clientes.prospects,
          },
          {
            key: "inadimplente",
            label: "Inadimplente",
            value: "inadimplente",
            active: false,
            count: dashboardStats.clientes.inadimplentes,
          },
        );
        break;
      case "processos":
        filters.push(
          { key: "ativo", label: "Ativo", value: "ativo", active: false },
          {
            key: "urgente",
            label: "Urgente",
            value: "urgente",
            active: false,
            count: dashboardStats.processos.urgentes,
          },
          {
            key: "prazo-hoje",
            label: "Prazo Hoje",
            value: "prazo-hoje",
            active: false,
            count: dashboardStats.processos.prazoHoje,
          },
        );
        break;
      case "tarefas":
        filters.push(
          {
            key: "pendente",
            label: "Pendente",
            value: "pendente",
            active: false,
            count: dashboardStats.tarefas.pendentes,
          },
          {
            key: "atrasada",
            label: "Atrasada",
            value: "atrasada",
            active: false,
            count: dashboardStats.tarefas.atrasadas,
          },
          {
            key: "juridica",
            label: "Jurídica",
            value: "juridica",
            active: false,
          },
          {
            key: "comercial",
            label: "Comercial",
            value: "comercial",
            active: false,
          },
        );
        break;
    }

    setQuickFilters(filters);
  };

  const toggleQuickFilter = (key: string) => {
    setQuickFilters((filters) =>
      filters.map((f) => (f.key === key ? { ...f, active: !f.active } : f)),
    );
  };

  const clearAllFilters = () => {
    setQuickFilters((filters) => filters.map((f) => ({ ...f, active: false })));
    setSearchQuery("");
  };

  // Detecção de duplicatas
  const detectDuplicates = (clientes: ClienteV3[]): string[][] => {
    const duplicates: string[][] = [];

    for (let i = 0; i < clientes.length; i++) {
      for (let j = i + 1; j < clientes.length; j++) {
        const similarity = calculateSimilarity(clientes[i], clientes[j]);
        if (similarity > 0.8) {
          duplicates.push([clientes[i].id, clientes[j].id]);
        }
      }
    }

    return duplicates;
  };

  const calculateSimilarity = (
    cliente1: ClienteV3,
    cliente2: ClienteV3,
  ): number => {
    let score = 0;

    // Comparar nomes (peso 0.4)
    const nameScore = stringSimilarity(cliente1.nome, cliente2.nome);
    score += nameScore * 0.4;

    // Comparar emails (peso 0.3)
    if (cliente1.email && cliente2.email) {
      const emailScore = stringSimilarity(cliente1.email, cliente2.email);
      score += emailScore * 0.3;
    }

    // Comparar telefones (peso 0.3)
    if (cliente1.telefone && cliente2.telefone) {
      const phoneScore = stringSimilarity(
        cliente1.telefone.replace(/\D/g, ""),
        cliente2.telefone.replace(/\D/g, ""),
      );
      score += phoneScore * 0.3;
    }

    return score;
  };

  const stringSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const distance = levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  };

  // Calcular score de engajamento
  const calculateEngagementScore = (cliente: ClienteV3): number => {
    let score = 0;

    // Última interação (peso 30%)
    const daysSinceLastInteraction = Math.floor(
      (Date.now() - cliente.ultimaInteracao.getTime()) / (1000 * 60 * 60 * 24),
    );
    const interactionScore = Math.max(0, 100 - daysSinceLastInteraction * 10);
    score += interactionScore * 0.3;

    // Número de processos ativos (peso 25%)
    const processosAtivos = cliente.processos.length;
    const processScore = Math.min(100, processosAtivos * 25);
    score += processScore * 0.25;

    // Contratos vigentes (peso 25%)
    const contratosAtivos = cliente.contratos.length;
    const contratoScore = Math.min(100, contratosAtivos * 50);
    score += contratoScore * 0.25;

    // Valor potencial (peso 20%)
    const valorScore = Math.min(100, (cliente.valorPotencial / 1000) * 2);
    score += valorScore * 0.2;

    return Math.round(score);
  };

  // Atualizar módulo ativo e inicializar filtros
  const changeModule = (module: CRMV3Module) => {
    setActiveModule(module);
    initializeQuickFilters(module);
  };

  return {
    // Estado
    activeModule,
    viewMode,
    isLoading,
    searchQuery,
    quickFilters,

    // Dados
    clientes,
    processos,
    contratos,
    tarefas,
    insights,
    dashboardStats,

    // Ações
    setActiveModule: changeModule,
    setViewMode,
    setSearchQuery,
    toggleQuickFilter,
    clearAllFilters,

    // Funções AI
    detectDuplicates,
    calculateEngagementScore,

    // Utilitários
    getStatusColor: (status: StatusColor) => {
      const colors = {
        ativo: "text-green-700 bg-green-50 border-green-200",
        vip: "text-amber-700 bg-amber-50 border-amber-200",
        prospecto: "text-blue-700 bg-blue-50 border-blue-200",
        inadimplente: "text-red-700 bg-red-50 border-red-200",
        inativo: "text-gray-700 bg-gray-50 border-gray-200",
        negociacao: "text-orange-700 bg-orange-50 border-orange-200",
      };
      return colors[status] || colors.ativo;
    },

    getPriorityColor: (priority: "baixa" | "media" | "alta" | "urgente") => {
      const colors = {
        baixa: "text-gray-600 bg-gray-100",
        media: "text-blue-600 bg-blue-100",
        alta: "text-orange-600 bg-orange-100",
        urgente: "text-red-600 bg-red-100",
      };
      return colors[priority];
    },
  };
}
