import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen,
  Grid3X3,
  List,
  Search,
  Filter,
  Upload,
  Plus,
  RefreshCw,
  Settings,
  Star,
  Eye,
  Users,
  Brain,
  Menu,
  X,
  BarChart3,
  Download,
  ChevronLeft,
  ChevronRight,
  Archive,
  FileText,
  AlertTriangle,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  Zap,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Import GED components
import { TreeView } from "@/components/GED/TreeView";
import { DropzoneUpload } from "@/components/GED/DropzoneUpload";
import { BulkActions } from "@/components/GED/BulkActions";
import { FileViewer } from "@/components/GED/FileViewer";
import { DynamicBreadcrumb } from "@/components/GED/DynamicBreadcrumb";
import { FileContextMenu } from "@/components/GED/FileContextMenu";
import { FilePreview } from "@/components/GED/FilePreview";
import { GEDPermissions } from "@/components/GED/GEDPermissions";
import { GEDStats } from "@/components/GED/GEDStats";
import { GEDSmartDashboard } from "@/components/GED/GEDSmartDashboard";
import { GEDFolderTemplates } from "@/components/GED/GEDFolderTemplates";
import { GEDAIIntegration } from "@/components/GED/GEDAIIntegration";
import { GEDWatchdog } from "@/components/GED/GEDWatchdog";
import { GEDFloatingButton } from "@/components/GED/GEDFloatingButton";

// Import hooks
import { useGEDAdvanced } from "@/hooks/useGEDAdvanced";
import { useGEDCRMIntegration } from "@/hooks/useGEDCRMIntegration";
import { useModuleIntegration } from "@/hooks/useModuleIntegration";

interface ViewMode {
  id: "grid" | "list";
  name: string;
  icon: any;
}

interface FilterOptions {
  type: string;
  visibility: string;
  dateRange: string;
  client: string;
  tags: string[];
}

