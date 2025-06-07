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

const defaultThemeConfig: ThemeConfig = {
  mode: "system",
  colorTheme: "default",
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    focusVisible: true,
  },
  branding: {
    companyName: "Lawdesk",
    primaryColor: "221.2 83.2% 53.3%",
    secondaryColor: "142.1 76.2% 36.3%",
    accentColor: "45.4 93.4% 47.5%",
    borderRadius: 8,
    fontFamily: "Inter, system-ui, sans-serif",
  },
};

const colorThemeMap: Record<ColorTheme, string> = {
  default: "221.2 83.2% 53.3%",
  blue: "221.2 83.2% 53.3%",
  green: "142.1 76.2% 36.3%",
  purple: "262.1 83.3% 57.8%",
  orange: "24.6 95% 53.1%",
  red: "0 72.2% 50.6%",
  custom: "221.2 83.2% 53.3%", // fallback
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useLocalStorage<ThemeConfig>(
    "lawdesk-theme-config-v2",
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

  // Calculate effective mode
  const effectiveMode: "light" | "dark" =
    config.mode === "system" ? (isSystemDark ? "dark" : "light") : config.mode;

  const isDark = effectiveMode === "dark";

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    // Remove all existing theme classes
    root.classList.remove(
      "dark",
      "light",
      "high-contrast",
      "reduced-motion",
      "large-text",
    );
    root.removeAttribute("data-theme");

    // Apply mode
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.add("light");
    }

    // Apply color theme
    if (config.colorTheme !== "default") {
      root.setAttribute("data-theme", config.colorTheme);
    }

    // Apply accessibility settings
    if (config.accessibility.highContrast) {
      root.classList.add("high-contrast");
      root.setAttribute("data-theme", "high-contrast");
    }

    if (config.accessibility.reducedMotion) {
      root.classList.add("reduced-motion");
    }

    if (config.accessibility.largeText) {
      root.classList.add("large-text");
    }

    // Apply custom CSS variables
    const primaryColor =
      config.customColors?.primary ||
      colorThemeMap[config.colorTheme] ||
      config.branding.primaryColor;

    root.style.setProperty("--brand-primary", primaryColor);
    root.style.setProperty("--font-family", config.branding.fontFamily);
    root.style.setProperty("--radius", `${config.branding.borderRadius}px`);

    if (config.accessibility.largeText) {
      root.style.setProperty("--font-scale", "1.2");
    } else {
      root.style.setProperty("--font-scale", "1");
    }

    if (config.accessibility.reducedMotion) {
      root.style.setProperty("--animation-duration", "0.01ms");
    } else {
      root.style.setProperty("--animation-duration", "0.2s");
    }

    // Apply custom colors if any
    if (config.customColors) {
      Object.entries(config.customColors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }
  }, [config, isDark]);

  // Handle system preference for reduced motion
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

  // Handle system preference for high contrast
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

// Utility hook for theme-aware styling
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
      primary: isDark
        ? "bg-primary text-primary-foreground"
        : "bg-primary text-primary-foreground",
      secondary: isDark
        ? "bg-secondary text-secondary-foreground"
        : "bg-secondary text-secondary-foreground",
      accent: isDark
        ? "bg-accent text-accent-foreground"
        : "bg-accent text-accent-foreground",
      muted: isDark
        ? "bg-muted text-muted-foreground"
        : "bg-muted text-muted-foreground",
      success: isDark
        ? "bg-success text-success-foreground"
        : "bg-success text-success-foreground",
      warning: isDark
        ? "bg-warning text-warning-foreground"
        : "bg-warning text-warning-foreground",
      destructive: isDark
        ? "bg-destructive text-destructive-foreground"
        : "bg-destructive text-destructive-foreground",
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

// Color theme presets for easy access
export const themePresets = {
  corporate: {
    mode: "light" as ThemeMode,
    colorTheme: "blue" as ColorTheme,
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      largeText: false,
      focusVisible: true,
    },
  },
  modern: {
    mode: "dark" as ThemeMode,
    colorTheme: "purple" as ColorTheme,
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      largeText: false,
      focusVisible: true,
    },
  },
  accessible: {
    mode: "light" as ThemeMode,
    colorTheme: "default" as ColorTheme,
    accessibility: {
      highContrast: true,
      reducedMotion: true,
      largeText: true,
      focusVisible: true,
    },
  },
};
