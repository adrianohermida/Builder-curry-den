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
  Rocket,
  Plus,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  BarChart3,
  Settings,
  Bot,
  DollarSign,
  Eye,
  Play,
  Pause,
  Archive,
} from "lucide-react";

import { ReleaseChecklist } from "./ReleaseChecklist";
import { releaseFrameworkService } from "../../services/releaseFrameworkService";
import {
  ReleaseItem,
  ReleaseType,
  ReleaseStatus,
  ReleaseDashboardData,
  ReleaseMetrics,
} from "../../types/releaseFramework";
import { ModuleName } from "../../types/actionPlan";

export const ReleaseFrameworkDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] =
    useState<ReleaseDashboardData | null>(null);
  const [releases, setReleases] = useState<ReleaseItem[]>([]);
  const [selectedRelease, setSelectedRelease] = useState<ReleaseItem | null>(
    null,
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<ReleaseStatus | "all">(
    "all",
  );
  const [filterType, setFilterType] = useState<ReleaseType | "all">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [dashData, allReleases] = await Promise.all([
        releaseFrameworkService.getDashboardData(),
        releaseFrameworkService.getAllReleases(),
      ]);

      setDashboardData(dashData);
      setReleases(allReleases);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRelease = async (data: Partial<ReleaseItem>) => {
    try {
      await releaseFrameworkService.createRelease(data);
      await loadData();
      setShowCreateForm(false);
    } catch (error) {
      console.error("Erro ao criar release:", error);
    }
  };

  const handleRunAIAnalysis = async (releaseId: string) => {
    try {
      await releaseFrameworkService.runAIAnalysis(releaseId);
      await loadData();
    } catch (error) {
      console.error("Erro na análise de IA:", error);
    }
  };

  const handleStatusChange = async (
    releaseId: string,
    newStatus: ReleaseStatus,
  ) => {
    try {
      await releaseFrameworkService.changeStatus(releaseId, newStatus, "user");
      await loadData();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
    }
  };

  const getStatusColor = (status: ReleaseStatus) => {
    switch (status) {
      case "lançado":
        return "bg-green-100 text-green-800";
      case "pronto para lançar":
        return "bg-blue-100 text-blue-800";
      case "em validação":
        return "bg-yellow-100 text-yellow-800";
      case "rascunho":
        return "bg-gray-100 text-gray-800";
      case "pausado":
        return "bg-orange-100 text-orange-800";
      case "rejeitado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "baixo":
        return "text-green-600";
      case "moderado":
        return "text-yellow-600";
      case "alto":
        return "text-orange-600";
      case "crítico":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const filteredReleases = releases.filter((release) => {
    const statusMatch =
      filterStatus === "all" || release.status === filterStatus;
    const typeMatch =
      filterType === "all" || release.tipo_lançamento === filterType;
    return statusMatch && typeMatch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Carregando Release Framework...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            🚀 Release Intelligence Framework
          </h1>
          <p className="text-muted-foreground">
            Sistema de governança para lançamento de módulos, funções e produtos
          </p>
        </div>

        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Release
        </Button>
      </div>

      {/* Metrics Overview */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {dashboardData.metrics.total_releases}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total Releases
                  </p>
                </div>
                <Rocket className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {dashboardData.metrics.current_active_releases}
                  </p>
                  <p className="text-xs text-muted-foreground">Ativos</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {dashboardData.metrics.success_rate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Taxa de Sucesso
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {dashboardData.metrics.high_risk_releases}
                  </p>
                  <p className="text-xs text-muted-foreground">Alto Risco</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Recommendations */}
      {dashboardData?.ai_recommendations &&
        dashboardData.ai_recommendations.length > 0 && (
          <Alert className="border-blue-200 bg-blue-50">
            <Bot className="h-4 w-4" />
            <AlertTitle>🤖 Recomendações da IA</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 space-y-1">
                {dashboardData.ai_recommendations.slice(0, 3).map((rec) => (
                  <li key={rec.id} className="text-sm">
                    • <strong>{rec.title}:</strong> {rec.description}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

      {/* Main Content */}
      <Tabs defaultValue="kanban" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="space-y-4">
          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(
              [
                "rascunho",
                "em validação",
                "pronto para lançar",
                "lançado",
              ] as ReleaseStatus[]
            ).map((status) => {
              const statusReleases = filteredReleases.filter(
                (r) => r.status === status,
              );

              return (
                <Card key={status} className="h-fit">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span className="capitalize">
                        {status.replace("_", " ")}
                      </span>
                      <Badge variant="outline">{statusReleases.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {statusReleases.map((release) => (
                      <Card
                        key={release.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedRelease(release)}
                      >
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">
                              {release.nome_funcionalidade}
                            </h4>

                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {release.tipo_lançamento}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {release.módulo_associado}
                              </Badge>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Prontidão</span>
                                <span>{release.readiness_score}%</span>
                              </div>
                              <Progress
                                value={release.readiness_score}
                                className="h-1"
                              />
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>
                                Risco:{" "}
                                <span
                                  className={getRiskColor(release.risk_level)}
                                >
                                  {release.risk_level}
                                </span>
                              </span>
                              <span>{release.responsável}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as ReleaseStatus | "all")
              }
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">Todos os Status</option>
              <option value="rascunho">Rascunho</option>
              <option value="em validação">Em Validação</option>
              <option value="pronto para lançar">Pronto para Lançar</option>
              <option value="lançado">Lançado</option>
              <option value="pausado">Pausado</option>
              <option value="rejeitado">Rejeitado</option>
            </select>

            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as ReleaseType | "all")
              }
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">Todos os Tipos</option>
              <option value="módulo">Módulo</option>
              <option value="função">Função</option>
              <option value="produto interno">Produto Interno</option>
            </select>
          </div>

          {/* Release List */}
          <div className="space-y-3">
            {filteredReleases.map((release) => (
              <Card
                key={release.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">
                          {release.nome_funcionalidade}
                        </h3>
                        <Badge className={getStatusColor(release.status)}>
                          {release.status}
                        </Badge>
                        <Badge variant="outline">
                          {release.tipo_lançamento}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Módulo:</span>{" "}
                          {release.módulo_associado}
                        </div>
                        <div>
                          <span className="font-medium">Responsável:</span>{" "}
                          {release.responsável}
                        </div>
                        <div>
                          <span className="font-medium">Prontidão:</span>{" "}
                          {release.readiness_score}%
                        </div>
                        <div>
                          <span className="font-medium">Risco:</span>
                          <span className={getRiskColor(release.risk_level)}>
                            {" "}
                            {release.risk_level}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRunAIAnalysis(release.id)}
                      >
                        <Bot className="h-3 w-3 mr-1" />
                        IA
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRelease(release)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {dashboardData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Release Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Releases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Taxa de Sucesso</span>
                        <span>
                          {dashboardData.metrics.success_rate.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={dashboardData.metrics.success_rate} />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Tempo Médio de Release</span>
                        <span>
                          {dashboardData.metrics.average_time_to_release.toFixed(
                            0,
                          )}{" "}
                          dias
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Impacto de Receita</span>
                        <span>
                          R${" "}
                          {dashboardData.metrics.revenue_impact.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Distribution Charts */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(dashboardData.metrics.by_status).map(
                      ([status, count]) => (
                        <div
                          key={status}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm capitalize">
                            {status.replace("_", " ")}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{count}</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                  width: `${(count / dashboardData.metrics.total_releases) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          {dashboardData?.compliance_status && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Status de Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>LGPD</span>
                      {dashboardData.compliance_status.lgpd_compliance ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Acessibilidade</span>
                      {dashboardData.compliance_status
                        .accessibility_compliance ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Segurança</span>
                      {dashboardData.compliance_status.security_compliance ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Documentação</span>
                      {dashboardData.compliance_status
                        .documentation_complete ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Últimas Auditorias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Última auditoria:</span>
                      <div className="text-muted-foreground">
                        {new Date(
                          dashboardData.compliance_status.last_audit,
                        ).toLocaleString()}
                      </div>
                    </div>

                    <div className="text-sm">
                      <span className="font-medium">Issues encontradas:</span>
                      <div className="text-muted-foreground">
                        {dashboardData.compliance_status.issues_count}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Release Detail Modal */}
      {selectedRelease && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {selectedRelease.nome_funcionalidade}
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedRelease(null)}
                >
                  ✕
                </Button>
              </div>
            </div>

            <ScrollArea className="p-6 max-h-[70vh]">
              <ReleaseChecklist
                release={selectedRelease}
                onUpdate={(updated) => {
                  setSelectedRelease(updated);
                  loadData();
                }}
              />
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Create Release Form */}
      {showCreateForm && (
        <CreateReleaseForm
          onSubmit={handleCreateRelease}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
};

// Create Release Form Component
interface CreateReleaseFormProps {
  onSubmit: (data: Partial<ReleaseItem>) => void;
  onCancel: () => void;
}

const CreateReleaseForm: React.FC<CreateReleaseFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    nome_funcionalidade: "",
    tipo_lançamento: "função" as ReleaseType,
    módulo_associado: "Configurações" as ModuleName,
    responsável: "",
    descrição: "",
    data_prevista: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    versão: "1.0.0",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Criar Novo Release</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nome da Funcionalidade
              </label>
              <input
                type="text"
                required
                value={formData.nome_funcionalidade}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nome_funcionalidade: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Ex: Sistema de Flipbook Monetizado"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tipo de Lançamento
                </label>
                <select
                  value={formData.tipo_lançamento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipo_lançamento: e.target.value as ReleaseType,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="função">Função</option>
                  <option value="módulo">Módulo</option>
                  <option value="produto interno">Produto Interno</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Módulo Associado
                </label>
                <select
                  value={formData.módulo_associado}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      módulo_associado: e.target.value as ModuleName,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="CRM Jurídico">CRM Jurídico</option>
                  <option value="GED">GED</option>
                  <option value="IA Jurídica">IA Jurídica</option>
                  <option value="Publicações">Publicações</option>
                  <option value="Atendimento">Atendimento</option>
                  <option value="Agenda">Agenda</option>
                  <option value="Tarefas">Tarefas</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="Configurações">Configurações</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Responsável
                </label>
                <input
                  type="text"
                  required
                  value={formData.responsável}
                  onChange={(e) =>
                    setFormData({ ...formData, responsável: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Nome do responsável"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Data Prevista
                </label>
                <input
                  type="date"
                  value={formData.data_prevista}
                  onChange={(e) =>
                    setFormData({ ...formData, data_prevista: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Descrição
              </label>
              <textarea
                value={formData.descrição}
                onChange={(e) =>
                  setFormData({ ...formData, descrição: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
                placeholder="Descreva a funcionalidade..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">Criar Release</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
