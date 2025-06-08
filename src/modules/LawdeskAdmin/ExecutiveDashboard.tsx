import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  Shield,
  Target,
  Zap,
  Brain,
  Scale,
  Globe,
  Clock,
  AlertTriangle,
  CheckCircle,
  Star,
  Award,
  Calendar,
  FileText,
  Download,
  RefreshCw,
  Filter,
  Eye,
  EyeOff,
  Settings,
  Bell,
  Crown,
  Building,
  Briefcase,
  Gavel,
  UserCheck,
  Lock,
  Unlock,
  PieChart,
  LineChart,
  BarChart,
  Gauge,
  MonitorCheck,
  Code,
  CreditCard,
  Headphones,
  MessageSquare,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Plus,
  ExternalLink,
  MapPin,
  Timer,
  Database,
  Server,
  Cpu,
  HardDrive,
  Network,
  Search,
  Command,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "@/components/ui/recharts-enhanced";

import { usePermissions } from "@/hooks/usePermissions";
import { toast } from "sonner";

// Types and Interfaces
interface ExecutiveKPI {
  id: string;
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down" | "stable";
  icon: React.ElementType;
  color: string;
  bgColor: string;
  target?: string;
  description: string;
  permission: string;
  priority: "high" | "medium" | "low";
}

interface ModuleStatus {
  id: string;
  name: string;
  status: "operational" | "warning" | "critical" | "maintenance";
  uptime: number;
  users: number;
  revenue: number;
  satisfaction: number;
  lastUpdate: string;
  version: string;
  permission: string;
  href: string;
  icon: React.ElementType;
  color: string;
}

interface ExecutiveAction {
  id: string;
  title: string;
  description: string;
  priority: "urgent" | "high" | "medium" | "low";
  category: "financial" | "operational" | "technical" | "legal" | "strategic";
  assignee?: string;
  dueDate: string;
  status: "pending" | "in_progress" | "completed" | "overdue";
  permission: string;
}

interface BusinessMetric {
  period: string;
  revenue: number;
  clients: number;
  churn: number;
  cac: number;
  ltv: number;
  nps: number;
  uptime: number;
  tickets: number;
}

interface SystemAlert {
  id: string;
  type: "info" | "warning" | "error" | "critical";
  title: string;
  message: string;
  timestamp: string;
  module: string;
  acknowledged: boolean;
  actionRequired: boolean;
}

// Sample Data
const executiveKPIs: ExecutiveKPI[] = [
  {
    id: "mrr",
    title: "Receita Recorrente (MRR)",
    value: "R$ 2.847.230",
    change: "+12.3%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50",
    target: "R$ 3.2M",
    description: "Meta Q1 2025",
    permission: "finance.read",
    priority: "high",
  },
  {
    id: "clients",
    title: "Base de Clientes",
    value: "1,247",
    change: "+8.7%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    target: "1,500",
    description: "Crescimento sustentável",
    permission: "clients.read",
    priority: "high",
  },
  {
    id: "churn",
    title: "Taxa de Churn",
    value: "2.4%",
    change: "-0.8%",
    trend: "down",
    icon: TrendingDown,
    color: "text-green-600",
    bgColor: "bg-green-50",
    target: "< 2%",
    description: "Excelente retenção",
    permission: "analytics.read",
    priority: "high",
  },
  {
    id: "nps",
    title: "NPS Score",
    value: 72,
    change: "+5",
    trend: "up",
    icon: Star,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    target: "75+",
    description: "Satisfação alta",
    permission: "satisfaction.read",
    priority: "medium",
  },
  {
    id: "uptime",
    title: "Uptime Sistema",
    value: "99.9%",
    change: "Estável",
    trend: "stable",
    icon: Activity,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    target: "99.9%",
    description: "SLA atendido",
    permission: "system.read",
    priority: "high",
  },
  {
    id: "cac",
    title: "CAC (Custo Aquisição)",
    value: "R$ 847",
    change: "-12%",
    trend: "down",
    icon: Target,
    color: "text-green-600",
    bgColor: "bg-green-50",
    target: "R$ 750",
    description: "Otimização eficaz",
    permission: "marketing.read",
    priority: "medium",
  },
  {
    id: "ltv",
    title: "LTV (Valor Vitalício)",
    value: "R$ 18.450",
    change: "+15%",
    trend: "up",
    icon: Award,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    target: "R$ 20K",
    description: "Alto valor por cliente",
    permission: "analytics.read",
    priority: "medium",
  },
  {
    id: "ai_tasks",
    title: "Tarefas IA/Mês",
    value: "47.2K",
    change: "+23%",
    trend: "up",
    icon: Brain,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    target: "50K",
    description: "Automação crescente",
    permission: "ai.read",
    priority: "low",
  },
];

