/**
 * 🎯 MÓDULO NEGÓCIOS - PIPELINE CUSTOMIZÁVEL
 *
 * Funcionalidades:
 * - Pipeline visual em Kanban
 * - Múltiplos pipelines por tipo de negócio
 * - Personalização de etapas
 * - Atribuição de responsáveis
 * - Condições automáticas de movimentação
 * - Análise de conversão
 * - Automações e integrações
 */

import React, { useState, useMemo, useCallback } from "react";
import {
  Briefcase,
  Plus,
  DollarSign,
  Calendar,
  User,
  TrendingUp,
  Target,
  Filter,
  MoreVertical,
  Settings,
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  ArrowRight,
  Star,
  Tag,
  Edit,
  Trash2,
} from "lucide-react";

// Design System Components
import Card from "@/components/ui/OptimizedCard";
import Button from "@/components/ui/OptimizedButton";
import Input from "@/components/ui/OptimizedInput";

// ===== TYPES =====
export interface Pipeline {
  id: string;
  nome: string;
  descricao: string;
  tipo:
    | "servicos"
    | "consultoria"
    | "demandas_judiciais"
    | "contratos"
    | "personalizado";
  etapas: EtapaPipeline[];
  cor: string;
  ativo: boolean;
  criadoPor: string;
  dataCriacao: Date;
  configuracoes: {
    autoMovimentacao: boolean;
    notificacoes: boolean;
    tempoEtapa: number; // dias
  };
}

export interface EtapaPipeline {
  id: string;
  nome: string;
  descricao: string;
  ordem: number;
  cor: string;
  automacao?: {
    condicoes: string[];
    acoes: string[];
  };
  probabilidade: number; // % de conversão
}

export interface Negocio {
  id: string;
  nome: string;
  descricao?: string;
  pipelineId: string;
  etapaAtual: string;
  contatoId: string;
  contatoNome: string;
  valor: number;
  valorEstimado: number;
  moeda: "BRL" | "USD" | "EUR";
  dataEstimadaFechamento: Date;
  dataCriacao: Date;
  dataUltimaMovimentacao: Date;
  status: "ativo" | "ganho" | "perdido" | "pausado";
  prioridade: "baixa" | "media" | "alta" | "critica";
  origem:
    | "website"
    | "indicacao"
    | "cold_call"
    | "marketing"
    | "social_media"
    | "outros";
  responsavel: string;
  equipe: string[];
  probabilidadeConversao: number; // 0-100%
  tags: string[];
  observacoes?: string;
  anexos: string[];
  historico: MovimentacaoNegocio[];
  relacionamentos: {
    tarefas: string[];
    documentos: string[];
    processos: string[];
    contratos: string[];
  };
  metricas: {
    tempoNaEtapa: number; // dias
    totalInteracoes: number;
    ultimaInteracao?: Date;
  };
}

export interface MovimentacaoNegocio {
  id: string;
  tipo:
    | "mudanca_etapa"
    | "alteracao_valor"
    | "nota"
    | "tarefa"
    | "reuniao"
    | "proposta";
  data: Date;
  responsavel: string;
  descricao: string;
  etapaAnterior?: string;
  etapaNova?: string;
  valorAnterior?: number;
  valorNovo?: number;
}

interface NegociosCardProps {
  searchQuery?: string;
  viewMode?: "kanban" | "table" | "pipeline";
  onViewModeChange?: (mode: "kanban" | "table" | "pipeline") => void;
}

