import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Smile,
  Image,
  FileText,
  Calendar,
  ExternalLink,
  Bot,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePermissions } from "@/hooks/usePermissions";

interface Mensagem {
  id: string;
  conteudo: string;
  remetente: {
    id: string;
    nome: string;
    avatar?: string;
    tipo: "usuario" | "agente" | "bot";
  };
  timestamp: Date;
  status: "enviando" | "enviada" | "lida" | "falhou";
  anexos?: {
    nome: string;
    tipo: string;
    url: string;
    tamanho?: string;
  }[];
  ticketId?: string;
  departamento?: string;
}

interface AgenteInfo {
  id: string;
  nome: string;
  avatar?: string;
  status: "online" | "offline" | "busy" | "away";
  departamento: string;
  tempoResposta: string;
}

interface ChatInterfaceProps {
  messages: Mensagem[];
  onSendMessage: (message: {
    conteudo: string;
    canal: string;
    tipo: string;
    destinatario: string;
  }) => void;
  agente: AgenteInfo;
  canal: string;
  tipoAtendimento: string;
}

// Mensagens automáticas/sugestões baseadas no contexto
const sugestoesMensagens = {
  suporte: [
    "Preciso de ajuda com login",
    "Como integrar o sistema?",
    "Reportar um bug",
    "Solicitar nova funcionalidade",
  ],
  comercial: [
    "Informações sobre planos",
    "Solicitar demonstração",
    "Falar com vendas",
    "Upgrade de conta",
  ],
  juridico: [
    "Dúvida sobre funcionalidade",
    "Suporte processual",
    "Configurar prazos",
    "Relatórios jurídicos",
  ],
  tecnico: [
    "Problema de performance",
    "Erro no sistema",
    "Configuração avançada",
    "Integração API",
  ],
};

// Respostas automáticas simuladas (em produção viria da IA Jurídica)
const respostasAutomaticas = {
  login:
    "Para problemas de login, verifique se está usando o e-mail correto e tente redefinir sua senha. Um agente pode ajudar em instantes!",
  integração:
    "Temos documentação completa sobre integrações em nossa base de conhecimento. Posso enviar os links relevantes.",
  bug: "Obrigado por reportar! Por favor, descreva o problema detalhadamente para que possamos investigar rapidamente.",
  planos:
    "Oferecemos planos desde R$ 97/mês para escritórios pequenos até soluções enterprise. Um consultor pode detalhar a melhor opção para você.",
};

