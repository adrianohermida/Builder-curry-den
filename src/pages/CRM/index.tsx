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
import ContratosEnhanced from "./Contratos/ContratosEnhanced";
import AgendaJuridica from "@/pages/Agenda";

interface CRMDashboardProps {
  onNavigateToModule?: (modulo: ModuloCRM) => void;
}

const CRMJuridicoModerno: React.FC<CRMDashboardProps> = ({
  onNavigateToModule,
}) => {
  const {
    estatisticas,
    atualizarFiltros,
    filtros,
    moduloAtivo,
    setModuloAtivo,
  } = useCRM();
  const location = useLocation();
  const navigate = useNavigate();

  const [showDashboard, setShowDashboard] = useState(true);
  const [viewMode, setViewMode] = useState<"lista" | "kanban">("lista");

  // Determinar módulo ativo com base na URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/clientes")) {
      setModuloAtivo("clientes");
      setShowDashboard(false);
    } else if (path.includes("/processos")) {
      setModuloAtivo("processos");
      setShowDashboard(false);
    } else if (path.includes("/contratos")) {
      setModuloAtivo("contratos");
      setShowDashboard(false);
    } else if (path.includes("/agenda")) {
      setModuloAtivo("agenda" as ModuloCRM);
      setShowDashboard(false);
    } else {
      setShowDashboard(true);
    }
  }, [location.pathname, setModuloAtivo]);

  // Métricas do dashboard
  const metricas = [
    {
      titulo: "Total de Clientes",
      valor: estatisticas.totalClientes.toLocaleString(),
      change: "+12%",
      icone: Users,
      cor: "text-blue-600",
      bgCor: "bg-blue-100",
    },
    {
      titulo: "Processos Ativos",
      valor: estatisticas.processosAtivos.toLocaleString(),
      change: "+8%",
      icone: Scale,
      cor: "text-green-600",
      bgCor: "bg-green-100",
    },
    {
      titulo: "Contratos Vigentes",
      valor: estatisticas.contratosVigentes.toLocaleString(),
      change: "+15%",
      icone: FileSignature,
      cor: "text-purple-600",
      bgCor: "bg-purple-100",
    },
    {
      titulo: "Receita Mensal",
      valor: `R$ ${estatisticas.receitaMensal.toLocaleString()}`,
      change: "+22%",
      icone: DollarSign,
      cor: "text-emerald-600",
      bgCor: "bg-emerald-100",
    },
  ];

  // Módulos de acesso rápido
  const modulosRapidos = [
    {
      titulo: "Gestão de Clientes",
      descricao: "Gerencie informações e relacionamentos com clientes",
      icone: Users,
      cor: "text-blue-600",
      bgCor: "bg-blue-100",
      modulo: "clientes" as ModuloCRM,
      total: estatisticas.totalClientes,
    },
    {
      titulo: "Processos Jurídicos",
      descricao: "Acompanhe andamentos e prazos processuais",
      icone: Scale,
      cor: "text-green-600",
      bgCor: "bg-green-100",
      modulo: "processos" as ModuloCRM,
      total: estatisticas.processosAtivos,
    },
    {
      titulo: "Contratos",
      descricao: "Gerencie contratos e assinaturas digitais",
      icone: FileSignature,
      cor: "text-purple-600",
      bgCor: "bg-purple-100",
      modulo: "contratos" as ModuloCRM,
      total: estatisticas.contratosVigentes,
    },
    {
      titulo: "Agenda Jurídica",
      descricao: "Compromissos, audiências e prazos",
      icone: Calendar,
      cor: "text-orange-600",
      bgCor: "bg-orange-100",
      modulo: "agenda" as ModuloCRM,
      total: "15 hoje",
    },
  ];

  const handleModuleChange = (modulo: ModuloCRM) => {
    setModuloAtivo(modulo);
    setShowDashboard(false);

    // Navegar para a URL correspondente
    const modulePaths = {
      clientes: "/crm/clientes",
      processos: "/crm/processos",
      contratos: "/crm/contratos",
      agenda: "/agenda",
    };

    if (modulePaths[modulo]) {
      navigate(modulePaths[modulo]);
    }
  };

  const handleBackToDashboard = () => {
    setShowDashboard(true);
    navigate("/crm");
  };

  // Dashboard principal
  if (showDashboard) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CRM Jurídico</h1>
              <p className="text-gray-600 mt-1">
                Gerencie clientes, processos, contratos e agenda de forma
                integrada
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {modulosRapidos.map((modulo, index) => {
                  const Icone = modulo.icone;
                  return (
                    <motion.div
                      key={modulo.titulo}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="group cursor-pointer"
                      onClick={() => handleModuleChange(modulo.modulo)}
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
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Atividades Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      acao: "Novo cliente cadastrado",
                      detalhes: "Maria Silva - Direito Civil",
                      tempo: "há 2 horas",
                      tipo: "cliente",
                    },
                    {
                      acao: "Processo atualizado",
                      detalhes: "Processo 1234567-89.2024.8.26.0001",
                      tempo: "há 4 horas",
                      tipo: "processo",
                    },
                    {
                      acao: "Contrato assinado",
                      detalhes: "Contrato de prestação de serviços",
                      tempo: "há 1 dia",
                      tipo: "contrato",
                    },
                    {
                      acao: "Audiência agendada",
                      detalhes: "Audiência de conciliação - 25/01/2024",
                      tempo: "há 2 dias",
                      tipo: "agenda",
                    },
                  ].map((atividade, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {atividade.acao}
                        </p>
                        <p className="text-xs text-gray-600">
                          {atividade.detalhes}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {atividade.tempo}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Agenda de Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      hora: "09:00",
                      evento: "Reunião com cliente",
                      cliente: "João Santos",
                      tipo: "reuniao",
                    },
                    {
                      hora: "14:30",
                      evento: "Audiência de Conciliação",
                      cliente: "Maria Silva",
                      tipo: "audiencia",
                    },
                    {
                      hora: "16:00",
                      evento: "Videoconferência",
                      cliente: "Empresa XYZ",
                      tipo: "video",
                    },
                    {
                      hora: "17:00",
                      evento: "Prazo para recurso",
                      cliente: "Carlos Oliveira",
                      tipo: "prazo",
                    },
                  ].map((evento, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-sm font-mono text-gray-600 w-12">
                        {evento.hora}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {evento.evento}
                        </p>
                        <p className="text-xs text-gray-600">
                          {evento.cliente}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          evento.tipo === "audiencia"
                            ? "border-blue-200 text-blue-600"
                            : evento.tipo === "prazo"
                              ? "border-red-200 text-red-600"
                              : "border-gray-200 text-gray-600"
                        }`}
                      >
                        {evento.tipo}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => handleModuleChange("agenda" as ModuloCRM)}
                >
                  Ver Agenda Completa
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Módulos específicos
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="space-y-6">
          {/* Header da visualização do módulo */}
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
            <TabsList className="grid w-full max-w-lg grid-cols-4">
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
              <TabsTrigger value="agenda" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Agenda
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
                    <ContratosEnhanced />
                  </TabsContent>

                  <TabsContent value="agenda" className="mt-0">
                    <AgendaJuridica />
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
