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

// Client mode menu items - CORRIGIDO conforme solicitado
const clientMenuItems = [
  {
    title: "Painel",
    href: "/painel",
    icon: BarChart3,
    permission: { module: "dashboard", action: "read" },
    description: "Visão geral e métricas",
  },
  {
    title: "CRM",
    href: "/crm",
    icon: Users,
    permission: { module: "crm", action: "read" },
    description: "Gestão de clientes",
  },
  {
    title: "GED",
    href: "/ged-juridico",
    icon: FolderOpen,
    description: "Documentos jurídicos",
    permission: { module: "ged", action: "read" },
  },
  {
    title: "IA Jurídico", // DISPONÍVEL conforme solicitado
    href: "/ai-enhanced",
    icon: Brain,
    description: "Assistente inteligente",
    permission: { module: "ai", action: "read" },
    badge: "Beta",
  },
  {
    title: "Agenda", // DISPONÍVEL conforme solicitado
    href: "/agenda",
    icon: Calendar,
    permission: { module: "agenda", action: "read" },
    description: "Calendário jurídico",
  },
  {
    title: "Atendimento",
    href: "/atendimento",
    icon: Headphones,
    description: "Suporte e tickets",
    permission: { module: "atendimento", action: "read" },
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
    title: "Configurações",
    href: "/settings",
    icon: Settings,
    permission: { module: "configuracoes", action: "read" },
    description: "Preferências",
  },
];

// Admin mode menu items - CORRIGIDO e organizado
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
    badge: "BI",
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
    description: "Blueprint builder",
    badge: "Dev",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Faturamento",
    href: "/admin/faturamento",
    icon: CreditCard,
    description: "Receitas e Stripe",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Suporte B2B",
    href: "/admin/suporte",
    icon: Headphones,
    description: "Atendimento empresa",
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
    description: "Planos SaaS",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Segurança",
    href: "/admin/seguranca",
    icon: Lock,
    description: "Auditoria e LGPD",
    permission: { module: "admin", action: "read" },
  },
];

