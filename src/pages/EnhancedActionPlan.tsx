import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Settings,
  Brain,
  FileText,
  GitBranch,
  Target,
  Zap,
  Activity,
  TrendingUp,
  Users,
  Calendar,
  FolderOpen,
  DollarSign,
  Scale,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Kanban,
  BarChart3,
  Lightbulb,
  Workflow,
  Bot,
  Monitor,
  Play,
  Clock,
  RefreshCw,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

// Import enhanced action plan components
import EnhancedActionPlanDashboard from "@/components/ActionPlan/EnhancedActionPlanDashboard";
import EnhancedModuleManager from "@/components/ActionPlan/EnhancedModuleManager";
import VersionControl from "@/components/ActionPlan/VersionControl";
import AIAnalyzer from "@/components/ActionPlan/AIAnalyzer";
import LogViewer from "@/components/ActionPlan/LogViewer";

// Import new backlog components
import BacklogKanban from "@/components/ActionPlan/BacklogKanban";
import BacklogDashboard from "@/components/ActionPlan/BacklogDashboard";
import IntegratedBacklog from "@/components/ActionPlan/IntegratedBacklog";

// Import intelligent system components
import { IntelligentMonitor } from "@/components/ActionPlan/IntelligentMonitor";
import { ContinuousExecutor } from "@/components/ActionPlan/ContinuousExecutor";
import { AutonomousExecutionDashboard } from "@/components/ActionPlan/AutonomousExecutionDashboard";
import { PlanCleanupDashboard } from "@/components/ActionPlan/PlanCleanupDashboard";

// Import services, types, and hooks
import ActionPlanService from "@/services/actionPlanService";
import BacklogService from "@/services/backlogService";
import { ActionPlanState, ModuleName } from "@/types/actionPlan";
import { BacklogState, BacklogItem } from "@/types/backlog";
import { useIntelligentActionPlan } from "@/hooks/useIntelligentActionPlan";

