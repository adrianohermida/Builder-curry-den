/**
 * 🗡️ LAWDESK SIDEBAR - ÍCONE ESPADA E CONEXÕES CORRETAS
 *
 * Sidebar corrigida com:
 * - Ícone de espada/balança da justiça
 * - Conexões corretas para todos os módulos
 * - Links para páginas especializadas
 * - Design limpo e moderno
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
  Menu,
  X,
  FlaskConical,
  FileText,
  Building,
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
  description?: string;
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

  // Menu items com conexões corretas
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
      path: "/crm-modern/clientes", // Conecta direto com clientes
      icon: <Users className="w-5 h-5" />,
      badge: 99,
      description: "Gestão de clientes",
    },
    {
      id: "tasks",
      title: "Tarefas",
      path: "/tarefas-gerencial", // Nova página gerencial
      icon: <CheckSquare className="w-5 h-5" />,
      badge: 47,
      description: "Tarefas gerenciais e de equipe",
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
      path: "/ged-organizacional", // Nova página GED
      icon: <FolderOpen className="w-5 h-5" />,
      description: "GED organizacional",
    },
    {
      id: "financial",
      title: "Financeiro",
      path: "/financeiro-gerencial", // Novo módulo financeiro
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
          "flex items-center justify-between px-4 py-3 mx-3 rounded-lg transition-all duration-200 text-sm font-medium group",
          itemIsActive
            ? "bg-blue-50 text-blue-700 shadow-sm border-l-2 border-blue-600"
            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
        )}
        title={item.description}
      >
        <div className="flex items-center space-x-3">
          <div
            className={cn(
              "flex-shrink-0 transition-colors",
              itemIsActive ? "text-blue-600" : "text-gray-500",
            )}
          >
            {item.icon}
          </div>
          <span className="font-medium">{item.title}</span>
        </div>

        {/* Badge */}
        {item.badge && (
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[24px] h-5 shadow-sm">
            {item.badge >= 99 ? "99+" : item.badge}
          </span>
        )}
      </Link>
    );
  };

  // Sidebar Content
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full shadow-sm">
      {/* Header com Logo Lawdesk - ÍCONE DE ESPADA/BALANÇA */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        {/* Logo Lawdesk com ícone de espada */}
        <div className="flex items-center space-x-3">
          {/* Ícone de espada/balança da justiça - RESTAURADO */}
          <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900 dark:text-white">
              Lawdesk
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              CRM Jurídico Moderno
            </p>
          </div>
        </div>

        {/* Close Button - Mobile only */}
        {isMobile && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 overflow-y-auto">
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
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
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
          <div className="relative flex flex-col w-64 max-w-xs bg-white dark:bg-gray-900 shadow-xl">
            <SidebarContent isMobile={true} />
          </div>
        </div>
      )}
    </>
  );
};

export default DefinitiveSidebar;
