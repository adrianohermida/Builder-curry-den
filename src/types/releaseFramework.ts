import { ModuleName } from "./actionPlan";

export type ReleaseType = "módulo" | "função" | "produto interno";
export type ReleaseStatus =
  | "rascunho"
  | "em validação"
  | "pronto para lançar"
  | "lançado"
  | "pausado"
  | "rejeitado";
export type RiskLevel = "baixo" | "moderado" | "alto" | "crítico";
export type ChecklistStatus =
  | "pendente"
  | "em progresso"
  | "concluído"
  | "bloqueado";

export interface ReleaseItem {
  id: string;
  nome_funcionalidade: string;
  tipo_lançamento: ReleaseType;
  módulo_associado: ModuleName;
  responsável: string;
  revisado_por?: string;
  data_prevista: string;
  data_lançamento?: string;
  status: ReleaseStatus;
  versão: string;
  descrição: string;
  observações?: string;
  tags: string[];

  // Checklist automática
  checklist: ReleaseChecklistItem[];

  // Análise de IA
  ai_analysis?: ReleaseAIAnalysis;

  // Métricas e validações
  readiness_score: number; // 0-100
  risk_level: RiskLevel;
  rollback_plan?: string;

  // Auditoria
  created_at: string;
  updated_at: string;
  logs: ReleaseLogEntry[];

  // Monetização
  monetization?: MonetizationConfig;
}

export interface ReleaseChecklistItem {
  id: string;
  category: ChecklistCategory;
  title: string;
  description: string;
  status: ChecklistStatus;
  required: boolean;
  auto_validatable: boolean;
  validation_result?: ValidationResult;
  responsible?: string;
  completed_at?: string;
  notes?: string;
  dependencies?: string[];
}

export type ChecklistCategory =
  | "design_responsivo"
  | "mapeamento_eventos"
  | "permissões_papéis"
  | "integração_ia"
  | "testes_carga"
  | "documentação"
  | "monetização"
  | "segurança_rollback"
  | "acessibilidade"
  | "compliance";

export interface ValidationResult {
  success: boolean;
  score?: number;
  details: string;
  validated_at: string;
  validator: "auto" | "manual" | "ai";
  evidence?: string[];
  issues?: ValidationIssue[];
}

export interface ValidationIssue {
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  location?: string;
  suggestion?: string;
}

export interface ReleaseAIAnalysis {
  readiness_assessment: {
    overall_score: number;
    confidence: number;
    recommendation: "proceed" | "caution" | "block";
    reasoning: string;
  };

  risk_analysis: {
    level: RiskLevel;
    factors: RiskFactor[];
    mitigation_suggestions: string[];
  };

  quality_metrics: {
    code_quality: number;
    test_coverage: number;
    performance_score: number;
    security_score: number;
    accessibility_score: number;
  };

  usage_prediction: {
    expected_adoption: number;
    performance_impact: string;
    resource_requirements: string;
  };

  rollback_recommendations: {
    complexity: "simple" | "moderate" | "complex";
    estimated_time: number; // minutes
    steps: string[];
    dependencies: string[];
  };

  analyzed_at: string;
  analyzer_version: string;
}

export interface RiskFactor {
  type: "technical" | "business" | "operational" | "security";
  description: string;
  impact: "low" | "medium" | "high";
  probability: "low" | "medium" | "high";
  mitigation?: string;
}

export interface MonetizationConfig {
  enabled: boolean;
  pricing_model: "free" | "freemium" | "premium" | "enterprise";
  stripe_product_id?: string;
  pricing_tiers?: PricingTier[];
  revenue_projection?: number;
  target_market: string[];
  competitive_analysis?: string;
}

export interface PricingTier {
  name: string;
  price: number;
  features: string[];
  limits?: Record<string, number>;
  stripe_price_id?: string;
}

export interface ReleaseLogEntry {
  id: string;
  timestamp: string;
  event_type: ReleaseLogEventType;
  user: string;
  description: string;
  metadata?: Record<string, any>;
  ip_address?: string;
}

export type ReleaseLogEventType =
  | "created"
  | "updated"
  | "status_changed"
  | "checklist_updated"
  | "ai_analysis_run"
  | "validation_performed"
  | "approved"
  | "rejected"
  | "launched"
  | "rolled_back"
  | "archived";

export interface ReleaseMetrics {
  total_releases: number;
  by_status: Record<ReleaseStatus, number>;
  by_type: Record<ReleaseType, number>;
  average_time_to_release: number; // days
  success_rate: number; // percentage
  current_active_releases: number;
  high_risk_releases: number;
  revenue_impact: number;
}

export interface ReleaseTemplate {
  id: string;
  name: string;
  description: string;
  tipo_lançamento: ReleaseType;
  default_checklist: Omit<
    ReleaseChecklistItem,
    "id" | "status" | "completed_at"
  >[];
  estimated_duration: number; // days
  required_roles: string[];
  tags: string[];
}

