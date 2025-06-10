/**
 * 🚀 BARRA DE AÇÕES RÁPIDAS - CRM V3 MINIMALIA
 *
 * Componente para ações rápidas contextuais:
 * - +Cliente, +Processo, +Tarefa
 * - Ações inteligentes baseadas no módulo ativo
 * - Design minimalista com foco na usabilidade
 */

import React from "react";
import { motion } from "framer-motion";
import {
  Plus,
  UserPlus,
  FileText,
  Calendar,
  Building,
  DollarSign,
  FolderPlus,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CRMV3Module } from "@/hooks/useCRMV3";

interface QuickActionBarProps {
  activeModule: CRMV3Module;
  onAction: (action: string) => void;
  className?: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  primary?: boolean;
  description?: string;
}

export const QuickActionBar: React.FC<QuickActionBarProps> = ({
  activeModule,
  onAction,
  className = "",
}) => {
  const getActionsForModule = (module: CRMV3Module): QuickAction[] => {
    const baseActions: QuickAction[] = [
      {
        id: "new-client",
        label: "Cliente",
        icon: <UserPlus className="w-4 h-4" />,
        shortcut: "Ctrl+N",
        primary: module === "clientes",
        description: "Novo cliente",
      },
      {
        id: "new-process",
        label: "Processo",
        icon: <FileText className="w-4 h-4" />,
        shortcut: "Ctrl+P",
        primary: module === "processos",
        description: "Novo processo",
      },
      {
        id: "new-task",
        label: "Tarefa",
        icon: <Calendar className="w-4 h-4" />,
        shortcut: "Ctrl+T",
        primary: module === "tarefas",
        description: "Nova tarefa",
      },
    ];

    // Adicionar ações específicas do módulo
    switch (module) {
      case "contratos":
        baseActions.push({
          id: "new-contract",
          label: "Contrato",
          icon: <Building className="w-4 h-4" />,
          primary: true,
          description: "Novo contrato",
        });
        break;

      case "financeiro":
        baseActions.push({
          id: "new-invoice",
          label: "Cobrança",
          icon: <DollarSign className="w-4 h-4" />,
          primary: true,
          description: "Nova cobrança",
        });
        break;

      case "documentos":
        baseActions.push({
          id: "upload-document",
          label: "Documento",
          icon: <FolderPlus className="w-4 h-4" />,
          primary: true,
          description: "Upload documento",
        });
        break;
    }

    return baseActions;
  };

  const actions = getActionsForModule(activeModule);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        flex items-center gap-2 p-2 bg-white border rounded-lg shadow-sm
        ${className}
      `}
    >
      {/* Ícone indicativo */}
      <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg">
        <Zap className="w-4 h-4 text-blue-600" />
      </div>

      {/* Ações rápidas */}
      <div className="flex items-center gap-1">
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Button
              variant={action.primary ? "default" : "outline"}
              size="sm"
              onClick={() => onAction(action.id)}
              className={`
                h-8 px-3 text-xs font-medium
                ${
                  action.primary
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "hover:bg-gray-50"
                }
                transition-all duration-150
              `}
              title={`${action.description}${action.shortcut ? ` (${action.shortcut})` : ""}`}
            >
              <Plus className="w-3 h-3 mr-1" />
              {action.label}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Separador */}
      <div className="w-px h-6 bg-gray-200" />

      {/* Ações extras contextuais */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction("bulk-actions")}
          className="h-8 px-2 text-xs text-gray-600 hover:text-gray-800"
          title="Ações em lote"
        >
          Lote
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction("import")}
          className="h-8 px-2 text-xs text-gray-600 hover:text-gray-800"
          title="Importar dados"
        >
          Importar
        </Button>
      </div>
    </motion.div>
  );
};

export default QuickActionBar;
