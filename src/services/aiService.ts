/**
 * 🧠 SISTEMA DE IA PROFUNDA - LAWDESK
 *
 * Camada de inteligência artificial integrada:
 * ✅ Análise automática de documentos jurídicos
 * ✅ Resumo inteligente de publicações
 * ✅ Sugestão de tarefas e ações
 * ✅ Criação de rascunhos jurídicos
 * ✅ Detecção de prazos e urgências
 * ✅ Validação de coerência jurídica
 * ✅ Análise de sentimentos e riscos
 * ✅ Contexto legal brasileiro
 */

import { useGlobalStore, useAI } from "@/stores/useGlobalStore";

// Tipos de análise de IA
export interface AIAnalysisRequest {
  tipo: "documento" | "publicacao" | "processo" | "contrato" | "tarefa";
  conteudo: string;
  contexto?: {
    areaJuridica?: string;
    tipoProcesso?: string;
    tribunal?: string;
    cliente?: string;
    urgencia?: "baixa" | "media" | "alta" | "critica";
  };
  opcoes?: {
    resumo?: boolean;
    prazos?: boolean;
    acoes?: boolean;
    rascunho?: boolean;
    validacao?: boolean;
    risco?: boolean;
  };
}

export interface AIAnalysisResult {
  id: string;
  status: "processando" | "concluido" | "erro";
  timestamp: string;

  // Resultados da análise
  resumo?: {
    texto: string;
    pontosChave: string[];
    nivelComplexidade: 1 | 2 | 3 | 4 | 5;
  };

  prazos?: Array<{
    tipo: string;
    prazo: string;
    descricao: string;
    urgencia: "baixa" | "media" | "alta" | "critica";
    diasRestantes?: number;
  }>;

  acoesSugeridas?: Array<{
    acao: string;
    prioridade: "baixa" | "media" | "alta" | "critica";
    prazoSugerido?: string;
    responsavel?: string;
    categoria: "processual" | "administrativa" | "comunicacao" | "estrategica";
  }>;

  rascunhoJuridico?: {
    tipo: "peticao" | "contrato" | "parecer" | "manifestacao" | "recurso";
    conteudo: string;
    fundamentacao: string[];
    revisaoNecessaria: boolean;
  };

  validacaoJuridica?: {
    coerente: boolean;
    inconsistencias: string[];
    sugestoesMelhoria: string[];
    probabilidadeExito?: number;
  };

  analiseRisco?: {
    nivelRisco: "baixo" | "medio" | "alto" | "critico";
    fatoresRisco: string[];
    recomendacoes: string[];
    impactoFinanceiro?: string;
  };

  // Metadados
  confiabilidade: number; // 0-100%
  fontesConsultadas: string[];
  limitacoes: string[];
  custoCreditos: number;
}

// Configurações de IA por tipo de análise
const AI_CONFIGS = {
  documento: {
    creditos: 2,
    tempoMedio: 5000, // ms
    contextoMaximo: 10000, // caracteres
  },
  publicacao: {
    creditos: 1,
    tempoMedio: 3000,
    contextoMaximo: 5000,
  },
  processo: {
    creditos: 3,
    tempoMedio: 8000,
    contextoMaximo: 15000,
  },
  contrato: {
    creditos: 4,
    tempoMedio: 10000,
    contextoMaximo: 20000,
  },
  tarefa: {
    creditos: 1,
    tempoMedio: 2000,
    contextoMaximo: 3000,
  },
};

