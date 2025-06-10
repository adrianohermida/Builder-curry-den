import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usePermissions } from "@/hooks/usePermissions";

export type ViewMode = "client" | "admin";

interface ViewModeContextType {
  currentMode: ViewMode;
  isAdminMode: boolean;
  isClientMode: boolean;
  canSwitchToAdmin: boolean;
  adminScopes: string[];
  switchMode: (mode: ViewMode) => void;
  toggleMode: () => void;
}

const ViewModeContext = createContext<ViewModeContextType | null>(null);

interface ViewModeProviderProps {
  children: ReactNode;
}

// Admin scopes by role
const getAdminScopes = (role: string): string[] => {
  const scopes = {
    admin: [
      "executive",
      "bi",
      "marketing",
      "finance",
      "security",
      "products",
      "team",
      "support",
    ],
    superadmin: ["*"], // Full access
  };
  return scopes[role as keyof typeof scopes] || [];
};

export function ViewModeProvider({ children }: ViewModeProviderProps) {
  const [currentMode, setCurrentMode] = useState<ViewMode>("client");

  // Safe permission hooks with fallbacks
  let user = null;
  let isAdmin = () => false;
  let hasPermission = () => false;

  try {
    const permissions = usePermissions();
    user = permissions.user;
    isAdmin = permissions.isAdmin;
    hasPermission = permissions.hasPermission;
  } catch (error) {
    console.warn(
      "Permission context not available in ViewMode, using defaults",
    );
  }

  // Check if user can switch to admin mode
  const canSwitchToAdmin = React.useMemo(() => {
    if (!user) return false;

    try {
      // Only admin can switch to admin mode
      const hasAdminRole = user.role === "admin";
      const hasAdminAccess = isAdmin() || hasPermission("admin", "read");

      // Environment check (in development, be more permissive)
      const isDevEnvironment = import.meta.env?.MODE === "development";
      const isAdminDomain =
        window.location.hostname.includes("admin") ||
        window.location.hostname.includes("dev") ||
        window.location.hostname.includes("localhost");

      return (
        hasAdminRole && hasAdminAccess && (isDevEnvironment || isAdminDomain)
      );
    } catch (error) {
      console.warn("Error checking admin access:", error);
      return false;
    }
  }, [user, isAdmin, hasPermission]);

  // Get user's admin scopes
  const adminScopes = React.useMemo(() => {
    if (!user || !canSwitchToAdmin) return [];
    try {
      return getAdminScopes(user.role);
    } catch (error) {
      console.warn("Error getting admin scopes:", error);
      return [];
    }
  }, [user, canSwitchToAdmin]);

  // Load saved mode from localStorage
  useEffect(() => {
    if (!user) return;

    try {
      const savedMode = localStorage.getItem("viewMode") as ViewMode;
      if (savedMode && (savedMode === "client" || savedMode === "admin")) {
        // Only allow admin mode if user can switch to it
        if (savedMode === "admin" && !canSwitchToAdmin) {
          setCurrentMode("client");
          localStorage.setItem("viewMode", "client");
        } else {
          setCurrentMode(savedMode);
        }
      }
    } catch (error) {
      console.warn("Error loading saved view mode:", error);
      setCurrentMode("client");
    }
  }, [user, canSwitchToAdmin]);

  // Switch mode function
  const switchMode = React.useCallback(
    (mode: ViewMode) => {
      try {
        // Validate mode switch
        if (mode === "admin" && !canSwitchToAdmin) {
          console.warn("Cannot switch to admin mode: insufficient permissions");
          return;
        }

        setCurrentMode(mode);
        localStorage.setItem("viewMode", mode);

        // Log mode switch for security
        if (user) {
          const logEntry = {
            user: user.id,
            action: `mode_switch_${mode}`,
            timestamp: new Date().toISOString(),
            metadata: {
              from: currentMode,
              to: mode,
              userAgent: navigator.userAgent,
            },
          };
          console.log("🔒 Mode Switch Log:", logEntry);
        }
      } catch (error) {
        console.error("Error switching mode:", error);
      }
    },
    [canSwitchToAdmin, currentMode, user],
  );

  // Toggle between modes
  const toggleMode = React.useCallback(() => {
    const newMode = currentMode === "client" ? "admin" : "client";
    switchMode(newMode);
  }, [currentMode, switchMode]);

  // Computed values
  const isAdminMode = currentMode === "admin";
  const isClientMode = currentMode === "client";

  // Context value with safe defaults
  const contextValue: ViewModeContextType = {
    currentMode,
    isAdminMode,
    isClientMode,
    canSwitchToAdmin,
    adminScopes,
    switchMode,
    toggleMode,
  };

  return (
    <ViewModeContext.Provider value={contextValue}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode(): ViewModeContextType {
  const context = useContext(ViewModeContext);
  if (!context) {
    // Return safe defaults instead of throwing error
    console.warn(
      "useViewMode called outside of ViewModeProvider, using defaults",
    );
    return {
      currentMode: "client",
      isAdminMode: false,
      isClientMode: true,
      canSwitchToAdmin: false,
      adminScopes: [],
      switchMode: () => {},
      toggleMode: () => {},
    };
  }
  return context;
}

// Component for conditional rendering based on view mode
interface ViewModeGuardProps {
  mode: ViewMode | ViewMode[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function ViewModeGuard({
  mode,
  fallback = null,
  children,
}: ViewModeGuardProps) {
  const { currentMode } = useViewMode();

  const allowedModes = Array.isArray(mode) ? mode : [mode];
  const isAllowed = allowedModes.includes(currentMode);

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// HOC for protecting components based on view mode
export function withViewMode<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredMode: ViewMode | ViewMode[],
  fallbackComponent?: React.ComponentType,
) {
  return function ViewModeWrappedComponent(props: P) {
    const { currentMode } = useViewMode();

    const allowedModes = Array.isArray(requiredMode)
      ? requiredMode
      : [requiredMode];
    const isAllowed = allowedModes.includes(currentMode);

    if (!isAllowed) {
      if (fallbackComponent) {
        const FallbackComponent = fallbackComponent;
        return <FallbackComponent />;
      }
      return <div>Não disponível neste modo de visualização</div>;
    }

    return <WrappedComponent {...props} />;
  };
}
