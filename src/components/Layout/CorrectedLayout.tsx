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
  const { config } = useTheme();
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

  // CRITICAL: Force light mode and apply admin/client classes
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // REMOVE ALL dark mode classes
    const darkClasses = [
      "dark",
      "system",
      "auto",
      "bg-gray-900",
      "bg-slate-900",
      "bg-stone-900",
      "bg-zinc-900",
      "bg-neutral-900",
      "text-gray-100",
      "text-slate-100",
      "text-white",
    ];

    darkClasses.forEach((cls) => {
      html.classList.remove(cls);
      body.classList.remove(cls);
    });

    // FORCE light mode
    html.classList.add("light");
    body.classList.add("light");

    // FORCE light colors
    html.style.colorScheme = "light";
    body.style.backgroundColor = "#ffffff";
    body.style.color = "#0f172a";

    // Apply admin/client mode classes
    if (isAdminMode) {
      html.classList.add("admin-mode");
      body.classList.add("admin-mode");
      html.classList.remove("client-mode");
      body.classList.remove("client-mode");
    } else {
      html.classList.add("client-mode");
      body.classList.add("client-mode");
      html.classList.remove("admin-mode");
      body.classList.remove("admin-mode");
    }

    // Apply device classes
    if (isMobile) {
      html.classList.add("mobile");
      body.classList.add("mobile-layout");
    } else {
      html.classList.remove("mobile");
      body.classList.remove("mobile-layout");
    }

    if (isTablet) {
      html.classList.add("tablet");
      body.classList.add("tablet-layout");
    } else {
      html.classList.remove("tablet");
      body.classList.remove("tablet-layout");
    }

    // Apply accessibility settings
    if (config.accessibility.reducedMotion) {
      html.classList.add("reduced-motion");
    } else {
      html.classList.remove("reduced-motion");
    }

    if (config.accessibility.largeText) {
      html.classList.add("large-text");
    } else {
      html.classList.remove("large-text");
    }

    if (config.accessibility.highContrast) {
      html.classList.add("high-contrast");
    } else {
      html.classList.remove("high-contrast");
    }

    // CRITICAL: Clean up any dark inline styles
    const cleanupDarkElements = () => {
      const darkElements = document.querySelectorAll(
        '[style*="rgb(2, 8, 23)"], [style*="background-color: rgb(2, 8, 23)"], [style*="rgb(15, 23, 42)"], [style*="background-color: rgb(15, 23, 42)"]',
      );

      darkElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          element.style.backgroundColor = "#ffffff";
          element.style.color = "#0f172a";
        }
      });
    };

    cleanupDarkElements();

    // Set up interval to continuously clean up dark elements
    const cleanupInterval = setInterval(cleanupDarkElements, 1000);

    return () => {
      clearInterval(cleanupInterval);
    };
  }, [isAdminMode, isMobile, isTablet, config]);

  // Toggle sidebar with responsive behavior
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
        // CRITICAL: Force white background
        "bg-white text-gray-900",
        isMobile && "mobile-layout",
        isTablet && "tablet-layout",
      )}
      style={{
        backgroundColor: "#ffffff",
        color: "#0f172a",
      }}
    >
      {/* FIXED: Light backdrop overlay */}
      <AnimatePresence>
        {(isMobile || isTablet) && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Layout Container */}
      <div className="flex flex-1 min-h-0">
        {/* Responsive Sidebar */}
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
          style={{
            backgroundColor: "#ffffff",
            borderColor: "#e2e8f0",
          }}
        >
          <CorrectedSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            collapsed={!sidebarOpen && !isMobile && !isTablet}
          />
        </aside>

        {/* Main Content Area */}
        <div
          className="flex flex-col flex-1 min-w-0"
          style={{
            backgroundColor: "#ffffff",
          }}
        >
          {/* Header */}
          <header
            className="topbar-container"
            style={{
              backgroundColor: "#ffffff",
              borderColor: "#e2e8f0",
            }}
          >
            <CorrectedTopbar
              onMenuClick={toggleSidebar}
              sidebarOpen={sidebarOpen}
              isMobile={isMobile}
            />
          </header>

          {/* Page Content with light background */}
          <main
            className="flex-1 overflow-auto"
            style={{
              backgroundColor: "#ffffff",
            }}
          >
            <div
              className={cn(
                "w-full max-w-none",
                // Responsive padding system
                "p-3 sm:p-4 md:p-6 lg:p-8",
                // Compact mobile spacing
                isMobile && "p-3",
                isTablet && "p-4",
              )}
              style={{
                backgroundColor: "#ffffff",
              }}
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
                style={{
                  backgroundColor: "#ffffff",
                }}
              >
                <Outlet />
              </motion.div>
            </div>
          </main>
        </div>
      </div>

      {/* Conversation Widget */}
      <ConversacaoWidget />
    </div>
  );
}