export function ChatInterface({
  messages: initialMessages,
  onSendMessage,
  agente,
  canal,
  tipoAtendimento,
}: ChatInterfaceProps) {
  const [mensagem, setMensagem] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Mensagem[]>(initialMessages);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = usePermissions();

  // Auto scroll para última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Simular resposta do agente quando necessário
  const simularRespostaAgente = (conteudoOriginal: string) => {
    setTyping(true);

    setTimeout(
      () => {
        // Verificar se há resposta automática
        const palavrasChave = Object.keys(respostasAutomaticas);
        const palavraEncontrada = palavrasChave.find((palavra) =>
          conteudoOriginal.toLowerCase().includes(palavra),
        );

        let respostaConteudo =
          "Obrigado pela sua mensagem! Um de nossos especialistas responderá em breve.";

        if (palavraEncontrada) {
          respostaConteudo =
            respostasAutomaticas[
              palavraEncontrada as keyof typeof respostasAutomaticas
            ];
        }

        const novaResposta: Mensagem = {
          id: Date.now().toString(),
          conteudo: respostaConteudo,
          remetente: {
            id: agente.id,
            nome: agente.nome,
            avatar: agente.avatar,
            tipo: palavraEncontrada ? "bot" : "agente",
          },
          timestamp: new Date(),
          status: "enviada",
          departamento: canal,
        };

        setMessages((prev) => [...prev, novaResposta]);
        setTyping(false);
      },
      1500 + Math.random() * 1000,
    ); // Delay realista
  };

  const enviarMensagem = () => {
    if (!mensagem.trim()) return;

    const novaMensagem: Mensagem = {
      id: Date.now().toString(),
      conteudo: mensagem,
      remetente: {
        id: user?.id || "user",
        nome: user?.name || "Você",
        avatar: user?.avatar,
        tipo: "usuario",
      },
      timestamp: new Date(),
      status: "enviando",
      departamento: canal,
    };

    setMessages((prev) => [...prev, novaMensagem]);

    // Chamar callback parent
    onSendMessage({
      conteudo: mensagem,
      canal,
      tipo: tipoAtendimento,
      destinatario: agente.id,
    });

    // Simular resposta automática
    simularRespostaAgente(mensagem);

    setMensagem("");
    setMostrarSugestoes(false);

    // Simular mudança de status para enviada
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === novaMensagem.id ? { ...msg, status: "enviada" } : msg,
        ),
      );
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  const usarSugestao = (sugestao: string) => {
    setMensagem(sugestao);
    setMostrarSugestoes(false);
    inputRef.current?.focus();
  };

  const formatarTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case "enviando":
        return <Clock className="w-3 h-3 text-gray-400 animate-spin" />;
      case "enviada":
        return <CheckCircle2 className="w-3 h-3 text-blue-500" />;
      case "lida":
        return <CheckCircle2 className="w-3 h-3 text-green-500" />;
      case "falhou":
        return <AlertTriangle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Área de Mensagens */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {/* Mensagem de boas-vindas */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-4"
            >
              <Avatar className="w-12 h-12 mx-auto mb-2">
                <AvatarImage src={agente.avatar} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {agente.nome.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-medium text-sm">{agente.nome}</h3>
              <p className="text-xs text-gray-600 mt-1">
                {agente.departamento} • Responde em {agente.tempoResposta}
              </p>
              <Badge
                variant="secondary"
                className="mt-2 bg-green-100 text-green-800"
              >
                ● Online agora
              </Badge>
            </motion.div>
          )}

          {/* Sugestões de mensagens */}
          {mostrarSugestoes && messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <p className="text-xs text-gray-600 text-center mb-3">
                Como posso ajudar você hoje?
              </p>
              <div className="space-y-2">
                {sugestoesMensagens[
                  canal as keyof typeof sugestoesMensagens
                ]?.map((sugestao, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left h-auto p-2 text-xs"
                    onClick={() => usarSugestao(sugestao)}
                  >
                    {sugestao}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Lista de mensagens */}
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-2",
                  message.remetente.tipo === "usuario"
                    ? "justify-end"
                    : "justify-start",
                )}
              >
                {message.remetente.tipo !== "usuario" && (
                  <Avatar className="w-6 h-6 mt-auto">
                    <AvatarImage src={message.remetente.avatar} />
                    <AvatarFallback className="text-xs">
                      {message.remetente.tipo === "bot" ? (
                        <Bot className="w-3 h-3" />
                      ) : (
                        message.remetente.nome.charAt(0)
                      )}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    "max-w-[85%] rounded-lg p-3 text-sm",
                    message.remetente.tipo === "usuario"
                      ? "bg-blue-600 text-white"
                      : message.remetente.tipo === "bot"
                        ? "bg-yellow-50 border border-yellow-200 text-yellow-800"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                  )}
                >
                  {/* Nome do remetente para mensagens de agente/bot */}
                  {message.remetente.tipo !== "usuario" && (
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {message.remetente.nome}
                      </span>
                      {message.remetente.tipo === "bot" && (
                        <Badge variant="secondary" className="text-xs h-4">
                          IA
                        </Badge>
                      )}
                    </div>
                  )}

                  <div>{message.conteudo}</div>

                  {/* Anexos */}
                  {message.anexos && message.anexos.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.anexos.map((anexo, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-white/10 rounded text-xs"
                        >
                          <FileText className="w-3 h-3" />
                          <span className="flex-1 truncate">{anexo.nome}</span>
                          <ExternalLink className="w-3 h-3 cursor-pointer" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Timestamp e status */}
                  <div
                    className={cn(
                      "flex items-center justify-between gap-2 mt-2 text-xs",
                      message.remetente.tipo === "usuario"
                        ? "text-blue-100"
                        : "text-gray-500 dark:text-gray-400",
                    )}
                  >
                    <span>{formatarTimestamp(message.timestamp)}</span>
                    {message.remetente.tipo === "usuario" && (
                      <div className="flex items-center gap-1">
                        {renderStatusIcon(message.status)}
                      </div>
                    )}
                  </div>
                </div>

                {message.remetente.tipo === "usuario" && (
                  <Avatar className="w-6 h-6 mt-auto">
                    <AvatarImage src={message.remetente.avatar} />
                    <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                      <User className="w-3 h-3" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Indicador de digitação */}
          {typing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-2 items-center"
            >
              <Avatar className="w-6 h-6">
                <AvatarImage src={agente.avatar} />
                <AvatarFallback className="text-xs">
                  {agente.nome.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input de mensagem */}
      <div className="border-t p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Input
                ref={inputRef}
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="text-sm"
                style={{ fontSize: "16px" }} // Previne zoom no iOS
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Anexar arquivo</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <Button
            onClick={enviarMensagem}
            disabled={!mensagem.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Indicador de status de conexão */}
        <div className="flex items-center justify-center mt-2">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Conectado • Criptografia ponta a ponta
          </span>
        </div>
      </div>
    </div>
  );
}
