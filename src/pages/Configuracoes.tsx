/**
 * ⚙️ MÓDULO CONFIGURAÇÕES - SISTEMA E PREFERÊNCIAS
 *
 * Configurações completas do sistema jurídico
 * - Perfil da Empresa
 * - Usuários e Permissões
 * - Integrações e APIs
 * - Personalização da Interface
 * - Configurações Jurídicas
 * - Backup e Segurança
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Users,
  Building,
  Zap,
  Palette,
  Shield,
  Database,
  Bell,
  Mail,
  Phone,
  Globe,
  Lock,
  Key,
  Download,
  Upload,
  RefreshCw,
  Save,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  AlertTriangle,
  Info,
  CheckCircle,
  Gavel,
  Scale,
  FileText,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuditSystem } from "@/hooks/useAuditSystem";
import { toast } from "sonner";

// Tipos
interface EmpresaConfig {
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  oab: string;
  responsavelTecnico: string;
  logo?: string;
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: "admin" | "manager" | "user" | "viewer";
  status: "ativo" | "inativo" | "suspenso";
  ultimoAcesso: Date;
  permissoes: string[];
}

interface IntegracaoConfig {
  nome: string;
  tipo: "api" | "webhook" | "email" | "sms";
  status: "ativo" | "inativo" | "erro";
  configuracao: Record<string, any>;
}

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState("empresa");
  const [loading, setLoading] = useState(false);
  const [empresaConfig, setEmpresaConfig] = useState<EmpresaConfig>({
    nome: "Escritório de Advocacia Silva & Associados",
    cnpj: "12.345.678/0001-90",
    email: "contato@silva-advocacia.com.br",
    telefone: "(11) 3333-4444",
    endereco: "Av. Paulista, 1000, Conjunto 1201",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01310-100",
    oab: "SP 123.456",
    responsavelTecnico: "João Silva",
  });

  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: "1",
      nome: "João Silva",
      email: "joao@silva-advocacia.com.br",
      role: "admin",
      status: "ativo",
      ultimoAcesso: new Date(),
      permissoes: ["*"],
    },
    {
      id: "2",
      nome: "Maria Santos",
      email: "maria@silva-advocacia.com.br",
      role: "manager",
      status: "ativo",
      ultimoAcesso: new Date(Date.now() - 86400000),
      permissoes: ["crm", "processos", "financeiro"],
    },
    {
      id: "3",
      nome: "Carlos Oliveira",
      email: "carlos@silva-advocacia.com.br",
      role: "user",
      status: "ativo",
      ultimoAcesso: new Date(Date.now() - 86400000 * 2),
      permissoes: ["crm", "processos"],
    },
  ]);

  const [integracoes, setIntegracoes] = useState<IntegracaoConfig[]>([
    {
      nome: "Advise API",
      tipo: "api",
      status: "ativo",
      configuracao: { url: "https://api.advise.com.br", token: "***" },
    },
    {
      nome: "Stripe Payments",
      tipo: "api",
      status: "ativo",
      configuracao: { publishableKey: "pk_***", secretKey: "sk_***" },
    },
    {
      nome: "SendGrid Email",
      tipo: "email",
      status: "inativo",
      configuracao: {
        apiKey: "SG.***",
        from: "noreply@silva-advocacia.com.br",
      },
    },
  ]);

  const [configuracoesSistema, setConfiguracoesSistema] = useState({
    tema: "claro",
    idioma: "pt-BR",
    timezone: "America/Sao_Paulo",
    formatoData: "DD/MM/YYYY",
    formatoHora: "24h",
    moeda: "BRL",
    notificacoes: {
      email: true,
      push: true,
      sms: false,
      desktop: true,
    },
    backup: {
      automatico: true,
      frequencia: "diario",
      retencao: 30,
    },
    seguranca: {
      autenticacao2FA: true,
      sessaoTimeout: 480,
      logAuditoria: true,
      criptografia: true,
    },
  });

  const { user, hasPermission } = usePermissions();
  const { logAction } = useAuditSystem();

  // Verificar permissões
  if (!hasPermission("configuracoes", "read")) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Acesso Negado
          </h3>
          <p className="text-gray-600">
            Você não tem permissão para acessar as configurações.
          </p>
        </div>
      </div>
    );
  }

  // Salvar configurações
  const salvarConfiguracoes = async (tipo: string, dados: any) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await logAction(
        "configuracao_atualizada",
        "configuracoes",
        { tipo, dados },
        "configuracao",
        tipo,
      );

      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    } finally {
      setLoading(false);
    }
  };

  // Renderizar tab de empresa
  const renderEmpresaTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="w-5 h-5" />
            <span>Dados da Empresa</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Empresa</Label>
              <Input
                id="nome"
                value={empresaConfig.nome}
                onChange={(e) =>
                  setEmpresaConfig({ ...empresaConfig, nome: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={empresaConfig.cnpj}
                onChange={(e) =>
                  setEmpresaConfig({ ...empresaConfig, cnpj: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Principal</Label>
              <Input
                id="email"
                type="email"
                value={empresaConfig.email}
                onChange={(e) =>
                  setEmpresaConfig({ ...empresaConfig, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={empresaConfig.telefone}
                onChange={(e) =>
                  setEmpresaConfig({
                    ...empresaConfig,
                    telefone: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={empresaConfig.endereco}
                onChange={(e) =>
                  setEmpresaConfig({
                    ...empresaConfig,
                    endereco: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={empresaConfig.cidade}
                onChange={(e) =>
                  setEmpresaConfig({ ...empresaConfig, cidade: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={empresaConfig.estado}
                onValueChange={(value) =>
                  setEmpresaConfig({ ...empresaConfig, estado: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SP">São Paulo</SelectItem>
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="MG">Minas Gerais</SelectItem>
                  <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                  {/* Adicionar outros estados conforme necessário */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                value={empresaConfig.cep}
                onChange={(e) =>
                  setEmpresaConfig({ ...empresaConfig, cep: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="oab">Registro OAB</Label>
              <Input
                id="oab"
                value={empresaConfig.oab}
                onChange={(e) =>
                  setEmpresaConfig({ ...empresaConfig, oab: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => salvarConfiguracoes("empresa", empresaConfig)}
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Salvar Alterações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Renderizar tab de usuários
  const renderUsuariosTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Usuários do Sistema</span>
            </CardTitle>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usuarios.map((usuario) => (
              <div
                key={usuario.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {usuario.nome
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{usuario.nome}</h4>
                    <p className="text-sm text-gray-500">{usuario.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge
                        className={
                          usuario.role === "admin"
                            ? "bg-red-100 text-red-800"
                            : usuario.role === "manager"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }
                      >
                        {usuario.role}
                      </Badge>
                      <Badge
                        className={
                          usuario.status === "ativo"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {usuario.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Renderizar tab de integrações
  const renderIntegracoesTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>APIs e Integrações</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integracoes.map((integracao, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{integracao.nome}</h4>
                    <p className="text-sm text-gray-500">
                      Tipo: {integracao.tipo}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    className={
                      integracao.status === "ativo"
                        ? "bg-green-100 text-green-800"
                        : integracao.status === "erro"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                    }
                  >
                    {integracao.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Renderizar tab de sistema
  const renderSistemaTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Personalização</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tema</Label>
              <Select
                value={configuracoesSistema.tema}
                onValueChange={(value) =>
                  setConfiguracoesSistema({
                    ...configuracoesSistema,
                    tema: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claro">Claro</SelectItem>
                  <SelectItem value="escuro">Escuro</SelectItem>
                  <SelectItem value="auto">Automático</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Idioma</Label>
              <Select
                value={configuracoesSistema.idioma}
                onValueChange={(value) =>
                  setConfiguracoesSistema({
                    ...configuracoesSistema,
                    idioma: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Segurança</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Autenticação de Dois Fatores</h4>
              <p className="text-sm text-gray-500">
                Adiciona uma camada extra de segurança
              </p>
            </div>
            <Switch
              checked={configuracoesSistema.seguranca.autenticacao2FA}
              onCheckedChange={(checked) =>
                setConfiguracoesSistema({
                  ...configuracoesSistema,
                  seguranca: {
                    ...configuracoesSistema.seguranca,
                    autenticacao2FA: checked,
                  },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Log de Auditoria</h4>
              <p className="text-sm text-gray-500">
                Registra todas as ações dos usuários
              </p>
            </div>
            <Switch
              checked={configuracoesSistema.seguranca.logAuditoria}
              onCheckedChange={(checked) =>
                setConfiguracoesSistema({
                  ...configuracoesSistema,
                  seguranca: {
                    ...configuracoesSistema.seguranca,
                    logAuditoria: checked,
                  },
                })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600">Sistema e preferências</p>
          </div>
        </div>
      </div>

      {/* Tabs de configuração */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="empresa" className="flex items-center space-x-2">
            <Building className="w-4 h-4" />
            <span>Empresa</span>
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Usuários</span>
          </TabsTrigger>
          <TabsTrigger
            value="integracoes"
            className="flex items-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Integrações</span>
          </TabsTrigger>
          <TabsTrigger value="sistema" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Sistema</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="empresa">{renderEmpresaTab()}</TabsContent>
        <TabsContent value="usuarios">{renderUsuariosTab()}</TabsContent>
        <TabsContent value="integracoes">{renderIntegracoesTab()}</TabsContent>
        <TabsContent value="sistema">{renderSistemaTab()}</TabsContent>
      </Tabs>
    </div>
  );
}
