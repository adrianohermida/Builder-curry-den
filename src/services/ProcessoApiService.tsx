import { toast } from "sonner";

// Tipos para as APIs externas
export interface ProcessoTJSP {
  numero: string;
  classe: string;
  assunto: string;
  foro: string;
  vara: string;
  juiz: string;
  partes: Array<{
    nome: string;
    tipo: "autor" | "reu" | "terceiro";
    advogados: string[];
  }>;
  movimentacoes: Array<{
    data: string;
    descricao: string;
    complemento?: string;
  }>;
  andamentos: Array<{
    data: string;
    tipo: string;
    descricao: string;
  }>;
  status: "ativo" | "arquivado" | "suspenso" | "julgado";
  dataDistribuicao: string;
  valorCausa?: number;
}

export interface ConsultaOAB {
  numero: string;
  nome: string;
  situacao: "regular" | "irregular" | "suspenso" | "cancelado";
  seccional: string;
  dataInscricao: string;
  especialidades: string[];
}

export interface ConsultaCNJ {
  numero: string;
  grau: string;
  tribunal: string;
  unidadeOrigem: string;
  classe: string;
  assunto: string;
  dataAjuizamento: string;
  movimentacoes: Array<{
    dataHora: string;
    nome: string;
    complemento?: string;
  }>;
}

export interface NotificacaoPrazo {
  processoNumero: string;
  tipo: "audiencia" | "prazo" | "sentenca" | "recurso";
  descricao: string;
  dataLimite: string;
  diasRestantes: number;
  prioridade: "baixa" | "media" | "alta" | "critica";
}

export interface PublicacaoDJE {
  data: string;
  orgao: string;
  processo: string;
  partes: string;
  conteudo: string;
  tipo: "intimacao" | "citacao" | "publicacao" | "decisao";
  caderno: string;
  pagina: number;
}

class ProcessoApiService {
  private baseUrl =
    process.env.REACT_APP_API_URL || "https://api.lawdesk.com.br";
  private apiKey = process.env.REACT_APP_API_KEY || "demo-key";

