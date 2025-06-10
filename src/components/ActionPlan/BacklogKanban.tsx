import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { SafeDragDropContext } from "../Common/SafeDragDropContext";
import {
  Plus,
  Filter,
  Search,
  Brain,
  User,
  Calendar,
  Tag,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Paperclip,
  MessageCircle,
  Star,
  MoreHorizontal,
  Edit,
  Trash2,
  Link,
  TrendingUp,
  Target,
  Zap,
  Eye,
  GitBranch,
  ChevronDown,
  ChevronUp,
  BarChart3,
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

import BacklogService from "@/services/backlogService";
import {
  BacklogItem,
  BacklogState,
  BacklogColumn,
  BacklogCategory,
  BacklogPriority,
  BacklogStatus,
  BacklogFilter,
  ChecklistItem,
} from "@/types/backlog";

interface BacklogKanbanProps {
  onItemSelect?: (item: BacklogItem) => void;
  onItemCreate?: (item: BacklogItem) => void;
  onItemUpdate?: (item: BacklogItem) => void;
}

interface ItemFormData {
  titulo: string;
  descricao: string;
  categoria: BacklogCategory;
  modulo_impactado: string;
  prioridade: BacklogPriority;
  status: BacklogStatus;
  tags: string[];
  tempo_estimado: number;
  checklist: Omit<ChecklistItem, "id" | "data_criacao">[];
}

function BacklogKanban({
  onItemSelect,
  onItemCreate,
  onItemUpdate,
}: BacklogKanbanProps) {
  const [state, setState] = useState<BacklogState | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BacklogItem | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<BacklogColumn | null>(
    null,
  );
  const [filter, setFilter] = useState<BacklogFilter>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [itemForm, setItemForm] = useState<ItemFormData>({
    titulo: "",
    descricao: "",
    categoria: "UX",
    modulo_impactado: "CRM Jurídico",
    prioridade: "media",
    status: "rascunho",
    tags: [],
    tempo_estimado: 8,
    checklist: [],
  });

  const service = useMemo(() => BacklogService.getInstance(), []);

  useEffect(() => {
    const unsubscribe = service.subscribe((newState) => {
      setState(newState);
    });

    // Initial load
    setState(service.getState());

    return unsubscribe;
  }, [service]);

  // Filter items based on current filters
  const filteredItems = useMemo(() => {
    if (!state) return [];

    const activeFilter = {
      ...filter,
      texto_busca: searchQuery || undefined,
    };

    return service.filterItems(activeFilter);
  }, [state, filter, searchQuery, service]);

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
      service.moveItem(draggableId, targetColumn, "user");
    },
    [service],
  );

  // Handle item creation
  const handleCreateItem = useCallback(() => {
    if (!itemForm.titulo.trim()) return;

    const newItem = service.createBacklogItem({
      ...itemForm,
      coluna: selectedColumn || "ideias",
      usuario_criador: "user",
      historico_movimentacao: [],
    });

    setItemForm({
      titulo: "",
      descricao: "",
      categoria: "UX",
      modulo_impactado: "CRM Jurídico",
      prioridade: "media",
      status: "rascunho",
      tags: [],
      tempo_estimado: 8,
      checklist: [],
    });
    setIsCreateDialogOpen(false);
    setSelectedColumn(null);

    onItemCreate?.(newItem);
  }, [itemForm, selectedColumn, service, onItemCreate]);

  // Handle item update
  const handleUpdateItem = useCallback(() => {
    if (!editingItem || !itemForm.titulo.trim()) return;

    const success = service.updateBacklogItem(editingItem.id, {
      titulo: itemForm.titulo,
      descricao: itemForm.descricao,
      categoria: itemForm.categoria,
      modulo_impactado: itemForm.modulo_impactado,
      prioridade: itemForm.prioridade,
      status: itemForm.status,
      tags: itemForm.tags,
      tempo_estimado: itemForm.tempo_estimado,
      checklist: itemForm.checklist.map((check) => ({
        ...check,
        id: `check_${Date.now()}_${Math.random()}`,
        data_criacao: new Date().toISOString(),
      })),
    });

    if (success) {
      const updatedItem = state?.items.find(
        (item) => item.id === editingItem.id,
      );
      if (updatedItem) {
        onItemUpdate?.(updatedItem);
      }
    }

    setEditingItem(null);
    setIsCreateDialogOpen(false);
  }, [editingItem, itemForm, service, state, onItemUpdate]);

  // Handle item deletion
  const handleDeleteItem = useCallback(
    (itemId: string) => {
      if (
        window.confirm("Tem certeza que deseja excluir este item do backlog?")
      ) {
        service.deleteBacklogItem(itemId);
      }
    },
    [service],
  );

  // Start editing item
  const startEditingItem = useCallback((item: BacklogItem) => {
    setEditingItem(item);
    setItemForm({
      titulo: item.titulo,
      descricao: item.descricao,
      categoria: item.categoria,
      modulo_impactado: item.modulo_impactado,
      prioridade: item.prioridade,
      status: item.status,
      tags: item.tags,
      tempo_estimado: item.tempo_estimado || 8,
      checklist:
        item.checklist?.map((check) => ({
          texto: check.texto,
          concluido: check.concluido,
          responsavel: check.responsavel,
        })) || [],
    });
    setIsCreateDialogOpen(true);
  }, []);

  // Toggle item expansion
  const toggleItemExpansion = useCallback((itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
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

  // Get status icon
  const getStatusIcon = useCallback((status: BacklogStatus) => {
    switch (status) {
      case "rascunho":
        return <Edit className="h-3 w-3" />;
      case "aprovado":
        return <CheckCircle className="h-3 w-3" />;
      case "rejeitado":
        return <AlertTriangle className="h-3 w-3" />;
      case "concluido":
        return <CheckCircle className="h-3 w-3" />;
      case "em_execucao":
        return <Clock className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  }, []);

  // Add checklist item
  const addChecklistItem = useCallback(() => {
    setItemForm((prev) => ({
      ...prev,
      checklist: [...prev.checklist, { texto: "", concluido: false }],
    }));
  }, []);

  // Update checklist item
  const updateChecklistItem = useCallback(
    (
      index: number,
      updates: Partial<Omit<ChecklistItem, "id" | "data_criacao">>,
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

  if (!state) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 animate-pulse text-primary" />
          <span>Carregando backlog...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            🧱 Backlog Inteligente
          </h2>
          <p className="text-muted-foreground">
            {state.estatisticas.total_items} itens •{" "}
            {Math.round(state.estatisticas.taxa_execucao)}% executados
          </p>
        </div>

        <div className="flex items-center gap-2">
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
            value={filter.categoria?.[0] || "all"}
            onValueChange={(value) =>
              setFilter((prev) => ({
                ...prev,
                categoria:
                  value === "all" ? undefined : [value as BacklogCategory],
              }))
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
            </SelectContent>
          </Select>

          <Select
            value={filter.prioridade?.[0] || "all"}
            onValueChange={(value) =>
              setFilter((prev) => ({
                ...prev,
                prioridade:
                  value === "all" ? undefined : [value as BacklogPriority],
              }))
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="critica">Crítica</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-enhanced">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Itens
                </p>
                <p className="text-2xl font-bold">
                  {state.estatisticas.total_items}
                </p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Taxa Aprovação
                </p>
                <p className="text-2xl font-bold text-success">
                  {Math.round(state.estatisticas.taxa_aprovacao)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Processados IA
                </p>
                <p className="text-2xl font-bold text-primary">
                  {state.items.filter((i) => i.analise_ia).length}
                </p>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Ciclo Médio
                </p>
                <p className="text-2xl font-bold">
                  {Math.round(state.estatisticas.tempo_medio_ciclo)}d
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 overflow-x-auto">
          {state.colunas.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-3 ${snapshot.isDraggingOver ? "bg-muted/50" : ""} rounded-lg p-2 transition-colors`}
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
                  <div className="space-y-3 min-h-32">
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
                            className={`${snapshot.isDragging ? "rotate-3 shadow-lg" : ""}`}
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
                                      {item.tarefas_relacionadas &&
                                        item.tarefas_relacionadas.length >
                                          0 && (
                                          <DropdownMenuItem>
                                            <Link className="h-3 w-3 mr-2" />
                                            Ver Tarefas (
                                            {item.tarefas_relacionadas.length})
                                          </DropdownMenuItem>
                                        )}
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleDeleteItem(item.id)
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

                                {/* Item Description */}
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                  {item.descricao}
                                </p>

                                {/* Progress Bar */}
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

                                {/* Checklist Progress */}
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

                                {/* Item Footer */}
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      {item.usuario_criador}
                                    </div>
                                    {item.tempo_estimado && (
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {item.tempo_estimado}h
                                      </div>
                                    )}
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

                                    {getStatusIcon(item.status)}
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
                                        Análise IA (
                                        {item.analise_ia.confidence_score}%)
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
                <Label htmlFor="descricao">Descrição</Label>
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
                <Label htmlFor="modulo">M��dulo Impactado</Label>
                <Select
                  value={itemForm.modulo_impactado}
                  onValueChange={(value) =>
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
                <Label htmlFor="status">Status</Label>
                <Select
                  value={itemForm.status}
                  onValueChange={(value: BacklogStatus) =>
                    setItemForm((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                    <SelectItem value="rejeitado">Rejeitado</SelectItem>
                    <SelectItem value="em_execucao">Em Execução</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tempo">Tempo Estimado (horas)</Label>
                <Input
                  id="tempo"
                  type="number"
                  value={itemForm.tempo_estimado}
                  onChange={(e) =>
                    setItemForm((prev) => ({
                      ...prev,
                      tempo_estimado: parseInt(e.target.value) || 0,
                    }))
                  }
                  min="1"
                  max="500"
                />
              </div>

              <div>
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
                  placeholder="tag1, tag2, tag3..."
                />
              </div>
            </div>

            {/* Checklist */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Checklist de Implementação</Label>
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
export { BacklogKanban };

// Default export for backward compatibility
export default BacklogKanban;
