/**
 * 🎯 MODERN DASHBOARD - DASHBOARD MODERNO
 *
 * Dashboard baseado na imagem fornecida com:
 * - Cards de métricas principais
 * - Tarefas recentes
 * - Atividades recentes
 * - Próximos eventos
 * - Design compacto e moderno
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Scale,
  DollarSign,
  CheckSquare,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  MoreVertical,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types
interface MetricCard {
  id: string;
  title: string;
  value: string;
  trend: number;
  trendLabel: string;
  progress: number;
  progressLabel: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bgColor: string;
}

interface RecentTask {
  id: string;
  title: string;
  client: string;
  dueDate: string;
  priority: "alta" | "media" | "baixa";
  status: "pendente" | "em_andamento" | "concluida";
}

interface RecentActivity {
  id: string;
  type: "client" | "process" | "task" | "document";
  title: string;
  description: string;
  timestamp: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface UpcomingEvent {
  id: string;
  title: string;
  time: string;
  type: "reuniao" | "audiencia" | "prazo";
  priority: "alta" | "media" | "baixa";
}

// Mock Data
const METRICS: MetricCard[] = [
  {
    id: "clients",
    title: "Clientes",
    value: "1,234",
    trend: 12,
    trendLabel: "+12%",
    progress: 82,
    progressLabel: "Meta: 1.500",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
  {
    id: "processes",
    title: "Processos",
    value: "892",
    trend: 8,
    trendLabel: "+8%",
    progress: 89,
    progressLabel: "Meta: 1.000",
    icon: Scale,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950",
  },
  {
    id: "revenue",
    title: "Receita",
    value: "R$ 284k",
    trend: 23,
    trendLabel: "+23%",
    progress: 95,
    progressLabel: "Meta: 300.000",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950",
  },
  {
    id: "tasks",
    title: "Tarefas",
    value: "47",
    trend: -5,
    trendLabel: "-5%",
    progress: 75,
    progressLabel: "Meta: 20",
    icon: CheckSquare,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950",
  },
];

const RECENT_TASKS: RecentTask[] = [
  {
    id: "1",
    title: "Revisar contrato João Silva",
    client: "João Silva",
    dueDate: "2024-01-25",
    priority: "alta",
    status: "pendente",
  },
  {
    id: "2",
    title: "Audiência Processo 1234567",
    client: "Maria Santos",
    dueDate: "2024-01-26",
    priority: "alta",
    status: "em_andamento",
  },
  {
    id: "3",
    title: "Análise de documentos GED",
    client: "Empresa XYZ",
    dueDate: "2024-01-27",
    priority: "media",
    status: "em_andamento",
  },
  {
    id: "4",
    title: "Preparar petição inicial",
    client: "Carlos Oliveira",
    dueDate: "2024-01-28",
    priority: "alta",
    status: "pendente",
  },
];

const RECENT_ACTIVITIES: RecentActivity[] = [
  {
    id: "1",
    type: "client",
    title: "Novo cliente cadastrado",
    description: "João Silva",
    timestamp: "há 2 min",
    icon: Users,
  },
  {
    id: "2",
    type: "process",
    title: "Processo atualizado",
    description: "1234567-88.2024",
    timestamp: "há 5 min",
    icon: Scale,
  },
  {
    id: "3",
    type: "task",
    title: "Tarefa concluída",
    description: "Análise de contrato",
    timestamp: "há 10 min",
    icon: CheckSquare,
  },
  {
    id: "4",
    type: "document",
    title: "Documento adicionado ao GED",
    description: "Contrato_Prestacao_Servicos.pdf",
    timestamp: "há 15 min",
    icon: FileText,
  },
];

const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    id: "1",
    title: "Reunião com João Silva",
    time: "23:01 às 10:00",
    type: "reuniao",
    priority: "media",
  },
  {
    id: "2",
    title: "Audiência Processo 1234567",
    time: "25:01 às 14:30",
    type: "audiencia",
    priority: "alta",
  },
  {
    id: "3",
    title: "Prazo para recurso",
    time: "27:01 às 23:59",
    type: "prazo",
    priority: "alta",
  },
];

// Utility Functions
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "alta":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "media":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "baixa":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "concluida":
      return <CheckCircle size={16} className="text-green-600" />;
    case "em_andamento":
      return <Clock size={16} className="text-blue-600" />;
    case "pendente":
      return <AlertCircle size={16} className="text-amber-600" />;
    default:
      return <XCircle size={16} className="text-gray-600" />;
  }
};

// Main Component
export const ModernDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToModule = (module: string) => {
    navigate(module);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Painel de Controle
          </h1>
          <p className="text-muted-foreground">
            Visão geral das atividades do escritório
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={() => navigate("/agenda-juridica")}
            variant="outline"
            size="sm"
          >
            <Calendar size={16} className="mr-2" />
            Agenda
          </Button>
          <Button
            onClick={() => navigate("/crm-juridico")}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus size={16} className="mr-2" />
            CRM
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {METRICS.map((metric) => {
          const Icon = metric.icon;
          const isPositiveTrend = metric.trend > 0;

          return (
            <Card
              key={metric.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                if (metric.id === "clients") navigate("/crm-juridico/clientes");
                else if (metric.id === "processes")
                  navigate("/processos-publicacoes");
                else if (metric.id === "revenue")
                  navigate("/contratos-financeiro");
                else if (metric.id === "tasks")
                  navigate("/crm-juridico/tarefas");
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon size={16} className={metric.color} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center space-x-1">
                    {isPositiveTrend ? (
                      <TrendingUp size={14} className="text-green-600" />
                    ) : (
                      <TrendingDown size={14} className="text-red-600" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        isPositiveTrend ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {metric.trendLabel}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Progress value={metric.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {metric.progressLabel} • {metric.progress}%
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Tarefas Recentes
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Ver todas</DropdownMenuItem>
                <DropdownMenuItem>Nova tarefa</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="space-y-3">
            {RECENT_TASKS.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:bg-accent/40 transition-colors cursor-pointer"
                onClick={() => navigate("/crm-juridico/tarefas")}
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(task.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.client} • {task.dueDate}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={`${getPriorityColor(task.priority)} text-xs`}
                >
                  {task.priority}
                </Badge>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-3"
              onClick={() => navigate("/crm-juridico/tarefas")}
            >
              Ver todas as tarefas
              <ArrowRight size={14} className="ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {RECENT_ACTIVITIES.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-accent/40">
                    <Icon size={14} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Próximos Eventos
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/agenda-juridica")}
            >
              <Plus size={16} />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {UPCOMING_EVENTS.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:bg-accent/40 transition-colors cursor-pointer"
                onClick={() => navigate("/agenda-juridica")}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-8 bg-primary rounded-full" />
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.time}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={`${getPriorityColor(event.priority)} text-xs`}
                >
                  {event.priority}
                </Badge>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-3"
              onClick={() => navigate("/agenda-juridica")}
            >
              Ver agenda completa
              <ArrowRight size={14} className="ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModernDashboard;
