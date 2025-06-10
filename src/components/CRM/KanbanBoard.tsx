/**
 * 📋 KANBAN BOARD APRIMORADO - CRM V3 MINIMALIA
 *
 * Componente kanban modular para diferentes tipos de dados:
 * - Pipeline de clientes (Lead → Cliente)
 * - Status de processos (Ativo → Finalizado)
 * - Status de tarefas (Pendente → Concluída)
 * - Design minimalista com drag & drop
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { SafeDragDropContext } from "../Common/SafeDragDropContext";
import {
  Plus,
  MoreHorizontal,
  Star,
  Clock,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  User,
  Building,
  Calendar,
  FileText,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ContextualMenu, { ContextualAction } from "./ContextualMenu";

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  limit?: number;
  items: KanbanItem[];
}

export interface KanbanItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  avatar?: string;
  initials?: string;
  priority?: "baixa" | "media" | "alta" | "urgente";
  status?: string;
  value?: number;
  date?: Date;
  tags?: string[];
  metrics?: Record<string, any>;
  actions?: ContextualAction[];
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onDrop: (result: DropResult) => void;
  onItemClick?: (item: KanbanItem) => void;
  onAction?: (itemId: string, actionId: string) => void;
  onAddItem?: (columnId: string) => void;
  className?: string;
  type?: "clients" | "processes" | "tasks" | "contracts";
}

const getPriorityIcon = (priority?: string) => {
  switch (priority) {
    case "urgente":
      return <AlertTriangle className="w-3 h-3 text-red-500" />;
    case "alta":
      return <AlertTriangle className="w-3 h-3 text-orange-500" />;
    case "media":
      return <Clock className="w-3 h-3 text-yellow-500" />;
    default:
      return <Clock className="w-3 h-3 text-gray-400" />;
  }
};

const formatValue = (value?: number) => {
  if (!value) return null;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date?: Date) => {
  if (!date) return null;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  onDrop,
  onItemClick,
  onAction,
  onAddItem,
  className = "",
  type = "clients",
}) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (start: any) => {
    setDraggedItem(start.draggableId);
  };

  const handleDragEnd = (result: DropResult) => {
    setDraggedItem(null);
    onDrop(result);
  };

  const renderItemContent = (item: KanbanItem) => {
    switch (type) {
      case "clients":
        return (
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 flex-grow min-w-0">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  {item.avatar ? (
                    <AvatarImage src={item.avatar} alt={item.title} />
                  ) : (
                    <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                      {item.initials || item.title.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="min-w-0 flex-grow">
                  <h4 className="font-medium text-sm text-gray-900 truncate">
                    {item.title}
                  </h4>
                  {item.subtitle && (
                    <p className="text-xs text-gray-500 truncate">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {item.priority && getPriorityIcon(item.priority)}
                {item.metrics?.scoreEngajamento && (
                  <Badge variant="secondary" className="text-xs h-4 px-1">
                    {item.metrics.scoreEngajamento}%
                  </Badge>
                )}
              </div>
            </div>

            {item.value && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Potencial:</span>
                <span className="font-medium text-green-600">
                  {formatValue(item.value)}
                </span>
              </div>
            )}

            {item.date && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                {formatDate(item.date)}
              </div>
            )}

            {item.tags && item.tags.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {item.tags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs h-4 px-1"
                  >
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs h-4 px-1">
                    +{item.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        );

      case "processes":
        return (
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-grow min-w-0">
                <h4 className="font-medium text-sm text-gray-900 truncate">
                  {item.title}
                </h4>
                {item.subtitle && (
                  <p className="text-xs text-gray-500 truncate">
                    #{item.subtitle}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {item.priority && getPriorityIcon(item.priority)}
                {item.metrics?.alertas > 0 && (
                  <Badge variant="destructive" className="text-xs h-4 px-1">
                    {item.metrics.alertas}
                  </Badge>
                )}
              </div>
            </div>

            {item.description && (
              <p className="text-xs text-gray-600 line-clamp-2">
                {item.description}
              </p>
            )}

            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 flex items-center gap-1">
                <User className="w-3 h-3" />
                {item.metrics?.advogado || "Não atribuído"}
              </span>
              {item.date && (
                <span className="text-gray-500">{formatDate(item.date)}</span>
              )}
            </div>
          </div>
        );

      case "tasks":
        return (
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-grow min-w-0">
                <h4 className="font-medium text-sm text-gray-900 truncate">
                  {item.title}
                </h4>
                {item.subtitle && (
                  <p className="text-xs text-gray-500 truncate">
                    {item.subtitle}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {item.priority && getPriorityIcon(item.priority)}
              </div>
            </div>

            {item.description && (
              <p className="text-xs text-gray-600 line-clamp-2">
                {item.description}
              </p>
            )}

            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 flex items-center gap-1">
                <User className="w-3 h-3" />
                {item.metrics?.responsavel || "Não atribuído"}
              </span>
              {item.date && (
                <span
                  className={`
                  ${item.date < new Date() ? "text-red-500" : "text-gray-500"}
                `}
                >
                  {formatDate(item.date)}
                </span>
              )}
            </div>

            {item.metrics?.tempoEstimado && (
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.metrics.tempoEstimado}h estimadas
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-900 truncate">
              {item.title}
            </h4>
            {item.subtitle && (
              <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
            )}
            {item.description && (
              <p className="text-xs text-gray-600 line-clamp-2">
                {item.description}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <SafeDragDropContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      fallback={
        <div className="text-center py-8 text-gray-500">
          Carregando kanban...
        </div>
      }
    >
      <div
        className={`
        flex gap-4 overflow-x-auto pb-4
        ${className}
      `}
      >
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80">
            {/* Cabeçalho da coluna */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
                <h3 className="font-medium text-sm text-gray-900">
                  {column.title}
                </h3>
                <Badge variant="secondary" className="text-xs h-4 px-1.5">
                  {column.items.length}
                  {column.limit && `/${column.limit}`}
                </Badge>
              </div>

              {onAddItem && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAddItem(column.id)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                  title="Adicionar item"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Lista de itens */}
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`
                    min-h-32 space-y-2 p-2 rounded-lg transition-colors
                    ${
                      snapshot.isDraggingOver
                        ? "bg-blue-50 border-2 border-blue-200 border-dashed"
                        : "bg-gray-50 border-2 border-transparent"
                    }
                  `}
                >
                  <AnimatePresence>
                    {column.items.map((item, index) => (
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
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className={`
                              ${
                                snapshot.isDragging
                                  ? "shadow-lg rotate-3 scale-105"
                                  : "shadow-sm hover:shadow-md"
                              }
                              transition-all duration-200
                            `}
                          >
                            <Card
                              className={`
                                cursor-pointer border border-gray-200
                                hover:border-gray-300 transition-colors
                                ${draggedItem === item.id ? "opacity-50" : ""}
                              `}
                              onClick={() => onItemClick?.(item)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-grow min-w-0">
                                    {renderItemContent(item)}
                                  </div>

                                  {item.actions && onAction && (
                                    <div className="ml-2 flex-shrink-0">
                                      <ContextualMenu
                                        actions={item.actions}
                                        onAction={(actionId) =>
                                          onAction(item.id, actionId)
                                        }
                                        placement="bottom-end"
                                      />
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                  </AnimatePresence>
                  {provided.placeholder}

                  {/* Placeholder quando vazio */}
                  {column.items.length === 0 && !snapshot.isDraggingOver && (
                    <div className="text-center py-8 text-gray-400">
                      <div className="text-sm">Nenhum item</div>
                      {onAddItem && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onAddItem(column.id)}
                          className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Adicionar
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </SafeDragDropContext>
  );
};

export default KanbanBoard;
