/**
 * TAREFAS KANBAN COMPONENT
 * Subcomponente modular para gestão de tarefas
 * Vista em kanban board para organização visual
 */

import React, { useState, useMemo, useCallback } from "react";
import {
  CheckSquare,
  Plus,
  Calendar,
  User,
  Clock,
  AlertTriangle,
  Flag,
  MoreVertical,
  Filter,
} from "lucide-react";
import Card from "@/components/ui/OptimizedCard";
import Button from "@/components/ui/OptimizedButton";
import { Tarefa } from "@/hooks/useCRMUnificado";

// ===== TYPES =====
interface TarefasKanbanProps {
  searchQuery: string;
  viewMode: "cards" | "table" | "kanban" | "timeline";
  onViewModeChange: (mode: "cards" | "table" | "kanban" | "timeline") => void;
}

// ===== MOCK DATA =====
const mockTarefas: Tarefa[] = Array.from({ length: 24 }, (_, i) => ({
  id: `task-${i + 1}`,
  titulo: [
    "Revisar contrato de prestação de serviços",
    "Petição inicial - Ação de cobrança",
    "Preparar documentos para audiência",
    "Análise de viabilidade recursal",
    "Reunião com cliente sobre acordo",
    "Elaborar parecer técnico",
    "Protocolar recurso no tribunal",
    "Acompanhar prazo processual",
  ][i % 8],
  descricao: `Descrição detalhada da tarefa ${i + 1}`,
  status: ["pendente", "em_andamento", "concluida", "cancelada"][i % 4] as any,
  prioridade: ["baixa", "media", "alta", "critica"][i % 4] as any,
  responsavel: ["Dr. João Silva", "Dra. Maria Santos", "Dr. Pedro Costa"][
    i % 3
  ],
  cliente: i % 4 === 0 ? `Cliente ${(i % 5) + 1}` : undefined,
  processo: i % 3 === 0 ? `Processo ${(i % 3) + 1}` : undefined,
  contrato: i % 5 === 0 ? `Contrato ${(i % 2) + 1}` : undefined,
  prazo: new Date(2024, 0, (i % 30) + 1),
  dataCriacao: new Date(2023, i % 12, (i % 28) + 1),
  dataConclusao: i % 4 === 2 ? new Date(2023, 11, (i % 30) + 1) : undefined,
  categoria: ["administrativo", "processual", "comercial", "outros"][
    i % 4
  ] as any,
  tags: [`categoria-${i % 3}`, `prioridade-${i % 2}`],
  anexos: [],
  comentarios: [],
}));

// ===== KANBAN COLUMNS =====
const KANBAN_COLUMNS = [
  {
    id: "pendente",
    title: "Pendente",
    status: "pendente" as const,
    color: "var(--text-secondary)",
    bgColor: "#f3f4f6",
  },
  {
    id: "em_andamento",
    title: "Em Andamento",
    status: "em_andamento" as const,
    color: "var(--primary-500)",
    bgColor: "#dbeafe",
  },
  {
    id: "concluida",
    title: "Concluída",
    status: "concluida" as const,
    color: "var(--color-success)",
    bgColor: "#dcfce7",
  },
  {
    id: "cancelada",
    title: "Cancelada",
    status: "cancelada" as const,
    color: "var(--color-error)",
    bgColor: "#fecaca",
  },
];

// ===== PRIORITY CONFIGURATION =====
const PRIORITY_CONFIG = {
  baixa: {
    color: "var(--text-secondary)",
    label: "Baixa",
    icon: Flag,
    bgColor: "#f3f4f6",
  },
  media: {
    color: "var(--color-warning)",
    label: "Média",
    icon: Flag,
    bgColor: "#fef3c7",
  },
  alta: {
    color: "var(--color-error)",
    label: "Alta",
    icon: Flag,
    bgColor: "#fecaca",
  },
  critica: {
    color: "#dc2626",
    label: "Crítica",
    icon: AlertTriangle,
    bgColor: "#fee2e2",
  },
};

