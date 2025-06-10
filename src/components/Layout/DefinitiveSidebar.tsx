/**
 * 🎯 LAWDESK SIDEBAR - RESTORED AND FUNCTIONAL
 *
 * Sidebar da Lawdesk restaurada:
 * - Logo oficial da Lawdesk
 * - Menu expandido por padrão
 * - Ícones e badges corretos
 * - Design idêntico à imagem fornecida
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
  const [isExpanded, setIsExpanded] = useState(true); // Expandido por padrão
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
    // Main Navigation - exatamente como na imagem
    {
      id: "home",
      title: "Painel de Controle",
      path: "/painel",
      icon: <Home className="w-5 h-5" />,
      category: "main",
    },
    {
      id: "crm",
      title: "CRM Jurídico",
      path: "/crm-modern",
      icon: <Users className="w-5 h-5" />,
      badge: 99, // Como mostrado na imagem
      category: "main",
    },
    {
      id: "tasks",
      title: "Tarefas",
      path: "/crm-modern/tarefas",
      icon: <CheckSquare className="w-5 h-5" />,
      badge: 47, // Como mostrado na imagem
      category: "main",
    },
    {
      id: "calendar",
      title: "Agenda",
      path: "/agenda",
      icon: <Calendar className="w-5 h-5" />,
      category: "main",
    },
    {
      id: "documents",
      title: "Documentos",
      path: "/crm-modern/documentos",
      icon: <FolderOpen className="w-5 h-5" />,
      category: "main",
    },
    {
      id: "contracts",
      title: "Contratos",
      path: "/crm-modern/contratos",
      icon: <FileSignature className="w-5 h-5" />,
      category: "main",
    },
    {
      id: "financial",
      title: "Financeiro",
      path: "/crm-modern/financeiro",
      icon: <Scale className="w-5 h-5" />,
      category: "main",
    },
    {
      id: "support",
      title: "Atendimento",
      path: "/atendimento",
      icon: <Headphones className="w-5 h-5" />,
      category: "main",
    },
    {
      id: "settings",
      title: "Configurações",
      path: "/configuracoes-usuario",
      icon: <Settings className="w-5 h-5" />,
      category: "main",
    },

    // Admin/Beta section
    ...(true // Sempre mostrar Beta como na imagem
      ? [
          {
            id: "beta",
            title: "Beta",
            path: "/beta",
            icon: <FlaskConical className="w-5 h-5" />,
            badge: 25, // Como mostrado na imagem
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

    return (
      <Link
        to={item.path}
        className={cn(
          "relative flex items-center px-4 py-3 mx-2 rounded-lg transition-all duration-200 group text-sm",
          itemIsActive
            ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
          item.category === "admin" && "mt-4", // Espaço antes do Beta
        )}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {item.icon}
          <span className="font-medium truncate">{item.title}</span>
        </div>

        {/* Badge - exatamente como na imagem */}
        {item.badge && (
          <span
            className={cn(
              "text-xs px-2 py-1 rounded-full font-medium text-white",
              item.badge >= 99 ? "bg-red-500" : "bg-red-500",
            )}
          >
            {item.badge >= 99 ? "99+" : item.badge}
          </span>
        )}
      </Link>
    );
  };

  // Sidebar Content
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col shadow-sm h-full transition-all duration-300",
        "w-64", // Sempre expandido como na imagem
      )}
    >
      {/* Header com Logo Lawdesk */}
      <div className="px-4 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {/* Logo Lawdesk - Ícone oficial */}
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              {/* Ícone da Lawdesk - balança da justiça estilizada */}
              <div className="relative">
                <Scale className="w-5 h-5 text-white" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full opacity-80"></div>
              </div>
            </div>

            {/* Logo Text */}
            <div className="min-w-0 flex-1">
              <h1 className="font-bold text-xl text-gray-900 truncate">
                Lawdesk
              </h1>
              <p className="text-sm text-gray-500 truncate">
                CRM Jurídico Moderno
              </p>
            </div>
          </div>

          {/* Close Button - Mobile only */}
          {isMobile && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="w-8 h-8 p-0 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Fechar menu"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation - Menu completo como na imagem */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <SidebarItemComponent
              key={item.id}
              item={item}
              isMobile={isMobile}
            />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500 font-medium">
            Sistema Online
          </span>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <MobileMenuButton />

      {/* Desktop Sidebar - sempre visível e expandido */}
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
