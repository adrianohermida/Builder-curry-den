/**
 * PROCESSOS TIMELINE COMPONENT
 * Subcomponente modular para gestão de processos
 * Vista em timeline com acompanhamento processual
 */

import React, { useState, useMemo, useCallback } from "react";
import {
  Scale,
  Plus,
  Filter,
  Clock,
  AlertTriangle,
  Calendar,
  FileText,
  User,
  Building,
  TrendingUp,
  Eye,
  Edit,
  MoreVertical,
} from "lucide-react";
import Card from "@/components/ui/OptimizedCard";
import Button from "@/components/ui/OptimizedButton";
import { Processo } from "@/hooks/useCRMUnificado";

// ===== TYPES =====
interface ProcessosTimelineProps {
  searchQuery: string;
  viewMode: "cards" | "table" | "kanban" | "timeline";
  onViewModeChange: (mode: "cards" | "table" | "kanban" | "timeline") => void;
}

// ===== MOCK DATA =====
const mockProcessos: Processo[] = Array.from({ length: 15 }, (_, i) => ({
  id: `process-${i + 1}`,
  numero: `${String(i + 1).padStart(7, "0")}-12.2023.8.26.${String(i + 1000).slice(-4)}`,
  clienteId: `client-${(i % 5) + 1}`,
  cliente: `Cliente ${(i % 5) + 1}`,
  area: ["Civil", "Trabalhista", "Empresarial", "Tributário", "Penal"][i % 5],
  status: ["ativo", "arquivado", "suspenso", "encerrado", "julgado"][
    i % 5
  ] as any,
  valor: (i + 1) * 15000 + Math.floor(Math.random() * 50000),
  dataInicio: new Date(2023, i % 12, (i % 28) + 1),
  dataEncerramento:
    i % 5 === 3 ? new Date(2023, (i + 6) % 12, (i % 28) + 1) : undefined,
  responsavel: ["Dr. João Silva", "Dra. Maria Santos", "Dr. Pedro Costa"][
    i % 3
  ],
  tribunal: ["TJSP", "TJRJ", "TST", "STJ", "STF"][i % 5],
  vara: `${i + 1}ª Vara ${["Cível", "Trabalhista", "Empresarial"][i % 3]}`,
  assunto: [
    "Ação de Cobrança",
    "Dissolução de Sociedade",
    "Reclamação Trabalhista",
    "Mandado de Segurança",
    "Ação Rescisória",
  ][i % 5],
  prioridade: ["baixa", "media", "alta", "critica"][i % 4] as any,
  risco: ["baixo", "medio", "alto"][i % 3] as any,
  proximaAudiencia: i % 3 === 0 ? new Date(2024, 0, (i % 30) + 1) : undefined,
  proximoPrazo: i % 4 === 0 ? new Date(2024, 0, (i % 15) + 1) : undefined,
  tags: [`area-${i % 3}`, `status-${i % 2}`],
  observacoes: `Observações do processo ${i + 1}`,
  movimentacoes: [],
  publicacoes: [],
}));

// ===== STATUS CONFIGURATION =====
const STATUS_CONFIG = {
  ativo: { color: "var(--color-success)", label: "Ativo", bgColor: "#dcfce7" },
  arquivado: {
    color: "var(--text-secondary)",
    label: "Arquivado",
    bgColor: "#f3f4f6",
  },
  suspenso: {
    color: "var(--color-warning)",
    label: "Suspenso",
    bgColor: "#fef3c7",
  },
  encerrado: {
    color: "var(--primary-500)",
    label: "Encerrado",
    bgColor: "#dbeafe",
  },
  julgado: { color: "var(--color-info)", label: "Julgado", bgColor: "#e0f2fe" },
};

const PRIORITY_CONFIG = {
  baixa: { color: "var(--text-secondary)", label: "Baixa" },
  media: { color: "var(--color-warning)", label: "Média" },
  alta: { color: "var(--color-error)", label: "Alta" },
  critica: { color: "#dc2626", label: "Crítica" },
};

const RISK_CONFIG = {
  baixo: { color: "var(--color-success)", label: "Baixo" },
  medio: { color: "var(--color-warning)", label: "Médio" },
  alto: { color: "var(--color-error)", label: "Alto" },
};

