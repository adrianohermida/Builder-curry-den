import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Scale,
  FileText,
  Target,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Plus,
  Eye,
  Calendar,
  Clock,
  DollarSign,
  BarChart3,
  Activity,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Types
interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  color?: string;
}

interface RecentActivity {
  id: string;
  type: "client" | "process" | "task" | "meeting";
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

const CleanProfessionalDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Dados das métricas - SEM CORES EXCESSIVAS
  const metrics: MetricCard[] = [
    {
      id: "clients",
      title: "Clientes Ativos",
      value: 247,
      change: 12.5,
      icon: Users,
    },
    {
      id: "processes",
      title: "Processos",
      value: 89,
      change: 8.3,
      icon: Scale,
    },
    {
      id: "revenue",
      title: "Receita Mensal",
      value: "R$ 247K",
      change: -2.1,
      icon: DollarSign,
    },
    {
      id: "tasks",
      title: "Tarefas Pendentes",
      value: 23,
      change: -15.7,
      icon: Target,
    },
  ];

  // Atividades recentes
  const recentActivities: RecentActivity[] = [
    {
      id: "1",
      type: "client",
      title: "Novo cliente cadastrado",
      description: "Tech Solutions LTDA",
      timestamp: "2 min atrás",
      user: "Ana Costa",
    },
    {
      id: "2",
      type: "process",
      title: "Processo atualizado",
      description: "Ação trabalhista #2024-001",
      timestamp: "15 min atrás",
      user: "Carlos Lima",
    },
    {
      id: "3",
      type: "task",
      title: "Tarefa concluída",
      description: "Revisão contratual",
      timestamp: "1 hora atrás",
      user: "Pedro Oliveira",
    },
    {
      id: "4",
      type: "meeting",
      title: "Reunião agendada",
      description: "Consultoria jurídica - StartupTech",
      timestamp: "2 horas atrás",
      user: "Ana Costa",
    },
  ];

  // Quick actions - SIMPLES
  const quickActions = [
    {
      id: "new-client",
      label: "Novo Cliente",
      icon: Users,
      path: "/crm/clientes?action=new",
    },
    {
      id: "new-process",
      label: "Novo Processo",
      icon: Scale,
      path: "/crm/processos?action=new",
    },
    {
      id: "new-task",
      label: "Nova Tarefa",
      icon: Target,
      path: "/crm/tarefas?action=new",
    },
    {
      id: "schedule",
      label: "Agendar",
      icon: Calendar,
      path: "/agenda?action=new",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "client":
        return Users;
      case "process":
        return Scale;
      case "task":
        return Target;
      case "meeting":
        return Calendar;
      default:
        return Activity;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      {/* Header Limpo */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Visão geral do escritório jurídico
          </p>
        </div>

        {/* Quick Actions - SIMPLES */}
        <div className="flex gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              onClick={() => navigate(action.path)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <action.icon className="w-4 h-4" />
              <span className="hidden md:inline">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Métricas - DESIGN LIMPO */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {metric.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {metric.value}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <metric.icon className="w-6 h-6 text-gray-600" />
                  </div>
                </div>

                <div className="flex items-center mt-4 text-sm">
                  {metric.change > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span
                    className={cn(
                      "font-medium",
                      metric.change > 0 ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {Math.abs(metric.change)}%
                  </span>
                  <span className="text-gray-500 ml-1">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Grid Principal - LAYOUT LIMPO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Atividades Recentes */}
        <Card className="lg:col-span-2 border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center justify-between">
              <span className="text-gray-900">Atividades Recentes</span>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Eye className="w-4 h-4 mr-2" />
                Ver todas
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {recentActivities.map((activity, index) => {
                const IconComponent = getActivityIcon(activity.type);
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                        <IconComponent className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                          <span>{activity.timestamp}</span>
                          {activity.user && (
                            <>
                              <span>•</span>
                              <span>{activity.user}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Status e Próximas Ações */}
        <div className="space-y-6">
          {/* Status do Sistema */}
          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-gray-900">Status do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Produtividade</span>
                <span className="text-sm font-medium text-gray-900">92%</span>
              </div>
              <Progress value={92} className="h-2 bg-gray-200" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Tarefas Concluídas
                </span>
                <span className="text-sm font-medium text-gray-900">87%</span>
              </div>
              <Progress value={87} className="h-2 bg-gray-200" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">SLA Médio</span>
                <span className="text-sm font-medium text-gray-900">94%</span>
              </div>
              <Progress value={94} className="h-2 bg-gray-200" />
            </CardContent>
          </Card>

          {/* Próximas Ações */}
          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-gray-900">Próximas Ações</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Revisar contratos pendentes
                  </p>
                  <p className="text-xs text-gray-600">
                    3 contratos aguardando
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Agendar audiências
                  </p>
                  <p className="text-xs text-gray-600">2 processos urgentes</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Prazos próximos
                  </p>
                  <p className="text-xs text-gray-600">5 tarefas até amanhã</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acesso Rápido */}
          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-gray-900">Acesso Rápido</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/crm")}
                className="w-full justify-start text-gray-700 hover:bg-gray-100"
              >
                <Users className="w-4 h-4 mr-3" />
                CRM Completo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/relatorios")}
                className="w-full justify-start text-gray-700 hover:bg-gray-100"
              >
                <BarChart3 className="w-4 h-4 mr-3" />
                Relatórios
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/agenda")}
                className="w-full justify-start text-gray-700 hover:bg-gray-100"
              >
                <Calendar className="w-4 h-4 mr-3" />
                Agenda
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/configuracoes")}
                className="w-full justify-start text-gray-700 hover:bg-gray-100"
              >
                <Target className="w-4 h-4 mr-3" />
                Configurações
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CleanProfessionalDashboard;
