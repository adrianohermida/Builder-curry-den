import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  parseISO,
  format,
  isAfter,
  isBefore,
  isWithinInterval,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { IntegratedAppointment } from "@/pages/Agenda";
import { useTarefaIntegration } from "./useTarefaIntegration";
import { useAuditSystem, AUDIT_ACTIONS, AUDIT_MODULES } from "./useAuditSystem";

// Interfaces para integrações
interface ClienteIntegration {
  id: string;
  nome: string;
  documento: string;
  email?: string;
  telefone?: string;
  avatar?: string;
  status: "ativo" | "inativo" | "prospecto";
}

interface ProcessoIntegration {
  id: string;
  numero: string;
  nome: string;
  area: string;
  status: string;
  valor?: number;
  responsavel: string;
  cliente_id: string;
}

interface ContratoIntegration {
  id: string;
  numero: string;
  nome: string;
  status: string;
  valor?: number;
  cliente_id: string;
  data_inicio: string;
  data_fim?: string;
}

interface TarefaIntegration {
  id: string;
  titulo: string;
  descricao?: string;
  status: string;
  prioridade: string;
  data_vencimento: string;
  responsavel_id: string;
}

interface AtendimentoIntegration {
  id: string;
  numero: string;
  canal: "telefone" | "email" | "chat" | "presencial" | "video";
  status: string;
  cliente_id: string;
  responsavel_id: string;
  data_abertura: string;
}

interface FinanceiroIntegration {
  id: string;
  tipo: "receita" | "despesa" | "honorario";
  valor: number;
  status: string;
  categoria: string;
  cliente_id?: string;
  processo_id?: string;
  contrato_id?: string;
}

interface IAContextoIntegration {
  sessao_id: string;
  usuario_id: string;
  resumo?: string;
  sugestoes: string[];
  documentos_analisados: string[];
  data_criacao: string;
  status: "ativa" | "concluida" | "cancelada";
}

