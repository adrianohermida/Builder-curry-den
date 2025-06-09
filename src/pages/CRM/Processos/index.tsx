import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Scale,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Upload,
  Download,
  FileSpreadsheet,
  CheckSquare,
  Calendar,
  User,
  Building,
  AlertTriangle,
  Clock,
  DollarSign,
  Tag,
  Settings,
  Grid3X3,
  List,
  Users,
  FileText,
  Bell,
  TrendingUp,
  Activity,
  Zap,
  Shield,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Phone,
  Mail,
  Star,
  Share2,
  Bookmark,
  Target,
  Copy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCRM, Processo } from "@/hooks/useCRM";
import { useProcessoApi } from "@/services/ProcessoApiService";
import { toast } from "sonner";
import ProcessoForm from "./ProcessoForm";
import ProcessoDetalhes from "./ProcessoDetalhes";
import ProcessosMobile from "./ProcessosMobile";

// Detecta se é mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

const ProcessosKanban: React.FC = () => {
  const { processosFiltrados, editarProcesso, excluirProcesso } = useCRM();
  const { consultarTJSP, criarAlerta } = useProcessoApi();
  const navigate = useNavigate();

  const colunas = [
    {
      id: "ativo",
      titulo: "Ativos",
      cor: "bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800",
      contadorCor:
        "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
    },
    {
      id: "suspenso",
      titulo: "Suspensos",
      cor: "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-800",
      contadorCor:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
    },
    {
      id: "arquivado",
      titulo: "Arquivados",
      cor: "bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700",
      contadorCor:
        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
    },
    {
      id: "encerrado",
      titulo: "Encerrados",
      cor: "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800",
      contadorCor:
        "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    },
  ];

  const getRiscoColor = (risco: string) => {
    const colors = {
      baixo: "text-green-600 dark:text-green-400",
      medio: "text-yellow-600 dark:text-yellow-400",
      alto: "text-red-600 dark:text-red-400",
    };
    return colors[risco as keyof typeof colors] || colors.baixo;
  };

  const getRiscoIcon = (risco: string) => {
    if (risco === "alto") return <AlertTriangle className="h-3 w-3" />;
    if (risco === "medio") return <Clock className="h-3 w-3" />;
    return <CheckSquare className="h-3 w-3" />;
  };

  const handleConsultarTJSP = async (processo: Processo) => {
    const resultado = await consultarTJSP(processo.numero);
    if (resultado) {
      // Atualizar processo com dados do TJSP
      await editarProcesso(processo.id, {
        observacoes: `${processo.observacoes || ""}\n\nDados TJSP: Status ${resultado.status}, Última movimentação: ${resultado.movimentacoes[0]?.descricao}`,
      });
    }
  };

  const handleCriarAlerta = async (processo: Processo) => {
    const sucesso = await criarAlerta(
      processo.numero,
      "prazo",
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      `Lembrete para processo ${processo.assunto}`,
      3,
    );
    if (sucesso) {
      toast.success("Alerta criado com sucesso!");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {colunas.map((coluna) => {
        const processosDaColuna = processosFiltrados.filter(
          (processo) => processo.status === coluna.id,
        );

        return (
          <div
            key={coluna.id}
            className={`rounded-lg border-2 ${coluna.cor} p-4 min-h-[500px]`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {coluna.titulo}
              </h3>
              <Badge variant="secondary" className={coluna.contadorCor}>
                {processosDaColuna.length}
              </Badge>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                <AnimatePresence>
                  {processosDaColuna.map((processo) => (
                    <motion.div
                      key={processo.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <button
                              onClick={() =>
                                navigate(`/crm/processos/${processo.id}`)
                              }
                              className="font-mono text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-left underline-offset-4 hover:underline transition-colors"
                              title={`Ver detalhes do processo ${processo.numero}`}
                            >
                              {processo.numero}
                            </button>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                              {processo.assunto}
                            </p>
                          </div>
                          <div
                            className={`flex items-center gap-1 ${getRiscoColor(processo.risco)}`}
                          >
                            {getRiscoIcon(processo.risco)}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <button
                            onClick={() =>
                              navigate(`/crm/clientes/${processo.clienteId}`)
                            }
                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 truncate block text-left w-full underline-offset-4 hover:underline transition-colors"
                            title={`Ver perfil de ${processo.cliente}`}
                          >
                            <User className="inline h-3 w-3 mr-1" />
                            {processo.cliente}
                          </button>
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>{processo.area}</span>
                            <span className="truncate ml-2">
                              {processo.tribunal.split(" ")[0]}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {processo.responsavel.split(" ")[0]}
                            </Badge>
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                                maximumFractionDigits: 0,
                              }).format(processo.valor)}
                            </span>
                          </div>

                          {processo.proximaAudiencia && (
                            <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                              <Calendar className="h-3 w-3" />
                              Audiência:{" "}
                              {new Intl.DateTimeFormat("pt-BR").format(
                                processo.proximaAudiencia,
                              )}
                            </div>
                          )}

                          {processo.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {processo.tags.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {processo.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{processo.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Ações rápidas - visíveis no hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Separator className="my-2" />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleConsultarTJSP(processo);
                                }}
                                title="Consultar TJSP"
                              >
                                <TrendingUp className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCriarAlerta(processo);
                                }}
                                title="Criar Alerta"
                              >
                                <Bell className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                title="Favoritar"
                              >
                                <Star className="h-3 w-3" />
                              </Button>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem
                                  onClick={() =>
                                    navigate(`/crm/processos/${processo.id}`)
                                  }
                                  className="cursor-pointer"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver Detalhes Completos
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setShowProcessoForm(true)}
                                  className="cursor-pointer"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar Processo
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    // Duplicar processo
                                    toast.success("Processo duplicado!");
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    // Agendar audiência
                                    toast.success(
                                      "Redirecionando para agenda...",
                                    );
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Agendar Audiência
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    // Vincular documento
                                    toast.success("Abrindo GED...");
                                  }}
                                  className="cursor-pointer"
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Vincular Documento
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    navigate(
                                      `/crm/clientes/${processo.clienteId}`,
                                    )
                                  }
                                  className="cursor-pointer"
                                >
                                  <Users className="h-4 w-4 mr-2" />
                                  Ver Cliente
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    // Compartilhar processo
                                    navigator.clipboard.writeText(
                                      `${window.location.origin}/crm/processos/${processo.id}`,
                                    );
                                    toast.success("Link copiado!");
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Compartilhar Link
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 dark:text-red-400 cursor-pointer"
                                  onClick={() => {
                                    if (
                                      confirm(
                                        `Tem certeza que deseja excluir o processo ${processo.numero}?`,
                                      )
                                    ) {
                                      excluirProcesso(processo.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir Processo
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {processosDaColuna.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Scale className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhum processo nesta categoria</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        );
      })}
    </div>
  );
};

const ProcessosLista: React.FC = () => {
  const { processosFiltrados, excluirProcesso, obterCliente } = useCRM();
  const { consultarTJSP } = useProcessoApi();
  const navigate = useNavigate();
  const [selectedProcessos, setSelectedProcessos] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Processo;
    direction: "asc" | "desc";
  }>({ key: "dataInicio", direction: "desc" });

  const handleSelectProcesso = (processoId: string, checked: boolean) => {
    if (checked) {
      setSelectedProcessos((prev) => [...prev, processoId]);
    } else {
      setSelectedProcessos((prev) => prev.filter((id) => id !== processoId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProcessos(processosFiltrados.map((p) => p.id));
    } else {
      setSelectedProcessos([]);
    }
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case "export":
        toast.success(`${selectedProcessos.length} processos exportados!`);
        break;
      case "archive":
        toast.success(`${selectedProcessos.length} processos arquivados!`);
        break;
      case "delete":
        selectedProcessos.forEach((id) => excluirProcesso(id));
        toast.success(`${selectedProcessos.length} processos excluídos!`);
        break;
      default:
        toast.success(
          `Ação ${action} aplicada a ${selectedProcessos.length} processos`,
        );
    }
    setSelectedProcessos([]);
  };

  const handleSort = (key: keyof Processo) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const sortedProcessos = React.useMemo(() => {
    return [...processosFiltrados].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [processosFiltrados, sortConfig]);

  const getStatusBadge = (status: string) => {
    const variants = {
      ativo: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      suspenso:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      arquivado:
        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
      encerrado:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    };
    return variants[status as keyof typeof variants] || variants.ativo;
  };

  const getRiscoBadge = (risco: string) => {
    const variants = {
      baixo:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      medio:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      alto: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    };
    return variants[risco as keyof typeof variants] || variants.baixo;
  };

  return (
    <div className="space-y-4">
      {/* Ações em massa */}
      <AnimatePresence>
        {selectedProcessos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {selectedProcessos.length} processo(s) selecionado(s)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("edit")}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar em Massa
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("alert")}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Criar Alertas
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("export")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("archive")}
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Arquivar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("delete")}
                  className="text-red-600 hover:text-red-700 dark:text-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabela de processos */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedProcessos.length === sortedProcessos.length &&
                        sortedProcessos.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort("numero")}
                  >
                    <div className="flex items-center gap-1">
                      Número do Processo
                      {sortConfig.key === "numero" && (
                        <span className="text-xs">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort("cliente")}
                  >
                    <div className="flex items-center gap-1">
                      Cliente
                      {sortConfig.key === "cliente" && (
                        <span className="text-xs">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort("area")}
                  >
                    <div className="flex items-center gap-1">
                      Área
                      {sortConfig.key === "area" && (
                        <span className="text-xs">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risco</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort("valor")}
                  >
                    <div className="flex items-center gap-1">
                      Valor
                      {sortConfig.key === "valor" && (
                        <span className="text-xs">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Próxima Audiência</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {sortedProcessos.map((processo, index) => (
                    <motion.tr
                      key={processo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedProcessos.includes(processo.id)}
                          onCheckedChange={(checked) =>
                            handleSelectProcesso(processo.id, !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <button
                            onClick={() =>
                              navigate(`/crm/processos/${processo.id}`)
                            }
                            className="font-mono text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-left"
                          >
                            {processo.numero}
                          </button>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs mt-1">
                            {processo.assunto}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() =>
                            navigate(`/crm/clientes/${processo.clienteId}`)
                          }
                          className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 text-left"
                        >
                          {processo.cliente}
                        </button>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{processo.area}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(processo.status)}>
                          {processo.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRiscoBadge(processo.risco)}>
                          {processo.risco}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(processo.valor)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {processo.proximaAudiencia ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-4 w-4 text-orange-500" />
                            {new Intl.DateTimeFormat("pt-BR").format(
                              processo.proximaAudiencia,
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-500">
                            Não agendada
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {processo.responsavel}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/crm/processos/${processo.id}`)
                              }
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => consultarTJSP(processo.numero)}
                            >
                              <TrendingUp className="h-4 w-4 mr-2" />
                              Consultar TJSP
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="h-4 w-4 mr-2" />
                              Agendar Audiência
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              Ver Documentos
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/crm/clientes/${processo.clienteId}`)
                              }
                            >
                              <Users className="h-4 w-4 mr-2" />
                              Ver Cliente
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Bell className="h-4 w-4 mr-2" />
                              Criar Alerta
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              Compartilhar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 dark:text-red-400"
                              onClick={() => excluirProcesso(processo.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Estado vazio */}
      {sortedProcessos.length === 0 && (
        <div className="text-center py-12">
          <Scale className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Nenhum processo encontrado
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Nenhum processo corresponde aos filtros selecionados.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Processo
          </Button>
        </div>
      )}
    </div>
  );
};

const ImportacaoDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { importarProcessos } = useCRM();
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArquivo(file);
      setValidationErrors([]);

      // Simular preview e validação dos dados
      const mockData = [
        {
          numero: "1234567-89.2024.8.26.0100",
          cliente: "João Silva",
          area: "Família",
          valor: "15000",
          status: "ativo",
          responsavel: "Dr. Pedro Santos",
          valido: true,
        },
        {
          numero: "9876543-21.2024.8.26.0200",
          cliente: "Maria Santos",
          area: "Trabalhista",
          valor: "25000",
          status: "ativo",
          responsavel: "Dra. Ana Costa",
          valido: true,
        },
        {
          numero: "invalid-number",
          cliente: "",
          area: "Cível",
          valor: "abc",
          status: "ativo",
          responsavel: "",
          valido: false,
        },
      ];

      setPreviewData(mockData);

      const errors = mockData
        .filter((item) => !item.valido)
        .map((item, index) => `Linha ${index + 3}: Dados inválidos`);

      setValidationErrors(errors);
    }
  };

  const handleImport = async () => {
    if (!arquivo) return;

    setUploading(true);
    try {
      await importarProcessos(arquivo);
      onClose();
      setArquivo(null);
      setPreviewData([]);
      setValidationErrors([]);
      toast.success("Processos importados com sucesso!");
    } catch (error) {
      toast.error("Erro ao importar processos");
    } finally {
      setUploading(false);
    }
  };

  const validProcesses = previewData.filter((item) => item.valido);
  const invalidProcesses = previewData.filter((item) => !item.valido);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importar Processos
          </DialogTitle>
          <DialogDescription>
            Importe processos em lote a partir de planilhas CSV ou XLSX.
            Certifique-se de que os dados estejam no formato correto.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto">
          {/* Área de upload */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />

            {!arquivo ? (
              <div className="space-y-4">
                <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Selecione um arquivo
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Formatos aceitos: CSV, XLSX, XLS (máximo 10MB)
                  </p>
                </div>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Escolher Arquivo
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <CheckSquare className="h-12 w-12 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Arquivo selecionado
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {arquivo.name} ({(arquivo.size / 1024 / 1024).toFixed(2)}{" "}
                    MB)
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Escolher Outro Arquivo
                </Button>
              </div>
            )}
          </div>

          {/* Estatísticas da validação */}
          {previewData.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {previewData.length}
                  </div>
                  <div className="text-sm text-gray-500">
                    Total de registros
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {validProcesses.length}
                  </div>
                  <div className="text-sm text-gray-500">Registros válidos</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {invalidProcesses.length}
                  </div>
                  <div className="text-sm text-gray-500">
                    Registros inválidos
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Erros de validação */}
          {validationErrors.length > 0 && (
            <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium text-red-800 dark:text-red-200">
                    Foram encontrados {validationErrors.length} erro(s) de
                    validação:
                  </p>
                  <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside">
                    {validationErrors.slice(0, 5).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                    {validationErrors.length > 5 && (
                      <li>... e mais {validationErrors.length - 5} erros</li>
                    )}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Preview dos dados */}
          {previewData.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Preview dos Dados
                </h3>
                <Badge variant="outline">
                  Mostrando {Math.min(previewData.length, 10)} de{" "}
                  {previewData.length} registros
                </Badge>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-8">Status</TableHead>
                        <TableHead>Número do Processo</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Área</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Responsável</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.slice(0, 10).map((item, index) => (
                        <TableRow
                          key={index}
                          className={
                            !item.valido ? "bg-red-50 dark:bg-red-900/20" : ""
                          }
                        >
                          <TableCell>
                            {item.valido ? (
                              <CheckSquare className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {item.numero}
                          </TableCell>
                          <TableCell>
                            {item.cliente || (
                              <span className="text-red-600 text-sm">
                                Obrigatório
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.area}</Badge>
                          </TableCell>
                          <TableCell>
                            {isNaN(Number(item.valor)) ? (
                              <span className="text-red-600 text-sm">
                                Inválido
                              </span>
                            ) : (
                              <span className="text-green-600 font-medium">
                                R$ {Number(item.valor).toLocaleString("pt-BR")}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {item.responsavel || (
                              <span className="text-red-600 text-sm">
                                Obrigatório
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {previewData.length > 10 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  ... e mais {previewData.length - 10} registros
                </p>
              )}
            </div>
          )}

          {/* Ações */}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Shield className="h-4 w-4" />
              Validação automática dos dados ativada
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose} disabled={uploading}>
                Cancelar
              </Button>
              <Button
                onClick={handleImport}
                disabled={!arquivo || uploading || validProcesses.length === 0}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Importar {validProcesses.length} Processos
                  </>
                )}
              </Button>
            </div>
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Importando processos...</span>
                <span>85%</span>
              </div>
              <Progress value={85} className="w-full" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ProcessosModule: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    filtros,
    atualizarFiltros,
    exportarDados,
    processosFiltrados,
    estatisticas,
  } = useCRM();
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showProcessoForm, setShowProcessoForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    numero: true,
    cliente: true,
    area: true,
    status: true,
    risco: true,
    valor: true,
    audiencia: true,
    responsavel: true,
  });

  const isMobile = useIsMobile();

  // Se for mobile, renderiza a versão mobile
  if (isMobile) {
    return <ProcessosMobile />;
  }

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {estatisticas.totalProcessos}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Ativos
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {estatisticas.processosAtivos}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Alto Risco
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {processosFiltrados.filter((p) => p.risco === "alto").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Valor Total
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    maximumFractionDigits: 0,
                  }).format(
                    processosFiltrados.reduce((sum, p) => sum + p.valor, 0),
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header com controles */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestão de Processos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Acompanhe e gerencie todos os seus processos jurídicos
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowImportDialog(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportarDados("processos")}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm" onClick={() => setShowProcessoForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Processo
          </Button>
        </div>
      </div>

      {/* Controles de visualização e filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Busca inteligente com debounce */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por número, cliente, assunto, área..."
            className="pl-10 pr-10"
            value={filtros.busca}
            onChange={(e) => {
              const value = e.target.value;
              // Debounce para melhor performance
              clearTimeout(window.searchTimeout);
              window.searchTimeout = setTimeout(() => {
                atualizarFiltros({ busca: value });
              }, 300);
            }}
          />
          {filtros.busca && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => atualizarFiltros({ busca: "" })}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Filtros rápidos */}
        <div className="flex items-center gap-2">
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Modo de visualização melhorado */}
          <div className="flex items-center border rounded-lg bg-gray-50 dark:bg-gray-800 p-1">
            <Button
              variant={viewMode === "kanban" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="rounded-r-none h-8 text-xs"
              title="Visualização Kanban"
            >
              <Grid3X3 className="h-3 w-3 mr-1" />
              Kanban
            </Button>
            <Button
              variant={viewMode === "lista" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("lista")}
              className="rounded-l-none h-8 text-xs"
              title="Visualização em Lista"
            >
              <List className="h-3 w-3 mr-1" />
              Lista
            </Button>
          </div>

          {/* Configuração de colunas visíveis */}
          {viewMode === "lista" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Settings className="h-3 w-3 mr-2" />
                  Colunas
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {Object.values(visibleColumns).filter(Boolean).length}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                  Personalizar Colunas Visíveis
                </div>
                <DropdownMenuSeparator />
                {Object.entries(visibleColumns).map(([key, visible]) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={visible}
                    onCheckedChange={(checked) => {
                      const newColumns = { ...visibleColumns, [key]: checked };
                      setVisibleColumns(newColumns);
                      // Salvar preferência do usuário
                      localStorage.setItem(
                        "crm-processos-columns",
                        JSON.stringify(newColumns),
                      );
                      toast.success("Preferência de colunas salva!");
                    }}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {key === "numero" && <Scale className="h-3 w-3" />}
                      {key === "cliente" && <User className="h-3 w-3" />}
                      {key === "area" && <Building className="h-3 w-3" />}
                      {key === "status" && <Activity className="h-3 w-3" />}
                      {key === "risco" && <AlertTriangle className="h-3 w-3" />}
                      {key === "valor" && <DollarSign className="h-3 w-3" />}
                      {key === "audiencia" && <Calendar className="h-3 w-3" />}
                      {key === "responsavel" && <Users className="h-3 w-3" />}
                      {key.charAt(0).toUpperCase() +
                        key.slice(1).replace(/([A-Z])/g, " $1")}
                    </div>
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    const defaultColumns = {
                      numero: true,
                      cliente: true,
                      area: true,
                      status: true,
                      risco: true,
                      valor: true,
                      audiencia: true,
                      responsavel: true,
                    };
                    setVisibleColumns(defaultColumns);
                    localStorage.removeItem("crm-processos-columns");
                    toast.success("Colunas restauradas ao padrão!");
                  }}
                  className="cursor-pointer text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Restaurar Padrão
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Filtros expandidos */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Select
                    value={filtros.status}
                    onValueChange={(value) =>
                      atualizarFiltros({ status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os status</SelectItem>
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
                    <SelectTrigger>
                      <SelectValue placeholder="Área" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas as áreas</SelectItem>
                      <SelectItem value="Família">Família</SelectItem>
                      <SelectItem value="Trabalhista">Trabalhista</SelectItem>
                      <SelectItem value="Cível">Cível</SelectItem>
                      <SelectItem value="Criminal">Criminal</SelectItem>
                      <SelectItem value="Tributário">Tributário</SelectItem>
                      <SelectItem value="Administrativo">
                        Administrativo
                      </SelectItem>
                      <SelectItem value="Previdenciário">
                        Previdenciário
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filtros.responsavel}
                    onValueChange={(value) =>
                      atualizarFiltros({ responsavel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os responsáveis</SelectItem>
                      <SelectItem value="Dr. Pedro Santos">
                        Dr. Pedro Santos
                      </SelectItem>
                      <SelectItem value="Dra. Ana Costa">
                        Dra. Ana Costa
                      </SelectItem>
                      <SelectItem value="Dr. Carlos Silva">
                        Dr. Carlos Silva
                      </SelectItem>
                      <SelectItem value="Dra. Maria Oliveira">
                        Dra. Maria Oliveira
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={
                      filtros.busca.includes("risco:")
                        ? filtros.busca.replace("risco:", "")
                        : ""
                    }
                    onValueChange={(value) =>
                      atualizarFiltros({
                        busca: value
                          ? `risco:${value}`
                          : filtros.busca.replace(/risco:\w+/g, "").trim(),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Nível de Risco" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os níveis</SelectItem>
                      <SelectItem value="alto">Alto Risco</SelectItem>
                      <SelectItem value="medio">Médio Risco</SelectItem>
                      <SelectItem value="baixo">Baixo Risco</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        atualizarFiltros({
                          busca: "",
                          status: "",
                          area: "",
                          responsavel: "",
                        })
                      }
                      className="w-full"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Limpar Filtros
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conteúdo baseado no modo de visualização */}
      {viewMode === "kanban" ? <ProcessosKanban /> : <ProcessosLista />}

      {/* Dialogs */}
      <ImportacaoDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
      />

      <ProcessoForm
        isOpen={showProcessoForm}
        onClose={() => setShowProcessoForm(false)}
      />
    </div>
  );
};

export default ProcessosModule;
