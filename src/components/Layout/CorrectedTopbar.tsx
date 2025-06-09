import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Menu,
  Bell,
  Settings,
  User,
  LogOut,
  Shield,
  X,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { usePermissions } from "@/hooks/usePermissions";
import { useViewMode } from "@/contexts/ViewModeContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CorrectedTopbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
  isMobile: boolean;
}

export function CorrectedTopbar({
  onMenuClick,
  sidebarOpen,
  isMobile,
}: CorrectedTopbarProps) {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  // Safe hooks with fallbacks
  let user = null;
  let isAdmin = () => false;
  let logout = () => {};
  let isAdminMode = false;
  let canSwitchToAdmin = false;
  let switchMode = () => {};

  try {
    const permissions = usePermissions();
    user = permissions.user;
    isAdmin = permissions.isAdmin;
    logout = permissions.logout;
  } catch (error) {
    console.warn("Permission context not available for header");
  }

  try {
    const viewMode = useViewMode();
    isAdminMode = viewMode.isAdminMode || false;
    canSwitchToAdmin = viewMode.canSwitchToAdmin || false;
    switchMode = viewMode.switchMode || (() => {});
  } catch (error) {
    console.warn("ViewMode context not available for header");
  }

  const handleLogout = async () => {
    try {
      logout();
      toast.success("Logout realizado", {
        description: "Você foi desconectado com sucesso",
      });
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro no logout", {
        description: "Tente novamente",
      });
    }
  };

  const handleQuickSwitch = () => {
    try {
      if (isAdminMode) {
        switchMode("client");
        toast.success("Modo Cliente", {
          description: "⚖️ Visualização de cliente ativa",
        });
      } else if (canSwitchToAdmin) {
        switchMode("admin");
        toast.success("Modo Admin", {
          description: "🛡️ Acesso administrativo ativo",
        });
      }
    } catch (error) {
      console.error("Erro ao trocar modo:", error);
      toast.error("Erro ao trocar modo");
    }
  };

  const currentTime = new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b backdrop-blur-md",
          isAdminMode
            ? "bg-slate-900/90 border-slate-700 text-slate-100"
            : "bg-background/90 border-border",
          "transition-all duration-200",
        )}
      >
        {/* Mobile Header */}
        {isMobile ? (
          <div className="flex items-center justify-between px-4 h-14">
            {/* Left: Menu + Brand */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuClick}
                className={cn(
                  "h-9 w-9 p-0",
                  isAdminMode && "text-slate-200 hover:bg-slate-800",
                )}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <Link to={isAdminMode ? "/admin" : "/painel"}>
                <span
                  className={cn(
                    "font-bold text-lg",
                    isAdminMode ? "text-slate-100" : "text-foreground",
                  )}
                >
                  {isAdminMode ? "Admin" : "Lawdesk"}
                </span>
              </Link>
            </div>

            {/* Right: Search + User */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearch(!showSearch)}
                className={cn(
                  "h-9 w-9 p-0",
                  isAdminMode && "text-slate-200 hover:bg-slate-800",
                )}
              >
                {showSearch ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>

              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 relative"
                    >
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-xs">
                          {user.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      {isAdminMode && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={isAdminMode ? "destructive" : "default"}
                            className="text-xs"
                          >
                            {user.role}
                          </Badge>
                          {isAdminMode && (
                            <Badge variant="destructive" className="text-xs">
                              ADMIN
                            </Badge>
                          )}
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {canSwitchToAdmin && (
                      <>
                        <DropdownMenuItem onClick={handleQuickSwitch}>
                          <Shield className="h-4 w-4 mr-2" />
                          {isAdminMode ? "Modo Cliente" : "Modo Admin"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}

                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <Settings className="h-4 w-4 mr-2" />
                      Configurações
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 focus:text-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        ) : (
          /* Desktop Header */
          <div className="flex items-center justify-between px-6 h-16">
            {/* Left: Menu + Search */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuClick}
                className={cn(
                  "h-10 w-10 p-0",
                  isAdminMode && "text-slate-200 hover:bg-slate-800",
                )}
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Search */}
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar clientes, processos, documentos..."
                  className={cn(
                    "pl-10 w-full",
                    isAdminMode &&
                      "bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-400",
                  )}
                />
              </div>
            </div>

            {/* Right: Actions + User */}
            <div className="flex items-center gap-4">
              {/* Time Display for Admin */}
              {isAdminMode && (
                <div className="hidden lg:flex items-center gap-2 text-slate-300">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-mono">{currentTime}</span>
                </div>
              )}

              {/* Quick Switch */}
              {canSwitchToAdmin && (
                <Button
                  variant={isAdminMode ? "destructive" : "default"}
                  size="sm"
                  onClick={handleQuickSwitch}
                  className="hidden lg:flex"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {isAdminMode ? "Cliente" : "Admin"}
                </Button>
              )}

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-10 w-10 p-0 relative",
                  isAdminMode && "text-slate-200 hover:bg-slate-800",
                )}
              >
                <Bell className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </Button>

              {/* User Menu */}
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-10 px-3 gap-2 hover:bg-muted"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:block text-left">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.role}
                        </p>
                      </div>
                      {isAdminMode && (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={isAdminMode ? "destructive" : "default"}
                            className="text-xs"
                          >
                            {user.role}
                          </Badge>
                          {isAdminMode && (
                            <Badge variant="destructive" className="text-xs">
                              ADMIN
                            </Badge>
                          )}
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="h-4 w-4 mr-2" />
                      Meu Perfil
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <Settings className="h-4 w-4 mr-2" />
                      Configurações
                    </DropdownMenuItem>

                    {canSwitchToAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleQuickSwitch}>
                          <Shield className="h-4 w-4 mr-2" />
                          {isAdminMode ? "Modo Cliente" : "Modo Admin"}
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 focus:text-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Search Overlay */}
      {isMobile && showSearch && (
        <div
          className={cn(
            "absolute top-14 left-0 right-0 z-50 p-4 border-b backdrop-blur-md",
            isAdminMode
              ? "bg-slate-900/95 border-slate-700"
              : "bg-background/95 border-border",
          )}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar..."
              className={cn(
                "pl-10 w-full",
                isAdminMode &&
                  "bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-400",
              )}
              autoFocus
            />
          </div>
        </div>
      )}
    </>
  );
}
