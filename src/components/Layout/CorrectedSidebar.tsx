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
    description: "Gestão de clientes e processos",
  },
  {
    title: "Agenda",
    href: "/agenda",
    icon: Calendar,
    permission: { module: "agenda", action: "read" },
    description: "Calendário e compromissos",
  },
  {
    title: "GED Jurídico",
    href: "/ged-juridico",
    icon: FolderOpen,
    description: "Documentos e arquivos",
    permission: { module: "ged", action: "read" },
  },
  {
    title: "IA Jurídico",
    href: "/ai-enhanced",
    icon: Brain,
    description: "Assistente inteligente",
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
    description: "Diários e intimações",
    permission: { module: "publicacoes", action: "read" },
  },
  {
    title: "Contratos",
    href: "/contratos",
    icon: FileSignature,
    description: "Gestão contratual",
    permission: { module: "contratos", action: "read" },
  },
  {
    title: "Financeiro",
    href: "/financeiro",
    icon: DollarSign,
    description: "Faturas e cobranças",
    permission: { module: "financeiro", action: "read" },
  },
  {
    title: "Atendimento",
    href: "/atendimento",
    icon: Headphones,
    description: "Suporte e tickets",
    permission: { module: "atendimento", action: "read" },
  },
];

// Admin mode menu items - Organized for enterprise administration
const adminMenuItems = [
  {
    title: "Dashboard Executivo",
    href: "/admin/executive",
    icon: Crown,
    description: "Visão estratégica",
    badge: "Executive",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Business Intelligence",
    href: "/admin/bi",
    icon: PieChart,
    description: "Analytics e BI",
    badge: "Analytics",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Gestão de Equipe",
    href: "/admin/equipe",
    icon: Users,
    description: "Usuários e permissões",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Desenvolvimento",
    href: "/admin/desenvolvimento",
    icon: Code,
    description: "Ferramentas de dev",
    badge: "Dev",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Faturamento",
    href: "/admin/faturamento",
    icon: CreditCard,
    description: "Receitas e pagamentos",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Suporte B2B",
    href: "/admin/suporte",
    icon: Headphones,
    description: "Atendimento corporativo",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Marketing",
    href: "/admin/marketing",
    icon: TrendingUp,
    description: "Campanhas e leads",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Produtos",
    href: "/admin/produtos",
    icon: Package,
    description: "Gestão de produtos SaaS",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Segurança",
    href: "/admin/seguranca",
    icon: Lock,
    description: "Auditoria e compliance",
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
    title: "Update Manager",
    href: "/update",
    icon: Target,
    description: "Atualizações",
    badge: "v2025",
  },
  {
    title: "Launch Control",
    href: "/launch",
    icon: Rocket,
    description: "Deploy e releases",
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

  // Get menu items based on current mode
  const menuItems = isAdminMode ? adminMenuItems : clientMenuItems;

  // Filter menu items based on permissions
  const filteredMenuItems = menuItems.filter((item) => {
    try {
      return (
        isAdmin() ||
        hasPermission(item.permission.module, item.permission.action)
      );
    } catch (error) {
      return true;
    }
  });

  const brandingInfo = {
    title: isAdminMode ? "Lawdesk Admin" : "Lawdesk",
    subtitle: isAdminMode ? "Administrativo" : "Sistema Jurídico",
    icon: isAdminMode ? Shield : Scale,
    iconColor: isAdminMode ? "text-red-500" : "text-blue-600",
    bgColor: isAdminMode ? "bg-red-500" : "bg-blue-600",
  };

  const BrandIcon = brandingInfo.icon;

  return (
    <div
      className={cn(
        "h-full flex flex-col bg-card border-r border-border",
        "transition-all duration-300 ease-out",
        collapsed ? "w-16" : "w-72",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center px-4 py-4 border-b border-border",
          collapsed && "px-2 justify-center",
        )}
      >
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 flex-1"
          >
            <div
              className={cn(
                "p-2 rounded-lg",
                isAdminMode
                  ? "bg-red-100 dark:bg-red-900/20"
                  : "bg-blue-100 dark:bg-blue-900/20",
              )}
            >
              <BrandIcon
                className={cn(
                  "h-6 w-6",
                  isAdminMode
                    ? "text-red-600 dark:text-red-400"
                    : "text-blue-600 dark:text-blue-400",
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-foreground truncate">
                {brandingInfo.title}
              </h2>
              <p className="text-xs text-muted-foreground truncate">
                {brandingInfo.subtitle}
              </p>
            </div>
          </motion.div>
        )}

        {collapsed && (
          <div
            className={cn(
              "p-2 rounded-lg",
              isAdminMode
                ? "bg-red-100 dark:bg-red-900/20"
                : "bg-blue-100 dark:bg-blue-900/20",
            )}
          >
            <BrandIcon
              className={cn(
                "h-6 w-6",
                isAdminMode
                  ? "text-red-600 dark:text-red-400"
                  : "text-blue-600 dark:text-blue-400",
              )}
            />
          </div>
        )}

        {/* Close button for mobile */}
        {open && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="md:hidden ml-auto p-1 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {/* Main Navigation */}
          <div className="space-y-1">
            {!collapsed && (
              <p className="text-xs font-medium text-muted-foreground px-3 py-2 uppercase tracking-wider">
                {isAdminMode ? "Administração" : "Navegação"}
              </p>
            )}
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.href ||
                (item.href !== "/" && location.pathname.startsWith(item.href));

              if (collapsed) {
                return (
                  <Tooltip key={item.href} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center justify-center h-12 w-12 rounded-lg",
                          "transition-all duration-200 relative group",
                          isActive
                            ? isAdminMode
                              ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.badge && (
                          <div className="absolute -top-1 -right-1">
                            <div
                              className={cn(
                                "h-2 w-2 rounded-full",
                                isAdminMode ? "bg-red-500" : "bg-blue-500",
                              )}
                            />
                          </div>
                        )}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="flex items-center gap-2"
                    >
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                    "transition-all duration-200 relative group",
                    isActive
                      ? isAdminMode
                        ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300 shadow-sm"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/80",
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {item.title}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {item.description}
                    </div>
                  </div>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs px-2 py-0.5 ml-auto",
                        isActive &&
                          isAdminMode &&
                          "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200",
                        isActive &&
                          !isAdminMode &&
                          "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200",
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                  {isActive && <ChevronRight className="h-4 w-4 opacity-60" />}
                </Link>
              );
            })}
          </div>

          {/* System Tools for Admin */}
          {isAdminMode && isAdmin() && (
            <>
              <Separator className="my-4" />
              <div className="space-y-1">
                {!collapsed && (
                  <p className="text-xs font-medium text-muted-foreground px-3 py-2 uppercase tracking-wider">
                    Sistema
                  </p>
                )}
                {systemTools.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = location.pathname === tool.href;

                  if (collapsed) {
                    return (
                      <Tooltip key={tool.href} delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Link
                            to={tool.href}
                            className={cn(
                              "flex items-center justify-center h-12 w-12 rounded-lg",
                              "transition-all duration-200 relative",
                              isActive
                                ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted",
                            )}
                          >
                            <Icon className="h-5 w-5" />
                            {tool.badge && (
                              <div className="absolute -top-1 -right-1">
                                <div className="h-2 w-2 rounded-full bg-red-500" />
                              </div>
                            )}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          className="flex items-center gap-2"
                        >
                          <span>{tool.title}</span>
                          {tool.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {tool.badge}
                            </Badge>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return (
                    <Link
                      key={tool.href}
                      to={tool.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                        "transition-all duration-200",
                        isActive
                          ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300 shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/80",
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {tool.title}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {tool.description}
                        </div>
                      </div>
                      {tool.badge && (
                        <Badge
                          variant={isActive ? "default" : "secondary"}
                          className="text-xs px-2 py-0.5 ml-auto"
                        >
                          {tool.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* Settings */}
          <Separator className="my-4" />
          <div className="space-y-1">
            {collapsed ? (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to="/settings"
                    className={cn(
                      "flex items-center justify-center h-12 w-12 rounded-lg",
                      "transition-all duration-200",
                      location.pathname === "/settings"
                        ? isAdminMode
                          ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                  >
                    <Settings className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Configurações</TooltipContent>
              </Tooltip>
            ) : (
              <Link
                to="/settings"
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                  "transition-all duration-200",
                  location.pathname === "/settings"
                    ? isAdminMode
                      ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300 shadow-sm"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80",
                )}
              >
                <Settings className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    Configurações
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    Preferências do sistema
                  </div>
                </div>
              </Link>
            )}
          </div>
        </nav>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-2 rounded-lg",
                isAdminMode
                  ? "bg-red-100 dark:bg-red-900/20"
                  : "bg-blue-100 dark:bg-blue-900/20",
              )}
            >
              <Activity
                className={cn(
                  "h-4 w-4",
                  isAdminMode
                    ? "text-red-600 dark:text-red-400"
                    : "text-blue-600 dark:text-blue-400",
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                Sistema Online
              </p>
              <p className="text-xs text-muted-foreground">Versão 2025.1.0</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
