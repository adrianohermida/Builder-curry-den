import React, { useTransition, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";
import { useViewMode } from "@/contexts/ViewModeContext";
import { Shield, Lock, AlertTriangle, Crown, Users, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export interface EnhancedRouteGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireExecutive?: boolean;
  requiredPermission?: string;
  requiredRole?: "admin" | "advogado" | "estagiario" | "cliente" | "secretaria";
  adminModeOnly?: boolean;
  clientModeOnly?: boolean;
  fallbackPath?: string;
  showAccessDenied?: boolean;
}

export const EnhancedRouteGuard: React.FC<EnhancedRouteGuardProps> = ({
  children,
  requireAdmin = false,
  requireExecutive = false,
  requiredPermission,
  requiredRole,
  adminModeOnly = false,
  clientModeOnly = false,
  fallbackPath = "/dashboard",
  showAccessDenied = true,
}) => {
  const { user, isAdmin, hasPermission } = usePermissions();
  const { isAdminMode, isClientMode, canSwitchToAdmin, switchMode } =
    useViewMode();
  const location = useLocation();
  const [isPending, startTransition] = useTransition();
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null);

  // Use transition for any redirects that might happen
  useEffect(() => {
    if (shouldRedirect) {
      startTransition(() => {
        // Redirect will happen through state change
      });
    }
  }, [shouldRedirect]);

  // Check if user is logged in - use deferred check
  if (!user) {
    // Use useEffect to defer the navigation and toast
    useEffect(() => {
      startTransition(() => {
        toast.error("Acesso negado. Faça login para continuar.");
        setShouldRedirect("/login");
      });
    }, []);

    if (shouldRedirect === "/login") {
      return <Navigate to="/login" replace />;
    }

    // Show loading while transitioning
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check mode restrictions
  if (adminModeOnly && !isAdminMode) {
    if (canSwitchToAdmin) {
      return (
        <ModeRedirectPage
          type="admin-required"
          onSwitchMode={() => switchMode("admin")}
          fallbackPath={fallbackPath}
          currentPath={location.pathname}
        />
      );
    } else {
      if (showAccessDenied) {
        return (
          <AccessDeniedPage
            type="admin-mode-required"
            fallbackPath={fallbackPath}
            userRole={user.role}
          />
        );
      }
      toast.error("Esta página requer modo administrativo.");
      return <Navigate to={fallbackPath} replace />;
    }
  }

  if (clientModeOnly && !isClientMode) {
    return (
      <ModeRedirectPage
        type="client-required"
        onSwitchMode={() => switchMode("client")}
        fallbackPath={fallbackPath}
        currentPath={location.pathname}
      />
    );
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin()) {
    if (showAccessDenied) {
      return (
        <AccessDeniedPage
          type="admin"
          fallbackPath={fallbackPath}
          userRole={user.role}
        />
      );
    }

    // Use transition for redirect
    useEffect(() => {
      startTransition(() => {
        toast.error("Acesso negado. Esta área é restrita a administradores.");
        setShouldRedirect(fallbackPath);
      });
    }, []);

    if (shouldRedirect === fallbackPath) {
      return <Navigate to={fallbackPath} replace />;
    }

    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check executive requirement (admin or specific executive permissions)
  if (requireExecutive && !isAdmin() && !hasPermission("executive", "read")) {
    if (showAccessDenied) {
      return (
        <AccessDeniedPage
          type="executive"
          fallbackPath={fallbackPath}
          userRole={user.role}
        />
      );
    }
    return <Navigate to={fallbackPath} replace />;
  }

  // Check specific permission
  if (requiredPermission && !isAdmin()) {
    const [module, action] = requiredPermission.split(".");
    if (!hasPermission(module, action)) {
      if (showAccessDenied) {
        return (
          <AccessDeniedPage
            type="permission"
            permission={requiredPermission}
            fallbackPath={fallbackPath}
            userRole={user.role}
          />
        );
      }
      return <Navigate to={fallbackPath} replace />;
    }
  }

  // Check specific role
  if (requiredRole && user.role !== requiredRole && !isAdmin()) {
    if (showAccessDenied) {
      return (
        <AccessDeniedPage
          type="role"
          requiredRole={requiredRole}
          fallbackPath={fallbackPath}
          userRole={user.role}
        />
      );
    }
    return <Navigate to={fallbackPath} replace />;
  }

  // All checks passed, render children
  return <>{children}</>;
};

interface ModeRedirectPageProps {
  type: "admin-required" | "client-required";
  onSwitchMode: () => void;
  fallbackPath: string;
  currentPath: string;
}

const ModeRedirectPage: React.FC<ModeRedirectPageProps> = ({
  type,
  onSwitchMode,
  fallbackPath,
  currentPath,
}) => {
  const isAdminRequired = type === "admin-required";

  const config = {
    icon: isAdminRequired ? Shield : Scale,
    title: isAdminRequired
      ? "Modo Admin Necessário"
      : "Modo Cliente Necessário",
    description: isAdminRequired
      ? "Esta página requer o modo administrativo para ser acessada."
      : "Esta página requer o modo cliente para ser acessada.",
    iconColor: isAdminRequired ? "text-red-600" : "text-blue-600",
    bgColor: isAdminRequired ? "bg-red-50" : "bg-blue-50",
    borderColor: isAdminRequired ? "border-red-200" : "border-blue-200",
    buttonText: isAdminRequired
      ? "Alternar para Modo Admin"
      : "Alternar para Modo Cliente",
    buttonClass: isAdminRequired
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white",
  };

  const Icon = config.icon;

  const handleSwitch = () => {
    onSwitchMode();
    // Small delay to allow mode switch to complete
    setTimeout(() => {
      window.location.href = currentPath;
    }, 100);
  };

  return (
    <div className="min-h-[600px] flex items-center justify-center p-6">
      <Card className={`max-w-md w-full ${config.borderColor}`}>
        <CardHeader className="text-center">
          <div
            className={`w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
          >
            <Icon className={`w-8 h-8 ${config.iconColor}`} />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            {config.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-gray-600">{config.description}</p>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Você será redirecionado automaticamente após a alternância de
              modo.
            </AlertDescription>
          </Alert>

          <div className="pt-4 space-y-3">
            <Button
              onClick={handleSwitch}
              className={`w-full ${config.buttonClass}`}
            >
              {config.buttonText}
            </Button>
            <Button
              onClick={() => (window.location.href = fallbackPath)}
              variant="outline"
              className="w-full"
            >
              Voltar ao Dashboard
            </Button>
          </div>

          <div className="text-xs text-gray-500 pt-4 border-t">
            Você pode alternar entre os modos a qualquer momento usando o botão
            no cabeçalho.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface AccessDeniedPageProps {
  type: "admin" | "executive" | "permission" | "role" | "admin-mode-required";
  permission?: string;
  requiredRole?: string;
  fallbackPath: string;
  userRole: string;
}

const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({
  type,
  permission,
  requiredRole,
  fallbackPath,
  userRole,
}) => {
  const getAccessInfo = () => {
    switch (type) {
      case "admin":
        return {
          icon: Shield,
          title: "Acesso Administrativo Necessário",
          description:
            "Esta área é restrita exclusivamente para administradores do sistema.",
          iconColor: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      case "executive":
        return {
          icon: Crown,
          title: "Acesso Executivo Necessário",
          description:
            "Esta área requer permissões de nível executivo para visualização.",
          iconColor: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
        };
      case "admin-mode-required":
        return {
          icon: Shield,
          title: "Modo Admin Necessário",
          description:
            "Esta página só pode ser acessada no modo administrativo, mas você não tem permissões para alternar para este modo.",
          iconColor: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      case "permission":
        return {
          icon: Lock,
          title: "Permissão Específica Necessária",
          description: `Esta funcionalidade requer a permissão: ${permission}`,
          iconColor: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
        };
      case "role":
        return {
          icon: Users,
          title: "Role Específico Necessário",
          description: `Esta área é restrita para usuários com role: ${requiredRole}`,
          iconColor: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      default:
        return {
          icon: AlertTriangle,
          title: "Acesso Negado",
          description: "Você não tem permissão para acessar esta área.",
          iconColor: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
    }
  };

  const accessInfo = getAccessInfo();
  const Icon = accessInfo.icon;

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "advogado":
        return "bg-blue-100 text-blue-800";
      case "estagiario":
        return "bg-green-100 text-green-800";
      case "secretaria":
        return "bg-purple-100 text-purple-800";
      case "cliente":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-[600px] flex items-center justify-center p-6">
      <Card className={`max-w-md w-full ${accessInfo.borderColor}`}>
        <CardHeader className="text-center">
          <div
            className={`w-16 h-16 ${accessInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
          >
            <Icon className={`w-8 h-8 ${accessInfo.iconColor}`} />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            {accessInfo.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-gray-600">{accessInfo.description}</p>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-gray-500">Seu nível atual:</span>
              <Badge className={getRoleBadgeColor(userRole)}>
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </Badge>
            </div>

            {type === "role" && requiredRole && (
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-gray-500">Nível necessário:</span>
                <Badge className={getRoleBadgeColor(requiredRole)}>
                  {requiredRole.charAt(0).toUpperCase() + requiredRole.slice(1)}
                </Badge>
              </div>
            )}
          </div>

          <div className="pt-4 space-y-3">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full"
            >
              Voltar
            </Button>
            <Button
              onClick={() => (window.location.href = fallbackPath)}
              className="w-full"
            >
              Ir para Dashboard
            </Button>
          </div>

          <div className="text-xs text-gray-500 pt-4 border-t">
            Para solicitar acesso adicional, entre em contato com o
            administrador do sistema.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedRouteGuard;
