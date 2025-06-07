// Enhanced Action Plan Type Definitions
export type ActionPlanVersion = string;
export type UserType = "IA" | "dev" | "admin" | "user";
export type ModuleName =
  | "CRM Jurídico"
  | "IA Jurídica"
  | "GED"
  | "Tarefas"
  | "Publicações"
  | "Atendimento"
  | "Agenda"
  | "Financeiro"
  | "Configurações";

export type TaskStatus =
  | "pendente"
  | "em_execucao"
  | "concluida"
  | "erro"
  | "cancelada";
export type TaskPriority = "baixa" | "media" | "alta" | "critica";
export type LogLevel = "info" | "warning" | "error" | "success";
export type AIAnalysisType =
  | "performance"
  | "integracao"
  | "ux"
  | "comportamento";

// Core Task Interface
export interface ActionPlanTask {
  id: string;
  tarefa: string;
  modulo: ModuleName;
  prioridade: TaskPriority;
  status: TaskStatus;
  sugestao_IA?: string;
  data_criacao: string;
  data_atualizacao?: string;
  detalhamento: string;
  estimativa_horas?: number;
  progresso_percentual: number;
  responsavel?: string;
  dependencias?: string[];
  criterios_aceitacao?: string[];
  tags?: string[];
  anexos?: string[];
}

// Module Status Interface
export interface ModuleStatus {
  modulo: ModuleName;
  tarefas_pendentes: ActionPlanTask[];
  em_execucao: ActionPlanTask[];
  concluidas: ActionPlanTask[];
  erros_pendencias: TechnicalIssue[];
  melhorias_sugeridas: AISuggestion[];
  ultima_atualizacao: string;
  metricas: ModuleMetrics;
  integracoes_ativas: string[];
  saude_geral: "excelente" | "boa" | "regular" | "critica";
}

// Technical Issues Interface
export interface TechnicalIssue {
  id: string;
  titulo: string;
  descricao: string;
  tipo: "bug" | "performance" | "seguranca" | "integracao" | "responsividade";
  severidade: TaskPriority;
  modulo: ModuleName;
  stack_trace?: string;
  passos_reproducao?: string[];
  solucao_proposta?: string;
  data_identificacao: string;
  status: "aberto" | "em_analise" | "resolvido" | "ignorado";
  tempo_resolucao_estimado?: number;
}

// AI Suggestions Interface
export interface AISuggestion {
  id: string;
  titulo: string;
  descricao: string;
  tipo_analise: AIAnalysisType;
  modulo: ModuleName;
  impacto_estimado: "baixo" | "medio" | "alto" | "critico";
  complexidade: "simples" | "media" | "complexa";
  roi_estimado?: string;
  recursos_necessarios: string[];
  data_sugestao: string;
  confidence_score: number; // 0-100
  implementacao_recomendada: string[];
  metricas_sucesso: string[];
}

// Module Metrics Interface
export interface ModuleMetrics {
  total_tarefas: number;
  tarefas_concluidas: number;
  taxa_conclusao: number;
  tempo_medio_execucao: number;
  bugs_ativos: number;
  performance_score: number;
  satisfaction_score: number;
  last_deployment: string;
  uptime_percentage: number;
  error_rate: number;
}

// Version Control Interface
export interface ActionPlanVersion {
  versao: string;
  data_criacao: string;
  usuario: UserType;
  resumo_alteracoes: string;
  status: "ativa" | "archivada" | "rollback";
  modulos_afetados: ModuleName[];
  total_tarefas_adicionadas: number;
  total_tarefas_removidas: number;
  hash_conteudo: string;
}

// Execution Log Interface
export interface ExecutionLog {
  id: string;
  timestamp: string;
  acao_executada: string;
  resultado: "sucesso" | "erro" | "warning";
  origem: "manual" | "IA" | "automatizada";
  modulo_afetado: ModuleName;
  tempo_execucao: number; // in milliseconds
  stack_trace?: string;
  usuario?: string;
  detalhes: LogDetail[];
  metricas_antes?: Record<string, any>;
  metricas_depois?: Record<string, any>;
}

export interface LogDetail {
  tipo: "arquivo" | "banco" | "api" | "ui" | "integracao";
  recurso: string;
  acao: string;
  status: LogLevel;
  mensagem: string;
  tempo_execucao?: number;
}

// AI Analysis Results Interface
export interface AIAnalysisResult {
  id: string;
  tipo_analise: AIAnalysisType;
  timestamp: string;
  escopo: ModuleName | "global";
  resultados: AnalysisFindings;
  recomendacoes: ActionPlanTask[];
  confidence_level: number;
  proxima_analise_recomendada: string;
}

