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
  }, [isDark, isAdminMode, isMobile, isTablet, config]);

  // FIXED: Toggle sidebar with responsive behavior
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
        // FIXED: Use CSS custom properties for consistent theming
        "bg-background text-foreground",
        isMobile && "mobile-layout",
        isTablet && "tablet-layout",
      )}
    >
      {/* FIXED: Mobile Overlay with light backdrop */}
      <AnimatePresence>
        {(isMobile || isTablet) && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Layout Container */}
      <div className="flex flex-1 min-h-0">
        {/* FIXED: Responsive Sidebar - no fixed widths */}
        <aside
          className={cn(
            "z-50 transition-all duration-300 ease-out sidebar-container",
            // Mobile: fixed overlay
            isMobile && [
              "fixed inset-y-0 left-0",
              sidebarOpen ? "translate-x-0" : "-translate-x-full",
              "w-80", // Compact mobile width
            ],
            // Tablet: fixed overlay
            isTablet && [
              "fixed inset-y-0 left-0",
              sidebarOpen ? "translate-x-0" : "-translate-x-full",
              "w-64", // Medium tablet width
            ],
            // Desktop: relative positioning with responsive widths
            !isMobile &&
              !isTablet && [
                "relative flex-shrink-0",
                sidebarOpen ? "w-64 xl:w-72" : "w-16", // Responsive desktop widths
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

          {/* FIXED: Page Content with responsive spacing */}
          <main className="flex-1 overflow-auto bg-background">
            <div
              className={cn(
                "w-full max-w-none",
                // Responsive padding system
                "p-3 sm:p-4 md:p-6 lg:p-8",
                // Compact mobile spacing
                isMobile && "p-3",
                isTablet && "p-4",
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

      {/* FIXED: Conversation Widget with responsive positioning */}
      <ConversacaoWidget />
    </div>
  );
}
