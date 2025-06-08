import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { EnhancedSidebar } from "./EnhancedSidebar";
import { EnhancedTopbar } from "./EnhancedTopbar";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";
import { useViewMode } from "@/contexts/ViewModeContext";

export function FixedResponsiveLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { isDark } = useTheme();
  const { isAdminMode } = useViewMode();

  // Enhanced responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const mobile = width < 1024; // lg breakpoint

      setIsMobile(mobile);

      // Auto-close sidebar on mobile when screen becomes smaller
      if (mobile) {
        setSidebarOpen(false);
      } else {
        // Auto-open sidebar on desktop if not explicitly closed
        const userClosed = sessionStorage.getItem("sidebarClosed");
        if (!userClosed) {
          setSidebarOpen(true);
        }
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);

    // Remember sidebar state on desktop
    if (!isMobile) {
      if (newState) {
        sessionStorage.removeItem("sidebarClosed");
      } else {
        sessionStorage.setItem("sidebarClosed", "true");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
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
        <header className="shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <EnhancedTopbar
            onMenuClick={toggleSidebar}
            sidebarOpen={sidebarOpen}
            showMobileNav={isMobile}
          />
        </header>

        {/* Page Content */}
        <main
          className={cn(
            "flex-1 overflow-auto",
            isAdminMode
              ? "bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800"
              : "bg-background",
          )}
        >
          <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
            <Outlet />
          </div>
        </main>

        {/* Admin Footer */}
        {isAdminMode && (
          <footer className="shrink-0 border-t bg-slate-50 dark:bg-slate-900 p-2">
            <div className="container mx-auto max-w-7xl">
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-center">
                  {isMobile
                    ? "Modo Admin Ativo"
                    : "Modo Administrativo Ativo - Todas as ações são registradas"}
                </span>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
