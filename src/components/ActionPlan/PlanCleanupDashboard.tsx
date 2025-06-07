import React, { useState, useEffect } from "react";
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
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  BarChart3,
  FileText,
  Target,
  Activity,
  TrendingUp,
  Calendar,
  Filter,
  Archive,
  Sparkles,
} from "lucide-react";

import { planCleanupService } from "../../services/planCleanupService";
import { continuousActionExecutor } from "../../services/continuousActionExecutor";

interface CleanupStats {
  totalRemoved: number;
  totalKept: number;
  totalNew: number;
  lastCleanup: string;
  planVersion: string;
  improvementsDetected: number;
}

export const PlanCleanupDashboard: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cleanupStats, setCleanupStats] = useState<CleanupStats>({
    totalRemoved: 0,
    totalKept: 0,
    totalNew: 0,
    lastCleanup: "",
    planVersion: "",
    improvementsDetected: 0,
  });
  const [cleanupHistory, setCleanupHistory] = useState<any[]>([]);
  const [executionResults, setExecutionResults] = useState<any[]>([]);
  const [lastCleanupReport, setLastCleanupReport] = useState<string[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const history = await planCleanupService.getCleanupHistory();
      setCleanupHistory(history);

      if (history.length > 0) {
        const last = history[history.length - 1];
        setCleanupStats({
          totalRemoved: last.removedCount || 0,
          totalKept: last.keptCount || 0,
          totalNew: last.newCount || 0,
          lastCleanup: last.timestamp || "",
          planVersion: last.planVersion || "",
          improvementsDetected: last.improvementsDetected || 0,
        });
        setLastCleanupReport(last.report || []);
      }

      // Load execution results from localStorage
      const execHistory = JSON.parse(
        localStorage.getItem("lawdesk-execution-history") || "[]",
      );
      setExecutionResults(execHistory.slice(-10));
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const handleCleanupAndUpdate = async () => {
    setIsProcessing(true);
    try {
      console.log("🧹 Iniciando limpeza completa do plano...");

      const cleanupResult = await planCleanupService.cleanupAndUpdatePlan();

      console.log("✅ Limpeza concluída:", cleanupResult);

      // Update stats
      setCleanupStats({
        totalRemoved: cleanupResult.removedTasks.length,
        totalKept: cleanupResult.keptTasks.length,
        totalNew: cleanupResult.newTasks.length,
        lastCleanup: new Date().toISOString(),
        planVersion: cleanupResult.updatedPlan.versão,
        improvementsDetected: cleanupResult.removedTasks.length,
      });

      setLastCleanupReport(cleanupResult.cleanupReport);
      await loadDashboardData();
    } catch (error) {
      console.error("❌ Erro na limpeza:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteRemainingActions = async () => {
    setIsProcessing(true);
    try {
      console.log("⚡ Executando apenas ações restantes...");

      const results =
        await planCleanupService.executeRemainingImmediateActions();

      console.log("✅ Execução concluída:", results);

      setExecutionResults(results);
      await loadDashboardData();
    } catch (error) {
      console.error("❌ Erro na execução:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFullCycle = async () => {
    setIsProcessing(true);
    try {
      console.log(
        "🔄 Executando ciclo completo: limpeza + diagnóstico + execução...",
      );

      // 1. Limpeza e atualização
      await handleCleanupAndUpdate();

      // Pequena pausa
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 2. Execução de ações restantes
      await handleExecuteRemainingActions();

      console.log("✅ Ciclo completo concluído!");
    } catch (error) {
      console.error("❌ Erro no ciclo completo:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getCleanupEfficiency = () => {
    if (cleanupStats.totalRemoved + cleanupStats.totalKept === 0) return 0;
    return (
      (cleanupStats.totalRemoved /
        (cleanupStats.totalRemoved + cleanupStats.totalKept)) *
      100
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            🧹 Limpeza e Atualização Inteligente
          </h1>
          <p className="text-muted-foreground">
            Remove tarefas implementadas e executa apenas o que é necessário
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isProcessing && (
            <Badge variant="default" className="animate-pulse">
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              Processando
            </Badge>
          )}

          {cleanupStats.lastCleanup && (
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(cleanupStats.lastCleanup).toLocaleTimeString()}
            </Badge>
          )}

          {cleanupStats.planVersion && (
            <Badge variant="secondary">v{cleanupStats.planVersion}</Badge>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {cleanupStats.totalRemoved}
                </p>
                <p className="text-xs text-muted-foreground">
                  Tarefas Removidas
                </p>
              </div>
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {cleanupStats.improvementsDetected} melhorias detectadas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {cleanupStats.totalKept}
                </p>
                <p className="text-xs text-muted-foreground">
                  Tarefas Mantidas
                </p>
              </div>
              <Archive className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Ainda necessárias
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {cleanupStats.totalNew}
                </p>
                <p className="text-xs text-muted-foreground">Novas Ações</p>
              </div>
              <Sparkles className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Geradas automaticamente
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {getCleanupEfficiency().toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">Eficiência</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <Progress value={getCleanupEfficiency()} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Last Cleanup Report */}
      {lastCleanupReport.length > 0 && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>✅ Última Limpeza Concluída</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-1">
              {lastCleanupReport.map((item, index) => (
                <li key={index} className="text-sm">
                  • {item}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Painel de Controle de Limpeza
          </CardTitle>
          <CardDescription>
            Execute limpeza inteligente e atualização do plano de ação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleCleanupAndUpdate}
              disabled={isProcessing}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              {isProcessing ? (
                <RefreshCw className="h-6 w-6 animate-spin" />
              ) : (
                <Trash2 className="h-6 w-6" />
              )}
              <span className="font-medium">Limpeza Inteligente</span>
              <span className="text-xs opacity-70">
                Remove implementado + novo diagnóstico
              </span>
            </Button>

            <Button
              onClick={handleExecuteRemainingActions}
              disabled={isProcessing}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Zap className="h-6 w-6" />
              <span className="font-medium">Executar Restante</span>
              <span className="text-xs opacity-70">
                Apenas ações realmente pendentes
              </span>
            </Button>

            <Button
              onClick={handleFullCycle}
              disabled={isProcessing}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Activity className="h-6 w-6" />
              <span className="font-medium">Ciclo Completo</span>
              <span className="text-xs opacity-70">
                Limpeza + diagnóstico + execução
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs with detailed information */}
      <Tabs defaultValue="cleanup" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cleanup">Histórico de Limpeza</TabsTrigger>
          <TabsTrigger value="executions">Execuções Recentes</TabsTrigger>
          <TabsTrigger value="status">Status dos Módulos</TabsTrigger>
        </TabsList>

        <TabsContent value="cleanup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Limpezas</CardTitle>
              <CardDescription>
                Registro de todas as limpezas e atualizações realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {cleanupHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-8 w-8 mx-auto mb-2" />
                      <p>Nenhuma limpeza registrada ainda</p>
                    </div>
                  ) : (
                    cleanupHistory
                      .slice()
                      .reverse()
                      .map((cleanup, index) => (
                        <div
                          key={cleanup.id || index}
                          className="flex items-start gap-3 p-3 border rounded-lg"
                        >
                          <div className="mt-1">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">
                                Limpeza v{cleanup.planVersion}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {new Date(
                                  cleanup.timestamp,
                                ).toLocaleDateString()}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                              <div>
                                <span className="text-red-600 font-medium">
                                  {cleanup.removedCount}
                                </span>
                                <span className="text-muted-foreground">
                                  {" "}
                                  removidas
                                </span>
                              </div>
                              <div>
                                <span className="text-blue-600 font-medium">
                                  {cleanup.keptCount}
                                </span>
                                <span className="text-muted-foreground">
                                  {" "}
                                  mantidas
                                </span>
                              </div>
                              <div>
                                <span className="text-green-600 font-medium">
                                  {cleanup.newCount}
                                </span>
                                <span className="text-muted-foreground">
                                  {" "}
                                  novas
                                </span>
                              </div>
                            </div>
                            {cleanup.report && cleanup.report.length > 0 && (
                              <div className="mt-2 text-xs text-muted-foreground">
                                <details>
                                  <summary className="cursor-pointer">
                                    Ver relatório completo
                                  </summary>
                                  <ul className="mt-1 space-y-1 pl-4">
                                    {cleanup.report.map(
                                      (item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                      ),
                                    )}
                                  </ul>
                                </details>
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

        <TabsContent value="executions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Execuções Recentes</CardTitle>
              <CardDescription>
                Ações executadas após a limpeza inteligente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {executionResults.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Target className="h-8 w-8 mx-auto mb-2" />
                      <p>Nenhuma execução registrada ainda</p>
                    </div>
                  ) : (
                    executionResults
                      .slice()
                      .reverse()
                      .map((execution, index) => (
                        <div
                          key={execution.taskId || index}
                          className="flex items-start gap-3 p-3 border rounded-lg"
                        >
                          <div className="mt-1">
                            {execution.success ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">
                                {execution.taskName || "Execução"}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {execution.module}
                              </Badge>
                              <Badge
                                variant={
                                  execution.success ? "default" : "destructive"
                                }
                                className="text-xs"
                              >
                                {execution.success ? "Sucesso" : "Erro"}
                              </Badge>
                            </div>
                            {execution.realImprovements &&
                              execution.realImprovements.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs font-medium text-green-700">
                                    Melhorias aplicadas:
                                  </p>
                                  <ul className="text-xs text-muted-foreground list-disc pl-4 mt-1">
                                    {execution.realImprovements.map(
                                      (improvement: string, idx: number) => (
                                        <li key={idx}>{improvement}</li>
                                      ),
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

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Status Atual dos Módulos</CardTitle>
              <CardDescription>
                Estado após a última limpeza e atualização
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                <p>Execute uma limpeza para atualizar o status dos módulos</p>
                <Button
                  className="mt-4"
                  onClick={handleCleanupAndUpdate}
                  disabled={isProcessing}
                >
                  Atualizar Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
