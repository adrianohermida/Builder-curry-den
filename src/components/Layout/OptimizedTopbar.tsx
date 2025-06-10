/**
 * 🔝 OPTIMIZED TOPBAR - TOPBAR SAAS 2025+ OTIMIZADO
 *
 * Topbar moderno e performático com:
 * - Design minimalista
 * - Performance otimizada
 * - Responsive design
 * - Acessibilidade completa
 * - Feedback visual claro
 */

import React, { memo, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  Menu,
  Bell,
  Settings,
  User,
  ChevronDown,
  Scale,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";

// Optimized components
import { Button } from "@/components/ui/optimized/Button";

// UI Components
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

// Layout context
import { useOptimizedLayout } from "./OptimizedLayout";

// Theme system
import { useTheme } from "@/lib/themeSystem";

// Design tokens
import designTokens from "@/design/tokens";

// ===== PAGE TITLES =====
const PAGE_TITLES: Record<string, string> = {
  "/painel": "Painel de Controle",
  "/feed": "Feed Colaborativo",
  "/crm-modern": "CRM Jurídico",
  "/agenda": "Agenda",
  "/publicacoes": "Publicações",
  "/atendimento": "Comunicação",
  "/analytics": "Relatórios",
  "/beta": "Recursos Beta",
  "/configuracoes": "Configurações",
  "/configuracao-armazenamento": "Armazenamento",
  "/ajuda": "Central de Ajuda",
} as const;

// ===== MOCK DATA =====
const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "Nova mensagem recebida",
    description: "Ana Silva enviou uma mensagem",
    time: "2 min",
    type: "message" as const,
    unread: true,
  },
  {
    id: "2",
    title: "Processo atualizado",
    description: "Novo andamento no processo 1234567-89.2024",
    time: "15 min",
    type: "process" as const,
    unread: true,
  },
  {
    id: "3",
    title: "Reunião em 30 minutos",
    description: "Reunião com cliente João Silva",
    time: "30 min",
    type: "event" as const,
    unread: false,
  },
] as const;

// ===== OPTIMIZED TOPBAR COMPONENT =====
const OptimizedTopbar: React.FC = memo(() => {
  const location = useLocation();
  const { toggleSidebar } = useOptimizedLayout();
  const {
    config: themeConfig,
    colors,
    isAdminMode,
    switchToClientView,
    switchToAdminView,
    setThemeMode,
  } = useTheme();

  // Page title
  const pageTitle = useMemo(() => {
    return PAGE_TITLES[location.pathname] || "Lawdesk";
  }, [location.pathname]);

  // Unread notifications count
  const unreadCount = useMemo(() => {
    return MOCK_NOTIFICATIONS.filter((n) => n.unread).length;
  }, []);

  // Theme toggle handler
  const handleThemeToggle = () => {
    const newTheme =
      themeConfig.themeMode === "light"
        ? "dark"
        : themeConfig.themeMode === "dark"
          ? "system"
          : "light";
    setThemeMode(newTheme);
  };

  // Mode switch handlers
  const handleModeSwitch = () => {
    if (isAdminMode()) {
      switchToClientView();
    } else {
      switchToAdminView();
    }
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60"
      style={{
        backgroundColor: `${colors.background}F5`, // 95% opacity
        borderBottomColor: colors.border,
      }}
    >
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Logo + Menu */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: colors.primary }}
              >
                <Scale size={18} className="text-white" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span
                  className="text-lg font-bold leading-tight"
                  style={{ color: colors.primary }}
                >
                  Lawdesk
                </span>
                <span
                  className="text-xs leading-none"
                  style={{ color: colors.accent }}
                >
                  CRM Jurídico
                </span>
              </div>
            </div>

            {/* Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8"
              aria-label="Toggle sidebar"
            >
              <Menu size={18} />
            </Button>
          </div>

          {/* Page Title */}
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-gray-900">{pageTitle}</h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            className="h-8 w-8"
            aria-label="Toggle theme"
          >
            {themeConfig.themeMode === "light" ? (
              <Sun size={16} />
            ) : themeConfig.themeMode === "dark" ? (
              <Moon size={16} />
            ) : (
              <Monitor size={16} />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-8 w-8"
                aria-label={`Notificações${unreadCount > 0 ? ` (${unreadCount} não lidas)` : ""}`}
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-5 w-5 p-0 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                {MOCK_NOTIFICATIONS.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start p-3 space-y-1"
                  >
                    <div className="flex w-full items-start justify-between">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600">
                          {notification.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {notification.time}
                        </p>
                      </div>
                      {notification.unread && (
                        <div className="h-2 w-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center">
                Ver todas as notificações
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="Configurações"
          >
            <Settings size={16} />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full p-0"
                aria-label="Menu do usuário"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/user.jpg" alt="Usuário" />
                  <AvatarFallback
                    style={{
                      backgroundColor: colors.primary,
                      color: "white",
                    }}
                  >
                    U
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {isAdminMode() ? "Admin User" : "User Cliente"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {isAdminMode() ? "admin@lawdesk.com" : "user@lawdesk.com"}
                  </p>
                  <Badge
                    variant="outline"
                    className="w-fit text-xs"
                    style={{
                      borderColor: colors.primary,
                      color: colors.primary,
                    }}
                  >
                    {isAdminMode() ? "Modo Admin" : "Modo Cliente"}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <User size={16} className="mr-2" />
                Perfil
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Settings size={16} className="mr-2" />
                Configurações
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleModeSwitch}>
                <ChevronDown size={16} className="mr-2" />
                {isAdminMode() ? "🔄 Ver como Cliente" : "🔄 Voltar ao Admin"}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="text-red-600">Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
});

OptimizedTopbar.displayName = "OptimizedTopbar";

export default OptimizedTopbar;
