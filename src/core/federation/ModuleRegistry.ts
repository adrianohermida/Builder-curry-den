/**
 * Module Registry - Sistema de Federação de Módulos
 *
 * Registro central para módulos independentes com comunicação
 * entre domínios via eventos e interfaces bem definidas.
 */

import { EventEmitter } from "events";
import type { ModuleDefinition, ModuleConfig, ModuleInterface } from "./types";

/**
 * Registry central para módulos do sistema
 */
export class ModuleRegistry extends EventEmitter {
  private modules = new Map<string, ModuleDefinition>();
  private moduleInstances = new Map<string, any>();
  private dependencies = new Map<string, string[]>();
  private loadingStates = new Map<string, "loading" | "loaded" | "error">();

  constructor() {
    super();
    this.setMaxListeners(100); // Aumenta limite para muitos módulos
  }

  /**
   * Registra um novo módulo no sistema
   */
  registerModule(definition: ModuleDefinition): void {
    const { id, name, version, dependencies = [] } = definition;

    if (this.modules.has(id)) {
      console.warn(`Module ${id} is already registered, overriding...`);
    }

    this.modules.set(id, definition);
    this.dependencies.set(id, dependencies);

    console.log(`Module registered: ${name} (${id}) v${version}`);
    this.emit("module:registered", { id, definition });
  }

  /**
   * Carrega um módulo e suas dependências
   */
  async loadModule(moduleId: string): Promise<any> {
    if (this.moduleInstances.has(moduleId)) {
      return this.moduleInstances.get(moduleId);
    }

    if (this.loadingStates.get(moduleId) === "loading") {
      // Aguarda o carregamento já em progresso
      return new Promise((resolve, reject) => {
        const handleLoaded = (loadedId: string) => {
          if (loadedId === moduleId) {
            this.off("module:loaded", handleLoaded);
            this.off("module:error", handleError);
            resolve(this.moduleInstances.get(moduleId));
          }
        };

        const handleError = (errorId: string, error: any) => {
          if (errorId === moduleId) {
            this.off("module:loaded", handleLoaded);
            this.off("module:error", handleError);
            reject(error);
          }
        };

        this.on("module:loaded", handleLoaded);
        this.on("module:error", handleError);
      });
    }

    this.loadingStates.set(moduleId, "loading");

    try {
      const definition = this.modules.get(moduleId);
      if (!definition) {
        throw new Error(`Module ${moduleId} not found in registry`);
      }

      // Carrega dependências primeiro
      await this.loadDependencies(moduleId);

      // Carrega o módulo
      const moduleFactory = definition.factory || definition.loader;
      if (!moduleFactory) {
        throw new Error(`Module ${moduleId} has no factory or loader`);
      }

      const moduleInstance = await moduleFactory();

      // Inicializa o módulo se tiver método init
      if (moduleInstance.init && typeof moduleInstance.init === "function") {
        await moduleInstance.init(this.getModuleContext(moduleId));
      }

      this.moduleInstances.set(moduleId, moduleInstance);
      this.loadingStates.set(moduleId, "loaded");

      console.log(`Module loaded: ${moduleId}`);
      this.emit("module:loaded", moduleId, moduleInstance);

      return moduleInstance;
    } catch (error) {
      this.loadingStates.set(moduleId, "error");
      console.error(`Failed to load module ${moduleId}:`, error);
      this.emit("module:error", moduleId, error);
      throw error;
    }
  }

  /**
   * Carrega as dependências de um módulo
   */
  private async loadDependencies(moduleId: string): Promise<void> {
    const deps = this.dependencies.get(moduleId) || [];

    const loadPromises = deps.map((depId) => this.loadModule(depId));
    await Promise.all(loadPromises);
  }

  /**
   * Obtém o contexto para inicialização do módulo
   */
  private getModuleContext(moduleId: string): ModuleInterface {
    return {
      moduleId,
      registry: this,
      config: this.getModuleConfig(moduleId),
      dependencies: this.getModuleDependencies(moduleId),
      events: {
        emit: (event: string, ...args: any[]) =>
          this.emit(`${moduleId}:${event}`, ...args),
        on: (event: string, listener: Function) =>
          this.on(`${moduleId}:${event}`, listener),
        off: (event: string, listener: Function) =>
          this.off(`${moduleId}:${event}`, listener),
      },
      communicate: (targetModule: string, message: any) =>
        this.communicateWithModule(moduleId, targetModule, message),
    };
  }

  /**
   * Comunicação entre módulos
   */
  private communicateWithModule(
    fromModule: string,
    toModule: string,
    message: any,
  ): void {
    this.emit(`communication:${toModule}`, {
      from: fromModule,
      to: toModule,
      message,
      timestamp: new Date(),
    });
  }

