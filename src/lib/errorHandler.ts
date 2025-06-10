/**
 * 🛡️ ENHANCED ERROR HANDLER
 * Centralized error handling and reporting system
 */

import { toast } from "sonner";

// Error types for categorization
export type ErrorCategory =
  | "network"
  | "validation"
  | "permission"
  | "system"
  | "user"
  | "unknown";

export type ErrorSeverity = "low" | "medium" | "high" | "critical";

export interface ErrorReport {
  id: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  details?: any;
  stack?: string;
  timestamp: Date;
  userAgent: string;
  url: string;
  userId?: string;
}

class ErrorHandler {
  private reports: ErrorReport[] = [];
  private maxReports = 100;

  /**
   * Handle and report an error
   */
  handle(
    error: Error | string,
    category: ErrorCategory = "unknown",
    severity: ErrorSeverity = "medium",
    context?: any,
  ): string {
    const errorId = this.generateErrorId();

    const report: ErrorReport = {
      id: errorId,
      category,
      severity,
      message: typeof error === "string" ? error : error.message,
      details: context,
      stack: typeof error === "object" ? error.stack : undefined,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUserId(),
    };

    // Store report
    this.addReport(report);

    // Log to console (development)
    if (process.env.NODE_ENV === "development") {
      console.group(`🚨 Error [${severity}] - ${category}`);
      console.error("Message:", report.message);
      console.error("Details:", report.details);
      console.error("Stack:", report.stack);
      console.groupEnd();
    }

    // Show user notification
    this.showUserNotification(report);

    // Send to monitoring service (production)
    if (process.env.NODE_ENV === "production") {
      this.sendToMonitoring(report);
    }

    return errorId;
  }

  /**
   * Handle network errors specifically
   */
  handleNetworkError(error: Error, endpoint?: string, method?: string): string {
    const context = { endpoint, method };

    // Determine if it's a connection issue vs server error
    const severity: ErrorSeverity = error.message.includes("fetch")
      ? "high"
      : "medium";

    return this.handle(error, "network", severity, context);
  }

  /**
   * Handle validation errors
   */
  handleValidationError(field: string, value: any, rule: string): string {
    const message = `Validation failed for ${field}: ${rule}`;
    const context = { field, value, rule };

    return this.handle(message, "validation", "low", context);
  }

  /**
   * Handle permission errors
   */
  handlePermissionError(
    action: string,
    resource: string,
    userId?: string,
  ): string {
    const message = `Permission denied: ${action} on ${resource}`;
    const context = { action, resource, userId };

    return this.handle(message, "permission", "medium", context);
  }

  /**
   * Handle system errors (critical)
   */
  handleSystemError(error: Error, component?: string, props?: any): string {
    const context = { component, props };

    return this.handle(error, "system", "critical", context);
  }

  /**
   * Get error statistics
   */
  getStats() {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recent = this.reports.filter((r) => r.timestamp > last24h);

    const byCategory = recent.reduce(
      (acc, report) => {
        acc[report.category] = (acc[report.category] || 0) + 1;
        return acc;
      },
      {} as Record<ErrorCategory, number>,
    );

    const bySeverity = recent.reduce(
      (acc, report) => {
        acc[report.severity] = (acc[report.severity] || 0) + 1;
        return acc;
      },
      {} as Record<ErrorSeverity, number>,
    );

    return {
      total: this.reports.length,
      last24h: recent.length,
      byCategory,
      bySeverity,
      latestError: this.reports[this.reports.length - 1],
    };
  }

