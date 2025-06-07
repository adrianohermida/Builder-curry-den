// Utility to generate action plans in various formats for integration with project management tools

import { ModuleAnalysis } from "@/components/System/PlanoDeAcaoIA";

interface ActionPlanExport {
  timestamp: string;
  version: string;
  platform: "github" | "clickup" | "jira" | "builder" | "generic";
  modules: ModuleAnalysisExport[];
  summary: ExecutiveSummary;
  integrations: IntegrationPlan[];
}

interface ModuleAnalysisExport {
  id: string;
  name: string;
  status: "excellent" | "good" | "medium" | "critical";
  completion: number;
  priority_score: number;
  immediate_actions: ActionItem[];
  development_features: FeatureRequest[];
  ai_capabilities: AIFeature[];
  security_requirements: SecurityRequirement[];
  performance_optimizations: PerformanceOptimization[];
  user_satisfaction_metrics: SatisfactionMetric[];
  estimated_effort_days: number;
  business_impact: "high" | "medium" | "low";
  technical_debt_score: number;
}

interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  estimated_hours: number;
  impact_description: string;
  assignee_type:
    | "frontend"
    | "backend"
    | "fullstack"
    | "devops"
    | "data"
    | "design";
  dependencies: string[];
  acceptance_criteria: string[];
  github_labels?: string[];
  clickup_tags?: string[];
}

interface FeatureRequest {
  id: string;
  name: string;
  description: string;
  benchmark_reference: string;
  complexity: "simple" | "medium" | "complex";
  business_value: string;
  user_story: string;
  technical_requirements: string[];
  estimated_story_points: number;
  roi_metrics: ROIMetric[];
}

interface AIFeature {
  id: string;
  name: string;
  type: "summary" | "prediction" | "analysis" | "automation" | "classification";
  description: string;
  business_benefit: string;
  technical_implementation: string;
  data_requirements: string[];
  model_complexity: "low" | "medium" | "high";
  estimated_accuracy: number;
}

interface SecurityRequirement {
  id: string;
  area: string;
  requirement: string;
  compliance_standard: "LGPD" | "OAB" | "ISO27001" | "SOC2" | "GENERAL";
  implementation_steps: string[];
  priority: "critical" | "high" | "medium" | "low";
  audit_trail_required: boolean;
}

interface PerformanceOptimization {
  id: string;
  optimization_type:
    | "database"
    | "frontend"
    | "backend"
    | "infrastructure"
    | "caching";
  description: string;
  expected_improvement: string;
  implementation_approach: string;
  measurement_metrics: string[];
  estimated_effort_hours: number;
}

interface SatisfactionMetric {
  id: string;
  metric_name: string;
  current_value?: number;
  target_value: number;
  measurement_method: string;
  tracking_frequency: "real-time" | "daily" | "weekly" | "monthly";
  improvement_actions: string[];
}

interface ExecutiveSummary {
  total_modules: number;
  average_completion: number;
  critical_actions_count: number;
  high_priority_actions_count: number;
  total_estimated_days: number;
  business_impact_distribution: {
    high: number;
    medium: number;
    low: number;
  };
  ai_features_count: number;
  security_requirements_count: number;
  technical_debt_modules: string[];
  recommended_sprint_duration: number;
  team_size_recommendation: number;
}

interface IntegrationPlan {
  module_from: string;
  module_to: string;
  integration_type: "api" | "database" | "event" | "ui" | "data_sharing";
  description: string;
  technical_approach: string;
  estimated_effort_hours: number;
  priority: "critical" | "high" | "medium" | "low";
  dependencies: string[];
}

interface ROIMetric {
  metric_name: string;
  baseline_value: number;
  target_value: number;
  measurement_unit: string;
  timeframe_months: number;
}

export class ActionPlanGenerator {
  private static instance: ActionPlanGenerator;

  public static getInstance(): ActionPlanGenerator {
    if (!ActionPlanGenerator.instance) {
      ActionPlanGenerator.instance = new ActionPlanGenerator();
    }
    return ActionPlanGenerator.instance;
  }

