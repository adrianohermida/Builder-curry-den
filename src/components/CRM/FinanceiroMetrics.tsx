/**
 * FINANCEIRO METRICS COMPONENT
 * Placeholder component for financial metrics dashboard
 */

import React from "react";
import { DollarSign, TrendingUp, PieChart, BarChart3 } from "lucide-react";
import Card from "@/components/ui/OptimizedCard";
import Button from "@/components/ui/OptimizedButton";

interface FinanceiroMetricsProps {
  searchQuery: string;
  viewMode: "cards" | "table" | "kanban" | "timeline";
  onViewModeChange: (mode: "cards" | "table" | "kanban" | "timeline") => void;
}

const FinanceiroMetrics: React.FC<FinanceiroMetricsProps> = ({
  searchQuery,
  viewMode,
  onViewModeChange,
}) => {
  const mockMetrics = [
    {
      title: "Faturamento Mensal",
      value: "R$ 45.800",
      change: "+12%",
      icon: DollarSign,
      color: "var(--color-success)",
    },
    {
      title: "Recebimentos",
      value: "R$ 38.200",
      change: "+8%",
      icon: TrendingUp,
      color: "var(--primary-500)",
    },
    {
      title: "Pendências",
      value: "R$ 12.400",
      change: "-5%",
      icon: PieChart,
      color: "var(--color-warning)",
    },
    {
      title: "Crescimento",
      value: "18%",
      change: "+3%",
      icon: BarChart3,
      color: "var(--color-info)",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            margin: "0 0 0.5rem",
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "var(--text-primary)",
          }}
        >
          Dashboard Financeiro
        </h2>
        <p style={{ margin: 0, color: "var(--text-secondary)" }}>
          Métricas e indicadores financeiros do escritório
        </p>
      </div>

      {/* Metrics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {mockMetrics.map((metric, index) => (
          <Card key={index} padding="lg" hover>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: `${metric.color}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <metric.icon size={24} style={{ color: metric.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    margin: "0 0 0.25rem",
                    fontSize: "2rem",
                    fontWeight: "700",
                    color: "var(--text-primary)",
                  }}
                >
                  {metric.value}
                </h3>
                <p
                  style={{
                    margin: "0 0 0.25rem",
                    fontSize: "0.875rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {metric.title}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.75rem",
                    color: metric.color,
                    fontWeight: "600",
                  }}
                >
                  {metric.change} vs mês anterior
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Coming Soon */}
      <Card padding="lg">
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <DollarSign
            size={64}
            style={{ color: "var(--text-tertiary)", marginBottom: "1rem" }}
          />
          <h3 style={{ margin: "0 0 0.5rem", color: "var(--text-primary)" }}>
            Dashboard Financeiro Completo
          </h3>
          <p style={{ margin: "0 0 1rem", color: "var(--text-secondary)" }}>
            Funcionalidades avançadas em desenvolvimento
          </p>
          <Button variant="primary">Solicitar Implementação Completa</Button>
        </div>
      </Card>
    </div>
  );
};

export default React.memo(FinanceiroMetrics);
