/**
 * 🎯 DIAGNÓSTICO DO SISTEMA DE TEMAS
 *
 * Diagnóstico completo e correções para:
 * - Responsividade
 * - Cores dos temas
 * - Rotas corretas
 * - Remoção de animações
 * - Consistência visual
 */

import { ThemeSystem } from "./themeSystem";

// ===== DIAGNÓSTICO TYPES =====
interface DiagnosticResult {
  component: string;
  issues: string[];
  fixes: string[];
  status: "ok" | "warning" | "error";
}

interface SystemDiagnostic {
  theme: DiagnosticResult;
  layout: DiagnosticResult;
  sidebar: DiagnosticResult;
  topbar: DiagnosticResult;
  responsiveness: DiagnosticResult;
  routing: DiagnosticResult;
  colors: DiagnosticResult;
  animations: DiagnosticResult;
}

// ===== DIAGNÓSTICO FUNCTIONS =====
class ThemeDiagnostic {
  private themeSystem: ThemeSystem;

  constructor() {
    this.themeSystem = ThemeSystem.getInstance();
  }

  // Diagnóstico completo
  runFullDiagnostic(): SystemDiagnostic {
    return {
      theme: this.diagnoseTheme(),
      layout: this.diagnoseLayout(),
      sidebar: this.diagnoseSidebar(),
      topbar: this.diagnoseTopbar(),
      responsiveness: this.diagnoseResponsiveness(),
      routing: this.diagnoseRouting(),
      colors: this.diagnoseColors(),
      animations: this.diagnoseAnimations(),
    };
  }

  // Diagnóstico do sistema de temas
  private diagnoseTheme(): DiagnosticResult {
    const issues: string[] = [];
    const fixes: string[] = [];

    // Verificar se o tema está aplicado corretamente
    const root = document.documentElement;
    const currentConfig = this.themeSystem.getConfig();

    if (!root.classList.contains(currentConfig.themeMode)) {
      issues.push("Classe de tema não aplicada no root");
      fixes.push("Aplicar classe de tema no documentElement");
    }

    if (!root.classList.contains(`${currentConfig.userMode}-mode`)) {
      issues.push("Classe de modo usuário não aplicada");
      fixes.push("Aplicar classe de modo no documentElement");
    }

    // Verificar variáveis CSS
    const colors = this.themeSystem.getColors();
    const primaryColor =
      getComputedStyle(root).getPropertyValue("--theme-primary");

    if (!primaryColor || primaryColor.trim() !== colors.primary) {
      issues.push("Variáveis CSS de tema não aplicadas corretamente");
      fixes.push("Aplicar variáveis CSS --theme-* no root");
    }

    return {
      component: "Theme System",
      issues,
      fixes,
      status:
        issues.length === 0 ? "ok" : issues.length > 2 ? "error" : "warning",
    };
  }

  // Diagnóstico do layout
  private diagnoseLayout(): DiagnosticResult {
    const issues: string[] = [];
    const fixes: string[] = [];

    // Verificar se o layout está responsivo
    const viewport = window.innerWidth;
    const isMobile = viewport < 768;
    const isTablet = viewport >= 768 && viewport < 1024;

    // Verificar estrutura do layout
    const layoutContainer = document.querySelector("[data-layout-container]");
    if (!layoutContainer) {
      issues.push("Container de layout não encontrado");
      fixes.push("Adicionar data-layout-container ao elemento principal");
    }

    // Verificar classes responsivas
    const mainContent = document.querySelector("main");
    if (mainContent) {
      const classes = mainContent.className;
      if (isMobile && classes.includes("ml-64")) {
        issues.push("Sidebar não está oculta no mobile");
        fixes.push("Aplicar classes responsivas corretas para mobile");
      }
    }

    return {
      component: "Layout",
      issues,
      fixes,
      status: issues.length === 0 ? "ok" : "warning",
    };
  }

