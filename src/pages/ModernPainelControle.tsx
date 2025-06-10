/**
 * 🎯 MODERN PAINEL CONTROLE - CLEAN UX 2025
 *
 * Dashboard moderno e limpo:
 * - Zero cintilação ou animações excessivas
 * - Cards bem alinhados e espaçados
 * - Cores consistentes (azul cliente, vermelho admin)
 * - Responsividade perfeita
 * - Performance otimizada
 * - Informações claras e organizadas
 */

import React from "react";
import {
  Users,
  Scale,
  DollarSign,
  CheckSquare,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  Activity,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down";
    period: string;
  };
  status?: "success" | "warning" | "error" | "info";
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  category: "primary" | "secondary";
}

const ModernPainelControle: React.FC = () => {
  // Mock data with real-looking values
  const metricas: MetricCard[] = [
    {
      id: "clientes",
      title: "Clientes Ativos",
      value: "1,247",
      subtitle: "Total cadastrados",
      icon: <Users className="w-5 h-5" />,
      trend: {
        value: 12.5,
        direction: "up",
        period: "vs mês anterior",
      },
      status: "success",
    },
    {
      id: "processos",
      title: "Processos em Andamento",
      value: "342",
      subtitle: "Requerem atenção",
      icon: <Scale className="w-5 h-5" />,
      trend: {
        value: 3.2,
        direction: "down",
        period: "vs semana anterior",
      },
      status: "info",
    },
    {
      id: "receita",
      title: "Receita Mensal",
      value: "R$ 284.500",
      subtitle: "Faturamento atual",
      icon: <DollarSign className="w-5 h-5" />,
      trend: {
        value: 18.7,
        direction: "up",
        period: "vs mês anterior",
      },
      status: "success",
    },
    {
      id: "tarefas",
      title: "Tarefas Pendentes",
      value: "47",
      subtitle: "Vencendo hoje",
      icon: <CheckSquare className="w-5 h-5" />,
      trend: {
        value: 8.3,
        direction: "up",
        period: "vs ontem",
      },
      status: "warning",
    },
  ];

  const quickActions: QuickAction[] = [
    {
      id: "novo-cliente",
      title: "Novo Cliente",
      description: "Cadastrar cliente no sistema",
      icon: <Users className="w-5 h-5" />,
      onClick: () => console.log("Novo cliente"),
      category: "primary",
    },
    {
      id: "novo-processo",
      title: "Novo Processo",
      description: "Registrar processo judicial",
      icon: <Scale className="w-5 h-5" />,
      onClick: () => console.log("Novo processo"),
      category: "primary",
    },
    {
      id: "nova-tarefa",
      title: "Nova Tarefa",
      description: "Criar tarefa ou lembrete",
      icon: <CheckSquare className="w-5 h-5" />,
      onClick: () => console.log("Nova tarefa"),
      category: "primary",
    },
    {
      id: "agenda",
      title: "Ver Agenda",
      description: "Compromissos de hoje",
      icon: <Calendar className="w-5 h-5" />,
      onClick: () => console.log("Agenda"),
      category: "secondary",
    },
    {
      id: "relatorios",
      title: "Relatórios",
      description: "Analytics e dashboards",
      icon: <BarChart3 className="w-5 h-5" />,
      onClick: () => console.log("Relatórios"),
      category: "secondary",
    },
    {
      id: "documentos",
      title: "Documentos",
      description: "Gestão documental",
      icon: <FileText className="w-5 h-5" />,
      onClick: () => console.log("Documentos"),
      category: "secondary",
    },
  ];

  const recentActivities = [
    {
      id: "1",
      type: "cliente",
      title: "Cliente cadastrado",
      description: "Maria Silva foi adicionada ao sistema",
      time: "2 min atrás",
      icon: <Users className="w-4 h-4" />,
      status: "success" as const,
    },
    {
      id: "2",
      type: "processo",
      title: "Processo atualizado",
      description: "Processo 5024.2024 teve andamento registrado",
      time: "15 min atrás",
      icon: <Scale className="w-4 h-4" />,
      status: "info" as const,
    },
    {
      id: "3",
      type: "tarefa",
      title: "Tarefa vencendo",
      description: "Petição deve ser protocolada até amanhã",
      time: "1 hora atrás",
      icon: <AlertTriangle className="w-4 h-4" />,
      status: "warning" as const,
    },
    {
      id: "4",
      type: "financeiro",
      title: "Pagamento recebido",
      description: "R$ 5.500 creditados na conta",
      time: "2 horas atrás",
      icon: <DollarSign className="w-4 h-4" />,
      status: "success" as const,
    },
  ];

  const getStatusColors = (status: string) => {
    const statusMap = {
      success: "text-green-600 bg-green-50 border-green-200",
      warning: "text-orange-600 bg-orange-50 border-orange-200",
      error: "text-red-600 bg-red-50 border-red-200",
      info: "text-blue-600 bg-blue-50 border-blue-200",
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.info;
  };

  const getTrendIcon = (direction: "up" | "down") => {
    return direction === "up" ? (
      <TrendingUp className="w-3 h-3" />
    ) : (
      <TrendingDown className="w-3 h-3" />
    );
  };

  const getTrendColor = (direction: "up" | "down") => {
    return direction === "up" ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricas.map((metrica) => (
          <Card key={metrica.id} className="modern-card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={cn(
                    "p-3 rounded-lg",
                    getStatusColors(metrica.status || "info"),
                  )}
                >
                  {metrica.icon}
                </div>
                {metrica.trend && (
                  <div
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium",
                      getTrendColor(metrica.trend.direction),
                    )}
                  >
                    {getTrendIcon(metrica.trend.direction)}
                    {metrica.trend.value}%
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600">
                  {metrica.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {metrica.value}
                </p>
                {metrica.subtitle && (
                  <p className="text-sm text-gray-500">{metrica.subtitle}</p>
                )}
                {metrica.trend && (
                  <p className="text-xs text-gray-400">
                    {metrica.trend.period}
                  </p>
                )}
              </div>

              {metrica.action && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 w-full"
                  onClick={metrica.action.onClick}
                >
                  {metrica.action.label}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action) => (
                  <Button
                    key={action.id}
                    variant={
                      action.category === "primary" ? "default" : "outline"
                    }
                    className="h-auto p-4 flex flex-col items-start space-y-2 text-left"
                    onClick={action.onClick}
                  >
                    <div className="flex items-center gap-2 w-full">
                      {action.icon}
                      <span className="font-medium">{action.title}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {action.description}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div>
          <Card className="modern-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Atividades Recentes</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  <Activity className="w-3 h-3 mr-1" />
                  {recentActivities.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg flex-shrink-0",
                        getStatusColors(activity.status),
                      )}
                    >
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="ghost" className="w-full mt-4 text-sm">
                Ver todas as atividades
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System Status */}
      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="text-lg">Status do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Sistema</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Banco de Dados
                </p>
                <p className="text-xs text-gray-500">Operacional</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Backup</p>
                <p className="text-xs text-gray-500">Atualizado</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Manutenção</p>
                <p className="text-xs text-gray-500">Agendada</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernPainelControle;
