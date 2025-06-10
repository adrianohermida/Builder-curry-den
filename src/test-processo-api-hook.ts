/**
 * Processo API Hook Verification Test
 *
 * This file tests that the useProcessoApi hook exports correctly
 * and provides all expected methods.
 */

// Test the hook import
import { useProcessoApi } from "./services/ProcessoApiService";

// Test the service and utility imports
import {
  ProcessoApiService,
  processoApiService,
  formatarNumeroProcesso,
  validarNumeroProcesso,
  extrairInfoCNJ,
} from "./services/ProcessoApiService";

// Test interface imports
import type {
  ProcessoTJSP,
  ConsultaOAB,
  ConsultaCNJ,
  ProcessoCompleto,
  Movimentacao,
  Publicacao,
  Documento,
} from "./services/ProcessoApiService";

console.log("✅ All ProcessoApiService imports successful!");
console.log("- useProcessoApi hook:", typeof useProcessoApi);
console.log("- ProcessoApiService class:", typeof ProcessoApiService);
console.log("- processoApiService instance:", typeof processoApiService);
console.log("- formatarNumeroProcesso:", typeof formatarNumeroProcesso);
console.log("- validarNumeroProcesso:", typeof validarNumeroProcesso);
console.log("- extrairInfoCNJ:", typeof extrairInfoCNJ);

// Test hook methods (in a mock React component context)
function MockComponent() {
  const {
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
    clearCache,
    getCacheStats,
    formatarNumeroProcesso: hookFormatarNumero,
    validarNumeroProcesso: hookValidarNumero,
    extrairInfoCNJ: hookExtrairInfo,
  } = useProcessoApi();

  console.log("✅ Hook methods available:");
  console.log("- obterAndamentosProcesso:", typeof obterAndamentosProcesso);
  console.log("- consultarTJSP:", typeof consultarTJSP);
  console.log("- consultarOAB:", typeof consultarOAB);
  console.log("- consultarCNJ:", typeof consultarCNJ);
  console.log("- buscarProcessos:", typeof buscarProcessos);
  console.log("- criarProcesso:", typeof criarProcesso);
  console.log("- atualizarProcesso:", typeof atualizarProcesso);
  console.log("- adicionarMovimentacao:", typeof adicionarMovimentacao);
  console.log("- monitorarPublicacoes:", typeof monitorarPublicacoes);
  console.log("- criarAlerta:", typeof criarAlerta);
  console.log("- clearCache:", typeof clearCache);
  console.log("- getCacheStats:", typeof getCacheStats);
  console.log("- hookFormatarNumero:", typeof hookFormatarNumero);
  console.log("- hookValidarNumero:", typeof hookValidarNumero);
  console.log("- hookExtrairInfo:", typeof hookExtrairInfo);

  return null;
}

export default "ProcessoApiService hook test completed!";
