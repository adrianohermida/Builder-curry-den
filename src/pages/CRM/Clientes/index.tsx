import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  Copy,
  Star,
  Clock,
  TrendingUp,
  Activity,
  ExternalLink,
  MessageCircle,
  X,
  ChevronRight,
  Briefcase,
  Award,
  AlertCircle,
  CheckCircle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useCRM, Cliente } from "@/hooks/useCRM";
import { toast } from "sonner";

interface ClienteDetalhesProps {
  cliente: Cliente;
  onClose: () => void;
}

// Componente de Detalhes do Cliente
const ClienteDetalhes: React.FC<ClienteDetalhesProps> = ({
  cliente,
  onClose,
}) => {
  const navigate = useNavigate();

  // Dados simulados para relacionamentos
  const relacionamentos = {
    processos: [
      {
        id: "proc-001",
        numero: "1234567-89.2024.8.26.0100",
        area: "Família",
        status: "ativo",
        valor: 15000,
        dataInicio: new Date("2024-01-15"),
        proximaAudiencia: new Date("2024-02-15"),
      },
      {
        id: "proc-002",
        numero: "5555555-55.2024.8.26.0300",
        area: "Trabalhista",
        status: "suspenso",
        valor: 25000,
        dataInicio: new Date("2024-01-22"),
      },
    ],
    contratos: [
      {
        id: "cont-001",
        numero: "CONT-2024-001",
        tipo: "Honorários",
        status: "vigente",
        valor: 45000,
        dataInicio: new Date("2024-01-15"),
        dataVencimento: new Date("2024-12-31"),
      },
    ],
    atendimentos: [
      {
        id: "aten-001",
        tipo: "Consulta",
        data: new Date("2024-01-20"),
        status: "finalizado",
        resumo: "Consulta inicial sobre divórcio consensual",
      },
      {
        id: "aten-002",
        tipo: "Acompanhamento",
        data: new Date("2024-01-25"),
        status: "agendado",
        resumo: "Acompanhamento do processo de divórcio",
      },
    ],
  };

  const handleNavigateToProcessos = () => {
    navigate(`/crm/processos?cliente=${cliente.id}`);
    onClose();
  };

  const handleNavigateToContratos = () => {
    navigate(`/crm/contratos?cliente=${cliente.id}`);
    onClose();
  };

  const handleNavigateToGED = () => {
    navigate(`/ged?cliente=${cliente.id}`);
    onClose();
  };

  const copyClientInfo = (info: string, label: string) => {
    navigator.clipboard.writeText(info);
    toast.success(`${label} copiado!`);
  };

  return (
    <div className="space-y-6">
      {/* Header do Cliente */}
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={`https://avatar.vercel.sh/${cliente.nome}`} />
          <AvatarFallback className="text-lg">
            {cliente.nome.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {cliente.nome}
          </h2>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant={cliente.tipo === "PF" ? "default" : "secondary"}>
              {cliente.tipo === "PF" ? (
                <>
                  <User className="h-3 w-3 mr-1" />
                  Pessoa Física
                </>
              ) : (
                <>
                  <Building className="h-3 w-3 mr-1" />
                  Pessoa Jurídica
                </>
              )}
            </Badge>
            <Badge
              className={
                cliente.status === "ativo"
                  ? "bg-green-100 text-green-800"
                  : cliente.status === "novo"
                    ? "bg-blue-100 text-blue-800"
                    : cliente.status === "prospecto"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
              }
            >
              {cliente.status}
            </Badge>
            {cliente.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="font-medium">Documento:</span>
              <button
                onClick={() => copyClientInfo(cliente.documento, "Documento")}
                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                {cliente.documento}
                <Copy className="h-3 w-3" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="font-medium">Responsável:</span>
              {cliente.responsavel}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="font-medium">Cadastro:</span>
              {new Intl.DateTimeFormat("pt-BR").format(cliente.dataCadastro)}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="font-medium">Origem:</span>
              {cliente.origem}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 mb-1">Valor Total</p>
          <p className="text-2xl font-bold text-green-600">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(cliente.valorTotal)}
          </p>
        </div>
      </div>

      <Separator />

      {/* Resumo de Relacionamentos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={handleNavigateToProcessos}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Processos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {relacionamentos.processos.length}
                </p>
                <p className="text-xs text-gray-500">
                  {
                    relacionamentos.processos.filter(
                      (p) => p.status === "ativo",
                    ).length
                  }{" "}
                  ativos
                </p>
              </div>
              <Scale className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={handleNavigateToContratos}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Contratos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {relacionamentos.contratos.length}
                </p>
                <p className="text-xs text-gray-500">
                  {
                    relacionamentos.contratos.filter(
                      (c) => c.status === "vigente",
                    ).length
                  }{" "}
                  vigentes
                </p>
              </div>
              <CheckSquare className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={handleNavigateToGED}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Atendimentos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {relacionamentos.atendimentos.length}
                </p>
                <p className="text-xs text-gray-500">
                  {
                    relacionamentos.atendimentos.filter(
                      (a) => a.status === "finalizado",
                    ).length
                  }{" "}
                  finalizados
                </p>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com detalhes */}
      <Tabs defaultValue="contato" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="contato">Contato</TabsTrigger>
          <TabsTrigger value="processos">Processos</TabsTrigger>
          <TabsTrigger value="contratos">Contratos</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="contato" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <button
                      onClick={() => copyClientInfo(cliente.email, "Email")}
                      className="text-blue-600 hover:underline"
                    >
                      {cliente.email}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Telefone
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <button
                      onClick={() =>
                        copyClientInfo(cliente.telefone, "Telefone")
                      }
                      className="text-blue-600 hover:underline"
                    >
                      {cliente.telefone}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Endereço
                </label>
                <div className="flex items-start gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-900">
                      {cliente.endereco.logradouro}, {cliente.endereco.numero}
                      {cliente.endereco.complemento &&
                        `, ${cliente.endereco.complemento}`}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {cliente.endereco.bairro}, {cliente.endereco.cidade} -{" "}
                      {cliente.endereco.uf}
                    </p>
                    <p className="text-gray-600 text-sm">
                      CEP: {cliente.endereco.cep}
                    </p>
                  </div>
                </div>
              </div>

              {cliente.observacoes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Observações
                  </label>
                  <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
                    {cliente.observacoes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processos" className="space-y-4">
          <div className="space-y-4">
            {relacionamentos.processos.map((processo) => (
              <Card
                key={processo.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-900">
                          {processo.numero}
                        </h4>
                        <Badge
                          variant={
                            processo.status === "ativo"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {processo.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {processo.area}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          Início:{" "}
                          {new Intl.DateTimeFormat("pt-BR").format(
                            processo.dataInicio,
                          )}
                        </span>
                        {processo.proximaAudiencia && (
                          <span>
                            Próxima audiência:{" "}
                            {new Intl.DateTimeFormat("pt-BR").format(
                              processo.proximaAudiencia,
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(processo.valor)}
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contratos" className="space-y-4">
          <div className="space-y-4">
            {relacionamentos.contratos.map((contrato) => (
              <Card
                key={contrato.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-900">
                          {contrato.numero}
                        </h4>
                        <Badge
                          variant={
                            contrato.status === "vigente"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {contrato.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {contrato.tipo}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          Início:{" "}
                          {new Intl.DateTimeFormat("pt-BR").format(
                            contrato.dataInicio,
                          )}
                        </span>
                        <span>
                          Vencimento:{" "}
                          {new Intl.DateTimeFormat("pt-BR").format(
                            contrato.dataVencimento,
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(contrato.valor)}
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Ver contrato
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="historico" className="space-y-4">
          <div className="space-y-4">
            {relacionamentos.atendimentos.map((atendimento) => (
              <Card key={atendimento.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        atendimento.status === "finalizado"
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {atendimento.status === "finalizado" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {atendimento.tipo}
                        </h4>
                        <Badge
                          variant={
                            atendimento.status === "finalizado"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {atendimento.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {atendimento.resumo}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Intl.DateTimeFormat("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(atendimento.data)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Ações rápidas */}
      <div className="flex flex-wrap gap-2 pt-4 border-t">
        <Button size="sm" className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Ligar para cliente
        </Button>
        <Button size="sm" variant="outline" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Enviar email
        </Button>
        <Button size="sm" variant="outline" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Agendar reunião
        </Button>
        <Button size="sm" variant="outline" className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Editar dados
        </Button>
      </div>
    </div>
  );
};

// Componente Kanban
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
            className={`rounded-lg border-2 ${coluna.cor} p-4 min-h-[600px]`}
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
                  className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer group"
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
                      <h4 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
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
                            notation: "compact",
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

                      {cliente.ultimoContato && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          Último contato:{" "}
                          {new Intl.DateTimeFormat("pt-BR").format(
                            cliente.ultimoContato,
                          )}
                        </div>
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
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

// Componente Lista
const ClientesLista: React.FC = () => {
  const { clientesFiltrados, excluirCliente } = useCRM();
  const navigate = useNavigate();
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

  const navigateToProcessos = (cliente: Cliente) => {
    navigate(`/crm/processos?cliente=${cliente.id}`);
  };

  const navigateToContratos = (cliente: Cliente) => {
    navigate(`/crm/contratos?cliente=${cliente.id}`);
  };

  const navigateToGED = (cliente: Cliente) => {
    navigate(`/ged?cliente=${cliente.id}`);
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
                    className="hover:bg-gray-50 transition-colors group"
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
                          <Sheet>
                            <SheetTrigger asChild>
                              <button className="font-medium text-gray-900 hover:text-blue-600 text-left transition-colors">
                                {cliente.nome}
                              </button>
                            </SheetTrigger>
                            <SheetContent className="min-w-[600px] max-w-[800px]">
                              <SheetHeader>
                                <SheetTitle>Detalhes do Cliente</SheetTitle>
                                <SheetDescription>
                                  Informações completas e relacionamentos do
                                  cliente
                                </SheetDescription>
                              </SheetHeader>
                              <div className="mt-6">
                                <ClienteDetalhes
                                  cliente={cliente}
                                  onClose={() => {}}
                                />
                              </div>
                            </SheetContent>
                          </Sheet>
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
                          <a
                            href={`mailto:${cliente.email}`}
                            className="hover:text-blue-600"
                          >
                            {cliente.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          <a
                            href={`tel:${cliente.telefone}`}
                            className="hover:text-blue-600"
                          >
                            {cliente.telefone}
                          </a>
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes Completos
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar Cliente
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Phone className="h-4 w-4 mr-2" />
                            Ligar para Cliente
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Enviar Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="h-4 w-4 mr-2" />
                            Agendar Reunião
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => navigateToProcessos(cliente)}
                          >
                            <Scale className="h-4 w-4 mr-2" />
                            Ver Processos ({2})
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigateToContratos(cliente)}
                          >
                            <CheckSquare className="h-4 w-4 mr-2" />
                            Ver Contratos ({1})
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigateToGED(cliente)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Ver Documentos (GED)
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => excluirCliente(cliente.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir Cliente
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

      {/* Detalhes do cliente em modal */}
      {clienteDetalhes && (
        <Dialog
          open={!!clienteDetalhes}
          onOpenChange={() => setClienteDetalhes(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Cliente</DialogTitle>
              <DialogDescription>
                Informações completas e relacionamentos do cliente
              </DialogDescription>
            </DialogHeader>
            <ClienteDetalhes
              cliente={clienteDetalhes}
              onClose={() => setClienteDetalhes(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Componente principal
const ClientesModule: React.FC = () => {
  const { viewMode, filtros, atualizarFiltros, exportarDados, loading } =
    useCRM();

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
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Importar Clientes
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportarDados("clientes")}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar Lista
          </Button>
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Filtros avançados */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                <SelectItem value="Dr. Carlos Silva">
                  Dr. Carlos Silva
                </SelectItem>
                <SelectItem value="Dra. Maria Oliveira">
                  Dra. Maria Oliveira
                </SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os tipos</SelectItem>
                <SelectItem value="PF">Pessoa Física</SelectItem>
                <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Filtros Avançados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo baseado no modo de visualização */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : viewMode === "kanban" ? (
        <ClientesKanban />
      ) : (
        <ClientesLista />
      )}
    </div>
  );
};

export default ClientesModule;
