/**
 * CRM Jurídico Provider
 *
 * Contexto e provider para gerenciar estado global do domínio CRM Jurídico.
 * Isolado e independente de outros domínios.
 */

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useCRMJuridicoService } from "../services";
import type { CRMJuridicoState, CRMJuridicoAction } from "../types";

// Estado inicial do domínio
const initialState: CRMJuridicoState = {
  clientes: [],
  processos: [],
  contratos: [],
  tarefas: [],
  selectedCliente: null,
  selectedProcesso: null,
  filters: {
    cliente: "",
    status: "",
    dateRange: null,
  },
  isLoading: false,
  error: null,
  metrics: {
    totalClientes: 0,
    processosAtivos: 0,
    contratosVigentes: 0,
    tarefasPendentes: 0,
  },
};

// Reducer para gerenciar estado
function crmJuridicoReducer(
  state: CRMJuridicoState,
  action: CRMJuridicoAction,
): CRMJuridicoState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };

    case "SET_CLIENTES":
      return { ...state, clientes: action.payload, isLoading: false };

    case "SET_PROCESSOS":
      return { ...state, processos: action.payload, isLoading: false };

    case "SET_CONTRATOS":
      return { ...state, contratos: action.payload, isLoading: false };

    case "SET_TAREFAS":
      return { ...state, tarefas: action.payload, isLoading: false };

    case "SELECT_CLIENTE":
      return { ...state, selectedCliente: action.payload };

    case "SELECT_PROCESSO":
      return { ...state, selectedProcesso: action.payload };

    case "UPDATE_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case "UPDATE_METRICS":
      return { ...state, metrics: action.payload };

    case "ADD_CLIENTE":
      return {
        ...state,
        clientes: [action.payload, ...state.clientes],
        metrics: {
          ...state.metrics,
          totalClientes: state.metrics.totalClientes + 1,
        },
      };

    case "UPDATE_CLIENTE":
      return {
        ...state,
        clientes: state.clientes.map((cliente) =>
          cliente.id === action.payload.id ? action.payload : cliente,
        ),
      };

    case "REMOVE_CLIENTE":
      return {
        ...state,
        clientes: state.clientes.filter(
          (cliente) => cliente.id !== action.payload,
        ),
        metrics: {
          ...state.metrics,
          totalClientes: state.metrics.totalClientes - 1,
        },
      };

    case "ADD_PROCESSO":
      return {
        ...state,
        processos: [action.payload, ...state.processos],
        metrics: {
          ...state.metrics,
          processosAtivos:
            action.payload.status === "ativo"
              ? state.metrics.processosAtivos + 1
              : state.metrics.processosAtivos,
        },
      };

    case "UPDATE_PROCESSO":
      return {
        ...state,
        processos: state.processos.map((processo) =>
          processo.id === action.payload.id ? action.payload : processo,
        ),
      };

    case "REMOVE_PROCESSO":
      return {
        ...state,
        processos: state.processos.filter(
          (processo) => processo.id !== action.payload,
        ),
      };

    default:
      return state;
  }
}

// Context
interface CRMJuridicoContextValue extends CRMJuridicoState {
  // Actions
  loadClientes: () => Promise<void>;
  loadProcessos: () => Promise<void>;
  loadContratos: () => Promise<void>;
  loadTarefas: () => Promise<void>;
  createCliente: (cliente: any) => Promise<void>;
  updateCliente: (id: string, updates: any) => Promise<void>;
  deleteCliente: (id: string) => Promise<void>;
  createProcesso: (processo: any) => Promise<void>;
  updateProcesso: (id: string, updates: any) => Promise<void>;
  deleteProcesso: (id: string) => Promise<void>;
  selectCliente: (cliente: any) => void;
  selectProcesso: (processo: any) => void;
  updateFilters: (filters: any) => void;
  clearError: () => void;
  refreshMetrics: () => Promise<void>;
}

const CRMJuridicoContext = createContext<CRMJuridicoContextValue | null>(null);

// Provider Component
interface CRMJuridicoProviderProps {
  children: React.ReactNode;
}

