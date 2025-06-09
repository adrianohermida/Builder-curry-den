import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Scale,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Upload,
  Download,
  FileSpreadsheet,
  CheckSquare,
  Calendar,
  User,
  Building,
  AlertTriangle,
  Clock,
  DollarSign,
  Tag,
  Settings,
  Grid3X3,
  List,
  Users,
  FileText,
  Bell,
  TrendingUp,
  Activity,
  Zap,
  Shield,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Phone,
  Mail,
  Star,
  Share2,
  Bookmark,
  Target,
  Copy,
  FolderOpen,
  CalendarPlus,
  Archive,
  CheckCircle,
  XCircle,
  PlayCircle,
  PauseCircle,
  AlertCircle,
  Info,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCRM, Processo } from "@/hooks/useCRM";
import { useProcessoApi } from "@/services/ProcessoApiService";
import { toast } from "sonner";
import ProcessoForm from "./ProcessoForm";
import ProcessoDetalhes from "./ProcessoDetalhes";
import ProcessosMobile from "./ProcessosMobile";
import { ClienteDetalhes } from "@/components/CRM/ClienteDetalhes";

// Declaração global para o timeout da busca
declare global {
  interface Window {
    searchTimeout: NodeJS.Timeout;
  }
}

// Interface expandida para Cliente com relacionamentos
interface ClienteCompleto {
  id: string;
  nome: string;
  documento: string;
  tipo: "PF" | "PJ";
  email: string;
  telefone: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
  };
  status: "novo" | "ativo" | "inativo" | "prospecto";
  dataCadastro: Date;
  ultimoContato?: Date;
  valorTotal: number;
  observacoes?: string;
  tags: string[];
  responsavel: string;
  origem: string;
  relacionamentos: {
    processos: number;
    contratos: number;
    atendimentos: number;
    valor_total_processos: number;
    ultimo_processo?: Date;
  };
}

// Detecta se é mobile
const isMobile = () => window.innerWidth < 768;