// ===== COMPONENT =====
const TarefasKanban: React.FC<TarefasKanbanProps> = ({
  searchQuery,
  viewMode,
  onViewModeChange,
}) => {
  const [filterPriority, setFilterPriority] = useState<string[]>([]);
  const [filterResponsavel, setFilterResponsavel] = useState<string[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  // ===== FILTERED TASKS =====
  const filteredTarefas = useMemo(() => {
    let filtered = mockTarefas;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (tarefa) =>
          tarefa.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tarefa.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tarefa.responsavel
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (tarefa.cliente &&
            tarefa.cliente.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }

    // Apply priority filter
    if (filterPriority.length > 0) {
      filtered = filtered.filter((tarefa) =>
        filterPriority.includes(tarefa.prioridade),
      );
    }

    // Apply responsavel filter
    if (filterResponsavel.length > 0) {
      filtered = filtered.filter((tarefa) =>
        filterResponsavel.includes(tarefa.responsavel),
      );
    }

    return filtered;
  }, [searchQuery, filterPriority, filterResponsavel]);

  // ===== HANDLERS =====
  const handleTaskAction = useCallback((action: string, taskId: string) => {
    switch (action) {
      case "view":
        console.log("Viewing task:", taskId);
        break;
      case "edit":
        console.log("Editing task:", taskId);
        break;
      case "complete":
        console.log("Completing task:", taskId);
        break;
      case "delete":
        console.log("Deleting task:", taskId);
        break;
      default:
        console.log("Unknown action:", action);
    }
  }, []);

  const formatDate = useCallback((date: Date | undefined) => {
    if (!date) return "—";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }).format(date);
  }, []);

  const getDaysUntilDeadline = useCallback((date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);

  const isOverdue = useCallback(
    (date: Date) => {
      return getDaysUntilDeadline(date) < 0;
    },
    [getDaysUntilDeadline],
  );

  const isUrgent = useCallback(
    (date: Date) => {
      const days = getDaysUntilDeadline(date);
      return days >= 0 && days <= 2;
    },
    [getDaysUntilDeadline],
  );

  // ===== RENDER FUNCTIONS =====
  const renderTaskCard = (tarefa: Tarefa) => {
    const isTaskOverdue = isOverdue(tarefa.prazo);
    const isTaskUrgent = isUrgent(tarefa.prazo);
    const priorityConfig = PRIORITY_CONFIG[tarefa.prioridade];

    return (
      <Card
        key={tarefa.id}
        padding="md"
        style={{
          marginBottom: "0.75rem",
          cursor: "pointer",
          borderLeft: `3px solid ${priorityConfig.color}`,
          backgroundColor: isTaskOverdue
            ? "#fef2f2"
            : isTaskUrgent
              ? "#fffbeb"
              : "var(--surface-primary)",
        }}
        onClick={() => handleTaskAction("view", tarefa.id)}
      >
        {/* Priority Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.75rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              padding: "0.25rem 0.5rem",
              backgroundColor: priorityConfig.bgColor,
              borderRadius: "var(--radius-sm)",
            }}
          >
            <priorityConfig.icon
              size={12}
              style={{ color: priorityConfig.color }}
            />
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: "500",
                color: priorityConfig.color,
              }}
            >
              {priorityConfig.label}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={MoreVertical}
            onClick={(e) => {
              e.stopPropagation();
              // Open context menu
            }}
            style={{ padding: "0.25rem" }}
          />
        </div>

        {/* Task Title */}
        <h4
          style={{
            margin: "0 0 0.5rem",
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "var(--text-primary)",
            lineHeight: 1.4,
          }}
        >
          {tarefa.titulo}
        </h4>

        {/* Task Description */}
        <p
          style={{
            margin: "0 0 0.75rem",
            fontSize: "0.75rem",
            color: "var(--text-secondary)",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {tarefa.descricao}
        </p>

        {/* Associated Items */}
        {(tarefa.cliente || tarefa.processo || tarefa.contrato) && (
          <div style={{ marginBottom: "0.75rem" }}>
            {tarefa.cliente && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  marginBottom: "0.25rem",
                }}
              >
                <User size={12} style={{ color: "var(--text-tertiary)" }} />
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  {tarefa.cliente}
                </span>
              </div>
            )}
            {tarefa.processo && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  marginBottom: "0.25rem",
                }}
              >
                <CheckSquare
                  size={12}
                  style={{ color: "var(--text-tertiary)" }}
                />
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  {tarefa.processo}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Deadline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "0.75rem",
            borderTop: "1px solid var(--border-primary)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <Clock
              size={12}
              style={{
                color: isTaskOverdue
                  ? "var(--color-error)"
                  : isTaskUrgent
                    ? "var(--color-warning)"
                    : "var(--text-tertiary)",
              }}
            />
            <span
              style={{
                fontSize: "0.75rem",
                color: isTaskOverdue
                  ? "var(--color-error)"
                  : isTaskUrgent
                    ? "var(--color-warning)"
                    : "var(--text-secondary)",
                fontWeight: isTaskOverdue || isTaskUrgent ? "600" : "normal",
              }}
            >
              {formatDate(tarefa.prazo)}
              {isTaskOverdue && " (Atrasada)"}
              {isTaskUrgent && !isTaskOverdue && " (Urgente)"}
            </span>
          </div>

          {/* Responsible */}
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: "var(--primary-50)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              fontWeight: "600",
              color: "var(--primary-600)",
            }}
            title={tarefa.responsavel}
          >
            {tarefa.responsavel
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
        </div>

        {/* Tags */}
        {tarefa.tags.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "0.25rem",
              marginTop: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            {tarefa.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                style={{
                  padding: "0.125rem 0.375rem",
                  backgroundColor: "var(--surface-secondary)",
                  color: "var(--text-secondary)",
                  fontSize: "0.625rem",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Card>
    );
  };

  const renderKanbanColumn = (column: (typeof KANBAN_COLUMNS)[0]) => {
    const columnTasks = filteredTarefas.filter(
      (tarefa) => tarefa.status === column.status,
    );

    return (
      <div
        key={column.id}
        style={{
          flex: 1,
          minWidth: "300px",
          backgroundColor: "var(--surface-secondary)",
          borderRadius: "var(--radius-lg)",
          padding: "1rem",
          height: "fit-content",
        }}
      >
        {/* Column Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
            paddingBottom: "0.5rem",
            borderBottom: "2px solid var(--border-primary)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: column.color,
              }}
            />
            <h3
              style={{
                margin: 0,
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "var(--text-primary)",
              }}
            >
              {column.title}
            </h3>
            <span
              style={{
                padding: "0.25rem 0.5rem",
                backgroundColor: column.bgColor,
                color: column.color,
                fontSize: "0.75rem",
                fontWeight: "600",
                borderRadius: "var(--radius-sm)",
              }}
            >
              {columnTasks.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={Plus}
            onClick={() => {
              // Open new task modal with pre-selected status
              console.log("Creating new task with status:", column.status);
            }}
          />
        </div>

        {/* Column Tasks */}
        <div style={{ minHeight: "200px" }}>
          {columnTasks.length > 0 ? (
            columnTasks.map(renderTaskCard)
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "2rem 1rem",
                color: "var(--text-tertiary)",
              }}
            >
              <CheckSquare size={32} style={{ marginBottom: "0.5rem" }} />
              <p style={{ margin: 0, fontSize: "0.875rem" }}>
                Nenhuma tarefa {column.title.toLowerCase()}
              </p>
            </div>
          )}
        </div>
      </div>
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
          <Button variant="secondary" icon={Filter} size="sm">
            Filtros ({filterPriority.length + filterResponsavel.length})
          </Button>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button variant="secondary" icon={Calendar} size="sm">
            Agenda
          </Button>
          <Button variant="primary" icon={Plus} size="sm">
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div style={{ marginBottom: "1.5rem" }}>
        <p
          style={{
            margin: 0,
            color: "var(--text-secondary)",
            fontSize: "0.875rem",
          }}
        >
          Mostrando {filteredTarefas.length} de {mockTarefas.length} tarefas
          {searchQuery && ` para "${searchQuery}"`}
        </p>
      </div>

      {/* Kanban Board */}
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          overflowX: "auto",
          paddingBottom: "1rem",
        }}
      >
        {KANBAN_COLUMNS.map(renderKanbanColumn)}
      </div>

      {/* Statistics */}
      <div
        style={{
          marginTop: "2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {KANBAN_COLUMNS.map((column) => {
          const columnTasks = filteredTarefas.filter(
            (tarefa) => tarefa.status === column.status,
          );
          const percentage =
            filteredTarefas.length > 0
              ? Math.round((columnTasks.length / filteredTarefas.length) * 100)
              : 0;

          return (
            <Card key={column.id} padding="md">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "var(--text-primary)",
                  }}
                >
                  {column.title}
                </span>
                <span
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    color: column.color,
                  }}
                >
                  {columnTasks.length}
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "4px",
                  backgroundColor: "var(--surface-secondary)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${percentage}%`,
                    height: "100%",
                    backgroundColor: column.color,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                  marginTop: "0.25rem",
                }}
              >
                {percentage}% do total
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(TarefasKanban);
