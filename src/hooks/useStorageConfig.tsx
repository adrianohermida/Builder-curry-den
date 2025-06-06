import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export type StorageProvider =
  | "lawdesk-cloud"
  | "supabase-external"
  | "google-drive"
  | "ftp-sftp"
  | "api-custom";

export interface StorageConfig {
  provider: StorageProvider;
  isActive: boolean;
  encryption: boolean;
  config: Record<string, any>;
  connectionStatus: "connected" | "error" | "pending" | "untested";
  lastTested?: Date;
  errorDetails?: {
    message: string;
    statusCode?: number;
    timestamp: Date;
  };
}

export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
}

interface StorageContextType {
  config: StorageConfig | null;
  uploads: UploadProgress[];
  isUploading: boolean;
  updateConfig: (config: StorageConfig) => void;
  uploadFile: (
    file: File,
    path: string,
    entityType: string,
    entityId: string,
  ) => Promise<string>;
  getUploadPath: (entityType: string, entityId: string) => string;
  downloadFile: (fileId: string, fileName: string) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  checkConnection: () => Promise<boolean>;
  clearUploads: () => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<StorageConfig | null>(null);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Carregar configuração salva
  useEffect(() => {
    const savedConfig = localStorage.getItem("lawdesk-storage-config");
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(parsed);
      } catch (error) {
        console.error("Erro ao carregar configuração de armazenamento:", error);
      }
    } else {
      // Configuração padrão
      const defaultConfig: StorageConfig = {
        provider: "lawdesk-cloud",
        isActive: true,
        encryption: true,
        config: {
          region: "sa-east-1",
          storageClass: "standard",
          autoBackup: true,
        },
        connectionStatus: "connected",
      };
      setConfig(defaultConfig);
      localStorage.setItem(
        "lawdesk-storage-config",
        JSON.stringify(defaultConfig),
      );
    }
  }, []);

  const updateConfig = (newConfig: StorageConfig) => {
    setConfig(newConfig);
    localStorage.setItem("lawdesk-storage-config", JSON.stringify(newConfig));

    // Log da mudança de configuração
    logAuditAction({
      action: "CONFIG_CHANGE",
      module: "CONFIGURACOES",
      entityType: "STORAGE_CONFIG",
      entityId: "config_001",
      details: `Provedor alterado para ${newConfig.provider}`,
      riskLevel: "HIGH",
    });
  };

  const getUploadPath = (entityType: string, entityId: string): string => {
    const paths = {
      CLIENTE: `clientes/${entityId}/documentos`,
      PROCESSO: `processos/${entityId}/anexos`,
      CONTRATO: `contratos/${entityId}/arquivos`,
      TICKET: `tickets/${entityId}/anexos`,
      IA_ANALYSIS: `ia-juridica/${entityId}`,
      AGENDA: `agenda/${entityId}`,
      PUBLICACAO: `publicacoes/${entityId}`,
      USUARIO: `usuarios/${entityId}`,
    };

    return (
      paths[entityType as keyof typeof paths] ||
      `outros/${entityType}/${entityId}`
    );
  };

  const uploadFile = async (
    file: File,
    path: string,
    entityType: string,
    entityId: string,
  ): Promise<string> => {
    if (!config || !config.isActive) {
      throw new Error("Provedor de armazenamento não configurado");
    }

    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Inicializar progresso
    const uploadProgress: UploadProgress = {
      fileId,
      fileName: file.name,
      progress: 0,
      status: "uploading",
    };

    setUploads((prev) => [...prev, uploadProgress]);
    setIsUploading(true);

    try {
      // Verificar se há fallback necessário
      if (config.connectionStatus === "error") {
        await handleFallback();
      }

      // Simular upload com progresso
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setUploads((prev) =>
          prev.map((upload) =>
            upload.fileId === fileId ? { ...upload, progress } : upload,
          ),
        );
      }

      // Simular possível falha baseada no provedor
      if (config.provider === "ftp-sftp" && Math.random() < 0.1) {
        throw new Error("Falha na conexão FTP");
      }

      // Salvar informações do arquivo
      await saveFileMetadata({
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        path: `${path}/${file.name}`,
        entityType,
        entityId,
        uploadedAt: new Date().toISOString(),
        uploadedBy: "Usuário Atual",
      });

      // Finalizar upload
      setUploads((prev) =>
        prev.map((upload) =>
          upload.fileId === fileId
            ? { ...upload, progress: 100, status: "success" }
            : upload,
        ),
      );

      // Log da ação
      logAuditAction({
        action: "UPLOAD",
        module: entityTypeToModule(entityType),
        entityType,
        entityId,
        fileName: file.name,
        fileSize: file.size,
        details: `Upload realizado com sucesso para ${path}`,
        riskLevel: "LOW",
      });

      toast.success(`📤 ${file.name} enviado com sucesso!`);
      return fileId;
    } catch (error: any) {
      // Marcar upload como erro
      setUploads((prev) =>
        prev.map((upload) =>
          upload.fileId === fileId
            ? { ...upload, status: "error", error: error.message }
            : upload,
        ),
      );

      // Log do erro
      logAuditAction({
        action: "UPLOAD",
        module: entityTypeToModule(entityType),
        entityType,
        entityId,
        fileName: file.name,
        fileSize: file.size,
        details: `Falha no upload: ${error.message}`,
        riskLevel: "MEDIUM",
        result: "FAILURE",
      });

      toast.error(`❌ Falha no upload de ${file.name}: ${error.message}`, {
        action: {
          label: "Reportar Erro",
          onClick: () => reportError(error, file, entityType, entityId),
        },
      });

      throw error;
    } finally {
      setIsUploading(false);
      // Remover progresso após 3 segundos
      setTimeout(() => {
        setUploads((prev) => prev.filter((upload) => upload.fileId !== fileId));
      }, 3000);
    }
  };

  const downloadFile = async (
    fileId: string,
    fileName: string,
  ): Promise<void> => {
    if (!config || !config.isActive) {
      throw new Error("Provedor de armazenamento não configurado");
    }

    try {
      // Simular download
      toast.loading(`📥 Baixando ${fileName}...`, { id: fileId });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simular falha ocasional
      if (Math.random() < 0.05) {
        throw new Error("Arquivo não encontrado no provedor");
      }

      // Log da ação
      logAuditAction({
        action: "DOWNLOAD",
        module: "ARMAZENAMENTO",
        entityType: "ARQUIVO",
        entityId: fileId,
        fileName,
        details: `Download realizado com sucesso`,
        riskLevel: "LOW",
      });

      toast.success(`✅ ${fileName} baixado com sucesso!`, { id: fileId });
    } catch (error: any) {
      logAuditAction({
        action: "DOWNLOAD",
        module: "ARMAZENAMENTO",
        entityType: "ARQUIVO",
        entityId: fileId,
        fileName,
        details: `Falha no download: ${error.message}`,
        riskLevel: "MEDIUM",
        result: "FAILURE",
      });

      toast.error(`❌ Falha no download: ${error.message}`, { id: fileId });
      throw error;
    }
  };

  const deleteFile = async (fileId: string): Promise<void> => {
    if (!config || !config.isActive) {
      throw new Error("Provedor de armazenamento não configurado");
    }

    try {
      // Simular exclusão
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Log da ação
      logAuditAction({
        action: "DELETE",
        module: "ARMAZENAMENTO",
        entityType: "ARQUIVO",
        entityId: fileId,
        details: `Arquivo excluído permanentemente`,
        riskLevel: "MEDIUM",
      });

      toast.success("🗑️ Arquivo excluído com sucesso!");
    } catch (error: any) {
      logAuditAction({
        action: "DELETE",
        module: "ARMAZENAMENTO",
        entityType: "ARQUIVO",
        entityId: fileId,
        details: `Falha na exclusão: ${error.message}`,
        riskLevel: "HIGH",
        result: "FAILURE",
      });

      toast.error(`❌ Falha na exclusão: ${error.message}`);
      throw error;
    }
  };

  const checkConnection = async (): Promise<boolean> => {
    if (!config) return false;

    try {
      // Simular teste de conexão
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simular falha baseada no provedor
      if (config.provider === "api-custom" && !config.config.baseUrl) {
        throw new Error("URL da API não configurada");
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  const handleFallback = async () => {
    const fallbackConfig: StorageConfig = {
      provider: "lawdesk-cloud",
      isActive: true,
      encryption: true,
      config: {
        region: "sa-east-1",
        storageClass: "standard",
      },
      connectionStatus: "connected",
    };

    setConfig(fallbackConfig);

    toast.warning("⚠️ Fallback automático para Lawdesk Cloud ativado", {
      description: "O provedor principal está indisponível",
      action: {
        label: "Reportar Erro",
        onClick: () => reportConnectionError(),
      },
    });

    logAuditAction({
      action: "CONFIG_CHANGE",
      module: "CONFIGURACOES",
      entityType: "STORAGE_CONFIG",
      entityId: "fallback_001",
      details: "Fallback automático ativado devido a falha de conexão",
      riskLevel: "HIGH",
    });
  };

  const clearUploads = () => {
    setUploads([]);
  };

  // Funções auxiliares
  const saveFileMetadata = async (fileData: any) => {
    const existingFiles = JSON.parse(
      localStorage.getItem("lawdesk-storage-files") || "[]",
    );
    existingFiles.push({
      ...fileData,
      extension: fileData.name.split(".").pop()?.toUpperCase() || "UNKNOWN",
      downloadCount: 0,
      isPublic: false,
    });
    localStorage.setItem(
      "lawdesk-storage-files",
      JSON.stringify(existingFiles),
    );
  };

  const logAuditAction = (logData: any) => {
    const existingLogs = JSON.parse(
      localStorage.getItem("lawdesk-audit-logs") || "[]",
    );
    const newLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: "Usuário Atual",
      userType: "ADVOGADO",
      ipAddress: "192.168.1.100",
      userAgent: navigator.userAgent,
      deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent)
        ? "MOBILE"
        : "DESKTOP",
      result: "SUCCESS",
      location: "São Paulo, SP",
      ...logData,
    };

    existingLogs.unshift(newLog);
    // Manter apenas os últimos 1000 logs
    if (existingLogs.length > 1000) {
      existingLogs.splice(1000);
    }

    localStorage.setItem("lawdesk-audit-logs", JSON.stringify(existingLogs));
  };

  const entityTypeToModule = (entityType: string) => {
    const mapping = {
      CLIENTE: "CRM",
      PROCESSO: "PROCESSOS",
      CONTRATO: "CONTRATOS",
      TICKET: "ATENDIMENTO",
      IA_ANALYSIS: "IA",
      AGENDA: "AGENDA",
      PUBLICACAO: "PUBLICACOES",
    };
    return mapping[entityType as keyof typeof mapping] || "OUTROS";
  };

  const reportError = (
    error: Error,
    file: File,
    entityType: string,
    entityId: string,
  ) => {
    const errorReport = {
      timestamp: new Date().toISOString(),
      error: error.message,
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
      context: {
        entityType,
        entityId,
        provider: config?.provider,
        userAgent: navigator.userAgent,
      },
    };

    console.error("Error Report:", errorReport);

    // Simular envio do relatório
    toast.info("📋 Relatório de erro enviado para análise");
  };

  const reportConnectionError = () => {
    const connectionReport = {
      timestamp: new Date().toISOString(),
      provider: config?.provider,
      config: config?.config,
      lastError: config?.errorDetails,
      userAgent: navigator.userAgent,
    };

    console.error("Connection Error Report:", connectionReport);
    toast.info("📋 Relatório de conexão enviado para suporte técnico");
  };

  const contextValue: StorageContextType = {
    config,
    uploads,
    isUploading,
    updateConfig,
    uploadFile,
    getUploadPath,
    downloadFile,
    deleteFile,
    checkConnection,
    clearUploads,
  };

  return (
    <StorageContext.Provider value={contextValue}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorageConfig() {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error("useStorageConfig must be used within a StorageProvider");
  }
  return context;
}

// Hook para uso específico em upload de arquivos
export function useFileUpload() {
  const { uploadFile, uploads, isUploading, clearUploads } = useStorageConfig();

  const uploadMultipleFiles = async (
    files: File[],
    entityType: string,
    entityId: string,
  ): Promise<string[]> => {
    const uploadPromises = files.map((file) => {
      const path = getUploadPath(entityType, entityId);
      return uploadFile(file, path, entityType, entityId);
    });

    try {
      const results = await Promise.allSettled(uploadPromises);
      const successful = results
        .filter(
          (result): result is PromiseFulfilledResult<string> =>
            result.status === "fulfilled",
        )
        .map((result) => result.value);

      const failed = results.filter(
        (result) => result.status === "rejected",
      ).length;

      if (failed > 0) {
        toast.warning(
          `⚠️ ${successful.length} arquivos enviados, ${failed} falharam`,
        );
      }

      return successful;
    } catch (error) {
      toast.error("❌ Erro no upload múltiplo");
      throw error;
    }
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    uploads,
    isUploading,
    clearUploads,
  };
}

// Função auxiliar externa
function getUploadPath(entityType: string, entityId: string): string {
  const paths = {
    CLIENTE: `clientes/${entityId}/documentos`,
    PROCESSO: `processos/${entityId}/anexos`,
    CONTRATO: `contratos/${entityId}/arquivos`,
    TICKET: `tickets/${entityId}/anexos`,
    IA_ANALYSIS: `ia-juridica/${entityId}`,
    AGENDA: `agenda/${entityId}`,
    PUBLICACAO: `publicacoes/${entityId}`,
    USUARIO: `usuarios/${entityId}`,
  };

  return (
    paths[entityType as keyof typeof paths] ||
    `outros/${entityType}/${entityId}`
  );
}
