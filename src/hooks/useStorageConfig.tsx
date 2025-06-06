import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import {
  StorageConfig,
  StorageProvider,
} from "@/components/Settings/ConfigStorageProvider";
import { toast } from "sonner";

interface StorageContextType {
  config: StorageConfig | null;
  updateConfig: (newConfig: StorageConfig) => void;
  uploadFile: (
    file: File,
    path: string,
    options?: UploadOptions,
  ) => Promise<UploadResult>;
  isConfigured: boolean;
  currentProvider: string;
}

interface UploadOptions {
  encrypt?: boolean;
  overwrite?: boolean;
  onProgress?: (progress: number) => void;
  metadata?: Record<string, any>;
}

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  metadata?: Record<string, any>;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<StorageConfig | null>(null);

  // Load configuration on mount
  useEffect(() => {
    loadStorageConfig();

    // Listen for configuration updates
    const handleConfigUpdate = (event: CustomEvent) => {
      setConfig(event.detail);
    };

    window.addEventListener(
      "storage-config-updated",
      handleConfigUpdate as EventListener,
    );

    return () => {
      window.removeEventListener(
        "storage-config-updated",
        handleConfigUpdate as EventListener,
      );
    };
  }, []);

  const loadStorageConfig = useCallback(() => {
    try {
      const savedConfig = localStorage.getItem("lawdesk-storage-config");
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
      } else {
        // Default to Lawdesk Cloud if no config
        const defaultConfig: StorageConfig = {
          provider: "lawdesk-cloud",
          isActive: true,
          encryption: true,
          config: { region: "sa-east-1", storageClass: "standard" },
          connectionStatus: "connected",
        };
        setConfig(defaultConfig);
      }
    } catch (error) {
      console.error("Erro ao carregar configuração de armazenamento:", error);
      toast.error("Erro ao carregar configuração de armazenamento");
    }
  }, []);

  const updateConfig = useCallback((newConfig: StorageConfig) => {
    setConfig(newConfig);
    localStorage.setItem("lawdesk-storage-config", JSON.stringify(newConfig));

    // Dispatch custom event for other components
    window.dispatchEvent(
      new CustomEvent("storage-config-updated", { detail: newConfig }),
    );
  }, []);

  const uploadFile = useCallback(
    async (
      file: File,
      path: string,
      options: UploadOptions = {},
    ): Promise<UploadResult> => {
      if (!config) {
        return {
          success: false,
          error: "Configuração de armazenamento não encontrada",
        };
      }

      try {
        // Validate file size
        const maxSize = (config.config.maxFileSize || 50) * 1024 * 1024; // Convert MB to bytes
        if (file.size > maxSize) {
          return {
            success: false,
            error: `Arquivo muito grande. Tamanho máximo: ${config.config.maxFileSize || 50}MB`,
          };
        }

        // Validate file type
        const allowedTypes =
          config.config.allowedTypes || "pdf,doc,docx,jpg,png";
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        if (fileExtension && !allowedTypes.includes(fileExtension)) {
          return {
            success: false,
            error: `Tipo de arquivo não permitido. Tipos aceitos: ${allowedTypes}`,
          };
        }

        // Simulate upload process based on provider
        return simulateUpload(file, path, config, options);
      } catch (error) {
        console.error("Erro no upload:", error);
        return {
          success: false,
          error: "Erro interno no upload do arquivo",
        };
      }
    },
    [config],
  );

  const simulateUpload = async (
    file: File,
    path: string,
    config: StorageConfig,
    options: UploadOptions,
  ): Promise<UploadResult> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        options.onProgress?.(progress);

        if (progress >= 100) {
          clearInterval(interval);

          // Simulate success/failure based on provider
          const success = Math.random() > 0.1; // 90% success rate

          if (success) {
            const baseUrl = getProviderBaseUrl(config.provider);
            resolve({
              success: true,
              url: `${baseUrl}/${path}/${file.name}`,
              metadata: {
                provider: config.provider,
                encrypted: config.encryption && options.encrypt !== false,
                uploadedAt: new Date().toISOString(),
                size: file.size,
                type: file.type,
              },
            });
          } else {
            resolve({
              success: false,
              error: "Falha na conexão com o provedor de armazenamento",
            });
          }
        }
      }, 100);
    });
  };

  const getProviderBaseUrl = (provider: StorageProvider): string => {
    switch (provider) {
      case "lawdesk-cloud":
        return "https://cdn.lawdesk.com.br";
      case "supabase-external":
        return config?.config.url || "https://supabase.co";
      case "google-drive":
        return "https://drive.google.com";
      case "ftp-sftp":
        return `ftp://${config?.config.host}`;
      case "api-custom":
        return config?.config.baseUrl || "https://api.exemplo.com";
      default:
        return "https://cdn.lawdesk.com.br";
    }
  };

  const getProviderName = (provider: StorageProvider): string => {
    switch (provider) {
      case "lawdesk-cloud":
        return "Lawdesk Cloud";
      case "supabase-external":
        return "Supabase Externo";
      case "google-drive":
        return "Google Drive";
      case "ftp-sftp":
        return "Servidor Local";
      case "api-custom":
        return "API Personalizada";
      default:
        return "Desconhecido";
    }
  };

  const value: StorageContextType = {
    config,
    updateConfig,
    uploadFile,
    isConfigured: !!config && config.connectionStatus === "connected",
    currentProvider: config
      ? getProviderName(config.provider)
      : "Não configurado",
  };

  return (
    <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
  );
}

export function useStorageConfig() {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error(
      "useStorageConfig deve ser usado dentro de um StorageProvider",
    );
  }
  return context;
}

// Helper functions for common upload paths
export const getUploadPath = {
  cliente: (clienteId: string) => `clientes/${clienteId}/documentos`,
  processo: (numeroProcesso: string) =>
    `processos/${numeroProcesso.replace(/[\/\\]/g, "_")}/anexos`,
  contrato: (contratoId: string) => `contratos/${contratoId}/arquivos`,
  ticket: (ticketId: string) => `tickets/${ticketId}/anexos`,
  ia: (documentoId: string) => `ia-juridica/${documentoId}`,
  agenda: (eventoId: string) => `agenda/${eventoId}/anexos`,
};

// Storage analytics helper
export const useStorageAnalytics = () => {
  const { config } = useStorageConfig();

  const trackUpload = useCallback(
    (file: File, path: string, success: boolean) => {
      const analytics = {
        timestamp: new Date().toISOString(),
        action: "upload",
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        path,
        provider: config?.provider,
        success,
        encrypted: config?.encryption,
      };

      // Store in localStorage for analytics (in production, send to analytics service)
      const existingAnalytics = JSON.parse(
        localStorage.getItem("lawdesk-storage-analytics") || "[]",
      );
      existingAnalytics.push(analytics);

      // Keep only last 1000 entries
      if (existingAnalytics.length > 1000) {
        existingAnalytics.splice(0, existingAnalytics.length - 1000);
      }

      localStorage.setItem(
        "lawdesk-storage-analytics",
        JSON.stringify(existingAnalytics),
      );
    },
    [config],
  );

  const getAnalytics = useCallback(() => {
    return JSON.parse(
      localStorage.getItem("lawdesk-storage-analytics") || "[]",
    );
  }, []);

  return { trackUpload, getAnalytics };
};
