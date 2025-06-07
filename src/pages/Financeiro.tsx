import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  CreditCard,
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Send,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Repeat,
  Zap,
  Users,
  Building,
  User,
  MoreHorizontal,
  Receipt,
  Banknote,
  Wallet,
  PiggyBank,
  Target,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  Settings,
  Link,
  Mail,
  Phone,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { ViewSelector, ViewType } from "@/components/ui/view-selector";
import { toast } from "sonner";

interface Invoice {
  id: string;
  number: string;
  client: {
    id: string;
    name: string;
    type: "fisica" | "juridica";
    email: string;
    phone: string;
  };
  contract?: {
    id: string;
    title: string;
  };
  description: string;
  amount: number;
  status: "pendente" | "pago" | "vencido" | "cancelado" | "processando";
  dueDate: string;
  issueDate: string;
  paidDate?: string;
  paymentMethod?: "stripe" | "boleto" | "pix" | "transferencia" | "dinheiro";
  stripeConfig?: {
    paymentIntentId?: string;
    paymentLinkId?: string;
    subscriptionId?: string;
  };
  late: {
    days: number;
    fee: number;
    interest: number;
  };
  reminders: {
    sent: number;
    lastSent?: string;
    nextReminder?: string;
  };
  attachments: string[];
  notes: string;
  recurring?: {
    enabled: boolean;
    frequency: "mensal" | "trimestral" | "semestral" | "anual";
    nextIssue?: string;
    endDate?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CashFlowEntry {
  id: string;
  type: "entrada" | "saida";
  category:
    | "receita"
    | "custo_fixo"
    | "custo_variavel"
    | "tributo"
    | "investimento";
  description: string;
  amount: number;
  date: string;
  client?: {
    id: string;
    name: string;
  };
  contract?: {
    id: string;
    title: string;
  };
  invoice?: {
    id: string;
    number: string;
  };
  tags: string[];
  paymentMethod: string;
  status: "confirmado" | "pendente" | "cancelado";
  recurring: boolean;
  createdAt: string;
}

interface Subscription {
  id: string;
  client: {
    id: string;
    name: string;
    type: "fisica" | "juridica";
  };
  contract: {
    id: string;
    title: string;
  };
  plan: {
    name: string;
    amount: number;
    frequency: "mensal" | "trimestral" | "semestral" | "anual";
  };
  status: "ativa" | "cancelada" | "pausada" | "trial";
  stripeSubscriptionId?: string;
  startDate: string;
  endDate?: string;
  trialEnd?: string;
  nextBilling: string;
  discount?: {
    type: "percentage" | "fixed";
    value: number;
    endDate?: string;
  };
  invoices: string[];
  createdAt: string;
}

const statusColors = {
  pendente: "bg-yellow-100 text-yellow-800 border-yellow-200",
  pago: "bg-green-100 text-green-800 border-green-200",
  vencido: "bg-red-100 text-red-800 border-red-200",
  cancelado: "bg-gray-100 text-gray-800 border-gray-200",
  processando: "bg-blue-100 text-blue-800 border-blue-200",
  confirmado: "bg-green-100 text-green-800 border-green-200",
  ativa: "bg-green-100 text-green-800 border-green-200",
  trial: "bg-blue-100 text-blue-800 border-blue-200",
  pausada: "bg-gray-100 text-gray-800 border-gray-200",
};

const paymentMethodIcons = {
  stripe: CreditCard,
  boleto: FileText,
  pix: Zap,
  transferencia: Banknote,
  dinheiro: Wallet,
};

export default function Financeiro() {
  const [activeTab, setActiveTab] = useState("faturas");
  const [currentView, setCurrentView] = useState<ViewType>("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterClient, setFilterClient] = useState("all");
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isStripeEnabled, setIsStripeEnabled] = useState(true);

  // Mock data
  const invoices: Invoice[] = useMemo(
    () => [
      {
        id: "inv-001",
        number: "FAT-2024-001",
        client: {
          id: "cli-001",
          name: "João Silva",
          type: "fisica",
          email: "joao@email.com",
          phone: "(11) 99999-9999",
        },
        contract: {
          id: "cont-001",
          title: "Prestação de Serviços Jurídicos",
        },
        description: "Honorários advocatícios - Janeiro 2024",
        amount: 5000,
        status: "pago",
        dueDate: "2024-01-10",
        issueDate: "2024-01-01",
        paidDate: "2024-01-08",
        paymentMethod: "stripe",
        stripeConfig: {
          paymentIntentId: "pi_1234",
          paymentLinkId: "plink_1234",
        },
        late: {
          days: 0,
          fee: 0,
          interest: 0,
        },
        reminders: {
          sent: 1,
          lastSent: "2024-01-05",
        },
        attachments: ["fatura_001.pdf"],
        notes: "Pagamento realizado via cartão de crédito",
        recurring: {
          enabled: true,
          frequency: "mensal",
          nextIssue: "2024-02-01",
        },
        createdAt: "2024-01-01",
        updatedAt: "2024-01-08",
      },
      {
        id: "inv-002",
        number: "FAT-2024-002",
        client: {
          id: "cli-002",
          name: "XYZ Tecnologia Ltda",
          type: "juridica",
          email: "contato@xyz.com",
          phone: "(11) 3333-4444",
        },
        contract: {
          id: "cont-002",
          title: "Retainer Mensal",
        },
        description: "Retainer - Janeiro 2024",
        amount: 8000,
        status: "pendente",
        dueDate: "2024-01-15",
        issueDate: "2024-01-01",
        stripeConfig: {
          paymentLinkId: "plink_5678",
        },
        late: {
          days: 0,
          fee: 0,
          interest: 0,
        },
        reminders: {
          sent: 0,
          nextReminder: "2024-01-12",
        },
        attachments: ["fatura_002.pdf"],
        notes: "Fatura enviada por e-mail",
        recurring: {
          enabled: true,
          frequency: "mensal",
          nextIssue: "2024-02-01",
        },
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
      {
        id: "inv-003",
        number: "FAT-2024-003",
        client: {
          id: "cli-003",
          name: "Maria Oliveira",
          type: "fisica",
          email: "maria@email.com",
          phone: "(11) 88888-7777",
        },
        description: "Taxa de sucesso - Ação Trabalhista",
        amount: 15000,
        status: "vencido",
        dueDate: "2024-01-05",
        issueDate: "2023-12-20",
        late: {
          days: 10,
          fee: 300,
          interest: 150,
        },
        reminders: {
          sent: 3,
          lastSent: "2024-01-10",
        },
        attachments: ["fatura_003.pdf"],
        notes: "Cliente solicitou parcelamento",
        createdAt: "2023-12-20",
        updatedAt: "2024-01-10",
      },
    ],
    [],
  );

  const subscriptions: Subscription[] = useMemo(
    () => [
      {
        id: "sub-001",
        client: {
          id: "cli-001",
          name: "João Silva",
          type: "fisica",
        },
        contract: {
          id: "cont-001",
          title: "Prestação de Serviços Jurídicos",
        },
        plan: {
          name: "Mensal Básico",
          amount: 5000,
          frequency: "mensal",
        },
        status: "ativa",
        stripeSubscriptionId: "sub_stripe_1234",
        startDate: "2024-01-01",
        nextBilling: "2024-02-01",
        invoices: ["inv-001"],
        createdAt: "2024-01-01",
      },
      {
        id: "sub-002",
        client: {
          id: "cli-002",
          name: "XYZ Tecnologia Ltda",
          type: "juridica",
        },
        contract: {
          id: "cont-002",
          title: "Retainer Mensal",
        },
        plan: {
          name: "Retainer Pro",
          amount: 8000,
          frequency: "mensal",
        },
        status: "ativa",
        stripeSubscriptionId: "sub_stripe_5678",
        startDate: "2024-01-01",
        nextBilling: "2024-02-01",
        invoices: ["inv-002"],
        createdAt: "2024-01-01",
      },
    ],
    [],
  );

  const cashFlow: CashFlowEntry[] = useMemo(
    () => [
      {
        id: "cf-001",
        type: "entrada",
        category: "receita",
        description: "Pagamento João Silva - Janeiro",
        amount: 5000,
        date: "2024-01-08",
        client: { id: "cli-001", name: "João Silva" },
        invoice: { id: "inv-001", number: "FAT-2024-001" },
        tags: ["stripe", "recorrente"],
        paymentMethod: "Cartão de Crédito via Stripe",
        status: "confirmado",
        recurring: true,
        createdAt: "2024-01-08",
      },
      {
        id: "cf-002",
        type: "saida",
        category: "custo_fixo",
        description: "Aluguel do escritório",
        amount: 8000,
        date: "2024-01-05",
        tags: ["fixo", "aluguel"],
        paymentMethod: "Transferência Bancária",
        status: "confirmado",
        recurring: true,
        createdAt: "2024-01-05",
      },
      {
        id: "cf-003",
        type: "saida",
        category: "tributo",
        description: "ISS - Imposto sobre Serviços",
        amount: 250,
        date: "2024-01-10",
        tags: ["tributo", "iss"],
        paymentMethod: "DARF",
        status: "confirmado",
        recurring: true,
        createdAt: "2024-01-10",
      },
    ],
    [],
  );

  // Filtered data
  const filteredInvoices = useMemo(() => {
    let filtered = invoices;

    if (searchTerm) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.client.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          invoice.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((invoice) => invoice.status === filterStatus);
    }

    if (filterClient !== "all") {
      filtered = filtered.filter(
        (invoice) => invoice.client.id === filterClient,
      );
    }

    return filtered;
  }, [invoices, searchTerm, filterStatus, filterClient]);

  // Stats calculations
  const stats = useMemo(() => {
    const totalReceivable = invoices
      .filter((inv) => inv.status === "pendente" || inv.status === "vencido")
      .reduce((sum, inv) => sum + inv.amount, 0);

    const paidThisMonth = invoices
      .filter(
        (inv) => inv.status === "pago" && inv.paidDate?.startsWith("2024-01"),
      )
      .reduce((sum, inv) => sum + inv.amount, 0);

    const overdue = invoices.filter((inv) => inv.status === "vencido").length;

    const activeSubscriptions = subscriptions.filter(
      (sub) => sub.status === "ativa",
    ).length;

    const monthlyRecurring = subscriptions
      .filter((sub) => sub.status === "ativa")
      .reduce((sum, sub) => sum + sub.plan.amount, 0);

    return {
      totalReceivable,
      paidThisMonth,
      overdue,
      activeSubscriptions,
      monthlyRecurring,
    };
  }, [invoices, subscriptions]);

  const handleCreateInvoice = useCallback(() => {
    setIsCreateInvoiceOpen(true);
  }, []);

  const handleSendInvoice = useCallback((invoiceId: string) => {
    toast.success("Fatura enviada por e-mail!");
  }, []);

  const handleGeneratePaymentLink = useCallback((invoiceId: string) => {
    navigator.clipboard.writeText(
      `https://pay.stripe.com/invoice/${invoiceId}`,
    );
    toast.success("Link de pagamento copiado!");
  }, []);

  const renderInvoicesTab = () => (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="border-0 shadow-sm">
        <CardContent className="py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar faturas, clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleCreateInvoice}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Fatura
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b bg-card">
          <div className="flex items-center justify-between">
            <CardTitle>Faturas ({filteredInvoices.length})</CardTitle>
            {selectedInvoices.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {selectedInvoices.length} selecionadas
                </Badge>
                <Button variant="outline" size="sm">
                  Ações em Lote
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b bg-muted/50">
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={
                      selectedInvoices.length === filteredInvoices.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedInvoices(
                          filteredInvoices.map((inv) => inv.id),
                        );
                      } else {
                        setSelectedInvoices([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Fatura</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => {
                const PaymentIcon = invoice.paymentMethod
                  ? paymentMethodIcons[invoice.paymentMethod]
                  : Receipt;
                const isOverdue = invoice.status === "vencido";

                return (
                  <TableRow
                    key={invoice.id}
                    className={`hover:bg-muted/50 ${isOverdue ? "bg-red-50" : ""}`}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedInvoices.includes(invoice.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedInvoices((prev) => [
                              ...prev,
                              invoice.id,
                            ]);
                          } else {
                            setSelectedInvoices((prev) =>
                              prev.filter((id) => id !== invoice.id),
                            );
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {invoice.number}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {invoice.description}
                        </div>
                        <div className="flex items-center gap-1">
                          {invoice.recurring?.enabled && (
                            <Badge variant="outline" className="text-xs">
                              <Repeat className="h-3 w-3 mr-1" />
                              Recorrente
                            </Badge>
                          )}
                          {invoice.stripeConfig?.paymentLinkId && (
                            <Badge variant="outline" className="text-xs">
                              <Link className="h-3 w-3 mr-1" />
                              Link
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {invoice.client.type === "juridica" ? (
                          <Building className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <User className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <div className="font-medium text-sm">
                            {invoice.client.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {invoice.client.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {invoice.amount.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </div>
                      {isOverdue && invoice.late.fee > 0 && (
                        <div className="text-xs text-red-600">
                          +{" "}
                          {invoice.late.fee.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}{" "}
                          (multa)
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[invoice.status]}>
                        {invoice.status === "pendente" && (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {invoice.status === "pago" && (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {invoice.status === "vencido" && (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {invoice.status === "cancelado" && (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {invoice.status.charAt(0).toUpperCase() +
                          invoice.status.slice(1)}
                      </Badge>
                      {isOverdue && (
                        <div className="text-xs text-red-600 mt-1">
                          {invoice.late.days} dias em atraso
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(invoice.dueDate).toLocaleDateString("pt-BR")}
                      </div>
                      {invoice.paidDate && (
                        <div className="text-xs text-green-600">
                          Pago em{" "}
                          {new Date(invoice.paidDate).toLocaleDateString(
                            "pt-BR",
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {invoice.paymentMethod && (
                          <div className="flex items-center gap-1">
                            <PaymentIcon className="h-3 w-3" />
                            <span className="text-xs capitalize">
                              {invoice.paymentMethod}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
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
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleSendInvoice(invoice.id)}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Enviar por E-mail
                          </DropdownMenuItem>
                          {invoice.stripeConfig?.paymentLinkId && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleGeneratePaymentLink(invoice.id)
                              }
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copiar Link de Pagamento
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {invoice.status === "pendente" && (
                            <DropdownMenuItem>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Marcar como Pago
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancelar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderSubscriptionsTab = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b bg-card">
          <div className="flex items-center justify-between">
            <CardTitle>Assinaturas Ativas ({subscriptions.length})</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Assinatura
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id} className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className={statusColors[subscription.status]}>
                      {subscription.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Configurar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Portal Stripe
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm">
                      {subscription.client.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {subscription.plan.name}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">
                      {subscription.plan.amount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      /{subscription.plan.frequency}
                    </span>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <div>
                      Próxima cobrança:{" "}
                      {new Date(subscription.nextBilling).toLocaleDateString(
                        "pt-BR",
                      )}
                    </div>
                    <div>Faturas: {subscription.invoices.length}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCashFlowTab = () => (
    <div className="space-y-6">
      {/* Cash Flow Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entradas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {cashFlow
                .filter((entry) => entry.type === "entrada")
                .reduce((sum, entry) => sum + entry.amount, 0)
                .toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
            </div>
            <p className="text-xs text-muted-foreground">
              {cashFlow.filter((entry) => entry.type === "entrada").length}{" "}
              entradas
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saídas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {cashFlow
                .filter((entry) => entry.type === "saida")
                .reduce((sum, entry) => sum + entry.amount, 0)
                .toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
            </div>
            <p className="text-xs text-muted-foreground">
              {cashFlow.filter((entry) => entry.type === "saida").length} saídas
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                cashFlow
                  .filter((entry) => entry.type === "entrada")
                  .reduce((sum, entry) => sum + entry.amount, 0) -
                cashFlow
                  .filter((entry) => entry.type === "saida")
                  .reduce((sum, entry) => sum + entry.amount, 0)
              ).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
            <p className="text-xs text-muted-foreground">Saldo do período</p>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Entries */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b bg-card">
          <div className="flex items-center justify-between">
            <CardTitle>Fluxo de Caixa</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Lançamento
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b bg-muted/50">
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cashFlow.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-muted/50">
                  <TableCell>
                    {new Date(entry.date).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm">
                        {entry.description}
                      </div>
                      {entry.client && (
                        <div className="text-xs text-muted-foreground">
                          Cliente: {entry.client.name}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {entry.category.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {entry.type === "entrada" ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={
                          entry.type === "entrada"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {entry.type}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${entry.type === "entrada" ? "text-green-600" : "text-red-600"}`}
                    >
                      {entry.type === "entrada" ? "+" : "-"}
                      {entry.amount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[entry.status]}>
                      {entry.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">Gestão Financeira</h1>
          <p className="text-muted-foreground">
            Faturas, assinaturas, fluxo de caixa e integração com Stripe
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="stripe-toggle" className="text-sm">
              Stripe
            </Label>
            <Switch
              id="stripe-toggle"
              checked={isStripeEnabled}
              onCheckedChange={setIsStripeEnabled}
            />
          </div>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Receber</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalReceivable.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                maximumFractionDigits: 0,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              faturas pendentes e vencidas
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recebido Este Mês
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.paidThisMonth.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                maximumFractionDigits: 0,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              pagamentos confirmados
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faturas Vencidas
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.overdue}
            </div>
            <p className="text-xs text-muted-foreground">
              requerem atenção imediata
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Recorrente
            </CardTitle>
            <Repeat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.monthlyRecurring.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                maximumFractionDigits: 0,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.activeSubscriptions} assinaturas ativas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faturas">Faturas</TabsTrigger>
          <TabsTrigger value="assinaturas">Assinaturas</TabsTrigger>
          <TabsTrigger value="fluxo">Fluxo de Caixa</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="faturas">{renderInvoicesTab()}</TabsContent>

        <TabsContent value="assinaturas">
          {renderSubscriptionsTab()}
        </TabsContent>

        <TabsContent value="fluxo">{renderCashFlowTab()}</TabsContent>

        <TabsContent value="relatorios">
          <Card className="border-0 shadow-sm">
            <CardContent className="py-12 text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Relatórios Financeiros
              </h3>
              <p className="text-muted-foreground mb-4">
                Análises detalhadas e gráficos de performance financeira
              </p>
              <Button>
                <LineChart className="h-4 w-4 mr-2" />
                Ver Relatórios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Invoice Dialog */}
      <Dialog open={isCreateInvoiceOpen} onOpenChange={setIsCreateInvoiceOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Fatura</DialogTitle>
            <DialogDescription>
              Criar uma nova fatura avulsa ou recorrente
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cli-001">João Silva</SelectItem>
                    <SelectItem value="cli-002">XYZ Tecnologia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Contrato (opcional)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cont-001">
                      Prestação de Serviços
                    </SelectItem>
                    <SelectItem value="cont-002">Retainer Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea placeholder="Descrição dos serviços prestados..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor</Label>
                <Input type="number" placeholder="0,00" />
              </div>
              <div className="space-y-2">
                <Label>Vencimento</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="recurring" />
              <Label htmlFor="recurring">Fatura recorrente</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateInvoiceOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                toast.success("Fatura criada com sucesso!");
                setIsCreateInvoiceOpen(false);
              }}
            >
              Criar Fatura
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
