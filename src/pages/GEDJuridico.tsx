import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// GED Components
import { TreeView, TreeNode } from "@/components/GED/TreeView";
import { DynamicBreadcrumb } from "@/components/GED/DynamicBreadcrumb";
import { FileViewer } from "@/components/GED/FileViewer";
import { DropzoneUpload } from "@/components/GED/DropzoneUpload";
import { BulkActions, SelectedFile } from "@/components/GED/BulkActions";
import { FileContextMenu, FileItem } from "@/components/GED/FileContextMenu";
import { FilePreview } from "@/components/GED/FilePreview";

// Hook
import { useGEDAdvanced } from "@/hooks/useGEDAdvanced";
import { cn } from "@/lib/utils";

export default function GEDJuridico() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderType, setNewFolderType] =
    useState<TreeNode["type"]>("folder");
  const [isMobile, setIsMobile] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const {
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
    setViewMode,

    // File Operations
    selectFile,
    selectAllFiles,
    clearSelection,
    previewFile: handlePreviewFile,
    downloadFile,
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
    duplicateNode,
    moveNode,
    moveFiles,

    // Upload Operations
    uploadFiles,

    // Bulk Operations
    toggleFileVisibility,

    // Refresh
    refreshData,
  } = useGEDAdvanced();

  // Responsive handling
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Filter files based on search
  const filteredFiles = currentFiles.filter((file) => {
    if (!searchTerm) return true;
    return (
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      ) ||
      file.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Get selected file objects for bulk actions
  const selectedFileObjects: SelectedFile[] = selectedFiles
    .map((id) => {
      const file = currentFiles.find((f) => f.id === id);
      return file
        ? {
            id: file.id,
            name: file.name,
            type: file.type,
            size: file.size,
            clientVisible: file.clientVisible,
            folderId: currentPath[currentPath.length - 1] || "root",
          }
        : null;
    })
    .filter(Boolean) as SelectedFile[];

  // Available folders for moving files
  const availableFolders = useMemo(() => {
    const extractFolders = (
      nodes: TreeNode[],
      path: string[] = [],
    ): Array<{ id: string; name: string; path: string }> => {
      const folders: Array<{ id: string; name: string; path: string }> = [];

      for (const node of nodes) {
        const currentPath = [...path, node.name];
        folders.push({
          id: node.id,
          name: node.name,
          path: currentPath.join(" > "),
        });

        if (node.children) {
          folders.push(...extractFolders(node.children, currentPath));
        }
      }

      return folders;
    };

    return extractFolders(treeData);
  }, [treeData]);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const parentId = currentPath[currentPath.length - 1] || "root";
      createFolder(parentId, newFolderName.trim(), newFolderType);
      setNewFolderName("");
      setShowCreateFolderDialog(false);
      toast.success("Pasta criada com sucesso!");
    }
  };

  const handleUploadComplete = (files: any[]) => {
    setShowUploadDialog(false);
    refreshData();
    toast.success(`${files.length} arquivo(s) enviado(s) com sucesso!`);
  };

  const handleFileDrop = (files: File[]) => {
    const currentFolderId = currentPath[currentPath.length - 1] || "root";
    uploadFiles(files, currentFolderId);
  };

  const handlePreviewFile = (file: FileItem) => {
    setPreviewFile(file);
    setShowPreview(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <FolderOpen className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground">Carregando GED Jurídico...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h3 className="text-lg font-semibold mb-2">Erro no GED</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refreshData}>Tentar Novamente</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar - Desktop */}
      {!isMobile && (
        <motion.div
          initial={false}
          animate={{ width: sidebarOpen ? 320 : 0 }}
          transition={{ duration: 0.2 }}
          className="border-r bg-card overflow-hidden"
        >
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Navegação
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-muted/50 p-2 rounded text-center">
                  <div className="font-semibold">{stats.totalFiles}</div>
                  <div className="text-muted-foreground">Arquivos</div>
                </div>
                <div className="bg-muted/50 p-2 rounded text-center">
                  <div className="font-semibold">
                    {formatFileSize(stats.totalSize)}
                  </div>
                  <div className="text-muted-foreground">Total</div>
                </div>
              </div>
            </div>

            {/* Tree Navigation */}
            <div className="flex-1 overflow-y-auto">
              <TreeView
                data={treeData}
                selectedPath={currentPath}
                onSelectPath={navigateToPath}
                onCreateFolder={createFolder}
                onRenameNode={renameNode}
                onDeleteNode={deleteNode}
                onDuplicateNode={duplicateNode}
                onMoveNode={moveNode}
              />
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setShowCreateFolderDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Pasta
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setShowUploadDialog(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Sidebar - Mobile */}
      {isMobile && (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="fixed top-4 left-4 z-50 md:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Navegação GED
              </SheetTitle>
              <SheetDescription>
                Navegue pelas pastas e gerencie seus documentos
              </SheetDescription>
            </SheetHeader>

            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto p-4">
                <TreeView
                  data={treeData}
                  selectedPath={currentPath}
                  onSelectPath={navigateToPath}
                  onCreateFolder={createFolder}
                  onRenameNode={renameNode}
                  onDeleteNode={deleteNode}
                  onDuplicateNode={duplicateNode}
                  onMoveNode={moveNode}
                />
              </div>

              <div className="p-4 border-t space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setShowCreateFolderDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Pasta
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setShowUploadDialog(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b bg-background p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {!sidebarOpen && !isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}

              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FolderOpen className="h-6 w-6 text-primary" />
                GED Jurídico
              </h1>

              {isUploading && (
                <Badge variant="secondary" className="animate-pulse">
                  Enviando...
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>

              <Dialog
                open={showUploadDialog}
                onOpenChange={setShowUploadDialog}
              >
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Enviar Documentos</DialogTitle>
                    <DialogDescription>
                      Faça upload de arquivos para a pasta atual:{" "}
                      {currentNode?.name || "Raiz"}
                    </DialogDescription>
                  </DialogHeader>
                  <DropzoneUpload
                    currentFolderId={
                      currentPath[currentPath.length - 1] || "root"
                    }
                    onUploadComplete={handleUploadComplete}
                    className="min-h-[300px]"
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Breadcrumbs */}
          <DynamicBreadcrumb
            segments={breadcrumbs}
            canGoBack={canGoBack}
            canGoForward={canGoForward}
            onNavigate={navigateToPath}
            onGoBack={goBack}
            onGoForward={goForward}
            fileCount={filteredFiles.length}
          />
        </div>

        {/* Toolbar */}
        <div className="border-b bg-muted/30 p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar arquivos, tags, usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateFolderDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Pasta
              </Button>

              <Separator orientation="vertical" className="h-8" />

              {/* View Mode Toggle */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedFiles.length > 0 && (
          <div className="p-4">
            <BulkActions
              selectedFiles={selectedFileObjects}
              onClearSelection={clearSelection}
              onDeleteFiles={deleteMultiple}
              onToggleVisibility={toggleFileVisibility}
              onMoveFiles={moveFiles}
              onSendToAI={(fileIds, action) => sendToAI(fileIds, action)}
              availableFolders={availableFolders}
            />
          </div>
        )}

        {/* File Area */}
        <div className="flex-1 overflow-hidden">
          {uploadProgress.length > 0 && (
            <div className="p-4 border-b">
              <DropzoneUpload
                currentFolderId={currentPath[currentPath.length - 1] || "root"}
                onUploadComplete={handleUploadComplete}
                className="min-h-[150px]"
              />
            </div>
          )}

          <div className="h-full overflow-y-auto p-4">
            <FileViewer
              files={filteredFiles}
              viewMode={viewMode}
              selectedFiles={selectedFiles}
              onSelectFile={selectFile}
              onSelectAll={selectAllFiles}
              onPreview={handlePreviewFile}
              onDownload={downloadFile}
              onEdit={editFile}
              onDelete={deleteFile}
              onToggleFavorite={toggleFavorite}
              onShare={shareFile}
              onSendToAI={(file, action) => sendToAI(file, action)}
              onAssociate={associateFile}
            />
          </div>
        </div>

        {/* Footer Stats */}
        <div className="border-t bg-muted/30 p-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>
                {filteredFiles.length} arquivo
                {filteredFiles.length !== 1 ? "s" : ""}
              </span>
              <span>{formatFileSize(stats.totalSize)} total</span>
              {selectedFiles.length > 0 && (
                <span>
                  {selectedFiles.length} selecionado
                  {selectedFiles.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {stats.favoriteFiles} favoritos
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {stats.clientVisibleFiles} visíveis ao cliente
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Create Folder Dialog */}
      <Dialog
        open={showCreateFolderDialog}
        onOpenChange={setShowCreateFolderDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Pasta</DialogTitle>
            <DialogDescription>
              Criar nova pasta em: {currentNode?.name || "Raiz"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="folder-name">Nome da Pasta</Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Ex: Contratos, Procurações, Intimações..."
              />
            </div>
            <div>
              <Label htmlFor="folder-type">Tipo</Label>
              <select
                id="folder-type"
                value={newFolderType}
                onChange={(e) =>
                  setNewFolderType(e.target.value as TreeNode["type"])
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="folder">📁 Pasta Comum</option>
                <option value="client">👤 Pasta de Cliente</option>
                <option value="process">⚖️ Pasta de Processo</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateFolderDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim()}
            >
              Criar Pasta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Preview */}
      <FilePreview
        file={previewFile}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onDownload={downloadFile}
        onShare={shareFile}
      />
    </div>
  );
}
