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
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
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
}

interface MovimentacaoProcesso {
  id: string;
  data: Date;
  tipo: "audiencia" | "decisao" | "peticao" | "recurso" | "sentenca" | "outros";
  descricao: string;
  responsavel: string;
  arquivo?: string;
  observacoes?: string;
}

interface AnotacaoProcesso {
  id: string;
  data: Date;
  usuario: string;
  texto: string;
  tipo: "observacao" | "lembrete" | "tarefa";
  prioridade: "baixa" | "media" | "alta";
}

export default function ProcessoDetalhes() {
  const { id } = useParams<{ id: string }>();
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
    },
  ];

  const movimentacoes: MovimentacaoProcesso[] = [
    {
      id: "mov-001",
      data: new Date("2024-01-26"),
      tipo: "decisao",
      descricao: "Deferimento de liminar",
      responsavel: "Juiz Dr. Carlos Mendes",
      arquivo: "decisao_liminar.pdf",
    },
    {
      id: "mov-002",
      data: new Date("2024-01-22"),
      tipo: "audiencia",
      descricao: "Audiência de conciliação designada",
      responsavel: "Cartório da 1ª Vara",
      observacoes: "Audiência marcada para 15/02/2024 às 14:00h",
    },
    {
      id: "mov-003",
      data: new Date("2024-01-20"),
      tipo: "peticao",
      descricao: "Juntada de contestação",
      responsavel: "Advogado da parte contrária",
    },
  ];

  const anotacoes: AnotacaoProcesso[] = [
    {
      id: "ant-001",
      data: new Date("2024-01-26"),
      usuario: "Dr. Pedro Santos",
      texto:
        "Cliente informou sobre documentos adicionais que serão enviados até amanhã",
      tipo: "observacao",
      prioridade: "media",
    },
    {
      id: "ant-002",
      data: new Date("2024-01-25"),
      usuario: "Dra. Ana Costa",
      texto: "Lembrar de preparar quesitos para perícia técnica",
      tipo: "lembrete",
      prioridade: "alta",
    },
  ];

  useEffect(() => {
    if (id) {
      const processoData = obterProcesso(id);
      setProcesso(processoData || null);
      setLoading(false);
    }
  }, [id, obterProcesso]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!processo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Processo não encontrado
          </h2>
          <p className="text-gray-600 mb-4">
            O processo solicitado não existe ou foi removido.
          </p>
          <Button onClick={() => navigate("/crm")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao CRM
          </Button>
        </div>
      </div>
    );
  }

  const cliente = obterCliente(processo.clienteId);

  const getStatusColor = (status: string) => {
    const colors = {
      ativo: "bg-blue-100 text-blue-800 border-blue-200",
      suspenso: "bg-yellow-100 text-yellow-800 border-yellow-200",
      arquivado: "bg-gray-100 text-gray-800 border-gray-200",
      encerrado: "bg-green-100 text-green-800 border-green-200",
    };
    return colors[status as keyof typeof colors] || colors.ativo;
  };

  const getRiscoColor = (risco: string) => {
    const colors = {
      baixo: "text-green-600",
      medio: "text-yellow-600",
      alto: "text-red-600",
    };
    return colors[risco as keyof typeof colors] || colors.baixo;
  };

  const getRiscoIcon = (risco: string) => {
    if (risco === "alto") return <AlertTriangle className="h-4 w-4" />;
    if (risco === "medio") return <Clock className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const getDocumentIcon = (tipo: string) => {
    const icons = {
      inicial: <FileText className="h-4 w-4 text-blue-600" />,
      contestacao: <BookOpen className="h-4 w-4 text-orange-600" />,
      sentenca: <Gavel className="h-4 w-4 text-green-600" />,
      recurso: <TrendingUp className="h-4 w-4 text-purple-600" />,
      outros: <Paperclip className="h-4 w-4 text-gray-600" />,
    };
    return icons[tipo as keyof typeof icons] || icons.outros;
  };

  const getMovimentacaoIcon = (tipo: string) => {
    const icons = {
      audiencia: <Calendar className="h-4 w-4 text-blue-600" />,
      decisao: <Gavel className="h-4 w-4 text-green-600" />,
      peticao: <FileText className="h-4 w-4 text-orange-600" />,
      recurso: <TrendingUp className="h-4 w-4 text-purple-600" />,
      sentenca: <CheckCircle className="h-4 w-4 text-green-600" />,
      outros: <Activity className="h-4 w-4 text-gray-600" />,
    };
    return icons[tipo as keyof typeof icons] || icons.outros;
  };

  const addNote = () => {
    if (newNote.trim()) {
      // Aqui você adicionaria a anotação via API
      toast.success("Anotação adicionada com sucesso!");
      setNewNote("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/crm")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Scale className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>

                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {processo.numero}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {processo.assunto}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(processo.status)}>
                {processo.status}
              </Badge>

              <div
                className={`flex items-center gap-1 ${getRiscoColor(processo.risco)}`}
              >
                {getRiscoIcon(processo.risco)}
                <span className="text-sm font-medium capitalize">
                  {processo.risco}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowEditForm(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Processo
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Bell className="h-4 w-4 mr-2" />
                    Configurar Alertas
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <X className="h-4 w-4 mr-2" />
                    Arquivar Processo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
            <TabsTrigger value="anotacoes">Anotações</TabsTrigger>
            <TabsTrigger value="cronologia">Cronologia</TabsTrigger>
          </TabsList>

          <TabsContent value="resumo" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Informações principais */}
              <div className="lg:col-span-2 space-y-6">
                {/* Dados do processo */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5" />
                      Dados do Processo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Número
                        </span>
                        <p className="text-sm font-mono">{processo.numero}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Área
                        </span>
                        <p className="text-sm">{processo.area}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Tribunal
                        </span>
                        <p className="text-sm">{processo.tribunal}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Vara
                        </span>
                        <p className="text-sm">{processo.vara}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Data de Início
                        </span>
                        <p className="text-sm">
                          {new Intl.DateTimeFormat("pt-BR").format(
                            processo.dataInicio,
                          )}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Responsável
                        </span>
                        <p className="text-sm">{processo.responsavel}</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Assunto
                      </span>
                      <p className="text-sm mt-1">{processo.assunto}</p>
                    </div>

                    {processo.observacoes && (
                      <>
                        <Separator />
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Observações
                          </span>
                          <p className="text-sm mt-1">{processo.observacoes}</p>
                        </div>
                      </>
                    )}

                    {processo.tags.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Tags
                          </span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {processo.tags.map((tag) => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Valores financeiros */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Valores Financeiros
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 mb-1">
                          Valor dos Honorários
                        </p>
                        <p className="text-xl font-bold text-green-600">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(processo.valor)}
                        </p>
                      </div>

                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 mb-1">
                          Valor da Causa
                        </p>
                        <p className="text-xl font-bold text-blue-600">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(processo.valor * 3)}
                        </p>
                      </div>

                      <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <Activity className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 mb-1">
                          Custas Processuais
                        </p>
                        <p className="text-xl font-bold text-orange-600">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(processo.valor * 0.1)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Informações do cliente */}
                {cliente && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Cliente
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {cliente.nome
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{cliente.nome}</p>
                          <p className="text-sm text-gray-500">
                            {cliente.documento}
                          </p>
                        </div>
                        <Badge variant="outline">{cliente.tipo}</Badge>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <a
                            href={`mailto:${cliente.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {cliente.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <a
                            href={`tel:${cliente.telefone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {cliente.telefone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {cliente.endereco.cidade}, {cliente.endereco.uf}
                          </span>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Valor Total:</span>
                          <span className="font-medium text-green-600">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(cliente.valorTotal)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Responsável:</span>
                          <span className="font-medium">
                            {cliente.responsavel}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        asChild
                      >
                        <Link to={`/crm/clientes/${cliente.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Perfil do Cliente
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Próximas ações */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Próximas Ações
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {processo.proximaAudiencia && (
                      <Alert>
                        <Calendar className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Próxima Audiência:</strong>
                          <br />
                          {new Intl.DateTimeFormat("pt-BR", {
                            dateStyle: "long",
                            timeStyle: "short",
                          }).format(processo.proximaAudiencia)}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Preparar quesitos</span>
                        <Badge variant="secondary" className="text-xs">
                          2 dias
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          Revisar documentos
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          5 dias
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Contatar perito</span>
                        <Badge variant="secondary" className="text-xs">
                          1 semana
                        </Badge>
                      </div>
                    </div>

                    <Button size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Tarefa
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Ações Rápidas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Agendar Audiência
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Nova Petição
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Documento
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contatar Cliente
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documentos" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Documentos do Processo</h3>
              <Button onClick={() => setShowDocumentDialog(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Documento
              </Button>
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
                        {getDocumentIcon(doc.tipo)}
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{doc.nome}</h4>
                          <p className="text-xs text-gray-500 capitalize">
                            {doc.tipo}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          doc.status === "aprovado"
                            ? "default"
                            : doc.status === "pendente"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {doc.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>Tamanho:</span>
                        <span>{doc.tamanho}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Upload:</span>
                        <span>
                          {new Intl.DateTimeFormat("pt-BR").format(
                            doc.dataUpload,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Por:</span>
                        <span>{doc.uploadedBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Versão:</span>
                        <span>v{doc.versao}</span>
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="h-3 w-3 mr-1" />
                        Baixar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {documentos.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum documento
                </h3>
                <p className="text-gray-600 mb-4">
                  Faça upload dos documentos relacionados ao processo.
                </p>
                <Button onClick={() => setShowDocumentDialog(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Primeiro Documento
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="movimentacoes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Movimentações Processuais
              </h3>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar Histórico
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {movimentacoes.map((mov, index) => (
                    <div
                      key={mov.id}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {getMovimentacaoIcon(mov.tipo)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">
                                {mov.descricao}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {mov.responsavel}
                              </p>
                              {mov.observacoes && (
                                <p className="text-xs text-gray-600 mt-2 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                  {mov.observacoes}
                                </p>
                              )}
                            </div>

                            <div className="text-right">
                              <p className="text-xs text-gray-500">
                                {new Intl.DateTimeFormat("pt-BR", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                }).format(mov.data)}
                              </p>
                              <Badge
                                variant="outline"
                                className="mt-1 text-xs capitalize"
                              >
                                {mov.tipo}
                              </Badge>
                            </div>
                          </div>

                          {mov.arquivo && (
                            <div className="mt-3">
                              <Button variant="outline" size="sm">
                                <Paperclip className="h-3 w-3 mr-1" />
                                {mov.arquivo}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {movimentacoes.length === 0 && (
              <div className="text-center py-12">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma movimentação
                </h3>
                <p className="text-gray-600">
                  As movimentações do processo aparecerão aqui conforme forem
                  registradas.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="anotacoes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Anotações e Lembretes</h3>
            </div>

            {/* Adicionar nova anotação */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Nova Anotação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Digite sua anotação ou lembrete..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Observação</Badge>
                    <Badge variant="outline">Prioridade Média</Badge>
                  </div>
                  <Button onClick={addNote} disabled={!newNote.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista de anotações */}
            <div className="space-y-4">
              {anotacoes.map((anotacao) => (
                <Card key={anotacao.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {anotacao.usuario
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {anotacao.usuario}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Intl.DateTimeFormat("pt-BR", {
                              dateStyle: "short",
                              timeStyle: "short",
                            }).format(anotacao.data)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            anotacao.tipo === "lembrete" ? "default" : "outline"
                          }
                          className="text-xs capitalize"
                        >
                          {anotacao.tipo}
                        </Badge>
                        <Badge
                          variant={
                            anotacao.prioridade === "alta"
                              ? "destructive"
                              : anotacao.prioridade === "media"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs capitalize"
                        >
                          {anotacao.prioridade}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {anotacao.texto}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {anotacoes.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma anotação
                </h3>
                <p className="text-gray-600">
                  Adicione anotações para manter um histórico das observações do
                  processo.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="cronologia" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Cronologia Completa</h3>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar Timeline
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                  <div className="space-y-6">
                    {/* Timeline items combinando movimentações e anotações */}
                    {[...movimentacoes, ...anotacoes]
                      .sort((a, b) => b.data.getTime() - a.data.getTime())
                      .map((item, index) => (
                        <div
                          key={`timeline-${index}`}
                          className="relative flex items-start gap-4"
                        >
                          <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-full">
                            {"tipo" in item ? (
                              getMovimentacaoIcon(item.tipo)
                            ) : (
                              <MessageSquare className="h-4 w-4 text-blue-600" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0 pb-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">
                                  {"descricao" in item
                                    ? item.descricao
                                    : `Anotação: ${item.texto.substring(0, 50)}...`}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">
                                  {"responsavel" in item
                                    ? item.responsavel
                                    : item.usuario}
                                </p>
                                {"observacoes" in item && item.observacoes && (
                                  <p className="text-xs text-gray-600 mt-2 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                    {item.observacoes}
                                  </p>
                                )}
                                {"texto" in item && (
                                  <p className="text-xs text-gray-600 mt-2">
                                    {item.texto}
                                  </p>
                                )}
                              </div>

                              <div className="text-right">
                                <p className="text-xs text-gray-500">
                                  {new Intl.DateTimeFormat("pt-BR", {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                  }).format(item.data)}
                                </p>
                                <Badge
                                  variant="outline"
                                  className="mt-1 text-xs"
                                >
                                  {"tipo" in item ? item.tipo : "anotacao"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Form de edição */}
      {showEditForm && (
        <ProcessoForm
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
          processo={processo}
        />
      )}

      {/* Dialog de upload de documento */}
      <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload de Documento</DialogTitle>
            <DialogDescription>
              Faça upload de um documento relacionado ao processo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Arraste um arquivo aqui ou clique para selecionar
              </p>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Selecionar Arquivo
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setShowDocumentDialog(false)}
              >
                Cancelar
              </Button>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Fazer Upload
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
