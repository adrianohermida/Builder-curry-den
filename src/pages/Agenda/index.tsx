import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Video,
  Phone,
  Filter,
  Grid3X3,
  List,
  Eye,
  Edit,
  Trash2,
  Bell,
  BellOff,
  Star,
  FileText,
  Gavel,
  Building,
  User,
  AlertTriangle,
  CheckCircle,
  Search,
  MoreHorizontal,
  Download,
  Settings,
  RefreshCw,
  ExternalLink,
  Copy,
  Share2,
  Calendar as CalIcon,
  Timer,
  Target,
  Flag,
  MessageSquare,
  Zap,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import { usePermissions } from "@/hooks/usePermissions";
import {
  useAuditSystem,
  AUDIT_ACTIONS,
  AUDIT_MODULES,
} from "@/hooks/useAuditSystem";
import { useTarefaIntegration } from "@/hooks/useTarefaIntegration";
import { toast } from "sonner";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addMonths,
  isSameDay,
  parseISO,
  isToday,
  isPast,
  isFuture,
  startOfDay,
  endOfDay,
  addWeeks,
  subWeeks,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";

// Definir tipos para agenda jurídica
export interface Appointment {
  id: string;
  titulo: string;
  descricao?: string;
  dataInicio: string;
  dataFim: string;
  diaInteiro: boolean;
  tipo: "audiencia" | "reuniao" | "video" | "telefone" | "prazo" | "outro";
  status: "agendado" | "confirmado" | "cancelado" | "adiado" | "concluido";
  prioridade: "baixa" | "media" | "alta" | "urgente";
  local?: {
    nome: string;
    endereco?: string;
    sala?: string;
    tipo: "presencial" | "online" | "hibrido";
    link?: string;
  };
  participantes: Array<{
    id: string;
    nome: string;
    email?: string;
    telefone?: string;
    tipo:
      | "cliente"
      | "advogado"
      | "juiz"
      | "parte_contraria"
      | "testemunha"
      | "outro";
    confirmado: boolean;
  }>;
  processo?: {
    numero: string;
    nome: string;
    id: string;
  };
  cliente?: {
    id: string;
    nome: string;
    avatar?: string;
  };
  responsavel: {
    id: string;
    nome: string;
    avatar?: string;
  };
  recorrencia?: {
    tipo: "diaria" | "semanal" | "mensal" | "anual";
    intervalo: number;
    dataFim?: string;
  };
  lembretes: Array<{
    tipo: "email" | "sms" | "push" | "whatsapp";
    antecedencia: number; // em minutos
    ativo: boolean;
  }>;
  anexos: Array<{
    id: string;
    nome: string;
    url: string;
    tipo: string;
  }>;
  observacoes?: string;
  criado: string;
  atualizado: string;
}

interface AgendaView {
  type: "month" | "week" | "day" | "list";
  date: Date;
}

