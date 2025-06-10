/**
 * 🎯 UNIFIED SIDEBAR - SIDEBAR MINIMALISTA
 *
 * Sidebar clean e minimalista:
 * - Sem perfil de usuário
 * - Sem busca
 * - Sem animações de arrasto
 * - Apenas navegação essencial
 */

import React, { useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Scale,
  Users,
  CheckSquare,
  Calendar,
  FolderOpen,
  MessageSquare,
  BarChart3,
  FlaskConical,
  Settings,
  ChevronDown,
  ChevronRight,
  Bell,
  Hash,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Theme system
import { useTheme } from "@/lib/themeSystem";

// ===== TYPES =====
interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
  badge?: string | number;
  badgeType?: "info" | "success" | "warning" | "error";
  children?: MenuItem[];
  disabled?: boolean;
  description?: string;
}

interface MenuSection {
  id: string;
  label?: string;
  items: MenuItem[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

interface UnifiedSidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
  onClose: () => void;
  isMobile?: boolean;
  className?: string;
}

// ===== MENU CONFIGURATION =====
const MENU_STRUCTURE: MenuSection[] = [
  {
    id: "main",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/painel",
        description: "Painel de controle principal",
      },
      {
        id: "feed",
        label: "Feed",
        icon: MessageSquare,
        path: "/feed",
        badge: 3,
        badgeType: "info",
        description: "Feed social colaborativo",
      },
    ],
  },
  {
    id: "core",
    label: "Principal",
    collapsible: true,
    defaultExpanded: true,
    items: [
      {
        id: "casos-processos",
        label: "Casos e Processos",
        icon: Scale,
        path: "/crm-modern?module=processos",
        badge: 3,
        badgeType: "warning",
        description: "Gestão de processos jurídicos",
      },
      {
        id: "clientes",
        label: "Clientes",
        icon: Users,
        path: "/crm-modern?module=clientes",
        description: "Gestão de clientes",
      },
      {
        id: "tarefas",
        label: "Tarefas",
        icon: CheckSquare,
        path: "/crm-modern?module=tarefas",
        badge: 8,
        badgeType: "success",
        description: "Gestão de tarefas e atividades",
      },
      {
        id: "calendario",
        label: "Calendário",
        icon: Calendar,
        path: "/agenda",
        badge: 2,
        badgeType: "warning",
        description: "Agenda e compromissos",
      },
      {
        id: "documentos",
        label: "Documentos",
        icon: FolderOpen,
        path: "/crm-modern?module=documentos",
        description: "Gestão de documentos",
      },
      {
        id: "comunicacao",
        label: "Comunicação",
        icon: MessageSquare,
        path: "/atendimento",
        badge: 5,
        badgeType: "info",
        description: "Central de comunicação",
      },
    ],
  },
  {
    id: "analytics",
    label: "Relatórios",
    collapsible: true,
    defaultExpanded: false,
    items: [
      {
        id: "relatorios",
        label: "Relatórios",
        icon: BarChart3,
        path: "/analytics",
        description: "Relatórios e análises",
      },
    ],
  },
  {
    id: "beta",
    label: "Beta",
    collapsible: true,
    defaultExpanded: false,
    items: [
      {
        id: "beta",
        label: "Beta",
        icon: FlaskConical,
        path: "/beta",
        badge: "NOVO",
        badgeType: "success",
        description: "Recursos experimentais",
      },
    ],
  },
  {
    id: "settings",
    label: "Sistema",
    collapsible: true,
    defaultExpanded: false,
    items: [
      {
        id: "configuracoes",
        label: "Configurações",
        icon: Settings,
        path: "/configuracoes",
        description: "Configurações do sistema",
      },
    ],
  },
];

// ===== UTILS =====
const getBadgeStyles = (type: string = "info") => {
  const styles = {
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };
  return styles[type as keyof typeof styles] || styles.info;
};

