import { useState, useEffect, useRef, useCallback } from "react";
import { usePermissions } from "./usePermissions";
import { useViewMode } from "@/contexts/ViewModeContext";

// Tipos para o sistema de chat
export interface Mensagem {
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
  canal?: string;
  tipo?: string;
  lida: boolean;
}

export interface NovoTicket {
  titulo: string;
  descricao: string;
  prioridade: "baixa" | "media" | "alta" | "critica";
  categoria: "suporte" | "comercial" | "juridico" | "tecnico";
  anexos?: File[];
}

export interface TicketAtendimento {
  id: string;
  numero: string;
  titulo: string;
  descricao: string;
  status: "aberto" | "em_andamento" | "pendente" | "resolvido" | "fechado";
  prioridade: "baixa" | "media" | "alta" | "critica";
  categoria: string;
  cliente: {
    id: string;
    nome: string;
    email: string;
    avatar?: string;
  };
  agente?: {
    id: string;
    nome: string;
    email: string;
    avatar?: string;
    departamento: string;
  };
  mensagens: Mensagem[];
  criadoEm: Date;
  atualizadoEm: Date;
  resolvidoEm?: Date;
  sla: {
    tempoResposta: number; // em minutos
    tempoResolucao: number; // em horas
    vencimento: Date;
    status: "dentro_prazo" | "proximo_vencimento" | "vencido";
  };
  canal: "widget" | "email" | "whatsapp" | "telefone" | "interno";
  tags: string[];
  satisfacao?: {
    nota: number; // 1-5
    comentario?: string;
    respondidoEm: Date;
  };
}

// Simulação de dados (em produção viria do backend)
const mockTickets: TicketAtendimento[] = [
  {
    id: "1",
    numero: "TK-2025-001",
    titulo: "Problema de integração CRM",
    descricao: "Não consegue sincronizar dados entre módulos",
    status: "em_andamento",
    prioridade: "alta",
    categoria: "tecnico",
    cliente: {
      id: "user-1",
      nome: "Dr. Pedro Silva",
      email: "pedro@lawdesk.com.br",
      avatar: "",
    },
    agente: {
      id: "agent-1",
      nome: "Ana Silva",
      email: "ana@lawdesk.com",
      avatar: "",
      departamento: "Suporte Técnico",
    },
    mensagens: [],
    criadoEm: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    atualizadoEm: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
    sla: {
      tempoResposta: 15,
      tempoResolucao: 4,
      vencimento: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas
      status: "dentro_prazo",
    },
    canal: "widget",
    tags: ["integração", "crm", "urgente"],
  },
];

