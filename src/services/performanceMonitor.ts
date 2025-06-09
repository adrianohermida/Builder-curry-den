/**
 * 🚀 Sistema de Monitoramento de Performance - Lawdesk CRM v2.5.0
 *
 * Monitora automaticamente:
 * - Core Web Vitals
 * - Bundle size
 * - API response times
 * - Error rates
 * - User interactions
 *
 * @version 2.5.0
 * @since 2025-01-21
 */

interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  bundleSize: number;
  errorRate: number;
  apiResponseTime: number;
  userSatisfaction: number;
}

interface PerformanceAlert {
  id: string;
  type: "warning" | "critical" | "info";
  metric: keyof PerformanceMetrics;
  value: number;
  threshold: number;
  timestamp: Date;
  resolved: boolean;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    bundleSize: 0,
    errorRate: 0,
    apiResponseTime: 0,
    userSatisfaction: 0,
  };

  private alerts: PerformanceAlert[] = [];
  private observers: PerformanceObserver[] = [];
  private isMonitoring = false;

  // Thresholds para alertas
  private readonly thresholds = {
    lcp: 2500, // 2.5s
    fid: 100, // 100ms
    cls: 0.1, // 0.1
    ttfb: 800, // 800ms
    bundleSize: 3000000, // 3MB
    errorRate: 0.05, // 5%
    apiResponseTime: 2000, // 2s
    userSatisfaction: 0.8, // 80%
  };

  /**
   * 🚀 Inicia o monitoramento de performance
   */
  public startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.initCoreWebVitals();
    this.initAPIMonitoring();
    this.initErrorTracking();
    this.initUserExperienceTracking();

    // Auto-report a cada 5 minutos
    setInterval(() => {
      this.generateReport();
    }, 300000);

    if (process.env.NODE_ENV === "development") {
      console.log("🚀 Performance Monitor iniciado");
    }
  }

  /**
   * 📊 Monitora Core Web Vitals
   */
  private initCoreWebVitals(): void {
    // Largest Contentful Paint
    if ("PerformanceObserver" in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.lcp = lastEntry.startTime;
        this.checkThreshold("lcp", lastEntry.startTime);
      });

      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      this.observers.push(lcpObserver);
    }

    // First Input Delay
    if ("PerformanceObserver" in window) {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
          this.checkThreshold("fid", this.metrics.fid);
        });
      });

      fidObserver.observe({ entryTypes: ["first-input"] });
      this.observers.push(fidObserver);
    }

    // Cumulative Layout Shift
    if ("PerformanceObserver" in window) {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();

        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        this.metrics.cls = clsValue;
        this.checkThreshold("cls", clsValue);
      });

      clsObserver.observe({ entryTypes: ["layout-shift"] });
      this.observers.push(clsObserver);
    }

    // Time to First Byte
    window.addEventListener("load", () => {
      const navTiming = performance.getEntriesByType("navigation")[0] as any;
      this.metrics.ttfb = navTiming.responseStart - navTiming.requestStart;
      this.checkThreshold("ttfb", this.metrics.ttfb);
    });
  }

  /**
   * 🌐 Monitora APIs
   */
  private initAPIMonitoring(): void {
    const originalFetch = window.fetch;
    let totalRequests = 0;
    let totalResponseTime = 0;
    let errorCount = 0;

    window.fetch = async (...args) => {
      const startTime = performance.now();
      totalRequests++;

      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const responseTime = endTime - startTime;

        totalResponseTime += responseTime;
        this.metrics.apiResponseTime = totalResponseTime / totalRequests;

        if (!response.ok) {
          errorCount++;
        }

        this.metrics.errorRate = errorCount / totalRequests;

        this.checkThreshold("apiResponseTime", this.metrics.apiResponseTime);
        this.checkThreshold("errorRate", this.metrics.errorRate);

        return response;
      } catch (error) {
        errorCount++;
        this.metrics.errorRate = errorCount / totalRequests;
        this.checkThreshold("errorRate", this.metrics.errorRate);
        throw error;
      }
    };
  }

  /**
   * 🛡️ Monitora erros globais
   */
  private initErrorTracking(): void {
    window.addEventListener("error", (event) => {
      this.recordError("javascript", event.error?.message || "Unknown error");
    });

    window.addEventListener("unhandledrejection", (event) => {
      this.recordError(
        "promise",
        event.reason?.message || "Unhandled promise rejection",
      );
    });
  }

  /**
   * 👤 Monitora experiência do usuário
   */
  private initUserExperienceTracking(): void {
    let interactionCount = 0;
    let positiveInteractions = 0;

    // Monitora cliques e interações
    ["click", "keydown", "scroll"].forEach((eventType) => {
      document.addEventListener(eventType, () => {
        interactionCount++;

        // Considera interação positiva se não houver delay perceptível
        if (this.metrics.fid < 100) {
          positiveInteractions++;
        }

        this.metrics.userSatisfaction = positiveInteractions / interactionCount;
        this.checkThreshold("userSatisfaction", this.metrics.userSatisfaction);
      });
    });
  }

  /**
   * ⚠️ Verifica thresholds e gera alertas
   */
  private checkThreshold(
    metric: keyof PerformanceMetrics,
    value: number,
  ): void {
    const threshold = this.thresholds[metric];
    let alertType: "warning" | "critical" | "info" = "info";

    // Determina o tipo de alerta baseado na métrica
    if (metric === "userSatisfaction") {
      if (value < threshold * 0.7) alertType = "critical";
      else if (value < threshold) alertType = "warning";
    } else {
      if (value > threshold * 1.5) alertType = "critical";
      else if (value > threshold) alertType = "warning";
    }

    if (alertType !== "info") {
      this.createAlert(metric, value, threshold, alertType);
    }
  }

  /**
   * 🚨 Cria alerta de performance
   */
  private createAlert(
    metric: keyof PerformanceMetrics,
    value: number,
    threshold: number,
    type: "warning" | "critical",
  ): void {
    const alert: PerformanceAlert = {
      id: `${metric}-${Date.now()}`,
      type,
      metric,
      value,
      threshold,
      timestamp: new Date(),
      resolved: false,
    };

    this.alerts.push(alert);

    // Log apenas em desenvolvimento
    if (process.env.NODE_ENV === "development") {
      console.warn(`⚠️ Performance Alert [${type.toUpperCase()}]:`, alert);
    }

    // Em produção, enviar para serviço de monitoramento
    if (process.env.NODE_ENV === "production") {
      this.sendAlertToMonitoringService(alert);
    }
  }

  /**
   * 📝 Registra erro
   */
  private recordError(type: string, message: string): void {
    if (process.env.NODE_ENV === "development") {
      console.error(`🛡️ Error tracked [${type}]:`, message);
    }

    // Em produção, enviar para serviço de error tracking
    if (process.env.NODE_ENV === "production") {
      this.sendErrorToTrackingService(type, message);
    }
  }

  /**
   * 📊 Gera relatório de performance
   */
  public generateReport(): PerformanceReport {
    const report: PerformanceReport = {
      timestamp: new Date(),
      metrics: { ...this.metrics },
      alerts: this.alerts.filter((alert) => !alert.resolved),
      grade: this.calculateGrade(),
      recommendations: this.generateRecommendations(),
    };

    if (process.env.NODE_ENV === "development") {
      console.log("📊 Performance Report:", report);
    }

    return report;
  }

  /**
   * 🎯 Calcula nota geral de performance
   */
  private calculateGrade(): "A" | "B" | "C" | "D" | "F" {
    const scores = {
      lcp:
        this.metrics.lcp <= 2500
          ? 100
          : Math.max(0, 100 - (this.metrics.lcp - 2500) / 25),
      fid: this.metrics.fid <= 100 ? 100 : Math.max(0, 100 - this.metrics.fid),
      cls:
        this.metrics.cls <= 0.1
          ? 100
          : Math.max(0, 100 - (this.metrics.cls - 0.1) * 1000),
      ttfb:
        this.metrics.ttfb <= 800
          ? 100
          : Math.max(0, 100 - (this.metrics.ttfb - 800) / 10),
      apiResponseTime:
        this.metrics.apiResponseTime <= 1000
          ? 100
          : Math.max(0, 100 - (this.metrics.apiResponseTime - 1000) / 20),
      errorRate:
        this.metrics.errorRate <= 0.01
          ? 100
          : Math.max(0, 100 - this.metrics.errorRate * 1000),
      userSatisfaction: this.metrics.userSatisfaction * 100,
    };

    const averageScore =
      Object.values(scores).reduce((a, b) => a + b) /
      Object.keys(scores).length;

    if (averageScore >= 90) return "A";
    if (averageScore >= 80) return "B";
    if (averageScore >= 70) return "C";
    if (averageScore >= 60) return "D";
    return "F";
  }

  /**
   * 💡 Gera recomendações de melhoria
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.metrics.lcp > 2500) {
      recommendations.push("Otimizar imagens e lazy loading para melhorar LCP");
    }

    if (this.metrics.fid > 100) {
      recommendations.push("Reduzir JavaScript blocking para melhorar FID");
    }

    if (this.metrics.cls > 0.1) {
      recommendations.push(
        "Adicionar dimensões às imagens para evitar layout shift",
      );
    }

    if (this.metrics.apiResponseTime > 1500) {
      recommendations.push("Implementar cache de API e otimizar endpoints");
    }

    if (this.metrics.errorRate > 0.03) {
      recommendations.push("Revisar error handling e melhorar validações");
    }

    return recommendations;
  }

  /**
   * 📤 Envia alerta para serviço de monitoramento (mock)
   */
  private async sendAlertToMonitoringService(
    alert: PerformanceAlert,
  ): Promise<void> {
    // Em produção, integrar com serviços como DataDog, New Relic, etc.
    try {
      await fetch("/api/monitoring/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alert),
      });
    } catch (error) {
      // Fallback silencioso
    }
  }

  /**
   * 📤 Envia erro para serviço de tracking (mock)
   */
  private async sendErrorToTrackingService(
    type: string,
    message: string,
  ): Promise<void> {
    // Em produção, integrar com serviços como Sentry, Bugsnag, etc.
    try {
      await fetch("/api/error-tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, message, timestamp: new Date() }),
      });
    } catch (error) {
      // Fallback silencioso
    }
  }

  /**
   * 🛑 Para o monitoramento
   */
  public stopMonitoring(): void {
    this.isMonitoring = false;
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }

  /**
   * 📊 Getter para métricas atuais
   */
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * 🚨 Getter para alertas ativos
   */
  public getActiveAlerts(): PerformanceAlert[] {
    return this.alerts.filter((alert) => !alert.resolved);
  }
}

interface PerformanceReport {
  timestamp: Date;
  metrics: PerformanceMetrics;
  alerts: PerformanceAlert[];
  grade: "A" | "B" | "C" | "D" | "F";
  recommendations: string[];
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-start em produção
if (typeof window !== "undefined") {
  performanceMonitor.startMonitoring();
}

export type { PerformanceMetrics, PerformanceAlert, PerformanceReport };
