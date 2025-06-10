/**
 * ⚖️ MODERN PROCESSOS MODULE - LAWDESK REFACTORED
 *
 * Módulo de processos modernizado:
 * - Timeline de prazos visual
 * - Alertas inteligentes
 * - Status tracking
 * - Vinculação com clientes
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Scale,
  AlertTriangle,
  Calendar,
  User,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Filter,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ModernProcessosModule: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const mockProcessos = [
    {
      id: "1",
      numero: "001/2024",
      titulo: "Ação Trabalhista - Horas Extras",
      cliente: "João Silva Advocacia",
      status: "ativo",
      prioridade: "alta",
      proximoPrazo: new Date(Date.now() + 172800000),
      advogado: "Dr. Carlos",
      alertas: 1,
    },
    {
      id: "2",
      numero: "002/2024",
      titulo: "Revisão Contratual",
      cliente: "TechCorp Brasil",
      status: "ativo",
      prioridade: "media",
      proximoPrazo: new Date(Date.now() + 604800000),
      advogado: "Dra. Ana",
      alertas: 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Processos Jurídicos
          </h2>
          <Badge variant="secondary">{mockProcessos.length} processos</Badge>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar processos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 h-8"
            />
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Novo Processo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Scale className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">156</p>
                <p className="text-sm text-gray-600">Total</p>
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
                <p className="text-lg font-semibold text-gray-900">89</p>
                <p className="text-sm text-gray-600">Ativos</p>
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
                <p className="text-lg font-semibold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Urgentes</p>
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
                <p className="text-lg font-semibold text-gray-900">5</p>
                <p className="text-sm text-gray-600">Prazo Hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Processes List */}
      <div className="space-y-4">
        {mockProcessos.map((processo, index) => (
          <motion.div
            key={processo.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">
                        {processo.titulo}
                      </h3>
                      <Badge variant="outline">#{processo.numero}</Badge>
                      <Badge
                        variant={
                          processo.prioridade === "alta"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {processo.prioridade}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {processo.cliente}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {processo.advogado}
                      </div>
                      {processo.proximoPrazo && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <Calendar className="w-4 h-4" />
                          Prazo: {processo.proximoPrazo.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {processo.alertas > 0 && (
                      <Badge variant="destructive">
                        {processo.alertas} alertas
                      </Badge>
                    )}
                    <Badge
                      variant={
                        processo.status === "ativo" ? "default" : "secondary"
                      }
                    >
                      {processo.status}
                    </Badge>
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

export default ModernProcessosModule;
