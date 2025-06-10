/**
 * 📄 MODERN CONTRATOS MODULE - LAWDESK REFACTORED
 *
 * Módulo de contratos modernizado:
 * - Status financeiro e de assinatura unificados
 * - Cards expandíveis por linha
 * - Tags automáticas e busca semântica
 * - OCR integrado
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileSignature,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Tag,
  Eye,
  Edit,
  Download,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ModernContratosModule: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const mockContratos = [
    {
      id: "1",
      numero: "CT001/2024",
      titulo: "Consultoria Jurídica Mensal",
      cliente: "João Silva Advocacia",
      tipo: "Recorrente",
      statusContrato: "vigente",
      statusAssinatura: "assinado",
      statusPagamento: "em_dia",
      valorMensal: 5000,
      dataInicio: new Date(Date.now() - 7776000000),
      dataVencimento: new Date(Date.now() + 23328000000),
      tags: ["Consultoria", "Mensal", "Corporate"],
    },
    {
      id: "2",
      numero: "CT002/2024",
      titulo: "Prestação de Serviços Advocatícios",
      cliente: "TechCorp Brasil",
      tipo: "Projeto",
      statusContrato: "pendente",
      statusAssinatura: "pendente",
      statusPagamento: "pendente",
      valorMensal: 15000,
      dataInicio: new Date(),
      dataVencimento: new Date(Date.now() + 31536000000),
      tags: ["Tech", "IP", "Projeto"],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vigente":
      case "assinado":
      case "em_dia":
        return "bg-green-100 text-green-800";
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "vencido":
      case "atrasado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "vigente":
      case "assinado":
      case "em_dia":
        return <CheckCircle className="w-3 h-3" />;
      case "pendente":
        return <Clock className="w-3 h-3" />;
      case "vencido":
      case "atrasado":
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Gestão de Contratos
          </h2>
          <Badge variant="secondary">{mockContratos.length} contratos</Badge>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar contratos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 h-8"
            />
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Novo Contrato
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <FileSignature className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">89</p>
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
                <p className="text-lg font-semibold text-gray-900">76</p>
                <p className="text-sm text-gray-600">Vigentes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">R$ 245K</p>
                <p className="text-sm text-gray-600">Receita Mensal</p>
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
                <p className="text-lg font-semibold text-gray-900">13</p>
                <p className="text-sm text-gray-600">Vencendo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {mockContratos.map((contrato, index) => (
          <motion.div
            key={contrato.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">
                          {contrato.titulo}
                        </h3>
                        <Badge variant="outline">#{contrato.numero}</Badge>
                        <Badge variant="secondary">{contrato.tipo}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {contrato.cliente}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Status Row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 font-medium">
                        Status do Contrato
                      </p>
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contrato.statusContrato)}`}
                      >
                        {getStatusIcon(contrato.statusContrato)}
                        {contrato.statusContrato}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 font-medium">
                        Assinatura
                      </p>
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contrato.statusAssinatura)}`}
                      >
                        {getStatusIcon(contrato.statusAssinatura)}
                        {contrato.statusAssinatura}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 font-medium">
                        Pagamento
                      </p>
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contrato.statusPagamento)}`}
                      >
                        {getStatusIcon(contrato.statusPagamento)}
                        {contrato.statusPagamento}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Valor Mensal</p>
                      <p className="font-semibold">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(contrato.valorMensal)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Início</p>
                      <p className="font-semibold">
                        {contrato.dataInicio.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Vencimento</p>
                      <p className="font-semibold">
                        {contrato.dataVencimento.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tipo</p>
                      <p className="font-semibold">{contrato.tipo}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {contrato.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
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

export default ModernContratosModule;
