/**
 * 📱 CORRECTED SIDEBAR - SIDEBAR RESPONSIVO CORRIGIDO
 *
 * Sidebar totalmente responsivo com:
 * - Mobile-first (drawer em mobile)
 * - Touch-friendly (44px+ targets)
 * - Cores sólidas do tema
 * - Acessibilidade completa
 * - Performance otimizada
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

// Layout context
import { useCorrectedLayout } from "./CorrectedLayout";

// Theme system
import { useCorrectedTheme } from "@/lib/correctedThemeSystem";

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
      backgroundColor: `${colors.primary.replace("rgb(", "rgba(").replace(")", ", 0.1)")}`,
      color: colors.primary,
      borderColor: `${colors.primary.replace("rgb(", "rgba(").replace(")", ", 0.2)")}`,
    },
    success: {
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      color: "rgb(34, 197, 94)",
      borderColor: "rgba(34, 197, 94, 0.2)",
    },
    warning: {
      backgroundColor: "rgba(245, 158, 11, 0.1)",
      color: "rgb(245, 158, 11)",
      borderColor: "rgba(245, 158, 11, 0.2)",
    },
    error: {
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      color: "rgb(239, 68, 68)",
      borderColor: "rgba(239, 68, 68, 0.2)",
    },
  };
  return styles[type || "info"];
};

// ===== MENU ITEM COMPONENT =====
const MenuItem: React.FC<{
  item: MenuItem;
  isActive: boolean;
  isCollapsed: boolean;
  isMobile: boolean;
  colors: any;
  onClick: () => void;
}> = memo(({ item, isActive, isCollapsed, isMobile, colors, onClick }) => {
  const Icon = item.icon;

  const buttonClasses = useMemo(() => {
    return [
      "w-full justify-start gap-3 font-medium transition-colors duration-150",
      // Touch-friendly em mobile
      isMobile ? "h-12 px-4" : isCollapsed ? "h-11 px-3" : "h-11 px-4",
      "rounded-lg",
    ].join(" ");
  }, [isCollapsed, isMobile]);

  const buttonStyle = useMemo(() => {
    if (isActive) {
      return {
        backgroundColor: colors.primary,
        color: colors.primaryForeground,
      };
    }
    return {
      backgroundColor: "transparent",
      color: colors.foreground,
    };
  }, [isActive, colors]);

  const hoverStyle = useMemo(() => {
    if (!isActive) {
      return {
        ":hover": {
          backgroundColor: colors.muted,
        },
      };
    }
    return {};
  }, [isActive, colors]);

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
      className={buttonClasses}
      style={buttonStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = colors.muted;
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
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

  // Tooltip apenas para sidebar collapsed
  if (isCollapsed && !isMobile) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent
            side="right"
            className="ml-2"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.cardForeground,
            }}
          >
            <div>
              <p className="font-medium">{item.label}</p>
              {item.description && (
                <p className="text-xs opacity-80 mt-1">{item.description}</p>
              )}
              {item.badge && (
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                </div>
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

// ===== CORRECTED SIDEBAR COMPONENT =====
const CorrectedSidebar: React.FC = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const { layoutState, closeSidebar } = useCorrectedLayout();
  const { colors } = useCorrectedTheme();

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
      "sidebar fixed left-0 z-40 flex flex-col border-r transition-transform duration-200 ease-out",
    ];

    // Posição e altura baseado no device
    if (layoutState.isMobile) {
      base.push("top-0 h-full"); // Mobile: altura total
      base.push("w-80 max-w-[85vw]"); // Mobile: largura responsiva
      base.push(
        layoutState.sidebarOpen ? "translate-x-0" : "-translate-x-full",
      );
    } else {
      base.push("top-14 h-[calc(100vh-3.5rem)]"); // Desktop: abaixo do topbar
      base.push(layoutState.sidebarCollapsed ? "w-16" : "w-64");
      base.push("translate-x-0");
    }

    // Visibilidade
    if (!layoutState.sidebarOpen && !layoutState.isMobile) {
      base.push("hidden");
    }

    return base.join(" ");
  }, [layoutState]);

  const sidebarStyle = useMemo(() => {
    return {
      backgroundColor: colors.card,
      borderRightColor: colors.border,
      color: colors.cardForeground,
    };
  }, [colors]);

  return (
    <aside className={sidebarClasses} style={sidebarStyle}>
      {/* Mobile Header */}
      {layoutState.isMobile && (
        <div
          className="flex items-center justify-between h-14 px-4 border-b"
          style={{ borderBottomColor: colors.border }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
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
          <Button
            variant="ghost"
            size="sm"
            onClick={closeSidebar}
            className="h-9 w-9 p-0"
            aria-label="Fechar menu"
          >
            ✕
          </Button>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {MENU_ITEMS.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              isActive={isActiveItem(item)}
              isCollapsed={layoutState.sidebarCollapsed}
              isMobile={layoutState.isMobile}
              colors={colors}
              onClick={() => handleNavigation(item)}
            />
          ))}
        </nav>
      </ScrollArea>

      {/* Bottom section - apenas desktop */}
      {!layoutState.isMobile && !layoutState.sidebarCollapsed && (
        <div className="p-4 border-t" style={{ borderTopColor: colors.border }}>
          <div
            className="text-xs text-center opacity-60"
            style={{ color: colors.mutedForeground }}
          >
            Lawdesk CRM Jurídico
            <br />
            v2.0.0
          </div>
        </div>
      )}
    </aside>
  );
});

CorrectedSidebar.displayName = "CorrectedSidebar";

export default CorrectedSidebar;
