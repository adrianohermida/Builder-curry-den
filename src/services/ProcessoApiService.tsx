/**
 * 🎯 PROCESSO API SERVICE - CONSOLIDADO E OTIMIZADO
 *
 * Serviço unificado consolidando todas as APIs do CRM:
 * - Consultas TJSP, CNJ, OAB
 * - Gestão de processos jurídicos
 * - Integração com tribunais
 * - Cache inteligente e performance
 * - Tratamento de erros robusto
 *
 * Substitui e consolida:
 * - Todas as chamadas API duplicadas dos módulos antigos
 * - Lógica de cache dispersa
 * - Validações inconsistentes
 */

import { toast } from "sonner";

// ===== UNIFIED INTERFACES =====
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
    descricao: string;
    tipoMovimentacao: string;
  }>;
}

export interface ProcessoCompleto {
  id: string;
  numero: string;
  clienteId: string;
  cliente: string;
  area: string;
  status: "ativo" | "arquivado" | "suspenso" | "encerrado" | "julgado";
  valor: number;
  dataInicio: Date;
  dataEncerramento?: Date;
  responsavel: string;
  tribunal: string;
  vara: string;
  assunto: string;
  prioridade: "baixa" | "media" | "alta" | "critica";
  risco: "baixo" | "medio" | "alto";
  proximaAudiencia?: Date;
  proximoPrazo?: Date;
  tags: string[];
  observacoes?: string;
  movimentacoes: Movimentacao[];
  publicacoes: Publicacao[];
  documentos: Documento[];
  tarefas: string[];
  contratos: string[];
}

export interface Movimentacao {
  id: string;
  processoId: string;
  data: Date;
  tipo: "peticionamento" | "audiencia" | "decisao" | "recurso" | "outros";
  descricao: string;
  responsavel: string;
  arquivo?: string;
  prazo?: Date;
  status: "pendente" | "cumprido" | "vencido";
}

export interface Publicacao {
  id: string;
  processoId: string;
  numero: string;
  data: Date;
  orgao: string;
  conteudo: string;
  tipo: "citacao" | "intimacao" | "sentenca" | "despacho" | "outros";
  prazo?: Date;
  status: "pendente" | "visualizada" | "processada";
  arquivo?: string;
  responsavel?: string;
}

export interface Documento {
  id: string;
  processoId: string;
  nome: string;
  tipo: "peticao" | "contrato" | "decisao" | "laudo" | "outros";
  arquivo: string;
  tamanho: number;
  dataUpload: Date;
  responsavel: string;
  tags: string[];
  versao: number;
  assinado: boolean;
}

// ===== CACHE SYSTEM =====
class CacheManager {
  private cache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();

  set(key: string, data: any, ttlMinutes = 30): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// ===== MAIN SERVICE CLASS =====
export class ProcessoApiService {
  private static instance: ProcessoApiService;
  private cache = new CacheManager();
  private requestQueue = new Map<string, Promise<any>>();

  public static getInstance(): ProcessoApiService {
    if (!ProcessoApiService.instance) {
      ProcessoApiService.instance = new ProcessoApiService();
    }
    return ProcessoApiService.instance;
  }

  // ===== TRIBUNAL QUERIES =====

