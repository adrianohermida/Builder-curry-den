import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Shield,
  Key,
  Activity,
  Clock,
  UserPlus,
  Settings,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "inactive" | "pending";
  lastActive: string;
  permissions: string[];
  avatar?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  memberCount: number;
  color: string;
}

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Carlos Silva",
      email: "carlos@lawdesk.com",
      role: "CEO",
      department: "Executivo",
      status: "active",
      lastActive: "2 min atrás",
      permissions: ["admin", "full_access"],
      avatar: "/api/placeholder/40/40",
    },
    {
      id: "2",
      name: "Ana Santos",
      email: "ana@lawdesk.com",
      role: "CTO",
      department: "Tecnologia",
      status: "active",
      lastActive: "5 min atrás",
      permissions: ["dev", "deploy", "database"],
    },
    {
      id: "3",
      name: "Pedro Lima",
      email: "pedro@lawdesk.com",
      role: "Desenvolvedor Senior",
      department: "Tecnologia",
      status: "active",
      lastActive: "15 min atrás",
      permissions: ["dev", "code_review"],
    },
    {
      id: "4",
      name: "Maria Costa",
      email: "maria@lawdesk.com",
      role: "Product Manager",
      department: "Produto",
      status: "active",
      lastActive: "1 hora atrás",
      permissions: ["product", "analytics"],
    },
    {
      id: "5",
      name: "João Rodrigues",
      email: "joao@lawdesk.com",
      role: "Designer UX",
      department: "Design",
      status: "active",
      lastActive: "30 min atrás",
      permissions: ["design", "prototyping"],
    },
    {
      id: "6",
      name: "Fernanda Oliveira",
      email: "fernanda@lawdesk.com",
      role: "Head de Marketing",
      department: "Marketing",
      status: "inactive",
      lastActive: "2 dias atrás",
      permissions: ["marketing", "campaigns"],
    },
  ];

  const roles: Role[] = [
    {
      id: "ceo",
      name: "CEO",
      description: "Acesso total ao sistema",
      permissions: ["admin", "full_access", "financial", "strategic"],
      memberCount: 1,
      color: "from-red-500 to-pink-600",
    },
    {
      id: "cto",
      name: "CTO",
      description: "Gestão técnica e infraestrutura",
      permissions: ["dev", "deploy", "database", "security"],
      memberCount: 1,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "dev",
      name: "Desenvolvedor",
      description: "Desenvolvimento e code review",
      permissions: ["dev", "code_review", "testing"],
      memberCount: 8,
      color: "from-green-500 to-green-600",
    },
    {
      id: "product",
      name: "Product Manager",
      description: "Gestão de produto e analytics",
      permissions: ["product", "analytics", "user_research"],
      memberCount: 2,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "design",
      name: "Designer",
      description: "Design e prototipagem",
      permissions: ["design", "prototyping", "user_testing"],
      memberCount: 3,
      color: "from-pink-500 to-pink-600",
    },
    {
      id: "marketing",
      name: "Marketing",
      description: "Campanhas e comunicação",
      permissions: ["marketing", "campaigns", "content"],
      memberCount: 4,
      color: "from-yellow-500 to-orange-600",
    },
    {
      id: "support",
      name: "Suporte",
      description: "Atendimento ao cliente",
      permissions: ["support", "tickets", "customer_data"],
      memberCount: 6,
      color: "from-cyan-500 to-cyan-600",
    },
    {
      id: "commercial",
      name: "Comercial",
      description: "Vendas e relacionamento",
      permissions: ["sales", "crm", "leads"],
      memberCount: 4,
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  const auditLogs = [
    {
      id: "1",
      user: "Ana Santos",
      action: "Criou novo usuário: Roberto Silva",
      timestamp: "2025-01-19 14:30",
      type: "create",
    },
    {
      id: "2",
      user: "Carlos Silva",
      action: "Alterou permissões do usuário: Maria Costa",
      timestamp: "2025-01-19 13:15",
      type: "update",
    },
    {
      id: "3",
      user: "Pedro Lima",
      action: "Deploy realizado em produção",
      timestamp: "2025-01-19 12:45",
      type: "deploy",
    },
    {
      id: "4",
      user: "Maria Costa",
      action: "Acessou relatório financeiro",
      timestamp: "2025-01-19 11:20",
      type: "access",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "inactive":
        return "Inativo";
      case "pending":
        return "Pendente";
      default:
        return status;
    }
  };

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Membros
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {teamMembers.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Membros Ativos
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {teamMembers.filter((m) => m.status === "active").length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Papéis Ativos
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {roles.length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Últimas Ações
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {auditLogs.length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="members">Membros da Equipe</TabsTrigger>
          <TabsTrigger value="roles">Papéis e Permissões</TabsTrigger>
          <TabsTrigger value="audit">Logs de Auditoria</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Buscar membros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80"
              />
            </div>
            <Button className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Adicionar Membro
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Membro
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Papel
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Departamento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Última Atividade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMembers.map((member, index) => (
                      <motion.tr
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {member.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline">{member.role}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {member.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusColor(member.status)}>
                            {getStatusText(member.status)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {member.lastActive}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${role.color} flex items-center justify-center`}
                      >
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <Badge>{role.memberCount} membros</Badge>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2">
                      {role.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {role.description}
                    </p>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Permissões
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((permission) => (
                          <Badge
                            key={permission}
                            variant="outline"
                            className="text-xs"
                          >
                            {permission}
                          </Badge>
                        ))}
                        {role.permissions.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{role.permissions.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Audit Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Logs de Ações Administrativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          log.type === "create"
                            ? "bg-green-500"
                            : log.type === "update"
                              ? "bg-blue-500"
                              : log.type === "deploy"
                                ? "bg-purple-500"
                                : "bg-gray-500"
                        }`}
                      ></div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {log.action}
                        </p>
                        <p className="text-sm text-gray-600">por {log.user}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{log.timestamp}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-600" />
                Configurações de Segurança
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">
                    Autenticação Dois Fatores (2FA)
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Obrigatório para todos os membros com acesso administrativo
                  </p>
                  <Badge className="bg-green-100 text-green-800">Ativado</Badge>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Sessões de Segurança</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Expiração automática após 8 horas de inatividade
                  </p>
                  <Badge className="bg-blue-100 text-blue-800">
                    Configurado
                  </Badge>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Logs de Auditoria</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Retenção de logs por 12 meses para compliance
                  </p>
                  <Badge className="bg-purple-100 text-purple-800">Ativo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
