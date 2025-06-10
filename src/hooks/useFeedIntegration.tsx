import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Types
interface IntegratedEntity {
  id: string;
  type: "client" | "process" | "task" | "meeting" | "contract" | "notification";
  title: string;
  description?: string;
  status?: string;
  assignee?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  relatedTo?: {
    type: string;
    id: string;
    name: string;
  };
}

interface FeedNotification {
  id: string;
  type:
    | "mention"
    | "like"
    | "comment"
    | "task_assigned"
    | "deadline"
    | "client_update"
    | "process_update";
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  relatedEntity?: IntegratedEntity;
}

interface FeedIntegrationState {
  notifications: FeedNotification[];
  recentActivities: IntegratedEntity[];
  connectedModules: {
    crm: boolean;
    tasks: boolean;
    calendar: boolean;
    communication: boolean;
    reports: boolean;
    documents: boolean;
  };
}

export const useFeedIntegration = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<FeedIntegrationState>({
    notifications: [],
    recentActivities: [],
    connectedModules: {
      crm: true,
      tasks: true,
      calendar: true,
      communication: true,
      reports: true,
      documents: true,
    },
  });

  // Simulate real-time data from different modules
  useEffect(() => {
    const loadIntegratedData = () => {
      // Simulated data from different modules
      const mockNotifications: FeedNotification[] = [
        {
          id: "notif-1",
          type: "task_assigned",
          title: "Nova tarefa atribuída",
          description: "Revisar contrato StartupLegal - prazo: 2 dias",
          timestamp: "10 min atrás",
          isRead: false,
          actionUrl: "/crm/tarefas",
          relatedEntity: {
            id: "task-001",
            type: "task",
            title: "Revisar contrato StartupLegal",
            priority: "high",
            dueDate: "2025-01-18",
            assignee: "Carlos Lima",
          },
        },
        {
          id: "notif-2",
          type: "client_update",
          title: "Cliente atualizado",
          description: "Tech Corp alterou dados de contato",
          timestamp: "30 min atrás",
          isRead: false,
          actionUrl: "/crm/clientes",
          relatedEntity: {
            id: "client-001",
            type: "client",
            title: "Tech Corp LTDA",
            status: "vip",
          },
        },
        {
          id: "notif-3",
          type: "deadline",
          title: "Prazo próximo",
          description: "Processo #2024-005 vence em 24 horas",
          timestamp: "1 hora atrás",
          isRead: false,
          actionUrl: "/crm/processos",
          relatedEntity: {
            id: "proc-005",
            type: "process",
            title: "Ação Civil Pública #2024-005",
            priority: "high",
            dueDate: "2025-01-17",
          },
        },
        {
          id: "notif-4",
          type: "mention",
          title: "Você foi mencionado",
          description:
            "Ana Costa te mencionou em discussão sobre propriedade intelectual",
          timestamp: "2 horas atrás",
          isRead: true,
          actionUrl: "/feed",
        },
        {
          id: "notif-5",
          type: "process_update",
          title: "Processo atualizado",
          description: "Decisão favorável em Ação Trabalhista TechCorp",
          timestamp: "3 horas atrás",
          isRead: true,
          actionUrl: "/crm/processos",
          relatedEntity: {
            id: "proc-001",
            type: "process",
            title: "Ação Trabalhista TechCorp #2024-001",
            status: "won",
          },
        },
      ];

      const mockActivities: IntegratedEntity[] = [
        {
          id: "activity-1",
          type: "client",
          title: "Silva & Associados LTDA",
          description: "Novo cliente cadastrado",
          status: "active",
          relatedTo: {
            type: "client",
            id: "client-004",
            name: "Silva & Associados LTDA",
          },
        },
        {
          id: "activity-2",
          type: "task",
          title: "Finalizar parecer jurídico",
          description: "Tarefa concluída por Pedro Oliveira",
          status: "completed",
          assignee: "Pedro Oliveira",
          relatedTo: {
            type: "client",
            id: "client-002",
            name: "StartupTech",
          },
        },
        {
          id: "activity-3",
          type: "meeting",
          title: "Reunião MegaCorp",
          description: "Consultoria jurídica mensal agendada",
          status: "scheduled",
          dueDate: "2025-01-18 14:00",
          relatedTo: {
            type: "client",
            id: "client-003",
            name: "MegaCorp SA",
          },
        },
        {
          id: "activity-4",
          type: "contract",
          title: "Contrato de Consultoria",
          description: "Contrato assinado com MegaCorp",
          status: "signed",
          relatedTo: {
            type: "client",
            id: "client-003",
            name: "MegaCorp SA",
          },
        },
        {
          id: "activity-5",
          type: "process",
          title: "Registro de Marca StartupTech",
          description: "Processo finalizado com sucesso",
          status: "completed",
          relatedTo: {
            type: "client",
            id: "client-002",
            name: "StartupTech",
          },
        },
      ];

      setState((prev) => ({
        ...prev,
        notifications: mockNotifications,
        recentActivities: mockActivities,
      }));
    };

    loadIntegratedData();

    // Simulate real-time updates every 30 seconds
    const interval = setInterval(loadIntegratedData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Navigation helpers
  const navigateToEntity = useCallback(
    (entity: IntegratedEntity) => {
      switch (entity.type) {
        case "client":
          navigate(`/crm/clientes/${entity.id}`);
          break;
        case "process":
          navigate(`/crm/processos/${entity.id}`);
          break;
        case "task":
          navigate(`/crm/tarefas/${entity.id}`);
          break;
        case "meeting":
          navigate(`/agenda/${entity.id}`);
          break;
        case "contract":
          navigate(`/crm/contratos/${entity.id}`);
          break;
        default:
          navigate("/feed");
      }
    },
    [navigate],
  );

  const navigateToNotification = useCallback(
    (notification: FeedNotification) => {
      if (notification.actionUrl) {
        navigate(notification.actionUrl);
      }
    },
    [navigate],
  );

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif,
      ),
    }));
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((notif) => ({
        ...notif,
        isRead: true,
      })),
    }));
  }, []);

  // Create feed post from external action
  const createFeedPost = useCallback(
    (data: {
      type: "client" | "process" | "task" | "meeting" | "contract";
      title: string;
      description: string;
      relatedEntity?: IntegratedEntity;
    }) => {
      // This would integrate with the feed posting system
      console.log("Creating feed post:", data);

      // In a real implementation, this would call an API
      // and update the feed in real-time
    },
    [],
  );

  // Get notifications by type
  const getNotificationsByType = useCallback(
    (type: FeedNotification["type"]) => {
      return state.notifications.filter((notif) => notif.type === type);
    },
    [state.notifications],
  );

  // Get unread notifications count
  const unreadCount = state.notifications.filter(
    (notif) => !notif.isRead,
  ).length;

  // Get high priority items
  const highPriorityItems = state.recentActivities.filter(
    (activity) => activity.priority === "high",
  );

  // Get items due soon (within 24 hours)
  const itemsDueSoon = state.recentActivities.filter((activity) => {
    if (!activity.dueDate) return false;
    const dueDate = new Date(activity.dueDate);
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    return diff > 0 && diff <= 24 * 60 * 60 * 1000; // 24 hours
  });

  // Integration status
  const getModuleStatus = useCallback(
    (module: keyof FeedIntegrationState["connectedModules"]) => {
      return state.connectedModules[module];
    },
    [state.connectedModules],
  );

  // Real-time activity feed
  const getActivityFeed = useCallback(() => {
    // Combine notifications and activities into a unified timeline
    const combined = [
      ...state.notifications.map((notif) => ({
        id: notif.id,
        type: "notification" as const,
        title: notif.title,
        description: notif.description,
        timestamp: notif.timestamp,
        isRead: notif.isRead,
        data: notif,
      })),
      ...state.recentActivities.map((activity) => ({
        id: activity.id,
        type: "activity" as const,
        title: activity.title,
        description: activity.description || "",
        timestamp: "recently", // In real app, would have proper timestamps
        isRead: true,
        data: activity,
      })),
    ];

    // Sort by timestamp (newest first)
    return combined.sort((a, b) => {
      // Simple sorting for demo - in real app would use proper date comparison
      return a.type === "notification" ? -1 : 1;
    });
  }, [state.notifications, state.recentActivities]);

  return {
    // State
    notifications: state.notifications,
    recentActivities: state.recentActivities,
    connectedModules: state.connectedModules,

    // Computed values
    unreadCount,
    highPriorityItems,
    itemsDueSoon,

    // Methods
    navigateToEntity,
    navigateToNotification,
    markAsRead,
    markAllAsRead,
    createFeedPost,
    getNotificationsByType,
    getModuleStatus,
    getActivityFeed,
  };
};

export default useFeedIntegration;
