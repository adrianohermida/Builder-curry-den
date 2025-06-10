/**
 * CRM Jurídico - Tipos de Negócio
 *
 * Tipos baseados no modelo do Bitrix24 CRM adaptados para advogados.
 */

export interface Business {
  id: string;
  title: string;
  contactId: string;
  contact?: Contact;
  value: number;
  currency: "BRL" | "USD" | "EUR";
  stageId: string;
  stage?: Stage;
  assignedTo: string;
  assignedUser?: User;
  status: BusinessStatus;
  probability: number; // 0-100
  expectedCloseDate?: Date;
  closedDate?: Date;
  source: BusinessSource;
  tags: string[];

  // Campos jurídicos específicos
  legalService: LegalService;
  caseType: CaseType;
  courtLevel: CourtLevel;
  complexity: BusinessComplexity;
  retainerFee?: number;
  hourlyRate?: number;
  estimatedHours?: number;

  // Timeline e documentos
  activities: Activity[];
  documents: BusinessDocument[];
  notes: BusinessNote[];

  // Campos customizados
  customFields: Record<string, any>;

  // Datas
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastActivityAt?: Date;
}

export type BusinessStatus = "open" | "won" | "lost" | "postponed" | "on_hold";

export type BusinessSource =
  | "website"
  | "referral"
  | "cold_call"
  | "social_media"
  | "advertisement"
  | "partner"
  | "other";

export type LegalService =
  | "litigation"
  | "contracts"
  | "consulting"
  | "due_diligence"
  | "compliance"
  | "labor"
  | "tax"
  | "family"
  | "criminal"
  | "corporate"
  | "real_estate"
  | "intellectual_property";

export type CaseType =
  | "civil"
  | "criminal"
  | "labor"
  | "tax"
  | "family"
  | "corporate"
  | "administrative"
  | "constitutional"
  | "environmental"
  | "consumer";

export type CourtLevel =
  | "municipal"
  | "state"
  | "federal"
  | "superior"
  | "supreme"
  | "arbitration"
  | "administrative";

export type BusinessComplexity =
  | "simple"
  | "medium"
  | "complex"
  | "very_complex";

export interface Contact {
  id: string;
  type: "person" | "company";
  name: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;

  // Documentos
  document: string; // CPF ou CNPJ
  documentType: "cpf" | "cnpj";
  rg?: string;
  stateRegistration?: string;

  // Contato
  email: string;
  phone: string;
  mobilePhone?: string;
  website?: string;

  // Endereço
  address: ContactAddress;

  // Dados profissionais
  profession?: string;
  position?: string;
  industry?: string;

  // Relacionamentos
  businesses: Business[];
  linkedContacts: Contact[]; // Contatos relacionados

  // Social
  socialNetworks: SocialNetwork[];

  // Categorização
  tags: string[];
  category: ContactCategory;
  source: ContactSource;
  status: ContactStatus;

  // CRM fields
  assignedTo: string;
  lastContactDate?: Date;
  nextContactDate?: Date;
  priority: ContactPriority;

  // Comunicação
  communicationHistory: Communication[];
  preferences: ContactPreferences;

  // Observações
  notes: string;
  customFields: Record<string, any>;

  // Métricas
  totalBusinessValue: number;
  businessesCount: number;
  conversionRate: number;

  // Datas
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface ContactAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface SocialNetwork {
  platform: "linkedin" | "facebook" | "instagram" | "twitter" | "whatsapp";
  url: string;
  username?: string;
}

export type ContactCategory =
  | "client"
  | "prospect"
  | "lead"
  | "partner"
  | "supplier"
  | "competitor";

export type ContactSource =
  | "website"
  | "referral"
  | "event"
  | "social_media"
  | "cold_call"
  | "advertisement"
  | "import"
  | "manual";

export type ContactStatus = "active" | "inactive" | "blocked" | "deleted";

export type ContactPriority = "low" | "medium" | "high" | "urgent";

export interface Communication {
  id: string;
  type: "call" | "email" | "meeting" | "whatsapp" | "sms" | "other";
  direction: "inbound" | "outbound";
  subject?: string;
  content: string;
  duration?: number; // em minutos
  userId: string;
  contactId: string;
  businessId?: string;
  createdAt: Date;
  metadata: Record<string, any>;
}

export interface ContactPreferences {
  preferredContactMethod: "email" | "phone" | "whatsapp" | "letter";
  bestTimeToContact: string;
  timezone: string;
  language: string;
  marketingOptIn: boolean;
  newsletterOptIn: boolean;
}

export interface Pipeline {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  businessType: LegalService;
  stages: Stage[];
  color: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stage {
  id: string;
  name: string;
  description?: string;
  color: string;
  order: number;
  probability: number; // 0-100
  isWon: boolean;
  isLost: boolean;
  requiredFields: string[];
  automations: StageAutomation[];
  pipelineId: string;
  businessCount?: number;
  totalValue?: number;
}

export interface StageAutomation {
  id: string;
  trigger: "on_enter" | "on_exit" | "time_based";
  action: AutomationAction;
  conditions: AutomationCondition[];
  isActive: boolean;
}

export type AutomationAction =
  | "send_email"
  | "create_task"
  | "notify_user"
  | "update_field"
  | "move_to_stage"
  | "webhook";

export interface AutomationCondition {
  field: string;
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains";
  value: any;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  businessId?: string;
  contactId?: string;
  userId: string;
  user?: User;
  priority: ActivityPriority;
  status: ActivityStatus;
  dueDate?: Date;
  completedAt?: Date;
  duration?: number;
  isCompleted: boolean;

