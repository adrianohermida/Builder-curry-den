import { ModuleName } from "./actionPlan";

export interface IntelligentActionPlanItem {
  id: string;
  tarefa: string;
  módulo: ModuleName;
  prioridade: "baixa" | "média" | "alta" | "crítica";
  origem: "manual" | "análise automática" | "ai-generated";
  dependências?: string[];
  etapas: string[];
  criado_em: string;
  atualizado_em?: string;
  status:
    | "pendente"
    | "em execução"
    | "concluído"
    | "em revisão"
    | "pausado"
    | "cancelado";
  sugestão_IA?: string;
  métricas?: {
    tempo_estimado?: number; // em horas
    complexidade?: "baixa" | "média" | "alta";
    impacto?: "baixo" | "médio" | "alto";
    urgência?: "baixa" | "média" | "alta";
  };
  execução?: {
    iniciado_em?: string;
    concluído_em?: string;
    tempo_real?: number; // em horas
    executor?: "dev" | "ai" | "user";
    logs?: ExecutionLog[];
  };
  testes?: {
    executados: boolean;
    resultados?: TestResult[];
    lighthouse_score?: number;
    accessibility_score?: number;
  };
  versão?: string;
  aprovado_por?: string;
  aprovado_em?: string;
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  nivel: "info" | "warning" | "error" | "success";
  mensagem: string;
  componente?: string;
  executor: "dev" | "ai" | "system";
  detalhes?: Record<string, any>;
}

export interface TestResult {
  id: string;
  nome: string;
  tipo: "unit" | "integration" | "e2e" | "performance" | "accessibility";
  status: "passed" | "failed" | "skipped";
  tempo_execução: number;
  detalhes?: string;
  timestamp: string;
}

export interface SystemAnalysis {
  timestamp: string;
  módulo: ModuleName;
  problemas_encontrados: DetectedIssue[];
  métricas: ModuleMetrics;
  sugestões: ActionSuggestion[];
}

export interface DetectedIssue {
  id: string;
  tipo:
    | "performance"
    | "responsividade"
    | "acessibilidade"
    | "integração"
    | "usabilidade"
    | "segurança";
  severidade: "baixa" | "média" | "alta" | "crítica";
  descrição: string;
  componente?: string;
  localização?: string;
  detalhes: Record<string, any>;
  sugestão_correção: string;
}

export interface ModuleMetrics {
  performance: {
    loading_time: number;
    bundle_size: number;
    lighthouse_score: number;
  };
  usabilidade: {
    navigation_score: number;
    accessibility_score: number;
    mobile_friendly: number;
  };
  integração: {
    api_response_time: number;
    error_rate: number;
    uptime: number;
  };
  código: {
    complexity_score: number;
    test_coverage: number;
    unused_components: string[];
  };
}

export interface ActionSuggestion {
  id: string;
  prioridade: "baixa" | "média" | "alta" | "crítica";
  tipo: "melhoria" | "correção" | "otimização" | "nova_funcionalidade";
  título: string;
  descrição: string;
  etapas_sugeridas: string[];
  impacto_estimado: "baixo" | "médio" | "alto";
  esforço_estimado: number; // em horas
  dependências?: string[];
  justificativa: string;
}

export interface IntelligentActionPlan {
  id: "lawdesk-2025";
  versão: string;
  criado_em: string;
  atualizado_em: string;
  status: "ativo" | "pausado" | "arquivado";
  descrição: string;
  configurações: {
    execução_automática: boolean;
    análise_contínua: boolean;
    notificações: boolean;
    aprovação_automática: boolean;
    backup_automático: boolean;
  };
  tarefas: IntelligentActionPlanItem[];
  histórico: ActionPlanHistory[];
  métricas_globais: GlobalMetrics;
}

export interface ActionPlanHistory {
  versão: string;
  timestamp: string;
  alterações: string[];
  executor: string;
  motivo: string;
}

export interface GlobalMetrics {
  total_tarefas: number;
  tarefas_concluídas: number;
  tarefas_em_execução: number;
  tarefas_pendentes: number;
  tempo_médio_execução: number;
  taxa_sucesso: number;
  problemas_detectados: number;
  melhorias_aplicadas: number;
  última_análise: string;
}

export interface ContinuousMonitorConfig {
  enabled: boolean;
  interval: number; // em minutos
  modules_to_monitor: ModuleName[];
  auto_generate_tasks: boolean;
  auto_execute_safe_tasks: boolean;
  notification_threshold: "baixa" | "média" | "alta";
  max_concurrent_executions: number;
}

export interface UserPermissions {
  can_approve_critical: boolean;
  can_execute_automated: boolean;
  can_modify_config: boolean;
  can_view_logs: boolean;
  can_access_hidden_modules: boolean;
  role: "admin" | "desenvolvedor" | "usuario" | "guest";
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  usuario: string;
  ação: string;
  recurso: string;
  resultado: "sucesso" | "falha" | "negado";
  detalhes: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export interface AutomationRule {
  id: string;
  nome: string;
  descrição: string;
  ativo: boolean;
  trigger: {
    tipo: "schedule" | "event" | "condition";
    configuração: Record<string, any>;
  };
  ações: AutomationAction[];
  filtros?: AutomationFilter[];
}

export interface AutomationAction {
  tipo:
    | "analyze_module"
    | "execute_task"
    | "generate_task"
    | "send_notification"
    | "run_test";
  configuração: Record<string, any>;
  condicional?: string;
}

export interface AutomationFilter {
  campo: string;
  operador: "=" | "!=" | ">" | "<" | ">=" | "<=" | "contains" | "not_contains";
  valor: any;
}

// Event types for real-time monitoring
export interface MonitoringEvent {
  id: string;
  timestamp: string;
  tipo:
    | "task_created"
    | "task_completed"
    | "issue_detected"
    | "metric_threshold"
    | "system_alert";
  módulo?: ModuleName;
  severidade: "info" | "warning" | "error" | "critical";
  dados: Record<string, any>;
}

export interface AnalysisReport {
  id: string;
  timestamp: string;
  tipo: "full_system" | "module_specific" | "performance" | "security";
  escopo: ModuleName[];
  resumo: {
    problemas_críticos: number;
    problemas_altos: number;
    problemas_médios: number;
    problemas_baixos: number;
    melhorias_sugeridas: number;
    score_geral: number;
  };
  detalhes: SystemAnalysis[];
  recomendações: ActionSuggestion[];
  próxima_análise: string;
}
