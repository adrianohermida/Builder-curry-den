/**
 * CRM Jurídico - Tipos e Interfaces
 *
 * Definições de tipos específicas do domínio CRM Jurídico,
 * incluindo entidades, estados e ações.
 */

import type { BaseEntity } from "@/core/api/types";

// Entidades principais
export interface ClienteJuridico extends BaseEntity {
  nome: string;
  email: string;
  telefone?: string;
  documento: string; // CPF/CNPJ
  tipoDocumento: "cpf" | "cnpj";
  tipoCliente: "pessoa_fisica" | "pessoa_juridica";
  status: ClienteStatus;
  endereco?: EnderecoJuridico;
  contatos?: ContatoJuridico[];
  processos?: ProcessoJuridico[];
  contratos?: ContratoJuridico[];
  observacoes?: string;
  tags?: string[];
  responsavel?: string;
  ultimoContatoEm?: string;
  valorCausa?: number;
  areaAtuacao: AreaAtuacao[];
}

export type ClienteStatus = "ativo" | "inativo" | "prospecto" | "arquivado";

export type AreaAtuacao =
  | "civil"
  | "criminal"
  | "trabalhista"
  | "tributario"
  | "familia"
  | "empresarial"
  | "administrativo"
  | "constitucional"
  | "ambiental"
  | "consumidor";

export interface ProcessoJuridico extends BaseEntity {
  numero: string;
  titulo: string;
  descricao?: string;
  status: ProcessoStatus;
  prioridade: ProcessoPrioridade;
  tipo: ProcessoTipo;
  clienteId: string;
  cliente?: ClienteJuridico;
  responsavel?: string;
  tribunal?: string;
  parteContraria?: string;
  valorCausa?: number;
  dataDistribuicao: string;
  prazoFatal?: string;
  situacao: SituacaoProcesso;
  fase: FaseProcessual;
  instancia: Instancia;
  documentos?: DocumentoProcessual[];
  andamentos?: AndamentoProcessual[];
  tarefas?: TarefaJuridica[];
  observacoes?: string;
  tags?: string[];
}

export type ProcessoStatus = "ativo" | "suspenso" | "encerrado" | "arquivado";
export type ProcessoPrioridade = "baixa" | "media" | "alta" | "urgente";
export type ProcessoTipo = AreaAtuacao;
export type SituacaoProcesso =
  | "em_andamento"
  | "concluso"
  | "sentenciado"
  | "transitado_julgado";
export type FaseProcessual =
  | "inicial"
  | "instrucao"
  | "julgamento"
  | "recurso"
  | "execucao";
export type Instancia = "primeira" | "segunda" | "terceira" | "superior";

export interface ContratoJuridico extends BaseEntity {
  numero: string;
  titulo: string;
  tipo: TipoContrato;
  clienteId: string;
  cliente?: ClienteJuridico;
  valor: number;
  moeda: "BRL" | "USD" | "EUR";
  dataInicio: string;
  dataVencimento?: string;
  status: ContratoStatus;
  renovacaoAutomatica: boolean;
  observacoes?: string;
  clausulas?: ClausulaContratual[];
  anexos?: AnexoContratual[];
  responsavel?: string;
}

export type TipoContrato =
  | "prestacao_servicos"
  | "consultoria"
  | "retainer"
  | "success_fee"
  | "pro_bono"
  | "outros";

export type ContratoStatus =
  | "vigente"
  | "vencido"
  | "cancelado"
  | "suspenso"
  | "renegociacao";

export interface TarefaJuridica extends BaseEntity {
  titulo: string;
  descricao?: string;
  status: TarefaStatus;
  prioridade: TarefaPrioridade;
  tipo: TarefaTipo;
  responsavel?: string;
  clienteId?: string;
  processoId?: string;
  contratoId?: string;
  prazo?: string;
  concluida: boolean;
  dataConclusao?: string;
  horasEstimadas?: number;
  horasReais?: number;
  tags?: string[];
  anexos?: AnexoTarefa[];
}

