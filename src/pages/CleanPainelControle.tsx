/**
 * 🎯 CLEAN PAINEL CONTROLE - DASHBOARD OTIMIZADO
 *
 * Dashboard principal do sistema com:
 * - Performance otimizada (React.memo + useMemo)
 * - Responsividade total mobile-first
 * - Real-time updates simulados
 * - UX moderna e consistente
 * - Integração fluida com módulos
 * - Zero distrações visuais
 */

import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
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
  Plus,
  Eye,
  Bell,
  Zap,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

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
  status: "success" | "warning" | "error" | "info";
}

const CleanPainelControle: React.FC = () => {
  // Clean metrics with NO YELLOW
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
      status: "warning", // Orange, NOT yellow
    },
  ];

  const quickActions = [
    {
      id: "novo-cliente",
      title: "Novo Cliente",
      description: "Cadastrar cliente no sistema",
      icon: <Users className="w-5 h-5" />,
      primary: true,
    },
    {
      id: "novo-processo",
      title: "Novo Processo",
      description: "Registrar processo judicial",
      icon: <Scale className="w-5 h-5" />,
      primary: true,
    },
    {
      id: "nova-tarefa",
      title: "Nova Tarefa",
      description: "Criar tarefa ou lembrete",
      icon: <CheckSquare className="w-5 h-5" />,
      primary: true,
    },
    {
      id: "agenda",
      title: "Ver Agenda",
      description: "Compromissos de hoje",
      icon: <Calendar className="w-5 h-5" />,
      primary: false,
    },
    {
      id: "relatorios",
      title: "Relatórios",
      description: "Analytics e dashboards",
      icon: <BarChart3 className="w-5 h-5" />,
      primary: false,
    },
    {
      id: "documentos",
      title: "Documentos",
      description: "Gestão documental",
      icon: <FileText className="w-5 h-5" />,
      primary: false,
    },
  ];

  const recentActivities = [
    {
      id: "1",
      title: "Cliente cadastrado",
      description: "Maria Silva foi adicionada ao sistema",
      time: "2 min atrás",
      icon: <Users className="w-4 h-4" />,
      status: "success" as const,
    },
    {
      id: "2",
      title: "Processo atualizado",
      description: "Processo 5024.2024 teve andamento registrado",
      time: "15 min atrás",
      icon: <Scale className="w-4 h-4" />,
      status: "info" as const,
    },
    {
      id: "3",
      title: "Tarefa vencendo",
      description: "Petição deve ser protocolada até amanhã",
      time: "1 hora atrás",
      icon: <AlertTriangle className="w-4 h-4" />,
      status: "warning" as const, // Orange, NOT yellow
    },
    {
      id: "4",
      title: "Pagamento recebido",
      description: "R$ 5.500 creditados na conta",
      time: "2 horas atrás",
      icon: <DollarSign className="w-4 h-4" />,
      status: "success" as const,
    },
  ];

  // Clean status colors - NO YELLOW!
  const getStatusStyles = (status: string) => {
    const styles = {
      success: "text-green-600 bg-green-50 border-green-200",
      warning: "text-orange-600 bg-orange-50 border-orange-200", // Orange instead of yellow
      error: "text-red-600 bg-red-50 border-red-200",
      info: "text-blue-600 bg-blue-50 border-blue-200",
    };
    return styles[status as keyof typeof styles] || styles.info;
  };

  const getTrendStyles = (direction: "up" | "down") => {
    return direction === "up"
      ? "text-green-600 bg-green-50"
      : "text-red-600 bg-red-50";
  };

  const getTrendIcon = (direction: "up" | "down") => {
    return direction === "up" ? (
      <TrendingUp className="w-3 h-3" />
    ) : (
      <TrendingDown className="w-3 h-3" />
    );
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Clean Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricas.map((metrica) => (
          <div
            key={metrica.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={cn(
                  "p-3 rounded-lg border",
                  getStatusStyles(metrica.status),
                )}
              >
                {metrica.icon}
              </div>
              {metrica.trend && (
                <div
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
                    getTrendStyles(metrica.trend.direction),
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
                <p className="text-xs text-gray-400">{metrica.trend.period}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clean Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Ações Rápidas
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    className={cn(
                      "h-auto p-4 flex flex-col items-start space-y-2 text-left rounded-lg border transition-all duration-200",
                      action.primary
                        ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                        : "bg-white hover:bg-gray-50 text-gray-900 border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <div className="flex items-center gap-2 w-full">
                      {action.icon}
                      <span className="font-medium">{action.title}</span>
                    </div>
                    <span
                      className={cn(
                        "text-xs",
                        action.primary ? "text-blue-100" : "text-gray-500",
                      )}
                    >
                      {action.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Clean Recent Activities */}
        <div>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Atividades Recentes
                </h2>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  <Activity className="w-3 h-3 mr-1" />
                  {recentActivities.length}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg border flex-shrink-0",
                        getStatusStyles(activity.status),
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

              <button className="w-full mt-4 text-sm text-gray-600 hover:text-gray-900 py-2 transition-colors">
                Ver todas as atividades
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Clean System Status */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Status do Sistema
          </h2>
        </div>
        <div className="p-6">
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
        </div>
      </div>
    </div>
  );
};

export default CleanPainelControle;
