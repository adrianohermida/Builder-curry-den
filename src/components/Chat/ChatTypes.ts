// Tipos centralizados para o sistema de conversação

export type StatusMensagem = "enviando" | "enviada" | "lida" | "falhou";
export type TipoRemetente = "usuario" | "agente" | "bot" | "sistema";
export type StatusAtendimento = "online" | "offline" | "busy" | "away";
export type StatusTicket =
  | "aberto"
  | "em_andamento"
  | "pendente"
  | "resolvido"
  | "fechado";
export type PrioridadeTicket = "baixa" | "media" | "alta" | "critica";
export type CanalAtendimento =
  | "widget"
  | "email"
  | "whatsapp"
  | "telefone"
  | "interno";
export type CategoriaTicket =
  | "suporte"
  | "comercial"
  | "juridico"
  | "tecnico"
  | "financeiro";
export type TipoAtendimento = "b2b" | "b2c" | "interno";
export type StatusSLA = "dentro_prazo" | "proximo_vencimento" | "vencido";

// Interface para anexos
export interface AnexoMensagem {
  id: string;
  nome: string;
  tipo: string; // MIME type
  url: string;
  tamanho: number; // em bytes
  thumbnailUrl?: string;
  uploadedAt: Date;
  uploadedBy: string;
}

// Interface para remetente de mensagem
export interface RemetenteMensagem {
  id: string;
  nome: string;
  avatar?: string;
  tipo: TipoRemetente;
  email?: string;
  departamento?: string;
  cargo?: string;
}

// Interface principal para mensagens
export interface MensagemChat {
  id: string;
  conteudo: string;
  remetente: RemetenteMensagem;
  timestamp: Date;
  status: StatusMensagem;
  anexos?: AnexoMensagem[];
  ticketId?: string;
  threadId?: string; // Para conversas em thread
  replyToId?: string; // Para respostas
  editedAt?: Date; // Para mensagens editadas
  deletedAt?: Date; // Para mensagens deletadas
  metadata?: {
    canal: CanalAtendimento;
    ip?: string;
    userAgent?: string;
    localizacao?: string;
    dispositivo?: "mobile" | "desktop" | "tablet";
  };
  reactions?: {
    emoji: string;
    users: string[];
    count: number;
  }[];
  mentions?: string[]; // IDs de usuários mencionados
  isInternal?: boolean; // Para notas internas
  isAutomated?: boolean; // Para mensagens automáticas
  priority?: PrioridadeTicket;
  tags?: string[];
}

// Interface para agentes/atendentes
export interface AgenteAtendimento {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
  status: StatusAtendimento;
  departamento: string;
  cargo: string;
  especialidades: string[];
  idiomas: string[];
  avaliacaoMedia: number;
  totalAtendimentos: number;
  tempoMedioResposta: number; // em minutos
  horariosDisponiveis: {
    inicio: string; // HH:MM
    fim: string; // HH:MM
    diasSemana: number[]; // 0-6 (domingo-sabado)
    fuso: string;
  };
  skills: {
    nome: string;
    nivel: number; // 1-5
  }[];
  isOnline: boolean;
  ultimaAtividade: Date;
  configuracoes: {
    autoResposta: boolean;
    mensagemAutoResposta?: string;
    notificacoes: {
      email: boolean;
      push: boolean;
      som: boolean;
    };
    assinatura?: string;
  };
}

// Interface para SLA
export interface SLATicket {
  tempoResposta: number; // em minutos
  tempoResolucao: number; // em horas
  vencimentoResposta: Date;
  vencimentoResolucao: Date;
  status: StatusSLA;
  alertas: {
    tipo: "primeira_resposta" | "resolucao" | "escalacao";
    enviado: boolean;
    dataEnvio?: Date;
  }[];
  pausas: {
    inicio: Date;
    fim?: Date;
    motivo: string;
    pausadoPor: string;
  }[];
  tempoUtilCalculado: number; // tempo útil em minutos
}

// Interface para avaliação de satisfação
export interface AvaliacaoSatisfacao {
  id: string;
  ticketId: string;
  nota: number; // 1-5
  comentario?: string;
  aspectos: {
    atendimento: number;
    tempo: number;
    solucao: number;
    comunicacao: number;
  };
  respondidoEm: Date;
  respondidoPor: string;
  coletadoVia: CanalAtendimento;
  seguimentoNecessario: boolean;
  tags?: string[];
}

// Interface principal para tickets
export interface TicketAtendimento {
  id: string;
  numero: string;
  titulo: string;
  descricao: string;
  status: StatusTicket;
  prioridade: PrioridadeTicket;
  categoria: CategoriaTicket;

  // Relacionamentos
  cliente: {
    id: string;
    nome: string;
    email: string;
    telefone?: string;
    empresa?: string;
    avatar?: string;
    plano?: string;
    tags?: string[];
    historico?: {
      totalTickets: number;
      ticketsResolvidos: number;
      avaliacaoMedia: number;
      clienteDesde: Date;
    };
  };

  agente?: AgenteAtendimento;
  supervisor?: AgenteAtendimento;

  // Mensagens e comunicação
  mensagens: MensagemChat[];
  notasInternas?: MensagemChat[];

  // Datas e timestamps
  criadoEm: Date;
  atualizadoEm: Date;
  primeiraRespostaEm?: Date;
  resolvidoEm?: Date;
  fechadoEm?: Date;

  // SLA e métricas
  sla: SLATicket;

  // Canal e origem
  canal: CanalAtendimento;
  origem: {
    url?: string;
    referrer?: string;
    userAgent?: string;
    ip?: string;
    pais?: string;
    cidade?: string;
  };

  // Classificação e organização
  tags: string[];
  categoriaDetalhada?: string;
  subcategoria?: string;
  produto?: string;
  versao?: string;

