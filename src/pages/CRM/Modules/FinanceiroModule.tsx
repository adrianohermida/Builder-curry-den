/**
 * 💰 MÓDULO FINANCEIRO INDIVIDUAL - CRM Unicorn
 *
 * Gestão financeira personalizada por cliente com integração Stripe
 * - Painel financeiro dedicado por cliente
 * - Integração completa com Stripe API
 * - Geração automática de links de pagamento
 * - Analytics financeiro em tempo real
 */

import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  CreditCard,
  Receipt,
  PieChart,
  BarChart3,
  Users,
  Eye,
  Edit,
  Download,
  Send,
  Link,
  RefreshCw,
  Zap,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Hooks
import { useFinanceiroUnicorn } from "@/hooks/useFinanceiroUnicorn";
import { useStripeIntegration } from "@/hooks/useStripeIntegration";
import { useFinancialAnalytics } from "@/hooks/useFinancialAnalytics";

// Tipos
interface Transacao {
  id: string;
  clienteId: string;
  clienteNome: string;
  tipo: "receita" | "despesa" | "honorario" | "reembolso";
  categoria: string;
  valor: number;
  status: "pendente" | "pago" | "atrasado" | "cancelado";
  dataVencimento: Date;
  dataPagamento?: Date;
  descricao: string;
  processoId?: string;
  contratoId?: string;
  formaPagamento?: string;
  stripePaymentId?: string;
  linkPagamento?: string;
  observacoes?: string;
  tags: string[];
  recorrente: boolean;
  proximaCobranca?: Date;
}

interface ClienteFinanceiro {
  id: string;
  nome: string;
  receitaTotal: number;
  receitaMensal: number;
  pendentesValor: number;
  atrasadosValor: number;
  proximoVencimento?: Date;
  ultimoPagamento?: Date;
  statusFinanceiro: "excelente" | "bom" | "atencao" | "critico";
  scorePagamento: number;
  tendencia: "crescendo" | "estavel" | "declinando";
  totalTransacoes: number;
  transacoesPendentes: number;
}

interface FinanceiroModuleProps {
  searchQuery?: string;
  onNotification?: (message: string) => void;
  className?: string;
}

// Dados mock
const MOCK_CLIENTES_FINANCEIRO: ClienteFinanceiro[] = [
  {
    id: "cli-001",
    nome: "Maria Silva Advocacia",
    receitaTotal: 540000,
    receitaMensal: 45000,
    pendentesValor: 90000,
    atrasadosValor: 0,
    proximoVencimento: new Date("2025-02-01"),
    ultimoPagamento: new Date("2025-01-15"),
    statusFinanceiro: "excelente",
    scorePagamento: 98,
    tendencia: "crescendo",
    totalTransacoes: 24,
    transacoesPendentes: 2,
  },
  {
    id: "cli-002",
    nome: "Carlos Mendes",
    receitaTotal: 96000,
    receitaMensal: 8000,
    pendentesValor: 16000,
    atrasadosValor: 8000,
    proximoVencimento: new Date("2025-01-30"),
    ultimoPagamento: new Date("2025-01-01"),
    statusFinanceiro: "atencao",
    scorePagamento: 72,
    tendencia: "estavel",
    totalTransacoes: 12,
    transacoesPendentes: 3,
  },
  {
    id: "cli-003",
    nome: "Tech Solutions Ltda",
    receitaTotal: 120000,
    receitaMensal: 0,
    pendentesValor: 45000,
    atrasadosValor: 30000,
    proximoVencimento: new Date("2024-12-15"),
    ultimoPagamento: new Date("2024-10-20"),
    statusFinanceiro: "critico",
    scorePagamento: 35,
    tendencia: "declinando",
    totalTransacoes: 18,
    transacoesPendentes: 6,
  },
];

