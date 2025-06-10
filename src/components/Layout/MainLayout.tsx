/**
 * 🎯 MAIN LAYOUT - LAYOUT PRINCIPAL CONSOLIDADO
 *
 * Layout pai padrão do sistema que centraliza:
 * - Estrutura base modular
 * - Gerenciamento de tema dark/light
 * - Responsividade completa
 * - Context de permissões e sessão
 * - Breadcrumbs e navegação
 * - Notificações e badges
 *
 * Substitui: UltimateOptimizedLayout e outros layouts duplicados
 * Modularidade: Carregamento dinâmico de layouts por tipo de rota
 */

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";

// Layout Components
import TopbarMain from "./TopbarMain";
import SidebarMain from "./SidebarMain";

// Design System
import { ultimateDesignSystem } from "@/lib/ultimateDesignSystem";
import { performanceUtils } from "@/lib/performanceUtils";

// Types
interface LayoutConfig {
  showSidebar: boolean;
  showTopbar: boolean;
  sidebarVariant: "expanded" | "collapsed" | "hidden";
  topbarVariant: "standard" | "compact" | "minimal";
  containerMaxWidth: "full" | "7xl" | "6xl" | "5xl";
  backgroundPattern: "none" | "dots" | "grid" | "subtle";
}

interface ThemeConfig {
  mode: "light" | "dark" | "system";
  primaryColor: string;
  accentColor: string;
  borderRadius: "none" | "sm" | "md" | "lg" | "xl";
  fontScale: "sm" | "base" | "lg";
}

interface LayoutContextValue {
  // Layout State
  layoutConfig: LayoutConfig;
  themeConfig: ThemeConfig;
  isLoading: boolean;
  isMobile: boolean;
  isTablet: boolean;

  // Layout Actions
  updateLayoutConfig: (config: Partial<LayoutConfig>) => void;
  updateThemeConfig: (config: Partial<ThemeConfig>) => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;

  // Navigation State
  currentPath: string;
  breadcrumbs: BreadcrumbItem[];
  notifications: NotificationItem[];

  // Session & Permissions
  userRole: "user" | "admin" | "manager";
  permissions: string[];
  sessionExpiry: Date | null;
}

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ComponentType<{ size?: number }>;
}

interface NotificationItem {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ===== LAYOUT CONTEXT =====
const LayoutContext = createContext<LayoutContextValue | null>(null);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within MainLayout");
  }
  return context;
};

// ===== ROUTE-BASED LAYOUT CONFIGURATIONS =====
const LAYOUT_CONFIGS: Record<string, Partial<LayoutConfig>> = {
  // Public routes (login, landing, etc.)
  "/login": {
    showSidebar: false,
    showTopbar: false,
    containerMaxWidth: "5xl",
    backgroundPattern: "subtle",
  },
  "/register": {
    showSidebar: false,
    showTopbar: false,
    containerMaxWidth: "5xl",
    backgroundPattern: "subtle",
  },
  "/onboarding": {
    showSidebar: false,
    showTopbar: true,
    topbarVariant: "minimal",
    containerMaxWidth: "6xl",
  },

  // Private routes (main app)
  "/painel": {
    showSidebar: true,
    showTopbar: true,
    sidebarVariant: "expanded",
    topbarVariant: "standard",
    containerMaxWidth: "full",
  },
  "/crm-modern": {
    showSidebar: true,
    showTopbar: true,
    sidebarVariant: "expanded",
    topbarVariant: "standard",
    containerMaxWidth: "full",
  },

  // Admin routes
  "/admin": {
    showSidebar: true,
    showTopbar: true,
    sidebarVariant: "expanded",
    topbarVariant: "compact",
    containerMaxWidth: "full",
    backgroundPattern: "dots",
  },
};

