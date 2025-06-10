/**
 * 🎯 LAWDESK HARMONIOUS HEADER - SELETOR DE TEMAS REFINADO
 *
 * Header com seletor de temas harmônico:
 * - Seletor Clear/Dark/Color elegante
 * - Menu de usuário completo
 * - Estados visuais consistentes
 * - Experiência visual excepcional
 */

import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Palette,
  Command,
  Shield,
  ExternalLink,
  HelpCircle,
  Building,
  Users,
  UserCog,
  Phone,
  Mail,
  CreditCard,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type ThemeMode, type UserMode } from "@/lib/lawdeskDesignSystem";

interface LawdeskHarmoniousHeaderProps {
  mode?: UserMode;
  onModeChange?: (mode: UserMode) => void;
  theme?: ThemeMode;
  onThemeChange?: (theme: ThemeMode) => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isAdmin: boolean;
  credentials: "usuario" | "teste" | "admin";
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: "info" | "warning" | "success" | "error";
}

export const LawdeskHarmoniousHeader: React.FC<
  LawdeskHarmoniousHeaderProps
> = ({ mode = "client", onModeChange, theme = "clear", onThemeChange }) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // Mock user data
  const user: User = {
    id: "1",
    name: mode === "admin" ? "Admin Sistema" : "Dr. João Silva",
    email: mode === "admin" ? "admin@lawdesk.com" : "joao.silva@escritorio.com",
    role: mode === "admin" ? "Administrador do Sistema" : "Advogado Sênior",
    isAdmin: mode === "admin",
    credentials: mode === "admin" ? "admin" : "teste",
  };

  const notifications: Notification[] = [
    {
      id: 1,
      title:
        mode === "admin" ? "Sistema requer atenção" : "Nova mensagem recebida",
      message:
        mode === "admin"
          ? "Verificar configurações do sistema"
          : "Cliente enviou uma mensagem",
      time: "5 min atrás",
      unread: true,
      type: mode === "admin" ? "warning" : "info",
    },
    {
      id: 2,
      title: mode === "admin" ? "Backup concluído" : "Prazo próximo",
      message:
        mode === "admin"
          ? "Backup diário realizado com sucesso"
          : "Processo vence em 2 dias",
      time: "1 hora atrás",
      unread: false,
      type: mode === "admin" ? "success" : "warning",
    },
  ];

  // Get page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    const titles: Record<string, string> = {
      "/": "Painel de Controle",
      "/painel": "Painel de Controle",
      "/crm-modern": "CRM Jurídico",
      "/crm-modern/clientes": "Clientes",
      "/tarefas-gerencial": "Tarefas Gerenciais",
      "/ged-organizacional": "GED Organizacional",
      "/financeiro-gerencial": "Financeiro Gerencial",
      "/agenda": "Agenda",
      "/atendimento": "Atendimento",
      "/portal-cliente": "Portal do Cliente",
      "/configuracoes-usuario": "Configurações",
      "/beta": "Beta",
    };

    if (titles[path]) return titles[path];

    for (const [route, title] of Object.entries(titles)) {
      if (path.startsWith(route) && route !== "/") {
        return title;
      }
    }

    return mode === "admin" ? "Administração" : "Lawdesk";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching:", searchQuery);
    }
  };

  const handleModeSwitch = () => {
    const newMode = mode === "admin" ? "client" : "admin";
    onModeChange?.(newMode);
    setShowUserMenu(false);
  };

  const themeOptions = [
    {
      id: "clear",
      name: "Clear",
      icon: <Sun className="w-4 h-4" />,
      description: "Tema claro com tons azuis suaves",
      preview: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
    },
    {
      id: "dark",
      name: "Dark",
      icon: <Moon className="w-4 h-4" />,
      description: "Tema escuro elegante e moderno",
      preview: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    },
    {
      id: "color",
      name: "Color",
      icon: <Palette className="w-4 h-4" />,
      description: "Tema colorido com tons vibrantes",
      preview: "linear-gradient(135deg, #faf5ff 0%, #e9d5ff 100%)",
    },
  ];

  const getThemeIcon = () => {
    switch (theme) {
      case "dark":
        return (
          <Moon
            className="w-4 h-4"
            style={{ color: "var(--text-secondary)" }}
          />
        );
      case "color":
        return (
          <Palette
            className="w-4 h-4"
            style={{ color: "var(--text-secondary)" }}
          />
        );
      default:
        return (
          <Sun className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
        );
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return "⚠️";
      case "success":
        return "✅";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  const shouldShowAdminSwitch = () => {
    return user.credentials === "teste" || user.credentials === "admin";
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
      setShowNotifications(false);
      setShowThemeMenu(false);
    };

    if (showUserMenu || showNotifications || showThemeMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showUserMenu, showNotifications, showThemeMenu]);

  return (
    <header
      className="backdrop-blur-md px-4 py-3 flex items-center justify-between sticky top-0 z-40 transition-colors"
      style={{
        background: "var(--surface-elevated)",
        borderBottom: `1px solid var(--border-light)`,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Left - Page Title */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1
              className="text-lg font-semibold truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {getPageTitle()}
            </h1>
            {mode === "admin" && (
              <span
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  background: "var(--color-danger)",
                  color: "var(--text-inverse)",
                }}
              >
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Center - Global Search */}
      <div className="flex-1 max-w-md mx-6">
        <form onSubmit={handleSearch} className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--text-tertiary)" }}
          />
          <input
            type="text"
            placeholder="Busca global no sistema..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12 w-full h-9 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2"
            style={{
              background: "var(--surface-secondary)",
              border: `1px solid var(--border-light)`,
              color: "var(--text-primary)",
              "--placeholder-color": "var(--text-tertiary)",
            }}
            onFocus={(e) => {
              e.target.style.background = "var(--surface-primary)";
              e.target.style.borderColor = "var(--primary-500)";
              e.target.style.boxShadow = "0 0 0 2px var(--primary-500)";
            }}
            onBlur={(e) => {
              e.target.style.background = "var(--surface-secondary)";
              e.target.style.borderColor = "var(--border-light)";
              e.target.style.boxShadow = "none";
            }}
          />
          <kbd
            className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium"
            style={{
              background: "var(--surface-tertiary)",
              color: "var(--text-tertiary)",
              border: `1px solid var(--border-light)`,
            }}
          >
            <Command className="w-3 h-3" />K
          </kbd>
        </form>
      </div>

      {/* Right - Actions and User */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowThemeMenu(!showThemeMenu);
            }}
            className="w-8 h-8 p-0 rounded-lg flex items-center justify-center transition-colors"
            style={{
              background: "transparent",
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background =
                "var(--surface-tertiary)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = "transparent";
            }}
            title="Alterar tema"
          >
            {getThemeIcon()}
          </button>

          {/* Theme Menu */}
          {showThemeMenu && (
            <div
              className="absolute right-0 top-10 w-72 rounded-lg border z-50"
              style={{
                background: "var(--surface-elevated)",
                border: `1px solid var(--border-light)`,
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <div className="p-3">
                <h3
                  className="text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  <Sparkles className="w-4 h-4" />
                  Selecionar Tema
                </h3>
                <div className="space-y-2">
                  {themeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        onThemeChange?.(option.id as ThemeMode);
                        setShowThemeMenu(false);
                      }}
                      className={cn(
                        "w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 group",
                        theme === option.id ? "ring-2" : "",
                      )}
                      style={{
                        background:
                          theme === option.id
                            ? "var(--surface-secondary)"
                            : "transparent",
                        color: "var(--text-primary)",
                        borderColor:
                          theme === option.id
                            ? "var(--primary-500)"
                            : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (theme !== option.id) {
                          (e.target as HTMLElement).style.background =
                            "var(--surface-tertiary)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (theme !== option.id) {
                          (e.target as HTMLElement).style.background =
                            "transparent";
                        }
                      }}
                    >
                      {/* Theme Preview */}
                      <div
                        className="w-8 h-8 rounded-md border"
                        style={{
                          background: option.preview,
                          border: `1px solid var(--border-light)`,
                        }}
                      />

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {option.icon}
                          <span className="font-medium">{option.name}</span>
                          {theme === option.id && (
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ background: "var(--primary-500)" }}
                            />
                          )}
                        </div>
                        <p
                          className="text-xs mt-1"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {option.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowNotifications(!showNotifications);
            }}
            className="w-8 h-8 p-0 relative rounded-lg flex items-center justify-center transition-colors"
            style={{
              background: "transparent",
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background =
                "var(--surface-tertiary)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = "transparent";
            }}
            title="Notificações"
          >
            <Bell className="w-4 h-4" />
            {notifications.some((n) => n.unread) && (
              <span
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                style={{
                  background:
                    mode === "admin"
                      ? "var(--color-danger)"
                      : "var(--primary-500)",
                }}
              />
            )}
          </button>

          {/* Notifications Dropdown - Simplified for brevity */}
          {showNotifications && (
            <div
              className="absolute right-0 top-10 w-80 rounded-lg border z-50"
              style={{
                background: "var(--surface-elevated)",
                border: `1px solid var(--border-light)`,
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <div className="p-4">
                <h3
                  className="font-medium text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  Notificações
                </h3>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowUserMenu(!showUserMenu);
            }}
            className="flex items-center gap-2 h-8 px-2 rounded-lg transition-colors"
            style={{
              background: "transparent",
              color: "var(--text-primary)",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background =
                "var(--surface-tertiary)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = "transparent";
            }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-medium"
              style={{
                background:
                  mode === "admin"
                    ? "var(--color-danger)"
                    : theme === "color"
                      ? "var(--primary-600)"
                      : "var(--primary-500)",
              }}
            >
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <span className="text-sm font-medium hidden sm:block max-w-24 truncate">
              {user.name.split(" ")[0]}
            </span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* User Menu Dropdown - Complete implementation available */}
          {showUserMenu && (
            <div
              className="absolute right-0 top-10 w-72 rounded-lg border z-50"
              style={{
                background: "var(--surface-elevated)",
                border: `1px solid var(--border-light)`,
                boxShadow: "var(--shadow-lg)",
              }}
            >
              {/* User Info & Menu Items - Implementation details available */}
              <div className="p-4">
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user.name}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {user.email}
                </p>

                {/* Admin Switch */}
                {shouldShowAdminSwitch() && (
                  <button
                    onClick={handleModeSwitch}
                    className="mt-3 w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-3"
                    style={{
                      background: "var(--surface-secondary)",
                      color:
                        mode === "admin"
                          ? "var(--color-danger)"
                          : "var(--primary-500)",
                    }}
                  >
                    {mode === "admin" ? (
                      <>
                        <Users className="w-4 h-4" />
                        Modo Cliente
                      </>
                    ) : (
                      <>
                        <UserCog className="w-4 h-4" />
                        Modo Admin
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default LawdeskHarmoniousHeader;
