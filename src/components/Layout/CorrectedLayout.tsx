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

  // Enhanced responsive behavior with modern breakpoints
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

  // Apply modern theme and mode classes
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // Theme application
    html.classList.toggle("dark", isDark);
    html.classList.toggle("admin-mode", isAdminMode);
    html.classList.toggle("mobile", isMobile);
    html.classList.toggle("tablet", isTablet);

    // Apply accessibility settings
    html.classList.toggle("reduced-motion", config.accessibility.reducedMotion);
    html.classList.toggle("large-text", config.accessibility.largeText);
    html.classList.toggle("high-contrast", config.accessibility.highContrast);

    // Modern scrollbar styles
    body.className = cn(
      "antialiased font-sans",
      isDark ? "dark" : "light",
      isAdminMode && "admin-theme",
      isMobile && "mobile-layout",
      isTablet && "tablet-layout",
      config.accessibility.reducedMotion && "reduced-motion",
      config.accessibility.largeText && "large-text",
    );

    // CSS custom properties for consistent theming
    const root = document.documentElement;
    root.style.setProperty(
      "--primary-color",
      isAdminMode ? "0 84% 60%" : "221.2 83.2% 53.3%",
    );
    root.style.setProperty(
      "--background-color",
      isDark ? "222.2 84% 4.9%" : "0 0% 100%",
    );
    root.style.setProperty(
      "--sidebar-width",
      sidebarOpen && !isMobile && !isTablet ? "288px" : "64px",
    );
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
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
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
        {/* Sidebar */}
        <aside
          className={cn(
            "z-50 transition-all duration-300 ease-out",
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
          {/* Modern Header */}
          <CorrectedTopbar
            onMenuClick={toggleSidebar}
            sidebarOpen={sidebarOpen}
            isMobile={isMobile}
          />

          {/* Page Content with Modern Scrolling */}
          <main className="flex-1 overflow-auto relative">
            <div
              className={cn(
                "container mx-auto max-w-7xl",
                // Modern spacing system
                "px-4 py-6 sm:px-6 sm:py-8 lg:px-8",
                // Reduced padding on mobile for better space utilization
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

      {/* Chat Widget with improved positioning */}
      <ConversacaoWidget
        className={cn(
          "fixed bottom-4 right-4 z-30",
          isMobile && isAdminMode && "bottom-20",
        )}
      />

      {/* Global Styles for Modern SaaS Design */}
      <style jsx global>{`
        /* Modern CSS Reset and Base Styles */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          scroll-behavior: smooth;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        body {
          font-family:
            "Inter",
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            "Roboto",
            "Oxygen",
            "Ubuntu",
            "Cantarell",
            sans-serif;
          line-height: 1.6;
          letter-spacing: -0.01em;
        }

        /* Modern Scrollbar Design */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 3px;
          transition: background 0.2s ease;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }

        /* Mobile-specific optimizations */
        .mobile-layout {
          --min-touch-target: 44px;
        }

        .mobile-layout button,
        .mobile-layout [role="button"],
        .mobile-layout [tabindex="0"] {
          min-height: var(--min-touch-target);
          min-width: var(--min-touch-target);
        }

        /* Prevent zoom on iOS form inputs */
        .mobile-layout input,
        .mobile-layout textarea,
        .mobile-layout select {
          font-size: 16px !important;
        }

        /* Enhanced touch scrolling */
        .mobile-layout {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }

        /* Admin Theme Colors */
        .admin-theme {
          --primary: 0 84% 60%;
          --primary-foreground: 210 40% 98%;
          --accent: 0 84% 60%;
          --accent-foreground: 210 40% 98%;
        }

        /* Client Theme Colors */
        .light:not(.admin-theme) {
          --primary: 221.2 83.2% 53.3%;
          --primary-foreground: 210 40% 98%;
          --accent: 221.2 83.2% 53.3%;
          --accent-foreground: 210 40% 98%;
        }

        /* Modern Focus Styles */
        :focus-visible {
          outline: 2px solid hsl(var(--primary));
          outline-offset: 2px;
          border-radius: 4px;
        }

        /* High Contrast Mode */
        .high-contrast {
          --border: 0 0% 20%;
          --muted: 0 0% 90%;
          --muted-foreground: 0 0% 10%;
        }

        .high-contrast.dark {
          --border: 0 0% 80%;
          --muted: 0 0% 10%;
          --muted-foreground: 0 0% 90%;
        }

        /* Reduced Motion */
        .reduced-motion *,
        .reduced-motion *::before,
        .reduced-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }

        /* Large Text Support */
        .large-text {
          font-size: 1.125em;
        }

        .large-text h1 {
          font-size: 2.5rem;
        }
        .large-text h2 {
          font-size: 2rem;
        }
        .large-text h3 {
          font-size: 1.75rem;
        }
        .large-text h4 {
          font-size: 1.5rem;
        }
        .large-text h5 {
          font-size: 1.25rem;
        }
        .large-text h6 {
          font-size: 1.125rem;
        }

        /* Modern Card Styles */
        .modern-card {
          border-radius: 12px;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--card));
          box-shadow:
            0 1px 3px 0 rgb(0 0 0 / 0.1),
            0 1px 2px -1px rgb(0 0 0 / 0.1);
          transition: all 0.2s ease;
        }

        .modern-card:hover {
          box-shadow:
            0 4px 6px -1px rgb(0 0 0 / 0.1),
            0 2px 4px -2px rgb(0 0 0 / 0.1);
          transform: translateY(-1px);
        }

        /* Modern Button Styles */
        .modern-button {
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;
          border: none;
          outline: none;
        }

        .modern-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
        }

        .modern-button:active {
          transform: translateY(0);
        }

        /* Modern Input Styles */
        .modern-input {
          border-radius: 8px;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          transition: all 0.2s ease;
        }

        .modern-input:focus {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
        }

        /* Modern Modal/Dialog Styles */
        .modern-modal {
          border-radius: 16px;
          border: 1px solid hsl(var(--border));
          box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
        }

        /* Safe Area Support for iOS */
        @supports (padding: max(0px)) {
          .mobile-layout {
            padding-left: max(16px, env(safe-area-inset-left));
            padding-right: max(16px, env(safe-area-inset-right));
            padding-bottom: max(16px, env(safe-area-inset-bottom));
          }
        }

        /* Dark Mode Optimizations */
        .dark {
          color-scheme: dark;
        }

        .dark .modern-card {
          background: hsl(var(--card));
          border-color: hsl(var(--border));
        }

        /* Print Styles */
        @media print {
          .sidebar-layout,
          .topbar-layout,
          .chat-widget {
            display: none !important;
          }

          .main-content {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }

        /* RTL Support */
        [dir="rtl"] .sidebar-layout {
          right: 0;
          left: auto;
        }

        [dir="rtl"] .chat-widget {
          left: 1rem;
          right: auto;
        }
      `}</style>
    </div>
  );
}
