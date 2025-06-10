import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Scale,
  FileText,
  Target,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Grid3X3,
  List,
  Calendar,
  TrendingUp,
  Star,
  Clock,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import MinimalistCRMDashboard from "@/components/CRM/MinimalistCRMDashboard";
import { cn } from "@/lib/utils";

// Types
interface ViewMode {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface QuickFilter {
  id: string;
  label: string;
  count: number;
  active: boolean;
}

interface ClientSummary {
  id: string;
  name: string;
  type: "individual" | "corporate";
  status: "active" | "vip" | "prospect" | "inactive";
  engagementScore: number;
  lastContact: string;
  totalValue: number;
  casesCount: number;
  avatar?: string;
}

const CRMMinimalist: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "kanban">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // View modes
  const viewModes: ViewMode[] = [
    { id: "grid", label: "Cards", icon: Grid3X3 },
    { id: "list", label: "Lista", icon: List },
    { id: "kanban", label: "Kanban", icon: Calendar },
  ];

  // Quick filters
  const [quickFilters, setQuickFilters] = useState<QuickFilter[]>([
    { id: "all", label: "Todos", count: 847, active: true },
    { id: "vip", label: "VIP", count: 23, active: false },
    { id: "active", label: "Ativos", count: 651, active: false },
    { id: "prospects", label: "Prospectos", count: 128, active: false },
    { id: "inactive", label: "Inativos", count: 45, active: false },
  ]);

  // Sample client data
  const clientsData: ClientSummary[] = [
    {
      id: "1",
      name: "Tech Corp LTDA",
      type: "corporate",
      status: "vip",
      engagementScore: 95,
      lastContact: "2025-01-15",
      totalValue: 450000,
      casesCount: 8,
    },
    {
      id: "2",
      name: "João Silva",
      type: "individual",
      status: "active",
      engagementScore: 78,
      lastContact: "2025-01-10",
      totalValue: 85000,
      casesCount: 3,
    },
    {
      id: "3",
      name: "Startup Legal",
      type: "corporate",
      status: "prospect",
      engagementScore: 65,
      lastContact: "2025-01-08",
      totalValue: 120000,
      casesCount: 1,
    },
    {
      id: "4",
      name: "Maria Santos",
      type: "individual",
      status: "active",
      engagementScore: 88,
      lastContact: "2025-01-12",
      totalValue: 65000,
      casesCount: 2,
    },
  ];

