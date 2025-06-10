/**
 * 🎯 COMPACT SIDEBAR - DESIGN LIMPO E MINIMALISTA
 *
 * Sidebar compacto sem seções categorizadas:
 * - Lista direta de módulos
 * - Design super limpo
 * - Logo correto da Lawdesk
 * - Sem divisões desnecessárias
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  Scale,
  CheckSquare,
  FolderOpen,
  FileSignature,
  Calendar,
  FileText,
  MessageCircle,
  BarChart3,
  DollarSign,
  Settings,
  Search,
  Plus,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  title: string;
  path: string;
  icon: React.ReactNode;
  badge?: number | string;
  isNew?: boolean;
}

interface CompactSidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  onClose?: () => void;
  open?: boolean;
}

export const CompactSidebar: React.FC<CompactSidebarProps> = ({
  collapsed = false,
  onCollapsedChange,
  onClose,
  open = false,
}) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock stats
  const mockStats = {
    clientesAtivos: 247,
    processosUrgentes: 12,
    tarefasPendentes: 34,
    compromissosHoje: 5,
    ticketsAbertos: 8,
  };

  // Menu direto sem categorias
  const menuItems: MenuItem[] = [
    {
      id: "crm",
      title: "CRM Jurídico",
      path: "/crm-modern",
      icon: <Users className="w-4 h-4" />,
      badge: mockStats.clientesAtivos,
      isNew: true,
    },
    {
      id: "processos",
      title: "Processos",
      path: "/crm-modern/processos",
      icon: <Scale className="w-4 h-4" />,
      badge: mockStats.processosUrgentes,
    },
    {
      id: "tarefas",
      title: "Tarefas",
      path: "/crm-modern/tarefas",
      icon: <CheckSquare className="w-4 h-4" />,
      badge: mockStats.tarefasPendentes,
    },
    {
      id: "agenda",
      title: "Agenda",
      path: "/agenda",
      icon: <Calendar className="w-4 h-4" />,
      badge: mockStats.compromissosHoje,
    },
    {
      id: "documentos",
      title: "Documentos",
      path: "/crm-modern/documentos",
      icon: <FolderOpen className="w-4 h-4" />,
    },
    {
      id: "contratos",
      title: "Contratos",
      path: "/crm-modern/contratos",
      icon: <FileSignature className="w-4 h-4" />,
    },
    {
      id: "financeiro",
      title: "Financeiro",
      path: "/crm-modern/financeiro",
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      id: "publicacoes",
      title: "Publicações",
      path: "/publicacoes",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "atendimento",
      title: "Atendimento",
      path: "/atendimento",
      icon: <MessageCircle className="w-4 h-4" />,
      badge: mockStats.ticketsAbertos,
    },
    {
      id: "painel",
      title: "Painel",
      path: "/painel",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: "configuracoes",
      title: "Configurações",
      path: "/configuracoes-usuario",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const filteredItems = searchQuery
    ? menuItems.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : menuItems;

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white border-r border-gray-200 flex flex-col h-full shadow-sm"
      >
        {/* Header Compacto */}
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo Lawdesk */}
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                <Scale className="w-4 h-4 text-white" />
              </div>

              {!collapsed && (
                <div className="flex-grow">
                  <h1 className="font-semibold text-gray-900">Lawdesk</h1>
                  <p className="text-xs text-gray-500">v2025.1</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              {!collapsed && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCollapsedChange?.(!collapsed)}
                  className="h-7 w-7 p-0"
                  title="Recolher"
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden h-7 w-7 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Search Compacto */}
          {!collapsed && (
            <div className="mt-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-sm bg-gray-50 border-gray-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Compactos */}
        {!collapsed && (
          <div className="px-3 py-3 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-2">
              <Link to="/crm-modern?action=new-client">
                <Button size="sm" className="h-7 text-xs w-full">
                  <Plus className="w-3 h-3 mr-1" />
                  Cliente
                </Button>
              </Link>
              <Link to="/crm-modern/processos?action=new-process">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs w-full"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Processo
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Menu Direto */}
        <nav className="flex-grow px-3 py-3 space-y-1 overflow-y-auto">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="block"
              title={collapsed ? item.title : undefined}
            >
              <motion.div
                whileHover={{ scale: collapsed ? 1.05 : 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-md transition-all duration-200",
                  collapsed ? "justify-center" : "",
                  isActive(item.path)
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <div className="flex items-center gap-3 flex-grow min-w-0">
                  {item.icon}
                  {!collapsed && (
                    <span className="text-sm font-medium truncate">
                      {item.title}
                    </span>
                  )}
                </div>

                {!collapsed && item.badge && (
                  <Badge
                    variant={
                      typeof item.badge === "number" && item.badge > 0
                        ? "destructive"
                        : "secondary"
                    }
                    className="text-xs h-4 px-1.5"
                  >
                    {item.badge}
                  </Badge>
                )}

                {!collapsed && item.isNew && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* Footer Compacto */}
        <div className="px-3 py-3 border-t border-gray-100">
          {!collapsed ? (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Online</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default CompactSidebar;
