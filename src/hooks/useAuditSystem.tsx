import { useState, useCallback, useEffect } from "react";
import { usePermissions } from "./usePermissions";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  resourceType?: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface AuditFilter {
  userId?: string;
  module?: string;
  action?: string;
  dateFrom?: string;
  dateTo?: string;
  success?: boolean;
  resourceType?: string;
}

interface UseAuditSystemReturn {
  logAction: (
    action: string,
    module: string,
    details: Record<string, any>,
    resourceType?: string,
    resourceId?: string,
  ) => Promise<void>;
  getLogs: (
    filter?: AuditFilter,
    page?: number,
    limit?: number,
  ) => Promise<{
    logs: AuditLogEntry[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  exportLogs: (
    filter?: AuditFilter,
    format?: "csv" | "excel" | "pdf",
  ) => Promise<void>;
  getLogsSummary: (days?: number) => Promise<{
    totalActions: number;
    byModule: Record<string, number>;
    byUser: Record<string, number>;
    byAction: Record<string, number>;
    successRate: number;
  }>;
  isLoading: boolean;
  error: string | null;
}

export function useAuditSystem(): UseAuditSystemReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = usePermissions();

  // Generate session ID
  const sessionId = useCallback(() => {
    return (
      sessionStorage.getItem("lawdesk-session-id") ||
      (() => {
        const id = crypto.randomUUID();
        sessionStorage.setItem("lawdesk-session-id", id);
        return id;
      })()
    );
  }, []);

  // Get client info
  const getClientInfo = useCallback(() => {
    return {
      ipAddress: "192.168.1.100", // In real app, get from server
      userAgent: navigator.userAgent,
      sessionId: sessionId(),
    };
  }, [sessionId]);

  // Log an action
  const logAction = useCallback(
    async (
      action: string,
      module: string,
      details: Record<string, any>,
      resourceType?: string,
      resourceId?: string,
    ): Promise<void> => {
      if (!user) return;

      try {
        const clientInfo = getClientInfo();

        const logEntry: AuditLogEntry = {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          action,
          module,
          resourceType,
          resourceId,
          details,
          ...clientInfo,
          success: true,
        };

        // Store in localStorage for demo (in real app, send to server)
        const existingLogs = JSON.parse(
          localStorage.getItem("lawdesk-audit-logs") || "[]",
        );
        existingLogs.unshift(logEntry);

        // Keep only last 1000 entries in localStorage
        if (existingLogs.length > 1000) {
          existingLogs.splice(1000);
        }

        localStorage.setItem(
          "lawdesk-audit-logs",
          JSON.stringify(existingLogs),
        );

        // In real app, send to audit service
        // await auditService.log(logEntry);
      } catch (err) {
        console.error("Failed to log audit action:", err);
        setError(err instanceof Error ? err.message : "Failed to log action");
      }
    },
    [user, getClientInfo],
  );

  // Get logs with filtering and pagination
  const getLogs = useCallback(
    async (
      filter?: AuditFilter,
      page = 1,
      limit = 50,
    ): Promise<{
      logs: AuditLogEntry[];
      total: number;
      page: number;
      totalPages: number;
    }> => {
      setIsLoading(true);
      setError(null);

      try {
        // Get logs from localStorage (in real app, fetch from server)
        const allLogs: AuditLogEntry[] = JSON.parse(
          localStorage.getItem("lawdesk-audit-logs") || "[]",
        );

        // Apply filters
        let filteredLogs = allLogs;

        if (filter) {
          filteredLogs = allLogs.filter((log) => {
            if (filter.userId && log.userId !== filter.userId) return false;
            if (filter.module && log.module !== filter.module) return false;
            if (filter.action && log.action !== filter.action) return false;
            if (filter.success !== undefined && log.success !== filter.success)
              return false;
            if (filter.resourceType && log.resourceType !== filter.resourceType)
              return false;

            if (filter.dateFrom) {
              const logDate = new Date(log.timestamp);
              const fromDate = new Date(filter.dateFrom);
              if (logDate < fromDate) return false;
            }

            if (filter.dateTo) {
              const logDate = new Date(log.timestamp);
              const toDate = new Date(filter.dateTo);
              toDate.setHours(23, 59, 59, 999); // End of day
              if (logDate > toDate) return false;
            }

            return true;
          });
        }

        // Pagination
        const total = filteredLogs.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const paginatedLogs = filteredLogs.slice(
          startIndex,
          startIndex + limit,
        );

        return {
          logs: paginatedLogs,
          total,
          page,
          totalPages,
        };
      } catch (err) {
        const error =
          err instanceof Error ? err.message : "Failed to fetch logs";
        setError(error);
        throw new Error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Export logs
  const exportLogs = useCallback(
    async (
      filter?: AuditFilter,
      format: "csv" | "excel" | "pdf" = "csv",
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const { logs } = await getLogs(filter, 1, 10000); // Get all matching logs

        if (format === "csv") {
          const csvContent = [
            // Header
            "Timestamp,User,Role,Module,Action,Resource Type,Resource ID,Success,Details",
            // Data
            ...logs.map((log) =>
              [
                log.timestamp,
                log.userName,
                log.userRole,
                log.module,
                log.action,
                log.resourceType || "",
                log.resourceId || "",
                log.success,
                JSON.stringify(log.details).replace(/"/g, '""'),
              ].join(","),
            ),
          ].join("\n");

          const blob = new Blob([csvContent], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
          a.click();
          URL.revokeObjectURL(url);
        }

        // Excel e PDF export será implementado na próxima versão
      } catch (err) {
        const error =
          err instanceof Error ? err.message : "Failed to export logs";
        setError(error);
        throw new Error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [getLogs],
  );

  // Get logs summary
  const getLogsSummary = useCallback(
    async (days = 30) => {
      const filter: AuditFilter = {
        dateFrom: new Date(
          Date.now() - days * 24 * 60 * 60 * 1000,
        ).toISOString(),
      };

      const { logs } = await getLogs(filter, 1, 10000);

      const summary = {
        totalActions: logs.length,
        byModule: {} as Record<string, number>,
        byUser: {} as Record<string, number>,
        byAction: {} as Record<string, number>,
        successRate:
          logs.length > 0
            ? (logs.filter((log) => log.success).length / logs.length) * 100
            : 0,
      };

      logs.forEach((log) => {
        summary.byModule[log.module] = (summary.byModule[log.module] || 0) + 1;
        summary.byUser[log.userName] = (summary.byUser[log.userName] || 0) + 1;
        summary.byAction[log.action] = (summary.byAction[log.action] || 0) + 1;
      });

      return summary;
    },
    [getLogs],
  );

  // Auto-log page visits
  useEffect(() => {
    const currentPath = window.location.pathname;
    const module = currentPath.split("/")[1] || "dashboard";

    logAction("page_visit", module, {
      path: currentPath,
      timestamp: new Date().toISOString(),
    });
  }, [logAction]);

  return {
    logAction,
    getLogs,
    exportLogs,
    getLogsSummary,
    isLoading,
    error,
  };
}

// Audit action types for consistency
export const AUDIT_ACTIONS = {
  // Authentication
  LOGIN: "login",
  LOGOUT: "logout",
  PASSWORD_CHANGE: "password_change",

  // CRUD operations
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
  BULK_DELETE: "bulk_delete",

  // File operations
  UPLOAD: "upload",
  DOWNLOAD: "download",
  PREVIEW: "preview",
  SHARE: "share",

  // Financial operations
  PAYMENT_PROCESS: "payment_process",
  INVOICE_GENERATE: "invoice_generate",
  CONTRACT_SIGN: "contract_sign",

  // AI operations
  AI_GENERATE: "ai_generate",
  AI_ANALYZE: "ai_analyze",
  AI_SUMMARIZE: "ai_summarize",

  // System operations
  SETTINGS_CHANGE: "settings_change",
  PERMISSION_CHANGE: "permission_change",
  BACKUP_CREATE: "backup_create",

  // Navigation
  PAGE_VISIT: "page_visit",
  MODULE_ACCESS: "module_access",
} as const;

// Audit modules for consistency
export const AUDIT_MODULES = {
  AUTH: "auth",
  CRM: "crm",
  GED: "ged",
  TASKS: "tasks",
  PUBLICATIONS: "publications",
  CONTRACTS: "contracts",
  FINANCIAL: "financial",
  AI: "ai",
  CALENDAR: "calendar",
  TICKETS: "tickets",
  SETTINGS: "settings",
  DASHBOARD: "dashboard",
} as const;
