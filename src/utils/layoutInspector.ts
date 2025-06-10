/**
 * 🔍 LAYOUT INSPECTOR - INSPETOR MANUAL DE LAYOUT
 *
 * Utilitário para inspecionar problemas específicos de layout:
 * - Verificar se components estão renderizando
 * - Detectar problemas de roteamento
 * - Analisar estrutura do DOM
 * - Identificar conflitos CSS
 */

export interface LayoutInspectionResult {
  component: string;
  status: "ok" | "warning" | "error";
  message: string;
  element?: Element | null;
}

export class LayoutInspector {
  public inspectCurrentLayout(): LayoutInspectionResult[] {
    const results: LayoutInspectionResult[] = [];

    console.log("🔍 Inspecionando layout atual...");

    // Check Router
    results.push(this.checkRouter());

    // Check Layout Container
    results.push(this.checkLayoutContainer());

    // Check Topbar
    results.push(this.checkTopbar());

    // Check Sidebar
    results.push(this.checkSidebar());

    // Check Main Content
    results.push(this.checkMainContent());

    // Check Theme Application
    results.push(this.checkThemeApplication());

    // Log results
    results.forEach((result) => {
      const icon =
        result.status === "ok"
          ? "✅"
          : result.status === "warning"
            ? "⚠️"
            : "❌";
      console.log(`${icon} ${result.component}: ${result.message}`);
    });

    return results;
  }

  private checkRouter(): LayoutInspectionResult {
    const currentPath = window.location.pathname;
    const routerElement = document.querySelector("[data-router]");

    if (!routerElement) {
      return {
        component: "Router",
        status: "warning",
        message: `Router detectado em ${currentPath}, mas sem identificação`,
        element: null,
      };
    }

    return {
      component: "Router",
      status: "ok",
      message: `Router funcionando em ${currentPath}`,
      element: routerElement,
    };
  }

  private checkLayoutContainer(): LayoutInspectionResult {
    const layoutContainer = document.querySelector(
      '[data-layout-container="true"]',
    );

    if (!layoutContainer) {
      // Check if UnifiedLayout is being used instead
      const unifiedLayout = document.querySelector(
        '[data-loc*="UnifiedLayout"]',
      );
      if (unifiedLayout) {
        return {
          component: "Layout Container",
          status: "warning",
          message:
            "UnifiedLayout detectado ao invés de ProfessionalCleanLayout",
          element: unifiedLayout,
        };
      }

      return {
        component: "Layout Container",
        status: "error",
        message: "Container do layout não encontrado",
        element: null,
      };
    }

    return {
      component: "Layout Container",
      status: "ok",
      message: "ProfessionalCleanLayout funcionando corretamente",
      element: layoutContainer,
    };
  }

  private checkTopbar(): LayoutInspectionResult {
    const topbar =
      document.querySelector("header") || document.querySelector(".topbar");

    if (!topbar) {
      return {
        component: "Topbar",
        status: "error",
        message: "Topbar não encontrado",
        element: null,
      };
    }

    // Check if hamburger menu exists
    const hamburgerBtn = topbar.querySelector("button");
    if (!hamburgerBtn) {
      return {
        component: "Topbar",
        status: "warning",
        message: "Topbar encontrado mas sem botão de menu",
        element: topbar,
      };
    }

    return {
      component: "Topbar",
      status: "ok",
      message: "Topbar funcionando com menu hamburger",
      element: topbar,
    };
  }

  private checkSidebar(): LayoutInspectionResult {
    const sidebar = document.querySelector('[data-sidebar="true"]');

    if (!sidebar) {
      return {
        component: "Sidebar",
        status: "error",
        message: "Sidebar não encontrado - problema crítico",
        element: null,
      };
    }

    // Check if sidebar has menu items
    const menuItems = sidebar.querySelectorAll("button, a");
    if (menuItems.length === 0) {
      return {
        component: "Sidebar",
        status: "warning",
        message: "Sidebar encontrado mas sem itens de menu",
        element: sidebar,
      };
    }

    // Check if sidebar is visible
    const isVisible = window.getComputedStyle(sidebar).display !== "none";
    if (!isVisible && window.innerWidth >= 768) {
      return {
        component: "Sidebar",
        status: "warning",
        message: "Sidebar oculto em desktop - pode ser configuração",
        element: sidebar,
      };
    }

    return {
      component: "Sidebar",
      status: "ok",
      message: `Sidebar funcionando com ${menuItems.length} itens`,
      element: sidebar,
    };
  }

