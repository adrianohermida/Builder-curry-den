/**
 * 🗂️ SIDEBAR V3 - REORGANIZADA PARA CRM MINIMALISTA
 *
 * Sidebar reorganizada conforme especificação:
 * - Ordem fixa: Painel, CRM Jurídico, Agenda, Tarefas, etc.
 * - CRM Jurídico expandível com submenu
 * - Design minimalista e clean
 * - Navegação fluida e intuitiva
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Users,
  Calendar,
  CheckSquare,
  FileText,
  Building,
  DollarSign,
  MessageCircle,
  Settings,
  ChevronDown,
  ChevronRight,
  Gavel,
  FolderOpen,
  User,
  Scale,
  ClipboardList,
  PieChart,
  CreditCard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCRMV3 } from "@/hooks/useCRMV3";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  badge?: string | number;
  description?: string;
  children?: SidebarItem[];
  expanded?: boolean;
}

const SidebarV3: React.FC = () => {
  const location = useLocation();
  const { dashboardStats } = useCRMV3();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(["crm-juridico"]),
  );

  // Configuração dos itens do menu
  const menuItems: SidebarItem[] = [
    {
      id: "painel",
      label: "Painel",
      icon: <BarChart3 className="w-5 h-5" />,
      path: "/painel",
      description: "Dashboard principal e métricas",
    },
    {
      id: "crm-juridico",
      label: "CRM Jurídico",
      icon: <Users className="w-5 h-5" />,
      path: "/crm-v3",
      description:
        "Gestão completa de clientes, processos, tarefas, contratos e financeiro",
      badge: dashboardStats.clientes.total,
      children: [
        {
          id: "clientes",
          label: "Clientes",
          icon: <User className="w-4 h-4" />,
          path: "/crm-v3/clientes",
          badge: dashboardStats.clientes.total,
        },
        {
          id: "processos",
          label: "Processos",
          icon: <Scale className="w-4 h-4" />,
          path: "/crm-v3/processos",
          badge: dashboardStats.processos.ativos,
        },
        {
          id: "contratos",
          label: "Contratos",
          icon: <Building className="w-4 h-4" />,
          path: "/crm-v3/contratos",
          badge: dashboardStats.contratos.vigentes,
        },
        {
          id: "tarefas-crm",
          label: "Tarefas",
          icon: <ClipboardList className="w-4 h-4" />,
          path: "/crm-v3/tarefas",
          badge: dashboardStats.tarefas.pendentes,
        },
        {
          id: "financeiro-crm",
          label: "Financeiro",
          icon: <CreditCard className="w-4 h-4" />,
          path: "/crm-v3/financeiro",
        },
        {
          id: "documentos-crm",
          label: "Documentos",
          icon: <FolderOpen className="w-4 h-4" />,
          path: "/crm-v3/documentos",
          badge: dashboardStats.documentos.pendentes,
        },
      ],
    },
    {
      id: "agenda",
      label: "Agenda",
      icon: <Calendar className="w-5 h-5" />,
      path: "/agenda",
      description: "Compromissos e eventos",
    },
    {
      id: "tarefas",
      label: "Tarefas",
      icon: <CheckSquare className="w-5 h-5" />,
      path: "/tarefas",
      description: "Equipe e clientes",
      badge: dashboardStats.tarefas.atrasadas,
    },
    {
      id: "publicacoes",
      label: "Publicações",
      icon: <FileText className="w-5 h-5" />,
      path: "/publicacoes",
      description: "Diário oficial e prazos",
    },
    {
      id: "contratos",
      label: "Contratos",
      icon: <Building className="w-5 h-5" />,
      path: "/contratos",
      description: "Gestão contratual",
    },
    {
      id: "financeiro",
      label: "Financeiro",
      icon: <DollarSign className="w-5 h-5" />,
      path: "/financeiro",
      description: "Vendas e cobranças",
    },
    {
      id: "atendimento",
      label: "Atendimento",
      icon: <MessageCircle className="w-5 h-5" />,
      path: "/atendimento",
      description: "Suporte e tickets",
    },
    {
      id: "configuracoes",
      label: "Configurações",
      icon: <Settings className="w-5 h-5" />,
      path: "/configuracoes",
      description: "Sistema e preferências",
    },
  ];

  // Verificar se um item está ativo
  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // Verificar se um item pai tem filhos ativos
  const hasActiveChild = (item: SidebarItem): boolean => {
    if (!item.children) return false;
    return item.children.some((child) => isActive(child.path));
  };

  // Alternar expansão de item
  const toggleExpansion = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  // Renderizar badge
  const renderBadge = (badge?: string | number) => {
    if (!badge) return null;

    return (
      <Badge
        variant="secondary"
        className="ml-auto text-xs h-4 px-1.5 bg-blue-100 text-blue-700"
      >
        {typeof badge === "number" && badge > 99 ? "99+" : badge}
      </Badge>
    );
  };

  // Renderizar item do menu
  const renderMenuItem = (item: SidebarItem, level: number = 0) => {
    const isItemActive = isActive(item.path);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const hasActiveChildren = hasActiveChild(item);

    return (
      <div key={item.id}>
        {/* Item principal */}
        <div className="relative">
          {item.path ? (
            <Link
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                transition-all duration-150 group
                ${level > 0 ? "ml-6 pl-3" : ""}
                ${
                  isItemActive || hasActiveChildren
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="flex-grow truncate">{item.label}</span>
              {renderBadge(item.badge)}
              {hasChildren && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleExpansion(item.id);
                  }}
                  className="flex-shrink-0 p-0.5 rounded hover:bg-gray-200"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </button>
              )}
            </Link>
          ) : (
            <button
              onClick={() => hasChildren && toggleExpansion(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                transition-all duration-150 group text-left
                ${level > 0 ? "ml-6 pl-3" : ""}
                ${
                  hasActiveChildren
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="flex-grow truncate">{item.label}</span>
              {renderBadge(item.badge)}
              {hasChildren && (
                <span className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Subitens */}
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-1 space-y-1">
                {item.children!.map((child) =>
                  renderMenuItem(child, level + 1),
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 h-full bg-white border-r border-gray-200 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Gavel className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">Lawdesk</h1>
            <p className="text-xs text-gray-600">CRM V3 Minimalia</p>
          </div>
        </div>
      </div>

      {/* Menu de navegação */}
      <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => renderMenuItem(item))}
      </nav>

      {/* Footer com informações */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center justify-between">
            <span>Clientes Ativos:</span>
            <span className="font-medium">
              {dashboardStats.clientes.ativos}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Processos:</span>
            <span className="font-medium">
              {dashboardStats.processos.ativos}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tarefas Pendentes:</span>
            <span className="font-medium text-orange-600">
              {dashboardStats.tarefas.pendentes}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SidebarV3;