  // Generate GitHub Issues format
  public generateGitHubIssues(modules: any[]): any[] {
    const issues = [];

    modules.forEach((module) => {
      // Create epic for each module
      const epic = {
        title: `[EPIC] ${module.modulo} - Comprehensive Enhancement`,
        body: this.generateGitHubEpicBody(module),
        labels: ["epic", "enhancement", this.getModuleLabel(module.modulo)],
        assignees: [],
        milestone: `Q1 2024 - ${module.modulo}`,
      };
      issues.push(epic);

      // Create individual issues for immediate actions
      module.acoes_imediatas.forEach((action: any, index: number) => {
        const issue = {
          title: `${module.modulo}: ${action.titulo}`,
          body: this.generateGitHubIssueBody(action, module),
          labels: this.getGitHubLabels(action.prioridade, module.modulo),
          assignees: this.getAssigneeByType(action.estimativa),
          milestone: this.getMilestone(action.prioridade),
          priority: action.prioridade,
        };
        issues.push(issue);
      });

      // Create issues for development features
      module.desenvolvimento_recomendado.forEach((feature: any) => {
        const issue = {
          title: `[FEATURE] ${module.modulo}: ${feature.funcionalidade}`,
          body: this.generateFeatureIssueBody(feature, module),
          labels: [
            "feature",
            "enhancement",
            this.getModuleLabel(module.modulo),
          ],
          assignees: this.getAssigneeByComplexity(feature.complexidade),
          milestone: `Q2 2024 - ${module.modulo}`,
        };
        issues.push(issue);
      });
    });

    return issues;
  }

  // Generate ClickUp tasks format
  public generateClickUpTasks(modules: any[]): any[] {
    const tasks = [];

    modules.forEach((module) => {
      // Create list for each module
      const list = {
        name: `${module.modulo} - Enhancements`,
        content: this.generateClickUpListDescription(module),
        priority: this.getClickUpPriority(module.status),
        status: "to do",
        assignees: [],
        tags: [module.modulo.toLowerCase().replace(/\s+/g, "-"), "enhancement"],
        custom_fields: {
          completion_percentage: module.completude,
          business_impact: this.getBusinessImpact(module),
          technical_debt: this.getTechnicalDebtScore(module),
        },
      };
      tasks.push(list);

      // Create subtasks for actions
      module.acoes_imediatas.forEach((action: any) => {
        const task = {
          name: action.titulo,
          description: this.generateClickUpTaskDescription(action),
          priority: this.getClickUpPriority(action.prioridade),
          status: "to do",
          time_estimate: this.parseTimeEstimate(action.estimativa),
          tags: [
            action.prioridade,
            module.modulo.toLowerCase().replace(/\s+/g, "-"),
          ],
          assignees: this.getClickUpAssignee(action.estimativa),
          parent: list.name,
        };
        tasks.push(task);
      });
    });

    return tasks;
  }

  // Generate Builder.io format
  public generateBuilderIntegration(modules: any[]): any {
    return {
      project: "lawdesk-crm-enhancement",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      modules: modules.map((module) => ({
        id: module.modulo.toLowerCase().replace(/\s+/g, "-"),
        name: module.modulo,
        components: this.generateBuilderComponents(module),
        pages: this.generateBuilderPages(module),
        integrations: this.generateBuilderIntegrations(module),
        data_models: this.generateBuilderDataModels(module),
      })),
      global_settings: {
        theme: "lawdesk-professional",
        responsive_breakpoints: ["mobile", "tablet", "desktop"],
        performance_budget: {
          bundle_size_kb: 500,
          page_load_time_ms: 2000,
          lighthouse_score: 90,
        },
      },
    };
  }

  // Helper methods for GitHub
  private generateGitHubEpicBody(module: any): string {
    return `
## 📋 Module Overview
**Status**: ${module.status} | **Completion**: ${module.completude}%

## 🎯 Objectives
${module.desenvolvimento_recomendado.map((dev: any) => `- ${dev.funcionalidade}`).join("\n")}

## 🚨 Critical Issues
${module.diagnostico.pendencias.map((p: any) => `- ${p}`).join("\n")}

## 🤖 AI Capabilities
${module.inteligencia.map((ia: any) => `- **${ia.feature}** (${ia.tipo}): ${ia.beneficio}`).join("\n")}

## 📊 Success Metrics
${module.satisfacao.map((sat: any) => `- ${sat.metrica}: ${sat.objetivo}`).join("\n")}

## 🔗 Integrations Required
${module.integracoes.join(", ")}

---
*Generated by Lawdesk Action Plan AI*
    `.trim();
  }

