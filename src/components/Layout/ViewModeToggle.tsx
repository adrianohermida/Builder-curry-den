import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Scale,
  RotateCcw,
  AlertTriangle,
  Crown,
  Users,
  Zap,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useViewMode } from "@/contexts/ViewModeContext";
import { usePermissions } from "@/hooks/usePermissions";
import { cn } from "@/lib/utils";

export function ViewModeToggle() {
  const {
    currentMode,
    switchMode,
    canSwitchToAdmin,
    isAdminMode,
    isClientMode,
    adminScopes,
  } = useViewMode();

  const { user, isAdmin } = usePermissions();

  // Don't render if user can't switch to admin mode
  if (!canSwitchToAdmin) {
    return null;
  }

  const handleModeSwitch = (newMode: "client" | "admin") => {
    if (newMode !== currentMode) {
      switchMode(newMode);
    }
  };

  const modeConfig = {
    client: {
      icon: Scale,
      label: "Modo Cliente",
      description: "Sistema jurídico completo",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      hoverColor: "hover:bg-blue-100",
    },
    admin: {
      icon: Shield,
      label: "Modo Admin",
      description: "Painel administrativo",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      hoverColor: "hover:bg-red-100",
    },
  };

  const currentConfig = modeConfig[currentMode];
  const CurrentIcon = currentConfig.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "relative flex items-center gap-2 transition-all duration-200",
                  currentConfig.bgColor,
                  currentConfig.borderColor,
                  currentConfig.hoverColor,
                  isAdminMode && "ring-2 ring-red-200 animate-pulse",
                )}
              >
                <motion.div
                  key={currentMode}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <CurrentIcon className={cn("h-4 w-4", currentConfig.color)} />
                  <span
                    className={cn(
                      "text-sm font-medium hidden sm:inline",
                      currentConfig.color,
                    )}
                  >
                    {isAdminMode ? "Admin" : "Cliente"}
                  </span>
                </motion.div>

                {/* Active indicator */}
                <AnimatePresence>
                  {isAdminMode && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
                    />
                  )}
                </AnimatePresence>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-80 max-w-[calc(100vw-2rem)] mr-2"
            >
              <DropdownMenuLabel className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Alternar Modo de Visualização
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* Current User Info */}
              <div className="px-2 py-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      {user?.name}
                    </div>
                    <div className="text-xs">{user?.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {user?.role}
                  </Badge>
                  {isAdmin() && (
                    <Badge
                      variant="outline"
                      className="text-xs text-red-600 border-red-200"
                    >
                      <Crown className="h-3 w-3 mr-1" />
                      Admin Access
                    </Badge>
                  )}
                </div>
              </div>

              <DropdownMenuSeparator />

              {/* Client Mode Option */}
              <DropdownMenuItem
                onClick={() => handleModeSwitch("client")}
                className={cn(
                  "flex items-center gap-3 p-3 cursor-pointer",
                  isClientMode && "bg-blue-50 border-l-4 border-l-blue-500",
                )}
              >
                <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
                  <Scale className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Modo Cliente</div>
                  <div className="text-sm text-muted-foreground">
                    Sistema jurídico completo
                  </div>
                </div>
                {isClientMode && (
                  <Badge variant="default" className="bg-blue-600">
                    Ativo
                  </Badge>
                )}
              </DropdownMenuItem>

              {/* Admin Mode Option */}
              <DropdownMenuItem
                onClick={() => handleModeSwitch("admin")}
                className={cn(
                  "flex items-center gap-3 p-3 cursor-pointer",
                  isAdminMode && "bg-red-50 border-l-4 border-l-red-500",
                )}
              >
                <div className="flex items-center justify-center w-10 h-10 bg-red-50 rounded-lg">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Modo Admin</div>
                  <div className="text-sm text-muted-foreground">
                    Painel administrativo completo
                  </div>
                </div>
                {isAdminMode && <Badge variant="destructive">Ativo</Badge>}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Admin Capabilities */}
              {isAdminMode && (
                <div className="px-2 py-2">
                  <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Capacidades Administrativas
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <Badge variant="outline" className="text-xs justify-center">
                      <Crown className="h-3 w-3 mr-1" />
                      Executive
                    </Badge>
                    <Badge variant="outline" className="text-xs justify-center">
                      <Users className="h-3 w-3 mr-1" />
                      Team
                    </Badge>
                    <Badge variant="outline" className="text-xs justify-center">
                      <Zap className="h-3 w-3 mr-1" />
                      Dev Tools
                    </Badge>
                    <Badge variant="outline" className="text-xs justify-center">
                      <Shield className="h-3 w-3 mr-1" />
                      Security
                    </Badge>
                  </div>
                </div>
              )}

              {/* Security Warning */}
              {isAdminMode && (
                <>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-2 text-xs text-orange-600 bg-orange-50 rounded-md mx-2 flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                    <span>
                      Modo administrativo ativo. Todas as ações são registradas
                      em log de auditoria.
                    </span>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>

        <TooltipContent>
          <p>Alternar Modo de Visualização</p>
          <p className="text-xs text-muted-foreground">
            {isAdminMode ? "🛡️ Admin → ⚖️ Cliente" : "⚖️ Cliente → 🛡️ Admin"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
