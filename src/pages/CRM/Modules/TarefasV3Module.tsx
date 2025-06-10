/**
 * ✅ MÓDULO TAREFAS V3 - MINIMALISTA
 *
 * Gestão de tarefas com foco em:
 * - Kanban por status (Pendente → Concluída)
 * - Classificação por tipo (Jurídica, Comercial, etc.)
 * - Priorização visual inteligente
 * - Tracking de produtividade da equipe
 */

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCRMV3 } from "@/hooks/useCRMV3";

const TarefasV3Module: React.FC = () => {
  const { tarefas, dashboardStats } = useCRMV3();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {dashboardStats.tarefas.total}
                </p>
                <p className="text-xs text-gray-600">Total de Tarefas</p>
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
                <p className="text-sm font-medium text-gray-900">
                  {dashboardStats.tarefas.pendentes}
                </p>
                <p className="text-xs text-gray-600">Pendentes</p>
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
                <p className="text-sm font-medium text-gray-900">
                  {dashboardStats.tarefas.atrasadas}
                </p>
                <p className="text-xs text-gray-600">Atrasadas</p>
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
                <p className="text-sm font-medium text-gray-900">
                  {dashboardStats.tarefas.concluidasHoje}
                </p>
                <p className="text-xs text-gray-600">Concluídas Hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de tarefas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Tarefas em Andamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tarefas.map((tarefa) => (
              <div
                key={tarefa.id}
                className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm text-gray-900">
                      {tarefa.titulo}
                    </h4>
                    <Badge
                      variant={
                        tarefa.tipo === "juridica"
                          ? "default"
                          : tarefa.tipo === "comercial"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-xs"
                    >
                      {tarefa.tipo}
                    </Badge>
                    <Badge
                      variant={
                        tarefa.prioridade === "urgente"
                          ? "destructive"
                          : tarefa.prioridade === "alta"
                            ? "default"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {tarefa.prioridade}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-xs text-gray-600">
                      Responsável: {tarefa.responsavel}
                    </p>
                    <p
                      className={`text-xs ${
                        tarefa.prazo < new Date()
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      Prazo: {tarefa.prazo.toLocaleDateString("pt-BR")}
                    </p>
                    {tarefa.tempoEstimado && (
                      <p className="text-xs text-gray-600">
                        {tarefa.tempoEstimado}h estimadas
                      </p>
                    )}
                  </div>
                </div>

                <Badge
                  variant={
                    tarefa.status === "concluida"
                      ? "default"
                      : tarefa.status === "andamento"
                        ? "secondary"
                        : "outline"
                  }
                  className="text-xs"
                >
                  {tarefa.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TarefasV3Module;
