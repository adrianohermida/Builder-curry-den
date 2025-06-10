/**
 * 👥 MÓDULO CLIENTES - CRM Unicorn
 *
 * Gestão inteligente e moderna de clientes com IA integrada
 * - Interface minimalista e responsiva
 * - Classificação automática com IA
 * - Alertas de inatividade
 * - Integração com outros módulos
 */

import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Zap,
  Eye,
  Edit,
  Trash2,
  FileText,
  DollarSign,
  User,
  Building,
  Clock,
  Target,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Hooks (using temporary stubs)
const useClientesUnicorn = () => ({
  clientes: [],
  loading: false,
  createClient: async () => {},
  updateClient: async () => {},
  deleteClient: async () => {},
});

const useAIClassification = () => ({
  classifyClient: async () => {},
  getRecommendations: async () => {},
});

// Tipos
interface Cliente {
  id: string;
  nome: string;
  tipo: "PF" | "PJ";
  documento: string;
  email: string;
  telefone: string;
  endereco: {
    cidade: string;
    uf: string;
  };
  status: "ativo" | "inativo" | "prospecto" | "vip";
  valorTotal: number;
  ultimoContato: Date;
  responsavel: string;
  origem: string;
  tags: string[];
  score: number;
  riscoPerdas: "baixo" | "medio" | "alto";
  totalProcessos: number;
  totalContratos: number;
  receitaMensal: number;
}

interface ClientesModuleProps {
  searchQuery?: string;
  onNotification?: (message: string) => void;
  className?: string;
}

// Dados mock inteligentes
const MOCK_CLIENTES: Cliente[] = [
  {
    id: "cli-001",
    nome: "Maria Silva Advocacia",
    tipo: "PJ",
    documento: "12.345.678/0001-90",
    email: "contato@mariasilva.adv.br",
    telefone: "(11) 9999-0001",
    endereco: { cidade: "São Paulo", uf: "SP" },
    status: "vip",
    valorTotal: 850000,
    ultimoContato: new Date("2025-01-15"),
    responsavel: "Dr. João",
    origem: "Indicação",
    tags: ["Empresarial", "Tributário", "VIP"],
    score: 95,
    riscoPerdas: "baixo",
    totalProcessos: 12,
    totalContratos: 8,
    receitaMensal: 45000,
  },
  {
    id: "cli-002",
    nome: "Carlos Mendes",
    tipo: "PF",
    documento: "123.456.789-00",
    email: "carlos.mendes@email.com",
    telefone: "(11) 9999-0002",
    endereco: { cidade: "Rio de Janeiro", uf: "RJ" },
    status: "ativo",
    valorTotal: 125000,
    ultimoContato: new Date("2025-01-10"),
    responsavel: "Dra. Ana",
    origem: "Site",
    tags: ["Trabalhista", "Pessoa Física"],
    score: 78,
    riscoPerdas: "medio",
    totalProcessos: 3,
    totalContratos: 2,
    receitaMensal: 8500,
  },
  {
    id: "cli-003",
    nome: "Tech Solutions Ltda",
    tipo: "PJ",
    documento: "98.765.432/0001-10",
    email: "juridico@techsolutions.com",
    telefone: "(11) 9999-0003",
    endereco: { cidade: "Brasília", uf: "DF" },
    status: "inativo",
    valorTotal: 0,
    ultimoContato: new Date("2024-11-20"),
    responsavel: "Dr. Pedro",
    origem: "LinkedIn",
    tags: ["Tecnologia", "Inativo"],
    score: 45,
    riscoPerdas: "alto",
    totalProcessos: 0,
    totalContratos: 0,
    receitaMensal: 0,
  },
];