export default function ProcessosModule() {
  const navigate = useNavigate();
  const {
    processos,
    buscarProcessos,
    obterProcesso,
    criarProcesso,
    atualizarProcesso,
    excluirProcesso,
    filtros,
    atualizarFiltros,
    loading,
  } = useCRM();

  const { obterAndamentosProcesso } = useProcessoApi();

  // Estados do componente
  const [busca, setBusca] = useState("");
  const [filtroArea, setFiltroArea] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroRisco, setFiltroRisco] = useState("todos");
  const [filtroResponsavel, setFiltroResponsavel] = useState("todos");
  const [ordenacao, setOrdenacao] = useState("numero");
  const [ordemCrescente, setOrdemCrescente] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");
  const [selectedProcessos, setSelectedProcessos] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProcesso, setEditingProcesso] = useState<Processo | null>(null);
  const [showProcessoDetails, setShowProcessoDetails] = useState<string | null>(
    null,
  );
  const [showClienteDetails, setShowClienteDetails] =
    useState<ClienteCompleto | null>(null);
  const [detailsMode, setDetailsMode] = useState<"summary" | "full">("summary");
  const [showGEDDialog, setShowGEDDialog] = useState<string | null>(null);

  // Estados para estatísticas
  const [estatisticas, setEstatisticas] = useState({
    total: 0,
    ativos: 0,
    arquivados: 0,
    vencidos: 0,
    valorTotal: 0,
    taxaSucesso: 0,
  });

  // Mock de dados de clientes completos
  const clientesCompletos: ClienteCompleto[] = [
    {
      id: "cli-001",
      nome: "João Silva",
      documento: "123.456.789-00",
      tipo: "PF",
      email: "joao.silva@email.com",
      telefone: "(11) 99999-9999",
      endereco: {
        cep: "01310-100",
        logradouro: "Avenida Paulista",
        numero: "1000",
        bairro: "Bela Vista",
        cidade: "São Paulo",
        uf: "SP",
      },
      status: "ativo",
      dataCadastro: new Date("2023-01-15"),
      ultimoContato: new Date("2024-01-20"),
      valorTotal: 85000,
      observacoes: "Cliente corporativo importante",
      tags: ["vip", "corporativo"],
      responsavel: "Dr. Pedro Costa",
      origem: "indicacao",
      relacionamentos: {
        processos: 3,
        contratos: 2,
        atendimentos: 8,
        valor_total_processos: 150000,
        ultimo_processo: new Date("2024-01-10"),
      },
    },
    {
      id: "cli-002",
      nome: "Maria Santos Oliveira",
      documento: "987.654.321-00",
      tipo: "PF",
      email: "maria.santos@email.com",
      telefone: "(11) 88888-8888",
      endereco: {
        cep: "04038-001",
        logradouro: "Rua Vergueiro",
        numero: "500",
        bairro: "Vila Mariana",
        cidade: "São Paulo",
        uf: "SP",
      },
      status: "ativo",
      dataCadastro: new Date("2023-06-10"),
      ultimoContato: new Date("2024-01-18"),
      valorTotal: 45000,
      observacoes: "Cliente trabalhista",
      tags: ["trabalhista", "urgente"],
      responsavel: "Dra. Ana Lima",
      origem: "website",
      relacionamentos: {
        processos: 2,
        contratos: 1,
        atendimentos: 5,
        valor_total_processos: 80000,
        ultimo_processo: new Date("2023-12-15"),
      },
    },
    {
      id: "cli-003",
      nome: "Empresa ABC Ltda",
      documento: "12.345.678/0001-90",
      tipo: "PJ",
      email: "contato@empresaabc.com",
      telefone: "(11) 3333-3333",
      endereco: {
        cep: "01014-001",
        logradouro: "Rua Direita",
        numero: "123",
        bairro: "Centro",
        cidade: "São Paulo",
        uf: "SP",
      },
      status: "ativo",
      dataCadastro: new Date("2022-09-20"),
      ultimoContato: new Date("2024-01-22"),
      valorTotal: 250000,
      observacoes: "Empresa de grande porte - múltiplas áreas",
      tags: ["empresarial", "grande_porte", "multiple_areas"],
      responsavel: "Dr. Carlos Mendes",
      origem: "comercial",
      relacionamentos: {
        processos: 5,
        contratos: 8,
        atendimentos: 25,
        valor_total_processos: 500000,
        ultimo_processo: new Date("2024-01-05"),
      },
    },
  ];

  // Efeito para busca com debounce
  useEffect(() => {
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }

    window.searchTimeout = setTimeout(() => {
      atualizarFiltros({ busca });
    }, 300);

    return () => {
      if (window.searchTimeout) {
        clearTimeout(window.searchTimeout);
      }
    };
  }, [busca, atualizarFiltros]);

  // Efeito para calcular estatísticas
  useEffect(() => {
    const stats = {
      total: processos.length,
      ativos: processos.filter((p) => p.status === "ativo").length,
      arquivados: processos.filter((p) => p.status === "arquivado").length,
      vencidos: processos.filter((p) => {
        // Lógica para determinar processos vencidos
        return false; // Placeholder
      }).length,
      valorTotal: processos.reduce((sum, p) => sum + (p.valor || 0), 0),
      taxaSucesso: 87.5, // Placeholder - viria de cálculo real
    };
    setEstatisticas(stats);
  }, [processos]);

  // Função para copiar número do processo
  const copyProcessNumber = (numero: string) => {
    navigator.clipboard.writeText(numero);
    toast.success(`Número do processo ${numero} copiado!`);
  };

  // Função para obter cliente por ID
  const getClienteById = (clienteId: string): ClienteCompleto | undefined => {
    return clientesCompletos.find((c) => c.id === clienteId);
  };

  // Função para abrir detalhes do cliente
  const openClienteDetails = (processo: Processo) => {
    const cliente = getClienteById(processo.clienteId);
    if (cliente) {
      setShowClienteDetails(cliente);
    } else {
      toast.error("Dados do cliente não encontrados");
    }
  };

  // Função para agendar audiência
  const agendarAudiencia = (processo: Processo) => {
    // Navegar para a agenda com dados do processo
    navigate(
      `/agenda?processo=${processo.id}&tipo=audiencia&cliente=${processo.clienteId}`,
    );
  };

  // Função para abrir GED do processo
  const openProcessoGED = (processo: Processo) => {
    // Navegar para o GED filtrado pelo processo
    navigate(`/ged?processo=${processo.id}&cliente=${processo.clienteId}`);
  };

  // Função para ver detalhes do processo
  const viewProcessoDetails = (
    processoId: string,
    mode: "summary" | "full" = "summary",
  ) => {
    if (mode === "full") {
      navigate(`/crm/processos/${processoId}`);
    } else {
      setShowProcessoDetails(processoId);
      setDetailsMode(mode);
    }
  };

  // Filtrar processos baseado nos filtros atuais
  const processosFiltrados = processos.filter((processo) => {
    if (filtroArea !== "todos" && processo.area !== filtroArea) return false;
    if (filtroStatus !== "todos" && processo.status !== filtroStatus)
      return false;
    if (filtroRisco !== "todos" && processo.risco !== filtroRisco) return false;
    if (
      filtroResponsavel !== "todos" &&
      processo.responsavel !== filtroResponsavel
    )
      return false;
    return true;
  });

  // Ordenar processos
  const processosOrdenados = [...processosFiltrados].sort((a, b) => {
    let aValue: any = a[ordenacao as keyof Processo];
    let bValue: any = b[ordenacao as keyof Processo];

    if (ordenacao === "valor") {
      aValue = a.valor || 0;
      bValue = b.valor || 0;
    }

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return ordemCrescente ? -1 : 1;
    if (aValue > bValue) return ordemCrescente ? 1 : -1;
    return 0;
  });

  // Paginação
  const totalPaginas = Math.ceil(processosOrdenados.length / itensPorPagina);
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const processosNaPagina = processosOrdenados.slice(
    indiceInicial,
    indiceFinal,
  );

  // Configuração de colunas visíveis
  const [colunasVisiveis, setColunasVisiveis] = useState({
    numero: true,
    cliente: true,
    area: true,
    status: true,
    valor: true,
    responsavel: true,
    dataInicio: true,
    proximaAudiencia: true,
    risco: true,
  });

  // Configuração de status com cores
  const statusConfig = {
    ativo: {
      label: "Ativo",
      icon: PlayCircle,
      color: "bg-green-100 text-green-800",
    },
    arquivado: {
      label: "Arquivado",
      icon: Archive,
      color: "bg-gray-100 text-gray-800",
    },
    suspenso: {
      label: "Suspenso",
      icon: PauseCircle,
      color: "bg-yellow-100 text-yellow-800",
    },
    encerrado: {
      label: "Encerrado",
      icon: CheckCircle,
      color: "bg-blue-100 text-blue-800",
    },
  };

  const riscoConfig = {
    baixo: { label: "Baixo", color: "bg-green-100 text-green-800" },
    medio: { label: "Médio", color: "bg-yellow-100 text-yellow-800" },
    alto: { label: "Alto", color: "bg-red-100 text-red-800" },
  };

  // Se é mobile, usar componente mobile
  if (isMobile()) {
    return <ProcessosMobile />;
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Scale className="h-8 w-8 text-primary" />
              Processos Jurídicos
            </h2>
            <p className="text-muted-foreground">
              Gerencie processos judiciais e acompanhe andamentos processuais
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Processo
            </Button>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            {
              title: "Total",
              value: estatisticas.total,
              icon: Scale,
              color: "blue",
            },
            {
              title: "Ativos",
              value: estatisticas.ativos,
              icon: PlayCircle,
              color: "green",
            },
            {
              title: "Arquivados",
              value: estatisticas.arquivados,
              icon: Archive,
              color: "gray",
            },
            {
              title: "Taxa Sucesso",
              value: `${estatisticas.taxaSucesso}%`,
              icon: TrendingUp,
              color: "emerald",
            },
            {
              title: "Valor Total",
              value: `R$ ${(estatisticas.valorTotal / 1000).toFixed(0)}k`,
              icon: DollarSign,
              color: "purple",
            },
            {
              title: "Audiências",
              value: "12",
              icon: Calendar,
              color: "orange",
            },
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                        <IconComponent
                          className={`h-5 w-5 text-${stat.color}-600`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Filtros e Controles */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Busca */}
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar processos..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filtros */}
                <Select value={filtroArea} onValueChange={setFiltroArea}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas as áreas</SelectItem>
                    <SelectItem value="Trabalhista">Trabalhista</SelectItem>
                    <SelectItem value="Civil">Civil</SelectItem>
                    <SelectItem value="Criminal">Criminal</SelectItem>
                    <SelectItem value="Empresarial">Empresarial</SelectItem>
                    <SelectItem value="Tributário">Tributário</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filtroRisco} onValueChange={setFiltroRisco}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Risco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {Object.entries(riscoConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Controles de visualização */}
              <div className="flex items-center gap-2">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-r-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "cards" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("cards")}
                    className="rounded-l-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Menu de colunas visíveis */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Colunas
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Colunas Visíveis</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.entries(colunasVisiveis).map(([key, visible]) => (
                      <DropdownMenuCheckboxItem
                        key={key}
                        checked={visible}
                        onCheckedChange={(checked) =>
                          setColunasVisiveis((prev) => ({
                            ...prev,
                            [key]: checked,
                          }))
                        }
                      >
                        {key === "numero" && "Número"}
                        {key === "cliente" && "Cliente"}
                        {key === "area" && "Área"}
                        {key === "status" && "Status"}
                        {key === "valor" && "Valor"}
                        {key === "responsavel" && "Responsável"}
                        {key === "dataInicio" && "Data Início"}
                        {key === "proximaAudiencia" && "Próxima Audiência"}
                        {key === "risco" && "Risco"}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Exportação */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Excel (.xlsx)
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="h-4 w-4 mr-2" />
                      PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      CSV
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Processos */}
        <Card>
          <CardContent className="p-0">
            {viewMode === "list" ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedProcessos.length ===
                            processosNaPagina.length
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedProcessos(
                                processosNaPagina.map((p) => p.id),
                              );
                            } else {
                              setSelectedProcessos([]);
                            }
                          }}
                        />
                      </TableHead>
                      {colunasVisiveis.numero && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => {
                            if (ordenacao === "numero") {
                              setOrdemCrescente(!ordemCrescente);
                            } else {
                              setOrdenacao("numero");
                              setOrdemCrescente(true);
                            }
                          }}
                        >
                          <div className="flex items-center gap-1">
                            Número do Processo
                            {ordenacao === "numero" && (
                              <span>{ordemCrescente ? "↑" : "↓"}</span>
                            )}
                          </div>
                        </TableHead>
                      )}
                      {colunasVisiveis.cliente && (
                        <TableHead>Cliente</TableHead>
                      )}
                      {colunasVisiveis.area && <TableHead>Área</TableHead>}
                      {colunasVisiveis.status && <TableHead>Status</TableHead>}
                      {colunasVisiveis.valor && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => {
                            if (ordenacao === "valor") {
                              setOrdemCrescente(!ordemCrescente);
                            } else {
                              setOrdenacao("valor");
                              setOrdemCrescente(true);
                            }
                          }}
                        >
                          <div className="flex items-center gap-1">
                            Valor
                            {ordenacao === "valor" && (
                              <span>{ordemCrescente ? "↑" : "↓"}</span>
                            )}
                          </div>
                        </TableHead>
                      )}
                      {colunasVisiveis.responsavel && (
                        <TableHead>Responsável</TableHead>
                      )}
                      {colunasVisiveis.dataInicio && (
                        <TableHead>Data Início</TableHead>
                      )}
                      {colunasVisiveis.proximaAudiencia && (
                        <TableHead>Próxima Audiência</TableHead>
                      )}
                      {colunasVisiveis.risco && <TableHead>Risco</TableHead>}
                      <TableHead className="w-12">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processosNaPagina.map((processo) => {
                      const cliente = getClienteById(processo.clienteId);
                      const StatusIcon = statusConfig[processo.status]?.icon;

                      return (
                        <TableRow
                          key={processo.id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedProcessos.includes(processo.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedProcessos([
                                    ...selectedProcessos,
                                    processo.id,
                                  ]);
                                } else {
                                  setSelectedProcessos(
                                    selectedProcessos.filter(
                                      (id) => id !== processo.id,
                                    ),
                                  );
                                }
                              }}
                            />
                          </TableCell>
                          {colunasVisiveis.numero && (
                            <TableCell>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() =>
                                      copyProcessNumber(processo.numero)
                                    }
                                    className="font-mono text-sm hover:bg-gray-100 px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1"
                                  >
                                    {processo.numero}
                                    <Copy className="h-3 w-3 opacity-60" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Clique para copiar o número do processo
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                          )}
                          {colunasVisiveis.cliente && (
                            <TableCell>
                              <button
                                onClick={() => openClienteDetails(processo)}
                                className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded transition-colors cursor-pointer"
                              >
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {cliente?.nome.charAt(0) || "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-blue-600 hover:text-blue-800">
                                  {cliente?.nome || "Cliente não encontrado"}
                                </span>
                                <ChevronRight className="h-3 w-3 opacity-60" />
                              </button>
                            </TableCell>
                          )}
                          {colunasVisiveis.area && (
                            <TableCell>
                              <Badge variant="outline">{processo.area}</Badge>
                            </TableCell>
                          )}
                          {colunasVisiveis.status && (
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {StatusIcon && (
                                  <StatusIcon className="h-4 w-4" />
                                )}
                                <Badge
                                  className={
                                    statusConfig[processo.status]?.color
                                  }
                                >
                                  {statusConfig[processo.status]?.label}
                                </Badge>
                              </div>
                            </TableCell>
                          )}
                          {colunasVisiveis.valor && (
                            <TableCell>
                              <span className="font-medium">
                                {processo.valor
                                  ? `R$ ${processo.valor.toLocaleString()}`
                                  : "Não informado"}
                              </span>
                            </TableCell>
                          )}
                          {colunasVisiveis.responsavel && (
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {processo.responsavel.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">
                                  {processo.responsavel}
                                </span>
                              </div>
                            </TableCell>
                          )}
                          {colunasVisiveis.dataInicio && (
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-gray-400" />
                                {processo.dataInicio.toLocaleDateString()}
                              </div>
                            </TableCell>
                          )}
                          {colunasVisiveis.proximaAudiencia && (
                            <TableCell>
                              {processo.proximaAudiencia ? (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-orange-500" />
                                  <span className="text-sm">
                                    {processo.proximaAudiencia.toLocaleDateString()}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">
                                  Não agendada
                                </span>
                              )}
                            </TableCell>
                          )}
                          {colunasVisiveis.risco && (
                            <TableCell>
                              <Badge
                                className={riscoConfig[processo.risco]?.color}
                              >
                                {riscoConfig[processo.risco]?.label}
                              </Badge>
                            </TableCell>
                          )}
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                  Ações do Processo
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                  onClick={() =>
                                    viewProcessoDetails(processo.id, "summary")
                                  }
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver Resumo
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() =>
                                    viewProcessoDetails(processo.id, "full")
                                  }
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Ver Detalhes Completos
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                  onClick={() => agendarAudiencia(processo)}
                                >
                                  <CalendarPlus className="h-4 w-4 mr-2" />
                                  Agendar Audiência
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => openProcessoGED(processo)}
                                >
                                  <FolderOpen className="h-4 w-4 mr-2" />
                                  Documentos (GED)
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditingProcesso(processo);
                                    setShowForm(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => {
                                    if (
                                      confirm(
                                        "Tem certeza que deseja excluir este processo?",
                                      )
                                    ) {
                                      excluirProcesso(processo.id);
                                      toast.success(
                                        "Processo excluído com sucesso!",
                                      );
                                    }
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              /* View em Cards */
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {processosNaPagina.map((processo) => {
                    const cliente = getClienteById(processo.clienteId);
                    const StatusIcon = statusConfig[processo.status]?.icon;

                    return (
                      <motion.div
                        key={processo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() =>
                                    copyProcessNumber(processo.numero)
                                  }
                                  className="font-mono text-sm font-medium hover:bg-gray-100 px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  {processo.numero}
                                  <Copy className="h-3 w-3 opacity-60" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Clique para copiar o número do processo
                              </TooltipContent>
                            </Tooltip>
                            <div className="flex items-center gap-2 mt-1">
                              {StatusIcon && <StatusIcon className="h-4 w-4" />}
                              <Badge
                                className={statusConfig[processo.status]?.color}
                              >
                                {statusConfig[processo.status]?.label}
                              </Badge>
                              <Badge
                                className={riscoConfig[processo.risco]?.color}
                              >
                                {riscoConfig[processo.risco]?.label}
                              </Badge>
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
                                onClick={() =>
                                  viewProcessoDetails(processo.id, "summary")
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Resumo
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  viewProcessoDetails(processo.id, "full")
                                }
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Ver Detalhes Completos
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => agendarAudiencia(processo)}
                              >
                                <CalendarPlus className="h-4 w-4 mr-2" />
                                Agendar Audiência
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openProcessoGED(processo)}
                              >
                                <FolderOpen className="h-4 w-4 mr-2" />
                                Documentos
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-2">
                          <button
                            onClick={() => openClienteDetails(processo)}
                            className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded transition-colors cursor-pointer w-full text-left"
                          >
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-blue-600 hover:text-blue-800">
                              {cliente?.nome || "Cliente não encontrado"}
                            </span>
                            <ChevronRight className="h-3 w-3 opacity-60" />
                          </button>

                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-gray-400" />
                            <Badge variant="outline">{processo.area}</Badge>
                          </div>

                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">
                              {processo.valor
                                ? `R$ ${processo.valor.toLocaleString()}`
                                : "Não informado"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              {processo.dataInicio.toLocaleDateString()}
                            </span>
                          </div>

                          {processo.proximaAudiencia && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-orange-500" />
                              <span className="text-sm">
                                Audiência:{" "}
                                {processo.proximaAudiencia.toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {indiceInicial + 1} a{" "}
              {Math.min(indiceFinal, processosOrdenados.length)} de{" "}
              {processosOrdenados.length} processos
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
                disabled={paginaAtual === 1}
              >
                Anterior
              </Button>
              <span className="text-sm">
                Página {paginaAtual} de {totalPaginas}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPaginaAtual(Math.min(totalPaginas, paginaAtual + 1))
                }
                disabled={paginaAtual === totalPaginas}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}

        {/* Dialog de Formulário */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProcesso ? "Editar Processo" : "Novo Processo"}
              </DialogTitle>
              <DialogDescription>
                {editingProcesso
                  ? "Edite as informações do processo jurídico"
                  : "Preencha as informações para criar um novo processo jurídico"}
              </DialogDescription>
            </DialogHeader>
            <ProcessoForm
              processo={editingProcesso}
              onSave={async (data) => {
                if (editingProcesso) {
                  await atualizarProcesso(editingProcesso.id, data);
                  toast.success("Processo atualizado com sucesso!");
                } else {
                  await criarProcesso(data);
                  toast.success("Processo criado com sucesso!");
                }
                setShowForm(false);
                setEditingProcesso(null);
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingProcesso(null);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Sheet de Detalhes do Processo (Summary) */}
        <Sheet
          open={!!showProcessoDetails && detailsMode === "summary"}
          onOpenChange={(open) => !open && setShowProcessoDetails(null)}
        >
          <SheetContent className="w-[600px] sm:w-[800px]">
            <SheetHeader>
              <SheetTitle>Resumo do Processo</SheetTitle>
              <SheetDescription>
                Informações resumidas do processo jurídico
              </SheetDescription>
            </SheetHeader>
            {showProcessoDetails && (
              <div className="mt-6">
                <ProcessoDetalhes
                  processoId={showProcessoDetails}
                  mode="summary"
                  onOpenFull={() => {
                    setShowProcessoDetails(null);
                    navigate(`/crm/processos/${showProcessoDetails}`);
                  }}
                />
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Dialog de Detalhes do Cliente */}
        <Dialog
          open={!!showClienteDetails}
          onOpenChange={(open) => !open && setShowClienteDetails(null)}
        >
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Cliente</DialogTitle>
              <DialogDescription>
                Informações completas e relacionamentos do cliente
              </DialogDescription>
            </DialogHeader>
            {showClienteDetails && (
              <ClienteDetalhes
                cliente={showClienteDetails}
                onClose={() => setShowClienteDetails(null)}
                showRelacionamentos={true}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
