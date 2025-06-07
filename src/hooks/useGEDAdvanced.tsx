import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { TreeNode } from "@/components/GED/TreeView";
import { FileItem } from "@/components/GED/FileContextMenu";
import { BreadcrumbSegment } from "@/components/GED/DynamicBreadcrumb";

export interface GEDStats {
  totalFiles: number;
  totalSize: number;
  favoriteFiles: number;
  clientVisibleFiles: number;
  folderCount: number;
  recentUploads: number;
}

export interface NavigationHistory {
  path: string[];
  timestamp: Date;
}

export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: "uploading" | "completed" | "error";
}

interface UseGEDAdvancedReturn {
  // Tree Structure
  treeData: TreeNode[];
  currentPath: string[];
  currentNode: TreeNode | null;

  // Files
  currentFiles: FileItem[];
  selectedFiles: string[];
  viewMode: "grid" | "list";

  // Navigation
  breadcrumbs: BreadcrumbSegment[];
  navigationHistory: NavigationHistory[];
  canGoBack: boolean;
  canGoForward: boolean;

  // Statistics
  stats: GEDStats;

  // Upload
  uploadProgress: UploadProgress[];
  isUploading: boolean;

  // Loading States
  loading: boolean;
  error: string | null;

  // Actions
  navigateToPath: (path: string[], node?: TreeNode) => void;
  goBack: () => void;
  goForward: () => void;
  setViewMode: (mode: "grid" | "list") => void;

  // File Operations
  selectFile: (fileId: string, selected: boolean) => void;
  selectAllFiles: (selected: boolean) => void;
  clearSelection: () => void;
  previewFile: (file: FileItem) => void;
  downloadFile: (file: FileItem) => void;
  downloadMultiple: (fileIds: string[]) => void;
  editFile: (file: FileItem, updates: Partial<FileItem>) => void;
  deleteFile: (file: FileItem) => void;
  deleteMultiple: (fileIds: string[]) => void;
  toggleFavorite: (file: FileItem) => void;
  shareFile: (file: FileItem, method: string) => void;
  sendToAI: (file: FileItem | string[], action: string) => void;
  associateFile: (file: FileItem, type: string, id: string) => void;

  // Folder Operations
  createFolder: (
    parentId: string,
    name: string,
    type: TreeNode["type"],
  ) => void;
  renameNode: (nodeId: string, newName: string) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  moveNode: (nodeId: string, targetParentId: string) => void;
  moveFiles: (fileIds: string[], targetFolderId: string) => void;

  // Upload Operations
  uploadFiles: (files: File[], folderId: string) => void;
  cancelUpload: (fileId: string) => void;
  retryUpload: (fileId: string) => void;

  // Bulk Operations
  toggleFileVisibility: (fileIds: string[], visible: boolean) => void;

  // Refresh
  refreshData: () => void;
}

const STORAGE_KEYS = {
  TREE_DATA: "lawdesk_ged_tree",
  FILES_DATA: "lawdesk_ged_files",
  VIEW_MODE: "lawdesk_ged_view_mode",
  NAVIGATION_HISTORY: "lawdesk_ged_nav_history",
};

