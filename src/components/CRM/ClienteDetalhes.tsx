import { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Scale,
  FileText,
  MessageSquare,
  Calendar,
  Edit,
  Share2,
  MoreHorizontal,
  ArrowLeft,
  Shield,
  ExternalLink,
  ChevronRight,
  Building,
  Clock,
  Star,
  Download,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProcessosDoCliente } from "./ProcessosDoCliente";
import { PublicacoesCliente } from "./PublicacoesCliente";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ClientData {
  id: string;
  nome: string;
  documento: string;
  email: string;
  telefone: string;
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    complemento?: string;
  };
  tipo: "pf" | "pj";
  status: "ativo" | "inativo" | "suspenso";
  avatar?: string;
  observacoes?: string;
  dataCadastro: string;
  ultimoContato: string;
  totalProcessos: number;
  totalPublicacoes: number;
  valorRecebido: string;
  tags: string[];
}

interface ClienteDetalhesProps {
  clienteId: string;
  onBack?: () => void;
  onEdit?: (cliente: ClientData) => void;
}

// Touch gesture handler for mobile swipe
const useSwipeGesture = (onSwipeLeft: () => void, onSwipeRight: () => void) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) onSwipeLeft();
    if (isRightSwipe) onSwipeRight();
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
};

export function ClienteDetalhes({
  clienteId,
  onBack,
  onEdit,
}: ClienteDetalhesProps) {
  const [cliente, setCliente] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [changeHistory, setChangeHistory] = useState<any[]>([]);

  const tabs = [
    { id: "overview", label: "Visão Geral", icon: User },
    { id: "processos", label: "Processos", icon: Scale },
    { id: "publicacoes", label: "Publicações", icon: FileText },
    { id: "contratos", label: "Contratos", icon: FileText },
    { id: "documentos", label: "Documentos", icon: Download },
    { id: "atendimento", label: "Atendimento", icon: MessageSquare },
  ];

  const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab);

  const swipeHandlers = useSwipeGesture(
    () => {
      // Swipe left - next tab
      if (currentTabIndex < tabs.length - 1) {
        setActiveTab(tabs[currentTabIndex + 1].id);
      }
    },
    () => {
      // Swipe right - previous tab
      if (currentTabIndex > 0) {
        setActiveTab(tabs[currentTabIndex - 1].id);
      }
    },
  );

  // Fetch client data
  useEffect(() => {
    const fetchClientData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockClient: ClientData = {
          id: clienteId,
          nome: "João Silva dos Santos",
          documento: "123.456.789-00",
          email: "joao.silva@email.com",
          telefone: "(11) 99999-9999",
          endereco: {
            rua: "Av. Paulista",
            numero: "1000",
            bairro: "Bela Vista",
            cidade: "São Paulo",
            estado: "SP",
            cep: "01310-100",
            complemento: "Conjunto 101",
          },
          tipo: "pf",
          status: "ativo",
          avatar: "",
          observacoes:
            "Cliente preferencial. Histórico de bom relacionamento. Prefere contato por WhatsApp.",
          dataCadastro: "2024-01-15",
          ultimoContato: "2024-12-15",
          totalProcessos: 3,
          totalPublicacoes: 8,
          valorRecebido: "R$ 45.000,00",
          tags: ["VIP", "Pagamento em dia", "Direito Civil"],
        };

        setCliente(mockClient);

        // Mock change history
        setChangeHistory([
          {
            id: 1,
            action: "Telefone atualizado",
            timestamp: "2024-12-15T10:30:00",
            user: "Dr. Pedro Costa",
          },
          {
            id: 2,
            action: "Cliente cadastrado",
            timestamp: "2024-01-15T14:20:00",
            user: "Dra. Ana Lima",
          },
        ]);
      } catch (error) {
        toast.error("Erro ao carregar dados do cliente");
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clienteId]);

  const handleWhatsAppContact = () => {
    if (cliente) {
      const cleanPhone = cliente.telefone.replace(/[^\d]/g, "");
      const message = encodeURIComponent(
        `Olá ${cliente.nome.split(" ")[0]}, tudo bem? Aqui é do escritório de advocacia.`,
      );
      window.open(`https://wa.me/55${cleanPhone}?text=${message}`, "_blank");

      // Log interaction
      toast.success("Redirecionando para WhatsApp...");
    }
  };

  const handleGovBrAccess = () => {
    toast.info("Funcionalidade GOV.BR em desenvolvimento");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="h-32 bg-muted rounded-2xl animate-pulse" />
        <div className="h-96 bg-muted rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Cliente não encontrado</h3>
        <p className="text-muted-foreground">
          Verifique o ID do cliente e tente novamente.
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={onBack}
                className="cursor-pointer hover:text-[rgb(var(--theme-primary))]"
              >
                Todos os Clientes
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>{cliente.nome}</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Client Header Summary */}
        <Card className="rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={cliente.avatar} alt={cliente.nome} />
                  <AvatarFallback className="text-2xl">
                    {cliente.nome
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-3">
                  <div>
                    <h1 className="text-2xl font-bold">{cliente.nome}</h1>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          {cliente.documento}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {cliente.tipo === "pf" ? (
                            <>
                              <User className="h-3 w-3 mr-1" />
                              PF
                            </>
                          ) : (
                            <>
                              <Building className="h-3 w-3 mr-1" />
                              PJ
                            </>
                          )}
                        </Badge>
                      </div>
                      <Badge
                        variant={
                          cliente.status === "ativo" ? "default" : "secondary"
                        }
                      >
                        {cliente.status === "ativo" ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{cliente.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{cliente.telefone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {cliente.endereco.cidade}, {cliente.endereco.estado}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Último contato:{" "}
                        {new Date(cliente.ultimoContato).toLocaleDateString(
                          "pt-BR",
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {cliente.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleWhatsAppContact}
                      className="bg-green-500 hover:bg-green-600 text-white border-green-500"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Contatar via WhatsApp</p>
                  </TooltipContent>
                </Tooltip>

                {cliente.tipo === "pf" && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGovBrAccess}
                        className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Acessar GOV.BR</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(cliente)}
                >
                  <Edit className="h-4 w-4" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartilhar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Dados
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver no Sistema Legado
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[rgb(var(--theme-primary))]">
                {cliente.totalProcessos}
              </div>
              <div className="text-sm text-muted-foreground">Processos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {cliente.totalPublicacoes}
              </div>
              <div className="text-sm text-muted-foreground">Publicações</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {cliente.valorRecebido}
              </div>
              <div className="text-sm text-muted-foreground">Valor Total</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">Avaliação</div>
            </div>
          </div>
        </Card>

        {/* Tabs with Mobile Swipe Support */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-flex">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center space-x-2 min-w-0"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div {...swipeHandlers}>
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Information */}
                <Card className="rounded-2xl shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Informações de Contato</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          E-mail:
                        </span>
                        <span className="text-sm">{cliente.email}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Telefone:
                        </span>
                        <span className="text-sm">{cliente.telefone}</span>
                      </div>
                      <div className="flex items-start justify-between">
                        <span className="text-sm text-muted-foreground">
                          Endereço:
                        </span>
                        <div className="text-sm text-right">
                          <div>
                            {cliente.endereco.rua}, {cliente.endereco.numero}
                          </div>
                          {cliente.endereco.complemento && (
                            <div>{cliente.endereco.complemento}</div>
                          )}
                          <div>{cliente.endereco.bairro}</div>
                          <div>
                            {cliente.endereco.cidade}, {cliente.endereco.estado}
                          </div>
                          <div>{cliente.endereco.cep}</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button
                        onClick={handleWhatsAppContact}
                        className="w-full bg-green-500 hover:bg-green-600"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contatar via WhatsApp
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes and History */}
                <Card className="rounded-2xl shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Observações & Histórico</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cliente.observacoes && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Observações:
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {cliente.observacoes}
                        </p>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Histórico de Alterações:
                      </h4>
                      <div className="space-y-2">
                        {changeHistory.map((change) => (
                          <div
                            key={change.id}
                            className="flex items-center justify-between text-xs"
                          >
                            <span>{change.action}</span>
                            <span className="text-muted-foreground">
                              {new Date(change.timestamp).toLocaleDateString(
                                "pt-BR",
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="processos">
              <ProcessosDoCliente
                cpf={cliente.documento}
                clienteName={cliente.nome}
              />
            </TabsContent>

            <TabsContent value="publicacoes">
              <PublicacoesCliente
                cpf={cliente.documento}
                clienteName={cliente.nome}
              />
            </TabsContent>

            <TabsContent value="contratos" className="space-y-6">
              <Card className="rounded-2xl shadow-md">
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">Gestão de Contratos</h3>
                  <p className="text-muted-foreground mb-6">
                    Funcionalidade em desenvolvimento. Em breve você poderá
                    gerenciar todos os contratos do cliente.
                  </p>
                  <Button variant="outline">Ver Contratos Disponíveis</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documentos" className="space-y-6">
              <Card className="rounded-2xl shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Download className="h-5 w-5" />
                      <span>Documentos do Cliente</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "RG - Frente e Verso.pdf",
                        size: "2.3 MB",
                        date: "2024-01-15",
                      },
                      { name: "CPF.pdf", size: "1.1 MB", date: "2024-01-15" },
                      {
                        name: "Comprovante de Residência.pdf",
                        size: "1.8 MB",
                        date: "2024-02-10",
                      },
                    ].map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.size} •{" "}
                              {new Date(doc.date).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="atendimento" className="space-y-6">
              <Card className="rounded-2xl shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Histórico de Atendimento</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        id: 1,
                        type: "whatsapp",
                        message: "Dúvida sobre andamento do processo",
                        date: "2024-12-15T10:30:00",
                        status: "resolvido",
                      },
                      {
                        id: 2,
                        type: "email",
                        message: "Solicitação de documentos",
                        date: "2024-12-10T14:20:00",
                        status: "resolvido",
                      },
                      {
                        id: 3,
                        type: "presencial",
                        message: "Reunião de acompanhamento",
                        date: "2024-12-05T16:00:00",
                        status: "resolvido",
                      },
                    ].map((ticket) => (
                      <div
                        key={ticket.id}
                        className="flex items-start space-x-4 p-4 border rounded-lg"
                      >
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{ticket.message}</p>
                            <Badge variant="secondary">{ticket.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(ticket.date).toLocaleString("pt-BR")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        {/* Mobile Navigation Hint */}
        <div className="md:hidden text-center text-sm text-muted-foreground">
          Deslize para navegar entre as abas
        </div>

        {/* Floating Chat Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="lg"
                className="rounded-full h-14 w-14 shadow-lg bg-[rgb(var(--theme-primary))] hover:bg-[rgb(var(--theme-primary))]/90"
                onClick={() => toast.info("Chat interno em desenvolvimento")}
              >
                <MessageSquare className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Chat interno da equipe</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
