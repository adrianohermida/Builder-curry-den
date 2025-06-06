import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Users,
  FileText,
  Clock,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Target,
  Award,
  Brain,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface DashboardAlert {
  id: string;
  type: "PRAZO" | "PUBLICACAO" | "ATENDIMENTO" | "SISTEMA";
  urgency: "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";
  title: string;
  description: string;
  time: string;
  module: string;
  action?: () => void;
}

interface ModuleMetrics {
  module: string;
  name: string;
  total: number;
  pending: number;
  completed: number;
  critical: number;
  trend: "up" | "down" | "stable";
  percentage: number;
}

interface ProductivityMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
}

export function IntegratedDashboard() {
  const [alerts, setAlerts] = useState<DashboardAlert[]>([]);
  const [moduleMetrics, setModuleMetrics] = useState<ModuleMetrics[]>([]);
  const [productivityMetrics, setProductivityMetrics] = useState<
    ProductivityMetric[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);

    try {
      // Simular carregamento de dados
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Alertas críticos
      setAlerts([
        {
          id: "1",
          type: "PRAZO",
          urgency: "CRITICA",
          title: "Prazo processual vencendo",
          description:
            "Contestação do processo 0001234-56.2024.8.26.0001 vence em 1 dia",
          time: "2h atrás",
          module: "Processos",
          action: () => toast.info("Redirecionando para o processo..."),
        },
        {
          id: "2",
          type: "PUBLICACAO",
          urgency: "ALTA",
          title: "Nova publicação urgente",
          description: "Intimação recebida do TJSP para processo em andamento",
          time: "5h atrás",
          module: "Publicações",
        },
        {
          id: "3",
          type: "ATENDIMENTO",
          urgency: "MEDIA",
          title: "Cliente aguardando retorno",
          description: "João Silva está aguardando resposta há 2 dias",
          time: "1 dia atrás",
          module: "Atendimento",
        },
        {
          id: "4",
          type: "SISTEMA",
          urgency: "BAIXA",
          title: "Backup realizado",
          description: "Backup automático concluído com sucesso",
          time: "6h atrás",
          module: "Sistema",
        },
      ]);

      // Métricas por módulo
      setModuleMetrics([
        {
          module: "CRM",
          name: "Clientes",
          total: 245,
          pending: 12,
          completed: 233,
          critical: 3,
          trend: "up",
          percentage: 95.1,
        },
        {
          module: "PROCESSOS",
          name: "Processos",
          total: 189,
          pending: 45,
          completed: 144,
          critical: 8,
          trend: "stable",
          percentage: 76.2,
        },
        {
          module: "ATENDIMENTO",
          name: "Atendimentos",
          total: 156,
          pending: 23,
          completed: 133,
          critical: 5,
          trend: "up",
          percentage: 85.3,
        },
        {
          module: "PUBLICACOES",
          name: "Publicações",
          total: 78,
          pending: 15,
          completed: 63,
          critical: 4,
          trend: "down",
          percentage: 80.8,
        },
        {
          module: "AGENDA",
          name: "Tarefas",
          total: 124,
          pending: 34,
          completed: 90,
          critical: 12,
          trend: "up",
          percentage: 72.6,
        },
      ]);

      // Métricas de produtividade
      setProductivityMetrics([
        {
          name: "SLA Atendimento",
          value: 94,
          target: 95,
          unit: "%",
          icon: <Target className="h-4 w-4" />,
          color: "text-green-600",
        },
        {
          name: "Prazos Cumpridos",
          value: 87,
          target: 90,
          unit: "%",
          icon: <Clock className="h-4 w-4" />,
          color: "text-yellow-600",
        },
        {
          name: "Satisfação Cliente",
          value: 4.8,
          target: 4.5,
          unit: "/5",
          icon: <Award className="h-4 w-4" />,
          color: "text-blue-600",
        },
        {
          name: "Eficiência IA",
          value: 92,
          target: 85,
          unit: "%",
          icon: <Brain className="h-4 w-4" />,
          color: "text-purple-600",
        },
      ]);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
      toast.error("Erro ao carregar dados do dashboard");
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "CRITICA":
        return "bg-red-500 text-white";
      case "ALTA":
        return "bg-orange-500 text-white";
      case "MEDIA":
        return "bg-yellow-500 text-white";
      default:
        return "bg-green-500 text-white";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "PRAZO":
        return <Clock className="h-4 w-4" />;
      case "PUBLICACAO":
        return <FileText className="h-4 w-4" />;
      case "ATENDIMENTO":
        return <Users className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Alertas Críticos */}
      {alerts.filter(
        (alert) => alert.urgency === "CRITICA" || alert.urgency === "ALTA",
      ).length > 0 && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <strong>Atenção!</strong> Você tem{" "}
            {
              alerts.filter(
                (alert) =>
                  alert.urgency === "CRITICA" || alert.urgency === "ALTA",
              ).length
            }{" "}
            alertas que requerem ação imediata.
          </AlertDescription>
        </Alert>
      )}

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {productivityMetrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-muted ${metric.color}`}>
                    {metric.icon}
                  </div>
                  <Badge
                    variant={
                      metric.value >= metric.target ? "default" : "secondary"
                    }
                  >
                    {metric.value >= metric.target ? "✓ Meta" : "Abaixo"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.name}
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <span className="text-sm text-muted-foreground">
                      {metric.unit}
                    </span>
                  </div>
                  <Progress
                    value={(metric.value / metric.target) * 100}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Meta: {metric.target}
                    {metric.unit}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="modules">Módulos</TabsTrigger>
          <TabsTrigger value="ai">IA Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resumo dos Módulos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-[rgb(var(--theme-primary))]" />
                  Desempenho por Módulo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {moduleMetrics.map((metric, index) => (
                    <motion.div
                      key={metric.module}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{metric.name}</span>
                          {getTrendIcon(metric.trend)}
                        </div>
                        <Badge variant="outline">{metric.total} total</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          {metric.percentage}%
                        </span>
                        <Progress
                          value={metric.percentage}
                          className="w-20 h-2"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Atividade Recente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-[rgb(var(--theme-primary))]" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {alerts.slice(0, 8).map((alert, index) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div
                          className={`p-1 rounded-full ${getUrgencyColor(alert.urgency)}`}
                        >
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {alert.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {alert.description}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <Badge variant="outline" className="text-xs">
                              {alert.module}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {alert.time}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`border-l-4 ${
                    alert.urgency === "CRITICA"
                      ? "border-l-red-500"
                      : alert.urgency === "ALTA"
                        ? "border-l-orange-500"
                        : alert.urgency === "MEDIA"
                          ? "border-l-yellow-500"
                          : "border-l-green-500"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`p-2 rounded-full ${getUrgencyColor(alert.urgency)}`}
                        >
                          {getAlertIcon(alert.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{alert.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {alert.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline">{alert.module}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {alert.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      {alert.action && (
                        <Button size="sm" onClick={alert.action}>
                          Ver
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moduleMetrics.map((metric, index) => (
              <motion.div
                key={metric.module}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{metric.name}</CardTitle>
                      {getTrendIcon(metric.trend)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-3xl font-bold">
                          {metric.total}
                        </span>
                        <Badge
                          variant={
                            metric.critical > 0 ? "destructive" : "default"
                          }
                        >
                          {metric.critical > 0
                            ? `${metric.critical} críticos`
                            : "OK"}
                        </Badge>
                      </div>

                      <Progress value={metric.percentage} className="h-2" />

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Pendentes</p>
                          <p className="font-medium">{metric.pending}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Concluídos</p>
                          <p className="font-medium">{metric.completed}</p>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="w-full">
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-[rgb(var(--theme-primary))]" />
                  Insights da IA Jurídica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800 dark:text-blue-200">
                      Recomendação Urgente
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    3 processos requerem atenção imediata com base na análise de
                    prazos processuais.
                  </p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800 dark:text-green-200">
                      Eficiência Detectada
                    </span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    IA identificou 15% de melhoria na classificação automática
                    de publicações.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-800 dark:text-purple-200">
                      Aprendizado
                    </span>
                  </div>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Modelo treinado com 245 novos casos esta semana, melhorando
                    precisão em 8%.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-[rgb(var(--theme-primary))]" />
                  Conformidade e Segurança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backup LGPD</span>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      OK
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Criptografia AES-256</span>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Ativo
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auditoria de Acessos</span>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Monitorando
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Logs de Integridade</span>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Sincronizado
                    </Badge>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full mt-4">
                  <FileText className="h-4 w-4 mr-2" />
                  Relatório de Conformidade
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