// ===== MOCK DATA =====
const generateMockPipelines = (): Pipeline[] => {
  return [
    {
      id: "pipeline-servicos",
      nome: "Serviços Jurídicos",
      descricao: "Pipeline padrão para prestação de serviços jurídicos",
      tipo: "servicos",
      etapas: [
        {
          id: "qualificacao",
          nome: "Qualificação",
          descricao: "Identificação e qualificação do lead",
          ordem: 1,
          cor: "#64748b",
          probabilidade: 20,
        },
        {
          id: "proposta",
          nome: "Proposta",
          descricao: "Elaboração e envio da proposta",
          ordem: 2,
          cor: "#3b82f6",
          probabilidade: 40,
        },
        {
          id: "negociacao",
          nome: "Negociação",
          descricao: "Negociação de termos e valores",
          ordem: 3,
          cor: "#f59e0b",
          probabilidade: 70,
        },
        {
          id: "fechamento",
          nome: "Fechamento",
          descricao: "Assinatura do contrato",
          ordem: 4,
          cor: "#10b981",
          probabilidade: 90,
        },
      ],
      cor: "#3b82f6",
      ativo: true,
      criadoPor: "admin",
      dataCriacao: new Date("2023-01-01"),
      configuracoes: {
        autoMovimentacao: true,
        notificacoes: true,
        tempoEtapa: 7,
      },
    },
    {
      id: "pipeline-consultoria",
      nome: "Consultoria Especializada",
      descricao: "Pipeline para projetos de consultoria",
      tipo: "consultoria",
      etapas: [
        {
          id: "descoberta",
          nome: "Descoberta",
          descricao: "Entendimento da necessidade",
          ordem: 1,
          cor: "#64748b",
          probabilidade: 25,
        },
        {
          id: "diagnostico",
          nome: "Diagnóstico",
          descricao: "Análise detalhada do caso",
          ordem: 2,
          cor: "#8b5cf6",
          probabilidade: 50,
        },
        {
          id: "proposta_tecnica",
          nome: "Proposta Técnica",
          descricao: "Elaboração da proposta técnica",
          ordem: 3,
          cor: "#f59e0b",
          probabilidade: 75,
        },
        {
          id: "aprovacao",
          nome: "Aprovação",
          descricao: "Aprovação e início do projeto",
          ordem: 4,
          cor: "#10b981",
          probabilidade: 95,
        },
      ],
      cor: "#8b5cf6",
      ativo: true,
      criadoPor: "admin",
      dataCriacao: new Date("2023-01-01"),
      configuracoes: {
        autoMovimentacao: false,
        notificacoes: true,
        tempoEtapa: 14,
      },
    },
  ];
};

const generateMockNegocios = (pipelines: Pipeline[]): Negocio[] => {
  return Array.from({ length: 20 }, (_, i) => {
    const pipeline = pipelines[i % pipelines.length];
    const etapa = pipeline.etapas[i % pipeline.etapas.length];

    return {
      id: `negocio-${i + 1}`,
      nome: `${["Consultoria Tributária", "Ação Trabalhista", "Contrato Societário", "Auditoria Legal", "Due Diligence"][i % 5]} - ${i + 1}`,
      descricao: `Descrição detalhada do negócio ${i + 1}`,
      pipelineId: pipeline.id,
      etapaAtual: etapa.id,
      contatoId: `contato-${i + 1}`,
      contatoNome: `${["Empresa ABC", "João Silva", "Maria Santos", "Pedro Costa", "Ana Oliveira"][i % 5]}`,
      valor: (i + 1) * 5000 + Math.floor(Math.random() * 10000),
      valorEstimado: (i + 1) * 7500 + Math.floor(Math.random() * 15000),
      moeda: "BRL",
      dataEstimadaFechamento: new Date(2024, i % 12, (i % 28) + 1),
      dataCriacao: new Date(2023, i % 12, (i % 28) + 1),
      dataUltimaMovimentacao: new Date(),
      status: ["ativo", "ganho", "perdido", "pausado"][i % 4] as any,
      prioridade: ["baixa", "media", "alta", "critica"][i % 4] as any,
      origem: [
        "website",
        "indicacao",
        "cold_call",
        "marketing",
        "social_media",
      ][i % 5] as any,
      responsavel: ["Dr. João Silva", "Dra. Maria Santos", "Dr. Pedro Costa"][
        i % 3
      ],
      equipe: [`equipe-${(i % 3) + 1}`],
      probabilidadeConversao:
        etapa.probabilidade + Math.floor(Math.random() * 20) - 10,
      tags: [`tag-${i % 3}`, `area-${i % 4}`],
      observacoes:
        i % 3 === 0
          ? `Observação importante sobre o negócio ${i + 1}`
          : undefined,
      anexos: [`arquivo-${i + 1}.pdf`],
      historico: [
        {
          id: `hist-${i + 1}`,
          tipo: "mudanca_etapa",
          data: new Date(),
          responsavel: "Dr. João Silva",
          descricao: `Negócio movido para ${etapa.nome}`,
          etapaNova: etapa.id,
        },
      ],
      relacionamentos: {
        tarefas: [`tarefa-${i + 1}`],
        documentos: [`doc-${i + 1}`],
        processos: i % 3 === 0 ? [`processo-${i + 1}`] : [],
        contratos: [],
      },
      metricas: {
        tempoNaEtapa: Math.floor(Math.random() * 30) + 1,
        totalInteracoes: Math.floor(Math.random() * 10) + 1,
        ultimaInteracao: new Date(),
      },
    };
  });
};

