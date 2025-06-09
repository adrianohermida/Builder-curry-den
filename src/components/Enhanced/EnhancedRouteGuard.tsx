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
import { PageLoading } from "@/components/ui/simple-loading";

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
  fallbackPath = "/painel",
  showAccessDenied = true,
}) => {
  const location = useLocation();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [accessResult, setAccessResult] = useState<{
    hasAccess: boolean;
    component?: React.ReactNode;
  }>({ hasAccess: false });

  // Safe hooks with fallbacks to prevent errors
  let user = null;
  let isAdmin = () => false;
  let hasPermission = () => false;
  let isAdminMode = false;
  let isClientMode = true;
  let canSwitchToAdmin = false;
  let switchMode = () => {};

  try {
    const permissions = usePermissions();
    user = permissions.user;
    isAdmin = permissions.isAdmin;
    hasPermission = permissions.hasPermission;
  } catch (error) {
    console.warn(
      "Permission context not available in RouteGuard, using defaults",
    );
  }

  try {
    const viewMode = useViewMode();
    isAdminMode = viewMode.isAdminMode || false;
    isClientMode = viewMode.isClientMode || true;
    canSwitchToAdmin = viewMode.canSwitchToAdmin || false;
    switchMode = viewMode.switchMode || (() => {});
  } catch (error) {
    console.warn(
      "ViewMode context not available in RouteGuard, using defaults",
    );
  }

  // Async access check to prevent blocking
  useEffect(() => {
    const checkAccess = () => {
      try {
        // Use a microtask to avoid blocking the render cycle
        Promise.resolve()
          .then(() => {
            startTransition(() => {
              setIsLoading(true);

              // Check if user is logged in
              if (!user) {
                setAccessResult({
                  hasAccess: false,
                  component: <Navigate to="/login" replace />,
                });
                setIsLoading(false);
                return;
              }

              // Check mode restrictions
              if (adminModeOnly && !isAdminMode) {
                if (canSwitchToAdmin) {
                  setAccessResult({
                    hasAccess: false,
                    component: (
                      <ModeRedirectPage
                        type="admin-required"
                        onSwitchMode={() => switchMode("admin")}
                        fallbackPath={fallbackPath}
                        currentPath={location.pathname}
                      />
                    ),
                  });
                } else {
                  if (showAccessDenied) {
                    setAccessResult({
                      hasAccess: false,
                      component: (
                        <AccessDeniedPage
                          type="admin-mode-required"
                          fallbackPath={fallbackPath}
                          userRole={user.role}
                        />
                      ),
                    });
                  } else {
                    toast.error("Esta página requer modo administrativo.");
                    setAccessResult({
                      hasAccess: false,
                      component: <Navigate to={fallbackPath} replace />,
                    });
                  }
                }
                setIsLoading(false);
                return;
              }

              if (clientModeOnly && !isClientMode) {
                setAccessResult({
                  hasAccess: false,
                  component: (
                    <ModeRedirectPage
                      type="client-required"
                      onSwitchMode={() => switchMode("client")}
                      fallbackPath={fallbackPath}
                      currentPath={location.pathname}
                    />
                  ),
                });
                setIsLoading(false);
                return;
              }

              // Check admin requirement
              if (requireAdmin && !isAdmin()) {
                if (showAccessDenied) {
                  setAccessResult({
                    hasAccess: false,
                    component: (
                      <AccessDeniedPage
                        type="admin"
                        fallbackPath={fallbackPath}
                        userRole={user.role}
                      />
                    ),
                  });
                } else {
                  setAccessResult({
                    hasAccess: false,
                    component: <Navigate to={fallbackPath} replace />,
                  });
                }
                setIsLoading(false);
                return;
              }

              // Check executive requirement
              if (
                requireExecutive &&
                !isAdmin() &&
                !hasPermission("executive", "read")
              ) {
                if (showAccessDenied) {
                  setAccessResult({
                    hasAccess: false,
                    component: (
                      <AccessDeniedPage
                        type="executive"
                        fallbackPath={fallbackPath}
                        userRole={user.role}
                      />
                    ),
                  });
                } else {
                  setAccessResult({
                    hasAccess: false,
                    component: <Navigate to={fallbackPath} replace />,
                  });
                }
                setIsLoading(false);
                return;
              }

              // Check specific permission
              if (requiredPermission && !isAdmin()) {
                const [module, action] = requiredPermission.split(".");
                if (!hasPermission(module, action)) {
                  if (showAccessDenied) {
                    setAccessResult({
                      hasAccess: false,
                      component: (
                        <AccessDeniedPage
                          type="permission"
                          permission={requiredPermission}
                          fallbackPath={fallbackPath}
                          userRole={user.role}
                        />
                      ),
                    });
                  } else {
                    setAccessResult({
                      hasAccess: false,
                      component: <Navigate to={fallbackPath} replace />,
                    });
                  }
                  setIsLoading(false);
                  return;
                }
              }

              // Check specific role
              if (requiredRole && user.role !== requiredRole && !isAdmin()) {
                if (showAccessDenied) {
                  setAccessResult({
                    hasAccess: false,
                    component: (
                      <AccessDeniedPage
                        type="role"
                        requiredRole={requiredRole}
                        fallbackPath={fallbackPath}
                        userRole={user.role}
                      />
                    ),
                  });
                } else {
                  setAccessResult({
                    hasAccess: false,
                    component: <Navigate to={fallbackPath} replace />,
                  });
                }
                setIsLoading(false);
                return;
              }

              // All checks passed
              setAccessResult({ hasAccess: true });
              setIsLoading(false);
            });
          })
          .catch((error) => {
            console.error("Error in access check:", error);
            startTransition(() => {
              setAccessResult({
                hasAccess: false,
                component: <Navigate to={fallbackPath} replace />,
              });
              setIsLoading(false);
            });
          });
      } catch (error) {
        console.error("Synchronous error in access check:", error);
        startTransition(() => {
          setAccessResult({
            hasAccess: false,
            component: <Navigate to={fallbackPath} replace />,
          });
          setIsLoading(false);
        });
      }
    };

    checkAccess();
  }, [
    user,
    isAdminMode,
    isClientMode,
    canSwitchToAdmin,
    requireAdmin,
    requireExecutive,
    requiredPermission,
    requiredRole,
    adminModeOnly,
    clientModeOnly,
    location.pathname,
  ]);

  // Show loading while checking access
  if (isLoading || isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <PageLoading />
      </div>
    );
  }

  // Return access result
  if (!accessResult.hasAccess) {
    return <>{accessResult.component}</>;
  }

  // Render children with transition
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
  const [isPending, startTransition] = useTransition();
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
    startTransition(() => {
      onSwitchMode();
      // Small delay to allow mode switch to complete
      setTimeout(() => {
        window.location.href = currentPath;
      }, 100);
    });
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
              disabled={isPending}
              className={`w-full ${config.buttonClass}`}
            >
              {isPending ? "Alternando..." : config.buttonText}
            </Button>
            <Button
              onClick={() => (window.location.href = fallbackPath)}
              variant="outline"
              className="w-full"
              disabled={isPending}
            >
              Voltar ao Painel
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
              Ir para Painel
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
