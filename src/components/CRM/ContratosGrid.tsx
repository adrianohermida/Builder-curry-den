/**
 * CONTRATOS GRID COMPONENT
 * Subcomponente modular para gestão de contratos
 * Vista em grid com cards informativos
 */

import React, { useState, useMemo, useCallback } from "react";
import {
  FileSignature,
  Plus,
  Calendar,
  DollarSign,
  User,
  AlertTriangle,
  Eye,
  Edit,
  Download,
  MoreVertical,
} from "lucide-react";
import Card from "@/components/ui/OptimizedCard";
import Button from "@/components/ui/OptimizedButton";
import { Contrato } from "@/hooks/useCRMUnificado";

// ===== TYPES =====
interface ContratosGridProps {
  searchQuery: string;
  viewMode: "cards" | "table" | "kanban" | "timeline";
  onViewModeChange: (mode: "cards" | "table" | "kanban" | "timeline") => void;
}

// ===== MOCK DATA =====
const mockContratos: Contrato[] = Array.from({ length: 12 }, (_, i) => ({
  id: `contract-${i + 1}`,
  titulo: [
    "Contrato de Prestação de Serviços Jurídicos",
    "Acordo de Sociedade Empresarial",
    "Contrato de Trabalho Executivo",
    "Termo de Confidencialidade",
    "Contrato de Locação Comercial",
    "Acordo de Licenciamento",
  ][i % 6],
  clienteId: `client-${(i % 5) + 1}`,
  cliente: `Cliente ${(i % 5) + 1}`,
  tipo: ["prestacao_servicos", "societario", "trabalhista", "civil", "outros"][
    i % 5
  ] as any,
  status: ["rascunho", "ativo", "vencido", "renovado", "rescindido"][
    i % 5
  ] as any,
  valor: (i + 1) * 2500 + Math.floor(Math.random() * 10000),
  dataInicio: new Date(2023, i % 12, (i % 28) + 1),
  dataVencimento: new Date(2024, (i + 6) % 12, (i % 28) + 1),
  responsavel: ["Dr. João Silva", "Dra. Maria Santos", "Dr. Pedro Costa"][
    i % 3
  ],
  arquivo: i % 3 === 0 ? `contrato_${i + 1}.pdf` : undefined,
  clausulas: [
    "Cláusula de confidencialidade",
    "Termo de responsabilidade",
    "Condições de pagamento",
  ],
  observacoes: `Observações importantes sobre o contrato ${i + 1}`,
  tags: [`tipo-${i % 3}`, `status-${i % 2}`],
}));

// ===== STATUS CONFIGURATION =====
const STATUS_CONFIG = {
  rascunho: {
    color: "var(--text-secondary)",
    label: "Rascunho",
    bgColor: "#f3f4f6",
  },
  ativo: { color: "var(--color-success)", label: "Ativo", bgColor: "#dcfce7" },
  vencido: {
    color: "var(--color-error)",
    label: "Vencido",
    bgColor: "#fecaca",
  },
  renovado: {
    color: "var(--primary-500)",
    label: "Renovado",
    bgColor: "#dbeafe",
  },
  rescindido: {
    color: "var(--color-warning)",
    label: "Rescindido",
    bgColor: "#fef3c7",
  },
};

const TYPE_CONFIG = {
  prestacao_servicos: { label: "Prestação de Serviços", color: "#3b82f6" },
  societario: { label: "Societário", color: "#8b5cf6" },
  trabalhista: { label: "Trabalhista", color: "#ef4444" },
  civil: { label: "Civil", color: "#10b981" },
  outros: { label: "Outros", color: "#6b7280" },
};

