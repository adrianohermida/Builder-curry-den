/**
 * ud83cudf08 LAWDESK CRM - DESIGN SYSTEM 2025
 * Modern, minimalist SaaS design system
 *
 * Features:
 * - Light theme (default) with support for dark mode
 * - Client mode (blue primary) and Admin mode (red primary)
 * - Standardized spacing, typography, and color tokens
 * - Responsive breakpoints
 * - Accessibility-focused color contrast
 */

// ===== COLOR TOKENS =====
export const colorTokens = {
  // Primary palette - Blue for client mode
  blue: {
    50: "#f0f7ff",
    100: "#e0f0ff",
    200: "#c0e0ff",
    300: "#90c8ff",
    400: "#5aa3fa",
    500: "#3b82f6", // Primary
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
  },

  // Primary palette - Red for admin mode
  red: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444", // Primary
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    950: "#450a0a",
  },

  // Neutral palette
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
    950: "#020617",
  },

  // Semantic colors
  semantic: {
    success: {
      light: "#10b981", // Green
      dark: "#22c55e",
    },
    warning: {
      light: "#f59e0b", // Amber
      dark: "#fbbf24",
    },
    error: {
      light: "#ef4444", // Red
      dark: "#f87171",
    },
    info: {
      light: "#3b82f6", // Blue
      dark: "#60a5fa",
    },
  },

  // Interface colors
  interface: {
    light: {
      background: "#ffffff",
      surface: "#f8fafc",
      border: "#e2e8f0",
      divider: "#cbd5e1",
      text: {
        primary: "#0f172a",
        secondary: "#475569",
        muted: "#64748b",
        disabled: "#94a3b8",
      },
    },
    dark: {
      background: "#0f172a",
      surface: "#1e293b",
      border: "#334155",
      divider: "#475569",
      text: {
        primary: "#f8fafc",
        secondary: "#cbd5e1",
        muted: "#94a3b8",
        disabled: "#64748b",
      },
    },
  },
};

// ===== TYPOGRAPHY =====
export const typography = {
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace',
  },
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
  },
  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
};

// ===== SPACING =====
export const spacing = {
  0: "0",
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
  9: "2.25rem", // 36px
  10: "2.5rem", // 40px
  11: "2.75rem", // 44px
  12: "3rem", // 48px
  14: "3.5rem", // 56px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  28: "7rem", // 112px
  32: "8rem", // 128px
  36: "9rem", // 144px
  40: "10rem", // 160px
  44: "11rem", // 176px
  48: "12rem", // 192px
  52: "13rem", // 208px
  56: "14rem", // 224px
  60: "15rem", // 240px
  64: "16rem", // 256px
  72: "18rem", // 288px
  80: "20rem", // 320px
  96: "24rem", // 384px
};

// ===== BORDER RADIUS =====
export const borderRadius = {
  none: "0",
  sm: "0.125rem", // 2px
  DEFAULT: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px", // Circle
};

// ===== BREAKPOINTS =====
export const breakpoints = {
  xs: "320px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// ===== SHADOWS =====
export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
  none: "none",
};

// ===== TRANSITIONS =====
export const transitions = {
  duration: {
    DEFAULT: "0.2s", // Fast but noticeable
    fast: "0.1s", // Quick feedback
    slow: "0.3s", // More deliberate
  },
  timing: {
    DEFAULT: "ease",
    linear: "linear",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  properties: {
    DEFAULT: "all",
    colors:
      "color, background-color, border-color, text-decoration-color, fill, stroke",
    opacity: "opacity",
    shadow: "box-shadow",
    transform: "transform",
  },
};

// ===== Z-INDEX =====
export const zIndex = {
  0: "0",
  10: "10", // Base elements
  20: "20", // Dropdown menus
  30: "30", // Fixed elements (navbar, sidebar)
  40: "40", // Modals & dialogs
  50: "50", // Tooltips
  auto: "auto",
};

// ===== ANIMATION =====
export const animations = {
  DEFAULT: {
    keyframes: {
      fadein: {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      slideup: {
        from: { transform: "translateY(10px)", opacity: 0 },
        to: { transform: "translateY(0)", opacity: 1 },
      },
      slidedown: {
        from: { transform: "translateY(-10px)", opacity: 0 },
        to: { transform: "translateY(0)", opacity: 1 },
      },
      slideleft: {
        from: { transform: "translateX(10px)", opacity: 0 },
        to: { transform: "translateX(0)", opacity: 1 },
      },
      slideright: {
        from: { transform: "translateX(-10px)", opacity: 0 },
        to: { transform: "translateX(0)", opacity: 1 },
      },
      spin: {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
      },
    },
    animation: {
      fadein: "fadein 0.2s ease",
      slideup: "slideup 0.2s ease",
      slidedown: "slidedown 0.2s ease",
      slideleft: "slideleft 0.2s ease",
      slideright: "slideright 0.2s ease",
      spin: "spin 1s linear infinite",
    },
  },
};

// ===== THEMES =====
export const themes = {
  // Client theme (blue primary)
  client: {
    light: {
      primary: colorTokens.blue,
      background: colorTokens.interface.light.background,
      surface: colorTokens.interface.light.surface,
      text: colorTokens.interface.light.text,
      border: colorTokens.interface.light.border,
      divider: colorTokens.interface.light.divider,
    },
    dark: {
      primary: colorTokens.blue,
      background: colorTokens.interface.dark.background,
      surface: colorTokens.interface.dark.surface,
      text: colorTokens.interface.dark.text,
      border: colorTokens.interface.dark.border,
      divider: colorTokens.interface.dark.divider,
    },
  },

  // Admin theme (red primary)
  admin: {
    light: {
      primary: colorTokens.red,
      background: colorTokens.interface.light.background,
      surface: colorTokens.interface.light.surface,
      text: colorTokens.interface.light.text,
      border: colorTokens.interface.light.border,
      divider: colorTokens.interface.light.divider,
    },
    dark: {
      primary: colorTokens.red,
      background: colorTokens.interface.dark.background,
      surface: colorTokens.interface.dark.surface,
      text: colorTokens.interface.dark.text,
      border: colorTokens.interface.dark.border,
      divider: colorTokens.interface.dark.divider,
    },
  },
};

// Export all tokens as a unified design system
export default {
  colorTokens,
  typography,
  spacing,
  borderRadius,
  breakpoints,
  shadows,
  transitions,
  zIndex,
  animations,
  themes,
};
