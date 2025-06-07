import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Zap,
  Activity,
  Gauge,
  Eye,
  Users,
  PlayCircle,
  PauseCircle,
  RefreshCw,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart,
  Settings,
  Clock,
  Lightbulb,
  Bug,
  Link,
  Smartphone,
  Monitor,
  Tablet,
  Wifi,
  Database,
  Code,
  Shield,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import ActionPlanService from "@/services/actionPlanService";
import {
  ActionPlanState,
  AIAnalysisResult,
  AIAnalysisType,
  ModuleName,
  PerformanceMetrics,
  UXIssue,
  IntegrationGap,
  UserBehaviorInsight,
} from "@/types/actionPlan";

interface AIAnalyzerProps {
  onTaskGenerated?: (taskCount: number) => void;
}

export default function AIAnalyzer({ onTaskGenerated }: AIAnalyzerProps) {
  const [state, setState] = useState<ActionPlanState | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedAnalysisType, setSelectedAnalysisType] =
    useState<AIAnalysisType>("performance");
  const [selectedModule, setSelectedModule] = useState<ModuleName | "global">(
    "global",
  );
  const [autoAnalysisEnabled, setAutoAnalysisEnabled] = useState(true);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const service = useMemo(() => ActionPlanService.getInstance(), []);

  useEffect(() => {
    const unsubscribe = service.subscribe((newState) => {
      setState(newState);
    });

    // Initial load
    setState(service.getState());

    return unsubscribe;
  }, [service]);

  // Latest analysis results
  const latestAnalyses = useMemo(() => {
    if (!state) return [];

    return state.analises_ia
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 10);
  }, [state]);

  // Analysis statistics
  const analysisStats = useMemo(() => {
    if (!state) return null;

    const totalAnalyses = state.analises_ia.length;
    const analysesByType = state.analises_ia.reduce(
      (acc, analysis) => {
        acc[analysis.tipo_analise] = (acc[analysis.tipo_analise] || 0) + 1;
        return acc;
      },
      {} as Record<AIAnalysisType, number>,
    );

    const avgConfidence =
      totalAnalyses > 0
        ? state.analises_ia.reduce((sum, a) => sum + a.confidence_level, 0) /
          totalAnalyses
        : 0;

    const totalRecommendations = state.analises_ia.reduce(
      (sum, a) => sum + a.recomendacoes.length,
      0,
    );

    const lastAnalysis =
      state.analises_ia.length > 0
        ? state.analises_ia[state.analises_ia.length - 1]
        : null;

    return {
      totalAnalyses,
      analysesByType,
      avgConfidence,
      totalRecommendations,
      lastAnalysis,
    };
  }, [state]);

  const handleRunAnalysis = async (
    type?: AIAnalysisType,
    scope?: ModuleName | "global",
  ) => {
    const analysisType = type || selectedAnalysisType;
    const analysisScope = scope || selectedModule;

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 500);

      const result = await service.runAIAnalysis(analysisType, analysisScope);

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      onTaskGenerated?.(result.recomendacoes.length);

      // Reset progress after a delay
      setTimeout(() => {
        setAnalysisProgress(0);
      }, 2000);
    } catch (error) {
      console.error("Erro na análise IA:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getAnalysisTypeIcon = (type: AIAnalysisType) => {
    switch (type) {
      case "performance":
        return <Gauge className="h-4 w-4" />;
      case "integracao":
        return <Link className="h-4 w-4" />;
      case "ux":
        return <Eye className="h-4 w-4" />;
      case "comportamento":
        return <Users className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getAnalysisTypeColor = (type: AIAnalysisType) => {
    switch (type) {
      case "performance":
        return "bg-green-100 text-green-800 border-green-200";
      case "integracao":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ux":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "comportamento":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAnalysisTypeDescription = (type: AIAnalysisType) => {
    switch (type) {
      case "performance":
        return "Analisa velocidade, bundle size, memória e métricas de performance";
      case "integracao":
        return "Verifica conectividade e sincronização entre módulos";
      case "ux":
        return "Avalia experiência do usuário e usabilidade";
      case "comportamento":
        return "Estuda padrões de uso e comportamento dos usuários";
      default:
        return "Análise geral do sistema";
    }
  };

  const renderPerformanceMetrics = (metrics: PerformanceMetrics) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center">
        <div className="text-lg font-bold">
          {Math.round(metrics.load_time_avg)}ms
        </div>
        <div className="text-xs text-muted-foreground">
          Tempo de Carregamento
        </div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold">
          {Math.round(metrics.bundle_size)}KB
        </div>
        <div className="text-xs text-muted-foreground">Tamanho do Bundle</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold">
          {Math.round(metrics.lighthouse_score)}
        </div>
        <div className="text-xs text-muted-foreground">Score Lighthouse</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold">
          {metrics.error_rate.toFixed(2)}%
        </div>
        <div className="text-xs text-muted-foreground">Taxa de Erro</div>
      </div>
    </div>
  );

  const renderUXIssues = (issues: UXIssue[]) => (
    <div className="space-y-3">
      {issues.slice(0, 3).map((issue, index) => (
        <div key={index} className="border rounded-lg p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="font-medium text-sm">{issue.componente}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {issue.problema}
              </p>
              <div className="flex items-center gap-1 mt-2">
                {issue.dispositivos_afetados.map((device, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {device === "mobile" && (
                      <Smartphone className="h-3 w-3 mr-1" />
                    )}
                    {device === "tablet" && <Tablet className="h-3 w-3 mr-1" />}
                    {device === "desktop" && (
                      <Monitor className="h-3 w-3 mr-1" />
                    )}
                    {device}
                  </Badge>
                ))}
              </div>
            </div>
            <Badge
              className={
                issue.prioridade === "critica"
                  ? "bg-red-100 text-red-800"
                  : issue.prioridade === "alta"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-yellow-100 text-yellow-800"
              }
            >
              {issue.prioridade}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );

  const renderIntegrationGaps = (gaps: IntegrationGap[]) => (
    <div className="space-y-3">
      {gaps.slice(0, 3).map((gap, index) => (
        <div key={index} className="border rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span>{gap.modulo_origem}</span>
              <Link className="h-3 w-3 text-muted-foreground" />
              <span>{gap.modulo_destino}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {gap.tipo_integracao}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{gap.problema}</p>
          <p className="text-xs text-green-600 mt-1">
            💡 {gap.solucao_sugerida}
          </p>
        </div>
      ))}
    </div>
  );

  const renderBehaviorInsights = (insights: UserBehaviorInsight[]) => (
    <div className="space-y-3">
      {insights.slice(0, 3).map((insight, index) => (
        <div key={index} className="border rounded-lg p-3">
          <h4 className="font-medium text-sm mb-1">{insight.padrao}</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Frequência:</span>
              <span className="ml-1 font-medium">
                {Math.round(insight.frequencia * 100)}%
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Impacto:</span>
              <span className="ml-1 font-medium">
                {insight.impacto_business}
              </span>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">
            🎯 {insight.acao_recomendada}
          </p>
        </div>
      ))}
    </div>
  );

  if (!state || !analysisStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 animate-pulse text-primary" />
          <span>Carregando analisador IA...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            🧠 Analisador IA
          </h2>
          <p className="text-muted-foreground">
            Sistema de análise inteligente em tempo real
          </p>
        </div>

        <div className="flex items-center gap-2">
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
                Pausar Auto-Análise
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4" />
                Ativar Auto-Análise
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Analysis Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Análises
                </p>
                <p className="text-2xl font-bold">
                  {analysisStats.totalAnalyses}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary">
                {analysisStats.totalRecommendations} recomendações
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Confiança Média
                </p>
                <p className="text-2xl font-bold">
                  {Math.round(analysisStats.avgConfidence)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-success" />
            </div>
            <div className="mt-2">
              <Progress
                value={analysisStats.avgConfidence}
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
                  Performance
                </p>
                <p className="text-2xl font-bold">
                  {analysisStats.analysesByType.performance || 0}
                </p>
              </div>
              <Gauge className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800">
                Análises realizadas
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  UX Issues
                </p>
                <p className="text-2xl font-bold">
                  {analysisStats.analysesByType.ux || 0}
                </p>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <Badge className="bg-purple-100 text-purple-800">
                Melhorias identificadas
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Controls */}
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Controles de Análise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Tipo de Análise
              </label>
              <Select
                value={selectedAnalysisType}
                onValueChange={(value: AIAnalysisType) =>
                  setSelectedAnalysisType(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4" />
                      Performance
                    </div>
                  </SelectItem>
                  <SelectItem value="integracao">
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4" />
                      Integração
                    </div>
                  </SelectItem>
                  <SelectItem value="ux">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      UX Design
                    </div>
                  </SelectItem>
                  <SelectItem value="comportamento">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Comportamento
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Escopo</label>
              <Select
                value={selectedModule}
                onValueChange={(value: ModuleName | "global") =>
                  setSelectedModule(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Todo o Sistema</SelectItem>
                  <SelectItem value="CRM Jurídico">CRM Jurídico</SelectItem>
                  <SelectItem value="IA Jurídica">IA Jurídica</SelectItem>
                  <SelectItem value="GED">GED</SelectItem>
                  <SelectItem value="Tarefas">Tarefas</SelectItem>
                  <SelectItem value="Publicações">Publicações</SelectItem>
                  <SelectItem value="Atendimento">Atendimento</SelectItem>
                  <SelectItem value="Agenda">Agenda</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="Configurações">Configurações</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => handleRunAnalysis()}
                disabled={isAnalyzing}
                className="w-full flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4" />
                    Executar Análise
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Analysis Progress */}
          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso da Análise</span>
                <span>{Math.round(analysisProgress)}%</span>
              </div>
              <Progress value={analysisProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">
                {getAnalysisTypeDescription(selectedAnalysisType)}
              </p>
            </div>
          )}

          {/* Quick Analysis Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            {(
              [
                "performance",
                "integracao",
                "ux",
                "comportamento",
              ] as AIAnalysisType[]
            ).map((type) => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => handleRunAnalysis(type)}
                disabled={isAnalyzing}
                className="flex items-center gap-2"
              >
                {getAnalysisTypeIcon(type)}
                <span className="capitalize">{type}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Latest Analysis Results */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="recent">Análises Recentes</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights IA</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Últimas Análises Executadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {latestAnalyses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma análise executada ainda</p>
                      <p className="text-sm">
                        Execute uma análise para ver os resultados
                      </p>
                    </div>
                  ) : (
                    latestAnalyses.map((analysis) => (
                      <motion.div
                        key={analysis.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getAnalysisTypeIcon(analysis.tipo_analise)}
                              <h4 className="font-medium capitalize">
                                {analysis.tipo_analise}
                              </h4>
                              <Badge
                                className={getAnalysisTypeColor(
                                  analysis.tipo_analise,
                                )}
                              >
                                {analysis.escopo}
                              </Badge>
                              <Badge variant="outline">
                                {analysis.confidence_level}% confiança
                              </Badge>
                            </div>

                            <div className="text-sm text-muted-foreground mb-3">
                              {analysis.recomendacoes.length} recomendações
                              geradas •{" "}
                              {new Date(analysis.timestamp).toLocaleString()}
                            </div>

                            {/* Analysis Results Preview */}
                            <div className="space-y-3">
                              {analysis.tipo_analise === "performance" &&
                                analysis.resultados.metricas_performance && (
                                  <div>
                                    <h5 className="text-sm font-medium mb-2">
                                      Métricas de Performance
                                    </h5>
                                    {renderPerformanceMetrics(
                                      analysis.resultados.metricas_performance,
                                    )}
                                  </div>
                                )}

                              {analysis.tipo_analise === "ux" &&
                                analysis.resultados.problemas_ux && (
                                  <div>
                                    <h5 className="text-sm font-medium mb-2">
                                      Problemas de UX
                                    </h5>
                                    {renderUXIssues(
                                      analysis.resultados.problemas_ux,
                                    )}
                                  </div>
                                )}

                              {analysis.tipo_analise === "integracao" &&
                                analysis.resultados.gaps_integracao && (
                                  <div>
                                    <h5 className="text-sm font-medium mb-2">
                                      Gaps de Integração
                                    </h5>
                                    {renderIntegrationGaps(
                                      analysis.resultados.gaps_integracao,
                                    )}
                                  </div>
                                )}

                              {analysis.tipo_analise === "comportamento" &&
                                analysis.resultados.comportamento_usuario && (
                                  <div>
                                    <h5 className="text-sm font-medium mb-2">
                                      Insights de Comportamento
                                    </h5>
                                    {renderBehaviorInsights(
                                      analysis.resultados.comportamento_usuario,
                                    )}
                                  </div>
                                )}
                            </div>

                            {/* Top Recommendations */}
                            {analysis.recomendacoes.length > 0 && (
                              <div className="mt-3">
                                <h5 className="text-sm font-medium mb-2">
                                  🎯 Top Recomendações (
                                  {analysis.recomendacoes.length})
                                </h5>
                                <div className="space-y-1">
                                  {analysis.recomendacoes
                                    .slice(0, 2)
                                    .map((rec, idx) => (
                                      <div
                                        key={idx}
                                        className="text-xs bg-primary/5 p-2 rounded border-l-2 border-primary/20"
                                      >
                                        <span className="font-medium">
                                          {rec.tarefa}
                                        </span>
                                        {rec.sugestao_IA && (
                                          <p className="text-muted-foreground mt-1">
                                            💡 {rec.sugestao_IA}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-primary" />
                Métricas de Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysisStats.lastAnalysis?.resultados.metricas_performance ? (
                renderPerformanceMetrics(
                  analysisStats.lastAnalysis.resultados.metricas_performance,
                )
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Gauge className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Execute uma análise de performance para ver as métricas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Insights de IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                    <h4 className="font-medium text-sm mb-1">
                      Padrão Identificado
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Usuários abandonam formulários longos em 35% dos casos
                    </p>
                    <Badge className="mt-2 bg-yellow-100 text-yellow-800">
                      Comportamento
                    </Badge>
                  </div>

                  <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                    <h4 className="font-medium text-sm mb-1">Oportunidade</h4>
                    <p className="text-xs text-muted-foreground">
                      Implementar lazy loading pode reduzir tempo de
                      carregamento em 40%
                    </p>
                    <Badge className="mt-2 bg-blue-100 text-blue-800">
                      Performance
                    </Badge>
                  </div>

                  <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                    <h4 className="font-medium text-sm mb-1">
                      Melhoria Detectada
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Integração entre CRM e GED pode ser otimizada com webhooks
                    </p>
                    <Badge className="mt-2 bg-green-100 text-green-800">
                      Integração
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Recomendações Automáticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Otimizar Bundle JS</p>
                      <p className="text-xs text-muted-foreground">
                        Reduzir tamanho em ~30%
                      </p>
                    </div>
                    <Badge variant="outline">Alta</Badge>
                  </div>

                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Melhorar UX Mobile</p>
                      <p className="text-xs text-muted-foreground">
                        Touch targets inadequados
                      </p>
                    </div>
                    <Badge variant="outline">Média</Badge>
                  </div>

                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Cache de API</p>
                      <p className="text-xs text-muted-foreground">
                        Implementar estratégia
                      </p>
                    </div>
                    <Badge variant="outline">Baixa</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-primary" />
                Tendências de Análise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Análises por Tipo</h4>
                  <div className="space-y-2">
                    {Object.entries(analysisStats.analysesByType).map(
                      ([type, count]) => (
                        <div
                          key={type}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {getAnalysisTypeIcon(type as AIAnalysisType)}
                            <span className="capitalize text-sm">{type}</span>
                          </div>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Evolução da Confiança</h4>
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">
                        {Math.round(analysisStats.avgConfidence)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Confiança Média Atual
                      </div>
                    </div>
                    <Progress
                      value={analysisStats.avgConfidence}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      Baseado em {analysisStats.totalAnalyses} análises
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Auto Analysis Status */}
      {autoAnalysisEnabled && (
        <Alert>
          <Activity className="h-4 w-4" />
          <AlertTitle>Análise Automática Ativa</AlertTitle>
          <AlertDescription>
            O sistema está executando análises automáticas a cada{" "}
            {state.configuracoes.analysis_frequency_hours} horas. Próxima
            análise prevista para{" "}
            {new Date(
              Date.now() +
                state.configuracoes.analysis_frequency_hours * 60 * 60 * 1000,
            ).toLocaleTimeString()}
            .
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
