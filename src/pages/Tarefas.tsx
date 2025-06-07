import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckSquare,
  Calendar,
  Clock,
  Plus,
  Filter,
  Search,
  Users,
  AlertTriangle,
  FileText,
  MessageSquare,
  FolderOpen,
  Brain,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Star,
  Flag,
  Link,
  RefreshCw,
  TrendingUp,
  Archive,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  cliente?: {
    id: string;
    nome: string;
    tipo: "fisica" | "juridica";
  };
  processo?: {
    id: string;
    numero: string;
    assunto: string;
  };
  prioridade: "baixa" | "media" | "alta" | "urgente";
  responsavel: {
    id: string;
    nome: string;
    avatar?: string;
  };
  dataVencimento: string;
  recorrencia?: "diaria" | "semanal" | "mensal" | "anual";
  status: "pendente" | "em_andamento" | "concluida" | "cancelada";
  origem:
    | "manual"
    | "crm"
    | "ged"
    | "publicacao"
    | "atendimento"
    | "agenda"
    | "ia";
  origemDetalhes?: {
    modulo: string;
    itemId: string;
    itemTitulo: string;
  };
  tags: string[];
  anexos: string[];
  historico: {
    data: string;
    acao: string;
    usuario: string;
    detalhes?: string;
  }[];
  dataCriacao: string;
  dataAtualizacao: string;
  tempoEstimado?: number; // em minutos
  tempoGasto?: number; // em minutos
  integracaoAgenda: boolean;
  integracaoIA: {
    sugestoesPeticao: boolean;
    elaboracaoRascunho: boolean;
    resumoAutomatico: boolean;
  };
}

