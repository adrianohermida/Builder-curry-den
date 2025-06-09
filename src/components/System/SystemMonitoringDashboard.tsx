/**
 * 📊 Sistema de Monitoramento Dashboard - Lawdesk CRM v2.5.0
 *
 * Dashboard completo para monitoramento:
 * - Performance metrics em tempo real
 * - Health check dos módulos
 * - Alertas do sistema
 * - Recomendações automáticas
 *
 * @version 2.5.0
 * @since 2025-01-21
 */

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  Globe,
  MonitorCheck,
  RefreshCw,
  Shield,
  TrendingDown,
  TrendingUp,
  Zap,
  BarChart3,
  Eye,
  Download,
  Settings,
  Bell,
  Gauge,
  Wifi,
  WifiOff,
  Server,
  AlertCircle,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  performanceMonitor,
  PerformanceMetrics,
  PerformanceAlert,
} from "@/services/performanceMonitor";
import {
  healthChecker,
  SystemHealth,
  ModuleHealth,
} from "@/services/healthCheck";

interface MonitoringState {
  performance: PerformanceMetrics;
  health: SystemHealth;
  alerts: PerformanceAlert[];
  isLoading: boolean;
  lastUpdate: Date;
}

export const SystemMonitoringDashboard: React.FC = () => {
  const [state, setState] = useState<MonitoringState>({
    performance: performanceMonitor.getMetrics(),
    health: healthChecker.getHealthData(),
    alerts: performanceMonitor.getActiveAlerts(),
    isLoading: true,
    lastUpdate: new Date(),
  });

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTab, setSelectedTab] = useState("overview");

  /**
   * 🔄 Atualiza dados do monitoramento
   */
  const updateMonitoringData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const [performance, health, alerts] = await Promise.all([
        Promise.resolve(performanceMonitor.getMetrics()),
        healthChecker.performFullHealthCheck(),
        Promise.resolve(performanceMonitor.getActiveAlerts()),
      ]);

      setState({
        performance,
        health,
        alerts,
        isLoading: false,
        lastUpdate: new Date(),
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      console.error("Erro ao atualizar dados de monitoramento:", error);
    }
  }, []);

  /**
   * 🔄 Auto-refresh dos dados
   */
  useEffect(() => {
    updateMonitoringData();

    if (autoRefresh) {
      const interval = setInterval(updateMonitoringData, 30000); // 30 segundos
      return () => clearInterval(interval);
    }
  }, [autoRefresh, updateMonitoringData]);

  /**
   * 🎨 Determina cor baseada no status
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600";
      case "degraded":
        return "text-yellow-600";
      case "unhealthy":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  /**
   * 📊 Calcula score de performance
   */
  const getPerformanceScore = () => {
    const { lcp, fid, cls } = state.performance;
    let score = 100;

    if (lcp > 2500) score -= 20;
    if (fid > 100) score -= 15;
    if (cls > 0.1) score -= 10;

    return Math.max(0, score);
  };

  /**
   * 📊 Renderiza overview geral
   */
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Geral</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {state.health.overall === "healthy" ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : state.health.overall === "degraded" ? (
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-600" />
              )}
              <span
                className={`text-2xl font-bold ${getStatusColor(state.health.overall)}`}
              >
                {state.health.overall === "healthy"
                  ? "Saudável"
                  : state.health.overall === "degraded"
                    ? "Degradado"
                    : "Problemático"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Última verificação: {state.lastUpdate.toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getPerformanceScore()}/100
            </div>
            <Progress value={getPerformanceScore()} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Core Web Vitals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthChecker.getUptimeFormatted()}
            </div>
            <p className="text-xs text-muted-foreground">Sistema online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {state.alerts.length}
            </div>
            <p className="text-xs text-muted-foreground">Alertas ativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas Críticos */}
      {state.alerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">🚨 Alertas Ativos</h3>
          {state.alerts.slice(0, 3).map((alert) => (
            <Alert
              key={alert.id}
              className={
                alert.type === "critical"
                  ? "border-red-500"
                  : "border-yellow-500"
              }
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{alert.metric.toUpperCase()}:</strong>{" "}
                {alert.value.toFixed(2)}
                (limite: {alert.threshold}) -{" "}
                {alert.type === "critical" ? "CRÍTICO" : "AVISO"}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Grid de Módulos */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">📦 Status dos Módulos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.health.modules.map((module) => (
            <Card key={module.name}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{module.name}</CardTitle>
                  <Badge
                    variant={
                      module.status.status === "healthy"
                        ? "default"
                        : module.status.status === "degraded"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {module.status.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Tempo de resposta: {module.status.responseTime.toFixed(0)}ms
                </div>
                {module.status.error && (
                  <div className="text-xs text-red-600 mt-1">
                    {module.status.error}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  /**
   * 📊 Renderiza métricas detalhadas
   */
  const renderMetrics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              LCP (Largest Contentful Paint)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(state.performance.lcp / 1000).toFixed(2)}s
            </div>
            <Progress
              value={Math.min(
                100,
                (2500 / Math.max(state.performance.lcp, 1)) * 100,
              )}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Meta: &lt; 2.5s
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">FID (First Input Delay)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {state.performance.fid.toFixed(0)}ms
            </div>
            <Progress
              value={Math.min(
                100,
                (100 / Math.max(state.performance.fid, 1)) * 100,
              )}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Meta: &lt; 100ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              CLS (Cumulative Layout Shift)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {state.performance.cls.toFixed(3)}
            </div>
            <Progress
              value={Math.min(
                100,
                (0.1 / Math.max(state.performance.cls, 0.001)) * 100,
              )}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">Meta: &lt; 0.1</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">API Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {state.performance.apiResponseTime.toFixed(0)}ms
            </div>
            <Progress
              value={Math.min(
                100,
                (1000 / Math.max(state.performance.apiResponseTime, 1)) * 100,
              )}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">Meta: &lt; 1s</p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Taxa de Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {(state.performance.errorRate * 100).toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Satisfação do Usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {(state.performance.userSatisfaction * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Bundle Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(state.performance.bundleSize / 1024 / 1024).toFixed(1)}MB
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sistema de Monitoramento</h1>
          <p className="text-muted-foreground">
            Monitoramento em tempo real do Lawdesk CRM v2.5.0
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`}
            />
            Auto-refresh: {autoRefresh ? "ON" : "OFF"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={updateMonitoringData}
            disabled={state.isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${state.isLoading ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="health">Saúde do Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          {renderMetrics()}
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* APIs Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status das APIs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(state.health.apis).map(([name, status]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center space-x-2">
                      {status.status === "healthy" ? (
                        <Wifi className="h-4 w-4 text-green-600" />
                      ) : (
                        <WifiOff className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-medium">{name}</span>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          status.status === "healthy"
                            ? "default"
                            : "destructive"
                        }
                        className="mb-1"
                      >
                        {status.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {status.responseTime.toFixed(0)}ms
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Módulos Críticos */}
            <Card>
              <CardHeader>
                <CardTitle>Módulos Críticos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {state.health.modules
                  .filter(
                    (m) =>
                      m.criticalLevel === "critical" ||
                      m.criticalLevel === "high",
                  )
                  .map((module) => (
                    <div
                      key={module.name}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div className="flex items-center space-x-2">
                        {module.status.status === "healthy" ? (
                          <Server className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="font-medium">{module.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {module.criticalLevel}
                        </Badge>
                      </div>
                      <Badge
                        variant={
                          module.status.status === "healthy"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {module.status.status}
                      </Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Status Bar */}
      <div className="fixed bottom-4 right-4 bg-background border rounded-lg p-3 shadow-lg">
        <div className="flex items-center space-x-2 text-sm">
          <div
            className={`w-2 h-2 rounded-full ${
              state.health.overall === "healthy"
                ? "bg-green-500"
                : state.health.overall === "degraded"
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }`}
          />
          <span>Sistema {state.health.overall}</span>
          <Separator orientation="vertical" className="h-4" />
          <span>{healthChecker.getUptimeFormatted()}</span>
        </div>
      </div>
    </div>
  );
};
