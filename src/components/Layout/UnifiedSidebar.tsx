/**
 * 🎯 UNIFIED SIDEBAR - REFATORADO COM SISTEMA DE TEMAS
 *
 * Sidebar refatorado com:
 * - Sem cor preta de fundo no hover
 * - Azul no modo cliente (tema claro)
 * - Vermelho no modo admin
 * - Modo escuro com switch
 * - Cores personalizáveis baseadas no tema
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
} from "lucide-react";

// UI Components
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Theme system
import { useTheme } from "@/lib/themeSystem";

// Color Picker
import ColorPicker from "./ColorPicker";

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
];

// ===== UTILS =====
const getBadgeStyles = (type: string = "info", colors: any) => {
  const styles = {
    info: {
      backgroundColor: `${colors.primary}20`,
      color: colors.primary,
      border: `1px solid ${colors.primary}30`,
    },
    success: {
      backgroundColor: "#10b98120",
      color: "#10b981",
      border: "1px solid #10b98130",
    },
    warning: {
      backgroundColor: "#f59e0b20",
      color: "#f59e0b",
      border: "1px solid #f59e0b30",
    },
    error: {
      backgroundColor: "#ef444420",
      color: "#ef4444",
      border: "1px solid #ef444430",
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

    // DEBUG LOG
    React.useEffect(() => {
      console.log("📋 UnifiedSidebar rendered with props:", {
        isOpen,
        isCollapsed,
        isMobile,
        className,
      });
    }, [isOpen, isCollapsed, isMobile, className]);
    const {
      colors,
      config,
      toggleTheme,
      setUserMode,
      setThemeMode,
      isAdminMode,
      isClientMode,
    } = useTheme();

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

    // ===== THEME HANDLERS =====
    const handleUserModeChange = useCallback(
      (mode: "client" | "admin") => {
        setUserMode(mode);
      },
      [setUserMode],
    );

    const handleThemeModeChange = useCallback(
      (mode: "light" | "dark" | "custom") => {
        setThemeMode(mode);
      },
      [setThemeMode],
    );

    // ===== RENDER HELPERS =====
    const renderBadge = (item: MenuItem) => {
      if (!item.badge) return null;
      const badgeStyles = getBadgeStyles(item.badgeType, colors);
      return (
        <Badge
          variant="secondary"
          className={`badge ml-auto text-xs px-1.5 py-0.5 rounded-full font-medium ${item.badgeType || "info"}`}
          style={badgeStyles}
        >
          {item.badge}
        </Badge>
      );
    };

    const renderMenuItem = (item: MenuItem) => {
      const Icon = item.icon;
      const isActive = isActiveItem(item);

      // Cores dinâmicas baseadas no estado e tema
      const getItemColors = () => {
        if (isActive) {
          return {
            backgroundColor: colors.primary,
            color: colors.primaryText,
            boxShadow: `0 2px 8px ${colors.primary}30`,
          };
        }

        if (config.themeMode === "dark") {
          return {
            color: colors.text,
            backgroundColor: "transparent",
            ":hover": {
              backgroundColor: `${colors.primary}15`,
              color: colors.primary,
            },
          };
        }

        return {
          color: colors.textMuted,
          backgroundColor: "transparent",
          ":hover": {
            backgroundColor: `${colors.primary}08`,
            color: colors.primary,
          },
        };
      };

      const itemStyles = getItemColors();

      const itemClasses = `
        menu-item group flex items-center w-full px-3 py-3 text-sm font-medium rounded-xl
        transition-all duration-200 ease-in-out hover-effect
        ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${isActive ? "active" : ""}
      `;

      const content = (
        <>
          <Icon size={20} className="flex-shrink-0" />
          {!isCollapsed && (
            <>
              <span className="ml-3 flex-1 truncate font-medium">
                {item.label}
              </span>
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
                    style={itemStyles}
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
              style={itemStyles}
              onClick={() => handleNavigation(item)}
            >
              {content}
            </button>
          )}
        </div>
      );
    };

    // Controles de tema removidos - agora ficam no cabeçalho

    return (
      <div
        className={`
          ${isMobile ? "fixed left-0 z-40 h-full top-0" : "relative z-10 h-screen"}
          ${isCollapsed ? "w-16" : "w-64"}
          border-r shadow-lg
          flex flex-col
          ${isOpen ? "block" : "hidden"}
          ${className}
        `}
        data-sidebar="true"
        style={{
          backgroundColor: colors.background,
          borderRightColor: colors.border,
        }}
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
