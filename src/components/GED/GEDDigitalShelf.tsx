import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Eye,
  Lock,
  Unlock,
  Share2,
  Download,
  Star,
  Heart,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  DollarSign,
  CreditCard,
  Users,
  Globe,
  Link2,
  MessageSquare,
  Tag,
  Settings,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Bookmark,
  Volume2,
  VolumeX,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

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

  // Configurações de visibilidade
  visibility: "public" | "client" | "protected";
  password?: string;

  // Configurações de monetização
  monetization: {
    enabled: boolean;
    freePages: number;
    price: number;
    currency: "BRL";
    stripeProductId?: string;
  };

  // Estatísticas
  stats: {
    views: number;
    downloads: number;
    shares: number;
    purchases: number;
    revenue: number;
  };

  // Metadados
  metadata: {
    author: string;
    category: string;
    language: "pt-BR";
    fileSize: number;
    format: "PDF";
  };
}

interface FlipbookViewerProps {
  document: FlipbookDocument;
  onClose: () => void;
  onPageChange?: (page: number) => void;
  onPurchase?: (documentId: string) => void;
  userHasPurchased?: boolean;
  isPreviewMode?: boolean;
}

interface DigitalShelfProps {
  documents: FlipbookDocument[];
  onDocumentOpen: (document: FlipbookDocument) => void;
  onDocumentEdit: (document: FlipbookDocument) => void;
  onDocumentDelete: (documentId: string) => void;
  onDocumentShare: (document: FlipbookDocument, platform: string) => void;
  onMonetizationUpdate: (documentId: string, settings: any) => void;
  className?: string;
}

const FlipbookViewer = ({
  document,
  onClose,
  onPageChange,
  onPurchase,
  userHasPurchased = false,
  isPreviewMode = false,
}: FlipbookViewerProps) => {
  const [currentPage, setCurrentPage] = useState(document.currentPage || 1);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(3000);
  const [showControls, setShowControls] = useState(true);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const playIntervalRef = useRef<NodeJS.Timeout>();

  const canAccessPage = (page: number) => {
    if (!document.monetization.enabled) return true;
    if (userHasPurchased) return true;
    return page <= document.monetization.freePages;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > document.totalPages) return;

    if (!canAccessPage(newPage)) {
      toast.warning(`Página ${newPage} requer compra do documento completo`);
      return;
    }

    setCurrentPage(newPage);
    onPageChange?.(newPage);
  };

  const handlePurchase = async () => {
    setLoading(true);
    try {
      await onPurchase?.(document.id);
      toast.success("Compra realizada com sucesso!");
    } catch (error) {
      toast.error("Erro ao processar compra");
    } finally {
      setLoading(false);
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      clearInterval(playIntervalRef.current);
      setIsPlaying(false);
    } else {
      playIntervalRef.current = setInterval(() => {
        setCurrentPage((prev) => {
          const nextPage = prev + 1;
          if (nextPage > document.totalPages) {
            setIsPlaying(false);
            return 1;
          }
          return canAccessPage(nextPage) ? nextPage : prev;
        });
      }, playbackSpeed);
      setIsPlaying(true);
    }
  };

  const toggleBookmark = () => {
    setBookmarks((prev) =>
      prev.includes(currentPage)
        ? prev.filter((p) => p !== currentPage)
        : [...prev, currentPage],
    );
  };

  const PurchaseModal = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 bg-black/80 flex items-center justify-center z-50"
    >
      <Card className="w-96 mx-4">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Lock className="h-5 w-5 text-amber-500" />
            <span>Conteúdo Premium</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Você visualizou {document.monetization.freePages} páginas
              gratuitas de {document.totalPages}.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-center">
                R$ {document.monetization.price.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground text-center">
                Acesso completo ao documento
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <BookOpen className="h-4 w-4 text-green-600" />
              <span>Acesso a todas as {document.totalPages} páginas</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Download className="h-4 w-4 text-blue-600" />
              <span>Download em PDF</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Bookmark className="h-4 w-4 text-purple-600" />
              <span>Salvar marcadores pessoais</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={onClose}>
              Não, obrigado
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-blue-600"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Comprar Agora</span>
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className={`fixed inset-0 bg-black z-50 ${isFullscreen ? "" : "p-4"}`}>
      <div
        ref={containerRef}
        className="relative h-full bg-gray-900 rounded-lg overflow-hidden"
      >
        {/* Controles superiores */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-40"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                  <div className="text-white">
                    <h3 className="font-medium">{document.name}</h3>
                    <p className="text-sm text-gray-300">
                      Página {currentPage} de {document.totalPages}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleBookmark}
                          className="text-white hover:bg-white/20"
                        >
                          {bookmarks.includes(currentPage) ? (
                            <Bookmark className="h-4 w-4 text-yellow-400 fill-current" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {bookmarks.includes(currentPage)
                          ? "Remover marcador"
                          : "Adicionar marcador"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Área principal do flipbook */}
        <div
          className="relative h-full flex items-center justify-center bg-gray-800"
          onClick={() => setShowControls(!showControls)}
        >
          {/* Simulação de página do documento */}
          <div
            className="relative bg-white shadow-2xl transition-transform duration-300"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              width: "600px",
              height: "800px",
            }}
          >
            <div className="w-full h-full flex items-center justify-center text-gray-600 border">
              <div className="text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">Página {currentPage}</p>
                <p className="text-sm text-gray-500">{document.name}</p>
                {!canAccessPage(currentPage) && (
                  <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <Lock className="h-8 w-8 mx-auto text-amber-600 mb-2" />
                    <p className="text-sm font-medium text-amber-800">
                      Página bloqueada
                    </p>
                    <p className="text-xs text-amber-600">
                      Compre o documento completo para acessar
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Controles inferiores */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-40"
            >
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="text-white hover:bg-white/20"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="text-white hover:bg-white/20"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlayback}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === document.totalPages}
                  className="text-white hover:bg-white/20"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(document.totalPages)}
                  disabled={currentPage === document.totalPages}
                  className="text-white hover:bg-white/20"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 bg-white/20" />

                <div className="flex items-center space-x-2 text-white">
                  <ZoomOut className="h-4 w-4" />
                  <Slider
                    value={[zoom]}
                    onValueChange={(value) => setZoom(value[0])}
                    min={50}
                    max={200}
                    step={10}
                    className="w-20"
                  />
                  <ZoomIn className="h-4 w-4" />
                  <span className="text-sm min-w-12">{zoom}%</span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRotation((prev) => prev + 90)}
                  className="text-white hover:bg-white/20"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>

              {/* Barra de progresso */}
              <div className="mt-3">
                <Progress
                  value={(currentPage / document.totalPages) * 100}
                  className="h-2"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de compra */}
        {document.monetization.enabled &&
          !userHasPurchased &&
          !canAccessPage(currentPage) && <PurchaseModal />}
      </div>
    </div>
  );
};

