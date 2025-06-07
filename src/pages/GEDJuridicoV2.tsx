import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen,
  Grid3X3,
  List,
  Search,
  Filter,
  Upload,
  Plus,
  Settings,
  Menu,
  X,
  BarChart3,
  Brain,
  BookOpen,
  Shield,
  Users,
  Eye,
  Star,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Home,
  Maximize2,
  Minimize2,
  RefreshCw,
  Zap,
  Target,
  Activity,
  Calendar,
  Bell,
  HelpCircle,
  Layers,
  Archive,
  FileText,
  Database,
  Globe,
  Lock,
  Unlock,
  Tag,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Import dos novos componentes avançados
import { GEDSmartTreeNavigation } from "@/components/GED/GEDSmartTreeNavigation";
import { GEDDigitalShelf } from "@/components/GED/GEDDigitalShelf";
import { GEDIntelligentUpload } from "@/components/GED/GEDIntelligentUpload";
import { GEDAdvancedAI } from "@/components/GED/GEDAdvancedAI";
import { GEDExecutiveDashboard } from "@/components/GED/GEDExecutiveDashboard";

// Import dos componentes existentes melhorados
import { FileViewer } from "@/components/GED/FileViewer";
import { BulkActions } from "@/components/GED/BulkActions";
import { FileContextMenu } from "@/components/GED/FileContextMenu";
import { FilePreview } from "@/components/GED/FilePreview";
import { GEDWatchdog } from "@/components/GED/GEDWatchdog";

interface ClientData {
  id: string;
  name: string;
  type: "fisica" | "juridica";
  cpfCnpj: string;
  email?: string;
  phone?: string;
  lastAccess?: string;
  fileCount: number;
  activeProcesses: number;
  favoriteCount: number;
  tags: string[];
  status: "active" | "inactive" | "archived";
  createdAt: string;
  avatar?: string;
}

interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  path: string;
  clientId?: string;
  processId?: string;
  createdAt: string;
  lastModified: string;
  tags: string[];
  category: string;
  isFavorite: boolean;
  isClientVisible: boolean;
  isMonetized?: boolean;
  revenue?: number;
  views: number;
  downloads: number;
}

interface FolderOption {
  id: string;
  name: string;
  path: string;
  icon: string;
  type:
    | "contratos"
    | "processos"
    | "financeiro"
    | "documentos"
    | "estante"
    | "custom";
}

interface FlipbookDocument {
  id: string;
  name: string;
  originalFile: string;
  totalPages: number;
  currentPage: number;
  thumbnail?: string;
  description?: string;
  tags: string[];
  createdAt: string;
  lastAccessed?: string;
  accessCount: number;
  visibility: "public" | "client" | "protected";
  password?: string;
  monetization: {
    enabled: boolean;
    freePages: number;
    price: number;
    currency: "BRL";
    stripeProductId?: string;
  };
  stats: {
    views: number;
    downloads: number;
    shares: number;
    purchases: number;
    revenue: number;
  };
  metadata: {
    author: string;
    category: string;
    language: "pt-BR";
    fileSize: number;
    format: "PDF";
  };
}

