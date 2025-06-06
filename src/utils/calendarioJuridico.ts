import { addDays, isWeekend, format, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Feriados nacionais fixos (formato MM-DD)
 */
export const FERIADOS_NACIONAIS = [
  "01-01", // Confraternização Universal
  "04-21", // Tiradentes
  "09-07", // Independência do Brasil
  "10-12", // Nossa Senhora Aparecida
  "11-02", // Finados
  "11-15", // Proclamação da República
  "12-25", // Natal
];

/**
 * Pontos facultativos comuns (formato MM-DD)
 */
export const PONTOS_FACULTATIVOS = [
  "02-20", // Carnaval (segunda)
  "02-21", // Carnaval (terça)
  "04-23", // São Jorge
  "06-12", // Dia dos Namorados
  "10-28", // Dia do Servidor Público
  "11-20", // Consciência Negra
  "12-24", // Véspera de Natal
  "12-31", // Véspera de Ano Novo
];

/**
 * Feriados móveis que precisam ser calculados por ano
 */
export function calcularFeriadosMoveis(ano: number): string[] {
  const pascoa = calcularPascoa(ano);
  const carnaval = addDays(pascoa, -47); // 47 dias antes da Páscoa
  const sextaSanta = addDays(pascoa, -2);
  const corpus = addDays(pascoa, 60);

  return [
    format(carnaval, "MM-dd"),
    format(addDays(carnaval, 1), "MM-dd"), // Terça de carnaval
    format(sextaSanta, "MM-dd"),
    format(corpus, "MM-dd"),
  ];
}

/**
 * Calcula a data da Páscoa para um ano específico (Algoritmo de Oudin)
 */
export function calcularPascoa(ano: number): Date {
  const a = ano % 19;
  const b = Math.floor(ano / 100);
  const c = ano % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const n = Math.floor((h + l - 7 * m + 114) / 31);
  const p = (h + l - 7 * m + 114) % 31;

  return new Date(ano, n - 1, p + 1);
}

/**
 * Verifica se uma data é feriado nacional
 */
export function ehFeriadoNacional(data: Date): boolean {
  const dataStr = format(data, "MM-dd");
  const ano = data.getFullYear();
  const feriadosMoveis = calcularFeriadosMoveis(ano);

  return (
    FERIADOS_NACIONAIS.includes(dataStr) || feriadosMoveis.includes(dataStr)
  );
}

/**
 * Verifica se uma data é ponto facultativo
 */
export function ehPontoFacultativo(data: Date): boolean {
  const dataStr = format(data, "MM-dd");
  return PONTOS_FACULTATIVOS.includes(dataStr);
}

/**
 * Verifica se uma data é dia útil (não é fim de semana nem feriado)
 */
export function ehDiaUtil(data: Date, considerarFeriados = true): boolean {
  if (isWeekend(data)) return false;
  if (considerarFeriados && ehFeriadoNacional(data)) return false;
  return true;
}

/**
 * Conta dias úteis entre duas datas
 */
export function contarDiasUteis(dataInicial: Date, dataFinal: Date): number {
  let count = 0;
  let currentDate = new Date(dataInicial);

  while (currentDate <= dataFinal) {
    if (ehDiaUtil(currentDate)) {
      count++;
    }
    currentDate = addDays(currentDate, 1);
  }

  return count;
}

/**
 * Adiciona dias úteis a uma data
 */
export function adicionarDiasUteis(data: Date, dias: number): Date {
  let currentDate = new Date(data);
  let diasAdicionados = 0;

  while (diasAdicionados < dias) {
    currentDate = addDays(currentDate, 1);
    if (ehDiaUtil(currentDate)) {
      diasAdicionados++;
    }
  }

  return currentDate;
}

/**
 * Adiciona dias corridos, pulando para o próximo dia útil se cair em não útil
 */
export function adicionarDiasCorridos(data: Date, dias: number): Date {
  let dataFinal = addDays(data, dias);

  // Se a data final cair em não útil, move para o próximo dia útil
  while (!ehDiaUtil(dataFinal)) {
    dataFinal = addDays(dataFinal, 1);
  }

  return dataFinal;
}

/**
 * Obtém o próximo dia útil a partir de uma data
 */
export function proximoDiaUtil(data: Date): Date {
  let proximaData = addDays(data, 1);

  while (!ehDiaUtil(proximaData)) {
    proximaData = addDays(proximaData, 1);
  }

  return proximaData;
}

/**
 * Obtém o dia útil anterior a uma data
 */
export function diaUtilAnterior(data: Date): Date {
  let dataAnterior = addDays(data, -1);

  while (!ehDiaUtil(dataAnterior)) {
    dataAnterior = addDays(dataAnterior, -1);
  }

  return dataAnterior;
}

/**
 * Lista todos os feriados de um ano específico
 */
export function listarFeriadosAno(
  ano: number,
): Array<{ data: Date; nome: string; tipo: "nacional" | "movel" }> {
  const feriados = [];

  // Feriados fixos
  const feriadosFixos = [
    { data: "01-01", nome: "Confraternização Universal" },
    { data: "04-21", nome: "Tiradentes" },
    { data: "09-07", nome: "Independência do Brasil" },
    { data: "10-12", nome: "Nossa Senhora Aparecida" },
    { data: "11-02", nome: "Finados" },
    { data: "11-15", nome: "Proclamação da República" },
    { data: "12-25", nome: "Natal" },
  ];

  feriadosFixos.forEach((feriado) => {
    const [mes, dia] = feriado.data.split("-").map(Number);
    feriados.push({
      data: new Date(ano, mes - 1, dia),
      nome: feriado.nome,
      tipo: "nacional" as const,
    });
  });

  // Feriados móveis
  const pascoa = calcularPascoa(ano);
  const carnaval = addDays(pascoa, -47);
  const sextaSanta = addDays(pascoa, -2);
  const corpus = addDays(pascoa, 60);

  feriados.push(
    { data: carnaval, nome: "Segunda de Carnaval", tipo: "movel" as const },
    {
      data: addDays(carnaval, 1),
      nome: "Terça de Carnaval",
      tipo: "movel" as const,
    },
    { data: sextaSanta, nome: "Sexta-feira Santa", tipo: "movel" as const },
    { data: corpus, nome: "Corpus Christi", tipo: "movel" as const },
  );

  return feriados.sort((a, b) => a.data.getTime() - b.data.getTime());
}

/**
 * Calcula o número de dias úteis entre datas considerando feriados específicos
 */
export function calcularDiasUteisComFeriados(
  dataInicial: Date,
  dataFinal: Date,
  feriadosAdicionais: Date[] = [],
): number {
  let count = 0;
  let currentDate = new Date(dataInicial);

  while (currentDate <= dataFinal) {
    if (ehDiaUtil(currentDate)) {
      // Verificar se não é um feriado adicional
      const ehFeriadoAdicional = feriadosAdicionais.some(
        (feriado) =>
          format(feriado, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd"),
      );

      if (!ehFeriadoAdicional) {
        count++;
      }
    }
    currentDate = addDays(currentDate, 1);
  }

  return count;
}

/**
 * Formata data no padrão brasileiro
 */
export function formatarDataBrasil(data: Date): string {
  return format(data, "dd/MM/yyyy", { locale: ptBR });
}

/**
 * Formata data por extenso no padrão brasileiro
 */
export function formatarDataExtenso(data: Date): string {
  return format(data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

/**
 * Valida se uma string de data está em formato válido
 */
export function validarFormatoData(dataStr: string): boolean {
  const formatos = ["yyyy-MM-dd", "dd/MM/yyyy", "dd-MM-yyyy", "MM/dd/yyyy"];

  return formatos.some((formato) => {
    try {
      const data = parseISO(dataStr);
      return isValid(data);
    } catch {
      return false;
    }
  });
}

/**
 * Converte string para Date considerando formato brasileiro
 */
export function parseDataBrasil(dataStr: string): Date {
  // Aceita formatos: dd/MM/yyyy, dd-MM-yyyy, yyyy-MM-dd
  if (dataStr.includes("/")) {
    const [dia, mes, ano] = dataStr.split("/").map(Number);
    return new Date(ano, mes - 1, dia);
  } else if (dataStr.includes("-")) {
    if (dataStr.indexOf("-") === 4) {
      // Formato yyyy-MM-dd
      return parseISO(dataStr);
    } else {
      // Formato dd-MM-yyyy
      const [dia, mes, ano] = dataStr.split("-").map(Number);
      return new Date(ano, mes - 1, dia);
    }
  }

  throw new Error("Formato de data inválido");
}
