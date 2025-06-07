import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Sparkles,
  FileText,
  Gavel,
  Target,
  Zap,
  BookOpen,
  MessageSquare,
  Search,
  Lightbulb,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Scale,
  FileCheck,
  Users,
  Calendar,
  Download,
  Share2,
  Copy,
  ArrowRight,
  Loader2,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RefreshCw,
  Star,
  Bookmark,
  Tag,
  Link,
  Archive,
  Settings,
  X,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  PauseCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
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
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";

interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  path: string;
  clientId?: string;
  processId?: string;
  createdAt: string;
  lastModified: string;
  tags: string[];
  category: string;
}

interface AIAnalysisResult {
  id: string;
  documentId: string;
  analysisType:
    | "summary"
    | "classification"
    | "deadlines"
    | "jurisprudence"
    | "petition"
    | "index"
    | "validation";
  status: "pending" | "processing" | "completed" | "failed";
  result?: {
    summary?: string;
    classification?: {
      type: string;
      category: string;
      subcategory: string;
      confidence: number;
    };
    deadlines?: {
      date: string;
      description: string;
      type: string;
      urgency: "baixa" | "media" | "alta" | "critica";
      actions: string[];
    }[];
    jurisprudence?: {
      decisions: {
        tribunal: string;
        number: string;
        date: string;
        summary: string;
        relevance: number;
        link?: string;
      }[];
      recommendations: string[];
    };
    petition?: {
      suggestedType: string;
      template: string;
      keyPoints: string[];
      precedents: string[];
      timeline: string;
    };
    documentIndex?: {
      sections: {
        title: string;
        page: number;
        level: number;
        summary?: string;
      }[];
      keywords: string[];
    };
    validation?: {
      isValid: boolean;
      issues: {
        type: string;
        description: string;
        severity: "info" | "warning" | "error";
        suggestion: string;
      }[];
      score: number;
    };
  };
  processingTime?: number;
  confidence: number;
  createdAt: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  documentContext?: string;
  analysisReference?: string;
  attachments?: {
    type: "analysis" | "template" | "precedent";
    title: string;
    content: any;
  }[];
}

interface AIFloatingMenuProps {
  document: DocumentFile;
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
  onAnalyze: (
    documentId: string,
    analysisType: string,
  ) => Promise<AIAnalysisResult>;
  onStartChat: (documentId: string, context?: string) => void;
}

interface AIAssistantProps {
  documents: DocumentFile[];
  selectedDocuments: string[];
  onAnalysisComplete: (result: AIAnalysisResult) => void;
  onCreateTask: (taskData: any) => void;
  onCreatePetition: (petitionData: any) => void;
  className?: string;
}

const analysisTypes = [
  {
    id: "summary",
    name: "Resumir Conteúdo",
    description: "Gera um resumo executivo do documento",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    estimatedTime: "2-3 min",
  },
  {
    id: "classification",
    name: "Classificar Documento",
    description: "Identifica o tipo e categoria do documento",
    icon: Tag,
    color: "text-green-600",
    bgColor: "bg-green-50",
    estimatedTime: "1-2 min",
  },
  {
    id: "deadlines",
    name: "Identificar Prazos",
    description: "Encontra datas importantes e prazos processuais",
    icon: Calendar,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    estimatedTime: "3-4 min",
  },
  {
    id: "jurisprudence",
    name: "Validar com Jurisprudência",
    description: "Busca decisões similares e precedentes",
    icon: Scale,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    estimatedTime: "5-7 min",
  },
  {
    id: "petition",
    name: "Sugerir Petição",
    description: "Propõe petições baseadas no conteúdo",
    icon: Gavel,
    color: "text-red-600",
    bgColor: "bg-red-50",
    estimatedTime: "4-6 min",
  },
  {
    id: "index",
    name: "Gerar Índice",
    description: "Cria índice automático do documento",
    icon: BookOpen,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    estimatedTime: "2-3 min",
  },
];

