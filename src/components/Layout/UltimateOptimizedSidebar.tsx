/**
 * ULTIMATE OPTIMIZED SIDEBAR V2
 * High-performance, responsive sidebar with modern design
 * Focus: Accessibility, Smooth animations, Mobile-first
 */

import React, { useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  MessageSquare,
  DollarSign,
  Settings,
  Scale,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  FolderOpen,
  CheckSquare,
  BarChart3,
  Menu,
  Shield,
  Briefcase,
  Clock,
  Archive,
} from "lucide-react";
import { ThemeConfig } from "@/lib/ultimateDesignSystem";
import { performanceUtils } from "@/lib/performanceUtils";

// ===== TYPES =====
interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
  badge?: string | number;
  children?: NavigationItem[];
  roles?: ("user" | "admin")[];
}

interface SidebarProps {
  expanded: boolean;
  onToggle: () => void;
  theme: ThemeConfig;
  isMobile: boolean;
}

// ===== NAVIGATION DATA =====
const navigationItems: NavigationItem[] = [
  {
    id: "painel",
    label: "Painel de Controle",
    icon: LayoutDashboard,
    path: "/painel",
    badge: "5",
  },
  {
    id: "crm",
    label: "CRM Jurídico",
    icon: Users,
    path: "/crm-modern",
    children: [
      {
        id: "clientes",
        label: "Clientes",
        icon: Users,
        path: "/crm-modern/clientes",
        badge: "47",
      },
      {
        id: "processos",
        label: "Processos",
        icon: Scale,
        path: "/crm-modern/processos",
        badge: "12",
      },
      {
        id: "tarefas-crm",
        label: "Tarefas",
        icon: CheckSquare,
        path: "/crm-modern/tarefas",
        badge: "25",
      },
      {
        id: "contratos-crm",
        label: "Contratos",
        icon: FileText,
        path: "/crm-modern/contratos",
      },
      {
        id: "financeiro-crm",
        label: "Financeiro",
        icon: DollarSign,
        path: "/crm-modern/financeiro",
      },
      {
        id: "documentos",
        label: "Documentos",
        icon: FolderOpen,
        path: "/crm-modern/documentos",
      },
    ],
  },
  {
    id: "agenda",
    label: "Agenda",
    icon: Calendar,
    path: "/agenda",
    badge: "3",
  },
  {
    id: "publicacoes",
    label: "Publicações",
    icon: FileText,
    path: "/publicacoes",
    badge: "99+",
  },
  {
    id: "atendimento",
    label: "Atendimento",
    icon: MessageSquare,
    path: "/atendimento",
  },
  {
    id: "financeiro",
    label: "Financeiro",
    icon: DollarSign,
    path: "/financeiro",
  },
  {
    id: "contratos",
    label: "Contratos",
    icon: Briefcase,
    path: "/contratos",
  },
  {
    id: "tarefas",
    label: "Tarefas",
    icon: CheckSquare,
    path: "/tarefas",
    badge: "7",
  },
  {
    id: "tempo",
    label: "Controle de Tempo",
    icon: Clock,
    path: "/tempo",
  },

  // Gerencial Section (Admin/Manager roles)
  {
    id: "gerencial",
    label: "Gerencial",
    icon: BarChart3,
    path: "#",
    roles: ["admin"],
    children: [
      {
        id: "tarefas-gerencial",
        label: "Tarefas Gerenciais",
        icon: CheckSquare,
        path: "/tarefas-gerencial",
        roles: ["admin"],
      },
      {
        id: "ged-organizacional",
        label: "GED Organizacional",
        icon: Archive,
        path: "/ged-organizacional",
        roles: ["admin"],
      },
      {
        id: "financeiro-gerencial",
        label: "Financeiro Gerencial",
        icon: BarChart3,
        path: "/financeiro-gerencial",
        roles: ["admin"],
      },
    ],
  },

  // Beta Section (Development)
  {
    id: "beta",
    label: "Beta",
    icon: Shield,
    path: "/beta",
    roles: ["admin"],
    children: [
      {
        id: "beta-dashboard",
        label: "Dashboard Beta",
        icon: LayoutDashboard,
        path: "/beta",
        roles: ["admin"],
      },
      {
        id: "beta-reports",
        label: "Relatórios Beta",
        icon: BarChart3,
        path: "/beta/reports",
        roles: ["admin"],
      },
      {
        id: "code-optimization",
        label: "Higienização",
        icon: Settings,
        path: "/beta/optimization",
        roles: ["admin"],
      },
    ],
  },
];