export interface AnalysisFindings {
  problemas_identificados: TechnicalIssue[];
  oportunidades_melhoria: AISuggestion[];
  metricas_performance: PerformanceMetrics;
  gaps_integracao: IntegrationGap[];
  problemas_ux: UXIssue[];
  comportamento_usuario: UserBehaviorInsight[];
}

export interface PerformanceMetrics {
  load_time_avg: number;
  bundle_size: number;
  memory_usage: number;
  cpu_usage: number;
  network_requests: number;
  error_rate: number;
  lighthouse_score: number;
}

export interface IntegrationGap {
  modulo_origem: ModuleName;
  modulo_destino: ModuleName;
  tipo_integracao: "dados" | "ui" | "funcional" | "workflow";
  problema: string;
  impacto: string;
  solucao_sugerida: string;
}

export interface UXIssue {
  componente: string;
  problema: string;
  impacto_usuario: string;
  dispositivos_afetados: ("desktop" | "tablet" | "mobile")[];
  solucao_recomendada: string;
  prioridade: TaskPriority;
}

export interface UserBehaviorInsight {
  padrao: string;
  frequencia: number;
  impacto_business: string;
  oportunidade_melhoria: string;
  acao_recomendada: string;
}

// Main Action Plan Interface
export interface ActionPlanState {
  versao_atual: ActionPlanVersion;
  historico_versoes: ActionPlanVersion[];
  modulos: ModuleStatus[];
  logs_execucao: ExecutionLog[];
  analises_ia: AIAnalysisResult[];
  configuracoes: ActionPlanConfiguration;
  estatisticas_globais: GlobalStatistics;
}

export interface ActionPlanConfiguration {
  auto_analysis_enabled: boolean;
  analysis_frequency_hours: number;
  notification_channels: string[];
  escalation_rules: EscalationRule[];
  integration_endpoints: IntegrationEndpoint[];
  backup_retention_days: number;
}

export interface EscalationRule {
  condition: string;
  threshold: number;
  action: string;
  recipients: string[];
  enabled: boolean;
}

export interface IntegrationEndpoint {
  nome: string;
  tipo: "webhook" | "api" | "email" | "slack";
  url?: string;
  config: Record<string, any>;
  enabled: boolean;
}

export interface GlobalStatistics {
  total_tarefas_sistema: number;
  taxa_conclusao_global: number;
  tempo_medio_resolucao: number;
  modulos_criticos: number;
  ia_sugestoes_implementadas: number;
  economia_tempo_estimada: number;
  roi_global_estimado: string;
  ultima_atualizacao: string;
}

// Filter and Search Interfaces
export interface ActionPlanFilter {
  modulos?: ModuleName[];
  status?: TaskStatus[];
  prioridade?: TaskPriority[];
  data_inicio?: string;
  data_fim?: string;
  responsavel?: string[];
  tags?: string[];
  apenas_ia_sugeridas?: boolean;
}

export interface SearchQuery {
  texto: string;
  escopo: "tarefas" | "logs" | "analises" | "todos";
  filtros?: ActionPlanFilter;
}

// Export and Import Interfaces
export interface ExportOptions {
  formato: "json" | "csv" | "pdf" | "xlsx";
  escopo: "completo" | "modulo" | "personalizado";
  incluir_logs?: boolean;
  incluir_historico?: boolean;
  periodo?: {
    inicio: string;
    fim: string;
  };
}

export interface ImportResult {
  sucesso: boolean;
  tarefas_importadas: number;
  erros: string[];
  warnings: string[];
  duplicatas_encontradas: number;
  versao_criada: string;
}

// Utility Types
export type TasksByModule = Record<ModuleName, ActionPlanTask[]>;
export type ModuleHealth = Record<
  ModuleName,
  "excelente" | "boa" | "regular" | "critica"
>;
export type PriorityDistribution = Record<TaskPriority, number>;

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  version: string;
}

export interface PaginatedResponse<T> extends APIResponse<T> {
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
}

// Notification Types
export interface ActionPlanNotification {
  id: string;
  tipo:
    | "task_completed"
    | "task_overdue"
    | "critical_issue"
    | "ai_suggestion"
    | "integration_failure";
  titulo: string;
  mensagem: string;
  modulo?: ModuleName;
  prioridade: TaskPriority;
  data_criacao: string;
  lida: boolean;
  acao_requerida?: string;
  link?: string;
}

// Dashboard Widget Types
export interface DashboardWidget {
  id: string;
  tipo: "chart" | "metric" | "list" | "progress" | "alert";
  titulo: string;
  posicao: { x: number; y: number; w: number; h: number };
  configuracao: Record<string, any>;
  dados_cache?: any;
  ultima_atualizacao?: string;
}

export interface DashboardLayout {
  nome: string;
  widgets: DashboardWidget[];
  usuario: string;
  compartilhado: boolean;
  data_criacao: string;
}
