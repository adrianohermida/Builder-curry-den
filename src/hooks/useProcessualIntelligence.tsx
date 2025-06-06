import { useState, useEffect } from "react";
import {
  identifyTribunal,
  generateTribunalLink,
  getUrgencyLevel,
  generateAISummary,
  detectProcessNumbers,
  validateProcessNumber,
  TribunalInfo,
} from "@/utils/processualUtils";

export interface ProcessualAnalysis {
  tribunal: TribunalInfo | null;
  urgency: "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";
  processNumbers: string[];
  tribunalLink: string | null;
  aiSummary: string;
  suggestedActions: string[];
  estimatedDeadline: Date | null;
}

export interface PublicacaoData {
  id: string;
  titulo: string;
  conteudo: string;
  data: string;
  tribunal: string;
  tipo: string;
  numeroProcesso?: string;
  prazo?: string;
  assunto?: string;
  lida: boolean;
  visivel_cliente: boolean;
}

export function useProcessualIntelligence() {
  const [analysis, setAnalysis] = useState<ProcessualAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzePublication = async (
    publicacao: PublicacaoData,
  ): Promise<ProcessualAnalysis> => {
    setLoading(true);

    try {
      // Detectar números de processo no conteúdo
      const processNumbers = detectProcessNumbers(
        publicacao.conteudo + " " + (publicacao.numeroProcesso || ""),
      );

      // Identificar tribunal principal
      const mainProcessNumber = publicacao.numeroProcesso || processNumbers[0];
      const tribunal = mainProcessNumber
        ? identifyTribunal(mainProcessNumber)
        : null;

      // Gerar link para o tribunal
      const tribunalLink =
        tribunal && mainProcessNumber
          ? generateTribunalLink(mainProcessNumber, tribunal)
          : null;

      // Analisar urgência
      const urgency = getUrgencyLevel(publicacao);

      // Gerar resumo com IA
      const aiSummary = generateAISummary(publicacao);

      // Sugerir ações baseadas na análise
      const suggestedActions = generateSuggestedActions(
        publicacao,
        urgency,
        tribunal,
      );

      // Estimar prazo se não fornecido
      const estimatedDeadline = estimateDeadline(publicacao, urgency);

      const analysisResult: ProcessualAnalysis = {
        tribunal,
        urgency,
        processNumbers,
        tribunalLink,
        aiSummary,
        suggestedActions,
        estimatedDeadline,
      };

      setAnalysis(analysisResult);
      return analysisResult;
    } catch (error) {
      console.error("Erro na análise processual:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestedActions = (
    publicacao: PublicacaoData,
    urgency: string,
    tribunal: TribunalInfo | null,
  ): string[] => {
    const actions = [];

    // Ações baseadas na urgência
    switch (urgency) {
      case "CRITICA":
        actions.push("🚨 Ação imediata necessária");
        actions.push("📞 Contatar cliente urgentemente");
        actions.push("⚖️ Verificar prazos recursais");
        break;
      case "ALTA":
        actions.push("⚡ Priorizar atendimento");
        actions.push("📋 Preparar documentação");
        break;
      case "MEDIA":
        actions.push("📅 Agendar análise");
        actions.push("📝 Incluir na agenda semanal");
        break;
      default:
        actions.push("👁️ Acompanhar desenvolvimento");
    }

    // Ações baseadas no tipo de publicação
    const tipo = publicacao.tipo?.toLowerCase() || "";
    if (tipo.includes("citação")) {
      actions.push("📋 Preparar contestação");
      actions.push("⏰ Calcular prazo de resposta");
    } else if (tipo.includes("intimação")) {
      actions.push("📄 Verificar tipo de intimação");
      actions.push("🔍 Analisar exigências");
    } else if (tipo.includes("sentença")) {
      actions.push("⚖️ Analisar dispositivo");
      actions.push("📈 Avaliar possibilidade recursal");
    }

    // Ações baseadas no tribunal
    if (tribunal) {
      actions.push(`🏛️ Acessar ${tribunal.sistema}`);
      actions.push(`📊 Verificar movimentações no ${tribunal.nome}`);
    }

    return actions;
  };

  const estimateDeadline = (
    publicacao: PublicacaoData,
    urgency: string,
  ): Date | null => {
    if (publicacao.prazo) {
      return new Date(publicacao.prazo);
    }

    const today = new Date();
    const tipo = publicacao.tipo?.toLowerCase() || "";

    // Estimativas baseadas no tipo de publicação
    if (tipo.includes("citação")) {
      // 15 dias para contestação
      return new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);
    } else if (tipo.includes("intimação")) {
      // 5 dias para cumprimento
      return new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
    } else if (tipo.includes("sentença")) {
      // 15 dias para recurso
      return new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);
    }

    // Estimativa baseada na urgência
    switch (urgency) {
      case "CRITICA":
        return new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000); // 1 dia
      case "ALTA":
        return new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 dias
      case "MEDIA":
        return new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 dias
      default:
        return new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 dias
    }
  };

  const generatePetitionSuggestion = async (
    publicacao: PublicacaoData,
  ): Promise<string> => {
    setLoading(true);

    try {
      // Simulação de geração de petição com IA
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const tipo = publicacao.tipo?.toLowerCase() || "";
      let template = "";

      if (tipo.includes("citação")) {
        template = `**CONTESTAÇÃO**

Excelentíssimo(a) Senhor(a) Doutor(a) Juiz(a) de Direito da [Vara]

[NOME DO RÉU], [qualificação], por seu advogado signatário, vem respeitosamente apresentar CONTESTAÇÃO em face da ação movida por [NOME DO AUTOR], pelos fatos e fundamentos que seguem:

**DOS FATOS**
[Relatar os fatos conforme a publicação]

**DO DIREITO**
[Fundamentação jurídica]

**DOS PEDIDOS**
Diante do exposto, requer-se:
a) A total improcedência da ação;
b) A condenação do autor ao pagamento das custas processuais e honorários advocatícios.

Termos em que pede deferimento.

[Local], [Data]

[Nome do Advogado]
OAB/[UF] [Número]`;
      } else if (tipo.includes("intimação")) {
        template = `**PETIÇÃO DE CUMPRIMENTO**

Excelentíssimo(a) Senhor(a) Doutor(a) Juiz(a) de Direito

[NOME DA PARTE], por seu advogado signatário, vem respeitosamente cumprir a intimação de fls. [número], conforme segue:

**DO CUMPRIMENTO**
[Descrever o cumprimento da determinação judicial]

**DOCUMENTOS**
Junta os documentos de fls. [números].

Termos em que pede deferimento.

[Local], [Data]

[Nome do Advogado]
OAB/[UF] [Número]`;
      } else {
        template = `**PETIÇÃO**

Excelentíssimo(a) Senhor(a) Doutor(a) Juiz(a) de Direito

[NOME DA PARTE], por seu advogado signatário, vem respeitosamente requerer:

**DOS FATOS**
[Relatar os fatos relevantes]

**DO PEDIDO**
[Formular o pedido específico]

Termos em que pede deferimento.

[Local], [Data]

[Nome do Advogado]
OAB/[UF] [Número]`;
      }

      return template;
    } catch (error) {
      console.error("Erro ao gerar sugestão de petição:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const linkToProcess = async (
    publicacao: PublicacaoData,
    numeroProcesso: string,
  ): Promise<any> => {
    try {
      // Buscar processo existente ou criar novo
      const processoExistente = await buscarProcesso(numeroProcesso);

      if (processoExistente) {
        // Vincular publicação ao processo existente
        await vincularPublicacaoProcesso(publicacao.id, processoExistente.id);
        return processoExistente;
      } else {
        // Criar novo processo
        const novoProcesso = await criarNovoProcesso(
          numeroProcesso,
          publicacao,
        );
        await vincularPublicacaoProcesso(publicacao.id, novoProcesso.id);
        return novoProcesso;
      }
    } catch (error) {
      console.error("Erro ao vincular processo:", error);
      throw error;
    }
  };

  const buscarProcesso = async (
    numeroProcesso: string,
  ): Promise<any | null> => {
    // Simulação de busca no banco de dados
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simula processo encontrado em 50% dos casos
        if (Math.random() > 0.5) {
          resolve({
            id: `proc_${Date.now()}`,
            numero: numeroProcesso,
            assunto: "Processo vinculado",
            status: "Ativo",
            cliente: "Cliente Exemplo",
          });
        } else {
          resolve(null);
        }
      }, 1000);
    });
  };

  const criarNovoProcesso = async (
    numeroProcesso: string,
    publicacao: PublicacaoData,
  ): Promise<any> => {
    // Simulação de criação de processo
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `proc_${Date.now()}`,
          numero: numeroProcesso,
          assunto: publicacao.assunto || "Novo processo",
          status: "Ativo",
          tribunal: publicacao.tribunal,
          dataAbertura: new Date().toISOString(),
          cliente: "A definir",
        });
      }, 1500);
    });
  };

  const vincularPublicacaoProcesso = async (
    publicacaoId: string,
    processoId: string,
  ): Promise<void> => {
    // Simulação de vinculação
    console.log(
      `Vinculando publicação ${publicacaoId} ao processo ${processoId}`,
    );
  };

  return {
    analysis,
    loading,
    analyzePublication,
    generatePetitionSuggestion,
    linkToProcess,
  };
}
