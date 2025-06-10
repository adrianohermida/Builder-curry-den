/**
 * 🎯 LAWDESK ORIGINAL TOPBAR RESTAURADO
 *
 * Topbar original limpo e minimalista com:
 * - Design discreto e funcional
 * - Breadcrumb inteligente
 * - Menu de usuário simplificado
 * - Notificações limpas
 * - Integração com tema da Lawdesk
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Home,
  Scale,
  Users,
  CheckSquare,
  Calendar,
  FileText,
  DollarSign,
  BarChart3,
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

interface LawdeskOriginalTopbarProps {
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
  isMobile?: boolean;
}

export const LawdeskOriginalTopbar: React.FC<LawdeskOriginalTopbarProps> = ({
  sidebarCollapsed = false,
  onSidebarToggle,
  isMobile = false,
}) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // Mock user data
  const user = {
    name: "João Silva",
    email: "joao@lawdesk.com",
    role: "Advogado",
    avatar: null,
  };

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "Novo processo atribuído",
      description: "Processo #12345 foi atribuído para você",
      time: "2 min",
      unread: true,
    },
    {
      id: 2,
      title: "Prazo se aproximando",
      description: "Petição vence em 2 dias",
      time: "1h",
      unread: true,
    },
    {
      id: 3,
      title: "Cliente respondeu",
      description: "Maria Silva respondeu seu e-mail",
      time: "3h",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Generate page title from route
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

  // Generate breadcrumb
  const getBreadcrumb = () => {
    const path = location.pathname;
    const parts = path.split("/").filter(Boolean);

    if (parts.length === 0) return [{ label: "Dashboard", path: "/" }];

    const breadcrumb = [{ label: "Início", path: "/" }];

    if (parts.includes("crm-modern")) {
      breadcrumb.push({ label: "CRM Jurídico", path: "/crm-modern" });
      if (parts.length > 1) {
        const subModule = parts[parts.length - 1];
        const subTitles: Record<string, string> = {
          clientes: "Clientes",
          processos: "Processos",
          tarefas: "Tarefas",
          documentos: "Documentos",
          contratos: "Contratos",
          financeiro: "Financeiro",
        };
        if (subTitles[subModule]) {
          breadcrumb.push({
            label: subTitles[subModule],
            path: `/crm-modern/${subModule}`,
          });
        }
      }
    } else if (parts.length > 0) {
      const mainModule = parts[0];
      const mainTitles: Record<string, string> = {
        painel: "Painel",
        agenda: "Agenda",
        publicacoes: "Publicações",
        atendimento: "Atendimento",
        "configuracoes-usuario": "Configurações",
      };
      if (mainTitles[mainModule]) {
        breadcrumb.push({
          label: mainTitles[mainModule],
          path: `/${mainModule}`,
        });
      }
    }

    return breadcrumb;
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 shadow-sm">
      <div className="flex items-center justify-between w-full">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
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

          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm">
            {breadcrumb.map((item, index) => (
              <React.Fragment key={item.path}>
                {index > 0 && <span className="text-gray-400">/</span>}
                <span
                  className={cn(
                    index === breadcrumb.length - 1
                      ? "text-gray-900 font-medium"
                      : "text-gray-500 hover:text-gray-700 cursor-pointer",
                  )}
                >
                  {item.label}
                </span>
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar clientes, processos, documentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={cn(
                "pl-10 pr-4 h-9 text-sm transition-all duration-200",
                "bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300",
                searchFocused && "ring-2 ring-blue-100",
              )}
            />
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
              >
                <div className="p-2 text-sm text-gray-500">
                  Pressione Enter para buscar "{searchQuery}"
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
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
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-3 border-b border-gray-100">
                <h3 className="font-medium text-sm">Notificações</h3>
                <p className="text-xs text-gray-500">{unreadCount} não lidas</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer",
                      notification.unread && "bg-blue-50",
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.description}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 ml-2">
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
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-3 border-b border-gray-100">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
                <p className="text-xs text-blue-600 mt-1">{user.role}</p>
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
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default LawdeskOriginalTopbar;
