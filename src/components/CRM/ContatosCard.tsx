/**
 * 🎯 MÓDULO CONTATOS - GESTÃO COMPLETA DE CONTATOS
 *
 * Funcionalidades:
 * - Gestão de Pessoa Física e Jurídica
 * - CPF/CNPJ validation
 * - Classificação por tipo de relacionamento
 * - Timeline de interações
 * - Integração com Google Contacts
 * - Import/Export CSV
 * - Tags e filtros personalizáveis
 */

import React, { useState, useMemo, useCallback } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Mail,
  Phone,
  MapPin,
  Building,
  User,
  Calendar,
  Tag,
  ExternalLink,
  Edit,
  Trash2,
  Star,
  Clock,
} from "lucide-react";

// Design System Components
import Card from "@/components/ui/OptimizedCard";
import Button from "@/components/ui/OptimizedButton";
import Input from "@/components/ui/OptimizedInput";

// ===== TYPES =====
export interface Contato {
  id: string;
  nome: string;
  documento: string; // CPF ou CNPJ
  email: string;
  telefone: string;
  telefoneSecundario?: string;
  tipo: "PF" | "PJ"; // Pessoa Física ou Jurídica
  nacionalidade: string;
  estadoCivil?:
    | "solteiro"
    | "casado"
    | "divorciado"
    | "separado"
    | "uniao_estavel"
    | "viuvo";
  profissao?: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
  };
  classificacao:
    | "cliente"
    | "parceiro"
    | "fornecedor"
    | "oportunidade"
    | "interno";
  tags: string[];
  dataCadastro: Date;
  ultimaInteracao?: Date;
  responsavel: string;
  observacoes?: string;
  relacionamentos: {
    negocios: string[];
    tarefas: string[];
    processos: string[];
    documentos: string[];
  };
  timeline: InteracaoTimeline[];
  ativo: boolean;
  favorito: boolean;
  origem: "manual" | "importacao" | "google_contacts" | "site" | "indicacao";
}

export interface InteracaoTimeline {
  id: string;
  tipo: "email" | "ligacao" | "reuniao" | "whatsapp" | "documento" | "tarefa";
  data: Date;
  titulo: string;
  descricao?: string;
  responsavel: string;
  anexos?: string[];
}

interface ContatosCardProps {
  searchQuery?: string;
  viewMode?: "cards" | "table" | "timeline";
  onViewModeChange?: (mode: "cards" | "table" | "timeline") => void;
}

// ===== MOCK DATA =====
const generateMockContatos = (): Contato[] => {
  return Array.from({ length: 30 }, (_, i) => ({
    id: `contato-${i + 1}`,
    nome:
      i % 3 === 0
        ? `Empresa ${i + 1} Ltda`
        : `${["João", "Maria", "Pedro", "Ana", "Carlos", "Beatriz"][i % 6]} ${["Silva", "Santos", "Oliveira", "Costa", "Pereira"][i % 5]}`,
    documento:
      i % 3 === 0
        ? `${String(Math.random()).slice(2, 16)}/0001-${String(i).padStart(2, "0")}`
        : `${String(Math.random()).slice(2, 13)}`,
    email: `contato${i + 1}@${i % 3 === 0 ? "empresa" : "email"}.com`,
    telefone: `(11) 9${String(i + 1).padStart(4, "0")}-${String(i + 1000).slice(-4)}`,
    telefoneSecundario:
      i % 4 === 0
        ? `(11) 3${String(i + 1).padStart(3, "0")}-${String(i + 5000).slice(-4)}`
        : undefined,
    tipo: i % 3 === 0 ? "PJ" : "PF",
    nacionalidade: "Brasileira",
    estadoCivil:
      i % 3 === 0
        ? undefined
        : ([
            "solteiro",
            "casado",
            "divorciado",
            "separado",
            "uniao_estavel",
            "viuvo",
          ][i % 6] as any),
    profissao:
      i % 3 === 0
        ? undefined
        : [
            "Advogado",
            "Empresário",
            "Médico",
            "Engenheiro",
            "Professor",
            "Consultor",
          ][i % 6],
    endereco: {
      cep: `${String(i + 1).padStart(2, "0")}${String(i + 100).slice(-3)}-${String(i + 10).slice(-3)}`,
      logradouro: `${["Rua", "Avenida", "Alameda"][i % 3]} ${["das Flores", "Principal", "dos Advogados", "Central", "São Paulo"][i % 5]}`,
      numero: String((i + 1) * 10),
      complemento: i % 5 === 0 ? `Sala ${i + 10}` : undefined,
      bairro: ["Centro", "Vila Olimpia", "Jardins", "Brooklin", "Pinheiros"][
        i % 5
      ],
      cidade: "São Paulo",
      uf: "SP",
    },
    classificacao: [
      "cliente",
      "parceiro",
      "fornecedor",
      "oportunidade",
      "interno",
    ][i % 5] as any,
    tags: [`tag-${i % 3}`, `area-${i % 4}`, `origem-${i % 2}`],
    dataCadastro: new Date(2023, i % 12, (i % 28) + 1),
    ultimaInteracao: i % 4 === 0 ? new Date() : undefined,
    responsavel: ["Dr. João Silva", "Dra. Maria Santos", "Dr. Pedro Costa"][
      i % 3
    ],
    observacoes:
      i % 3 === 0
        ? `Observações importantes sobre o contato ${i + 1}`
        : undefined,
    relacionamentos: {
      negocios: i % 2 === 0 ? [`negocio-${i + 1}`] : [],
      tarefas: [`tarefa-${i + 1}`, `tarefa-${i + 2}`],
      processos: i % 3 === 0 ? [`processo-${i + 1}`] : [],
      documentos: [`doc-${i + 1}`],
    },
    timeline: [
      {
        id: `timeline-${i + 1}-1`,
        tipo: ["email", "ligacao", "reuniao", "whatsapp", "documento"][
          i % 5
        ] as any,
        data: new Date(),
        titulo: `Interação ${i + 1}`,
        descricao: `Descrição da interação com o contato`,
        responsavel: "Dr. João Silva",
      },
    ],
    ativo: i % 10 !== 0,
    favorito: i % 8 === 0,
    origem: ["manual", "importacao", "google_contacts", "site", "indicacao"][
      i % 5
    ] as any,
  }));
};

