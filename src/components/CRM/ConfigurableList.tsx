/**
 * Lista configurável com drag & drop para o CRM Jurídico
 * - Colunas editáveis
 * - Drag & drop entre status
 * - Discussões contextuais
 * - Design minimalista
 */

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SafeDragDropContext,
  SafeDroppable as Droppable,
  SafeDraggable as Draggable,
} from "../Common/SafeDragDropContext";
import {
  MoreVertical,
  MessageSquare,
  Eye,
  Edit,
  Trash2,
  Settings,
  Plus,
  Filter,
  SortAsc,
  SortDesc,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Tipos
export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  width?: string;
  sortable?: boolean;
}

export interface ListItem {
  id: string;
  status: string;
  data: Record<string, any>;
  discussions?: Discussion[];
}

export interface Discussion {
  id: string;
  author: string;
  message: string;
  timestamp: Date;
  internal: boolean;
}

export interface ConfigurableListProps {
  items: ListItem[];
  columns: ColumnConfig[];
  viewMode: "list" | "kanban";
  onItemUpdate: (item: ListItem) => void;
  onColumnUpdate: (columns: ColumnConfig[]) => void;
  onDiscussion: (
    itemId: string,
    discussion: Omit<Discussion, "id" | "timestamp">,
  ) => void;
  statusColumns?: string[];
  className?: string;
}

