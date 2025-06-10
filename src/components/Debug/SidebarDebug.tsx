/**
 * 🐛 SIDEBAR DEBUG - COMPONENTE DE DEBUG PARA SIDEBAR
 *
 * Componente temporário para debugar problemas do sidebar:
 * - Mostra estado atual do sidebar
 * - Força renderização do sidebar
 * - Testa funcionalidades
 */

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Menu, RefreshCw } from "lucide-react";

const SidebarDebug: React.FC = () => {
  const [sidebarElement, setSidebarElement] = useState<Element | null>(null);
  const [sidebarState, setSidebarState] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  // ===== CHECK SIDEBAR STATUS =====
  const checkSidebar = () => {
    const sidebar = document.querySelector('[data-sidebar="true"]');
    setSidebarElement(sidebar);

    if (sidebar) {
      const computedStyle = window.getComputedStyle(sidebar);
      const rect = sidebar.getBoundingClientRect();

      setSidebarState({
        found: true,
        display: computedStyle.display,
        visibility: computedStyle.visibility,
        opacity: computedStyle.opacity,
        zIndex: computedStyle.zIndex,
        width: computedStyle.width,
        height: computedStyle.height,
        position: computedStyle.position,
        left: computedStyle.left,
        top: computedStyle.top,
        backgroundColor: computedStyle.backgroundColor,
        borderRight: computedStyle.borderRight,
        transform: computedStyle.transform,
        classes: Array.from(sidebar.classList),
        rect: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        },
        children: sidebar.children.length,
      });

      // Check if sidebar is actually visible
      const isElementVisible =
        computedStyle.display !== "none" &&
        computedStyle.visibility !== "hidden" &&
        parseFloat(computedStyle.opacity) > 0 &&
        rect.width > 0 &&
        rect.height > 0;

      setIsVisible(isElementVisible);
    } else {
      setSidebarState({
        found: false,
        message: "Sidebar element not found in DOM",
      });
      setIsVisible(false);
    }
  };

  // ===== FORCE SIDEBAR VISIBLE =====
  const forceSidebarVisible = () => {
    const sidebar = document.querySelector(
      '[data-sidebar="true"]',
    ) as HTMLElement;
    if (sidebar) {
      sidebar.style.display = "flex";
      sidebar.style.visibility = "visible";
      sidebar.style.opacity = "1";
      sidebar.style.transform = "none";
      sidebar.style.left = "0";
      sidebar.style.zIndex = "40";

      console.log("🔧 Forced sidebar visible");
      checkSidebar();
    }
  };

  // ===== TOGGLE SIDEBAR =====
  const toggleSidebar = () => {
    const sidebar = document.querySelector(
      '[data-sidebar="true"]',
    ) as HTMLElement;
    if (sidebar) {
      const isCurrentlyHidden =
        sidebar.style.display === "none" ||
        sidebar.classList.contains("hidden");

      if (isCurrentlyHidden) {
        sidebar.style.display = "flex";
        sidebar.classList.remove("hidden");
      } else {
        sidebar.style.display = "none";
        sidebar.classList.add("hidden");
      }

      checkSidebar();
    }
  };

  // ===== RELOAD PAGE =====
  const reloadPage = () => {
    window.location.reload();
  };

  // ===== AUTO CHECK =====
  useEffect(() => {
    checkSidebar();

    const interval = setInterval(checkSidebar, 2000);
    return () => clearInterval(interval);
  }, []);

  // ===== RENDER =====
  return (
    <div className="fixed top-4 left-4 z-50 w-80">
      <Card className="bg-white shadow-lg border-2 border-red-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-red-700 flex items-center">
            🐛 Sidebar Debug
            <Badge variant="destructive" className="ml-2">
              {sidebarState?.found ? "FOUND" : "NOT FOUND"}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant={isVisible ? "success" : "destructive"}>
                {isVisible ? (
                  <>
                    <Eye size={12} className="mr-1" />
                    VISIBLE
                  </>
                ) : (
                  <>
                    <EyeOff size={12} className="mr-1" />
                    HIDDEN
                  </>
                )}
              </Badge>
            </div>

            {sidebarState && sidebarState.found && (
              <div className="text-xs space-y-1 bg-gray-50 p-2 rounded">
                <div>
                  Display: <code>{sidebarState.display}</code>
                </div>
                <div>
                  Visibility: <code>{sidebarState.visibility}</code>
                </div>
                <div>
                  Opacity: <code>{sidebarState.opacity}</code>
                </div>
                <div>
                  Width: <code>{sidebarState.width}</code>
                </div>
                <div>
                  Z-Index: <code>{sidebarState.zIndex}</code>
                </div>
                <div>
                  Position: <code>{sidebarState.left}</code>
                </div>
                <div>
                  Children: <code>{sidebarState.children}</code>
                </div>
                <div>
                  Classes: <code>{sidebarState.classes.join(", ")}</code>
                </div>
              </div>
            )}

            {sidebarState && !sidebarState.found && (
              <div className="text-xs bg-red-50 p-2 rounded text-red-700">
                ❌ {sidebarState.message}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={checkSidebar}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <RefreshCw size={14} className="mr-2" />
              Refresh Check
            </Button>

            <Button
              onClick={forceSidebarVisible}
              variant="destructive"
              size="sm"
              className="w-full"
              disabled={!sidebarElement}
            >
              <Eye size={14} className="mr-2" />
              Force Visible
            </Button>

            <Button
              onClick={toggleSidebar}
              variant="secondary"
              size="sm"
              className="w-full"
              disabled={!sidebarElement}
            >
              <Menu size={14} className="mr-2" />
              Toggle Sidebar
            </Button>

            <Button
              onClick={reloadPage}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <RefreshCw size={14} className="mr-2" />
              Reload Page
            </Button>
          </div>

          {/* Layout Info */}
          <div className="text-xs bg-blue-50 p-2 rounded">
            <div>
              <strong>Current Path:</strong> {window.location.pathname}
            </div>
            <div>
              <strong>Layout Container:</strong>{" "}
              {document.querySelector('[data-layout-container="true"]')
                ? "✅"
                : "❌"}
            </div>
            <div>
              <strong>Router Element:</strong>{" "}
              {document.querySelector("[data-router]") ? "✅" : "❌"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SidebarDebug;
