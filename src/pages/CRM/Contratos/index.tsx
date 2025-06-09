import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSignature,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Copy,
  Share,
  RefreshCw,
  X,
  Calendar,
  DollarSign,
  User,
  Building,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Wand2,
  Settings,
  Grid3X3,
  List,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useCRM, Contrato } from "@/hooks/useCRM";
import { toast } from "sonner";

const ContratosKanban: React.FC = () => {
  const { contratosFiltrados, editarContrato } = useCRM();

  const colunas = [
    { id: "vigente", titulo: "Vigentes", cor: "bg-green-50 border-green-200" },
    { id: "vencido", titulo: "Vencidos", cor: "bg-red-50 border-red-200" },
    {
      id: "suspenso",
      titulo: "Suspensos",
      cor: "bg-yellow-50 border-yellow-200",
    },
    {
      id: "cancelado",
      titulo: "Cancelados",
      cor: "bg-gray-50 border-gray-200",
    },
  ];

  const getStatusIcon = (status: string) => {
    const icons = {
      vigente: <CheckCircle className="h-4 w-4 text-green-600" />,
      vencido: <AlertTriangle className="h-4 w-4 text-red-600" />,
      suspenso: <Clock className="h-4 w-4 text-yellow-600" />,
      cancelado: <X className="h-4 w-4 text-gray-600" />,
    };
    return icons[status as keyof typeof icons] || icons.vigente;
  };

  const isVencendoEm30Dias = (dataVencimento: Date) => {
    const hoje = new Date();
    const diasAteVencimento = Math.ceil(
      (dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diasAteVencimento <= 30 && diasAteVencimento > 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {colunas.map((coluna) => {
        const contratosDaColuna = contratosFiltrados.filter(
          (contrato) => contrato.status === coluna.id,
        );

        return (
          <div
            key={coluna.id}
            className={`rounded-lg border-2 ${coluna.cor} p-4`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{coluna.titulo}</h3>
              <Badge variant="secondary">{contratosDaColuna.length}</Badge>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {contratosDaColuna.map((contrato) => (
                <motion.div
                  key={contrato.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {contrato.numero}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {contrato.tipo}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(contrato.status)}
                      </div>
                    </div>

                    <button className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate block text-left w-full">
                      {contrato.cliente}
                    </button>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-600">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(contrato.valor)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {contrato.responsavel}
                        </Badge>
                      </div>

                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex items-center justify-between">
                          <span>Início:</span>
                          <span>
                            {new Intl.DateTimeFormat("pt-BR").format(
                              contrato.dataInicio,
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Vencimento:</span>
                          <span
                            className={
                              isVencendoEm30Dias(contrato.dataVencimento)
                                ? "text-orange-600 font-medium"
                                : ""
                            }
                          >
                            {new Intl.DateTimeFormat("pt-BR").format(
                              contrato.dataVencimento,
                            )}
                          </span>
                        </div>
                      </div>

                      {isVencendoEm30Dias(contrato.dataVencimento) && (
                        <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                          <AlertTriangle className="h-3 w-3" />
                          Vence em breve
                        </div>
                      )}

                      {contrato.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {contrato.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {contrato.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{contrato.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {contratosDaColuna.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileSignature className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum contrato nesta categoria</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ContratosLista: React.FC = () => {
  const { contratosFiltrados, excluirContrato } = useCRM();
  const [selectedContratos, setSelectedContratos] = useState<string[]>([]);

  const handleSelectContrato = (contratoId: string, checked: boolean) => {
    if (checked) {
      setSelectedContratos((prev) => [...prev, contratoId]);
    } else {
      setSelectedContratos((prev) => prev.filter((id) => id !== contratoId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContratos(contratosFiltrados.map((c) => c.id));
    } else {
      setSelectedContratos([]);
    }
  };

  const handleBulkAction = (action: string) => {
    toast.success(
      `Ação ${action} aplicada a ${selectedContratos.length} contratos`,
    );
    setSelectedContratos([]);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      vigente: "bg-green-100 text-green-800",
      vencido: "bg-red-100 text-red-800",
      suspenso: "bg-yellow-100 text-yellow-800",
      cancelado: "bg-gray-100 text-gray-800",
    };
    return variants[status as keyof typeof variants] || variants.vigente;
  };

  const isVencendoEm30Dias = (dataVencimento: Date) => {
    const hoje = new Date();
    const diasAteVencimento = Math.ceil(
      (dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diasAteVencimento <= 30 && diasAteVencimento > 0;
  };

  return (
    <div className="space-y-4">
      {/* Ações em massa */}
      {selectedContratos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedContratos.length} contrato(s) selecionado(s)
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("renovar")}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Renovar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("duplicar")}
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicar
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
                onClick={() => handleBulkAction("cancelar")}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabela de contratos */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedContratos.length === contratosFiltrados.length &&
                      contratosFiltrados.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {contratosFiltrados.map((contrato, index) => (
                  <motion.tr
                    key={contrato.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedContratos.includes(contrato.id)}
                        onCheckedChange={(checked) =>
                          handleSelectContrato(contrato.id, !!checked)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium text-gray-900">
                          {contrato.numero}
                        </span>
                        <p className="text-sm text-gray-500">{contrato.tipo}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <button className="font-medium text-blue-600 hover:text-blue-800 text-left">
                        {contrato.cliente}
                      </button>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{contrato.tipo}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(contrato.status)}>
                        {contrato.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-green-600">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(contrato.valor)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm ${
                            isVencendoEm30Dias(contrato.dataVencimento)
                              ? "text-orange-600 font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          {new Intl.DateTimeFormat("pt-BR").format(
                            contrato.dataVencimento,
                          )}
                        </span>
                        {isVencendoEm30Dias(contrato.dataVencimento) && (
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {contrato.responsavel}
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
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Renovar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share className="h-4 w-4 mr-2" />
                            Compartilhar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Gerar Fatura
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => excluirContrato(contrato.id)}
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

const ContratoEditor: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  contrato?: Contrato | null;
}> = ({ isOpen, onClose, contrato }) => {
  const { adicionarContrato, editarContrato } = useCRM();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    numero: contrato?.numero || "",
    clienteId: contrato?.clienteId || "",
    cliente: contrato?.cliente || "",
    tipo: contrato?.tipo || "",
    status: contrato?.status || "vigente",
    valor: contrato?.valor || 0,
    dataInicio: contrato?.dataInicio || new Date(),
    dataVencimento: contrato?.dataVencimento || new Date(),
    responsavel: contrato?.responsavel || "",
    observacoes: contrato?.observacoes || "",
    clausulas: contrato?.clausulas || [""],
    tags: contrato?.tags || [],
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      if (contrato) {
        await editarContrato(contrato.id, formData);
      } else {
        await adicionarContrato(formData);
      }
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar contrato");
    } finally {
      setSaving(false);
    }
  };

  const adicionarClausula = () => {
    setFormData((prev) => ({
      ...prev,
      clausulas: [...prev.clausulas, ""],
    }));
  };

  const removerClausula = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      clausulas: prev.clausulas.filter((_, i) => i !== index),
    }));
  };

  const atualizarClausula = (index: number, valor: string) => {
    setFormData((prev) => ({
      ...prev,
      clausulas: prev.clausulas.map((clausula, i) =>
        i === index ? valor : clausula,
      ),
    }));
  };

  const gerarClausulasIA = () => {
    // Simular geração de cláusulas por IA
    const clausulasIA = [
      "As partes se comprometem a cumprir integralmente as disposições deste contrato.",
      "O pagamento será realizado conforme cronograma estabelecido em anexo.",
      "Qualquer alteração deste contrato deverá ser feita por escrito e assinada por ambas as partes.",
      "Em caso de inadimplemento, serão aplicados juros de mora de 1% ao mês.",
      "Foro competente para dirimir questões deste contrato: Comarca de São Paulo/SP.",
    ];

    setFormData((prev) => ({
      ...prev,
      clausulas: clausulasIA,
    }));

    toast.success("Cláusulas geradas pela IA!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {contrato ? "Editar Contrato" : "Novo Contrato"}
          </DialogTitle>
          <DialogDescription>
            {contrato
              ? "Edite as informações do contrato existente"
              : "Crie um novo contrato com editor completo"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero">Número do Contrato</Label>
              <Input
                id="numero"
                value={formData.numero}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, numero: e.target.value }))
                }
                placeholder="CONT-2024-001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Input
                id="cliente"
                value={formData.cliente}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, cliente: e.target.value }))
                }
                placeholder="Nome do cliente"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Contrato</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, tipo: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Honorários">Honorários</SelectItem>
                  <SelectItem value="Prestação de Serviços">
                    Prestação de Serviços
                  </SelectItem>
                  <SelectItem value="Consultoria">Consultoria</SelectItem>
                  <SelectItem value="Retainer">Retainer</SelectItem>
                  <SelectItem value="Êxito">Êxito</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vigente">Vigente</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                  <SelectItem value="suspenso">Suspenso</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                type="number"
                value={formData.valor}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    valor: Number(e.target.value),
                  }))
                }
                placeholder="0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável</Label>
              <Select
                value={formData.responsavel}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, responsavel: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr. Pedro Santos">
                    Dr. Pedro Santos
                  </SelectItem>
                  <SelectItem value="Dra. Ana Costa">Dra. Ana Costa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data de Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={formData.dataInicio.toISOString().split("T")[0]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataInicio: new Date(e.target.value),
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataVencimento">Data de Vencimento</Label>
              <Input
                id="dataVencimento"
                type="date"
                value={formData.dataVencimento.toISOString().split("T")[0]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataVencimento: new Date(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  observacoes: e.target.value,
                }))
              }
              placeholder="Observações adicionais sobre o contrato..."
              rows={3}
            />
          </div>

          {/* Cláusulas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Cláusulas do Contrato</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={gerarClausulasIA}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  IA Gerar Cláusulas
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={adicionarClausula}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {formData.clausulas.map((clausula, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-sm text-gray-500 mt-2 min-w-[20px]">
                    {index + 1}.
                  </span>
                  <Textarea
                    value={clausula}
                    onChange={(e) => atualizarClausula(index, e.target.value)}
                    placeholder={`Cláusula ${index + 1}...`}
                    rows={2}
                    className="flex-1"
                  />
                  {formData.clausulas.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removerClausula(index)}
                      className="text-red-600 hover:text-red-700 mt-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Upload de arquivo */}
          <div className="space-y-2">
            <Label>Arquivo do Contrato (PDF)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Arraste o arquivo PDF aqui ou clique para selecionar
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                <Upload className="h-4 w-4 mr-2" />
                Selecionar Arquivo
              </Button>
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle className="h-4 w-4" />
              Todas as alterações são salvas automaticamente
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <FileSignature className="h-4 w-4 mr-2" />
                    {contrato ? "Atualizar" : "Criar"} Contrato
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ContratosModule: React.FC = () => {
  const { viewMode, filtros, atualizarFiltros, exportarDados } = useCRM();
  const [showEditor, setShowEditor] = useState(false);
  const [contratoSelecionado, setContratoSelecionado] =
    useState<Contrato | null>(null);

  const handleNovoContrato = () => {
    setContratoSelecionado(null);
    setShowEditor(true);
  };

  const handleEditarContrato = (contrato: Contrato) => {
    setContratoSelecionado(contrato);
    setShowEditor(true);
  };

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Gestão de Contratos
          </h2>
          <p className="text-gray-600 mt-1">
            Crie, gerencie e acompanhe seus contratos jurídicos
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportarDados("contratos")}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm" onClick={handleNovoContrato}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Contrato
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar contratos..."
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
                <SelectItem value="vigente">Vigente</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
                <SelectItem value="suspenso">Suspenso</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
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
              <Filter className="h-4 w-4 mr-2" />
              Mais Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo baseado no modo de visualização */}
      {viewMode === "kanban" ? <ContratosKanban /> : <ContratosLista />}

      {/* Editor de contratos */}
      <ContratoEditor
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        contrato={contratoSelecionado}
      />
    </div>
  );
};

export default ContratosModule;
