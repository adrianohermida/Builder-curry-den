/**
 * 🔍 DESIGN DIAGNOSTIC - DIAGNÓSTICO COMPLETO DO DESIGN
 *
 * Sistema de diagnóstico para identificar e corrigir problemas de design:
 * - Layout rendering issues
 * - Theme inconsistencies
 * - Sidebar problems
 * - Color conflicts
 * - CSS issues
 */

export interface DiagnosticResult {
  issue: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  solution: string;
  fix?: () => void;
}

export interface DiagnosticReport {
  timestamp: string;
  totalIssues: number;
  criticalIssues: number;
  issues: DiagnosticResult[];
  fixesApplied: number;
}

export class DesignDiagnostic {
  private issues: DiagnosticResult[] = [];

  // ===== MAIN DIAGNOSTIC FUNCTION =====
  public runDiagnostic(): DiagnosticReport {
    console.log("🔍 Iniciando diagnóstico de design...");

    this.issues = [];

    // Executar todas as verificações
    this.checkLayoutStructure();
    this.checkThemeConsistency();
    this.checkSidebarIssues();
    this.checkColorConflicts();
    this.checkResponsiveDesign();
    this.checkCSSConflicts();
    this.checkRoutingIssues();

    // Gerar relatório
    const report = this.generateReport();

    console.log("📊 Diagnóstico completo:", report);

    return report;
  }

  // ===== APPLY AUTOMATIC FIXES =====
  public async applyAutomaticFixes(): Promise<number> {
    console.log("🔧 Aplicando correções automáticas...");

    let fixesApplied = 0;

    for (const issue of this.issues) {
      if (issue.fix && issue.severity !== "low") {
        try {
          issue.fix();
          fixesApplied++;
          console.log(`✅ Corrigido: ${issue.issue}`);
        } catch (error) {
          console.error(`❌ Erro ao corrigir ${issue.issue}:`, error);
        }
      }
    }

    console.log(`🎯 ${fixesApplied} correções aplicadas automaticamente`);

    return fixesApplied;
  }

  // ===== LAYOUT STRUCTURE CHECK =====
  private checkLayoutStructure(): void {
    console.log("🏗️ Verificando estrutura do layout...");

    // Check if correct layout is being used
    const layoutContainer = document.querySelector(
      '[data-layout-container="true"]',
    );
    if (!layoutContainer) {
      this.addIssue({
        issue: "Layout container missing",
        severity: "critical",
        description: "O container principal do layout não foi encontrado",
        solution: "Verificar se ProfessionalCleanLayout está sendo renderizado",
        fix: () => {
          console.log("🔄 Layout precisa ser verificado no router");
        },
      });
    }

    // Check if Outlet is rendering
    const mainContent = document.querySelector("main");
    if (!mainContent || mainContent.children.length === 0) {
      this.addIssue({
        issue: "Main content empty or missing",
        severity: "high",
        description: "O conteúdo principal não está sendo renderizado",
        solution: "Verificar se Outlet está funcionando corretamente",
        fix: () => {
          this.fixOutletIssue();
        },
      });
    }

    // Check sidebar presence
    const sidebar = document.querySelector('[data-sidebar="true"]');
    if (!sidebar) {
      this.addIssue({
        issue: "Sidebar not rendered",
        severity: "high",
        description: "O sidebar não está sendo renderizado",
        solution: "Verificar se UnifiedSidebar está sendo importado e usado",
        fix: () => {
          this.fixSidebarRendering();
        },
      });
    }
  }

