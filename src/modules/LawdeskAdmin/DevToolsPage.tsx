import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  GitBranch,
  Rocket,
  Activity,
  Code,
  Database,
  Monitor,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  Play,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function DevToolsPage() {
  const [isExecuting, setIsExecuting] = useState(false);

  const deployments = [
    {
      id: "deploy-001",
      version: "v2025.1.47",
      environment: "Production",
      status: "success",
      timestamp: "2025-01-19 14:30",
      duration: "2m 34s",
      commits: 12,
      author: "Ana Santos",
    },
    {
      id: "deploy-002",
      version: "v2025.1.46",
      environment: "Staging",
      status: "success",
      timestamp: "2025-01-19 13:15",
      duration: "1m 58s",
      commits: 8,
      author: "Pedro Lima",
    },
    {
      id: "deploy-003",
      version: "v2025.1.45",
      environment: "Development",
      status: "running",
      timestamp: "2025-01-19 12:45",
      duration: "1m 12s",
      commits: 5,
      author: "Carlos Silva",
    },
  ];

  const aiTasks = [
    {
      id: "task-001",
      description: "Otimizar performance do módulo GED",
      priority: "high",
      status: "completed",
      progress: 100,
      estimatedTime: "2h",
      actualTime: "1h 45m",
    },
    {
      id: "task-002",
      description: "Implementar cache distribuído Redis",
      priority: "medium",
      status: "in-progress",
      progress: 67,
      estimatedTime: "4h",
      actualTime: "2h 30m",
    },
    {
      id: "task-003",
      description: "Refatorar sistema de notificações",
      priority: "low",
      status: "pending",
      progress: 0,
      estimatedTime: "6h",
      actualTime: "-",
    },
  ];

  const systemMetrics = [
    { name: "CPU Usage", value: 34, status: "good" },
    { name: "Memory", value: 67, status: "warning" },
    { name: "Database", value: 23, status: "good" },
    { name: "API Response", value: 89, status: "excellent" },
  ];

  const handleExecuteAI = async () => {
    setIsExecuting(true);
    // Simulate AI execution
    setTimeout(() => {
      setIsExecuting(false);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "running":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMetricStatus = (value: number) => {
    if (value >= 80) return { color: "text-red-600", label: "Critical" };
    if (value >= 60) return { color: "text-yellow-600", label: "Warning" };
    return { color: "text-green-600", label: "Good" };
  };

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Deploys Hoje
                </p>
                <p className="text-2xl font-bold text-blue-600">12</p>
              </div>
              <Rocket className="w-8 h-8 text-blue-600" />
            </div>
            <Badge className="mt-2 bg-green-100 text-green-800">
              +3 vs ontem
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Builds Ativos
                </p>
                <p className="text-2xl font-bold text-green-600">3</p>
              </div>
              <Settings className="w-8 h-8 text-green-600" />
            </div>
            <Badge className="mt-2 bg-blue-100 text-blue-800">
              Em execução
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tarefas IA</p>
                <p className="text-2xl font-bold text-purple-600">
                  {aiTasks.length}
                </p>
              </div>
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <Badge className="mt-2 bg-purple-100 text-purple-800">
              {aiTasks.filter((t) => t.status === "completed").length}{" "}
              concluídas
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-cyan-600">99.9%</p>
              </div>
              <Activity className="w-8 h-8 text-cyan-600" />
            </div>
            <Badge className="mt-2 bg-cyan-100 text-cyan-800">127 dias</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="blueprint" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="blueprint">Blueprint Builder</TabsTrigger>
          <TabsTrigger value="deployments">Deploys</TabsTrigger>
          <TabsTrigger value="ai-plan">Plano de Ação IA</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
        </TabsList>

        {/* Blueprint Builder Tab */}
        <TabsContent value="blueprint" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-600" />
                Blueprint Builder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Componentes Disponíveis</h4>
                  <div className="space-y-2">
                    {[
                      { name: "CRM Module", status: "active", version: "v2.1" },
                      { name: "IA Engine", status: "active", version: "v3.0" },
                      { name: "GED System", status: "active", version: "v1.8" },
                      {
                        name: "Payment Gateway",
                        status: "inactive",
                        version: "v1.2",
                      },
                    ].map((component) => (
                      <div
                        key={component.name}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              component.status === "active"
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          ></div>
                          <span className="font-medium">{component.name}</span>
                        </div>
                        <Badge variant="outline">{component.version}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Últimos Builds</h4>
                  <div className="space-y-2">
                    {[
                      {
                        id: "build-001",
                        component: "IA Engine",
                        status: "success",
                        time: "2m 15s",
                      },
                      {
                        id: "build-002",
                        component: "CRM Module",
                        status: "success",
                        time: "1m 42s",
                      },
                      {
                        id: "build-003",
                        component: "GED System",
                        status: "running",
                        time: "0m 38s",
                      },
                    ].map((build) => (
                      <div
                        key={build.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{build.component}</p>
                          <p className="text-sm text-gray-600">{build.time}</p>
                        </div>
                        <Badge className={getStatusColor(build.status)}>
                          {build.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deployments Tab */}
        <TabsContent value="deployments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-green-600" />
                Histórico de Deploys
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deployments.map((deploy, index) => (
                  <motion.div
                    key={deploy.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            deploy.status === "success"
                              ? "bg-green-500"
                              : deploy.status === "running"
                                ? "bg-blue-500"
                                : "bg-red-500"
                          }`}
                        ></div>
                        <div>
                          <h4 className="font-medium">{deploy.version}</h4>
                          <p className="text-sm text-gray-600">
                            {deploy.environment}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(deploy.status)}>
                        {deploy.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Autor</p>
                        <p className="font-medium">{deploy.author}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Duração</p>
                        <p className="font-medium">{deploy.duration}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Commits</p>
                        <p className="font-medium">{deploy.commits}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Timestamp</p>
                        <p className="font-medium">{deploy.timestamp}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Plan Tab */}
        <TabsContent value="ai-plan" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Execução do Plano de Ação IA
            </h3>
            <Button
              onClick={handleExecuteAI}
              disabled={isExecuting}
              className="flex items-center gap-2"
            >
              {isExecuting ? (
                <Settings className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isExecuting ? "Executando..." : "Executar IA"}
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {aiTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium">{task.description}</h4>
                        <p className="text-sm text-gray-600">
                          Estimado: {task.estimatedTime} | Atual:{" "}
                          {task.actualTime}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso</span>
                        <span>{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-blue-600" />
                  Métricas do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemMetrics.map((metric) => {
                    const status = getMetricStatus(metric.value);
                    return (
                      <div key={metric.name}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">
                            {metric.name}
                          </span>
                          <span className={`text-sm ${status.color}`}>
                            {metric.value}% ({status.label})
                          </span>
                        </div>
                        <Progress value={metric.value} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-600" />
                  Status dos Serviços
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      name: "API Gateway",
                      status: "operational",
                      uptime: "99.9%",
                    },
                    {
                      name: "Database",
                      status: "operational",
                      uptime: "99.8%",
                    },
                    {
                      name: "Redis Cache",
                      status: "operational",
                      uptime: "100%",
                    },
                    {
                      name: "File Storage",
                      status: "degraded",
                      uptime: "97.2%",
                    },
                  ].map((service) => (
                    <div
                      key={service.name}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            service.status === "operational"
                              ? "bg-green-500"
                              : service.status === "degraded"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        ></div>
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{service.uptime}</p>
                        <p className="text-xs text-gray-600">
                          {service.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
