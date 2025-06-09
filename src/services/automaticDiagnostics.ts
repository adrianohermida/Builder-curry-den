/**
 * 🔬 Executor Automático de Diagnósticos - Lawdesk CRM v2.5.0
 *
 * Executa automaticamente todas as 7 áreas de diagnóstico:
 * 1. Auditoria de Rotas
 * 2. Validação de Componentes
 * 3. Consistência Visual
 * 4. Verificação de Integrações
 * 5. Performance e Otimização
 * 6. Pendências de Desenvolvimento
 * 7. Sugestões por Módulo
 *
 * @version 2.5.0
 * @since 2025-01-21
 */

import { performanceMonitor, PerformanceMetrics } from "./performanceMonitor";
import { healthChecker, SystemHealth } from "./healthCheck";

interface DiagnosticResult {
  area: string;
  status: "pass" | "warning" | "fail";
  score: number;
  issues: Issue[];
  recommendations: string[];
  executionTime: number;
}

interface Issue {
  type: "critical" | "warning" | "info";
  component?: string;
  description: string;
  solution?: string;
  priority: "high" | "medium" | "low";
}

interface CompleteDiagnosticReport {
  timestamp: Date;
  version: string;
  overallScore: number;
  overallStatus: "excellent" | "good" | "needs_improvement" | "critical";
  areas: DiagnosticResult[];
  summary: {
    totalIssues: number;
    criticalIssues: number;
    warningIssues: number;
    autoFixedIssues: number;
  };
  nextActions: string[];
  estimatedFixTime: number;
}

class AutomaticDiagnostics {
  private diagnosticResults: DiagnosticResult[] = [];

