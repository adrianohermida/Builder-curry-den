import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/usePermissions";
import {
  Shield,
  Users,
  DollarSign,
  BarChart3,
  Crown,
  Activity,
  TrendingUp,
  PieChart,
  Code,
  CreditCard,
  Package,
  Lock,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  Rocket,
  MonitorCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function MobileAdminDashboard() {
  const { user } = usePermissions();

  const adminStats = [
    {
      title: "Usuários",
      value: "1.2k",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
      href: "/admin/equipe",
    },
    {
      title: "MRR",
      value: "R$ 284k",
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
      href: "/admin/faturamento",
    },
    {
      title: "Churn",
      value: "2.4%",
      icon: TrendingUp,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      href: "/admin/bi",
    },
    {
      title: "Health",
      value: "99.9%",
      icon: Activity,
      color: "text-green-600",
      bg: "bg-green-50",
      href: "/system-health",
    },
  ];

  const quickActions = [
    {
      title: "Business Intelligence",
      icon: PieChart,
      href: "/admin/bi",
      color: "text-blue-600",
    },
    {
      title: "Gestão de Equipe",
      icon: Users,
      href: "/admin/equipe",
      color: "text-green-600",
    },
    {
      title: "System Health",
      icon: MonitorCheck,
      href: "/system-health",
      color: "text-red-600",
    },
    {
      title: "Desenvolvimento",
      icon: Code,
      href: "/admin/desenvolvimento",
      color: "text-purple-600",
    },
  ];

  const systemTools = [
    {
      title: "Update Manager",
      icon: Target,
      href: "/update",
      badge: "2025",
      color: "text-blue-500",
    },
    {
      title: "Launch Control",
      icon: Rocket,
      href: "/launch",
      badge: "2025",
      color: "text-orange-500",
    },
    {
      title: "System Health",
      icon: MonitorCheck,
      href: "/system-health",
      badge: "Live",
      color: "text-green-500",
    },
    {
      title: "Segurança",
      icon: Lock,
      href: "/admin/seguranca",
      color: "text-red-500",
    },
  ];

  const recentActivities = [
    {
      title: "Novo usuário registrado",
      time: "2 min atrás",
      type: "success",
      icon: CheckCircle,
      user: "maria@cliente.com",
    },
    {
      title: "Sistema atualizado v2025.1",
      time: "1 hora atrás",
      type: "info",
      icon: Activity,
      user: "Sistema",
    },
    {
      title: "Backup realizado",
      time: "3 horas atrás",
      type: "success",
      icon: CheckCircle,
      user: "Automático",
    },
    {
      title: "Alerta SLA vencido",
      time: "5 horas atrás",
      type: "warning",
      icon: AlertTriangle,
      user: "Monitor",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Mobile Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-600" />
            Dashboard Admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Painel executivo e ferramentas
          </p>
        </div>

        <Badge variant="destructive" className="text-xs animate-pulse">
          🛡️ ADMIN
        </Badge>
      </div>

      {/* Stats Grid - 2x2 on mobile */}
      <div className="grid grid-cols-2 gap-3">
        {adminStats.map((stat, index) => (
          <Card key={index} className="p-0">
            <CardContent className="p-4">
              <Link to={stat.href} className="block">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </div>
                <div className="text-lg font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">
                  {stat.title}
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Admin Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Ferramentas Admin</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                asChild
                className="h-auto p-3 flex flex-col items-center gap-2"
              >
                <Link to={action.href}>
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                  <span className="text-xs text-center leading-tight">
                    {action.title}
                  </span>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Tools */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sistema 2025</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2">
            {systemTools.map((tool, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                asChild
                className="h-auto p-3 flex flex-col items-center gap-2 border border-dashed"
              >
                <Link to={tool.href}>
                  <div className="flex items-center gap-1">
                    <tool.icon className={`h-4 w-4 ${tool.color}`} />
                    {tool.badge && (
                      <Badge variant="secondary" className="text-xs h-4">
                        {tool.badge}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-center leading-tight">
                    {tool.title}
                  </span>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent System Activities */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Atividades do Sistema</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/logs">Ver logs</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <div
                className={`p-1.5 rounded-full ${
                  activity.type === "success"
                    ? "bg-green-100"
                    : activity.type === "warning"
                      ? "bg-yellow-100"
                      : "bg-blue-100"
                }`}
              >
                <activity.icon
                  className={`h-3 w-3 ${
                    activity.type === "success"
                      ? "text-green-600"
                      : activity.type === "warning"
                        ? "text-yellow-600"
                        : "text-blue-600"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.title}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                  <span className="text-xs text-muted-foreground">•</span>
                  <p className="text-xs text-muted-foreground">
                    {activity.user}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Status dos Serviços</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">API Gateway</span>
            <Badge
              variant="default"
              className="bg-green-100 text-green-800 text-xs"
            >
              Operacional
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Database</span>
            <Badge
              variant="default"
              className="bg-green-100 text-green-800 text-xs"
            >
              Operacional
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">CDN</span>
            <Badge
              variant="default"
              className="bg-green-100 text-green-800 text-xs"
            >
              Operacional
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Uptime</span>
            <span className="text-sm font-medium text-green-600">99.9%</span>
          </div>
        </CardContent>
      </Card>

      {/* Admin User Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-muted-foreground">
                Administrador do Sistema
              </p>
            </div>
            <Badge variant="destructive" className="text-xs">
              ADMIN
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="text-center text-xs text-muted-foreground py-4">
        <p>🛡️ Modo Administrativo Ativo</p>
        <p className="mt-1">Todas as ações são auditadas e registradas</p>
        <p className="mt-1">
          Última sincronização: {new Date().toLocaleString("pt-BR")}
        </p>
      </div>
    </div>
  );
}