  /**
   * Consulta processo no TJSP
   */
  async consultarProcessoTJSP(
    numeroProcesso: string,
  ): Promise<ProcessoTJSP | null> {
    const cacheKey = `tjsp_${numeroProcesso}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey);
    }

    const request = this.executeConsultaTJSP(numeroProcesso);
    this.requestQueue.set(cacheKey, request);

    try {
      const resultado = await request;
      this.cache.set(cacheKey, resultado, 60); // Cache por 1 hora
      return resultado;
    } finally {
      this.requestQueue.delete(cacheKey);
    }
  }

  private async executeConsultaTJSP(
    numeroProcesso: string,
  ): Promise<ProcessoTJSP | null> {
    try {
      // Simula consulta ao TJSP - substituir por integração real
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock data baseado em padrões reais do TJSP
      const mockResponse: ProcessoTJSP = {
        numero: numeroProcesso,
        classe: "Procedimento Comum Cível",
        assunto: "Danos Morais",
        foro: "Foro Central Cível",
        vara: "2ª Vara Cível",
        juiz: "Dr. João Silva Santos",
        partes: [
          {
            nome: "João da Silva",
            tipo: "autor",
            advogados: ["Dr. Maria Santos - OAB/SP 123456"],
          },
          {
            nome: "Empresa XYZ Ltda",
            tipo: "reu",
            advogados: ["Dr. Pedro Costa - OAB/SP 789012"],
          },
        ],
        movimentacoes: [
          {
            data: new Date().toISOString(),
            descricao: "Distribuído por sorteio",
            complemento: "Processo distribuído para a 2ª Vara Cível",
          },
          {
            data: new Date(Date.now() - 86400000).toISOString(),
            descricao: "Petição inicial protocolada",
            complemento: "Petição inicial do autor recebida",
          },
        ],
        andamentos: [
          {
            data: new Date().toISOString(),
            tipo: "Despacho",
            descricao: "Cite-se o réu para contestar no prazo legal",
          },
        ],
        status: "ativo",
        dataDistribuicao: new Date().toISOString(),
        valorCausa: 10000,
      };

      return mockResponse;
    } catch (error) {
      console.error("Erro ao consultar TJSP:", error);
      toast.error("Erro ao consultar processo no TJSP");
      return null;
    }
  }

  /**
   * Consulta advogado na OAB
   */
  async consultarOAB(
    numeroOAB: string,
    seccional: string = "SP",
  ): Promise<ConsultaOAB | null> {
    const cacheKey = `oab_${numeroOAB}_${seccional}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      // Simula consulta à OAB
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockResponse: ConsultaOAB = {
        numero: numeroOAB,
        nome: "Dr. João Silva Santos",
        situacao: "regular",
        seccional: seccional,
        dataInscricao: "2010-01-15",
        especialidades: ["Direito Civil", "Direito Empresarial"],
      };

      this.cache.set(cacheKey, mockResponse, 1440); // Cache por 24 horas
      return mockResponse;
    } catch (error) {
      console.error("Erro ao consultar OAB:", error);
      toast.error("Erro ao consultar advogado na OAB");
      return null;
    }
  }

