/**
 * 🎨 MODERN THEME SYSTEM - LAWDESK DESIGN
 *
 * Sistema de tema moderno sem amarelo, focado em:
 * - Minimalismo
 * - Compacto
 * - Elegância profissional
 * - Acessibilidade WCAG 2.1
 */

export type ThemeMode = "light" | "dark" | "auto";

export interface ThemeColors {
  // Primary
  primary: string;
  primaryForeground: string;

  // Secondary
  secondary: string;
  secondaryForeground: string;

  // Backgrounds
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;

  // UI Elements
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;

  // Borders
  border: string;
  input: string;
  ring: string;

  // States (NO YELLOW!)
  destructive: string;
  destructiveForeground: string;
  warning: string; // Orange instead of yellow
  warningForeground: string;
  success: string;
  successForeground: string;
  info: string;
  infoForeground: string;
}

export const lightTheme: ThemeColors = {
  // Primary - Blue (Professional)
  primary: "rgb(59, 130, 246)", // blue-500
  primaryForeground: "rgb(255, 255, 255)",

  // Secondary - Gray (Neutral)
  secondary: "rgb(244, 244, 245)", // zinc-100
  secondaryForeground: "rgb(39, 39, 42)", // zinc-800

  // Backgrounds
  background: "rgb(255, 255, 255)",
  foreground: "rgb(9, 9, 11)", // zinc-900
  muted: "rgb(244, 244, 245)", // zinc-100
  mutedForeground: "rgb(113, 113, 122)", // zinc-500

  // UI Elements
  card: "rgb(255, 255, 255)",
  cardForeground: "rgb(9, 9, 11)",
  popover: "rgb(255, 255, 255)",
  popoverForeground: "rgb(9, 9, 11)",

  // Borders
  border: "rgb(228, 228, 231)", // zinc-200
  input: "rgb(228, 228, 231)",
  ring: "rgb(59, 130, 246)",

  // States (Modern colors, NO YELLOW!)
  destructive: "rgb(239, 68, 68)", // red-500
  destructiveForeground: "rgb(255, 255, 255)",
  warning: "rgb(249, 115, 22)", // orange-500 (instead of yellow)
  warningForeground: "rgb(255, 255, 255)",
  success: "rgb(34, 197, 94)", // green-500
  successForeground: "rgb(255, 255, 255)",
  info: "rgb(59, 130, 246)", // blue-500
  infoForeground: "rgb(255, 255, 255)",
};

export const darkTheme: ThemeColors = {
  // Primary - Blue (consistent)
  primary: "rgb(59, 130, 246)",
  primaryForeground: "rgb(255, 255, 255)",

  // Secondary - Dark Gray
  secondary: "rgb(39, 39, 42)", // zinc-800
  secondaryForeground: "rgb(244, 244, 245)",

  // Backgrounds
  background: "rgb(9, 9, 11)", // zinc-900
  foreground: "rgb(244, 244, 245)", // zinc-100
  muted: "rgb(39, 39, 42)", // zinc-800
  mutedForeground: "rgb(113, 113, 122)", // zinc-500

  // UI Elements
  card: "rgb(9, 9, 11)",
  cardForeground: "rgb(244, 244, 245)",
  popover: "rgb(9, 9, 11)",
  popoverForeground: "rgb(244, 244, 245)",

  // Borders
  border: "rgb(39, 39, 42)", // zinc-800
  input: "rgb(39, 39, 42)",
  ring: "rgb(59, 130, 246)",

  // States (Dark mode compatible)
  destructive: "rgb(239, 68, 68)",
  destructiveForeground: "rgb(255, 255, 255)",
  warning: "rgb(249, 115, 22)", // orange-500
  warningForeground: "rgb(255, 255, 255)",
  success: "rgb(34, 197, 94)",
  successForeground: "rgb(255, 255, 255)",
  info: "rgb(59, 130, 246)",
  infoForeground: "rgb(255, 255, 255)",
};

// Utility classes for replacement (NO YELLOW!)
export const colorClasses = {
  // Status colors
  status: {
    success: {
      bg: "bg-green-50 dark:bg-green-950/20",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-800 dark:text-green-200",
      icon: "text-green-600 dark:text-green-400",
    },
    warning: {
      bg: "bg-orange-50 dark:bg-orange-950/20", // Orange instead of yellow
      border: "border-orange-200 dark:border-orange-800",
      text: "text-orange-800 dark:text-orange-200",
      icon: "text-orange-600 dark:text-orange-400",
    },
    error: {
      bg: "bg-red-50 dark:bg-red-950/20",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-800 dark:text-red-200",
      icon: "text-red-600 dark:text-red-400",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-950/20",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-800 dark:text-blue-200",
      icon: "text-blue-600 dark:text-blue-400",
    },
  },

  // Priority colors (NO YELLOW!)
  priority: {
    low: {
      bg: "bg-gray-100 dark:bg-gray-800",
      text: "text-gray-700 dark:text-gray-300",
      border: "border-gray-200 dark:border-gray-700",
    },
    medium: {
      bg: "bg-orange-100 dark:bg-orange-900/20", // Orange instead of yellow
      text: "text-orange-800 dark:text-orange-200",
      border: "border-orange-200 dark:border-orange-800",
    },
    high: {
      bg: "bg-red-100 dark:bg-red-900/20",
      text: "text-red-800 dark:text-red-200",
      border: "border-red-200 dark:border-red-800",
    },
    urgent: {
      bg: "bg-purple-100 dark:bg-purple-900/20",
      text: "text-purple-800 dark:text-purple-200",
      border: "border-purple-200 dark:border-purple-800",
    },
  },

  // Process status colors
  process: {
    active: {
      bg: "bg-blue-100 dark:bg-blue-900/20",
      text: "text-blue-800 dark:text-blue-200",
      border: "border-blue-200 dark:border-blue-800",
    },
    pending: {
      bg: "bg-orange-100 dark:bg-orange-900/20", // Orange instead of yellow
      text: "text-orange-800 dark:text-orange-200",
      border: "border-orange-200 dark:border-orange-800",
    },
    completed: {
      bg: "bg-green-100 dark:bg-green-900/20",
      text: "text-green-800 dark:text-green-200",
      border: "border-green-200 dark:border-green-800",
    },
    suspended: {
      bg: "bg-gray-100 dark:bg-gray-800",
      text: "text-gray-700 dark:text-gray-300",
      border: "border-gray-200 dark:border-gray-700",
    },
  },
};

// Theme utility functions
export const applyTheme = (theme: ThemeColors) => {
  const root = document.documentElement;

  Object.entries(theme).forEach(([key, value]) => {
    const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    root.style.setProperty(cssVar, value);
  });
};

export const getCurrentTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "light";
  return (localStorage.getItem("theme") as ThemeMode) || "light";
};

export const setTheme = (mode: ThemeMode) => {
  if (typeof window === "undefined") return;

  localStorage.setItem("theme", mode);

  const root = document.documentElement;

  if (mode === "auto") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    mode = prefersDark ? "dark" : "light";
  }

  if (mode === "dark") {
    root.classList.add("dark");
    applyTheme(darkTheme);
  } else {
    root.classList.remove("dark");
    applyTheme(lightTheme);
  }
};

// Initialize theme
export const initializeTheme = () => {
  const theme = getCurrentTheme();
  setTheme(theme);
};

export default {
  lightTheme,
  darkTheme,
  colorClasses,
  applyTheme,
  getCurrentTheme,
  setTheme,
  initializeTheme,
};
