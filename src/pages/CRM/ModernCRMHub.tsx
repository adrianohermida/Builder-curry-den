/**
 * 🎯 MODERN CRM HUB - LAWDESK REFACTORED
 *
 * Core do CRM modernizado inspirado em HubSpot/Notion:
 * - Abas fixas com transições rápidas
 * - Widget de indicadores unificado
 * - Layout limpo e focado
 * - Performance otimizada
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Scale,
  FileSignature,
  Calendar,
  DollarSign,
  FolderOpen,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnifiedIndicators from "@/components/CRM/UnifiedIndicators";
import ModernClientesModule from "./Modules/ModernClientesModule";
import ModernProcessosModule from "./Modules/ModernProcessosModule";
import ModernContratosModule from "./Modules/ModernContratosModule";
import ModernTarefasModule from "./Modules/ModernTarefasModule";
import ModernFinanceiroModule from "./Modules/ModernFinanceiroModule";
import ModernDocumentosModule from "./Modules/ModernDocumentosModule";

export type CRMModule =
  | "clientes"
  | "processos"
  | "contratos"
  | "tarefas"
  | "financeiro"
  | "documentos";

interface ModernCRMHubProps {
  defaultModule?: CRMModule;
}

interface TabConfig {
  id: CRMModule;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  badge?: number;
  component: React.ComponentType;
}

const ModernCRMHub: React.FC<ModernCRMHubProps> = ({
  defaultModule = "clientes",
}) => {
  const [activeModule, setActiveModule] = useState<CRMModule>(defaultModule);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showIndicators, setShowIndicators] = useState(true);

  // Tab configuration
  const tabs: TabConfig[] = [
    {
      id: "clientes",
      label: "Clientes",
      icon: <Users className="w-4 h-4" />,
      shortcut: "⌘1",
      badge: 247,
      component: ModernClientesModule,
    },
    {
      id: "processos",
      label: "Processos",
      icon: <Scale className="w-4 h-4" />,
      shortcut: "⌘2",
      badge: 156,
      component: ModernProcessosModule,
    },
    {
      id: "contratos",
      label: "Contratos",
      icon: <FileSignature className="w-4 h-4" />,
      shortcut: "⌘3",
      badge: 89,
      component: ModernContratosModule,
    },
    {
      id: "tarefas",
      label: "Tarefas",
      icon: <Calendar className="w-4 h-4" />,
      shortcut: "⌘4",
      badge: 142,
      component: ModernTarefasModule,
    },
    {
      id: "financeiro",
      label: "Financeiro",
      icon: <DollarSign className="w-4 h-4" />,
      shortcut: "⌘5",
      component: ModernFinanceiroModule,
    },
    {
      id: "documentos",
      label: "Documentos",
      icon: <FolderOpen className="w-4 h-4" />,
      shortcut: "⌘6",
      component: ModernDocumentosModule,
    },
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        const shortcutMap: Record<string, CRMModule> = {
          "1": "clientes",
          "2": "processos",
          "3": "contratos",
          "4": "tarefas",
          "5": "financeiro",
          "6": "documentos",
        };

        const module = shortcutMap[event.key];
        if (module) {
          event.preventDefault();
          setActiveModule(module);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const activeTab = tabs.find((tab) => tab.id === activeModule);
  const ActiveComponent = activeTab?.component || ModernClientesModule;

  const handleMetricClick = (metricId: string) => {
    // Navigate to relevant module based on metric
    const metricModuleMap: Record<string, CRMModule> = {
      clientes: "clientes",
      processos: "processos",
      contratos: "contratos",
      tarefas: "tarefas",
      receita: "financeiro",
      produtividade: "tarefas",
    };

    const targetModule = metricModuleMap[metricId];
    if (targetModule) {
      setActiveModule(targetModule);
    }
  };

  const getQuickActions = (module: CRMModule) => {
    const actionMap = {
      clientes: [
        { label: "Novo Cliente", icon: <Plus className="w-4 h-4" /> },
        { label: "Importar", icon: <Plus className="w-4 h-4" /> },
      ],
      processos: [
        { label: "Novo Processo", icon: <Plus className="w-4 h-4" /> },
        { label: "Vincular Cliente", icon: <Plus className="w-4 h-4" /> },
      ],
      contratos: [
        { label: "Novo Contrato", icon: <Plus className="w-4 h-4" /> },
        { label: "Template", icon: <Plus className="w-4 h-4" /> },
      ],
      tarefas: [
        { label: "Nova Tarefa", icon: <Plus className="w-4 h-4" /> },
        { label: "Lote", icon: <Plus className="w-4 h-4" /> },
      ],
      financeiro: [
        { label: "Nova Cobrança", icon: <Plus className="w-4 h-4" /> },
        { label: "Relatório", icon: <Plus className="w-4 h-4" /> },
      ],
      documentos: [
        { label: "Upload", icon: <Plus className="w-4 h-4" /> },
        { label: "Digitalizar", icon: <Plus className="w-4 h-4" /> },
      ],
    };

    return actionMap[module] || actionMap.clientes;
  };

  return (
    <div
      className={`
      min-h-screen bg-gray-50 transition-all duration-300
      ${isFullScreen ? "fixed inset-0 z-50 bg-white" : ""}
    `}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  CRM Jurídico
                </h1>
                <p className="text-sm text-gray-600">
                  Gestão completa de relacionamentos
                </p>
              </div>

              {/* Search */}
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar clientes, processos, contratos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Quick Actions */}
              {getQuickActions(activeModule).map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={index === 0 ? "default" : "outline"}
                  className="h-8"
                >
                  {action.icon}
                  <span className="ml-1">{action.label}</span>
                </Button>
              ))}

              {/* View Controls */}
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowIndicators(!showIndicators)}
                  className="h-8 w-8 p-0"
                  title="Toggle indicators"
                >
                  <Filter className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="h-8 w-8 p-0"
                  title="Toggle fullscreen"
                >
                  {isFullScreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="More options"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unified Indicators */}
      <AnimatePresence>
        {showIndicators && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 py-4 bg-white border-b border-gray-100"
          >
            <UnifiedIndicators onMetricClick={handleMetricClick} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-[73px] z-30">
        <div className="px-6">
          <Tabs
            value={activeModule}
            onValueChange={(value) => setActiveModule(value as CRMModule)}
            className="w-full"
          >
            <TabsList className="h-12 bg-transparent border-0 p-0 space-x-8">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="
                    relative h-12 px-0 bg-transparent border-0 
                    data-[state=active]:bg-transparent data-[state=active]:shadow-none
                    data-[state=active]:text-blue-600
                    text-gray-600 hover:text-gray-900
                    transition-colors duration-200
                  "
                >
                  <div className="flex items-center gap-2">
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                    {tab.badge && (
                      <span className="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {tab.badge}
                      </span>
                    )}
                    {tab.shortcut && (
                      <span className="ml-1 text-xs text-gray-400 font-mono">
                        {tab.shortcut}
                      </span>
                    )}
                  </div>

                  {/* Active indicator */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    initial={false}
                    animate={{
                      scaleX: activeModule === tab.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ originX: 0.5 }}
                  />
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Tabs value={activeModule} className="h-full">
              {tabs.map((tab) => (
                <TabsContent
                  key={tab.id}
                  value={tab.id}
                  className="mt-0 h-full focus-visible:outline-none"
                >
                  <div className="p-6">
                    <tab.component />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernCRMHub;
