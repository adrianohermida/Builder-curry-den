import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Filter,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  Tag,
  Brain,
  ChevronDown,
  ChevronRight,
  Target,
  Zap,
  Flag,
  MoreHorizontal,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  ArrowRight,
  Palette,
  FlaskConical,
  Eye,
  EyeOff,
  Lightbulb,
  Beaker,
  Layers,
  Settings,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ActionPlanService from "@/services/actionPlanService";
import BacklogService from "@/services/backlogService";
import {
  ModuleName,
  ActionPlanTask,
  TaskStatus,
  TaskPriority,
  ModuleStatus,
  ActionPlanFilter,
} from "@/types/actionPlan";

interface EnhancedModuleManagerProps {
  selectedModule: ModuleName;
  onModuleChange: (module: ModuleName) => void;
  showHiddenModules?: boolean;
  onToggleHiddenModules?: (show: boolean) => void;
}

interface TaskFormData {
  tarefa: string;
  detalhamento: string;
  prioridade: TaskPriority;
  estimativa_horas: number;
  responsavel: string;
  tags: string[];
}

export default function EnhancedModuleManager({
  selectedModule,
  onModuleChange,
  showHiddenModules = false,
  onToggleHiddenModules,
}: EnhancedModuleManagerProps) {
  const [moduleData, setModuleData] = useState<ModuleStatus | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ActionPlanTask | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">(
    "all",
  );
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["pendente", "em_execucao"]),
  );
  const [taskForm, setTaskForm] = useState<TaskFormData>({
    tarefa: "",
    detalhamento: "",
    prioridade: "media",
    estimativa_horas: 8,
    responsavel: "",
    tags: [],
  });

  const service = useMemo(() => ActionPlanService.getInstance(), []);
  const backlogService = useMemo(() => BacklogService.getInstance(), []);

  useEffect(() => {
    const unsubscribe = service.subscribe((state) => {
      const module = state.modulos.find((m) => m.modulo === selectedModule);
      setModuleData(module || null);
    });

    // Initial load
    const state = service.getState();
    const module = state.modulos.find((m) => m.modulo === selectedModule);
    setModuleData(module || null);

    return unsubscribe;
  }, [selectedModule, service]);

  // Check if current module is hidden
  const isHiddenModule = useMemo(() => {
    return ["Design System", "Features Beta"].includes(selectedModule);
  }, [selectedModule]);

  // Get all modules (including hidden ones if enabled)
  const availableModules = useMemo(() => {
    const allModules: ModuleName[] = [
      "CRM Jurídico",
      "IA Jurídica",
      "GED",
      "Tarefas",
      "Publicações",
      "Atendimento",
      "Agenda",
      "Financeiro",
      "Configurações",
    ];

    if (showHiddenModules) {
      allModules.push("Design System", "Features Beta");
    }

    return allModules;
  }, [showHiddenModules]);

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    if (!moduleData) return [];

    let allTasks = [
      ...moduleData.tarefas_pendentes,
      ...moduleData.em_execucao,
      ...moduleData.concluidas,
    ];

    // Search filter
    if (searchQuery) {
      allTasks = allTasks.filter(
        (task) =>
          task.tarefa.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.detalhamento.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      allTasks = allTasks.filter((task) => task.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      allTasks = allTasks.filter((task) => task.prioridade === priorityFilter);
    }

    return allTasks;
  }, [moduleData, searchQuery, statusFilter, priorityFilter]);

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    if (!moduleData) return {};

    return {
      pendente: moduleData.tarefas_pendentes,
      em_execucao: moduleData.em_execucao,
      concluida: moduleData.concluidas,
    };
  }, [moduleData]);

  const handleCreateTask = () => {
    if (!taskForm.tarefa.trim()) return;

    service.addTask({
      tarefa: taskForm.tarefa,
      modulo: selectedModule,
      prioridade: taskForm.prioridade,
      status: "pendente",
      detalhamento: taskForm.detalhamento,
      estimativa_horas: taskForm.estimativa_horas,
      responsavel: taskForm.responsavel || undefined,
      tags: taskForm.tags.filter((tag) => tag.trim()),
    });

    setTaskForm({
      tarefa: "",
      detalhamento: "",
      prioridade: "media",
      estimativa_horas: 8,
      responsavel: "",
      tags: [],
    });
    setIsTaskDialogOpen(false);
  };

  const handleUpdateTask = (
    taskId: string,
    updates: Partial<ActionPlanTask>,
  ) => {
    service.updateTask(taskId, updates);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      service.deleteTask(taskId);
    }
  };

  const handleEditTask = (task: ActionPlanTask) => {
    setEditingTask(task);
    setTaskForm({
      tarefa: task.tarefa,
      detalhamento: task.detalhamento,
      prioridade: task.prioridade,
      estimativa_horas: task.estimativa_horas || 8,
      responsavel: task.responsavel || "",
      tags: task.tags || [],
    });
    setIsTaskDialogOpen(true);
  };

  const handleUpdateEditingTask = () => {
    if (!editingTask || !taskForm.tarefa.trim()) return;

    service.updateTask(editingTask.id, {
      tarefa: taskForm.tarefa,
      detalhamento: taskForm.detalhamento,
      prioridade: taskForm.prioridade,
      estimativa_horas: taskForm.estimativa_horas,
      responsavel: taskForm.responsavel || undefined,
      tags: taskForm.tags.filter((tag) => tag.trim()),
    });

    setEditingTask(null);
    setTaskForm({
      tarefa: "",
      detalhamento: "",
      prioridade: "media",
      estimativa_horas: 8,
      responsavel: "",
      tags: [],
    });
    setIsTaskDialogOpen(false);
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "pendente":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "em_execucao":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "concluida":
        return "bg-green-100 text-green-800 border-green-200";
      case "erro":
        return "bg-red-100 text-red-800 border-red-200";
      case "cancelada":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "critica":
        return "bg-red-100 text-red-800 border-red-200";
      case "alta":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "media":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "baixa":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case "critica":
        return <AlertTriangle className="h-3 w-3" />;
      case "alta":
        return <Flag className="h-3 w-3" />;
      case "media":
        return <Target className="h-3 w-3" />;
      case "baixa":
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Target className="h-3 w-3" />;
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "pendente":
        return <Clock className="h-4 w-4" />;
      case "em_execucao":
        return <PlayCircle className="h-4 w-4" />;
      case "concluida":
        return <CheckCircle className="h-4 w-4" />;
      case "erro":
        return <AlertTriangle className="h-4 w-4" />;
      case "cancelada":
        return <PauseCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getModuleIcon = (moduleName: ModuleName) => {
    const iconMap = {
      "CRM Jurídico": User,
      "IA Jurídica": Brain,
      GED: Archive,
      Tarefas: CheckCircle,
      Publicações: Calendar,
      Atendimento: MessageSquare,
      Agenda: Calendar,
      Financeiro: TrendingUp,
      Configurações: Settings,
      "Design System": Palette,
      "Features Beta": FlaskConical,
    };
    return iconMap[moduleName] || Target;
  };

  // Generate special content for hidden modules
  const getModuleSpecialContent = () => {
    if (selectedModule === "Design System") {
      return (
        <Alert className="border-purple-200 bg-purple-50">
          <Palette className="h-4 w-4" />
          <AlertTitle>🎨 Módulo Design System</AlertTitle>
          <AlertDescription>
            Este módulo analisa dinamicamente a consistência visual, componentes
            UI, padrões de design e oferece recomendações para melhoria da
            experiência do usuário.
          </AlertDescription>
        </Alert>
      );
    }

    if (selectedModule === "Features Beta") {
      return (
        <Alert className="border-purple-200 bg-purple-50">
          <FlaskConical className="h-4 w-4" />
          <AlertTitle>🧪 Módulo Features Beta</AlertTitle>
          <AlertDescription>
            Laboratório para experimentação de novos recursos, tecnologias
            emergentes e funcionalidades experimentais antes da implementação no
            sistema principal.
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  const generateHiddenModuleTasks = () => {
    if (selectedModule === "Design System") {
      return [
        {
          id: "design_1",
          tarefa: "Análise de Consistência de Cores",
          detalhamento:
            "Verificar uso consistente da paleta de cores em todos os componentes",
          prioridade: "alta" as TaskPriority,
          status: "em_execucao" as TaskStatus,
          data_criacao: new Date().toISOString(),
          progresso_percentual: 60,
          tags: ["design", "cores", "consistência"],
          sugestao_IA: "Automatizar verificação de contraste e acessibilidade",
        },
        {
          id: "design_2",
          tarefa: "Componentização de Elementos UI",
          detalhamento:
            "Criar biblioteca de componentes reutilizáveis para manter consistência",
          prioridade: "media" as TaskPriority,
          status: "pendente" as TaskStatus,
          data_criacao: new Date().toISOString(),
          progresso_percentual: 0,
          tags: ["components", "ui", "library"],
        },
      ];
    }

    if (selectedModule === "Features Beta") {
      return [
        {
          id: "beta_1",
          tarefa: "Teste de IA Generativa para Contratos",
          detalhamento:
            "Experimento com GPT para geração automática de minutas de contratos",
          prioridade: "alta" as TaskPriority,
          status: "em_execucao" as TaskStatus,
          data_criacao: new Date().toISOString(),
          progresso_percentual: 80,
          tags: ["ai", "contratos", "experimental"],
          sugestao_IA: "Validar precisão jurídica antes da implementação",
        },
        {
          id: "beta_2",
          tarefa: "Interface de Realidade Aumentada para Audiências",
          detalhamento:
            "Protótipo de AR para visualização de evidências durante audiências virtuais",
          prioridade: "baixa" as TaskPriority,
          status: "pendente" as TaskStatus,
          data_criacao: new Date().toISOString(),
          progresso_percentual: 0,
          tags: ["ar", "audiencias", "inovacao"],
        },
      ];
    }

    return [];
  };

  // Use generated tasks for hidden modules if no real data
  const displayTasks = useMemo(() => {
    if (
      isHiddenModule &&
      (!moduleData || moduleData.tarefas_pendentes.length === 0)
    ) {
      const generatedTasks = generateHiddenModuleTasks();
      return {
        pendente: generatedTasks.filter((t) => t.status === "pendente"),
        em_execucao: generatedTasks.filter((t) => t.status === "em_execucao"),
        concluida: generatedTasks.filter((t) => t.status === "concluida"),
      };
    }
    return tasksByStatus;
  }, [isHiddenModule, moduleData, tasksByStatus]);

  if (!moduleData && !isHiddenModule) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">
          Selecione um módulo para gerenciar tarefas
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {React.createElement(getModuleIcon(selectedModule), {
              className: `h-6 w-6 ${isHiddenModule ? "text-purple-600" : "text-primary"}`,
            })}
            {selectedModule}
            {isHiddenModule && (
              <Badge className="bg-purple-100 text-purple-800">Beta</Badge>
            )}
          </h2>
          <p className="text-muted-foreground">
            {moduleData
              ? `${moduleData.metricas.total_tarefas} tarefas • ${Math.round(moduleData.metricas.taxa_conclusao)}% concluído`
              : isHiddenModule
                ? "Módulo experimental em desenvolvimento"
                : "Carregando dados do módulo..."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onToggleHiddenModules && (
            <Button
              variant="outline"
              onClick={() => onToggleHiddenModules(!showHiddenModules)}
              className="flex items-center gap-2"
            >
              {showHiddenModules ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {showHiddenModules ? "Ocultar Beta" : "Mostrar Beta"}
            </Button>
          )}

          <Select value={selectedModule} onValueChange={onModuleChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableModules.map((module) => {
                const IconComponent = getModuleIcon(module);
                const isHidden = ["Design System", "Features Beta"].includes(
                  module,
                );

                return (
                  <SelectItem key={module} value={module}>
                    <div className="flex items-center gap-2">
                      <IconComponent
                        className={`h-4 w-4 ${isHidden ? "text-purple-600" : ""}`}
                      />
                      {module}
                      {isHidden && (
                        <Badge className="bg-purple-100 text-purple-800 text-xs">
                          Beta
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nova Tarefa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingTask ? "Editar Tarefa" : "Nova Tarefa"}
                </DialogTitle>
                <DialogDescription>
                  {editingTask ? "Atualize" : "Crie"} uma tarefa para o módulo{" "}
                  {selectedModule}
                  {isHiddenModule && " (Módulo Beta)"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="titulo">Título da Tarefa</Label>
                  <Input
                    id="titulo"
                    value={taskForm.tarefa}
                    onChange={(e) =>
                      setTaskForm((prev) => ({
                        ...prev,
                        tarefa: e.target.value,
                      }))
                    }
                    placeholder="Descreva a tarefa..."
                  />
                </div>

                <div>
                  <Label htmlFor="detalhamento">Detalhamento</Label>
                  <Textarea
                    id="detalhamento"
                    value={taskForm.detalhamento}
                    onChange={(e) =>
                      setTaskForm((prev) => ({
                        ...prev,
                        detalhamento: e.target.value,
                      }))
                    }
                    placeholder="Detalhes da implementação, critérios de aceitação..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prioridade">Prioridade</Label>
                    <Select
                      value={taskForm.prioridade}
                      onValueChange={(value: TaskPriority) =>
                        setTaskForm((prev) => ({ ...prev, prioridade: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="critica">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="estimativa">Estimativa (horas)</Label>
                    <Input
                      id="estimativa"
                      type="number"
                      value={taskForm.estimativa_horas}
                      onChange={(e) =>
                        setTaskForm((prev) => ({
                          ...prev,
                          estimativa_horas: parseInt(e.target.value) || 0,
                        }))
                      }
                      min="1"
                      max="160"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="responsavel">Responsável (opcional)</Label>
                  <Input
                    id="responsavel"
                    value={taskForm.responsavel}
                    onChange={(e) =>
                      setTaskForm((prev) => ({
                        ...prev,
                        responsavel: e.target.value,
                      }))
                    }
                    placeholder="Nome do responsável..."
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                  <Input
                    id="tags"
                    value={taskForm.tags.join(", ")}
                    onChange={(e) =>
                      setTaskForm((prev) => ({
                        ...prev,
                        tags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim()),
                      }))
                    }
                    placeholder={
                      isHiddenModule
                        ? "experimental, beta, inovacao..."
                        : "frontend, bug-fix, urgente..."
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsTaskDialogOpen(false);
                    setEditingTask(null);
                    setTaskForm({
                      tarefa: "",
                      detalhamento: "",
                      prioridade: "media",
                      estimativa_horas: 8,
                      responsavel: "",
                      tags: [],
                    });
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={
                    editingTask ? handleUpdateEditingTask : handleCreateTask
                  }
                >
                  {editingTask ? "Atualizar" : "Criar"} Tarefa
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Special Content for Hidden Modules */}
      {getModuleSpecialContent()}

      {/* Module Metrics */}
      <Card
        className={`card-enhanced ${isHiddenModule ? "border-purple-200 bg-purple-50/30" : ""}`}
      >
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">
                {displayTasks.pendente?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Pendentes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {displayTasks.em_execucao?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Em Execução</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {displayTasks.concluida?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Concluídas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {moduleData
                  ? Math.round(moduleData.metricas.taxa_conclusao)
                  : 0}
                %
              </div>
              <div className="text-sm text-muted-foreground">
                Taxa Conclusão
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Progress
              value={moduleData ? moduleData.metricas.taxa_conclusao : 50}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="card-enhanced">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar tarefas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value: TaskStatus | "all") =>
                setStatusFilter(value)
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_execucao">Em Execução</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="erro">Erro</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={priorityFilter}
              onValueChange={(value: TaskPriority | "all") =>
                setPriorityFilter(value)
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Prioridades</SelectItem>
                <SelectItem value="critica">Crítica</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>

            {(searchQuery ||
              statusFilter !== "all" ||
              priorityFilter !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                }}
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tasks by Status */}
      <div className="space-y-4">
        {Object.entries(displayTasks).map(([status, tasks]) => {
          const isExpanded = expandedSections.has(status);
          const StatusIcon = getStatusIcon(status as TaskStatus);

          return (
            <Card
              key={status}
              className={`card-enhanced ${isHiddenModule ? "border-purple-200" : ""}`}
            >
              <CardHeader className="pb-3">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection(status)}
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    {StatusIcon}
                    <CardTitle className="text-lg capitalize">
                      {status.replace("_", " ")}
                    </CardTitle>
                    <Badge className={getStatusColor(status as TaskStatus)}>
                      {tasks?.length || 0}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <CardContent className="pt-0">
                      {!tasks || tasks.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <div className="flex flex-col items-center gap-2">
                            {isHiddenModule ? (
                              <>
                                <Beaker className="h-8 w-8 opacity-50" />
                                <p>Módulo em fase experimental</p>
                                <p className="text-sm">
                                  Tarefas serão geradas automaticamente conforme
                                  o desenvolvimento
                                </p>
                              </>
                            ) : (
                              <>
                                <Target className="h-8 w-8 opacity-50" />
                                <p>Nenhuma tarefa encontrada</p>
                                <p className="text-sm">
                                  Crie uma nova tarefa para começar
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {tasks.map((task: any) => (
                            <motion.div
                              key={task.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="border rounded-lg p-4 hover:shadow-sm transition-all"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-medium truncate">
                                      {task.tarefa}
                                    </h4>
                                    <div className="flex items-center gap-1">
                                      {getPriorityIcon(task.prioridade)}
                                      <Badge
                                        className={getPriorityColor(
                                          task.prioridade,
                                        )}
                                      >
                                        {task.prioridade}
                                      </Badge>
                                    </div>
                                    {task.sugestao_IA && (
                                      <Badge
                                        variant="secondary"
                                        className="text-primary"
                                      >
                                        <Brain className="h-3 w-3 mr-1" />
                                        IA
                                      </Badge>
                                    )}
                                    {isHiddenModule && (
                                      <Badge className="bg-purple-100 text-purple-800">
                                        <FlaskConical className="h-3 w-3 mr-1" />
                                        Beta
                                      </Badge>
                                    )}
                                  </div>

                                  {task.detalhamento && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {task.detalhamento}
                                    </p>
                                  )}

                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    {task.estimativa_horas && (
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {task.estimativa_horas}h
                                      </div>
                                    )}
                                    {task.responsavel && (
                                      <div className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        {task.responsavel}
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(
                                        task.data_criacao,
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>

                                  {task.tags && task.tags.length > 0 && (
                                    <div className="flex items-center gap-1 mt-2">
                                      <Tag className="h-3 w-3 text-muted-foreground" />
                                      <div className="flex flex-wrap gap-1">
                                        {task.tags.map(
                                          (tag: string, index: number) => (
                                            <Badge
                                              key={index}
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {tag}
                                            </Badge>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {task.progresso_percentual > 0 && (
                                    <div className="mt-3">
                                      <div className="flex justify-between text-xs mb-1">
                                        <span>Progresso</span>
                                        <span>
                                          {task.progresso_percentual}%
                                        </span>
                                      </div>
                                      <Progress
                                        value={task.progresso_percentual}
                                        className="h-2"
                                      />
                                    </div>
                                  )}

                                  {task.sugestao_IA && (
                                    <div className="mt-3 p-2 bg-primary/5 rounded border border-primary/20">
                                      <div className="flex items-center gap-1 mb-1">
                                        <Brain className="h-3 w-3 text-primary" />
                                        <span className="text-xs font-medium">
                                          Sugestão IA
                                        </span>
                                      </div>
                                      <p className="text-xs text-muted-foreground">
                                        {task.sugestao_IA}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => handleEditTask(task)}
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Editar
                                    </DropdownMenuItem>

                                    {task.status === "pendente" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleUpdateTask(task.id, {
                                            status: "em_execucao",
                                          })
                                        }
                                      >
                                        <PlayCircle className="h-4 w-4 mr-2" />
                                        Iniciar
                                      </DropdownMenuItem>
                                    )}

                                    {task.status === "em_execucao" && (
                                      <>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleUpdateTask(task.id, {
                                              status: "concluida",
                                              progresso_percentual: 100,
                                            })
                                          }
                                        >
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Concluir
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleUpdateTask(task.id, {
                                              status: "pendente",
                                            })
                                          }
                                        >
                                          <PauseCircle className="h-4 w-4 mr-2" />
                                          Pausar
                                        </DropdownMenuItem>
                                      </>
                                    )}

                                    {task.status === "concluida" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleUpdateTask(task.id, {
                                            status: "pendente",
                                            progresso_percentual: 0,
                                          })
                                        }
                                      >
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Reabrir
                                      </DropdownMenuItem>
                                    )}

                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Excluir
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>

      {/* AI Suggestions for Hidden Modules */}
      {isHiddenModule &&
        moduleData?.melhorias_sugeridas &&
        moduleData.melhorias_sugeridas.length > 0 && (
          <Card className="card-enhanced border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Sugestões IA para {selectedModule}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {moduleData.melhorias_sugeridas
                  .slice(0, 3)
                  .map((suggestion, index) => (
                    <div
                      key={index}
                      className="border border-primary/20 rounded-lg p-4 bg-primary/5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium text-primary mb-1">
                            {suggestion.titulo}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {suggestion.descricao}
                          </p>
                          <div className="flex items-center gap-2 text-xs">
                            <Badge variant="outline">
                              {suggestion.impacto_estimado} impacto
                            </Badge>
                            <Badge variant="outline">
                              {suggestion.complexidade} complexidade
                            </Badge>
                            {suggestion.confidence_score && (
                              <Badge variant="outline">
                                {suggestion.confidence_score}% confiança
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setTaskForm({
                              tarefa: suggestion.titulo,
                              detalhamento: suggestion.descricao,
                              prioridade:
                                suggestion.impacto_estimado === "critico"
                                  ? "critica"
                                  : "alta",
                              estimativa_horas:
                                suggestion.complexidade === "complexa" ? 24 : 8,
                              responsavel: "",
                              tags: [
                                "ia-sugerida",
                                suggestion.tipo_analise,
                                isHiddenModule ? "beta" : "production",
                              ],
                            });
                            setIsTaskDialogOpen(true);
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Criar Tarefa
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
