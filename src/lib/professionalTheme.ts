/**
 * 🎨 PROFESSIONAL CLEAN THEME
 *
 * Tema limpo e profissional sem cores excessivas:
 * - Paleta neutra e elegante
 * - Foco na legibilidade
 * - Design corporativo
 * - Sem gradientes ou efeitos desnecessários
 */

export const professionalTheme = {
  // ===== CORES PRINCIPAIS =====
  colors: {
    // Neutros (base do design)
    white: "#ffffff",
    black: "#000000",

    // Cinzas profissionais
    gray: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
    },

    // Azul corporativo (único accent)
    blue: {
      50: "#eff6ff",
      100: "#dbeafe",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      900: "#1e3a8a",
    },

    // Estados (mínimos necessários)
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },

  // ===== TIPOGRAFIA =====
  typography: {
    fontFamily: {
      sans: [
        "Inter",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "sans-serif",
      ],
      mono: ["Fira Code", "Monaco", "Cascadia Code", "monospace"],
    },

    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
    },

    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },

    lineHeight: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.75",
    },
  },

  // ===== ESPAÇAMENTO =====
  spacing: {
    0: "0",
    1: "0.25rem", // 4px
    2: "0.5rem", // 8px
    3: "0.75rem", // 12px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    8: "2rem", // 32px
    10: "2.5rem", // 40px
    12: "3rem", // 48px
    16: "4rem", // 64px
    20: "5rem", // 80px
  },

  // ===== BORDAS E RAIOS =====
  borderRadius: {
    none: "0",
    sm: "0.125rem", // 2px
    DEFAULT: "0.25rem", // 4px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    full: "9999px",
  },

  // ===== SOMBRAS SUTIS =====
  boxShadow: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    none: "none",
  },

  // ===== COMPONENTES =====
  components: {
    // Botões
    button: {
      primary: {
        bg: "bg-gray-900",
        text: "text-white",
        hover: "hover:bg-gray-800",
        focus: "focus:ring-2 focus:ring-gray-900 focus:ring-offset-2",
      },
      secondary: {
        bg: "bg-white",
        text: "text-gray-900",
        border: "border border-gray-300",
        hover: "hover:bg-gray-50",
        focus: "focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
      },
      ghost: {
        bg: "bg-transparent",
        text: "text-gray-600",
        hover: "hover:text-gray-900 hover:bg-gray-100",
      },
    },

    // Cards
    card: {
      DEFAULT: {
        bg: "bg-white",
        border: "border border-gray-200",
        shadow: "shadow-sm",
        radius: "rounded-lg",
      },
    },

    // Inputs
    input: {
      DEFAULT: {
        bg: "bg-white",
        border: "border border-gray-300",
        text: "text-gray-900",
        placeholder: "placeholder-gray-500",
        focus: "focus:border-gray-900 focus:ring-1 focus:ring-gray-900",
        radius: "rounded-md",
      },
    },

    // Navigation
    nav: {
      item: {
        default: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
        active: "text-gray-900 bg-gray-100 font-medium",
      },
    },
  },

  // ===== ANIMAÇÕES SUTIS =====
  animation: {
    duration: {
      fast: "150ms",
      normal: "200ms",
      slow: "300ms",
    },

    easing: {
      DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
    },
  },

  // ===== BREAKPOINTS =====
  screens: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
};

// ===== CSS VARIABLES =====
export const professionalCSSVariables = `
  :root {
    /* Colors */
    --color-primary: ${professionalTheme.colors.gray[900]};
    --color-secondary: ${professionalTheme.colors.gray[600]};
    --color-accent: ${professionalTheme.colors.blue[600]};
    
    /* Backgrounds */
    --bg-primary: ${professionalTheme.colors.white};
    --bg-secondary: ${professionalTheme.colors.gray[50]};
    --bg-tertiary: ${professionalTheme.colors.gray[100]};
    
    /* Borders */
    --border-color: ${professionalTheme.colors.gray[200]};
    --border-radius: ${professionalTheme.borderRadius.DEFAULT};
    
    /* Typography */
    --font-family: ${professionalTheme.typography.fontFamily.sans.join(", ")};
    --font-size-base: ${professionalTheme.typography.fontSize.base};
    --line-height-base: ${professionalTheme.typography.lineHeight.normal};
    
    /* Spacing */
    --spacing-unit: 1rem;
    
    /* Shadows */
    --shadow-sm: ${professionalTheme.boxShadow.sm};
    --shadow-md: ${professionalTheme.boxShadow.md};
    
    /* Transitions */
    --transition-fast: all ${professionalTheme.animation.duration.fast} ${professionalTheme.animation.easing.DEFAULT};
    --transition-normal: all ${professionalTheme.animation.duration.normal} ${professionalTheme.animation.easing.DEFAULT};
  }
`;

// ===== UTILITY CLASSES =====
export const professionalUtilities = {
  // Spacing
  spacing: (size: keyof typeof professionalTheme.spacing) => `p-${size}`,

  // Typography
  text: {
    primary: "text-gray-900",
    secondary: "text-gray-600",
    muted: "text-gray-500",
    accent: "text-blue-600",
  },

  // Backgrounds
  bg: {
    primary: "bg-white",
    secondary: "bg-gray-50",
    tertiary: "bg-gray-100",
    accent: "bg-blue-50",
  },

  // Borders
  border: {
    DEFAULT: "border border-gray-200",
    accent: "border border-blue-200",
  },

  // Interactive states
  interactive: {
    hover: "hover:bg-gray-50 transition-colors duration-200",
    focus:
      "focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2",
    active: "active:bg-gray-100",
  },
};

export default professionalTheme;
