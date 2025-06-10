/**
 * Integration Types
 *
 * TypeScript type definitions for the integration system including
 * adapters, credentials, configuration, and monitoring.
 */

import type { BaseEntity } from "@/core/api/types";

// Base integration types
export interface Integration extends BaseEntity {
  name: string;
  slug: string;
  provider: IntegrationProvider;
  status: IntegrationStatus;
  config: IntegrationConfig;
  credentials: IntegrationCredentials;
  webhook?: WebhookConfig;
  features: IntegrationFeature[];
  metadata?: Record<string, any>;
  lastSyncAt?: string;
  nextSyncAt?: string;
  errorCount: number;
  lastError?: string;
}

export type IntegrationProvider =
  | "zapsign"
  | "bitrix24"
  | "rd_station"
  | "hubspot"
  | "pipedrive"
  | "salesforce"
  | "mailchimp"
  | "zapier"
  | "make"
  | "custom";

export type IntegrationStatus =
  | "active"
  | "inactive"
  | "error"
  | "syncing"
  | "pending_setup"
  | "expired";

export type IntegrationFeature =
  | "contacts_sync"
  | "documents_sync"
  | "email_automation"
  | "webhook_support"
  | "real_time_sync"
  | "bulk_operations"
  | "custom_fields"
  | "file_upload"
  | "esignature"
  | "crm_sync";

// Configuration interfaces
export interface IntegrationConfig {
  apiUrl?: string;
  apiVersion?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  syncInterval?: number;
  batchSize?: number;
  customFields?: Record<string, any>;
  mappings?: FieldMapping[];
  filters?: IntegrationFilter[];
  notifications?: NotificationConfig;
}

export interface IntegrationCredentials {
  id: string;
  type: CredentialType;
  encrypted: boolean;
  data: EncryptedCredentialData | PlainCredentialData;
  expiresAt?: string;
  scopes?: string[];
}

export type CredentialType =
  | "api_key"
  | "oauth2"
  | "basic_auth"
  | "bearer_token"
  | "jwt"
  | "custom";

export interface EncryptedCredentialData {
  encrypted: true;
  data: string; // Base64 encrypted JSON
  algorithm: string;
  iv: string;
}

export interface PlainCredentialData {
  encrypted: false;
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  username?: string;
  password?: string;
  [key: string]: any;
}

// Field mapping for data synchronization
export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transformation?: FieldTransformation;
  required?: boolean;
  defaultValue?: any;
}

export interface FieldTransformation {
  type: "format" | "calculation" | "lookup" | "conditional";
  params: Record<string, any>;
}

export interface IntegrationFilter {
  field: string;
  operator:
    | "equals"
    | "contains"
    | "greater_than"
    | "less_than"
    | "in"
    | "not_in";
  value: any;
}

// Webhook configuration
export interface WebhookConfig {
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  headers?: Record<string, string>;
}

// Notification configuration
export interface NotificationConfig {
  onSuccess?: boolean;
  onError?: boolean;
  onWarning?: boolean;
  channels?: NotificationChannel[];
}

export interface NotificationChannel {
  type: "email" | "slack" | "webhook" | "in_app";
  config: Record<string, any>;
}

// Adapter interface
export interface IntegrationAdapter {
  provider: IntegrationProvider;
  name: string;
  version: string;
  features: IntegrationFeature[];

  // Authentication
  authenticate(credentials: IntegrationCredentials): Promise<AuthResult>;
  refreshToken?(credentials: IntegrationCredentials): Promise<AuthResult>;

  // Health checks
  ping(): Promise<HealthStatus>;
  getStatus(): Promise<IntegrationStatus>;

  // Data operations
  sync?(options: SyncOptions): Promise<SyncResult>;
  getData?(query: DataQuery): Promise<any[]>;
  sendData?(data: any[], options?: SendOptions): Promise<SendResult>;

  // Webhook support
  handleWebhook?(
    payload: any,
    headers: Record<string, string>,
  ): Promise<WebhookResult>;

