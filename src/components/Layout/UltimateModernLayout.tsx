/**
 * 🚀 ULTIMATE MODERN LAYOUT - SISTEMA COMPLETO 2025
 *
 * Layout definitivo com:
 * - Sidebar compactável e moderno
 * - Header completo com menu de usuário
 * - Sistema de temas (light/dark/color)
 * - Switch admin/cliente
 * - Widget de conversação
 * - Zero amarelo - completamente removido
 * - Performance otimizada
 */

import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

// Modern components
import CompactModernSidebar from "./CompactModernSidebar";
import ModernCompactHeader from "./ModernCompactHeader";
import ConversationWidget from "../Chat/ConversationWidget";

interface UltimateModernLayoutProps {
  children?: React.ReactNode;
}

type ThemeMode = "light" | "dark" | "color";
type UserMode = "client" | "admin";

export const UltimateModernLayout: React.FC<UltimateModernLayoutProps> = ({
  children,
}) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [mode, setMode] = useState<UserMode>("client");

  // Initialize system
  useEffect(() => {
    // Get saved theme and mode from localStorage
    const savedTheme = localStorage.getItem("lawdesk-theme") as ThemeMode;
    const savedMode = localStorage.getItem("lawdesk-mode") as UserMode;

    if (savedTheme && ["light", "dark", "color"].includes(savedTheme)) {
      setTheme(savedTheme);
    }

    if (savedMode && ["client", "admin"].includes(savedMode)) {
      setMode(savedMode);
    }

    // Apply theme to document
    applyTheme(savedTheme || "light", savedMode || "client");

    setIsLoading(false);
  }, []);

  // Apply theme and mode to document
  const applyTheme = (newTheme: ThemeMode, newMode: UserMode) => {
    const root = document.documentElement;
    const body = document.body;

    // Remove all theme classes
    root.classList.remove("dark", "color-theme", "admin-theme");
    body.classList.remove("theme-light", "theme-dark", "theme-color");

    // Apply new theme
    if (newTheme === "dark") {
      root.classList.add("dark");
      body.classList.add("theme-dark");
    } else if (newTheme === "color") {
      root.classList.add("color-theme");
      body.classList.add("theme-color");
    } else {
      body.classList.add("theme-light");
    }

    // Apply mode
    if (newMode === "admin") {
      root.classList.add("admin-theme");
    }

    // Add comprehensive CSS for theme system and yellow removal
    if (!document.getElementById("ultimate-modern-styles")) {
      const style = document.createElement("style");
      style.id = "ultimate-modern-styles";
      style.textContent = `
        /* =================================
           ULTIMATE MODERN THEME SYSTEM
           ================================= */

        /* Light Theme (Default) */
        :root {
          --primary: 59 130 246; /* blue-500 */
          --primary-foreground: 255 255 255;
          --secondary: 241 245 249; /* slate-100 */
          --secondary-foreground: 51 65 85; /* slate-700 */
          --background: 255 255 255;
          --foreground: 15 23 42; /* slate-900 */
          --muted: 248 250 252; /* slate-50 */
          --muted-foreground: 100 116 139; /* slate-500 */
          --border: 226 232 240; /* slate-200 */
          --input: 226 232 240; /* slate-200 */
          --ring: 59 130 246; /* blue-500 */
          --destructive: 239 68 68; /* red-500 */
          --destructive-foreground: 255 255 255;
          --warning: 249 115 22; /* orange-500 - NO YELLOW! */
          --warning-foreground: 255 255 255;
          --success: 34 197 94; /* green-500 */
          --success-foreground: 255 255 255;
        }

        /* Dark Theme */
        .dark {
          --primary: 59 130 246; /* blue-500 */
          --primary-foreground: 255 255 255;
          --secondary: 30 41 59; /* slate-800 */
          --secondary-foreground: 148 163 184; /* slate-400 */
          --background: 2 6 23; /* slate-950 */
          --foreground: 248 250 252; /* slate-50 */
          --muted: 15 23 42; /* slate-900 */
          --muted-foreground: 100 116 139; /* slate-500 */
          --border: 30 41 59; /* slate-800 */
          --input: 30 41 59; /* slate-800 */
          --ring: 59 130 246; /* blue-500 */
          --destructive: 239 68 68; /* red-500 */
          --destructive-foreground: 255 255 255;
          --warning: 249 115 22; /* orange-500 */
          --warning-foreground: 255 255 255;
          --success: 34 197 94; /* green-500 */
          --success-foreground: 255 255 255;
        }

        /* Color Theme */
        .color-theme {
          --primary: 124 58 237; /* violet-600 */
          --primary-foreground: 255 255 255;
          --secondary: 238 242 255; /* indigo-50 */
          --secondary-foreground: 67 56 202; /* indigo-700 */
          --background: 255 255 255;
          --foreground: 15 23 42; /* slate-900 */
          --muted: 248 250 252; /* slate-50 */
          --muted-foreground: 100 116 139; /* slate-500 */
          --border: 196 181 253; /* violet-300 */
          --input: 226 232 240; /* slate-200 */
          --ring: 124 58 237; /* violet-600 */
          --destructive: 239 68 68; /* red-500 */
          --destructive-foreground: 255 255 255;
          --warning: 249 115 22; /* orange-500 */
          --warning-foreground: 255 255 255;
          --success: 34 197 94; /* green-500 */
          --success-foreground: 255 255 255;
        }

        /* Admin Mode Override */
        .admin-theme {
          --primary: 239 68 68; /* red-500 for admin */
          --ring: 239 68 68;
        }

        /* =================================
           COMPLETE YELLOW ELIMINATION
           ================================= */

        /* Background Colors */
        .bg-yellow-50, .bg-yellow-100, .bg-yellow-200, .bg-yellow-300,
        .bg-yellow-400, .bg-yellow-500, .bg-yellow-600, .bg-yellow-700,
        .bg-yellow-800, .bg-yellow-900, .bg-yellow-950,
        [style*="background-color: rgb(255, 255, 0)"],
        [style*="background-color: #FFFF00"],
        [style*="background-color: #ffff00"],
        [style*="background: rgb(255, 255, 0)"],
        [style*="background: #FFFF00"],
        [style*="background: #ffff00"] {
          background-color: rgb(249 115 22) !important; /* orange-500 */
        }

        /* Text Colors */
        .text-yellow-50, .text-yellow-100, .text-yellow-200, .text-yellow-300,
        .text-yellow-400, .text-yellow-500, .text-yellow-600, .text-yellow-700,
        .text-yellow-800, .text-yellow-900, .text-yellow-950,
        [style*="color: rgb(255, 255, 0)"],
        [style*="color: #FFFF00"],
        [style*="color: #ffff00"] {
          color: rgb(154 52 18) !important; /* orange-800 */
        }

        /* Border Colors */
        .border-yellow-50, .border-yellow-100, .border-yellow-200, .border-yellow-300,
        .border-yellow-400, .border-yellow-500, .border-yellow-600, .border-yellow-700,
        .border-yellow-800, .border-yellow-900, .border-yellow-950,
        [style*="border-color: rgb(255, 255, 0)"],
        [style*="border-color: #FFFF00"],
        [style*="border-color: #ffff00"] {
          border-color: rgb(253 186 116) !important; /* orange-300 */
        }

        /* Ring Colors */
        .ring-yellow-50, .ring-yellow-100, .ring-yellow-200, .ring-yellow-300,
        .ring-yellow-400, .ring-yellow-500, .ring-yellow-600, .ring-yellow-700,
        .ring-yellow-800, .ring-yellow-900, .ring-yellow-950 {
          --tw-ring-color: rgb(253 186 116) !important; /* orange-300 */
        }

        /* Outline Colors */
        .outline-yellow-50, .outline-yellow-100, .outline-yellow-200, .outline-yellow-300,
        .outline-yellow-400, .outline-yellow-500, .outline-yellow-600, .outline-yellow-700,
        .outline-yellow-800, .outline-yellow-900, .outline-yellow-950 {
          outline-color: rgb(253 186 116) !important; /* orange-300 */
        }

        /* =================================
           MODERN ANIMATIONS & EFFECTS
           ================================= */

        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }

        .scale-in {
          animation: scaleIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Hide scrollbars but keep functionality */
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Smooth transitions for all interactive elements */
        button, a, input, textarea, select {
          transition: all 0.2s ease-in-out;
        }

        /* Custom focus styles */
        .focus-ring:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        /* Background patterns for different themes */
        .theme-light {
          background: rgb(249 250 251);
        }

        .theme-dark {
          background: rgb(2 6 23);
        }

        .theme-color {
          background: linear-gradient(135deg, rgb(239 246 255) 0%, rgb(243 232 255) 100%);
        }

        /* =================================
           RUNTIME YELLOW DETECTION & REPLACEMENT
           ================================= */

        /* This will catch any remaining yellow in computed styles */
        * {
          --yellow-replacement: rgb(249 115 22);
        }
      `;
      document.head.appendChild(style);
    }

    // Runtime yellow detection and replacement
    const observer = new MutationObserver(() => {
      const elements = document.querySelectorAll("*");
      elements.forEach((el) => {
        const element = el as HTMLElement;
        const computedStyle = getComputedStyle(element);

        // Check background color
        if (
          computedStyle.backgroundColor.includes("rgb(255, 255, 0)") ||
          computedStyle.backgroundColor.includes("#FFFF00") ||
          computedStyle.backgroundColor.includes("#ffff00")
        ) {
          element.style.backgroundColor = "rgb(249, 115, 22)"; // orange-500
        }

        // Check text color
        if (
          computedStyle.color.includes("rgb(255, 255, 0)") ||
          computedStyle.color.includes("#FFFF00") ||
          computedStyle.color.includes("#ffff00")
        ) {
          element.style.color = "rgb(154, 52, 18)"; // orange-800
        }

        // Check border color
        if (
          computedStyle.borderColor.includes("rgb(255, 255, 0)") ||
          computedStyle.borderColor.includes("#FFFF00") ||
          computedStyle.borderColor.includes("#ffff00")
        ) {
          element.style.borderColor = "rgb(253, 186, 116)"; // orange-300
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Store observer for cleanup
    (window as any).yellowObserver = observer;
  };

  // Handle theme change
  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem("lawdesk-theme", newTheme);
    applyTheme(newTheme, mode);
  };

  // Handle mode change
  const handleModeChange = (newMode: UserMode) => {
    setMode(newMode);
    localStorage.setItem("lawdesk-mode", newMode);
    applyTheme(theme, newMode);
  };

  // Handle route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup observer
      if ((window as any).yellowObserver) {
        (window as any).yellowObserver.disconnect();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div
        className={cn(
          "h-screen flex items-center justify-center",
          theme === "dark" ? "bg-gray-900" : "bg-white",
        )}
      >
        <div className="text-center">
          <div
            className={cn(
              "w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4",
              mode === "admin" ? "border-red-600" : "border-blue-600",
            )}
          />
          <p
            className={cn(
              "text-sm font-medium",
              theme === "dark" ? "text-gray-300" : "text-gray-600",
            )}
          >
            Lawdesk
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-screen flex overflow-hidden transition-colors duration-300",
        theme === "light" && "bg-gray-50",
        theme === "dark" && "bg-gray-900",
        theme === "color" && "bg-gradient-to-br from-blue-50 to-purple-50",
        mode === "admin" && "admin-theme",
      )}
    >
      {/* Compact Modern Sidebar */}
      <CompactModernSidebar mode={mode} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Modern Compact Header */}
        <ModernCompactHeader
          mode={mode}
          onModeChange={handleModeChange}
          theme={theme}
          onThemeChange={handleThemeChange}
        />

        {/* Content Area */}
        <main
          className={cn(
            "flex-1 overflow-auto transition-colors duration-300",
            theme === "light" && "bg-gray-50",
            theme === "dark" && "bg-gray-900",
            theme === "color" && "bg-gradient-to-br from-blue-50 to-purple-50",
          )}
        >
          <div className="h-full fade-in">{children || <Outlet />}</div>
        </main>
      </div>

      {/* Conversation Widget */}
      <ConversationWidget mode={mode} theme={theme} />
    </div>
  );
};

export default UltimateModernLayout;