export function GEDDigitalShelf({
  documents,
  onDocumentOpen,
  onDocumentEdit,
  onDocumentDelete,
  onDocumentShare,
  onMonetizationUpdate,
  className = "",
}: DigitalShelfProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedDocument, setSelectedDocument] =
    useState<FlipbookDocument | null>(null);
  const [editingDocument, setEditingDocument] =
    useState<FlipbookDocument | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      searchQuery === "" ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      filterCategory === "all" || doc.metadata.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "views":
        return b.stats.views - a.stats.views;
      case "revenue":
        return b.stats.revenue - a.stats.revenue;
      case "recent":
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  const MonetizationSettings = ({
    document,
  }: {
    document: FlipbookDocument;
  }) => {
    const [settings, setSettings] = useState(document.monetization);

    const handleSave = () => {
      onMonetizationUpdate(document.id, settings);
      setEditingDocument(null);
      toast.success("Configurações de monetização atualizadas");
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="monetization-enabled">Habilitar monetização</Label>
          <Switch
            id="monetization-enabled"
            checked={settings.enabled}
            onCheckedChange={(enabled) => setSettings({ ...settings, enabled })}
          />
        </div>

        {settings.enabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="free-pages">Páginas gratuitas</Label>
              <Input
                id="free-pages"
                type="number"
                value={settings.freePages}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    freePages: parseInt(e.target.value),
                  })
                }
                min={0}
                max={document.totalPages}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={settings.price}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    price: parseFloat(e.target.value),
                  })
                }
                min={0}
              />
            </div>
          </>
        )}

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setEditingDocument(null)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Configurações</Button>
        </div>
      </div>
    );
  };

  const DocumentCard = ({ document }: { document: FlipbookDocument }) => (
    <ContextMenu>
      <ContextMenuTrigger>
        <motion.div whileHover={{ y: -2 }} className="group relative">
          <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200">
            <div className="relative">
              <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-gray-400" />
              </div>

              {/* Overlay com estatísticas */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="text-white text-center space-y-2">
                  <Button
                    size="sm"
                    onClick={() => onDocumentOpen(document)}
                    className="bg-white/20 hover:bg-white/30"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </Button>
                  <div className="text-xs space-y-1">
                    <div>{document.stats.views} visualizações</div>
                    {document.monetization.enabled && (
                      <div className="text-green-400">
                        R$ {document.stats.revenue.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Badges de status */}
              <div className="absolute top-2 left-2 space-y-1">
                {document.monetization.enabled && (
                  <Badge className="bg-green-600 text-white text-xs">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
                {document.visibility === "protected" && (
                  <Badge variant="secondary" className="text-xs">
                    <Lock className="h-3 w-3 mr-1" />
                    Protegido
                  </Badge>
                )}
              </div>

              {/* Contador de páginas */}
              <div className="absolute bottom-2 right-2">
                <Badge variant="secondary" className="text-xs">
                  {document.totalPages} pág.
                </Badge>
              </div>
            </div>

            <CardContent className="p-3">
              <div className="space-y-2">
                <h4 className="font-medium text-sm truncate">
                  {document.name}
                </h4>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{document.metadata.category}</span>
                  <span>
                    {new Date(document.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {document.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {document.tags.slice(0, 2).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs px-1 py-0"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {document.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        +{document.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem onClick={() => onDocumentOpen(document)}>
          <Eye className="h-4 w-4 mr-2" />
          Visualizar Flipbook
        </ContextMenuItem>
        <ContextMenuItem onClick={() => setEditingDocument(document)}>
          <Settings className="h-4 w-4 mr-2" />
          Configurar Monetização
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem
              onClick={() => onDocumentShare(document, "whatsapp")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              WhatsApp
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onDocumentShare(document, "link")}>
              <Link2 className="h-4 w-4 mr-2" />
              Link Direto
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onDocumentShare(document, "embed")}>
              <Globe className="h-4 w-4 mr-2" />
              Código Embed
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => onDocumentDelete(document.id)}
          className="text-red-600"
        >
          <Download className="h-4 w-4 mr-2" />
          Baixar PDF
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );

  return (
    <TooltipProvider>
      <div className={`space-y-6 ${className}`}>
        {/* Header da Estante Digital */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Estante Digital</h2>
              <p className="text-sm text-muted-foreground">
                {documents.length} documento(s) •{" "}
                {documents.filter((d) => d.monetization.enabled).length}{" "}
                monetizado(s)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recentes</SelectItem>
                <SelectItem value="name">Nome</SelectItem>
                <SelectItem value="views">Visualizações</SelectItem>
                <SelectItem value="revenue">Receita</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            >
              {viewMode === "grid" ? "Lista" : "Grade"}
            </Button>
          </div>
        </div>

        {/* Filtros e busca */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar documentos na estante..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              <SelectItem value="Livro">Livros</SelectItem>
              <SelectItem value="Manual">Manuais</SelectItem>
              <SelectItem value="Petição">Petições</SelectItem>
              <SelectItem value="Estudo">Material de Estudo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid/Lista de documentos */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedDocuments.map((document) => (
              <Card key={document.id} className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{document.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {document.totalPages} páginas • {document.stats.views}{" "}
                      visualizações
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {document.monetization.enabled && (
                        <Badge className="bg-green-600 text-white text-xs">
                          R$ {document.monetization.price.toFixed(2)}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {document.metadata.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDocumentOpen(document)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingDocument(document)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Viewer de Flipbook */}
        {selectedDocument && (
          <FlipbookViewer
            document={selectedDocument}
            onClose={() => setSelectedDocument(null)}
            onPageChange={(page) => {
              // Atualizar página atual do documento
            }}
            onPurchase={async (documentId) => {
              // Integração com Stripe
              window.open(`/payment/stripe/${documentId}`, "_blank");
            }}
          />
        )}

        {/* Dialog de configuração de monetização */}
        <Dialog
          open={!!editingDocument}
          onOpenChange={() => setEditingDocument(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurações de Monetização</DialogTitle>
              <DialogDescription>
                Configure como este documento será monetizado na estante digital
              </DialogDescription>
            </DialogHeader>
            {editingDocument && (
              <MonetizationSettings document={editingDocument} />
            )}
          </DialogContent>
        </Dialog>

        {/* Estado vazio */}
        {documents.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Estante Digital vazia</h3>
            <p className="text-muted-foreground mb-6">
              Arraste arquivos PDF para a pasta "Estante Digital" para criar
              flipbooks interativos
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Documento
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
