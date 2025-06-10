/**
 * 🎯 COMMUNICATION WIDGET - WIDGET DE COMUNICAÇÃO
 *
 * Widget de comunicação integrado com:
 * - Chat em tempo real
 * - Suporte técnico
 * - Base de conhecimento
 * - Design moderno e acessível
 */

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Maximize2,
  HelpCircle,
  Phone,
  Mail,
  FileText,
  Bot,
  User,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
interface CommunicationWidgetProps {
  onClose?: () => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "support" | "bot";
  message: string;
  timestamp: Date;
  type?: "text" | "image" | "file";
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// Mock Data
const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    sender: "bot",
    message:
      "Olá! Sou o assistente virtual do Lawdesk. Como posso ajudá-lo hoje?",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
];

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "1",
    question: "Como cadastrar um novo cliente?",
    answer:
      "Para cadastrar um novo cliente, acesse o módulo 'CRM Jurídico' e clique no botão '+ Novo Cliente'. Preencha as informações obrigatórias e salve.",
    category: "CRM",
  },
  {
    id: "2",
    question: "Como acompanhar processos?",
    answer:
      "No módulo 'Processos e Publicações', você pode visualizar todos os processos em andamento e suas atualizações em tempo real.",
    category: "Processos",
  },
  {
    id: "3",
    question: "Como alterar o tema da aplicação?",
    answer:
      "Clique no seu avatar no canto superior direito, acesse 'Aparência' e escolha entre os temas Claro, Escuro ou Sistema.",
    category: "Interface",
  },
];

// Main Component
export const CommunicationWidget: React.FC<CommunicationWidgetProps> = ({
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opening chat
  useEffect(() => {
    if (isOpen && !isMinimized && activeTab === "chat") {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized, activeTab]);

  // Send Message
  const sendMessage = useCallback(async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      message: newMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Simulate response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        message:
          "Obrigado pela sua mensagem! Nossa equipe de suporte analisará sua solicitação e responderá em breve.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  }, [newMessage]);

  // Handle Enter Key
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage],
  );

  // Toggle Widget
  const toggleWidget = useCallback(() => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  }, [isOpen]);

  // Minimize/Maximize
  const toggleMinimize = useCallback(() => {
    setIsMinimized(!isMinimized);
  }, [isMinimized]);

  // Close Widget
  const handleClose = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  // Widget Button (when closed)
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleWidget}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          <MessageCircle size={24} />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col">
      {/* Widget Container */}
      <div
        className={`
          bg-background border border-border/60 rounded-lg shadow-2xl
          transition-all duration-300 ease-in-out
          ${isMinimized ? "h-14" : "h-96 md:h-[500px]"}
          w-80 md:w-96
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/60">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageCircle size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Suporte Lawdesk</h3>
              {!isMinimized && (
                <p className="text-xs text-muted-foreground">
                  Online • Resposta em minutos
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMinimize}
              className="p-1 h-8 w-8"
            >
              {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-1 h-8 w-8"
            >
              <X size={14} />
            </Button>
          </div>
        </div>

        {/* Content (when not minimized) */}
        {!isMinimized && (
          <div className="flex-1 flex flex-col">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col"
            >
              <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
                <TabsTrigger value="chat" className="text-xs">
                  <MessageCircle size={14} className="mr-1" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="faq" className="text-xs">
                  <HelpCircle size={14} className="mr-1" />
                  FAQ
                </TabsTrigger>
                <TabsTrigger value="contact" className="text-xs">
                  <Phone size={14} className="mr-1" />
                  Contato
                </TabsTrigger>
              </TabsList>

              {/* Chat Tab */}
              <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`
                            max-w-[80%] rounded-lg p-3 text-sm
                            ${
                              message.sender === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-accent text-accent-foreground"
                            }
                          `}
                        >
                          <p>{message.message}</p>
                          <p className={`text-xs mt-1 opacity-70`}>
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-accent text-accent-foreground rounded-lg p-3 text-sm">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-75"></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-150"></div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-border/60">
                  <div className="flex space-x-2">
                    <Input
                      ref={inputRef}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Digite sua mensagem..."
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} size="sm" className="px-3">
                      <Send size={14} />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* FAQ Tab */}
              <TabsContent value="faq" className="flex-1 mt-0">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-3">
                    {FAQ_ITEMS.map((item) => (
                      <div
                        key={item.id}
                        className="border border-border/60 rounded-lg p-3"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">
                            {item.question}
                          </h4>
                          <Badge variant="secondary" className="text-xs ml-2">
                            {item.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Contact Tab */}
              <TabsContent value="contact" className="flex-1 mt-0">
                <div className="p-4 space-y-4">
                  <div className="text-center">
                    <h4 className="font-semibold mb-2">Entre em Contato</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Nossa equipe está pronta para ajudar
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-sm"
                    >
                      <Phone size={16} className="mr-2" />
                      (11) 1234-5678
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start text-sm"
                    >
                      <Mail size={16} className="mr-2" />
                      suporte@lawdesk.com.br
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start text-sm"
                    >
                      <FileText size={16} className="mr-2" />
                      Central de Ajuda
                    </Button>
                  </div>

                  <Separator />

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      Horário de atendimento:
                      <br />
                      Segunda a Sexta: 9h às 18h
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationWidget;
