/**
 * 🏛️ LAWDESK ORIGINAL SIDEBAR RESTAURADO
 *
 * Sidebar original compacto e minimalista com:
 * - Logo correto da Lawdesk
 * - Design limpo e elegante
 * - Navegação organizada por seções
 * - Animações suaves
 * - Compatibilidade com todas as rotas modernas
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  // Workspace Jurídico
  Users,
  Scale,
  CheckSquare,
  FolderOpen,
  FileSignature,
  // Operações
  Calendar,
  FileText,
  MessageCircle,
  // Administração
  BarChart3,
  DollarSign,
  Settings,
  // UI Elements
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Bell,
  Search,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SidebarSection {
  id: string;
  title: string;
  items: SidebarItem[];
  defaultExpanded?: boolean;
}

interface SidebarItem {
  id: string;
  title: string;
  path: string;
  icon: React.ReactNode;
  badge?: number | string;
  isNew?: boolean;
}

interface LawdeskOriginalSidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  onClose?: () => void;
  open?: boolean;
}

export const LawdeskOriginalSidebar: React.FC<LawdeskOriginalSidebarProps> = ({
  collapsed = false,
  onCollapsedChange,
  onClose,
  open = false,
}) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["workspace"]),
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Mock stats
  const mockStats = {
    clientesAtivos: 247,
    processosUrgentes: 12,
    tarefasPendentes: 34,
    compromissosHoje: 5,
    ticketsAbertos: 8,
    notificacoes: 3,
  };

  const sections: SidebarSection[] = [
    {
      id: "workspace",
      title: "Workspace Jurídico",
      defaultExpanded: true,
      items: [
        {
          id: "crm",
          title: "CRM Jurídico",
          path: "/crm-modern",
          icon: <Users className="w-4 h-4" />,
          badge: mockStats.clientesAtivos,
          isNew: true,
        },
        {
          id: "processos",
          title: "Processos",
          path: "/crm-modern/processos",
          icon: <Scale className="w-4 h-4" />,
          badge: mockStats.processosUrgentes,
        },
        {
          id: "tarefas",
          title: "Tarefas",
          path: "/crm-modern/tarefas",
          icon: <CheckSquare className="w-4 h-4" />,
          badge: mockStats.tarefasPendentes,
        },
        {
          id: "documentos",
          title: "Documentos",
          path: "/crm-modern/documentos",
          icon: <FolderOpen className="w-4 h-4" />,
        },
        {
          id: "contratos",
          title: "Contratos",
          path: "/crm-modern/contratos",
          icon: <FileSignature className="w-4 h-4" />,
        },
      ],
    },
    {
      id: "operations",
      title: "Operações",
      items: [
        {
          id: "agenda",
          title: "Agenda",
          path: "/agenda",
          icon: <Calendar className="w-4 h-4" />,
          badge: mockStats.compromissosHoje,
        },
        {
          id: "publicacoes",
          title: "Publicações",
          path: "/publicacoes",
          icon: <FileText className="w-4 h-4" />,
        },
        {
          id: "atendimento",
          title: "Atendimento",
          path: "/atendimento",
          icon: <MessageCircle className="w-4 h-4" />,
          badge: mockStats.ticketsAbertos,
        },
      ],
    },
    {
      id: "administration",
      title: "Administração",
      items: [
        {
          id: "painel",
          title: "Painel",
          path: "/painel",
          icon: <BarChart3 className="w-4 h-4" />,
        },
        {
          id: "financeiro",
          title: "Financeiro",
          path: "/crm-modern/financeiro",
          icon: <DollarSign className="w-4 h-4" />,
        },
        {
          id: "configuracoes",
          title: "Configurações",
          path: "/configuracoes-usuario",
          icon: <Settings className="w-4 h-4" />,
        },
      ],
    },
  ];

  const toggleSection = (sectionId: string) => {
    if (collapsed) return;

    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const filteredSections = searchQuery
    ? sections.map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      }))
    : sections;

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white border-r border-gray-200 flex flex-col h-full shadow-sm"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo Correto da Lawdesk */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg"
              >
                <Scale className="w-5 h-5 text-white" />
              </motion.div>

              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex-grow"
                >
                  <h1 className="font-semibold text-gray-900 text-lg">
                    Lawdesk
                  </h1>
                  <p className="text-xs text-gray-500">
                    Sistema Jurídico Completo
                  </p>
                </motion.div>
              )}
            </div>

            <div className="flex items-center gap-1">
              {!collapsed && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 relative"
                    title="Notificações"
                  >
                    <Bell className="w-4 h-4" />
                    {mockStats.notificacoes > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {mockStats.notificacoes}
                      </span>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCollapsedChange?.(!collapsed)}
                    className="h-8 w-8 p-0"
                    title="Recolher sidebar"
                  >
                    <motion.div
                      animate={{ rotate: collapsed ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  </Button>
                </>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 text-sm bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Quick Actions */}
        {!collapsed && (
          <div className="p-4 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-2">
              <Link to="/crm-modern?action=new-client">
                <Button size="sm" className="h-8 text-xs justify-start w-full">
                  <Plus className="w-3 h-3 mr-1" />
                  Cliente
                </Button>
              </Link>
              <Link to="/crm-modern/processos?action=new-process">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs justify-start w-full"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Processo
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-grow px-4 py-4 space-y-2 overflow-y-auto">
          {filteredSections.map((section) => (
            <div key={section.id} className="space-y-1">
              {/* Section Header */}
              {!collapsed && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleSection(section.id)}
                  className="flex items-center justify-between w-full p-2 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
                >
                  <span>{section.title}</span>
                  <motion.div
                    animate={{
                      rotate: expandedSections.has(section.id) ? 90 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-3 h-3" />
                  </motion.div>
                </motion.button>
              )}

              {/* Section Items */}
              <AnimatePresence>
                {(expandedSections.has(section.id) || collapsed) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1"
                  >
                    {section.items.map((item) => (
                      <Link
                        key={item.id}
                        to={item.path}
                        className="block"
                        title={collapsed ? item.title : undefined}
                      >
                        <motion.div
                          whileHover={{ scale: collapsed ? 1.05 : 1.02, x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200",
                            collapsed ? "justify-center" : "",
                            isActive(item.path)
                              ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                          )}
                        >
                          <div className="flex items-center gap-3 flex-grow min-w-0">
                            {item.icon}
                            {!collapsed && (
                              <span className="text-sm font-medium truncate">
                                {item.title}
                              </span>
                            )}
                          </div>

                          {!collapsed && item.badge && (
                            <Badge
                              variant={
                                typeof item.badge === "number" && item.badge > 0
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="text-xs h-5 px-2"
                            >
                              {item.badge}
                            </Badge>
                          )}

                          {!collapsed && item.isNew && (
                            <motion.span
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="w-2 h-2 bg-blue-500 rounded-full"
                            />
                          )}
                        </motion.div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          {!collapsed ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>v2025.1</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Online</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div
                className="w-2 h-2 bg-green-500 rounded-full"
                title="Sistema Online"
              />
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default LawdeskOriginalSidebar;
