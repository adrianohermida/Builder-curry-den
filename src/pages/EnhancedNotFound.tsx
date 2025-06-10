import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  ArrowLeft,
  Search,
  AlertTriangle,
  Scale,
  Shield,
  MapPin,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePermissions } from "@/hooks/usePermissions";
import { useViewMode } from "@/contexts/ViewModeContext";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin } = usePermissions();
  const { isAdminMode, isClientMode } = useViewMode();

  // Log 404 error for monitoring
  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );

    // In production, send to analytics
    // analytics.track('404_Error', { path: location.pathname, user: user?.id });
  }, [location.pathname, user?.id]);

  const suggestedRoutes = React.useMemo(() => {
    const routes = [];

    if (isAdminMode && isAdmin()) {
      routes.push(
        { path: "/admin", label: "Painel Admin", icon: Shield },
        {
          path: "/admin/executive",
          label: "Dashboard Executivo",
          icon: Shield,
        },
        { path: "/system-health", label: "System Health", icon: Shield },
      );
    } else {
      routes.push(
        { path: "/dashboard", label: "Painel Jurídico", icon: Scale },
        { path: "/crm", label: "CRM Jurídico", icon: Scale },
        { path: "/ged-juridico", label: "GED Jurídico", icon: Scale },
      );
    }

    return routes;
  }, [isAdminMode, isAdmin]);

  const getErrorContext = () => {
    const path = location?.pathname || "";

    if (path.startsWith("/admin") && !isAdminMode) {
      return {
        type: "mode_mismatch",
        title: "Página Admin em Modo Cliente",
        description:
          "Você está tentando acessar uma página administrativa em modo cliente.",
        suggestion: "Alterne para o modo admin ou acesse uma página cliente.",
      };
    }

    if (path.startsWith("/admin") && !isAdmin()) {
      return {
        type: "permission_denied",
        title: "Acesso Administrativo Negado",
        description:
          "Você não possui permissões para acessar páginas administrativas.",
        suggestion:
          "Entre em contato com o administrador para solicitar acesso.",
      };
    }

    return {
      type: "not_found",
      title: "Página Não Encontrada",
      description:
        "A página que você está procurando não existe ou foi movida.",
      suggestion:
        "Verifique a URL ou navegue para uma das páginas sugeridas abaixo.",
    };
  };

  const errorContext = getErrorContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Error Icon and Code */}
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mb-6"
            >
              <AlertTriangle className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-6xl sm:text-8xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              404
            </h1>
          </div>

          {/* Error Context */}
          <Card className="mb-8 text-left">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {errorContext.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {errorContext.description}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    <strong>Rota tentada:</strong>{" "}
                    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                      {location.pathname}
                    </code>
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                    💡 {errorContext.suggestion}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current User Context */}
          {user && (
            <Card className="mb-8 text-left">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{user.role}</Badge>
                    <Badge
                      variant={isAdminMode ? "destructive" : "default"}
                      className="text-xs"
                    >
                      {isAdminMode ? "🛡️ Admin" : "⚖️ Cliente"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>

            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Recarregar
            </Button>
          </div>

          {/* Suggested Routes */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Páginas Sugeridas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {suggestedRoutes.map((route, index) => (
                <motion.div
                  key={route.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <Button
                    onClick={() => navigate(route.path)}
                    variant="outline"
                    className="w-full h-20 flex flex-col gap-2"
                  >
                    <route.icon className="w-6 h-6" />
                    <span className="text-sm">{route.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main Dashboard Button */}
          <Button
            onClick={() => navigate(isAdminMode ? "/admin" : "/dashboard")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
          >
            <Home className="w-5 h-5 mr-2" />
            Ir para {isAdminMode ? "Admin" : "Dashboard"}
          </Button>

          {/* Footer */}
          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            <p>
              © 2025 Lawdesk CRM. Se o problema persistir, entre em contato com
              o suporte.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
