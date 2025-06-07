import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

export type ThemeMode = "light" | "dark" | "system";
export type ColorTheme =
  | "default"
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "red"
  | "custom";

interface ThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  destructive: string;
  destructiveForeground: string;
}

interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  focusVisible: boolean;
}

interface BrandingSettings {
  logoUrl?: string;
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  borderRadius: number;
  fontFamily: string;
}

interface ThemeConfig {
  mode: ThemeMode;
  colorTheme: ColorTheme;
  accessibility: AccessibilitySettings;
  branding: BrandingSettings;
  customColors?: Partial<ThemeColors>;
}

interface ThemeContextType {
  config: ThemeConfig;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  applyTheme: () => void;
  resetTheme: () => void;
  exportTheme: () => string;
  importTheme: (themeData: string) => void;
  isDark: boolean;
  colors: ThemeColors;
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
    primaryColor: "hsl(222.2 84% 4.9%)",
    secondaryColor: "hsl(210 40% 96%)",
    accentColor: "hsl(210 40% 92%)",
    borderRadius: 6,
    fontFamily: "Inter, system-ui, sans-serif",
  },
};

const colorThemes: Record<ColorTheme, Partial<ThemeColors>> = {
  default: {
    primary: "hsl(222.2 84% 4.9%)",
    primaryForeground: "hsl(210 40% 98%)",
    secondary: "hsl(210 40% 96%)",
    accent: "hsl(210 40% 92%)",
  },
  blue: {
    primary: "hsl(221.2 83.2% 53.3%)",
    primaryForeground: "hsl(210 40% 98%)",
    secondary: "hsl(214 27.1% 93.9%)",
    accent: "hsl(214 31.8% 91.4%)",
  },
  green: {
    primary: "hsl(142.1 76.2% 36.3%)",
    primaryForeground: "hsl(355.7 100% 97.3%)",
    secondary: "hsl(138.5 76.2% 96.7%)",
    accent: "hsl(136 72.2% 94.1%)",
  },
  purple: {
    primary: "hsl(262.1 83.3% 57.8%)",
    primaryForeground: "hsl(210 40% 98%)",
    secondary: "hsl(270 5.2% 93.9%)",
    accent: "hsl(270 3.7% 91.4%)",
  },
  orange: {
    primary: "hsl(24.6 95% 53.1%)",
    primaryForeground: "hsl(60 9.1% 97.8%)",
    secondary: "hsl(60 4.8% 95.9%)",
    accent: "hsl(60 4.8% 91.0%)",
  },
  red: {
    primary: "hsl(0 72.2% 50.6%)",
    primaryForeground: "hsl(60 9.1% 97.8%)",
    secondary: "hsl(0 0% 95.9%)",
    accent: "hsl(0 0% 91.0%)",
  },
  custom: {},
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useLocalStorage<ThemeConfig>(
    "lawdesk-theme-config",
    defaultThemeConfig,
  );
  const [isDark, setIsDark] = useState(false);

  // Calculate current colors based on theme and customizations
  const calculateColors = (): ThemeColors => {
    const baseColors = colorThemes[config.colorTheme] || {};
    const customColors = config.customColors || {};

    // Default light theme colors
    const lightColors: ThemeColors = {
      primary: "hsl(222.2 84% 4.9%)",
      primaryForeground: "hsl(210 40% 98%)",
      secondary: "hsl(210 40% 96%)",
      secondaryForeground: "hsl(222.2 84% 4.9%)",
      accent: "hsl(210 40% 92%)",
      accentForeground: "hsl(222.2 84% 4.9%)",
      muted: "hsl(210 40% 96%)",
      mutedForeground: "hsl(215.4 16.3% 46.9%)",
      border: "hsl(214.3 31.8% 91.4%)",
      input: "hsl(214.3 31.8% 91.4%)",
      ring: "hsl(222.2 84% 4.9%)",
      background: "hsl(0 0% 100%)",
      foreground: "hsl(222.2 84% 4.9%)",
      card: "hsl(0 0% 100%)",
      cardForeground: "hsl(222.2 84% 4.9%)",
      popover: "hsl(0 0% 100%)",
      popoverForeground: "hsl(222.2 84% 4.9%)",
      destructive: "hsl(0 84.2% 60.2%)",
      destructiveForeground: "hsl(210 40% 98%)",
    };

    // Dark theme adjustments
    const darkColors: ThemeColors = {
      ...lightColors,
      primary: "hsl(210 40% 98%)",
      primaryForeground: "hsl(222.2 84% 4.9%)",
      secondary: "hsl(217.2 32.6% 17.5%)",
      secondaryForeground: "hsl(210 40% 98%)",
      accent: "hsl(217.2 32.6% 17.5%)",
      accentForeground: "hsl(210 40% 98%)",
      muted: "hsl(217.2 32.6% 17.5%)",
      mutedForeground: "hsl(215 20.2% 65.1%)",
      border: "hsl(217.2 32.6% 17.5%)",
      input: "hsl(217.2 32.6% 17.5%)",
      ring: "hsl(212.7 26.8% 83.9%)",
      background: "hsl(222.2 84% 4.9%)",
      foreground: "hsl(210 40% 98%)",
      card: "hsl(222.2 84% 4.9%)",
      cardForeground: "hsl(210 40% 98%)",
      popover: "hsl(222.2 84% 4.9%)",
      popoverForeground: "hsl(210 40% 98%)",
    };

    const baseTheme = isDark ? darkColors : lightColors;

    return {
      ...baseTheme,
      ...baseColors,
      ...customColors,
    };
  };

  const colors = calculateColors();

  // Detect system dark mode
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateDarkMode = () => {
      if (config.mode === "system") {
        setIsDark(mediaQuery.matches);
      } else {
        setIsDark(config.mode === "dark");
      }
    };

    updateDarkMode();
    mediaQuery.addEventListener("change", updateDarkMode);
    return () => mediaQuery.removeEventListener("change", updateDarkMode);
  }, [config.mode]);

  // Apply theme to CSS variables
  const applyTheme = () => {
    const root = document.documentElement;

    // Apply color variables
    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      root.style.setProperty(`--${cssVar}`, value);
    });

    // Apply branding variables
    root.style.setProperty("--font-family", config.branding.fontFamily);
    root.style.setProperty(
      "--border-radius",
      `${config.branding.borderRadius}px`,
    );

    // Apply accessibility settings
    if (config.accessibility.reducedMotion) {
      root.style.setProperty("--animation-duration", "0s");
    } else {
      root.style.setProperty("--animation-duration", "0.2s");
    }

    if (config.accessibility.largeText) {
      root.style.setProperty("--font-scale", "1.2");
    } else {
      root.style.setProperty("--font-scale", "1");
    }

    // Apply theme class
    root.classList.toggle("dark", isDark);
    root.classList.toggle("high-contrast", config.accessibility.highContrast);
    root.classList.toggle("reduced-motion", config.accessibility.reducedMotion);
    root.classList.toggle("large-text", config.accessibility.largeText);
  };

  // Apply theme when config or dark mode changes
  useEffect(() => {
    applyTheme();
  }, [config, isDark]);

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

  const resetTheme = () => {
    setConfig(defaultThemeConfig);
  };

  const exportTheme = () => {
    return JSON.stringify(config, null, 2);
  };

  const importTheme = (themeData: string) => {
    try {
      const imported = JSON.parse(themeData);
      setConfig(imported);
    } catch (error) {
      console.error("Invalid theme data:", error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        config,
        updateTheme,
        applyTheme,
        resetTheme,
        exportTheme,
        importTheme,
        isDark,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Theme-aware utility classes
export const themeClasses = {
  primary: {
    light: "text-slate-900 bg-white border-slate-200",
    dark: "text-white bg-slate-900 border-slate-700",
    color: "text-primary-foreground bg-primary border-primary/20",
  },
  secondary: {
    light: "text-slate-700 bg-slate-50 border-slate-200",
    dark: "text-slate-300 bg-slate-800 border-slate-700",
    color: "text-secondary-foreground bg-secondary border-secondary/20",
  },
  accent: {
    light: "text-slate-900 bg-blue-50 border-blue-200",
    dark: "text-white bg-blue-900 border-blue-700",
    color: "text-accent-foreground bg-accent border-accent/20",
  },
  muted: {
    light: "text-slate-600 bg-slate-100",
    dark: "text-slate-400 bg-slate-800",
    color: "text-muted-foreground bg-muted",
  },
  success: {
    light: "text-green-700 bg-green-50 border-green-200",
    dark: "text-green-300 bg-green-900 border-green-700",
    color: "text-green-600 bg-green-50 border-green-200",
  },
  warning: {
    light: "text-yellow-700 bg-yellow-50 border-yellow-200",
    dark: "text-yellow-300 bg-yellow-900 border-yellow-700",
    color: "text-yellow-600 bg-yellow-50 border-yellow-200",
  },
  error: {
    light: "text-red-700 bg-red-50 border-red-200",
    dark: "text-red-300 bg-red-900 border-red-700",
    color: "text-destructive-foreground bg-destructive border-destructive/20",
  },
};

// Hook for theme-aware styling
export function useThemeClasses() {
  const { config, isDark } = useTheme();

  const getThemeClass = (variant: keyof typeof themeClasses) => {
    const classes = themeClasses[variant];

    if (config.colorTheme === "custom" || config.colorTheme !== "default") {
      return classes.color;
    }

    return isDark ? classes.dark : classes.light;
  };

  return { getThemeClass, isDark };
}
