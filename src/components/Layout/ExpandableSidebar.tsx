/**
 * 🎯 EXPANDABLE SIDEBAR - SIDEBAR EXPANSÍVEL OTIMIZADO COM SEÇÃO BETA
 *
 * Features implementadas:
 * ✅ Expansão/contração com toggle
 * ✅ Logo "Lawdesk" visível quando expandido
 * ✅ Textos dos menus quando expandido
 * ✅ Performance otimizada (sem framer-motion)
 * ✅ Animações CSS nativas rápidas
 * ✅ Responsivo para mobile
 * ✅ Seção Beta para páginas órfãs (admin only)
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
  MessageCircle,
  BarChart3,
  DollarSign,
  Settings,
  Clock,
  Headphones,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  FlaskConical,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { usePermissions } from "@/hooks/usePermissions";
import { useOrphanDiagnostic } from "@/services/orphanDiagnostic";

interface ExpandableSidebarProps {
  className?: string;
}

interface SidebarItem {
  id: string;
  title: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
  adminOnly?: boolean;
  betaCategory?: string;
}

export const ExpandableSidebar: React.FC<ExpandableSidebarProps> = ({
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [orphanCount, setOrphanCount] = useState(0);
  const location = useLocation();
  const { hasPermission } = usePermissions();
  const { generateReport } = useOrphanDiagnostic();

  // Verificar se é admin
  const isAdmin = hasPermission("admin.sistema");

  // Carregar contagem de órfãos
  useEffect(() => {
    if (isAdmin) {
      try {
        const report = generateReport();
        setOrphanCount(
          report.orphanedPages.length + report.orphanedComponents.length,
        );
      } catch (error) {
        console.error("Erro ao carregar contagem de órfãos:", error);
      }
    }
  }, [isAdmin, generateReport]);

  // Fechar menu mobile quando a rota mudar
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Fechar menu mobile ao clicar fora (ESC)
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
      badge: 247,
    },
    {
      id: "processes",
      title: "Processos",
      path: "/crm-modern/processos",
      icon: <Scale className="w-5 h-5" />,
      badge: 12,
    },
    {
      id: "tasks",
      title: "Tarefas",
      path: "/crm-modern/tarefas",
      icon: <CheckSquare className="w-5 h-5" />,
      badge: 47,
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
      id: "publications",
      title: "Publicações",
      path: "/publicacoes",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: "support",
      title: "Atendimento",
      path: "/atendimento",
      icon: <Headphones className="w-5 h-5" />,
    },
    {
      id: "time",
      title: "Controle de Tempo",
      path: "/tempo",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      id: "settings",
      title: "Configurações",
      path: "/configuracoes-usuario",
      icon: <Settings className="w-5 h-5" />,
    },
    // Seção Beta (apenas para admin)
    ...(isAdmin
      ? [
          {
            id: "beta",
            title: "🧪 Beta",
            path: "/beta",
            icon: <FlaskConical className="w-5 h-5" />,
            badge: orphanCount > 0 ? orphanCount : undefined,
            adminOnly: true,
          },
        ]
      : []),
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // Mobile Menu Button
  const MobileMenuButton = () => (
    <button
      onClick={() => setIsMobileOpen(true)}
      className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      aria-label="Abrir menu"
    >
      <Menu className="w-5 h-5 text-gray-600" />
    </button>
  );

  // Sidebar Content Component
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <TooltipProvider>
      <aside
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col shadow-sm transition-all duration-200 ease-in-out h-full",
          isExpanded ? "w-72" : "w-16",
          isMobile && "w-72", // Mobile sempre expandido
          className,
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Scale className="w-5 h-5 text-white" />
              </div>

              {/* Logo Text - Aparece quando expandido */}
              <div
                className={cn(
                  "transition-all duration-200 ease-in-out overflow-hidden",
                  isExpanded || isMobile
                    ? "w-auto opacity-100"
                    : "w-0 opacity-0",
                )}
              >
                <h1 className="font-bold text-lg text-gray-900 whitespace-nowrap">
                  Lawdesk
                </h1>
                <p className="text-xs text-gray-500 whitespace-nowrap">
                  CRM Jurídico
                </p>
              </div>
            </div>

            {/* Toggle Button - Apenas Desktop */}
            {!isMobile && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                  "p-1.5 rounded-md hover:bg-gray-100 transition-colors",
                  "flex items-center justify-center",
                )}
                aria-label={
                  isExpanded ? "Recolher sidebar" : "Expandir sidebar"
                }
              >
                {isExpanded ? (
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
              </button>
            )}

            {/* Close Button - Apenas Mobile */}
            {isMobile && (
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Fechar menu"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const itemIsActive = isActive(item.path);

            // Filtrar itens admin
            if (item.adminOnly && !isAdmin) {
              return null;
            }

            return (
              <div key={item.id}>
                {!isExpanded && !isMobile ? (
                  // Tooltip para modo compacto
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "relative flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 mx-auto",
                          itemIsActive
                            ? "bg-blue-50 text-blue-600 shadow-sm"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                          item.adminOnly &&
                            "border-2 border-dashed border-purple-300",
                        )}
                      >
                        {item.icon}

                        {/* Badge */}
                        {item.badge && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                            {item.badge > 99 ? "99+" : item.badge}
                          </span>
                        )}

                        {/* Active Indicator */}
                        {itemIsActive && (
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r" />
                        )}

                        {/* Admin Badge */}
                        {item.adminOnly && !item.badge && (
                          <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            <ShieldCheck className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-2">
                      <p className="font-medium">{item.title}</p>
                      {item.badge && (
                        <p className="text-xs text-gray-500">
                          {item.badge} itens
                        </p>
                      )}
                      {item.adminOnly && (
                        <p className="text-xs text-purple-600">
                          Acesso administrativo
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  // Link expandido
                  <Link
                    to={item.path}
                    className={cn(
                      "relative flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group",
                      itemIsActive
                        ? "bg-blue-50 text-blue-600 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                      item.adminOnly &&
                        "border border-purple-200 bg-purple-50/50",
                    )}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {item.icon}
                      <span className="font-medium truncate">{item.title}</span>
                    </div>

                    {/* Badge */}
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-medium min-w-[20px] text-center">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}

                    {/* Admin Badge */}
                    {item.adminOnly && !item.badge && (
                      <span className="ml-auto bg-purple-500 text-white text-xs rounded-full px-2 py-0.5 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Admin
                      </span>
                    )}

                    {/* Active Indicator */}
                    {itemIsActive && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r" />
                    )}
                  </Link>
                )}
              </div>
            );
          })}

          {/* Aviso sobre Beta (quando expandido) */}
          {isAdmin && (isExpanded || isMobile) && (
            <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">
                  Seção Beta
                </span>
              </div>
              <p className="text-xs text-purple-700">
                Páginas e componentes em desenvolvimento ou desconectados.
              </p>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
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
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Sidebar */}
          <div className="relative flex flex-col w-72 max-w-xs bg-white shadow-xl">
            <SidebarContent isMobile={true} />
          </div>
        </div>
      )}
    </>
  );
};

export default ExpandableSidebar;
