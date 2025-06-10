/**
 * ⚖️ CRM JURÍDICO - Sistema de Gestão Jurídica
 *
 * Dashboard principal com design minimalista compacto
 * - Interface clean e responsiva
 * - Visualização em lista configurável
 * - Sistema drag & drop estilo Kanban
 * - Discussões contextuais integradas
 *
 * Submódulos:
 * - Clientes
 * - Processos
 * - Contratos
 * - Tarefas por Cliente
 * - Financeiro Individual
 * - GED Vinculado
 */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Scale,
  FileText,
  CheckSquare,
  DollarSign,
  FolderOpen,
  Search,
  Filter,
  Plus,
  BarChart3,
  Settings,
  Bell,
  TrendingUp,
  Calendar,
  Activity,
  Menu,
  Grid3X3,
  List,
  MessageSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Importar módulos atualizados
import { ClientesModule } from "./Modules/ClientesModule";
import { ProcessosModule } from "./Modules/ProcessosModule";
import { ContratosModule } from "./Modules/ContratosModule";
import { TarefasClienteModule } from "./Modules/TarefasClienteModule";
import { FinanceiroModule } from "./Modules/FinanceiroModule";
import { GEDVinculadoModule } from "./Modules/GEDVinculadoModule";

// Hook principal
import { useCRMJuridico } from "@/hooks/useCRMJuridico";

// Tipos principais
export type CRMModule =
  | "clientes"
  | "processos"
  | "contratos"
  | "tarefas"
  | "financeiro"
  | "ged";

export type ViewMode = "list" | "kanban" | "grid";

interface CRMJuridicoProps {
  defaultModule?: CRMModule;
  className?: string;
}

// Configuração dos módulos
const MODULES_CONFIG = {
  clientes: {
    title: "Clientes",
    icon: Users,
    description: "Gestão de clientes",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  processos: {
    title: "Processos",
    icon: Scale,
    description: "Acompanhamento processual",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  contratos: {
    title: "Contratos",
    icon: FileText,
    description: "Gestão contratual",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  tarefas: {
    title: "Tarefas",
    icon: CheckSquare,
    description: "Workflow por cliente",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  financeiro: {
    title: "Financeiro",
    icon: DollarSign,
    description: "Gestão financeira",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  ged: {
    title: "Documentos",
    icon: FolderOpen,
    description: "Gestão documental",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
} as const;

export default function CRMJuridico({
  defaultModule = "clientes",
  className,
}: CRMJuridicoProps) {
  // Estados principais
  const [activeModule, setActiveModule] = useState<CRMModule>(defaultModule);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [showDiscussions, setShowDiscussions] = useState(false);

  // Hook principal
  const { stats, notifications, loading, error, refreshData } =
    useCRMJuridico();

  // Estatísticas em tempo real
  const realTimeStats = useMemo(
    () => ({
      totalClients: stats.clientes?.total || 0,
      activeProcesses: stats.processos?.ativos || 0,
      contractsValue: stats.contratos?.valorTotal || 0,
      pendingTasks: stats.tarefas?.pendentes || 0,
      monthlyRevenue: stats.financeiro?.receitaMensal || 0,
      documentsCount: stats.ged?.totalDocumentos || 0,
    }),
    [stats],
  );

  // Atualização automática
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshData]);

  // Renderizar módulo ativo
  const renderActiveModule = () => {
    const moduleProps = {
      searchQuery,
      viewMode,
      onNotification: (message: string) => toast.success(message),
      className: "animate-in fade-in-0 duration-200",
    };

    switch (activeModule) {
      case "clientes":
        return <ClientesModule {...moduleProps} />;
      case "processos":
        return <ProcessosModule {...moduleProps} />;
      case "contratos":
        return <ContratosModule {...moduleProps} />;
      case "tarefas":
        return <TarefasClienteModule {...moduleProps} />;
      case "financeiro":
        return <FinanceiroModule {...moduleProps} />;
      case "ged":
        return <GEDVinculadoModule {...moduleProps} />;
      default:
        return <ClientesModule {...moduleProps} />;
    }
  };

  return (
    <div className={cn("min-h-screen bg-gray-50", className)}>
      {/* Header compacto */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo e título compactos */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  CRM Jurídico
                </h1>
              </div>
            </div>

            {/* Busca global compacta */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 h-9"
                />
              </div>

              {/* Controles de visualização */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-7 px-2"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "kanban" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("kanban")}
                  className="h-7 px-2"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>

              {/* Discussões */}
              <Button
                variant={showDiscussions ? "default" : "outline"}
                size="sm"
                onClick={() => setShowDiscussions(!showDiscussions)}
                className="h-9 relative"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Discussões
              </Button>

              {/* Notificações */}
              <Button variant="outline" size="sm" className="relative h-9">
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500">
                    {notifications.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas compactas */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="grid grid-cols-6 gap-4">
          <Card className="border-0 shadow-none">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Clientes</p>
                  <p className="font-semibold text-sm">
                    {realTimeStats.totalClients}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-none">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <Scale className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500">Processos</p>
                  <p className="font-semibold text-sm">
                    {realTimeStats.activeProcesses}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-none">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Contratos</p>
                  <p className="font-semibold text-sm">
                    R$ {(realTimeStats.contractsValue / 1000).toFixed(0)}k
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-none">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-4 h-4 text-orange-600" />
                <div>
                  <p className="text-xs text-gray-500">Tarefas</p>
                  <p className="font-semibold text-sm">
                    {realTimeStats.pendingTasks}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-none">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-500">Receita</p>
                  <p className="font-semibold text-sm">
                    R$ {(realTimeStats.monthlyRevenue / 1000).toFixed(0)}k
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-none">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <FolderOpen className="w-4 h-4 text-indigo-600" />
                <div>
                  <p className="text-xs text-gray-500">Documentos</p>
                  <p className="font-semibold text-sm">
                    {realTimeStats.documentsCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navegação por tabs minimalista */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-4">
          <Tabs
            value={activeModule}
            onValueChange={(value) => setActiveModule(value as CRMModule)}
          >
            <TabsList className="h-12 bg-transparent border-0 p-0 space-x-0">
              {Object.entries(MODULES_CONFIG).map(([key, config]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="h-12 px-4 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none bg-transparent"
                >
                  <config.icon className="w-4 h-4 mr-2" />
                  <span className="text-sm">{config.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex h-[calc(100vh-180px)]">
        {/* Módulo ativo */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderActiveModule()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Painel de discussões (quando ativo) */}
        <AnimatePresence>
          {showDiscussions && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white border-l border-gray-200 overflow-hidden"
            >
              <div className="p-4 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Discussões</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDiscussions(false)}
                  >
                    ×
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          JS
                        </span>
                      </div>
                      <span className="text-sm font-medium">João Silva</span>
                      <span className="text-xs text-gray-500">há 2min</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Precisa revisar o contrato do cliente ABC antes da
                      reunião.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          MS
                        </span>
                      </div>
                      <span className="text-sm font-medium">Maria Santos</span>
                      <span className="text-xs text-gray-500">há 5min</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Cliente solicitou alteração na cláusula 5.2.
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Digite sua mensagem..."
                      className="h-9"
                    />
                    <Button size="sm" className="h-9">
                      Enviar
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
