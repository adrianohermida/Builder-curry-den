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
  Send,
  Zap,
  BookOpen,
  Calculator,
  Target,
  Users,
  Archive,
  Trash2,
  Star,
  Flag,
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
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// Hooks personalizados
import { useRegrasProcessuais } from "@/contexts/RegrasProcessuaisContext";
import { useCalculaPrazo } from "@/hooks/useCalculaPrazo";
import { useAdviseAPI } from "@/hooks/useAdviseAPI";
import { useModuleIntegration } from "@/hooks/useModuleIntegration";
import { IAAssistant } from "@/components/IA/IAAssistant";
import {
  identifyTribunal,
  validateProcessNumber,
} from "@/utils/processualUtils";

export interface PublicacaoData {
  id: string;
  numeroProcesso?: string;
  numero?: string;
  tribunal: string;
  dataPublicacao?: string;
  data?: string;
  conteudo: string;
  assunto?: string;
  tipo:
    | "intimacao"
    | "citacao"
    | "despacho"
    | "sentenca"
    | "acordao"
    | "outros"
    | "Intimação"
    | "Citação"
    | "Despacho"
    | "Sentença"
    | "Acórdão"
    | "Outros";
  partes?: string[];
  urgencia: "baixa" | "media" | "alta" | "urgente";
  status: "nao_lida" | "lida" | "processada" | "pendente" | "visualizada";
  origem?: "djen" | "domicilio_judicial" | "tribunal_local";
  metadados?: {
    segredoJustica: boolean;
    valorCausa?: number;
    classe: string;
    assunto: string;
  };
  clienteId?: string;
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
  processoVinculado?: string;
  visivelCliente?: boolean;
  observacoes?: string;
  tags?: string[];
  dataLimite?: string;
  visualizada?: boolean;
  arquivada?: boolean;
  responsavel?: string;
}

interface PublicacaoDetalhadaProps {
  publicacao: PublicacaoData;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (publicacao: PublicacaoData) => void;
}

