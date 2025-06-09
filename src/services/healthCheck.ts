/**
 * 🏥 Sistema de Health Check Automático - Lawdesk CRM v2.5.0
 *
 * Monitora automaticamente:
 * - Status dos módulos
 * - Conectividade das APIs
 * - Saúde do sistema
 * - Disponibilidade dos serviços
 *
 * @version 2.5.0
 * @since 2025-01-21
 */

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  responseTime: number;
  lastCheck: Date;
  error?: string;
}

interface ModuleHealth {
  name: string;
  status: HealthStatus;
  dependencies: string[];
  criticalLevel: "low" | "medium" | "high" | "critical";
}

interface SystemHealth {
  overall: "healthy" | "degraded" | "unhealthy";
  modules: ModuleHealth[];
  apis: Record<string, HealthStatus>;
  uptime: number;
  lastFullCheck: Date;
}

class HealthChecker {
  private healthData: SystemHealth = {
    overall: "healthy",
    modules: [],
    apis: {},
    uptime: 0,
    lastFullCheck: new Date(),
  };

  private checkInterval: NodeJS.Timeout | null = null;
  private startTime = Date.now();

  // Configuração dos módulos a serem monitorados
  private readonly modules: Array<Omit<ModuleHealth, "status">> = [
    {
      name: "CRM",
      dependencies: ["supabase", "advise"],
      criticalLevel: "critical",
    },
    {
      name: "GED",
      dependencies: ["supabase", "storage"],
      criticalLevel: "high",
    },
    {
      name: "Processos",
      dependencies: ["advise", "tjsp", "cnj"],
      criticalLevel: "critical",
    },
    {
      name: "Financeiro",
      dependencies: ["stripe", "supabase"],
      criticalLevel: "high",
    },
    {
      name: "Tarefas",
      dependencies: ["supabase"],
      criticalLevel: "medium",
    },
    {
      name: "Publicações",
      dependencies: ["dje-scraper", "tribunais"],
      criticalLevel: "high",
    },
    {
      name: "IA",
      dependencies: ["openai", "supabase"],
      criticalLevel: "medium",
    },
    {
      name: "Atendimento",
      dependencies: ["websocket", "supabase"],
      criticalLevel: "medium",
    },
    {
      name: "Calendário",
      dependencies: ["supabase"],
      criticalLevel: "low",
    },
    {
      name: "Admin",
      dependencies: ["supabase", "metrics"],
      criticalLevel: "medium",
    },
    {
      name: "Mobile",
      dependencies: ["pwa", "offline-cache"],
      criticalLevel: "high",
    },
  ];

  // Endpoints para verificação de saúde das APIs
  private readonly apiEndpoints = {
    supabase: "/api/health/supabase",
    stripe: "/api/health/stripe",
    advise: "/api/health/advise",
    tjsp: "https://esaj.tjsp.jus.br/cjsg/health",
    cnj: "/api/health/cnj",
    openai: "/api/health/openai",
    storage: "/api/health/storage",
    websocket: "/api/health/websocket",
    metrics: "/api/health/metrics",
    "dje-scraper": "/api/health/dje",
    tribunais: "/api/health/tribunais",
    pwa: "/manifest.json",
    "offline-cache": "/api/health/cache",
  };

  /**
   * 🚀 Inicia o monitoramento de saúde
   */
  public startHealthMonitoring(): void {
    if (this.checkInterval) return;

    // Check inicial
    this.performFullHealthCheck();

    // Check a cada 2 minutos
    this.checkInterval = setInterval(() => {
      this.performFullHealthCheck();
    }, 120000);

    if (process.env.NODE_ENV === "development") {
      console.log("🏥 Health Check Monitor iniciado");
    }
  }

