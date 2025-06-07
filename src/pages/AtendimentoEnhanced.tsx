import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageCircle,
  Mail,
  User,
  Calendar,
  MoreHorizontal,
  Phone,
  WhatsApp,
  FileText,
  Paperclip,
  Send,
  Star,
  Flag,
  Archive,
  Reply,
  Forward,
  Printer,
  Download,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Building,
  MapPin,
  Tag,
  Timer,
  TrendingUp,
  BarChart3,
  Activity,
  Users,
  Headphones,
  Bot,
  Zap,
  Settings,
  RefreshCw,
  X,
  Check,
  AlertCircle,
  Info,
  Hash,
  AtSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { usePermissions } from "@/hooks/usePermissions";
import {
  useAuditSystem,
  AUDIT_ACTIONS,
  AUDIT_MODULES,
} from "@/hooks/useAuditSystem";
import { useTarefaIntegration } from "@/hooks/useTarefaIntegration";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Client {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipo: "fisica" | "juridica";
  avatar?: string;
  empresa?: string;
  endereco?: string;
  status: "ativo" | "inativo" | "prospect";
}

interface Ticket {
  id: string;
  numero: string;
  titulo: string;
  descricao: string;
  cliente: Client;
  categoria: "consulta" | "suporte" | "reclamacao" | "solicitacao" | "urgente";
  prioridade: "baixa" | "media" | "alta" | "critica";
  status:
    | "aberto"
    | "em_andamento"
    | "aguardando_cliente"
    | "resolvido"
    | "fechado";
  canal:
    | "whatsapp"
    | "email"
    | "telefone"
    | "presencial"
    | "chat"
    | "formulario";
  responsavel?: {
    id: string;
    nome: string;
    avatar?: string;
  };
  dataAbertura: string;
  dataAtualizacao: string;
  dataResolucao?: string;
  prazoSLA: string;
  tempoResposta?: number;
  satisfacao?: {
    nota: number;
    comentario?: string;
    data: string;
  };
  tags: string[];
  anexos: Array<{
    id: string;
    nome: string;
    tipo: string;
    tamanho: number;
    url: string;
  }>;
  vinculado?: {
    tipo: "processo" | "contrato" | "tarefa";
    id: string;
    titulo: string;
  };
  historico: Array<{
    id: string;
    tipo: "mensagem" | "status" | "responsavel" | "sistema";
    autor: string;
    conteudo: string;
    timestamp: string;
    interno: boolean;
  }>;
}

interface TicketStats {
  total: number;
  abertos: number;
  emAndamento: number;
  resolvidos: number;
  fechados: number;
  foraSLA: number;
  tempoMedioResposta: number;
  satisfacaoMedia: number;
  taxaResolucao: number;
}

