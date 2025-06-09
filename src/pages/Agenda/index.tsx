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

// Definir tipos expandidos para integração completa
export interface IntegratedAppointment {
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
    | "atendimento"
    | "financeiro"
    | "ia_sessao"
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
    coordenadas?: { lat: number; lng: number };
  };

  // Participantes e responsáveis
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
      | "perito"
      | "assistente"
      | "outro";
    confirmado: boolean;
    obrigatorio: boolean;
    avatar?: string;
  }>;

  // Integrações com outros módulos
  cliente?: {
    id: string;
    nome: string;
    avatar?: string;
    documento?: string;
    telefone?: string;
    email?: string;
  };

  processo?: {
    numero: string;
    nome: string;
    id: string;
    area?: string;
    status?: string;
    valor?: number;
  };

  contrato?: {
    id: string;
    numero: string;
    nome: string;
    status?: string;
    valor?: number;
  };

  tarefa?: {
    id: string;
    titulo: string;
    status?: string;
    prioridade?: string;
  };

  atendimento?: {
    id: string;
    numero: string;
    canal: "telefone" | "email" | "chat" | "presencial" | "video";
    status?: string;
  };

  financeiro?: {
    id: string;
    tipo: "receita" | "despesa" | "honorario";
    valor?: number;
    status?: string;
  };

  ia_contexto?: {
    sessao_id: string;
    resumo?: string;
    sugestoes?: string[];
    documentos_analisados?: string[];
  };

  // Responsável e equipe
  responsavel: {
    id: string;
    nome: string;
    avatar?: string;
    cargo?: string;
    departamento?: string;
  };

  equipe?: Array<{
    id: string;
    nome: string;
    papel: string;
    avatar?: string;
  }>;

  // Sistema de notificações e lembretes
  lembretes: Array<{
    tipo: "email" | "sms" | "push" | "whatsapp" | "teams" | "slack";
    antecedencia: number; // em minutos
    ativo: boolean;
    template?: string;
    destinatarios?: string[];
  }>;

  // Anexos e documentos
  anexos: Array<{
    id: string;
    nome: string;
    url: string;
    tipo: string;
    tamanho?: number;
    uploaded_by?: string;
    uploaded_at?: string;
  }>;

  // Recorrência
  recorrencia?: {
    tipo: "diaria" | "semanal" | "mensal" | "anual" | "custom";
    intervalo: number;
    dias_semana?: number[]; // 0-6 (domingo-sábado)
    data_fim?: string;
    excecoes?: string[]; // datas para pular
  };

  // Custos e faturamento
  custos?: {
    estimado?: number;
    real?: number;
    moeda: string;
    categoria?: string;
    centro_custo?: string;
  };

  // Métricas e analytics
  metricas?: {
    duracao_real?: number; // em minutos
    taxa_comparecimento?: number;
    satisfacao?: number; // 1-5
    resultado?: "sucesso" | "parcial" | "fracasso";
    notas?: string;
  };

  // Sistema
  observacoes?: string;
  tags?: string[];
  cor?: string;
  privado: boolean;
  criado: string;
  atualizado: string;
  criado_por: string;
  atualizado_por?: string;
}

interface AgendaView {
  type: "month" | "week" | "day" | "list" | "timeline" | "kanban";
  date: Date;
}

interface DashboardMetrics {
  total_eventos: number;
  eventos_hoje: number;
  eventos_semana: number;
  proximas_audiencias: number;
  prazos_vencendo: number;
  reunioes_pendentes: number;
  taxa_comparecimento: number;
  valor_total_negociado: number;
  clientes_atendidos: number;
  horas_produtivas: number;
}

interface IntegrationStats {
  clientes_vinculados: number;
  processos_relacionados: number;
  contratos_ativos: number;
  tarefas_geradas: number;
  atendimentos_agendados: number;
  valores_financeiros: number;
  sessoes_ia: number;
}

export type { IntegratedAppointment as Appointment };