  /**
   * 🔍 Executa verificação completa de saúde
   */
  public async performFullHealthCheck(): Promise<SystemHealth> {
    const startTime = performance.now();

    try {
      // Verifica APIs em paralelo
      const apiChecks = Object.entries(this.apiEndpoints).map(
        ([name, endpoint]) => this.checkAPIHealth(name, endpoint),
      );

      const apiResults = await Promise.allSettled(apiChecks);

      // Processa resultados das APIs
      apiResults.forEach((result, index) => {
        const apiName = Object.keys(this.apiEndpoints)[index];
        if (result.status === "fulfilled") {
          this.healthData.apis[apiName] = result.value;
        } else {
          this.healthData.apis[apiName] = {
            status: "unhealthy",
            responseTime: -1,
            lastCheck: new Date(),
            error: result.reason?.message || "Check failed",
          };
        }
      });

      // Verifica saúde dos módulos
      this.healthData.modules = await Promise.all(
        this.modules.map((module) => this.checkModuleHealth(module)),
      );

      // Calcula saúde geral
      this.healthData.overall = this.calculateOverallHealth();
      this.healthData.uptime = Date.now() - this.startTime;
      this.healthData.lastFullCheck = new Date();

      const checkDuration = performance.now() - startTime;

      if (process.env.NODE_ENV === "development") {
        console.log(
          `🏥 Health check completed in ${checkDuration.toFixed(2)}ms`,
          {
            overall: this.healthData.overall,
            unhealthyModules: this.healthData.modules.filter(
              (m) => m.status.status !== "healthy",
            ).length,
            unhealthyAPIs: Object.values(this.healthData.apis).filter(
              (api) => api.status !== "healthy",
            ).length,
          },
        );
      }

      // Envia alerta se sistema degradado
      if (this.healthData.overall !== "healthy") {
        this.sendHealthAlert();
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("🏥 Erro no health check:", error);
      }
    }

    return this.healthData;
  }

