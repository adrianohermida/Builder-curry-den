/**
 * Application Constants
 *
 * Shared constants used throughout the application.
 */

// Application routes
export const ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/registro",
  ONBOARDING: "/onboarding-start",

  // Main application routes
  DASHBOARD: "/painel",
  CRM: "/crm-modern",
  AGENDA: "/agenda",
  PUBLICATIONS: "/publicacoes",
  SERVICE: "/atendimento",
  FINANCIAL: "/financeiro",
  CONTRACTS: "/contratos",
  TASKS: "/tarefas",
  TICKETS: "/tickets",
  SETTINGS: "/configuracoes",

  // Specialized modules
  AI: "/ia",
  GED: "/ged",
  GED_ORGANIZATIONAL: "/ged/organizacional",
  CLIENT_PORTAL: "/portal-cliente",

  // Administrative routes
  ADMIN: {
    BASE: "/admin",
    ACTION_PLAN: "/admin/action-plan",
    SYSTEM_HEALTH: "/admin/system-health",
    UPDATES: "/admin/updates",
  },

  // Management routes
  MANAGEMENT: {
    BASE: "/gestao",
    TASKS: "/gestao/tarefas",
    USERS: "/gestao/usuarios",
    METRICS: "/gestao/metricas",
    FINANCIAL: "/gestao/financeiro",
  },

  // Executive routes
  EXECUTIVE: {
    BASE: "/executivo",
    DASHBOARD: "/executivo/dashboard",
  },

  // Beta routes
  BETA: {
    BASE: "/beta",
    DASHBOARD: "/beta/dashboard",
    REPORTS: "/beta/reports",
    OPTIMIZATION: "/beta/code-optimization",
  },

  // SaaS routes
  SAAS: {
    BASE: "/saas",
    DASHBOARD: "/saas/dashboard",
    CRM: "/saas/crm",
    ANALYTICS: "/saas/analytics",
    BILLING: "/saas/billing",
  },
} as const;

// User roles and permissions
export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MANAGER: "manager",
  LAWYER: "lawyer",
  SECRETARY: "secretary",
  CLIENT: "client",
  BETA_USER: "beta",
  PREMIUM_USER: "premium",
  ENTERPRISE_USER: "enterprise",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Permission levels
export const PERMISSIONS = {
  READ: "read",
  WRITE: "write",
  DELETE: "delete",
  ADMIN: "admin",
  OWNER: "owner",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Data table pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// Form validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50,
  MAX_EMAIL_LENGTH: 255,
  MAX_PHONE_LENGTH: 20,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_COMMENT_LENGTH: 500,
} as const;

// Date and time formats
export const DATE_FORMATS = {
  DISPLAY: "dd/MM/yyyy",
  DISPLAY_WITH_TIME: "dd/MM/yyyy HH:mm",
  API: "yyyy-MM-dd",
  API_WITH_TIME: "yyyy-MM-ddTHH:mm:ss",
  TIME_ONLY: "HH:mm",
  MONTH_YEAR: "MM/yyyy",
  FULL_DATE: "EEEE, dd 'de' MMMM 'de' yyyy",
} as const;

// File types and sizes
export const FILE_TYPES = {
  IMAGE: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  DOCUMENT: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
  ],
  ARCHIVE: ["application/zip", "application/rar"],
} as const;

export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  ARCHIVE: 50 * 1024 * 1024, // 50MB
  AVATAR: 2 * 1024 * 1024, // 2MB
} as const;

// Status types
export const STATUS_TYPES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
  SUSPENDED: "suspended",
  ARCHIVED: "archived",
  DRAFT: "draft",
  PUBLISHED: "published",
  COMPLETED: "completed",
  IN_PROGRESS: "in_progress",
  CANCELLED: "cancelled",
} as const;

export type StatusType = (typeof STATUS_TYPES)[keyof typeof STATUS_TYPES];

// Priority levels
export const PRIORITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
  CRITICAL: "critical",
} as const;

export type PriorityLevel =
  (typeof PRIORITY_LEVELS)[keyof typeof PRIORITY_LEVELS];

// Notification types
export const NOTIFICATION_TYPES = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

// Local storage keys (organized by feature)
export const STORAGE_KEYS_BY_FEATURE = {
  AUTH: {
    TOKEN: "auth_token",
    REFRESH_TOKEN: "refresh_token",
    USER_DATA: "user_data",
    REMEMBER_ME: "remember_me",
  },
  UI: {
    THEME: "ui_theme",
    SIDEBAR_COLLAPSED: "ui_sidebar_collapsed",
    TABLE_PREFERENCES: "ui_table_preferences",
    LANGUAGE: "ui_language",
  },
  CRM: {
    FILTER_PREFERENCES: "crm_filter_preferences",
    COLUMN_VISIBILITY: "crm_column_visibility",
    LAST_SELECTED_CLIENT: "crm_last_selected_client",
  },
  AGENDA: {
    VIEW_MODE: "agenda_view_mode",
    CALENDAR_PREFERENCES: "agenda_calendar_preferences",
  },
} as const;

// Error codes
export const ERROR_CODES = {
  NETWORK_ERROR: "NETWORK_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

// Success messages
export const SUCCESS_MESSAGES = {
  CREATED: "Item criado com sucesso",
  UPDATED: "Item atualizado com sucesso",
  DELETED: "Item removido com sucesso",
  SAVED: "Dados salvos com sucesso",
  SENT: "Dados enviados com sucesso",
  UPLOADED: "Arquivo enviado com sucesso",
  EXPORTED: "Dados exportados com sucesso",
  IMPORTED: "Dados importados com sucesso",
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK: "Erro de conexão. Verifique sua internet.",
  UNAUTHORIZED: "Acesso não autorizado. Faça login novamente.",
  FORBIDDEN: "Você não tem permissão para esta ação.",
  NOT_FOUND: "Item não encontrado.",
  VALIDATION: "Dados inválidos. Verifique os campos.",
  SERVER: "Erro interno do servidor. Tente novamente.",
  TIMEOUT: "Operação demorou muito. Tente novamente.",
  FILE_TOO_LARGE: "Arquivo muito grande.",
  FILE_TYPE_NOT_ALLOWED: "Tipo de arquivo não permitido.",
} as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  INSTANT: 0,
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

// Z-index layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const;

// Breakpoint values (for JavaScript usage)
export const BREAKPOINT_VALUES = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;
