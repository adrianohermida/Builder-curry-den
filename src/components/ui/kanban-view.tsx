import { useState, useCallback, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  MoreHorizontal,
  Plus,
  User,
  Calendar,
  Flag,
  MessageSquare,
  FileText,
  Clock,
  DollarSign,
  Users,
  Building,
  Scale,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
  Star,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";

export interface KanbanItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: "low" | "medium" | "high" | "urgent";
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  client?: {
    id: string;
    name: string;
    type: "fisica" | "juridica";
  };
  dueDate?: string;
  value?: number;
  progress?: number;
  tags?: string[];
  attachments?: number;
  comments?: number;
  type: "client" | "process" | "contract" | "task" | "publication" | "ticket";
  metadata?: Record<string, any>;
}

export interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanItem[];
  color?: string;
  limit?: number;
  description?: string;
}

interface KanbanViewProps {
  columns: KanbanColumn[];
  onItemMove: (
    itemId: string,
    fromColumn: string,
    toColumn: string,
    newIndex: number,
  ) => void;
  onItemClick?: (item: KanbanItem) => void;
  onItemEdit?: (item: KanbanItem) => void;
  onItemDelete?: (item: KanbanItem) => void;
  onAddItem?: (columnId: string) => void;
  onColumnEdit?: (column: KanbanColumn) => void;
  groupBy?: "status" | "assignee" | "priority" | "client" | "area";
  showMetrics?: boolean;
  compactMode?: boolean;
  className?: string;
}

const priorityColors = {
  low: "text-blue-600 bg-blue-50 border-blue-200",
  medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
  high: "text-orange-600 bg-orange-50 border-orange-200",
  urgent: "text-red-600 bg-red-50 border-red-200",
};

const priorityIcons = {
  low: Flag,
  medium: Flag,
  high: AlertTriangle,
  urgent: Zap,
};

const typeIcons = {
  client: Users,
  process: Scale,
  contract: FileText,
  task: CheckCircle,
  publication: FileText,
  ticket: MessageSquare,
};

