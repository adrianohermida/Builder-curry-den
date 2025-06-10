/**
 * ✅ MÓDULO TAREFAS POR CLIENTE - CRM Unicorn
 *
 * Workflow personalizado e gestão inteligente de tarefas
 * - Recomendações automáticas baseadas em prazos processuais
 * - Workflow personalizado por cliente
 * - Automação de tarefas recorrentes
 * - Timeline integrada com processos e contratos
 */

import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  Users,
  Target,
  Activity,
  Zap,
  Brain,
  Bell,
  Flag,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Edit,
  Trash2,
  FileText,
  Scale,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Hooks (using temporary stubs)
const useTarefasClienteUnicorn = () => ({
  tarefas: [],
  loading: false,
  createTask: async () => {},
  updateTask: async () => {},
  deleteTask: async () => {},
  completeTask: async () => {},
});

const useWorkflowAutomation = () => ({
  getWorkflowRecommendations: async () => {},
  automateRecurringTasks: async () => {},
  executeWorkflow: async () => {},
});

const useAITaskRecommendations = () => ({
  getDeadlineRecommendations: async () => {},
  getClientTaskRecommendations: async () => {},
  analyzeTaskEfficiency: async () => {},
});

// Tipos
interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  clienteId: string;
  clienteNome: string;
  processoId?: string;
  contratoId?: string;
  tipo: "manual" | "automatica" | "recorrente" | "prazo_processual";
  prioridade: "baixa" | "media" | "alta" | "critica";
  status:
    | "pendente"
    | "em_andamento"
    | "aguardando"
    | "concluida"
    | "cancelada";
  responsavel: string;
  dataVencimento: Date;
  dataCriacao: Date;
  dataConclusao?: Date;
  tempoEstimado: number; // em horas
  tempoGasto?: number; // em horas
  progresso: number;
  tags: string[];
  anexos: string[];
  comentarios: number;
  dependencias: string[]; // IDs de outras tarefas
  // Workflow
  etapaWorkflow?: string;
  proximaEtapa?: string;
  workflowId?: string;
  // IA
  recomendadaPorIA: boolean;
  confiancaIA?: number;
  fonteRecomendacao?: string;
  alertasVencimento: number;
}

interface Cliente {
  id: string;
  nome: string;
  totalTarefas: number;
  tarefasPendentes: number;
  tarefasVencidas: number;
  progressoGeral: number;
}

interface TarefasClienteModuleProps {
  searchQuery?: string;
  onNotification?: (message: string) => void;
  className?: string;
}

// Dados mock
const MOCK_CLIENTES: Cliente[] = [
  {
    id: "cli-001",
    nome: "Maria Silva Advocacia",
    totalTarefas: 12,
    tarefasPendentes: 4,
    tarefasVencidas: 1,
    progressoGeral: 75,
  },
  {
    id: "cli-002",
    nome: "Carlos Mendes",
    totalTarefas: 8,
    tarefasPendentes: 3,
    tarefasVencidas: 0,
    progressoGeral: 85,
  },
  {
    id: "cli-003",
    nome: "Tech Solutions Ltda",
    totalTarefas: 15,
    tarefasPendentes: 8,
    tarefasVencidas: 3,
    progressoGeral: 45,
  },
];