export const ConfigurableList: React.FC<ConfigurableListProps> = ({
  items,
  columns,
  viewMode,
  onItemUpdate,
  onColumnUpdate,
  onDiscussion,
  statusColumns = ["pendente", "em_andamento", "concluido"],
  className,
}) => {
  const [editingColumns, setEditingColumns] = useState(false);
  const [discussionOpen, setDiscussionOpen] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Filtrar colunas visíveis
  const visibleColumns = columns.filter((col) => col.visible);

  // Ordenar itens
  const sortedItems = React.useMemo(() => {
    if (!sortConfig) return items;

    return [...items].sort((a, b) => {
      const aValue = a.data[sortConfig.key];
      const bValue = b.data[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [items, sortConfig]);

  // Agrupar por status para Kanban
  const itemsByStatus = React.useMemo(() => {
    return statusColumns.reduce(
      (acc, status) => {
        acc[status] = sortedItems.filter((item) => item.status === status);
        return acc;
      },
      {} as Record<string, ListItem[]>,
    );
  }, [sortedItems, statusColumns]);

  // Handle drag & drop
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const { source, destination, draggableId } = result;

      if (source.droppableId === destination.droppableId) {
        // Reordenar dentro da mesma coluna
        return;
      }

      // Mover entre colunas (alterar status)
      const item = items.find((item) => item.id === draggableId);
      if (item) {
        const updatedItem = {
          ...item,
          status: destination.droppableId,
        };
        onItemUpdate(updatedItem);
      }
    },
    [items, onItemUpdate],
  );

  // Handle sort
  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return prev.direction === "asc" ? { key, direction: "desc" } : null;
      }
      return { key, direction: "asc" };
    });
  };

  // Handle column visibility
  const toggleColumnVisibility = (key: string) => {
    const updatedColumns = columns.map((col) =>
      col.key === key ? { ...col, visible: !col.visible } : col,
    );
    onColumnUpdate(updatedColumns);
  };

  // Handle discussion
  const handleSendMessage = (itemId: string) => {
    if (!newMessage.trim()) return;

    onDiscussion(itemId, {
      author: "Usuário Atual", // Substituir por usuário logado
      message: newMessage,
      internal: true,
    });

    setNewMessage("");
  };

  // Renderizar item da lista
  const renderListItem = (item: ListItem, index: number) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 grid grid-cols-12 gap-4 items-center">
          {visibleColumns.map((column) => (
            <div key={column.key} className="col-span-2">
              <div className="text-sm">
                {column.key === "status" ? (
                  <Badge variant="secondary" className="text-xs">
                    {item.data[column.key]}
                  </Badge>
                ) : (
                  <span className="text-gray-900">{item.data[column.key]}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          {/* Discussões */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDiscussionOpen(item.id)}
            className="relative"
          >
            <MessageSquare className="w-4 h-4" />
            {item.discussions && item.discussions.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-blue-500">
                {item.discussions.length}
              </Badge>
            )}
          </Button>

          {/* Menu de ações */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );

  // Renderizar coluna Kanban
  const renderKanbanColumn = (status: string, items: ListItem[]) => (
    <div key={status} className="flex-1 min-w-80">
      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 capitalize">
            {status.replace("_", " ")}
          </h3>
          <Badge variant="secondary">{items.length}</Badge>
        </div>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 min-h-96 p-2 rounded-lg transition-colors ${
              snapshot.isDraggingOver ? "bg-blue-50" : ""
            }`}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`transition-all ${
                      snapshot.isDragging ? "rotate-2 shadow-lg" : ""
                    }`}
                  >
                    <Card className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          {visibleColumns.slice(0, 3).map((column) => (
                            <div key={column.key}>
                              <span className="text-xs text-gray-500 uppercase tracking-wide">
                                {column.label}
                              </span>
                              <p className="text-sm font-medium">
                                {item.data[column.key]}
                              </p>
                            </div>
                          ))}

                          <div className="flex items-center justify-between pt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDiscussionOpen(item.id)}
                              className="relative"
                            >
                              <MessageSquare className="w-4 h-4" />
                              {item.discussions &&
                                item.discussions.length > 0 && (
                                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-blue-500">
                                    {item.discussions.length}
                                  </Badge>
                                )}
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Visualizar
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header com controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold">
            {viewMode === "list" ? "Lista" : "Kanban"}
          </h2>
          <Badge variant="secondary">{items.length} itens</Badge>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>

          <Dialog open={editingColumns} onOpenChange={setEditingColumns}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Colunas
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configurar Colunas</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                {columns.map((column) => (
                  <div key={column.key} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={column.visible}
                      onChange={() => toggleColumnVisibility(column.key)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{column.label}</span>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Novo
          </Button>
        </div>
      </div>

      {/* Lista ou Kanban */}
      {viewMode === "list" ? (
        <div className="space-y-4">
          {/* Header da tabela */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-12 gap-4">
              {visibleColumns.map((column) => (
                <div key={column.key} className="col-span-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => column.sortable && handleSort(column.key)}
                    className="p-0 h-auto font-medium text-gray-700 hover:text-gray-900"
                  >
                    {column.label}
                    {sortConfig?.key === column.key &&
                      (sortConfig.direction === "asc" ? (
                        <SortAsc className="w-4 h-4 ml-1" />
                      ) : (
                        <SortDesc className="w-4 h-4 ml-1" />
                      ))}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Itens da lista */}
          <div className="space-y-2">
            {sortedItems.map((item, index) => renderListItem(item, index))}
          </div>
        </div>
      ) : (
        <SafeDragDropContext onDragEnd={handleDragEnd}>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {statusColumns.map((status) =>
              renderKanbanColumn(status, itemsByStatus[status] || []),
            )}
          </div>
        </SafeDragDropContext>
      )}

      {/* Dialog de discussões */}
      <Dialog
        open={!!discussionOpen}
        onOpenChange={() => setDiscussionOpen(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Discussões</DialogTitle>
          </DialogHeader>

          {discussionOpen && (
            <div className="space-y-4">
              {/* Lista de discussões */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items
                  .find((item) => item.id === discussionOpen)
                  ?.discussions?.map((discussion) => (
                    <div
                      key={discussion.id}
                      className="bg-gray-50 rounded-lg p-3"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-medium">
                            {discussion.author.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {discussion.author}
                        </span>
                        <Badge
                          variant={
                            discussion.internal ? "secondary" : "default"
                          }
                        >
                          {discussion.internal ? "Interno" : "Cliente"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">
                        {discussion.message}
                      </p>
                    </div>
                  ))}
              </div>

              {/* Nova mensagem */}
              <div className="space-y-2">
                <Input
                  placeholder="Digite sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage(discussionOpen);
                    }
                  }}
                />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleSendMessage(discussionOpen)}
                    disabled={!newMessage.trim()}
                  >
                    Enviar (Interno)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Lógica para compartilhar com cliente
                      handleSendMessage(discussionOpen);
                    }}
                    disabled={!newMessage.trim()}
                  >
                    Compartilhar com Cliente
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
