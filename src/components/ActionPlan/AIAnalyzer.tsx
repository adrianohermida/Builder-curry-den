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
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Brain,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  Sparkles,
  Zap,
  BarChart3,
  RefreshCw,
} from "lucide-react";

interface AIAnalyzerProps {
  onTaskGenerated?: (taskCount: number) => void;
}

export const AIAnalyzer: React.FC<AIAnalyzerProps> = ({ onTaskGenerated }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);

  useEffect(() => {
    // Load analysis history from localStorage
    const history = JSON.parse(
      localStorage.getItem("ai-analysis-history") || "[]",
    );
    setAnalysisHistory(history);
  }, []);

  const runAnalysis = async () => {
    setIsAnalyzing(true);

    try {
      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const results = {
        id: `analysis_${Date.now()}`,
        timestamp: new Date().toISOString(),
        overall_score: Math.floor(Math.random() * 30) + 70, // 70-100
        modules_analyzed: 11,
        issues_detected: Math.floor(Math.random() * 15) + 5, // 5-20
        recommendations: [
          "Otimizar performance do módulo GED",
          "Melhorar responsividade do CRM móvel",
          "Implementar cache inteligente na IA",
          "Atualizar documentação de APIs",
          "Configurar monitoramento avançado",
        ],
        tasks_generated: Math.floor(Math.random() * 8) + 3, // 3-10
        risk_level: ["baixo", "moderado", "alto"][
          Math.floor(Math.random() * 3)
        ],
        confidence: Math.floor(Math.random() * 20) + 80, // 80-100
        performance_insights: {
          loading_time: `${(Math.random() * 2 + 1).toFixed(1)}s`,
          memory_usage: `${Math.floor(Math.random() * 200 + 100)}MB`,
          api_response_time: `${Math.floor(Math.random() * 500 + 200)}ms`,
        },
      };

      setAnalysisResults(results);

      // Update history
      const newHistory = [results, ...analysisHistory.slice(0, 9)];
      setAnalysisHistory(newHistory);
      localStorage.setItem("ai-analysis-history", JSON.stringify(newHistory));

      // Notify parent component
      onTaskGenerated?.(results.tasks_generated);
    } catch (error) {
      console.error("Erro na análise:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "baixo":
        return "text-green-600";
      case "moderado":
        return "text-yellow-600";
      case "alto":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "baixo":
        return "bg-green-100 text-green-800";
      case "moderado":
        return "bg-yellow-100 text-yellow-800";
      case "alto":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Analysis Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Central de Análise IA
          </CardTitle>
          <CardDescription>
            Análise automatizada completa do sistema Lawdesk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="w-full h-12 text-lg"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Analisando Sistema...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Executar Análise Completa
                </>
              )}
            </Button>

            {isAnalyzing && (
              <div className="space-y-3">
                <div className="text-center text-sm text-muted-foreground">
                  Analisando módulos, performance, integrações e gerando
                  recomendações...
                </div>
                <Progress value={isAnalyzing ? 75 : 0} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Latest Analysis Results */}
      {analysisResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Resultados da Análise
            </CardTitle>
            <CardDescription>
              {new Date(analysisResults.timestamp).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Overview Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {analysisResults.overall_score}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Score Geral
                  </div>
                  <Progress
                    value={analysisResults.overall_score}
                    className="mt-2"
                  />
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {analysisResults.modules_analyzed}
                  </div>
                  <div className="text-sm text-muted-foreground">Módulos</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {analysisResults.issues_detected}
                  </div>
                  <div className="text-sm text-muted-foreground">Issues</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {analysisResults.tasks_generated}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Tarefas Geradas
                  </div>
                </div>
              </div>

              {/* Risk and Confidence */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <Badge
                      className={getRiskBadgeColor(analysisResults.risk_level)}
                    >
                      Risco {analysisResults.risk_level}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-muted-foreground">
                      Confiança:{" "}
                    </span>
                    <span className="font-bold">
                      {analysisResults.confidence}%
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-muted-foreground">
                    Performance
                  </div>
                  <div className="text-sm">
                    ⚡ {analysisResults.performance_insights.loading_time} • 💾{" "}
                    {analysisResults.performance_insights.memory_usage} • 🔗{" "}
                    {analysisResults.performance_insights.api_response_time}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Recomendações Prioritárias
                </h4>
                <div className="space-y-2">
                  {analysisResults.recommendations.map(
                    (rec: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-2 border rounded"
                      >
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="text-sm">{rec}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis History */}
      {analysisHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Histórico de Análises
            </CardTitle>
            <CardDescription>
              Últimas {analysisHistory.length} análises realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysisHistory.map((analysis, index) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium">
                        Score: {analysis.overall_score}%
                      </span>
                      <Badge className={getRiskBadgeColor(analysis.risk_level)}>
                        {analysis.risk_level}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {analysis.tasks_generated} tarefas geradas
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {analysis.modules_analyzed} módulos •{" "}
                      {analysis.issues_detected} issues detectadas
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      {new Date(analysis.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(analysis.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Capabilities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Capacidades da IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Análise Técnica</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Performance e tempo de carregamento</li>
                <li>✅ Análise de código e complexidade</li>
                <li>✅ Detecção de gargalos</li>
                <li>✅ Integrações e APIs</li>
                <li>✅ Segurança e vulnerabilidades</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Análise de UX</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Responsividade mobile</li>
                <li>✅ Acessibilidade WCAG</li>
                <li>✅ Padrões de navegação</li>
                <li>✅ Usabilidade e ergonomia</li>
                <li>✅ Feedback e interações</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
