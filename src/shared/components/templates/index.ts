/**
 * Templates - Page Layout Components
 *
 * Templates are page-level objects that place components into a layout
 * and articulate the design's underlying content structure.
 */

// Layout templates
export { MainLayout, useLayout } from "./MainLayout";
export { PublicLayout } from "./PublicLayout";
export { AuthLayout } from "./AuthLayout";
export { DashboardLayout } from "./DashboardLayout";

// Specialized templates
export { CRMLayout } from "./CRMLayout";
export { AdminLayout } from "./AdminLayout";
export { ErrorLayout } from "./ErrorLayout";

// Template types
export type {
  LayoutConfig,
  ThemeConfig,
  LayoutContextValue,
} from "./MainLayout/types";
