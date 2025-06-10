/**
 * CRM Jurídico - Serviços do Domínio
 *
 * Serviços específicos para o domínio CRM Jurídico,
 * incluindo gestão de clientes, processos, contratos e tarefas.
 */

import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/config/api";
import type { PaginatedResponse, PaginationParams } from "@/core/api/types";
import type {
  ClienteJuridico,
  ProcessoJuridico,
  ContratoJuridico,
  TarefaJuridica,
  CRMJuridicoFilters,
  CRMJuridicoMetrics,
  CreateClienteRequest,
  CreateProcessoRequest,
  CreateContratoRequest,
  CreateTarefaRequest,
} from "../types";

/**
 * Serviço para gestão de clientes jurídicos
 */
export class ClienteJuridicoService {
  private basePath = `${API_ENDPOINTS.CRM.BASE}/juridico/clientes`;

  async getClientes(
    filters: CRMJuridicoFilters = {},
    params: PaginationParams = {},
  ): Promise<PaginatedResponse<ClienteJuridico>> {
    return apiClient.get(this.basePath, {
      params: { ...filters, ...params },
    });
  }

  async getCliente(id: string): Promise<ClienteJuridico> {
    return apiClient.get(`${this.basePath}/${id}`);
  }

  async createCliente(data: CreateClienteRequest): Promise<ClienteJuridico> {
    return apiClient.post(this.basePath, data);
  }

  async updateCliente(
    id: string,
    data: Partial<CreateClienteRequest>,
  ): Promise<ClienteJuridico> {
    return apiClient.put(`${this.basePath}/${id}`, data);
  }

  async deleteCliente(id: string): Promise<void> {
    return apiClient.delete(`${this.basePath}/${id}`);
  }

  async getClienteProcessos(id: string): Promise<ProcessoJuridico[]> {
    return apiClient.get(`${this.basePath}/${id}/processos`);
  }

  async getClienteContratos(id: string): Promise<ContratoJuridico[]> {
    return apiClient.get(`${this.basePath}/${id}/contratos`);
  }

  async getClienteTarefas(id: string): Promise<TarefaJuridica[]> {
    return apiClient.get(`${this.basePath}/${id}/tarefas`);
  }

  async searchClientes(query: string): Promise<ClienteJuridico[]> {
    return apiClient.get(`${this.basePath}/search`, {
      params: { q: query },
    });
  }
}

/**
 * Serviço para gestão de processos jurídicos
 */
export class ProcessoJuridicoService {
  private basePath = `${API_ENDPOINTS.CRM.BASE}/juridico/processos`;

  async getProcessos(
    filters: CRMJuridicoFilters = {},
    params: PaginationParams = {},
  ): Promise<PaginatedResponse<ProcessoJuridico>> {
    return apiClient.get(this.basePath, {
      params: { ...filters, ...params },
    });
  }

  async getProcesso(id: string): Promise<ProcessoJuridico> {
    return apiClient.get(`${this.basePath}/${id}`);
  }

  async createProcesso(data: CreateProcessoRequest): Promise<ProcessoJuridico> {
    return apiClient.post(this.basePath, data);
  }

  async updateProcesso(
    id: string,
    data: Partial<CreateProcessoRequest>,
  ): Promise<ProcessoJuridico> {
    return apiClient.put(`${this.basePath}/${id}`, data);
  }

  async deleteProcesso(id: string): Promise<void> {
    return apiClient.delete(`${this.basePath}/${id}`);
  }

  async getProcessoAndamentos(id: string): Promise<any[]> {
    return apiClient.get(`${this.basePath}/${id}/andamentos`);
  }

  async addAndamento(id: string, andamento: any): Promise<any> {
    return apiClient.post(`${this.basePath}/${id}/andamentos`, andamento);
  }

  async getProcessoDocumentos(id: string): Promise<any[]> {
    return apiClient.get(`${this.basePath}/${id}/documentos`);
  }

  async uploadDocumento(id: string, file: File): Promise<any> {
    return apiClient.upload(`${this.basePath}/${id}/documentos`, file);
  }

