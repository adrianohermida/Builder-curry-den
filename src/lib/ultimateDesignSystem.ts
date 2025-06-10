/**
 * LAWDESK ULTIMATE DESIGN SYSTEM V2
 * Production-ready design tokens for high-performance legal SaaS application
 * Focuses on: Performance, Responsiveness, Accessibility, Visual Hierarchy
 */

// ===== COLOR SYSTEM =====
export const colorTokens = {
  // Clear Theme (Default) - Professional blue undertones
  clear: {
    primary: {
      50: "#eff6ff", // Ice blue
      100: "#dbeafe", // Mist blue
      200: "#bfdbfe", // Light blue
      300: "#93c5fd", // Medium blue
      400: "#60a5fa", // Active blue
      500: "#3b82f6", // Primary blue
      600: "#2563eb", // Deep blue
      700: "#1d4ed8", // Darker blue
      800: "#1e40af", // Navy blue
      900: "#1e3a8a", // Deep navy
    },
    neutral: {
      50: "#f8fafc", // Pure white
      100: "#f1f5f9", // Off white
      200: "#e2e8f0", // Light gray
      300: "#cbd5e1", // Medium gray
      400: "#94a3b8", // Subtle gray
      500: "#64748b", // Text gray
      600: "#475569", // Darker gray
      700: "#334155", // Dark gray
      800: "#1e293b", // Very dark
      900: "#0f172a", // Almost black
    },
    semantic: {
      success: "#10b981", // Green
      warning: "#f59e0b", // Amber (NOT yellow)
      error: "#ef4444", // Red
      info: "#3b82f6", // Blue
    },
  },

  // Dark Theme - Elegant dark palette
  dark: {
    primary: {
      50: "#1e293b", // Dark surface
      100: "#334155", // Light dark
      200: "#475569", // Medium dark
      300: "#64748b", // Light medium
      400: "#94a3b8", // Light text
      500: "#cbd5e1", // Primary text
      600: "#e2e8f0", // Bright text
      700: "#f1f5f9", // Very bright
      800: "#f8fafc", // Near white
      900: "#ffffff", // Pure white
    },
    neutral: {
      50: "#020617", // Pure black
      100: "#0f172a", // Very dark
      200: "#1e293b", // Dark
      300: "#334155", // Medium dark
      400: "#475569", // Light dark
      500: "#64748b", // Medium
      600: "#94a3b8", // Light medium
      700: "#cbd5e1", // Light
      800: "#e2e8f0", // Very light
      900: "#f8fafc", // Near white
    },
    semantic: {
      success: "#22c55e", // Bright green
      warning: "#eab308", // Bright amber
      error: "#f87171", // Bright red
      info: "#60a5fa", // Bright blue
    },
  },

  // Color Theme - Vibrant violet palette
  color: {
    primary: {
      50: "#faf5ff", // Violet tint
      100: "#f3e8ff", // Light violet
      200: "#e9d5ff", // Medium violet
      300: "#d8b4fe", // Bright violet
      400: "#c084fc", // Active violet
      500: "#a855f7", // Primary violet
      600: "#9333ea", // Deep violet
      700: "#7c3aed", // Darker violet
      800: "#6b21a8", // Purple
      900: "#581c87", // Deep purple
    },
    neutral: {
      50: "#fefefe", // Pure white
      100: "#f9fafb", // Off white
      200: "#f3f4f6", // Light gray
      300: "#e5e7eb", // Medium gray
      400: "#9ca3af", // Subtle gray
      500: "#6b7280", // Text gray
      600: "#4b5563", // Darker gray
      700: "#374151", // Dark gray
      800: "#1f2937", // Very dark
      900: "#111827", // Almost black
    },
    semantic: {
      success: "#059669", // Emerald
      warning: "#d97706", // Orange (carefully chosen)
      error: "#dc2626", // Red
      info: "#0891b2", // Cyan
    },
  },

  // Admin Override - Red authority colors
  admin: {
    primary: {
      50: "#fef2f2", // Red tint
      100: "#fee2e2", // Light red
      200: "#fecaca", // Medium red
      300: "#fca5a5", // Bright red
      400: "#f87171", // Active red
      500: "#ef4444", // Primary red
      600: "#dc2626", // Deep red
      700: "#b91c1c", // Darker red
      800: "#991b1b", // Dark red
      900: "#7f1d1d", // Deep dark red
    },
    semantic: {
      success: "#16a34a", // Green
      warning: "#ca8a04", // Amber
      error: "#dc2626", // Red (same as primary)
      info: "#2563eb", // Blue
    },
  },
};

// ===== TYPOGRAPHY SYSTEM =====
export const typography = {
  fontSizes: {
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
  fontWeights: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeights: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.75",
  },
  letterSpacing: {
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
  },
};

// ===== SPACING SYSTEM =====
export const spacing = {
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
  32: "8rem", // 128px
};

// ===== SHADOW SYSTEM =====
export const shadows = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
};

