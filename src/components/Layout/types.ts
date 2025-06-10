/**
 * 🎯 LAYOUT TYPES - DEFINIÇÕES DE TIPOS PARA O SISTEMA DE LAYOUT
 *
 * Tipos centralizados para componentes de layout:
 * - Interfaces para configuração de layout
 * - Tipos para navegação e menu
 * - Definições de estado e contexto
 * - Tipos para responsividade e tema
 */

import { ReactNode, ComponentType } from "react";

// ===== LAYOUT CONFIGURATION =====
export interface LayoutConfig {
  sidebar: {
    isOpen: boolean;
    isCollapsed: boolean;
    variant: "default" | "compact" | "minimal";
    position: "left" | "right";
    overlay: boolean;
  };
  topbar: {
    isVisible: boolean;
    variant: "default" | "compact" | "minimal";
    sticky: boolean;
  };
  theme: {
    mode: "light" | "dark" | "system";
    primaryColor: string;
    accentColor: string;
    borderRadius: "none" | "sm" | "md" | "lg" | "xl";
    fontScale: "sm" | "base" | "lg";
    highContrast: boolean;
    reducedMotion: boolean;
  };
  responsive: {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    breakpoint: "mobile" | "tablet" | "desktop" | "large";
    windowSize: {
      width: number;
      height: number;
    };
  };
  features: {
    breadcrumbs: boolean;
    search: boolean;
    notifications: boolean;
    userProfile: boolean;
    keyboardShortcuts: boolean;
  };
}

// ===== NAVIGATION TYPES =====
export interface NavigationItem {
  id: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  path: string;
  badge?: string | number;
  badgeType?: "info" | "success" | "warning" | "error";
  children?: NavigationItem[];
  roles?: string[];
  permissions?: string[];
  beta?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  description?: string;
  external?: boolean;
  target?: "_blank" | "_self";
  onClick?: () => void;
  metadata?: Record<string, unknown>;
}

export interface NavigationSection {
  id: string;
  label?: string;
  items: NavigationItem[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
  roles?: string[];
  permissions?: string[];
  order?: number;
  metadata?: Record<string, unknown>;
}

export interface NavigationConfig {
  sections: NavigationSection[];
  footer?: NavigationItem[];
  userMenu?: NavigationItem[];
}

// ===== BREADCRUMB TYPES =====
export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: ComponentType<{ size?: number; className?: string }>;
  disabled?: boolean;
  metadata?: Record<string, unknown>;
}

// ===== USER TYPES =====
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  permissions: string[];
  preferences?: {
    theme?: "light" | "dark" | "system";
    language?: string;
    timezone?: string;
    notifications?: boolean;
  };
  metadata?: Record<string, unknown>;
}

// ===== NOTIFICATION TYPES =====
export interface NotificationItem {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  metadata?: Record<string, unknown>;
}

// ===== LAYOUT CONTEXT TYPES =====
export interface LayoutContextValue {
  // Configuration
  config: LayoutConfig;
  navigation: NavigationConfig;

  // State
  user: User | null;
  notifications: NotificationItem[];
  breadcrumbs: BreadcrumbItem[];
  currentPath: string;
  isLoading: boolean;

  // Actions
  updateConfig: (updates: Partial<LayoutConfig>) => void;
  toggleSidebar: () => void;
  toggleSidebarCollapse: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  navigate: (path: string) => void;
  setLoading: (loading: boolean) => void;
}

// ===== COMPONENT PROPS TYPES =====
export interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  variant?: "default" | "compact" | "minimal";
  navigation: NavigationConfig;
  user?: User;
  onToggle: () => void;
  onClose: () => void;
  onNavigate?: (path: string) => void;
  className?: string;
}

export interface TopbarProps {
  isVisible: boolean;
  variant?: "default" | "compact" | "minimal";
  breadcrumbs?: BreadcrumbItem[];
  notifications?: NotificationItem[];
  user?: User;
  onToggleSidebar?: () => void;
  onNotificationClick?: (notification: NotificationItem) => void;
  onUserMenuClick?: () => void;
  className?: string;
}

export interface LayoutProviderProps {
  children: ReactNode;
  initialConfig?: Partial<LayoutConfig>;
  navigation?: NavigationConfig;
  user?: User;
}

// ===== RESPONSIVE TYPES =====
export type Breakpoint = "mobile" | "tablet" | "desktop" | "large";

export interface ResponsiveConfig {
  breakpoints: Record<Breakpoint, number>;
  sidebarBehavior: Record<Breakpoint, "hidden" | "collapsed" | "expanded">;
  topbarBehavior: Record<Breakpoint, "hidden" | "compact" | "expanded">;
}

// ===== THEME TYPES =====
export interface ThemeTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  spacing: Record<string, string>;
  typography: {
    fontFamily: string;
    fontSize: Record<string, string>;
    fontWeight: Record<string, string>;
    lineHeight: Record<string, string>;
  };
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  animations: Record<string, string>;
}

// ===== ACCESSIBILITY TYPES =====
export interface AccessibilityConfig {
  announcements: boolean;
  keyboardNavigation: boolean;
  screenReaderSupport: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  focusManagement: boolean;
}

// ===== PERFORMANCE TYPES =====
export interface PerformanceConfig {
  lazyLoading: boolean;
  virtualScrolling: boolean;
  memoization: boolean;
  debounceSearch: number;
  cacheSize: number;
}

// ===== ANALYTICS TYPES =====
export interface AnalyticsEvent {
  type: "navigation" | "interaction" | "error" | "performance";
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

// ===== ERROR TYPES =====
export interface LayoutError {
  code: string;
  message: string;
  context?: Record<string, unknown>;
  recoverable: boolean;
  timestamp: Date;
}

// ===== UTILITY TYPES =====
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

// ===== LAYOUT VARIANTS =====
export type LayoutVariant =
  | "default" // Standard layout with sidebar and topbar
  | "minimal" // Clean layout with minimal chrome
  | "fullscreen" // Content-focused layout with hidden navigation
  | "dashboard" // Dashboard-optimized layout
  | "mobile" // Mobile-first responsive layout
  | "print"; // Print-friendly layout

// ===== EXPORT ALL TYPES =====
export // Main exports already defined above
 type {};
