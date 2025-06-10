/**
 * 🎯 SIDEBAR MAIN - SIDEBAR PRINCIPAL RESTAURADA
 *
 * Sidebar completamente refeita com:
 * - Design responsivo mobile-first
 * - Animações suaves e performáticas
 * - Navegação hierárquica clara
 * - Estados visuais consistentes
 * - Acessibilidade completa
 * - Sistema de tema integrado
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
  ChevronDown,
  ChevronRight,
  BarChart3,
  Shield,
  HelpCircle,
  HardDrive,
  LogOut,
  User,
  Search,
  X,
  Menu,
} from "lucide-react";

// Layout Context
import { useLayout } from "./MainLayout";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    ],
  },
  {
    id: "settings",
    label: "Configurações",
    items: [
      {
        id: "storage-config",
        label: "Armazenamento",
        icon: HardDrive,
        path: "/configuracao-armazenamento",
        description: "Configuração de provedores de armazenamento",
      },
      {
        id: "system-settings",
        label: "Sistema",
        icon: Settings,
        path: "/configuracoes",
        description: "Configurações do sistema",
      },
    ],
  },
  {
    id: "system",
    label: "Sistema",
    items: [
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
  const { userRole, permissions, isMobile, themeConfig } = useLayout();

  // ===== STATE =====
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["main", "workflow"]),
  );
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // ===== COMPUTED VALUES =====
  const isCollapsed = variant === "collapsed";
  const isHidden = variant === "hidden";
  const isExpanded = variant === "expanded";

  // Filter sections based on roles and search
  const filteredSections = useMemo(() => {
    return NAVIGATION_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        // Filter by user role
        if (item.roles && !item.roles.includes(userRole)) {
          return false;
        }

        // Filter by search query
        if (searchQuery) {
          const searchLower = searchQuery.toLowerCase();
          if (
            !item.label.toLowerCase().includes(searchLower) &&
            !item.description?.toLowerCase().includes(searchLower)
          ) {
            return false;
          }
        }

        return true;
      }),
    })).filter((section) => section.items.length > 0);
  }, [userRole, searchQuery]);

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
        window.open(item.path, "_blank", "noopener,noreferrer");
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
          location.pathname.startsWith("/crm-modern") &&
          currentModule === itemModule
        );
      }

      // Check if current path starts with item path
      return location.pathname.startsWith(item.path) && item.path !== "/";
    },
    [location.pathname, location.search],
  );

  // ===== RENDER BADGE =====
  const renderBadge = (item: NavigationItem) => {
    if (!item.badge) return null;

    const variants = {
      default: "bg-primary text-primary-foreground",
      success: "bg-success text-success-foreground",
      warning: "bg-warning text-warning-foreground",
      error: "bg-destructive text-destructive-foreground",
    };

    return (
      <Badge
        variant="secondary"
        className={`ml-auto text-xs ${variants[item.badgeVariant || "default"]}`}
      >
        {item.badge}
      </Badge>
    );
  };

  // ===== RENDER NAVIGATION ITEM =====
  const renderNavigationItem = (item: NavigationItem, depth = 0) => {
    const Icon = item.icon;
    const isActive = isActiveItem(item);
    const hasChildren = item.children && item.children.length > 0;
    const isItemExpanded = expandedItems.has(item.id);

    const itemClasses = `
      group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg
      transition-all duration-200 ease-in-out
      ${
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      }
      ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      ${depth > 0 ? "ml-6" : ""}
    `;

    const itemContent = (
      <>
        <Icon size={20} className="flex-shrink-0" />
        {isExpanded && (
          <>
            <span className="ml-3 flex-1 truncate">{item.label}</span>
            {renderBadge(item)}
            {hasChildren && (
              <ChevronRight
                size={16}
                className={`ml-1 flex-shrink-0 transition-transform ${
                  isItemExpanded ? "rotate-90" : ""
                }`}
              />
            )}
          </>
        )}
      </>
    );

    const handleClick = () => {
      if (hasChildren) {
        toggleItem(item.id);
      } else {
        handleNavigation(item);
      }
    };

    return (
      <div key={item.id}>
        {isCollapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className={itemClasses} onClick={handleClick}>
                  {itemContent}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                <p className="font-medium">{item.label}</p>
                {item.description && (
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <button className={itemClasses} onClick={handleClick}>
            {itemContent}
          </button>
        )}

        {/* Render children if expanded */}
        {hasChildren && isItemExpanded && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) =>
              renderNavigationItem(child, depth + 1),
            )}
          </div>
        )}
      </div>
    );
  };

  // ===== RENDER SECTION =====
  const renderSection = (section: NavigationSection) => {
    const isSectionExpanded = expandedSections.has(section.id);

    return (
      <div key={section.id} className="space-y-2">
        {isExpanded && (
          <button
            onClick={() => toggleSection(section.id)}
            className="flex items-center w-full px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
          >
            <span className="flex-1 text-left">{section.label}</span>
            <ChevronDown
              size={14}
              className={`transition-transform ${
                isSectionExpanded ? "" : "-rotate-90"
              }`}
            />
          </button>
        )}

        {(isSectionExpanded || isCollapsed) && (
          <div className="space-y-1">
            {section.items.map((item) => renderNavigationItem(item))}
          </div>
        )}

        {isExpanded && <Separator className="my-4" />}
      </div>
    );
  };

  // Don't render if hidden
  if (isHidden) return null;

  return (
    <div
      className={`
        sidebar-container h-full flex flex-col
        ${isCollapsed ? "w-16" : "w-64"}
        ${isMobile ? "fixed" : "relative"}
        transition-all duration-300 ease-in-out
        border-r border-sidebar-border bg-sidebar-background
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {isExpanded ? (
          <>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Scale size={18} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Lawdesk</h1>
                <p className="text-xs text-muted-foreground">CRM Jurídico</p>
              </div>
            </div>
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="p-1 h-auto"
              >
                <X size={18} />
              </Button>
            )}
          </>
        ) : (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
            <Scale size={18} className="text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Search */}
      {isExpanded && (
        <div className="p-4 border-b border-sidebar-border">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-sidebar-accent/50 border-sidebar-border"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">
          {filteredSections.map((section) => renderSection(section))}
        </nav>
      </ScrollArea>

      {/* User Profile / Footer */}
      <div className="p-4 border-t border-sidebar-border">
        {isExpanded ? (
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-sidebar-accent/50">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User size={16} className="text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Usuário Admin</p>
                <p className="text-xs text-muted-foreground">
                  {userRole === "admin" ? "Administrador" : "Usuário"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <LogOut size={16} className="mr-2" />
              Sair
            </Button>
          </div>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full p-2 h-auto">
                  <User size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Perfil do usuário</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default SidebarMain;
