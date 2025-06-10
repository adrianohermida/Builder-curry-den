/**
 * CRM Services
 *
 * API service classes for CRM domain operations.
 * Handles all backend communication for clients, processes, contacts, and tasks.
 */

import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/config/api";
import type { PaginatedResponse, PaginationParams } from "@/core/api/types";
import type {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
  ClientFilters,
  Process,
  CreateProcessRequest,
  UpdateProcessRequest,
  ProcessFilters,
  Contact,
  CreateContactRequest,
  UpdateContactRequest,
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskFilters,
  CRMMetrics,
  Activity,
} from "../types";

/**
 * Client Service
 * Handles client management operations
 */
export class ClientService {
  /**
   * Get paginated list of clients
   */
  async getClients(
    params: PaginationParams & ClientFilters = {},
  ): Promise<PaginatedResponse<Client>> {
    return apiClient.get(API_ENDPOINTS.CRM.CLIENTS, { params });
  }

  /**
   * Get client by ID
   */
  async getClient(id: string): Promise<Client> {
    return apiClient.get(`${API_ENDPOINTS.CRM.CLIENTS}/${id}`);
  }

  /**
   * Create new client
   */
  async createClient(data: CreateClientRequest): Promise<Client> {
    return apiClient.post(API_ENDPOINTS.CRM.CLIENTS, data);
  }

  /**
   * Update existing client
   */
  async updateClient(id: string, data: UpdateClientRequest): Promise<Client> {
    return apiClient.put(`${API_ENDPOINTS.CRM.CLIENTS}/${id}`, data);
  }

  /**
   * Delete client
   */
  async deleteClient(id: string): Promise<void> {
    return apiClient.delete(`${API_ENDPOINTS.CRM.CLIENTS}/${id}`);
  }

  /**
   * Get client activities
   */
  async getClientActivities(id: string): Promise<Activity[]> {
    return apiClient.get(`${API_ENDPOINTS.CRM.CLIENTS}/${id}/activities`);
  }

  /**
   * Search clients
   */
  async searchClients(query: string): Promise<Client[]> {
    return apiClient.get(`${API_ENDPOINTS.CRM.CLIENTS}/search`, {
      params: { q: query },
    });
  }
}

/**
 * Process Service
 * Handles legal process management operations
 */
export class ProcessService {
  /**
   * Get paginated list of processes
   */
  async getProcesses(
    params: PaginationParams & ProcessFilters = {},
  ): Promise<PaginatedResponse<Process>> {
    return apiClient.get(API_ENDPOINTS.CRM.PROCESSES, { params });
  }

  /**
   * Get process by ID
   */
  async getProcess(id: string): Promise<Process> {
    return apiClient.get(`${API_ENDPOINTS.CRM.PROCESSES}/${id}`);
  }

  /**
   * Create new process
   */
  async createProcess(data: CreateProcessRequest): Promise<Process> {
    return apiClient.post(API_ENDPOINTS.CRM.PROCESSES, data);
  }

  /**
   * Update existing process
   */
  async updateProcess(
    id: string,
    data: UpdateProcessRequest,
  ): Promise<Process> {
    return apiClient.put(`${API_ENDPOINTS.CRM.PROCESSES}/${id}`, data);
  }

  /**
   * Delete process
   */
  async deleteProcess(id: string): Promise<void> {
    return apiClient.delete(`${API_ENDPOINTS.CRM.PROCESSES}/${id}`);
  }

  /**
   * Get processes by client ID
   */
  async getProcessesByClient(clientId: string): Promise<Process[]> {
    return apiClient.get(`${API_ENDPOINTS.CRM.CLIENTS}/${clientId}/processes`);
  }

  /**
   * Get process activities
   */
  async getProcessActivities(id: string): Promise<Activity[]> {
    return apiClient.get(`${API_ENDPOINTS.CRM.PROCESSES}/${id}/activities`);
  }
}

/**
 * Contact Service
 * Handles contact management operations
 */
