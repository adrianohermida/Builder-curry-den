/**
 * 🎯 TOPBAR MAIN - HEADER PRINCIPAL RESTAURADO
 *
 * Header completamente refeito com:
 * - Design responsivo mobile-first
 * - Sistema de tema integrado
 * - Busca global funcional
 * - Notificações em tempo real
 * - Profile dropdown completo
 * - Breadcrumbs dinâmicos
 * - Performance otimizada
 */

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
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
  ChevronRight,
  LogOut,
  Shield,
  HelpCircle,
  Command,
  Palette,
  Accessibility,
  Home,
  X,
  Maximize,
  Volume2,
  VolumeX,
} from "lucide-react";

// Layout Context
import { useLayout } from "./MainLayout";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

// ===== TYPES =====
interface TopbarMainProps {
  variant?: "standard" | "compact" | "minimal";
  onToggleSidebar?: () => void;
  onToggleTheme?: () => void;
  showSidebarToggle?: boolean;
  className?: string;
}

interface UserMenuAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  action: () => void;
  variant?: "default" | "danger";
  shortcut?: string;
}

// ===== TOPBAR MAIN COMPONENT =====
const TopbarMain: React.FC<TopbarMainProps> = ({
  variant = "standard",
  onToggleSidebar,
  onToggleTheme,
  showSidebarToggle = true,
  className = "",
}) => {
  const navigate = useNavigate();
  const {
    breadcrumbs,
    notifications,
    themeConfig,
    updateThemeConfig,
    userRole,
    isMobile,
    isTablet,
    layoutConfig,
  } = useLayout();

  // ===== STATE =====
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // ===== REFS =====
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ===== COMPUTED VALUES =====
  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const isCompact = variant === "compact" || isMobile;
  const isMinimal = variant === "minimal";

  // ===== SEARCH FUNCTIONALITY =====
  const handleSearchToggle = useCallback(() => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [showSearch]);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        // Navigate to search results or perform global search
        navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
        setShowSearch(false);
        setSearchQuery("");
      }
    },
    [searchQuery, navigate],
  );

  // ===== THEME CONTROLS =====
  const handleThemeChange = useCallback(
    (mode: "light" | "dark" | "system") => {
      updateThemeConfig({ mode });
    },
    [updateThemeConfig],
  );

  const toggleHighContrast = useCallback(() => {
    updateThemeConfig({ highContrast: !themeConfig.highContrast });
  }, [themeConfig.highContrast, updateThemeConfig]);

  const toggleReducedMotion = useCallback(() => {
    updateThemeConfig({ reducedMotion: !themeConfig.reducedMotion });
  }, [themeConfig.reducedMotion, updateThemeConfig]);

  // ===== FULLSCREEN TOGGLE =====
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // ===== USER MENU ACTIONS =====
  const userMenuActions: UserMenuAction[] = useMemo(
    () => [
      {
        id: "profile",
        label: "Meu Perfil",
        icon: User,
        action: () => navigate("/perfil"),
        shortcut: "⌘P",
      },
      {
        id: "settings",
        label: "Configurações",
        icon: Settings,
        action: () => navigate("/configuracoes"),
        shortcut: "⌘,",
      },
      {
        id: "help",
        label: "Central de Ajuda",
        icon: HelpCircle,
        action: () => navigate("/ajuda"),
        shortcut: "F1",
      },
      {
        id: "logout",
        label: "Sair",
        icon: LogOut,
        action: () => {
          // Handle logout
          console.log("Logout");
        },
        variant: "danger",
        shortcut: "⌘Q",
      },
    ],
    [navigate],
  );

  // ===== KEYBOARD SHORTCUTS =====
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Global search shortcut
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        handleSearchToggle();
      }

      // Theme toggle shortcut
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault();
        onToggleTheme?.();
      }

      // Sidebar toggle shortcut
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        onToggleSidebar?.();
      }

      // Escape to close search
      if (e.key === "Escape" && showSearch) {
        setShowSearch(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [handleSearchToggle, onToggleTheme, onToggleSidebar, showSearch]);

  // ===== FULLSCREEN LISTENER =====
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // ===== RENDER BREADCRUMBS =====
  const renderBreadcrumbs = () => {
    if (isMinimal || isCompact) return null;

    return (
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path || index}>
              <BreadcrumbItem>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage className="font-medium">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={crumb.path}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && (
                <BreadcrumbSeparator>
                  <ChevronRight size={14} />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  };

  // ===== RENDER NOTIFICATIONS =====
  const renderNotifications = () => (
    <Popover open={showNotifications} onOpenChange={setShowNotifications}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 p-0"
          aria-label="Notificações"
        >
          <Bell size={18} />
          {unreadNotifications > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
            >
              {unreadNotifications > 9 ? "9+" : unreadNotifications}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Notificações</h3>
          <p className="text-sm text-muted-foreground">
            {unreadNotifications} nova(s) notificação(ões)
          </p>
        </div>
        <ScrollArea className="h-64">
          {notifications.length > 0 ? (
            <div className="p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg mb-2 border ${
                    !notification.read ? "bg-accent/50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.timestamp).toLocaleTimeString(
                          "pt-BR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Bell size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma notificação</p>
            </div>
          )}
        </ScrollArea>
        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Button variant="ghost" size="sm" className="w-full">
              Ver todas as notificações
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );

  // ===== RENDER USER MENU =====
  const renderUserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 w-9 rounded-full p-0"
          aria-label="Menu do usuário"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              UA
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div>
            <p className="font-medium">Usuário Admin</p>
            <p className="text-xs text-muted-foreground">
              admin@lawdesk.com.br
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {userMenuActions.map((action) => (
          <DropdownMenuItem
            key={action.id}
            onClick={action.action}
            className={
              action.variant === "danger"
                ? "text-destructive focus:text-destructive"
                : ""
            }
          >
            <action.icon size={16} className="mr-2" />
            <span className="flex-1">{action.label}</span>
            {action.shortcut && (
              <span className="text-xs text-muted-foreground">
                {action.shortcut}
              </span>
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        {/* Theme Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette size={16} className="mr-2" />
            <span>Tema</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => handleThemeChange("light")}>
              <Sun size={16} className="mr-2" />
              <span>Claro</span>
              {themeConfig.mode === "light" && (
                <span className="ml-auto">✓</span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
              <Moon size={16} className="mr-2" />
              <span>Escuro</span>
              {themeConfig.mode === "dark" && (
                <span className="ml-auto">✓</span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleThemeChange("system")}>
              <Monitor size={16} className="mr-2" />
              <span>Sistema</span>
              {themeConfig.mode === "system" && (
                <span className="ml-auto">✓</span>
              )}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Accessibility Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Accessibility size={16} className="mr-2" />
            <span>Acessibilidade</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={toggleHighContrast}>
              <div className="flex items-center justify-between w-full">
                <span>Alto Contraste</span>
                <Switch
                  checked={themeConfig.highContrast}
                  onCheckedChange={toggleHighContrast}
                  size="sm"
                />
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleReducedMotion}>
              <div className="flex items-center justify-between w-full">
                <span>Reduzir Animações</span>
                <Switch
                  checked={themeConfig.reducedMotion}
                  onCheckedChange={toggleReducedMotion}
                  size="sm"
                />
              </div>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div
      className={`
        topbar-container h-16 flex items-center justify-between px-4
        border-b border-topbar-border bg-topbar-background/95 backdrop-blur-sm
        ${layoutConfig.sidebarVariant === "expanded" && !isMobile ? "left-64" : layoutConfig.sidebarVariant === "collapsed" ? "left-16" : "left-0"}
        transition-all duration-300 ease-in-out
        ${className}
      `}
    >
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Sidebar Toggle */}
        {showSidebarToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="h-9 w-9 p-0"
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </Button>
        )}

        {/* Breadcrumbs */}
        <div className="hidden md:block">{renderBreadcrumbs()}</div>

        {/* Mobile Title */}
        {isMobile && (
          <div>
            <h1 className="font-semibold text-lg">
              {breadcrumbs[breadcrumbs.length - 1]?.label || "Lawdesk CRM"}
            </h1>
          </div>
        )}
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-md mx-4">
        {showSearch ? (
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar em todo o sistema..."
              className="pr-20"
              autoFocus
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowSearch(false)}
                className="h-6 w-6 p-0"
              >
                <X size={14} />
              </Button>
            </div>
          </form>
        ) : (
          <Button
            variant="outline"
            onClick={handleSearchToggle}
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <Search size={16} className="mr-2" />
            <span>Buscar...</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        {/* Quick Actions */}
        {!isMobile && (
          <>
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleTheme}
              className="h-9 w-9 p-0"
              aria-label="Toggle theme"
            >
              {themeConfig.mode === "dark" ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </Button>

            {/* Sound Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="h-9 w-9 p-0"
              aria-label="Toggle sound"
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </Button>

            {/* Fullscreen Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="h-9 w-9 p-0"
              aria-label="Toggle fullscreen"
            >
              <Maximize size={18} />
            </Button>
          </>
        )}

        {/* Notifications */}
        {renderNotifications()}

        {/* User Menu */}
        {renderUserMenu()}
      </div>
    </div>
  );
};

export default TopbarMain;
