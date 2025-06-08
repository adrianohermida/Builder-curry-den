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
import { useViewMode } from "@/contexts/ViewModeContext";
import { usePermissions } from "@/hooks/usePermissions";
import {
  Scale,
  Shield,
  Users,
  FileText,
  DollarSign,
  Calendar,
  BarChart3,
  Crown,
  Activity,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  Bell,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function MobileDashboard() {
  const { isAdminMode, isClientMode } = useViewMode();
  const { user, isAdmin } = usePermissions();

  const clientStats = [
    {
      title: "Casos",
      value: "23",
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/ged-juridico",
    },
    {
      title: "Clientes",
      value: "156",
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-50",
      href: "/crm",
    },
    {
      title: "Receita",
      value: "45.2k",
      icon: DollarSign,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      href: "/financeiro",
    },
    {
      title: "Prazos",
      value: "8",
      icon: Clock,
      color: "text-red-600",
      bg: "bg-red-50",
      href: "/agenda",
    },
  ];

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
      value: "284k",
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

  const stats = isAdminMode ? adminStats : clientStats;

  const quickActions = isAdminMode
    ? [
        {
          title: "Business Intelligence",
          icon: BarChart3,
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
          icon: Activity,
          href: "/system-health",
          color: "text-red-600",
        },
        {
          title: "Configurações",
          icon: Shield,
          href: "/admin/seguranca",
          color: "text-purple-600",
        },
      ]
    : [
        {
          title: "Novo Cliente",
          icon: Plus,
          href: "/crm",
          color: "text-blue-600",
        },
        {
          title: "Agendar",
          icon: Calendar,
          href: "/agenda",
          color: "text-green-600",
        },
        {
          title: "Documentos",
          icon: FileText,
          href: "/ged-juridico",
          color: "text-yellow-600",
        },
        {
          title: "Atendimento",
          icon: Bell,
          href: "/atendimento",
          color: "text-purple-600",
        },
      ];

  const recentActivities = isAdminMode
    ? [
        {
          title: "Novo usuário registrado",
          time: "2 min atrás",
          type: "success",
          icon: CheckCircle,
        },
        {
          title: "Sistema atualizado",
          time: "1 hora atrás",
          type: "info",
          icon: Activity,
        },
        {
          title: "Backup realizado",
          time: "3 horas atrás",
          type: "success",
          icon: CheckCircle,
        },
      ]
    : [
        {
          title: "Documento adicionado",
          time: "30 min atrás",
          type: "success",
          icon: FileText,
        },
        {
          title: "Audiência agendada",
          time: "1 hora atrás",
          type: "info",
          icon: Calendar,
        },
        {
          title: "Prazo próximo",
          time: "2 horas atrás",
          type: "warning",
          icon: AlertCircle,
        },
      ];

  return (
    <div className="space-y-4">
      {/* Mobile Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            {isAdminMode ? (
              <>
                <Shield className="h-6 w-6 text-red-600" />
                Dashboard Admin
              </>
            ) : (
              <>
                <Scale className="h-6 w-6 text-blue-600" />
                Painel
              </>
            )}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isAdminMode ? "Visão executiva" : "Seus casos e atividades"}
          </p>
        </div>

        <Badge
          variant={isAdminMode ? "destructive" : "default"}
          className="text-xs"
        >
          {isAdminMode ? "🛡️ Admin" : "⚖️ Cliente"}
        </Badge>
      </div>

      {/* Stats Grid - 2x2 on mobile */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
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

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Ações Rápidas</CardTitle>
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

      {/* Recent Activities */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Atividades Recentes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to={isAdminMode ? "/admin/logs" : "/notifications"}>
                Ver todas
              </Link>
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
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* User Info Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">
                {user?.name?.charAt(0) || "U"}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              {user?.role}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* System Status for Admin */}
      {isAdminMode && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Status do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">API</span>
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
              <span className="text-sm">Uptime</span>
              <span className="text-sm font-medium">99.9%</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer Info */}
      <div className="text-center text-xs text-muted-foreground py-4">
        <p>Última sincronização: {new Date().toLocaleString("pt-BR")}</p>
        {isAdmin() && <p className="mt-1">Acesso administrativo ativo</p>}
      </div>
    </div>
  );
}
