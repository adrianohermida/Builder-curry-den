import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  X,
  Minimize2,
  Maximize2,
  Copy,
  Download,
  Sparkles,
  FileText,
  Gavel,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export interface IAMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  type?: "text" | "summary" | "petition" | "analysis" | "suggestion";
  metadata?: {
    confidence?: number;
    sources?: string[];
    actions?: string[];
  };
}

export interface IAContext {
  type:
    | "PUBLICACAO_ANALYSIS"
    | "PROCESS_CONSULTATION"
    | "PETITION_GENERATION"
    | "GENERAL";
  entityId?: string;
  entityData?: any;
}

interface IAAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  context?: IAContext;
  initialMessage?: string;
  className?: string;
}

export function IAAssistant({
  isOpen,
  onClose,
  context,
  initialMessage,
  className = "",
}: IAAssistantProps) {
  const [messages, setMessages] = useState<IAMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && initialMessage) {
      const welcomeMessage: IAMessage = {
        id: "welcome",
        role: "assistant",
        content: initialMessage,
        timestamp: new Date().toISOString(),
        type: "text",
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, initialMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: IAMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Simular resposta da IA
      const response = await generateIAResponse(
        input.trim(),
        context,
        messages,
      );

      setTimeout(() => {
        setMessages((prev) => [...prev, response]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setIsLoading(false);
      toast.error("Erro ao processar sua mensagem");
    }
  };

  const generateIAResponse = async (
    userInput: string,
    context?: IAContext,
    chatHistory: IAMessage[] = [],
  ): Promise<IAMessage> => {
    const input = userInput.toLowerCase();
    let responseContent = "";
    let responseType: IAMessage["type"] = "text";
    let metadata: IAMessage["metadata"] = { confidence: 0.9 };

    // Respostas baseadas no contexto
    if (context?.type === "PUBLICACAO_ANALYSIS") {
      if (input.includes("resumo") || input.includes("resumir")) {
        responseType = "summary";
        responseContent = `📋 **Resumo da Publicação**

**Análise Automatizada:**
• **Urgência:** ${context.entityData?.urgency || "MÉDIA"}
• **Tipo:** ${context.entityData?.tipo || "Publicação Judicial"}
• **Tribunal:** ${context.entityData?.tribunal || "Não especificado"}

**Pontos Principais:**
1. A publicação requer atenção ${context.entityData?.urgency === "CRITICA" ? "imediata" : "dentro do prazo"}
2. ${context.entityData?.numeroProcesso ? `Processo identificado: ${context.entityData.numeroProcesso}` : "Necessário identificar processo relacionado"}
3. Prazo estimado para resposta: ${context.entityData?.prazo ? new Date(context.entityData.prazo).toLocaleDateString("pt-BR") : "15 dias corridos"}

**Ações Recomendadas:**
• Analisar o conteúdo integral
• Verificar prazos processuais específicos
• Coordenar com a equipe responsável
• Preparar documentação necessária

Posso gerar uma petição ou sugerir próximos passos específicos?`;

        metadata.actions = ["Gerar Petição", "Sugerir Prazos", "Criar Tarefa"];
      } else if (input.includes("petição") || input.includes("peticao")) {
        responseType = "petition";
        responseContent = `⚖️ **Sugestão de Petição**

Baseado na análise da publicação, sugiro a seguinte estrutura:

**PETIÇÃO DE [TIPO]**

Excelentíssimo(a) Senhor(a) Doutor(a) Juiz(a) de Direito

[PARTES], por seu advogado signatário, vem respeitosamente apresentar a presente petição, pelos fatos e fundamentos que seguem:

**DOS FATOS**
Com base na publicação de ${context.entityData?.data ? new Date(context.entityData.data).toLocaleDateString("pt-BR") : "[data]"}, verifica-se que...

**DO DIREITO**
[Fundamentação jurídica específica]

**DOS PEDIDOS**
Diante do exposto, requer-se:
a) [Pedido principal]
b) [Pedidos subsidiários]

Termos em que pede deferimento.

[Local], [Data]
[Nome do Advogado] - OAB/[UF] [Número]

---
💡 **Dica:** Personalize os campos entre colchetes conforme o caso específico.`;

        metadata.actions = [
          "Baixar Petição",
          "Editar Template",
          "Enviar para Revisão",
        ];
      } else if (input.includes("prazo") || input.includes("tempo")) {
        responseType = "analysis";
        responseContent = `⏰ **Análise de Prazos**

**Prazo Principal:**
${
  context.entityData?.prazo
    ? `📅 ${new Date(context.entityData.prazo).toLocaleDateString("pt-BR")} (${Math.ceil((new Date(context.entityData.prazo).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dias restantes)`
    : "📅 A definir (recomendo 15 dias úteis)"
}

**Prazos Relacionados:**
• **Intimação:** Considera-se realizada na data da publicação
• **Contagem:** Inicia-se no primeiro dia útil seguinte
• **Prazo fatal:** Não prorroga automaticamente

**Recomendações:**
🔴 **Urgente:** Protocolar até ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")}
🟡 **Importante:** Preparar documentação até ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")}
🟢 **Monitoramento:** Acompanhar movimentações semanalmente

Quer que eu crie uma tarefa na agenda com esses prazos?`;

        metadata.actions = [
          "Criar Tarefa",
          "Calcular Prazos",
          "Agendar Lembrete",
        ];
      } else {
        responseContent = `🤖 Estou analisando essa publicação para você!

Com base no contexto, posso ajudar com:

• **📋 Resumo detalhado** - Pontos principais e urgência
• **⚖️ Sugestão de petição** - Template personalizado
• **⏰ Análise de prazos** - Contagem e alertas
• **📝 Próximos passos** - Ações recomendadas
• **🔗 Vinculação a processos** - Organização do caso

O que você gostaria que eu analise primeiro?`;
      }
    } else if (context?.type === "PROCESS_CONSULTATION") {
      responseContent = `⚖️ **Consulta Processual**

Analisando o processo ${context.entityData?.numero || "[número]"}...

**Status Atual:**
• Fase: ${context.entityData?.fase || "Conhecimento"}
• Última movimentação: ${context.entityData?.ultimaMovimentacao || "Há 3 dias"}
• Prazo ativo: ${context.entityData?.prazoAtivo ? "Sim" : "Não"}

**Resumo das Movimentações:**
${
  context.entityData?.movimentacoes
    ?.slice(0, 3)
    .map((mov: any, i: number) => `${i + 1}. ${mov.data}: ${mov.descricao}`)
    .join("\n") || "Carregando movimentações..."
}

Como posso ajudar com este processo?`;
    } else {
      // Respostas gerais baseadas no input
      if (
        input.includes("olá") ||
        input.includes("oi") ||
        input.includes("ajuda")
      ) {
        responseContent = `👋 Olá! Sou a IA Jurídica do Lawdesk.

Posso ajudar você com:

🔍 **Análise de Publicações**
• Resumos automáticos
• Identificação de prazos
• Sugestões de ações

⚖️ **Suporte Processual**
• Geração de petições
• Cálculo de prazos
• Consulta de jurisprudência

📋 **Organização**
• Criação de tarefas
• Lembretes automáticos
• Vinculação de documentos

Em que posso ajudá-lo hoje?`;
      } else {
        responseContent = `Entendi sua solicitação. Baseado no contexto atual, vou analisar e fornecer as informações mais relevantes.

${
  input.includes("código") || input.includes("lei")
    ? "📚 Consultando legislação aplicável..."
    : input.includes("jurisprudência")
      ? "⚖️ Buscando precedentes relacionados..."
      : "🔍 Processando sua solicitação..."
}

Aguarde um momento enquanto processo essas informações.`;
      }
    }

    return {
      id: `assistant_${Date.now()}`,
      role: "assistant",
      content: responseContent,
      timestamp: new Date().toISOString(),
      type: responseType,
      metadata,
    };
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Conteúdo copiado para a área de transferência");
  };

  const downloadMessage = (message: IAMessage) => {
    const blob = new Blob([message.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ia-response-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Arquivo baixado com sucesso");
  };

  const getMessageIcon = (type: IAMessage["type"]) => {
    switch (type) {
      case "summary":
        return <FileText className="h-4 w-4" />;
      case "petition":
        return <Gavel className="h-4 w-4" />;
      case "analysis":
        return <AlertTriangle className="h-4 w-4" />;
      case "suggestion":
        return <Sparkles className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: IAMessage["type"]) => {
    switch (type) {
      case "summary":
        return "Resumo";
      case "petition":
        return "Petição";
      case "analysis":
        return "Análise";
      case "suggestion":
        return "Sugestão";
      default:
        return "Resposta";
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`fixed bottom-4 right-4 z-50 ${className}`}
      >
        <Card
          className={`w-96 ${isMinimized ? "h-16" : "h-[600px]"} shadow-xl border transition-all duration-300`}
        >
          <CardHeader className="pb-2 px-4 py-3 bg-gradient-to-r from-[rgb(var(--theme-primary))] to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-white/20 rounded-full">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium">
                    IA Jurídica
                  </CardTitle>
                  <p className="text-xs opacity-90">
                    {context?.type === "PUBLICACAO_ANALYSIS"
                      ? "Análise de Publicação"
                      : context?.type === "PROCESS_CONSULTATION"
                        ? "Consulta Processual"
                        : "Assistente Geral"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-6 w-6 p-0 text-white hover:bg-white/20"
                >
                  {isMinimized ? (
                    <Maximize2 className="h-3 w-3" />
                  ) : (
                    <Minimize2 className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-6 w-6 p-0 text-white hover:bg-white/20"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] ${message.role === "user" ? "order-2" : "order-1"}`}
                      >
                        <div
                          className={`flex items-start space-x-2 ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                        >
                          <div
                            className={`p-2 rounded-full ${message.role === "user" ? "bg-[rgb(var(--theme-primary))]" : "bg-muted"}`}
                          >
                            {message.role === "user" ? (
                              <User className="h-3 w-3 text-white" />
                            ) : (
                              <Bot className="h-3 w-3" />
                            )}
                          </div>
                          <div
                            className={`rounded-lg p-3 ${message.role === "user" ? "bg-[rgb(var(--theme-primary))] text-white" : "bg-muted"}`}
                          >
                            {message.role === "assistant" &&
                              message.type &&
                              message.type !== "text" && (
                                <div className="flex items-center justify-between mb-2">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {getMessageIcon(message.type)}
                                    <span className="ml-1">
                                      {getTypeLabel(message.type)}
                                    </span>
                                  </Badge>
                                  <div className="flex space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        copyMessage(message.content)
                                      }
                                      className="h-6 w-6 p-0"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => downloadMessage(message)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            <div className="text-sm whitespace-pre-wrap">
                              {message.content}
                            </div>
                            {message.metadata?.actions && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {message.metadata.actions.map(
                                  (action, index) => (
                                    <Button
                                      key={index}
                                      variant="outline"
                                      size="sm"
                                      className="text-xs h-6"
                                      onClick={() =>
                                        toast.info(`Executando: ${action}`)
                                      }
                                    >
                                      {action}
                                    </Button>
                                  ),
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div
                          className={`text-xs text-muted-foreground mt-1 ${message.role === "user" ? "text-right" : "text-left"}`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString(
                            "pt-BR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start space-x-2">
                        <div className="p-2 rounded-full bg-muted">
                          <Bot className="h-3 w-3" />
                        </div>
                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.1s]" />
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <Separator />

              <div className="p-4">
                <div className="flex space-x-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Digite sua pergunta..."
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    size="sm"
                    className="bg-[rgb(var(--theme-primary))] hover:bg-[rgb(var(--theme-primary))]/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-center">
                  Powered by Lawdesk AI • Dados processados localmente
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
