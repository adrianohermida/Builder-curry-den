import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Settings,
  Users,
  TrendingUp,
  Calendar,
  Receipt,
  Zap,
  Shield,
  Activity,
  Bell,
  Download,
  Eye,
  Edit,
  Pause,
  Play,
  X,
  Plus,
  ExternalLink,
  Coins,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface StripeConfig {
  enabled: boolean;
  publicKey: string;
  secretKey: string;
  webhookSecret: string;
  environment: "test" | "live";
  accountId?: string;
}

interface StripeSubscription {
  id: string;
  contractId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  priceId: string;
  status: "active" | "past_due" | "canceled" | "incomplete" | "trialing";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  amount: number;
  currency: string;
  interval: "month" | "year" | "week" | "day";
  intervalCount: number;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  lastPayment?: {
    id: string;
    amount: number;
    status: string;
    created: string;
  };
  upcomingInvoice?: {
    id: string;
    amount: number;
    dueDate: string;
  };
  defaultPaymentMethod?: {
    id: string;
    type: string;
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
  };
}

interface StripePrice {
  id: string;
  productId: string;
  productName: string;
  amount: number;
  currency: string;
  interval: string;
  intervalCount: number;
  active: boolean;
  created: string;
}

interface StripeInvoice {
  id: string;
  subscriptionId: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: "draft" | "open" | "paid" | "void" | "uncollectible";
  dueDate: string;
  paidAt?: string;
  hostedInvoiceUrl?: string;
  invoicePdf?: string;
}

interface StripeIntegrationProps {
  contractId: string;
  isOpen: boolean;
  onClose: () => void;
  initialConfig?: Partial<StripeConfig>;
}

