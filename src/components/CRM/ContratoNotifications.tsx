import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileSignature,
  CreditCard,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  Users,
  X,
  Eye,
  MoreHorizontal,
  Archive,
  Trash2,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface ContratoNotification {
  id: string;
  contratoId: string;
  contratoTitulo: string;
  cliente: string;
  tipo:
    | "assinatura_pendente"
    | "pagamento_vencido"
    | "contrato_expirando"
    | "renovacao_automatica"
    | "documento_pendente"
    | "stripe_falha"
    | "compliance_alerta";
  prioridade: "baixa" | "media" | "alta" | "critica";
  titulo: string;
  mensagem: string;
  acao?: {
    label: string;
    url?: string;
    callback?: () => void;
  };
  criadaEm: string;
  visualizada: boolean;
  arquivada: boolean;
  dataVencimento?: string;
  dadosAdicionais?: Record<string, any>;
}

interface NotificationSettings {
  email: {
    assinaturaPendente: boolean;
    pagamentoVencido: boolean;
    contratoExpirando: boolean;
    stripeFalha: boolean;
  };
  sms: {
    assinaturaPendente: boolean;
    pagamentoVencido: boolean;
    contratoExpirando: boolean;
  };
  push: {
    todasNotificacoes: boolean;
    apenasUrgentes: boolean;
  };
  frequencia: "imediata" | "diaria" | "semanal";
  horarioPreferido: string;
}

interface ContratoNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
  contratoId?: string;
}

