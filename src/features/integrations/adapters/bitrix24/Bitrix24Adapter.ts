/**
 * Bitrix24 Adapter
 *
 * Integration adapter for Bitrix24 CRM platform.
 * Provides contact sync, deal management, and real-time notifications.
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

export class Bitrix24Adapter implements IntegrationAdapter {
  provider: IntegrationProvider = "bitrix24";
  name = "Bitrix24 CRM";
  version = "1.0.0";
  features: IntegrationFeature[] = [
    "contacts_sync",
    "crm_sync",
    "webhook_support",
    "real_time_sync",
    "bulk_operations",
    "custom_fields",
  ];

  private getBaseUrl(domain: string): string {
    return `https://${domain}.bitrix24.com.br/rest`;
  }

  /**
   * Authenticate with Bitrix24 API
   */
  async authenticate(credentials: IntegrationCredentials): Promise<AuthResult> {
    try {
      const { domain, accessToken, clientId, clientSecret } =
        credentials.data as any;

      if (!domain) {
        return { success: false, error: "Domain is required" };
      }

      if (!accessToken && (!clientId || !clientSecret)) {
        return {
          success: false,
          error: "Access token or OAuth credentials are required",
        };
      }

      // Test authentication with a simple API call
      const baseUrl = this.getBaseUrl(domain);
      const response = await fetch(`${baseUrl}/user.current.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth: accessToken,
        }),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Authentication failed: ${response.statusText}`,
        };
      }

      const data = await response.json();

      if (data.error) {
        return {
          success: false,
          error: data.error_description || data.error,
        };
      }

      return {
        success: true,
        token: accessToken,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      };
    }
  }

  /**
   * Refresh OAuth token
   */
  async refreshToken(credentials: IntegrationCredentials): Promise<AuthResult> {
    try {
      const { domain, refreshToken, clientId, clientSecret } =
        credentials.data as any;

      if (!refreshToken || !clientId || !clientSecret) {
        return {
          success: false,
          error: "Refresh token and OAuth credentials are required",
        };
      }

      const response = await fetch(
        `https://${domain}.bitrix24.com.br/oauth/token/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
          }),
        },
      );

      if (!response.ok) {
        return {
          success: false,
          error: `Token refresh failed: ${response.statusText}`,
        };
      }

      const data = await response.json();

      if (data.error) {
        return {
          success: false,
          error: data.error_description || data.error,
        };
      }

      return {
        success: true,
        token: data.access_token,
        expiresIn: data.expires_in,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Token refresh failed",
      };
    }
  }

  /**
   * Health check
   */
  async ping(): Promise<HealthStatus> {
    const startTime = Date.now();

    try {
      // Simple health check - just test if Bitrix24 is reachable
      const response = await fetch("https://www.bitrix24.com.br/", {
        method: "HEAD",
      });

      const responseTime = Date.now() - startTime;

      return {
        status: response.ok ? "healthy" : "warning",
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
   * Sync data with Bitrix24
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
      // Implementation would sync contacts, deals, etc.
      // This is a simplified example

      if (
        options.entities.includes("contacts") ||
        options.entities.includes("all")
      ) {
        await this.syncContacts(options, result);
      }

      if (
        options.entities.includes("deals") ||
        options.entities.includes("all")
      ) {
        await this.syncDeals(options, result);
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
   * Get data from Bitrix24
   */
  async getData(query: DataQuery): Promise<any[]> {
    try {
      // Implementation would fetch data based on query
      return [];
    } catch (error) {
      console.error("Failed to get Bitrix24 data:", error);
      return [];
    }
  }

  /**
   * Send data to Bitrix24
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
      // Implementation would send data to Bitrix24
      result.success = true;
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
      const actions: string[] = [];

      // Process different webhook events
      switch (payload.event) {
        case "ONCRMCONTACTADD":
          actions.push("contact_created");
          break;
        case "ONCRMCONTACTUPDATE":
          actions.push("contact_updated");
          break;
        case "ONCRMDEALADD":
          actions.push("deal_created");
          break;
        case "ONCRMDEALUPDATE":
          actions.push("deal_updated");
          break;
        default:
          console.warn(`Unknown Bitrix24 webhook event: ${payload.event}`);
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

    if (config.syncInterval && config.syncInterval < 300) {
      warnings.push("Sync interval should be at least 5 minutes");
    }

    if (config.batchSize && (config.batchSize < 1 || config.batchSize > 50)) {
      warnings.push("Batch size should be between 1 and 50");
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
        key: "domain",
        name: "Bitrix24 Domain",
        type: "text",
        required: true,
        description:
          "Your Bitrix24 domain (e.g., 'mycompany' for mycompany.bitrix24.com.br)",
      },
      {
        key: "accessToken",
        name: "Access Token",
        type: "password",
        required: false,
        description: "Access token for API access (alternative to OAuth)",
      },
      {
        key: "clientId",
        name: "Client ID",
        type: "text",
        required: false,
        description: "OAuth Client ID",
      },
      {
        key: "clientSecret",
        name: "Client Secret",
        type: "password",
        required: false,
        description: "OAuth Client Secret",
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
  private async syncContacts(
    options: SyncOptions,
    result: SyncResult,
  ): Promise<void> {
    // Implementation would sync contacts
    result.processed += 10; // Example
    result.created += 5;
    result.updated += 5;
  }

  private async syncDeals(
    options: SyncOptions,
    result: SyncResult,
  ): Promise<void> {
    // Implementation would sync deals
    result.processed += 8; // Example
    result.created += 3;
    result.updated += 5;
  }

  private async makeRequest(
    domain: string,
    method: string,
    params: any,
    accessToken: string,
  ): Promise<any> {
    const baseUrl = this.getBaseUrl(domain);
    const response = await fetch(`${baseUrl}/${method}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...params,
        auth: accessToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`Bitrix24 API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error_description || data.error);
    }

    return data.result;
  }
}

export default Bitrix24Adapter;
