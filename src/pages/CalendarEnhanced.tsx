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
  isSameDay,
  isSameMonth,
  parseISO,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";

interface Appointment {
  id: string;
  titulo: string;
  descricao?: string;
  dataInicio: string;
  dataFim: string;
  diaInteiro: boolean;
  tipo: "audiencia" | "reuniao" | "compromisso" | "prazo" | "lembrete";
  status: "confirmado" | "tentativo" | "cancelado" | "concluido";
  prioridade: "baixa" | "media" | "alta" | "urgente";
  local?: {
    nome: string;
    endereco?: string;
    sala?: string;
    tipo: "presencial" | "virtual" | "telefone";
    link?: string;
  };
  participantes: Array<{
    id: string;
    nome: string;
    email?: string;
    tipo: "advogado" | "cliente" | "terceiro" | "testemunha" | "juiz";
    confirmado: boolean;
  }>;
  cliente?: {
    id: string;
    nome: string;
  };
  processo?: {
    id: string;
    numero: string;
    assunto: string;
  };
  contrato?: {
    id: string;
    numero: string;
    titulo: string;
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

interface CalendarView {
  type: "month" | "week" | "day" | "agenda";
  date: Date;
}

export default function CalendarEnhanced() {
  const [view, setView] = useState<CalendarView>({
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterResponsavel, setFilterResponsavel] = useState("all");
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>(
    {},
  );

  const { user, hasPermission } = usePermissions();
  const { logAction } = useAuditSystem();
  const { criarTarefaDeAgenda } = useTarefaIntegration();

  // Mock data
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
          cliente: {
            id: "cli-001",
            nome: "João Silva",
          },
          processo: {
            id: "proc-001",
            numero: "1001234-12.2024.5.02.0001",
            assunto: "Ação Trabalhista - Horas Extras",
          },
          responsavel: {
            id: "user-001",
            nome: "Dr. Pedro Costa",
          },
          lembretes: [
            {
              tipo: "email",
              antecedencia: 1440, // 24 horas
              ativo: true,
            },
            {
              tipo: "whatsapp",
              antecedencia: 60, // 1 hora
              ativo: true,
            },
          ],
          anexos: [],
          criado: "2024-01-15T10:00:00Z",
          atualizado: "2024-01-15T10:00:00Z",
        },
        {
          id: "apt-002",
          titulo: "Reunião com Cliente - Maria Santos",
          descricao: "Reunião para discussão de estratégia jurídica",
          dataInicio: "2024-01-18T10:00:00Z",
          dataFim: "2024-01-18T11:30:00Z",
          diaInteiro: false,
          tipo: "reuniao",
          status: "confirmado",
          prioridade: "media",
          local: {
            nome: "Escritório - Sala de Reuniões",
            tipo: "presencial",
          },
          participantes: [
            {
              id: "part-003",
              nome: "Maria Santos",
              email: "maria.santos@email.com",
              tipo: "cliente",
              confirmado: true,
            },
            {
              id: "part-004",
              nome: "Dra. Ana Costa",
              email: "ana.costa@lawdesk.com",
              tipo: "advogado",
              confirmado: true,
            },
          ],
          cliente: {
            id: "cli-002",
            nome: "Maria Santos",
          },
          responsavel: {
            id: "user-002",
            nome: "Dra. Ana Costa",
          },
          lembretes: [
            {
              tipo: "email",
              antecedencia: 60,
              ativo: true,
            },
          ],
          anexos: [],
          criado: "2024-01-16T09:00:00Z",
          atualizado: "2024-01-16T09:00:00Z",
        },
        {
          id: "apt-003",
          titulo: "Prazo - Recurso Ordinário",
          descricao: "Prazo para interposição de recurso ordinário",
          dataInicio: "2024-01-25T23:59:00Z",
          dataFim: "2024-01-25T23:59:00Z",
          diaInteiro: true,
          tipo: "prazo",
          status: "confirmado",
          prioridade: "urgente",
          processo: {
            id: "proc-002",
            numero: "2002345-34.2024.5.02.0001",
            assunto: "Recurso Ordinário - Adicional de Insalubridade",
          },
          responsavel: {
            id: "user-001",
            nome: "Dr. Pedro Costa",
          },
          lembretes: [
            {
              tipo: "email",
              antecedencia: 2880, // 48 horas
              ativo: true,
            },
            {
              tipo: "push",
              antecedencia: 1440, // 24 horas
              ativo: true,
            },
            {
              tipo: "email",
              antecedencia: 480, // 8 horas
              ativo: true,
            },
          ],
          anexos: [],
          criado: "2024-01-10T14:00:00Z",
          atualizado: "2024-01-10T14:00:00Z",
        },
      ];

      setAppointments(mockAppointments);
      setFilteredAppointments(mockAppointments);
      setIsLoading(false);
    };

