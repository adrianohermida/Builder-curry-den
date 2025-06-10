/**
 * PUBLICACOES STREAM COMPONENT
 * Placeholder component for publications monitoring
 */

import React from "react";
import { Bell, Eye, Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import Card from "@/components/ui/OptimizedCard";
import Button from "@/components/ui/OptimizedButton";

interface PublicacoesStreamProps {
  searchQuery: string;
  viewMode: "cards" | "table" | "kanban" | "timeline";
  onViewModeChange: (mode: "cards" | "table" | "kanban" | "timeline") => void;
}

const PublicacoesStream: React.FC<PublicacoesStreamProps> = ({
  searchQuery,
  viewMode,
  onViewModeChange,
}) => {
  const mockPublicacoes = [
    {
      id: 1,
      processo: "1234567-89.2023.8.26.0001",
      tribunal: "TJSP",
      tipo: "Intimação",
      data: "15/12/2023",
      prazo: "20/12/2023",
      status: "pendente",
      urgente: true,
    },
    {
      id: 2,
      processo: "2345678-90.2023.8.26.0002",
      tribunal: "TJRJ",
      tipo: "Citação",
      data: "14/12/2023",
      prazo: "25/12/2023",
      status: "visualizada",
      urgente: false,
    },
    {
      id: 3,
      processo: "3456789-01.2023.8.26.0003",
      tribunal: "TST",
      tipo: "Sentença",
      data: "13/12/2023",
      prazo: null,
      status: "processada",
      urgente: false,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "var(--color-error)";
      case "visualizada":
        return "var(--color-warning)";
      case "processada":
        return "var(--color-success)";
      default:
        return "var(--text-secondary)";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pendente":
        return "Pendente";
      case "visualizada":
        return "Visualizada";
      case "processada":
        return "Processada";
      default:
        return status;
    }
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h2
            style={{
              margin: "0 0 0.5rem",
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "var(--text-primary)",
            }}
          >
            Monitoramento de Publicações
          </h2>
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>
            Acompanhamento automático do DJE e outros diários
          </p>
        </div>
        <Button variant="primary" icon={Bell}>
          Configurar Alertas
        </Button>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <Card padding="md">
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "var(--color-error)",
              }}
            >
              5
            </div>
            <div
              style={{
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
              }}
            >
              Pendentes
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "var(--color-warning)",
              }}
            >
              8
            </div>
            <div
              style={{
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
              }}
            >
              Visualizadas
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "var(--color-success)",
              }}
            >
              23
            </div>
            <div
              style={{
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
              }}
            >
              Processadas
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "var(--primary-500)",
              }}
            >
              36
            </div>
            <div
              style={{
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
              }}
            >
              Total do Mês
            </div>
          </div>
        </Card>
      </div>

      {/* Publications Stream */}
      <div style={{ display: "grid", gap: "1rem" }}>
        {mockPublicacoes.map((pub) => (
          <Card key={pub.id} padding="md" hover style={{ cursor: "pointer" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "var(--text-primary)",
                    }}
                  >
                    {pub.processo}
                  </h4>
                  {pub.urgente && (
                    <span
                      style={{
                        padding: "0.125rem 0.5rem",
                        backgroundColor: "var(--color-error)",
                        color: "white",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        borderRadius: "var(--radius-sm)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <AlertTriangle size={12} />
                      Urgente
                    </span>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  <span>{pub.tribunal}</span>
                  <span>•</span>
                  <span>{pub.tipo}</span>
                  <span>•</span>
                  <span>Publicado em {pub.data}</span>
                  {pub.prazo && (
                    <>
                      <span>•</span>
                      <span style={{ color: "var(--color-warning)" }}>
                        Prazo: {pub.prazo}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <span
                  style={{
                    padding: "0.25rem 0.75rem",
                    backgroundColor: `${getStatusColor(pub.status)}20`,
                    color: getStatusColor(pub.status),
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    borderRadius: "var(--radius-sm)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  {pub.status === "processada" && <CheckCircle size={12} />}
                  {pub.status === "visualizada" && <Eye size={12} />}
                  {pub.status === "pendente" && <AlertTriangle size={12} />}
                  {getStatusLabel(pub.status)}
                </span>
                <Button variant="ghost" size="sm" icon={Eye}>
                  Ver
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Coming Soon */}
      <Card padding="lg" style={{ marginTop: "2rem" }}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <Bell
            size={64}
            style={{ color: "var(--text-tertiary)", marginBottom: "1rem" }}
          />
          <h3 style={{ margin: "0 0 0.5rem", color: "var(--text-primary)" }}>
            Sistema Completo de Monitoramento
          </h3>
          <p style={{ margin: "0 0 1rem", color: "var(--text-secondary)" }}>
            Integração completa com API Advise e notificações em tempo real
          </p>
          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
          >
            <Button variant="secondary" icon={Calendar}>
              Configurar Monitoramento
            </Button>
            <Button variant="primary" icon={Bell}>
              Ativar Alertas
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default React.memo(PublicacoesStream);