// ===== BORDER RADIUS SYSTEM =====
export const borderRadius = {
  none: "0",
  sm: "0.125rem", // 2px
  md: "0.25rem", // 4px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  full: "9999px",
};

// ===== RESPONSIVE BREAKPOINTS =====
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// ===== ANIMATION SYSTEM =====
export const animations = {
  duration: {
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
  },
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

// ===== THEME DEFINITIONS =====
export type ThemeMode = "clear" | "dark" | "color";
export type UserRole = "user" | "admin";

export interface ThemeConfig {
  mode: ThemeMode;
  role: UserRole;
}

// ===== CSS CUSTOM PROPERTIES GENERATOR =====
export const generateCSSCustomProperties = (
  theme: ThemeConfig,
): Record<string, string> => {
  const { mode, role } = theme;
  const colorPalette = role === "admin" ? colorTokens.admin : colorTokens[mode];
  const baseColors = colorTokens[mode];

  return {
    // Primary Colors
    "--primary-50": colorPalette.primary[50],
    "--primary-100": colorPalette.primary[100],
    "--primary-200": colorPalette.primary[200],
    "--primary-300": colorPalette.primary[300],
    "--primary-400": colorPalette.primary[400],
    "--primary-500": colorPalette.primary[500],
    "--primary-600": colorPalette.primary[600],
    "--primary-700": colorPalette.primary[700],
    "--primary-800": colorPalette.primary[800],
    "--primary-900": colorPalette.primary[900],

    // Neutral Colors (always from base theme)
    "--neutral-50": baseColors.neutral[50],
    "--neutral-100": baseColors.neutral[100],
    "--neutral-200": baseColors.neutral[200],
    "--neutral-300": baseColors.neutral[300],
    "--neutral-400": baseColors.neutral[400],
    "--neutral-500": baseColors.neutral[500],
    "--neutral-600": baseColors.neutral[600],
    "--neutral-700": baseColors.neutral[700],
    "--neutral-800": baseColors.neutral[800],
    "--neutral-900": baseColors.neutral[900],

    // Semantic Colors
    "--color-success":
      colorPalette.semantic?.success || baseColors.semantic.success,
    "--color-warning":
      colorPalette.semantic?.warning || baseColors.semantic.warning,
    "--color-error": colorPalette.semantic?.error || baseColors.semantic.error,
    "--color-info": colorPalette.semantic?.info || baseColors.semantic.info,

    // Semantic UI Colors (based on theme)
    "--bg-primary":
      mode === "dark" ? baseColors.neutral[50] : baseColors.neutral[50],
    "--bg-secondary":
      mode === "dark" ? baseColors.neutral[100] : baseColors.neutral[100],
    "--bg-tertiary":
      mode === "dark" ? baseColors.neutral[200] : baseColors.neutral[200],

    "--surface-primary":
      mode === "dark" ? baseColors.neutral[100] : baseColors.neutral[50],
    "--surface-secondary":
      mode === "dark" ? baseColors.neutral[200] : baseColors.neutral[100],
    "--surface-tertiary":
      mode === "dark" ? baseColors.neutral[300] : baseColors.neutral[200],

    "--text-primary":
      mode === "dark" ? baseColors.neutral[900] : baseColors.neutral[900],
    "--text-secondary":
      mode === "dark" ? baseColors.neutral[700] : baseColors.neutral[600],
    "--text-tertiary":
      mode === "dark" ? baseColors.neutral[500] : baseColors.neutral[400],
    "--text-accent": colorPalette.primary[600],
    "--text-inverse":
      mode === "dark" ? baseColors.neutral[50] : baseColors.neutral[900],

    "--border-primary":
      mode === "dark" ? baseColors.neutral[300] : baseColors.neutral[200],
    "--border-secondary":
      mode === "dark" ? baseColors.neutral[400] : baseColors.neutral[300],
    "--border-accent": colorPalette.primary[300],

    // Spacing
    "--spacing-xs": spacing[1],
    "--spacing-sm": spacing[2],
    "--spacing-md": spacing[4],
    "--spacing-lg": spacing[6],
    "--spacing-xl": spacing[8],

    // Shadows
    "--shadow-sm": shadows.sm,
    "--shadow-md": shadows.md,
    "--shadow-lg": shadows.lg,

    // Border Radius
    "--radius-sm": borderRadius.sm,
    "--radius-md": borderRadius.md,
    "--radius-lg": borderRadius.lg,

    // Animation
    "--duration-fast": animations.duration.fast,
    "--duration-normal": animations.duration.normal,
    "--duration-slow": animations.duration.slow,
    "--easing-default": animations.easing.default,
  };
};

// ===== COMPONENT VARIANTS =====
export const componentVariants = {
  button: {
    primary: {
      backgroundColor: "var(--primary-500)",
      color: "white",
      border: "1px solid var(--primary-500)",
      hover: {
        backgroundColor: "var(--primary-600)",
        borderColor: "var(--primary-600)",
      },
    },
    secondary: {
      backgroundColor: "transparent",
      color: "var(--primary-600)",
      border: "1px solid var(--border-primary)",
      hover: {
        backgroundColor: "var(--surface-secondary)",
        borderColor: "var(--border-accent)",
      },
    },
    ghost: {
      backgroundColor: "transparent",
      color: "var(--text-secondary)",
      border: "none",
      hover: {
        backgroundColor: "var(--surface-secondary)",
        color: "var(--text-primary)",
      },
    },
  },
  card: {
    default: {
      backgroundColor: "var(--surface-primary)",
      border: "1px solid var(--border-primary)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-sm)",
    },
    elevated: {
      backgroundColor: "var(--surface-primary)",
      border: "1px solid var(--border-primary)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-md)",
    },
  },
};

// ===== PERFORMANCE UTILITIES =====
export const performance = {
  // Preload critical CSS custom properties
  preloadTheme: (theme: ThemeConfig) => {
    const properties = generateCSSCustomProperties(theme);
    const root = document.documentElement;

    // Batch DOM updates
    Object.entries(properties).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  },

  // Debounced theme switching
  switchTheme: (() => {
    let timeoutId: NodeJS.Timeout;
    return (theme: ThemeConfig, delay = 0) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => performance.preloadTheme(theme), delay);
    };
  })(),

  // Get theme from localStorage with fallback
  getStoredTheme: (): ThemeConfig => {
    try {
      const stored = localStorage.getItem("lawdesk-theme");
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          mode: parsed.mode || "clear",
          role: parsed.role || "user",
        };
      }
    } catch (error) {
      console.warn("Failed to parse stored theme:", error);
    }
    return { mode: "clear", role: "user" };
  },

  // Store theme with error handling
  storeTheme: (theme: ThemeConfig) => {
    try {
      localStorage.setItem("lawdesk-theme", JSON.stringify(theme));
    } catch (error) {
      console.warn("Failed to store theme:", error);
    }
  },
};

