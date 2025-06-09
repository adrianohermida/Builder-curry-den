import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export type ThemeMode = "light" | "dark" | "system";
export type ColorTheme =
  | "default"
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "red"
  | "custom";

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  focusVisible: boolean;
}

export interface BrandingSettings {
  logoUrl?: string;
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  borderRadius: number;
  fontFamily: string;
}

export interface ThemeConfig {
  mode: ThemeMode;
  colorTheme: ColorTheme;
  accessibility: AccessibilitySettings;
  branding: BrandingSettings;
  customColors?: Record<string, string>;
}

interface ThemeContextType {
  config: ThemeConfig;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  setMode: (mode: ThemeMode) => void;
  setColorTheme: (theme: ColorTheme) => void;
  setAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  setBranding: (settings: Partial<BrandingSettings>) => void;
  resetTheme: () => void;
  exportTheme: () => string;
  importTheme: (themeData: string) => boolean;
  isDark: boolean;
  isSystemDark: boolean;
  effectiveMode: "light" | "dark";
}

// CRITICAL: Always force light mode
const defaultThemeConfig: ThemeConfig = {
  mode: "light", // ALWAYS LIGHT
  colorTheme: "default",
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    focusVisible: true,
  },
  branding: {
    companyName: "Lawdesk",
    primaryColor: "221.2 83.2% 53.3%", // Blue for client mode
    secondaryColor: "210 40% 96%",
    accentColor: "221.2 83.2% 53.3%",
    borderRadius: 8,
    fontFamily: "Inter, system-ui, sans-serif",
  },
};

// Enhanced color theme mappings with client/admin distinction
const colorThemeMap: Record<ColorTheme, string> = {
  default: "221.2 83.2% 53.3%", // Blue (client default)
  blue: "221.2 83.2% 53.3%", // Client mode primary
  green: "142.1 76.2% 36.3%",
  purple: "262.1 83.3% 57.8%",
  orange: "24.6 95% 53.1%",
  red: "0 84% 60%", // Admin mode primary
  custom: "221.2 83.2% 53.3%", // fallback
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useLocalStorage<ThemeConfig>(
    "lawdesk-theme-config-v5", // Updated version to reset problematic configs
    defaultThemeConfig,
  );

  // FORCE: Always false for dark mode
  const [isSystemDark] = useState(false);

  // CRITICAL: Force light mode application
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // Remove ALL dark classes
    html.classList.remove("dark", "system", "auto");
    body.classList.remove("dark", "system", "auto");

    // FORCE light classes
    html.classList.add("light");
    body.classList.add("light");

    // Force light color scheme
    html.style.colorScheme = "light";
    body.style.backgroundColor = "#ffffff";
    body.style.color = "#0f172a";

    // Set CSS custom properties to force light mode
    const root = document.documentElement;

    // Light mode colors
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

    // Set primary color based on current theme
    const primaryColor =
      colorThemeMap[config.colorTheme] || colorThemeMap.default;
    root.style.setProperty("--primary", primaryColor);
    root.style.setProperty("--primary-foreground", "210 40% 98%");
    root.style.setProperty("--ring", primaryColor);

    // Accessibility
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

    // Force mobile layout detection
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        html.classList.add("mobile");
        body.classList.add("mobile-layout");
      } else {
        html.classList.remove("mobile");
        body.classList.remove("mobile-layout");
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Clean up any problematic styles
    const cleanupStyles = () => {
      // Remove any elements with dark backgrounds
      const darkElements = document.querySelectorAll(
        '[style*="rgb(2, 8, 23)"], [style*="background-color: rgb(2, 8, 23)"], [style*="bg-gray-900"], [style*="bg-slate-900"]',
      );

      darkElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          element.style.backgroundColor = "#ffffff";
          element.style.color = "#0f172a";
        }
      });
    };

    // Initial cleanup
    cleanupStyles();

    // Set up mutation observer to catch dynamic style changes
    const observer = new MutationObserver(() => {
      cleanupStyles();
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style", "class"],
      subtree: true,
    });

    return () => {
      window.removeEventListener("resize", checkMobile);
      observer.disconnect();
    };
  }, [config]);

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    // Always force light mode
    const newConfig = {
      ...config,
      ...updates,
      mode: "light" as ThemeMode, // FORCE LIGHT
    };
    setConfig(newConfig);
  };

  const setMode = (mode: ThemeMode) => {
    // Ignore mode changes, always stay light
    updateTheme({ mode: "light" });
  };

  const setColorTheme = (theme: ColorTheme) => {
    updateTheme({ colorTheme: theme });
  };

  const setAccessibility = (settings: Partial<AccessibilitySettings>) => {
    updateTheme({
      accessibility: { ...config.accessibility, ...settings },
    });
  };

  const setBranding = (settings: Partial<BrandingSettings>) => {
    updateTheme({
      branding: { ...config.branding, ...settings },
    });
  };

  const resetTheme = () => {
    setConfig({ ...defaultThemeConfig, mode: "light" });
  };

  const exportTheme = (): string => {
    return JSON.stringify({ ...config, mode: "light" }, null, 2);
  };

  const importTheme = (themeData: string): boolean => {
    try {
      const imported = JSON.parse(themeData);
      // Always force light mode on import
      updateTheme({ ...imported, mode: "light" });
      return true;
    } catch (error) {
      console.error("Failed to import theme:", error);
      return false;
    }
  };

  const value: ThemeContextType = {
    config: { ...config, mode: "light" }, // Always return light mode
    updateTheme,
    setMode,
    setColorTheme,
    setAccessibility,
    setBranding,
    resetTheme,
    exportTheme,
    importTheme,
    isDark: false, // ALWAYS FALSE
    isSystemDark: false, // ALWAYS FALSE
    effectiveMode: "light", // ALWAYS LIGHT
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return safe defaults if context is not available
    return {
      config: defaultThemeConfig,
      updateTheme: () => {},
      setMode: () => {},
      setColorTheme: () => {},
      setAccessibility: () => {},
      setBranding: () => {},
      resetTheme: () => {},
      exportTheme: () => "{}",
      importTheme: () => false,
      isDark: false,
      isSystemDark: false,
      effectiveMode: "light" as const,
    };
  }
  return context;
}