  /**
   * Export error reports for analysis
   */
  exportReports(format: "json" | "csv" = "json"): string {
    if (format === "json") {
      return JSON.stringify(this.reports, null, 2);
    }

    // CSV format
    const headers = [
      "ID",
      "Category",
      "Severity",
      "Message",
      "Timestamp",
      "URL",
      "User Agent",
    ];

    const rows = this.reports.map((r) => [
      r.id,
      r.category,
      r.severity,
      r.message.replace(/"/g, '""'), // Escape quotes
      r.timestamp.toISOString(),
      r.url,
      r.userAgent.replace(/"/g, '""'),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => `"${row.join('","')}"`),
    ].join("\n");

    return csv;
  }

  /**
   * Clear old error reports
   */
  cleanup(): void {
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days
    this.reports = this.reports.filter((r) => r.timestamp > cutoff);
  }

  // Private methods
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getCurrentUserId(): string | undefined {
    // Try to get user ID from various sources
    try {
      // Check localStorage
      const stored = localStorage.getItem("lawdesk_user");
      if (stored) {
        const user = JSON.parse(stored);
        return user.id || user.userId;
      }

      // Check sessionStorage
      const session = sessionStorage.getItem("user_session");
      if (session) {
        const sessionData = JSON.parse(session);
        return sessionData.userId;
      }

      return undefined;
    } catch {
      return undefined;
    }
  }

  private addReport(report: ErrorReport): void {
    this.reports.push(report);

    // Keep only recent reports
    if (this.reports.length > this.maxReports) {
      this.reports = this.reports.slice(-this.maxReports);
    }
  }

  private showUserNotification(report: ErrorReport): void {
    const userFriendlyMessages = {
      network: "Problema de conexão. Verifique sua internet.",
      validation: "Por favor, verifique os dados informados.",
      permission: "Acesso negado. Entre em contato com o suporte.",
      system: "Erro interno do sistema. Nossa equipe foi notificada.",
      user: "Ação não permitida no momento.",
      unknown: "Erro inesperado. Tente novamente.",
    };

    const message = userFriendlyMessages[report.category] || report.message;
    const title =
      `Erro ${report.severity === "critical" ? "crítico" : ""}`.trim();

    // Show appropriate toast based on severity
    switch (report.severity) {
      case "critical":
        toast.error(message, {
          description: `ID: ${report.id}`,
          duration: 10000,
        });
        break;
      case "high":
        toast.error(message, {
          description: `ID: ${report.id}`,
          duration: 6000,
        });
        break;
      case "medium":
        toast.warning(message, {
          description: `ID: ${report.id}`,
          duration: 4000,
        });
        break;
      case "low":
        toast.info(message, {
          duration: 3000,
        });
        break;
    }
  }

  private async sendToMonitoring(report: ErrorReport): Promise<void> {
    try {
      // In production, integrate with your monitoring service
      // Examples: Sentry, LogRocket, Datadog, etc.

      // For now, just log to console in production
      console.error("Error Report:", {
        id: report.id,
        category: report.category,
        severity: report.severity,
        message: report.message,
        timestamp: report.timestamp,
        url: report.url,
      });

      // Example integration with a monitoring API:
      /*
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
      */
    } catch (monitoringError) {
      console.error("Failed to send error to monitoring:", monitoringError);
    }
  }
}

// Create singleton instance
const errorHandler = new ErrorHandler();

// Export convenience functions
export const handleError = (
  error: Error | string,
  category?: ErrorCategory,
  severity?: ErrorSeverity,
  context?: any,
) => errorHandler.handle(error, category, severity, context);

export const handleNetworkError = (
  error: Error,
  endpoint?: string,
  method?: string,
) => errorHandler.handleNetworkError(error, endpoint, method);

export const handleValidationError = (
  field: string,
  value: any,
  rule: string,
) => errorHandler.handleValidationError(field, value, rule);

export const handlePermissionError = (
  action: string,
  resource: string,
  userId?: string,
) => errorHandler.handlePermissionError(action, resource, userId);

export const handleSystemError = (
  error: Error,
  component?: string,
  props?: any,
) => errorHandler.handleSystemError(error, component, props);

export const getErrorStats = () => errorHandler.getStats();
export const exportErrorReports = (format?: "json" | "csv") =>
  errorHandler.exportReports(format);
export const cleanupErrors = () => errorHandler.cleanup();

export default errorHandler;
