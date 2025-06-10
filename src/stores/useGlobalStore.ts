/**
 * 🏪 GLOBAL STORE - ESTADO GLOBAL UNIFICADO
 *
 * Sistema de estado centralizado usando Zustand para:
 * ✅ Performance otimizada
 * ✅ Estado compartilhado entre módulos
 * ✅ Persistência de dados
 * ✅ Notificações e alertas
 * ✅ Configurações de usuário
 * ✅ Cache inteligente
 */

import { create } from "zustand/react";
import { persist } from "zustand/middleware";

// Tipos de dados globais
export interface User {
  id: string;
  nome: string;
  email: string;
  perfil: "administrador" | "advogado" | "estagiario" | "cliente";
  avatar?: string;
  configuracoes: {
    tema: "claro" | "escuro";
    idioma: "pt-BR";
    notificacoes: boolean;
    timezone: string;
  };
  permissoes: string[];
}

export interface Notification {
  id: string;
  tipo: "info" | "success" | "warning" | "error";
  titulo: string;
  mensagem: string;
  timestamp: string;
  lida: boolean;
  acao?: {
    label: string;
    url: string;
  };
}

export interface AIState {
  disponivel: boolean;
  processando: boolean;
  ultimaAnalise?: string;
  creditos: number;
  configuracoes: {
    autoAnalise: boolean;
    idioma: "pt-BR";
    modelo: "gpt-4" | "claude-3" | "local";
  };
}

export interface StorageProvider {
  id: string;
  nome: string;
  tipo: "aws-s3" | "google-drive" | "onedrive" | "local";
  ativo: boolean;
  configuracao: Record<string, any>;
  espaco: {
    usado: number;
    total: number;
  };
}

export interface AuditLog {
  id: string;
  usuario: string;
  acao: string;
  modulo: string;
  detalhes: string;
  timestamp: string;
  ip?: string;
}

// Interface do store global
interface GlobalStore {
  // Estado do usuário
  user: User | null;
  setUser: (user: User | null) => void;
  updateUserConfig: (config: Partial<User["configuracoes"]>) => void;

  // Sistema de notificações
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "lida">,
  ) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  unreadCount: number;

  // Estado da IA
  ai: AIState;
  setAIProcessing: (processing: boolean) => void;
  updateAIConfig: (config: Partial<AIState["configuracoes"]>) => void;
  decrementAICredits: () => void;

  // Provedores de armazenamento
  storageProviders: StorageProvider[];
  activeStorageProvider: StorageProvider | null;
  setActiveStorageProvider: (provider: StorageProvider) => void;
  updateStorageProvider: (
    id: string,
    updates: Partial<StorageProvider>,
  ) => void;

  // Sistema de auditoria
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, "id" | "timestamp">) => void;
  clearOldAuditLogs: () => void;

  // Cache e performance
  cache: Map<string, { data: any; timestamp: number; ttl: number }>;
  setCache: (key: string, data: any, ttl?: number) => void;
  getCache: (key: string) => any;
  clearCache: () => void;

  // Estado da aplicação
  loading: boolean;
  setLoading: (loading: boolean) => void;
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  currentModule: string;
  setCurrentModule: (module: string) => void;

  // Métodos utilitários
  initialize: () => void;
  reset: () => void;
}

// Estado inicial
const initialState = {
  user: null,
  notifications: [],
  unreadCount: 0,
  ai: {
    disponivel: true,
    processando: false,
    creditos: 1000,
    configuracoes: {
      autoAnalise: true,
      idioma: "pt-BR" as const,
      modelo: "gpt-4" as const,
    },
  },
  storageProviders: [
    {
      id: "local",
      nome: "Armazenamento Local",
      tipo: "local" as const,
      ativo: true,
      configuracao: {},
      espaco: { usado: 0, total: 1024 * 1024 * 1024 }, // 1GB
    },
  ],
  activeStorageProvider: null,
  auditLogs: [],
  cache: new Map(),
  loading: false,
  sidebarExpanded: false,
  currentModule: "painel",
};

