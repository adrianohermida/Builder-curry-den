import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Server,
  Database,
  Globe,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  uptime: string;
  lastUpdate: string;
}

interface SystemAlert {
  id: string;
  type: "warning" | "error" | "info";
  message: string;
  timestamp: string;
  component: string;
}

export const SystemUpdateMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    uptime: "0 dias",
    lastUpdate: "",
  });

  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Simulate real-time metrics
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.random() * 80 + 10,
        memory: Math.random() * 70 + 20,
        disk: Math.random() * 60 + 30,
        network: Math.random() * 90 + 5,
        uptime: "127 dias, 14h 32m",
        lastUpdate: new Date().toLocaleString(),
      });

      // Simulate alerts
      if (Math.random() > 0.8) {
        const newAlert: SystemAlert = {
          id: Date.now().toString(),
          type: Math.random() > 0.7 ? "warning" : "info",
          message: "Sistema de cache foi otimizado automaticamente",
          timestamp: new Date().toLocaleString(),
          component: "Cache",
        };
        setAlerts((prev) => [newAlert, ...prev.slice(0, 4)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const systemComponents = [
    {
      name: "API Gateway",
      status: "online",
      version: "v2.1.4",
      lastUpdate: "2 horas atrás",
      health: 98,
      icon: Globe,
    },
    {
      name: "Database Cluster",
      status: "online",
      version: "PostgreSQL 15.2",
      lastUpdate: "1 dia atrás",
      health: 95,
      icon: Database,
    },
    {
      name: "Application Server",
      status: "online",
      version: "Node.js 20.1",
      lastUpdate: "3 horas atrás",
      health: 97,
      icon: Server,
    },
    {
      name: "Security Layer",
      status: "online",
      version: "v3.0.1",
      lastUpdate: "6 horas atrás",
      health: 99,
      icon: Shield,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "error":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Status Geral
                </p>
                <p className="text-xl font-bold text-green-700">Operacional</p>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-xl font-bold">{metrics.uptime}</p>
              </div>
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Componentes</p>
                <p className="text-xl font-bold">{systemComponents.length}/4</p>
              </div>
              <Server className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Última Atualização
                </p>
                <p className="text-sm font-bold">{metrics.lastUpdate}</p>
              </div>
              <Activity className="h-6 w-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Métricas de Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">CPU</span>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(metrics.cpu)}%
                  </span>
                </div>
                <Progress value={metrics.cpu} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MemoryStick className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Memória</span>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(metrics.memory)}%
                  </span>
                </div>
                <Progress value={metrics.memory} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">Disco</span>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(metrics.disk)}%
                  </span>
                </div>
                <Progress value={metrics.disk} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Rede</span>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(metrics.network)}%
                  </span>
                </div>
                <Progress value={metrics.network} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Alertas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.length > 0 ? (
                alerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Alert>
                      <div className="flex items-start gap-2">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <AlertDescription>
                            <div className="font-medium">{alert.message}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {alert.component} • {alert.timestamp}
                            </div>
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>Nenhum alerta recente</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Components Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-purple-500" />
            Status dos Componentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemComponents.map((component, index) => (
              <motion.div
                key={component.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <component.icon className="h-6 w-6 text-blue-500" />
                    <div>
                      <h4 className="font-medium">{component.name}</h4>
                      <p className="text-sm text-gray-600">
                        {component.version}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(component.status)}>
                    {component.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Health Score</span>
                    <span className="text-sm font-medium">
                      {component.health}%
                    </span>
                  </div>
                  <Progress value={component.health} className="h-2" />

                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      Atualizado {component.lastUpdate}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Server className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h3 className="font-medium">Sistema Principal</h3>
              <p className="text-sm text-gray-600">Lawdesk CRM v2025.1</p>
              <Badge className="mt-1 bg-blue-100 text-blue-800">Estável</Badge>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <h3 className="font-medium">Performance</h3>
              <p className="text-sm text-gray-600">Resposta &lt; 200ms</p>
              <Badge className="mt-1 bg-green-100 text-green-800">Ótimo</Badge>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <h3 className="font-medium">Segurança</h3>
              <p className="text-sm text-gray-600">SSL/TLS + 2FA</p>
              <Badge className="mt-1 bg-purple-100 text-purple-800">
                Seguro
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