  /**
   * Obtém a configuração de um módulo
   */
  private getModuleConfig(moduleId: string): ModuleConfig {
    const definition = this.modules.get(moduleId);
    return definition?.config || {};
  }

  /**
   * Obtém as dependências carregadas de um módulo
   */
  private getModuleDependencies(moduleId: string): Record<string, any> {
    const deps = this.dependencies.get(moduleId) || [];
    const loadedDeps: Record<string, any> = {};

    deps.forEach((depId) => {
      const instance = this.moduleInstances.get(depId);
      if (instance) {
        loadedDeps[depId] = instance;
      }
    });

    return loadedDeps;
  }

  /**
   * Descarrega um módulo
   */
  async unloadModule(moduleId: string): Promise<void> {
    const instance = this.moduleInstances.get(moduleId);

    if (instance && instance.destroy) {
      await instance.destroy();
    }

    this.moduleInstances.delete(moduleId);
    this.loadingStates.delete(moduleId);

    console.log(`Module unloaded: ${moduleId}`);
    this.emit("module:unloaded", moduleId);
  }

  /**
   * Lista todos os módulos registrados
   */
  listModules(): ModuleDefinition[] {
    return Array.from(this.modules.values());
  }

  /**
   * Obtém um módulo carregado
   */
  getModule(moduleId: string): any {
    return this.moduleInstances.get(moduleId);
  }

  /**
   * Verifica se um módulo está carregado
   */
  isModuleLoaded(moduleId: string): boolean {
    return this.moduleInstances.has(moduleId);
  }

  /**
   * Obtém o estado de carregamento de um módulo
   */
  getLoadingState(
    moduleId: string,
  ): "loading" | "loaded" | "error" | "not-loaded" {
    return this.loadingStates.get(moduleId) || "not-loaded";
  }

  /**
   * Obtém estatísticas do registry
   */
  getStats() {
    return {
      totalModules: this.modules.size,
      loadedModules: this.moduleInstances.size,
      loadingModules: Array.from(this.loadingStates.values()).filter(
        (state) => state === "loading",
      ).length,
      errorModules: Array.from(this.loadingStates.values()).filter(
        (state) => state === "error",
      ).length,
      modules: Array.from(this.modules.entries()).map(([id, def]) => ({
        id,
        name: def.name,
        version: def.version,
        state: this.getLoadingState(id),
        dependencies: this.dependencies.get(id) || [],
      })),
    };
  }

  /**
   * Valida dependências circulares
   */
  validateDependencies(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCyclicDependency = (moduleId: string): boolean => {
      if (recursionStack.has(moduleId)) {
        errors.push(
          `Circular dependency detected involving module: ${moduleId}`,
        );
        return true;
      }

      if (visited.has(moduleId)) {
        return false;
      }

      visited.add(moduleId);
      recursionStack.add(moduleId);

      const deps = this.dependencies.get(moduleId) || [];
      for (const dep of deps) {
        if (!this.modules.has(dep)) {
          errors.push(
            `Module ${moduleId} depends on non-existent module: ${dep}`,
          );
          continue;
        }

        if (hasCyclicDependency(dep)) {
          return true;
        }
      }

      recursionStack.delete(moduleId);
      return false;
    };

    for (const moduleId of this.modules.keys()) {
      if (!visited.has(moduleId)) {
        hasCyclicDependency(moduleId);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Recarrega um módulo
   */
  async reloadModule(moduleId: string): Promise<any> {
    await this.unloadModule(moduleId);
    return this.loadModule(moduleId);
  }

  /**
   * Carrega todos os módulos registrados
   */
  async loadAllModules(): Promise<void> {
    const loadPromises = Array.from(this.modules.keys()).map((id) =>
      this.loadModule(id).catch((error) =>
        console.error(`Failed to load module ${id}:`, error),
      ),
    );

    await Promise.allSettled(loadPromises);
  }
}

// Instância singleton do registry
export const moduleRegistry = new ModuleRegistry();

// Helper para registrar módulos
export const registerDomain = (definition: ModuleDefinition) => {
  moduleRegistry.registerModule(definition);
};

// Helper para comunicação entre domínios
export const communicateBetweenDomains = (
  fromDomain: string,
  toDomain: string,
  event: string,
  data?: any,
) => {
  moduleRegistry.emit(`communication:${toDomain}`, {
    from: fromDomain,
    to: toDomain,
    event,
    data,
    timestamp: new Date(),
  });
};

export default ModuleRegistry;
