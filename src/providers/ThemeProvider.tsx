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

// FIXED: Default to light mode as requested
const defaultThemeConfig: ThemeConfig = {
  mode: "light", // ✅ FORCED LIGHT MODE AS DEFAULT
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

// FIXED: Enhanced color theme mappings with client/admin distinction
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
    "lawdesk-theme-config-v4", // Updated version to reset existing configs
    defaultThemeConfig,
  );
  const [isSystemDark, setIsSystemDark] = useState(false);

  // Detect system dark mode preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemDark = () => setIsSystemDark(mediaQuery.matches);

    updateSystemDark();
    mediaQuery.addEventListener("change", updateSystemDark);
    return () => mediaQuery.removeEventListener("change", updateSystemDark);
  }, []);

  // FIXED: Force light mode by default, only dark if explicitly set
  const effectiveMode: "light" | "dark" =
    config.mode === "dark" ? "dark" : "light"; // System defaults to light

  const isDark = effectiveMode === "dark";

  // FIXED: Enhanced theme application with proper light mode defaults
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Clear all existing theme classes
    root.classList.remove(
      "dark",
      "light",
      "high-contrast",
      "reduced-motion",
      "large-text",
      "admin-mode",
      "client-mode",
    );
    root.removeAttribute("data-theme");

    // FORCE light mode as base
    root.classList.add("light");

    // Only add dark if explicitly set
    if (isDark) {
      root.classList.add("dark");
    }

    // Apply color theme
    if (config.colorTheme !== "default") {
      root.setAttribute("data-theme", config.colorTheme);
    }

    // Apply accessibility settings
    if (config.accessibility.highContrast) {
      root.classList.add("high-contrast");
    }

    if (config.accessibility.reducedMotion) {
      root.classList.add("reduced-motion");
    }

    if (config.accessibility.largeText) {
      root.classList.add("large-text");
    }

    // FIXED: Apply design tokens with proper light mode defaults
    const primaryColor =
      config.customColors?.primary ||
      colorThemeMap[config.colorTheme] ||
      config.branding.primaryColor;

    // Set CSS custom properties for consistent theming
    root.style.setProperty("--brand-primary", primaryColor);
    root.style.setProperty("--font-family", config.branding.fontFamily);
    root.style.setProperty(
      "--border-radius",
      `${config.branding.borderRadius}px`,
    );

    // FIXED: Light mode color scheme
    root.style.setProperty(
      "--background",
      isDark ? "222.2 84% 4.9%" : "0 0% 100%",
    );
    root.style.setProperty(
      "--foreground",
      isDark ? "210 40% 98%" : "222.2 84% 4.9%",
    );
    root.style.setProperty("--card", isDark ? "222.2 84% 4.9%" : "0 0% 100%");
    root.style.setProperty(
      "--card-foreground",
      isDark ? "210 40% 98%" : "222.2 84% 4.9%",
    );
    root.style.setProperty(
      "--muted",
      isDark ? "217.2 32.6% 17.5%" : "210 40% 96%",
    );
    root.style.setProperty(
      "--muted-foreground",
      isDark ? "215 20.2% 65.1%" : "215.4 16.3% 46.9%",
    );
    root.style.setProperty(
      "--border",
      isDark ? "217.2 32.6% 17.5%" : "214.3 31.8% 91.4%",
    );

    // Typography scaling
    if (config.accessibility.largeText) {
      root.style.setProperty("--font-scale", "1.125");
    } else {
      root.style.setProperty("--font-scale", "1");
    }

    // Animation settings
    if (config.accessibility.reducedMotion) {
      root.style.setProperty("--animation-duration-fast", "0.01ms");
      root.style.setProperty("--animation-duration-normal", "0.01ms");
      root.style.setProperty("--animation-duration-slow", "0.01ms");
    } else {
      root.style.setProperty("--animation-duration-fast", "150ms");
      root.style.setProperty("--animation-duration-normal", "200ms");
      root.style.setProperty("--animation-duration-slow", "300ms");
    }

    // FIXED: Modern body styling with forced light mode
    body.className = [
      "antialiased",
      "font-sans",
      "bg-background",
      "text-foreground",
      config.accessibility.reducedMotion && "reduced-motion",
      config.accessibility.largeText && "large-text",
    ]
      .filter(Boolean)
      .join(" ");

    // FIXED: Meta theme color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", isDark ? "#0f172a" : "#ffffff");
    }

    // Apply custom colors if any
    if (config.customColors) {
      Object.entries(config.customColors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }
  }, [config, isDark, effectiveMode]);

  // FIXED: Reduced motion preference detection with respect for user choice
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => {
      if (mediaQuery.matches && !config.accessibility.reducedMotion) {
        setConfig((prev) => ({
          ...prev,
          accessibility: {
            ...prev.accessibility,
            reducedMotion: true,
          },
        }));
      }
    };

    updateReducedMotion();
    mediaQuery.addEventListener("change", updateReducedMotion);
    return () => mediaQuery.removeEventListener("change", updateReducedMotion);
  }, [config.accessibility.reducedMotion, setConfig]);

  // High contrast preference detection
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-contrast: high)");
    const updateHighContrast = () => {
      if (mediaQuery.matches && !config.accessibility.highContrast) {
        setConfig((prev) => ({
          ...prev,
          accessibility: {
            ...prev.accessibility,
            highContrast: true,
          },
        }));
      }
    };

    updateHighContrast();
    mediaQuery.addEventListener("change", updateHighContrast);
    return () => mediaQuery.removeEventListener("change", updateHighContrast);
  }, [config.accessibility.highContrast, setConfig]);

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...updates,
      accessibility: {
        ...prev.accessibility,
        ...updates.accessibility,
      },
      branding: {
        ...prev.branding,
        ...updates.branding,
      },
      customColors: {
        ...prev.customColors,
        ...updates.customColors,
      },
    }));
  };

  const setMode = (mode: ThemeMode) => {
    updateTheme({ mode });
  };

  const setColorTheme = (colorTheme: ColorTheme) => {
    updateTheme({ colorTheme });
  };

  const setAccessibility = (settings: Partial<AccessibilitySettings>) => {
    updateTheme({ accessibility: settings });
  };

  const setBranding = (settings: Partial<BrandingSettings>) => {
    updateTheme({ branding: settings });
  };

  const resetTheme = () => {
    setConfig(defaultThemeConfig);
  };

  const exportTheme = () => {
    return JSON.stringify(config, null, 2);
  };

  const importTheme = (themeData: string): boolean => {
    try {
      const imported = JSON.parse(themeData);

      // Validate the imported theme structure
      if (
        imported &&
        typeof imported === "object" &&
        imported.mode &&
        imported.colorTheme &&
        imported.accessibility &&
        imported.branding
      ) {
        setConfig(imported);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to import theme:", error);
      return false;
    }
  };

  const value: ThemeContextType = {
    config,
    updateTheme,
    setMode,
    setColorTheme,
    setAccessibility,
    setBranding,
    resetTheme,
    exportTheme,
    importTheme,
    isDark,
    isSystemDark,
    effectiveMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// FIXED: Theme-aware utility hook
export function useThemeClasses() {
  const { isDark, config } = useTheme();

  const getThemeClass = (
    variant:
      | "primary"
      | "secondary"
      | "accent"
      | "muted"
      | "success"
      | "warning"
      | "destructive",
  ) => {
    const baseClasses = {
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      accent: "bg-accent text-accent-foreground",
      muted: "bg-muted text-muted-foreground",
      success:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
      warning:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
      destructive: "bg-destructive text-destructive-foreground",
    };

    return baseClasses[variant];
  };

  const getTextClass = (
    variant: "primary" | "secondary" | "muted" | "accent",
  ) => {
    const textClasses = {
      primary: "text-foreground",
      secondary: "text-muted-foreground",
      muted: "text-muted-foreground",
      accent: "text-accent-foreground",
    };

    return textClasses[variant];
  };

  const getBorderClass = (variant: "default" | "muted" | "accent") => {
    const borderClasses = {
      default: "border-border",
      muted: "border-muted",
      accent: "border-accent",
    };

    return borderClasses[variant];
  };

  return {
    getThemeClass,
    getTextClass,
    getBorderClass,
    isDark,
    isHighContrast: config.accessibility.highContrast,
    isReducedMotion: config.accessibility.reducedMotion,
    isLargeText: config.accessibility.largeText,
  };
}

// Utility function to get current theme colors programmatically
export function getThemeColors() {
  const root = document.documentElement;
  const style = getComputedStyle(root);

  return {
    primary: style.getPropertyValue("--primary").trim(),
    secondary: style.getPropertyValue("--secondary").trim(),
    accent: style.getPropertyValue("--accent").trim(),
    background: style.getPropertyValue("--background").trim(),
    foreground: style.getPropertyValue("--foreground").trim(),
    muted: style.getPropertyValue("--muted").trim(),
    border: style.getPropertyValue("--border").trim(),
  };
}

// FIXED: Theme presets for client and admin modes
export const themePresets = {
  lawdeskClient: {
    mode: "light" as ThemeMode,
    colorTheme: "blue" as ColorTheme,
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      largeText: false,
      focusVisible: true,
    },
    branding: {
      companyName: "Lawdesk",
      primaryColor: "221.2 83.2% 53.3%", // Blue for client
      secondaryColor: "210 40% 96%",
      accentColor: "221.2 83.2% 53.3%",
      borderRadius: 8,
      fontFamily: "Inter, system-ui, sans-serif",
    },
  },
  lawdeskAdmin: {
    mode: "light" as ThemeMode, // Admin also starts in light mode
    colorTheme: "red" as ColorTheme,
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      largeText: false,
      focusVisible: true,
    },
    branding: {
      companyName: "Lawdesk Admin",
      primaryColor: "0 84% 60%", // Red for admin
      secondaryColor: "210 40% 96%",
      accentColor: "0 84% 60%",
      borderRadius: 8,
      fontFamily: "Inter, system-ui, sans-serif",
    },
  },
};
