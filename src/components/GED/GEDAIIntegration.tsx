import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  FileText,
  MessageSquare,
  Zap,
  Sparkles,
  Eye,
  Download,
  Share,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Search,
  Filter,
  Tag,
  Calendar,
  Users,
  Scale,
  Gavel,
  FileSearch,
  Bot,
  ArrowRight,
  Loader2,
  Star,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileItem } from "./FileContextMenu";

interface AIAnalysisResult {
  id: string;
  documentId: string;
  documentName: string;
  analysisType:
    | "summary"
    | "classification"
    | "deadlines"
    | "risks"
    | "suggestions";
  result: {
    summary?: string;
    classification?: {
      type: string;
      confidence: number;
      categories: string[];
    };
    deadlines?: {
      description: string;
      date: string;
      priority: "baixa" | "media" | "alta" | "critica";
      actions: string[];
    }[];
    risks?: {
      level: "baixo" | "medio" | "alto" | "critico";
      description: string;
      recommendations: string[];
    }[];
    suggestions?: {
      type: "petition" | "action" | "document";
      title: string;
      description: string;
      priority: number;
    }[];
  };
  createdAt: string;
  confidence: number;
  processingTime: number;
}

interface GEDAIIntegrationProps {
  selectedFiles: FileItem[];
  onStartChat: (documentId: string, documentName: string) => void;
}

