/**
 * 🎨 SISTEMA DE TEMA CORRIGIDO - LAWDESK 2025+
 *
 * Sistema de temas sem transparências e com cores sólidas:
 * - Data-theme no HTML
 * - Cores CSS variables sólidas
 * - Modo cliente/admin
 * - Alto contraste
 * - Mobile-first responsivo
 */

import { useState, useEffect, useCallback } from "react";

// ===== TYPES =====
export type ThemeMode = "light" | "dark" | "high-contrast";
export type UserMode = "client" | "admin";
export type CombinedTheme =
  | "light"
  | "dark"
  | "admin"
  | "admin-dark"
  | "high-contrast";

export interface ThemeConfig {
  mode: ThemeMode;
  userMode: UserMode;
  reducedMotion: boolean;
  fontSize: "sm" | "base" | "lg";
}

export interface ThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  card: string;
  cardForeground: string;
  border: string;
  input: string;
  ring: string;
  success: string;
  warning: string;
  destructive: string;
  info: string;
}

// ===== CONFIGURAÇÕES DE TEMA =====
const THEME_COLORS: Record<CombinedTheme, ThemeColors> = {
  light: {
    primary: "rgb(59 130 246)", // blue-500
    primaryForeground: "rgb(255 255 255)",
    secondary: "rgb(241 245 249)", // slate-100
    secondaryForeground: "rgb(15 23 42)", // slate-900
    accent: "rgb(14 165 233)", // sky-500
    accentForeground: "rgb(255 255 255)",
    background: "rgb(255 255 255)",
    foreground: "rgb(15 23 42)", // slate-900
    muted: "rgb(248 250 252)", // slate-50
    mutedForeground: "rgb(100 116 139)", // slate-500
    card: "rgb(255 255 255)",
    cardForeground: "rgb(15 23 42)",
    border: "rgb(226 232 240)", // slate-200
    input: "rgb(226 232 240)",
    ring: "rgb(59 130 246)",
    success: "rgb(34 197 94)", // green-500
    warning: "rgb(245 158 11)", // amber-500
    destructive: "rgb(239 68 68)", // red-500
    info: "rgb(59 130 246)", // blue-500
  },
  dark: {
    primary: "rgb(59 130 246)", // blue-500
    primaryForeground: "rgb(255 255 255)",
    secondary: "rgb(30 41 59)", // slate-800
    secondaryForeground: "rgb(248 250 252)", // slate-50
    accent: "rgb(14 165 233)", // sky-500
    accentForeground: "rgb(255 255 255)",
    background: "rgb(2 8 23)", // slate-950
    foreground: "rgb(248 250 252)", // slate-50
    muted: "rgb(30 41 59)", // slate-800
    mutedForeground: "rgb(148 163 184)", // slate-400
    card: "rgb(15 23 42)", // slate-900
    cardForeground: "rgb(248 250 252)",
    border: "rgb(51 65 85)", // slate-700
    input: "rgb(30 41 59)",
    ring: "rgb(59 130 246)",
    success: "rgb(34 197 94)",
    warning: "rgb(245 158 11)",
    destructive: "rgb(239 68 68)",
    info: "rgb(59 130 246)",
  },
  admin: {
    primary: "rgb(220 38 38)", // red-600
    primaryForeground: "rgb(255 255 255)",
    secondary: "rgb(241 245 249)",
    secondaryForeground: "rgb(15 23 42)",
    accent: "rgb(239 68 68)", // red-500
    accentForeground: "rgb(255 255 255)",
    background: "rgb(255 255 255)",
    foreground: "rgb(15 23 42)",
    muted: "rgb(248 250 252)",
    mutedForeground: "rgb(100 116 139)",
    card: "rgb(255 255 255)",
    cardForeground: "rgb(15 23 42)",
    border: "rgb(226 232 240)",
    input: "rgb(226 232 240)",
    ring: "rgb(220 38 38)",
    success: "rgb(34 197 94)",
    warning: "rgb(245 158 11)",
    destructive: "rgb(239 68 68)",
    info: "rgb(59 130 246)",
  },
  "admin-dark": {
    primary: "rgb(220 38 38)", // red-600
    primaryForeground: "rgb(255 255 255)",
    secondary: "rgb(153 27 27)", // red-800
    secondaryForeground: "rgb(254 242 242)", // red-50
    accent: "rgb(239 68 68)", // red-500
    accentForeground: "rgb(255 255 255)",
    background: "rgb(23 7 7)", // red-950
    foreground: "rgb(254 242 242)", // red-50
    muted: "rgb(153 27 27)", // red-800
    mutedForeground: "rgb(252 165 165)", // red-300
    card: "rgb(127 29 29)", // red-900
    cardForeground: "rgb(254 242 242)",
    border: "rgb(185 28 28)", // red-700
    input: "rgb(153 27 27)",
    ring: "rgb(220 38 38)",
    success: "rgb(34 197 94)",
    warning: "rgb(245 158 11)",
    destructive: "rgb(239 68 68)",
    info: "rgb(59 130 246)",
  },
  "high-contrast": {
    primary: "rgb(255 255 0)", // amarelo para alto contraste
    primaryForeground: "rgb(0 0 0)",
    secondary: "rgb(64 64 64)",
    secondaryForeground: "rgb(255 255 255)",
    accent: "rgb(255 255 0)",
    accentForeground: "rgb(0 0 0)",
    background: "rgb(0 0 0)",
    foreground: "rgb(255 255 255)",
    muted: "rgb(64 64 64)",
    mutedForeground: "rgb(192 192 192)",
    card: "rgb(0 0 0)",
    cardForeground: "rgb(255 255 255)",
    border: "rgb(255 255 255)",
    input: "rgb(32 32 32)",
    ring: "rgb(255 255 0)",
    success: "rgb(0 255 0)",
    warning: "rgb(255 165 0)",
    destructive: "rgb(255 0 0)",
    info: "rgb(0 255 255)",
  },
};

