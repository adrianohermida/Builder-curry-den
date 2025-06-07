import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Users,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileSignature,
  Copy,
  Send,
  Archive,
  Star,
  MoreHorizontal,
  Building,
  User,
  Zap,
  Target,
  TrendingUp,
  Activity,
  FileCheck,
  Coins,
  CreditCard,
  Mail,
  Phone,
  MapPin,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ViewSelector, ViewType } from "@/components/ui/view-selector";
import {
  KanbanView,
  KanbanItem,
  KanbanColumn,
} from "@/components/ui/kanban-view";
import { toast } from "sonner";

interface Contract {
  id: string;
  title: string;
  description: string;
  client: {
    id: string;
    name: string;
    type: "fisica" | "juridica";
    email: string;
    phone: string;
  };
  lawyer: {
    id: string;
    name: string;
    avatar?: string;
  };
  type:
    | "prestacao_servicos"
    | "retainer"
    | "success_fee"
    | "fixo"
    | "por_audiencia";
  status:
    | "rascunho"
    | "aguardando_assinatura"
    | "ativo"
    | "vencido"
    | "cancelado"
    | "finalizado";
  value: number;
  paymentType: "mensal" | "avulso" | "por_sucesso" | "parcelas";
  startDate: string;
  endDate?: string;
  signedDate?: string;
  signatures: {
    client: boolean;
    lawyer: boolean;
    witness?: boolean;
  };
  clauses: string[];
  attachments: string[];
  relatedProcesses: string[];
  billingConfig: {
    frequency: "mensal" | "trimestral" | "semestral" | "anual";
    dueDay: number;
    lateFee: number;
    interest: number;
    reminderDays: number[];
  };
  stripeConfig?: {
    enabled: boolean;
    priceId?: string;
    subscriptionId?: string;
  };
  createdAt: string;
  updatedAt: string;
  version: number;
  template?: string;
}

interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  category: "civil" | "trabalhista" | "tributario" | "empresarial" | "familia";
  fields: {
    name: string;
    type: "text" | "number" | "date" | "select" | "textarea";
    label: string;
    required: boolean;
    options?: string[];
  }[];
  content: string;
  defaultClauses: string[];
}

const contractTypes = {
  prestacao_servicos: "Prestação de Serviços",
  retainer: "Retainer",
  success_fee: "Taxa de Sucesso",
  fixo: "Valor Fixo",
  por_audiencia: "Por Audiência",
};

const statusColors = {
  rascunho: "bg-gray-100 text-gray-800 border-gray-200",
  aguardando_assinatura: "bg-yellow-100 text-yellow-800 border-yellow-200",
  ativo: "bg-green-100 text-green-800 border-green-200",
  vencido: "bg-red-100 text-red-800 border-red-200",
  cancelado: "bg-red-100 text-red-800 border-red-200",
  finalizado: "bg-blue-100 text-blue-800 border-blue-200",
};

