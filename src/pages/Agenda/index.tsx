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
} from "@/components/ui/sheet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuditSystem } from "@/hooks/useAuditSystem";
import { useTarefaIntegration } from "@/hooks/useTarefaIntegration";
import {
  format,
  parseISO,
  isPast,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from "date-fns";
import { ptBR } from "date-fns/locale";

// Interfaces
interface TeamMember {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  ativo: boolean;
  cor: string;
  avatar?: string;
}

interface Cliente {
  id: string;
  nome: string;
  documento: string;
  telefone: string;
  email: string;
}

interface Local {
  nome: string;
  endereco: string;
  sala?: string;
  tipo: "presencial" | "virtual" | "hibrido";
  link_virtual?: string;
}

interface Participante {
  id: string;
  nome: string;
  email: string;
  tipo: "cliente" | "advogado" | "terceiro";
  confirmado: boolean;
  obrigatorio: boolean;
}

interface Lembrete {
  tipo: "email" | "sms" | "push";
  antecedencia: number; // em minutos
  ativo: boolean;
}

interface Appointment {
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
  local?: Local;
  cliente?: Cliente;
  participantes: Participante[];
  responsavel: TeamMember;
  lembretes: Lembrete[];
  anexos: any[];
  tags: string[];
  cor: string;
  publico?: boolean;
  link_publico?: string;
  observacoes?: string;
  processo_id?: string;
  categoria?: string;
  valor?: number;
  forma_cobranca?: "fixo" | "por_hora" | "gratuito";
  tempo_estimado?: number; // em minutos
  notificacoes_enviadas?: boolean;
  criado_em: string;
  criado_por: string;
  atualizado_em?: string;
  sincronizado_google?: boolean;
}

interface GoogleCalendarConfig {
  conectado: boolean;
  sincronizacao_automatica: boolean;
  calendarios_disponiveis: string[];
}

interface CalendlyConfig {
  ativo: boolean;
  link_publico: string;
  tipos_eventos: string[];
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

interface AgendaView {
  type: "month" | "week" | "day" | "list" | "team";
  date: Date;
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
            ativo: true,
            cor: "#3B82F6",
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
          processo_id: "proc-001",
          categoria: "trabalhista",
          valor: 500,
          forma_cobranca: "fixo",
          tempo_estimado: 90,
          notificacoes_enviadas: true,
          criado_em: "2024-01-20T10:00:00Z",
          criado_por: "user-001",
          sincronizado_google: false,
        },
        {
          id: "apt-002",
          titulo: "Reunião de Estratégia - Processo ABC",
          descricao: "Reunião para definir estratégia processual",
          dataInicio: "2024-01-26T10:00:00Z",
          dataFim: "2024-01-26T11:30:00Z",
          diaInteiro: false,
          tipo: "reuniao",
          status: "agendado",
          prioridade: "media",
          local: {
            nome: "Escritório Lawdesk",
            endereco: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
            sala: "Sala de Reuniões 2",
            tipo: "presencial",
          },
          participantes: [
            {
              id: "part-003",
              nome: "Dr. Pedro Costa",
              email: "pedro.costa@lawdesk.com",
              tipo: "advogado",
              confirmado: true,
              obrigatorio: true,
            },
            {
              id: "part-004",
              nome: "Dra. Ana Lima",
              email: "ana.lima@lawdesk.com",
              tipo: "advogado",
              confirmado: false,
              obrigatorio: false,
            },
          ],
          responsavel: {
            id: "tm-001",
            nome: "Dr. Pedro Costa",
            cargo: "Advogado Sênior",
            departamento: "Trabalhista",
            ativo: true,
            cor: "#3B82F6",
          },
          lembretes: [
            { tipo: "email", antecedencia: 60, ativo: true },
            { tipo: "push", antecedencia: 15, ativo: true },
          ],
          anexos: [],
          tags: ["estratégia", "interno"],
          cor: "#10B981",
          publico: false,
          processo_id: "proc-002",
          categoria: "empresarial",
          forma_cobranca: "gratuito",
          tempo_estimado: 90,
          notificacoes_enviadas: false,
          criado_em: "2024-01-22T14:30:00Z",
          criado_por: "user-001",
          sincronizado_google: false,
        },
      ];

      setAppointments(mockAppointments);
      setFilteredAppointments(mockAppointments);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Filtrar appointments
  useEffect(() => {
    let filtered = appointments;

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.responsavel.nome.toLowerCase().includes(searchTerm.toLowerCase()),
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

    // Filtro por membros da equipe selecionados
    if (selectedTeamMembers.length > 0 && view.type === "team") {
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
    view.type,
  ]);

  // Funções de navegação
  const navigateDate = (direction: "prev" | "next") => {
    const currentDate = view.date;
    let newDate: Date;

    switch (view.type) {
      case "month":
        newDate =
          direction === "next"
            ? addDays(currentDate, 30)
            : addDays(currentDate, -30);
        break;
      case "week":
        newDate =
          direction === "next"
            ? addDays(currentDate, 7)
            : addDays(currentDate, -7);
        break;
      case "day":
        newDate =
          direction === "next"
            ? addDays(currentDate, 1)
            : addDays(currentDate, -1);
        break;
      default:
        newDate = currentDate;
    }

    setView({ ...view, date: newDate });
  };

  const goToToday = () => {
    setView({ ...view, date: new Date() });
    setSelectedDate(new Date());
  };

  const getViewTitle = () => {
    const date = view.date;

    switch (view.type) {
      case "month":
        return format(date, "MMMM yyyy", { locale: ptBR });
      case "week":
        const weekStart = startOfWeek(date, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
        return `${format(weekStart, "dd MMM", { locale: ptBR })} - ${format(weekEnd, "dd MMM yyyy", { locale: ptBR })}`;
      case "day":
        return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      case "list":
        return "Lista de Compromissos";
      case "team":
        return "Agenda da Equipe";
      default:
        return "";
    }
  };

  // Função para gerar link público
  const generatePublicLink = () => {
    const userName =
      user?.name?.toLowerCase().replace(/\s+/g, "-") || "usuario";
    const userId = user?.id || "001";
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

  // Verificar permissões
  if (!hasPermission("agenda", "read")) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
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
      <div className="agenda-container">
        <MobileSidebar />

        <div className={`agenda-mobile lg:agenda-desktop space-y-6`}>
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
          <Card className="agenda-card">
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
                    <TabsList className={isMobile ? "grid-cols-4" : ""}>
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
          <div className="agenda-grid">
            {/* Desktop Mini Calendar */}
            <div className="agenda-sidebar">
              <Card className="agenda-card">
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
                      <span className="text-muted-foreground">
                        Google Calendar
                      </span>
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
                      <span className="text-muted-foreground">
                        Link Público
                      </span>
                      <div className="flex items-center gap-1">
                        {calendlyConfig.ativo ? (
                          <Globe className="h-3 w-3 text-green-600" />
                        ) : (
                          <Globe className="h-3 w-3 text-gray-400" />
                        )}
                        <span
                          className={`text-xs ${calendlyConfig.ativo ? "text-green-600" : "text-muted-foreground"}`}
                        >
                          {calendlyConfig.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main View */}
            <div className="col-span-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={view.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {view.type === "list" ? (
                    /* Lista de Compromissos */
                    <Card className="agenda-card">
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
                                          : "bg-background"
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
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-8 w-8 p-0"
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
                                            >
                                              <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedAppointment(
                                                  appointment,
                                                );
                                                setShowViewDialog(true);
                                              }}
                                            >
                                              <Eye className="h-4 w-4 mr-2" />
                                              Visualizar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                // TODO: Implementar edição
                                              }}
                                            >
                                              <Edit className="h-4 w-4 mr-2" />
                                              Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                // TODO: Implementar exclusão
                                              }}
                                              className="text-destructive"
                                            >
                                              <Trash2 className="h-4 w-4 mr-2" />
                                              Excluir
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
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
                    <Card className="agenda-card">
                      <CardContent className="p-8">
                        <div className="text-center">
                          <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <h3 className="text-lg font-semibold mb-2">
                            Visualização em Desenvolvimento
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            Esta visualização ainda está sendo desenvolvida. Use
                            a visualização em lista por enquanto.
                          </p>
                          <Button
                            onClick={() => setView({ ...view, type: "list" })}
                            variant="outline"
                          >
                            <List className="h-4 w-4 mr-2" />
                            Ver Lista
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
      </div>
    </TooltipProvider>
  );
}
