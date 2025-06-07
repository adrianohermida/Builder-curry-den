import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "@/components/ui/mobile-nav";
import { ResponsiveInspector } from "@/components/dev/ResponsiveInspector";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isDark } = useTheme();

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

    // Ensure consistent color scheme
    html.style.colorScheme = isDark ? "dark" : "light";
  }, [isDark]);

  return (
    <div className="app-container">
      {/* Mobile Navigation Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
          aria-label="Fechar menu lateral"
        />
      )}

      <div className="flex h-full">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        {/* Main Content Area */}
        <div
          className={cn(
            "flex-1 flex flex-col overflow-hidden",
            "transition-all duration-300 ease-in-out",
            !isMobile && sidebarOpen ? "lg:ml-0" : "",
          )}
        >
          {/* Top Navigation Bar */}
          <Topbar
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
            showMobileNav={isMobile}
          />

          {/* Main Content */}
          <main
            className={cn(
              "content-area flex-1 overflow-auto",
              "bg-background text-foreground",
              "p-4 sm:p-6 lg:p-8",
              "space-y-6",
            )}
          >
            <div className="container-responsive max-w-none">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && <MobileNav />}

      {/* Development Tools */}
      {process.env.NODE_ENV === "development" && <ResponsiveInspector />}

      {/* Bottom padding for mobile navigation */}
      {isMobile && <div className="h-16 lg:h-0" />}
    </div>
  );
}
