import { useCallback } from "react";
import { usePermissions } from "./usePermissions";
import { useViewMode } from "@/contexts/ViewModeContext";

export interface SecurityLogEntry {
  type: SecurityEventType;
  userId: string;
  userName: string;
  userRole: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  sessionId: string;
  viewMode: "client" | "admin";
  action: string;
  resource?: string;
  metadata?: Record<string, any>;
  success: boolean;
  riskLevel: "low" | "medium" | "high" | "critical";
}

export type SecurityEventType =
  | "VIEW_MODE_SWITCH"
  | "ADMIN_ACCESS"
  | "ROUTE_ACCESS"
  | "PERMISSION_DENIED"
  | "EXECUTIVE_ACCESS"
  | "SYSTEM_HEALTH_ACCESS"
  | "BLUEPRINT_EXECUTION"
  | "USER_MANAGEMENT"
  | "BILLING_ACCESS"
  | "SECURITY_CONFIG"
  | "DATA_EXPORT"
  | "LOGIN"
  | "LOGOUT"
  | "PASSWORD_CHANGE"
  | "PERMISSION_CHANGE";

export function useSecurityLogger() {
  const { user } = usePermissions();
  const { currentMode } = useViewMode();

  const logSecurityEvent = useCallback(
    (
      type: SecurityEventType,
      action: string,
      success: boolean = true,
      resource?: string,
      metadata?: Record<string, any>,
    ) => {
      if (!user) return;

      const getRiskLevel = (
        type: SecurityEventType,
        success: boolean,
      ): SecurityLogEntry["riskLevel"] => {
        if (!success) return "high";

        switch (type) {
          case "VIEW_MODE_SWITCH":
          case "ADMIN_ACCESS":
          case "EXECUTIVE_ACCESS":
          case "SYSTEM_HEALTH_ACCESS":
          case "BLUEPRINT_EXECUTION":
          case "SECURITY_CONFIG":
            return "medium";
          case "PERMISSION_DENIED":
          case "PERMISSION_CHANGE":
          case "PASSWORD_CHANGE":
            return "high";
          case "USER_MANAGEMENT":
          case "BILLING_ACCESS":
          case "DATA_EXPORT":
            return "critical";
          default:
            return "low";
        }
      };

      const logEntry: SecurityLogEntry = {
        type,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        timestamp: new Date().toISOString(),
        ip: "127.0.0.1", // In production, get from server
        userAgent: navigator.userAgent,
        sessionId: localStorage.getItem("sessionId") || generateSessionId(),
        viewMode: currentMode,
        action,
        resource,
        metadata,
        success,
        riskLevel: getRiskLevel(type, success),
      };

      // Store in localStorage for demo (in production, send to backend)
      const existingLogs = JSON.parse(
        localStorage.getItem("security_logs") || "[]",
      );
      existingLogs.push(logEntry);

      // Keep only last 1000 logs to prevent storage overflow
      if (existingLogs.length > 1000) {
        existingLogs.splice(0, existingLogs.length - 1000);
      }

      localStorage.setItem("security_logs", JSON.stringify(existingLogs));

      // Console log for development
      const logColor = {
        low: "#22c55e",
        medium: "#f59e0b",
        high: "#ef4444",
        critical: "#dc2626",
      }[logEntry.riskLevel];

      console.log(
        `%c🔒 Security Log [${logEntry.riskLevel.toUpperCase()}]`,
        `color: ${logColor}; font-weight: bold;`,
        logEntry,
      );

      // In production, send to security monitoring service
      // securityAPI.logEvent(logEntry);
    },
    [user, currentMode],
  );

  const getSecurityLogs = useCallback(
    (filters?: {
      userId?: string;
      type?: SecurityEventType;
      riskLevel?: SecurityLogEntry["riskLevel"];
      startDate?: string;
      endDate?: string;
      limit?: number;
    }) => {
      const logs: SecurityLogEntry[] = JSON.parse(
        localStorage.getItem("security_logs") || "[]",
      );

      let filteredLogs = logs;

      if (filters) {
        filteredLogs = logs.filter((log) => {
          if (filters.userId && log.userId !== filters.userId) return false;
          if (filters.type && log.type !== filters.type) return false;
          if (filters.riskLevel && log.riskLevel !== filters.riskLevel)
            return false;
          if (filters.startDate && log.timestamp < filters.startDate)
            return false;
          if (filters.endDate && log.timestamp > filters.endDate) return false;
          return true;
        });
      }

      // Sort by timestamp (newest first)
      filteredLogs.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      // Apply limit
      if (filters?.limit) {
        filteredLogs = filteredLogs.slice(0, filters.limit);
      }

      return filteredLogs;
    },
    [],
  );

  const clearSecurityLogs = useCallback(() => {
    localStorage.removeItem("security_logs");
    logSecurityEvent("SECURITY_CONFIG", "Security logs cleared", true);
  }, [logSecurityEvent]);

  const exportSecurityLogs = useCallback(() => {
    const logs = getSecurityLogs();
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `security_logs_${new Date().toISOString().split("T")[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);

    logSecurityEvent(
      "DATA_EXPORT",
      "Security logs exported",
      true,
      "security_logs",
    );
  }, [getSecurityLogs, logSecurityEvent]);

  const getSecuritySummary = useCallback(() => {
    const logs = getSecurityLogs({ limit: 100 });

    const summary = {
      totalEvents: logs.length,
      riskLevels: {
        low: logs.filter((log) => log.riskLevel === "low").length,
        medium: logs.filter((log) => log.riskLevel === "medium").length,
        high: logs.filter((log) => log.riskLevel === "high").length,
        critical: logs.filter((log) => log.riskLevel === "critical").length,
      },
      eventTypes: logs.reduce(
        (acc, log) => {
          acc[log.type] = (acc[log.type] || 0) + 1;
          return acc;
        },
        {} as Record<SecurityEventType, number>,
      ),
      failedEvents: logs.filter((log) => !log.success).length,
      uniqueUsers: new Set(logs.map((log) => log.userId)).size,
      viewModeUsage: {
        admin: logs.filter((log) => log.viewMode === "admin").length,
        client: logs.filter((log) => log.viewMode === "client").length,
      },
    };

    return summary;
  }, [getSecurityLogs]);

  return {
    logSecurityEvent,
    getSecurityLogs,
    clearSecurityLogs,
    exportSecurityLogs,
    getSecuritySummary,
  };
}

// Helper function to generate session ID
function generateSessionId(): string {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem("sessionId", sessionId);
  return sessionId;
}

export default useSecurityLogger;
