import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Enhanced className utility function
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Design system tokens and utilities
export const designTokens = {
  // Spacing scale (rem values)
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
    "4xl": "6rem", // 96px
    "5xl": "8rem", // 128px
  },

  // Typography scale
  typography: {
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
    lineHeight: {
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2",
    },
    fontWeight: {
      thin: "100",
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "900",
    },
  },

  // Border radius scale
  borderRadius: {
    none: "0",
    sm: "0.375rem", // 6px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    "2xl": "1.5rem", // 24px
    full: "9999px",
  },

  // Shadow scale
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  },

  // Z-index scale
  zIndex: {
    dropdown: "1000",
    sticky: "1020",
    fixed: "1030",
    modalBackdrop: "1040",
    modal: "1050",
    popover: "1060",
    tooltip: "1070",
    toast: "1080",
  },

  // Animation durations
  animation: {
    duration: {
      fast: "150ms",
      normal: "200ms",
      slow: "300ms",
      slower: "500ms",
    },
    easing: {
      linear: "linear",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
} as const;

// Breakpoints for responsive design
export const breakpoints = {
  xs: "475px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Responsive utility functions
export const responsive = {
  // Check if current screen size matches breakpoint
  isBreakpoint: (breakpoint: keyof typeof breakpoints) => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= parseInt(breakpoints[breakpoint]);
  },

  // Get current breakpoint
  getCurrentBreakpoint: (): keyof typeof breakpoints => {
    if (typeof window === "undefined") return "lg";

    const width = window.innerWidth;
    if (width >= parseInt(breakpoints["2xl"])) return "2xl";
    if (width >= parseInt(breakpoints.xl)) return "xl";
    if (width >= parseInt(breakpoints.lg)) return "lg";
    if (width >= parseInt(breakpoints.md)) return "md";
    if (width >= parseInt(breakpoints.sm)) return "sm";
    return "xs";
  },

  // Check if mobile
  isMobile: () => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < parseInt(breakpoints.md);
  },

  // Check if tablet
  isTablet: () => {
    if (typeof window === "undefined") return false;
    const width = window.innerWidth;
    return (
      width >= parseInt(breakpoints.md) && width < parseInt(breakpoints.lg)
    );
  },

  // Check if desktop
  isDesktop: () => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= parseInt(breakpoints.lg);
  },
};

// Color utilities for consistent theming
export const colorUtils = {
  // Get HSL color with alpha
  hsla: (hsl: string, alpha: number) => `hsl(${hsl} / ${alpha})`,

  // Common color variants
  variants: {
    primary: {
      50: "221.2 83.2% 95%",
      100: "221.2 83.2% 90%",
      200: "221.2 83.2% 80%",
      300: "221.2 83.2% 70%",
      400: "221.2 83.2% 60%",
      500: "221.2 83.2% 53.3%", // Default
      600: "221.2 83.2% 45%",
      700: "221.2 83.2% 35%",
      800: "221.2 83.2% 25%",
      900: "221.2 83.2% 15%",
    },
    red: {
      50: "0 84% 95%",
      100: "0 84% 90%",
      200: "0 84% 80%",
      300: "0 84% 70%",
      400: "0 84% 65%",
      500: "0 84% 60%", // Default admin color
      600: "0 84% 55%",
      700: "0 84% 45%",
      800: "0 84% 35%",
      900: "0 84% 25%",
    },
    gray: {
      50: "210 40% 98%",
      100: "210 40% 96%",
      200: "214.3 31.8% 91.4%",
      300: "212.7 26.8% 83.9%",
      400: "215.4 16.3% 46.9%",
      500: "215.4 16.3% 46.9%",
      600: "215.4 16.3% 25.1%",
      700: "215.4 16.3% 15.1%",
      800: "222.2 84% 4.9%",
      900: "222.2 84% 2.9%",
    },
  },
};

// Spacing utility functions
export const spacing = {
  // Get spacing value
  get: (size: keyof typeof designTokens.spacing) => designTokens.spacing[size],

  // Generate responsive spacing classes
  responsive: (
    property:
      | "p"
      | "px"
      | "py"
      | "pt"
      | "pr"
      | "pb"
      | "pl"
      | "m"
      | "mx"
      | "my"
      | "mt"
      | "mr"
      | "mb"
      | "ml",
    sizes: Partial<
      Record<keyof typeof breakpoints, keyof typeof designTokens.spacing>
    >,
  ) => {
    const classes: string[] = [];

    Object.entries(sizes).forEach(([breakpoint, size]) => {
      const prefix = breakpoint === "xs" ? "" : `${breakpoint}:`;
      const spacing =
        designTokens.spacing[size as keyof typeof designTokens.spacing];
      classes.push(`${prefix}${property}-[${spacing}]`);
    });

    return classes.join(" ");
  },
};

