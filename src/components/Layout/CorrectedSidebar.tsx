import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  Calendar,
  Brain,
  Settings,
  FolderOpen,
  Scale,
  X,
  CheckSquare,
  FileText,
  DollarSign,
  FileSignature,
  Headphones,
  Crown,
  Shield,
  Search,
  Rocket,
  Activity,
  Target,
  CreditCard,
  Package,
  Lock,
  Code,
  MonitorCheck,
  TrendingUp,
  PieChart,
  ChevronRight,
  Home,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/usePermissions";
import { useViewMode } from "@/contexts/ViewModeContext";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CorrectedSidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed?: boolean;
}

// Client mode menu items - Updated with modern structure
const clientMenuItems = [
  {
    title: "Painel",
    href: "/painel",
    icon: Home,
    permission: { module: "dashboard", action: "read" },
    description: "Visão geral e métricas",
  },
  {
    title: "CRM Jurídico",
    href: "/crm",
    icon: Users,
    permission: { module: "crm", action: "read" },
    description: "Sistema CRM Unicorn",
    submenu: [
      {
        title: "Clientes",
        href: "/crm/clientes",
        icon: Users,
        description: "Gestão de clientes",
      },
      {
        title: "Processos",
        href: "/crm/processos",
        icon: Scale,
        description: "Acompanhamento processual",
      },
      {
        title: "Contratos",
        href: "/crm/contratos",
        icon: FileText,
        description: "Gestão contratual",
      },
      {
        title: "Tarefas por Cliente",
        href: "/crm/tarefas",
        icon: CheckSquare,
        description: "Workflow personalizado",
      },
      {
        title: "Financeiro Individual",
        href: "/crm/financeiro",
        icon: DollarSign,
        description: "Gestão financeira",
      },
      {
        title: "GED Vinculado",
        href: "/crm/ged",
        icon: FolderOpen,
        description: "Documentos inteligentes",
      },
    ],
  },
  {
    title: "Agenda",
    href: "/agenda",
    icon: Calendar,
    permission: { module: "agenda", action: "read" },
    description: "Compromissos",
  },
  {
    title: "GED",
    href: "/ged-juridico",
    icon: FolderOpen,
    description: "Documentos",
    permission: { module: "ged", action: "read" },
  },
  {
    title: "IA Jurídica",
    href: "/ai-enhanced",
    icon: Brain,
    description: "Assistente IA",
    permission: { module: "ai", action: "read" },
    badge: "IA",
  },
  {
    title: "Tarefas",
    href: "/tarefas",
    icon: CheckSquare,
    description: "Gestão de tarefas",
    permission: { module: "tarefas", action: "read" },
  },
  {
    title: "Publicações",
    href: "/publicacoes",
    icon: FileText,
    description: "Diário oficial",
    permission: { module: "publicacoes", action: "read" },
  },
  {
    title: "Financeiro",
    href: "/financeiro",
    icon: DollarSign,
    description: "Gestão financeira",
    permission: { module: "financeiro", action: "read" },
  },
  {
    title: "Contratos",
    href: "/contratos",
    icon: FileSignature,
    description: "Gestão de contratos",
    permission: { module: "contratos", action: "read" },
  },
  {
    title: "Atendimento",
    href: "/atendimento",
    icon: Headphones,
    description: "Central de atendimento",
    permission: { module: "atendimento", action: "read" },
  },
];

// Admin mode menu items - SaaS focused
const adminMenuItems = [
  {
    title: "Dashboard Executivo",
    href: "/admin/dashboard",
    icon: BarChart3,
    description: "Métricas executivas",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Analytics BI",
    href: "/admin/analytics",
    icon: PieChart,
    description: "Business Intelligence",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Usuários",
    href: "/admin/usuarios",
    icon: Users,
    description: "Gestão de usuários",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Desenvolvimento",
    href: "/admin/desenvolvimento",
    icon: Code,
    description: "Dev tools",
    badge: "Dev",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Faturamento",
    href: "/admin/faturamento",
    icon: CreditCard,
    description: "Receitas",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Suporte B2B",
    href: "/admin/suporte",
    icon: Headphones,
    description: "Atendimento",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Marketing",
    href: "/admin/marketing",
    icon: TrendingUp,
    description: "Campanhas",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Produtos",
    href: "/admin/produtos",
    icon: Package,
    description: "Gestão SaaS",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Segurança",
    href: "/admin/seguranca",
    icon: Lock,
    description: "Compliance",
    permission: { module: "admin", action: "read" },
  },
];

