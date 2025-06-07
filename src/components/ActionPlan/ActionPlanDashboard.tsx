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
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import ActionPlanService from "@/services/actionPlanService";
import {
  ActionPlanState,
  ModuleName,
  TaskStatus,
  TaskPriority,
  ActionPlanFilter,
} from "@/types/actionPlan";

interface DashboardProps {
  onNavigateToModule?: (module: ModuleName) => void;
  onNavigateToLogs?: () => void;
  onNavigateToAnalysis?: () => void;
}

export default function ActionPlanDashboard({
  onNavigateToModule,
  onNavigateToLogs,
  onNavigateToAnalysis,
}: DashboardProps) {
  const [state, setState] = useState<ActionPlanState | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [autoAnalysisEnabled, setAutoAnalysisEnabled] = useState(true);
  const [filter, setFilter] = useState<ActionPlanFilter>({});

  const service = useMemo(() => ActionPlanService.getInstance(), []);

  useEffect(() => {
    const unsubscribe = service.subscribe((newState) => {
      setState(newState);
      setLoading(false);
    });

    // Initial load
    setState(service.getState());
    setLoading(false);

    return unsubscribe;
  }, [service]);

  // Computed statistics
  const globalStats = useMemo(() => {
    if (!state) return null;

    const allTasks = state.modulos.flatMap((m) => [
      ...m.tarefas_pendentes,
      ...m.em_execucao,
      ...m.concluidas,
    ]);

    const criticalTasks = allTasks.filter((t) => t.prioridade === "critica");
    const highTasks = allTasks.filter((t) => t.prioridade === "alta");
    const completedTasks = allTasks.filter((t) => t.status === "concluida");
    const inProgressTasks = allTasks.filter((t) => t.status === "em_execucao");
    const pendingTasks = allTasks.filter((t) => t.status === "pendente");

    const criticalModules = state.modulos.filter(
      (m) => m.saude_geral === "critica",
    ).length;
    const avgCompletion =
      state.modulos.length > 0
        ? state.modulos.reduce((sum, m) => sum + m.metricas.taxa_conclusao, 0) /
          state.modulos.length
        : 0;

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
    };
  }, [state]);

  const handleRunAnalysis = async (
    type: "performance" | "integracao" | "ux" | "comportamento",
  ) => {
    setLoading(true);
    try {
      await service.runAIAnalysis(type);
    } catch (error) {
      console.error("Erro ao executar análise:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const data = service.exportData({
      formato: "json",
      escopo: "completo",
      incluir_logs: true,
      incluir_historico: true,
    });

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lawdesk-action-plan-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critica":
        return "bg-red-100 text-red-800 border-red-200";
      case "alta":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "media":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "baixa":
        return "bg-green-100 text-green-800 border-green-200";
      case "excelente":
        return "bg-green-100 text-green-800 border-green-200";
      case "boa":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "regular":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "concluida":
        return "bg-green-100 text-green-800 border-green-200";
      case "em_execucao":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pendente":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getModuleIcon = (moduleName: ModuleName) => {
    const iconMap = {
      "CRM Jurídico": Users,
      "IA Jurídica": Brain,
      GED: FileText,
      Tarefas: CheckCircle,
      Publicações: Calendar,
      Atendimento: MessageSquare,
      Agenda: Calendar,
      Financeiro: DollarSign,
      Configurações: Settings,
    };
    return iconMap[moduleName] || Target;
  };

  if (loading || !state || !globalStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Carregando plano de ação...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            📊 Plano de Ação Inteligente
          </h1>
          <p className="text-muted-foreground">
            Sistema autônomo de gestão e análise - Versão{" "}
            {state.versao_atual.versao}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>

          <Button
            variant={autoAnalysisEnabled ? "destructive" : "default"}
            onClick={() => {
              setAutoAnalysisEnabled(!autoAnalysisEnabled);
              if (autoAnalysisEnabled) {
                service.stopAutoAnalysis();
              }
            }}
            className="flex items-center gap-2"
          >
            {autoAnalysisEnabled ? (
              <>
                <PauseCircle className="h-4 w-4" />
                Pausar IA
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4" />
                Ativar IA
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Global Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Tarefas
                </p>
                <p className="text-2xl font-bold">{globalStats.totalTasks}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <Badge className={getStatusColor("concluida")}>
                {globalStats.completedTasks} concluídas
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Taxa de Conclusão
                </p>
                <p className="text-2xl font-bold">
                  {Math.round(globalStats.completionRate)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
            <div className="mt-2">
              <Progress value={globalStats.completionRate} className="w-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Críticas
                </p>
                <p className="text-2xl font-bold text-destructive">
                  {globalStats.criticalTasks}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <div className="mt-2">
              <Badge className={getStatusColor("alta")}>
                {globalStats.highTasks} alta prioridade
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Sugestões IA
                </p>
                <p className="text-2xl font-bold text-primary">
                  {globalStats.aiSuggestions}
                </p>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary">
                {globalStats.recentAnalyses} análises recentes
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Análises IA em Tempo Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => handleRunAnalysis("performance")}
              className="flex items-center gap-2 h-auto p-4 flex-col"
              variant="outline"
            >
              <Gauge className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Performance</div>
                <div className="text-xs text-muted-foreground">
                  Velocidade e otimização
                </div>
              </div>
            </Button>

            <Button
              onClick={() => handleRunAnalysis("integracao")}
              className="flex items-center gap-2 h-auto p-4 flex-col"
              variant="outline"
            >
              <Activity className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Integração</div>
                <div className="text-xs text-muted-foreground">
                  Conectividade entre módulos
                </div>
              </div>
            </Button>

            <Button
              onClick={() => handleRunAnalysis("ux")}
              className="flex items-center gap-2 h-auto p-4 flex-col"
              variant="outline"
            >
              <Eye className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">UX Design</div>
                <div className="text-xs text-muted-foreground">
                  Experiência do usuário
                </div>
              </div>
            </Button>

            <Button
              onClick={() => handleRunAnalysis("comportamento")}
              className="flex items-center gap-2 h-auto p-4 flex-col"
              variant="outline"
            >
              <Users className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Comportamento</div>
                <div className="text-xs text-muted-foreground">
                  Padrões de uso
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Module Status Overview */}
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Status dos Módulos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.modulos.map((module) => {
              const IconComponent = getModuleIcon(module.modulo);
              const totalTasks =
                module.tarefas_pendentes.length +
                module.em_execucao.length +
                module.concluidas.length;

              return (
                <motion.div
                  key={module.modulo}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => onNavigateToModule?.(module.modulo)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">{module.modulo}</h3>
                    </div>
                    <Badge className={getStatusColor(module.saude_geral)}>
                      {module.saude_geral}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Conclusão</span>
                      <span>{Math.round(module.metricas.taxa_conclusao)}%</span>
                    </div>
                    <Progress
                      value={module.metricas.taxa_conclusao}
                      className="h-2"
                    />

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-medium text-red-600">
                          {module.tarefas_pendentes.length}
                        </div>
                        <div className="text-muted-foreground">Pendentes</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-blue-600">
                          {module.em_execucao.length}
                        </div>
                        <div className="text-muted-foreground">Execução</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-green-600">
                          {module.concluidas.length}
                        </div>
                        <div className="text-muted-foreground">Concluídas</div>
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
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {state.logs_execucao.slice(0, 10).map((log, index) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-2 rounded border-l-2 border-primary/20"
                  >
                    <div
                      className={`p-1 rounded ${
                        log.resultado === "sucesso"
                          ? "bg-green-100 text-green-600"
                          : log.resultado === "erro"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {log.resultado === "sucesso" ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : log.resultado === "erro" ? (
                        <AlertTriangle className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {log.acao_executada}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.modulo_afetado} •{" "}
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </p>
                      {log.detalhes.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {log.detalhes[0].mensagem}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {onNavigateToLogs && (
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={onNavigateToLogs}>
                  Ver Todos os Logs
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Análises IA Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {state.analises_ia.slice(0, 5).map((analysis) => (
                  <div key={analysis.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium capitalize">
                        {analysis.tipo_analise}
                      </h4>
                      <Badge variant="secondary">
                        {analysis.confidence_level}% confiança
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {analysis.recomendacoes.length} recomendações geradas
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(analysis.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {onNavigateToAnalysis && (
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={onNavigateToAnalysis}>
                  Ver Todas as Análises
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Health Alert */}
      {globalStats.criticalModules > 0 && (
        <Alert className="border-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Atenção: Módulos Críticos Detectados</AlertTitle>
          <AlertDescription>
            {globalStats.criticalModules} módulo(s) necessitam atenção imediata.
            {globalStats.criticalTasks} tarefa(s) crítica(s) aguardam execução.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
