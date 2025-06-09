import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Zap,
  Shield,
  RefreshCw,
  Download,
  Monitor,
  Wifi,
  Thermometer,
  Network,
  Target,
  AlertCircle,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/providers/ThemeProvider";
import { usePermissions } from "@/hooks/usePermissions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

export default function SystemHealth() {
  const { isAdmin } = usePermissions();
  const { isDark } = useTheme();
  const [metrics, setMetrics] = useState<SystemMetrics>({
    server: {
      uptime: 99.97,
      cpu: 23.5,
      memory: 67.2,
      disk: 45.8,
      network: 89.3,
      temperature: 42,
      status: "healthy",
    },
    database: {
      connections: 147,
      queries: 2340,
      latency: 12.4,
      size: 2.3,
      status: "healthy",
    },
    application: {
      users: 1247,
      sessions: 892,
      requests: 15740,
      errors: 3,
      responseTime: 145,
      status: "healthy",
    },
    security: {
      threats: 0,
      blocked: 12,
      lastScan: "2024-01-25T10:30:00Z",
      status: "secure",
    },
  });

  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        server: {
          ...prev.server,
          cpu: Math.max(
            10,
            Math.min(90, prev.server.cpu + (Math.random() - 0.5) * 10),
          ),
          memory: Math.max(
            40,
            Math.min(85, prev.server.memory + (Math.random() - 0.5) * 5),
          ),
          network: Math.max(
            70,
            Math.min(100, prev.server.network + (Math.random() - 0.5) * 8),
          ),
          temperature: Math.max(
            35,
            Math.min(65, prev.server.temperature + (Math.random() - 0.5) * 3),
          ),
        },
        database: {
          ...prev.database,
          connections: Math.max(
            50,
            Math.min(
              200,
              prev.database.connections +
                Math.floor((Math.random() - 0.5) * 20),
            ),
          ),
          queries: prev.database.queries + Math.floor(Math.random() * 100),
          latency: Math.max(
            5,
            Math.min(50, prev.database.latency + (Math.random() - 0.5) * 5),
          ),
        },
        application: {
          ...prev.application,
          users: Math.max(
            1000,
            Math.min(
              1500,
              prev.application.users + Math.floor((Math.random() - 0.5) * 20),
            ),
          ),
          sessions: Math.max(
            500,
            Math.min(
              1000,
              prev.application.sessions +
                Math.floor((Math.random() - 0.5) * 15),
            ),
          ),
          requests: prev.application.requests + Math.floor(Math.random() * 500),
          responseTime: Math.max(
            100,
            Math.min(
              300,
              prev.application.responseTime + (Math.random() - 0.5) * 20,
            ),
          ),
        },
      }));
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  if (!isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertTitle>Acesso Restrito</AlertTitle>
          <AlertDescription>
            Esta página requer permissões de administrador para visualização.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "secure":
        return "text-green-600 dark:text-green-400";
      case "warning":
        return "text-yellow-600 dark:text-yellow-400";
      case "critical":
      case "compromised":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
      case "secure":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Saudável
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Atenção
          </Badge>
        );
      case "critical":
      case "compromised":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Crítico
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const overallHealth = () => {
    const statuses = [
      metrics.server.status,
      metrics.database.status,
      metrics.application.status,
      metrics.security.status === "secure"
        ? "healthy"
        : metrics.security.status,
    ];

    if (statuses.includes("critical") || statuses.includes("compromised")) {
      return "critical";
    }
    if (statuses.includes("warning")) {
      return "warning";
    }
    return "healthy";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
              System Health
            </Badge>
            {getStatusBadge(overallHealth())}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Monitoramento do Sistema
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Status em tempo real da infraestrutura Lawdesk
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className={cn(
              "transition-colors",
              isLive &&
                "border-green-500 text-green-600 bg-green-50 dark:bg-green-950",
            )}
          >
            <div
              className={cn(
                "w-2 h-2 rounded-full mr-2",
                isLive ? "bg-green-500 animate-pulse" : "bg-gray-400",
              )}
            />
            {isLive ? "Live" : "Pausado"}
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Relatório
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Alert
        className={cn(
          "border-0 shadow-md",
          overallHealth() === "healthy"
            ? "bg-green-50 dark:bg-green-950 border-green-200"
            : overallHealth() === "warning"
              ? "bg-yellow-50 dark:bg-yellow-950 border-yellow-200"
              : "bg-red-50 dark:bg-red-950 border-red-200",
        )}
      >
        <div className="flex items-center gap-3">
          {overallHealth() === "healthy" ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : overallHealth() === "warning" ? (
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
          <div className="flex-1">
            <AlertTitle className="text-lg">
              {overallHealth() === "healthy"
                ? "Todos os Sistemas Operacionais"
                : overallHealth() === "warning"
                  ? "Alguns Sistemas Requerem Atenção"
                  : "Problemas Críticos Detectados"}
            </AlertTitle>
            <AlertDescription>
              Última atualização: {lastUpdate.toLocaleTimeString("pt-BR")} •
              Uptime: {metrics.server.uptime}% •{metrics.application.users}{" "}
              usuários ativos
            </AlertDescription>
          </div>
        </div>
      </Alert>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Server Health */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Servidor
              </div>
              {getStatusBadge(metrics.server.status)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>CPU</span>
                  <span
                    className={cn(
                      metrics.server.cpu > 80
                        ? "text-red-600"
                        : metrics.server.cpu > 60
                          ? "text-yellow-600"
                          : "text-green-600",
                    )}
                  >
                    {metrics.server.cpu.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={metrics.server.cpu}
                  className={cn(
                    "h-2",
                    metrics.server.cpu > 80
                      ? "[&>div]:bg-red-500"
                      : metrics.server.cpu > 60
                        ? "[&>div]:bg-yellow-500"
                        : "[&>div]:bg-green-500",
                  )}
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Memória</span>
                  <span
                    className={cn(
                      metrics.server.memory > 80
                        ? "text-red-600"
                        : metrics.server.memory > 60
                          ? "text-yellow-600"
                          : "text-green-600",
                    )}
                  >
                    {metrics.server.memory.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={metrics.server.memory}
                  className={cn(
                    "h-2",
                    metrics.server.memory > 80
                      ? "[&>div]:bg-red-500"
                      : metrics.server.memory > 60
                        ? "[&>div]:bg-yellow-500"
                        : "[&>div]:bg-green-500",
                  )}
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Disco</span>
                  <span className="text-green-600">
                    {metrics.server.disk.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={metrics.server.disk}
                  className="h-2 [&>div]:bg-green-500"
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-orange-500" />
                <span>{metrics.server.temperature}°C</span>
              </div>
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-blue-500" />
                <span>{metrics.server.network.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database Health */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Banco de Dados
              </div>
              {getStatusBadge(metrics.database.status)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.database.connections}
                </p>
                <p className="text-xs text-gray-500">Conexões</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.database.queries.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Queries/min</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Latência</span>
                <span
                  className={cn(
                    metrics.database.latency > 30
                      ? "text-red-600"
                      : metrics.database.latency > 20
                        ? "text-yellow-600"
                        : "text-green-600",
                  )}
                >
                  {metrics.database.latency.toFixed(1)}ms
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tamanho</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {metrics.database.size.toFixed(1)} GB
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Health */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Aplicação
              </div>
              {getStatusBadge(metrics.application.status)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.application.users.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Usuários Online</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.application.sessions.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Sessões Ativas</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tempo Resposta</span>
                <span
                  className={cn(
                    metrics.application.responseTime > 250
                      ? "text-red-600"
                      : metrics.application.responseTime > 200
                        ? "text-yellow-600"
                        : "text-green-600",
                  )}
                >
                  {metrics.application.responseTime.toFixed(0)}ms
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Erros (24h)</span>
                <span
                  className={cn(
                    metrics.application.errors > 10
                      ? "text-red-600"
                      : metrics.application.errors > 5
                        ? "text-yellow-600"
                        : "text-green-600",
                  )}
                >
                  {metrics.application.errors}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Health */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança
              </div>
              {getStatusBadge(metrics.security.status)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {metrics.security.threats}
                </p>
                <p className="text-xs text-gray-500">Ameaças Ativas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {metrics.security.blocked}
                </p>
                <p className="text-xs text-gray-500">Bloqueios (24h)</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Último Scan</span>
                <span className="text-green-600">
                  {new Date(metrics.security.lastScan).toLocaleTimeString(
                    "pt-BR",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Status</span>
                <span className="text-green-600">✓ Protegido</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <RefreshCw className="h-6 w-6 mb-2" />
              <span className="text-sm">Reiniciar Serviços</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Database className="h-6 w-6 mb-2" />
              <span className="text-sm">Backup DB</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Shield className="h-6 w-6 mb-2" />
              <span className="text-sm">Scan Segurança</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Download className="h-6 w-6 mb-2" />
              <span className="text-sm">Export Logs</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
