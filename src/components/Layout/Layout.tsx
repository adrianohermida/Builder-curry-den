import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "@/components/ui/mobile-nav";
import { ResponsiveInspector } from "@/components/dev/ResponsiveInspector";
import { cn } from "@/lib/utils";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <div className="app-container">
      {/* Mobile Navigation Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex h-full">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <div
          className={cn(
            "flex-1 flex flex-col overflow-hidden",
            !isMobile && sidebarOpen ? "lg:ml-0" : "",
          )}
        >
          <Topbar
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
            showMobileNav={isMobile}
          />

          <main className="content-area space-responsive">
            <div className="container-responsive max-w-none">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && <MobileNav />}

      {/* Development Tools */}
      <ResponsiveInspector />

      {/* Bottom padding for mobile navigation */}
      {isMobile && <div className="h-16 lg:h-0" />}
    </div>
  );
}