// ===== COMPONENT =====
const ContratosGrid: React.FC<ContratosGridProps> = ({
  searchQuery,
  viewMode,
  onViewModeChange,
}) => {
  const [sortBy, setSortBy] = useState<"dataVencimento" | "valor" | "titulo">(
    "dataVencimento",
  );
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string[]>([]);

  // ===== FILTERED AND SORTED CONTRACTS =====
  const processedContratos = useMemo(() => {
    let filtered = mockContratos;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (contrato) =>
          contrato.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contrato.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contrato.responsavel
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    // Apply status filter
    if (filterStatus.length > 0) {
      filtered = filtered.filter((contrato) =>
        filterStatus.includes(contrato.status),
      );
    }

    // Apply type filter
    if (filterType.length > 0) {
      filtered = filtered.filter((contrato) =>
        filterType.includes(contrato.tipo),
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "valor":
          return b.valor - a.valor;
        case "titulo":
          return a.titulo.localeCompare(b.titulo);
        default:
          return a.dataVencimento.getTime() - b.dataVencimento.getTime();
      }
    });

    return filtered;
  }, [searchQuery, filterStatus, filterType, sortBy]);

  // ===== HANDLERS =====
  const handleContractAction = useCallback(
    (action: string, contractId: string) => {
      switch (action) {
        case "view":
          console.log("Viewing contract:", contractId);
          break;
        case "edit":
          console.log("Editing contract:", contractId);
          break;
        case "download":
          console.log("Downloading contract:", contractId);
          break;
        case "renew":
          console.log("Renewing contract:", contractId);
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

  const formatDate = useCallback((date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  }, []);

  const getDaysUntilExpiry = useCallback((date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);

  // ===== RENDER FUNCTIONS =====
  const renderContractCard = (contrato: Contrato) => {
    const daysUntilExpiry = getDaysUntilExpiry(contrato.dataVencimento);
    const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    const isExpired = daysUntilExpiry < 0;
    const typeConfig = TYPE_CONFIG[contrato.tipo];

    return (
      <Card
        key={contrato.id}
        padding="lg"
        hover
        interactive
        onClick={() => handleContractAction("view", contrato.id)}
        style={{
          cursor: "pointer",
          position: "relative",
          border: isExpired
            ? "2px solid var(--color-error)"
            : isExpiringSoon
              ? "2px solid var(--color-warning)"
              : "1px solid var(--border-primary)",
        }}
      >
        {/* Expiry Warning */}
        {(isExpired || isExpiringSoon) && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              backgroundColor: isExpired
                ? "var(--color-error)"
                : "var(--color-warning)",
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
            {isExpired ? "Vencido" : "Vence em breve"}
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: "1rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "0.75rem",
            }}
          >
            <div style={{ flex: 1, paddingRight: "1rem" }}>
              <h3
                style={{
                  margin: "0 0 0.5rem",
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  lineHeight: 1.3,
                }}
              >
                {contrato.titulo}
              </h3>
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
                    padding: "0.25rem 0.75rem",
                    backgroundColor: STATUS_CONFIG[contrato.status].bgColor,
                    color: STATUS_CONFIG[contrato.status].color,
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  {STATUS_CONFIG[contrato.status].label}
                </span>
                <span
                  style={{
                    padding: "0.25rem 0.75rem",
                    backgroundColor: `${typeConfig.color}20`,
                    color: typeConfig.color,
                    fontSize: "0.75rem",
                    fontWeight: "500",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  {typeConfig.label}
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

        {/* Client and Responsible */}
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
              {contrato.cliente}
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
              <FileSignature
                size={14}
                style={{ color: "var(--text-tertiary)" }}
              />
              <span
                style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}
              >
                Responsável
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
              {contrato.responsavel}
            </p>
          </div>
        </div>

        {/* Financial Info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            backgroundColor: "var(--primary-50)",
            borderRadius: "var(--radius-md)",
            marginBottom: "1rem",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <DollarSign
              size={24}
              style={{
                color: "var(--primary-500)",
                marginBottom: "0.25rem",
              }}
            />
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "var(--primary-600)",
                marginBottom: "0.25rem",
              }}
            >
              {formatCurrency(contrato.valor)}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--primary-500)",
                fontWeight: "500",
              }}
            >
              Valor do Contrato
            </div>
          </div>
        </div>

        {/* Dates */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.25rem",
                marginBottom: "0.25rem",
              }}
            >
              <Calendar size={14} style={{ color: "var(--text-tertiary)" }} />
              <span
                style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}
              >
                Início
              </span>
            </div>
            <div
              style={{
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "var(--text-primary)",
              }}
            >
              {formatDate(contrato.dataInicio)}
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.25rem",
                marginBottom: "0.25rem",
              }}
            >
              <Calendar size={14} style={{ color: "var(--text-tertiary)" }} />
              <span
                style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}
              >
                Vencimento
              </span>
            </div>
            <div
              style={{
                fontSize: "0.875rem",
                fontWeight: "500",
                color: isExpired
                  ? "var(--color-error)"
                  : isExpiringSoon
                    ? "var(--color-warning)"
                    : "var(--text-primary)",
              }}
            >
              {formatDate(contrato.dataVencimento)}
              {isExpired && (
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-error)",
                    fontWeight: "600",
                  }}
                >
                  ({Math.abs(daysUntilExpiry)} dias em atraso)
                </div>
              )}
              {isExpiringSoon && (
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-warning)",
                    fontWeight: "600",
                  }}
                >
                  ({daysUntilExpiry} dias restantes)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Clauses Preview */}
        {contrato.clausulas.length > 0 && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "0.75rem",
              backgroundColor: "var(--surface-secondary)",
              borderRadius: "var(--radius-md)",
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
              Principais Cláusulas
            </h4>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.25rem",
              }}
            >
              {contrato.clausulas.slice(0, 2).map((clausula, index) => (
                <span
                  key={index}
                  style={{
                    padding: "0.25rem 0.5rem",
                    backgroundColor: "var(--surface-primary)",
                    color: "var(--text-secondary)",
                    fontSize: "0.75rem",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  {clausula}
                </span>
              ))}
              {contrato.clausulas.length > 2 && (
                <span
                  style={{
                    padding: "0.25rem 0.5rem",
                    backgroundColor: "var(--surface-primary)",
                    color: "var(--text-secondary)",
                    fontSize: "0.75rem",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  +{contrato.clausulas.length - 2} mais
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "1rem",
            borderTop: "1px solid var(--border-primary)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {contrato.arquivo && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                }}
              >
                <FileSignature size={12} />
                PDF disponível
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: "0.25rem" }}>
            {contrato.arquivo && (
              <Button
                variant="ghost"
                size="sm"
                icon={Download}
                onClick={(e) => {
                  e.stopPropagation();
                  handleContractAction("download", contrato.id);
                }}
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              icon={Eye}
              onClick={(e) => {
                e.stopPropagation();
                handleContractAction("view", contrato.id);
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              icon={Edit}
              onClick={(e) => {
                e.stopPropagation();
                handleContractAction("edit", contrato.id);
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
            <option value="dataVencimento">Ordenar por Vencimento</option>
            <option value="valor">Ordenar por Valor</option>
            <option value="titulo">Ordenar por Título</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button variant="secondary" icon={Calendar} size="sm">
            Renovações
          </Button>
          <Button variant="primary" icon={Plus} size="sm">
            Novo Contrato
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
          Mostrando {processedContratos.length} de {mockContratos.length}{" "}
          contratos
          {searchQuery && ` para "${searchQuery}"`}
        </p>
      </div>

      {/* Contracts Grid */}
      {processedContratos.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {processedContratos.map(renderContractCard)}
        </div>
      ) : (
        <Card padding="lg">
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <FileSignature
              size={64}
              style={{ color: "var(--text-tertiary)", marginBottom: "1rem" }}
            />
            <h3 style={{ margin: "0 0 0.5rem", color: "var(--text-primary)" }}>
              Nenhum contrato encontrado
            </h3>
            <p style={{ margin: "0 0 1rem", color: "var(--text-secondary)" }}>
              {searchQuery
                ? `Nenhum resultado para "${searchQuery}"`
                : "Comece adicionando seu primeiro contrato"}
            </p>
            <Button variant="primary" icon={Plus}>
              Adicionar Contrato
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default React.memo(ContratosGrid);
