/**
 * 🎯 MODERN MAIN LAYOUT - LAYOUT PRINCIPAL MODERNO
 *
 * Layout atualizado baseado na imagem com:
 * - Sidebar compacto e minimalista
 * - Header moderno com temas funcionais
 * - Sistema de comunicação integrado
 * - Design responsivo otimizado
 * - Performance aprimorada
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

// Layout Components
import CompactMinimalSidebar from "./CompactMinimalSidebar";
import ModernHeader from "./ModernHeader";

// Communication Widget
import CommunicationWidget from "./CommunicationWidget";

// Hooks
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Theme utilities
import { applyThemeConfig } from "@/utils/themeUtils";

// Types
export interface ModernLayoutConfig {
  showSidebar: boolean;
  showHeader: boolean;
  sidebarCollapsed: boolean;
  communicationWidget: boolean;
  theme: "light" | "dark" | "system";
  primaryColor: string;
  reducedMotion: boolean;
}

export interface ModernLayoutContextValue {
  // Layout State
  layoutConfig: ModernLayoutConfig;
  isLoading: boolean;
  isMobile: boolean;
  isTablet: boolean;

  // Layout Actions
  updateLayoutConfig: (config: Partial<ModernLayoutConfig>) => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  toggleCommunicationWidget: () => void;

  // Navigation State
  currentPath: string;
}

// Context
const ModernLayoutContext = createContext<ModernLayoutContextValue | null>(
  null,
);

export const useModernLayout = (): ModernLayoutContextValue => {
  const context = useContext(ModernLayoutContext);
  if (!context) {
    throw new Error("useModernLayout must be used within ModernMainLayout");
  }
  return context;
};

// Default Configuration
const DEFAULT_LAYOUT_CONFIG: ModernLayoutConfig = {
  showSidebar: true,
  showHeader: true,
  sidebarCollapsed: false,
  communicationWidget: true,
  theme: "system",
  primaryColor: "blue",
  reducedMotion: false,
};

// Main Component
export const ModernMainLayout: React.FC = () => {
  const location = useLocation();

  // State Management
  const [layoutConfig, setLayoutConfig] = useLocalStorage<ModernLayoutConfig>(
    "lawdesk-modern-layout-config",
    DEFAULT_LAYOUT_CONFIG,
  );
  const [isLoading, setIsLoading] = useState(true);

  // Responsive Detection
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;

  // Window Resize Handler
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

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile && !layoutConfig.sidebarCollapsed) {
      setLayoutConfig((prev) => ({
        ...prev,
        sidebarCollapsed: true,
      }));
    } else if (!isMobile && layoutConfig.sidebarCollapsed) {
      setLayoutConfig((prev) => ({
        ...prev,
        sidebarCollapsed: false,
      }));
    }
  }, [isMobile, layoutConfig.sidebarCollapsed, setLayoutConfig]);

  // Theme Application
  useEffect(() => {
    applyThemeConfig({
      mode: layoutConfig.theme,
      primaryColor: layoutConfig.primaryColor,
      reducedMotion: layoutConfig.reducedMotion,
      highContrast: false, // pode ser adicionado depois
    });
  }, [
    layoutConfig.theme,
    layoutConfig.primaryColor,
    layoutConfig.reducedMotion,
  ]);

  // Loading Effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Layout Actions
  const updateLayoutConfig = useCallback(
    (updates: Partial<ModernLayoutConfig>) => {
      setLayoutConfig((prev) => ({ ...prev, ...updates }));
    },
    [setLayoutConfig],
  );

  const toggleSidebar = useCallback(() => {
    setLayoutConfig((prev) => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed,
    }));
  }, [setLayoutConfig]);

  const toggleTheme = useCallback(() => {
    const themes: Array<"light" | "dark" | "system"> = [
      "light",
      "dark",
      "system",
    ];
    const currentIndex = themes.indexOf(layoutConfig.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];

    setLayoutConfig((prev) => ({
      ...prev,
      theme: nextTheme,
    }));
  }, [layoutConfig.theme, setLayoutConfig]);

  const toggleCommunicationWidget = useCallback(() => {
    setLayoutConfig((prev) => ({
      ...prev,
      communicationWidget: !prev.communicationWidget,
    }));
  }, [setLayoutConfig]);

  // Context Value
  const contextValue: ModernLayoutContextValue = useMemo(
    () => ({
      // Layout State
      layoutConfig,
      isLoading,
      isMobile,
      isTablet,

      // Layout Actions
      updateLayoutConfig,
      toggleSidebar,
      toggleTheme,
      toggleCommunicationWidget,

      // Navigation State
      currentPath: location.pathname,
    }),
    [
      layoutConfig,
      isLoading,
      isMobile,
      isTablet,
      updateLayoutConfig,
      toggleSidebar,
      toggleTheme,
      toggleCommunicationWidget,
      location.pathname,
    ],
  );

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Lawdesk CRM
          </h3>
          <p className="text-muted-foreground">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <ModernLayoutContext.Provider value={contextValue}>
      <div className="flex h-screen bg-background text-foreground">
        {/* Sidebar */}
        {layoutConfig.showSidebar && (
          <CompactMinimalSidebar
            isCollapsed={layoutConfig.sidebarCollapsed}
            onToggle={toggleSidebar}
            className={`
              transition-all duration-300 ease-in-out
              ${isMobile ? "absolute z-30" : "relative"}
              ${layoutConfig.sidebarCollapsed ? "w-16" : "w-64"}
            `}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          {layoutConfig.showHeader && (
            <ModernHeader
              onToggleSidebar={toggleSidebar}
              showSidebarToggle={layoutConfig.showSidebar}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-accent/20">
            <div className="h-full">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobile &&
          layoutConfig.showSidebar &&
          !layoutConfig.sidebarCollapsed && (
            <div
              className="fixed inset-0 bg-black/50 z-20"
              onClick={toggleSidebar}
            />
          )}

        {/* Communication Widget */}
        {layoutConfig.communicationWidget && (
          <CommunicationWidget onClose={toggleCommunicationWidget} />
        )}

        {/* Toast Notifications */}
        <Toaster position="top-right" expand={false} richColors closeButton />
      </div>
    </ModernLayoutContext.Provider>
  );
};

export default ModernMainLayout;
