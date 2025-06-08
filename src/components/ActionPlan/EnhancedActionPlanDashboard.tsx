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
  Activity,
  BarChart3,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Brain,
  Zap,
  Eye,
  EyeOff,
  Settings,
  Users,
  FolderOpen,
  Calendar,
  MessageSquare,
  DollarSign,
  Monitor,
  Sparkles,
} from "lucide-react";

import { actionPlanService } from "../../services/actionPlanService";
import { ActionPlanState, ModuleName } from "../../types/actionPlan";

interface EnhancedActionPlanDashboardProps {
  showHiddenModules?: boolean;
  onNotification?: (message: string) => void;
}

export const EnhancedActionPlanDashboard: React.FC<
  EnhancedActionPlanDashboardProps
> = ({ showHiddenModules = false, onNotification }) => {
  const [actionPlanState, setActionPlanState] =
    useState<ActionPlanState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to action plan changes
    const unsubscribe = actionPlanService.subscribe((newState) => {
      setActionPlanState(newState);
      setIsLoading(false);
    });

    // Initial load
    const currentState = actionPlanService.getState();
    if (currentState) {
      setActionPlanState(currentState);
      setIsLoading(false);
    }

    return unsubscribe;
  }, []);

  const getModuleIcon = (moduleName: ModuleName) => {
    const iconMap = {
      "CRM Jurídico": Users,
      "IA Jurídica": Brain,
      GED: FolderOpen,
      Tarefas: CheckCircle2,
      Publicações: Calendar,
      Atendimento: MessageSquare,
      Agenda: Calendar,
      Financeiro: DollarSign,
      Configurações: Settings,
      "Design System": Monitor,
      "Features Beta": Sparkles,
    };
    return iconMap[moduleName] || Target;
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case "excelente":
        return "text-green-600";
      case "boa":
        return "text-blue-600";
      case "regular":
        return "text-yellow-600";
      case "critica":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getHealthBadgeColor = (health: string) => {
    switch (health) {
      case "excelente":
        return "bg-green-100 text-green-800";
      case "boa":
        return "bg-blue-100 text-blue-800";
      case "regular":
        return "bg-yellow-100 text-yellow-800";
      case "critica":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading || !actionPlanState) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  const allModules = showHiddenModules
    ? actionPlanState.modulos
    : actionPlanState.modulos.filter(
        (m) => !["Design System", "Features Beta"].includes(m.modulo),
      );

  const totalTasks = allModules.reduce(
    (sum, module) =>
      sum +
      module.tarefas_pendentes.length +
      module.em_execucao.length +
      module.concluidas.length,
    0,
  );

  const completedTasks = allModules.reduce(
    (sum, module) => sum + module.concluidas.length,
    0,
  );
  const pendingTasks = allModules.reduce(
    (sum, module) => sum + module.tarefas_pendentes.length,
    0,
  );
  const inProgressTasks = allModules.reduce(
    (sum, module) => sum + module.em_execucao.length,
    0,
  );

  const overallProgress =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const criticalModules = allModules.filter(
    (m) => m.saude_geral === "critica",
  ).length;

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{totalTasks}</p>
                <p className="text-xs text-muted-foreground">
                  Total de Tarefas
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {overallProgress.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">Progresso Geral</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <Progress value={overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{inProgressTasks}</p>
                <p className="text-xs text-muted-foreground">Em Execução</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {pendingTasks} pendentes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{criticalModules}</p>
                <p className="text-xs text-muted-foreground">
                  Módulos Críticos
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {criticalModules > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>⚠️ Atenção: Módulos em Estado Crítico</AlertTitle>
          <AlertDescription>
            {criticalModules} módulo(s) necessitam de atenção imediata.
            Verifique os detalhes abaixo e execute as ações recomendadas.
          </AlertDescription>
        </Alert>
      )}

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allModules.map((module) => {
          const Icon = getModuleIcon(module.modulo);
          const isHidden = ["Design System", "Features Beta"].includes(
            module.modulo,
          );
          const totalModuleTasks =
            module.tarefas_pendentes.length +
            module.em_execucao.length +
            module.concluidas.length;

          return (
            <Card
              key={module.modulo}
              className={`hover:shadow-lg transition-shadow ${
                isHidden ? "border-purple-200 bg-purple-50" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isHidden ? "bg-purple-100" : "bg-blue-100"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isHidden ? "text-purple-600" : "text-blue-600"
                        }`}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.modulo}</CardTitle>
                      {isHidden && (
                        <Badge
                          variant="secondary"
                          className="mt-1 bg-purple-100 text-purple-800"
                        >
                          BETA
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge className={getHealthBadgeColor(module.saude_geral)}>
                    {module.saude_geral}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Conclusão</span>
                    <span>{module.metricas.taxa_conclusao.toFixed(1)}%</span>
                  </div>
                  <Progress
                    value={module.metricas.taxa_conclusao}
                    className="h-2"
                  />
                </div>

                {/* Tasks Summary */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      {module.concluidas.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Concluídas
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {module.em_execucao.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Executando
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-600">
                      {module.tarefas_pendentes.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Pendentes
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="pt-3 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tempo Médio</span>
                    <span>
                      {module.metricas.tempo_medio_execucao.toFixed(1)}h
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Última Análise IA</span>
                    <span>
                      {module.ultima_analise_ia
                        ? new Date(
                            module.ultima_analise_ia,
                          ).toLocaleDateString()
                        : "Nunca"}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() =>
                      onNotification?.(`Navegando para ${module.modulo}`)
                    }
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Ver Detalhes
                  </Button>
                </div>

                {/* AI Analysis Badge */}
                {module.analises_ia.length > 0 && (
                  <div className="flex items-center justify-center">
                    <Badge variant="outline" className="text-xs">
                      <Brain className="h-3 w-3 mr-1" />
                      {module.analises_ia.length} análises IA
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent AI Analyses */}
      {actionPlanState.analises_ia.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Análises Recentes da IA
            </CardTitle>
            <CardDescription>
              Últimas análises automatizadas do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {actionPlanState.analises_ia.slice(0, 5).map((analise, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {analise.modulo}
                      </Badge>
                      <span className="text-sm font-medium">
                        Score: {analise.score_prontidao}/100
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {analise.recomendacoes.slice(0, 1)[0] ||
                        "Análise completa realizada"}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(analise.data_analise).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() =>
                onNotification?.("Executando análise geral de IA...")
              }
            >
              <Brain className="h-6 w-6" />
              <span className="font-medium">Análise Geral IA</span>
              <span className="text-xs opacity-70">
                Analisar todos os módulos
              </span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => onNotification?.("Gerando relatório executivo...")}
            >
              <BarChart3 className="h-6 w-6" />
              <span className="font-medium">Relatório Executivo</span>
              <span className="text-xs opacity-70">Dashboard para gestão</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => onNotification?.("Exportando dados...")}
            >
              <Activity className="h-6 w-6" />
              <span className="font-medium">Exportar Dados</span>
              <span className="text-xs opacity-70">CSV, JSON, PDF</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Version Info */}
      <div className="text-center text-xs text-muted-foreground">
        <p>
          Plano de Ação v{actionPlanState.versao_atual.versao} • Última
          atualização:{" "}
          {new Date(actionPlanState.versao_atual.data_criacao).toLocaleString()}
        </p>
      </div>
    </div>
  );
};
