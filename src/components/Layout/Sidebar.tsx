import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/usePermissions";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

// Define menu items with permission requirements
const baseMenuItems = [
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
  },
];

// Admin-only items
const adminMenuItems = [
  {
    title: "Dashboard Executivo",
    href: "/dashboard-executivo",
    icon: Crown,
    description: "Visão Executiva Completa",
    permission: { module: "dashboard", action: "manage" },
    adminOnly: true,
  },
  {
    title: "Painel Admin",
    href: "/admin",
    icon: Shield,
    description: "Administração Interna Lawdesk",
    badge: "Admin",
    permission: { module: "admin", action: "manage" },
    adminOnly: true,
  },
  {
    title: "Update",
    href: "/update",
    icon: Target,
    description: "Análise e Planejamento Automático",
    badge: "2025",
    permission: { module: "admin", action: "read" },
  },
  {
    title: "Launch",
    href: "/launch",
    icon: Rocket,
    description: "Sistema de Lançamentos",
    badge: "2025",
    permission: { module: "admin", action: "read" },
  },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const { hasPermission, isAdmin, user } = usePermissions();

  // Filter menu items based on permissions
  const menuItems = baseMenuItems.filter((item) =>
    hasPermission(item.permission.module, item.permission.action),
  );

  const adminItems = isAdmin() ? adminMenuItems : [];
  const sistema2025ItemsFiltered = isAdmin() ? sistema2025Items : [];

  return (
    <div
      className={cn(
        "sidebar-layout",
        "bg-sidebar text-sidebar-foreground border-r border-sidebar-border",
        "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0 lg:static lg:inset-0",
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Scale className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Lawdesk CRM</h1>
              <p className="text-xs text-sidebar-foreground/70">
                Sistema Jurídico Completo
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

        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user.name?.charAt(0) || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">
                  {user.email}
                </p>
              </div>
              {isAdmin() && (
                <Badge variant="secondary" className="text-xs">
                  Admin
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Quick Search */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/40" />
            <input
              type="text"
              placeholder="Buscar no sistema..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-sidebar-accent border border-sidebar-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-sidebar-foreground/40">
              <Command className="h-3 w-3" />
            </kbd>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3">
          {/* Main Navigation */}
          <nav className="space-y-1 py-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{item.title}</div>
                      {item.description && (
                        <div className="text-xs text-sidebar-foreground/50 truncate">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                  {item.badge && (
                    <Badge
                      variant={item.badge === "2025" ? "default" : "secondary"}
                      className={cn(
                        "text-xs",
                        item.badge === "2025" &&
                          "bg-gradient-to-r from-blue-500 to-purple-600 text-white",
                        item.badge === "AI" &&
                          "bg-gradient-to-r from-purple-500 to-pink-600 text-white",
                        item.badge === "Beta" &&
                          "bg-orange-100 text-orange-800",
                        item.badge === "Legacy" && "bg-gray-100 text-gray-800",
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sistema 2025 Section */}
          {sistema2025ItemsFiltered.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="pb-4">
                <h3 className="px-3 mb-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                  🚀 Sistema 2025
                </h3>
                <nav className="space-y-1">
                  {sistema2025ItemsFiltered.map((item) => {
                    const isActive = location.pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          "flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="truncate">{item.title}</div>
                            {item.description && (
                              <div className="text-xs text-sidebar-foreground/50 truncate">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </div>
                        {item.badge && (
                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </>
          )}

          {/* Admin Section */}
          {adminItems.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="pb-4">
                <h3 className="px-3 mb-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                  👑 Administração
                </h3>
                <nav className="space-y-1">
                  {adminItems.map((item) => {
                    const isActive = location.pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          "flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="truncate">{item.title}</div>
                            {item.description && (
                              <div className="text-xs text-sidebar-foreground/50 truncate">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}

                  {/* System Health */}
                  <Link
                    to="/system-health"
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      location.pathname === "/system-health"
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    )}
                  >
                    <Activity className="w-4 h-4" />
                    <span>System Health</span>
                  </Link>
                </nav>
              </div>
            </>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-center">
            <p className="text-xs text-sidebar-foreground/50">
              Lawdesk CRM v2025.1
            </p>
            <p className="text-xs text-sidebar-foreground/40">
              © 2025 - Sistema Jurídico Inteligente
            </p>
            {isAdmin() && (
              <div className="mt-2 flex items-center justify-center gap-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-blue-600 font-medium">
                  Update
                </span>
                <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                <span className="text-xs text-purple-600 font-medium">
                  Launch
                </span>
                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
