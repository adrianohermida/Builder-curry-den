/**
 * Agenda Jurídica - Tipos e Interfaces
 *
 * Definições de tipos específicas do domínio Agenda Jurídica,
 * incluindo eventos, audiências, prazos e publicações.
 */

import type { BaseEntity } from "@/core/api/types";

// Entidades principais
export interface EventoJuridico extends BaseEntity {
  titulo: string;
  descricao?: string;
  tipo: TipoEvento;
  dataInicio: string;
  dataFim?: string;
  horarioInicio: string;
  horarioFim?: string;
  local?: string;
  endereco?: string;
  participantes?: ParticipanteEvento[];
  status: StatusEvento;
  prioridade: PrioridadeEvento;
  categoriaId?: string;
  categoria?: CategoriaEvento;
  clienteId?: string;
  processoId?: string;
  contratoId?: string;
  responsavel: string;
  observacoes?: string;
  anexos?: AnexoEvento[];
  lembretes?: LembreteEvento[];
  recorrencia?: RecorrenciaEvento;
  tags?: string[];
  cor?: string;
  privado: boolean;
}

export type TipoEvento =
  | "audiencia"
  | "reuniao"
  | "prazo"
  | "vencimento"
  | "compromisso"
  | "viagem"
  | "curso"
  | "outros";

export type StatusEvento =
  | "agendado"
  | "confirmado"
  | "em_andamento"
  | "concluido"
  | "cancelado"
  | "adiado";

export type PrioridadeEvento = "baixa" | "media" | "alta" | "urgente";

export interface Audiencia extends EventoJuridico {
  tipo: "audiencia";
  tipoAudiencia: TipoAudiencia;
  vara: string;
  juiz?: string;
  promotor?: string;
  numeroProcesso: string;
  situacao: SituacaoAudiencia;
  resultadoEsperado?: string;
  resultadoObtido?: string;
  ata?: string;
  proximaAudiencia?: string;
}

export type TipoAudiencia =
  | "inicial"
  | "instrucao"
  | "julgamento"
  | "conciliacao"
  | "mediacao"
  | "sustentacao"
  | "decisao";

export type SituacaoAudiencia =
  | "agendada"
  | "confirmada"
  | "realizada"
  | "adiada"
  | "cancelada"
  | "nao_compareceu";

export interface PrazoJuridico extends EventoJuridico {
  tipo: "prazo";
  tipoPrazo: TipoPrazo;
  prazoFatal: boolean;
  diasUteis: boolean;
  contadorDias: number;
  dataLimite: string;
  numeroProcesso?: string;
  tribunal: string;
  situacao: SituacaoPrazo;
  acaoNecessaria: string;
  documentoVinculado?: string;
  protocolado: boolean;
  numeroProtocolo?: string;
  dataProtocolo?: string;
}

export type TipoPrazo =
  | "contestacao"
  | "recurso"
  | "manifestacao"
  | "alegacoes"
  | "memoriais"
  | "embargos"
  | "impugnacao"
  | "outros";

export type SituacaoPrazo =
  | "pendente"
  | "em_preparacao"
  | "protocolado"
  | "vencido"
  | "perdido";

export interface Publicacao extends BaseEntity {
  titulo: string;
  conteudo: string;
  fonte: string;
  dataPublicacao: string;
  tipo: TipoPublicacao;
  numeroProcesso?: string;
  clienteId?: string;
  processoId?: string;
  tribunal: string;
  relevancia: RelevanciaPublicacao;
  lida: boolean;
  destacada: boolean;
  observacoes?: string;
  anexos?: AnexoPublicacao[];
  tags?: string[];
}

export type TipoPublicacao =
  | "citacao"
  | "intimacao"
  | "sentenca"
  | "decisao"
  | "despacho"
  | "edital"
  | "pauta"
  | "outros";

export type RelevanciaPublicacao = "baixa" | "media" | "alta" | "critica";

// Entidades auxiliares
export interface ParticipanteEvento {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  tipo: TipoParticipante;
  confirmado: boolean;
  observacoes?: string;
}

export type TipoParticipante =
  | "advogado"
  | "cliente"
  | "terceiro"
  | "juiz"
  | "promotor"
  | "perito"
  | "testemunha"
  | "outros";

