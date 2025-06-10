/**
 * Environment Utility
 *
 * Provides a centralized way to access environment variables
 * and runtime environment information, replacing direct process.env usage.
 */

// Environment detection
export const getNodeEnv = (): string => {
  // Check for Vite environment first
  if (typeof import.meta !== "undefined" && import.meta.env?.MODE) {
    return import.meta.env.MODE;
  }

  // Fallback for process.env if available (server-side or testing)
  if (typeof process !== "undefined" && process.env?.NODE_ENV) {
    return process.env.NODE_ENV;
  }

  // Default fallback
  return "production";
};

// Environment flags
export const IS_DEVELOPMENT = getNodeEnv() === "development";
export const IS_PRODUCTION = getNodeEnv() === "production";
export const IS_TEST = getNodeEnv() === "test";
export const IS_STAGING = getNodeEnv() === "staging";

// Runtime environment detection
export const IS_BROWSER = typeof window !== "undefined";
export const IS_SERVER = !IS_BROWSER;

// Environment variable access
export const env = {
  NODE_ENV: getNodeEnv(),

  // Vite environment variables (browser)
  get VITE_API_BASE_URL() {
    return typeof import.meta !== "undefined"
      ? import.meta.env.VITE_API_BASE_URL
      : undefined;
  },

  get VITE_AUTH_API_URL() {
    return typeof import.meta !== "undefined"
      ? import.meta.env.VITE_AUTH_API_URL
      : undefined;
  },

  get VITE_STORAGE_API_URL() {
    return typeof import.meta !== "undefined"
      ? import.meta.env.VITE_STORAGE_API_URL
      : undefined;
  },

  get VITE_AI_API_URL() {
    return typeof import.meta !== "undefined"
      ? import.meta.env.VITE_AI_API_URL
      : undefined;
  },

  // Server-side environment variables (if available)
  get STRIPE_SECRET_KEY() {
    return IS_SERVER && typeof process !== "undefined"
      ? process.env.STRIPE_SECRET_KEY
      : undefined;
  },

  get STRIPE_WEBHOOK_SECRET() {
    return IS_SERVER && typeof process !== "undefined"
      ? process.env.STRIPE_WEBHOOK_SECRET
      : undefined;
  },
};

// Development helpers
export const devLog = (...args: any[]) => {
  if (IS_DEVELOPMENT) {
    console.log("[DEV]", ...args);
  }
};

export const devWarn = (...args: any[]) => {
  if (IS_DEVELOPMENT) {
    console.warn("[DEV]", ...args);
  }
};

export const devError = (...args: any[]) => {
  if (IS_DEVELOPMENT) {
    console.error("[DEV]", ...args);
  }
};

// Production helpers
export const prodLog = (...args: any[]) => {
  if (IS_PRODUCTION) {
    console.log("[PROD]", ...args);
  }
};

// Feature flags based on environment
export const features = {
  ENABLE_LOGGING: IS_DEVELOPMENT || IS_STAGING,
  ENABLE_DEVTOOLS: IS_DEVELOPMENT,
  ENABLE_PERFORMANCE_MONITORING: !IS_DEVELOPMENT,
  ENABLE_ERROR_REPORTING: IS_PRODUCTION || IS_STAGING,
  ENABLE_DEBUG_PANEL: IS_DEVELOPMENT,
  ENABLE_RESPONSIVE_INSPECTOR: IS_DEVELOPMENT,
} as const;

export default {
  getNodeEnv,
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  IS_TEST,
  IS_STAGING,
  IS_BROWSER,
  IS_SERVER,
  env,
  devLog,
  devWarn,
  devError,
  prodLog,
  features,
};