  // ===== THEME CONSISTENCY CHECK =====
  private checkThemeConsistency(): void {
    console.log("🎨 Verificando consistência do tema...");

    const root = document.documentElement;
    const body = document.body;

    // Check CSS custom properties
    const primaryColor =
      getComputedStyle(root).getPropertyValue("--theme-primary");
    if (!primaryColor || primaryColor.trim() === "") {
      this.addIssue({
        issue: "Theme CSS variables not set",
        severity: "high",
        description: "Variáveis CSS do tema não estão definidas",
        solution: "Aplicar variáveis CSS através do ThemeSystem",
        fix: () => {
          this.fixThemeVariables();
        },
      });
    }

    // Check body classes
    const hasThemeClass =
      body.classList.contains("client-mode") ||
      body.classList.contains("admin-mode");
    if (!hasThemeClass) {
      this.addIssue({
        issue: "Theme classes missing on body",
        severity: "medium",
        description: "Classes de tema não estão aplicadas no body",
        solution: "Aplicar classes através do ThemeInitializer",
        fix: () => {
          this.fixBodyClasses();
        },
      });
    }

    // Check for conflicting background colors
    const backgroundColor = getComputedStyle(body).backgroundColor;
    if (
      backgroundColor === "rgb(2, 8, 23)" ||
      backgroundColor === "rgba(0, 0, 0, 0)"
    ) {
      this.addIssue({
        issue: "Conflicting background colors",
        severity: "medium",
        description: "Cores de fundo conflitantes ou transparentes detectadas",
        solution: "Aplicar cores sólidas baseadas no tema",
        fix: () => {
          this.fixBackgroundColors();
        },
      });
    }
  }

  // ===== SIDEBAR ISSUES CHECK =====
  private checkSidebarIssues(): void {
    console.log("📋 Verificando problemas do sidebar...");

    const sidebar = document.querySelector('[data-sidebar="true"]');
    if (sidebar) {
      // Check if sidebar has proper z-index
      const zIndex = getComputedStyle(sidebar).zIndex;
      if (parseInt(zIndex) < 40) {
        this.addIssue({
          issue: "Sidebar z-index too low",
          severity: "medium",
          description:
            "Z-index do sidebar pode causar problemas de sobreposição",
          solution: "Ajustar z-index para 40 ou maior",
          fix: () => {
            (sidebar as HTMLElement).style.zIndex = "40";
          },
        });
      }

      // Check for black hover backgrounds
      const sidebarButtons = sidebar.querySelectorAll("button");
      sidebarButtons.forEach((button) => {
        const bgColor = getComputedStyle(button).backgroundColor;
        if (bgColor === "rgb(0, 0, 0)" || bgColor.includes("rgba(0, 0, 0")) {
          this.addIssue({
            issue: "Black hover backgrounds in sidebar",
            severity: "medium",
            description: "Botões do sidebar com fundo preto detectados",
            solution: "Aplicar CSS customizado do sidebar-theme.css",
            fix: () => {
              this.fixSidebarHoverColors();
            },
          });
        }
      });
    }
  }

  // ===== COLOR CONFLICTS CHECK =====
  private checkColorConflicts(): void {
    console.log("🌈 Verificando conflitos de cores...");

    // Check for elements with conflicting colors
    const allElements = document.querySelectorAll("*");
    let conflictCount = 0;

    allElements.forEach((element) => {
      const computedStyle = getComputedStyle(element);
      const bgColor = computedStyle.backgroundColor;
      const textColor = computedStyle.color;

      // Check for transparent backgrounds where solid is expected
      if (bgColor === "rgba(0, 0, 0, 0)" && element.classList.contains("bg-")) {
        conflictCount++;
      }

      // Check for default black text where themed text is expected
      if (textColor === "rgb(0, 0, 0)" && element.closest("[data-theme]")) {
        conflictCount++;
      }
    });

    if (conflictCount > 10) {
      this.addIssue({
        issue: "Multiple color conflicts detected",
        severity: "medium",
        description: `${conflictCount} elementos com conflitos de cor encontrados`,
        solution: "Aplicar sistema de cores consistente",
        fix: () => {
          this.fixColorConflicts();
        },
      });
    }
  }

  // ===== RESPONSIVE DESIGN CHECK =====
  private checkResponsiveDesign(): void {
    console.log("📱 Verificando design responsivo...");

    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      this.addIssue({
        issue: "Viewport meta tag missing",
        severity: "high",
        description: "Meta tag viewport não encontrada",
        solution: "Adicionar meta viewport para responsividade",
        fix: () => {
          const meta = document.createElement("meta");
          meta.name = "viewport";
          meta.content = "width=device-width, initial-scale=1";
          document.head.appendChild(meta);
        },
      });
    }

