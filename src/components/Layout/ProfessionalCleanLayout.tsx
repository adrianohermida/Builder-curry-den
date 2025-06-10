/**
 * 🎯 PROFESSIONAL CLEAN LAYOUT - ATUALIZADO COM NOVO SIDEBAR
 *
 * Layout profissional usando o novo UnifiedSidebar refatorado com:
 * - Sistema de temas por modo (cliente/admin)
 * - Sem cor preta no hover
 * - Switch de modo escuro
 * - Color picker personalizado
 */

import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

// Components
import UnifiedSidebar from "./UnifiedSidebar";
import UnifiedTopbar from "./UnifiedTopbar";

// Hooks
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Theme system
import { useTheme } from "@/lib/themeSystem";

// Sidebar theme CSS
import "@/styles/sidebar-theme.css";

// ===== TYPES =====
interface LayoutState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  isMobile: boolean;
  isTablet: boolean;
}

// ===== LAYOUT CONFIGURATION =====
const DEFAULT_LAYOUT_STATE: LayoutState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  isMobile: false,
  isTablet: false,
};

// ===== PROFESSIONAL CLEAN LAYOUT COMPONENT =====
const ProfessionalCleanLayout: React.FC = () => {
  const { colors, getModeClass } = useTheme();

  // ===== PERSISTENT STATE =====
  const [persistedState, setPersistedState] = useLocalStorage<
    Partial<LayoutState>
  >("lawdesk-professional-layout", {});

  // ===== RESPONSIVE STATE =====
  const [windowSize, setWindowSize] = React.useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  // ===== COMPUTED STATE =====
  const layoutState = React.useMemo<LayoutState>(() => {
    const isMobile = windowSize.width < 768;
    const isTablet = windowSize.width >= 768 && windowSize.width < 1024;

    return {
      ...DEFAULT_LAYOUT_STATE,
      ...persistedState,
      isMobile,
      isTablet,
      sidebarOpen: isMobile ? false : (persistedState.sidebarOpen ?? true),
      sidebarCollapsed: isTablet
        ? true
        : (persistedState.sidebarCollapsed ?? false),
    };
  }, [windowSize, persistedState]);

  // ===== RESPONSIVE HANDLING =====
  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ===== LAYOUT ACTIONS =====
  const updateLayoutState = React.useCallback(
    (updates: Partial<LayoutState>) => {
      setPersistedState((prev) => ({ ...prev, ...updates }));
    },
    [setPersistedState],
  );

  const toggleSidebar = React.useCallback(() => {
    updateLayoutState({ sidebarOpen: !layoutState.sidebarOpen });
  }, [layoutState.sidebarOpen, updateLayoutState]);

  const closeSidebar = React.useCallback(() => {
    updateLayoutState({ sidebarOpen: false });
  }, [updateLayoutState]);

  const openSidebar = React.useCallback(() => {
    updateLayoutState({ sidebarOpen: true });
  }, [updateLayoutState]);

  const toggleSidebarCollapse = React.useCallback(() => {
    updateLayoutState({ sidebarCollapsed: !layoutState.sidebarCollapsed });
  }, [layoutState.sidebarCollapsed, updateLayoutState]);

  // ===== COMPUTED CLASSES =====
  const mainClasses = React.useMemo(() => {
    const classes = ["min-h-screen", "pt-14"];

    // Margin para sidebar
    if (layoutState.sidebarOpen && !layoutState.isMobile) {
      if (layoutState.sidebarCollapsed) {
        classes.push("lg:ml-16");
      } else {
        classes.push("lg:ml-64");
      }
    }

    return classes.join(" ");
  }, [layoutState]);

  const contentClasses = React.useMemo(() => {
    return [
      "flex-1",
      "p-4",
      "lg:p-6",
      "transition-colors",
      "duration-150",
    ].join(" ");
  }, []);

  return (
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

      {/* Mobile Sidebar Overlay */}
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
    </div>
  );
};

export default ProfessionalCleanLayout;