  // Headers padrão para requisições
  private getHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
      "X-Client-Version": "2025.1.0",
    };
  }

  // Método genérico para fazer requisições
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T | null> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro na requisição ${endpoint}:`, error);

      // Em desenvolvimento, retorna dados mock
      if (process.env.NODE_ENV === "development") {
        return this.getMockData(endpoint) as T;
      }

      toast.error(
        `Erro na consulta: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      );
      return null;
    }
  }

  // Dados mock para desenvolvimento
  private getMockData(endpoint: string): any {
    const mockData: Record<string, any> = {
      "/processo/tjsp": {
        numero: "1234567-89.2024.8.26.0100",
        classe: "Ação de Divórcio",
        assunto: "Divórcio Consensual",
        foro: "Foro Central",
        vara: "1ª Vara de Família",
        juiz: "Dr. João Silva",
        partes: [
          {
            nome: "João da Silva",
            tipo: "autor",
            advogados: ["Dr. Pedro Santos - OAB/SP 123456"],
          },
          {
            nome: "Maria da Silva",
            tipo: "reu",
            advogados: ["Dra. Ana Costa - OAB/SP 654321"],
          },
        ],
        movimentacoes: [
          {
            data: "2024-01-26",
            descricao: "Juntada de petição",
            complemento: "Petição protocolada às 14:30h",
          },
          {
            data: "2024-01-25",
            descricao: "Audiência designada",
            complemento: "Para o dia 15/02/2024 às 14:00h",
          },
        ],
        andamentos: [
          {
            data: "2024-01-26",
            tipo: "decisao",
            descricao: "Decisão interlocutória proferida",
          },
        ],
        status: "ativo",
        dataDistribuicao: "2024-01-15",
        valorCausa: 75000,
      },
      "/consulta/oab": {
        numero: "123456",
        nome: "Dr. Pedro Santos",
        situacao: "regular",
        seccional: "OAB/SP",
        dataInscricao: "2010-03-15",
        especialidades: ["Família", "Cível"],
      },
      "/processo/cnj": {
        numero: "1234567-89.2024.8.26.0100",
        grau: "1º Grau",
        tribunal: "TJSP",
        unidadeOrigem: "1ª Vara de Família",
        classe: "Ação de Divórcio",
        assunto: "Divórcio",
        dataAjuizamento: "2024-01-15",
        movimentacoes: [
          {
            dataHora: "2024-01-26T14:30:00",
            nome: "Petição Juntada",
            complemento: "Petição de acordo protocolada",
          },
        ],
      },
      "/notificacoes/prazos": [
        {
          processoNumero: "1234567-89.2024.8.26.0100",
          tipo: "audiencia",
          descricao: "Audiência de conciliação agendada",
          dataLimite: "2024-02-15T14:00:00",
          diasRestantes: 5,
          prioridade: "alta",
        },
      ],
      "/publicacoes/dje": [
        {
          data: "2024-01-26",
          orgao: "TJSP",
          processo: "1234567-89.2024.8.26.0100",
          partes: "João da Silva x Maria da Silva",
          conteudo: "Audiência de conciliação designada para o dia 15/02/2024",
          tipo: "intimacao",
          caderno: "Judicial",
          pagina: 125,
        },
      ],
    };

    return mockData[endpoint] || null;
  }

  // 🔍 CONSULTAS DE PROCESSOS

  /**
   * Consulta processo no TJSP (Tribunal de Justiça de São Paulo)
   */
  async consultarProcessoTJSP(
    numeroProcesso: string,
  ): Promise<ProcessoTJSP | null> {
    const cleanNumber = numeroProcesso.replace(/\D/g, "");

    if (cleanNumber.length !== 20) {
      toast.error("Número do processo inválido");
      return null;
    }

    toast.loading("Consultando processo no TJSP...", { id: "tjsp-consulta" });

    const result = await this.makeRequest<ProcessoTJSP>(
      `/processo/tjsp/${cleanNumber}`,
    );

    if (result) {
      toast.success("Processo encontrado no TJSP!", { id: "tjsp-consulta" });
    } else {
      toast.error("Processo não encontrado no TJSP", { id: "tjsp-consulta" });
    }

    return result;
  }

  /**
   * Consulta processo via CNJ (Conselho Nacional de Justiça)
   */
  async consultarProcessoCNJ(
    numeroProcesso: string,
  ): Promise<ConsultaCNJ | null> {
    const cleanNumber = numeroProcesso.replace(/\D/g, "");

    toast.loading("Consultando processo no CNJ...", { id: "cnj-consulta" });

    const result = await this.makeRequest<ConsultaCNJ>(
      `/processo/cnj/${cleanNumber}`,
    );

    if (result) {
      toast.success("Dados atualizados via CNJ!", { id: "cnj-consulta" });
    } else {
      toast.error("Erro na consulta CNJ", { id: "cnj-consulta" });
    }

    return result;
  }

  /**
   * Monitora processo para receber atualizações automáticas
   */
  async monitorarProcesso(
    numeroProcesso: string,
    webhookUrl?: string,
  ): Promise<boolean> {
    const result = await this.makeRequest<{ success: boolean }>(
      "/processo/monitorar",
      {
        method: "POST",
        body: JSON.stringify({
          numero: numeroProcesso,
          webhook: webhookUrl,
          frequencia: "diaria",
          notificacoes: ["movimentacao", "publicacao", "prazo"],
        }),
      },
    );

    if (result?.success) {
      toast.success("Processo sendo monitorado automaticamente!");
      return true;
    }

    return false;
  }

  // 👨‍⚖️ CONSULTAS OAB

  /**
   * Valida inscrição na OAB
   */
  async validarOAB(numeroOAB: string, uf: string): Promise<ConsultaOAB | null> {
    toast.loading("Validando OAB...", { id: "oab-consulta" });

    const result = await this.makeRequest<ConsultaOAB>(
      `/consulta/oab/${numeroOAB}/${uf}`,
    );

    if (result) {
      const situacaoColor = result.situacao === "regular" ? "success" : "error";
      toast.success(`OAB ${result.situacao.toUpperCase()}`, {
        id: "oab-consulta",
      });
    } else {
      toast.error("OAB não encontrada", { id: "oab-consulta" });
    }

    return result;
  }

  // 📅 GESTÃO DE PRAZOS E NOTIFICAÇÕES

  /**
   * Busca prazos pendentes
   */
  async buscarPrazos(filtros?: {
    periodo?: { inicio: Date; fim: Date };
    prioridade?: string;
    tipo?: string;
  }): Promise<NotificacaoPrazo[]> {
    const queryParams = new URLSearchParams();

    if (filtros?.periodo?.inicio) {
      queryParams.append("inicio", filtros.periodo.inicio.toISOString());
    }
    if (filtros?.periodo?.fim) {
      queryParams.append("fim", filtros.periodo.fim.toISOString());
    }
    if (filtros?.prioridade) {
      queryParams.append("prioridade", filtros.prioridade);
    }
    if (filtros?.tipo) {
      queryParams.append("tipo", filtros.tipo);
    }

    const result = await this.makeRequest<NotificacaoPrazo[]>(
      `/notificacoes/prazos?${queryParams.toString()}`,
    );

    return result || [];
  }

  /**
   * Cria alerta de prazo personalizado
   */
  async criarAlerta(
    numeroProcesso: string,
    tipo: string,
    dataLimite: Date,
    descricao: string,
    antecedencia: number = 3,
  ): Promise<boolean> {
    const result = await this.makeRequest<{ success: boolean }>(
      "/notificacoes/criar",
      {
        method: "POST",
        body: JSON.stringify({
          processo: numeroProcesso,
          tipo,
          dataLimite: dataLimite.toISOString(),
          descricao,
          antecedenciaDias: antecedencia,
          meiosNotificacao: ["email", "push", "sms"],
        }),
      },
    );

    if (result?.success) {
      toast.success("Alerta de prazo criado!");
      return true;
    }

    return false;
  }

  // 📰 DIÁRIO OFICIAL E PUBLICAÇÕES

  /**
   * Consulta publicações no Diário de Justiça Eletrônico
   */
  async consultarDJE(filtros: {
    data?: Date;
    processo?: string;
    palavraChave?: string;
    tribunal?: string;
  }): Promise<PublicacaoDJE[]> {
    const queryParams = new URLSearchParams();

    if (filtros.data) {
      queryParams.append("data", filtros.data.toISOString().split("T")[0]);
    }
    if (filtros.processo) {
      queryParams.append("processo", filtros.processo);
    }
    if (filtros.palavraChave) {
      queryParams.append("palavra", filtros.palavraChave);
    }
    if (filtros.tribunal) {
      queryParams.append("tribunal", filtros.tribunal);
    }

    const result = await this.makeRequest<PublicacaoDJE[]>(
      `/publicacoes/dje?${queryParams.toString()}`,
    );

    return result || [];
  }

  /**
   * Monitora publicações automáticas
   */
  async monitorarPublicacoes(
    palavrasChave: string[],
    tribunais: string[] = ["TJSP", "TRT2", "TRF3"],
  ): Promise<boolean> {
    const result = await this.makeRequest<{ success: boolean }>(
      "/publicacoes/monitorar",
      {
        method: "POST",
        body: JSON.stringify({
          palavrasChave,
          tribunais,
          ativo: true,
          notificacaoImediata: true,
        }),
      },
    );

    if (result?.success) {
      toast.success("Monitoramento de publicações ativado!");
      return true;
    }

    return false;
  }

  // 🏛️ INFORMAÇÕES DOS TRIBUNAIS

  /**
   * Busca informações de contato de vara/tribunal
   */
  async buscarInformacoesTribunal(codigoTribunal: string, vara?: string) {
    const result = await this.makeRequest<{
      nome: string;
      endereco: string;
      telefone: string;
      email: string;
      horario: string;
      competencia: string[];
    }>(`/tribunais/${codigoTribunal}${vara ? `/${vara}` : ""}`);

    return result;
  }

  // 📊 ESTATÍSTICAS E RELATÓRIOS

  /**
   * Gera relatório de produtividade de processos
   */
  async gerarRelatorioProcessos(filtros: {
    periodo: { inicio: Date; fim: Date };
    responsavel?: string;
    area?: string;
    status?: string;
  }) {
    const result = await this.makeRequest<{
      totalProcessos: number;
      processosAtivos: number;
      processosEncerrados: number;
      tempoMedioResolucao: number;
      valorTotal: number;
      distribuicaoPorArea: Record<string, number>;
      produtividadeMensal: Array<{ mes: string; quantidade: number }>;
    }>("/relatorios/processos", {
      method: "POST",
      body: JSON.stringify(filtros),
    });

    return result;
  }

  // 🔐 ASSINATURA DIGITAL E CERTIFICADOS

  /**
   * Valida certificado digital A1/A3
   */
  async validarCertificadoDigital(certificado: File): Promise<{
    valido: boolean;
    titular: string;
    dataVencimento: Date;
    emissor: string;
    tipoUso: string[];
  } | null> {
    const formData = new FormData();
    formData.append("certificado", certificado);

    try {
      const response = await fetch(`${this.baseUrl}/certificados/validar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Certificado validado com sucesso!");
        return result;
      } else {
        toast.error("Erro na validação do certificado");
        return null;
      }
    } catch (error) {
      toast.error("Erro ao validar certificado");
      return null;
    }
  }

  // 🚨 SISTEMA DE ALERTAS INTELIGENTES

  /**
   * Configura alertas inteligentes baseados em IA
   */
  async configurarAlertasIA(configuracao: {
    processosMonitorados: string[];
    tiposAlerta: string[];
    frequencia: "tempo-real" | "diaria" | "semanal";
    palavrasChave: string[];
    filtrosAvancados: Record<string, any>;
  }): Promise<boolean> {
    const result = await this.makeRequest<{ success: boolean }>(
      "/alertas/ia/configurar",
      {
        method: "POST",
        body: JSON.stringify(configuracao),
      },
    );

    if (result?.success) {
      toast.success("Alertas inteligentes configurados!");
      return true;
    }

    return false;
  }

  // 🔄 SINCRONIZAÇÃO EM TEMPO REAL

  /**
   * Inicia sincronização em tempo real via WebSocket
   */
  async iniciarSincronizacaoRealTime(
    processos: string[],
    callback: (evento: any) => void,
  ): Promise<WebSocket | null> {
    try {
      const wsUrl = `${this.baseUrl.replace("https://", "wss://").replace("http://", "ws://")}/ws/processos`;
      const ws = new WebSocket(`${wsUrl}?token=${this.apiKey}`);

      ws.onopen = () => {
        console.log("Conexão WebSocket estabelecida");
        ws.send(
          JSON.stringify({
            type: "subscribe",
            processos: processos,
          }),
        );
        toast.success("Sincronização em tempo real ativada!");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        callback(data);
      };

      ws.onerror = (error) => {
        console.error("Erro no WebSocket:", error);
        toast.error("Erro na sincronização em tempo real");
      };

      ws.onclose = () => {
        console.log("Conexão WebSocket encerrada");
        toast.info("Sincronização em tempo real desconectada");
      };

      return ws;
    } catch (error) {
      console.error("Erro ao conectar WebSocket:", error);
      return null;
    }
  }

  // 📱 INTEGRAÇÃO GOV.BR

  /**
   * Autentica via GOV.BR
   */
  async autenticarGovBr(codigo: string): Promise<{
    token: string;
    usuario: {
      cpf: string;
      nome: string;
      email: string;
    };
  } | null> {
    const result = await this.makeRequest<any>("/auth/govbr", {
      method: "POST",
      body: JSON.stringify({ codigo }),
    });

    if (result?.token) {
      toast.success("Autenticação GOV.BR realizada!");
      return result;
    }

    return null;
  }

  /**
   * Consulta CPF via Receita Federal (GOV.BR)
   */
  async consultarCPF(cpf: string): Promise<{
    nome: string;
    situacao: string;
    dataEmissao: string;
  } | null> {
    const result = await this.makeRequest<any>(
      `/govbr/cpf/${cpf.replace(/\D/g, "")}`,
    );

    if (result) {
      toast.success("Dados do CPF consultados!");
    }

    return result;
  }
}

// Instância singleton do serviço
export const processoApiService = new ProcessoApiService();

// Hook personalizado para usar o serviço
export function useProcessoApi() {
  return {
    consultarTJSP:
      processoApiService.consultarProcessoTJSP.bind(processoApiService),
    consultarCNJ:
      processoApiService.consultarProcessoCNJ.bind(processoApiService),
    monitorarProcesso:
      processoApiService.monitorarProcesso.bind(processoApiService),
    validarOAB: processoApiService.validarOAB.bind(processoApiService),
    buscarPrazos: processoApiService.buscarPrazos.bind(processoApiService),
    criarAlerta: processoApiService.criarAlerta.bind(processoApiService),
    consultarDJE: processoApiService.consultarDJE.bind(processoApiService),
    monitorarPublicacoes:
      processoApiService.monitorarPublicacoes.bind(processoApiService),
    buscarTribunal:
      processoApiService.buscarInformacoesTribunal.bind(processoApiService),
    gerarRelatorio:
      processoApiService.gerarRelatorioProcessos.bind(processoApiService),
    validarCertificado:
      processoApiService.validarCertificadoDigital.bind(processoApiService),
    configurarIA:
      processoApiService.configurarAlertasIA.bind(processoApiService),
    iniciarSync:
      processoApiService.iniciarSincronizacaoRealTime.bind(processoApiService),
    autenticarGov: processoApiService.autenticarGovBr.bind(processoApiService),
    consultarCPF: processoApiService.consultarCPF.bind(processoApiService),
  };
}