// ===== MAIN COMPONENT =====
const NegociosCard: React.FC<NegociosCardProps> = ({
  searchQuery = "",
  viewMode = "kanban",
  onViewModeChange,
}) => {
  // ===== STATE =====
  const [pipelines] = useState<Pipeline[]>(generateMockPipelines());
  const [negocios] = useState<Negocio[]>(generateMockNegocios(pipelines));
  const [pipelineAtivo, setPipelineAtivo] = useState<string>(
    pipelines[0]?.id || "",
  );
  const [selectedNegocio, setSelectedNegocio] = useState<Negocio | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filtros, setFiltros] = useState({
    status: "todos" as "todos" | "ativo" | "ganho" | "perdido" | "pausado",
    responsavel: "todos" as string,
    prioridade: "todos" as "todos" | "baixa" | "media" | "alta" | "critica",
  });

  // ===== COMPUTED VALUES =====
  const pipelineConfig = useMemo(() => {
    return pipelines.find((p) => p.id === pipelineAtivo);
  }, [pipelines, pipelineAtivo]);

  const negociosFiltrados = useMemo(() => {
    return negocios.filter((negocio) => {
      const matchPipeline = negocio.pipelineId === pipelineAtivo;
      const matchSearch =
        searchQuery === "" ||
        negocio.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        negocio.contatoNome.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        filtros.status === "todos" || negocio.status === filtros.status;
      const matchResponsavel =
        filtros.responsavel === "todos" ||
        negocio.responsavel === filtros.responsavel;
      const matchPrioridade =
        filtros.prioridade === "todos" ||
        negocio.prioridade === filtros.prioridade;

      return (
        matchPipeline &&
        matchSearch &&
        matchStatus &&
        matchResponsavel &&
        matchPrioridade
      );
    });
  }, [negocios, pipelineAtivo, searchQuery, filtros]);

  const negociosPorEtapa = useMemo(() => {
    if (!pipelineConfig) return {};

    const grupos: Record<string, Negocio[]> = {};
    pipelineConfig.etapas.forEach((etapa) => {
      grupos[etapa.id] = negociosFiltrados.filter(
        (n) => n.etapaAtual === etapa.id,
      );
    });

    return grupos;
  }, [negociosFiltrados, pipelineConfig]);

  const estatisticas = useMemo(() => {
    const negociosAtivos = negociosFiltrados.filter(
      (n) => n.status === "ativo",
    );
    const valorTotal = negociosAtivos.reduce((sum, n) => sum + n.valor, 0);
    const valorEstimado = negociosAtivos.reduce(
      (sum, n) => sum + n.valorEstimado,
      0,
    );

    return {
      totalNegocios: negociosAtivos.length,
      valorTotal,
      valorEstimado,
      ticketMedio:
        negociosAtivos.length > 0 ? valorTotal / negociosAtivos.length : 0,
      taxaConversao:
        (negocios.filter((n) => n.status === "ganho").length /
          Math.max(negocios.length, 1)) *
        100,
    };
  }, [negociosFiltrados, negocios]);

  // ===== HANDLERS =====
  const handleNovoNegocio = useCallback(() => {
    setSelectedNegocio(null);
    setShowModal(true);
  }, []);

  const handleEditarNegocio = useCallback((negocio: Negocio) => {
    setSelectedNegocio(negocio);
    setShowModal(true);
  }, []);

  const handleMoverNegocio = useCallback(
    (negocioId: string, novaEtapa: string) => {
      // Implementar movimentação do negócio
      console.log(`Movendo negócio ${negocioId} para etapa ${novaEtapa}`);
    },
    [],
  );

  // ===== RENDER FUNCTIONS =====
  const renderEstatisticas = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
        marginBottom: "1.5rem",
      }}
    >
      <Card padding="lg" style={{ textAlign: "center" }}>
        <TrendingUp
          size={24}
          style={{ color: "var(--primary-500)", marginBottom: "0.5rem" }}
        />
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "var(--text-primary)",
          }}
        >
          {estatisticas.totalNegocios}
        </div>
        <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Negócios Ativos
        </div>
      </Card>

      <Card padding="lg" style={{ textAlign: "center" }}>
        <DollarSign
          size={24}
          style={{ color: "var(--color-success)", marginBottom: "0.5rem" }}
        />
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "var(--text-primary)",
          }}
        >
          R$ {(estatisticas.valorTotal / 1000).toFixed(0)}k
        </div>
        <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Valor Total
        </div>
      </Card>

      <Card padding="lg" style={{ textAlign: "center" }}>
        <Target
          size={24}
          style={{ color: "var(--color-warning)", marginBottom: "0.5rem" }}
        />
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "var(--text-primary)",
          }}
        >
          R$ {(estatisticas.valorEstimado / 1000).toFixed(0)}k
        </div>
        <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Valor Estimado
        </div>
      </Card>

      <Card padding="lg" style={{ textAlign: "center" }}>
        <BarChart3
          size={24}
          style={{ color: "var(--color-info)", marginBottom: "0.5rem" }}
        />
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "var(--text-primary)",
          }}
        >
          {estatisticas.taxaConversao.toFixed(1)}%
        </div>
        <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Taxa de Conversão
        </div>
      </Card>
    </div>
  );

  const renderFiltros = () => (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        marginBottom: "1rem",
        flexWrap: "wrap",
      }}
    >
      <select
        value={pipelineAtivo}
        onChange={(e) => setPipelineAtivo(e.target.value)}
        style={{
          padding: "0.5rem",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-primary)",
          backgroundColor: "var(--surface-primary)",
          minWidth: "200px",
        }}
      >
        {pipelines.map((pipeline) => (
          <option key={pipeline.id} value={pipeline.id}>
            {pipeline.nome}
          </option>
        ))}
      </select>

      <select
        value={filtros.status}
        onChange={(e) =>
          setFiltros((prev) => ({ ...prev, status: e.target.value as any }))
        }
        style={{
          padding: "0.5rem",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-primary)",
          backgroundColor: "var(--surface-primary)",
        }}
      >
        <option value="todos">Todos os Status</option>
        <option value="ativo">Ativo</option>
        <option value="ganho">Ganho</option>
        <option value="perdido">Perdido</option>
        <option value="pausado">Pausado</option>
      </select>

      <select
        value={filtros.prioridade}
        onChange={(e) =>
          setFiltros((prev) => ({ ...prev, prioridade: e.target.value as any }))
        }
        style={{
          padding: "0.5rem",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-primary)",
          backgroundColor: "var(--surface-primary)",
        }}
      >
        <option value="todos">Todas as Prioridades</option>
        <option value="baixa">Baixa</option>
        <option value="media">Média</option>
        <option value="alta">Alta</option>
        <option value="critica">Crítica</option>
      </select>

      <Button variant="secondary" icon={Settings}>
        Configurar Pipeline
      </Button>
    </div>
  );

  const renderNegocioCard = (negocio: Negocio) => {
    const getPrioridadeColor = (prioridade: string) => {
      const colors = {
        baixa: "var(--color-success)",
        media: "var(--color-warning)",
        alta: "var(--color-error)",
        critica: "var(--color-error)",
      };
      return (
        colors[prioridade as keyof typeof colors] || "var(--text-secondary)"
      );
    };

    const diasVencimento = Math.ceil(
      (negocio.dataEstimadaFechamento.getTime() - Date.now()) /
        (1000 * 60 * 60 * 24),
    );

    return (
      <Card
        key={negocio.id}
        padding="md"
        hover
        interactive
        onClick={() => handleEditarNegocio(negocio)}
        style={{
          cursor: "pointer",
          borderLeft: `4px solid ${getPrioridadeColor(negocio.prioridade)}`,
        }}
      >
        <div style={{ marginBottom: "0.75rem" }}>
          <h4
            style={{
              margin: "0 0 0.25rem",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "var(--text-primary)",
              lineHeight: "1.2",
            }}
          >
            {negocio.nome}
          </h4>
          <p
            style={{
              margin: "0 0 0.5rem",
              fontSize: "0.75rem",
              color: "var(--text-secondary)",
            }}
          >
            {negocio.contatoNome}
          </p>
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.25rem",
            }}
          >
            <span
              style={{
                fontSize: "1rem",
                fontWeight: "700",
                color: "var(--color-success)",
              }}
            >
              R$ {negocio.valor.toLocaleString()}
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
              }}
            >
              {negocio.probabilidadeConversao}%
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
                width: `${negocio.probabilidadeConversao}%`,
                height: "100%",
                backgroundColor: "var(--color-success)",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.75rem",
          }}
        >
          <Calendar size={12} style={{ color: "var(--text-secondary)" }} />
          <span
            style={{
              fontSize: "0.75rem",
              color:
                diasVencimento < 0
                  ? "var(--color-error)"
                  : "var(--text-secondary)",
            }}
          >
            {diasVencimento < 0 ? "Vencido" : `${diasVencimento} dias`}
          </span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
          {negocio.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              style={{
                fontSize: "0.625rem",
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "0.75rem",
            paddingTop: "0.75rem",
            borderTop: "1px solid var(--border-primary)",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
          >
            <User size={12} style={{ color: "var(--text-secondary)" }} />
            <span
              style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}
            >
              {negocio.responsavel.split(" ")[0]}
            </span>
          </div>

          {negocio.metricas.tempoNaEtapa > 14 && (
            <AlertTriangle
              size={14}
              style={{ color: "var(--color-warning)" }}
            />
          )}
        </div>
      </Card>
    );
  };

  const renderKanban = () => {
    if (!pipelineConfig) return null;

    return (
      <div
        style={{
          display: "flex",
          gap: "1rem",
          overflowX: "auto",
          paddingBottom: "1rem",
          minHeight: "600px",
        }}
      >
        {pipelineConfig.etapas.map((etapa) => {
          const negociosEtapa = negociosPorEtapa[etapa.id] || [];
          const valorTotal = negociosEtapa.reduce((sum, n) => sum + n.valor, 0);

          return (
            <div
              key={etapa.id}
              style={{
                minWidth: "300px",
                flex: "0 0 300px",
              }}
            >
              <Card padding="md" style={{ marginBottom: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "var(--text-primary)",
                    }}
                  >
                    {etapa.nome}
                  </h3>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: `${etapa.cor}20`,
                      color: etapa.cor,
                      fontSize: "0.75rem",
                      fontWeight: "600",
                    }}
                  >
                    {negociosEtapa.length}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <DollarSign
                    size={14}
                    style={{ color: "var(--text-secondary)" }}
                  />
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    R$ {(valorTotal / 1000).toFixed(0)}k
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    ({etapa.probabilidade}%)
                  </span>
                </div>

                <div
                  style={{
                    width: "100%",
                    height: "3px",
                    backgroundColor: "var(--surface-secondary)",
                    borderRadius: "1.5px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${etapa.probabilidade}%`,
                      height: "100%",
                      backgroundColor: etapa.cor,
                    }}
                  />
                </div>
              </Card>

              <div style={{ display: "grid", gap: "0.75rem" }}>
                {negociosEtapa.map(renderNegocioCard)}

                <Button
                  variant="ghost"
                  icon={Plus}
                  onClick={() => handleNovoNegocio()}
                  style={{
                    borderStyle: "dashed",
                    borderWidth: "2px",
                    borderColor: "var(--border-primary)",
                    minHeight: "60px",
                  }}
                >
                  Adicionar Negócio
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ===== MAIN RENDER =====
  return (
    <div>
      {/* Header */}
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
            Pipeline: {pipelineConfig?.nome}
          </h2>
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>
            {negociosFiltrados.length} negócios •{" "}
            {pipelineConfig?.etapas.length} etapas
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button variant="secondary" icon={BarChart3}>
            Relatórios
          </Button>
          <Button variant="primary" icon={Plus} onClick={handleNovoNegocio}>
            Novo Negócio
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      {renderEstatisticas()}

      {/* Filtros */}
      {renderFiltros()}

      {/* Kanban Pipeline */}
      {viewMode === "kanban" && renderKanban()}

      {negociosFiltrados.length === 0 && (
        <Card padding="xl" style={{ textAlign: "center" }}>
          <Briefcase
            size={48}
            style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}
          />
          <h3 style={{ margin: "0 0 0.5rem", color: "var(--text-primary)" }}>
            Nenhum negócio encontrado
          </h3>
          <p style={{ margin: "0 0 1rem", color: "var(--text-secondary)" }}>
            Adicione um novo negócio para começar a usar o pipeline.
          </p>
          <Button variant="primary" icon={Plus} onClick={handleNovoNegocio}>
            Criar Primeiro Negócio
          </Button>
        </Card>
      )}
    </div>
  );
};

export default React.memo(NegociosCard);
