import { useEffect } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { useViewMode } from "@/contexts/ViewModeContext";

/**
 * ThemeInitializer - Forces light mode and proper admin/client colors
 * Removes any dark mode remnants and ensures consistent theming
 */
export function ThemeInitializer() {
  const { config } = useTheme();
  const { isAdminMode } = useViewMode();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // CRITICAL: Remove ALL dark mode classes and force light
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

    // FORCE light mode classes
    html.classList.add("light");
    body.classList.add("light");

    // CRITICAL: Force light color scheme
    html.style.colorScheme = "light";
    body.style.backgroundColor = "#ffffff";
    body.style.color = "#0f172a";

    // Apply admin/client mode classes AFTER forcing light
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

    // Apply CSS custom properties for consistent theming
    const root = document.documentElement;

    // CRITICAL: Force light mode variables
    root.style.setProperty("--background", "0 0% 100%");
    root.style.setProperty("--foreground", "222.2 84% 4.9%");
    root.style.setProperty("--card", "0 0% 100%");
    root.style.setProperty("--card-foreground", "222.2 84% 4.9%");
    root.style.setProperty("--popover", "0 0% 100%");
    root.style.setProperty("--popover-foreground", "222.2 84% 4.9%");
    root.style.setProperty("--secondary", "210 40% 96%");
    root.style.setProperty("--secondary-foreground", "222.2 84% 4.9%");
    root.style.setProperty("--muted", "210 40% 98%");
    root.style.setProperty("--muted-foreground", "215.4 16.3% 46.9%");
    root.style.setProperty("--accent", "210 40% 98%");
    root.style.setProperty("--accent-foreground", "222.2 84% 4.9%");
    root.style.setProperty("--border", "214.3 31.8% 91.4%");
    root.style.setProperty("--input", "214.3 31.8% 91.4%");
    root.style.setProperty("--destructive", "0 84.2% 60.2%");
    root.style.setProperty("--destructive-foreground", "210 40% 98%");

    // Set colors based on admin/client mode
    if (isAdminMode) {
      // Red theme for admin
      root.style.setProperty("--primary", "0 84% 60%");
      root.style.setProperty("--primary-foreground", "210 40% 98%");
      root.style.setProperty("--ring", "0 84% 60%");
    } else {
      // Blue theme for client
      root.style.setProperty("--primary", "221.2 83.2% 53.3%");
      root.style.setProperty("--primary-foreground", "210 40% 98%");
      root.style.setProperty("--ring", "221.2 83.2% 53.3%");
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

    // CRITICAL: Clean up any problematic inline styles
    const cleanupDarkStyles = () => {
      // Find elements with dark background styles
      const allElements = document.querySelectorAll("*[style]");

      allElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          const style = element.style;

          // Check for dark backgrounds
          if (
            style.backgroundColor?.includes("rgb(2, 8, 23)") ||
            style.backgroundColor?.includes("rgb(15, 23, 42)") ||
            style.backgroundColor?.includes("rgb(17, 24, 39)") ||
            style.backgroundColor?.includes("rgb(31, 41, 55)") ||
            style.backgroundColor?.includes("#020817") ||
            style.backgroundColor?.includes("#0f172a") ||
            style.backgroundColor?.includes("#111827") ||
            style.backgroundColor?.includes("#1f2937")
          ) {
            style.backgroundColor = "#ffffff";
            style.color = "#0f172a";
          }

          // Check for light text colors that would be invisible on white
          if (
            style.color?.includes("rgb(248, 250, 252)") ||
            style.color?.includes("rgb(241, 245, 249)") ||
            style.color?.includes("rgb(226, 232, 240)") ||
            style.color?.includes("#f8fafc") ||
            style.color?.includes("#f1f5f9") ||
            style.color?.includes("#e2e8f0") ||
            style.color?.includes("white") ||
            style.color?.includes("#ffffff")
          ) {
            style.color = "#0f172a";
          }
        }
      });
    };

    // Initial cleanup
    cleanupDarkStyles();

    // Set up mutation observer to catch dynamic changes
    const observer = new MutationObserver((mutations) => {
      let needsCleanup = false;

      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          (mutation.attributeName === "style" ||
            mutation.attributeName === "class")
        ) {
          needsCleanup = true;
        }

        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              needsCleanup = true;
            }
          });
        }
      });

      if (needsCleanup) {
        cleanupDarkStyles();

        // Re-ensure light mode classes
        if (!html.classList.contains("light")) {
          html.classList.add("light");
          html.classList.remove("dark");
        }

        if (!body.classList.contains("light")) {
          body.classList.add("light");
          body.classList.remove("dark");
        }
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style", "class"],
      childList: true,
      subtree: true,
    });

    // Set meta theme color for mobile browsers
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.setAttribute("name", "theme-color");
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute("content", "#ffffff");

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

    console.log("🎨 Theme FORCED to light mode:", {
      mode: "light",
      adminMode: isAdminMode,
      primaryColor: isAdminMode ? "red (#DC2626)" : "blue (#3B82F6)",
      background: "#ffffff",
      foreground: "#0f172a",
    });

    return () => {
      observer.disconnect();
    };
  }, [config, isAdminMode]);

  // This component doesn't render anything, it just handles theme initialization
  return null;
}
