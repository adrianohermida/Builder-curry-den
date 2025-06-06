import { useState, useEffect } from "react";
import {
  FileText,
  Loader2,
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Clock,
  Timer,
  Bookmark,
  Grid3X3,
  List,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Publication {
  id: string;
  title: string;
  content: string;
  date: string;
  court: string;
  process: string;
  type: string;
  keywords: string[];
  isRead: boolean;
  urgency: "low" | "medium" | "high" | "critical";
  deadline?: string;
  source: string;
  isOfflineAvailable: boolean;
}

interface PublicacoesClienteProps {
  cpf: string;
  clienteName?: string;
  onPublicationSelect?: (publication: Publication) => void;
}

export function PublicacoesCliente({
  cpf,
  clienteName,
  onPublicationSelect,
}: PublicacoesClienteProps) {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPublications, setSelectedPublications] = useState<string[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [courtFilter, setCourtFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [readFilter, setReadFilter] = useState<string>("unread");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch publications from Advise API
  const fetchPublications = async (showToast = true) => {
    if (!cpf) return;

    setLoading(true);

    try {
      if (showToast) {
        toast.loading("Consultando publicações...", {
          id: "fetch-publications",
        });
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockPublications: Publication[] = [
        {
          id: "1",
          title:
            "Intimação para Manifestação - Processo 1234567-89.2024.8.26.0001",
          content:
            "Fica a parte autora intimada para se manifestar sobre os documentos juntados aos autos pela parte requerida, no prazo de 15 (quinze) dias, sob pena de preclusão.",
          date: "2024-12-16",
          court: "Comarca de São Paulo",
          process: "1234567-89.2024.8.26.0001",
          type: "intimacao",
          keywords: ["intimação", "manifestação", "documentos", "prazo"],
          isRead: false,
          urgency: "critical",
          deadline: "2024-12-31",
          source: "TJSP",
          isOfflineAvailable: true,
        },
        {
          id: "2",
          title: "Designação de Audiência - Processo 9876543-21.2024.8.26.0002",
          content:
            "Fica designada audiência de conciliação para o dia 20/01/2025, às 14h30min, na sala de audiências do juízo.",
          date: "2024-12-15",
          court: "TRT 2ª Região",
          process: "9876543-21.2024.8.26.0002",
          type: "audiencia",
          keywords: ["audiência", "conciliação", "designação"],
          isRead: false,
          urgency: "high",
          deadline: "2025-01-20",
          source: "TRT2",
          isOfflineAvailable: true,
        },
        {
          id: "3",
          title: "Sentença Publicada - Processo 5555555-55.2024.8.26.0003",
          content:
            "Sentença de mérito proferida. JULGO PROCEDENTE o pedido formulado na inicial, condenando a parte requerida ao pagamento...",
          date: "2024-12-10",
          court: "TJSP",
          process: "5555555-55.2024.8.26.0003",
          type: "sentenca",
          keywords: ["sentença", "procedente", "mérito", "condenação"],
          isRead: true,
          urgency: "medium",
          source: "TJSP",
          isOfflineAvailable: false,
        },
        {
          id: "4",
          title: "Prazo para Recurso - Processo 7777777-77.2024.8.26.0004",
          content:
            "Fica aberto o prazo de 15 dias para interposição de recurso de apelação, contados da intimação desta decisão.",
          date: "2024-12-08",
          court: "Comarca de Guarulhos",
          process: "7777777-77.2024.8.26.0004",
          type: "prazo",
          keywords: ["recurso", "apelação", "prazo", "intimação"],
          isRead: false,
          urgency: "critical",
          deadline: "2024-12-23",
          source: "TJSP",
          isOfflineAvailable: true,
        },
      ];

      setPublications(mockPublications);
      setLastUpdate(new Date());

      if (showToast) {
        const unreadCount = mockPublications.filter((p) => !p.isRead).length;
        const criticalCount = mockPublications.filter(
          (p) => p.urgency === "critical",
        ).length;
        toast.success(
          `${mockPublications.length} publicações encontradas${unreadCount > 0 ? ` (${unreadCount} não lidas` : ""}${criticalCount > 0 ? `, ${criticalCount} críticas)` : unreadCount > 0 ? ")" : ""}`,
          { id: "fetch-publications" },
        );
      }
    } catch (error) {
      if (isOffline) {
        toast.warning("Modo offline - mostrando dados salvos", {
          id: "fetch-publications",
        });
        // Load cached data in real implementation
      } else {
        toast.error("Erro ao consultar publicações", {
          id: "fetch-publications",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications(false);
  }, [cpf]);

  // Mark publications as read
  const markAsRead = async (publicationIds: string[]) => {
    try {
      toast.loading("Marcando como lido...", { id: "mark-read" });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setPublications((prev) =>
        prev.map((pub) =>
          publicationIds.includes(pub.id) ? { ...pub, isRead: true } : pub,
        ),
      );

      toast.success(
        `${publicationIds.length} publicação(ões) marcada(s) como lida(s)`,
        { id: "mark-read" },
      );
      setSelectedPublications([]);
    } catch (error) {
      toast.error("Erro ao marcar como lido", { id: "mark-read" });
    }
  };

  // Filter publications
  const filteredPublications = publications.filter((publication) => {
    const matchesSearch =
      publication.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      publication.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      publication.keywords.some((k) =>
        k.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesCourt =
      courtFilter === "all" || publication.court.includes(courtFilter);
    const matchesType = typeFilter === "all" || publication.type === typeFilter;
    const matchesUrgency =
      urgencyFilter === "all" || publication.urgency === urgencyFilter;
    const matchesRead =
      readFilter === "all" ||
      (readFilter === "read" && publication.isRead) ||
      (readFilter === "unread" && !publication.isRead);

    const publicationDate = new Date(publication.date);
    const matchesDateFrom = !dateFrom || publicationDate >= dateFrom;
    const matchesDateTo = !dateTo || publicationDate <= dateTo;

    return (
      matchesSearch &&
      matchesCourt &&
      matchesType &&
      matchesUrgency &&
      matchesRead &&
      matchesDateFrom &&
      matchesDateTo
    );
  });

  const getUrgencyBadge = (urgency: Publication["urgency"]) => {
    switch (urgency) {
      case "critical":
        return <Badge variant="destructive">Crítico</Badge>;
      case "high":
        return <Badge className="bg-orange-600">Alto</Badge>;
      case "medium":
        return <Badge variant="default">Médio</Badge>;
      case "low":
        return <Badge variant="secondary">Baixo</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "intimacao":
        return <Badge variant="destructive">Intimação</Badge>;
      case "audiencia":
        return <Badge variant="default">Audiência</Badge>;
      case "sentenca":
        return <Badge className="bg-purple-600">Sentença</Badge>;
      case "prazo":
        return <Badge className="bg-orange-600">Prazo</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getDeadlineCountdown = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: "Vencido", color: "text-red-600" };
    if (diffDays === 0) return { text: "Hoje", color: "text-red-600" };
    if (diffDays === 1) return { text: "1 dia", color: "text-orange-600" };
    if (diffDays <= 3)
      return { text: `${diffDays} dias`, color: "text-orange-600" };
    if (diffDays <= 7)
      return { text: `${diffDays} dias`, color: "text-yellow-600" };
    return { text: `${diffDays} dias`, color: "text-green-600" };
  };

  const courts = Array.from(new Set(publications.map((p) => p.court)));
  const types = Array.from(new Set(publications.map((p) => p.type)));

  const PublicationCard = ({
    publication,
    index,
  }: {
    publication: Publication;
    index: number;
  }) => {
    const countdown = publication.deadline
      ? getDeadlineCountdown(publication.deadline)
      : null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`border rounded-lg p-4 transition-all hover:shadow-md ${
          !publication.isRead
            ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200"
            : ""
        } ${
          publication.urgency === "critical"
            ? "border-red-500 bg-red-50 dark:bg-red-950/20"
            : publication.urgency === "high"
              ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
              : ""
        }`}
      >
        <div className="flex items-start space-x-4">
          <Checkbox
            checked={selectedPublications.includes(publication.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedPublications((prev) => [...prev, publication.id]);
              } else {
                setSelectedPublications((prev) =>
                  prev.filter((id) => id !== publication.id),
                );
              }
            }}
            className="mt-1"
          />

          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-sm leading-relaxed">
                {publication.title}
              </h3>
              <div className="flex items-center space-x-2 ml-4">
                {!publication.isRead && (
                  <div className="w-2 h-2 rounded-full bg-[rgb(var(--theme-primary))]" />
                )}
                {publication.urgency === "critical" && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
                {publication.isOfflineAvailable ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {getTypeBadge(publication.type)}
              {getUrgencyBadge(publication.urgency)}
              <Badge variant="outline" className="text-xs">
                {publication.source}
              </Badge>
              {publication.deadline && (
                <div className="flex items-center space-x-1">
                  <Timer className="h-3 w-3" />
                  <span className={`text-xs font-medium ${countdown?.color}`}>
                    {countdown?.text}
                  </span>
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {publication.content}
            </p>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(publication.date).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{publication.court}</span>
                </div>
                <span className="font-mono">{publication.process}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>{publication.title}</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-96">
                      <div className="space-y-4 p-4">
                        <div className="flex flex-wrap gap-2">
                          {getTypeBadge(publication.type)}
                          {getUrgencyBadge(publication.urgency)}
                          <Badge variant="outline">{publication.court}</Badge>
                          <Badge variant="outline">{publication.source}</Badge>
                          {publication.deadline && (
                            <Badge className="bg-orange-600">
                              Prazo:{" "}
                              {new Date(
                                publication.deadline,
                              ).toLocaleDateString("pt-BR")}
                            </Badge>
                          )}
                        </div>
                        <div className="prose dark:prose-invert max-w-none">
                          <p>{publication.content}</p>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground border-t pt-4">
                          <span>Processo: {publication.process}</span>
                          <span>
                            Data:{" "}
                            {new Date(publication.date).toLocaleDateString(
                              "pt-BR",
                            )}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {publication.keywords.map((keyword) => (
                            <Badge
                              key={keyword}
                              variant="secondary"
                              className="text-xs"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAsRead([publication.id])}
                  disabled={publication.isRead}
                >
                  {publication.isRead ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>

                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="sm">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <FileText className="h-6 w-6" />
              <span>Publicações do Cliente</span>
              {isOffline && (
                <Badge variant="outline" className="ml-2">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </Badge>
              )}
            </h2>
            {clienteName && (
              <p className="text-muted-foreground">Cliente: {clienteName}</p>
            )}
            <p className="text-sm text-muted-foreground">CPF: {cpf}</p>
          </div>
          <div className="flex items-center space-x-2">
            {lastUpdate && (
              <p className="text-sm text-muted-foreground">
                Última atualização: {lastUpdate.toLocaleTimeString("pt-BR")}
              </p>
            )}
            <Button
              onClick={() => fetchPublications(true)}
              disabled={loading || isOffline}
              variant="outline"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Atualizar
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total
                  </p>
                  <p className="text-2xl font-bold">{publications.length}</p>
                </div>
                <FileText className="h-8 w-8 text-[rgb(var(--theme-primary))]" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Não Lidas
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {publications.filter((p) => !p.isRead).length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Críticas
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {
                      publications.filter((p) => p.urgency === "critical")
                        .length
                    }
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Com Prazo
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {publications.filter((p) => p.deadline).length}
                  </p>
                </div>
                <Timer className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Filters */}
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por título, conteúdo ou palavras-chave..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  {selectedPublications.length > 0 && (
                    <Button
                      onClick={() => markAsRead(selectedPublications)}
                      variant="outline"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Marcar como Lido ({selectedPublications.length})
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() =>
                      setViewMode(viewMode === "list" ? "cards" : "list")
                    }
                  >
                    {viewMode === "list" ? (
                      <Grid3X3 className="h-4 w-4" />
                    ) : (
                      <List className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <Select value={readFilter} onValueChange={setReadFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="unread">Não Lidas</SelectItem>
                    <SelectItem value="read">Lidas</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Urgência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas Urgências</SelectItem>
                    <SelectItem value="critical">Crítico</SelectItem>
                    <SelectItem value="high">Alto</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="low">Baixo</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={courtFilter} onValueChange={setCourtFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Comarca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Comarcas</SelectItem>
                    {courts.map((court) => (
                      <SelectItem key={court} value={court}>
                        {court}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === "intimacao"
                          ? "Intimação"
                          : type === "audiencia"
                            ? "Audiência"
                            : type === "sentenca"
                              ? "Sentença"
                              : type === "prazo"
                                ? "Prazo"
                                : type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <DatePicker
                  date={dateFrom}
                  onDateChange={setDateFrom}
                  placeholder="Data inicial"
                />

                <DatePicker
                  date={dateTo}
                  onDateChange={setDateTo}
                  placeholder="Data final"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Publications List */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Publicações Encontradas</CardTitle>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={
                    selectedPublications.length ===
                      filteredPublications.length &&
                    filteredPublications.length > 0
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedPublications(
                        filteredPublications.map((p) => p.id),
                      );
                    } else {
                      setSelectedPublications([]);
                    }
                  }}
                />
                <span className="text-sm text-muted-foreground">
                  Selecionar todos
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-full bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : filteredPublications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">
                  Nenhuma publicação encontrada
                </h3>
                <p className="text-muted-foreground">
                  {publications.length === 0
                    ? 'Clique em "Atualizar" para consultar publicações'
                    : "Tente ajustar os filtros de busca"}
                </p>
              </div>
            ) : viewMode === "cards" && filteredPublications.length > 10 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredPublications.map((publication, index) => (
                    <motion.div
                      key={publication.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <PublicationCard
                        publication={publication}
                        index={index}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredPublications.map((publication, index) => (
                    <PublicationCard
                      key={publication.id}
                      publication={publication}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
}
