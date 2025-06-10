/**
 * 🎨 DESIGN TOKENS - SISTEMA DE DESIGN LAWDESK 2025+
 *
 * Sistema de tokens para aplicação SaaS jurídica moderna:
 * - Mobile-first e responsivo
 * - Performance otimizada
 * - Hierarquia visual clara
 * - Estética moderna e limpa
 */

// ===== SPACING TOKENS =====
export const spacing = {
  // Micro spacing
  px: "1px",
  0.5: "0.125rem", // 2px
  1: "0.25rem", // 4px
  1.5: "0.375rem", // 6px
  2: "0.5rem", // 8px
  2.5: "0.625rem", // 10px
  3: "0.75rem", // 12px
  3.5: "0.875rem", // 14px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  7: "1.75rem", // 28px
  8: "2rem", // 32px

  // Macro spacing
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  32: "8rem", // 128px
} as const;

// ===== TYPOGRAPHY TOKENS =====
export const typography = {
  fontFamily: {
    sans: [
      "Inter",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "sans-serif",
    ],
    mono: ["Fira Code", "Consolas", "Monaco", "monospace"],
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }], // 12px
    sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px
    base: ["1rem", { lineHeight: "1.5rem" }], // 16px
    lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px
    xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px
    "2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }], // 36px
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;

// ===== COLOR TOKENS =====
export const colors = {
  // Neutrals - Base da aplicação
  white: "#ffffff",
  gray: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },

  // Cliente Mode - Azul
  blue: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6", // Primary
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },

  // Admin Mode - Vermelho
  red: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626", // Primary Admin
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  // Semantic colors
  success: {
    50: "#f0fdf4",
    500: "#22c55e",
    600: "#16a34a",
  },
  warning: {
    50: "#fffbeb",
    500: "#f59e0b",
    600: "#d97706",
  },
  error: {
    50: "#fef2f2",
    500: "#ef4444",
    600: "#dc2626",
  },
  info: {
    50: "#f0f9ff",
    500: "#06b6d4",
    600: "#0891b2",
  },
} as const;

// ===== SHADOW TOKENS =====
export const shadows = {
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
} as const;

// ===== BORDER RADIUS TOKENS =====
export const borderRadius = {
  none: "0",
  sm: "0.125rem", // 2px
  base: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  full: "9999px",
} as const;

// ===== Z-INDEX TOKENS =====
export const zIndex = {
  hide: -1,
  auto: "auto",
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// ===== BREAKPOINTS =====
export const breakpoints = {
  sm: "640px", // Mobile large
  md: "768px", // Tablet
  lg: "1024px", // Desktop
  xl: "1280px", // Desktop large
  "2xl": "1536px", // Desktop extra large
} as const;

// ===== ANIMATION TOKENS =====
export const animation = {
  duration: {
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
  },
  timing: {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
  },
} as const;

// ===== COMPONENT TOKENS =====
export const components = {
  // Button tokens
  button: {
    height: {
      sm: "2rem", // 32px
      md: "2.5rem", // 40px
      lg: "3rem", // 48px
    },
    padding: {
      sm: "0.5rem 0.75rem",
      md: "0.625rem 1rem",
      lg: "0.75rem 1.5rem",
    },
  },

  // Input tokens
  input: {
    height: {
      sm: "2rem",
      md: "2.5rem",
      lg: "3rem",
    },
    padding: {
      sm: "0.5rem",
      md: "0.75rem",
      lg: "1rem",
    },
  },

  // Card tokens
  card: {
    padding: {
      sm: "1rem",
      md: "1.5rem",
      lg: "2rem",
    },
    gap: {
      sm: "0.75rem",
      md: "1rem",
      lg: "1.5rem",
    },
  },

  // Layout tokens
  layout: {
    sidebar: {
      width: {
        collapsed: "4rem", // 64px
        expanded: "16rem", // 256px
      },
    },
    topbar: {
      height: "3.5rem", // 56px
    },
    container: {
      maxWidth: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      padding: {
        mobile: "1rem",
        desktop: "1.5rem",
      },
    },
  },
} as const;

// ===== SEMANTIC TOKENS POR MODO =====
export const semanticTokens = {
  client: {
    primary: colors.blue[500],
    primaryHover: colors.blue[600],
    primaryActive: colors.blue[700],
    accent: colors.blue[400],
    surface: colors.gray[50],
    border: colors.gray[200],
  },
  admin: {
    primary: colors.red[600],
    primaryHover: colors.red[700],
    primaryActive: colors.red[800],
    accent: colors.red[500],
    surface: colors.gray[50],
    border: colors.gray[200],
  },
} as const;

// ===== EXPORT UTILITY FUNCTIONS =====
export const getSemanticTokens = (mode: "client" | "admin") => {
  return semanticTokens[mode];
};

export const createThemeCSS = (mode: "client" | "admin" = "client") => {
  const tokens = getSemanticTokens(mode);

  return {
    "--color-primary": tokens.primary,
    "--color-primary-hover": tokens.primaryHover,
    "--color-primary-active": tokens.primaryActive,
    "--color-accent": tokens.accent,
    "--color-surface": tokens.surface,
    "--color-border": tokens.border,
    "--color-text": colors.gray[900],
    "--color-text-muted": colors.gray[600],
    "--color-background": colors.white,
  };
};

// ===== DEFAULT EXPORT =====
export default {
  spacing,
  typography,
  colors,
  shadows,
  borderRadius,
  zIndex,
  breakpoints,
  animation,
  components,
  semanticTokens,
  getSemanticTokens,
  createThemeCSS,
};
