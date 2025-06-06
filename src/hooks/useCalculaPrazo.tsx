import { useState, useCallback } from "react";
import { useRegrasProcessuais } from "@/contexts/RegrasProcessuaisContext";
import { addDays, addBusinessDays, isWeekend, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface CalculoResultado {
  dataFinal: Date;
  diasCorridos: number;
  diasUteis: number;
  feriados: string[];
  observacoes: string[];
  regra: string;
  multiplicador: number;
}

export interface ParametrosCalculo {
  dataInicial: Date;
  tipoProcesso: "cpc" | "penal" | "trabalhista" | "jef";
  tipoAto: string;
  tipoParte?:
    | "fazendaPublica"
    | "defensoria"
    | "ministerioPublico"
    | "advogadoUnico"
    | "advogadosMultiplos";
  origem:
    | "djen"
    | "intimacao_confirmada"
    | "intimacao_nao_confirmada"
    | "citacao_confirmada";
  numeroProcesso?: string;
}

interface UseCalculaPrazoReturn {
  calcularPrazo: (parametros: ParametrosCalculo) => CalculoResultado;
  calcularPrazoIA: (
    parametros: ParametrosCalculo,
    conteudoPublicacao: string,
  ) => Promise<CalculoResultado>;
  verificarFeriados: (data: Date) => boolean;
  criarTarefaPrazo: (
    resultado: CalculoResultado,
    parametros: ParametrosCalculo,
  ) => Promise<void>;
  validarParametros: (parametros: ParametrosCalculo) => string[];
  loading: boolean;
  error: string | null;
}

export function useCalculaPrazo(): UseCalculaPrazoReturn {
  const { regras, configuracao, getRegraProcesso, getTipoParte } =
    useRegrasProcessuais();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verificarFeriados = useCallback(
    (data: Date): boolean => {
      const dataStr = format(data, "MM-dd");
      return (
        regras.feriados.nacionais.includes(dataStr) ||
        regras.feriados.pontosFacultativos.includes(dataStr)
      );
    },
    [regras],
  );

  const contarDiasUteis = useCallback(
    (dataInicial: Date, dias: number): Date => {
      let dataAtual = new Date(dataInicial);
      let diasContados = 0;

      while (diasContados < dias) {
        dataAtual = addDays(dataAtual, 1);

        // Verifica se não é fim de semana nem feriado
        if (!isWeekend(dataAtual) && !verificarFeriados(dataAtual)) {
          diasContados++;
        }
      }

      return dataAtual;
    },
    [verificarFeriados],
  );

  const calcularDataInicial = useCallback(
    (parametros: ParametrosCalculo): Date => {
      const { dataInicial, origem } = parametros;

      switch (origem) {
        case "djen":
          // D+1 útil da publicação no DJEN
          return contarDiasUteis(dataInicial, 1);

        case "intimacao_confirmada":
          // No dia da leitura confirmada
          return dataInicial;

        case "intimacao_nao_confirmada":
          // D+10 corridos se não confirmada
          return addDays(dataInicial, 10);

        case "citacao_confirmada":
          // D+5 úteis da citação confirmada
          return contarDiasUteis(dataInicial, 5);

        default:
          return dataInicial;
      }
    },
    [contarDiasUteis],
  );

  const validarParametros = useCallback(
    (parametros: ParametrosCalculo): string[] => {
      const erros: string[] = [];

      if (!parametros.dataInicial) {
        erros.push("Data inicial é obrigatória");
      }

      if (!parametros.tipoProcesso) {
        erros.push("Tipo de processo é obrigatório");
      }

      if (!parametros.tipoAto) {
        erros.push("Tipo de ato é obrigatório");
      }

      if (!getRegraProcesso(parametros.tipoProcesso, parametros.tipoAto)) {
        erros.push(
          `Regra não encontrada para ${parametros.tipoProcesso}/${parametros.tipoAto}`,
        );
      }

      return erros;
    },
    [getRegraProcesso],
  );

  const calcularPrazo = useCallback(
    (parametros: ParametrosCalculo): CalculoResultado => {
      setError(null);

      const erros = validarParametros(parametros);
      if (erros.length > 0) {
        setError(erros.join(", "));
        throw new Error(erros.join(", "));
      }

      const regra = getRegraProcesso(
        parametros.tipoProcesso,
        parametros.tipoAto,
      )!;
      const tipoParte = parametros.tipoParte
        ? getTipoParte(parametros.tipoParte)
        : null;

      // Calcular data inicial baseada na origem
      const dataInicialAjustada = calcularDataInicial(parametros);

      // Aplicar multiplicador por tipo de parte
      let prazoFinal = regra.prazo;
      let multiplicador = 1;

      if (tipoParte) {
        multiplicador = tipoParte.multiplicador;
        prazoFinal = Math.ceil(prazoFinal * multiplicador);

        if (tipoParte.adicionalDias) {
          prazoFinal += tipoParte.adicionalDias;
        }
      }

      // Calcular data final
      let dataFinal: Date;
      const feriados: string[] = [];
      const observacoes: string[] = [];

      if (regra.unidade === "dias_uteis") {
        dataFinal = contarDiasUteis(dataInicialAjustada, prazoFinal);
      } else {
        dataFinal = addDays(dataInicialAjustada, prazoFinal);
      }

      // Verificar feriados no período
      let dataTemp = new Date(dataInicialAjustada);
      while (dataTemp <= dataFinal) {
        if (verificarFeriados(dataTemp)) {
          feriados.push(format(dataTemp, "dd/MM/yyyy", { locale: ptBR }));
        }
        dataTemp = addDays(dataTemp, 1);
      }

      // Adicionar observações
      observacoes.push(regra.descricao);

      if (tipoParte) {
        observacoes.push(tipoParte.descricao);
      }

      if (feriados.length > 0) {
        observacoes.push(`Feriados no período: ${feriados.join(", ")}`);
      }

      const diasCorridos = Math.ceil(
        (dataFinal.getTime() - dataInicialAjustada.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      return {
        dataFinal,
        diasCorridos,
        diasUteis: regra.unidade === "dias_uteis" ? prazoFinal : -1,
        feriados,
        observacoes,
        regra: `${regra.prazo} ${regra.unidade}`,
        multiplicador,
      };
    },
    [
      getRegraProcesso,
      getTipoParte,
      calcularDataInicial,
      contarDiasUteis,
      verificarFeriados,
      validarParametros,
    ],
  );

  const calcularPrazoIA = useCallback(
    async (
      parametros: ParametrosCalculo,
      conteudoPublicacao: string,
    ): Promise<CalculoResultado> => {
      if (!configuracao.integracaoIA) {
        return calcularPrazo(parametros);
      }

      setLoading(true);
      try {
        // Simular chamada para IA para análise mais avançada
        const analiseIA = await analisarPublicacaoComIA(
          conteudoPublicacao,
          parametros,
        );

        // Ajustar parâmetros baseado na análise da IA
        const parametrosAjustados = {
          ...parametros,
          tipoAto: analiseIA.tipoAtoSugerido || parametros.tipoAto,
          tipoParte: analiseIA.tipoParteSugerida || parametros.tipoParte,
        };

        const resultado = calcularPrazo(parametrosAjustados);

        // Adicionar observações da IA
        resultado.observacoes.push(...analiseIA.observacoes);

        return resultado;
      } finally {
        setLoading(false);
      }
    },
    [configuracao, calcularPrazo],
  );

  const criarTarefaPrazo = useCallback(
    async (
      resultado: CalculoResultado,
      parametros: ParametrosCalculo,
    ): Promise<void> => {
      try {
        // Integração com módulo de agenda/tarefas
        const tarefa = {
          id: `prazo_${Date.now()}`,
          titulo: `Prazo: ${parametros.tipoAto}`,
          descricao: `Processo: ${parametros.numeroProcesso || "N/A"}\nPrazo final: ${format(resultado.dataFinal, "dd/MM/yyyy")}`,
          dataVencimento: resultado.dataFinal,
          prioridade: resultado.diasCorridos <= 5 ? "alta" : "media",
          categoria: "prazo_processual",
          metadados: {
            numeroProcesso: parametros.numeroProcesso,
            tipoProcesso: parametros.tipoProcesso,
            tipoAto: parametros.tipoAto,
            regra: resultado.regra,
          },
        };

        // Salvar no localStorage (integração com módulo de agenda)
        const tarefasExistentes = JSON.parse(
          localStorage.getItem("lawdesk_tarefas") || "[]",
        );
        tarefasExistentes.push(tarefa);
        localStorage.setItem(
          "lawdesk_tarefas",
          JSON.stringify(tarefasExistentes),
        );

        // Criar notificação preventiva
        if (resultado.diasCorridos <= configuracao.notificacaoAntecipada) {
          const notificacao = {
            id: `notif_${Date.now()}`,
            tipo: "prazo_urgente",
            titulo: "Prazo próximo do vencimento",
            mensagem: `O prazo para ${parametros.tipoAto} vence em ${resultado.diasCorridos} dias`,
            data: new Date(),
            lida: false,
          };

          const notificacoes = JSON.parse(
            localStorage.getItem("lawdesk_notificacoes") || "[]",
          );
          notificacoes.push(notificacao);
          localStorage.setItem(
            "lawdesk_notificacoes",
            JSON.stringify(notificacoes),
          );
        }
      } catch (err) {
        setError("Erro ao criar tarefa de prazo");
        throw err;
      }
    },
    [configuracao],
  );

  return {
    calcularPrazo,
    calcularPrazoIA,
    verificarFeriados,
    criarTarefaPrazo,
    validarParametros,
    loading,
    error,
  };
}

// Função simulada para análise com IA
async function analisarPublicacaoComIA(
  conteudo: string,
  parametros: ParametrosCalculo,
) {
  // Simular delay da API
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const conteudoLower = conteudo.toLowerCase();
  const observacoes: string[] = [];
  let tipoAtoSugerido = parametros.tipoAto;
  let tipoParteSugerida = parametros.tipoParte;

  // Análise básica do conteúdo
  if (
    conteudoLower.includes("fazenda pública") ||
    conteudoLower.includes("união") ||
    conteudoLower.includes("estado") ||
    conteudoLower.includes("município")
  ) {
    tipoParteSugerida = "fazendaPublica";
    observacoes.push(
      "IA: Detectada participação da Fazenda Pública - prazo em dobro aplicado",
    );
  }

  if (conteudoLower.includes("defensoria pública")) {
    tipoParteSugerida = "defensoria";
    observacoes.push(
      "IA: Detectada atuação da Defensoria Pública - prazo em dobro aplicado",
    );
  }

  if (conteudoLower.includes("ministério público")) {
    tipoParteSugerida = "ministerioPublico";
    observacoes.push(
      "IA: Detectada atuação do Ministério Público - prazo em dobro aplicado",
    );
  }

  // Sugestões de tipo de ato baseado no conteúdo
  if (conteudoLower.includes("sentença")) {
    tipoAtoSugerido = "apelacao";
    observacoes.push("IA: Detectada sentença - sugerido prazo de apelação");
  } else if (conteudoLower.includes("acórdão")) {
    tipoAtoSugerido = "recursoEspecial";
    observacoes.push(
      "IA: Detectado acórdão - sugerido prazo para recurso especial",
    );
  } else if (
    conteudoLower.includes("despacho") &&
    conteudoLower.includes("citação")
  ) {
    tipoAtoSugerido = "contestacao";
    observacoes.push("IA: Detectada citação - sugerido prazo de contestação");
  }

  return {
    tipoAtoSugerido,
    tipoParteSugerida,
    observacoes,
  };
}
