/**
 * Agenda Jurídica - Domínio Funcional
 *
 * Módulo independente para gestão de calendário jurídico,
 * incluindo audiências, prazos, compromissos e publicações.
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
export { AgendaJuridicaProvider, useAgendaJuridica } from "./provider";

// Rotas do domínio
export { agendaJuridicaRoutes } from "./routes";

// Exportações para integração com outros domínios
export type {
  AgendaJuridicaContextValue,
  EventoJuridico,
  Audiencia,
  PrazoJuridico,
  Publicacao,
} from "./types";
