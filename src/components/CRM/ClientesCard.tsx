/**
 * CLIENTES CARD COMPONENT
 * Subcomponente modular para gestão de clientes
 * Reutilizável e otimizado para performance
 */

import React, { useState, useMemo, useCallback } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Star,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import Card from "@/components/ui/OptimizedCard";
import Button from "@/components/ui/OptimizedButton";
import Input from "@/components/ui/OptimizedInput";
import { Cliente } from "@/hooks/useCRMUnificado";

// ===== TYPES =====
interface ClientesCardProps {
  searchQuery: string;
  viewMode: "cards" | "table" | "kanban" | "timeline";
  onViewModeChange: (mode: "cards" | "table" | "kanban" | "timeline") => void;
}

// ===== MOCK DATA =====
const mockClientes: Cliente[] = Array.from({ length: 12 }, (_, i) => ({
  id: `client-${i + 1}`,
  nome: `${["João", "Maria", "Pedro", "Ana", "Carlos", "Lucia"][i % 6]} ${["Silva", "Santos", "Oliveira", "Costa"][i % 4]}`,
  email: `cliente${i + 1}@email.com`,
  telefone: `(11) 9999-${String(1000 + i).slice(-4)}`,
  documento: `${String(Math.random()).slice(2, 13)}`,
  tipo: i % 3 === 0 ? "PJ" : "PF",
  status: ["ativo", "inativo", "prospecto", "vip", "inadimplente"][
    i % 5
  ] as any,
  endereco: {
    cep: `${String(i + 1).padStart(2, "0")}000-000`,
    logradouro: `Rua das Flores, ${(i + 1) * 10}`,
    numero: String((i + 1) * 10),
    bairro: "Centro",
    cidade: "São Paulo",
    uf: "SP",
  },
  dataCadastro: new Date(2023, i % 12, (i % 28) + 1),
  ultimoContato: new Date(2023, 11, Math.floor(Math.random() * 30) + 1),
  valorTotal: (i + 1) * 5000 + Math.floor(Math.random() * 10000),
  scoreEngajamento: Math.floor(Math.random() * 100),
  responsavel: ["Dr. João", "Dra. Maria", "Dr. Pedro"][i % 3],
  origem: ["Site", "Indicação", "Marketing", "Cold Call"][i % 4],
  tags: [`tag-${i % 3}`, `categoria-${i % 4}`],
  processos: [],
  contratos: [],
  tarefas: [],
}));

// ===== STATUS CONFIGURATION =====
const STATUS_CONFIG = {
  ativo: { color: "var(--color-success)", label: "Ativo", bgColor: "#dcfce7" },
  inativo: {
    color: "var(--text-secondary)",
    label: "Inativo",
    bgColor: "#f3f4f6",
  },
  prospecto: {
    color: "var(--primary-500)",
    label: "Prospecto",
    bgColor: "#dbeafe",
  },
  vip: { color: "var(--color-warning)", label: "VIP", bgColor: "#fef3c7" },
  inadimplente: {
    color: "var(--color-error)",
    label: "Inadimplente",
    bgColor: "#fecaca",
  },
};

