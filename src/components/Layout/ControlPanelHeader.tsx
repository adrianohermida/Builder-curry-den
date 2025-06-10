/**
 * 🎯 CONTROL PANEL HEADER - CABEÇALHO PAINEL DE CONTROLE
 *
 * Cabeçalho como mostrado na imagem:
 * - Título "Painel de Controle"
 * - Busca centralizada
 * - Menu de usuário à direita
 * - Ícones de notificação e tema
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ControlPanelHeaderProps {
  className?: string;
}

export const ControlPanelHeader: React.FC<ControlPanelHeaderProps> = ({
  className,
}) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Mock user
  const user = {
    name: "Cliente",
    email: "usuario@lawdesk.com",
    role: "Cliente",
    avatar: null,
  };

  // Generate page title based on route
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
    };

    return titles[path] || "Painel de Controle";
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header
      className={cn(
        "bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between",
        className,
      )}
    >
      {/* Left - Menu toggle and Title */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="lg:hidden">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>

        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {getPageTitle()}
          </h1>
          {location.pathname === "/painel" && (
            <p className="text-sm text-gray-500">
              Visão geral das atividades do escritório
            </p>
          )}
        </div>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-lg mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar em todo o sistema..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 w-full bg-gray-50 border-gray-200 focus:bg-white"
          />
          <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right - Actions and User */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="w-9 h-9 p-0"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 h-9 p-0 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-3 border-b">
              <h3 className="font-medium text-sm">Notificações</h3>
              <p className="text-xs text-gray-500">
                Você tem 3 notificações não lidas
              </p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <div className="p-3 border-b hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      Nova mensagem recebida
                    </p>
                    <p className="text-xs text-gray-500">
                      João Silva enviou uma mensagem
                    </p>
                    <p className="text-xs text-gray-400 mt-1">2 min atrás</p>
                  </div>
                </div>
              </div>
              <div className="p-3 border-b hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Prazo se aproximando</p>
                    <p className="text-xs text-gray-500">
                      Petição vence em 2 dias
                    </p>
                    <p className="text-xs text-gray-400 mt-1">1 hora atrás</p>
                  </div>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 h-9 px-3"
            >
              <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {user.name.charAt(0)}
                </span>
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {user.name}
              </span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-3 border-b">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
              <Badge variant="secondary" className="text-xs mt-1">
                {user.role}
              </Badge>
            </div>
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Sair do Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default ControlPanelHeader;
