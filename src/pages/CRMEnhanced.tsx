import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Scale,
  FileText,
  Building,
  User,
  CheckSquare,
  Brain,
  Star,
  MoreHorizontal,
  Target,
  TrendingUp,
  Activity,
  Clock,
  DollarSign,
  AlertTriangle,
  Zap,
  Download,
  RefreshCw,
  Settings2,
  Crown,
  Upload,
  MessageSquare,
  FolderOpen,
  Tag,
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ViewSelector,
  ViewType,
  useViewShortcuts,
} from "@/components/ui/view-selector";
import {
  KanbanView,
  KanbanItem,
  KanbanColumn,
} from "@/components/ui/kanban-view";
import {
  useTheme,
  themeClasses,
  useThemeClasses,
} from "@/components/ui/theme-system";
import { useTarefaIntegration } from "@/hooks/useTarefaIntegration";
import { TarefaCreateModal } from "@/components/Tarefas/TarefaCreateModal";
import { toast } from "sonner";

interface Client {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  company: string;
  type: "fisica" | "juridica";
  status: "ativo" | "inativo" | "prospecto" | "inadimplente";
  area: "civil" | "trabalhista" | "tributario" | "penal" | "administrativo";
  assignee: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastContact: string;
  cases: number;
  revenue: number;
  nextAction?: string;
  priority: "low" | "medium" | "high" | "urgent";
  tags: string[];
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
    complement?: string;
  };
  documents: number;
  tasks: number;
  completedTasks: number;
  score: number; // Customer score 0-100
  source: "indicacao" | "marketing" | "website" | "evento" | "outros";
  createdAt: string;
  updatedAt: string;
}

interface Process {
  id: string;
  number: string;
  client: string;
  clientId: string;
  subject: string;
  area: "civil" | "trabalhista" | "tributario" | "penal" | "administrativo";
  status:
    | "em_andamento"
    | "aguardando"
    | "finalizado"
    | "suspenso"
    | "arquivado";
  stage: "inicial" | "instrucao" | "julgamento" | "recurso" | "execucao";
  lawyer: string;
  lawyerId: string;
  startDate: string;
  nextHearing?: string;
  value: number;
  priority: "low" | "medium" | "high" | "urgent";
  progress: number;
  tags: string[];
  documents: number;
  tasks: number;
  risk: "low" | "medium" | "high";
  lastUpdate: string;
}

const statusColors = {
  ativo: "bg-green-100 text-green-800 border-green-200",
  inativo: "bg-gray-100 text-gray-800 border-gray-200",
  prospecto: "bg-blue-100 text-blue-800 border-blue-200",
  inadimplente: "bg-red-100 text-red-800 border-red-200",
  em_andamento: "bg-blue-100 text-blue-800 border-blue-200",
  aguardando: "bg-yellow-100 text-yellow-800 border-yellow-200",
  finalizado: "bg-green-100 text-green-800 border-green-200",
  suspenso: "bg-orange-100 text-orange-800 border-orange-200",
  arquivado: "bg-gray-100 text-gray-800 border-gray-200",
};

const priorityColors = {
  low: "text-blue-600",
  medium: "text-yellow-600",
  high: "text-orange-600",
  urgent: "text-red-600",
};

const areaColors = {
  civil: "bg-blue-50 text-blue-700 border-blue-200",
  trabalhista: "bg-green-50 text-green-700 border-green-200",
  tributario: "bg-purple-50 text-purple-700 border-purple-200",
  penal: "bg-red-50 text-red-700 border-red-200",
  administrativo: "bg-orange-50 text-orange-700 border-orange-200",
};