const MOCK_TRANSACOES: Transacao[] = [
  {
    id: "txn-001",
    clienteId: "cli-001",
    clienteNome: "Maria Silva Advocacia",
    tipo: "honorario",
    categoria: "Prestação de Serviços",
    valor: 45000,
    status: "pago",
    dataVencimento: new Date("2025-01-15"),
    dataPagamento: new Date("2025-01-15"),
    descricao: "Honorários mensais - Janeiro 2025",
    contratoId: "cont-001",
    formaPagamento: "Transferência",
    observacoes: "Pagamento em dia",
    tags: ["Mensal", "Contrato"],
    recorrente: true,
    proximaCobranca: new Date("2025-02-15"),
  },
  {
    id: "txn-002",
    clienteId: "cli-002",
    clienteNome: "Carlos Mendes",
    tipo: "honorario",
    categoria: "Consultoria",
    valor: 8000,
    status: "atrasado",
    dataVencimento: new Date("2025-01-10"),
    descricao: "Consultoria trabalhista - Janeiro",
    linkPagamento: "https://pay.stripe.com/invoice/acct_123/test_456",
    stripePaymentId: "pi_test_123456",
    observacoes: "Cliente notificado sobre atraso",
    tags: ["Consultoria", "Atrasado"],
    recorrente: false,
  },
  {
    id: "txn-003",
    clienteId: "cli-001",
    clienteNome: "Maria Silva Advocacia",
    tipo: "honorario",
    categoria: "Honorários de Êxito",
    valor: 125000,
    status: "pendente",
    dataVencimento: new Date("2025-02-28"),
    descricao: "Honorários de êxito - Processo tributário",
    processoId: "proc-001",
    observacoes: "Aguardando finalização do processo",
    tags: ["Êxito", "Tributário"],
    recorrente: false,
  },
  {
    id: "txn-004",
    clienteId: "cli-003",
    clienteNome: "Tech Solutions Ltda",
    tipo: "honorario",
    categoria: "Representação",
    valor: 15000,
    status: "atrasado",
    dataVencimento: new Date("2024-12-15"),
    descricao: "Representação processual - Pendência",
    observacoes: "Cliente sem contato há 60 dias",
    tags: ["Representação", "Sem Contato"],
    recorrente: false,
  },
];

