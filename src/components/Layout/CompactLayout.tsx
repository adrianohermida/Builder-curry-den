/**
 * 🎯 COMPACT LAYOUT - DESIGN SUPER LIMPO
 *
 * Layout compacto e minimalista com:
 * - Sidebar sem seções categorizadas
 * - Topbar limpo e elegante
 * - Menu de usuário simples
 * - Todas as funcionalidades mantidas
 */

import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CompactSidebar from "./CompactSidebar";
import CleanTopbar from "./CleanTopbar";
import { cn } from "@/lib/utils";

interface CompactLayoutProps {
  children?: React.ReactNode;
}

export const CompactLayout: React.FC<CompactLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        const sidebar = document.getElementById("compact-sidebar");
        if (sidebar && !sidebar.contains(event.target as Node)) {
          setSidebarOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMobile, sidebarOpen]);

  const handleSidebarToggle = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        id="compact-sidebar"
        className={cn(
          "relative z-50 transition-all duration-300",
          isMobile
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full absolute"
            : "translate-x-0",
        )}
      >
        <CompactSidebar
          collapsed={!isMobile && sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          onClose={() => setSidebarOpen(false)}
          open={sidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Topbar */}
        <CleanTopbar
          sidebarCollapsed={sidebarCollapsed}
          onSidebarToggle={handleSidebarToggle}
          isMobile={isMobile}
        />

        {/* Content */}
        <main className="flex-grow overflow-auto bg-gray-50">
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
    </div>
  );
};

export default CompactLayout;