export default function CRMEnhanced() {
  const [currentView, setCurrentView] = useState<ViewType>("list");
  const [activeTab, setActiveTab] = useState("clientes");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterArea, setFilterArea] = useState("all");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [kanbanGroupBy, setKanbanGroupBy] = useState<
    "status" | "area" | "assignee"
  >("status");

  const { isDark, colors } = useTheme();
  const { getThemeClass } = useThemeClasses();
  const { criarTarefaDeCRM, isModalOpen, modalParams, setModalOpen } =
    useTarefaIntegration();

  // Enable keyboard shortcuts
  useViewShortcuts(setCurrentView, "crm");

  // Mock data
  const clients: Client[] = useMemo(
    () => [
      {
        id: "1",
        name: "João Silva",
        document: "123.456.789-00",
        email: "joao@email.com",
        phone: "(11) 99999-9999",
        company: "Silva & Associados",
        type: "fisica",
        status: "ativo",
        area: "civil",
        assignee: {
          id: "adv1",
          name: "Dr. Maria Santos",
          avatar: "/avatars/maria.jpg",
        },
        lastContact: "2024-01-15",
        cases: 3,
        revenue: 15000,
        priority: "medium",
        tags: ["vip", "recorrente"],
        documents: 12,
        tasks: 5,
        completedTasks: 3,
        score: 85,
        source: "indicacao",
        createdAt: "2023-06-15",
        updatedAt: "2024-01-15",
      },
      {
        id: "2",
        name: "XYZ Tecnologia Ltda",
        document: "12.345.678/0001-99",
        email: "contato@xyz.com.br",
        phone: "(11) 3333-4444",
        company: "XYZ Tecnologia",
        type: "juridica",
        status: "ativo",
        area: "tributario",
        assignee: {
          id: "adv2",
          name: "Dr. Carlos Oliveira",
          avatar: "/avatars/carlos.jpg",
        },
        lastContact: "2024-01-10",
        cases: 8,
        revenue: 45000,
        priority: "high",
        tags: ["corporativo", "tech"],
        documents: 28,
        tasks: 12,
        completedTasks: 8,
        score: 92,
        source: "website",
        createdAt: "2022-03-20",
        updatedAt: "2024-01-10",
      },
      {
        id: "3",
        name: "Maria Oliveira",
        document: "987.654.321-00",
        email: "maria@email.com",
        phone: "(11) 88888-7777",
        company: "Consultoria MO",
        type: "fisica",
        status: "prospecto",
        area: "trabalhista",
        assignee: {
          id: "adv1",
          name: "Dr. Maria Santos",
          avatar: "/avatars/maria.jpg",
        },
        lastContact: "2024-01-12",
        cases: 0,
        revenue: 0,
        priority: "urgent",
        tags: ["novo", "urgente"],
        documents: 3,
        tasks: 2,
        completedTasks: 0,
        score: 65,
        source: "evento",
        createdAt: "2024-01-05",
        updatedAt: "2024-01-12",
      },
    ],
    [],
  );

  const processes: Process[] = useMemo(
    () => [
      {
        id: "1",
        number: "1234567-89.2024.8.26.0001",
        client: "João Silva",
        clientId: "1",
        subject: "Ação de Cobrança",
        area: "civil",
        status: "em_andamento",
        stage: "instrucao",
        lawyer: "Dr. Maria Santos",
        lawyerId: "adv1",
        startDate: "2024-01-10",
        nextHearing: "2024-02-15",
        value: 25000,
        priority: "medium",
        progress: 45,
        tags: ["cobranca", "civil"],
        documents: 8,
        tasks: 3,
        risk: "low",
        lastUpdate: "2024-01-15",
      },
      {
        id: "2",
        number: "9876543-21.2024.5.02.0001",
        client: "XYZ Tecnologia Ltda",
        clientId: "2",
        subject: "Recurso Trabalhista",
        area: "trabalhista",
        status: "aguardando",
        stage: "recurso",
        lawyer: "Dr. Carlos Oliveira",
        lawyerId: "adv2",
        startDate: "2023-11-20",
        nextHearing: "2024-02-20",
        value: 80000,
        priority: "high",
        progress: 75,
        tags: ["recurso", "trabalhista"],
        documents: 15,
        tasks: 5,
        risk: "medium",
        lastUpdate: "2024-01-14",
      },
    ],
    [],
  );

  // Filtered data
  const filteredClients = useMemo(() => {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.document.includes(searchTerm) ||
          client.company.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((client) => client.status === filterStatus);
    }

    if (filterArea !== "all") {
      filtered = filtered.filter((client) => client.area === filterArea);
    }

    if (filterAssignee !== "all") {
      filtered = filtered.filter(
        (client) => client.assignee.id === filterAssignee,
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[sortBy as keyof Client];
      let bVal: any = b[sortBy as keyof Client];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [
    clients,
    searchTerm,
    filterStatus,
    filterArea,
    filterAssignee,
    sortBy,
    sortOrder,
  ]);

  const filteredProcesses = useMemo(() => {
    let filtered = processes;

    if (searchTerm) {
      filtered = filtered.filter(
        (process) =>
          process.number.includes(searchTerm) ||
          process.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
          process.subject.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return filtered;
  }, [processes, searchTerm]);

  // Convert clients to Kanban items
  const clientKanbanData = useMemo(() => {
    const groupedData: Record<string, KanbanItem[]> = {};

    filteredClients.forEach((client) => {
      let groupKey = "";

      switch (kanbanGroupBy) {
        case "status":
          groupKey = client.status;
          break;
        case "area":
          groupKey = client.area;
          break;
        case "assignee":
          groupKey = client.assignee.name;
          break;
      }

      if (!groupedData[groupKey]) {
        groupedData[groupKey] = [];
      }

      const progress =
        client.tasks > 0 ? (client.completedTasks / client.tasks) * 100 : 0;

      groupedData[groupKey].push({
        id: client.id,
        title: client.name,
        description: client.company,
        status: client.status,
        priority: client.priority,
        assignee: client.assignee,
        client: {
          id: client.id,
          name: client.name,
          type: client.type,
        },
        dueDate: client.nextAction ? "2024-01-20" : undefined,
        value: client.revenue,
        progress,
        tags: client.tags,
        attachments: client.documents,
        comments: 0,
        type: "client",
        metadata: {
          score: client.score,
          source: client.source,
          area: client.area,
        },
      });
    });

    const columns: KanbanColumn[] = Object.entries(groupedData).map(
      ([key, items]) => ({
        id: key,
        title: key.charAt(0).toUpperCase() + key.slice(1).replace("_", " "),
        items,
        color: statusColors[key as keyof typeof statusColors] || "bg-gray-100",
      }),
    );

    return columns;
  }, [filteredClients, kanbanGroupBy]);

  // Stats calculations
  const stats = useMemo(() => {
    const totalClients = clients.length;
    const activeClients = clients.filter((c) => c.status === "ativo").length;
    const totalProcesses = processes.length;
    const activeProcesses = processes.filter(
      (p) => p.status === "em_andamento",
    ).length;
    const totalRevenue = clients.reduce(
      (sum, client) => sum + client.revenue,
      0,
    );
    const avgScore =
      clients.reduce((sum, client) => sum + client.score, 0) / clients.length;

    return {
      totalClients,
      activeClients,
      totalProcesses,
      activeProcesses,
      totalRevenue,
      avgScore,
    };
  }, [clients, processes]);

  // Event handlers
  const handleViewChange = useCallback((view: ViewType) => {
    setCurrentView(view);
  }, []);

  const handleItemMove = useCallback(
    (
      itemId: string,
      fromColumn: string,
      toColumn: string,
      newIndex: number,
    ) => {
      toast.success(`Item movido para ${toColumn}`);
      // Update item status in your data store
    },
    [],
  );

  const handleClientClick = useCallback((client: Client) => {
    toast.info(`Visualizando detalhes de ${client.name}`);
    // Open client details modal
  }, []);

  const handleCreateTask = useCallback(
    (clientId: string, clientName: string) => {
      criarTarefaDeCRM(clientId, undefined, `Atendimento para ${clientName}`);
    },
    [criarTarefaDeCRM],
  );

  const handleBulkAction = useCallback(
    (action: string) => {
      if (selectedItems.length === 0) {
        toast.error("Selecione itens para continuar");
        return;
      }

      toast.success(`Ação ${action} aplicada a ${selectedItems.length} itens`);
      setSelectedItems([]);
    },
    [selectedItems],
  );

  const renderListView = () => (
    <Card className="border-0 shadow-sm">
      <CardHeader className="border-b bg-card">
        <div className="flex items-center justify-between">
          <CardTitle>
            {activeTab === "clientes" ? "Clientes" : "Processos"}(
            {activeTab === "clientes"
              ? filteredClients.length
              : filteredProcesses.length}
            )
          </CardTitle>

          {selectedItems.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {selectedItems.length} selecionados
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Ações em Lote
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleBulkAction("export")}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("assign")}>
                    <Users className="h-4 w-4 mr-2" />
                    Atribuir
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("tag")}>
                    <Tag className="h-4 w-4 mr-2" />
                    Adicionar Tags
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {activeTab === "clientes" ? (
          <Table>
            <TableHeader>
              <TableRow className="border-b bg-muted/50">
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredClients.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(filteredClients.map((c) => c.id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden md:table-cell">Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Área</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Responsável
                </TableHead>
                <TableHead className="hidden md:table-cell">Casos</TableHead>
                <TableHead>Receita</TableHead>
                <TableHead className="hidden xl:table-cell">Score</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow
                  key={client.id}
                  className="hover:bg-muted/50 border-b"
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(client.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems((prev) => [...prev, client.id]);
                        } else {
                          setSelectedItems((prev) =>
                            prev.filter((id) => id !== client.id),
                          );
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${client.name}`}
                        />
                        <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {client.name}
                          {client.type === "juridica" && (
                            <Building className="h-3 w-3" />
                          )}
                          {client.priority === "urgent" && (
                            <Zap className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {client.company}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs">
                        <Mail className="h-3 w-3" />
                        <span className="truncate max-w-[150px]">
                          {client.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Phone className="h-3 w-3" />
                        {client.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[client.status]}>
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge
                      variant="outline"
                      className={areaColors[client.area]}
                    >
                      {client.area}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={client.assignee.avatar} />
                              <AvatarFallback className="text-xs">
                                {client.assignee.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {client.assignee.name.split(" ")[0]}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{client.assignee.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{client.cases}</span>
                      {client.tasks > 0 && (
                        <div className="flex items-center gap-1">
                          <Progress
                            value={(client.completedTasks / client.tasks) * 100}
                            className="w-12 h-2"
                          />
                          <span className="text-xs text-muted-foreground">
                            {client.completedTasks}/{client.tasks}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {client.revenue.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                          style={{ width: `${client.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {client.score}
                      </span>
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
                        <DropdownMenuItem
                          onClick={() => handleClientClick(client)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            handleCreateTask(client.id, client.name)
                          }
                        >
                          <CheckSquare className="h-4 w-4 mr-2" />
                          Criar Tarefa
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Abrir Ticket
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FolderOpen className="h-4 w-4 mr-2" />
                          Documentos GED
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Brain className="h-4 w-4 mr-2" />
                          Análise IA
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Visualização de Processos
            </h3>
            <p className="text-muted-foreground">
              Em desenvolvimento - funcionalidade completa em breve
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderKanbanView = () => (
    <div className="space-y-4">
      {/* Kanban Controls */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Agrupar por:</span>
                <Select
                  value={kanbanGroupBy}
                  onValueChange={(value: any) => setKanbanGroupBy(value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="area">Área</SelectItem>
                    <SelectItem value="assignee">Responsável</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Badge variant="outline">{filteredClients.length} clientes</Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings2 className="h-4 w-4 mr-2" />
                Configurar Colunas
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <KanbanView
        columns={clientKanbanData}
        onItemMove={handleItemMove}
        onItemClick={(item) => {
          const client = clients.find((c) => c.id === item.id);
          if (client) handleClientClick(client);
        }}
        onItemEdit={(item) => {
          toast.info(`Editando ${item.title}`);
        }}
        onItemDelete={(item) => {
          toast.info(`Excluindo ${item.title}`);
        }}
        onAddItem={(columnId) => {
          toast.info(`Adicionando item em ${columnId}`);
        }}
        showMetrics={true}
        compactMode={false}
      />
    </div>
  );

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold">CRM Jurídico</h1>
            <p className="text-muted-foreground">
              Gestão inteligente de clientes, processos e relacionamentos
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Clientes Ativos
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeClients}</div>
                <p className="text-xs text-muted-foreground">
                  de {stats.totalClients} total
                </p>
                <div className="mt-2">
                  <Progress
                    value={(stats.activeClients / stats.totalClients) * 100}
                    className="h-1"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processos</CardTitle>
                <Scale className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.activeProcesses}
                </div>
                <p className="text-xs text-muted-foreground">em andamento</p>
                <div className="flex items-center gap-1 mt-2 text-xs">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">+12% este mês</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Receita Total
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalRevenue.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    maximumFractionDigits: 0,
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  valor em carteira
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">+8% este mês</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Score Médio
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(stats.avgScore)}
                </div>
                <p className="text-xs text-muted-foreground">
                  satisfação dos clientes
                </p>
                <div className="mt-2">
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                      style={{ width: `${stats.avgScore}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* View Selector */}
              <ViewSelector
                currentView={currentView}
                onViewChange={handleViewChange}
                module="crm"
                userPlan="pro"
                className="flex-shrink-0"
              />

              <Separator
                orientation="vertical"
                className="hidden lg:block h-8"
              />

              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar clientes, emails, documentos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="prospecto">Prospecto</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterArea} onValueChange={setFilterArea}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="civil">Civil</SelectItem>
                    <SelectItem value="trabalhista">Trabalhista</SelectItem>
                    <SelectItem value="tributario">Tributário</SelectItem>
                    <SelectItem value="penal">Penal</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
            <TabsTrigger value="processos">Processos</TabsTrigger>
            <TabsTrigger value="contratos">Contratos</TabsTrigger>
          </TabsList>

          <TabsContent value="clientes" className="space-y-4">
            <AnimatePresence mode="wait">
              {currentView === "list" ? (
                <motion.div
                  key="list-view"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {renderListView()}
                </motion.div>
              ) : currentView === "kanban" ? (
                <motion.div
                  key="kanban-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {renderKanbanView()}
                </motion.div>
              ) : (
                <motion.div
                  key="other-view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Crown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        Visualização {currentView}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Esta visualização estará disponível em breve
                      </p>
                      <Button onClick={() => setCurrentView("list")}>
                        Voltar para Lista
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="processos">{renderListView()}</TabsContent>

          <TabsContent value="contratos">
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Módulo de Contratos
                </h3>
                <p className="text-muted-foreground mb-4">
                  Funcionalidade em desenvolvimento
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Contrato
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Task Creation Modal */}
        <TarefaCreateModal
          open={isModalOpen}
          onOpenChange={setModalOpen}
          initialParams={modalParams || undefined}
          onSuccess={() => {
            toast.success("Tarefa criada com sucesso!");
          }}
        />
      </div>
    </TooltipProvider>
  );
}
