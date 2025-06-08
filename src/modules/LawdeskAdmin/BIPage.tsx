import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  FileText,
  Scale,
  Brain,
  Activity,
  Target,
  Clock,
  Eye,
  Download,
  Filter,
  Calendar,
  Globe,
  Star,
  Award,
  Zap,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "@/components/ui/recharts-enhanced";

interface KPIData {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "stable";
  icon: React.ElementType;
  color: string;
  target?: string;
  description: string;
}

interface ModuleMetrics {
  module: string;
  users: number;
  revenue: number;
  satisfaction: number;
  growth: number;
  usage: number;
  tickets: number;
}

const kpiData: KPIData[] = [
  {
    label: "Receita Recorrente (MRR)",
    value: "R$ 2.847.230",
    change: "+12.3%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    target: "R$ 3.2M",
    description: "Meta para Q1 2025",
  },
  {
    label: "Clientes Ativos",
    value: "1.247",
    change: "+8.7%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    target: "1.500",
    description: "Base de clientes crescendo",
  },
  {
    label: "Churn Rate",
    value: "2.4%",
    change: "-0.8%",
    trend: "down",
    icon: TrendingDown,
    color: "text-green-600",
    target: "< 2%",
    description: "Excelente retenção",
  },
  {
    label: "NPS Score",
    value: "72",
    change: "+5",
    trend: "up",
    icon: Star,
    color: "text-purple-600",
    target: "75",
    description: "Satisfação alta",
  },
  {
    label: "CAC (Custo Aquisição)",
    value: "R$ 847",
    change: "-12%",
    trend: "down",
    icon: Target,
    color: "text-green-600",
    target: "R$ 750",
    description: "Otimização de aquisição",
  },
  {
    label: "LTV (Valor Vitalício)",
    value: "R$ 18.450",
    change: "+15%",
    trend: "up",
    icon: Award,
    color: "text-orange-600",
    target: "R$ 20K",
    description: "Alto valor por cliente",
  },
];

const moduleMetrics: ModuleMetrics[] = [
  {
    module: "GED Jurídico",
    users: 1247,
    revenue: 985000,
    satisfaction: 4.7,
    growth: 15.2,
    usage: 89,
    tickets: 23,
  },
  {
    module: "IA Jurídica",
    users: 892,
    revenue: 756000,
    satisfaction: 4.8,
    growth: 28.5,
    usage: 94,
    tickets: 8,
  },
  {
    module: "CRM",
    users: 1156,
    revenue: 623000,
    satisfaction: 4.6,
    growth: 11.8,
    usage: 87,
    tickets: 15,
  },
  {
    module: "Atendimento",
    users: 445,
    revenue: 234000,
    satisfaction: 4.5,
    growth: 7.3,
    usage: 76,
    tickets: 31,
  },
  {
    module: "Contratos",
    users: 667,
    revenue: 445000,
    satisfaction: 4.4,
    growth: 9.1,
    usage: 82,
    tickets: 18,
  },
];

const revenueData = [
  { month: "Jul", revenue: 2100000, customers: 1089, churn: 3.2 },
  { month: "Ago", revenue: 2280000, customers: 1134, churn: 2.8 },
  { month: "Set", revenue: 2450000, customers: 1178, churn: 2.5 },
  { month: "Out", revenue: 2610000, customers: 1205, churn: 2.7 },
  { month: "Nov", revenue: 2720000, customers: 1223, churn: 2.4 },
  { month: "Dez", revenue: 2847230, customers: 1247, churn: 2.4 },
];

const usageData = [
  { module: "GED", value: 35, color: "#3B82F6" },
  { module: "IA", value: 28, color: "#8B5CF6" },
  { module: "CRM", value: 22, color: "#10B981" },
  { module: "Atendimento", value: 15, color: "#F59E0B" },
];

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];

export default function BIPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedModule, setSelectedModule] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      case "down":
        return <ArrowDownRight className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            Business Intelligence
          </h1>
          <p className="text-muted-foreground">
            Analytics completos de receita, uso e performance dos módulos
            Lawdesk
          </p>
        </div>

        <div className="flex items-center gap-3">
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

          <Button
            onClick={refreshData}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>

          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center`}
                    >
                      <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {kpi.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {kpi.value}
                      </p>
                    </div>
                  </div>
                  {getTrendIcon(kpi.trend)}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Badge
                    variant={
                      kpi.trend === "up"
                        ? "default"
                        : kpi.trend === "down"
                          ? "destructive"
                          : "secondary"
                    }
                    className={
                      kpi.trend === "up"
                        ? "bg-green-100 text-green-800"
                        : kpi.trend === "down"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                    }
                  >
                    {kpi.change}
                  </Badge>
                  {kpi.target && (
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Meta</div>
                      <div className="text-sm font-medium">{kpi.target}</div>
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-2">{kpi.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Receita</TabsTrigger>
          <TabsTrigger value="modules">Módulos</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfação</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Crescimento de Receita (6 meses)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
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
                    <Bar dataKey="customers" fill="#10B981" opacity={0.7} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue by Module */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Receita por Módulo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {moduleMetrics.map((module, index) => (
                    <div
                      key={module.module}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full bg-blue-500`}
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                        <div>
                          <div className="font-medium">{module.module}</div>
                          <div className="text-sm text-gray-500">
                            {module.users} usuários
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          R$ {(module.revenue / 1000).toFixed(0)}K
                        </div>
                        <div className="text-sm text-green-600">
                          +{module.growth}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Churn Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                Análise de Churn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Churn Rate"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="churn"
                    stroke="#EF4444"
                    strokeWidth={3}
                    dot={{ fill: "#EF4444", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Module Usage Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Distribuição de Uso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={usageData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={(entry) => `${entry.module} (${entry.value}%)`}
                    >
                      {usageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Module Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Performance dos Módulos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {moduleMetrics.map((module, index) => (
                    <div key={module.module} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{module.module}</span>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">{module.satisfaction}</span>
                        </div>
                      </div>
                      <Progress value={module.usage} className="h-2" />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{module.usage}% uso</span>
                        <span>{module.tickets} tickets</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Usuários Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">1,247</div>
                  <div className="text-sm text-gray-500">Total de usuários</div>
                  <div className="mt-4">
                    <Badge className="bg-green-100 text-green-800">
                      +8.7% este mês
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Tempo Médio de Sessão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    2h 34m
                  </div>
                  <div className="text-sm text-gray-500">Por sessão</div>
                  <div className="mt-4">
                    <Badge className="bg-blue-100 text-blue-800">
                      +12% vs mês anterior
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Páginas por Sessão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">8.2</div>
                  <div className="text-sm text-gray-500">Páginas visitadas</div>
                  <div className="mt-4">
                    <Badge className="bg-orange-100 text-orange-800">
                      +5% vs mês anterior
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="satisfaction" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  NPS Score por Módulo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {moduleMetrics.map((module) => (
                    <div
                      key={module.module}
                      className="flex items-center justify-between"
                    >
                      <span className="font-medium">{module.module}</span>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={(module.satisfaction / 5) * 100}
                          className="w-24 h-2"
                        />
                        <span className="text-sm font-medium">
                          {module.satisfaction}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Resolução de Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">94%</div>
                    <div className="text-sm text-gray-500">
                      Taxa de resolução
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">4.2h</div>
                    <div className="text-sm text-gray-500">
                      Tempo médio de resposta
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">95</div>
                    <div className="text-sm text-gray-500">Tickets abertos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
