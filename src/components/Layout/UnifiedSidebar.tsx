/**
 * 🎯 UNIFIED SIDEBAR - SIDEBAR SIMPLES E FIXO
 *
 * Sidebar simplificado sem categorias colapsáveis:
 * - Lista plana de itens
 * - Ícones no modo fechado
 * - Ícone + texto no modo expandido
 * - Sem animações de movimento
 * - Cores baseadas no sistema de temas
 */

import React, { useCallback } from "react";
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
  Bell,
} from "lucide-react";

// UI Components
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
  disabled?: boolean;
  description?: string;
}

interface UnifiedSidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
  onClose: () => void;
  isMobile?: boolean;
  className?: string;
}

// ===== MENU ITEMS (LISTA PLANA) =====
const MENU_ITEMS: MenuItem[] = [
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
  {
    id: "relatorios",
    label: "Relatórios",
    icon: BarChart3,
    path: "/analytics",
    description: "Relatórios e análises",
  },
  {
    id: "beta",
    label: "Beta",
    icon: FlaskConical,
    path: "/beta",
    badge: "NOVO",
    badgeType: "success",
    description: "Recursos experimentais",
  },
  {
    id: "configuracoes",
    label: "Configurações",
    icon: Settings,
    path: "/configuracoes",
    description: "Configurações do sistema",
  },
];

// ===== UTILS =====
const getBadgeStyles = (type: string = "info", colors: any) => {
  const styles = {
    info: {
      backgroundColor: `${colors.primary}20`,
      color: colors.primary,
    },
    success: {
      backgroundColor: "#10b98120",
      color: "#10b981",
    },
    warning: {
      backgroundColor: "#f59e0b20",
      color: "#f59e0b",
    },
    error: {
      backgroundColor: "#ef444420",
      color: "#ef4444",
    },
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
    const { colors } = useTheme();

    // ===== HANDLERS =====
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
      const badgeStyles = getBadgeStyles(item.badgeType, colors);
      return (
        <Badge
          variant="secondary"
          className="ml-auto text-xs px-1.5 py-0.5 border-0"
          style={badgeStyles}
        >
          {item.badge}
        </Badge>
      );
    };

    const renderMenuItem = (item: MenuItem) => {
      const Icon = item.icon;
      const isActive = isActiveItem(item);

      const itemClasses = `
        group flex items-center w-full px-3 py-3 text-sm font-medium rounded-lg
        transition-colors duration-150
        ${
          isActive
            ? `text-white shadow-sm`
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }
        ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `;

      const activeStyle = isActive
        ? {
            backgroundColor: colors.primary,
            color: "white",
          }
        : {};

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
        <div key={item.id} className="px-2">
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={itemClasses}
                    style={activeStyle}
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
              style={activeStyle}
              onClick={() => handleNavigation(item)}
            >
              {content}
            </button>
          )}
        </div>
      );
    };

    // Sempre renderizar, sem transform
    return (
      <div
        className={`
          fixed left-0 z-40 h-full
          ${isCollapsed ? "w-16" : "w-64"}
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg
          flex flex-col
          ${isMobile ? "top-0" : "top-14 h-[calc(100vh-3.5rem)]"}
          ${isOpen ? "block" : "hidden"}
          ${className}
        `}
      >
        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1">
            {MENU_ITEMS.map((item) => renderMenuItem(item))}
          </nav>
        </ScrollArea>
      </div>
    );
  },
);

UnifiedSidebar.displayName = "UnifiedSidebar";

export default UnifiedSidebar;
