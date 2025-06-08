import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  Scale,
  Shield,
  LogOut,
  User,
  Settings,
  Bell,
  X,
  Home,
  MoreVertical,
  Crown,
  Activity,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ViewModeToggle } from "./ViewModeToggle";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/usePermissions";
import { useViewMode } from "@/contexts/ViewModeContext";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface CompactTopbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
  isMobile: boolean;
}

export function CompactTopbar({
  onMenuClick,
  sidebarOpen,
  isMobile,
}: CompactTopbarProps) {
  const { user, isAdmin, logout } = usePermissions();
  const { isAdminMode, switchMode, canSwitchToAdmin } = useViewMode();
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const brandingInfo = {
    title: isAdminMode ? "Admin" : "CRM",
    icon: isAdminMode ? Shield : Scale,
    iconColor: isAdminMode ? "text-red-500" : "text-blue-600",
    bgColor: isAdminMode ? "bg-red-500" : "bg-blue-600",
  };

  const handleQuickSwitch = () => {
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
    setShowUserMenu(false);
  };

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
        {/* Mobile Header (< 768px) */}
        {isMobile && (
          <div className="flex items-center justify-between px-4 h-14">
            {/* Left: Menu + Brand */}
            <div className="flex items-center gap-2">
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

              <Link
                to={isAdminMode ? "/admin" : "/dashboard"}
                className="flex items-center gap-2"
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-md",
                    brandingInfo.bgColor,
                  )}
                >
                  <brandingInfo.icon className="w-4 h-4 text-white" />
                </div>
                <span
                  className={cn(
                    "font-bold text-sm",
                    isAdminMode ? "text-slate-100" : "text-foreground",
                  )}
                >
                  {brandingInfo.title}
                </span>
              </Link>
            </div>

            {/* Right: Search + User */}
            <div className="flex items-center gap-1">
              {/* Search Toggle */}
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

              {/* User Menu Sheet */}
              <Sheet open={showUserMenu} onOpenChange={setShowUserMenu}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback
                        className={cn(
                          "text-xs",
                          isAdminMode ? "bg-slate-700 text-slate-200" : "",
                        )}
                      >
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </SheetTrigger>

                <SheetContent side="right" className="w-80">
                  <SheetHeader className="space-y-4">
                    <SheetTitle className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback>
                          {user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {user?.role}
                        </Badge>
                      </div>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="py-6 space-y-4">
                    {/* Current Mode */}
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">Modo Atual</span>
                      <Badge variant={isAdminMode ? "destructive" : "default"}>
                        {isAdminMode ? "🛡️ Admin" : "⚖️ Cliente"}
                      </Badge>
                    </div>

                    {/* Quick Mode Switch for Admins */}
                    {isAdmin() && (
                      <Button
                        variant="outline"
                        onClick={handleQuickSwitch}
                        className="w-full justify-start"
                      >
                        {isAdminMode ? (
                          <>
                            <Scale className="h-4 w-4 mr-2" />
                            Ver como Cliente
                          </>
                        ) : (
                          <>
                            <Shield className="h-4 w-4 mr-2" />
                            Modo Admin
                          </>
                        )}
                      </Button>
                    )}

                    <div className="space-y-2">
                      {/* Quick Actions */}
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link to={isAdminMode ? "/admin" : "/dashboard"}>
                          <Home className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                      </Button>

                      {isAdmin() && (
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          asChild
                        >
                          <Link to="/admin/executive">
                            <Crown className="h-4 w-4 mr-2" />
                            Dashboard Executivo
                          </Link>
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link to="/settings">
                          <Settings className="h-4 w-4 mr-2" />
                          Configurações
                        </Link>
                      </Button>

                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link to="/profile">
                          <User className="h-4 w-4 mr-2" />
                          Meu Perfil
                        </Link>
                      </Button>
                    </div>

                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">Tema</span>
                      <ThemeToggle />
                    </div>

                    {/* Logout */}
                    <Button
                      variant="destructive"
                      onClick={logout}
                      className="w-full justify-start"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        )}

        {/* Desktop Header (>= 768px) */}
        {!isMobile && (
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuClick}
                className={cn(
                  "flex items-center gap-2",
                  isAdminMode && "text-slate-200 hover:bg-slate-800",
                )}
              >
                <Menu className="h-5 w-5" />
                <span className="text-sm">
                  {sidebarOpen ? "Recolher" : "Expandir"}
                </span>
              </Button>

              <Link
                to={isAdminMode ? "/admin" : "/dashboard"}
                className="flex items-center gap-3"
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg",
                    brandingInfo.bgColor,
                  )}
                >
                  <brandingInfo.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1
                    className={cn(
                      "text-lg font-bold",
                      isAdminMode ? "text-slate-100" : "text-foreground",
                    )}
                  >
                    {isAdminMode ? "Lawdesk Admin" : "Lawdesk CRM"}
                  </h1>
                  <p
                    className={cn(
                      "text-xs",
                      isAdminMode ? "text-slate-400" : "text-muted-foreground",
                    )}
                  >
                    {isAdminMode ? "Painel Administrativo" : "Sistema Jurídico"}
                  </p>
                </div>
              </Link>

              {isAdminMode && (
                <Badge variant="destructive" className="animate-pulse">
                  <Shield className="h-3 w-3 mr-1" />
                  ADMIN MODE
                </Badge>
              )}
            </div>

            {/* Center Section - Search */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search
                  className={cn(
                    "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4",
                    isAdminMode ? "text-slate-400" : "text-muted-foreground",
                  )}
                />
                <input
                  type="text"
                  placeholder={
                    isAdminMode ? "Buscar no admin..." : "Buscar no sistema..."
                  }
                  className={cn(
                    "w-full pl-10 pr-4 py-2 text-sm rounded-lg border transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50",
                    isAdminMode
                      ? "bg-slate-800 border-slate-600 text-slate-200 placeholder-slate-400"
                      : "bg-background border-input placeholder:text-muted-foreground",
                  )}
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {isAdmin() && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleQuickSwitch}
                  className={cn(
                    "hidden sm:flex items-center gap-2",
                    isAdminMode &&
                      "border-slate-600 text-slate-200 hover:bg-slate-800",
                  )}
                >
                  {isAdminMode ? (
                    <>
                      <Scale className="h-4 w-4" />
                      <span>Ver como Cliente</span>
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4" />
                      <span>Modo Admin</span>
                    </>
                  )}
                </Button>
              )}

              <ViewModeToggle />
              <ThemeToggle />

              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>

              <Button variant="ghost" size="sm" asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user?.name}</span>
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isMobile && showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t px-4 py-3"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={
                    isAdminMode ? "Buscar no admin..." : "Buscar no sistema..."
                  }
                  className={cn(
                    "w-full pl-10 pr-4 py-2 text-sm rounded-lg border",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50",
                    isAdminMode
                      ? "bg-slate-800 border-slate-600 text-slate-200 placeholder-slate-400"
                      : "bg-background border-input",
                  )}
                  autoFocus
                  style={{ fontSize: "16px" }} // Prevent zoom on iOS
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Admin Mode Footer for Mobile */}
      {isMobile && isAdminMode && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900 border-t border-slate-700 px-4 py-2">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-300">
            <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
            <span>🛡️ MODO ADMIN ATIVO</span>
            <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </>
  );
}
