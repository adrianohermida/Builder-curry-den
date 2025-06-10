/**
 * 🎯 DEFINITIVE HEADER - CLEAN AND FUNCTIONAL
 *
 * Header definitivo e funcional:
 * - Nome dinâmico da página
 * - Busca global única
 * - Menu de usuário FIXO
 * - Zero movimentos laterais
 * - Design limpo e moderno
 */

import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Command,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DefinitiveHeaderProps {
  mode?: "client" | "admin";
}

export const DefinitiveHeader: React.FC<DefinitiveHeaderProps> = ({
  mode = "client",
}) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock user data
  const user = {
    name: mode === "admin" ? "Admin Sistema" : "Dr. João Silva",
    email: mode === "admin" ? "admin@lawdesk.com" : "joao.silva@escritorio.com",
    role: mode === "admin" ? "Administrador" : "Advogado Sênior",
    notifications: mode === "admin" ? 8 : 3,
  };

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
      "/agenda": "Agenda",
      "/publicacoes": "Publicações",
      "/atendimento": "Atendimento",
      "/configuracoes-usuario": "Configurações",
      "/tempo": "Controle de Tempo",
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

  return (
    <header
      className={cn(
        "bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40",
        mode === "admin" && "border-red-200",
      )}
    >
      {/* Left - Page Title */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {getPageTitle()}
            </h1>
            {mode === "admin" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
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
            className="pl-10 pr-12 w-full h-9 bg-gray-50/50 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
          />
          <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-500">
            <Command className="w-3 h-3" />K
          </kbd>
        </form>
      </div>

      {/* Right - Actions and User */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button className="w-8 h-8 p-0 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors">
          <Sun className="w-4 h-4 text-gray-600" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-8 h-8 p-0 relative hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
          >
            <Bell className="w-4 h-4 text-gray-600" />
            {user.notifications > 0 && (
              <span
                className={cn(
                  "absolute -top-1 -right-1 w-2 h-2 rounded-full",
                  mode === "admin" ? "bg-red-500" : "bg-blue-500",
                )}
              ></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-10 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">Notificações</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {user.notifications}
                  </span>
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                        mode === "admin" ? "bg-red-500" : "bg-blue-500",
                      )}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {mode === "admin"
                          ? "Sistema requer atenção"
                          : "Nova mensagem recebida"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {mode === "admin"
                          ? "25 páginas órfãs detectadas"
                          : "Cliente enviou uma mensagem"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">5 min atrás</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 border-t border-gray-100">
                <button className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Ver todas as notificações
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu - COMPLETELY FIXED POSITION */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 h-8 px-2 hover:bg-gray-100 rounded-lg transition-colors"
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
            <span className="text-sm font-medium hidden sm:block max-w-24 truncate text-gray-700">
              {user.name.split(" ")[0]}
            </span>
            <ChevronDown className="w-3 h-3 text-gray-600" />
          </button>

          {/* User Menu Dropdown - FIXED POSITION */}
          {showUserMenu && (
            <div className="absolute right-0 top-10 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1",
                    mode === "admin"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800",
                  )}
                >
                  {user.role}
                </span>
              </div>
              <div className="py-1">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Meu Perfil
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Configurações
                </button>
              </div>
              <div className="border-t border-gray-100 py-1">
                <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Sair do Sistema
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
};

export default DefinitiveHeader;