// ===== COMPONENT =====
const ProcessosTimeline: React.FC<ProcessosTimelineProps> = ({
  searchQuery,
  viewMode,
  onViewModeChange,
}) => {
  const [sortBy, setSortBy] = useState<"dataInicio" | "valor" | "proximoPrazo">(
    "dataInicio",
  );
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterArea, setFilterArea] = useState<string[]>([]);

  // ===== FILTERED AND SORTED PROCESSES =====
  const processedProcessos = useMemo(() => {
    let filtered = mockProcessos;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (processo) =>
          processo.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
          processo.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
          processo.assunto.toLowerCase().includes(searchQuery.toLowerCase()) ||
          processo.responsavel
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    // Apply status filter
    if (filterStatus.length > 0) {
      filtered = filtered.filter((processo) =>
        filterStatus.includes(processo.status),
      );
    }

    // Apply area filter
    if (filterArea.length > 0) {
      filtered = filtered.filter((processo) =>
        filterArea.includes(processo.area),
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "valor":
          return b.valor - a.valor;
        case "proximoPrazo":
          const aPrazo = a.proximoPrazo?.getTime() || Infinity;
          const bPrazo = b.proximoPrazo?.getTime() || Infinity;
          return aPrazo - bPrazo;
        default:
          return b.dataInicio.getTime() - a.dataInicio.getTime();
      }
    });

    return filtered;
  }, [searchQuery, filterStatus, filterArea, sortBy]);

  // ===== HANDLERS =====
  const handleProcessAction = useCallback(
    (action: string, processId: string) => {
      switch (action) {
        case "view":
          console.log("Viewing process:", processId);
          break;
        case "edit":
          console.log("Editing process:", processId);
          break;
        case "timeline":
          console.log("Opening process timeline:", processId);
          break;
        default:
          console.log("Unknown action:", action);
      }
    },
    [],
  );

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }, []);

  const formatDate = useCallback((date: Date | undefined) => {
    if (!date) return "—";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  }, []);

  const getDaysUntil = useCallback((date: Date | undefined) => {
    if (!date) return null;
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);

  // ===== RENDER FUNCTIONS =====
  const renderProcessCard = (processo: Processo) => {
    const daysUntilDeadline = getDaysUntil(processo.proximoPrazo);
    const isUrgent = daysUntilDeadline !== null && daysUntilDeadline <= 5;

    return (
      <Card
        key={processo.id}
        padding="lg"
        hover
        interactive
        onClick={() => handleProcessAction("view", processo.id)}
        style={{
          cursor: "pointer",
          position: "relative",
          borderLeft: `4px solid ${STATUS_CONFIG[processo.status].color}`,
        }}
      >
        {/* Urgent Banner */}
        {isUrgent && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              backgroundColor: "var(--color-error)",
              color: "white",
              padding: "0.25rem 0.75rem",
              fontSize: "0.75rem",
              fontWeight: "600",
              borderBottomLeftRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <AlertTriangle size={12} />
            Urgente
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: "1rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  margin: "0 0 0.25rem",
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                }}
              >
                {processo.numero}
              </h3>
              <p
                style={{
                  margin: "0 0 0.25rem",
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                }}
              >
                {processo.assunto}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    padding: "0.25rem 0.5rem",
                    backgroundColor: STATUS_CONFIG[processo.status].bgColor,
                    color: STATUS_CONFIG[processo.status].color,
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  {STATUS_CONFIG[processo.status].label}
                </span>
                <span
                  style={{
                    padding: "0.25rem 0.5rem",
                    backgroundColor: "var(--surface-secondary)",
                    color: "var(--text-secondary)",
                    fontSize: "0.75rem",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  {processo.area}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={MoreVertical}
              onClick={(e) => {
                e.stopPropagation();
                // Open context menu
              }}
            />
          </div>
        </div>

        {/* Client and Court Info */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "1rem",
            padding: "1rem",
            backgroundColor: "var(--surface-secondary)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.25rem",
              }}
            >
              <User size={14} style={{ color: "var(--text-tertiary)" }} />
              <span
                style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}
              >
                Cliente
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "var(--text-primary)",
              }}
            >
              {processo.cliente}
            </p>
          </div>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.25rem",
              }}
            >
              <Building size={14} style={{ color: "var(--text-tertiary)" }} />
              <span
                style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}
              >
                Tribunal
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "var(--text-primary)",
              }}
            >
              {processo.tribunal} - {processo.vara}
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                color: "var(--text-primary)",
              }}
            >
              {formatCurrency(processo.valor)}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
              }}
            >
              Valor da Causa
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                color: PRIORITY_CONFIG[processo.prioridade].color,
              }}
            >
              {PRIORITY_CONFIG[processo.prioridade].label}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
              }}
            >
              Prioridade
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                color: RISK_CONFIG[processo.risco].color,
              }}
            >
              {RISK_CONFIG[processo.risco].label}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
              }}
            >
              Risco
            </div>
          </div>
        </div>

        {/* Deadlines */}
        {(processo.proximaAudiencia || processo.proximoPrazo) && (
          <div
            style={{
              padding: "1rem",
              backgroundColor: isUrgent
                ? "#fef2f2"
                : "var(--surface-secondary)",
              borderRadius: "var(--radius-md)",
              marginBottom: "1rem",
            }}
          >
            <h4
              style={{
                margin: "0 0 0.5rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "var(--text-primary)",
              }}
            >
              Próximos Eventos
            </h4>
            {processo.proximaAudiencia && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.25rem",
                }}
              >
                <Calendar size={14} style={{ color: "var(--color-info)" }} />
                <span
                  style={{ fontSize: "0.875rem", color: "var(--text-primary)" }}
                >
                  Audiência: {formatDate(processo.proximaAudiencia)}
                </span>
              </div>
            )}
            {processo.proximoPrazo && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Clock
                  size={14}
                  style={{
                    color: isUrgent
                      ? "var(--color-error)"
                      : "var(--color-warning)",
                  }}
                />
                <span
                  style={{ fontSize: "0.875rem", color: "var(--text-primary)" }}
                >
                  Prazo: {formatDate(processo.proximoPrazo)}
                  {daysUntilDeadline !== null && (
                    <span
                      style={{
                        marginLeft: "0.5rem",
                        color: isUrgent
                          ? "var(--color-error)"
                          : "var(--text-secondary)",
                        fontWeight: isUrgent ? "600" : "normal",
                      }}
                    >
                      (
                      {daysUntilDeadline > 0
                        ? `${daysUntilDeadline} dias`
                        : "Vencido"}
                      )
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "1rem",
            borderTop: "1px solid var(--border-primary)",
          }}
        >
          <div>
            <div
              style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}
            >
              Responsável: {processo.responsavel}
            </div>
            <div
              style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}
            >
              Início: {formatDate(processo.dataInicio)}
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.25rem" }}>
            <Button
              variant="ghost"
              size="sm"
              icon={FileText}
              onClick={(e) => {
                e.stopPropagation();
                handleProcessAction("timeline", processo.id);
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              icon={Eye}
              onClick={(e) => {
                e.stopPropagation();
                handleProcessAction("view", processo.id);
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              icon={Edit}
              onClick={(e) => {
                e.stopPropagation();
                handleProcessAction("edit", processo.id);
              }}
            />
          </div>
        </div>
      </Card>
    );
  };

  // ===== MAIN RENDER =====
  return (
    <div>
      {/* Header Actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              padding: "0.5rem",
              border: "1px solid var(--border-primary)",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--surface-primary)",
              fontSize: "0.875rem",
            }}
          >
            <option value="dataInicio">Ordenar por Data de Início</option>
            <option value="valor">Ordenar por Valor</option>
            <option value="proximoPrazo">Ordenar por Prazo</option>
          </select>

          <Button variant="secondary" icon={Filter} size="sm">
            Filtros ({filterStatus.length + filterArea.length})
          </Button>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button variant="secondary" icon={TrendingUp} size="sm">
            Relatórios
          </Button>
          <Button variant="primary" icon={Plus} size="sm">
            Novo Processo
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div style={{ marginBottom: "1rem" }}>
        <p
          style={{
            margin: 0,
            color: "var(--text-secondary)",
            fontSize: "0.875rem",
          }}
        >
          Mostrando {processedProcessos.length} de {mockProcessos.length}{" "}
          processos
          {searchQuery && ` para "${searchQuery}"`}
        </p>
      </div>

      {/* Process Timeline */}
      {processedProcessos.length > 0 ? (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {processedProcessos.map(renderProcessCard)}
        </div>
      ) : (
        <Card padding="lg">
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <Scale
              size={64}
              style={{ color: "var(--text-tertiary)", marginBottom: "1rem" }}
            />
            <h3 style={{ margin: "0 0 0.5rem", color: "var(--text-primary)" }}>
              Nenhum processo encontrado
            </h3>
            <p style={{ margin: "0 0 1rem", color: "var(--text-secondary)" }}>
              {searchQuery
                ? `Nenhum resultado para "${searchQuery}"`
                : "Comece adicionando seu primeiro processo"}
            </p>
            <Button variant="primary" icon={Plus}>
              Adicionar Processo
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default React.memo(ProcessosTimeline);
