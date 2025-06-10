/**
 * 🎯 MODERN LAYOUT - LAWDESK REDESIGN COMPLETE
 *
 * Layout moderno e responsivo com:
 * - Sidebar compacta e minimalista
 * - Header inteligente com nome dinâmico da página
 * - Sistema de tema integrado
 * - Zero redundância
 * - Performance otimizada
 * - Design system consistente
 */

import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import ModernCompactSidebar from "./ModernCompactSidebar";
import ModernPageHeader from "./ModernPageHeader";
import { initializeTheme } from "@/lib/theme";

interface ModernLayoutProps {
  children?: React.ReactNode;
}

export const ModernLayout: React.FC<ModernLayoutProps> = ({ children }) => {
  // Initialize theme on mount
  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 flex overflow-hidden">
      {/* Compact Sidebar */}
      <ModernCompactSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Modern Header */}
        <ModernPageHeader />

        {/* Content */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950">
          <div className="h-full">{children || <Outlet />}</div>
        </main>
      </div>
    </div>
  );
};

export default ModernLayout;
