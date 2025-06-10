/**
 * 🎨 LAWDESK DESIGN SYSTEM - 2025
 *
 * Sistema de design moderno, compacto e minimalista
 * Seguindo as especificações de UX/UI solicitadas
 */

// Core Design Tokens
export const designTokens = {
  // Typography Scale
  typography: {
    fontFamily: {
      sans: [
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "sans-serif",
      ],
      mono: [
        "SF Mono",
        "Monaco",
        "Inconsolata",
        "Roboto Mono",
        "source-code-pro",
        "monospace",
      ],
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
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.6,
    },
  },

  // Color Palette
  colors: {
    // Client Mode (Blue)
    client: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb", // Primary
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },

    // Admin Mode (Red)
    admin: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626", // Primary
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
    },

    // Neutral Grays
    gray: {
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

    // Semantic Colors
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
    danger: {
      50: "#fef2f2",
      500: "#ef4444",
      600: "#dc2626",
    },
  },

  // Spacing Scale
  spacing: {
    px: "1px",
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
  },

  // Border Radius
  borderRadius: {
    none: "0",
    sm: "0.125rem", // 2px
    base: "0.25rem", // 4px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    full: "9999px",
  },

  // Shadows
  boxShadow: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    none: "0 0 #0000",
  },

  // Z-Index Scale
  zIndex: {
    auto: "auto",
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
  },
};

// Component Variants
export const componentVariants = {
  // Button Variants
  button: {
    primary: {
      client: "bg-blue-600 hover:bg-blue-700 text-white border-transparent",
      admin: "bg-red-600 hover:bg-red-700 text-white border-transparent",
    },
    secondary: {
      client: "bg-white hover:bg-gray-50 text-gray-900 border-gray-200",
      admin: "bg-white hover:bg-gray-50 text-gray-900 border-gray-200",
    },
    ghost: {
      client: "hover:bg-blue-50 text-blue-600 border-transparent",
      admin: "hover:bg-red-50 text-red-600 border-transparent",
    },
  },

  // Card Variants
  card: {
    default: "bg-white border border-gray-200 rounded-lg shadow-sm",
    elevated: "bg-white border border-gray-200 rounded-lg shadow-md",
    interactive:
      "bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow",
  },

  // Input Variants
  input: {
    default: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
    error: "border-red-300 focus:border-red-500 focus:ring-red-500",
    success: "border-green-300 focus:border-green-500 focus:ring-green-500",
  },
};

// Layout Constants
export const layout = {
  sidebar: {
    width: {
      collapsed: "64px",
      expanded: "280px",
    },
    iconSize: "24px",
  },
  header: {
    height: "64px",
  },
  container: {
    maxWidth: "1440px",
    padding: "24px",
  },
};

// Responsive Breakpoints
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// Animation Durations
export const animation = {
  fast: "150ms",
  normal: "200ms",
  slow: "300ms",
  slower: "500ms",
};

// Utility Functions
export const utils = {
  // Get color based on mode
  getColor: (colorPath: string, mode: "client" | "admin" = "client") => {
    if (colorPath.includes("primary")) {
      return mode === "admin"
        ? designTokens.colors.admin[600]
        : designTokens.colors.client[600];
    }
    // Handle other color paths
    return colorPath;
  },

  // Generate responsive classes
  responsive: (property: string, values: Record<string, string>) => {
    return Object.entries(values)
      .map(([breakpoint, value]) =>
        breakpoint === "base"
          ? `${property}-${value}`
          : `${breakpoint}:${property}-${value}`,
      )
      .join(" ");
  },

  // Combine classes with proper precedence
  cn: (...classes: (string | undefined | null | false)[]) => {
    return classes.filter(Boolean).join(" ");
  },
};

// Theme Configuration
export const themeConfig = {
  client: {
    primary: designTokens.colors.client[600],
    primaryHover: designTokens.colors.client[700],
    primaryForeground: "#ffffff",
    background: designTokens.colors.gray[50],
    foreground: designTokens.colors.gray[900],
    muted: designTokens.colors.gray[100],
    mutedForeground: designTokens.colors.gray[500],
    border: designTokens.colors.gray[200],
    ring: designTokens.colors.client[600],
  },
  admin: {
    primary: designTokens.colors.admin[600],
    primaryHover: designTokens.colors.admin[700],
    primaryForeground: "#ffffff",
    background: designTokens.colors.gray[50],
    foreground: designTokens.colors.gray[900],
    muted: designTokens.colors.gray[100],
    mutedForeground: designTokens.colors.gray[500],
    border: designTokens.colors.gray[200],
    ring: designTokens.colors.admin[600],
  },
};

// Export default configuration
export const designSystem = {
  tokens: designTokens,
  variants: componentVariants,
  layout,
  breakpoints,
  animation,
  utils,
  theme: themeConfig,
};

export default designSystem;
