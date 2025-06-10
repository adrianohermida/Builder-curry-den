/**
 * 💬 LAWDESK CONVERSATION WIDGET - BRANDING REFINADO
 *
 * Widget de conversação com branding Lawdesk:
 * - Design elegante e minimalista
 * - Cores do tema integradas
 * - UX otimizada para mobile
 * - Sem amarelo/laranja
 */

import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  Send,
  User,
  Bot,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Minimize2,
  Maximize2,
  Headphones,
  Video,
  FileText,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: "user" | "agent" | "bot";
  content: string;
  timestamp: Date;
  status?: "sent" | "delivered" | "read";
}

interface LawdeskConversationWidgetProps {
  mode?: "client" | "admin";
  theme?: "light" | "dark" | "color";
}

export const LawdeskConversationWidget: React.FC<
  LawdeskConversationWidgetProps
> = ({ mode = "client", theme = "light" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "agent",
      content: "Olá! Sou da equipe Lawdesk. Como posso ajudá-lo hoje?",
      timestamp: new Date(Date.now() - 5 * 60000),
      status: "read",
    },
    {
      id: "2",
      type: "bot",
      content:
        "Estou disponível 24/7 para responder suas dúvidas sobre o sistema e suporte técnico.",
      timestamp: new Date(Date.now() - 4 * 60000),
      status: "read",
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [agentStatus, setAgentStatus] = useState<"online" | "busy" | "offline">(
    "online",
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
      status: "sent",
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // Simulate typing response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response: Message = {
        id: (Date.now() + 1).toString(),
        type: "agent",
        content:
          "Obrigado pela sua mensagem! Nossa equipe está analisando e responderá em breve. Tempo médio de resposta: 2-3 minutos.",
        timestamp: new Date(),
        status: "delivered",
      };
      setMessages((prev) => [...prev, response]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = () => {
    switch (agentStatus) {
      case "online":
        return "bg-green-500";
      case "busy":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getThemeColors = () => {
    if (mode === "admin") {
      return {
        primary: "bg-red-500 hover:bg-red-600",
        primaryBorder: "border-red-600",
        primaryText: "text-red-600",
        primaryBg: "bg-red-50",
      };
    } else if (theme === "color") {
      return {
        primary: "bg-violet-500 hover:bg-violet-600",
        primaryBorder: "border-violet-600",
        primaryText: "text-violet-600",
        primaryBg: "bg-violet-50",
      };
    } else {
      return {
        primary: "bg-blue-500 hover:bg-blue-600",
        primaryBorder: "border-blue-600",
        primaryText: "text-blue-600",
        primaryBg: "bg-blue-50",
      };
    }
  };

  const colors = getThemeColors();

  // Widget Button
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "w-14 h-14 rounded-full elevated-3 transition-all duration-300 hover:scale-110 flex items-center justify-center group relative",
            colors.primary,
          )}
          title="Abrir suporte"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}

          {/* Pulse animation for attention */}
          <div
            className={cn(
              "absolute inset-0 rounded-full animate-ping opacity-20",
              colors.primary,
            )}
          />
        </button>
      </div>
    );
  }

  // Chat Window
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={cn(
          "theme-bg rounded-lg elevated-3 border transition-all duration-300",
          "border-slate-200 dark:border-slate-700",
          isMinimized ? "w-80 h-14" : "w-96 h-[32rem]",
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center justify-between p-4 border-b rounded-t-lg",
            colors.primary,
            colors.primaryBorder,
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Headphones className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">
                {mode === "admin" ? "Suporte Técnico Admin" : "Suporte Lawdesk"}
              </h3>
              <div className="flex items-center gap-1">
                <div className={cn("w-2 h-2 rounded-full", getStatusColor())} />
                <span className="text-white/80 text-xs">
                  {agentStatus === "online"
                    ? "Online"
                    : agentStatus === "busy"
                      ? "Ocupado"
                      : "Offline"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              title={isMinimized ? "Expandir" : "Minimizar"}
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4 text-white" />
              ) : (
                <Minimize2 className="w-4 h-4 text-white" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              title="Fechar"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Quick Actions */}
            <div className="p-3 border-b theme-surface border-slate-100 dark:border-slate-800">
              <div className="grid grid-cols-4 gap-2">
                <button
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors",
                    "hover:theme-accent text-slate-700 dark:text-slate-300",
                  )}
                  title="Ligar para suporte"
                >
                  <Phone className="w-4 h-4" />
                  <span>Ligar</span>
                </button>
                <button
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors",
                    "hover:theme-accent text-slate-700 dark:text-slate-300",
                  )}
                  title="Enviar email"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </button>
                <button
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors",
                    "hover:theme-accent text-slate-700 dark:text-slate-300",
                  )}
                  title="Videochamada"
                >
                  <Video className="w-4 h-4" />
                  <span>Vídeo</span>
                </button>
                <button
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors",
                    "hover:theme-accent text-slate-700 dark:text-slate-300",
                  )}
                  title="Base de conhecimento"
                >
                  <FileText className="w-4 h-4" />
                  <span>Docs</span>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 p-4 space-y-4 overflow-y-auto modern-scroll theme-bg"
              style={{ height: "20rem" }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.type === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] flex gap-2",
                      msg.type === "user" ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                        msg.type === "user"
                          ? mode === "admin"
                            ? "bg-red-500"
                            : theme === "color"
                              ? "bg-violet-500"
                              : "bg-blue-500"
                          : msg.type === "bot"
                            ? "bg-slate-500"
                            : "bg-green-500",
                      )}
                    >
                      {msg.type === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : msg.type === "bot" ? (
                        <Bot className="w-4 h-4 text-white" />
                      ) : (
                        <Headphones className="w-4 h-4 text-white" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div
                      className={cn(
                        "flex flex-col",
                        msg.type === "user" ? "items-end" : "items-start",
                      )}
                    >
                      <div
                        className={cn(
                          "px-3 py-2 rounded-lg max-w-full break-words",
                          msg.type === "user"
                            ? mode === "admin"
                              ? "bg-red-500 text-white"
                              : theme === "color"
                                ? "bg-violet-500 text-white"
                                : "bg-blue-500 text-white"
                            : "theme-surface text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700",
                        )}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {formatTime(msg.timestamp)}
                        </span>
                        {msg.type === "user" && msg.status && (
                          <CheckCircle2
                            className={cn(
                              "w-3 h-3",
                              msg.status === "read"
                                ? "text-green-500"
                                : msg.status === "delivered"
                                  ? colors.primaryText
                                  : "text-slate-400",
                            )}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Headphones className="w-4 h-4 text-white" />
                    </div>
                    <div className="px-3 py-2 rounded-lg theme-surface border border-slate-200 dark:border-slate-700">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t theme-surface border-slate-100 dark:border-slate-800">
              <div className="flex gap-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  rows={1}
                  className={cn(
                    "flex-1 px-3 py-2 rounded-lg border resize-none focus:outline-none focus:ring-2 transition-all",
                    "theme-bg border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400",
                    "focus:ring-blue-500/20 focus:border-blue-500",
                  )}
                  style={{ minHeight: "40px", maxHeight: "120px" }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
                    message.trim()
                      ? colors.primary
                      : "bg-slate-300 dark:bg-slate-600 text-slate-500 cursor-not-allowed",
                  )}
                  title="Enviar"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Quick responses */}
              <div className="mt-2 flex gap-1 overflow-x-auto">
                {[
                  "Preciso de ajuda",
                  "Problema técnico",
                  "Dúvida sobre cobrança",
                  "Sugestão",
                ].map((quick, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(quick)}
                    className="flex-shrink-0 px-2 py-1 text-xs rounded-full theme-accent text-slate-600 dark:text-slate-400 hover:theme-surface transition-colors"
                  >
                    {quick}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer - Rating */}
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 theme-surface">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Como foi nosso atendimento?</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="hover:text-yellow-400 transition-colors"
                      title={`${star} estrela${star > 1 ? "s" : ""}`}
                    >
                      <Star className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LawdeskConversationWidget;