export interface CategoriaEvento extends BaseEntity {
  nome: string;
  cor: string;
  icone?: string;
  descricao?: string;
  ativa: boolean;
}

export interface AnexoEvento extends BaseEntity {
  nome: string;
  tipo: string;
  tamanho: number;
  url: string;
  eventoId: string;
}

export interface AnexoPublicacao extends BaseEntity {
  nome: string;
  tipo: string;
  tamanho: number;
  url: string;
  publicacaoId: string;
}

export interface LembreteEvento {
  id: string;
  tipo: TipoLembrete;
  antecedencia: number;
  unidade: UnidadeTempo;
  ativo: boolean;
  enviado: boolean;
  dataEnvio?: string;
}

export type TipoLembrete = "email" | "sms" | "push" | "sistema";
export type UnidadeTempo = "minutos" | "horas" | "dias" | "semanas";

export interface RecorrenciaEvento {
  tipo: TipoRecorrencia;
  intervalo: number;
  diasSemana?: number[]; // 0-6 (domingo-sábado)
  diaMes?: number; // 1-31
  dataFim?: string;
  contadorOcorrencias?: number;
  exceções?: string[]; // Datas de exceção
}

export type TipoRecorrencia =
  | "diaria"
  | "semanal"
  | "mensal"
  | "anual"
  | "personalizada";

// Estados e filtros
export interface AgendaJuridicaFilters {
  dataInicio?: string;
  dataFim?: string;
  tipo?: TipoEvento[];
  status?: StatusEvento[];
  prioridade?: PrioridadeEvento[];
  responsavel?: string[];
  cliente?: string;
  processo?: string;
  categoria?: string;
  tags?: string[];
  privado?: boolean;
}

export interface PublicacoesFilters {
  dataInicio?: string;
  dataFim?: string;
  tipo?: TipoPublicacao[];
  relevancia?: RelevanciaPublicacao[];
  tribunal?: string[];
  lida?: boolean;
  destacada?: boolean;
  numeroProcesso?: string;
  tags?: string[];
}

export interface AgendaJuridicaMetrics {
  eventosHoje: number;
  eventosSemana: number;
  eventosMes: number;
  audienciasProximas: number;
  prazosVencendo: number;
  publicacoesNaoLidas: number;
  publicacoesCriticas: number;
  tarefasPendentes: number;
  eventosPorTipo: Record<TipoEvento, number>;
  audienciasPorStatus: Record<SituacaoAudiencia, number>;
  prazosPorSituacao: Record<SituacaoPrazo, number>;
  publicacoesPorRelevancia: Record<RelevanciaPublicacao, number>;
}

// Estado do domínio
export interface AgendaJuridicaState {
  eventos: EventoJuridico[];
  audiencias: Audiencia[];
  prazos: PrazoJuridico[];
  publicacoes: Publicacao[];
  categorias: CategoriaEvento[];
  selectedEvento: EventoJuridico | null;
  selectedData: string | null;
  viewMode: VisualizacaoAgenda;
  filters: AgendaJuridicaFilters;
  publicacoesFilters: PublicacoesFilters;
  isLoading: boolean;
  error: string | null;
  metrics: AgendaJuridicaMetrics;
}

export type VisualizacaoAgenda =
  | "mes"
  | "semana"
  | "dia"
  | "lista"
  | "timeline";

// Ações do domínio
export type AgendaJuridicaAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_EVENTOS"; payload: EventoJuridico[] }
  | { type: "SET_AUDIENCIAS"; payload: Audiencia[] }
  | { type: "SET_PRAZOS"; payload: PrazoJuridico[] }
  | { type: "SET_PUBLICACOES"; payload: Publicacao[] }
  | { type: "SET_CATEGORIAS"; payload: CategoriaEvento[] }
  | { type: "SELECT_EVENTO"; payload: EventoJuridico | null }
  | { type: "SELECT_DATA"; payload: string | null }
  | { type: "SET_VIEW_MODE"; payload: VisualizacaoAgenda }
  | { type: "UPDATE_FILTERS"; payload: Partial<AgendaJuridicaFilters> }
  | { type: "UPDATE_PUBLICACOES_FILTERS"; payload: Partial<PublicacoesFilters> }
  | { type: "UPDATE_METRICS"; payload: AgendaJuridicaMetrics }
  | { type: "ADD_EVENTO"; payload: EventoJuridico }
  | { type: "UPDATE_EVENTO"; payload: EventoJuridico }
  | { type: "REMOVE_EVENTO"; payload: string }
  | { type: "MARK_PUBLICACAO_LIDA"; payload: string };

