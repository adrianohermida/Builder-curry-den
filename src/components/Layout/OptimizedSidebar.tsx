/**
 * 📱 OPTIMIZED SIDEBAR - SIDEBAR SAAS 2025+ OTIMIZADO
 *
 * Sidebar moderno e performático com:
 * - Lista plana sem categorias
 * - Performance otimizada
 * - Design minimalista
 * - Responsive behavior
 * - Acessibilidade completa
 */

import React, { memo, useMemo, useCallback } from "react";
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

// Optimized components
import { Button } from "@/components/ui/optimized/Button";

// UI Components
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Layout context
import { useOptimizedLayout } from "./OptimizedLayout";

// Theme system
import { useTheme } from "@/lib/themeSystem";

// Design tokens
import designTokens from "@/design/tokens";

// ===== TYPES =====
interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
  badge?: string | number;
  badgeType?: "info" | "success" | "warning" | "error";
  description?: string;
}

// ===== MENU ITEMS =====
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
] as const;

// ===== BADGE STYLES =====
const getBadgeStyles = (type: MenuItem["badgeType"], colors: any) => {
  const styles = {
    info: {
      backgroundColor: `${colors.primary}20`,
      color: colors.primary,
      borderColor: `${colors.primary}30`,
    },
    success: {
      backgroundColor: "#10b98120",
      color: "#10b981",
      borderColor: "#10b98130",
    },
    warning: {
      backgroundColor: "#f59e0b20",
      color: "#f59e0b",
      borderColor: "#f59e0b30",
    },
    error: {
      backgroundColor: "#ef444420",
      color: "#ef4444",
      borderColor: "#ef444430",
    },
  };
  return styles[type || "info"];
};

// ===== MENU ITEM COMPONENT =====
const MenuItem: React.FC<{
  item: MenuItem;
  isActive: boolean;
  isCollapsed: boolean;
  colors: any;
  onClick: () => void;
}> = memo(({ item, isActive, isCollapsed, colors, onClick }) => {
  const Icon = item.icon;

  const buttonClasses = useMemo(() => {
    const base =
      "w-full justify-start gap-3 font-medium transition-colors duration-150";
    const activeClasses = "text-white shadow-sm";
    const inactiveClasses =
      "text-gray-700 hover:bg-gray-100 hover:text-gray-900";

    return `${base} ${isActive ? activeClasses : inactiveClasses}`;
  }, [isActive]);

  const buttonStyle = useMemo(() => {
    return isActive
      ? {
          backgroundColor: colors.primary,
          color: "white",
        }
      : {};
  }, [isActive, colors.primary]);

  const renderBadge = () => {
    if (!item.badge) return null;

    const badgeStyles = getBadgeStyles(item.badgeType, colors);

    return (
      <Badge
        variant="secondary"
        className="ml-auto h-5 border text-xs"
        style={badgeStyles}
      >
        {item.badge}
      </Badge>
    );
  };

  const content = (
    <Button
      variant="ghost"
      size="md"
      className={buttonClasses}
      style={buttonStyle}
      onClick={onClick}
    >
      <Icon size={20} className="flex-shrink-0" />
      {!isCollapsed && (
        <>
          <span className="flex-1 truncate text-left">{item.label}</span>
          {renderBadge()}
        </>
      )}
    </Button>
  );

  // Tooltip for collapsed state
  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="ml-2">
            <div>
              <p className="font-medium">{item.label}</p>
              {item.description && (
                <p className="text-xs opacity-80 mt-1">{item.description}</p>
              )}
              {item.badge && (
                <p className="text-xs mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
});

MenuItem.displayName = "MenuItem";

// ===== OPTIMIZED SIDEBAR COMPONENT =====
const OptimizedSidebar: React.FC = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const { layoutState, closeSidebar } = useOptimizedLayout();
  const { colors } = useTheme();

  // Check if menu item is active
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

  // Handle navigation
  const handleNavigation = useCallback(
    (item: MenuItem) => {
      navigate(item.path);
      if (layoutState.isMobile) {
        closeSidebar();
      }
    },
    [navigate, layoutState.isMobile, closeSidebar],
  );

  // Sidebar classes
  const sidebarClasses = useMemo(() => {
    const base = [
      "fixed",
      "left-0",
      "top-14", // Below topbar
      "z-40",
      "flex",
      "flex-col",
      "border-r",
      "bg-white",
      "shadow-lg",
      "transition-[width] duration-200 ease-out",
    ];

    // Width
    if (layoutState.sidebarCollapsed) {
      base.push("w-16");
    } else {
      base.push("w-64");
    }

    // Height
    base.push("h-[calc(100vh-3.5rem)]"); // Full height minus topbar

    // Visibility
    if (!layoutState.sidebarOpen) {
      base.push("hidden");
    }

    return base.join(" ");
  }, [layoutState.sidebarOpen, layoutState.sidebarCollapsed]);

  const sidebarStyle = useMemo(() => {
    return {
      backgroundColor: colors.background,
      borderRightColor: colors.border,
    };
  }, [colors]);

  return (
    <aside className={sidebarClasses} style={sidebarStyle}>
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {MENU_ITEMS.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              isActive={isActiveItem(item)}
              isCollapsed={layoutState.sidebarCollapsed}
              colors={colors}
              onClick={() => handleNavigation(item)}
            />
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
});

OptimizedSidebar.displayName = "OptimizedSidebar";

export default OptimizedSidebar;
