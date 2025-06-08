import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { toast } from "sonner";

export type ViewMode = "client" | "admin";

export interface ViewModeContextType {
  currentMode: ViewMode;
  switchMode: (mode: ViewMode) => void;
  canSwitchToAdmin: boolean;
  isAdminMode: boolean;
  isClientMode: boolean;
  adminScopes: string[];
}

interface ViewModeProviderProps {
  children: ReactNode;
}

const ViewModeContext = createContext<ViewModeContextType | null>(null);

// Admin scopes for granular permission control
const ADMIN_SCOPES = [
  "admin:access",
  "admin:dashboard",
  "admin:bi",
  "admin:team",
  "admin:development",
  "admin:billing",
  "admin:support",
  "admin:marketing",
  "admin:products",
  "admin:security",
  "admin:system",
  "admin:logs",
  "admin:blueprints",
  "admin:executive",
] as const;

// Default admin permissions for admin users
const getAdminScopes = (userRole: string): string[] => {
  if (userRole === "admin") {
    return ADMIN_SCOPES as unknown as string[];
  }
  return [];
};

// Internal logging function for this context
const logModeSwitch = (
  userId: string,
  fromMode: ViewMode,
  toMode: ViewMode,
  userAgent: string,
  timestamp: string,
) => {
  const logEntry = {
    type: "VIEW_MODE_SWITCH",
    userId,
    fromMode,
    toMode,
    userAgent,
    timestamp,
    ip: "127.0.0.1", // In production, get from server
    sessionId: localStorage.getItem("sessionId") || "unknown",
  };

  // Store in localStorage for now (in production, send to backend)
  const existingLogs = JSON.parse(
    localStorage.getItem("security_logs") || "[]",
  );
  existingLogs.push(logEntry);
  localStorage.setItem("security_logs", JSON.stringify(existingLogs));

  console.log("🔒 Security Log:", logEntry);
};

export function ViewModeProvider({ children }: ViewModeProviderProps) {
  const { user, isAdmin, hasPermission } = usePermissions();
  const [currentMode, setCurrentMode] = useState<ViewMode>("client");

  // Check if user can switch to admin mode
  const canSwitchToAdmin = React.useMemo(() => {
    if (!user) return false;

    // Only admin, superadmin, or dev can switch to admin mode
    const allowedRoles = ["admin"];
    const hasAdminRole = allowedRoles.includes(user.role);

    // Additional scope check
    const hasAdminAccess = isAdmin() || hasPermission("admin", "read");

    // Environment check (in production, check if in admin subdomain or dev environment)
    const isDevEnvironment = process.env.NODE_ENV === "development";
    const isAdminDomain =
      window.location.hostname.includes("admin") ||
      window.location.hostname.includes("dev") ||
      window.location.hostname.includes("localhost");

    return (
      hasAdminRole && hasAdminAccess && (isDevEnvironment || isAdminDomain)
    );
  }, [user, isAdmin, hasPermission]);

  // Get user's admin scopes
  const adminScopes = React.useMemo(() => {
    if (!user || !canSwitchToAdmin) return [];
    return getAdminScopes(user.role);
  }, [user, canSwitchToAdmin]);

  // Load saved mode from localStorage
  useEffect(() => {
    if (!user) return;

    const savedMode = localStorage.getItem(`viewMode_${user.id}`) as ViewMode;
    if (
      savedMode &&
      (savedMode === "client" || (savedMode === "admin" && canSwitchToAdmin))
    ) {
      setCurrentMode(savedMode);
    }
  }, [user, canSwitchToAdmin]);

  // Switch mode function with security logging
  const switchMode = React.useCallback(
    (newMode: ViewMode) => {
      if (!user) {
        toast.error("Usuário não autenticado");
        return;
      }

      // Security validation
      if (newMode === "admin" && !canSwitchToAdmin) {
        toast.error("Acesso negado ao modo administrativo");
        logModeSwitch(
          user.id,
          currentMode,
          newMode,
          navigator.userAgent,
          new Date().toISOString(),
        );
        return;
      }

      const previousMode = currentMode;

      // Log the mode switch
      logModeSwitch(
        user.id,
        previousMode,
        newMode,
        navigator.userAgent,
        new Date().toISOString(),
      );

      // Update state and persist
      setCurrentMode(newMode);
      localStorage.setItem(`viewMode_${user.id}`, newMode);

      // Show success message
      const modeLabel = newMode === "admin" ? "Administrativo" : "Cliente";
      toast.success(`Modo alternado para: ${modeLabel}`, {
        description:
          newMode === "admin"
            ? "🛡️ Acesso total às ferramentas administrativas"
            : "⚖️ Visão padrão do sistema jurídico",
      });

      // Redirect to appropriate default route
      const targetRoute = newMode === "admin" ? "/admin" : "/dashboard";
      if (
        window.location.pathname.startsWith("/admin") &&
        newMode === "client"
      ) {
        window.location.href = targetRoute;
      } else if (
        !window.location.pathname.startsWith("/admin") &&
        newMode === "admin"
      ) {
        window.location.href = targetRoute;
      }
    },
    [user, currentMode, canSwitchToAdmin],
  );

  // Computed properties
  const isAdminMode = currentMode === "admin";
  const isClientMode = currentMode === "client";

  // Auto-switch to client mode if user loses admin permissions
  useEffect(() => {
    if (isAdminMode && !canSwitchToAdmin) {
      setCurrentMode("client");
      localStorage.setItem(`viewMode_${user?.id}`, "client");
      toast.warning(
        "Modo administrativo desabilitado devido a alteração de permissões",
      );
    }
  }, [isAdminMode, canSwitchToAdmin, user?.id]);

  const contextValue: ViewModeContextType = {
    currentMode,
    switchMode,
    canSwitchToAdmin,
    isAdminMode,
    isClientMode,
    adminScopes,
  };

  return (
    <ViewModeContext.Provider value={contextValue}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error("useViewMode must be used within a ViewModeProvider");
  }
  return context;
}

export default ViewModeContext;
