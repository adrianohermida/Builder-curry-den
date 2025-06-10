/**
 * 🎯 SIDEBAR SAAS - SIDEBAR ESPECÍFICO PARA PLANO SAAS
 *
 * Sidebar com recursos SaaS premium:
 * - Navegação premium exclusiva
 * - Indicadores de recursos por plano
 * - Acesso a integrações avançadas
 * - Ferramentas de analytics
 * - Suporte premium
 */

import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Scale,
  FileSignature,
  CheckSquare,
  DollarSign,
  FolderOpen,
  BarChart3,
  Zap,
  Crown,
  Star,
  Globe,
  Link,
  Cpu,
  Shield,
  Headphones,
  TrendingUp,
  Calendar,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Lock,
  Sparkles,
} from "lucide-react";

// Components
import Button from "@/components/ui/OptimizedButton";

// ===== TYPES =====
interface SidebarSaaSProps {
  variant?: "expanded" | "collapsed" | "hidden";
  saasFeatures: string[];
  plan: "starter" | "professional" | "enterprise";
  className?: string;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
  badge?: string | number;
  badgeVariant?: "default" | "success" | "warning" | "error" | "premium";
  children?: NavigationItem[];
  requiredPlan?: "starter" | "professional" | "enterprise";
  isPremium?: boolean;
  isNew?: boolean;
  external?: boolean;
  description?: string;
}

interface NavigationSection {
  id: string;
  label: string;
  items: NavigationItem[];
  isPremium?: boolean;
  requiredPlan?: "starter" | "professional" | "enterprise";
}

