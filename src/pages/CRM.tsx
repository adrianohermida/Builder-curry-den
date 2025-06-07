import { useState, useMemo, memo } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Scale,
  FileText,
  ArrowLeft,
  Building,
  User,
  CheckSquare,
  Activity,
  TrendingUp,
  Clock,
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
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
import { ClientForm } from "@/components/CRM/ClientForm";
import { ClientProcesses } from "@/components/CRM/ClientProcesses";
import { ClientPublications } from "@/components/CRM/ClientPublications";
import { useTarefaIntegration } from "@/hooks/useTarefaIntegration";
import { TarefaCreateModal } from "@/components/Tarefas/TarefaCreateModal";
import { motion } from "framer-motion";
import { toast } from "sonner";

type ViewMode = "list" | "form" | "processes" | "publications";

interface SelectedClient {
  id: number;
  name: string;
  document: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  lastContact: string;
  cases: number;
  revenue: string;
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
    complement?: string;
  };
}

// Memoized client card component
const ClientCard = memo(
  ({
    client,
    onViewProcesses,
    onViewPublications,
    onCreateTask,
  }: {
    client: SelectedClient;
    onViewProcesses: (client: SelectedClient) => void;
    onViewPublications: (client: SelectedClient) => void;
    onCreateTask: (clientId: string, clientName: string) => void;
  }) => (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="hover:bg-accent/50 transition-colors"
    >
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://avatar.vercel.sh/${client.name}`} />
            <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{client.name}</p>
            <p className="text-xs text-muted-foreground">{client.company}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <p className="text-xs font-mono">{client.document}</p>
          <div className="flex items-center space-x-1">
            <Mail className="h-3 w-3" />
            <span className="text-xs">{client.email}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Phone className="h-3 w-3" />
            <span className="text-xs">{client.phone}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={client.status === "ativo" ? "default" : "secondary"}>
          {client.status}
        </Badge>
      </TableCell>
      <TableCell className="text-center">{client.cases}</TableCell>
      <TableCell className="font-medium">{client.revenue}</TableCell>
      <TableCell className="text-xs">
        {new Date(client.lastContact).toLocaleDateString("pt-BR")}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              Ver Detalhes
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onCreateTask(client.id.toString(), client.name)}
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Criar Tarefa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewProcesses(client)}>
              <Scale className="h-4 w-4 mr-2" />
              Ver Processos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewPublications(client)}>
              <FileText className="h-4 w-4 mr-2" />
              Publicações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </motion.tr>
  ),
);

// Memoized process card
const ProcessCard = memo(
  ({
    process,
    onCreateTask,
  }: {
    process: any;
    onCreateTask: (processoId: string, processoNumber: string) => void;
  }) => (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="hover:bg-accent/50 transition-colors"
    >
      <TableCell>
        <div>
          <p className="font-medium text-sm font-mono">{process.number}</p>
          <p className="text-xs text-muted-foreground">{process.type}</p>
        </div>
      </TableCell>
      <TableCell>{process.client}</TableCell>
      <TableCell>
        <Badge
          variant={process.status === "em_andamento" ? "default" : "secondary"}
        >
          {process.status === "em_andamento" ? "Em Andamento" : "Aguardando"}
        </Badge>
      </TableCell>
      <TableCell className="text-sm">{process.lawyer}</TableCell>
      <TableCell className="text-sm">{process.value}</TableCell>
      <TableCell className="text-xs">
        {new Date(process.nextHearing).toLocaleDateString("pt-BR")}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              Ver Detalhes
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onCreateTask(process.id, process.number)}
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Criar Tarefa
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Calendar className="h-4 w-4 mr-2" />
              Agendar Audiência
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="h-4 w-4 mr-2" />
              Documentos
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </motion.tr>
  ),
);

