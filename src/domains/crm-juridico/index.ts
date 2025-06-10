/**
 * CRM Jurídico - Domínio Funcional
 *
 * Módulo independente para gestão de relacionamento com clientes jurídicos,
 * incluindo clientes, processos, contatos, tarefas e contratos.
 */

// Interfaces públicas do domínio
export * from "./interfaces";

// Componentes principais
export * from "./components";

// Hooks do domínio
export * from "./hooks";

// Serviços
export * from "./services";

// Configurações
export * from "./config";

// Utilitários
export * from "./utils";

// Provider do domínio
export { CRMJuridicoProvider, useCRMJuridico } from "./provider";

// Rotas do domínio
export { crmJuridicoRoutes } from "./routes";

// Exportações para integração com outros domínios
export type {
  CRMJuridicoContextValue,
  ClienteJuridico,
  ProcessoJuridico,
  ContratoJuridico,
} from "./types";