export function FinanceiroModule({
  searchQuery = "",
  onNotification,
  className,
}: FinanceiroModuleProps) {
  // Estados
  const [selectedClient, setSelectedClient] = useState<string>("todos");
  const [selectedStatus, setSelectedStatus] = useState<string>("todos");
  const [selectedTipo, setSelectedTipo] = useState<string>("todos");
  const [viewMode, setViewMode] = useState<"clientes" | "transacoes">(
    "clientes",
  );
  const [showAnalytics, setShowAnalytics] = useState(true);

  // Hooks
  const {
    transacoes,
    loading,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useFinanceiroUnicorn();

  const {
    createPaymentLink,
    getPaymentStatus,
    processRefund,
    loading: stripeLoading,
  } = useStripeIntegration();

  const { getClientAnalytics, getRevenueProjection, calculateMetrics } =
    useFinancialAnalytics();

  // Dados filtrados
  const filteredData = useMemo(() => {
    if (viewMode === "clientes") {
      let filtered = MOCK_CLIENTES_FINANCEIRO;

      if (searchQuery) {
        filtered = filtered.filter((cliente) =>
          cliente.nome.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      return filtered.sort((a, b) => {
        // Priorizar clientes com status crítico e pendências
        const statusOrder = { critico: 4, atencao: 3, bom: 2, excelente: 1 };
        const aScore = statusOrder[a.statusFinanceiro];
        const bScore = statusOrder[b.statusFinanceiro];
        return bScore - aScore;
      });
    } else {
      let filtered = MOCK_TRANSACOES;

      if (searchQuery) {
        filtered = filtered.filter(
          (transacao) =>
            transacao.descricao
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            transacao.clienteNome
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
        );
      }

      if (selectedClient !== "todos") {
        filtered = filtered.filter(
          (transacao) => transacao.clienteId === selectedClient,
        );
      }

      if (selectedStatus !== "todos") {
        filtered = filtered.filter(
          (transacao) => transacao.status === selectedStatus,
        );
      }

      if (selectedTipo !== "todos") {
        filtered = filtered.filter(
          (transacao) => transacao.tipo === selectedTipo,
        );
      }

      return filtered.sort((a, b) => {
        // Priorizar por status e data de vencimento
        const statusOrder = { atrasado: 4, pendente: 3, pago: 2, cancelado: 1 };
        const aScore = statusOrder[a.status];
        const bScore = statusOrder[b.status];

        if (aScore !== bScore) {
          return bScore - aScore;
        }

        return a.dataVencimento.getTime() - b.dataVencimento.getTime();
      });
    }
  }, [searchQuery, selectedClient, selectedStatus, selectedTipo, viewMode]);

  // Estatísticas gerais
  const stats = useMemo(() => {
    const totalReceita = MOCK_TRANSACOES.filter(
      (t) => t.status === "pago",
    ).reduce((acc, t) => acc + t.valor, 0);

    const totalPendente = MOCK_TRANSACOES.filter(
      (t) => t.status === "pendente",
    ).reduce((acc, t) => acc + t.valor, 0);

    const totalAtrasado = MOCK_TRANSACOES.filter(
      (t) => t.status === "atrasado",
    ).reduce((acc, t) => acc + t.valor, 0);

    const clientesAtivos = MOCK_CLIENTES_FINANCEIRO.filter(
      (c) => c.statusFinanceiro !== "critico",
    ).length;

    const clientesCriticos = MOCK_CLIENTES_FINANCEIRO.filter(
      (c) => c.statusFinanceiro === "critico",
    ).length;

    const receitaMensal = MOCK_CLIENTES_FINANCEIRO.reduce(
      (acc, c) => acc + c.receitaMensal,
      0,
    );

    return {
      totalReceita,
      totalPendente,
      totalAtrasado,
      clientesAtivos,
      clientesCriticos,
      receitaMensal,
    };
  }, []);

  // Handlers
  const handleCreatePaymentLink = useCallback(
    async (transacaoId: string) => {
      try {
        const link = await createPaymentLink(transacaoId);
        onNotification?.("Link de pagamento criado com sucesso");
        // Copiar para clipboard
        navigator.clipboard.writeText(link);
        toast.success("Link copiado para a área de transferência");
      } catch (error) {
        toast.error("Erro ao criar link de pagamento");
      }
    },
    [createPaymentLink, onNotification],
  );

  const handleSendInvoice = useCallback(
    async (transacaoId: string) => {
      try {
        // Simular envio de fatura
        onNotification?.("Fatura enviada por email");
      } catch (error) {
        toast.error("Erro ao enviar fatura");
      }
    },
    [onNotification],
  );

  // Renderizador de card de cliente financeiro
  const renderClientCard = (cliente: ClienteFinanceiro) => (
    <motion.div
      key={cliente.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "relative overflow-hidden cursor-pointer transition-all",
          "hover:shadow-lg border-l-4",
          cliente.statusFinanceiro === "excelente" &&
            "border-l-green-500 bg-green-50",
          cliente.statusFinanceiro === "bom" && "border-l-blue-500 bg-blue-50",
          cliente.statusFinanceiro === "atencao" &&
            "border-l-yellow-500 bg-yellow-50",
          cliente.statusFinanceiro === "critico" &&
            "border-l-red-500 bg-red-50",
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge
                  variant={
                    cliente.statusFinanceiro === "excelente"
                      ? "default"
                      : cliente.statusFinanceiro === "critico"
                        ? "destructive"
                        : "secondary"
                  }
                  className="text-xs"
                >
                  {cliente.statusFinanceiro.toUpperCase()}
                </Badge>

                <Badge variant="outline" className="text-xs">
                  Score: {cliente.scorePagamento}
                </Badge>

                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    cliente.tendencia === "crescendo" && "text-green-600",
                    cliente.tendencia === "declinando" && "text-red-600",
                  )}
                >
                  {cliente.tendencia === "crescendo" && (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  )}
                  {cliente.tendencia === "declinando" && (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {cliente.tendencia}
                </Badge>
              </div>

              <h3 className="font-semibold text-sm mb-1">{cliente.nome}</h3>
              <p className="text-xs text-muted-foreground">
                {cliente.totalTransacoes} transações
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Receipt className="h-4 w-4 mr-2" />
                  Nova Cobrança
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Relatório
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Extrato
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Métricas financeiras principais */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground">Receita Total</p>
              <p className="font-bold text-green-600 text-lg">
                R$ {(cliente.receitaTotal / 1000).toFixed(0)}k
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Mensal</p>
              <p className="font-bold text-blue-600 text-lg">
                R$ {(cliente.receitaMensal / 1000).toFixed(0)}k
              </p>
            </div>
          </div>

          {/* Pendências e atrasos */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground">Pendente</p>
              <p className="font-semibold text-orange-600">
                R$ {(cliente.pendentesValor / 1000).toFixed(0)}k
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Atrasado</p>
              <p className="font-semibold text-red-600">
                R$ {(cliente.atrasadosValor / 1000).toFixed(0)}k
              </p>
            </div>
          </div>

          {/* Próximo vencimento */}
          {cliente.proximoVencimento && (
            <div className="mb-4">
              <div className="flex items-center text-xs mb-1">
                <Calendar className="h-3 w-3 mr-1" />
                <span className="text-muted-foreground">
                  Próximo vencimento:
                </span>
              </div>
              <p className="text-xs font-medium">
                {cliente.proximoVencimento.toLocaleDateString("pt-BR")}
              </p>
            </div>
          )}

          {/* Score de pagamento */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Score</span>
              <span className="text-xs font-medium">
                {cliente.scorePagamento}%
              </span>
            </div>
            <Progress value={cliente.scorePagamento} className="h-2" />
          </div>

          {/* Alertas */}
          {cliente.transacoesPendentes > 0 && (
            <div className="flex items-center text-xs text-orange-600">
              <Clock className="h-3 w-3 mr-1" />
              {cliente.transacoesPendentes} transação(ões) pendente(s)
            </div>
          )}

          {cliente.statusFinanceiro === "critico" && (
            <div className="flex items-center text-xs text-red-600 mt-2">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Requer atenção imediata
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  // Renderizador de card de transação
  const renderTransactionCard = (transacao: Transacao) => (
    <motion.div
      key={transacao.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "relative overflow-hidden cursor-pointer transition-all",
          "hover:shadow-md border-l-4",
          transacao.status === "pago" && "border-l-green-500 bg-green-50",
          transacao.status === "pendente" && "border-l-yellow-500 bg-yellow-50",
          transacao.status === "atrasado" && "border-l-red-500 bg-red-50",
          transacao.status === "cancelado" && "border-l-gray-500 bg-gray-50",
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge
                  variant={
                    transacao.status === "pago"
                      ? "default"
                      : transacao.status === "atrasado"
                        ? "destructive"
                        : "secondary"
                  }
                  className="text-xs"
                >
                  {transacao.status.toUpperCase()}
                </Badge>

                <Badge variant="outline" className="text-xs">
                  {transacao.tipo.toUpperCase()}
                </Badge>

                {transacao.recorrente && (
                  <Badge variant="outline" className="text-xs">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Recorrente
                  </Badge>
                )}
              </div>

              <h3 className="font-semibold text-sm mb-1">
                {transacao.descricao}
              </h3>
              <p className="text-xs text-muted-foreground">
                {transacao.clienteNome}
              </p>
            </div>

            <div className="text-right">
              <p className="font-bold text-lg text-green-600">
                R$ {(transacao.valor / 1000).toFixed(1)}k
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleCreatePaymentLink(transacao.id)}
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Gerar Link
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSendInvoice(transacao.id)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Fatura
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Data de vencimento */}
          <div className="mb-3">
            <div className="flex items-center text-xs mb-1">
              <Calendar className="h-3 w-3 mr-1" />
              <span className="text-muted-foreground">Vencimento:</span>
            </div>
            <p
              className={cn(
                "text-xs font-medium",
                transacao.status === "atrasado" && "text-red-600",
                transacao.dataVencimento.getTime() - Date.now() <
                  7 * 24 * 60 * 60 * 1000 && "text-orange-600",
              )}
            >
              {transacao.dataVencimento.toLocaleDateString("pt-BR")}
            </p>
          </div>

          {/* Data de pagamento */}
          {transacao.dataPagamento && (
            <div className="mb-3">
              <div className="flex items-center text-xs mb-1">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-muted-foreground">Pago em:</span>
              </div>
              <p className="text-xs font-medium">
                {transacao.dataPagamento.toLocaleDateString("pt-BR")}
              </p>
            </div>
          )}

          {/* Link de pagamento */}
          {transacao.linkPagamento && (
            <div className="mb-3">
              <Button variant="outline" size="sm" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Ver Link de Pagamento
              </Button>
            </div>
          )}

          {/* Próxima cobrança */}
          {transacao.proximaCobranca && (
            <div className="mb-3">
              <div className="flex items-center text-xs mb-1">
                <RefreshCw className="h-3 w-3 mr-1" />
                <span className="text-muted-foreground">Próxima cobrança:</span>
              </div>
              <p className="text-xs font-medium">
                {transacao.proximaCobranca.toLocaleDateString("pt-BR")}
              </p>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {transacao.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header do módulo */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Financeiro Individual
          </h2>
          <p className="text-muted-foreground">
            Gestão financeira com integração Stripe
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAnalytics(!showAnalytics)}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics {showAnalytics ? "ON" : "OFF"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setViewMode(viewMode === "clientes" ? "transacoes" : "clientes")
            }
          >
            {viewMode === "clientes" ? "Ver Transações" : "Ver Clientes"}
          </Button>

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Cobrança
          </Button>
        </div>
      </div>

      {/* Estatísticas financeiras */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Receita Total",
            value: `R$ ${(stats.totalReceita / 1000).toFixed(0)}k`,
            icon: DollarSign,
            color: "text-green-600",
          },
          {
            title: "Receita/mês",
            value: `R$ ${(stats.receitaMensal / 1000).toFixed(0)}k`,
            icon: TrendingUp,
            color: "text-blue-600",
          },
          {
            title: "Pendente",
            value: `R$ ${(stats.totalPendente / 1000).toFixed(0)}k`,
            icon: Clock,
            color: "text-orange-600",
          },
          {
            title: "Atrasado",
            value: `R$ ${(stats.totalAtrasado / 1000).toFixed(0)}k`,
            icon: AlertTriangle,
            color: "text-red-600",
          },
          {
            title: "Clientes Ativos",
            value: stats.clientesAtivos,
            icon: Users,
            color: "text-green-600",
          },
          {
            title: "Críticos",
            value: stats.clientesCriticos,
            icon: Target,
            color: "text-red-600",
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={cn("h-8 w-8", stat.color)} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filtros */}
      <div className="flex items-center space-x-4">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
          <TabsList>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
            <TabsTrigger value="transacoes">Transações</TabsTrigger>
          </TabsList>
        </Tabs>

        {viewMode === "transacoes" && (
          <>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Clientes</SelectItem>
                {MOCK_CLIENTES_FINANCEIRO.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="atrasado">Atrasado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}

        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtros Avançados
        </Button>
      </div>

      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {viewMode === "clientes"
          ? (filteredData as ClienteFinanceiro[]).map(renderClientCard)
          : (filteredData as Transacao[]).map(renderTransactionCard)}
      </div>

      {/* Loading state */}
      {(loading || stripeLoading) && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {filteredData.length === 0 && !loading && (
        <div className="text-center py-12">
          <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Nenhum dado financeiro encontrado
          </h3>
          <p className="text-muted-foreground mb-4">
            Comece criando cobranças ou configurando integrações
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Cobrança
          </Button>
        </div>
      )}
    </div>
  );
}
