import { useState, useEffect, useCallback, useMemo } from "react";
import {
  IntelligentActionPlan,
  IntelligentActionPlanItem,
  ContinuousMonitorConfig,
  UserPermissions,
  MonitoringEvent,
  AnalysisReport,
} from "../types/intelligentActionPlan";
import { ModuleName } from "../types/actionPlan";
import { intelligentActionPlanService } from "../services/intelligentActionPlanService";
import { systemAnalysisService } from "../services/systemAnalysisService";

interface UseIntelligentActionPlanReturn {
  // State
  actionPlan: IntelligentActionPlan | null;
  config: ContinuousMonitorConfig;
  permissions: UserPermissions;
  isLoading: boolean;
  isAnalyzing: boolean;
  error: string | null;

  // Events and reports
  events: MonitoringEvent[];
  latestReport: AnalysisReport | null;
  analysisHistory: AnalysisReport[];

  // Actions
  executeTask: (taskId: string) => Promise<void>;
  performAnalysis: () => Promise<AnalysisReport>;
  updateConfig: (newConfig: Partial<ContinuousMonitorConfig>) => Promise<void>;
  setPermissions: (permissions: UserPermissions) => void;

  // Data access
  getTasks: (filters?: {
    status?: string;
    module?: ModuleName;
    priority?: string;
    origin?: string;
  }) => Promise<IntelligentActionPlanItem[]>;

  exportPlan: (format: "json" | "csv") => Promise<string>;

  // Real-time monitoring
  addEventListener: (
    eventType: string,
    callback: (event: MonitoringEvent) => void,
  ) => void;
  removeEventListener: (
    eventType: string,
    callback: (event: MonitoringEvent) => void,
  ) => void;
}

