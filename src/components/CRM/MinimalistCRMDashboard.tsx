import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  Link,
  Star,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  Scale,
  FileText,
  Target,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pause,
  Play,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Types
interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ElementType;
  color: string;
}

interface KanbanItem {
  id: string;
  title: string;
  subtitle?: string;
  status: string;
  priority: "low" | "medium" | "high";
  assignee?: {
    name: string;
    avatar?: string;
  };
  dueDate?: string;
  tags?: string[];
  value?: number;
  progress?: number;
}

interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanItem[];
  color: string;
  limit?: number;
}

interface CollapsibleWidget {
  id: string;
  title: string;
  subtitle?: string;
  isCollapsed: boolean;
  canCollapse: boolean;
  priority: "high" | "medium" | "low";
}

const MinimalistCRMDashboard: React.FC = () => {
  // State for collapsible widgets
  const [widgets, setWidgets] = useState<CollapsibleWidget[]>([
    {
      id: "metrics",
      title: "Métricas-Chave",
      subtitle: "Visão geral do período",
      isCollapsed: false,
      canCollapse: true,
      priority: "high",
    },
    {
      id: "clients",
      title: "Pipeline de Clientes",
      subtitle: "Fluxo de vendas",
      isCollapsed: false,
      canCollapse: true,
      priority: "high",
    },
    {
      id: "processes",
      title: "Casos e Processos",
      subtitle: "Status dos processos",
      isCollapsed: false,
      canCollapse: true,
      priority: "medium",
    },
    {
      id: "tasks",
      title: "Tarefas Prioritárias",
      subtitle: "Ações pendentes",
      isCollapsed: false,
      canCollapse: true,
      priority: "medium",
    },
    {
      id: "insights",
      title: "Insights IA",
      subtitle: "Sugestões inteligentes",
      isCollapsed: true,
      canCollapse: true,
      priority: "low",
    },
  ]);

  // Metrics data
  const metrics = useMemo(
    (): MetricCard[] => [
      {
        id: "clients",
        title: "Clientes Ativos",
        value: 847,
        change: 12.5,
        changeType: "positive",
        icon: Users,
        color: "bg-blue-500",
      },
      {
        id: "processes",
        title: "Processos",
        value: 234,
        change: 8.3,
        changeType: "positive",
        icon: Scale,
        color: "bg-purple-500",
      },
      {
        id: "revenue",
        title: "Receita",
        value: "R$ 847K",
        change: -2.1,
        changeType: "negative",
        icon: DollarSign,
        color: "bg-green-500",
      },
      {
        id: "tasks",
        title: "Tarefas",
        value: 156,
        change: 15.7,
        changeType: "positive",
        icon: Target,
        color: "bg-orange-500",
      },
    ],
    [],
  );

  // Kanban data for clients pipeline
  const clientsPipeline = useMemo(
    (): KanbanColumn[] => [
      {
        id: "prospects",
        title: "Prospectos",
        color: "border-t-blue-500",
        items: [
          {
            id: "1",
            title: "João Silva",
            subtitle: "Direito Empresarial",
            status: "Em contato",
            priority: "high",
            assignee: { name: "Ana Costa" },
            dueDate: "2025-01-20",
            tags: ["VIP", "Empresarial"],
            value: 45000,
          },
          {
            id: "2",
            title: "Maria Santos",
            subtitle: "Direito Trabalhista",
            status: "Interesse",
            priority: "medium",
            assignee: { name: "Carlos Lima" },
            dueDate: "2025-01-22",
            tags: ["Trabalhista"],
            value: 15000,
          },
        ],
      },
      {
        id: "negotiation",
        title: "Negociação",
        color: "border-t-yellow-500",
        items: [
          {
            id: "3",
            title: "Tech Corp LTDA",
            subtitle: "Consultoria Jurídica",
            status: "Proposta enviada",
            priority: "high",
            assignee: { name: "Pedro Oliveira" },
            dueDate: "2025-01-18",
            tags: ["Corporativo", "Mensal"],
            value: 120000,
            progress: 75,
          },
        ],
      },
      {
        id: "closing",
        title: "Fechamento",
        color: "border-t-green-500",
        items: [
          {
            id: "4",
            title: "Startup Legal",
            subtitle: "Direito Digital",
            status: "Aguardando assinatura",
            priority: "high",
            assignee: { name: "Ana Costa" },
            dueDate: "2025-01-17",
            tags: ["Digital", "Startup"],
            value: 80000,
            progress: 95,
          },
        ],
      },
      {
        id: "won",
        title: "Fechados",
        color: "border-t-purple-500",
        items: [
          {
            id: "5",
            title: "Indústria XYZ",
            subtitle: "Direito Ambiental",
            status: "Cliente ativo",
            priority: "medium",
            assignee: { name: "Carlos Lima" },
            tags: ["Ambiental", "Industrial"],
            value: 200000,
          },
        ],
      },
    ],
    [],
  );

  // Processes data
  const processesData = useMemo(
    (): KanbanColumn[] => [
      {
        id: "new",
        title: "Novos",
        color: "border-t-blue-500",
        items: [
          {
            id: "p1",
            title: "Ação Trabalhista #2024-001",
            subtitle: "João Silva vs. Empresa ABC",
            status: "Documentação",
            priority: "high",
            assignee: { name: "Dr. Pedro" },
            dueDate: "2025-01-25",
            tags: ["Trabalhista", "Urgente"],
          },
        ],
      },
      {
        id: "progress",
        title: "Em Andamento",
        color: "border-t-yellow-500",
        items: [
          {
            id: "p2",
            title: "Revisão Contratual #2024-002",
            subtitle: "Tech Corp LTDA",
            status: "Análise jurídica",
            priority: "medium",
            assignee: { name: "Dra. Ana" },
            dueDate: "2025-01-30",
            tags: ["Contratual"],
            progress: 60,
          },
          {
            id: "p3",
            title: "Consultoria Ambiental #2024-003",
            subtitle: "Indústria XYZ",
            status: "Aguardando documentos",
            priority: "low",
            assignee: { name: "Dr. Carlos" },
            dueDate: "2025-02-05",
            tags: ["Ambiental"],
            progress: 30,
          },
        ],
      },
      {
        id: "review",
        title: "Revisão",
        color: "border-t-orange-500",
        items: [
          {
            id: "p4",
            title: "Parecer Jurídico #2024-004",
            subtitle: "Startup Legal",
            status: "Revisão final",
            priority: "high",
            assignee: { name: "Dr. Pedro" },
            dueDate: "2025-01-20",
            tags: ["Parecer", "Digital"],
            progress: 85,
          },
        ],
      },
      {
        id: "completed",
        title: "Concluídos",
        color: "border-t-green-500",
        items: [
          {
            id: "p5",
            title: "Registro de Marca #2024-005",
            subtitle: "StartupTech",
            status: "Finalizado",
            priority: "medium",
            assignee: { name: "Dra. Ana" },
            tags: ["Propriedade Intelectual"],
          },
        ],
      },
    ],
    [],
  );

  // Widget management
  const toggleWidget = (widgetId: string) => {
    setWidgets((prev) =>
      prev.map((widget) =>
        widget.id === widgetId
          ? { ...widget, isCollapsed: !widget.isCollapsed }
          : widget,
      ),
    );
  };

  const getWidget = (id: string) => widgets.find((w) => w.id === id);

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            CRM Jurídico
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visão unificada dos seus clientes e processos
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Este mês
          </Button>
          <Button size="sm">
            <Target className="w-4 h-4 mr-2" />
            Nova tarefa
          </Button>
        </div>
      </div>

      {/* Metrics Widget */}
      <CollapsibleWidget
        widget={getWidget("metrics")!}
        onToggle={() => toggleWidget("metrics")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </CollapsibleWidget>

      {/* Clients Pipeline Widget */}
      <CollapsibleWidget
        widget={getWidget("clients")!}
        onToggle={() => toggleWidget("clients")}
      >
        <KanbanBoard columns={clientsPipeline} type="clients" />
      </CollapsibleWidget>

      {/* Processes Widget */}
      <CollapsibleWidget
        widget={getWidget("processes")!}
        onToggle={() => toggleWidget("processes")}
      >
        <KanbanBoard columns={processesData} type="processes" />
      </CollapsibleWidget>

      {/* Tasks Widget */}
      <CollapsibleWidget
        widget={getWidget("tasks")!}
        onToggle={() => toggleWidget("tasks")}
      >
        <TasksList />
      </CollapsibleWidget>

      {/* AI Insights Widget */}
      <CollapsibleWidget
        widget={getWidget("insights")!}
        onToggle={() => toggleWidget("insights")}
      >
        <AIInsightsPanel />
      </CollapsibleWidget>
    </div>
  );
};

