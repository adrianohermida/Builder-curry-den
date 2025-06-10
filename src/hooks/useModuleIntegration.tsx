import { useState } from "react";
import { toast } from "sonner";

export interface ModuleAction {
  type:
    | "CREATE_TASK"
    | "OPEN_TICKET"
    | "START_AI_CHAT"
    | "CREATE_PROCESS"
    | "UPDATE_CLIENT";
  module: "AGENDA" | "ATENDIMENTO" | "IA" | "CRM" | "PROCESSOS";
  data: any;
  source: string;
}

export interface TaskData {
  title: string;
  description: string;
  dueDate: Date;
  priority: "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";
  type:
    | "PRAZO_PROCESSUAL"
    | "ATENDIMENTO_CLIENTE"
    | "ANALISE_DOCUMENTO"
    | "PETICAO"
    | "AUDIENCIA";
  relatedEntity: {
    type: "PUBLICACAO" | "PROCESSO" | "CLIENTE" | "ATENDIMENTO";
    id: string;
  };
}

export interface TicketData {
  subject: string;
  description: string;
  priority: "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";
  client: string;
  category: "PUBLICACAO" | "PROCESSO" | "DOCUMENTO" | "CONSULTA";
  relatedEntity?: {
    type: "PUBLICACAO" | "PROCESSO";
    id: string;
  };
}

export interface AIContextData {
  type: "PUBLICACAO_ANALYSIS" | "PROCESS_CONSULTATION" | "PETITION_GENERATION";
  context: {
    publicacao?: any;
    processo?: any;
    cliente?: any;
  };
  initialMessage: string;
}

