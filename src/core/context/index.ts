/**
 * Core Contexts
 *
 * Central exports for all global application contexts.
 * These contexts manage cross-cutting concerns and shared state.
 */

// Authentication context
export { AuthContext, AuthProvider, useAuth } from "./AuthContext";

// Theme context
export { ThemeContext, useTheme } from "./ThemeContext";

// Notification context
export { NotificationContext, useNotifications } from "./NotificationContext";

// App configuration context
export { ConfigContext, useConfig } from "./ConfigContext";

// User preferences context
export {
  UserPreferencesContext,
  useUserPreferences,
} from "./UserPreferencesContext";

// Feature flags context
export { FeatureFlagsContext, useFeatureFlags } from "./FeatureFlagsContext";

// Export context types
export type { AuthContextValue } from "./AuthContext/types";
export type { ThemeContextValue } from "./ThemeContext/types";
export type { NotificationContextValue } from "./NotificationContext/types";