  // Diagnóstico do sidebar
  private diagnoseSidebar(): DiagnosticResult {
    const issues: string[] = [];
    const fixes: string[] = [];

    const sidebar = document.querySelector("[data-sidebar]");
    if (!sidebar) {
      issues.push("Sidebar não encontrado");
      fixes.push("Adicionar data-sidebar ao componente sidebar");
    } else {
      // Verificar se está fixo
      const computedStyle = getComputedStyle(sidebar);
      if (computedStyle.position !== "fixed") {
        issues.push("Sidebar não está com position fixed");
        fixes.push("Aplicar position: fixed ao sidebar");
      }

      // Verificar z-index
      const zIndex = parseInt(computedStyle.zIndex);
      if (zIndex < 40) {
        issues.push("Z-index do sidebar muito baixo");
        fixes.push("Aplicar z-index: 40 ou maior");
      }

      // Verificar animações
      const transition = computedStyle.transition;
      if (transition.includes("transform")) {
        issues.push("Animações de transform detectadas no sidebar");
        fixes.push("Remover transições de transform");
      }
    }

    return {
      component: "Sidebar",
      issues,
      fixes,
      status: issues.length === 0 ? "ok" : "warning",
    };
  }

  // Diagnóstico do topbar
  private diagnoseTopbar(): DiagnosticResult {
    const issues: string[] = [];
    const fixes: string[] = [];

    const topbar = document.querySelector("[data-topbar]");
    if (!topbar) {
      issues.push("Topbar não encontrado");
      fixes.push("Adicionar data-topbar ao componente topbar");
    } else {
      // Verificar se está sticky
      const computedStyle = getComputedStyle(topbar);
      if (
        computedStyle.position !== "sticky" &&
        computedStyle.position !== "fixed"
      ) {
        issues.push("Topbar não está sticky/fixed");
        fixes.push("Aplicar position: sticky ao topbar");
      }

      // Verificar altura
      const height = topbar.getBoundingClientRect().height;
      if (height !== 56) {
        // 14 * 4 = 56px (h-14)
        issues.push(`Altura do topbar incorreta: ${height}px (esperado: 56px)`);
        fixes.push("Aplicar h-14 (56px) ao topbar");
      }
    }

    return {
      component: "Topbar",
      issues,
      fixes,
      status: issues.length === 0 ? "ok" : "warning",
    };
  }

  // Diagnóstico de responsividade
  private diagnoseResponsiveness(): DiagnosticResult {
    const issues: string[] = [];
    const fixes: string[] = [];

    const viewport = window.innerWidth;
    const isMobile = viewport < 768;
    const isTablet = viewport >= 768 && viewport < 1024;

    // Verificar meta viewport
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      issues.push("Meta viewport não encontrada");
      fixes.push(
        "Adicionar <meta name='viewport' content='width=device-width, initial-scale=1'>",
      );
    }

    // Verificar breakpoints
    if (isMobile) {
      const sidebar = document.querySelector("[data-sidebar]");
      if (sidebar && sidebar.classList.contains("w-64")) {
        issues.push("Sidebar muito largo no mobile");
        fixes.push("Aplicar w-full ou ocultar no mobile");
      }
    }

    // Verificar scroll horizontal
    if (document.body.scrollWidth > window.innerWidth) {
      issues.push("Scroll horizontal detectado");
      fixes.push("Verificar elementos que ultrapassam a viewport");
    }

