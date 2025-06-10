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
  Bell,
  Bookmark,
  Clock,
  AlertTriangle,
  Target,
  BookOpen,
  Award,
  Zap,
  ArrowLeft,
  Upload,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useCRM, ModuloCRM } from "@/hooks/useCRM";

// Importar submódulos
import ClientesModule from "./Clientes";
import ProcessosModule from "./Processos";
import ContratosModule from "./Contratos";
import AgendaJuridica from "@/pages/Agenda";

interface CRMDashboardProps {
  onNavigateToModule?: (modulo: ModuloCRM) => void;
}

// Componente de Métricas do Dashboard
const MetricaCard: React.FC<{
  metrica: {
    titulo: string;
    valor: string;
    change: string;
    icone: React.ComponentType<any>;
    cor: string;
    bgCor: string;
    meta?: number;
    atual?: number;
  };
  index: number;
}> = ({ metrica, index }) => {
  const Icone = metrica.icone;
  const progressoMeta =
    metrica.meta && metrica.atual ? (metrica.atual / metrica.meta) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {metrica.titulo}
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {metrica.valor}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">
                    {metrica.change}
                  </span>
                </div>
                <span className="text-sm text-gray-500">vs mês anterior</span>
              </div>
              {metrica.meta && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Meta mensal</span>
                    <span>{Math.round(progressoMeta)}%</span>
                  </div>
                  <Progress value={progressoMeta} className="h-2" />
                </div>
              )}
            </div>
            <div
              className={`p-3 rounded-lg ${metrica.bgCor} group-hover:scale-110 transition-transform`}
            >
              <Icone className={`h-6 w-6 ${metrica.cor}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Componente de Alertas e Notificações
const AlertasSection: React.FC = () => {
  const alertas = [
    {
      tipo: "urgente",
      titulo: "Prazos vencendo hoje",
      descricao: "3 processos com prazos vencendo nas próximas 2 horas",
      icone: AlertTriangle,
      cor: "text-red-600",
      bgCor: "bg-red-50",
      tempo: "há 30 min",
    },
    {
      tipo: "importante",
      titulo: "Audiências agendadas",
      descricao: "2 audiências marcadas para amanhã",
      icone: Calendar,
      cor: "text-amber-600",
      bgCor: "bg-amber-50",
      tempo: "há 1 hora",
    },
    {
      tipo: "info",
      titulo: "Novos documentos",
      descricao: "5 documentos adicionados ao GED hoje",
      icone: BookOpen,
      cor: "text-blue-600",
      bgCor: "bg-blue-50",
      tempo: "há 2 horas",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Alertas e Notificações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alertas.map((alerta, index) => {
            const Icone = alerta.icone;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg ${alerta.bgCor} hover:shadow-sm transition-shadow cursor-pointer`}
              >
                <div className="flex items-start gap-3">
                  <Icone className={`h-5 w-5 mt-0.5 ${alerta.cor}`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {alerta.titulo}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {alerta.descricao}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {alerta.tempo}
                      </span>
                      <Button size="sm" variant="ghost" className="h-6 px-2">
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <Button variant="outline" size="sm" className="w-full mt-4">
          Ver todas as notificações
        </Button>
      </CardContent>
    </Card>
  );
};

