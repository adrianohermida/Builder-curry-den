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
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default true for desktop
  const [isMobile, setIsMobile] = useState(false);
  const { isDark } = useTheme();
  const { isAdminMode } = useViewMode();

  // Responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const mobile = width < 1024; // lg breakpoint
      setIsMobile(mobile);

      // On mobile, start with sidebar closed
      if (mobile) {
        setSidebarOpen(false);
      } else {
        // On desktop, check localStorage or default to open
        const saved = localStorage.getItem("sidebarOpen");
        setSidebarOpen(saved !== null ? JSON.parse(saved) : true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Apply theme classes
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("dark", isDark);
    html.classList.toggle("admin-mode", isAdminMode);

    // Apply admin mode specific styles
    if (isAdminMode) {
      html.style.setProperty("--sidebar-background", "rgb(15 23 42)");
      html.style.setProperty("--sidebar-foreground", "rgb(241 245 249)");
      html.style.setProperty("--sidebar-border", "rgb(51 65 85)");
    } else {
      html.style.setProperty("--sidebar-background", "hsl(var(--sidebar))");
      html.style.setProperty(
        "--sidebar-foreground",
        "hsl(var(--sidebar-foreground))",
      );
      html.style.setProperty("--sidebar-border", "hsl(var(--sidebar-border))");
    }
  }, [isDark, isAdminMode]);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);

    // Save state on desktop
    if (!isMobile) {
      localStorage.setItem("sidebarOpen", JSON.stringify(newState));
    }
  };

  return (
    <div
      className={cn("min-h-screen bg-background", isAdminMode && "admin-mode")}
    >
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Layout */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={cn(
            "transition-all duration-300 ease-in-out",
            // Mobile: fixed positioned
            isMobile && "fixed inset-y-0 left-0 z-50",
            isMobile && (sidebarOpen ? "translate-x-0" : "-translate-x-full"),
            // Desktop: relative positioned, always visible but can be collapsed
            !isMobile && "relative",
            !isMobile && (sidebarOpen ? "w-72" : "w-16"),
          )}
        >
          <EnhancedSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            collapsed={!sidebarOpen && !isMobile}
          />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Header */}
          <header
            className={cn(
              "shrink-0 border-b backdrop-blur sticky top-0 z-30",
              isAdminMode
                ? "bg-slate-900/95 border-slate-700 text-white"
                : "bg-background/95 border-border",
            )}
          >
            <EnhancedTopbar
              onMenuClick={toggleSidebar}
              sidebarOpen={sidebarOpen}
              showMobileNav={isMobile}
            />
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <div
              className={cn("container mx-auto max-w-7xl", "p-4 sm:p-6 lg:p-8")}
            >
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
          <AnimatePresence>
            {isAdminMode && (
              <motion.footer
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="shrink-0 border-t border-slate-700 bg-slate-900 px-4 py-3"
              >
                <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">
                    🛡️ MODO ADMINISTRATIVO ATIVO
                  </span>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-slate-400 ml-2">
                    Todas as ações são auditadas
                  </span>
                </div>
              </motion.footer>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Widget de Conversação Flutuante */}
      <ConversacaoWidget />

      {/* Global Styles */}
      <style jsx global>{`
        /* Admin Mode Specific Styles */
        .admin-mode {
          --primary: 220 14% 96%;
          --primary-foreground: 220 13% 9%;
          --background: 15 23 42;
          --foreground: 241 245 249;
        }

        .admin-mode .sidebar-layout {
          background-color: rgb(15 23 42);
          color: rgb(241 245 249);
          border-color: rgb(51 65 85);
        }

        /* Client Mode Specific Styles */
        .client-mode {
          --primary: 221.2 83.2% 53.3%;
          --primary-foreground: 210 40% 98%;
        }

        /* Responsive Utilities */
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
          background: hsl(var(--muted));
        }

        ::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }

        /* Admin mode scrollbar */
        .admin-mode ::-webkit-scrollbar-track {
          background: rgb(30 41 59);
        }

        .admin-mode ::-webkit-scrollbar-thumb {
          background: rgb(71 85 105);
        }

        .admin-mode ::-webkit-scrollbar-thumb:hover {
          background: rgb(100 116 139);
        }

        /* Smooth transitions */
        * {
          transition-property: color, background-color, border-color;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
      `}</style>
    </div>
  );
}
