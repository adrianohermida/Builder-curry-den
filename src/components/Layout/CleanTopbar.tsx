/**
 * 🎯 CLEAN TOPBAR - DESIGN ELEGANTE E MINIMALISTA
 *
 * Topbar super limpo com:
 * - Menu de usuário elegante
 * - Busca discreta
 * - Notificações simples
 * - Breadcrumb clean
 */

import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
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

interface CleanTopbarProps {
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
  isMobile?: boolean;
}

export const CleanTopbar: React.FC<CleanTopbarProps> = ({
  sidebarCollapsed = false,
  onSidebarToggle,
  isMobile = false,
}) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock user
  const user = {
    name: "João Silva",
    email: "joao@lawdesk.com",
    role: "Advogado",
  };

  // Generate clean page title
  const getPageTitle = () => {
    const path = location.pathname;
    const titles: Record<string, string> = {
      "/": "Dashboard",
      "/painel": "Painel",
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
    };

    return titles[path] || "Lawdesk";
  };

  const notifications = [
    { id: 1, title: "Novo processo atribuído", time: "2 min", unread: true },
    { id: 2, title: "Prazo se aproximando", time: "1h", unread: true },
    { id: 3, title: "Cliente respondeu", time: "3h", unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="bg-white border-b border-gray-200 h-14 flex items-center px-4">
      <div className="flex items-center justify-between w-full">
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSidebarToggle}
              className="h-8 w-8 p-0"
            >
              <Menu className="w-4 h-4" />
            </Button>
          )}

          {/* Page Title */}
          <h1 className="text-lg font-semibold text-gray-900">
            {getPageTitle()}
          </h1>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 text-sm bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <div className="p-3 border-b">
                <h3 className="font-medium text-sm">Notificações</h3>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-3 border-b last:border-b-0 hover:bg-gray-50",
                      notification.unread && "bg-blue-50",
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium">
                        {notification.title}
                      </p>
                      <span className="text-xs text-gray-500">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 gap-2 px-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
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
            <DropdownMenuContent align="end" className="w-48">
              <div className="p-3 border-b">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
                <Badge variant="secondary" className="text-xs mt-1">
                  {user.role}
                </Badge>
              </div>
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default CleanTopbar;
