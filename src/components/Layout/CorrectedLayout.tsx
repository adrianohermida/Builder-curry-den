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
  const { isDark, config } = useTheme();
  const { isAdminMode } = useViewMode();

  // Enhanced responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const mobile = width < 768; // md breakpoint
      const tablet = width >= 768 && width < 1024; // lg breakpoint

      setIsMobile(mobile);
      setIsTablet(tablet);

      // Responsive sidebar behavior
      if (mobile) {
        setSidebarOpen(false);
      } else if (tablet) {
        const saved = localStorage.getItem("lawdesk-sidebar-open");
        setSidebarOpen(saved ? JSON.parse(saved) : false);
      } else {
        const saved = localStorage.getItem("lawdesk-sidebar-open");
        setSidebarOpen(saved ? JSON.parse(saved) : true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // FIXED: Apply theme and mode classes properly
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // Clear all theme classes first
    html.classList.remove(
      "dark",
      "light",
      "admin-mode",
      "client-mode",
      "mobile",
      "tablet",
      "high-contrast",
      "reduced-motion",
      "large-text",
    );

    // FORCE light mode as base
    html.classList.add("light");

    // Only add dark if explicitly set
    if (isDark) {
      html.classList.add("dark");
    }

    // FIXED: Apply admin/client mode classes
    if (isAdminMode) {
      html.classList.add("admin-mode");
      body.classList.add("admin-mode");
    } else {
      html.classList.add("client-mode");
      body.classList.add("client-mode");
    }

    // Apply device classes
    if (isMobile) {
      html.classList.add("mobile");
      body.classList.add("mobile-layout");
    }
    if (isTablet) {
      html.classList.add("tablet");
      body.classList.add("tablet-layout");
    }

    // Apply accessibility settings
    if (config.accessibility.reducedMotion) {
      html.classList.add("reduced-motion");
    }
    if (config.accessibility.largeText) {
      html.classList.add("large-text");
    }
    if (config.accessibility.highContrast) {
      html.classList.add("high-contrast");
    }

    // FIXED: Apply CSS custom properties for theming
    const root = document.documentElement;

    // Set primary color based on mode
    if (isAdminMode) {
      root.style.setProperty("--primary", "0 84% 60%"); // Red for admin
      root.style.setProperty("--primary-foreground", "210 40% 98%");
      root.style.setProperty("--accent", "0 84% 60%");
      root.style.setProperty("--ring", "0 84% 60%");
    } else {
      root.style.setProperty("--primary", "221.2 83.2% 53.3%"); // Blue for client
      root.style.setProperty("--primary-foreground", "210 40% 98%");
      root.style.setProperty("--accent", "221.2 83.2% 53.3%");
      root.style.setProperty("--ring", "221.2 83.2% 53.3%");
    }

    // FIXED: Set background and text colors properly
    if (isDark) {
      root.style.setProperty("--background", "222.2 84% 4.9%");
      root.style.setProperty("--foreground", "210 40% 98%");
      root.style.setProperty("--card", "222.2 84% 4.9%");
      root.style.setProperty("--card-foreground", "210 40% 98%");
      body.style.backgroundColor = "hsl(222.2 84% 4.9%)";
      body.style.color = "hsl(210 40% 98%)";
    } else {
      // FORCE LIGHT MODE
      root.style.setProperty("--background", "0 0% 100%");
      root.style.setProperty("--foreground", "222.2 84% 4.9%");
      root.style.setProperty("--card", "0 0% 100%");
      root.style.setProperty("--card-foreground", "222.2 84% 4.9%");
      body.style.backgroundColor = "#ffffff";
      body.style.color = "#0f172a";
    }

    // Set sidebar width custom property
    root.style.setProperty(
      "--sidebar-width",
      sidebarOpen && !isMobile && !isTablet ? "288px" : "64px",
    );

    // FIXED: Meta theme color for browser UI
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", isDark ? "#0f172a" : "#ffffff");
    }
  }, [isDark, isAdminMode, isMobile, isTablet, config, sidebarOpen]);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);

    // Save preference for non-mobile devices
    if (!isMobile) {
      localStorage.setItem("lawdesk-sidebar-open", JSON.stringify(newState));
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col overflow-hidden",
        // FIXED: Force light background
        "bg-white text-gray-900",
        isDark && "dark:bg-gray-900 dark:text-gray-100",
        isAdminMode && "admin-mode",
        isMobile && "mobile-layout",
        isTablet && "tablet-layout",
      )}
    >
      {/* Mobile Overlay */}
      <AnimatePresence>
        {(isMobile || isTablet) && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Layout Container */}
      <div className="flex flex-1 min-h-0">
        {/* FIXED: Sidebar with proper z-index and positioning */}
        <aside
          className={cn(
            "z-50 transition-all duration-300 ease-out sidebar-container",
            // Mobile: fixed overlay
            isMobile && [
              "fixed inset-y-0 left-0",
              sidebarOpen ? "translate-x-0" : "-translate-x-full",
            ],
            // Tablet: fixed overlay with larger width
            isTablet && [
              "fixed inset-y-0 left-0",
              sidebarOpen ? "translate-x-0" : "-translate-x-full",
            ],
            // Desktop: relative positioning with smooth collapse
            !isMobile &&
              !isTablet && [
                "relative flex-shrink-0",
                sidebarOpen ? "w-72" : "w-16",
              ],
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
          {/* FIXED: Header with proper z-index */}
          <header className="topbar-container">
            <CorrectedTopbar
              onMenuClick={toggleSidebar}
              sidebarOpen={sidebarOpen}
              isMobile={isMobile}
            />
          </header>

          {/* FIXED: Page Content with proper scrolling */}
          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
            <div
              className={cn(
                "container mx-auto max-w-7xl",
                // Modern spacing system
                "px-4 py-6 sm:px-6 sm:py-8 lg:px-8",
                // Reduced padding on mobile
                isMobile && "px-4 py-4",
                isTablet && "px-6 py-6",
              )}
            >
              <motion.div
                key={isAdminMode ? "admin-content" : "client-content"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: config.accessibility.reducedMotion ? 0.01 : 0.3,
                  ease: "easeOut",
                }}
                className="w-full"
              >
                <Outlet />
              </motion.div>
            </div>
          </main>
        </div>
      </div>

      {/* FIXED: Chat Widget with proper positioning */}
      <ConversacaoWidget
        className={cn(
          "fixed bottom-4 right-4 z-30",
          isMobile && isAdminMode && "bottom-20",
        )}
      />

      {/* FIXED: Global keyboard shortcuts */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Global keyboard shortcuts
            document.addEventListener('keydown', function(e) {
              if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                // Trigger search dialog
                const searchTrigger = document.querySelector('[data-search-trigger]');
                if (searchTrigger) searchTrigger.click();
              }
              
              // Alt + M to toggle sidebar
              if (e.altKey && e.key === 'm') {
                e.preventDefault();
                window.toggleSidebar?.();
              }
            });
            
            // Expose sidebar toggle globally
            window.toggleSidebar = () => {
              const sidebarToggle = document.querySelector('[data-sidebar-toggle]');
              if (sidebarToggle) sidebarToggle.click();
            };
          `,
        }}
      />

      {/* FIXED: Critical styles for immediate theme application */}
      <style jsx global>{`
        /* Immediate theme application to prevent flash */
        html {
          background-color: #ffffff !important;
          color: #0f172a !important;
        }

        html.dark {
          background-color: #0f172a !important;
          color: #f8fafc !important;
        }

        body {
          background-color: inherit !important;
          color: inherit !important;
          transition:
            background-color 0.2s ease,
            color 0.2s ease;
        }

        /* Admin mode color overrides */
        .admin-mode {
          --primary: 0 84% 60% !important;
          --primary-foreground: 210 40% 98% !important;
          --accent: 0 84% 60% !important;
          --ring: 0 84% 60% !important;
        }

        /* Client mode color overrides */
        .client-mode {
          --primary: 221.2 83.2% 53.3% !important;
          --primary-foreground: 210 40% 98% !important;
          --accent: 221.2 83.2% 53.3% !important;
          --ring: 221.2 83.2% 53.3% !important;
        }

        /* Force light mode backgrounds */
        .bg-background {
          background-color: #ffffff !important;
        }

        .dark .bg-background {
          background-color: #0f172a !important;
        }

        .text-foreground {
          color: #0f172a !important;
        }

        .dark .text-foreground {
          color: #f8fafc !important;
        }

        /* Card styles */
        .bg-card {
          background-color: #ffffff !important;
        }

        .dark .bg-card {
          background-color: #1e293b !important;
        }

        /* Sidebar container */
        .sidebar-container {
          background-color: #ffffff !important;
          border-right: 1px solid #e2e8f0 !important;
        }

        .dark .sidebar-container {
          background-color: #1e293b !important;
          border-right: 1px solid #334155 !important;
        }

        /* Topbar container */
        .topbar-container {
          background-color: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e2e8f0 !important;
        }

        .dark .topbar-container {
          background-color: rgba(30, 41, 59, 0.95) !important;
          border-bottom: 1px solid #334155 !important;
        }

        /* Fix any remaining dark backgrounds */
        [style*="rgb(2, 8, 23)"] {
          background-color: #ffffff !important;
        }

        .dark [style*="rgb(2, 8, 23)"] {
          background-color: #0f172a !important;
        }

        /* Ensure modals and dropdowns have correct z-index */
        .z-modal {
          z-index: 1050 !important;
        }

        .z-modal-backdrop {
          z-index: 1040 !important;
        }

        .z-dropdown {
          z-index: 1000 !important;
        }

        .z-popover {
          z-index: 1060 !important;
        }

        .z-tooltip {
          z-index: 1070 !important;
        }

        .z-toast {
          z-index: 1080 !important;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .mobile-layout .container {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
        }

        @media (min-width: 768px) and (max-width: 1024px) {
          .tablet-layout .container {
            padding-left: 1.5rem !important;
            padding-right: 1.5rem !important;
          }
        }

        /* Performance optimizations */
        .sidebar-container,
        .topbar-container {
          will-change: transform;
          transform: translateZ(0);
        }

        /* Smooth transitions */
        * {
          transition-property:
            background-color, border-color, color, fill, stroke, opacity,
            box-shadow, transform;
          transition-duration: 0.2s;
          transition-timing-function: ease-out;
        }

        .reduced-motion * {
          transition-duration: 0.01ms !important;
          animation-duration: 0.01ms !important;
        }
      `}</style>
    </div>
  );
}