  // Satisfação e follow-up
  satisfacao?: AvaliacaoSatisfacao;
  followUpNecessario: boolean;
  followUpData?: Date;

  // Escalação
  escalado: boolean;
  escalacoesHistorico: {
    de: AgenteAtendimento;
    para: AgenteAtendimento;
    motivo: string;
    data: Date;
  }[];

  // Anexos e recursos
  anexos: AnexoMensagem[];
  recursos?: {
    compartilhamentoTela: boolean;
    videoCall: boolean;
    remoteAssist: boolean;
  };

  // Integração com outros módulos
  integracoes?: {
    crmClienteId?: string;
    gedDocumentos?: string[];
    tarefasVinculadas?: string[];
    processosJuridicos?: string[];
    contratosRelacionados?: string[];
  };

  // Configurações específicas
  configuracoes: {
    notificarCliente: boolean;
    copiarSupervisor: boolean;
    privado: boolean;
    urgente: boolean;
  };

  // Auditoria e compliance
  auditoria: {
    criadoPor: string;
    modificadoPor: string[];
    acessadoPor: string[];
    exportado: boolean;
    dataExportacao?: Date;
    motivoExportacao?: string;
  };
}

// Interface para estatísticas de atendimento
export interface EstatisticasAtendimento {
  periodo: "hoje" | "semana" | "mes" | "trimestre" | "ano";
  tickets: {
    total: number;
    abertos: number;
    emAndamento: number;
    resolvidos: number;
    fechados: number;
    vencidos: number;
  };
  sla: {
    cumprimentoResposta: number; // porcentagem
    cumprimentoResolucao: number; // porcentagem
    tempoMedioResposta: number; // em minutos
    tempoMedioResolucao: number; // em horas
  };
  satisfacao: {
    notaMedia: number;
    totalAvaliacoes: number;
    distribuicao: {
      nota1: number;
      nota2: number;
      nota3: number;
      nota4: number;
      nota5: number;
    };
    nps: number; // Net Promoter Score
  };
  agentes: {
    totalAtivos: number;
    totalDisponiveis: number;
    ocupacaoMedia: number; // porcentagem
    produtividadeMedia: number; // tickets por hora
  };
  canais: {
    canal: CanalAtendimento;
    total: number;
    porcentagem: number;
  }[];
}

// Interface para configurações do widget
export interface ConfiguracaoWidget {
  id: string;
  nome: string;
  ativo: boolean;

  // Aparência
  aparencia: {
    tema: "claro" | "escuro" | "auto";
    corPrimaria: string;
    corSecundaria: string;
    logoUrl?: string;
    posicao: "bottom-right" | "bottom-left" | "top-right" | "top-left";
    tamanho: "pequeno" | "medio" | "grande";
    formato: "circular" | "quadrado" | "retangular";
  };

  // Funcionalidades
  funcionalidades: {
    chat: boolean;
    videoChamada: boolean;
    compartilhamenteTela: boolean;
    anexos: boolean;
    emojis: boolean;
    avaliacaoRapida: boolean;
    faq: boolean;
    busca: boolean;
    historico: boolean;
  };

  // Horários de funcionamento
  horarioFuncionamento: {
    ativo: boolean;
    fusoHorario: string;
    horarios: {
      dia: number; // 0-6
      inicio: string; // HH:MM
      fim: string; // HH:MM
      ativo: boolean;
    }[];
    mensagemForaHorario?: string;
  };

  // Roteamento
  roteamento: {
    tipo: "round_robin" | "skill_based" | "load_balanced" | "manual";
    departamentoPadrao: string;
    agentePadrao?: string;
    regras: {
      condicao: string;
      acao: string;
      valor: string;
    }[];
  };

  // Automação
  automacao: {
    boasVindas: {
      ativo: boolean;
      mensagem: string;
      delay: number; // em segundos
    };
    respostasAutomaticas: {
      ativo: boolean;
      regras: {
        palavrasChave: string[];
        resposta: string;
        ativo: boolean;
      }[];
    };
    escalacaoAutomatica: {
      ativo: boolean;
      tempoLimite: number; // em minutos
      condicoes: string[];
    };
  };

  // Integrações
  integracoes: {
    crm: boolean;
    ged: boolean;
    whatsapp: boolean;
    email: boolean;
    analytics: boolean;
    webhooks: {
      url: string;
      eventos: string[];
      ativo: boolean;
    }[];
  };

  // Permissões por tipo de usuário
  permissoes: {
    tipoUsuario: "cliente" | "advogado" | "admin" | "publico";
    acessos: {
      criarTicket: boolean;
      verHistorico: boolean;
      anexarArquivos: boolean;
      avaliarAtendimento: boolean;
      reabrirTicket: boolean;
    };
  }[];

  // Configurações de dados
  dados: {
    retencao: number; // em dias
    exportacaoAutomatica: boolean;
    backup: boolean;
    anonimizacao: boolean;
    lgpdCompliant: boolean;
  };
}

// Tipos de eventos para auditoria
export type EventoAuditoria =
  | "ticket_criado"
  | "ticket_atualizado"
  | "ticket_fechado"
  | "mensagem_enviada"
  | "agente_atribuido"
  | "prioridade_alterada"
  | "status_alterado"
  | "escalacao_realizada"
  | "satisfacao_avaliada"
  | "anexo_adicionado"
  | "nota_interna_adicionada";

// Interface para logs de auditoria
export interface LogAuditoriaAtendimento {
  id: string;
  evento: EventoAuditoria;
  ticketId?: string;
  usuarioId: string;
  timestamp: Date;
  detalhes: Record<string, any>;
  ip: string;
  userAgent: string;
  dadosAnteriores?: Record<string, any>;
  dadosNovos?: Record<string, any>;
}
