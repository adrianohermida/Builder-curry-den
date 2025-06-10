import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Monitor,
  Shield,
  Crown,
  ChevronDown,
  Keyboard,
  HelpCircle,
  Zap,
  Building,
  Palette,
  Home,
  MessageSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useTheme } from "@/providers/ThemeProvider";
import { useViewMode } from "@/contexts/ViewModeContext";
import { usePermissions } from "@/hooks/usePermissions";

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationCount, setNotificationCount] = useState(3);
  const location = useLocation();
  const navigate = useNavigate();

  // Theme and mode hooks with fallbacks
  let isDark = false;
  let setMode = () => {};
  let effectiveMode = "light";

  try {
    const theme = useTheme();
    isDark = theme.isDark;
    setMode = theme.setMode;
    effectiveMode = theme.effectiveMode;
  } catch (error) {
    console.warn("Theme context not available");
  }

  let isAdminMode = false;
  let toggleMode = () => {};
  let currentMode = "client";

  try {
    const viewMode = useViewMode();
    isAdminMode = viewMode.isAdminMode;
    toggleMode = viewMode.toggleMode;
    currentMode = viewMode.currentMode;
  } catch (error) {
    console.warn("ViewMode context not available");
  }

  let user = { name: "Usuário", email: "usuario@lawdesk.com", role: "client" };
  let isAdmin = () => false;

  try {
    const permissions = usePermissions();
    user = permissions.user || user;
    isAdmin = permissions.isAdmin;
  } catch (error) {
    console.warn("Permissions context not available");
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Search command suggestions
  const searchSuggestions = [
    {
      label: "Ir para Painel",
      value: "painel",
      href: "/painel",
      icon: Home,
    },
    {
      label: "Buscar Clientes",
      value: "clientes",
      href: "/crm/clientes",
      icon: User,
    },
    {
      label: "Buscar Processos",
      value: "processos",
      href: "/crm/processos",
      icon: Shield,
    },
    {
      label: "Buscar Contratos",
      value: "contratos",
      href: "/crm/contratos",
      icon: Building,
    },
    {
      label: "Agenda",
      value: "agenda",
      href: "/agenda",
      icon: Search,
    },
    {
      label: "Documentos (GED)",
      value: "documentos",
      href: "/crm/ged",
      icon: Search,
    },
    {
      label: "IA Jurídico",
      value: "ia",
      href: "/ai-enhanced",
      icon: Zap,
    },
    {
      label: "Configurações",
      value: "configuracoes",
      href: "/settings",
      icon: Settings,
    },
  ];

  // Get page title from current route
  const getPageTitle = () => {
    const path = location.pathname;
    const titles: Record<string, string> = {
      "/painel": "Painel de Controle",
      "/crm": "CRM Jurídico",
      "/crm/clientes": "Gestão de Clientes",
      "/crm/processos": "Processos Jurídicos",
      "/crm/contratos": "Contratos",
      "/agenda": "Agenda Jurídica",
      "/crm/ged": "Documentos",
      "/ai-enhanced": "IA Jurídico",
      "/tarefas": "Gestão de Tarefas",
      "/publicacoes": "Publicações",
      "/financeiro": "Financeiro",
      "/atendimento": "Atendimento",
      "/settings": "Configurações",
      "/admin": "Administração",
      "/admin/executive": "Dashboard Executivo",
      "/admin/bi": "Business Intelligence",
      "/admin/equipe": "Gestão de Equipe",
      "/admin/desenvolvimento": "Desenvolvimento",
      "/admin/faturamento": "Faturamento",
      "/admin/suporte": "Suporte B2B",
      "/admin/marketing": "Marketing",
      "/admin/produtos": "Produtos",
      "/admin/seguranca": "Segurança",
      "/system-health": "System Health",
      "/update": "Update Manager",
      "/launch": "Launch Control",
    };

    return titles[path] || "Lawdesk";
  };

  const handleSearch = (value: string) => {
    const suggestion = searchSuggestions.find((s) => s.value === value);
    if (suggestion) {
      navigate(suggestion.href);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    // Implement logout logic
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b transition-all duration-200",
          // FIXED: Light mode background with proper theming
          "bg-white/95 backdrop-blur-sm border-gray-200",
          "dark:bg-gray-900/95 dark:border-gray-700",
          // Admin mode styling
          isAdminMode &&
            "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="h-9 w-9 p-0"
              data-sidebar-toggle
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>

            {/* Page Title */}
            <div className="hidden md:block">
              <h1
                className={cn(
                  "text-lg font-semibold",
                  isAdminMode ? "text-red-900" : "text-gray-900",
                  "dark:text-gray-100",
                )}
              >
                {getPageTitle()}
              </h1>
              {isAdminMode && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  Modo Administrativo
                </p>
              )}
            </div>

            {/* Mode Badge */}
            {isAdminMode && (
              <Badge
                variant="destructive"
                className="hidden sm:inline-flex items-center gap-1 bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
              >
                <Shield className="h-3 w-3" />
                Admin
              </Badge>
            )}
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setSearchOpen(true)}
                className={cn(
                  "w-full justify-start text-muted-foreground",
                  "hover:bg-gray-50 transition-colors border-gray-200",
                  "dark:hover:bg-gray-800 dark:border-gray-700",
                  "focus:ring-2",
                  isAdminMode
                    ? "focus:ring-red-500 dark:focus:ring-red-400"
                    : "focus:ring-blue-500 dark:focus:ring-blue-400",
                )}
                data-search-trigger
              >
                <Search className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline-flex">
                  Buscar em todo o sistema...
                </span>
                <span className="sm:hidden">Buscar...</span>
                <div className="ml-auto">
                  <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              </Button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMode(isDark ? "light" : "dark")}
                  className={cn(
                    "h-9 w-9 p-0 transition-colors",
                    isAdminMode
                      ? "hover:bg-red-100 dark:hover:bg-red-900/20"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800",
                  )}
                >
                  {isDark ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Alternar tema ({isDark ? "Claro" : "Escuro"})
              </TooltipContent>
            </Tooltip>

            {/* Notifications */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-9 w-9 p-0 relative transition-colors",
                    isAdminMode
                      ? "hover:bg-red-100 dark:hover:bg-red-900/20"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800",
                  )}
                >
                  <Bell className="h-4 w-4" />
                  {notificationCount > 0 && (
                    <div
                      className={cn(
                        "absolute -top-1 -right-1 h-3 w-3 rounded-full text-xs",
                        isAdminMode ? "bg-red-500" : "bg-blue-500",
                      )}
                    />
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Notificações ({notificationCount} novas)
              </TooltipContent>
            </Tooltip>

            {/* Admin Mode Toggle for Admin Users */}
            {isAdmin() && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isAdminMode ? "destructive" : "outline"}
                    size="sm"
                    onClick={toggleMode}
                    className={cn(
                      "hidden sm:inline-flex items-center gap-2 h-9 transition-all",
                      isAdminMode
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700",
                    )}
                  >
                    {isAdminMode ? (
                      <>
                        <Shield className="h-4 w-4" />
                        <span className="hidden lg:inline">Admin</span>
                      </>
                    ) : (
                      <>
                        <Crown className="h-4 w-4" />
                        <span className="hidden lg:inline">Cliente</span>
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Alternar modo ({isAdminMode ? "Cliente" : "Admin"})
                </TooltipContent>
              </Tooltip>
            )}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full p-0"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${user.name}`}
                      alt={user.name}
                    />
                    <AvatarFallback
                      className={cn(
                        isAdminMode
                          ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
                      )}
                    >
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 z-dropdown"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={isAdminMode ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {isAdminMode ? "Admin" : "Cliente"}
                      </Badge>
                      {isAdmin() && (
                        <Badge variant="outline" className="text-xs">
                          Administrador
                        </Badge>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                    <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Palette className="mr-2 h-4 w-4" />
                    <span>Personalizar</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setSearchOpen(true)}>
                    <Keyboard className="mr-2 h-4 w-4" />
                    <span>Busca Rápida</span>
                    <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Ajuda & Suporte</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Zap className="mr-2 h-4 w-4" />
                    <span>Novidades</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      v2025
                    </Badge>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {isAdmin() && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={toggleMode}>
                        {isAdminMode ? (
                          <>
                            <User className="mr-2 h-4 w-4" />
                            <span>Modo Cliente</span>
                          </>
                        ) : (
                          <>
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Modo Admin</span>
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <Building className="mr-2 h-4 w-4" />
                        <span>Painel Admin</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Command Search Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput
          placeholder="Digite um comando ou busque..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Navegação">
            {searchSuggestions.map((suggestion) => {
              const Icon = suggestion.icon;
              return (
                <CommandItem
                  key={suggestion.value}
                  value={suggestion.value}
                  onSelect={handleSearch}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{suggestion.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Ações">
            <CommandItem onSelect={() => setMode(isDark ? "light" : "dark")}>
              {isDark ? (
                <Sun className="mr-2 h-4 w-4" />
              ) : (
                <Moon className="mr-2 h-4 w-4" />
              )}
              <span>Alternar tema</span>
            </CommandItem>
            {isAdmin() && (
              <CommandItem onSelect={toggleMode}>
                {isAdminMode ? (
                  <User className="mr-2 h-4 w-4" />
                ) : (
                  <Shield className="mr-2 h-4 w-4" />
                )}
                <span>
                  Alternar para modo {isAdminMode ? "Cliente" : "Admin"}
                </span>
              </CommandItem>
            )}
            <CommandItem onSelect={() => navigate("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Abrir configurações</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
