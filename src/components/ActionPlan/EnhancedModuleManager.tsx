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
  Target,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Settings,
  Brain,
  Play,
  Pause,
  Eye,
  Plus,
  Edit,
  Trash2,
  Users,
  FolderOpen,
  Calendar,
  MessageSquare,
  DollarSign,
  Monitor,
  Sparkles,
} from "lucide-react";

import { ModuleName } from "../../types/actionPlan";
import { actionPlanService } from "../../services/actionPlanService";

interface EnhancedModuleManagerProps {
  selectedModule: ModuleName;
  showHiddenModules?: boolean;
  onModuleChange?: (module: ModuleName) => void;
}

export const EnhancedModuleManager: React.FC<EnhancedModuleManagerProps> = ({
  selectedModule,
  showHiddenModules = false,
  onModuleChange,
}) => {
  const [moduleData, setModuleData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadModuleData();
  }, [selectedModule]);

  const loadModuleData = async () => {
    setIsLoading(true);
    try {
      // Simulate module data loading
      const mockData = {
        modulo: selectedModule,
        saude_geral: ["excelente", "boa", "regular", "critica"][
          Math.floor(Math.random() * 4)
        ],
        metricas: {
          taxa_conclusao: Math.floor(Math.random() * 40) + 60,
          tempo_medio_execucao: Math.random() * 3 + 1,
          tarefas_em_atraso: Math.floor(Math.random() * 5),
          bugs_reportados: Math.floor(Math.random() * 8),
        },
        tarefas_pendentes: Array.from(
          { length: Math.floor(Math.random() * 8) + 2 },
          (_, i) => ({
            id: `task_${i}`,
            titulo: `Tarefa ${i + 1} - ${selectedModule}`,
            prioridade: ["baixa", "media", "alta", "critica"][
              Math.floor(Math.random() * 4)
            ],
            estimativa: Math.floor(Math.random() * 16) + 1,
            responsavel: ["João Silva", "Maria Santos", "Pedro Costa"][
              Math.floor(Math.random() * 3)
            ],
          }),
        ),
        em_execucao: Array.from(
          { length: Math.floor(Math.random() * 3) + 1 },
          (_, i) => ({
            id: `executing_${i}`,
            titulo: `Em execução ${i + 1} - ${selectedModule}`,
            progresso: Math.floor(Math.random() * 70) + 20,
            responsavel: ["João Silva", "Maria Santos", "Pedro Costa"][
              Math.floor(Math.random() * 3)
            ],
          }),
        ),
        concluidas: Array.from(
          { length: Math.floor(Math.random() * 15) + 5 },
          (_, i) => ({
            id: `completed_${i}`,
            titulo: `Concluída ${i + 1} - ${selectedModule}`,
            data_conclusao: new Date(
              Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          }),
        ),
        analises_ia: Math.floor(Math.random() * 5) + 1,
        ultima_analise_ia: new Date().toISOString(),
      };

      setModuleData(mockData);
    } catch (error) {
      console.error("Erro ao carregar dados do módulo:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critica":
        return "bg-red-100 text-red-800";
      case "alta":
        return "bg-orange-100 text-orange-800";
      case "media":
        return "bg-yellow-100 text-yellow-800";
      case "baixa":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isHiddenModule = ["Design System", "Features Beta"].includes(
    selectedModule,
  );
  const Icon = getModuleIcon(selectedModule);

  if (isLoading || !moduleData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Carregando módulo {selectedModule}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <Card className={isHiddenModule ? "border-purple-200 bg-purple-50" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-lg ${
                  isHiddenModule ? "bg-purple-100" : "bg-blue-100"
                }`}
              >
                <Icon
                  className={`h-8 w-8 ${
                    isHiddenModule ? "text-purple-600" : "text-blue-600"
                  }`}
                />
              </div>
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  {selectedModule}
                  {isHiddenModule && (
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-800"
                    >
                      BETA
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Gerenciamento completo do módulo {selectedModule}
                </CardDescription>
              </div>
            </div>

            <Badge className={getHealthBadgeColor(moduleData.saude_geral)}>
              Status: {moduleData.saude_geral}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {moduleData.metricas.taxa_conclusao}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Taxa de Conclusão
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <Progress
              value={moduleData.metricas.taxa_conclusao}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {moduleData.metricas.tempo_medio_execucao.toFixed(1)}h
                </p>
                <p className="text-xs text-muted-foreground">Tempo Médio</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {moduleData.metricas.tarefas_em_atraso}
                </p>
                <p className="text-xs text-muted-foreground">Em Atraso</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{moduleData.analises_ia}</p>
                <p className="text-xs text-muted-foreground">Análises IA</p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Tarefas Pendentes ({moduleData.tarefas_pendentes.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {moduleData.tarefas_pendentes.slice(0, 5).map((task: any) => (
              <div key={task.id} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{task.titulo}</h4>
                  <Badge className={getPriorityColor(task.prioridade)}>
                    {task.prioridade}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>👤 {task.responsavel}</span>
                  <span>⏱️ {task.estimativa}h</span>
                </div>
                <div className="mt-2 flex gap-1">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Play className="h-3 w-3 mr-1" />
                    Iniciar
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            {moduleData.tarefas_pendentes.length > 5 && (
              <div className="text-center">
                <Button variant="outline" size="sm">
                  Ver todas ({moduleData.tarefas_pendentes.length})
                </Button>
              </div>
            )}

            <Button className="w-full" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </CardContent>
        </Card>

        {/* Tasks in Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Em Execução ({moduleData.em_execucao.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {moduleData.em_execucao.map((task: any) => (
              <div key={task.id} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{task.titulo}</h4>
                  <Badge
                    variant="default"
                    className="bg-blue-100 text-blue-800"
                  >
                    {task.progresso}%
                  </Badge>
                </div>
                <Progress value={task.progresso} className="mb-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>👤 {task.responsavel}</span>
                </div>
                <div className="mt-2 flex gap-1">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    Detalhes
                  </Button>
                  <Button size="sm" variant="outline">
                    <Pause className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            {moduleData.em_execucao.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2" />
                <p>Nenhuma tarefa em execução</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Concluídas ({moduleData.concluidas.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {moduleData.concluidas.slice(0, 5).map((task: any) => (
              <div key={task.id} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{task.titulo}</h4>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-xs text-muted-foreground">
                  ✅ {new Date(task.data_conclusao).toLocaleDateString()}
                </div>
              </div>
            ))}

            {moduleData.concluidas.length > 5 && (
              <div className="text-center">
                <Button variant="outline" size="sm">
                  Ver todas ({moduleData.concluidas.length})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Análise de IA do Módulo
          </CardTitle>
          <CardDescription>
            Última análise:{" "}
            {new Date(moduleData.ultima_analise_ia).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Análises realizadas: {moduleData.analises_ia}</span>
              <Button variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                Nova Análise IA
              </Button>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <Brain className="h-4 w-4" />
              <AlertTitle>Recomendações da IA</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>
                    • Otimizar queries de banco de dados para melhor performance
                  </li>
                  <li>
                    • Implementar cache para reduzir tempo de carregamento
                  </li>
                  <li>• Melhorar responsividade para dispositivos móveis</li>
                  <li>
                    • Adicionar testes automatizados para componentes críticos
                  </li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Module Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Ações do Módulo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Target className="h-6 w-6" />
              <span className="font-medium">Gerar Relatório</span>
              <span className="text-xs opacity-70">
                PDF executivo do módulo
              </span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Activity className="h-6 w-6" />
              <span className="font-medium">Exportar Dados</span>
              <span className="text-xs opacity-70">
                CSV de tarefas e métricas
              </span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Settings className="h-6 w-6" />
              <span className="font-medium">Configurações</span>
              <span className="text-xs opacity-70">
                Gerenciar configurações
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