    return {
      component: "Responsiveness",
      issues,
      fixes,
      status: issues.length === 0 ? "ok" : "warning",
    };
  }

  // Diagnóstico de rotas
  private diagnoseRouting(): DiagnosticResult {
    const issues: string[] = [];
    const fixes: string[] = [];

    // Verificar se as rotas principais existem
    const criticalRoutes = [
      "/painel",
      "/feed",
      "/crm-modern",
      "/agenda",
      "/configuracoes",
    ];

    // Para cada rota crítica, verificar se existe
    criticalRoutes.forEach((route) => {
      // Simulação de verificação de rota
      // Em um caso real, isso verificaria se a rota está registrada no router
      if (window.location.pathname.startsWith(route)) {
        // Rota atual existe
      }
    });

    // Verificar se há rotas quebradas nos links
    const links = document.querySelectorAll("a[href], button[data-path]");
    links.forEach((link) => {
      const href = link.getAttribute("href") || link.getAttribute("data-path");
      if (href && href.startsWith("/") && href.includes("undefined")) {
        issues.push(`Link quebrado detectado: ${href}`);
        fixes.push("Corrigir links com undefined");
      }
    });

    return {
      component: "Routing",
      issues,
      fixes,
      status: issues.length === 0 ? "ok" : "warning",
    };
  }

  // Diagnóstico de cores
  private diagnoseColors(): DiagnosticResult {
    const issues: string[] = [];
    const fixes: string[] = [];

    const config = this.themeSystem.getConfig();
    const colors = this.themeSystem.getColors();

    // Verificar consistência de cores
    if (config.userMode === "client" && !colors.primary.includes("3b82f6")) {
      issues.push("Cor primária incorreta para modo cliente (deve ser azul)");
      fixes.push("Aplicar cor azul (#3b82f6) para modo cliente");
    }

    if (config.userMode === "admin" && !colors.primary.includes("dc2626")) {
      issues.push("Cor primária incorreta para modo admin (deve ser vermelho)");
      fixes.push("Aplicar cor vermelha (#dc2626) para modo admin");
    }

    // Verificar contraste
    const root = document.documentElement;
    const bgColor = getComputedStyle(root).backgroundColor;
    const textColor = getComputedStyle(root).color;

    if (!bgColor || !textColor) {
      issues.push("Cores de fundo e texto não definidas");
      fixes.push("Definir cores base no root element");
    }

    return {
      component: "Colors",
      issues,
      fixes,
      status: issues.length === 0 ? "ok" : "warning",
    };
  }

  // Diagnóstico de animações
  private diagnoseAnimations(): DiagnosticResult {
    const issues: string[] = [];
    const fixes: string[] = [];

    // Verificar se há animações de transform/translate
    const elementsWithTransform = document.querySelectorAll("*");
    elementsWithTransform.forEach((element) => {
      const computedStyle = getComputedStyle(element);
      const transition = computedStyle.transition;
      const transform = computedStyle.transform;

      if (
        transition.includes("transform") &&
        element.closest("[data-sidebar]")
      ) {
        issues.push("Animação de transform detectada no sidebar");
        fixes.push("Remover transition: transform do sidebar");
      }

      if (transform !== "none" && transform.includes("translate")) {
        issues.push("Transform translate ativo detectado");
        fixes.push("Remover transforms de translate para posicionamento fixo");
      }
    });

    // Verificar animações CSS
    const stylesheets = document.styleSheets;
    // Verificação simplificada de CSS animations
    // Em produção, isso seria mais robusto

    return {
      component: "Animations",
      issues,
      fixes,
      status: issues.length === 0 ? "ok" : "warning",
    };
  }

  // Aplicar correções automáticas
  applyAutomaticFixes(): void {
    console.log("🔧 Aplicando correções automáticas...");

    // Aplicar tema
    this.themeSystem.applyTheme();

    // Corrigir meta viewport se não existir
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content = "width=device-width, initial-scale=1";
      document.head.appendChild(meta);
    }

    // Adicionar data attributes se não existirem
    const sidebar = document.querySelector('[class*="sidebar"]');
    if (sidebar && !sidebar.hasAttribute("data-sidebar")) {
      sidebar.setAttribute("data-sidebar", "true");
    }

    const topbar = document.querySelector(
      '[class*="topbar"], [class*="header"]',
    );
    if (topbar && !topbar.hasAttribute("data-topbar")) {
      topbar.setAttribute("data-topbar", "true");
    }

    console.log("✅ Correções aplicadas");
  }

  // Gerar relatório
  generateReport(): string {
    const diagnostic = this.runFullDiagnostic();

    let report = "📊 RELATÓRIO DE DIAGNÓSTICO DO SISTEMA\n";
    report += "=====================================\n\n";

    Object.entries(diagnostic).forEach(([key, result]) => {
      const statusIcon =
        result.status === "ok"
          ? "✅"
          : result.status === "warning"
            ? "⚠️"
            : "❌";
      report += `${statusIcon} ${result.component}\n`;

      if (result.issues.length > 0) {
        report += "  Problemas encontrados:\n";
        result.issues.forEach((issue) => (report += `    - ${issue}\n`));

        report += "  Correções sugeridas:\n";
        result.fixes.forEach((fix) => (report += `    - ${fix}\n`));
      } else {
        report += "  ✅ Sem problemas detectados\n";
      }

      report += "\n";
    });

    return report;
  }
}

// ===== EXPORT =====
export default ThemeDiagnostic;

// Função utilitária para rodar diagnóstico
export function runThemeDiagnostic(): void {
  const diagnostic = new ThemeDiagnostic();
  const report = diagnostic.generateReport();

  console.group("🔍 DIAGNÓSTICO DO SISTEMA DE TEMAS");
  console.log(report);
  console.groupEnd();

  // Aplicar correções automáticas
  diagnostic.applyAutomaticFixes();
}
