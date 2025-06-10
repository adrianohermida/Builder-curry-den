/**
 * 🗡️ LAWDESK HARMONIOUS SIDEBAR - DESIGN HARMÔNICO
 *
 * Sidebar com design system harmônico:
 * - Cores tom sobre tom perfeitamente balanceadas
 * - Compactação inteligente e suave
 * - Estados visuais consistentes
 * - Experiência visual excepcional
 */

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  CheckSquare,
  Calendar,
  FolderOpen,
  Scale,
  DollarSign,
  Headphones,
  Settings,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Building,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type ThemeMode, type UserMode } from "@/lib/lawdeskDesignSystem";

interface LawdeskHarmoniousSidebarProps {
  mode?: UserMode;
  theme?: ThemeMode;
}

interface SidebarItem {
  id: string;
  title: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
  description?: string;
}

export const LawdeskHarmoniousSidebar: React.FC<
  LawdeskHarmoniousSidebarProps
> = ({ mode = "client", theme = "clear" }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Show expanded on hover when collapsed
  const shouldShowExpanded = !isCollapsed || isHovered;

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Menu items
  const sidebarItems: SidebarItem[] = [
    {
      id: "home",
      title: "Painel de Controle",
      path: "/painel",
      icon: <Home className="w-5 h-5" />,
      description: "Dashboard principal",
    },
    {
      id: "crm",
      title: "CRM Jurídico",
      path: "/crm-modern/clientes",
      icon: <Users className="w-5 h-5" />,
      badge: 99,
      description: "Gestão de clientes",
    },
    {
      id: "tasks",
      title: "Tarefas",
      path: "/tarefas-gerencial",
      icon: <CheckSquare className="w-5 h-5" />,
      badge: 47,
      description: "Tarefas gerenciais",
    },
    {
      id: "calendar",
      title: "Agenda",
      path: "/agenda",
      icon: <Calendar className="w-5 h-5" />,
      description: "Compromissos e eventos",
    },
    {
      id: "documents",
      title: "Documentos",
      path: "/ged-organizacional",
      icon: <FolderOpen className="w-5 h-5" />,
      description: "GED organizacional",
    },
    {
      id: "financial",
      title: "Financeiro",
      path: "/financeiro-gerencial",
      icon: <DollarSign className="w-5 h-5" />,
      description: "Financeiro gerencial",
    },
    {
      id: "support",
      title: "Atendimento",
      path: "/atendimento",
      icon: <Headphones className="w-5 h-5" />,
      description: "Suporte e comunicação",
    },
    {
      id: "portal",
      title: "Portal do Cliente",
      path: "/portal-cliente",
      icon: <Building className="w-5 h-5" />,
      description: "Portal do cliente",
    },
    {
      id: "settings",
      title: "Configurações",
      path: "/configuracoes-usuario",
      icon: <Settings className="w-5 h-5" />,
      description: "Configurações do sistema",
    },
    {
      id: "beta",
      title: "Beta",
      path: "/beta",
      icon: <FlaskConical className="w-5 h-5" />,
      badge: 25,
      description: "Recursos em desenvolvimento",
    },
  ];

  const isActive = (path: string) => {
    if (
      path === "/painel" &&
      (location.pathname === "/" || location.pathname === "/painel")
    )
      return true;
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // Sidebar Item Component
  const SidebarItemComponent = ({ item }: { item: SidebarItem }) => {
    const itemIsActive = isActive(item.path);

    const getItemStyles = () => {
      if (itemIsActive) {
        return {
          background: "var(--surface-secondary)",
          color: "var(--text-accent)",
          borderLeft: `2px solid var(--primary-500)`,
        };
      }

      return {
        background: "transparent",
        color: "var(--text-secondary)",
      };
    };

    const getBadgeStyles = () => {
      if (mode === "admin") {
        return {
          background: "var(--color-danger)",
          color: "var(--text-inverse)",
        };
      }

      if (theme === "color") {
        return {
          background: "var(--primary-600)",
          color: "var(--text-inverse)",
        };
      }

      return {
        background: "var(--primary-500)",
        color: "var(--text-inverse)",
      };
    };

    return (
      <Link
        to={item.path}
        className={cn(
          "group relative flex items-center justify-between rounded-lg transition-all duration-200 text-sm font-medium hover:bg-opacity-50",
          shouldShowExpanded ? "px-3 py-2.5 mx-2" : "p-2 mx-2",
        )}
        style={getItemStyles()}
        title={item.description}
        onMouseEnter={(e) => {
          if (!itemIsActive) {
            (e.target as HTMLElement).style.background =
              "var(--surface-tertiary)";
            (e.target as HTMLElement).style.color = "var(--text-primary)";
          }
        }}
        onMouseLeave={(e) => {
          if (!itemIsActive) {
            (e.target as HTMLElement).style.background = "transparent";
            (e.target as HTMLElement).style.color = "var(--text-secondary)";
          }
        }}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="flex-shrink-0 transition-colors duration-200">
              {item.icon}
            </div>
            {shouldShowExpanded && (
              <span className="font-medium truncate transition-all duration-200">
                {item.title}
              </span>
            )}
          </div>

          {/* Badge */}
          {item.badge && shouldShowExpanded && (
            <span
              className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full min-w-[20px] h-5 transition-all duration-200"
              style={getBadgeStyles()}
            >
              {item.badge >= 99 ? "99+" : item.badge}
            </span>
          )}

          {/* Compact Badge Indicator */}
          {item.badge && !shouldShowExpanded && (
            <div
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full transition-all duration-200"
              style={getBadgeStyles()}
            />
          )}
        </div>
      </Link>
    );
  };

  // Mobile Menu Button
  const MobileMenuButton = () => (
    <button
      onClick={() => setIsMobileOpen(true)}
      className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg ds-surface-elevated ds-shadow-md transition-colors"
      style={{
        background: "var(--surface-elevated)",
        boxShadow: "var(--shadow-md)",
      }}
      aria-label="Abrir menu"
    >
      <Menu className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
    </button>
  );

  // Sidebar Content
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <aside
      className={cn(
        "flex flex-col h-full transition-all duration-300 ease-in-out",
        shouldShowExpanded || isMobile ? "w-64" : "w-16",
      )}
      style={{
        background: "var(--surface-elevated)",
        borderRight: `1px solid var(--border-light)`,
        boxShadow: "var(--shadow-sm)",
      }}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      {/* Header com Logo Lawdesk */}
      <div
        className={cn(
          "flex items-center transition-all duration-300",
          shouldShowExpanded || isMobile
            ? "justify-between px-4 py-4"
            : "justify-center p-3",
        )}
        style={{
          borderBottom: `1px solid var(--border-light)`,
        }}
      >
        {/* Logo Lawdesk com ícone de balança da justiça */}
        <div className="flex items-center space-x-3">
          <div
            className={cn(
              "rounded-lg flex items-center justify-center transition-all duration-300",
              shouldShowExpanded || isMobile ? "w-10 h-10" : "w-8 h-8",
            )}
            style={{
              background: "var(--primary-500)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <Scale
              className={cn(
                "text-white transition-all duration-300",
                shouldShowExpanded || isMobile ? "w-5 h-5" : "w-4 h-4",
              )}
            />
          </div>
          {(shouldShowExpanded || isMobile) && (
            <div className="transition-all duration-300">
              <h1
                className="font-bold text-lg"
                style={{ color: "var(--text-primary)" }}
              >
                Lawdesk
              </h1>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {mode === "admin" ? "Administração" : "CRM Jurídico"}
              </p>
            </div>
          )}
        </div>

        {/* Close Button - Mobile only */}
        {isMobile && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1 rounded-lg transition-colors hover:bg-opacity-50"
            style={{
              background: "transparent",
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background =
                "var(--surface-tertiary)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = "transparent";
            }}
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Collapse Toggle Button - Desktop only */}
        {!isMobile && (shouldShowExpanded || isHovered) && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg transition-colors duration-200 hover:bg-opacity-50"
            style={{
              background: "transparent",
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background =
                "var(--surface-tertiary)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = "transparent";
            }}
            title={isCollapsed ? "Expandir menu" : "Compactar menu"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto modern-scroll">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <SidebarItemComponent key={item.id} item={item} />
          ))}
        </div>
      </nav>

      {/* Footer - Status */}
      <div
        className={cn(
          "transition-all duration-300",
          shouldShowExpanded || isMobile ? "px-4 py-3" : "p-3",
        )}
        style={{
          borderTop: `1px solid var(--border-light)`,
        }}
      >
        {shouldShowExpanded || isMobile ? (
          <div className="flex items-center space-x-2">
            <div
              className={cn("w-2 h-2 rounded-full animate-pulse")}
              style={{
                background:
                  mode === "admin"
                    ? "var(--color-danger)"
                    : "var(--color-success)",
              }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {mode === "admin" ? "Admin Online" : "Sistema Online"}
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                background:
                  mode === "admin"
                    ? "var(--color-danger)"
                    : "var(--color-success)",
              }}
            />
          </div>
        )}
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
            className="fixed inset-0 backdrop-blur-sm"
            style={{
              background: "var(--surface-overlay)",
            }}
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Sidebar */}
          <div
            className="relative flex flex-col w-64 max-w-xs"
            style={{
              background: "var(--surface-elevated)",
              boxShadow: "var(--shadow-xl)",
            }}
          >
            <SidebarContent isMobile={true} />
          </div>
        </div>
      )}
    </>
  );
};

export default LawdeskHarmoniousSidebar;
