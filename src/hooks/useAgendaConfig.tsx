import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useAuditSystem, AUDIT_ACTIONS, AUDIT_MODULES } from "./useAuditSystem";

// Interfaces para configurações
interface GoogleCalendarConfig {
  conectado: boolean;
  email?: string;
  nome_usuario?: string;
  ultima_sincronizacao?: string;
  sincronizacao_automatica: boolean;
  calendario_padrao?: string;
  calendarios_disponiveis: Array<{
    id: string;
    nome: string;
    cor: string;
    principal: boolean;
    sincronizar: boolean;
  }>;
  configuracoes_avancadas: {
    sincronizar_bidirecionalmente: boolean;
    criar_eventos_lawdesk_no_google: boolean;
    importar_eventos_google_para_lawdesk: boolean;
    notificacoes_google: boolean;
  };
}

interface CalendlyStyleConfig {
  ativo: boolean;
  link_publico: string;
  nome_exibicao: string;
  descricao_perfil: string;
  foto_perfil?: string;
  tipos_eventos: Array<{
    id: string;
    nome: string;
    duracao: number; // em minutos
    descricao: string;
    preco?: number;
    cor: string;
    disponivel: boolean;
    buffer_antes: number; // tempo de preparação em minutos
    buffer_depois: number; // tempo após o evento em minutos
    localizacao: {
      tipo: "presencial" | "online" | "telefone" | "hibrido";
      endereco?: string;
      link_personalizado?: string;
      detalhes?: string;
    };
  }>;
  horarios_disponibilidade: {
    fuso_horario: string;
    segunda: {
      ativo: boolean;
      inicio: string;
      fim: string;
      intervalos?: Array<{ inicio: string; fim: string }>;
    };
    terca: {
      ativo: boolean;
      inicio: string;
      fim: string;
      intervalos?: Array<{ inicio: string; fim: string }>;
    };
    quarta: {
      ativo: boolean;
      inicio: string;
      fim: string;
      intervalos?: Array<{ inicio: string; fim: string }>;
    };
    quinta: {
      ativo: boolean;
      inicio: string;
      fim: string;
      intervalos?: Array<{ inicio: string; fim: string }>;
    };
    sexta: {
      ativo: boolean;
      inicio: string;
      fim: string;
      intervalos?: Array<{ inicio: string; fim: string }>;
    };
    sabado: {
      ativo: boolean;
      inicio: string;
      fim: string;
      intervalos?: Array<{ inicio: string; fim: string }>;
    };
    domingo: {
      ativo: boolean;
      inicio: string;
      fim: string;
      intervalos?: Array<{ inicio: string; fim: string }>;
    };
  };
  configuracoes_avancadas: {
    antecedencia_minima: number; // horas
    antecedencia_maxima: number; // dias
    maximo_eventos_por_dia: number;
    tempo_entre_eventos: number; // minutos
    perguntas_personalizadas: Array<{
      id: string;
      pergunta: string;
      tipo: "texto" | "email" | "telefone" | "textarea" | "select" | "radio";
      obrigatorio: boolean;
      opcoes?: string[]; // para select e radio
    }>;
    confirmacao_automatica: boolean;
    lembretes_email: boolean;
    lembretes_sms: boolean;
  };
}

interface TeamConfig {
  visibilidade_equipe: boolean;
  membros_visiveis: string[]; // IDs dos membros que devem aparecer
  cores_personalizadas: Record<string, string>; // ID do membro -> cor
  permissoes: {
    ver_agenda_todos: boolean;
    editar_eventos_outros: boolean;
    criar_eventos_equipe: boolean;
    gerenciar_configuracoes: boolean;
  };
  agenda_organizacao: {
    ativa: boolean;
    nome_organizacao: string;
    logo_organizacao?: string;
    descricao: string;
    link_publico_organizacao: string;
    responsaveis_visiveis: string[];
  };
}

interface NotificationConfig {
  google_calendar_desconectado: boolean;
  novos_agendamentos_publicos: boolean;
  conflitos_horario: boolean;
  lembretes_eventos: boolean;
  sincronizacao_falhou: boolean;
}

