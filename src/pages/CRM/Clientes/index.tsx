/**
 * 🎯 CRM CLIENTES - MÓDULO COMPLETO DE GESTÃO DE CLIENTES
 * Versão corrigida e otimizada para produção
 */

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Mail,
  Phone,
  MapPin,
  Building,
  User,
  Calendar,
  Tag,
  ExternalLink,
  Edit,
  Trash2,
  Star,
  Clock,
  MoreHorizontal,
  Eye,
  DollarSign,
  Grid3X3,
  List,
  Settings,
  FileText,
  Scale,
  CheckSquare,
  Copy,
  TrendingUp,
  Activity,
  MessageCircle,
  X,
  ChevronRight,
  Briefcase,
  Award,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

// UI Components
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
import { toast } from "sonner";

// Hooks
import { useCRMUnificado } from "@/hooks/useCRMUnificado";
import { handleError, handleNetworkError } from "@/lib/errorHandler";

// ===== TYPES =====
export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  tipo: "PF" | "PJ";
  status: "ativo" | "inativo" | "prospecto" | "novo";
  classificacao: "cliente" | "parceiro" | "fornecedor" | "oportunidade";
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
  };
  dataCadastro: Date;
  ultimoContato?: Date;
  responsavel: string;
  origem: string;
  tags: string[];
  valorTotal: number;
  observacoes?: string;
  ativo: boolean;
  favorito: boolean;
}

interface ClienteDetalhesProps {
  cliente: Cliente;
  onClose: () => void;
}