export default function Tarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [filteredTarefas, setFilteredTarefas] = useState<Tarefa[]>([]);
  const [selectedTarefa, setSelectedTarefa] = useState<Tarefa | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPrioridade, setFilterPrioridade] = useState("all");
  const [filterResponsavel, setFilterResponsavel] = useState("all");
  const [activeTab, setActiveTab] = useState("todas");

  // Mock data
  useEffect(() => {
    const mockTarefas: Tarefa[] = [
      {
        id: "1",
        titulo: "Elaborar petição inicial - Ação Trabalhista",
        descricao:
          "Elaborar petição inicial para ação trabalhista do cliente João Silva. Incluir todos os pedidos de horas extras não pagas.",
        cliente: {
          id: "cli-001",
          nome: "João Silva",
          tipo: "fisica",
        },
        processo: {
          id: "proc-001",
          numero: "1001234-12.2024.5.02.0001",
          assunto: "Ação Trabalhista - Horas Extras",
        },
        prioridade: "alta",
        responsavel: {
          id: "user-001",
          nome: "Dr. Maria Santos",
          avatar: "/avatars/maria.jpg",
        },
        dataVencimento: "2024-01-20T14:00:00",
        status: "em_andamento",
        origem: "crm",
        origemDetalhes: {
          modulo: "CRM Jurídico",
          itemId: "proc-001",
          itemTitulo: "Processo Trabalhista - João Silva",
        },
        tags: ["trabalhista", "horas-extras", "urgente"],
        anexos: ["contrato_trabalho.pdf", "cartao_ponto.pdf"],
        historico: [
          {
            data: "2024-01-15T10:00:00",
            acao: "Criada",
            usuario: "Dr. Maria Santos",
            detalhes: "Tarefa criada a partir do processo CRM",
          },
        ],
        dataCriacao: "2024-01-15T10:00:00",
        dataAtualizacao: "2024-01-15T10:00:00",
        tempoEstimado: 240,
        tempoGasto: 120,
        integracaoAgenda: true,
        integracaoIA: {
          sugestoesPeticao: true,
          elaboracaoRascunho: false,
          resumoAutomatico: true,
        },
      },
      {
        id: "2",
        titulo: "Análise de publicação - TRT 2ª Região",
        descricao:
          "Analisar nova publicação do TRT 2ª Região sobre processo 5001234-12.2023.5.02.0001",
        processo: {
          id: "proc-002",
          numero: "5001234-12.2023.5.02.0001",
          assunto: "Ação de Cobrança",
        },
        prioridade: "urgente",
        responsavel: {
          id: "user-002",
          nome: "Dr. Carlos Oliveira",
          avatar: "/avatars/carlos.jpg",
        },
        dataVencimento: "2024-01-16T16:00:00",
        status: "pendente",
        origem: "publicacao",
        origemDetalhes: {
          modulo: "Publicações",
          itemId: "pub-001",
          itemTitulo: "Intimação TRT 2ª Região",
        },
        tags: ["publicacao", "prazo", "trt"],
        anexos: ["intimacao_trt.pdf"],
        historico: [
          {
            data: "2024-01-15T14:30:00",
            acao: "Criada",
            usuario: "Sistema Automático",
            detalhes: "Criada automaticamente a partir de nova publicação",
          },
        ],
        dataCriacao: "2024-01-15T14:30:00",
        dataAtualizacao: "2024-01-15T14:30:00",
        tempoEstimado: 60,
        integracaoAgenda: true,
        integracaoIA: {
          sugestoesPeticao: false,
          elaboracaoRascunho: true,
          resumoAutomatico: true,
        },
      },
      {
        id: "3",
        titulo: "Upload de documentos - Contrato Social",
        descricao:
          "Organizar e fazer upload dos documentos do contrato social da empresa XYZ Ltda no GED",
        cliente: {
          id: "cli-002",
          nome: "XYZ Tecnologia Ltda",
          tipo: "juridica",
        },
        prioridade: "media",
        responsavel: {
          id: "user-003",
          nome: "Ana Paula Costa",
          avatar: "/avatars/ana.jpg",
        },
        dataVencimento: "2024-01-18T12:00:00",
        status: "pendente",
        origem: "ged",
        origemDetalhes: {
          modulo: "GED Jurídico",
          itemId: "folder-002",
          itemTitulo: "Pasta: XYZ Tecnologia - Contratos",
        },
        tags: ["ged", "documentos", "contrato-social"],
        anexos: [],
        historico: [
          {
            data: "2024-01-14T09:00:00",
            acao: "Criada",
            usuario: "Ana Paula Costa",
            detalhes: "Solicitação de organização de documentos",
          },
        ],
        dataCriacao: "2024-01-14T09:00:00",
        dataAtualizacao: "2024-01-14T09:00:00",
        tempoEstimado: 90,
        integracaoAgenda: false,
        integracaoIA: {
          sugestoesPeticao: false,
          elaboracaoRascunho: false,
          resumoAutomatico: false,
        },
      },
    ];

    setTarefas(mockTarefas);
    setFilteredTarefas(mockTarefas);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = tarefas;

    if (searchTerm) {
      filtered = filtered.filter(
        (tarefa) =>
          tarefa.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tarefa.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tarefa.cliente?.nome
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          tarefa.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((tarefa) => tarefa.status === filterStatus);
    }

    if (filterPrioridade !== "all") {
      filtered = filtered.filter(
        (tarefa) => tarefa.prioridade === filterPrioridade,
      );
    }

    if (filterResponsavel !== "all") {
      filtered = filtered.filter(
        (tarefa) => tarefa.responsavel.id === filterResponsavel,
      );
    }

    if (activeTab !== "todas") {
      switch (activeTab) {
        case "pendentes":
          filtered = filtered.filter((t) => t.status === "pendente");
          break;
        case "em_andamento":
          filtered = filtered.filter((t) => t.status === "em_andamento");
          break;
        case "concluidas":
          filtered = filtered.filter((t) => t.status === "concluida");
          break;
        case "vencendo":
          const hoje = new Date();
          const amanha = new Date(hoje);
          amanha.setDate(hoje.getDate() + 1);
          filtered = filtered.filter(
            (t) =>
              new Date(t.dataVencimento) <= amanha && t.status !== "concluida",
          );
          break;
      }
    }

    setFilteredTarefas(filtered);
  }, [
    tarefas,
    searchTerm,
    filterStatus,
    filterPrioridade,
    filterResponsavel,
    activeTab,
  ]);

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "baixa":
        return "bg-blue-100 text-blue-800";
      case "media":
        return "bg-yellow-100 text-yellow-800";
      case "alta":
        return "bg-orange-100 text-orange-800";
      case "urgente":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "bg-gray-100 text-gray-800";
      case "em_andamento":
        return "bg-blue-100 text-blue-800";
      case "concluida":
        return "bg-green-100 text-green-800";
      case "cancelada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOrigemIcon = (origem: string) => {
    switch (origem) {
      case "crm":
        return <Users className="h-4 w-4" />;
      case "ged":
        return <FolderOpen className="h-4 w-4" />;
      case "publicacao":
        return <FileText className="h-4 w-4" />;
      case "atendimento":
        return <MessageSquare className="h-4 w-4" />;
      case "agenda":
        return <Calendar className="h-4 w-4" />;
      case "ia":
        return <Brain className="h-4 w-4" />;
      default:
        return <CheckSquare className="h-4 w-4" />;
    }
  };

  const abrirAIPeticao = (tarefa: Tarefa) => {
    toast.success("Abrindo IA Jurídica para elaboração de petição...");
    // Integração com módulo IA
    window.open(
      `/ai?context=peticao&tarefa=${tarefa.id}&processo=${tarefa.processo?.id}`,
      "_blank",
    );
  };

  const abrirAIRascunho = (tarefa: Tarefa) => {
    toast.success("Abrindo IA Jurídica para elaboração de rascunho...");
    // Integração com módulo IA
    window.open(`/ai?context=rascunho&tarefa=${tarefa.id}`, "_blank");
  };

  const adicionarAAgenda = (tarefa: Tarefa) => {
    toast.success("Adicionando tarefa à agenda...");
    // Integração com módulo Agenda
    const agendaData = {
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      data: tarefa.dataVencimento,
      tipo: "tarefa",
      tarefaId: tarefa.id,
    };

    // Simular integração com agenda
    localStorage.setItem(
      `agenda_tarefa_${tarefa.id}`,
      JSON.stringify(agendaData),
    );
  };

  const handleCreateTarefa = () => {
    setIsCreateDialogOpen(true);
  };

  const handleViewDetails = (tarefa: Tarefa) => {
    setSelectedTarefa(tarefa);
    setIsDetailDialogOpen(true);
  };

  const TarefaCard = ({ tarefa }: { tarefa: Tarefa }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group"
    >
      <Card
        className="hover:shadow-md transition-all duration-200 border-l-4"
        style={{
          borderLeftColor:
            tarefa.prioridade === "urgente"
              ? "#ef4444"
              : tarefa.prioridade === "alta"
                ? "#f97316"
                : tarefa.prioridade === "media"
                  ? "#eab308"
                  : "#6b7280",
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getOrigemIcon(tarefa.origem)}
                <Badge variant="outline" className="text-xs">
                  {tarefa.origem.toUpperCase()}
                </Badge>
                <Badge className={getPrioridadeColor(tarefa.prioridade)}>
                  {tarefa.prioridade.toUpperCase()}
                </Badge>
                <Badge className={getStatusColor(tarefa.status)}>
                  {tarefa.status.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
              <CardTitle className="text-base leading-tight mb-1">
                {tarefa.titulo}
              </CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {tarefa.descricao}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewDetails(tarefa)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {tarefa.integracaoIA.sugestoesPeticao && (
                  <DropdownMenuItem onClick={() => abrirAIPeticao(tarefa)}>
                    <Brain className="h-4 w-4 mr-2" />
                    IA: Elaborar Petição
                  </DropdownMenuItem>
                )}
                {tarefa.integracaoIA.elaboracaoRascunho && (
                  <DropdownMenuItem onClick={() => abrirAIRascunho(tarefa)}>
                    <FileText className="h-4 w-4 mr-2" />
                    IA: Elaborar Rascunho
                  </DropdownMenuItem>
                )}
                {!tarefa.integracaoAgenda && (
                  <DropdownMenuItem onClick={() => adicionarAAgenda(tarefa)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Adicionar à Agenda
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              {tarefa.cliente && (
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{tarefa.cliente.nome}</span>
                </div>
              )}
              {tarefa.processo && (
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span className="truncate max-w-[100px]">
                    {tarefa.processo.numero}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                {new Date(tarefa.dataVencimento).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1">
              <img
                src={tarefa.responsavel.avatar || "/avatars/default.jpg"}
                alt={tarefa.responsavel.nome}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm">{tarefa.responsavel.nome}</span>
            </div>
            <div className="flex gap-1">
              {tarefa.integracaoAgenda && (
                <Badge variant="outline" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  Agenda
                </Badge>
              )}
              {tarefa.anexos.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  <Link className="h-3 w-3 mr-1" />
                  {tarefa.anexos.length}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Módulo de Tarefas</h1>
          <p className="text-muted-foreground">
            Gestão integrada de tarefas com CRM, GED, Publicações, IA e Agenda
          </p>
        </div>
        <Button onClick={handleCreateTarefa} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Tarefas
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tarefas.length}</div>
            <p className="text-xs text-muted-foreground">
              Todas as tarefas ativas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tarefas.filter((t) => t.status === "pendente").length}
            </div>
            <p className="text-xs text-muted-foreground">Aguardando execução</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tarefas.filter((t) => t.status === "em_andamento").length}
            </div>
            <p className="text-xs text-muted-foreground">Sendo executadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencendo Hoje</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {
                tarefas.filter((t) => {
                  const hoje = new Date();
                  const vencimento = new Date(t.dataVencimento);
                  return (
                    vencimento.toDateString() === hoje.toDateString() &&
                    t.status !== "concluida"
                  );
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Requerem atenção</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar tarefas por título, descrição, cliente ou tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filterPrioridade}
                onValueChange={setFilterPrioridade}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs and Task List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="em_andamento">Em Andamento</TabsTrigger>
          <TabsTrigger value="concluidas">Concluídas</TabsTrigger>
          <TabsTrigger value="vencendo">Vencendo</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <AnimatePresence>
            {filteredTarefas.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Nenhuma tarefa encontrada
                  </h3>
                  <p className="text-muted-foreground">
                    Não há tarefas que correspondam aos filtros selecionados.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTarefas.map((tarefa) => (
                  <TarefaCard key={tarefa.id} tarefa={tarefa} />
                ))}
              </div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>

      {/* Create Task Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Nova Tarefa</DialogTitle>
            <DialogDescription>
              Crie uma nova tarefa e conecte-a com outros módulos do sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  placeholder="Ex: Elaborar petição inicial..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prioridade">Prioridade *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
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
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva os detalhes da tarefa..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cli-001">João Silva</SelectItem>
                    <SelectItem value="cli-002">XYZ Tecnologia Ltda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="processo">Processo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um processo..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proc-001">
                      1001234-12.2024.5.02.0001
                    </SelectItem>
                    <SelectItem value="proc-002">
                      5001234-12.2023.5.02.0001
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="responsavel">Responsável *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user-001">Dr. Maria Santos</SelectItem>
                    <SelectItem value="user-002">
                      Dr. Carlos Oliveira
                    </SelectItem>
                    <SelectItem value="user-003">Ana Paula Costa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataVencimento">Data/Hora Vencimento *</Label>
                <Input id="dataVencimento" type="datetime-local" />
              </div>
            </div>
            <div className="space-y-3">
              <Label>Integrações</Label>
              <div className="flex items-center space-x-2">
                <Checkbox id="agenda" />
                <Label htmlFor="agenda">Adicionar à Agenda Jurídica</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="ia-peticao" />
                <Label htmlFor="ia-peticao">
                  Ativar sugestões de petição via IA
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="ia-rascunho" />
                <Label htmlFor="ia-rascunho">
                  Ativar elaboração de rascunho via IA
                </Label>
              </div>
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
                toast.success("Tarefa criada com sucesso!");
                setIsCreateDialogOpen(false);
              }}
            >
              Criar Tarefa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTarefa && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getOrigemIcon(selectedTarefa.origem)}
                  {selectedTarefa.titulo}
                </DialogTitle>
                <DialogDescription>
                  Criada em{" "}
                  {new Date(selectedTarefa.dataCriacao).toLocaleString("pt-BR")}
                  {selectedTarefa.origemDetalhes && (
                    <> • Origem: {selectedTarefa.origemDetalhes.modulo}</>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="flex gap-2">
                  <Badge
                    className={getPrioridadeColor(selectedTarefa.prioridade)}
                  >
                    {selectedTarefa.prioridade.toUpperCase()}
                  </Badge>
                  <Badge className={getStatusColor(selectedTarefa.status)}>
                    {selectedTarefa.status.replace("_", " ").toUpperCase()}
                  </Badge>
                  {selectedTarefa.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Descrição</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedTarefa.descricao}
                      </p>
                    </div>

                    {selectedTarefa.cliente && (
                      <div>
                        <h4 className="font-medium mb-2">Cliente</h4>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">
                            {selectedTarefa.cliente.nome}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {selectedTarefa.cliente.tipo}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {selectedTarefa.processo && (
                      <div>
                        <h4 className="font-medium mb-2">Processo</h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm font-mono">
                              {selectedTarefa.processo.numero}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground ml-6">
                            {selectedTarefa.processo.assunto}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Responsável</h4>
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            selectedTarefa.responsavel.avatar ||
                            "/avatars/default.jpg"
                          }
                          alt={selectedTarefa.responsavel.nome}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm">
                          {selectedTarefa.responsavel.nome}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Vencimento</h4>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                          {new Date(
                            selectedTarefa.dataVencimento,
                          ).toLocaleString("pt-BR")}
                        </span>
                      </div>
                    </div>

                    {selectedTarefa.tempoEstimado && (
                      <div>
                        <h4 className="font-medium mb-2">Tempo</h4>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>Estimado:</span>
                            <span>
                              {Math.floor(selectedTarefa.tempoEstimado / 60)}h{" "}
                              {selectedTarefa.tempoEstimado % 60}min
                            </span>
                          </div>
                          {selectedTarefa.tempoGasto && (
                            <div className="flex items-center justify-between text-sm">
                              <span>Gasto:</span>
                              <span>
                                {Math.floor(selectedTarefa.tempoGasto / 60)}h{" "}
                                {selectedTarefa.tempoGasto % 60}min
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <h4 className="font-medium">Ações Rápidas</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTarefa.integracaoIA.sugestoesPeticao && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => abrirAIPeticao(selectedTarefa)}
                        className="gap-2"
                      >
                        <Brain className="h-4 w-4" />
                        IA: Elaborar Petição
                      </Button>
                    )}
                    {selectedTarefa.integracaoIA.elaboracaoRascunho && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => abrirAIRascunho(selectedTarefa)}
                        className="gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        IA: Elaborar Rascunho
                      </Button>
                    )}
                    {!selectedTarefa.integracaoAgenda && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adicionarAAgenda(selectedTarefa)}
                        className="gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        Adicionar à Agenda
                      </Button>
                    )}
                  </div>
                </div>

                {/* Anexos */}
                {selectedTarefa.anexos.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">
                      Anexos ({selectedTarefa.anexos.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedTarefa.anexos.map((anexo, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 border rounded"
                        >
                          <FileText className="h-4 w-4" />
                          <span className="text-sm flex-1">{anexo}</span>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Histórico */}
                <div>
                  <h4 className="font-medium mb-2">Histórico</h4>
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {selectedTarefa.historico.map((item, index) => (
                        <div key={index} className="text-sm p-2 border rounded">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{item.acao}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.data).toLocaleString("pt-BR")}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.usuario}{" "}
                            {item.detalhes && `• ${item.detalhes}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDetailDialogOpen(false)}
                >
                  Fechar
                </Button>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Tarefa
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