  private generateGitHubIssueBody(action: any, module: any): string {
    return `
## 📝 Description
${action.titulo}

## 🎯 Expected Impact
${action.impacto}

## ⏱️ Estimated Time
${action.estimativa}

## 🔥 Priority
${action.prioridade.toUpperCase()}

## ✅ Acceptance Criteria
- [ ] Implementation completed
- [ ] Unit tests added
- [ ] Integration tests passing
- [ ] Performance impact measured
- [ ] Documentation updated

## 🔗 Related Module
${module.modulo}

## 📋 Definition of Done
- [ ] Code review completed
- [ ] QA testing passed
- [ ] Performance benchmarks met
- [ ] Security review completed
- [ ] Production deployment successful
    `.trim();
  }

  private generateFeatureIssueBody(feature: any, module: any): string {
    return `
## 📋 Feature Description
${feature.funcionalidade}

## 🎯 Business Value
${feature.roi_esperado}

## 📊 Benchmark Reference
${feature.benchmark}

## 🛠️ Complexity
${feature.complexidade}

## 🔗 Module
${module.modulo}

## 📝 User Story
As a legal professional, I want ${feature.funcionalidade.toLowerCase()} so that I can achieve ${feature.roi_esperado}

## ✅ Acceptance Criteria
- [ ] Feature implemented according to benchmark standards
- [ ] User interface is intuitive and responsive
- [ ] Performance meets or exceeds requirements
- [ ] Integration with existing modules working
- [ ] User testing completed with positive feedback

## 🧪 Testing Requirements
- [ ] Unit tests coverage > 80%
- [ ] Integration tests for all connected modules
- [ ] Performance tests with realistic data volumes
- [ ] Security tests for data protection
- [ ] User acceptance testing completed
    `.trim();
  }

  // Helper methods for ClickUp
  private generateClickUpTaskDescription(action: any): string {
    return `
**Impact**: ${action.impacto}
**Estimated Time**: ${action.estimativa}
**Priority**: ${action.prioridade}

**Implementation Notes**:
- Ensure backward compatibility
- Add comprehensive testing
- Update documentation
- Monitor performance impact
    `.trim();
  }

  // Helper methods for Builder.io
  private generateBuilderComponents(module: any): any[] {
    const components = [];

    // Generate component definitions based on module features
    module.desenvolvimento_recomendado.forEach((feature: any) => {
      components.push({
        name: `${module.modulo}${feature.funcionalidade.replace(/\s+/g, "")}`,
        type: "react-component",
        props: this.generateComponentProps(feature),
        responsive: true,
        performance_optimized: true,
      });
    });

    return components;
  }

  private generateBuilderPages(module: any): any[] {
    return [
      {
        name: `${module.modulo.replace(/\s+/g, "")}.tsx`,
        path: `/${module.modulo.toLowerCase().replace(/\s+/g, "-")}`,
        components: [`${module.modulo}Main`, `${module.modulo}Sidebar`],
        layout: "main-with-sidebar",
        seo: {
          title: `${module.modulo} - Lawdesk CRM`,
          description: `Advanced ${module.modulo.toLowerCase()} management for legal professionals`,
        },
      },
    ];
  }

  private generateBuilderIntegrations(module: any): any[] {
    return module.integracoes.map((integration: string) => ({
      target_module: integration,
      type: "bidirectional",
      data_sync: true,
      real_time: true,
    }));
  }

  private generateBuilderDataModels(module: any): any[] {
    // Generate data models based on module functionality
    return [
      {
        name: `${module.modulo.replace(/\s+/g, "")}Data`,
        fields: this.generateDataFields(module),
        relationships: module.integracoes.map((int: string) => ({
          type: "belongs_to",
          model: int.replace(/\s+/g, ""),
        })),
        indexes: ["id", "created_at", "updated_at"],
        security: {
          encryption: true,
          access_control: true,
          audit_trail: true,
        },
      },
    ];
  }

