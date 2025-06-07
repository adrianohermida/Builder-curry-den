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
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Import enhanced action plan components
import ActionPlanDashboard from "@/components/ActionPlan/ActionPlanDashboard";
import ModuleManager from "@/components/ActionPlan/ModuleManager";
import VersionControl from "@/components/ActionPlan/VersionControl";
import AIAnalyzer from "@/components/ActionPlan/AIAnalyzer";
import LogViewer from "@/components/ActionPlan/LogViewer";

// Import service and types
import ActionPlanService from "@/services/actionPlanService";
import { ActionPlanState, ModuleName } from "@/types/actionPlan";

export default function ActionPlan() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedModule, setSelectedModule] =
    useState<ModuleName>("CRM Jurídico");
  const [state, setState] = useState<ActionPlanState | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);

  const service = ActionPlanService.getInstance();

  useEffect(() => {
    const unsubscribe = service.subscribe((newState) => {
      setState(newState);
    });

    // Initial load
    setState(service.getState());

    return unsubscribe;
  }, [service]);

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

  // Handle notifications from AI analysis
  const handleTaskGenerated = (taskCount: number) => {
    const message = `IA gerou ${taskCount} nova(s) tarefa(s) de melhoria`;
    setNotifications((prev) => [message, ...prev.slice(0, 4)]);

    // Auto-remove notification after 5 seconds
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
    };
    return iconMap[moduleName] || Target;
  };

  // Global system health
  const systemHealth = state
    ? {
        criticalModules: state.modulos.filter(
          (m) => m.saude_geral === "critica",
        ).length,
        totalTasks: state.modulos.reduce(
          (sum, m) =>
            sum +
            m.tarefas_pendentes.length +
            m.em_execucao.length +
            m.concluidas.length,
          0,
        ),
        completionRate:
          state.modulos.length > 0
            ? state.modulos.reduce(
                (sum, m) => sum + m.metricas.taxa_conclusao,
                0,
              ) / state.modulos.length
            : 0,
        aiAnalyses: state.analises_ia.length,
        lastUpdate: state.versao_atual.data_criacao,
      }
    : null;

  if (!state) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          <div>
            <h2 className="text-lg font-semibold">
              Inicializando Plano de Ação
            </h2>
            <p className="text-sm text-muted-foreground">
              Carregando sistema inteligente de gestão...
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
              📋 Plano de Ação Inteligente
            </h1>
            <p className="text-muted-foreground">
              Sistema autônomo de gestão, análise e evolução contínua - v
              {state.versao_atual.versao}
            </p>
          </div>

          {/* System Health Indicator */}
          {systemHealth && (
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  systemHealth.criticalModules === 0
                    ? "bg-green-500"
                    : systemHealth.criticalModules <= 2
                      ? "bg-yellow-500"
                      : "bg-red-500"
                } animate-pulse`}
              />
              <span className="text-sm text-muted-foreground">
                Sistema{" "}
                {systemHealth.criticalModules === 0
                  ? "Saudável"
                  : systemHealth.criticalModules <= 2
                    ? "Atenção"
                    : "Crítico"}
              </span>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {systemHealth && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {systemHealth.totalTasks}
              </div>
              <div className="text-xs text-muted-foreground">Total Tarefas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {Math.round(systemHealth.completionRate)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Conclusão Média
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {systemHealth.aiAnalyses}
              </div>
              <div className="text-xs text-muted-foreground">Análises IA</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {systemHealth.criticalModules}
              </div>
              <div className="text-xs text-muted-foreground">
                Módulos Críticos
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Critical Alerts */}
      {systemHealth && systemHealth.criticalModules > 0 && (
        <Alert className="mb-6 border-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>⚠️ Atenção: Módulos Críticos Detectados</AlertTitle>
          <AlertDescription>
            {systemHealth.criticalModules} módulo(s) necessitam atenção
            imediata. Verifique o dashboard para mais detalhes e ações
            recomendadas.
          </AlertDescription>
        </Alert>
      )}

      {/* AI Notifications */}
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
              <Brain className="h-4 w-4" />
              <AlertTitle>🤖 Atualização da IA</AlertTitle>
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
        <TabsList className="grid grid-cols-5 w-full bg-muted p-1 rounded-lg">
          <TabsTrigger
            value="dashboard"
            className="flex items-center gap-2 data-[state=active]:bg-background"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>

          <TabsTrigger
            value="modules"
            className="flex items-center gap-2 data-[state=active]:bg-background"
          >
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Módulos</span>
          </TabsTrigger>

          <TabsTrigger
            value="ai-analyzer"
            className="flex items-center gap-2 data-[state=active]:bg-background"
          >
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">IA Analyzer</span>
          </TabsTrigger>

          <TabsTrigger
            value="logs"
            className="flex items-center gap-2 data-[state=active]:bg-background"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Logs</span>
          </TabsTrigger>

          <TabsTrigger
            value="versions"
            className="flex items-center gap-2 data-[state=active]:bg-background"
          >
            <GitBranch className="h-4 w-4" />
            <span className="hidden sm:inline">Versões</span>
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-0">
          <ActionPlanDashboard
            onNavigateToModule={handleNavigateToModule}
            onNavigateToLogs={handleNavigateToLogs}
            onNavigateToAnalysis={handleNavigateToAnalysis}
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
                  Gerenciamento de Módulos
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
                    ] as ModuleName[]
                  ).map((module) => {
                    const moduleData = state.modulos.find(
                      (m) => m.modulo === module,
                    );
                    const IconComponent = getModuleIcon(module);

                    return (
                      <Button
                        key={module}
                        variant={
                          selectedModule === module ? "default" : "outline"
                        }
                        onClick={() => setSelectedModule(module)}
                        className="h-auto p-4 flex flex-col items-center gap-2"
                      >
                        <IconComponent className="h-5 w-5" />
                        <span className="text-xs font-medium text-center">
                          {module}
                        </span>
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
              </CardContent>
            </Card>

            {/* Module Manager */}
            <ModuleManager
              selectedModule={selectedModule}
              onModuleChange={setSelectedModule}
            />
          </div>
        </TabsContent>

        {/* AI Analyzer Tab */}
        <TabsContent value="ai-analyzer" className="space-y-0">
          <AIAnalyzer onTaskGenerated={handleTaskGenerated} />
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-0">
          <LogViewer />
        </TabsContent>

        {/* Version Control Tab */}
        <TabsContent value="versions" className="space-y-0">
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

      {/* Footer Information */}
      <div className="mt-12 border-t pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground">
          <div>
            <h4 className="font-medium text-foreground mb-2">
              🎯 Funcionalidades
            </h4>
            <ul className="space-y-1">
              <li>• Gestão inteligente de tarefas por módulo</li>
              <li>• Análise automatizada com IA</li>
              <li>• Controle de versão incremental</li>
              <li>• Logs detalhados de execução</li>
              <li>• Dashboard executivo em tempo real</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-2">
              🤖 Inteligência Artificial
            </h4>
            <ul className="space-y-1">
              <li>• Análise de performance automática</li>
              <li>• Detecção de problemas de UX</li>
              <li>• Identificação de gaps de integração</li>
              <li>• Sugestões de melhoria contextuais</li>
              <li>• Padrões de comportamento do usuário</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-2">
              📊 Métricas & KPIs
            </h4>
            <ul className="space-y-1">
              <li>• Taxa de conclusão por módulo</li>
              <li>• Tempo médio de execução</li>
              <li>• Distribuição de prioridades</li>
              <li>• Score de confiança da IA</li>
              <li>• Evolução histórica do sistema</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            Lawdesk CRM - Plano de Ação Inteligente v{state.versao_atual.versao}{" "}
            • Última atualização:{" "}
            {new Date(state.versao_atual.data_criacao).toLocaleString()} •
            Sistema desenvolvido com IA para gestão autônoma e evolução contínua
          </p>
        </div>
      </div>
    </div>
  );
}
