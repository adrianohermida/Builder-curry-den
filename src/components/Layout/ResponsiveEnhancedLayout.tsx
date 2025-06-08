import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { EnhancedSidebar } from "./EnhancedSidebar";
import { EnhancedTopbar } from "./EnhancedTopbar";
import { ConversacaoWidget } from "@/components/Chat/ConversacaoWidget";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";
import { useViewMode } from "@/contexts/ViewModeContext";

export function ResponsiveEnhancedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isDark } = useTheme();
  const { isAdminMode } = useViewMode();

  // Responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const mobile = width < 1024; // lg breakpoint
      setIsMobile(mobile);

      // Auto-close sidebar on mobile
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [sidebarOpen]);

  // Apply theme classes
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("dark", isDark);
    html.classList.toggle("admin-mode", isAdminMode);
  }, [isDark, isAdminMode]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-background flex",
        isAdminMode && "admin-mode",
      )}
    >
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:relative lg:translate-x-0",
          !sidebarOpen && "lg:w-0 lg:overflow-hidden",
        )}
      >
        <EnhancedSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="shrink-0 border-b bg-background/95 backdrop-blur">
          <EnhancedTopbar
            onMenuClick={toggleSidebar}
            sidebarOpen={sidebarOpen}
            showMobileNav={isMobile}
          />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto max-w-7xl p-4 lg:p-6">
            <motion.div
              key={isAdminMode ? "admin-content" : "client-content"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </div>
        </main>

        {/* Admin Mode Footer */}
        {isAdminMode && (
          <footer className="shrink-0 border-t bg-slate-50 dark:bg-slate-900 px-4 py-2">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>
                Modo Administrativo Ativo - Todas as ações são registradas
              </span>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </footer>
        )}
      </div>

      {/* Widget de Conversação Flutuante */}
      <ConversacaoWidget />

      {/* Global Styles */}
      <style jsx global>{`
        .admin-mode {
          --sidebar-background: rgb(15 23 42);
          --sidebar-foreground: rgb(241 245 249);
          --sidebar-border: rgb(51 65 85);
        }

        .admin-mode .sidebar-layout {
          background: var(--sidebar-background);
          color: var(--sidebar-foreground);
          border-color: var(--sidebar-border);
        }

        @media (max-width: 1024px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }

        /* Prevent zoom on iOS */
        @media (max-width: 768px) {
          input,
          textarea,
          select {
            font-size: 16px;
          }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgb(241 245 249);
        }

        ::-webkit-scrollbar-thumb {
          background: rgb(203 213 225);
          border-radius: 3px;
        }

        .dark ::-webkit-scrollbar-track {
          background: rgb(30 41 59);
        }

        .dark ::-webkit-scrollbar-thumb {
          background: rgb(71 85 105);
        }
      `}</style>
    </div>
  );
}