export const useIntelligentActionPlan = (): UseIntelligentActionPlanReturn => {
  // State
  const [actionPlan, setActionPlan] = useState<IntelligentActionPlan | null>(
    null,
  );
  const [config, setConfig] = useState<ContinuousMonitorConfig>({
    enabled: true,
    interval: 30,
    modules_to_monitor: [],
    auto_generate_tasks: true,
    auto_execute_safe_tasks: false,
    notification_threshold: "média",
    max_concurrent_executions: 3,
  });
  const [permissions, setPermissionsState] = useState<UserPermissions>({
    can_approve_critical: false,
    can_execute_automated: false,
    can_modify_config: false,
    can_view_logs: true,
    can_access_hidden_modules: false,
    role: "usuario",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<MonitoringEvent[]>([]);
  const [latestReport, setLatestReport] = useState<AnalysisReport | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisReport[]>([]);

  // Initialize
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load action plan
        const plan = await intelligentActionPlanService.loadActionPlan();
        setActionPlan(plan);

        // Get current config
        const currentConfig = intelligentActionPlanService.getConfig();
        setConfig(currentConfig);

        // Get permissions (in a real app, this would come from authentication)
        const userPermissions = intelligentActionPlanService.getPermissions();
        setPermissionsState(userPermissions);

        // Load analysis history
        const history = systemAnalysisService.getAnalysisHistory();
        setAnalysisHistory(history);

        const latest = systemAnalysisService.getLatestReport();
        setLatestReport(latest);

        // Setup event listeners
        intelligentActionPlanService.addEventListener(
          "task_created",
          handleEvent,
        );
        intelligentActionPlanService.addEventListener(
          "task_completed",
          handleEvent,
        );
        intelligentActionPlanService.addEventListener(
          "issue_detected",
          handleEvent,
        );
        intelligentActionPlanService.addEventListener(
          "system_alert",
          handleEvent,
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao inicializar");
        console.error("Initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    // Cleanup
    return () => {
      // Remove event listeners if needed
    };
  }, []);

  // Event handler
  const handleEvent = useCallback((event: MonitoringEvent) => {
    setEvents((prev) => [...prev.slice(-49), event]); // Keep last 50 events

    // Update action plan if needed
    if (event.tipo === "task_completed" || event.tipo === "task_created") {
      // Refresh action plan
      intelligentActionPlanService.loadActionPlan().then(setActionPlan);
    }
  }, []);

  // Execute task
  const executeTask = useCallback(async (taskId: string) => {
    try {
      setError(null);
      await intelligentActionPlanService.executeTask(taskId);

      // Refresh action plan
      const updatedPlan = await intelligentActionPlanService.loadActionPlan();
      setActionPlan(updatedPlan);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao executar tarefa";
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Perform analysis
  const performAnalysis = useCallback(async (): Promise<AnalysisReport> => {
    try {
      setIsAnalyzing(true);
      setError(null);

      const report = await intelligentActionPlanService.performSystemAnalysis();

      setLatestReport(report);
      setAnalysisHistory(systemAnalysisService.getAnalysisHistory());

      // Refresh action plan as analysis might have generated new tasks
      const updatedPlan = await intelligentActionPlanService.loadActionPlan();
      setActionPlan(updatedPlan);

      return report;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro na análise";
      setError(errorMessage);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Update config
  const updateConfig = useCallback(
    async (newConfig: Partial<ContinuousMonitorConfig>) => {
      try {
        setError(null);
        await intelligentActionPlanService.updateConfig(newConfig);

        const updatedConfig = intelligentActionPlanService.getConfig();
        setConfig(updatedConfig);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao atualizar configuração";
        setError(errorMessage);
        throw err;
      }
    },
    [],
  );

  // Set permissions
  const setPermissions = useCallback((newPermissions: UserPermissions) => {
    intelligentActionPlanService.setPermissions(newPermissions);
    setPermissionsState(newPermissions);
  }, []);

  // Get tasks with filters
  const getTasks = useCallback(
    async (filters?: {
      status?: string;
      module?: ModuleName;
      priority?: string;
      origin?: string;
    }): Promise<IntelligentActionPlanItem[]> => {
      try {
        return await intelligentActionPlanService.getTasks(filters);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao buscar tarefas");
        return [];
      }
    },
    [],
  );

  // Export plan
  const exportPlan = useCallback(
    async (format: "json" | "csv"): Promise<string> => {
      try {
        return await intelligentActionPlanService.exportActionPlan(format);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao exportar plano");
        throw err;
      }
    },
    [],
  );

  // Event management
  const addEventListener = useCallback(
    (eventType: string, callback: (event: MonitoringEvent) => void) => {
      intelligentActionPlanService.addEventListener(eventType, callback);
    },
    [],
  );

  const removeEventListener = useCallback(
    (eventType: string, callback: (event: MonitoringEvent) => void) => {
      intelligentActionPlanService.removeEventListener(eventType, callback);
    },
    [],
  );

  // Computed values
  const computedValues = useMemo(() => {
    return {
      totalTasks: actionPlan?.tarefas.length || 0,
      pendingTasks:
        actionPlan?.tarefas.filter((t) => t.status === "pendente").length || 0,
      executingTasks:
        actionPlan?.tarefas.filter((t) => t.status === "em execução").length ||
        0,
      completedTasks:
        actionPlan?.tarefas.filter((t) => t.status === "concluído").length || 0,
      criticalTasks:
        actionPlan?.tarefas.filter((t) => t.prioridade === "crítica").length ||
        0,
      aiGeneratedTasks:
        actionPlan?.tarefas.filter((t) => t.origem === "análise automática")
          .length || 0,
      recentEvents: events.slice(-10),
      hasActiveAnalysis:
        isAnalyzing || systemAnalysisService.isAnalysisInProgress(),
    };
  }, [actionPlan, events, isAnalyzing]);

  return {
    // State
    actionPlan,
    config,
    permissions,
    isLoading,
    isAnalyzing: computedValues.hasActiveAnalysis,
    error,

    // Events and reports
    events,
    latestReport,
    analysisHistory,

    // Actions
    executeTask,
    performAnalysis,
    updateConfig,
    setPermissions,

    // Data access
    getTasks,
    exportPlan,

    // Real-time monitoring
    addEventListener,
    removeEventListener,

    // Additional computed values for convenience
    ...computedValues,
  };
};

// Helper hook for permissions checking
export const useIntelligentActionPlanPermissions = () => {
  const { permissions } = useIntelligentActionPlan();

  return {
    canApprove: permissions.can_approve_critical,
    canExecute: permissions.can_execute_automated,
    canModifyConfig: permissions.can_modify_config,
    canViewLogs: permissions.can_view_logs,
    canAccessHidden: permissions.can_access_hidden_modules,
    isAdmin: permissions.role === "admin",
    isDeveloper: permissions.role === "desenvolvedor",
    isUser: permissions.role === "usuario",
  };
};

// Helper hook for real-time events
export const useIntelligentActionPlanEvents = (eventTypes: string[] = []) => {
  const { addEventListener, removeEventListener, events } =
    useIntelligentActionPlan();
  const [filteredEvents, setFilteredEvents] = useState<MonitoringEvent[]>([]);

  useEffect(() => {
    const handleEvent = (event: MonitoringEvent) => {
      if (eventTypes.length === 0 || eventTypes.includes(event.tipo)) {
        setFilteredEvents((prev) => [...prev.slice(-49), event]);
      }
    };

    // Subscribe to all specified event types
    if (eventTypes.length > 0) {
      eventTypes.forEach((type) => addEventListener(type, handleEvent));
    } else {
      // Subscribe to all events
      [
        "task_created",
        "task_completed",
        "issue_detected",
        "system_alert",
      ].forEach((type) => addEventListener(type, handleEvent));
    }

    return () => {
      // Cleanup
      if (eventTypes.length > 0) {
        eventTypes.forEach((type) => removeEventListener(type, handleEvent));
      }
    };
  }, [eventTypes, addEventListener, removeEventListener]);

  // Also include existing events that match the filter
  useEffect(() => {
    const filtered = events.filter(
      (event) => eventTypes.length === 0 || eventTypes.includes(event.tipo),
    );
    setFilteredEvents(filtered.slice(-50));
  }, [events, eventTypes]);

  return filteredEvents;
};
