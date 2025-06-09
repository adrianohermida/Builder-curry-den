import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  Scale,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Phone,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  MapPin,
  User,
  Building,
  Tag,
  Share2,
  Download,
  Star,
  Bell,
  SwipeUp,
  Menu,
  X,
  Zap,
  TrendingUp,
  Activity,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCRM, type Processo } from "@/hooks/useCRM";
import { useProcessoApi } from "@/services/ProcessoApiService";
import { toast } from "sonner";

interface SwipeAction {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  action: (processo: Processo) => void;
}

const ProcessosMobile: React.FC = () => {
  const { processosFiltrados, filtros, atualizarFiltros, editarProcesso } =
    useCRM();
  const { consultarTJSP, criarAlerta } = useProcessoApi();

  const [selectedProcesso, setSelectedProcesso] = useState<Processo | null>(
    null,
  );
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "compact">("cards");
  const [swipeDirection, setSwipeDirection] = useState<string>("");
  const [pullToRefresh, setPullToRefresh] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [sortBy, setSortBy] = useState<"data" | "valor" | "cliente" | "risco">(
    "data",
  );
  const [showQuickActions, setShowQuickActions] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtTop, setIsAtTop] = useState(true);

  // Configurações de swipe actions
  const leftSwipeActions: SwipeAction[] = [
    {
      id: "favorite",
      label: "Favoritar",
      icon: Star,
      color: "bg-yellow-500",
      action: (processo) => {
        toast.success(`${processo.numero} favoritado!`);
      },
    },
    {
      id: "alert",
      label: "Alerta",
      icon: Bell,
      color: "bg-blue-500",
      action: async (processo) => {
        const sucesso = await criarAlerta(
          processo.numero,
          "prazo",
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          "Lembrete do processo",
          3,
        );
        if (sucesso) {
          toast.success("Alerta criado!");
        }
      },
    },
  ];

  const rightSwipeActions: SwipeAction[] = [
    {
      id: "edit",
      label: "Editar",
      icon: Edit,
      color: "bg-orange-500",
      action: (processo) => {
        setSelectedProcesso(processo);
      },
    },
    {
      id: "share",
      label: "Compartilhar",
      icon: Share2,
      color: "bg-green-500",
      action: (processo) => {
        if (navigator.share) {
          navigator.share({
            title: `Processo ${processo.numero}`,
            text: `${processo.assunto} - Cliente: ${processo.cliente}`,
            url: window.location.href,
          });
        } else {
          toast.success("Link copiado para área de transferência!");
        }
      },
    },
  ];

  // Detecta scroll para mostrar/esconder elementos
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollTop } = scrollRef.current;
        setIsAtTop(scrollTop < 50);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll, { passive: true });
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Pull to refresh
  const handlePullToRefresh = async () => {
    if (isAtTop) {
      setPullToRefresh(true);

      // Simula refresh dos dados
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Dados atualizados!");
      setPullToRefresh(false);
    }
  };

  // Ordenação dos processos
  const processosSortedos = React.useMemo(() => {
    return [...processosFiltrados].sort((a, b) => {
      switch (sortBy) {
        case "data":
          return (
            new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime()
          );
        case "valor":
          return b.valor - a.valor;
        case "cliente":
          return a.cliente.localeCompare(b.cliente);
        case "risco":
          const riskOrder = { alto: 3, medio: 2, baixo: 1 };
          return riskOrder[b.risco] - riskOrder[a.risco];
        default:
          return 0;
      }
    });
  }, [processosFiltrados, sortBy]);

  const getRiscoColor = (risco: string) => {
    const colors = {
      baixo: "text-green-600 bg-green-50",
      medio: "text-yellow-600 bg-yellow-50",
      alto: "text-red-600 bg-red-50",
    };
    return colors[risco as keyof typeof colors] || colors.baixo;
  };

  const getRiscoIcon = (risco: string) => {
    if (risco === "alto") return <AlertTriangle className="h-3 w-3" />;
    if (risco === "medio") return <Clock className="h-3 w-3" />;
    return <CheckCircle className="h-3 w-3" />;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      ativo: "bg-blue-500",
      suspenso: "bg-yellow-500",
      arquivado: "bg-gray-500",
      encerrado: "bg-green-500",
    };
    return colors[status as keyof typeof colors] || colors.ativo;
  };

  const handleSwipe = (processo: Processo, direction: "left" | "right") => {
    const actions = direction === "left" ? leftSwipeActions : rightSwipeActions;
    const action = actions[0]; // Por simplicidade, usa a primeira ação
    action.action(processo);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
      {/* Header fixo com busca */}
      <motion.div
        className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 space-y-3"
        initial={false}
        animate={{
          boxShadow: isAtTop ? "none" : "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {/* Top bar com título e ações */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Processos
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {processosSortedos.length} processos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowQuickActions(!showQuickActions)}
            >
              <Plus className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="h-4 w-4 mr-2" />
                  Relatório
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="h-4 w-4 mr-2" />
                  Alertas
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Barra de busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por número, cliente, assunto..."
            className="pl-10 pr-10 h-10"
            value={filtros.busca}
            onChange={(e) => atualizarFiltros({ busca: e.target.value })}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter
              className={`h-4 w-4 ${showFilters ? "text-blue-600" : "text-gray-400"}`}
            />
          </Button>
        </div>

        {/* Filtros expandidos */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-3">
                <Select
                  value={filtros.status}
                  onValueChange={(value) => atualizarFiltros({ status: value })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="suspenso">Suspenso</SelectItem>
                    <SelectItem value="arquivado">Arquivado</SelectItem>
                    <SelectItem value="encerrado">Encerrado</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filtros.area}
                  onValueChange={(value) => atualizarFiltros({ area: value })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    <SelectItem value="Família">Família</SelectItem>
                    <SelectItem value="Trabalhista">Trabalhista</SelectItem>
                    <SelectItem value="Cível">Cível</SelectItem>
                    <SelectItem value="Criminal">Criminal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Ordenar por:</span>
                  <Select
                    value={sortBy}
                    onValueChange={(value: any) => setSortBy(value)}
                  >
                    <SelectTrigger className="w-auto h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="data">Data</SelectItem>
                      <SelectItem value="valor">Valor</SelectItem>
                      <SelectItem value="cliente">Cliente</SelectItem>
                      <SelectItem value="risco">Risco</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "cards" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("cards")}
                  >
                    <Menu className="h-3 w-3" />
                  </Button>
                  <Button
                    variant={viewMode === "compact" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("compact")}
                  >
                    <Activity className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quick Actions Floating */}
      <AnimatePresence>
        {showQuickActions && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute top-20 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 space-y-1"
          >
            <Button size="sm" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Novo Processo
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
            >
              <Search className="h-4 w-4 mr-2" />
              Consultar TJSP
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Agendar Audiência
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
            >
              <Bell className="h-4 w-4 mr-2" />
              Criar Alerta
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay para fechar quick actions */}
      {showQuickActions && (
        <div
          className="absolute inset-0 z-40"
          onClick={() => setShowQuickActions(false)}
        />
      )}

      {/* Pull to refresh indicator */}
      <AnimatePresence>
        {pullToRefresh && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-16 left-1/2 transform -translate-x-1/2 z-30 bg-blue-600 text-white px-4 py-2 rounded-full text-sm shadow-lg"
          >
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Atualizando...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de processos */}
      <ScrollArea ref={scrollRef} className="flex-1 px-4">
        <div className="py-4 space-y-3">
          {/* Indicador de pull to refresh */}
          <motion.div
            className="h-12 flex items-center justify-center text-gray-400"
            onPanStart={() => {
              if (isAtTop) handlePullToRefresh();
            }}
          >
            <SwipeUp className="h-5 w-5" />
            <span className="ml-2 text-sm">Deslize para atualizar</span>
          </motion.div>

          <AnimatePresence>
            {processosSortedos.map((processo, index) => (
              <motion.div
                key={processo.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
                drag="x"
                dragConstraints={{ left: -120, right: 120 }}
                dragElastic={0.2}
                onDragEnd={(_, info: PanInfo) => {
                  const threshold = 80;
                  if (info.offset.x > threshold) {
                    handleSwipe(processo, "right");
                  } else if (info.offset.x < -threshold) {
                    handleSwipe(processo, "left");
                  }
                }}
                whileDrag={{ scale: 1.02, zIndex: 10 }}
              >
                {/* Swipe actions background */}
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    {leftSwipeActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <div
                          key={action.id}
                          className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center`}
                        >
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    {rightSwipeActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <div
                          key={action.id}
                          className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center`}
                        >
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Card do processo */}
                <Card className="relative bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* Indicador de status */}
                  <div
                    className={`absolute top-0 left-0 w-1 h-full ${getStatusColor(processo.status)}`}
                  />

                  <CardContent className="p-4 pl-5">
                    {viewMode === "cards" ? (
                      <div className="space-y-3">
                        {/* Header do card */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <button
                              className="font-mono text-sm font-medium text-blue-600 dark:text-blue-400 truncate block text-left"
                              onClick={() => setSelectedProcesso(processo)}
                            >
                              {processo.numero}
                            </button>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                              {processo.assunto}
                            </p>
                          </div>

                          <div
                            className={`flex items-center gap-1 ${getRiscoColor(processo.risco)} px-2 py-1 rounded-full`}
                          >
                            {getRiscoIcon(processo.risco)}
                            <span className="text-xs font-medium capitalize">
                              {processo.risco}
                            </span>
                          </div>
                        </div>

                        {/* Informações do cliente */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <button className="text-sm font-medium text-gray-900 dark:text-white truncate text-left">
                              {processo.cliente}
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <MessageSquare className="h-3 w-3 text-gray-400" />
                          </div>
                        </div>

                        {/* Detalhes do processo */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="flex items-center gap-1">
                            <Scale className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {processo.area}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Building className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400 truncate">
                              {processo.tribunal.split(" ")[0]}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-green-600" />
                            <span className="text-green-600 font-medium">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                                maximumFractionDigits: 0,
                              }).format(processo.valor)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400 truncate">
                              {processo.responsavel.split(" ")[0]}
                            </span>
                          </div>
                        </div>

                        {/* Próxima audiência */}
                        {processo.proximaAudiencia && (
                          <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg">
                            <Calendar className="h-4 w-4 text-orange-600" />
                            <div className="flex-1">
                              <p className="text-xs font-medium text-orange-800 dark:text-orange-200">
                                Próxima Audiência
                              </p>
                              <p className="text-xs text-orange-600">
                                {new Intl.DateTimeFormat("pt-BR", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                }).format(processo.proximaAudiencia)}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        {processo.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {processo.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs px-2 py-0.5"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {processo.tags.length > 3 && (
                              <Badge
                                variant="outline"
                                className="text-xs px-2 py-0.5"
                              >
                                +{processo.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Modo compacto
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <button
                              className="font-mono text-sm font-medium text-blue-600 dark:text-blue-400"
                              onClick={() => setSelectedProcesso(processo)}
                            >
                              {processo.numero.split("-")[0]}
                            </button>
                            <div
                              className={`flex items-center gap-1 ${getRiscoColor(processo.risco)} px-1.5 py-0.5 rounded`}
                            >
                              {getRiscoIcon(processo.risco)}
                            </div>
                          </div>
                          <p className="text-xs text-gray-900 dark:text-white font-medium truncate">
                            {processo.cliente}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {processo.area} •{" "}
                            {processo.responsavel.split(" ")[0]}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                              maximumFractionDigits: 0,
                            }).format(processo.valor)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Intl.DateTimeFormat("pt-BR").format(
                              processo.dataInicio,
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Estado vazio */}
          {processosSortedos.length === 0 && (
            <div className="text-center py-16">
              <Scale className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhum processo encontrado
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {filtros.busca || filtros.status || filtros.area
                  ? "Tente ajustar os filtros de busca"
                  : "Você ainda não tem processos cadastrados"}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Processo
              </Button>
            </div>
          )}

          {/* Espaçamento no final */}
          <div className="h-20" />
        </div>
      </ScrollArea>

      {/* Sheet de detalhes do processo */}
      <Sheet
        open={!!selectedProcesso}
        onOpenChange={() => setSelectedProcesso(null)}
      >
        <SheetContent side="bottom" className="h-[90vh] p-0">
          {selectedProcesso && (
            <div className="h-full flex flex-col">
              <SheetHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <SheetTitle className="text-base font-mono">
                      {selectedProcesso.numero}
                    </SheetTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {selectedProcesso.assunto}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center gap-1 ${getRiscoColor(selectedProcesso.risco)} px-2 py-1 rounded-full`}
                    >
                      {getRiscoIcon(selectedProcesso.risco)}
                      <span className="text-xs font-medium capitalize">
                        {selectedProcesso.risco}
                      </span>
                    </div>

                    <Badge
                      className={`${getStatusColor(selectedProcesso.status)} text-white`}
                    >
                      {selectedProcesso.status}
                    </Badge>
                  </div>
                </div>
              </SheetHeader>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                  {/* Informações do cliente */}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Cliente
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <p className="font-medium">{selectedProcesso.cliente}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <button className="flex items-center gap-1 text-blue-600">
                          <Phone className="h-3 w-3" />
                          Ligar
                        </button>
                        <button className="flex items-center gap-1 text-blue-600">
                          <MessageSquare className="h-3 w-3" />
                          WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Detalhes do processo */}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      Detalhes
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Área:
                        </span>
                        <span className="text-sm font-medium">
                          {selectedProcesso.area}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Tribunal:
                        </span>
                        <span className="text-sm font-medium">
                          {selectedProcesso.tribunal}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Vara:
                        </span>
                        <span className="text-sm font-medium">
                          {selectedProcesso.vara}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Responsável:
                        </span>
                        <span className="text-sm font-medium">
                          {selectedProcesso.responsavel}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Valor:
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(selectedProcesso.valor)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Data Início:
                        </span>
                        <span className="text-sm font-medium">
                          {new Intl.DateTimeFormat("pt-BR").format(
                            selectedProcesso.dataInicio,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Próximas ações */}
                  {selectedProcesso.proximaAudiencia && (
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Próximas Ações
                      </h3>
                      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-orange-600" />
                          <div>
                            <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                              Audiência Agendada
                            </p>
                            <p className="text-xs text-orange-600">
                              {new Intl.DateTimeFormat("pt-BR", {
                                dateStyle: "long",
                                timeStyle: "short",
                              }).format(selectedProcesso.proximaAudiencia)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedProcesso.tags.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProcesso.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ações rápidas */}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Ações Rápidas
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Documentos
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Consultar TJSP
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Compartilhar
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ProcessosMobile;
