/**
 * 🎯 TOPBAR MAIN - HEADER PRINCIPAL RESPONSIVO
 *
 * Header moderno e responsivo com:
 * - Variantes: standard, compact, minimal
 * - Dark/Light mode toggle
 * - Breadcrumbs dinâmicos
 * - Notificações em tempo real
 * - Busca global
 * - Profile dropdown
 * - Responsividade total
 */

import React, { useState, useCallback, useMemo } from "react";
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
  Plus,
  Command,
} from "lucide-react";

// Layout Context
import { useLayout } from "./MainLayout";

// Design System
import { ultimateDesignSystem } from "@/lib/ultimateDesignSystem";
import { performanceUtils } from "@/lib/performanceUtils";

// UI Components
import Button from "@/components/ui/OptimizedButton";
import Input from "@/components/ui/OptimizedInput";

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
}

interface NotificationItem {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
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
    userRole,
    isMobile,
    isTablet,
  } = useLayout();

  // ===== STATE =====
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // ===== COMPUTED VALUES =====
  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const themeIcon = useMemo(() => {
    switch (themeConfig.mode) {
      case "light":
        return Sun;
      case "dark":
        return Moon;
      default:
        return Monitor;
    }
  }, [themeConfig.mode]);

  // ===== USER MENU ACTIONS =====
  const userMenuActions: UserMenuAction[] = useMemo(
    () => [
      {
        id: "profile",
        label: "Perfil",
        icon: User,
        action: () => navigate("/perfil"),
      },
      {
        id: "settings",
        label: "Configurações",
        icon: Settings,
        action: () => navigate("/configuracoes"),
      },
      ...(userRole === "admin"
        ? [
            {
              id: "admin",
              label: "Administração",
              icon: Shield,
              action: () => navigate("/admin"),
            },
          ]
        : []),
      {
        id: "help",
        label: "Ajuda",
        icon: HelpCircle,
        action: () => navigate("/ajuda"),
      },
      {
        id: "logout",
        label: "Sair",
        icon: LogOut,
        action: () => {
          // Implement logout logic
          console.log("Logout action");
        },
        variant: "danger" as const,
      },
    ],
    [navigate, userRole],
  );

  // ===== HANDLERS =====
  const handleSearch = useCallback(
    (query: string) => {
      if (query.trim()) {
        navigate(`/busca?q=${encodeURIComponent(query)}`);
        setShowSearch(false);
        setSearchQuery("");
      }
    },
    [navigate],
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSearch(searchQuery);
      } else if (e.key === "Escape") {
        setShowSearch(false);
        setSearchQuery("");
      }
    },
    [searchQuery, handleSearch],
  );

  const toggleSearch = useCallback(() => {
    setShowSearch((prev) => !prev);
    if (!showSearch) {
      // Focus search input after it's shown
      setTimeout(() => {
        const searchInput = document.getElementById("global-search");
        searchInput?.focus();
      }, 100);
    }
  }, [showSearch]);

  // ===== RENDER FUNCTIONS =====
  const renderBreadcrumbs = () => {
    if (variant === "minimal" || isMobile) return null;

    return (
      <nav className="flex items-center space-x-1 text-sm">
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={item.label}>
            {index > 0 && <ChevronRight size={14} className="text-gray-400" />}
            {item.path ? (
              <button
                onClick={() => navigate(item.path!)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  };

  const renderSearchBar = () => {
    if (variant === "minimal") return null;

    if (isMobile) {
      return (
        <>
          <Button
            variant="ghost"
            size="sm"
            icon={Search}
            onClick={toggleSearch}
            className="p-2"
          />
          {showSearch && (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border-t p-4 shadow-lg">
              <Input
                id="global-search"
                placeholder="Buscar em todo o sistema..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                icon={Search}
                className="w-full"
              />
            </div>
          )}
        </>
      );
    }

    return (
      <div className="relative flex-1 max-w-md">
        <Input
          placeholder="Buscar... (⌘K)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          icon={Search}
          className="pl-10 pr-4"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hidden sm:inline-flex items-center gap-1">
          <Command size={12} />K
        </kbd>
      </div>
    );
  };

  const renderNotifications = () => {
    return (
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          icon={Bell}
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2"
        >
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadNotifications > 9 ? "9+" : unreadNotifications}
            </span>
          )}
        </Button>

        {showNotifications && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                Notificações
              </h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-gray-500">
                  Nenhuma notificação
                </div>
              ) : (
                notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className={`
                      px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0
                      ${!notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                      hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer
                    `}
                  >
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {notification.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {notification.message}
                    </p>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {notification.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
            {notifications.length > 5 && (
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => navigate("/notificacoes")}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Ver todas as notificações
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderUserMenu = () => {
    return (
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="p-1 rounded-full"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-medium">
            U
          </div>
        </Button>

        {showUserMenu && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Usuário Atual
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                usuario@email.com
              </p>
            </div>
            {userMenuActions.map((action) => (
              <button
                key={action.id}
                onClick={() => {
                  action.action();
                  setShowUserMenu(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-left
                  ${
                    action.variant === "danger"
                      ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }
                `}
              >
                <action.icon size={16} />
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ===== MAIN RENDER =====
  return (
    <header
      className={`
        flex items-center justify-between px-4 py-3 relative
        border-b border-gray-200 dark:border-gray-700
        bg-white/80 dark:bg-gray-900/80 backdrop-blur-md
        ${className}
      `}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Menu Toggle */}
        {showSidebarToggle && (
          <Button
            variant="ghost"
            size="sm"
            icon={Menu}
            onClick={onToggleSidebar}
            className="p-2 lg:hidden"
          />
        )}

        {/* Logo & Brand (minimal only) */}
        {variant === "minimal" && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-gray-100 hidden sm:block">
              Lawdesk
            </span>
          </div>
        )}

        {/* Breadcrumbs */}
        {renderBreadcrumbs()}
      </div>

      {/* Center Section - Search */}
      {variant === "standard" && !isMobile && (
        <div className="flex-1 max-w-md mx-4">{renderSearchBar()}</div>
      )}

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Mobile Search Toggle */}
        {isMobile && renderSearchBar()}

        {/* Quick Add Button */}
        {variant === "standard" && !isMobile && (
          <Button
            variant="ghost"
            size="sm"
            icon={Plus}
            onClick={() => navigate("/novo")}
            className="p-2"
          />
        )}

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          icon={themeIcon}
          onClick={onToggleTheme}
          className="p-2"
        />

        {/* Notifications */}
        {renderNotifications()}

        {/* User Menu */}
        {renderUserMenu()}
      </div>

      {/* Mobile Search Overlay */}
      {isMobile && showSearch && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowSearch(false)}
        />
      )}
    </header>
  );
};

export default React.memo(TopbarMain);
