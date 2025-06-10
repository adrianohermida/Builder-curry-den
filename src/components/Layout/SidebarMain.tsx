/**
 * 🎯 SIDEBAR MAIN - SIDEBAR PRINCIPAL RESPONSIVO
 *
 * Sidebar moderno e adaptável com:
 * - Variantes: expanded, collapsed, hidden
 * - Navegação hierárquica
 * - Badges e notificações
 * - Responsividade total
 * - Animações suaves
 * - Acessibilidade completa
 */

import React, { useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Scale,
  FileSignature,
  CheckSquare,
  DollarSign,
  FolderOpen,
  Calendar,
  MessageSquare,
  Settings,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Star,
  Archive,
  BarChart3,
  Shield,
  HelpCircle,
  Plus,
} from "lucide-react";

// Layout Context
import { useLayout } from "./MainLayout";

// Design System
import { ultimateDesignSystem } from "@/lib/ultimateDesignSystem";
import { performanceUtils } from "@/lib/performanceUtils";

// UI Components
import Button from "@/components/ui/OptimizedButton";

// ===== TYPES =====
interface SidebarMainProps {
  variant?: "expanded" | "collapsed" | "hidden";
  onToggle?: () => void;
  className?: string;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
  badge?: string | number;
  badgeVariant?: "default" | "success" | "warning" | "error";
  children?: NavigationItem[];
  roles?: string[];
  external?: boolean;
  disabled?: boolean;
  description?: string;
}

interface NavigationSection {
  id: string;
  label: string;
  items: NavigationItem[];
  collapsed?: boolean;
  roles?: string[];
}

// ===== NAVIGATION CONFIGURATION =====
const NAVIGATION_SECTIONS: NavigationSection[] = [
  {
    id: "main",
    label: "Principal",
    items: [
      {
        id: "dashboard",
        label: "Painel de Controle",
        icon: LayoutDashboard,
        path: "/painel",
        description: "Visão geral do sistema",
      },
      {
        id: "crm",
        label: "CRM Jurídico",
        icon: Users,
        path: "/crm-modern",
        badge: "Novo",
        badgeVariant: "success",
        description: "Gestão de relacionamentos",
        children: [
          {
            id: "crm-contatos",
            label: "Contatos",
            icon: Users,
            path: "/crm-modern?module=contatos",
          },
          {
            id: "crm-clientes",
            label: "Clientes",
            icon: Users,
            path: "/crm-modern?module=clientes",
          },
          {
            id: "crm-negocios",
            label: "Negócios",
            icon: Briefcase,
            path: "/crm-modern?module=negocios",
            badge: 3,
            badgeVariant: "warning",
          },
          {
            id: "crm-processos",
            label: "Processos",
            icon: Scale,
            path: "/crm-modern?module=processos",
          },
          {
            id: "crm-contratos",
            label: "Contratos",
            icon: FileSignature,
            path: "/crm-modern?module=contratos",
          },
          {
            id: "crm-tarefas",
            label: "Tarefas",
            icon: CheckSquare,
            path: "/crm-modern?module=tarefas",
            badge: 12,
            badgeVariant: "default",
          },
          {
            id: "crm-financeiro",
            label: "Financeiro",
            icon: DollarSign,
            path: "/crm-modern?module=financeiro",
          },
          {
            id: "crm-documentos",
            label: "Documentos",
            icon: FolderOpen,
            path: "/crm-modern?module=documentos",
          },
        ],
      },
    ],
  },
  {
    id: "workflow",
    label: "Fluxo de Trabalho",
    items: [
      {
        id: "agenda",
        label: "Agenda",
        icon: Calendar,
        path: "/agenda",
        badge: 5,
        badgeVariant: "error",
        description: "Compromissos e eventos",
      },
      {
        id: "publicacoes",
        label: "Publicações",
        icon: Bell,
        path: "/publicacoes",
        badge: "●",
        badgeVariant: "success",
        description: "Monitoramento de publicações",
      },
      {
        id: "atendimento",
        label: "Atendimento",
        icon: MessageSquare,
        path: "/atendimento",
        description: "Central de atendimento",
      },
    ],
  },
  {
    id: "reports",
    label: "Relatórios",
    items: [
      {
        id: "analytics",
        label: "Analytics",
        icon: BarChart3,
        path: "/analytics",
        description: "Métricas e análises",
      },
      {
        id: "relatorios",
        label: "Relatórios",
        icon: FileSignature,
        path: "/relatorios",
        description: "Relatórios customizados",
      },
    ],
  },
  {
    id: "system",
    label: "Sistema",
    items: [
      {
        id: "configuracoes",
        label: "Configurações",
        icon: Settings,
        path: "/configuracoes",
        description: "Configurações do sistema",
      },
      {
        id: "admin",
        label: "Administração",
        icon: Shield,
        path: "/admin",
        roles: ["admin"],
        description: "Painel administrativo",
      },
      {
        id: "ajuda",
        label: "Ajuda",
        icon: HelpCircle,
        path: "/ajuda",
        description: "Central de ajuda",
      },
    ],
  },
];

