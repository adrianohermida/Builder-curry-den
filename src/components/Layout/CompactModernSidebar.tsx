/**
 * 🎯 COMPACT MODERN SIDEBAR - DESIGN 2025
 *
 * Sidebar ultra-moderno com:
 * - Compactação inteligente
 * - Design minimalista
 * - Animações suaves
 * - Conexões corretas
 * - Zero amarelo
 */

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  CheckSquare,
  Calendar,
  FolderOpen,
  Scale,
  DollarSign,
  Headphones,
  Settings,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Building,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CompactModernSidebarProps {
  mode?: "client" | "admin";
}

interface SidebarItem {
  id: string;
  title: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
  description?: string;
  isExternal?: boolean;
}

export const CompactModernSidebar: React.FC<CompactModernSidebarProps> = ({
  mode = "client",
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  // Show expanded on hover when collapsed
  const shouldShowExpanded = !isCollapsed || isHovered;

  // Menu items com conexões corretas
  const sidebarItems: SidebarItem[] = [
    {
      id: "home",
      title: "Painel de Controle",
      path: "/painel",
      icon: <Home className="w-5 h-5" />,
      description: "Dashboard principal",
    },
    {
      id: "crm",
      title: "CRM Jurídico",
      path: "/crm-modern/clientes", // Conecta direto com clientes
      icon: <Users className="w-5 h-5" />,
      badge: 99,
      description: "Gestão de clientes",
    },
    {
      id: "tasks",
      title: "Tarefas",
      path: "/tarefas-gerencial", // Nova página gerencial
      icon: <CheckSquare className="w-5 h-5" />,
      badge: 47,
      description: "Tarefas gerenciais",
    },
    {
      id: "calendar",
      title: "Agenda",
      path: "/agenda",
      icon: <Calendar className="w-5 h-5" />,
      description: "Compromissos e eventos",
    },
    {
      id: "documents",
      title: "Documentos",
      path: "/ged-organizacional", // Nova página GED
      icon: <FolderOpen className="w-5 h-5" />,
      description: "GED organizacional",
    },
    {
      id: "financial",
      title: "Financeiro",
      path: "/financeiro-gerencial", // Novo módulo financeiro
      icon: <DollarSign className="w-5 h-5" />,
      description: "Financeiro gerencial",
    },
    {
      id: "support",
      title: "Atendimento",
      path: "/atendimento",
      icon: <Headphones className="w-5 h-5" />,
      description: "Suporte e comunicação",
    },
    {
      id: "portal",
      title: "Portal do Cliente",
      path: "/portal-cliente",
      icon: <Building className="w-5 h-5" />,
      description: "Portal do cliente",
    },
    {
      id: "settings",
      title: "Configurações",
      path: "/configuracoes-usuario",
      icon: <Settings className="w-5 h-5" />,
      description: "Configurações do sistema",
    },
    {
      id: "beta",
      title: "Beta",
      path: "/beta",
      icon: <FlaskConical className="w-5 h-5" />,
      badge: 25,
      description: "Recursos em desenvolvimento",
    },
  ];

  const isActive = (path: string) => {
    if (
      path === "/painel" &&
      (location.pathname === "/" || location.pathname === "/painel")
    )
      return true;
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // Sidebar Item Component
  const SidebarItemComponent = ({ item }: { item: SidebarItem }) => {
    const itemIsActive = isActive(item.path);

    const content = (
      <>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3 min-w-0">
            <div
              className={cn(
                "flex-shrink-0 transition-colors duration-200",
                itemIsActive
                  ? mode === "admin"
                    ? "text-red-600"
                    : "text-blue-600"
                  : "text-gray-500 group-hover:text-gray-700",
              )}
            >
              {item.icon}
            </div>
            {shouldShowExpanded && (
              <span className="font-medium truncate transition-all duration-200">
                {item.title}
              </span>
            )}
          </div>

          {/* Badge */}
          {item.badge && shouldShowExpanded && (
            <span
              className={cn(
                "inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white rounded-full min-w-[20px] h-5 shadow-sm transition-all duration-200",
                mode === "admin" ? "bg-red-500" : "bg-blue-500",
              )}
            >
              {item.badge >= 99 ? "99+" : item.badge}
            </span>
          )}

          {/* Compact Badge Indicator */}
          {item.badge && !shouldShowExpanded && (
            <div
              className={cn(
                "absolute -top-1 -right-1 w-2 h-2 rounded-full transition-all duration-200",
                mode === "admin" ? "bg-red-500" : "bg-blue-500",
              )}
            />
          )}
        </div>
      </>
    );

    if (item.isExternal) {
      return (
        <a
          href={item.path}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group relative flex items-center justify-between rounded-lg transition-all duration-200 text-sm font-medium",
            shouldShowExpanded ? "px-3 py-2.5 mx-2" : "p-2 mx-2",
            itemIsActive
              ? mode === "admin"
                ? "bg-red-50 text-red-700 shadow-sm border-l-2 border-red-600"
                : "bg-blue-50 text-blue-700 shadow-sm border-l-2 border-blue-600"
              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
          )}
          title={item.description}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        to={item.path}
        className={cn(
          "group relative flex items-center justify-between rounded-lg transition-all duration-200 text-sm font-medium",
          shouldShowExpanded ? "px-3 py-2.5 mx-2" : "p-2 mx-2",
          itemIsActive
            ? mode === "admin"
              ? "bg-red-50 text-red-700 shadow-sm border-l-2 border-red-600"
              : "bg-blue-50 text-blue-700 shadow-sm border-l-2 border-blue-600"
            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
        )}
        title={item.description}
      >
        {content}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col h-full shadow-sm transition-all duration-300 ease-in-out",
        shouldShowExpanded ? "w-64" : "w-16",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header com Logo Lawdesk */}
      <div
        className={cn(
          "flex items-center border-b border-gray-100 transition-all duration-300",
          shouldShowExpanded
            ? "justify-between px-4 py-4"
            : "justify-center p-3",
        )}
      >
        {/* Logo Lawdesk com ícone de espada/balança */}
        <div className="flex items-center space-x-3">
          {/* Ícone de espada/balança da justiça */}
          <div
            className={cn(
              "rounded-lg flex items-center justify-center shadow-sm transition-all duration-300",
              mode === "admin" ? "bg-red-600" : "bg-blue-600",
              shouldShowExpanded ? "w-10 h-10" : "w-8 h-8",
            )}
          >
            <Scale
              className={cn(
                "text-white transition-all duration-300",
                shouldShowExpanded ? "w-5 h-5" : "w-4 h-4",
              )}
            />
          </div>
          {shouldShowExpanded && (
            <div className="transition-all duration-300">
              <h1 className="font-bold text-lg text-gray-900">Lawdesk</h1>
              <p className="text-sm text-gray-500">
                {mode === "admin" ? "Administração" : "CRM Jurídico"}
              </p>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        {shouldShowExpanded && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title={isCollapsed ? "Expandir menu" : "Compactar menu"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <SidebarItemComponent key={item.id} item={item} />
          ))}
        </div>
      </nav>

      {/* Footer - Status */}
      <div
        className={cn(
          "border-t border-gray-100 transition-all duration-300",
          shouldShowExpanded ? "px-4 py-3" : "p-3",
        )}
      >
        {shouldShowExpanded ? (
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                mode === "admin" ? "bg-red-500" : "bg-green-500",
              )}
            />
            <span className="text-xs text-gray-500 font-medium">
              {mode === "admin" ? "Admin Online" : "Sistema Online"}
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                mode === "admin" ? "bg-red-500" : "bg-green-500",
              )}
            />
          </div>
        )}
      </div>
    </aside>
  );
};

export default CompactModernSidebar;
