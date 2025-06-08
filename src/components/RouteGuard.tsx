import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";
import { toast } from "sonner";

interface RouteGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requiredPermission?: {
    module: string;
    action: string;
  };
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  requireAdmin = false,
  requiredPermission,
}) => {
  const { isAdmin, hasPermission, user } = usePermissions();
  const location = useLocation();

  // Check if user is authenticated
  if (!user) {
    toast.error("Acesso negado. Faça login para continuar.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin()) {
    toast.error("Acesso negado. Esta área é restrita a administradores.");
    return <Navigate to="/dashboard" replace />;
  }

  // Check specific permission requirement
  if (
    requiredPermission &&
    !hasPermission(requiredPermission.module, requiredPermission.action)
  ) {
    toast.error(
      "Acesso negado. Você não tem permissão para acessar esta área.",
    );
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
