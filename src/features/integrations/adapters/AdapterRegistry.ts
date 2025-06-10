/**
 * Adapter Registry
 *
 * Central registry for managing integration adapters.
 * Provides a unified interface for registering and accessing adapters.
 */

import type { IntegrationAdapter, IntegrationProvider } from "../types";

// Import built-in adapters
import { ZapsignAdapter } from "./zapsign/ZapsignAdapter";
import { Bitrix24Adapter } from "./bitrix24/Bitrix24Adapter";
import { RDStationAdapter } from "./rdstation/RDStationAdapter";

/**
 * Adapter registry class
 */
export class AdapterRegistry {
  private adapters: Map<IntegrationProvider, IntegrationAdapter> = new Map();

  constructor() {
    this.registerBuiltInAdapters();
  }

  /**
   * Register built-in adapters
   */
  private registerBuiltInAdapters(): void {
    this.register(new ZapsignAdapter());
    this.register(new Bitrix24Adapter());
    this.register(new RDStationAdapter());
  }

  /**
   * Register an adapter
   */
  register(adapter: IntegrationAdapter): void {
    if (this.adapters.has(adapter.provider)) {
      console.warn(
        `Adapter for ${adapter.provider} already registered, overriding...`,
      );
    }

    this.adapters.set(adapter.provider, adapter);
    console.log(
      `Registered adapter for ${adapter.provider} v${adapter.version}`,
    );
  }

  /**
   * Unregister an adapter
   */
  unregister(provider: IntegrationProvider): boolean {
    return this.adapters.delete(provider);
  }

  /**
   * Get adapter by provider
   */
  getAdapter(provider: IntegrationProvider): IntegrationAdapter | null {
    return this.adapters.get(provider) || null;
  }

  /**
   * Get all registered providers
   */
  getRegisteredProviders(): IntegrationProvider[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * Get all registered adapters
   */
  getAllAdapters(): IntegrationAdapter[] {
    return Array.from(this.adapters.values());
  }

  /**
   * Check if provider is supported
   */
  isSupported(provider: IntegrationProvider): boolean {
    return this.adapters.has(provider);
  }

  /**
   * Get adapter information
   */
  getAdapterInfo(provider: IntegrationProvider) {
    const adapter = this.getAdapter(provider);
    if (!adapter) {
      return null;
    }

    return {
      provider: adapter.provider,
      name: adapter.name,
      version: adapter.version,
      features: adapter.features,
      requiredCredentials: adapter.getRequiredCredentials(),
      availableFeatures: adapter.getAvailableFeatures(),
    };
  }

  /**
   * Get adapters by feature
   */
  getAdaptersByFeature(feature: string): IntegrationAdapter[] {
    return this.getAllAdapters().filter((adapter) =>
      adapter.features.includes(feature as any),
    );
  }

  /**
   * Validate all registered adapters
   */
  validateAdapters(): {
    valid: IntegrationProvider[];
    invalid: { provider: IntegrationProvider; error: string }[];
  } {
    const valid: IntegrationProvider[] = [];
    const invalid: { provider: IntegrationProvider; error: string }[] = [];

    for (const adapter of this.getAllAdapters()) {
      try {
        // Basic validation
        if (!adapter.provider || !adapter.name || !adapter.version) {
          throw new Error("Missing required adapter properties");
        }

        if (
          !adapter.authenticate ||
          typeof adapter.authenticate !== "function"
        ) {
          throw new Error("Missing authenticate method");
        }

        if (!adapter.ping || typeof adapter.ping !== "function") {
          throw new Error("Missing ping method");
        }

        if (!adapter.getStatus || typeof adapter.getStatus !== "function") {
          throw new Error("Missing getStatus method");
        }

        valid.push(adapter.provider);
      } catch (error) {
        invalid.push({
          provider: adapter.provider,
          error:
            error instanceof Error ? error.message : "Unknown validation error",
        });
      }
    }

    return { valid, invalid };
  }

  /**
   * Get registry statistics
   */
  getStats() {
    const adapters = this.getAllAdapters();
    const features = new Set<string>();
    const providers = new Set<IntegrationProvider>();

    adapters.forEach((adapter) => {
      providers.add(adapter.provider);
      adapter.features.forEach((feature) => features.add(feature));
    });

    return {
      totalAdapters: adapters.length,
      providers: Array.from(providers),
      features: Array.from(features),
      adaptersByProvider: Object.fromEntries(
        Array.from(providers).map((provider) => [
          provider,
          this.getAdapterInfo(provider),
        ]),
      ),
    };
  }
}

// Default registry instance
export const adapterRegistry = new AdapterRegistry();

export default AdapterRegistry;
