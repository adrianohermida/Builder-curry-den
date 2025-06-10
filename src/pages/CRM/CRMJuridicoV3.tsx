/**
 * 🎯 CRM JURÍDICO V3 MINIMALIA - INTERFACE PRINCIPAL
 *
 * Sistema de CRM minimalista com foco em usabilidade:
 * - Design SaaS 2025 clean e responsivo
 * - Dashboards colapsáveis com métricas unificadas
 * - Filtros rápidos e ações contextuais
 * - Inteligência contextual e automação
 * - Visão 360° do cliente por aba
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  FileText,
  Building,
  Calendar,
  DollarSign,
  FolderOpen,
  ChevronDown,
  ChevronUp,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Brain,
  Target,
  Settings,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCRMV3, CRMV3Module, DashboardStatsV3 } from "@/hooks/useCRMV3";
import QuickActionBar from "@/components/CRM/QuickActionBar";
import StickyFilterBar from "@/components/CRM/StickyFilterBar";
import ClientesV3Module from "./Modules/ClientesV3Module";
import ProcessosV3Module from "./Modules/ProcessosV3Module";
import ContratosV3Module from "./Modules/ContratosV3Module";
import TarefasV3Module from "./Modules/TarefasV3Module";
import FinanceiroV3Module from "./Modules/FinanceiroV3Module";
import DocumentosV3Module from "./Modules/DocumentosV3Module";

interface CRMJuridicoV3Props {
  defaultModule?: CRMV3Module;
}

interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
  trend?: "up" | "down" | "neutral";
  description?: string;
  collapsible?: boolean;
}

const CRMJuridicoV3: React.FC<CRMJuridicoV3Props> = ({
  defaultModule = "dashboard",
}) => {
  const {
    activeModule,
    setActiveModule,
    dashboardStats,
    insights,
    searchQuery,
    setSearchQuery,
    quickFilters,
    toggleQuickFilter,
    clearAllFilters,
  } = useCRMV3();

  const [collapsedCards, setCollapsedCards] = useState<Set<string>>(new Set());
  const [isFullWidth, setIsFullWidth] = useState(false);

  // Inicializar módulo padrão
  useEffect(() => {
    setActiveModule(defaultModule);
  }, [defaultModule, setActiveModule]);

  // Alternar colapso de cards
  const toggleCardCollapse = (cardId: string) => {
    const newCollapsed = new Set(collapsedCards);
    if (newCollapsed.has(cardId)) {
      newCollapsed.delete(cardId);
    } else {
      newCollapsed.add(cardId);
    }
    setCollapsedCards(newCollapsed);
  };

  // Gerar cards de métricas baseados nos dados
  const generateMetricCards = (stats: DashboardStatsV3): MetricCard[] => [
    {
      id: "clientes",
      title: "Clientes",
      value: stats.clientes.total,
      change: stats.clientes.crescimentoMensal,
      icon: <Users className="w-5 h-5" />,
      color: "blue",
      trend: "up",
      description: `${stats.clientes.vips} VIPs, ${stats.clientes.prospects} prospects`,
      collapsible: true,
    },
    {
      id: "processos",
      title: "Processos",
      value: stats.processos.total,
      icon: <FileText className="w-5 h-5" />,
      color: "purple",
      description: `${stats.processos.ativos} ativos, ${stats.processos.urgentes} urgentes`,
      collapsible: true,
    },
    {
      id: "contratos",
      title: "Contratos",
      value: stats.contratos.total,
      change: stats.contratos.taxaRenovacao,
      icon: <Building className="w-5 h-5" />,
      color: "green",
      trend: "up",
      description: `${stats.contratos.vigentes} vigentes`,
      collapsible: true,
    },
    {
      id: "tarefas",
      title: "Tarefas",
      value: stats.tarefas.total,
      icon: <Calendar className="w-5 h-5" />,
      color: "orange",
      description: `${stats.tarefas.pendentes} pendentes, ${stats.tarefas.atrasadas} atrasadas`,
      collapsible: true,
    },
    {
      id: "receita",
      title: "Receita Mensal",
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 0,
      }).format(stats.financeiro.receitaMensal),
      change: stats.financeiro.crescimentoMensal,
      icon: <DollarSign className="w-5 h-5" />,
      color: "emerald",
      trend: "up",
      description: `Ticket médio: ${new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 0,
      }).format(stats.financeiro.ticketMedio)}`,
      collapsible: true,
    },
    {
      id: "documentos",
      title: "Documentos",
      value: stats.documentos.total,
      icon: <FolderOpen className="w-5 h-5" />,
      color: "gray",
      description: `${stats.documentos.pendentes} pendentes de classificação`,
      collapsible: true,
    },
  ];

  const metricCards = generateMetricCards(dashboardStats);

  // Ações rápidas
  const handleQuickAction = (action: string) => {
    switch (action) {
      case "new-client":
        setActiveModule("clientes");
        // TODO: Abrir modal de novo cliente
        break;
      case "new-process":
        setActiveModule("processos");
        // TODO: Abrir modal de novo processo
        break;
      case "new-task":
        setActiveModule("tarefas");
        // TODO: Abrir modal de nova tarefa
        break;
      case "new-contract":
        setActiveModule("contratos");
        // TODO: Abrir modal de novo contrato
        break;
      case "new-invoice":
        setActiveModule("financeiro");
        // TODO: Abrir modal de nova cobrança
        break;
      case "upload-document":
        setActiveModule("documentos");
        // TODO: Abrir modal de upload
        break;
      default:
        console.log("Ação não implementada:", action);
    }
  };

  // Renderizar insights de IA
  const renderInsights = () => {
    if (insights.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-amber-800">
              <Brain className="w-4 h-4" />
              Insights de IA
              <Badge variant="secondary" className="text-xs">
                {insights.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {insights.slice(0, 3).map((insight) => (
                <div
                  key={insight.id}
                  className="flex items-start gap-3 p-3 bg-white rounded-lg border border-amber-200"
                >
                  <div className="flex-shrink-0">
                    {insight.tipo === "oportunidade" && (
                      <Target className="w-4 h-4 text-green-600" />
                    )}
                    {insight.tipo === "risco" && (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                    {insight.tipo === "alerta" && (
                      <Clock className="w-4 h-4 text-orange-600" />
                    )}
                    {insight.tipo === "otimizacao" && (
                      <Zap className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-medium text-sm text-gray-900">
                      {insight.titulo}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {insight.descricao}
                    </p>
                    {insight.acaoSugerida && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 h-6 px-2 text-xs"
                      >
                        {insight.acaoSugerida}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // Renderizar dashboard de métricas
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Insights de IA */}
      {renderInsights()}

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`
                        p-2 rounded-lg
                        ${card.color === "blue" && "bg-blue-100 text-blue-600"}
                        ${card.color === "purple" && "bg-purple-100 text-purple-600"}
                        ${card.color === "green" && "bg-green-100 text-green-600"}
                        ${card.color === "orange" && "bg-orange-100 text-orange-600"}
                        ${card.color === "emerald" && "bg-emerald-100 text-emerald-600"}
                        ${card.color === "gray" && "bg-gray-100 text-gray-600"}
                      `}
                    >
                      {card.icon}
                    </div>
                    <CardTitle className="text-sm font-medium text-gray-700">
                      {card.title}
                    </CardTitle>
                  </div>

                  {card.collapsible && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCardCollapse(card.id)}
                      className="h-6 w-6 p-0"
                    >
                      {collapsedCards.has(card.id) ? (
                        <ChevronDown className="w-3 h-3" />
                      ) : (
                        <ChevronUp className="w-3 h-3" />
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>

              <AnimatePresence>
                {!collapsedCards.has(card.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex items-end gap-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {card.value}
                          </span>
                          {card.change && (
                            <div
                              className={`
                                flex items-center gap-1 text-xs font-medium
                                ${card.trend === "up" ? "text-green-600" : "text-red-600"}
                              `}
                            >
                              <TrendingUp className="w-3 h-3" />
                              {card.change > 0 ? "+" : ""}
                              {card.change}%
                            </div>
                          )}
                        </div>

                        {card.description && (
                          <p className="text-xs text-gray-600">
                            {card.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Resumo de atividades recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <BarChart3 className="w-4 h-4" />
            Atividades Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div className="flex-grow">
                <p className="text-sm font-medium">3 tarefas concluídas hoje</p>
                <p className="text-xs text-gray-600">
                  Produtividade da equipe em alta
                </p>
              </div>
              <span className="text-xs text-gray-500">Agora</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <div className="flex-grow">
                <p className="text-sm font-medium">
                  2 processos com prazo próximo
                </p>
                <p className="text-xs text-gray-600">
                  Requer atenção nos próximos dias
                </p>
              </div>
              <span className="text-xs text-gray-500">2h</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Renderizar módulo ativo
  const renderActiveModule = () => {
    switch (activeModule) {
      case "clientes":
        return <ClientesV3Module />;
      case "processos":
        return <ProcessosV3Module />;
      case "contratos":
        return <ContratosV3Module />;
      case "tarefas":
        return <TarefasV3Module />;
      case "financeiro":
        return <FinanceiroV3Module />;
      case "documentos":
        return <DocumentosV3Module />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com ações rápidas */}
      <div className="bg-white border-b border-gray-200">
        <div
          className={`
          px-6 py-4
          ${isFullWidth ? "max-w-none" : "max-w-7xl mx-auto"}
        `}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                CRM Jurídico
              </h1>
              <p className="text-sm text-gray-600">
                Gestão inteligente e minimalista
              </p>
            </div>

            <div className="flex items-center gap-3">
              <QuickActionBar
                activeModule={activeModule}
                onAction={handleQuickAction}
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullWidth(!isFullWidth)}
                className="h-8 px-3"
                title={isFullWidth ? "Largura normal" : "Largura total"}
              >
                {isFullWidth ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação por abas */}
      <div className="bg-white border-b border-gray-200">
        <div
          className={`
          ${isFullWidth ? "max-w-none px-6" : "max-w-7xl mx-auto px-6"}
        `}
        >
          <Tabs
            value={activeModule}
            onValueChange={(value) => setActiveModule(value as CRMV3Module)}
            className="w-full"
          >
            <TabsList className="h-12 bg-transparent border-0 gap-6">
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none pb-3"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="clientes"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none pb-3"
              >
                <Users className="w-4 h-4 mr-2" />
                Clientes
              </TabsTrigger>
              <TabsTrigger
                value="processos"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none pb-3"
              >
                <FileText className="w-4 h-4 mr-2" />
                Processos
              </TabsTrigger>
              <TabsTrigger
                value="contratos"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none pb-3"
              >
                <Building className="w-4 h-4 mr-2" />
                Contratos
              </TabsTrigger>
              <TabsTrigger
                value="tarefas"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none pb-3"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Tarefas
              </TabsTrigger>
              <TabsTrigger
                value="financeiro"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none pb-3"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Financeiro
              </TabsTrigger>
              <TabsTrigger
                value="documentos"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none pb-3"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Documentos
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Barra de filtros - apenas para módulos específicos */}
      {activeModule !== "dashboard" && (
        <StickyFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          quickFilters={quickFilters}
          onToggleFilter={toggleQuickFilter}
          onClearAll={clearAllFilters}
          placeholder={`Buscar ${activeModule}...`}
        />
      )}

      {/* Conteúdo principal */}
      <div
        className={`
        ${isFullWidth ? "max-w-none px-6" : "max-w-7xl mx-auto px-6"}
        py-6
      `}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderActiveModule()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CRMJuridicoV3;
