/**
 * 🦄 CRM JURÍDICO UNICORN v1.0
 *
 * Sistema escalável, moderno e inteligente para gestão jurídica SaaS
 * Transformação completa do módulo CRM com arquitetura modular e IA integrada
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
  Zap,
  Brain,
  Bell,
  TrendingUp,
  Calendar,
  Target,
  Activity,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Importar submódulos
import { ClientesModule } from "./Modules/ClientesModule";
import { ProcessosModule } from "./Modules/ProcessosModule";
import { ContratosModule } from "./Modules/ContratosModule";
import { TarefasClienteModule } from "./Modules/TarefasClienteModule";
import { FinanceiroModule } from "./Modules/FinanceiroModule";
import { GEDVinculadoModule } from "./Modules/GEDVinculadoModule";

// Hooks e integrações
import { useCRMUnicorn } from "@/hooks/useCRMUnicorn";
import { useAdviseAPI } from "@/hooks/useAdviseAPI";
import { useStripeIntegration } from "@/hooks/useStripeIntegration";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";

// Tipos principais
export type CRMModule =
  | "clientes"
  | "processos"
  | "contratos"
  | "tarefas"
  | "financeiro"
  | "ged";

interface CRMUnicornProps {
  defaultModule?: CRMModule;
  className?: string;
}

// Configuração dos módulos
const MODULES_CONFIG = {
  clientes: {
    title: "Clientes",
    icon: Users,
    description: "Gestão inteligente de clientes",
    color: "bg-blue-500",
    badge: "CRM",
  },
  processos: {
    title: "Processos",
    icon: Scale,
    description: "Acompanhamento processual",
    color: "bg-purple-500",
    badge: "PROC",
  },
  contratos: {
    title: "Contratos",
    icon: FileText,
    description: "Gestão contratual",
    color: "bg-green-500",
    badge: "DOC",
  },
  tarefas: {
    title: "Tarefas por Cliente",
    icon: CheckSquare,
    description: "Workflow personalizado",
    color: "bg-orange-500",
    badge: "TASK",
  },
  financeiro: {
    title: "Financeiro Individual",
    icon: DollarSign,
    description: "Gestão financeira por cliente",
    color: "bg-emerald-500",
    badge: "FIN",
  },
  ged: {
    title: "GED Vinculado",
    icon: FolderOpen,
    description: "Documentos inteligentes",
    color: "bg-indigo-500",
    badge: "GED",
  },
} as const;

export default function CRMUnicorn({
  defaultModule = "clientes",
  className,
}: CRMUnicornProps) {
  // Estados principais
  const [activeModule, setActiveModule] = useState<CRMModule>(defaultModule);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAIActive, setIsAIActive] = useState(true);

  // Hooks principais
  const { stats, notifications, quickActions, loading, error, refreshData } =
    useCRMUnicorn();

  const {
    recommendations,
    processRecommendations,
    clientInactiveAlerts,
    riskAnalysis,
  } = useAIRecommendations();

  const {
    syncProcessData,
    getClientProcesses,
    loading: adviseLoading,
  } = useAdviseAPI();

  const {
    getClientFinancials,
    createPaymentLink,
    loading: stripeLoading,
  } = useStripeIntegration();

  // Estatísticas em tempo real
  const realTimeStats = useMemo(
    () => ({
      totalClients: stats.clientes.total,
      activeProcesses: stats.processos.ativos,
      contractsValue: stats.contratos.valorTotal,
      pendingTasks: stats.tarefas.pendentes,
      monthlyRevenue: stats.financeiro.receitaMensal,
      documentsCount: stats.ged.totalDocumentos,
    }),
    [stats],
  );

  // Notificações IA
  const aiNotifications = useMemo(
    () => [
      ...clientInactiveAlerts,
      ...processRecommendations,
      ...recommendations,
    ],
    [clientInactiveAlerts, processRecommendations, recommendations],
  );

  // Efeito para sincronização automática
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAIActive) {
        refreshData();
      }
    }, 30000); // Refresh a cada 30 segundos

    return () => clearInterval(interval);
  }, [isAIActive, refreshData]);

  // Renderizar módulo ativo
  const renderActiveModule = () => {
    const moduleProps = {
      searchQuery,
      onNotification: (message: string) => toast.success(message),
      className: "animate-in fade-in-0 duration-300",
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
    <div
      className={cn(
        "min-h-screen bg-background",
        "crm-unicorn-container",
        className,
      )}
    >
      {/* Header Principal */}
      <div className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    CRM Jurídico Unicorn
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Sistema SaaS Inteligente v1.0
                  </p>
                </div>
              </div>

              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                🦄 Modo Unicorn
              </Badge>
            </div>

            {/* Controles principais */}
            <div className="flex items-center space-x-3">
              {/* Busca global */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar em todo o CRM..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>

              {/* IA Toggle */}
              <Button
                variant={isAIActive ? "default" : "outline"}
                size="sm"
                onClick={() => setIsAIActive(!isAIActive)}
                className="relative"
              >
                <Brain className="w-4 h-4 mr-2" />
                IA {isAIActive ? "ON" : "OFF"}
                {aiNotifications.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-red-500">
                    {aiNotifications.length}
                  </Badge>
                )}
              </Button>

              {/* Notificações */}
              <Button variant="outline" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-blue-500">
                    {notifications.length}
                  </Badge>
                )}
              </Button>

              {/* Configurações */}
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navegação por abas */}
          <Tabs
            value={activeModule}
            onValueChange={(value) => setActiveModule(value as CRMModule)}
            className="w-full"
          >
            <TabsList className="grid grid-cols-6 w-full bg-muted/50">
              {Object.entries(MODULES_CONFIG).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="flex items-center space-x-2 relative group"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{config.title}</span>
                    <Badge
                      variant="outline"
                      className="hidden xl:inline-flex h-5 text-xs"
                    >
                      {config.badge}
                    </Badge>

                    {/* Indicador de atividade */}
                    {key === activeModule && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary/10 rounded-md -z-10"
                        initial={false}
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          {[
            {
              title: "Clientes",
              value: realTimeStats.totalClients,
              icon: Users,
              color: "text-blue-600",
            },
            {
              title: "Processos",
              value: realTimeStats.activeProcesses,
              icon: Scale,
              color: "text-purple-600",
            },
            {
              title: "Contratos",
              value: `R$ ${(realTimeStats.contractsValue / 1000).toFixed(0)}k`,
              icon: FileText,
              color: "text-green-600",
            },
            {
              title: "Tarefas",
              value: realTimeStats.pendingTasks,
              icon: CheckSquare,
              color: "text-orange-600",
            },
            {
              title: "Receita",
              value: `R$ ${(realTimeStats.monthlyRevenue / 1000).toFixed(0)}k`,
              icon: TrendingUp,
              color: "text-emerald-600",
            },
            {
              title: "Documentos",
              value: realTimeStats.documentsCount,
              icon: FolderOpen,
              color: "text-indigo-600",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="relative overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className={cn("w-8 h-8", stat.color)} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Conteúdo Principal do Módulo */}
      <div className="container mx-auto px-4 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderActiveModule()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Loading States */}
      {(loading || adviseLoading || stripeLoading) && (
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Sincronizando dados...</span>
            </div>
          </Card>
        </div>
      )}

      {/* Styles específicos */}
      <style jsx>{`
        .crm-unicorn-container {
          --primary: 221.2 83.2% 53.3%;
          --primary-foreground: 210 40% 98%;
        }

        .crm-unicorn-container .client-mode {
          --primary: 221.2 83.2% 53.3%;
        }

        @media (max-width: 768px) {
          .crm-unicorn-container {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