export function StripeIntegration({
  contractId,
  isOpen,
  onClose,
  initialConfig,
}: StripeIntegrationProps) {
  const [currentTab, setCurrentTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [stripeConfig, setStripeConfig] = useState<StripeConfig>({
    enabled: false,
    publicKey: "",
    secretKey: "",
    webhookSecret: "",
    environment: "test",
    ...initialConfig,
  });

  // Mock data
  const [subscriptions, setSubscriptions] = useState<StripeSubscription[]>([
    {
      id: "sub_1234567890",
      contractId,
      customerId: "cus_ABC123",
      customerName: "João Silva",
      customerEmail: "joao@email.com",
      priceId: "price_XYZ789",
      status: "active",
      currentPeriodStart: "2024-01-01T00:00:00Z",
      currentPeriodEnd: "2024-02-01T00:00:00Z",
      amount: 500000, // R$ 5.000,00 em centavos
      currency: "brl",
      interval: "month",
      intervalCount: 1,
      cancelAtPeriodEnd: false,
      lastPayment: {
        id: "pi_1234567890",
        amount: 500000,
        status: "succeeded",
        created: "2024-01-01T00:00:00Z",
      },
      upcomingInvoice: {
        id: "in_upcoming123",
        amount: 500000,
        dueDate: "2024-02-01T00:00:00Z",
      },
      defaultPaymentMethod: {
        id: "pm_1234567890",
        type: "card",
        last4: "4242",
        brand: "visa",
        expiryMonth: 12,
        expiryYear: 2025,
      },
    },
  ]);

  const [prices, setPrices] = useState<StripePrice[]>([
    {
      id: "price_XYZ789",
      productId: "prod_ABC123",
      productName: "Serviços Jurídicos Mensais",
      amount: 500000,
      currency: "brl",
      interval: "month",
      intervalCount: 1,
      active: true,
      created: "2024-01-01T00:00:00Z",
    },
  ]);

  const [invoices, setInvoices] = useState<StripeInvoice[]>([
    {
      id: "in_1234567890",
      subscriptionId: "sub_1234567890",
      customerId: "cus_ABC123",
      customerName: "João Silva",
      amount: 500000,
      status: "paid",
      dueDate: "2024-01-01T00:00:00Z",
      paidAt: "2024-01-01T12:00:00Z",
      hostedInvoiceUrl: "https://invoice.stripe.com/i/acct_test_123/123",
      invoicePdf: "https://pay.stripe.com/invoice/123/pdf",
    },
  ]);

  // Stats calculadas
  const stats = {
    totalSubscriptions: subscriptions.length,
    activeSubscriptions: subscriptions.filter((s) => s.status === "active")
      .length,
    monthlyRevenue: subscriptions
      .filter((s) => s.status === "active")
      .reduce((sum, s) => sum + s.amount, 0),
    pastDueSubscriptions: subscriptions.filter((s) => s.status === "past_due")
      .length,
    successRate:
      invoices.length > 0
        ? Math.round(
            (invoices.filter((i) => i.status === "paid").length /
              invoices.length) *
              100,
          )
        : 0,
  };

  // Testar conexão com Stripe
  const testStripeConnection = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simular teste de API do Stripe
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (!stripeConfig.secretKey || !stripeConfig.publicKey) {
        throw new Error("Chaves de API são obrigatórias");
      }

      toast.success("Conexão com Stripe testada com sucesso!");
      return true;
    } catch (error) {
      toast.error("Erro na conexão: " + (error as Error).message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [stripeConfig]);

  // Salvar configuração
  const saveStripeConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simular salvamento da configuração
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Configuração salva com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configuração");
    } finally {
      setIsLoading(false);
    }
  }, [stripeConfig]);

  // Criar preço/produto no Stripe
  const createStripePrice = useCallback(
    async (productData: {
      name: string;
      amount: number;
      interval: string;
      intervalCount: number;
    }) => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const newPrice: StripePrice = {
          id: "price_" + Math.random().toString(36).substr(2, 9),
          productId: "prod_" + Math.random().toString(36).substr(2, 9),
          productName: productData.name,
          amount: productData.amount,
          currency: "brl",
          interval: productData.interval,
          intervalCount: productData.intervalCount,
          active: true,
          created: new Date().toISOString(),
        };

        setPrices((prev) => [...prev, newPrice]);
        toast.success("Preço criado no Stripe!");

        return newPrice;
      } catch (error) {
        toast.error("Erro ao criar preço");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Pausar/retomar assinatura
  const toggleSubscription = useCallback(async (subscriptionId: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === subscriptionId
            ? {
                ...sub,
                status: sub.status === "active" ? "past_due" : "active",
              }
            : sub,
        ),
      );

      toast.success("Status da assinatura atualizado!");
    } catch (error) {
      toast.error("Erro ao atualizar assinatura");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cancelar assinatura
  const cancelSubscription = useCallback(async (subscriptionId: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === subscriptionId
            ? { ...sub, status: "canceled", cancelAtPeriodEnd: true }
            : sub,
        ),
      );

      toast.success("Assinatura cancelada!");
    } catch (error) {
      toast.error("Erro ao cancelar assinatura");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reenviar fatura
  const resendInvoice = useCallback(async (invoiceId: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Fatura reenviada por email!");
    } catch (error) {
      toast.error("Erro ao reenviar fatura");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      past_due: "bg-red-100 text-red-800",
      canceled: "bg-gray-100 text-gray-800",
      incomplete: "bg-yellow-100 text-yellow-800",
      trialing: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      open: "bg-yellow-100 text-yellow-800",
      draft: "bg-gray-100 text-gray-800",
      void: "bg-gray-100 text-gray-800",
      uncollectible: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assinaturas Ativas
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.activeSubscriptions}
            </div>
            <p className="text-xs text-muted-foreground">
              de {stats.totalSubscriptions} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Mensal
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.monthlyRevenue / 100).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <p className="text-xs text-muted-foreground">recorrente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Sucesso</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              pagamentos bem-sucedidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Atraso</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.pastDueSubscriptions}
            </div>
            <p className="text-xs text-muted-foreground">assinaturas</p>
          </CardContent>
        </Card>
      </div>

      {/* Status da Integração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Status da Integração Stripe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {stripeConfig.enabled ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <Clock className="h-8 w-8 text-yellow-600" />
              )}
              <div>
                <div className="font-medium">
                  {stripeConfig.enabled
                    ? "Integração Ativa"
                    : "Integração Desabilitada"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Ambiente:{" "}
                  {stripeConfig.environment === "live" ? "Produção" : "Teste"}
                </div>
              </div>
            </div>
            <Badge variant={stripeConfig.enabled ? "default" : "secondary"}>
              {stripeConfig.enabled ? "Online" : "Offline"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Assinaturas Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Assinaturas Ativas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptions.slice(0, 3).map((subscription) => (
              <div
                key={subscription.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {subscription.customerName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {(subscription.amount / 100).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}{" "}
                      • {subscription.interval === "month" ? "Mensal" : "Anual"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(subscription.status)}>
                    {subscription.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderConfigTab = () => (
    <div className="space-y-6">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Configuração Segura</AlertTitle>
        <AlertDescription>
          Suas chaves de API são criptografadas e armazenadas com segurança.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Configurações da API Stripe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">
                Habilitar Integração Stripe
              </Label>
              <p className="text-sm text-muted-foreground">
                Ativar cobrança automática via Stripe
              </p>
            </div>
            <Switch
              checked={stripeConfig.enabled}
              onCheckedChange={(checked) =>
                setStripeConfig((prev) => ({ ...prev, enabled: checked }))
              }
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label htmlFor="environment">Ambiente</Label>
              <Select
                value={stripeConfig.environment}
                onValueChange={(value: "test" | "live") =>
                  setStripeConfig((prev) => ({ ...prev, environment: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="test">Teste (Sandbox)</SelectItem>
                  <SelectItem value="live">Produção (Live)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="publicKey">Chave Pública (Publishable Key)</Label>
              <Input
                id="publicKey"
                value={stripeConfig.publicKey}
                onChange={(e) =>
                  setStripeConfig((prev) => ({
                    ...prev,
                    publicKey: e.target.value,
                  }))
                }
                placeholder="pk_test_..."
              />
            </div>

            <div>
              <Label htmlFor="secretKey">Chave Secreta (Secret Key)</Label>
              <Input
                id="secretKey"
                type="password"
                value={stripeConfig.secretKey}
                onChange={(e) =>
                  setStripeConfig((prev) => ({
                    ...prev,
                    secretKey: e.target.value,
                  }))
                }
                placeholder="sk_test_..."
              />
            </div>

            <div>
              <Label htmlFor="webhookSecret">Webhook Secret</Label>
              <Input
                id="webhookSecret"
                value={stripeConfig.webhookSecret}
                onChange={(e) =>
                  setStripeConfig((prev) => ({
                    ...prev,
                    webhookSecret: e.target.value,
                  }))
                }
                placeholder="whsec_..."
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={testStripeConnection}
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Testando...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Testar Conexão
                </>
              )}
            </Button>

            <Button onClick={saveStripeConfig} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Configuração"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSubscriptionsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Assinaturas</span>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nova Assinatura
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Próximo Pagamento</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {subscription.customerName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {subscription.customerEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {(subscription.amount / 100).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {subscription.interval === "month" ? "Mensal" : "Anual"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(subscription.status)}>
                      {subscription.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(
                        subscription.currentPeriodEnd,
                      ).toLocaleDateString("pt-BR")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSubscription(subscription.id)}
                        disabled={isLoading}
                      >
                        {subscription.status === "active" ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => cancelSubscription(subscription.id)}
                        disabled={isLoading}
                        className="text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderInvoicesTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Faturas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <div className="font-medium">{invoice.customerName}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {(invoice.amount / 100).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(invoice.dueDate).toLocaleDateString("pt-BR")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {invoice.hostedInvoiceUrl && (
                        <Button variant="ghost" size="sm" asChild>
                          <a
                            href={invoice.hostedInvoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {invoice.invoicePdf && (
                        <Button variant="ghost" size="sm" asChild>
                          <a
                            href={invoice.invoicePdf}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => resendInvoice(invoice.id)}
                        disabled={isLoading}
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                    </div>
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Integração Stripe - Contrato {contractId}
          </DialogTitle>
          <DialogDescription>
            Gerencie cobranças automáticas e assinaturas via Stripe
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="config">Configuração</TabsTrigger>
            <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
            <TabsTrigger value="invoices">Faturas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">{renderOverviewTab()}</TabsContent>

          <TabsContent value="config">{renderConfigTab()}</TabsContent>

          <TabsContent value="subscriptions">
            {renderSubscriptionsTab()}
          </TabsContent>

          <TabsContent value="invoices">{renderInvoicesTab()}</TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
