/**
 * Integration Service
 *
 * Central service for managing all integrations with secure credential handling,
 * adapter management, and health monitoring.
 */

import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/config/api";
import type { PaginatedResponse, PaginationParams } from "@/core/api/types";

import { CredentialService } from "./credentialService";
import { AdapterRegistry } from "../adapters/AdapterRegistry";
import { IntegrationMonitor } from "./monitoringService";

import type {
  Integration,
  IntegrationProvider,
  IntegrationAdapter,
  CreateIntegrationRequest,
  UpdateIntegrationRequest,
  TestConnectionRequest,
  TestConnectionResponse,
  IntegrationMetrics,
  IntegrationLog,
  SyncOptions,
  SyncResult,
  HealthStatus,
} from "../types";

/**
 * Main integration service class
 */
export class IntegrationService {
  private credentialService: CredentialService;
  private adapterRegistry: AdapterRegistry;
  private monitor: IntegrationMonitor;

  constructor() {
    this.credentialService = new CredentialService();
    this.adapterRegistry = new AdapterRegistry();
    this.monitor = new IntegrationMonitor();
  }

  /**
   * Get all integrations with pagination
   */
  async getIntegrations(
    params: PaginationParams = {},
  ): Promise<PaginatedResponse<Integration>> {
    try {
      return await apiClient.get(`${API_ENDPOINTS.INTEGRATIONS.BASE}`, {
        params,
      });
    } catch (error) {
      this.monitor.logError("get_integrations", error);
      throw error;
    }
  }

  /**
   * Get integration by ID
   */
  async getIntegration(id: string): Promise<Integration> {
    try {
      const integration = await apiClient.get(
        `${API_ENDPOINTS.INTEGRATIONS.BASE}/${id}`,
      );

      // Decrypt credentials for use
      if (integration.credentials.encrypted) {
        integration.credentials = await this.credentialService.decrypt(
          integration.credentials,
        );
      }

      return integration;
    } catch (error) {
      this.monitor.logError("get_integration", error, { integrationId: id });
      throw error;
    }
  }

  /**
   * Create new integration
   */
  async createIntegration(
    data: CreateIntegrationRequest,
  ): Promise<Integration> {
    try {
      // Validate provider is supported
      const adapter = this.adapterRegistry.getAdapter(data.provider);
      if (!adapter) {
        throw new Error(`Provider ${data.provider} is not supported`);
      }

      // Validate configuration
      const validation = adapter.validateConfig(data.config);
      if (!validation.valid) {
        throw new Error(
          `Invalid configuration: ${validation.errors.join(", ")}`,
        );
      }

      // Encrypt credentials before storing
      const encryptedCredentials = await this.credentialService.encrypt(
        data.credentials,
      );

      const integration = await apiClient.post(
        API_ENDPOINTS.INTEGRATIONS.BASE,
        {
          ...data,
          credentials: encryptedCredentials,
        },
      );

      this.monitor.logAction("create_integration", "success", {
        integrationId: integration.id,
        provider: data.provider,
      });

      return integration;
    } catch (error) {
      this.monitor.logError("create_integration", error, {
        provider: data.provider,
      });
      throw error;
    }
  }

  /**
   * Update existing integration
   */
  async updateIntegration(
    id: string,
    data: UpdateIntegrationRequest,
  ): Promise<Integration> {
    try {
      // Encrypt credentials if provided
      if (data.credentials) {
        data.credentials = await this.credentialService.encrypt(
          data.credentials,
        );
      }

      const integration = await apiClient.put(
        `${API_ENDPOINTS.INTEGRATIONS.BASE}/${id}`,
        data,
      );

      this.monitor.logAction("update_integration", "success", {
        integrationId: id,
      });

      return integration;
    } catch (error) {
      this.monitor.logError("update_integration", error, { integrationId: id });
      throw error;
    }
  }

  /**
   * Delete integration
   */
  async deleteIntegration(id: string): Promise<void> {
    try {
      await apiClient.delete(`${API_ENDPOINTS.INTEGRATIONS.BASE}/${id}`);

      this.monitor.logAction("delete_integration", "success", {
        integrationId: id,
      });
    } catch (error) {
      this.monitor.logError("delete_integration", error, { integrationId: id });
      throw error;
    }
  }

