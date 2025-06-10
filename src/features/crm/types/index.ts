/**
 * CRM Types
 *
 * TypeScript type definitions for the CRM domain including
 * clients, processes, contacts, tasks, and related entities.
 */

import type { BaseEntity } from "@/core/api/types";

// Client types
export interface Client extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  document: string; // CPF/CNPJ
  documentType: "cpf" | "cnpj";
  type: "individual" | "company";
  status: ClientStatus;
  address?: Address;
  contacts?: Contact[];
  processes?: Process[];
  notes?: string;
  tags?: string[];
  assignedTo?: string;
  lastContactAt?: string;
}

export type ClientStatus = "active" | "inactive" | "prospect" | "archived";

export interface CreateClientRequest {
  name: string;
  email: string;
  phone?: string;
  document: string;
  documentType: "cpf" | "cnpj";
  type: "individual" | "company";
  address?: Partial<Address>;
  notes?: string;
  tags?: string[];
  assignedTo?: string;
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {
  status?: ClientStatus;
}

// Process types
export interface Process extends BaseEntity {
  number: string;
  title: string;
  description?: string;
  status: ProcessStatus;
  priority: ProcessPriority;
  type: ProcessType;
  clientId: string;
  client?: Client;
  assignedTo?: string;
  court?: string;
  opposingParty?: string;
  value?: number;
  startDate: string;
  dueDate?: string;
  closedAt?: string;
  documents?: Document[];
  tasks?: Task[];
  notes?: ProcessNote[];
  tags?: string[];
}

export type ProcessStatus =
  | "draft"
  | "active"
  | "suspended"
  | "closed"
  | "archived";

export type ProcessPriority = "low" | "medium" | "high" | "urgent";

export type ProcessType =
  | "civil"
  | "criminal"
  | "labor"
  | "tax"
  | "family"
  | "commercial"
  | "administrative"
  | "other";

export interface CreateProcessRequest {
  number: string;
  title: string;
  description?: string;
  type: ProcessType;
  clientId: string;
  priority?: ProcessPriority;
  assignedTo?: string;
  court?: string;
  opposingParty?: string;
  value?: number;
  startDate: string;
  dueDate?: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateProcessRequest extends Partial<CreateProcessRequest> {
  status?: ProcessStatus;
}

// Contact types
export interface Contact extends BaseEntity {
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  type: ContactType;
  clientId: string;
  client?: Client;
  isPrimary?: boolean;
  notes?: string;
}

export type ContactType =
  | "client"
  | "lawyer"
  | "secretary"
  | "representative"
  | "other";

export interface CreateContactRequest {
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  type: ContactType;
  clientId: string;
  isPrimary?: boolean;
  notes?: string;
}

export interface UpdateContactRequest extends Partial<CreateContactRequest> {}

// Task types
export interface Task extends BaseEntity {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  assignedTo?: string;
  clientId?: string;
  processId?: string;
  dueDate?: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  attachments?: Attachment[];
}

export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskType =
  | "call"
  | "meeting"
  | "document"
  | "research"
  | "filing"
  | "follow_up"
  | "other";

export interface CreateTaskRequest {
  title: string;
  description?: string;
  type: TaskType;
  priority?: TaskPriority;
  assignedTo?: string;
  clientId?: string;
  processId?: string;
  dueDate?: string;
  estimatedHours?: number;
  tags?: string[];
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  status?: TaskStatus;
  completedAt?: string;
  actualHours?: number;
}

// Address types
export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Document types
export interface Document extends BaseEntity {
  name: string;
  type: string;
  size: number;
  url: string;
  processId?: string;
  clientId?: string;
  uploadedBy: string;
}

// Process note types
export interface ProcessNote extends BaseEntity {
  content: string;
  processId: string;
  authorId: string;
  isPrivate?: boolean;
}

// Attachment types
export interface Attachment extends BaseEntity {
  name: string;
  type: string;
  size: number;
  url: string;
  taskId: string;
  uploadedBy: string;
}

// Filter types
export interface ClientFilters {
  search?: string;
  status?: ClientStatus[];
  type?: ("individual" | "company")[];
  assignedTo?: string[];
  tags?: string[];
  createdAfter?: string;
  createdBefore?: string;
}

export interface ProcessFilters {
  search?: string;
  status?: ProcessStatus[];
  priority?: ProcessPriority[];
  type?: ProcessType[];
  clientId?: string;
  assignedTo?: string[];
  court?: string;
  tags?: string[];
  startDateAfter?: string;
  startDateBefore?: string;
  dueDateAfter?: string;
  dueDateBefore?: string;
}

export interface TaskFilters {
  search?: string;
  status?: TaskStatus[];
  priority?: TaskPriority[];
  type?: TaskType[];
  assignedTo?: string[];
  clientId?: string;
  processId?: string;
  tags?: string[];
  dueDateAfter?: string;
  dueDateBefore?: string;
}

// Dashboard types
export interface CRMMetrics {
  clients: {
    total: number;
    active: number;
    new: number;
    byType: Record<string, number>;
  };
  processes: {
    total: number;
    active: number;
    closed: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
  };
  tasks: {
    total: number;
    pending: number;
    completed: number;
    overdue: number;
    byStatus: Record<string, number>;
  };
  revenue: {
    total: number;
    month: number;
    quarter: number;
    year: number;
  };
}

// Activity types
export interface Activity extends BaseEntity {
  type: ActivityType;
  title: string;
  description?: string;
  entityType: "client" | "process" | "task" | "contact";
  entityId: string;
  userId: string;
  metadata?: Record<string, any>;
}

export type ActivityType =
  | "created"
  | "updated"
  | "deleted"
  | "status_changed"
  | "assigned"
  | "completed"
  | "commented"
  | "document_uploaded"
  | "email_sent"
  | "meeting_scheduled";

// Export all types
export type {
  Client,
  ClientStatus,
  CreateClientRequest,
  UpdateClientRequest,
  Process,
  ProcessStatus,
  ProcessPriority,
  ProcessType,
  CreateProcessRequest,
  UpdateProcessRequest,
  Contact,
  ContactType,
  CreateContactRequest,
  UpdateContactRequest,
  Task,
  TaskStatus,
  TaskPriority,
  TaskType,
  CreateTaskRequest,
  UpdateTaskRequest,
  Address,
  Document,
  ProcessNote,
  Attachment,
  ClientFilters,
  ProcessFilters,
  TaskFilters,
  CRMMetrics,
  Activity,
  ActivityType,
};
