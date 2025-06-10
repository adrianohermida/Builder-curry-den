/**
 * CRM Jurídico - Domínio Funcional
 *
 * Módulo independente para gestão de relacionamento com clientes jurídicos
 */

// Rotas principais do domínio
export { default as CRMJuridicoRoutes } from "./routes";

// Provider do domínio
export { CRMJuridicoProvider } from "./provider";

// Store do domínio
export { useCRMJuridicoStore } from "./store";

// Tipos principais
export type * from "./types";

// Componentes principais
export { default as KanbanBoard } from "./components/KanbanBoard";