// ===== SIDEBAR MAIN COMPONENT =====
const SidebarMain: React.FC<SidebarMainProps> = ({
  variant = "expanded",
  onToggle,
  className = "",
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole, permissions, isMobile } = useLayout();

  // ===== STATE =====
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["main", "workflow"]),
  );
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // ===== COMPUTED VALUES =====
  const isCollapsed = variant === "collapsed";
  const isHidden = variant === "hidden";

  const filteredSections = useMemo(() => {
    return NAVIGATION_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        // Filter by user role
        if (item.roles && !item.roles.includes(userRole)) {
          return false;
        }
        // Filter by permissions (if needed)
        return true;
      }),
    })).filter((section) => section.items.length > 0);
  }, [userRole, permissions]);

  // ===== HANDLERS =====
  const toggleSection = useCallback(
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

  const toggleItem = useCallback(
    (itemId: string) => {
      if (isCollapsed) return;

      setExpandedItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(itemId)) {
          newSet.delete(itemId);
        } else {
          newSet.add(itemId);
        }
        return newSet;
      });
    },
    [isCollapsed],
  );

  const handleNavigation = useCallback(
    (item: NavigationItem) => {
      if (item.disabled) return;

      if (item.external) {
        window.open(item.path, "_blank");
      } else {
        navigate(item.path);
      }

      // Close mobile menu after navigation
      if (isMobile && onToggle) {
        onToggle();
      }
    },
    [navigate, isMobile, onToggle],
  );

  const isActiveItem = useCallback(
    (item: NavigationItem): boolean => {
      if (item.path === location.pathname) return true;

      // Check for CRM module matches
      if (item.path.includes("?module=")) {
        const urlParams = new URLSearchParams(location.search);
        const currentModule = urlParams.get("module");
        const itemModule = new URLSearchParams(item.path.split("?")[1]).get(
          "module",
        );
        return (
          location.pathname === "/crm-modern" && currentModule === itemModule
        );
      }

      return false;
    },
    [location.pathname, location.search],
  );

  // ===== RENDER FUNCTIONS =====
  const renderBadge = (badge: string | number, variant: string = "default") => {
    const variants = {
      default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      success:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      warning:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };

    return (
      <span
        className={`
          inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full
          ${variants[variant as keyof typeof variants] || variants.default}
        `}
      >
        {badge}
      </span>
    );
  };

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const isActive = isActiveItem(item);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
      <div key={item.id} className="relative">
        <button
          onClick={() => {
            if (hasChildren) {
              toggleItem(item.id);
            } else {
              handleNavigation(item);
            }
          }}
          disabled={item.disabled}
          className={`
            w-full flex items-center gap-3 px-3 py-2 text-left transition-all duration-200 rounded-lg
            ${level > 0 ? "ml-6 text-sm" : ""}
            ${
              isActive
                ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                : item.disabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }
            ${isCollapsed ? "justify-center px-2" : ""}
          `}
          title={isCollapsed ? item.label : item.description}
        >
          {/* Icon */}
          <item.icon
            size={18}
            className={`flex-shrink-0 ${isActive ? "text-primary-600" : ""}`}
          />

          {/* Label and Badge */}
          {!isCollapsed && (
            <>
              <span className="flex-1 truncate">{item.label}</span>

              {/* Badge */}
              {item.badge && renderBadge(item.badge, item.badgeVariant)}

              {/* External Link Icon */}
              {item.external && (
                <ExternalLink size={14} className="opacity-50" />
              )}

              {/* Expand/Collapse Icon */}
              {hasChildren && (
                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronDown size={16} className="text-gray-400" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-400" />
                  )}
                </div>
              )}
            </>
          )}
        </button>

        {/* Children */}
        {hasChildren && !isCollapsed && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) =>
              renderNavigationItem(child, level + 1),
            )}
          </div>
        )}

        {/* Collapsed tooltip */}
        {isCollapsed && hasChildren && (
          <div className="absolute left-full top-0 ml-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 hidden group-hover:block">
            <div className="px-3 py-1 text-sm font-medium text-gray-900 dark:text-gray-100">
              {item.label}
            </div>
            {item.children?.map((child) => (
              <button
                key={child.id}
                onClick={() => handleNavigation(child)}
                className="w-full flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <child.icon size={14} />
                {child.label}
                {child.badge && renderBadge(child.badge, child.badgeVariant)}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSection = (section: NavigationSection) => {
    const isExpanded = expandedSections.has(section.id);

    return (
      <div key={section.id} className="mb-6">
        {/* Section Header */}
        {!isCollapsed && (
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full flex items-center justify-between px-3 py-1 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <span>{section.label}</span>
            {isExpanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </button>
        )}

        {/* Section Items */}
        {(isCollapsed || isExpanded) && (
          <div className="space-y-1">
            {section.items.map((item) => renderNavigationItem(item))}
          </div>
        )}
      </div>
    );
  };

  // ===== MAIN RENDER =====
  if (isHidden) return null;

  return (
    <aside
      className={`
        ${isCollapsed ? "w-16" : "w-64"}
        h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
        flex flex-col transition-all duration-300 ease-in-out
        ${className}
      `}
    >
      {/* Header */}
      <div
        className={`
          flex items-center gap-3 px-4 py-4 border-b border-gray-200 dark:border-gray-700
          ${isCollapsed ? "justify-center px-2" : ""}
        `}
      >
        {/* Logo */}
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">L</span>
        </div>

        {/* Brand Name */}
        {!isCollapsed && (
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Lawdesk
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              CRM Jurídico
            </p>
          </div>
        )}

        {/* Collapse Toggle (Desktop) */}
        {!isMobile && onToggle && (
          <Button variant="ghost" size="sm" onClick={onToggle} className="p-1">
            {isCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </Button>
        )}
      </div>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => navigate("/novo")}
            className="w-full justify-center"
          >
            Novo
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {filteredSections.map(renderSection)}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        {!isCollapsed ? (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            <p>Lawdesk CRM v2.0</p>
            <p>© 2024 Todos os direitos reservados</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default React.memo(SidebarMain);
