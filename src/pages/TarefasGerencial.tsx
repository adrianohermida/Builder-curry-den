/**
 * 📋 TAREFAS GERENCIAIS - PÁGINA DEFINITIVA
 *
 * Sistema completo de tarefas gerenciais:
 * - Gestão de equipe
 * - Tarefas administrativas
 * - Workflows corporativos
 * - Zero amarelo
 */

import React, { useState } from "react";
import {
  CheckSquare,
  Users,
  Calendar,
  Clock,
  Filter,
  Search,
  Plus,
  MoreVertical,
  ArrowRight,
  Target,
  Workflow,
  AlertCircle,
  User,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  department: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "review" | "completed";
  dueDate: Date;
  category: "administrative" | "legal" | "financial" | "hr" | "it";
  progress: number;
}

export default function TarefasGerencial() {
  const [viewMode, setViewMode] = useState<"kanban" | "list" | "calendar">(
    "kanban",
  );
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const tasks: Task[] = [
    {
      id: "1",
      title: "Revisão de Contratos Q1",
      description: "Revisar todos os contratos do primeiro trimestre",
      assignee: "Ana Silva",
      department: "Jurídico",
      priority: "high",
      status: "in_progress",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      category: "legal",
      progress: 60,
    },
    {
      id: "2",
      title: "Relatório Financeiro Mensal",
      description: "Consolidar dados financeiros do mês",
      assignee: "Carlos Santos",
      department: "Financeiro",
      priority: "urgent",
      status: "pending",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      category: "financial",
      progress: 20,
    },
    {
      id: "3",
      title: "Auditoria de Segurança",
      description: "Verificar compliance de segurança dos sistemas",
      assignee: "Marina Costa",
      department: "TI",
      priority: "medium",
      status: "review",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      category: "it",
      progress: 85,
    },
  ];

  const stats = [
    {
      title: "Total de Tarefas",
      value: "156",
      change: "+12%",
      icon: <CheckSquare className="w-5 h-5" />,
      color: "blue",
    },
    {
      title: "Em Andamento",
      value: "43",
      change: "+8%",
      icon: <Clock className="w-5 h-5" />,
      color: "orange",
    },
    {
      title: "Vencendo Hoje",
      value: "7",
      change: "+2",
      icon: <AlertCircle className="w-5 h-5" />,
      color: "red",
    },
    {
      title: "Concluídas",
      value: "89",
      change: "+15%",
      icon: <Target className="w-5 h-5" />,
      color: "green",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "review":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "legal":
        return <Building className="w-4 h-4" />;
      case "financial":
        return <Target className="w-4 h-4" />;
      case "hr":
        return <Users className="w-4 h-4" />;
      case "it":
        return <Workflow className="w-4 h-4" />;
      default:
        return <CheckSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-blue-600" />
              Tarefas Gerenciais
            </h1>
            <p className="text-gray-600 mt-1">
              Gestão de tarefas administrativas e workflows corporativos
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nova Tarefa
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    stat.color === "blue" && "bg-blue-100 text-blue-600",
                    stat.color === "orange" && "bg-orange-100 text-orange-600",
                    stat.color === "red" && "bg-red-100 text-red-600",
                    stat.color === "green" && "bg-green-100 text-green-600",
                  )}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-xs text-green-600 font-medium">
                    {stat.change}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* View Mode Toggle */}
          <div className="flex rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode("kanban")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                viewMode === "kanban"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100",
              )}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100",
              )}
            >
              Lista
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                viewMode === "calendar"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100",
              )}
            >
              Calendário
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar tarefas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os Status</option>
            <option value="pending">Pendente</option>
            <option value="in_progress">Em Andamento</option>
            <option value="review">Em Revisão</option>
            <option value="completed">Concluído</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {viewMode === "list" && (
            <div className="space-y-4">
              {tasks.map((task) => (
                <Card
                  key={task.id}
                  className="p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0 mt-1">
                          {getCategoryIcon(task.category)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {task.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {task.description}
                          </p>

                          {/* Meta info */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority === "urgent"
                                ? "Urgente"
                                : task.priority === "high"
                                  ? "Alta"
                                  : task.priority === "medium"
                                    ? "Média"
                                    : "Baixa"}
                            </Badge>

                            <Badge className={getStatusColor(task.status)}>
                              {task.status === "pending"
                                ? "Pendente"
                                : task.status === "in_progress"
                                  ? "Em Andamento"
                                  : task.status === "review"
                                    ? "Em Revisão"
                                    : "Concluído"}
                            </Badge>

                            <Badge variant="outline">{task.department}</Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {task.assignee}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {task.dueDate.toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-80 space-y-3">
                      {/* Progress */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Progresso
                          </span>
                          <span className="text-sm text-gray-500">
                            {task.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          Editar
                        </Button>
                        <Button size="sm" variant="outline">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Placeholder for other view modes */}
          {viewMode === "kanban" && (
            <div className="text-center py-12">
              <Workflow className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Visualização Kanban
              </h3>
              <p className="text-gray-600">Visualização em desenvolvimento</p>
            </div>
          )}

          {viewMode === "calendar" && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Visualização Calendário
              </h3>
              <p className="text-gray-600">Visualização em desenvolvimento</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
