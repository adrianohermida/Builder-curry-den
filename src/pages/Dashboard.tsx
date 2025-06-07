import { memo, useMemo } from "react";
import {
  Scale,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  FileText,
  CheckSquare,
  AlertTriangle,
  Activity,
  BarChart3,
} from "lucide-react";
import { DashboardCard } from "@/components/Dashboard/DashboardCard";
import { SLAMetrics } from "@/components/Dashboard/SLAMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Memoized hearing card component
const HearingCard = memo(({ hearing }: { hearing: any }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
  >
    <div className="flex-1">
      <p className="text-sm font-medium">{hearing.case}</p>
      <p className="text-xs text-muted-foreground">{hearing.client}</p>
      <div className="flex items-center gap-2 mt-1">
        <Badge variant={hearing.status === "confirmed" ? "default" : "secondary"} className="text-xs">
          {hearing.status === "confirmed" ? "Confirmada" : "Pendente"}
        </Badge>
        <span className="text-xs text-muted-foreground">{hearing.type}</span>
      </div>
    </div>
    <div className="text-right text-xs text-muted-foreground">
      <p>{new Date(hearing.date).toLocaleDateString('pt-BR')}</p>
      <p>{hearing.time}</p>
    </div>
  </motion.div>
));

// Memoized case area card
const CaseAreaCard = memo(({ area }: { area: any }) => (
  <div className="flex items-center justify-between p-3 border rounded-lg">
    <div>
      <p className="text-sm font-medium">{area.area}</p>
      <p className="text-xs text-muted-foreground">{area.count} casos</p>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold">{area.percentage}%</p>
      <div className="w-12 h-2 bg-secondary rounded-full overflow-hidden mt-1">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${area.percentage}%` }}
        />
      </div>
    </div>
  </div>
));

const Dashboard = memo(() => {
  const upcomingHearings = [
    {
      id: 1,
      case: "Processo 1234567-89.2024.8.26.0001",
      client: "João Silva",
      date: "2024-12-20",
      time: "14:30",
      type: "Audiência de Conciliação",
      status: "confirmed",
    },
    {
      id: 2,
      case: "Processo 9876543-21.2024.8.26.0001",
      client: "Maria Santos",
      date: "2024-12-22",
      time: "09:00",
      type: "Audiência de Instrução",
      status: "pending",
    },
    {
      id: 3,
      case: "Processo 5555555-55.2024.8.26.0001",
      client: "Empresa XYZ Ltda",
      date: "2024-12-23",
      time: "16:00",
      type: "Audiência de Julgamento",
      status: "confirmed",
    },
  ];

  const casesByArea = [
    { area: "Direito Civil", count: 45, percentage: 35 },
    { area: "Direito Trabalhista", count: 32, percentage: 25 },
    { area: "Direito Penal", count: 26, percentage: 20 },
    { area: "Direito Empresarial", count: 19, percentage: 15 },
    { area: "Outros", count: 6, percentage: 5 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Painel Jurídico</h1>
        <p className="text-muted-foreground">
          Visão geral das atividades e métricas do escritório
        </p>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Total de Casos"
          value="128"
          description="Casos ativos no sistema"
          icon={Scale}
          trend={{ value: 12, isPositive: true }}
        />
        <DashboardCard
          title="Clientes Ativos"
          value="89"
          description="Clientes com casos em andamento"
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <DashboardCard
          title="Audiências Este Mês"
          value="24"
          description="Audiências agendadas"
          icon={Calendar}
          trend={{ value: -5, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cases by Area Chart */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-[rgb(var(--theme-primary))]" />
              <span>Casos por Área Jurídica</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {casesByArea.map((item) => (
              <div key={item.area} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.area}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.count} casos ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-[rgb(var(--theme-primary))] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* SLA Metrics */}
        <SLAMetrics />
      </div>

      {/* Upcoming Hearings Timeline */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-[rgb(var(--theme-primary))]" />
              <span>Audiências dos Próximos 30 Dias</span>
            </div>
            <Button variant="outline" size="sm">
              Ver Todas
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingHearings.map((hearing) => (
              <div
                key={hearing.id}
                className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-[rgb(var(--theme-primary))] mt-2" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{hearing.type}</h4>
                    <Badge
                      variant={
                        hearing.status === "confirmed" ? "default" : "secondary"
                      }
                    >
                      {hearing.status === "confirmed"
                        ? "Confirmada"
                        : "Pendente"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {hearing.client} • {hearing.case}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>
                      {new Date(hearing.date).toLocaleDateString("pt-BR")}
                    </span>
                    <span>{hearing.time}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}