import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type UserRole =
  | "admin"
  | "advogado"
  | "estagiario"
  | "cliente"
  | "secretaria";

export interface Permission {
  module: string;
  action: "read" | "write" | "delete" | "manage";
  resource?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  permissions: Permission[];
  customPermissions?: Permission[];
  areas?: string[]; // Areas de atuação específicas
  clients?: string[]; // Clientes específicos (para limitação de acesso)
  active: boolean;
  lastLogin?: string;
}

interface PermissionContext {
  user: User | null;
  hasPermission: (module: string, action: string, resource?: string) => boolean;
  hasAnyPermission: (permissions: Omit<Permission, "resource">[]) => boolean;
  canAccessClient: (clientId: string) => boolean;
  canAccessArea: (area: string) => boolean;
  isAdmin: () => boolean;
  isLawyer: () => boolean;
  login: (user: User) => void;
  logout: () => void;
  updatePermissions: (permissions: Permission[]) => void;
}

const PermissionContext = createContext<PermissionContext | null>(null);

// Role-based default permissions
const defaultPermissions: Record<UserRole, Permission[]> = {
  admin: [
    { module: "*", action: "manage" }, // Admin tem acesso total
    { module: "executive", action: "read" },
    { module: "executive", action: "manage" },
    { module: "finance", action: "read" },
    { module: "analytics", action: "read" },
    { module: "clients", action: "read" },
    { module: "satisfaction", action: "read" },
    { module: "system", action: "read" },
    { module: "marketing", action: "read" },
    { module: "support", action: "read" },
    { module: "contracts", action: "read" },
    { module: "admin", action: "manage" },
  ],
  advogado: [
    { module: "dashboard", action: "read" },
    { module: "crm", action: "manage" },
    { module: "ged", action: "manage" },
    { module: "tarefas", action: "manage" },
    { module: "publicacoes", action: "manage" },
    { module: "contratos", action: "manage" },
    { module: "financeiro", action: "read" },
    { module: "financeiro", action: "write" },
    { module: "ai", action: "manage" },
    { module: "agenda", action: "manage" },
    { module: "atendimento", action: "manage" },
    { module: "configuracoes", action: "read" },
  ],
  estagiario: [
    { module: "dashboard", action: "read" },
    { module: "crm", action: "read" },
    { module: "crm", action: "write" },
    { module: "ged", action: "read" },
    { module: "ged", action: "write" },
    { module: "tarefas", action: "read" },
    { module: "tarefas", action: "write" },
    { module: "publicacoes", action: "read" },
    { module: "ai", action: "read" },
    { module: "agenda", action: "read" },
    { module: "atendimento", action: "read" },
    { module: "atendimento", action: "write" },
  ],
  secretaria: [
    { module: "dashboard", action: "read" },
    { module: "crm", action: "read" },
    { module: "crm", action: "write" },
    { module: "ged", action: "read" },
    { module: "ged", action: "write" },
    { module: "tarefas", action: "read" },
    { module: "tarefas", action: "write" },
    { module: "agenda", action: "manage" },
    { module: "atendimento", action: "manage" },
    { module: "publicacoes", action: "read" },
    { module: "configuracoes", action: "read" },
  ],
  cliente: [
    { module: "dashboard", action: "read" },
    { module: "crm", action: "read", resource: "own" },
    { module: "ged", action: "read", resource: "own" },
    { module: "agenda", action: "read", resource: "own" },
    { module: "atendimento", action: "read" },
    { module: "publicacoes", action: "read", resource: "own" },
    { module: "contratos", action: "read", resource: "own" },
    { module: "financeiro", action: "read", resource: "own" },
  ],
};

// Mock user for development/fallback
const mockUser: User = {
  id: "user-mock",
  name: "Usuário Teste",
  email: "usuario@lawdesk.com",
  role: "advogado",
  permissions: defaultPermissions.advogado,
  active: true,
  lastLogin: new Date().toISOString(),
};