  // Handle URL parameters
  useEffect(() => {
    const tab = searchParams.get("tab") || "dashboard";
    const view = searchParams.get("view") || "grid";
    setActiveTab(tab);
    setViewMode(view as "grid" | "list" | "kanban");
  }, [searchParams]);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", tab);
    setSearchParams(newParams);
  };

  // Handle view mode change
  const handleViewModeChange = (mode: "grid" | "list" | "kanban") => {
    setViewMode(mode);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("view", mode);
    setSearchParams(newParams);
  };

  // Handle filter toggle
  const handleFilterToggle = (filterId: string) => {
    setQuickFilters((prev) =>
      prev.map((filter) => ({
        ...filter,
        active: filter.id === filterId,
      })),
    );
  };

  // Quick actions
  const quickActions = [
    {
      id: "new-client",
      label: "Novo Cliente",
      icon: Users,
      path: "/crm/clientes?action=new",
      color: "bg-blue-600",
    },
    {
      id: "new-process",
      label: "Novo Processo",
      icon: Scale,
      path: "/crm/processos?action=new",
      color: "bg-purple-600",
    },
    {
      id: "new-contract",
      label: "Novo Contrato",
      icon: FileText,
      path: "/crm/contratos?action=new",
      color: "bg-green-600",
    },
    {
      id: "new-task",
      label: "Nova Tarefa",
      icon: Target,
      path: "/crm/tarefas?action=new",
      color: "bg-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              CRM Jurídico
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie clientes, processos e oportunidades
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                onClick={() => navigate(action.path)}
                className={cn(
                  "text-white hover:opacity-90",
                  action.color,
                  "hidden lg:flex",
                )}
                size="sm"
              >
                <action.icon className="w-4 h-4 mr-2" />
                {action.label}
              </Button>
            ))}

            {/* Mobile quick action */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="lg:hidden">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {quickActions.map((action) => (
                  <DropdownMenuItem
                    key={action.id}
                    onClick={() => navigate(action.path)}
                  >
                    <action.icon className="w-4 h-4 mr-2" />
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Clientes</span>
            </TabsTrigger>
            <TabsTrigger value="processes" className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">Processos</span>
            </TabsTrigger>
            <TabsTrigger value="contracts" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Contratos</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Tarefas</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-6">
            <MinimalistCRMDashboard />
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="mt-6">
            <ClientsView
              data={clientsData}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              quickFilters={quickFilters}
              onFilterToggle={handleFilterToggle}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </TabsContent>

          {/* Processes Tab */}
          <TabsContent value="processes" className="mt-6">
            <ProcessesView />
          </TabsContent>

          {/* Contracts Tab */}
          <TabsContent value="contracts" className="mt-6">
            <ContractsView />
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="mt-6">
            <TasksView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Clients View Component
const ClientsView: React.FC<{
  data: ClientSummary[];
  viewMode: "grid" | "list" | "kanban";
  onViewModeChange: (mode: "grid" | "list" | "kanban") => void;
  quickFilters: QuickFilter[];
  onFilterToggle: (filterId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}> = ({
  data,
  viewMode,
  onViewModeChange,
  quickFilters,
  onFilterToggle,
  searchQuery,
  onSearchChange,
}) => {
  const viewModes: ViewMode[] = [
    { id: "grid", label: "Cards", icon: Grid3X3 },
    { id: "list", label: "Lista", icon: List },
    { id: "kanban", label: "Kanban", icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar clientes..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {quickFilters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={filter.active ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFilterToggle(filter.id)}
                  className="whitespace-nowrap"
                >
                  {filter.label}
                  <Badge variant="secondary" className="ml-2">
                    {filter.count}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              {viewModes.map((mode) => (
                <Button
                  key={mode.id}
                  variant={viewMode === mode.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewModeChange(mode.id as any)}
                  className="px-2"
                >
                  <mode.icon className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Grid */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}

      {/* Clients List */}
      {viewMode === "list" && (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((client) => (
                <ClientListItem key={client.id} client={client} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clients Kanban */}
      {viewMode === "kanban" && <ClientsKanban data={data} />}
    </div>
  );
};

// Client Card Component
const ClientCard: React.FC<{ client: ClientSummary }> = ({ client }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "vip":
        return "text-purple-600 bg-purple-100";
      case "active":
        return "text-green-600 bg-green-100";
      case "prospect":
        return "text-blue-600 bg-blue-100";
      case "inactive":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="hover:shadow-md transition-all cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
              {client.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {client.name}
              </h3>
              <Badge
                className={getStatusColor(client.status)}
                variant="secondary"
              >
                {client.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Ver perfil</DropdownMenuItem>
              <DropdownMenuItem>Editar</DropdownMenuItem>
              <DropdownMenuItem>Vincular processo</DropdownMenuItem>
              <DropdownMenuItem>Enviar mensagem</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Desativar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Engagement Score */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Engajamento
            </span>
            <span className={getEngagementColor(client.engagementScore)}>
              {client.engagementScore}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
            <div
              className={cn(
                "h-2 rounded-full",
                client.engagementScore >= 80
                  ? "bg-green-500"
                  : client.engagementScore >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500",
              )}
              style={{ width: `${client.engagementScore}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Valor Total</p>
            <p className="font-medium">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                notation: "compact",
              }).format(client.totalValue)}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Casos</p>
            <p className="font-medium">{client.casesCount}</p>
          </div>
        </div>

        {/* Last Contact */}
        <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
          <span>Último contato: {client.lastContact}</span>
        </div>
      </CardContent>
    </Card>
  );
};

// Client List Item Component
const ClientListItem: React.FC<{ client: ClientSummary }> = ({ client }) => {
  return (
    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
        {client.name.charAt(0)}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900 dark:text-white">
            {client.name}
          </h3>
          <Badge variant="outline" className="text-xs">
            {client.type}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {client.casesCount} casos •{" "}
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            notation: "compact",
          }).format(client.totalValue)}
        </p>
      </div>

      <div className="text-right">
        <div className="text-sm font-medium">{client.engagementScore}%</div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Engajamento
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Ver perfil</DropdownMenuItem>
          <DropdownMenuItem>Editar</DropdownMenuItem>
          <DropdownMenuItem>Vincular processo</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// Clients Kanban Component
const ClientsKanban: React.FC<{ data: ClientSummary[] }> = ({ data }) => {
  const columns = [
    { id: "prospect", title: "Prospectos", color: "border-t-blue-500" },
    { id: "active", title: "Ativos", color: "border-t-green-500" },
    { id: "vip", title: "VIP", color: "border-t-purple-500" },
    { id: "inactive", title: "Inativos", color: "border-t-gray-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((column) => {
        const columnClients = data.filter(
          (client) => client.status === column.id,
        );

        return (
          <Card key={column.id} className={cn("border-t-4", column.color)}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                {column.title}
                <Badge variant="secondary">{columnClients.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {columnClients.map((client) => (
                <div
                  key={client.id}
                  className="p-3 border rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {client.name.charAt(0)}
                    </div>
                    <h4 className="text-sm font-medium truncate">
                      {client.name}
                    </h4>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {client.casesCount} casos •{" "}
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      notation: "compact",
                    }).format(client.totalValue)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

// Placeholder components for other tabs
const ProcessesView: React.FC = () => (
  <Card>
    <CardContent className="p-8 text-center">
      <Scale className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Casos e Processos
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Visualização de processos será implementada aqui
      </p>
    </CardContent>
  </Card>
);

const ContractsView: React.FC = () => (
  <Card>
    <CardContent className="p-8 text-center">
      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Contratos
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Gestão de contratos será implementada aqui
      </p>
    </CardContent>
  </Card>
);

const TasksView: React.FC = () => (
  <Card>
    <CardContent className="p-8 text-center">
      <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Tarefas
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Sistema de tarefas será implementado aqui
      </p>
    </CardContent>
  </Card>
);

export default CRMMinimalist;
