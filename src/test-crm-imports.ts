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

export default "CRM imports test completed!";
