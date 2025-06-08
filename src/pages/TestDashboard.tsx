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
} from "lucide-react";

export default function TestDashboard() {
  const { isAdminMode, isClientMode, currentMode } = useViewMode();
  const { user, isAdmin } = usePermissions();

  const clientStats = [
    {
      title: "Casos Ativos",
      value: "23",
      icon: FileText,
      color: "text-blue-600",
    },
    { title: "Clientes", value: "156", icon: Users, color: "text-green-600" },
    {
      title: "Receita Mensal",
      value: "R$ 45.2k",
      icon: DollarSign,
      color: "text-yellow-600",
    },
    {
      title: "Próximos Prazos",
      value: "8",
      icon: Calendar,
      color: "text-red-600",
    },
  ];

  const adminStats = [
    {
      title: "Total de Usuários",
      value: "1,247",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "MRR",
      value: "R$ 284.7k",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Churn Rate",
      value: "2.4%",
      icon: BarChart3,
      color: "text-yellow-600",
    },
    {
      title: "System Health",
      value: "99.9%",
      icon: Shield,
      color: "text-green-600",
    },
  ];

  const stats = isAdminMode ? adminStats : clientStats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            {isAdminMode ? (
              <>
                <Shield className="h-8 w-8 text-red-600" />
                Dashboard Administrativo
              </>
            ) : (
              <>
                <Scale className="h-8 w-8 text-blue-600" />
                Painel Jurídico
              </>
            )}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isAdminMode
              ? "Visão geral completa do sistema e métricas executivas"
              : "Gerencie seus casos, clientes e atividades jurídicas"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant={isAdminMode ? "destructive" : "default"}
            className="text-sm"
          >
            {isAdminMode ? "🛡️ Modo Admin" : "⚖️ Modo Cliente"}
          </Badge>

          {isAdmin() && (
            <Badge variant="outline" className="text-sm">
              Acesso Total
            </Badge>
          )}
        </div>
      </div>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-medium">{user?.name || "Usuário"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">E-mail</p>
              <p className="font-medium">
                {user?.email || "email@exemplo.com"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Perfil</p>
              <Badge variant="secondary">{user?.role || "guest"}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {isAdminMode ? "Último mês" : "Casos ativos"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mode-specific content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isAdminMode ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-purple-600" />
                  Ferramentas Administrativas
                </CardTitle>
                <CardDescription>
                  Acesso rápido às principais funcionalidades administrativas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Business Intelligence
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Gestão de Equipe
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Métricas do Sistema
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Logs de Auditoria
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status do Sistema</CardTitle>
                <CardDescription>
                  Monitoramento em tempo real da infraestrutura
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Status</span>
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    Operacional
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    Operacional
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">CDN</span>
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
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
          </>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-blue-600" />
                  Atividades Recentes
                </CardTitle>
                <CardDescription>
                  Últimas movimentações nos seus casos jurídicos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Novo documento adicionado
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Processo 123/2024 - 2 horas atrás
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Audiência agendada</p>
                    <p className="text-xs text-muted-foreground">
                      Cliente Maria Silva - 1 dia atrás
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Prazo se aproximando</p>
                    <p className="text-xs text-muted-foreground">
                      Contestação - 3 dias restantes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Próximos Compromissos</CardTitle>
                <CardDescription>
                  Agenda de audiências e prazos importantes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">
                      Audiência - Caso Silva vs. Santos
                    </p>
                    <p className="text-xs text-muted-foreground">Hoje, 14:30</p>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    Urgente
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">
                      Entrega de Contestação
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Amanhã, 17:00
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Pendente
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Footer Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Sistema carregado em modo{" "}
              {isAdminMode ? "administrativo" : "cliente"}.
              {isAdmin() &&
                " Você tem acesso total a todas as funcionalidades."}
            </p>
            <p className="mt-1">
              Última sincronização: {new Date().toLocaleString("pt-BR")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
