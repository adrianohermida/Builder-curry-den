import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FolderOpen,
  Grid3X3,
  List,
  Search,
  Filter,
  Upload,
  Star,
  Trash2,
  Users,
  Gavel,
  FileText,
  Plus,
  BarChart3,
  Settings,
  Eye,
  EyeOff,
  Calendar,
  Download,
  MessageSquare,
  Tag,
  SortAsc,
  SortDesc,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  useGEDDocuments,
  DocumentFilter,
  GEDDocument,
} from "@/hooks/useGEDDocuments";
import { GEDDocumentCard } from "@/components/GED/GEDDocumentCard";
import { GEDDocumentList } from "@/components/GED/GEDDocumentList";
import { GEDUploadDialog } from "@/components/GED/GEDUploadDialog";
import { GEDSidebar } from "@/components/GED/GEDSidebar";

type ViewMode = "grid" | "list";
type SortBy = "name" | "date" | "size" | "type" | "downloads";
type SortOrder = "asc" | "desc";

export default function GEDJuridico() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Estados principais
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Filtros
  const [filters, setFilters] = useState<DocumentFilter>({
    search: searchParams.get("search") || "",
    isDeleted: false,
  });

  // Hook do GED
  const {
    documents,
    stats,
    loading,
    filterDocuments,
    uploadDocument,
    toggleFavorite,
    moveToTrash,
    restoreFromTrash,
    deletePermanently,
    refreshDocuments,
  } = useGEDDocuments();

  // Documentos filtrados e ordenados
  const filteredAndSortedDocuments = useMemo(() => {
    const filtered = filterDocuments(documents, filters);

    return filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.friendlyName || a.name;
          bValue = b.friendlyName || b.name;
          break;
        case "date":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "size":
          aValue = a.size;
          bValue = b.size;
          break;
        case "type":
          aValue = a.extension;
          bValue = b.extension;
          break;
        case "downloads":
          aValue = a.downloadCount;
          bValue = b.downloadCount;
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [documents, filters, sortBy, sortOrder, filterDocuments]);

  // Atualizar URL com filtros
  const updateFilters = (newFilters: Partial<DocumentFilter>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    // Atualizar URL
    const params = new URLSearchParams();
    if (updatedFilters.search) params.set("search", updatedFilters.search);
    if (updatedFilters.clientId) params.set("client", updatedFilters.clientId);
    if (updatedFilters.processNumber)
      params.set("process", updatedFilters.processNumber);

    setSearchParams(params);
  };

  const handleUpload = async (
    files: File[],
    metadata: Partial<GEDDocument>,
  ) => {
    try {
      for (const file of files) {
        await uploadDocument(file, metadata);
      }
      setShowUploadDialog(false);
      refreshDocuments();
    } catch (error) {
      console.error("Erro no upload:", error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getActiveSection = () => {
    const path = window.location.pathname;
    if (path.includes("/favoritos")) return "favoritos";
    if (path.includes("/lixeira")) return "lixeira";
    if (path.includes("/cliente/")) return "cliente";
    if (path.includes("/processo/")) return "processo";
    return "todos";
  };

  const activeSection = getActiveSection();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FolderOpen className="h-12 w-12 mx-auto mb-4 animate-pulse text-[rgb(var(--theme-primary))]" />
          <p className="text-muted-foreground">Carregando documentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <GEDSidebar
        stats={stats}
        activeSection={activeSection}
        onSectionChange={(section) => {
          switch (section) {
            case "todos":
              navigate("/ged");
              updateFilters({ isDeleted: false, isFavorite: undefined });
              break;
            case "favoritos":
              navigate("/ged/favoritos");
              updateFilters({ isDeleted: false, isFavorite: true });
              break;
            case "lixeira":
              navigate("/ged/lixeira");
              updateFilters({ isDeleted: true, isFavorite: undefined });
              break;
          }
        }}
      />

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b bg-background p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-2">
                <FolderOpen className="h-8 w-8 text-[rgb(var(--theme-primary))]" />
                <span>GED Jurídico</span>
              </h1>
              <p className="text-muted-foreground">
                Gestão Eletrônica de Documentos do escritório
              </p>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={refreshDocuments}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>

              <Dialog
                open={showUploadDialog}
                onOpenChange={setShowUploadDialog}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Novo Upload
                  </Button>
                </DialogTrigger>
                <GEDUploadDialog onUpload={handleUpload} />
              </Dialog>
            </div>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-lg font-semibold">{stats?.total || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Visível Cliente
                    </p>
                    <p className="text-lg font-semibold">
                      {stats?.clientVisible || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Favoritos</p>
                    <p className="text-lg font-semibold">
                      {stats?.favorites || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tamanho Total
                    </p>
                    <p className="text-lg font-semibold">
                      {formatFileSize(stats?.totalSize || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Barra de Ferramentas */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar documentos, clientes, processos..."
                  value={filters.search || ""}
                  onChange={(e) => updateFilters({ search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtros */}
            <div className="flex space-x-2">
              <Select
                value={filters.source || "all"}
                onValueChange={(value) =>
                  updateFilters({ source: value === "all" ? undefined : value })
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="UPLOAD_DIRETO">Upload Direto</SelectItem>
                  <SelectItem value="CRM">CRM</SelectItem>
                  <SelectItem value="ATENDIMENTO">Atendimento</SelectItem>
                  <SelectItem value="IA">IA Jurídica</SelectItem>
                  <SelectItem value="PORTAL_CLIENTE">Portal Cliente</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.visibility || "all"}
                onValueChange={(value) =>
                  updateFilters({
                    visibility: value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Visibilidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="INTERNO">Interno</SelectItem>
                  <SelectItem value="VISIVEL_CLIENTE">
                    Visível Cliente
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.fileType || "all"}
                onValueChange={(value) =>
                  updateFilters({
                    fileType: value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="DOCX">DOCX</SelectItem>
                  <SelectItem value="XLSX">XLSX</SelectItem>
                  <SelectItem value="JPG">JPG</SelectItem>
                  <SelectItem value="PNG">PNG</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Visualização e Ordenação */}
            <div className="flex items-center space-x-2">
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

              <Select
                value={`${sortBy}-${sortOrder}`}
                onValueChange={(value) => {
                  const [sort, order] = value.split("-");
                  setSortBy(sort as SortBy);
                  setSortOrder(order as SortOrder);
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Mais Recente</SelectItem>
                  <SelectItem value="date-asc">Mais Antigo</SelectItem>
                  <SelectItem value="name-asc">Nome A-Z</SelectItem>
                  <SelectItem value="name-desc">Nome Z-A</SelectItem>
                  <SelectItem value="size-desc">Maior</SelectItem>
                  <SelectItem value="size-asc">Menor</SelectItem>
                  <SelectItem value="downloads-desc">Mais Baixados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Lista de Documentos */}
        <div className="flex-1 overflow-auto p-6">
          {filteredAndSortedDocuments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {filters.search
                    ? "Nenhum documento encontrado"
                    : activeSection === "lixeira"
                      ? "Lixeira vazia"
                      : activeSection === "favoritos"
                        ? "Nenhum favorito"
                        : "Nenhum documento"}
                </h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  {filters.search
                    ? "Tente ajustar os filtros ou buscar por outros termos"
                    : activeSection === "lixeira"
                      ? "Documentos excluídos aparecerão aqui"
                      : "Faça upload de documentos para começar a organizar seus arquivos"}
                </p>
                {!filters.search && activeSection === "todos" && (
                  <Button onClick={() => setShowUploadDialog(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Fazer Upload
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  {filteredAndSortedDocuments.length} documento(s) encontrado(s)
                </p>

                {filters.search && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateFilters({ search: "" })}
                  >
                    Limpar busca
                  </Button>
                )}
              </div>

              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAndSortedDocuments.map((document, index) => (
                    <motion.div
                      key={document.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <GEDDocumentCard
                        document={document}
                        onToggleFavorite={() => toggleFavorite(document.id)}
                        onMoveToTrash={() => moveToTrash(document.id)}
                        onRestore={() => restoreFromTrash(document.id)}
                        onDeletePermanently={() =>
                          deletePermanently(document.id)
                        }
                        isInTrash={document.isDeleted}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <GEDDocumentList
                  documents={filteredAndSortedDocuments}
                  onToggleFavorite={toggleFavorite}
                  onMoveToTrash={moveToTrash}
                  onRestore={restoreFromTrash}
                  onDeletePermanently={deletePermanently}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
