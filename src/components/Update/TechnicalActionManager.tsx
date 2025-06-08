import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Wrench,
  CheckCircle,
  Clock,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  User,
  Calendar,
  Tag,
  FileText,
  ExternalLink,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TechnicalAction {
  id: string;
  title: string;
  description: string;
  type: "bug" | "enhancement" | "maintenance" | "security" | "performance";
  priority: "low" | "medium" | "high" | "critical";
  status: "pending" | "in-progress" | "testing" | "completed" | "blocked";
  assignee: string;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  dueDate: string;
  tags: string[];
  dependencies: string[];
  createdAt: string;
  updatedAt: string;
}

interface TechnicalActionManagerProps {
  onActionSelect?: (action: TechnicalAction) => void;
}

export const TechnicalActionManager: React.FC<TechnicalActionManagerProps> = ({
  onActionSelect,
}) => {
  const [actions, setActions] = useState<TechnicalAction[]>([]);
  const [filteredActions, setFilteredActions] = useState<TechnicalAction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedAction, setSelectedAction] = useState<TechnicalAction | null>(
    null,
  );

  useEffect(() => {
    // Mock technical actions data
    const mockActions: TechnicalAction[] = [
      {
        id: "1",
        title: "Corrigir memory leak no módulo de busca",
        description:
          "Investigar e corrigir vazamento de memória identificado no sistema de busca que está causando lentidão após uso prolongado",
        type: "bug",
        priority: "high",
        status: "in-progress",
        assignee: "João Silva",
        estimatedHours: 8,
        actualHours: 5.5,
        progress: 70,
        dueDate: "2025-01-20",
        tags: ["memoria", "performance", "busca"],
        dependencies: [],
        createdAt: "2025-01-15T10:00:00Z",
        updatedAt: "2025-01-18T14:30:00Z",
      },
      {
        id: "2",
        title: "Implementar cache Redis para sessões",
        description:
          "Substituir cache em memória por Redis distribuído para melhorar performance e escalabilidade das sessões de usuário",
        type: "enhancement",
        priority: "medium",
        status: "pending",
        assignee: "Maria Santos",
        estimatedHours: 12,
        actualHours: 0,
        progress: 0,
        dueDate: "2025-01-25",
        tags: ["cache", "redis", "sessoes", "performance"],
        dependencies: ["setup-redis"],
        createdAt: "2025-01-16T09:00:00Z",
        updatedAt: "2025-01-16T09:00:00Z",
      },
      {
        id: "3",
        title: "Atualizar bibliotecas de segurança",
        description:
          "Atualizar todas as dependências relacionadas à segurança para as versões mais recentes e corrigir vulnerabilidades conhecidas",
        type: "security",
        priority: "critical",
        status: "completed",
        assignee: "Carlos Oliveira",
        estimatedHours: 6,
        actualHours: 7,
        progress: 100,
        dueDate: "2025-01-18",
        tags: ["seguranca", "dependencias", "vulnerabilidades"],
        dependencies: [],
        createdAt: "2025-01-14T11:00:00Z",
        updatedAt: "2025-01-18T16:00:00Z",
      },
      {
        id: "4",
        title: "Otimizar queries do relatório financeiro",
        description:
          "Reestruturar queries SQL do módulo financeiro para reduzir tempo de geração de relatórios de 30s para <5s",
        type: "performance",
        priority: "high",
        status: "testing",
        assignee: "Ana Costa",
        estimatedHours: 10,
        actualHours: 9,
        progress: 90,
        dueDate: "2025-01-22",
        tags: ["sql", "performance", "financeiro", "relatorios"],
        dependencies: [],
        createdAt: "2025-01-12T08:30:00Z",
        updatedAt: "2025-01-19T10:15:00Z",
      },
      {
        id: "5",
        title: "Limpeza de logs antigos",
        description:
          "Implementar rotina automatizada para remoção de logs com mais de 90 dias e compressão de logs históricos",
        type: "maintenance",
        priority: "low",
        status: "blocked",
        assignee: "Pedro Lima",
        estimatedHours: 4,
        actualHours: 2,
        progress: 25,
        dueDate: "2025-01-30",
        tags: ["logs", "manutencao", "automacao"],
        dependencies: ["disk-space-analysis"],
        createdAt: "2025-01-10T14:00:00Z",
        updatedAt: "2025-01-17T11:00:00Z",
      },
    ];

    setActions(mockActions);
    setFilteredActions(mockActions);
  }, []);

  useEffect(() => {
    let filtered = actions;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (action) =>
          action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          action.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          action.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((action) => action.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter(
        (action) => action.priority === priorityFilter,
      );
    }

    setFilteredActions(filtered);
  }, [actions, searchQuery, statusFilter, priorityFilter]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bug":
        return "bg-red-100 text-red-800";
      case "enhancement":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-gray-100 text-gray-800";
      case "security":
        return "bg-yellow-100 text-yellow-800";
      case "performance":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "testing":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "blocked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "in-progress":
        return <PlayCircle className="h-4 w-4" />;
      case "testing":
        return <Wrench className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "blocked":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleActionClick = (action: TechnicalAction) => {
    setSelectedAction(action);
    onActionSelect?.(action);
  };

  const handleStatusChange = (actionId: string, newStatus: string) => {
    setActions((prev) =>
      prev.map((action) =>
        action.id === actionId
          ? {
              ...action,
              status: newStatus as any,
              updatedAt: new Date().toISOString(),
            }
          : action,
      ),
    );
  };

  // Statistics
  const stats = {
    total: actions.length,
    pending: actions.filter((a) => a.status === "pending").length,
    inProgress: actions.filter((a) => a.status === "in-progress").length,
    completed: actions.filter((a) => a.status === "completed").length,
    blocked: actions.filter((a) => a.status === "blocked").length,
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {stats.pending}
              </div>
              <div className="text-sm text-gray-600">Pendentes</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.inProgress}
              </div>
              <div className="text-sm text-gray-600">Em Progresso</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.completed}
              </div>
              <div className="text-sm text-gray-600">Concluídas</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats.blocked}
              </div>
              <div className="text-sm text-gray-600">Bloqueadas</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar ações técnicas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="in-progress">Em Progresso</SelectItem>
                <SelectItem value="testing">Testando</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
                <SelectItem value="blocked">Bloqueada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Prioridades</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Actions List */}
      <ScrollArea className="h-[700px]">
        <div className="space-y-4">
          {filteredActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleActionClick(action)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(action.status)}
                        <h3 className="font-semibold text-lg">
                          {action.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {action.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={getTypeColor(action.type)}>
                          {action.type}
                        </Badge>
                        <Badge className={getPriorityColor(action.priority)}>
                          {action.priority}
                        </Badge>
                        <Badge className={getStatusColor(action.status)}>
                          {action.status}
                        </Badge>
                        {action.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 ml-4">
                      <Select
                        value={action.status}
                        onValueChange={(value) =>
                          handleStatusChange(action.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="in-progress">
                            Em Progresso
                          </SelectItem>
                          <SelectItem value="testing">Testando</SelectItem>
                          <SelectItem value="completed">Concluída</SelectItem>
                          <SelectItem value="blocked">Bloqueada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Responsável
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {action.assignee}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Prazo</span>
                      </div>
                      <span className="text-sm font-medium">
                        {new Date(action.dueDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Tempo</span>
                      </div>
                      <span className="text-sm font-medium">
                        {action.actualHours}h / {action.estimatedHours}h
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Progresso</span>
                        <span className="text-sm font-medium">
                          {action.progress}%
                        </span>
                      </div>
                      <Progress value={action.progress} className="h-2" />
                    </div>
                  </div>

                  {action.dependencies.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2 mb-2">
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Dependências
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {action.dependencies.map((dep) => (
                          <Badge
                            key={dep}
                            variant="outline"
                            className="text-xs"
                          >
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      {filteredActions.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Wrench className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma ação encontrada
            </h3>
            <p className="text-gray-600">
              Não há ações técnicas que correspondam aos filtros selecionados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
