import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  Plus,
  User,
  Building,
  Calendar,
  DollarSign,
  FileText,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Bot,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface KanbanItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: "low" | "medium" | "high" | "urgent";
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
  tags?: string[];
  attachments?: number;
  type: "contract" | "process" | "task" | "client";
  metadata?: Record<string, any>;
}

export interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanItem[];
  color?: string;
  limit?: number;
}

export interface KanbanViewProps {
  columns: KanbanColumn[];
  onItemMove?: (itemId: string, fromColumn: string, toColumn: string) => void;
  onItemClick?: (item: KanbanItem) => void;
  onItemEdit?: (item: KanbanItem) => void;
  onItemDelete?: (itemId: string) => void;
  onAddItem?: (columnId: string) => void;
  showMetrics?: boolean;
  compactMode?: boolean;
  className?: string;
}

export function KanbanView({
  columns,
  onItemMove,
  onItemClick,
  onItemEdit,
  onItemDelete,
  onAddItem,
  showMetrics = true,
  compactMode = false,
  className,
}: KanbanViewProps) {
  const [draggedItem, setDraggedItem] = useState<KanbanItem | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const handleDragStart = useCallback((item: KanbanItem) => {
    setDraggedItem(item);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDragOverColumn(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, columnId: string) => {
      e.preventDefault();
      if (draggedItem && onItemMove) {
        const fromColumn = columns.find((col) =>
          col.items.some((item) => item.id === draggedItem.id),
        )?.id;
        if (fromColumn && fromColumn !== columnId) {
          onItemMove(draggedItem.id, fromColumn, columnId);
        }
      }
      setDragOverColumn(null);
    },
    [draggedItem, columns, onItemMove],
  );

  const getPriorityColor = (priority?: string) => {
    const colors = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-yellow-100 text-yellow-800",
      urgent: "bg-red-100 text-red-800",
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      contract: FileText,
      process: Target,
      task: CheckCircle,
      client: type === "juridica" ? Building : User,
    };
    return icons[type as keyof typeof icons] || FileText;
  };

  const renderKanbanItem = (item: KanbanItem) => {
    const TypeIcon = getTypeIcon(item.type);

    return (
      <motion.div
        key={item.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        draggable
        onDragStart={() => handleDragStart(item)}
        onDragEnd={handleDragEnd}
        className={cn(
          "bg-white border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md",
          compactMode && "p-3",
          draggedItem?.id === item.id && "opacity-50 scale-95",
        )}
        onClick={() => onItemClick?.(item)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <TypeIcon className="h-4 w-4 text-muted-foreground" />
            {item.priority && (
              <Badge className={getPriorityColor(item.priority)}>
                {item.priority}
              </Badge>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onItemEdit?.(item)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onItemDelete?.(item.id)}
                className="text-red-600"
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title */}
        <h4 className="font-medium text-sm mb-2 line-clamp-2">{item.title}</h4>

        {/* Description */}
        {item.description && !compactMode && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Client info */}
        {item.client && (
          <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
            {item.client.type === "juridica" ? (
              <Building className="h-3 w-3" />
            ) : (
              <User className="h-3 w-3" />
            )}
            <span className="truncate">{item.client.name}</span>
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-2 mb-3 text-xs">
          {item.value && (
            <div className="flex items-center gap-1 text-green-600">
              <DollarSign className="h-3 w-3" />
              <span>
                {item.value.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
          )}

          {item.attachments && item.attachments > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <FileText className="h-3 w-3" />
              <span>{item.attachments}</span>
            </div>
          )}

          {item.metadata?.stripeEnabled && (
            <CreditCard className="h-3 w-3 text-blue-600" />
          )}

          {item.metadata?.riskScore && (
            <div className="flex items-center gap-1">
              <Bot className="h-3 w-3 text-purple-600" />
              <span
                className={cn(
                  "text-xs font-medium",
                  item.metadata.riskScore > 50
                    ? "text-red-600"
                    : item.metadata.riskScore > 25
                      ? "text-yellow-600"
                      : "text-green-600",
                )}
              >
                {item.metadata.riskScore}%
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && !compactMode && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{item.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Due date */}
          {item.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{new Date(item.dueDate).toLocaleDateString("pt-BR")}</span>
            </div>
          )}

          {/* Assignee */}
          {item.assignee && (
            <div className="flex items-center gap-1">
              <Avatar className="h-5 w-5">
                <AvatarImage src={item.assignee.avatar} />
                <AvatarFallback className="text-xs">
                  {item.assignee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderColumn = (column: KanbanColumn) => {
    const isOverLimit = column.limit && column.items.length > column.limit;
    const isDragOver = dragOverColumn === column.id;

    return (
      <div
        key={column.id}
        className={cn(
          "flex flex-col min-h-[600px] w-80 bg-gray-50 rounded-lg",
          compactMode && "w-72 min-h-[500px]",
        )}
        onDragOver={(e) => handleDragOver(e, column.id)}
        onDrop={(e) => handleDrop(e, column.id)}
      >
        {/* Column Header */}
        <div className="p-4 border-b bg-white rounded-t-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{column.title}</h3>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn(isOverLimit && "bg-red-100 text-red-800")}
              >
                {column.items.length}
                {column.limit && `/${column.limit}`}
              </Badge>
              {onAddItem && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onAddItem(column.id)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Metrics */}
          {showMetrics && column.items.length > 0 && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {column.items.some((item) => item.value) && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span>
                    {column.items
                      .reduce((sum, item) => sum + (item.value || 0), 0)
                      .toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        maximumFractionDigits: 0,
                      })}
                  </span>
                </div>
              )}
              {column.items.some((item) => item.metadata?.riskScore) && (
                <div className="flex items-center gap-1">
                  <Bot className="h-3 w-3" />
                  <span>
                    Risk:{" "}
                    {Math.round(
                      column.items.reduce(
                        (sum, item) => sum + (item.metadata?.riskScore || 0),
                        0,
                      ) / column.items.length,
                    )}
                    %
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Column Content */}
        <div
          className={cn(
            "flex-1 p-4 space-y-3 overflow-y-auto",
            isDragOver && "bg-blue-50 border-2 border-dashed border-blue-300",
          )}
        >
          <AnimatePresence>
            {column.items.map((item) => (
              <div key={item.id} className="group">
                {renderKanbanItem(item)}
              </div>
            ))}
          </AnimatePresence>

          {column.items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-sm">Nenhum item nesta coluna</p>
              {onAddItem && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => onAddItem(column.id)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar item
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("flex gap-6 overflow-x-auto pb-6", className)}>
      {columns.map(renderColumn)}
    </div>
  );
}
