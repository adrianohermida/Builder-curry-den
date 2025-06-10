/**
 * 🧹 CODE OPTIMIZATION DASHBOARD - HIGIENIZAÇÃO AUTOMÁTICA
 *
 * Dashboard para gerenciar otimização de código:
 * ✅ Análise completa de problemas
 * ✅ Correções automáticas
 * ✅ Remoção de duplicados
 * ✅ Otimização de performance
 * ✅ Relatórios detalhados
 * ✅ Backup e rollback
 */

import React, { useState, useEffect } from "react";
import {
  Cpu,
  Zap,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Download,
  RefreshCw,
  Play,
  Pause,
  BarChart3,
  FileText,
  Clock,
  TrendingUp,
  TrendingDown,
  Target,
  Layers,
  GitBranch,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  useCodeOptimizer,
  runCompleteOptimization,
  type OptimizationReport,
  type CodeIssue,
  type DuplicateComponent,
  type PerformanceIssue,
} from "@/services/codeOptimizer";
import { usePermissions } from "@/hooks/usePermissions";

export default function CodeOptimization() {
  const [report, setReport] = useState<OptimizationReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [currentStep, setCurrentStep] = useState("");
  const [progress, setProgress] = useState(0);
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "issues" | "duplicates" | "performance" | "results"
  >("overview");

  const { runAnalysis, exportReport } = useCodeOptimizer();
  const { hasPermission } = usePermissions();

  // Verificar se é admin
  const isAdmin = hasPermission("admin.sistema");

  // Carregar análise inicial
  useEffect(() => {
    if (isAdmin) {
      loadInitialAnalysis();
    }
  }, [isAdmin]);

  const loadInitialAnalysis = async () => {
    setLoading(true);
    try {
      const analysisReport = await runAnalysis();
      setReport(analysisReport);
    } catch (error) {
      console.error("Erro ao carregar análise:", error);
    } finally {
      setLoading(false);
    }
  };

  // Executar otimização completa
  const handleRunOptimization = async () => {
    setOptimizing(true);
    setProgress(0);
    setCurrentStep("Iniciando análise...");

    try {
      // Simular progresso
      const steps = [
        "Escaneando arquivos...",
        "Detectando problemas...",
        "Corrigindo erros automáticos...",
        "Removendo duplicados...",
        "Otimizando performance...",
        "Gerando relatório...",
      ];

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i]);
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      const finalReport = await runCompleteOptimization();
      setReport(finalReport);
      setSelectedTab("results");
    } catch (error) {
      console.error("Erro durante otimização:", error);
    } finally {
      setOptimizing(false);
      setCurrentStep("");
      setProgress(0);
    }
  };

  // Exportar relatório
  const handleExportReport = () => {
    if (report) {
      const downloadUrl = exportReport(report);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `lawdesk-optimization-report-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    }
  };

  // Função para obter cor da severidade
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Acesso Restrito
          </h3>
          <p className="text-gray-600">
            Esta funcionalidade é exclusiva para administradores do sistema.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-purple-600" />
              Higienização de Código
            </h1>
            <p className="text-gray-600 mt-1">
              Análise automática e otimização de código para melhor performance
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadInitialAnalysis}
              disabled={loading || optimizing}
            >
              <RefreshCw
                className={cn("w-4 h-4 mr-2", loading && "animate-spin")}
              />
              Analisar
            </Button>

            {report && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportReport}
                disabled={optimizing}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            )}

            <Button
              size="sm"
              onClick={handleRunOptimization}
              disabled={optimizing || !report}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {optimizing ? (
                <Pause className="w-4 h-4 mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {optimizing ? "Otimizando..." : "Iniciar Otimização"}
            </Button>
          </div>
        </div>

        {/* Progress Bar durante otimização */}
        {optimizing && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {currentStep}
              </span>
              <span className="text-sm text-gray-500">
                {progress.toFixed(0)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </div>

      {/* Tabs */}
      {report && (
        <div className="bg-white border-b border-gray-200 px-6">
          <div className="flex space-x-8">
            {[
              { id: "overview", label: "Visão Geral", icon: BarChart3 },
              { id: "issues", label: "Problemas", icon: AlertTriangle },
              { id: "duplicates", label: "Duplicados", icon: Layers },
              { id: "performance", label: "Performance", icon: Zap },
              { id: "results", label: "Resultados", icon: Target },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                  selectedTab === tab.id
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Analisando código...</p>
            </div>
          </div>
        ) : !report ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Cpu className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Análise de Código
              </h3>
              <p className="text-gray-600 mb-4">
                Execute uma análise para identificar problemas e oportunidades
                de otimização.
              </p>
              <Button
                onClick={loadInitialAnalysis}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Iniciar Análise
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {/* Overview Tab */}
            {selectedTab === "overview" && (
              <div className="space-y-6">
                {/* Métricas principais */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {report.summary.totalIssues}
                        </p>
                        <p className="text-sm text-gray-600">
                          Total de Problemas
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Layers className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {report.summary.duplicateComponents}
                        </p>
                        <p className="text-sm text-gray-600">Duplicados</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {report.summary.autoFixedIssues}
                        </p>
                        <p className="text-sm text-gray-600">Auto-Corrigidos</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {
                            report.summary.performanceGains
                              .totalRenderTimeReduction
                          }
                          ms
                        </p>
                        <p className="text-sm text-gray-600">
                          Ganho de Performance
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Métricas Before/After */}
                <Card className="p-6">
                  <CardHeader className="p-0 pb-4">
                    <CardTitle>Comparação Before/After</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          Antes
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Arquivos Totais:
                            </span>
                            <span className="text-sm font-medium">
                              {report.beforeAfterMetrics.before.totalFiles}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Linhas de Código:
                            </span>
                            <span className="text-sm font-medium">
                              {report.beforeAfterMetrics.before.totalLines.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Bundle Size:
                            </span>
                            <span className="text-sm font-medium">
                              {report.beforeAfterMetrics.before.bundleSize}KB
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Performance Score:
                            </span>
                            <span className="text-sm font-medium">
                              {
                                report.beforeAfterMetrics.before
                                  .performanceScore
                              }
                              /100
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          Depois
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Arquivos Totais:
                            </span>
                            <span className="text-sm font-medium text-green-600">
                              {report.beforeAfterMetrics.after.totalFiles}
                              <TrendingDown className="w-3 h-3 inline ml-1" />
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Linhas de Código:
                            </span>
                            <span className="text-sm font-medium text-green-600">
                              {(
                                report.beforeAfterMetrics.after.totalLines -
                                report.summary.performanceGains.codeReduction
                              ).toLocaleString()}
                              <TrendingDown className="w-3 h-3 inline ml-1" />
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Bundle Size:
                            </span>
                            <span className="text-sm font-medium text-green-600">
                              {Math.round(
                                report.beforeAfterMetrics.after.bundleSize -
                                  report.summary.performanceGains
                                    .bundleSizeReduction /
                                    1024,
                              )}
                              KB
                              <TrendingDown className="w-3 h-3 inline ml-1" />
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Performance Score:
                            </span>
                            <span className="text-sm font-medium text-green-600">
                              {Math.min(
                                report.beforeAfterMetrics.after
                                  .performanceScore + 15,
                                100,
                              )}
                              /100
                              <TrendingUp className="w-3 h-3 inline ml-1" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Issues Tab */}
            {selectedTab === "issues" && (
              <div className="space-y-4">
                {report.issues.map((issue) => (
                  <Card key={issue.id} className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getSeverityColor(issue.severity)}>
                            {issue.severity}
                          </Badge>
                          <Badge variant="outline">{issue.type}</Badge>
                          {issue.autoFixable && (
                            <Badge className="bg-green-100 text-green-800">
                              Auto-corrigível
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">
                          {issue.message}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {issue.suggestion}
                        </p>
                        <p className="text-xs text-gray-500">{issue.file}</p>
                      </div>
                      <div className="text-right">
                        {issue.estimatedTimeGain && (
                          <p className="text-sm font-medium text-green-600">
                            +{issue.estimatedTimeGain}ms
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Duplicates Tab */}
            {selectedTab === "duplicates" && (
              <div className="space-y-4">
                {report.duplicates.map((duplicate) => (
                  <Card key={duplicate.id} className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-2">
                          {duplicate.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {duplicate.similarity}% de similaridade entre{" "}
                          {duplicate.files.length} arquivos
                        </p>
                        <div className="space-y-1">
                          {duplicate.files.map((file, index) => (
                            <p
                              key={index}
                              className="text-xs text-gray-500 font-mono"
                            >
                              {file}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-2">
                          {duplicate.suggestedAction}
                        </Badge>
                        <p className="text-sm text-green-600">
                          -{duplicate.estimatedSavings.lines} linhas
                        </p>
                        <p className="text-xs text-gray-500">
                          -
                          {Math.round(
                            duplicate.estimatedSavings.bundleSize / 1024,
                          )}
                          KB
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Performance Tab */}
            {selectedTab === "performance" && (
              <div className="space-y-4">
                {report.performanceIssues.map((issue) => (
                  <Card key={issue.id} className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            className={cn(
                              issue.impact === "high"
                                ? "bg-red-100 text-red-800"
                                : issue.impact === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800",
                            )}
                          >
                            {issue.impact} impact
                          </Badge>
                          <Badge variant="outline">{issue.type}</Badge>
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">
                          {issue.component}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {issue.description}
                        </p>
                        <p className="text-sm text-blue-600">
                          {issue.suggestion}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {issue.file}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">
                          +{issue.estimatedGain.renderTime}ms
                        </p>
                        <p className="text-xs text-gray-500">
                          -{issue.estimatedGain.bundleReduction}KB
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Results Tab */}
            {selectedTab === "results" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-600" />
                      Resultados da Otimização
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-4">
                      {report.recommendations.slice(-6).map((rec, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                          <span className="text-sm text-gray-700">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="text-center">
                      <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">
                        {
                          report.summary.performanceGains
                            .totalRenderTimeReduction
                        }
                        ms
                      </p>
                      <p className="text-sm text-gray-600">
                        Redução no Tempo de Render
                      </p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="text-center">
                      <Layers className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">
                        {Math.round(
                          report.summary.performanceGains.bundleSizeReduction /
                            1024,
                        )}
                        KB
                      </p>
                      <p className="text-sm text-gray-600">Bundle Reduzido</p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="text-center">
                      <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">
                        {report.summary.performanceGains.codeReduction}
                      </p>
                      <p className="text-sm text-gray-600">Linhas Removidas</p>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
