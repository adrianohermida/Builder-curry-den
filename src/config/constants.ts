/**
 * Application Constants
 *
 * Central place for all application constants including routes,
 * configuration values, and shared constants.
 */

// Route constants
export const ROUTES = {
  // Public routes
  LOGIN: "/login",
  REGISTER: "/registro",
  ONBOARDING: "/onboarding-start",

  // Main routes
  HOME: "/",
  DASHBOARD: "/dashboard",
  PAINEL: "/painel",

  // Module routes
  CRM: "/crm",
  CRM_MODERN: "/crm-modern",
  CRM_JURIDICO: "/crm-juridico",
  PUBLICACOES: "/publicacoes",
  AGENDA: "/agenda",
  ATENDIMENTO: "/atendimento",
  FINANCEIRO: "/financeiro",
  CONTRATOS: "/contratos",
  TAREFAS: "/tarefas",
  TICKETS: "/tickets",
  IA: "/ia",
  GED: "/ged",
  PORTAL_CLIENTE: "/portal-cliente",

  // Admin routes
  ADMIN: "/admin",
  ADMIN_ACTION_PLAN: "/admin/action-plan",
  ADMIN_SYSTEM_HEALTH: "/admin/system-health",
  ADMIN_UPDATES: "/admin/updates",

  // Management routes
  GESTAO: "/gestao",
  GESTAO_TAREFAS: "/gestao/tarefas",
  GESTAO_USUARIOS: "/gestao/usuarios",
  GESTAO_METRICAS: "/gestao/metricas",
  GESTAO_FINANCEIRO: "/gestao/financeiro",

  // Executive routes
  EXECUTIVO: "/executivo",
  EXECUTIVO_DASHBOARD: "/executivo/dashboard",

  // Settings routes
  CONFIGURACOES: "/configuracoes",
  CONFIGURACOES_PRAZOS: "/configuracoes/prazos",
  CONFIGURACAO_ARMAZENAMENTO: "/configuracao-armazenamento",

  // Beta routes
  BETA: "/beta",

  // Error routes
  NOT_FOUND: "/404",
} as const;

// Application metadata
export const APP_CONFIG = {
  NAME: "Lawdesk CRM",
  VERSION: "2.0.0",
  DESCRIPTION: "Sistema de gestão jurídica completo",
  AUTHOR: "Lawdesk Team",
  COPYRIGHT: "© 2024 Lawdesk. Todos os direitos reservados.",
} as const;

// Theme constants
export const THEME_CONFIG = {
  DEFAULT_THEME: "light" as const,
  STORAGE_KEY: "lawdesk-theme",
  THEMES: ["light", "dark", "system"] as const,
} as const;

// UI constants
export const UI_CONFIG = {
  SIDEBAR_WIDTH: 280,
  SIDEBAR_WIDTH_COLLAPSED: 64,
  HEADER_HEIGHT: 64,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,
} as const;

// Performance constants
export const PERFORMANCE_CONFIG = {
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
  ANIMATION_DURATION: 150,
  LONG_ANIMATION_DURATION: 300,
} as const;

// Data constants
export const DATA_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  SEARCH_MIN_LENGTH: 2,
  MAX_UPLOAD_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

// Status constants
export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
} as const;

// Priority constants
export const PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;

// User roles
export const USER_ROLES = {
  ADMIN: "admin",
  PARTNER: "partner",
  SENIOR_LAWYER: "senior_lawyer",
  LAWYER: "lawyer",
  JUNIOR_LAWYER: "junior_lawyer",
  PARALEGAL: "paralegal",
  SECRETARY: "secretary",
  INTERN: "intern",
  CLIENT: "client",
} as const;

// Permissions
export const PERMISSIONS = {
  // CRM permissions
  CRM_READ: "crm_read",
  CRM_WRITE: "crm_write",
  CRM_DELETE: "crm_delete",

  // CRM Juridico permissions
  CRM_JURIDICO_READ: "crm_juridico_read",
  CRM_JURIDICO_WRITE: "crm_juridico_write",
  CRM_JURIDICO_DELETE: "crm_juridico_delete",

  // Admin permissions
  ADMIN_READ: "admin_read",
  ADMIN_WRITE: "admin_write",

  // System permissions
  SYSTEM_ADMIN: "system_admin",
  SYSTEM_CONFIG: "system_config",
} as const;

// Module feature flags
export const FEATURES = {
  CRM_JURIDICO: true,
  AI_ASSISTANT: true,
  AGENDA_JURIDICA: false, // In development
  PROCESSOS_PUBLICACOES: false, // In development
  CONTRATOS_FINANCEIRO: false, // In development
  ATENDIMENTO_COMUNICACAO: false, // In development
  GED_DOCUMENTOS: false, // In development
  ADMIN_CONFIGURACOES: false, // In development
} as const;

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: "Ocorreu um erro inesperado. Tente novamente.",
  NETWORK: "Erro de conexão. Verifique sua internet.",
  UNAUTHORIZED: "Acesso não autorizado.",
  FORBIDDEN: "Você não tem permissão para esta ação.",
  NOT_FOUND: "Recurso não encontrado.",
  VALIDATION: "Dados inválidos. Verifique os campos.",
  SERVER: "Erro no servidor. Tente novamente mais tarde.",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  SAVE: "Salvo com sucesso!",
  DELETE: "Excluído com sucesso!",
  UPDATE: "Atualizado com sucesso!",
  CREATE: "Criado com sucesso!",
  SEND: "Enviado com sucesso!",
} as const;

// Loading messages
export const LOADING_MESSAGES = {
  LOADING: "Carregando...",
  SAVING: "Salvando...",
  DELETING: "Excluindo...",
  UPDATING: "Atualizando...",
  CREATING: "Criando...",
  SENDING: "Enviando...",
} as const;

export default {
  ROUTES,
  APP_CONFIG,
  THEME_CONFIG,
  UI_CONFIG,
  PERFORMANCE_CONFIG,
  DATA_CONFIG,
  STATUS,
  PRIORITY,
  USER_ROLES,
  PERMISSIONS,
  FEATURES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_MESSAGES,
};