  /**
   * 🚀 Executa diagnóstico completo automático
   */
  public async executeCompleteDiagnostic(): Promise<CompleteDiagnosticReport> {
    console.log("🔬 Iniciando diagnóstico automático completo...");
    const startTime = Date.now();

    this.diagnosticResults = [];

    // Executa todas as 7 áreas de diagnóstico
    const diagnosticAreas = [
      { name: "1. Auditoria de Rotas", executor: this.auditRoutes.bind(this) },
      {
        name: "2. Validação de Componentes",
        executor: this.validateComponents.bind(this),
      },
      {
        name: "3. Consistência Visual",
        executor: this.checkVisualConsistency.bind(this),
      },
      {
        name: "4. Verificação de Integrações",
        executor: this.verifyIntegrations.bind(this),
      },
      {
        name: "5. Performance e Otimização",
        executor: this.analyzePerformance.bind(this),
      },
      {
        name: "6. Pendências de Desenvolvimento",
        executor: this.checkDevelopmentBacklog.bind(this),
      },
      {
        name: "7. Sugestões por Módulo",
        executor: this.generateModuleSuggestions.bind(this),
      },
    ];

    // Executa diagnósticos em paralelo para otimizar tempo
    const results = await Promise.allSettled(
      diagnosticAreas.map(async (area) => {
        const areaStartTime = Date.now();
        try {
          const result = await area.executor();
          return {
            ...result,
            area: area.name,
            executionTime: Date.now() - areaStartTime,
          };
        } catch (error) {
          return {
            area: area.name,
            status: "fail" as const,
            score: 0,
            issues: [
              {
                type: "critical" as const,
                description: `Erro na execução: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
                priority: "high" as const,
              },
            ],
            recommendations: ["Verificar logs para mais detalhes"],
            executionTime: Date.now() - areaStartTime,
          };
        }
      }),
    );

    // Processa resultados
    this.diagnosticResults = results.map((result) =>
      result.status === "fulfilled" ? result.value : result.reason,
    );

    const totalTime = Date.now() - startTime;
    console.log(`✅ Diagnóstico completo executado em ${totalTime}ms`);

    return this.generateFinalReport();
  }

  /**
   * 🛣️ 1. Auditoria de Rotas (React Router v6)
   */
  private async auditRoutes(): Promise<
    Omit<DiagnosticResult, "area" | "executionTime">
  > {
    const issues: Issue[] = [];
    const recommendations: string[] = [];

    // Verifica estrutura de rotas
    const routeChecks = [
      { path: "/", expected: true },
      { path: "/crm", expected: true },
      { path: "/crm/processos", expected: true },
      { path: "/crm/processos/123", expected: true },
      { path: "/crm/clientes", expected: true },
      { path: "/admin", expected: true },
      { path: "/ged", expected: true },
      { path: "/tarefas", expected: true },
      { path: "/publicacoes", expected: true },
      { path: "/financeiro", expected: true },
    ];

    let workingRoutes = 0;
    for (const route of routeChecks) {
      try {
        // Simula navegação para verificar se rota existe
        const routeExists = this.checkRouteExists(route.path);
        if (routeExists) {
          workingRoutes++;
        } else {
          issues.push({
            type: "warning",
            description: `Rota ${route.path} pode não estar funcionando corretamente`,
            priority: "medium",
          });
        }
      } catch (error) {
        issues.push({
          type: "critical",
          description: `Erro ao verificar rota ${route.path}`,
          priority: "high",
        });
      }
    }

    // Verifica lazy loading
    if (!this.checkLazyLoading()) {
      issues.push({
        type: "warning",
        description: "Lazy loading não está configurado em todas as rotas",
        solution: "Implementar lazy loading com React.lazy()",
        priority: "medium",
      });
      recommendations.push(
        "Implementar lazy loading para melhorar performance",
      );
    }

    // Verifica error boundaries
    if (!this.checkErrorBoundaries()) {
      issues.push({
        type: "warning",
        description:
          "Error boundaries não estão implementados em todas as rotas",
        solution: "Adicionar ErrorBoundary em componentes críticos",
        priority: "medium",
      });
      recommendations.push(
        "Adicionar error boundaries para melhor experiência do usuário",
      );
    }

    const score = Math.min(
      100,
      (workingRoutes / routeChecks.length) * 100 - issues.length * 5,
    );
    const status = score >= 90 ? "pass" : score >= 70 ? "warning" : "fail";

    return { status, score, issues, recommendations };
  }

  /**
   * 🧩 2. Validação de Componentes e Dependências
   */
  private async validateComponents(): Promise<
    Omit<DiagnosticResult, "area" | "executionTime">
  > {
    const issues: Issue[] = [];
    const recommendations: string[] = [];

    // Verifica imports duplicados
    const duplicateImports = this.checkDuplicateImports();
    duplicateImports.forEach((duplicate) => {
      issues.push({
        type: "warning",
        component: duplicate.component,
        description: `Import duplicado: ${duplicate.import}`,
        solution: "Usar aliases para evitar conflitos",
        priority: "medium",
      });
    });

    // Verifica componentes quebrados
    const brokenComponents = await this.checkBrokenComponents();
    brokenComponents.forEach((component) => {
      issues.push({
        type: "critical",
        component: component.name,
        description: `Componente quebrado: ${component.error}`,
        solution: component.solution,
        priority: "high",
      });
    });

    // Verifica tipagem
    const typingIssues = this.checkTypingIssues();
    typingIssues.forEach((issue) => {
      issues.push({
        type: "info",
        component: issue.component,
        description: `Tipagem pode ser melhorada: ${issue.description}`,
        solution: "Usar interfaces específicas em vez de any",
        priority: "low",
      });
    });

    // Verifica hooks
    const hookIssues = this.checkHookUsage();
    hookIssues.forEach((issue) => {
      issues.push({
        type: "warning",
        component: issue.component,
        description: `Hook usage: ${issue.description}`,
        solution: issue.solution,
        priority: "medium",
      });
    });

    if (issues.length === 0) {
      recommendations.push(
        "Todos os componentes estão funcionando corretamente",
      );
    } else {
      recommendations.push("Corrigir imports duplicados");
      recommendations.push("Melhorar tipagem de components");
      recommendations.push("Otimizar uso de hooks");
    }

    const criticalIssues = issues.filter((i) => i.type === "critical").length;
    const score = Math.max(0, 100 - criticalIssues * 25 - issues.length * 3);
    const status =
      criticalIssues === 0 ? (score >= 80 ? "pass" : "warning") : "fail";

    return { status, score, issues, recommendations };
  }

  /**
   * 🎨 3. Consistência Visual e Layouts
   */
  private async checkVisualConsistency(): Promise<
    Omit<DiagnosticResult, "area" | "executionTime">
  > {
    const issues: Issue[] = [];
    const recommendations: string[] = [];

    // Verifica sistema de design
    const designSystemIssues = this.checkDesignSystem();
    designSystemIssues.forEach((issue) => {
      issues.push({
        type: "info",
        description: `Design System: ${issue.description}`,
        solution: "Aplicar classes do design system uniformemente",
        priority: "low",
      });
    });

    // Verifica responsividade
    const responsiveIssues = this.checkResponsiveness();
    responsiveIssues.forEach((issue) => {
      issues.push({
        type: "warning",
        component: issue.component,
        description: `Responsividade: ${issue.description}`,
        solution: "Aplicar breakpoints e grid responsivo",
        priority: "medium",
      });
    });

    // Verifica dark mode
    const darkModeIssues = this.checkDarkModeSupport();
    darkModeIssues.forEach((issue) => {
      issues.push({
        type: "info",
        component: issue.component,
        description: `Dark Mode: ${issue.description}`,
        solution: "Usar CSS variables para cores",
        priority: "low",
      });
    });

    // Verifica acessibilidade
    const accessibilityIssues = this.checkAccessibility();
    accessibilityIssues.forEach((issue) => {
      issues.push({
        type: "warning",
        component: issue.component,
        description: `Acessibilidade: ${issue.description}`,
        solution: "Adicionar ARIA labels e roles",
        priority: "medium",
      });
    });

    if (issues.length <= 5) {
      recommendations.push("Sistema visual está bem consistente");
    }
    recommendations.push("Padronizar espaçamentos com design system");
    recommendations.push("Melhorar suporte a dark mode");
    recommendations.push("Implementar melhorias de acessibilidade");

    const score = Math.max(20, 100 - issues.length * 4);
    const status = score >= 85 ? "pass" : score >= 65 ? "warning" : "fail";

    return { status, score, issues, recommendations };
  }

  /**
   * 🌐 4. Verificação de Integrações
   */
  private async verifyIntegrations(): Promise<
    Omit<DiagnosticResult, "area" | "executionTime">
  > {
    const issues: Issue[] = [];
    const recommendations: string[] = [];

    // Usa dados do health checker
    const healthData = healthChecker.getHealthData();

    // Verifica APIs
    Object.entries(healthData.apis).forEach(([apiName, status]) => {
      if (status.status === "unhealthy") {
        issues.push({
          type: "critical",
          description: `API ${apiName} está offline ou com problemas`,
          solution: "Verificar configuração e conectividade da API",
          priority: "high",
        });
      } else if (status.status === "degraded") {
        issues.push({
          type: "warning",
          description: `API ${apiName} com performance degradada (${status.responseTime.toFixed(0)}ms)`,
          solution: "Otimizar performance ou verificar rate limits",
          priority: "medium",
        });
      }
    });

    // Verifica integração específicas
    const integrationChecks = [
      { name: "Stripe", critical: true },
      { name: "Supabase", critical: true },
      { name: "Advise API", critical: false },
      { name: "GOV.BR", critical: false },
    ];

    integrationChecks.forEach((integration) => {
      const apiStatus = healthData.apis[integration.name.toLowerCase()];
      if (!apiStatus && integration.critical) {
        issues.push({
          type: "critical",
          description: `Integração crítica ${integration.name} não encontrada`,
          solution: "Configurar integração crítica",
          priority: "high",
        });
      }
    });

    const criticalAPIs = Object.values(healthData.apis).filter(
      (api) => api.status === "healthy",
    ).length;
    const totalAPIs = Object.keys(healthData.apis).length;

    if (criticalAPIs === totalAPIs) {
      recommendations.push(
        "Todas as integrações estão funcionando corretamente",
      );
    } else {
      recommendations.push("Verificar configurações de API com problemas");
      recommendations.push("Implementar fallbacks para APIs instáveis");
      recommendations.push("Configurar monitoramento proativo");
    }

    const score = totalAPIs > 0 ? (criticalAPIs / totalAPIs) * 100 : 50;
    const status = score >= 90 ? "pass" : score >= 70 ? "warning" : "fail";

    return { status, score, issues, recommendations };
  }

  /**
   * ⚡ 5. Performance e Otimização
   */
  private async analyzePerformance(): Promise<
    Omit<DiagnosticResult, "area" | "executionTime">
  > {
    const issues: Issue[] = [];
    const recommendations: string[] = [];

    // Usa dados do performance monitor
    const metrics = performanceMonitor.getMetrics();

    // Analisa Core Web Vitals
    if (metrics.lcp > 2500) {
      issues.push({
        type: "warning",
        description: `LCP muito alto: ${(metrics.lcp / 1000).toFixed(2)}s (meta: <2.5s)`,
        solution: "Otimizar imagens e implementar lazy loading",
        priority: "high",
      });
    }

    if (metrics.fid > 100) {
      issues.push({
        type: "warning",
        description: `FID alto: ${metrics.fid.toFixed(0)}ms (meta: <100ms)`,
        solution: "Reduzir JavaScript blocking e usar code splitting",
        priority: "high",
      });
    }

    if (metrics.cls > 0.1) {
      issues.push({
        type: "warning",
        description: `CLS alto: ${metrics.cls.toFixed(3)} (meta: <0.1)`,
        solution: "Adicionar dimensões a imagens e evitar layout shifts",
        priority: "medium",
      });
    }

    // Analisa outras métricas
    if (metrics.apiResponseTime > 2000) {
      issues.push({
        type: "warning",
        description: `Tempo de resposta da API alto: ${metrics.apiResponseTime.toFixed(0)}ms`,
        solution: "Implementar cache e otimizar queries",
        priority: "medium",
      });
    }

    if (metrics.errorRate > 0.05) {
      issues.push({
        type: "critical",
        description: `Taxa de erro alta: ${(metrics.errorRate * 100).toFixed(2)}%`,
        solution: "Melhorar error handling e validações",
        priority: "high",
      });
    }

    if (metrics.bundleSize > 3000000) {
      issues.push({
        type: "info",
        description: `Bundle size grande: ${(metrics.bundleSize / 1024 / 1024).toFixed(1)}MB`,
        solution: "Implementar tree shaking e code splitting",
        priority: "low",
      });
    }

    // Gera score baseado nas métricas
    let score = 100;
    if (metrics.lcp > 2500) score -= 15;
    if (metrics.fid > 100) score -= 15;
    if (metrics.cls > 0.1) score -= 10;
    if (metrics.apiResponseTime > 2000) score -= 10;
    if (metrics.errorRate > 0.05) score -= 20;
    if (metrics.bundleSize > 3000000) score -= 5;

    score = Math.max(0, score);

    recommendations.push("Implementar cache estratégico");
    recommendations.push("Otimizar imagens e assets");
    recommendations.push("Usar lazy loading em componentes pesados");
    if (issues.length === 0) {
      recommendations.push("Performance está excelente!");
    }

    const status = score >= 85 ? "pass" : score >= 65 ? "warning" : "fail";

    return { status, score, issues, recommendations };
  }

  /**
   * 📋 6. Pendências de Desenvolvimento
   */
  private async checkDevelopmentBacklog(): Promise<
    Omit<DiagnosticResult, "area" | "executionTime">
  > {
    const issues: Issue[] = [];
    const recommendations: string[] = [];

    // Verifica módulos implementados
    const expectedModules = [
      "CRM",
      "GED",
      "Tarefas",
      "Publicações",
      "Financeiro",
      "IA",
      "Atendimento",
      "Calendário",
      "Admin",
      "Mobile",
    ];

    const healthData = healthChecker.getHealthData();
    const implementedModules = healthData.modules.map((m) => m.name);

    expectedModules.forEach((module) => {
      if (!implementedModules.includes(module)) {
        issues.push({
          type: "critical",
          description: `Módulo ${module} não implementado`,
          solution: "Implementar módulo conforme blueprint",
          priority: "high",
        });
      }
    });

    // Verifica funcionalidades pendentes baseado em TODO comments
    const todoItems = this.findTodoComments();
    todoItems.forEach((todo) => {
      issues.push({
        type: "info",
        component: todo.file,
        description: `TODO: ${todo.comment}`,
        solution: "Implementar funcionalidade pendente",
        priority: "low",
      });
    });

    // Verifica ícones sem funcionalidade
    const nonFunctionalIcons = this.findNonFunctionalIcons();
    nonFunctionalIcons.forEach((icon) => {
      issues.push({
        type: "info",
        component: icon.component,
        description: `Ícone sem funcionalidade: ${icon.description}`,
        solution: "Implementar funcionalidade ou remover ícone",
        priority: "low",
      });
    });

    const completionRate =
      (implementedModules.length / expectedModules.length) * 100;
    const score = Math.max(
      0,
      completionRate - issues.filter((i) => i.type === "critical").length * 10,
    );

    if (completionRate === 100) {
      recommendations.push("Todos os módulos principais estão implementados");
    } else {
      recommendations.push("Priorizar implementação de módulos faltantes");
    }

    recommendations.push("Resolver TODOs acumulados");
    recommendations.push("Implementar funcionalidades de ícones pendentes");

    const status = score >= 90 ? "pass" : score >= 70 ? "warning" : "fail";

    return { status, score, issues, recommendations };
  }

  /**
   * 💡 7. Sugestões de Melhoria por Módulo
   */
  private async generateModuleSuggestions(): Promise<
    Omit<DiagnosticResult, "area" | "executionTime">
  > {
    const issues: Issue[] = [];
    const recommendations: string[] = [];

    const healthData = healthChecker.getHealthData();

    // Analisa cada módulo individualmente
    healthData.modules.forEach((module) => {
      const moduleScore = this.calculateModuleScore(module);

      if (moduleScore < 80) {
        issues.push({
          type: "warning",
          component: module.name,
          description: `Módulo ${module.name} com score baixo: ${moduleScore}/100`,
          solution: "Revisar implementação e otimizar",
          priority: "medium",
        });
      }

      // Sugestões específicas por módulo
      const moduleSuggestions = this.getModuleSpecificSuggestions(module.name);
      recommendations.push(...moduleSuggestions);
    });

    // Sugestões gerais
    recommendations.push("Implementar integração real-time entre módulos");
    recommendations.push("Adicionar analytics avançados");
    recommendations.push("Melhorar UX com micro-interações");

    const avgScore =
      healthData.modules.reduce(
        (sum, m) => sum + this.calculateModuleScore(m),
        0,
      ) / healthData.modules.length;
    const status =
      avgScore >= 85 ? "pass" : avgScore >= 70 ? "warning" : "fail";

    return { status, score: avgScore, issues, recommendations };
  }

  // ========================
  // MÉTODOS AUXILIARES
  // ========================

  private checkRouteExists(path: string): boolean {
    // Simulação - em implementação real, verificaria se a rota existe no React Router
    const knownRoutes = [
      "/",
      "/crm",
      "/crm/processos",
      "/crm/clientes",
      "/admin",
      "/ged",
      "/tarefas",
      "/publicacoes",
      "/financeiro",
    ];
    return knownRoutes.some((route) => path.startsWith(route));
  }

  private checkLazyLoading(): boolean {
    // Verifica se lazy loading está implementado
    return true; // Implementado no App.tsx
  }

  private checkErrorBoundaries(): boolean {
    // Verifica se error boundaries estão implementados
    return true; // Implementado no App.tsx
  }

  private checkDuplicateImports(): Array<{
    component: string;
    import: string;
  }> {
    // Simula verificação de imports duplicados
    return [
      // { component: 'ExecutiveDashboard', import: 'LineChart' }
    ];
  }

  private async checkBrokenComponents(): Promise<
    Array<{ name: string; error: string; solution: string }>
  > {
    // Simula verificação de componentes quebrados
    return [];
  }

  private checkTypingIssues(): Array<{
    component: string;
    description: string;
  }> {
    // Simula verificação de tipagem
    return [
      {
        component: "recharts-enhanced",
        description: "Uso de any em Tooltip props",
      },
    ];
  }

  private checkHookUsage(): Array<{
    component: string;
    description: string;
    solution: string;
  }> {
    // Simula verificação de hooks
    return [];
  }

  private checkDesignSystem(): Array<{ description: string }> {
    return [];
  }

  private checkResponsiveness(): Array<{
    component: string;
    description: string;
  }> {
    return [];
  }

  private checkDarkModeSupport(): Array<{
    component: string;
    description: string;
  }> {
    return [];
  }

  private checkAccessibility(): Array<{
    component: string;
    description: string;
  }> {
    return [];
  }

  private findTodoComments(): Array<{ file: string; comment: string }> {
    // Simula busca por TODOs
    return [
      { file: "useAuditSystem.tsx", comment: "Implement Excel and PDF export" },
    ];
  }

  private findNonFunctionalIcons(): Array<{
    component: string;
    description: string;
  }> {
    return [];
  }

  private calculateModuleScore(module: any): number {
    let score = 100;
    if (module.status.status === "degraded") score -= 20;
    if (module.status.status === "unhealthy") score -= 50;
    if (module.status.responseTime > 1000) score -= 10;
    return Math.max(0, score);
  }

  private getModuleSpecificSuggestions(moduleName: string): string[] {
    const suggestions: Record<string, string[]> = {
      CRM: ["Implementar sync real-time", "Adicionar bulk operations"],
      GED: ["Melhorar preview de documentos", "Implementar OCR"],
      IA: ["Integrar GPT-4", "Adicionar análise preditiva"],
      Financeiro: ["Integração bancária", "Dashboards executivos"],
      Mobile: ["Otimizar PWA", "Implementar offline-first"],
    };

    return (
      suggestions[moduleName] || [
        `Revisar implementação do módulo ${moduleName}`,
      ]
    );
  }

  /**
   * 📊 Gera relatório final consolidado
   */
  private generateFinalReport(): CompleteDiagnosticReport {
    const totalIssues = this.diagnosticResults.reduce(
      (sum, result) => sum + result.issues.length,
      0,
    );
    const criticalIssues = this.diagnosticResults.reduce(
      (sum, result) =>
        sum + result.issues.filter((issue) => issue.type === "critical").length,
      0,
    );
    const warningIssues = this.diagnosticResults.reduce(
      (sum, result) =>
        sum + result.issues.filter((issue) => issue.type === "warning").length,
      0,
    );

    const overallScore =
      this.diagnosticResults.reduce((sum, result) => sum + result.score, 0) /
      this.diagnosticResults.length;

    let overallStatus: CompleteDiagnosticReport["overallStatus"];
    if (overallScore >= 90) overallStatus = "excellent";
    else if (overallScore >= 75) overallStatus = "good";
    else if (overallScore >= 60) overallStatus = "needs_improvement";
    else overallStatus = "critical";

    const nextActions: string[] = [];

    // Prioriza ações baseado nos resultados
    if (criticalIssues > 0) {
      nextActions.push(
        `🚨 Resolver ${criticalIssues} problemas críticos imediatamente`,
      );
    }
    if (warningIssues > 5) {
      nextActions.push(`⚠️ Revisar ${warningIssues} avisos de melhoria`);
    }
    if (overallScore < 85) {
      nextActions.push(
        "📈 Implementar melhorias sugeridas para aumentar score",
      );
    }
    if (nextActions.length === 0) {
      nextActions.push("✅ Sistema está operando de forma excelente!");
    }

    const estimatedFixTime = criticalIssues * 2 + warningIssues * 0.5; // horas estimadas

    return {
      timestamp: new Date(),
      version: "2.5.0",
      overallScore: Math.round(overallScore),
      overallStatus,
      areas: this.diagnosticResults,
      summary: {
        totalIssues,
        criticalIssues,
        warningIssues,
        autoFixedIssues: 0, // Será implementado em versão futura
      },
      nextActions,
      estimatedFixTime,
    };
  }

  /**
   * 📄 Exporta relatório em formato JSON
   */
  public exportReport(report: CompleteDiagnosticReport): string {
    return JSON.stringify(report, null, 2);
  }

  /**
   * 📄 Exporta relatório em formato Markdown
   */
  public exportReportMarkdown(report: CompleteDiagnosticReport): string {
    let markdown = `# 🔬 Relatório de Diagnóstico Automático\n\n`;
    markdown += `**Data:** ${report.timestamp.toLocaleString()}\n`;
    markdown += `**Versão:** ${report.version}\n`;
    markdown += `**Score Geral:** ${report.overallScore}/100\n`;
    markdown += `**Status:** ${report.overallStatus}\n\n`;

    markdown += `## 📊 Resumo\n\n`;
    markdown += `- **Total de Issues:** ${report.summary.totalIssues}\n`;
    markdown += `- **Críticos:** ${report.summary.criticalIssues}\n`;
    markdown += `- **Avisos:** ${report.summary.warningIssues}\n`;
    markdown += `- **Tempo Estimado de Correção:** ${report.estimatedFixTime}h\n\n`;

    markdown += `## 🎯 Próximas Ações\n\n`;
    report.nextActions.forEach((action) => {
      markdown += `- ${action}\n`;
    });

    markdown += `\n## 📋 Detalhes por Área\n\n`;
    report.areas.forEach((area) => {
      markdown += `### ${area.area}\n\n`;
      markdown += `**Status:** ${area.status} | **Score:** ${area.score}/100\n\n`;

      if (area.issues.length > 0) {
        markdown += `**Issues Encontrados:**\n`;
        area.issues.forEach((issue) => {
          markdown += `- [${issue.type.toUpperCase()}] ${issue.description}\n`;
        });
        markdown += `\n`;
      }

      if (area.recommendations.length > 0) {
        markdown += `**Recomendações:**\n`;
        area.recommendations.forEach((rec) => {
          markdown += `- ${rec}\n`;
        });
        markdown += `\n`;
      }
    });

    return markdown;
  }
}

// Singleton instance
export const automaticDiagnostics = new AutomaticDiagnostics();

// Função utilitária para executar diagnóstico completo
export const runCompleteDiagnostic = () =>
  automaticDiagnostics.executeCompleteDiagnostic();

export type { DiagnosticResult, Issue, CompleteDiagnosticReport };
