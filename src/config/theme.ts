/**
 * Theme Configuration
 *
 * Centralized theme settings for the application including colors,
 * typography, spacing, and component variants.
 */

export const THEME_VARIANTS = {
  DEFAULT: "default",
  LAWDESK: "lawdesk",
  ULTIMATE: "ultimate",
} as const;

export type ThemeVariant = (typeof THEME_VARIANTS)[keyof typeof THEME_VARIANTS];

export const DEFAULT_THEME: ThemeVariant = THEME_VARIANTS.DEFAULT;

// Color palette constants
export const COLORS = {
  PRIMARY: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    900: "#1e3a8a",
  },
  GRAY: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
  SUCCESS: {
    50: "#f0fdf4",
    500: "#22c55e",
    600: "#16a34a",
  },
  WARNING: {
    50: "#fffbeb",
    500: "#f59e0b",
    600: "#d97706",
  },
  ERROR: {
    50: "#fef2f2",
    500: "#ef4444",
    600: "#dc2626",
  },
} as const;

// Typography scale
export const TYPOGRAPHY = {
  FONT_SIZES: {
    XS: "0.75rem", // 12px
    SM: "0.875rem", // 14px
    BASE: "1rem", // 16px
    LG: "1.125rem", // 18px
    XL: "1.25rem", // 20px
    "2XL": "1.5rem", // 24px
    "3XL": "1.875rem", // 30px
    "4XL": "2.25rem", // 36px
  },
  FONT_WEIGHTS: {
    NORMAL: 400,
    MEDIUM: 500,
    SEMIBOLD: 600,
    BOLD: 700,
  },
  LINE_HEIGHTS: {
    TIGHT: 1.25,
    NORMAL: 1.5,
    RELAXED: 1.75,
  },
} as const;

// Spacing scale
export const SPACING = {
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
  24: "6rem", // 96px
} as const;

// Border radius scale
export const BORDER_RADIUS = {
  NONE: "0",
  SM: "0.125rem", // 2px
  DEFAULT: "0.25rem", // 4px
  MD: "0.375rem", // 6px
  LG: "0.5rem", // 8px
  XL: "0.75rem", // 12px
  "2XL": "1rem", // 16px
  FULL: "9999px",
} as const;

// Shadow scale
export const SHADOWS = {
  SM: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  MD: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  LG: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  XL: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
} as const;

// Component size variants
export const COMPONENT_SIZES = {
  XS: "xs",
  SM: "sm",
  MD: "md",
  LG: "lg",
  XL: "xl",
} as const;

export type ComponentSize =
  (typeof COMPONENT_SIZES)[keyof typeof COMPONENT_SIZES];

// Animation durations
export const ANIMATIONS = {
  FAST: "150ms",
  NORMAL: "300ms",
  SLOW: "500ms",
} as const;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: "640px",
  MD: "768px",
  LG: "1024px",
  XL: "1280px",
  "2XL": "1536px",
} as const;