export class ContactService {
  /**
   * Get contacts by client ID
   */
  async getContactsByClient(clientId: string): Promise<Contact[]> {
    return apiClient.get(`${API_ENDPOINTS.CRM.CLIENTS}/${clientId}/contacts`);
  }

  /**
   * Get contact by ID
   */
  async getContact(id: string): Promise<Contact> {
    return apiClient.get(`${API_ENDPOINTS.CRM.CONTACTS}/${id}`);
  }

  /**
   * Create new contact
   */
  async createContact(data: CreateContactRequest): Promise<Contact> {
    return apiClient.post(API_ENDPOINTS.CRM.CONTACTS, data);
  }

  /**
   * Update existing contact
   */
  async updateContact(
    id: string,
    data: UpdateContactRequest,
  ): Promise<Contact> {
    return apiClient.put(`${API_ENDPOINTS.CRM.CONTACTS}/${id}`, data);
  }

  /**
   * Delete contact
   */
  async deleteContact(id: string): Promise<void> {
    return apiClient.delete(`${API_ENDPOINTS.CRM.CONTACTS}/${id}`);
  }
}

/**
 * Task Service
 * Handles task management operations
 */
export class TaskService {
  /**
   * Get paginated list of tasks
   */
  async getTasks(
    params: PaginationParams & TaskFilters = {},
  ): Promise<PaginatedResponse<Task>> {
    return apiClient.get(API_ENDPOINTS.CRM.TASKS, { params });
  }

  /**
   * Get task by ID
   */
  async getTask(id: string): Promise<Task> {
    return apiClient.get(`${API_ENDPOINTS.CRM.TASKS}/${id}`);
  }

  /**
   * Create new task
   */
  async createTask(data: CreateTaskRequest): Promise<Task> {
    return apiClient.post(API_ENDPOINTS.CRM.TASKS, data);
  }

  /**
   * Update existing task
   */
  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    return apiClient.put(`${API_ENDPOINTS.CRM.TASKS}/${id}`, data);
  }

  /**
   * Delete task
   */
  async deleteTask(id: string): Promise<void> {
    return apiClient.delete(`${API_ENDPOINTS.CRM.TASKS}/${id}`);
  }

  /**
   * Get tasks by client ID
   */
  async getTasksByClient(clientId: string): Promise<Task[]> {
    return apiClient.get(`${API_ENDPOINTS.CRM.CLIENTS}/${clientId}/tasks`);
  }

  /**
   * Get tasks by process ID
   */
  async getTasksByProcess(processId: string): Promise<Task[]> {
    return apiClient.get(`${API_ENDPOINTS.CRM.PROCESSES}/${processId}/tasks`);
  }

  /**
   * Mark task as completed
   */
  async completeTask(id: string): Promise<Task> {
    return apiClient.patch(`${API_ENDPOINTS.CRM.TASKS}/${id}/complete`);
  }
}

/**
 * CRM Dashboard Service
 * Handles dashboard and metrics operations
 */
export class CRMDashboardService {
  /**
   * Get CRM metrics
   */
  async getMetrics(): Promise<CRMMetrics> {
    return apiClient.get(`${API_ENDPOINTS.CRM.CLIENTS}/metrics`);
  }

  /**
   * Get recent activities
   */
  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    return apiClient.get(`${API_ENDPOINTS.CRM.CLIENTS}/activities`, {
      params: { limit },
    });
  }

  /**
   * Get upcoming tasks
   */
  async getUpcomingTasks(limit: number = 10): Promise<Task[]> {
    return apiClient.get(`${API_ENDPOINTS.CRM.TASKS}/upcoming`, {
      params: { limit },
    });
  }

  /**
   * Get overdue tasks
   */
  async getOverdueTasks(): Promise<Task[]> {
    return apiClient.get(`${API_ENDPOINTS.CRM.TASKS}/overdue`);
  }
}

// Service instances
export const clientService = new ClientService();
export const processService = new ProcessService();
export const contactService = new ContactService();
export const taskService = new TaskService();
export const crmDashboardService = new CRMDashboardService();

// Export service classes for dependency injection
export {
  ClientService,
  ProcessService,
  ContactService,
  TaskService,
  CRMDashboardService,
};
