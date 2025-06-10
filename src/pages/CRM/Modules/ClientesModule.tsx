/**
 * 👥 MÓDULO CLIENTES - CRM Jurídico
 *
 * Gestão moderna e inteligente de clientes
 * - Design minimalista compacto
 * - Lista configurável com drag & drop
 * - Discussões contextuais
 * - Visualização Kanban e Lista
 */

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  Filter,
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Star,
  Activity,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ConfigurableList,
  ColumnConfig,
  ListItem,
  Discussion,
} from "@/components/CRM/ConfigurableList";

// Tipos específicos do módulo
interface Cliente {
  id: string;
  nome: string;
  tipo: "PF" | "PJ";
  email: string;
  telefone: string;
  endereco: string;
  status: "ativo" | "inativo" | "prospecto" | "vip";
  dataUltimoContato: Date;
  score: number;
  receitaMensal: number;
  riscoPerdas: "baixo" | "medio" | "alto";
  responsavel: string;
  tags: string[];
  observacoes?: string;
}

interface ClientesModuleProps {
  searchQuery?: string;
  viewMode?: "list" | "kanban";
  onNotification?: (message: string) => void;
  className?: string;
}

// Mock data para demonstração
const MOCK_CLIENTES: Cliente[] = [
  {
    id: "1",
    nome: "João Silva & Associados",
    tipo: "PJ",
    email: "contato@joaosilva.adv.br",
    telefone: "(11) 9999-8888",
    endereco: "Av. Paulista, 1000 - São Paulo/SP",
    status: "ativo",
    dataUltimoContato: new Date(Date.now() - 86400000 * 5),
    score: 85,
    receitaMensal: 15000,
    riscoPerdas: "baixo",
    responsavel: "Maria Santos",
    tags: ["premium", "corporativo"],
  },
  {
    id: "2",
    nome: "Ana Costa",
    tipo: "PF",
    email: "ana.costa@email.com",
    telefone: "(11) 8888-7777",
    endereco: "Rua das Flores, 123 - São Paulo/SP",
    status: "prospecto",
    dataUltimoContato: new Date(Date.now() - 86400000 * 2),
    score: 65,
    receitaMensal: 5000,
    riscoPerdas: "medio",
    responsavel: "João Silva",
    tags: ["individual", "trabalhista"],
  },
  {
    id: "3",
    nome: "TechCorp Ltda",
    tipo: "PJ",
    email: "juridico@techcorp.com",
    telefone: "(11) 7777-6666",
    endereco: "Av. Faria Lima, 2500 - São Paulo/SP",
    status: "vip",
    dataUltimoContato: new Date(Date.now() - 86400000),
    score: 95,
    receitaMensal: 25000,
    riscoPerdas: "baixo",
    responsavel: "Carlos Oliveira",
    tags: ["vip", "tecnologia", "contratos"],
  },
  {
    id: "4",
    nome: "Pedro Almeida",
    tipo: "PF",
    email: "pedro.almeida@email.com",
    telefone: "(11) 6666-5555",
    endereco: "Rua Augusta, 456 - São Paulo/SP",
    status: "inativo",
    dataUltimoContato: new Date(Date.now() - 86400000 * 90),
    score: 30,
    receitaMensal: 2000,
    riscoPerdas: "alto",
    responsavel: "Ana Silva",
    tags: ["individual", "familia"],
  },
];

// Configuração das colunas
const DEFAULT_COLUMNS: ColumnConfig[] = [
  { key: "nome", label: "Nome", visible: true, sortable: true },
  { key: "tipo", label: "Tipo", visible: true, sortable: true },
  { key: "status", label: "Status", visible: true, sortable: true },
  { key: "score", label: "Score", visible: true, sortable: true },
  { key: "receitaMensal", label: "Receita", visible: true, sortable: true },
  { key: "responsavel", label: "Responsável", visible: true, sortable: true },
  {
    key: "dataUltimoContato",
    label: "Último Contato",
    visible: false,
    sortable: true,
  },
  { key: "riscoPerdas", label: "Risco", visible: false, sortable: true },
];