export default function CRM() {
  const [activeTab, setActiveTab] = useState("clientes");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedClient, setSelectedClient] = useState<SelectedClient | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Task integration
  const { criarTarefaDeCRM, isModalOpen, modalParams, setModalOpen } =
    useTarefaIntegration();

  // Memoized data
  const clients = useMemo<SelectedClient[]>(
    () => [
      {
        id: 1,
        name: "João Silva",
        document: "123.456.789-00",
        email: "joao.silva@email.com",
        phone: "(11) 99999-9999",
        company: "Silva & Associados",
        status: "ativo",
        lastContact: "2024-12-15",
        cases: 3,
        revenue: "R$ 15.000",
        address: {
          street: "Av. Paulista",
          number: "1000",
          neighborhood: "Bela Vista",
          city: "São Paulo",
          state: "SP",
          cep: "01310-100",
          complement: "Conjunto 101",
        },
      },
      {
        id: 2,
        name: "Maria Santos",
        document: "987.654.321-00",
        email: "maria@empresa.com",
        phone: "(11) 88888-8888",
        company: "Empresa XYZ Ltda",
        status: "ativo",
        lastContact: "2024-12-10",
        cases: 1,
        revenue: "R$ 8.500",
        address: {
          street: "Rua Augusta",
          number: "2500",
          neighborhood: "Consolação",
          city: "São Paulo",
          state: "SP",
          cep: "01412-100",
          complement: "Sala 800",
        },
      },
      {
        id: 3,
        name: "Carlos Oliveira",
        document: "456.789.123-00",
        email: "carlos@oliveira.com.br",
        phone: "(11) 77777-7777",
        company: "Oliveira Consultoria",
        status: "ativo",
        lastContact: "2024-12-12",
        cases: 5,
        revenue: "R$ 25.000",
        address: {
          street: "Av. Faria Lima",
          number: "3000",
          neighborhood: "Itaim Bibi",
          city: "São Paulo",
          state: "SP",
          cep: "04538-132",
          complement: "10º andar",
        },
      },
    ],
    [],
  );

  const processes = useMemo(
    () => [
      {
        id: 1,
        number: "1234567-89.2024.8.26.0001",
        client: "João Silva",
        type: "Direito Civil",
        status: "em_andamento",
        lawyer: "Dr. Pedro Costa",
        startDate: "2024-10-15",
        nextHearing: "2024-12-20",
        value: "R$ 50.000",
      },
      {
        id: 2,
        number: "9876543-21.2024.8.26.0001",
        client: "Maria Santos",
        type: "Direito Trabalhista",
        status: "aguardando",
        lawyer: "Dra. Ana Lima",
        startDate: "2024-11-01",
        nextHearing: "2024-12-22",
        value: "R$ 25.000",
      },
      {
        id: 3,
        number: "5555555-55.2024.8.26.0001",
        client: "Carlos Oliveira",
        type: "Direito Tributário",
        status: "em_andamento",
        lawyer: "Dr. Roberto Silva",
        startDate: "2024-09-20",
        nextHearing: "2024-12-25",
        value: "R$ 75.000",
      },
    ],
    [],
  );

  // Filtered data based on search
  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.document.includes(searchTerm),
    );
  }, [clients, searchTerm]);

  const filteredProcesses = useMemo(() => {
    if (!searchTerm) return processes;
    return processes.filter(
      (process) =>
        process.number.includes(searchTerm) ||
        process.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        process.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        process.lawyer.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [processes, searchTerm]);

  // Stats calculations
  const stats = useMemo(
    () => ({
      totalClients: clients.length,
      activeClients: clients.filter((c) => c.status === "ativo").length,
      totalProcesses: processes.length,
      activeProcesses: processes.filter((p) => p.status === "em_andamento")
        .length,
      totalRevenue: clients.reduce((sum, client) => {
        const value = parseFloat(
          client.revenue.replace("R$ ", "").replace(".", "").replace(",", "."),
        );
        return sum + value;
      }, 0),
    }),
    [clients, processes],
  );

  // Form submission handler
  const handleClientSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Client data:", formData);
      setViewMode("list");
      toast.success("Cliente salvo com sucesso!");
    } catch (error) {
      console.error("Error saving client:", error);
      toast.error("Erro ao salvar cliente");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation handlers
  const handleViewProcesses = (client: SelectedClient) => {
    setSelectedClient(client);
    setViewMode("processes");
  };

  const handleViewPublications = (client: SelectedClient) => {
    setSelectedClient(client);
    setViewMode("publications");
  };

  const handleBackToList = () => {
    setSelectedClient(null);
    setViewMode("list");
  };

  // Task creation handlers
  const handleCreateClientTask = (clientId: string, clientName: string) => {
    criarTarefaDeCRM(clientId, undefined, `Atendimento para ${clientName}`);
  };

  const handleCreateProcessTask = (
    processoId: string,
    processoNumber: string,
  ) => {
    const processo = processes.find((p) => p.id.toString() === processoId);
    const cliente = clients.find((c) => c.name === processo?.client);
    criarTarefaDeCRM(
      cliente?.id.toString() || "",
      processoId,
      `Acompanhar processo ${processoNumber}`,
    );
  };

  // Render different views based on current mode
  if (viewMode === "form") {
    return (
      <>
        <ClientForm
          onSubmit={handleClientSubmit}
          onCancel={handleBackToList}
          isLoading={isSubmitting}
        />
        <TarefaCreateModal
          open={isModalOpen}
          onOpenChange={setModalOpen}
          initialParams={modalParams || undefined}
        />
      </>
    );
  }

  if (viewMode === "processes" && selectedClient) {
    return (
      <>
        <ClientProcesses
          clientCpf={selectedClient.document}
          clientName={selectedClient.name}
          onBack={handleBackToList}
        />
        <TarefaCreateModal
          open={isModalOpen}
          onOpenChange={setModalOpen}
          initialParams={modalParams || undefined}
        />
      </>
    );
  }

  if (viewMode === "publications" && selectedClient) {
    return (
      <>
        <ClientPublications
          clientCpf={selectedClient.document}
          clientName={selectedClient.name}
          onBack={handleBackToList}
        />
        <TarefaCreateModal
          open={isModalOpen}
          onOpenChange={setModalOpen}
          initialParams={modalParams || undefined}
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">CRM Jurídico</h1>
          <p className="text-muted-foreground">
            Gestão de clientes, contratos e processos
          </p>
        </div>
        <Button onClick={() => setViewMode("form")} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Button>
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
              <div className="text-2xl font-bold">{stats.activeProcesses}</div>
              <p className="text-xs text-muted-foreground">em andamento</p>
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
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R${" "}
                {stats.totalRevenue.toLocaleString("pt-BR", {
                  maximumFractionDigits: 0,
                })}
              </div>
              <p className="text-xs text-muted-foreground">valor em carteira</p>
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
              <CardTitle className="text-sm font-medium">Atividade</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  (stats.activeProcesses / stats.totalProcesses) * 100,
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">taxa de atividade</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="processos">Processos</TabsTrigger>
          <TabsTrigger value="contratos">Contratos</TabsTrigger>
        </TabsList>

        <TabsContent value="clientes" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar clientes por nome, email, empresa..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Clients Table */}
          <Card>
            <CardHeader>
              <CardTitle>Clientes ({filteredClients.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Casos</TableHead>
                    <TableHead>Receita</TableHead>
                    <TableHead>Último Contato</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client, index) => (
                    <ClientCard
                      key={client.id}
                      client={client}
                      onViewProcesses={handleViewProcesses}
                      onViewPublications={handleViewPublications}
                      onCreateTask={handleCreateClientTask}
                    />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processos" className="space-y-6">
          {/* Search */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar processos por número, cliente, advogado..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Processes Table */}
          <Card>
            <CardHeader>
              <CardTitle>Processos ({filteredProcesses.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número do Processo</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Advogado</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Próxima Audiência</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProcesses.map((process) => (
                    <ProcessCard
                      key={process.id}
                      process={process}
                      onCreateTask={handleCreateProcessTask}
                    />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contratos" className="space-y-6">
          <Card>
            <CardContent className="py-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Módulo de Contratos</h3>
              <p className="text-muted-foreground mb-4">
                Funcionalidade em desenvolvimento
              </p>
              <Button variant="outline">
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
  );
}
