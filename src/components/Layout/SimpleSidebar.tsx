import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
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
  Target,
  Rocket,
  Activity,
  CreditCard,
  Package,
  Lock,
  Code,
  TrendingUp,
  MonitorCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/usePermissions";
import { useViewMode } from "@/contexts/ViewModeContext";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SimpleSidebarProps {
  open: boolean;
  onClose: () => void;
}

// Client mode menu items
const clientMenuItems = [
  {
    title: "Painel Jurídico",
    href: "/dashboard",
    icon: BarChart3,
    permission: { module: "dashboard", action: "read" },
  },
  {
    title: "CRM Jurídico",
    href: "/crm",
    icon: Users,
    permission: { module: "crm", action: "read" },
  },
  {
    title: "GED Jurídico",
    href: "/ged-juridico",
    icon: FolderOpen,
    permission: { module: "ged", action: "read" },
  },
  {
    title: "Atendimento",
    href: "/atendimento",
    icon: Headphones,
    permission: { module: "atendimento", action: "read" },
  },
  {
    title: "Agenda Jurídica",
    href: "/agenda",
    icon: Calendar,
    permission: { module: "agenda", action: "read" },
  },
  {
    title: "Tarefas",
    href: "/tarefas",
    icon: CheckSquare,
    permission: { module: "tarefas", action: "read" },
  },
  {
    title: "Publicações",
    href: "/publicacoes",
    icon: FileText,
    permission: { module: "publicacoes", action: "read" },
  },
  {
    title: "Contratos",
    href: "/contratos",
    icon: FileSignature,
    permission: { module: "contratos", action: "read" },
  },
  {
    title: "Financeiro",
    href: "/financeiro",
    icon: DollarSign,
    permission: { module: "financeiro", action: "read" },
  },
  {
    title: "IA Jurídica",
    href: "/ai-enhanced",
    icon: Brain,
    permission: { module: "ai", action: "read" },
    badge: "Beta",
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: Settings,
    permission: { module: "configuracoes", action: "read" },
  },
];

// Admin mode menu items
const adminMenuItems = [
  {
    title: "Dashboard Executivo",
    href: "/admin/executive",
    icon: Crown,
    badge: "Executive",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Business Intelligence",
    href: "/admin/bi",
    icon: BarChart3,
    badge: "BI",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Gestão de Equipe",
    href: "/admin/equipe",
    icon: Users,
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Blueprint Builder",
    href: "/admin/desenvolvimento",
    icon: Code,
    badge: "Dev",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Faturamento",
    href: "/admin/faturamento",
    icon: CreditCard,
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Suporte B2B",
    href: "/admin/suporte",
    icon: Headphones,
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Marketing",
    href: "/admin/marketing",
    icon: TrendingUp,
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Gestão de Produtos",
    href: "/admin/produtos",
    icon: Package,
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Segurança",
    href: "/admin/seguranca",
    icon: Lock,
    permission: { module: "admin", action: "read" },
  },
  {
    title: "System Health",
    href: "/system-health",
    icon: MonitorCheck,
    badge: "Live",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Update Manager",
    href: "/update",
    icon: Target,
    badge: "2025",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Launch Control",
    href: "/launch",
    icon: Rocket,
    badge: "2025",
    permission: { module: "admin", action: "read" },
  },
];

export function SimpleSidebar({ open, onClose }: SimpleSidebarProps) {
  const location = useLocation();
  const { user, hasPermission, isAdmin } = usePermissions();
  const { currentMode, isAdminMode } = useViewMode();

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
    subtitle: isAdminMode ? "Painel Administrativo" : "Sistema Jurídico",
    icon: isAdminMode ? Shield : Scale,
    iconColor: isAdminMode ? "text-red-600" : "text-blue-600",
    bgColor: isAdminMode ? "bg-red-50" : "bg-blue-50",
  };

  return (
    <div
      className={cn(
        "h-full w-72 flex flex-col border-r",
        isAdminMode
          ? "bg-slate-900 text-slate-100 border-slate-700"
          : "bg-background border-border",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between p-4 border-b",
          isAdminMode ? "border-slate-700" : "border-border",
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
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

      {/* Mode Indicator */}
      <div
        className={cn(
          "px-4 py-2 text-center border-b",
          isAdminMode
            ? "border-slate-700 bg-slate-800/50"
            : "border-border bg-muted/30",
        )}
      >
        <Badge variant={isAdminMode ? "destructive" : "default"}>
          {isAdminMode ? "🛡️ MODO ADMIN" : "⚖️ MODO CLIENTE"}
        </Badge>
      </div>

      {/* User Info */}
      {user && (
        <div
          className={cn(
            "p-4 border-b",
            isAdminMode ? "border-slate-700" : "border-border",
          )}
        >
          <div className="flex items-center gap-3">
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
                  isAdminMode ? "text-slate-400" : "text-muted-foreground",
                )}
              >
                {user.email}
              </p>
            </div>
            <Badge variant="secondary" className="text-xs">
              {user.role}
            </Badge>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-1">
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? isAdminMode
                      ? "bg-slate-800 text-slate-100"
                      : "bg-primary text-primary-foreground"
                    : isAdminMode
                      ? "text-slate-300 hover:bg-slate-800/50 hover:text-slate-100"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div
        className={cn(
          "p-4 border-t text-center",
          isAdminMode ? "border-slate-700" : "border-border",
        )}
      >
        <p
          className={cn(
            "text-xs",
            isAdminMode ? "text-slate-400" : "text-muted-foreground",
          )}
        >
          {brandingInfo.title} v2025.1
        </p>
        <p
          className={cn(
            "text-xs",
            isAdminMode ? "text-slate-500" : "text-muted-foreground",
          )}
        >
          © 2025 Lawdesk
        </p>
        {isAdminMode && (
          <div className="mt-2 flex items-center justify-center gap-1">
            <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-red-400 font-medium">ADMIN MODE</span>
            <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
}