  /**
   * 🌐 Verifica saúde de uma API
   */
  private async checkAPIHealth(
    name: string,
    endpoint: string,
  ): Promise<HealthStatus> {
    const startTime = performance.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(endpoint, {
        method: "HEAD", // Usar HEAD para não carregar dados desnecessários
        signal: controller.signal,
        cache: "no-cache",
      });

      clearTimeout(timeoutId);
      const responseTime = performance.now() - startTime;

      const status: HealthStatus["status"] = response.ok
        ? responseTime > 3000
          ? "degraded"
          : "healthy"
        : "unhealthy";

      return {
        status,
        responseTime,
        lastCheck: new Date(),
        error: response.ok ? undefined : `HTTP ${response.status}`,
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;

      return {
        status: "unhealthy",
        responseTime,
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * 📦 Verifica saúde de um módulo
   */
  private async checkModuleHealth(
    module: Omit<ModuleHealth, "status">,
  ): Promise<ModuleHealth> {
    const dependencyStatuses = module.dependencies.map(
      (dep) => this.healthData.apis[dep]?.status || "unhealthy",
    );

    // Calcula saúde baseada nas dependências
    const healthyDeps = dependencyStatuses.filter(
      (status) => status === "healthy",
    ).length;
    const totalDeps = dependencyStatuses.length;

    let status: HealthStatus["status"];
    if (healthyDeps === totalDeps) {
      status = "healthy";
    } else if (healthyDeps >= totalDeps * 0.7) {
      status = "degraded";
    } else {
      status = "unhealthy";
    }

    const avgResponseTime =
      module.dependencies.reduce((sum, dep) => {
        const apiHealth = this.healthData.apis[dep];
        return sum + (apiHealth?.responseTime || 0);
      }, 0) / module.dependencies.length;

    return {
      ...module,
      status: {
        status,
        responseTime: avgResponseTime,
        lastCheck: new Date(),
        error:
          status === "unhealthy"
            ? "One or more dependencies are unhealthy"
            : undefined,
      },
    };
  }

  /**
   * 🎯 Calcula saúde geral do sistema
   */
  private calculateOverallHealth(): SystemHealth["overall"] {
    const criticalModules = this.healthData.modules.filter(
      (m) => m.criticalLevel === "critical",
    );

    const highPriorityModules = this.healthData.modules.filter(
      (m) => m.criticalLevel === "high",
    );

    // Se algum módulo crítico está unhealthy, sistema está unhealthy
    const unhealthyCritical = criticalModules.filter(
      (m) => m.status.status === "unhealthy",
    );
    if (unhealthyCritical.length > 0) {
      return "unhealthy";
    }

    // Se módulos críticos degraded ou alta prioridade unhealthy, sistema degraded
    const degradedCritical = criticalModules.filter(
      (m) => m.status.status === "degraded",
    );
    const unhealthyHigh = highPriorityModules.filter(
      (m) => m.status.status === "unhealthy",
    );

    if (degradedCritical.length > 0 || unhealthyHigh.length > 1) {
      return "degraded";
    }

    // Caso contrário, sistema saudável
    return "healthy";
  }

  /**
   * 🚨 Envia alerta de saúde
   */
  private async sendHealthAlert(): Promise<void> {
    const alert = {
      type: "health_alert",
      severity:
        this.healthData.overall === "unhealthy" ? "critical" : "warning",
      timestamp: new Date(),
      details: {
        overall: this.healthData.overall,
        unhealthyModules: this.healthData.modules
          .filter((m) => m.status.status === "unhealthy")
          .map((m) => ({ name: m.name, error: m.status.error })),
        degradedModules: this.healthData.modules
          .filter((m) => m.status.status === "degraded")
          .map((m) => ({ name: m.name, responseTime: m.status.responseTime })),
      },
    };

    if (process.env.NODE_ENV === "development") {
      console.warn("🚨 Health Alert:", alert);
    }

    // Em produção, enviar para sistema de alertas
    if (process.env.NODE_ENV === "production") {
      try {
        await fetch("/api/alerts/health", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(alert),
        });
      } catch (error) {
        // Fallback silencioso
      }
    }
  }

  /**
   * 📊 Gera relatório detalhado de saúde
   */
  public generateHealthReport(): {
    summary: string;
    details: SystemHealth;
    recommendations: string[];
  } {
    const recommendations: string[] = [];

    // Analisa módulos com problemas
    const unhealthyModules = this.healthData.modules.filter(
      (m) => m.status.status === "unhealthy",
    );
    const degradedModules = this.healthData.modules.filter(
      (m) => m.status.status === "degraded",
    );

    if (unhealthyModules.length > 0) {
      recommendations.push(
        `Verificar imediatamente: ${unhealthyModules.map((m) => m.name).join(", ")}`,
      );
    }

    if (degradedModules.length > 0) {
      recommendations.push(
        `Monitorar de perto: ${degradedModules.map((m) => m.name).join(", ")}`,
      );
    }

    // Analisa APIs com problemas
    const slowAPIs = Object.entries(this.healthData.apis)
      .filter(([_, health]) => health.responseTime > 2000)
      .map(([name]) => name);

    if (slowAPIs.length > 0) {
      recommendations.push(`Otimizar performance: ${slowAPIs.join(", ")}`);
    }

    const summary =
      this.healthData.overall === "healthy"
        ? "✅ Sistema operando normalmente"
        : this.healthData.overall === "degraded"
          ? "⚠️ Sistema com performance reduzida"
          : "🚨 Sistema com problemas críticos";

    return {
      summary,
      details: this.healthData,
      recommendations,
    };
  }

  /**
   * 🔍 Verifica saúde de um módulo específico
   */
  public async checkSpecificModule(
    moduleName: string,
  ): Promise<ModuleHealth | null> {
    const module = this.modules.find((m) => m.name === moduleName);
    if (!module) return null;

    return await this.checkModuleHealth(module);
  }

  /**
   * 🛑 Para o monitoramento
   */
  public stopHealthMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * 📊 Getter para dados de saúde atuais
   */
  public getHealthData(): SystemHealth {
    return { ...this.healthData };
  }

  /**
   * ⏱️ Getter para uptime formatado
   */
  public getUptimeFormatted(): string {
    const uptimeMs = Date.now() - this.startTime;
    const hours = Math.floor(uptimeMs / (1000 * 60 * 60));
    const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  }
}

// Singleton instance
export const healthChecker = new HealthChecker();

// Auto-start
if (typeof window !== "undefined") {
  healthChecker.startHealthMonitoring();
}

export type { HealthStatus, ModuleHealth, SystemHealth };