export default function AtendimentoEnhanced() {
  const [activeTab, setActiveTab] = useState("tickets");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterResponsavel, setFilterResponsavel] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTicket, setNewTicket] = useState<Partial<Ticket>>({});
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const { user, hasPermission } = usePermissions();
  const { logAction } = useAuditSystem();
  const { criarTarefaDeAtendimento } = useTarefaIntegration();

  // Mock data
  useEffect(() => {
    const loadTickets = async () => {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockTickets: Ticket[] = [
        {
          id: "ticket-001",
          numero: "2024-001",
          titulo: "Dúvida sobre processo trabalhista",
          descricao:
            "Cliente tem dúvidas sobre os direitos trabalhistas em caso de demissão sem justa causa.",
          cliente: {
            id: "cli-001",
            nome: "João Silva",
            email: "joao.silva@email.com",
            telefone: "(11) 99999-9999",
            tipo: "fisica",
            status: "ativo",
          },
          categoria: "consulta",
          prioridade: "alta",
          status: "aberto",
          canal: "whatsapp",
          responsavel: {
            id: "user-001",
            nome: "Dr. Pedro Costa",
          },
          dataAbertura: "2024-01-15T10:30:00Z",
          dataAtualizacao: "2024-01-15T14:20:00Z",
          prazoSLA: "2024-01-16T10:30:00Z",
          tempoResposta: 45,
          tags: ["trabalhista", "demissao", "urgente"],
          anexos: [],
          historico: [
            {
              id: "hist-001",
              tipo: "mensagem",
              autor: "João Silva",
              conteudo:
                "Oi, preciso esclarecer uma dúvida urgente sobre meu processo trabalhista. Fui demitido sem justa causa e gostaria de saber quais são meus direitos.",
              timestamp: "2024-01-15T10:30:00Z",
              interno: false,
            },
            {
              id: "hist-002",
              tipo: "sistema",
              autor: "Sistema",
              conteudo: "Ticket criado automaticamente via WhatsApp",
              timestamp: "2024-01-15T10:30:00Z",
              interno: true,
            },
          ],
        },
        {
          id: "ticket-002",
          numero: "2024-002",
          titulo: "Documentos para audiência",
          descricao:
            "Cliente precisa dos documentos necessários para audiência de conciliação.",
          cliente: {
            id: "cli-002",
            nome: "Maria Santos",
            email: "maria.santos@email.com",
            telefone: "(11) 88888-8888",
            tipo: "fisica",
            status: "ativo",
          },
          categoria: "solicitacao",
          prioridade: "media",
          status: "em_andamento",
          canal: "email",
          responsavel: {
            id: "user-002",
            nome: "Dra. Ana Costa",
          },
          dataAbertura: "2024-01-14T14:15:00Z",
          dataAtualizacao: "2024-01-15T09:00:00Z",
          prazoSLA: "2024-01-17T14:15:00Z",
          tempoResposta: 120,
          tags: ["audiencia", "documentos"],
          anexos: [
            {
              id: "anexo-001",
              nome: "lista-documentos.pdf",
              tipo: "application/pdf",
              tamanho: 245760,
              url: "/anexos/lista-documentos.pdf",
            },
          ],
          vinculado: {
            tipo: "processo",
            id: "proc-001",
            titulo: "Processo 1001234-12.2024.5.02.0001",
          },
          historico: [
            {
              id: "hist-003",
              tipo: "mensagem",
              autor: "Maria Santos",
              conteudo:
                "Preciso saber quais documentos devo levar para a audiência de conciliação na próxima semana.",
              timestamp: "2024-01-14T14:15:00Z",
              interno: false,
            },
            {
              id: "hist-004",
              tipo: "mensagem",
              autor: "Dra. Ana Costa",
              conteudo:
                "Boa tarde, Maria! Vou preparar a lista completa dos documentos necessários. Em anexo está a relação inicial.",
              timestamp: "2024-01-15T09:00:00Z",
              interno: false,
            },
          ],
        },
      ];

      setTickets(mockTickets);
      setFilteredTickets(mockTickets);

      // Calculate stats
      const mockStats: TicketStats = {
        total: mockTickets.length,
        abertos: mockTickets.filter((t) => t.status === "aberto").length,
        emAndamento: mockTickets.filter((t) => t.status === "em_andamento")
          .length,
        resolvidos: mockTickets.filter((t) => t.status === "resolvido").length,
        fechados: mockTickets.filter((t) => t.status === "fechado").length,
        foraSLA: mockTickets.filter((t) => new Date(t.prazoSLA) < new Date())
          .length,
        tempoMedioResposta: 82,
        satisfacaoMedia: 4.6,
        taxaResolucao: 94.2,
      };

      setStats(mockStats);
      setIsLoading(false);
    };

    loadTickets();
  }, []);

  // Filter tickets
  useEffect(() => {
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.cliente.nome
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          ticket.numero.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === filterStatus);
    }

    if (filterPriority !== "all") {
      filtered = filtered.filter(
        (ticket) => ticket.prioridade === filterPriority,
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter(
        (ticket) => ticket.categoria === filterCategory,
      );
    }

    if (filterResponsavel !== "all") {
      filtered = filtered.filter(
        (ticket) => ticket.responsavel?.id === filterResponsavel,
      );
    }

    setFilteredTickets(filtered);
  }, [
    tickets,
    searchTerm,
    filterStatus,
    filterPriority,
    filterCategory,
    filterResponsavel,
  ]);

  // Status configuration
  const statusConfig = {
    aberto: { label: "Aberto", color: "bg-red-500", icon: AlertCircle },
    em_andamento: {
      label: "Em Andamento",
      color: "bg-yellow-500",
      icon: Clock,
    },
    aguardando_cliente: {
      label: "Aguardando Cliente",
      color: "bg-blue-500",
      icon: MessageCircle,
    },
    resolvido: { label: "Resolvido", color: "bg-green-500", icon: CheckCircle },
    fechado: { label: "Fechado", color: "bg-gray-500", icon: Archive },
  };

  const priorityConfig = {
    baixa: {
      label: "Baixa",
      color: "text-green-600 bg-green-50",
      variant: "secondary" as const,
    },
    media: {
      label: "Média",
      color: "text-yellow-600 bg-yellow-50",
      variant: "default" as const,
    },
    alta: {
      label: "Alta",
      color: "text-orange-600 bg-orange-50",
      variant: "default" as const,
    },
    critica: {
      label: "Crítica",
      color: "text-red-600 bg-red-50",
      variant: "destructive" as const,
    },
  };

  const channelConfig = {
    whatsapp: {
      label: "WhatsApp",
      icon: MessageSquare,
      color: "text-green-600",
    },
    email: { label: "E-mail", icon: Mail, color: "text-blue-600" },
    telefone: { label: "Telefone", icon: Phone, color: "text-purple-600" },
    presencial: { label: "Presencial", icon: User, color: "text-gray-600" },
    chat: { label: "Chat", icon: MessageCircle, color: "text-indigo-600" },
    formulario: {
      label: "Formulário",
      icon: FileText,
      color: "text-orange-600",
    },
  };

  // Handle ticket selection
  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    logAction(AUDIT_ACTIONS.READ, AUDIT_MODULES.TICKETS, {
      ticketId: ticket.id,
      ticketNumber: ticket.numero,
    });
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket || !user) return;

    const newHistoryEntry = {
      id: crypto.randomUUID(),
      tipo: "mensagem" as const,
      autor: user.name,
      conteudo: newMessage,
      timestamp: new Date().toISOString(),
      interno: false,
    };

    // Update ticket
    const updatedTicket = {
      ...selectedTicket,
      historico: [...selectedTicket.historico, newHistoryEntry],
      dataAtualizacao: new Date().toISOString(),
    };

    setSelectedTicket(updatedTicket);
    setTickets((prev) =>
      prev.map((t) => (t.id === selectedTicket.id ? updatedTicket : t)),
    );
    setNewMessage("");

    await logAction(AUDIT_ACTIONS.UPDATE, AUDIT_MODULES.TICKETS, {
      ticketId: selectedTicket.id,
      action: "message_sent",
      message: newMessage,
    });

    toast.success("Mensagem enviada com sucesso");
  };

  // Handle status change
  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    const updatedTickets = tickets.map((ticket) =>
      ticket.id === ticketId
        ? {
            ...ticket,
            status: newStatus as any,
            dataAtualizacao: new Date().toISOString(),
          }
        : ticket,
    );

    setTickets(updatedTickets);

    if (selectedTicket?.id === ticketId) {
      setSelectedTicket((prev) =>
        prev ? { ...prev, status: newStatus as any } : null,
      );
    }

    await logAction(AUDIT_ACTIONS.UPDATE, AUDIT_MODULES.TICKETS, {
      ticketId,
      oldStatus: tickets.find((t) => t.id === ticketId)?.status,
      newStatus,
    });

    toast.success("Status atualizado com sucesso");
  };

  // Handle create task from ticket
  const handleCreateTask = async (ticket: Ticket) => {
    await criarTarefaDeAtendimento(
      ticket.id,
      `Atender ticket: ${ticket.titulo}`,
    );
    toast.success("Tarefa criada com sucesso");
  };

  if (!hasPermission("atendimento", "read")) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Acesso Negado</h3>
          <p className="text-muted-foreground">
            Você não tem permissão para acessar o módulo de atendimento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Headphones className="h-8 w-8 text-primary" />
              Atendimento ao Cliente
            </h1>
            <p className="text-muted-foreground">
              Gestão completa de tickets e suporte ao cliente
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Ticket
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total de Tickets
                    </p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Em Andamento
                    </p>
                    <p className="text-2xl font-bold">{stats.emAndamento}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tempo Médio</p>
                    <p className="text-2xl font-bold">
                      {stats.tempoMedioResposta}min
                    </p>
                  </div>
                  <Timer className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Satisfação</p>
                    <p className="text-2xl font-bold">
                      {stats.satisfacaoMedia}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Tickets ({filteredTickets.length})
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              {/* Filters */}
              <div className="space-y-2">
                <Input
                  placeholder="Buscar tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8"
                />

                <div className="grid grid-cols-2 gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="aberto">Aberto</SelectItem>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="resolvido">Resolvido</SelectItem>
                      <SelectItem value="fechado">Fechado</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filterPriority}
                    onValueChange={setFilterPriority}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="critica">Crítica</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="baixa">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-2 p-4">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : filteredTickets.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum ticket encontrado</p>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {filteredTickets.map((ticket, index) => {
                        const StatusIcon = statusConfig[ticket.status].icon;
                        const ChannelIcon = channelConfig[ticket.canal].icon;
                        const isSelected = selectedTicket?.id === ticket.id;
                        const isOverdue =
                          new Date(ticket.prazoSLA) < new Date();

                        return (
                          <motion.div
                            key={ticket.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Card
                              className={`cursor-pointer transition-all hover:shadow-md ${
                                isSelected
                                  ? "ring-2 ring-primary bg-accent"
                                  : ""
                              } ${isOverdue ? "border-red-200 bg-red-50/50" : ""}`}
                              onClick={() => handleTicketSelect(ticket)}
                            >
                              <CardContent className="p-3">
                                <div className="space-y-2">
                                  {/* Header */}
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={`p-1 rounded-full ${statusConfig[ticket.status].color} text-white`}
                                      >
                                        <StatusIcon className="h-3 w-3" />
                                      </div>
                                      <span className="text-xs font-mono text-muted-foreground">
                                        #{ticket.numero}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Badge
                                        variant={
                                          priorityConfig[ticket.prioridade]
                                            .variant
                                        }
                                        className="text-xs"
                                      >
                                        {
                                          priorityConfig[ticket.prioridade]
                                            .label
                                        }
                                      </Badge>
                                      {isOverdue && (
                                        <AlertTriangle className="h-3 w-3 text-red-500" />
                                      )}
                                    </div>
                                  </div>

                                  {/* Title */}
                                  <h4 className="font-medium text-sm leading-tight line-clamp-2">
                                    {ticket.titulo}
                                  </h4>

                                  {/* Client */}
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="text-xs">
                                        {ticket.cliente.nome
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs text-muted-foreground truncate">
                                      {ticket.cliente.nome}
                                    </span>
                                  </div>

                                  {/* Footer */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <ChannelIcon
                                        className={`h-3 w-3 ${channelConfig[ticket.canal].color}`}
                                      />
                                      <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(
                                          new Date(ticket.dataAtualizacao),
                                          {
                                            addSuffix: true,
                                            locale: ptBR,
                                          },
                                        )}
                                      </span>
                                    </div>
                                    {ticket.responsavel && (
                                      <Avatar className="h-4 w-4">
                                        <AvatarFallback className="text-xs">
                                          {ticket.responsavel.nome
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Ticket Details */}
          <Card className="lg:col-span-2">
            {selectedTicket ? (
              <>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-lg font-semibold">
                          {selectedTicket.titulo}
                        </h2>
                        <Badge variant="outline">
                          #{selectedTicket.numero}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {selectedTicket.cliente.nome}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(
                            new Date(selectedTicket.dataAbertura),
                            "dd/MM/yyyy HH:mm",
                            { locale: ptBR },
                          )}
                        </div>
                        {selectedTicket.vinculado && (
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {selectedTicket.vinculado.titulo}
                          </div>
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
                        <DropdownMenuItem
                          onClick={() => handleCreateTask(selectedTicket)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Criar Tarefa
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Printer className="h-4 w-4 mr-2" />
                          Imprimir
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Exportar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Archive className="h-4 w-4 mr-2" />
                          Arquivar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Status and Priority */}
                  <div className="flex items-center gap-4">
                    <Select
                      value={selectedTicket.status}
                      onValueChange={(value) =>
                        handleStatusChange(selectedTicket.id, value)
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusConfig).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <config.icon className="h-3 w-3" />
                              {config.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Badge
                      variant={
                        priorityConfig[selectedTicket.prioridade].variant
                      }
                    >
                      {priorityConfig[selectedTicket.prioridade].label}
                    </Badge>

                    <Badge variant="outline">
                      {channelConfig[selectedTicket.canal].label}
                    </Badge>

                    {selectedTicket.responsavel && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-3 w-3" />
                        {selectedTicket.responsavel.nome}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Descrição</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedTicket.descricao}
                    </p>
                  </div>

                  {/* Conversation */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Histórico de Conversas</h3>

                    <ScrollArea className="h-96">
                      <div className="space-y-4 pr-4">
                        {selectedTicket.historico.map((entry) => (
                          <div
                            key={entry.id}
                            className={`flex gap-3 ${entry.interno ? "opacity-60" : ""}`}
                          >
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback className="text-xs">
                                {entry.autor === "Sistema"
                                  ? "S"
                                  : entry.autor
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">
                                  {entry.autor}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {format(
                                    new Date(entry.timestamp),
                                    "dd/MM HH:mm",
                                    { locale: ptBR },
                                  )}
                                </span>
                                {entry.interno && (
                                  <Badge variant="outline" className="text-xs">
                                    Interno
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm bg-muted rounded-lg p-3">
                                {entry.conteudo}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    {/* Reply */}
                    <div className="border-t pt-4">
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {user?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "U"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2">
                          <Textarea
                            placeholder="Digite sua resposta..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            rows={3}
                          />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Paperclip className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Tag className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button
                              onClick={handleSendMessage}
                              disabled={!newMessage.trim()}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Enviar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    Selecione um Ticket
                  </h3>
                  <p className="text-muted-foreground">
                    Escolha um ticket da lista para ver os detalhes
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Create Ticket Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo Ticket de Atendimento</DialogTitle>
              <DialogDescription>
                Crie um novo ticket para registrar uma solicitação ou problema
                do cliente
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Cliente</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cli-001">João Silva</SelectItem>
                    <SelectItem value="cli-002">Maria Santos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Categoria</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consulta">Consulta</SelectItem>
                    <SelectItem value="suporte">Suporte</SelectItem>
                    <SelectItem value="reclamacao">Reclamação</SelectItem>
                    <SelectItem value="solicitacao">Solicitação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Prioridade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="critica">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Canal</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o canal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="email">E-mail</SelectItem>
                    <SelectItem value="telefone">Telefone</SelectItem>
                    <SelectItem value="presencial">Presencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Título</Label>
              <Input placeholder="Digite o título do ticket" />
            </div>

            <div>
              <Label>Descrição</Label>
              <Textarea
                placeholder="Descreva detalhadamente a solicitação ou problema"
                rows={4}
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancelar
              </Button>
              <Button onClick={() => setShowCreateDialog(false)}>
                Criar Ticket
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
