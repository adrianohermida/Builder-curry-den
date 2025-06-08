import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  DollarSign,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  CheckSquare,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Settings,
  Eye,
  FileSignature,
  Scale,
  Brain,
  MapPin,
  Star,
  Activity,
  Zap,
  Building,
  PieChart,
  LineChart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-range";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChartWrapper } from "@/components/ui/chart-error-boundary";
import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Pie,
  formatCurrency,
} from "@/components/ui/recharts-enhanced";
import { ChartLegend } from "@/components/ui/chart-components";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuditSystem } from "@/hooks/useAuditSystem";
import { DateRange } from "react-day-picker";
import { addDays, subDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DashboardMetrics {
  // Financial metrics
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  outstandingInvoices: number;
  overdueDays: number;

  // Client metrics
  totalClients: number;
  activeClients: number;
  newClients: number;
  clientRetention: number;
  clientSatisfaction: number;

  // Process metrics
  totalProcesses: number;
  activeProcesses: number;
  wonProcesses: number;
  lostProcesses: number;
  successRate: number;

  // Productivity metrics
  completedTasks: number;
  pendingTasks: number;
  overdueTasksCount: number;
  averageTaskTime: number;

  // Document metrics
  documentsGenerated: number;
  aiUsage: number;
  storageUsed: number;

  // Performance metrics
  slaCompliance: number;
  responseTime: number;
  userActivity: number;
}

interface ChartData {
  name: string;
  value: number;
  growth?: number;
  target?: number;
  color?: string;
}

export default function DashboardExecutivo() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  const { user, hasPermission } = usePermissions();
  const { getLogsSummary } = useAuditSystem();

  // Mock data - replace with actual API calls
  useEffect(() => {
    const loadMetrics = async () => {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockMetrics: DashboardMetrics = {
        totalRevenue: 450000,
        monthlyRevenue: 45000,
        revenueGrowth: 12.5,
        outstandingInvoices: 25000,
        overdueDays: 7,

        totalClients: 156,
        activeClients: 134,
        newClients: 12,
        clientRetention: 94.2,
        clientSatisfaction: 4.6,

        totalProcesses: 89,
        activeProcesses: 67,
        wonProcesses: 18,
        lostProcesses: 4,
        successRate: 81.8,

        completedTasks: 245,
        pendingTasks: 56,
        overdueTasksCount: 8,
        averageTaskTime: 3.2,

        documentsGenerated: 567,
        aiUsage: 89,
        storageUsed: 78.5,

        slaCompliance: 92.5,
        responseTime: 2.1,
        userActivity: 95.8,
      };

      setMetrics(mockMetrics);
      setIsLoading(false);
    };

    loadMetrics();
  }, [dateRange]);

  // Chart data
  const revenueData: ChartData[] = [
    { name: "Jan", value: 35000, growth: 8.2 },
    { name: "Fev", value: 42000, growth: 20.0 },
    { name: "Mar", value: 38000, growth: -9.5 },
    { name: "Abr", value: 47000, growth: 23.7 },
    { name: "Mai", value: 51000, growth: 8.5 },
    { name: "Jun", value: 45000, growth: -11.8 },
  ];

  const processesData: ChartData[] = [
    { name: "Trabalhista", value: 35, color: "#3B82F6" },
    { name: "Civil", value: 28, color: "#10B981" },
    { name: "Criminal", value: 15, color: "#F59E0B" },
    { name: "Empresarial", value: 11, color: "#EF4444" },
  ];

  const productivityData: ChartData[] = [
    { name: "Seg", value: 85 },
    { name: "Ter", value: 92 },
    { name: "Qua", value: 78 },
    { name: "Qui", value: 96 },
    { name: "Sex", value: 88 },
    { name: "Sáb", value: 65 },
    { name: "Dom", value: 45 },
  ];

  const clientSatisfactionData: ChartData[] = [
    { name: "Muito Satisfeito", value: 45, color: "#10B981" },
    { name: "Satisfeito", value: 35, color: "#3B82F6" },
    { name: "Neutro", value: 15, color: "#F59E0B" },
    { name: "Insatisfeito", value: 3, color: "#EF4444" },
    { name: "Muito Insatisfeito", value: 2, color: "#7C2D12" },
  ];

  if (!hasPermission("dashboard", "read")) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Acesso Negado</h3>
          <p className="text-muted-foreground">
            Você não tem permissão para acessar o dashboard executivo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Dashboard Executivo
          </h1>
          <p className="text-muted-foreground">
            Visão executiva completa do escritório jurídico
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Receita Mensal
                  </p>
                  <p className="text-2xl font-bold">
                    R$ {metrics?.monthlyRevenue.toLocaleString("pt-BR")}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-500">
                      +{metrics?.revenueGrowth}%
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Clientes Ativos
                  </p>
                  <p className="text-2xl font-bold">{metrics?.activeClients}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-muted-foreground">
                      +{metrics?.newClients} novos
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Taxa de Sucesso
                  </p>
                  <p className="text-2xl font-bold">{metrics?.successRate}%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-500">
                      {metrics?.wonProcesses} vitórias
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    SLA Compliance
                  </p>
                  <p className="text-2xl font-bold">
                    {metrics?.slaCompliance}%
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Activity className="h-3 w-3 text-orange-500" />
                    <span className="text-xs text-orange-500">
                      {metrics?.responseTime}h média
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="operations">Operacional</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Evolução da Receita
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartWrapper title="Evolução da Receita" height={300}>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => [
                          formatCurrency(value),
                          "Receita",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartWrapper>
              </CardContent>
            </Card>

            {/* Processes by Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Processos por Área
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={processesData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={(entry) => `${entry.name} (${entry.value})`}
                    >
                      {processesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <ChartLegend
                  data={processesData.map((item) => ({
                    name: item.name,
                    color: item.color,
                    value: item.value,
                  }))}
                />
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Atividades Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    user: "Dr. Pedro Costa",
                    action: "criou novo contrato",
                    target: "João Silva - Prestação de Serviços",
                    time: "há 2 minutos",
                    type: "contract",
                  },
                  {
                    user: "Dra. Maria Santos",
                    action: "finalizou tarefa",
                    target: "Preparar defesa - Processo 123456",
                    time: "há 15 minutos",
                    type: "task",
                  },
                  {
                    user: "Sistema IA",
                    action: "gerou minuta",
                    target: "Petição Inicial - Direito Civil",
                    time: "há 30 minutos",
                    type: "ai",
                  },
                  {
                    user: "Ana Costa",
                    action: "agendou audiência",
                    target: "TRT 2ª Região - Sala 5",
                    time: "há 1 hora",
                    type: "calendar",
                  },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {activity.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{" "}
                        <span className="text-muted-foreground">
                          {activity.action}
                        </span>{" "}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {activity.type === "contract" && (
                        <FileSignature className="h-3 w-3 mr-1" />
                      )}
                      {activity.type === "task" && (
                        <CheckSquare className="h-3 w-3 mr-1" />
                      )}
                      {activity.type === "ai" && (
                        <Brain className="h-3 w-3 mr-1" />
                      )}
                      {activity.type === "calendar" && (
                        <Calendar className="h-3 w-3 mr-1" />
                      )}
                      {activity.type}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Financial Overview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Receita vs Meta</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      type="category"
                      allowDataOverflow={false}
                      allowDecimals={true}
                      allowDuplicatedCategory={true}
                    />
                    <YAxis
                      type="number"
                      allowDataOverflow={false}
                      allowDecimals={true}
                      allowDuplicatedCategory={true}
                    />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Financial KPIs */}
            <Card>
              <CardHeader>
                <CardTitle>Indicadores Financeiros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Receita Total</span>
                    <span>
                      R$ {metrics?.totalRevenue.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Pendências</span>
                    <span>
                      R$ {metrics?.outstandingInvoices.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Prazo Médio</span>
                    <span>{metrics?.overdueDays} dias</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          {/* Implementation for operational metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Produtividade Semanal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={productivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      type="category"
                      allowDataOverflow={false}
                      allowDecimals={true}
                      allowDuplicatedCategory={true}
                    />
                    <YAxis
                      type="number"
                      allowDataOverflow={false}
                      allowDecimals={true}
                      allowDuplicatedCategory={true}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10B981"
                      strokeWidth={2}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satisfação do Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={clientSatisfactionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={false}
                    >
                      {clientSatisfactionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance metrics implementation */}
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">Performance Analytics</h3>
            <p className="text-muted-foreground">
              Métricas detalhadas de performance em desenvolvimento...
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
