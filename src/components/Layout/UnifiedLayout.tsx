/**
 * 🎯 UNIFIED LAYOUT - LAYOUT PRINCIPAL CONSOLIDADO
 *
 * Layout unificado que substitui todas as variações de layout existentes:
 * - Design responsivo mobile-first
 * - Sidebar unificado com nova estrutura de menu
 * - Gestão de estado otimizada
 * - Performance aprimorada
 * - Acessibilidade completa
 * - Suporte a temas
 */

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

// Components
import UnifiedSidebar from "./UnifiedSidebar";

// Dev Components
import ResponsiveInspector from "@/components/dev/ResponsiveInspector";

// Hooks
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Environment utilities
import { IS_DEVELOPMENT } from "@/lib/env";

// ===== TYPES =====
interface LayoutState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: "light" | "dark" | "system";
  isMobile: boolean;
  isTablet: boolean;
}

interface LayoutContextValue {
  // State
  layoutState: LayoutState;
  currentPath: string;

  // Actions
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  toggleSidebarCollapse: () => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
}

interface BreadcrumbItem {
  label: string;
  path?: string;
}

// ===== LAYOUT CONTEXT =====
const LayoutContext = createContext<LayoutContextValue | null>(null);

export const useUnifiedLayout = (): LayoutContextValue => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useUnifiedLayout must be used within UnifiedLayout");
  }
  return context;
};

// ===== LAYOUT CONFIGURATION =====
const DEFAULT_LAYOUT_STATE: LayoutState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  theme: "light",
  isMobile: false,
  isTablet: false,
};

// ===== UTILITIES =====
const getBreakpoint = (width: number) => {
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  if (width < 1280) return "desktop";
  return "large";
};

const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ label: "Início", path: "/" }];

  const pathMap: Record<string, string> = {
    painel: "Dashboard",
    "crm-modern": "CRM Jurídico",
    agenda: "Calendário",
    publicacoes: "Publicações",
    atendimento: "Comunicação",
    analytics: "Relatórios",
    beta: "Beta",
    configuracoes: "Configurações",
    "configuracao-armazenamento": "Armazenamento",
    ajuda: "Ajuda",
  };

  let currentPath = "";
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    const label =
      pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbs.push({ label, path: currentPath });
  });

  return breadcrumbs;
};

