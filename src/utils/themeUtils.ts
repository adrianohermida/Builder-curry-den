/**
 * 🎨 THEME UTILITIES - UTILITÁRIOS DE TEMA
 *
 * Utilitários para gerenciamento de temas:
 * - Aplicação de temas (claro, escuro, sistema)
 * - Cores primárias personalizáveis
 * - Persistência de preferências
 * - Detecção de tema do sistema
 */

export type ThemeMode = "light" | "dark" | "system";
export type PrimaryColor = "blue" | "green" | "purple" | "orange";

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: PrimaryColor;
  reducedMotion: boolean;
  highContrast: boolean;
}

// Default theme configuration
export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  mode: "system",
  primaryColor: "blue",
  reducedMotion: false,
  highContrast: false,
};

// Color mappings for different primary colors
const COLOR_MAPPINGS: Record<
  PrimaryColor,
  { light: Record<string, string>; dark: Record<string, string> }
> = {
  blue: {
    light: {
      "--primary": "217 91% 60%",
      "--primary-foreground": "210 40% 98%",
      "--accent": "217 91% 95%",
      "--accent-foreground": "217 91% 20%",
    },
    dark: {
      "--primary": "217 91% 60%",
      "--primary-foreground": "210 40% 98%",
      "--accent": "217 10% 15%",
      "--accent-foreground": "217 91% 95%",
    },
  },
  green: {
    light: {
      "--primary": "142 76% 36%",
      "--primary-foreground": "210 40% 98%",
      "--accent": "142 76% 95%",
      "--accent-foreground": "142 76% 20%",
    },
    dark: {
      "--primary": "142 76% 40%",
      "--primary-foreground": "210 40% 98%",
      "--accent": "142 20% 15%",
      "--accent-foreground": "142 76% 95%",
    },
  },
  purple: {
    light: {
      "--primary": "263 70% 50%",
      "--primary-foreground": "210 40% 98%",
      "--accent": "263 70% 95%",
      "--accent-foreground": "263 70% 20%",
    },
    dark: {
      "--primary": "263 70% 55%",
      "--primary-foreground": "210 40% 98%",
      "--accent": "263 20% 15%",
      "--accent-foreground": "263 70% 95%",
    },
  },
  orange: {
    light: {
      "--primary": "24 95% 53%",
      "--primary-foreground": "210 40% 98%",
      "--accent": "24 95% 95%",
      "--accent-foreground": "24 95% 20%",
    },
    dark: {
      "--primary": "24 95% 58%",
      "--primary-foreground": "210 40% 98%",
      "--accent": "24 20% 15%",
      "--accent-foreground": "24 95% 95%",
    },
  },
};

/**
 * Get the current system theme preference
 */
export const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

/**
 * Get the current reduced motion preference
 */
export const getSystemReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Get the current high contrast preference
 */
export const getSystemHighContrast = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-contrast: high)").matches;
};

/**
 * Load theme configuration from localStorage
 */
export const loadThemeConfig = (): ThemeConfig => {
  if (typeof window === "undefined") return DEFAULT_THEME_CONFIG;

  try {
    const stored = localStorage.getItem("lawdesk-theme-config");
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_THEME_CONFIG,
        ...parsed,
        // Always check system preferences for accessibility
        reducedMotion: getSystemReducedMotion(),
        highContrast: getSystemHighContrast(),
      };
    }
  } catch (error) {
    console.warn("Failed to load theme config from localStorage:", error);
  }

  return {
    ...DEFAULT_THEME_CONFIG,
    reducedMotion: getSystemReducedMotion(),
    highContrast: getSystemHighContrast(),
  };
};

/**
 * Save theme configuration to localStorage
 */
export const saveThemeConfig = (config: ThemeConfig): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("lawdesk-theme-config", JSON.stringify(config));
  } catch (error) {
    console.warn("Failed to save theme config to localStorage:", error);
  }
};

/**
 * Apply theme mode (light/dark/system)
 */
export const applyThemeMode = (mode: ThemeMode): void => {
  if (typeof window === "undefined") return;

  const root = document.documentElement;

  // Remove existing theme classes
  root.classList.remove("light", "dark");

  // Determine effective theme
  let effectiveTheme: "light" | "dark";
  if (mode === "system") {
    effectiveTheme = getSystemTheme();
  } else {
    effectiveTheme = mode;
  }

  // Apply theme class
  root.classList.add(effectiveTheme);

  // Store in data attribute for CSS usage
  root.setAttribute("data-theme", effectiveTheme);
};

/**
 * Apply primary color
 */
