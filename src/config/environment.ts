/**
 * Environment Configuration
 *
 * Environment-specific settings and feature toggles.
 */

// Environment types
export const ENVIRONMENTS = {
  DEVELOPMENT: "development",
  STAGING: "staging",
  PRODUCTION: "production",
  TEST: "test",
} as const;

export type Environment = (typeof ENVIRONMENTS)[keyof typeof ENVIRONMENTS];

// Current environment
export const CURRENT_ENV: Environment =
  (import.meta.env.VITE_ENV as Environment) || ENVIRONMENTS.DEVELOPMENT;

// Environment checks
export const IS_DEVELOPMENT = CURRENT_ENV === ENVIRONMENTS.DEVELOPMENT;
export const IS_STAGING = CURRENT_ENV === ENVIRONMENTS.STAGING;
export const IS_PRODUCTION = CURRENT_ENV === ENVIRONMENTS.PRODUCTION;
export const IS_TEST = CURRENT_ENV === ENVIRONMENTS.TEST;

// Debug flags
export const DEBUG_FLAGS = {
  ENABLE_LOGGING: IS_DEVELOPMENT || IS_STAGING,
  ENABLE_REDUX_DEVTOOLS: IS_DEVELOPMENT,
  ENABLE_REACT_QUERY_DEVTOOLS: IS_DEVELOPMENT,
  ENABLE_PERFORMANCE_MONITORING: !IS_DEVELOPMENT,
  ENABLE_ERROR_REPORTING: IS_PRODUCTION || IS_STAGING,
} as const;

// Application metadata
export const APP_METADATA = {
  NAME: "Lawdesk CRM",
  VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
  BUILD_NUMBER: import.meta.env.VITE_BUILD_NUMBER || "dev",
  BUILD_DATE: import.meta.env.VITE_BUILD_DATE || new Date().toISOString(),
} as const;

// External service configuration
export const EXTERNAL_SERVICES = {
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GA_ID,
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  HOTJAR_ID: import.meta.env.VITE_HOTJAR_ID,
  STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
} as const;

// Performance monitoring thresholds
export const PERFORMANCE_THRESHOLDS = {
  PAGE_LOAD_TIME: 3000, // 3 seconds
  API_RESPONSE_TIME: 2000, // 2 seconds
  RENDER_TIME: 100, // 100ms
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: "lawdesk-theme",
  USER_PREFERENCES: "lawdesk-user-preferences",
  AUTH_TOKEN: "lawdesk-auth-token",
  SIDEBAR_STATE: "lawdesk-sidebar-state",
  LAST_VISITED_PAGE: "lawdesk-last-page",
} as const;

// Session storage keys
export const SESSION_KEYS = {
  FORM_DRAFT: "lawdesk-form-draft",
  SEARCH_HISTORY: "lawdesk-search-history",
  TEMP_DATA: "lawdesk-temp-data",
} as const;
