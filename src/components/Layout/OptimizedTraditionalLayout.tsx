/**
 * 🎯 OPTIMIZED TRADITIONAL LAYOUT - LAYOUT OTIMIZADO
 *
 * Features implementadas:
 * ✅ Sidebar expansível integrado
 * ✅ Performance otimizada (sem framer-motion)
 * ✅ Responsivo completo
 * ✅ Header limpo e funcional
 * ✅ Chat widget integrado
 * ✅ Transições CSS nativas
 */

import React from "react";
import { Outlet } from "react-router-dom";
import ExpandableSidebar from "./ExpandableSidebar";
import ControlPanelHeader from "./ControlPanelHeader";
import ChatWidget from "./ChatWidget";

interface OptimizedTraditionalLayoutProps {
  children?: React.ReactNode;
}

export const OptimizedTraditionalLayout: React.FC<
  OptimizedTraditionalLayoutProps
> = ({ children }) => {
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Expandable Sidebar */}
      <ExpandableSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <ControlPanelHeader />

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="h-full fade-in">{children || <Outlet />}</div>
        </main>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default OptimizedTraditionalLayout;
