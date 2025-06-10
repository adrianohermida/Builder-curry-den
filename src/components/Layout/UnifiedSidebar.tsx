/**
 * 🎯 UNIFIED SIDEBAR - SISTEMA CONSOLIDADO DE NAVEGAÇÃO
 *
 * Sidebar unificado que consolida todas as variações existentes em um único componente:
 * - Design consistente e responsivo
 * - Estrutura de menu organizada semanticamente
 * - Performance otimizada com React.memo
 * - Acessibilidade completa
 * - Suporte a temas
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
  Search,
  X,
  User,
  LogOut,
  Bell,
  HelpCircle,
  Shield,
} from "lucide-react";

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

// Environment utilities
import { IS_DEVELOPMENT } from "@/lib/env";

// ===== TYPES =====
interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
  badge?: string | number;
  badgeType?: "info" | "success" | "warning" | "error";
  children?: MenuItem[];
  roles?: string[];
  beta?: boolean;
  disabled?: boolean;
  description?: string;
  external?: boolean;
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
        description: "Visão geral do sistema",
      },
      {
        id: "feed",
        label: "Feed",
        icon: MessageSquare,
        path: "/feed",
        badge: 3,
        badgeType: "info",
        description: "Feed social colaborativo",
        children: [
          {
            id: "feed-timeline",
            label: "Timeline",
            icon: MessageSquare,
            path: "/feed",
          },
          {
            id: "feed-posts",
            label: "Minhas Publicações",
            icon: MessageSquare,
            path: "/feed/posts",
          },
          {
            id: "feed-messages",
            label: "Mensagens",
            icon: MessageSquare,
            path: "/feed/messages",
            badge: 2,
            badgeType: "warning",
          },
          {
            id: "feed-events",
            label: "Eventos",
            icon: Calendar,
            path: "/feed/events",
          },
          {
            id: "feed-polls",
            label: "Enquetes",
            icon: BarChart3,
            path: "/feed/polls",
          },
        ],
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
        children: [
          {
            id: "processos-ativos",
            label: "Processos Ativos",
            icon: Scale,
            path: "/crm-modern?module=processos&filter=ativos",
          },
          {
            id: "processos-aguardando",
            label: "Aguardando Andamento",
            icon: Scale,
            path: "/crm-modern?module=processos&filter=aguardando",
            badge: 5,
            badgeType: "error",
          },
          {
            id: "processos-finalizados",
            label: "Finalizados",
            icon: Scale,
            path: "/crm-modern?module=processos&filter=finalizados",
          },
          {
            id: "jurisprudencia",
            label: "Jurisprudência",
            icon: Scale,
            path: "/crm-modern?module=jurisprudencia",
          },
        ],
      },
      {
        id: "clientes",
        label: "Clientes",
        icon: Users,
        path: "/crm-modern?module=clientes",
        description: "Gestão de clientes",
        children: [
          {
            id: "clientes-ativos",
            label: "Clientes Ativos",
            icon: Users,
            path: "/crm-modern?module=clientes&filter=ativos",
          },
          {
            id: "clientes-potenciais",
            label: "Leads",
            icon: Users,
            path: "/crm-modern?module=clientes&filter=leads",
            badge: 12,
            badgeType: "info",
          },
          {
            id: "clientes-inativos",
            label: "Inativos",
            icon: Users,
            path: "/crm-modern?module=clientes&filter=inativos",
          },
        ],
      },
      {
        id: "tarefas",
        label: "Tarefas",
        icon: CheckSquare,
        path: "/crm-modern?module=tarefas",
        badge: 8,
        badgeType: "success",
        description: "Gestão de tarefas e atividades",
        children: [
          {
            id: "tarefas-hoje",
            label: "Para Hoje",
            icon: CheckSquare,
            path: "/crm-modern?module=tarefas&filter=hoje",
            badge: 3,
            badgeType: "error",
          },
          {
            id: "tarefas-semana",
            label: "Esta Semana",
            icon: CheckSquare,
            path: "/crm-modern?module=tarefas&filter=semana",
          },
          {
            id: "tarefas-atrasadas",
            label: "Atrasadas",
            icon: CheckSquare,
            path: "/crm-modern?module=tarefas&filter=atrasadas",
            badge: 2,
            badgeType: "error",
          },
          {
            id: "tarefas-completas",
            label: "Concluídas",
            icon: CheckSquare,
            path: "/crm-modern?module=tarefas&filter=completas",
          },
        ],
      },
      {
        id: "calendario",
        label: "Calendário",
        icon: Calendar,
        path: "/agenda",
        badge: 2,
        badgeType: "warning",
        description: "Agenda e compromissos",
        children: [
          {
            id: "agenda-hoje",
            label: "Hoje",
            icon: Calendar,
            path: "/agenda?view=today",
          },
          {
            id: "agenda-semana",
            label: "Esta Semana",
            icon: Calendar,
            path: "/agenda?view=week",
          },
          {
            id: "agenda-mes",
            label: "Este Mês",
            icon: Calendar,
            path: "/agenda?view=month",
          },
          {
            id: "audiencias",
            label: "Audiências",
            icon: Calendar,
            path: "/agenda?type=audiencias",
            badge: 1,
            badgeType: "error",
          },
        ],
      },
      {
        id: "documentos",
        label: "Documentos",
        icon: FolderOpen,
        path: "/crm-modern?module=documentos",
        description: "Gestão de documentos",
        children: [
          {
            id: "documentos-recentes",
            label: "Recentes",
            icon: FolderOpen,
            path: "/crm-modern?module=documentos&filter=recentes",
          },
          {
            id: "documentos-contratos",
            label: "Contratos",
            icon: FolderOpen,
            path: "/crm-modern?module=documentos&type=contratos",
          },
          {
            id: "documentos-peticoes",
            label: "Petições",
            icon: FolderOpen,
            path: "/crm-modern?module=documentos&type=peticoes",
          },
          {
            id: "documentos-modelos",
            label: "Modelos",
            icon: FolderOpen,
            path: "/crm-modern?module=documentos&type=modelos",
          },
        ],
      },
      {
        id: "comunicacao",
        label: "Comunicação",
        icon: MessageSquare,
        path: "/atendimento",
        badge: 5,
        badgeType: "info",
        description: "Central de comunicação",
        children: [
          {
            id: "chat",
            label: "Chat",
            icon: MessageSquare,
            path: "/atendimento?module=chat",
            badge: 3,
            badgeType: "success",
          },
          {
            id: "emails",
            label: "E-mails",
            icon: MessageSquare,
            path: "/atendimento?module=emails",
          },
          {
            id: "notificacoes",
            label: "Notificações",
            icon: Bell,
            path: "/atendimento?module=notificacoes",
            badge: 7,
            badgeType: "info",
          },
          {
            id: "publicacoes",
            label: "Publicações",
            icon: Bell,
            path: "/publicacoes",
            badge: "●",
            badgeType: "success",
          },
        ],
      },
    ],
  },
  {
    id: "analytics",
    label: "Insights",
    collapsible: true,
    defaultExpanded: false,
    items: [
      {
        id: "relatorios",
        label: "Relatórios",
        icon: BarChart3,
        path: "/analytics",
        description: "Relatórios e análises",
        children: [
          {
            id: "relatorios-financeiro",
            label: "Financeiro",
            icon: BarChart3,
            path: "/analytics?type=financeiro",
          },
          {
            id: "relatorios-produtividade",
            label: "Produtividade",
            icon: BarChart3,
            path: "/analytics?type=produtividade",
          },
          {
            id: "relatorios-clientes",
            label: "Clientes",
            icon: BarChart3,
            path: "/analytics?type=clientes",
          },
          {
            id: "relatorios-processos",
            label: "Processos",
            icon: BarChart3,
            path: "/analytics?type=processos",
          },
        ],
      },
    ],
  },
  {
    id: "beta",
    label: "Experimental",
    collapsible: true,
    defaultExpanded: false,
    items: [
      {
        id: "beta",
        label: "Beta",
        icon: FlaskConical,
        path: "/beta",
        beta: true,
        description: "Recursos experimentais",
        children: [
          {
            id: "ia-assistant",
            label: "Assistente IA",
            icon: FlaskConical,
            path: "/beta/ia-assistant",
            beta: true,
            badge: "NOVO",
            badgeType: "success",
          },
          {
            id: "automacao",
            label: "Automação",
            icon: FlaskConical,
            path: "/beta/automacao",
            beta: true,
          },
          {
            id: "analytics-avancado",
            label: "Analytics Avançado",
            icon: FlaskConical,
            path: "/beta/analytics",
            beta: true,
          },
        ],
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
        children: [
          {
            id: "config-geral",
            label: "Geral",
            icon: Settings,
            path: "/configuracoes?section=geral",
          },
          {
            id: "config-usuarios",
            label: "Usuários",
            icon: Users,
            path: "/configuracoes?section=usuarios",
            roles: ["admin"],
          },
          {
            id: "config-seguranca",
            label: "Segurança",
            icon: Shield,
            path: "/configuracoes?section=seguranca",
            roles: ["admin"],
          },
          {
            id: "config-integracao",
            label: "Integrações",
            icon: Settings,
            path: "/configuracoes?section=integracoes",
          },
          {
            id: "config-armazenamento",
            label: "Armazenamento",
            icon: Settings,
            path: "/configuracao-armazenamento",
          },
        ],
      },
      {
        id: "ajuda",
        label: "Ajuda",
        icon: HelpCircle,
        path: "/ajuda",
        description: "Central de ajuda e suporte",
        external: true,
      },
    ],
  },
];

// ===== UTILS =====
const getBadgeStyles = (type: string = "info") => {
  const styles = {
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
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
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState("");

    // ===== USER DATA (mock) =====
    const userRole = "admin"; // Isso viria do contexto/store real
    const userPermissions = ["read", "write", "admin"];

    // ===== COMPUTED VALUES =====
    const filteredSections = useMemo(() => {
      if (!searchQuery) return MENU_STRUCTURE;

      const searchLower = searchQuery.toLowerCase();
      return MENU_STRUCTURE.map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          const matchesSearch =
            item.label.toLowerCase().includes(searchLower) ||
            item.description?.toLowerCase().includes(searchLower) ||
            item.children?.some(
              (child) =>
                child.label.toLowerCase().includes(searchLower) ||
                child.description?.toLowerCase().includes(searchLower),
            );

          const hasPermission = !item.roles || item.roles.includes(userRole);

          return matchesSearch && hasPermission;
        }),
      })).filter((section) => section.items.length > 0);
    }, [searchQuery, userRole]);

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

    const handleItemToggle = useCallback(
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
      (item: MenuItem) => {
        if (item.disabled) return;

        if (item.external) {
          window.open(item.path, "_blank", "noopener,noreferrer");
        } else {
          navigate(item.path);
        }

        // Close mobile sidebar after navigation
        onClose();
      },
      [navigate, onClose],
    );

    const isActiveItem = useCallback(
      (item: MenuItem): boolean => {
        if (item.path === location.pathname) return true;

        // Handle query parameter matching
        if (item.path.includes("?")) {
          const [basePath, queryString] = item.path.split("?");
          if (location.pathname !== basePath) return false;

          const itemParams = new URLSearchParams(queryString);
          const currentParams = new URLSearchParams(location.search);

          // Check if all item params match current params
          for (const [key, value] of itemParams.entries()) {
            if (currentParams.get(key) !== value) return false;
          }
          return true;
        }

        // Check if current path starts with item path (excluding root)
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

    const renderBetaBadge = () => (
      <Badge className="ml-1 text-xs px-1 py-0 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
        BETA
      </Badge>
    );

    const renderMenuItem = (item: MenuItem, depth = 0) => {
      const Icon = item.icon;
      const isActive = isActiveItem(item);
      const hasChildren = item.children && item.children.length > 0;
      const isItemExpanded = expandedItems.has(item.id);
      const hasPermission = !item.roles || item.roles.includes(userRole);

      if (!hasPermission) return null;

      const itemClasses = `
      group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg
      transition-all duration-200 ease-in-out
      ${
        isActive
          ? "bg-primary text-primary-foreground shadow-sm border border-primary/20"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
      }
      ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      ${depth > 0 ? `ml-${Math.min(depth * 4, 8)}` : ""}
    `;

      const handleClick = () => {
        if (hasChildren && !isCollapsed) {
          handleItemToggle(item.id);
        } else if (!hasChildren) {
          handleNavigation(item);
        }
      };

      const content = (
        <>
          <Icon size={20} className="flex-shrink-0" />
          {!isCollapsed && (
            <>
              <span className="ml-3 flex-1 truncate">
                {item.label}
                {item.beta && renderBetaBadge()}
              </span>
              {renderBadge(item)}
              {hasChildren && (
                <ChevronRight
                  size={16}
                  className={`ml-1 flex-shrink-0 transition-transform duration-200 ${
                    isItemExpanded ? "rotate-90" : ""
                  }`}
                />
              )}
            </>
          )}
        </>
      );

      return (
        <div key={item.id} className="space-y-1">
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className={itemClasses} onClick={handleClick}>
                    {content}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  <div>
                    <p className="font-medium">
                      {item.label}
                      {item.beta && " (Beta)"}
                    </p>
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
            <button className={itemClasses} onClick={handleClick}>
              {content}
            </button>
          )}

          {/* Render children if expanded and not collapsed */}
          {hasChildren && isItemExpanded && !isCollapsed && (
            <div className="ml-4 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-4">
              {item
                .children!.filter(
                  (child) => !child.roles || child.roles.includes(userRole),
                )
                .map((child) => renderMenuItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    };

    const renderSection = (section: MenuSection) => {
      const isSectionExpanded = expandedSections.has(section.id);
      const hasVisibleItems = section.items.some(
        (item) => !item.roles || item.roles.includes(userRole),
      );

      if (!hasVisibleItems) return null;

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
                    className={`transition-transform duration-200 ${
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
              {section.items
                .filter((item) => !item.roles || item.roles.includes(userRole))
                .map((item) => renderMenuItem(item))}
            </div>
          )}

          {!isCollapsed && <div className="h-4" />}
        </div>
      );
    };

    // Sempre renderizar, usar transform para mostrar/esconder
    // if (!isOpen) return null;

    return (
      <div
        className={`
        fixed left-0 z-40 h-full
        ${isCollapsed ? "w-16" : "w-64"}
        bg-white border-r border-gray-200 shadow-lg
        transition-all duration-300 ease-in-out
        flex flex-col
        ${isMobile ? "top-0" : "top-14 h-[calc(100vh-3.5rem)]"}
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        ${className}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          {isCollapsed ? (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
              <Scale size={18} className="text-primary-foreground" />
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Scale size={18} className="text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    Lawdesk
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    CRM Jurídico
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="lg:hidden p-1.5 h-auto hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={18} />
              </Button>
            </>
          )}
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-primary dark:focus:border-primary"
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

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full p-2 h-auto hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <User size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Perfil do usuário</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User size={16} className="text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    Usuário Admin
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {userRole === "admin" ? "Administrador" : "Usuário"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LogOut size={16} className="mr-2" />
                Sair
              </Button>
            </div>
          )}
        </div>

        {/* Development Info */}
        {IS_DEVELOPMENT && !isCollapsed && (
          <div className="p-2 text-xs text-gray-400 font-mono border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
            <div>Mode: {process.env.NODE_ENV}</div>
            <div>Sidebar: {isCollapsed ? "Collapsed" : "Expanded"}</div>
          </div>
        )}
      </div>
    );
  },
);

UnifiedSidebar.displayName = "UnifiedSidebar";

export default UnifiedSidebar;
