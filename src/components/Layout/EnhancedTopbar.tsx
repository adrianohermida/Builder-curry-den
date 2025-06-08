import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Menu,
  Bell,
  User,
  ChevronDown,
  Search,
  Scale,
  Shield,
  Settings,
  LogOut,
  Crown,
  Activity,
  Globe,
  Clock,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NotificationCenter } from "@/components/CRM/NotificationCenter";
import { ViewModeToggle } from "./ViewModeToggle";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/usePermissions";
import { useViewMode } from "@/contexts/ViewModeContext";

interface EnhancedTopbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
  showMobileNav?: boolean;
}

export function EnhancedTopbar({
  onMenuClick,
  sidebarOpen,
  showMobileNav = false,
}: EnhancedTopbarProps) {
  const { user, isAdmin, logout } = usePermissions();
  const { isAdminMode, isClientMode } = useViewMode();
  const currentTime = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const brandingInfo = {
    title: isAdminMode ? "Lawdesk Admin" : "Lawdesk CRM",
    subtitle: isAdminMode ? "Painel Administrativo" : "Sistema Jurídico",
    icon: isAdminMode ? Shield : Scale,
    iconColor: isAdminMode ? "text-red-600" : "text-blue-600",
    bgColor: isAdminMode ? "bg-red-50" : "bg-blue-50",
  };

  return (
    <header
      className={cn(
        "topbar sticky top-0 z-40",
        isAdminMode
          ? "bg-slate-900/95 backdrop-blur border-slate-700 text-slate-100"
          : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border",
        "border-b",
        "px-4 sm:px-6 lg:px-8",
        "h-16 flex items-center justify-between",
        "transition-all duration-200",
      )}
    >
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className={cn(
            "flex items-center gap-2 lg:hidden",
            isAdminMode &&
              "text-slate-200 hover:text-slate-100 hover:bg-slate-800",
          )}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Branding */}
        <Link
          to={isAdminMode ? "/admin" : "/dashboard"}
          className="flex items-center gap-3"
        >
          <motion.div
            key={isAdminMode ? "admin" : "client"}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg",
              brandingInfo.bgColor,
            )}
          >
            <brandingInfo.icon
              className={cn("w-6 h-6", brandingInfo.iconColor)}
            />
          </motion.div>
          <div className="hidden sm:block">
            <h1
              className={cn(
                "text-lg font-bold",
                isAdminMode ? "text-slate-100" : "text-foreground",
              )}
            >
              {brandingInfo.title}
            </h1>
            <p
              className={cn(
                "text-xs",
                isAdminMode ? "text-slate-400" : "text-muted-foreground",
              )}
            >
              {brandingInfo.subtitle}
            </p>
          </div>
        </Link>

        {/* Admin Mode Indicator */}
        {isAdminMode && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="hidden md:flex items-center gap-2"
          >
            <Badge
              variant="destructive"
              className="animate-pulse bg-red-600 text-white border-red-500"
            >
              <Shield className="h-3 w-3 mr-1" />
              ADMIN MODE
            </Badge>
          </motion.div>
        )}

        {/* Real-time Clock for Admin Mode */}
        {isAdminMode && (
          <div className="hidden lg:flex items-center gap-2 text-slate-400 text-sm">
            <Clock className="h-4 w-4" />
            <span>{currentTime}</span>
          </div>
        )}
      </div>

      {/* Center Section - Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search
            className={cn(
              "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4",
              isAdminMode ? "text-slate-400" : "text-muted-foreground",
            )}
          />
          <input
            type="text"
            placeholder={
              isAdminMode ? "Buscar no painel admin..." : "Buscar no sistema..."
            }
            className={cn(
              "w-full pl-10 pr-4 py-2 text-sm rounded-lg border transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              isAdminMode
                ? "bg-slate-800 border-slate-600 text-slate-200 placeholder-slate-400 focus:border-slate-500"
                : "bg-background border-input placeholder:text-muted-foreground focus:border-primary",
            )}
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* System Status for Admin Mode */}
        {isAdminMode && (
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Sistema Operacional</span>
            </div>
          </div>
        )}

        {/* View Mode Toggle */}
        <ViewModeToggle />

        {/* Notifications */}
        <NotificationCenter />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center gap-2 hover:bg-accent",
                isAdminMode &&
                  "text-slate-200 hover:text-slate-100 hover:bg-slate-800",
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback
                  className={cn(
                    isAdminMode ? "bg-slate-700 text-slate-200" : "",
                  )}
                >
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isAdminMode ? "text-slate-200" : "text-foreground",
                  )}
                >
                  {user?.name || "Usuário"}
                </p>
                <p
                  className={cn(
                    "text-xs",
                    isAdminMode ? "text-slate-400" : "text-muted-foreground",
                  )}
                >
                  {user?.role || "guest"}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4",
                  isAdminMode ? "text-slate-400" : "text-muted-foreground",
                )}
              />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Current Mode Display */}
            <div className="px-2 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Modo Atual:
                </span>
                <Badge
                  variant={isAdminMode ? "destructive" : "default"}
                  className="text-xs"
                >
                  {isAdminMode ? "🛡️ Admin" : "⚖️ Cliente"}
                </Badge>
              </div>
            </div>

            <DropdownMenuSeparator />

            {/* Admin Features */}
            {isAdmin() && (
              <>
                <DropdownMenuItem asChild>
                  <Link
                    to="/admin/executive"
                    className="flex items-center gap-2"
                  >
                    <Crown className="h-4 w-4" />
                    Dashboard Executivo
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/system-health" className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    System Health
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            {/* Standard Menu Items */}
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurações
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Meu Perfil
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={logout}
              className="flex items-center gap-2 text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
