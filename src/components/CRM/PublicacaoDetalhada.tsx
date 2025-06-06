import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Eye,
  EyeOff,
  Bot,
  FileText,
  Calendar,
  MessageCircle,
  Copy,
  Share2,
  Download,
  ExternalLink,
  Gavel,
  Building,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  Plus,
  Link,
  Smartphone,
  Mail,
  MessageSquare,
  FileDown,
  Settings,
  Shield,
  Globe,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useProcessualIntelligence,
  PublicacaoData,
} from "@/hooks/useProcessualIntelligence";
import { useModuleIntegration } from "@/hooks/useModuleIntegration";
import { IAAssistant } from "@/components/IA/IAAssistant";
import { generateWhatsAppMessage } from "@/utils/processualUtils";

interface PublicacaoDetalhadaProps {
  isOpen: boolean;
  onClose: () => void;
  publicacao: PublicacaoData | null;
  onUpdate?: (publicacao: PublicacaoData) => void;
}

export function PublicacaoDetalhada({
  isOpen,
  onClose,
  publicacao,
  onUpdate,
}: PublicacaoDetalhadaProps) {
  const [isRead, setIsRead] = useState(false);
  const [isVisibleToClient, setIsVisibleToClient] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<string>("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [activeTab, setActiveTab] = useState("content");

  const {
    analysis,
    loading: iaLoading,
    analyzePublication,
    generatePetitionSuggestion,
  } = useProcessualIntelligence();
  const {
    loading: moduleLoading,
    executeAction,
    createTaskFromPublication,
    createTicketFromPublication,
    createAIContextFromPublication,
  } = useModuleIntegration();

  useEffect(() => {
    if (publicacao) {
      setIsRead(publicacao.lida);
      setIsVisibleToClient(publicacao.visivel_cliente);
      setWhatsappMessage(generateWhatsAppMessage(publicacao));

      // Analisar automaticamente a publicação
      analyzePublication(publicacao);
    }
  }, [publicacao, analyzePublication]);

  if (!publicacao) return null;

  const handleMarkAsRead = async () => {
    const newStatus = !isRead;
    setIsRead(newStatus);

    const updatedPublicacao = { ...publicacao, lida: newStatus };
    onUpdate?.(updatedPublicacao);

    toast.success(
      newStatus
        ? "Publicação marcada como lida"
        : "Publicação marcada como não lida",
    );
  };

  const handleVisibilityToggle = async () => {
    const newVisibility = !isVisibleToClient;
    setIsVisibleToClient(newVisibility);

    const updatedPublicacao = { ...publicacao, visivel_cliente: newVisibility };
    onUpdate?.(updatedPublicacao);

    toast.success(
      newVisibility
        ? "Publicação visível no Portal do Cliente"
        : "Publicação oculta do Portal do Cliente",
    );
  };

  const handleGenerateAISummary = async () => {
    try {
      await analyzePublication(publicacao);
      setActiveTab("analysis");
      toast.success("Resumo gerado com sucesso");
    } catch (error) {
      toast.error("Erro ao gerar resumo");
    }
  };

  const handleGeneratePetition = async () => {
    try {
      const petition = await generatePetitionSuggestion(publicacao);
      // Aqui você poderia abrir um modal com a petição ou redirecionar para um editor
      toast.success("Sugestão de petição gerada");
      console.log("Petição:", petition);
    } catch (error) {
      toast.error("Erro ao gerar petição");
    }
  };

  const handleCreateTask = async () => {
    try {
      const taskData = createTaskFromPublication(
        publicacao,
        analysis?.urgency || "MEDIA",
      );
      await executeAction({
        type: "CREATE_TASK",
        module: "AGENDA",
        data: taskData,
        source: "publicacao",
      });
    } catch (error) {
      toast.error("Erro ao criar tarefa");
    }
  };

  const handleOpenTicket = async () => {
    try {
      const ticketData = createTicketFromPublication(
        publicacao,
        "Cliente Exemplo",
      );
      await executeAction({
        type: "OPEN_TICKET",
        module: "ATENDIMENTO",
        data: ticketData,
        source: "publicacao",
      });
    } catch (error) {
      toast.error("Erro ao abrir ticket");
    }
  };

  const handleStartAIChat = () => {
    setAiAssistantOpen(true);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(publicacao.conteudo);
    toast.success("Texto copiado para a área de transferência");
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Nova publicação: ${publicacao.titulo}`;

    switch (platform) {
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`,
        );
        break;
      case "telegram":
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        );
        break;
      case "email":
        window.open(
          `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(publicacao.conteudo)}`,
        );
        break;
      default:
        navigator.clipboard.writeText(url);
        toast.success("Link copiado para a área de transferência");
    }
  };

  const handleDownload = (format: string) => {
    const content = `${publicacao.titulo}\n\n${publicacao.conteudo}`;
    let blob: Blob;
    let filename: string;

    switch (format) {
      case "pdf":
        // Simular geração de PDF
        toast.info("Gerando PDF... (funcionalidade em desenvolvimento)");
        return;
      case "txt":
        blob = new Blob([content], { type: "text/plain" });
        filename = `publicacao-${publicacao.id}.txt`;
        break;
      case "csv":
        const csvContent = `"Título","Data","Tribunal","Tipo","Conteúdo"\n"${publicacao.titulo}","${publicacao.data}","${publicacao.tribunal}","${publicacao.tipo}","${publicacao.conteudo.replace(/"/g, '""')}"`;
        blob = new Blob([csvContent], { type: "text/csv" });
        filename = `publicacao-${publicacao.id}.csv`;
        break;
      default:
        return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Arquivo ${format.toUpperCase()} baixado com sucesso`);
  };

  const handleAccessTribunal = () => {
    if (analysis?.tribunalLink) {
      window.open(analysis.tribunalLink, "_blank");
    } else {
      toast.error("Link do tribunal não disponível");
    }
  };

  const handleSendWhatsApp = () => {
    if (isVisibleToClient) {
      window.open(`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`);
    } else {
      toast.error("Publicação deve estar visível no Portal do Cliente");
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "CRITICA":
        return "bg-red-500";
      case "ALTA":
        return "bg-orange-500";
      case "MEDIA":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "CRITICA":
        return <AlertTriangle className="h-4 w-4" />;
      case "ALTA":
        return <Clock className="h-4 w-4" />;
      case "MEDIA":
        return <Eye className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-[rgb(var(--theme-primary))]" />
                  <DialogTitle className="text-xl font-semibold">
                    {publicacao.titulo}
                  </DialogTitle>
                </div>
                {analysis && (
                  <Badge
                    variant="secondary"
                    className={`${getUrgencyColor(analysis.urgency)} text-white`}
                  >
                    {getUrgencyIcon(analysis.urgency)}
                    <span className="ml-1">{analysis.urgency}</span>
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={isRead ? "default" : "outline"}
                  size="sm"
                  onClick={handleMarkAsRead}
                >
                  {isRead ? (
                    <EyeOff className="h-4 w-4 mr-2" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  {isRead ? "Marcar como Não Lida" : "Marcar como Lida"}
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="h-full"
            >
              <div className="border-b px-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="content">Conteúdo</TabsTrigger>
                  <TabsTrigger value="analysis">Análise IA</TabsTrigger>
                  <TabsTrigger value="actions">Ações</TabsTrigger>
                  <TabsTrigger value="integration">Integração</TabsTrigger>
                  <TabsTrigger value="client">Portal Cliente</TabsTrigger>
                </TabsList>
              </div>

              <div className="px-6 py-4 h-[calc(90vh-200px)]">
                <TabsContent value="content" className="mt-0 h-full">
                  <ScrollArea className="h-full">
                    <div className="space-y-6">
                      {/* Informações Principais */}
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                              Informações da Publicação
                            </CardTitle>
                            {analysis?.tribunal && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleAccessTribunal}
                                disabled={!analysis.tribunalLink}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Acessar {analysis.tribunal.sistema}
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">
                                Tribunal
                              </Label>
                              <p className="font-medium">
                                {publicacao.tribunal}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">
                                Data
                              </Label>
                              <p className="font-medium">
                                {new Date(publicacao.data).toLocaleDateString(
                                  "pt-BR",
                                )}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">
                                Tipo
                              </Label>
                              <p className="font-medium">{publicacao.tipo}</p>
                            </div>
                            {publicacao.numeroProcesso && (
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                  Processo
                                </Label>
                                <p className="font-medium font-mono">
                                  {publicacao.numeroProcesso}
                                </p>
                              </div>
                            )}
                          </div>

                          {analysis?.processNumbers &&
                            analysis.processNumbers.length > 0 && (
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                  Processos Identificados
                                </Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {analysis.processNumbers.map(
                                    (numero, index) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="font-mono"
                                      >
                                        {numero}
                                      </Badge>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                        </CardContent>
                      </Card>

                      {/* Conteúdo Completo */}
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                              Conteúdo Completo
                            </CardTitle>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCopyText}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copiar
                              </Button>
                              <Select onValueChange={handleDownload}>
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Baixar" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pdf">PDF</SelectItem>
                                  <SelectItem value="txt">TXT</SelectItem>
                                  <SelectItem value="csv">CSV</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="p-4 bg-muted rounded-lg">
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">
                              {publicacao.conteudo}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="analysis" className="mt-0 h-full">
                  <ScrollArea className="h-full">
                    <div className="space-y-6">
                      {iaLoading ? (
                        <Card>
                          <CardContent className="flex items-center justify-center py-12">
                            <div className="text-center">
                              <Bot className="h-12 w-12 mx-auto mb-4 animate-pulse text-[rgb(var(--theme-primary))]" />
                              <p className="text-lg font-medium">
                                Analisando publicação...
                              </p>
                              <p className="text-sm text-muted-foreground">
                                IA processando informações
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ) : analysis ? (
                        <>
                          {/* Resumo IA */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <Bot className="h-5 w-5 mr-2 text-[rgb(var(--theme-primary))]" />
                                Resumo Automático
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="prose prose-sm max-w-none">
                                <div className="whitespace-pre-wrap">
                                  {analysis.aiSummary}
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Ações Sugeridas */}
                          {analysis.suggestedActions.length > 0 && (
                            <Card>
                              <CardHeader>
                                <CardTitle>Ações Recomendadas</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  {analysis.suggestedActions.map(
                                    (action, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center space-x-2"
                                      >
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">
                                          {action}
                                        </span>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* Informações do Tribunal */}
                          {analysis.tribunal && (
                            <Card>
                              <CardHeader>
                                <CardTitle>
                                  Sistema Processual Identificado
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                      Tribunal
                                    </Label>
                                    <p className="font-medium">
                                      {analysis.tribunal.nome}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                      Sistema
                                    </Label>
                                    <p className="font-medium">
                                      {analysis.tribunal.sistema}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                      Tipo
                                    </Label>
                                    <p className="font-medium">
                                      {analysis.tribunal.tipo}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                      Código
                                    </Label>
                                    <p className="font-medium">
                                      {analysis.tribunal.codigo}
                                    </p>
                                  </div>
                                </div>

                                {analysis.tribunalLink && (
                                  <Button
                                    onClick={handleAccessTribunal}
                                    className="w-full"
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Acessar Processo no{" "}
                                    {analysis.tribunal.sistema}
                                  </Button>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </>
                      ) : (
                        <Card>
                          <CardContent className="flex items-center justify-center py-12">
                            <div className="text-center">
                              <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                              <p className="text-lg font-medium">
                                Análise não disponível
                              </p>
                              <Button
                                onClick={handleGenerateAISummary}
                                className="mt-4"
                              >
                                <Bot className="h-4 w-4 mr-2" />
                                Gerar Análise
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="actions" className="mt-0 h-full">
                  <ScrollArea className="h-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Ações da IA */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Bot className="h-5 w-5 mr-2 text-[rgb(var(--theme-primary))]" />
                            Inteligência Artificial
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button
                            onClick={handleGenerateAISummary}
                            className="w-full justify-start"
                            variant="outline"
                            disabled={iaLoading}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Gerar Resumo com IA
                          </Button>
                          <Button
                            onClick={handleGeneratePetition}
                            className="w-full justify-start"
                            variant="outline"
                            disabled={iaLoading}
                          >
                            <Gavel className="h-4 w-4 mr-2" />
                            Sugerir Petição
                          </Button>
                          <Button
                            onClick={handleStartAIChat}
                            className="w-full justify-start"
                            variant="outline"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Conversar com IA
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Ações de Organização */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-[rgb(var(--theme-primary))]" />
                            Organização
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button
                            onClick={handleCreateTask}
                            className="w-full justify-start"
                            variant="outline"
                            disabled={moduleLoading}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Criar Tarefa
                          </Button>
                          <Button
                            onClick={handleOpenTicket}
                            className="w-full justify-start"
                            variant="outline"
                            disabled={moduleLoading}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Abrir Atendimento
                          </Button>
                          <Button
                            onClick={() =>
                              toast.info("Funcionalidade em desenvolvimento")
                            }
                            className="w-full justify-start"
                            variant="outline"
                          >
                            <Link className="h-4 w-4 mr-2" />
                            Vincular a Processo
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Ações de Compartilhamento */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Share2 className="h-5 w-5 mr-2 text-[rgb(var(--theme-primary))]" />
                            Compartilhamento
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button
                            onClick={() => handleShare("whatsapp")}
                            className="w-full justify-start"
                            variant="outline"
                          >
                            <Smartphone className="h-4 w-4 mr-2" />
                            WhatsApp
                          </Button>
                          <Button
                            onClick={() => handleShare("telegram")}
                            className="w-full justify-start"
                            variant="outline"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Telegram
                          </Button>
                          <Button
                            onClick={() => handleShare("email")}
                            className="w-full justify-start"
                            variant="outline"
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            E-mail
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Ações de Download */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Download className="h-5 w-5 mr-2 text-[rgb(var(--theme-primary))]" />
                            Download
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button
                            onClick={() => handleDownload("pdf")}
                            className="w-full justify-start"
                            variant="outline"
                          >
                            <FileDown className="h-4 w-4 mr-2" />
                            Baixar PDF
                          </Button>
                          <Button
                            onClick={() => handleDownload("txt")}
                            className="w-full justify-start"
                            variant="outline"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Baixar TXT
                          </Button>
                          <Button
                            onClick={() => handleDownload("csv")}
                            className="w-full justify-start"
                            variant="outline"
                          >
                            <FileDown className="h-4 w-4 mr-2" />
                            Baixar CSV
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="integration" className="mt-0 h-full">
                  <ScrollArea className="h-full">
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Vinculação a Processo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor="process-select">
                              Processo Existente
                            </Label>
                            <Select
                              value={selectedProcess}
                              onValueChange={setSelectedProcess}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecionar processo existente..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">
                                  + Criar novo processo
                                </SelectItem>
                                <SelectItem value="proc1">
                                  0001234-56.2024.8.26.0001
                                </SelectItem>
                                <SelectItem value="proc2">
                                  0007890-12.2024.8.26.0002
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              onClick={() =>
                                toast.info("Processo vinculado com sucesso")
                              }
                              disabled={!selectedProcess}
                              className="flex-1"
                            >
                              <Link className="h-4 w-4 mr-2" />
                              Vincular Processo
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() =>
                                toast.info("Funcionalidade em desenvolvimento")
                              }
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Novo Processo
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Inclusão em Estudos de Caso</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              Esta publicação pode ser incluída nos estudos de
                              caso da IA Jurídica para melhorar as análises
                              futuras.
                            </p>
                            <Button
                              onClick={() =>
                                toast.success(
                                  "Publicação incluída nos estudos de caso",
                                )
                              }
                              variant="outline"
                              className="w-full"
                            >
                              <Bot className="h-4 w-4 mr-2" />
                              Incluir na IA Jurídica
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="client" className="mt-0 h-full">
                  <ScrollArea className="h-full">
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Globe className="h-5 w-5 mr-2 text-[rgb(var(--theme-primary))]" />
                            Portal do Cliente
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label
                                htmlFor="client-visibility"
                                className="text-base font-medium"
                              >
                                Visível no Portal do Cliente
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Esta publicação será exibida para o cliente no
                                portal
                              </p>
                            </div>
                            <Switch
                              id="client-visibility"
                              checked={isVisibleToClient}
                              onCheckedChange={handleVisibilityToggle}
                            />
                          </div>

                          <Separator />

                          {isVisibleToClient ? (
                            <div className="space-y-4">
                              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                                <div className="flex items-center space-x-2 mb-2">
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                  <h4 className="font-medium text-green-800 dark:text-green-200">
                                    Visível para o Cliente
                                  </h4>
                                </div>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                  Esta publicação será exibida no portal do
                                  cliente e ele receberá uma notificação
                                  automática.
                                </p>
                              </div>

                              <div>
                                <Label htmlFor="whatsapp-message">
                                  Mensagem para WhatsApp
                                </Label>
                                <Textarea
                                  id="whatsapp-message"
                                  value={whatsappMessage}
                                  onChange={(e) =>
                                    setWhatsappMessage(e.target.value)
                                  }
                                  rows={8}
                                  className="mt-2"
                                />
                              </div>

                              <Button
                                onClick={handleSendWhatsApp}
                                className="w-full"
                              >
                                <Smartphone className="h-4 w-4 mr-2" />
                                Enviar via WhatsApp
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Shield className="h-5 w-5 text-yellow-600" />
                                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                                    Uso Interno
                                  </h4>
                                </div>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                  Esta publicação está marcada para uso interno
                                  e não será visível no portal do cliente.
                                </p>
                              </div>

                              <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-4">
                                  Ative a visibilidade para permitir que o
                                  cliente veja esta publicação
                                </p>
                                <Button
                                  onClick={handleVisibilityToggle}
                                  variant="outline"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Tornar Visível
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Histórico de Visualizações</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span>
                                Advogado Silva - Primeira visualização
                              </span>
                              <span className="text-muted-foreground">
                                Hoje, 14:30
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Sistema - Publicação recebida</span>
                              <span className="text-muted-foreground">
                                Hoje, 09:15
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      <IAAssistant
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
        context={{
          type: "PUBLICACAO_ANALYSIS",
          entityId: publicacao.id,
          entityData: { ...publicacao, urgency: analysis?.urgency },
        }}
        initialMessage={
          createAIContextFromPublication(publicacao).initialMessage
        }
      />
    </>
  );
}