  // Utility helper methods
  private getModuleLabel(moduleName: string): string {
    return moduleName.toLowerCase().replace(/\s+/g, "-");
  }

  private getGitHubLabels(priority: string, module: string): string[] {
    const labels = [this.getModuleLabel(module)];

    switch (priority) {
      case "critica":
        labels.push("priority-critical", "bug");
        break;
      case "alta":
        labels.push("priority-high", "enhancement");
        break;
      case "media":
        labels.push("priority-medium");
        break;
      case "baixa":
        labels.push("priority-low", "nice-to-have");
        break;
    }

    return labels;
  }

  private getAssigneeByType(estimativa: string): string[] {
    // Simple logic to assign based on time estimate
    if (estimativa.includes("dias")) {
      return ["@senior-developer"];
    } else if (estimativa.includes("horas")) {
      return ["@developer"];
    }
    return [];
  }

  private getMilestone(priority: string): string {
    switch (priority) {
      case "critica":
        return "Emergency Fix";
      case "alta":
        return "Sprint 1";
      case "media":
        return "Sprint 2";
      case "baixa":
        return "Backlog";
      default:
        return "Backlog";
    }
  }

  private getClickUpPriority(status: string): number {
    switch (status) {
      case "critica":
      case "critico":
        return 1; // Urgent
      case "alta":
      case "alto":
        return 2; // High
      case "media":
      case "medio":
        return 3; // Normal
      case "baixa":
      case "baixo":
        return 4; // Low
      default:
        return 3;
    }
  }

  private parseTimeEstimate(estimativa: string): number {
    // Convert time estimates to hours
    if (estimativa.includes("dia")) {
      const days = parseInt(estimativa.match(/\d+/)?.[0] || "1");
      return days * 8; // 8 hours per day
    } else if (estimativa.includes("hora")) {
      return parseInt(estimativa.match(/\d+/)?.[0] || "1");
    }
    return 1;
  }

  private getBusinessImpact(module: any): "high" | "medium" | "low" {
    if (module.completude < 70) return "high";
    if (module.completude < 85) return "medium";
    return "low";
  }

  private getTechnicalDebtScore(module: any): number {
    // Calculate technical debt based on bugs and performance issues
    const bugs = module.diagnostico.bugs.length;
    const performance = module.diagnostico.performance.length;
    const pendencias = module.diagnostico.pendencias.length;

    return Math.min(100, bugs * 10 + performance * 5 + pendencias * 3);
  }

  private generateComponentProps(feature: any): any {
    return {
      title: { type: "string", required: true },
      data: { type: "object", required: true },
      onAction: { type: "function", required: false },
      loading: { type: "boolean", default: false },
      responsive: { type: "boolean", default: true },
    };
  }

  private generateDataFields(module: any): any[] {
    return [
      { name: "id", type: "uuid", primary: true },
      { name: "title", type: "string", required: true },
      { name: "description", type: "text" },
      {
        name: "status",
        type: "enum",
        values: ["active", "inactive", "pending"],
      },
      { name: "created_at", type: "timestamp", default: "now()" },
      { name: "updated_at", type: "timestamp", default: "now()" },
      { name: "created_by", type: "uuid", foreign_key: "users.id" },
    ];
  }

  private getAssigneeByComplexity(complexity: string): string[] {
    switch (complexity) {
      case "complexa":
        return ["@tech-lead", "@senior-developer"];
      case "media":
        return ["@senior-developer"];
      case "simples":
        return ["@developer"];
      default:
        return ["@developer"];
    }
  }

  private getClickUpAssignee(estimativa: string): string[] {
    // Similar logic as GitHub but for ClickUp format
    return this.getAssigneeByType(estimativa);
  }

  private generateClickUpListDescription(module: any): string {
    return `
Comprehensive enhancement plan for ${module.modulo}
Current completion: ${module.completude}%
Status: ${module.status}

Key improvements:
${module.desenvolvimento_recomendado
  .slice(0, 3)
  .map((dev: any) => `• ${dev.funcionalidade}`)
  .join("\n")}
    `.trim();
  }
}