  async getPrazosVencendo(): Promise<ProcessoJuridico[]> {
    return apiClient.get(`${this.basePath}/prazos-vencendo`);
  }
}

/**
 * Serviço para gestão de contratos jurídicos
 */
export class ContratoJuridicoService {
  private basePath = `${API_ENDPOINTS.CRM.BASE}/juridico/contratos`;

  async getContratos(
    filters: CRMJuridicoFilters = {},
    params: PaginationParams = {},
  ): Promise<PaginatedResponse<ContratoJuridico>> {
    return apiClient.get(this.basePath, {
      params: { ...filters, ...params },
    });
  }

  async getContrato(id: string): Promise<ContratoJuridico> {
    return apiClient.get(`${this.basePath}/${id}`);
  }

  async createContrato(data: CreateContratoRequest): Promise<ContratoJuridico> {
    return apiClient.post(this.basePath, data);
  }

  async updateContrato(
    id: string,
    data: Partial<CreateContratoRequest>,
  ): Promise<ContratoJuridico> {
    return apiClient.put(`${this.basePath}/${id}`, data);
  }

  async deleteContrato(id: string): Promise<void> {
    return apiClient.delete(`${this.basePath}/${id}`);
  }

  async renewContrato(id: string, data: any): Promise<ContratoJuridico> {
    return apiClient.post(`${this.basePath}/${id}/renovar`, data);
  }

  async getContratosVencendo(): Promise<ContratoJuridico[]> {
    return apiClient.get(`${this.basePath}/vencendo`);
  }

  async generateContrato(id: string): Promise<Blob> {
    return apiClient.download(`${this.basePath}/${id}/gerar-pdf`);
  }
}

/**
 * Serviço para gestão de tarefas jurídicas
 */
export class TarefaJuridicoService {
  private basePath = `${API_ENDPOINTS.CRM.BASE}/juridico/tarefas`;

  async getTarefas(
    filters: CRMJuridicoFilters = {},
    params: PaginationParams = {},
  ): Promise<PaginatedResponse<TarefaJuridica>> {
    return apiClient.get(this.basePath, {
      params: { ...filters, ...params },
    });
  }

  async getTarefa(id: string): Promise<TarefaJuridica> {
    return apiClient.get(`${this.basePath}/${id}`);
  }

  async createTarefa(data: CreateTarefaRequest): Promise<TarefaJuridica> {
    return apiClient.post(this.basePath, data);
  }

  async updateTarefa(
    id: string,
    data: Partial<CreateTarefaRequest>,
  ): Promise<TarefaJuridica> {
    return apiClient.put(`${this.basePath}/${id}`, data);
  }

  async deleteTarefa(id: string): Promise<void> {
    return apiClient.delete(`${this.basePath}/${id}`);
  }

  async completeTarefa(id: string): Promise<TarefaJuridica> {
    return apiClient.patch(`${this.basePath}/${id}/completar`);
  }

  async getTarefasVencendo(): Promise<TarefaJuridica[]> {
    return apiClient.get(`${this.basePath}/vencendo`);
  }

  async getTarefasPorResponsavel(
    responsavel: string,
  ): Promise<TarefaJuridica[]> {
    return apiClient.get(`${this.basePath}/responsavel/${responsavel}`);
  }
}

/**
 * Serviço para métricas e analytics do CRM Jurídico
 */
export class CRMJuridicoAnalyticsService {
  private basePath = `${API_ENDPOINTS.CRM.BASE}/juridico/analytics`;

  async getMetrics(): Promise<CRMJuridicoMetrics> {
    return apiClient.get(`${this.basePath}/metrics`);
  }

  async getClientesPorArea(): Promise<Record<string, number>> {
    return apiClient.get(`${this.basePath}/clientes-por-area`);
  }

  async getProcessosPorStatus(): Promise<Record<string, number>> {
    return apiClient.get(`${this.basePath}/processos-por-status`);
  }

  async getReceita(periodo: string): Promise<any> {
    return apiClient.get(`${this.basePath}/receita`, {
      params: { periodo },
    });
  }

  async getPerformance(responsavel?: string): Promise<any> {
    return apiClient.get(`${this.basePath}/performance`, {
      params: { responsavel },
    });
  }