export function PublicacaoDetalhada({
  publicacao,
  isOpen,
  onClose,
  onUpdate,
}: PublicacaoDetalhadaProps) {
  // Safety check and default values for publicacao data
  const safePublicacao = {
    ...publicacao,
    partes: publicacao.partes || [],
    tags: publicacao.tags || [],
    numeroProcesso: publicacao.numeroProcesso || publicacao.numero || "",
    dataPublicacao: publicacao.dataPublicacao || publicacao.data || "",
    assunto: publicacao.assunto || "",
    observacoes: publicacao.observacoes || "",
    visivelCliente: publicacao.visivelCliente || false,
    processoVinculado: publicacao.processoVinculado || "",
    clienteId: publicacao.clienteId || "",
  };

  const [activeTab, setActiveTab] = useState("conteudo");
  const [visivelCliente, setVisivelCliente] = useState(
    safePublicacao.visivelCliente,
  );
  const [observacoes, setObservacoes] = useState(safePublicacao.observacoes);
  const [tags, setTags] = useState(safePublicacao.tags);
  const [newTag, setNewTag] = useState("");
  const [showIAChat, setShowIAChat] = useState(false);
  const [analisandoIA, setAnalisandoIA] = useState(false);
  const [analiseIA, setAnaliseIA] = useState<any>(null);
  const [calculandoPrazo, setCalculandoPrazo] = useState(false);
  const [resultadoPrazo, setResultadoPrazo] = useState<any>(null);
  const [processoVinculado, setProcessoVinculado] = useState(
    safePublicacao.processoVinculado,
  );
  const [clienteVinculado, setClienteVinculado] = useState(
    safePublicacao.clienteId,
  );

  const { configuracao } = useRegrasProcessuais();
  const { calcularPrazo, calcularPrazoIA, criarTarefaPrazo } =
    useCalculaPrazo();
  const { marcarComoLida, processarPublicacao } = useAdviseAPI();
  const { openTicket, createCalendarTask, startIAConversation, linkToProcess } =
    useModuleIntegration();

  // Marcar como lida automaticamente ao abrir
  useEffect(() => {
    if (isOpen && publicacao.status === "nao_lida") {
      handleMarcarComoLida();
    }
  }, [isOpen]);

  // Identificar tribunal automaticamente
  const tribunalInfo = publicacao.numeroProcesso
    ? identifyTribunal(publicacao.numeroProcesso)
    : null;

  const handleMarcarComoLida = async () => {
    try {
      await marcarComoLida(publicacao.id);
      if (onUpdate) {
        onUpdate({ ...publicacao, status: "lida" });
      }
    } catch (error) {
      toast.error("Erro ao marcar como lida");
    }
  };

  const handleGerarResumoIA = async () => {
    setAnalisandoIA(true);
    try {
      // Simular análise da IA
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const analise = {
        resumo:
          "Esta publicação refere-se a uma intimação para manifestação em 15 dias úteis sobre a decisão interlocutória que deferiu a tutela antecipada.",
        acoesSugeridas: [
          "Elaborar manifestação sobre a decisão",
          "Verificar documentos necessários",
          "Criar prazo no calendário para 13 dias úteis",
        ],
        urgencia: publicacao.urgencia,
        prazoEstimado: "15 dias úteis",
        tipoManifestacao: "Manifestação sobre tutela antecipada",
        riscosIdentificados: [],
      };

      if (publicacao.urgencia === "urgente") {
        analise.riscosIdentificados.push("Prazo extremamente curto");
      }

      setAnaliseIA(analise);
      toast.success("Análise de IA concluída!");
    } catch (error) {
      toast.error("Erro na análise de IA");
    } finally {
      setAnalisandoIA(false);
    }
  };

  const handleSugerirPeticao = async () => {
    try {
      await startIAConversation({
        context: "peticao_sugerida",
        data: {
          publicacao: publicacao.conteudo,
          numeroProcesso: publicacao.numeroProcesso,
          tipo: publicacao.tipo,
          tribunal: publicacao.tribunal,
        },
      });

      toast.success("IA Jurídica iniciada para sugestão de petição");
      setShowIAChat(true);
    } catch (error) {
      toast.error("Erro ao iniciar sugestão de petição");
    }
  };

  const handleCalcularPrazo = async () => {
    setCalculandoPrazo(true);
    try {
      const parametros = {
        dataInicial: new Date(publicacao.dataPublicacao),
        tipoProcesso: configuracao.tipoProcessoPadrao,
        tipoAto: "contestacao", // Padrão, seria detectado pela IA
        origem: publicacao.origem as any,
        numeroProcesso: publicacao.numeroProcesso,
      };

      let resultado;
      if (configuracao.integracaoIA) {
        resultado = await calcularPrazoIA(parametros, publicacao.conteudo);
      } else {
        resultado = calcularPrazo(parametros);
      }

      setResultadoPrazo(resultado);
      toast.success("Prazo calculado com sucesso!");
    } catch (error) {
      toast.error("Erro ao calcular prazo");
    } finally {
      setCalculandoPrazo(false);
    }
  };

  const handleCriarTarefa = async () => {
    if (!resultadoPrazo) {
      toast.error("Calcule o prazo primeiro");
      return;
    }

    try {
      await criarTarefaPrazo(resultadoPrazo, {
        dataInicial: new Date(publicacao.dataPublicacao),
        tipoProcesso: configuracao.tipoProcessoPadrao,
        tipoAto: "contestacao",
        origem: publicacao.origem as any,
        numeroProcesso: publicacao.numeroProcesso,
      });

      await createCalendarTask({
        title: `Prazo: ${publicacao.tipo}`,
        description: `Processo: ${publicacao.numeroProcesso}`,
        dueDate: resultadoPrazo?.dataFinal,
        processNumber: publicacao.numeroProcesso,
        priority: publicacao.urgencia === "urgente" ? "high" : "medium",
      });

      toast.success("Tarefa criada no calendário!");
    } catch (error) {
      toast.error("Erro ao criar tarefa");
    }
  };

  const handleCompartilharWhatsApp = () => {
    const resumo = analiseIA
      ? `📋 *Resumo da Publicação*\n\n${analiseIA.resumo}\n\n📅 *Prazo:* ${analiseIA.prazoEstimado}\n\n📞 Entre em contato para mais detalhes.`
      : `📋 *Nova Publicação Judicial*\n\nProcesso: ${publicacao.numeroProcesso}\nTribunal: ${publicacao.tribunal}\n\n📞 Entre em contato para mais detalhes.`;

    const url = `https://wa.me/?text=${encodeURIComponent(resumo)}`;
    window.open(url, "_blank");
  };

  const handleBaixarPDF = () => {
    // Simulação de geração de PDF
    const elemento = document.createElement("a");
    const conteudo = `
      PUBLICAÇÃO JUDICIAL

      Processo: ${publicacao.numeroProcesso}
      Tribunal: ${publicacao.tribunal}
      Data: ${new Date(publicacao.dataPublicacao).toLocaleDateString("pt-BR")}
      Tipo: ${publicacao.tipo}

      CONTEÚDO:
      ${publicacao.conteudo}

      ${analiseIA ? `ANÁLISE IA:\n${analiseIA.resumo}` : ""}
    `;

    const arquivo = new Blob([conteudo], { type: "text/plain" });
    elemento.href = URL.createObjectURL(arquivo);
    elemento.download = `publicacao_${publicacao.numeroProcesso.replace(/\D/g, "")}.txt`;
    elemento.click();

    toast.success("Arquivo baixado!");
  };

  const handleCopiarTexto = () => {
    navigator.clipboard.writeText(publicacao.conteudo);
    toast.success("Texto copiado para a área de transferência!");
  };

  const handleVincularProcesso = async () => {
    if (!processoVinculado) {
      toast.error("Informe o número do processo");
      return;
    }

    try {
      await linkToProcess(publicacao.id, processoVinculado);
      if (onUpdate) {
        onUpdate({ ...publicacao, processoVinculado });
      }
      toast.success("Publicação vinculada ao processo!");
    } catch (error) {
      toast.error("Erro ao vincular processo");
    }
  };

  const handleAdicionarTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const novasTags = [...tags, newTag.trim()];
      setTags(novasTags);
      setNewTag("");

      if (onUpdate) {
        onUpdate({ ...publicacao, tags: novasTags });
      }
    }
  };

  const handleRemoverTag = (tagRemover: string) => {
    const novasTags = tags.filter((tag) => tag !== tagRemover);
    setTags(novasTags);

    if (onUpdate) {
      onUpdate({ ...publicacao, tags: novasTags });
    }
  };

  const urgenciaColors = {
    baixa: "bg-green-100 text-green-800",
    media: "bg-yellow-100 text-yellow-800",
    alta: "bg-orange-100 text-orange-800",
    urgente: "bg-red-100 text-red-800",
  };

  const urgenciaIcons = {
    baixa: CheckCircle,
    media: Clock,
    alta: AlertTriangle,
    urgente: Zap,
  };

  const UrgenciaIcon = urgenciaIcons[publicacao.urgencia];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-xl">
                Publicação Judicial -{" "}
                {publicacao.tipo.charAt(0).toUpperCase() +
                  publicacao.tipo.slice(1)}
              </DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={urgenciaColors[publicacao.urgencia]}>
                  <UrgenciaIcon className="h-3 w-3 mr-1" />
                  {publicacao.urgencia.charAt(0).toUpperCase() +
                    publicacao.urgencia.slice(1)}
                </Badge>
                <Badge variant="outline">{publicacao.tribunal}</Badge>
                <Badge variant="secondary">{publicacao.origem}</Badge>
                {publicacao.metadados?.segredoJustica && (
                  <Badge variant="destructive">
                    <Shield className="h-3 w-3 mr-1" />
                    Segredo de Justiça
                  </Badge>
                )}
                {tribunalInfo && (
                  <Badge variant="outline" className="bg-blue-50">
                    <Building className="h-3 w-3 mr-1" />
                    {tribunalInfo.sistema}
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
              <TabsTrigger value="analise">
                Análise IA
                {analiseIA && (
                  <Badge className="ml-1 h-5 w-5 rounded-full bg-green-500" />
                )}
              </TabsTrigger>
              <TabsTrigger value="acoes">Ações</TabsTrigger>
              <TabsTrigger value="integracao">Integração</TabsTrigger>
              <TabsTrigger value="cliente">Portal Cliente</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="conteudo" className="h-full overflow-hidden">
                <div className="h-full flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Gavel className="h-4 w-4" />
                          Dados do Processo
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Número:
                          </span>
                          <span className="text-sm font-mono">
                            {publicacao.numeroProcesso}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Data:
                          </span>
                          <span className="text-sm">
                            {new Date(
                              publicacao.dataPublicacao,
                            ).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Classe:
                          </span>
                          <span className="text-sm">
                            {publicacao.metadados?.classe || "N/A"}
                          </span>
                        </div>
                        {tribunalInfo && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                Sistema:
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  window.open(tribunalInfo.url, "_blank")
                                }
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Abrir {tribunalInfo.sistema}
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Partes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          {safePublicacao.partes &&
                          safePublicacao.partes.length > 0 ? (
                            safePublicacao.partes.map((parte, index) => (
                              <div key={index} className="text-sm">
                                {parte}
                              </div>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Nenhuma parte identificada
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="flex-1 overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Conteúdo da Publicação
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-full overflow-hidden">
                      <ScrollArea className="h-full">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {publicacao.conteudo}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analise" className="h-full space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Análise com Inteligência Artificial
                  </h3>
                  <Button onClick={handleGerarResumoIA} disabled={analisandoIA}>
                    {analisandoIA ? (
                      <>
                        <Bot className="h-4 w-4 mr-2 animate-spin" />
                        Analisando...
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4 mr-2" />
                        Gerar Análise
                      </>
                    )}
                  </Button>
                </div>

                {analisandoIA && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Bot className="h-5 w-5 animate-pulse" />
                          <span>Analisando publicação com IA Jurídica...</span>
                        </div>
                        <Progress value={65} className="w-full" />
                        <p className="text-sm text-muted-foreground">
                          Processando texto, identificando prazos e sugerindo
                          ações...
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {analiseIA && (
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Resumo Executivo
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">
                          {analiseIA.resumo}
                        </p>
                      </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">
                            Ações Sugeridas
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analiseIA.acoesSugeridas &&
                              analiseIA.acoesSugeridas.map(
                                (acao: string, index: number) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2 text-sm"
                                  >
                                    <Target className="h-4 w-4 mt-0.5 text-blue-500" />
                                    {acao}
                                  </li>
                                ),
                              )}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">
                            Informações Detectadas
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Prazo Estimado:
                            </span>
                            <Badge variant="outline">
                              {analiseIA.prazoEstimado}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Manifestação:
                            </span>
                            <span className="text-sm">
                              {analiseIA.tipoManifestacao}
                            </span>
                          </div>
                          {analiseIA.riscosIdentificados &&
                            analiseIA.riscosIdentificados.length > 0 && (
                              <div>
                                <span className="text-sm text-muted-foreground">
                                  Riscos:
                                </span>
                                <div className="mt-1 space-y-1">
                                  {analiseIA.riscosIdentificados.map(
                                    (risco: string, index: number) => (
                                      <Alert key={index}>
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertDescription className="text-sm">
                                          {risco}
                                        </AlertDescription>
                                      </Alert>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="acoes" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Ações Básicas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marcar como Processada
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={handleCopiarTexto}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar Texto Integral
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={handleBaixarPDF}
                      >
                        <FileDown className="h-4 w-4 mr-2" />
                        Baixar (TXT/PDF)
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">IA Jurídica</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={handleSugerirPeticao}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Sugerir Petição
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setShowIAChat(true)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Conversa com IA
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={handleGerarResumoIA}
                      >
                        <Bot className="h-4 w-4 mr-2" />
                        Gerar Resumo
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Prazos & Agenda</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={handleCalcularPrazo}
                        disabled={calculandoPrazo}
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        {calculandoPrazo ? "Calculando..." : "Calcular Prazo"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={handleCriarTarefa}
                        disabled={!resultadoPrazo}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Criar Tarefa
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Configurar Lembrete
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">
                        Compartilhamento
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={handleCompartilharWhatsApp}
                      >
                        <Smartphone className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        E-mail
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Telegram
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Intermodular</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Criar Ticket
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <Archive className="h-4 w-4 mr-2" />
                        Arquivar no GED
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Estudo de Caso IA
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Organização</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Favoritar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <Flag className="h-4 w-4 mr-2" />
                        Marcar Follow-up
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {resultadoPrazo && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Resultado do Cálculo de Prazo
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm text-muted-foreground">
                            Data Final
                          </Label>
                          <p className="font-semibold">
                            {resultadoPrazo.dataFinal.toLocaleDateString(
                              "pt-BR",
                            )}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">
                            Dias Corridos
                          </Label>
                          <p className="font-semibold">
                            {resultadoPrazo.diasCorridos} dias
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">
                            Regra Aplicada
                          </Label>
                          <p className="font-semibold">
                            {resultadoPrazo.regra}
                          </p>
                        </div>
                      </div>
                      {resultadoPrazo?.observacoes &&
                        resultadoPrazo.observacoes.length > 0 && (
                          <div>
                            <Label className="text-sm text-muted-foreground">
                              Observações
                            </Label>
                            <ul className="text-sm space-y-1 mt-1">
                              {resultadoPrazo.observacoes.map(
                                (obs: string, index: number) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-1"
                                  >
                                    <span className="text-blue-500">•</span>
                                    {obs}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="integracao" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Vinculação de Processo
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="processo-vinculado">
                          Número do Processo
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="processo-vinculado"
                            placeholder="0000000-00.0000.0.00.0000"
                            value={processoVinculado}
                            onChange={(e) =>
                              setProcessoVinculado(e.target.value)
                            }
                          />
                          <Button onClick={handleVincularProcesso}>
                            <Link className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {publicacao.processoVinculado && (
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            Vinculado ao processo:{" "}
                            <strong>{publicacao.processoVinculado}</strong>
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Cliente Relacionado
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cliente-vinculado">Cliente</Label>
                        <Select
                          value={clienteVinculado}
                          onValueChange={setClienteVinculado}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar cliente" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cliente1">João Silva</SelectItem>
                            <SelectItem value="cliente2">
                              Maria Santos
                            </SelectItem>
                            <SelectItem value="cliente3">
                              Empresa ABC Ltda
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Tags e Organização
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Nova tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleAdicionarTag()
                            }
                          />
                          <Button size="sm" onClick={handleAdicionarTag}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {tags &&
                            tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="cursor-pointer"
                              >
                                {tag}
                                <X
                                  className="h-3 w-3 ml-1"
                                  onClick={() => handleRemoverTag(tag)}
                                />
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Observações</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Adicione observações sobre esta publicação..."
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        rows={4}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="cliente" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Visibilidade para Cliente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="visivel-cliente">
                          Tornar visível para o cliente
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          O cliente poderá visualizar esta publicação no portal
                        </p>
                      </div>
                      <Switch
                        id="visivel-cliente"
                        checked={visivelCliente}
                        onCheckedChange={setVisivelCliente}
                      />
                    </div>

                    {visivelCliente && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-4 border-t pt-4"
                      >
                        <Alert>
                          <Globe className="h-4 w-4" />
                          <AlertDescription>
                            Esta publicação será exibida no portal do cliente
                            com acesso controlado.
                          </AlertDescription>
                        </Alert>

                        <div className="space-y-3">
                          <h4 className="font-medium">Opções de Notificação</h4>

                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={handleCompartilharWhatsApp}
                          >
                            <Smartphone className="h-4 w-4 mr-2" />
                            Enviar por WhatsApp
                          </Button>

                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Enviar por E-mail
                          </Button>

                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Gerar Link de Compartilhamento
                          </Button>
                        </div>

                        <div className="p-3 bg-muted rounded-lg">
                          <h5 className="font-medium text-sm mb-2">
                            Prévia da Mensagem:
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            "📋 Prezado cliente, há uma nova publicação
                            disponível referente ao processo{" "}
                            {publicacao.numeroProcesso}.
                            {analiseIA &&
                              ` ${analiseIA.resumo.substring(0, 100)}...`}
                            Acesse o portal para mais detalhes."
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Chat IA Modal */}
        <AnimatePresence>
          {showIAChat && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowIAChat(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-background rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="border-b p-4 flex justify-between items-center">
                  <h3 className="font-semibold">
                    IA Jurídica - Análise da Publicação
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowIAChat(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="h-96">
                  <IAAssistant
                    initialContext={{
                      type: "publicacao_analysis",
                      data: {
                        numeroProcesso: publicacao.numeroProcesso,
                        conteudo: publicacao.conteudo,
                        tipo: publicacao.tipo,
                        tribunal: publicacao.tribunal,
                      },
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
