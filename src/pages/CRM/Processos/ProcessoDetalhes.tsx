import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Scale,
  ArrowLeft,
  Edit,
  FileText,
  Calendar,
  DollarSign,
  User,
  Building,
  Clock,
  AlertTriangle,
  CheckCircle,
  Star,
  Tag,
  Phone,
  Mail,
  MapPin,
  Download,
  Upload,
  Eye,
  Share2,
  MoreHorizontal,
  Bell,
  MessageSquare,
  History,
  Paperclip,
  Shield,
  Gavel,
  BookOpen,
  TrendingUp,
  Target,
  Activity,
  Users,
  Plus,
  X,
  Send,
  FolderOpen,
  CalendarPlus,
  ExternalLink,
  Copy,
  Archive,
  PlayCircle,
  PauseCircle,
  XCircle,
  Info,
  Zap,
  Flag,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCRM, type Processo } from "@/hooks/useCRM";
import { toast } from "sonner";
import ProcessoForm from "./ProcessoForm";

interface DocumentoProcesso {
  id: string;
  nome: string;
  tipo: "inicial" | "contestacao" | "sentenca" | "recurso" | "outros";
  dataUpload: Date;
  tamanho: string;
  uploadedBy: string;
  versao: number;
  status: "aprovado" | "pendente" | "rejeitado";
  url?: string;
}

interface MovimentacaoProcesso {
  id: string;
  data: Date;
  tipo: "audiencia" | "decisao" | "peticao" | "recurso" | "sentenca" | "outros";
  descricao: string;
  responsavel: string;
  arquivo?: string;
  observacoes?: string;
  status?: "pendente" | "concluido";
}

interface AnotacaoProcesso {
  id: string;
  data: Date;
  usuario: string;
  texto: string;
  tipo: "observacao" | "lembrete" | "tarefa";
  prioridade: "baixa" | "media" | "alta";
  concluida?: boolean;
}

interface ProcessoDetalhesProps {
  processoId?: string;
  mode?: "summary" | "full";
  onOpenFull?: () => void;
}

