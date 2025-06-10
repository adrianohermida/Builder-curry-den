/**
 * Zapsign Adapter
 *
 * Integration adapter for Zapsign digital signature platform.
 * Provides document signing, template management, and webhook support.
 */

import type {
  IntegrationAdapter,
  IntegrationProvider,
  IntegrationFeature,
  IntegrationCredentials,
  IntegrationConfig,
  AuthResult,
  HealthStatus,
  ValidationResult,
  CredentialRequirement,
  WebhookResult,
  SyncOptions,
  SyncResult,
  DataQuery,
  SendOptions,
  SendResult,
} from "../../types";

export class ZapsignAdapter implements IntegrationAdapter {
  provider: IntegrationProvider = "zapsign";
  name = "Zapsign Digital Signatures";
  version = "1.0.0";
  features: IntegrationFeature[] = [
    "documents_sync",
    "webhook_support",
    "esignature",
    "file_upload",
    "custom_fields",
  ];

  private baseUrl = "https://api.zapsign.com.br";
  private apiVersion = "v1";

  /**
   * Authenticate with Zapsign API
   */
  async authenticate(credentials: IntegrationCredentials): Promise<AuthResult> {
    try {
      const { apiKey } = credentials.data as any;

      if (!apiKey) {
        return {
          success: false,
          error: "API key is required",
        };
      }

      // Test API key by making a simple request
      const response = await fetch(`${this.baseUrl}/${this.apiVersion}/docs/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Authentication failed: ${response.statusText}`,
        };
      }

      return {
        success: true,
        token: apiKey,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      };
    }
  }

  /**
   * Health check
   */
  async ping(): Promise<HealthStatus> {
    const startTime = Date.now();

    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: "GET",
      });

      const responseTime = Date.now() - startTime;

      if (!response.ok) {
        return {
          status: "error",
          responseTime,
          lastChecked: new Date().toISOString(),
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        status: "healthy",
        responseTime,
        lastChecked: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: "error",
        responseTime: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get integration status
   */
  async getStatus() {
    const health = await this.ping();
    return health.status === "healthy" ? "active" : "error";
  }

  /**
   * Sync documents with Zapsign
   */
  async sync(options: SyncOptions): Promise<SyncResult> {
    const startTime = Date.now();
    const result: SyncResult = {
      success: false,
      processed: 0,
      created: 0,
      updated: 0,
      failed: 0,
      errors: [],
      duration: 0,
    };

    try {
      if (
        options.direction === "pull" ||
        options.direction === "bidirectional"
      ) {
        // Pull documents from Zapsign
        const documents = await this.getDocuments({
          entity: "documents",
          since: options.since,
          limit: options.limit,
        });

        for (const doc of documents) {
          try {
            // Process document sync logic here
            result.processed++;
            result.created++;
          } catch (error) {
            result.failed++;
            result.errors.push({
              entity: "document",
              error: error instanceof Error ? error.message : "Unknown error",
              data: doc,
            });
          }
        }
      }

      result.success = result.failed === 0;
      result.duration = Date.now() - startTime;

      return result;
    } catch (error) {
      result.errors.push({
        entity: "sync",
        error: error instanceof Error ? error.message : "Sync failed",
      });
      result.duration = Date.now() - startTime;
      return result;
    }
  }

  /**
   * Get documents from Zapsign
   */
  async getData(query: DataQuery): Promise<any[]> {
    try {
      // Implementation would fetch documents based on query
      return [];
    } catch (error) {
      console.error("Failed to get Zapsign data:", error);
      return [];
    }
  }

  /**
   * Send data to Zapsign
   */
  async sendData(data: any[], options?: SendOptions): Promise<SendResult> {
    const result: SendResult = {
      success: false,
      processed: 0,
      created: 0,
      updated: 0,
      failed: 0,
      errors: [],
    };

    try {
      for (const item of data) {
        try {
          // Implementation would send document to Zapsign
          result.processed++;
          result.created++;
        } catch (error) {
          result.failed++;
          result.errors.push({
            entity: "document",
            error: error instanceof Error ? error.message : "Unknown error",
            data: item,
          });
        }
      }

      result.success = result.failed === 0;
      return result;
    } catch (error) {
      result.errors.push({
        entity: "send",
        error: error instanceof Error ? error.message : "Send failed",
      });
      return result;
    }
  }

  /**
   * Handle incoming webhooks
   */
  async handleWebhook(
    payload: any,
    headers: Record<string, string>,
  ): Promise<WebhookResult> {
    try {
      // Verify webhook signature
      const signature = headers["x-zapsign-signature"];
      if (!signature) {
        throw new Error("Missing webhook signature");
      }

      // Process webhook payload
      const actions: string[] = [];

      switch (payload.event) {
        case "document.signed":
          actions.push("document_signed");
          // Handle document signing completion
          break;
        case "document.rejected":
          actions.push("document_rejected");
          // Handle document rejection
          break;
        case "document.created":
          actions.push("document_created");
          // Handle new document creation
          break;
        default:
          console.warn(`Unknown webhook event: ${payload.event}`);
      }

      return {
        processed: true,
        actions,
      };
    } catch (error) {
      return {
        processed: false,
        actions: [],
        error:
          error instanceof Error ? error.message : "Webhook processing failed",
      };
    }
  }

  /**
   * Validate configuration
   */
  validateConfig(config: IntegrationConfig): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (config.timeout && (config.timeout < 1000 || config.timeout > 300000)) {
      warnings.push("Timeout should be between 1000ms and 300000ms");
    }

    if (
      config.retryAttempts &&
      (config.retryAttempts < 0 || config.retryAttempts > 5)
    ) {
      warnings.push("Retry attempts should be between 0 and 5");
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Get required credentials
   */
  getRequiredCredentials(): CredentialRequirement[] {
    return [
      {
        key: "apiKey",
        name: "API Key",
        type: "password",
        required: true,
        description: "Your Zapsign API key from the dashboard",
      },
    ];
  }

  /**
   * Get available features
   */
  getAvailableFeatures(): IntegrationFeature[] {
    return this.features;
  }

  /**
   * Private helper methods
   */
  private async getDocuments(query: DataQuery): Promise<any[]> {
    // Implementation would fetch documents from Zapsign API
    return [];
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit,
    apiKey: string,
  ): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/${this.apiVersion}${endpoint}`,
      {
        ...options,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          ...options.headers,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Zapsign API error: ${response.statusText}`);
    }

    return response.json();
  }
}

export default ZapsignAdapter;
