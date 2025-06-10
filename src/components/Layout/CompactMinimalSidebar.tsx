/**
 * 🎯 COMPACT MINIMAL SIDEBAR - SIDEBAR COMPACTO E MINIMALISTA
 *
 * Design baseado na imagem fornecida com:
 * - Layout compacto e moderno
 * - Ícones claros e intuitivos
 * - Navegação fluida
 * - Suporte a temas
 * - Mobile responsive
 */

import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Scale,
  Calendar,
  FileText,
  DollarSign,
  MessageSquare,
  Bot,
  Archive,
  Settings,
  Menu,
  X,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Types
interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
  color?: string;
}

interface CompactMinimalSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

// Navigation Items
const NAVIGATION_ITEMS: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Painel de Controle",
    icon: LayoutDashboard,
    path: "/dashboard",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "crm-juridico",
    label: "CRM Jurídico",
    icon: Users,
    path: "/crm-juridico",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "agenda-juridica",
    label: "Agenda Jurídica",
    icon: Calendar,
    path: "/agenda-juridica",
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "processos-publicacoes",
    label: "Processos e Publicações",
    icon: Scale,
    path: "/processos-publicacoes",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "contratos-financeiro",
    label: "Contratos e Financeiro",
    icon: DollarSign,
    path: "/contratos-financeiro",
    color: "text-green-600 dark:text-green-400",
  },
  {
    id: "atendimento-comunicacao",
    label: "Atendimento e Comunicação",
    icon: MessageSquare,
    path: "/atendimento-comunicacao",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "ia-juridica",
    label: "IA Jurídica",
    icon: Bot,
    path: "/ia-juridica",
    color: "text-violet-600 dark:text-violet-400",
  },
  {
    id: "ged-documentos",
    label: "GED e Documentos",
    icon: Archive,
    path: "/ged-documentos",
    color: "text-indigo-600 dark:text-indigo-400",
  },
  {
    id: "admin-configuracoes",
    label: "Administração e Configurações",
    icon: Settings,
    path: "/admin-configuracoes",
    color: "text-gray-600 dark:text-gray-400",
  },
];

// Main Component
export const CompactMinimalSidebar: React.FC<CompactMinimalSidebarProps> = ({
  isCollapsed = false,
  onToggle,
  className,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return (
        location.pathname === "/" ||
        location.pathname === "/dashboard" ||
        location.pathname === "/painel"
      );
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo Area */}
      <div className="flex items-center justify-between p-4 border-b border-border/60">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-semibold text-foreground">Lawdesk</span>
          </div>
        )}

        {isCollapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">L</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            if (isCollapsed) {
              return (
                <TooltipProvider key={item.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={active ? "secondary" : "ghost"}
                        size="sm"
                        className={`
                          w-full h-10 p-0 justify-center
                          ${
                            active
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "hover:bg-accent/60 text-muted-foreground hover:text-foreground"
                          }
                          transition-all duration-200
                        `}
                        onClick={() => handleNavigation(item.path)}
                      >
                        <Icon size={18} className={active ? item.color : ""} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            }

            return (
              <Button
                key={item.id}
                variant={active ? "secondary" : "ghost"}
                size="sm"
                className={`
                  w-full justify-start h-10 px-3 text-sm font-medium
                  ${
                    active
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "hover:bg-accent/60 text-muted-foreground hover:text-foreground"
                  }
                  transition-all duration-200
                `}
                onClick={() => handleNavigation(item.path)}
              >
                <Icon
                  size={18}
                  className={`mr-3 ${active ? item.color : ""}`}
                />
                <span className="truncate">{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border/60">
        {!isCollapsed && (
          <div className="text-xs text-muted-foreground text-center">
            Lawdesk CRM v2.0
          </div>
        )}
      </div>
    </div>
  );

  if (isCollapsed) {
    return (
      <div
        className={`w-16 bg-background border-r border-border/60 ${className}`}
      >
        {sidebarContent}
      </div>
    );
  }

  return (
    <div
      className={`w-64 bg-background border-r border-border/60 ${className}`}
    >
      {sidebarContent}
    </div>
  );
};

export default CompactMinimalSidebar;
