import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { EnhancedSidebar } from "./EnhancedSidebar";
import { EnhancedTopbar } from "./EnhancedTopbar";
import { MobileNav } from "@/components/ui/mobile-nav";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";
import { useViewMode } from "@/contexts/ViewModeContext";

export function EnhancedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isDark } = useTheme();
  const { isAdminMode } = useViewMode();

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      // Auto-close sidebar on mobile when screen becomes smaller
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
      // Auto-open sidebar on desktop
      if (!mobile && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [sidebarOpen]);

  // Apply theme classes to html element for global theming
  useEffect(() => {
    const html = document.documentElement;

    // Apply theme mode class
    html.classList.toggle("dark", isDark);

    // Apply admin mode class for global styling
    html.classList.toggle("admin-mode", isAdminMode);

    // Ensure consistent color scheme
    html.style.colorScheme = isDark ? "dark" : "light";
  }, [isDark, isAdminMode]);

  // Apply admin mode body class for special styling
  useEffect(() => {
    const body = document.body;

    if (isAdminMode) {
      body.classList.add("admin-mode");
      body.style.backgroundColor = isDark ? "#0f172a" : "#f8fafc";
    } else {
      body.classList.remove("admin-mode");
      body.style.backgroundColor = "";
    }

    return () => {
      body.classList.remove("admin-mode");
      body.style.backgroundColor = "";
    };
  }, [isAdminMode, isDark]);

  return (
    <div
      className={cn(
        "app-container min-h-screen",
        isAdminMode ? "bg-slate-50 dark:bg-slate-900" : "bg-background",
      )}
    >
      {/* Mobile Navigation Overlay */}
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
      <AnimatePresence mode="wait">
        <motion.div
          key={isAdminMode ? "admin-sidebar" : "client-sidebar"}
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <EnhancedSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </motion.div>
      </AnimatePresence>

      {/* Main Content Area */}
      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300",
          sidebarOpen ? "lg:ml-72" : "lg:ml-0",
        )}
      >
        {/* Topbar */}
        <motion.div
          key={isAdminMode ? "admin-topbar" : "client-topbar"}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <EnhancedTopbar
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
            showMobileNav={isMobile}
          />
        </motion.div>

        {/* Page Content */}
        <main
          className={cn(
            "flex-1 overflow-auto",
            isAdminMode
              ? "bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800"
              : "bg-background",
          )}
        >
          <div className="container mx-auto p-6 max-w-7xl">
            <motion.div
              key={isAdminMode ? "admin-content" : "client-content"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>

        {/* Admin Mode Indicator Footer */}
        <AnimatePresence>
          {isAdminMode && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2"
            >
              <div className="container mx-auto max-w-7xl">
                <div className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>
                    Modo Administrativo Ativo - Todas as ações são registradas
                  </span>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Global Admin Mode Styles */}
      <style jsx global>{`
        .admin-mode {
          --primary: 220 14% 96%;
          --primary-foreground: 220 13% 9%;
        }

        .admin-mode .sidebar-layout {
          border-right-color: rgb(51 65 85);
        }

        .admin-mode .topbar {
          border-bottom-color: rgb(51 65 85);
        }

        /* Custom scrollbar for admin mode */
        .admin-mode ::-webkit-scrollbar {
          width: 8px;
        }

        .admin-mode ::-webkit-scrollbar-track {
          background: rgb(15 23 42);
        }

        .admin-mode ::-webkit-scrollbar-thumb {
          background: rgb(51 65 85);
          border-radius: 4px;
        }

        .admin-mode ::-webkit-scrollbar-thumb:hover {
          background: rgb(71 85 105);
        }
      `}</style>
    </div>
  );
}
