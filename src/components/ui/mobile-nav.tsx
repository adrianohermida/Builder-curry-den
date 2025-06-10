import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Menu,
  X,
  BarChart3,
  Users,
  MessageSquare,
  Calendar,
  Brain,
  Settings,
  FolderOpen,
  Scale,
  CheckSquare,
  FileText,
  DollarSign,
  FileSignature,
  Headphones,
  Crown,
  Shield,
  Search,
  Home,
  Bell,
  User,
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  className?: string;
}

// Define menu items with permission requirements
const baseMenuItems = [
  {
    title: "Painel Jurídico",
    href: "/dashboard",
    icon: BarChart3,
    permission: { module: "dashboard", action: "read" },
    description: "Visão geral e métricas",
  },
  {
    title: "CRM Jurídico",
    href: "/crm",
    icon: Users,
    permission: { module: "crm", action: "read" },
    description: "Gestão de clientes",
  },
  {
    title: "GED Jurídico",
    href: "/crm/ged",
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
    description: "Configurações do sistema",
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

// Quick action items for bottom navigation
const quickActions = [
  { title: "Início", href: "/dashboard", icon: Home },
  { title: "Buscar", href: "#", icon: Search, action: "search" },
  { title: "Clientes", href: "/crm", icon: Users },
  { title: "Notificações", href: "#", icon: Bell, action: "notifications" },
  { title: "Perfil", href: "#", icon: User, action: "profile" },
];

export function MobileNav({ className }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { hasPermission, isAdmin, user } = usePermissions();

  // Filter menu items based on permissions
  const menuItems = [
    ...baseMenuItems.filter((item) =>
      hasPermission(item.permission.module, item.permission.action),
    ),
    ...(isAdmin() ? adminMenuItems : []),
  ];

  // Close mobile nav when route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "search":
        document.dispatchEvent(new CustomEvent("open-global-search"));
        break;
      case "notifications":
        // Open notifications panel
        break;
      case "profile":
        // Open profile menu
        break;
    }
  };

  return (
    <>
      {/* Mobile Navigation Trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "lg:hidden touch-target p-0 h-10 w-10 hover:bg-accent",
              className,
            )}
            aria-label="Abrir menu de navegação"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-full sm:w-80 p-0 flex flex-col">
          {/* Header */}
          <SheetHeader className="p-4 pb-2 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Scale className="h-5 w-5 text-primary-foreground" />
                </div>
                <SheetTitle className="text-lg font-bold">Lawdesk</SheetTitle>
              </div>
            </div>
          </SheetHeader>

          {/* User Info */}
          {user && (
            <div className="p-4 pb-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-medium text-sm">
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
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-2">
              {/* Core Modules */}
              <div className="space-y-1">
                {menuItems
                  .filter((item) => !item.adminOnly)
                  .map((item) => {
                    const isActive =
                      location.pathname === item.href ||
                      (item.href === "/crm/ged" &&
                        location.pathname.startsWith("/crm/ged")) ||
                      (item.href === "/atendimento" &&
                        (location.pathname === "/tickets" ||
                          location.pathname === "/atendimento"));
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors group touch-target",
                          isActive
                            ? "bg-primary text-primary-foreground"
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
                  <Separator className="my-4" />
                  <div className="space-y-2">
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
                            className={cn(
                              "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors touch-target",
                              isActive
                                ? "bg-primary text-primary-foreground"
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
                  </div>
                </>
              )}

              {/* Quick Links */}
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground mb-2 px-3">
                  ACESSO RÁPIDO
                </div>
                <Link
                  to="/publicacoes-example"
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors touch-target",
                    location.pathname === "/publicacoes-example"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                >
                  <FileText className="h-5 w-5" />
                  <span>Publicações Jurídicas</span>
                </Link>

                <Link
                  to="/configuracoes/armazenamento"
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors touch-target",
                    location.pathname === "/configuracoes/armazenamento"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                >
                  <Settings className="h-5 w-5" />
                  <span>Config. Armazenamento</span>
                </Link>
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t space-y-3">
            {/* Quick Search */}
            <Button
              variant="outline"
              className="w-full justify-start text-muted-foreground h-10 touch-target"
              onClick={() => {
                document.dispatchEvent(new CustomEvent("open-global-search"));
                setOpen(false);
              }}
            >
              <Search className="h-4 w-4 mr-2" />
              <span className="text-sm">Busca Global</span>
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
        </SheetContent>
      </Sheet>

      {/* Bottom Navigation for Mobile (Alternative) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border mobile-safe-area">
        <div className="flex items-center justify-around px-2 py-1">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const isActive = location.pathname === action.href;

            return (
              <Button
                key={action.title}
                variant="ghost"
                size="sm"
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 h-12 touch-target",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
                onClick={() => {
                  if (action.action) {
                    handleQuickAction(action.action);
                  }
                }}
                asChild={!action.action}
              >
                {action.action ? (
                  <>
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{action.title}</span>
                  </>
                ) : (
                  <Link
                    to={action.href}
                    className="flex flex-col items-center gap-1"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{action.title}</span>
                  </Link>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
}

// Hook to handle mobile navigation state
export function useMobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
