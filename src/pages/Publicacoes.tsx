import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Bell,
  Clock,
  AlertTriangle,
  Building,
  Calendar,
  Filter,
  Search,
  Eye,
  EyeOff,
  Bot,
  Download,
  Zap,
  CheckCircle,
  Users,
  Gavel,
  ExternalLink,
  Star,
  Archive,
  CheckSquare,
  Plus,
  RefreshCw,
  MapPin,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PublicacaoDetalhada,
  PublicacaoData,
} from "@/components/CRM/PublicacaoDetalhada";
import { useTarefaIntegration } from "@/hooks/useTarefaIntegration";
import { TarefaCreateModal } from "@/components/Tarefas/TarefaCreateModal";
import { toast } from "sonner";

export default function Publicacoes() {
  const [selectedPublicacao, setSelectedPublicacao] =
    useState<PublicacaoData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUrgency, setFilterUrgency] = useState("all");
  const [filterTribunal, setFilterTribunal] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showArchived, setShowArchived] = useState(false);
  const [activeTab, setActiveTab] = useState("todas");
  const [publicacoes, setPublicacoes] = useState<PublicacaoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { criarTarefaDePublicacao, isModalOpen, modalParams, setModalOpen } =
    useTarefaIntegration();

  // Mock data with enhanced structure
  useEffect(() => {
    const mockPublicacoes: PublicacaoData[] = [
      {
        id: "pub-001",
        numero: "2024001234",
        data: "2024-01-15",
        tribunal: "TRT 2ª Região",
        tipo: "Intimação",
        assunto:
          "Audiência de Conciliação - Processo 1001234-12.2024.5.02.0001",
        urgencia: "alta",
        status: "pendente",
        processo: {
          id: "proc-001",
          numero: "1001234-12.2024.5.02.0001",
          assunto: "Ação Trabalhista - Horas Extras",
        },
        cliente: {
          id: "cli-001",
          nome: "João Silva",
          tipo: "fisica" as const,
        },
        conteudo:
          "Fica V.Sa. intimado(a) para comparecer à audiência de conciliação designada para o dia 20/01/2024, às 14h30min, na sala de audiências deste Tribunal...",
        dataLimite: "2024-01-20",
        visualizada: false,
        arquivada: false,
        tags: ["audiencia", "conciliacao", "trabalhista"],
        responsavel: "Dr. Maria Santos",
        observacoes: "Prazo curto - verificar disponibilidade do cliente",
      },
      {
        id: "pub-002",
        numero: "2024001235",
        data: "2024-01-14",
        tribunal: "TJSP",
        tipo: "Citação",
        assunto: "Ação de Cobrança - Citação da Ré",
        urgencia: "media",
        status: "visualizada",
        processo: {
          id: "proc-002",
          numero: "5001234-12.2023.8.26.0001",
          assunto: "Ação de Cobrança",
        },
        cliente: {
          id: "cli-002",
          nome: "XYZ Tecnologia Ltda",
          tipo: "juridica" as const,
        },
        conteudo:
          "Citação da empresa XYZ Tecnologia Ltda para responder aos termos da ação de cobrança no prazo de 15 dias...",
        dataLimite: "2024-01-29",
        visualizada: true,
        arquivada: false,
        tags: ["citacao", "cobranca", "civil"],
        responsavel: "Dr. Carlos Oliveira",
        observacoes: "Contestação em andamento",
      },
      {
        id: "pub-003",
        numero: "2024001236",
        data: "2024-01-13",
        tribunal: "TST",
        tipo: "Acórdão",
        assunto: "Recurso de Revista - Decisão",
        urgencia: "baixa",
        status: "processada",
        processo: {
          id: "proc-003",
          numero: "2001234-12.2023.5.02.0001",
          assunto: "Recurso de Revista",
        },
        cliente: {
          id: "cli-003",
          nome: "Maria Oliveira",
          tipo: "fisica" as const,
        },
        conteudo:
          "Acórdão do Tribunal Superior do Trabalho negando provimento ao recurso de revista interposto...",
        dataLimite: "2024-01-28",
        visualizada: true,
        arquivada: false,
        tags: ["acordao", "recurso", "tst"],
        responsavel: "Dr. Roberto Lima",
        observacoes: "Recurso negado - analisar outros recursos cabíveis",
      },
    ];

    setTimeout(() => {
      setPublicacoes(mockPublicacoes);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filtered publicações based on search and filters
  const filteredPublicacoes = useMemo(() => {
    let filtered = publicacoes.filter((pub) => !pub.arquivada || showArchived);

    if (searchTerm) {
      filtered = filtered.filter(
        (pub) =>
          pub.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pub.tribunal.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pub.processo?.numero.includes(searchTerm) ||
          pub.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pub.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    if (filterUrgency !== "all") {
      filtered = filtered.filter((pub) => pub.urgencia === filterUrgency);
    }

    if (filterTribunal !== "all") {
      filtered = filtered.filter((pub) => pub.tribunal === filterTribunal);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((pub) => pub.status === filterStatus);
    }

    switch (activeTab) {
      case "pendentes":
        filtered = filtered.filter((pub) => pub.status === "pendente");
        break;
      case "urgentes":
        filtered = filtered.filter(
          (pub) => pub.urgencia === "alta" && pub.status !== "processada",
        );
        break;
      case "vencendo":
        const hoje = new Date();
        const amanha = new Date(hoje);
        amanha.setDate(hoje.getDate() + 3); // próximos 3 dias
        filtered = filtered.filter((pub) => {
          const dataLimite = new Date(pub.dataLimite);
          return dataLimite <= amanha && pub.status !== "processada";
        });
        break;
    }

    return filtered;
  }, [
    publicacoes,
    searchTerm,
    filterUrgency,
    filterTribunal,
    filterStatus,
    showArchived,
    activeTab,
  ]);

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case "alta":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "media":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "baixa":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "visualizada":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "processada":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleViewDetails = (publicacao: PublicacaoData) => {
    setSelectedPublicacao(publicacao);
    setIsDetailModalOpen(true);

    // Mark as visualized
    if (!publicacao.visualizada) {
      setPublicacoes((prev) =>
        prev.map((p) =>
          p.id === publicacao.id
            ? { ...p, visualizada: true, status: "visualizada" }
            : p,
        ),
      );
    }
  };

  const handleCreateTask = (publicacao: PublicacaoData) => {
    criarTarefaDePublicacao(
      publicacao.id,
      `Analisar ${publicacao.tipo} - ${publicacao.tribunal}`,
    );
  };

  const handleMarkAsProcessed = (publicacaoId: string) => {
    setPublicacoes((prev) =>
      prev.map((p) =>
        p.id === publicacaoId ? { ...p, status: "processada" } : p,
      ),
    );
    toast.success("Publicação marcada como processada");
  };

  const handleArchive = (publicacaoId: string) => {
    setPublicacoes((prev) =>
      prev.map((p) => (p.id === publicacaoId ? { ...p, arquivada: true } : p)),
    );
    toast.success("Publicação arquivada");
  };

  const stats = useMemo(
    () => ({
      total: publicacoes.length,
      pendentes: publicacoes.filter(
        (p) => p.status === "pendente" && !p.arquivada,
      ).length,
      urgentes: publicacoes.filter(
        (p) =>
          p.urgencia === "alta" && p.status !== "processada" && !p.arquivada,
      ).length,
      vencendoHoje: publicacoes.filter((p) => {
        const hoje = new Date().toDateString();
        const dataLimite = new Date(p.dataLimite).toDateString();
        return dataLimite === hoje && p.status !== "processada" && !p.arquivada;
      }).length,
    }),
    [publicacoes],
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded" />
            ))}
          </div>
          <div className="h-96 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Publicações Oficiais</h1>
          <p className="text-muted-foreground">
            Diários oficiais, intimações e publicações judiciais
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button
            onClick={() => toast.info("Funcionalidade em desenvolvimento")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Monitorar Processo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Publicações monitoradas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.pendentes}
            </div>
            <p className="text-xs text-muted-foreground">Aguardando análise</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.urgentes}
            </div>
            <p className="text-xs text-muted-foreground">Prioridade alta</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencendo Hoje</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats.vencendoHoje}
            </div>
            <p className="text-xs text-muted-foreground">Requerem atenção</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por assunto, tribunal, processo, cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterUrgency} onValueChange={setFilterUrgency}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Urgência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterTribunal} onValueChange={setFilterTribunal}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Tribunal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="TRT 2ª Região">TRT 2ª Região</SelectItem>
                  <SelectItem value="TJSP">TJSP</SelectItem>
                  <SelectItem value="TST">TST</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="visualizada">Visualizada</SelectItem>
                  <SelectItem value="processada">Processada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="urgentes">Urgentes</TabsTrigger>
          <TabsTrigger value="vencendo">Vencendo</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredPublicacoes.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Nenhuma publicação encontrada
                </h3>
                <p className="text-muted-foreground">
                  Não há publicações que correspondam aos filtros selecionados.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredPublicacoes.map((publicacao) => (
                <motion.div
                  key={publicacao.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card
                    className={`hover:shadow-md transition-all duration-200 ${
                      !publicacao.visualizada
                        ? "border-l-4 border-l-blue-500"
                        : ""
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              className={getUrgenciaColor(publicacao.urgencia)}
                            >
                              {publicacao.urgencia.toUpperCase()}
                            </Badge>
                            <Badge
                              className={getStatusColor(publicacao.status)}
                            >
                              {publicacao.status.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">{publicacao.tipo}</Badge>
                            {!publicacao.visualizada && (
                              <Badge variant="secondary">
                                <Bell className="h-3 w-3 mr-1" />
                                Nova
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-base leading-tight mb-1">
                            {publicacao.assunto}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              <span>{publicacao.tribunal}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(publicacao.data).toLocaleDateString(
                                  "pt-BR",
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                Prazo:{" "}
                                {new Date(
                                  publicacao.dataLimite,
                                ).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCreateTask(publicacao)}
                          >
                            <CheckSquare className="h-4 w-4 mr-2" />
                            Criar Tarefa
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(publicacao)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          {publicacao.cliente && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{publicacao.cliente.nome}</span>
                            </div>
                          )}
                          {publicacao.processo && (
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span className="font-mono text-xs">
                                {publicacao.processo.numero}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{publicacao.responsavel}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {publicacao.status !== "processada" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleMarkAsProcessed(publicacao.id)
                              }
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Marcar como Processada
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleArchive(publicacao.id)}
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {publicacao.tags.length > 0 && (
                        <div className="flex gap-1 mt-3">
                          {publicacao.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      {selectedPublicacao && (
        <PublicacaoDetalhada
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          publicacao={selectedPublicacao}
        />
      )}

      {/* Task Creation Modal */}
      <TarefaCreateModal
        open={isModalOpen}
        onOpenChange={setModalOpen}
        initialParams={modalParams || undefined}
        onSuccess={() => {
          toast.success("Tarefa criada com sucesso!");
        }}
      />
    </div>
  );
}
