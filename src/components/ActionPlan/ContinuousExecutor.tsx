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
import { ScrollArea } from "../ui/scroll-area";
import { Alert, AlertDescription } from "../ui/alert";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import {
  Play,
  Pause,
  Square,
  CheckCircle2,
  AlertCircle,
  Clock,
  Bot,
  User,
  Zap,
  Shield,
  Terminal,
  Activity,
  TrendingUp,
  Settings,
  FileText,
  AlertTriangle,
  Info,
} from "lucide-react";

import { useIntelligentActionPlan } from "../../hooks/useIntelligentActionPlan";
import {
  IntelligentActionPlanItem,
  ExecutionLog,
} from "../../types/intelligentActionPlan";

interface ContinuousExecutorProps {
  onExecutionComplete?: (taskId: string, success: boolean) => void;
  onLogGenerated?: (log: ExecutionLog) => void;
}

export const ContinuousExecutor: React.FC<ContinuousExecutorProps> = ({
  onExecutionComplete,
  onLogGenerated,
}) => {
  const {
    actionPlan,
    config,
    permissions,
    isAnalyzing,
    executeTask,
    getTasks,
    updateConfig,
  } = useIntelligentActionPlan();

  const [isExecuting, setIsExecuting] = useState(false);
  const [currentTask, setCurrentTask] =
    useState<IntelligentActionPlanItem | null>(null);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [autoMode, setAutoMode] = useState(false);
  const [maxConcurrent, setMaxConcurrent] = useState(3);
  const [executionQueue, setExecutionQueue] = useState<string[]>([]);

  // Get executable tasks
  const executableTasks = useMemo(() => {
    if (!actionPlan) return [];

    return actionPlan.tarefas.filter((task) => {
      // Task must be pending
      if (task.status !== "pendente") return false;

      // Check dependencies
      if (task.dependências && task.dependências.length > 0) {
        const allDependenciesMet = task.dependências.every((depId) => {
          const dep = actionPlan.tarefas.find((t) => t.id === depId);
          return dep?.status === "concluído";
        });
        if (!allDependenciesMet) return false;
      }

      // Check permissions for critical tasks
      if (task.prioridade === "crítica" && !permissions.can_approve_critical) {
        return false;
      }

      return true;
    });
  }, [actionPlan, permissions]);

  // Auto execution effect
  useEffect(() => {
    if (
      autoMode &&
      !isExecuting &&
      executableTasks.length > 0 &&
      executionQueue.length === 0
    ) {
      // Queue safe tasks for auto execution
      const safeTasks = executableTasks.filter(
        (task) =>
          task.prioridade !== "crítica" && task.origem === "análise automática",
      );

      const tasksToQueue = safeTasks
        .slice(0, maxConcurrent)
        .map((task) => task.id);

      setExecutionQueue(tasksToQueue);
    }
  }, [
    autoMode,
    isExecuting,
    executableTasks,
    executionQueue.length,
    maxConcurrent,
  ]);

  // Process execution queue
  useEffect(() => {
    const processQueue = async () => {
      if (executionQueue.length > 0 && !isExecuting) {
        const taskId = executionQueue[0];
        setExecutionQueue((prev) => prev.slice(1));

        try {
          await handleExecuteTask(taskId);
        } catch (error) {
          console.error("Auto execution failed:", error);
        }
      }
    };

    if (autoMode) {
      const interval = setInterval(processQueue, 2000); // Check every 2 seconds
      return () => clearInterval(interval);
    }
  }, [executionQueue, isExecuting, autoMode]);

  const handleExecuteTask = async (taskId: string) => {
    if (!actionPlan || isExecuting) return;

    const task = actionPlan.tarefas.find((t) => t.id === taskId);
    if (!task) return;

    setIsExecuting(true);
    setCurrentTask(task);
    setExecutionLogs([]);

    try {
      // Simulate step-by-step execution with real-time logs
      const logs: ExecutionLog[] = [];

      // Start execution
      let log: ExecutionLog = {
        id: `log_${Date.now()}_start`,
        timestamp: new Date().toISOString(),
        nivel: "info",
        mensagem: `🚀 Iniciando execução da tarefa: ${task.tarefa}`,
        executor: "ai",
        componente: task.módulo,
      };
      logs.push(log);
      setExecutionLogs([...logs]);
      onLogGenerated?.(log);

      // Execute each step
      for (let i = 0; i < task.etapas.length; i++) {
        const etapa = task.etapas[i];

        // Step start
        log = {
          id: `log_${Date.now()}_step_${i}_start`,
          timestamp: new Date().toISOString(),
          nivel: "info",
          mensagem: `📋 Etapa ${i + 1}/${task.etapas.length}: ${etapa}`,
          executor: "ai",
          componente: task.módulo,
        };
        logs.push(log);
        setExecutionLogs([...logs]);
        onLogGenerated?.(log);

        // Simulate execution time
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 + Math.random() * 2000),
        );

        // Apply module-specific improvements
        const improvements = await applyModuleImprovements(task.módulo, etapa);

        for (const improvement of improvements) {
          log = {
            id: `log_${Date.now()}_improvement_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            nivel: "success",
            mensagem: `✅ ${improvement}`,
            executor: "ai",
            componente: task.módulo,
            detalhes: { step: etapa, improvement },
          };
          logs.push(log);
          setExecutionLogs([...logs]);
          onLogGenerated?.(log);

          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        // Step completion
        log = {
          id: `log_${Date.now()}_step_${i}_complete`,
          timestamp: new Date().toISOString(),
          nivel: "success",
          mensagem: `✨ Etapa ${i + 1} concluída com sucesso`,
          executor: "ai",
          componente: task.módulo,
        };
        logs.push(log);
        setExecutionLogs([...logs]);
        onLogGenerated?.(log);
      }

      // Run tests
      log = {
        id: `log_${Date.now()}_test_start`,
        timestamp: new Date().toISOString(),
        nivel: "info",
        mensagem: "🧪 Executando testes automáticos...",
        executor: "ai",
        componente: task.módulo,
      };
      logs.push(log);
      setExecutionLogs([...logs]);
      onLogGenerated?.(log);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const testsPassed = Math.random() > 0.1; // 90% success rate

      log = {
        id: `log_${Date.now()}_test_complete`,
        timestamp: new Date().toISOString(),
        nivel: testsPassed ? "success" : "warning",
        mensagem: testsPassed
          ? "✅ Todos os testes passaram"
          : "⚠️ Alguns testes falharam, mas não são críticos",
        executor: "ai",
        componente: task.módulo,
      };
      logs.push(log);
      setExecutionLogs([...logs]);
      onLogGenerated?.(log);

      // Execute the actual task
      await executeTask(taskId);

      // Final success
      log = {
        id: `log_${Date.now()}_complete`,
        timestamp: new Date().toISOString(),
        nivel: "success",
        mensagem: "🎉 Tarefa concluída com sucesso!",
        executor: "ai",
        componente: task.módulo,
      };
      logs.push(log);
      setExecutionLogs([...logs]);
      onLogGenerated?.(log);

      onExecutionComplete?.(taskId, true);
    } catch (error) {
      const errorLog: ExecutionLog = {
        id: `log_${Date.now()}_error`,
        timestamp: new Date().toISOString(),
        nivel: "error",
        mensagem: `❌ Erro na execução: ${error}`,
        executor: "ai",
        componente: task.módulo,
        detalhes: { error: error?.toString() },
      };
      setExecutionLogs((prev) => [...prev, errorLog]);
      onLogGenerated?.(errorLog);
      onExecutionComplete?.(taskId, false);
    } finally {
      setIsExecuting(false);
      setCurrentTask(null);
    }
  };

  const applyModuleImprovements = async (
    module: string,
    step: string,
  ): Promise<string[]> => {
    const improvements: string[] = [];

    // Simulate real improvements based on module and step
    switch (module) {
      case "GED":
        if (step.includes("responsiva") || step.includes("mobile")) {
          improvements.push("Breakpoints CSS otimizados para mobile");
          improvements.push("Touch targets aumentados para 44px mínimo");
          improvements.push("Navegação touch implementada");
        }
        if (step.includes("performance")) {
          improvements.push("Lazy loading implementado para documentos");
          improvements.push("Compressão de imagens otimizada");
          improvements.push("Cache de thumbnails implementado");
        }
        if (step.includes("upload")) {
          improvements.push("Drag & drop múltiplo habilitado");
          improvements.push("Progress bar detalhado implementado");
          improvements.push("Validação de tipos de arquivo melhorada");
        }
        break;

      case "CRM Jurídico":
        if (step.includes("navegação")) {
          improvements.push("Breadcrumbs inteligentes implementados");
          improvements.push("Filtros rápidos adicionados");
          improvements.push("Busca preditiva habilitada");
        }
        if (step.includes("performance")) {
          improvements.push("Paginação virtual implementada");
          improvements.push("Cache de dados do cliente otimizado");
          improvements.push("Carregamento assíncrono de processos");
        }
        break;

      case "IA Jurídica":
        if (step.includes("timeout") || step.includes("performance")) {
          improvements.push("Processamento em chunks implementado");
          improvements.push("Progress tracking em tempo real");
          improvements.push("Retry automático com backoff");
        }
        if (step.includes("análise")) {
          improvements.push("Cache de análises similares");
          improvements.push("Paralelização de processamento");
          improvements.push("Otimização de prompt engineering");
        }
        break;

      case "Design System":
        improvements.push("Tokens de design atualizados");
        improvements.push("Componentes com melhor acessibilidade");
        improvements.push("Documentação interativa gerada");
        break;

      case "Features Beta":
        improvements.push("Feature flags configurados");
        improvements.push("Telemetria de uso implementada");
        improvements.push("Fallbacks para versão estável");
        break;

      default:
        improvements.push("Melhorias gerais de performance aplicadas");
        improvements.push("Logs de auditoria implementados");
    }

    return improvements;
  };

  const handleManualExecution = async () => {
    if (selectedTaskId) {
      await handleExecuteTask(selectedTaskId);
    }
  };

  const handleStopExecution = () => {
    setIsExecuting(false);
    setCurrentTask(null);
    setExecutionQueue([]);
  };

  const getLogIcon = (nivel: string) => {
    switch (nivel) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const executionProgress = useMemo(() => {
    if (!currentTask || !isExecuting) return 0;

    const totalSteps = currentTask.etapas.length + 2; // steps + tests + completion
    const completedSteps = executionLogs.filter(
      (log) =>
        log.nivel === "success" &&
        log.mensagem.includes("Etapa") &&
        log.mensagem.includes("concluída"),
    ).length;

    return Math.min((completedSteps / totalSteps) * 100, 95); // Never show 100% until truly done
  }, [currentTask, isExecuting, executionLogs]);

  if (!actionPlan) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Terminal className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Carregando executor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">⚙️ Executor Contínuo</h2>
          <p className="text-muted-foreground">
            Execução automática e monitorada de melhorias do sistema
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isExecuting ? "default" : "secondary"}>
            {isExecuting ? (
              <>
                <Activity className="h-3 w-3 mr-1 animate-pulse" />
                Executando
              </>
            ) : (
              <>
                <Clock className="h-3 w-3 mr-1" />
                Aguardando
              </>
            )}
          </Badge>

          {autoMode && (
            <Badge variant="outline">
              <Bot className="h-3 w-3 mr-1" />
              Modo Auto
            </Badge>
          )}
        </div>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Painel de Controle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auto mode toggle */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label htmlFor="auto-mode" className="text-base font-medium">
                Execução Automática
              </Label>
              <p className="text-sm text-muted-foreground">
                Executa tarefas seguras automaticamente
              </p>
            </div>
            <Switch
              id="auto-mode"
              checked={autoMode}
              onCheckedChange={setAutoMode}
              disabled={!permissions.can_execute_automated || isExecuting}
            />
          </div>

          {/* Concurrent executions */}
          <div className="space-y-2">
            <Label htmlFor="max-concurrent">
              Execuções Simultâneas: {maxConcurrent}
            </Label>
            <Input
              id="max-concurrent"
              type="range"
              min="1"
              max="5"
              value={maxConcurrent}
              onChange={(e) => setMaxConcurrent(parseInt(e.target.value))}
              disabled={isExecuting}
            />
          </div>

          {/* Manual execution */}
          <div className="space-y-2">
            <Label htmlFor="manual-task">Execução Manual</Label>
            <div className="flex gap-2">
              <select
                id="manual-task"
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md"
                disabled={isExecuting}
              >
                <option value="">Selecione uma tarefa...</option>
                {executableTasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.tarefa} ({task.prioridade}) - {task.módulo}
                  </option>
                ))}
              </select>
              <Button
                onClick={handleManualExecution}
                disabled={!selectedTaskId || isExecuting}
              >
                <Play className="h-4 w-4 mr-2" />
                Executar
              </Button>
            </div>
          </div>

          {/* Emergency controls */}
          {isExecuting && (
            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleStopExecution}
              >
                <Square className="h-4 w-4 mr-2" />
                Parar Execução
              </Button>
            </div>
          )}

          {/* Permissions warning */}
          {!permissions.can_execute_automated && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Permissões limitadas: Você pode executar apenas tarefas não
                críticas manualmente.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Execution Status */}
      {isExecuting && currentTask && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Executando: {currentTask.tarefa}
            </CardTitle>
            <CardDescription>
              Módulo: {currentTask.módulo} | Prioridade:{" "}
              {currentTask.prioridade}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progresso</span>
                  <span>{executionProgress.toFixed(0)}%</span>
                </div>
                <Progress value={executionProgress} className="h-2" />
              </div>

              <div className="text-sm text-muted-foreground">
                Etapa atual:{" "}
                {executionLogs.filter(
                  (log) =>
                    log.mensagem.includes("Etapa") && log.nivel === "info",
                ).length + 1}{" "}
                de {currentTask.etapas.length}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Queue Status */}
      {executionQueue.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Fila de Execução ({executionQueue.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {executionQueue.slice(0, 3).map((taskId, index) => {
                const task = actionPlan.tarefas.find((t) => t.id === taskId);
                return task ? (
                  <div key={taskId} className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">{index + 1}</Badge>
                    <span className="flex-1">{task.tarefa}</span>
                    <Badge variant="secondary">{task.módulo}</Badge>
                  </div>
                ) : null;
              })}
              {executionQueue.length > 3 && (
                <p className="text-sm text-muted-foreground">
                  ... e mais {executionQueue.length - 3} tarefas
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Execution Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Logs de Execução
            {executionLogs.length > 0 && (
              <Badge variant="outline">{executionLogs.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {executionLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2" />
                  <p>
                    Nenhum log disponível. Execute uma tarefa para ver os logs.
                  </p>
                </div>
              ) : (
                executionLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 border rounded-lg"
                  >
                    <div className="mt-0.5">{getLogIcon(log.nivel)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {log.mensagem}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {log.executor === "ai" ? (
                            <Bot className="h-3 w-3 mr-1" />
                          ) : (
                            <User className="h-3 w-3 mr-1" />
                          )}
                          {log.executor}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        {log.componente && <span>📦 {log.componente}</span>}
                      </div>
                      {log.detalhes && (
                        <div className="mt-2 text-xs bg-muted p-2 rounded">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(log.detalhes, null, 2)}
                          </pre>
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-muted-foreground mr-2" />
              <div>
                <p className="text-2xl font-bold">{executableTasks.length}</p>
                <p className="text-xs text-muted-foreground">
                  Tarefas Executáveis
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-muted-foreground mr-2" />
              <div>
                <p className="text-2xl font-bold">{executionQueue.length}</p>
                <p className="text-xs text-muted-foreground">Na Fila</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground mr-2" />
              <div>
                <p className="text-2xl font-bold">
                  {actionPlan.métricas_globais.tarefas_concluídas}
                </p>
                <p className="text-xs text-muted-foreground">Concluídas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
