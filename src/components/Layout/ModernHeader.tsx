/**
 * 🎯 MODERN HEADER - CABEÇALHO MODERNO
 *
 * Header baseado na imagem com:
 * - Busca global integrada
 * - Sistema de temas funcionais
 * - Menu de perfil completo
 * - Notificações em tempo real
 * - Design responsivo
 */

import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Settings,
  User,
  Menu,
  Sun,
  Moon,
  Monitor,
  LogOut,
  UserCircle,
  Palette,
  Accessibility,
  HelpCircle,
  MessageCircle,
  X,
  Maximize,
  ChevronDown,
} from "lucide-react";

// Theme utilities
import {
  loadThemeConfig,
  saveThemeConfig,
  applyThemeConfig,
  type ThemeConfig,
  type ThemeMode,
  type PrimaryColor,
} from "@/utils/themeUtils";

// Hook para localStorage
import { useLocalStorage } from "@/hooks/useLocalStorage";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";

// Types
interface ModernHeaderProps {
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
  className?: string;
}

interface NotificationItem {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Remove interface ThemeColors as it's no longer needed

// Mock Data
const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    type: "info",
    title: "Novo cliente cadastrado",
    message: "João Silva foi adicionado ao CRM",
    timestamp: "2 min atrás",
    read: false,
  },
  {
    id: "2",
    type: "warning",
    title: "Processo atualizado",
    message: "Processo 123457-88.2024 teve movimentação",
    timestamp: "5 min atrás",
    read: false,
  },
  {
    id: "3",
    type: "success",
    title: "Tarefa concluída",
    message: "Análise de contrato finalizada",
    timestamp: "10 min atrás",
    read: true,
  },
];

const THEME_COLORS: Array<{
  name: string;
  value: PrimaryColor;
  color: string;
}> = [
  {
    name: "Azul",
    value: "blue",
    color: "#3b82f6",
  },
  {
    name: "Verde",
    value: "green",
    color: "#10b981",
  },
  {
    name: "Roxo",
    value: "purple",
    color: "#8b5cf6",
  },
  {
    name: "Laranja",
    value: "orange",
    color: "#f59e0b",
  },
];

// Main Component
export const ModernHeader: React.FC<ModernHeaderProps> = ({
  onToggleSidebar,
  showSidebarToggle = true,
  className,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [themeConfig, setThemeConfig] = useLocalStorage<ThemeConfig>(
    "lawdesk-theme-config",
    loadThemeConfig(),
  );
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  // Theme Management
  const updateThemeConfig = useCallback(
    (updates: Partial<ThemeConfig>) => {
      const newConfig = { ...themeConfig, ...updates };
      setThemeConfig(newConfig);
      applyThemeConfig(newConfig);
    },
    [themeConfig, setThemeConfig],
  );

  const applyTheme = useCallback(
    (newTheme: ThemeMode) => {
      updateThemeConfig({ mode: newTheme });
    },
    [updateThemeConfig],
  );

  const applyPrimaryColor = useCallback(
    (color: PrimaryColor) => {
      updateThemeConfig({ primaryColor: color });
    },
    [updateThemeConfig],
  );

  // Notification Management
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Search Handler
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        // Implementar busca global
        console.log("Searching for:", searchQuery);
      }
    },
    [searchQuery],
  );

  const handleLogout = useCallback(() => {
    // Implementar logout
    localStorage.clear();
    navigate("/login");
  }, [navigate]);

  return (
    <header className={`bg-background border-b border-border/60 ${className}`}>
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle */}
          {showSidebarToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="p-2"
            >
              <Menu size={18} />
            </Button>
          )}

          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="Buscar em todo o sistema..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-9 pr-4 h-9 bg-accent/40 border-0 focus:bg-background focus:ring-1 focus:ring-ring"
            />
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Communication Widget */}
          <Button
            variant="ghost"
            size="sm"
            className="p-2"
            onClick={() => {
              // Implementar widget de comunicação
              console.log("Opening communication widget");
            }}
          >
            <MessageCircle size={18} />
          </Button>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="relative p-2">
                <Bell size={18} />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center p-0"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Notificações</h4>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      Marcar todas como lidas
                    </Button>
                  )}
                </div>
              </div>
              <ScrollArea className="h-64">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-border/60 cursor-pointer hover:bg-accent/40 ${
                      !notification.read ? "bg-accent/20" : ""
                    }`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === "info"
                            ? "bg-blue-500"
                            : notification.type === "warning"
                              ? "bg-yellow-500"
                              : notification.type === "error"
                                ? "bg-red-500"
                                : "bg-green-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </PopoverContent>
          </Popover>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 px-2"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/api/placeholder/32/32" alt="Cliente" />
                  <AvatarFallback className="text-xs">CL</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden md:block">
                  Cliente
                </span>
                <ChevronDown size={14} className="hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => navigate("/perfil")}>
                <UserCircle size={16} className="mr-2" />
                Perfil
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate("/configuracoes")}>
                <Settings size={16} className="mr-2" />
                Configurações
              </DropdownMenuItem>

              {/* Theme Submenu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Palette size={16} className="mr-2" />
                  Aparência
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-48">
                  <DropdownMenuLabel>Tema</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => applyTheme("light")}>
                    <Sun size={16} className="mr-2" />
                    Claro
                    {themeConfig.mode === "light" && (
                      <span className="ml-auto text-xs">✓</span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => applyTheme("dark")}>
                    <Moon size={16} className="mr-2" />
                    Escuro
                    {themeConfig.mode === "dark" && (
                      <span className="ml-auto text-xs">✓</span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => applyTheme("system")}>
                    <Monitor size={16} className="mr-2" />
                    Sistema
                    {themeConfig.mode === "system" && (
                      <span className="ml-auto text-xs">✓</span>
                    )}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Cor Principal</DropdownMenuLabel>
                  {THEME_COLORS.map((color) => (
                    <DropdownMenuItem
                      key={color.value}
                      onClick={() => applyPrimaryColor(color.value)}
                    >
                      <div
                        className="w-4 h-4 rounded-full mr-2 border"
                        style={{ backgroundColor: color.color }}
                      />
                      {color.name}
                      {themeConfig.primaryColor === color.value && (
                        <span className="ml-auto text-xs">✓</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuItem>
                <Accessibility size={16} className="mr-2" />
                Acessibilidade
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <HelpCircle size={16} className="mr-2" />
                Ajuda & Suporte
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400"
              >
                <LogOut size={16} className="mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;