  /**
   * Test connection to external service
   */
  async testConnection(
    request: TestConnectionRequest,
  ): Promise<TestConnectionResponse> {
    try {
      const adapter = this.adapterRegistry.getAdapter(request.provider);
      if (!adapter) {
        throw new Error(`Provider ${request.provider} is not supported`);
      }

      const startTime = Date.now();

      // Test authentication
      const authResult = await adapter.authenticate(request.credentials);
      if (!authResult.success) {
        return {
          success: false,
          message: authResult.error || "Authentication failed",
          features: [],
          responseTime: Date.now() - startTime,
          error: authResult.error,
        };
      }

      // Test health
      const healthStatus = await adapter.ping();

      return {
        success: healthStatus.status === "healthy",
        message:
          healthStatus.status === "healthy"
            ? "Connection successful"
            : healthStatus.error || "Connection issues detected",
        features: adapter.getAvailableFeatures(),
        responseTime: Date.now() - startTime,
        error: healthStatus.error,
      };
    } catch (error) {
      this.monitor.logError("test_connection", error, {
        provider: request.provider,
      });

      return {
        success: false,
        message: error instanceof Error ? error.message : "Connection failed",
        features: [],
        responseTime: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Sync data with external service
   */
  async syncIntegration(
    integrationId: string,
    options: SyncOptions,
  ): Promise<SyncResult> {
    try {
      const integration = await this.getIntegration(integrationId);
      const adapter = this.adapterRegistry.getAdapter(integration.provider);

      if (!adapter || !adapter.sync) {
        throw new Error("Sync not supported for this integration");
      }

      const result = await adapter.sync(options);

      // Update last sync timestamp
      await this.updateIntegration(integrationId, {
        status: result.success ? "active" : "error",
      });

      this.monitor.logAction("sync_integration", "success", {
        integrationId,
        processed: result.processed,
        duration: result.duration,
      });

      return result;
    } catch (error) {
      this.monitor.logError("sync_integration", error, { integrationId });
      throw error;
    }
  }

  /**
   * Get health status for integration
   */
  async getIntegrationHealth(integrationId: string): Promise<HealthStatus> {
    try {
      const integration = await this.getIntegration(integrationId);
      const adapter = this.adapterRegistry.getAdapter(integration.provider);

      if (!adapter) {
        return {
          status: "error",
          responseTime: 0,
          lastChecked: new Date().toISOString(),
          error: "Adapter not found",
        };
      }

      return await adapter.ping();
    } catch (error) {
      this.monitor.logError("health_check", error, { integrationId });

      return {
        status: "error",
        responseTime: 0,
        lastChecked: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get integration metrics
   */
  async getMetrics(): Promise<IntegrationMetrics> {
    try {
      return await apiClient.get(`${API_ENDPOINTS.INTEGRATIONS.METRICS}`);
    } catch (error) {
      this.monitor.logError("get_metrics", error);
      throw error;
    }
  }

  /**
   * Get integration logs
   */
  async getLogs(
    integrationId?: string,
    params: PaginationParams = {},
  ): Promise<PaginatedResponse<IntegrationLog>> {
    try {
      const endpoint = integrationId
        ? `${API_ENDPOINTS.INTEGRATIONS.BASE}/${integrationId}/logs`
        : `${API_ENDPOINTS.INTEGRATIONS.LOGS}`;

      return await apiClient.get(endpoint, { params });
    } catch (error) {
      this.monitor.logError("get_logs", error, { integrationId });
      throw error;
    }
  }

  /**
   * Get available providers
   */
  getAvailableProviders(): IntegrationProvider[] {
    return this.adapterRegistry.getRegisteredProviders();
  }

  /**
   * Get adapter for provider
   */
  getAdapter(provider: IntegrationProvider): IntegrationAdapter | null {
    return this.adapterRegistry.getAdapter(provider);
  }

  /**
   * Register new adapter
   */
  registerAdapter(adapter: IntegrationAdapter): void {
    this.adapterRegistry.register(adapter);
  }

  /**
   * Handle incoming webhook
   */
  async handleWebhook(
    integrationId: string,
    payload: any,
    headers: Record<string, string>,
  ): Promise<void> {
    try {
      const integration = await this.getIntegration(integrationId);
      const adapter = this.adapterRegistry.getAdapter(integration.provider);

      if (!adapter || !adapter.handleWebhook) {
        throw new Error("Webhook handling not supported for this integration");
      }

      const result = await adapter.handleWebhook(payload, headers);

      this.monitor.logAction("webhook", "success", {
        integrationId,
        processed: result.processed,
        actions: result.actions,
      });
    } catch (error) {
      this.monitor.logError("webhook", error, { integrationId });
      throw error;
    }
  }
}

// Service instance
export const integrationService = new IntegrationService();

// Export service class for dependency injection
export { IntegrationService };