// ===== UNIFIED LAYOUT COMPONENT =====
const UnifiedLayout: React.FC = () => {
  const location = useLocation();

  // ===== PERSISTENT STATE =====
  const [persistedState, setPersistedState] = useLocalStorage<
    Partial<LayoutState>
  >("lawdesk-unified-layout", {});

  // ===== LOCAL STATE =====
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  const [isLoading, setIsLoading] = useState(false);

  // ===== COMPUTED STATE =====
  const layoutState = useMemo<LayoutState>(() => {
    const isMobile = windowSize.width < 768;
    const isTablet = windowSize.width >= 768 && windowSize.width < 1024;

    return {
      ...DEFAULT_LAYOUT_STATE,
      ...persistedState,
      isMobile,
      isTablet,
      // Auto-hide sidebar on mobile
      sidebarOpen: isMobile ? false : (persistedState.sidebarOpen ?? true),
      // Auto-collapse on tablet
      sidebarCollapsed:
        isTablet && !isMobile
          ? true
          : (persistedState.sidebarCollapsed ?? false),
    };
  }, [windowSize, persistedState]);

  // ===== BREADCRUMBS =====
  const breadcrumbs = useMemo(
    () => generateBreadcrumbs(location.pathname),
    [location.pathname],
  );

  // ===== RESPONSIVE HANDLING =====
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ===== THEME MANAGEMENT =====
  useEffect(() => {
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove("light", "dark");

    // Apply theme
    let effectiveTheme = layoutState.theme;
    if (layoutState.theme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    root.classList.add(effectiveTheme);
    root.setAttribute("data-theme", effectiveTheme);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector(
      'meta[name="theme-color"]',
    ) as HTMLMetaElement;
    if (metaThemeColor) {
      metaThemeColor.content =
        effectiveTheme === "dark" ? "#1f2937" : "#ffffff";
    }
  }, [layoutState.theme]);

  // ===== SYSTEM THEME LISTENER =====
  useEffect(() => {
    if (layoutState.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const root = document.documentElement;
        const newTheme = mediaQuery.matches ? "dark" : "light";
        root.classList.remove("light", "dark");
        root.classList.add(newTheme);
        root.setAttribute("data-theme", newTheme);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [layoutState.theme]);

  // ===== LAYOUT ACTIONS =====
  const updateLayoutState = useCallback(
    (updates: Partial<LayoutState>) => {
      setPersistedState((prev) => ({ ...prev, ...updates }));
    },
    [setPersistedState],
  );

  const toggleSidebar = useCallback(() => {
    updateLayoutState({ sidebarOpen: !layoutState.sidebarOpen });
  }, [layoutState.sidebarOpen, updateLayoutState]);

  const closeSidebar = useCallback(() => {
    updateLayoutState({ sidebarOpen: false });
  }, [updateLayoutState]);

  const openSidebar = useCallback(() => {
    updateLayoutState({ sidebarOpen: true });
  }, [updateLayoutState]);

  const toggleSidebarCollapse = useCallback(() => {
    updateLayoutState({ sidebarCollapsed: !layoutState.sidebarCollapsed });
  }, [layoutState.sidebarCollapsed, updateLayoutState]);

  const setTheme = useCallback(
    (theme: "light" | "dark" | "system") => {
      updateLayoutState({ theme });
    },
    [updateLayoutState],
  );

  // ===== KEYBOARD SHORTCUTS =====
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + B: Toggle sidebar
      if ((event.ctrlKey || event.metaKey) && event.key === "b") {
        event.preventDefault();
        toggleSidebar();
      }

      // Ctrl/Cmd + Shift + B: Toggle sidebar collapse
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "B"
      ) {
        event.preventDefault();
        toggleSidebarCollapse();
      }

      // Escape: Close mobile sidebar
      if (event.key === "Escape" && layoutState.isMobile) {
        closeSidebar();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    toggleSidebar,
    toggleSidebarCollapse,
    closeSidebar,
    layoutState.isMobile,
  ]);

  // ===== CONTEXT VALUE =====
  const contextValue: LayoutContextValue = useMemo(
    () => ({
      layoutState,
      currentPath: location.pathname,
      toggleSidebar,
      closeSidebar,
      openSidebar,
      toggleSidebarCollapse,
      setTheme,
    }),
    [
      layoutState,
      location.pathname,
      toggleSidebar,
      closeSidebar,
      openSidebar,
      toggleSidebarCollapse,
      setTheme,
    ],
  );

  // ===== COMPUTED CLASSES =====
  const mainClasses = useMemo(() => {
    const classes = ["min-h-screen", "bg-gray-50", "dark:bg-gray-900"];

    if (layoutState.sidebarOpen) {
      if (layoutState.sidebarCollapsed) {
        classes.push("lg:ml-16");
      } else {
        classes.push("lg:ml-64");
      }
    }

    return classes.join(" ");
  }, [layoutState.sidebarOpen, layoutState.sidebarCollapsed]);

  const contentClasses = useMemo(() => {
    const classes = [
      "flex-1",
      "p-4",
      "lg:p-6",
      "transition-all",
      "duration-300",
      "ease-in-out",
    ];

    return classes.join(" ");
  }, []);

  return (
    <LayoutContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <UnifiedSidebar
          isOpen={layoutState.sidebarOpen}
          isCollapsed={layoutState.sidebarCollapsed}
          onToggle={toggleSidebar}
          onClose={closeSidebar}
        />

        {/* Mobile Sidebar Overlay */}
        {layoutState.isMobile && layoutState.sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <div className={mainClasses}>
          {/* Top Bar - Mobile */}
          {layoutState.isMobile && (
            <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Abrir menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">
                      L
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Lawdesk
                  </span>
                </div>
                <div className="w-10"></div>
              </div>

              {/* Breadcrumbs on Mobile */}
              {breadcrumbs.length > 1 && (
                <div className="mt-2 flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.path || crumb.label}>
                      {index > 0 && <span>/</span>}
                      <span
                        className={
                          index === breadcrumbs.length - 1
                            ? "text-gray-900 dark:text-white font-medium"
                            : ""
                        }
                      >
                        {crumb.label}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Page Content */}
          <main className={contentClasses}>
            {/* Loading Overlay */}
            {isLoading && (
              <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Carregando...
                  </p>
                </div>
              </div>
            )}

            {/* Page Content */}
            <Outlet />
          </main>
        </div>

        {/* Toast Notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              color: "hsl(var(--foreground))",
            },
          }}
        />

        {/* Responsive Inspector (Development Only) */}
        {IS_DEVELOPMENT && <ResponsiveInspector />}

        {/* Debug Info (Development Only) */}
        {IS_DEVELOPMENT && (
          <div className="fixed bottom-4 left-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-xs font-mono shadow-lg opacity-75 hover:opacity-100 transition-opacity">
            <div className="space-y-1">
              <div>
                <strong>Layout Debug:</strong>
              </div>
              <div>
                Screen: {windowSize.width}x{windowSize.height}
              </div>
              <div>
                Breakpoint:{" "}
                {layoutState.isMobile
                  ? "Mobile"
                  : layoutState.isTablet
                    ? "Tablet"
                    : "Desktop"}
              </div>
              <div>
                Sidebar:{" "}
                {layoutState.sidebarOpen
                  ? layoutState.sidebarCollapsed
                    ? "Collapsed"
                    : "Expanded"
                  : "Hidden"}
              </div>
              <div>Theme: {layoutState.theme}</div>
              <div>Path: {location.pathname}</div>
            </div>
          </div>
        )}
      </div>
    </LayoutContext.Provider>
  );
};

export default UnifiedLayout;