    loadAppointments();
  }, []);

  // Filter appointments
  useEffect(() => {
    let filtered = appointments;

    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.processo?.numero.toLowerCase().includes(searchTerm.toLowerCase()),
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

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, filterType, filterStatus, filterResponsavel]);

  // Navigation functions
  const navigateView = (direction: "prev" | "next") => {
    const { type, date } = view;
    let newDate: Date;

    switch (type) {
      case "month":
        newDate =
          direction === "next" ? addMonths(date, 1) : subMonths(date, 1);
        break;
      case "week":
        newDate = direction === "next" ? addWeeks(date, 1) : subWeeks(date, 1);
        break;
      case "day":
        newDate = direction === "next" ? addDays(date, 1) : addDays(date, -1);
        break;
      default:
        newDate = date;
    }

    setView({ ...view, date: newDate });
  };

  // Get appointments for current view
  const getAppointmentsForView = () => {
    const { type, date } = view;
    let startDate: Date;
    let endDate: Date;

    switch (type) {
      case "month":
        startDate = startOfMonth(date);
        endDate = endOfMonth(date);
        break;
      case "week":
        startDate = startOfWeek(date, { locale: ptBR });
        endDate = endOfWeek(date, { locale: ptBR });
        break;
      case "day":
        startDate = date;
        endDate = date;
        break;
      default:
        return filteredAppointments;
    }

    return filteredAppointments.filter((apt) => {
      const aptDate = parseISO(apt.dataInicio);
      return aptDate >= startDate && aptDate <= endDate;
    });
  };

  // Appointment type configuration
  const typeConfig = {
    audiencia: {
      label: "Audiência",
      icon: Gavel,
      color: "bg-red-500 text-white",
      variant: "destructive" as const,
    },
    reuniao: {
      label: "Reunião",
      icon: Users,
      color: "bg-blue-500 text-white",
      variant: "default" as const,
    },
    compromisso: {
      label: "Compromisso",
      icon: CalendarIcon,
      color: "bg-green-500 text-white",
      variant: "default" as const,
    },
    prazo: {
      label: "Prazo",
      icon: Timer,
      color: "bg-orange-500 text-white",
      variant: "default" as const,
    },
    lembrete: {
      label: "Lembrete",
      icon: Bell,
      color: "bg-purple-500 text-white",
      variant: "secondary" as const,
    },
  };

  const priorityConfig = {
    baixa: {
      label: "Baixa",
      color: "text-green-600",
      variant: "secondary" as const,
    },
    media: {
      label: "Média",
      color: "text-yellow-600",
      variant: "default" as const,
    },
    alta: {
      label: "Alta",
      color: "text-orange-600",
      variant: "default" as const,
    },
    urgente: {
      label: "Urgente",
      color: "text-red-600",
      variant: "destructive" as const,
    },
  };

  // Handle appointment selection
  const handleAppointmentSelect = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    logAction(AUDIT_ACTIONS.READ, AUDIT_MODULES.CALENDAR, {
      appointmentId: appointment.id,
      appointmentTitle: appointment.titulo,
    });
  };

  // Handle create task from appointment
  const handleCreateTask = async (appointment: Appointment) => {
    await criarTarefaDeAgenda(
      appointment.id,
      `Preparar para: ${appointment.titulo}`,
    );
    toast.success("Tarefa criada com sucesso");
  };

  if (!hasPermission("agenda", "read")) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Acesso Negado</h3>
          <p className="text-muted-foreground">
            Você não tem permissão para acessar a agenda jurídica.
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
              <CalendarIcon className="h-8 w-8 text-primary" />
              Agenda Jurídica
            </h1>
            <p className="text-muted-foreground">
              Gestão completa de compromissos, audiências e prazos processuais
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sincronizar
            </Button>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Evento
            </Button>
          </div>
        </div>

        {/* View Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* View Navigation */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateView("prev")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="text-lg font-semibold min-w-48 text-center">
                  {view.type === "month" &&
                    format(view.date, "MMMM yyyy", { locale: ptBR })}
                  {view.type === "week" &&
                    `${format(startOfWeek(view.date, { locale: ptBR }), "dd MMM", { locale: ptBR })} - ${format(endOfWeek(view.date, { locale: ptBR }), "dd MMM yyyy", { locale: ptBR })}`}
                  {view.type === "day" &&
                    format(view.date, "dd MMMM yyyy", { locale: ptBR })}
                  {view.type === "agenda" && "Agenda Geral"}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateView("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* View Type Selector */}
              <Tabs
                value={view.type}
                onValueChange={(value) =>
                  setView({ ...view, type: value as any })
                }
              >
                <TabsList>
                  <TabsTrigger value="month">Mês</TabsTrigger>
                  <TabsTrigger value="week">Semana</TabsTrigger>
                  <TabsTrigger value="day">Dia</TabsTrigger>
                  <TabsTrigger value="agenda">Agenda</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Today Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setView({ ...view, date: new Date() })}
              >
                Hoje
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <Input
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="audiencia">Audiência</SelectItem>
                  <SelectItem value="reuniao">Reunião</SelectItem>
                  <SelectItem value="compromisso">Compromisso</SelectItem>
                  <SelectItem value="prazo">Prazo</SelectItem>
                  <SelectItem value="lembrete">Lembrete</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="tentativo">Tentativo</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Mini Calendar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm">Navegação</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                locale={ptBR}
              />

              {/* Upcoming Events */}
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Próximos Eventos</h3>
                <div className="space-y-2">
                  {filteredAppointments
                    .filter((apt) => parseISO(apt.dataInicio) > new Date())
                    .slice(0, 3)
                    .map((apt) => (
                      <div
                        key={apt.id}
                        className="p-2 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => handleAppointmentSelect(apt)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {typeConfig[apt.tipo] &&
                            (() => {
                              const Icon = typeConfig[apt.tipo].icon;
                              return (
                                <div
                                  className={`p-1 rounded ${typeConfig[apt.tipo].color}`}
                                >
                                  <Icon className="h-3 w-3" />
                                </div>
                              );
                            })()}
                          <span className="text-xs font-medium truncate">
                            {apt.titulo}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(parseISO(apt.dataInicio), "dd/MM HH:mm", {
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Calendar View */}
          <Card className="lg:col-span-3">
            <CardContent className="p-0">
              {view.type === "agenda" ? (
                /* Agenda List View */
                <div className="p-6">
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      {getAppointmentsForView().length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <h3 className="text-lg font-medium mb-2">
                            Nenhum evento encontrado
                          </h3>
                          <p>Não há eventos para os filtros selecionados</p>
                        </div>
                      ) : (
                        getAppointmentsForView().map((appointment) => {
                          const TypeIcon =
                            typeConfig[appointment.tipo]?.icon || CalendarIcon;

                          return (
                            <motion.div
                              key={appointment.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                              onClick={() =>
                                handleAppointmentSelect(appointment)
                              }
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`p-2 rounded-lg ${typeConfig[appointment.tipo]?.color || "bg-gray-500 text-white"}`}
                                  >
                                    <TypeIcon className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <h3 className="font-medium">
                                      {appointment.titulo}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {format(
                                          parseISO(appointment.dataInicio),
                                          "dd/MM HH:mm",
                                          { locale: ptBR },
                                        )}
                                        {!appointment.diaInteiro && (
                                          <>
                                            {" - "}
                                            {format(
                                              parseISO(appointment.dataFim),
                                              "HH:mm",
                                              { locale: ptBR },
                                            )}
                                          </>
                                        )}
                                      </div>
                                      {appointment.local && (
                                        <div className="flex items-center gap-1">
                                          <MapPin className="h-3 w-3" />
                                          {appointment.local.nome}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={
                                      priorityConfig[appointment.prioridade]
                                        .variant
                                    }
                                  >
                                    {
                                      priorityConfig[appointment.prioridade]
                                        .label
                                    }
                                  </Badge>

                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleCreateTask(appointment)
                                        }
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Criar Tarefa
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Duplicar
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Compartilhar
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Editar
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="text-red-600">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Excluir
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>

                              {appointment.descricao && (
                                <p className="text-sm text-muted-foreground mb-3">
                                  {appointment.descricao}
                                </p>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  {appointment.cliente && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <User className="h-3 w-3" />
                                      {appointment.cliente.nome}
                                    </div>
                                  )}

                                  {appointment.processo && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <FileText className="h-3 w-3" />
                                      {appointment.processo.numero}
                                    </div>
                                  )}

                                  <div className="flex items-center gap-1">
                                    <Avatar className="h-5 w-5">
                                      <AvatarFallback className="text-xs">
                                        {appointment.responsavel.nome
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs text-muted-foreground">
                                      {appointment.responsavel.nome}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {appointment.lembretes.some(
                                    (l) => l.ativo,
                                  ) && (
                                    <Bell className="h-3 w-3 text-blue-500" />
                                  )}

                                  {appointment.anexos.length > 0 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {appointment.anexos.length} anexos
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                /* Calendar Grid Views */
                <div className="p-6">
                  <div className="text-center py-20 text-muted-foreground">
                    <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">
                      Visualização {view.type}
                    </h3>
                    <p>Vista de {view.type} em desenvolvimento...</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Create Appointment Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Evento na Agenda</DialogTitle>
              <DialogDescription>
                Crie um novo compromisso, audiência ou lembrete
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo de Evento</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="audiencia">Audiência</SelectItem>
                      <SelectItem value="reuniao">Reunião</SelectItem>
                      <SelectItem value="compromisso">Compromisso</SelectItem>
                      <SelectItem value="prazo">Prazo</SelectItem>
                      <SelectItem value="lembrete">Lembrete</SelectItem>
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
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Título do Evento</Label>
                <Input placeholder="Digite o título do evento" />
              </div>

              <div>
                <Label>Descrição</Label>
                <Textarea placeholder="Descreva detalhes do evento" rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data de Início</Label>
                  <Input type="datetime-local" />
                </div>

                <div>
                  <Label>Data de Fim</Label>
                  <Input type="datetime-local" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch />
                <Label>Evento de dia inteiro</Label>
              </div>

              <div>
                <Label>Local</Label>
                <Input placeholder="Local do evento" />
              </div>

              <div>
                <Label>Cliente (opcional)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cli-001">João Silva</SelectItem>
                    <SelectItem value="cli-002">Maria Santos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancelar
              </Button>
              <Button onClick={() => setShowCreateDialog(false)}>
                Criar Evento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
