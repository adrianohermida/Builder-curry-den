/**
 * 👥 MODERN CLIENTES MODULE - LAWDESK REFACTORED
 *
 * Módulo de clientes modernizado inspirado em HubSpot:
 * - Mini-kanban visual para pipeline
 * - List view compacta com avatars
 * - Filtros simplificados
 * - Agrupamento inteligente
 * - Colunas personalizáveis
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { SafeDragDropContext } from "../../../components/Common/SafeDragDropContext";
import {
  Users,
  Grid3X3,
  List,
  Plus,
  Star,
  Phone,
  Mail,
  Building,
  Calendar,
  DollarSign,
  Filter,
  SortAsc,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  MessageCircle,
  UserPlus,
  Search,
  Tag,
  TrendingUp,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import { cn } from "@/lib/utils";

type ViewMode = "kanban" | "list";
type ClientStatus =
  | "lead"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "client"
  | "vip";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: ClientStatus;
  value: number;
  engagementScore: number;
  lastContact: Date;
  tags: string[];
  assignedTo: string;
  avatar?: string;
  processes: number;
  contracts: number;
  nextAction?: {
    type: string;
    date: Date;
    description: string;
  };
}

interface StatusColumn {
  id: ClientStatus;
  title: string;
  color: string;
  clients: Client[];
}

const ModernClientesModule: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "all">("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [groupBy, setGroupBy] = useState<string>("status");

  // Mock data
  const mockClients: Client[] = [
    {
      id: "1",
      name: "João Silva Advocacia",
      email: "joao@silva.adv.br",
      phone: "(11) 99999-9999",
      company: "Silva & Associados",
      status: "vip",
      value: 150000,
      engagementScore: 95,
      lastContact: new Date(Date.now() - 86400000),
      tags: ["Corporate", "M&A"],
      assignedTo: "Ana Santos",
      processes: 5,
      contracts: 2,
      nextAction: {
        type: "Meeting",
        date: new Date(Date.now() + 604800000),
        description: "Reunião estratégica Q4",
      },
    },
    {
      id: "2",
      name: "Maria Costa",
      email: "maria@costa.com",
      phone: "(11) 88888-8888",
      status: "qualified",
      value: 75000,
      engagementScore: 78,
      lastContact: new Date(Date.now() - 432000000),
      tags: ["Family Law"],
      assignedTo: "Carlos Lima",
      processes: 2,
      contracts: 1,
      nextAction: {
        type: "Follow-up",
        date: new Date(Date.now() + 259200000),
        description: "Acompanhar proposta",
      },
    },
    {
      id: "3",
      name: "TechCorp Brasil",
      email: "legal@techcorp.br",
      phone: "(11) 77777-7777",
      company: "TechCorp Brasil Ltda",
      status: "negotiation",
      value: 300000,
      engagementScore: 85,
      lastContact: new Date(Date.now() - 172800000),
      tags: ["Tech", "IP", "Compliance"],
      assignedTo: "Ana Santos",
      processes: 8,
      contracts: 0,
      nextAction: {
        type: "Contract Review",
        date: new Date(Date.now() + 86400000),
        description: "Revisão final do contrato",
      },
    },
    {
      id: "4",
      name: "Pedro Oliveira",
      email: "pedro@oliveira.com",
      phone: "(11) 66666-6666",
      status: "lead",
      value: 25000,
      engagementScore: 45,
      lastContact: new Date(Date.now() - 1209600000),
      tags: ["Personal"],
      assignedTo: "Bruno Reis",
      processes: 0,
      contracts: 0,
    },
    {
      id: "5",
      name: "Construtora ABC",
      email: "juridico@abc.com.br",
      phone: "(11) 55555-5555",
      company: "ABC Construções S/A",
      status: "client",
      value: 120000,
      engagementScore: 88,
      lastContact: new Date(Date.now() - 259200000),
      tags: ["Real Estate", "Construction"],
      assignedTo: "Ana Santos",
      processes: 3,
      contracts: 2,
    },
  ];

  const statusColumns: StatusColumn[] = [
    {
      id: "lead",
      title: "Leads",
      color: "bg-gray-100 text-gray-800",
      clients: [],
    },
    {
      id: "qualified",
      title: "Qualificados",
      color: "bg-blue-100 text-blue-800",
      clients: [],
    },
    {
      id: "proposal",
      title: "Proposta",
      color: "bg-yellow-100 text-yellow-800",
      clients: [],
    },
    {
      id: "negotiation",
      title: "Negociação",
      color: "bg-orange-100 text-orange-800",
      clients: [],
    },
    {
      id: "client",
      title: "Clientes",
      color: "bg-green-100 text-green-800",
      clients: [],
    },
    {
      id: "vip",
      title: "VIP",
      color: "bg-purple-100 text-purple-800",
      clients: [],
    },
  ];

  // Filter and group clients
  const filteredClients = useMemo(() => {
    let filtered = mockClients;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (client) =>
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((client) => client.status === statusFilter);
    }

    return filtered;
  }, [mockClients, searchQuery, statusFilter]);

  // Organize clients by status for kanban
  const kanbanColumns = useMemo(() => {
    const columns = statusColumns.map((col) => ({
      ...col,
      clients: filteredClients.filter((client) => client.status === col.id),
    }));
    return columns;
  }, [filteredClients]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // Update client status
    console.log(
      `Moving client ${draggableId} from ${source.droppableId} to ${destination.droppableId}`,
    );
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const renderClientCard = (client: Client, isDragging = false) => (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isDragging && "shadow-lg rotate-1 scale-105",
      )}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-grow min-w-0">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                  {client.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-grow">
                <h4 className="font-medium text-sm text-gray-900 truncate">
                  {client.name}
                </h4>
                {client.company && (
                  <p className="text-xs text-gray-500 truncate">
                    {client.company}
                  </p>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Detalhes
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
                  E-mail
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Discussão
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-green-600" />
              <span className="font-medium">
                {formatCurrency(client.value)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span className={getEngagementColor(client.engagementScore)}>
                {client.engagementScore}%
              </span>
            </div>
          </div>

          {/* Tags */}
          {client.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {client.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs h-4 px-1"
                >
                  {tag}
                </Badge>
              ))}
              {client.tags.length > 2 && (
                <Badge variant="outline" className="text-xs h-4 px-1">
                  +{client.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Next Action */}
          {client.nextAction && (
            <div className="p-2 bg-blue-50 rounded text-xs">
              <div className="flex items-center gap-1 text-blue-700">
                <Calendar className="w-3 h-3" />
                <span className="font-medium">{client.nextAction.type}</span>
              </div>
              <p className="text-blue-600 mt-1">
                {client.nextAction.description}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Por {client.assignedTo}</span>
            <div className="flex items-center gap-2">
              {client.processes > 0 && (
                <span className="flex items-center gap-1">
                  <Scale className="w-3 h-3" />
                  {client.processes}
                </span>
              )}
              {client.contracts > 0 && (
                <span className="flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  {client.contracts}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderKanbanView = () => (
    <SafeDragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {kanbanColumns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div className="flex items-center gap-2 mb-4">
              <div
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  column.color,
                )}
              >
                {column.title}
              </div>
              <Badge variant="secondary" className="text-xs">
                {column.clients.length}
              </Badge>
            </div>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "min-h-96 p-2 rounded-lg transition-colors",
                    snapshot.isDraggingOver
                      ? "bg-blue-50 border-2 border-blue-200 border-dashed"
                      : "bg-gray-50",
                  )}
                >
                  <div className="space-y-3">
                    {column.clients.map((client, index) => (
                      <Draggable
                        key={client.id}
                        draggableId={client.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {renderClientCard(client, snapshot.isDragging)}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>

                  {column.clients.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhum cliente</p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </SafeDragDropContext>
  );

  const renderListView = () => (
    <div className="space-y-2">
      {filteredClients.map((client) => (
        <motion.div
          key={client.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center gap-4">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-blue-100 text-blue-700">
                {client.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-grow grid grid-cols-5 gap-4 items-center">
              <div>
                <h4 className="font-medium text-gray-900">{client.name}</h4>
                <p className="text-sm text-gray-500">{client.company}</p>
              </div>

              <div className="text-sm text-gray-600">
                <p>{client.email}</p>
                <p>{client.phone}</p>
              </div>

              <div className="text-center">
                <Badge className={column.color}>
                  {statusColumns.find((s) => s.id === client.status)?.title}
                </Badge>
              </div>

              <div className="text-right">
                <p className="font-medium">{formatCurrency(client.value)}</p>
                <p
                  className={cn(
                    "text-sm",
                    getEngagementColor(client.engagementScore),
                  )}
                >
                  {client.engagementScore}% engajamento
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Phone className="w-4 h-4 mr-2" />
                      Ligar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="w-4 h-4 mr-2" />
                      E-mail
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Discussão
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Pipeline de Clientes
          </h2>
          <Badge variant="secondary">{filteredClients.length} clientes</Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar clientes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 h-8"
            />
          </div>

          {/* Filters */}
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as ClientStatus | "all")
            }
          >
            <SelectTrigger className="w-32 h-8">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {statusColumns.map((status) => (
                <SelectItem key={status.id} value={status.id}>
                  {status.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="flex items-center border border-gray-200 rounded-lg p-0.5">
            <Button
              variant={viewMode === "kanban" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="h-7 px-2"
            >
              <Grid3X3 className="w-3 h-3" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-7 px-2"
            >
              <List className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === "kanban" ? renderKanbanView() : renderListView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ModernClientesModule;