// Collapsible Widget Component
const CollapsibleWidget: React.FC<{
  widget: CollapsibleWidget;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ widget, onToggle, children }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader
        className={cn(
          "cursor-pointer select-none transition-colors hover:bg-gray-50 dark:hover:bg-gray-800",
          widget.canCollapse && "cursor-pointer",
        )}
        onClick={widget.canCollapse ? onToggle : undefined}
      >
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {widget.title}
              <Badge
                variant={
                  widget.priority === "high"
                    ? "destructive"
                    : widget.priority === "medium"
                      ? "default"
                      : "secondary"
                }
                className="text-xs"
              >
                {widget.priority}
              </Badge>
            </CardTitle>
            {widget.subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {widget.subtitle}
              </p>
            )}
          </div>
          {widget.canCollapse && (
            <motion.div
              animate={{ rotate: widget.isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </motion.div>
          )}
        </div>
      </CardHeader>

      <AnimatePresence>
        {!widget.isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="pt-0">{children}</CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

// Metric Card Component
const MetricCard: React.FC<{ metric: MetricCard }> = ({ metric }) => {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {metric.title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {metric.value}
            </p>
          </div>
          <div
            className={cn(
              "p-3 rounded-lg",
              metric.color,
              "bg-opacity-10 dark:bg-opacity-20",
            )}
          >
            <metric.icon className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="flex items-center mt-4 text-sm">
          {metric.change > 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span
            className={cn(
              "font-medium",
              metric.changeType === "positive"
                ? "text-green-600"
                : "text-red-600",
            )}
          >
            {Math.abs(metric.change)}%
          </span>
          <span className="text-gray-600 dark:text-gray-400 ml-1">
            vs mês anterior
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// Kanban Board Component
const KanbanBoard: React.FC<{
  columns: KanbanColumn[];
  type: "clients" | "processes";
}> = ({ columns, type }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((column) => (
        <div key={column.id} className="space-y-3">
          <div
            className={cn(
              "border-t-4 rounded-t-lg p-3 bg-gray-50 dark:bg-gray-800",
              column.color,
            )}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {column.title}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {column.items.length}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            {column.items.map((item) => (
              <KanbanCard key={item.id} item={item} type={type} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Kanban Card Component
const KanbanCard: React.FC<{
  item: KanbanItem;
  type: "clients" | "processes";
}> = ({ item, type }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-300";
    }
  };

  return (
    <Card
      className={cn(
        "border-l-4 cursor-pointer transition-all hover:shadow-md",
        getPriorityColor(item.priority),
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-medium text-sm text-gray-900 dark:text-white">
              {item.title}
            </h4>
            {item.subtitle && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {item.subtitle}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                Ver
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link className="w-4 h-4 mr-2" />
                Vincular
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="w-4 h-4 mr-2" />
                Discutir
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tags */}
        {item.tags && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Progress Bar */}
        {item.progress !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Progresso</span>
              <span>{item.progress}%</span>
            </div>
            <Progress value={item.progress} className="h-2" />
          </div>
        )}

        {/* Value */}
        {item.value && type === "clients" && (
          <div className="mb-3">
            <p className="text-sm font-medium text-green-600">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(item.value)}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            {item.assignee && (
              <div className="flex items-center gap-1">
                <Avatar className="w-4 h-4">
                  <AvatarImage src={item.assignee.avatar} />
                  <AvatarFallback className="text-xs">
                    {item.assignee.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>{item.assignee.name}</span>
              </div>
            )}
          </div>
          {item.dueDate && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{item.dueDate}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Tasks List Component
const TasksList: React.FC = () => {
  const tasks = [
    {
      id: "1",
      title: "Revisar contrato Empresa ABC",
      priority: "high" as const,
      dueDate: "Hoje",
      assignee: "Dr. Pedro",
      status: "pending" as const,
    },
    {
      id: "2",
      title: "Agendar audiência processo #2024-001",
      priority: "medium" as const,
      dueDate: "Amanhã",
      assignee: "Dra. Ana",
      status: "in_progress" as const,
    },
    {
      id: "3",
      title: "Preparar parecer jurídico",
      priority: "low" as const,
      dueDate: "25/01",
      assignee: "Dr. Carlos",
      status: "pending" as const,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case "in_progress":
        return <Play className="w-4 h-4 text-blue-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          {getStatusIcon(task.status)}
          <div className="flex-1">
            <h4 className="font-medium text-sm text-gray-900 dark:text-white">
              {task.title}
            </h4>
            <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mt-1">
              <span>{task.assignee}</span>
              <span>{task.dueDate}</span>
              <Badge
                variant={
                  task.priority === "high"
                    ? "destructive"
                    : task.priority === "medium"
                      ? "default"
                      : "secondary"
                }
                className="text-xs"
              >
                {task.priority}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                Ver
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CheckCircle className="w-4 h-4 mr-2" />
                Marcar como concluída
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
};

// AI Insights Panel Component
const AIInsightsPanel: React.FC = () => {
  const insights = [
    {
      id: "1",
      type: "suggestion" as const,
      title: "Clientes similares detectados",
      description:
        "João Silva e João S. Santos podem ser o mesmo cliente. Verificar CPF.",
      action: "Revisar duplicatas",
      confidence: 85,
    },
    {
      id: "2",
      type: "alert" as const,
      title: "Cliente VIP sem contato",
      description:
        "Tech Corp LTDA não tem interações há 15 dias. Score: 8.5/10",
      action: "Agendar follow-up",
      confidence: 92,
    },
    {
      id: "3",
      type: "insight" as const,
      title: "Oportunidade de upsell",
      description:
        "Startup Legal pode interessar-se por consultoria mensal baseado no histórico.",
      action: "Preparar proposta",
      confidence: 78,
    },
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "suggestion":
        return <Star className="w-4 h-4 text-blue-500" />;
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "insight":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      default:
        return <Star className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <Card key={insight.id} className="p-4">
          <div className="flex items-start gap-3">
            {getInsightIcon(insight.type)}
            <div className="flex-1">
              <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                {insight.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {insight.description}
              </p>
              <div className="flex items-center justify-between mt-3">
                <Button variant="link" size="sm" className="p-0 h-auto">
                  {insight.action}
                </Button>
                <Badge variant="outline" className="text-xs">
                  {insight.confidence}% confiança
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MinimalistCRMDashboard;