// ===== COMPONENT =====
const ClientesCard: React.FC<ClientesCardProps> = ({
  searchQuery,
  viewMode,
  onViewModeChange,
}) => {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"nome" | "valorTotal" | "ultimoContato">(
    "nome",
  );
  const [filterStatus, setFilterStatus] = useState<string[]>([]);

  // ===== FILTERED AND SORTED CLIENTS =====
  const processedClientes = useMemo(() => {
    let filtered = mockClientes;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (cliente) =>
          cliente.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cliente.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cliente.documento.includes(searchQuery),
      );
    }

    // Apply status filter
    if (filterStatus.length > 0) {
      filtered = filtered.filter((cliente) =>
        filterStatus.includes(cliente.status),
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "valorTotal":
          return b.valorTotal - a.valorTotal;
        case "ultimoContato":
          return (
            (b.ultimoContato?.getTime() || 0) -
            (a.ultimoContato?.getTime() || 0)
          );
        default:
          return a.nome.localeCompare(b.nome);
      }
    });

    return filtered;
  }, [searchQuery, filterStatus, sortBy]);

  // ===== HANDLERS =====
  const handleClientSelect = useCallback((clientId: string) => {
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId],
    );
  }, []);

  const handleClientAction = useCallback((action: string, clientId: string) => {
    switch (action) {
      case "view":
        console.log("Viewing client:", clientId);
        break;
      case "edit":
        console.log("Editing client:", clientId);
        break;
      case "delete":
        console.log("Deleting client:", clientId);
        break;
      default:
        console.log("Unknown action:", action);
    }
  }, []);

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }, []);

  const formatDate = useCallback((date: Date | undefined) => {
    if (!date) return "Nunca";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  }, []);

  // ===== RENDER FUNCTIONS =====
  const renderClientCard = (cliente: Cliente) => (
    <Card
      key={cliente.id}
      padding="lg"
      hover
      interactive
      onClick={() => handleClientAction("view", cliente.id)}
      style={{
        cursor: "pointer",
        position: "relative",
        border: selectedClients.includes(cliente.id)
          ? "2px solid var(--primary-500)"
          : "1px solid var(--border-primary)",
      }}
    >
      {/* Status Badge */}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          padding: "0.25rem 0.75rem",
          borderRadius: "var(--radius-lg)",
          backgroundColor: STATUS_CONFIG[cliente.status].bgColor,
          color: STATUS_CONFIG[cliente.status].color,
          fontSize: "0.75rem",
          fontWeight: "600",
        }}
      >
        {STATUS_CONFIG[cliente.status].label}
      </div>

      {/* Client Header */}
      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "0.5rem",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "var(--primary-50)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--primary-500)",
              fontWeight: "600",
              fontSize: "1.125rem",
            }}
          >
            {cliente.nome
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div style={{ flex: 1 }}>
            <h3
              style={{
                margin: 0,
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "var(--text-primary)",
              }}
            >
              {cliente.nome}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
              }}
            >
              {cliente.tipo} • {cliente.responsavel}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.25rem",
          }}
        >
          <Mail size={14} style={{ color: "var(--text-tertiary)" }} />
          <span
            style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}
          >
            {cliente.email}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.25rem",
          }}
        >
          <Phone size={14} style={{ color: "var(--text-tertiary)" }} />
          <span
            style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}
          >
            {cliente.telefone}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <MapPin size={14} style={{ color: "var(--text-tertiary)" }} />
          <span
            style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}
          >
            {cliente.endereco.cidade}, {cliente.endereco.uf}
          </span>
        </div>
      </div>

      {/* Metrics */}
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
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "1.25rem",
              fontWeight: "700",
              color: "var(--text-primary)",
            }}
          >
            {formatCurrency(cliente.valorTotal)}
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--text-secondary)",
            }}
          >
            Valor Total
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "1.25rem",
              fontWeight: "700",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.25rem",
            }}
          >
            {cliente.scoreEngajamento}
            <Star size={16} style={{ color: "var(--color-warning)" }} />
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--text-secondary)",
            }}
          >
            Engajamento
          </div>
        </div>
      </div>

      {/* Tags */}
      {cliente.tags.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {cliente.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                style={{
                  padding: "0.25rem 0.5rem",
                  backgroundColor: "var(--primary-50)",
                  color: "var(--primary-600)",
                  fontSize: "0.75rem",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                {tag}
              </span>
            ))}
            {cliente.tags.length > 2 && (
              <span
                style={{
                  padding: "0.25rem 0.5rem",
                  backgroundColor: "var(--surface-tertiary)",
                  color: "var(--text-secondary)",
                  fontSize: "0.75rem",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                +{cliente.tags.length - 2}
              </span>
            )}
          </div>
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
        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
          Último contato: {formatDate(cliente.ultimoContato)}
        </div>
        <div style={{ display: "flex", gap: "0.25rem" }}>
          <Button
            variant="ghost"
            size="sm"
            icon={Eye}
            onClick={(e) => {
              e.stopPropagation();
              handleClientAction("view", cliente.id);
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={(e) => {
              e.stopPropagation();
              handleClientAction("edit", cliente.id);
            }}
          />
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
    </Card>
  );

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
            <option value="nome">Ordenar por Nome</option>
            <option value="valorTotal">Ordenar por Valor</option>
            <option value="ultimoContato">Ordenar por Último Contato</option>
          </select>

          <Button variant="secondary" icon={Filter} size="sm">
            Filtros ({filterStatus.length})
          </Button>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button variant="secondary" icon={Search} size="sm">
            Busca Avançada
          </Button>
          <Button variant="primary" icon={Plus} size="sm">
            Novo Cliente
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
          Mostrando {processedClientes.length} de {mockClientes.length} clientes
          {searchQuery && ` para "${searchQuery}"`}
        </p>
      </div>

      {/* Client Grid */}
      {processedClientes.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {processedClientes.map(renderClientCard)}
        </div>
      ) : (
        <Card padding="lg">
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <Users
              size={64}
              style={{ color: "var(--text-tertiary)", marginBottom: "1rem" }}
            />
            <h3 style={{ margin: "0 0 0.5rem", color: "var(--text-primary)" }}>
              Nenhum cliente encontrado
            </h3>
            <p style={{ margin: "0 0 1rem", color: "var(--text-secondary)" }}>
              {searchQuery
                ? `Nenhum resultado para "${searchQuery}"`
                : "Comece adicionando seu primeiro cliente"}
            </p>
            <Button variant="primary" icon={Plus}>
              Adicionar Cliente
            </Button>
          </div>
        </Card>
      )}

      {/* Selected Actions */}
      {selectedClients.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "var(--surface-primary)",
            border: "1px solid var(--border-primary)",
            borderRadius: "var(--radius-lg)",
            padding: "1rem",
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            zIndex: 50,
          }}
        >
          <span
            style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}
          >
            {selectedClients.length} selecionados
          </span>
          <Button variant="secondary" size="sm">
            Exportar
          </Button>
          <Button variant="secondary" size="sm">
            Enviar Email
          </Button>
          <Button variant="secondary" size="sm" icon={Trash2}>
            Excluir
          </Button>
        </div>
      )}
    </div>
  );
};

export default React.memo(ClientesCard);
