import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Server,
  Database,
  Cpu,
  HardDrive,
  Globe,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Settings,
  Bell,
  BarChart3,
  Monitor,
  Wifi,
  Battery,
  Thermometer,
  Network,
  FileText,
  Lock,
  Unlock,
  Calendar,
  Timer,
  Target,
  AlertCircle,
  Info,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "@/components/ui/recharts-enhanced";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuditSystem } from "@/hooks/useAuditSystem";
import { toast } from "sonner";

interface SystemMetrics {
  server: {
    uptime: number;
    cpu: number;
    memory: number;
    disk: number;
    network: number;
    temperature: number;
    status: "healthy" | "warning" | "critical";
  };
  database: {
    connections: number;
    queries: number;
    latency: number;
    size: number;
    status: "healthy" | "warning" | "critical";
  };
  application: {
    users: number;
    sessions: number;
    requests: number;
    errors: number;
    responseTime: number;
    status: "healthy" | "warning" | "critical";
  };
  security: {
    threats: number;
    blocked: number;
    lastScan: string;
    status: "secure" | "warning" | "compromised";
  };
}

interface Alert {
  id: string;
  type: "info" | "warning" | "error" | "critical";
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  source: string;
}

interface PerformanceData {
  timestamp: string;
  cpu: number;
  memory: number;
  network: number;
  requests: number;
  responseTime: number;
}