  private checkMainContent(): LayoutInspectionResult {
    const main = document.querySelector("main");

    if (!main) {
      return {
        component: "Main Content",
        status: "error",
        message: "Elemento main não encontrado",
        element: null,
      };
    }

    if (main.children.length === 0) {
      return {
        component: "Main Content",
        status: "error",
        message: "Main content vazio - Outlet não está funcionando",
        element: main,
      };
    }

    // Check if current page is rendering
    const currentPath = window.location.pathname;
    if (currentPath === "/painel") {
      const dashboardElements = main.querySelectorAll(
        "h1, .dashboard, [data-page]",
      );
      if (dashboardElements.length === 0) {
        return {
          component: "Main Content",
          status: "warning",
          message:
            "Main content tem elementos mas página dashboard não detectada",
          element: main,
        };
      }
    }

    return {
      component: "Main Content",
      status: "ok",
      message: `Main content funcionando com ${main.children.length} elementos`,
      element: main,
    };
  }

  private checkThemeApplication(): LayoutInspectionResult {
    const root = document.documentElement;
    const body = document.body;

    // Check CSS variables
    const primaryColor = getComputedStyle(root)
      .getPropertyValue("--theme-primary")
      .trim();
    if (!primaryColor) {
      return {
        component: "Theme System",
        status: "error",
        message: "Variáveis CSS do tema não aplicadas",
        element: root,
      };
    }

    // Check body classes
    const hasThemeClass =
      body.classList.contains("client-mode") ||
      body.classList.contains("admin-mode");
    if (!hasThemeClass) {
      return {
        component: "Theme System",
        status: "warning",
        message: "Classes de tema não aplicadas no body",
        element: body,
      };
    }

    // Check background color
    const bgColor = getComputedStyle(body).backgroundColor;
    if (bgColor === "rgba(0, 0, 0, 0)" || bgColor === "transparent") {
      return {
        component: "Theme System",
        status: "warning",
        message: "Background transparente detectado",
        element: body,
      };
    }

    return {
      component: "Theme System",
      status: "ok",
      message: `Tema aplicado corretamente (${primaryColor})`,
      element: body,
    };
  }

  // Method to force fixes for detected issues
  public forceFixLayoutIssues(): void {
    console.log("🔧 Aplicando correções forçadas...");

    const results = this.inspectCurrentLayout();

    results.forEach((result) => {
      if (result.status === "error") {
        console.log(
          `🚨 Problema crítico: ${result.component} - ${result.message}`,
        );

        switch (result.component) {
          case "Layout Container":
            this.forceLayoutContainerFix();
            break;
          case "Sidebar":
            this.forceSidebarFix();
            break;
          case "Main Content":
            this.forceMainContentFix();
            break;
          case "Theme System":
            this.forceThemeFix();
            break;
        }
      }
    });
  }

  private forceLayoutContainerFix(): void {
    console.log("🔧 Corrigindo container de layout...");

    // Check if we're using wrong layout
    const unifiedLayout = document.querySelector('[data-loc*="UnifiedLayout"]');
    if (unifiedLayout) {
      console.log(
        "⚠️ UnifiedLayout detectado - deveria ser ProfessionalCleanLayout",
      );
      console.log("🔄 Necessário verificar router configuration");
    }
  }

  private forceSidebarFix(): void {
    console.log("🔧 Corrigindo sidebar...");

    // Add sidebar if missing
    const sidebar = document.querySelector('[data-sidebar="true"]');
    if (!sidebar) {
      console.log("🚨 Sidebar completamente ausente - problema de layout");
      console.log("🔄 Recarregando página para forçar re-render...");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  private forceMainContentFix(): void {
    console.log("🔧 Corrigindo main content...");

    const main = document.querySelector("main");
    if (main && main.children.length === 0) {
      console.log("🚨 Outlet não está funcionando - problema de roteamento");
      console.log("🔄 Tentando recarregar...");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }

  private forceThemeFix(): void {
    console.log("🔧 Corrigindo tema...");

    const root = document.documentElement;
    const body = document.body;

    // Apply basic theme variables
    root.style.setProperty("--theme-primary", "#3b82f6");
    root.style.setProperty("--theme-background", "#ffffff");
    root.style.setProperty("--theme-text", "#1e293b");

    // Apply body classes
    body.classList.add("client-mode", "light");

    // Apply background
    body.style.backgroundColor = "#ffffff";

    console.log("✅ Tema básico aplicado");
  }
}

// Export singleton instance
export const layoutInspector = new LayoutInspector();

// Auto-run inspection in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  window.addEventListener("load", () => {
    setTimeout(() => {
      console.log("🔍 Auto-inspecionando layout...");
      layoutInspector.inspectCurrentLayout();
    }, 2000);
  });
}

// Add to window for debugging
if (typeof window !== "undefined") {
  (window as any).layoutInspector = layoutInspector;
  (window as any).inspectLayout = () => layoutInspector.inspectCurrentLayout();
  (window as any).fixLayout = () => layoutInspector.forceFixLayoutIssues();
}
