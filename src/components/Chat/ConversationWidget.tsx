/**
 * 💬 CONVERSATION WIDGET - WIDGET DE CONVERSAÇÃO
 *
 * Widget de conversação moderno:
 * - Design compacto e elegante
 * - Animações suaves
 * - Suporte e chat
 * - Zero amarelo
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: "user" | "agent" | "bot";
  content: string;
  timestamp: Date;
  status?: "sent" | "delivered" | "read";
}

interface ConversationWidgetProps {
  mode?: "client" | "admin";
  theme?: "light" | "dark" | "color";
}

export const ConversationWidget: React.FC<ConversationWidgetProps> = ({
  mode = "client",
  theme = "light",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "agent",
      content: "Olá! Como posso ajudá-lo hoje?",
      timestamp: new Date(Date.now() - 5 * 60000),
      status: "read",
    },
    {
      id: "2",
      type: "bot",
      content:
        "Estou disponível 24/7 para responder suas dúvidas sobre o sistema.",
      timestamp: new Date(Date.now() - 4 * 60000),
      status: "read",
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
          "Obrigado pela sua mensagem! Nossa equipe irá responder em breve.",
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

  // Widget Button
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center group",
            mode === "admin"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600",
            theme === "dark" && "ring-2 ring-gray-800",
          )}
          title="Abrir chat"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>
    );
  }

  // Chat Window
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={cn(
          "bg-white rounded-lg shadow-2xl border transition-all duration-300",
          theme === "dark" && "bg-gray-900 border-gray-700 shadow-gray-900/50",
          isMinimized ? "w-80 h-14" : "w-96 h-[32rem]",
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center justify-between p-4 border-b rounded-t-lg",
            mode === "admin"
              ? "bg-red-500 border-red-600"
              : "bg-blue-500 border-blue-600",
            theme === "dark" && "border-gray-700",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">
                {mode === "admin" ? "Suporte Admin" : "Suporte Lawdesk"}
              </h3>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-white/80 text-xs">Online</span>
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
            <div
              className={cn(
                "p-3 border-b",
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-50 border-gray-200",
              )}
            >
              <div className="flex gap-2">
                <button
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    theme === "dark"
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-white text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <Phone className="w-3 h-3" />
                  Ligar
                </button>
                <button
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    theme === "dark"
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-white text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <Mail className="w-3 h-3" />
                  Email
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              className={cn(
                "flex-1 p-4 space-y-4 overflow-y-auto",
                theme === "dark" ? "bg-gray-900" : "bg-white",
              )}
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
                            : "bg-blue-500"
                          : msg.type === "bot"
                            ? "bg-purple-500"
                            : "bg-green-500",
                      )}
                    >
                      {msg.type === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : msg.type === "bot" ? (
                        <Bot className="w-4 h-4 text-white" />
                      ) : (
                        <MessageCircle className="w-4 h-4 text-white" />
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
                              : "bg-blue-500 text-white"
                            : theme === "dark"
                              ? "bg-gray-800 text-gray-300 border border-gray-700"
                              : "bg-gray-100 text-gray-900",
                        )}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span
                          className={cn(
                            "text-xs",
                            theme === "dark"
                              ? "text-gray-500"
                              : "text-gray-400",
                          )}
                        >
                          {formatTime(msg.timestamp)}
                        </span>
                        {msg.type === "user" && msg.status && (
                          <CheckCircle2
                            className={cn(
                              "w-3 h-3",
                              msg.status === "read"
                                ? "text-green-500"
                                : msg.status === "delivered"
                                  ? "text-blue-500"
                                  : "text-gray-400",
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
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <div
                      className={cn(
                        "px-3 py-2 rounded-lg",
                        theme === "dark"
                          ? "bg-gray-800 border border-gray-700"
                          : "bg-gray-100",
                      )}
                    >
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
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
            <div
              className={cn(
                "p-4 border-t",
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-50 border-gray-200",
              )}
            >
              <div className="flex gap-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  rows={1}
                  className={cn(
                    "flex-1 px-3 py-2 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
                    theme === "dark"
                      ? "bg-gray-900 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500",
                  )}
                  style={{ minHeight: "40px", maxHeight: "120px" }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
                    message.trim()
                      ? mode === "admin"
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed",
                  )}
                  title="Enviar"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConversationWidget;
