/**
 * Integration Hooks
 *
 * React hooks for managing integrations with React Query.
 * Provides CRUD operations, testing, and real-time updates.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { integrationService } from "../services/integrationService";
import type {
  Integration,
  CreateIntegrationRequest,
  UpdateIntegrationRequest,
  TestConnectionRequest,
  SyncOptions,
  PaginationParams,
} from "../types";

// Query keys
const QUERY_KEYS = {
  integrations: "integrations",
  integration: "integration",
  metrics: "integration-metrics",
  logs: "integration-logs",
  providers: "integration-providers",
} as const;

/**
 * Hook for fetching integrations with pagination
 */
export const useIntegrations = (params: PaginationParams = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.integrations, params],
    queryFn: () => integrationService.getIntegrations(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const createIntegration = useMutation({
    mutationFn: (data: CreateIntegrationRequest) =>
      integrationService.createIntegration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.integrations] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.metrics] });
    },
  });

  const updateIntegration = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateIntegrationRequest;
    }) => integrationService.updateIntegration(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.integrations] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.integration, id] });
    },
  });

  const deleteIntegration = useMutation({
    mutationFn: (id: string) => integrationService.deleteIntegration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.integrations] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.metrics] });
    },
  });

  const testConnection = useMutation({
    mutationFn: (request: TestConnectionRequest) =>
      integrationService.testConnection(request),
  });

  const syncIntegration = useMutation({
    mutationFn: ({
      integrationId,
      options,
    }: {
      integrationId: string;
      options: SyncOptions;
    }) => integrationService.syncIntegration(integrationId, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.integrations] });
    },
  });

  return {
    ...query,
    integrations: query.data,
    createIntegration,
    updateIntegration,
    deleteIntegration,
    testConnection,
    syncIntegration,
  };
};

/**
 * Hook for fetching a single integration
 */
export const useIntegration = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.integration, id],
    queryFn: () => integrationService.getIntegration(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook for integration metrics
 */
export const useIntegrationMetrics = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.metrics],
    queryFn: () => integrationService.getMetrics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for integration logs
 */
export const useIntegrationLogs = (
  integrationId?: string,
  params: PaginationParams = {},
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.logs, integrationId, params],
    queryFn: () => integrationService.getLogs(integrationId, params),
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Hook for available providers
 */
export const useIntegrationProviders = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.providers],
    queryFn: () => integrationService.getAvailableProviders(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    select: (providers) =>
      providers.map((provider) => ({
        provider,
        adapter: integrationService.getAdapter(provider),
      })),
  });
};

/**
 * Hook for integration health monitoring
 */
export const useIntegrationHealth = (integrationId: string, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.integration, integrationId, "health"],
    queryFn: () => integrationService.getIntegrationHealth(integrationId),
    enabled: enabled && !!integrationId,
    refetchInterval: 30 * 1000, // Refresh every 30 seconds
    staleTime: 15 * 1000, // 15 seconds
  });
};

/**
 * Hook for real-time integration status updates
 */
export const useIntegrationStatusUpdates = (integrationIds: string[]) => {
  const queryClient = useQueryClient();

  // This could be enhanced with WebSocket connections for real-time updates
  const updateStatuses = useMutation({
    mutationFn: async () => {
      const promises = integrationIds.map((id) =>
        integrationService.getIntegrationHealth(id),
      );
      return Promise.all(promises);
    },
    onSuccess: (healthStatuses) => {
      // Update individual integration queries
      healthStatuses.forEach((health, index) => {
        const integrationId = integrationIds[index];
        queryClient.setQueryData(
          [QUERY_KEYS.integration, integrationId, "health"],
          health,
        );
      });
    },
  });

  return {
    updateStatuses,
    isUpdating: updateStatuses.isPending,
  };
};

/**
 * Hook for bulk integration operations
 */
export const useBulkIntegrationOperations = () => {
  const queryClient = useQueryClient();

  const bulkSync = useMutation({
    mutationFn: async (integrationIds: string[]) => {
      const promises = integrationIds.map((id) =>
        integrationService.syncIntegration(id, {
          direction: "bidirectional",
          entities: ["all"],
        }),
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.integrations] });
    },
  });

  const bulkDelete = useMutation({
    mutationFn: async (integrationIds: string[]) => {
      const promises = integrationIds.map((id) =>
        integrationService.deleteIntegration(id),
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.integrations] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.metrics] });
    },
  });

  return {
    bulkSync,
    bulkDelete,
  };
};

// Export individual functions for convenience
export {
  useIntegration,
  useIntegrationMetrics,
  useIntegrationLogs,
  useIntegrationProviders,
  useIntegrationHealth,
  useIntegrationStatusUpdates,
  useBulkIntegrationOperations,
};
