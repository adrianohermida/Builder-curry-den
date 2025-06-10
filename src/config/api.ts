/**
 * API Configuration
 *
 * Centralized API configuration including base URLs, endpoints,
 * timeout settings, and retry policies.
 */

// API Base URLs
export const API_BASE_URLS = {
  MAIN: process.env.VITE_API_BASE_URL || "https://api.lawdesk.com",
  AUTH: process.env.VITE_AUTH_API_URL || "https://auth.lawdesk.com",
  STORAGE: process.env.VITE_STORAGE_API_URL || "https://storage.lawdesk.com",
  AI: process.env.VITE_AI_API_URL || "https://ai.lawdesk.com",
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    REGISTER: "/auth/register",
    PROFILE: "/auth/profile",
  },

  // CRM
  CRM: {
    CLIENTS: "/crm/clients",
    PROCESSES: "/crm/processes",
    CONTACTS: "/crm/contacts",
    TASKS: "/crm/tasks",
  },

  // Agenda
  AGENDA: {
    EVENTS: "/agenda/events",
    CALENDAR: "/agenda/calendar",
    REMINDERS: "/agenda/reminders",
  },

  // GED (Document Management)
  GED: {
    DOCUMENTS: "/ged/documents",
    FOLDERS: "/ged/folders",
    UPLOAD: "/ged/upload",
    DOWNLOAD: "/ged/download",
  },

  // Financial
  FINANCIAL: {
    INVOICES: "/financial/invoices",
    PAYMENTS: "/financial/payments",
    REPORTS: "/financial/reports",
  },

  // AI Services
  AI: {
    CHAT: "/ai/chat",
    ANALYSIS: "/ai/analysis",
    RECOMMENDATIONS: "/ai/recommendations",
  },

  // Integrations
  INTEGRATIONS: {
    BASE: "/integrations",
    PROVIDERS: "/integrations/providers",
    ADAPTERS: "/integrations/adapters",
    TEST: "/integrations/test",
    VALIDATE: "/integrations/validate",
    REFRESH_TOKEN: "/integrations/refresh-token",
    WEBHOOK: "/integrations/webhook",
    SYNC: "/integrations/sync",
    METRICS: "/integrations/metrics",
    LOGS: "/integrations/logs",
    HEALTH: "/integrations/health",
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Request timeout settings (in milliseconds)
export const TIMEOUTS = {
  DEFAULT: 10000, // 10 seconds
  UPLOAD: 60000, // 60 seconds for file uploads
  AI: 30000, // 30 seconds for AI operations
  INTEGRATION: 15000, // 15 seconds for integration calls
} as const;

// Retry configuration
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second base delay
  RETRY_MULTIPLIER: 2, // Exponential backoff multiplier
} as const;

// Request headers
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;

// File upload configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
  CHUNK_SIZE: 1024 * 1024, // 1MB chunks for large uploads
} as const;

// Cache configuration
export const CACHE_CONFIG = {
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  DEFAULT_CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  LONG_CACHE_TIME: 60 * 60 * 1000, // 1 hour
  INTEGRATION_CACHE_TIME: 2 * 60 * 1000, // 2 minutes for integration status
} as const;