// ===== SISTEMA DE TEMA CORRIGIDO =====
class CorrectedThemeSystem {
  private static instance: CorrectedThemeSystem;
  private config: ThemeConfig;
  private listeners: Set<(config: ThemeConfig) => void> = new Set();

  private constructor() {
    this.config = this.loadConfig();
    this.applyTheme();
  }

  static getInstance(): CorrectedThemeSystem {
    if (!CorrectedThemeSystem.instance) {
      CorrectedThemeSystem.instance = new CorrectedThemeSystem();
    }
    return CorrectedThemeSystem.instance;
  }

  // Carregar configuração
  private loadConfig(): ThemeConfig {
    if (typeof window === "undefined") {
      return {
        mode: "light",
        userMode: "client",
        reducedMotion: false,
        fontSize: "base",
      };
    }

    try {
      const stored = localStorage.getItem("lawdesk-corrected-theme");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validar se o objeto está correto
        if (this.isValidConfig(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn("Erro ao carregar configuração de tema:", error);
    }

    // Detectar preferências do sistema
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    return {
      mode: prefersDark ? "dark" : "light",
      userMode: "client",
      reducedMotion: prefersReducedMotion,
      fontSize: "base",
    };
  }

  // Validar configuração
  private isValidConfig(config: any): config is ThemeConfig {
    return (
      config &&
      typeof config === "object" &&
      ["light", "dark", "high-contrast"].includes(config.mode) &&
      ["client", "admin"].includes(config.userMode) &&
      typeof config.reducedMotion === "boolean" &&
      ["sm", "base", "lg"].includes(config.fontSize)
    );
  }

  // Salvar configuração
  private saveConfig(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(
        "lawdesk-corrected-theme",
        JSON.stringify(this.config),
      );
    } catch (error) {
      console.warn("Erro ao salvar configuração de tema:", error);
    }
  }

  // Aplicar tema no DOM
  applyTheme(): void {
    if (typeof document === "undefined") return;

    const combinedTheme = this.getCombinedTheme();
    const colors = THEME_COLORS[combinedTheme];

    // Aplicar data-theme no HTML
    document.documentElement.setAttribute("data-theme", combinedTheme);

    // Aplicar classes no body
    document.body.className = this.getBodyClasses();

    // Aplicar CSS variables (backup para compatibilidade)
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = `--color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });

    // Meta theme-color para mobile
    this.updateMetaThemeColor(colors.primary);

    // Aplicar reduced motion
    if (this.config.reducedMotion) {
      root.style.setProperty("--motion-duration", "0.01ms");
    } else {
      root.style.removeProperty("--motion-duration");
    }

    console.log("🎨 Tema aplicado:", {
      theme: combinedTheme,
      userMode: this.config.userMode,
      mode: this.config.mode,
    });
  }

  // Obter tema combinado
  private getCombinedTheme(): CombinedTheme {
    if (this.config.mode === "high-contrast") {
      return "high-contrast";
    }

    if (this.config.userMode === "admin") {
      return this.config.mode === "dark" ? "admin-dark" : "admin";
    }

    return this.config.mode;
  }

  // Obter classes do body
  private getBodyClasses(): string {
    const classes = [
      `theme-${this.getCombinedTheme()}`,
      `user-${this.config.userMode}`,
      `font-${this.config.fontSize}`,
    ];

    if (this.config.reducedMotion) {
      classes.push("reduced-motion");
    }

    return classes.join(" ");
  }

  // Atualizar meta theme-color
  private updateMetaThemeColor(color: string): void {
    let metaThemeColor = document.querySelector(
      'meta[name="theme-color"]',
    ) as HTMLMetaElement;

    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.name = "theme-color";
      document.head.appendChild(metaThemeColor);
    }

    metaThemeColor.content = color;
  }

  // Métodos públicos
  setMode(mode: ThemeMode): void {
    this.config.mode = mode;
    this.saveConfig();
    this.applyTheme();
    this.notifyListeners();
  }

  setUserMode(userMode: UserMode): void {
    this.config.userMode = userMode;
    this.saveConfig();
    this.applyTheme();
    this.notifyListeners();
  }

  toggleMode(): void {
    const nextMode = this.config.mode === "light" ? "dark" : "light";
    this.setMode(nextMode);
  }

  toggleUserMode(): void {
    const nextUserMode = this.config.userMode === "client" ? "admin" : "client";
    this.setUserMode(nextUserMode);
  }

  setFontSize(fontSize: "sm" | "base" | "lg"): void {
    this.config.fontSize = fontSize;
    this.saveConfig();
    this.applyTheme();
    this.notifyListeners();
  }

  setReducedMotion(reducedMotion: boolean): void {
    this.config.reducedMotion = reducedMotion;
    this.saveConfig();
    this.applyTheme();
    this.notifyListeners();
  }

  // Getters
  getConfig(): ThemeConfig {
    return { ...this.config };
  }

  getColors(): ThemeColors {
    return THEME_COLORS[this.getCombinedTheme()];
  }

  getCombinedThemePublic(): CombinedTheme {
    return this.getCombinedTheme();
  }

  isAdminMode(): boolean {
    return this.config.userMode === "admin";
  }

  isDarkMode(): boolean {
    return (
      this.config.mode === "dark" || this.getCombinedTheme().includes("dark")
    );
  }

  // Listeners
  subscribe(listener: (config: ThemeConfig) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.getConfig()));
  }
}

// ===== REACT HOOK =====
export function useCorrectedTheme() {
  const [config, setConfig] = useState<ThemeConfig>(() =>
    CorrectedThemeSystem.getInstance().getConfig(),
  );

  const themeSystem = CorrectedThemeSystem.getInstance();

  useEffect(() => {
    const unsubscribe = themeSystem.subscribe(setConfig);
    return unsubscribe;
  }, [themeSystem]);

  const colors = themeSystem.getColors();
  const combinedTheme = themeSystem.getCombinedThemePublic();

  return {
    config,
    colors,
    combinedTheme,
    isAdminMode: themeSystem.isAdminMode(),
    isDarkMode: themeSystem.isDarkMode(),
    setMode: themeSystem.setMode.bind(themeSystem),
    setUserMode: themeSystem.setUserMode.bind(themeSystem),
    toggleMode: themeSystem.toggleMode.bind(themeSystem),
    toggleUserMode: themeSystem.toggleUserMode.bind(themeSystem),
    setFontSize: themeSystem.setFontSize.bind(themeSystem),
    setReducedMotion: themeSystem.setReducedMotion.bind(themeSystem),
  };
}

// ===== UTILITY FUNCTIONS =====
export const applyThemeToDocument = () => {
  CorrectedThemeSystem.getInstance().applyTheme();
};

export const getThemeColors = (): ThemeColors => {
  return CorrectedThemeSystem.getInstance().getColors();
};

export const isAdminMode = (): boolean => {
  return CorrectedThemeSystem.getInstance().isAdminMode();
};

export default CorrectedThemeSystem;
