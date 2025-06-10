/**
 * 🏗️ CORRECTED LAYOUT - LAYOUT TOTALMENTE CORRIGIDO
 *
 * Layout responsivo e acessível com:
 * - Mobile-first design
 * - Cores sólidas (sem transparências)
 * - Data-theme integrado
 * - Responsividade perfeita
 * - Alto contraste
 * - Touch-friendly
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

// Corrected components
import CorrectedTopbar from "./CorrectedTopbar";
import CorrectedSidebar from "./CorrectedSidebar";

// Theme system
import { useCorrectedTheme } from "@/lib/correctedThemeSystem";

// Utils
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { IS_DEVELOPMENT } from "@/lib/env";

// ===== TYPES =====
interface LayoutState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

interface ResponsiveBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

interface LayoutContextValue {
  layoutState: LayoutState;
  currentPath: string;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;
  breakpoints: ResponsiveBreakpoints;
}

// ===== CONTEXT =====
const LayoutContext = createContext<LayoutContextValue | null>(null);

export const useCorrectedLayout = (): LayoutContextValue => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useCorrectedLayout must be used within CorrectedLayout");
  }
  return context;
};

// ===== BREAKPOINTS =====
const BREAKPOINTS: ResponsiveBreakpoints = {
  mobile: 640, // sm
  tablet: 768, // md
  desktop: 1024, // lg
  wide: 1280, // xl
};

// ===== RESPONSIVE HOOK =====
const useResponsive = () => {
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

    // Throttled resize para performance
    let timeoutId: NodeJS.Timeout;
    const throttledResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 16); // ~60fps
    };

    window.addEventListener("resize", throttledResize, { passive: true });
    return () => {
      window.removeEventListener("resize", throttledResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const isMobile = windowSize.width < BREAKPOINTS.tablet;
  const isTablet =
    windowSize.width >= BREAKPOINTS.tablet &&
    windowSize.width < BREAKPOINTS.desktop;
  const isDesktop = windowSize.width >= BREAKPOINTS.desktop;

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    breakpoint: isMobile
      ? "mobile"
      : isTablet
        ? "tablet"
        : isDesktop
          ? "desktop"
          : "wide",
  };
};

// ===== LOADING FALLBACK =====
const PageLoadingFallback = () => {
  const { colors } = useCorrectedTheme();

  return (
    <div
      className="flex items-center justify-center min-h-[50vh]"
      style={{ backgroundColor: colors.background, color: colors.foreground }}
    >
      <div className="text-center space-y-4">
        <div
          className="inline-block h-8 w-8 rounded-full border-4 border-solid border-current border-r-transparent animate-spin"
          style={{ borderColor: colors.muted, borderRightColor: "transparent" }}
        >
          <div
            className="h-full w-full rounded-full border-t-4"
            style={{ borderTopColor: colors.primary }}
          />
        </div>
        <p className="text-sm" style={{ color: colors.mutedForeground }}>
          Carregando...
        </p>
      </div>
    </div>
  );
};

// ===== CORRECTED LAYOUT COMPONENT =====
const CorrectedLayout: React.FC = () => {
  const location = useLocation();
  const { colors, combinedTheme, isAdminMode } = useCorrectedTheme();
  const { windowSize, isMobile, isTablet, isDesktop } = useResponsive();

  // ===== STATE =====
  const [persistedState, setPersistedState] = useLocalStorage<
    Partial<LayoutState>
  >("lawdesk-corrected-layout", {});

  const layoutState = useMemo<LayoutState>(() => {
    // Comportamento responsivo automático
    const defaultSidebarOpen = !isMobile;
    const defaultSidebarCollapsed = isTablet && !isMobile;

    return {
      sidebarOpen: persistedState.sidebarOpen ?? defaultSidebarOpen,
      sidebarCollapsed:
        persistedState.sidebarCollapsed ?? defaultSidebarCollapsed,
      isMobile,
      isTablet,
      isDesktop,
    };
  }, [isMobile, isTablet, isDesktop, persistedState]);

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
      breakpoints: BREAKPOINTS,
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

  // ===== CLASSES COMPUTADAS =====
  const layoutClasses = useMemo(() => {
    return [
      "min-h-screen",
      "transition-colors duration-200",
      // Aplica cores através de data-theme, não classes
    ].join(" ");
  }, []);

  const mainClasses = useMemo(() => {
    const classes = [
      "min-h-screen",
      "transition-[margin-left] duration-200 ease-out",
      "pt-14", // Altura do topbar (56px)
    ];

    // Margin para sidebar sem usar transform
    if (layoutState.sidebarOpen && !layoutState.isMobile) {
      if (layoutState.sidebarCollapsed) {
        classes.push("lg:ml-16"); // 64px
      } else {
        classes.push("lg:ml-64"); // 256px
      }
    }

    return classes.join(" ");
  }, [layoutState]);

  // ===== STYLES INLINE PARA CORES =====
  const layoutStyle = useMemo(
    () => ({
      backgroundColor: colors.background,
      color: colors.foreground,
    }),
    [colors],
  );

  return (
    <LayoutContext.Provider value={contextValue}>
      <div
        className={layoutClasses}
        style={layoutStyle}
        data-theme={combinedTheme}
      >
        {/* Topbar - Sempre visível e sticky */}
        <CorrectedTopbar />

        {/* Sidebar - Fixo com comportamento responsivo */}
        <CorrectedSidebar />

        {/* Mobile Overlay - Sem backdrop-blur para performance */}
        {layoutState.isMobile && layoutState.sidebarOpen && (
          <div
            className="fixed inset-0 top-14 z-30 lg:hidden"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Main Content Area */}
        <div className={mainClasses}>
          <main
            className="container mx-auto p-4 lg:p-6 xl:p-8 max-w-full"
            style={{ backgroundColor: colors.background }}
          >
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
              backgroundColor: colors.card,
              border: `1px solid ${colors.border}`,
              color: colors.cardForeground,
            },
            duration: 4000,
          }}
        />

        {/* Debug Info (Development) */}
        {IS_DEVELOPMENT && (
          <div
            className="fixed bottom-4 left-4 z-50 p-3 rounded-lg border text-xs font-mono opacity-80 hover:opacity-100 transition-opacity max-w-xs"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.mutedForeground,
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
                  ? "📱 Mobile"
                  : layoutState.isTablet
                    ? "📱 Tablet"
                    : "🖥️ Desktop"}
              </div>
              <div>
                Sidebar:{" "}
                {layoutState.sidebarOpen
                  ? layoutState.sidebarCollapsed
                    ? "Collapsed"
                    : "Expanded"
                  : "Hidden"}
              </div>
              <div>Mode: {isAdminMode ? "🔴 Admin" : "🔵 Client"}</div>
              <div>Theme: {combinedTheme}</div>
              <div className="text-xs opacity-75">
                Path: {location.pathname}
              </div>
            </div>
          </div>
        )}

        {/* Accessibility Helper */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Tema atual: {combinedTheme}, Modo:{" "}
          {isAdminMode ? "Administrador" : "Cliente"}
        </div>
      </div>
    </LayoutContext.Provider>
  );
};

export default CorrectedLayout;
export { useCorrectedLayout, type LayoutState, type ResponsiveBreakpoints };
