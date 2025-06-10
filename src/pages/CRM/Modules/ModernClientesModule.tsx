/**
 * 🎯 MODERN CLIENTES MODULE - SAFE VERSION
 *
 * Módulo de clientes moderno com interface segura
 * Sem dependências problemáticas de drag & drop
 */

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
  Phone,
  Mail,
  Star,
  Building,
  MapPin,
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
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  status: "lead" | "qualified" | "proposal" | "negotiation" | "client";
  valor: number;
  origem: string;
  responsavel: string;
  ultimoContato: Date;
  avatar?: string;
}

const PIPELINE_STAGES = [
  { id: "lead", title: "Lead", color: "bg-gray-100 text-gray-800" },
  { id: "qualified", title: "Qualificado", color: "bg-blue-100 text-blue-800" },
  { id: "proposal", title: "Proposta", color: "bg-yellow-100 text-yellow-800" },
  {
    id: "negotiation",
    title: "Negociação",
    color: "bg-orange-100 text-orange-800",
  },
  { id: "client", title: "Cliente", color: "bg-green-100 text-green-800" },
];

export const ModernClientesModule: React.FC = () => {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const mockClientes: Cliente[] = [
    {
      id: "1",
      nome: "João Silva",
      email: "joao@empresa.com",
      telefone: "(11) 99999-9999",
      empresa: "Empresa XYZ",
      status: "lead",
      valor: 15000,
      origem: "Website",
      responsavel: "Ana Costa",
      ultimoContato: new Date(),
    },
    {
      id: "2",
      nome: "Maria Santos",
      email: "maria@startup.com",
      telefone: "(11) 88888-8888",
      empresa: "Startup ABC",
      status: "qualified",
      valor: 25000,
      origem: "Indicação",
      responsavel: "Carlos Lima",
      ultimoContato: new Date(),
    },
    {
      id: "3",
      nome: "Pedro Oliveira",
      email: "pedro@tech.com",
      telefone: "(11) 77777-7777",
      empresa: "Tech Solutions",
      status: "proposal",
      valor: 35000,
      origem: "LinkedIn",
      responsavel: "Ana Costa",
      ultimoContato: new Date(),
    },
    {
      id: "4",
      nome: "Lucia Fernandes",
      email: "lucia@corp.com",
      telefone: "(11) 66666-6666",
      empresa: "Corp Ltd",
      status: "client",
      valor: 50000,
      origem: "Indicação",
      responsavel: "Carlos Lima",
      ultimoContato: new Date(),
    },
  ];

  const filteredClientes = searchQuery
    ? mockClientes.filter(
        (cliente) =>
          cliente.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cliente.empresa?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : mockClientes;

  const clientesByStage = PIPELINE_STAGES.reduce(
    (acc, stage) => {
      acc[stage.id] = filteredClientes.filter(
        (cliente) => cliente.status === stage.id,
      );
      return acc;
    },
    {} as Record<string, Cliente[]>,
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const ClienteCard: React.FC<{ cliente: Cliente }> = ({ cliente }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-lg p-4 mb-3 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={cliente.avatar} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {cliente.nome.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-gray-900">{cliente.nome}</h4>
            {cliente.empresa && (
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Building className="w-3 h-3" />
                {cliente.empresa}
              </p>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="w-4 h-4 mr-2" />
              Ver detalhes
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Phone className="w-4 h-4 mr-2" />
              Ligar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="w-4 h-4 mr-2" />
              Enviar email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{formatCurrency(cliente.valor)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>📱 {cliente.telefone}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>📧 {cliente.email}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Origem: {cliente.origem}</span>
          <span>{cliente.responsavel}</span>
        </div>
      </div>
    </motion.div>
  );

  if (view === "kanban") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Pipeline de Clientes
            </h2>
            <p className="text-gray-500">
              {filteredClientes.length} clientes no pipeline
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setView("list")}>
              Lista
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar clientes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Kanban Board - STATIC VERSION (NO DRAG & DROP) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto">
          {PIPELINE_STAGES.map((stage) => (
            <div key={stage.id} className="min-w-0">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {stage.title}
                    </CardTitle>
                    <Badge variant="secondary" className={stage.color}>
                      {clientesByStage[stage.id]?.length || 0}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {clientesByStage[stage.id]?.map((cliente) => (
                      <ClienteCard key={cliente.id} cliente={cliente} />
                    ))}
                  </div>
                  {(!clientesByStage[stage.id] ||
                    clientesByStage[stage.id].length === 0) && (
                    <div className="text-center py-8 text-gray-400">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhum cliente</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Lista de Clientes
          </h2>
          <p className="text-gray-500">
            {filteredClientes.length} clientes cadastrados
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setView("kanban")}>
            Kanban
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar clientes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Cliente
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Status
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Valor
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Responsável
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.map((cliente) => {
                  const stage = PIPELINE_STAGES.find(
                    (s) => s.id === cliente.status,
                  );
                  return (
                    <tr key={cliente.id} className="border-b border-gray-100">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {cliente.nome.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">
                              {cliente.nome}
                            </div>
                            <div className="text-sm text-gray-500">
                              {cliente.empresa}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={stage?.color}>{stage?.title}</Badge>
                      </td>
                      <td className="p-4 font-medium">
                        {formatCurrency(cliente.valor)}
                      </td>
                      <td className="p-4 text-gray-600">
                        {cliente.responsavel}
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernClientesModule;
