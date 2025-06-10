/**
 * 🎯 UNIFIED TOPBAR - CABEÇALHO ESTILO PAINEL DE CONTROLE
 *
 * Cabeçalho simples e clean baseado no design do painel:
 * - Menu hamburger à esquerda
 * - Título da página
 * - Busca centralizada
 * - Ações rápidas à direita
 */

import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  Settings,
  User,
  RefreshCw,
  MoreVertical,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Context
import { useUnifiedLayout } from "./UnifiedLayout";

// ===== TYPES =====
interface UnifiedTopbarProps {
  className?: string;
}

// ===== PAGE TITLES =====
const PAGE_TITLES: Record<string, string> = {
  "/painel": "Painel de Controle",
  "/feed": "Feed",
  "/crm-modern": "CRM Jurídico",
  "/agenda": "Agenda",
  "/publicacoes": "Publicações",
  "/atendimento": "Atendimento",
  "/analytics": "Relatórios",
  "/beta": "Beta",
  "/configuracoes": "Configurações",
  "/configuracao-armazenamento": "Armazenamento",
  "/ajuda": "Ajuda",
};

// ===== UNIFIED TOPBAR COMPONENT =====
const UnifiedTopbar: React.FC<UnifiedTopbarProps> = ({ className = "" }) => {
  const location = useLocation();
  const { layoutState, toggleSidebar } = useUnifiedLayout();
  const [searchQuery, setSearchQuery] = useState("");

  // Get page title
  const pageTitle = PAGE_TITLES[location.pathname] || "Lawdesk";

  return (
    <div
      className={`bg-white border-b border-gray-200 sticky top-0 z-50 ${className}`}
    >
      <div className="px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left Section - Menu and Title */}
          <div className="flex items-center space-x-4">
            {/* Menu Hamburger */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <Menu size={18} className="text-gray-600" />
            </Button>

            {/* Page Title */}
            <h1 className="text-lg font-semibold text-gray-900">{pageTitle}</h1>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                placeholder="Buscar em todo o sistema..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-gray-50 border-gray-300 focus:bg-white focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-3">
            {/* Refresh */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <RefreshCw size={16} className="text-gray-600" />
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100 relative"
                >
                  <Bell size={16} className="text-gray-600" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs"
                  >
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-3 border-b">
                  <h4 className="font-medium">Notificações</h4>
                </div>
                <div className="p-3">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Nova mensagem</p>
                        <p className="text-xs text-gray-500">
                          Ana Silva enviou uma mensagem
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          2 min atrás
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          Processo atualizado
                        </p>
                        <p className="text-xs text-gray-500">
                          Novo andamento no processo 1234567
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          15 min atrás
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2 border-t">
                  <Button variant="ghost" size="sm" className="w-full">
                    Ver todas
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <Settings size={16} className="text-gray-600" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="/avatars/user.jpg" alt="Usuário" />
                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                      U
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="p-2 border-b">
                  <p className="text-sm font-medium">Usuário Admin</p>
                  <p className="text-xs text-gray-500">admin@lawdesk.com</p>
                </div>
                <DropdownMenuItem>
                  <User size={14} className="mr-2" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings size={14} className="mr-2" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* More Options */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <MoreVertical size={16} className="text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedTopbar;
