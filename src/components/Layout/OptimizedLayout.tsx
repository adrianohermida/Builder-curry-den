/**
 * 🏗️ OPTIMIZED LAYOUT - LAYOUT SAAS 2025+ OTIMIZADO
 *
 * Layout moderno e otimizado com:
 * - Performance máxima (LCP < 2s)
 * - Design tokens aplicados
 * - Mobile-first responsivo
 * - Hierarquia visual clara
 * - Zero animações desnecessárias
 * - Acessibilidade completa
 */

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  createContext,
  useContext,
  Suspense,
} from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

// Design tokens
import designTokens, { createThemeCSS } from "@/design/tokens";

// Optimized components
import OptimizedTopbar from "./OptimizedTopbar";
import OptimizedSidebar from "./OptimizedSidebar";

// Theme system
import { useTheme } from "@/lib/themeSystem";

// Utils
import { useLocalStorage } from "@/hooks/useLocalStorage";
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
  collapseSidebar: () => void;
  expandSidebar: () => void;
}

// ===== CONTEXT =====
const LayoutContext = createContext<LayoutContextValue | null>(null);

export const useOptimizedLayout = (): LayoutContextValue => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useOptimizedLayout must be used within OptimizedLayout");
  }
  return context;
};

// ===== LOADING FALLBACK =====
const PageLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="text-center space-y-4">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        style={{ color: "var(--color-primary)" }}
      />
      <p className="text-sm text-gray-600">Carregando...</p>
    </div>
  </div>
);

// ===== LAYOUT HOOK =====
const useResponsiveLayout = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Throttled resize handler for performance
    let timeoutId: NodeJS.Timeout;
    const throttledResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 16); // ~60fps
    };

    window.addEventListener("resize", throttledResize);
    return () => {
      window.removeEventListener("resize", throttledResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;

  return { windowSize, isMobile, isTablet };
};

// ===== OPTIMIZED LAYOUT COMPONENT =====
const OptimizedLayout: React.FC = () => {
  const location = useLocation();
  const { config: themeConfig, colors, isAdminMode } = useTheme();
  const { windowSize, isMobile, isTablet } = useResponsiveLayout();

  // ===== STATE =====
  const [persistedState, setPersistedState] = useLocalStorage<
    Partial<LayoutState>
  >("lawdesk-optimized-layout", {});

  const layoutState = useMemo<LayoutState>(() => {
    return {
      sidebarOpen: isMobile ? false : (persistedState.sidebarOpen ?? true),
      sidebarCollapsed: isTablet
        ? true
        : (persistedState.sidebarCollapsed ?? false),
      isMobile,
      isTablet,
    };
  }, [isMobile, isTablet, persistedState]);

  // ===== ACTIONS =====
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

  const collapseSidebar = useCallback(() => {
    updateLayoutState({ sidebarCollapsed: true });
  }, [updateLayoutState]);

  const expandSidebar = useCallback(() => {
    updateLayoutState({ sidebarCollapsed: false });
  }, [updateLayoutState]);

  // ===== THEME CSS =====
  const themeCSS = useMemo(() => {
    return createThemeCSS(isAdminMode() ? "admin" : "client");
  }, [isAdminMode]);

  // Apply theme CSS to document
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(themeCSS).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }, [themeCSS]);

  // ===== CONTEXT VALUE =====
  const contextValue: LayoutContextValue = useMemo(
    () => ({
      layoutState,
      currentPath: location.pathname,
      toggleSidebar,
      closeSidebar,
      openSidebar,
      collapseSidebar,
      expandSidebar,
    }),
    [
      layoutState,
      location.pathname,
      toggleSidebar,
      closeSidebar,
      openSidebar,
      collapseSidebar,
      expandSidebar,
    ],
  );

  // ===== LAYOUT CLASSES =====
  const layoutClasses = useMemo(() => {
    const classes = [
      "min-h-screen",
      "bg-gray-50",
      isAdminMode() ? "admin-mode" : "client-mode",
      themeConfig.themeMode === "dark" ? "dark" : "light",
    ];

    return classes.join(" ");
  }, [isAdminMode, themeConfig.themeMode]);

  const mainClasses = useMemo(() => {
    const classes = [
      "min-h-screen",
      "transition-[margin] duration-200 ease-out",
    ];

    // Sidebar margin (sem animações de transform)
    if (layoutState.sidebarOpen && !layoutState.isMobile) {
      if (layoutState.sidebarCollapsed) {
        classes.push("lg:ml-16"); // 64px
      } else {
        classes.push("lg:ml-64"); // 256px
      }
    }

    // Topbar offset
    classes.push("pt-14"); // 56px

    return classes.join(" ");
  }, [layoutState]);

  return (
    <LayoutContext.Provider value={contextValue}>
      <div className={layoutClasses} style={themeCSS}>
        {/* Topbar - Always visible, sticky */}
        <OptimizedTopbar />

        {/* Sidebar - Fixed position */}
        <OptimizedSidebar />

        {/* Mobile Overlay */}
        {layoutState.isMobile && layoutState.sidebarOpen && (
          <div
            className="fixed inset-0 top-14 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Main Content Area */}
        <div className={mainClasses}>
          <main className="container mx-auto p-4 lg:p-6 xl:p-8 max-w-full">
            <Suspense fallback={<PageLoadingFallback />}>
              <Outlet />
            </Suspense>
          </main>
        </div>

        {/* Toast Notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: colors.background,
              border: `1px solid ${colors.border}`,
              color: colors.text,
            },
            duration: 4000,
          }}
        />

        {/* Performance Metrics (Development) */}
        {IS_DEVELOPMENT && (
          <div
            className="fixed bottom-4 left-4 z-50 p-3 rounded-lg border text-xs font-mono opacity-80 hover:opacity-100 transition-opacity"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.textMuted,
            }}
          >
            <div className="space-y-1">
              <div className="font-semibold">Layout Debug</div>
              <div>
                Screen: {windowSize.width}×{windowSize.height}
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
              <div>Mode: {isAdminMode() ? "Admin" : "Client"}</div>
              <div>Theme: {themeConfig.themeMode}</div>
            </div>
          </div>
        )}

        {/* Performance Observer (Development) */}
        {IS_DEVELOPMENT && <PerformanceObserver />}
      </div>
    </LayoutContext.Provider>
  );
};

// ===== PERFORMANCE OBSERVER =====
const PerformanceObserver: React.FC = () => {
  useEffect(() => {
    // Web Vitals monitoring
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      const observer = new window.PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            console.log("🎯 LCP:", entry.startTime.toFixed(2) + "ms");
          }
          if (entry.entryType === "first-contentful-paint") {
            console.log("🎨 FCP:", entry.startTime.toFixed(2) + "ms");
          }
          if (entry.entryType === "layout-shift") {
            console.log("📐 CLS:", entry.value.toFixed(4));
          }
        }
      });

      observer.observe({
        entryTypes: [
          "largest-contentful-paint",
          "first-contentful-paint",
          "layout-shift",
        ],
      });

      return () => observer.disconnect();
    }
  }, []);

  return null;
};

export default OptimizedLayout;
export { useOptimizedLayout };
