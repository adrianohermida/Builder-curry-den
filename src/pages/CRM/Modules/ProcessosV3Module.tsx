/**
 * ⚖️ MÓDULO PROCESSOS V3 - MINIMALISTA
 *
 * Gestão de processos jurídicos com foco em:
 * - Timeline de prazos e andamentos
 * - Alertas inteligentes de vencimento
 * - Vinculação automática com clientes
 * - Acompanhamento de status visual
 */

import React from "react";
import { motion } from "framer-motion";
import { FileText, AlertTriangle, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCRMV3 } from "@/hooks/useCRMV3";

const ProcessosV3Module: React.FC = () => {
  const { processos, dashboardStats } = useCRMV3();

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
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {dashboardStats.processos.total}
                </p>
                <p className="text-xs text-gray-600">Total de Processos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {dashboardStats.processos.ativos}
                </p>
                <p className="text-xs text-gray-600">Processos Ativos</p>
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
                  {dashboardStats.processos.urgentes}
                </p>
                <p className="text-xs text-gray-600">Urgentes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {dashboardStats.processos.prazoHoje}
                </p>
                <p className="text-xs text-gray-600">Prazo Hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de processos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Processos em Andamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {processos.map((processo) => (
              <div
                key={processo.id}
                className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm text-gray-900">
                      {processo.titulo}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      #{processo.numero}
                    </Badge>
                    <Badge
                      variant={
                        processo.prioridade === "urgente"
                          ? "destructive"
                          : processo.prioridade === "alta"
                            ? "default"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {processo.prioridade}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Responsável: {processo.advogadoResponsavel}
                  </p>
                  {processo.proximoPrazo && (
                    <p className="text-xs text-orange-600 mt-1">
                      Próximo prazo:{" "}
                      {processo.proximoPrazo.toLocaleDateString("pt-BR")}
                    </p>
                  )}
                </div>

                {processo.alertas > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {processo.alertas} alertas
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProcessosV3Module;