// Componente de Progresso de Metas
const ProgressoMetas: React.FC = () => {
  const metas = [
    {
      titulo: "Novos Clientes",
      atual: 23,
      meta: 30,
      cor: "bg-blue-500",
      periodo: "Este mês",
    },
    {
      titulo: "Processos Fechados",
      atual: 15,
      meta: 20,
      cor: "bg-green-500",
      periodo: "Este mês",
    },
    {
      titulo: "Receita Líquida",
      atual: 280000,
      meta: 400000,
      cor: "bg-purple-500",
      periodo: "Este mês",
      isValor: true,
    },
    {
      titulo: "Satisfação Cliente",
      atual: 4.7,
      meta: 5.0,
      cor: "bg-yellow-500",
      periodo: "Média mensal",
      isRating: true,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Progresso das Metas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metas.map((meta, index) => {
            const progresso = (meta.atual / meta.meta) * 100;
            const valor = meta.isValor
              ? new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(meta.atual)
              : meta.isRating
                ? `${meta.atual}/5.0`
                : meta.atual.toString();

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{meta.titulo}</h4>
                    <p className="text-sm text-gray-500">{meta.periodo}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{valor}</p>
                    <p className="text-sm text-gray-500">
                      de{" "}
                      {meta.isValor
                        ? new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(meta.meta)
                        : meta.isRating
                          ? `${meta.meta}/5.0`
                          : meta.meta}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <Progress value={progresso} className="h-3" />
                  <div
                    className={`absolute top-0 left-0 h-3 rounded-full ${meta.cor} transition-all duration-500`}
                    style={{ width: `${Math.min(progresso, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {Math.round(progresso)}% concluído
                  </span>
                  <Badge
                    variant={
                      progresso >= 100
                        ? "default"
                        : progresso >= 70
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {progresso >= 100
                      ? "Concluída"
                      : progresso >= 70
                        ? "No prazo"
                        : "Atenção"}
                  </Badge>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const CRMJuridicoModerno: React.FC<CRMDashboardProps> = ({
  onNavigateToModule,
}) => {
  const { estatisticas, atualizarFiltros, filtros } = useCRM();
  const location = useLocation();
  const navigate = useNavigate();

  const [showDashboard, setShowDashboard] = useState(true);
  const [viewMode, setViewMode] = useState<"lista" | "kanban">("lista");
  const [moduloAtivo, setModuloAtivo] = useState<ModuloCRM>("clientes");

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

  // Métricas do dashboard com metas
  const metricas = [
    {
      titulo: "Total de Clientes",
      valor: estatisticas.totalClientes.toLocaleString(),
      change: "+12%",
      icone: Users,
      cor: "text-blue-600",
      bgCor: "bg-blue-100",
      meta: 150,
      atual: estatisticas.totalClientes,
    },
    {
      titulo: "Processos Ativos",
      valor: estatisticas.processosAtivos.toLocaleString(),
      change: "+8%",
      icone: Scale,
      cor: "text-green-600",
      bgCor: "bg-green-100",
      meta: 50,
      atual: estatisticas.processosAtivos,
    },
    {
      titulo: "Contratos Vigentes",
      valor: estatisticas.contratosVigentes.toLocaleString(),
      change: "+15%",
      icone: FileSignature,
      cor: "text-purple-600",
      bgCor: "bg-purple-100",
      meta: 25,
      atual: estatisticas.contratosVigentes,
    },
    {
      titulo: "Receita Mensal",
      valor: `R$ ${estatisticas.receitaMensal?.toLocaleString() || "0"}`,
      change: "+22%",
      icone: DollarSign,
      cor: "text-emerald-600",
      bgCor: "bg-emerald-100",
      meta: 400000,
      atual: estatisticas.receitaMensal || 0,
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
      acoes: ["Novo cliente", "Importar dados", "Relatório"],
    },
    {
      titulo: "Processos Jurídicos",
      descricao: "Acompanhe andamentos e prazos processuais",
      icone: Scale,
      cor: "text-green-600",
      bgCor: "bg-green-100",
      modulo: "processos" as ModuloCRM,
      total: estatisticas.processosAtivos,
      acoes: ["Novo processo", "Importar planilha", "Prazos"],
    },
    {
      titulo: "Contratos",
      descricao: "Gerencie contratos e assinaturas digitais",
      icone: FileSignature,
      cor: "text-purple-600",
      bgCor: "bg-purple-100",
      modulo: "contratos" as ModuloCRM,
      total: estatisticas.contratosVigentes,
      acoes: ["Novo contrato", "Modelos", "Assinaturas"],
    },
    {
      titulo: "Agenda Jurídica",
      descricao: "Compromissos, audiências e prazos",
      icone: Calendar,
      cor: "text-orange-600",
      bgCor: "bg-orange-100",
      modulo: "agenda" as ModuloCRM,
      total: "15 hoje",
      acoes: ["Nova audiência", "Compromissos", "Sincronizar"],
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
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Item
              </Button>
            </div>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metricas.map((metrica, index) => (
              <MetricaCard
                key={metrica.titulo}
                metrica={metrica}
                index={index}
              />
            ))}
          </div>

          {/* Alertas importantes */}
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertTitle className="text-orange-800">
              Atenção necessária
            </AlertTitle>
            <AlertDescription className="text-orange-700">
              Você tem 3 prazos vencendo hoje e 2 audiências agendadas para
              amanhã.
              <Button
                variant="link"
                className="p-0 h-auto ml-2 text-orange-700 underline"
              >
                Ver detalhes
              </Button>
            </AlertDescription>
          </Alert>

          {/* Grid principal com módulos e informações */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Acesso Rápido aos Módulos */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Acesso Rápido aos Módulos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <Card className="hover:shadow-lg transition-all duration-300 group-hover:scale-105 border-2 hover:border-gray-300">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div
                                  className={`p-3 rounded-lg ${modulo.bgCor} group-hover:scale-110 transition-transform`}
                                >
                                  <Icone className={`h-6 w-6 ${modulo.cor}`} />
                                </div>
                                <Badge
                                  variant="secondary"
                                  className="font-semibold"
                                >
                                  {modulo.total}
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-gray-900 mb-2">
                                {modulo.titulo}
                              </h3>
                              <p className="text-sm text-gray-600 mb-4">
                                {modulo.descricao}
                              </p>
                              <div className="flex flex-col gap-2">
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="w-full"
                                >
                                  Acessar Módulo
                                </Button>
                                <div className="flex flex-wrap gap-1">
                                  {modulo.acoes.slice(0, 2).map((acao) => (
                                    <Button
                                      key={acao}
                                      variant="ghost"
                                      size="sm"
                                      className="text-xs h-6 px-2 text-gray-600 hover:text-gray-900"
                                    >
                                      {acao}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar com alertas e metas */}
            <div className="space-y-6">
              <AlertasSection />
              <ProgressoMetas />
            </div>
          </div>

          {/* Atividades Recentes e Agenda */}
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
                      icone: Users,
                      cor: "text-blue-600",
                    },
                    {
                      acao: "Processo atualizado",
                      detalhes: "Processo 1234567-89.2024.8.26.0001",
                      tempo: "há 4 horas",
                      tipo: "processo",
                      icone: Scale,
                      cor: "text-green-600",
                    },
                    {
                      acao: "Contrato assinado",
                      detalhes: "Contrato de prestação de serviços",
                      tempo: "há 1 dia",
                      tipo: "contrato",
                      icone: FileSignature,
                      cor: "text-purple-600",
                    },
                    {
                      acao: "Audiência agendada",
                      detalhes: "Audiência de conciliação - 25/01/2024",
                      tempo: "há 2 dias",
                      tipo: "agenda",
                      icone: Calendar,
                      cor: "text-orange-600",
                    },
                  ].map((atividade, index) => {
                    const IconeAtividade = atividade.icone;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className={`p-2 rounded-lg bg-gray-100`}>
                          <IconeAtividade
                            className={`h-4 w-4 ${atividade.cor}`}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {atividade.acao}
                          </p>
                          <p className="text-xs text-gray-600">
                            {atividade.detalhes}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {atividade.tempo}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Ver todas as atividades
                </Button>
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
                      cor: "bg-blue-100 text-blue-800",
                    },
                    {
                      hora: "14:30",
                      evento: "Audiência de Conciliação",
                      cliente: "Maria Silva",
                      tipo: "audiencia",
                      cor: "bg-green-100 text-green-800",
                    },
                    {
                      hora: "16:00",
                      evento: "Videoconferência",
                      cliente: "Empresa XYZ",
                      tipo: "video",
                      cor: "bg-purple-100 text-purple-800",
                    },
                    {
                      hora: "17:00",
                      evento: "Prazo para recurso",
                      cliente: "Carlos Oliveira",
                      tipo: "prazo",
                      cor: "bg-red-100 text-red-800",
                    },
                  ].map((evento, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div className="text-sm font-mono text-gray-600 w-12 text-center">
                        {evento.hora}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {evento.evento}
                        </p>
                        <p className="text-xs text-gray-600">
                          {evento.cliente}
                        </p>
                      </div>
                      <Badge className={evento.cor}>{evento.tipo}</Badge>
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
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-2xl font-bold text-gray-900">CRM Jurídico</h1>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
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
                    <ContratosModule />
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
