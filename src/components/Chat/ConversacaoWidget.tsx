import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePermissions } from "@/hooks/usePermissions";
import { useViewMode } from "@/contexts/ViewModeContext";
import { ChatInterface } from "./ChatInterface";
import { useChat } from "@/hooks/useChat";

interface ConversacaoWidgetProps {
  className?: string;
}

// Status do atendimento
type AtendimentoStatus = "online" | "offline" | "busy" | "away";

// Tipos de canal de atendimento
type CanalAtendimento = "suporte" | "comercial" | "juridico" | "tecnico";

interface AgenteInfo {
  id: string;
  nome: string;
  avatar?: string;
  status: AtendimentoStatus;
  departamento: string;
  tempoResposta: string;
}

const agentesDisponiveis: AgenteInfo[] = [
  {
    id: "1",
    nome: "Ana Silva",
    avatar: "",
    status: "online",
    departamento: "Suporte Técnico",
    tempoResposta: "2 min",
  },
  {
    id: "2",
    nome: "Dr. Carlos Lima",
    avatar: "",
    status: "online",
    departamento: "Consultoria Jurídica",
    tempoResposta: "5 min",
  },
  {
    id: "3",
    nome: "Maria Santos",
    avatar: "",
    status: "busy",
    departamento: "Comercial",
    tempoResposta: "15 min",
  },
];

