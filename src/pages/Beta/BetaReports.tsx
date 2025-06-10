/**
 * 📊 BETA REPORTS - RELATÓRIOS DE PÁGINAS ÓRFÃS
 *
 * Sistema de relatórios administrativos:
 * ✅ Relatórios de uso das páginas Beta
 * ✅ Métricas de acesso e tempo de permanência
 * ✅ Recomendações baseadas em dados
 * ✅ Exportação para CSV/PDF
 * ✅ Gráficos e visualizações
 */

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Download,
  Calendar,
  Users,
  Clock,
  TrendingUp,
  FileText,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Archive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  useBetaAccessLogger,
  type BetaUsageReport,
} from "@/services/betaAccessLogger";
import { usePermissions } from "@/hooks/usePermissions";

export default function BetaReports() {
  const [report, setReport] = useState<BetaUsageReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportPeriod, setReportPeriod] = useState(30);
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");

  const { generateReport, exportCSV } = useBetaAccessLogger();
  const { hasPermission } = usePermissions();

  // Verificar se é admin
  const isAdmin = hasPermission("admin.sistema");

  // Carregar relatório
  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      try {
        const usageReport = generateReport(reportPeriod);
        setReport(usageReport);
      } catch (error) {
        console.error("Erro ao gerar relatório:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      loadReport();
    }
  }, [isAdmin, reportPeriod, generateReport]);

  // Filtrar recomendações por categoria
  const filteredRecommendations = report?.recommendations.filter((rec) => {
    if (selectedCategory === "todos") return true;
    return rec.recommendation === selectedCategory;
  });

  // Função para exportar relatório
  const handleExportReport = (format: "csv" | "json") => {
    if (!report) return;

    if (format === "csv") {
      const csv = exportCSV(report);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `lawdesk-beta-usage-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const json = JSON.stringify(report, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `lawdesk-beta-report-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // Função para obter cor da recomendação
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "promote":
        return "bg-green-100 text-green-800 border-green-200";
      case "improve":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "archive":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "remove":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Função para obter ícone da recomendação
  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case "promote":
        return <TrendingUp className="w-4 h-4" />;
      case "improve":
        return <CheckCircle2 className="w-4 h-4" />;
      case "archive":
        return <Archive className="w-4 h-4" />;
      case "remove":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Acesso Restrito
          </h3>
          <p className="text-gray-600">
            Esta seção é exclusiva para administradores do sistema.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Gerando relatório de uso...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Erro no Relatório
          </h3>
          <p className="text-gray-600">
            Não foi possível gerar o relatório de uso.
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
              <BarChart3 className="w-6 h-6 text-blue-600" />
              Relatórios Beta
            </h1>
            <p className="text-gray-600 mt-1">
              Análise de uso das páginas órfãs e recomendações
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Período do relatório */}
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={7}>Últimos 7 dias</option>
              <option value={30}>Últimos 30 dias</option>
              <option value={90}>Últimos 90 dias</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportReport("csv")}
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportReport("json")}
            >
              <FileText className="w-4 h-4 mr-2" />
              JSON
            </Button>

            <Button
              size="sm"
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Métricas Resumo */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {report.summary.totalAccesses}
                </p>
                <p className="text-sm text-gray-600">Total de Acessos</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {report.summary.uniqueUsers}
                </p>
                <p className="text-sm text-gray-600">Usuários Únicos</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {report.summary.totalPages}
                </p>
                <p className="text-sm text-gray-600">Páginas Acessadas</p>
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
                  {report.summary.averageDuration}s
                </p>
                <p className="text-sm text-gray-600">Tempo Médio</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Filtros */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            Filtrar por:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todas Recomendações</option>
            <option value="promote">Promover</option>
            <option value="improve">Melhorar</option>
            <option value="archive">Arquivar</option>
            <option value="remove">Remover</option>
          </select>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Páginas Mais Acessadas */}
          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle>Páginas Mais Acessadas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4">
                {report.summary.mostAccessedPages.map((page, index) => (
                  <div
                    key={page.page}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {page.page}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {page.uniqueUsers} usuário(s) único(s)
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {page.accesses}
                      </p>
                      <p className="text-sm text-gray-600">acessos</p>
                    </div>
                  </div>
                ))}

                {report.summary.mostAccessedPages.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Nenhum acesso registrado no período.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recomendações */}
          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="flex items-center justify-between">
                <span>Recomendações Baseadas em Dados</span>
                <Badge variant="outline">
                  {filteredRecommendations?.length || 0} itens
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4">
                {filteredRecommendations?.map((rec, index) => (
                  <div
                    key={`${rec.page}_${index}`}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900">
                            {rec.page}
                          </h4>
                          <Badge className={getRecommendationColor(rec.usage)}>
                            Uso: {rec.usage}
                          </Badge>
                          <Badge variant="outline">{rec.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {rec.reasoning}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            Status atual:
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {rec.currentStatus}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getRecommendationIcon(rec.recommendation)}
                        <Badge
                          className={getRecommendationColor(rec.recommendation)}
                        >
                          {rec.recommendation === "promote"
                            ? "Promover"
                            : rec.recommendation === "improve"
                              ? "Melhorar"
                              : rec.recommendation === "archive"
                                ? "Arquivar"
                                : "Remover"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredRecommendations?.length === 0 && (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Nenhuma recomendação encontrada para o filtro selecionado.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Período do Relatório */}
          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Período do Relatório
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Início:</strong>{" "}
                  {new Date(report.period.start).toLocaleString("pt-BR")}
                </p>
                <p>
                  <strong>Fim:</strong>{" "}
                  {new Date(report.period.end).toLocaleString("pt-BR")}
                </p>
                <p className="mt-2">
                  <strong>Total de registros:</strong>{" "}
                  {report.detailedLogs.length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