  /**
   * Consulta processo no CNJ
   */
  async consultarProcessoCNJ(
    numeroProcesso: string,
  ): Promise<ConsultaCNJ | null> {
    const cacheKey = `cnj_${numeroProcesso}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      // Simula consulta ao CNJ
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockResponse: ConsultaCNJ = {
        numero: numeroProcesso,
        grau: "1º Grau",
        tribunal: "TJSP",
        unidadeOrigem: "2ª Vara Cível do Foro Central",
        classe: "Procedimento Comum Cível",
        assunto: "Responsabilidade Civil",
        dataAjuizamento: new Date().toISOString(),
        movimentacoes: [
          {
            dataHora: new Date().toISOString(),
            descricao: "Distribuído por sorteio",
            tipoMovimentacao: "Distribuição",
          },
        ],
      };

      this.cache.set(cacheKey, mockResponse, 120); // Cache por 2 horas
      return mockResponse;
    } catch (error) {
      console.error("Erro ao consultar CNJ:", error);
      toast.error("Erro ao consultar processo no CNJ");
      return null;
    }
  }

  // ===== PROCESSO MANAGEMENT =====

  /**
   * Busca processos com filtros avançados
   */
  async buscarProcessos(filtros: {
    cliente?: string;
    status?: string;
    responsavel?: string;
    dataInicio?: Date;
    dataFim?: Date;
    area?: string;
    risco?: string;
    limit?: number;
    offset?: number;
  }): Promise<ProcessoCompleto[]> {
    try {
      // Simula busca no banco de dados
      await new Promise((resolve) => setTimeout(resolve, 800));

      return this.generateMockProcessos(filtros.limit || 20);
    } catch (error) {
      console.error("Erro ao buscar processos:", error);
      toast.error("Erro ao buscar processos");
      return [];
    }
  }

  /**
   * Cria novo processo
   */
  async criarProcesso(
    dadosProcesso: Partial<ProcessoCompleto>,
  ): Promise<ProcessoCompleto | null> {
    try {
      // Simula criação no banco
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const novoProcesso: ProcessoCompleto = {
        id: `processo_${Date.now()}`,
        numero: dadosProcesso.numero || "",
        clienteId: dadosProcesso.clienteId || "",
        cliente: dadosProcesso.cliente || "",
        area: dadosProcesso.area || "",
        status: dadosProcesso.status || "ativo",
        valor: dadosProcesso.valor || 0,
        dataInicio: dadosProcesso.dataInicio || new Date(),
        responsavel: dadosProcesso.responsavel || "Usuário Atual",
        tribunal: dadosProcesso.tribunal || "",
        vara: dadosProcesso.vara || "",
        assunto: dadosProcesso.assunto || "",
        prioridade: dadosProcesso.prioridade || "media",
        risco: dadosProcesso.risco || "baixo",
        tags: dadosProcesso.tags || [],
        observacoes: dadosProcesso.observacoes,
        movimentacoes: [],
        publicacoes: [],
        documentos: [],
        tarefas: [],
        contratos: [],
      };

      toast.success("Processo criado com sucesso");
      return novoProcesso;
    } catch (error) {
      console.error("Erro ao criar processo:", error);
      toast.error("Erro ao criar processo");
      return null;
    }
  }

  /**
   * Atualiza processo existente
   */
  async atualizarProcesso(
    id: string,
    dados: Partial<ProcessoCompleto>,
  ): Promise<boolean> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success("Processo atualizado com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao atualizar processo:", error);
      toast.error("Erro ao atualizar processo");
      return false;
    }
  }

  /**
   * Adiciona movimentação ao processo
   */
  async adicionarMovimentacao(
    processoId: string,
    movimentacao: Partial<Movimentacao>,
  ): Promise<boolean> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      toast.success("Movimentação adicionada com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao adicionar movimentação:", error);
      toast.error("Erro ao adicionar movimentação");
      return false;
    }
  }

  /**
   * Monitora publicações de processos
   */
  async monitorarPublicacoes(processosIds: string[]): Promise<Publicacao[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Simula verificação de novas publicações
      return this.generateMockPublicacoes(processosIds);
    } catch (error) {
      console.error("Erro ao monitorar publicações:", error);
      return [];
    }
  }

  // ===== UTILITY METHODS =====

  /**
   * Valida número de processo brasileiro
   */
  static validarNumeroProcesso(numero: string): boolean {
    // Padrão CNJ: NNNNNNN-DD.AAAA.J.TR.OOOO
    const regex = /^\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2}\.\d{4}$/;
    return regex.test(numero);
  }

  /**
   * Formata número de processo
   */
  static formatarNumeroProcesso(numero: string): string {
    const digitsOnly = numero.replace(/\D/g, "");
    if (digitsOnly.length !== 20) return numero;

    return `${digitsOnly.slice(0, 7)}-${digitsOnly.slice(7, 9)}.${digitsOnly.slice(9, 13)}.${digitsOnly.slice(13, 14)}.${digitsOnly.slice(14, 16)}.${digitsOnly.slice(16)}`;
  }

  /**
   * Extrai informações do número CNJ
   */
  static extrairInfoCNJ(numero: string): {
    sequencial: string;
    digito: string;
    ano: string;
    segmento: string;
    tribunal: string;
    origem: string;
  } | null {
    if (!this.validarNumeroProcesso(numero)) return null;

    const digitsOnly = numero.replace(/\D/g, "");

    return {
      sequencial: digitsOnly.slice(0, 7),
      digito: digitsOnly.slice(7, 9),
      ano: digitsOnly.slice(9, 13),
      segmento: digitsOnly.slice(13, 14),
      tribunal: digitsOnly.slice(14, 16),
      origem: digitsOnly.slice(16),
    };
  }

  /**
   * Limpa cache
   */
  clearCache(): void {
    this.cache.clear();
    toast.success("Cache limpo com sucesso");
  }

  /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return this.cache.getStats();
  }

  // ===== MOCK DATA GENERATORS =====

  private generateMockProcessos(count: number): ProcessoCompleto[] {
    return Array.from({ length: count }, (_, i) => ({
      id: `processo_${i + 1}`,
      numero: `${String(i + 1).padStart(7, "0")}-12.2023.8.26.${String(i + 1).padStart(4, "0")}`,
      clienteId: `cliente_${i + 1}`,
      cliente: `Cliente ${i + 1}`,
      area: ["Civil", "Trabalhista", "Empresarial", "Tributário"][i % 4],
      status: ["ativo", "arquivado", "suspenso", "encerrado"][i % 4] as any,
      valor: (i + 1) * 10000,
      dataInicio: new Date(2023, i % 12, (i % 28) + 1),
      responsavel: "Dr. João Silva",
      tribunal: "TJSP",
      vara: `${i + 1}ª Vara Cível`,
      assunto: `Assunto do processo ${i + 1}`,
      prioridade: ["baixa", "media", "alta", "critica"][i % 4] as any,
      risco: ["baixo", "medio", "alto"][i % 3] as any,
      proximaAudiencia:
        i % 3 === 0 ? new Date(2024, 0, (i % 30) + 1) : undefined,
      proximoPrazo: i % 4 === 0 ? new Date(2024, 0, (i % 15) + 1) : undefined,
      tags: [`tag_${i % 3}`, `area_${i % 4}`],
      observacoes:
        i % 3 === 0
          ? `Observação importante sobre o processo ${i + 1}`
          : undefined,
      movimentacoes: [],
      publicacoes: [],
      documentos: [],
      tarefas: [],
      contratos: [],
    }));
  }

  private generateMockPublicacoes(processosIds: string[]): Publicacao[] {
    return processosIds.slice(0, 5).map((processoId, i) => ({
      id: `pub_${i + 1}`,
      processoId,
      numero: `${String(i + 1).padStart(7, "0")}-12.2023.8.26.0001`,
      data: new Date(),
      orgao: "TJSP",
      conteudo: `Publicação ${i + 1} - Conteúdo da publicação oficial`,
      tipo: ["citacao", "intimacao", "sentenca", "despacho"][i % 4] as any,
      prazo: new Date(Date.now() + (i + 1) * 86400000 * 15), // 15 dias por tipo
      status: "pendente" as any,
      arquivo: `publicacao_${i + 1}.pdf`,
      responsavel: "Dr. João Silva",
    }));
  }
}

// ===== SINGLETON EXPORT =====
export const processoApiService = ProcessoApiService.getInstance();

// ===== REACT HOOK =====
import { useCallback } from "react";

export const useProcessoApi = () => {
  const service = ProcessoApiService.getInstance();

  const obterAndamentosProcesso = useCallback(
    async (numeroProcesso: string) => {
      return await service.consultarProcessoTJSP(numeroProcesso);
    },
    [],
  );

  const consultarTJSP = useCallback(async (numeroProcesso: string) => {
    return await service.consultarProcessoTJSP(numeroProcesso);
  }, []);

  const consultarOAB = useCallback(
    async (numeroOAB: string, seccional = "SP") => {
      return await service.consultarOAB(numeroOAB, seccional);
    },
    [],
  );

  const consultarCNJ = useCallback(async (numeroProcesso: string) => {
    return await service.consultarProcessoCNJ(numeroProcesso);
  }, []);

  const buscarProcessos = useCallback(
    async (filtros: Parameters<typeof service.buscarProcessos>[0]) => {
      return await service.buscarProcessos(filtros);
    },
    [],
  );

  const criarProcesso = useCallback(
    async (dadosProcesso: Parameters<typeof service.criarProcesso>[0]) => {
      return await service.criarProcesso(dadosProcesso);
    },
    [],
  );

  const atualizarProcesso = useCallback(
    async (
      id: string,
      dados: Parameters<typeof service.atualizarProcesso>[1],
    ) => {
      return await service.atualizarProcesso(id, dados);
    },
    [],
  );

  const adicionarMovimentacao = useCallback(
    async (
      processoId: string,
      movimentacao: Parameters<typeof service.adicionarMovimentacao>[1],
    ) => {
      return await service.adicionarMovimentacao(processoId, movimentacao);
    },
    [],
  );

  const monitorarPublicacoes = useCallback(async (processosIds: string[]) => {
    return await service.monitorarPublicacoes(processosIds);
  }, []);

  const criarAlerta = useCallback(
    async (
      processoId: string,
      tipo: "prazo" | "audiencia" | "publicacao" | "movimentacao",
      descricao: string,
      dataLimite?: Date,
    ) => {
      try {
        // Simula criação de alerta
        await new Promise((resolve) => setTimeout(resolve, 500));
        toast.success(`Alerta de ${tipo} criado com sucesso`);
        return true;
      } catch (error) {
        console.error("Erro ao criar alerta:", error);
        toast.error("Erro ao criar alerta");
        return false;
      }
    },
    [],
  );

  const clearCache = useCallback(() => {
    service.clearCache();
  }, []);

  const getCacheStats = useCallback(() => {
    return service.getCacheStats();
  }, []);

  return {
    // Main service methods
    obterAndamentosProcesso,
    consultarTJSP,
    consultarOAB,
    consultarCNJ,
    buscarProcessos,
    criarProcesso,
    atualizarProcesso,
    adicionarMovimentacao,
    monitorarPublicacoes,
    criarAlerta,

    // Utility methods
    clearCache,
    getCacheStats,

    // Static utilities
    formatarNumeroProcesso: ProcessoApiService.formatarNumeroProcesso,
    validarNumeroProcesso: ProcessoApiService.validarNumeroProcesso,
    extrairInfoCNJ: ProcessoApiService.extrairInfoCNJ,
  };
};

// ===== UTILITY FUNCTIONS =====
export const formatarNumeroProcesso = ProcessoApiService.formatarNumeroProcesso;
export const validarNumeroProcesso = ProcessoApiService.validarNumeroProcesso;
export const extrairInfoCNJ = ProcessoApiService.extrairInfoCNJ;

export default processoApiService;
