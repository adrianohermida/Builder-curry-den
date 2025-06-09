import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  Scale,
  FileSignature,
  BarChart3,
  Grid3X3,
  List,
  Plus,
  Filter,
  Download,
  Search,
  Settings,
  TrendingUp,
  DollarSign,
  Calendar,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCRM, ModuloCRM } from "@/hooks/useCRM";

// Importar submódulos
import ClientesModule from "./Clientes";
import ProcessosModule from "./Processos";
import ContratosModule from "./Contratos";

interface CRMDashboardProps {
  onNavigateToModule?: (modulo: ModuloCRM) => void;
}

const CRMDashboard: React.FC<CRMDashboardProps> = ({ onNavigateToModule }) => {
  const {
    estatisticas,
    atualizarFiltros,
    filtros,
    moduloAtivo,
    setModuloAtivo,
  } = useCRM();
  const location = useLocation();
  const navigate = useNavigate();

  // Detectar módulo ativo baseado na rota
  useEffect(() => {
    const path = location.pathname;

    if (path.includes("/crm/clientes")) {
      setModuloAtivo("clientes");
    } else if (path.includes("/crm/processos")) {
      setModuloAtivo("processos");
    } else if (path.includes("/crm/contratos")) {
      setModuloAtivo("contratos");
    } else if (path === "/crm") {
      // Se estiver na rota base do CRM, redirecionar para processos por padrão
      navigate("/crm/processos", { replace: true });
    }
  }, [location.pathname, setModuloAtivo, navigate]);

  const metricas = [
    {
      titulo: "Total Clientes",
      valor: estatisticas.totalClientes,
      icone: Users,
      cor: "text-blue-600",
      bgCor: "bg-blue-50",
      change: "+12%",
      changeType: "positive",
    },
    {
      titulo: "Processos Ativos",
      valor: estatisticas.processosAtivos,
      icone: Scale,
      cor: "text-green-600",
      bgCor: "bg-green-50",
      change: "+8%",
      changeType: "positive",
    },
    {
      titulo: "Contratos Vigentes",
      valor: estatisticas.contratosVigentes,
      icone: FileSignature,
      cor: "text-purple-600",
      bgCor: "bg-purple-50",
      change: "+15%",
      changeType: "positive",
    },
    {
      titulo: "Receita Total",
      valor: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(estatisticas.receitaTotal),
      icone: DollarSign,
      cor: "text-emerald-600",
      bgCor: "bg-emerald-50",
      change: "+22%",
      changeType: "positive",
    },
  ];

  const modulosRapidos = [
    {
      titulo: "Clientes",
      descricao: "Gestão completa de clientes",
      icone: Users,
      cor: "text-blue-600",
      bgCor: "bg-blue-50",
      modulo: "clientes" as ModuloCRM,
      total: estatisticas.totalClientes,
    },
    {
      titulo: "Processos",
      descricao: "Acompanhamento processual",
      icone: Scale,
      cor: "text-green-600",
      bgCor: "bg-green-50",
      modulo: "processos" as ModuloCRM,
      total: estatisticas.totalProcessos,
    },
    {
      titulo: "Contratos",
      descricao: "Gestão contratual",
      icone: FileSignature,
      cor: "text-purple-600",
      bgCor: "bg-purple-50",
      modulo: "contratos" as ModuloCRM,
      total: estatisticas.totalContratos,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header do Dashboard */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM Jurídico</h1>
          <p className="text-gray-600 mt-1">
            Gestão completa de clientes, processos e contratos
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar em todo o CRM..."
              className="pl-10 w-64"
              value={filtros.busca}
              onChange={(e) => atualizarFiltros({ busca: e.target.value })}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricas.map((metrica, index) => {
          const Icone = metrica.icone;
          return (
            <motion.div
              key={metrica.titulo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {metrica.titulo}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {metrica.valor}
                      </p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                        <span className="text-xs text-green-600 font-medium">
                          {metrica.change}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          vs mês anterior
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${metrica.bgCor}`}>
                      <Icone className={`h-6 w-6 ${metrica.cor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Acesso Rápido aos Módulos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Acesso Rápido aos Módulos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modulosRapidos.map((modulo, index) => {
              const Icone = modulo.icone;
              return (
                <motion.div
                  key={modulo.titulo}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => onNavigateToModule?.(modulo.modulo)}
                >
                  <Card className="hover:shadow-md transition-all group-hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg ${modulo.bgCor}`}>
                          <Icone className={`h-6 w-6 ${modulo.cor}`} />
                        </div>
                        <Badge variant="secondary">{modulo.total}</Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {modulo.titulo}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {modulo.descricao}
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Acessar Módulo
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Atividades Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Atividades Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <div className="p-2 rounded-full bg-blue-100">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Novo cliente cadastrado: João Silva
                </p>
                <p className="text-xs text-gray-500">2 horas atrás</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <div className="p-2 rounded-full bg-green-100">
                <Scale className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Processo atualizado: 1234567-89.2024
                </p>
                <p className="text-xs text-gray-500">4 horas atrás</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <div className="p-2 rounded-full bg-purple-100">
                <FileSignature className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Contrato renovado: CONT-2024-001
                </p>
                <p className="text-xs text-gray-500">1 dia atrás</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const CRMJuridicoModerno: React.FC = () => {
  // Função para mudar módulo via navegação
  const handleModuleChange = (modulo: ModuloCRM) => {
    setModuloAtivo(modulo);
    navigate(`/crm/${modulo}`, { replace: true });

    if (onNavigateToModule) {
      onNavigateToModule(modulo);
    }
  };
  const [showDashboard, setShowDashboard] = useState(true);

  const handleNavigateToModule = (modulo: ModuloCRM) => {
    setModuloAtivo(modulo);
    setShowDashboard(false);
  };

  const handleBackToDashboard = () => {
    setShowDashboard(true);
  };

  if (showDashboard) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <CRMDashboard onNavigateToModule={handleNavigateToModule} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header com navegação entre módulos */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToDashboard}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Voltar ao Dashboard
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-2xl font-bold text-gray-900">CRM Jurídico</h1>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "lista" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("lista")}
              >
                <List className="h-4 w-4 mr-2" />
                Lista
              </Button>
              <Button
                variant={viewMode === "kanban" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("kanban")}
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Kanban
              </Button>
            </div>
          </div>

          {/* Tabs para navegação entre módulos */}
          <Tabs
            value={moduloAtivo}
            onValueChange={(value) => handleModuleChange(value as ModuloCRM)}
            className="mt-6"
          >
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="clientes" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Clientes
              </TabsTrigger>
              <TabsTrigger
                value="processos"
                className="flex items-center gap-2"
              >
                <Scale className="h-4 w-4" />
                Processos
              </TabsTrigger>
              <TabsTrigger
                value="contratos"
                className="flex items-center gap-2"
              >
                <FileSignature className="h-4 w-4" />
                Contratos
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={moduloAtivo}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="clientes" className="mt-0">
                    <ClientesModule />
                  </TabsContent>

                  <TabsContent value="processos" className="mt-0">
                    <ProcessosModule />
                  </TabsContent>

                  <TabsContent value="contratos" className="mt-0">
                    <ContratosModule />
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CRMJuridicoModerno;