// Hook principal
export function useAgendaConfig() {
  const [googleConfig, setGoogleConfig] = useState<GoogleCalendarConfig>({
    conectado: false,
    sincronizacao_automatica: false,
    calendarios_disponiveis: [],
    configuracoes_avancadas: {
      sincronizar_bidirecionalmente: true,
      criar_eventos_lawdesk_no_google: true,
      importar_eventos_google_para_lawdesk: false,
      notificacoes_google: true,
    },
  });

  const [calendlyConfig, setCalendlyConfig] = useState<CalendlyStyleConfig>({
    ativo: false,
    link_publico: "",
    nome_exibicao: "",
    descricao_perfil: "",
    tipos_eventos: [],
    horarios_disponibilidade: {
      fuso_horario: "America/Sao_Paulo",
      segunda: { ativo: true, inicio: "09:00", fim: "18:00" },
      terca: { ativo: true, inicio: "09:00", fim: "18:00" },
      quarta: { ativo: true, inicio: "09:00", fim: "18:00" },
      quinta: { ativo: true, inicio: "09:00", fim: "18:00" },
      sexta: { ativo: true, inicio: "09:00", fim: "17:00" },
      sabado: { ativo: false, inicio: "09:00", fim: "12:00" },
      domingo: { ativo: false, inicio: "09:00", fim: "12:00" },
    },
    configuracoes_avancadas: {
      antecedencia_minima: 2,
      antecedencia_maxima: 60,
      maximo_eventos_por_dia: 8,
      tempo_entre_eventos: 15,
      perguntas_personalizadas: [],
      confirmacao_automatica: true,
      lembretes_email: true,
      lembretes_sms: false,
    },
  });

  const [teamConfig, setTeamConfig] = useState<TeamConfig>({
    visibilidade_equipe: true,
    membros_visiveis: [],
    cores_personalizadas: {},
    permissoes: {
      ver_agenda_todos: true,
      editar_eventos_outros: false,
      criar_eventos_equipe: true,
      gerenciar_configuracoes: false,
    },
    agenda_organizacao: {
      ativa: false,
      nome_organizacao: "",
      descricao: "",
      link_publico_organizacao: "",
      responsaveis_visiveis: [],
    },
  });

  const [notificationConfig, setNotificationConfig] =
    useState<NotificationConfig>({
      google_calendar_desconectado: true,
      novos_agendamentos_publicos: true,
      conflitos_horario: true,
      lembretes_eventos: true,
      sincronizacao_falhou: true,
    });

  const [isLoading, setIsLoading] = useState(false);
  const { logAction } = useAuditSystem();

  // Carregar configurações salvas
  useEffect(() => {
    const loadConfigurations = async () => {
      try {
        // Simular carregamento das configurações do localStorage ou API
        const savedGoogleConfig = localStorage.getItem(
          "lawdesk_google_calendar_config",
        );
        const savedCalendlyConfig = localStorage.getItem(
          "lawdesk_calendly_config",
        );
        const savedTeamConfig = localStorage.getItem("lawdesk_team_config");
        const savedNotificationConfig = localStorage.getItem(
          "lawdesk_notification_config",
        );

        if (savedGoogleConfig) {
          setGoogleConfig(JSON.parse(savedGoogleConfig));
        }

        if (savedCalendlyConfig) {
          setCalendlyConfig(JSON.parse(savedCalendlyConfig));
        }

        if (savedTeamConfig) {
          setTeamConfig(JSON.parse(savedTeamConfig));
        }

        if (savedNotificationConfig) {
          setNotificationConfig(JSON.parse(savedNotificationConfig));
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }
    };

    loadConfigurations();
  }, []);

  // Conectar Google Calendar
  const connectGoogleCalendar = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Simular processo OAuth do Google
      // Em produção, isso seria uma chamada real para a API do Google
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock de dados retornados pela API do Google
      const mockGoogleData = {
        email: "usuario@lawdesk.com",
        nome_usuario: "Usuário Lawdesk",
        calendarios_disponiveis: [
          {
            id: "primary",
            nome: "Agenda Principal",
            cor: "#3B82F6",
            principal: true,
            sincronizar: true,
          },
          {
            id: "work",
            nome: "Trabalho",
            cor: "#10B981",
            principal: false,
            sincronizar: true,
          },
          {
            id: "personal",
            nome: "Pessoal",
            cor: "#F59E0B",
            principal: false,
            sincronizar: false,
          },
        ],
      };

      const newConfig: GoogleCalendarConfig = {
        ...googleConfig,
        conectado: true,
        email: mockGoogleData.email,
        nome_usuario: mockGoogleData.nome_usuario,
        ultima_sincronizacao: new Date().toISOString(),
        calendario_padrao: "primary",
        calendarios_disponiveis: mockGoogleData.calendarios_disponiveis,
        sincronizacao_automatica: true,
      };

      setGoogleConfig(newConfig);

      // Salvar no localStorage
      localStorage.setItem(
        "lawdesk_google_calendar_config",
        JSON.stringify(newConfig),
      );

      // Log da ação
      logAction(AUDIT_ACTIONS.CREATE, AUDIT_MODULES.CALENDAR, {
        action: "google_calendar_connected",
        email: mockGoogleData.email,
      });

      toast.success("Google Calendar conectado com sucesso!");
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Erro ao conectar Google Calendar:", error);
      toast.error("Erro ao conectar com Google Calendar");
      setIsLoading(false);
      return false;
    }
  }, [googleConfig, logAction]);

  // Desconectar Google Calendar
  const disconnectGoogleCalendar = useCallback(async (): Promise<boolean> => {
    try {
      const newConfig: GoogleCalendarConfig = {
        conectado: false,
        sincronizacao_automatica: false,
        calendarios_disponiveis: [],
        configuracoes_avancadas: {
          sincronizar_bidirecionalmente: true,
          criar_eventos_lawdesk_no_google: true,
          importar_eventos_google_para_lawdesk: false,
          notificacoes_google: true,
        },
      };

      setGoogleConfig(newConfig);
      localStorage.setItem(
        "lawdesk_google_calendar_config",
        JSON.stringify(newConfig),
      );

      logAction(AUDIT_ACTIONS.DELETE, AUDIT_MODULES.CALENDAR, {
        action: "google_calendar_disconnected",
      });

      toast.success("Google Calendar desconectado");
      return true;
    } catch (error) {
      console.error("Erro ao desconectar Google Calendar:", error);
      toast.error("Erro ao desconectar Google Calendar");
      return false;
    }
  }, [logAction]);

  // Sincronizar com Google Calendar
  const syncGoogleCalendar = useCallback(async (): Promise<boolean> => {
    if (!googleConfig.conectado) {
      toast.error("Google Calendar não está conectado");
      return false;
    }

    setIsLoading(true);

    try {
      // Simular sincronização
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const updatedConfig = {
        ...googleConfig,
        ultima_sincronizacao: new Date().toISOString(),
      };

      setGoogleConfig(updatedConfig);
      localStorage.setItem(
        "lawdesk_google_calendar_config",
        JSON.stringify(updatedConfig),
      );

      logAction(AUDIT_ACTIONS.UPDATE, AUDIT_MODULES.CALENDAR, {
        action: "google_calendar_synced",
      });

      toast.success("Sincronização concluída com sucesso!");
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Erro na sincronização:", error);
      toast.error("Erro na sincronização com Google Calendar");
      setIsLoading(false);
      return false;
    }
  }, [googleConfig, logAction]);

  // Ativar link público (estilo Calendly)
  const activatePublicLink = useCallback(
    async (userInfo: {
      nome: string;
      descricao?: string;
      foto?: string;
    }): Promise<string> => {
      try {
        const userName = userInfo.nome
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "");

        const publicLink = `https://agenda.lawdesk.com/${userName}`;

        const newConfig: CalendlyStyleConfig = {
          ...calendlyConfig,
          ativo: true,
          link_publico: publicLink,
          nome_exibicao: userInfo.nome,
          descricao_perfil: userInfo.descricao || "Advogado especializado",
          foto_perfil: userInfo.foto,
          tipos_eventos: [
            {
              id: "consulta-inicial",
              nome: "Consulta Inicial",
              duracao: 60,
              descricao: "Primeira consulta jurídica",
              cor: "#3B82F6",
              disponivel: true,
              buffer_antes: 15,
              buffer_depois: 15,
              localizacao: {
                tipo: "online",
                link_personalizado: "https://meet.google.com/",
                detalhes: "Link será enviado por email",
              },
            },
            {
              id: "reuniao-acompanhamento",
              nome: "Reunião de Acompanhamento",
              duracao: 30,
              descricao: "Acompanhamento de processo",
              cor: "#10B981",
              disponivel: true,
              buffer_antes: 10,
              buffer_depois: 10,
              localizacao: {
                tipo: "hibrido",
                endereco: "Escritório ou Online",
                detalhes: "Local será definido antes da reunião",
              },
            },
          ],
        };

        setCalendlyConfig(newConfig);
        localStorage.setItem(
          "lawdesk_calendly_config",
          JSON.stringify(newConfig),
        );

        logAction(AUDIT_ACTIONS.CREATE, AUDIT_MODULES.CALENDAR, {
          action: "public_link_activated",
          link: publicLink,
        });

        toast.success("Link público ativado com sucesso!");
        return publicLink;
      } catch (error) {
        console.error("Erro ao ativar link público:", error);
        toast.error("Erro ao ativar link público");
        throw error;
      }
    },
    [calendlyConfig, logAction],
  );

  // Atualizar configurações da equipe
  const updateTeamConfig = useCallback(
    async (newTeamConfig: Partial<TeamConfig>): Promise<boolean> => {
      try {
        const updatedConfig = {
          ...teamConfig,
          ...newTeamConfig,
        };

        setTeamConfig(updatedConfig);
        localStorage.setItem(
          "lawdesk_team_config",
          JSON.stringify(updatedConfig),
        );

        logAction(AUDIT_ACTIONS.UPDATE, AUDIT_MODULES.CALENDAR, {
          action: "team_config_updated",
          changes: Object.keys(newTeamConfig),
        });

        toast.success("Configurações da equipe atualizadas!");
        return true;
      } catch (error) {
        console.error("Erro ao atualizar configurações da equipe:", error);
        toast.error("Erro ao atualizar configurações da equipe");
        return false;
      }
    },
    [teamConfig, logAction],
  );

  // Ativar agenda da organização
  const activateOrganizationCalendar = useCallback(
    async (orgInfo: {
      nome: string;
      descricao: string;
      logo?: string;
      responsaveis: string[];
    }): Promise<string> => {
      try {
        const orgSlug = orgInfo.nome
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "");

        const publicOrgLink = `https://agenda.lawdesk.com/org/${orgSlug}`;

        const updatedConfig: TeamConfig = {
          ...teamConfig,
          agenda_organizacao: {
            ativa: true,
            nome_organizacao: orgInfo.nome,
            logo_organizacao: orgInfo.logo,
            descricao: orgInfo.descricao,
            link_publico_organizacao: publicOrgLink,
            responsaveis_visiveis: orgInfo.responsaveis,
          },
        };

        setTeamConfig(updatedConfig);
        localStorage.setItem(
          "lawdesk_team_config",
          JSON.stringify(updatedConfig),
        );

        logAction(AUDIT_ACTIONS.CREATE, AUDIT_MODULES.CALENDAR, {
          action: "organization_calendar_activated",
          organization: orgInfo.nome,
          link: publicOrgLink,
        });

        toast.success("Agenda da organização ativada com sucesso!");
        return publicOrgLink;
      } catch (error) {
        console.error("Erro ao ativar agenda da organização:", error);
        toast.error("Erro ao ativar agenda da organização");
        throw error;
      }
    },
    [teamConfig, logAction],
  );

  // Verificar se precisa mostrar alerta do Google Calendar
  const shouldShowGoogleAlert = useCallback((): boolean => {
    return (
      !googleConfig.conectado && notificationConfig.google_calendar_desconectado
    );
  }, [googleConfig.conectado, notificationConfig.google_calendar_desconectado]);

  // Atualizar configurações de notificação
  const updateNotificationConfig = useCallback(
    (newConfig: Partial<NotificationConfig>) => {
      const updatedConfig = {
        ...notificationConfig,
        ...newConfig,
      };

      setNotificationConfig(updatedConfig);
      localStorage.setItem(
        "lawdesk_notification_config",
        JSON.stringify(updatedConfig),
      );
    },
    [notificationConfig],
  );

  return {
    // Estados
    googleConfig,
    calendlyConfig,
    teamConfig,
    notificationConfig,
    isLoading,

    // Ações Google Calendar
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    syncGoogleCalendar,

    // Ações Link Público
    activatePublicLink,

    // Ações Equipe
    updateTeamConfig,
    activateOrganizationCalendar,

    // Configurações
    updateNotificationConfig,
    shouldShowGoogleAlert,

    // Setters diretos (para casos específicos)
    setGoogleConfig,
    setCalendlyConfig,
    setTeamConfig,
  };
}

export default useAgendaConfig;
