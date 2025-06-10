/**
 * 🎯 ULTIMATE COMPACT SIDEBAR - PERFEITA UX 2025
 *
 * Sidebar definitiva com todas as especificações:
 * - Ultra compacta e moderna
 * - Zero cintilação ou movimentos desnecessários
 * - Ícones fixos e alinhados
 * - Tooltips informativos
 * - Responsividade perfeita
 * - Transições suaves e profissionais
 */

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Scale,
  CheckSquare,
  Calendar,
  FolderOpen,
  FileSignature,
  DollarSign,
  FileText,
  Headphones,
  Clock,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  FlaskConical,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UltimateCompactSidebarProps {
  mode?: "client" | "admin";
  className?: string;
}

interface SidebarItem {
  id: string;
  title: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
  category: "main" | "secondary" | "admin";
}

export const UltimateCompactSidebar: React.FC<UltimateCompactSidebarProps> = ({
  mode = "client",
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Mock data
  const isAdmin = mode === "admin";
  const orphanCount = 25;

  // Auto-close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileOpen(false);
      if (e.key === "[" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsExpanded(!isExpanded);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded]);

  const sidebarItems: SidebarItem[] = [
    // Main Navigation
    {
      id: "home",
      title: "Painel de Controle",
      path: "/painel",
      icon: <Home className="w-4 h-4" />,
      category: "main",
    },
    {
      id: "crm",
      title: "CRM Jurídico",
      path: "/crm-modern",
      icon: <Users className="w-4 h-4" />,
      badge: 247,
      category: "main",
    },
    {
      id: "processes",
      title: "Processos",
      path: "/crm-modern/processos",
      icon: <Scale className="w-4 h-4" />,
      badge: 12,
      category: "main",
    },
    {
      id: "tasks",
      title: "Tarefas",
      path: "/crm-modern/tarefas",
      icon: <CheckSquare className="w-4 h-4" />,
      badge: 47,
      category: "main",
    },
    {
      id: "calendar",
      title: "Agenda",
      path: "/agenda",
      icon: <Calendar className="w-4 h-4" />,
      category: "main",
    },

    // Secondary Navigation
    {
      id: "documents",
      title: "Documentos",
      path: "/crm-modern/documentos",
      icon: <FolderOpen className="w-4 h-4" />,
      category: "secondary",
    },
    {
      id: "contracts",
      title: "Contratos",
      path: "/crm-modern/contratos",
      icon: <FileSignature className="w-4 h-4" />,
      category: "secondary",
    },
    {
      id: "financial",
      title: "Financeiro",
      path: "/crm-modern/financeiro",
      icon: <DollarSign className="w-4 h-4" />,
      category: "secondary",
    },
    {
      id: "publications",
      title: "Publicações",
      path: "/publicacoes",
      icon: <FileText className="w-4 h-4" />,
      category: "secondary",
    },
    {
      id: "support",
      title: "Atendimento",
      path: "/atendimento",
      icon: <Headphones className="w-4 h-4" />,
      category: "secondary",
    },
    {
      id: "time",
      title: "Controle de Tempo",
      path: "/tempo",
      icon: <Clock className="w-4 h-4" />,
      category: "secondary",
    },
    {
      id: "settings",
      title: "Configurações",
      path: "/configuracoes-usuario",
      icon: <Settings className="w-4 h-4" />,
      category: "secondary",
    },

    // Admin Navigation
    ...(isAdmin
      ? [
          {
            id: "beta",
            title: "Beta",
            path: "/beta",
            icon: <FlaskConical className="w-4 h-4" />,
            badge: orphanCount > 0 ? orphanCount : undefined,
            category: "admin" as const,
          },
        ]
      : []),
  ];

  const isActive = (path: string) => {
    if (path === "/painel" && location.pathname === "/") return true;
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // Group items by category
  const mainItems = sidebarItems.filter((item) => item.category === "main");
  const secondaryItems = sidebarItems.filter(
    (item) => item.category === "secondary",
  );
  const adminItems = sidebarItems.filter((item) => item.category === "admin");

  // Mobile Menu Button
  const MobileMenuButton = () => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setIsMobileOpen(true)}
      className="lg:hidden fixed top-3 left-3 z-50 bg-white/90 backdrop-blur-sm shadow-lg border-gray-200"
      aria-label="Abrir menu"
    >
      <Menu className="w-4 h-4" />
    </Button>
  );

  // Sidebar Item Component
  const SidebarItemComponent = ({
    item,
    isMobile = false,
  }: {
    item: SidebarItem;
    isMobile?: boolean;
  }) => {
    const itemIsActive = isActive(item.path);

    if (!isExpanded && !isMobile) {
      // Compact mode with tooltip
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={item.path}
              className={cn(
                "relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 group",
                itemIsActive
                  ? mode === "admin"
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
                    : "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                item.category === "admin" &&
                  "border border-red-200 hover:border-red-300",
              )}
            >
              {item.icon}

              {/* Badge */}
              {item.badge && (
                <span
                  className={cn(
                    "absolute -top-1 -right-1 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium text-[10px]",
                    mode === "admin" ? "bg-red-500" : "bg-blue-500",
                  )}
                >
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="ml-2 font-medium">
            <p>{item.title}</p>
            {item.badge && (
              <p className="text-xs text-gray-500 mt-1">{item.badge} itens</p>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    // Expanded mode
    return (
      <Link
        to={item.path}
        className={cn(
          "relative flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm",
          itemIsActive
            ? mode === "admin"
              ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
              : "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
          item.category === "admin" &&
            "border border-red-200 bg-red-50/50 hover:bg-red-100/50",
        )}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {item.icon}
          <span className="font-medium truncate">{item.title}</span>
        </div>

        {/* Badge */}
        {item.badge && (
          <Badge
            variant={itemIsActive ? "secondary" : "default"}
            className={cn(
              "text-xs px-1.5 py-0.5 min-w-[18px] text-center",
              itemIsActive
                ? "bg-white/20 text-white hover:bg-white/30"
                : mode === "admin"
                  ? "bg-red-500 text-white"
                  : "bg-blue-500 text-white",
            )}
          >
            {item.badge > 99 ? "99+" : item.badge}
          </Badge>
        )}

        {/* Admin badge */}
        {item.category === "admin" && !item.badge && (
          <Badge variant="outline" className="text-xs border-red-300">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        )}
      </Link>
    );
  };

  // Sidebar Content
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <TooltipProvider>
      <aside
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col shadow-sm transition-all duration-300 ease-out h-full",
          isExpanded || isMobile ? "w-64" : "w-12",
          className,
        )}
      >
        {/* Header */}
        <div className="px-3 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3 min-w-0">
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  mode === "admin" ? "bg-red-500" : "bg-blue-500",
                )}
              >
                <Building2 className="w-4 h-4 text-white" />
              </div>

              {/* Logo Text */}
              {(isExpanded || isMobile) && (
                <div className="min-w-0 flex-1">
                  <h1 className="font-bold text-lg text-gray-900 truncate">
                    Lawdesk
                  </h1>
                  <p
                    className={cn(
                      "text-xs truncate",
                      mode === "admin" ? "text-red-600" : "text-blue-600",
                    )}
                  >
                    {mode === "admin" ? "Administração" : "CRM Jurídico"}
                  </p>
                </div>
              )}
            </div>

            {/* Toggle Button - Desktop */}
            {!isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-8 h-8 p-0 hover:bg-gray-100"
                aria-label={
                  isExpanded ? "Recolher sidebar" : "Expandir sidebar"
                }
              >
                {isExpanded ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            )}

            {/* Close Button - Mobile */}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileOpen(false)}
                className="w-8 h-8 p-0"
                aria-label="Fechar menu"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto modern-scrollbar">
          {/* Main Items */}
          <div className="space-y-1">
            {(isExpanded || isMobile) && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                Principal
              </h3>
            )}
            {mainItems.map((item) => (
              <SidebarItemComponent
                key={item.id}
                item={item}
                isMobile={isMobile}
              />
            ))}
          </div>

          {/* Secondary Items */}
          <div className="space-y-1">
            {(isExpanded || isMobile) && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                Ferramentas
              </h3>
            )}
            {secondaryItems.map((item) => (
              <SidebarItemComponent
                key={item.id}
                item={item}
                isMobile={isMobile}
              />
            ))}
          </div>

          {/* Admin Items */}
          {adminItems.length > 0 && (
            <div className="space-y-1">
              {(isExpanded || isMobile) && (
                <h3 className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2 px-2">
                  Administração
                </h3>
              )}
              {adminItems.map((item) => (
                <SidebarItemComponent
                  key={item.id}
                  item={item}
                  isMobile={isMobile}
                />
              ))}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-gray-100">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {(isExpanded || isMobile) && (
                <span className="text-xs text-gray-500">Sistema Online</span>
              )}
            </div>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <MobileMenuButton />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Sidebar */}
          <div className="relative flex flex-col w-64 max-w-xs bg-white shadow-xl">
            <SidebarContent isMobile={true} />
          </div>
        </div>
      )}
    </>
  );
};

export default UltimateCompactSidebar;