// ===== MAIN LAYOUT COMPONENT =====
const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ===== RESPONSIVE DETECTION =====
  const isMobile =
    performanceUtils.responsiveUtils.useMediaQuery("(max-width: 768px)");
  const isTablet = performanceUtils.responsiveUtils.useMediaQuery(
    "(max-width: 1024px)",
  );

  // ===== STATE MANAGEMENT =====
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>(() => ({
    showSidebar: true,
    showTopbar: true,
    sidebarVariant: isMobile ? "hidden" : "expanded",
    topbarVariant: "standard",
    containerMaxWidth: "full",
    backgroundPattern: "none",
  }));

  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => {
    const stored = ultimateDesignSystem.performance.getStoredTheme();
    return {
      mode: stored?.mode || "system",
      primaryColor: stored?.primaryColor || "#3b82f6",
      accentColor: stored?.accentColor || "#10b981",
      borderRadius: "md",
      fontScale: "base",
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // ===== DERIVED STATE =====
  const currentPath = location.pathname;

  const breadcrumbs = useMemo(() => {
    const pathSegments = currentPath.split("/").filter(Boolean);
    const breadcrumbItems: BreadcrumbItem[] = [{ label: "Home", path: "/" }];

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      breadcrumbItems.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        path: isLast ? undefined : currentPath,
      });
    });

    return breadcrumbItems;
  }, [currentPath]);

  // Mock user data - replace with real auth
  const userRole = "user" as const;
  const permissions = ["read", "write"];
  const sessionExpiry = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours

  // ===== LAYOUT ACTIONS =====
  const updateLayoutConfig = useCallback((config: Partial<LayoutConfig>) => {
    setLayoutConfig((prev) => ({ ...prev, ...config }));
  }, []);

  const updateThemeConfig = useCallback((config: Partial<ThemeConfig>) => {
    setThemeConfig((prev) => {
      const newConfig = { ...prev, ...config };
      ultimateDesignSystem.performance.storeTheme(newConfig);
      return newConfig;
    });
  }, []);

  const toggleSidebar = useCallback(() => {
    setLayoutConfig((prev) => ({
      ...prev,
      sidebarVariant:
        prev.sidebarVariant === "expanded"
          ? "collapsed"
          : prev.sidebarVariant === "collapsed"
            ? "hidden"
            : "expanded",
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    updateThemeConfig({
      mode: themeConfig.mode === "light" ? "dark" : "light",
    });
  }, [themeConfig.mode, updateThemeConfig]);

  // ===== ROUTE-BASED LAYOUT UPDATES =====
  useEffect(() => {
    const routeConfig = LAYOUT_CONFIGS[currentPath] || {};

    // Apply route-specific layout configuration
    setLayoutConfig((prev) => ({
      ...prev,
      ...routeConfig,
      // Override for mobile
      sidebarVariant: isMobile
        ? "hidden"
        : routeConfig.sidebarVariant || prev.sidebarVariant,
    }));
  }, [currentPath, isMobile]);

  // ===== THEME APPLICATION =====
  useEffect(() => {
    const applyTheme = () => {
      // Apply CSS custom properties
      const root = document.documentElement;
      const mode =
        themeConfig.mode === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : themeConfig.mode;

      root.setAttribute("data-theme", mode);
      root.style.setProperty("--primary-color", themeConfig.primaryColor);
      root.style.setProperty("--accent-color", themeConfig.accentColor);

      // Apply body classes
      document.body.className = `theme-${mode} font-scale-${themeConfig.fontScale} radius-${themeConfig.borderRadius}`;

      // Store theme preference
      ultimateDesignSystem.performance.storeTheme(themeConfig);
    };

    applyTheme();

    // Listen for system theme changes
    if (themeConfig.mode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", applyTheme);
      return () => mediaQuery.removeEventListener("change", applyTheme);
    }
  }, [themeConfig]);

  // ===== PERFORMANCE OPTIMIZATIONS =====
  useEffect(() => {
    // Preload critical resources
    performanceUtils.loadingPerformance.preloadCriticalResources();

    // Initialize performance monitoring
    const cleanup = performanceUtils.componentOptimization.measureRenderTime(
      "MainLayout",
      () => {
        // Performance measurement callback
      },
    );

    return cleanup;
  }, []);

  // ===== CONTEXT VALUE =====
  const contextValue: LayoutContextValue = useMemo(
    () => ({
      // Layout State
      layoutConfig,
      themeConfig,
      isLoading,
      isMobile,
      isTablet,

      // Layout Actions
      updateLayoutConfig,
      updateThemeConfig,
      toggleSidebar,
      toggleTheme,

      // Navigation State
      currentPath,
      breadcrumbs,
      notifications,

      // Session & Permissions
      userRole,
      permissions,
      sessionExpiry,
    }),
    [
      layoutConfig,
      themeConfig,
      isLoading,
      isMobile,
      isTablet,
      updateLayoutConfig,
      updateThemeConfig,
      toggleSidebar,
      toggleTheme,
      currentPath,
      breadcrumbs,
      notifications,
      userRole,
      permissions,
      sessionExpiry,
    ],
  );

  // ===== RENDER LOGIC =====
  const renderLayout = () => {
    const {
      showSidebar,
      showTopbar,
      sidebarVariant,
      containerMaxWidth,
      backgroundPattern,
    } = layoutConfig;

    return (
      <div
        className={`
          min-h-screen transition-colors duration-200
          ${backgroundPattern === "dots" ? "bg-dots-pattern" : ""}
          ${backgroundPattern === "grid" ? "bg-grid-pattern" : ""}
          ${backgroundPattern === "subtle" ? "bg-subtle-pattern" : ""}
        `}
        style={{
          backgroundColor: "var(--surface-primary)",
          color: "var(--text-primary)",
        }}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="flex items-center space-x-3 rounded-lg bg-white px-6 py-4 shadow-lg dark:bg-gray-800">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span className="text-sm font-medium">Carregando...</span>
            </div>
          </div>
        )}

        {/* Sidebar */}
        {showSidebar && sidebarVariant !== "hidden" && (
          <SidebarMain
            variant={sidebarVariant}
            onToggle={toggleSidebar}
            className={`
              ${isMobile ? "fixed inset-y-0 left-0 z-40" : ""}
              ${sidebarVariant === "collapsed" ? "w-16" : "w-64"}
              transition-all duration-300 ease-in-out
            `}
          />
        )}

        {/* Mobile Sidebar Overlay */}
        {isMobile && showSidebar && sidebarVariant !== "hidden" && (
          <div
            className="fixed inset-0 z-30 bg-black/50"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content Area */}
        <div
          className={`
            flex min-h-screen flex-col transition-all duration-300
            ${showSidebar && sidebarVariant === "expanded" && !isMobile ? "ml-64" : ""}
            ${showSidebar && sidebarVariant === "collapsed" && !isMobile ? "ml-16" : ""}
          `}
        >
          {/* Top Bar */}
          {showTopbar && (
            <TopbarMain
              variant={layoutConfig.topbarVariant}
              onToggleSidebar={toggleSidebar}
              onToggleTheme={toggleTheme}
              showSidebarToggle={showSidebar}
              className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur-md dark:bg-gray-900/80"
            />
          )}

          {/* Page Content */}
          <main
            className={`
              flex-1 transition-all duration-200
              ${containerMaxWidth === "full" ? "" : `mx-auto max-w-${containerMaxWidth}`}
            `}
          >
            <Outlet />
          </main>
        </div>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            className:
              "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
            duration: 4000,
          }}
        />
      </div>
    );
  };

  return (
    <LayoutContext.Provider value={contextValue}>
      {renderLayout()}
    </LayoutContext.Provider>
  );
};

export default React.memo(MainLayout);

// ===== UTILITY EXPORTS =====
export {
  LayoutContext,
  type LayoutContextValue,
  type LayoutConfig,
  type ThemeConfig,
};