// Interface pública do domínio
export interface AgendaJuridicaContextValue extends AgendaJuridicaState {
  loadEventos: () => Promise<void>;
  loadAudiencias: () => Promise<void>;
  loadPrazos: () => Promise<void>;
  loadPublicacoes: () => Promise<void>;
  loadCategorias: () => Promise<void>;
  createEvento: (evento: any) => Promise<void>;
  updateEvento: (id: string, updates: any) => Promise<void>;
  deleteEvento: (id: string) => Promise<void>;
  createAudiencia: (audiencia: any) => Promise<void>;
  createPrazo: (prazo: any) => Promise<void>;
  selectEvento: (evento: EventoJuridico | null) => void;
  selectData: (data: string | null) => void;
  setViewMode: (mode: VisualizacaoAgenda) => void;
  updateFilters: (filters: Partial<AgendaJuridicaFilters>) => void;
  updatePublicacoesFilters: (filters: Partial<PublicacoesFilters>) => void;
  markPublicacaoLida: (id: string) => Promise<void>;
  clearError: () => void;
  refreshMetrics: () => Promise<void>;
}

// Requests para API
export interface CreateEventoRequest {
  titulo: string;
  descricao?: string;
  tipo: TipoEvento;
  dataInicio: string;
  dataFim?: string;
  horarioInicio: string;
  horarioFim?: string;
  local?: string;
  endereco?: string;
  participantes?: Omit<ParticipanteEvento, "id">[];
  prioridade: PrioridadeEvento;
  categoriaId?: string;
  clienteId?: string;
  processoId?: string;
  contratoId?: string;
  responsavel: string;
  observacoes?: string;
  lembretes?: Omit<LembreteEvento, "id" | "enviado" | "dataEnvio">[];
  recorrencia?: RecorrenciaEvento;
  tags?: string[];
  cor?: string;
  privado: boolean;
}

export interface CreateAudienciaRequest extends CreateEventoRequest {
  tipo: "audiencia";
  tipoAudiencia: TipoAudiencia;
  vara: string;
  juiz?: string;
  promotor?: string;
  numeroProcesso: string;
  resultadoEsperado?: string;
}

export interface CreatePrazoRequest extends CreateEventoRequest {
  tipo: "prazo";
  tipoPrazo: TipoPrazo;
  prazoFatal: boolean;
  diasUteis: boolean;
  contadorDias: number;
  dataLimite: string;
  numeroProcesso?: string;
  tribunal: string;
  acaoNecessaria: string;
  documentoVinculado?: string;
}

export interface CreateCategoriaRequest {
  nome: string;
  cor: string;
  icone?: string;
  descricao?: string;
}

// Export all types
export type {
  EventoJuridico,
  Audiencia,
  PrazoJuridico,
  Publicacao,
  ParticipanteEvento,
  CategoriaEvento,
  AnexoEvento,
  AnexoPublicacao,
  LembreteEvento,
  RecorrenciaEvento,
  AgendaJuridicaFilters,
  PublicacoesFilters,
  AgendaJuridicaMetrics,
  AgendaJuridicaState,
  AgendaJuridicaAction,
  AgendaJuridicaContextValue,
  CreateEventoRequest,
  CreateAudienciaRequest,
  CreatePrazoRequest,
  CreateCategoriaRequest,
  TipoEvento,
  StatusEvento,
  PrioridadeEvento,
  TipoAudiencia,
  SituacaoAudiencia,
  TipoPrazo,
  SituacaoPrazo,
  TipoPublicacao,
  RelevanciaPublicacao,
  TipoParticipante,
  TipoLembrete,
  UnidadeTempo,
  TipoRecorrencia,
  VisualizacaoAgenda,
};
