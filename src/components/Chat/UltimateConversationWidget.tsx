/**
 * ULTIMATE CONVERSATION WIDGET V2
 * Modern, optimized chat interface for legal SaaS
 * Focus: Performance, Accessibility, Mobile-friendly
 */

import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  MessageSquare,
  Phone,
  Video,
  Mail,
  FileText,
  Minimize2,
  Maximize2,
  X,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Star,
  StarOff,
  Clock,
  Check,
  CheckCheck,
} from "lucide-react";
import { ThemeConfig } from "@/lib/ultimateDesignSystem";
import { performanceUtils } from "@/lib/performanceUtils";

// ===== TYPES =====
interface ConversationWidgetProps {
  minimized: boolean;
  onToggle: () => void;
  theme: ThemeConfig;
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "support" | "ai";
  timestamp: Date;
  status: "sending" | "sent" | "delivered" | "read";
  type: "text" | "file" | "system";
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  action: () => void;
  color: string;
}

// ===== CONSTANTS =====
const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "call",
    label: "Ligar",
    icon: Phone,
    action: () => console.log("Starting call"),
    color: "var(--color-success)",
  },
  {
    id: "video",
    label: "Vídeo",
    icon: Video,
    action: () => console.log("Starting video call"),
    color: "var(--primary-500)",
  },
  {
    id: "email",
    label: "Email",
    icon: Mail,
    action: () => console.log("Opening email"),
    color: "var(--color-info)",
  },
  {
    id: "docs",
    label: "Docs",
    icon: FileText,
    action: () => console.log("Opening documents"),
    color: "var(--text-secondary)",
  },
];

const SAMPLE_MESSAGES: Message[] = [
  {
    id: "1",
    content: "Olá! Como posso ajudá-lo hoje?",
    sender: "support",
    timestamp: new Date(Date.now() - 60000),
    status: "read",
    type: "text",
  },
  {
    id: "2",
    content: "Preciso de ajuda com um processo.",
    sender: "user",
    timestamp: new Date(Date.now() - 30000),
    status: "read",
    type: "text",
  },
  {
    id: "3",
    content:
      "Claro! Posso ajudar com questões sobre processos. Qual é a sua dúvida específica?",
    sender: "support",
    timestamp: new Date(Date.now() - 10000),
    status: "delivered",
    type: "text",
  },
];

// ===== MEMOIZED COMPONENTS =====
const MessageStatus = React.memo<{ status: Message["status"] }>(
  ({ status }) => {
    const getIcon = () => {
      switch (status) {
        case "sending":
          return <Clock size={12} />;
        case "sent":
          return <Check size={12} />;
        case "delivered":
          return <CheckCheck size={12} />;
        case "read":
          return (
            <CheckCheck size={12} style={{ color: "var(--primary-500)" }} />
          );
        default:
          return null;
      }
    };

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          color: "var(--text-tertiary)",
          fontSize: "0.75rem",
        }}
      >
        {getIcon()}
      </span>
    );
  },
);

const MessageBubble = React.memo<{
  message: Message;
  isUser: boolean;
}>(({ message, isUser }) => {
  const bubbleStyles = useMemo(
    () => ({
      container: {
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "var(--spacing-sm)",
      },
      bubble: {
        maxWidth: "80%",
        padding: "var(--spacing-sm) var(--spacing-md)",
        borderRadius: isUser
          ? "1rem 1rem 0.25rem 1rem"
          : "1rem 1rem 1rem 0.25rem",
        backgroundColor: isUser
          ? "var(--primary-500)"
          : "var(--surface-secondary)",
        color: isUser ? "white" : "var(--text-primary)",
        fontSize: "0.875rem",
        lineHeight: 1.4,
        wordBreak: "break-word" as const,
      },
      metadata: {
        display: "flex",
        alignItems: "center",
        justifyContent: isUser ? "flex-end" : "flex-start",
        gap: "var(--spacing-xs)",
        marginTop: "var(--spacing-xs)",
        fontSize: "0.75rem",
        color: "var(--text-tertiary)",
      },
    }),
    [isUser],
  );

  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  return (
    <div style={bubbleStyles.container}>
      <div>
        <div style={bubbleStyles.bubble}>{message.content}</div>
        <div style={bubbleStyles.metadata}>
          <span>{formatTime(message.timestamp)}</span>
          {isUser && <MessageStatus status={message.status} />}
        </div>
      </div>
    </div>
  );
});