export const CRMJuridicoProvider: React.FC<CRMJuridicoProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(crmJuridicoReducer, initialState);
  const crmService = useCRMJuridicoService();

  // Actions
  const loadClientes = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const clientes = await crmService.getClientes(state.filters);
      dispatch({ type: "SET_CLIENTES", payload: clientes });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Erro ao carregar clientes",
      });
    }
  };

  const loadProcessos = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const processos = await crmService.getProcessos(state.filters);
      dispatch({ type: "SET_PROCESSOS", payload: processos });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Erro ao carregar processos",
      });
    }
  };

  const loadContratos = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const contratos = await crmService.getContratos(state.filters);
      dispatch({ type: "SET_CONTRATOS", payload: contratos });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Erro ao carregar contratos",
      });
    }
  };

  const loadTarefas = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const tarefas = await crmService.getTarefas(state.filters);
      dispatch({ type: "SET_TAREFAS", payload: tarefas });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Erro ao carregar tarefas",
      });
    }
  };

  const createCliente = async (clienteData: any) => {
    try {
      const novoCliente = await crmService.createCliente(clienteData);
      dispatch({ type: "ADD_CLIENTE", payload: novoCliente });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Erro ao criar cliente",
      });
      throw error;
    }
  };

  const updateCliente = async (id: string, updates: any) => {
    try {
      const clienteAtualizado = await crmService.updateCliente(id, updates);
      dispatch({ type: "UPDATE_CLIENTE", payload: clienteAtualizado });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Erro ao atualizar cliente",
      });
      throw error;
    }
  };

  const deleteCliente = async (id: string) => {
    try {
      await crmService.deleteCliente(id);
      dispatch({ type: "REMOVE_CLIENTE", payload: id });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Erro ao excluir cliente",
      });
      throw error;
    }
  };

  const createProcesso = async (processoData: any) => {
    try {
      const novoProcesso = await crmService.createProcesso(processoData);
      dispatch({ type: "ADD_PROCESSO", payload: novoProcesso });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Erro ao criar processo",
      });
      throw error;
    }
  };

  const updateProcesso = async (id: string, updates: any) => {
    try {
      const processoAtualizado = await crmService.updateProcesso(id, updates);
      dispatch({ type: "UPDATE_PROCESSO", payload: processoAtualizado });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Erro ao atualizar processo",
      });
      throw error;
    }
  };

  const deleteProcesso = async (id: string) => {
    try {
      await crmService.deleteProcesso(id);
      dispatch({ type: "REMOVE_PROCESSO", payload: id });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Erro ao excluir processo",
      });
      throw error;
    }
  };

  const selectCliente = (cliente: any) => {
    dispatch({ type: "SELECT_CLIENTE", payload: cliente });
  };

  const selectProcesso = (processo: any) => {
    dispatch({ type: "SELECT_PROCESSO", payload: processo });
  };

  const updateFilters = (filters: any) => {
    dispatch({ type: "UPDATE_FILTERS", payload: filters });
  };

  const clearError = () => {
    dispatch({ type: "SET_ERROR", payload: null });
  };

  const refreshMetrics = async () => {
    try {
      const metrics = await crmService.getMetrics();
      dispatch({ type: "UPDATE_METRICS", payload: metrics });
    } catch (error) {
      console.error("Erro ao atualizar métricas:", error);
    }
  };

  // Auto-load inicial
  useEffect(() => {
    loadClientes();
    loadProcessos();
    loadContratos();
    loadTarefas();
    refreshMetrics();
  }, []);

  // Auto-refresh com filtros
  useEffect(() => {
    loadClientes();
    loadProcessos();
    loadContratos();
    loadTarefas();
  }, [state.filters]);

  const contextValue: CRMJuridicoContextValue = {
    ...state,
    loadClientes,
    loadProcessos,
    loadContratos,
    loadTarefas,
    createCliente,
    updateCliente,
    deleteCliente,
    createProcesso,
    updateProcesso,
    deleteProcesso,
    selectCliente,
    selectProcesso,
    updateFilters,
    clearError,
    refreshMetrics,
  };

  return (
    <CRMJuridicoContext.Provider value={contextValue}>
      {children}
    </CRMJuridicoContext.Provider>
  );
};

// Hook para usar o contexto
export const useCRMJuridico = (): CRMJuridicoContextValue => {
  const context = useContext(CRMJuridicoContext);
  if (!context) {
    throw new Error(
      "useCRMJuridico deve ser usado dentro de CRMJuridicoProvider",
    );
  }
  return context;
};

export default CRMJuridicoProvider;
