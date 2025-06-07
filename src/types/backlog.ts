// Enhanced Backlog System Types
export type BacklogColumn =
  | "ideias"
  | "em_analise"
  | "em_execucao"
  | "concluido"
  | "arquivado";

export type BacklogCategory =
  | "UX"
  | "Backend"
  | "LegalTech"
  | "Performance"
  | "Visual"
  | "Integração"
  | "Segurança"
  | "AI"
  | "Mobile"
  | "Analytics"
  | "Compliance"
  | "Workflow";

export type BacklogPriority = "baixa" | "media" | "alta" | "critica";
export type BacklogStatus =
  | "rascunho"
  | "aprovado"
  | "rejeitado"
  | "concluido"
  | "em_execucao";
export type ImpactLevel = "baixo" | "medio" | "alto" | "critico";
export type ViabilityStatus =
  | "viavel"
  | "necessita_validacao"
  | "inviavel"
  | "pendente";

// Main Backlog Item Interface
export interface BacklogItem {
  id: string;
  titulo: string;
  descricao: string;
  categoria: BacklogCategory;
  modulo_impactado: string;
  prioridade: BacklogPriority;
  status: BacklogStatus;
  coluna: BacklogColumn;

  // User and creation info
  usuario_criador: string;
  data_criacao: string;
  data_atualizacao?: string;

  // Tags and organization
  tags: string[];

  // AI Analysis
  analise_ia?: AIBacklogAnalysis;
  viabilidade?: ViabilityAnalysis;

  // Advanced features
  checklist?: ChecklistItem[];
  anexos?: BacklogAttachment[];
  prazo_sugerido?: string;
  comentarios_ia?: string[];
  tarefas_relacionadas?: string[]; // IDs of related action plan tasks

  // Tracking
  tempo_estimado?: number; // em horas
  progresso_percentual?: number;
  historico_movimentacao?: MovementHistory[];

  // Business impact
  impacto?: ImpactAnalysis;
  roi_estimado?: string;

  // Voting and approval
  votos_aprovacao?: number;
  votos_rejeicao?: number;
  aprovadores?: string[];
}

// AI Analysis for Backlog Items
export interface AIBacklogAnalysis {
  id: string;
  data_analise: string;
  confidence_score: number; // 0-100

  classificacao: {
    acao_imediata: boolean;
    necessita_validacao: boolean;
    sugestao_futura: boolean;
    rejeitada: boolean;
    motivo_classificacao: string;
  };

  sinergia_detectada?: {
    tarefa_relacionada_id: string;
    tipo_relacao: "duplicata" | "complemento" | "dependencia" | "conflito";
    descricao_relacao: string;
    acao_recomendada: "fundir" | "conectar" | "separar" | "priorizar";
  }[];

  analise_tecnica: {
    complexidade_estimada: "simples" | "media" | "complexa";
    riscos_identificados: string[];
    dependencias_tecnicas: string[];
    recursos_necessarios: string[];
  };

  recomendacoes: string[];
  proxima_analise?: string;
}

// Viability Analysis
export interface ViabilityAnalysis {
  status: ViabilityStatus;
  score_viabilidade: number; // 0-100

  criterios: {
    viabilidade_tecnica: number;
    impacto_usuario: number;
    esforco_desenvolvimento: number;
    alinhamento_estrategico: number;
    custo_beneficio: number;
  };

  fatores_positivos: string[];
  fatores_negativos: string[];
  restricoes_identificadas: string[];

  parecer_final: string;
  data_analise: string;
  revisor?: string;
}

// Checklist Item
export interface ChecklistItem {
  id: string;
  texto: string;
  concluido: boolean;
  data_criacao: string;
  data_conclusao?: string;
  responsavel?: string;
}

// Attachment
export interface BacklogAttachment {
  id: string;
  nome: string;
  tipo: "imagem" | "documento" | "link" | "screenshot";
  url: string;
  tamanho?: number;
  data_upload: string;
  usuario_upload: string;
  descricao?: string;
}

// Movement History
export interface MovementHistory {
  id: string;
  de_coluna: BacklogColumn;
  para_coluna: BacklogColumn;
  data_movimento: string;
  usuario: string;
  motivo?: string;
  automatico: boolean; // se foi movido pela IA
}