const QuickActionButton = React.memo<{
  action: QuickAction;
  onClick: () => void;
}>(({ action, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "var(--spacing-xs)",
      padding: "var(--spacing-sm)",
      backgroundColor: "var(--surface-secondary)",
      border: "1px solid var(--border-primary)",
      borderRadius: "var(--radius-md)",
      cursor: "pointer",
      transition: "all var(--duration-normal) var(--easing-default)",
      minWidth: "60px",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = "var(--surface-tertiary)";
      e.currentTarget.style.transform = "translateY(-1px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "var(--surface-secondary)";
      e.currentTarget.style.transform = "translateY(0)";
    }}
    aria-label={action.label}
  >
    <action.icon size={18} style={{ color: action.color }} />
    <span
      style={{
        fontSize: "0.75rem",
        color: "var(--text-secondary)",
        fontWeight: "500",
      }}
    >
      {action.label}
    </span>
  </button>
));

// ===== MAIN WIDGET COMPONENT =====
const UltimateConversationWidget: React.FC<ConversationWidgetProps> = ({
  minimized,
  onToggle,
  theme,
}) => {
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [rating, setRating] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ===== HANDLERS =====
  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      status: "sending",
      type: "text",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // Simulate message delivery
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "sent" } : msg,
        ),
      );
    }, 1000);

    // Simulate support response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          content:
            "Obrigado pela sua mensagem! Vou analisar e responder em breve.",
          sender: "support",
          timestamp: new Date(),
          status: "delivered",
          type: "text",
        };
        setMessages((prev) => [...prev, responseMessage]);
      }, 1500);
    }, 2000);
  }, [inputValue]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  const handleRating = useCallback((stars: number) => {
    setRating(stars);
    performanceUtils.accessibilityUtils.announce(
      `Avaliação definida para ${stars} estrelas`,
      "polite",
    );
  }, []);

  // ===== EFFECTS =====
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!minimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [minimized]);

  // ===== STYLES =====
  const widgetStyles = useMemo(
    () => ({
      container: {
        position: "fixed" as const,
        bottom: minimized ? "var(--spacing-lg)" : "0",
        right: "var(--spacing-lg)",
        width: minimized ? "60px" : "380px",
        height: minimized ? "60px" : "500px",
        backgroundColor: "var(--surface-primary)",
        border: "1px solid var(--border-primary)",
        borderRadius: minimized
          ? "50%"
          : "var(--radius-lg) var(--radius-lg) 0 0",
        boxShadow: "var(--shadow-lg)",
        display: "flex",
        flexDirection: "column" as const,
        overflow: "hidden",
        transition: "all var(--duration-normal) var(--easing-default)",
        zIndex: 1000,
      },

      header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "var(--spacing-md)",
        backgroundColor: "var(--primary-500)",
        color: "white",
        minHeight: "60px",
      },

      headerTitle: {
        display: "flex",
        alignItems: "center",
        gap: "var(--spacing-sm)",
        fontSize: "0.875rem",
        fontWeight: "600",
      },

      headerActions: {
        display: "flex",
        alignItems: "center",
        gap: "var(--spacing-xs)",
      },

      messagesContainer: {
        flex: 1,
        padding: "var(--spacing-md)",
        overflowY: "auto" as const,
        backgroundColor: "var(--bg-primary)",
      },

      quickActions: {
        display: "flex",
        gap: "var(--spacing-sm)",
        padding: "var(--spacing-md)",
        borderTop: "1px solid var(--border-primary)",
        backgroundColor: "var(--surface-primary)",
      },

      inputContainer: {
        display: "flex",
        alignItems: "center",
        gap: "var(--spacing-sm)",
        padding: "var(--spacing-md)",
        borderTop: "1px solid var(--border-primary)",
        backgroundColor: "var(--surface-primary)",
      },

      input: {
        flex: 1,
        padding: "var(--spacing-sm) var(--spacing-md)",
        border: "1px solid var(--border-primary)",
        borderRadius: "var(--radius-lg)",
        backgroundColor: "var(--surface-secondary)",
        color: "var(--text-primary)",
        fontSize: "0.875rem",
        outline: "none",
        resize: "none" as const,
        maxHeight: "80px",
      },

      sendButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        backgroundColor: "var(--primary-500)",
        color: "white",
        border: "none",
        borderRadius: "50%",
        cursor: "pointer",
        transition: "all var(--duration-normal) var(--easing-default)",
      },

      minimizedButton: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--primary-500)",
        color: "white",
        border: "none",
        borderRadius: "50%",
        cursor: "pointer",
        transition: "all var(--duration-normal) var(--easing-default)",
      },

      typing: {
        padding: "var(--spacing-sm)",
        fontStyle: "italic",
        color: "var(--text-tertiary)",
        fontSize: "0.75rem",
      },

      rating: {
        display: "flex",
        alignItems: "center",
        gap: "var(--spacing-xs)",
        padding: "var(--spacing-sm) var(--spacing-md)",
        borderTop: "1px solid var(--border-primary)",
        backgroundColor: "var(--surface-secondary)",
      },
    }),
    [minimized],
  );

  // ===== RENDER =====
  if (minimized) {
    return (
      <div style={widgetStyles.container}>
        <button
          style={widgetStyles.minimizedButton}
          onClick={onToggle}
          aria-label="Abrir chat"
        >
          <MessageSquare size={24} />
        </button>
      </div>
    );
  }

  return (
    <div style={widgetStyles.container} className="conversation-widget">
      {/* Header */}
      <div style={widgetStyles.header}>
        <div style={widgetStyles.headerTitle}>
          <MessageSquare size={18} />
          <span>Suporte Lawdesk</span>
        </div>
        <div style={widgetStyles.headerActions}>
          <button
            onClick={onToggle}
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              padding: "var(--spacing-xs)",
              borderRadius: "var(--radius-sm)",
            }}
            aria-label="Minimizar chat"
          >
            <Minimize2 size={16} />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={widgetStyles.quickActions}>
        {QUICK_ACTIONS.map((action) => (
          <QuickActionButton
            key={action.id}
            action={action}
            onClick={action.action}
          />
        ))}
      </div>

      {/* Messages */}
      <div style={widgetStyles.messagesContainer} className="modern-scrollbar">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isUser={message.sender === "user"}
          />
        ))}

        {isTyping && (
          <div style={widgetStyles.typing}>Suporte está digitando...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Rating */}
      <div style={widgetStyles.rating}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
          Avalie o atendimento:
        </span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "2px",
            }}
            aria-label={`${star} estrelas`}
          >
            {rating && star <= rating ? (
              <Star
                size={16}
                fill="var(--color-warning)"
                color="var(--color-warning)"
              />
            ) : (
              <StarOff size={16} color="var(--text-tertiary)" />
            )}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={widgetStyles.inputContainer}>
        <button
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            padding: "var(--spacing-xs)",
          }}
          aria-label="Anexar arquivo"
        >
          <Paperclip size={18} />
        </button>

        <input
          ref={inputRef}
          style={widgetStyles.input}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua mensagem..."
          aria-label="Mensagem"
        />

        <button
          style={widgetStyles.sendButton}
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
          aria-label="Enviar mensagem"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--primary-600)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--primary-500)";
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default UltimateConversationWidget;