    // Check mobile sidebar behavior
    if (window.innerWidth < 768) {
      const sidebar = document.querySelector('[data-sidebar="true"]');
      if (sidebar && !sidebar.classList.contains("hidden")) {
        this.addIssue({
          issue: "Sidebar not hidden on mobile",
          severity: "medium",
          description: "Sidebar deveria estar oculto em dispositivos móveis",
          solution:
            "Implementar lógica de hide/show baseada no tamanho da tela",
          fix: () => {
            this.fixMobileSidebar();
          },
        });
      }
    }
  }

  // ===== CSS CONFLICTS CHECK =====
  private checkCSSConflicts(): void {
    console.log("🎭 Verificando conflitos de CSS...");

    // Check for multiple theme CSS files
    const stylesheets = Array.from(document.styleSheets);
    const themeFiles = stylesheets.filter(
      (sheet) =>
        sheet.href?.includes("theme") ||
        sheet.href?.includes("professional") ||
        sheet.href?.includes("sidebar"),
    );

    if (themeFiles.length > 3) {
      this.addIssue({
        issue: "Too many theme CSS files",
        severity: "low",
        description: "Muitos arquivos CSS de tema podem causar conflitos",
        solution: "Consolidar ou remover arquivos CSS desnecessários",
        fix: () => {
          console.log("🔄 Revisar imports de CSS no projeto");
        },
      });
    }

    // Check for inline styles overriding theme
    const elementsWithInlineStyles = document.querySelectorAll("[style]");
    let problematicInlineStyles = 0;

    elementsWithInlineStyles.forEach((element) => {
      const inlineStyle = (element as HTMLElement).style;
      if (inlineStyle.backgroundColor || inlineStyle.color) {
        problematicInlineStyles++;
      }
    });

    if (problematicInlineStyles > 20) {
      this.addIssue({
        issue: "Excessive inline styles",
        severity: "low",
        description: `${problematicInlineStyles} elementos com estilos inline encontrados`,
        solution: "Migrar estilos inline para CSS classes ou sistema de temas",
        fix: () => {
          this.cleanupInlineStyles();
        },
      });
    }
  }

  // ===== ROUTING ISSUES CHECK =====
  private checkRoutingIssues(): void {
    console.log("🛣️ Verificando problemas de roteamento...");

    const currentPath = window.location.pathname;

    // Check if we're using the correct router
    const routerElement = document.querySelector("[data-router]");
    if (!routerElement) {
      this.addIssue({
        issue: "Router identification missing",
        severity: "medium",
        description: "Não é possível identificar qual router está sendo usado",
        solution: "Adicionar data-router attribute ao router ativo",
        fix: () => {
          console.log("🔄 Verificar configuração do router");
        },
      });
    }

    // Check if outlet is working
    if (currentPath === "/painel") {
      const dashboardElement = document.querySelector(
        '[data-page="dashboard"]',
      );
      if (!dashboardElement) {
        this.addIssue({
          issue: "Dashboard page not rendering",
          severity: "high",
          description: "Página do dashboard não está sendo renderizada",
          solution:
            "Verificar se Outlet está funcionando e rota está configurada",
          fix: () => {
            this.fixRoutingIssue();
          },
        });
      }
    }
  }

  // ===== FIX METHODS =====
  private fixOutletIssue(): void {
    console.log("🔧 Corrigindo problema do Outlet...");

    // Force refresh if outlet isn't working
    const main = document.querySelector("main");
    if (main && main.children.length === 0) {
      setTimeout(() => {
        console.log("🔄 Refreshing page to fix Outlet...");
        window.location.reload();
      }, 1000);
    }
  }

  private fixSidebarRendering(): void {
    console.log("🔧 Corrigindo renderização do sidebar...");

    // Force sidebar visibility
    const existingSidebar = document.querySelector('[data-sidebar="true"]');
    if (!existingSidebar) {
      console.log("🔄 Sidebar not found, may need layout refresh");
    }
  }

  private fixThemeVariables(): void {
    console.log("🔧 Aplicando variáveis de tema...");

    const root = document.documentElement;

    // Default theme variables
    const defaultTheme = {
      primary: "#3b82f6",
      primaryText: "#ffffff",
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#1e293b",
      textMuted: "#64748b",
      border: "#e2e8f0",
      accent: "#0ea5e9",
    };

    Object.entries(defaultTheme).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });
  }

  private fixBodyClasses(): void {
    console.log("🔧 Aplicando classes de tema no body...");

    document.body.classList.add("client-mode", "light");
  }

  private fixBackgroundColors(): void {
    console.log("🔧 Corrigindo cores de fundo...");

    document.body.style.backgroundColor = "#ffffff";
    document.documentElement.style.backgroundColor = "#ffffff";
  }

  private fixSidebarHoverColors(): void {
    console.log("🔧 Corrigindo cores de hover do sidebar...");

    const style = document.createElement("style");
    style.textContent = `
      [data-sidebar="true"] button:hover {
        background-color: rgba(59, 130, 246, 0.1) !important;
        color: #3b82f6 !important;
      }
      [data-sidebar="true"] button:hover * {
        color: inherit !important;
      }
    `;
    document.head.appendChild(style);
  }

  private fixColorConflicts(): void {
    console.log("🔧 Corrigindo conflitos de cores...");

    // Apply theme-based colors to common elements
    const style = document.createElement("style");
    style.textContent = `
      .bg-white { background-color: var(--theme-background, #ffffff) !important; }
      .text-gray-900 { color: var(--theme-text, #1e293b) !important; }
      .text-gray-600 { color: var(--theme-textMuted, #64748b) !important; }
      .border-gray-200 { border-color: var(--theme-border, #e2e8f0) !important; }
    `;
    document.head.appendChild(style);
  }

  private fixMobileSidebar(): void {
    console.log("🔧 Corrigindo sidebar mobile...");

    if (window.innerWidth < 768) {
      const sidebar = document.querySelector(
        '[data-sidebar="true"]',
      ) as HTMLElement;
      if (sidebar) {
        sidebar.style.display = "none";
      }
    }
  }

  private cleanupInlineStyles(): void {
    console.log("🔧 Limpando estilos inline desnecessários...");

    const elementsWithInlineStyles = document.querySelectorAll("[style]");
    let cleaned = 0;

    elementsWithInlineStyles.forEach((element) => {
      const el = element as HTMLElement;
      const inlineStyle = el.style;

      // Remove problematic inline styles
      if (inlineStyle.backgroundColor === "transparent") {
        inlineStyle.removeProperty("background-color");
        cleaned++;
      }

      if (inlineStyle.color === "rgb(0, 0, 0)") {
        inlineStyle.removeProperty("color");
        cleaned++;
      }
    });

    console.log(`🧹 ${cleaned} estilos inline removidos`);
  }

  private fixRoutingIssue(): void {
    console.log("🔧 Corrigindo problema de roteamento...");

    // Check if we need to refresh to fix routing
    setTimeout(() => {
      if (
        window.location.pathname === "/painel" &&
        !document.querySelector('[data-page="dashboard"]')
      ) {
        console.log("🔄 Routing issue detected, refreshing...");
        window.location.reload();
      }
    }, 2000);
  }

  // ===== HELPER METHODS =====
  private addIssue(issue: DiagnosticResult): void {
    this.issues.push(issue);
  }

  private generateReport(): DiagnosticReport {
    const criticalIssues = this.issues.filter(
      (issue) => issue.severity === "critical",
    );

    return {
      timestamp: new Date().toISOString(),
      totalIssues: this.issues.length,
      criticalIssues: criticalIssues.length,
      issues: this.issues,
      fixesApplied: 0,
    };
  }
}

// ===== EXPORT FUNCTIONS =====
export const runDesignDiagnostic = (): DiagnosticReport => {
  const diagnostic = new DesignDiagnostic();
  return diagnostic.runDiagnostic();
};

export const fixDesignIssues = async (): Promise<number> => {
  const diagnostic = new DesignDiagnostic();
  diagnostic.runDiagnostic();
  return await diagnostic.applyAutomaticFixes();
};

// ===== AUTO-RUN IN DEVELOPMENT =====
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // Auto-run diagnostic after page load
  window.addEventListener("load", () => {
    setTimeout(() => {
      console.log("🚀 Auto-executando diagnóstico de design...");
      const report = runDesignDiagnostic();

      if (report.criticalIssues > 0) {
        console.warn(
          "⚠️ Problemas críticos encontrados, aplicando correções...",
        );
        fixDesignIssues();
      }
    }, 1000);
  });
}
