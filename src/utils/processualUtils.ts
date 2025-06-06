export interface TribunalInfo {
  codigo: string;
  nome: string;
  sistema: "PJe" | "e-SAJ" | "EPROC" | "PROJUDI" | "OUTROS";
  url: string;
  tipo: "FEDERAL" | "ESTADUAL" | "TRABALHISTA" | "MILITAR" | "ELEITORAL";
}

export const tribunaisData: Record<string, TribunalInfo> = {
  // Justiça Federal
  "03": {
    codigo: "03",
    nome: "TRF 1ª Região",
    sistema: "PJe",
    url: "https://pje1g.trf1.jus.br/pje/",
    tipo: "FEDERAL",
  },
  "04": {
    codigo: "04",
    nome: "TRF 2ª Região",
    sistema: "PJe",
    url: "https://pje2g.trf2.jus.br/pje/",
    tipo: "FEDERAL",
  },
  "05": {
    codigo: "05",
    nome: "TRF 3ª Região",
    sistema: "PJe",
    url: "https://pje2g.trf3.jus.br/pje/",
    tipo: "FEDERAL",
  },
  "06": {
    codigo: "06",
    nome: "TRF 4ª Região",
    sistema: "PJe",
    url: "https://pje2g.trf4.jus.br/pje/",
    tipo: "FEDERAL",
  },
  "07": {
    codigo: "07",
    nome: "TRF 5ª Região",
    sistema: "PJe",
    url: "https://pje2g.trf5.jus.br/pje/",
    tipo: "FEDERAL",
  },

  // Justiça Estadual São Paulo
  "8.26": {
    codigo: "8.26",
    nome: "TJSP - Tribunal de Justiça de São Paulo",
    sistema: "e-SAJ",
    url: "https://esaj.tjsp.jus.br/",
    tipo: "ESTADUAL",
  },

  // Justiça do Trabalho
  "5.01": {
    codigo: "5.01",
    nome: "TRT 1ª Região (RJ)",
    sistema: "PJe",
    url: "https://pje.trt1.jus.br/",
    tipo: "TRABALHISTA",
  },
  "5.02": {
    codigo: "5.02",
    nome: "TRT 2ª Região (SP)",
    sistema: "PJe",
    url: "https://pje.trt2.jus.br/",
    tipo: "TRABALHISTA",
  },

  // Justiça Eleitoral
  "6.00": {
    codigo: "6.00",
    nome: "TSE - Tribunal Superior Eleitoral",
    sistema: "PJe",
    url: "https://pje.tse.jus.br/",
    tipo: "ELEITORAL",
  },
};

export function identifyTribunal(numeroProcesso: string): TribunalInfo | null {
  // Remove espaços e caracteres especiais
  const numeroLimpo = numeroProcesso.replace(/[^\d]/g, "");

  // Formato padrão: NNNNNNN-DD.AAAA.J.TR.OOOO
  // Onde:
  // N = número sequencial
  // D = dígito verificador
  // A = ano
  // J = segmento do poder judiciário
  // T = tribunal
  // R = região
  // O = origem

  if (numeroLimpo.length !== 20) {
    return null;
  }

  // Extrai o código do tribunal (posições 13-14)
  const codigoTribunal = numeroLimpo.substring(12, 14);
  const segmento = numeroLimpo.substring(11, 12);
  const regiao = numeroLimpo.substring(14, 15);

  // Constrói a chave baseada no segmento e tribunal
  let chave = "";

  switch (segmento) {
    case "1": // Supremo Tribunal Federal
      chave = "1.00";
      break;
    case "2": // Superior Tribunal de Justiça
      chave = "2.00";
      break;
    case "3": // Justiça Federal
      chave = `0${regiao}`;
      break;
    case "4": // Justiça Militar da União
      chave = "4.00";
      break;
    case "5": // Justiça do Trabalho
      chave = `5.${codigoTribunal}`;
      break;
    case "6": // Justiça Eleitoral
      chave = "6.00";
      break;
    case "7": // Justiça Militar Estadual
      chave = `7.${codigoTribunal}`;
      break;
    case "8": // Justiça Estadual
      chave = `8.${codigoTribunal}`;
      break;
    default:
      return null;
  }

  return tribunaisData[chave] || null;
}

export function generateTribunalLink(
  numeroProcesso: string,
  tribunal: TribunalInfo,
): string {
  const numeroLimpo = numeroProcesso.replace(/[^\d]/g, "");
  const numeroFormatado = formatProcessNumber(numeroLimpo);

  switch (tribunal.sistema) {
    case "PJe":
      return `${tribunal.url}ConsultaPublica/listView.seam?ca=${numeroFormatado}`;
    case "e-SAJ":
      return `${tribunal.url}cpopg/search.do?conversationId=&dadosConsulta.valorConsulta=${numeroFormatado}`;
    case "EPROC":
      return `${tribunal.url}eproc/externo_controlador.php?acao=processo_consulta_publica&num_processo=${numeroFormatado}`;
    default:
      return tribunal.url;
  }
}