export default function GEDJuridicoV2() {
  // Estado principal
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [currentClient, setCurrentClient] = useState<ClientData | null>(null);
  const [currentFolder, setCurrentFolder] = useState<FolderOption | null>(null);
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [flipbookDocuments, setFlipbookDocuments] = useState<
    FlipbookDocument[]
  >([]);

  // Estado da UI
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<
    "files" | "shelf" | "ai" | "dashboard"
  >("files");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Estado de contexto
  const [contextMenu, setContextMenu] = useState<{
    file: DocumentFile | null;
    isOpen: boolean;
    position: { x: number; y: number };
  }>({
    file: null,
    isOpen: false,
    position: { x: 0, y: 0 },
  });

  const [previewFile, setPreviewFile] = useState<DocumentFile | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Configurações do usuário
  const [userSettings, setUserSettings] = useState({
    autoSync: true,
    notifications: true,
    aiAutoProcess: true,
    compactView: false,
    showWatchdog: true,
    darkMode: false,
  });

  // Dados simulados
  const mockClients: ClientData[] = [
    {
      id: "client_001",
      name: "João Silva Advocacia",
      type: "juridica",
      cpfCnpj: "12.345.678/0001-90",
      email: "contato@joaosilva.adv.br",
      phone: "(11) 98765-4321",
      lastAccess: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      fileCount: 234,
      activeProcesses: 12,
      favoriteCount: 45,
      tags: ["Trabalhista", "Cível", "Premium"],
      status: "active",
      createdAt: "2023-01-15T00:00:00Z",
    },
    {
      id: "client_002",
      name: "Maria Santos",
      type: "fisica",
      cpfCnpj: "123.456.789-01",
      email: "maria@email.com",
      phone: "(11) 91234-5678",
      lastAccess: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      fileCount: 89,
      activeProcesses: 3,
      favoriteCount: 12,
      tags: ["Família", "Divórcio"],
      status: "active",
      createdAt: "2023-03-22T00:00:00Z",
    },
    {
      id: "client_003",
      name: "Santos & Associados",
      type: "juridica",
      cpfCnpj: "98.765.432/0001-10",
      email: "contato@santos.com.br",
      phone: "(11) 95555-1234",
      lastAccess: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      fileCount: 445,
      activeProcesses: 28,
      favoriteCount: 78,
      tags: ["Empresarial", "Tributário", "Premium", "VIP"],
      status: "active",
      createdAt: "2022-08-10T00:00:00Z",
    },
  ];

  const mockFolders: FolderOption[] = [
    {
      id: "contratos",
      name: "Contratos",
      path: "/contratos",
      icon: "📝",
      type: "contratos",
    },
    {
      id: "processos",
      name: "Processos",
      path: "/processos",
      icon: "⚖️",
      type: "processos",
    },
    {
      id: "financeiro",
      name: "Financeiro",
      path: "/financeiro",
      icon: "💰",
      type: "financeiro",
    },
    {
      id: "documentos",
      name: "Documentos Pessoais",
      path: "/documentos",
      icon: "👤",
      type: "documentos",
    },
    {
      id: "estante",
      name: "Estante Digital",
      path: "/estante",
      icon: "📚",
      type: "estante",
    },
  ];

  const mockDocuments: DocumentFile[] = [
    {
      id: "doc_001",
      name: "Contrato de Prestação de Serviços.pdf",
      type: "application/pdf",
      size: 2048576,
      path: "/client_001/contratos/",
      clientId: "client_001",
      createdAt: "2024-01-15T10:30:00Z",
      lastModified: "2024-01-15T10:30:00Z",
      tags: ["contrato", "prestação de serviços", "2024"],
      category: "Contrato",
      isFavorite: true,
      isClientVisible: true,
      views: 45,
      downloads: 12,
    },
    {
      id: "doc_002",
      name: "Petição Inicial - Ação de Indenização.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size: 512000,
      path: "/client_002/processos/",
      clientId: "client_002",
      createdAt: "2024-01-10T14:20:00Z",
      lastModified: "2024-01-12T16:45:00Z",
      tags: ["petição inicial", "indenização", "urgente"],
      category: "Petição",
      isFavorite: false,
      isClientVisible: false,
      views: 23,
      downloads: 8,
    },
    {
      id: "doc_003",
      name: "Manual Prático de Direito Trabalhista.pdf",
      type: "application/pdf",
      size: 15728640,
      path: "/client_003/estante/",
      clientId: "client_003",
      createdAt: "2024-01-05T09:15:00Z",
      lastModified: "2024-01-05T09:15:00Z",
      tags: ["manual", "trabalhista", "estudo"],
      category: "Manual",
      isFavorite: true,
      isClientVisible: true,
      isMonetized: true,
      revenue: 1250.8,
      views: 156,
      downloads: 89,
    },
  ];

  const mockFlipbooks: FlipbookDocument[] = [
    {
      id: "flipbook_001",
      name: "Manual Prático de Direito Trabalhista",
      originalFile: "doc_003",
      totalPages: 180,
      currentPage: 1,
      description:
        "Guia completo sobre legislação trabalhista brasileira atualizado para 2024",
      tags: ["direito", "trabalhista", "manual", "2024"],
      createdAt: "2024-01-05T09:15:00Z",
      accessCount: 156,
      visibility: "client",
      monetization: {
        enabled: true,
        freePages: 15,
        price: 29.9,
        currency: "BRL",
      },
      stats: {
        views: 156,
        downloads: 89,
        shares: 23,
        purchases: 34,
        revenue: 1017.6,
      },
      metadata: {
        author: "Dr. Carlos Santos",
        category: "Manual",
        language: "pt-BR",
        fileSize: 15728640,
        format: "PDF",
      },
    },
  ];

  // Handlers de navegação
  const handleNavigate = (path: string[], clientData?: ClientData) => {
    setSelectedPath(path);
    setCurrentClient(clientData || null);

    if (path.length > 1) {
      const folderId = path[1];
      const folder = mockFolders.find((f) => f.id === folderId);
      setCurrentFolder(folder || null);
    } else {
      setCurrentFolder(null);
    }

    // Filtrar documentos baseado no caminho
    const filteredDocs = mockDocuments.filter((doc) => {
      if (path.length === 0) return false;
      if (path.length === 1) return doc.clientId === path[0];
      if (path.length === 2) {
        const folder = mockFolders.find((f) => f.id === path[1]);
        return (
          doc.clientId === path[0] && doc.path.includes(folder?.path || "")
        );
      }
      return false;
    });

    setDocuments(filteredDocs);
    setSelectedDocuments([]);

    // Se navegando para estante digital, carregar flipbooks
    if (path.length === 2 && path[1] === "estante") {
      const clientFlipbooks = mockFlipbooks.filter((fb) => {
        const originalDoc = mockDocuments.find((d) => d.id === fb.originalFile);
        return originalDoc?.clientId === path[0];
      });
      setFlipbookDocuments(clientFlipbooks);
    } else {
      setFlipbookDocuments([]);
    }
  };

  const handleCreateClient = (type: "fisica" | "juridica") => {
    toast.info(
      `Criação de cliente ${type === "fisica" ? "Pessoa Física" : "Pessoa Jurídica"} em desenvolvimento`,
    );
  };

  const handleCreateFolder = (
    clientId: string,
    folderData: Partial<FolderOption>,
  ) => {
    toast.success(`Pasta "${folderData.name}" criada para cliente ${clientId}`);
  };

  const handleApplyTemplate = (clientId: string, templateId: string) => {
    toast.success(`Template "${templateId}" aplicado ao cliente ${clientId}`);
  };

  // Handlers de arquivos
  const handleFileSelect = (fileId: string, event?: React.MouseEvent) => {
    if (event?.ctrlKey || event?.metaKey) {
      setSelectedDocuments((prev) =>
        prev.includes(fileId)
          ? prev.filter((id) => id !== fileId)
          : [...prev, fileId],
      );
    } else if (event?.shiftKey && selectedDocuments.length > 0) {
      const lastSelectedIndex = documents.findIndex(
        (d) => d.id === selectedDocuments[selectedDocuments.length - 1],
      );
      const currentIndex = documents.findIndex((d) => d.id === fileId);
      const start = Math.min(lastSelectedIndex, currentIndex);
      const end = Math.max(lastSelectedIndex, currentIndex);
      const range = documents.slice(start, end + 1).map((d) => d.id);
      setSelectedDocuments(range);
    } else {
      setSelectedDocuments([fileId]);
    }
  };

  const handleFileContextMenu = (
    file: DocumentFile,
    event: React.MouseEvent,
  ) => {
    event.preventDefault();
    setContextMenu({
      file,
      isOpen: true,
      position: { x: event.clientX, y: event.clientY },
    });
  };

  const handleFilePreview = (file: DocumentFile) => {
    setPreviewFile(file);
  };

  const handleBulkDownload = (fileIds: string[]) => {
    toast.success(`Iniciando download de ${fileIds.length} arquivo(s)`);
  };

  const handleBulkShare = (fileIds: string[]) => {
    toast.info("Funcionalidade de compartilhamento em lote em desenvolvimento");
  };

  const handleBulkMove = (fileIds: string[], targetFolderId: string) => {
    toast.success(
      `${fileIds.length} arquivo(s) movido(s) para ${targetFolderId}`,
    );
  };

  // Handlers de upload
  const handleUploadComplete = (files: any[]) => {
    setDocuments((prev) => [
      ...prev,
      ...files.map((f) => ({
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: f.name,
        type: f.type,
        size: f.size,
        path: currentFolder?.path || "/",
        clientId: currentClient?.id,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        tags: f.settings.tags,
        category: f.settings.category,
        isFavorite: f.settings.isFavorite,
        isClientVisible: f.settings.isClientVisible,
        views: 0,
        downloads: 0,
      })),
    ]);

    toast.success(`${files.length} arquivo(s) enviado(s) com sucesso`);
  };

  const handleAIProcess = async (file: any) => {
    // Simular processamento com IA
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      documentType: "Contrato de Prestação de Serviços",
      extractedText: "Texto extraído do documento...",
      suggestedTags: ["contrato", "prestação", "serviços"],
      suggestedCategory: "Contrato",
      detectedDeadlines: [
        { date: "2024-12-31", description: "Vencimento do contrato" },
      ],
      confidence: 0.92,
    };
  };

  // Handlers da IA
  const handleAnalysisComplete = (result: any) => {
    toast.success(
      `Análise "${result.analysisType}" concluída com ${(result.confidence * 100).toFixed(0)}% de confiança`,
    );
  };

  const handleCreateTask = (taskData: any) => {
    toast.success(`Tarefa "${taskData.title}" criada na agenda`);
  };

  const handleCreatePetition = (petitionData: any) => {
    toast.success(
      `Petição "${petitionData.type}" criada com base no documento`,
    );
  };

  // Handlers da Estante Digital
  const handleDocumentOpen = (document: FlipbookDocument) => {
    toast.info(`Abrindo flipbook: ${document.name}`);
  };

  const handleDocumentEdit = (document: FlipbookDocument) => {
    toast.info("Editor de flipbook em desenvolvimento");
  };

  const handleDocumentDelete = (documentId: string) => {
    setFlipbookDocuments((prev) => prev.filter((d) => d.id !== documentId));
    toast.success("Documento removido da estante digital");
  };

  const handleDocumentShare = (
    document: FlipbookDocument,
    platform: string,
  ) => {
    toast.success(`Documento compartilhado via ${platform}`);
  };

  const handleMonetizationUpdate = (documentId: string, settings: any) => {
    setFlipbookDocuments((prev) =>
      prev.map((d) =>
        d.id === documentId
          ? { ...d, monetization: { ...d.monetization, ...settings } }
          : d,
      ),
    );
    toast.success("Configurações de monetização atualizadas");
  };

  // Dados computados
  const breadcrumbs = useMemo(() => {
    const segments = [];

    if (selectedPath.length === 0) {
      return [{ label: "GED Jurídico", path: [], icon: "🏠" }];
    }

    segments.push({ label: "GED", path: [], icon: "🏠" });

    if (currentClient) {
      segments.push({
        label: currentClient.name,
        path: [currentClient.id],
        icon: currentClient.type === "fisica" ? "👤" : "🏢",
      });
    }

    if (currentFolder) {
      segments.push({
        label: currentFolder.name,
        path: selectedPath,
        icon: currentFolder.icon,
      });
    }

    return segments;
  }, [selectedPath, currentClient, currentFolder]);

  const filteredDocuments = useMemo(() => {
    return documents.filter(
      (doc) =>
        searchQuery === "" ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    );
  }, [documents, searchQuery]);

  const stats = useMemo(
    () => ({
      totalFiles: documents.length,
      selectedCount: selectedDocuments.length,
      clientVisible: documents.filter((d) => d.isClientVisible).length,
      favorites: documents.filter((d) => d.isFavorite).length,
      monetized: documents.filter((d) => d.isMonetized).length,
      totalRevenue: documents.reduce((sum, d) => sum + (d.revenue || 0), 0),
    }),
    [documents, selectedDocuments],
  );

  const ViewHeader = () => (
    <div className="border-b bg-card px-4 py-3">
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

          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((segment, index) => (
              <div key={index} className="flex items-center space-x-2">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <button
                  onClick={() => handleNavigate(segment.path)}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors text-muted-foreground"
                >
                  <span>{segment.icon}</span>
                  <span>{segment.label}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          {activeView === "files" && (
            <div className="flex border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="px-2"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="px-2"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Fullscreen Toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Configurações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setUploadDialogOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Inteligente
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sincronizar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Preferências
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <FileText className="h-4 w-4" />
            <span>{stats.totalFiles} arquivo(s)</span>
          </div>
          {stats.selectedCount > 0 && (
            <div className="flex items-center space-x-1 text-primary font-medium">
              <CheckCircle className="h-4 w-4" />
              <span>{stats.selectedCount} selecionado(s)</span>
            </div>
          )}
          {stats.clientVisible > 0 && (
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{stats.clientVisible} visível</span>
            </div>
          )}
          {stats.favorites > 0 && (
            <div className="flex items-center space-x-1 text-yellow-600">
              <Star className="h-4 w-4 fill-current" />
              <span>{stats.favorites}</span>
            </div>
          )}
          {stats.monetized > 0 && (
            <div className="flex items-center space-x-1 text-green-600">
              <DollarSign className="h-4 w-4" />
              <span>R$ {stats.totalRevenue.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ContentArea = () => (
    <div className="flex-1 overflow-hidden">
      {/* Bulk Actions */}
      {selectedDocuments.length > 0 && activeView === "files" && (
        <div className="border-b bg-muted/30 px-4 py-2">
          <BulkActions
            selectedFiles={selectedDocuments}
            onClearSelection={() => setSelectedDocuments([])}
            onDelete={() => {
              setDocuments((prev) =>
                prev.filter((d) => !selectedDocuments.includes(d.id)),
              );
              setSelectedDocuments([]);
              toast.success(
                `${selectedDocuments.length} arquivo(s) excluído(s)`,
              );
            }}
            onDownloadZip={() => handleBulkDownload(selectedDocuments)}
            onToggleClientVisible={() => {
              setDocuments((prev) =>
                prev.map((d) =>
                  selectedDocuments.includes(d.id)
                    ? { ...d, isClientVisible: !d.isClientVisible }
                    : d,
                ),
              );
              toast.success("Visibilidade atualizada");
            }}
            onToggleFavorite={() => {
              setDocuments((prev) =>
                prev.map((d) =>
                  selectedDocuments.includes(d.id)
                    ? { ...d, isFavorite: !d.isFavorite }
                    : d,
                ),
              );
              toast.success("Favoritos atualizados");
            }}
            onMove={handleBulkMove}
            currentFolderId={currentFolder?.id || ""}
            treeData={[]}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4">
        <Tabs
          value={activeView}
          onValueChange={(value: any) => setActiveView(value)}
        >
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="files" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Arquivos</span>
            </TabsTrigger>
            <TabsTrigger value="shelf" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Estante Digital</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>IA Jurídica</span>
            </TabsTrigger>
            <TabsTrigger
              value="dashboard"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="mt-0">
            {documents.length > 0 ? (
              <FileViewer
                files={filteredDocuments}
                selectedFiles={selectedDocuments}
                viewMode={viewMode}
                onFileSelect={handleFileSelect}
                onFilePreview={handleFilePreview}
                onContextMenu={handleFileContextMenu}
              />
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Nenhum arquivo encontrado
                </h3>
                <p className="text-muted-foreground mb-6">
                  {selectedPath.length === 0
                    ? "Selecione um cliente na navegação lateral"
                    : "Esta pasta está vazia. Faça upload de arquivos para começar."}
                </p>
                {selectedPath.length > 0 && (
                  <Button onClick={() => setUploadDialogOpen(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Fazer Upload
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="shelf" className="mt-0">
            <GEDDigitalShelf
              documents={flipbookDocuments}
              onDocumentOpen={handleDocumentOpen}
              onDocumentEdit={handleDocumentEdit}
              onDocumentDelete={handleDocumentDelete}
              onDocumentShare={handleDocumentShare}
              onMonetizationUpdate={handleMonetizationUpdate}
            />
          </TabsContent>

          <TabsContent value="ai" className="mt-0">
            <GEDAdvancedAI
              documents={documents}
              selectedDocuments={selectedDocuments}
              onAnalysisComplete={handleAnalysisComplete}
              onCreateTask={handleCreateTask}
              onCreatePetition={handleCreatePetition}
            />
          </TabsContent>

          <TabsContent value="dashboard" className="mt-0">
            <GEDExecutiveDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div
        className={`flex h-screen bg-background ${isFullscreen ? "fixed inset-0 z-50" : ""}`}
      >
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-80 lg:flex-col">
          <GEDSmartTreeNavigation
            clients={mockClients}
            selectedPath={selectedPath}
            onNavigate={handleNavigate}
            onCreateClient={handleCreateClient}
            onCreateFolder={handleCreateFolder}
            onApplyTemplate={handleApplyTemplate}
          />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>GED Jurídico</SheetTitle>
              <SheetDescription>Navegação e organização</SheetDescription>
            </SheetHeader>
            <GEDSmartTreeNavigation
              clients={mockClients}
              selectedPath={selectedPath}
              onNavigate={(path, client) => {
                handleNavigate(path, client);
                setSidebarOpen(false);
              }}
              onCreateClient={handleCreateClient}
              onCreateFolder={handleCreateFolder}
              onApplyTemplate={handleApplyTemplate}
            />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ViewHeader />
          <ContentArea />
        </div>

        {/* Watchdog Widget */}
        {userSettings.showWatchdog && !isFullscreen && (
          <div className="fixed bottom-4 right-4 z-40">
            <Card className="w-64 shadow-lg">
              <GEDWatchdog compact />
            </Card>
          </div>
        )}

        {/* Upload Dialog */}
        <GEDIntelligentUpload
          isOpen={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          currentFolder={currentFolder || undefined}
          availableFolders={mockFolders}
          onUploadComplete={handleUploadComplete}
          onAIProcess={handleAIProcess}
        />

        {/* Context Menu */}
        {contextMenu.isOpen && contextMenu.file && (
          <FileContextMenu
            file={contextMenu.file}
            position={contextMenu.position}
            open={contextMenu.isOpen}
            onClose={() =>
              setContextMenu((prev) => ({ ...prev, isOpen: false }))
            }
            onPreview={() => handleFilePreview(contextMenu.file!)}
            onEdit={() => toast.info("Editor em desenvolvimento")}
            onDelete={() => {
              setDocuments((prev) =>
                prev.filter((d) => d.id !== contextMenu.file!.id),
              );
              setContextMenu((prev) => ({ ...prev, isOpen: false }));
              toast.success("Arquivo excluído");
            }}
            onShare={() => toast.info("Compartilhamento em desenvolvimento")}
            onDownload={() => toast.success("Download iniciado")}
            onToggleFavorite={() => {
              setDocuments((prev) =>
                prev.map((d) =>
                  d.id === contextMenu.file!.id
                    ? { ...d, isFavorite: !d.isFavorite }
                    : d,
                ),
              );
              setContextMenu((prev) => ({ ...prev, isOpen: false }));
            }}
            onToggleClientVisible={() => {
              setDocuments((prev) =>
                prev.map((d) =>
                  d.id === contextMenu.file!.id
                    ? { ...d, isClientVisible: !d.isClientVisible }
                    : d,
                ),
              );
              setContextMenu((prev) => ({ ...prev, isOpen: false }));
            }}
            onMove={() => toast.info("Mover arquivo em desenvolvimento")}
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

        {/* Settings Dialog */}
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurações do GED</DialogTitle>
              <DialogDescription>
                Personalize sua experiência no sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-sync">Sincronização automática</Label>
                <Switch
                  id="auto-sync"
                  checked={userSettings.autoSync}
                  onCheckedChange={(checked) =>
                    setUserSettings((prev) => ({ ...prev, autoSync: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Notificações</Label>
                <Switch
                  id="notifications"
                  checked={userSettings.notifications}
                  onCheckedChange={(checked) =>
                    setUserSettings((prev) => ({
                      ...prev,
                      notifications: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="ai-auto">Processamento automático com IA</Label>
                <Switch
                  id="ai-auto"
                  checked={userSettings.aiAutoProcess}
                  onCheckedChange={(checked) =>
                    setUserSettings((prev) => ({
                      ...prev,
                      aiAutoProcess: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-watchdog">Exibir Watchdog</Label>
                <Switch
                  id="show-watchdog"
                  checked={userSettings.showWatchdog}
                  onCheckedChange={(checked) =>
                    setUserSettings((prev) => ({
                      ...prev,
                      showWatchdog: checked,
                    }))
                  }
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Floating Action Button */}
        {!isFullscreen && selectedPath.length > 0 && (
          <div className="fixed bottom-6 right-6 z-30">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="lg"
                    onClick={() => setUploadDialogOpen(true)}
                    className="rounded-full w-14 h-14 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Plus className="h-6 w-6 text-white" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Upload Inteligente</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