const moduleStatuses: ModuleStatus[] = [
  {
    id: "ged",
    name: "GED Jurídico",
    status: "operational",
    uptime: 99.8,
    users: 1247,
    revenue: 985000,
    satisfaction: 4.7,
    lastUpdate: "2025-01-15T10:30:00",
    version: "v2.1.4",
    permission: "ged.read",
    href: "/ged-juridico",
    icon: FileText,
    color: "text-blue-600",
  },
  {
    id: "ia",
    name: "IA Jurídica",
    status: "operational",
    uptime: 99.9,
    users: 892,
    revenue: 756000,
    satisfaction: 4.8,
    lastUpdate: "2025-01-15T11:00:00",
    version: "v3.0.2",
    permission: "ai.read",
    href: "/ai-enhanced",
    icon: Brain,
    color: "text-purple-600",
  },
  {
    id: "crm",
    name: "CRM Jurídico",
    status: "operational",
    uptime: 99.7,
    users: 1156,
    revenue: 623000,
    satisfaction: 4.6,
    lastUpdate: "2025-01-15T09:15:00",
    version: "v1.8.9",
    permission: "crm.read",
    href: "/crm",
    icon: Users,
    color: "text-green-600",
  },
  {
    id: "atendimento",
    name: "Atendimento",
    status: "warning",
    uptime: 98.5,
    users: 445,
    revenue: 234000,
    satisfaction: 4.3,
    lastUpdate: "2025-01-15T08:45:00",
    version: "v1.5.7",
    permission: "support.read",
    href: "/atendimento",
    icon: Headphones,
    color: "text-yellow-600",
  },
  {
    id: "contratos",
    name: "Contratos",
    status: "operational",
    uptime: 99.6,
    users: 667,
    revenue: 445000,
    satisfaction: 4.4,
    lastUpdate: "2025-01-15T07:30:00",
    version: "v1.3.2",
    permission: "contracts.read",
    href: "/contratos",
    icon: Scale,
    color: "text-indigo-600",
  },
  {
    id: "financeiro",
    name: "Financeiro",
    status: "operational",
    uptime: 99.9,
    users: 89,
    revenue: 0, // Internal module
    satisfaction: 4.9,
    lastUpdate: "2025-01-15T12:00:00",
    version: "v2.0.1",
    permission: "finance.read",
    href: "/financeiro",
    icon: DollarSign,
    color: "text-green-600",
  },
];

const businessData: BusinessMetric[] = [
  {
    period: "Jul",
    revenue: 2100000,
    clients: 1089,
    churn: 3.2,
    cac: 920,
    ltv: 16200,
    nps: 67,
    uptime: 99.5,
    tickets: 89,
  },
  {
    period: "Ago",
    revenue: 2280000,
    clients: 1134,
    churn: 2.8,
    cac: 890,
    ltv: 16800,
    nps: 69,
    uptime: 99.7,
    tickets: 76,
  },
  {
    period: "Set",
    revenue: 2450000,
    clients: 1178,
    churn: 2.5,
    cac: 860,
    ltv: 17200,
    nps: 70,
    uptime: 99.6,
    tickets: 82,
  },
  {
    period: "Out",
    revenue: 2610000,
    clients: 1205,
    churn: 2.7,
    cac: 875,
    ltv: 17600,
    nps: 71,
    uptime: 99.8,
    tickets: 67,
  },
  {
    period: "Nov",
    revenue: 2720000,
    clients: 1223,
    churn: 2.4,
    cac: 855,
    ltv: 18100,
    nps: 71,
    uptime: 99.9,
    tickets: 54,
  },
  {
    period: "Dez",
    revenue: 2847230,
    clients: 1247,
    churn: 2.4,
    cac: 847,
    ltv: 18450,
    nps: 72,
    uptime: 99.9,
    tickets: 48,
  },
];

const systemAlerts: SystemAlert[] = [
  {
    id: "alert-001",
    type: "warning",
    title: "Alto tráfico detectado",
    message:
      "Módulo de Atendimento com 150% do tráfego normal nas últimas 2 horas",
    timestamp: "2025-01-15T14:30:00",
    module: "atendimento",
    acknowledged: false,
    actionRequired: true,
  },
  {
    id: "alert-002",
    type: "info",
    title: "Deploy concluído",
    message: "IA Jurídica v3.0.2 implantada com sucesso",
    timestamp: "2025-01-15T11:00:00",
    module: "ia",
    acknowledged: true,
    actionRequired: false,
  },
  {
    id: "alert-003",
    type: "critical",
    title: "Backup pendente",
    message: "Backup do GED não executado há 25 horas",
    timestamp: "2025-01-15T13:00:00",
    module: "ged",
    acknowledged: false,
    actionRequired: true,
  },
];

