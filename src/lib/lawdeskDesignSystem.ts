/**
 * 🎨 LAWDESK DESIGN SYSTEM - PALETA HARMONIOSA
 *
 * Sistema de design com cores tom sobre tom:
 * - Paleta Clear: Tons de azul suaves e modernos
 * - Paleta Dark: Tons escuros elegantes com acentos
 * - Paleta Color: Tons vibrantes personalizáveis
 * - Experiência visual excepcional
 */

export type ThemeMode = "clear" | "dark" | "color";
export type UserMode = "client" | "admin";

export interface ColorPalette {
  // Primary colors
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };

  // Neutral colors
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };

  // Semantic colors
  semantic: {
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
}

export interface ThemeConfig {
  mode: ThemeMode;
  userMode: UserMode;
  palette: ColorPalette;
  surfaces: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    accent: string;
  };
  borders: {
    light: string;
    medium: string;
    heavy: string;
    accent: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// CLEAR THEME - Tom sobre tom azul suave
export const clearTheme: ColorPalette = {
  primary: {
    50: "#eff6ff", // Azul gelo suave
    100: "#dbeafe", // Azul névoa
    200: "#bfdbfe", // Azul cristal
    300: "#93c5fd", // Azul céu claro
    400: "#60a5fa", // Azul vibrante
    500: "#3b82f6", // Azul principal Lawdesk
    600: "#2563eb", // Azul profundo
    700: "#1d4ed8", // Azul intenso
    800: "#1e40af", // Azul escuro
    900: "#1e3a8a", // Azul navy
    950: "#172554", // Azul midnight
  },
  neutral: {
    50: "#f8fafc", // Branco gelo
    100: "#f1f5f9", // Cinza gelo
    200: "#e2e8f0", // Cinza névoa
    300: "#cbd5e1", // Cinza suave
    400: "#94a3b8", // Cinza médio
    500: "#64748b", // Cinza balanceado
    600: "#475569", // Cinza sólido
    700: "#334155", // Cinza escuro
    800: "#1e293b", // Cinza profundo
    900: "#0f172a", // Quase preto
    950: "#020617", // Preto absoluto
  },
  semantic: {
    success: "#059669", // Verde esmeralda
    warning: "#d97706", // Âmbar (NO YELLOW!)
    danger: "#dc2626", // Vermelho cardinal
    info: "#0284c7", // Azul informativo
  },
};

// DARK THEME - Tom sobre tom escuro elegante
export const darkTheme: ColorPalette = {
  primary: {
    50: "#1e293b", // Base escura
    100: "#334155", // Cinza escuro suave
    200: "#475569", // Cinza médio escuro
    300: "#64748b", // Cinza balanceado
    400: "#94a3b8", // Cinza claro
    500: "#cbd5e1", // Cinza muito claro
    600: "#e2e8f0", // Quase branco
    700: "#f1f5f9", // Branco suave
    800: "#f8fafc", // Branco
    900: "#ffffff", // Branco puro
    950: "#ffffff", // Branco absoluto
  },
  neutral: {
    50: "#020617", // Preto profundo
    100: "#0f172a", // Preto suave
    200: "#1e293b", // Cinza muito escuro
    300: "#334155", // Cinza escuro
    400: "#475569", // Cinza médio escuro
    500: "#64748b", // Cinza médio
    600: "#94a3b8", // Cinza claro
    700: "#cbd5e1", // Cinza muito claro
    800: "#e2e8f0", // Quase branco
    900: "#f1f5f9", // Branco suave
    950: "#f8fafc", // Branco
  },
  semantic: {
    success: "#10b981", // Verde mint
    warning: "#f59e0b", // Âmbar brilhante
    danger: "#ef4444", // Vermelho vibrante
    info: "#06b6d4", // Cyan
  },
};

// COLOR THEME - Tom sobre tom violeta/índigo vibrante
export const colorTheme: ColorPalette = {
  primary: {
    50: "#faf5ff", // Violeta gelo
    100: "#f3e8ff", // Violeta névoa
    200: "#e9d5ff", // Violeta suave
    300: "#d8b4fe", // Violeta claro
    400: "#c084fc", // Violeta médio
    500: "#a855f7", // Violeta vibrante
    600: "#9333ea", // Violeta principal
    700: "#7c3aed", // Violeta profundo
    800: "#6b21a8", // Violeta escuro
    900: "#581c87", // Violeta intenso
    950: "#3b0764", // Violeta midnight
  },
  neutral: {
    50: "#fefcff", // Branco lilás
    100: "#fdf7ff", // Branco violeta
    200: "#f8f0ff", // Cinza violeta suave
    300: "#f0e6ff", // Cinza violeta
    400: "#d8c5ff", // Cinza violeta médio
    500: "#b794f6", // Cinza violeta vibrante
    600: "#9f7aea", // Cinza violeta sólido
    700: "#805ad5", // Cinza violeta escuro
    800: "#6b46c1", // Cinza violeta profundo
    900: "#553c9a", // Cinza violeta intenso
    950: "#44337a", // Cinza violeta midnight
  },
  semantic: {
    success: "#059669", // Verde esmeralda
    warning: "#d97706", // Âmbar dourado
    danger: "#dc2626", // Vermelho cardinal
    info: "#7c3aed", // Violeta informativo
  },
};

export class LawdeskDesignSystem {
  private static instance: LawdeskDesignSystem;
  private currentTheme: ThemeConfig;

  static getInstance(): LawdeskDesignSystem {
    if (!LawdeskDesignSystem.instance) {
      LawdeskDesignSystem.instance = new LawdeskDesignSystem();
    }
    return LawdeskDesignSystem.instance;
  }

  private constructor() {
    this.currentTheme = this.createThemeConfig("clear", "client");
  }

  createThemeConfig(mode: ThemeMode, userMode: UserMode): ThemeConfig {
    let palette: ColorPalette;

    switch (mode) {
      case "dark":
        palette = darkTheme;
        break;
      case "color":
        palette = colorTheme;
        break;
      default:
        palette = clearTheme;
    }

    // Admin mode overrides
    if (userMode === "admin") {
      palette = {
        ...palette,
        primary: {
          ...palette.primary,
          500: "#dc2626", // Red-600 for admin
          600: "#b91c1c", // Red-700 for admin
          700: "#991b1b", // Red-800 for admin
        },
        semantic: {
          ...palette.semantic,
          warning: "#dc2626", // Red for admin warnings
          info: "#dc2626", // Red for admin info
        },
      };
    }

    return {
      mode,
      userMode,
      palette,
      surfaces: this.createSurfaces(palette, mode),
      text: this.createTextColors(palette, mode),
      borders: this.createBorderColors(palette, mode),
      shadows: this.createShadows(mode),
    };
  }

  private createSurfaces(palette: ColorPalette, mode: ThemeMode) {
    if (mode === "dark") {
      return {
        primary: palette.neutral[950], // Preto profundo
        secondary: palette.neutral[900], // Preto suave
        tertiary: palette.neutral[800], // Cinza muito escuro
        elevated: palette.neutral[700], // Cinza escuro com elevação
        overlay: "rgba(0, 0, 0, 0.8)", // Overlay escuro
      };
    }

    return {
      primary: palette.neutral[50], // Branco principal
      secondary: palette.primary[50], // Tom primário suave
      tertiary: palette.neutral[100], // Cinza gelo
      elevated: "#ffffff", // Branco elevado
      overlay: "rgba(0, 0, 0, 0.4)", // Overlay suave
    };
  }

  private createTextColors(palette: ColorPalette, mode: ThemeMode) {
    if (mode === "dark") {
      return {
        primary: palette.neutral[100], // Quase branco
        secondary: palette.neutral[400], // Cinza claro
        tertiary: palette.neutral[500], // Cinza médio
        inverse: palette.neutral[900], // Escuro para contraste
        accent: palette.primary[400], // Cor de destaque
      };
    }

    return {
      primary: palette.neutral[900], // Quase preto
      secondary: palette.neutral[600], // Cinza sólido
      tertiary: palette.neutral[500], // Cinza balanceado
      inverse: palette.neutral[50], // Branco para contraste
      accent: palette.primary[600], // Cor de destaque
    };
  }

  private createBorderColors(palette: ColorPalette, mode: ThemeMode) {
    if (mode === "dark") {
      return {
        light: palette.neutral[800], // Borda suave escura
        medium: palette.neutral[700], // Borda média escura
        heavy: palette.neutral[600], // Borda forte escura
        accent: palette.primary[600], // Borda de destaque
      };
    }

    return {
      light: palette.neutral[200], // Borda suave
      medium: palette.neutral[300], // Borda média
      heavy: palette.neutral[400], // Borda forte
      accent: palette.primary[200], // Borda de destaque
    };
  }

  private createShadows(mode: ThemeMode) {
    const shadowColor = mode === "dark" ? "0, 0, 0" : "0, 0, 0";
    const opacity = mode === "dark" ? "0.3" : "0.1";

    return {
      sm: `0 1px 2px 0 rgba(${shadowColor}, ${opacity})`,
      md: `0 4px 6px -1px rgba(${shadowColor}, ${opacity}), 0 2px 4px -1px rgba(${shadowColor}, 0.06)`,
      lg: `0 10px 15px -3px rgba(${shadowColor}, ${opacity}), 0 4px 6px -2px rgba(${shadowColor}, 0.05)`,
      xl: `0 20px 25px -5px rgba(${shadowColor}, ${opacity}), 0 10px 10px -5px rgba(${shadowColor}, 0.04)`,
    };
  }

  applyTheme(mode: ThemeMode, userMode: UserMode) {
    this.currentTheme = this.createThemeConfig(mode, userMode);
    this.injectCSS();
    return this.currentTheme;
  }

  getCurrentTheme(): ThemeConfig {
    return this.currentTheme;
  }

  private injectCSS() {
    const { palette, surfaces, text, borders, shadows } = this.currentTheme;

    // Remove existing style
    const existingStyle = document.getElementById("lawdesk-design-system");
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create new style element
    const style = document.createElement("style");
    style.id = "lawdesk-design-system";

    const css = `
      /* =================================
         LAWDESK DESIGN SYSTEM
         Tom sobre tom harmônico
         ================================= */

      :root {
        /* Primary Palette */
        --primary-50: ${palette.primary[50]};
        --primary-100: ${palette.primary[100]};
        --primary-200: ${palette.primary[200]};
        --primary-300: ${palette.primary[300]};
        --primary-400: ${palette.primary[400]};
        --primary-500: ${palette.primary[500]};
        --primary-600: ${palette.primary[600]};
        --primary-700: ${palette.primary[700]};
        --primary-800: ${palette.primary[800]};
        --primary-900: ${palette.primary[900]};
        --primary-950: ${palette.primary[950]};

        /* Neutral Palette */
        --neutral-50: ${palette.neutral[50]};
        --neutral-100: ${palette.neutral[100]};
        --neutral-200: ${palette.neutral[200]};
        --neutral-300: ${palette.neutral[300]};
        --neutral-400: ${palette.neutral[400]};
        --neutral-500: ${palette.neutral[500]};
        --neutral-600: ${palette.neutral[600]};
        --neutral-700: ${palette.neutral[700]};
        --neutral-800: ${palette.neutral[800]};
        --neutral-900: ${palette.neutral[900]};
        --neutral-950: ${palette.neutral[950]};

        /* Semantic Colors */
        --color-success: ${palette.semantic.success};
        --color-warning: ${palette.semantic.warning};
        --color-danger: ${palette.semantic.danger};
        --color-info: ${palette.semantic.info};

        /* Surfaces */
        --surface-primary: ${surfaces.primary};
        --surface-secondary: ${surfaces.secondary};
        --surface-tertiary: ${surfaces.tertiary};
        --surface-elevated: ${surfaces.elevated};
        --surface-overlay: ${surfaces.overlay};

        /* Text Colors */
        --text-primary: ${text.primary};
        --text-secondary: ${text.secondary};
        --text-tertiary: ${text.tertiary};
        --text-inverse: ${text.inverse};
        --text-accent: ${text.accent};

        /* Border Colors */
        --border-light: ${borders.light};
        --border-medium: ${borders.medium};
        --border-heavy: ${borders.heavy};
        --border-accent: ${borders.accent};

        /* Shadows */
        --shadow-sm: ${shadows.sm};
        --shadow-md: ${shadows.md};
        --shadow-lg: ${shadows.lg};
        --shadow-xl: ${shadows.xl};

        /* Legacy CSS Variables for compatibility */
        --primary: ${this.hexToRgb(palette.primary[500])};
        --primary-foreground: ${this.hexToRgb(text.inverse)};
        --secondary: ${this.hexToRgb(surfaces.secondary)};
        --secondary-foreground: ${this.hexToRgb(text.primary)};
        --background: ${this.hexToRgb(surfaces.primary)};
        --foreground: ${this.hexToRgb(text.primary)};
        --muted: ${this.hexToRgb(surfaces.tertiary)};
        --muted-foreground: ${this.hexToRgb(text.secondary)};
        --border: ${this.hexToRgb(borders.light)};
        --ring: ${this.hexToRgb(palette.primary[500])};
        --accent: ${this.hexToRgb(surfaces.secondary)};
        --accent-foreground: ${this.hexToRgb(text.accent)};
      }

      /* ABSOLUTE OVERRIDES - ELIMINATE ALL FORBIDDEN COLORS */
      html body *[style*="background-color: rgb(255, 255, 0)"],
      html body *[style*="background-color: #FFFF00"],
      html body *[style*="background-color: yellow"],
      html body *[style*="background: rgb(255, 255, 0)"],
      html body *[style*="background: yellow"],
      html body *[style*="color: rgb(193, 150, 108)"],
      html body *[style*="color: rgb(255, 255, 0)"],
      html body *.bg-yellow-50,
      html body *.bg-yellow-100,
      html body *.bg-yellow-200,
      html body *.bg-yellow-300,
      html body *.bg-yellow-400,
      html body *.bg-yellow-500,
      html body *.bg-yellow-600,
      html body *.bg-yellow-700,
      html body *.bg-yellow-800,
      html body *.bg-yellow-900,
      html body *.bg-orange-50,
      html body *.bg-orange-100,
      html body *.bg-orange-200,
      html body *.bg-orange-300,
      html body *.bg-orange-400,
      html body *.bg-orange-500,
      html body *.bg-orange-600,
      html body *.bg-orange-700,
      html body *.bg-orange-800,
      html body *.bg-orange-900 {
        background-color: var(--primary-500) !important;
        background: var(--primary-500) !important;
      }

      html body *[style*="color: rgb(255, 255, 0)"],
      html body *[style*="color: yellow"],
      html body *[style*="color: rgb(193, 150, 108)"],
      html body *.text-yellow-50,
      html body *.text-yellow-100,
      html body *.text-yellow-200,
      html body *.text-yellow-300,
      html body *.text-yellow-400,
      html body *.text-yellow-500,
      html body *.text-yellow-600,
      html body *.text-yellow-700,
      html body *.text-yellow-800,
      html body *.text-yellow-900,
      html body *.text-orange-50,
      html body *.text-orange-100,
      html body *.text-orange-200,
      html body *.text-orange-300,
      html body *.text-orange-400,
      html body *.text-orange-500,
      html body *.text-orange-600,
      html body *.text-orange-700,
      html body *.text-orange-800,
      html body *.text-orange-900 {
        color: var(--text-accent) !important;
      }

      /* DESIGN SYSTEM UTILITIES */
      .ds-surface-primary { background-color: var(--surface-primary) !important; }
      .ds-surface-secondary { background-color: var(--surface-secondary) !important; }
      .ds-surface-tertiary { background-color: var(--surface-tertiary) !important; }
      .ds-surface-elevated { background-color: var(--surface-elevated) !important; }

      .ds-text-primary { color: var(--text-primary) !important; }
      .ds-text-secondary { color: var(--text-secondary) !important; }
      .ds-text-tertiary { color: var(--text-tertiary) !important; }
      .ds-text-accent { color: var(--text-accent) !important; }

      .ds-border-light { border-color: var(--border-light) !important; }
      .ds-border-medium { border-color: var(--border-medium) !important; }
      .ds-border-heavy { border-color: var(--border-heavy) !important; }
      .ds-border-accent { border-color: var(--border-accent) !important; }

      .ds-shadow-sm { box-shadow: var(--shadow-sm) !important; }
      .ds-shadow-md { box-shadow: var(--shadow-md) !important; }
      .ds-shadow-lg { box-shadow: var(--shadow-lg) !important; }
      .ds-shadow-xl { box-shadow: var(--shadow-xl) !important; }

      /* THEME UTILITIES */
      .theme-bg { background-color: var(--surface-primary) !important; }
      .theme-surface { background-color: var(--surface-secondary) !important; }
      .theme-accent { background-color: var(--surface-tertiary) !important; }
      .theme-text { color: var(--text-primary) !important; }

      /* SMOOTH TRANSITIONS */
      * {
        transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform !important;
        transition-duration: 200ms !important;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
      }

      /* ELEVATED COMPONENTS */
      .elevated-1 { box-shadow: var(--shadow-sm) !important; }
      .elevated-2 { box-shadow: var(--shadow-md) !important; }
      .elevated-3 { box-shadow: var(--shadow-lg) !important; }

      /* MODERN SCROLLBARS */
      .modern-scroll::-webkit-scrollbar {
        width: 6px !important;
        height: 6px !important;
      }

      .modern-scroll::-webkit-scrollbar-track {
        background: var(--surface-tertiary) !important;
        border-radius: 3px !important;
      }

      .modern-scroll::-webkit-scrollbar-thumb {
        background: var(--border-medium) !important;
        border-radius: 3px !important;
      }

      .modern-scroll::-webkit-scrollbar-thumb:hover {
        background: var(--border-heavy) !important;
      }
    `;

    style.textContent = css;
    document.head.appendChild(style);
  }

  private hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return "0 0 0";

    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);

    return `${r} ${g} ${b}`;
  }
}

// Export singleton
export const lawdeskDesignSystem = LawdeskDesignSystem.getInstance();
