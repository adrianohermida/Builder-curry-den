/**
 * 💰 MÓDULO FINANCEIRO INDIVIDUAL - CRM Jurídico
 *
 * Gestão financeira personalizada por cliente
 * - Integração com Stripe
 * - Análise de inadimplência
 * - Previsões de receita
 * - Cobrança automatizada
 */

import React, { useState, useMemo } from "react";
import {
  DollarSign,
  Plus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  CreditCard,
  Calendar,
  Target,
  PieChart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ConfigurableList,
  ColumnConfig,
  ListItem,
  Discussion,
} from "@/components/CRM/ConfigurableList";

// Tipos específicos
interface FinanceiroCliente {
  id: string;
  clienteId: string;
  cliente: string;
  status: "em_dia" | "atrasado" | "inadimplente" | "suspenso";
  valorMensal: number;
  valorTotal: number;
  valorPago: number;
  valorPendente: number;
  ultimoPagamento: Date;
  proximoVencimento: Date;
  diasAtraso: number;
  metodoPagamento: "boleto" | "cartao" | "pix" | "transferencia";
  scorePagamento: number;
  tendencia: "crescendo" | "estavel" | "declinando";
  observacoes?: string;
  responsavelCobranca: string;
}

interface FinanceiroModuleProps {
  searchQuery?: string;
  viewMode?: "list" | "kanban";
  onNotification?: (message: string) => void;
  className?: string;
}

// Mock data
const MOCK_FINANCEIRO: FinanceiroCliente[] = [
  {
    id: "1",
    clienteId: "1",
    cliente: "João Silva & Associados",
    status: "em_dia",
    valorMensal: 15000,
    valorTotal: 180000,
    valorPago: 165000,
    valorPendente: 15000,
    ultimoPagamento: new Date(Date.now() - 86400000 * 5),
    proximoVencimento: new Date(Date.now() + 86400000 * 25),
    diasAtraso: 0,
    metodoPagamento: "transferencia",
    scorePagamento: 95,
    tendencia: "crescendo",
    responsavelCobranca: "Maria Santos",
  },
  {
    id: "2",
    clienteId: "2",
    cliente: "TechCorp Ltda",
    status: "em_dia",
    valorMensal: 25000,
    valorTotal: 300000,
    valorPago: 275000,
    valorPendente: 25000,
    ultimoPagamento: new Date(Date.now() - 86400000 * 10),
    proximoVencimento: new Date(Date.now() + 86400000 * 20),
    diasAtraso: 0,
    metodoPagamento: "cartao",
    scorePagamento: 88,
    tendencia: "estavel",
    responsavelCobranca: "Carlos Oliveira",
  },
  {
    id: "3",
    clienteId: "3",
    cliente: "Ana Costa",
    status: "atrasado",
    valorMensal: 5000,
    valorTotal: 30000,
    valorPago: 25000,
    valorPendente: 5000,
    ultimoPagamento: new Date(Date.now() - 86400000 * 45),
    proximoVencimento: new Date(Date.now() - 86400000 * 15),
    diasAtraso: 15,
    metodoPagamento: "boleto",
    scorePagamento: 65,
    tendencia: "declinando",
    responsavelCobranca: "João Silva",
  },
  {
    id: "4",
    clienteId: "4",
    cliente: "Pedro Almeida",
    status: "inadimplente",
    valorMensal: 2000,
    valorTotal: 12000,
    valorPago: 6000,
    valorPendente: 6000,
    ultimoPagamento: new Date(Date.now() - 86400000 * 90),
    proximoVencimento: new Date(Date.now() - 86400000 * 60),
    diasAtraso: 60,
    metodoPagamento: "boleto",
    scorePagamento: 25,
    tendencia: "declinando",
    responsavelCobranca: "Ana Silva",
  },
];

// Configuração das colunas
const DEFAULT_COLUMNS: ColumnConfig[] = [
  { key: "cliente", label: "Cliente", visible: true, sortable: true },
  { key: "status", label: "Status", visible: true, sortable: true },
  { key: "valorMensal", label: "Valor Mensal", visible: true, sortable: true },
  { key: "valorPendente", label: "Pendente", visible: true, sortable: true },
  {
    key: "proximoVencimento",
    label: "Vencimento",
    visible: true,
    sortable: true,
  },
  { key: "scorePagamento", label: "Score", visible: true, sortable: true },
  {
    key: "responsavelCobranca",
    label: "Responsável",
    visible: true,
    sortable: true,
  },
  { key: "diasAtraso", label: "Dias Atraso", visible: false, sortable: true },
  { key: "tendencia", label: "Tendência", visible: false, sortable: true },
  { key: "metodoPagamento", label: "Método", visible: false, sortable: true },
];