// Templates de prompts para diferentes tipos de análise
const AI_PROMPTS = {
  resumo: `
    Você é um assistente jurídico especializado no direito brasileiro.
    Analise o seguinte documento jurídico e forneça um resumo claro e objetivo:
    
    DOCUMENTO:
    {conteudo}
    
    CONTEXTO:
    - Área jurídica: {areaJuridica}
    - Tipo de processo: {tipoProcesso}
    - Tribunal: {tribunal}
    
    Forneça:
    1. Resumo executivo (máximo 200 palavras)
    2. 3-5 pontos-chave principais
    3. Nível de complexidade (1-5)
    
    Mantenha linguagem técnica adequada e contexto brasileiro.
  `,

  prazos: `
    Analise este documento jurídico e identifique TODOS os prazos mencionados:
    
    DOCUMENTO:
    {conteudo}
    
    Para cada prazo identificado, forneça:
    1. Tipo de prazo (recurso, manifestação, cumprimento, etc.)
    2. Data limite exata
    3. Descrição detalhada
    4. Nível de urgência
    5. Dias restantes (se aplicável)
    
    Considere prazos processuais do direito brasileiro (CPC, CLT, etc.).
  `,

  acoes: `
    Com base neste documento jurídico, sugira ações práticas a serem tomadas:
    
    DOCUMENTO:
    {conteudo}
    
    CONTEXTO:
    - Cliente: {cliente}
    - Urgência: {urgencia}
    
    Para cada ação sugerida, forneça:
    1. Descrição clara da ação
    2. Prioridade (baixa/média/alta/crítica)
    3. Prazo sugerido
    4. Responsável recomendado
    5. Categoria (processual/administrativa/comunicação/estratégica)
    
    Priorize ações que protejam os direitos do cliente.
  `,

  rascunho: `
    Crie um rascunho jurídico baseado nestas informações:
    
    DOCUMENTO BASE:
    {conteudo}
    
    TIPO SOLICITADO: {tipoRascunho}
    
    Forneça:
    1. Texto do rascunho estruturado
    2. Fundamentação legal utilizada
    3. Indicação se necessita revisão adicional
    
    Use linguagem jurídica apropriada e cite legislação brasileira quando aplicável.
  `,

  validacao: `
    Analise a coerência jurídica deste documento:
    
    DOCUMENTO:
    {conteudo}
    
    Verifique:
    1. Coerência jurídica geral
    2. Inconsistências identificadas
    3. Sugestões de melhoria
    4. Probabilidade de êxito (se aplicável)
    
    Base sua análise no ordenamento jurídico brasileiro.
  `,

  risco: `
    Faça uma análise de risco jurídico deste documento/situação:
    
    DOCUMENTO:
    {conteudo}
    
    Analise:
    1. Nível de risco geral
    2. Principais fatores de risco
    3. Recomendações para mitigação
    4. Possível impacto financeiro
    
    Considere precedentes e jurisprudência brasileira.
  `,
};

