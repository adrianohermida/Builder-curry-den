import React, { useState } from "react";
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

  let user = { name: "Usuário", email: "usuario@lawdesk.com" };
  let isAdmin = () => false;

  try {
    const permissions = usePermissions();
    user = permissions.user || user;
    isAdmin = permissions.isAdmin;
  } catch (error) {
    console.warn("Permissions context not available");
  }

  // Search command suggestions
  const searchSuggestions = [
    { label: "Buscar clientes", value: "clientes", href: "/crm/clientes" },
    { label: "Buscar processos", value: "processos", href: "/crm/processos" },
    { label: "Buscar contratos", value: "contratos", href: "/crm/contratos" },
    { label: "Agenda", value: "agenda", href: "/agenda" },
    { label: "Documentos", value: "documentos", href: "/ged-juridico" },
    { label: "IA Jurídico", value: "ia", href: "/ai-enhanced" },
    { label: "Configurações", value: "configuracoes", href: "/settings" },
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
      "/ged-juridico": "GED Jurídico",
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
    console.log("Logout");
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "transition-all duration-200",
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
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>

            {/* Page Title */}
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold text-foreground">
                {getPageTitle()}
              </h1>
              {isAdminMode && (
                <p className="text-sm text-muted-foreground">
                  Modo Administrativo
                </p>
              )}
            </div>

            {/* Mode Badge */}
            {isAdminMode && (
              <Badge
                variant="destructive"
                className="hidden sm:inline-flex items-center gap-1"
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
                  "hover:bg-muted/50 transition-colors",
                )}
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
                  className="h-9 w-9 p-0"
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
                  className="h-9 w-9 p-0 relative"
                >
                  <Bell className="h-4 w-4" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notificações (3 novas)</TooltipContent>
            </Tooltip>

            {/* Mode Toggle for Admin */}
            {isAdmin() && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isAdminMode ? "destructive" : "outline"}
                    size="sm"
                    onClick={toggleMode}
                    className="hidden sm:inline-flex items-center gap-2 h-9"
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
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
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
                  <DropdownMenuItem>
                    <Keyboard className="mr-2 h-4 w-4" />
                    <span>Atalhos</span>
                    <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Ajuda</span>
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
            {searchSuggestions.map((suggestion) => (
              <CommandItem
                key={suggestion.value}
                value={suggestion.value}
                onSelect={handleSearch}
              >
                <Search className="mr-2 h-4 w-4" />
                <span>{suggestion.label}</span>
              </CommandItem>
            ))}
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

      {/* Global Keyboard Shortcuts */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('keydown', function(e) {
              if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('open-search'));
              }
            });
            
            window.addEventListener('open-search', function() {
              setSearchOpen(true);
            });
          `,
        }}
      />
    </>
  );
}
