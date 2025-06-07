import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  BarChart3,
  FileText,
  Zap,
  Bug,
  Wrench,
  Rocket,
  Shield,
  Eye,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ExecutionTask {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  phase: number;
  priority: "critical" | "high" | "medium" | "low";
  estimated_minutes: number;
  actual_minutes?: number;
  issues_found?: string[];
  fixes_applied?: string[];
}

interface ExecutionLog {
  timestamp: string;
  phase: number;
  task_id: string;
  action: string;
  details: string;
  status: "success" | "warning" | "error";
}

const EXECUTION_PHASES = [
  {
    id: 1,
    title: "Critical Fixes",
    description: "Hard-coded colors, theme integration, mobile navigation",
    tasks: [
      {
        id: "THEME_RGB_FIX",
        title: "Fix Hard-coded RGB Values",
        description:
          "Replace rgb(var(--theme-primary)) with proper CSS classes",
        status: "in_progress" as const,
        phase: 1,
        priority: "critical" as const,
        estimated_minutes: 30,
        issues_found: [
          "Found 60+ instances of rgb(var(--theme-primary)) syntax",
          "DashboardCard using incorrect RGB syntax",
          "NotificationCenter with invalid color references",
          "GED Smart Dashboard with hard-coded RGB values",
        ],
        fixes_applied: [
          "Fixed DashboardCard RGB syntax ✅",
          "Fixed NotificationCenter color references ✅",
          "Fixed GED Smart Dashboard hard-coded colors ✅",
        ],
      },
      {
        id: "LAYOUT_THEME_INTEGRATION",
        title: "Layout Theme Integration",
        description: "Ensure all layout components use theme CSS variables",
        status: "pending" as const,
        phase: 1,
        priority: "critical" as const,
        estimated_minutes: 45,
      },
      {
        id: "MOBILE_NAV_FIX",
        title: "Mobile Navigation Fixes",
        description: "Fix z-index issues and overlay behavior",
        status: "pending" as const,
        phase: 1,
        priority: "high" as const,
        estimated_minutes: 20,
      },
    ],
  },
  {
    id: 2,
    title: "Component Standardization",
    description: "Standardize all components with design system",
    tasks: [
      {
        id: "CARD_STANDARDIZATION",
        title: "Card Component Standardization",
        description: "Apply card-enhanced class and consistent styling",
        status: "pending" as const,
        phase: 2,
        priority: "high" as const,
        estimated_minutes: 60,
      },
      {
        id: "BUTTON_STANDARDIZATION",
        title: "Button Style Standardization",
        description: "Consistent button styles and interactions",
        status: "pending" as const,
        phase: 2,
        priority: "medium" as const,
        estimated_minutes: 30,
      },
    ],
  },
];

