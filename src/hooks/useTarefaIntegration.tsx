import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface CreateTarefaParams {
  titulo: string;
  descricao: string;
  cliente?: {
    id: string;
    nome: string;
    tipo: "fisica" | "juridica";
  };
  processo?: {
    id: string;
    numero: string;
    assunto: string;
  };
  prioridade: "baixa" | "media" | "alta" | "urgente";
  responsavel: {
    id: string;
    nome: string;
  };
  dataVencimento: string;
  origem:
    | "manual"
    | "crm"
    | "ged"
    | "publicacao"
    | "atendimento"
    | "agenda"
    | "ia";
  origemDetalhes?: {
    modulo: string;
    itemId: string;
    itemTitulo: string;
  };
  tags?: string[];
  integracaoAgenda?: boolean;
  integracaoIA?: {
    sugestoesPeticao?: boolean;
    elaboracaoRascunho?: boolean;
    resumoAutomatico?: boolean;
  };
}

export interface TarefaIntegrationContext {
  // Criar tarefa a partir de diferentes módulos
  criarTarefaDeCRM: (
    clienteId: string,
    processoId?: string,
    titulo?: string,
  ) => void;
  criarTarefaDeGED: (
    folderId: string,
    documentId?: string,
    titulo?: string,
  ) => void;
  criarTarefaDePublicacao: (publicacaoId: string, titulo?: string) => void;
  criarTarefaDeAtendimento: (ticketId: string, titulo?: string) => void;
  criarTarefaDeIA: (contexto: string, titulo?: string) => void;

  // Funções auxiliares
  abrirModalCriarTarefa: (params?: Partial<CreateTarefaParams>) => void;
  obterTarefasDoCliente: (clienteId: string) => Promise<any[]>;
  obterTarefasDoProcesso: (processoId: string) => Promise<any[]>;

  // Estado do modal
  isModalOpen: boolean;
  modalParams: Partial<CreateTarefaParams> | null;
  setModalOpen: (open: boolean) => void;
}

