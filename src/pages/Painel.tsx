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
  ChevronRight,
  Eye,
  Plus,
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
      titulo: "Clientes",
      valor: "1,234",
      icone: Users,
      mudanca: "+12%",
      tipo: "positiva",
      meta: 1500,
      atual: 1234,
    },
    {
      titulo: "Processos",
      valor: "892",
      icone: Scale,
      mudanca: "+8%",
      tipo: "positiva",
      meta: 1000,
      atual: 892,
    },
    {
      titulo: "Receita",
      valor: "R$ 284k",
      icone: DollarSign,
      mudanca: "+22%",
      tipo: "positiva",
      meta: 300000,
      atual: 284000,
    },
    {
      titulo: "Tarefas",
      valor: "47",
      icone: CheckSquare,
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
      tempo: "2h",
      icone: Users,
    },
    {
      id: 2,
      tipo: "processo",
      descricao: "Processo atualizado: 1234567-89.2024",
      tempo: "4h",
      icone: Scale,
    },
    {
      id: 3,
      tipo: "tarefa",
      descricao: "Tarefa concluída: Análise de contrato",
      tempo: "6h",
      icone: CheckSquare,
    },
    {
      id: 4,
      tipo: "documento",
      descricao: "Documento adicionado ao GED",
      tempo: "1d",
      icone: FileText,
    },
  ];

  const proximosEventos = [
    {
      id: 1,
      titulo: "Reunião com João Silva",
      data: "25/01",
      hora: "14:00",
      tipo: "reuniao",
    },
    {
      id: 2,
      titulo: "Audiência Processo 1234567",
      data: "26/01",
      hora: "10:30",
      tipo: "audiencia",
    },
    {
      id: 3,
      titulo: "Prazo para recurso",
      data: "27/01",
      hora: "23:59",
      tipo: "prazo",
    },
  ];

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta":
        return "bg-red-50 text-red-700 border-red-200";
      case "media":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "baixa":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "bg-orange-50 text-orange-700";
      case "em_andamento":
        return "bg-blue-50 text-blue-700";
      case "agendada":
        return "bg-green-50 text-green-700";
      case "concluida":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTipoEventoColor = (tipo: string) => {
    switch (tipo) {
      case "audiencia":
        return "bg-red-50 text-red-700 border-red-200";
      case "reuniao":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "prazo":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-6">
        {/* FIXED: Compact Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
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
            <p className="text-muted-foreground text-sm mt-1">
              Visão geral das atividades do escritório
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/agenda")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Agenda
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/crm")}
              className={cn(
                isAdminMode
                  ? "bg-destructive hover:bg-destructive/90"
                  : "bg-primary hover:bg-primary/90",
              )}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              CRM
            </Button>
          </div>
        </div>

        {/* FIXED: Responsive Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <Card className="hover:shadow-md transition-all duration-300 cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {metrica.titulo}
                        </p>
                        <p className="text-2xl font-bold text-foreground mb-2">
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
                        </div>
                        {metrica.meta && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Meta: {metrica.meta.toLocaleString()}</span>
                              <span>{Math.round(progresso)}%</span>
                            </div>
                            <Progress value={progresso} className="h-1" />
                          </div>
                        )}
                      </div>
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icone className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* FIXED: Responsive Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Tarefas Recentes */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Tarefas Recentes</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/tarefas")}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {tarefasRecentes.slice(0, 4).map((tarefa) => (
                <div
                  key={tarefa.id}
                  className="flex items-start justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-foreground truncate">
                      {tarefa.titulo}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {tarefa.cliente} • {tarefa.prazo}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs px-2 py-0.5",
                          getPrioridadeColor(tarefa.prioridade),
                        )}
                      >
                        {tarefa.prioridade}
                      </Badge>
                      <Badge
                        className={cn(
                          "text-xs px-2 py-0.5",
                          getStatusColor(tarefa.status),
                        )}
                      >
                        {tarefa.status}
                      </Badge>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Atividades Recentes */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {atividadesRecentes.map((atividade) => {
                const Icone = atividade.icone;
                return (
                  <div key={atividade.id} className="flex items-start gap-3">
                    <div className="p-1.5 bg-primary/10 rounded-lg flex-shrink-0">
                      <Icone className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        {atividade.descricao}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {atividade.tempo}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Próximos Eventos */}
          <Card className="lg:col-span-2 xl:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Próximos Eventos</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/agenda")}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {proximosEventos.map((evento) => (
                <div
                  key={evento.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-foreground">
                      {evento.titulo}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {evento.data} às {evento.hora}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs px-2 py-0.5 mt-2",
                        getTipoEventoColor(evento.tipo),
                      )}
                    >
                      {evento.tipo}
                    </Badge>
                  </div>
                  <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* FIXED: Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="h-20 flex-col gap-2"
                onClick={() => navigate("/crm/clientes/novo")}
              >
                <Users className="h-5 w-5" />
                <span className="text-xs">Novo Cliente</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2"
                onClick={() => navigate("/crm/processos/novo")}
              >
                <Scale className="h-5 w-5" />
                <span className="text-xs">Novo Processo</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2"
                onClick={() => navigate("/agenda")}
              >
                <Calendar className="h-5 w-5" />
                <span className="text-xs">Agendar</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2"
                onClick={() => navigate("/tarefas")}
              >
                <CheckSquare className="h-5 w-5" />
                <span className="text-xs">Nova Tarefa</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alertas e Notificações */}
        {tarefasRecentes.filter((t) => t.prioridade === "alta").length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-800">
                    Atenção: Tarefas Urgentes
                  </h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Você tem 3 prazos vencendo hoje e 2 audiências agendadas
                    para amanhã. Verifique sua agenda para não perder
                    compromissos importantes.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-orange-800 border-orange-300 hover:bg-orange-100"
                      onClick={() => navigate("/agenda")}
                    >
                      Ver Agenda
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Painel;
