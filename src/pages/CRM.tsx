import { useState } from "react";
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
  Calendar,
  Scale,
  FileText,
  ArrowLeft,
  Building,
  User,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientForm } from "@/components/CRM/ClientForm";
import { ClientProcesses } from "@/components/CRM/ClientProcesses";
import { ClientPublications } from "@/components/CRM/ClientPublications";

type ViewMode = "list" | "form" | "processes" | "publications";

interface SelectedClient {
  id: number;
  name: string;
  document: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  lastContact: string;
  cases: number;
  revenue: string;
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
    complement?: string;
  };
}

export default function CRM() {
  const [activeTab, setActiveTab] = useState("clientes");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedClient, setSelectedClient] = useState<SelectedClient | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clients: SelectedClient[] = [
    {
      id: 1,
      name: "João Silva",
      document: "123.456.789-00",
      email: "joao.silva@email.com",
      phone: "(11) 99999-9999",
      company: "Silva & Associados",
      status: "ativo",
      lastContact: "2024-12-15",
      cases: 3,
      revenue: "R$ 15.000",
      address: {
        street: "Av. Paulista",
        number: "1000",
        neighborhood: "Bela Vista",
        city: "São Paulo",
        state: "SP",
        cep: "01310-100",
        complement: "Conjunto 101",
      },
    },
    {
      id: 2,
      name: "Maria Santos",
      document: "987.654.321-00",
      email: "maria@empresa.com",
      phone: "(11) 88888-8888",
      company: "Empresa XYZ Ltda",
      status: "ativo",
      lastContact: "2024-12-10",
      cases: 1,
      revenue: "R$ 8.500",
      address: {
        street: "Rua Augusta",
        number: "2500",
        neighborhood: "Consolação",
        city: "São Paulo",
        state: "SP",
        cep: "01412-100",
      },
    },
    {
      id: 3,
      name: "Carlos Oliveira",
      document: "111.222.333-44",
      email: "carlos@email.com",
      phone: "(11) 77777-7777",
      company: "Pessoa Física",
      status: "inativo",
      lastContact: "2024-11-20",
      cases: 0,
      revenue: "R$ 3.200",
      address: {
        street: "Rua da Consolação",
        number: "1500",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        cep: "01301-100",
      },
    },
    {
      id: 4,
      name: "Empresa ABC Ltda",
      document: "12.345.678/0001-90",
      email: "contato@empresaabc.com.br",
      phone: "(11) 3333-4444",
      company: "Empresa ABC Ltda",
      status: "ativo",
      lastContact: "2024-12-12",
      cases: 5,
      revenue: "R$ 25.000",
      address: {
        street: "Av. Faria Lima",
        number: "3000",
        neighborhood: "Itaim Bibi",
        city: "São Paulo",
        state: "SP",
        cep: "04538-132",
        complement: "10º andar",
      },
    },
  ];

  const processes = [
    {
      id: 1,
      number: "1234567-89.2024.8.26.0001",
      client: "João Silva",
      type: "Direito Civil",
      status: "em_andamento",
      lawyer: "Dr. Pedro Costa",
      startDate: "2024-10-15",
      nextHearing: "2024-12-20",
      value: "R$ 50.000",
    },
    {
      id: 2,
      number: "9876543-21.2024.8.26.0001",
      client: "Maria Santos",
      type: "Direito Trabalhista",
      status: "aguardando",
      lawyer: "Dra. Ana Lima",
      startDate: "2024-11-01",
      nextHearing: "2024-12-22",
      value: "R$ 25.000",
    },
  ];

  // Form submission handler
  const handleClientSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Client data:", formData);

      // In real app, this would save to backend
      setViewMode("list");
      // Show success message
    } catch (error) {
      console.error("Error saving client:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation handlers
  const handleViewProcesses = (client: SelectedClient) => {
    setSelectedClient(client);
    setViewMode("processes");
  };

  const handleViewPublications = (client: SelectedClient) => {
    setSelectedClient(client);
    setViewMode("publications");
  };

  const handleBackToList = () => {
    setSelectedClient(null);
    setViewMode("list");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
      case "em_andamento":
        return <Badge variant="default">Ativo</Badge>;
      case "inativo":
        return <Badge variant="secondary">Inativo</Badge>;
      case "aguardando":
        return <Badge variant="outline">Aguardando</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getClientTypeBadge = (document: string) => {
    const cleanDoc = document.replace(/[^\d]/g, "");
    if (cleanDoc.length === 11) {
      return (
        <Badge variant="outline" className="text-xs">
          <User className="h-3 w-3 mr-1" />
          PF
        </Badge>
      );
    } else if (cleanDoc.length === 14) {
      return (
        <Badge variant="outline" className="text-xs">
          <Building className="h-3 w-3 mr-1" />
          PJ
        </Badge>
      );
    }
    return null;
  };

  // Render different views based on current mode
  if (viewMode === "form") {
    return (
      <ClientForm
        onSubmit={handleClientSubmit}
        onCancel={handleBackToList}
        isLoading={isSubmitting}
      />
    );
  }

  if (viewMode === "processes" && selectedClient) {
    return (
      <ClientProcesses
        clientCpf={selectedClient.document}
        clientName={selectedClient.name}
        onBack={handleBackToList}
      />
    );
  }

  if (viewMode === "publications" && selectedClient) {
    return (
      <ClientPublications
        clientCpf={selectedClient.document}
        clientName={selectedClient.name}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CRM Jurídico</h1>
          <p className="text-muted-foreground">
            Gestão de clientes, contratos e processos
          </p>
        </div>
        <Button
          onClick={() => setViewMode("form")}
          className="bg-[rgb(var(--theme-primary))] hover:bg-[rgb(var(--theme-primary))]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="processos">Processos</TabsTrigger>
          <TabsTrigger value="contratos">Contratos</TabsTrigger>
        </TabsList>

        <TabsContent value="clientes" className="space-y-6">
          {/* Search and Filters */}
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar clientes..." className="pl-10" />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Client Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="rounded-2xl shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-[rgb(var(--theme-primary))]" />
                  <span className="text-sm font-medium">Total de Clientes</span>
                </div>
                <p className="text-2xl font-bold mt-2">89</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">Ativos</span>
                </div>
                <p className="text-2xl font-bold mt-2">67</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="text-sm font-medium">Pendentes</span>
                </div>
                <p className="text-2xl font-bold mt-2">15</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500" />
                  <span className="text-sm font-medium">Inativos</span>
                </div>
                <p className="text-2xl font-bold mt-2">7</p>
              </CardContent>
            </Card>
          </div>

          {/* Clients Table */}
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle>Lista de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Casos</TableHead>
                    <TableHead>Receita</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {client.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Último contato:{" "}
                              {new Date(client.lastContact).toLocaleDateString(
                                "pt-BR",
                              )}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-sm">
                              {client.document}
                            </span>
                            {getClientTypeBadge(client.document)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1 text-xs">
                            <Mail className="h-3 w-3" />
                            <span>{client.email}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs">
                            <Phone className="h-3 w-3" />
                            <span>{client.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{client.company}</TableCell>
                      <TableCell>{getStatusBadge(client.status)}</TableCell>
                      <TableCell>{client.cases}</TableCell>
                      <TableCell className="font-medium">
                        {client.revenue}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewProcesses(client)}
                            title="Ver Processos"
                          >
                            <Scale className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewPublications(client)}
                            title="Ver Publicações"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
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
                              <DropdownMenuItem
                                onClick={() => handleViewProcesses(client)}
                              >
                                <Scale className="h-4 w-4 mr-2" />
                                Consultar Processos
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleViewPublications(client)}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Ver Publicações
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processos" className="space-y-6">
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle>Processos em Andamento</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número do Processo</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Advogado</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Próxima Audiência</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processes.map((process) => (
                    <TableRow key={process.id}>
                      <TableCell className="font-mono text-xs">
                        {process.number}
                      </TableCell>
                      <TableCell>{process.client}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{process.type}</Badge>
                      </TableCell>
                      <TableCell>{process.lawyer}</TableCell>
                      <TableCell>{getStatusBadge(process.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(process.nextHearing).toLocaleDateString(
                              "pt-BR",
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {process.value}
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
                              Ver Andamentos
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contratos" className="space-y-6">
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-12 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Gestão de Contratos</h3>
                <p className="text-muted-foreground">
                  Funcionalidade em desenvolvimento. Em breve você poderá
                  gerenciar todos os contratos dos seus clientes.
                </p>
                <Button className="bg-[rgb(var(--theme-primary))] hover:bg-[rgb(var(--theme-primary))]/90">
                  Criar Primeiro Contrato
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
