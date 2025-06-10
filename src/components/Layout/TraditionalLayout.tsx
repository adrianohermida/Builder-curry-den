/**
 * 🎯 TRADITIONAL LAYOUT - DESIGN COMO NA IMAGEM
 *
 * Layout tradicional restaurado:
 * - Sidebar vertical com ícones à esquerda
 * - Cabeçalho "Painel de Controle"
 * - Widget de conversação
 * - Layout como mostrado na imagem
 */

import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import IconSidebar from "./IconSidebar";
import ControlPanelHeader from "./ControlPanelHeader";
import ChatWidget from "./ChatWidget";

interface TraditionalLayoutProps {
  children?: React.ReactNode;
}

export const TraditionalLayout: React.FC<TraditionalLayoutProps> = ({
  children,
}) => {
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Icon Sidebar */}
      <IconSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <ControlPanelHeader />

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {children || <Outlet />}
          </motion.div>
        </main>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default TraditionalLayout;
