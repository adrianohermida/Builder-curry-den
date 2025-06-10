/**
 * 🎯 DEFINITIVE SIDEBAR - FULLY FUNCTIONAL
 *
 * Sidebar definitiva que funciona perfeitamente:
 * - Ultra compacta e moderna
 * - Zero problemas de display
 * - Tooltips funcionais
 * - Responsividade perfeita
 * - Ícones fixos e estáveis
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

interface DefinitiveSidebarProps {
  mode?: "client" | "admin";
}

interface SidebarItem {
  id: string;
  title: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
  category: "main" | "secondary" | "admin";
}

export const DefinitiveSidebar: React.FC<DefinitiveSidebarProps> = ({
  mode = "client",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const location = useLocation();

  const isAdmin = mode === "admin";
  const orphanCount = 25;

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

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

  // Mobile Menu Button
  const MobileMenuButton = () => (
    <button
      onClick={() => setIsMobileOpen(true)}
      className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      aria-label="Abrir menu"
    >
      <Menu className="w-4 h-4 text-gray-600" />
    </button>
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
      // Compact mode with custom tooltip
      return (
        <div className="relative">
          <Link
            to={item.path}
            className={cn(
              "relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 group",
              itemIsActive
                ? mode === "admin"
                  ? "bg-red-500 text-white shadow-lg"
                  : "bg-blue-500 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              item.category === "admin" && "border border-red-200",
            )}
            onMouseEnter={() => setShowTooltip(item.id)}
            onMouseLeave={() => setShowTooltip(null)}
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

            {/* Custom Tooltip */}
            {showTooltip === item.id && (
              <div className="absolute left-14 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap">
                {item.title}
                {item.badge && (
                  <span className="ml-2 text-gray-300">({item.badge})</span>
                )}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            )}
          </Link>
        </div>
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
              ? "bg-red-500 text-white shadow-lg"
              : "bg-blue-500 text-white shadow-lg"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
          item.category === "admin" && "border border-red-200 bg-red-50/50",
        )}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {item.icon}
          <span className="font-medium truncate">{item.title}</span>
        </div>

        {/* Badge */}
        {item.badge && (
          <span
            className={cn(
              "text-xs px-2 py-1 rounded-full font-medium",
              itemIsActive
                ? "bg-white/20 text-white"
                : mode === "admin"
                  ? "bg-red-500 text-white"
                  : "bg-blue-500 text-white",
            )}
          >
            {item.badge > 99 ? "99+" : item.badge}
          </span>
        )}

        {/* Admin badge */}
        {item.category === "admin" && !item.badge && (
          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Admin
          </span>
        )}
      </Link>
    );
  };

  // Group items
  const mainItems = sidebarItems.filter((item) => item.category === "main");
  const secondaryItems = sidebarItems.filter(
    (item) => item.category === "secondary",
  );
  const adminItems = sidebarItems.filter((item) => item.category === "admin");

  // Sidebar Content
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col shadow-sm h-full transition-all duration-300",
        isExpanded || isMobile ? "w-64" : "w-14",
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
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-8 h-8 p-0 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
              aria-label={isExpanded ? "Recolher" : "Expandir"}
            >
              {isExpanded ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Close Button - Mobile */}
          {isMobile && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="w-8 h-8 p-0 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Fechar menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto hide-scrollbar">
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
              <span className="text-xs text-gray-500">Online</span>
            )}
          </div>
        </div>
      </div>
    </aside>
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
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

export default DefinitiveSidebar;