export default function AgendaJuridicaIntegrada() {
  // Estados principais
  const [view, setView] = useState<AgendaView>({
    type: "month",
    date: new Date(),
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [appointments, setAppointments] = useState<IntegratedAppointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    IntegratedAppointment[]
  >([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<IntegratedAppointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Estados de interface
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showIntegrationPanel, setShowIntegrationPanel] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterResponsavel, setFilterResponsavel] = useState("all");
  const [filterIntegration, setFilterIntegration] = useState("all");
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  });

  // Estados de métricas
  const [dashboardMetrics, setDashboardMetrics] =
    useState<DashboardMetrics | null>(null);
  const [integrationStats, setIntegrationStats] =
    useState<IntegrationStats | null>(null);

  // Hooks
  const { user, hasPermission } = usePermissions();
  const { logAction } = useAuditSystem();
  const {
    criarTarefaDeAgenda,
    criarTarefaDeCliente,
    criarTarefaDeProcesso,
    criarTarefaDeContrato,
    criarTarefaDeAtendimento,
  } = useTarefaIntegration();

  // Detectar dispositivo móvel
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Configurações de tipos expandidas
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
    atendimento: {
      label: "Atendimento",
      icon: Headphones,
      color: "bg-cyan-500",
      textColor: "text-cyan-600",
      borderColor: "border-cyan-200",
      bgColor: "bg-cyan-50",
    },
    financeiro: {
      label: "Financeiro",
      icon: DollarSign,
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-200",
      bgColor: "bg-emerald-50",
    },
    ia_sessao: {
      label: "IA Jurídico",
      icon: Brain,
      color: "bg-indigo-500",
      textColor: "text-indigo-600",
      borderColor: "border-indigo-200",
      bgColor: "bg-indigo-50",
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

  // Carregar dados mockados com integrações
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock de eventos integrados
      const mockAppointments: IntegratedAppointment[] = [
        {
          id: "apt-001",
          titulo: "Audiência de Conciliação - João Silva",
          descricao: "Audiência de conciliação trabalhista com mediação",
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
            coordenadas: { lat: -23.5505, lng: -46.6333 },
          },

          cliente: {
            id: "cli-001",
            nome: "João Silva",
            documento: "123.456.789-00",
            telefone: "(11) 99999-9999",
            email: "joao.silva@email.com",
            avatar: "/avatars/joao-silva.jpg",
          },

          processo: {
            id: "proc-001",
            numero: "1234567-89.2024.8.26.0001",
            nome: "João Silva vs. Empresa ABC Ltda",
            area: "Trabalhista",
            status: "ativo",
            valor: 50000,
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
            {
              id: "part-003",
              nome: "Juiz Dr. Carlos Mendes",
              tipo: "juiz",
              confirmado: true,
              obrigatorio: true,
            },
          ],

          responsavel: {
            id: "adv-001",
            nome: "Dr. Pedro Costa",
            cargo: "Advogado Sênior",
            departamento: "Trabalhista",
          },

          lembretes: [
            { tipo: "email", antecedencia: 1440, ativo: true }, // 24h
            { tipo: "sms", antecedencia: 120, ativo: true }, // 2h
            { tipo: "push", antecedencia: 30, ativo: true },
          ],

          anexos: [
            {
              id: "anx-001",
              nome: "Petição Inicial.pdf",
              url: "/api/files/anexos/anx-001",
              tipo: "application/pdf",
              tamanho: 2048000,
            },
          ],

          custos: {
            estimado: 500,
            moeda: "BRL",
            categoria: "Custas Processuais",
          },

          tags: ["trabalhista", "conciliação", "urgente"],
          cor: "#3B82F6",
          privado: false,
          observacoes:
            "Audiência obrigatória - preparar documentos de conciliação",
          criado: "2024-01-20T10:00:00Z",
          atualizado: "2024-01-22T14:30:00Z",
          criado_por: "adv-001",
        },

        {
          id: "apt-002",
          titulo: "Reunião Estratégica - Contrato Empresa XYZ",
          descricao:
            "Revisão e negociação de contrato de prestação de serviços",
          dataInicio: "2024-01-26T10:00:00Z",
          dataFim: "2024-01-26T12:00:00Z",
          diaInteiro: false,
          tipo: "reuniao",
          status: "agendado",
          prioridade: "media",

          local: {
            nome: "Escritório - Sala de Reuniões Executive",
            endereco: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
            sala: "Executive Room",
            tipo: "presencial",
          },

          cliente: {
            id: "cli-002",
            nome: "Empresa XYZ Ltda",
            documento: "12.345.678/0001-90",
            telefone: "(11) 3333-3333",
            email: "contato@empresaxyz.com",
          },

          contrato: {
            id: "cont-001",
            numero: "CONT-2024-001",
            nome: "Prestação de Serviços Jurídicos",
            status: "em_negociacao",
            valor: 120000,
          },

          financeiro: {
            id: "fin-001",
            tipo: "receita",
            valor: 120000,
            status: "previsto",
          },

          participantes: [
            {
              id: "part-004",
              nome: "Maria Santos - CEO",
              email: "maria.santos@empresaxyz.com",
              tipo: "cliente",
              confirmado: false,
              obrigatorio: true,
            },
            {
              id: "part-005",
              nome: "Dra. Ana Lima",
              email: "ana.lima@lawdesk.com",
              tipo: "advogado",
              confirmado: true,
              obrigatorio: true,
            },
          ],

          responsavel: {
            id: "adv-002",
            nome: "Dra. Ana Lima",
            cargo: "Sócia",
            departamento: "Empresarial",
          },

          equipe: [
            {
              id: "eq-001",
              nome: "Dr. Roberto Alves",
              papel: "Advogado Assistente",
            },
          ],

          lembretes: [
            { tipo: "email", antecedencia: 1440, ativo: true },
            { tipo: "push", antecedencia: 60, ativo: true },
          ],

          custos: {
            estimado: 2000,
            moeda: "BRL",
            categoria: "Honorários",
          },

          tags: ["empresarial", "contrato", "receita"],
          cor: "#10B981",
          privado: false,
          anexos: [],
          observacoes: "Preparar minuta de contrato atualizada",
          criado: "2024-01-23T09:00:00Z",
          atualizado: "2024-01-23T09:00:00Z",
          criado_por: "adv-002",
        },

        {
          id: "apt-003",
          titulo: "Atendimento Virtual - Consulta Jurídica",
          descricao: "Primeira consulta jurídica via videoconferência",
          dataInicio: "2024-01-24T16:00:00Z",
          dataFim: "2024-01-24T17:00:00Z",
          diaInteiro: false,
          tipo: "video",
          status: "confirmado",
          prioridade: "media",

          local: {
            nome: "Atendimento Virtual",
            tipo: "online",
            link: "https://meet.google.com/abc-defg-hij",
          },

          cliente: {
            id: "cli-003",
            nome: "Carlos Oliveira",
            documento: "987.654.321-00",
            telefone: "(11) 8888-8888",
            email: "carlos.oliveira@email.com",
          },

          atendimento: {
            id: "atend-001",
            numero: "AT-2024-001",
            canal: "video",
            status: "agendado",
          },

          participantes: [
            {
              id: "part-006",
              nome: "Carlos Oliveira",
              email: "carlos.oliveira@email.com",
              tipo: "cliente",
              confirmado: true,
              obrigatorio: true,
            },
            {
              id: "part-007",
              nome: "Dr. Luis Santos",
              email: "luis.santos@lawdesk.com",
              tipo: "advogado",
              confirmado: true,
              obrigatorio: true,
            },
          ],

          responsavel: {
            id: "adv-003",
            nome: "Dr. Luis Santos",
            cargo: "Advogado Júnior",
            departamento: "Atendimento",
          },

          lembretes: [
            { tipo: "email", antecedencia: 60, ativo: true },
            { tipo: "whatsapp", antecedencia: 30, ativo: true },
          ],

          custos: {
            estimado: 300,
            moeda: "BRL",
            categoria: "Consulta",
          },

          tags: ["atendimento", "primeira_consulta", "video"],
          cor: "#8B5CF6",
          privado: false,
          anexos: [],
          observacoes: "Primeira consulta - preparar material introdutório",
          criado: "2024-01-22T11:00:00Z",
          atualizado: "2024-01-22T11:00:00Z",
          criado_por: "adv-003",
        },

        {
          id: "apt-004",
          titulo: "Sessão IA Jurídico - Análise de Documentos",
          descricao: "Sessão de análise de documentos contratuais com IA",
          dataInicio: "2024-01-27T14:00:00Z",
          dataFim: "2024-01-27T15:00:00Z",
          diaInteiro: false,
          tipo: "ia_sessao",
          status: "agendado",
          prioridade: "baixa",

          local: {
            nome: "IA Jurídico - Ambiente Virtual",
            tipo: "online",
          },

          ia_contexto: {
            sessao_id: "ia-sess-001",
            resumo:
              "Análise de cláusulas contratuais para identificação de riscos",
            sugestoes: [
              "Revisar cláusulas de rescisão",
              "Verificar penalidades por atraso",
              "Analisar garantias oferecidas",
            ],
            documentos_analisados: [
              "Contrato Base v1.pdf",
              "Aditivo Contratual.pdf",
            ],
          },

          participantes: [
            {
              id: "part-008",
              nome: "Dra. Ana Lima",
              email: "ana.lima@lawdesk.com",
              tipo: "advogado",
              confirmado: true,
              obrigatorio: true,
            },
          ],

          responsavel: {
            id: "adv-002",
            nome: "Dra. Ana Lima",
            cargo: "Sócia",
            departamento: "Empresarial",
          },

          lembretes: [{ tipo: "push", antecedencia: 30, ativo: true }],

          tags: ["ia", "análise", "contratos"],
          cor: "#6366F1",
          privado: false,
          anexos: [],
          observacoes: "Preparar documentos para análise pela IA",
          criado: "2024-01-23T16:00:00Z",
          atualizado: "2024-01-23T16:00:00Z",
          criado_por: "adv-002",
        },

        {
          id: "apt-005",
          titulo: "PRAZO CRÍTICO - Recurso de Apelação",
          descricao: "Prazo final para protocolo de recurso de apelação",
          dataInicio: "2024-01-29T17:00:00Z",
          dataFim: "2024-01-29T17:00:00Z",
          diaInteiro: true,
          tipo: "prazo",
          status: "agendado",
          prioridade: "critica",

          processo: {
            id: "proc-002",
            numero: "9876543-21.2024.8.26.0001",
            nome: "Maria Santos vs. Banco DEF",
            area: "Civil",
            status: "recurso",
            valor: 80000,
          },

          cliente: {
            id: "cli-004",
            nome: "Maria Santos",
            documento: "456.789.123-00",
            telefone: "(11) 7777-7777",
            email: "maria.santos.adv@email.com",
          },

          tarefa: {
            id: "tar-001",
            titulo: "Protocolar Recurso de Apelação",
            status: "em_andamento",
            prioridade: "critica",
          },

          participantes: [
            {
              id: "part-009",
              nome: "Dr. Pedro Costa",
              email: "pedro.costa@lawdesk.com",
              tipo: "advogado",
              confirmado: true,
              obrigatorio: true,
            },
          ],

          responsavel: {
            id: "adv-001",
            nome: "Dr. Pedro Costa",
            cargo: "Advogado Sênior",
            departamento: "Civil",
          },

          lembretes: [
            { tipo: "email", antecedencia: 4320, ativo: true }, // 3 dias
            { tipo: "sms", antecedencia: 1440, ativo: true }, // 1 dia
            { tipo: "push", antecedencia: 480, ativo: true }, // 8h
            { tipo: "whatsapp", antecedencia: 120, ativo: true }, // 2h
          ],

          anexos: [
            {
              id: "anx-002",
              nome: "Minuta Recurso Apelação.docx",
              url: "/api/files/anexos/anx-002",
              tipo: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              tamanho: 1024000,
            },
          ],

          custos: {
            estimado: 800,
            moeda: "BRL",
            categoria: "Custas Recursais",
          },

          tags: ["prazo", "recurso", "crítico", "civil"],
          cor: "#EF4444",
          privado: false,
          observacoes:
            "ATENÇÃO: Prazo fatal! Documentos prontos para protocolo.",
          criado: "2024-01-15T08:00:00Z",
          atualizado: "2024-01-24T10:00:00Z",
          criado_por: "adv-001",
        },
      ];

      // Mock de métricas do dashboard
      const mockMetrics: DashboardMetrics = {
        total_eventos: mockAppointments.length,
        eventos_hoje: mockAppointments.filter((apt) =>
          isToday(parseISO(apt.dataInicio)),
        ).length,
        eventos_semana: mockAppointments.filter((apt) => {
          const date = parseISO(apt.dataInicio);
          const weekStart = startOfWeek(new Date());
          const weekEnd = endOfWeek(new Date());
          return isWithinInterval(date, { start: weekStart, end: weekEnd });
        }).length,
        proximas_audiencias: mockAppointments.filter(
          (apt) =>
            apt.tipo === "audiencia" && isFuture(parseISO(apt.dataInicio)),
        ).length,
        prazos_vencendo: mockAppointments.filter(
          (apt) =>
            apt.tipo === "prazo" &&
            differenceInDays(parseISO(apt.dataInicio), new Date()) <= 7,
        ).length,
        reunioes_pendentes: mockAppointments.filter(
          (apt) => apt.tipo === "reuniao" && apt.status === "agendado",
        ).length,
        taxa_comparecimento: 87.5,
        valor_total_negociado: 370000,
        clientes_atendidos: 15,
        horas_produtivas: 42.5,
      };

      // Mock de estatísticas de integração
      const mockIntegrationStats: IntegrationStats = {
        clientes_vinculados: mockAppointments.filter((apt) => apt.cliente)
          .length,
        processos_relacionados: mockAppointments.filter((apt) => apt.processo)
          .length,
        contratos_ativos: mockAppointments.filter((apt) => apt.contrato).length,
        tarefas_geradas: mockAppointments.filter((apt) => apt.tarefa).length,
        atendimentos_agendados: mockAppointments.filter(
          (apt) => apt.atendimento,
        ).length,
        valores_financeiros: mockAppointments.filter((apt) => apt.financeiro)
          .length,
        sessoes_ia: mockAppointments.filter((apt) => apt.ia_contexto).length,
      };

      setAppointments(mockAppointments);
      setFilteredAppointments(mockAppointments);
      setDashboardMetrics(mockMetrics);
      setIntegrationStats(mockIntegrationStats);
      setIsLoading(false);

      // Log da ação
      logAction(AUDIT_ACTIONS.READ, AUDIT_MODULES.CALENDAR, {
        appointments_loaded: mockAppointments.length,
        integrations_loaded: Object.keys(mockIntegrationStats).length,
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

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.processo?.numero
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          apt.contrato?.numero
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          apt.tags?.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
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

    // Filtro por integração
    if (filterIntegration !== "all") {
      filtered = filtered.filter((apt) => {
        switch (filterIntegration) {
          case "cliente":
            return apt.cliente;
          case "processo":
            return apt.processo;
          case "contrato":
            return apt.contrato;
          case "tarefa":
            return apt.tarefa;
          case "atendimento":
            return apt.atendimento;
          case "financeiro":
            return apt.financeiro;
          case "ia":
            return apt.ia_contexto;
          default:
            return true;
        }
      });
    }

    // Filtro por data
    filtered = filtered.filter((apt) => {
      const aptDate = parseISO(apt.dataInicio);
      return isWithinInterval(aptDate, {
        start: dateRange.start,
        end: dateRange.end,
      });
    });

    setFilteredAppointments(filtered);
  }, [
    appointments,
    searchTerm,
    filterType,
    filterStatus,
    filterResponsavel,
    filterIntegration,
    dateRange,
  ]);

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

  // Obter responsáveis únicos para filtro
  const uniqueResponsaveis = useMemo(() => {
    const responsaveis = appointments.map((apt) => apt.responsavel);
    const unique = responsaveis.filter(
      (resp, index, self) => index === self.findIndex((r) => r.id === resp.id),
    );
    return unique;
  }, [appointments]);

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
      case "timeline":
        return "Linha do Tempo";
      case "kanban":
        return "Kanban";
      default:
        return "";
    }
  };

  // Criar novo compromisso integrado
  const handleCreateAppointment = async (
    appointmentData: Partial<IntegratedAppointment>,
  ) => {
    if (!appointmentData.titulo || !appointmentData.dataInicio) {
      toast.error("Título e data são obrigatórios");
      return;
    }

    try {
      const appointment: IntegratedAppointment = {
        id: `apt-${Date.now()}`,
        titulo: appointmentData.titulo,
        descricao: appointmentData.descricao || "",
        dataInicio: appointmentData.dataInicio,
        dataFim: appointmentData.dataFim || appointmentData.dataInicio,
        diaInteiro: appointmentData.diaInteiro || false,
        tipo: appointmentData.tipo || "reuniao",
        status: appointmentData.status || "agendado",
        prioridade: appointmentData.prioridade || "media",
        local: appointmentData.local,
        participantes: appointmentData.participantes || [],
        cliente: appointmentData.cliente,
        processo: appointmentData.processo,
        contrato: appointmentData.contrato,
        tarefa: appointmentData.tarefa,
        atendimento: appointmentData.atendimento,
        financeiro: appointmentData.financeiro,
        ia_contexto: appointmentData.ia_contexto,
        responsavel: appointmentData.responsavel || {
          id: user?.id || "user-1",
          nome: user?.name || "Usuário",
        },
        equipe: appointmentData.equipe,
        lembretes: appointmentData.lembretes || [
          { tipo: "email", antecedencia: 30, ativo: true },
        ],
        anexos: appointmentData.anexos || [],
        recorrencia: appointmentData.recorrencia,
        custos: appointmentData.custos,
        metricas: appointmentData.metricas,
        observacoes: appointmentData.observacoes,
        tags: appointmentData.tags || [],
        cor: appointmentData.cor,
        privado: appointmentData.privado || false,
        criado: new Date().toISOString(),
        atualizado: new Date().toISOString(),
        criado_por: user?.id || "user-1",
      };

      // Simular criação
      setAppointments((prev) => [...prev, appointment]);

      // Integrações automáticas
      if (appointment.tipo === "prazo" && appointment.processo) {
        await criarTarefaDeProcesso(
          appointment.titulo,
          appointment.descricao || "",
          parseISO(appointment.dataInicio),
          appointment.processo.id,
        );
      }

      if (appointment.cliente) {
        await criarTarefaDeCliente(
          `Follow-up: ${appointment.titulo}`,
          `Acompanhar resultado do compromisso`,
          parseISO(appointment.dataFim),
          appointment.cliente.id,
        );
      }

      if (appointment.atendimento) {
        await criarTarefaDeAtendimento(
          `Preparar atendimento: ${appointment.titulo}`,
          appointment.descricao || "",
          parseISO(appointment.dataInicio),
          appointment.atendimento.id,
        );
      }

      // Log da ação
      logAction(AUDIT_ACTIONS.CREATE, AUDIT_MODULES.CALENDAR, {
        appointment_id: appointment.id,
        tipo: appointment.tipo,
        integrations: {
          cliente: !!appointment.cliente,
          processo: !!appointment.processo,
          contrato: !!appointment.contrato,
          tarefa: !!appointment.tarefa,
          atendimento: !!appointment.atendimento,
          financeiro: !!appointment.financeiro,
          ia: !!appointment.ia_contexto,
        },
      });

      toast.success("Compromisso criado com sucesso e integrações ativadas!");
      setShowCreateDialog(false);
    } catch (error) {
      console.error("Erro ao criar compromisso:", error);
      toast.error("Erro ao criar compromisso");
    }
  };

  // Renderizar cards de métricas do dashboard
  const renderDashboardMetrics = () => {
    if (!dashboardMetrics) return null;

    const metricsCards = [
      {
        title: "Eventos Hoje",
        value: dashboardMetrics.eventos_hoje,
        icon: CalendarDays,
        color: "blue",
        description: "compromissos agendados",
      },
      {
        title: "Audiências",
        value: dashboardMetrics.proximas_audiencias,
        icon: Gavel,
        color: "green",
        description: "próximas audiências",
      },
      {
        title: "Prazos Críticos",
        value: dashboardMetrics.prazos_vencendo,
        icon: AlertTriangle,
        color: "red",
        description: "vencendo em 7 dias",
      },
      {
        title: "Comparecimento",
        value: `${dashboardMetrics.taxa_comparecimento}%`,
        icon: TrendingUp,
        color: "emerald",
        description: "taxa de comparecimento",
      },
      {
        title: "Receita Negociada",
        value: `R$ ${(dashboardMetrics.valor_total_negociado / 1000).toFixed(0)}k`,
        icon: DollarSign,
        color: "purple",
        description: "em negociações",
      },
      {
        title: "Clientes Atendidos",
        value: dashboardMetrics.clientes_atendidos,
        icon: Users,
        color: "cyan",
        description: "neste período",
      },
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {metricsCards.map((metric, index) => {
          const IconComponent = metric.icon;
          const colorClasses = {
            blue: "bg-blue-500 text-blue-600 bg-blue-50",
            green: "bg-green-500 text-green-600 bg-green-50",
            red: "bg-red-500 text-red-600 bg-red-50",
            emerald: "bg-emerald-500 text-emerald-600 bg-emerald-50",
            purple: "bg-purple-500 text-purple-600 bg-purple-50",
            cyan: "bg-cyan-500 text-cyan-600 bg-cyan-50",
          };

          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-${metric.color}-500`}>
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {metric.value}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm mb-1">
                      {metric.title}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {metric.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    );
  };

  // Renderizar estatísticas de integração
  const renderIntegrationStats = () => {
    if (!integrationStats) return null;

    const integrationCards = [
      {
        title: "Clientes",
        value: integrationStats.clientes_vinculados,
        icon: Users,
        color: "blue",
        total: appointments.length,
      },
      {
        title: "Processos",
        value: integrationStats.processos_relacionados,
        icon: Gavel,
        color: "green",
        total: appointments.length,
      },
      {
        title: "Contratos",
        value: integrationStats.contratos_ativos,
        icon: FileText,
        color: "purple",
        total: appointments.length,
      },
      {
        title: "Tarefas",
        value: integrationStats.tarefas_geradas,
        icon: CheckCircle,
        color: "orange",
        total: appointments.length,
      },
      {
        title: "Atendimentos",
        value: integrationStats.atendimentos_agendados,
        icon: Headphones,
        color: "cyan",
        total: appointments.length,
      },
      {
        title: "Financeiro",
        value: integrationStats.valores_financeiros,
        icon: DollarSign,
        color: "emerald",
        total: appointments.length,
      },
      {
        title: "IA Jurídico",
        value: integrationStats.sessoes_ia,
        icon: Brain,
        color: "indigo",
        total: appointments.length,
      },
    ];

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Integrações Ativas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {integrationCards.map((integration) => {
              const IconComponent = integration.icon;
              const percentage =
                integration.total > 0
                  ? (integration.value / integration.total) * 100
                  : 0;

              return (
                <div key={integration.title} className="text-center">
                  <div className="mb-2">
                    <div
                      className={`p-3 rounded-lg bg-${integration.color}-50 mx-auto w-fit`}
                    >
                      <IconComponent
                        className={`h-6 w-6 text-${integration.color}-600`}
                      />
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-900 mb-1">
                    {integration.value}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {integration.title}
                  </div>
                  <Progress value={percentage} className="h-1" />
                  <div className="text-xs text-gray-500 mt-1">
                    {percentage.toFixed(0)}%
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Mobile Sidebar
  const MobileSidebar = () => (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-primary" />
            Agenda Jurídica
          </SheetTitle>
          <SheetDescription>Gerencie compromissos integrados</SheetDescription>
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

            {/* Quick Stats */}
            <div>
              <h4 className="font-medium mb-3">Estatísticas Rápidas</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hoje</span>
                  <span className="font-medium">
                    {dashboardMetrics?.eventos_hoje || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Esta semana</span>
                  <span className="font-medium">
                    {dashboardMetrics?.eventos_semana || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Prazos críticos</span>
                  <span className="font-medium text-red-600">
                    {dashboardMetrics?.prazos_vencendo || 0}
                  </span>
                </div>
              </div>
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
                  onClick={() => setShowIntegrationPanel(true)}
                  className="w-full justify-start"
                  size="sm"
                >
                  <Link className="h-4 w-4 mr-2" />
                  Integrações
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDashboard(!showDashboard)}
                  className="w-full justify-start"
                  size="sm"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
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
          <p className="text-muted-foreground">
            Sincronizando dados e integrações...
          </p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50/50">
        {/* Mobile Sidebar */}
        <MobileSidebar />

        <div className={`${isMobile ? "p-4" : "p-6"} space-y-6`}>
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
                  Gestão integrada de compromissos, audiências e prazos
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {!isMobile && (
                <>
                  <Button
                    onClick={() => setShowDashboard(!showDashboard)}
                    variant={showDashboard ? "default" : "outline"}
                    size="sm"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    onClick={() => setShowIntegrationPanel(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Integrações
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

          {/* Dashboard Metrics */}
          {showDashboard && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderDashboardMetrics()}
              {renderIntegrationStats()}
            </motion.div>
          )}

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
                      {!isMobile && (
                        <TabsTrigger value="week">Semana</TabsTrigger>
                      )}
                      <TabsTrigger value="day">Dia</TabsTrigger>
                      <TabsTrigger value="list">Lista</TabsTrigger>
                      {!isMobile && (
                        <TabsTrigger value="kanban">Kanban</TabsTrigger>
                      )}
                    </TabsList>
                  </Tabs>
                </div>

                {/* Filters */}
                <Separator />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
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
                    value={filterIntegration}
                    onValueChange={setFilterIntegration}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Integração" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="cliente">Com Cliente</SelectItem>
                      <SelectItem value="processo">Com Processo</SelectItem>
                      <SelectItem value="contrato">Com Contrato</SelectItem>
                      <SelectItem value="tarefa">Com Tarefa</SelectItem>
                      <SelectItem value="atendimento">
                        Com Atendimento
                      </SelectItem>
                      <SelectItem value="financeiro">Com Financeiro</SelectItem>
                      <SelectItem value="ia">Com IA</SelectItem>
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

                    {/* Quick stats for desktop */}
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Hoje</span>
                        <Badge variant="secondary">
                          {dashboardMetrics?.eventos_hoje || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Esta semana</span>
                        <Badge variant="secondary">
                          {dashboardMetrics?.eventos_semana || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Prazos críticos</span>
                        <Badge variant="destructive">
                          {dashboardMetrics?.prazos_vencendo || 0}
                        </Badge>
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
                  {view.type === "list" ? (
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
                            <Button variant="outline" size="sm">
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Atualizar
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
                                Nenhum compromisso encontrado para os filtros
                                selecionados
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
                                  const isUrgent =
                                    appointment.prioridade === "urgente" ||
                                    appointment.prioridade === "critica";

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
                                          : isUrgent
                                            ? "bg-orange-50 border-orange-200"
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
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
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
                                              {isUrgent && !isOverdue && (
                                                <Badge
                                                  variant="secondary"
                                                  className="text-xs bg-orange-100 text-orange-800"
                                                >
                                                  Urgente
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

                                            {/* Integration indicators */}
                                            <div className="flex items-center gap-2 flex-wrap">
                                              {appointment.processo && (
                                                <Tooltip>
                                                  <TooltipTrigger>
                                                    <Badge
                                                      variant="outline"
                                                      className="text-xs"
                                                    >
                                                      <Gavel className="h-3 w-3 mr-1" />
                                                      Processo
                                                    </Badge>
                                                  </TooltipTrigger>
                                                  <TooltipContent>
                                                    {
                                                      appointment.processo
                                                        .numero
                                                    }
                                                  </TooltipContent>
                                                </Tooltip>
                                              )}
                                              {appointment.contrato && (
                                                <Badge
                                                  variant="outline"
                                                  className="text-xs"
                                                >
                                                  <FileText className="h-3 w-3 mr-1" />
                                                  Contrato
                                                </Badge>
                                              )}
                                              {appointment.tarefa && (
                                                <Badge
                                                  variant="outline"
                                                  className="text-xs"
                                                >
                                                  <CheckCircle className="h-3 w-3 mr-1" />
                                                  Tarefa
                                                </Badge>
                                              )}
                                              {appointment.atendimento && (
                                                <Badge
                                                  variant="outline"
                                                  className="text-xs"
                                                >
                                                  <Headphones className="h-3 w-3 mr-1" />
                                                  Atendimento
                                                </Badge>
                                              )}
                                              {appointment.financeiro && (
                                                <Badge
                                                  variant="outline"
                                                  className="text-xs"
                                                >
                                                  <DollarSign className="h-3 w-3 mr-1" />
                                                  Financeiro
                                                </Badge>
                                              )}
                                              {appointment.ia_contexto && (
                                                <Badge
                                                  variant="outline"
                                                  className="text-xs"
                                                >
                                                  <Brain className="h-3 w-3 mr-1" />
                                                  IA
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2 ml-4">
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
                            Use a visualização "Lista" para ver todos os
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

        {/* Dialog para Criar Compromisso */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Novo Compromisso Integrado
              </DialogTitle>
              <DialogDescription>
                Criar compromisso com integrações automáticas aos módulos do
                sistema
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">
                  Formulário de criação em desenvolvimento
                </p>
                <p className="text-sm text-gray-500">
                  O formulário integrado estará disponível em breve com todos os
                  módulos conectados
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
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
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
                          Prioridade{" "}
                          {
                            priorityConfig[selectedAppointment.prioridade]
                              ?.label
                          }
                        </Badge>
                        <Badge variant="outline">
                          {typeConfig[selectedAppointment.tipo]?.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh]">
                  <div className="space-y-6 pr-4">
                    {selectedAppointment.descricao && (
                      <div>
                        <h4 className="font-semibold mb-2">Descrição</h4>
                        <p className="text-muted-foreground">
                          {selectedAppointment.descricao}
                        </p>
                      </div>
                    )}

                    {/* Informações principais em grid responsivo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Data e Hora */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Data e Hora
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <div>
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
                        </div>
                      </div>

                      {/* Local */}
                      {selectedAppointment.local && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Local
                          </h4>
                          <div className="space-y-2">
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {selectedAppointment.local.nome}
                                <Badge variant="outline" className="text-xs">
                                  {selectedAppointment.local.tipo}
                                </Badge>
                              </div>
                              {selectedAppointment.local.endereco && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  {selectedAppointment.local.endereco}
                                </div>
                              )}
                              {selectedAppointment.local.sala && (
                                <div className="text-sm text-muted-foreground">
                                  {selectedAppointment.local.sala}
                                </div>
                              )}
                            </div>

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

                    {/* Integrações - Seção destacada */}
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Link className="h-5 w-5 text-blue-600" />
                          Integrações Ativas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {selectedAppointment.cliente && (
                            <div className="p-3 bg-white rounded-lg border">
                              <div className="flex items-center gap-2 mb-2">
                                <Building className="h-4 w-4 text-blue-600" />
                                <span className="font-medium text-sm">
                                  Cliente
                                </span>
                              </div>
                              <div className="text-sm">
                                <div className="font-medium">
                                  {selectedAppointment.cliente.nome}
                                </div>
                                <div className="text-muted-foreground">
                                  {selectedAppointment.cliente.documento}
                                </div>
                              </div>
                            </div>
                          )}

                          {selectedAppointment.processo && (
                            <div className="p-3 bg-white rounded-lg border">
                              <div className="flex items-center gap-2 mb-2">
                                <Gavel className="h-4 w-4 text-green-600" />
                                <span className="font-medium text-sm">
                                  Processo
                                </span>
                              </div>
                              <div className="text-sm">
                                <div className="font-medium font-mono">
                                  {selectedAppointment.processo.numero}
                                </div>
                                <div className="text-muted-foreground">
                                  {selectedAppointment.processo.area}
                                </div>
                                {selectedAppointment.processo.valor && (
                                  <div className="text-green-600 font-medium">
                                    R${" "}
                                    {selectedAppointment.processo.valor.toLocaleString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {selectedAppointment.contrato && (
                            <div className="p-3 bg-white rounded-lg border">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-4 w-4 text-purple-600" />
                                <span className="font-medium text-sm">
                                  Contrato
                                </span>
                              </div>
                              <div className="text-sm">
                                <div className="font-medium">
                                  {selectedAppointment.contrato.numero}
                                </div>
                                <div className="text-muted-foreground">
                                  {selectedAppointment.contrato.nome}
                                </div>
                                {selectedAppointment.contrato.valor && (
                                  <div className="text-purple-600 font-medium">
                                    R${" "}
                                    {selectedAppointment.contrato.valor.toLocaleString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {selectedAppointment.tarefa && (
                            <div className="p-3 bg-white rounded-lg border">
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="h-4 w-4 text-orange-600" />
                                <span className="font-medium text-sm">
                                  Tarefa
                                </span>
                              </div>
                              <div className="text-sm">
                                <div className="font-medium">
                                  {selectedAppointment.tarefa.titulo}
                                </div>
                                <div className="text-muted-foreground">
                                  {selectedAppointment.tarefa.status}
                                </div>
                              </div>
                            </div>
                          )}

                          {selectedAppointment.atendimento && (
                            <div className="p-3 bg-white rounded-lg border">
                              <div className="flex items-center gap-2 mb-2">
                                <Headphones className="h-4 w-4 text-cyan-600" />
                                <span className="font-medium text-sm">
                                  Atendimento
                                </span>
                              </div>
                              <div className="text-sm">
                                <div className="font-medium">
                                  {selectedAppointment.atendimento.numero}
                                </div>
                                <div className="text-muted-foreground">
                                  {selectedAppointment.atendimento.canal}
                                </div>
                              </div>
                            </div>
                          )}

                          {selectedAppointment.financeiro && (
                            <div className="p-3 bg-white rounded-lg border">
                              <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="h-4 w-4 text-emerald-600" />
                                <span className="font-medium text-sm">
                                  Financeiro
                                </span>
                              </div>
                              <div className="text-sm">
                                <div className="font-medium">
                                  {selectedAppointment.financeiro.tipo}
                                </div>
                                {selectedAppointment.financeiro.valor && (
                                  <div className="text-emerald-600 font-medium">
                                    R${" "}
                                    {selectedAppointment.financeiro.valor.toLocaleString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {selectedAppointment.ia_contexto && (
                            <div className="p-3 bg-white rounded-lg border">
                              <div className="flex items-center gap-2 mb-2">
                                <Brain className="h-4 w-4 text-indigo-600" />
                                <span className="font-medium text-sm">
                                  IA Jurídico
                                </span>
                              </div>
                              <div className="text-sm">
                                <div className="font-medium">
                                  Sessão:{" "}
                                  {selectedAppointment.ia_contexto.sessao_id}
                                </div>
                                <div className="text-muted-foreground">
                                  {selectedAppointment.ia_contexto
                                    .documentos_analisados?.length || 0}{" "}
                                  documentos
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

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
                                    <div className="text-sm font-medium flex items-center gap-2">
                                      {participante.nome}
                                      {participante.obrigatorio && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          Obrigatório
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-xs text-muted-foreground capitalize">
                                      {participante.tipo.replace("_", " ")}
                                    </div>
                                    {participante.email && (
                                      <div className="text-xs text-muted-foreground">
                                        {participante.email}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {participante.email && (
                                    <Button variant="ghost" size="sm" asChild>
                                      <a href={`mailto:${participante.email}`}>
                                        <Mail className="h-4 w-4" />
                                      </a>
                                    </Button>
                                  )}
                                  {participante.telefone && (
                                    <Button variant="ghost" size="sm" asChild>
                                      <a href={`tel:${participante.telefone}`}>
                                        <Phone className="h-4 w-4" />
                                      </a>
                                    </Button>
                                  )}
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
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {/* Lembretes e Custos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Lembretes */}
                      {selectedAppointment.lembretes.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Bell className="h-4 w-4" />
                            Lembretes ({selectedAppointment.lembretes.length})
                          </h4>
                          <div className="space-y-2">
                            {selectedAppointment.lembretes.map(
                              (lembrete, index) => (
                                <div
                                  key={index}
                                  className={`flex items-center justify-between p-2 border rounded ${
                                    lembrete.ativo
                                      ? "bg-green-50 border-green-200"
                                      : "bg-gray-50"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <Bell
                                      className={`h-3 w-3 ${
                                        lembrete.ativo
                                          ? "text-green-600"
                                          : "text-gray-400"
                                      }`}
                                    />
                                    <div>
                                      <div className="text-sm font-medium capitalize">
                                        {lembrete.tipo}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {lembrete.antecedencia} minutos antes
                                      </div>
                                    </div>
                                  </div>
                                  <Badge
                                    variant={
                                      lembrete.ativo ? "default" : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {lembrete.ativo ? "Ativo" : "Inativo"}
                                  </Badge>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      {/* Custos */}
                      {selectedAppointment.custos && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Informações Financeiras
                          </h4>
                          <div className="space-y-2">
                            {selectedAppointment.custos.estimado && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Custo Estimado:
                                </span>
                                <span className="font-medium">
                                  R${" "}
                                  {selectedAppointment.custos.estimado.toLocaleString()}
                                </span>
                              </div>
                            )}
                            {selectedAppointment.custos.real && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Custo Real:
                                </span>
                                <span className="font-medium">
                                  R${" "}
                                  {selectedAppointment.custos.real.toLocaleString()}
                                </span>
                              </div>
                            )}
                            {selectedAppointment.custos.categoria && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Categoria:
                                </span>
                                <span className="font-medium">
                                  {selectedAppointment.custos.categoria}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Anexos */}
                    {selectedAppointment.anexos.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Anexos ({selectedAppointment.anexos.length})
                        </h4>
                        <div className="space-y-2">
                          {selectedAppointment.anexos.map((anexo) => (
                            <div
                              key={anexo.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-shadow"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <div className="font-medium">
                                    {anexo.nome}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {anexo.tipo}
                                    {anexo.tamanho && (
                                      <>
                                        {" "}
                                        •{" "}
                                        {(anexo.tamanho / 1024 / 1024).toFixed(
                                          1,
                                        )}{" "}
                                        MB
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <a href={anexo.url} download>
                                  <Download className="h-4 w-4 mr-2" />
                                  Baixar
                                </a>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags e Observações */}
                    <div className="space-y-4">
                      {selectedAppointment.tags &&
                        selectedAppointment.tags.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedAppointment.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
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

                    {/* Metadados do Sistema */}
                    <Card className="bg-gray-50">
                      <CardHeader>
                        <CardTitle className="text-sm">
                          Informações do Sistema
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">ID:</span>{" "}
                            {selectedAppointment.id}
                          </div>
                          <div>
                            <span className="font-medium">Criado por:</span>{" "}
                            {selectedAppointment.responsavel.nome}
                          </div>
                          <div>
                            <span className="font-medium">Criado em:</span>{" "}
                            {format(
                              parseISO(selectedAppointment.criado),
                              "dd/MM/yyyy HH:mm",
                              {
                                locale: ptBR,
                              },
                            )}
                          </div>
                          <div>
                            <span className="font-medium">
                              Última atualização:
                            </span>{" "}
                            {format(
                              parseISO(selectedAppointment.atualizado),
                              "dd/MM/yyyy HH:mm",
                              {
                                locale: ptBR,
                              },
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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

        {/* Dialog de Painel de Integrações */}
        <Dialog
          open={showIntegrationPanel}
          onOpenChange={setShowIntegrationPanel}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Painel de Integrações
              </DialogTitle>
              <DialogDescription>
                Gerencie as integrações da agenda com outros módulos do sistema
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Status das Integrações */}
              {integrationStats && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Status das Integrações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        {
                          name: "Clientes",
                          value: integrationStats.clientes_vinculados,
                          icon: Users,
                          color: "blue",
                        },
                        {
                          name: "Processos",
                          value: integrationStats.processos_relacionados,
                          icon: Gavel,
                          color: "green",
                        },
                        {
                          name: "Contratos",
                          value: integrationStats.contratos_ativos,
                          icon: FileText,
                          color: "purple",
                        },
                        {
                          name: "Tarefas",
                          value: integrationStats.tarefas_geradas,
                          icon: CheckCircle,
                          color: "orange",
                        },
                        {
                          name: "Atendimentos",
                          value: integrationStats.atendimentos_agendados,
                          icon: Headphones,
                          color: "cyan",
                        },
                        {
                          name: "Financeiro",
                          value: integrationStats.valores_financeiros,
                          icon: DollarSign,
                          color: "emerald",
                        },
                        {
                          name: "IA Jurídico",
                          value: integrationStats.sessoes_ia,
                          icon: Brain,
                          color: "indigo",
                        },
                      ].map((integration) => {
                        const IconComponent = integration.icon;
                        return (
                          <div
                            key={integration.name}
                            className="text-center p-4 border rounded-lg"
                          >
                            <div
                              className={`p-2 rounded-lg bg-${integration.color}-50 mx-auto w-fit mb-2`}
                            >
                              <IconComponent
                                className={`h-6 w-6 text-${integration.color}-600`}
                              />
                            </div>
                            <div className="text-2xl font-bold">
                              {integration.value}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {integration.name}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Configurações de Integração */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configurações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                      <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground mb-2">
                        Configurações de integração em desenvolvimento
                      </p>
                      <p className="text-sm text-gray-500">
                        Configurações avançadas de sincronização e automação
                        estarão disponíveis em breve
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowIntegrationPanel(false)}
              >
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
