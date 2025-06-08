import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Code,
  Zap,
  Copy,
  Download,
  Upload,
  Play,
  Settings,
  GitBranch,
  History,
  Eye,
  Edit,
  Trash2,
  Plus,
  Brain,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Blueprint {
  id: string;
  nome: string;
  tipo:
    | "Dashboard"
    | "CRUD"
    | "GED"
    | "Painel"
    | "Atendimento"
    | "Tarefas"
    | "Financeiro";
  modulo_base?: string;
  rota: string;
  integra_com: string[];
  camadas: ("dados" | "api" | "visual")[];
  visao_padrao: string;
  versao: string;
  status: "draft" | "active" | "archived";
  gerar_IA: boolean;
  plano_acao_automatico: boolean;
  created_at: string;
  updated_at: string;
  autor: string;
  uso_count: number;
  revenue_impact: number;
  clones: number;
}

interface BlueprintTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  layers: string[];
  integrations: string[];
  defaultView: string;
  icon: string;
}

export const BlueprintBuilder: React.FC = () => {
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(
    null,
  );
  const [isCreating, setIsCreating] = useState(false);
  const [newBlueprint, setNewBlueprint] = useState<Partial<Blueprint>>({
    nome: "",
    tipo: "Dashboard",
    rota: "",
    integra_com: [],
    camadas: ["visual"],
    visao_padrao: "",
    gerar_IA: true,
    plano_acao_automatico: true,
  });

  const templates: BlueprintTemplate[] = [
    {
      id: "dashboard-analytics",
      name: "Dashboard Analytics",
      description: "Painel com gráficos e métricas",
      type: "Dashboard",
      layers: ["dados", "api", "visual"],
      integrations: ["Analytics", "Charts", "Database"],
      defaultView: "Grid com gráficos",
      icon: "📊",
    },
    {
      id: "crud-legal",
      name: "CRUD Jurídico",
      description: "Interface completa para gestão de dados",
      type: "CRUD",
      layers: ["dados", "api", "visual"],
      integrations: ["Database", "Forms", "Validation"],
      defaultView: "Tabela com filtros",
      icon: "📝",
    },
    {
      id: "ged-documents",
      name: "GED Modular",
      description: "Sistema de gestão de documentos",
      type: "GED",
      layers: ["dados", "api", "visual"],
      integrations: ["FileStorage", "Search", "OCR"],
      defaultView: "Grid de documentos",
      icon: "📁",
    },
    {
      id: "ai-assistant",
      name: "Assistente IA",
      description: "Interface de chat com IA",
      type: "Painel",
      layers: ["api", "visual"],
      integrations: ["AI", "Chat", "NLP"],
      defaultView: "Chat interface",
      icon: "🤖",
    },
    {
      id: "support-ticket",
      name: "Sistema de Tickets",
      description: "Gestão de atendimento",
      type: "Atendimento",
      layers: ["dados", "api", "visual"],
      integrations: ["Tickets", "Email", "Notifications"],
      defaultView: "Kanban de tickets",
      icon: "🎧",
    },
    {
      id: "task-manager",
      name: "Gerenciador de Tarefas",
      description: "Sistema de tarefas colaborativo",
      type: "Tarefas",
      layers: ["dados", "api", "visual"],
      integrations: ["Tasks", "Calendar", "Notifications"],
      defaultView: "Lista com prioridades",
      icon: "✅",
    },
  ];

  useEffect(() => {
    // Load mock blueprints
    const mockBlueprints: Blueprint[] = [
      {
        id: "1",
        nome: "Painel Financeiro Monetizado",
        tipo: "Dashboard",
        modulo_base: "Financeiro",
        rota: "/financeiro/indicadores",
        integra_com: ["Stripe", "Contratos", "Clientes"],
        camadas: ["dados", "api", "visual"],
        visao_padrao: "Kanban com gráficos",
        versao: "v1.2",
        status: "active",
        gerar_IA: true,
        plano_acao_automatico: true,
        created_at: "2025-01-15",
        updated_at: "2025-01-18",
        autor: "Ana Santos",
        uso_count: 47,
        revenue_impact: 125000,
        clones: 3,
      },
      {
        id: "2",
        nome: "CRM Médico Especializado",
        tipo: "CRUD",
        modulo_base: "CRM",
        rota: "/crm-medico",
        integra_com: ["Patients", "Appointments", "Medical Records"],
        camadas: ["dados", "api", "visual"],
        visao_padrao: "Lista de pacientes",
        versao: "v2.1",
        status: "active",
        gerar_IA: true,
        plano_acao_automatico: true,
        created_at: "2025-01-10",
        updated_at: "2025-01-16",
        autor: "Carlos Silva",
        uso_count: 23,
        revenue_impact: 89000,
        clones: 1,
      },
      {
        id: "3",
        nome: "Assistente IA Trabalhista",
        tipo: "Painel",
        rota: "/ia/trabalhista",
        integra_com: ["IA Engine", "Legal Database", "Templates"],
        camadas: ["api", "visual"],
        visao_padrao: "Chat com sugestões",
        versao: "v1.0",
        status: "draft",
        gerar_IA: true,
        plano_acao_automatico: false,
        created_at: "2025-01-12",
        updated_at: "2025-01-12",
        autor: "Maria Costa",
        uso_count: 8,
        revenue_impact: 0,
        clones: 0,
      },
    ];

    setBlueprints(mockBlueprints);
  }, []);

  const handleCreateBlueprint = async () => {
    setIsCreating(true);

    // Simulate blueprint creation
    setTimeout(() => {
      const blueprint: Blueprint = {
        id: Date.now().toString(),
        nome: newBlueprint.nome || "Novo Blueprint",
        tipo: newBlueprint.tipo || "Dashboard",
        rota: newBlueprint.rota || "/novo-modulo",
        integra_com: newBlueprint.integra_com || [],
        camadas: newBlueprint.camadas || ["visual"],
        visao_padrao: newBlueprint.visao_padrao || "Grid padrão",
        versao: "v1.0",
        status: "draft",
        gerar_IA: newBlueprint.gerar_IA || true,
        plano_acao_automatico: newBlueprint.plano_acao_automatico || true,
        created_at: new Date().toISOString().split("T")[0],
        updated_at: new Date().toISOString().split("T")[0],
        autor: "Usuário Atual",
        uso_count: 0,
        revenue_impact: 0,
        clones: 0,
      };

      setBlueprints((prev) => [blueprint, ...prev]);
      setNewBlueprint({
        nome: "",
        tipo: "Dashboard",
        rota: "",
        integra_com: [],
        camadas: ["visual"],
        visao_padrao: "",
        gerar_IA: true,
        plano_acao_automatico: true,
      });
      setIsCreating(false);
    }, 2000);
  };

  const handleCloneBlueprint = (blueprint: Blueprint) => {
    const clonedBlueprint: Blueprint = {
      ...blueprint,
      id: Date.now().toString(),
      nome: `${blueprint.nome} (Clone)`,
      versao: "v1.0",
      status: "draft",
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
      uso_count: 0,
      revenue_impact: 0,
      clones: 0,
    };

    setBlueprints((prev) => [clonedBlueprint, ...prev]);

    // Update original clone count
    setBlueprints((prev) =>
      prev.map((bp) =>
        bp.id === blueprint.id ? { ...bp, clones: bp.clones + 1 } : bp,
      ),
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Dashboard":
        return "📊";
      case "CRUD":
        return "📝";
      case "GED":
        return "📁";
      case "Painel":
        return "🖥️";
      case "Atendimento":
        return "🎧";
      case "Tarefas":
        return "✅";
      case "Financeiro":
        return "💰";
      default:
        return "📦";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🔧 Blueprint Builder
          </h1>
          <p className="text-gray-600 mt-2">
            Construtor modular inteligente para criação de módulos versionáveis
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Novo Blueprint
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Blueprint</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Blueprint</Label>
                  <Input
                    id="nome"
                    value={newBlueprint.nome}
                    onChange={(e) =>
                      setNewBlueprint((prev) => ({
                        ...prev,
                        nome: e.target.value,
                      }))
                    }
                    placeholder="Ex: CRM Médico Avançado"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Módulo</Label>
                  <Select
                    value={newBlueprint.tipo}
                    onValueChange={(value) =>
                      setNewBlueprint((prev) => ({
                        ...prev,
                        tipo: value as any,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dashboard">Dashboard</SelectItem>
                      <SelectItem value="CRUD">CRUD</SelectItem>
                      <SelectItem value="GED">GED</SelectItem>
                      <SelectItem value="Painel">Painel</SelectItem>
                      <SelectItem value="Atendimento">Atendimento</SelectItem>
                      <SelectItem value="Tarefas">Tarefas</SelectItem>
                      <SelectItem value="Financeiro">Financeiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rota">Rota do Módulo</Label>
                  <Input
                    id="rota"
                    value={newBlueprint.rota}
                    onChange={(e) =>
                      setNewBlueprint((prev) => ({
                        ...prev,
                        rota: e.target.value,
                      }))
                    }
                    placeholder="Ex: /crm-medico"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visao">Visão Padrão</Label>
                  <Input
                    id="visao"
                    value={newBlueprint.visao_padrao}
                    onChange={(e) =>
                      setNewBlueprint((prev) => ({
                        ...prev,
                        visao_padrao: e.target.value,
                      }))
                    }
                    placeholder="Ex: Lista com filtros"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Camadas do Módulo</Label>
                  <div className="flex gap-4 mt-2">
                    {["dados", "api", "visual"].map((camada) => (
                      <div key={camada} className="flex items-center space-x-2">
                        <Switch
                          id={camada}
                          checked={newBlueprint.camadas?.includes(
                            camada as any,
                          )}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewBlueprint((prev) => ({
                                ...prev,
                                camadas: [
                                  ...(prev.camadas || []),
                                  camada as any,
                                ],
                              }));
                            } else {
                              setNewBlueprint((prev) => ({
                                ...prev,
                                camadas: prev.camadas?.filter(
                                  (c) => c !== camada,
                                ),
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={camada} className="capitalize">
                          {camada}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Gerar com IA</Label>
                    <p className="text-sm text-gray-600">
                      Usar IA para gerar código automático
                    </p>
                  </div>
                  <Switch
                    checked={newBlueprint.gerar_IA}
                    onCheckedChange={(checked) =>
                      setNewBlueprint((prev) => ({
                        ...prev,
                        gerar_IA: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Plano de Ação Automático</Label>
                    <p className="text-sm text-gray-600">
                      Criar plano de implementação automaticamente
                    </p>
                  </div>
                  <Switch
                    checked={newBlueprint.plano_acao_automatico}
                    onCheckedChange={(checked) =>
                      setNewBlueprint((prev) => ({
                        ...prev,
                        plano_acao_automatico: checked,
                      }))
                    }
                  />
                </div>
              </div>

              <Button
                onClick={handleCreateBlueprint}
                disabled={isCreating || !newBlueprint.nome}
                className="w-full"
              >
                {isCreating ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-pulse" />
                    Gerando Blueprint...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Criar Blueprint
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Blueprints
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {blueprints.length}
                </p>
              </div>
              <Package className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {blueprints.filter((bp) => bp.status === "active").length}
                </p>
              </div>
              <Play className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Clones
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {blueprints.reduce((sum, bp) => sum + bp.clones, 0)}
                </p>
              </div>
              <Copy className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Impacto Receita
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  R${" "}
                  {(
                    blueprints.reduce((sum, bp) => sum + bp.revenue_impact, 0) /
                    1000
                  ).toFixed(0)}
                  K
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="blueprints" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="blueprints">Meus Blueprints</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        {/* Blueprints Tab */}
        <TabsContent value="blueprints" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blueprints.map((blueprint, index) => (
              <motion.div
                key={blueprint.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {getTypeIcon(blueprint.tipo)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{blueprint.nome}</h3>
                          <p className="text-sm text-gray-600">
                            {blueprint.rota}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(blueprint.status)}>
                        {blueprint.status}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Versão</span>
                        <span className="font-medium">{blueprint.versao}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Uso</span>
                        <span className="font-medium">
                          {blueprint.uso_count}x
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Clones</span>
                        <span className="font-medium">{blueprint.clones}</span>
                      </div>
                      {blueprint.revenue_impact > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Receita</span>
                          <span className="font-medium text-green-600">
                            R$ {(blueprint.revenue_impact / 1000).toFixed(0)}K
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {blueprint.camadas.map((camada) => (
                        <Badge
                          key={camada}
                          variant="outline"
                          className="text-xs"
                        >
                          {camada}
                        </Badge>
                      ))}
                      {blueprint.gerar_IA && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-purple-50 text-purple-700"
                        >
                          IA
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCloneBlueprint(blueprint)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-2xl">{template.icon}</div>
                      <div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-gray-600">
                          {template.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <span className="text-sm text-gray-600">Tipo: </span>
                        <Badge variant="outline">{template.type}</Badge>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Visão: </span>
                        <span className="text-sm">{template.defaultView}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {template.layers.map((layer) => (
                          <Badge
                            key={layer}
                            variant="outline"
                            className="text-xs"
                          >
                            {layer}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Usar Template
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                Histórico de Blueprints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {blueprints.map((blueprint) => (
                  <div
                    key={blueprint.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-lg">
                        {getTypeIcon(blueprint.tipo)}
                      </div>
                      <div>
                        <h4 className="font-medium">{blueprint.nome}</h4>
                        <p className="text-sm text-gray-600">
                          Criado em{" "}
                          {new Date(blueprint.created_at).toLocaleDateString()}{" "}
                          por {blueprint.autor}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(blueprint.status)}>
                        {blueprint.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <GitBranch className="w-3 h-3 mr-1" />
                        {blueprint.versao}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
