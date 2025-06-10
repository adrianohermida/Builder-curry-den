/**
 * API Types
 *
 * TypeScript type definitions for the API layer including
 * request/response types, configuration, and error types.
 */

// Base API configuration
export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// Request configuration
export interface RequestConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
  timeout?: number;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
  config: RequestConfig;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  filters?: Record<string, any>;
}

// API error response
export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: any;
  timestamp?: string;
  path?: string;
}

// Request/Response interceptor types
export type RequestInterceptor = (
  config: RequestConfig,
) => RequestConfig | Promise<RequestConfig>;

export type ResponseInterceptor = (
  response: Response,
) => Response | Promise<Response>;

// File upload progress
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// File upload options
export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  chunkSize?: number;
  maxRetries?: number;
}

// Search parameters
export interface SearchParams {
  query: string;
  fields?: string[];
  limit?: number;
  offset?: number;
  filters?: Record<string, any>;
  highlight?: boolean;
}

// Search response
export interface SearchResponse<T> {
  results: T[];
  total: number;
  took: number;
  highlights?: Record<string, string[]>;
  aggregations?: Record<string, any>;
}

// Bulk operation request
export interface BulkOperationRequest<T> {
  operation: "create" | "update" | "delete";
  items: T[];
}

// Bulk operation response
export interface BulkOperationResponse {
  success: number;
  failed: number;
  errors: Array<{
    index: number;
    error: string;
  }>;
}

// Health check response
export interface HealthCheckResponse {
  status: "healthy" | "unhealthy" | "degraded";
  timestamp: string;
  services: Record<
    string,
    {
      status: "up" | "down";
      responseTime?: number;
      error?: string;
    }
  >;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  preferences?: UserPreferences;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: string;
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  inApp: boolean;
}

// Base entity types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// Audit log entry
export interface AuditLogEntry extends BaseEntity {
  entityType: string;
  entityId: string;
  action: string;
  changes: Record<string, any>;
  userAgent?: string;
  ipAddress?: string;
}

// API versioning
export interface ApiVersion {
  version: string;
  deprecated?: boolean;
  deprecationDate?: string;
  supportedUntil?: string;
}

// Rate limiting information
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

// Webhook types
export interface WebhookEvent {
  id: string;
  type: string;
  data: any;
  timestamp: string;
  signature: string;
}

export interface WebhookConfig {
  url: string;
  events: string[];
  secret: string;
  active: boolean;
}

// Export all types for easy importing
export type {
  ApiClientConfig,
  RequestConfig,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  ApiErrorResponse,
  RequestInterceptor,
  ResponseInterceptor,
  UploadProgress,
  UploadOptions,
  SearchParams,
  SearchResponse,
  BulkOperationRequest,
  BulkOperationResponse,
  HealthCheckResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
  UserPreferences,
  NotificationPreferences,
  BaseEntity,
  AuditLogEntry,
  ApiVersion,
  RateLimitInfo,
  WebhookEvent,
  WebhookConfig,
};
