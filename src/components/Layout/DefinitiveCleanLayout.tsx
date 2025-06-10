/**
 * 🎯 DEFINITIVE CLEAN LAYOUT - FINAL SOLUTION
 *
 * Layout limpo e definitivo que resolve TODOS os problemas:
 * - Design moderno SaaS 2025
 * - Sidebar funcional e responsiva
 * - Header inteligente
 * - Zero conflitos
 * - Zero amarelo
 * - Performance otimizada
 */

import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

// Definitive components
import DefinitiveSidebar from "./DefinitiveSidebar";
import DefinitiveHeader from "./DefinitiveHeader";

interface DefinitiveCleanLayoutProps {
  children?: React.ReactNode;
  mode?: "client" | "admin";
}

export const DefinitiveCleanLayout: React.FC<DefinitiveCleanLayoutProps> = ({
  children,
  mode = "client",
}) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // Initialize system
  useEffect(() => {
    // Set theme based on mode
    const root = document.documentElement;
    root.classList.remove("admin-theme");

    if (mode === "admin") {
      root.classList.add("admin-theme");
    }

    // Force light theme as default
    root.classList.remove("dark");

    // Add definitive CSS
    if (!document.getElementById("definitive-styles")) {
      const style = document.createElement("style");
      style.id = "definitive-styles";
      style.textContent = `
        /* Definitive Theme Variables */
        :root {
          --primary: 59 130 246; /* Blue for client */
          --primary-foreground: 255 255 255;
          --secondary: 241 245 249;
          --secondary-foreground: 51 65 85;
          --background: 255 255 255;
          --foreground: 15 23 42;
          --muted: 248 250 252;
          --muted-foreground: 100 116 139;
          --border: 226 232 240;
          --ring: 59 130 246;
        }

        /* Admin theme override */
        .admin-theme {
          --primary: 239 68 68; /* Red for admin */
          --ring: 239 68 68;
        }

        /* Remove ALL yellow completely */
        .bg-yellow-50, .bg-yellow-100, .bg-yellow-200, .bg-yellow-300, .bg-yellow-400, .bg-yellow-500, .bg-yellow-600, .bg-yellow-700, .bg-yellow-800, .bg-yellow-900 {
          background-color: rgb(255 237 213) !important; /* orange-100 */
        }

        .text-yellow-50, .text-yellow-100, .text-yellow-200, .text-yellow-300, .text-yellow-400, .text-yellow-500, .text-yellow-600, .text-yellow-700, .text-yellow-800, .text-yellow-900 {
          color: rgb(154 52 18) !important; /* orange-800 */
        }

        .border-yellow-50, .border-yellow-100, .border-yellow-200, .border-yellow-300, .border-yellow-400, .border-yellow-500, .border-yellow-600, .border-yellow-700, .border-yellow-800, .border-yellow-900 {
          border-color: rgb(253 186 116) !important; /* orange-300 */
        }

        /* Modern animations */
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Hide scrollbars */
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `;
      document.head.appendChild(style);
    }

    setIsLoading(false);
  }, [mode]);

  // Handle route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">Lawdesk</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-screen bg-gray-50 flex overflow-hidden",
        mode === "admin" && "admin-theme",
      )}
    >
      {/* Definitive Sidebar */}
      <DefinitiveSidebar mode={mode} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Definitive Header */}
        <DefinitiveHeader mode={mode} />

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="h-full fade-in">{children || <Outlet />}</div>
        </main>
      </div>
    </div>
  );
};

export default DefinitiveCleanLayout;