export function ConversacaoWidget({ className }: ConversacaoWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState("inicio");
  const [mensagem, setMensagem] = useState("");
  const [canalSelecionado, setCanalSelecionado] =
    useState<CanalAtendimento>("suporte");

  const { user, isAdmin } = usePermissions();
  const { isAdminMode, isClientMode } = useViewMode();
  const { messages, sendMessage, isConnected } = useChat();

  // Determinar o tipo de atendimento baseado no modo/perfil do usuário
  const tipoAtendimento = React.useMemo(() => {
    if (isAdminMode) {
      return "interno"; // Equipe Lawdesk ⇄ Equipe Lawdesk
    } else if (user?.role === "advogado" || user?.role === "cliente") {
      return "b2b"; // Cliente Lawdesk ⇄ Suporte Lawdesk
    } else {
      return "b2c"; // Cliente final ⇄ Cliente Lawdesk
    }
  }, [isAdminMode, user?.role]);

  // Configurações visuais baseadas no modo
  const widgetConfig = React.useMemo(() => {
    if (isAdminMode) {
      return {
        title: "Suporte Interno",
        subtitle: "Equipe Lawdesk",
        primaryColor: "bg-red-600 hover:bg-red-700",
        accentColor: "text-red-600",
        borderColor: "border-red-200",
      };
    } else {
      return {
        title: "Atendimento Lawdesk",
        subtitle: "Suporte Especializado",
        primaryColor: "bg-blue-600 hover:bg-blue-700",
        accentColor: "text-blue-600",
        borderColor: "border-blue-200",
      };
    }
  }, [isAdminMode]);

  // Agente ativo baseado no canal
  const agenteAtivo = React.useMemo(() => {
    const agentePorCanal = {
      suporte: agentesDisponiveis[0],
      comercial: agentesDisponiveis[2],
      juridico: agentesDisponiveis[1],
      tecnico: agentesDisponiveis[0],
    };
    return agentePorCanal[canalSelecionado];
  }, [canalSelecionado]);

  // Status de conexão
  const statusIcon = {
    online: <CheckCircle className="w-3 h-3 text-green-500" />,
    offline: <AlertCircle className="w-3 h-3 text-gray-400" />,
    busy: <Clock className="w-3 h-3 text-yellow-500" />,
    away: <Clock className="w-3 h-3 text-orange-500" />,
  };

  const enviarMensagem = () => {
    if (!mensagem.trim()) return;

    sendMessage({
      conteudo: mensagem,
      canal: canalSelecionado,
      tipo: tipoAtendimento,
      destinatario: agenteAtivo.id,
    });

    setMensagem("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  // Renderizar FAQ rápido
  const renderFAQ = () => (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm">Perguntas Frequentes</h3>
      <div className="space-y-2">
        {[
          "Como integrar o CRM?",
          "Problemas de login",
          "Configurar notificações",
          "Suporte a documentos",
        ].map((pergunta, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="w-full justify-start text-left h-auto p-3"
            onClick={() => {
              setMensagem(pergunta);
              setActiveTab("mensagens");
            }}
          >
            {pergunta}
          </Button>
        ))}
      </div>
    </div>
  );

  // Renderizar seletor de canal
  const renderCanais = () => (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm">Departamentos</h3>
      <div className="grid grid-cols-2 gap-2">
        {(
          ["suporte", "comercial", "juridico", "tecnico"] as CanalAtendimento[]
        ).map((canal) => (
          <Button
            key={canal}
            variant={canalSelecionado === canal ? "default" : "outline"}
            size="sm"
            className="h-auto p-2 flex flex-col items-center gap-1"
            onClick={() => setCanalSelecionado(canal)}
          >
            <span className="text-xs font-medium capitalize">{canal}</span>
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Botão Flutuante */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={cn("fixed bottom-6 right-6 z-50", className)}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className={cn(
                "w-14 h-14 rounded-full shadow-lg",
                widgetConfig.primaryColor,
                "relative overflow-hidden",
              )}
            >
              <MessageCircle className="w-6 h-6 text-white" />

              {/* Indicador de novas mensagens */}
              {messages.filter((m) => !m.lida).length > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">
                    {messages.filter((m) => !m.lida).length}
                  </span>
                </div>
              )}

              {/* Pulse de conexão */}
              {isConnected && (
                <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widget Expandido */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height: isMinimized ? "60px" : "500px",
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={cn(
              "fixed bottom-6 right-6 z-50 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border",
              "w-80 sm:w-96 overflow-hidden",
              widgetConfig.borderColor,
            )}
          >
            {/* Header */}
            <div
              className={cn(
                "flex items-center justify-between p-4 border-b",
                isAdminMode
                  ? "bg-red-50 dark:bg-red-900/20"
                  : "bg-blue-50 dark:bg-blue-900/20",
              )}
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={agenteAtivo.avatar} />
                  <AvatarFallback
                    className={cn("text-xs", widgetConfig.accentColor)}
                  >
                    {agenteAtivo.nome.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">
                      {widgetConfig.title}
                    </h3>
                    {statusIcon[agenteAtivo.status]}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {agenteAtivo.nome} • {agenteAtivo.tempoResposta}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Conteúdo - só mostra se não minimizado */}
            {!isMinimized && (
              <div className="flex flex-col h-[436px]">
                {/* Tabs */}
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="flex-1 flex flex-col"
                >
                  <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
                    <TabsTrigger value="inicio" className="text-xs">
                      Início
                    </TabsTrigger>
                    <TabsTrigger value="mensagens" className="text-xs">
                      Chat
                    </TabsTrigger>
                    <TabsTrigger value="ajuda" className="text-xs">
                      Ajuda
                    </TabsTrigger>
                  </TabsList>

                  {/* Conteúdo das Tabs */}
                  <div className="flex-1 overflow-hidden">
                    <TabsContent
                      value="inicio"
                      className="h-full m-0 p-4 space-y-4"
                    >
                      {renderCanais()}
                      {renderFAQ()}
                    </TabsContent>

                    <TabsContent
                      value="mensagens"
                      className="h-full m-0 flex flex-col"
                    >
                      <ChatInterface
                        messages={messages}
                        onSendMessage={sendMessage}
                        agente={agenteAtivo}
                        canal={canalSelecionado}
                        tipoAtendimento={tipoAtendimento}
                      />
                    </TabsContent>

                    <TabsContent value="ajuda" className="h-full m-0 p-4">
                      <div className="space-y-3">
                        <h3 className="font-semibold text-sm">
                          Central de Ajuda
                        </h3>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                          >
                            📚 Base de Conhecimento
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                          >
                            🎥 Tutoriais em Vídeo
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                          >
                            📞 Agendar Ligação
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                          >
                            📧 Enviar E-mail
                          </Button>
                        </div>

                        {/* Status do Sistema */}
                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                              Todos os sistemas operacionais
                            </span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
