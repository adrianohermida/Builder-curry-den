/**
 * 📊 PAINEL DE CONTROLE - PÁGINA PRINCIPAL
 *
 * Dashboard principal como mostrado na imagem:
 * - 4 cards de métricas no topo
 * - Seções: Tarefas Recentes, Atividades Recentes, Próximos Eventos
 * - Design fiel à imagem fornecida
 */

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Scale,
  DollarSign,
  CheckSquare,
  Calendar,
  Eye,
  Plus,
  ChevronRight,
  Clock,
  User,
  FileText,
  FolderOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MetricCard {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  meta: string;
  progress: number;
  icon: React.ReactNode;
  iconColor: string;
}

interface Task {
  id: string;
  title: string;
  client: string;
  date: string;
  priority: "alta" | "media" | "baixa";
  status: "pendente" | "agendada" | "em_andamento";
}

interface Activity {
  id: string;
  type: "client" | "process" | "task" | "document";
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "reuniao" | "audiencia" | "prazo";
}

export const PainelControle: React.FC = () => {
  // Métricas do dashboard
  const metrics: MetricCard[] = [
    {
      title: "Clientes",
      value: "1,234",
      change: "+12%",
      changeType: "positive",
      meta: "Meta: 1.500",
      progress: 82,
      icon: <Users className="w-6 h-6" />,
      iconColor: "text-blue-600",
    },
    {
      title: "Processos",
      value: "892",
      change: "+8%",
      changeType: "positive",
      meta: "Meta: 1.000",
      progress: 89,
      icon: <Scale className="w-6 h-6" />,
      iconColor: "text-blue-600",
    },
    {
      title: "Receita",
      value: "R$ 284k",
      change: "+22%",
      changeType: "positive",
      meta: "Meta: 300.000",
      progress: 95,
      icon: <DollarSign className="w-6 h-6" />,
      iconColor: "text-blue-600",
    },
    {
      title: "Tarefas",
      value: "47",
      change: "-5%",
      changeType: "negative",
      meta: "Meta: 30",
      progress: 157,
      icon: <CheckSquare className="w-6 h-6" />,
      iconColor: "text-blue-600",
    },
  ];

  // Tarefas recentes
  const recentTasks: Task[] = [
    {
      id: "1",
      title: "Revisar contrato João Silva",
      client: "João Silva",
      date: "2024-01-25",
      priority: "alta",
      status: "pendente",
    },
    {
      id: "2",
      title: "Audiência Processo 1234567",
      client: "Maria Santos",
      date: "2024-01-26",
      priority: "alta",
      status: "agendada",
    },
    {
      id: "3",
      title: "Análise de documentos GED",
      client: "Empresa XYZ",
      date: "2024-01-27",
      priority: "media",
      status: "em_andamento",
    },
    {
      id: "4",
      title: "Preparar petição inicial",
      client: "Carlos Oliveira",
      date: "2024-01-28",
      priority: "alta",
      status: "pendente",
    },
  ];

  // Atividades recentes
  const recentActivities: Activity[] = [
    {
      id: "1",
      type: "client",
      title: "Novo cliente cadastrado: João Silva",
      description: "",
      time: "2h",
      icon: <User className="w-4 h-4" />,
    },
    {
      id: "2",
      type: "process",
      title: "Processo atualizado: 1234567-89.2024",
      description: "",
      time: "4h",
      icon: <Scale className="w-4 h-4" />,
    },
    {
      id: "3",
      type: "task",
      title: "Tarefa concluída: Análise de contrato",
      description: "",
      time: "6h",
      icon: <CheckSquare className="w-4 h-4" />,
    },
    {
      id: "4",
      type: "document",
      title: "Documento adicionado ao GED",
      description: "",
      time: "1d",
      icon: <FolderOpen className="w-4 h-4" />,
    },
  ];

  // Próximos eventos
  const upcomingEvents: Event[] = [
    {
      id: "1",
      title: "Reunião com João Silva",
      date: "25/01",
      time: "14:00",
      type: "reuniao",
    },
    {
      id: "2",
      title: "Audiência Processo 1234567",
      date: "26/01",
      time: "10:30",
      type: "audiencia",
    },
    {
      id: "3",
      title: "Prazo para recurso",
      date: "27/01",
      time: "23:59",
      type: "prazo",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "bg-red-100 text-red-800";
      case "media":
        return "bg-yellow-100 text-yellow-800";
      case "baixa":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "bg-orange-100 text-orange-800";
      case "agendada":
        return "bg-green-100 text-green-800";
      case "em_andamento":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "reuniao":
        return "bg-blue-100 text-blue-800";
      case "audiencia":
        return "bg-red-100 text-red-800";
      case "prazo":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header com botões */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Painel de Controle
          </h1>
          <p className="text-gray-600">
            Visão geral das atividades do escritório
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Agenda
          </Button>
          <Button className="gap-2">
            <Users className="w-4 h-4" />
            CRM
          </Button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {metric.value}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "p-2 rounded-lg bg-blue-50",
                      metric.iconColor,
                    )}
                  >
                    {metric.icon}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className={cn(
                        "font-medium",
                        metric.changeType === "positive"
                          ? "text-green-600"
                          : "text-red-600",
                      )}
                    >
                      {metric.change}
                    </span>
                    <span className="text-gray-500">{metric.progress}%</span>
                  </div>
                  <Progress
                    value={metric.progress}
                    className="h-2"
                    max={metric.progress > 100 ? metric.progress : 100}
                  />
                  <p className="text-xs text-gray-500">{metric.meta}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Seções Inferiores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tarefas Recentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Tarefas Recentes
            </CardTitle>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {task.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {task.client} • {task.date}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge
                      variant="secondary"
                      className={cn("text-xs", getPriorityColor(task.priority))}
                    >
                      {task.priority}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={cn("text-xs", getStatusColor(task.status))}
                    >
                      {task.status}
                    </Badge>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Atividades Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">{activity.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Próximos Eventos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Próximos Eventos
            </CardTitle>
            <Button variant="ghost" size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">
                      {event.date} às {event.time}
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs mt-2",
                      getEventTypeColor(event.type),
                    )}
                  >
                    {event.type}
                  </Badge>
                </div>
                <Clock className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PainelControle;