// Export utility functions
export const generateActionPlansForIntegration = (
  modules: any[],
  platform: "github" | "clickup" | "jira" | "builder" = "github",
) => {
  const generator = ActionPlanGenerator.getInstance();

  switch (platform) {
    case "github":
      return generator.generateGitHubIssues(modules);
    case "clickup":
      return generator.generateClickUpTasks(modules);
    case "builder":
      return generator.generateBuilderIntegration(modules);
    default:
      return generator.generateGitHubIssues(modules);
  }
};

export const exportActionPlan = (
  modules: any[],
  format: "json" | "markdown" | "csv" = "json",
): string => {
  const timestamp = new Date().toISOString();
  const summary = {
    total_modules: modules.length,
    average_completion: Math.round(
      modules.reduce((sum, m) => sum + m.completude, 0) / modules.length,
    ),
    critical_actions: modules.reduce(
      (sum, m) =>
        sum +
        m.acoes_imediatas.filter((a: any) => a.prioridade === "critica").length,
      0,
    ),
    high_priority_actions: modules.reduce(
      (sum, m) =>
        sum +
        m.acoes_imediatas.filter((a: any) => a.prioridade === "alta").length,
      0,
    ),
    ai_features_total: modules.reduce(
      (sum, m) => sum + m.inteligencia.length,
      0,
    ),
  };

  switch (format) {
    case "json":
      return JSON.stringify(
        {
          timestamp,
          summary,
          modules,
          integration_ready: true,
        },
        null,
        2,
      );

    case "markdown":
      return generateMarkdownReport(modules, summary, timestamp);

    case "csv":
      return generateCSVReport(modules);

    default:
      return JSON.stringify({ timestamp, summary, modules }, null, 2);
  }
};

const generateMarkdownReport = (
  modules: any[],
  summary: any,
  timestamp: string,
): string => {
  return `
# Lawdesk CRM - Plano de Ação Executivo

**Gerado em**: ${new Date(timestamp).toLocaleString("pt-BR")}

## 📊 Resumo Executivo

- **Módulos Analisados**: ${summary.total_modules}
- **Completude Média**: ${summary.average_completion}%
- **Ações Críticas**: ${summary.critical_actions}
- **Ações Alta Prioridade**: ${summary.high_priority_actions}
- **Features IA Planejadas**: ${summary.ai_features_total}

## 📋 Análise por Módulo

${modules
  .map(
    (module) => `
### ${module.modulo}
**Status**: ${module.status} | **Completude**: ${module.completude}%

#### Ações Imediatas
${module.acoes_imediatas.map((acao: any) => `- **[${acao.prioridade.toUpperCase()}]** ${acao.titulo} (${acao.estimativa})`).join("\n")}

#### Features IA
${module.inteligencia.map((ia: any) => `- **${ia.feature}** (${ia.tipo}): ${ia.beneficio}`).join("\n")}

---
`,
  )
  .join("\n")}

## 🎯 Próximos Passos

1. Priorizar ações críticas para execução imediata
2. Alinhar recursos de desenvolvimento com estimativas
3. Implementar sistema de monitoramento de progresso
4. Estabelecer métricas de sucesso por módulo

*Documento gerado automaticamente pelo sistema de IA do Lawdesk CRM*
  `.trim();
};

const generateCSVReport = (modules: any[]): string => {
  const headers = [
    "Módulo",
    "Status",
    "Completude %",
    "Ação",
    "Prioridade",
    "Estimativa",
    "Impacto",
    "Tipo",
  ];

  const rows = [];
  rows.push(headers.join(","));

  modules.forEach((module) => {
    module.acoes_imediatas.forEach((acao: any) => {
      rows.push(
        [
          `"${module.modulo}"`,
          module.status,
          module.completude,
          `"${acao.titulo}"`,
          acao.prioridade,
          `"${acao.estimativa}"`,
          `"${acao.impacto}"`,
          "Ação Imediata",
        ].join(","),
      );
    });

    module.inteligencia.forEach((ia: any) => {
      rows.push(
        [
          `"${module.modulo}"`,
          module.status,
          module.completude,
          `"${ia.feature}"`,
          "planejada",
          "TBD",
          `"${ia.beneficio}"`,
          "Feature IA",
        ].join(","),
      );
    });
  });

  return rows.join("\n");
};