  // Comunicação
  communicationData?: Communication;

  // Tarefa
  taskData?: {
    assignedTo: string[];
    checklist: TaskChecklistItem[];
    attachments: ActivityAttachment[];
  };

  // Reunião
  meetingData?: {
    location?: string;
    meetingUrl?: string;
    attendees: string[];
    agenda?: string;
  };

  // Metadados
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export type ActivityType =
  | "call"
  | "email"
  | "meeting"
  | "task"
  | "note"
  | "document"
  | "proposal"
  | "contract"
  | "payment"
  | "deadline"
  | "court_hearing"
  | "legal_research";

export type ActivityPriority = "low" | "medium" | "high" | "urgent";

export type ActivityStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface TaskChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
  completedAt?: Date;
  completedBy?: string;
}

export interface ActivityAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface BusinessDocument {
  id: string;
  name: string;
  type: DocumentType;
  url: string;
  size: number;
  mimeType: string;
  businessId: string;
  uploadedBy: string;
  uploadedAt: Date;
  version: number;
  isActive: boolean;
  tags: string[];

  // Assinatura digital
  signatureStatus?: "pending" | "signed" | "expired" | "cancelled";
  signatureUrl?: string;
  signatories?: DocumentSignatory[];

  // Metadados jurídicos
  legalMetadata?: {
    confidentiality: "public" | "confidential" | "restricted";
    retentionPeriod?: number; // em anos
    legalBasis?: string;
  };
}

export type DocumentType =
  | "contract"
  | "proposal"
  | "power_of_attorney"
  | "court_filing"
  | "evidence"
  | "legal_opinion"
  | "invoice"
  | "receipt"
  | "identity"
  | "certificate"
  | "other";

export interface DocumentSignatory {
  id: string;
  name: string;
  email: string;
  role: string;
  signedAt?: Date;
  ipAddress?: string;
  signatureMethod: "digital" | "electronic" | "handwritten";
}

export interface BusinessNote {
  id: string;
  content: string;
  businessId: string;
  contactId?: string;
  userId: string;
  user?: User;
  isPrivate: boolean;
  isPinned: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  department: string;
  position: string;
  isActive: boolean;
}

export type UserRole =
  | "admin"
  | "partner"
  | "senior_lawyer"
  | "lawyer"
  | "junior_lawyer"
  | "paralegal"
  | "secretary"
  | "intern";

// Filtros e métricas
export interface CRMFilters {
  stage: string[];
  assignedTo: string[];
  dateRange: {
    start: Date;
    end: Date;
  } | null;
  value: {
    min: number;
    max: number | null;
  };
  tags: string[];
  status: "all" | BusinessStatus;
  legalService: LegalService[];
  caseType: CaseType[];
  probability: {
    min: number;
    max: number;
  };
}

export interface CRMMetrics {
  totalBusinesses: number;
  totalContacts: number;
  totalValue: number;
  conversionRate: number;
  avgDealSize: number;
  dealsWonThisMonth: number;
  dealsLostThisMonth: number;
  activitiesCompleted: number;

  // Por etapa
  businessesByStage: Record<string, number>;

  // Por status
  businessesByStatus: Record<BusinessStatus, number>;

  // Revenue
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    deals: number;
  }>;

  // Performance
  avgTimeToClose: number; // em dias
  topPerformers: Array<{
    userId: string;
    userName: string;
    deals: number;
    revenue: number;
  }>;

  // Serviços mais vendidos
  topLegalServices: Array<{
    service: LegalService;
    count: number;
    revenue: number;
  }>;
}

// Requests para API
export interface CreateBusinessRequest {
  title: string;
  contactId: string;
  value: number;
  stageId: string;
  assignedTo: string;
  legalService: LegalService;
  caseType: CaseType;
  courtLevel?: CourtLevel;
  complexity: BusinessComplexity;
  expectedCloseDate?: Date;
  retainerFee?: number;
  hourlyRate?: number;
  estimatedHours?: number;
  tags?: string[];
  customFields?: Record<string, any>;
}

export interface CreateContactRequest {
  type: "person" | "company";
  name: string;
  document: string;
  documentType: "cpf" | "cnpj";
  email: string;
  phone: string;
  address: ContactAddress;
  assignedTo: string;
  category: ContactCategory;
  source: ContactSource;
  tags?: string[];
  customFields?: Record<string, any>;
}

export interface UpdateBusinessRequest extends Partial<CreateBusinessRequest> {
  status?: BusinessStatus;
  probability?: number;
  closedDate?: Date;
}

export interface UpdateContactRequest extends Partial<CreateContactRequest> {
  status?: ContactStatus;
  priority?: ContactPriority;
  lastContactDate?: Date;
  nextContactDate?: Date;
}

// Exports
export type {
  Business,
  Contact,
  Pipeline,
  Stage,
  Activity,
  BusinessDocument,
  BusinessNote,
  User,
  CRMFilters,
  CRMMetrics,
  CreateBusinessRequest,
  CreateContactRequest,
  UpdateBusinessRequest,
  UpdateContactRequest,
};
