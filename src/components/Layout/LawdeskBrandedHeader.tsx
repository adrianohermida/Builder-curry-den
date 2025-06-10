/**
 * 🎯 LAWDESK BRANDED HEADER - MENU COMPLETO
 *
 * Header com branding Lawdesk refinado:
 * - Menu de usuário completo
 * - Sistema de temas integrado
 * - Links portal cliente e suporte
 * - Switch admin/cliente baseado em credenciais
 * - UX otimizada e responsiva
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
  Monitor,
  Users,
  MessageCircle,
  UserCog,
  Globe,
  Phone,
  Mail,
  CreditCard,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LawdeskBrandedHeaderProps {
  mode?: "client" | "admin";
  onModeChange?: (mode: "client" | "admin") => void;
  theme?: "light" | "dark" | "color";
  onThemeChange?: (theme: "light" | "dark" | "color") => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
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

export const LawdeskBrandedHeader: React.FC<LawdeskBrandedHeaderProps> = ({
  mode = "client",
  onModeChange,
  theme = "light",
  onThemeChange,
}) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // Mock user data based on credentials
  const user: User = {
    id: "1",
    name: mode === "admin" ? "Admin Sistema" : "Dr. João Silva",
    email: mode === "admin" ? "admin@lawdesk.com" : "joao.silva@escritorio.com",
    role: mode === "admin" ? "Administrador do Sistema" : "Advogado Sênior",
    isAdmin: mode === "admin",
    credentials: mode === "admin" ? "admin" : "teste", // ou "usuario" para usuário comum
  };

  const notifications: Notification[] = [
    {
      id: 1,
      title:
        mode === "admin" ? "Sistema requer atenção" : "Nova mensagem recebida",
      message:
        mode === "admin"
          ? "25 páginas órfãs detectadas"
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
    {
      id: 3,
      title: "Atualização disponível",
      message: "Nova versão do sistema disponível",
      time: "2 horas atrás",
      unread: false,
      type: "info",
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
      "/crm-modern/processos": "Processos",
      "/crm-modern/tarefas": "Tarefas",
      "/crm-modern/documentos": "Documentos",
      "/crm-modern/contratos": "Contratos",
      "/crm-modern/financeiro": "Financeiro",
      "/tarefas-gerencial": "Tarefas Gerenciais",
      "/ged-organizacional": "GED Organizacional",
      "/financeiro-gerencial": "Financeiro Gerencial",
      "/agenda": "Agenda",
      "/publicacoes": "Publicações",
      "/atendimento": "Atendimento",
      "/portal-cliente": "Portal do Cliente",
      "/configuracoes-usuario": "Configurações",
      "/beta": "Beta",
    };

    // Try exact match first
    if (titles[path]) return titles[path];

    // Try partial matches
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
      id: "light",
      name: "Claro",
      icon: <Sun className="w-4 h-4" />,
      description: "Tema claro com sobretom azul",
    },
    {
      id: "dark",
      name: "Escuro",
      icon: <Moon className="w-4 h-4" />,
      description: "Tema escuro elegante",
    },
    {
      id: "color",
      name: "Colorido",
      icon: <Palette className="w-4 h-4" />,
      description: "Tema colorido vibrante",
    },
  ];

  const getThemeIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className="w-4 h-4 text-slate-600" />;
      case "color":
        return <Palette className="w-4 h-4 text-slate-600" />;
      default:
        return <Sun className="w-4 h-4 text-slate-600" />;
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
      className={cn(
        "theme-bg/95 backdrop-blur-md border-b transition-colors elevated-1 px-4 py-3 flex items-center justify-between sticky top-0 z-40",
        "border-slate-200 dark:border-slate-700",
        mode === "admin" && "border-red-200 dark:border-red-800",
      )}
    >
      {/* Left - Page Title */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
              {getPageTitle()}
            </h1>
            {mode === "admin" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Busca global no sistema..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "pl-10 pr-12 w-full h-9 border rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 transition-all",
              theme === "dark"
                ? "bg-slate-800/50 border-slate-700 text-white focus:bg-slate-800 focus:ring-blue-400/20"
                : "theme-surface border-slate-200 focus:theme-bg focus:ring-blue-500/20",
            )}
          />
          <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-500 dark:text-slate-400">
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
            className={cn(
              "w-8 h-8 p-0 rounded-lg flex items-center justify-center transition-colors",
              "hover:theme-surface",
            )}
            title="Alterar tema"
          >
            {getThemeIcon()}
          </button>

          {/* Theme Menu */}
          {showThemeMenu && (
            <div className="absolute right-0 top-10 w-56 theme-bg rounded-lg elevated-3 border border-slate-200 dark:border-slate-700 z-50">
              <div className="p-2">
                {themeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      onThemeChange?.(option.id as "light" | "dark" | "color");
                      setShowThemeMenu(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-3",
                      theme === option.id
                        ? mode === "admin"
                          ? "theme-surface text-red-700 border border-red-200"
                          : theme === "color"
                            ? "theme-surface text-violet-700 border border-violet-200"
                            : "theme-surface text-blue-700 border border-blue-200"
                        : "text-slate-700 dark:text-slate-300 hover:theme-surface",
                    )}
                  >
                    {option.icon}
                    <div>
                      <div className="font-medium">{option.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {option.description}
                      </div>
                    </div>
                  </button>
                ))}
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
            className={cn(
              "w-8 h-8 p-0 relative rounded-lg flex items-center justify-center transition-colors",
              "hover:theme-surface",
            )}
            title="Notificações"
          >
            <Bell className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            {notifications.some((n) => n.unread) && (
              <span
                className={cn(
                  "absolute -top-1 -right-1 w-2 h-2 rounded-full",
                  mode === "admin" ? "bg-red-500" : "bg-blue-500",
                )}
              />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-10 w-80 theme-bg rounded-lg elevated-3 border border-slate-200 dark:border-slate-700 z-50">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm text-slate-900 dark:text-white">
                    Notificações
                  </h3>
                  <span className="text-xs theme-surface text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full">
                    {notifications.filter((n) => n.unread).length} novas
                  </span>
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto modern-scroll">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-3 hover:theme-surface cursor-pointer border-b border-slate-50 dark:border-slate-800 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-1">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {notification.title}
                          </p>
                          {notification.unread && (
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full",
                                mode === "admin" ? "bg-red-500" : "bg-blue-500",
                              )}
                            />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-slate-100 dark:border-slate-800">
                <button className="w-full text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Ver todas as notificações
                </button>
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
            className={cn(
              "flex items-center gap-2 h-8 px-2 rounded-lg transition-colors",
              "hover:theme-surface",
            )}
          >
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-medium",
                mode === "admin"
                  ? "bg-red-500"
                  : theme === "color"
                    ? "bg-violet-500"
                    : "bg-blue-500",
              )}
            >
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <span className="text-sm font-medium hidden sm:block max-w-24 truncate text-slate-700 dark:text-slate-300">
              {user.name.split(" ")[0]}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-600 dark:text-slate-400" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-10 w-72 theme-bg rounded-lg elevated-3 border border-slate-200 dark:border-slate-700 z-50">
              {/* User Info */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-medium",
                      mode === "admin"
                        ? "bg-red-500"
                        : theme === "color"
                          ? "bg-violet-500"
                          : "bg-blue-500",
                    )}
                  >
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </p>
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1",
                        mode === "admin"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                          : theme === "color"
                            ? "bg-violet-100 text-violet-800 dark:bg-violet-900/20 dark:text-violet-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
                      )}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <Link
                  to="/perfil"
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:theme-surface flex items-center gap-3 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User className="w-4 h-4" />
                  Meu Perfil
                </Link>

                <Link
                  to="/configuracoes-usuario"
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:theme-surface flex items-center gap-3 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings className="w-4 h-4" />
                  Configurações
                </Link>

                <Link
                  to="/assinatura"
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:theme-surface flex items-center gap-3 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <CreditCard className="w-4 h-4" />
                  Plano & Cobrança
                </Link>

                {/* Links Externos */}
                <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-2">
                  <a
                    href="https://portal.lawdesk.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:theme-surface flex items-center gap-3 transition-colors"
                  >
                    <Building className="w-4 h-4" />
                    Portal do Cliente
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>

                  <a
                    href="https://suporte.lawdesk.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:theme-surface flex items-center gap-3 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Central de Suporte
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>

                  <a
                    href="tel:+5511999999999"
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:theme-surface flex items-center gap-3 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    (11) 99999-9999
                  </a>

                  <a
                    href="https://docs.lawdesk.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:theme-surface flex items-center gap-3 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    Documentação
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                </div>

                {/* Admin Switch - apenas para credenciais teste ou admin */}
                {shouldShowAdminSwitch() && (
                  <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-2">
                    <button
                      onClick={handleModeSwitch}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm hover:theme-surface flex items-center gap-3 transition-colors",
                        mode === "admin"
                          ? "text-red-600 dark:text-red-400"
                          : "text-blue-600 dark:text-blue-400",
                      )}
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
                  </div>
                )}
              </div>

              {/* Logout */}
              <div className="border-t border-slate-100 dark:border-slate-800 py-2">
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Sair do Sistema
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default LawdeskBrandedHeader;