// ===== COLOR VIOLATION DETECTOR =====
export const colorViolationDetector = {
  // Forbidden colors that should never appear
  forbiddenColors: [
    "rgb(255, 255, 0)", // Pure yellow
    "rgb(255, 255, 0)", // Yellow variations
    "rgb(249, 115, 22)", // Orange
    "rgb(234, 179, 8)", // More yellow
    "rgb(253, 224, 71)", // Light yellow
    "#ffff00", // Hex yellow
    "#fbbf24", // Tailwind yellow-400
    "#f59e0b", // Tailwind yellow-500 (when not semantic)
  ],

  // Scan for violations
  scanForViolations: (): HTMLElement[] => {
    const violations: HTMLElement[] = [];
    const allElements = document.querySelectorAll(
      "*",
    ) as NodeListOf<HTMLElement>;

    allElements.forEach((element) => {
      const computedStyle = window.getComputedStyle(element);
      const bgColor = computedStyle.backgroundColor;
      const textColor = computedStyle.color;
      const borderColor = computedStyle.borderColor;

      if (
        colorViolationDetector.forbiddenColors.some(
          (forbidden) =>
            bgColor.includes(forbidden) ||
            textColor.includes(forbidden) ||
            borderColor.includes(forbidden),
        )
      ) {
        violations.push(element);
      }
    });

    return violations;
  },

  // Fix violations by applying theme colors
  fixViolations: (theme: ThemeConfig) => {
    const violations = colorViolationDetector.scanForViolations();
    const properties = generateCSSCustomProperties(theme);

    violations.forEach((element) => {
      const computedStyle = window.getComputedStyle(element);

      // Replace background colors
      if (
        colorViolationDetector.forbiddenColors.some((forbidden) =>
          computedStyle.backgroundColor.includes(forbidden),
        )
      ) {
        element.style.backgroundColor = properties["--surface-secondary"];
      }

      // Replace text colors
      if (
        colorViolationDetector.forbiddenColors.some((forbidden) =>
          computedStyle.color.includes(forbidden),
        )
      ) {
        element.style.color = properties["--text-primary"];
      }

      // Replace border colors
      if (
        colorViolationDetector.forbiddenColors.some((forbidden) =>
          computedStyle.borderColor.includes(forbidden),
        )
      ) {
        element.style.borderColor = properties["--border-primary"];
      }
    });

    return violations.length;
  },

  // Continuous monitoring
  startMonitoring: (theme: ThemeConfig, interval = 2000) => {
    setInterval(() => {
      const fixedCount = colorViolationDetector.fixViolations(theme);
      if (fixedCount > 0) {
        console.log(`Fixed ${fixedCount} color violations`);
      }
    }, interval);
  },
};

// ===== DEFAULT EXPORT =====
export const ultimateDesignSystem = {
  colorTokens,
  typography,
  spacing,
  shadows,
  borderRadius,
  breakpoints,
  animations,
  componentVariants,
  generateCSSCustomProperties,
  performance,
  colorViolationDetector,
};

export default ultimateDesignSystem;
