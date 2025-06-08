import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { EnhancedSidebar } from "./EnhancedSidebar";
import { EnhancedTopbar } from "./EnhancedTopbar";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";
import { useViewMode } from "@/contexts/ViewModeContext";

export function ResponsiveEnhancedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const { isDark } = useTheme();
  const { isAdminMode } = useViewMode();

  // Enhanced responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const mobile = width < 768; // md breakpoint
      const tablet = width >= 768 && width < 1024; // lg breakpoint
      const desktop = width >= 1024;

      setIsMobile(mobile);
      setIsTablet(tablet);

      // Auto-close sidebar on mobile/tablet when screen becomes smaller
      if ((mobile || tablet) && sidebarOpen) {
        setSidebarOpen(false);
      }
      // Auto-open sidebar on desktop only if not explicitly closed
      if (desktop && !sessionStorage.getItem("sidebarClosed")) {
        setSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
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

    // Add responsive classes
    html.classList.toggle("mobile", isMobile);
    html.classList.toggle("tablet", isTablet);
  }, [isDark, isAdminMode, isMobile, isTablet]);

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

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);

    // Remember sidebar state on desktop
    if (!isMobile && !isTablet) {
      if (newState) {
        sessionStorage.removeItem("sidebarClosed");
      } else {
        sessionStorage.setItem("sidebarClosed", "true");
      }
    }
  };

  return (
    <div
      className={cn(
        "app-container min-h-screen relative",
        isAdminMode ? "bg-slate-50 dark:bg-slate-900" : "bg-background",
        "transition-colors duration-300",
      )}
    >
      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {(isMobile || isTablet) && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:relative lg:inset-auto",
          !sidebarOpen && "lg:w-0 lg:overflow-hidden",
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isAdminMode ? "admin-sidebar" : "client-sidebar"}
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full"
          >
            <EnhancedSidebar
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Content Area */}
      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300",
          sidebarOpen && !isMobile && !isTablet ? "lg:ml-72" : "lg:ml-0",
          "relative",
        )}
      >
        {/* Topbar */}
        <motion.div
          key={isAdminMode ? "admin-topbar" : "client-topbar"}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="sticky top-0 z-30"
        >
          <EnhancedTopbar
            onMenuClick={toggleSidebar}
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
            "transition-colors duration-300",
          )}
        >
          <div
            className={cn(
              "container mx-auto max-w-7xl",
              // Responsive padding
              "p-3 sm:p-4 md:p-6 lg:p-8",
              // Ensure content doesn't overlap sidebar on mobile
              isMobile && sidebarOpen ? "opacity-50 pointer-events-none" : "",
            )}
          >
            <motion.div
              key={isAdminMode ? "admin-content" : "client-content"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="w-full"
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
                  <span
                    className={cn(
                      "text-center",
                      isMobile ? "text-xs" : "text-sm",
                    )}
                  >
                    {isMobile
                      ? "Modo Admin Ativo"
                      : "Modo Administrativo Ativo - Todas as ações são registradas"}
                  </span>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Global Responsive Styles */}
      <style jsx global>{`
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .grid {
            gap: 1rem;
          }

          /* Mobile-specific card adjustments */
          .card-content {
            padding: 1rem;
          }

          /* Mobile typography */
          h1 {
            font-size: 1.5rem;
          }
          h2 {
            font-size: 1.25rem;
          }
          h3 {
            font-size: 1.125rem;
          }
        }

        @media (min-width: 768px) and (max-width: 1024px) {
          /* Tablet adjustments */
          .container {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }

        /* Admin mode specific responsive styles */
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
          width: 6px;
        }

        @media (min-width: 1024px) {
          .admin-mode ::-webkit-scrollbar {
            width: 8px;
          }
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

        /* Focus management for mobile */
        @media (max-width: 768px) {
          .mobile input:focus,
          .mobile textarea:focus {
            font-size: 16px; /* Prevent zoom on iOS */
          }
        }

        /* Safe area adjustments for mobile devices */
        @supports (padding: max(0px)) {
          .app-container {
            padding-left: max(0px, env(safe-area-inset-left));
            padding-right: max(0px, env(safe-area-inset-right));
          }
        }
      `}</style>
    </div>
  );
}