export default function SystemHealth() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { isAdmin } = usePermissions();
  const { getLogsSummary } = useAuditSystem();

  // Mock data loading
  useEffect(() => {
    const loadSystemData = async () => {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockMetrics: SystemMetrics = {
        server: {
          uptime: 99.98,
          cpu: 23.5,
          memory: 67.2,
          disk: 45.8,
          network: 12.3,
          temperature: 42,
          status: "healthy",
        },
        database: {
          connections: 85,
          queries: 1247,
          latency: 2.3,
          size: 15.6, // GB
          status: "healthy",
        },
        application: {
          users: 156,
          sessions: 89,
          requests: 15420,
          errors: 3,
          responseTime: 245,
          status: "healthy",
        },
        security: {
          threats: 0,
          blocked: 12,
          lastScan: new Date().toISOString(),
          status: "secure",
        },
      };

      const mockAlerts: Alert[] = [
        {
          id: "alert-001",
          type: "warning",
          title: "Alto uso de memória",
          message:
            "O uso de memória está acima de 65%. Considere otimizar as consultas.",
          timestamp: new Date(Date.now() - 300000).toISOString(),
          acknowledged: false,
          source: "server",
        },
        {
          id: "alert-002",
          type: "info",
          title: "Backup concluído",
          message: "Backup diário executado com sucesso às 02:00.",
          timestamp: new Date(Date.now() - 21600000).toISOString(),
          acknowledged: true,
          source: "database",
        },
      ];

      // Generate mock performance data
      const mockPerformanceData: PerformanceData[] = [];
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(Date.now() - i * 60000).toISOString();
        mockPerformanceData.push({
          timestamp,
          cpu: Math.random() * 40 + 10,
          memory: Math.random() * 30 + 50,
          network: Math.random() * 20 + 5,
          requests: Math.floor(Math.random() * 500 + 200),
          responseTime: Math.random() * 300 + 100,
        });
      }

      setMetrics(mockMetrics);
      setAlerts(mockAlerts);
      setPerformanceData(mockPerformanceData);
      setIsLoading(false);
    };

    loadSystemData();
  }, []);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // In a real app, this would fetch fresh data
      toast.info("Dados atualizados", { duration: 1000 });
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "secure":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "critical":
      case "compromised":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "secure":
        return "text-green-600 bg-green-50";
      case "warning":
        return "text-yellow-600 bg-yellow-50";
      case "critical":
      case "compromised":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert,
      ),
    );
    toast.success("Alerta confirmado");
  };

  if (!isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Acesso Restrito</h3>
          <p className="text-muted-foreground">
            Apenas administradores podem acessar o monitoramento do sistema.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading || !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Carregando métricas do sistema...
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
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            Sistema - Monitoramento
          </h1>
          <p className="text-muted-foreground">
            Monitoramento em tempo real da saúde e performance do sistema
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Auto-refresh
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Manual
              </>
            )}
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Relatório
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {alerts.filter(
        (alert) => !alert.acknowledged && alert.type === "critical",
      ).length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-600">Alertas Críticos</AlertTitle>
          <AlertDescription>
            Existem{" "}
            {
              alerts.filter(
                (alert) => !alert.acknowledged && alert.type === "critical",
              ).length
            }{" "}
            alertas críticos que requerem atenção imediata.
          </AlertDescription>
        </Alert>
      )}

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Server Health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servidor</CardTitle>
            {getStatusIcon(metrics.server.status)}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>CPU</span>
                  <span>{metrics.server.cpu}%</span>
                </div>
                <Progress value={metrics.server.cpu} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Memória</span>
                  <span>{metrics.server.memory}%</span>
                </div>
                <Progress value={metrics.server.memory} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Disco</span>
                  <span>{metrics.server.disk}%</span>
                </div>
                <Progress value={metrics.server.disk} className="h-2" />
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Thermometer className="h-3 w-3" />
                  {metrics.server.temperature}°C
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {metrics.server.uptime}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database Health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Banco de Dados
            </CardTitle>
            {getStatusIcon(metrics.database.status)}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Conexões</span>
                <span className="text-sm font-medium">
                  {metrics.database.connections}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Consultas/min
                </span>
                <span className="text-sm font-medium">
                  {metrics.database.queries}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Latência</span>
                <span className="text-sm font-medium">
                  {metrics.database.latency}ms
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tamanho</span>
                <span className="text-sm font-medium">
                  {metrics.database.size} GB
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aplicação</CardTitle>
            {getStatusIcon(metrics.application.status)}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Usuários Online
                </span>
                <span className="text-sm font-medium">
                  {metrics.application.users}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Sessões Ativas
                </span>
                <span className="text-sm font-medium">
                  {metrics.application.sessions}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Requisições/h
                </span>
                <span className="text-sm font-medium">
                  {metrics.application.requests}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Tempo Resposta
                </span>
                <span className="text-sm font-medium">
                  {metrics.application.responseTime}ms
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Segurança</CardTitle>
            {getStatusIcon(metrics.security.status)}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Ameaças Detectadas
                </span>
                <span className="text-sm font-medium text-red-600">
                  {metrics.security.threats}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  IPs Bloqueados
                </span>
                <span className="text-sm font-medium">
                  {metrics.security.blocked}
                </span>
              </div>

              <div className="text-xs text-muted-foreground">
                Último scan:{" "}
                {new Date(metrics.security.lastScan).toLocaleString("pt-BR")}
              </div>

              <Badge
                variant="outline"
                className={getStatusColor(metrics.security.status)}
              >
                {metrics.security.status === "secure" ? "Seguro" : "Atenção"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Monitoring */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CPU & Memory Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  CPU e Memória (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) =>
                        new Date(value).toLocaleString("pt-BR")
                      }
                      formatter={(value: number, name: string) => [
                        `${value.toFixed(1)}%`,
                        name === "cpu" ? "CPU" : "Memória",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="cpu"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="memory"
                      stackId="1"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Tempo de Resposta (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) =>
                        new Date(value).toLocaleString("pt-BR")
                      }
                      formatter={(value: number) => [
                        `${value.toFixed(0)}ms`,
                        "Tempo de Resposta",
                      ]}
                    />
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
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Alertas do Sistema
                </span>
                <Badge variant="secondary">
                  {alerts.filter((alert) => !alert.acknowledged).length} não
                  confirmados
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border ${
                        alert.acknowledged ? "bg-muted/50" : "bg-background"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {alert.type === "critical" && (
                            <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                          )}
                          {alert.type === "error" && (
                            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                          )}
                          {alert.type === "warning" && (
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                          )}
                          {alert.type === "info" && (
                            <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                          )}

                          <div className="flex-1">
                            <h4 className="font-medium">{alert.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {alert.message}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Fonte: {alert.source}</span>
                              <span>
                                {new Date(alert.timestamp).toLocaleString(
                                  "pt-BR",
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {!alert.acknowledged && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => acknowledgeAlert(alert.id)}
                          >
                            Confirmar
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Logs do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Logs do Sistema</h3>
                <p>Visualização de logs em tempo real será implementada aqui</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Usuários Online
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  Monitoramento de Usuários
                </h3>
                <p>Sessões ativas e análise de uso será implementada aqui</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