export function formatProcessNumber(numero: string): string {
  const numeroLimpo = numero.replace(/[^\d]/g, "");

  if (numeroLimpo.length !== 20) {
    return numero;
  }

  // Formato: NNNNNNN-DD.AAAA.J.TR.OOOO
  return `${numeroLimpo.substring(0, 7)}-${numeroLimpo.substring(7, 9)}.${numeroLimpo.substring(9, 13)}.${numeroLimpo.substring(13, 14)}.${numeroLimpo.substring(14, 16)}.${numeroLimpo.substring(16, 20)}`;
}

export function extractProcessInfo(numeroProcesso: string) {
  const numeroLimpo = numeroProcesso.replace(/[^\d]/g, "");

  if (numeroLimpo.length !== 20) {
    return null;
  }

  return {
    sequencial: numeroLimpo.substring(0, 7),
    digitoVerificador: numeroLimpo.substring(7, 9),
    ano: numeroLimpo.substring(9, 13),
    segmento: numeroLimpo.substring(13, 14),
    tribunal: numeroLimpo.substring(14, 16),
    origem: numeroLimpo.substring(16, 20),
    numeroCompleto: formatProcessNumber(numeroLimpo),
  };
}

export function validateProcessNumber(numero: string): boolean {
  const numeroLimpo = numero.replace(/[^\d]/g, "");

  if (numeroLimpo.length !== 20) {
    return false;
  }

  // Validação do dígito verificador usando módulo 97
  const sequencia = numeroLimpo.substring(0, 7) + numeroLimpo.substring(9, 20);
  const resto = parseInt(sequencia) % 97;
  const digitoCalculado = 98 - resto;
  const digitoInformado = parseInt(numeroLimpo.substring(7, 9));

  return digitoCalculado === digitoInformado;
}

export function getUrgencyLevel(
  publicacao: any,
): "BAIXA" | "MEDIA" | "ALTA" | "CRITICA" {
  const texto = publicacao.conteudo?.toLowerCase() || "";
  const prazo = publicacao.prazo || null;

  // Palavras-chave que indicam urgência
  const palavrasAlta = [
    "urgente",
    "imediato",
    "liminar",
    "tutela antecipada",
    "mandado de segurança",
  ];
  const palavrasCritica = [
    "habeas corpus",
    "prisão",
    "bloqueio",
    "penhora",
    "arresto",
    "sequestro",
  ];

  // Verifica urgência crítica
  if (palavrasCritica.some((palavra) => texto.includes(palavra))) {
    return "CRITICA";
  }

  // Verifica prazo
  if (prazo) {
    const hoje = new Date();
    const dataPrazo = new Date(prazo);
    const diasRestantes = Math.ceil(
      (dataPrazo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diasRestantes <= 1) return "CRITICA";
    if (diasRestantes <= 3) return "ALTA";
    if (diasRestantes <= 7) return "MEDIA";
  }

  // Verifica palavras-chave de alta urgência
  if (palavrasAlta.some((palavra) => texto.includes(palavra))) {
    return "ALTA";
  }

  return "BAIXA";
}

export function generateAISummary(publicacao: any): string {
  // Simulação de resumo por IA
  const tipo = publicacao.tipo || "Publicação";
  const tribunal = publicacao.tribunal || "Tribunal";

  return `📋 **Resumo Automático**
  
**Tipo:** ${tipo}
**Tribunal:** ${tribunal}
**Urgência:** ${getUrgencyLevel(publicacao)}

**Resumo Executivo:**
Esta publicação refere-se a ${publicacao.assunto || "processo judicial"} e requer atenção ${getUrgencyLevel(publicacao) === "CRITICA" ? "imediata" : "dentro do prazo estabelecido"}.

**Ações Recomendadas:**
- Analisar o conteúdo completo
- Verificar prazos processuais
- Coordenar com a equipe responsável
${publicacao.numeroProcesso ? "- Acessar o processo no sistema do tribunal" : ""}

**Próximos Passos:**
1. Revisar documentação
2. Preparar resposta se necessário
3. Agendar tarefas relacionadas`;
}

export function detectProcessNumbers(texto: string): string[] {
  const regex = /\d{7}-?\d{2}\.?\d{4}\.?\d{1}\.?\d{2}\.?\d{4}/g;
  const matches = texto.match(regex) || [];

  return matches
    .map((match) => match.replace(/[^\d]/g, ""))
    .filter((numero) => validateProcessNumber(numero))
    .map((numero) => formatProcessNumber(numero));
}

export function generateWhatsAppMessage(publicacao: any): string {
  return `🏛️ *Nova Publicação - ${publicacao.tribunal}*

📄 *Tipo:* ${publicacao.tipo}
📅 *Data:* ${new Date(publicacao.data).toLocaleDateString("pt-BR")}
${publicacao.numeroProcesso ? `⚖️ *Processo:* ${publicacao.numeroProcesso}` : ""}
${publicacao.prazo ? `⏰ *Prazo:* ${new Date(publicacao.prazo).toLocaleDateString("pt-BR")}` : ""}

📋 *Resumo:*
${publicacao.resumo || "Clique no link para ver o conteúdo completo."}

🔗 Acesse o portal do cliente para mais detalhes.

---
*Lawdesk CRM - Gestão Jurídica Inteligente*`;
}
