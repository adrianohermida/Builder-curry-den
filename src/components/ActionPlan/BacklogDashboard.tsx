import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Target,
  Brain,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Zap,
  Activity,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Star,
  GitBranch,
  Lightbulb,
  Gauge,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import BacklogService from "@/services/backlogService";
import {
  BacklogState,
  BacklogItem,
  BacklogCategory,
  BacklogPriority,
  BacklogColumn,
} from "@/types/backlog";

interface BacklogDashboardProps {
  onNavigateToKanban?: () => void;
  onItemSelect?: (item: BacklogItem) => void;
  onRunAIAnalysis?: () => void;
}

function BacklogDashboard({
  onNavigateToKanban,
  onItemSelect,
  onRunAIAnalysis,
}: BacklogDashboardProps) {
  const [state, setState] = useState<BacklogState | null>(null);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">(
    "30d",
  );
  const [loading, setLoading] = useState(true);

  const service = useMemo(() => BacklogService.getInstance(), []);

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

  // Calculate dashboard metrics
  const dashboardMetrics = useMemo(() => {
    if (!state) return null;

    const totalItems = state.estatisticas.total_items;
    const itemsWithAI = state.items.filter((item) => item.analise_ia).length;
    const criticalItems = state.items.filter(
      (item) => item.prioridade === "critica",
    ).length;
    const completedThisMonth = state.items.filter((item) => {
      const itemDate = new Date(item.data_criacao);
      const thisMonth = new Date();
      thisMonth.setDate(1);
      return itemDate >= thisMonth && item.coluna === "concluido";
    }).length;

    // Top categories by volume
    const topCategories = Object.entries(state.estatisticas.items_por_categoria)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Recent activity
    const recentItems = state.items
      .filter((item) => item.data_atualizacao || item.data_criacao)
      .sort((a, b) => {
        const dateA = new Date(a.data_atualizacao || a.data_criacao);
        const dateB = new Date(b.data_atualizacao || b.data_criacao);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 10);

    // AI processing stats
    const aiStats = {
      processed: itemsWithAI,
      pending: state.items.filter(
        (item) => item.coluna === "ideias" && !item.analise_ia,
      ).length,
      approved: state.items.filter(
        (item) => item.analise_ia?.classificacao.acao_imediata,
      ).length,
      rejected: state.items.filter(
        (item) => item.analise_ia?.classificacao.rejeitada,
      ).length,
    };

    // Velocity metrics
    const velocityMetrics = {
      avgCycleTime: state.estatisticas.tempo_medio_ciclo,
      throughput: completedThisMonth,
      executionRate: state.estatisticas.taxa_execucao,
      approvalRate: state.estatisticas.taxa_aprovacao,
    };

    return {
      totalItems,
      itemsWithAI,
      criticalItems,
      completedThisMonth,
      topCategories,
      recentItems,
      aiStats,
      velocityMetrics,
    };
  }, [state]);

  // Handle AI processing
  const handleRunAIProcessing = async () => {
    setLoading(true);
    try {
      await service.processBacklogWithAI();
      onRunAIAnalysis?.();
    } catch (error) {
      console.error("Error running AI processing:", error);
    } finally {
      setLoading(false);
    }
  };

  // Export backlog data
  const handleExport = () => {
    const data = service.exportBacklog({
      formato: "json",
      incluir_analises: true,
      incluir_anexos: false,
      incluir_historico: true,
    });

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lawdesk-backlog-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get category color
  const getCategoryColor = (category: BacklogCategory) => {
    const colors = {
      AI: "bg-blue-100 text-blue-800",
      LegalTech: "bg-purple-100 text-purple-800",
      UX: "bg-green-100 text-green-800",
      Backend: "bg-red-100 text-red-800",
      Performance: "bg-orange-100 text-orange-800",
      Visual: "bg-pink-100 text-pink-800",
      Segurança: "bg-gray-800 text-white",
      Mobile: "bg-sky-100 text-sky-800",
      Analytics: "bg-lime-100 text-lime-800",
      Integração: "bg-yellow-100 text-yellow-800",
      Compliance: "bg-indigo-100 text-indigo-800",
      Workflow: "bg-teal-100 text-teal-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  // Get priority color
  const getPriorityColor = (priority: BacklogPriority) => {
    const colors = {
      baixa: "text-green-600",
      media: "text-yellow-600",
      alta: "text-orange-600",
      critica: "text-red-600",
    };
    return colors[priority];
  };

  if (loading || !state || !dashboardMetrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Carregando dashboard do backlog...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">📈 Dashboard do Backlog</h2>
          <p className="text-muted-foreground">
            Visão gerencial e análise de performance do backlog inteligente
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={timeRange}
            onValueChange={(value: any) => setTimeRange(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="all">Todos</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>

          <Button onClick={handleRunAIProcessing} disabled={loading}>
            <Brain className="h-4 w-4 mr-2" />
            {loading ? "Processando..." : "Analisar com IA"}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Itens
                </p>
                <p className="text-2xl font-bold">
                  {dashboardMetrics.totalItems}
                </p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary">
                {dashboardMetrics.completedThisMonth} concluídos este mês
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Processados IA
                </p>
                <p className="text-2xl font-bold text-primary">
                  {dashboardMetrics.itemsWithAI}
                </p>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <Progress
                value={
                  (dashboardMetrics.itemsWithAI / dashboardMetrics.totalItems) *
                  100
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
                  Itens Críticos
                </p>
                <p className="text-2xl font-bold text-destructive">
                  {dashboardMetrics.criticalItems}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <div className="mt-2">
              <Badge className="bg-red-100 text-red-800">
                Atenção imediata
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Taxa Execução
                </p>
                <p className="text-2xl font-bold text-success">
                  {Math.round(dashboardMetrics.velocityMetrics.executionRate)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800">
                {Math.round(dashboardMetrics.velocityMetrics.approvalRate)}%
                aprovação
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="ai-analysis">Análise IA</TabsTrigger>
          <TabsTrigger value="velocity">Velocidade</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribution by Column */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Distribuição por Coluna
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {state.colunas.map((column) => {
                    const count =
                      state.estatisticas.items_por_coluna[column.id] || 0;
                    const percentage =
                      dashboardMetrics.totalItems > 0
                        ? (count / dashboardMetrics.totalItems) * 100
                        : 0;

                    return (
                      <div key={column.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: column.cor }}
                            />
                            <span className="text-sm font-medium">
                              {column.titulo}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {count}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({Math.round(percentage)}%)
                            </span>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Top Categories */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  Top Categorias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardMetrics.topCategories.map(([category, count]) => {
                    const percentage =
                      dashboardMetrics.totalItems > 0
                        ? (count / dashboardMetrics.totalItems) * 100
                        : 0;

                    return (
                      <div
                        key={category}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Badge
                            className={getCategoryColor(
                              category as BacklogCategory,
                            )}
                          >
                            {category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{count}</span>
                          <span className="text-xs text-muted-foreground">
                            ({Math.round(percentage)}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {dashboardMetrics.recentItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => onItemSelect?.(item)}
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {item.titulo}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getCategoryColor(item.categoria)}>
                            {item.categoria}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={getPriorityColor(item.prioridade)}
                          >
                            {item.prioridade}
                          </Badge>
                          {item.analise_ia && (
                            <Badge variant="secondary" className="text-primary">
                              <Brain className="h-2 w-2 mr-1" />
                              IA
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(
                          item.data_atualizacao || item.data_criacao,
                        ).toLocaleDateString()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              {onNavigateToKanban && (
                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={onNavigateToKanban}>
                    Ver Kanban Completo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Analysis Tab */}
        <TabsContent value="ai-analysis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Processados
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {dashboardMetrics.aiStats.processed}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Pendentes
                    </p>
                    <p className="text-2xl font-bold text-warning">
                      {dashboardMetrics.aiStats.pending}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Aprovados
                    </p>
                    <p className="text-2xl font-bold text-success">
                      {dashboardMetrics.aiStats.approved}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Rejeitados
                    </p>
                    <p className="text-2xl font-bold text-destructive">
                      {dashboardMetrics.aiStats.rejected}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Processing History */}
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-primary" />
                Histórico de Processamento IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {state.historico_processamento.slice(0, 10).map((history) => (
                    <div
                      key={history.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm">
                            Processamento Automático
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {history.items_processados} itens processados •
                          {history.items_aprovados} aprovados •
                          {history.tarefas_criadas} tarefas criadas
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {Math.round(history.tempo_processamento / 1000)}s
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(
                            history.data_processamento,
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Velocity Tab */}
        <TabsContent value="velocity" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Ciclo Médio
                    </p>
                    <p className="text-2xl font-bold">
                      {Math.round(
                        dashboardMetrics.velocityMetrics.avgCycleTime,
                      )}
                      d
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <div className="mt-2">
                  <Badge variant="secondary">
                    Tempo da criação até conclusão
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Throughput
                    </p>
                    <p className="text-2xl font-bold text-success">
                      {dashboardMetrics.velocityMetrics.throughput}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-success" />
                </div>
                <div className="mt-2">
                  <Badge className="bg-green-100 text-green-800">
                    Itens/mês
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Taxa Execução
                    </p>
                    <p className="text-2xl font-bold">
                      {Math.round(
                        dashboardMetrics.velocityMetrics.executionRate,
                      )}
                      %
                    </p>
                  </div>
                  <Gauge className="h-8 w-8 text-primary" />
                </div>
                <div className="mt-2">
                  <Progress
                    value={dashboardMetrics.velocityMetrics.executionRate}
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
                      Taxa Aprovação
                    </p>
                    <p className="text-2xl font-bold">
                      {Math.round(
                        dashboardMetrics.velocityMetrics.approvalRate,
                      )}
                      %
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <div className="mt-2">
                  <Progress
                    value={dashboardMetrics.velocityMetrics.approvalRate}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Velocity Trends Chart Placeholder */}
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Tendências de Velocidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Gráfico de tendências de velocidade</p>
                  <p className="text-sm">
                    Implementação futura com charts interativos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Insights */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Insights da IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                    <h4 className="font-medium text-sm mb-1">
                      🔍 Padrão Identificado
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Itens de categoria "LegalTech" têm 80% mais chance de
                      aprovação
                    </p>
                  </div>

                  <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                    <h4 className="font-medium text-sm mb-1">
                      ⚡ Oportunidade
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {dashboardMetrics.aiStats.pending} itens aguardando
                      análise IA
                    </p>
                  </div>

                  <div className="p-3 border border-orange-200 rounded-lg bg-orange-50">
                    <h4 className="font-medium text-sm mb-1">📊 Tendência</h4>
                    <p className="text-xs text-muted-foreground">
                      Performance e UX são as categorias com menor tempo de
                      ciclo
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Recomendações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                    <div>
                      <h4 className="font-medium text-sm">
                        Priorizar Itens Críticos
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {dashboardMetrics.criticalItems} itens críticos precisam
                        de atenção imediata
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    <div>
                      <h4 className="font-medium text-sm">
                        Executar Análise IA
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Processar {dashboardMetrics.aiStats.pending} itens
                        pendentes para otimizar aprovação
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                    <div>
                      <h4 className="font-medium text-sm">Manter Velocity</h4>
                      <p className="text-xs text-muted-foreground">
                        Taxa de execução de{" "}
                        {Math.round(
                          dashboardMetrics.velocityMetrics.executionRate,
                        )}
                        % está acima da média
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ROI Analysis */}
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                Análise de ROI Estimado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    R$ {state.estatisticas.roi_total_estimado.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ROI Total Estimado
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(state.estatisticas.score_viabilidade_media)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Score Viabilidade Médio
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {dashboardMetrics.completedThisMonth}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Concluídos Este Mês
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Named export for destructuring imports
export { BacklogDashboard };

// Default export for backward compatibility
export default BacklogDashboard;
