/**
 * 🦄 useCRMUnicorn - Hook principal do CRM Unicorn
 *
 * Gerencia o estado global e integração de todos os submódulos
 * Fornece estatísticas consolidadas e notificações centralizadas
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";

// Interfaces consolidadas
interface CRMStats {
  clientes: {
    total: number;
    ativos: number;
    inativos: number;
    vips: number;
    novosUltimoMes: number;
  };
  processos: {
    total: number;
    ativos: number;
    suspensos: number;
    encerrados: number;
    alertasPrazos: number;
  };
  contratos: {
    total: number;
    vigentes: number;
    vencidos: number;
    valorTotal: number;
    receitaMensal: number;
  };
  tarefas: {
    total: number;
    pendentes: number;
    emAndamento: number;
    concluidas: number;
    vencidas: number;
  };
  financeiro: {
    receitaTotal: number;
    receitaMensal: number;
    pendentesValor: number;
    atrasadosValor: number;
    clientesAdimplentes: number;
  };
  ged: {
    totalDocumentos: number;
    totalPastas: number;
    pendentesRevisao: number;
    classificadosIA: number;
    tamanhoTotal: number;
  };
}

interface CRMNotification {
  id: string;
  tipo: "info" | "warning" | "error" | "success";
  titulo: string;
  mensagem: string;
  timestamp: Date;
  modulo: string;
  actionUrl?: string;
  lida: boolean;
}

interface QuickAction {
  id: string;
  titulo: string;
  descricao: string;
  icon: string;
  modulo: string;
  action: () => void;
  priority: "low" | "medium" | "high";
}

interface UseCRMUnicornReturn {
  // Estado
  stats: CRMStats;
  notifications: CRMNotification[];
  quickActions: QuickAction[];
  loading: boolean;
  error: string | null;

  // Ações
  refreshData: () => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  executeQuickAction: (id: string) => void;

  // Configurações
  updateModuleConfig: (module: string, config: any) => void;
  exportAllData: () => void;
  importData: (file: File) => Promise<void>;
}

// Mock data realista
const MOCK_STATS: CRMStats = {
  clientes: {
    total: 342,
    ativos: 298,
    inativos: 44,
    vips: 23,
    novosUltimoMes: 18,
  },
  processos: {
    total: 156,
    ativos: 89,
    suspensos: 12,
    encerrados: 55,
    alertasPrazos: 8,
  },
  contratos: {
    total: 78,
    vigentes: 61,
    vencidos: 17,
    valorTotal: 2850000,
    receitaMensal: 185000,
  },
  tarefas: {
    total: 423,
    pendentes: 67,
    emAndamento: 34,
    concluidas: 298,
    vencidas: 24,
  },
  financeiro: {
    receitaTotal: 8750000,
    receitaMensal: 185000,
    pendentesValor: 125000,
    atrasadosValor: 68000,
    clientesAdimplentes: 287,
  },
  ged: {
    totalDocumentos: 1247,
    totalPastas: 89,
    pendentesRevisao: 15,
    classificadosIA: 892,
    tamanhoTotal: 15.7 * 1024 * 1024 * 1024, // 15.7 GB
  },
};

const MOCK_NOTIFICATIONS: CRMNotification[] = [
  {
    id: "notif-001",
    tipo: "warning",
    titulo: "Prazo processual próximo",
    mensagem: "3 processos com prazos vencendo em 48h",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    modulo: "processos",
    actionUrl: "/crm/processos?filter=prazo_urgente",
    lida: false,
  },
  {
    id: "notif-002",
    tipo: "info",
    titulo: "IA classificou 12 documentos",
    mensagem: "Novos documentos foram classificados automaticamente",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    modulo: "ged",
    actionUrl: "/crm/ged?filter=ia_classified",
    lida: false,
  },
  {
    id: "notif-003",
    tipo: "error",
    titulo: "Pagamento em atraso",
    mensagem: "5 clientes com pagamentos atrasados há mais de 30 dias",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    modulo: "financeiro",
    actionUrl: "/crm/financeiro?filter=atrasados",
    lida: false,
  },
  {
    id: "notif-004",
    tipo: "success",
    titulo: "Contrato renovado automaticamente",
    mensagem: "Contrato da Maria Silva Advocacia foi renovado",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    modulo: "contratos",
    lida: true,
  },
];

const MOCK_QUICK_ACTIONS: QuickAction[] = [
  {
    id: "action-001",
    titulo: "Novo Cliente",
    descricao: "Cadastrar um novo cliente",
    icon: "Users",
    modulo: "clientes",
    action: () => {},
    priority: "medium",
  },
  {
    id: "action-002",
    titulo: "Gerar Cobrança",
    descricao: "Criar nova cobrança via Stripe",
    icon: "DollarSign",
    modulo: "financeiro",
    action: () => {},
    priority: "high",
  },
  {
    id: "action-003",
    titulo: "Upload Documento",
    descricao: "Enviar documentos para o GED",
    icon: "Upload",
    modulo: "ged",
    action: () => {},
    priority: "medium",
  },
  {
    id: "action-004",
    titulo: "Sincronizar Advise",
    descricao: "Atualizar dados processuais",
    icon: "Sync",
    modulo: "processos",
    action: () => {},
    priority: "low",
  },
];

export function useCRMUnicorn(): UseCRMUnicornReturn {
  // Estados
  const [stats, setStats] = useState<CRMStats>(MOCK_STATS);
  const [notifications, setNotifications] =
    useState<CRMNotification[]>(MOCK_NOTIFICATIONS);
  const [quickActions] = useState<QuickAction[]>(MOCK_QUICK_ACTIONS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados iniciais
  useEffect(() => {
    refreshData();
  }, []);

  // Atualizar dados em tempo real (simulação)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular pequenas mudanças nas estatísticas
      setStats((prev) => ({
        ...prev,
        tarefas: {
          ...prev.tarefas,
          pendentes: prev.tarefas.pendentes + Math.floor(Math.random() * 3) - 1,
        },
        financeiro: {
          ...prev.financeiro,
          receitaTotal:
            prev.financeiro.receitaTotal + Math.floor(Math.random() * 10000),
        },
      }));
    }, 30000); // Atualizar a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  // Função para atualizar dados
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Aqui seria a chamada real para a API
      // const data = await api.getCRMStats();
      // setStats(data.stats);
      // setNotifications(data.notifications);

      toast.success("Dados atualizados com sucesso");
    } catch (err) {
      setError("Erro ao carregar dados do CRM");
      toast.error("Erro ao atualizar dados");
    } finally {
      setLoading(false);
    }
  }, []);

  // Marcar notificação como lida
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, lida: true } : notif)),
    );
  }, []);

  // Limpar todas as notificações
  const clearAllNotifications = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, lida: true })));
  }, []);

  // Executar ação rápida
  const executeQuickAction = useCallback(
    (id: string) => {
      const action = quickActions.find((a) => a.id === id);
      if (action) {
        action.action();
        toast.success(`Executando: ${action.titulo}`);
      }
    },
    [quickActions],
  );

  // Atualizar configuração de módulo
  const updateModuleConfig = useCallback((module: string, config: any) => {
    // Salvar configuração no localStorage ou enviar para API
    localStorage.setItem(`crm-config-${module}`, JSON.stringify(config));
    toast.success(`Configuração do módulo ${module} atualizada`);
  }, []);

  // Exportar todos os dados
  const exportAllData = useCallback(() => {
    const data = {
      stats,
      notifications,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crm-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();

    URL.revokeObjectURL(url);
    toast.success("Dados exportados com sucesso");
  }, [stats, notifications]);

  // Importar dados
  const importData = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (data.stats) {
        setStats(data.stats);
      }
      if (data.notifications) {
        setNotifications(data.notifications);
      }

      toast.success("Dados importados com sucesso");
    } catch (err) {
      toast.error("Erro ao importar dados");
      throw err;
    }
  }, []);

  // Estatísticas derivadas
  const derivedStats = useMemo(() => {
    const totalEntities =
      stats.clientes.total + stats.processos.total + stats.contratos.total;
    const totalActiveItems =
      stats.clientes.ativos + stats.processos.ativos + stats.contratos.vigentes;
    const healthScore = Math.round((totalActiveItems / totalEntities) * 100);

    return {
      totalEntities,
      totalActiveItems,
      healthScore,
      unreadNotifications: notifications.filter((n) => !n.lida).length,
      criticalNotifications: notifications.filter(
        (n) => n.tipo === "error" && !n.lida,
      ).length,
    };
  }, [stats, notifications]);

  return {
    // Estado
    stats: {
      ...stats,
      // Adicionar estatísticas derivadas
      derived: derivedStats,
    } as any,
    notifications,
    quickActions,
    loading,
    error,

    // Ações
    refreshData,
    markNotificationAsRead,
    clearAllNotifications,
    executeQuickAction,
    updateModuleConfig,
    exportAllData,
    importData,
  };
}
