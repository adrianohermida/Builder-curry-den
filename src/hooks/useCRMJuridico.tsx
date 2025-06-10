/**
 * Hook principal do CRM Jurídico
 * Gerenciamento centralizado de estado e funcionalidades
 */

import { useState, useCallback, useEffect } from "react";

// Interfaces
interface ClienteStats {
  total: number;
  ativos: number;
  inativos: number;
  vip: number;
  prospectos: number;
}

interface ProcessoStats {
  total: number;
  ativos: number;
  finalizados: number;
  pendentes: number;
  alertas: number;
}

interface ContratoStats {
  total: number;
  ativos: number;
  vencendo: number;
  valorTotal: number;
  assinados: number;
}

interface TarefaStats {
  total: number;
  pendentes: number;
  concluidas: number;
  atrasadas: number;
  hojе: number;
}

interface FinanceiroStats {
  receitaTotal: number;
  receitaMensal: number;
  pagamentosRecebidos: number;
  pagamentosPendentes: number;
  inadimplencia: number;
}

interface GEDStats {
  totalDocumentos: number;
  documentosRecentes: number;
  tamanhoTotal: number;
  classificados: number;
  naoClassificados: number;
}

interface CRMStats {
  clientes: ClienteStats;
  processos: ProcessoStats;
  contratos: ContratoStats;
  tarefas: TarefaStats;
  financeiro: FinanceiroStats;
  ged: GEDStats;
}

interface Notification {
  id: string;
  tipo: "info" | "warning" | "error" | "success";
  titulo: string;
  mensagem: string;
  timestamp: Date;
  lida: boolean;
}

// Mock data inicial
const MOCK_STATS: CRMStats = {
  clientes: {
    total: 247,
    ativos: 189,
    inativos: 42,
    vip: 16,
    prospectos: 35,
  },
  processos: {
    total: 892,
    ativos: 456,
    finalizados: 398,
    pendentes: 38,
    alertas: 12,
  },
  contratos: {
    total: 156,
    ativos: 134,
    vencendo: 8,
    valorTotal: 2450000,
    assinados: 142,
  },
  tarefas: {
    total: 1245,
    pendentes: 89,
    concluidas: 1098,
    atrasadas: 23,
    hojе: 35,
  },
  financeiro: {
    receitaTotal: 4750000,
    receitaMensal: 389000,
    pagamentosRecebidos: 3890000,
    pagamentosPendentes: 185000,
    inadimplencia: 95000,
  },
  ged: {
    totalDocumentos: 3456,
    documentosRecentes: 78,
    tamanhoTotal: 12500, // MB
    classificados: 2890,
    naoClassificados: 566,
  },
};

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    tipo: "warning",
    titulo: "Prazos Próximos",
    mensagem: "5 processos com prazos vencendo em 3 dias",
    timestamp: new Date(),
    lida: false,
  },
  {
    id: "2",
    tipo: "info",
    titulo: "Novo Cliente",
    mensagem: "Cliente Premium adicionado ao sistema",
    timestamp: new Date(Date.now() - 3600000),
    lida: false,
  },
  {
    id: "3",
    tipo: "error",
    titulo: "Pagamento Atrasado",
    mensagem: "3 faturas em atraso há mais de 30 dias",
    timestamp: new Date(Date.now() - 7200000),
    lida: true,
  },
];

export const useCRMJuridico = () => {
  const [stats, setStats] = useState<CRMStats>(MOCK_STATS);
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simular carregamento de dados
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Simular pequenas variações nos dados
      const updatedStats = {
        ...stats,
        clientes: {
          ...stats.clientes,
          total: stats.clientes.total + Math.floor(Math.random() * 3),
        },
        processos: {
          ...stats.processos,
          alertas: Math.max(
            0,
            stats.processos.alertas + (Math.random() > 0.7 ? 1 : -1),
          ),
        },
        tarefas: {
          ...stats.tarefas,
          pendentes: Math.max(
            0,
            stats.tarefas.pendentes + (Math.random() > 0.5 ? 1 : -1),
          ),
        },
      };

      setStats(updatedStats);
    } catch (err) {
      setError("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }, [stats]);

  // Marcar notificação como lida
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, lida: true } : notif)),
    );
  }, []);

  // Adicionar nova notificação
  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp" | "lida">) => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date(),
        lida: false,
      };

      setNotifications((prev) => [newNotification, ...prev].slice(0, 10)); // Manter apenas as 10 mais recentes
    },
    [],
  );

  // Carregar dados iniciais
  useEffect(() => {
    refreshData();
  }, []);

  return {
    stats,
    notifications: notifications.filter((n) => !n.lida), // Apenas não lidas
    allNotifications: notifications,
    loading,
    error,
    refreshData,
    markNotificationAsRead,
    addNotification,
  };
};
