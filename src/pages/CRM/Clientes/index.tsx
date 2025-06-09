import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Building,
  User,
  DollarSign,
  Calendar,
  Grid3X3,
  List,
  Download,
  Upload,
  Tag,
  Settings,
  FileText,
  Scale,
  CheckSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useCRM, Cliente } from "@/hooks/useCRM";
import { toast } from "sonner";

const ClientesKanban: React.FC = () => {
  const { clientesFiltrados, editarCliente } = useCRM();

  const colunas = [
    { id: "novo", titulo: "Novos", cor: "bg-blue-50 border-blue-200" },
    { id: "ativo", titulo: "Ativos", cor: "bg-green-50 border-green-200" },
    {
      id: "prospecto",
      titulo: "Prospectos",
      cor: "bg-yellow-50 border-yellow-200",
    },
    { id: "inativo", titulo: "Inativos", cor: "bg-gray-50 border-gray-200" },
  ];

  const handleMoveCliente = async (clienteId: string, novoStatus: string) => {
    await editarCliente(clienteId, { status: novoStatus as Cliente["status"] });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {colunas.map((coluna) => {
        const clientesDaColuna = clientesFiltrados.filter(
          (cliente) => cliente.status === coluna.id,
        );

        return (
          <div
            key={coluna.id}
            className={`rounded-lg border-2 ${coluna.cor} p-4`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{coluna.titulo}</h3>
              <Badge variant="secondary">{clientesDaColuna.length}</Badge>
            </div>

            <div className="space-y-3">
              {clientesDaColuna.map((cliente) => (
                <motion.div
                  key={cliente.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                  draggable
                  onDragEnd={(e) => {
                    // Implementar lógica de drag & drop
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${cliente.nome}`}
                      />
                      <AvatarFallback>
                        {cliente.nome.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {cliente.nome}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">
                        {cliente.email}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant={
                            cliente.tipo === "PF" ? "default" : "secondary"
                          }
                        >
                          {cliente.tipo}
                        </Badge>
                        <span className="text-sm font-medium text-green-600">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(cliente.valorTotal)}
                        </span>
                      </div>

                      {cliente.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {cliente.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {cliente.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{cliente.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

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
                          <Phone className="h-4 w-4 mr-2" />
                          Ligar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Enviar Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          Ver GED
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Scale className="h-4 w-4 mr-2" />
                          Ver Processos
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}

              {clientesDaColuna.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum cliente nesta categoria</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ClientesLista: React.FC = () => {
  const { clientesFiltrados, excluirCliente } = useCRM();
  const [selectedClientes, setSelectedClientes] = useState<string[]>([]);
  const [clienteDetalhes, setClienteDetalhes] = useState<Cliente | null>(null);

  const handleSelectCliente = (clienteId: string, checked: boolean) => {
    if (checked) {
      setSelectedClientes((prev) => [...prev, clienteId]);
    } else {
      setSelectedClientes((prev) => prev.filter((id) => id !== clienteId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClientes(clientesFiltrados.map((c) => c.id));
    } else {
      setSelectedClientes([]);
    }
  };

  const handleBulkAction = (action: string) => {
    toast.success(
      `Ação ${action} aplicada a ${selectedClientes.length} clientes`,
    );
    setSelectedClientes([]);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      ativo: "bg-green-100 text-green-800",
      novo: "bg-blue-100 text-blue-800",
      prospecto: "bg-yellow-100 text-yellow-800",
      inativo: "bg-gray-100 text-gray-800",
    };
    return variants[status as keyof typeof variants] || variants.ativo;
  };

  return (
    <div className="space-y-4">
      {/* Ações em massa */}
      {selectedClientes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedClientes.length} cliente(s) selecionado(s)
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

      {/* Tabela de clientes */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedClientes.length === clientesFiltrados.length &&
                      clientesFiltrados.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Último Contato</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {clientesFiltrados.map((cliente, index) => (
                  <motion.tr
                    key={cliente.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedClientes.includes(cliente.id)}
                        onCheckedChange={(checked) =>
                          handleSelectCliente(cliente.id, !!checked)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`https://avatar.vercel.sh/${cliente.nome}`}
                          />
                          <AvatarFallback>
                            {cliente.nome.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <button
                            className="font-medium text-gray-900 hover:text-blue-600 text-left"
                            onClick={() => setClienteDetalhes(cliente)}
                          >
                            {cliente.nome}
                          </button>
                          <p className="text-sm text-gray-500">
                            {cliente.documento}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          cliente.tipo === "PF" ? "default" : "secondary"
                        }
                      >
                        {cliente.tipo === "PF" ? (
                          <>
                            <User className="h-3 w-3 mr-1" /> Pessoa Física
                          </>
                        ) : (
                          <>
                            <Building className="h-3 w-3 mr-1" /> Pessoa
                            Jurídica
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="h-3 w-3" />
                          {cliente.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          {cliente.telefone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(cliente.status)}>
                        {cliente.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-green-600">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(cliente.valorTotal)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {cliente.ultimoContato ? (
                        <span className="text-sm text-gray-600">
                          {new Intl.DateTimeFormat("pt-BR").format(
                            cliente.ultimoContato,
                          )}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Nunca</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {cliente.responsavel}
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
                            onClick={() => setClienteDetalhes(cliente)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Phone className="h-4 w-4 mr-2" />
                            Ligar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Enviar Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Ver GED
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Scale className="h-4 w-4 mr-2" />
                            Ver Processos
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckSquare className="h-4 w-4 mr-2" />
                            Ver Contratos
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => excluirCliente(cliente.id)}
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

const ClientesModule: React.FC = () => {
  const { viewMode, filtros, atualizarFiltros, exportarDados } = useCRM();

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Gestão de Clientes
          </h2>
          <p className="text-gray-600 mt-1">
            Gerencie seus clientes, contatos e relacionamentos
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportarDados("clientes")}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
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
                placeholder="Buscar clientes..."
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
                <SelectItem value="novo">Novo</SelectItem>
                <SelectItem value="prospecto">Prospecto</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
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
      {viewMode === "kanban" ? <ClientesKanban /> : <ClientesLista />}
    </div>
  );
};

export default ClientesModule;
