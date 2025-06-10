/**
 * 📊 UNIFIED INDICATORS - CRM SUMMARY WIDGET
 *
 * Widget único horizontal interativo para substituir múltiplos cards:
 * - Métricas principais em layout compacto
 * - Interativo com drill-down
 * - Animações e microinterações
 * - Responsivo e adaptável
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Scale,
  FileSignature,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Target,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Metric {
  id: string;
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease" | "neutral";
    period: string;
  };
  icon: React.ReactNode;
  color: string;
  description?: string;
  subMetrics?: SubMetric[];
  alert?: {
    type: "info" | "warning" | "error" | "success";
    message: string;
  };
}

interface SubMetric {
  label: string;
  value: string | number;
  color?: string;
}

interface UnifiedIndicatorsProps {
  onMetricClick?: (metricId: string) => void;
  className?: string;
}

export const UnifiedIndicators: React.FC<UnifiedIndicatorsProps> = ({
  onMetricClick,
  className = "",
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock data - replace with real data hooks
  const metrics: Metric[] = [
    {
      id: "clientes",
      title: "Clientes",
      value: 247,
      change: {
        value: 12,
        type: "increase",
        period: "este mês",
      },
      icon: <Users className="w-4 h-4" />,
      color: "blue",
      description: "Base de clientes ativa",
      subMetrics: [
        { label: "VIP", value: 23, color: "text-amber-600" },
        { label: "Ativos", value: 189, color: "text-green-600" },
        { label: "Prospects", value: 35, color: "text-blue-600" },
      ],
      alert: {
        type: "success",
        message: "Meta mensal atingida!",
      },
    },
    {
      id: "processos",
      title: "Processos",
      value: 156,
      change: {
        value: 8,
        type: "increase",
        period: "esta semana",
      },
      icon: <Scale className="w-4 h-4" />,
      color: "purple",
      description: "Processos em andamento",
      subMetrics: [
        { label: "Urgentes", value: 12, color: "text-red-600" },
        { label: "Prazo Hoje", value: 5, color: "text-orange-600" },
        { label: "Finalizados", value: 89, color: "text-green-600" },
      ],
      alert: {
        type: "warning",
        message: "5 processos com prazo hoje",
      },
    },
    {
      id: "contratos",
      title: "Contratos",
      value: 89,
      change: {
        value: 15,
        type: "increase",
        period: "este trimestre",
      },
      icon: <FileSignature className="w-4 h-4" />,
      color: "emerald",
      description: "Contratos vigentes",
      subMetrics: [
        { label: "Vigentes", value: 76, color: "text-green-600" },
        { label: "Renovação", value: 13, color: "text-blue-600" },
      ],
    },
    {
      id: "tarefas",
      title: "Tarefas",
      value: 142,
      change: {
        value: 3,
        type: "decrease",
        period: "hoje",
      },
      icon: <Calendar className="w-4 h-4" />,
      color: "orange",
      description: "Atividades da equipe",
      subMetrics: [
        { label: "Pendentes", value: 34, color: "text-orange-600" },
        { label: "Atrasadas", value: 8, color: "text-red-600" },
        { label: "Concluídas", value: 100, color: "text-green-600" },
      ],
      alert: {
        type: "warning",
        message: "8 tarefas atrasadas",
      },
    },
    {
      id: "receita",
      title: "Receita",
      value: "R$ 245K",
      change: {
        value: 18,
        type: "increase",
        period: "este mês",
      },
      icon: <DollarSign className="w-4 h-4" />,
      color: "green",
      description: "Faturamento mensal",
      subMetrics: [
        { label: "Recorrente", value: "R$ 198K", color: "text-green-600" },
        { label: "Única vez", value: "R$ 47K", color: "text-blue-600" },
      ],
      alert: {
        type: "success",
        message: "Melhor mês do ano!",
      },
    },
    {
      id: "produtividade",
      title: "Produtividade",
      value: "94%",
      change: {
        value: 5,
        type: "increase",
        period: "esta semana",
      },
      icon: <Target className="w-4 h-4" />,
      color: "indigo",
      description: "Eficiência da equipe",
      subMetrics: [
        { label: "Meta", value: "90%", color: "text-gray-600" },
        { label: "Atual", value: "94%", color: "text-green-600" },
      ],
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      purple: "bg-purple-50 text-purple-700 border-purple-200",
      emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
      orange: "bg-orange-50 text-orange-700 border-orange-200",
      green: "bg-green-50 text-green-700 border-green-200",
      indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const handleMetricClick = (metric: Metric) => {
    setSelectedMetric(selectedMetric === metric.id ? null : metric.id);
    onMetricClick?.(metric.id);
  };

  const renderChangeIndicator = (change?: Metric["change"]) => {
    if (!change) return null;

    const Icon = change.type === "increase" ? TrendingUp : TrendingDown;
    const colorClass =
      change.type === "increase"
        ? "text-green-600"
        : change.type === "decrease"
          ? "text-red-600"
          : "text-gray-600";

    return (
      <div className={cn("flex items-center gap-1 text-xs", colorClass)}>
        <Icon className="w-3 h-3" />
        <span>
          {change.type === "increase" ? "+" : ""}
          {change.value}% {change.period}
        </span>
      </div>
    );
  };

  const renderAlert = (alert?: Metric["alert"]) => {
    if (!alert) return null;

    const alertIcons = {
      info: <Zap className="w-3 h-3" />,
      warning: <AlertTriangle className="w-3 h-3" />,
      error: <AlertTriangle className="w-3 h-3" />,
      success: <CheckCircle className="w-3 h-3" />,
    };

    const alertColors = {
      info: "bg-blue-50 text-blue-700 border-blue-200",
      warning: "bg-orange-50 text-orange-700 border-orange-200",
      error: "bg-red-50 text-red-700 border-red-200",
      success: "bg-green-50 text-green-700 border-green-200",
    };

    return (
      <div
        className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full text-xs border",
          alertColors[alert.type],
        )}
      >
        {alertIcons[alert.type]}
        <span>{alert.message}</span>
      </div>
    );
  };

  return (
    <Card className={cn("border-gray-200 shadow-sm", className)}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">Resumo Executivo</h3>
            <Badge variant="secondary" className="text-xs">
              Tempo real
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 px-2 text-xs"
          >
            {isExpanded ? "Recolher" : "Expandir"}
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleMetricClick(metric)}
              className={cn(
                "relative p-3 rounded-lg border cursor-pointer transition-all duration-200",
                getColorClasses(metric.color),
                selectedMetric === metric.id &&
                  "ring-2 ring-blue-500 ring-offset-1",
              )}
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/50 mb-2">
                {metric.icon}
              </div>

              {/* Value */}
              <div className="space-y-1">
                <p className="text-lg font-bold">{metric.value}</p>
                <p className="text-xs font-medium">{metric.title}</p>
              </div>

              {/* Change */}
              {metric.change && (
                <div className="mt-2">
                  {renderChangeIndicator(metric.change)}
                </div>
              )}

              {/* Alert Badge */}
              {metric.alert && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {(isExpanded || selectedMetric) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 space-y-4"
            >
              {/* Selected Metric Details */}
              {selectedMetric && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gray-50 rounded-lg border"
                >
                  {(() => {
                    const metric = metrics.find((m) => m.id === selectedMetric);
                    if (!metric) return null;

                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">
                            {metric.title} - Detalhes
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedMetric(null)}
                            className="h-6 w-6 p-0"
                          >
                            ✕
                          </Button>
                        </div>

                        <p className="text-sm text-gray-600">
                          {metric.description}
                        </p>

                        {metric.subMetrics && metric.subMetrics.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {metric.subMetrics.map((subMetric, idx) => (
                              <div
                                key={idx}
                                className="p-2 bg-white rounded border"
                              >
                                <p className="text-xs text-gray-500">
                                  {subMetric.label}
                                </p>
                                <p
                                  className={cn(
                                    "font-semibold",
                                    subMetric.color || "text-gray-900",
                                  )}
                                >
                                  {subMetric.value}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {metric.alert && (
                          <div className="pt-2">
                            {renderAlert(metric.alert)}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </motion.div>
              )}

              {/* All Alerts */}
              {isExpanded && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 text-sm">
                    Alertas Ativos
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {metrics
                      .filter((m) => m.alert)
                      .map((metric) => (
                        <div key={metric.id}>{renderAlert(metric.alert)}</div>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default UnifiedIndicators;