export default function ProcessoDetalhes({
  processoId: propProcessoId,
  mode = "full",
  onOpenFull,
}: ProcessoDetalhesProps) {
  const { id: urlId } = useParams<{ id: string }>();
  const processoId = propProcessoId || urlId;
  const navigate = useNavigate();
  const { obterProcesso, obterCliente } = useCRM();

  const [processo, setProcesso] = useState<Processo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [activeTab, setActiveTab] = useState("resumo");
  const [newNote, setNewNote] = useState("");
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);

  // Mock data - em produção viria das APIs
  const documentos: DocumentoProcesso[] = [
    {
      id: "doc-001",
      nome: "Petição Inicial.pdf",
      tipo: "inicial",
      dataUpload: new Date("2024-01-15"),
      tamanho: "2.5 MB",
      uploadedBy: "Dr. Pedro Santos",
      versao: 1,
      status: "aprovado",
      url: "/documents/peticao-inicial.pdf",
    },
    {
      id: "doc-002",
      nome: "Contestação.pdf",
      tipo: "contestacao",
      dataUpload: new Date("2024-01-20"),
      tamanho: "1.8 MB",
      uploadedBy: "Dra. Ana Costa",
      versao: 1,
      status: "pendente",
      url: "/documents/contestacao.pdf",
    },
    {
      id: "doc-003",
      nome: "Sentença Parcial.pdf",
      tipo: "sentenca",
      dataUpload: new Date("2024-01-25"),
      tamanho: "950 KB",
      uploadedBy: "Sistema Judicial",
      versao: 1,
      status: "aprovado",
      url: "/documents/sentenca-parcial.pdf",
    },
    {
      id: "doc-004",
      nome: "Recurso de Apelação.pdf",
      tipo: "recurso",
      dataUpload: new Date("2024-01-28"),
      tamanho: "3.2 MB",
      uploadedBy: "Dr. Pedro Santos",
      versao: 2,
      status: "aprovado",
      url: "/documents/recurso-apelacao.pdf",
    },
  ];

  const movimentacoes: MovimentacaoProcesso[] = [
    {
      id: "mov-001",
      data: new Date("2024-01-26"),
      tipo: "audiencia",
      descricao: "Audiência de conciliação agendada",
      responsavel: "Tribunal",
      status: "pendente",
      observacoes: "Audiência marcada para 15/02/2024 às 14:00h",
    },
    {
      id: "mov-002",
      data: new Date("2024-01-24"),
      tipo: "peticao",
      descricao: "Petição de esclarecimentos protocolada",
      responsavel: "Dr. Pedro Santos",
      arquivo: "esclarecimentos.pdf",
      status: "concluido",
    },
    {
      id: "mov-003",
      data: new Date("2024-01-20"),
      tipo: "decisao",
      descricao: "Despacho do juiz deferindo pedido de dilação probatória",
      responsavel: "Juiz Dr. Carlos Mendes",
      status: "concluido",
    },
    {
      id: "mov-004",
      data: new Date("2024-01-15"),
      tipo: "peticao",
      descricao: "Petição inicial protocolada",
      responsavel: "Dr. Pedro Santos",
      arquivo: "peticao-inicial.pdf",
      status: "concluido",
    },
  ];

  const anotacoes: AnotacaoProcesso[] = [
    {
      id: "note-001",
      data: new Date("2024-01-25"),
      usuario: "Dr. Pedro Santos",
      texto:
        "Cliente confirmou presença na audiência de conciliação. Preparar proposta de acordo.",
      tipo: "observacao",
      prioridade: "alta",
    },
    {
      id: "note-002",
      data: new Date("2024-01-22"),
      usuario: "Ana Costa",
      texto:
        "Lembrar de protocolar quesitos para perícia técnica até 30/01/2024.",
      tipo: "lembrete",
      prioridade: "media",
    },
    {
      id: "note-003",
      data: new Date("2024-01-18"),
      usuario: "Dr. Pedro Santos",
      texto:
        "Analisar jurisprudência sobre casos similares para fortalecer argumentação.",
      tipo: "tarefa",
      prioridade: "media",
      concluida: true,
    },
  ];

  useEffect(() => {
    const loadProcesso = async () => {
      if (!processoId) return;

      setLoading(true);
      try {
        // Simular carregamento do processo
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock de processo - em produção viria da API
        const mockProcesso: Processo = {
          id: processoId,
          numero: "1234567-89.2024.8.26.0001",
          clienteId: "cli-001",
          cliente: "João Silva",
          area: "Trabalhista",
          status: "ativo",
          valor: 85000,
          dataInicio: new Date("2024-01-15"),
          dataEncerramento: undefined,
          responsavel: "Dr. Pedro Santos",
          tribunal: "TRT 2ª Região",
          vara: "1ª Vara do Trabalho",
          assunto: "Rescisão indireta de contrato de trabalho",
          observacoes:
            "Processo com alta complexidade envolvendo múltiplas verbas rescisórias",
          tags: ["rescisao", "verbas", "complexo"],
          proximaAudiencia: new Date("2024-02-15"),
          risco: "medio",
          prioridade: "alta",
        };

        setProcesso(mockProcesso);
      } catch (error) {
        console.error("Erro ao carregar processo:", error);
        toast.error("Erro ao carregar dados do processo");
      } finally {
        setLoading(false);
      }
    };

    loadProcesso();
  }, [processoId]);

  // Configurações de status e outros
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
    baixo: {
      label: "Baixo",
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
    },
    medio: {
      label: "Médio",
      color: "bg-yellow-100 text-yellow-800",
      icon: AlertTriangle,
    },
    alto: { label: "Alto", color: "bg-red-100 text-red-800", icon: XCircle },
  };

  const tipoDocumentoConfig = {
    inicial: { label: "Petição Inicial", color: "bg-blue-100 text-blue-800" },
    contestacao: {
      label: "Contestação",
      color: "bg-orange-100 text-orange-800",
    },
    sentenca: { label: "Sentença", color: "bg-green-100 text-green-800" },
    recurso: { label: "Recurso", color: "bg-purple-100 text-purple-800" },
    outros: { label: "Outros", color: "bg-gray-100 text-gray-800" },
  };

  const tipoMovimentacaoConfig = {
    audiencia: { icon: Calendar, color: "text-blue-600" },
    decisao: { icon: Gavel, color: "text-green-600" },
    peticao: { icon: FileText, color: "text-purple-600" },
    recurso: { icon: TrendingUp, color: "text-orange-600" },
    sentenca: { icon: CheckCircle, color: "text-emerald-600" },
    outros: { icon: Info, color: "text-gray-600" },
  };

  // Funções de ação
  const copyProcessNumber = () => {
    if (processo) {
      navigator.clipboard.writeText(processo.numero);
      toast.success(`Número ${processo.numero} copiado!`);
    }
  };

  const agendarAudiencia = () => {
    if (processo) {
      navigate(
        `/agenda?processo=${processo.id}&tipo=audiencia&cliente=${processo.clienteId}`,
      );
    }
  };

  const openGED = () => {
    if (processo) {
      navigate(`/ged?processo=${processo.id}&cliente=${processo.clienteId}`);
    }
  };

  const addNote = () => {
    if (!newNote.trim()) return;

    const novaNota: AnotacaoProcesso = {
      id: `note-${Date.now()}`,
      data: new Date(),
      usuario: "Usuário Atual",
      texto: newNote,
      tipo: "observacao",
      prioridade: "media",
    };

    // Em produção, salvaria na API
    toast.success("Anotação adicionada com sucesso!");
    setNewNote("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Carregando detalhes do processo...
          </p>
        </div>
      </div>
    );
  }

  if (!processo) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Processo não encontrado
          </h3>
          <p className="text-muted-foreground mb-4">
            O processo solicitado não foi encontrado ou você não tem permissão
            para visualizá-lo.
          </p>
          <Button onClick={() => navigate("/crm/processos")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Processos
          </Button>
        </div>
      </div>
    );
  }

  const StatusIcon = statusConfig[processo.status]?.icon;
  const RiscoIcon = riscoConfig[processo.risco]?.icon;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {mode === "full" && (
              <Button
                variant="ghost"
                onClick={() => navigate("/crm/processos")}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Processo Jurídico</h1>
                {mode === "summary" && onOpenFull && (
                  <Button variant="outline" size="sm" onClick={onOpenFull}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver Completo
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={copyProcessNumber}
                      className="font-mono text-lg font-semibold hover:bg-gray-100 px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1"
                    >
                      {processo.numero}
                      <Copy className="h-4 w-4 opacity-60" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Clique para copiar o número do processo
                  </TooltipContent>
                </Tooltip>
                <div className="flex items-center gap-2">
                  {StatusIcon && <StatusIcon className="h-5 w-5" />}
                  <Badge className={statusConfig[processo.status]?.color}>
                    {statusConfig[processo.status]?.label}
                  </Badge>
                  {RiscoIcon && <RiscoIcon className="h-5 w-5" />}
                  <Badge className={riscoConfig[processo.risco]?.color}>
                    Risco {riscoConfig[processo.risco]?.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={agendarAudiencia}>
              <CalendarPlus className="h-4 w-4 mr-2" />
              Agendar Audiência
            </Button>
            <Button variant="outline" onClick={openGED}>
              <FolderOpen className="h-4 w-4 mr-2" />
              Documentos
            </Button>
            <Button variant="outline" onClick={() => setShowEditForm(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => window.print()}>
                  <Download className="h-4 w-4 mr-2" />
                  Imprimir
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Archive className="h-4 w-4 mr-2" />
                  Arquivar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Cliente</span>
              </div>
              <p className="font-semibold">{processo.cliente}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Área</span>
              </div>
              <Badge variant="outline">{processo.area}</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Valor</span>
              </div>
              <p className="font-semibold">
                {processo.valor
                  ? `R$ ${processo.valor.toLocaleString()}`
                  : "Não informado"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Início</span>
              </div>
              <p className="font-semibold">
                {processo.dataInicio.toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs do Conteúdo */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="anotacoes">Anotações</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="relacionados">Relacionados</TabsTrigger>
          </TabsList>

          <TabsContent value="resumo" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informações Detalhadas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Informações Detalhadas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Tribunal
                    </label>
                    <p className="font-medium">{processo.tribunal}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Vara
                    </label>
                    <p className="font-medium">{processo.vara}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Assunto
                    </label>
                    <p className="font-medium">{processo.assunto}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Responsável
                    </label>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {processo.responsavel.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {processo.responsavel}
                      </span>
                    </div>
                  </div>
                  {processo.proximaAudiencia && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Próxima Audiência
                      </label>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">
                          {processo.proximaAudiencia.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                  {processo.tags && processo.tags.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {processo.tags.map((tag, index) => (
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
                </CardContent>
              </Card>

              {/* Progresso e Estatísticas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Progresso e Estatísticas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        Progresso Geral
                      </span>
                      <span className="text-sm text-gray-500">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {documentos.length}
                      </div>
                      <div className="text-sm text-gray-500">Documentos</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {movimentacoes.length}
                      </div>
                      <div className="text-sm text-gray-500">Movimentações</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {anotacoes.length}
                      </div>
                      <div className="text-sm text-gray-500">Anotações</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {Math.floor(
                          (new Date().getTime() -
                            processo.dataInicio.getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}
                      </div>
                      <div className="text-sm text-gray-500">Dias</div>
                    </div>
                  </div>

                  {processo.observacoes && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Observações
                      </label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 rounded">
                        {processo.observacoes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="movimentacoes" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Movimentações Processuais
              </h3>
              <Button size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>

            <div className="space-y-4">
              {movimentacoes.map((mov, index) => {
                const TipoIcon = tipoMovimentacaoConfig[mov.tipo]?.icon || Info;
                const iconColor =
                  tipoMovimentacaoConfig[mov.tipo]?.color || "text-gray-600";

                return (
                  <Card
                    key={mov.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-gray-100`}>
                          <TipoIcon className={`h-4 w-4 ${iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{mov.descricao}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">
                                {mov.data.toLocaleDateString()}
                              </span>
                              {mov.status && (
                                <Badge
                                  className={
                                    mov.status === "concluido"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }
                                >
                                  {mov.status === "concluido"
                                    ? "Concluído"
                                    : "Pendente"}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Por: {mov.responsavel}
                          </p>
                          {mov.observacoes && (
                            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                              {mov.observacoes}
                            </p>
                          )}
                          {mov.arquivo && (
                            <div className="flex items-center gap-2 mt-2">
                              <Paperclip className="h-4 w-4 text-gray-400" />
                              <a
                                href="#"
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {mov.arquivo}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="documentos" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Documentos do Processo</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={openGED}>
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Abrir GED
                </Button>
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documentos.map((doc) => (
                <Card
                  key={doc.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <Badge className={tipoDocumentoConfig[doc.tipo]?.color}>
                          {tipoDocumentoConfig[doc.tipo]?.label}
                        </Badge>
                      </div>
                      <Badge
                        className={
                          doc.status === "aprovado"
                            ? "bg-green-100 text-green-800"
                            : doc.status === "pendente"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {doc.status === "aprovado"
                          ? "Aprovado"
                          : doc.status === "pendente"
                            ? "Pendente"
                            : "Rejeitado"}
                      </Badge>
                    </div>

                    <h4 className="font-medium mb-2 line-clamp-2">
                      {doc.nome}
                    </h4>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Tamanho:</span>
                        <span>{doc.tamanho}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Versão:</span>
                        <span>v{doc.versao}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Upload:</span>
                        <span>{doc.dataUpload.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Por:</span>
                        <span>{doc.uploadedBy}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-1" />
                        Baixar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="anotacoes" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Anotações e Observações</h3>
            </div>

            {/* Nova Anotação */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Adicionar nova anotação..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="mb-2"
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Badge variant="outline" className="cursor-pointer">
                          Observação
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer">
                          Lembrete
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer">
                          Tarefa
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={addNote}
                        disabled={!newNote.trim()}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Anotações */}
            <div className="space-y-3">
              {anotacoes.map((anotacao) => (
                <Card key={anotacao.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {anotacao.usuario.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {anotacao.usuario}
                            </span>
                            <Badge
                              className={
                                anotacao.tipo === "observacao"
                                  ? "bg-blue-100 text-blue-800"
                                  : anotacao.tipo === "lembrete"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-purple-100 text-purple-800"
                              }
                            >
                              {anotacao.tipo}
                            </Badge>
                            <Badge
                              className={
                                anotacao.prioridade === "alta"
                                  ? "bg-red-100 text-red-800"
                                  : anotacao.prioridade === "media"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                              }
                            >
                              {anotacao.prioridade}
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-500">
                            {anotacao.data.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{anotacao.texto}</p>
                        {anotacao.tipo === "tarefa" && (
                          <div className="flex items-center gap-2 mt-2">
                            <Checkbox checked={anotacao.concluida} />
                            <span className="text-sm text-gray-600">
                              {anotacao.concluida ? "Concluída" : "Pendente"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <h3 className="text-lg font-semibold">Timeline do Processo</h3>

            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-6">
                {[...movimentacoes, ...anotacoes]
                  .sort((a, b) => b.data.getTime() - a.data.getTime())
                  .map((item, index) => {
                    const isMovimentacao =
                      "tipo" in item &&
                      [
                        "audiencia",
                        "decisao",
                        "peticao",
                        "recurso",
                        "sentenca",
                        "outros",
                      ].includes(item.tipo);
                    const Icon = isMovimentacao
                      ? tipoMovimentacaoConfig[
                          (item as MovimentacaoProcesso).tipo
                        ]?.icon || Info
                      : MessageSquare;

                    return (
                      <div
                        key={item.id}
                        className="relative flex items-start gap-4"
                      >
                        <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-white border-2 border-gray-300 rounded-full">
                          <Icon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">
                              {isMovimentacao
                                ? (item as MovimentacaoProcesso).descricao
                                : (item as AnotacaoProcesso).texto}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {item.data.toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {isMovimentacao
                              ? `Por: ${(item as MovimentacaoProcesso).responsavel}`
                              : `Por: ${(item as AnotacaoProcesso).usuario}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="relacionados" className="space-y-4">
            <h3 className="text-lg font-semibold">Itens Relacionados</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{processo.cliente}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Perfil
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Contatar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Compromissos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      2 compromissos agendados
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={agendarAudiencia}
                      >
                        <CalendarPlus className="h-4 w-4 mr-1" />
                        Agendar
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Todos
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    Documentos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      {documentos.length} documentos
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={openGED}>
                        <FolderOpen className="h-4 w-4 mr-1" />
                        Abrir GED
                      </Button>
                      <Button size="sm" variant="outline">
                        <Upload className="h-4 w-4 mr-1" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialog de Formulário */}
        <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Processo</DialogTitle>
              <DialogDescription>
                Edite as informações do processo jurídico
              </DialogDescription>
            </DialogHeader>
            <ProcessoForm
              processo={processo}
              onSave={async (data) => {
                // Em produção, chamaria a API para atualizar
                toast.success("Processo atualizado com sucesso!");
                setShowEditForm(false);
                // Recarregar dados do processo
              }}
              onCancel={() => setShowEditForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
