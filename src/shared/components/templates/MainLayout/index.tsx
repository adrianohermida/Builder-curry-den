/**
 * 🎯 MAIN LAYOUT TEMPLATE - Standardized Architecture
 *
 * Migrated to new architecture with:
 * - Standardized import paths
 * - Atomic design principles
 * - Centralized configuration
 * - Type safety improvements
 * - Clean separation of concerns
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

// Shared components
import { TopbarMain } from "../TopbarMain";
import { SidebarMain } from "../SidebarMain";

// Configuration and constants
import { STORAGE_KEYS } from "@/config/environment";
import { ROUTES } from "@/config/constants";

// Shared hooks
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";
import { useResponsive } from "@/shared/hooks/useResponsive";

// Development components
import { ResponsiveInspector } from "@/shared/components/organisms/ResponsiveInspector";

// Types
import type {
  LayoutConfig,
  ThemeConfig,
  BreadcrumbItem,
  NotificationItem,
  LayoutContextValue,
} from "./types";

// ===== LAYOUT CONTEXT =====
const LayoutContext = createContext<LayoutContextValue | null>(null);

export const useLayout = (): LayoutContextValue => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within MainLayout");
  }
  return context;
};

// ===== DEFAULT CONFIGURATIONS =====
const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  showSidebar: true,
  showTopbar: true,
  sidebarVariant: "expanded",
  topbarVariant: "standard",
  containerMaxWidth: "full",
  backgroundPattern: "none",
};

const DEFAULT_THEME_CONFIG: ThemeConfig = {
  mode: "light",
  primaryColor: "#3b82f6",
  accentColor: "#f59e0b",
  borderRadius: "md",
  fontScale: "base",
  highContrast: false,
  reducedMotion: false,
};

// ===== MAIN LAYOUT COMPONENT =====
const MainLayout: React.FC = () => {
  const location = useLocation();
  const { isMobile, isTablet } = useResponsive();

  // ===== PERSISTENT STATE =====
  const [layoutConfig, setLayoutConfig] = useLocalStorage<LayoutConfig>(
    STORAGE_KEYS.UI.SIDEBAR_COLLAPSED,
    DEFAULT_LAYOUT_CONFIG,
  );

  const [themeConfig, setThemeConfig] = useLocalStorage<ThemeConfig>(
    STORAGE_KEYS.UI.THEME,
    DEFAULT_THEME_CONFIG,
  );

  // ===== LOCAL STATE =====
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // ===== MOBILE SIDEBAR AUTO-COLLAPSE =====
  useEffect(() => {
    if (isMobile && layoutConfig.sidebarVariant === "expanded") {
      setLayoutConfig((prev) => ({
        ...prev,
        sidebarVariant: "hidden",
      }));
    } else if (!isMobile && layoutConfig.sidebarVariant === "hidden") {
      setLayoutConfig((prev) => ({
        ...prev,
        sidebarVariant: "expanded",
      }));
    }
  }, [isMobile, layoutConfig.sidebarVariant, setLayoutConfig]);

  // ===== THEME APPLICATION =====
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Remove existing theme classes
    root.classList.remove("light", "dark", "high-contrast");
    body.classList.remove("font-sm", "font-base", "font-lg");

    // Apply theme mode
    let effectiveMode = themeConfig.mode;
    if (themeConfig.mode === "system") {
      effectiveMode = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    root.classList.add(effectiveMode);
    root.setAttribute("data-theme", effectiveMode);

    // Apply high contrast
    if (themeConfig.highContrast) {
      root.classList.add("high-contrast");
    }

    // Apply font scale
    body.classList.add(`font-${themeConfig.fontScale}`);

    // Apply reduced motion
    if (themeConfig.reducedMotion) {
      root.style.setProperty("--motion-reduce", "1");
    } else {
      root.style.removeProperty("--motion-reduce");
    }

    // Apply custom colors
    root.style.setProperty("--primary-color", themeConfig.primaryColor);
    root.style.setProperty("--accent-color", themeConfig.accentColor);

    // Apply border radius
    const radiusMap = {
      none: "0",
      sm: "0.125rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
    };
    root.style.setProperty(
      "--border-radius",
      radiusMap[themeConfig.borderRadius],
    );
  }, [themeConfig]);

  // ===== SYSTEM THEME LISTENER =====
  useEffect(() => {
    if (themeConfig.mode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(mediaQuery.matches ? "dark" : "light");
        root.setAttribute("data-theme", mediaQuery.matches ? "dark" : "light");
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [themeConfig.mode]);

  // ===== BREADCRUMBS GENERATION =====
  const breadcrumbs = useMemo((): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const crumbs: BreadcrumbItem[] = [{ label: "Início", path: ROUTES.HOME }];

    const pathMap: Record<string, string> = {
      painel: "Painel de Controle",
      "crm-modern": "CRM Jurídico",
      configuracoes: "Configurações",
      "configuracao-armazenamento": "Armazenamento",
      agenda: "Agenda",
      publicacoes: "Publicações",
      atendimento: "Atendimento",
      financeiro: "Financeiro",
      contratos: "Contratos",
      tarefas: "Tarefas",
    };

    let currentPath = "";
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const label =
        pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      crumbs.push({ label, path: currentPath });
    });

    return crumbs;
  }, [location.pathname]);

  // ===== LAYOUT ACTIONS =====
  const updateLayoutConfig = useCallback(
    (updates: Partial<LayoutConfig>) => {
      setLayoutConfig((prev) => ({ ...prev, ...updates }));
    },
    [setLayoutConfig],
  );

  const updateThemeConfig = useCallback(
    (updates: Partial<ThemeConfig>) => {
      setThemeConfig((prev) => ({ ...prev, ...updates }));
    },
    [setThemeConfig],
  );

  const toggleSidebar = useCallback(() => {
    setLayoutConfig((prev) => ({
      ...prev,
      sidebarVariant:
        prev.sidebarVariant === "expanded"
          ? isMobile
            ? "hidden"
            : "collapsed"
          : "expanded",
    }));
  }, [isMobile, setLayoutConfig]);

  const toggleTheme = useCallback(() => {
    setThemeConfig((prev) => ({
      ...prev,
      mode: prev.mode === "light" ? "dark" : "light",
    }));
  }, [setThemeConfig]);

  const setSidebarVariant = useCallback(
    (variant: "expanded" | "collapsed" | "hidden") => {
      setLayoutConfig((prev) => ({ ...prev, sidebarVariant: variant }));
    },
    [setLayoutConfig],
  );

  // ===== MOCK DATA =====
  const mockNotifications: NotificationItem[] = [
    {
      id: "1",
      type: "info",
      title: "Nova atualização disponível",
      message: "Versão 2.1.0 com melhorias de performance",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
    },
    {
      id: "2",
      type: "warning",
      title: "Prazo se aproximando",
      message: "Audiência agendada para amanhã às 14h",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false,
    },
  ];

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
      setSidebarVariant,

      // Navigation State
      currentPath: location.pathname,
      breadcrumbs,
      notifications: mockNotifications,

      // Session & Permissions (mock data)
      userRole: "admin",
      permissions: ["read", "write", "admin"],
      sessionExpiry: new Date(Date.now() + 1000 * 60 * 60 * 8),
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
      setSidebarVariant,
      location.pathname,
      breadcrumbs,
    ],
  );

  // ===== COMPUTED CLASSES =====
  const containerClasses = useMemo(() => {
    const classes = ["min-h-screen", "bg-background", "text-foreground"];

    if (layoutConfig.backgroundPattern !== "none") {
      classes.push(`bg-pattern-${layoutConfig.backgroundPattern}`);
    }

    return classes.join(" ");
  }, [layoutConfig.backgroundPattern]);

  const mainClasses = useMemo(() => {
    const classes = ["flex-1", "overflow-auto"];

    // Add sidebar spacing
    if (layoutConfig.showSidebar) {
      if (layoutConfig.sidebarVariant === "expanded") {
        classes.push(isMobile ? "ml-0" : "ml-64");
      } else if (layoutConfig.sidebarVariant === "collapsed") {
        classes.push("ml-16");
      }
    }

    // Add topbar spacing
    if (layoutConfig.showTopbar) {
      classes.push("mt-16");
    }

    return classes.join(" ");
  }, [layoutConfig, isMobile]);

  return (
    <LayoutContext.Provider value={contextValue}>
      <div className={containerClasses}>
        {/* Sidebar */}
        {layoutConfig.showSidebar && (
          <SidebarMain
            variant={layoutConfig.sidebarVariant}
            onToggle={toggleSidebar}
            className="fixed left-0 top-0 z-40 h-full"
          />
        )}

        {/* Topbar */}
        {layoutConfig.showTopbar && (
          <TopbarMain
            variant={layoutConfig.topbarVariant}
            onToggleSidebar={toggleSidebar}
            onToggleTheme={toggleTheme}
            showSidebarToggle={layoutConfig.showSidebar}
            className="fixed right-0 top-0 z-30 w-full"
          />
        )}

        {/* Mobile Sidebar Overlay */}
        {isMobile && layoutConfig.sidebarVariant === "expanded" && (
          <div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className={mainClasses}>
          <div
            className={`container mx-auto p-4 md:p-6 lg:p-8 ${
              layoutConfig.containerMaxWidth !== "full"
                ? `max-w-${layoutConfig.containerMaxWidth}`
                : ""
            }`}
          >
            {/* Loading Overlay */}
            {isLoading && (
              <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-card p-6 rounded-lg shadow-lg">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Carregando...</p>
                </div>
              </div>
            )}

            {/* Page Content */}
            <Outlet />
          </div>
        </main>

        {/* Toast Notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              color: "hsl(var(--card-foreground))",
            },
          }}
        />

        {/* Responsive Inspector (Development Only) */}
        <ResponsiveInspector />

        {/* Debug Info (Development Only) */}
        {import.meta.env.DEV && (
          <div className="fixed bottom-4 left-4 z-50 bg-card border border-border rounded-lg p-2 text-xs font-mono opacity-50 hover:opacity-100 transition-opacity">
            <div>Mode: {themeConfig.mode}</div>
            <div>
              Device: {isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop"}
            </div>
            <div>Sidebar: {layoutConfig.sidebarVariant}</div>
          </div>
        )}
      </div>
    </LayoutContext.Provider>
  );
};

export { MainLayout, useLayout };
export type { LayoutContextValue, LayoutConfig, ThemeConfig };
