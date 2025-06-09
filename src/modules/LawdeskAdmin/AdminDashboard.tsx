import React, { useState, useEffect, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  Settings,
  CreditCard,
  Headphones,
  MessageSquare,
  Package,
  Lock,
  TrendingUp,
  Activity,
  Shield,
  Zap,
  Brain,
  Target,
  Rocket,
  Globe,
  Timer,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Calendar,
  FileText,
  Search,
  Bell,
  Star,
  Gauge,
  MonitorCheck,
  Code,
  Database,
  Cloud,
  RefreshCw,
  Crown,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

// Safe chart component wrapper
const SafeChart: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({
  children,
  fallback = (
    <div className="w-full h-[200px] flex items-center justify-center bg-gray-50 rounded">
      <span className="text-gray-500">Carregando gráfico...</span>
    </div>
  ),
}) => {
  return (
    <Suspense fallback={fallback}>
      <div className="w-full h-[200px]">{children}</div>
    </Suspense>
  );
};

// Mock data for charts
const revenueData = [
  { time: "Jan", revenue: 65000, growth: 12 },
  { time: "Fev", revenue: 78000, growth: 20 },
  { time: "Mar", revenue: 82000, growth: 5 },
  { time: "Abr", revenue: 94000, growth: 15 },
  { time: "Mai", revenue: 87000, growth: -7 },
  { time: "Jun", revenue: 102000, growth: 17 },
];

const userActivityData = [
  { time: "00h", users: 120 },
  { time: "04h", users: 80 },
  { time: "08h", users: 380 },
  { time: "12h", users: 520 },
  { time: "16h", users: 450 },
  { time: "20h", users: 280 },
];

const performanceData = [
  { name: "API Response", value: 95, color: "#10B981" },
  { name: "Uptime", value: 99.9, color: "#3B82F6" },
  { name: "Error Rate", value: 0.1, color: "#EF4444" },
  { name: "Cache Hit", value: 87, color: "#8B5CF6" },
];

const modules = [
  {
    id: "executive",
    title: "Dashboard Executivo",
    description: "Visão estratégica completa do negócio",
    icon: Crown,
    href: "/admin/executive",
    color: "from-purple-500 to-indigo-600",
    stats: { value: "87%", label: "Metas Atingidas" },
    status: "healthy",
    growth: "Excelente",
  },
  {
    id: "bi",
    title: "Business Intelligence",
    description: "Analytics, métricas de uso e performance",
    icon: BarChart3,
    href: "/admin/bi",
    color: "from-blue-500 to-blue-600",
    stats: { value: "2.8M", label: "Receita MRR" },
    status: "healthy",
    growth: "+12.5%",
  },
  {
    id: "equipe",
    title: "Gestão de Equipe",
    description: "Controle de acessos e permissões",
    icon: Users,
    href: "/admin/equipe",
    color: "from-green-500 to-green-600",
    stats: { value: "23", label: "Membros Ativos" },
    status: "healthy",
    growth: "+2 membros",
  },
  {
    id: "desenvolvimento",
    title: "Desenvolvimento",
    description: "Blueprint Builder, deploys e releases",
    icon: Code,
    href: "/admin/desenvolvimento",
    color: "from-purple-500 to-purple-600",
    stats: { value: "v2025.1", label: "Versão Atual" },
    status: "healthy",
    growth: "3 releases/mês",
  },
  {
    id: "faturamento",
    title: "Faturamento",
    description: "Receitas, Stripe e análise financeira",
    icon: CreditCard,
    href: "/admin/faturamento",
    color: "from-orange-500 to-orange-600",
    stats: { value: "R$ 2.8M", label: "MRR Atual" },
    status: "healthy",
    growth: "+22% vs anterior",
  },
  {
    id: "suporte",
    title: "Suporte B2B",
    description: "Tickets, atendimento e satisfação",
    icon: Headphones,
    href: "/admin/suporte",
    color: "from-cyan-500 to-cyan-600",
    stats: { value: "4.8★", label: "Satisfação" },
    status: "healthy",
    growth: "97% resolvidos",
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Campanhas, leads e conversão",
    icon: MessageSquare,
    href: "/admin/marketing",
    color: "from-pink-500 to-pink-600",
    stats: { value: "340", label: "Leads/mês" },
    status: "warning",
    growth: "+15% vs anterior",
  },
  {
    id: "produtos",
    title: "Gestão de Produtos",
    description: "Planos SaaS, features e roadmap",
    icon: Package,
    href: "/admin/produtos",
    color: "from-indigo-500 to-indigo-600",
    stats: { value: "5", label: "Planos Ativos" },
    status: "healthy",
    growth: "2 novos planos",
  },
  {
    id: "seguranca",
    title: "Segurança",
    description: "Auditoria, compliance e LGPD",
    icon: Lock,
    href: "/admin/seguranca",
    color: "from-red-500 to-red-600",
    stats: { value: "100%", label: "Compliance" },
    status: "healthy",
    growth: "0 incidentes",
  },
];

const kpis = [
  {
    title: "Receita MRR",
    value: "R$ 2.847.320",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Usuários Ativos",
    value: "1.247",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Taxa de Churn",
    value: "2.4%",
    change: "-0.8%",
    trend: "down",
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    title: "Uptime",
    value: "99.97%",
    change: "+0.02%",
    trend: "up",
    icon: MonitorCheck,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
];

const systemAlerts = [
  {
    id: 1,
    type: "info",
    title: "Manutenção Programada",
    message: "Sistema será atualizado hoje às 2h para v2025.1.2",
    time: "2h",
    icon: RefreshCw,
  },
  {
    id: 2,
    type: "success",
    title: "Deploy Concluído",
    message: "Release v2025.1.1 implementado com sucesso",
    time: "4h",
    icon: CheckCircle,
  },
  {
    id: 3,
    type: "warning",
    title: "Uso de Storage Alto",
    message: "Banco de dados atingiu 85% da capacidade",
    time: "6h",
    icon: Database,
  },
];

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [systemHealth, setSystemHealth] = useState({
    api: 99.97,
    database: 99.85,
    storage: 87.2,
    cdn: 99.99,
  });

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth((prev) => ({
        ...prev,
        api: 99.9 + Math.random() * 0.09,
        database: 99.8 + Math.random() * 0.19,
        storage: 85 + Math.random() * 5,
        cdn: 99.95 + Math.random() * 0.04,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-100 text-green-800">Saudável</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Atenção</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800">Erro</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const SimpleChart: React.FC<{
    data: any[];
    type: "area" | "line" | "bar";
  }> = ({ data, type }) => {
    return (
      <div className="w-full h-[200px] flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <p className="text-sm text-gray-600">
            Gráfico {type} ({data.length} pontos)
          </p>
          <p className="text-xs text-gray-500 mt-1">Dados em tempo real</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Painel Administrativo Lawdesk
            </h1>
            <p className="text-gray-300 text-lg">
              Visão completa dos sistemas internos e métricas empresariais
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Badge className="bg-white/20 text-white border-white/30">
                🔒 Admin Access
              </Badge>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                ✅ Todos os Sistemas Online
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                🚀 v2025.1 - Estável
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">99.97%</div>
            <div className="text-gray-300">Uptime Geral</div>
            <div className="text-sm text-green-300 mt-1">
              ⚡ Excelente Performance
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {kpi.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {kpi.value}
                      </p>
                      <div className="flex items-center mt-2">
                        <TrendingUp
                          className={`h-4 w-4 mr-1 ${
                            kpi.trend === "up"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            kpi.trend === "up"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {kpi.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          vs período anterior
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                      <Icon className={`h-6 w-6 ${kpi.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Evolução da Receita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SafeChart>
              <SimpleChart data={revenueData} type="area" />
            </SafeChart>
          </CardContent>
        </Card>

        {/* User Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Atividade de Usuários (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SafeChart>
              <SimpleChart data={userActivityData} type="line" />
            </SafeChart>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MonitorCheck className="h-5 w-5" />
            Saúde do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(systemHealth).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">
                    {key === "api"
                      ? "API"
                      : key === "database"
                        ? "Database"
                        : key === "storage"
                          ? "Storage"
                          : "CDN"}
                  </span>
                  <span className="text-sm font-bold">{value.toFixed(2)}%</span>
                </div>
                <Progress value={value} className="h-2" />
                <div className="text-xs text-gray-500">
                  {value >= 99
                    ? "🟢 Excelente"
                    : value >= 95
                      ? "🟡 Bom"
                      : "🔴 Crítico"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Admin Modules Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Módulos Administrativos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={module.href} className="block group">
                    <Card className="hover:shadow-lg transition-all group-hover:scale-105">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`p-3 rounded-lg bg-gradient-to-r ${module.color}`}
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          {getStatusBadge(module.status)}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {module.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {module.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-bold text-gray-900">
                              {module.stats.value}
                            </div>
                            <div className="text-xs text-gray-500">
                              {module.stats.label}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-green-600">
                              {module.growth}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alertas do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemAlerts.map((alert) => {
              const Icon = alert.icon;
              return (
                <Alert key={alert.id}>
                  <Icon className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{alert.title}</div>
                        <div className="text-sm">{alert.message}</div>
                      </div>
                      <div className="text-xs text-gray-500">{alert.time}</div>
                    </div>
                  </AlertDescription>
                </Alert>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