// ===== MAIN COMPONENT =====
const ContatosCard: React.FC<ContatosCardProps> = ({
  searchQuery = "",
  viewMode = "cards",
  onViewModeChange,
}) => {
  // ===== STATE =====
  const [contatos] = useState<Contato[]>(generateMockContatos());
  const [selectedContato, setSelectedContato] = useState<Contato | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentView, setCurrentView] = useState<
    "lista" | "detalhes" | "timeline"
  >("lista");
  const [filtros, setFiltros] = useState({
    tipo: "todos" as "todos" | "PF" | "PJ",
    classificacao: "todos" as
      | "todos"
      | "cliente"
      | "parceiro"
      | "fornecedor"
      | "oportunidade"
      | "interno",
    status: "todos" as "todos" | "ativo" | "inativo",
    favoritos: false,
  });

  // ===== FILTERED DATA =====
  const contatosFiltrados = useMemo(() => {
    return contatos.filter((contato) => {
      const matchSearch =
        searchQuery === "" ||
        contato.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contato.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contato.documento.includes(searchQuery) ||
        contato.telefone.includes(searchQuery);

      const matchTipo =
        filtros.tipo === "todos" || contato.tipo === filtros.tipo;
      const matchClassificacao =
        filtros.classificacao === "todos" ||
        contato.classificacao === filtros.classificacao;
      const matchStatus =
        filtros.status === "todos" ||
        (filtros.status === "ativo" && contato.ativo) ||
        (filtros.status === "inativo" && !contato.ativo);
      const matchFavoritos = !filtros.favoritos || contato.favorito;

      return (
        matchSearch &&
        matchTipo &&
        matchClassificacao &&
        matchStatus &&
        matchFavoritos
      );
    });
  }, [contatos, searchQuery, filtros]);

  // ===== STATISTICS =====
  const estatisticas = useMemo(() => {
    return {
      total: contatos.length,
      ativos: contatos.filter((c) => c.ativo).length,
      pessoaFisica: contatos.filter((c) => c.tipo === "PF").length,
      pessoaJuridica: contatos.filter((c) => c.tipo === "PJ").length,
      clientes: contatos.filter((c) => c.classificacao === "cliente").length,
      favoritos: contatos.filter((c) => c.favorito).length,
    };
  }, [contatos]);

  // ===== HANDLERS =====
  const handleNovoContato = useCallback(() => {
    setSelectedContato(null);
    setShowModal(true);
  }, []);

  const handleEditarContato = useCallback((contato: Contato) => {
    setSelectedContato(contato);
    setShowModal(true);
  }, []);

  const handleVerDetalhes = useCallback((contato: Contato) => {
    setSelectedContato(contato);
    setCurrentView("detalhes");
  }, []);

  const handleExportarCSV = useCallback(() => {
    // Implementar exportação CSV
    console.log("Exportando contatos para CSV...");
  }, []);

  const handleImportarCSV = useCallback(() => {
    // Implementar importação CSV
    console.log("Importando contatos de CSV...");
  }, []);

  // ===== RENDER FUNCTIONS =====
  const renderFiltros = () => (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
        marginBottom: "1rem",
      }}
    >
      <select
        value={filtros.tipo}
        onChange={(e) =>
          setFiltros((prev) => ({ ...prev, tipo: e.target.value as any }))
        }
        style={{
          padding: "0.5rem",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-primary)",
          backgroundColor: "var(--surface-primary)",
        }}
      >
        <option value="todos">Todos os Tipos</option>
        <option value="PF">Pessoa Física</option>
        <option value="PJ">Pessoa Jurídica</option>
      </select>

      <select
        value={filtros.classificacao}
        onChange={(e) =>
          setFiltros((prev) => ({
            ...prev,
            classificacao: e.target.value as any,
          }))
        }
        style={{
          padding: "0.5rem",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-primary)",
          backgroundColor: "var(--surface-primary)",
        }}
      >
        <option value="todos">Todas as Classificações</option>
        <option value="cliente">Cliente</option>
        <option value="parceiro">Parceiro</option>
        <option value="fornecedor">Fornecedor</option>
        <option value="oportunidade">Oportunidade</option>
        <option value="interno">Interno</option>
      </select>

      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <input
          type="checkbox"
          checked={filtros.favoritos}
          onChange={(e) =>
            setFiltros((prev) => ({ ...prev, favoritos: e.target.checked }))
          }
        />
        Apenas Favoritos
      </label>
    </div>
  );

  const renderEstatisticas = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: "1rem",
        marginBottom: "1.5rem",
      }}
    >
      <Card padding="md" style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "var(--primary-500)",
          }}
        >
          {estatisticas.total}
        </div>
        <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Total
        </div>
      </Card>
      <Card padding="md" style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "var(--color-success)",
          }}
        >
          {estatisticas.ativos}
        </div>
        <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Ativos
        </div>
      </Card>
      <Card padding="md" style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "var(--color-info)",
          }}
        >
          {estatisticas.pessoaFisica}
        </div>
        <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Pessoa Física
        </div>
      </Card>
      <Card padding="md" style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "var(--color-warning)",
          }}
        >
          {estatisticas.pessoaJuridica}
        </div>
        <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Pessoa Jurídica
        </div>
      </Card>
      <Card padding="md" style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "var(--primary-600)",
          }}
        >
          {estatisticas.clientes}
        </div>
        <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Clientes
        </div>
      </Card>
      <Card padding="md" style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "var(--color-warning)",
          }}
        >
          {estatisticas.favoritos}
        </div>
        <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Favoritos
        </div>
      </Card>
    </div>
  );

  const renderContatoCard = (contato: Contato) => {
    const getClassificacaoColor = (classificacao: string) => {
      const colors = {
        cliente: "var(--color-success)",
        parceiro: "var(--color-info)",
        fornecedor: "var(--color-warning)",
        oportunidade: "var(--primary-500)",
        interno: "var(--text-secondary)",
      };
      return (
        colors[classificacao as keyof typeof colors] || "var(--text-secondary)"
      );
    };

    return (
      <Card
        key={contato.id}
        padding="lg"
        hover
        interactive
        onClick={() => handleVerDetalhes(contato)}
        style={{ cursor: "pointer", position: "relative" }}
      >
        {contato.favorito && (
          <Star
            size={16}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              color: "var(--color-warning)",
              fill: "var(--color-warning)",
            }}
          />
        )}

        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: `${getClassificacaoColor(contato.classificacao)}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {contato.tipo === "PJ" ? (
              <Building
                size={20}
                style={{ color: getClassificacaoColor(contato.classificacao) }}
              />
            ) : (
              <User
                size={20}
                style={{ color: getClassificacaoColor(contato.classificacao) }}
              />
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {contato.nome}
              </h3>
              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "0.125rem 0.5rem",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: `${getClassificacaoColor(contato.classificacao)}20`,
                  color: getClassificacaoColor(contato.classificacao),
                  fontWeight: "500",
                }}
              >
                {contato.classificacao}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
                marginBottom: "0.75rem",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Mail size={14} style={{ color: "var(--text-secondary)" }} />
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  {contato.email}
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Phone size={14} style={{ color: "var(--text-secondary)" }} />
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  {contato.telefone}
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <MapPin size={14} style={{ color: "var(--text-secondary)" }} />
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  {contato.endereco.cidade}, {contato.endereco.uf}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {contato.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.125rem 0.375rem",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--surface-secondary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid var(--border-primary)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Clock size={14} style={{ color: "var(--text-secondary)" }} />
            <span
              style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}
            >
              {contato.ultimaInteracao
                ? `Última interação: ${contato.ultimaInteracao.toLocaleDateString()}`
                : "Sem interações recentes"}
            </span>
          </div>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: contato.ativo
                ? "var(--color-success)"
                : "var(--text-secondary)",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "3rem",
            display: "flex",
            gap: "0.25rem",
            opacity: 0,
            transition: "opacity 0.2s",
          }}
          className="card-actions"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={() => handleEditarContato(contato)}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={ExternalLink}
            onClick={() => handleVerDetalhes(contato)}
          />
        </div>
      </Card>
    );
  };

  // ===== MAIN RENDER =====
  if (currentView === "detalhes" && selectedContato) {
    return (
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <Button variant="ghost" onClick={() => setCurrentView("lista")}>
            ← Voltar
          </Button>
          <h2 style={{ margin: 0, color: "var(--text-primary)" }}>
            {selectedContato.nome}
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "1.5rem",
          }}
        >
          {/* Informações principais */}
          <Card padding="lg">
            <Card.Header title="Informações do Contato" />
            <Card.Content>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label
                    style={{ fontWeight: "500", color: "var(--text-primary)" }}
                  >
                    Nome:
                  </label>
                  <p
                    style={{
                      margin: "0.25rem 0 1rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {selectedContato.nome}
                  </p>
                </div>
                <div>
                  <label
                    style={{ fontWeight: "500", color: "var(--text-primary)" }}
                  >
                    Documento:
                  </label>
                  <p
                    style={{
                      margin: "0.25rem 0 1rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {selectedContato.documento}
                  </p>
                </div>
                <div>
                  <label
                    style={{ fontWeight: "500", color: "var(--text-primary)" }}
                  >
                    Email:
                  </label>
                  <p
                    style={{
                      margin: "0.25rem 0 1rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {selectedContato.email}
                  </p>
                </div>
                <div>
                  <label
                    style={{ fontWeight: "500", color: "var(--text-primary)" }}
                  >
                    Telefone:
                  </label>
                  <p
                    style={{
                      margin: "0.25rem 0 1rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {selectedContato.telefone}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Timeline de interações */}
          <Card padding="lg">
            <Card.Header title="Timeline de Interações" />
            <Card.Content>
              <div style={{ display: "grid", gap: "1rem" }}>
                {selectedContato.timeline.map((interacao) => (
                  <div
                    key={interacao.id}
                    style={{
                      padding: "1rem",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--surface-secondary)",
                    }}
                  >
                    <h4
                      style={{
                        margin: "0 0 0.5rem",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                      }}
                    >
                      {interacao.titulo}
                    </h4>
                    <p
                      style={{
                        margin: "0 0 0.5rem",
                        fontSize: "0.75rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {interacao.data.toLocaleDateString()} -{" "}
                      {interacao.responsavel}
                    </p>
                    {interacao.descricao && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.875rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {interacao.descricao}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header com ações */}
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
        <div>
          <h2 style={{ margin: "0 0 0.25rem", color: "var(--text-primary)" }}>
            Contatos
          </h2>
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>
            {contatosFiltrados.length} de {contatos.length} contatos
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button variant="secondary" icon={Upload} onClick={handleImportarCSV}>
            Importar CSV
          </Button>
          <Button
            variant="secondary"
            icon={Download}
            onClick={handleExportarCSV}
          >
            Exportar CSV
          </Button>
          <Button variant="primary" icon={Plus} onClick={handleNovoContato}>
            Novo Contato
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      {renderEstatisticas()}

      {/* Filtros */}
      {renderFiltros()}

      {/* Lista de contatos */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
          gap: "1rem",
        }}
      >
        {contatosFiltrados.map(renderContatoCard)}
      </div>

      {contatosFiltrados.length === 0 && (
        <Card padding="xl" style={{ textAlign: "center" }}>
          <Users
            size={48}
            style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}
          />
          <h3 style={{ margin: "0 0 0.5rem", color: "var(--text-primary)" }}>
            Nenhum contato encontrado
          </h3>
          <p style={{ margin: "0 0 1rem", color: "var(--text-secondary)" }}>
            Ajuste os filtros ou adicione um novo contato.
          </p>
          <Button variant="primary" icon={Plus} onClick={handleNovoContato}>
            Adicionar Primeiro Contato
          </Button>
        </Card>
      )}

      {/* CSS para hover effects */}
      <style>{`
        .card-actions {
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        
        [data-card]:hover .card-actions {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default React.memo(ContatosCard);
