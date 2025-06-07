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
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
    title: "",
    href: "/ged-juridico",
    icon: FolderOpen,
    description: "GED Jurídico",
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
    title: "Tarefas",
    href: "/tarefas",
    icon: CheckSquare,
    description: "Gestão de Tarefas Integrada",
  },
  {
    title: "Publicações",
    href: "/publicacoes",
    icon: FileText,
    description: "Diários Oficiais e Intimações",
  },
  {
    title: "Contratos",
    href: "/contratos",
    icon: FileSignature,
    description: "Gestão Contratual e Assinaturas",
  },
  {
    title: "Financeiro",
    href: "/financeiro",
    icon: DollarSign,
    description: "Faturas, Cobranças e Fluxo de Caixa",
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
  },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();

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
              const isActive =
                location.pathname === item.href ||
                (item.href === "/ged-juridico" &&
                  location.pathname.startsWith("/ged"));
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
                  <Icon className="h-5 w-5" />
                  <div className="flex-1">
                    <span>{item.title}</span>
                    {item.description && (
                      <div className="text-xs opacity-75 mt-0.5">
                        {item.description}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}

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
          <div className="p-4 border-t">
            <div className="text-xs text-muted-foreground">
              © 2024 Lawdesk CRM
            </div>
            <div className="text-xs text-muted-foreground">
              v2.2.0 - GED Jurídico
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
