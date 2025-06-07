import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  RefreshCw,
  Download,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Users,
  Target,
  Brain,
  Shield,
  Gauge,
  Calendar,
  Eye,
  Settings,
  PlayCircle,
  PauseCircle,
  Lightbulb,
  GitBranch,
  Palette,
  FlaskConical,
  Kanban,
  ArrowRight,
  Plus,
  Layers,
  TrendingDown,
  Star,
  MessageSquare,
  Flag,
  Archive,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import ActionPlanService from "@/services/actionPlanService";
import BacklogService from "@/services/backlogService";
import IntegratedBacklog from "./IntegratedBacklog";
import {
  ActionPlanState,
  ModuleName,
  TaskStatus,
  TaskPriority,
  ActionPlanFilter,
} from "@/types/actionPlan";
import { BacklogState, BacklogItem } from "@/types/backlog";

interface EnhancedDashboardProps {
  onNavigateToModule?: (module: ModuleName) => void;
  onNavigateToLogs?: () => void;
  onNavigateToAnalysis?: () => void;
  onNavigateToBacklog?: () => void;
}

export default function EnhancedActionPlanDashboard({
  onNavigateToModule,
  onNavigateToLogs,
  onNavigateToAnalysis,
  onNavigateToBacklog,
}: EnhancedDashboardProps) {
  const [state, setState] = useState<ActionPlanState | null>(null);
  const [backlogState, setBacklogState] = useState<BacklogState | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [autoAnalysisEnabled, setAutoAnalysisEnabled] = useState(true);
  const [filter, setFilter] = useState<ActionPlanFilter>({});
  const [showBacklogPanel, setShowBacklogPanel] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [selectedView, setSelectedView] = useState<
    "dashboard" | "backlog" | "hybrid"
  >("hybrid");
  const [showHiddenModules, setShowHiddenModules] = useState(false);

  const service = useMemo(() => ActionPlanService.getInstance(), []);
  const backlogService = useMemo(() => BacklogService.getInstance(), []);

  useEffect(() => {
    const unsubscribeActionPlan = service.subscribe((newState) => {
      setState(newState);
      setLoading(false);
    });

    const unsubscribeBacklog = backlogService.subscribe((newState) => {
      setBacklogState(newState);
    });

    // Initial load
    setState(service.getState());
    setBacklogState(backlogService.getState());
    setLoading(false);

    return () => {
      unsubscribeActionPlan();
      unsubscribeBacklog();
    };
  }, [service, backlogService]);

  // Computed statistics including backlog
  const globalStats = useMemo(() => {
    if (!state || !backlogState) return null;

    const allTasks = state.modulos.flatMap((m) => [
      ...m.tarefas_pendentes,
      ...m.em_execucao,
      ...m.concluidas,
    ]);

    // Filter hidden modules for regular view
    const visibleModules = showHiddenModules
      ? state.modulos
      : state.modulos.filter(
          (m) => !["Design System", "Features Beta"].includes(m.modulo),
        );

    const criticalTasks = allTasks.filter((t) => t.prioridade === "critica");
    const highTasks = allTasks.filter((t) => t.prioridade === "alta");
    const completedTasks = allTasks.filter((t) => t.status === "concluida");
    const inProgressTasks = allTasks.filter((t) => t.status === "em_execucao");
    const pendingTasks = allTasks.filter((t) => t.status === "pendente");

    const criticalModules = visibleModules.filter(
      (m) => m.saude_geral === "critica",
    ).length;
    const avgCompletion =
      visibleModules.length > 0
        ? visibleModules.reduce(
            (sum, m) => sum + m.metricas.taxa_conclusao,
            0,
          ) / visibleModules.length
        : 0;

    // Backlog stats
    const backlogItems = backlogState.items;
    const criticalBacklogItems = backlogItems.filter(
      (i) => i.prioridade === "critica",
    ).length;
    const aiProcessedItems = backlogItems.filter((i) => i.analise_ia).length;
    const recentBacklogActivity = backlogItems.filter((i) => {
      const itemDate = new Date(i.data_atualizacao || i.data_criacao);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return itemDate >= yesterday;
    }).length;

    // Conversion metrics
    const convertedItems = backlogItems.filter(
      (i) => i.tarefas_relacionadas && i.tarefas_relacionadas.length > 0,
    ).length;
    const conversionRate =
      backlogItems.length > 0
        ? (convertedItems / backlogItems.length) * 100
        : 0;

    // Hidden modules stats
    const designSystemModule = state.modulos.find(
      (m) => m.modulo === "Design System",
    );
    const featuresBetaModule = state.modulos.find(
      (m) => m.modulo === "Features Beta",
    );

    return {
      totalTasks: allTasks.length,
      criticalTasks: criticalTasks.length,
      highTasks: highTasks.length,
      completedTasks: completedTasks.length,
      inProgressTasks: inProgressTasks.length,
      pendingTasks: pendingTasks.length,
      completionRate:
        allTasks.length > 0
          ? (completedTasks.length / allTasks.length) * 100
          : 0,
      criticalModules,
      avgCompletion,
      recentAnalyses: state.analises_ia.length,
      aiSuggestions: allTasks.filter((t) => t.sugestao_IA).length,

      // Backlog stats
      totalBacklogItems: backlogItems.length,
      criticalBacklogItems,
      aiProcessedItems,
      recentBacklogActivity,
      convertedItems,
      conversionRate,
      backlogExecutionRate: backlogState.estatisticas.taxa_execucao,

      // Hidden modules
      designSystemHealth: designSystemModule?.saude_geral || "boa",
      featuresBetaHealth: featuresBetaModule?.saude_geral || "boa",
      designSystemTasks: designSystemModule
        ? designSystemModule.tarefas_pendentes.length +
          designSystemModule.em_execucao.length +
          designSystemModule.concluidas.length
        : 0,
      featuresBetaTasks: featuresBetaModule
        ? featuresBetaModule.tarefas_pendentes.length +
          featuresBetaModule.em_execucao.length +
          featuresBetaModule.concluidas.length
        : 0,
    };
  }, [state, backlogState, showHiddenModules]);

  // Handle AI analysis
  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      // Run both action plan and backlog analysis
      await Promise.all([
        service.runAIAnalysis("performance", "global"),
        backlogService.processBacklogWithAI(),
      ]);

      addNotification(
        "Análise IA completa executada em plano de ação e backlog",
      );
    } catch (error) {
      console.error("Error running analysis:", error);
      addNotification("Erro na análise IA", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle task generation notification
  const handleTaskGenerated = (count: number) => {
    addNotification(`${count} nova(s) tarefa(s) gerada(s) pela IA`);
  };

  // Handle backlog item selection
  const handleBacklogItemSelect = (item: BacklogItem) => {
    addNotification(`Item "${item.titulo}" selecionado para análise`);
  };

  // Add notification
  const addNotification = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setNotifications((prev) => [message, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n !== message));
    }, 5000);
  };

  // Export functionality
  const handleExport = () => {
    const actionPlanData = service.exportData({
      formato: "json",
      escopo: "completo",
      incluir_logs: true,
      incluir_historico: true,
    });

    const backlogData = backlogService.exportBacklog({
      formato: "json",
      incluir_analises: true,
      incluir_anexos: false,
      incluir_historico: true,
    });

    const combinedData = {
      timestamp: new Date().toISOString(),
      action_plan: JSON.parse(actionPlanData),
      backlog: JSON.parse(backlogData),
      integration_stats: globalStats,
    };

    const blob = new Blob([JSON.stringify(combinedData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lawdesk-governance-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get module icon
  const getModuleIcon = (moduleName: ModuleName) => {
    const iconMap = {
      "CRM Jurídico": Users,
      "IA Jurídica": Brain,
      GED: Archive,
      Tarefas: CheckCircle,
      Publicações: Calendar,
      Atendimento: MessageSquare,
      Agenda: Calendar,
      Financeiro: TrendingUp,
      Configurações: Settings,
      "Design System": Palette,
      "Features Beta": FlaskConical,
    };
    return iconMap[moduleName] || Target;
  };

  if (loading || !state || !globalStats || !backlogState) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Carregando sistema de governança...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive space-y-6 py-6">
      {/* Notifications */}
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-2"
          >
            <Alert className="border-primary bg-primary/5">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>{notification}</AlertDescription>
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            🚀 Governança Inteligente Lawdesk
          </h1>
          <p className="text-muted-foreground">
            Sistema híbrido de plano de ação técnico + backlog estratégico com
            IA integrada
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowHiddenModules(!showHiddenModules)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {showHiddenModules
              ? "Ocultar Módulos Beta"
              : "Mostrar Módulos Beta"}
          </Button>

          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Completo
          </Button>

          <Button
            onClick={handleRunAnalysis}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            {loading ? "Analisando..." : "Análise IA Completa"}
          </Button>
        </div>
      </div>

      {/* View Selector */}
      <Card className="card-enhanced">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Visualização:</span>
              <Tabs
                value={selectedView}
                onValueChange={(value: any) => setSelectedView(value)}
              >
                <TabsList>
                  <TabsTrigger
                    value="dashboard"
                    className="flex items-center gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Dashboard Técnico
                  </TabsTrigger>
                  <TabsTrigger
                    value="backlog"
                    className="flex items-center gap-2"
                  >
                    <Kanban className="h-4 w-4" />
                    Backlog Estratégico
                  </TabsTrigger>
                  <TabsTrigger
                    value="hybrid"
                    className="flex items-center gap-2"
                  >
                    <Layers className="h-4 w-4" />
                    Visão Híbrida
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {globalStats.totalTasks} tarefas técnicas
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Lightbulb className="h-3 w-3" />
                {globalStats.totalBacklogItems} itens backlog
              </Badge>
              {showHiddenModules && (
                <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
                  <FlaskConical className="h-3 w-3" />
                  Módulos Beta Ativos
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Eficiência Global
                </p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    (globalStats.completionRate +
                      globalStats.backlogExecutionRate) /
                      2,
                  )}
                  %
                </p>
              </div>
              <Gauge className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <Progress
                value={
                  (globalStats.completionRate +
                    globalStats.backlogExecutionRate) /
                  2
                }
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Conversão IA
                </p>
                <p className="text-2xl font-bold text-primary">
                  {Math.round(globalStats.conversionRate)}%
                </p>
              </div>
              <ArrowRight className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary">
                {globalStats.convertedItems} itens convertidos
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Críticos Total
                </p>
                <p className="text-2xl font-bold text-destructive">
                  {globalStats.criticalTasks + globalStats.criticalBacklogItems}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <div className="mt-2">
              <div className="flex gap-1">
                <Badge className="bg-red-100 text-red-800 text-xs">
                  {globalStats.criticalTasks} técnicas
                </Badge>
                <Badge className="bg-orange-100 text-orange-800 text-xs">
                  {globalStats.criticalBacklogItems} backlog
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Análises IA
                </p>
                <p className="text-2xl font-bold text-success">
                  {globalStats.recentAnalyses + globalStats.aiProcessedItems}
                </p>
              </div>
              <Brain className="h-8 w-8 text-success" />
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800">
                {globalStats.recentBacklogActivity} atividades recentes
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hidden Modules Preview */}
      {showHiddenModules && (
        <Card className="card-enhanced border-purple-200 bg-purple-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-purple-600" />
              Módulos Beta - Análise Avançada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Design System Module */}
              <div className="border border-purple-200 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-purple-600" />
                    <h4 className="font-medium">🎨 Design System</h4>
                  </div>
                  <Badge
                    className={
                      globalStats.designSystemHealth === "critica"
                        ? "bg-red-100 text-red-800"
                        : globalStats.designSystemHealth === "regular"
                          ? "bg-yellow-100 text-yellow-800"
                          : globalStats.designSystemHealth === "boa"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                    }
                  >
                    {globalStats.designSystemHealth}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Análise dinâmica de consistência visual, componentes UI e
                  padrões de design
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {globalStats.designSystemTasks} tarefas ativas
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onNavigateToModule?.("Design System")}
                  >
                    Analisar Design
                  </Button>
                </div>
              </div>

              {/* Features Beta Module */}
              <div className="border border-purple-200 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-5 w-5 text-purple-600" />
                    <h4 className="font-medium">🧪 Features Beta</h4>
                  </div>
                  <Badge
                    className={
                      globalStats.featuresBetaHealth === "critica"
                        ? "bg-red-100 text-red-800"
                        : globalStats.featuresBetaHealth === "regular"
                          ? "bg-yellow-100 text-yellow-800"
                          : globalStats.featuresBetaHealth === "boa"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                    }
                  >
                    {globalStats.featuresBetaHealth}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Laboratório para novos módulos, recursos experimentais e
                  tecnologias emergentes
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {globalStats.featuresBetaTasks} experimentos ativos
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onNavigateToModule?.("Features Beta")}
                  >
                    Ver Experimentos
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Area */}
      <div
        className={`${selectedView === "hybrid" ? "grid grid-cols-1 lg:grid-cols-3 gap-6" : ""}`}
      >
        {/* Technical Dashboard */}
        {(selectedView === "dashboard" || selectedView === "hybrid") && (
          <div className={selectedView === "hybrid" ? "lg:col-span-2" : ""}>
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Dashboard Técnico - Plano de Ação
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Module Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {state.modulos
                    .filter(
                      (module) =>
                        showHiddenModules ||
                        !["Design System", "Features Beta"].includes(
                          module.modulo,
                        ),
                    )
                    .map((module) => {
                      const IconComponent = getModuleIcon(module.modulo);
                      const totalTasks =
                        module.tarefas_pendentes.length +
                        module.em_execucao.length +
                        module.concluidas.length;

                      const isHiddenModule = [
                        "Design System",
                        "Features Beta",
                      ].includes(module.modulo);

                      return (
                        <motion.div
                          key={module.modulo}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                            isHiddenModule
                              ? "border-purple-200 bg-purple-50/30"
                              : ""
                          }`}
                          onClick={() => onNavigateToModule?.(module.modulo)}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <IconComponent
                                className={`h-5 w-5 ${isHiddenModule ? "text-purple-600" : "text-primary"}`}
                              />
                              <h3 className="font-medium text-sm">
                                {module.modulo}
                              </h3>
                              {isHiddenModule && (
                                <Badge className="bg-purple-100 text-purple-800 text-xs">
                                  Beta
                                </Badge>
                              )}
                            </div>
                            <Badge
                              className={
                                module.saude_geral === "critica"
                                  ? "bg-red-100 text-red-800"
                                  : module.saude_geral === "regular"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : module.saude_geral === "boa"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-green-100 text-green-800"
                              }
                            >
                              {module.saude_geral}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Conclusão</span>
                              <span>
                                {Math.round(module.metricas.taxa_conclusao)}%
                              </span>
                            </div>
                            <Progress
                              value={module.metricas.taxa_conclusao}
                              className="h-2"
                            />

                            <div className="grid grid-cols-3 gap-1 text-xs">
                              <div className="text-center">
                                <div className="font-medium text-red-600">
                                  {module.tarefas_pendentes.length}
                                </div>
                                <div className="text-muted-foreground">
                                  Pendentes
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium text-blue-600">
                                  {module.em_execucao.length}
                                </div>
                                <div className="text-muted-foreground">
                                  Execução
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium text-green-600">
                                  {module.concluidas.length}
                                </div>
                                <div className="text-muted-foreground">
                                  Concluídas
                                </div>
                              </div>
                            </div>

                            {module.melhorias_sugeridas.length > 0 && (
                              <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                                <Brain className="h-3 w-3" />
                                {module.melhorias_sugeridas.length} sugestões IA
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">
                      {globalStats.totalTasks}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total Tarefas
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-success">
                      {Math.round(globalStats.completionRate)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Taxa Conclusão
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-warning">
                      {globalStats.inProgressTasks}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Em Execução
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">
                      {globalStats.aiSuggestions}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Sugestões IA
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Integrated Backlog */}
        {(selectedView === "backlog" || selectedView === "hybrid") && (
          <div className={selectedView === "hybrid" ? "lg:col-span-1" : ""}>
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Kanban className="h-5 w-5 text-primary" />
                  Backlog Estratégico
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div
                  className={
                    selectedView === "hybrid" ? "h-96 overflow-hidden" : ""
                  }
                >
                  <IntegratedBacklog
                    onItemSelect={handleBacklogItemSelect}
                    onTaskGenerated={handleTaskGenerated}
                    isEmbedded={selectedView === "hybrid"}
                  />
                </div>
                {selectedView === "hybrid" && onNavigateToBacklog && (
                  <div className="p-4 border-t">
                    <Button
                      variant="outline"
                      onClick={onNavigateToBacklog}
                      className="w-full"
                    >
                      Ver Backlog Completo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Conversion Analytics */}
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            Análise de Conversão: Ideias → Tarefas → Entregas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Lightbulb className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {globalStats.totalBacklogItems}
              </div>
              <div className="text-sm text-muted-foreground">
                Ideias no Backlog
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {globalStats.aiProcessedItems} processadas pela IA
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <ArrowRight className="h-6 w-6 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {globalStats.convertedItems}
              </div>
              <div className="text-sm text-muted-foreground">
                Convertidas em Tarefas
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round(globalStats.conversionRate)}% taxa de conversão
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {globalStats.completedTasks}
              </div>
              <div className="text-sm text-muted-foreground">
                Tarefas Concluídas
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round(globalStats.completionRate)}% taxa de conclusão
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-center">
            <Progress
              value={globalStats.conversionRate}
              className="w-full max-w-md"
            />
            <span className="ml-3 text-sm font-medium">
              {Math.round(globalStats.conversionRate)}% eficiência de conversão
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          onClick={() => onNavigateToModule?.("CRM Jurídico")}
          className="h-auto p-4 flex flex-col items-center gap-2"
          variant="outline"
        >
          <Users className="h-6 w-6" />
          <span className="font-medium">Gerenciar Módulos</span>
          <span className="text-xs text-muted-foreground">
            {globalStats.totalTasks} tarefas ativas
          </span>
        </Button>

        <Button
          onClick={onNavigateToBacklog}
          className="h-auto p-4 flex flex-col items-center gap-2"
          variant="outline"
        >
          <Kanban className="h-6 w-6" />
          <span className="font-medium">Backlog Kanban</span>
          <span className="text-xs text-muted-foreground">
            {globalStats.totalBacklogItems} itens estratégicos
          </span>
        </Button>

        <Button
          onClick={onNavigateToAnalysis}
          className="h-auto p-4 flex flex-col items-center gap-2"
          variant="outline"
        >
          <Brain className="h-6 w-6" />
          <span className="font-medium">Análise IA</span>
          <span className="text-xs text-muted-foreground">
            {globalStats.recentAnalyses + globalStats.aiProcessedItems} análises
          </span>
        </Button>

        <Button
          onClick={onNavigateToLogs}
          className="h-auto p-4 flex flex-col items-center gap-2"
          variant="outline"
        >
          <Activity className="h-6 w-6" />
          <span className="font-medium">Logs & Auditoria</span>
          <span className="text-xs text-muted-foreground">
            Histórico completo
          </span>
        </Button>
      </div>
    </div>
  );
}