  // Configuration
  validateConfig(config: IntegrationConfig): ValidationResult;
  getRequiredCredentials(): CredentialRequirement[];
  getAvailableFeatures(): IntegrationFeature[];
}

// Operation results
export interface AuthResult {
  success: boolean;
  token?: string;
  expiresIn?: number;
  scopes?: string[];
  error?: string;
}

export interface HealthStatus {
  status: "healthy" | "warning" | "error";
  responseTime: number;
  lastChecked: string;
  details?: Record<string, any>;
  error?: string;
}

export interface SyncOptions {
  direction: "pull" | "push" | "bidirectional";
  entities: string[];
  since?: string;
  limit?: number;
  dryRun?: boolean;
}

export interface SyncResult {
  success: boolean;
  processed: number;
  created: number;
  updated: number;
  failed: number;
  errors: SyncError[];
  duration: number;
}

export interface SyncError {
  entity: string;
  error: string;
  data?: any;
}

export interface DataQuery {
  entity: string;
  filters?: Record<string, any>;
  fields?: string[];
  limit?: number;
  offset?: number;
  orderBy?: string;
}

export interface SendOptions {
  batchSize?: number;
  validateOnly?: boolean;
  upsert?: boolean;
}

export interface SendResult {
  success: boolean;
  processed: number;
  created: number;
  updated: number;
  failed: number;
  errors: SyncError[];
}

export interface WebhookResult {
  processed: boolean;
  actions: string[];
  error?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CredentialRequirement {
  key: string;
  name: string;
  type: "text" | "password" | "url" | "select";
  required: boolean;
  description?: string;
  options?: { label: string; value: string }[];
}

// Monitoring and logs
export interface IntegrationLog extends BaseEntity {
  integrationId: string;
  action: IntegrationAction;
  status: "success" | "warning" | "error";
  message: string;
  duration?: number;
  requestData?: any;
  responseData?: any;
  error?: string;
}

export type IntegrationAction =
  | "authenticate"
  | "sync"
  | "webhook"
  | "health_check"
  | "config_update"
  | "test_connection";

// API requests/responses
export interface CreateIntegrationRequest {
  name: string;
  provider: IntegrationProvider;
  config: IntegrationConfig;
  credentials: Omit<IntegrationCredentials, "id">;
  features: IntegrationFeature[];
}

export interface UpdateIntegrationRequest {
  name?: string;
  config?: Partial<IntegrationConfig>;
  credentials?: Partial<IntegrationCredentials>;
  features?: IntegrationFeature[];
  status?: IntegrationStatus;
}

export interface TestConnectionRequest {
  provider: IntegrationProvider;
  credentials: Omit<IntegrationCredentials, "id">;
  config?: Partial<IntegrationConfig>;
}

export interface TestConnectionResponse {
  success: boolean;
  message: string;
  features: IntegrationFeature[];
  responseTime: number;
  error?: string;
}

// Integration analytics
export interface IntegrationMetrics {
  totalIntegrations: number;
  activeIntegrations: number;
  errorCount: number;
  lastSyncCount: number;
  avgResponseTime: number;
  topProviders: { provider: IntegrationProvider; count: number }[];
  recentErrors: IntegrationLog[];
}

// Export all types
export type {
  Integration,
  IntegrationProvider,
  IntegrationStatus,
  IntegrationFeature,
  IntegrationConfig,
  IntegrationCredentials,
  CredentialType,
  EncryptedCredentialData,
  PlainCredentialData,
  FieldMapping,
  FieldTransformation,
  IntegrationFilter,
  WebhookConfig,
  NotificationConfig,
  NotificationChannel,
  IntegrationAdapter,
  AuthResult,
  HealthStatus,
  SyncOptions,
  SyncResult,
  SyncError,
  DataQuery,
  SendOptions,
  SendResult,
  WebhookResult,
  ValidationResult,
  CredentialRequirement,
  IntegrationLog,
  IntegrationAction,
  CreateIntegrationRequest,
  UpdateIntegrationRequest,
  TestConnectionRequest,
  TestConnectionResponse,
  IntegrationMetrics,
};
