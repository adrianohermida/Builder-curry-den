/**
 * 📄 MÓDULO CONTRATOS V3 - MINIMALISTA
 *
 * Gestão de contratos com foco em:
 * - Acompanhamento de vigência e renovações
 * - Alertas de vencimento automáticos
 * - Métricas de receita recorrente
 * - Status visual intuitivo
 */

import React from "react";
import { motion } from "framer-motion";
import { Building, Calendar, DollarSign, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCRMV3 } from "@/hooks/useCRMV3";

const ContratosV3Module: React.FC = () => {
  const { contratos, dashboardStats } = useCRMV3();

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
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {dashboardStats.contratos.total}
                </p>
                <p className="text-xs text-gray-600">Total de Contratos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 0,
                  }).format(dashboardStats.contratos.valorMensalTotal)}
                </p>
                <p className="text-xs text-gray-600">Receita Mensal</p>
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
                  {dashboardStats.contratos.vencendoEm30Dias}
                </p>
                <p className="text-xs text-gray-600">Vencem em 30 dias</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <RefreshCw className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {dashboardStats.contratos.taxaRenovacao}%
                </p>
                <p className="text-xs text-gray-600">Taxa de Renovação</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de contratos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Contratos Vigentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {contratos.map((contrato) => (
              <div
                key={contrato.id}
                className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm text-gray-900">
                      {contrato.tipo}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      #{contrato.numero}
                    </Badge>
                    <Badge
                      variant={
                        contrato.status === "vigente"
                          ? "default"
                          : contrato.status === "vencido"
                            ? "destructive"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {contrato.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-xs text-gray-600">
                      Valor:{" "}
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(contrato.valorMensal)}
                      /mês
                    </p>
                    <p className="text-xs text-gray-600">
                      Vencimento:{" "}
                      {contrato.dataVencimento.toLocaleDateString("pt-BR")}
                    </p>
                    {contrato.renovacaoAutomatica && (
                      <Badge variant="outline" className="text-xs">
                        Renovação Automática
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContratosV3Module;
