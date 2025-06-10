/**
 * 🗂️ MODERN SIDEBAR V2 - FULLY INTEGRATED
 *
 * Sidebar modernizada totalmente integrada com:
 * - Seções colapsáveis organizadas logicamente
 * - Rotas atualizadas para sistema moderno
 * - Ícones minimalistas customizados para setor jurídico
 * - Hover para mostrar nomes mantendo interface limpa
 * - Busca integrada e ações rápidas sempre visíveis
 */

import React, { useState, useEffect } from "react";
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
  Gavel,
  Sparkles,
  Plus,
  Search,
  Bell,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SidebarSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: SidebarItem[];
  defaultExpanded?: boolean;
}

interface SidebarItem {
  id: string;
  title: string;
  path: string;
  icon: React.ReactNode;
  badge?: number | string;
  shortcut?: string;
  description?: string;
  isNew?: boolean;
}

interface ModernSidebarV2Props {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export const ModernSidebarV2: React.FC<ModernSidebarV2Props> = ({
  collapsed = false,
  onCollapsedChange,
}) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["workspace", "operations"]),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  // Mock stats - in real app, get from context/API
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
      icon: <Gavel className="w-4 h-4" />,
      defaultExpanded: true,
      items: [
        {
          id: "crm",
          title: "CRM Jurídico",
          path: "/crm-modern",
          icon: <Users className="w-4 h-4" />,
          badge: mockStats.clientesAtivos,
          shortcut: "⌘1",
          description: "Gestão completa de clientes e prospects",
          isNew: true,
        },
        {
          id: "processos",
          title: "Processos",
          path: "/crm-modern/processos",
          icon: <Scale className="w-4 h-4" />,
          badge: mockStats.processosUrgentes,
          shortcut: "⌘2",
          description: "Acompanhamento processual e prazos",
        },
        {
          id: "tarefas",
          title: "Tarefas",
          path: "/crm-modern/tarefas",
          icon: <CheckSquare className="w-4 h-4" />,
          badge: mockStats.tarefasPendentes,
          shortcut: "⌘3",
          description: "Gestão de atividades e produtividade",
        },
        {
          id: "documentos",
          title: "Documentos",
          path: "/crm-modern/documentos",
          icon: <FolderOpen className="w-4 h-4" />,
          shortcut: "⌘4",
          description: "GED inteligente com IA",
        },
        {
          id: "contratos",
          title: "Contratos",
          path: "/crm-modern/contratos",
          icon: <FileSignature className="w-4 h-4" />,
          shortcut: "⌘5",
          description: "Gestão contratual e assinaturas",
        },
      ],
    },
    {
      id: "operations",
      title: "Operações",
      icon: <Calendar className="w-4 h-4" />,
      defaultExpanded: true,
      items: [
        {
          id: "agenda",
          title: "Agenda",
          path: "/agenda",
          icon: <Calendar className="w-4 h-4" />,
          badge: mockStats.compromissosHoje,
          shortcut: "⌘A",
          description: "Compromissos e audiências",
        },
        {
          id: "publicacoes",
          title: "Publicações",
          path: "/publicacoes",
          icon: <FileText className="w-4 h-4" />,
          shortcut: "⌘P",
          description: "Diário oficial e prazos",
        },
        {
          id: "atendimento",
          title: "Atendimento",
          path: "/atendimento",
          icon: <MessageCircle className="w-4 h-4" />,
          badge: mockStats.ticketsAbertos,
          shortcut: "⌘T",
          description: "Suporte e relacionamento",
        },
      ],
    },
    {
      id: "administration",
      title: "Administração",
      icon: <BarChart3 className="w-4 h-4" />,
      items: [
        {
          id: "painel",
          title: "Painel",
          path: "/painel",
          icon: <BarChart3 className="w-4 h-4" />,
          shortcut: "⌘D",
          description: "Analytics e métricas",
        },
        {
          id: "financeiro",
          title: "Financeiro",
          path: "/crm-modern/financeiro",
          icon: <DollarSign className="w-4 h-4" />,
          shortcut: "⌘F",
          description: "Pipeline de cobrança",
        },
        {
          id: "configuracoes",
          title: "Configurações",
          path: "/configuracoes-usuario",
          icon: <Settings className="w-4 h-4" />,
          shortcut: "⌘,",
          description: "Sistema e preferências",
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
        items: section.items.filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      }))
    : sections;

  const showLabels = !collapsed || isHovering;

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 288 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col h-full relative z-50",
        "shadow-sm",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg"
          >
            <Gavel className="w-4 h-4 text-white" />
          </motion.div>

          <AnimatePresence>
            {showLabels && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-grow"
              >
                <h1 className="font-semibold text-gray-900 text-lg">Lawdesk</h1>
                <p className="text-xs text-gray-500">CRM Moderno</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!collapsed && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Notificações"
              >
                <Bell className="w-4 h-4" />
                {mockStats.notificacoes > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs"
                  >
                    {mockStats.notificacoes}
                  </Badge>
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
            </div>
          )}
        </div>

        {/* Search */}
        <AnimatePresence>
          {showLabels && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
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
        </AnimatePresence>
      </div>

      {/* Quick Actions */}
      <AnimatePresence>
        {showLabels && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 border-b border-gray-100"
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
        {filteredSections.map((section) => (
          <div key={section.id} className="space-y-1">
            {/* Section Header */}
            <motion.button
              whileHover={{ scale: collapsed ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleSection(section.id)}
              className={cn(
                "flex items-center gap-3 w-full p-2 rounded-lg transition-all duration-200",
                "hover:bg-gray-50 text-gray-600 hover:text-gray-900",
                collapsed ? "justify-center" : "justify-between",
              )}
              title={collapsed ? section.title : undefined}
            >
              <div className="flex items-center gap-3">
                {section.icon}
                <AnimatePresence>
                  {showLabels && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm font-medium truncate"
                    >
                      {section.title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {!collapsed && (
                <motion.div
                  animate={{
                    rotate: expandedSections.has(section.id) ? 90 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-3 h-3" />
                </motion.div>
              )}
            </motion.button>

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
                      title={collapsed ? item.title : item.description}
                    >
                      <motion.div
                        whileHover={{ scale: collapsed ? 1.05 : 1.02, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-lg transition-all duration-200",
                          collapsed ? "justify-center ml-0" : "ml-4",
                          isActive(item.path)
                            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                        )}
                      >
                        <div className="flex items-center gap-3 flex-grow min-w-0">
                          {item.icon}
                          <AnimatePresence>
                            {showLabels && (
                              <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="text-sm font-medium truncate"
                              >
                                {item.title}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>

                        {!collapsed && item.badge && (
                          <Badge
                            variant={
                              typeof item.badge === "number" && item.badge > 0
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs h-4 px-1.5"
                          >
                            {item.badge}
                          </Badge>
                        )}

                        {item.isNew && !collapsed && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            <Sparkles className="w-3 h-3 text-blue-500" />
                          </motion.div>
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
        <AnimatePresence>
          {showLabels ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Sistema Moderno</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Online</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full h-8 justify-start"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Ajuda & Suporte
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Ajuda & Suporte"
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};

export default ModernSidebarV2;
