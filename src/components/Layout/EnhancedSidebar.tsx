import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  MessageSquare,
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
  Command,
  Rocket,
  Activity,
  Target,
  CreditCard,
  Package,
  Lock,
  Globe,
  Code,
  BarChart,
  PieChart,
  Database,
  MonitorCheck,
  AlertTriangle,
  Zap,
  Building,
  Award,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/usePermissions";
import { useViewMode } from "@/contexts/ViewModeContext";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface EnhancedSidebarProps {
  open: boolean;
  onClose: () => void;
}

// Client mode menu items (original Lawdesk CRM)
const clientMenuItems = [
  {
    title: "Painel Jurídico",
    href: "/dashboard",
    icon: BarChart3,
    permission: { module: "dashboard", action: "read" },
    description: "Visão geral dos casos e métricas",
  },
  {
    title: "CRM Jurídico",
    href: "/crm",
    icon: Users,
    permission: { module: "crm", action: "read" },
    description: "Gestão de clientes e relacionamento",
  },
  {
    title: "GED Jurídico",
    href: "/ged-juridico",
    icon: FolderOpen,
    description: "Gestão Eletrônica de Documentos",
    permission: { module: "ged", action: "read" },
  },
  {
    title: "Atendimento",
    href: "/atendimento",
    icon: Headphones,
    description: "Suporte e Tickets",
    permission: { module: "atendimento", action: "read" },
  },
  {
    title: "Agenda Jurídica",
    href: "/agenda",
    icon: Calendar,
    permission: { module: "agenda", action: "read" },
    description: "Calendário e compromissos",
  },
  {
    title: "Tarefas",
    href: "/tarefas",
    icon: CheckSquare,
    description: "Gestão de Tarefas Integrada",
    permission: { module: "tarefas", action: "read" },
  },
  {
    title: "Publicações",
    href: "/publicacoes",
    icon: FileText,
    description: "Diários Oficiais e Intimações",
    permission: { module: "publicacoes", action: "read" },
  },
  {
    title: "Contratos",
    href: "/contratos",
    icon: FileSignature,
    description: "Gestão Contratual e Assinaturas",
    permission: { module: "contratos", action: "read" },
  },
  {
    title: "Financeiro",
    href: "/financeiro",
    icon: DollarSign,
    description: "Faturas, Cobranças e Fluxo de Caixa",
    permission: { module: "financeiro", action: "read" },
  },
  {
    title: "IA Jurídica",
    href: "/ai-enhanced",
    icon: Brain,
    description: "Assistente Inteligente",
    permission: { module: "ai", action: "read" },
    badge: "Beta",
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: Settings,
    permission: { module: "configuracoes", action: "read" },
    description: "Preferências do sistema",
  },
];

// Admin mode menu items (Lawdesk Admin Panel)
const adminMenuItems = [
  {
    title: "Dashboard Executivo",
    href: "/admin/executive",
    icon: Crown,
    description: "Visão estratégica completa",
    badge: "Executive",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Business Intelligence",
    href: "/admin/bi",
    icon: BarChart3,
    description: "Analytics e métricas de negócio",
    badge: "BI",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Gestão de Equipe",
    href: "/admin/equipe",
    icon: Users,
    description: "Controle de acessos e permissões",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Blueprint Builder",
    href: "/admin/desenvolvimento",
    icon: Code,
    description: "Desenvolvimento e deploys",
    badge: "Dev",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Faturamento",
    href: "/admin/faturamento",
    icon: CreditCard,
    description: "Stripe, receitas e cobrança",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Suporte B2B",
    href: "/admin/suporte",
    icon: Headphones,
    description: "Tickets e atendimento",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Marketing",
    href: "/admin/marketing",
    icon: TrendingUp,
    description: "Campanhas e comunicação",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Gestão de Produtos",
    href: "/admin/produtos",
    icon: Package,
    description: "Planos SaaS e monetização",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Segurança",
    href: "/admin/seguranca",
    icon: Lock,
    description: "Auditoria e conformidade LGPD",
    permission: { module: "admin", action: "read" },
  },
];

// System tools for admin mode
const systemTools = [
  {
    title: "System Health",
    href: "/system-health",
    icon: MonitorCheck,
    description: "Monitoramento do sistema",
    badge: "Live",
  },
  {
    title: "Update Manager",
    href: "/update",
    icon: Target,
    description: "Análise e planejamento",
    badge: "2025",
  },
  {
    title: "Launch Control",
    href: "/launch",
    icon: Rocket,
    description: "Sistema de lançamentos",
    badge: "2025",
  },
];

