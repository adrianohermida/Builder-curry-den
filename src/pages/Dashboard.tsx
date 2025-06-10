import { memo, useMemo, useState, useEffect } from "react";
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
  Bell,
  Award,
  Target,
  Zap,
} from "lucide-react";
import { DashboardCard } from "@/components/Dashboard/DashboardCard";
import { SLAMetrics } from "@/components/Dashboard/SLAMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Memoized hearing card component
const HearingCard = memo(({ hearing }: { hearing: any }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
  >
    <div className="flex-1">
      <p className="text-sm font-medium line-clamp-1">{hearing.case}</p>
      <p className="text-xs text-muted-foreground">{hearing.client}</p>
      <div className="flex items-center gap-2 mt-1">
        <Badge
          variant={hearing.status === "confirmed" ? "default" : "secondary"}
          className="text-xs"
        >
          {hearing.status === "confirmed" ? "Confirmada" : "Pendente"}
        </Badge>
        <span className="text-xs text-muted-foreground">{hearing.type}</span>
      </div>
    </div>
    <div className="text-right text-xs text-muted-foreground">
      <p>{new Date(hearing.date).toLocaleDateString("pt-BR")}</p>
      <p className="font-medium">{hearing.time}</p>
    </div>
  </motion.div>
));

// Memoized case area card
const CaseAreaCard = memo(({ area }: { area: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/30 transition-colors"
  >
    <div>
      <p className="text-sm font-medium">{area.area}</p>
      <p className="text-xs text-muted-foreground">{area.count} casos</p>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold">{area.percentage}%</p>
      <div className="w-12 h-2 bg-secondary rounded-full overflow-hidden mt-1">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${area.percentage}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-full bg-primary"
        />
      </div>
    </div>
  </motion.div>
));

// Memoized quick action card
const QuickActionCard = memo(({ action }: { action: any }) => (
  <Link to={action.href}>
    <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}
          >
            <action.icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-sm">{action.title}</p>
            <p className="text-xs text-muted-foreground">
              {action.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
));

const Dashboard = memo(() => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Memoized data to prevent unnecessary re-calculations
  const upcomingHearings = useMemo(
    () => [
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
    ],
    [],
  );

  const casesByArea = useMemo(
    () => [
      { area: "Direito Civil", count: 45, percentage: 35 },
      { area: "Direito Trabalhista", count: 32, percentage: 25 },
      { area: "Direito Penal", count: 26, percentage: 20 },
      { area: "Direito Tributário", count: 16, percentage: 12 },
      { area: "Direito Administrativo", count: 10, percentage: 8 },
    ],
    [],
  );

  const quickActions = useMemo(
    () => [
      {
        title: "Novo Cliente",
        description: "Cadastrar cliente",
        icon: Users,
        href: "/crm",
        color: "bg-blue-500",
      },
      {
        title: "Nova Tarefa",
        description: "Criar tarefa",
        icon: CheckSquare,
        href: "/tarefas",
        color: "bg-green-500",
      },
      {
        title: "Consultar GED",
        description: "Buscar documentos",
        icon: FileText,
        href: "/crm/ged",
        color: "bg-purple-500",
      },
      {
        title: "Agenda",
        description: "Ver compromissos",
        icon: Calendar,
        href: "/agenda",
        color: "bg-orange-500",
      },
      {
        title: "Publicações",
        description: "Verificar intimações",
        icon: Bell,
        href: "/publicacoes",
        color: "bg-red-500",
      },
      {
        title: "IA Jurídica",
        description: "Análise inteligente",
        icon: Zap,
        href: "/ai",
        color: "bg-indigo-500",
      },
    ],
    [],
  );

  const dashboardStats = useMemo(
    () => [
      {
        title: "Clientes Ativos",
        value: "247",
        change: "+12%",
        changeType: "positive" as const,
        icon: Users,
        description: "Em relação ao mês anterior",
      },
      {
        title: "Processos em Andamento",
        value: "89",
        change: "+5%",
        changeType: "positive" as const,
        icon: Scale,
        description: "Casos ativos no sistema",
      },
      {
        title: "Tarefas Pendentes",
        value: "23",
        change: "-8%",
        changeType: "negative" as const,
        icon: CheckSquare,
        description: "Tarefas não concluídas",
      },
      {
        title: "Audiências Esta Semana",
        value: "12",
        change: "+3",
        changeType: "positive" as const,
        icon: Calendar,
        description: "Agendadas para os próximos 7 dias",
      },
    ],
    [],
  );

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse p-6">
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-muted rounded" />
          <div className="h-96 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Painel Jurídico</h1>
          <p className="text-muted-foreground">
            Visão geral do escritório e atividades recentes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Activity className="h-3 w-3" />
            Sistema Ativo
          </Badge>
          <Button variant="outline" size="sm">
            <Target className="h-4 w-4 mr-2" />
            Metas
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <DashboardCard
              title={stat.title}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              icon={stat.icon}
              description={stat.description}
            />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <QuickActionCard action={action} />
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Hearings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximas Audiências
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingHearings.map((hearing, index) => (
                <motion.div
                  key={hearing.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <HearingCard hearing={hearing} />
                </motion.div>
              ))}
              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/agenda">
                    <Calendar className="h-4 w-4 mr-2" />
                    Ver Agenda Completa
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cases by Area */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Casos por Área
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {casesByArea.map((area, index) => (
                <motion.div
                  key={area.area}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <CaseAreaCard area={area} />
                </motion.div>
              ))}
              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/crm">
                    <Users className="h-4 w-4 mr-2" />
                    Ver Todos os Casos
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* SLA Metrics and Integrated Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <SLAMetrics />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Performance do Escritório
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Taxa de Sucesso em Casos</span>
                  <span className="font-medium">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Satisfação do Cliente</span>
                  <span className="font-medium">94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Prazo Médio de Resolução</span>
                  <span className="font-medium">12 dias</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Utilização da IA</span>
                  <span className="font-medium">68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
});

Dashboard.displayName = "Dashboard";

export default Dashboard;
