/**
 * 🏛️ PAINEL DE CONTROLE - DASHBOARD PRINCIPAL
 *
 * Dashboard principal do Lawdesk CRM exatamente como na imagem:
 * ✅ Métricas principais (Clientes, Processos, Receita, Tarefas)
 * ✅ Layout de três colunas
 * ✅ Design tradicional e limpo
 * ✅ Responsivo
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Scale,
  DollarSign,
  CheckSquare,
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
  FileText,
  MessageCircle,
} from "lucide-react";

export default function PainelControle() {
  const metricas = {
    clientes: 1234,
    processos: 892,
    receita: 284000,
    tarefas: 47,
  };

  const tarefasRecentes = [
    {
      id: 1,
      titulo: "Revisar contrato ABC Corp",
      cliente: "ABC Corporation",
      prazo: "Hoje",
      prioridade: "alta",
      progresso: 75,
    },
    {
      id: 2,
      titulo: "Petição inicial - Caso Silva",
      cliente: "João Silva",
      prazo: "Amanhã",
      prioridade: "media",
      progresso: 30,
    },
    {
      id: 3,
      titulo: "Audiência - Processo 123/2024",
      cliente: "Maria Santos",
      prazo: "2 dias",
      prioridade: "alta",
      progresso: 90,
    },
    {
      id: 4,
      titulo: "Análise de documentos XYZ",
      cliente: "XYZ Ltda",
      prazo: "3 dias",
      prioridade: "baixa",
      progresso: 10,
    },
  ];

  const atividades = [
    {
      id: 1,
      acao: "Novo cliente cadastrado",
      usuario: "Dr. João Silva",
      tempo: "5 min atrás",
      tipo: "cliente",
    },
    {
      id: 2,
      acao: "Processo atualizado",
      usuario: "Dra. Maria Santos",
      tempo: "15 min atrás",
      tipo: "processo",
    },
    {
      id: 3,
      acao: "Documento enviado",
      usuario: "Dr. Pedro Costa",
      tempo: "1h atrás",
      tipo: "documento",
    },
    {
      id: 4,
      acao: "Reunião agendada",
      usuario: "Secretária Ana",
      tempo: "2h atrás",
      tipo: "agenda",
    },
  ];

  const proximosEventos = [
    {
      id: 1,
      titulo: "Audiência - Caso Silva vs ABC",
      data: "Hoje, 14:00",
      local: "1ª Vara Cível",
      tipo: "audiencia",
    },
    {
      id: 2,
      titulo: "Reunião com cliente XYZ",
      data: "Amanhã, 10:00",
      local: "Escritório",
      tipo: "reuniao",
    },
    {
      id: 3,
      titulo: "Prazo para recurso",
      data: "23/12/2024",
      local: "TRF 3ª Região",
      tipo: "prazo",
    },
    {
      id: 4,
      titulo: "Vencimento de contrato",
      data: "25/12/2024",
      local: "Cliente ABC Corp",
      tipo: "vencimento",
    },
  ];

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta":
        return "bg-red-100 text-red-800";
      case "media":
        return "bg-yellow-100 text-yellow-800";
      case "baixa":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "cliente":
        return <Users className="w-4 h-4" />;
      case "processo":
        return <Scale className="w-4 h-4" />;
      case "documento":
        return <FileText className="w-4 h-4" />;
      case "agenda":
        return <Calendar className="w-4 h-4" />;
      case "audiencia":
        return <Scale className="w-4 h-4 text-blue-600" />;
      case "reuniao":
        return <MessageCircle className="w-4 h-4 text-green-600" />;
      case "prazo":
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case "vencimento":
        return <Clock className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Painel de Controle
          </h1>
          <p className="text-gray-600 mt-1">
            Visão geral do seu escritório jurídico
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Última atualização: {new Date().toLocaleString("pt-BR")}
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Clientes */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes</p>
              <p className="text-3xl font-bold text-gray-900">
                {metricas.clientes.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+12% este mês</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        {/* Processos */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processos</p>
              <p className="text-3xl font-bold text-gray-900">
                {metricas.processos.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+8% este mês</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Scale className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        {/* Receita */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita</p>
              <p className="text-3xl font-bold text-gray-900">
                R$ {(metricas.receita / 1000).toFixed(0)}k
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+15% este mês</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        {/* Tarefas */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tarefas</p>
              <p className="text-3xl font-bold text-gray-900">
                {metricas.tarefas}
              </p>
              <div className="flex items-center mt-2">
                <AlertCircle className="w-4 h-4 text-orange-600 mr-1" />
                <span className="text-sm text-orange-600">
                  {Math.floor(metricas.tarefas * 0.3)} urgentes
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Seção Principal - Três Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tarefas Recentes */}
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-orange-600" />
              Tarefas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-4">
              {tarefasRecentes.map((tarefa) => (
                <div
                  key={tarefa.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {tarefa.titulo}
                    </h4>
                    <Badge className={getPrioridadeColor(tarefa.prioridade)}>
                      {tarefa.prioridade}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Cliente: {tarefa.cliente}
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">
                      Prazo: {tarefa.prazo}
                    </span>
                    <span className="text-xs text-gray-500">
                      {tarefa.progresso}%
                    </span>
                  </div>
                  <Progress value={tarefa.progresso} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Atividades Recentes */}
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-4">
              {atividades.map((atividade) => (
                <div
                  key={atividade.id}
                  className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {getTipoIcon(atividade.tipo)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {atividade.acao}
                    </p>
                    <p className="text-sm text-gray-600">
                      por {atividade.usuario}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {atividade.tempo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Próximos Eventos */}
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-4">
              {proximosEventos.map((evento) => (
                <div
                  key={evento.id}
                  className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {getTipoIcon(evento.tipo)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {evento.titulo}
                    </p>
                    <p className="text-sm text-gray-600">{evento.data}</p>
                    <p className="text-xs text-gray-500 mt-1">{evento.local}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