// ===== MEMOIZED COMPONENTS =====
const NavigationIcon = React.memo<{
  icon: React.ComponentType<{ size?: number; className?: string }>;
  className?: string;
}>(({ icon: Icon, className = "" }) => (
  <Icon size={20} className={className} />
));

const Badge = React.memo<{
  value: string | number;
  variant?: "default" | "warning" | "success";
}>(({ value, variant = "default" }) => {
  const badgeClass = useMemo(() => {
    const base =
      "flex items-center justify-center min-w-5 h-5 text-xs font-medium rounded-full";
    switch (variant) {
      case "warning":
        return `${base} bg-amber-100 text-amber-800`;
      case "success":
        return `${base} bg-green-100 text-green-800`;
      default:
        return `${base} bg-blue-100 text-blue-800`;
    }
  }, [variant]);

  return <span className={badgeClass}>{value}</span>;
});

// ===== MAIN SIDEBAR COMPONENT =====
const UltimateOptimizedSidebar: React.FC<SidebarProps> = ({
  expanded,
  onToggle,
  theme,
  isMobile,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(["crm"]),
  );

  // ===== NAVIGATION HANDLERS =====
  const handleNavigate = useCallback(
    (path: string, itemId: string) => {
      if (path === "#") {
        // Toggle group expansion
        setExpandedGroups((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(itemId)) {
            newSet.delete(itemId);
          } else {
            newSet.add(itemId);
          }
          return newSet;
        });
      } else {
        navigate(path);
        performanceUtils.accessibilityUtils.announce(
          `Navigated to ${path}`,
          "polite",
        );
      }
    },
    [navigate],
  );

  // ===== FILTERED NAVIGATION =====
  const filteredNavigation = useMemo(() => {
    return navigationItems
      .filter((item) => {
        if (!item.roles) return true;
        return item.roles.includes(theme.role);
      })
      .map((item) => ({
        ...item,
        children: item.children?.filter((child) => {
          if (!child.roles) return true;
          return child.roles.includes(theme.role);
        }),
      }));
  }, [theme.role]);

  // ===== STYLES =====
  const sidebarStyles = useMemo(
    () => ({
      container: {
        width: expanded ? "256px" : "64px",
        height: "100vh",
        backgroundColor: "var(--surface-primary)",
        borderRight: "1px solid var(--border-primary)",
        display: "flex",
        flexDirection: "column" as const,
        overflow: "hidden",
        transition: "width var(--duration-normal) var(--easing-default)",
      },

      header: {
        padding: expanded ? "var(--spacing-lg)" : "var(--spacing-md)",
        borderBottom: "1px solid var(--border-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: expanded ? "space-between" : "center",
        minHeight: "4rem",
        backgroundColor: "var(--surface-primary)",
      },

      logo: {
        display: "flex",
        alignItems: "center",
        gap: "var(--spacing-sm)",
        fontWeight: 700,
        fontSize: "1.25rem",
        color: "var(--text-accent)",
      },

      navigation: {
        flex: 1,
        overflowY: "auto" as const,
        padding: "var(--spacing-md)",
      },

      footer: {
        padding: "var(--spacing-md)",
        borderTop: "1px solid var(--border-primary)",
        backgroundColor: "var(--surface-secondary)",
      },
    }),
    [expanded],
  );

  // ===== NAVIGATION ITEM COMPONENT =====
  const NavigationItem = React.memo<{
    item: NavigationItem;
    level?: number;
  }>(({ item, level = 0 }) => {
    const isActive =
      location.pathname === item.path ||
      (item.children &&
        item.children.some((child) => location.pathname === child.path));
    const isExpanded = expandedGroups.has(item.id);
    const isHovered = hoveredItem === item.id;

    const itemStyles = useMemo(
      () => ({
        button: {
          width: "100%",
          display: "flex",
          alignItems: "center",
          padding: expanded
            ? "var(--spacing-sm) var(--spacing-md)"
            : "var(--spacing-md)",
          marginBottom: "var(--spacing-xs)",
          borderRadius: "var(--radius-md)",
          border: "none",
          backgroundColor: isActive
            ? "var(--primary-50)"
            : isHovered
              ? "var(--surface-secondary)"
              : "transparent",
          color: isActive ? "var(--text-accent)" : "var(--text-secondary)",
          cursor: "pointer",
          transition: "all var(--duration-normal) var(--easing-default)",
          textAlign: "left" as const,
          gap: "var(--spacing-sm)",
          justifyContent: expanded ? "flex-start" : "center",
          paddingLeft:
            level > 0 && expanded
              ? `${level * 16 + 16}px`
              : "var(--spacing-md)",
        },

        label: {
          opacity: expanded ? 1 : 0,
          visibility: expanded ? ("visible" as const) : ("hidden" as const),
          transition: "opacity var(--duration-fast) var(--easing-default)",
          fontSize: "0.875rem",
          fontWeight: isActive ? 600 : 500,
          flex: 1,
        },

        badge: {
          opacity: expanded ? 1 : 0,
          visibility: expanded ? ("visible" as const) : ("hidden" as const),
          transition: "opacity var(--duration-fast) var(--easing-default)",
        },

        children: {
          marginLeft: expanded ? "var(--spacing-md)" : 0,
          opacity: expanded && isExpanded ? 1 : 0,
          maxHeight: expanded && isExpanded ? "1000px" : 0,
          overflow: "hidden" as const,
          transition: "all var(--duration-normal) var(--easing-default)",
        },
      }),
      [isActive, isHovered, isExpanded, expanded, level],
    );

    return (
      <>
        <button
          style={itemStyles.button}
          onClick={() => handleNavigate(item.path, item.id)}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          aria-label={item.label}
          aria-current={isActive ? "page" : undefined}
          title={!expanded ? item.label : undefined}
        >
          <NavigationIcon
            icon={item.icon}
            className={isActive ? "text-current" : "text-current opacity-70"}
          />

          <span style={itemStyles.label}>{item.label}</span>

          {item.badge && (
            <div style={itemStyles.badge}>
              <Badge
                value={item.badge}
                variant={item.badge === "99+" ? "warning" : "default"}
              />
            </div>
          )}

          {item.children && expanded && (
            <ChevronRight
              size={16}
              style={{
                transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                transition:
                  "transform var(--duration-normal) var(--easing-default)",
              }}
            />
          )}
        </button>

        {item.children && (
          <div style={itemStyles.children}>
            {item.children.map((child) => (
              <NavigationItem key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </>
    );
  });

  // ===== RENDER =====
  return (
    <aside style={sidebarStyles.container} className="sidebar-optimized">
      {/* Header */}
      <div style={sidebarStyles.header}>
        <div style={sidebarStyles.logo}>
          <Scale size={24} />
          {expanded && <span>Lawdesk</span>}
        </div>

        {!isMobile && (
          <button
            onClick={onToggle}
            className="btn-ghost p-1"
            aria-label={expanded ? "Recolher sidebar" : "Expandir sidebar"}
          >
            {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav style={sidebarStyles.navigation} aria-label="Navegação principal">
        {filteredNavigation.map((item) => (
          <NavigationItem key={item.id} item={item} />
        ))}
      </nav>

      {/* Footer */}
      <div style={sidebarStyles.footer}>
        <button
          onClick={() => handleNavigate("/configuracoes-usuario", "settings")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            padding: expanded
              ? "var(--spacing-sm) var(--spacing-md)"
              : "var(--spacing-md)",
            borderRadius: "var(--radius-md)",
            border: "none",
            backgroundColor: "transparent",
            color: "var(--text-secondary)",
            cursor: "pointer",
            transition: "all var(--duration-normal) var(--easing-default)",
            gap: "var(--spacing-sm)",
            justifyContent: expanded ? "flex-start" : "center",
          }}
          aria-label="Configurações"
        >
          <Settings size={20} />
          {expanded && (
            <span style={{ fontSize: "0.875rem" }}>Configurações</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default UltimateOptimizedSidebar;
