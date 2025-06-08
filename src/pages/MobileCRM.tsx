import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  Filter,
  MoreVertical,
  User,
  Building,
  Calendar,
  FileText,
  TrendingUp,
  Star,
  Clock,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for mobile CRM
const mockClients = [
  {
    id: 1,
    name: "Maria Silva",
    email: "maria@email.com",
    phone: "(11) 99999-9999",
    company: "Silva & Associados",
    status: "ativo",
    lastContact: "2 dias atrás",
    cases: 3,
    value: "R$ 15.000",
    avatar: "",
    priority: "high",
  },
  {
    id: 2,
    name: "João Santos",
    email: "joao@empresa.com",
    phone: "(11) 88888-8888",
    company: "Empresa XYZ",
    status: "prospecto",
    lastContact: "1 semana atrás",
    cases: 1,
    value: "R$ 8.500",
    avatar: "",
    priority: "medium",
  },
  {
    id: 3,
    name: "Ana Costa",
    email: "ana@costa.com",
    phone: "(11) 77777-7777",
    company: "Costa Legal",
    status: "ativo",
    lastContact: "Hoje",
    cases: 5,
    value: "R$ 25.000",
    avatar: "",
    priority: "high",
  },
];

const quickStats = [
  { label: "Total", value: "156", color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Ativos", value: "142", color: "text-green-600", bg: "bg-green-50" },
  {
    label: "Prospects",
    value: "14",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  { label: "Novos", value: "8", color: "text-purple-600", bg: "bg-purple-50" },
];

export default function MobileCRM() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedClient, setSelectedClient] = useState<number | null>(null);

  const filteredClients = mockClients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active")
      return matchesSearch && client.status === "ativo";
    if (activeTab === "prospects")
      return matchesSearch && client.status === "prospecto";

    return matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50";
      case "medium":
        return "border-l-yellow-500 bg-yellow-50";
      default:
        return "border-l-green-500 bg-green-50";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 text-green-800";
      case "prospecto":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (selectedClient) {
    const client = mockClients.find((c) => c.id === selectedClient);
    if (!client) return null;

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedClient(null)}
            className="p-2"
          >
            ←
          </Button>
          <div>
            <h1 className="text-lg font-bold">Detalhes do Cliente</h1>
            <p className="text-sm text-muted-foreground">{client.name}</p>
          </div>
        </div>

        {/* Client Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={client.avatar} />
                <AvatarFallback className="text-lg">
                  {client.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{client.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {client.company}
                </p>
                <Badge
                  className={`text-xs mt-2 ${getStatusColor(client.status)}`}
                >
                  {client.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Ligar
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            E-mail
          </Button>
        </div>

        {/* Contact Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{client.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{client.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{client.company}</span>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {client.cases}
              </div>
              <div className="text-xs text-muted-foreground">Casos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {client.value}
              </div>
              <div className="text-xs text-muted-foreground">Valor</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Reunião agendada</p>
                <p className="text-xs text-muted-foreground">Hoje, 14:30</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Documento enviado</p>
                <p className="text-xs text-muted-foreground">2 dias atrás</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Proposta apresentada</p>
                <p className="text-xs text-muted-foreground">1 semana atrás</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            CRM
          </h1>
          <p className="text-sm text-muted-foreground">Gestão de clientes</p>
        </div>
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-2">
        {quickStats.map((stat, index) => (
          <Card key={index} className="p-0">
            <CardContent className="p-3 text-center">
              <div className={`text-lg font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar clientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          style={{ fontSize: "16px" }}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="text-xs">
            Todos
          </TabsTrigger>
          <TabsTrigger value="active" className="text-xs">
            Ativos
          </TabsTrigger>
          <TabsTrigger value="prospects" className="text-xs">
            Prospects
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4 space-y-3">
          {filteredClients.map((client) => (
            <Card
              key={client.id}
              className={cn(
                "cursor-pointer transition-colors hover:bg-accent/50 border-l-4",
                getPriorityColor(client.priority),
              )}
              onClick={() => setSelectedClient(client.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={client.avatar} />
                    <AvatarFallback>
                      {client.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm truncate">
                        {client.name}
                      </h3>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <p className="text-xs text-muted-foreground truncate">
                      {client.company}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getStatusColor(client.status)}`}
                      >
                        {client.status}
                      </Badge>

                      <span className="text-xs text-muted-foreground">
                        {client.lastContact}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{client.cases} casos</span>
                      <span>{client.value}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredClients.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhum cliente encontrado
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