// ===== COMPONENTE DE DETALHES DO CLIENTE =====
const ClienteDetalhes: React.FC<ClienteDetalhesProps> = ({
  cliente,
  onClose,
}) => {
  const navigate = useNavigate();

  // Dados simulados para relacionamentos
  const relacionamentos = useMemo(
    () => ({
      processos: [
        {
          id: "proc-001",
          numero: "1234567-89.2024.8.26.0100",
          area: "Civil",
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
          resumo: "Consulta inicial sobre questões contratuais",
        },
        {
          id: "aten-002",
          tipo: "Acompanhamento",
          data: new Date("2024-01-25"),
          status: "agendado",
          resumo: "Acompanhamento do processo",
        },
      ],
    }),
    [],
  );

  const handleNavigateToProcessos = useCallback(() => {
    navigate(`/crm-modern?module=processos&cliente=${cliente.id}`);
    onClose();
  }, [navigate, cliente.id, onClose]);

  const handleNavigateToContratos = useCallback(() => {
    navigate(`/crm-modern?module=contratos&cliente=${cliente.id}`);
    onClose();
  }, [navigate, cliente.id, onClose]);

  const handleNavigateToGED = useCallback(() => {
    navigate(`/crm-modern?module=documentos&cliente=${cliente.id}`);
    onClose();
  }, [navigate, cliente.id, onClose]);

  const copyClientInfo = useCallback((info: string, label: string) => {
    try {
      navigator.clipboard.writeText(info);
      toast.success(`${label} copiado para a área de transferência!`);
    } catch (error) {
      handleError(error as Error, "user", "low", {
        action: "copy",
        info: label,
      });
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header do Cliente */}
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={`https://avatar.vercel.sh/${cliente.nome}?size=64`}
          />
          <AvatarFallback className="text-lg font-semibold bg-primary-100 text-primary-700">
            {cliente.nome.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {cliente.nome}
          </h2>
          <div className="flex items-center flex-wrap gap-2 mb-3">
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

// ===== COMPONENTE PRINCIPAL =====
const ClientesModule: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [selectedClientes, setSelectedClientes] = useState<string[]>([]);
  const [clienteDetalhes, setClienteDetalhes] = useState<Cliente | null>(null);

  // CRM Hook
  const { contatos, isLoadingData, createContato, refreshData } =
    useCRMUnificado();

  // Simulated data for now - replace with real data from hook
  const clientesSimulados: Cliente[] = useMemo(
    () => [
      {
        id: "1",
        nome: "João Silva Santos",
        email: "joao.silva@email.com",
        telefone: "(11) 99999-1234",
        documento: "123.456.789-00",
        tipo: "PF",
        status: "ativo",
        classificacao: "cliente",
        endereco: {
          cep: "01234-567",
          logradouro: "Rua das Flores",
          numero: "123",
          complemento: "Apto 45",
          bairro: "Centro",
          cidade: "São Paulo",
          uf: "SP",
        },
        dataCadastro: new Date("2024-01-15"),
        ultimoContato: new Date("2024-01-25"),
        responsavel: "Dr. Pedro Santos",
        origem: "Indicação",
        tags: ["VIP", "Civil"],
        valorTotal: 75000,
        observacoes:
          "Cliente com bom relacionamento, sempre pontual nos pagamentos.",
        ativo: true,
        favorito: true,
      },
      {
        id: "2",
        nome: "Empresa Tech Ltda",
        email: "contato@empresatech.com.br",
        telefone: "(11) 3333-4444",
        documento: "12.345.678/0001-90",
        tipo: "PJ",
        status: "ativo",
        classificacao: "cliente",
        endereco: {
          cep: "04567-890",
          logradouro: "Av. Paulista",
          numero: "1000",
          complemento: "15º andar",
          bairro: "Bela Vista",
          cidade: "São Paulo",
          uf: "SP",
        },
        dataCadastro: new Date("2024-01-10"),
        ultimoContato: new Date("2024-01-30"),
        responsavel: "Dra. Ana Costa",
        origem: "Site",
        tags: ["Empresarial", "Tech"],
        valorTotal: 150000,
        observacoes: "Empresa de tecnologia em crescimento.",
        ativo: true,
        favorito: false,
      },
      {
        id: "3",
        nome: "Maria Oliveira Costa",
        email: "maria.oliveira@email.com",
        telefone: "(11) 98888-7777",
        documento: "987.654.321-00",
        tipo: "PF",
        status: "prospecto",
        classificacao: "oportunidade",
        endereco: {
          cep: "02468-135",
          logradouro: "Rua dos Jardins",
          numero: "456",
          bairro: "Jardins",
          cidade: "São Paulo",
          uf: "SP",
        },
        dataCadastro: new Date("2024-01-20"),
        responsavel: "Dr. Carlos Silva",
        origem: "Marketing",
        tags: ["Família", "Novo"],
        valorTotal: 25000,
        ativo: true,
        favorito: false,
      },
    ],
    [],
  );

  // Filtered clients
  const clientesFiltrados = useMemo(() => {
    return clientesSimulados.filter((cliente) => {
      const matchesSearch =
        cliente.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cliente.documento.includes(searchQuery);

      const matchesStatus = !statusFilter || cliente.status === statusFilter;
      const matchesTipo = !tipoFilter || cliente.tipo === tipoFilter;

      return matchesSearch && matchesStatus && matchesTipo;
    });
  }, [clientesSimulados, searchQuery, statusFilter, tipoFilter]);

  // Handlers
  const handleSelectCliente = useCallback(
    (clienteId: string, checked: boolean) => {
      if (checked) {
        setSelectedClientes((prev) => [...prev, clienteId]);
      } else {
        setSelectedClientes((prev) => prev.filter((id) => id !== clienteId));
      }
    },
    [],
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedClientes(clientesFiltrados.map((c) => c.id));
      } else {
        setSelectedClientes([]);
      }
    },
    [clientesFiltrados],
  );

  const handleBulkAction = useCallback(
    (action: string) => {
      toast.success(
        `Ação "${action}" aplicada a ${selectedClientes.length} cliente(s)`,
      );
      setSelectedClientes([]);
    },
    [selectedClientes.length],
  );

  const handleExportData = useCallback(() => {
    try {
      const csvData = clientesFiltrados.map((cliente) => ({
        Nome: cliente.nome,
        Email: cliente.email,
        Telefone: cliente.telefone,
        Documento: cliente.documento,
        Tipo: cliente.tipo,
        Status: cliente.status,
        "Valor Total": cliente.valorTotal,
        Responsável: cliente.responsavel,
      }));

      const csvContent = [
        Object.keys(csvData[0]).join(","),
        ...csvData.map((row) => Object.values(row).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `clientes-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Dados exportados com sucesso!");
    } catch (error) {
      handleError(error as Error, "system", "medium", { action: "export" });
    }
  }, [clientesFiltrados]);

  const getStatusBadge = useCallback((status: string) => {
    const variants = {
      ativo: "bg-green-100 text-green-800",
      novo: "bg-blue-100 text-blue-800",
      prospecto: "bg-yellow-100 text-yellow-800",
      inativo: "bg-gray-100 text-gray-800",
    };
    return variants[status as keyof typeof variants] || variants.ativo;
  }, []);

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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
            Importar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Cliente
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
                placeholder="Buscar clientes..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
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

            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os tipos</SelectItem>
                <SelectItem value="PF">Pessoa Física</SelectItem>
                <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "kanban" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("kanban")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Filtros Avançados
            </Button>
          </div>
        </CardContent>
      </Card>

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
                            src={`https://avatar.vercel.sh/${cliente.nome}?size=32`}
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
                            <User className="h-3 w-3 mr-1" /> PF
                          </>
                        ) : (
                          <>
                            <Building className="h-3 w-3 mr-1" /> PJ
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
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar Cliente
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
                          <DropdownMenuItem>
                            <Calendar className="h-4 w-4 mr-2" />
                            Agendar Reunião
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Scale className="h-4 w-4 mr-2" />
                            Ver Processos
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckSquare className="h-4 w-4 mr-2" />
                            Ver Contratos
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Ver Documentos
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
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

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Clientes</p>
                <p className="text-2xl font-bold">{clientesFiltrados.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clientes Ativos</p>
                <p className="text-2xl font-bold">
                  {clientesFiltrados.filter((c) => c.status === "ativo").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prospectos</p>
                <p className="text-2xl font-bold">
                  {
                    clientesFiltrados.filter((c) => c.status === "prospecto")
                      .length
                  }
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-green-600">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    notation: "compact",
                  }).format(
                    clientesFiltrados.reduce(
                      (sum, cliente) => sum + cliente.valorTotal,
                      0,
                    ),
                  )}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientesModule;