export type TarefaStatus =
  | "pendente"
  | "em_andamento"
  | "concluida"
  | "cancelada";
export type TarefaPrioridade = ProcessoPrioridade;
export type TarefaTipo =
  | "ligacao"
  | "reuniao"
  | "documento"
  | "pesquisa"
  | "peticao"
  | "audiencia"
  | "prazo"
  | "outros";

// Entidades auxiliares
export interface EnderecoJuridico {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  pais: string;
}

export interface ContatoJuridico extends BaseEntity {
  nome: string;
  email?: string;
  telefone?: string;
  cargo?: string;
  tipo: TipoContato;
  clienteId: string;
  principal?: boolean;
  observacoes?: string;
}

export type TipoContato =
  | "cliente"
  | "advogado"
  | "secretaria"
  | "representante"
  | "outros";

export interface DocumentoProcessual extends BaseEntity {
  nome: string;
  tipo: string;
  tamanho: number;
  url: string;
  processoId: string;
  dataUpload: string;
  uploadPor: string;
  categoria: CategoriaDocumento;
}

export type CategoriaDocumento =
  | "peticao_inicial"
  | "contestacao"
  | "recurso"
  | "sentenca"
  | "acordo"
  | "documento_pessoal"
  | "prova"
  | "outros";

export interface AndamentoProcessual extends BaseEntity {
  descricao: string;
  data: string;
  tipo: TipoAndamento;
  processoId: string;
  responsavel?: string;
  observacoes?: string;
}

export type TipoAndamento =
  | "distribuicao"
  | "citacao"
  | "contestacao"
  | "audiencia"
  | "decisao"
  | "sentenca"
  | "recurso"
  | "outros";

export interface ClausulaContratual {
  id: string;
  titulo: string;
  conteudo: string;
  obrigatoria: boolean;
  observacoes?: string;
}

export interface AnexoContratual extends BaseEntity {
  nome: string;
  tipo: string;
  tamanho: number;
  url: string;
  contratoId: string;
}

export interface AnexoTarefa extends BaseEntity {
  nome: string;
  tipo: string;
  tamanho: number;
  url: string;
  tarefaId: string;
}

// Estados e filtros
export interface CRMJuridicoFilters {
  cliente?: string;
  status?: string;
  tipo?: string;
  responsavel?: string;
  areaAtuacao?: AreaAtuacao[];
  dateRange?: {
    inicio: string;
    fim: string;
  };
  tags?: string[];
}

export interface CRMJuridicoMetrics {
  totalClientes: number;
  processosAtivos: number;
  contratosVigentes: number;
  tarefasPendentes: number;
  valorCausaTotal: number;
  valorContratosAtivos: number;
  prazosFatais: number;
  audienciasProximas: number;
  clientesPorArea: Record<AreaAtuacao, number>;
  processosPorStatus: Record<ProcessoStatus, number>;
  tarefasPorPrioridade: Record<TarefaPrioridade, number>;
}

// Estado do domínio
export interface CRMJuridicoState {
  clientes: ClienteJuridico[];
  processos: ProcessoJuridico[];
  contratos: ContratoJuridico[];
  tarefas: TarefaJuridica[];
  selectedCliente: ClienteJuridico | null;
  selectedProcesso: ProcessoJuridico | null;
  filters: CRMJuridicoFilters;
  isLoading: boolean;
  error: string | null;
  metrics: CRMJuridicoMetrics;
}

// Ações do domínio
export type CRMJuridicoAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_CLIENTES"; payload: ClienteJuridico[] }
  | { type: "SET_PROCESSOS"; payload: ProcessoJuridico[] }
  | { type: "SET_CONTRATOS"; payload: ContratoJuridico[] }
  | { type: "SET_TAREFAS"; payload: TarefaJuridica[] }
  | { type: "SELECT_CLIENTE"; payload: ClienteJuridico | null }
  | { type: "SELECT_PROCESSO"; payload: ProcessoJuridico | null }
  | { type: "UPDATE_FILTERS"; payload: Partial<CRMJuridicoFilters> }
  | { type: "UPDATE_METRICS"; payload: CRMJuridicoMetrics }
  | { type: "ADD_CLIENTE"; payload: ClienteJuridico }
  | { type: "UPDATE_CLIENTE"; payload: ClienteJuridico }
  | { type: "REMOVE_CLIENTE"; payload: string }
  | { type: "ADD_PROCESSO"; payload: ProcessoJuridico }
  | { type: "UPDATE_PROCESSO"; payload: ProcessoJuridico }
  | { type: "REMOVE_PROCESSO"; payload: string };

