import { useState } from "react";
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Mail,
  User,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Tickets() {
  const [activeTab, setActiveTab] = useState("todos");

  const tickets = [
    {
      id: 1,
      title: "Dúvida sobre processo trabalhista",
      client: "João Silva",
      channel: "whatsapp",
      status: "aberto",
      priority: "alta",
      createdAt: "2024-12-15T10:30:00",
      lastUpdate: "2024-12-15T14:20:00",
      assignedTo: "Dr. Pedro Costa",
      category: "Consulta Jurídica",
    },
    {
      id: 2,
      title: "Documentos para audiência",
      client: "Maria Santos",
      channel: "email",
      status: "em_analise",
      priority: "media",
      createdAt: "2024-12-14T16:45:00",
      lastUpdate: "2024-12-15T09:15:00",
      assignedTo: "Dra. Ana Lima",
      category: "Documentação",
    },
    {
      id: 3,
      title: "Agendamento de reunião",
      client: "Carlos Oliveira",
      channel: "presencial",
      status: "resolvido",
      priority: "baixa",
      createdAt: "2024-12-13T11:20:00",
      lastUpdate: "2024-12-14T17:30:00",
      assignedTo: "Dra. Ana Lima",
      category: "Agendamento",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "aberto":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "em_analise":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "resolvido":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "aberto":
        return "Aberto";
      case "em_analise":
        return "Em Análise";
      case "resolvido":
        return "Resolvido";
      default:
        return status;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "whatsapp":
        return <MessageCircle className="h-4 w-4 text-green-600" />;
      case "email":
        return <Mail className="h-4 w-4 text-blue-600" />;
      case "presencial":
        return <User className="h-4 w-4 text-purple-600" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getChannelLabel = (channel: string) => {
    switch (channel) {
      case "whatsapp":
        return "WhatsApp";
      case "email":
        return "E-mail";
      case "presencial":
        return "Presencial";
      default:
        return channel;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "alta":
        return <Badge variant="destructive">Alta</Badge>;
      case "media":
        return <Badge variant="default">Média</Badge>;
      case "baixa":
        return <Badge variant="secondary">Baixa</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (activeTab === "todos") return true;
    if (activeTab === "abertos") return ticket.status === "aberto";
    if (activeTab === "em_analise") return ticket.status === "em_analise";
    if (activeTab === "resolvidos") return ticket.status === "resolvido";
    return true;
  });

  const ticketStats = {
    total: tickets.length,
    abertos: tickets.filter((t) => t.status === "aberto").length,
    em_analise: tickets.filter((t) => t.status === "em_analise").length,
    resolvidos: tickets.filter((t) => t.status === "resolvido").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Atendimento</h1>
          <p className="text-muted-foreground">
            Gestão de tickets e solicitações dos clientes
          </p>
        </div>
        <Button className="bg-[rgb(var(--theme-primary))] hover:bg-[rgb(var(--theme-primary))]/90">
          <Plus className="h-4 w-4 mr-2" />
          Novo Ticket
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total
                </p>
                <p className="text-2xl font-bold">{ticketStats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-[rgb(var(--theme-primary))]" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Abertos
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {ticketStats.abertos}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Em Análise
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {ticketStats.em_analise}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Resolvidos
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {ticketStats.resolvidos}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar tickets..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todos">Todos ({ticketStats.total})</TabsTrigger>
          <TabsTrigger value="abertos">
            Abertos ({ticketStats.abertos})
          </TabsTrigger>
          <TabsTrigger value="em_analise">
            Em Análise ({ticketStats.em_analise})
          </TabsTrigger>
          <TabsTrigger value="resolvidos">
            Resolvidos ({ticketStats.resolvidos})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredTickets.map((ticket) => (
            <Card
              key={ticket.id}
              className="rounded-2xl shadow-md hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(ticket.status)}
                      <h3 className="font-semibold text-lg">{ticket.title}</h3>
                      {getPriorityBadge(ticket.priority)}
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{ticket.client}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getChannelIcon(ticket.channel)}
                        <span>{getChannelLabel(ticket.channel)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(ticket.createdAt).toLocaleDateString(
                            "pt-BR",
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">{ticket.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        Atribuído para: {ticket.assignedTo}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className="flex items-center space-x-1"
                    >
                      {getStatusIcon(ticket.status)}
                      <span>{getStatusLabel(ticket.status)}</span>
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Responder</DropdownMenuItem>
                        <DropdownMenuItem>Atribuir</DropdownMenuItem>
                        <DropdownMenuItem>
                          Marcar como Resolvido
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* SLA Performance */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Performance de SLA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">92%</p>
              <p className="text-sm text-muted-foreground">
                Tickets respondidos em até 2h
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">4.8</p>
              <p className="text-sm text-muted-foreground">
                Nota média de satisfação
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">1.2h</p>
              <p className="text-sm text-muted-foreground">
                Tempo médio de resposta
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
