import React from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Painel: React.FC = () => {
  const metricas = [
    {
      titulo: "Total Clientes",
      valor: "1,234",
      icone: Users,
      cor: "text-blue-600",
      bgCor: "bg-blue-50",
      mudanca: "+12%",
      tipo: "positiva",
    },
    {
      titulo: "Processos Ativos",
      valor: "892",
      icone: Scale,
      cor: "text-green-600",
      bgCor: "bg-green-50",
      mudanca: "+8%",
      tipo: "positiva",
    },
    {
      titulo: "Receita Mensal",
      valor: "R$ 284k",
      icone: DollarSign,
      cor: "text-emerald-600",
      bgCor: "bg-emerald-50",
      mudanca: "+22%",
      tipo: "positiva",
    },
    {
      titulo: "Tarefas Pendentes",
      valor: "47",
      icone: CheckSquare,
      cor: "text-orange-600",
      bgCor: "bg-orange-50",
      mudanca: "-5%",
      tipo: "negativa",
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
  ];

  const atividadesRecentes = [
    {
      id: 1,
      tipo: "cliente",
      descricao: "Novo cliente cadastrado: João Silva",
      tempo: "2 horas atrás",
      icone: Users,
      cor: "text-blue-600",
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
      tipo: "documento",
      descricao: "Documento adicionado ao GED",
      tempo: "6 horas atrás",
      icone: FileText,
      cor: "text-purple-600",
    },
  ];

  const getPrioridadeBadge = (prioridade: string) => {
    const variants = {
      alta: "bg-red-100 text-red-800",
      media: "bg-yellow-100 text-yellow-800",
      baixa: "bg-green-100 text-green-800",
    };
    return variants[prioridade as keyof typeof variants] || variants.baixa;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pendente: "bg-gray-100 text-gray-800",
      em_andamento: "bg-blue-100 text-blue-800",
      agendada: "bg-purple-100 text-purple-800",
      concluida: "bg-green-100 text-green-800",
    };
    return variants[status as keyof typeof variants] || variants.pendente;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel Principal</h1>
          <p className="text-gray-600 mt-2">
            Visão geral das suas atividades e métricas do escritório
          </p>
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {metrica.valor}
                        </p>
                        <div className="flex items-center mt-3">
                          <TrendingUp
                            className={`h-4 w-4 mr-1 ${
                              metrica.tipo === "positiva"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          />
                          <span
                            className={`text-sm font-medium ${
                              metrica.tipo === "positiva"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {metrica.mudanca}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
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

        {/* Layout de duas colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tarefas pendentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Tarefas Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tarefasRecentes.map((tarefa) => (
                  <div
                    key={tarefa.id}
                    className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {tarefa.titulo}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Cliente: {tarefa.cliente}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {new Intl.DateTimeFormat("pt-BR").format(
                            new Date(tarefa.prazo),
                          )}
                        </div>
                        <Badge
                          className={getPrioridadeBadge(tarefa.prioridade)}
                        >
                          {tarefa.prioridade}
                        </Badge>
                        <Badge className={getStatusBadge(tarefa.status)}>
                          {tarefa.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver
                    </Button>
                  </div>
                ))}

                <div className="text-center pt-4">
                  <Button variant="outline" className="w-full">
                    Ver Todas as Tarefas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Atividades recentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Atividades Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {atividadesRecentes.map((atividade) => {
                  const Icone = atividade.icone;
                  return (
                    <div key={atividade.id} className="flex items-start gap-3">
                      <div className={`p-2 rounded-full bg-gray-100`}>
                        <Icone className={`h-4 w-4 ${atividade.cor}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {atividade.descricao}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3" />
                          {atividade.tempo}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="text-center pt-4">
                  <Button variant="outline" className="w-full">
                    Ver Todas as Atividades
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progresso mensal */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Progresso do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Meta de Receita
                  </span>
                  <span className="text-sm text-gray-500">
                    R$ 284k / R$ 300k
                  </span>
                </div>
                <Progress value={94.7} className="h-2" />
                <p className="text-xs text-gray-500">94.7% da meta mensal</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Novos Clientes
                  </span>
                  <span className="text-sm text-gray-500">23 / 30</span>
                </div>
                <Progress value={76.7} className="h-2" />
                <p className="text-xs text-gray-500">76.7% da meta mensal</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Processos Finalizados
                  </span>
                  <span className="text-sm text-gray-500">45 / 50</span>
                </div>
                <Progress value={90} className="h-2" />
                <p className="text-xs text-gray-500">90% da meta mensal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Painel;
