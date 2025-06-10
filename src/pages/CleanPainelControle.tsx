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

// Diagnostic Widget
import DiagnosticoAlert from "@/components/ActionPlan/DiagnosticoAlert";

// Types
interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    direction: "up" | "down";
    period: string;
  };
  status: "success" | "warning" | "error" | "info";
  actionUrl: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
  color: string;
  badge?: string;
}

interface WidgetData {
  id: string;
  title: string;
  value: string;
  description: string;
  color: string;
}

// Memoized Metric Card Component
const MetricCardComponent = memo(({ metric }: { metric: MetricCard }) => {
  const navigate = useNavigate();
  const Icon = metric.icon;

  const handleClick = useCallback(() => {
    navigate(metric.actionUrl);
  }, [navigate, metric.actionUrl]);

  const getStatusColors = (status: string) => {
    switch (status) {
      case "success":
        return {
          iconBg: "bg-green-50 dark:bg-green-950",
          iconColor: "text-green-600",
        };
      case "warning":
        return {
          iconBg: "bg-amber-50 dark:bg-amber-950",
          iconColor: "text-amber-600",
        };
      case "error":
        return {
          iconBg: "bg-red-50 dark:bg-red-950",
          iconColor: "text-red-600",
        };
      default:
        return {
          iconBg: "bg-blue-50 dark:bg-blue-950",
          iconColor: "text-blue-600",
        };
    }
  };

  const colors = getStatusColors(metric.status);

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200 group"
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {metric.title}
        </CardTitle>
        <div
          className={`p-2 rounded-lg ${colors.iconBg} group-hover:scale-110 transition-transform`}
        >
          <Icon className={`h-5 w-5 ${colors.iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{metric.value}</div>
        {metric.subtitle && (
          <p className="text-xs text-muted-foreground mb-2">
            {metric.subtitle}
          </p>
        )}
        {metric.trend && (
          <div className="flex items-center space-x-1">
            {metric.trend.direction === "up" ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span
              className={`text-xs font-medium ${
                metric.trend.direction === "up"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {metric.trend.value}%
            </span>
            <span className="text-xs text-muted-foreground">
              {metric.trend.period}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

// Memoized Quick Action Component
const QuickActionCard = memo(({ action }: { action: QuickAction }) => {
  const navigate = useNavigate();
  const Icon = action.icon;

  const handleClick = useCallback(() => {
    navigate(action.url);
  }, [navigate, action.url]);

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-all duration-200 group"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}
          >
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">{action.title}</p>
              {action.badge && (
                <Badge variant="secondary" className="text-xs">
                  {action.badge}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {action.description}
            </p>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </CardContent>
    </Card>
  );
});

const CleanPainelControle: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Optimized metrics with useMemo
  const metricas = useMemo(
    (): MetricCard[] => [
      {
        id: "clientes",
        title: "Clientes Ativos",
        value: "1,247",
        subtitle: "Total cadastrados",
        icon: Users,
        trend: {
          value: 12.5,
          direction: "up",
          period: "vs mês anterior",
        },
        status: "success",
        actionUrl: "/crm",
      },
      {
        id: "processos",
        title: "Processos em Andamento",
        value: "342",
        subtitle: "Requerem atenção",
        icon: Scale,
        trend: {
          value: 3.2,
          direction: "down",
          period: "vs semana anterior",
        },
        status: "info",
        actionUrl: "/crm/processos",
      },
      {
        id: "receita",
        title: "Receita Mensal",
        value: "R$ 284.500",
        subtitle: "Faturamento atual",
        icon: DollarSign,
        trend: {
          value: 18.7,
          direction: "up",
          period: "vs mês anterior",
        },
        status: "success",
        actionUrl: "/financeiro",
      },
      {
        id: "tarefas",
        title: "Tarefas Pendentes",
        value: "47",
        subtitle: "Vencendo hoje",
        icon: CheckSquare,
        trend: {
          value: 8.3,
          direction: "up",
          period: "vs ontem",
        },
        status: "warning",
        actionUrl: "/crm/tarefas",
      },
    ],
    [],
  );

  const quickActions = useMemo(
    (): QuickAction[] => [
      {
        id: "new-client",
        title: "Novo Cliente",
        description: "Cadastrar novo cliente",
        icon: Users,
        url: "/crm/clientes?action=new",
        color: "bg-blue-500",
      },
      {
        id: "new-task",
        title: "Nova Tarefa",
        description: "Criar nova tarefa",
        icon: CheckSquare,
        url: "/crm/tarefas?action=new",
        color: "bg-green-500",
      },
      {
        id: "agenda",
        title: "Agenda",
        description: "Ver compromissos",
        icon: Calendar,
        url: "/agenda",
        color: "bg-orange-500",
        badge: "3 hoje",
      },
      {
        id: "ged",
        title: "Documentos",
        description: "Acessar GED",
        icon: FileText,
        url: "/ged",
        color: "bg-purple-500",
      },
      {
        id: "notifications",
        title: "Publicações",
        description: "Ver intimações",
        icon: Bell,
        url: "/publicacoes",
        color: "bg-red-500",
        badge: "2 novas",
      },
      {
        id: "ai",
        title: "IA Jurídica",
        description: "Assistente inteligente",
        icon: Zap,
        url: "/ai",
        color: "bg-indigo-500",
      },
      {
        id: "diagnostico-conclusao",
        title: "Diagnóstico de Conclusão",
        description: "Análise completa do sistema",
        icon: Activity,
        url: "/diagnostico-conclusao",
        color: "bg-emerald-500",
        badge: "Novo",
      },
    ],
    [],
  );

  const widgets = useMemo(
    (): WidgetData[] => [
      {
        id: "analytics",
        title: "Analytics e dashboards",
        value: "Sistema de Business Intelligence",
        description:
          "Relatórios avançados, gráficos interativos e métricas em tempo real",
        color: "bg-purple-500",
      },
      {
        id: "automation",
        title: "Automação Inteligente",
        value: "IA Jurídica Integrada",
        description:
          "Assistente virtual, análise de documentos e automação de processos",
        color: "bg-indigo-500",
      },
      {
        id: "collaboration",
        title: "Colaboração em Equipe",
        value: "Workspace Unificado",
        description:
          "Chat integrado, compartilhamento de arquivos e gestão de projetos",
        color: "bg-green-500",
      },
      {
        id: "security",
        title: "Segurança e Compliance",
        value: "LGPD & Auditoria",
        description:
          "Criptografia end-to-end, logs de auditoria e conformidade regulatória",
        color: "bg-red-500",
      },
    ],
    [],
  );

  // Data loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Auto-refresh simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Manual refresh handler
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLastUpdated(new Date());
    setIsRefreshing(false);

    toast({
      title: "Dashboard atualizado",
      description: "Dados atualizados com sucesso",
    });
  }, [toast]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Painel de Controle
          </h1>
          <p className="text-muted-foreground">
            Visão geral do escritório • Última atualização:{" "}
            {lastUpdated.toLocaleTimeString("pt-BR")}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="gap-1">
            <Activity className="h-3 w-3" />
            Sistema Online
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricas.map((metric) => (
          <MetricCardComponent key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Diagnostic Alert Widget */}
      <DiagnosticoAlert />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <QuickActionCard key={action.id} action={action} />
            ))}
          </CardContent>
        </Card>

        {/* System Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Visão Geral do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Taxa de Sucesso</span>
                  <span className="font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Satisfação Cliente</span>
                  <span className="font-medium">96%</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Eficiência IA</span>
                  <span className="font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>SLA Médio</span>
                  <span className="font-medium">84%</span>
                </div>
                <Progress value={84} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgets.map((widget) => (
          <Card
            key={widget.id}
            className="cursor-pointer hover:shadow-md transition-all duration-200 group"
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div
                  className={`p-3 rounded-lg ${widget.color} group-hover:scale-110 transition-transform`}
                >
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-sm">{widget.title}</h3>
                  <p className="text-xs font-medium text-muted-foreground">
                    {widget.value}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {widget.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Resumo de Atividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Hoje</span>
                <Badge variant="outline">24 atividades</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                3 novos clientes, 8 tarefas concluídas, 2 processos atualizados
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Esta Semana
                </span>
                <Badge variant="outline">156 atividades</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                18 novos clientes, 45 tarefas, 12 audiências realizadas
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Este Mês</span>
                <Badge variant="outline">892 atividades</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                78 novos clientes, 234 tarefas, 56 processos finalizados
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Add display name for debugging
CleanPainelControle.displayName = "CleanPainelControle";

export default memo(CleanPainelControle);