// ===== SAAS NAVIGATION CONFIGURATION =====
const SAAS_NAVIGATION: NavigationSection[] = [
  {
    id: "core",
    label: "Core System",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/painel",
        description: "Visão geral do sistema",
      },
      {
        id: "crm",
        label: "CRM Jurídico",
        icon: Users,
        path: "/crm-modern",
        badge: "Atualizado",
        badgeVariant: "success",
        children: [
          {
            id: "crm-contatos",
            label: "Contatos",
            icon: Users,
            path: "/crm-modern?module=contatos",
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
    label: "Workflow",
    items: [
      {
        id: "agenda",
        label: "Agenda",
        icon: Calendar,
        path: "/agenda",
        badge: 5,
        badgeVariant: "error",
      },
      {
        id: "publicacoes",
        label: "Publicações",
        icon: Bell,
        path: "/publicacoes",
        badge: "●",
        badgeVariant: "success",
      },
    ],
  },
  {
    id: "analytics",
    label: "Analytics & Reports",
    isPremium: true,
    requiredPlan: "professional",
    items: [
      {
        id: "analytics-dashboard",
        label: "Analytics",
        icon: BarChart3,
        path: "/analytics",
        isPremium: true,
        requiredPlan: "professional",
        badge: "Pro",
        badgeVariant: "premium",
      },
      {
        id: "advanced-reports",
        label: "Relatórios Avançados",
        icon: TrendingUp,
        path: "/relatorios/avancados",
        isPremium: true,
        requiredPlan: "professional",
        isNew: true,
      },
      {
        id: "business-intelligence",
        label: "Business Intelligence",
        icon: Cpu,
        path: "/bi",
        isPremium: true,
        requiredPlan: "enterprise",
        badge: "Enterprise",
        badgeVariant: "premium",
      },
    ],
  },
  {
    id: "integrations",
    label: "Integrações",
    isPremium: true,
    requiredPlan: "professional",
    items: [
      {
        id: "integrations-hub",
        label: "Hub de Integrações",
        icon: Link,
        path: "/integracoes",
        isPremium: true,
        requiredPlan: "professional",
      },
      {
        id: "api-access",
        label: "API Access",
        icon: Globe,
        path: "/api",
        isPremium: true,
        requiredPlan: "professional",
        external: true,
      },
      {
        id: "webhooks",
        label: "Webhooks",
        icon: Zap,
        path: "/webhooks",
        isPremium: true,
        requiredPlan: "enterprise",
      },
      {
        id: "custom-integrations",
        label: "Integrações Customizadas",
        icon: Sparkles,
        path: "/integracoes/custom",
        isPremium: true,
        requiredPlan: "enterprise",
        badge: "Enterprise",
        badgeVariant: "premium",
      },
    ],
  },
  {
    id: "support",
    label: "Suporte & Ajuda",
    items: [
      {
        id: "help-center",
        label: "Central de Ajuda",
        icon: Headphones,
        path: "/ajuda",
      },
      {
        id: "premium-support",
        label: "Suporte Premium",
        icon: Crown,
        path: "/suporte/premium",
        isPremium: true,
        requiredPlan: "enterprise",
        badge: "24/7",
        badgeVariant: "premium",
      },
    ],
  },
  {
    id: "settings",
    label: "Configurações",
    items: [
      {
        id: "general-settings",
        label: "Geral",
        icon: Settings,
        path: "/configuracoes",
      },
      {
        id: "billing",
        label: "Faturamento",
        icon: DollarSign,
        path: "/billing",
      },
      {
        id: "security",
        label: "Segurança",
        icon: Shield,
        path: "/seguranca",
        isPremium: true,
        requiredPlan: "professional",
      },
    ],
  },
];

// ===== SIDEBAR SAAS COMPONENT =====
const SidebarSaaS: React.FC<SidebarSaaSProps> = ({
  variant = "expanded",
  saasFeatures,
  plan,
  className = "",
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ===== STATE =====
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["core", "workflow"]),
  );
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // ===== COMPUTED VALUES =====
  const isCollapsed = variant === "collapsed";
  const isHidden = variant === "hidden";

  const filteredSections = useMemo(() => {
    return SAAS_NAVIGATION.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        // Check if user has access to this feature
        if (item.requiredPlan) {
          const planLevels = { starter: 1, professional: 2, enterprise: 3 };
          const userLevel = planLevels[plan];
          const requiredLevel = planLevels[item.requiredPlan];
          return userLevel >= requiredLevel;
        }
        return true;
      }),
    })).filter((section) => {
      // Check section-level permissions
      if (section.requiredPlan) {
        const planLevels = { starter: 1, professional: 2, enterprise: 3 };
        const userLevel = planLevels[plan];
        const requiredLevel = planLevels[section.requiredPlan];
        return userLevel >= requiredLevel;
      }
      return section.items.length > 0;
    });
  }, [plan]);

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
      // Check if user has access
      if (item.requiredPlan) {
        const planLevels = { starter: 1, professional: 2, enterprise: 3 };
        const userLevel = planLevels[plan];
        const requiredLevel = planLevels[item.requiredPlan];

        if (userLevel < requiredLevel) {
          navigate("/billing/upgrade");
          return;
        }
      }

      if (item.external) {
        window.open(item.path, "_blank");
      } else {
        navigate(item.path);
      }
    },
    [navigate, plan],
  );

  const isActiveItem = (item: NavigationItem): boolean => {
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
  };

  // ===== RENDER FUNCTIONS =====
  const renderBadge = (badge: string | number, variant: string = "default") => {
    const variants = {
      default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      success:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      warning:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      premium:
        "bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold",
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

  const renderPremiumLock = (requiredPlan: string) => {
    return (
      <div className="flex items-center gap-1">
        <Lock size={12} className="text-gray-400" />
        <span className="text-xs text-gray-400">{requiredPlan}</span>
      </div>
    );
  };

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const isActive = isActiveItem(item);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const hasAccess =
      !item.requiredPlan ||
      (() => {
        const planLevels = { starter: 1, professional: 2, enterprise: 3 };
        return planLevels[plan] >= planLevels[item.requiredPlan];
      })();

    return (
      <div key={item.id} className="relative group">
        <button
          onClick={() => {
            if (hasChildren) {
              toggleItem(item.id);
            } else {
              handleNavigation(item);
            }
          }}
          disabled={!hasAccess}
          className={`
            w-full flex items-center gap-3 px-3 py-2 text-left transition-all duration-200 rounded-lg
            ${level > 0 ? "ml-6 text-sm" : ""}
            ${
              isActive
                ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                : !hasAccess
                  ? "text-gray-400 cursor-not-allowed opacity-60"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }
            ${isCollapsed ? "justify-center px-2" : ""}
          `}
          title={isCollapsed ? item.label : item.description}
        >
          {/* Icon */}
          <div className="relative">
            <item.icon
              size={18}
              className={`flex-shrink-0 ${isActive ? "text-primary-600" : ""}`}
            />
            {item.isPremium && hasAccess && (
              <Star
                size={8}
                className="absolute -top-1 -right-1 text-yellow-500 fill-current"
              />
            )}
          </div>

          {/* Label and Badges */}
          {!isCollapsed && (
            <>
              <span className="flex-1 truncate">{item.label}</span>

              {/* New Badge */}
              {item.isNew && (
                <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  Novo
                </span>
              )}

              {/* Badge */}
              {item.badge && renderBadge(item.badge, item.badgeVariant)}

              {/* Premium Lock */}
              {!hasAccess &&
                item.requiredPlan &&
                renderPremiumLock(item.requiredPlan)}

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
            <div className="flex items-center gap-2">
              <span>{section.label}</span>
              {section.isPremium && (
                <Crown size={12} className="text-yellow-500" />
              )}
            </div>
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

  const renderPlanIndicator = () => {
    if (isCollapsed) return null;

    const planColors = {
      starter: "from-blue-500 to-blue-600",
      professional: "from-purple-500 to-purple-600",
      enterprise: "from-yellow-500 to-yellow-600",
    };

    return (
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div
          className={`
            p-3 rounded-lg bg-gradient-to-r ${planColors[plan]} text-white
          `}
        >
          <div className="flex items-center gap-2 mb-2">
            {plan === "enterprise" ? (
              <Crown size={16} />
            ) : plan === "professional" ? (
              <Star size={16} />
            ) : (
              <TrendingUp size={16} />
            )}
            <span className="font-medium">
              Plano {plan.charAt(0).toUpperCase() + plan.slice(1)}
            </span>
          </div>
          <p className="text-xs opacity-90">
            {saasFeatures.slice(0, 2).join(" • ")}
          </p>
          {plan !== "enterprise" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/billing/upgrade")}
              className="w-full mt-2 bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              Fazer Upgrade
            </Button>
          )}
        </div>
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
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">L</span>
        </div>

        {/* Brand Name */}
        {!isCollapsed && (
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Lawdesk
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SaaS Edition
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {filteredSections.map(renderSection)}
      </nav>

      {/* Plan Indicator */}
      {renderPlanIndicator()}
    </aside>
  );
};

export default React.memo(SidebarSaaS);
