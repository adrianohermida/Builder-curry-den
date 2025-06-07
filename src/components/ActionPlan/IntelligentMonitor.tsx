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
import { Alert, AlertDescription } from "../ui/alert";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  Play,
  Pause,
  Settings,
  TrendingUp,
  TrendingDown,
  Zap,
  Bot,
  User,
  Download,
  RefreshCw,
  Bell,
  Shield,
  Target,
} from "lucide-react";

import { useIntelligentActionPlan } from "../../hooks/useIntelligentActionPlan";
import {
  IntelligentActionPlanItem,
  MonitoringEvent,
  AnalysisReport,
} from "../../types/intelligentActionPlan";
import { ModuleName } from "../../types/actionPlan";

interface IntelligentMonitorProps {
  onTaskExecute?: (taskId: string) => void;
  onConfigChange?: (config: any) => void;
}

export const IntelligentMonitor: React.FC<IntelligentMonitorProps> = ({
  onTaskExecute,
  onConfigChange,
}) => {
  const {
    actionPlan,
    config,
    permissions,
    isAnalyzing,
    events,
    latestReport,
    executeTask,
    performAnalysis,
    updateConfig,
    exportPlan,
  } = useIntelligentActionPlan();

  const [selectedModule, setSelectedModule] = useState<ModuleName | "all">(
    "all",
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [realtimeEnabled, setRealtimeEnabled] = useState(true);

  // Metrics calculation
  const metrics = useMemo(() => {
    if (!actionPlan) return null;

    const tasks = actionPlan.tarefas;
    const filteredTasks = tasks.filter((task) => {
      const moduleMatch =
        selectedModule === "all" || task.módulo === selectedModule;
      const statusMatch =
        selectedStatus === "all" || task.status === selectedStatus;
      const priorityMatch =
        selectedPriority === "all" || task.prioridade === selectedPriority;
      return moduleMatch && statusMatch && priorityMatch;
    });

    const completed = filteredTasks.filter((t) => t.status === "concluído");
    const inProgress = filteredTasks.filter((t) => t.status === "em execução");
    const pending = filteredTasks.filter((t) => t.status === "pendente");
    const critical = filteredTasks.filter((t) => t.prioridade === "crítica");

    return {
      total: filteredTasks.length,
      completed: completed.length,
      inProgress: inProgress.length,
      pending: pending.length,
      critical: critical.length,
      completionRate:
        filteredTasks.length > 0
          ? (completed.length / filteredTasks.length) * 100
          : 0,
      avgExecutionTime: actionPlan.métricas_globais.tempo_médio_execução,
      successRate: actionPlan.métricas_globais.taxa_sucesso,
      lastAnalysis: actionPlan.métricas_globais.última_análise,
    };
  }, [actionPlan, selectedModule, selectedStatus, selectedPriority]);

  // Real-time events
  const recentEvents = useMemo(() => {
    return events.slice(-10).reverse();
  }, [events]);

  const handleExecuteTask = async (taskId: string) => {
    try {
      await executeTask(taskId);
      onTaskExecute?.(taskId);
    } catch (error) {
      console.error("Erro ao executar tarefa:", error);
    }
  };

  const handleConfigUpdate = async (key: string, value: any) => {
    try {
      await updateConfig({ [key]: value });
      onConfigChange?.({ [key]: value });
    } catch (error) {
      console.error("Erro ao atualizar configuração:", error);
    }
  };

  const handleExport = async (format: "json" | "csv") => {
    try {
      const data = await exportPlan(format);
      const blob = new Blob([data], {
        type: format === "json" ? "application/json" : "text/csv",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `lawdesk-action-plan-${new Date().toISOString().split("T")[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao exportar:", error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "crítica":
        return "destructive";
      case "alta":
        return "destructive";
      case "média":
        return "secondary";
      case "baixa":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluído":
        return "text-green-600";
      case "em execução":
        return "text-blue-600";
      case "pendente":
        return "text-yellow-600";
      case "em revisão":
        return "text-purple-600";
      case "pausado":
        return "text-gray-600";
      case "cancelado":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "task_created":
        return <Target className="h-4 w-4" />;
      case "task_completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "issue_detected":
        return <AlertTriangle className="h-4 w-4" />;
      case "system_alert":
        return <Bell className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  if (!actionPlan || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Carregando painel inteligente...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            🔎 Painel de Monitoramento Inteligente
          </h2>
          <p className="text-muted-foreground">
            Acompanhamento contínuo e execução automatizada - Lawdesk 2025
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => performAnalysis()}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Eye className="h-4 w-4 mr-2" />
            )}
            Análise Manual
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("json")}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Global metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Tarefas
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.critical} críticas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Conclusão
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.completionRate.toFixed(1)}%
            </div>
            <Progress value={metrics.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Execução</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.pending} pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Sucesso
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.successRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.avgExecutionTime.toFixed(1)}h média
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Configuration panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações de Monitoramento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="continuous-analysis">Análise Contínua</Label>
              <Switch
                id="continuous-analysis"
                checked={config.análise_contínua}
                onCheckedChange={(checked) =>
                  handleConfigUpdate("análise_contínua", checked)
                }
                disabled={!permissions.can_modify_config}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-execution">Execução Automática</Label>
              <Switch
                id="auto-execution"
                checked={config.execução_automática}
                onCheckedChange={(checked) =>
                  handleConfigUpdate("execução_automática", checked)
                }
                disabled={!permissions.can_modify_config}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Notificações</Label>
              <Switch
                id="notifications"
                checked={config.notificações}
                onCheckedChange={(checked) =>
                  handleConfigUpdate("notificações", checked)
                }
                disabled={!permissions.can_modify_config}
              />
            </div>
          </div>

          {!permissions.can_modify_config && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Você não tem permissão para modificar configurações. Entre em
                contato com um administrador.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Main tabs */}
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          <TabsTrigger value="analysis">Análise</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedModule}
              onChange={(e) =>
                setSelectedModule(e.target.value as ModuleName | "all")
              }
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">Todos os Módulos</option>
              <option value="CRM Jurídico">CRM Jurídico</option>
              <option value="GED">GED</option>
              <option value="IA Jurídica">IA Jurídica</option>
              <option value="Publicações">Publicações</option>
              <option value="Tarefas">Tarefas</option>
              <option value="Agenda">Agenda</option>
              <option value="Financeiro">Financeiro</option>
              <option value="Atendimento">Atendimento</option>
              <option value="Design System">Design System</option>
              <option value="Features Beta">Features Beta</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">Todos os Status</option>
              <option value="pendente">Pendente</option>
              <option value="em execução">Em Execução</option>
              <option value="concluído">Concluído</option>
              <option value="em revisão">Em Revisão</option>
              <option value="pausado">Pausado</option>
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">Todas as Prioridades</option>
              <option value="crítica">Crítica</option>
              <option value="alta">Alta</option>
              <option value="média">Média</option>
              <option value="baixa">Baixa</option>
            </select>
          </div>

          {/* Tasks list */}
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {actionPlan.tarefas
                .filter((task) => {
                  const moduleMatch =
                    selectedModule === "all" || task.módulo === selectedModule;
                  const statusMatch =
                    selectedStatus === "all" || task.status === selectedStatus;
                  const priorityMatch =
                    selectedPriority === "all" ||
                    task.prioridade === selectedPriority;
                  return moduleMatch && statusMatch && priorityMatch;
                })
                .map((task) => (
                  <Card key={task.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{task.tarefa}</h4>
                          <Badge variant={getPriorityColor(task.prioridade)}>
                            {task.prioridade}
                          </Badge>
                          <Badge variant="outline">{task.módulo}</Badge>
                          {task.origem === "análise automática" && (
                            <Badge variant="secondary">
                              <Bot className="h-3 w-3 mr-1" />
                              IA
                            </Badge>
                          )}
                        </div>

                        <p
                          className={`text-sm font-medium ${getStatusColor(task.status)}`}
                        >
                          Status: {task.status}
                        </p>

                        {task.sugestão_IA && (
                          <p className="text-sm text-muted-foreground mt-2">
                            💡 IA: {task.sugestão_IA}
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>
                            📅 {new Date(task.criado_em).toLocaleDateString()}
                          </span>
                          {task.métricas?.tempo_estimado && (
                            <span>⏱️ {task.métricas.tempo_estimado}h</span>
                          )}
                          {task.execução?.tempo_real && (
                            <span>
                              ✅ {task.execução.tempo_real.toFixed(1)}h
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {task.status === "pendente" &&
                          permissions.can_execute_automated && (
                            <Button
                              size="sm"
                              onClick={() => handleExecuteTask(task.id)}
                              disabled={isAnalyzing}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Executar
                            </Button>
                          )}

                        {task.status === "em execução" && (
                          <Badge variant="secondary">
                            <Activity className="h-3 w-3 mr-1" />
                            Executando
                          </Badge>
                        )}

                        {task.status === "concluído" && (
                          <Badge variant="default">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Concluído
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          {latestReport ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>📊 Última Análise do Sistema</CardTitle>
                  <CardDescription>
                    {new Date(latestReport.timestamp).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {latestReport.resumo.problemas_críticos}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Críticos
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {latestReport.resumo.problemas_altos}
                      </div>
                      <div className="text-sm text-muted-foreground">Altos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {latestReport.resumo.problemas_médios}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Médios
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {latestReport.resumo.melhorias_sugeridas}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Sugestões
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Score Geral</span>
                      <span className="text-sm text-muted-foreground">
                        {latestReport.resumo.score_geral.toFixed(1)}/100
                      </span>
                    </div>
                    <Progress
                      value={latestReport.resumo.score_geral}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {latestReport.recomendações.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>🎯 Recomendações Prioritárias</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-3">
                        {latestReport.recomendações.slice(0, 5).map((rec) => (
                          <div
                            key={rec.id}
                            className="border-l-4 border-primary pl-4 py-2"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={getPriorityColor(rec.prioridade)}>
                                {rec.prioridade}
                              </Badge>
                              <Badge variant="outline">{rec.tipo}</Badge>
                            </div>
                            <h5 className="font-medium">{rec.título}</h5>
                            <p className="text-sm text-muted-foreground">
                              {rec.descrição}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>⚡ {rec.esforço_estimado}h</span>
                              <span>📈 Impacto {rec.impacto_estimado}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Activity className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Nenhuma análise disponível. Execute uma análise para ver os
                  resultados.
                </p>
                <Button
                  className="mt-4"
                  onClick={() => performAnalysis()}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  Executar Análise
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Eventos em Tempo Real</h3>
            <div className="flex items-center gap-2">
              <Switch
                checked={realtimeEnabled}
                onCheckedChange={setRealtimeEnabled}
              />
              <Label>Tempo Real</Label>
            </div>
          </div>

          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {recentEvents.map((event) => (
                <Card key={event.id} className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getEventIcon(event.tipo)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={
                            event.severidade === "critical"
                              ? "destructive"
                              : event.severidade === "error"
                                ? "destructive"
                                : event.severidade === "warning"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {event.severidade}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{event.tipo.replace("_", " ")}</p>
                      {event.dados && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {JSON.stringify(event.dados)}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Relatórios de Análise</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("json")}
              >
                <Download className="h-4 w-4 mr-2" />
                JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("csv")}
              >
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="text-center py-8">
              <TrendingUp className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Relatórios detalhados em desenvolvimento. Use a exportação para
                análise externa.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