export const applyPrimaryColor = (
  color: PrimaryColor,
  currentTheme?: "light" | "dark",
): void => {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  const theme =
    currentTheme || (root.classList.contains("dark") ? "dark" : "light");
  const colors = COLOR_MAPPINGS[color][theme];

  // Apply CSS custom properties
  Object.entries(colors).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  // Add theme color class for additional styling
  root.classList.remove(
    "theme-blue",
    "theme-green",
    "theme-purple",
    "theme-orange",
  );
  root.classList.add(`theme-${color}`);

  // Store in data attribute
  root.setAttribute("data-primary-color", color);
};

/**
 * Apply accessibility preferences
 */
export const applyAccessibilityPreferences = (config: {
  reducedMotion: boolean;
  highContrast: boolean;
}): void => {
  if (typeof window === "undefined") return;

  const root = document.documentElement;

  // Apply reduced motion
  if (config.reducedMotion) {
    root.style.setProperty("--transition-duration", "0ms");
    root.classList.add("reduce-motion");
  } else {
    root.style.removeProperty("--transition-duration");
    root.classList.remove("reduce-motion");
  }

  // Apply high contrast (you can extend this with more specific styles)
  if (config.highContrast) {
    root.classList.add("high-contrast");
  } else {
    root.classList.remove("high-contrast");
  }
};

/**
 * Apply complete theme configuration
 */
export const applyThemeConfig = (config: ThemeConfig): void => {
  applyThemeMode(config.mode);
  applyPrimaryColor(config.primaryColor);
  applyAccessibilityPreferences({
    reducedMotion: config.reducedMotion,
    highContrast: config.highContrast,
  });
};

/**
 * Initialize theme system
 */
export const initializeTheme = (): ThemeConfig => {
  const config = loadThemeConfig();
  applyThemeConfig(config);

  // Listen for system theme changes
  if (typeof window !== "undefined") {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (config.mode === "system") {
        applyThemeMode("system");
        applyPrimaryColor(config.primaryColor);
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    // Listen for reduced motion changes
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = () => {
      const newConfig = { ...config, reducedMotion: motionQuery.matches };
      applyAccessibilityPreferences(newConfig);
      saveThemeConfig(newConfig);
    };

    motionQuery.addEventListener("change", handleMotionChange);

    // Listen for high contrast changes
    const contrastQuery = window.matchMedia("(prefers-contrast: high)");
    const handleContrastChange = () => {
      const newConfig = { ...config, highContrast: contrastQuery.matches };
      applyAccessibilityPreferences(newConfig);
      saveThemeConfig(newConfig);
    };

    contrastQuery.addEventListener("change", handleContrastChange);
  }

  return config;
};

/**
 * Get next theme in cycle (light -> dark -> system -> light)
 */
export const getNextTheme = (current: ThemeMode): ThemeMode => {
  switch (current) {
    case "light":
      return "dark";
    case "dark":
      return "system";
    case "system":
      return "light";
    default:
      return "light";
  }
};

/**
 * Get theme display name
 */
export const getThemeDisplayName = (theme: ThemeMode): string => {
  switch (theme) {
    case "light":
      return "Claro";
    case "dark":
      return "Escuro";
    case "system":
      return "Sistema";
    default:
      return "Sistema";
  }
};

/**
 * Get primary color display name
 */
export const getPrimaryColorDisplayName = (color: PrimaryColor): string => {
  switch (color) {
    case "blue":
      return "Azul";
    case "green":
      return "Verde";
    case "purple":
      return "Roxo";
    case "orange":
      return "Laranja";
    default:
      return "Azul";
  }
};

/**
 * Export theme configuration for external use
 */
export const exportThemeConfig = (): string => {
  const config = loadThemeConfig();
  return JSON.stringify(config, null, 2);
};

/**
 * Import theme configuration from external source
 */
export const importThemeConfig = (configJson: string): boolean => {
  try {
    const config = JSON.parse(configJson);

    // Validate config structure
    if (
      typeof config === "object" &&
      config !== null &&
      ["light", "dark", "system"].includes(config.mode) &&
      ["blue", "green", "purple", "orange"].includes(config.primaryColor)
    ) {
      const validConfig: ThemeConfig = {
        mode: config.mode,
        primaryColor: config.primaryColor,
        reducedMotion: Boolean(config.reducedMotion),
        highContrast: Boolean(config.highContrast),
      };

      applyThemeConfig(validConfig);
      saveThemeConfig(validConfig);
      return true;
    }
  } catch (error) {
    console.warn("Failed to import theme config:", error);
  }

  return false;
};
