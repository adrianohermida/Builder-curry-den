/**
 * MainLayout Types
 *
 * TypeScript type definitions for the MainLayout template component
 * and its related interfaces.
 */

export interface LayoutConfig {
  showSidebar: boolean;
  showTopbar: boolean;
  sidebarVariant: "expanded" | "collapsed" | "hidden";
  topbarVariant: "standard" | "compact" | "minimal";
  containerMaxWidth: "full" | "7xl" | "6xl" | "5xl";
  backgroundPattern: "none" | "dots" | "grid" | "subtle";
}

export interface ThemeConfig {
  mode: "light" | "dark" | "system";
  primaryColor: string;
  accentColor: string;
  borderRadius: "none" | "sm" | "md" | "lg" | "xl";
  fontScale: "sm" | "base" | "lg";
  highContrast: boolean;
  reducedMotion: boolean;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ComponentType<{ size?: number }>;
}

export interface NotificationItem {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface LayoutContextValue {
  // Layout State
  layoutConfig: LayoutConfig;
  themeConfig: ThemeConfig;
  isLoading: boolean;
  isMobile: boolean;
  isTablet: boolean;

  // Layout Actions
  updateLayoutConfig: (config: Partial<LayoutConfig>) => void;
  updateThemeConfig: (config: Partial<ThemeConfig>) => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  setSidebarVariant: (variant: "expanded" | "collapsed" | "hidden") => void;

  // Navigation State
  currentPath: string;
  breadcrumbs: BreadcrumbItem[];
  notifications: NotificationItem[];

  // Session & Permissions
  userRole: "user" | "admin" | "manager";
  permissions: string[];
  sessionExpiry: Date | null;
}
