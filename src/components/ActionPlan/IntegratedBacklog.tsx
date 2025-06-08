import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import {
  Plus,
  Search,
  Filter,
  Brain,
  ArrowRight,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Tag,
  Paperclip,
  Link,
  Star,
  ThumbsUp,
  MessageSquare,
  Eye,
  PlayCircle,
  Archive,
  GitBranch,
  Target,
  Lightbulb,
  Zap,
  TrendingUp,
  Download,
  Upload,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Calendar,
  Flag,
  Palette,
  FlaskConical,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import BacklogService from "@/services/backlogService";
import ActionPlanService from "@/services/actionPlanService";
import {
  BacklogItem,
  BacklogState,
  BacklogColumn,
  BacklogCategory,
  BacklogPriority,
  BacklogStatus,
} from "@/types/backlog";
import { ModuleName } from "@/types/actionPlan";

interface IntegratedBacklogProps {
  onItemSelect?: (item: BacklogItem) => void;
  onTaskGenerated?: (count: number) => void;
  isEmbedded?: boolean;
}

interface BacklogItemForm {
  titulo: string;
  descricao: string;
  categoria: BacklogCategory;
  modulo_impactado: ModuleName;
  prioridade: BacklogPriority;
  tags: string[];
  responsavel: string;
  anexos: string[];
  checklist: Array<{ texto: string; concluido: boolean }>;
}

function IntegratedBacklog({
  onItemSelect,
  onTaskGenerated,
  isEmbedded = false,
}: IntegratedBacklogProps) {
  const [state, setState] = useState<BacklogState | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BacklogItem | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<BacklogColumn | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<BacklogCategory | "all">(
    "all",
  );
  const [moduleFilter, setModuleFilter] = useState<ModuleName | "all">("all");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  const [itemForm, setItemForm] = useState<BacklogItemForm>({
    titulo: "",
    descricao: "",
    categoria: "UX",
    modulo_impactado: "CRM Jurídico",
    prioridade: "media",
    tags: [],
    responsavel: "",
    anexos: [],
    checklist: [],
  });

  const backlogService = useMemo(() => BacklogService.getInstance(), []);
  const actionPlanService = useMemo(() => ActionPlanService.getInstance(), []);

  useEffect(() => {
    const unsubscribe = backlogService.subscribe((newState) => {
      setState(newState);
    });

    // Initial load
    setState(backlogService.getState());

    return unsubscribe;
  }, [backlogService]);

  // Filter items based on current filters
  const filteredItems = useMemo(() => {
    if (!state) return [];

    return state.items.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesCategory =
        categoryFilter === "all" || item.categoria === categoryFilter;
      const matchesModule =
        moduleFilter === "all" || item.modulo_impactado === moduleFilter;

      return matchesSearch && matchesCategory && matchesModule;
    });
  }, [state, searchQuery, categoryFilter, moduleFilter]);

  // Group items by column
  const itemsByColumn = useMemo(() => {
    if (!state) return {};

    const grouped = state.colunas.reduce(
      (acc, column) => {
        acc[column.id] = filteredItems.filter(
          (item) => item.coluna === column.id,
        );
        return acc;
      },
      {} as Record<BacklogColumn, BacklogItem[]>,
    );

    return grouped;
  }, [state, filteredItems]);

  // Handle drag and drop
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result;

      if (!destination) return;
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return;

      const targetColumn = destination.droppableId as BacklogColumn;
      backlogService.moveItem(draggableId, targetColumn, "user");
    },
    [backlogService],
  );

  // Handle item creation
  const handleCreateItem = useCallback(() => {
    if (!itemForm.titulo.trim()) return;

    const newItem = backlogService.createBacklogItem({
      ...itemForm,
      coluna: selectedColumn || "ideias",
      status: "rascunho",
      usuario_criador: "user",
      historico_movimentacao: [],
      checklist: itemForm.checklist.map((check) => ({
        ...check,
        id: `check_${Date.now()}_${Math.random()}`,
        data_criacao: new Date().toISOString(),
      })),
    });

    setItemForm({
      titulo: "",
      descricao: "",
      categoria: "UX",
      modulo_impactado: "CRM Jurídico",
      prioridade: "media",
      tags: [],
      responsavel: "",
      anexos: [],
      checklist: [],
    });
    setIsCreateDialogOpen(false);
    setSelectedColumn(null);

    addNotification(`Item "${newItem.titulo}" criado no backlog`);
  }, [itemForm, selectedColumn, backlogService]);

  // Handle item update
  const handleUpdateItem = useCallback(() => {
    if (!editingItem || !itemForm.titulo.trim()) return;

    const success = backlogService.updateBacklogItem(editingItem.id, {
      titulo: itemForm.titulo,
      descricao: itemForm.descricao,
      categoria: itemForm.categoria,
      modulo_impactado: itemForm.modulo_impactado,
      prioridade: itemForm.prioridade,
      tags: itemForm.tags,
      responsavel: itemForm.responsavel || undefined,
      checklist: itemForm.checklist.map((check) => ({
        ...check,
        id: check.id || `check_${Date.now()}_${Math.random()}`,
        data_criacao: new Date().toISOString(),
      })),
    });

    if (success) {
      addNotification(`Item "${itemForm.titulo}" atualizado`);
    }

    setEditingItem(null);
    setIsCreateDialogOpen(false);
  }, [editingItem, itemForm, backlogService]);

  // Handle AI analysis
  const handleAnalyzeWithAI = useCallback(
    async (itemId?: string) => {
      setIsProcessing(true);
      try {
        if (itemId) {
          // Analyze specific item
          const item = state?.items.find((i) => i.id === itemId);
          if (item) {
            // Add to AI processing queue
            await backlogService.processBacklogWithAI();
            addNotification(`Item "${item.titulo}" analisado pela IA`);
          }
        } else {
          // Analyze all items in "ideias" and "em_analise" columns
          await backlogService.processBacklogWithAI();
          const processedCount =
            state?.items.filter(
              (i) =>
                (i.coluna === "ideias" || i.coluna === "em_analise") &&
                !i.analise_ia,
            ).length || 0;

          addNotification(`${processedCount} itens processados pela IA`);
          onTaskGenerated?.(processedCount);
        }
      } catch (error) {
        console.error("Error in AI analysis:", error);
        addNotification("Erro na análise IA", "error");
      } finally {
        setIsProcessing(false);
      }
    },
    [state, backlogService, onTaskGenerated],
  );

  // Convert backlog item to task
  const handleConvertToTask = useCallback(
    async (item: BacklogItem) => {
      try {
        const task = {
          tarefa: item.titulo,
          modulo: item.modulo_impactado as ModuleName,
          prioridade: item.prioridade as any,
          status: "pendente" as const,
          detalhamento: item.descricao,
          sugestao_IA: `Originado do backlog: ${item.id}`,
          estimativa_horas: item.tempo_estimado || 8,
          tags: [...(item.tags || []), "backlog-converted"],
          responsavel: item.responsavel,
        };

        const createdTask = actionPlanService.addTask(task);

        // Update backlog item
        backlogService.updateBacklogItem(item.id, {
          coluna: "em_execucao",
          tarefas_relacionadas: [
            ...(item.tarefas_relacionadas || []),
            createdTask.id,
          ],
        });

        addNotification(`Tarefa criada no módulo ${item.modulo_impactado}`);
        onTaskGenerated?.(1);
      } catch (error) {
        console.error("Error converting to task:", error);
        addNotification("Erro ao converter em tarefa", "error");
      }
    },
    [actionPlanService, backlogService, onTaskGenerated],
  );

  // Handle item voting
  const handleVoteItem = useCallback(
    (item: BacklogItem, vote: "up" | "down") => {
      const currentVotes = {
        up: item.votos_aprovacao || 0,
        down: item.votos_rejeicao || 0,
      };

      const updates =
        vote === "up"
          ? { votos_aprovacao: currentVotes.up + 1 }
          : { votos_rejeicao: currentVotes.down + 1 };

      backlogService.updateBacklogItem(item.id, updates);
    },
    [backlogService],
  );

  // Start editing item
  const startEditingItem = useCallback((item: BacklogItem) => {
    setEditingItem(item);
    setItemForm({
      titulo: item.titulo,
      descricao: item.descricao,
      categoria: item.categoria,
      modulo_impactado: item.modulo_impactado as ModuleName,
      prioridade: item.prioridade,
      tags: item.tags,
      responsavel: item.responsavel || "",
      anexos: item.anexos?.map((a) => a.url) || [],
      checklist:
        item.checklist?.map((check) => ({
          texto: check.texto,
          concluido: check.concluido,
          id: check.id,
        })) || [],
    });
    setIsCreateDialogOpen(true);
  }, []);

  // Add notification
  const addNotification = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      setNotifications((prev) => [message, ...prev.slice(0, 4)]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n !== message));
      }, 5000);
    },
    [],
  );

  // Add checklist item
  const addChecklistItem = useCallback(() => {
    setItemForm((prev) => ({
      ...prev,
      checklist: [
        ...prev.checklist,
        { texto: "", concluido: false, id: `temp_${Date.now()}` },
      ],
    }));
  }, []);

  // Update checklist item
  const updateChecklistItem = useCallback(
    (
      index: number,
      updates: Partial<{ texto: string; concluido: boolean }>,
    ) => {
      setItemForm((prev) => ({
        ...prev,
        checklist: prev.checklist.map((item, idx) =>
          idx === index ? { ...item, ...updates } : item,
        ),
      }));
    },
    [],
  );

  // Remove checklist item
  const removeChecklistItem = useCallback((index: number) => {
    setItemForm((prev) => ({
      ...prev,
      checklist: prev.checklist.filter((_, idx) => idx !== index),
    }));
  }, []);

  // Get category color
  const getCategoryColor = useCallback((category: BacklogCategory) => {
    const colors = {
      AI: "bg-blue-100 text-blue-800 border-blue-200",
      LegalTech: "bg-purple-100 text-purple-800 border-purple-200",
      UX: "bg-green-100 text-green-800 border-green-200",
      Backend: "bg-red-100 text-red-800 border-red-200",
      Performance: "bg-orange-100 text-orange-800 border-orange-200",
      Visual: "bg-pink-100 text-pink-800 border-pink-200",
      Segurança: "bg-gray-800 text-white border-gray-700",
      Mobile: "bg-sky-100 text-sky-800 border-sky-200",
      Analytics: "bg-lime-100 text-lime-800 border-lime-200",
      Integração: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Compliance: "bg-indigo-100 text-indigo-800 border-indigo-200",
      Workflow: "bg-teal-100 text-teal-800 border-teal-200",
    };
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
  }, []);

  // Get priority color
  const getPriorityColor = useCallback((priority: BacklogPriority) => {
    const colors = {
      baixa: "bg-green-100 text-green-800 border-green-200",
      media: "bg-yellow-100 text-yellow-800 border-yellow-200",
      alta: "bg-orange-100 text-orange-800 border-orange-200",
      critica: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[priority];
  }, []);

  // Get module icon
  const getModuleIcon = useCallback((module: ModuleName) => {
    const icons = {
      "CRM Jurídico": User,
      "IA Jurídica": Brain,
      GED: Archive,
      Tarefas: CheckCircle,
      Publicações: Calendar,
      Atendimento: MessageSquare,
      Agenda: Calendar,
      Financeiro: TrendingUp,
      Configurações: Target,
      "Design System": Palette,
      "Features Beta": FlaskConical,
    };
    return icons[module] || Target;
  }, []);

  if (!state) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Carregando backlog inteligente...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-2"
          >
            <Alert className="border-primary bg-primary/5">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>{notification}</AlertDescription>
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Header */}
      {!isEmbedded && (
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              🧠 Backlog Inteligente
            </h2>
            <p className="text-muted-foreground">
              {state.estatisticas.total_items} itens •{" "}
              {Math.round(state.estatisticas.taxa_execucao)}% executados
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => handleAnalyzeWithAI()}
              disabled={isProcessing}
              className="flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              {isProcessing ? "Analisando..." : "Analisar Tudo com IA"}
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card className="card-enhanced">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar no backlog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>

            <Select
              value={categoryFilter}
              onValueChange={(value: BacklogCategory | "all") =>
                setCategoryFilter(value)
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="AI">AI</SelectItem>
                <SelectItem value="LegalTech">LegalTech</SelectItem>
                <SelectItem value="UX">UX</SelectItem>
                <SelectItem value="Performance">Performance</SelectItem>
                <SelectItem value="Backend">Backend</SelectItem>
                <SelectItem value="Mobile">Mobile</SelectItem>
                <SelectItem value="Visual">Visual</SelectItem>
                <SelectItem value="Segurança">Segurança</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={moduleFilter}
              onValueChange={(value: ModuleName | "all") =>
                setModuleFilter(value)
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Módulos</SelectItem>
                <SelectItem value="CRM Jurídico">CRM Jurídico</SelectItem>
                <SelectItem value="IA Jurídica">IA Jurídica</SelectItem>
                <SelectItem value="GED">GED</SelectItem>
                <SelectItem value="Tarefas">Tarefas</SelectItem>
                <SelectItem value="Publicações">Publicações</SelectItem>
                <SelectItem value="Atendimento">Atendimento</SelectItem>
                <SelectItem value="Agenda">Agenda</SelectItem>
                <SelectItem value="Financeiro">Financeiro</SelectItem>
                <SelectItem value="Configurações">Configurações</SelectItem>
                <SelectItem value="Design System">🎨 Design System</SelectItem>
                <SelectItem value="Features Beta">🧪 Features Beta</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
                setModuleFilter("all");
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-x-auto">
          {state.colunas.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-3 ${snapshot.isDraggingOver ? "bg-muted/50" : ""} rounded-lg p-2 transition-colors min-h-96`}
                >
                  {/* Column Header */}
                  <Card className="card-enhanced">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: column.cor }}
                          />
                          {column.titulo}
                        </CardTitle>
                        <div className="flex items-center gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {itemsByColumn[column.id]?.length || 0}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedColumn(column.id);
                              setIsCreateDialogOpen(true);
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Column Items */}
                  <div className="space-y-3">
                    {itemsByColumn[column.id]?.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            layout
                            className={`${snapshot.isDragging ? "rotate-1 shadow-lg" : ""}`}
                          >
                            <Card
                              className={`card-enhanced cursor-pointer hover:shadow-md transition-all ${
                                snapshot.isDragging ? "shadow-xl" : ""
                              }`}
                            >
                              <CardContent className="p-4">
                                {/* Item Header */}
                                <div className="flex items-start justify-between gap-2 mb-3">
                                  <h4
                                    className="font-medium text-sm line-clamp-2 flex-1"
                                    onClick={() => onItemSelect?.(item)}
                                  >
                                    {item.titulo}
                                  </h4>

                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="h-3 w-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() => onItemSelect?.(item)}
                                      >
                                        <Eye className="h-3 w-3 mr-2" />
                                        Ver Detalhes
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => startEditingItem(item)}
                                      >
                                        <Edit className="h-3 w-3 mr-2" />
                                        Editar
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleAnalyzeWithAI(item.id)
                                        }
                                      >
                                        <Brain className="h-3 w-3 mr-2" />
                                        Analisar com IA
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleConvertToTask(item)
                                        }
                                      >
                                        <ArrowRight className="h-3 w-3 mr-2" />
                                        Converter em Tarefa
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() =>
                                          backlogService.deleteBacklogItem(
                                            item.id,
                                          )
                                        }
                                        className="text-destructive"
                                      >
                                        <Trash2 className="h-3 w-3 mr-2" />
                                        Excluir
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                {/* Item Badges */}
                                <div className="flex flex-wrap gap-1 mb-3">
                                  <Badge
                                    className={getCategoryColor(item.categoria)}
                                  >
                                    {item.categoria}
                                  </Badge>
                                  <Badge
                                    className={getPriorityColor(
                                      item.prioridade,
                                    )}
                                  >
                                    {item.prioridade}
                                  </Badge>
                                  {item.analise_ia && (
                                    <Badge
                                      variant="secondary"
                                      className="text-primary"
                                    >
                                      <Brain className="h-2 w-2 mr-1" />
                                      IA
                                    </Badge>
                                  )}
                                </div>

                                {/* Module */}
                                <div className="flex items-center gap-1 mb-2">
                                  {React.createElement(
                                    getModuleIcon(
                                      item.modulo_impactado as ModuleName,
                                    ),
                                    {
                                      className: "h-3 w-3",
                                    },
                                  )}
                                  <span className="text-xs text-muted-foreground">
                                    {item.modulo_impactado}
                                  </span>
                                </div>

                                {/* Description */}
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                  {item.descricao}
                                </p>

                                {/* Progress */}
                                {item.progresso_percentual &&
                                  item.progresso_percentual > 0 && (
                                    <div className="mb-3">
                                      <div className="flex justify-between text-xs mb-1">
                                        <span>Progresso</span>
                                        <span>
                                          {item.progresso_percentual}%
                                        </span>
                                      </div>
                                      <Progress
                                        value={item.progresso_percentual}
                                        className="h-1"
                                      />
                                    </div>
                                  )}

                                {/* Checklist */}
                                {item.checklist &&
                                  item.checklist.length > 0 && (
                                    <div className="mb-3">
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <CheckCircle className="h-3 w-3" />
                                        {
                                          item.checklist.filter(
                                            (c) => c.concluido,
                                          ).length
                                        }
                                        /{item.checklist.length}
                                      </div>
                                    </div>
                                  )}

                                {/* Footer */}
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    {item.responsavel && (
                                      <div className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        {item.responsavel}
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      {item.usuario_criador}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    {item.anexos && item.anexos.length > 0 && (
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <Paperclip className="h-3 w-3 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          {item.anexos.length} anexo(s)
                                        </TooltipContent>
                                      </Tooltip>
                                    )}

                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleVoteItem(item, "up")
                                        }
                                        className="h-6 w-6 p-0"
                                      >
                                        <ThumbsUp className="h-3 w-3" />
                                      </Button>
                                      <span className="text-xs">
                                        {(item.votos_aprovacao || 0) -
                                          (item.votos_rejeicao || 0)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Tags */}
                                {item.tags.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {item.tags.slice(0, 3).map((tag, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                    {item.tags.length > 3 && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        +{item.tags.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                )}

                                {/* AI Analysis Preview */}
                                {item.analise_ia && (
                                  <div className="mt-3 p-2 bg-primary/5 rounded border border-primary/20">
                                    <div className="flex items-center gap-1 mb-1">
                                      <Brain className="h-3 w-3 text-primary" />
                                      <span className="text-xs font-medium">
                                        IA ({item.analise_ia.confidence_score}%)
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {
                                        item.analise_ia.classificacao
                                          .motivo_classificacao
                                      }
                                    </p>
                                    {item.analise_ia.recomendacoes.length >
                                      0 && (
                                      <div className="mt-1">
                                        <p className="text-xs text-primary">
                                          💡 {item.analise_ia.recomendacoes[0]}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Create/Edit Item Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Editar Item do Backlog" : "Novo Item do Backlog"}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? "Atualize as informações do item"
                : "Crie um novo item para o backlog"}
              {selectedColumn &&
                ` na coluna "${state.colunas.find((c) => c.id === selectedColumn)?.titulo}"`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={itemForm.titulo}
                  onChange={(e) =>
                    setItemForm((prev) => ({ ...prev, titulo: e.target.value }))
                  }
                  placeholder="Título do item..."
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="descricao">Descrição Expandida</Label>
                <Textarea
                  id="descricao"
                  value={itemForm.descricao}
                  onChange={(e) =>
                    setItemForm((prev) => ({
                      ...prev,
                      descricao: e.target.value,
                    }))
                  }
                  placeholder="Descrição detalhada do item..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="categoria">Categoria</Label>
                <Select
                  value={itemForm.categoria}
                  onValueChange={(value: BacklogCategory) =>
                    setItemForm((prev) => ({ ...prev, categoria: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UX">UX</SelectItem>
                    <SelectItem value="Backend">Backend</SelectItem>
                    <SelectItem value="LegalTech">LegalTech</SelectItem>
                    <SelectItem value="Performance">Performance</SelectItem>
                    <SelectItem value="Visual">Visual</SelectItem>
                    <SelectItem value="Integração">Integração</SelectItem>
                    <SelectItem value="Segurança">Segurança</SelectItem>
                    <SelectItem value="AI">AI</SelectItem>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                    <SelectItem value="Analytics">Analytics</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="Workflow">Workflow</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="modulo">Módulo Afetado</Label>
                <Select
                  value={itemForm.modulo_impactado}
                  onValueChange={(value: ModuleName) =>
                    setItemForm((prev) => ({
                      ...prev,
                      modulo_impactado: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CRM Jurídico">CRM Jurídico</SelectItem>
                    <SelectItem value="IA Jurídica">IA Jurídica</SelectItem>
                    <SelectItem value="GED">GED</SelectItem>
                    <SelectItem value="Tarefas">Tarefas</SelectItem>
                    <SelectItem value="Publicações">Publicações</SelectItem>
                    <SelectItem value="Atendimento">Atendimento</SelectItem>
                    <SelectItem value="Agenda">Agenda</SelectItem>
                    <SelectItem value="Financeiro">Financeiro</SelectItem>
                    <SelectItem value="Configurações">Configurações</SelectItem>
                    <SelectItem value="Design System">
                      🎨 Design System
                    </SelectItem>
                    <SelectItem value="Features Beta">
                      🧪 Features Beta
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select
                  value={itemForm.prioridade}
                  onValueChange={(value: BacklogPriority) =>
                    setItemForm((prev) => ({ ...prev, prioridade: value }))
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
                <Label htmlFor="responsavel">Respons��vel</Label>
                <Input
                  id="responsavel"
                  value={itemForm.responsavel}
                  onChange={(e) =>
                    setItemForm((prev) => ({
                      ...prev,
                      responsavel: e.target.value,
                    }))
                  }
                  placeholder="Nome do responsável..."
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  value={itemForm.tags.join(", ")}
                  onChange={(e) =>
                    setItemForm((prev) => ({
                      ...prev,
                      tags: e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean),
                    }))
                  }
                  placeholder="visual, integração, performance..."
                />
              </div>
            </div>

            {/* Checklist */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Checklist</Label>
                <Button variant="outline" size="sm" onClick={addChecklistItem}>
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar Item
                </Button>
              </div>

              <div className="space-y-2">
                {itemForm.checklist.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox
                      checked={item.concluido}
                      onCheckedChange={(checked) =>
                        updateChecklistItem(index, {
                          concluido: checked as boolean,
                        })
                      }
                    />
                    <Input
                      value={item.texto}
                      onChange={(e) =>
                        updateChecklistItem(index, { texto: e.target.value })
                      }
                      placeholder="Item do checklist..."
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeChecklistItem(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setEditingItem(null);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={editingItem ? handleUpdateItem : handleCreateItem}>
              {editingItem ? "Atualizar" : "Criar"} Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Named export for destructuring imports
export { IntegratedBacklog };

// Default export for backward compatibility
export default IntegratedBacklog;
