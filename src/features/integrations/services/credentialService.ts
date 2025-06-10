/**
 * Credential Service
 *
 * Secure service for managing integration credentials with encryption,
 * token refresh, and secure storage.
 */

import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/config/api";
import type {
  IntegrationCredentials,
  EncryptedCredentialData,
  PlainCredentialData,
  AuthResult,
} from "../types";

/**
 * Encryption utility class
 */
class EncryptionUtil {
  private readonly algorithm = "aes-256-gcm";
  private readonly keyLength = 32;

  /**
   * Get encryption key from environment
   */
  private getEncryptionKey(): string {
    const key = import.meta.env.VITE_INTEGRATION_ENCRYPTION_KEY;
    if (!key) {
      throw new Error("Integration encryption key not configured");
    }
    return key;
  }

  /**
   * Encrypt sensitive data
   */
  async encrypt(data: any): Promise<EncryptedCredentialData> {
    try {
      // In a real implementation, use Web Crypto API or a proper encryption library
      // This is a simplified example - in production, use proper encryption
      const jsonData = JSON.stringify(data);
      const encoder = new TextEncoder();
      const dataBytes = encoder.encode(jsonData);

      // Generate random IV
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // Get encryption key
      const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(this.getEncryptionKey()),
        "PBKDF2",
        false,
        ["deriveKey"],
      );

      const key = await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: encoder.encode("lawdesk-integrations"),
          iterations: 100000,
          hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt"],
      );

      // Encrypt data
      const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        dataBytes,
      );

      return {
        encrypted: true,
        data: Array.from(new Uint8Array(encrypted))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(""),
        algorithm: this.algorithm,
        iv: Array.from(iv)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(""),
      };
    } catch (error) {
      console.error("Encryption failed:", error);
      throw new Error("Failed to encrypt credentials");
    }
  }

  /**
   * Decrypt sensitive data
   */
  async decrypt(encryptedData: EncryptedCredentialData): Promise<any> {
    try {
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      // Convert hex strings back to Uint8Array
      const iv = new Uint8Array(
        encryptedData.iv.match(/.{2}/g)!.map((byte) => parseInt(byte, 16)),
      );
      const data = new Uint8Array(
        encryptedData.data.match(/.{2}/g)!.map((byte) => parseInt(byte, 16)),
      );

      // Get encryption key
      const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(this.getEncryptionKey()),
        "PBKDF2",
        false,
        ["deriveKey"],
      );

      const key = await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: encoder.encode("lawdesk-integrations"),
          iterations: 100000,
          hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"],
      );

      // Decrypt data
      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        data,
      );

      const jsonString = decoder.decode(decrypted);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Decryption failed:", error);
      throw new Error("Failed to decrypt credentials");
    }
  }
}

/**
 * Credential service class
 */
export class CredentialService {
  private encryption: EncryptionUtil;

  constructor() {
    this.encryption = new EncryptionUtil();
  }

  /**
   * Encrypt credentials for storage
   */
  async encrypt(
    credentials: Omit<IntegrationCredentials, "id">,
  ): Promise<IntegrationCredentials> {
    try {
      if (credentials.encrypted) {
        return credentials as IntegrationCredentials;
      }

      const encryptedData = await this.encryption.encrypt(credentials.data);

      return {
        ...credentials,
        id: crypto.randomUUID(),
        encrypted: true,
        data: encryptedData,
      };
    } catch (error) {
      console.error("Failed to encrypt credentials:", error);
      throw new Error("Credential encryption failed");
    }
  }

  /**
   * Decrypt credentials for use
   */
  async decrypt(
    credentials: IntegrationCredentials,
  ): Promise<IntegrationCredentials> {
    try {
      if (!credentials.encrypted) {
        return credentials;
      }

      const decryptedData = await this.encryption.decrypt(
        credentials.data as EncryptedCredentialData,
      );

      return {
        ...credentials,
        encrypted: false,
        data: decryptedData,
      };
    } catch (error) {
      console.error("Failed to decrypt credentials:", error);
      throw new Error("Credential decryption failed");
    }
  }

  /**
   * Validate credentials by testing authentication
   */
  async validateCredentials(
    credentials: IntegrationCredentials,
    provider: string,
  ): Promise<AuthResult> {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.INTEGRATIONS.VALIDATE}`,
        {
          provider,
          credentials,
        },
      );

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Validation failed",
      };
    }
  }

  /**
   * Refresh OAuth tokens
   */
  async refreshTokens(
    credentials: IntegrationCredentials,
    provider: string,
  ): Promise<IntegrationCredentials> {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.INTEGRATIONS.REFRESH_TOKEN}`,
        {
          provider,
          credentials,
        },
      );

      // Re-encrypt the new tokens
      return await this.encrypt(response);
    } catch (error) {
      console.error("Failed to refresh tokens:", error);
      throw new Error("Token refresh failed");
    }
  }

  /**
   * Securely store credentials in backend
   */
  async storeCredentials(
    integrationId: string,
    credentials: IntegrationCredentials,
  ): Promise<void> {
    try {
      const encryptedCredentials = await this.encrypt(credentials);

      await apiClient.put(
        `${API_ENDPOINTS.INTEGRATIONS.BASE}/${integrationId}/credentials`,
        encryptedCredentials,
      );
    } catch (error) {
      console.error("Failed to store credentials:", error);
      throw new Error("Credential storage failed");
    }
  }

  /**
   * Retrieve credentials from backend
   */
  async retrieveCredentials(
    integrationId: string,
  ): Promise<IntegrationCredentials> {
    try {
      const encryptedCredentials = await apiClient.get(
        `${API_ENDPOINTS.INTEGRATIONS.BASE}/${integrationId}/credentials`,
      );

      return await this.decrypt(encryptedCredentials);
    } catch (error) {
      console.error("Failed to retrieve credentials:", error);
      throw new Error("Credential retrieval failed");
    }
  }

  /**
   * Delete credentials from backend
   */
  async deleteCredentials(integrationId: string): Promise<void> {
    try {
      await apiClient.delete(
        `${API_ENDPOINTS.INTEGRATIONS.BASE}/${integrationId}/credentials`,
      );
    } catch (error) {
      console.error("Failed to delete credentials:", error);
      throw new Error("Credential deletion failed");
    }
  }

  /**
   * Check if credentials are expired
   */
  isExpired(credentials: IntegrationCredentials): boolean {
    if (!credentials.expiresAt) {
      return false;
    }

    const expiryDate = new Date(credentials.expiresAt);
    const now = new Date();

    // Add 5-minute buffer before expiry
    const bufferTime = 5 * 60 * 1000;
    return expiryDate.getTime() - bufferTime <= now.getTime();
  }

  /**
   * Get credentials with automatic refresh if needed
   */
  async getValidCredentials(
    integrationId: string,
    provider: string,
  ): Promise<IntegrationCredentials> {
    try {
      let credentials = await this.retrieveCredentials(integrationId);

      // Check if credentials are expired and refresh if needed
      if (this.isExpired(credentials) && credentials.type === "oauth2") {
        console.log("Credentials expired, refreshing...");
        credentials = await this.refreshTokens(credentials, provider);
        await this.storeCredentials(integrationId, credentials);
      }

      return credentials;
    } catch (error) {
      console.error("Failed to get valid credentials:", error);
      throw new Error("Unable to obtain valid credentials");
    }
  }
}

export default CredentialService;