export function useChat() {
  const [messages, setMessages] = useState<Mensagem[]>([]);
  const [tickets, setTickets] = useState<TicketAtendimento[]>(mockTickets);
  const [ticketAtivo, setTicketAtivo] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [lastSeen, setLastSeen] = useState<Date>(new Date());

  const { user } = usePermissions();
  const { isAdminMode, currentMode } = useViewMode();

  // Simular conexão WebSocket (em produção seria real)
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  // Conectar ao WebSocket simulado
  useEffect(() => {
    // Simular conexão
    setIsConnected(true);

    // Carregar mensagens existentes
    if (ticketAtivo && user) {
      loadTicketMessages(ticketAtivo);
    }

    // Cleanup
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [user, ticketAtivo]);

  // Carregar mensagens de um ticket específico
  const loadTicketMessages = useCallback(
    (ticketId: string) => {
      const ticket = tickets.find((t) => t.id === ticketId);
      if (ticket) {
        setMessages(ticket.mensagens);
      }
    },
    [tickets],
  );

  // Enviar mensagem
  const sendMessage = useCallback(
    (messageData: {
      conteudo: string;
      canal: string;
      tipo: string;
      destinatario: string;
      anexos?: File[];
    }) => {
      if (!user || !messageData.conteudo.trim()) return;

      const novaMensagem: Mensagem = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        conteudo: messageData.conteudo,
        remetente: {
          id: user.id,
          nome: user.name || "Usuário",
          avatar: user.avatar,
          tipo: "usuario",
        },
        timestamp: new Date(),
        status: "enviando",
        departamento: messageData.canal,
        canal: messageData.canal,
        tipo: messageData.tipo,
        lida: false,
      };

      // Adicionar à lista de mensagens
      setMessages((prev) => [...prev, novaMensagem]);

      // Simular envio para o backend
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === novaMensagem.id ? { ...msg, status: "enviada" } : msg,
          ),
        );

        // Criar ou atualizar ticket
        if (!ticketAtivo) {
          criarNovoTicket({
            titulo: messageData.conteudo.substring(0, 50) + "...",
            descricao: messageData.conteudo,
            prioridade: "media",
            categoria: messageData.canal as any,
          });
        }
      }, 500);

      // Simular confirmação de leitura
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === novaMensagem.id ? { ...msg, status: "lida" } : msg,
          ),
        );
      }, 2000);
    },
    [user, ticketAtivo],
  );

  // Criar novo ticket
  const criarNovoTicket = useCallback(
    (ticketData: NovoTicket) => {
      if (!user) return null;

      const novoTicket: TicketAtendimento = {
        id: `ticket-${Date.now()}`,
        numero: `TK-2025-${String(tickets.length + 1).padStart(3, "0")}`,
        titulo: ticketData.titulo,
        descricao: ticketData.descricao,
        status: "aberto",
        prioridade: ticketData.prioridade,
        categoria: ticketData.categoria,
        cliente: {
          id: user.id,
          nome: user.name || "Usuário",
          email: user.email || "",
          avatar: user.avatar,
        },
        mensagens: [...messages],
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        sla: {
          tempoResposta: 15, // 15 minutos
          tempoResolucao:
            ticketData.prioridade === "critica"
              ? 2
              : ticketData.prioridade === "alta"
                ? 4
                : ticketData.prioridade === "media"
                  ? 8
                  : 24,
          vencimento: new Date(
            Date.now() +
              (ticketData.prioridade === "critica" ? 2 : 4) * 60 * 60 * 1000,
          ),
          status: "dentro_prazo",
        },
        canal: "widget",
        tags: [ticketData.categoria],
      };

      setTickets((prev) => [...prev, novoTicket]);
      setTicketAtivo(novoTicket.id);

      return novoTicket;
    },
    [user, messages, tickets.length],
  );

  // Buscar tickets do usuário
  const getUserTickets = useCallback(() => {
    if (!user) return [];
    return tickets.filter((ticket) => ticket.cliente.id === user.id);
  }, [user, tickets]);

  // Marcar mensagens como lidas
  const markAsRead = useCallback((messageIds: string[]) => {
    setMessages((prev) =>
      prev.map((msg) =>
        messageIds.includes(msg.id) ? { ...msg, lida: true } : msg,
      ),
    );
  }, []);

  // Obter estatísticas do atendimento
  const getAtendimentoStats = useCallback(() => {
    const userTickets = getUserTickets();

    return {
      totalTickets: userTickets.length,
      ticketsAbertos: userTickets.filter((t) => t.status === "aberto").length,
      ticketsEmAndamento: userTickets.filter((t) => t.status === "em_andamento")
        .length,
      ticketsResolvidos: userTickets.filter((t) => t.status === "resolvido")
        .length,
      tempoMedioResposta: "15 min", // Calculado dinamicamente
      satisfacaoMedia: 4.2, // Calculado das avaliações
      ultimaInteracao:
        userTickets.length > 0
          ? Math.max(...userTickets.map((t) => t.atualizadoEm.getTime()))
          : null,
    };
  }, [getUserTickets]);

  // Simular agente digitando
  const simulateAgentTyping = useCallback((duration: number = 2000) => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), duration);
  }, []);

  // Avaliar atendimento
  const avaliarAtendimento = useCallback(
    (ticketId: string, nota: number, comentario?: string) => {
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId
            ? {
                ...ticket,
                satisfacao: {
                  nota,
                  comentario,
                  respondidoEm: new Date(),
                },
                status: "fechado" as const,
              }
            : ticket,
        ),
      );
    },
    [],
  );

  // Reabrir ticket
  const reabrirTicket = useCallback(
    (ticketId: string, motivo: string) => {
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId
            ? {
                ...ticket,
                status: "aberto" as const,
                atualizadoEm: new Date(),
              }
            : ticket,
        ),
      );

      // Adicionar mensagem de reabertura
      const mensagemReabertura: Mensagem = {
        id: `reopen-${Date.now()}`,
        conteudo: `Ticket reaberto: ${motivo}`,
        remetente: {
          id: user?.id || "system",
          nome: user?.name || "Sistema",
          tipo: "usuario",
        },
        timestamp: new Date(),
        status: "enviada",
        ticketId,
        lida: false,
      };

      if (ticketAtivo === ticketId) {
        setMessages((prev) => [...prev, mensagemReabertura]);
      }
    },
    [user, ticketAtivo],
  );

  return {
    // Estado
    messages,
    tickets: getUserTickets(),
    ticketAtivo,
    isConnected,
    isTyping,
    lastSeen,

    // Ações
    sendMessage,
    criarNovoTicket,
    loadTicketMessages,
    markAsRead,
    avaliarAtendimento,
    reabrirTicket,
    setTicketAtivo,

    // Dados computados
    stats: getAtendimentoStats(),

    // Utilitários
    simulateAgentTyping,
  };
}

export default useChat;