// System tools CORRIGIDOS com rotas válidas
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
    badge: "2025",
  },
  {
    title: "Launch Control",
    href: "/launch",
    icon: Rocket,
    description: "Lançamentos",
    badge: "2025",
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
  let currentMode = "client";

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
    currentMode = viewMode.currentMode || "client";
  } catch (error) {
    console.warn("ViewMode context not available, using defaults");
  }

  // Get menu items based on current mode
  const menuItems = isAdminMode ? adminMenuItems : clientMenuItems;

  // Filter menu items based on permissions with safe fallback
  const filteredMenuItems = menuItems.filter((item) => {
    try {
      return (
        isAdmin() ||
        hasPermission(item.permission.module, item.permission.action)
      );
    } catch (error) {
      return true; // Fallback to showing all items if permission check fails
    }
  });

  const brandingInfo = {
    title: isAdminMode ? "Lawdesk Admin" : "Lawdesk CRM",
    subtitle: isAdminMode ? "Administrativo" : "Sistema Jurídico",
    icon: isAdminMode ? Shield : Scale,
    iconColor: isAdminMode ? "text-red-500" : "text-blue-600",
    bgColor: isAdminMode ? "bg-red-500" : "bg-blue-600",
  };

  return (
    <div
      className={cn(
        "h-full flex flex-col transition-all duration-300",
        isAdminMode
          ? "bg-slate-900 text-slate-100 border-slate-700"
          : "bg-background text-foreground border-border",
        "border-r",
        collapsed ? "w-16" : "w-72",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center p-4 border-b",
          isAdminMode ? "border-slate-700" : "border-border",
          collapsed && "px-2 justify-center",
        )}
      >
        {!collapsed ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg",
                  brandingInfo.bgColor,
                )}
              >
                <brandingInfo.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold">{brandingInfo.title}</h1>
                <p
                  className={cn(
                    "text-xs",
                    isAdminMode ? "text-slate-400" : "text-muted-foreground",
                  )}
                >
                  {brandingInfo.subtitle}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          // Apenas ícone quando collapsed
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer",
                  brandingInfo.bgColor,
                )}
              >
                <brandingInfo.icon className="w-5 h-5 text-white" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">{brandingInfo.title}</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* User Info */}
      {user && !collapsed && (
        <div
          className={cn(
            "p-3 border-b",
            isAdminMode ? "border-slate-700" : "border-border",
          )}
        >
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                isAdminMode
                  ? "bg-slate-700 text-slate-200"
                  : "bg-primary/10 text-primary",
              )}
            >
              {user.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p
                className={cn(
                  "text-xs truncate",
                  isAdminMode ? "text-slate-400" : "text-muted-foreground",
                )}
              >
                {user.role}
              </p>
            </div>
            {isAdminMode && (
              <Badge
                variant="destructive"
                className="text-xs bg-red-600 text-white"
              >
                ADMIN
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2">
        <nav className="space-y-1 py-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMode}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-1"
            >
              {filteredMenuItems.map((item) => {
                const isActive = location.pathname === item.href;
                const IconComponent = item.icon;

                if (collapsed) {
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>
                        <Link
                          to={item.href}
                          className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-md transition-colors mx-auto",
                            isActive
                              ? isAdminMode
                                ? "bg-slate-800 text-slate-100"
                                : "bg-primary text-primary-foreground"
                              : isAdminMode
                                ? "text-slate-300 hover:bg-slate-800/50 hover:text-slate-100"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          <IconComponent className="w-4 h-4" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <div className="font-medium">{item.title}</div>
                        {item.description && (
                          <div className="text-xs text-muted-foreground">
                            {item.description}
                          </div>
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
                      "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                      isActive
                        ? isAdminMode
                          ? "bg-slate-800 text-slate-100"
                          : "bg-primary text-primary-foreground"
                        : isAdminMode
                          ? "text-slate-300 hover:bg-slate-800/50 hover:text-slate-100"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-4 h-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{item.title}</div>
                        {item.description && (
                          <div
                            className={cn(
                              "text-xs truncate",
                              isAdminMode
                                ? "text-slate-400"
                                : "text-muted-foreground",
                            )}
                          >
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs",
                          item.badge === "2025" &&
                            "bg-gradient-to-r from-blue-500 to-purple-600 text-white",
                          item.badge === "Executive" &&
                            "bg-gradient-to-r from-purple-500 to-indigo-600 text-white",
                          item.badge === "BI" &&
                            "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
                          item.badge === "Dev" &&
                            "bg-gradient-to-r from-orange-500 to-red-600 text-white",
                          item.badge === "Live" &&
                            "bg-gradient-to-r from-green-500 to-emerald-600 text-white animate-pulse",
                          item.badge === "Beta" &&
                            "bg-orange-100 text-orange-800",
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </nav>

        {/* System Tools for Admin Mode */}
        {isAdminMode && !collapsed && (
          <>
            <Separator className="my-3 bg-slate-700" />
            <div className="pb-3">
              <h3 className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                🔧 Sistema
              </h3>
              <nav className="space-y-1">
                {systemTools.map((tool) => {
                  const isActive = location.pathname === tool.href;
                  const IconComponent = tool.icon;

                  return (
                    <Link
                      key={tool.href}
                      to={tool.href}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-slate-800 text-slate-100"
                          : "text-slate-300 hover:bg-slate-800/50 hover:text-slate-100",
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-4 h-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="truncate">{tool.title}</div>
                          <div className="text-xs text-slate-400 truncate">
                            {tool.description}
                          </div>
                        </div>
                      </div>
                      {tool.badge && (
                        <Badge
                          className={cn(
                            "text-xs",
                            tool.badge === "2025" &&
                              "bg-gradient-to-r from-blue-500 to-purple-600 text-white",
                            tool.badge === "Live" &&
                              "bg-gradient-to-r from-green-500 to-emerald-600 text-white animate-pulse",
                          )}
                        >
                          {tool.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </>
        )}
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div
          className={cn(
            "p-3 border-t",
            isAdminMode ? "border-slate-700" : "border-border",
          )}
        >
          <div className="text-center">
            <p
              className={cn(
                "text-xs",
                isAdminMode ? "text-slate-400" : "text-muted-foreground",
              )}
            >
              {brandingInfo.title} v2025.1
            </p>
            {isAdminMode && (
              <div className="mt-1 flex items-center justify-center gap-1">
                <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-red-400 font-medium">
                  ADMIN ATIVO
                </span>
                <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
