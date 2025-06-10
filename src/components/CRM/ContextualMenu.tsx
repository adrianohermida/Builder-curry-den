/**
 * ⋯ MENU CONTEXTUAL - CRM V3 MINIMALIA
 *
 * Menu de três pontos para ações contextuais em cada item:
 * - Editar, Excluir, Vincular, Discutir
 * - Ações específicas por tipo de item
 * - Design minimalista com tooltips
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Link,
  MessageCircle,
  Copy,
  Archive,
  Star,
  StarOff,
  Send,
  FileText,
  Calendar,
  DollarSign,
  Eye,
  Download,
  Share,
  Users,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ContextualAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  variant?: "default" | "destructive" | "secondary";
  separator?: boolean;
  disabled?: boolean;
  description?: string;
}

interface ContextualMenuProps {
  actions: ContextualAction[];
  onAction: (actionId: string) => void;
  trigger?: React.ReactNode;
  placement?: "bottom-end" | "bottom-start" | "top-end" | "top-start";
  className?: string;
}

export const ContextualMenu: React.FC<ContextualMenuProps> = ({
  actions,
  onAction,
  trigger,
  placement = "bottom-end",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Fechar com ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  const handleAction = (actionId: string) => {
    onAction(actionId);
    setIsOpen(false);
  };

  const getPlacementClasses = () => {
    switch (placement) {
      case "bottom-start":
        return "top-full left-0 mt-1";
      case "top-end":
        return "bottom-full right-0 mb-1";
      case "top-start":
        return "bottom-full left-0 mb-1";
      default: // bottom-end
        return "top-full right-0 mt-1";
    }
  };

  const defaultTrigger = (
    <Button
      ref={triggerRef}
      variant="ghost"
      size="sm"
      onClick={() => setIsOpen(!isOpen)}
      className={`
        h-8 w-8 p-0 rounded-lg
        hover:bg-gray-100 transition-colors
        ${isOpen ? "bg-gray-100" : ""}
        ${className}
      `}
      title="Mais opções"
    >
      <MoreHorizontal className="w-4 h-4 text-gray-500" />
    </Button>
  );

  return (
    <div className="relative inline-block">
      {trigger || defaultTrigger}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute z-50 w-56 
              bg-white border border-gray-200 rounded-lg shadow-lg
              py-1 ${getPlacementClasses()}
            `}
          >
            {actions.map((action, index) => (
              <React.Fragment key={action.id}>
                {action.separator && index > 0 && (
                  <div className="my-1 border-t border-gray-100" />
                )}

                <button
                  onClick={() => handleAction(action.id)}
                  disabled={action.disabled}
                  className={`
                    w-full px-3 py-2 text-left text-sm
                    flex items-center gap-3
                    transition-colors duration-150
                    ${
                      action.disabled
                        ? "text-gray-400 cursor-not-allowed"
                        : action.variant === "destructive"
                          ? "text-red-600 hover:bg-red-50"
                          : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
                  title={action.description}
                >
                  <span className="flex-shrink-0">{action.icon}</span>

                  <span className="flex-grow">{action.label}</span>

                  {action.shortcut && (
                    <span className="text-xs text-gray-400 font-mono">
                      {action.shortcut}
                    </span>
                  )}
                </button>
              </React.Fragment>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Ações predefinidas para diferentes tipos de itens
export const getClientActions = (clientId: string): ContextualAction[] => [
  {
    id: "view",
    label: "Visualizar",
    icon: <Eye className="w-4 h-4" />,
    shortcut: "Enter",
  },
  {
    id: "edit",
    label: "Editar",
    icon: <Edit className="w-4 h-4" />,
    shortcut: "E",
  },
  {
    id: "call",
    label: "Ligar",
    icon: <Phone className="w-4 h-4" />,
    shortcut: "C",
  },
  {
    id: "email",
    label: "E-mail",
    icon: <Mail className="w-4 h-4" />,
    shortcut: "M",
  },
  {
    id: "separator1",
    label: "",
    icon: <></>,
    separator: true,
  },
  {
    id: "new-process",
    label: "Novo Processo",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: "new-task",
    label: "Nova Tarefa",
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    id: "new-contract",
    label: "Novo Contrato",
    icon: <DollarSign className="w-4 h-4" />,
  },
  {
    id: "separator2",
    label: "",
    icon: <></>,
    separator: true,
  },
  {
    id: "discuss",
    label: "Discutir",
    icon: <MessageCircle className="w-4 h-4" />,
    description: "Iniciar discussão interna",
  },
  {
    id: "share",
    label: "Compartilhar",
    icon: <Share className="w-4 h-4" />,
  },
  {
    id: "duplicate",
    label: "Duplicar",
    icon: <Copy className="w-4 h-4" />,
  },
  {
    id: "separator3",
    label: "",
    icon: <></>,
    separator: true,
  },
  {
    id: "archive",
    label: "Arquivar",
    icon: <Archive className="w-4 h-4" />,
    variant: "secondary",
  },
  {
    id: "delete",
    label: "Excluir",
    icon: <Trash2 className="w-4 h-4" />,
    variant: "destructive",
    shortcut: "Del",
  },
];

export const getProcessActions = (processId: string): ContextualAction[] => [
  {
    id: "view",
    label: "Visualizar",
    icon: <Eye className="w-4 h-4" />,
    shortcut: "Enter",
  },
  {
    id: "edit",
    label: "Editar",
    icon: <Edit className="w-4 h-4" />,
    shortcut: "E",
  },
  {
    id: "separator1",
    label: "",
    icon: <></>,
    separator: true,
  },
  {
    id: "new-task",
    label: "Nova Tarefa",
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    id: "upload-doc",
    label: "Upload Documento",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: "separator2",
    label: "",
    icon: <></>,
    separator: true,
  },
  {
    id: "discuss",
    label: "Discutir",
    icon: <MessageCircle className="w-4 h-4" />,
  },
  {
    id: "link-client",
    label: "Vincular Cliente",
    icon: <Link className="w-4 h-4" />,
  },
  {
    id: "export",
    label: "Exportar",
    icon: <Download className="w-4 h-4" />,
  },
  {
    id: "separator3",
    label: "",
    icon: <></>,
    separator: true,
  },
  {
    id: "archive",
    label: "Arquivar",
    icon: <Archive className="w-4 h-4" />,
    variant: "secondary",
  },
  {
    id: "delete",
    label: "Excluir",
    icon: <Trash2 className="w-4 h-4" />,
    variant: "destructive",
    shortcut: "Del",
  },
];

export const getTaskActions = (taskId: string): ContextualAction[] => [
  {
    id: "complete",
    label: "Marcar Concluída",
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    id: "edit",
    label: "Editar",
    icon: <Edit className="w-4 h-4" />,
    shortcut: "E",
  },
  {
    id: "separator1",
    label: "",
    icon: <></>,
    separator: true,
  },
  {
    id: "assign",
    label: "Atribuir",
    icon: <Users className="w-4 h-4" />,
  },
  {
    id: "duplicate",
    label: "Duplicar",
    icon: <Copy className="w-4 h-4" />,
  },
  {
    id: "separator2",
    label: "",
    icon: <></>,
    separator: true,
  },
  {
    id: "discuss",
    label: "Discutir",
    icon: <MessageCircle className="w-4 h-4" />,
  },
  {
    id: "link",
    label: "Vincular",
    icon: <Link className="w-4 h-4" />,
  },
  {
    id: "separator3",
    label: "",
    icon: <></>,
    separator: true,
  },
  {
    id: "delete",
    label: "Excluir",
    icon: <Trash2 className="w-4 h-4" />,
    variant: "destructive",
    shortcut: "Del",
  },
];

export default ContextualMenu;
