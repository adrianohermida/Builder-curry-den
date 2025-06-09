import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Users,
  Scale,
  DollarSign,
  TrendingUp,
  Calendar,
  FileText,
  CheckSquare,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Bell,
  Star,
  Target,
  Zap,
  Crown,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useViewMode } from "@/contexts/ViewModeContext";
import { cn } from "@/lib/utils";

const Painel: React.FC = () => {
  const navigate = useNavigate();
  const { isAdminMode } = useViewMode();

  const metricas = [
    {
      titulo: "Total Clientes",
      valor: "1,234",
      icone: Users,
      cor: isAdminMode ? "text-red-600" : "text-blue-600",
      bgCor: isAdminMode ? "bg-red-50" : "bg-blue-50",
      mudanca: "+12%",
      tipo: "positiva",
      meta: 1500,
      atual: 1234,
    },
    {
      titulo: "Processos Ativos",
      valor: "892",
      icone: Scale,
      cor: "text-green-600",
      bgCor: "bg-green-50",
      mudanca: "+8%",
      tipo: "positiva",
      meta: 1000,
      atual: 892,
    },
    {
      titulo: "Receita Mensal",
      valor: "R$ 284k",
      icone: DollarSign,
      cor: "text-emerald-600",
      bgCor: "bg-emerald-50",
      mudanca: "+22%",
      tipo: "positiva",
      meta: 300000,
      atual: 284000,
    },
    {
      titulo: "Tarefas Pendentes",
      valor: "47",
      icone: CheckSquare,
      cor: "text-orange-600",
      bgCor: "bg-orange-50",
      mudanca: "-5%",
      tipo: "negativa",
      meta: 30,
      atual: 47,
    },
  ];

  const tarefasRecentes = [
    {
      id: 1,
      titulo: "Revisar contrato João Silva",
      cliente: "João Silva",
      prazo: "2024-01-25",
      prioridade: "alta",
      status: "pendente",
    },
    {
      id: 2,
      titulo: "Audiência Processo 1234567",
      cliente: "Maria Santos",
      prazo: "2024-01-26",
      prioridade: "alta",
      status: "agendada",
    },
    {
      id: 3,
      titulo: "Análise de documentos GED",
      cliente: "Empresa XYZ",
      prazo: "2024-01-27",
      prioridade: "media",
      status: "em_andamento",
    },
    {
      id: 4,
      titulo: "Preparar petição inicial",
      cliente: "Carlos Oliveira",
      prazo: "2024-01-28",
      prioridade: "alta",
      status: "pendente",
    },
  ];

  const atividadesRecentes = [
    {
      id: 1,
      tipo: "cliente",
      descricao: "Novo cliente cadastrado: João Silva",
      tempo: "2 horas atrás",
      icone: Users,
      cor: isAdminMode ? "text-red-600" : "text-blue-600",
    },
    {
      id: 2,
      tipo: "processo",
      descricao: "Processo atualizado: 1234567-89.2024",
      tempo: "4 horas atrás",
      icone: Scale,
      cor: "text-green-600",
    },
    {
      id: 3,
      tipo: "tarefa",
      descricao: "Tarefa concluída: Análise de contrato",
      tempo: "6 horas atrás",
      icone: CheckSquare,
      cor: "text-emerald-600",
    },
    {
      id: 4,
      tipo: "documento",
      descricao: "Documento adicionado ao GED",
      tempo: "1 dia atrás",
      icone: FileText,
      cor: "text-purple-600",
    },
  ];

  const proximosEventos = [
    {
      id: 1,
      titulo: "Reunião com João Silva",
      data: "2024-01-25",
      hora: "14:00",
      tipo: "reuniao",
    },
    {
      id: 2,
      titulo: "Audiência Processo 1234567",
      data: "2024-01-26",
      hora: "10:30",
      tipo: "audiencia",
    },
    {
      id: 3,
      titulo: "Prazo para recurso - Processo 7891011",
      data: "2024-01-27",
      hora: "23:59",
      tipo: "prazo",
    },
  ];

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta":
        return "bg-red-100 text-red-800 border-red-200";
      case "media":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "baixa":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "bg-orange-100 text-orange-800";
      case "em_andamento":
        return "bg-blue-100 text-blue-800";
      case "agendada":
        return "bg-green-100 text-green-800";
      case "concluida":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTipoEventoColor = (tipo: string) => {
    switch (tipo) {
      case "audiencia":
        return "bg-red-100 text-red-800 border-red-200";
      case "reuniao":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "prazo":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Painel de Controle
              </h1>
              {isAdminMode && (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  <Shield className="h-3 w-3" />
                  Admin
                </Badge>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Visão geral das atividades e métricas do seu escritório
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate("/agenda")}>
              <Calendar className="h-4 w-4 mr-2" />
              Ver Agenda
            </Button>
            <Button
              onClick={() => navigate("/crm")}
              className={cn(
                isAdminMode
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700",
              )}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Acessar CRM
            </Button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricas.map((metrica, index) => {
            const Icone = metrica.icone;
            const progresso = metrica.meta
              ? (metrica.atual / metrica.meta) * 100
              : 0;

            return (
              <motion.div
                key={metrica.titulo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          {metrica.titulo}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                          {metrica.valor}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {metrica.tipo === "positiva" ? (
                              <ArrowUpRight className="h-3 w-3 text-green-500" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 text-red-500" />
                            )}
                            <span
                              className={cn(
                                "text-sm font-medium",
                                metrica.tipo === "positiva"
                                  ? "text-green-600"
                                  : "text-red-600",
                              )}
                            >
                              {metrica.mudanca}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            vs mês anterior
                          </span>
                        </div>
                        {metrica.meta && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                              <span>Meta mensal</span>
                              <span>{Math.round(progresso)}%</span>
                            </div>
                            <Progress value={progresso} className="h-2" />
                          </div>
                        )}
                      </div>
                      <div
                        className={cn(
                          "p-3 rounded-lg group-hover:scale-110 transition-transform",
                          metrica.bgCor,
                        )}
                      >
                        <Icone className={cn("h-6 w-6", metrica.cor)} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tarefas Recentes */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  Tarefas Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tarefasRecentes.map((tarefa, index) => (
                    <motion.div
                      key={tarefa.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <div className="flex-shrink-0">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={`https://avatar.vercel.sh/${tarefa.cliente}`}
                          />
                          <AvatarFallback>
                            {tarefa.cliente.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {tarefa.titulo}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Cliente: {tarefa.cliente}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            className={getPrioridadeColor(tarefa.prioridade)}
                          >
                            {tarefa.prioridade}
                          </Badge>
                          <Badge className={getStatusColor(tarefa.status)}>
                            {tarefa.status.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Intl.DateTimeFormat("pt-BR").format(
                            new Date(tarefa.prazo),
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/tarefas")}
                  >
                    Ver Todas as Tarefas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Próximos Eventos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Próximos Eventos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {proximosEventos.map((evento, index) => (
                    <motion.div
                      key={evento.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="text-sm font-mono text-gray-600 dark:text-gray-400 w-12">
                        {evento.hora}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {evento.titulo}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {new Intl.DateTimeFormat("pt-BR").format(
                            new Date(evento.data),
                          )}
                        </p>
                        <Badge
                          className={cn(
                            "mt-1 text-xs",
                            getTipoEventoColor(evento.tipo),
                          )}
                        >
                          {evento.tipo}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => navigate("/agenda")}
                >
                  Ver Agenda Completa
                </Button>
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
                  {atividadesRecentes.map((atividade, index) => {
                    const IconeAtividade = atividade.icone;
                    return (
                      <motion.div
                        key={atividade.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                          <IconeAtividade
                            className={cn("h-4 w-4", atividade.cor)}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {atividade.descricao}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            {atividade.tempo}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Alertas/Notificações */}
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                  Atenção necessária
                </h3>
                <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
                  Você tem 3 prazos vencendo hoje e 2 audiências agendadas para
                  amanhã. Verifique sua agenda para não perder compromissos
                  importantes.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                    onClick={() => navigate("/agenda")}
                  >
                    Ver Agenda
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                    onClick={() => navigate("/tarefas")}
                  >
                    Ver Tarefas
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Painel;
