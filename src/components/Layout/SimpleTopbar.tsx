import React from "react";
import { Link } from "react-router-dom";
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
import { ViewModeToggle } from "./ViewModeToggle";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/usePermissions";
import { useViewMode } from "@/contexts/ViewModeContext";

interface SimpleTopbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
  showMobileNav?: boolean;
}

export function SimpleTopbar({
  onMenuClick,
  sidebarOpen,
  showMobileNav = false,
}: SimpleTopbarProps) {
  const { user, isAdmin, logout } = usePermissions();
  const { isAdminMode } = useViewMode();

  const brandingInfo = {
    title: isAdminMode ? "Lawdesk Admin" : "Lawdesk CRM",
    subtitle: isAdminMode ? "Painel Administrativo" : "Sistema Jurídico",
    icon: isAdminMode ? Shield : Scale,
    iconColor: isAdminMode ? "text-red-600" : "text-blue-600",
    bgColor: isAdminMode ? "bg-red-50" : "bg-blue-50",
  };

  return (
    <div
      className={cn(
        "h-16 px-4 flex items-center justify-between border-b",
        isAdminMode
          ? "bg-slate-900 text-slate-100 border-slate-700"
          : "bg-background border-border",
      )}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className={cn(
            "lg:hidden",
            isAdminMode &&
              "text-slate-200 hover:text-slate-100 hover:bg-slate-800",
          )}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <Link
          to={isAdminMode ? "/admin" : "/dashboard"}
          className="flex items-center gap-3"
        >
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              brandingInfo.bgColor,
            )}
          >
            <brandingInfo.icon
              className={cn("w-6 h-6", brandingInfo.iconColor)}
            />
          </div>
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

        {/* Admin Indicator */}
        {isAdminMode && (
          <Badge variant="destructive" className="hidden md:flex animate-pulse">
            <Shield className="h-3 w-3 mr-1" />
            ADMIN
          </Badge>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Real-time clock for admin */}
        {isAdminMode && (
          <div className="hidden lg:flex items-center gap-1 text-slate-400 text-sm">
            <Clock className="h-4 w-4" />
            <span>
              {new Date().toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}

        {/* View Mode Toggle */}
        <ViewModeToggle />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
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
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={logout}
              className="text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