export function GEDAIIntegration({
  selectedFiles,
  onStartChat,
}: GEDAIIntegrationProps) {
  const [analysisResults, setAnalysisResults] = useState<AIAnalysisResult[]>(
    [],
  );
  const [analyzing, setAnalyzing] = useState<{ [key: string]: boolean }>({});
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<FileItem | null>(
    null,
  );
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  const analyzeDocument = useCallback(
    async (file: FileItem, analysisType: AIAnalysisResult["analysisType"]) => {
      const key = `${file.id}_${analysisType}`;
      setAnalyzing((prev) => ({ ...prev, [key]: true }));

      try {
        // Simulate AI analysis
        await new Promise((resolve) =>
          setTimeout(resolve, 2000 + Math.random() * 3000),
        );

        const mockResult: AIAnalysisResult = {
          id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          documentId: file.id,
          documentName: file.name,
          analysisType,
          result: generateMockAnalysis(file, analysisType),
          createdAt: new Date().toISOString(),
          confidence: 0.85 + Math.random() * 0.12,
          processingTime: 2000 + Math.random() * 3000,
        };

        setAnalysisResults((prev) => [...prev, mockResult]);
        toast.success(
          `Análise "${getAnalysisTypeName(analysisType)}" concluída para ${file.name}`,
        );
      } catch (error) {
        console.error("Erro na análise:", error);
        toast.error("Erro ao analisar documento");
      } finally {
        setAnalyzing((prev) => ({ ...prev, [key]: false }));
      }
    },
    [],
  );

  const generateMockAnalysis = (
    file: FileItem,
    analysisType: AIAnalysisResult["analysisType"],
  ) => {
    const fileName = file.name.toLowerCase();

    switch (analysisType) {
      case "summary":
        return {
          summary: fileName.includes("contrato")
            ? "Contrato de prestação de serviços advocatícios estabelecendo relação jurídica entre cliente e escritório. Define honorários, responsabilidades e prazos para atuação em processo judicial de indenização por danos morais."
            : fileName.includes("inicial")
              ? "Petição inicial de ação de indenização por danos morais fundamentada em relação de consumo. Pedido de condenação em R$ 50.000,00 com base em constrangimento e exposição vexatória."
              : "Documento jurídico contendo informações processuais relevantes para análise e acompanhamento do caso.",
        };

      case "classification":
        return {
          classification: {
            type: fileName.includes("contrato")
              ? "Contrato"
              : fileName.includes("inicial")
                ? "Petição Inicial"
                : "Documento Processual",
            confidence: 0.92,
            categories: fileName.includes("contrato")
              ? ["Contrato", "Honorários", "Prestação de Serviços"]
              : ["Petição", "Cível", "Indenização", "Danos Morais"],
          },
        };

      case "deadlines":
        return {
          deadlines: [
            {
              description: "Prazo para contestação",
              date: new Date(
                Date.now() + 15 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              priority: "alta" as const,
              actions: [
                "Protocolar contestação",
                "Reunir documentos de defesa",
                "Analisar jurisprudência",
              ],
            },
            {
              description: "Prazo para juntada de documentos",
              date: new Date(
                Date.now() + 5 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              priority: "media" as const,
              actions: ["Digitalizar documentos", "Autenticar cópias"],
            },
          ],
        };

      case "risks":
        return {
          risks: [
            {
              level: "medio" as const,
              description:
                "Possibilidade de revelia por não observância do prazo de contestação",
              recommendations: [
                "Monitorar prazos processuais constantemente",
                "Configurar alertas automáticos",
                "Revisar estratégia de defesa",
              ],
            },
          ],
        };

      case "suggestions":
        return {
          suggestions: [
            {
              type: "petition" as const,
              title: "Contestação com Preliminares",
              description:
                "Sugere elaboração de contestação com preliminares de ilegitimidade passiva e falta de interesse processual",
              priority: 9,
            },
            {
              type: "action" as const,
              title: "Diligência Probatória",
              description:
                "Recomenda produção de prova testemunhal e pericial para robustecimento da defesa",
              priority: 7,
            },
          ],
        };

      default:
        return {};
    }
  };

  const getAnalysisTypeName = (type: AIAnalysisResult["analysisType"]) => {
    const names = {
      summary: "Resumo Inteligente",
      classification: "Classificação Automática",
      deadlines: "Identificação de Prazos",
      risks: "Análise de Riscos",
      suggestions: "Sugestões Estratégicas",
    };
    return names[type];
  };

  const getAnalysisTypeIcon = (type: AIAnalysisResult["analysisType"]) => {
    const icons = {
      summary: FileText,
      classification: Tag,
      deadlines: Calendar,
      risks: AlertTriangle,
      suggestions: Target,
    };
    return icons[type];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      baixa: "text-green-600 bg-green-50",
      media: "text-yellow-600 bg-yellow-50",
      alta: "text-orange-600 bg-orange-50",
      critica: "text-red-600 bg-red-50",
      critico: "text-red-600 bg-red-50",
    };
    return (
      colors[priority as keyof typeof colors] || "text-gray-600 bg-gray-50"
    );
  };

  const getRiskLevelColor = (level: string) => {
    const colors = {
      baixo: "text-green-600 bg-green-50",
      medio: "text-yellow-600 bg-yellow-50",
      alto: "text-orange-600 bg-orange-50",
      critico: "text-red-600 bg-red-50",
    };
    return colors[level as keyof typeof colors] || "text-gray-600 bg-gray-50";
  };

  const startAIChat = (file: FileItem) => {
    setSelectedDocument(file);
    setChatDialogOpen(true);
    setChatHistory([
      {
        id: "welcome",
        role: "assistant",
        content: `Olá! Estou aqui para ajudar você com a análise do documento "${file.name}". 

Posso responder perguntas sobre:
• Conteúdo e estrutura do documento
• Implicações jurídicas
• Prazos e obrigações
• Sugestões de estratégia
• Riscos e oportunidades

O que você gostaria de saber?`,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim() || !selectedDocument) return;

    const userMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: chatMessage,
      timestamp: new Date().toISOString(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setChatMessage("");

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const aiResponse = {
      id: `msg_${Date.now()}_ai`,
      role: "assistant",
      content: generateAIResponse(chatMessage, selectedDocument),
      timestamp: new Date().toISOString(),
    };

    setChatHistory((prev) => [...prev, aiResponse]);
  };

  const generateAIResponse = (question: string, document: FileItem) => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes("prazo") || lowerQuestion.includes("tempo")) {
      return `Com base na análise do documento "${document.name}", identifiquei os seguintes prazos importantes:

• **Contestação**: 15 dias úteis a partir da citação
• **Juntada de documentos**: Até o final da fase probatória
• **Alegações finais**: 15 dias após encerramento da instrução

**Recomendação**: Configure alertas automáticos para não perder esses prazos críticos.`;
    }

    if (lowerQuestion.includes("risco") || lowerQuestion.includes("problema")) {
      return `Analisando os riscos do documento "${document.name}":

🟡 **Risco Médio**: Possibilidade de revelia
- **Mitigação**: Protocolar contestação tempestivamente

🟢 **Risco Baixo**: Questões processuais
- **Mitigação**: Acompanhar andamentos regulares

**Sugestão**: Mantenha monitoramento ativo do processo.`;
    }

    if (
      lowerQuestion.includes("estratégia") ||
      lowerQuestion.includes("como")
    ) {
      return `Para o documento "${document.name}", sugiro a seguinte estratégia:

1. **Análise Preliminar**
   - Verificar competência do juízo
   - Analisar legitimidade das partes

2. **Defesa Técnica**
   - Contestar fatos controversos
   - Juntar documentos comprobatórios

3. **Estratégia Probatória**
   - Requerer produção de provas necessárias
   - Indicar testemunhas se aplicável

Precisa de mais detalhes sobre algum ponto?`;
    }

    return `Entendi sua pergunta sobre "${document.name}". 

Com base na análise do documento, posso fornecer informações específicas sobre:

• **Conteúdo**: Aspectos técnicos e jurídicos relevantes
• **Procedimento**: Próximos passos recomendados  
• **Documentação**: Peças que devem ser elaboradas
• **Monitoramento**: Pontos de atenção importantes

Pode ser mais específico sobre o que precisa saber? Assim posso dar uma resposta mais direcionada.`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (selectedFiles.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-medium mb-2">IA Jurídica Disponível</h3>
          <p className="text-muted-foreground mb-4">
            Selecione um ou mais documentos para usar as funcionalidades de IA
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span>Resumo Automático</span>
            </div>
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-green-600" />
              <span>Classificação</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-orange-600" />
              <span>Prazos</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span>Análise de Riscos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-purple-600" />
              <span>Sugestões</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-indigo-600" />
              <span>Chat com IA</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Actions for Selected Files */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Análise com IA Jurídica</span>
            <Badge variant="secondary">{selectedFiles.length} arquivo(s)</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedFiles.map((file) => (
              <Card key={file.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm truncate">
                      {file.name}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => analyzeDocument(file, "summary")}
                            disabled={analyzing[`${file.id}_summary`]}
                            className="text-xs"
                          >
                            {analyzing[`${file.id}_summary`] ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <FileText className="h-3 w-3" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Resumo Inteligente</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => analyzeDocument(file, "deadlines")}
                            disabled={analyzing[`${file.id}_deadlines`]}
                            className="text-xs"
                          >
                            {analyzing[`${file.id}_deadlines`] ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Calendar className="h-3 w-3" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Identificar Prazos</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => analyzeDocument(file, "risks")}
                            disabled={analyzing[`${file.id}_risks`]}
                            className="text-xs"
                          >
                            {analyzing[`${file.id}_risks`] ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <AlertTriangle className="h-3 w-3" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Análise de Riscos</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => analyzeDocument(file, "suggestions")}
                            disabled={analyzing[`${file.id}_suggestions`]}
                            className="text-xs"
                          >
                            {analyzing[`${file.id}_suggestions`] ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Target className="h-3 w-3" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Sugestões Estratégicas</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => startAIChat(file)}
                    className="w-full text-xs"
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Chat com IA
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>Resultados da Análise</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisResults.map((result) => {
                const Icon = getAnalysisTypeIcon(result.analysisType);

                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {getAnalysisTypeName(result.analysisType)}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {result.documentName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="flex items-center space-x-2">
                          <span>Confiança:</span>
                          <Badge variant="secondary">
                            {(result.confidence * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">
                          {formatDate(result.createdAt)}
                        </p>
                      </div>
                    </div>

                    {result.result.summary && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h5 className="font-medium text-blue-900 mb-2">
                          Resumo
                        </h5>
                        <p className="text-blue-800 text-sm">
                          {result.result.summary}
                        </p>
                      </div>
                    )}

                    {result.result.classification && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <h5 className="font-medium text-green-900 mb-2">
                          Classificação
                        </h5>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className="bg-green-100 text-green-800">
                            {result.result.classification.type}
                          </Badge>
                          <span className="text-sm text-green-700">
                            {(
                              result.result.classification.confidence * 100
                            ).toFixed(0)}
                            % de confiança
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {result.result.classification.categories.map(
                            (category) => (
                              <Badge
                                key={category}
                                variant="outline"
                                className="text-xs"
                              >
                                {category}
                              </Badge>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {result.result.deadlines && (
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <h5 className="font-medium text-orange-900 mb-2">
                          Prazos Identificados
                        </h5>
                        <div className="space-y-2">
                          {result.result.deadlines.map((deadline, index) => (
                            <div
                              key={index}
                              className="border-l-4 border-orange-400 pl-3"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-orange-800">
                                  {deadline.description}
                                </span>
                                <Badge
                                  className={getPriorityColor(
                                    deadline.priority,
                                  )}
                                >
                                  {deadline.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-orange-700 mb-1">
                                📅{" "}
                                {new Date(deadline.date).toLocaleDateString(
                                  "pt-BR",
                                )}
                              </p>
                              <ul className="text-xs text-orange-600 space-y-1">
                                {deadline.actions.map((action, actionIndex) => (
                                  <li key={actionIndex}>• {action}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.result.risks && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <h5 className="font-medium text-red-900 mb-2">
                          Análise de Riscos
                        </h5>
                        <div className="space-y-2">
                          {result.result.risks.map((risk, index) => (
                            <div
                              key={index}
                              className="border-l-4 border-red-400 pl-3"
                            >
                              <div className="flex items-center space-x-2 mb-1">
                                <Badge
                                  className={getRiskLevelColor(risk.level)}
                                >
                                  Risco {risk.level}
                                </Badge>
                              </div>
                              <p className="text-sm text-red-800 mb-2">
                                {risk.description}
                              </p>
                              <div className="text-xs text-red-600">
                                <span className="font-medium">
                                  Recomendações:
                                </span>
                                <ul className="mt-1 space-y-1">
                                  {risk.recommendations.map((rec, recIndex) => (
                                    <li key={recIndex}>• {rec}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.result.suggestions && (
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <h5 className="font-medium text-purple-900 mb-2">
                          Sugestões Estratégicas
                        </h5>
                        <div className="space-y-2">
                          {result.result.suggestions.map(
                            (suggestion, index) => (
                              <div
                                key={index}
                                className="border-l-4 border-purple-400 pl-3"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-purple-800">
                                    {suggestion.title}
                                  </span>
                                  <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${
                                          i < suggestion.priority / 2
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-purple-700">
                                  {suggestion.description}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Chat Dialog */}
      <Dialog open={chatDialogOpen} onOpenChange={setChatDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span>Chat com IA Jurídica</span>
            </DialogTitle>
            <DialogDescription>
              Conversa sobre: {selectedDocument?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col h-96">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20 rounded-lg">
              {chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                      {formatDate(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-2 mt-4">
              <Textarea
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Digite sua pergunta sobre o documento..."
                className="flex-1"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendChatMessage();
                  }
                }}
              />
              <Button onClick={sendChatMessage} disabled={!chatMessage.trim()}>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