export function useGEDAdvanced(): UseGEDAdvancedReturn {
  // State
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>(["root"]);
  const [currentFiles, setCurrentFiles] = useState<FileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [navigationHistory, setNavigationHistory] = useState<
    NavigationHistory[]
  >([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize data
  useEffect(() => {
    initializeData();
    loadViewMode();
    loadNavigationHistory();
  }, []);

  const initializeData = useCallback(() => {
    try {
      setLoading(true);

      // Load or create initial tree structure
      const savedTree = localStorage.getItem(STORAGE_KEYS.TREE_DATA);
      if (savedTree) {
        setTreeData(JSON.parse(savedTree));
      } else {
        const initialTree = createInitialTreeStructure();
        setTreeData(initialTree);
        localStorage.setItem(
          STORAGE_KEYS.TREE_DATA,
          JSON.stringify(initialTree),
        );
      }

      // Load files
      const savedFiles = localStorage.getItem(STORAGE_KEYS.FILES_DATA);
      if (savedFiles) {
        setCurrentFiles(JSON.parse(savedFiles));
      } else {
        const initialFiles = createInitialFiles();
        setCurrentFiles(initialFiles);
        localStorage.setItem(
          STORAGE_KEYS.FILES_DATA,
          JSON.stringify(initialFiles),
        );
      }

      setError(null);
    } catch (err) {
      setError("Erro ao carregar dados do GED");
      console.error("Error initializing GED data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createInitialTreeStructure = (): TreeNode[] => {
    return [
      {
        id: "root",
        name: "Todos os Documentos",
        type: "root",
        isExpanded: true,
        fileCount: 0,
        children: [
          {
            id: "clients",
            name: "Clientes",
            type: "folder",
            parentId: "root",
            fileCount: 0,
            children: [
              {
                id: "client_001",
                name: "João Silva & Associados",
                type: "client",
                parentId: "clients",
                fileCount: 3,
                metadata: { clientId: "client_001" },
                children: [
                  {
                    id: "client_001_contracts",
                    name: "Contratos",
                    type: "folder",
                    parentId: "client_001",
                    fileCount: 2,
                  },
                  {
                    id: "client_001_documents",
                    name: "Comprovantes",
                    type: "folder",
                    parentId: "client_001",
                    fileCount: 1,
                  },
                ],
              },
              {
                id: "client_002",
                name: "Maria Santos",
                type: "client",
                parentId: "clients",
                fileCount: 1,
                metadata: { clientId: "client_002" },
                children: [
                  {
                    id: "client_002_powers",
                    name: "Procurações",
                    type: "folder",
                    parentId: "client_002",
                    fileCount: 1,
                  },
                ],
              },
            ],
          },
          {
            id: "processes",
            name: "Processos",
            type: "folder",
            parentId: "root",
            fileCount: 2,
            children: [
              {
                id: "process_001",
                name: "0001234-56.2024.8.26.0001",
                type: "process",
                parentId: "processes",
                fileCount: 2,
                metadata: { processNumber: "0001234-56.2024.8.26.0001" },
              },
            ],
          },
          {
            id: "templates",
            name: "Modelos",
            type: "folder",
            parentId: "root",
            fileCount: 0,
            children: [
              {
                id: "templates_contracts",
                name: "Contratos",
                type: "folder",
                parentId: "templates",
                fileCount: 0,
              },
              {
                id: "templates_petitions",
                name: "Petições",
                type: "folder",
                parentId: "templates",
                fileCount: 0,
              },
            ],
          },
        ],
      },
    ];
  };

  const createInitialFiles = (): FileItem[] => {
    return [
      {
        id: "file_001",
        name: "Contrato_Prestacao_Servicos_Silva.pdf",
        type: "application/pdf",
        size: 2048576,
        clientVisible: true,
        isFavorite: false,
        tags: ["contrato", "prestação de serviços", "2025"],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        uploadedBy: "Advogado Silva",
        associatedWith: {
          type: "client",
          id: "client_001",
          name: "João Silva & Associados",
        },
      },
      {
        id: "file_002",
        name: "Inicial_Acao_Indenizacao.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 512000,
        clientVisible: false,
        isFavorite: true,
        tags: ["petição inicial", "indenização", "urgente"],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        uploadedBy: "Advogado Silva",
        associatedWith: {
          type: "process",
          id: "process_001",
          name: "0001234-56.2024.8.26.0001",
        },
      },
      {
        id: "file_003",
        name: "Comprovante_Pagamento_2025.jpg",
        type: "image/jpeg",
        size: 1024000,
        clientVisible: true,
        isFavorite: false,
        tags: ["comprovante", "pagamento"],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        uploadedBy: "Cliente Portal",
        associatedWith: {
          type: "client",
          id: "client_001",
          name: "João Silva & Associados",
        },
      },
    ];
  };

  const loadViewMode = () => {
    const savedViewMode = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
    if (savedViewMode === "list" || savedViewMode === "grid") {
      setViewMode(savedViewMode);
    }
  };

  const loadNavigationHistory = () => {
    const savedHistory = localStorage.getItem(STORAGE_KEYS.NAVIGATION_HISTORY);
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        setNavigationHistory(history);
        setCurrentHistoryIndex(history.length - 1);
      } catch (err) {
        console.error("Error loading navigation history:", err);
      }
    }
  };

  // Computed values
  const currentNode = useMemo(() => {
    const findNode = (nodes: TreeNode[], path: string[]): TreeNode | null => {
      if (path.length === 0) return null;

      for (const node of nodes) {
        if (node.id === path[0]) {
          if (path.length === 1) return node;
          if (node.children) {
            return findNode(node.children, path.slice(1));
          }
        }
      }
      return null;
    };

    return findNode(treeData, currentPath);
  }, [treeData, currentPath]);

  const breadcrumbs = useMemo((): BreadcrumbSegment[] => {
    const segments: BreadcrumbSegment[] = [];
    let currentNodes = treeData;
    let currentSegmentPath: string[] = [];

    for (const pathSegment of currentPath) {
      const node = currentNodes.find((n) => n.id === pathSegment);
      if (node) {
        currentSegmentPath.push(pathSegment);
        segments.push({
          id: node.id,
          name: node.name,
          type: node.type,
          path: [...currentSegmentPath],
        });
        currentNodes = node.children || [];
      }
    }

    return segments;
  }, [treeData, currentPath]);

  const stats = useMemo((): GEDStats => {
    const calculateStats = (
      nodes: TreeNode[],
    ): { files: number; folders: number } => {
      let files = 0;
      let folders = 0;

      for (const node of nodes) {
        folders++;
        files += node.fileCount || 0;
        if (node.children) {
          const childStats = calculateStats(node.children);
          files += childStats.files;
          folders += childStats.folders;
        }
      }

      return { files, folders };
    };

    const treeStats = calculateStats(treeData);
    const totalSize = currentFiles.reduce((sum, file) => sum + file.size, 0);
    const favoriteFiles = currentFiles.filter((f) => f.isFavorite).length;
    const clientVisibleFiles = currentFiles.filter(
      (f) => f.clientVisible,
    ).length;
    const recentUploads = currentFiles.filter((f) => {
      const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
      return new Date(f.createdAt).getTime() > dayAgo;
    }).length;

    return {
      totalFiles: currentFiles.length,
      totalSize,
      favoriteFiles,
      clientVisibleFiles,
      folderCount: treeStats.folders,
      recentUploads,
    };
  }, [treeData, currentFiles]);

  const canGoBack = currentHistoryIndex > 0;
  const canGoForward = currentHistoryIndex < navigationHistory.length - 1;
  const isUploading = uploadProgress.some((p) => p.status === "uploading");

  // Navigation actions
  const navigateToPath = useCallback(
    (path: string[], node?: TreeNode) => {
      setCurrentPath(path);

      // Add to navigation history
      const newEntry: NavigationHistory = {
        path: [...path],
        timestamp: new Date(),
      };

      setNavigationHistory((prev) => {
        const newHistory = [
          ...prev.slice(0, currentHistoryIndex + 1),
          newEntry,
        ];
        localStorage.setItem(
          STORAGE_KEYS.NAVIGATION_HISTORY,
          JSON.stringify(newHistory),
        );
        return newHistory;
      });

      setCurrentHistoryIndex((prev) => prev + 1);
      setSelectedFiles([]);
    },
    [currentHistoryIndex],
  );

  const goBack = useCallback(() => {
    if (canGoBack) {
      const newIndex = currentHistoryIndex - 1;
      const targetHistory = navigationHistory[newIndex];
      setCurrentPath(targetHistory.path);
      setCurrentHistoryIndex(newIndex);
      setSelectedFiles([]);
    }
  }, [canGoBack, currentHistoryIndex, navigationHistory]);

  const goForward = useCallback(() => {
    if (canGoForward) {
      const newIndex = currentHistoryIndex + 1;
      const targetHistory = navigationHistory[newIndex];
      setCurrentPath(targetHistory.path);
      setCurrentHistoryIndex(newIndex);
      setSelectedFiles([]);
    }
  }, [canGoForward, currentHistoryIndex, navigationHistory]);

  // File operations
  const selectFile = useCallback((fileId: string, selected: boolean) => {
    setSelectedFiles((prev) => {
      if (selected) {
        return prev.includes(fileId) ? prev : [...prev, fileId];
      } else {
        return prev.filter((id) => id !== fileId);
      }
    });
  }, []);

  const selectAllFiles = useCallback(
    (selected: boolean) => {
      if (selected) {
        setSelectedFiles(currentFiles.map((f) => f.id));
      } else {
        setSelectedFiles([]);
      }
    },
    [currentFiles],
  );

  const clearSelection = useCallback(() => {
    setSelectedFiles([]);
  }, []);

  const previewFile = useCallback((file: FileItem) => {
    // Implementar preview baseado no tipo do arquivo
    toast.info(`Abrindo preview de ${file.name}`);
  }, []);

  const downloadFile = useCallback((file: FileItem) => {
    // Simular download
    const link = document.createElement("a");
    link.href = "#"; // Em produção, seria a URL real do arquivo
    link.download = file.name;
    link.click();
    toast.success(`Download iniciado: ${file.name}`);
  }, []);

  const editFile = useCallback((file: FileItem, updates: Partial<FileItem>) => {
    setCurrentFiles((prev) => {
      const updated = prev.map((f) =>
        f.id === file.id ? { ...f, ...updates } : f,
      );
      localStorage.setItem(STORAGE_KEYS.FILES_DATA, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteFile = useCallback((file: FileItem) => {
    setCurrentFiles((prev) => {
      const updated = prev.filter((f) => f.id !== file.id);
      localStorage.setItem(STORAGE_KEYS.FILES_DATA, JSON.stringify(updated));
      return updated;
    });
    setSelectedFiles((prev) => prev.filter((id) => id !== file.id));
    toast.success(`Arquivo ${file.name} movido para a lixeira`);
  }, []);

  const toggleFavorite = useCallback(
    (file: FileItem) => {
      editFile(file, { isFavorite: !file.isFavorite });
      toast.success(
        file.isFavorite
          ? `${file.name} removido dos favoritos`
          : `${file.name} adicionado aos favoritos`,
      );
    },
    [editFile],
  );

  // Folder operations
  const createFolder = useCallback(
    (parentId: string, name: string, type: TreeNode["type"]) => {
      const newFolder: TreeNode = {
        id: `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        type,
        parentId,
        fileCount: 0,
        createdAt: new Date().toISOString(),
      };

      setTreeData((prev) => {
        const addToParent = (nodes: TreeNode[]): TreeNode[] => {
          return nodes.map((node) => {
            if (node.id === parentId) {
              return {
                ...node,
                children: [...(node.children || []), newFolder],
              };
            }
            if (node.children) {
              return {
                ...node,
                children: addToParent(node.children),
              };
            }
            return node;
          });
        };

        const updated = addToParent(prev);
        localStorage.setItem(STORAGE_KEYS.TREE_DATA, JSON.stringify(updated));
        return updated;
      });
    },
    [],
  );

  const renameNode = useCallback((nodeId: string, newName: string) => {
    setTreeData((prev) => {
      const updateNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map((node) => {
          if (node.id === nodeId) {
            return { ...node, name: newName };
          }
          if (node.children) {
            return { ...node, children: updateNode(node.children) };
          }
          return node;
        });
      };

      const updated = updateNode(prev);
      localStorage.setItem(STORAGE_KEYS.TREE_DATA, JSON.stringify(updated));
      return updated;
    });
    toast.success("Pasta renomeada com sucesso!");
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setTreeData((prev) => {
      const removeNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.filter((node) => {
          if (node.id === nodeId) return false;
          if (node.children) {
            node.children = removeNode(node.children);
          }
          return true;
        });
      };

      const updated = removeNode(prev);
      localStorage.setItem(STORAGE_KEYS.TREE_DATA, JSON.stringify(updated));
      return updated;
    });
    toast.success("Pasta excluída com sucesso!");
  }, []);

  // Upload operations
  const uploadFiles = useCallback((files: File[], folderId: string) => {
    files.forEach((file) => {
      const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Add to upload progress
      setUploadProgress((prev) => [
        ...prev,
        {
          fileId: uploadId,
          fileName: file.name,
          progress: 0,
          status: "uploading",
        },
      ]);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) =>
          prev.map((upload) => {
            if (upload.fileId === uploadId) {
              const newProgress = Math.min(
                upload.progress + Math.random() * 20,
                100,
              );

              if (newProgress >= 100) {
                clearInterval(interval);

                // Add file to current files
                const newFile: FileItem = {
                  id: uploadId,
                  name: file.name,
                  type: file.type,
                  size: file.size,
                  clientVisible: false,
                  isFavorite: false,
                  tags: [],
                  createdAt: new Date().toISOString(),
                  uploadedBy: "Usuário Atual",
                };

                setCurrentFiles((prev) => {
                  const updated = [...prev, newFile];
                  localStorage.setItem(
                    STORAGE_KEYS.FILES_DATA,
                    JSON.stringify(updated),
                  );
                  return updated;
                });

                return {
                  ...upload,
                  progress: 100,
                  status: "completed" as const,
                };
              }

              return { ...upload, progress: newProgress };
            }
            return upload;
          }),
        );
      }, 200);
    });
  }, []);

  // Bulk operations
  const deleteMultiple = useCallback((fileIds: string[]) => {
    setCurrentFiles((prev) => {
      const updated = prev.filter((f) => !fileIds.includes(f.id));
      localStorage.setItem(STORAGE_KEYS.FILES_DATA, JSON.stringify(updated));
      return updated;
    });
    setSelectedFiles([]);
    toast.success(`${fileIds.length} arquivo(s) movido(s) para a lixeira`);
  }, []);

  const toggleFileVisibility = useCallback(
    (fileIds: string[], visible: boolean) => {
      setCurrentFiles((prev) => {
        const updated = prev.map((f) =>
          fileIds.includes(f.id) ? { ...f, clientVisible: visible } : f,
        );
        localStorage.setItem(STORAGE_KEYS.FILES_DATA, JSON.stringify(updated));
        return updated;
      });
    },
    [],
  );

  const moveFiles = useCallback((fileIds: string[], targetFolderId: string) => {
    // Em produção, mover arquivos para a pasta de destino
    toast.success(`${fileIds.length} arquivo(s) movido(s) com sucesso`);
  }, []);

  // Other operations
  const shareFile = useCallback((file: FileItem, method: string) => {
    toast.info(`Compartilhando ${file.name} via ${method}`);
  }, []);

  const sendToAI = useCallback(
    (fileOrIds: FileItem | string[], action: string) => {
      if (Array.isArray(fileOrIds)) {
        toast.info(
          `Enviando ${fileOrIds.length} arquivo(s) para IA: ${action}`,
        );
      } else {
        toast.info(`Enviando ${fileOrIds.name} para IA: ${action}`);
      }
    },
    [],
  );

  const associateFile = useCallback(
    (file: FileItem, type: string, id: string) => {
      editFile(file, {
        associatedWith: { type: type as any, id, name: `${type} ${id}` },
      });
    },
    [editFile],
  );

  const refreshData = useCallback(() => {
    initializeData();
  }, [initializeData]);

  // Save view mode when changed
  const updateViewMode = useCallback((mode: "grid" | "list") => {
    setViewMode(mode);
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode);
  }, []);

  // Cleanup upload progress
  useEffect(() => {
    const cleanup = () => {
      setUploadProgress((prev) => prev.filter((p) => p.status === "uploading"));
    };

    const interval = setInterval(cleanup, 30000); // Clean every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return {
    // Tree Structure
    treeData,
    currentPath,
    currentNode,

    // Files
    currentFiles,
    selectedFiles,
    viewMode,

    // Navigation
    breadcrumbs,
    navigationHistory,
    canGoBack,
    canGoForward,

    // Statistics
    stats,

    // Upload
    uploadProgress,
    isUploading,

    // Loading States
    loading,
    error,

    // Actions
    navigateToPath,
    goBack,
    goForward,
    setViewMode: updateViewMode,

    // File Operations
    selectFile,
    selectAllFiles,
    clearSelection,
    previewFile,
    downloadFile,
    downloadMultiple: deleteMultiple, // Placeholder
    editFile,
    deleteFile,
    deleteMultiple,
    toggleFavorite,
    shareFile,
    sendToAI,
    associateFile,

    // Folder Operations
    createFolder,
    renameNode,
    deleteNode,
    duplicateNode: () => {}, // Placeholder
    moveNode: () => {}, // Placeholder
    moveFiles,

    // Upload Operations
    uploadFiles,
    cancelUpload: () => {}, // Placeholder
    retryUpload: () => {}, // Placeholder

    // Bulk Operations
    toggleFileVisibility,

    // Refresh
    refreshData,
  };
}