const MOCK_TAREFAS: Tarefa[] = [
  {
    id: "task-001",
    titulo: "Análise de Contrato de Parceria",
    descricao: "Revisar cláusulas contratuais e identificar riscos potenciais",
    clienteId: "cli-001",
    clienteNome: "Maria Silva Advocacia",
    contratoId: "cont-001",
    tipo: "manual",
    prioridade: "alta",
    status: "em_andamento",
    responsavel: "Dr. João Santos",
    dataVencimento: new Date("2025-01-28"),
    dataCriacao: new Date("2025-01-20"),
    tempoEstimado: 4,
    tempoGasto: 2.5,
    progresso: 60,
    tags: ["Contrato", "Análise", "Urgente"],
    anexos: ["contrato-parceria.pdf"],
    comentarios: 3,
    dependencias: [],
    etapaWorkflow: "Análise",
    proximaEtapa: "Aprovação",
    workflowId: "wf-contrato-001",
    recomendadaPorIA: false,
    alertasVencimento: 1,
  },
  {
    id: "task-002",
    titulo: "Protocolar Petição Inicial",
    descricao:
      "Protocolar petição inicial no processo trabalhista - prazo até 30/01",
    clienteId: "cli-002",
    clienteNome: "Carlos Mendes",
    processoId: "proc-002",
    tipo: "prazo_processual",
    prioridade: "critica",
    status: "pendente",
    responsavel: "Dra. Ana Costa",
    dataVencimento: new Date("2025-01-30"),
    dataCriacao: new Date("2025-01-22"),
    tempoEstimado: 2,
    progresso: 0,
    tags: ["Processo", "Prazo", "Trabalhista"],
    anexos: [],
    comentarios: 1,
    dependencias: [],
    recomendadaPorIA: true,
    confiancaIA: 95,
    fonteRecomendacao: "Prazo processual detectado",
    alertasVencimento: 2,
  },
  {
    id: "task-003",
    titulo: "Renovação de Contrato",
    descricao: "Preparar documentação para renovação automática do contrato",
    clienteId: "cli-001",
    clienteNome: "Maria Silva Advocacia",
    contratoId: "cont-001",
    tipo: "automatica",
    prioridade: "media",
    status: "aguardando",
    responsavel: "Dr. João Santos",
    dataVencimento: new Date("2025-02-15"),
    dataCriacao: new Date("2025-01-15"),
    tempoEstimado: 1,
    progresso: 100,
    tags: ["Contrato", "Renovação", "Automática"],
    anexos: [],
    comentarios: 0,
    dependencias: ["task-001"],
    etapaWorkflow: "Aguardando Dependência",
    proximaEtapa: "Execução",
    workflowId: "wf-renovacao-001",
    recomendadaPorIA: true,
    confiancaIA: 88,
    fonteRecomendacao: "Vencimento de contrato detectado",
    alertasVencimento: 0,
  },
  {
    id: "task-004",
    titulo: "Follow-up Cliente Inativo",
    descricao: "Entrar em contato com cliente inativo há mais de 60 dias",
    clienteId: "cli-003",
    clienteNome: "Tech Solutions Ltda",
    tipo: "automatica",
    prioridade: "media",
    status: "pendente",
    responsavel: "Dr. Pedro Oliveira",
    dataVencimento: new Date("2025-01-25"),
    dataCriacao: new Date("2025-01-23"),
    tempoEstimado: 0.5,
    progresso: 0,
    tags: ["Cliente", "Follow-up", "Reativação"],
    anexos: [],
    comentarios: 0,
    dependencias: [],
    recomendadaPorIA: true,
    confiancaIA: 92,
    fonteRecomendacao: "Cliente inativo detectado pela IA",
    alertasVencimento: 1,
  },
];

