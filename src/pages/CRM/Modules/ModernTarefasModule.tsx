/**
 * ✅ MODERN TAREFAS MODULE - LAWDESK REFACTORED
 *
 * Módulo de tarefas modernizado:
 * - Kanban por status otimizado
 * - Filtros por tipo e responsável
 * - Tracking de produtividade
 * - Alertas de prazos
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ModernTarefasModule: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const mockTarefas = [
    {
      id: "1",
      titulo: "Preparar documentação para audiência",
      tipo: "juridica",
      prioridade: "alta",
      status: "andamento",
      prazo: new Date(Date.now() + 86400000),
      responsavel: "Dr. Carlos",
      cliente: "João Silva Advocacia",
      processo: "001/2024",
      tempoEstimado: 4,
    },
    {
      id: "2",
      titulo: "Follow-up proposta comercial",
      tipo: "comercial",
      prioridade: "media",
      status: "pendente",
      prazo: new Date(Date.now() + 259200000),
      responsavel: "Ana Santos",
      cliente: "TechCorp Brasil",
      tempoEstimado: 1,
    },
  ];

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "juridica":
        return "bg-blue-100 text-blue-800";
      case "comercial":
        return "bg-green-100 text-green-800";
      case "administrativa":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "urgente":
        return "bg-red-100 text-red-800";
      case "alta":
        return "bg-orange-100 text-orange-800";
      case "media":
        return "bg-yellow-100 text-yellow-800";
      case "baixa":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluida":
        return "bg-green-100 text-green-800";
      case "andamento":
        return "bg-blue-100 text-blue-800";
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "cancelada":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Gestão de Tarefas
          </h2>
          <Badge variant="secondary">{mockTarefas.length} tarefas</Badge>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar tarefas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 h-8"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-1" />
            Filtros
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">142</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">34</p>
                <p className="text-sm text-gray-600">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">8</p>
                <p className="text-sm text-gray-600">Atrasadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">100</p>
                <p className="text-sm text-gray-600">Concluídas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {mockTarefas.map((tarefa, index) => (
          <motion.div
            key={tarefa.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-grow">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">
                          {tarefa.titulo}
                        </h3>
                        <Badge className={getTipoColor(tarefa.tipo)}>
                          {tarefa.tipo}
                        </Badge>
                        <Badge
                          className={getPrioridadeColor(tarefa.prioridade)}
                        >
                          {tarefa.prioridade}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {tarefa.responsavel}
                        </div>
                        {tarefa.cliente && (
                          <span>Cliente: {tarefa.cliente}</span>
                        )}
                        {tarefa.processo && (
                          <span>Processo: #{tarefa.processo}</span>
                        )}
                      </div>
                    </div>

                    <Badge className={getStatusColor(tarefa.status)}>
                      {tarefa.status}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Prazo</p>
                      <p
                        className={`font-semibold ${
                          tarefa.prazo < new Date()
                            ? "text-red-600"
                            : "text-gray-900"
                        }`}
                      >
                        {tarefa.prazo.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tempo Estimado</p>
                      <p className="font-semibold">{tarefa.tempoEstimado}h</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tipo</p>
                      <p className="font-semibold capitalize">{tarefa.tipo}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Prioridade</p>
                      <p className="font-semibold capitalize">
                        {tarefa.prioridade}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      Marcar Concluída
                    </Button>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      Comentar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ModernTarefasModule;