export const FinanceiroModule: React.FC<FinanceiroModuleProps> = ({
  searchQuery = "",
  viewMode = "list",
  onNotification,
  className,
}) => {
  const [financeiro, setFinanceiro] =
    useState<FinanceiroCliente[]>(MOCK_FINANCEIRO);
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [filterTendencia, setFilterTendencia] = useState<string>("todos");

  // Filtrar dados financeiros
  const filteredFinanceiro = useMemo(() => {
    return financeiro.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.responsavelCobranca
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === "todos" || item.status === filterStatus;

      const matchesTendencia =
        filterTendencia === "todos" || item.tendencia === filterTendencia;

      return matchesSearch && matchesStatus && matchesTendencia;
    });
  }, [financeiro, searchQuery, filterStatus, filterTendencia]);

  // Converter para formato da lista
  const listItems: ListItem[] = useMemo(() => {
    return filteredFinanceiro.map((item) => {
      const diasParaVencimento = Math.ceil(
        (item.proximoVencimento.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      );

      return {
        id: item.id,
        status: item.status,
        data: {
          cliente: item.cliente,
          status: getStatusLabel(item.status),
          valorMensal: `R$ ${item.valorMensal.toLocaleString()}`,
          valorPendente: `R$ ${item.valorPendente.toLocaleString()}`,
          proximoVencimento: `${item.proximoVencimento.toLocaleDateString()} (${diasParaVencimento}d)`,
          scorePagamento: `${item.scorePagamento}%`,
          responsavelCobranca: item.responsavelCobranca,
          diasAtraso: item.diasAtraso.toString(),
          tendencia: getTendenciaLabel(item.tendencia),
          metodoPagamento: getMetodoLabel(item.metodoPagamento),
          valorTotal: `R$ ${item.valorTotal.toLocaleString()}`,
          valorPago: `R$ ${item.valorPago.toLocaleString()}`,
          ultimoPagamento: item.ultimoPagamento.toLocaleDateString(),
        },
        discussions: [
          {
            id: "1",
            author: item.responsavelCobranca,
            message: "Aguardando confirmação de pagamento",
            timestamp: new Date(),
            internal: true,
          },
        ],
      };
    });
  }, [filteredFinanceiro]);

  // Status columns para Kanban
  const statusColumns = ["em_dia", "atrasado", "inadimplente", "suspenso"];

  // Handlers
  const handleItemUpdate = (item: ListItem) => {
    const updatedFinanceiro = financeiro.map((fin) => {
      if (fin.id === item.id) {
        return { ...fin, status: item.status as FinanceiroCliente["status"] };
      }
      return fin;
    });
    setFinanceiro(updatedFinanceiro);
    onNotification?.("Status financeiro atualizado");
  };

  const handleDiscussion = (
    itemId: string,
    discussion: Omit<Discussion, "id" | "timestamp">,
  ) => {
    onNotification?.("Discussão adicionada ao financeiro");
  };

  // Estatísticas
  const stats = useMemo(() => {
    const receitaTotal = financeiro.reduce(
      (acc, item) => acc + item.valorMensal,
      0,
    );
    const receitaRecebida = financeiro.reduce(
      (acc, item) => acc + item.valorPago,
      0,
    );
    const receitaPendente = financeiro.reduce(
      (acc, item) => acc + item.valorPendente,
      0,
    );
    const inadimplentes = financeiro.filter(
      (item) => item.status === "inadimplente",
    ).length;

    return {
      receitaTotal,
      receitaRecebida,
      receitaPendente,
      inadimplentes,
      scoreMedia: Math.round(
        financeiro.reduce((acc, item) => acc + item.scorePagamento, 0) /
          financeiro.length,
      ),
    };
  }, [financeiro]);

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      {/* Estatísticas */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Receita Mensal</p>
                <p className="text-xl font-semibold">
                  R$ {(stats.receitaTotal / 1000).toFixed(0)}k
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Recebido</p>
                <p className="text-xl font-semibold">
                  R$ {(stats.receitaRecebida / 1000).toFixed(0)}k
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pendente</p>
                <p className="text-xl font-semibold">
                  R$ {(stats.receitaPendente / 1000).toFixed(0)}k
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Score Médio</p>
                <p className="text-xl font-semibold">{stats.scoreMedia}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas importantes */}
      {stats.inadimplentes > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">
                  {stats.inadimplentes} cliente(s) inadimplente(s)
                </p>
                <p className="text-sm text-red-600">
                  Requer ação imediata da equipe de cobrança
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="em_dia">Em Dia</SelectItem>
              <SelectItem value="atrasado">Atrasado</SelectItem>
              <SelectItem value="inadimplente">Inadimplente</SelectItem>
              <SelectItem value="suspenso">Suspenso</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterTendencia} onValueChange={setFilterTendencia}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tendência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas</SelectItem>
              <SelectItem value="crescendo">Crescendo</SelectItem>
              <SelectItem value="estavel">Estável</SelectItem>
              <SelectItem value="declinando">Declinando</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <CreditCard className="w-4 h-4 mr-2" />
            Cobranças
          </Button>
          <Button variant="outline">
            <PieChart className="w-4 h-4 mr-2" />
            Relatórios
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nova Cobrança
          </Button>
        </div>
      </div>

      {/* Lista configurável */}
      <ConfigurableList
        items={listItems}
        columns={columns}
        viewMode={viewMode}
        onItemUpdate={handleItemUpdate}
        onColumnUpdate={setColumns}
        onDiscussion={handleDiscussion}
        statusColumns={statusColumns}
      />
    </div>
  );
};

// Funções auxiliares
const getStatusLabel = (status: FinanceiroCliente["status"]): string => {
  const labels = {
    em_dia: "Em Dia",
    atrasado: "Atrasado",
    inadimplente: "Inadimplente",
    suspenso: "Suspenso",
  };
  return labels[status];
};

const getTendenciaLabel = (
  tendencia: FinanceiroCliente["tendencia"],
): string => {
  const labels = {
    crescendo: "Crescendo",
    estavel: "Estável",
    declinando: "Declinando",
  };
  return labels[tendencia];
};

const getMetodoLabel = (
  metodo: FinanceiroCliente["metodoPagamento"],
): string => {
  const labels = {
    boleto: "Boleto",
    cartao: "Cartão",
    pix: "PIX",
    transferencia: "Transferência",
  };
  return labels[metodo];
};

export default FinanceiroModule;
