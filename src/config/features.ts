/**
 * Feature Flags Configuration
 *
 * Centralized feature toggles for gradual rollout and A/B testing.
 */

import { CURRENT_ENV, ENVIRONMENTS } from "./environment";

// Feature flag definitions
export const FEATURE_FLAGS = {
  // Core features
  ENABLE_CRM_MODULE: true,
  ENABLE_AGENDA_MODULE: true,
  ENABLE_GED_MODULE: true,
  ENABLE_FINANCIAL_MODULE: true,

  // AI features
  ENABLE_AI_CHAT: true,
  ENABLE_AI_ANALYSIS: CURRENT_ENV !== ENVIRONMENTS.PRODUCTION,
  ENABLE_AI_RECOMMENDATIONS: true,

  // Advanced features
  ENABLE_ADVANCED_SEARCH: true,
  ENABLE_BULK_OPERATIONS: true,
  ENABLE_REAL_TIME_NOTIFICATIONS: true,
  ENABLE_OFFLINE_MODE: false,

  // UI/UX features
  ENABLE_NEW_SIDEBAR: true,
  ENABLE_DARK_MODE: true,
  ENABLE_MOBILE_APP: true,
  ENABLE_RESPONSIVE_TABLES: true,

  // Beta features
  ENABLE_BETA_DASHBOARD: CURRENT_ENV === ENVIRONMENTS.DEVELOPMENT,
  ENABLE_EXPERIMENTAL_UI: CURRENT_ENV === ENVIRONMENTS.DEVELOPMENT,
  ENABLE_KANBAN_VIEW: true,

  // Administrative features
  ENABLE_ADMIN_PANEL: true,
  ENABLE_SYSTEM_MONITORING: true,
  ENABLE_AUDIT_LOGS: true,
  ENABLE_USER_MANAGEMENT: true,

  // Integration features
  ENABLE_STRIPE_INTEGRATION: CURRENT_ENV === ENVIRONMENTS.PRODUCTION,
  ENABLE_EMAIL_INTEGRATION: true,
  ENABLE_CALENDAR_SYNC: true,
  ENABLE_THIRD_PARTY_AUTH: true,

  // Performance features
  ENABLE_VIRTUAL_SCROLLING: true,
  ENABLE_IMAGE_OPTIMIZATION: true,
  ENABLE_CODE_SPLITTING: true,
  ENABLE_LAZY_LOADING: true,

  // Security features
  ENABLE_TWO_FACTOR_AUTH: false,
  ENABLE_SESSION_MONITORING: true,
  ENABLE_SECURITY_HEADERS: CURRENT_ENV === ENVIRONMENTS.PRODUCTION,
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

/**
 * Check if a feature is enabled
 */
export const isFeatureEnabled = (feature: FeatureFlag): boolean => {
  return FEATURE_FLAGS[feature] === true;
};

/**
 * Get all enabled features
 */
export const getEnabledFeatures = (): FeatureFlag[] => {
  return Object.entries(FEATURE_FLAGS)
    .filter(([, enabled]) => enabled)
    .map(([feature]) => feature as FeatureFlag);
};

/**
 * Feature flag groups for easier management
 */
export const FEATURE_GROUPS = {
  CORE_MODULES: [
    "ENABLE_CRM_MODULE",
    "ENABLE_AGENDA_MODULE",
    "ENABLE_GED_MODULE",
    "ENABLE_FINANCIAL_MODULE",
  ] as FeatureFlag[],

  AI_FEATURES: [
    "ENABLE_AI_CHAT",
    "ENABLE_AI_ANALYSIS",
    "ENABLE_AI_RECOMMENDATIONS",
  ] as FeatureFlag[],

  BETA_FEATURES: [
    "ENABLE_BETA_DASHBOARD",
    "ENABLE_EXPERIMENTAL_UI",
    "ENABLE_KANBAN_VIEW",
  ] as FeatureFlag[],

  ADMIN_FEATURES: [
    "ENABLE_ADMIN_PANEL",
    "ENABLE_SYSTEM_MONITORING",
    "ENABLE_AUDIT_LOGS",
    "ENABLE_USER_MANAGEMENT",
  ] as FeatureFlag[],
} as const;

/**
 * Check if all features in a group are enabled
 */
export const isFeatureGroupEnabled = (
  group: keyof typeof FEATURE_GROUPS,
): boolean => {
  return FEATURE_GROUPS[group].every((feature) => isFeatureEnabled(feature));
};

/**
 * Dynamic feature flags (can be toggled at runtime)
 */
export const DYNAMIC_FEATURES = {
  MAINTENANCE_MODE: false,
  RATE_LIMITING: true,
  DEBUG_MODE: CURRENT_ENV === ENVIRONMENTS.DEVELOPMENT,
} as const;

/**
 * User-specific feature flags (based on user role or subscription)
 */
export const USER_FEATURE_FLAGS = {
  PREMIUM_FEATURES: "premium",
  ADMIN_FEATURES: "admin",
  BETA_FEATURES: "beta",
} as const;

export type UserFeatureFlag =
  (typeof USER_FEATURE_FLAGS)[keyof typeof USER_FEATURE_FLAGS];

/**
 * Check if user has access to specific features
 */
export const hasUserFeatureAccess = (
  userRole: string,
  feature: UserFeatureFlag,
): boolean => {
  switch (feature) {
    case USER_FEATURE_FLAGS.PREMIUM_FEATURES:
      return ["premium", "enterprise", "admin"].includes(userRole);
    case USER_FEATURE_FLAGS.ADMIN_FEATURES:
      return ["admin", "super_admin"].includes(userRole);
    case USER_FEATURE_FLAGS.BETA_FEATURES:
      return ["beta", "admin", "super_admin"].includes(userRole);
    default:
      return false;
  }
};