export default function EnhancedActionPlan() {
  const [activeTab, setActiveTab] = useState("cleanup");
  const [selectedModule, setSelectedModule] =
    useState<ModuleName>("CRM Jurídico");
  const [selectedBacklogItem, setSelectedBacklogItem] =
    useState<BacklogItem | null>(null);
  const [actionPlanState, setActionPlanState] =
    useState<ActionPlanState | null>(null);
  const [backlogState, setBacklogState] = useState<BacklogState | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHiddenModules, setShowHiddenModules] = useState(false);

  const actionPlanService = ActionPlanService.getInstance();
  const backlogService = BacklogService.getInstance();

  // Intelligent Action Plan integration
  const {
    actionPlan: intelligentPlan,
    isAnalyzing,
    performAnalysis,
    totalTasks,
    pendingTasks,
    executingTasks,
    completedTasks,
    latestReport,
  } = useIntelligentActionPlan();

  useEffect(() => {
    // Subscribe to action plan changes
    const unsubscribeActionPlan = actionPlanService.subscribe((newState) => {
      setActionPlanState(newState);
    });

    // Subscribe to backlog changes
    const unsubscribeBacklog = backlogService.subscribe((newState) => {
      setBacklogState(newState);
    });

    // Initial load
    setActionPlanState(actionPlanService.getState());
    setBacklogState(backlogService.getState());

    return () => {
      unsubscribeActionPlan();
      unsubscribeBacklog();
    };
  }, [actionPlanService, backlogService]);

  // Handle navigation between tabs
  const handleNavigateToModule = (module: ModuleName) => {
    setSelectedModule(module);
    setActiveTab("modules");
  };

  const handleNavigateToLogs = () => {
    setActiveTab("logs");
  };

  const handleNavigateToAnalysis = () => {
    setActiveTab("ai-analyzer");
  };

  const handleNavigateToKanban = () => {
    setActiveTab("backlog-kanban");
  };

  // Handle notifications from AI analysis
  const handleTaskGenerated = (taskCount: number) => {
    const message = `IA gerou ${taskCount} nova(s) tarefa(s) de melhoria`;
    setNotifications((prev) => [message, ...prev.slice(0, 4)]);

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n !== message));
    }, 5000);
  };

  // Handle backlog AI processing
  const handleBacklogAIProcessing = async () => {
    setIsProcessing(true);
    try {
      await backlogService.processBacklogWithAI();
      const message = "Processamento IA do backlog concluído com sucesso";
      setNotifications((prev) => [message, ...prev.slice(0, 4)]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n !== message));
      }, 5000);
    } catch (error) {
      console.error("Error processing backlog:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle backlog item selection
  const handleBacklogItemSelect = (item: BacklogItem) => {
    setSelectedBacklogItem(item);
  };

  // Handle backlog item creation/update
  const handleBacklogItemChange = (item: BacklogItem) => {
    const message = `Item "${item.titulo}" foi ${item.data_atualizacao ? "atualizado" : "criado"} no backlog`;
    setNotifications((prev) => [message, ...prev.slice(0, 4)]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n !== message));
    }, 5000);
  };

  // Get module icon
  const getModuleIcon = (moduleName: ModuleName) => {
    const iconMap = {
      "CRM Jurídico": Users,
      "IA Jurídica": Brain,
      GED: FolderOpen,
      Tarefas: CheckCircle,
      Publicações: Calendar,
      Atendimento: MessageSquare,
      Agenda: Calendar,
      Financeiro: DollarSign,
      Configurações: Settings,
      "Design System": Monitor,
      "Features Beta": Zap,
    };
    return iconMap[moduleName] || Target;
  };

  // Global system health (enhanced with intelligent system)
  const systemHealth =
    actionPlanState && backlogState && intelligentPlan
      ? {
          criticalModules: actionPlanState.modulos.filter(
            (m) => m.saude_geral === "critica",
          ).length,
          totalTasks: actionPlanState.modulos.reduce(
            (sum, m) =>
              sum +
              m.tarefas_pendentes.length +
              m.em_execucao.length +
              m.concluidas.length,
            0,
          ),
          totalBacklogItems: backlogState.estatisticas.total_items,
          criticalBacklogItems: backlogState.items.filter(
            (i) => i.prioridade === "critica",
          ).length,
          completionRate:
            actionPlanState.modulos.length > 0
              ? actionPlanState.modulos.reduce(
                  (sum, m) => sum + m.metricas.taxa_conclusao,
                  0,
                ) / actionPlanState.modulos.length
              : 0,
          backlogExecutionRate: backlogState.estatisticas.taxa_execucao,
          aiAnalyses:
            actionPlanState.analises_ia.length +
            backlogState.items.filter((i) => i.analise_ia).length,
          lastUpdate: actionPlanState.versao_atual.data_criacao,
          // Intelligent system metrics
          intelligentTasks: totalTasks,
          intelligentPending: pendingTasks,
          intelligentExecuting: executingTasks,
          intelligentCompleted: completedTasks,
          intelligentSuccessRate: intelligentPlan.métricas_globais.taxa_sucesso,
          lastAnalysis: latestReport?.timestamp,
        }
      : null;

  if (!actionPlanState || !backlogState) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          <div>
            <h2 className="text-lg font-semibold">
              Inicializando Sistema Inteligente
            </h2>
            <p className="text-sm text-muted-foreground">
              Carregando plano de ação, backlog e sistema de IA automatizada...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive py-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              🧠 Sistema Inteligente Lawdesk 2025
            </h1>
            <p className="text-muted-foreground">
              Plano de ação contínuo + IA automatizada + Backlog estratégico - v
              {actionPlanState.versao_atual.versao}
            </p>
          </div>

          {/* System Health Indicator */}
          {systemHealth && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    systemHealth.criticalModules === 0 &&
                    systemHealth.criticalBacklogItems === 0
                      ? "bg-green-500"
                      : systemHealth.criticalModules <= 2 &&
                          systemHealth.criticalBacklogItems <= 3
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  } animate-pulse`}
                />
                <span className="text-sm text-muted-foreground">
                  Sistema{" "}
                  {systemHealth.criticalModules === 0 &&
                  systemHealth.criticalBacklogItems === 0
                    ? "Saudável"
                    : systemHealth.criticalModules <= 2 &&
                        systemHealth.criticalBacklogItems <= 3
                      ? "Atenção"
                      : "Crítico"}
                </span>
              </div>

              {isAnalyzing && (
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 animate-pulse text-blue-500" />
                  <span className="text-sm text-blue-600">IA Analisando</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Quick Stats */}
        {systemHealth && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-primary">
                {systemHealth.totalTasks}
              </div>
              <div className="text-xs text-muted-foreground">
                Tarefas Técnicas
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">
                {systemHealth.totalBacklogItems}
              </div>
              <div className="text-xs text-muted-foreground">Itens Backlog</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">
                {systemHealth.intelligentTasks}
              </div>
              <div className="text-xs text-muted-foreground">
                Tarefas IA 2025
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-success">
                {Math.round(systemHealth.completionRate)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Conclusão Técnica
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">
                {Math.round(systemHealth.backlogExecutionRate)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Execução Backlog
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-indigo-600">
                {Math.round(systemHealth.intelligentSuccessRate)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Taxa Sucesso IA
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">
                {systemHealth.aiAnalyses}
              </div>
              <div className="text-xs text-muted-foreground">Análises IA</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">
                {systemHealth.criticalModules +
                  systemHealth.criticalBacklogItems}
              </div>
              <div className="text-xs text-muted-foreground">
                Itens Críticos
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Critical Alerts */}
      {systemHealth &&
        (systemHealth.criticalModules > 0 ||
          systemHealth.criticalBacklogItems > 0) && (
          <Alert className="mb-6 border-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>⚠️ Atenção: Itens Críticos Detectados</AlertTitle>
            <AlertDescription>
              {systemHealth.criticalModules > 0 &&
                `${systemHealth.criticalModules} módulo(s) técnico(s) crítico(s). `}
              {systemHealth.criticalBacklogItems > 0 &&
                `${systemHealth.criticalBacklogItems} item(s) do backlog crítico(s). `}
              {systemHealth.intelligentPending > 5 &&
                `${systemHealth.intelligentPending} tarefa(s) IA pendente(s). `}
              Verifique os dashboards para ações recomendadas.
            </AlertDescription>
          </Alert>
        )}

      {/* AI Processing Status */}
      {(isProcessing || isAnalyzing) && (
        <Alert className="mb-6 border-primary bg-primary/5">
          <Brain className="h-4 w-4 animate-pulse" />
          <AlertTitle>🤖 Sistema de IA Ativo</AlertTitle>
          <AlertDescription className="flex items-center gap-2">
            {isAnalyzing &&
              "Analisando sistema e gerando tarefas automáticas..."}
            {isProcessing &&
              "Processando backlog e criando conexões inteligentes..."}
            <RefreshCw className="h-3 w-3 animate-spin" />
          </AlertDescription>
        </Alert>
      )}

      {/* Notifications */}
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification}
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className="mb-4"
          >
            <Alert className="border-primary bg-primary/5">
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>💡 Atualização do Sistema</AlertTitle>
              <AlertDescription>{notification}</AlertDescription>
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-11 w-full bg-muted p-1 rounded-lg">
          <TabsTrigger
            value="cleanup"
            className="flex items-center gap-1 data-[state=active]:bg-background text-xs"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Limpeza</span>
          </TabsTrigger>

          <TabsTrigger
            value="autonomous"
            className="flex items-center gap-1 data-[state=active]:bg-background text-xs"
          >
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Autônomo</span>
          </TabsTrigger>

          <TabsTrigger
            value="intelligent"
            className="flex items-center gap-1 data-[state=active]:bg-background text-xs"
          >
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">IA 2025</span>
          </TabsTrigger>

          <TabsTrigger
            value="executor"
            className="flex items-center gap-1 data-[state=active]:bg-background text-xs"
          >
            <Play className="h-4 w-4" />
            <span className="hidden sm:inline">Executor</span>
          </TabsTrigger>

          <TabsTrigger
            value="dashboard"
            className="flex items-center gap-1 data-[state=active]:bg-background text-xs"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>

          <TabsTrigger
            value="backlog-dashboard"
            className="flex items-center gap-1 data-[state=active]:bg-background text-xs"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Backlog</span>
          </TabsTrigger>

          <TabsTrigger
            value="backlog-kanban"
            className="flex items-center gap-1 data-[state=active]:bg-background text-xs"
          >
            <Kanban className="h-4 w-4" />
            <span className="hidden sm:inline">Kanban</span>
          </TabsTrigger>

          <TabsTrigger
            value="modules"
            className="flex items-center gap-1 data-[state=active]:bg-background text-xs"
          >
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Módulos</span>
          </TabsTrigger>

          <TabsTrigger
            value="ai-analyzer"
            className="flex items-center gap-1 data-[state=active]:bg-background text-xs"
          >
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">IA</span>
          </TabsTrigger>

          <TabsTrigger
            value="logs"
            className="flex items-center gap-1 data-[state=active]:bg-background text-xs"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Logs</span>
          </TabsTrigger>

          <TabsTrigger
            value="versions"
            className="flex items-center gap-1 data-[state=active]:bg-background text-xs"
          >
            <GitBranch className="h-4 w-4" />
            <span className="hidden sm:inline">Versões</span>
          </TabsTrigger>
        </TabsList>

        {/* Cleanup and Update Tab - NEW */}
        <TabsContent value="cleanup" className="space-y-6">
          <PlanCleanupDashboard />
        </TabsContent>

        {/* Autonomous Execution Tab - NEW */}
        <TabsContent value="autonomous" className="space-y-6">
          <AutonomousExecutionDashboard />
        </TabsContent>

        {/* Intelligent System Tab - NEW */}
        <TabsContent value="intelligent" className="space-y-6">
          <div className="space-y-4">
            {/* Quick stats for intelligent system */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <Target className="h-4 w-4 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-2xl font-bold">{totalTasks}</p>
                      <p className="text-xs text-muted-foreground">
                        Total de Tarefas IA
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-2xl font-bold">{pendingTasks}</p>
                      <p className="text-xs text-muted-foreground">Pendentes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-2xl font-bold">{executingTasks}</p>
                      <p className="text-xs text-muted-foreground">
                        Em Execução
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-2xl font-bold">{completedTasks}</p>
                      <p className="text-xs text-muted-foreground">
                        Concluídas
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <IntelligentMonitor
              onTaskExecute={(taskId) =>
                setNotifications((prev) => [
                  `Tarefa ${taskId} executada com sucesso`,
                  ...prev.slice(0, 4),
                ])
              }
              onConfigChange={() =>
                setNotifications((prev) => [
                  "Configuração do sistema inteligente atualizada",
                  ...prev.slice(0, 4),
                ])
              }
            />
          </div>
        </TabsContent>

        {/* Continuous Executor Tab - NEW */}
        <TabsContent value="executor" className="space-y-6">
          <ContinuousExecutor
            onExecutionComplete={(taskId, success) =>
              setNotifications((prev) => [
                success
                  ? `✅ Tarefa ${taskId} concluída com sucesso`
                  : `❌ Falha na execução da tarefa ${taskId}`,
                ...prev.slice(0, 4),
              ])
            }
            onLogGenerated={(log) =>
              console.log("Log de execução gerado:", log)
            }
          />
        </TabsContent>

        {/* Dashboard Tab - Technical Action Plan */}
        <TabsContent value="dashboard" className="space-y-0">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              📋 Dashboard Técnico - Plano de Ação
            </h3>
            <p className="text-sm text-muted-foreground">
              Visão executiva das tarefas técnicas e melhorias do sistema
            </p>
          </div>
          <EnhancedActionPlanDashboard
            showHiddenModules={showHiddenModules}
            onNotification={(message) =>
              setNotifications((prev) => [message, ...prev.slice(0, 4)])
            }
          />
        </TabsContent>

        {/* Backlog Dashboard Tab */}
        <TabsContent value="backlog-dashboard" className="space-y-0">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              🧱 Dashboard do Backlog Estratégico
            </h3>
            <p className="text-sm text-muted-foreground">
              Análise gerencial de ideias, roadmap e execução estratégica
            </p>
          </div>
          <BacklogDashboard
            onNavigateToKanban={handleNavigateToKanban}
            onItemSelect={handleBacklogItemSelect}
            onRunAIAnalysis={handleBacklogAIProcessing}
          />
        </TabsContent>

        {/* Backlog Kanban Tab */}
        <TabsContent value="backlog-kanban" className="space-y-0">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">🎯 Kanban do Backlog</h3>
              <p className="text-sm text-muted-foreground">
                Gestão visual estilo Trello com análise inteligente da IA
              </p>
            </div>
            <Button
              onClick={handleBacklogAIProcessing}
              disabled={isProcessing}
              className="flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              {isProcessing ? "Processando..." : "Analisar com IA"}
            </Button>
          </div>
          <BacklogKanban
            onItemSelect={handleBacklogItemSelect}
            onItemCreate={handleBacklogItemChange}
            onItemUpdate={handleBacklogItemChange}
          />
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules" className="space-y-0">
          <div className="space-y-6">
            {/* Module Selection Header */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Gerenciamento de M��dulos Técnicos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {(
                    [
                      "CRM Jurídico",
                      "IA Jurídica",
                      "GED",
                      "Tarefas",
                      "Publicações",
                      "Atendimento",
                      "Agenda",
                      "Financeiro",
                      "Configurações",
                      ...(showHiddenModules
                        ? ["Design System", "Features Beta"]
                        : []),
                    ] as ModuleName[]
                  ).map((module) => {
                    const moduleData = actionPlanState.modulos.find(
                      (m) => m.modulo === module,
                    );
                    const IconComponent = getModuleIcon(module);
                    const isHidden = [
                      "Design System",
                      "Features Beta",
                    ].includes(module);

                    return (
                      <Button
                        key={module}
                        variant={
                          selectedModule === module ? "default" : "outline"
                        }
                        onClick={() => setSelectedModule(module)}
                        className={`h-auto p-4 flex flex-col items-center gap-2 ${
                          isHidden
                            ? "border-purple-200 bg-purple-50 hover:bg-purple-100"
                            : ""
                        }`}
                      >
                        <IconComponent
                          className={`h-5 w-5 ${isHidden ? "text-purple-600" : ""}`}
                        />
                        <span
                          className={`text-xs font-medium text-center ${
                            isHidden ? "text-purple-700" : ""
                          }`}
                        >
                          {module}
                        </span>
                        {isHidden && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-purple-100 text-purple-800"
                          >
                            BETA
                          </Badge>
                        )}
                        {moduleData && (
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              moduleData.saude_geral === "critica"
                                ? "bg-red-100 text-red-800"
                                : moduleData.saude_geral === "regular"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : moduleData.saude_geral === "boa"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                            }`}
                          >
                            {Math.round(moduleData.metricas.taxa_conclusao)}%
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={showHiddenModules}
                      onChange={(e) => setShowHiddenModules(e.target.checked)}
                      className="rounded"
                    />
                    Mostrar módulos ocultos (Design System, Features Beta)
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Module Manager */}
            <EnhancedModuleManager
              selectedModule={selectedModule}
              showHiddenModules={showHiddenModules}
              onModuleChange={setSelectedModule}
            />
          </div>
        </TabsContent>

        {/* AI Analyzer Tab */}
        <TabsContent value="ai-analyzer" className="space-y-0">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              🧠 Central de Inteligência Artificial
            </h3>
            <p className="text-sm text-muted-foreground">
              Análise automatizada para plano de ação e backlog estratégico
            </p>
          </div>
          <AIAnalyzer onTaskGenerated={handleTaskGenerated} />
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-0">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              📊 Logs de Execução do Sistema
            </h3>
            <p className="text-sm text-muted-foreground">
              Auditoria completa de ações técnicas e decisões da IA
            </p>
          </div>
          <LogViewer />
        </TabsContent>

        {/* Version Control Tab */}
        <TabsContent value="versions" className="space-y-0">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              🔁 Controle de Versão Incremental
            </h3>
            <p className="text-sm text-muted-foreground">
              Histórico de evolução do plano de ação e marcos de desenvolvimento
            </p>
          </div>
          <VersionControl
            onVersionChange={(version) => {
              setNotifications((prev) => [
                `Nova versão criada: ${version.versao}`,
                ...prev.slice(0, 4),
              ]);
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Enhanced Integration Status */}
      {systemHealth && (
        <Card className="mt-8 card-enhanced border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-primary" />
              Status da Integração Inteligente - Lawdesk 2025
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-3">🔗 Conexões Ativas</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sistema IA 2025</span>
                    <Badge className="bg-green-100 text-green-800">
                      <Bot className="h-3 w-3 mr-1" />
                      Operacional
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backlog → Plano Técnico</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Ativo
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Análise IA Unificada</span>
                    <Badge className="bg-green-100 text-green-800">
                      <Brain className="h-3 w-3 mr-1" />
                      Sincronizado
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Execução Contínua</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      <Play className="h-3 w-3 mr-1" />
                      Monitorando
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Logs Centralizados</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      <FileText className="h-3 w-3 mr-1" />
                      Operacional
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">📊 Métricas Inteligentes</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Eficiência Geral</span>
                      <span>
                        {Math.round(
                          (systemHealth.completionRate +
                            systemHealth.backlogExecutionRate +
                            systemHealth.intelligentSuccessRate) /
                            3,
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        (systemHealth.completionRate +
                          systemHealth.backlogExecutionRate +
                          systemHealth.intelligentSuccessRate) /
                        3
                      }
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Automação IA</span>
                      <span>
                        {Math.round(
                          (systemHealth.intelligentTasks /
                            (systemHealth.totalTasks +
                              systemHealth.intelligentTasks)) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        (systemHealth.intelligentTasks /
                          (systemHealth.totalTasks +
                            systemHealth.intelligentTasks)) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cobertura IA</span>
                      <span>
                        {Math.round(
                          (systemHealth.aiAnalyses /
                            (systemHealth.totalTasks +
                              systemHealth.totalBacklogItems +
                              systemHealth.intelligentTasks)) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        (systemHealth.aiAnalyses /
                          (systemHealth.totalTasks +
                            systemHealth.totalBacklogItems +
                            systemHealth.intelligentTasks)) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">🎯 Próximas Ações IA</h4>
                <div className="space-y-2 text-sm">
                  {systemHealth.intelligentPending > 0 && (
                    <div className="flex items-center gap-2">
                      <Bot className="h-3 w-3 text-blue-600" />
                      <span>
                        Executar {systemHealth.intelligentPending} tarefas IA
                        pendentes
                      </span>
                    </div>
                  )}
                  {systemHealth.criticalBacklogItems > 0 && (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3 text-red-600" />
                      <span>
                        Processar {systemHealth.criticalBacklogItems} itens
                        críticos do backlog
                      </span>
                    </div>
                  )}
                  {systemHealth.criticalModules > 0 && (
                    <div className="flex items-center gap-2">
                      <Target className="h-3 w-3 text-orange-600" />
                      <span>
                        Atualizar {systemHealth.criticalModules} módulos
                        técnicos críticos
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Brain className="h-3 w-3 text-blue-600" />
                    <span>
                      Próxima análise automática em{" "}
                      {systemHealth.lastAnalysis
                        ? Math.max(
                            0,
                            30 -
                              Math.floor(
                                (Date.now() -
                                  new Date(
                                    systemHealth.lastAnalysis,
                                  ).getTime()) /
                                  (1000 * 60),
                              ),
                          )
                        : 0}{" "}
                      min
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Footer Information */}
      <div className="mt-12 border-t pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground">
          <div>
            <h4 className="font-medium text-foreground mb-2">
              🧠 Sistema Inteligente 2025
            </h4>
            <ul className="space-y-1">
              <li>• Execução contínua e automatizada</li>
              <li>• Análise de sistema em tempo real</li>
              <li>• Geração automática de tarefas</li>
              <li>• Monitoramento inteligente 24/7</li>
              <li>• Aprendizado contínuo e adaptação</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-2">
              🤖 IA Avançada Integrada
            </h4>
            <ul className="space-y-1">
              <li>• Análise preditiva de problemas</li>
              <li>• Detecção automática de gargalos</li>
              <li>• Otimização contínua de performance</li>
              <li>• Classificação inteligente de prioridades</li>
              <li>• Recomendações contextuais personalizadas</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-2">
              📊 Governança Autônoma
            </h4>
            <ul className="space-y-1">
              <li>• Dashboard executivo em tempo real</li>
              <li>• Métricas de ROI e eficiência automatizadas</li>
              <li>• Auditoria completa de todas as ações</li>
              <li>• Controle de versão inteligente</li>
              <li>• Relatórios executivos automáticos</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            Lawdesk CRM - Sistema Inteligente de Governança Autônoma v
            {actionPlanState.versao_atual.versao} • Última atualização:{" "}
            {new Date(
              actionPlanState.versao_atual.data_criacao,
            ).toLocaleString()}{" "}
            • Sistema desenvolvido com IA avançada para gestão autônoma
            contínua, análise preditiva e otimização automática de processos
            jurídicos
          </p>
        </div>
      </div>
    </div>
  );
}
