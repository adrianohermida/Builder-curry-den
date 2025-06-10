/**
 * 🚀 CRM JURÍDICO SAAS - NÚCLEO CENTRAL ESCALÁVEL V2
 *
 * Sistema CRM moderno e escalável para gestão jurídica completa
 * - Gestão de Clientes com Pipeline de Vendas
 * - Processos Integrados com Publicações
 * - Tarefas Jurídicas Inteligentes
 * - Financeiro com Metas e Conversões
 * - Documentos Contextuais por Cliente/Processo
 * - IA para Recomendações e Oportunidades
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
  Target,
  Zap,
  Brain,
  MessageSquare,
  Eye,
  Grid3X3,
  List,
  Kanban,
  PieChart,
  ArrowUpRight,
  AlertCircle,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Importar módulos especializados
import { ClientesSaaSModule } from "./Modules/ClientesSaaSModule";
import { PublicacoesModule } from "./Modules/PublicacoesModule";
// Usar módulos existentes como fallback temporário
import { ProcessosModule as ProcessosIntegradosModule } from "./Modules/ProcessosModule";
import { TarefasClienteModule as TarefasJuridicasModule } from "./Modules/TarefasClienteModule";
import { FinanceiroModule as FinanceiroSaaSModule } from "./Modules/FinanceiroModule";
import { GEDVinculadoModule as DocumentosIntegradosModule } from "./Modules/GEDVinculadoModule";

// Hook principal
import { useCRMSaaS } from "@/hooks/useCRMSaaS";

// Tipos principais
export type CRMSaaSModule =
  | "dashboard"
  | "clientes"
  | "processos"
  | "publicacoes"
  | "tarefas"
  | "financeiro"
  | "documentos";

export type ViewMode = "list" | "kanban" | "cards" | "timeline";

interface CRMJuridicoSaaSProps {
  defaultModule?: CRMSaaSModule;
  className?: string;
}

// Configuração dos módulos
const MODULES_CONFIG = {
  dashboard: {
    title: "Dashboard",
    icon: BarChart3,
    description: "Visão geral e métricas",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  clientes: {
    title: "Clientes & Leads",
    icon: Users,
    description: "Pipeline de vendas e relacionamento",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  processos: {
    title: "Processos & Publicações",
    icon: Scale,
    description: "Acompanhamento integrado",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  publicacoes: {
    title: "Publicações",
    icon: BookOpen,
    description: "Diário oficial e prazos",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  tarefas: {
    title: "Tarefas Jurídicas",
    icon: CheckSquare,
    description: "Workflow inteligente",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  financeiro: {
    title: "Vendas & Contratos",
    icon: DollarSign,
    description: "Metas e conversões",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  documentos: {
    title: "Documentos",
    icon: FolderOpen,
    description: "Gestão contextual",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
} as const;

export default function CRMJuridicoSaaS({
  defaultModule = "dashboard",
  className,
}: CRMJuridicoSaaSProps) {
  // Estados principais
  const [activeModule, setActiveModule] =
    useState<CRMSaaSModule>(defaultModule);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAIRecommendations, setShowAIRecommendations] = useState(true);

  // Hook principal
  const {
    dashboardStats,
    aiRecommendations,
    opportunities,
    notifications,
    loading,
    error,
    refreshData,
  } = useCRMSaaS();

  // Atualização automática
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshData]);

  // Dashboard stats consolidadas
  const consolidatedStats = useMemo(
    () => ({
      totalClients: dashboardStats.clientes?.total || 0,
      activeLeads: dashboardStats.clientes?.leads || 0,
      activeProcesses: dashboardStats.processos?.ativos || 0,
      pendingTasks: dashboardStats.tarefas?.pendentes || 0,
      monthlyRevenue: dashboardStats.financeiro?.receitaMensal || 0,
      conversionRate: dashboardStats.financeiro?.taxaConversao || 0,
      documentsCount: dashboardStats.documentos?.total || 0,
      opportunitiesValue: opportunities.reduce(
        (acc, opp) => acc + opp.valor,
        0,
      ),
    }),
    [dashboardStats, opportunities],
  );

  // Renderizar módulo ativo
  const renderActiveModule = () => {
    const moduleProps = {
      searchQuery,
      viewMode,
      onNotification: (message: string) => toast.success(message),
      className: "animate-in fade-in-0 duration-200",
    };

    switch (activeModule) {
      case "dashboard":
        return renderDashboard();
      case "clientes":
        return <ClientesSaaSModule {...moduleProps} />;
      case "processos":
        return <ProcessosIntegradosModule {...moduleProps} />;
      case "publicacoes":
        return <PublicacoesModule {...moduleProps} />;
      case "tarefas":
        return <TarefasJuridicasModule {...moduleProps} />;
      case "financeiro":
        return <FinanceiroSaaSModule {...moduleProps} />;
      case "documentos":
        return <DocumentosIntegradosModule {...moduleProps} />;
      default:
        return renderDashboard();
    }
  };

  // Dashboard principal
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Métricas principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Clientes</p>
                <p className="text-lg font-semibold">
                  {consolidatedStats.totalClients}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Leads</p>
                <p className="text-lg font-semibold">
                  {consolidatedStats.activeLeads}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Processos</p>
                <p className="text-lg font-semibold">
                  {consolidatedStats.activeProcesses}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Tarefas</p>
                <p className="text-lg font-semibold">
                  {consolidatedStats.pendingTasks}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Receita</p>
                <p className="text-lg font-semibold">
                  R$ {(consolidatedStats.monthlyRevenue / 1000).toFixed(0)}k
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Conversão</p>
                <p className="text-lg font-semibold">
                  {consolidatedStats.conversionRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recomendações de IA */}
      {showAIRecommendations && aiRecommendations.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <Brain className="w-5 h-5" />
              <span>Recomendações Inteligentes</span>
              <Badge className="bg-blue-200 text-blue-800">IA</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiRecommendations.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white rounded-lg p-4 border border-blue-200"
                >
                  <div className="flex items-start space-x-3">
                    <Zap className="w-4 h-4 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {rec.titulo}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {rec.descricao}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <Badge className="text-xs">
                          {rec.prioridade} prioridade
                        </Badge>
                        <Button size="sm" variant="outline" className="text-xs">
                          Executar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Oportunidades detectadas */}
      {opportunities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-600" />
              <span>Oportunidades Detectadas</span>
              <Badge className="bg-green-100 text-green-800">
                R$ {(consolidatedStats.opportunitiesValue / 1000).toFixed(0)}k
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {opportunities.slice(0, 5).map((opp) => (
                <div
                  key={opp.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                    <div>
                      <h4 className="font-medium text-sm">{opp.titulo}</h4>
                      <p className="text-xs text-gray-600">{opp.descricao}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">
                      R$ {opp.valor.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {opp.probabilidade}% prob.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className={cn("min-h-screen bg-gray-50", className)}>
      {/* Header compacto */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo e título */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  CRM Jurídico SaaS
                </h1>
                <p className="text-xs text-gray-500">
                  Núcleo Central Escalável v2
                </p>
              </div>
            </div>

            {/* Controles principais */}
            <div className="flex items-center space-x-3">
              {/* Busca global */}
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
                  <Kanban className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className="h-7 px-2"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>

              {/* IA Recommendations */}
              <Button
                variant={showAIRecommendations ? "default" : "outline"}
                size="sm"
                onClick={() => setShowAIRecommendations(!showAIRecommendations)}
                className="h-9 relative"
              >
                <Brain className="w-4 h-4 mr-2" />
                IA
                {aiRecommendations.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-blue-500">
                    {aiRecommendations.length}
                  </Badge>
                )}
              </Button>

              {/* Notificações */}
              <Button
                variant="outline"
                size="sm"
                className="relative h-9"
                onClick={() => setShowNotifications(!showNotifications)}
              >
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

      {/* Navegação por tabs minimalista */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-4">
          <Tabs
            value={activeModule}
            onValueChange={(value) => setActiveModule(value as CRMSaaSModule)}
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
      <div className="flex h-[calc(100vh-140px)]">
        {/* Módulo ativo */}
        <div className="flex-1 overflow-hidden p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderActiveModule()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Painel de notificações (quando ativo) */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white border-l border-gray-200 overflow-hidden"
            >
              <div className="p-4 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Notificações</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNotifications(false)}
                  >
                    ×
                  </Button>
                </div>
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium">
                          {notif.titulo}
                        </span>
                        <span className="text-xs text-gray-500">
                          {notif.tempo}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{notif.mensagem}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
