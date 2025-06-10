/**
 * 🎨 LAWDESK HARMONIOUS LAYOUT - DESIGN SYSTEM REFINADO
 *
 * Layout com sistema de design harmônico:
 * - Cores tom sobre tom perfeitamente balanceadas
 * - Temas Clear, Dark e Color funcionais
 * - Experiência visual excepcional
 * - Zero cores proibidas
 */

import React, { useEffect, useState, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

// Components
import LawdeskHarmoniousSidebar from "./LawdeskHarmoniousSidebar";
import LawdeskHarmoniousHeader from "./LawdeskHarmoniousHeader";
import LawdeskHarmoniousChat from "../Chat/LawdeskHarmoniousChat";

// Design system
import {
  lawdeskDesignSystem,
  type ThemeMode,
  type UserMode,
} from "@/lib/lawdeskDesignSystem";

interface LawdeskHarmoniousLayoutProps {
  children?: React.ReactNode;
}

export const LawdeskHarmoniousLayout: React.FC<
  LawdeskHarmoniousLayoutProps
> = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>("clear");
  const [mode, setMode] = useState<UserMode>("client");
  const layoutRef = useRef<HTMLDivElement>(null);

  // Initialize design system
  useEffect(() => {
    // Get saved preferences
    const savedTheme = localStorage.getItem("lawdesk-theme") as ThemeMode;
    const savedMode = localStorage.getItem("lawdesk-mode") as UserMode;

    const initialTheme =
      savedTheme && ["clear", "dark", "color"].includes(savedTheme)
        ? savedTheme
        : "clear";
    const initialMode =
      savedMode && ["client", "admin"].includes(savedMode)
        ? savedMode
        : "client";

    setTheme(initialTheme);
    setMode(initialMode);

    // Apply design system theme
    lawdeskDesignSystem.applyTheme(initialTheme, initialMode);

    // Apply body classes for theme identification
    applyBodyClasses(initialTheme, initialMode);

    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, []);

  const applyBodyClasses = (themeMode: ThemeMode, userMode: UserMode) => {
    const body = document.body;
    const html = document.documentElement;

    // Remove all theme classes
    body.classList.remove(
      "theme-clear",
      "theme-dark",
      "theme-color",
      "mode-client",
      "mode-admin",
    );
    html.classList.remove(
      "theme-clear",
      "theme-dark",
      "theme-color",
      "mode-client",
      "mode-admin",
    );

    // Add new classes
    body.classList.add(`theme-${themeMode}`, `mode-${userMode}`);
    html.classList.add(`theme-${themeMode}`, `mode-${userMode}`);

    // Add data attributes for CSS targeting
    html.setAttribute("data-theme", themeMode);
    html.setAttribute("data-mode", userMode);
  };

  // Handle theme change
  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem("lawdesk-theme", newTheme);
    lawdeskDesignSystem.applyTheme(newTheme, mode);
    applyBodyClasses(newTheme, mode);
  };

  // Handle mode change
  const handleModeChange = (newMode: UserMode) => {
    setMode(newMode);
    localStorage.setItem("lawdesk-mode", newMode);
    lawdeskDesignSystem.applyTheme(theme, newMode);
    applyBodyClasses(theme, newMode);
  };

  // Handle route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center ds-surface-primary">
        <div className="text-center">
          <div
            className={cn(
              "w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4",
              mode === "admin" ? "border-red-600" : "border-blue-600",
            )}
            style={{
              borderColor: "var(--primary-500)",
              borderTopColor: "transparent",
            }}
          />
          <p className="text-sm font-medium ds-text-primary">Lawdesk</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={layoutRef}
      className={cn(
        "h-screen flex overflow-hidden ds-surface-primary transition-all duration-300",
        `theme-${theme}`,
        `mode-${mode}`,
      )}
      data-theme={theme}
      data-mode={mode}
    >
      {/* Harmonious Sidebar */}
      <LawdeskHarmoniousSidebar mode={mode} theme={theme} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Harmonious Header */}
        <LawdeskHarmoniousHeader
          mode={mode}
          onModeChange={handleModeChange}
          theme={theme}
          onThemeChange={handleThemeChange}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-auto ds-surface-primary modern-scroll">
          <div className="h-full fade-in">{children || <Outlet />}</div>
        </main>
      </div>

      {/* Harmonious Chat Widget */}
      <LawdeskHarmoniousChat mode={mode} theme={theme} />

      {/* Theme Application Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Apply immediate theme corrections
            (function() {
              const style = document.createElement('style');
              style.textContent = \`
                /* Immediate color overrides */
                *[style*="background-color: rgb(255, 255, 0)"],
                *[style*="color: rgb(193, 150, 108)"] {
                  background-color: var(--primary-500) !important;
                  color: var(--text-accent) !important;
                }
              \`;
              document.head.appendChild(style);
            })();
          `,
        }}
      />
    </div>
  );
};

export default LawdeskHarmoniousLayout;
