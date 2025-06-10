/**
 * ULTIMATE OPTIMIZED LAYOUT V2
 * Single, consolidated layout system replacing all previous layouts
 * Focus: Performance, Responsiveness, Accessibility, Clean UX
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ultimateDesignSystem, ThemeConfig } from "@/lib/ultimateDesignSystem";
import { performanceUtils } from "@/lib/performanceUtils";
import UltimateOptimizedSidebar from "./UltimateOptimizedSidebar";
import UltimateOptimizedHeader from "./UltimateOptimizedHeader";
import UltimateConversationWidget from "@/components/Chat/UltimateConversationWidget";

// ===== TYPES =====
interface LayoutState {
  sidebarExpanded: boolean;
  mobileMenuOpen: boolean;
  theme: ThemeConfig;
  conversationMinimized: boolean;
}

// ===== PERFORMANCE MEMOIZED COMPONENTS =====
const MemoizedSidebar = React.memo(UltimateOptimizedSidebar);
const MemoizedHeader = React.memo(UltimateOptimizedHeader);
const MemoizedConversationWidget = React.memo(UltimateConversationWidget);

// ===== MAIN LAYOUT COMPONENT =====
const UltimateOptimizedLayout: React.FC = () => {
  const location = useLocation();

  // ===== STATE MANAGEMENT =====
  const [layoutState, setLayoutState] = useState<LayoutState>(() => {
    const storedTheme = ultimateDesignSystem.performance.getStoredTheme();
    return {
      sidebarExpanded: !performanceUtils.responsiveUtils.breakpoints.isMobile(),
      mobileMenuOpen: false,
      theme: storedTheme,
      conversationMinimized: true,
    };
  });

  // ===== RESPONSIVE HANDLERS =====
  const isMobile =
    performanceUtils.responsiveUtils.useMediaQuery("(max-width: 768px)");
  const isTablet = performanceUtils.responsiveUtils.useMediaQuery(
    "(max-width: 1024px)",
  );

  // ===== THEME MANAGEMENT =====
  const applyTheme = useCallback((newTheme: ThemeConfig) => {
    ultimateDesignSystem.performance.preloadTheme(newTheme);
    ultimateDesignSystem.performance.storeTheme(newTheme);

    // Apply body classes
    document.body.className = `theme-${newTheme.mode} role-${newTheme.role}`;

    setLayoutState((prev) => ({ ...prev, theme: newTheme }));
  }, []);

  // ===== SIDEBAR HANDLERS =====
  const toggleSidebar = useCallback(() => {
    setLayoutState((prev) => ({
      ...prev,
      sidebarExpanded: !prev.sidebarExpanded,
      mobileMenuOpen: isMobile ? !prev.mobileMenuOpen : prev.mobileMenuOpen,
    }));
  }, [isMobile]);

  const closeMobileMenu = useCallback(() => {
    if (isMobile) {
      setLayoutState((prev) => ({
        ...prev,
        mobileMenuOpen: false,
      }));
    }
  }, [isMobile]);

  // ===== CONVERSATION WIDGET HANDLERS =====
  const toggleConversation = useCallback(() => {
    setLayoutState((prev) => ({
      ...prev,
      conversationMinimized: !prev.conversationMinimized,
    }));
  }, []);

  // ===== EFFECTS =====

  // Initialize theme on mount
  useEffect(() => {
    applyTheme(layoutState.theme);
    ultimateDesignSystem.performance.preloadCriticalResources();

    // Start color violation monitoring
    ultimateDesignSystem.colorViolationDetector.startMonitoring(
      layoutState.theme,
      2000,
    );

    return () => {
      performanceUtils.memoryManagement.cleanupEventListeners.cleanup();
      performanceUtils.memoryManagement.cleanupTimers.cleanup();
    };
  }, [layoutState.theme, applyTheme]);

  // Handle responsive changes
  useEffect(() => {
    if (isMobile) {
      setLayoutState((prev) => ({
        ...prev,
        sidebarExpanded: false,
      }));
    }
  }, [isMobile]);

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname, closeMobileMenu]);

  // Handle ESC key for mobile menu
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && layoutState.mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [layoutState.mobileMenuOpen, closeMobileMenu]);

  // ===== COMPUTED STYLES =====
  const layoutStyles = useMemo(() => {
    const sidebarWidth = layoutState.sidebarExpanded ? "256px" : "64px";

    return {
      container: {
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : `${sidebarWidth} 1fr`,
        gridTemplateRows: "auto 1fr",
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        transition:
          "grid-template-columns var(--duration-normal) var(--easing-default)",
      },

      sidebar: {
        gridColumn: 1,
        gridRow: isMobile ? "1 / -1" : "1 / -1",
        position: isMobile ? ("fixed" as const) : ("relative" as const),
        top: 0,
        left: 0,
        height: "100vh",
        width: isMobile ? "256px" : sidebarWidth,
        zIndex: isMobile ? 50 : "auto",
        transform: isMobile
          ? `translateX(${layoutState.mobileMenuOpen ? "0" : "-100%"})`
          : "none",
        transition: isMobile
          ? "transform var(--duration-normal) var(--easing-default)"
          : "width var(--duration-normal) var(--easing-default)",
      },

      header: {
        gridColumn: isMobile ? 1 : 2,
        gridRow: 1,
        position: "sticky" as const,
        top: 0,
        zIndex: 30,
        backgroundColor: "var(--surface-primary)",
        borderBottom: "1px solid var(--border-primary)",
      },

      main: {
        gridColumn: isMobile ? 1 : 2,
        gridRow: 2,
        backgroundColor: "var(--bg-primary)",
        overflow: "auto",
        padding: isMobile ? "var(--spacing-md)" : "var(--spacing-lg)",
        minHeight: "calc(100vh - 4rem)",
      },

      overlay: {
        position: "fixed" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 40,
        opacity: layoutState.mobileMenuOpen ? 1 : 0,
        visibility: layoutState.mobileMenuOpen
          ? ("visible" as const)
          : ("hidden" as const),
        transition: "opacity var(--duration-normal) var(--easing-default)",
      },
    };
  }, [layoutState.sidebarExpanded, layoutState.mobileMenuOpen, isMobile]);

  // ===== PERFORMANCE OPTIMIZATIONS =====
  const headerProps = useMemo(
    () => ({
      theme: layoutState.theme,
      onThemeChange: applyTheme,
      onToggleSidebar: toggleSidebar,
      sidebarExpanded: layoutState.sidebarExpanded,
      isMobile,
    }),
    [
      layoutState.theme,
      layoutState.sidebarExpanded,
      applyTheme,
      toggleSidebar,
      isMobile,
    ],
  );

  const sidebarProps = useMemo(
    () => ({
      expanded: layoutState.sidebarExpanded,
      onToggle: toggleSidebar,
      theme: layoutState.theme,
      isMobile,
    }),
    [layoutState.sidebarExpanded, layoutState.theme, toggleSidebar, isMobile],
  );

  const conversationProps = useMemo(
    () => ({
      minimized: layoutState.conversationMinimized,
      onToggle: toggleConversation,
      theme: layoutState.theme,
    }),
    [layoutState.conversationMinimized, toggleConversation, layoutState.theme],
  );

  // ===== RENDER =====
  return (
    <>
      <div style={layoutStyles.container} className="layout-container">
        {/* Sidebar */}
        <aside style={layoutStyles.sidebar} className="sidebar-container">
          <MemoizedSidebar {...sidebarProps} />
        </aside>

        {/* Header */}
        <header style={layoutStyles.header} className="header-container">
          <MemoizedHeader {...headerProps} />
        </header>

        {/* Main Content */}
        <main style={layoutStyles.main} className="main-container">
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="loading-skeleton w-full max-w-md h-8 mb-4"></div>
              </div>
            }
          >
            <Outlet />
          </React.Suspense>
        </main>

        {/* Mobile Overlay */}
        {isMobile && (
          <div
            style={layoutStyles.overlay}
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Conversation Widget */}
      <MemoizedConversationWidget {...conversationProps} />

      {/* Accessibility Announcements */}
      <div
        id="accessibility-announcements"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </>
  );
};

// ===== PERFORMANCE WRAPPER =====
const OptimizedLayoutWithErrorBoundary = React.memo(UltimateOptimizedLayout);

export default OptimizedLayoutWithErrorBoundary;
