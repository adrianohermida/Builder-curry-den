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
  LogOut,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/usePermissions";
import { Badge } from "@/components/ui/badge";

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
    title: "Plano de Ação IA",
    href: "/plano-acao-ia",
    icon: Brain,
    description: "Análise e Planejamento Automático",
    permission: { module: "dashboard", action: "manage" },
    adminOnly: true,
    badge: "AI",
  },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const { hasPermission, isAdmin, user } = usePermissions();

  // Filter menu items based on permissions
  const menuItems = [
    ...baseMenuItems.filter((item) =>
      hasPermission(item.permission.module, item.permission.action),
    ),
    ...(isAdmin() ? adminMenuItems : []),
  ];

  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[rgb(var(--theme-primary))] flex items-center justify-center">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">Lawdesk</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[rgb(var(--theme-primary))] flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                      {user.role === "admin"
                        ? "Administrador"
                        : user.role === "advogado"
                          ? "Advogado"
                          : user.role === "estagiario"
                            ? "Estagiário"
                            : user.role === "secretaria"
                              ? "Secretária"
                              : "Cliente"}
                    </p>
                    {user.role === "admin" && (
                      <Badge variant="secondary" className="text-xs">
                        <Crown className="h-2 w-2 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {/* Core Modules */}
            <div className="space-y-1">
              {menuItems
                .filter((item) => !item.adminOnly)
                .map((item) => {
                  const isActive =
                    location.pathname === item.href ||
                    (item.href === "/ged-juridico" &&
                      location.pathname.startsWith("/ged")) ||
                    (item.href === "/atendimento" &&
                      (location.pathname === "/tickets" ||
                        location.pathname === "/atendimento"));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => onClose()}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
                        isActive
                          ? "bg-[rgb(var(--theme-primary))] text-white"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent",
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="truncate">{item.title}</span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-xs ml-2",
                                isActive ? "bg-white/20 text-white" : "",
                              )}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <div
                            className={cn(
                              "text-xs mt-0.5 truncate",
                              isActive
                                ? "text-white/75"
                                : "text-muted-foreground",
                            )}
                          >
                            {item.description}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
            </div>

            {/* Admin Section */}
            {isAdmin() && adminMenuItems.length > 0 && (
              <>
                <div className="pt-4">
                  <div className="text-xs font-medium text-muted-foreground mb-2 px-3 flex items-center gap-2">
                    <Shield className="h-3 w-3" />
                    ADMINISTRAÇÃO
                  </div>
                  <div className="space-y-1">
                    {adminMenuItems.map((item) => {
                      const isActive = location.pathname === item.href;
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => onClose()}
                          className={cn(
                            "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            isActive
                              ? "bg-[rgb(var(--theme-primary))] text-white"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent",
                          )}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="truncate">{item.title}</span>
                            {item.description && (
                              <div
                                className={cn(
                                  "text-xs mt-0.5 truncate",
                                  isActive
                                    ? "text-white/75"
                                    : "text-muted-foreground",
                                )}
                              >
                                {item.description}
                              </div>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Acesso rápido */}
            <div className="pt-4 border-t">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-3">
                ACESSO RÁPIDO
              </div>
              <Link
                to="/publicacoes-example"
                onClick={() => onClose()}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === "/publicacoes-example"
                    ? "bg-[rgb(var(--theme-primary))] text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
              >
                <FileText className="h-5 w-5" />
                <span>Publicações Jurídicas</span>
              </Link>

              <Link
                to="/configuracoes/armazenamento"
                onClick={() => onClose()}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === "/configuracoes/armazenamento"
                    ? "bg-[rgb(var(--theme-primary))] text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
              >
                <Settings className="h-5 w-5" />
                <span>Config. Armazenamento</span>
              </Link>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t space-y-3">
            {/* Quick Search */}
            <Button
              variant="outline"
              className="w-full justify-start text-muted-foreground h-8"
              onClick={() => {
                document.dispatchEvent(new CustomEvent("open-global-search"));
                onClose();
              }}
            >
              <Search className="h-3 w-3 mr-2" />
              <span className="text-xs">Busca Global</span>
              <kbd className="ml-auto pointer-events-none h-4 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100 hidden sm:inline-flex">
                <Command className="h-2 w-2" />K
              </kbd>
            </Button>

            {/* Version Info */}
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center justify-between">
                <span>© 2024 Lawdesk CRM</span>
                <Badge variant="outline" className="text-xs">
                  v3.0.0
                </Badge>
              </div>
              <div className="text-muted-foreground/70">
                AI-Powered Legal Suite
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