// Impact Analysis
export interface ImpactAnalysis {
  usuario: ImpactLevel;
  legal: ImpactLevel;
  tecnico: ImpactLevel;
  financeiro: ImpactLevel;

  detalhes: {
    impacto_usuario: string;
    impacto_legal: string;
    impacto_tecnico: string;
    impacto_financeiro: string;
  };

  beneficios_esperados: string[];
  riscos_identificados: string[];

  score_total: number; // 0-100
  recomendacao: "implementar" | "postergar" | "cancelar" | "revisar";
}

// Backlog Column Configuration
export interface BacklogColumn {
  id: BacklogColumn;
  titulo: string;
  descricao: string;
  cor: string;
  ordem: number;
  limite_items?: number;
  auto_movimento?: boolean; // se permite movimento automático pela IA
  regras_entrada?: string[];
}

// Backlog State Management
export interface BacklogState {
  items: BacklogItem[];
  colunas: BacklogColumn[];
  filtros: BacklogFilter;
  configuracoes: BacklogConfiguration;
  estatisticas: BacklogStatistics;
  historico_processamento: ProcessingHistory[];
}

// Filters for Backlog
export interface BacklogFilter {
  categoria?: BacklogCategory[];
  prioridade?: BacklogPriority[];
  status?: BacklogStatus[];
  modulo?: string[];
  usuario_criador?: string[];
  data_inicio?: string;
  data_fim?: string;
  apenas_com_ia?: boolean;
  apenas_aprovados?: boolean;
  texto_busca?: string;
  tags?: string[];
}

// Backlog Configuration
export interface BacklogConfiguration {
  auto_analysis_enabled: boolean;
  analysis_frequency_hours: number;
  auto_move_approved: boolean;
  require_approval_for_execution: boolean;
  max_items_per_column: number;
  notification_settings: NotificationSettings;
  integration_settings: IntegrationSettings;
}

// Notification Settings
export interface NotificationSettings {
  notify_new_items: boolean;
  notify_ia_analysis: boolean;
  notify_status_changes: boolean;
  notify_approvals: boolean;
  channels: ("email" | "in_app" | "slack" | "teams")[];
  recipients: string[];
}

// Integration Settings
export interface IntegrationSettings {
  sync_with_action_plan: boolean;
  auto_create_tasks: boolean;
  connect_related_items: boolean;
  import_external_backlog: boolean;
  export_formats: ("json" | "csv" | "trello" | "github")[];
}

// Processing History
export interface ProcessingHistory {
  id: string;
  data_processamento: string;
  items_processados: number;
  items_aprovados: number;
  items_rejeitados: number;
  items_movidos: number;
  tarefas_criadas: number;
  tempo_processamento: number;
  confianca_media: number;
  detalhes: ProcessingDetail[];
}

// Processing Detail
export interface ProcessingDetail {
  item_id: string;
  acao_tomada: string;
  resultado: "sucesso" | "erro" | "warning";
  motivo: string;
  confidence_score: number;
  dados_antes: Partial<BacklogItem>;
  dados_depois: Partial<BacklogItem>;
}

// Statistics
export interface BacklogStatistics {
  total_items: number;
  items_por_coluna: Record<BacklogColumn, number>;
  items_por_categoria: Record<BacklogCategory, number>;
  items_por_prioridade: Record<BacklogPriority, number>;
  taxa_aprovacao: number;
  taxa_execucao: number;
  tempo_medio_ciclo: number; // dias da criação até conclusão
  items_processados_mes: number;
  roi_total_estimado: number;
  score_viabilidade_media: number;
  ultima_atualizacao: string;
}

// Export Options
export interface BacklogExportOptions {
  formato: "json" | "csv" | "trello_json" | "github_issues";
  incluir_analises: boolean;
  incluir_anexos: boolean;
  incluir_historico: boolean;
  filtros?: BacklogFilter;
  periodo?: {
    inicio: string;
    fim: string;
  };
}

