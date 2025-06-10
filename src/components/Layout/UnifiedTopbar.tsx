/**
 * ���� UNIFIED TOPBAR - CABEÇALHO MINIMALISTA
 *
 * Cabeçalho clean e minimalista baseado no design:
 * - Logo Lawdesk com balança branca e texto azul
 * - Menu hamburger
 * - Título da página
 * - Ações mínimas à direita
 */

import React from "react";
import { useLocation } from "react-router-dom";
import { Menu, Bell, Settings, MoreVertical, Scale } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
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

// Theme system
import { useTheme } from "@/lib/themeSystem";

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
  const { toggleSidebar } = useUnifiedLayout();
  const {
    config: themeConfig,
    colors,
    isAdminMode,
    switchToClientView,
    switchToAdminView,
    toggleTheme,
  } = useTheme();

  // Get page title
  const pageTitle = PAGE_TITLES[location.pathname] || "Lawdesk";

  return (
    <div
      className={`bg-white border-b border-gray-200 sticky top-0 z-50 ${className}`}
      data-topbar="true"
      style={{
        backgroundColor: colors.background,
        borderBottomColor: colors.border,
      }}
    >
      <div className="px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left Section - Logo Lawdesk, Menu and Title */}
          <div className="flex items-center space-x-3">
            {/* Logo Lawdesk */}
            <div className="flex items-center space-x-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Scale size={18} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-lg font-bold leading-tight"
                  style={{ color: colors.primary }}
                >
                  Lawdesk
                </span>
                <span
                  className="text-xs leading-none"
                  style={{ color: colors.accent }}
                >
                  CRM Jurídico
                </span>
              </div>
            </div>

            {/* Menu Hamburger */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="h-8 w-8 p-0 hover:bg-gray-100 ml-4"
            >
              <Menu size={18} className="text-gray-600" />
            </Button>

            {/* Page Title */}
            <h1 className="text-lg font-semibold text-gray-900 ml-2">
              {pageTitle}
            </h1>
          </div>

          {/* Right Section - Minimal Actions */}
          <div className="flex items-center space-x-2">
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
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2 border-b">
                  <p className="text-sm font-medium">
                    {isAdminMode() ? "Usuário Admin" : "Usuário Cliente"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isAdminMode()
                      ? "admin@lawdesk.com"
                      : "cliente@lawdesk.com"}
                  </p>
                  <div className="mt-1">
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{
                        borderColor: colors.primary,
                        color: colors.primary,
                      }}
                    >
                      {isAdminMode() ? "Modo Admin" : "Modo Cliente"}
                    </Badge>
                  </div>
                </div>
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTheme}>
                  Tema: {themeConfig.themeMode === "light" ? "Claro" : "Escuro"}
                </DropdownMenuItem>
                <DropdownMenuItem>Configurações</DropdownMenuItem>
                {isAdminMode() && (
                  <DropdownMenuItem
                    onClick={switchToClientView}
                    style={{ color: "#3b82f6" }}
                  >
                    🔄 Visualizar como Cliente
                  </DropdownMenuItem>
                )}
                {!isAdminMode() && (
                  <DropdownMenuItem
                    onClick={switchToAdminView}
                    style={{ color: "#dc2626" }}
                  >
                    🔄 Voltar ao Modo Admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="text-red-600">
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedTopbar;