export interface ReleaseGovernanceRules {
  approval_required_for: ReleaseType[];
  auto_reject_if_score_below: number;
  mandatory_reviewers_by_type: Record<ReleaseType, string[]>;
  cooling_period_between_releases: number; // hours
  max_concurrent_releases: number;
  require_rollback_plan: boolean;
  require_monetization_analysis: boolean;
}

export interface ReleaseDashboardData {
  metrics: ReleaseMetrics;
  recent_releases: ReleaseItem[];
  pending_validations: ReleaseItem[];
  high_priority_items: ReleaseItem[];
  ai_recommendations: AIRecommendation[];
  compliance_status: ComplianceStatus;
}

export interface AIRecommendation {
  id: string;
  type: "optimization" | "risk_mitigation" | "process_improvement";
  priority: "low" | "medium" | "high";
  title: string;
  description: string;
  action_items: string[];
  estimated_impact: string;
  created_at: string;
}

export interface ComplianceStatus {
  lgpd_compliance: boolean;
  accessibility_compliance: boolean;
  security_compliance: boolean;
  documentation_complete: boolean;
  last_audit: string;
  issues_count: number;
}

// Default checklist templates
export const DEFAULT_CHECKLIST_TEMPLATES: Record<
  ReleaseType,
  Omit<ReleaseChecklistItem, "id" | "status" | "completed_at">[]
> = {
  módulo: [
    {
      category: "design_responsivo",
      title: "Responsividade testada em 3 breakpoints",
      description:
        "Testar em desktop (1920px), tablet (768px) e mobile (375px)",
      required: true,
      auto_validatable: true,
    },
    {
      category: "mapeamento_eventos",
      title: "Mapeamento completo de eventos e logs",
      description: "Todos os eventos de usuário e sistema devidamente logados",
      required: true,
      auto_validatable: true,
    },
    {
      category: "permissões_papéis",
      title: "Permissões e papéis validados",
      description: "Teste de acesso para admin, advogado e cliente",
      required: true,
      auto_validatable: false,
    },
    {
      category: "integração_ia",
      title: "Integração com IA (se aplicável)",
      description: "Verificar se IA está funcionando corretamente no módulo",
      required: false,
      auto_validatable: true,
    },
    {
      category: "testes_carga",
      title: "Testes de carga com >1.000 registros",
      description: "Performance testada com volume real de dados",
      required: true,
      auto_validatable: true,
    },
    {
      category: "documentação",
      title: "Documentação técnica e de usuário pronta",
      description:
        "Documentação completa para desenvolvedores e usuários finais",
      required: true,
      auto_validatable: false,
    },
    {
      category: "acessibilidade",
      title: "Conformidade WCAG AA",
      description: "Teste de acessibilidade completo",
      required: true,
      auto_validatable: true,
    },
    {
      category: "segurança_rollback",
      title: "Diagnóstico IA e plano de rollback",
      description: "Plano de reversão em caso de problemas",
      required: true,
      auto_validatable: false,
    },
  ],
  função: [
    {
      category: "design_responsivo",
      title: "Interface responsiva testada",
      description: "Verificar responsividade da nova função",
      required: true,
      auto_validatable: true,
    },
    {
      category: "integração_ia",
      title: "Integração com IA validada",
      description: "Verificar se a função se integra corretamente com IA",
      required: false,
      auto_validatable: true,
    },
    {
      category: "permissões_papéis",
      title: "Controle de acesso validado",
      description: "Verificar permissões da nova função",
      required: true,
      auto_validatable: false,
    },
    {
      category: "documentação",
      title: "Documentação da função",
      description: "Help e guias de uso da nova função",
      required: true,
      auto_validatable: false,
    },
    {
      category: "monetização",
      title: "Análise de monetização",
      description: "Avaliação de potencial de monetização",
      required: false,
      auto_validatable: false,
    },
  ],
  "produto interno": [
    {
      category: "integração_ia",
      title: "IA de leitura processual validada",
      description: "Testes completos da IA para leitura de processos",
      required: true,
      auto_validatable: true,
    },
    {
      category: "testes_carga",
      title: "Performance com documentos grandes",
      description: "Teste com documentos de até 100 páginas",
      required: true,
      auto_validatable: true,
    },
    {
      category: "monetização",
      title: "Integração Stripe configurada",
      description: "Cobrança por uso ou assinatura configurada",
      required: true,
      auto_validatable: true,
    },
    {
      category: "documentação",
      title: "API documentation completa",
      description: "Documentação técnica para integração",
      required: true,
      auto_validatable: false,
    },
    {
      category: "compliance",
      title: "Conformidade LGPD",
      description: "Validação de tratamento de dados pessoais",
      required: true,
      auto_validatable: false,
    },
  ],
};
