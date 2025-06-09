import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CorrectedSidebar } from "./CorrectedSidebar";
import { CorrectedTopbar } from "./CorrectedTopbar";
import { ConversacaoWidget } from "@/components/Chat/ConversacaoWidget";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";
import { useViewMode } from "@/contexts/ViewModeContext";

export function CorrectedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const { isDark } = useTheme();
  const { isAdminMode } = useViewMode();

  // Enhanced responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const mobile = width < 768; // md breakpoint for true mobile
      const tablet = width >= 768 && width < 1024; // tablet range

      setIsMobile(mobile);
      setIsTablet(tablet);

      // Mobile: always start closed
      if (mobile) {
        setSidebarOpen(false);
      }
      // Tablet: start closed but can be toggled
      else if (tablet) {
        const saved = localStorage.getItem("sidebarOpen");
        setSidebarOpen(saved !== null ? JSON.parse(saved) : false);
      }
      // Desktop: remember preference, default open
      else {
        const saved = localStorage.getItem("sidebarOpen");
        setSidebarOpen(saved !== null ? JSON.parse(saved) : true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Apply theme and responsive classes
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("dark", isDark);
    html.classList.toggle("admin-mode", isAdminMode);
    html.classList.toggle("mobile", isMobile);
    html.classList.toggle("tablet", isTablet);
  }, [isDark, isAdminMode, isMobile, isTablet]);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);

    // Save preference for tablet and desktop
    if (!isMobile) {
      localStorage.setItem("sidebarOpen", JSON.stringify(newState));
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-background flex flex-col",
        isAdminMode && "admin-mode",
        isMobile && "mobile-layout",
        isTablet && "tablet-layout",
      )}
    >
      {/* Mobile Sidebar Overlay */}
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

      {/* Main Layout Container */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar - CORRIGIDO com módulos corretos */}
        <aside
          className={cn(
            "z-50 transition-all duration-300 ease-in-out",
            // Mobile: fixed overlay
            isMobile && "fixed inset-y-0 left-0",
            isMobile && (sidebarOpen ? "translate-x-0" : "-translate-x-full"),
            // Tablet: fixed overlay, wider
            isTablet && "fixed inset-y-0 left-0",
            isTablet && (sidebarOpen ? "translate-x-0" : "-translate-x-full"),
            // Desktop: relative, collapsible
            !isMobile && !isTablet && "relative",
            !isMobile && !isTablet && (sidebarOpen ? "w-72" : "w-16"),
          )}
        >
          <CorrectedSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            collapsed={!sidebarOpen && !isMobile && !isTablet}
          />
        </aside>

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Header - SEM redundâncias */}
          <OptimizedTopbar
            onMenuClick={toggleSidebar}
            sidebarOpen={sidebarOpen}
            isMobile={isMobile}
          />

          {/* Page Content */}
          <main
            className={cn(
              "flex-1 overflow-auto",
              // Add bottom padding on mobile when admin mode (for footer)
              isMobile && isAdminMode && "pb-12",
            )}
          >
            <div
              className={cn(
                "container mx-auto max-w-7xl",
                // Responsive padding
                "p-3 sm:p-4 md:p-6 lg:p-8",
                // Reduced padding on mobile
                isMobile && "p-3",
                isTablet && "p-4",
              )}
            >
              <motion.div
                key={isAdminMode ? "admin-content" : "client-content"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full"
              >
                <Outlet />
              </motion.div>
            </div>
          </main>
        </div>
      </div>

      {/* Chat Widget */}
      <ConversacaoWidget
        className={cn(
          isMobile && isAdminMode && "bottom-16", // Avoid admin footer
        )}
      />

      {/* Global Responsive Styles */}
      <style jsx global>{`
        /* Mobile-specific optimizations */
        .mobile-layout {
          --min-touch-target: 44px;
        }

        .mobile-layout button,
        .mobile-layout [role="button"] {
          min-height: var(--min-touch-target);
          min-width: var(--min-touch-target);
        }

        /* Prevent zoom on form inputs on iOS */
        .mobile-layout input,
        .mobile-layout textarea,
        .mobile-layout select {
          font-size: 16px !important;
        }

        /* Optimize scrolling on mobile */
        .mobile-layout {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }

        /* Admin mode styles */
        .admin-mode .mobile-layout {
          --primary: 0 84% 60%;
          --background: 222.2 84% 4.9%;
          --foreground: 210 40% 98%;
        }

        /* Custom scrollbar */
        .mobile-layout ::-webkit-scrollbar {
          width: 3px;
        }

        .tablet-layout ::-webkit-scrollbar {
          width: 6px;
        }

        .mobile-layout ::-webkit-scrollbar-track,
        .tablet-layout ::-webkit-scrollbar-track {
          background: transparent;
        }

        .mobile-layout ::-webkit-scrollbar-thumb,
        .tablet-layout ::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 3px;
        }

        /* Safe area support */
        @supports (padding: max(0px)) {
          .mobile-layout {
            padding-left: max(0px, env(safe-area-inset-left));
            padding-right: max(0px, env(safe-area-inset-right));
            padding-bottom: max(0px, env(safe-area-inset-bottom));
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .mobile-layout * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* High DPI optimizations */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .mobile-layout {
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
          }
        }

        /* Focus management */
        .mobile-layout :focus-visible {
          outline: 2px solid hsl(var(--primary));
          outline-offset: 2px;
        }

        /* Admin mode sidebar */
        .admin-mode .sidebar-layout {
          background: rgb(15 23 42);
          color: rgb(241 245 249);
          border-color: rgb(51 65 85);
        }
      `}</style>
    </div>
  );
}