// Interface pública do domínio
export interface CRMJuridicoContextValue extends CRMJuridicoState {
  loadClientes: () => Promise<void>;
  loadProcessos: () => Promise<void>;
  loadContratos: () => Promise<void>;
  loadTarefas: () => Promise<void>;
  createCliente: (cliente: any) => Promise<void>;
  updateCliente: (id: string, updates: any) => Promise<void>;
  deleteCliente: (id: string) => Promise<void>;
  createProcesso: (processo: any) => Promise<void>;
  updateProcesso: (id: string, updates: any) => Promise<void>;
  deleteProcesso: (id: string) => Promise<void>;
  selectCliente: (cliente: ClienteJuridico | null) => void;
  selectProcesso: (processo: ProcessoJuridico | null) => void;
  updateFilters: (filters: Partial<CRMJuridicoFilters>) => void;
  clearError: () => void;
  refreshMetrics: () => Promise<void>;
}

// Requests para API
export interface CreateClienteRequest {
  nome: string;
  email: string;
  telefone?: string;
  documento: string;
  tipoDocumento: "cpf" | "cnpj";
  tipoCliente: "pessoa_fisica" | "pessoa_juridica";
  endereco?: Partial<EnderecoJuridico>;
  observacoes?: string;
  tags?: string[];
  responsavel?: string;
  areaAtuacao: AreaAtuacao[];
}

export interface CreateProcessoRequest {
  numero: string;
  titulo: string;
  descricao?: string;
  tipo: ProcessoTipo;
  clienteId: string;
  tribunal?: string;
  parteContraria?: string;
  valorCausa?: number;
  dataDistribuicao: string;
  prazoFatal?: string;
  instancia: Instancia;
  observacoes?: string;
  tags?: string[];
}

export interface CreateContratoRequest {
  numero: string;
  titulo: string;
  tipo: TipoContrato;
  clienteId: string;
  valor: number;
  dataInicio: string;
  dataVencimento?: string;
  renovacaoAutomatica: boolean;
  observacoes?: string;
  responsavel?: string;
}

export interface CreateTarefaRequest {
  titulo: string;
  descricao?: string;
  tipo: TarefaTipo;
  prioridade: TarefaPrioridade;
  responsavel?: string;
  clienteId?: string;
  processoId?: string;
  contratoId?: string;
  prazo?: string;
  horasEstimadas?: number;
  tags?: string[];
}

// Export all types
export type {
  ClienteJuridico,
  ProcessoJuridico,
  ContratoJuridico,
  TarefaJuridica,
  EnderecoJuridico,
  ContatoJuridico,
  DocumentoProcessual,
  AndamentoProcessual,
  ClausulaContratual,
  AnexoContratual,
  AnexoTarefa,
  CRMJuridicoFilters,
  CRMJuridicoMetrics,
  CRMJuridicoState,
  CRMJuridicoAction,
  CRMJuridicoContextValue,
  CreateClienteRequest,
  CreateProcessoRequest,
  CreateContratoRequest,
  CreateTarefaRequest,
  ClienteStatus,
  ProcessoStatus,
  ContratoStatus,
  TarefaStatus,
  AreaAtuacao,
  ProcessoPrioridade,
  TarefaPrioridade,
  TipoContrato,
  TipoContato,
  CategoriaDocumento,
  TipoAndamento,
  SituacaoProcesso,
  FaseProcessual,
  Instancia,
  ProcessoTipo,
  TarefaTipo,
};
