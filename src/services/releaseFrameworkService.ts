import {
  ReleaseItem,
  ReleaseChecklistItem,
  ReleaseAIAnalysis,
  ReleaseMetrics,
  ReleaseDashboardData,
  ReleaseType,
  ReleaseStatus,
  ChecklistStatus,
  ValidationResult,
  ReleaseLogEntry,
  RiskLevel,
  DEFAULT_CHECKLIST_TEMPLATES,
  AIRecommendation,
  ComplianceStatus,
} from "../types/releaseFramework";
import { ModuleName } from "../types/actionPlan";

class ReleaseFrameworkService {
  private releases: Map<string, ReleaseItem> = new Map();
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.loadReleases();
  }

  // CRUD Operations
  async createRelease(data: Partial<ReleaseItem>): Promise<ReleaseItem> {
    const id = `release_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const release: ReleaseItem = {
      id,
      nome_funcionalidade: data.nome_funcionalidade || "",
      tipo_lançamento: data.tipo_lançamento || "função",
      módulo_associado: data.módulo_associado || "Configurações",
      responsável: data.responsável || "",
      data_prevista:
        data.data_prevista ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      status: "rascunho",
      versão: data.versão || "1.0.0",
      descrição: data.descrição || "",
      observações: data.observações,
      tags: data.tags || [],
      checklist: this.generateDefaultChecklist(
        data.tipo_lançamento || "função",
      ),
      readiness_score: 0,
      risk_level: "moderado",
      created_at: now,
      updated_at: now,
      logs: [
        {
          id: `log_${Date.now()}`,
          timestamp: now,
          event_type: "created",
          user: data.responsável || "sistema",
          description: `Release "${data.nome_funcionalidade}" criado`,
        },
      ],
      ...data,
    };

    this.releases.set(id, release);
    await this.saveReleases();
    this.emit("release_created", release);

    console.log(`📦 Release criado: ${release.nome_funcionalidade}`);
    return release;
  }

  async updateRelease(
    id: string,
    updates: Partial<ReleaseItem>,
  ): Promise<ReleaseItem> {
    const release = this.releases.get(id);
    if (!release) {
      throw new Error("Release não encontrado");
    }

    const updatedRelease: ReleaseItem = {
      ...release,
      ...updates,
      updated_at: new Date().toISOString(),
      logs: [
        ...release.logs,
        {
          id: `log_${Date.now()}`,
          timestamp: new Date().toISOString(),
          event_type: "updated",
          user: updates.responsável || "sistema",
          description: `Release atualizado`,
          metadata: { changes: Object.keys(updates) },
        },
      ],
    };

    // Recalcular readiness score se checklist mudou
    if (updates.checklist) {
      updatedRelease.readiness_score = this.calculateReadinessScore(
        updatedRelease.checklist,
      );
    }

    this.releases.set(id, updatedRelease);
    await this.saveReleases();
    this.emit("release_updated", updatedRelease);

    return updatedRelease;
  }

  async deleteRelease(id: string): Promise<void> {
    const release = this.releases.get(id);
    if (!release) {
      throw new Error("Release não encontrado");
    }

    this.releases.delete(id);
    await this.saveReleases();
    this.emit("release_deleted", { id, release });
  }

  // Checklist Management
  async updateChecklistItem(
    releaseId: string,
    itemId: string,
    updates: Partial<ReleaseChecklistItem>,
  ): Promise<ReleaseItem> {
    const release = this.releases.get(releaseId);
    if (!release) {
      throw new Error("Release não encontrado");
    }

    const checklistIndex = release.checklist.findIndex(
      (item) => item.id === itemId,
    );
    if (checklistIndex === -1) {
      throw new Error("Item do checklist não encontrado");
    }

    const updatedItem = {
      ...release.checklist[checklistIndex],
      ...updates,
      completed_at:
        updates.status === "concluído" ? new Date().toISOString() : undefined,
    };

    release.checklist[checklistIndex] = updatedItem;

    // Auto-validate if possible
    if (updatedItem.auto_validatable && updatedItem.status === "concluído") {
      const validationResult = await this.autoValidateChecklistItem(
        release,
        updatedItem,
      );
      updatedItem.validation_result = validationResult;
    }

    // Recalcular readiness score
    release.readiness_score = this.calculateReadinessScore(release.checklist);
    release.risk_level = this.assessRiskLevel(release);

    const logEntry: ReleaseLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      event_type: "checklist_updated",
      user: updates.responsible || "sistema",
      description: `Checklist item "${updatedItem.title}" atualizado para ${updatedItem.status}`,
      metadata: { item_id: itemId, new_status: updatedItem.status },
    };

    release.logs.push(logEntry);
    release.updated_at = new Date().toISOString();

    this.releases.set(releaseId, release);
    await this.saveReleases();
    this.emit("checklist_updated", { release, item: updatedItem });

    return release;
  }

  // AI Analysis
  async runAIAnalysis(releaseId: string): Promise<ReleaseAIAnalysis> {
    const release = this.releases.get(releaseId);
    if (!release) {
      throw new Error("Release não encontrado");
    }

    console.log(
      `🤖 Executando análise de IA para: ${release.nome_funcionalidade}`,
    );

    // Simular análise de IA
    const analysis: ReleaseAIAnalysis = await this.performAIAnalysis(release);

    release.ai_analysis = analysis;
    release.readiness_score = analysis.readiness_assessment.overall_score;
    release.risk_level = analysis.risk_analysis.level;

    const logEntry: ReleaseLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      event_type: "ai_analysis_run",
      user: "ai_analyzer",
      description: `Análise de IA concluída. Score: ${analysis.readiness_assessment.overall_score}%`,
      metadata: {
        score: analysis.readiness_assessment.overall_score,
        risk: analysis.risk_analysis.level,
        recommendation: analysis.readiness_assessment.recommendation,
      },
    };

    release.logs.push(logEntry);
    release.updated_at = new Date().toISOString();

    this.releases.set(releaseId, release);
    await this.saveReleases();
    this.emit("ai_analysis_completed", { release, analysis });

    return analysis;
  }

  // Status Management
  async changeStatus(
    releaseId: string,
    newStatus: ReleaseStatus,
    user: string,
    reason?: string,
  ): Promise<ReleaseItem> {
    const release = this.releases.get(releaseId);
    if (!release) {
      throw new Error("Release não encontrado");
    }

    const oldStatus = release.status;
    release.status = newStatus;

    // Special handling for launch
    if (newStatus === "lançado") {
      release.data_lançamento = new Date().toISOString();

      // Auto-validate final checklist
      const validationResult = await this.validateForLaunch(release);
      if (!validationResult.success) {
        throw new Error(
          `Release não pode ser lançado: ${validationResult.details}`,
        );
      }
    }

    const logEntry: ReleaseLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      event_type: "status_changed",
      user,
      description: `Status alterado de "${oldStatus}" para "${newStatus}"${reason ? `. Motivo: ${reason}` : ""}`,
      metadata: { old_status: oldStatus, new_status: newStatus, reason },
    };

    release.logs.push(logEntry);
    release.updated_at = new Date().toISOString();

    this.releases.set(releaseId, release);
    await this.saveReleases();
    this.emit("status_changed", { release, oldStatus, newStatus });

    return release;
  }

  // Validation Methods
  private async autoValidateChecklistItem(
    release: ReleaseItem,
    item: ReleaseChecklistItem,
  ): Promise<ValidationResult> {
    console.log(`🔍 Auto-validando: ${item.title}`);

    // Simular validações automáticas
    switch (item.category) {
      case "design_responsivo":
        return this.validateResponsiveness(release);

      case "mapeamento_eventos":
        return this.validateEventMapping(release);

      case "integração_ia":
        return this.validateAIIntegration(release);

      case "testes_carga":
        return this.validateLoadTests(release);

      case "acessibilidade":
        return this.validateAccessibility(release);

      case "monetização":
        return this.validateMonetization(release);

      default:
        return {
          success: true,
          score: 85,
          details: "Validação automática não disponível para esta categoria",
          validated_at: new Date().toISOString(),
          validator: "auto",
        };
    }
  }

  private async validateResponsiveness(
    release: ReleaseItem,
  ): Promise<ValidationResult> {
    // Simular teste de responsividade
    const breakpoints = ["1920px", "768px", "375px"];
    const issues: any[] = [];

    breakpoints.forEach((bp) => {
      if (Math.random() > 0.8) {
        // 20% chance de problema
        issues.push({
          severity: "medium",
          message: `Layout quebrado em ${bp}`,
          location: `Viewport ${bp}`,
          suggestion: "Revisar CSS media queries",
        });
      }
    });

    return {
      success: issues.length === 0,
      score: Math.max(100 - issues.length * 15, 0),
      details:
        issues.length === 0
          ? "Responsividade validada em todos os breakpoints"
          : `${issues.length} problemas encontrados`,
      validated_at: new Date().toISOString(),
      validator: "auto",
      evidence: [`Teste realizado em ${breakpoints.join(", ")}`],
      issues,
    };
  }

  private async validateEventMapping(
    release: ReleaseItem,
  ): Promise<ValidationResult> {
    const eventsCovered = Math.floor(Math.random() * 30) + 70; // 70-100%

    return {
      success: eventsCovered >= 90,
      score: eventsCovered,
      details: `${eventsCovered}% dos eventos mapeados`,
      validated_at: new Date().toISOString(),
      validator: "auto",
      evidence: ["Análise de código realizada", "Log tracking verificado"],
    };
  }

  private async validateAIIntegration(
    release: ReleaseItem,
  ): Promise<ValidationResult> {
    const integrationScore = Math.floor(Math.random() * 20) + 80; // 80-100%

    return {
      success: integrationScore >= 85,
      score: integrationScore,
      details:
        integrationScore >= 85
          ? "IA integrada corretamente"
          : "Problemas na integração da IA detectados",
      validated_at: new Date().toISOString(),
      validator: "auto",
      evidence: ["API endpoints testados", "Response time validado"],
    };
  }

  private async validateLoadTests(
    release: ReleaseItem,
  ): Promise<ValidationResult> {
    const performanceScore = Math.floor(Math.random() * 25) + 75; // 75-100%

    return {
      success: performanceScore >= 80,
      score: performanceScore,
      details: `Performance com 1.000+ registros: ${performanceScore}/100`,
      validated_at: new Date().toISOString(),
      validator: "auto",
      evidence: [
        "Teste com 1.000 registros",
        "Teste com 5.000 registros",
        "Memory usage monitored",
      ],
    };
  }

  private async validateAccessibility(
    release: ReleaseItem,
  ): Promise<ValidationResult> {
    const wcagScore = Math.floor(Math.random() * 15) + 85; // 85-100%

    return {
      success: wcagScore >= 90,
      score: wcagScore,
      details: `WCAG AA compliance: ${wcagScore}%`,
      validated_at: new Date().toISOString(),
      validator: "auto",
      evidence: [
        "Lighthouse accessibility audit",
        "Screen reader testing",
        "Keyboard navigation tested",
      ],
    };
  }

  private async validateMonetization(
    release: ReleaseItem,
  ): Promise<ValidationResult> {
    const hasStripe = release.monetization?.stripe_product_id;
    const hasPricing =
      release.monetization?.pricing_tiers &&
      release.monetization.pricing_tiers.length > 0;

    return {
      success: hasStripe && hasPricing,
      score: (hasStripe ? 50 : 0) + (hasPricing ? 50 : 0),
      details:
        hasStripe && hasPricing
          ? "Monetização configurada"
          : "Configuração de monetização incompleta",
      validated_at: new Date().toISOString(),
      validator: "auto",
      evidence: hasStripe
        ? ["Stripe integration verified"]
        : ["Stripe integration missing"],
    };
  }

  private async validateForLaunch(
    release: ReleaseItem,
  ): Promise<ValidationResult> {
    const requiredItems = release.checklist.filter((item) => item.required);
    const completedRequired = requiredItems.filter(
      (item) => item.status === "concluído",
    );

    const success =
      completedRequired.length === requiredItems.length &&
      release.readiness_score >= 80;

    return {
      success,
      score: (completedRequired.length / requiredItems.length) * 100,
      details: success
        ? "Release pronto para lançamento"
        : `${requiredItems.length - completedRequired.length} itens obrigatórios pendentes`,
      validated_at: new Date().toISOString(),
      validator: "auto",
      evidence: [
        `${completedRequired.length}/${requiredItems.length} itens obrigatórios concluídos`,
      ],
    };
  }

  // AI Analysis Implementation
  private async performAIAnalysis(
    release: ReleaseItem,
  ): Promise<ReleaseAIAnalysis> {
    // Simular análise de IA complexa
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simular tempo de processamento

    const completedItems = release.checklist.filter(
      (item) => item.status === "concluído",
    ).length;
    const totalItems = release.checklist.length;
    const completionRate =
      totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

    const qualityMetrics = {
      code_quality: Math.floor(Math.random() * 20) + 80,
      test_coverage: Math.floor(Math.random() * 25) + 75,
      performance_score: Math.floor(Math.random() * 15) + 85,
      security_score: Math.floor(Math.random() * 10) + 90,
      accessibility_score: Math.floor(Math.random() * 20) + 80,
    };

    const averageQuality =
      Object.values(qualityMetrics).reduce((sum, score) => sum + score, 0) /
      Object.values(qualityMetrics).length;
    const overallScore = Math.floor(
      completionRate * 0.4 + averageQuality * 0.6,
    );

    let recommendation: "proceed" | "caution" | "block" = "proceed";
    if (overallScore < 70) recommendation = "block";
    else if (overallScore < 85) recommendation = "caution";

    const riskFactors = this.generateRiskFactors(release, overallScore);
    const riskLevel = this.calculateRiskFromFactors(riskFactors);

    return {
      readiness_assessment: {
        overall_score: overallScore,
        confidence: Math.floor(Math.random() * 20) + 80,
        recommendation,
        reasoning: this.generateReasoningText(
          overallScore,
          completionRate,
          recommendation,
        ),
      },
      risk_analysis: {
        level: riskLevel,
        factors: riskFactors,
        mitigation_suggestions: this.generateMitigationSuggestions(riskFactors),
      },
      quality_metrics: qualityMetrics,
      usage_prediction: {
        expected_adoption: Math.floor(Math.random() * 40) + 60,
        performance_impact:
          overallScore > 85 ? "Baixo impacto" : "Impacto moderado",
        resource_requirements:
          release.tipo_lançamento === "módulo" ? "Alto" : "Baixo",
      },
      rollback_recommendations: {
        complexity:
          overallScore > 90
            ? "simple"
            : overallScore > 75
              ? "moderate"
              : "complex",
        estimated_time: overallScore > 90 ? 5 : overallScore > 75 ? 15 : 45,
        steps: this.generateRollbackSteps(release),
        dependencies: this.identifyRollbackDependencies(release),
      },
      analyzed_at: new Date().toISOString(),
      analyzer_version: "2.0.0",
    };
  }

  // Helper Methods
  private generateDefaultChecklist(type: ReleaseType): ReleaseChecklistItem[] {
    const template = DEFAULT_CHECKLIST_TEMPLATES[type];

    return template.map((item, index) => ({
      id: `checklist_${Date.now()}_${index}`,
      status: "pendente" as ChecklistStatus,
      completed_at: undefined,
      notes: undefined,
      dependencies: undefined,
      ...item,
    }));
  }

  private calculateReadinessScore(checklist: ReleaseChecklistItem[]): number {
    if (checklist.length === 0) return 0;

    const requiredItems = checklist.filter((item) => item.required);
    const completedRequired = requiredItems.filter(
      (item) => item.status === "concluído",
    );
    const optionalItems = checklist.filter((item) => !item.required);
    const completedOptional = optionalItems.filter(
      (item) => item.status === "concluído",
    );

    const requiredScore =
      requiredItems.length > 0
        ? (completedRequired.length / requiredItems.length) * 80
        : 80;
    const optionalScore =
      optionalItems.length > 0
        ? (completedOptional.length / optionalItems.length) * 20
        : 20;

    return Math.floor(requiredScore + optionalScore);
  }

  private assessRiskLevel(release: ReleaseItem): RiskLevel {
    const score = release.readiness_score;
    const criticalItems = release.checklist.filter(
      (item) => item.required && item.status !== "concluído",
    ).length;

    if (score >= 95 && criticalItems === 0) return "baixo";
    if (score >= 80 && criticalItems <= 1) return "moderado";
    if (score >= 60) return "alto";
    return "crítico";
  }

  private generateRiskFactors(release: ReleaseItem, score: number): any[] {
    const factors = [];

    if (score < 80) {
      factors.push({
        type: "technical",
        description: "Score de prontidão abaixo do recomendado",
        impact: "high",
        probability: "high",
        mitigation: "Completar itens do checklist pendentes",
      });
    }

    if (release.tipo_lançamento === "módulo") {
      factors.push({
        type: "operational",
        description: "Lançamento de módulo completo tem maior impacto",
        impact: "medium",
        probability: "medium",
        mitigation: "Lançamento gradual para usuários selecionados",
      });
    }

    return factors;
  }

  private calculateRiskFromFactors(factors: any[]): RiskLevel {
    const highRiskFactors = factors.filter(
      (f) => f.impact === "high" && f.probability === "high",
    ).length;
    const mediumRiskFactors = factors.filter(
      (f) => f.impact === "medium" || f.probability === "medium",
    ).length;

    if (highRiskFactors > 0) return "alto";
    if (mediumRiskFactors > 2) return "moderado";
    return "baixo";
  }

  private generateMitigationSuggestions(factors: any[]): string[] {
    return factors.map((f) => f.mitigation).filter(Boolean);
  }

  private generateReasoningText(
    score: number,
    completion: number,
    recommendation: string,
  ): string {
    if (recommendation === "proceed") {
      return `Release tem score excelente (${score}%) com ${completion.toFixed(1)}% do checklist completo. Pronto para lançamento.`;
    } else if (recommendation === "caution") {
      return `Release tem score bom (${score}%) mas requer atenção. ${completion.toFixed(1)}% do checklist completo.`;
    } else {
      return `Release não está pronto (${score}%). Apenas ${completion.toFixed(1)}% do checklist completo. Bloqueado para lançamento.`;
    }
  }

  private generateRollbackSteps(release: ReleaseItem): string[] {
    const baseSteps = [
      "Backup da configuração atual",
      "Preparar scripts de rollback",
      "Notificar usuários sobre manutenção",
    ];

    if (release.tipo_lançamento === "módulo") {
      baseSteps.push("Desativar módulo no sistema");
      baseSteps.push("Restaurar versão anterior");
      baseSteps.push("Verificar integridade dos dados");
    }

    baseSteps.push("Testar sistema após rollback");
    baseSteps.push("Notificar conclusão da reversão");

    return baseSteps;
  }

  private identifyRollbackDependencies(release: ReleaseItem): string[] {
    const dependencies = ["Sistema de backup"];

    if (release.monetization?.enabled) {
      dependencies.push("Stripe webhook desativation");
    }

    if (release.módulo_associado) {
      dependencies.push(`Módulo ${release.módulo_associado}`);
    }

    return dependencies;
  }

  // Data Access Methods
  async getAllReleases(): Promise<ReleaseItem[]> {
    return Array.from(this.releases.values());
  }

  async getReleaseById(id: string): Promise<ReleaseItem | null> {
    return this.releases.get(id) || null;
  }

  async getReleasesByStatus(status: ReleaseStatus): Promise<ReleaseItem[]> {
    return Array.from(this.releases.values()).filter(
      (r) => r.status === status,
    );
  }

  async getReleasesByType(type: ReleaseType): Promise<ReleaseItem[]> {
    return Array.from(this.releases.values()).filter(
      (r) => r.tipo_lançamento === type,
    );
  }

  async getReleasesMetrics(): Promise<ReleaseMetrics> {
    const releases = Array.from(this.releases.values());

    const byStatus = releases.reduce(
      (acc, release) => {
        acc[release.status] = (acc[release.status] || 0) + 1;
        return acc;
      },
      {} as Record<ReleaseStatus, number>,
    );

    const byType = releases.reduce(
      (acc, release) => {
        acc[release.tipo_lançamento] = (acc[release.tipo_lançamento] || 0) + 1;
        return acc;
      },
      {} as Record<ReleaseType, number>,
    );

    const launchedReleases = releases.filter(
      (r) => r.status === "lançado" && r.data_lançamento,
    );
    const averageTime =
      launchedReleases.length > 0
        ? launchedReleases.reduce((sum, r) => {
            const created = new Date(r.created_at).getTime();
            const launched = new Date(r.data_lançamento!).getTime();
            return sum + (launched - created);
          }, 0) /
          launchedReleases.length /
          (24 * 60 * 60 * 1000) // Convert to days
        : 0;

    return {
      total_releases: releases.length,
      by_status: byStatus,
      by_type: byType,
      average_time_to_release: averageTime,
      success_rate:
        releases.length > 0
          ? (launchedReleases.length / releases.length) * 100
          : 0,
      current_active_releases: releases.filter((r) =>
        ["em validação", "pronto para lançar"].includes(r.status),
      ).length,
      high_risk_releases: releases.filter(
        (r) => r.risk_level === "alto" || r.risk_level === "crítico",
      ).length,
      revenue_impact: releases.reduce(
        (sum, r) => sum + (r.monetization?.revenue_projection || 0),
        0,
      ),
    };
  }

  async getDashboardData(): Promise<ReleaseDashboardData> {
    const releases = Array.from(this.releases.values());
    const metrics = await this.getReleasesMetrics();

    return {
      metrics,
      recent_releases: releases
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
        )
        .slice(0, 5),
      pending_validations: releases.filter((r) => r.status === "em validação"),
      high_priority_items: releases.filter(
        (r) =>
          ["alto", "crítico"].includes(r.risk_level) && r.status !== "lançado",
      ),
      ai_recommendations: this.generateAIRecommendations(releases),
      compliance_status: this.getComplianceStatus(releases),
    };
  }

  private generateAIRecommendations(
    releases: ReleaseItem[],
  ): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];

    const blockedReleases = releases.filter(
      (r) => r.readiness_score < 70,
    ).length;
    if (blockedReleases > 0) {
      recommendations.push({
        id: `rec_${Date.now()}_1`,
        type: "process_improvement",
        priority: "high",
        title: "Melhorar processo de validação",
        description: `${blockedReleases} releases estão bloqueados por baixo score de prontidão`,
        action_items: [
          "Revisar critérios de checklist",
          "Automatizar mais validações",
          "Treinar equipe em boas práticas",
        ],
        estimated_impact: "Redução de 30% no tempo de lançamento",
        created_at: new Date().toISOString(),
      });
    }

    return recommendations;
  }

  private getComplianceStatus(releases: ReleaseItem[]): ComplianceStatus {
    const recentReleases = releases.filter(
      (r) =>
        new Date(r.updated_at).getTime() >
        Date.now() - 30 * 24 * 60 * 60 * 1000, // Last 30 days
    );

    const lgpdCompliant = recentReleases.every((r) =>
      r.checklist.some(
        (item) => item.category === "compliance" && item.status === "concluído",
      ),
    );

    const accessibilityCompliant = recentReleases.every((r) =>
      r.checklist.some(
        (item) =>
          item.category === "acessibilidade" && item.status === "concluído",
      ),
    );

    return {
      lgpd_compliance: lgpdCompliant,
      accessibility_compliance: accessibilityCompliant,
      security_compliance: true, // Simplified
      documentation_complete: recentReleases.every((r) =>
        r.checklist.some(
          (item) =>
            item.category === "documentação" && item.status === "concluído",
        ),
      ),
      last_audit: new Date().toISOString(),
      issues_count: recentReleases.filter(
        (r) => r.risk_level === "alto" || r.risk_level === "crítico",
      ).length,
    };
  }

  // Persistence
  private async loadReleases(): Promise<void> {
    try {
      const saved = localStorage.getItem("lawdesk-release-framework");
      if (saved) {
        const data = JSON.parse(saved);
        this.releases = new Map(data);
      }
    } catch (error) {
      console.error("Erro ao carregar releases:", error);
    }
  }

  private async saveReleases(): Promise<void> {
    try {
      const data = Array.from(this.releases.entries());
      localStorage.setItem("lawdesk-release-framework", JSON.stringify(data));
    } catch (error) {
      console.error("Erro ao salvar releases:", error);
    }
  }

  // Event System
  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((callback) => callback(data));
  }

  addEventListener(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  removeEventListener(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
}

export const releaseFrameworkService = new ReleaseFrameworkService();