export function TarefasClienteModule({
  searchQuery = "",
  onNotification,
  className,
}: TarefasClienteModuleProps) {
  // Estados
  const [selectedClient, setSelectedClient] = useState<string>("todos");
  const [selectedStatus, setSelectedStatus] = useState<string>("todas");
  const [selectedPriority, setSelectedPriority] = useState<string>("todas");
  const [viewMode, setViewMode] = useState<"lista" | "kanban" | "timeline">(
    "lista",
  );
  const [showAIRecommendations, setShowAIRecommendations] = useState(true);

  // Hooks
  const { tarefas, loading, createTask, updateTask, deleteTask, completeTask } =
    useTarefasClienteUnicorn();

  const {
    getWorkflowRecommendations,
    automateRecurringTasks,
    executeWorkflow,
  } = useWorkflowAutomation();

  const {
    getDeadlineRecommendations,
    getClientTaskRecommendations,
    analyzeTaskEfficiency,
  } = useAITaskRecommendations();

  // Dados filtrados
  const filteredTarefas = useMemo(() => {
    let filtered = MOCK_TAREFAS;

    if (searchQuery) {
      filtered = filtered.filter(
        (tarefa) =>
          tarefa.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tarefa.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tarefa.clienteNome.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedClient !== "todos") {
      filtered = filtered.filter(
        (tarefa) => tarefa.clienteId === selectedClient,
      );
    }

    if (selectedStatus !== "todas") {
      filtered = filtered.filter((tarefa) => tarefa.status === selectedStatus);
    }

    if (selectedPriority !== "todas") {
      filtered = filtered.filter(
        (tarefa) => tarefa.prioridade === selectedPriority,
      );
    }

    return filtered.sort((a, b) => {
      // Priorizar por vencimento e prioridade
      const priorityOrder = { critica: 4, alta: 3, media: 2, baixa: 1 };
      const aPriority = priorityOrder[a.prioridade];
      const bPriority = priorityOrder[b.prioridade];

      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }

      return a.dataVencimento.getTime() - b.dataVencimento.getTime();
    });
  }, [searchQuery, selectedClient, selectedStatus, selectedPriority]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = MOCK_TAREFAS.length;
    const pendentes = MOCK_TAREFAS.filter(
      (t) => t.status === "pendente",
    ).length;
    const emAndamento = MOCK_TAREFAS.filter(
      (t) => t.status === "em_andamento",
    ).length;
    const concluidas = MOCK_TAREFAS.filter(
      (t) => t.status === "concluida",
    ).length;
    const vencidas = MOCK_TAREFAS.filter(
      (t) => t.dataVencimento < new Date() && t.status !== "concluida",
    ).length;
    const recomendadasIA = MOCK_TAREFAS.filter(
      (t) => t.recomendadaPorIA,
    ).length;

    return {
      total,
      pendentes,
      emAndamento,
      concluidas,
      vencidas,
      recomendadasIA,
    };
  }, []);

  // Handlers
  const handleCompleteTask = useCallback(
    async (taskId: string) => {
      try {
        await completeTask(taskId);
        onNotification?.("Tarefa concluída com sucesso");
      } catch (error) {
        toast.error("Erro ao concluir tarefa");
      }
    },
    [completeTask, onNotification],
  );

  const handleCreateAITask = useCallback(async () => {
    try {
      const recommendations = await getClientTaskRecommendations();
      onNotification?.("Novas tarefas recomendadas pela IA");
    } catch (error) {
      toast.error("Erro ao gerar recomendações");
    }
  }, [getClientTaskRecommendations, onNotification]);

  // Renderizador de card de tarefa
  const renderTaskCard = (tarefa: Tarefa) => (
    <motion.div
      key={tarefa.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "relative overflow-hidden cursor-pointer transition-all",
          "hover:shadow-md border-l-4",
          tarefa.prioridade === "critica" && "border-l-red-500 bg-red-50",
          tarefa.prioridade === "alta" && "border-l-orange-500 bg-orange-50",
          tarefa.prioridade === "media" && "border-l-yellow-500 bg-yellow-50",
          tarefa.prioridade === "baixa" && "border-l-green-500 bg-green-50",
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge
                  variant={
                    tarefa.status === "concluida"
                      ? "default"
                      : tarefa.status === "em_andamento"
                        ? "secondary"
                        : tarefa.status === "pendente"
                          ? "outline"
                          : "destructive"
                  }
                  className="text-xs"
                >
                  {tarefa.status.replace("_", " ").toUpperCase()}
                </Badge>

                <Badge
                  variant={
                    tarefa.prioridade === "critica" ? "destructive" : "outline"
                  }
                  className="text-xs"
                >
                  {tarefa.prioridade.toUpperCase()}
                </Badge>

                {tarefa.recomendadaPorIA && (
                  <Badge variant="secondary" className="text-xs">
                    🤖 IA {tarefa.confiancaIA}%
                  </Badge>
                )}

                {tarefa.tipo === "prazo_processual" && (
                  <Badge variant="destructive" className="text-xs">
                    PRAZO
                  </Badge>
                )}
              </div>

              <h3 className="font-semibold text-sm mb-1">{tarefa.titulo}</h3>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {tarefa.descricao}
              </p>
              <p className="text-xs text-muted-foreground">
                {tarefa.clienteNome}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleCompleteTask(tarefa.id)}
                  disabled={tarefa.status === "concluida"}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Concluir
                </DropdownMenuItem>
                {tarefa.processoId && (
                  <DropdownMenuItem>
                    <Scale className="h-4 w-4 mr-2" />
                    Ver Processo
                  </DropdownMenuItem>
                )}
                {tarefa.contratoId && (
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" />
                    Ver Contrato
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Progresso */}
          {tarefa.progresso > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Progresso</span>
                <span className="text-xs font-medium">{tarefa.progresso}%</span>
              </div>
              <Progress value={tarefa.progresso} className="h-2" />
            </div>
          )}

          {/* Tempo */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground">Tempo Estimado</p>
              <p className="text-sm font-medium">{tarefa.tempoEstimado}h</p>
            </div>
            {tarefa.tempoGasto && (
              <div>
                <p className="text-xs text-muted-foreground">Tempo Gasto</p>
                <p className="text-sm font-medium">{tarefa.tempoGasto}h</p>
              </div>
            )}
          </div>

          {/* Data de vencimento */}
          <div className="mb-4">
            <div className="flex items-center text-xs mb-1">
              <Calendar className="h-3 w-3 mr-1" />
              <span className="text-muted-foreground">Vence em:</span>
            </div>
            <p
              className={cn(
                "text-xs font-medium",
                tarefa.dataVencimento < new Date() && "text-red-600",
                tarefa.dataVencimento.getTime() - Date.now() <
                  24 * 60 * 60 * 1000 && "text-orange-600",
              )}
            >
              {tarefa.dataVencimento.toLocaleDateString("pt-BR")}
            </p>
          </div>

          {/* Responsável */}
          <div className="flex items-center mb-4">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarFallback className="text-xs">
                {tarefa.responsavel.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {tarefa.responsavel}
            </span>
          </div>

          {/* Workflow */}
          {tarefa.etapaWorkflow && (
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-1">
                Etapa do Workflow:
              </p>
              <Badge variant="outline" className="text-xs">
                {tarefa.etapaWorkflow}
              </Badge>
              {tarefa.proximaEtapa && (
                <span className="text-xs text-muted-foreground ml-2">
                  → {tarefa.proximaEtapa}
                </span>
              )}
            </div>
          )}

          {/* Alertas */}
          {tarefa.alertasVencimento > 0 && (
            <div className="flex items-center text-xs text-red-600 mb-3">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {tarefa.alertasVencimento} alerta(s) de vencimento
            </div>
          )}

          {/* IA Recommendation Info */}
          {tarefa.recomendadaPorIA && tarefa.fonteRecomendacao && (
            <div className="flex items-center text-xs text-blue-600 mb-3">
              <Brain className="h-3 w-3 mr-1" />
              {tarefa.fonteRecomendacao}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {tarefa.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tarefa.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{tarefa.tags.length - 2}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header do módulo */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Tarefas por Cliente
          </h2>
          <p className="text-muted-foreground">
            Workflow personalizado e automação inteligente
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleCreateAITask}>
            <Brain className="h-4 w-4 mr-2" />
            Gerar IA
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAIRecommendations(!showAIRecommendations)}
          >
            <Zap className="h-4 w-4 mr-2" />
            IA {showAIRecommendations ? "ON" : "OFF"}
          </Button>

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Total",
            value: stats.total,
            icon: CheckSquare,
            color: "text-blue-600",
          },
          {
            title: "Pendentes",
            value: stats.pendentes,
            icon: Clock,
            color: "text-orange-600",
          },
          {
            title: "Em Andamento",
            value: stats.emAndamento,
            icon: Play,
            color: "text-yellow-600",
          },
          {
            title: "Concluídas",
            value: stats.concluidas,
            icon: CheckCircle,
            color: "text-green-600",
          },
          {
            title: "Vencidas",
            value: stats.vencidas,
            icon: AlertTriangle,
            color: "text-red-600",
          },
          {
            title: "IA Recs",
            value: stats.recomendadasIA,
            icon: Brain,
            color: "text-purple-600",
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className={cn(
                stat.title === "Vencidas" &&
                  stats.vencidas > 0 &&
                  "ring-2 ring-red-500",
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={cn("h-8 w-8", stat.color)} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filtros */}
      <div className="flex items-center space-x-4">
        <Select value={selectedClient} onValueChange={setSelectedClient}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Clientes</SelectItem>
            {MOCK_CLIENTES.map((cliente) => (
              <SelectItem key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todos os Status</SelectItem>
            <SelectItem value="pendente">Pendentes</SelectItem>
            <SelectItem value="em_andamento">Em Andamento</SelectItem>
            <SelectItem value="aguardando">Aguardando</SelectItem>
            <SelectItem value="concluida">Concluídas</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as Prioridades</SelectItem>
            <SelectItem value="critica">Crítica</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Mais Filtros
        </Button>
      </div>

      {/* Lista de tarefas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTarefas.map(renderTaskCard)}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {filteredTarefas.length === 0 && !loading && (
        <div className="text-center py-12">
          <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Nenhuma tarefa encontrada
          </h3>
          <p className="text-muted-foreground mb-4">
            Comece criando tarefas ou use recomendações da IA
          </p>
          <div className="flex items-center justify-center space-x-3">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
            <Button variant="outline" onClick={handleCreateAITask}>
              <Brain className="h-4 w-4 mr-2" />
              Recomendações IA
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
