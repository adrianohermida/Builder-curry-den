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
  DollarSign,
  Brain,
  Headphones,
  Menu,
  X,
  ArrowRight,
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar as CalendarDays,
  Smartphone,
  Mail,
  Globe,
  Link,
  Bookmark,
  UserPlus,
  Share,
  QrCode,
  Shield,
  Chrome,
  AlertCircle,
  Wifi,
  WifiOff,
  TeamIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Progress } from "@/components/ui/progress";
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
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  isWithinInterval,
  startOfHour,
  endOfHour,
} from "date-fns";
import { ptBR } from "date-fns/locale";

// Tipos para agenda
export interface Appointment {
  id: string;
  titulo: string;
  descricao?: string;
  dataInicio: string;
  dataFim: string;
  diaInteiro: boolean;
  tipo:
    | "audiencia"
    | "reuniao"
    | "video"
    | "telefone"
    | "prazo"
    | "consulta"
    | "outro";
  status:
    | "agendado"
    | "confirmado"
    | "em_andamento"
    | "cancelado"
    | "adiado"
    | "concluido";
  prioridade: "baixa" | "media" | "alta" | "urgente" | "critica";

  // Localização e acesso
  local?: {
    nome: string;
    endereco?: string;
    sala?: string;
    tipo: "presencial" | "online" | "hibrido";
    link?: string;
  };

  // Participantes
  participantes: Array<{
    id: string;
    nome: string;
    email?: string;
    telefone?: string;
    tipo: "cliente" | "advogado" | "interno" | "externo";
    confirmado: boolean;
    obrigatorio: boolean;
    avatar?: string;
  }>;

  // Cliente relacionado (interno ao sistema)
  cliente?: {
    id: string;
    nome: string;
    avatar?: string;
    documento?: string;
    telefone?: string;
    email?: string;
  };

  // Responsável
  responsavel: {
    id: string;
    nome: string;
    avatar?: string;
    cargo?: string;
    departamento?: string;
  };

  // Sistema de notificações
  lembretes: Array<{
    tipo: "email" | "sms" | "push" | "whatsapp";
    antecedencia: number; // em minutos
    ativo: boolean;
  }>;

  // Anexos e documentos
  anexos: Array<{
    id: string;
    nome: string;
    url: string;
    tipo: string;
    tamanho?: number;
  }>;

  // Recorrência
  recorrencia?: {
    tipo: "diaria" | "semanal" | "mensal" | "anual";
    intervalo: number;
    dias_semana?: number[];
    data_fim?: string;
  };

  // Configurações de acesso
  publico: boolean;
  link_publico?: string;
  equipe_visivel: boolean;
  organizacao_visivel: boolean;

  // Sistema
  observacoes?: string;
  tags?: string[];
  cor?: string;
  criado: string;
  atualizado: string;
  criado_por: string;
}

interface AgendaView {
  type: "month" | "week" | "day" | "list" | "timeline" | "team";
  date: Date;
}

interface TeamMember {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  avatar?: string;
  ativo: boolean;
  cor: string;
}

interface GoogleCalendarConfig {
  conectado: boolean;
  email?: string;
  ultima_sincronizacao?: string;
  sincronizacao_automatica: boolean;
  calendario_padrao?: string;
  calendarios_disponiveis: Array<{
    id: string;
    nome: string;
    cor: string;
    principal: boolean;
  }>;
}

interface CalendlyConfig {
  ativo: boolean;
  link_publico: string;
  tipos_eventos: Array<{
    id: string;
    nome: string;
    duracao: number;
    disponivel: boolean;
  }>;
  horarios_disponibilidade: {
    segunda: { inicio: string; fim: string; ativo: boolean };
    terca: { inicio: string; fim: string; ativo: boolean };
    quarta: { inicio: string; fim: string; ativo: boolean };
    quinta: { inicio: string; fim: string; ativo: boolean };
    sexta: { inicio: string; fim: string; ativo: boolean };
    sabado: { inicio: string; fim: string; ativo: boolean };
    domingo: { inicio: string; fim: string; ativo: boolean };
  };
}

