/**
 * 🧪 BETA DASHBOARD - CENTRO DE CONTROLE DE PÁGINAS ÓRFÃS
 *
 * Dashboard administrativo para gerenciar páginas e componentes órfãos:
 * ✅ Relatório completo de diagnóstico
 * ✅ Navegação para páginas órfãs
 * ✅ Sistema de categorização
 * ✅ Ações em lote
 * ✅ Exportação de relatórios
 * ✅ Métricas de utilização
 */

import React, { useState, useEffect } from "react";
import {
  FlaskConical,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Link,
  GitMerge,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  BarChart3,
  FileText,
  Component,
  Route,
  Menu,
  Info,
  Zap,
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  useOrphanDiagnostic,
  type DiagnosticReport,
  type OrphanedPage,
  type OrphanedComponent,
} from "@/services/orphanDiagnostic";
import { usePermissions } from "@/hooks/usePermissions";

export default function BetaDashboard() {
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todos");
  const [filtroTexto, setFiltroTexto] = useState("");
  const [viewMode, setViewMode] = useState<"pages" | "components" | "routes">(
    "pages",
  );

  const { generateReport, exportReport } = useOrphanDiagnostic();
  const { hasPermission } = usePermissions();

  // Verificar se é admin
  const isAdmin = hasPermission("admin.sistema");

  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      try {
        const diagnosticReport = generateReport();
        setReport(diagnosticReport);
      } catch (error) {
        console.error("Erro ao gerar relatório:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, []); // Remove generateReport dependency to prevent infinite loop

  // Filtrar itens baseado nos filtros
  const filteredPages = report?.orphanedPages.filter((page) => {
    const matchCategoria =
      filtroCategoria === "todos" || page.category === filtroCategoria;
    const matchTexto =
      !filtroTexto ||
      page.name.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      page.description.toLowerCase().includes(filtroTexto.toLowerCase());
    return matchCategoria && matchTexto;
  });

  const filteredComponents = report?.orphanedComponents.filter((comp) => {
    const matchTexto =
      !filtroTexto ||
      comp.name.toLowerCase().includes(filtroTexto.toLowerCase());
    return matchTexto;
  });

  // Função para obter cor da categoria
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "desconectado":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "obsoleto":
        return "bg-red-100 text-red-800 border-red-200";
      case "duplicado":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "em_testes":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "pendente":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Função para obter ícone da ação
  const getActionIcon = (action: string) => {
    switch (action) {
      case "connect":
        return <Link className="w-4 h-4" />;
      case "remove":
        return <Trash2 className="w-4 h-4" />;
      case "merge":
        return <GitMerge className="w-4 h-4" />;
      case "test":
        return <FlaskConical className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  // Função para exportar relatório
  const handleExportReport = () => {
    if (report) {
      const downloadUrl = exportReport(report);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `lawdesk-orphan-report-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
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
          <p className="text-gray-600">Analisando páginas e componentes...</p>
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
            Erro no Diagnóstico
          </h3>
          <p className="text-gray-600">
            Não foi possível gerar o relatório de diagnóstico.
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
              <FlaskConical className="w-6 h-6 text-purple-600" />
              Beta - Páginas Órfãs
            </h1>
            <p className="text-gray-600 mt-1">
              Centro de controle para páginas e componentes não conectados
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportReport}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </Button>
            <Badge variant="outline" className="text-sm">
              Última análise: {new Date(report.timestamp).toLocaleString()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {report.summary.orphanedPages}
                </p>
                <p className="text-sm text-gray-600">Páginas Órfãs</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Component className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {report.summary.orphanedComponents}
                </p>
                <p className="text-sm text-gray-600">Componentes Órfãos</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Route className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {report.summary.accessibleRoutes}
                </p>
                <p className="text-sm text-gray-600">Rotas Ativas</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {report.summary.utilizationRate}%
                </p>
                <p className="text-sm text-gray-600">Taxa de Utilização</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Progress bar de utilização */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Utilização do Sistema
            </span>
            <span className="text-sm text-gray-500">
              {report.summary.totalPages - report.summary.orphanedPages} de{" "}
              {report.summary.totalPages} páginas conectadas
            </span>
          </div>
          <Progress value={report.summary.utilizationRate} className="h-2" />
        </div>
      </div>

      {/* Controles de Visualização */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Tabs de modo */}
          <div className="flex rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode("pages")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                viewMode === "pages"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100",
              )}
            >
              Páginas ({report.summary.orphanedPages})
            </button>
            <button
              onClick={() => setViewMode("components")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                viewMode === "components"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100",
              )}
            >
              Componentes ({report.summary.orphanedComponents})
            </button>
            <button
              onClick={() => setViewMode("routes")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                viewMode === "routes"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100",
              )}
            >
              Rotas ({report.summary.accessibleRoutes})
            </button>
          </div>

          {/* Filtros */}
          <div className="flex gap-3 flex-1">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou descrição..."
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {viewMode === "pages" && (
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todas Categorias</option>
                <option value="desconectado">Desconectado</option>
                <option value="obsoleto">Obsoleto</option>
                <option value="duplicado">Duplicado</option>
                <option value="em_testes">Em Testes</option>
                <option value="pendente">Pendente</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Lista de Páginas */}
          {viewMode === "pages" && (
            <div className="space-y-4">
              {filteredPages?.map((page) => (
                <Card
                  key={page.id}
                  className="p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0 mt-1">
                          <FileText className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {page.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {page.description}
                          </p>
                          <p className="text-xs text-gray-500 mb-3">
                            {page.filePath}
                          </p>

                          {/* Tags de status */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge className={getCategoryColor(page.category)}>
                              {page.category
                                .replace("_", " ")
                                .charAt(0)
                                .toUpperCase() +
                                page.category.replace("_", " ").slice(1)}
                            </Badge>

                            {!page.hasRoute && (
                              <Badge
                                variant="outline"
                                className="text-red-600 border-red-200"
                              >
                                Sem Rota
                              </Badge>
                            )}

                            {!page.hasMenuEntry && (
                              <Badge
                                variant="outline"
                                className="text-orange-600 border-orange-200"
                              >
                                Sem Menu
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-gray-700">
                            <strong>Motivo:</strong> {page.reasonOrphaned}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-80 space-y-3">
                      {/* Rotas sugeridas */}
                      {page.potentialRoutes.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Route className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">
                              Rotas Sugeridas
                            </span>
                          </div>
                          <div className="space-y-1">
                            {page.potentialRoutes
                              .slice(0, 2)
                              .map((route, index) => (
                                <div
                                  key={index}
                                  className="text-sm text-blue-700 font-mono"
                                >
                                  {route}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Ação sugerida */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          {getActionIcon(page.suggestedAction)}
                          <span className="text-sm font-medium text-gray-800">
                            Ação Sugerida:{" "}
                            {page.suggestedAction === "connect"
                              ? "Conectar"
                              : page.suggestedAction === "remove"
                                ? "Remover"
                                : page.suggestedAction === "merge"
                                  ? "Consolidar"
                                  : page.suggestedAction === "test"
                                    ? "Testar"
                                    : "Arquivar"}
                          </span>
                        </div>
                      </div>

                      {/* Botões de ação */}
                      <div className="flex gap-2">
                        {page.potentialRoutes[0] && (
                          <RouterLink to={page.potentialRoutes[0]}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Testar
                            </Button>
                          </RouterLink>
                        )}
                        <Button size="sm" variant="outline">
                          <Info className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {filteredPages?.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma página encontrada
                  </h3>
                  <p className="text-gray-600">
                    Ajuste os filtros para ver mais resultados.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Lista de Componentes */}
          {viewMode === "components" && (
            <div className="space-y-4">
              {filteredComponents?.map((component) => (
                <Card key={component.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <Component className="w-5 h-5 text-gray-600 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {component.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {component.filePath}
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        {component.reasonOrphaned}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{component.category}</Badge>
                        <Badge variant="outline" className="text-red-600">
                          Ação: {component.suggestedAction}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Lista de Rotas */}
          {viewMode === "routes" && (
            <div className="space-y-4">
              {report.routeDependencies.map((route, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <Route className="w-5 h-5 text-green-600 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {route.route}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Componente: {route.component}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-green-600">
                          Acessível
                        </Badge>
                        {route.hasMenuEntry && (
                          <Badge variant="outline" className="text-blue-600">
                            No Menu
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        Breadcrumbs: {route.breadcrumbs.join(" > ")}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Recomendações */}
          <Card className="mt-8 p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                Recomendações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                {report.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-700">
                      {recommendation}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
