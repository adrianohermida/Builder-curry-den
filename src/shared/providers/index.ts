/**
 * Shared Providers
 *
 * Central exports for all shared provider components that manage
 * global application state and context.
 */

// Theme providers
export { ThemeProvider } from "./ThemeProvider";
export { ConfigProvider } from "./ConfigProvider";

// State providers
export { NotificationProvider } from "./NotificationProvider";
export { AuthProvider } from "./AuthProvider";

// Feature providers
export { CRMProvider } from "./CRMProvider";
export { AgendaProvider } from "./AgendaProvider";

// Provider types
export type { ThemeProviderProps } from "./ThemeProvider/types";
export type { NotificationContextValue } from "./NotificationProvider/types";