export function ContratoNotifications({
  isOpen,
  onClose,
  contratoId,
}: ContratoNotificationsProps) {
  const [currentTab, setCurrentTab] = useState("notifications");
  const [notifications, setNotifications] = useState<ContratoNotification[]>(
    [],
  );
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      assinaturaPendente: true,
      pagamentoVencido: true,
      contratoExpirando: true,
      stripeFalha: true,
    },
    sms: {
      assinaturaPendente: true,
      pagamentoVencido: true,
      contratoExpirando: false,
    },
    push: {
      todasNotificacoes: true,
      apenasUrgentes: false,
    },
    frequencia: "imediata",
    horarioPreferido: "09:00",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Mock notifications
  useEffect(() => {
    const mockNotifications: ContratoNotification[] = [
      {
        id: "not-001",
        contratoId: "cont-001",
        contratoTitulo: "Prestação de Serviços - João Silva",
        cliente: "João Silva",
        tipo: "assinatura_pendente",
        prioridade: "alta",
        titulo: "Assinatura Pendente",
        mensagem: "Contrato aguardando assinatura do cliente há 3 dias",
        acao: {
          label: "Enviar Lembrete",
          callback: () => toast.success("Lembrete enviado!"),
        },
        criadaEm: "2024-01-20T10:00:00Z",
        visualizada: false,
        arquivada: false,
        dataVencimento: "2024-01-25T23:59:59Z",
      },
      {
        id: "not-002",
        contratoId: "cont-002",
        contratoTitulo: "Retainer - XYZ Tecnologia",
        cliente: "XYZ Tecnologia",
        tipo: "pagamento_vencido",
        prioridade: "critica",
        titulo: "Pagamento em Atraso",
        mensagem: "Fatura de R$ 8.000,00 vencida há 2 dias",
        acao: {
          label: "Ver Fatura",
          url: "/faturas/inv-123",
        },
        criadaEm: "2024-01-18T15:30:00Z",
        visualizada: true,
        arquivada: false,
        dadosAdicionais: {
          valor: 8000,
          diasAtraso: 2,
          faturaId: "inv-123",
        },
      },
      {
        id: "not-003",
        contratoId: "cont-003",
        contratoTitulo: "Taxa de Sucesso - Maria Oliveira",
        cliente: "Maria Oliveira",
        tipo: "contrato_expirando",
        prioridade: "media",
        titulo: "Contrato Expirando",
        mensagem: "Contrato expira em 15 dias",
        acao: {
          label: "Renovar",
          callback: () => toast.info("Processo de renovação iniciado"),
        },
        criadaEm: "2024-01-15T09:00:00Z",
        visualizada: true,
        arquivada: false,
        dataVencimento: "2024-02-05T23:59:59Z",
      },
      {
        id: "not-004",
        contratoId: "cont-001",
        contratoTitulo: "Prestação de Serviços - João Silva",
        cliente: "João Silva",
        tipo: "stripe_falha",
        prioridade: "alta",
        titulo: "Falha no Pagamento Stripe",
        mensagem: "Cobrança automática falhou - cartão expirado",
        acao: {
          label: "Atualizar Cartão",
          callback: () => toast.info("Redirecionando para atualização..."),
        },
        criadaEm: "2024-01-19T14:20:00Z",
        visualizada: false,
        arquivada: false,
        dadosAdicionais: {
          erro: "card_expired",
          tentativas: 3,
        },
      },
    ];

    setNotifications(
      contratoId
        ? mockNotifications.filter((n) => n.contratoId === contratoId)
        : mockNotifications,
    );
  }, [contratoId]);

  const unreadCount = notifications.filter(
    (n) => !n.visualizada && !n.arquivada,
  ).length;
  const urgentCount = notifications.filter(
    (n) =>
      (n.prioridade === "alta" || n.prioridade === "critica") && !n.arquivada,
  ).length;

  const getPriorityColor = (prioridade: string) => {
    const colors = {
      baixa: "bg-gray-100 text-gray-800",
      media: "bg-blue-100 text-blue-800",
      alta: "bg-yellow-100 text-yellow-800",
      critica: "bg-red-100 text-red-800",
    };
    return colors[prioridade as keyof typeof colors] || colors.media;
  };

  const getTypeIcon = (tipo: string) => {
    const icons = {
      assinatura_pendente: FileSignature,
      pagamento_vencido: DollarSign,
      contrato_expirando: Calendar,
      renovacao_automatica: CheckCircle,
      documento_pendente: FileSignature,
      stripe_falha: CreditCard,
      compliance_alerta: AlertTriangle,
    };
    return icons[tipo as keyof typeof icons] || Bell;
  };

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, visualizada: true } : n,
      ),
    );
  }, []);

  const archiveNotification = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, arquivada: true } : n,
      ),
    );
    toast.success("Notificação arquivada");
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    toast.success("Notificação removida");
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, visualizada: true })));
    toast.success("Todas as notificações marcadas como lidas");
  }, []);

  const saveSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Configurações salvas!");
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renderNotificationsList = () => {
    const activeNotifications = notifications.filter((n) => !n.arquivada);

    if (activeNotifications.length === 0) {
      return (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhuma notificação</h3>
          <p className="text-muted-foreground">
            Você está em dia com todos os contratos!
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Header com ações */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-medium">
              Notificações ({activeNotifications.length})
            </h3>
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} não lidas</Badge>
            )}
            {urgentCount > 0 && (
              <Badge variant="destructive">{urgentCount} urgentes</Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Marcar todas como lidas
            </Button>
          )}
        </div>

        {/* Lista de notificações */}
        <div className="space-y-3">
          {activeNotifications.map((notification) => {
            const Icon = getTypeIcon(notification.tipo);

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 border rounded-lg transition-all ${
                  !notification.visualizada
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      notification.prioridade === "critica"
                        ? "bg-red-100"
                        : notification.prioridade === "alta"
                          ? "bg-yellow-100"
                          : "bg-blue-100"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        notification.prioridade === "critica"
                          ? "text-red-600"
                          : notification.prioridade === "alta"
                            ? "text-yellow-600"
                            : "text-blue-600"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">
                            {notification.titulo}
                          </h4>
                          <Badge
                            className={getPriorityColor(
                              notification.prioridade,
                            )}
                          >
                            {notification.prioridade}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.mensagem}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{notification.cliente}</span>
                          <span>•</span>
                          <span>
                            {new Date(notification.criadaEm).toLocaleDateString(
                              "pt-BR",
                            )}
                          </span>
                          {notification.dataVencimento && (
                            <>
                              <span>•</span>
                              <span className="text-red-600">
                                Vence:{" "}
                                {new Date(
                                  notification.dataVencimento,
                                ).toLocaleDateString("pt-BR")}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!notification.visualizada && (
                            <DropdownMenuItem
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Marcar como lida
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => archiveNotification(notification.id)}
                          >
                            <Archive className="h-4 w-4 mr-2" />
                            Arquivar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Ação */}
                    {notification.acao && (
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={notification.acao.callback}
                        >
                          {notification.acao.label}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">Configurações de Notificação</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Configure como e quando você deseja receber notificações sobre seus
          contratos.
        </p>
      </div>

      {/* Notificações por Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Notificações por Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Assinatura Pendente</Label>
              <p className="text-sm text-muted-foreground">
                Quando um contrato está aguardando assinatura
              </p>
            </div>
            <Switch
              checked={settings.email.assinaturaPendente}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  email: { ...prev.email, assinaturaPendente: checked },
                }))
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Pagamento Vencido</Label>
              <p className="text-sm text-muted-foreground">
                Quando um pagamento está em atraso
              </p>
            </div>
            <Switch
              checked={settings.email.pagamentoVencido}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  email: { ...prev.email, pagamentoVencido: checked },
                }))
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Contrato Expirando</Label>
              <p className="text-sm text-muted-foreground">
                Quando um contrato está próximo do vencimento
              </p>
            </div>
            <Switch
              checked={settings.email.contratoExpirando}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  email: { ...prev.email, contratoExpirando: checked },
                }))
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Falhas no Stripe</Label>
              <p className="text-sm text-muted-foreground">
                Quando há problemas com pagamentos automáticos
              </p>
            </div>
            <Switch
              checked={settings.email.stripeFalha}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  email: { ...prev.email, stripeFalha: checked },
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Notificações por SMS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Notificações por SMS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Assinatura Pendente</Label>
              <p className="text-sm text-muted-foreground">
                SMS para assinaturas urgentes
              </p>
            </div>
            <Switch
              checked={settings.sms.assinaturaPendente}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  sms: { ...prev.sms, assinaturaPendente: checked },
                }))
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Pagamento Vencido</Label>
              <p className="text-sm text-muted-foreground">
                SMS para pagamentos em atraso crítico
              </p>
            </div>
            <Switch
              checked={settings.sms.pagamentoVencido}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  sms: { ...prev.sms, pagamentoVencido: checked },
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Botão de salvar */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {contratoId
              ? "Notificações do Contrato"
              : "Central de Notificações"}
          </DialogTitle>
          <DialogDescription>
            {contratoId
              ? "Acompanhe todas as notificações relacionadas a este contrato"
              : "Gerencie todas as notificações dos seus contratos"}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications">
              Notificações
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="mt-6">
            {renderNotificationsList()}
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            {renderSettings()}
          </TabsContent>
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