export default function ExecutiveDashboard() {
  const { user, hasPermission, isAdmin } = usePermissions();
  const navigate = useNavigate();

  const [timeRange, setTimeRange] = useState("30d");
  const [selectedView, setSelectedView] = useState("overview");
  const [isRealTime, setIsRealTime] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<string[]>([]);

  // Filter data based on permissions
  const filteredKPIs = useMemo(
    () =>
      executiveKPIs.filter(
        (kpi) =>
          isAdmin() ||
          hasPermission(
            kpi.permission.split(".")[0],
            kpi.permission.split(".")[1],
          ),
      ),
    [user, isAdmin, hasPermission],
  );

  const filteredModules = useMemo(
    () =>
      moduleStatuses.filter(
        (module) =>
          isAdmin() ||
          hasPermission(
            module.permission.split(".")[0],
            module.permission.split(".")[1],
          ),
      ),
    [user, isAdmin, hasPermission],
  );

  const criticalAlerts = useMemo(
    () =>
      systemAlerts.filter(
        (alert) =>
          !acknowledgedAlerts.includes(alert.id) &&
          (alert.type === "critical" || alert.type === "error"),
      ),
    [acknowledgedAlerts],
  );

  // Auto-refresh functionality
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Here you would normally fetch fresh data
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isRealTime]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      case "down":
        return <ArrowDownRight className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-600 bg-green-50";
      case "warning":
        return "text-yellow-600 bg-yellow-50";
      case "critical":
        return "text-red-600 bg-red-50";
      case "maintenance":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAcknowledgedAlerts((prev) => [...prev, alertId]);
    toast.success("Alerta confirmado");
  };

  const refreshData = () => {
    setLastUpdate(new Date());
    toast.success("Dados atualizados");
  };

  // Check access permissions
  if (!isAdmin() && !hasPermission("admin", "read")) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center space-y-4">
          <Shield className="w-16 h-16 mx-auto text-muted-foreground" />
          <h3 className="text-xl font-semibold">Acesso Restrito</h3>
          <p className="text-muted-foreground max-w-md">
            Este dashboard é exclusivo para usuários com permissões executivas.
            Entre em contato com o administrador para solicitar acesso.
          </p>
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Executivo
              </h1>
              <p className="text-gray-600">
                Visão estratégica completa do Lawdesk CRM
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Atualizado: {lastUpdate.toLocaleTimeString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Tempo real</span>
            <Switch checked={isRealTime} onCheckedChange={setIsRealTime} />
          </div>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>

          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      <AnimatePresence>
        {criticalAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-600">
                Alertas Críticos ({criticalAlerts.length})
              </AlertTitle>
              <AlertDescription className="text-red-700">
                Existem alertas críticos que requerem atenção imediata.{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-red-700 underline"
                  onClick={() => setSelectedView("alerts")}
                >
                  Ver detalhes
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Executive KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredKPIs
          .slice(0, showDetails ? filteredKPIs.length : 4)
          .map((kpi, index) => (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 ${kpi.bgColor} rounded-lg flex items-center justify-center`}
                    >
                      <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(kpi.trend)}
                      <Badge
                        variant={
                          kpi.priority === "high" ? "default" : "secondary"
                        }
                        className={
                          kpi.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : ""
                        }
                      >
                        {kpi.priority}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                      {kpi.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {kpi.value}
                    </p>

                    <div className="flex items-center justify-between">
                      <Badge
                        className={
                          kpi.trend === "up"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {kpi.change}
                      </Badge>
                      {kpi.target && (
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Meta</div>
                          <div className="text-sm font-medium">
                            {kpi.target}
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      {kpi.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
      </div>

      {/* Show More/Less Button for KPIs */}
      {filteredKPIs.length > 4 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Mostrar Menos
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Mostrar Todos ({filteredKPIs.length - 4} mais)
              </>
            )}
          </Button>
        </div>
      )}

      {/* Main Dashboard Tabs */}
      <Tabs
        value={selectedView}
        onValueChange={setSelectedView}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="modules">Módulos</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="actions">Ações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Crescimento Executivo (6 meses)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={businessData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "revenue"
                          ? `R$ ${(value / 1000000).toFixed(1)}M`
                          : value,
                        name === "revenue" ? "Receita" : "Clientes",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                      stroke="#3B82F6"
                      strokeWidth={2}
                    />
                    <Bar dataKey="clients" fill="#10B981" opacity={0.7} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* NPS & Satisfaction Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  Satisfação & NPS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={businessData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="nps"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Business Health Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Saúde do Negócio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg border">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    Excelente
                  </div>
                  <div className="text-sm text-green-700">Status Geral</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border">
                  <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">87%</div>
                  <div className="text-sm text-blue-700">Metas Atingidas</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border">
                  <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">94%</div>
                  <div className="text-sm text-purple-700">Eficiência Op.</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg border">
                  <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">A+</div>
                  <div className="text-sm text-orange-700">
                    Score de Qualidade
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredModules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center`}
                        >
                          <module.icon className={`w-5 h-5 ${module.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {module.name}
                          </CardTitle>
                          <p className="text-sm text-gray-500">
                            {module.version}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(module.status)}>
                        {module.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Uptime */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uptime</span>
                        <span className="font-medium">{module.uptime}%</span>
                      </div>
                      <Progress value={module.uptime} className="h-2" />
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Usuários</div>
                        <div className="font-bold">
                          {module.users.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Satisfação</div>
                        <div className="font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          {module.satisfaction}
                        </div>
                      </div>
                      {module.revenue > 0 && (
                        <>
                          <div>
                            <div className="text-gray-500">Receita</div>
                            <div className="font-bold">
                              R$ {(module.revenue / 1000).toFixed(0)}K
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500">
                              Última Atualização
                            </div>
                            <div className="font-bold">
                              {new Date(module.lastUpdate).toLocaleDateString()}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Action Button */}
                    <Link to={module.href}>
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Acessar Módulo
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CAC vs LTV */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  CAC vs LTV
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={businessData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `R$ ${value.toLocaleString()}`,
                        name === "cac" ? "CAC" : "LTV",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="cac"
                      stroke="#EF4444"
                      strokeWidth={2}
                      name="cac"
                    />
                    <Line
                      type="monotone"
                      dataKey="ltv"
                      stroke="#10B981"
                      strokeWidth={2}
                      name="ltv"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Churn Rate */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  Taxa de Churn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={businessData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, "Churn Rate"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="churn"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Alertas do Sistema
                </span>
                <Badge variant="destructive">
                  {criticalAlerts.length} críticos
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${
                      acknowledgedAlerts.includes(alert.id)
                        ? "bg-gray-50 opacity-75"
                        : "bg-white"
                    } ${
                      alert.type === "critical"
                        ? "border-red-200"
                        : alert.type === "warning"
                          ? "border-yellow-200"
                          : alert.type === "error"
                            ? "border-red-200"
                            : "border-blue-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {alert.type === "critical" && (
                          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                        )}
                        {alert.type === "warning" && (
                          <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                        )}
                        {alert.type === "error" && (
                          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                        )}
                        {alert.type === "info" && (
                          <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                        )}

                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {alert.title}
                          </h4>
                          <p className="text-gray-600 mt-1">{alert.message}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>Módulo: {alert.module}</span>
                            <span>
                              {new Date(alert.timestamp).toLocaleString()}
                            </span>
                            {alert.actionRequired && (
                              <Badge variant="outline" className="text-red-600">
                                Ação necessária
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {!acknowledgedAlerts.includes(alert.id) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          Confirmar
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Centro de Ações Executivas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link to="/admin/bi">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col gap-2"
                  >
                    <BarChart3 className="w-6 h-6" />
                    <span className="text-sm">Business Intelligence</span>
                  </Button>
                </Link>
                <Link to="/admin/equipe">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col gap-2"
                  >
                    <Users className="w-6 h-6" />
                    <span className="text-sm">Gestão de Equipe</span>
                  </Button>
                </Link>
                <Link to="/admin/desenvolvimento">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col gap-2"
                  >
                    <Code className="w-6 h-6" />
                    <span className="text-sm">Desenvolvimento</span>
                  </Button>
                </Link>
                <Link to="/admin/faturamento">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col gap-2"
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="text-sm">Faturamento</span>
                  </Button>
                </Link>
                <Link to="/admin/suporte">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col gap-2"
                  >
                    <Headphones className="w-6 h-6" />
                    <span className="text-sm">Suporte</span>
                  </Button>
                </Link>
                <Link to="/system-health">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col gap-2"
                  >
                    <MonitorCheck className="w-6 h-6" />
                    <span className="text-sm">System Health</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
