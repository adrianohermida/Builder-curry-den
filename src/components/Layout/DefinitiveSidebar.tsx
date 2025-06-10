/**
 * 🎯 LAWDESK SIDEBAR - EXATO COMO A IMAGEM
 *
 * Sidebar da Lawdesk idêntica à imagem fornecida:
 * - Logo oficial da Lawdesk
 * - Menu com ícones e badges corretos
 * - Estilo visual idêntico
 * - Badges vermelhos nos números corretos
 */

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  CheckSquare,
  Calendar,
  FolderOpen,
  FileSignature,
  DollarSign,
  Headphones,
  Settings,
  Menu,
  X,
  FlaskConical,
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
}

export const DefinitiveSidebar: React.FC<DefinitiveSidebarProps> = ({
  mode = "client",
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Menu items exatamente como na imagem
  const sidebarItems: SidebarItem[] = [
    {
      id: "home",
      title: "Painel de Controle",
      path: "/painel",
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: "crm",
      title: "CRM Jurídico",
      path: "/crm-modern",
      icon: <Users className="w-5 h-5" />,
      badge: 99, // Badge 99+ como na imagem
    },
    {
      id: "tasks",
      title: "Tarefas",
      path: "/crm-modern/tarefas",
      icon: <CheckSquare className="w-5 h-5" />,
      badge: 47, // Badge 47 como na imagem
    },
    {
      id: "calendar",
      title: "Agenda",
      path: "/agenda",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: "documents",
      title: "Documentos",
      path: "/crm-modern/documentos",
      icon: <FolderOpen className="w-5 h-5" />,
    },
    {
      id: "contracts",
      title: "Contratos",
      path: "/crm-modern/contratos",
      icon: <FileSignature className="w-5 h-5" />,
    },
    {
      id: "financial",
      title: "Financeiro",
      path: "/crm-modern/financeiro",
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      id: "support",
      title: "Atendimento",
      path: "/atendimento",
      icon: <Headphones className="w-5 h-5" />,
    },
    {
      id: "settings",
      title: "Configurações",
      path: "/configuracoes-usuario",
      icon: <Settings className="w-5 h-5" />,
    },
    {
      id: "beta",
      title: "Beta",
      path: "/beta",
      icon: <FlaskConical className="w-5 h-5" />,
      badge: 25, // Badge 25 como na imagem
    },
  ];

  const isActive = (path: string) => {
    if (path === "/painel" && location.pathname === "/") return true;
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // Mobile Menu Button
  const MobileMenuButton = () => (
    <button
      onClick={() => setIsMobileOpen(true)}
      className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      aria-label="Abrir menu"
    >
      <Menu className="w-5 h-5 text-gray-600" />
    </button>
  );

  // Sidebar Item Component - estilo idêntico à imagem
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
          "flex items-center justify-between px-4 py-3 mx-3 rounded-lg transition-all duration-200 text-sm font-medium",
          itemIsActive
            ? "bg-blue-100 text-blue-700 border-l-4 border-blue-600" // Estado ativo como na imagem
            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
        )}
      >
        <div className="flex items-center space-x-3">
          {item.icon}
          <span>{item.title}</span>
        </div>

        {/* Badge - estilo idêntico à imagem */}
        {item.badge && (
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[24px] h-5">
            {item.badge >= 99 ? "99+" : item.badge}
          </span>
        )}
      </Link>
    );
  };

  // Sidebar Content - layout idêntico à imagem
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm">
      {/* Header com Logo Lawdesk - exato como na imagem */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        {/* Logo Lawdesk */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            {/* Ícone da Lawdesk - letra "L" estilizada como na imagem */}
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">Lawdesk</h1>
            <p className="text-sm text-gray-500">CRM Jurídico Moderno</p>
          </div>
        </div>

        {/* Close Button - Mobile only */}
        {isMobile && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
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
    </aside>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <MobileMenuButton />

      {/* Desktop Sidebar - sempre visível */}
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
