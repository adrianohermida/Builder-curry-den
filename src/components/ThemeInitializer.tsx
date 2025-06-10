/**
 * 🎨 THEME INITIALIZER - SISTEMA DE TEMAS LAWDESK
 *
 * Inicializador de temas otimizado e limpo:
 * - Tema claro como padrão
 * - Azul para modo cliente
 * - Vermelho para modo admin
 * - Sem efeitos visuais excessivos
 */

import React, { useEffect } from "react";

interface ThemeInitializerProps {
  defaultMode?: "client" | "admin";
}

export const ThemeInitializer: React.FC<ThemeInitializerProps> = ({
  defaultMode = "client",
}) => {
  useEffect(() => {
    // Set default theme variables
    const root = document.documentElement;

    // Always use light theme as requested
    root.classList.remove("dark");
    root.classList.add("light");

    // Set mode-specific colors
    if (defaultMode === "admin") {
      root.classList.add("admin-mode");
      root.classList.remove("client-mode");

      // Admin colors (red)
      root.style.setProperty("--primary", "220 38 38"); // red-600
      root.style.setProperty("--primary-foreground", "255 255 255");
      root.style.setProperty("--ring", "220 38 38");
    } else {
      root.classList.add("client-mode");
      root.classList.remove("admin-mode");

      // Client colors (blue) - default
      root.style.setProperty("--primary", "37 99 235"); // blue-600
      root.style.setProperty("--primary-foreground", "255 255 255");
      root.style.setProperty("--ring", "37 99 235");
    }

    // Core light theme colors
    root.style.setProperty("--background", "249 250 251"); // gray-50
    root.style.setProperty("--foreground", "17 24 39"); // gray-900
    root.style.setProperty("--card", "255 255 255"); // white
    root.style.setProperty("--card-foreground", "17 24 39"); // gray-900
    root.style.setProperty("--popover", "255 255 255"); // white
    root.style.setProperty("--popover-foreground", "17 24 39"); // gray-900
    root.style.setProperty("--secondary", "243 244 246"); // gray-100
    root.style.setProperty("--secondary-foreground", "17 24 39"); // gray-900
    root.style.setProperty("--muted", "249 250 251"); // gray-50
    root.style.setProperty("--muted-foreground", "107 114 128"); // gray-500
    root.style.setProperty("--accent", "243 244 246"); // gray-100
    root.style.setProperty("--accent-foreground", "17 24 39"); // gray-900
    root.style.setProperty("--destructive", "239 68 68"); // red-500
    root.style.setProperty("--destructive-foreground", "255 255 255");
    root.style.setProperty("--border", "229 231 235"); // gray-200
    root.style.setProperty("--input", "229 231 235"); // gray-200
    root.style.setProperty("--radius", "0.5rem");

    // Ensure proper font loading
    document.body.style.fontFamily =
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

    // Set proper background
    document.body.style.backgroundColor = "rgb(249 250 251)";
    document.body.style.color = "rgb(17 24 39)";

    // Remove any conflicting styles
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.minHeight = "100vh";
    document.body.style.lineHeight = "1.5";

    // Ensure proper box-sizing
    document.documentElement.style.boxSizing = "border-box";

    // Optimize rendering
    document.body.style.webkitFontSmoothing = "antialiased";
    document.body.style.mozOsxFontSmoothing = "grayscale";

    // Store theme preference
    localStorage.setItem("lawdesk-theme", "light");
    localStorage.setItem("lawdesk-mode", defaultMode);
  }, [defaultMode]);

  // Theme switcher function (for future use)
  const switchMode = (mode: "client" | "admin") => {
    const root = document.documentElement;

    if (mode === "admin") {
      root.classList.add("admin-mode");
      root.classList.remove("client-mode");
      root.style.setProperty("--primary", "220 38 38");
      root.style.setProperty("--ring", "220 38 38");
    } else {
      root.classList.add("client-mode");
      root.classList.remove("admin-mode");
      root.style.setProperty("--primary", "37 99 235");
      root.style.setProperty("--ring", "37 99 235");
    }

    localStorage.setItem("lawdesk-mode", mode);
  };

  // Expose theme functions globally for debugging
  useEffect(() => {
    // @ts-ignore
    window.lawdeskTheme = {
      switchMode,
      getCurrentMode: () => localStorage.getItem("lawdesk-mode") || "client",
      getCurrentTheme: () => localStorage.getItem("lawdesk-theme") || "light",
    };
  }, []);

  return null; // This component doesn't render anything
};

export default ThemeInitializer;