// Typography utility functions
export const typography = {
  // Get font size value
  getFontSize: (size: keyof typeof designTokens.typography.fontSize) =>
    designTokens.typography.fontSize[size],

  // Generate responsive text classes
  responsiveText: (
    sizes: Partial<
      Record<
        keyof typeof breakpoints,
        keyof typeof designTokens.typography.fontSize
      >
    >,
  ) => {
    const classes: string[] = [];

    Object.entries(sizes).forEach(([breakpoint, size]) => {
      const prefix = breakpoint === "xs" ? "" : `${breakpoint}:`;
      classes.push(`${prefix}text-${size}`);
    });

    return classes.join(" ");
  },

  // Heading styles
  headings: {
    h1: "text-4xl font-bold tracking-tight lg:text-5xl",
    h2: "text-3xl font-semibold tracking-tight",
    h3: "text-2xl font-semibold tracking-tight",
    h4: "text-xl font-semibold tracking-tight",
    h5: "text-lg font-semibold",
    h6: "text-base font-semibold",
  },

  // Body text styles
  body: {
    lg: "text-lg leading-relaxed",
    md: "text-base leading-normal",
    sm: "text-sm leading-normal",
    xs: "text-xs leading-normal",
  },

  // Special text styles
  special: {
    caption: "text-xs text-muted-foreground",
    overline:
      "text-xs font-medium uppercase tracking-wider text-muted-foreground",
    subtitle1: "text-base text-muted-foreground",
    subtitle2: "text-sm text-muted-foreground",
  },
};

// Layout utility functions
export const layout = {
  // Container utilities
  container: {
    base: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
    sm: "mx-auto max-w-2xl px-4 sm:px-6",
    md: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8",
    lg: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8",
    xl: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
    full: "mx-auto px-4 sm:px-6 lg:px-8",
  },

  // Grid utilities
  grid: {
    responsive: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    autoFit: "grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6",
    sidebar: "grid grid-cols-1 lg:grid-cols-4 gap-8",
    twoColumn: "grid grid-cols-1 lg:grid-cols-2 gap-8",
    threeColumn: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    fourColumn: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
  },

  // Flex utilities
  flex: {
    center: "flex items-center justify-center",
    between: "flex items-center justify-between",
    start: "flex items-center justify-start",
    end: "flex items-center justify-end",
    col: "flex flex-col",
    colCenter: "flex flex-col items-center justify-center",
    wrap: "flex flex-wrap items-center gap-2",
  },
};

// Animation utilities
export const animation = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },

  // Slide animations
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeOut" },
  },

  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3, ease: "easeOut" },
  },

  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3, ease: "easeOut" },
  },

  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3, ease: "easeOut" },
  },

  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2, ease: "easeOut" },
  },

  // Bounce animation
  bounce: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.3 },
    transition: { type: "spring", damping: 20, stiffness: 300 },
  },

  // Stagger animation for lists
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
};

// Accessibility utilities
export const a11y = {
  // Screen reader only
  srOnly: "sr-only",

  // Focus styles
  focusRing:
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  focusVisible:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",

  // Skip link
  skipLink:
    "absolute left-[-10000px] top-auto w-1 h-1 overflow-hidden focus:left-6 focus:top-7 focus:z-[999999] focus:w-auto focus:h-auto focus:overflow-visible",

  // ARIA utilities
  aria: {
    hidden: { "aria-hidden": "true" },
    expanded: (expanded: boolean) => ({ "aria-expanded": expanded.toString() }),
    selected: (selected: boolean) => ({ "aria-selected": selected.toString() }),
    current: (current: boolean) => ({
      "aria-current": current ? "page" : undefined,
    }),
    label: (label: string) => ({ "aria-label": label }),
    describedBy: (id: string) => ({ "aria-describedby": id }),
    labelledBy: (id: string) => ({ "aria-labelledby": id }),
  },
};

// Performance utilities
export const performance = {
  // GPU acceleration
  gpuAccelerated: "transform-gpu",

  // Containment
  containLayout: "contain-layout",
  containPaint: "contain-paint",
  containStyle: "contain-style",
  containStrict: "contain-strict",

  // Will change
  willChangeTransform: "will-change-transform",
  willChangeScroll: "will-change-scroll",
  willChangeContents: "will-change-contents",

  // Image optimization
  imageOptimized: "object-cover object-center",

  // Scroll optimization
  scrollSmooth: "scroll-smooth",
  overscrollContain: "overscroll-contain",
};

// Theme-aware utilities
export const theme = {
  // Get theme-aware classes
  mode: {
    light: (lightClass: string, darkClass: string) =>
      `${lightClass} dark:${darkClass}`,
    dark: (darkClass: string) => `dark:${darkClass}`,
  },

  // Admin theme classes
  admin: {
    primary: "admin-mode:text-red-600 admin-mode:border-red-600",
    bg: "admin-mode:bg-red-50 admin-mode:dark:bg-red-900/20",
    hover: "admin-mode:hover:bg-red-100 admin-mode:dark:hover:bg-red-900/30",
  },

  // High contrast mode
  highContrast: {
    text: "high-contrast:text-black high-contrast:dark:text-white",
    border: "high-contrast:border-black high-contrast:dark:border-white",
    bg: "high-contrast:bg-white high-contrast:dark:bg-black",
  },
};

// Export all utilities as a single object for convenience
export const ds = {
  tokens: designTokens,
  breakpoints,
  responsive,
  colors: colorUtils,
  spacing,
  typography,
  layout,
  animation,
  a11y,
  performance,
  theme,
};

// Default export for main utility function
export default cn;