// Store principal
export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Métodos do usuário
      setUser: (user) => {
        set({ user });
        if (user) {
          get().addAuditLog({
            usuario: user.email,
            acao: "login",
            modulo: "autenticacao",
            detalhes: "Usuário fez login no sistema",
          });
        }
      },

      updateUserConfig: (config) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              configuracoes: { ...user.configuracoes, ...config },
            },
          });
        }
      },

      // Métodos de notificações
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          lida: false,
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50), // Manter apenas 50
          unreadCount: state.unreadCount + 1,
        }));
      },

      markNotificationAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, lida: true } : n,
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },

      clearNotifications: () => {
        set({ notifications: [], unreadCount: 0 });
      },

      // Métodos da IA
      setAIProcessing: (processing) => {
        set((state) => ({
          ai: { ...state.ai, processando: processing },
        }));
      },

      updateAIConfig: (config) => {
        set((state) => ({
          ai: {
            ...state.ai,
            configuracoes: { ...state.ai.configuracoes, ...config },
          },
        }));
      },

      decrementAICredits: () => {
        set((state) => ({
          ai: { ...state.ai, creditos: Math.max(0, state.ai.creditos - 1) },
        }));
      },

      // Métodos de armazenamento
      setActiveStorageProvider: (provider) => {
        set({ activeStorageProvider: provider });
        get().addAuditLog({
          usuario: get().user?.email || "sistema",
          acao: "alteracao_storage",
          modulo: "configuracoes",
          detalhes: `Provedor de armazenamento alterado para: ${provider.nome}`,
        });
      },

      updateStorageProvider: (id, updates) => {
        set((state) => ({
          storageProviders: state.storageProviders.map((p) =>
            p.id === id ? { ...p, ...updates } : p,
          ),
        }));
      },

      // Métodos de auditoria
      addAuditLog: (log) => {
        const newLog: AuditLog = {
          ...log,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          auditLogs: [newLog, ...state.auditLogs].slice(0, 1000), // Manter apenas 1000
        }));
      },

      clearOldAuditLogs: () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        set((state) => ({
          auditLogs: state.auditLogs.filter(
            (log) => new Date(log.timestamp) > thirtyDaysAgo,
          ),
        }));
      },

      // Métodos de cache
      setCache: (key, data, ttl = 300000) => {
        // 5 minutos por padrão
        const { cache } = get();
        cache.set(key, {
          data,
          timestamp: Date.now(),
          ttl,
        });
        set({ cache: new Map(cache) });
      },

      getCache: (key) => {
        const { cache } = get();
        const item = cache.get(key);

        if (!item) return null;

        const now = Date.now();
        if (now - item.timestamp > item.ttl) {
          cache.delete(key);
          set({ cache: new Map(cache) });
          return null;
        }

        return item.data;
      },

      clearCache: () => {
        set({ cache: new Map() });
      },

      // Métodos da aplicação
      setLoading: (loading) => set({ loading }),

      setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),

      setCurrentModule: (module) => {
        set({ currentModule: module });
        get().addAuditLog({
          usuario: get().user?.email || "anonimo",
          acao: "navegacao",
          modulo: module,
          detalhes: `Acessou módulo: ${module}`,
        });
      },

      // Métodos utilitários
      initialize: () => {
        // Inicializar estado padrão
        const state = get();

        // Definir primeiro provedor como ativo se nenhum estiver ativo
        if (!state.activeStorageProvider && state.storageProviders.length > 0) {
          state.setActiveStorageProvider(state.storageProviders[0]);
        }

        // Limpar logs antigos
        state.clearOldAuditLogs();

        // Limpar cache expirado
        const now = Date.now();
        const cache = new Map(state.cache);
        for (const [key, item] of cache.entries()) {
          if (now - item.timestamp > item.ttl) {
            cache.delete(key);
          }
        }
        set({ cache });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "lawdesk-store",
      partialize: (state) => ({
        user: state.user,
        sidebarExpanded: state.sidebarExpanded,
        ai: state.ai,
        storageProviders: state.storageProviders,
        activeStorageProvider: state.activeStorageProvider,
      }),
    },
  ),
);

// Hook para notificações específicas
export const useNotifications = () => {
  const notifications = useGlobalStore((state) => state.notifications);
  const unreadCount = useGlobalStore((state) => state.unreadCount);
  const addNotification = useGlobalStore((state) => state.addNotification);
  const markAsRead = useGlobalStore((state) => state.markNotificationAsRead);
  const clear = useGlobalStore((state) => state.clearNotifications);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    clear,
  };
};

// Hook para IA
export const useAI = () => {
  const ai = useGlobalStore((state) => state.ai);
  const setProcessing = useGlobalStore((state) => state.setAIProcessing);
  const updateConfig = useGlobalStore((state) => state.updateAIConfig);
  const decrementCredits = useGlobalStore((state) => state.decrementAICredits);

  return {
    ...ai,
    setProcessing,
    updateConfig,
    decrementCredits,
  };
};

// Hook para auditoria
export const useAudit = () => {
  const auditLogs = useGlobalStore((state) => state.auditLogs);
  const addLog = useGlobalStore((state) => state.addAuditLog);
  const clearOld = useGlobalStore((state) => state.clearOldAuditLogs);

  return {
    logs: auditLogs,
    addLog,
    clearOld,
  };
};

// Hook para cache
export const useCache = () => {
  const setCache = useGlobalStore((state) => state.setCache);
  const getCache = useGlobalStore((state) => state.getCache);
  const clearCache = useGlobalStore((state) => state.clearCache);

  return {
    set: setCache,
    get: getCache,
    clear: clearCache,
  };
};
