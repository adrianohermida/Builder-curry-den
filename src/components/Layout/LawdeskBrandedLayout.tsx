/**
 * 🎨 LAWDESK BRANDED LAYOUT - SISTEMA DE TEMAS REFINADO
 *
 * Layout com branding refinado:
 * - Sobretom azul no modo clear
 * - Sobretom de cor principal no modo colorido
 * - Sobretom vermelho no modo admin
 * - Zero amarelo e laranja
 * - UX otimizada e responsividade completa
 */

import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

// Components
import LawdeskBrandedSidebar from "./LawdeskBrandedSidebar";
import LawdeskBrandedHeader from "./LawdeskBrandedHeader";
import LawdeskConversationWidget from "../Chat/LawdeskConversationWidget";

interface LawdeskBrandedLayoutProps {
  children?: React.ReactNode;
}

type ThemeMode = "light" | "dark" | "color";
type UserMode = "client" | "admin";

export const LawdeskBrandedLayout: React.FC<LawdeskBrandedLayoutProps> = ({
  children,
}) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [mode, setMode] = useState<UserMode>("client");

  // Initialize system
  useEffect(() => {
    // Get saved preferences
    const savedTheme = localStorage.getItem("lawdesk-theme") as ThemeMode;
    const savedMode = localStorage.getItem("lawdesk-mode") as UserMode;

    if (savedTheme && ["light", "dark", "color"].includes(savedTheme)) {
      setTheme(savedTheme);
    }

    if (savedMode && ["client", "admin"].includes(savedMode)) {
      setMode(savedMode);
    }

    // Apply theme to document
    applyLawdeskTheme(savedTheme || "light", savedMode || "client");

    setIsLoading(false);
  }, []);

  // Apply Lawdesk branding theme
  const applyLawdeskTheme = (newTheme: ThemeMode, newMode: UserMode) => {
    const root = document.documentElement;
    const body = document.body;

    // Remove all theme classes
    root.classList.remove(
      "dark",
      "color-theme",
      "admin-theme",
      "lawdesk-light",
      "lawdesk-dark",
      "lawdesk-color",
    );
    body.classList.remove("theme-light", "theme-dark", "theme-color");

    // Apply new theme
    if (newTheme === "dark") {
      root.classList.add("dark", "lawdesk-dark");
      body.classList.add("theme-dark");
    } else if (newTheme === "color") {
      root.classList.add("color-theme", "lawdesk-color");
      body.classList.add("theme-color");
    } else {
      root.classList.add("lawdesk-light");
      body.classList.add("theme-light");
    }

    // Apply mode
    if (newMode === "admin") {
      root.classList.add("admin-theme");
    }

    // Add refined Lawdesk branding CSS
    if (!document.getElementById("lawdesk-branding-styles")) {
      const style = document.createElement("style");
      style.id = "lawdesk-branding-styles";
      style.textContent = `
        /* =================================
           LAWDESK BRANDING SYSTEM 2025
           ================================= */

        /* Light Theme - Sobretom Azul Lawdesk */
        .lawdesk-light {
          --primary: 59 130 246; /* blue-500 - Azul Lawdesk */
          --primary-foreground: 255 255 255;
          --secondary: 239 246 255; /* blue-50 - Sobretom azul suave */
          --secondary-foreground: 30 64 175; /* blue-800 */
          --background: 255 255 255;
          --foreground: 30 41 59; /* slate-800 */
          --muted: 248 250 252; /* slate-50 */
          --muted-foreground: 71 85 105; /* slate-600 */
          --border: 219 234 254; /* blue-100 - Bordas com sobretom azul */
          --input: 219 234 254; /* blue-100 */
          --ring: 59 130 246; /* blue-500 */
          --accent: 239 246 255; /* blue-50 */
          --accent-foreground: 30 64 175; /* blue-800 */
          --success: 34 197 94; /* green-500 */
          --success-foreground: 255 255 255;
          --destructive: 239 68 68; /* red-500 */
          --destructive-foreground: 255 255 255;
          --warning: 59 130 246; /* blue-500 - Sem laranja/amarelo */
          --warning-foreground: 255 255 255;
          --info: 59 130 246; /* blue-500 */
          --info-foreground: 255 255 255;
        }

        /* Dark Theme - Sobretom Azul Escuro */
        .lawdesk-dark {
          --primary: 96 165 250; /* blue-400 */
          --primary-foreground: 255 255 255;
          --secondary: 30 41 59; /* slate-800 */
          --secondary-foreground: 148 163 184; /* slate-400 */
          --background: 15 23 42; /* slate-900 */
          --foreground: 248 250 252; /* slate-50 */
          --muted: 30 41 59; /* slate-800 */
          --muted-foreground: 100 116 139; /* slate-500 */
          --border: 51 65 85; /* slate-700 */
          --input: 51 65 85; /* slate-700 */
          --ring: 96 165 250; /* blue-400 */
          --accent: 30 41 59; /* slate-800 */
          --accent-foreground: 148 163 184; /* slate-400 */
          --success: 34 197 94; /* green-500 */
          --success-foreground: 255 255 255;
          --destructive: 239 68 68; /* red-500 */
          --destructive-foreground: 255 255 255;
          --warning: 96 165 250; /* blue-400 */
          --warning-foreground: 255 255 255;
          --info: 96 165 250; /* blue-400 */
          --info-foreground: 255 255 255;
        }

        /* Color Theme - Sobretom da Cor Principal (Violeta/Índigo) */
        .lawdesk-color {
          --primary: 124 58 237; /* violet-600 */
          --primary-foreground: 255 255 255;
          --secondary: 245 243 255; /* violet-50 */
          --secondary-foreground: 91 33 182; /* violet-800 */
          --background: 255 255 255;
          --foreground: 30 41 59; /* slate-800 */
          --muted: 248 250 252; /* slate-50 */
          --muted-foreground: 71 85 105; /* slate-600 */
          --border: 221 214 254; /* violet-200 */
          --input: 221 214 254; /* violet-200 */
          --ring: 124 58 237; /* violet-600 */
          --accent: 245 243 255; /* violet-50 */
          --accent-foreground: 91 33 182; /* violet-800 */
          --success: 34 197 94; /* green-500 */
          --success-foreground: 255 255 255;
          --destructive: 239 68 68; /* red-500 */
          --destructive-foreground: 255 255 255;
          --warning: 124 58 237; /* violet-600 */
          --warning-foreground: 255 255 255;
          --info: 124 58 237; /* violet-600 */
          --info-foreground: 255 255 255;
        }

        /* Admin Theme Override - Sobretom Vermelho */
        .admin-theme {
          --primary: 239 68 68; /* red-500 para admin */
          --ring: 239 68 68;
          --accent: 254 242 242; /* red-50 */
          --accent-foreground: 185 28 28; /* red-700 */
          --border: 252 165 165; /* red-300 */
          --warning: 239 68 68; /* red-500 para admin */
        }

        .admin-theme.lawdesk-light {
          --secondary: 254 242 242; /* red-50 - Sobretom vermelho suave */
          --border: 252 165 165; /* red-300 */
        }

        .admin-theme.lawdesk-dark {
          --secondary: 127 29 29; /* red-900 */
          --border: 185 28 28; /* red-700 */
        }

        .admin-theme.lawdesk-color {
          --secondary: 254 242 242; /* red-50 */
          --border: 252 165 165; /* red-300 */
        }

        /* =================================
           ELIMINAÇÃO COMPLETA AMARELO/LARANJA
           ================================= */

        /* Remove ALL Yellow/Orange Colors */
        .bg-yellow-50, .bg-yellow-100, .bg-yellow-200, .bg-yellow-300, 
        .bg-yellow-400, .bg-yellow-500, .bg-yellow-600, .bg-yellow-700, 
        .bg-yellow-800, .bg-yellow-900, .bg-yellow-950,
        .bg-orange-50, .bg-orange-100, .bg-orange-200, .bg-orange-300,
        .bg-orange-400, .bg-orange-500, .bg-orange-600, .bg-orange-700,
        .bg-orange-800, .bg-orange-900, .bg-orange-950,
        [style*="background-color: rgb(255, 255, 0)"],
        [style*="background-color: rgb(249, 115, 22)"],
        [style*="background-color: #FFFF00"],
        [style*="background-color: #f97316"],
        [style*="background: rgb(255, 255, 0)"],
        [style*="background: rgb(249, 115, 22)"] {
          background-color: rgb(59 130 246) !important; /* blue-500 Lawdesk */
        }

        .admin-theme .bg-yellow-50, .admin-theme .bg-yellow-100, 
        .admin-theme .bg-orange-50, .admin-theme .bg-orange-100,
        .admin-theme [style*="background-color: rgb(255, 255, 0)"],
        .admin-theme [style*="background-color: rgb(249, 115, 22)"] {
          background-color: rgb(239 68 68) !important; /* red-500 para admin */
        }

        .lawdesk-color .bg-yellow-50, .lawdesk-color .bg-yellow-100,
        .lawdesk-color .bg-orange-50, .lawdesk-color .bg-orange-100,
        .lawdesk-color [style*="background-color: rgb(255, 255, 0)"],
        .lawdesk-color [style*="background-color: rgb(249, 115, 22)"] {
          background-color: rgb(124 58 237) !important; /* violet-600 para color */
        }

        /* Text Colors */
        .text-yellow-50, .text-yellow-100, .text-yellow-200, .text-yellow-300,
        .text-yellow-400, .text-yellow-500, .text-yellow-600, .text-yellow-700,
        .text-yellow-800, .text-yellow-900, .text-yellow-950,
        .text-orange-50, .text-orange-100, .text-orange-200, .text-orange-300,
        .text-orange-400, .text-orange-500, .text-orange-600, .text-orange-700,
        .text-orange-800, .text-orange-900, .text-orange-950,
        [style*="color: rgb(255, 255, 0)"],
        [style*="color: rgb(249, 115, 22)"],
        [style*="color: #FFFF00"],
        [style*="color: #f97316"] {
          color: rgb(30 64 175) !important; /* blue-800 */
        }

        .admin-theme .text-yellow-50, .admin-theme .text-orange-50,
        .admin-theme [style*="color: rgb(255, 255, 0)"],
        .admin-theme [style*="color: rgb(249, 115, 22)"] {
          color: rgb(185 28 28) !important; /* red-700 para admin */
        }

        /* Border Colors */
        .border-yellow-50, .border-yellow-100, .border-yellow-200,
        .border-orange-50, .border-orange-100, .border-orange-200,
        [style*="border-color: rgb(255, 255, 0)"],
        [style*="border-color: rgb(249, 115, 22)"] {
          border-color: rgb(219 234 254) !important; /* blue-100 */
        }

        .admin-theme .border-yellow-50, .admin-theme .border-orange-50,
        .admin-theme [style*="border-color: rgb(255, 255, 0)"],
        .admin-theme [style*="border-color: rgb(249, 115, 22)"] {
          border-color: rgb(252 165 165) !important; /* red-300 para admin */
        }

        /* =================================
           LAWDESK UX ENHANCEMENTS
           ================================= */

        /* Smooth transitions */
        * {
          transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
          transition-duration: 200ms;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Enhanced focus states */
        .focus-visible:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgb(var(--ring));
        }

        /* Modern scrollbars */
        .modern-scroll::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .modern-scroll::-webkit-scrollbar-track {
          background: rgb(var(--muted));
          border-radius: 3px;
        }

        .modern-scroll::-webkit-scrollbar-thumb {
          background: rgb(var(--muted-foreground) / 0.3);
          border-radius: 3px;
        }

        .modern-scroll::-webkit-scrollbar-thumb:hover {
          background: rgb(var(--muted-foreground) / 0.5);
        }

        /* Enhanced shadows */
        .elevated-1 {
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        }

        .elevated-2 {
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06);
        }

        .elevated-3 {
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05);
        }

        /* Theme-specific backgrounds */
        .theme-bg {
          background: rgb(var(--background));
        }

        .theme-surface {
          background: rgb(var(--secondary));
        }

        .theme-accent {
          background: rgb(var(--accent));
        }

        /* Responsive utilities */
        @media (max-width: 768px) {
          .mobile-hidden {
            display: none;
          }
          
          .mobile-full {
            width: 100%;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .elevated-1, .elevated-2, .elevated-3 {
            border: 1px solid rgb(var(--border));
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Runtime observer for dynamic content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              replaceColorsInElement(element);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Store observer for cleanup
    (window as any).lawdeskObserver = observer;
  };

  // Replace colors in element
  const replaceColorsInElement = (element: HTMLElement) => {
    const computedStyle = getComputedStyle(element);

    // Check and replace background colors
    if (
      computedStyle.backgroundColor.includes("rgb(255, 255, 0)") ||
      computedStyle.backgroundColor.includes("rgb(249, 115, 22)") ||
      computedStyle.backgroundColor.includes("#FFFF00") ||
      computedStyle.backgroundColor.includes("#f97316")
    ) {
      if (mode === "admin") {
        element.style.backgroundColor = "rgb(239, 68, 68)"; // red-500
      } else if (theme === "color") {
        element.style.backgroundColor = "rgb(124, 58, 237)"; // violet-600
      } else {
        element.style.backgroundColor = "rgb(59, 130, 246)"; // blue-500
      }
    }

    // Check and replace text colors
    if (
      computedStyle.color.includes("rgb(255, 255, 0)") ||
      computedStyle.color.includes("rgb(249, 115, 22)") ||
      computedStyle.color.includes("#FFFF00") ||
      computedStyle.color.includes("#f97316")
    ) {
      if (mode === "admin") {
        element.style.color = "rgb(185, 28, 28)"; // red-700
      } else {
        element.style.color = "rgb(30, 64, 175)"; // blue-800
      }
    }
  };

  // Handle theme change
  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem("lawdesk-theme", newTheme);
    applyLawdeskTheme(newTheme, mode);
  };

  // Handle mode change
  const handleModeChange = (newMode: UserMode) => {
    setMode(newMode);
    localStorage.setItem("lawdesk-mode", newMode);
    applyLawdeskTheme(theme, newMode);
  };

  // Handle route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if ((window as any).lawdeskObserver) {
        (window as any).lawdeskObserver.disconnect();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className={cn("h-screen flex items-center justify-center theme-bg")}>
        <div className="text-center">
          <div
            className={cn(
              "w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4",
              mode === "admin" ? "border-red-600" : "border-blue-600",
            )}
          />
          <p className={cn("text-sm font-medium", "text-foreground")}>
            Lawdesk
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-screen flex overflow-hidden theme-bg transition-all duration-300",
        mode === "admin" && "admin-theme",
      )}
    >
      {/* Branded Sidebar */}
      <LawdeskBrandedSidebar mode={mode} theme={theme} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Branded Header */}
        <LawdeskBrandedHeader
          mode={mode}
          onModeChange={handleModeChange}
          theme={theme}
          onThemeChange={handleThemeChange}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-auto theme-bg modern-scroll">
          <div className="h-full fade-in">{children || <Outlet />}</div>
        </main>
      </div>

      {/* Conversation Widget */}
      <LawdeskConversationWidget mode={mode} theme={theme} />
    </div>
  );
};

export default LawdeskBrandedLayout;