export default function ActionPlanExecutor() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([
    {
      timestamp: new Date().toISOString(),
      phase: 1,
      task_id: "THEME_RGB_FIX",
      action: "Started RGB syntax fixes",
      details:
        "Identified 60+ instances of incorrect rgb(var(--theme-primary)) syntax",
      status: "warning",
    },
    {
      timestamp: new Date().toISOString(),
      phase: 1,
      task_id: "THEME_RGB_FIX",
      action: "Fixed DashboardCard",
      details: "Replaced rgb(var(--theme-primary)) with proper CSS classes",
      status: "success",
    },
    {
      timestamp: new Date().toISOString(),
      phase: 1,
      task_id: "THEME_RGB_FIX",
      action: "Fixed NotificationCenter",
      details: "Updated color references to use theme classes",
      status: "success",
    },
    {
      timestamp: new Date().toISOString(),
      phase: 1,
      task_id: "THEME_RGB_FIX",
      action: "Fixed GED Smart Dashboard",
      details: "Replaced hard-coded RGB values with CSS variables",
      status: "success",
    },
  ]);

  const allTasks = EXECUTION_PHASES.flatMap((phase) => phase.tasks);
  const completedTasks = allTasks.filter(
    (task) => task.status === "completed",
  ).length;
  const totalTasks = allTasks.length;
  const overallProgress = (completedTasks / totalTasks) * 100;

  const currentPhaseTasks =
    EXECUTION_PHASES.find((p) => p.id === currentPhase)?.tasks || [];
  const currentPhaseCompleted = currentPhaseTasks.filter(
    (task) => task.status === "completed",
  ).length;
  const currentPhaseTotal = currentPhaseTasks.length;
  const currentPhaseProgress =
    currentPhaseTotal > 0
      ? (currentPhaseCompleted / currentPhaseTotal) * 100
      : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-success bg-success/10 border-success/20";
      case "in_progress":
        return "text-warning bg-warning/10 border-warning/20";
      case "failed":
        return "text-destructive bg-destructive/10 border-destructive/20";
      default:
        return "text-muted-foreground bg-muted/10 border-muted/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "in_progress":
        return Clock;
      case "failed":
        return AlertTriangle;
      default:
        return Target;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "high":
        return "bg-warning/20 text-warning border-warning/30";
      case "medium":
        return "bg-primary/20 text-primary border-primary/30";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  return (
    <div className="container-responsive space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Executor de Plano de Ação
          </h1>
          <p className="text-muted-foreground">
            Execução autônoma e iterativa de melhorias do sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isExecuting ? "destructive" : "default"}
            onClick={() => setIsExecuting(!isExecuting)}
            className="flex items-center gap-2"
          >
            {isExecuting ? (
              <>
                <Pause className="h-4 w-4" />
                Pausar Execução
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Continuar Execução
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Overall Progress */}
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Progresso Geral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {completedTasks} de {totalTasks} tarefas concluídas
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(overallProgress)}%
              </span>
            </div>
            <Progress value={overallProgress} className="w-full" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {completedTasks}
                </div>
                <div className="text-xs text-muted-foreground">Concluídas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">
                  {allTasks.filter((t) => t.status === "in_progress").length}
                </div>
                <div className="text-xs text-muted-foreground">
                  Em Progresso
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">
                  {allTasks.filter((t) => t.status === "pending").length}
                </div>
                <div className="text-xs text-muted-foreground">Pendentes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">
                  {allTasks.filter((t) => t.status === "failed").length}
                </div>
                <div className="text-xs text-muted-foreground">Falharam</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Phase Progress */}
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Fase Atual:{" "}
            {EXECUTION_PHASES.find((p) => p.id === currentPhase)?.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {EXECUTION_PHASES.find((p) => p.id === currentPhase)?.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {currentPhaseCompleted} de {currentPhaseTotal} tarefas da fase
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(currentPhaseProgress)}%
              </span>
            </div>
            <Progress value={currentPhaseProgress} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Tasks by Phase */}
      <div className="space-y-6">
        {EXECUTION_PHASES.map((phase) => (
          <Card key={phase.id} className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Fase {phase.id}: {phase.title}
                </div>
                <Badge
                  variant={phase.id === currentPhase ? "default" : "secondary"}
                >
                  {phase.id === currentPhase
                    ? "Atual"
                    : phase.id < currentPhase
                      ? "Concluída"
                      : "Futura"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {phase.tasks.map((task) => {
                  const StatusIcon = getStatusIcon(task.status);

                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border transition-colors ${getStatusColor(task.status)}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4" />
                            <h4 className="font-medium">{task.title}</h4>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-sm opacity-80">
                            {task.description}
                          </p>

                          {task.issues_found &&
                            task.issues_found.length > 0 && (
                              <div className="mt-2">
                                <h5 className="text-xs font-medium mb-1">
                                  Issues Encontradas:
                                </h5>
                                <ul className="text-xs space-y-1">
                                  {task.issues_found.map((issue, idx) => (
                                    <li
                                      key={idx}
                                      className="flex items-start gap-1"
                                    >
                                      <Bug className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                      {issue}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                          {task.fixes_applied &&
                            task.fixes_applied.length > 0 && (
                              <div className="mt-2">
                                <h5 className="text-xs font-medium mb-1">
                                  Correções Aplicadas:
                                </h5>
                                <ul className="text-xs space-y-1">
                                  {task.fixes_applied.map((fix, idx) => (
                                    <li
                                      key={idx}
                                      className="flex items-start gap-1"
                                    >
                                      <Wrench className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                      {fix}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">
                            {task.estimated_minutes}min estimado
                          </div>
                          {task.actual_minutes && (
                            <div className="text-xs">
                              {task.actual_minutes}min real
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Execution Logs */}
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Log de Execução
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {executionLogs.map((log, idx) => (
              <div
                key={idx}
                className={`p-3 rounded text-sm border ${
                  log.status === "success"
                    ? "border-success/20 bg-success/5 text-success"
                    : log.status === "error"
                      ? "border-destructive/20 bg-destructive/5 text-destructive"
                      : "border-warning/20 bg-warning/5 text-warning"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{log.action}</span>
                  <span className="text-xs opacity-70">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-xs mt-1 opacity-80">{log.details}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Actions */}
      <Alert>
        <Rocket className="h-4 w-4" />
        <AlertTitle>Próximas Ações</AlertTitle>
        <AlertDescription>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• Continuar correção de valores RGB em componentes CRM</li>
            <li>
              • Implementar integração completa do tema em Layout components
            </li>
            <li>• Corrigir problemas de z-index na navegação mobile</li>
            <li>• Padronizar componentes Card com design system</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
