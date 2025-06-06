import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  MessageSquare,
  Calendar,
  Brain,
  Settings,
  X,
  Scale,
  ChevronDown,
  ChevronRight,
  HardDrive,
  FileText,
  Shield,
  BarChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    title: "Painel Jurídico",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "CRM Jurídico",
    href: "/crm",
    icon: Users,
  },
  {
    title: "Atendimento",
    href: "/tickets",
    icon: MessageSquare,
  },
  {
    title: "Agenda Jurídica",
    href: "/agenda",
    icon: Calendar,
  },
  {
    title: "IA Jurídica",
    href: "/ai",
    icon: Brain,
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: Settings,
    submenu: [
      {
        title: "Armazenamento de Documentos",
        href: "/configuracoes/armazenamento",
        icon: HardDrive,
        description: "Configure provedores e monitore uploads",
      },
      {
        title: "Dashboard de Arquivos",
        href: "/configuracoes/armazenamento?tab=dashboard",
        icon: BarChart,
        description: "Estatísticas e análises de armazenamento",
      },
      {
        title: "Logs de Auditoria",
        href: "/configuracoes/armazenamento?tab=logs",
        icon: Shield,
        description: "Histórico completo de ações",
      },
      {
        title: "Teste de Configuração",
        href: "/teste-configuracao-storage",
        icon: FileText,
        description: "Simular e validar configurações",
      },
    ],
  },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };

  const isSubmenuActive = (submenu: any[]) => {
    return submenu.some(
      (item) =>
        location.pathname === item.href ||
        (item.href.includes("?") &&
          location.pathname + location.search === item.href),
    );
  };

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

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isExpanded = expandedItems.includes(item.title);
              const isSubmenuItemActive =
                hasSubmenu && isSubmenuActive(item.submenu);
              const Icon = item.icon;

              if (hasSubmenu) {
                return (
                  <Collapsible key={item.title} open={isExpanded}>
                    <div className="space-y-1">
                      {/* Item principal */}
                      <Link
                        to={item.href}
                        onClick={() => onClose()}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          isActive || isSubmenuItemActive
                            ? "bg-[rgb(var(--theme-primary))] text-white"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="flex-1">{item.title}</span>
                      </Link>

                      {/* Toggle do submenu */}
                      <CollapsibleTrigger
                        onClick={() => toggleExpanded(item.title)}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-1 rounded-lg text-xs font-medium transition-colors w-full",
                          isExpanded
                            ? "text-[rgb(var(--theme-primary))]"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent",
                        )}
                      >
                        <HardDrive className="h-4 w-4" />
                        <span className="flex-1">Armazenamento</span>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </CollapsibleTrigger>

                      {/* Submenu */}
                      <CollapsibleContent className="pl-6 space-y-1">
                        {item.submenu.map((subItem) => {
                          const isSubActive =
                            location.pathname === subItem.href ||
                            (subItem.href.includes("?") &&
                              location.pathname + location.search ===
                                subItem.href);
                          const SubIcon = subItem.icon;

                          return (
                            <Link
                              key={subItem.href}
                              to={subItem.href}
                              onClick={() => onClose()}
                              className={cn(
                                "flex items-start space-x-3 px-3 py-2 rounded-lg text-xs transition-colors",
                                isSubActive
                                  ? "bg-[rgb(var(--theme-primary))]/10 text-[rgb(var(--theme-primary))] border-l-2 border-[rgb(var(--theme-primary))]"
                                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
                              )}
                            >
                              <SubIcon className="h-4 w-4 mt-0.5" />
                              <div>
                                <div className="font-medium">
                                  {subItem.title}
                                </div>
                                <div className="text-xs text-muted-foreground leading-tight">
                                  {subItem.description}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              }

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
                  <Icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              );
            })}

            {/* Acesso rápido ao sistema de publicações */}
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
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="text-xs text-muted-foreground">
              © 2024 Lawdesk CRM
            </div>
            <div className="text-xs text-muted-foreground">
              v2.1.0 - Sistema Integrado
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
