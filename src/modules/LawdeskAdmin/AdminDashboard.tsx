import React, { useState, useEffect } from "react";
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
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "@/components/ui/recharts-enhanced";

const modules = [
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
    description: "Blueprint Builder, builds e deploys",
    icon: Settings,
    href: "/admin/desenvolvimento",
    color: "from-purple-500 to-purple-600",
    stats: { value: "47", label: "Deploys Este Mês" },
    status: "healthy",
    growth: "+15 deploys",
  },
  {
    id: "faturamento",
    title: "Faturamento",
    description: "Receitas, Stripe e gestão financeira",
    icon: CreditCard,
    href: "/admin/faturamento",
    color: "from-orange-500 to-orange-600",
    stats: { value: "94%", label: "Taxa Cobrança" },
    status: "healthy",
    growth: "+2.3%",
  },
  {
    id: "suporte",
    title: "Suporte B2B",
    description: "Tickets e atendimento aos clientes",
    icon: Headphones,
    href: "/admin/suporte",
    color: "from-cyan-500 to-cyan-600",
    stats: { value: "4.8", label: "Satisfação Média" },
    status: "healthy",
    growth: "+0.2 pontos",
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Campanhas e comunicação",
    icon: MessageSquare,
    href: "/admin/marketing",
    color: "from-pink-500 to-pink-600",
    stats: { value: "31%", label: "Open Rate" },
    status: "warning",
    growth: "-2.1%",
  },
  {
    id: "produtos",
    title: "Gestão de Produtos",
    description: "Planos SaaS e monetização",
    icon: Package,
    href: "/admin/produtos",
    color: "from-indigo-500 to-indigo-600",
    stats: { value: "8", label: "Planos Ativos" },
    status: "healthy",
    growth: "+1 novo plano",
  },
  {
    id: "seguranca",
    title: "Segurança",
    description: "Auditoria e conformidade LGPD",
    icon: Lock,
    href: "/admin/seguranca",
    color: "from-red-500 to-red-600",
    stats: { value: "100%", label: "Compliance Score" },
    status: "healthy",
    growth: "Estável",
  },
];

const quickStats = [
  {
    label: "Clientes Ativos",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    label: "Receita Mensal",
    value: "R$ 2.8M",
    change: "+8.3%",
    trend: "up",
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    label: "Uptime Sistema",
    value: "99.9%",
    change: "Estável",
    trend: "stable",
    icon: Activity,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    label: "Tarefas IA/Mês",
    value: "47.2K",
    change: "+23%",
    trend: "up",
    icon: Zap,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "deploy",
    title: "Deploy v2025.1 executado",
    description: "Sistema atualizado com novos recursos de IA",
    timestamp: "há 2 horas",
    icon: Rocket,
    color: "text-green-600",
  },
  {
    id: 2,
    type: "alert",
    title: "Pico de uso detectado",
    description: "Traffic aumentou 35% nas últimas 24h",
    timestamp: "há 4 horas",
    icon: TrendingUp,
    color: "text-orange-600",
  },
  {
    id: 3,
    type: "security",
    title: "Scan de segurança concluído",
    description: "Nenhuma vulnerabilidade encontrada",
    timestamp: "há 6 horas",
    icon: Shield,
    color: "text-blue-600",
  },
  {
    id: 4,
    type: "backup",
    title: "Backup automatizado",
    description: "Backup diário executado com sucesso",
    timestamp: "há 8 horas",
    icon: Database,
    color: "text-purple-600",
  },
];

const performanceData = [
  { time: "00:00", usuarios: 45, requests: 1200, responseTime: 180 },
  { time: "04:00", usuarios: 32, requests: 890, responseTime: 165 },
  { time: "08:00", usuarios: 78, requests: 2100, responseTime: 220 },
  { time: "12:00", usuarios: 156, requests: 4200, responseTime: 245 },
  { time: "16:00", usuarios: 189, requests: 5100, responseTime: 280 },
  { time: "20:00", usuarios: 134, requests: 3600, responseTime: 210 },
];