// Sortable Item Component
function SortableKanbanItem({
  item,
  onItemClick,
  onItemEdit,
  onItemDelete,
  compactMode,
}: {
  item: KanbanItem;
  onItemClick?: (item: KanbanItem) => void;
  onItemEdit?: (item: KanbanItem) => void;
  onItemDelete?: (item: KanbanItem) => void;
  compactMode?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const TypeIcon = typeIcons[item.type];
  const PriorityIcon = priorityIcons[item.priority];
  const isOverdue = item.dueDate && new Date(item.dueDate) < new Date();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group cursor-pointer",
        isDragging && "rotate-2 scale-105 z-50",
      )}
    >
      <Card
        className={cn(
          "hover:shadow-md transition-all duration-200 border-l-4",
          isDragging && "shadow-lg ring-2 ring-primary/20",
          compactMode ? "p-2" : "p-3",
          isOverdue && "border-l-red-500 bg-red-50/50",
        )}
        style={{
          borderLeftColor: priorityColors[item.priority].includes("red")
            ? "#ef4444"
            : priorityColors[item.priority].includes("orange")
              ? "#f97316"
              : priorityColors[item.priority].includes("yellow")
                ? "#eab308"
                : "#3b82f6",
        }}
        onClick={() => onItemClick?.(item)}
      >
        {!compactMode && (
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <TypeIcon className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline" className="text-xs">
                  {item.type.toUpperCase()}
                </Badge>
                <Badge className={cn("text-xs", priorityColors[item.priority])}>
                  <PriorityIcon className="h-3 w-3 mr-1" />
                  {item.priority.toUpperCase()}
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onItemClick?.(item)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onItemEdit?.(item)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onItemDelete?.(item)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
        )}

        <CardContent className={cn("space-y-3", compactMode && "p-3")}>
          <div>
            <h4
              className={cn(
                "font-medium leading-tight line-clamp-2",
                compactMode ? "text-sm" : "text-base",
              )}
            >
              {item.title}
            </h4>
            {item.description && !compactMode && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {item.description}
              </p>
            )}
          </div>

          {/* Progress bar */}
          {item.progress !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progresso</span>
                <span>{item.progress}%</span>
              </div>
              <Progress value={item.progress} className="h-1" />
            </div>
          )}

          {/* Metadata row */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              {item.client && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-1">
                        {item.client.type === "juridica" ? (
                          <Building className="h-3 w-3" />
                        ) : (
                          <User className="h-3 w-3" />
                        )}
                        <span className="max-w-[80px] truncate">
                          {item.client.name}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.client.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.client.type === "juridica"
                          ? "Pessoa Jurídica"
                          : "Pessoa Física"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {item.value && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span className="font-medium">
                    {item.value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              )}
            </div>

            {item.dueDate && (
              <div
                className={cn(
                  "flex items-center gap-1",
                  isOverdue && "text-red-600",
                )}
              >
                <Clock className="h-3 w-3" />
                <span>
                  {new Date(item.dueDate).toLocaleDateString("pt-BR")}
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && !compactMode && (
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs px-1">
                  {tag}
                </Badge>
              ))}
              {item.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-1">
                  +{item.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            {item.assignee ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={item.assignee.avatar} />
                      <AvatarFallback className="text-xs">
                        {item.assignee.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.assignee.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="w-6 h-6" />
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {item.attachments && item.attachments > 0 && (
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span>{item.attachments}</span>
                </div>
              )}

              {item.comments && item.comments > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{item.comments}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function KanbanView({
  columns,
  onItemMove,
  onItemClick,
  onItemEdit,
  onItemDelete,
  onAddItem,
  onColumnEdit,
  groupBy = "status",
  showMetrics = true,
  compactMode = false,
  className,
}: KanbanViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { isDark, colors } = useTheme();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      // Find which columns the active and over items belong to
      let fromColumn = "";
      let toColumn = "";

      columns.forEach((column) => {
        if (column.items.some((item) => item.id === activeId)) {
          fromColumn = column.id;
        }
        if (
          column.id === overId ||
          column.items.some((item) => item.id === overId)
        ) {
          toColumn = column.id === overId ? column.id : column.id;
        }
      });

      if (fromColumn && toColumn && fromColumn !== toColumn) {
        const overIndex =
          columns.find((col) => col.id === toColumn)?.items.length || 0;
        onItemMove(activeId, fromColumn, toColumn, overIndex);
      }
    },
    [columns, onItemMove],
  );

  const getColumnMetrics = (column: KanbanColumn) => {
    const total = column.items.length;
    const completed = column.items.filter(
      (item) => item.status === "completed" || item.status === "done",
    ).length;
    const overdue = column.items.filter(
      (item) => item.dueDate && new Date(item.dueDate) < new Date(),
    ).length;
    const totalValue = column.items.reduce(
      (sum, item) => sum + (item.value || 0),
      0,
    );

    return { total, completed, overdue, totalValue };
  };

  const activeItem = useMemo(() => {
    if (!activeId) return null;

    for (const column of columns) {
      const item = column.items.find((item) => item.id === activeId);
      if (item) return item;
    }

    return null;
  }, [activeId, columns]);

  return (
    <TooltipProvider>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={cn("flex gap-6 overflow-x-auto pb-4", className)}>
          {columns.map((column) => {
            const metrics = getColumnMetrics(column);

            return (
              <div key={column.id} className="flex-shrink-0 w-80">
                <div className="mb-4">
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{column.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {column.items.length}
                        {column.limit && `/${column.limit}`}
                      </Badge>
                      {column.limit && column.items.length > column.limit && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Limite
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {onAddItem && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onAddItem(column.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      )}

                      {onColumnEdit && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => onColumnEdit(column)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar Coluna
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Target className="h-4 w-4 mr-2" />
                              Definir Limite
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>

                  {/* Column Description */}
                  {column.description && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {column.description}
                    </p>
                  )}

                  {/* Column Metrics */}
                  {showMetrics && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="text-xs">
                        <span className="text-muted-foreground">
                          Concluídos:
                        </span>
                        <span className="ml-1 font-medium">
                          {metrics.completed}/{metrics.total}
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">
                          Atrasados:
                        </span>
                        <span
                          className={cn(
                            "ml-1 font-medium",
                            metrics.overdue > 0 && "text-red-600",
                          )}
                        >
                          {metrics.overdue}
                        </span>
                      </div>
                      {metrics.totalValue > 0 && (
                        <div className="text-xs col-span-2">
                          <span className="text-muted-foreground">Valor:</span>
                          <span className="ml-1 font-medium">
                            {metrics.totalValue.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Column Items */}
                <SortableContext
                  items={column.items.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                  id={column.id}
                >
                  <div className="space-y-3 min-h-[200px] p-2 rounded-lg">
                    {column.items.map((item) => (
                      <SortableKanbanItem
                        key={item.id}
                        item={item}
                        onItemClick={onItemClick}
                        onItemEdit={onItemEdit}
                        onItemDelete={onItemDelete}
                        compactMode={compactMode}
                      />
                    ))}

                    {column.items.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <div className="text-4xl mb-2">📋</div>
                        <p className="text-sm">Nenhum item nesta coluna</p>
                        {onAddItem && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onAddItem(column.id)}
                            className="mt-2"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Item
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeItem ? (
            <SortableKanbanItem
              item={activeItem}
              onItemClick={onItemClick}
              onItemEdit={onItemEdit}
              onItemDelete={onItemDelete}
              compactMode={compactMode}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </TooltipProvider>
  );
}