export function EnhancedSidebar({ open, onClose }: EnhancedSidebarProps) {
  const location = useLocation();
  const { user, hasPermission, isAdmin } = usePermissions();
  const { currentMode, isAdminMode, isClientMode } = useViewMode();

  // Get menu items based on current mode
  const menuItems = isAdminMode ? adminMenuItems : clientMenuItems;

  // Filter menu items based on permissions
  const filteredMenuItems = menuItems.filter(
    (item) =>
      isAdmin() ||
      hasPermission(item.permission.module, item.permission.action),
  );

  const brandingInfo = {
    title: isAdminMode ? "Lawdesk Admin" : "Lawdesk CRM",
    subtitle: isAdminMode
      ? "Painel Administrativo"
      : "Sistema Jurídico Completo",
    icon: isAdminMode ? Shield : Scale,
    iconColor: isAdminMode ? "text-red-600" : "text-blue-600",
    bgColor: isAdminMode ? "bg-red-100" : "bg-blue-100",
  };

  return (
    <div
      className={cn(
        "sidebar-layout",
        isAdminMode
          ? "bg-slate-900 text-slate-100 border-slate-700"
          : "bg-sidebar text-sidebar-foreground border-sidebar-border",
        "w-72 h-full border-r transition-all duration-300 ease-in-out",
        "flex flex-col",
        // Responsive adjustments
        "max-w-[85vw] sm:max-w-72"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div
          className={cn(
            "flex items-center justify-between p-6 border-b",
            isAdminMode ? "border-slate-700" : "border-sidebar-border",
          )}
        >
          <div className="flex items-center space-x-3">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg",
                brandingInfo.bgColor,
              )}
            >
              <brandingInfo.icon
                className={cn("w-6 h-6", brandingInfo.iconColor)}
              />
            </div>
            <div>
              <h1 className="text-lg font-bold">{brandingInfo.title}</h1>
              <p
                className={cn(
                  "text-xs",
                  isAdminMode ? "text-slate-400" : "text-sidebar-foreground/70",
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

        {/* Mode Indicator */}
        <div
          className={cn(
            "px-4 py-2 border-b",
            isAdminMode
              ? "border-slate-700 bg-slate-800/50"
              : "border-sidebar-border bg-sidebar-accent/30",
          )}
        >
          <div className="flex items-center justify-center">
            <Badge
              variant={isAdminMode ? "destructive" : "default"}
              className={cn(
                "text-xs font-medium",
                isAdminMode
                  ? "bg-red-600 text-white border-red-500"
                  : "bg-blue-600 text-white border-blue-500",
              )}
            >
              {isAdminMode ? "🛡️ MODO ADMIN" : "⚖️ MODO CLIENTE"}
            </Badge>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div
            className={cn(
              "p-4 border-b",
              isAdminMode ? "border-slate-700" : "border-sidebar-border",
            )}
          >
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  isAdminMode ? "bg-slate-700" : "bg-primary/10",
                )}
              >
                <span
                  className={cn(
                    "text-sm font-medium",
                    isAdminMode ? "text-slate-200" : "text-primary",
                  )}
                >
                  {user.name?.charAt(0) || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p
                  className={cn(
                    "text-xs truncate",
                    isAdminMode
                      ? "text-slate-400"
                      : "text-sidebar-foreground/70",
                  )}
                >
                  {user.email}
                </p>
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs",
                  isAdminMode ? "bg-slate-700 text-slate-200" : "",
                )}
              >
                {user.role}
              </Badge>
            </div>
          </div>
        )}

        {/* Quick Search */}
        <div
          className={cn(
            "p-4 border-b",
            isAdminMode ? "border-slate-700" : "border-sidebar-border",
          )}
        >
          <div className="relative">
            <Search
              className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4",
                isAdminMode ? "text-slate-400" : "text-sidebar-foreground/40",
              )}
            />
            <input
              type="text"
              placeholder={isAdminMode ? "Buscar no admin..." : "Buscar no sistema..."}
              className={cn(
                "w-full pl-10 pr-4 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50",
                "touch-manipulation", // Better touch handling on mobile
                isAdminMode
                  ? "bg-slate-800 border-slate-600 text-slate-200 placeholder-slate-400"
                  : "bg-sidebar-accent border-sidebar-border"
              )}
              style={{ fontSize: '16px' }} // Prevent zoom on iOS
            />
            />
            <kbd
              className={cn(
                "absolute right-3 top-1/2 transform -translate-y-1/2 text-xs",
                isAdminMode ? "text-slate-400" : "text-sidebar-foreground/40",
              )}
            >
              <Command className="h-3 w-3" />
            </kbd>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3">
          <nav className="space-y-1 py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMode}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-1"
              >
                {filteredMenuItems.map((item) => {
                  const isActive = location.pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-colors group",
                        isActive
                          ? isAdminMode
                            ? "bg-slate-800 text-slate-100 border border-slate-600"
                            : "bg-sidebar-accent text-sidebar-accent-foreground"
                          : isAdminMode
                            ? "text-slate-300 hover:bg-slate-800/50 hover:text-slate-100"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="truncate">{item.title}</div>
                          {item.description && (
                            <div
                              className={cn(
                                "text-xs truncate",
                                isAdminMode
                                  ? "text-slate-400"
                                  : "text-sidebar-foreground/50",
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
          {isAdminMode && (
            <>
              <Separator className="my-4 bg-slate-700" />
              <div className="pb-4">
                <h3 className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  🔧 Ferramentas do Sistema
                </h3>
                <nav className="space-y-1">
                  {systemTools.map((tool) => {
                    const isActive = location.pathname === tool.href;

                    return (
                      <Link
                        key={tool.href}
                        to={tool.href}
                        className={cn(
                          "flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                          isActive
                            ? "bg-slate-800 text-slate-100 border border-slate-600"
                            : "text-slate-300 hover:bg-slate-800/50 hover:text-slate-100",
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <tool.icon className="w-4 h-4 flex-shrink-0" />
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
        <div
          className={cn(
            "p-4 border-t",
            isAdminMode ? "border-slate-700" : "border-sidebar-border",
          )}
        >
          <div className="text-center">
            <p
              className={cn(
                "text-xs",
                isAdminMode ? "text-slate-400" : "text-sidebar-foreground/50",
              )}
            >
              {brandingInfo.title} v2025.1
            </p>
            <p
              className={cn(
                "text-xs",
                isAdminMode ? "text-slate-500" : "text-sidebar-foreground/40",
              )}
            >
              © 2025 -{" "}
              {isAdminMode
                ? "Painel Administrativo"
                : "Sistema Jurídico Inteligente"}
            </p>
            {isAdminMode && (
              <div className="mt-2 flex items-center justify-center gap-1">
                <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-red-400 font-medium">
                  ADMIN MODE ATIVO
                </span>
                <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}