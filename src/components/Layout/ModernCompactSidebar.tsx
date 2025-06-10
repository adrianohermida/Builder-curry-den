/**
 * 🎯 MODERN COMPACT SIDEBAR - LAWDESK REDESIGN
 *
 * Design minimalista e compacto:
 * - Sidebar ultra-compacta (48px collapsed, 240px expanded)
 * - Transições suaves
 * - Tooltips informativos
 * - Responsivo mobile
 * - Tema dark/light
 * - Zero redundância
 */

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Scale,
  CheckSquare,
  FolderOpen,
  FileSignature,
  Calendar,
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
  AlertTriangle,
  Building,
  DollarSign,
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

interface ModernCompactSidebarProps {
  className?: string;
}

interface SidebarItem {
  id: string;
  title: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
  adminOnly?: boolean;
  category?: "main" | "secondary" | "admin";
}

export const ModernCompactSidebar: React.FC<ModernCompactSidebarProps> = ({
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Mock admin check
  const isAdmin = true;
  const orphanCount = 25;

  // Auto-collapse on mobile
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileOpen(false);
      }
    };

    if (isMobileOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isMobileOpen]);

  const sidebarItems: SidebarItem[] = [
    // Main navigation
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

    // Secondary navigation
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

    // Admin navigation
    ...(isAdmin
      ? [
          {
            id: "beta",
            title: "Beta",
            path: "/beta",
            icon: <FlaskConical className="w-4 h-4" />,
            badge: orphanCount > 0 ? orphanCount : undefined,
            adminOnly: true,
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
      className="lg:hidden fixed top-3 left-3 z-50 bg-white/90 backdrop-blur-sm shadow-md"
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
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                  : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
                item.adminOnly &&
                  "border border-purple-200 dark:border-purple-800",
              )}
            >
              {item.icon}

              {/* Badge */}
              {item.badge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium text-[10px]">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}

              {/* Active indicator */}
              {itemIsActive && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded-r opacity-0" />
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
          "relative flex items-center px-3 py-2 rounded-lg transition-all duration-200 group text-sm",
          itemIsActive
            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
          item.adminOnly &&
            "border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20",
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
                : "bg-red-500 text-white",
            )}
          >
            {item.badge > 99 ? "99+" : item.badge}
          </Badge>
        )}

        {/* Admin badge */}
        {item.adminOnly && !item.badge && (
          <Badge variant="outline" className="text-xs">
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
          "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-sm transition-all duration-300 ease-out h-full",
          isExpanded || isMobile ? "w-60" : "w-12",
          className,
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "px-3 py-4 border-b border-gray-200 dark:border-gray-800",
          )}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building className="w-4 h-4 text-white" />
              </div>

              {/* Logo Text */}
              {(isExpanded || isMobile) && (
                <div className="min-w-0 flex-1">
                  <h1 className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">
                    Lawdesk
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    CRM Jurídico Moderno
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
                className="w-8 h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
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
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {/* Main Items */}
          <div className="space-y-1">
            {(isExpanded || isMobile) && (
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
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
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                Secundário
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
                <h3 className="text-xs font-semibold text-purple-500 dark:text-purple-400 uppercase tracking-wider mb-2">
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

              {/* Beta Warning */}
              {(isExpanded || isMobile) && (
                <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-medium text-purple-800 dark:text-purple-200">
                      Seção Beta
                    </span>
                  </div>
                  <p className="text-xs text-purple-700 dark:text-purple-300">
                    Recursos em desenvolvimento
                  </p>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              {(isExpanded || isMobile) && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Sistema Online
                </span>
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
          <div className="relative flex flex-col w-60 max-w-xs bg-white dark:bg-gray-900 shadow-xl">
            <SidebarContent isMobile={true} />
          </div>
        </div>
      )}
    </>
  );
};

export default ModernCompactSidebar;