  async generateRelatorio(tipo: string, filtros: any): Promise<Blob> {
    return apiClient.download(`${this.basePath}/relatorio/${tipo}`, {
      params: filtros,
    });
  }
}

/**
 * Serviço principal do CRM Jurídico
 * Agregador de todos os serviços específicos
 */
export class CRMJuridicoService {
  public clientes: ClienteJuridicoService;
  public processos: ProcessoJuridicoService;
  public contratos: ContratoJuridicoService;
  public tarefas: TarefaJuridicoService;
  public analytics: CRMJuridicoAnalyticsService;

  constructor() {
    this.clientes = new ClienteJuridicoService();
    this.processos = new ProcessoJuridicoService();
    this.contratos = new ContratoJuridicoService();
    this.tarefas = new TarefaJuridicoService();
    this.analytics = new CRMJuridicoAnalyticsService();
  }

  // Métodos de conveniência
  async getClientes(filters?: CRMJuridicoFilters): Promise<ClienteJuridico[]> {
    const response = await this.clientes.getClientes(filters);
    return response.data;
  }

  async getProcessos(
    filters?: CRMJuridicoFilters,
  ): Promise<ProcessoJuridico[]> {
    const response = await this.processos.getProcessos(filters);
    return response.data;
  }

  async getContratos(
    filters?: CRMJuridicoFilters,
  ): Promise<ContratoJuridico[]> {
    const response = await this.contratos.getContratos(filters);
    return response.data;
  }

  async getTarefas(filters?: CRMJuridicoFilters): Promise<TarefaJuridica[]> {
    const response = await this.tarefas.getTarefas(filters);
    return response.data;
  }

  async getMetrics(): Promise<CRMJuridicoMetrics> {
    return this.analytics.getMetrics();
  }

  // Métodos de criação
  async createCliente(data: CreateClienteRequest): Promise<ClienteJuridico> {
    return this.clientes.createCliente(data);
  }

  async createProcesso(data: CreateProcessoRequest): Promise<ProcessoJuridico> {
    return this.processos.createProcesso(data);
  }

  async createContrato(data: CreateContratoRequest): Promise<ContratoJuridico> {
    return this.contratos.createContrato(data);
  }

  async createTarefa(data: CreateTarefaRequest): Promise<TarefaJuridica> {
    return this.tarefas.createTarefa(data);
  }

  // Métodos de atualização
  async updateCliente(
    id: string,
    data: Partial<CreateClienteRequest>,
  ): Promise<ClienteJuridico> {
    return this.clientes.updateCliente(id, data);
  }

  async updateProcesso(
    id: string,
    data: Partial<CreateProcessoRequest>,
  ): Promise<ProcessoJuridico> {
    return this.processos.updateProcesso(id, data);
  }

  async updateContrato(
    id: string,
    data: Partial<CreateContratoRequest>,
  ): Promise<ContratoJuridico> {
    return this.contratos.updateContrato(id, data);
  }

  async updateTarefa(
    id: string,
    data: Partial<CreateTarefaRequest>,
  ): Promise<TarefaJuridica> {
    return this.tarefas.updateTarefa(id, data);
  }

  // Métodos de exclusão
  async deleteCliente(id: string): Promise<void> {
    return this.clientes.deleteCliente(id);
  }

  async deleteProcesso(id: string): Promise<void> {
    return this.processos.deleteProcesso(id);
  }

  async deleteContrato(id: string): Promise<void> {
    return this.contratos.deleteContrato(id);
  }

  async deleteTarefa(id: string): Promise<void> {
    return this.tarefas.deleteTarefa(id);
  }
}

// Instância singleton do serviço
export const crmJuridicoService = new CRMJuridicoService();

// Hook para usar o serviço
export const useCRMJuridicoService = () => {
  return crmJuridicoService;
};

// Export dos serviços individuais
export {
  ClienteJuridicoService,
  ProcessoJuridicoService,
  ContratoJuridicoService,
  TarefaJuridicoService,
  CRMJuridicoAnalyticsService,
};

export default CRMJuridicoService;