export function ClientesModule({
  searchQuery = "",
  onNotification,
  className,
}: ClientesModuleProps) {
  // Estados
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedStatus, setSelectedStatus] = useState<string>("todos");
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Hooks
  const { clientes, loading, createClient, updateClient, deleteClient } =
    useClientesUnicorn();

  const { classifyClient, getRecommendations } = useAIClassification();

  // Dados filtrados
  const filteredClientes = useMemo(() => {
    let filtered = MOCK_CLIENTES;

    if (searchQuery) {
      filtered = filtered.filter(
        (cliente) =>
          cliente.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cliente.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cliente.documento.includes(searchQuery),
      );
    }

    if (selectedStatus !== "todos") {
      filtered = filtered.filter(
        (cliente) => cliente.status === selectedStatus,
      );
    }

    return filtered.sort((a, b) => b.score - a.score);
  }, [searchQuery, selectedStatus]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = MOCK_CLIENTES.length;
    const ativos = MOCK_CLIENTES.filter((c) => c.status === "ativo").length;
    const vips = MOCK_CLIENTES.filter((c) => c.status === "vip").length;
    const inativos = MOCK_CLIENTES.filter((c) => c.status === "inativo").length;
    const receitaTotal = MOCK_CLIENTES.reduce(
      (acc, c) => acc + c.receitaMensal,
      0,
    );

    return { total, ativos, vips, inativos, receitaTotal };
  }, []);

  // Handlers
  const handleClientSelect = useCallback((cliente: Cliente) => {
    setSelectedClient(cliente);
  }, []);

  const handleStatusChange = useCallback(
    async (clienteId: string, novoStatus: string) => {
      try {
        await updateClient(clienteId, { status: novoStatus });
        onNotification?.(`Status do cliente atualizado para ${novoStatus}`);
      } catch (error) {
        toast.error("Erro ao atualizar status do cliente");
      }
    },
    [updateClient, onNotification],
  );

  // Renderizadores
  const renderClientCard = (cliente: Cliente) => (
    <motion.div
      key={cliente.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "relative overflow-hidden cursor-pointer transition-all",
          "hover:shadow-md border-l-4",
          cliente.status === "vip" && "border-l-yellow-500 bg-yellow-50",
          cliente.status === "ativo" && "border-l-green-500 bg-green-50",
          cliente.status === "inativo" && "border-l-red-500 bg-red-50",
          cliente.status === "prospecto" && "border-l-blue-500 bg-blue-50",
        )}
        onClick={() => handleClientSelect(cliente)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`/avatars/${cliente.id}.jpg`} />
                <AvatarFallback className="bg-primary/10">
                  {cliente.tipo === "PF" ? (
                    <User className="h-6 w-6" />
                  ) : (
                    <Building className="h-6 w-6" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">{cliente.nome}</h3>
                <p className="text-xs text-muted-foreground">
                  {cliente.documento}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge
                variant={
                  cliente.status === "vip"
                    ? "default"
                    : cliente.status === "ativo"
                      ? "secondary"
                      : "destructive"
                }
                className="text-xs"
              >
                {cliente.status.toUpperCase()}
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
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
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" />
                    Ver Processos
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Ver Financeiro
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Informações de contato */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-xs text-muted-foreground">
              <Mail className="h-3 w-3 mr-2" />
              {cliente.email}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Phone className="h-3 w-3 mr-2" />
              {cliente.telefone}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-2" />
              {cliente.endereco.cidade}/{cliente.endereco.uf}
            </div>
          </div>

          {/* Métricas principais */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">
                R$ {(cliente.receitaMensal / 1000).toFixed(0)}k
              </p>
              <p className="text-xs text-muted-foreground">Receita/mês</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">{cliente.score}</p>
              <p className="text-xs text-muted-foreground">Score</p>
            </div>
          </div>

          {/* Tags e indicadores */}
          <div className="flex flex-wrap gap-1 mb-3">
            {cliente.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {cliente.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{cliente.tags.length - 2}
              </Badge>
            )}
          </div>

          {/* Alertas IA */}
          {cliente.riscoPerdas === "alto" && (
            <div className="flex items-center text-xs text-red-600 bg-red-50 p-2 rounded">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Alto risco de perda
            </div>
          )}

          {cliente.status === "inativo" && (
            <div className="flex items-center text-xs text-orange-600 bg-orange-50 p-2 rounded">
              <Clock className="h-3 w-3 mr-1" />
              Cliente inativo há{" "}
              {Math.floor(
                (Date.now() - cliente.ultimoContato.getTime()) /
                  (1000 * 60 * 60 * 24),
              )}{" "}
              dias
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header do módulo */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Clientes</h2>
          <p className="text-muted-foreground">
            Gestão inteligente de relacionamento
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? "Lista" : "Grade"}
          </Button>

          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: "Total",
            value: stats.total,
            icon: Users,
            color: "text-blue-600",
          },
          {
            title: "Ativos",
            value: stats.ativos,
            icon: TrendingUp,
            color: "text-green-600",
          },
          {
            title: "VIPs",
            value: stats.vips,
            icon: Star,
            color: "text-yellow-600",
          },
          {
            title: "Inativos",
            value: stats.inativos,
            icon: AlertTriangle,
            color: "text-red-600",
          },
          {
            title: "Receita",
            value: `R$ ${(stats.receitaTotal / 1000).toFixed(0)}k`,
            icon: DollarSign,
            color: "text-emerald-600",
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={cn("h-8 w-8", stat.color)} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filtros */}
      <div className="flex items-center space-x-4">
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Status</SelectItem>
            <SelectItem value="ativo">Ativos</SelectItem>
            <SelectItem value="vip">VIPs</SelectItem>
            <SelectItem value="inativo">Inativos</SelectItem>
            <SelectItem value="prospecto">Prospectos</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Mais Filtros
        </Button>

        <Button variant="outline" size="sm">
          <Zap className="h-4 w-4 mr-2" />
          IA Recommendations
        </Button>
      </div>

      {/* Lista de clientes */}
      <div
        className={cn(
          "grid gap-4",
          viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1",
        )}
      >
        {filteredClientes.map(renderClientCard)}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {filteredClientes.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Nenhum cliente encontrado
          </h3>
          <p className="text-muted-foreground mb-4">
            Comece adicionando seu primeiro cliente
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Cliente
          </Button>
        </div>
      )}
    </div>
  );
}
