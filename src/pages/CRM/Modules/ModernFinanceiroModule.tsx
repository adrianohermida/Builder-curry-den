/**
 * 💰 MODERN FINANCEIRO MODULE - LAWDESK REFACTORED
 *
 * Pipeline de cobrança inspirado em HubSpot:
 * - Kanban: A Receber | Vencendo | Pago | Cancelado
 * - Gráficos integrados em tempo real
 * - Vinculação com contratos ativos
 * - Geração automática de faturas
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  Plus,
  Search,
  Filter,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Invoice {
  id: string;
  numero: string;
  cliente: string;
  valor: number;
  dataVencimento: Date;
  status: "a_receber" | "vencendo" | "pago" | "cancelado";
  contrato?: string;
  servicos: string[];
  metodo?: string;
}

interface PipelineColumn {
  id: string;
  title: string;
  color: string;
  invoices: Invoice[];
}

const ModernFinanceiroModule: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const mockInvoices: Invoice[] = [
    {
      id: "1",
      numero: "FAT-001/2024",
      cliente: "João Silva Advocacia",
      valor: 5000,
      dataVencimento: new Date(Date.now() + 604800000),
      status: "a_receber",
      contrato: "CT001/2024",
      servicos: ["Consultoria Mensal", "Revisão Contratual"],
    },
    {
      id: "2",
      numero: "FAT-002/2024",
      cliente: "TechCorp Brasil",
      valor: 15000,
      dataVencimento: new Date(Date.now() + 259200000),
      status: "vencendo",
      contrato: "CT002/2024",
      servicos: ["Assessoria IP", "Compliance"],
    },
    {
      id: "3",
      numero: "FAT-003/2024",
      cliente: "Construtora ABC",
      valor: 8000,
      dataVencimento: new Date(Date.now() - 86400000),
      status: "pago",
      metodo: "PIX",
      servicos: ["Consultoria Imobiliária"],
    },
  ];

  const pipelineColumns: PipelineColumn[] = [
    {
      id: "a_receber",
      title: "A Receber",
      color: "bg-blue-100 text-blue-800",
      invoices: [],
    },
    {
      id: "vencendo",
      title: "Vencendo",
      color: "bg-orange-100 text-orange-800",
      invoices: [],
    },
    {
      id: "pago",
      title: "Pago",
      color: "bg-green-100 text-green-800",
      invoices: [],
    },
    {
      id: "cancelado",
      title: "Cancelado",
      color: "bg-red-100 text-red-800",
      invoices: [],
    },
  ];

  // Organize invoices by status
  const kanbanColumns = pipelineColumns.map((col) => ({
    ...col,
    invoices: mockInvoices.filter((invoice) => invoice.status === col.id),
  }));

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    // Handle invoice status update
    console.log(
      `Moving invoice ${result.draggableId} to ${result.destination.droppableId}`,
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "a_receber":
        return <Clock className="w-4 h-4" />;
      case "vencendo":
        return <AlertTriangle className="w-4 h-4" />;
      case "pago":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelado":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const renderInvoiceCard = (invoice: Invoice) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-gray-900">#{invoice.numero}</h4>
            <p className="text-sm text-gray-600">{invoice.cliente}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-900">
              {formatCurrency(invoice.valor)}
            </p>
            {invoice.contrato && (
              <p className="text-xs text-gray-500">{invoice.contrato}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Calendar className="w-3 h-3" />
            Vencimento: {invoice.dataVencimento.toLocaleDateString()}
          </div>

          {invoice.metodo && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <CreditCard className="w-3 h-3" />
              {invoice.metodo}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs text-gray-500 font-medium">Serviços:</p>
          <div className="flex flex-wrap gap-1">
            {invoice.servicos.slice(0, 2).map((servico) => (
              <Badge key={servico} variant="outline" className="text-xs">
                {servico}
              </Badge>
            ))}
            {invoice.servicos.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{invoice.servicos.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Pipeline Financeiro
          </h2>
          <Badge variant="secondary">{mockInvoices.length} faturas</Badge>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar faturas..."
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
            Nova Fatura
          </Button>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-emerald-600" />
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
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">+18%</p>
                <p className="text-sm text-gray-600">Crescimento</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">R$ 45K</p>
                <p className="text-sm text-gray-600">A Receber</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">2.3%</p>
                <p className="text-sm text-gray-600">Inadimplência</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Kanban */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {kanbanColumns.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-80">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${column.color}`}
                >
                  {getStatusIcon(column.id)}
                  {column.title}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {column.invoices.length}
                </Badge>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-96 p-2 rounded-lg transition-colors ${
                      snapshot.isDraggingOver
                        ? "bg-blue-50 border-2 border-blue-200 border-dashed"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="space-y-3">
                      {column.invoices.map((invoice, index) => (
                        <Draggable
                          key={invoice.id}
                          draggableId={invoice.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {renderInvoiceCard(invoice)}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>

                    {column.invoices.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Nenhuma fatura</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="justify-start">
              <Plus className="w-4 h-4 mr-2" />
              Gerar Fatura
            </Button>
            <Button variant="outline" className="justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Relatório Mensal
            </Button>
            <Button variant="outline" className="justify-start">
              <CreditCard className="w-4 h-4 mr-2" />
              Configurar Pagamentos
            </Button>
            <Button variant="outline" className="justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernFinanceiroModule;