export default function AgendaJuridica() {
  // Estados principais
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
  const [isMobile, setIsMobile] = useState(false);

  // Estados de interface
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showGoogleConfig, setShowGoogleConfig] = useState(false);
  const [showTeamConfig, setShowTeamConfig] = useState(false);
  const [showPublicLink, setShowPublicLink] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterResponsavel, setFilterResponsavel] = useState("all");
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);

  // Estados de configuração
  const [googleConfig, setGoogleConfig] = useState<GoogleCalendarConfig>({
    conectado: false,
    sincronizacao_automatica: false,
    calendarios_disponiveis: [],
  });
  const [calendlyConfig, setCalendlyConfig] = useState<CalendlyConfig>({
    ativo: false,
    link_publico: "",
    tipos_eventos: [],
    horarios_disponibilidade: {
      segunda: { inicio: "09:00", fim: "18:00", ativo: true },
      terca: { inicio: "09:00", fim: "18:00", ativo: true },
      quarta: { inicio: "09:00", fim: "18:00", ativo: true },
      quinta: { inicio: "09:00", fim: "18:00", ativo: true },
      sexta: { inicio: "09:00", fim: "18:00", ativo: true },
      sabado: { inicio: "09:00", fim: "12:00", ativo: false },
      domingo: { inicio: "09:00", fim: "12:00", ativo: false },
    },
  });

  // Mock de membros da equipe
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: "tm-001",
      nome: "Dr. Pedro Costa",
      cargo: "Advogado Sênior",
      departamento: "Trabalhista",
      ativo: true,
      cor: "#3B82F6",
    },
    {
      id: "tm-002",
      nome: "Dra. Ana Lima",
      cargo: "Sócia",
      departamento: "Empresarial",
      ativo: true,
      cor: "#10B981",
    },
    {
      id: "tm-003",
      nome: "Dr. Luis Santos",
      cargo: "Advogado Júnior",
      departamento: "Civil",
      ativo: true,
      cor: "#8B5CF6",
    },
    {
      id: "tm-004",
      nome: "Dra. Marina Oliveira",
      cargo: "Advogada",
      departamento: "Criminal",
      ativo: true,
      cor: "#F59E0B",
    },
  ]);

  // Hooks
  const { user, hasPermission } = usePermissions();
  const { logAction } = useAuditSystem();
  const { criarTarefaDeAgenda } = useTarefaIntegration();

  // Detectar dispositivo móvel
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Configurações de tipos
  const typeConfig = {
    audiencia: {
      label: "Audiência",
      icon: Gavel,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
      bgColor: "bg-blue-50",
    },
    reuniao: {
      label: "Reunião",
      icon: Users,
      color: "bg-green-500",
      textColor: "text-green-600",
      borderColor: "border-green-200",
      bgColor: "bg-green-50",
    },
    video: {
      label: "Videoconferência",
      icon: Video,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      borderColor: "border-purple-200",
      bgColor: "bg-purple-50",
    },
    telefone: {
      label: "Ligação",
      icon: Phone,
      color: "bg-orange-500",
      textColor: "text-orange-600",
      borderColor: "border-orange-200",
      bgColor: "bg-orange-50",
    },
    prazo: {
      label: "Prazo",
      icon: AlertTriangle,
      color: "bg-red-500",
      textColor: "text-red-600",
      borderColor: "border-red-200",
      bgColor: "bg-red-50",
    },
    consulta: {
      label: "Consulta",
      icon: MessageSquare,
      color: "bg-cyan-500",
      textColor: "text-cyan-600",
      borderColor: "border-cyan-200",
      bgColor: "bg-cyan-50",
    },
    outro: {
      label: "Outro",
      icon: Clock,
      color: "bg-gray-500",
      textColor: "text-gray-600",
      borderColor: "border-gray-200",
      bgColor: "bg-gray-50",
    },
  };

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
    em_andamento: {
      label: "Em Andamento",
      color: "bg-yellow-100 text-yellow-800",
      icon: Activity,
    },
    cancelado: {
      label: "Cancelado",
      color: "bg-red-100 text-red-800",
      icon: X,
    },
    adiado: {
      label: "Adiado",
      color: "bg-orange-100 text-orange-800",
      icon: Clock,
    },
    concluido: {
      label: "Concluído",
      color: "bg-gray-100 text-gray-800",
      icon: CheckCircle,
    },
  };

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
    critica: {
      label: "Crítica",
      color: "bg-red-200 text-red-800",
      icon: AlertTriangle,
    },
  };

  // Carregar dados mockados
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock de eventos
      const mockAppointments: Appointment[] = [
        {
          id: "apt-001",
          titulo: "Audiência de Conciliação - João Silva",
          descricao: "Audiência de conciliação trabalhista",
          dataInicio: "2024-01-25T14:30:00Z",
          dataFim: "2024-01-25T16:00:00Z",
          diaInteiro: false,
          tipo: "audiencia",
          status: "confirmado",
          prioridade: "alta",
          local: {
            nome: "TRT 2ª Região - São Paulo",
            endereco: "Rua do Tribunal, 200 - Centro, São Paulo - SP",
            sala: "Sala de Audiências 5",
            tipo: "presencial",
          },
          cliente: {
            id: "cli-001",
            nome: "João Silva",
            documento: "123.456.789-00",
            telefone: "(11) 99999-9999",
            email: "joao.silva@email.com",
          },
          participantes: [
            {
              id: "part-001",
              nome: "João Silva",
              email: "joao.silva@email.com",
              tipo: "cliente",
              confirmado: true,
              obrigatorio: true,
            },
            {
              id: "part-002",
              nome: "Dr. Pedro Costa",
              email: "pedro.costa@lawdesk.com",
              tipo: "advogado",
              confirmado: true,
              obrigatorio: true,
            },
          ],
          responsavel: {
            id: "tm-001",
            nome: "Dr. Pedro Costa",
            cargo: "Advogado Sênior",
            departamento: "Trabalhista",
          },
          lembretes: [
            { tipo: "email", antecedencia: 1440, ativo: true },
            { tipo: "sms", antecedencia: 120, ativo: true },
            { tipo: "push", antecedencia: 30, ativo: true },
          ],
          anexos: [],
          tags: ["trabalhista", "conciliação", "urgente"],
          cor: "#3B82F6",
          publico: false,
          equipe_visivel: true,
          organizacao_visivel: true,
          observacoes: "Audiência obrigatória - preparar documentos",
          criado: "2024-01-20T10:00:00Z",
          atualizado: "2024-01-22T14:30:00Z",
          criado_por: "tm-001",
        },
        {
          id: "apt-002",
          titulo: "Reunião de Planejamento - Equipe",
          descricao: "Reunião mensal de planejamento estratégico",
          dataInicio: "2024-01-26T09:00:00Z",
          dataFim: "2024-01-26T10:30:00Z",
          diaInteiro: false,
          tipo: "reuniao",
          status: "agendado",
          prioridade: "media",
          local: {
            nome: "Sala de Reuniões - Escritório",
            endereco: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
            tipo: "presencial",
          },
          participantes: [
            {
              id: "part-003",
              nome: "Dr. Pedro Costa",
              tipo: "interno",
              confirmado: true,
              obrigatorio: true,
            },
            {
              id: "part-004",
              nome: "Dra. Ana Lima",
              tipo: "interno",
              confirmado: true,
              obrigatorio: true,
            },
            {
              id: "part-005",
              nome: "Dr. Luis Santos",
              tipo: "interno",
              confirmado: false,
              obrigatorio: true,
            },
          ],
          responsavel: {
            id: "tm-002",
            nome: "Dra. Ana Lima",
            cargo: "Sócia",
            departamento: "Administração",
          },
          lembretes: [
            { tipo: "email", antecedencia: 1440, ativo: true },
            { tipo: "push", antecedencia: 60, ativo: true },
          ],
          anexos: [],
          tags: ["equipe", "planejamento", "mensal"],
          cor: "#10B981",
          publico: false,
          equipe_visivel: true,
          organizacao_visivel: true,
          observacoes: "Reunião de alinhamento mensal da equipe",
          criado: "2024-01-22T08:00:00Z",
          atualizado: "2024-01-22T08:00:00Z",
          criado_por: "tm-002",
        },
        {
          id: "apt-003",
          titulo: "Consulta Jurídica - Link Público",
          descricao: "Consulta inicial para cliente potencial",
          dataInicio: "2024-01-24T16:00:00Z",
          dataFim: "2024-01-24T17:00:00Z",
          diaInteiro: false,
          tipo: "consulta",
          status: "confirmado",
          prioridade: "media",
          local: {
            nome: "Videoconferência",
            tipo: "online",
            link: "https://meet.google.com/abc-defg-hij",
          },
          participantes: [
            {
              id: "part-006",
              nome: "Cliente Potencial",
              email: "cliente@exemplo.com",
              tipo: "externo",
              confirmado: true,
              obrigatorio: true,
            },
            {
              id: "part-007",
              nome: "Dr. Luis Santos",
              tipo: "advogado",
              confirmado: true,
              obrigatorio: true,
            },
          ],
          responsavel: {
            id: "tm-003",
            nome: "Dr. Luis Santos",
            cargo: "Advogado Júnior",
            departamento: "Atendimento",
          },
          lembretes: [
            { tipo: "email", antecedencia: 60, ativo: true },
            { tipo: "whatsapp", antecedencia: 30, ativo: true },
          ],
          anexos: [],
          tags: ["consulta", "primeiro_contato", "online"],
          cor: "#06B6D4",
          publico: true,
          link_publico: "https://agenda.lawdesk.com/consulta/luis-santos",
          equipe_visivel: false,
          organizacao_visivel: false,
          observacoes: "Consulta inicial - agendar via link público",
          criado: "2024-01-22T11:00:00Z",
          atualizado: "2024-01-22T11:00:00Z",
          criado_por: "tm-003",
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

    loadData();
  }, [logAction]);

  // Verificar permissões
  if (!hasPermission("agenda", "read")) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
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

  // Filtrar compromissos
  useEffect(() => {
    let filtered = appointments;

    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.tags?.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((apt) => apt.tipo === filterType);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((apt) => apt.status === filterStatus);
    }

    if (filterResponsavel !== "all") {
      filtered = filtered.filter(
        (apt) => apt.responsavel.id === filterResponsavel,
      );
    }

    // Filtro por membros da equipe selecionados
    if (selectedTeamMembers.length > 0) {
      filtered = filtered.filter((apt) =>
        selectedTeamMembers.includes(apt.responsavel.id),
      );
    }

    setFilteredAppointments(filtered);
  }, [
    appointments,
    searchTerm,
    filterType,
    filterStatus,
    filterResponsavel,
    selectedTeamMembers,
  ]);

  // Navegação de datas
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
      case "team":
        return "Agenda da Equipe";
      default:
        return "";
    }
  };

  // Conectar Google Calendar
  const handleGoogleConnect = async () => {
    try {
      // Simular processo de autenticação OAuth
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setGoogleConfig({
        conectado: true,
        email: "usuario@lawdesk.com",
        ultima_sincronizacao: new Date().toISOString(),
        sincronizacao_automatica: true,
        calendarios_disponiveis: [
          {
            id: "primary",
            nome: "Agenda Principal",
            cor: "#3B82F6",
            principal: true,
          },
          {
            id: "work",
            nome: "Trabalho",
            cor: "#10B981",
            principal: false,
          },
        ],
      });

      toast.success("Google Calendar conectado com sucesso!");
      setIsLoading(false);
    } catch (error) {
      toast.error("Erro ao conectar com Google Calendar");
      setIsLoading(false);
    }
  };

  // Gerar link público
  const generatePublicLink = () => {
    const userId = user?.id || "usuario";
    const userName =
      user?.name?.toLowerCase().replace(/\s+/g, "-") || "advogado";
    const publicLink = `https://agenda.lawdesk.com/${userName}-${userId}`;

    setCalendlyConfig((prev) => ({
      ...prev,
      ativo: true,
      link_publico: publicLink,
    }));

    navigator.clipboard.writeText(publicLink);
    toast.success("Link público gerado e copiado!");
  };

  // Responsáveis únicos
  const uniqueResponsaveis = useMemo(() => {
    const responsaveis = appointments.map((apt) => apt.responsavel);
    const unique = responsaveis.filter(
      (resp, index, self) => index === self.findIndex((r) => r.id === resp.id),
    );
    return unique;
  }, [appointments]);

  // Alert do Google Calendar
  const GoogleCalendarAlert = () => (
    <Alert className="mb-6 border-orange-200 bg-orange-50">
      <AlertCircle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-800">
        Google Calendar não conectado
      </AlertTitle>
      <AlertDescription className="text-orange-700">
        Conecte sua conta do Google Calendar para sincronizar automaticamente
        seus compromissos.
        <Button
          variant="outline"
          size="sm"
          className="ml-2 text-orange-800 border-orange-300 hover:bg-orange-100"
          onClick={() => setShowGoogleConfig(true)}
        >
          <Chrome className="h-4 w-4 mr-2" />
          Conectar Google Calendar
        </Button>
      </AlertDescription>
    </Alert>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-primary" />
            Agenda Jurídica
          </SheetTitle>
          <SheetDescription>
            Gerencie compromissos e configure integrações
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-full pb-20">
          <div className="p-6 space-y-6">
            {/* Mini Calendar */}
            <div>
              <h4 className="font-medium mb-3">Calendário</h4>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>

            {/* Quick Actions */}
            <div>
              <h4 className="font-medium mb-3">Ações Rápidas</h4>
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    setShowCreateDialog(true);
                    setSidebarOpen(false);
                  }}
                  className="w-full justify-start"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Compromisso
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPublicLink(true)}
                  className="w-full justify-start"
                  size="sm"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Link Público
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowTeamConfig(true)}
                  className="w-full justify-start"
                  size="sm"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Equipe
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Carregando Agenda</h3>
          <p className="text-muted-foreground">Sincronizando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50/50">
        <MobileSidebar />

        <div className={`${isMobile ? "p-4" : "p-6"} space-y-6`}>
          {/* Google Calendar Alert */}
          {!googleConfig.conectado && <GoogleCalendarAlert />}

          {/* Header */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              {isMobile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              )}
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-2">
                  <CalendarIcon className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
                  Agenda Jurídica
                </h1>
                <p className="text-muted-foreground text-sm lg:text-base">
                  {view.type === "team"
                    ? "Visualização da equipe"
                    : "Gestão de compromissos e audiências"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {!isMobile && (
                <>
                  <Button
                    onClick={() => setShowPublicLink(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Link Público
                  </Button>
                  <Button
                    onClick={() => setShowTeamConfig(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Equipe
                  </Button>
                  <Button
                    onClick={() => setShowGoogleConfig(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações
                  </Button>
                </>
              )}
              <Button onClick={goToToday} variant="outline" size="sm">
                <Target className="h-4 w-4 mr-2" />
                Hoje
              </Button>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-primary"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                {isMobile ? "Novo" : "Novo Compromisso"}
              </Button>
            </div>
          </div>

          {/* Filters and Controls */}
          <Card>
            <CardContent className={`${isMobile ? "p-4" : "pt-6"}`}>
              <div className="flex flex-col gap-4">
                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateDate("prev")}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div
                      className={`${isMobile ? "min-w-[180px]" : "min-w-[200px]"} text-center`}
                    >
                      <h3
                        className={`font-semibold ${isMobile ? "text-base" : "text-lg"}`}
                      >
                        {getViewTitle()}
                      </h3>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateDate("next")}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* View Controls */}
                  <Tabs
                    value={view.type}
                    onValueChange={(value) =>
                      setView({ ...view, type: value as AgendaView["type"] })
                    }
                  >
                    <TabsList className={isMobile ? "grid-cols-3" : ""}>
                      {!isMobile && (
                        <TabsTrigger value="month">Mês</TabsTrigger>
                      )}
                      <TabsTrigger value="week">Semana</TabsTrigger>
                      <TabsTrigger value="day">Dia</TabsTrigger>
                      <TabsTrigger value="list">Lista</TabsTrigger>
                      <TabsTrigger value="team">Equipe</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Filters */}
                <Separator />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className={isMobile ? "sm:col-span-2" : "lg:col-span-2"}>
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
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div
            className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-4"} gap-6`}
          >
            {/* Desktop Mini Calendar */}
            {!isMobile && (
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

                    <Separator className="my-4" />

                    {/* Status de sincronização */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Google Calendar</span>
                        <div className="flex items-center gap-1">
                          {googleConfig.conectado ? (
                            <Wifi className="h-3 w-3 text-green-600" />
                          ) : (
                            <WifiOff className="h-3 w-3 text-red-600" />
                          )}
                          <span
                            className={`text-xs ${googleConfig.conectado ? "text-green-600" : "text-red-600"}`}
                          >
                            {googleConfig.conectado
                              ? "Conectado"
                              : "Desconectado"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Link Público</span>
                        <div className="flex items-center gap-1">
                          {calendlyConfig.ativo ? (
                            <Globe className="h-3 w-3 text-green-600" />
                          ) : (
                            <Globe className="h-3 w-3 text-gray-400" />
                          )}
                          <span
                            className={`text-xs ${calendlyConfig.ativo ? "text-green-600" : "text-gray-500"}`}
                          >
                            {calendlyConfig.ativo ? "Ativo" : "Inativo"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Main View */}
            <div className={isMobile ? "col-span-1" : "lg:col-span-3"}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={view.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {view.type === "team" ? (
                    /* Visão da Equipe */
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Agenda da Equipe
                          </CardTitle>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowTeamConfig(true)}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Configurar
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Membros da equipe */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                          {teamMembers.map((member) => {
                            const memberAppointments =
                              filteredAppointments.filter(
                                (apt) => apt.responsavel.id === member.id,
                              );

                            return (
                              <Card
                                key={member.id}
                                className={`cursor-pointer transition-all hover:shadow-md ${
                                  selectedTeamMembers.includes(member.id)
                                    ? "ring-2 ring-primary"
                                    : ""
                                }`}
                                onClick={() => {
                                  setSelectedTeamMembers((prev) =>
                                    prev.includes(member.id)
                                      ? prev.filter((id) => id !== member.id)
                                      : [...prev, member.id],
                                  );
                                }}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage src={member.avatar} />
                                      <AvatarFallback
                                        style={{ backgroundColor: member.cor }}
                                        className="text-white"
                                      >
                                        {member.nome.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <h4 className="font-medium text-sm">
                                        {member.nome}
                                      </h4>
                                      <p className="text-xs text-muted-foreground">
                                        {member.cargo}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {memberAppointments.length} compromissos
                                      </p>
                                    </div>
                                    <div
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: member.cor }}
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>

                        {/* Lista de compromissos da equipe */}
                        <div className="space-y-4">
                          {filteredAppointments.length === 0 ? (
                            <div className="text-center py-8">
                              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p className="text-muted-foreground">
                                Nenhum compromisso encontrado para os membros
                                selecionados
                              </p>
                            </div>
                          ) : (
                            filteredAppointments
                              .sort(
                                (a, b) =>
                                  new Date(a.dataInicio).getTime() -
                                  new Date(b.dataInicio).getTime(),
                              )
                              .map((appointment) => {
                                const member = teamMembers.find(
                                  (m) => m.id === appointment.responsavel.id,
                                );
                                const IconComponent =
                                  typeConfig[appointment.tipo]?.icon ||
                                  CalendarIcon;

                                return (
                                  <motion.div
                                    key={appointment.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 border rounded-lg hover:shadow-sm transition-all cursor-pointer"
                                    style={{
                                      borderLeft: `4px solid ${member?.cor || "#gray"}`,
                                    }}
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
                                          <h4 className="font-semibold mb-1">
                                            {appointment.titulo}
                                          </h4>
                                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                            <div className="flex items-center gap-1">
                                              <Clock className="h-3 w-3" />
                                              {format(
                                                parseISO(
                                                  appointment.dataInicio,
                                                ),
                                                "dd/MM HH:mm",
                                                { locale: ptBR },
                                              )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <User className="h-3 w-3" />
                                              {appointment.responsavel.nome}
                                            </div>
                                            {appointment.local && (
                                              <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {appointment.local.nome}
                                              </div>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Badge
                                              className={
                                                statusConfig[appointment.status]
                                                  ?.color
                                              }
                                            >
                                              {
                                                statusConfig[appointment.status]
                                                  ?.label
                                              }
                                            </Badge>
                                            <Badge
                                              className={
                                                priorityConfig[
                                                  appointment.prioridade
                                                ]?.color
                                              }
                                            >
                                              {
                                                priorityConfig[
                                                  appointment.prioridade
                                                ]?.label
                                              }
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ) : view.type === "list" ? (
                    /* Lista de Compromissos */
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>
                            Compromissos ({filteredAppointments.length})
                          </CardTitle>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Exportar
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea
                          className={`${isMobile ? "h-[500px]" : "h-[600px]"}`}
                        >
                          {filteredAppointments.length === 0 ? (
                            <div className="text-center py-12">
                              <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                              <p className="text-muted-foreground">
                                Nenhum compromisso encontrado
                              </p>
                              <Button
                                onClick={() => setShowCreateDialog(true)}
                                className="mt-4"
                                variant="outline"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Criar Primeiro Compromisso
                              </Button>
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
                                        typeConfig[appointment.tipo]
                                          ?.borderColor
                                      } ${
                                        isOverdue
                                          ? "bg-red-50 border-red-200"
                                          : "bg-white"
                                      }`}
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
                                              {appointment.publico && (
                                                <Badge
                                                  variant="outline"
                                                  className="text-xs"
                                                >
                                                  <Globe className="h-3 w-3 mr-1" />
                                                  Público
                                                </Badge>
                                              )}
                                            </div>

                                            {appointment.descricao && (
                                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                                {appointment.descricao}
                                              </p>
                                            )}

                                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-2">
                                              <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {format(
                                                  parseISO(
                                                    appointment.dataInicio,
                                                  ),
                                                  "dd/MM/yyyy HH:mm",
                                                  { locale: ptBR },
                                                )}
                                              </div>
                                              {appointment.local && (
                                                <div className="flex items-center gap-1">
                                                  <MapPin className="h-3 w-3" />
                                                  <span className="truncate max-w-[150px]">
                                                    {appointment.local.nome}
                                                  </span>
                                                </div>
                                              )}
                                              {appointment.cliente && (
                                                <div className="flex items-center gap-1">
                                                  <User className="h-3 w-3" />
                                                  <span className="truncate max-w-[120px]">
                                                    {appointment.cliente.nome}
                                                  </span>
                                                </div>
                                              )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                              <Badge
                                                className={
                                                  statusConfig[
                                                    appointment.status
                                                  ]?.color
                                                }
                                              >
                                                {
                                                  statusConfig[
                                                    appointment.status
                                                  ]?.label
                                                }
                                              </Badge>
                                              <Badge
                                                className={
                                                  priorityConfig[
                                                    appointment.prioridade
                                                  ]?.color
                                                }
                                              >
                                                {
                                                  priorityConfig[
                                                    appointment.prioridade
                                                  ]?.label
                                                }
                                              </Badge>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2 ml-4">
                                          <Avatar className="h-8 w-8">
                                            <AvatarImage
                                              src={
                                                appointment.responsavel.avatar
                                              }
                                            />
                                            <AvatarFallback>
                                              {appointment.responsavel.nome
                                                .charAt(0)
                                                .toUpperCase()}
                                            </AvatarFallback>
                                          </Avatar>
                                          {appointment.participantes.length >
                                            0 && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                              <Users className="h-3 w-3" />
                                              {appointment.participantes.length}
                                            </div>
                                          )}
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
                    /* Other Views */
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-24">
                          <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p className="text-muted-foreground mb-2">
                            Visualização "{getViewTitle()}" em desenvolvimento
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Use a visualização "Lista" ou "Equipe" para ver os
                            compromissos
                          </p>
                          <Button
                            onClick={() => setView({ ...view, type: "list" })}
                            variant="outline"
                            className="mt-4"
                          >
                            <List className="h-4 w-4 mr-2" />
                            Ir para Lista
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Dialog de Configuração Google Calendar */}
        <Dialog open={showGoogleConfig} onOpenChange={setShowGoogleConfig}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Chrome className="h-5 w-5 text-blue-600" />
                Configuração Google Calendar
              </DialogTitle>
              <DialogDescription>
                Configure a integração com sua conta do Google Calendar
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {!googleConfig.conectado ? (
                <div className="text-center py-8">
                  <Chrome className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-lg font-semibold mb-2">
                    Conectar Google Calendar
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Sincronize automaticamente seus compromissos com o Google
                    Calendar para manter tudo organizado.
                  </p>
                  <Button onClick={handleGoogleConnect} className="bg-blue-600">
                    <Chrome className="h-4 w-4 mr-2" />
                    Conectar com Google
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">
                      Conectado com sucesso!
                    </AlertTitle>
                    <AlertDescription className="text-green-700">
                      Conta: {googleConfig.email}
                      <br />
                      Última sincronização:{" "}
                      {googleConfig.ultima_sincronizacao &&
                        format(
                          parseISO(googleConfig.ultima_sincronizacao),
                          "dd/MM/yyyy HH:mm",
                          { locale: ptBR },
                        )}
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Sincronização Automática</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={googleConfig.sincronizacao_automatica}
                          onCheckedChange={(checked) =>
                            setGoogleConfig((prev) => ({
                              ...prev,
                              sincronizacao_automatica: checked,
                            }))
                          }
                        />
                        <span className="text-sm text-muted-foreground">
                          Sincronizar automaticamente a cada 15 minutos
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Calendário Padrão</Label>
                      <Select
                        value={googleConfig.calendario_padrao || "primary"}
                        onValueChange={(value) =>
                          setGoogleConfig((prev) => ({
                            ...prev,
                            calendario_padrao: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {googleConfig.calendarios_disponiveis.map((cal) => (
                            <SelectItem key={cal.id} value={cal.id}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: cal.cor }}
                                />
                                {cal.nome}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Calendários Disponíveis</Label>
                    {googleConfig.calendarios_disponiveis.map((calendario) => (
                      <div
                        key={calendario.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: calendario.cor }}
                          />
                          <div>
                            <div className="font-medium">{calendario.nome}</div>
                            <div className="text-xs text-muted-foreground">
                              {calendario.principal
                                ? "Calendário Principal"
                                : "Calendário Secundário"}
                            </div>
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowGoogleConfig(false)}
              >
                Fechar
              </Button>
              {googleConfig.conectado && <Button>Salvar Configurações</Button>}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de Link Público */}
        <Dialog open={showPublicLink} onOpenChange={setShowPublicLink}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Share className="h-5 w-5 text-green-600" />
                Link Público de Agendamento
              </DialogTitle>
              <DialogDescription>
                Configure seu link público para que clientes possam agendar
                compromissos diretamente
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {!calendlyConfig.ativo ? (
                <div className="text-center py-8">
                  <Share className="h-16 w-16 mx-auto mb-4 text-green-600" />
                  <h3 className="text-lg font-semibold mb-2">
                    Ativar Link Público
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Permita que clientes agendem compromissos com você
                    diretamente através de um link personalizado.
                  </p>
                  <Button onClick={generatePublicLink} className="bg-green-600">
                    <Share className="h-4 w-4 mr-2" />
                    Gerar Link Público
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">
                      Link Público Ativo
                    </AlertTitle>
                    <AlertDescription className="text-green-700">
                      Seu link de agendamento está ativo e disponível para
                      compartilhamento.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label>Seu Link de Agendamento</Label>
                    <div className="flex gap-2">
                      <Input
                        value={calendlyConfig.link_publico}
                        readOnly
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            calendlyConfig.link_publico,
                          );
                          toast.success("Link copiado!");
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" asChild>
                        <a
                          href={calendlyConfig.link_publico}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Tipos de Eventos Disponíveis</Label>
                    <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
                      <p className="text-muted-foreground text-sm">
                        Configuração de tipos de eventos em desenvolvimento
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Horários de Disponibilidade</Label>
                    <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
                      <p className="text-muted-foreground text-sm">
                        Configuração de horários em desenvolvimento
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowPublicLink(false)}
              >
                Fechar
              </Button>
              {calendlyConfig.ativo && <Button>Salvar Configurações</Button>}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de Configuração da Equipe */}
        <Dialog open={showTeamConfig} onOpenChange={setShowTeamConfig}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Configuração da Equipe
              </DialogTitle>
              <DialogDescription>
                Gerencie a visualização e permissões da agenda da equipe
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map((member) => (
                  <Card
                    key={member.id}
                    className={`${member.ativo ? "ring-2 ring-green-200" : "opacity-50"}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback
                            style={{ backgroundColor: member.cor }}
                            className="text-white"
                          >
                            {member.nome.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{member.nome}</h4>
                          <p className="text-xs text-muted-foreground">
                            {member.cargo}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.departamento}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Visível na agenda
                          </span>
                          <Switch checked={member.ativo} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Cor
                          </span>
                          <div
                            className="w-6 h-6 rounded-full border-2 border-gray-200"
                            style={{ backgroundColor: member.cor }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
                <UserPlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-muted-foreground text-sm mb-2">
                  Adicionar novos membros
                </p>
                <Button variant="outline" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Convidar Membro
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowTeamConfig(false)}
              >
                Fechar
              </Button>
              <Button>Salvar Configurações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para Criar Compromisso */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Novo Compromisso
              </DialogTitle>
              <DialogDescription>
                Criar um novo compromisso na agenda
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">
                  Formulário de criação em desenvolvimento
                </p>
                <p className="text-sm text-gray-500">
                  O formulário de criação de compromissos estará disponível em
                  breve
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para Visualizar Compromisso */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
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
                        <Badge variant="outline">
                          {typeConfig[selectedAppointment.tipo]?.label}
                        </Badge>
                        {selectedAppointment.publico && (
                          <Badge variant="outline" className="text-green-600">
                            <Globe className="h-3 w-3 mr-1" />
                            Público
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh]">
                  <div className="space-y-6 pr-4">
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
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Data e Hora
                        </h4>
                        <div className="space-y-2">
                          <div className="font-medium">
                            {format(
                              parseISO(selectedAppointment.dataInicio),
                              "EEEE, dd 'de' MMMM 'de' yyyy",
                              { locale: ptBR },
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {selectedAppointment.diaInteiro ? (
                              "Dia inteiro"
                            ) : (
                              <>
                                {format(
                                  parseISO(selectedAppointment.dataInicio),
                                  "HH:mm",
                                )}{" "}
                                -{" "}
                                {format(
                                  parseISO(selectedAppointment.dataFim),
                                  "HH:mm",
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {selectedAppointment.local && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Local
                          </h4>
                          <div className="space-y-2">
                            <div className="font-medium">
                              {selectedAppointment.local.nome}
                            </div>
                            {selectedAppointment.local.endereco && (
                              <div className="text-sm text-muted-foreground">
                                {selectedAppointment.local.endereco}
                              </div>
                            )}
                            {selectedAppointment.local.link && (
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="mt-2"
                              >
                                <a
                                  href={selectedAppointment.local.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Acessar Link
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Participantes */}
                    {selectedAppointment.participantes.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Participantes (
                          {selectedAppointment.participantes.length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedAppointment.participantes.map(
                            (participante) => (
                              <div
                                key={participante.id}
                                className="flex items-center justify-between p-3 border rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={participante.avatar} />
                                    <AvatarFallback>
                                      {participante.nome
                                        .charAt(0)
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="text-sm font-medium">
                                      {participante.nome}
                                    </div>
                                    <div className="text-xs text-muted-foreground capitalize">
                                      {participante.tipo}
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

                    {selectedAppointment.observacoes && (
                      <div>
                        <h4 className="font-semibold mb-2">Observações</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {selectedAppointment.observacoes}
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <DialogFooter className="flex justify-between border-t pt-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicar
                    </Button>
                    {selectedAppointment.publico && (
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Compartilhar
                      </Button>
                    )}
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
