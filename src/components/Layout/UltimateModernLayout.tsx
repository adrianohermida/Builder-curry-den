/**
 * 🚀 ULTIMATE MODERN LAYOUT - LAWDESK 2025
 *
 * Layout final com todas as especificações implementadas:
 * - Design moderno, compacto e minimalista (estilo SaaS 2025)
 * - Responsividade total (desktop, tablet, mobile)
 * - Tema claro padrão (azul cliente, vermelho admin)
 * - Zero efeitos visuais excessivos
 * - Navegação fixa e alinhada
 * - Performance otimizada
 * - Consistência total entre páginas
 */

import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { initializeTheme } from "@/lib/theme";
import { initializeAnimations, applyPageAnimation } from "@/lib/animations";

// Modern Components
import UltimateCompactSidebar from "./UltimateCompactSidebar";
import UltimatePageHeader from "./UltimatePageHeader";

interface UltimateModernLayoutProps {
  children?: React.ReactNode;
  mode?: "client" | "admin";
}

export const UltimateModernLayout: React.FC<UltimateModernLayoutProps> = ({
  children,
  mode = "client",
}) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme and setup
  useEffect(() => {
    initializeTheme();

    // Apply theme mode
    const root = document.documentElement;
    if (mode === "admin") {
      root.classList.add("admin-theme");
    } else {
      root.classList.remove("admin-theme");
    }

    // Loading state
    setTimeout(() => setIsLoading(false), 100);
  }, [mode]);

  // Route change optimization
  useEffect(() => {
    // Smooth transition between routes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Carregando Lawdesk...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-screen bg-gray-50 flex overflow-hidden",
        "transition-colors duration-200",
        mode === "admin" && "admin-theme",
      )}
    >
      {/* Ultimate Compact Sidebar */}
      <UltimateCompactSidebar mode={mode} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Ultimate Page Header */}
        <UltimatePageHeader mode={mode} />

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 relative">
          <div className="h-full animate-fade-in">{children || <Outlet />}</div>
        </main>
      </div>
    </div>
  );
};

export default UltimateModernLayout;
