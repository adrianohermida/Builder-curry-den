/**
 * 🎯 UNIFIED LAYOUT - LAYOUT PRINCIPAL CORRIGIDO
 *
 * Layout principal com todas as correções aplicadas:
 * - Sistema de temas integrado
 * - Responsividade completa
 * - Sem animações de movimento
 * - Sidebar fixo e responsivo
 * - Cores dinâmicas baseadas no modo
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
import UnifiedTopbar from "./UnifiedTopbar";

// Dev Components
import ResponsiveInspector from "@/components/dev/ResponsiveInspector";

// Hooks
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Theme system
import { useTheme } from "@/lib/themeSystem";
import ThemeDiagnostic from "@/lib/themeDiagnostic";

// Environment utilities
import { IS_DEVELOPMENT } from "@/lib/env";

// ===== TYPES =====
interface LayoutState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  isMobile: boolean;
  isTablet: boolean;
}

interface LayoutContextValue {
  layoutState: LayoutState;
  currentPath: string;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  toggleSidebarCollapse: () => void;
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
  isMobile: false,
  isTablet: false,
};

// ===== UNIFIED LAYOUT COMPONENT =====
const UnifiedLayout: React.FC = () => {
  const location = useLocation();
  const { config: themeConfig, colors, getModeClass } = useTheme();

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
      // Sidebar sempre aberto no desktop, fechado no mobile por padrão
      sidebarOpen: isMobile ? false : (persistedState.sidebarOpen ?? true),
      // Auto-collapse no tablet
      sidebarCollapsed: isTablet
        ? true
        : (persistedState.sidebarCollapsed ?? false),
    };
  }, [windowSize, persistedState]);

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

  // ===== DIAGNÓSTICO DE DESENVOLVIMENTO =====
  useEffect(() => {
    if (IS_DEVELOPMENT) {
      // Rodar diagnóstico após um delay para garantir que o DOM está pronto
      const timer = setTimeout(() => {
        const diagnostic = new ThemeDiagnostic();
        diagnostic.generateReport();
        diagnostic.applyAutomaticFixes();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

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

  // ===== CONTEXT VALUE =====
  const contextValue: LayoutContextValue = useMemo(
    () => ({
      layoutState,
      currentPath: location.pathname,
      toggleSidebar,
      closeSidebar,
      openSidebar,
      toggleSidebarCollapse,
    }),
    [
      layoutState,
      location.pathname,
      toggleSidebar,
      closeSidebar,
      openSidebar,
      toggleSidebarCollapse,
    ],
  );

  // ===== COMPUTED CLASSES =====
  const mainClasses = useMemo(() => {
    const classes = ["min-h-screen", "pt-14"];

    // Aplicar cores do tema
    classes.push(
      themeConfig.themeMode === "dark" ? "bg-gray-900" : "bg-gray-50",
    );

    // Margin para sidebar (sem animações)
    if (layoutState.sidebarOpen && !layoutState.isMobile) {
      if (layoutState.sidebarCollapsed) {
        classes.push("lg:ml-16");
      } else {
        classes.push("lg:ml-64");
      }
    }

    return classes.join(" ");
  }, [layoutState, themeConfig.themeMode]);

  const contentClasses = useMemo(() => {
    return [
      "flex-1",
      "p-4",
      "lg:p-6",
      "transition-colors",
      "duration-150",
    ].join(" ");
  }, []);

  return (
    <LayoutContext.Provider value={contextValue}>
      <div
        className={`min-h-screen ${getModeClass()}`}
        data-layout-container="true"
        style={{
          backgroundColor: colors.background,
          color: colors.text,
        }}
      >
        {/* Topbar */}
        <UnifiedTopbar />

        {/* Sidebar */}
        <UnifiedSidebar
          isOpen={layoutState.sidebarOpen}
          isCollapsed={layoutState.sidebarCollapsed}
          onToggle={toggleSidebar}
          onClose={closeSidebar}
          isMobile={layoutState.isMobile}
        />

        {/* Mobile Sidebar Overlay - SEM ANIMAÇÕES */}
        {layoutState.isMobile && layoutState.sidebarOpen && (
          <div
            className="fixed inset-0 top-14 z-30 bg-black bg-opacity-50 lg:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <div className={mainClasses}>
          <main className={contentClasses}>
            {/* Loading Overlay */}
            {isLoading && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center"
                style={{ backgroundColor: `${colors.background}CC` }}
              >
                <div
                  className="p-6 rounded-lg shadow-lg"
                  style={{ backgroundColor: colors.surface }}
                >
                  <div
                    className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full mx-auto mb-4"
                    style={{
                      borderColor: `${colors.primary}40`,
                      borderTopColor: colors.primary,
                    }}
                  />
                  <p className="text-sm" style={{ color: colors.textMuted }}>
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
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              color: colors.text,
            },
          }}
        />

        {/* Responsive Inspector (Development Only) */}
        {IS_DEVELOPMENT && <ResponsiveInspector />}

        {/* Debug Info (Development Only) */}
        {IS_DEVELOPMENT && (
          <div
            className="fixed bottom-4 right-4 z-50 p-3 text-xs font-mono shadow-lg opacity-75 hover:opacity-100 rounded-lg border"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text,
            }}
          >
            <div className="space-y-1">
              <div>
                <strong>Layout Debug:</strong>
              </div>
              <div>
                Screen: {windowSize.width}x{windowSize.height}
              </div>
              <div>
                Device:{" "}
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
              <div>Theme: {themeConfig.themeMode}</div>
              <div>Mode: {themeConfig.userMode}</div>
              <div>Path: {location.pathname}</div>
            </div>
          </div>
        )}
      </div>
    </LayoutContext.Provider>
  );
};

export default UnifiedLayout;