export const useTarefaIntegration = (): TarefaIntegrationContext => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalParams, setModalParams] =
    useState<Partial<CreateTarefaParams> | null>(null);

  const setModalOpen = useCallback((open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setModalParams(null);
    }
  }, []);

  const abrirModalCriarTarefa = useCallback(
    (params?: Partial<CreateTarefaParams>) => {
      setModalParams(params || null);
      setIsModalOpen(true);
    },
    [],
  );

  const criarTarefaDeCRM = useCallback(
    (clienteId: string, processoId?: string, titulo?: string) => {
      // Buscar dados do cliente do localStorage ou contexto
      const clientesData = JSON.parse(
        localStorage.getItem("lawdesk_crm_clients") || "[]",
      );
      const cliente = clientesData.find((c: any) => c.id === clienteId);

      let processo = null;
      if (processoId) {
        const processosData = JSON.parse(
          localStorage.getItem("lawdesk_crm_processes") || "[]",
        );
        processo = processosData.find((p: any) => p.id === processoId);
      }

      const params: Partial<CreateTarefaParams> = {
        titulo: titulo || `Nova tarefa para ${cliente?.name || "cliente"}`,
        cliente: cliente
          ? {
              id: cliente.id,
              nome: cliente.name,
              tipo: cliente.type,
            }
          : undefined,
        processo: processo
          ? {
              id: processo.id,
              numero: processo.number,
              assunto: processo.subject,
            }
          : undefined,
        origem: "crm",
        origemDetalhes: {
          modulo: "CRM Jurídico",
          itemId: processoId || clienteId,
          itemTitulo: processo
            ? `Processo: ${processo.number}`
            : `Cliente: ${cliente?.name}`,
        },
        tags: ["crm"],
        prioridade: "media",
        integracaoAgenda: true,
        integracaoIA: {
          sugestoesPeticao: true,
          elaboracaoRascunho: true,
          resumoAutomatico: true,
        },
      };

      abrirModalCriarTarefa(params);
    },
    [abrirModalCriarTarefa],
  );

  const criarTarefaDeGED = useCallback(
    (folderId: string, documentId?: string, titulo?: string) => {
      // Buscar dados da estrutura GED do localStorage
      const gedTree = JSON.parse(
        localStorage.getItem("lawdesk_ged_tree") || "{}",
      );
      const gedFiles = JSON.parse(
        localStorage.getItem("lawdesk_ged_files") || "[]",
      );

      let folder = null;
      let document = null;

      // Função recursiva para encontrar a pasta
      const findFolder = (node: any, id: string): any => {
        if (node.id === id) return node;
        if (node.children) {
          for (const child of node.children) {
            const found = findFolder(child, id);
            if (found) return found;
          }
        }
        return null;
      };

      if (gedTree.children) {
        for (const root of gedTree.children) {
          folder = findFolder(root, folderId);
          if (folder) break;
        }
      }

      if (documentId) {
        document = gedFiles.find((f: any) => f.id === documentId);
      }

      const params: Partial<CreateTarefaParams> = {
        titulo: titulo || `Organizar documentos - ${folder?.name || "GED"}`,
        descricao: document
          ? `Processar documento: ${document.name}`
          : `Organizar documentos na pasta: ${folder?.name}`,
        origem: "ged",
        origemDetalhes: {
          modulo: "GED Jurídico",
          itemId: documentId || folderId,
          itemTitulo: document
            ? `Documento: ${document.name}`
            : `Pasta: ${folder?.name}`,
        },
        tags: ["ged", "documentos"],
        prioridade: "media",
        integracaoAgenda: false,
        integracaoIA: {
          sugestoesPeticao: false,
          elaboracaoRascunho: false,
          resumoAutomatico: true,
        },
      };

      abrirModalCriarTarefa(params);
    },
    [abrirModalCriarTarefa],
  );

  const criarTarefaDePublicacao = useCallback(
    (publicacaoId: string, titulo?: string) => {
      // Buscar dados da publicação (mock data ou localStorage)
      const publicacoesData = JSON.parse(
        localStorage.getItem("lawdesk_publicacoes") || "[]",
      );
      const publicacao = publicacoesData.find(
        (p: any) => p.id === publicacaoId,
      );

      const params: Partial<CreateTarefaParams> = {
        titulo:
          titulo ||
          `Analisar publicação - ${publicacao?.tribunal || "Tribunal"}`,
        descricao: publicacao
          ? `Analisar publicação: ${publicacao.assunto || publicacao.conteudo?.substring(0, 100)}`
          : `Analisar nova publicação judicial`,
        processo: publicacao?.processo
          ? {
              id: publicacao.processo.id,
              numero: publicacao.processo.numero,
              assunto: publicacao.processo.assunto,
            }
          : undefined,
        origem: "publicacao",
        origemDetalhes: {
          modulo: "Publicações",
          itemId: publicacaoId,
          itemTitulo: `Publicação: ${publicacao?.tribunal || "Judicial"}`,
        },
        tags: [
          "publicacao",
          "prazo",
          publicacao?.tribunal?.toLowerCase().replace(/\s+/g, "-"),
        ],
        prioridade: publicacao?.urgencia === "alta" ? "urgente" : "alta",
        integracaoAgenda: true,
        integracaoIA: {
          sugestoesPeticao: true,
          elaboracaoRascunho: true,
          resumoAutomatico: true,
        },
      };

      abrirModalCriarTarefa(params);
    },
    [abrirModalCriarTarefa],
  );

  const criarTarefaDeAtendimento = useCallback(
    (ticketId: string, titulo?: string) => {
      // Buscar dados do ticket
      const ticketsData = JSON.parse(
        localStorage.getItem("lawdesk_tickets") || "[]",
      );
      const ticket = ticketsData.find((t: any) => t.id === ticketId);

      const params: Partial<CreateTarefaParams> = {
        titulo:
          titulo || `Atender solicitação - ${ticket?.subject || "Cliente"}`,
        descricao: ticket
          ? `Atender ticket: ${ticket.subject}\n${ticket.description}`
          : `Atender solicitação de cliente`,
        cliente: ticket?.client
          ? {
              id: ticket.client.id,
              nome: ticket.client.name,
              tipo: ticket.client.type,
            }
          : undefined,
        origem: "atendimento",
        origemDetalhes: {
          modulo: "Atendimento",
          itemId: ticketId,
          itemTitulo: `Ticket: ${ticket?.subject || ticketId}`,
        },
        tags: [
          "atendimento",
          ticket?.priority?.toLowerCase(),
          ticket?.category?.toLowerCase().replace(/\s+/g, "-"),
        ],
        prioridade: ticket?.priority === "high" ? "alta" : "media",
        integracaoAgenda: true,
        integracaoIA: {
          sugestoesPeticao: false,
          elaboracaoRascunho: true,
          resumoAutomatico: true,
        },
      };

      abrirModalCriarTarefa(params);
    },
    [abrirModalCriarTarefa],
  );

  const criarTarefaDeIA = useCallback(
    (contexto: string, titulo?: string) => {
      const params: Partial<CreateTarefaParams> = {
        titulo: titulo || `Revisar análise de IA - ${contexto}`,
        descricao: `Revisar e validar análise gerada pela IA Jurídica no contexto: ${contexto}`,
        origem: "ia",
        origemDetalhes: {
          modulo: "IA Jurídica",
          itemId: `ia-${Date.now()}`,
          itemTitulo: `Análise IA: ${contexto}`,
        },
        tags: ["ia", "revisao", contexto.toLowerCase().replace(/\s+/g, "-")],
        prioridade: "media",
        integracaoAgenda: false,
        integracaoIA: {
          sugestoesPeticao: true,
          elaboracaoRascunho: true,
          resumoAutomatico: false,
        },
      };

      abrirModalCriarTarefa(params);
    },
    [abrirModalCriarTarefa],
  );

  const obterTarefasDoCliente = useCallback(async (clienteId: string) => {
    // Simular busca de tarefas por cliente
    const tarefas = JSON.parse(localStorage.getItem("lawdesk_tarefas") || "[]");
    return tarefas.filter((t: any) => t.cliente?.id === clienteId);
  }, []);

  const obterTarefasDoProcesso = useCallback(async (processoId: string) => {
    // Simular busca de tarefas por processo
    const tarefas = JSON.parse(localStorage.getItem("lawdesk_tarefas") || "[]");
    return tarefas.filter((t: any) => t.processo?.id === processoId);
  }, []);

  return {
    criarTarefaDeCRM,
    criarTarefaDeGED,
    criarTarefaDePublicacao,
    criarTarefaDeAtendimento,
    criarTarefaDeIA,
    abrirModalCriarTarefa,
    obterTarefasDoCliente,
    obterTarefasDoProcesso,
    isModalOpen,
    modalParams,
    setModalOpen,
  };
};

// Hook para componente de criação rápida de tarefas
export const useTarefaQuickCreate = () => {
  const integration = useTarefaIntegration();

  const QuickCreateTarefaButton = ({
    children,
    params,
    variant = "outline",
    size = "sm",
    className = "",
  }: {
    children: React.ReactNode;
    params?: Partial<CreateTarefaParams>;
    variant?: "outline" | "default" | "ghost";
    size?: "sm" | "default" | "lg";
    className?: string;
  }) => {
    return (
      <button
        onClick={() => integration.abrirModalCriarTarefa(params)}
        className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${className}`}
      >
        {children}
      </button>
    );
  };

  return {
    ...integration,
    QuickCreateTarefaButton,
  };
};