export default function GEDJuridico() {
  // Core GED state
  const {
    treeData,
    currentPath,
    currentNode,
    currentFiles,
    selectedFiles,
    breadcrumbs,
    navigationHistory,
    viewMode,
    searchQuery,
    filterOptions,
    navigateToPath,
    createFolder,
    uploadFiles,
    selectFile,
    selectMultipleFiles,
    clearSelection,
    setViewMode,
    setSearchQuery,
    setFilterOptions,
    deleteFiles,
    toggleFavorite,
    toggleClientVisible,
    moveFiles,
    downloadZip,
    refreshData,
  } = useGEDAdvanced();

  // CRM Integration
  const {
    clients,
    processes,
    contracts,
    folderTemplates,
    createEntityFolder,
    syncCRMEntities,
    validateFolderStructure,
    loading: crmLoading,
    syncing: crmSyncing,
  } = useGEDCRMIntegration();

  // Module Integration
  const { executeAction } = useModuleIntegration();

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("files");
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuFile, setContextMenuFile] = useState<any>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [watchdogOpen, setWatchdogOpen] = useState(false);

  // Advanced filters and search
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [smartSearchActive, setSmartSearchActive] = useState(false);

  const viewModes: ViewMode[] = [
    { id: "grid", name: "Grade", icon: Grid3X3 },
    { id: "list", name: "Lista", icon: List },
  ];

  // Navigation handlers
  const handleNavigateBack = () => {
    if (navigationHistory.length > 1) {
      const previousPath = navigationHistory[navigationHistory.length - 2];
      navigateToPath(previousPath.path);
    }
  };

  const handleNavigateForward = () => {
    // Implementation would require forward history tracking
    toast.info("Funcionalidade de navegação para frente em desenvolvimento");
  };

  // File operations
  const handleFileSelect = (fileId: string, event?: React.MouseEvent) => {
    if (event?.ctrlKey || event?.metaKey) {
      selectMultipleFiles([fileId]);
    } else if (event?.shiftKey && selectedFiles.length > 0) {
      // Implement shift-click selection
      const lastSelectedIndex = currentFiles.findIndex(
        (f) => f.id === selectedFiles[selectedFiles.length - 1],
      );
      const currentIndex = currentFiles.findIndex((f) => f.id === fileId);
      const start = Math.min(lastSelectedIndex, currentIndex);
      const end = Math.max(lastSelectedIndex, currentIndex);
      const filesToSelect = currentFiles.slice(start, end + 1).map((f) => f.id);
      selectMultipleFiles(filesToSelect);
    } else {
      selectFile(fileId);
    }
  };

  const handleFileContextMenu = (file: any, event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenuFile(file);
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setContextMenuOpen(true);
  };

  const handleFilePreview = (file: any) => {
    setPreviewFile(file);
  };

  const handleUpload = async (files: File[]) => {
    if (!currentNode) {
      toast.error("Selecione uma pasta de destino");
      return;
    }

    const uploadPromises = files.map(async (file, index) => {
      const fileId = `upload_${Date.now()}_${index}`;
      setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
        }

        await uploadFiles([file], currentNode.id);

        // Clean up progress
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });

        toast.success(`${file.name} enviado com sucesso`);
      } catch (error) {
        console.error("Erro no upload:", error);
        toast.error(`Erro ao enviar ${file.name}`);
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
      }
    });

    await Promise.all(uploadPromises);
    refreshData();
  };

  const handleCreateFolder = async (name: string, type: string) => {
    if (!currentNode) {
      toast.error("Selecione uma pasta pai");
      return;
    }

    try {
      // Ensure type is one of the valid values
      const validType = [
        "folder",
        "client",
        "process",
        "contract",
        "template",
      ].includes(type)
        ? type
        : "folder";

      await createFolder(currentNode.id, name, validType as any);
      refreshData();
    } catch (error) {
      console.error("Erro ao criar pasta:", error);
      toast.error("Erro ao criar pasta");
    }
  };

  const handleCreateDocument = async (name: string, template: string) => {
    toast.info("Criação de documentos será implementada em breve");
  };

  const handleSyncDrive = async () => {
    try {
      await syncCRMEntities();
    } catch (error) {
      console.error("Erro na sincronização:", error);
      toast.error("Erro na sincronização");
    }
  };

  // AI Integration handlers
  const handleStartAIChat = (documentId: string, documentName: string) => {
    executeAction({
      type: "START_AI_CHAT",
      module: "IA",
      data: {
        type: "DOCUMENT_ANALYSIS",
        context: { documentId, documentName },
        initialMessage: `Olá! Vou ajudá-lo com a análise do documento "${documentName}". O que você gostaria de saber?`,
      },
      source: "GED_JURIDICO",
    });
  };

  // Filter helpers
  const filteredFiles = useMemo(() => {
    if (!currentFiles || !Array.isArray(currentFiles)) {
      return [];
    }

    return currentFiles.filter((file) => {
      if (!file) return false;

      // Search filter
      if (
        searchQuery &&
        file.name &&
        !file.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Type filter
      if (filterOptions?.type && filterOptions.type !== "all") {
        const fileExtension = file.name?.split(".").pop()?.toLowerCase();
        if (filterOptions.type !== fileExtension) {
          return false;
        }
      }

      // Visibility filter
      if (filterOptions?.visibility && filterOptions.visibility !== "all") {
        if (filterOptions.visibility === "client" && !file.clientVisible) {
          return false;
        }
        if (filterOptions.visibility === "internal" && file.clientVisible) {
          return false;
        }
      }

      return true;
    });
  }, [currentFiles, searchQuery, filterOptions]);

  // Statistics
  const stats = useMemo(() => {
    const safeCurrentFiles = currentFiles || [];
    const safeSelectedFiles = selectedFiles || [];

    return {
      totalFiles: safeCurrentFiles.length,
      selectedCount: safeSelectedFiles.length,
      clientVisible: safeCurrentFiles.filter((f) => f?.clientVisible).length,
      favorites: safeCurrentFiles.filter((f) => f?.isFavorite).length,
      totalSize: safeCurrentFiles.reduce((sum, f) => sum + (f?.size || 0), 0),
    };
  }, [currentFiles, selectedFiles]);

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col border-r bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center space-x-2">
              <FolderOpen className="h-5 w-5" />
              <span>GED Jurídico</span>
            </h2>
            <Badge variant="secondary">v2.2.0</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Gestão Eletrônica de Documentos
          </p>
        </div>

        <div className="flex-1 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col"
          >
            <div className="px-4 pt-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="files" className="text-xs">
                  <FolderOpen className="h-3 w-3 mr-1" />
                  Arquivos
                </TabsTrigger>
                <TabsTrigger value="ai" className="text-xs">
                  <Brain className="h-3 w-3 mr-1" />
                  IA
                </TabsTrigger>
                <TabsTrigger value="stats" className="text-xs">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Stats
                </TabsTrigger>
                <TabsTrigger value="tools" className="text-xs">
                  <Settings className="h-3 w-3 mr-1" />
                  Tools
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="files" className="h-full m-0 p-4">
                <div className="h-full flex flex-col space-y-4">
                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTemplatesOpen(true)}
                      className="text-xs"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Templates
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSyncDrive}
                      disabled={crmSyncing}
                      className="text-xs"
                    >
                      {crmSyncing ? (
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3 w-3 mr-1" />
                      )}
                      Sync
                    </Button>
                  </div>

                  {/* Watchdog Status */}
                  <GEDWatchdog compact className="mb-4" />

                  {/* Tree View */}
                  <div className="flex-1 overflow-auto">
                    <TreeView
                      data={treeData}
                      selectedPath={currentPath}
                      onSelectPath={navigateToPath}
                      onCreateFolder={handleCreateFolder}
                      onRenameNode={() => {}}
                      onDeleteNode={() => {}}
                      onDuplicateNode={() => {}}
                      onMoveNode={() => {}}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai" className="h-full m-0 p-4">
                <div className="h-full overflow-auto">
                  <GEDAIIntegration
                    selectedFiles={
                      (selectedFiles || [])
                        .map((id) => currentFiles?.find((f) => f?.id === id))
                        .filter(Boolean) as any[]
                    }
                    onStartChat={handleStartAIChat}
                  />
                </div>
              </TabsContent>

              <TabsContent value="stats" className="h-full m-0 p-4">
                <div className="h-full overflow-auto">
                  <GEDSmartDashboard />
                </div>
              </TabsContent>

              <TabsContent value="tools" className="h-full m-0 p-4">
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPermissionsOpen(true)}
                    className="w-full justify-start text-xs"
                  >
                    <Users className="h-3 w-3 mr-2" />
                    Permissões
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setWatchdogOpen(true)}
                    className="w-full justify-start text-xs"
                  >
                    <Shield className="h-3 w-3 mr-2" />
                    Watchdog
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSettingsOpen(true)}
                    className="w-full justify-start text-xs"
                  >
                    <Settings className="h-3 w-3 mr-2" />
                    Configurações
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5" />
              <span>GED Jurídico</span>
            </SheetTitle>
            <SheetDescription>Gestão Eletrônica de Documentos</SheetDescription>
          </SheetHeader>
          <div className="h-full overflow-auto p-4">
            <TreeView
              data={treeData}
              selectedPath={currentPath}
              onSelectPath={(path) => {
                navigateToPath(path);
                setSidebarOpen(false);
              }}
              onCreateFolder={handleCreateFolder}
              onRenameNode={() => {}}
              onDeleteNode={() => {}}
              onDuplicateNode={() => {}}
              onMoveNode={() => {}}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Navigation */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNavigateBack}
                  disabled={navigationHistory.length <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNavigateForward}
                  disabled={true}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Breadcrumbs */}
              <DynamicBreadcrumb
                segments={breadcrumbs}
                onNavigate={navigateToPath}
                fileCount={currentFiles.length}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* View Mode Toggle */}
              <div className="flex border rounded-lg p-1">
                {viewModes.map((mode) => (
                  <Button
                    key={mode.id}
                    variant={viewMode === mode.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode(mode.id)}
                    className="px-2"
                  >
                    <mode.icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>

              {/* Refresh */}
              <Button variant="ghost" size="sm" onClick={refreshData}>
                <RefreshCw className="h-4 w-4" />
              </Button>

              {/* Settings */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar documentos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAdvancedFiltersOpen(true)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>{stats.totalFiles} arquivo(s)</span>
              {stats.selectedCount > 0 && (
                <span className="text-primary font-medium">
                  {stats.selectedCount} selecionado(s)
                </span>
              )}
              <span>{stats.clientVisible} visível ao cliente</span>
            </div>
            <div className="flex items-center space-x-2">
              {stats.favorites > 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span>{stats.favorites}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {/* Upload Zone */}
          {currentNode && (
            <DropzoneUpload
              onDrop={handleUpload}
              currentFolder={currentNode.name}
              uploadProgress={uploadProgress}
            />
          )}

          {/* Bulk Actions */}
          {selectedFiles.length > 0 && (
            <div className="border-b bg-muted/30 px-4 py-2">
              <BulkActions
                selectedFiles={selectedFiles}
                onClearSelection={clearSelection}
                onDelete={() => deleteFiles(selectedFiles)}
                onDownloadZip={() => downloadZip(selectedFiles)}
                onToggleClientVisible={() => {
                  selectedFiles.forEach((fileId) =>
                    toggleClientVisible(fileId),
                  );
                }}
                onToggleFavorite={() => {
                  selectedFiles.forEach((fileId) => toggleFavorite(fileId));
                }}
                onMove={(targetFolderId) =>
                  moveFiles(selectedFiles, targetFolderId)
                }
                currentFolderId={currentNode?.id || ""}
                treeData={treeData}
              />
            </div>
          )}

          {/* File Viewer */}
          <div className="flex-1 overflow-auto p-4">
            <FileViewer
              files={filteredFiles}
              selectedFiles={selectedFiles}
              viewMode={viewMode}
              onFileSelect={handleFileSelect}
              onFilePreview={handleFilePreview}
              onContextMenu={handleFileContextMenu}
            />
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <GEDFloatingButton
        onUpload={handleUpload}
        onCreateFolder={handleCreateFolder}
        onCreateDocument={handleCreateDocument}
        onSyncDrive={handleSyncDrive}
      />

      {/* Dialogs */}

      {/* File Context Menu */}
      {contextMenuOpen && contextMenuFile && (
        <FileContextMenu
          file={contextMenuFile}
          position={contextMenuPosition}
          open={contextMenuOpen}
          onClose={() => setContextMenuOpen(false)}
          onPreview={() => handleFilePreview(contextMenuFile)}
          onEdit={() => {}}
          onDelete={() => deleteFiles([contextMenuFile.id])}
          onShare={() => {}}
          onDownload={() => {}}
          onToggleFavorite={() => toggleFavorite(contextMenuFile.id)}
          onToggleClientVisible={() => toggleClientVisible(contextMenuFile.id)}
          onMove={() => {}}
        />
      )}

      {/* File Preview */}
      {previewFile && (
        <FilePreview
          file={previewFile}
          open={!!previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}

      {/* Permissions Dialog */}
      <Dialog open={permissionsOpen} onOpenChange={setPermissionsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Permissões do GED</DialogTitle>
            <DialogDescription>
              Gerencie permissões de acesso a documentos e pastas
            </DialogDescription>
          </DialogHeader>
          <GEDPermissions />
        </DialogContent>
      </Dialog>

      {/* Templates Dialog */}
      <Dialog open={templatesOpen} onOpenChange={setTemplatesOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Templates de Pastas</DialogTitle>
            <DialogDescription>
              Gerencie templates para criação automática de estruturas
            </DialogDescription>
          </DialogHeader>
          <GEDFolderTemplates
            onApplyTemplate={(templateId, entityId) => {
              toast.success("Template aplicado com sucesso");
              setTemplatesOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Watchdog Dialog */}
      <Dialog open={watchdogOpen} onOpenChange={setWatchdogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Watchdog do Sistema</DialogTitle>
            <DialogDescription>
              Monitoramento e validação contínua do GED
            </DialogDescription>
          </DialogHeader>
          <GEDWatchdog />
        </DialogContent>
      </Dialog>

      {/* Advanced Filters Dialog */}
      <Dialog open={advancedFiltersOpen} onOpenChange={setAdvancedFiltersOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtros Avançados</DialogTitle>
            <DialogDescription>
              Configure filtros detalhados para busca
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Arquivo</Label>
                <Select
                  value={filterOptions?.type || "all"}
                  onValueChange={(value) =>
                    setFilterOptions({ ...(filterOptions || {}), type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="doc">Word</SelectItem>
                    <SelectItem value="docx">Word (Novo)</SelectItem>
                    <SelectItem value="jpg">Imagem</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Visibilidade</Label>
                <Select
                  value={filterOptions?.visibility || "all"}
                  onValueChange={(value) =>
                    setFilterOptions({
                      ...(filterOptions || {}),
                      visibility: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="client">Visível ao Cliente</SelectItem>
                    <SelectItem value="internal">Apenas Interno</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setFilterOptions?.({
                  type: "",
                  visibility: "",
                  dateRange: "",
                  client: "",
                  tags: [],
                });
                setAdvancedFiltersOpen(false);
              }}
            >
              Limpar Filtros
            </Button>
            <Button onClick={() => setAdvancedFiltersOpen(false)}>
              Aplicar Filtros
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurações do GED</DialogTitle>
            <DialogDescription>
              Configure preferências e comportamentos do sistema
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Busca Inteligente com IA</Label>
              <Switch
                checked={smartSearchActive}
                onCheckedChange={setSmartSearchActive}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Upload Automático para Pasta</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>Notificações de Sistema</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>Sincronização Automática</Label>
              <Switch defaultChecked />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setSettingsOpen(false)}>
              Salvar Configurações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
