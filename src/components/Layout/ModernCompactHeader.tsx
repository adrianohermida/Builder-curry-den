/**
 * 🎯 MODERN COMPACT HEADER - SISTEMA COMPLETO
 *
 * Header moderno com:
 * - Menu de usuário completo
 * - Switch admin/cliente
 * - Sistema de temas (claro/escuro/colorido)
 * - Links portal cliente e suporte
 * - Zero amarelo
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernCompactHeaderProps {
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

export const ModernCompactHeader: React.FC<ModernCompactHeaderProps> = ({
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

  const notifications = [
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
      description: "Tema claro",
    },
    {
      id: "dark",
      name: "Escuro",
      icon: <Moon className="w-4 h-4" />,
      description: "Tema escuro",
    },
    {
      id: "color",
      name: "Colorido",
      icon: <Palette className="w-4 h-4" />,
      description: "Tema colorido",
    },
  ];

  const getThemeIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className="w-4 h-4 text-gray-600" />;
      case "color":
        return <Palette className="w-4 h-4 text-gray-600" />;
      default:
        return <Sun className="w-4 h-4 text-gray-600" />;
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
        "bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 transition-colors",
        mode === "admin" && "border-red-200",
        theme === "dark" && "bg-gray-900/95 border-gray-800",
        theme === "color" && "bg-gradient-to-r from-blue-50 to-purple-50",
      )}
    >
      {/* Left - Page Title */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1
              className={cn(
                "text-lg font-semibold truncate",
                theme === "dark" ? "text-white" : "text-gray-900",
              )}
            >
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Busca global no sistema..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "pl-10 pr-12 w-full h-9 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
              theme === "dark"
                ? "bg-gray-800/50 border-gray-700 text-white focus:bg-gray-800 focus:border-blue-400"
                : "bg-gray-50/50 border-gray-200 focus:bg-white focus:border-blue-300",
            )}
          />
          <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
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
              theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100",
            )}
            title="Alterar tema"
          >
            {getThemeIcon()}
          </button>

          {/* Theme Menu */}
          {showThemeMenu && (
            <div className="absolute right-0 top-10 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="p-2">
                {themeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      onThemeChange?.(option.id as "light" | "dark" | "color");
                      setShowThemeMenu(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2",
                      theme === option.id
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
                    )}
                  >
                    {option.icon}
                    <span>{option.name}</span>
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
              theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100",
            )}
            title="Notificações"
          >
            <Bell
              className={cn(
                "w-4 h-4",
                theme === "dark" ? "text-gray-300" : "text-gray-600",
              )}
            />
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
            <div className="absolute right-0 top-10 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm text-gray-900 dark:text-white">
                    Notificações
                  </h3>
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                    {notifications.filter((n) => n.unread).length}
                  </span>
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-50 dark:border-gray-800 last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                          notification.unread
                            ? mode === "admin"
                              ? "bg-red-500"
                              : "bg-blue-500"
                            : "bg-gray-300",
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                <button className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
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
              theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100",
            )}
          >
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                mode === "admin" ? "bg-red-500" : "bg-blue-500",
              )}
            >
              <span className="text-xs font-medium text-white">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            </div>
            <span
              className={cn(
                "text-sm font-medium hidden sm:block max-w-24 truncate",
                theme === "dark" ? "text-gray-300" : "text-gray-700",
              )}
            >
              {user.name.split(" ")[0]}
            </span>
            <ChevronDown
              className={cn(
                "w-3 h-3",
                theme === "dark" ? "text-gray-400" : "text-gray-600",
              )}
            />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-10 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              {/* User Info */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      mode === "admin" ? "bg-red-500" : "bg-blue-500",
                    )}
                  >
                    <span className="text-sm font-medium text-white">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1",
                        mode === "admin"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
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
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User className="w-4 h-4" />
                  Meu Perfil
                </Link>

                <Link
                  to="/configuracoes-usuario"
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings className="w-4 h-4" />
                  Configurações
                </Link>

                {/* Links Externos */}
                <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-2">
                  <a
                    href="/portal-cliente"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
                  >
                    <Building className="w-4 h-4" />
                    Portal do Cliente
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>

                  <a
                    href="/suporte"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Suporte
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                </div>

                {/* Admin Switch - apenas para credenciais teste ou admin */}
                {shouldShowAdminSwitch() && (
                  <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-2">
                    <button
                      onClick={handleModeSwitch}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors",
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
              <div className="border-t border-gray-100 dark:border-gray-800 py-2">
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

export default ModernCompactHeader;
