import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { useCRM, Processo } from "@/hooks/useCRM";
import { toast } from "sonner";

const ProcessosKanban: React.FC = () => {
  const { processosFiltrados, editarProcesso } = useCRM();

  const colunas = [
    { id: "ativo", titulo: "Ativos", cor: "bg-blue-50 border-blue-200" },
    {
      id: "suspenso",
      titulo: "Suspensos",
      cor: "bg-yellow-50 border-yellow-200",
    },
    {
      id: "arquivado",
      titulo: "Arquivados",
      cor: "bg-gray-50 border-gray-200",
    },
    {
      id: "encerrado",
      titulo: "Encerrados",
      cor: "bg-green-50 border-green-200",
    },
  ];

  const getRiscoColor = (risco: string) => {
    const colors = {
      baixo: "text-green-600",
      medio: "text-yellow-600",
      alto: "text-red-600",
    };
    return colors[risco as keyof typeof colors] || colors.baixo;
  };

  const getRiscoIcon = (risco: string) => {
    if (risco === "alto") return <AlertTriangle className="h-3 w-3" />;
    if (risco === "medio") return <Clock className="h-3 w-3" />;
    return <CheckSquare className="h-3 w-3" />;
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
            className={`rounded-lg border-2 ${coluna.cor} p-4`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{coluna.titulo}</h3>
              <Badge variant="secondary">{processosDaColuna.length}</Badge>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {processosDaColuna.map((processo) => (
                <motion.div
                  key={processo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm leading-tight">
                          {processo.numero}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 truncate">
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
                      <button className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate block text-left w-full">
                        {processo.cliente}
                      </button>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{processo.area}</span>
                        <span>{processo.tribunal}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {processo.responsavel}
                        </Badge>
                        <span className="text-sm font-medium text-green-600">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                            maximumFractionDigits: 0,
                          }).format(processo.valor)}
                        </span>
                      </div>

                      {processo.proximaAudiencia && (
                        <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
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
                  </div>
                </motion.div>
              ))}

              {processosDaColuna.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Scale className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum processo nesta categoria</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ProcessosLista: React.FC = () => {
  const { processosFiltrados, excluirProcesso, obterCliente } = useCRM();
  const [selectedProcessos, setSelectedProcessos] = useState<string[]>([]);

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
    toast.success(
      `Ação ${action} aplicada a ${selectedProcessos.length} processos`,
    );
    setSelectedProcessos([]);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      ativo: "bg-blue-100 text-blue-800",
      suspenso: "bg-yellow-100 text-yellow-800",
      arquivado: "bg-gray-100 text-gray-800",
      encerrado: "bg-green-100 text-green-800",
    };
    return variants[status as keyof typeof variants] || variants.ativo;
  };

  const getRiscoBadge = (risco: string) => {
    const variants = {
      baixo: "bg-green-100 text-green-800",
      medio: "bg-yellow-100 text-yellow-800",
      alto: "bg-red-100 text-red-800",
    };
    return variants[risco as keyof typeof variants] || variants.baixo;
  };

  return (
    <div className="space-y-4">
      {/* Ações em massa */}
      {selectedProcessos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedProcessos.length} processo(s) selecionado(s)
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("editar")}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar em Massa
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("mesclar")}
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Mesclar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("exportar")}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("excluir")}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabela de processos */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedProcessos.length === processosFiltrados.length &&
                      processosFiltrados.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Número do Processo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risco</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Próxima Audiência</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {processosFiltrados.map((processo, index) => (
                  <motion.tr
                    key={processo.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
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
                        <button className="font-medium text-blue-600 hover:text-blue-800 text-left">
                          {processo.numero}
                        </button>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {processo.assunto}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <button className="font-medium text-gray-900 hover:text-blue-600 text-left">
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
                      <span className="font-medium text-green-600">
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
                        <span className="text-sm text-gray-400">
                          Não agendada
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
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
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Calendar className="h-4 w-4 mr-2" />
                            Agendar Audiência
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Ver Documentos
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            Ver Cliente
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
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
        </CardContent>
      </Card>
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArquivo(file);
      // Simular preview dos dados
      setPreviewData([
        {
          numero: "1234567-89.2024.8.26.0100",
          cliente: "João Silva",
          area: "Família",
          valor: "15000",
        },
        {
          numero: "9876543-21.2024.8.26.0200",
          cliente: "Maria Santos",
          area: "Trabalhista",
          valor: "25000",
        },
        {
          numero: "5555555-55.2024.8.26.0300",
          cliente: "Empresa ABC",
          area: "Cível",
          valor: "50000",
        },
      ]);
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
    } catch (error) {
      toast.error("Erro ao importar processos");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Importar Processos</DialogTitle>
          <DialogDescription>
            Importe processos a partir de planilhas CSV ou XLSX
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Área de upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
                  <h3 className="text-lg font-medium text-gray-900">
                    Selecione um arquivo
                  </h3>
                  <p className="text-gray-500">
                    Formatos aceitos: CSV, XLSX, XLS
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
                  <h3 className="text-lg font-medium text-gray-900">
                    Arquivo selecionado
                  </h3>
                  <p className="text-gray-500">{arquivo.name}</p>
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

          {/* Preview dos dados */}
          {previewData.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Preview dos Dados ({previewData.length} registros)
              </h3>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número do Processo</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Área</TableHead>
                      <TableHead>Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.slice(0, 5).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">
                          {item.numero}
                        </TableCell>
                        <TableCell>{item.cliente}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.area}</Badge>
                        </TableCell>
                        <TableCell className="text-green-600 font-medium">
                          R$ {item.valor}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {previewData.length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  ... e mais {previewData.length - 5} registros
                </p>
              )}
            </div>
          )}

          {/* Ações */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CheckSquare className="h-4 w-4" />
              Validação automática dos dados ativada
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleImport} disabled={!arquivo || uploading}>
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Importar {previewData.length} Processos
                  </>
                )}
              </Button>
            </div>
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Importando processos...</span>
                <span>65%</span>
              </div>
              <Progress value={65} className="w-full" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ProcessosModule: React.FC = () => {
  const { viewMode, filtros, atualizarFiltros, exportarDados } = useCRM();
  const [showImportDialog, setShowImportDialog] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Gestão de Processos
          </h2>
          <p className="text-gray-600 mt-1">
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
            Importar Processos
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportarDados("processos")}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Processo
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar processos..."
                className="pl-10"
                value={filtros.busca}
                onChange={(e) => atualizarFiltros({ busca: e.target.value })}
              />
            </div>

            <Select
              value={filtros.status}
              onValueChange={(value) => atualizarFiltros({ status: value })}
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
                <SelectItem value="Dra. Ana Costa">Dra. Ana Costa</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Colunas Visíveis
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo baseado no modo de visualização */}
      {viewMode === "kanban" ? <ProcessosKanban /> : <ProcessosLista />}

      {/* Dialog de importação */}
      <ImportacaoDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
      />
    </div>
  );
};

export default ProcessosModule;
