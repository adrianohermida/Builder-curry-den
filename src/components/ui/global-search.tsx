import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FileText,
  Users,
  Building,
  Calendar,
  CheckSquare,
  Brain,
  DollarSign,
  FileSignature,
  FolderOpen,
  MessageSquare,
  Loader2,
  ArrowUpRight,
  Clock,
  Star,
  Hash,
  User,
  MapPin,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDebounce } from "@/hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SearchResult {
  id: string;
  type:
    | "cliente"
    | "processo"
    | "contrato"
    | "documento"
    | "tarefa"
    | "publicacao"
    | "ticket"
    | "evento";
  title: string;
  subtitle?: string;
  description?: string;
  status?: string;
  priority?: "baixa" | "media" | "alta" | "urgente";
  url: string;
  metadata?: Record<string, any>;
  relevance?: number;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  date?: string;
  client?: {
    id: string;
    nome: string;
  };
}

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const typeConfig = {
  cliente: { icon: Users, label: "Cliente", color: "bg-blue-500" },
  processo: { icon: FileText, label: "Processo", color: "bg-green-500" },
  contrato: { icon: FileSignature, label: "Contrato", color: "bg-purple-500" },
  documento: { icon: FolderOpen, label: "Documento", color: "bg-orange-500" },
  tarefa: { icon: CheckSquare, label: "Tarefa", color: "bg-yellow-500" },
  publicacao: { icon: FileText, label: "Publicação", color: "bg-red-500" },
  ticket: { icon: MessageSquare, label: "Ticket", color: "bg-cyan-500" },
  evento: { icon: Calendar, label: "Evento", color: "bg-indigo-500" },
};

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 300);

  // Mock search function - replace with actual API call
  const performSearch = async (
    searchQuery: string,
  ): Promise<SearchResult[]> => {
    if (!searchQuery.trim()) return [];

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    const mockResults: SearchResult[] = [
      {
        id: "cli-001",
        type: "cliente",
        title: "João da Silva",
        subtitle: "CPF: 123.456.789-00",
        description: "Cliente desde 2023 - 3 processos ativos",
        status: "ativo",
        url: "/crm?cliente=cli-001",
        badge: "Ativo",
        client: { id: "cli-001", nome: "João da Silva" },
        relevance: 95,
      },
      {
        id: "proc-001",
        type: "processo",
        title: "1001234-12.2024.5.02.0001",
        subtitle: "Ação Trabalhista - Horas Extras",
        description: "Cliente: João da Silva | Status: Em andamento",
        status: "em_andamento",
        priority: "alta",
        url: "/crm?processo=proc-001",
        badge: "Em Andamento",
        date: "2024-01-15",
        client: { id: "cli-001", nome: "João da Silva" },
        relevance: 90,
      },
      {
        id: "cont-001",
        type: "contrato",
        title: "Contrato de Prestação de Serviços #001",
        subtitle: "João da Silva",
        description: "Valor: R$ 2.500,00 | Vigência: 12 meses",
        status: "ativo",
        url: "/contratos?id=cont-001",
        badge: "Ativo",
        date: "2024-01-10",
        client: { id: "cli-001", nome: "João da Silva" },
        relevance: 85,
      },
      {
        id: "doc-001",
        type: "documento",
        title: "Petição Inicial - Trabalhista.pdf",
        subtitle: "Processo: 1001234-12.2024.5.02.0001",
        description: "Documento de 15 páginas | Criado em 15/01/2024",
        url: "/ged?documento=doc-001",
        badge: "PDF",
        date: "2024-01-15",
        client: { id: "cli-001", nome: "João da Silva" },
        relevance: 80,
      },
      {
        id: "tar-001",
        type: "tarefa",
        title: "Preparar defesa para audiência",
        subtitle: "Vencimento: 20/01/2024",
        description: "Processo: 1001234-12.2024.5.02.0001",
        status: "pendente",
        priority: "alta",
        url: "/tarefas?id=tar-001",
        badge: "Pendente",
        date: "2024-01-20",
        client: { id: "cli-001", nome: "João da Silva" },
        relevance: 75,
      },
    ];

    // Filter results based on query
    return mockResults
      .filter(
        (result) =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
  };

  // Search effect
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    performSearch(debouncedQuery)
      .then(setResults)
      .finally(() => setIsSearching(false));
  }, [debouncedQuery]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            handleSelectResult(results[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onOpenChange(false);
          break;
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, results, selectedIndex, onOpenChange]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleSelectResult = (result: SearchResult) => {
    // Add to recent searches
    setRecentSearches((prev) => {
      const newRecent = [query, ...prev.filter((q) => q !== query)].slice(0, 5);
      localStorage.setItem(
        "lawdesk-recent-searches",
        JSON.stringify(newRecent),
      );
      return newRecent;
    });

    // Navigate to result
    navigate(result.url);
    onOpenChange(false);
    setQuery("");

    toast.success(
      `Navegando para ${typeConfig[result.type].label}: ${result.title}`,
    );
  };

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem("lawdesk-recent-searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading recent searches:", e);
      }
    }
  }, []);

  const quickActions = [
    { label: "Novo Cliente", url: "/crm?action=novo-cliente", icon: Users },
    { label: "Nova Tarefa", url: "/tarefas?action=nova", icon: CheckSquare },
    {
      label: "Novo Contrato",
      url: "/contratos?action=novo",
      icon: FileSignature,
    },
    { label: "Upload GED", url: "/ged?action=upload", icon: FolderOpen },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0 gap-0">
        <DialogHeader className="px-4 py-3 border-b">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar clientes, processos, documentos, tarefas..."
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
              autoFocus
            />
            {isSearching && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[60vh]">
          <div className="p-4">
            {!query.trim() ? (
              <div className="space-y-6">
                {/* Quick Actions */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Ações Rápidas
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="justify-start h-auto py-3 px-3"
                        onClick={() => {
                          navigate(action.url);
                          onOpenChange(false);
                        }}
                      >
                        <action.icon className="h-4 w-4 mr-2" />
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Buscas Recentes
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setRecentSearches([]);
                          localStorage.removeItem("lawdesk-recent-searches");
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="w-full justify-start text-left h-auto py-2"
                          onClick={() => setQuery(search)}
                        >
                          <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                          {search}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {results.length === 0 && !isSearching && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhum resultado encontrado para "{query}"</p>
                  </div>
                )}

                <AnimatePresence>
                  {results.map((result, index) => {
                    const config = typeConfig[result.type];
                    const Icon = config.icon;
                    const isSelected = index === selectedIndex;

                    return (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            isSelected ? "ring-2 ring-primary bg-accent" : ""
                          }`}
                          onClick={() => handleSelectResult(result)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              <div
                                className={`p-2 rounded-md ${config.color} text-white`}
                              >
                                <Icon className="h-4 w-4" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-sm truncate">
                                    {result.title}
                                  </h4>
                                  {result.badge && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {result.badge}
                                    </Badge>
                                  )}
                                  {result.priority && (
                                    <Badge
                                      variant={
                                        result.priority === "urgente" ||
                                        result.priority === "alta"
                                          ? "destructive"
                                          : result.priority === "media"
                                            ? "default"
                                            : "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      {result.priority}
                                    </Badge>
                                  )}
                                </div>

                                {result.subtitle && (
                                  <p className="text-xs text-muted-foreground mb-1">
                                    {result.subtitle}
                                  </p>
                                )}

                                {result.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {result.description}
                                  </p>
                                )}

                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {config.label}
                                  </Badge>

                                  {result.client && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <User className="h-3 w-3" />
                                      {result.client.nome}
                                    </div>
                                  )}

                                  {result.date && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(result.date).toLocaleDateString(
                                        "pt-BR",
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-50" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </ScrollArea>

        {query.trim() && (
          <div className="border-t px-4 py-2 text-xs text-muted-foreground">
            Use ↑↓ para navegar • Enter para selecionar • Esc para fechar
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