export default function Contratos() {
  const [currentView, setCurrentView] = useState<ViewType>("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newContract, setNewContract] = useState<Partial<Contract>>({});

  // Mock data
  const contracts: Contract[] = useMemo(
    () => [
      {
        id: "1",
        title: "Contrato de Prestação de Serviços Jurídicos - João Silva",
        description: "Serviços advocatícios em direito civil",
        client: {
          id: "cli-001",
          name: "João Silva",
          type: "fisica",
          email: "joao@email.com",
          phone: "(11) 99999-9999",
        },
        lawyer: {
          id: "adv-001",
          name: "Dr. Maria Santos",
          avatar: "/avatars/maria.jpg",
        },
        type: "prestacao_servicos",
        status: "ativo",
        value: 5000,
        paymentType: "mensal",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        signedDate: "2024-01-01",
        signatures: {
          client: true,
          lawyer: true,
        },
        clauses: [
          "O CONTRATADO prestará serviços advocatícios na área civil",
          "O pagamento será realizado mensalmente até o dia 10",
          "O contrato terá vigência de 12 meses",
        ],
        attachments: ["contrato_assinado.pdf", "procuracao.pdf"],
        relatedProcesses: ["proc-001"],
        billingConfig: {
          frequency: "mensal",
          dueDay: 10,
          lateFee: 2,
          interest: 1,
          reminderDays: [7, 3, 1],
        },
        stripeConfig: {
          enabled: true,
          priceId: "price_1234",
          subscriptionId: "sub_1234",
        },
        createdAt: "2024-01-01",
        updatedAt: "2024-01-15",
        version: 1,
      },
      {
        id: "2",
        title: "Retainer - XYZ Tecnologia",
        description: "Consultoria jurídica empresarial mensal",
        client: {
          id: "cli-002",
          name: "XYZ Tecnologia Ltda",
          type: "juridica",
          email: "contato@xyz.com",
          phone: "(11) 3333-4444",
        },
        lawyer: {
          id: "adv-002",
          name: "Dr. Carlos Oliveira",
          avatar: "/avatars/carlos.jpg",
        },
        type: "retainer",
        status: "ativo",
        value: 8000,
        paymentType: "mensal",
        startDate: "2024-01-15",
        signedDate: "2024-01-15",
        signatures: {
          client: true,
          lawyer: true,
        },
        clauses: [
          "Consultoria jurídica empresarial mensal",
          "Análise de contratos até 5 por mês",
          "Atendimento prioritário",
        ],
        attachments: ["retainer_assinado.pdf"],
        relatedProcesses: [],
        billingConfig: {
          frequency: "mensal",
          dueDay: 15,
          lateFee: 2,
          interest: 1,
          reminderDays: [7, 3, 1],
        },
        stripeConfig: {
          enabled: true,
          priceId: "price_5678",
          subscriptionId: "sub_5678",
        },
        createdAt: "2024-01-15",
        updatedAt: "2024-01-15",
        version: 1,
      },
      {
        id: "3",
        title: "Taxa de Sucesso - Maria Oliveira",
        description: "Ação trabalhista com taxa de sucesso",
        client: {
          id: "cli-003",
          name: "Maria Oliveira",
          type: "fisica",
          email: "maria@email.com",
          phone: "(11) 88888-7777",
        },
        lawyer: {
          id: "adv-001",
          name: "Dr. Maria Santos",
          avatar: "/avatars/maria.jpg",
        },
        type: "success_fee",
        status: "aguardando_assinatura",
        value: 0, // Will be calculated based on success percentage
        paymentType: "por_sucesso",
        startDate: "2024-02-01",
        signatures: {
          client: false,
          lawyer: true,
        },
        clauses: [
          "Taxa de sucesso de 30% sobre o valor recuperado",
          "Sem cobrança de honorários mensais",
          "Pagamento apenas em caso de êxito",
        ],
        attachments: ["contrato_rascunho.pdf"],
        relatedProcesses: ["proc-003"],
        billingConfig: {
          frequency: "avulso",
          dueDay: 30,
          lateFee: 0,
          interest: 0,
          reminderDays: [],
        },
        stripeConfig: {
          enabled: false,
        },
        createdAt: "2024-01-20",
        updatedAt: "2024-01-22",
        version: 2,
      },
    ],
    [],
  );

  const templates: ContractTemplate[] = useMemo(
    () => [
      {
        id: "tpl-001",
        name: "Prestação de Serviços Jurídicos",
        description: "Template padrão para contratos de prestação de serviços",
        category: "civil",
        fields: [
          {
            name: "client_name",
            type: "text",
            label: "Nome do Cliente",
            required: true,
          },
          {
            name: "service_description",
            type: "textarea",
            label: "Descrição dos Serviços",
            required: true,
          },
          {
            name: "monthly_value",
            type: "number",
            label: "Valor Mensal",
            required: true,
          },
          {
            name: "start_date",
            type: "date",
            label: "Data de Início",
            required: true,
          },
          {
            name: "duration",
            type: "select",
            label: "Duração",
            required: true,
            options: ["6 meses", "12 meses", "24 meses", "Indeterminado"],
          },
        ],
        content: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS

CONTRATANTE: {client_name}
CONTRATADO: [Nome do Escritório]

OBJETO: {service_description}
VALOR: R$ {monthly_value} mensais
INÍCIO: {start_date}
DURAÇÃO: {duration}

...`,
        defaultClauses: [
          "O CONTRATADO prestará serviços advocatícios conforme descrição",
          "O pagamento será realizado mensalmente",
          "O contrato poderá ser rescindido por qualquer das partes",
        ],
      },
    ],
    [],
  );

  // Filtered data
  const filteredContracts = useMemo(() => {
    let filtered = contracts;

    if (searchTerm) {
      filtered = filtered.filter(
        (contract) =>
          contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contract.client.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          contract.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (contract) => contract.status === filterStatus,
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((contract) => contract.type === filterType);
    }

    return filtered;
  }, [contracts, searchTerm, filterStatus, filterType]);

  // Convert to Kanban data
  const kanbanData = useMemo(() => {
    const groupedData: Record<string, KanbanItem[]> = {};

    filteredContracts.forEach((contract) => {
      const groupKey = contract.status;

      if (!groupedData[groupKey]) {
        groupedData[groupKey] = [];
      }

      groupedData[groupKey].push({
        id: contract.id,
        title: contract.title,
        description: contract.description,
        status: contract.status,
        priority: contract.status === "vencido" ? "urgent" : "medium",
        assignee: contract.lawyer,
        client: {
          id: contract.client.id,
          name: contract.client.name,
          type: contract.client.type,
        },
        dueDate: contract.endDate,
        value: contract.value,
        tags: [contractTypes[contract.type]],
        attachments: contract.attachments.length,
        type: "contract",
        metadata: {
          signed: contract.signatures.client && contract.signatures.lawyer,
          stripeEnabled: contract.stripeConfig?.enabled || false,
        },
      });
    });

    const columns: KanbanColumn[] = Object.entries(groupedData).map(
      ([key, items]) => ({
        id: key,
        title: key.charAt(0).toUpperCase() + key.slice(1).replace("_", " "),
        items,
        color: statusColors[key as keyof typeof statusColors],
      }),
    );

    return columns;
  }, [filteredContracts]);

  // Stats
  const stats = useMemo(() => {
    const total = contracts.length;
    const active = contracts.filter((c) => c.status === "ativo").length;
    const pending = contracts.filter(
      (c) => c.status === "aguardando_assinatura",
    ).length;
    const revenue = contracts
      .filter((c) => c.status === "ativo")
      .reduce((sum, c) => sum + c.value, 0);
    const stripeEnabled = contracts.filter(
      (c) => c.stripeConfig?.enabled,
    ).length;

    return { total, active, pending, revenue, stripeEnabled };
  }, [contracts]);

  const handleCreateContract = useCallback(() => {
    setIsCreateDialogOpen(true);
  }, []);

  const handleViewContract = useCallback((contract: Contract) => {
    toast.info(`Visualizando contrato: ${contract.title}`);
  }, []);

  const handleSignContract = useCallback((contractId: string) => {
    toast.success("Solicitação de assinatura enviada!");
  }, []);

  const handleItemMove = useCallback(
    (itemId: string, fromColumn: string, toColumn: string) => {
      toast.success(`Contrato movido para ${toColumn}`);
    },
    [],
  );

  const renderListView = () => (
    <Card className="border-0 shadow-sm">
      <CardHeader className="border-b bg-card">
        <div className="flex items-center justify-between">
          <CardTitle>Contratos ({filteredContracts.length})</CardTitle>
          {selectedContracts.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {selectedContracts.length} selecionados
              </Badge>
              <Button variant="outline" size="sm">
                Ações em Lote
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-muted/50">
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={
                    selectedContracts.length === filteredContracts.length
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedContracts(filteredContracts.map((c) => c.id));
                    } else {
                      setSelectedContracts([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>Contrato</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Assinaturas</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContracts.map((contract) => (
              <TableRow key={contract.id} className="hover:bg-muted/50">
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedContracts.includes(contract.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedContracts((prev) => [...prev, contract.id]);
                      } else {
                        setSelectedContracts((prev) =>
                          prev.filter((id) => id !== contract.id),
                        );
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-sm line-clamp-1">
                      {contract.title}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {contract.description}
                    </div>
                    <div className="flex items-center gap-1">
                      {contract.stripeConfig?.enabled && (
                        <Badge variant="outline" className="text-xs">
                          <CreditCard className="h-3 w-3 mr-1" />
                          Stripe
                        </Badge>
                      )}
                      {contract.attachments.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          {contract.attachments.length}
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {contract.client.type === "juridica" ? (
                      <Building className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <User className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <div className="font-medium text-sm">
                        {contract.client.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {contract.client.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {contractTypes[contract.type]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[contract.status]}>
                    {contract.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {contract.paymentType === "por_sucesso"
                      ? "Taxa de Sucesso"
                      : contract.value.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {contract.paymentType}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {contract.signatures.client ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-600" />
                      )}
                      <span className="text-xs">Cliente</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {contract.signatures.lawyer ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-600" />
                      )}
                      <span className="text-xs">Advogado</span>
                    </div>
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
                        onClick={() => handleViewContract(contract)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {!contract.signatures.client && (
                        <DropdownMenuItem
                          onClick={() => handleSignContract(contract.id)}
                        >
                          <FileSignature className="h-4 w-4 mr-2" />
                          Solicitar Assinatura
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Cópia
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderKanbanView = () => (
    <KanbanView
      columns={kanbanData}
      onItemMove={handleItemMove}
      onItemClick={(item) => {
        const contract = contracts.find((c) => c.id === item.id);
        if (contract) handleViewContract(contract);
      }}
      showMetrics={true}
      compactMode={false}
    />
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">Gestão de Contratos</h1>
          <p className="text-muted-foreground">
            Contratos, assinaturas digitais e gestão financeira integrada
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button onClick={handleCreateContract}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Contrato
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Contratos Ativos
            </CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              de {stats.total} total
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aguardando Assinatura
            </CardTitle>
            <FileSignature className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">
              pendentes de assinatura
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Mensal
            </CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.revenue.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                maximumFractionDigits: 0,
              })}
            </div>
            <p className="text-xs text-muted-foreground">contratos ativos</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Stripe Integrado
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.stripeEnabled}</div>
            <p className="text-xs text-muted-foreground">
              pagamento automático
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="border-0 shadow-sm">
        <CardContent className="py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <ViewSelector
              currentView={currentView}
              onViewChange={setCurrentView}
              module="crm"
              userPlan="pro"
              className="flex-shrink-0"
            />

            <Separator orientation="vertical" className="hidden lg:block h-8" />

            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar contratos, clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="aguardando_assinatura">
                    Aguardando
                  </SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="prestacao_servicos">
                    Prestação de Serviços
                  </SelectItem>
                  <SelectItem value="retainer">Retainer</SelectItem>
                  <SelectItem value="success_fee">Taxa de Sucesso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
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
            <Card className="border-0 shadow-sm">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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

      {/* Create Contract Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Contrato</DialogTitle>
            <DialogDescription>
              Crie um novo contrato a partir de um template ou do zero
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="template">Template</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Cliente</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cli-001">João Silva</SelectItem>
                    <SelectItem value="cli-002">XYZ Tecnologia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Título do Contrato</Label>
              <Input
                id="title"
                placeholder="Ex: Contrato de Prestação de Serviços..."
                value={newContract.title || ""}
                onChange={(e) =>
                  setNewContract((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva o objeto do contrato..."
                value={newContract.description || ""}
                onChange={(e) =>
                  setNewContract((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                toast.success("Contrato criado com sucesso!");
                setIsCreateDialogOpen(false);
              }}
            >
              Criar Contrato
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
