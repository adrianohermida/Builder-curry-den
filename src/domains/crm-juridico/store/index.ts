/**
 * CRM Jurídico Store - Zustand Store inspirado no Bitrix24
 *
 * Estado global para gestão de negócios, contatos, pipeline e atividades
 * seguindo os padrões modernos do Bitrix24 CRM.
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type {
  Business,
  Contact,
  Pipeline,
  Stage,
  Activity,
  CRMFilters,
  CRMMetrics,
} from "../types";

interface CRMJuridicoStore {
  // Estado principal
  businesses: Business[];
  contacts: Contact[];
  pipelines: Pipeline[];
  stages: Stage[];
  activities: Activity[];

  // Estado da UI
  selectedBusiness: Business | null;
  selectedContact: Contact | null;
  currentPipeline: Pipeline | null;
  viewMode: "kanban" | "list" | "calendar";
  sidebarCollapsed: boolean;

  // Filtros e busca
  filters: CRMFilters;
  searchQuery: string;

  // Loading states
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;

  // Métricas
  metrics: CRMMetrics;

  // Ações - Negócios
  setBusinesses: (businesses: Business[]) => void;
  addBusiness: (business: Business) => void;
  updateBusiness: (id: string, updates: Partial<Business>) => void;
  deleteBusiness: (id: string) => void;
  selectBusiness: (business: Business | null) => void;
  moveBusiness: (businessId: string, targetStageId: string) => void;

  // Ações - Contatos
  setContacts: (contacts: Contact[]) => void;
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  selectContact: (contact: Contact | null) => void;

  // Ações - Pipeline
  setPipelines: (pipelines: Pipeline[]) => void;
  setCurrentPipeline: (pipeline: Pipeline) => void;
  addStage: (stage: Stage) => void;
  updateStage: (stageId: string, updates: Partial<Stage>) => void;
  reorderStages: (stageIds: string[]) => void;

  // Ações - Atividades
  addActivity: (activity: Activity) => void;

  // Ações - UI
  setViewMode: (mode: "kanban" | "list" | "calendar") => void;
  toggleSidebar: () => void;
  setFilters: (filters: Partial<CRMFilters>) => void;
  setSearchQuery: (query: string) => void;

  // Ações - Loading
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setDeleting: (deleting: boolean) => void;

  // Ações - Métricas
  updateMetrics: (metrics: Partial<CRMMetrics>) => void;

  // Ações complexas
  createBusinessFromLead: (
    contact: Contact,
    businessData: Partial<Business>,
  ) => void;
  bulkUpdateBusinesses: (
    businessIds: string[],
    updates: Partial<Business>,
  ) => void;
  bulkDeleteBusinesses: (businessIds: string[]) => void;

  // Utilidades
  getBusinessesByStage: (stageId: string) => Business[];
  getBusinessesByContact: (contactId: string) => Business[];
  getActivitiesByBusiness: (businessId: string) => Activity[];
  searchBusinesses: (query: string) => Business[];
  searchContacts: (query: string) => Contact[];
}

const initialFilters: CRMFilters = {
  stage: [],
  assignedTo: [],
  dateRange: null,
  value: { min: 0, max: null },
  tags: [],
  status: "all",
};

const initialMetrics: CRMMetrics = {
  totalBusinesses: 0,
  totalContacts: 0,
  totalValue: 0,
  conversionRate: 0,
  avgDealSize: 0,
  dealsWonThisMonth: 0,
  dealsLostThisMonth: 0,
  activitiesCompleted: 0,
  businessesByStage: {},
  businessesByStatus: {},
  revenueByMonth: [],
};

export const useCRMStore = create<CRMJuridicoStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Estado inicial
        businesses: [],
        contacts: [],
        pipelines: [],
        stages: [],
        activities: [],

        selectedBusiness: null,
        selectedContact: null,
        currentPipeline: null,
        viewMode: "kanban",
        sidebarCollapsed: false,

        filters: initialFilters,
        searchQuery: "",

        isLoading: false,
        isSaving: false,
        isDeleting: false,

        metrics: initialMetrics,

        // Ações - Negócios
        setBusinesses: (businesses) =>
          set((state) => {
            state.businesses = businesses;
            state.metrics.totalBusinesses = businesses.length;
            state.metrics.totalValue = businesses.reduce(
              (sum, b) => sum + b.value,
              0,
            );
            state.metrics.avgDealSize =
              businesses.length > 0
                ? state.metrics.totalValue / businesses.length
                : 0;
          }),

        addBusiness: (business) =>
          set((state) => {
            state.businesses.push(business);
            state.metrics.totalBusinesses += 1;
            state.metrics.totalValue += business.value;
            state.metrics.avgDealSize =
              state.businesses.length > 0
                ? state.metrics.totalValue / state.businesses.length
                : 0;
          }),

        updateBusiness: (id, updates) =>
          set((state) => {
            const index = state.businesses.findIndex((b) => b.id === id);
            if (index !== -1) {
              const oldValue = state.businesses[index].value;
              state.businesses[index] = {
                ...state.businesses[index],
                ...updates,
              };

              if (updates.value !== undefined) {
                state.metrics.totalValue =
                  state.metrics.totalValue - oldValue + updates.value;
                state.metrics.avgDealSize =
                  state.businesses.length > 0
                    ? state.metrics.totalValue / state.businesses.length
                    : 0;
              }
            }
          }),

        deleteBusiness: (id) =>
          set((state) => {
            const business = state.businesses.find((b) => b.id === id);
            if (business) {
              state.businesses = state.businesses.filter((b) => b.id !== id);
              state.metrics.totalBusinesses -= 1;
              state.metrics.totalValue -= business.value;
              state.metrics.avgDealSize =
                state.businesses.length > 0
                  ? state.metrics.totalValue / state.businesses.length
                  : 0;
            }
          }),

        selectBusiness: (business) =>
          set((state) => {
            state.selectedBusiness = business;
          }),

        moveBusiness: (businessId, targetStageId) =>
          set((state) => {
            const business = state.businesses.find((b) => b.id === businessId);
            if (business) {
              business.stageId = targetStageId;
              business.updatedAt = new Date();

              // Adicionar atividade de movimentação
              const activity: Activity = {
                id: `activity_${Date.now()}`,
                type: "stage_change",
                title: "Negócio movido para nova etapa",
                description: `Negócio movido para etapa: ${targetStageId}`,
                businessId: businessId,
                userId: "current_user", // TODO: pegar do contexto de auth
                createdAt: new Date(),
                metadata: {
                  previousStageId: business.stageId,
                  newStageId: targetStageId,
                },
              };
              state.activities.push(activity);
            }
          }),

        // Ações - Contatos
        setContacts: (contacts) =>
          set((state) => {
            state.contacts = contacts;
            state.metrics.totalContacts = contacts.length;
          }),

        addContact: (contact) =>
          set((state) => {
            state.contacts.push(contact);
            state.metrics.totalContacts += 1;
          }),

        updateContact: (id, updates) =>
          set((state) => {
            const index = state.contacts.findIndex((c) => c.id === id);
            if (index !== -1) {
              state.contacts[index] = { ...state.contacts[index], ...updates };
            }
          }),

        deleteContact: (id) =>
          set((state) => {
            state.contacts = state.contacts.filter((c) => c.id !== id);
            state.metrics.totalContacts -= 1;
          }),

        selectContact: (contact) =>
          set((state) => {
            state.selectedContact = contact;
          }),

        // Ações - Pipeline
        setPipelines: (pipelines) =>
          set((state) => {
            state.pipelines = pipelines;
            if (pipelines.length > 0 && !state.currentPipeline) {
              state.currentPipeline = pipelines[0];
            }
          }),

        setCurrentPipeline: (pipeline) =>
          set((state) => {
            state.currentPipeline = pipeline;
            state.stages = pipeline.stages;
          }),

        addStage: (stage) =>
          set((state) => {
            state.stages.push(stage);
            if (state.currentPipeline) {
              state.currentPipeline.stages.push(stage);
            }
          }),

        updateStage: (stageId, updates) =>
          set((state) => {
            const index = state.stages.findIndex((s) => s.id === stageId);
            if (index !== -1) {
              state.stages[index] = { ...state.stages[index], ...updates };
            }
          }),

        reorderStages: (stageIds) =>
          set((state) => {
            const reorderedStages = stageIds
              .map((id) => state.stages.find((s) => s.id === id))
              .filter(Boolean) as Stage[];

            reorderedStages.forEach((stage, index) => {
              stage.order = index;
            });

            state.stages = reorderedStages;
          }),

        // Ações - Atividades
        addActivity: (activity) =>
          set((state) => {
            state.activities.push(activity);
            state.metrics.activitiesCompleted += 1;
          }),

        // Ações - UI
        setViewMode: (mode) =>
          set((state) => {
            state.viewMode = mode;
          }),

        toggleSidebar: () =>
          set((state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
          }),

        setFilters: (filters) =>
          set((state) => {
            state.filters = { ...state.filters, ...filters };
          }),

        setSearchQuery: (query) =>
          set((state) => {
            state.searchQuery = query;
          }),

        // Ações - Loading
        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading;
          }),

        setSaving: (saving) =>
          set((state) => {
            state.isSaving = saving;
          }),

        setDeleting: (deleting) =>
          set((state) => {
            state.isDeleting = deleting;
          }),

        // Ações - Métricas
        updateMetrics: (metrics) =>
          set((state) => {
            state.metrics = { ...state.metrics, ...metrics };
          }),

        // Ações complexas
        createBusinessFromLead: (contact, businessData) =>
          set((state) => {
            const business: Business = {
              id: `business_${Date.now()}`,
              title: businessData.title || `Negócio - ${contact.name}`,
              contactId: contact.id,
              contact: contact,
              value: businessData.value || 0,
              stageId: businessData.stageId || state.stages[0]?.id || "",
              assignedTo: businessData.assignedTo || "current_user",
              status: "open",
              probability: 10,
              expectedCloseDate: businessData.expectedCloseDate,
              tags: businessData.tags || [],
              customFields: businessData.customFields || {},
              createdAt: new Date(),
              updatedAt: new Date(),
              ...businessData,
            };

            state.businesses.push(business);
            state.metrics.totalBusinesses += 1;
            state.metrics.totalValue += business.value;
          }),

        bulkUpdateBusinesses: (businessIds, updates) =>
          set((state) => {
            businessIds.forEach((id) => {
              const index = state.businesses.findIndex((b) => b.id === id);
              if (index !== -1) {
                state.businesses[index] = {
                  ...state.businesses[index],
                  ...updates,
                };
              }
            });
          }),

        bulkDeleteBusinesses: (businessIds) =>
          set((state) => {
            businessIds.forEach((id) => {
              const business = state.businesses.find((b) => b.id === id);
              if (business) {
                state.businesses = state.businesses.filter((b) => b.id !== id);
                state.metrics.totalBusinesses -= 1;
                state.metrics.totalValue -= business.value;
              }
            });
          }),

        // Utilidades
        getBusinessesByStage: (stageId) => {
          return get().businesses.filter((b) => b.stageId === stageId);
        },

        getBusinessesByContact: (contactId) => {
          return get().businesses.filter((b) => b.contactId === contactId);
        },

        getActivitiesByBusiness: (businessId) => {
          return get().activities.filter((a) => a.businessId === businessId);
        },

        searchBusinesses: (query) => {
          const businesses = get().businesses;
          if (!query) return businesses;

          return businesses.filter(
            (business) =>
              business.title.toLowerCase().includes(query.toLowerCase()) ||
              business.contact?.name
                .toLowerCase()
                .includes(query.toLowerCase()) ||
              business.tags.some((tag) =>
                tag.toLowerCase().includes(query.toLowerCase()),
              ),
          );
        },

        searchContacts: (query) => {
          const contacts = get().contacts;
          if (!query) return contacts;

          return contacts.filter(
            (contact) =>
              contact.name.toLowerCase().includes(query.toLowerCase()) ||
              contact.email.toLowerCase().includes(query.toLowerCase()) ||
              contact.document.includes(query) ||
              contact.tags.some((tag) =>
                tag.toLowerCase().includes(query.toLowerCase()),
              ),
          );
        },
      })),
      {
        name: "crm-juridico-store",
        partialize: (state) => ({
          viewMode: state.viewMode,
          sidebarCollapsed: state.sidebarCollapsed,
          filters: state.filters,
          currentPipeline: state.currentPipeline,
        }),
      },
    ),
    { name: "CRM Jurídico Store" },
  ),
);

// Seletores otimizados
export const useCRMSelectors = () => {
  const store = useCRMStore();

  return {
    // Negócios filtrados
    filteredBusinesses: () => {
      let businesses = store.businesses;

      if (store.searchQuery) {
        businesses = store.searchBusinesses(store.searchQuery);
      }

      if (store.filters.stage.length > 0) {
        businesses = businesses.filter((b) =>
          store.filters.stage.includes(b.stageId),
        );
      }

      if (store.filters.assignedTo.length > 0) {
        businesses = businesses.filter((b) =>
          store.filters.assignedTo.includes(b.assignedTo),
        );
      }

      if (store.filters.value.min > 0) {
        businesses = businesses.filter(
          (b) => b.value >= store.filters.value.min,
        );
      }

      if (store.filters.value.max) {
        businesses = businesses.filter(
          (b) => b.value <= store.filters.value.max!,
        );
      }

      return businesses;
    },

    // Contatos filtrados
    filteredContacts: () => {
      let contacts = store.contacts;

      if (store.searchQuery) {
        contacts = store.searchContacts(store.searchQuery);
      }

      return contacts;
    },

    // Negócios por etapa
    businessesByStage: () => {
      const filteredBusinesses = useCRMSelectors().filteredBusinesses();
      const businessesByStage: Record<string, Business[]> = {};

      store.stages.forEach((stage) => {
        businessesByStage[stage.id] = filteredBusinesses.filter(
          (b) => b.stageId === stage.id,
        );
      });

      return businessesByStage;
    },
  };
};

export default useCRMStore;
