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
  ],
  advogado: [
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
    { module: "crm", action: "read" },
    { module: "crm", action: "write" },
    { module: "ged", action: "read" },
    { module: "ged", action: "write" },
    { module: "tarefas", action: "read" },
    { module: "tarefas", action: "write" },
    { module: "agenda", action: "manage" },
    { module: "atendimento", action: "manage" },
    { module: "publicacoes", action: "read" },
    { module: "financeiro", action: "read" },
  ],
  cliente: [
    { module: "crm", action: "read", resource: "own" },
    { module: "ged", action: "read", resource: "own" },
    { module: "financeiro", action: "read", resource: "own" },
    { module: "contratos", action: "read", resource: "own" },
    { module: "atendimento", action: "read", resource: "own" },
    { module: "atendimento", action: "write", resource: "own" },
  ],
};

export function PermissionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("lawdesk-user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error loading user data:", error);
        localStorage.removeItem("lawdesk-user");
      }
    } else {
      // For demo purposes, set a default admin user
      const demoUser: User = {
        id: "user-admin-001",
        name: "Dr. Pedro Costa",
        email: "pedro.costa@lawdesk.com.br",
        role: "admin",
        permissions: defaultPermissions.admin,
        active: true,
        lastLogin: new Date().toISOString(),
      };
      setUser(demoUser);
      localStorage.setItem("lawdesk-user", JSON.stringify(demoUser));
    }
  }, []);

  const hasPermission = (
    module: string,
    action: string,
    resource?: string,
  ): boolean => {
    if (!user || !user.active) return false;

    // Combine default permissions with custom permissions
    const allPermissions = [
      ...defaultPermissions[user.role],
      ...(user.customPermissions || []),
    ];

    // Check for wildcard admin permission
    if (allPermissions.some((p) => p.module === "*" && p.action === "manage")) {
      return true;
    }

    // Check specific permissions
    const hasModulePermission = allPermissions.some((permission) => {
      const moduleMatch =
        permission.module === module || permission.module === "*";
      const actionMatch =
        permission.action === action || permission.action === "manage";

      if (!moduleMatch || !actionMatch) return false;

      // Resource-level permission check
      if (resource && permission.resource) {
        if (permission.resource === "own") {
          // For "own" resource, check if user has access to this specific resource
          return canAccessOwnResource(module, resource);
        }
        return permission.resource === resource;
      }

      return true;
    });

    return hasModulePermission;
  };

  const hasAnyPermission = (
    permissions: Omit<Permission, "resource">[],
  ): boolean => {
    return permissions.some((permission) =>
      hasPermission(permission.module, permission.action),
    );
  };

  const canAccessClient = (clientId: string): boolean => {
    if (!user) return false;

    // Admin and lawyers can access all clients
    if (user.role === "admin" || user.role === "advogado") return true;

    // Check if user has specific client access
    if (user.clients) {
      return user.clients.includes(clientId);
    }

    // For clients, they can only access their own data
    if (user.role === "cliente") {
      return user.id === clientId;
    }

    return false;
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

  const canAccessOwnResource = (
    module: string,
    resourceId: string,
  ): boolean => {
    // This would typically check against the user's associated resources
    // For now, return true for demo purposes
    return true;
  };

  const isAdmin = (): boolean => user?.role === "admin";
  const isLawyer = (): boolean =>
    user?.role === "advogado" || user?.role === "admin";

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("lawdesk-user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("lawdesk-user");
  };

  const updatePermissions = (permissions: Permission[]) => {
    if (user) {
      const updatedUser = { ...user, customPermissions: permissions };
      setUser(updatedUser);
      localStorage.setItem("lawdesk-user", JSON.stringify(updatedUser));
    }
  };

  return (
    <PermissionContext.Provider
      value={{
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
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionProvider");
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
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Acesso Negado</h3>
            <p className="text-muted-foreground">
              Você não tem permissão para acessar este módulo.
            </p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}