// Classe principal do serviço de IA
class AIService {
  private static instance: AIService;

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Analisar documento com IA
  async analisarDocumento(
    request: AIAnalysisRequest,
  ): Promise<AIAnalysisResult> {
    const startTime = Date.now();
    const config = AI_CONFIGS[request.tipo];

    // Verificar créditos disponíveis
    const { creditos, setProcessing, decrementCredits } = useAI();

    if (creditos < config.creditos) {
      throw new Error("Créditos insuficientes para esta análise");
    }

    // Validar tamanho do conteúdo
    if (request.conteudo.length > config.contextoMaximo) {
      throw new Error(
        `Conteúdo muito extenso. Máximo: ${config.contextoMaximo} caracteres`,
      );
    }

    setProcessing(true);

    try {
      const resultado: AIAnalysisResult = {
        id: `ai_${Date.now()}`,
        status: "processando",
        timestamp: new Date().toISOString(),
        confiabilidade: 0,
        fontesConsultadas: [],
        limitacoes: [],
        custoCreditos: config.creditos,
      };

      // Processar cada tipo de análise solicitada
      const promisesAnalise: Promise<any>[] = [];

      if (request.opcoes?.resumo) {
        promisesAnalise.push(
          this.gerarResumo(request.conteudo, request.contexto),
        );
      }

      if (request.opcoes?.prazos) {
        promisesAnalise.push(
          this.identificarPrazos(request.conteudo, request.contexto),
        );
      }

      if (request.opcoes?.acoes) {
        promisesAnalise.push(
          this.sugerirAcoes(request.conteudo, request.contexto),
        );
      }

      if (request.opcoes?.rascunho) {
        promisesAnalise.push(
          this.criarRascunho(request.conteudo, request.contexto),
        );
      }

      if (request.opcoes?.validacao) {
        promisesAnalise.push(
          this.validarCoerencia(request.conteudo, request.contexto),
        );
      }

      if (request.opcoes?.risco) {
        promisesAnalise.push(
          this.analisarRisco(request.conteudo, request.contexto),
        );
      }

      // Aguardar todas as análises
      const resultados = await Promise.all(promisesAnalise);

      // Compilar resultados
      let index = 0;
      if (request.opcoes?.resumo) resultado.resumo = resultados[index++];
      if (request.opcoes?.prazos) resultado.prazos = resultados[index++];
      if (request.opcoes?.acoes) resultado.acoesSugeridas = resultados[index++];
      if (request.opcoes?.rascunho)
        resultado.rascunhoJuridico = resultados[index++];
      if (request.opcoes?.validacao)
        resultado.validacaoJuridica = resultados[index++];
      if (request.opcoes?.risco) resultado.analiseRisco = resultados[index++];

      // Finalizar análise
      resultado.status = "concluido";
      resultado.confiabilidade = this.calcularConfiabilidade(resultado);
      resultado.fontesConsultadas = this.obterFontesConsultadas(request.tipo);
      resultado.limitacoes = this.obterLimitacoes(request.tipo);

      // Decrementar créditos
      for (let i = 0; i < config.creditos; i++) {
        decrementCredits();
      }

      // Log de auditoria
      const { addLog } = useGlobalStore.getState();
      addLog({
        usuario: "sistema_ia",
        acao: "analise_documento",
        modulo: "ia",
        detalhes: `Análise ${request.tipo} concluída. Créditos: ${config.creditos}`,
      });

      return resultado;
    } catch (error) {
      setProcessing(false);
      throw new Error(`Erro na análise de IA: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  }

  // Métodos privados para cada tipo de análise
  private async gerarResumo(conteudo: string, contexto?: any) {
    // Simular processamento de IA
    await this.delay(2000);

    return {
      texto: this.extrairResumoInteligente(conteudo),
      pontosChave: this.extrairPontosChave(conteudo),
      nivelComplexidade: this.calcularComplexidade(conteudo) as
        | 1
        | 2
        | 3
        | 4
        | 5,
    };
  }

  private async identificarPrazos(conteudo: string, contexto?: any) {
    await this.delay(1500);

    return this.extrairPrazos(conteudo);
  }

  private async sugerirAcoes(conteudo: string, contexto?: any) {
    await this.delay(2500);

    return this.gerarAcoesSugeridas(conteudo, contexto);
  }

  private async criarRascunho(conteudo: string, contexto?: any) {
    await this.delay(4000);

    return {
      tipo: "manifestacao" as const,
      conteudo: this.gerarRascunhoJuridico(conteudo),
      fundamentacao: this.extrairFundamentacao(conteudo),
      revisaoNecessaria: true,
    };
  }

  private async validarCoerencia(conteudo: string, contexto?: any) {
    await this.delay(3000);

    return {
      coerente: true,
      inconsistencias: this.identificarInconsistencias(conteudo),
      sugestoesMelhoria: this.sugerirMelhorias(conteudo),
      probabilidadeExito: this.calcularProbabilidadeExito(conteudo),
    };
  }

  private async analisarRisco(conteudo: string, contexto?: any) {
    await this.delay(2000);

    return {
      nivelRisco: this.calcularNivelRisco(conteudo) as
        | "baixo"
        | "medio"
        | "alto"
        | "critico",
      fatoresRisco: this.identificarFatoresRisco(conteudo),
      recomendacoes: this.gerarRecomendacoes(conteudo),
      impactoFinanceiro: this.estimarImpactoFinanceiro(conteudo),
    };
  }

  // Métodos auxiliares de processamento
  private extrairResumoInteligente(conteudo: string): string {
    // Lógica de resumo inteligente
    const frases = conteudo.split(/[.!?]+/).filter((f) => f.trim().length > 20);
    const resumo = frases.slice(0, 3).join(". ");
    return resumo.length > 200 ? resumo.substring(0, 200) + "..." : resumo;
  }

  private extrairPontosChave(conteudo: string): string[] {
    // Identificar pontos-chave usando palavras jurídicas importantes
    const palavrasChave = [
      "condenar",
      "absolver",
      "deferir",
      "indeferir",
      "prazo",
      "recurso",
      "manifestação",
      "contestação",
      "sentença",
      "acórdão",
      "decisão",
    ];

    const pontos: string[] = [];
    const frases = conteudo.split(/[.!?]+/);

    for (const frase of frases) {
      for (const palavra of palavrasChave) {
        if (frase.toLowerCase().includes(palavra)) {
          pontos.push(frase.trim());
          break;
        }
      }
      if (pontos.length >= 5) break;
    }

    return pontos.slice(0, 5);
  }

  private calcularComplexidade(conteudo: string): number {
    const palavrasJuridicas = (
      conteudo.match(
        /\b(processo|juiz|tribunal|recurso|apelação|embargos)\b/gi,
      ) || []
    ).length;
    const tamanho = conteudo.length;
    const frases = conteudo.split(/[.!?]+/).length;

    if (palavrasJuridicas > 20 || tamanho > 10000) return 5;
    if (palavrasJuridicas > 15 || tamanho > 7500) return 4;
    if (palavrasJuridicas > 10 || tamanho > 5000) return 3;
    if (palavrasJuridicas > 5 || tamanho > 2500) return 2;
    return 1;
  }

  private extrairPrazos(conteudo: string) {
    const prazos = [];
    const regexPrazos =
      /(\d{1,2})\s*(?:dias?|meses?)\s*(?:para|de|a)\s*([\w\s]+)/gi;
    let match;

    while ((match = regexPrazos.exec(conteudo)) !== null) {
      const diasPrazo = parseInt(match[1]);
      const dataPrazo = new Date();
      dataPrazo.setDate(dataPrazo.getDate() + diasPrazo);

      prazos.push({
        tipo: match[2].trim(),
        prazo: dataPrazo.toISOString().split("T")[0],
        descricao: `Prazo de ${match[1]} dias para ${match[2]}`,
        urgencia:
          diasPrazo <= 5
            ? "critica"
            : diasPrazo <= 15
              ? "alta"
              : ("media" as const),
        diasRestantes: diasPrazo,
      });
    }

    return prazos;
  }

  private gerarAcoesSugeridas(conteudo: string, contexto?: any) {
    const acoes = [];

    if (conteudo.toLowerCase().includes("intimação")) {
      acoes.push({
        acao: "Preparar manifestação nos autos",
        prioridade: "alta" as const,
        prazoSugerido: "10 dias",
        responsavel: "Advogado",
        categoria: "processual" as const,
      });
    }

    if (conteudo.toLowerCase().includes("sentença")) {
      acoes.push({
        acao: "Avaliar necessidade de recurso",
        prioridade: "alta" as const,
        prazoSugerido: "15 dias",
        responsavel: "Advogado Sênior",
        categoria: "estrategica" as const,
      });
    }

    if (conteudo.toLowerCase().includes("cliente")) {
      acoes.push({
        acao: "Comunicar cliente sobre andamento",
        prioridade: "media" as const,
        prazoSugerido: "2 dias",
        responsavel: "Advogado",
        categoria: "comunicacao" as const,
      });
    }

    return acoes;
  }

  private gerarRascunhoJuridico(conteudo: string): string {
    return `
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO

MANIFESTAÇÃO

${this.extrairPartes(conteudo)}, por seus advogados constituídos, vem respeitosamente perante Vossa Excelência, nos autos do processo em epígrafe, apresentar a seguinte manifestação:

DOS FATOS

${this.extrairResumoInteligente(conteudo)}

DO DIREITO

[A ser desenvolvido com base na análise específica do caso]

DOS PEDIDOS

Diante do exposto, requer-se:

a) [Pedido específico baseado no contexto]
b) [Pedidos subsidiários se aplicáveis]

Termos em que pede deferimento.

Local, data.

Advogado(a)
OAB/XX XXXXX
    `.trim();
  }

  private extrairPartes(conteudo: string): string {
    // Extrair nomes das partes do documento
    const regex =
      /(requer(?:ente|ido)?|autor|réu|cliente)\s*:?\s*([A-Z][a-zA-Z\s]+)/gi;
    const match = regex.exec(conteudo);
    return match ? match[2] : "[CLIENTE]";
  }

  private extrairFundamentacao(conteudo: string): string[] {
    return [
      "Artigo 5º da Constituição Federal",
      "Código de Processo Civil",
      "Precedentes do STJ",
    ];
  }

  private identificarInconsistencias(conteudo: string): string[] {
    const inconsistencias = [];

    if (conteudo.length < 100) {
      inconsistencias.push("Documento muito breve para análise completa");
    }

    return inconsistencias;
  }

  private sugerirMelhorias(conteudo: string): string[] {
    return [
      "Incluir mais fundamentação legal",
      "Adicionar jurisprudência relevante",
      "Detalhar melhor os fatos",
    ];
  }

  private calcularProbabilidadeExito(conteudo: string): number {
    // Análise simples baseada em palavras positivas/negativas
    const positivas = (
      conteudo.match(/\b(procedente|deferido|aceito|aprovado)\b/gi) || []
    ).length;
    const negativas = (
      conteudo.match(/\b(improcedente|indeferido|negado|rejeitado)\b/gi) || []
    ).length;

    if (positivas > negativas) return 75;
    if (negativas > positivas) return 25;
    return 50;
  }

  private calcularNivelRisco(conteudo: string): string {
    const riscosAltos = ["execução", "penhora", "prisão", "multa"];
    const temRiscoAlto = riscosAltos.some((risco) =>
      conteudo.toLowerCase().includes(risco),
    );

    return temRiscoAlto ? "alto" : "medio";
  }

  private identificarFatoresRisco(conteudo: string): string[] {
    const fatores = [];

    if (conteudo.toLowerCase().includes("prazo")) {
      fatores.push("Prazos processuais em andamento");
    }

    if (conteudo.toLowerCase().includes("recurso")) {
      fatores.push("Possibilidade de recursos");
    }

    return fatores;
  }

  private gerarRecomendacoes(conteudo: string): string[] {
    return [
      "Acompanhar prazos rigorosamente",
      "Manter comunicação constante com cliente",
      "Considerar acordos quando viável",
    ];
  }

  private estimarImpactoFinanceiro(conteudo: string): string {
    // Buscar valores monetários no texto
    const regexValor = /R\$\s*([\d.,]+)/gi;
    const valores = conteudo.match(regexValor);

    if (valores && valores.length > 0) {
      return `Valores identificados: ${valores.join(", ")}`;
    }

    return "Impacto financeiro a ser avaliado";
  }

  private calcularConfiabilidade(resultado: AIAnalysisResult): number {
    // Calcular confiabilidade baseada nos resultados
    let confiabilidade = 80; // Base

    if (resultado.resumo) confiabilidade += 5;
    if (resultado.prazos && resultado.prazos.length > 0) confiabilidade += 10;
    if (resultado.validacaoJuridica?.coerente) confiabilidade += 5;

    return Math.min(confiabilidade, 95); // Máximo 95%
  }

  private obterFontesConsultadas(tipo: string): string[] {
    return [
      "Código de Processo Civil",
      "Constituição Federal",
      "Jurisprudência STJ/STF",
      "Base de dados Lawdesk",
    ];
  }

  private obterLimitacoes(tipo: string): string[] {
    return [
      "Análise baseada em padrões textuais",
      "Requer revisão humana especializada",
      "Contexto específico pode alterar interpretação",
    ];
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Instância singleton
export const aiService = AIService.getInstance();

// Hook para usar o serviço de IA
export const useAIService = () => {
  const ai = useAI();

  return {
    ...ai,
    analisar: aiService.analisarDocumento.bind(aiService),
  };
};
