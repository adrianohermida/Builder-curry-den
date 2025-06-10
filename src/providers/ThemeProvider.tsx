/**
 * 🎨 THEME PROVIDER - SISTEMA DE TEMA COMPLETO
 *
 * Provedor de tema robusto com:
 * - Múltiplos temas (claro, escuro, sistema)
 * - Acessibilidade (alto contraste, movimento reduzido)
 * - Persistência no localStorage
 * - Detecção automática de preferências do sistema
 * - Transições suaves
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
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
  effectiveMode: "light" | "dark";
  isSystemTheme: boolean;
}

// Default configurations
const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  focusVisible: true,
};

const DEFAULT_BRANDING: BrandingSettings = {
  companyName: "Lawdesk CRM",
  primaryColor: "#3b82f6",
  secondaryColor: "#64748b",
  accentColor: "#f59e0b",
  borderRadius: 0.5,
  fontFamily: "Inter",
};

const DEFAULT_THEME_CONFIG: ThemeConfig = {
  mode: "system",
  colorTheme: "default",
  accessibility: DEFAULT_ACCESSIBILITY,
  branding: DEFAULT_BRANDING,
};

// Color theme palettes
const COLOR_THEMES = {
  default: {
    primary: "#3b82f6",
    secondary: "#64748b",
    accent: "#f59e0b",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  },
  blue: {
    primary: "#2563eb",
    secondary: "#64748b",
    accent: "#0ea5e9",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  },
  green: {
    primary: "#059669",
    secondary: "#64748b",
    accent: "#10b981",
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
  },
  purple: {
    primary: "#7c3aed",
    secondary: "#64748b",
    accent: "#a855f7",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  },
  orange: {
    primary: "#ea580c",
    secondary: "#64748b",
    accent: "#f97316",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  },
  red: {
    primary: "#dc2626",
    secondary: "#64748b",
    accent: "#ef4444",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#f87171",
  },
  custom: {
    primary: "#3b82f6",
    secondary: "#64748b",
    accent: "#f59e0b",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Partial<ThemeConfig>;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme,
  storageKey = "lawdesk-theme",
}) => {
  // Merge default theme with provided overrides
  const initialTheme = { ...DEFAULT_THEME_CONFIG, ...defaultTheme };

  // Persistent theme state
  const [config, setConfig] = useLocalStorage<ThemeConfig>(
    storageKey,
    initialTheme,
  );

  // System theme detection
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");

  // Computed values
  const isSystemTheme = config.mode === "system";
  const effectiveMode = isSystemTheme ? systemTheme : config.mode;
  const isDark = effectiveMode === "dark";

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    // Set initial value
    updateSystemTheme(mediaQuery);

    // Listen for changes
    mediaQuery.addEventListener("change", updateSystemTheme);
    return () => mediaQuery.removeEventListener("change", updateSystemTheme);
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Remove existing theme classes
    root.classList.remove("light", "dark", "high-contrast");

    // Apply theme mode
    root.classList.add(effectiveMode);
    root.setAttribute("data-theme", effectiveMode);

    // Apply accessibility settings
    if (config.accessibility.highContrast) {
      root.classList.add("high-contrast");
    }

    if (config.accessibility.reducedMotion) {
      root.style.setProperty("--motion-reduce", "1");
    } else {
      root.style.removeProperty("--motion-reduce");
    }

    if (config.accessibility.largeText) {
      body.classList.add("large-text");
    } else {
      body.classList.remove("large-text");
    }

    if (config.accessibility.focusVisible) {
      body.classList.add("focus-visible");
    } else {
      body.classList.remove("focus-visible");
    }

    // Apply color theme
    const colors =
      config.colorTheme === "custom"
        ? config.customColors || COLOR_THEMES.default
        : COLOR_THEMES[config.colorTheme];

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply branding
    root.style.setProperty("--font-family", config.branding.fontFamily);
    root.style.setProperty(
      "--border-radius",
      `${config.branding.borderRadius}rem`,
    );
    root.style.setProperty("--brand-primary", config.branding.primaryColor);
    root.style.setProperty("--brand-secondary", config.branding.secondaryColor);
    root.style.setProperty("--brand-accent", config.branding.accentColor);

    // Update meta theme color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", isDark ? "#1e293b" : "#ffffff");
    }
  }, [config, effectiveMode, isDark]);

  // Theme update functions
  const updateTheme = useCallback(
    (updates: Partial<ThemeConfig>) => {
      setConfig((prev) => ({ ...prev, ...updates }));
    },
    [setConfig],
  );

  const setMode = useCallback(
    (mode: ThemeMode) => {
      updateTheme({ mode });
    },
    [updateTheme],
  );

  const setColorTheme = useCallback(
    (colorTheme: ColorTheme) => {
      updateTheme({ colorTheme });
    },
    [updateTheme],
  );

  const setAccessibility = useCallback(
    (settings: Partial<AccessibilitySettings>) => {
      updateTheme({
        accessibility: { ...config.accessibility, ...settings },
      });
    },
    [config.accessibility, updateTheme],
  );

  const setBranding = useCallback(
    (settings: Partial<BrandingSettings>) => {
      updateTheme({
        branding: { ...config.branding, ...settings },
      });
    },
    [config.branding, updateTheme],
  );

  const resetTheme = useCallback(() => {
    setConfig(initialTheme);
  }, [setConfig, initialTheme]);

  const exportTheme = useCallback((): string => {
    return JSON.stringify(config, null, 2);
  }, [config]);

  const importTheme = useCallback(
    (themeData: string): boolean => {
      try {
        const importedTheme = JSON.parse(themeData);
        // Validate the imported theme structure
        if (
          typeof importedTheme === "object" &&
          importedTheme.mode &&
          importedTheme.colorTheme
        ) {
          setConfig({ ...DEFAULT_THEME_CONFIG, ...importedTheme });
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [setConfig],
  );

  // Keyboard shortcuts for theme switching
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + D for dark mode toggle
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "D"
      ) {
        event.preventDefault();
        setMode(isDark ? "light" : "dark");
      }

      // Ctrl/Cmd + Shift + H for high contrast toggle
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "H"
      ) {
        event.preventDefault();
        setAccessibility({
          highContrast: !config.accessibility.highContrast,
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDark, config.accessibility.highContrast, setMode, setAccessibility]);

  const contextValue: ThemeContextType = {
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
    effectiveMode,
    isSystemTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook for theme-aware styling
export const useThemeAwareStyles = () => {
  const { effectiveMode, config } = useTheme();

  const getThemeAwareClass = useCallback(
    (lightClass: string, darkClass: string) => {
      return effectiveMode === "dark" ? darkClass : lightClass;
    },
    [effectiveMode],
  );

  const getThemeAwareStyle = useCallback(
    (lightStyle: React.CSSProperties, darkStyle: React.CSSProperties) => {
      return effectiveMode === "dark" ? darkStyle : lightStyle;
    },
    [effectiveMode],
  );

  return {
    getThemeAwareClass,
    getThemeAwareStyle,
    isDark: effectiveMode === "dark",
    isLight: effectiveMode === "light",
    config,
  };
};

export default ThemeProvider;