export const ClientesModule: React.FC<ClientesModuleProps> = ({
  searchQuery = "",
  viewMode = "list",
  onNotification,
  className,
}) => {
  const [clientes, setClientes] = useState<Cliente[]>(MOCK_CLIENTES);
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [filterType, setFilterType] = useState<string>("todos");

  // Filtrar clientes
  const filteredClientes = useMemo(() => {
    return clientes.filter((cliente) => {
      const matchesSearch =
        searchQuery === "" ||
        cliente.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cliente.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesStatus =
        filterStatus === "todos" || cliente.status === filterStatus;

      const matchesType = filterType === "todos" || cliente.tipo === filterType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [clientes, searchQuery, filterStatus, filterType]);

  // Converter para formato da lista configurável
  const listItems: ListItem[] = useMemo(() => {
    return filteredClientes.map((cliente) => ({
      id: cliente.id,
      status: cliente.status,
      data: {
        nome: cliente.nome,
        tipo: cliente.tipo === "PF" ? "Pessoa Física" : "Pessoa Jurídica",
        status: cliente.status,
        score: `${cliente.score}%`,
        receitaMensal: `R$ ${(cliente.receitaMensal / 1000).toFixed(0)}k`,
        responsavel: cliente.responsavel,
        dataUltimoContato: cliente.dataUltimoContato.toLocaleDateString(),
        riscoPerdas: cliente.riscoPerdas,
        email: cliente.email,
        telefone: cliente.telefone,
        endereco: cliente.endereco,
        tags: cliente.tags.join(", "),
      },
      discussions: [
        {
          id: "1",
          author: "Maria Santos",
          message: "Cliente interessado em expandir os serviços",
          timestamp: new Date(),
          internal: true,
        },
      ],
    }));
  }, [filteredClientes]);

  // Status columns para Kanban
  const statusColumns = ["prospecto", "ativo", "vip", "inativo"];

  // Handlers
  const handleItemUpdate = (item: ListItem) => {
    const updatedClientes = clientes.map((cliente) => {
      if (cliente.id === item.id) {
        return { ...cliente, status: item.status as Cliente["status"] };
      }
      return cliente;
    });
    setClientes(updatedClientes);
    onNotification?.("Cliente atualizado com sucesso");
  };

  const handleDiscussion = (
    itemId: string,
    discussion: Omit<Discussion, "id" | "timestamp">,
  ) => {
    // Lógica para adicionar discussão
    onNotification?.("Discussão adicionada");
  };

  // Estatísticas rápidas
  const stats = useMemo(() => {
    return {
      total: clientes.length,
      ativos: clientes.filter((c) => c.status === "ativo").length,
      vip: clientes.filter((c) => c.status === "vip").length,
      prospectos: clientes.filter((c) => c.status === "prospecto").length,
      receitaTotal: clientes.reduce((acc, c) => acc + c.receitaMensal, 0),
    };
  }, [clientes]);

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      {/* Header com estatísticas */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Clientes</p>
                <p className="text-xl font-semibold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ativos</p>
                <p className="text-xl font-semibold">{stats.ativos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">VIP</p>
                <p className="text-xl font-semibold">{stats.vip}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Receita Mensal</p>
                <p className="text-xl font-semibold">
                  R$ {(stats.receitaTotal / 1000).toFixed(0)}k
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
              <SelectItem value="prospecto">Prospecto</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Tipos</SelectItem>
              <SelectItem value="PF">Pessoa Física</SelectItem>
              <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Lista configurável */}
      <ConfigurableList
        items={listItems}
        columns={columns}
        viewMode={viewMode}
        onItemUpdate={handleItemUpdate}
        onColumnUpdate={setColumns}
        onDiscussion={handleDiscussion}
        statusColumns={statusColumns}
      />
    </div>
  );
};

export default ClientesModule;