export default function AgendaJuridica() {
  const [view, setView] = useState<AgendaView>({
    type: "month",
    date: new Date(),
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterResponsavel, setFilterResponsavel] = useState("all");
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    tipo: "reuniao",
    status: "agendado",
    prioridade: "media",
    diaInteiro: false,
    participantes: [],
    lembretes: [
      { tipo: "email", antecedencia: 30, ativo: true },
      { tipo: "push", antecedencia: 15, ativo: true },
    ],
    anexos: [],
  });

  const { user, hasPermission } = usePermissions();
  const { logAction } = useAuditSystem();
  const { criarTarefaDeAgenda } = useTarefaIntegration();

  // Mock data com integração aos módulos existentes
  useEffect(() => {
    const loadAppointments = async () => {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockAppointments: Appointment[] = [
        {
          id: "apt-001",
          titulo: "Audiência de Conciliação",
          descricao:
            "Audiência de conciliação no processo trabalhista de João Silva",
          dataInicio: "2024-01-20T14:30:00Z",
          dataFim: "2024-01-20T16:00:00Z",
          diaInteiro: false,
          tipo: "audiencia",
          status: "confirmado",
          prioridade: "alta",
          local: {
            nome: "TRT 2ª Região",
            endereco: "Rua do Tribunal, 123 - Centro, São Paulo - SP",
            sala: "Sala 5",
            tipo: "presencial",
          },
          participantes: [
            {
              id: "part-001",
              nome: "João Silva",
              email: "joao.silva@email.com",
              tipo: "cliente",
              confirmado: true,
            },
            {
              id: "part-002",
              nome: "Dr. Pedro Costa",
              email: "pedro.costa@lawdesk.com",
              tipo: "advogado",
              confirmado: true,
            },
          ],
          processo: {
            numero: "1234567-89.2024.8.26.0001",
            nome: "João Silva vs. Empresa ABC",
            id: "proc-001",
          },
          cliente: {
            id: "cli-001",
            nome: "João Silva",
          },
          responsavel: {
            id: "adv-001",
            nome: "Dr. Pedro Costa",
          },
          lembretes: [
            { tipo: "email", antecedencia: 60, ativo: true },
            { tipo: "sms", antecedencia: 30, ativo: true },
            { tipo: "push", antecedencia: 15, ativo: true },
          ],
          anexos: [
            {
              id: "anx-001",
              nome: "Petição Inicial.pdf",
              url: "/api/files/anexos/anx-001",
              tipo: "application/pdf",
            },
          ],
          observacoes:
            "Audiência de conciliação obrigatória. Cliente confirmou presença.",
          criado: "2024-01-15T10:00:00Z",
          atualizado: "2024-01-18T14:30:00Z",
        },
        {
          id: "apt-002",
          titulo: "Reunião com Cliente - Maria Santos",
          descricao: "Discussão sobre novo processo de divórcio consensual",
          dataInicio: "2024-01-22T10:00:00Z",
          dataFim: "2024-01-22T11:30:00Z",
          diaInteiro: false,
          tipo: "reuniao",
          status: "agendado",
          prioridade: "media",
          local: {
            nome: "Escritório - Sala de Reuniões 1",
            endereco: "Rua das Flores, 456 - Centro, São Paulo - SP",
            tipo: "presencial",
          },
          participantes: [
            {
              id: "part-003",
              nome: "Maria Santos",
              email: "maria.santos@email.com",
              telefone: "(11) 99999-9999",
              tipo: "cliente",
              confirmado: false,
            },
            {
              id: "part-004",
              nome: "Dra. Ana Lima",
              email: "ana.lima@lawdesk.com",
              tipo: "advogado",
              confirmado: true,
            },
          ],
          cliente: {
            id: "cli-002",
            nome: "Maria Santos",
          },
          responsavel: {
            id: "adv-002",
            nome: "Dra. Ana Lima",
          },
          lembretes: [
            { tipo: "email", antecedencia: 1440, ativo: true }, // 24h antes
            { tipo: "push", antecedencia: 30, ativo: true },
          ],
          anexos: [],
          observacoes:
            "Cliente solicitou orientações sobre divórcio consensual",
          criado: "2024-01-20T09:00:00Z",
          atualizado: "2024-01-20T09:00:00Z",
        },
        {
          id: "apt-003",
          titulo: "Videoconferência - Consultoria Empresarial",
          descricao: "Consulta sobre compliance e adequação à LGPD",
          dataInicio: "2024-01-21T16:00:00Z",
          dataFim: "2024-01-21T17:00:00Z",
          diaInteiro: false,
          tipo: "video",
          status: "confirmado",
          prioridade: "media",
          local: {
            nome: "Reunião Online",
            tipo: "online",
            link: "https://meet.google.com/abc-defg-hij",
          },
          participantes: [
            {
              id: "part-005",
              nome: "Empresa XYZ Ltda",
              email: "contato@empresaxyz.com",
              tipo: "cliente",
              confirmado: true,
            },
            {
              id: "part-006",
              nome: "Dr. Carlos Souza",
              email: "carlos.souza@lawdesk.com",
              tipo: "advogado",
              confirmado: true,
            },
          ],
          cliente: {
            id: "cli-003",
            nome: "Empresa XYZ Ltda",
          },
          responsavel: {
            id: "adv-003",
            nome: "Dr. Carlos Souza",
          },
          lembretes: [
            { tipo: "email", antecedencia: 60, ativo: true },
            { tipo: "push", antecedencia: 15, ativo: true },
          ],
          anexos: [
            {
              id: "anx-002",
              nome: "Questionário LGPD.xlsx",
              url: "/api/files/anexos/anx-002",
              tipo: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
          ],
          observacoes:
            "Consulta sobre adequação à LGPD e implementação de compliance",
          criado: "2024-01-19T14:00:00Z",
          atualizado: "2024-01-19T14:00:00Z",
        },
        {
          id: "apt-004",
          titulo: "Prazo - Protocolo de Recurso",
          descricao: "Prazo para protocolo de recurso de apelação",
          dataInicio: "2024-01-25T17:00:00Z",
          dataFim: "2024-01-25T17:00:00Z",
          diaInteiro: true,
          tipo: "prazo",
          status: "agendado",
          prioridade: "urgente",
          processo: {
            numero: "9876543-21.2024.8.26.0001",
            nome: "Carlos Oliveira vs. Banco DEF",
            id: "proc-002",
          },
          participantes: [
            {
              id: "part-007",
              nome: "Dr. Pedro Costa",
              email: "pedro.costa@lawdesk.com",
              tipo: "advogado",
              confirmado: true,
            },
          ],
          cliente: {
            id: "cli-004",
            nome: "Carlos Oliveira",
          },
          responsavel: {
            id: "adv-001",
            nome: "Dr. Pedro Costa",
          },
          lembretes: [
            { tipo: "email", antecedencia: 2880, ativo: true }, // 48h antes
            { tipo: "sms", antecedencia: 1440, ativo: true }, // 24h antes
            { tipo: "push", antecedencia: 480, ativo: true }, // 8h antes
            { tipo: "email", antecedencia: 60, ativo: true }, // 1h antes
          ],
          anexos: [
            {
              id: "anx-003",
              nome: "Minuta Recurso.docx",
              url: "/api/files/anexos/anx-003",
              tipo: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            },
          ],
          observacoes:
            "URGENTE: Prazo fatal para protocolo do recurso. Documentos prontos.",
          criado: "2024-01-10T10:00:00Z",
          atualizado: "2024-01-20T16:00:00Z",
        },
      ];

      setAppointments(mockAppointments);
      setFilteredAppointments(mockAppointments);
      setIsLoading(false);

      // Log da ação
      logAction(AUDIT_ACTIONS.READ, AUDIT_MODULES.CALENDAR, {
        appointments_loaded: mockAppointments.length,
      });
    };

    loadAppointments();
  }, [logAction]);

  // Verificar permissões
  if (!hasPermission("agenda", "read")) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Acesso Negado</h3>
              <p className="text-muted-foreground">
                Você não tem permissão para acessar a agenda jurídica.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Configurações de tipos de compromisso
  const typeConfig = {
    audiencia: {
      label: "Audiência",
      icon: CalendarIcon,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    reuniao: {
      label: "Reunião",
      icon: Users,
      color: "bg-green-500",
      textColor: "text-green-600",
      borderColor: "border-green-200",
    },
    video: {
      label: "Videoconferência",
      icon: Video,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      borderColor: "border-purple-200",
    },
    telefone: {
      label: "Ligação",
      icon: Phone,
      color: "bg-orange-500",
      textColor: "text-orange-600",
      borderColor: "border-orange-200",
    },
    prazo: {
      label: "Prazo",
      icon: AlertTriangle,
      color: "bg-red-500",
      textColor: "text-red-600",
      borderColor: "border-red-200",
    },
    outro: {
      label: "Outro",
      icon: Clock,
      color: "bg-gray-500",
      textColor: "text-gray-600",
      borderColor: "border-gray-200",
    },
  };

  // Configurações de status
  const statusConfig = {
    agendado: {
      label: "Agendado",
      color: "bg-blue-100 text-blue-800",
      icon: Clock,
    },
    confirmado: {
      label: "Confirmado",
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
    },
    cancelado: {
      label: "Cancelado",
      color: "bg-red-100 text-red-800",
      icon: AlertTriangle,
    },
    adiado: {
      label: "Adiado",
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
    },
    concluido: {
      label: "Concluído",
      color: "bg-gray-100 text-gray-800",
      icon: CheckCircle,
    },
  };

  // Configurações de prioridade
  const priorityConfig = {
    baixa: {
      label: "Baixa",
      color: "bg-gray-100 text-gray-600",
      icon: Flag,
    },
    media: {
      label: "Média",
      color: "bg-blue-100 text-blue-600",
      icon: Flag,
    },
    alta: {
      label: "Alta",
      color: "bg-orange-100 text-orange-600",
      icon: Flag,
    },
    urgente: {
      label: "Urgente",
      color: "bg-red-100 text-red-600",
      icon: Zap,
    },
  };

  // Filtragem de compromissos
  useEffect(() => {
    let filtered = appointments;

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.processo?.numero.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filtro por tipo
    if (filterType !== "all") {
      filtered = filtered.filter((apt) => apt.tipo === filterType);
    }

    // Filtro por status
    if (filterStatus !== "all") {
      filtered = filtered.filter((apt) => apt.status === filterStatus);
    }

    // Filtro por responsável
    if (filterResponsavel !== "all") {
      filtered = filtered.filter(
        (apt) => apt.responsavel.id === filterResponsavel,
      );
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, filterType, filterStatus, filterResponsavel]);

  // Funções auxiliares para navegação de datas
  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(view.date);

    switch (view.type) {
      case "month":
        if (direction === "prev") {
          newDate.setMonth(newDate.getMonth() - 1);
        } else {
          newDate.setMonth(newDate.getMonth() + 1);
        }
        break;
      case "week":
        if (direction === "prev") {
          newDate.setDate(newDate.getDate() - 7);
        } else {
          newDate.setDate(newDate.getDate() + 7);
        }
        break;
      case "day":
        if (direction === "prev") {
          newDate.setDate(newDate.getDate() - 1);
        } else {
          newDate.setDate(newDate.getDate() + 1);
        }
        break;
    }

    setView({ ...view, date: newDate });
  };

  const goToToday = () => {
    setView({ ...view, date: new Date() });
    setSelectedDate(new Date());
  };

  // Obter compromissos para uma data específica
  const getAppointmentsForDate = (date: Date) => {
    return filteredAppointments.filter((apt) => {
      const aptDate = parseISO(apt.dataInicio);
      return isSameDay(aptDate, date);
    });
  };

  // Criar novo compromisso
  const handleCreateAppointment = async () => {
    if (!newAppointment.titulo || !newAppointment.dataInicio) {
      toast.error("Título e data são obrigatórios");
      return;
    }

    try {
      const appointment: Appointment = {
        id: `apt-${Date.now()}`,
        titulo: newAppointment.titulo,
        descricao: newAppointment.descricao || "",
        dataInicio: newAppointment.dataInicio,
        dataFim: newAppointment.dataFim || newAppointment.dataInicio,
        diaInteiro: newAppointment.diaInteiro || false,
        tipo: newAppointment.tipo || "reuniao",
        status: newAppointment.status || "agendado",
        prioridade: newAppointment.prioridade || "media",
        local: newAppointment.local,
        participantes: newAppointment.participantes || [],
        processo: newAppointment.processo,
        cliente: newAppointment.cliente,
        responsavel: {
          id: user?.id || "user-1",
          nome: user?.name || "Usuário",
        },
        lembretes: newAppointment.lembretes || [
          { tipo: "email", antecedencia: 30, ativo: true },
        ],
        anexos: newAppointment.anexos || [],
        observacoes: newAppointment.observacoes,
        criado: new Date().toISOString(),
        atualizado: new Date().toISOString(),
      };

      // Simular criação
      setAppointments((prev) => [...prev, appointment]);

      // Integração com tarefas se necessário
      if (appointment.tipo === "prazo") {
        await criarTarefaDeAgenda(
          appointment.titulo,
          appointment.descricao || "",
          parseISO(appointment.dataInicio),
        );
      }

      // Log da ação
      logAction(AUDIT_ACTIONS.CREATE, AUDIT_MODULES.CALENDAR, {
        appointment_id: appointment.id,
        tipo: appointment.tipo,
      });

      toast.success("Compromisso criado com sucesso!");
      setShowCreateDialog(false);
      setNewAppointment({
        tipo: "reuniao",
        status: "agendado",
        prioridade: "media",
        diaInteiro: false,
        participantes: [],
        lembretes: [{ tipo: "email", antecedencia: 30, ativo: true }],
        anexos: [],
      });
    } catch (error) {
      console.error("Erro ao criar compromisso:", error);
      toast.error("Erro ao criar compromisso");
    }
  };

  // Formatação de título da visualização
  const getViewTitle = () => {
    const locale = ptBR;
    switch (view.type) {
      case "month":
        return format(view.date, "MMMM yyyy", { locale });
      case "week":
        const weekStart = startOfWeek(view.date, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(view.date, { weekStartsOn: 0 });
        return `${format(weekStart, "dd MMM", { locale })} - ${format(weekEnd, "dd MMM yyyy", { locale })}`;
      case "day":
        return format(view.date, "dd 'de' MMMM yyyy", { locale });
      case "list":
        return "Lista de Compromissos";
      default:
        return "";
    }
  };

  // Obter responsáveis únicos para filtro
  const uniqueResponsaveis = useMemo(() => {
    const responsaveis = appointments.map((apt) => apt.responsavel);
    const unique = responsaveis.filter(
      (resp, index, self) => index === self.findIndex((r) => r.id === resp.id),
    );
    return unique;
  }, [appointments]);

  return (
    <TooltipProvider>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <CalendarIcon className="h-8 w-8 text-primary" />
              Agenda Jurídica
            </h1>
            <p className="text-muted-foreground">
              Gerencie compromissos, audiências e prazos processuais
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={goToToday} variant="outline" size="sm">
              <Target className="h-4 w-4 mr-2" />
              Hoje
            </Button>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Compromisso
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Filtros e Controles */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Navegação de Data */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate("prev")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="min-w-[200px] text-center">
                  <h3 className="font-semibold text-lg">{getViewTitle()}</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Controles de Visualização */}
              <Tabs
                value={view.type}
                onValueChange={(value) =>
                  setView({ ...view, type: value as AgendaView["type"] })
                }
              >
                <TabsList>
                  <TabsTrigger value="month">Mês</TabsTrigger>
                  <TabsTrigger value="week">Semana</TabsTrigger>
                  <TabsTrigger value="day">Dia</TabsTrigger>
                  <TabsTrigger value="list">Lista</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Filtros */}
            <Separator className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar compromissos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {Object.entries(typeConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filterResponsavel}
                onValueChange={setFilterResponsavel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {uniqueResponsaveis.map((resp) => (
                    <SelectItem key={resp.id} value={resp.id}>
                      {resp.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Mini Calendário */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Calendário</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border-0"
                />
              </CardContent>
            </Card>
          </div>

          {/* Visualização Principal */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">
                        Carregando agenda...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div>
                {view.type === "list" ? (
                  /* Lista de Compromissos */
                  <Card>
                    <CardHeader>
                      <CardTitle>Próximos Compromissos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[600px]">
                        {filteredAppointments.length === 0 ? (
                          <div className="text-center py-12">
                            <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p className="text-muted-foreground">
                              Nenhum compromisso encontrado
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {filteredAppointments
                              .sort(
                                (a, b) =>
                                  new Date(a.dataInicio).getTime() -
                                  new Date(b.dataInicio).getTime(),
                              )
                              .map((appointment) => {
                                const IconComponent =
                                  typeConfig[appointment.tipo]?.icon ||
                                  CalendarIcon;
                                const isOverdue =
                                  isPast(parseISO(appointment.dataInicio)) &&
                                  appointment.status !== "concluido";

                                return (
                                  <motion.div
                                    key={appointment.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition-all ${
                                      typeConfig[appointment.tipo]?.borderColor
                                    } ${isOverdue ? "bg-red-50 border-red-200" : "bg-white"}`}
                                    onClick={() => {
                                      setSelectedAppointment(appointment);
                                      setShowViewDialog(true);
                                    }}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-start gap-3 flex-1">
                                        <div
                                          className={`p-2 rounded-lg ${typeConfig[appointment.tipo]?.color}`}
                                        >
                                          <IconComponent className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold">
                                              {appointment.titulo}
                                            </h4>
                                            {isOverdue && (
                                              <Badge
                                                variant="destructive"
                                                className="text-xs"
                                              >
                                                Em atraso
                                              </Badge>
                                            )}
                                          </div>
                                          <p className="text-sm text-muted-foreground mb-2">
                                            {appointment.descricao}
                                          </p>
                                          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                              <Clock className="h-3 w-3" />
                                              {format(
                                                parseISO(
                                                  appointment.dataInicio,
                                                ),
                                                "dd/MM/yyyy HH:mm",
                                                {
                                                  locale: ptBR,
                                                },
                                              )}
                                            </div>
                                            {appointment.local && (
                                              <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {appointment.local.nome}
                                              </div>
                                            )}
                                            {appointment.cliente && (
                                              <div className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {appointment.cliente.nome}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-col items-end gap-2">
                                        <Badge
                                          className={`text-xs ${statusConfig[appointment.status]?.color}`}
                                        >
                                          {
                                            statusConfig[appointment.status]
                                              ?.label
                                          }
                                        </Badge>
                                        <Badge
                                          className={`text-xs ${priorityConfig[appointment.prioridade]?.color}`}
                                        >
                                          {
                                            priorityConfig[
                                              appointment.prioridade
                                            ]?.label
                                          }
                                        </Badge>
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                          </div>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                ) : (
                  /* Visualizações de Calendário */
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-24">
                        <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground mb-2">
                          Visualização de calendário em desenvolvimento
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Use a visualização "Lista" para ver todos os
                          compromissos
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dialog para Criar Compromisso */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Compromisso na Agenda</DialogTitle>
              <DialogDescription>
                Criar um novo compromisso, audiência ou prazo processual
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={newAppointment.titulo || ""}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        titulo: e.target.value,
                      })
                    }
                    placeholder="Ex: Audiência de Conciliação"
                  />
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select
                    value={newAppointment.tipo}
                    onValueChange={(value) =>
                      setNewAppointment({
                        ...newAppointment,
                        tipo: value as Appointment["tipo"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(typeConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={newAppointment.descricao || ""}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      descricao: e.target.value,
                    })
                  }
                  placeholder="Detalhes sobre o compromisso..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dataInicio">Data de Início *</Label>
                  <Input
                    id="dataInicio"
                    type="datetime-local"
                    value={newAppointment.dataInicio || ""}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        dataInicio: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="dataFim">Data de Fim</Label>
                  <Input
                    id="dataFim"
                    type="datetime-local"
                    value={newAppointment.dataFim || ""}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        dataFim: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newAppointment.status}
                    onValueChange={(value) =>
                      setNewAppointment({
                        ...newAppointment,
                        status: value as Appointment["status"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Select
                    value={newAppointment.prioridade}
                    onValueChange={(value) =>
                      setNewAppointment({
                        ...newAppointment,
                        prioridade: value as Appointment["prioridade"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(priorityConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="diaInteiro"
                  checked={newAppointment.diaInteiro}
                  onCheckedChange={(checked) =>
                    setNewAppointment({
                      ...newAppointment,
                      diaInteiro: checked,
                    })
                  }
                />
                <Label htmlFor="diaInteiro">Dia inteiro</Label>
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={newAppointment.observacoes || ""}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      observacoes: e.target.value,
                    })
                  }
                  placeholder="Observações adicionais..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateAppointment}>
                Criar Compromisso
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para Visualizar Compromisso */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedAppointment && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${typeConfig[selectedAppointment.tipo]?.color}`}
                    >
                      {(() => {
                        const IconComponent =
                          typeConfig[selectedAppointment.tipo]?.icon ||
                          CalendarIcon;
                        return <IconComponent className="h-5 w-5 text-white" />;
                      })()}
                    </div>
                    <div>
                      <DialogTitle className="text-xl">
                        {selectedAppointment.titulo}
                      </DialogTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          className={
                            statusConfig[selectedAppointment.status]?.color
                          }
                        >
                          {statusConfig[selectedAppointment.status]?.label}
                        </Badge>
                        <Badge
                          className={
                            priorityConfig[selectedAppointment.prioridade]
                              ?.color
                          }
                        >
                          {
                            priorityConfig[selectedAppointment.prioridade]
                              ?.label
                          }
                        </Badge>
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6">
                  {selectedAppointment.descricao && (
                    <div>
                      <h4 className="font-semibold mb-2">Descrição</h4>
                      <p className="text-muted-foreground">
                        {selectedAppointment.descricao}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Informações Gerais</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {format(
                              parseISO(selectedAppointment.dataInicio),
                              "dd/MM/yyyy HH:mm",
                              {
                                locale: ptBR,
                              },
                            )}
                            {selectedAppointment.dataFim !==
                              selectedAppointment.dataInicio && (
                              <>
                                {" "}
                                -{" "}
                                {format(
                                  parseISO(selectedAppointment.dataFim),
                                  "HH:mm",
                                )}
                              </>
                            )}
                          </span>
                        </div>
                        {selectedAppointment.local && (
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div className="text-sm">
                              <div className="font-medium">
                                {selectedAppointment.local.nome}
                              </div>
                              {selectedAppointment.local.endereco && (
                                <div className="text-muted-foreground">
                                  {selectedAppointment.local.endereco}
                                </div>
                              )}
                              {selectedAppointment.local.sala && (
                                <div className="text-muted-foreground">
                                  {selectedAppointment.local.sala}
                                </div>
                              )}
                              {selectedAppointment.local.link && (
                                <div className="mt-1">
                                  <Button variant="outline" size="sm" asChild>
                                    <a
                                      href={selectedAppointment.local.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      Acessar Link
                                    </a>
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {selectedAppointment.responsavel && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {selectedAppointment.responsavel.nome}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Processo e Cliente</h4>
                      <div className="space-y-3">
                        {selectedAppointment.cliente && (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {selectedAppointment.cliente.nome}
                            </span>
                          </div>
                        )}
                        {selectedAppointment.processo && (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Gavel className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {selectedAppointment.processo.numero}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground ml-6">
                              {selectedAppointment.processo.nome}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedAppointment.participantes.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Participantes</h4>
                      <div className="space-y-2">
                        {selectedAppointment.participantes.map(
                          (participante) => (
                            <div
                              key={participante.id}
                              className="flex items-center justify-between p-2 border rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    {participante.nome.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="text-sm font-medium">
                                    {participante.nome}
                                  </div>
                                  <div className="text-xs text-muted-foreground capitalize">
                                    {participante.tipo.replace("_", " ")}
                                  </div>
                                </div>
                              </div>
                              <Badge
                                variant={
                                  participante.confirmado
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {participante.confirmado
                                  ? "Confirmado"
                                  : "Pendente"}
                              </Badge>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {selectedAppointment.lembretes.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Lembretes</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {selectedAppointment.lembretes.map(
                          (lembrete, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 border rounded"
                            >
                              <div className="flex items-center gap-2">
                                <Bell className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm capitalize">
                                  {lembrete.tipo}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {lembrete.antecedencia}min antes
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {selectedAppointment.anexos.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Anexos</h4>
                      <div className="space-y-2">
                        {selectedAppointment.anexos.map((anexo) => (
                          <div
                            key={anexo.id}
                            className="flex items-center justify-between p-2 border rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{anexo.nome}</span>
                            </div>
                            <Button variant="outline" size="sm">
                              <Download className="h-3 w-3 mr-1" />
                              Baixar
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedAppointment.observacoes && (
                    <div>
                      <h4 className="font-semibold mb-2">Observações</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedAppointment.observacoes}
                      </p>
                    </div>
                  )}
                </div>

                <DialogFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartilhar
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowViewDialog(false)}
                  >
                    Fechar
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
