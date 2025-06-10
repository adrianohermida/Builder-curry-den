import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Users,
  Scale,
  FileText,
  Target,
  Eye,
  Edit,
  Trash2,
  Grid3X3,
  List,
  SortAsc,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import FeedIntegrationPanel from "@/components/Feed/FeedIntegrationPanel";
import GlobalNotificationsWidget from "@/components/Feed/GlobalNotificationsWidget";
import { cn } from "@/lib/utils";

// Types
interface Client {
  id: string;
  name: string;
  company?: string;
  status: "active" | "inactive" | "prospect" | "vip";
  cases: number;
  value: number;
  lastContact: string;
  avatar?: string;
}

interface Process {
  id: string;
  title: string;
  client: string;
  status: "active" | "pending" | "completed" | "urgent";
  progress: number;
  dueDate: string;
}

const CRMProfessional: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data - DADOS REALISTAS
  const clients: Client[] = [
    {
      id: "1",
      name: "João Silva",
      company: "Silva & Associados",
      status: "vip",
      cases: 8,
      value: 245000,
      lastContact: "Ontem",
    },
    {
      id: "2",
      name: "Maria Santos",
      company: "Tech Solutions LTDA",
      status: "active",
      cases: 3,
      value: 89000,
      lastContact: "2 dias",
    },
    {
      id: "3",
      name: "Carlos Oliveira",
      status: "prospect",
      cases: 1,
      value: 45000,
      lastContact: "1 semana",
    },
    {
      id: "4",
      name: "Ana Costa",
      company: "StartupLegal Inc",
      status: "active",
      cases: 5,
      value: 156000,
      lastContact: "Hoje",
    },
  ];

  const processes: Process[] = [
    {
      id: "p1",
      title: "Ação Trabalhista #2024-001",
      client: "João Silva",
      status: "urgent",
      progress: 75,
      dueDate: "Amanhã",
    },
    {
      id: "p2",
      title: "Revisão Contratual #2024-002",
      client: "Tech Solutions LTDA",
      status: "active",
      progress: 45,
      dueDate: "5 dias",
    },
    {
      id: "p3",
      title: "Consultoria Jurídica #2024-003",
      client: "Ana Costa",
      status: "pending",
      progress: 20,
      dueDate: "2 semanas",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      vip: "bg-gray-900 text-white",
      active: "bg-green-100 text-green-800 border-green-200",
      inactive: "bg-gray-100 text-gray-800 border-gray-200",
      prospect: "bg-blue-100 text-blue-800 border-blue-200",
      urgent: "bg-red-100 text-red-800 border-red-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      completed: "bg-green-100 text-green-800 border-green-200",
    };

    return variants[status as keyof typeof variants] || variants.inactive;
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      {/* Header Limpo */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM Jurídico</h1>
          <p className="text-gray-600 mt-1">
            Gestão completa de clientes e processos
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => navigate("/crm/clientes?action=new")}
            className="bg-gray-900 text-white hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
          <Button
            onClick={() => navigate("/crm/processos?action=new")}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Scale className="w-4 h-4 mr-2" />
            Novo Processo
          </Button>
        </div>
      </div>

      {/* Tabs Navigation - SIMPLES */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-white"
          >
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="clients" className="data-[state=active]:bg-white">
            Clientes
          </TabsTrigger>
          <TabsTrigger
            value="processes"
            className="data-[state=active]:bg-white"
          >
            Processos
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-white">
            Relatórios
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Métricas */}
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total de Clientes
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">247</p>
                  </div>
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Processos Ativos
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">89</p>
                  </div>
                  <Scale className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Receita Mensal
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      R$ 435K
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Clientes Recentes */}
            <Card className="border-gray-200">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-gray-900">
                  Clientes Recentes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {clients.slice(0, 4).map((client) => (
                    <div
                      key={client.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gray-200 text-gray-700">
                              {client.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">
                              {client.name}
                            </p>
                            {client.company && (
                              <p className="text-sm text-gray-600">
                                {client.company}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge
                          className={cn(
                            "border",
                            getStatusBadge(client.status),
                          )}
                        >
                          {client.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Processos Urgentes */}
            <Card className="border-gray-200">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-gray-900">
                  Processos Urgentes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {processes.map((process) => (
                  <div
                    key={process.id}
                    className="p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {process.title}
                      </h4>
                      <Badge
                        className={cn(
                          "border text-xs",
                          getStatusBadge(process.status),
                        )}
                      >
                        {process.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {process.client}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Progresso</span>
                        <span>{process.progress}%</span>
                      </div>
                      <Progress
                        value={process.progress}
                        className="h-2 bg-gray-200"
                      />
                      <p className="text-xs text-gray-500">
                        Prazo: {process.dueDate}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-6">
          {/* Filters and Search */}
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar clientes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-gray-900"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300"
                  >
                    <SortAsc className="w-4 h-4 mr-2" />
                    Ordenar
                  </Button>
                  <div className="flex border border-gray-300 rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clients Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gray-200 text-gray-700">
                              {client.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {client.name}
                            </h3>
                            {client.company && (
                              <p className="text-sm text-gray-600">
                                {client.company}
                              </p>
                            )}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-1">
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <Badge
                        className={cn(
                          "mb-4 border",
                          getStatusBadge(client.status),
                        )}
                      >
                        {client.status.toUpperCase()}
                      </Badge>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Casos:</span>
                          <span className="font-medium">{client.cases}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Valor:</span>
                          <span className="font-medium">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                              notation: "compact",
                            }).format(client.value)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Último contato:</span>
                          <span className="font-medium">
                            {client.lastContact}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="border-gray-200">
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gray-200 text-gray-700">
                              {client.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {client.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {client.company || "Cliente individual"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <Badge
                            className={cn(
                              "border",
                              getStatusBadge(client.status),
                            )}
                          >
                            {client.status.toUpperCase()}
                          </Badge>
                          <div className="text-right text-sm">
                            <p className="font-medium">{client.cases} casos</p>
                            <p className="text-gray-600">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                                notation: "compact",
                              }).format(client.value)}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Processes Tab */}
        <TabsContent value="processes" className="space-y-6">
          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-gray-900">
                Lista de Processos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {processes.map((process) => (
                  <div
                    key={process.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {process.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Cliente: {process.client}
                        </p>
                        <div className="mt-3 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Progresso</span>
                            <span className="font-medium">
                              {process.progress}%
                            </span>
                          </div>
                          <Progress
                            value={process.progress}
                            className="h-2 bg-gray-200"
                          />
                          <p className="text-xs text-gray-500">
                            Prazo: {process.dueDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 ml-6">
                        <Badge
                          className={cn(
                            "border",
                            getStatusBadge(process.status),
                          )}
                        >
                          {process.status.toUpperCase()}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card className="border-gray-200">
            <CardContent className="p-8 text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Relatórios em Desenvolvimento
              </h3>
              <p className="text-gray-600">
                Esta seção conterá relatórios detalhados do CRM
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMProfessional;