// System tools for advanced administration
const systemTools = [
  {
    title: "System Health",
    href: "/system-health",
    icon: MonitorCheck,
    description: "Status do sistema",
    badge: "Live",
  },
  {
    title: "Updates",
    href: "/update",
    icon: Target,
    description: "Atualizações",
    badge: "v2025",
  },
  {
    title: "Deploy",
    href: "/launch",
    icon: Rocket,
    description: "Releases",
    badge: "Deploy",
  },
];

export function CorrectedSidebar({
  open,
  onClose,
  collapsed = false,
}: CorrectedSidebarProps) {
  const location = useLocation();

  // Safe hooks with fallbacks
  let user = null;
  let hasPermission = () => true;
  let isAdmin = () => false;
  let isAdminMode = false;

  try {
    const permissions = usePermissions();
    user = permissions.user;
    hasPermission = permissions.hasPermission;
    isAdmin = permissions.isAdmin;
  } catch (error) {
    console.warn("Permission context not available, using defaults");
  }

  try {
    const viewMode = useViewMode();
    isAdminMode = viewMode.isAdminMode || false;
  } catch (error) {
    console.warn("ViewMode context not available, using defaults");
  }

  // Determine current menu items
  const currentMenuItems = isAdminMode ? adminMenuItems : clientMenuItems;

  const isActivePath = (href: string) => {
    if (href === "/painel" || href === "/admin/dashboard") {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  // FIXED: Compact navigation item component
  const NavItem = ({ item, isActive }: { item: any; isActive: boolean }) => {
    const Icon = item.icon;

    if (!hasPermission(item.permission?.module, item.permission?.action)) {
      return null;
    }

    const content = (
      <Link
        to={item.href}
        onClick={onClose}
        className={cn(
          "modern-nav-item group relative",
          "flex items-center px-3 py-2 text-sm font-medium rounded-lg",
          "transition-all duration-200 ease-out",
          isActive
            ? "bg-primary/10 text-primary border border-primary/20"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/80",
          collapsed && "justify-center px-2",
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5 flex-shrink-0",
            collapsed ? "mx-auto" : "mr-3",
            isActive ? "text-primary" : "text-current",
          )}
        />
        {!collapsed && (
          <>
            <span className="truncate">{item.title}</span>
            {item.badge && (
              <Badge
                variant="secondary"
                className="ml-auto text-xs px-1.5 py-0.5"
              >
                {item.badge}
              </Badge>
            )}
          </>
        )}
        {isActive && !collapsed && (
          <motion.div
            layoutId="activeTab"
            className="absolute right-2 w-1 h-6 bg-primary rounded-full"
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            <span className="font-medium">{item.title}</span>
            {item.badge && (
              <Badge variant="secondary" className="text-xs">
                {item.badge}
              </Badge>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <div
      className={cn(
        "h-full bg-card border-r border-border",
        "flex flex-col",
        collapsed ? "w-16" : "w-full", // Responsive width
      )}
    >
      {/* FIXED: Compact Header */}
      <div className={cn("p-4", collapsed && "p-2")}>
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Scale className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-foreground">Lawdesk</h2>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
              <Scale className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
          {open && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* FIXED: Mode Indicator */}
        {!collapsed && (
          <div className="mt-3">
            <Badge
              variant={isAdminMode ? "destructive" : "default"}
              className="text-xs"
            >
              {isAdminMode ? (
                <>
                  <Shield className="h-3 w-3 mr-1" />
                  Admin Mode
                </>
              ) : (
                <>
                  <Crown className="h-3 w-3 mr-1" />
                  Client Mode
                </>
              )}
            </Badge>
          </div>
        )}
      </div>

      {/* FIXED: Navigation Menu with proper scrolling */}
      <ScrollArea className="flex-1 px-2">
        <nav className="space-y-1 pb-4">
          {/* Main Menu Items */}
          {currentMenuItems.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={isActivePath(item.href)}
            />
          ))}

          {/* Admin Tools Section */}
          {isAdminMode && !collapsed && (
            <>
              <Separator className="my-4" />
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Ferramentas
                </h3>
              </div>
              {systemTools.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  isActive={isActivePath(item.href)}
                />
              ))}
            </>
          )}

          {/* Settings */}
          <div className="pt-4">
            <NavItem
              item={{
                title: "Configurações",
                href: "/configuracoes",
                icon: Settings,
                description: "Configurações do sistema",
                permission: { module: "settings", action: "read" },
              }}
              isActive={isActivePath("/configuracoes")}
            />
          </div>
        </nav>
      </ScrollArea>

      {/* FIXED: User Info - Compact */}
      {!collapsed && user && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground">
                {user.name?.charAt(0) || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user.name || "Usuário"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email || "usuario@lawdesk.com"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