const AIFloatingMenu = ({
  document,
  isOpen,
  onClose,
  position,
  onAnalyze,
  onStartChat,
}: AIFloatingMenuProps) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async (analysisType: string) => {
    setSelectedAnalysis(analysisType);
    setAnalyzing(true);

    try {
      await onAnalyze(document.id, analysisType);
      toast.success(
        `Análise "${analysisTypes.find((t) => t.id === analysisType)?.name}" iniciada`,
      );
    } catch (error) {
      toast.error("Erro ao iniciar análise");
    } finally {
      setAnalyzing(false);
      setSelectedAnalysis(null);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
      style={{
        left: Math.min(position.x, window.innerWidth - 400),
        top: Math.min(position.y, window.innerHeight - 600),
        width: "380px",
        maxHeight: "600px",
      }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span className="font-medium">IA Jurídica</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2">
          <p className="text-sm opacity-90 truncate">{document.name}</p>
          <p className="text-xs opacity-75">
            {document.category} •{" "}
            {new Date(document.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStartChat(document.id)}
            className="flex items-center space-x-2"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Chat IA</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAnalyze("summary")}
            disabled={analyzing}
            className="flex items-center space-x-2"
          >
            {analyzing && selectedAnalysis === "summary" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            <span>Resumo</span>
          </Button>
        </div>
      </div>

      {/* Analysis Options */}
      <div className="max-h-96 overflow-y-auto">
        <div className="p-4 space-y-3">
          <h4 className="font-medium text-sm flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span>Análises Disponíveis</span>
          </h4>

          {analysisTypes.map((analysis) => {
            const Icon = analysis.icon;
            const isProcessing = analyzing && selectedAnalysis === analysis.id;

            return (
              <motion.button
                key={analysis.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnalyze(analysis.id)}
                disabled={analyzing}
                className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                  isProcessing
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${analysis.bgColor}`}>
                    {isProcessing ? (
                      <Loader2
                        className={`h-4 w-4 ${analysis.color} animate-spin`}
                      />
                    ) : (
                      <Icon className={`h-4 w-4 ${analysis.color}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm">{analysis.name}</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      {analysis.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="text-xs">
                        {analysis.estimatedTime}
                      </Badge>
                      {isProcessing && (
                        <div className="flex items-center space-x-1 text-xs text-blue-600">
                          <Clock className="h-3 w-3" />
                          <span>Processando...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="text-xs text-muted-foreground text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Sparkles className="h-3 w-3" />
            <span>Powered by IA Jurídica v3.0</span>
          </div>
          <span>Análises avançadas com base em jurisprudência brasileira</span>
        </div>
      </div>
    </motion.div>
  );
};

const AIResultsPanel = ({
  results,
  onCreateTask,
  onCreatePetition,
}: {
  results: AIAnalysisResult[];
  onCreateTask: (data: any) => void;
  onCreatePetition: (data: any) => void;
}) => {
  const [expandedResults, setExpandedResults] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedResult, setSelectedResult] = useState<AIAnalysisResult | null>(
    null,
  );

  const toggleExpanded = (resultId: string) => {
    setExpandedResults((prev) => ({ ...prev, [resultId]: !prev[resultId] }));
  };

  const getAnalysisIcon = (type: string) => {
    const analysis = analysisTypes.find((a) => a.id === type);
    return analysis?.icon || Brain;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50";
      case "processing":
        return "text-blue-600 bg-blue-50";
      case "failed":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const ResultCard = ({ result }: { result: AIAnalysisResult }) => {
    const Icon = getAnalysisIcon(result.analysisType);
    const isExpanded = expandedResults[result.id];

    return (
      <Card className="overflow-hidden">
        <Collapsible
          open={isExpanded}
          onOpenChange={() => toggleExpanded(result.id)}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${analysisTypes.find((a) => a.id === result.analysisType)?.bgColor || "bg-gray-50"}`}
                  >
                    {result.status === "processing" ? (
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    ) : (
                      <Icon
                        className={`h-5 w-5 ${analysisTypes.find((a) => a.id === result.analysisType)?.color || "text-gray-600"}`}
                      />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      {analysisTypes.find((a) => a.id === result.analysisType)
                        ?.name || result.analysisType}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getStatusColor(result.status)}>
                        {result.status === "completed" && "Concluído"}
                        {result.status === "processing" && "Processando"}
                        {result.status === "failed" && "Erro"}
                        {result.status === "pending" && "Pendente"}
                      </Badge>
                      {result.confidence && (
                        <Badge variant="outline">
                          {(result.confidence * 100).toFixed(0)}% confiança
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {result.processingTime && (
                    <span className="text-xs text-muted-foreground">
                      {result.processingTime}ms
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="pt-0">
              {result.result && (
                <div className="space-y-4">
                  {/* Resumo */}
                  {result.result.summary && (
                    <div>
                      <h5 className="font-medium mb-2">Resumo</h5>
                      <p className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                        {result.result.summary}
                      </p>
                    </div>
                  )}

                  {/* Classificação */}
                  {result.result.classification && (
                    <div>
                      <h5 className="font-medium mb-2">Classificação</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-sm font-medium">Tipo:</span>
                          <Badge className="ml-2">
                            {result.result.classification.type}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-sm font-medium">
                            Categoria:
                          </span>
                          <Badge variant="outline" className="ml-2">
                            {result.result.classification.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Prazos */}
                  {result.result.deadlines &&
                    result.result.deadlines.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-2">
                          Prazos Identificados
                        </h5>
                        <div className="space-y-2">
                          {result.result.deadlines.map((deadline, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">
                                  {deadline.description}
                                </span>
                                <Badge
                                  className={
                                    deadline.urgency === "critica"
                                      ? "bg-red-100 text-red-800"
                                      : deadline.urgency === "alta"
                                        ? "bg-orange-100 text-orange-800"
                                        : deadline.urgency === "media"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-green-100 text-green-800"
                                  }
                                >
                                  {deadline.urgency}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <div>
                                  📅{" "}
                                  {new Date(deadline.date).toLocaleDateString(
                                    "pt-BR",
                                  )}
                                </div>
                                {deadline.actions.length > 0 && (
                                  <div className="mt-2">
                                    <span className="font-medium">Ações:</span>
                                    <ul className="list-disc list-inside mt-1 space-y-1">
                                      {deadline.actions.map((action, i) => (
                                        <li key={i}>{action}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                              <div className="mt-3 flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    onCreateTask({
                                      title: deadline.description,
                                      dueDate: deadline.date,
                                      priority: deadline.urgency,
                                      description: `Prazo processual identificado automaticamente pela IA.\n\nAções sugeridas:\n${deadline.actions.join("\n")}`,
                                      documentId: result.documentId,
                                    })
                                  }
                                >
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Criar Tarefa
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Jurisprudência */}
                  {result.result.jurisprudence && (
                    <div>
                      <h5 className="font-medium mb-2">
                        Jurisprudência Relacionada
                      </h5>
                      <div className="space-y-3">
                        {result.result.jurisprudence.decisions
                          .slice(0, 3)
                          .map((decision, index) => (
                            <div
                              key={index}
                              className="p-3 border rounded-lg bg-purple-50"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <span className="font-medium text-sm">
                                    {decision.tribunal}
                                  </span>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    {decision.number}
                                  </span>
                                </div>
                                <Badge variant="outline">
                                  {(decision.relevance * 100).toFixed(0)}%
                                  relevante
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {decision.summary}
                              </p>
                              {decision.link && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="p-0 mt-2"
                                >
                                  <Link className="h-3 w-3 mr-1" />
                                  Ver decisão completa
                                </Button>
                              )}
                            </div>
                          ))}
                        {result.result.jurisprudence.recommendations.length >
                          0 && (
                          <div className="mt-3">
                            <span className="text-sm font-medium">
                              Recomendações:
                            </span>
                            <ul className="list-disc list-inside mt-1 space-y-1 text-sm text-muted-foreground">
                              {result.result.jurisprudence.recommendations.map(
                                (rec, i) => (
                                  <li key={i}>{rec}</li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Sugestão de Petição */}
                  {result.result.petition && (
                    <div>
                      <h5 className="font-medium mb-2">Sugestão de Petição</h5>
                      <div className="p-3 border rounded-lg bg-green-50">
                        <div className="mb-3">
                          <span className="font-medium">Tipo sugerido:</span>
                          <Badge className="ml-2 bg-green-600">
                            {result.result.petition.suggestedType}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Pontos-chave:</span>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {result.result.petition.keyPoints.map(
                                (point, i) => (
                                  <li key={i}>{point}</li>
                                ),
                              )}
                            </ul>
                          </div>
                          {result.result.petition.precedents.length > 0 && (
                            <div>
                              <span className="font-medium">
                                Precedentes relevantes:
                              </span>
                              <ul className="list-disc list-inside mt-1 space-y-1">
                                {result.result.petition.precedents.map(
                                  (precedent, i) => (
                                    <li key={i}>{precedent}</li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="mt-3">
                          <Button
                            size="sm"
                            onClick={() =>
                              onCreatePetition({
                                type: result.result!.petition!.suggestedType,
                                template: result.result!.petition!.template,
                                keyPoints: result.result!.petition!.keyPoints,
                                precedents: result.result!.petition!.precedents,
                                documentId: result.documentId,
                              })
                            }
                          >
                            <Gavel className="h-3 w-3 mr-1" />
                            Criar Petição
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Índice */}
                  {result.result.documentIndex && (
                    <div>
                      <h5 className="font-medium mb-2">Índice do Documento</h5>
                      <div className="space-y-2">
                        {result.result.documentIndex.sections.map(
                          (section, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded cursor-pointer"
                              style={{
                                paddingLeft: `${section.level * 16 + 8}px`,
                              }}
                            >
                              <span className="text-sm font-medium">
                                {section.title}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                p. {section.page}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                      {result.result.documentIndex.keywords.length > 0 && (
                        <div className="mt-3">
                          <span className="text-sm font-medium">
                            Palavras-chave:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {result.result.documentIndex.keywords.map(
                              (keyword) => (
                                <Badge
                                  key={keyword}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {keyword}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Validação */}
                  {result.result.validation && (
                    <div>
                      <h5 className="font-medium mb-2">
                        Validação do Documento
                      </h5>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Status:</span>
                          <Badge
                            className={
                              result.result.validation.isValid
                                ? "bg-green-600"
                                : "bg-red-600"
                            }
                          >
                            {result.result.validation.isValid
                              ? "Válido"
                              : "Inválido"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Pontuação:</span>
                          <Progress
                            value={result.result.validation.score}
                            className="flex-1"
                          />
                          <span className="text-sm font-medium">
                            {result.result.validation.score}%
                          </span>
                        </div>
                        {result.result.validation.issues.length > 0 && (
                          <div>
                            <span className="font-medium">
                              Problemas encontrados:
                            </span>
                            <div className="space-y-2 mt-2">
                              {result.result.validation.issues.map(
                                (issue, i) => (
                                  <div
                                    key={i}
                                    className={`p-2 rounded border ${
                                      issue.severity === "error"
                                        ? "border-red-200 bg-red-50"
                                        : issue.severity === "warning"
                                          ? "border-yellow-200 bg-yellow-50"
                                          : "border-blue-200 bg-blue-50"
                                    }`}
                                  >
                                    <div className="flex items-start space-x-2">
                                      {issue.severity === "error" && (
                                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                                      )}
                                      {issue.severity === "warning" && (
                                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                                      )}
                                      {issue.severity === "info" && (
                                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                                      )}
                                      <div className="flex-1">
                                        <p className="text-sm font-medium">
                                          {issue.description}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {issue.suggestion}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>Resultados da IA</span>
        </h3>
        <Badge variant="secondary">{results.length} análise(s)</Badge>
      </div>

      {results.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h4 className="font-medium mb-2">Nenhuma análise disponível</h4>
            <p className="text-sm text-muted-foreground">
              Selecione documentos e use o menu flutuante para iniciar análises
              com IA
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <ResultCard key={result.id} result={result} />
          ))}
        </div>
      )}
    </div>
  );
};

export function GEDAdvancedAI({
  documents,
  selectedDocuments,
  onAnalysisComplete,
  onCreateTask,
  onCreatePetition,
  className = "",
}: AIAssistantProps) {
  const [floatingMenu, setFloatingMenu] = useState<{
    document: DocumentFile | null;
    isOpen: boolean;
    position: { x: number; y: number };
  }>({
    document: null,
    isOpen: false,
    position: { x: 0, y: 0 },
  });

  const [analysisResults, setAnalysisResults] = useState<AIAnalysisResult[]>(
    [],
  );
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentChatDocument, setCurrentChatDocument] =
    useState<DocumentFile | null>(null);

  const handleDocumentContextMenu = (
    document: DocumentFile,
    event: React.MouseEvent,
  ) => {
    event.preventDefault();
    setFloatingMenu({
      document,
      isOpen: true,
      position: { x: event.clientX, y: event.clientY },
    });
  };

  const handleAnalyze = async (
    documentId: string,
    analysisType: string,
  ): Promise<AIAnalysisResult> => {
    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newAnalysis: AIAnalysisResult = {
      id: analysisId,
      documentId,
      analysisType: analysisType as any,
      status: "processing",
      confidence: 0,
      createdAt: new Date().toISOString(),
    };

    setAnalysisResults((prev) => [...prev, newAnalysis]);
    setFloatingMenu((prev) => ({ ...prev, isOpen: false }));

    // Simular processamento
    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 2000 + Math.random() * 3000),
      );

      // Simular resultado baseado no tipo
      const mockResult = generateMockAnalysisResult(analysisType);

      const completedAnalysis: AIAnalysisResult = {
        ...newAnalysis,
        status: "completed",
        result: mockResult,
        confidence: 0.85 + Math.random() * 0.12,
        processingTime: 2000 + Math.random() * 3000,
      };

      setAnalysisResults((prev) =>
        prev.map((a) => (a.id === analysisId ? completedAnalysis : a)),
      );

      onAnalysisComplete(completedAnalysis);
      return completedAnalysis;
    } catch (error) {
      const failedAnalysis: AIAnalysisResult = {
        ...newAnalysis,
        status: "failed",
        confidence: 0,
      };

      setAnalysisResults((prev) =>
        prev.map((a) => (a.id === analysisId ? failedAnalysis : a)),
      );

      throw error;
    }
  };

  const handleStartChat = (documentId: string, context?: string) => {
    const document = documents.find((d) => d.id === documentId);
    if (!document) return;

    setCurrentChatDocument(document);
    setChatOpen(true);

    // Adicionar mensagem inicial
    const initialMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "assistant",
      content: `Olá! Estou aqui para ajudar com a análise do documento "${document.name}". 

Posso responder perguntas sobre:
• Conteúdo e estrutura do documento
• Prazos e obrigações legais
• Jurisprudência relacionada
• Sugestões de petições
• Análise de riscos e oportunidades

Como posso ajudá-lo?`,
      timestamp: new Date().toISOString(),
      documentContext: documentId,
    };

    setChatMessages([initialMessage]);
  };

  const generateMockAnalysisResult = (analysisType: string) => {
    switch (analysisType) {
      case "summary":
        return {
          summary:
            "Este documento constitui uma petição inicial de ação de indenização por danos morais, fundamentada em relação de consumo. O autor alega constrangimento e exposição vexatória, pleiteando condenação no valor de R$ 50.000,00 a título de danos morais, com base no Código de Defesa do Consumidor e jurisprudência consolidada do STJ.",
        };

      case "classification":
        return {
          classification: {
            type: "Petição Inicial",
            category: "Cível",
            subcategory: "Indenização por Danos Morais",
            confidence: 0.94,
          },
        };

      case "deadlines":
        return {
          deadlines: [
            {
              date: new Date(
                Date.now() + 15 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              description: "Prazo para contestação",
              type: "Processual",
              urgency: "alta" as const,
              actions: [
                "Acompanhar citação do réu",
                "Preparar eventual tréplica",
                "Organizar documentos complementares",
              ],
            },
            {
              date: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              description: "Prazo para especificação de provas",
              type: "Processual",
              urgency: "media" as const,
              actions: [
                "Definir estratégia probatória",
                "Requerer provas necessárias",
                "Indicar testemunhas se aplicável",
              ],
            },
          ],
        };

      case "jurisprudence":
        return {
          jurisprudence: {
            decisions: [
              {
                tribunal: "STJ",
                number: "REsp 1.737.428/RJ",
                date: "2018-11-27",
                summary:
                  "Danos morais in re ipsa em casos de inscrição indevida em órgãos de proteção ao crédito",
                relevance: 0.89,
                link: "https://exemplo.com/jurisprudencia",
              },
              {
                tribunal: "TJSP",
                number: "Apelação 1005123-45.2019.8.26.0001",
                date: "2020-03-15",
                summary:
                  "Fixação de danos morais em R$ 15.000,00 por constrangimento em estabelecimento comercial",
                relevance: 0.76,
              },
            ],
            recommendations: [
              "Fundamentar o pedido na jurisprudência consolidada do STJ sobre danos morais",
              "Destacar o caráter in re ipsa dos danos em casos similares",
              "Considerar precedentes do tribunal local para valor da condenação",
            ],
          },
        };

      case "petition":
        return {
          petition: {
            suggestedType: "Contestação com Preliminares",
            template: "template_contestacao_danos_morais",
            keyPoints: [
              "Arguir preliminar de ilegitimidade passiva",
              "Contestar a existência dos danos alegados",
              "Impugnar o valor pleiteado como excessivo",
              "Requerer produção de prova testemunhal",
            ],
            precedents: [
              "STJ - Danos morais não se presumem (REsp 1.234.567)",
              "TJSP - Necessidade de comprovação do dano (Apel. 9876543)",
            ],
            timeline: "15 dias corridos a partir da citação",
          },
        };

      case "index":
        return {
          documentIndex: {
            sections: [
              { title: "Qualificação das Partes", page: 1, level: 1 },
              { title: "Dos Fatos", page: 2, level: 1 },
              { title: "Do Direito", page: 4, level: 1 },
              { title: "Danos Morais", page: 4, level: 2 },
              { title: "Jurisprudência Aplicável", page: 5, level: 2 },
              { title: "Do Pedido", page: 6, level: 1 },
              { title: "Requerimentos Finais", page: 7, level: 1 },
            ],
            keywords: [
              "danos morais",
              "CDC",
              "indenização",
              "constrangimento",
              "jurisprudência",
            ],
          },
        };

      case "validation":
        return {
          validation: {
            isValid: true,
            score: 87,
            issues: [
              {
                type: "Formatação",
                description: "Numeração de páginas ausente",
                severity: "warning" as const,
                suggestion: "Adicionar numeração sequencial nas páginas",
              },
              {
                type: "Conteúdo",
                description: "Valor da causa não especificado claramente",
                severity: "info" as const,
                suggestion: "Destacar o valor da causa de forma mais evidente",
              },
            ],
          },
        };

      default:
        return {};
    }
  };

  return (
    <TooltipProvider>
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">IA Jurídica Avançada</h2>
              <p className="text-sm text-muted-foreground">
                Análise inteligente de documentos jurídicos
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>v3.0</span>
            </Badge>
            {selectedDocuments.length > 0 && (
              <Badge className="bg-blue-600">
                {selectedDocuments.length} selecionado(s)
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Actions for Selected Documents */}
        {selectedDocuments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Análises Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {analysisTypes.map((analysis) => {
                  const Icon = analysis.icon;
                  return (
                    <Button
                      key={analysis.id}
                      variant="outline"
                      className="h-20 flex-col space-y-2"
                      onClick={() => {
                        selectedDocuments.forEach((docId) => {
                          handleAnalyze(docId, analysis.id);
                        });
                      }}
                    >
                      <Icon className={`h-5 w-5 ${analysis.color}`} />
                      <span className="text-xs text-center">
                        {analysis.name}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Panel */}
        <AIResultsPanel
          results={analysisResults}
          onCreateTask={onCreateTask}
          onCreatePetition={onCreatePetition}
        />

        {/* Floating Menu */}
        <AnimatePresence>
          {floatingMenu.isOpen && floatingMenu.document && (
            <AIFloatingMenu
              document={floatingMenu.document}
              isOpen={floatingMenu.isOpen}
              onClose={() =>
                setFloatingMenu((prev) => ({ ...prev, isOpen: false }))
              }
              position={floatingMenu.position}
              onAnalyze={handleAnalyze}
              onStartChat={handleStartChat}
            />
          )}
        </AnimatePresence>

        {/* Chat Dialog */}
        <Dialog open={chatOpen} onOpenChange={setChatOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Chat com IA Jurídica</span>
              </DialogTitle>
              <DialogDescription>
                Conversa sobre: {currentChatDocument?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col h-96">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20 rounded-lg">
                {chatMessages.map((message) => (
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
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2 mt-4">
                <Input
                  placeholder="Faça uma pergunta sobre o documento..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      // Implementar envio de mensagem
                    }
                  }}
                />
                <Button>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Document Context Menu Handler */}
        <div className="hidden">
          {documents.map((document) => (
            <div
              key={document.id}
              onContextMenu={(e) => handleDocumentContextMenu(document, e)}
            />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
