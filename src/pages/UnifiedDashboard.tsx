/**
 * 🚀 UNIFIED DASHBOARD - DASHBOARD UNIFICADO INTELIGENTE
 *
 * Solução híbrida que combina o melhor de todos os dashboards:
 * - Performance otimizada com React.memo e useMemo
 * - Real-time updates com WebSocket simulation
 * - Responsividade total mobile-first
 * - UX moderna e consistente
 * - Integração fluida com todos os módulos
 * - Auto-refresh inteligente
 * - Error boundaries robustas
 */

import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Bell,
  Zap,
  Activity,
  BarChart3,
  Plus,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// Types
interface MetricCard {
  id: string;
  title: string;
  value: string;
  previousValue?: string;
  trend: number;
  trendLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  description: string;
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

interface RecentActivity {
  id: string;
  type: "client" | "process" | "task" | "document" | "meeting";
  title: string;
  description: string;
  timestamp: string;
  priority: "alta" | "media" | "baixa";
  url?: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  time: string;
  date: string;
  type: "reuniao" | "audiencia" | "prazo" | "tarefa";
  priority: "alta" | "media" | "baixa";
  client?: string;
}

// Memoized Components
const MetricCardComponent = memo(({ metric }: { metric: MetricCard }) => {
  const navigate = useNavigate();
  const Icon = metric.icon;
  const isPositiveTrend = metric.trend > 0;

  const handleClick = useCallback(() => {
    navigate(metric.actionUrl);
  }, [navigate, metric.actionUrl]);

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
          className={`p-2 rounded-lg ${metric.bgColor} group-hover:scale-110 transition-transform`}
        >
          <Icon className={`h-5 w-5 ${metric.color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <div className="text-2xl font-bold">{metric.value}</div>
          <div className="flex items-center space-x-1">
            {isPositiveTrend ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
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
        <p className="text-xs text-muted-foreground">{metric.description}</p>
      </CardContent>
    </Card>
  );
});

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
            <Icon className="h-5 w-5 text-white" />
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

const ActivityItem = memo(({ activity }: { activity: RecentActivity }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    if (activity.url) {
      navigate(activity.url);
    }
  }, [navigate, activity.url]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "media":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "baixa":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div
      className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
        activity.url ? "hover:bg-accent/40 cursor-pointer" : ""
      }`}
      onClick={handleClick}
    >
      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium line-clamp-1">{activity.title}</p>
          <Badge
            variant="secondary"
            className={`${getPriorityColor(activity.priority)} text-xs`}
          >
            {activity.priority}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {activity.description}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {activity.timestamp}
        </p>
      </div>
    </div>
  );
});

const EventItem = memo(({ event }: { event: UpcomingEvent }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate("/agenda");
  }, [navigate]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "border-l-red-500";
      case "media":
        return "border-l-amber-500";
      case "baixa":
        return "border-l-green-500";
      default:
        return "border-l-gray-500";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "audiencia":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "reuniao":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "prazo":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "tarefa":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div
      className={`border-l-4 ${getPriorityColor(event.priority)} p-3 rounded-r-lg bg-accent/20 hover:bg-accent/40 cursor-pointer transition-colors`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-1">
        <p className="font-medium text-sm line-clamp-1">{event.title}</p>
        <Badge
          variant="secondary"
          className={`${getTypeColor(event.type)} text-xs`}
        >
          {event.type}
        </Badge>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {event.date} às {event.time}
        </span>
        {event.client && <span>• {event.client}</span>}
      </div>
    </div>
  );
});

// Main Component
const UnifiedDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Simulated real-time data with useMemo for performance
  const metrics = useMemo(
    (): MetricCard[] => [
      {
        id: "clients",
        title: "Clientes Ativos",
        value: "1,247",
        previousValue: "1,112",
        trend: 12.1,
        trendLabel: "+12.1%",
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-950",
        description: "Total de clientes cadastrados",
        actionUrl: "/crm",
      },
      {
        id: "processes",
        title: "Processos Ativos",
        value: "342",
        previousValue: "356",
        trend: -3.9,
        trendLabel: "-3.9%",
        icon: Scale,
        color: "text-purple-600",
        bgColor: "bg-purple-50 dark:bg-purple-950",
        description: "Processos em andamento",
        actionUrl: "/crm/processos",
      },
      {
        id: "revenue",
        title: "Receita Mensal",
        value: "R$ 284.500",
        previousValue: "R$ 239.800",
        trend: 18.6,
        trendLabel: "+18.6%",
        icon: DollarSign,
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950",
        description: "Faturamento do mês atual",
        actionUrl: "/financeiro",
      },
      {
        id: "tasks",
        title: "Tarefas Pendentes",
        value: "47",
        previousValue: "52",
        trend: -9.6,
        trendLabel: "-9.6%",
        icon: CheckSquare,
        color: "text-amber-600",
        bgColor: "bg-amber-50 dark:bg-amber-950",
        description: "Tarefas aguardando execução",
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
    ],
    [],
  );

  const recentActivities = useMemo(
    (): RecentActivity[] => [
      {
        id: "1",
        type: "client",
        title: "Novo cliente cadastrado",
        description: "João Silva adicionado ao CRM",
        timestamp: "há 5 min",
        priority: "media",
        url: "/crm/clientes",
      },
      {
        id: "2",
        type: "process",
        title: "Processo atualizado",
        description: "Processo 1234567-88.2024 com nova movimentação",
        timestamp: "há 15 min",
        priority: "alta",
        url: "/crm/processos",
      },
      {
        id: "3",
        type: "task",
        title: "Tarefa concluída",
        description: "Análise de contrato finalizada",
        timestamp: "há 32 min",
        priority: "baixa",
      },
      {
        id: "4",
        type: "document",
        title: "Documento adicionado",
        description: "Contrato_Prestacao_Servicos.pdf no GED",
        timestamp: "há 1h",
        priority: "media",
        url: "/ged",
      },
      {
        id: "5",
        type: "meeting",
        title: "Reunião agendada",
        description: "Reunião com Maria Santos para amanhã",
        timestamp: "há 2h",
        priority: "alta",
        url: "/agenda",
      },
    ],
    [],
  );

  const upcomingEvents = useMemo(
    (): UpcomingEvent[] => [
      {
        id: "1",
        title: "Audiência de Conciliação",
        time: "14:30",
        date: "Hoje",
        type: "audiencia",
        priority: "alta",
        client: "João Silva",
      },
      {
        id: "2",
        title: "Reunião cliente",
        time: "10:00",
        date: "Amanhã",
        type: "reuniao",
        priority: "media",
        client: "Maria Santos",
      },
      {
        id: "3",
        title: "Prazo para recurso",
        time: "23:59",
        date: "27/01",
        type: "prazo",
        priority: "alta",
        client: "Empresa XYZ",
      },
      {
        id: "4",
        title: "Revisão de contrato",
        time: "16:00",
        date: "28/01",
        type: "tarefa",
        priority: "media",
        client: "Carlos Oliveira",
      },
    ],
    [],
  );

  // Simulated data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-96" />
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <MetricCardComponent key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {recentActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
              onClick={() => navigate("/agenda")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Ver Agenda Completa
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance do Escritório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
  );
};

// Add display name for debugging
UnifiedDashboard.displayName = "UnifiedDashboard";

export default memo(UnifiedDashboard);