// Hook principal para agenda integrada
export function useAgendaIntegrada() {
  const [appointments, setAppointments] = useState<IntegratedAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    clientes: boolean;
    processos: boolean;
    contratos: boolean;
    tarefas: boolean;
    atendimentos: boolean;
    financeiro: boolean;
    ia: boolean;
  }>({
    clientes: false,
    processos: false,
    contratos: false,
    tarefas: false,
    atendimentos: false,
    financeiro: false,
    ia: false,
  });

  const { logAction } = useAuditSystem();
  const tarefaIntegration = useTarefaIntegration();

  // Carregar dados de clientes (mock)
  const loadClientes = useCallback(async (): Promise<ClienteIntegration[]> => {
    return [
      {
        id: "cli-001",
        nome: "João Silva",
        documento: "123.456.789-00",
        email: "joao.silva@email.com",
        telefone: "(11) 99999-9999",
        status: "ativo",
      },
      {
        id: "cli-002",
        nome: "Empresa XYZ Ltda",
        documento: "12.345.678/0001-90",
        email: "contato@empresaxyz.com",
        telefone: "(11) 3333-3333",
        status: "ativo",
      },
      {
        id: "cli-003",
        nome: "Carlos Oliveira",
        documento: "987.654.321-00",
        email: "carlos.oliveira@email.com",
        telefone: "(11) 8888-8888",
        status: "ativo",
      },
      {
        id: "cli-004",
        nome: "Maria Santos",
        documento: "456.789.123-00",
        email: "maria.santos.adv@email.com",
        telefone: "(11) 7777-7777",
        status: "ativo",
      },
    ];
  }, []);

  // Carregar dados de processos (mock)
  const loadProcessos = useCallback(async (): Promise<
    ProcessoIntegration[]
  > => {
    return [
      {
        id: "proc-001",
        numero: "1234567-89.2024.8.26.0001",
        nome: "João Silva vs. Empresa ABC Ltda",
        area: "Trabalhista",
        status: "ativo",
        valor: 50000,
        responsavel: "adv-001",
        cliente_id: "cli-001",
      },
      {
        id: "proc-002",
        numero: "9876543-21.2024.8.26.0001",
        nome: "Maria Santos vs. Banco DEF",
        area: "Civil",
        status: "recurso",
        valor: 80000,
        responsavel: "adv-001",
        cliente_id: "cli-004",
      },
    ];
  }, []);

  // Carregar dados de contratos (mock)
  const loadContratos = useCallback(async (): Promise<
    ContratoIntegration[]
  > => {
    return [
      {
        id: "cont-001",
        numero: "CONT-2024-001",
        nome: "Prestação de Serviços Jurídicos",
        status: "em_negociacao",
        valor: 120000,
        cliente_id: "cli-002",
        data_inicio: "2024-01-01T00:00:00Z",
        data_fim: "2024-12-31T23:59:59Z",
      },
    ];
  }, []);

  // Carregar dados de tarefas (mock)
  const loadTarefas = useCallback(async (): Promise<TarefaIntegration[]> => {
    return [
      {
        id: "tar-001",
        titulo: "Protocolar Recurso de Apelação",
        descricao: "Protocolar recurso no prazo legal",
        status: "em_andamento",
        prioridade: "critica",
        data_vencimento: "2024-01-29T17:00:00Z",
        responsavel_id: "adv-001",
      },
    ];
  }, []);

  // Carregar dados de atendimentos (mock)
  const loadAtendimentos = useCallback(async (): Promise<
    AtendimentoIntegration[]
  > => {
    return [
      {
        id: "atend-001",
        numero: "AT-2024-001",
        canal: "video",
        status: "agendado",
        cliente_id: "cli-003",
        responsavel_id: "adv-003",
        data_abertura: "2024-01-22T11:00:00Z",
      },
    ];
  }, []);

  // Carregar dados financeiros (mock)
  const loadFinanceiro = useCallback(async (): Promise<
    FinanceiroIntegration[]
  > => {
    return [
      {
        id: "fin-001",
        tipo: "receita",
        valor: 120000,
        status: "previsto",
        categoria: "Honorários",
        cliente_id: "cli-002",
        contrato_id: "cont-001",
      },
    ];
  }, []);

  // Carregar dados de IA (mock)
  const loadIAContexto = useCallback(async (): Promise<
    IAContextoIntegration[]
  > => {
    return [
      {
        sessao_id: "ia-sess-001",
        usuario_id: "adv-002",
        resumo: "Análise de cláusulas contratuais para identificação de riscos",
        sugestoes: [
          "Revisar cláusulas de rescisão",
          "Verificar penalidades por atraso",
          "Analisar garantias oferecidas",
        ],
        documentos_analisados: [
          "Contrato Base v1.pdf",
          "Aditivo Contratual.pdf",
        ],
        data_criacao: "2024-01-23T16:00:00Z",
        status: "ativa",
      },
    ];
  }, []);

  // Sincronizar dados de todos os módulos
  const syncAllModules = useCallback(async () => {
    setIsLoading(true);
    setSyncStatus({
      clientes: false,
      processos: false,
      contratos: false,
      tarefas: false,
      atendimentos: false,
      financeiro: false,
      ia: false,
    });

    try {
      // Carregar dados de todos os módulos
      const [
        clientes,
        processos,
        contratos,
        tarefas,
        atendimentos,
        financeiro,
        iaContexto,
      ] = await Promise.all([
        loadClientes(),
        loadProcessos(),
        loadContratos(),
        loadTarefas(),
        loadAtendimentos(),
        loadFinanceiro(),
        loadIAContexto(),
      ]);

      setSyncStatus((prev) => ({ ...prev, clientes: true }));
      setSyncStatus((prev) => ({ ...prev, processos: true }));
      setSyncStatus((prev) => ({ ...prev, contratos: true }));
      setSyncStatus((prev) => ({ ...prev, tarefas: true }));
      setSyncStatus((prev) => ({ ...prev, atendimentos: true }));
      setSyncStatus((prev) => ({ ...prev, financeiro: true }));
      setSyncStatus((prev) => ({ ...prev, ia: true }));

      // Log das sincronizações
      logAction(AUDIT_ACTIONS.READ, AUDIT_MODULES.CALENDAR, {
        sync_modules: {
          clientes: clientes.length,
          processos: processos.length,
          contratos: contratos.length,
          tarefas: tarefas.length,
          atendimentos: atendimentos.length,
          financeiro: financeiro.length,
          ia: iaContexto.length,
        },
      });

      return {
        clientes,
        processos,
        contratos,
        tarefas,
        atendimentos,
        financeiro,
        iaContexto,
      };
    } catch (error) {
      console.error("Erro ao sincronizar módulos:", error);
      toast.error("Erro ao sincronizar dados dos módulos");
      throw error;
    }
  }, [
    loadClientes,
    loadProcessos,
    loadContratos,
    loadTarefas,
    loadAtendimentos,
    loadFinanceiro,
    loadIAContexto,
    logAction,
  ]);

  // Criar compromisso integrado
  const createIntegratedAppointment = useCallback(
    async (
      appointmentData: Partial<IntegratedAppointment>,
    ): Promise<IntegratedAppointment> => {
      try {
        const newAppointment: IntegratedAppointment = {
          id: `apt-${Date.now()}`,
          titulo: appointmentData.titulo || "",
          descricao: appointmentData.descricao,
          dataInicio: appointmentData.dataInicio || new Date().toISOString(),
          dataFim:
            appointmentData.dataFim ||
            appointmentData.dataInicio ||
            new Date().toISOString(),
          diaInteiro: appointmentData.diaInteiro || false,
          tipo: appointmentData.tipo || "reuniao",
          status: appointmentData.status || "agendado",
          prioridade: appointmentData.prioridade || "media",
          local: appointmentData.local,
          participantes: appointmentData.participantes || [],
          cliente: appointmentData.cliente,
          processo: appointmentData.processo,
          contrato: appointmentData.contrato,
          tarefa: appointmentData.tarefa,
          atendimento: appointmentData.atendimento,
          financeiro: appointmentData.financeiro,
          ia_contexto: appointmentData.ia_contexto,
          responsavel: appointmentData.responsavel || {
            id: "user-1",
            nome: "Usuário Padrão",
          },
          equipe: appointmentData.equipe,
          lembretes: appointmentData.lembretes || [
            { tipo: "email", antecedencia: 30, ativo: true },
          ],
          anexos: appointmentData.anexos || [],
          recorrencia: appointmentData.recorrencia,
          custos: appointmentData.custos,
          metricas: appointmentData.metricas,
          observacoes: appointmentData.observacoes,
          tags: appointmentData.tags || [],
          cor: appointmentData.cor,
          privado: appointmentData.privado || false,
          criado: new Date().toISOString(),
          atualizado: new Date().toISOString(),
          criado_por: "user-1",
        };

        // Integrações automáticas
        if (newAppointment.tipo === "prazo" && newAppointment.processo) {
          await tarefaIntegration.criarTarefaDeProcesso(
            newAppointment.titulo,
            newAppointment.descricao || "",
            parseISO(newAppointment.dataInicio),
            newAppointment.processo.id,
          );
        }

        if (newAppointment.cliente) {
          await tarefaIntegration.criarTarefaDeCliente(
            `Follow-up: ${newAppointment.titulo}`,
            "Acompanhar resultado do compromisso",
            parseISO(newAppointment.dataFim),
            newAppointment.cliente.id,
          );
        }

        if (newAppointment.atendimento) {
          await tarefaIntegration.criarTarefaDeAtendimento(
            `Preparar atendimento: ${newAppointment.titulo}`,
            newAppointment.descricao || "",
            parseISO(newAppointment.dataInicio),
            newAppointment.atendimento.id,
          );
        }

        setAppointments((prev) => [...prev, newAppointment]);

        // Log da criação
        logAction(AUDIT_ACTIONS.CREATE, AUDIT_MODULES.CALENDAR, {
          appointment_id: newAppointment.id,
          tipo: newAppointment.tipo,
          integrations: {
            cliente: !!newAppointment.cliente,
            processo: !!newAppointment.processo,
            contrato: !!newAppointment.contrato,
            tarefa: !!newAppointment.tarefa,
            atendimento: !!newAppointment.atendimento,
            financeiro: !!newAppointment.financeiro,
            ia: !!newAppointment.ia_contexto,
          },
        });

        toast.success("Compromisso criado com sucesso!");
        return newAppointment;
      } catch (error) {
        console.error("Erro ao criar compromisso integrado:", error);
        toast.error("Erro ao criar compromisso");
        throw error;
      }
    },
    [tarefaIntegration, logAction],
  );

  // Atualizar compromisso
  const updateAppointment = useCallback(
    async (
      appointmentId: string,
      updates: Partial<IntegratedAppointment>,
    ): Promise<IntegratedAppointment> => {
      try {
        const updatedAppointment = {
          ...updates,
          id: appointmentId,
          atualizado: new Date().toISOString(),
          atualizado_por: "user-1",
        } as IntegratedAppointment;

        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === appointmentId ? updatedAppointment : apt,
          ),
        );

        logAction(AUDIT_ACTIONS.UPDATE, AUDIT_MODULES.CALENDAR, {
          appointment_id: appointmentId,
          fields_updated: Object.keys(updates),
        });

        toast.success("Compromisso atualizado com sucesso!");
        return updatedAppointment;
      } catch (error) {
        console.error("Erro ao atualizar compromisso:", error);
        toast.error("Erro ao atualizar compromisso");
        throw error;
      }
    },
    [logAction],
  );

  // Excluir compromisso
  const deleteAppointment = useCallback(
    async (appointmentId: string): Promise<void> => {
      try {
        setAppointments((prev) =>
          prev.filter((apt) => apt.id !== appointmentId),
        );

        logAction(AUDIT_ACTIONS.DELETE, AUDIT_MODULES.CALENDAR, {
          appointment_id: appointmentId,
        });

        toast.success("Compromisso excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir compromisso:", error);
        toast.error("Erro ao excluir compromisso");
        throw error;
      }
    },
    [logAction],
  );

  // Buscar compromissos por filtros
  const searchAppointments = useCallback(
    (filters: {
      searchTerm?: string;
      tipo?: string;
      status?: string;
      responsavel?: string;
      dateRange?: { start: Date; end: Date };
      integration?: string;
    }) => {
      let filtered = appointments;

      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(
          (apt) =>
            apt.titulo.toLowerCase().includes(term) ||
            apt.descricao?.toLowerCase().includes(term) ||
            apt.cliente?.nome.toLowerCase().includes(term) ||
            apt.processo?.numero.toLowerCase().includes(term) ||
            apt.contrato?.numero.toLowerCase().includes(term) ||
            apt.tags?.some((tag) => tag.toLowerCase().includes(term)),
        );
      }

      if (filters.tipo && filters.tipo !== "all") {
        filtered = filtered.filter((apt) => apt.tipo === filters.tipo);
      }

      if (filters.status && filters.status !== "all") {
        filtered = filtered.filter((apt) => apt.status === filters.status);
      }

      if (filters.responsavel && filters.responsavel !== "all") {
        filtered = filtered.filter(
          (apt) => apt.responsavel.id === filters.responsavel,
        );
      }

      if (filters.dateRange) {
        filtered = filtered.filter((apt) => {
          const aptDate = parseISO(apt.dataInicio);
          return isWithinInterval(aptDate, {
            start: filters.dateRange!.start,
            end: filters.dateRange!.end,
          });
        });
      }

      if (filters.integration && filters.integration !== "all") {
        filtered = filtered.filter((apt) => {
          switch (filters.integration) {
            case "cliente":
              return apt.cliente;
            case "processo":
              return apt.processo;
            case "contrato":
              return apt.contrato;
            case "tarefa":
              return apt.tarefa;
            case "atendimento":
              return apt.atendimento;
            case "financeiro":
              return apt.financeiro;
            case "ia":
              return apt.ia_contexto;
            default:
              return true;
          }
        });
      }

      return filtered;
    },
    [appointments],
  );

  // Estatísticas dos compromissos
  const getAppointmentStats = useCallback(() => {
    const today = new Date();

    return {
      total: appointments.length,
      hoje: appointments.filter((apt) => {
        const aptDate = parseISO(apt.dataInicio);
        return format(aptDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
      }).length,
      proximasSemana: appointments.filter((apt) => {
        const aptDate = parseISO(apt.dataInicio);
        return (
          isAfter(aptDate, today) &&
          isBefore(aptDate, new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000))
        );
      }).length,
      vencidos: appointments.filter((apt) => {
        const aptDate = parseISO(apt.dataInicio);
        return isBefore(aptDate, today) && apt.status !== "concluido";
      }).length,
      porTipo: appointments.reduce(
        (acc, apt) => {
          acc[apt.tipo] = (acc[apt.tipo] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
      porStatus: appointments.reduce(
        (acc, apt) => {
          acc[apt.status] = (acc[apt.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
      integracoes: {
        clientes: appointments.filter((apt) => apt.cliente).length,
        processos: appointments.filter((apt) => apt.processo).length,
        contratos: appointments.filter((apt) => apt.contrato).length,
        tarefas: appointments.filter((apt) => apt.tarefa).length,
        atendimentos: appointments.filter((apt) => apt.atendimento).length,
        financeiro: appointments.filter((apt) => apt.financeiro).length,
        ia: appointments.filter((apt) => apt.ia_contexto).length,
      },
    };
  }, [appointments]);

  // Gerar relatório de agenda
  const generateReport = useCallback(
    async (
      dateRange: { start: Date; end: Date },
      format: "pdf" | "excel" | "csv" = "pdf",
    ) => {
      try {
        const filteredAppointments = searchAppointments({ dateRange });
        const stats = getAppointmentStats();

        // Simular geração de relatório
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const reportData = {
          periodo: {
            inicio: format(dateRange.start, "dd/MM/yyyy", { locale: ptBR }),
            fim: format(dateRange.end, "dd/MM/yyyy", { locale: ptBR }),
          },
          total_compromissos: filteredAppointments.length,
          compromissos: filteredAppointments,
          estatisticas: stats,
          generated_at: new Date().toISOString(),
          format,
        };

        logAction(AUDIT_ACTIONS.READ, AUDIT_MODULES.CALENDAR, {
          action: "generate_report",
          format,
          appointments_count: filteredAppointments.length,
        });

        toast.success(`Relatório ${format.toUpperCase()} gerado com sucesso!`);
        return reportData;
      } catch (error) {
        console.error("Erro ao gerar relatório:", error);
        toast.error("Erro ao gerar relatório");
        throw error;
      }
    },
    [searchAppointments, getAppointmentStats, logAction],
  );

  return {
    // Estados
    appointments,
    isLoading,
    syncStatus,

    // Ações principais
    createIntegratedAppointment,
    updateAppointment,
    deleteAppointment,

    // Busca e filtros
    searchAppointments,

    // Sincronização
    syncAllModules,

    // Estatísticas
    getAppointmentStats,

    // Relatórios
    generateReport,

    // Estados setters (para compatibilidade)
    setAppointments,
    setIsLoading,
  };
}

export default useAgendaIntegrada;
