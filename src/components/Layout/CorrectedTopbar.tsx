/**
 * 🔝 CORRECTED TOPBAR - HEADER RESPONSIVO CORRIGIDO
 *
 * Topbar totalmente responsivo com:
 * - Touch-friendly (44px+ targets)
 * - Cores sólidas do tema
 * - Mobile-first design
 * - Acessibilidade completa
 * - Performance otimizada
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
  Palette,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
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
import { useCorrectedLayout } from "./CorrectedLayout";

// Theme system
import { useCorrectedTheme } from "@/lib/correctedThemeSystem";

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

// ===== MOCK NOTIFICATIONS =====
const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "Nova mensagem",
    description: "Ana Silva enviou uma mensagem",
    time: "2 min",
    unread: true,
  },
  {
    id: "2",
    title: "Processo atualizado",
    description: "Novo andamento no processo 1234567",
    time: "15 min",
    unread: true,
  },
  {
    id: "3",
    title: "Reunião em 30 min",
    description: "Reunião com cliente João Silva",
    time: "30 min",
    unread: false,
  },
] as const;

// ===== CORRECTED TOPBAR COMPONENT =====
const CorrectedTopbar: React.FC = memo(() => {
  const location = useLocation();
  const { toggleSidebar, layoutState } = useCorrectedLayout();
  const {
    config,
    colors,
    isAdminMode,
    toggleUserMode,
    setMode,
    toggleMode,
    setFontSize,
  } = useCorrectedTheme();

  // Page title
  const pageTitle = useMemo(() => {
    return PAGE_TITLES[location.pathname] || "Lawdesk";
  }, [location.pathname]);

  // Unread notifications count
  const unreadCount = useMemo(() => {
    return MOCK_NOTIFICATIONS.filter((n) => n.unread).length;
  }, []);

  // Theme icon
  const ThemeIcon = useMemo(() => {
    switch (config.mode) {
      case "light":
        return Sun;
      case "dark":
        return Moon;
      case "high-contrast":
        return Palette;
      default:
        return Monitor;
    }
  }, [config.mode]);

  // Topbar styles
  const topbarStyle = useMemo(
    () => ({
      backgroundColor: colors.card,
      borderBottomColor: colors.border,
      color: colors.cardForeground,
    }),
    [colors],
  );

  // Logo style
  const logoStyle = useMemo(
    () => ({
      backgroundColor: colors.primary,
    }),
    [colors.primary],
  );

  const logoTextStyle = useMemo(
    () => ({
      color: colors.primary,
    }),
    [colors.primary],
  );

  const logoSubtitleStyle = useMemo(
    () => ({
      color: colors.accent,
    }),
    [colors.accent],
  );

  return (
    <header
      className="topbar sticky top-0 z-50 w-full border-b"
      style={topbarStyle}
    >
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Logo + Brand */}
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={logoStyle}
            >
              <Scale size={18} className="text-white" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span
                className="text-lg font-bold leading-tight"
                style={logoTextStyle}
              >
                Lawdesk
              </span>
              <span className="text-xs leading-none" style={logoSubtitleStyle}>
                CRM Jurídico
              </span>
            </div>
          </div>

          {/* Menu Toggle - Touch-friendly */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="touch-target h-11 w-11 rounded-lg"
            aria-label={layoutState.sidebarOpen ? "Fechar menu" : "Abrir menu"}
            style={{ color: colors.foreground }}
          >
            <Menu size={20} />
          </Button>

          {/* Page Title - Hidden on small screens */}
          <div className="hidden md:block">
            <h1
              className="text-lg font-semibold"
              style={{ color: colors.foreground }}
            >
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMode}
            className="touch-target h-11 w-11 rounded-lg"
            aria-label={`Alternar tema (atual: ${config.mode})`}
            style={{ color: colors.foreground }}
          >
            <ThemeIcon size={18} />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative touch-target h-11 w-11 rounded-lg"
                aria-label={`Notificações${unreadCount > 0 ? ` (${unreadCount} não lidas)` : ""}`}
                style={{ color: colors.foreground }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-5 w-5 p-0 text-xs"
                    style={{
                      backgroundColor: colors.destructive,
                      color: "white",
                    }}
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.cardForeground,
              }}
            >
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator
                style={{ backgroundColor: colors.border }}
              />
              <div className="max-h-64 overflow-y-auto">
                {MOCK_NOTIFICATIONS.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start p-3 space-y-1 cursor-pointer"
                  >
                    <div className="flex w-full items-start justify-between">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">
                          {notification.title}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: colors.mutedForeground }}
                        >
                          {notification.description}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: colors.mutedForeground }}
                        >
                          {notification.time}
                        </p>
                      </div>
                      {notification.unread && (
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: colors.primary }}
                        />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator
                style={{ backgroundColor: colors.border }}
              />
              <DropdownMenuItem className="justify-center">
                Ver todas as notificações
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            className="touch-target h-11 w-11 rounded-lg"
            aria-label="Configurações"
            style={{ color: colors.foreground }}
          >
            <Settings size={18} />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative touch-target h-11 w-11 rounded-full p-0"
                aria-label="Menu do usuário"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/user.jpg" alt="Usuário" />
                  <AvatarFallback style={{ backgroundColor: colors.primary }}>
                    <User size={18} className="text-white" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.cardForeground,
              }}
            >
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {isAdminMode ? "Admin User" : "User Cliente"}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: colors.mutedForeground }}
                  >
                    {isAdminMode ? "admin@lawdesk.com" : "user@lawdesk.com"}
                  </p>
                  <Badge
                    variant="outline"
                    className="w-fit text-xs"
                    style={{
                      borderColor: colors.primary,
                      color: colors.primary,
                      backgroundColor: "transparent",
                    }}
                  >
                    {isAdminMode ? "🔴 Modo Admin" : "🔵 Modo Cliente"}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator
                style={{ backgroundColor: colors.border }}
              />

              <DropdownMenuItem>
                <User size={16} className="mr-2" />
                Perfil
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Settings size={16} className="mr-2" />
                Configurações
              </DropdownMenuItem>

              <DropdownMenuSeparator
                style={{ backgroundColor: colors.border }}
              />

              {/* Theme Options */}
              <DropdownMenuItem onClick={() => setMode("light")}>
                <Sun size={16} className="mr-2" />
                Tema Claro
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setMode("dark")}>
                <Moon size={16} className="mr-2" />
                Tema Escuro
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setMode("high-contrast")}>
                <Palette size={16} className="mr-2" />
                Alto Contraste
              </DropdownMenuItem>

              <DropdownMenuSeparator
                style={{ backgroundColor: colors.border }}
              />

              {/* Font Size Options */}
              <DropdownMenuItem onClick={() => setFontSize("sm")}>
                Fonte Pequena
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setFontSize("base")}>
                Fonte Normal
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setFontSize("lg")}>
                Fonte Grande
              </DropdownMenuItem>

              <DropdownMenuSeparator
                style={{ backgroundColor: colors.border }}
              />

              <DropdownMenuItem onClick={toggleUserMode}>
                <ChevronDown size={16} className="mr-2" />
                {isAdminMode ? "🔄 Ver como Cliente" : "🔄 Voltar ao Admin"}
              </DropdownMenuItem>

              <DropdownMenuSeparator
                style={{ backgroundColor: colors.border }}
              />

              <DropdownMenuItem
                className="text-red-600"
                style={{ color: colors.destructive }}
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Page Title */}
      {layoutState.isMobile && (
        <div
          className="md:hidden px-4 pb-2 border-t"
          style={{
            borderTopColor: colors.border,
            backgroundColor: colors.muted,
          }}
        >
          <h1
            className="text-sm font-medium truncate"
            style={{ color: colors.foreground }}
          >
            {pageTitle}
          </h1>
        </div>
      )}
    </header>
  );
});

CorrectedTopbar.displayName = "CorrectedTopbar";

export default CorrectedTopbar;