const moduleUsageData = [
  { name: "GED", value: 35, color: "#3B82F6" },
  { name: "CRM", value: 28, color: "#10B981" },
  { name: "IA Jurídica", value: 22, color: "#8B5CF6" },
  { name: "Atendimento", value: 15, color: "#F59E0B" },
];

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [activeView, setActiveView] = useState("overview");

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  useEffect(() => {
    setLastUpdate(new Date());
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center lg:text-left"
        >
          <div className="flex items-center gap-4 justify-center lg:justify-start mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Painel Administrativo Lawdesk
              </h1>
              <p className="text-gray-600">
                Sistema completo de administração interna
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-3 justify-center lg:justify-end">
          {lastUpdate && (
            <div className="text-sm text-gray-500 hidden sm:block">
              Última atualização: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
          <Button
            onClick={refreshData}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </>
            )}
          </Button>
          <Link to="/system-health">
            <Button
              variant="outline"
              size="sm"
              className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            >
              <MonitorCheck className="w-4 h-4 mr-2" />
              System Health
            </Button>
          </Link>
        </div>
      </div>

      {/* Critical Alerts */}
      <Alert className="border-orange-200 bg-orange-50">
        <Bell className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-700">
          <strong>Sistema em alta performance:</strong> Traffic aumentou 35% nas
          últimas 24h. Todos os sistemas operando normalmente.
        </AlertDescription>
      </Alert>

      {/* Dashboard Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="modules">Módulos</TabsTrigger>
          <TabsTrigger value="activity">Atividade</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                      >
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Badge
                        variant={stat.trend === "up" ? "default" : "secondary"}
                        className={
                          stat.trend === "up"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {stat.change}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Status do Sistema Lawdesk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    Operacional
                  </div>
                  <div className="text-sm text-green-700">
                    Todos os sistemas funcionando
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Timer className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    127 dias
                  </div>
                  <div className="text-sm text-blue-700">Uptime contínuo</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <Code className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">
                    v2025.1
                  </div>
                  <div className="text-sm text-purple-700">Versão atual</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <Cloud className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">AWS</div>
                  <div className="text-sm text-orange-700">Infraestrutura</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Users & Requests Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Usuários e Requests (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="usuarios"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Module Usage Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Uso por Módulo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={moduleUsageData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={(entry) => `${entry.name} (${entry.value}%)`}
                    >
                      {moduleUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Response Time Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="w-5 h-5" />
                Tempo de Resposta (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="responseTime"
                    stroke="#F59E0B"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link to={module.href}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-r ${module.color} flex items-center justify-center`}
                        >
                          <module.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(module.status)}
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              {module.stats.value}
                            </div>
                            <div className="text-xs text-gray-500">
                              {module.stats.label}
                            </div>
                          </div>
                        </div>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {module.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className={
                            module.status === "healthy"
                              ? "text-green-700 border-green-200"
                              : "text-yellow-700 border-yellow-200"
                          }
                        >
                          {module.growth}
                        </Badge>
                        <Progress
                          value={Math.random() * 100}
                          className="h-1 w-16"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Atividade Recente do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center`}
                    >
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.description}
                      </p>
                      <div className="text-xs text-gray-500 mt-2">
                        {activity.timestamp}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/desenvolvimento">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col gap-2"
              >
                <Code className="w-6 h-6" />
                <span className="text-xs">Deploy</span>
              </Button>
            </Link>
            <Link to="/admin/bi">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col gap-2"
              >
                <BarChart3 className="w-6 h-6" />
                <span className="text-xs">Analytics</span>
              </Button>
            </Link>
            <Link to="/admin/equipe">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col gap-2"
              >
                <Users className="w-6 h-6" />
                <span className="text-xs">Equipe</span>
              </Button>
            </Link>
            <Link to="/system-health">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col gap-2"
              >
                <MonitorCheck className="w-6 h-6" />
                <span className="text-xs">Health</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