export function useModuleIntegration() {
  const [loading, setLoading] = useState(false);

  const executeAction = async (action: ModuleAction): Promise<any> => {
    setLoading(true);

    try {
      switch (action.type) {
        case "CREATE_TASK":
          return await createTask(action.data);
        case "OPEN_TICKET":
          return await openTicket(action.data);
        case "START_AI_CHAT":
          return await startAIChat(action.data);
        case "CREATE_PROCESS":
          return await createProcess(action.data);
        case "UPDATE_CLIENT":
          return await updateClient(action.data);
        default:
          throw new Error(`Ação não suportada: ${action.type}`);
      }
    } catch (error) {
      console.error("Erro ao executar ação:", error);
      toast.error("Erro ao executar ação no módulo");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: TaskData): Promise<any> => {
    // Simulação de criação de tarefa na agenda
    return new Promise((resolve) => {
      setTimeout(() => {
        const task = {
          id: `task_${Date.now()}`,
          ...taskData,
          status: "PENDENTE",
          createdAt: new Date().toISOString(),
          assignedTo: "current_user",
        };

        // Simular salvamento no localStorage para demonstração
        const existingTasks = JSON.parse(
          localStorage.getItem("lawdesk-tasks") || "[]",
        );
        existingTasks.push(task);
        localStorage.setItem("lawdesk-tasks", JSON.stringify(existingTasks));

        toast.success("Tarefa criada com sucesso na Agenda Jurídica");
        resolve(task);
      }, 1000);
    });
  };

  const openTicket = async (ticketData: TicketData): Promise<any> => {
    // Simulação de abertura de ticket no módulo de atendimento
    return new Promise((resolve) => {
      setTimeout(() => {
        const ticket = {
          id: `ticket_${Date.now()}`,
          ...ticketData,
          status: "ABERTO",
          createdAt: new Date().toISOString(),
          assignedTo: "current_user",
          responses: [],
        };

        // Simular salvamento no localStorage
        const existingTickets = JSON.parse(
          localStorage.getItem("lawdesk-tickets") || "[]",
        );
        existingTickets.push(ticket);
        localStorage.setItem(
          "lawdesk-tickets",
          JSON.stringify(existingTickets),
        );

        toast.success("Ticket aberto com sucesso no módulo de Atendimento");
        resolve(ticket);
      }, 1000);
    });
  };

  const startAIChat = async (aiData: AIContextData): Promise<any> => {
    // Simulação de início de conversa com IA
    return new Promise((resolve) => {
      setTimeout(() => {
        const chatSession = {
          id: `ai_chat_${Date.now()}`,
          ...aiData,
          messages: [
            {
              id: "initial",
              role: "assistant",
              content: aiData.initialMessage,
              timestamp: new Date().toISOString(),
            },
          ],
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
        };

        // Simular salvamento da sessão
        const existingChats = JSON.parse(
          localStorage.getItem("lawdesk-ai-chats") || "[]",
        );
        existingChats.push(chatSession);
        localStorage.setItem("lawdesk-ai-chats", JSON.stringify(existingChats));

        toast.success("Conversa iniciada com a IA Jurídica");
        resolve(chatSession);
      }, 800);
    });
  };

  const createProcess = async (processData: any): Promise<any> => {
    // Simulação de criação de processo no CRM
    return new Promise((resolve) => {
      setTimeout(() => {
        const processo = {
          id: `process_${Date.now()}`,
          ...processData,
          status: "ATIVO",
          createdAt: new Date().toISOString(),
          lastUpdate: new Date().toISOString(),
        };

        // Simular salvamento
        const existingProcesses = JSON.parse(
          localStorage.getItem("lawdesk-processes") || "[]",
        );
        existingProcesses.push(processo);
        localStorage.setItem(
          "lawdesk-processes",
          JSON.stringify(existingProcesses),
        );

        toast.success("Processo criado com sucesso no CRM");
        resolve(processo);
      }, 1200);
    });
  };

  const updateClient = async (clientData: any): Promise<any> => {
    // Simulação de atualização de cliente
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular busca e atualização do cliente
        const existingClients = JSON.parse(
          localStorage.getItem("lawdesk-clients") || "[]",
        );
        const clientIndex = existingClients.findIndex(
          (c: any) => c.id === clientData.id,
        );

        if (clientIndex >= 0) {
          existingClients[clientIndex] = {
            ...existingClients[clientIndex],
            ...clientData,
          };
          localStorage.setItem(
            "lawdesk-clients",
            JSON.stringify(existingClients),
          );
        }

        toast.success("Cliente atualizado com sucesso");
        resolve(clientData);
      }, 800);
    });
  };

  // Funções auxiliares para criar ações específicas
  const createTaskFromPublication = (
    publicacao: any,
    urgency: string,
  ): TaskData => {
    const priority = urgency as "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";

    return {
      title: `Analisar publicação: ${publicacao.tipo}`,
      description: `Publicação do ${publicacao.tribunal} sobre ${publicacao.assunto || "processo judicial"}.

Número do processo: ${publicacao.numeroProcesso || "Não informado"}
Data da publicação: ${new Date(publicacao.data).toLocaleDateString("pt-BR")}

Conteúdo: ${publicacao.conteudo?.substring(0, 200)}...`,
      dueDate: new Date(
        Date.now() +
          (priority === "CRITICA" ? 1 : priority === "ALTA" ? 3 : 7) *
            24 *
            60 *
            60 *
            1000,
      ),
      priority,
      type: "PRAZO_PROCESSUAL",
      relatedEntity: {
        type: "PUBLICACAO",
        id: publicacao.id,
      },
    };
  };

  const createTicketFromPublication = (
    publicacao: any,
    clientName: string,
  ): TicketData => {
    return {
      subject: `Nova publicação: ${publicacao.tipo}`,
      description: `Foi identificada uma nova publicação relacionada ao seu processo.

Tribunal: ${publicacao.tribunal}
Data: ${new Date(publicacao.data).toLocaleDateString("pt-BR")}
${publicacao.numeroProcesso ? `Processo: ${publicacao.numeroProcesso}` : ""}

Para mais detalhes, acesse o portal do cliente ou entre em contato conosco.`,
      priority: publicacao.urgency || "MEDIA",
      client: clientName,
      category: "PUBLICACAO",
      relatedEntity: {
        type: "PUBLICACAO",
        id: publicacao.id,
      },
    };
  };

  const createAIContextFromPublication = (publicacao: any): AIContextData => {
    return {
      type: "PUBLICACAO_ANALYSIS",
      context: {
        publicacao,
      },
      initialMessage: `Olá! Vou ajudá-lo a analisar esta publicação do ${publicacao.tribunal}.

**Publicação:** ${publicacao.tipo}
**Data:** ${new Date(publicacao.data).toLocaleDateString("pt-BR")}
${publicacao.numeroProcesso ? `**Processo:** ${publicacao.numeroProcesso}` : ""}

O que você gostaria de saber sobre esta publicação? Posso:

• Fazer um resumo detalhado
• Sugerir prazos e ações necessárias
• Gerar uma minuta de petição
• Explicar as implicações jurídicas
• Identificar riscos e oportunidades

Como posso ajudá-lo?`,
    };
  };

  // Função para sincronizar dados entre módulos
  const syncBetweenModules = async (
    entityType: string,
    entityId: string,
    updateData: any,
  ): Promise<void> => {
    try {
      // Atualizar dados em todos os módulos relacionados
      const modules = [
        "lawdesk-tasks",
        "lawdesk-tickets",
        "lawdesk-processes",
        "lawdesk-clients",
      ];

      modules.forEach((moduleKey) => {
        const moduleData = JSON.parse(localStorage.getItem(moduleKey) || "[]");
        const updatedData = moduleData.map((item: any) => {
          if (
            item.relatedEntity?.type === entityType &&
            item.relatedEntity?.id === entityId
          ) {
            return {
              ...item,
              ...updateData,
              lastSync: new Date().toISOString(),
            };
          }
          return item;
        });
        localStorage.setItem(moduleKey, JSON.stringify(updatedData));
      });

      // Log apenas em desenvolvimento
      if (import.meta.env?.MODE === "development") {
        console.log(`Sincronização completa para ${entityType}:${entityId}`);
      }
    } catch (error) {
      console.error("Erro na sincronização entre módulos:", error);
    }
  };

  return {
    loading,
    executeAction,
    createTaskFromPublication,
    createTicketFromPublication,
    createAIContextFromPublication,
    syncBetweenModules,
  };
}
