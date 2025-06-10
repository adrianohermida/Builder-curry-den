/**
 * 🎯 SISTEMA DE TEMAS - CORES POR MODO
 *
 * Sistema de temas baseado no modo do usuário:
 * - Modo Cliente: Azul (tons e sobretom)
 * - Modo Admin: Vermelho (tons e sobretom)
 * - Temas: Claro, Escuro, Color Picker personalizado
 */

// ===== TYPES =====
export type UserMode = "client" | "admin";
export type ThemeMode = "light" | "dark" | "custom";

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primaryText: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  accent: string;
}

export interface ThemeConfig {
  userMode: UserMode;
  themeMode: ThemeMode;
  customColors?: Partial<ThemeColors>;
}

// ===== COLOR PALETTES =====
const CLIENT_COLORS = {
  light: {
    primary: "#3b82f6", // blue-500
    primaryHover: "#2563eb", // blue-600
    primaryActive: "#1d4ed8", // blue-700
    primaryText: "#ffffff",
    secondary: "#e0f2fe", // blue-50
    background: "#ffffff",
    surface: "#f8fafc", // slate-50
    text: "#1e293b", // slate-800
    textMuted: "#64748b", // slate-500
    border: "#e2e8f0", // slate-200
    accent: "#0ea5e9", // sky-500
  },
  dark: {
    primary: "#3b82f6", // blue-500
    primaryHover: "#60a5fa", // blue-400
    primaryActive: "#93c5fd", // blue-300
    primaryText: "#ffffff",
    secondary: "#1e3a8a", // blue-900
    background: "#0f172a", // slate-900
    surface: "#1e293b", // slate-800
    text: "#f1f5f9", // slate-100
    textMuted: "#94a3b8", // slate-400
    border: "#334155", // slate-700
    accent: "#0ea5e9", // sky-500
  },
};

const ADMIN_COLORS = {
  light: {
    primary: "#dc2626", // red-600
    primaryHover: "#b91c1c", // red-700
    primaryActive: "#991b1b", // red-800
    primaryText: "#ffffff",
    secondary: "#fef2f2", // red-50
    background: "#ffffff",
    surface: "#f8fafc", // slate-50
    text: "#1e293b", // slate-800
    textMuted: "#64748b", // slate-500
    border: "#e2e8f0", // slate-200
    accent: "#ef4444", // red-500
  },
  dark: {
    primary: "#dc2626", // red-600
    primaryHover: "#f87171", // red-400
    primaryActive: "#fca5a5", // red-300
    primaryText: "#ffffff",
    secondary: "#7f1d1d", // red-900
    background: "#0f172a", // slate-900
    surface: "#1e293b", // slate-800
    text: "#f1f5f9", // slate-100
    textMuted: "#94a3b8", // slate-400
    border: "#334155", // slate-700
    accent: "#ef4444", // red-500
  },
};

// ===== THEME UTILITIES =====
export class ThemeSystem {
  private static instance: ThemeSystem;
  private currentConfig: ThemeConfig;
  private listeners: Set<(config: ThemeConfig) => void> = new Set();

  private constructor() {
    this.currentConfig = this.loadConfig();
    this.applyTheme();
  }

  static getInstance(): ThemeSystem {
    if (!ThemeSystem.instance) {
      ThemeSystem.instance = new ThemeSystem();
    }
    return ThemeSystem.instance;
  }

  // Load configuration from localStorage
  private loadConfig(): ThemeConfig {
    try {
      const stored = localStorage.getItem("lawdesk-theme-config");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn("Failed to load theme config:", error);
    }

    return {
      userMode: "client",
      themeMode: "light",
    };
  }

  // Save configuration to localStorage
  private saveConfig(): void {
    try {
      localStorage.setItem(
        "lawdesk-theme-config",
        JSON.stringify(this.currentConfig),
      );
    } catch (error) {
      console.warn("Failed to save theme config:", error);
    }
  }

  // Get current colors based on user mode and theme mode
  getColors(): ThemeColors {
    const baseColors =
      this.currentConfig.userMode === "client" ? CLIENT_COLORS : ADMIN_COLORS;
    const modeColors =
      baseColors[this.currentConfig.themeMode] || baseColors.light;

    // Apply custom colors if in custom mode
    if (
      this.currentConfig.themeMode === "custom" &&
      this.currentConfig.customColors
    ) {
      return { ...modeColors, ...this.currentConfig.customColors };
    }

    return modeColors;
  }

