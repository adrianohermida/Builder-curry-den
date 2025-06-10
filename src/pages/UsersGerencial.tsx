import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  UserPlus,
  Shield,
  Settings,
  Activity,
  Eye,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  departamento: string;
  status: "ativo" | "inativo" | "suspenso";
  perfil: "admin" | "gestor" | "usuario" | "viewer";
  ultimoAcesso: Date;
  dataCadastro: Date;
  avatar?: string;
  permissoes: string[];
}

const USERS_MOCK: User[] = [
  {
    id: "1",
    nome: "Ana Silva Santos",
    email: "ana.santos@lawdesk.com",
    telefone: "(11) 99999-0001",
    cargo: "Advogada Sênior",
    departamento: "Jurídico",
    status: "ativo",
    perfil: "admin",
    ultimoAcesso: new Date("2024-01-20T10:30:00"),
    dataCadastro: new Date("2023-01-15"),
    permissoes: ["read", "write", "delete", "admin"],
  },
  {
    id: "2",
    nome: "Carlos Eduardo Oliveira",
    email: "carlos.oliveira@lawdesk.com",
    telefone: "(11) 99999-0002",
    cargo: "Paralegal",
    departamento: "Jurídico",
    status: "ativo",
    perfil: "usuario",
    ultimoAcesso: new Date("2024-01-20T09:15:00"),
    dataCadastro: new Date("2023-03-10"),
    permissoes: ["read", "write"],
  },
  {
    id: "3",
    nome: "Maria Fernanda Costa",
    email: "maria.costa@lawdesk.com",
    telefone: "(11) 99999-0003",
    cargo: "Gerente de Projetos",
    departamento: "Gestão",
    status: "ativo",
    perfil: "gestor",
    ultimoAcesso: new Date("2024-01-19T16:45:00"),
    dataCadastro: new Date("2023-02-20"),
    permissoes: ["read", "write", "manage"],
  },
  {
    id: "4",
    nome: "João Pedro Almeida",
    email: "joao.almeida@lawdesk.com",
    telefone: "(11) 99999-0004",
    cargo: "Assistente Administrativo",
    departamento: "Administrativo",
    status: "inativo",
    perfil: "viewer",
    ultimoAcesso: new Date("2024-01-10T14:20:00"),
    dataCadastro: new Date("2023-05-05"),
    permissoes: ["read"],
  },
];

const PERFIS = {
  admin: { label: "Administrador", color: "bg-red-100 text-red-800" },
  gestor: { label: "Gestor", color: "bg-blue-100 text-blue-800" },
  usuario: { label: "Usuário", color: "bg-green-100 text-green-800" },
  viewer: { label: "Visualizador", color: "bg-gray-100 text-gray-800" },
};

const STATUS_CONFIG = {
  ativo: {
    label: "Ativo",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  inativo: {
    label: "Inativo",
    color: "bg-gray-100 text-gray-800",
    icon: XCircle,
  },
  suspenso: {
    label: "Suspenso",
    color: "bg-red-100 text-red-800",
    icon: AlertTriangle,
  },
};

export default function UsersGerencial() {
  const [users, setUsers] = useState<User[]>(USERS_MOCK);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [perfilFilter, setPerfilFilter] = useState<string>("");
  const [departamentoFilter, setDepartamentoFilter] = useState<string>("");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.cargo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !statusFilter || user.status === statusFilter;
    const matchesPerfil = !perfilFilter || user.perfil === perfilFilter;
    const matchesDepartamento =
      !departamentoFilter || user.departamento === departamentoFilter;

    return (
      matchesSearch && matchesStatus && matchesPerfil && matchesDepartamento
    );
  });

  const stats = {
    total: users.length,
    ativos: users.filter((u) => u.status === "ativo").length,
    inativos: users.filter((u) => u.status === "inativo").length,
    suspensos: users.filter((u) => u.status === "suspenso").length,
    admins: users.filter((u) => u.perfil === "admin").length,
    gestores: users.filter((u) => u.perfil === "gestor").length,
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    toast.success("Usuário removido com sucesso!");
  };

  const handleChangeUserStatus = (
    userId: string,
    newStatus: User["status"],
  ) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)),
    );
    toast.success("Status do usuário atualizado!");
  };

  const getDepartamentos = () => {
    return Array.from(new Set(users.map((u) => u.departamento)));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestão de Usuários
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie usuários, permissões e acessos do sistema
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Auditoria de Acesso
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Adicionar Usuário
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Usuários</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Usuários Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.ativos}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Progress
                    value={(stats.ativos / stats.total) * 100}
                    className="w-12 h-1"
                  />
                  {Math.round((stats.ativos / stats.total) * 100)}%
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Administradores</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.admins}
                </p>
              </div>
              <Shield className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Gestores</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.gestores}
                </p>
              </div>
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar usuários..."
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
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="suspenso">Suspenso</SelectItem>
              </SelectContent>
            </Select>

            <Select value={perfilFilter} onValueChange={setPerfilFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os perfis</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="gestor">Gestor</SelectItem>
                <SelectItem value="usuario">Usuário</SelectItem>
                <SelectItem value="viewer">Visualizador</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={departamentoFilter}
              onValueChange={setDepartamentoFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os departamentos</SelectItem>
                {getDepartamentos().map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Filtros Avançados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Usuários ({filteredUsers.length})</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Exportar
              </Button>
              <Button variant="outline" size="sm">
                <Activity className="h-4 w-4 mr-2" />
                Logs de Acesso
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Cargo/Depto</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => {
                const StatusIcon = STATUS_CONFIG[user.status].icon;
                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={
                              user.avatar ||
                              `https://avatar.vercel.sh/${user.nome}`
                            }
                          />
                          <AvatarFallback>
                            {user.nome
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.nome}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.cargo}
                        </p>
                        <p className="text-sm text-gray-500">
                          {user.departamento}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={PERFIS[user.perfil].color}>
                        {PERFIS[user.perfil].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-4 w-4" />
                        <Badge className={STATUS_CONFIG[user.status].color}>
                          {STATUS_CONFIG[user.status].label}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm text-gray-900">
                          {new Intl.DateTimeFormat("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }).format(user.ultimoAcesso)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Intl.DateTimeFormat("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(user.ultimoAcesso)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`mailto:${user.email}`}>
                            <Mail className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`tel:${user.telefone}`}>
                            <Phone className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
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
                            Editar Usuário
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="h-4 w-4 mr-2" />
                            Gerenciar Permissões
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === "ativo" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleChangeUserStatus(user.id, "suspenso")
                              }
                            >
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Suspender Usuário
                            </DropdownMenuItem>
                          )}
                          {user.status === "suspenso" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleChangeUserStatus(user.id, "ativo")
                              }
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Reativar Usuário
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remover Usuário
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