// Import Options
export interface BacklogImportOptions {
  fonte: "trello" | "github" | "csv" | "json";
  mapeamento_colunas?: Record<string, BacklogColumn>;
  mapeamento_categorias?: Record<string, BacklogCategory>;
  auto_categorizar: boolean;
  executar_analise_ia: boolean;
  criar_como_rascunho: boolean;
}

// Kanban Board Configuration
export interface KanbanBoardConfig {
  colunas_visiveis: BacklogColumn[];
  altura_cards: "compacto" | "normal" | "expandido";
  mostrar_avatares: boolean;
  mostrar_tags: boolean;
  mostrar_prioridade: boolean;
  mostrar_categoria: boolean;
  mostrar_analise_ia: boolean;
  auto_refresh: boolean;
  refresh_interval: number; // segundos
}

// Dashboard Widget Types for Backlog
export interface BacklogDashboardWidget {
  id: string;
  tipo: "chart" | "metric" | "list" | "progress" | "funnel";
  titulo: string;
  dados: any;
  configuracao: {
    periodo: "dia" | "semana" | "mes" | "ano";
    metrica: string;
    filtros?: BacklogFilter;
  };
  posicao: { x: number; y: number; w: number; h: number };
  visivel: boolean;
}

// Advanced Features
export interface BacklogAdvancedFeatures {
  roadmap_integration: boolean;
  sprint_planning: boolean;
  capacity_planning: boolean;
  dependency_tracking: boolean;
  effort_estimation: boolean;
  stakeholder_feedback: boolean;
  automated_testing: boolean;
  performance_tracking: boolean;
}

// AI Processing Queue
export interface AIProcessingQueue {
  items_pendentes: string[]; // BacklogItem IDs
  processando_agora?: string;
  ultima_execucao?: string;
  proxima_execucao?: string;
  status: "idle" | "processing" | "error";
  configuracao: {
    batch_size: number;
    timeout_per_item: number;
    retry_attempts: number;
  };
}

// Collaboration Features
export interface BacklogCollaboration {
  comentarios: BacklogComment[];
  mencoes: BacklogMention[];
  watchers: string[]; // user IDs watching this item
  assignees: string[]; // user IDs assigned to this item
  reviewers: string[]; // user IDs reviewing this item
}

// Comment System
export interface BacklogComment {
  id: string;
  item_id: string;
  usuario: string;
  conteudo: string;
  data_criacao: string;
  data_edicao?: string;
  tipo: "comentario" | "sistema" | "ia";
  respondendo_a?: string; // ID of parent comment
  anexos?: string[];
  mencoes?: string[]; // mentioned user IDs
}

// Mention System
export interface BacklogMention {
  id: string;
  de_usuario: string;
  para_usuario: string;
  item_id: string;
  comentario_id?: string;
  data_criacao: string;
  lida: boolean;
  tipo: "direto" | "tag" | "assignee";
}

// Utilities
export type BacklogItemsByColumn = Record<BacklogColumn, BacklogItem[]>;
export type CategoryDistribution = Record<BacklogCategory, number>;
export type PriorityDistribution = Record<BacklogPriority, number>;

// API Responses
export interface BacklogAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  metadata?: {
    total_count?: number;
    page?: number;
    per_page?: number;
    has_more?: boolean;
  };
}

// Bulk Operations
export interface BacklogBulkOperation {
  operation: "move" | "delete" | "update" | "analyze" | "export";
  item_ids: string[];
  parametros?: any;
  usuario_executou: string;
  data_execucao: string;
  resultado: BulkOperationResult;
}

export interface BulkOperationResult {
  sucessos: number;
  erros: number;
  detalhes: Array<{
    item_id: string;
    status: "success" | "error";
    mensagem?: string;
  }>;
}

// Template System
export interface BacklogTemplate {
  id: string;
  nome: string;
  descricao: string;
  categoria: BacklogCategory;
  template_titulo: string;
  template_descricao: string;
  tags_default: string[];
  checklist_default?: Omit<ChecklistItem, "id" | "data_criacao">[];
  prioridade_default: BacklogPriority;
  configuracao_ia?: {
    auto_analyze: boolean;
    skip_validation: boolean;
    auto_approve: boolean;
  };
  uso_count: number;
  criado_por: string;
  data_criacao: string;
  publico: boolean;
}
