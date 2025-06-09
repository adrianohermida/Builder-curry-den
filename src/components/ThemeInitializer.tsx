import { useEffect } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { useViewMode } from "@/contexts/ViewModeContext";

/**
 * ThemeInitializer - Forces proper theme application on app startup
 * Ensures light mode is default and admin/client colors are applied correctly
 */
export function ThemeInitializer() {
  const { config, effectiveMode } = useTheme();
  const { isAdminMode } = useViewMode();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // CRITICAL: Force light mode as default
    html.classList.remove("dark");
    html.classList.add("light");

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

    // Force light background colors
    if (effectiveMode === "light") {
      body.style.backgroundColor = "#ffffff";
      body.style.color = "#0f172a";
      html.style.colorScheme = "light";
    } else {
      body.style.backgroundColor = "#0f172a";
      body.style.color = "#f8fafc";
      html.style.colorScheme = "dark";
    }

    // Apply CSS custom properties for consistent theming
    const root = document.documentElement;

    // Set colors based on admin/client mode
    if (isAdminMode) {
      // Red theme for admin
      root.style.setProperty("--primary", "0 84% 60%");
      root.style.setProperty("--primary-foreground", "210 40% 98%");
      root.style.setProperty("--accent", "0 84% 60%");
      root.style.setProperty("--ring", "0 84% 60%");
    } else {
      // Blue theme for client
      root.style.setProperty("--primary", "221.2 83.2% 53.3%");
      root.style.setProperty("--primary-foreground", "210 40% 98%");
      root.style.setProperty("--accent", "221.2 83.2% 53.3%");
      root.style.setProperty("--ring", "221.2 83.2% 53.3%");
    }

    // Force light mode color variables
    if (effectiveMode === "light") {
      root.style.setProperty("--background", "0 0% 100%");
      root.style.setProperty("--foreground", "222.2 84% 4.9%");
      root.style.setProperty("--card", "0 0% 100%");
      root.style.setProperty("--card-foreground", "222.2 84% 4.9%");
      root.style.setProperty("--muted", "210 40% 96%");
      root.style.setProperty("--muted-foreground", "215.4 16.3% 46.9%");
      root.style.setProperty("--border", "214.3 31.8% 91.4%");
      root.style.setProperty("--input", "214.3 31.8% 91.4%");
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

    // Remove any problematic dark backgrounds
    const darkElements = document.querySelectorAll(
      '[style*="rgb(2, 8, 23)"], [style*="background-color: rgb(2, 8, 23)"]',
    );
    darkElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.backgroundColor = "#ffffff";
        element.style.color = "#0f172a";
      }
    });

    // Set meta theme color for mobile browsers
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.setAttribute("name", "theme-color");
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute(
      "content",
      effectiveMode === "dark" ? "#0f172a" : "#ffffff",
    );

    // Set viewport meta for proper mobile rendering
    let metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
      metaViewport = document.createElement("meta");
      metaViewport.setAttribute("name", "viewport");
      document.head.appendChild(metaViewport);
    }
    metaViewport.setAttribute(
      "content",
      "width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no",
    );

    console.log("🎨 Theme initialized:", {
      mode: effectiveMode,
      adminMode: isAdminMode,
      primaryColor: isAdminMode ? "red" : "blue",
    });
  }, [config, effectiveMode, isAdminMode]);

  // This component doesn't render anything, it just handles theme initialization
  return null;
}
