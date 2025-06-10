/**
 * Test CRM Domain Imports
 *
 * This file tests that all CRM domain exports work correctly
 */

// Test main domain exports
import {
  CRMJuridicoRoutes,
  CRMJuridicoProvider,
  useCRMJuridicoStore,
  useCRMStore,
  KanbanBoard,
} from "./domains/crm-juridico";

// Test service exports
import {
  CRMJuridicoAnalyticsService,
  CRMJuridicoService,
  ClienteJuridicoService,
  ProcessoJuridicoService,
  ContratoJuridicoService,
  TarefaJuridicoService,
  crmJuridicoService,
  useCRMJuridicoService,
} from "./domains/crm-juridico/services";

// Test individual component imports
import CRMRoutes from "./domains/crm-juridico/routes";
import CRMProvider from "./domains/crm-juridico/provider";
import CRMStore from "./domains/crm-juridico/store";

console.log("✅ All CRM domain imports successful!");
console.log("- Routes:", typeof CRMJuridicoRoutes);
console.log("- Provider:", typeof CRMJuridicoProvider);
console.log("- Store:", typeof useCRMJuridicoStore);
console.log("- Store (direct):", typeof useCRMStore);
console.log("- KanbanBoard:", typeof KanbanBoard);
console.log("- Routes (default):", typeof CRMRoutes);
console.log("- Provider (default):", typeof CRMProvider);
console.log("- Store (default):", typeof CRMStore);
console.log("- Analytics Service:", typeof CRMJuridicoAnalyticsService);
console.log("- Main Service:", typeof CRMJuridicoService);
console.log("- Cliente Service:", typeof ClienteJuridicoService);
console.log("- Processo Service:", typeof ProcessoJuridicoService);
console.log("- Contrato Service:", typeof ContratoJuridicoService);
console.log("- Tarefa Service:", typeof TarefaJuridicoService);
console.log("- Service Instance:", typeof crmJuridicoService);
console.log("- Service Hook:", typeof useCRMJuridicoService);

export default "CRM imports test completed!";