export function PermissionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem("lawdesk-user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("lawdesk-user");
        // Set mock user as fallback
        setUser(mockUser);
        localStorage.setItem("lawdesk-user", JSON.stringify(mockUser));
      }
    } else {
      // Set mock user if no saved user
      setUser(mockUser);
      localStorage.setItem("lawdesk-user", JSON.stringify(mockUser));
    }
  }, []);

  const hasPermission = (
    module: string,
    action: string,
    resource?: string,
  ): boolean => {
    if (!user) return false;

    // Admin has access to everything
    if (user.role === "admin") return true;

    // Get all permissions (default + custom)
    const allPermissions = [
      ...(user.permissions || []),
      ...(user.customPermissions || []),
    ];

    // Check for wildcard permission
    const hasWildcard = allPermissions.some(
      (p) => p.module === "*" && (p.action === "manage" || p.action === action),
    );
    if (hasWildcard) return true;

    // Check for specific permission
    const hasSpecific = allPermissions.some((p) => {
      const moduleMatch = p.module === module;
      const actionMatch = p.action === action || p.action === "manage";
      const resourceMatch = !resource || !p.resource || p.resource === resource;

      return moduleMatch && actionMatch && resourceMatch;
    });

    return hasSpecific;
  };

  const hasAnyPermission = (
    permissions: Omit<Permission, "resource">[],
  ): boolean => {
    return permissions.some((p) => hasPermission(p.module, p.action));
  };

  const canAccessClient = (clientId: string): boolean => {
    if (!user) return false;

    // Admin can access all clients
    if (user.role === "admin") return true;

    // Check if user has specific client access
    if (user.clients) {
      return user.clients.includes(clientId);
    }

    // For clients, they can only access their own data
    if (user.role === "cliente") {
      return user.id === clientId;
    }

    return true; // Default to true for lawyers/staff
  };

  const canAccessArea = (area: string): boolean => {
    if (!user) return false;

    // Admin can access all areas
    if (user.role === "admin") return true;

    // Check if user has specific area access
    if (user.areas) {
      return user.areas.includes(area);
    }

    return true; // Default to true if no area restrictions
  };

  const isAdmin = (): boolean => user?.role === "admin";
  const isLawyer = (): boolean =>
    user?.role === "advogado" || user?.role === "admin";

  const login = (userData: User) => {
    try {
      // Merge with default permissions for the role
      const userWithDefaults = {
        ...userData,
        permissions:
          userData.permissions || defaultPermissions[userData.role] || [],
      };

      setUser(userWithDefaults);
      localStorage.setItem("lawdesk-user", JSON.stringify(userWithDefaults));
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem("lawdesk-user");
      // Optionally redirect to login page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const updatePermissions = (permissions: Permission[]) => {
    if (user) {
      try {
        const updatedUser = { ...user, customPermissions: permissions };
        setUser(updatedUser);
        localStorage.setItem("lawdesk-user", JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Error updating permissions:", error);
      }
    }
  };

  // Provide safe defaults for all functions
  const contextValue: PermissionContext = {
    user,
    hasPermission,
    hasAnyPermission,
    canAccessClient,
    canAccessArea,
    isAdmin,
    isLawyer,
    login,
    logout,
    updatePermissions,
  };

  return (
    <PermissionContext.Provider value={contextValue}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (!context) {
    // Return safe defaults instead of throwing error
    console.warn(
      "usePermissions called outside of PermissionProvider, using defaults",
    );
    return {
      user: mockUser,
      hasPermission: () => true,
      hasAnyPermission: () => true,
      canAccessClient: () => true,
      canAccessArea: () => true,
      isAdmin: () => mockUser.role === "admin",
      isLawyer: () => ["advogado", "admin"].includes(mockUser.role),
      login: () => {},
      logout: () => {},
      updatePermissions: () => {},
    };
  }
  return context;
}

// Component for conditional rendering based on permissions
interface PermissionGuardProps {
  module: string;
  action: string;
  resource?: string;
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGuard({
  module,
  action,
  resource,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const { hasPermission } = usePermissions();

  if (!hasPermission(module, action, resource)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// HOC for protecting routes
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredModule: string,
  requiredAction: string,
  fallbackComponent?: React.ComponentType,
) {
  return function PermissionWrappedComponent(props: P) {
    const { hasPermission } = usePermissions();

    if (!hasPermission(requiredModule, requiredAction)) {
      if (fallbackComponent) {
        const FallbackComponent = fallbackComponent;
        return <FallbackComponent />;
      }
      return <div>Acesso negado</div>;
    }

    return <WrappedComponent {...props} />;
  };
}