// ===== UNIFIED SIDEBAR COMPONENT =====
const UnifiedSidebar: React.FC<UnifiedSidebarProps> = React.memo(
  ({
    isOpen,
    isCollapsed,
    onToggle,
    onClose,
    isMobile = false,
    className = "",
  }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // ===== STATE =====
    const [expandedSections, setExpandedSections] = useState<Set<string>>(
      () =>
        new Set(
          MENU_STRUCTURE.filter(
            (section) => section.defaultExpanded !== false,
          ).map((section) => section.id),
        ),
    );

    // ===== HANDLERS =====
    const handleSectionToggle = useCallback(
      (sectionId: string) => {
        if (isCollapsed) return;
        setExpandedSections((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(sectionId)) {
            newSet.delete(sectionId);
          } else {
            newSet.add(sectionId);
          }
          return newSet;
        });
      },
      [isCollapsed],
    );

    const handleNavigation = useCallback(
      (item: MenuItem) => {
        if (item.disabled) return;
        navigate(item.path);
        if (isMobile) {
          onClose();
        }
      },
      [navigate, isMobile, onClose],
    );

    const isActiveItem = useCallback(
      (item: MenuItem): boolean => {
        if (item.path === location.pathname) return true;

        if (item.path.includes("?")) {
          const [basePath, queryString] = item.path.split("?");
          if (location.pathname !== basePath) return false;

          const itemParams = new URLSearchParams(queryString);
          const currentParams = new URLSearchParams(location.search);

          for (const [key, value] of itemParams.entries()) {
            if (currentParams.get(key) !== value) return false;
          }
          return true;
        }

        return location.pathname.startsWith(item.path) && item.path !== "/";
      },
      [location.pathname, location.search],
    );

    // ===== RENDER HELPERS =====
    const renderBadge = (item: MenuItem) => {
      if (!item.badge) return null;
      return (
        <Badge
          variant="secondary"
          className={`ml-auto text-xs px-1.5 py-0.5 ${getBadgeStyles(item.badgeType)}`}
        >
          {item.badge}
        </Badge>
      );
    };

    const renderMenuItem = (item: MenuItem) => {
      const Icon = item.icon;
      const isActive = isActiveItem(item);

      const itemClasses = `
        group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg
        transition-colors duration-150
        ${
          isActive
            ? "bg-blue-600 text-white shadow-sm"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
        }
        ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `;

      const content = (
        <>
          <Icon size={20} className="flex-shrink-0" />
          {!isCollapsed && (
            <>
              <span className="ml-3 flex-1 truncate">{item.label}</span>
              {renderBadge(item)}
            </>
          )}
        </>
      );

      return (
        <div key={item.id}>
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={itemClasses}
                    onClick={() => handleNavigation(item)}
                  >
                    {content}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <button
              className={itemClasses}
              onClick={() => handleNavigation(item)}
            >
              {content}
            </button>
          )}
        </div>
      );
    };

    const renderSection = (section: MenuSection) => {
      const isSectionExpanded = expandedSections.has(section.id);

      return (
        <div key={section.id} className="space-y-1">
          {section.label && !isCollapsed && (
            <div className="flex items-center justify-between px-3 py-2">
              {section.collapsible ? (
                <button
                  onClick={() => handleSectionToggle(section.id)}
                  className="flex items-center w-full text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <span className="flex-1 text-left">{section.label}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-150 ${
                      isSectionExpanded ? "" : "-rotate-90"
                    }`}
                  />
                </button>
              ) : (
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {section.label}
                </span>
              )}
            </div>
          )}

          {(isSectionExpanded || !section.collapsible || isCollapsed) && (
            <div className="space-y-1">
              {section.items.map((item) => renderMenuItem(item))}
            </div>
          )}

          {!isCollapsed && <div className="h-4" />}
        </div>
      );
    };

    // Sempre renderizar, usar transform para mostrar/esconder
    return (
      <div
        className={`
          fixed left-0 z-40 h-full
          ${isCollapsed ? "w-16" : "w-64"}
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg
          transition-transform duration-200 ease-out
          flex flex-col
          ${isMobile ? "top-0" : "top-14 h-[calc(100vh-3.5rem)]"}
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${className}
        `}
      >
        {/* Navigation */}
        <ScrollArea className="flex-1 p-4">
          <nav className="space-y-2">
            {MENU_STRUCTURE.map((section) => renderSection(section))}
          </nav>
        </ScrollArea>
      </div>
    );
  },
);

UnifiedSidebar.displayName = "UnifiedSidebar";

export default UnifiedSidebar;