  // Apply theme to DOM
  applyTheme(): void {
    const colors = this.getColors();
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove("light", "dark", "client-mode", "admin-mode");

    // Add current theme classes
    root.classList.add(this.currentConfig.themeMode);
    root.classList.add(`${this.currentConfig.userMode}-mode`);

    // Apply CSS custom properties
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    // Apply mode-specific styles
    root.style.setProperty(
      "--mode-primary",
      this.currentConfig.userMode === "client" ? "#3b82f6" : "#dc2626",
    );

    // Set meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector(
      'meta[name="theme-color"]',
    ) as HTMLMetaElement;
    if (metaThemeColor) {
      metaThemeColor.content = colors.primary;
    }
  }

  // Change user mode
  setUserMode(mode: UserMode): void {
    this.currentConfig.userMode = mode;
    this.saveConfig();
    this.applyTheme();
    this.notifyListeners();
  }

  // Change theme mode
  setThemeMode(mode: ThemeMode): void {
    this.currentConfig.themeMode = mode;
    this.saveConfig();
    this.applyTheme();
    this.notifyListeners();
  }

  // Set custom colors
  setCustomColors(colors: Partial<ThemeColors>): void {
    this.currentConfig.customColors = {
      ...this.currentConfig.customColors,
      ...colors,
    };
    this.currentConfig.themeMode = "custom";
    this.saveConfig();
    this.applyTheme();
    this.notifyListeners();
  }

  // Set primary color and generate palette
  setPrimaryColor(primaryColor: string): void {
    const generatedColors = this.generateColorPalette(primaryColor);
    this.setCustomColors(generatedColors);
  }

  // Generate color palette from primary color
  private generateColorPalette(primaryColor: string): Partial<ThemeColors> {
    // Convert hex to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    };

    // Convert RGB to hex
    const rgbToHex = (r: number, g: number, b: number) => {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    // Darken color
    const darkenColor = (hex: string, percent: number) => {
      const rgb = hexToRgb(hex);
      if (!rgb) return hex;

      const factor = (100 - percent) / 100;
      return rgbToHex(
        Math.round(rgb.r * factor),
        Math.round(rgb.g * factor),
        Math.round(rgb.b * factor),
      );
    };

    // Lighten color
    const lightenColor = (hex: string, percent: number) => {
      const rgb = hexToRgb(hex);
      if (!rgb) return hex;

      const factor = percent / 100;
      return rgbToHex(
        Math.round(rgb.r + (255 - rgb.r) * factor),
        Math.round(rgb.g + (255 - rgb.g) * factor),
        Math.round(rgb.b + (255 - rgb.b) * factor),
      );
    };

    const baseColors = this.getColors();

    return {
      primary: primaryColor,
      primaryHover: darkenColor(primaryColor, 10),
      primaryActive: darkenColor(primaryColor, 20),
      secondary: lightenColor(primaryColor, 40),
      accent: primaryColor,
    };
  }

  // Reset to default theme
  resetToDefault(): void {
    this.currentConfig = {
      userMode: this.currentConfig.userMode, // Keep current user mode
      themeMode: "light",
      customColors: undefined,
    };
    this.saveConfig();
    this.applyTheme();
    this.notifyListeners();
  }

  // Get current configuration
  getConfig(): ThemeConfig {
    return { ...this.currentConfig };
  }

  // Subscribe to theme changes
  subscribe(listener: (config: ThemeConfig) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.getConfig()));
  }

  // Toggle between light and dark
  toggleTheme(): void {
    const newMode = this.currentConfig.themeMode === "light" ? "dark" : "light";
    this.setThemeMode(newMode);
  }

  // Switch user mode (for admin switching to client view)
  switchToClientView(): void {
    this.setUserMode("client");
  }

  // Switch back to admin mode
  switchToAdminView(): void {
    this.setUserMode("admin");
  }

  // Check if current user is admin
  isAdminMode(): boolean {
    return this.currentConfig.userMode === "admin";
  }

  // Check if current user is client
  isClientMode(): boolean {
    return this.currentConfig.userMode === "client";
  }

  // Get CSS class for current mode
  getModeClass(): string {
    return `${this.currentConfig.userMode}-mode ${this.currentConfig.themeMode}`;
  }
}

// ===== REACT HOOK =====
import { useState, useEffect } from "react";

export function useTheme() {
  const themeSystem = ThemeSystem.getInstance();
  const [config, setConfig] = useState(themeSystem.getConfig());
  const [colors, setColors] = useState(themeSystem.getColors());

  useEffect(() => {
    const unsubscribe = themeSystem.subscribe((newConfig) => {
      setConfig(newConfig);
      setColors(themeSystem.getColors());
    });

    return unsubscribe;
  }, [themeSystem]);

  return {
    config,
    colors,
    setUserMode: themeSystem.setUserMode.bind(themeSystem),
    setThemeMode: themeSystem.setThemeMode.bind(themeSystem),
    setCustomColors: themeSystem.setCustomColors.bind(themeSystem),
    toggleTheme: themeSystem.toggleTheme.bind(themeSystem),
    switchToClientView: themeSystem.switchToClientView.bind(themeSystem),
    switchToAdminView: themeSystem.switchToAdminView.bind(themeSystem),
    isAdminMode: themeSystem.isAdminMode.bind(themeSystem),
    isClientMode: themeSystem.isClientMode.bind(themeSystem),
    getModeClass: themeSystem.getModeClass.bind(themeSystem),
  };
}

// ===== DEFAULT EXPORT =====
export default ThemeSystem;
