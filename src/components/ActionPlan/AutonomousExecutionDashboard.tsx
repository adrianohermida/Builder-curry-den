import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  Target,
  TrendingUp,
  Bot,
  Play,
  Pause,
  RefreshCw,
  Calendar,
  BarChart3,
  Award,
  AlertCircle,
  Rocket,
  Timer,
  Cpu,
  Database,
  Shield,
  Sparkles,
} from "lucide-react";

import { continuousActionExecutor } from "../../services/continuousActionExecutor";
import { ModuleName } from "../../types/actionPlan";

interface ExecutionStats {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  modulesAnalyzed: number;
  actionsGenerated: number;
  overallReadiness: number;
  estimatedLaunchDate: string;
}

interface ModuleStatus {
  module: ModuleName;
  maturityLevel: number;
  status: string;
  pendingActions: number;
  criticalIssues: number;
  lastUpdated: string;
  readyForLaunch: boolean;
}

export const AutonomousExecutionDashboard: React.FC = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionHistory, setExecutionHistory] = useState<any[]>([]);
  const [moduleDiagnostics, setModuleDiagnostics] = useState<Map<string, any>>(
    new Map(),
  );
  const [launchReadiness, setLaunchReadiness] = useState<any>(null);
  const [stats, setStats] = useState<ExecutionStats>({
    totalExecutions: 0,
    successfulExecutions: 0,
    failedExecutions: 0,
    averageExecutionTime: 0,
    modulesAnalyzed: 0,
    actionsGenerated: 0,
    overallReadiness: 0,
    estimatedLaunchDate: "",
  });
  const [lastExecution, setLastExecution] = useState<string>("");
  const [autoMode, setAutoMode] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load execution history
      const history = JSON.parse(
        localStorage.getItem("lawdesk-execution-history") || "[]",
      );
      setExecutionHistory(history);

      // Load module diagnostics
      const diagnostics = JSON.parse(
        localStorage.getItem("lawdesk-module-diagnostics") || "{}",
      );
      setModuleDiagnostics(new Map(Object.entries(diagnostics)));

      // Load launch readiness
      const readiness = JSON.parse(
        localStorage.getItem("lawdesk-launch-readiness") || "null",
      );
      setLaunchReadiness(readiness);

      // Calculate stats
      calculateStats(history, diagnostics, readiness);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    }
  };

  const calculateStats = (history: any[], diagnostics: any, readiness: any) => {
    const successfulExecs = history.filter(
      (h) => h.result === "sucesso",
    ).length;
    const failedExecs = history.filter((h) => h.result === "erro").length;
    const totalTime = history.reduce(
      (sum, h) => sum + (h.executionTime || 0),
      0,
    );

    const newStats: ExecutionStats = {
      totalExecutions: history.length,
      successfulExecutions: successfulExecs,
      failedExecutions: failedExecs,
      averageExecutionTime: history.length > 0 ? totalTime / history.length : 0,
      modulesAnalyzed: Object.keys(diagnostics).length,
      actionsGenerated: history.filter((h) => h.author === "IA_Executor")
        .length,
      overallReadiness: readiness?.overallReadiness || 0,
      estimatedLaunchDate: readiness?.estimatedLaunchDate || "",
    };

    setStats(newStats);

    if (history.length > 0) {
      setLastExecution(history[history.length - 1].timestamp);
    }
  };

  const handleExecuteFullCycle = async () => {
    setIsExecuting(true);
    try {
      console.log("🚀 Iniciando execução completa do Plano Lawdesk 2025...");

      const result = await continuousActionExecutor.runFullCycle();

      console.log("✅ Ciclo executado com sucesso:", result);

      // Refresh data
      await loadDashboardData();
    } catch (error) {
      console.error("❌ Erro na execução:", error);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleExecuteImmediateActions = async () => {
    setIsExecuting(true);
    try {
      const results = await continuousActionExecutor.executeImmediateActions();
      console.log("✅ Ações imediatas executadas:", results);
      await loadDashboardData();
    } catch (error) {
      console.error("❌ Erro na execução de ações imediatas:", error);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleGenerateDiagnostics = async () => {
    setIsExecuting(true);
    try {
      const diagnostics =
        await continuousActionExecutor.generateModuleDiagnostics();
      console.log("🔍 Diagnósticos gerados:", diagnostics);
      await loadDashboardData();
    } catch (error) {
      console.error("❌ Erro na geração de diagnósticos:", error);
    } finally {
      setIsExecuting(false);
    }
  };

  const moduleStatuses = useMemo(() => {
    const statuses: ModuleStatus[] = [];

    for (const [module, diagnostic] of moduleDiagnostics) {
      statuses.push({
        module: module as ModuleName,
        maturityLevel: diagnostic.maturityLevel || 0,
        status: diagnostic.status || "desenvolvimento",
        pendingActions: diagnostic.pendingActions || 0,
        criticalIssues: diagnostic.criticalIssues?.length || 0,
        lastUpdated: diagnostic.lastDiagnostic || "",
        readyForLaunch: diagnostic.readyForLaunch || false,
      });
    }

    return statuses.sort((a, b) => b.maturityLevel - a.maturityLevel);
  }, [moduleDiagnostics]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pronto_para_lancamento":
        return "bg-green-100 text-green-800";
      case "producao":
        return "bg-blue-100 text-blue-800";
      case "beta":
        return "bg-yellow-100 text-yellow-800";
      case "desenvolvimento":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMaturityIcon = (level: number) => {
    if (level >= 95) return <Award className="h-4 w-4 text-green-600" />;
    if (level >= 80) return <Target className="h-4 w-4 text-blue-600" />;
    if (level >= 60) return <Activity className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            🧠 Execução Autônoma Lawdesk 2025
          </h1>
          <p className="text-muted-foreground">
            Sistema inteligente de execução contínua e análise automatizada
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isExecuting && (
            <Badge variant="default" className="animate-pulse">
              <Bot className="h-3 w-3 mr-1" />
              Executando IA
            </Badge>
          )}

          {lastExecution && (
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(lastExecution).toLocaleTimeString()}
            </Badge>
          )}
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {stats.overallReadiness.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">Prontidão Geral</p>
              </div>
              <Rocket className="h-8 w-8 text-blue-600" />
            </div>
            <Progress value={stats.overallReadiness} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.totalExecutions}</p>
                <p className="text-xs text-muted-foreground">
                  Execuções Totais
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {stats.successfulExecutions} sucessos, {stats.failedExecutions}{" "}
              falhas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.modulesAnalyzed}</p>
                <p className="text-xs text-muted-foreground">
                  Módulos Analisados
                </p>
              </div>
              <Cpu className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {stats.actionsGenerated} ações geradas automaticamente
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {stats.estimatedLaunchDate
                    ? new Date(stats.estimatedLaunchDate).toLocaleDateString()
                    : "TBD"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Lançamento Estimado
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {stats.averageExecutionTime > 0 &&
                `Tempo médio: ${Math.round(stats.averageExecutionTime)}ms`}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Launch Readiness Alert */}
      {launchReadiness && (
        <Alert
          className={`border-l-4 ${
            launchReadiness.overallReadiness >= 95
              ? "border-green-500 bg-green-50"
              : launchReadiness.overallReadiness >= 80
                ? "border-yellow-500 bg-yellow-50"
                : "border-red-500 bg-red-50"
          }`}
        >
          <Rocket className="h-4 w-4" />
          <AlertTitle>
            🚀 Status de Prontidão para Lançamento:{" "}
            {launchReadiness.overallReadiness.toFixed(1)}%
          </AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-1">
              <p>
                ✅ Módulos prontos: {launchReadiness.modulesReady?.length || 0}
              </p>
              <p>
                ⏳ Módulos pendentes:{" "}
                {launchReadiness.modulesPending?.length || 0}
              </p>
              <p>
                🚨 Bloqueadores críticos:{" "}
                {launchReadiness.criticalBlockers?.length || 0}
              </p>

              {launchReadiness.recommendations &&
                launchReadiness.recommendations.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium">Recomendações:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {launchReadiness.recommendations
                        .slice(0, 3)
                        .map((rec: string, idx: number) => (
                          <li key={idx} className="text-sm">
                            {rec}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Painel de Controle Autônomo
          </CardTitle>
          <CardDescription>
            Execute análises e melhorias automatizadas do sistema Lawdesk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleExecuteFullCycle}
              disabled={isExecuting}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              {isExecuting ? (
                <RefreshCw className="h-6 w-6 animate-spin" />
              ) : (
                <Sparkles className="h-6 w-6" />
              )}
              <span className="font-medium">Ciclo Completo</span>
              <span className="text-xs opacity-70">
                Executa todas as fases automaticamente
              </span>
            </Button>

            <Button
              onClick={handleExecuteImmediateActions}
              disabled={isExecuting}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Play className="h-6 w-6" />
              <span className="font-medium">Ações Imediatas</span>
              <span className="text-xs opacity-70">
                Executa apenas tarefas prioritárias
              </span>
            </Button>

            <Button
              onClick={handleGenerateDiagnostics}
              disabled={isExecuting}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <BarChart3 className="h-6 w-6" />
              <span className="font-medium">Diagnósticos</span>
              <span className="text-xs opacity-70">
                Analisa status de todos os módulos
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="modules">Módulos</TabsTrigger>
          <TabsTrigger value="executions">Execuções</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnósticos</TabsTrigger>
          <TabsTrigger value="readiness">Prontidão</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Status dos Módulos</CardTitle>
              <CardDescription>
                Nível de maturidade e prontidão de cada módulo do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moduleStatuses.map((module) => (
                  <div
                    key={module.module}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getMaturityIcon(module.maturityLevel)}
                      <div>
                        <h4 className="font-medium">{module.module}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className={getStatusColor(module.status)}
                          >
                            {module.status.replace("_", " ")}
                          </Badge>
                          {module.readyForLaunch && (
                            <Badge
                              variant="default"
                              className="bg-green-100 text-green-800"
                            >
                              <Rocket className="h-3 w-3 mr-1" />
                              Pronto
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {module.maturityLevel.toFixed(0)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {module.pendingActions} ações pendentes
                      </div>
                      {module.criticalIssues > 0 && (
                        <div className="text-xs text-red-600 mt-1">
                          {module.criticalIssues} problemas críticos
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="executions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Execuções</CardTitle>
              <CardDescription>
                Registro detalhado de todas as ações executadas automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {executionHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Database className="h-8 w-8 mx-auto mb-2" />
                      <p>Nenhuma execução registrada ainda</p>
                    </div>
                  ) : (
                    executionHistory
                      .slice(-20)
                      .reverse()
                      .map((execution, index) => (
                        <div
                          key={execution.id || index}
                          className="flex items-start gap-3 p-3 border rounded-lg"
                        >
                          <div className="mt-1">
                            {execution.result === "sucesso" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium truncate">
                                {execution.taskName}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {execution.module}
                              </Badge>
                              <Badge
                                variant={
                                  execution.result === "sucesso"
                                    ? "default"
                                    : "destructive"
                                }
                                className="text-xs"
                              >
                                {execution.result}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>
                                {new Date(execution.timestamp).toLocaleString()}
                              </span>
                              <span>{execution.author}</span>
                              {execution.executionTime && (
                                <span>
                                  {Math.round(execution.executionTime)}ms
                                </span>
                              )}
                            </div>
                            {execution.appliedImprovements &&
                              execution.appliedImprovements.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs font-medium text-green-700">
                                    Melhorias aplicadas:
                                  </p>
                                  <ul className="text-xs text-muted-foreground list-disc pl-4 mt-1">
                                    {execution.appliedImprovements
                                      .slice(0, 3)
                                      .map(
                                        (improvement: string, idx: number) => (
                                          <li key={idx}>{improvement}</li>
                                        ),
                                      )}
                                    {execution.appliedImprovements.length >
                                      3 && (
                                      <li>
                                        ... e mais{" "}
                                        {execution.appliedImprovements.length -
                                          3}
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              )}
                            {execution.error && (
                              <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                                <strong>Erro:</strong> {execution.error}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnostics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Diagnósticos Detalhados</CardTitle>
              <CardDescription>
                Análise técnica e funcional de todos os módulos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {moduleStatuses.map((module) => (
                  <Card key={module.module} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{module.module}</h4>
                      {getMaturityIcon(module.maturityLevel)}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Maturidade</span>
                        <span className="font-medium">
                          {module.maturityLevel.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={module.maturityLevel} className="h-2" />

                      <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Ações pendentes
                          </span>
                          <div className="font-medium">
                            {module.pendingActions}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Problemas críticos
                          </span>
                          <div className="font-medium text-red-600">
                            {module.criticalIssues}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <Badge
                          variant="outline"
                          className={getStatusColor(module.status)}
                        >
                          {module.status.replace("_", " ")}
                        </Badge>
                        {module.readyForLaunch && (
                          <Badge
                            variant="default"
                            className="ml-2 bg-green-100 text-green-800"
                          >
                            Pronto para lançamento
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="readiness" className="space-y-4">
          {launchReadiness ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    Relatório de Prontidão para Lançamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {launchReadiness.overallReadiness.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Prontidão Geral
                      </div>
                      <Progress
                        value={launchReadiness.overallReadiness}
                        className="mt-3"
                      />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-lg font-bold text-green-600">
                          {launchReadiness.modulesReady?.length || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Módulos Prontos
                        </div>
                        {launchReadiness.modulesReady &&
                          launchReadiness.modulesReady.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {launchReadiness.modulesReady
                                .slice(0, 3)
                                .map((module: string) => (
                                  <Badge
                                    key={module}
                                    variant="default"
                                    className="bg-green-100 text-green-800 mr-1"
                                  >
                                    {module}
                                  </Badge>
                                ))}
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-lg font-bold text-orange-600">
                          {launchReadiness.modulesPending?.length || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Módulos Pendentes
                        </div>
                        {launchReadiness.modulesPending &&
                          launchReadiness.modulesPending.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {launchReadiness.modulesPending
                                .slice(0, 3)
                                .map((module: string) => (
                                  <Badge
                                    key={module}
                                    variant="outline"
                                    className="mr-1"
                                  >
                                    {module}
                                  </Badge>
                                ))}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>

                  {launchReadiness.estimatedLaunchDate && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">
                          Data estimada de lançamento:
                        </span>
                        <span className="text-blue-600 font-bold">
                          {new Date(
                            launchReadiness.estimatedLaunchDate,
                          ).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {launchReadiness.recommendations &&
                launchReadiness.recommendations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recomendações para Lançamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {launchReadiness.recommendations.map(
                          (rec: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="mt-1.5 w-2 h-2 bg-blue-600 rounded-full" />
                              <span className="text-sm">{rec}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                )}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Shield className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Execute uma análise completa para gerar o relatório de
                  prontidão
                </p>
                <Button
                  className="mt-4"
                  onClick={handleExecuteFullCycle}
                  disabled={isExecuting}
                >
                  Gerar Relatório de Prontidão
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
