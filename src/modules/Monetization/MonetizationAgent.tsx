import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Brain,
  TrendingUp,
  Lock,
  Unlock,
  Target,
  CreditCard,
  BarChart3,
  Zap,
  AlertTriangle,
  CheckCircle,
  Settings,
  Play,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MonetizationOpportunity {
  id: string;
  module: string;
  type: "petition" | "flipbook" | "template" | "consultation" | "contract";
  title: string;
  description: string;
  currentAccess: number;
  potentialRevenue: number;
  aiConfidence: number;
  suggestedPrice: number;
  status: "not_monetized" | "suggested" | "active" | "paused";
  createdAt: string;
}

interface MonetizationConfig {
  enabled: boolean;
  autoDetection: boolean;
  stripeEnabled: boolean;
  paywallEnabled: boolean;
  freePageLimit: number;
  globalPricing: {
    petition: number;
    template: number;
    consultation: number;
    flipbook: number;
  };
  aiPricingEnabled: boolean;
}

export const MonetizationAgent: React.FC = () => {
  const [config, setConfig] = useState<MonetizationConfig>({
    enabled: true,
    autoDetection: true,
    stripeEnabled: true,
    paywallEnabled: true,
    freePageLimit: 3,
    globalPricing: {
      petition: 29.9,
      template: 19.9,
      consultation: 99.9,
      flipbook: 15.9,
    },
    aiPricingEnabled: true,
  });

  const [opportunities, setOpportunities] = useState<MonetizationOpportunity[]>(
    [],
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Simulate loading opportunities
    const mockOpportunities: MonetizationOpportunity[] = [
      {
        id: "1",
        module: "IA Jurídica",
        type: "petition",
        title: "Petição de Divórcio Consensual",
        description: "Template IA com 347 acessos este mês",
        currentAccess: 347,
        potentialRevenue: 2890.5,
        aiConfidence: 94,
        suggestedPrice: 29.9,
        status: "suggested",
        createdAt: "2025-01-15",
      },
      {
        id: "2",
        module: "GED",
        type: "flipbook",
        title: "Manual de Compliance LGPD",
        description: "PDF com 128 visualizações semanais",
        currentAccess: 128,
        potentialRevenue: 1152.0,
        aiConfidence: 87,
        suggestedPrice: 24.9,
        status: "not_monetized",
        createdAt: "2025-01-12",
      },
      {
        id: "3",
        module: "CRM",
        type: "template",
        title: "Contrato de Prestação de Serviços",
        description: "Template editável com 89 downloads",
        currentAccess: 89,
        potentialRevenue: 890.0,
        aiConfidence: 76,
        suggestedPrice: 19.9,
        status: "active",
        createdAt: "2025-01-10",
      },
      {
        id: "4",
        module: "Atendimento",
        type: "consultation",
        title: "Consulta Jurídica Especializada",
        description: "Sessões de 30min com especialistas",
        currentAccess: 23,
        potentialRevenue: 4597.0,
        aiConfidence: 91,
        suggestedPrice: 199.9,
        status: "suggested",
        createdAt: "2025-01-08",
      },
    ];

    setOpportunities(mockOpportunities);
  }, []);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      // Add new opportunities
      const newOpportunity: MonetizationOpportunity = {
        id: Date.now().toString(),
        module: "IA Jurídica",
        type: "petition",
        title: "Modelo de Ação Trabalhista",
        description: "Template detectado com alto potencial",
        currentAccess: 67,
        potentialRevenue: 1340.0,
        aiConfidence: 89,
        suggestedPrice: 39.9,
        status: "suggested",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setOpportunities((prev) => [newOpportunity, ...prev]);
    }, 3000);
  };

  const handleActivateMonetization = (opportunityId: string) => {
    setOpportunities((prev) =>
      prev.map((opp) =>
        opp.id === opportunityId ? { ...opp, status: "active" } : opp,
      ),
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "not_monetized":
        return "bg-gray-100 text-gray-800";
      case "suggested":
        return "bg-blue-100 text-blue-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "petition":
        return <Zap className="w-4 h-4" />;
      case "flipbook":
        return <BarChart3 className="w-4 h-4" />;
      case "template":
        return <Target className="w-4 h-4" />;
      case "consultation":
        return <Brain className="w-4 h-4" />;
      case "contract":
        return <CreditCard className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const totalPotentialRevenue = opportunities.reduce(
    (sum, opp) => sum + opp.potentialRevenue,
    0,
  );
  const activeOpportunities = opportunities.filter(
    (opp) => opp.status === "active",
  ).length;
  const suggestedOpportunities = opportunities.filter(
    (opp) => opp.status === "suggested",
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            💰 Agente de Monetização Inteligente
          </h1>
          <p className="text-gray-600 mt-2">
            Detecta e sugere oportunidades de monetização automaticamente com IA
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={config.enabled}
            onCheckedChange={(checked) =>
              setConfig((prev) => ({ ...prev, enabled: checked }))
            }
          />
          <Label>Sistema Ativo</Label>
          <Button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-green-600 to-blue-600"
          >
            {isAnalyzing ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-pulse" />
                Analisando...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Executar Análise IA
              </>
            )}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Receita Potencial
                </p>
                <p className="text-2xl font-bold text-green-700">
                  R$ {totalPotentialRevenue.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <Badge className="mt-2 bg-green-100 text-green-800">
              {opportunities.length} oportunidades
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Ativos</p>
                <p className="text-2xl font-bold text-blue-700">
                  {activeOpportunities}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
            <Badge className="mt-2 bg-blue-100 text-blue-800">
              Monetizando
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Sugeridos</p>
                <p className="text-2xl font-bold text-purple-700">
                  {suggestedOpportunities}
                </p>
              </div>
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
            <Badge className="mt-2 bg-purple-100 text-purple-800">Por IA</Badge>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">
                  Confiança IA
                </p>
                <p className="text-2xl font-bold text-orange-700">
                  {Math.round(
                    opportunities.reduce(
                      (sum, opp) => sum + opp.aiConfidence,
                      0,
                    ) / opportunities.length,
                  )}
                  %
                </p>
              </div>
              <Target className="w-8 h-8 text-orange-500" />
            </div>
            <Badge className="mt-2 bg-orange-100 text-orange-800">Média</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="opportunities" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
          <TabsTrigger value="paywall">Paywall</TabsTrigger>
          <TabsTrigger value="pricing">Precificação IA</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
        </TabsList>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid gap-4">
            {opportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getTypeIcon(opportunity.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {opportunity.title}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {opportunity.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Módulo: {opportunity.module}</span>
                            <span>•</span>
                            <span>
                              Criado:{" "}
                              {new Date(
                                opportunity.createdAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(opportunity.status)}>
                        {opportunity.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          {opportunity.currentAccess}
                        </div>
                        <div className="text-sm text-gray-600">Acessos</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          R$ {opportunity.potentialRevenue.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          Receita Potencial
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">
                          {opportunity.aiConfidence}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Confiança IA
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-orange-600">
                          R$ {opportunity.suggestedPrice.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Preço Sugerido
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          Potencial de conversão:
                        </span>
                        <Progress
                          value={opportunity.aiConfidence}
                          className="w-32 h-2"
                        />
                        <span className="text-sm font-medium">
                          {opportunity.aiConfidence}%
                        </span>
                      </div>

                      {opportunity.status === "suggested" && (
                        <Button
                          onClick={() =>
                            handleActivateMonetization(opportunity.id)
                          }
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <DollarSign className="w-4 h-4 mr-2" />
                          Ativar Monetização
                        </Button>
                      )}

                      {opportunity.status === "not_monetized" && (
                        <Button variant="outline">
                          <Settings className="w-4 h-4 mr-2" />
                          Configurar
                        </Button>
                      )}

                      {opportunity.status === "active" && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ativo
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Paywall Tab */}
        <TabsContent value="paywall" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                Configurações do Paywall
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="paywall-enabled">Paywall Ativo</Label>
                    <Switch
                      id="paywall-enabled"
                      checked={config.paywallEnabled}
                      onCheckedChange={(checked) =>
                        setConfig((prev) => ({
                          ...prev,
                          paywallEnabled: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="free-pages">Páginas Gratuitas</Label>
                    <Input
                      id="free-pages"
                      type="number"
                      value={config.freePageLimit}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          freePageLimit: parseInt(e.target.value),
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Módulos Monitorados</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "GED",
                        "IA Jurídica",
                        "CRM",
                        "Atendimento",
                        "Flipbooks",
                      ].map((module) => (
                        <div
                          key={module}
                          className="flex items-center space-x-2"
                        >
                          <Switch id={module} defaultChecked />
                          <Label htmlFor={module} className="text-sm">
                            {module}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Preview do Paywall</h4>
                  <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Conteúdo Premium</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Você atingiu o limite de {config.freePageLimit} páginas
                        gratuitas.
                      </p>
                      <div className="space-y-2">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Desbloquear por R$ 19,90
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Unlock className="w-4 h-4 mr-2" />
                          Portal do Cliente
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Pricing Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Precificação Inteligente com IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">IA de Precificação</h4>
                  <p className="text-sm text-gray-600">
                    Ajusta preços automaticamente com base em demanda e
                    conversão
                  </p>
                </div>
                <Switch
                  checked={config.aiPricingEnabled}
                  onCheckedChange={(checked) =>
                    setConfig((prev) => ({
                      ...prev,
                      aiPricingEnabled: checked,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Preços Base por Categoria</h4>
                  {Object.entries(config.globalPricing).map(([type, price]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between"
                    >
                      <Label className="capitalize">{type}</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">R$</span>
                        <Input
                          type="number"
                          step="0.01"
                          value={price}
                          className="w-24"
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              globalPricing: {
                                ...prev.globalPricing,
                                [type]: parseFloat(e.target.value),
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Fatores de Ajuste IA</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-sm text-blue-800">
                        Demanda Alta
                      </div>
                      <div className="text-sm text-blue-600">
                        +15% - +30% no preço
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="font-medium text-sm text-yellow-800">
                        Abandono Alto
                      </div>
                      <div className="text-sm text-yellow-600">
                        -10% - -20% no preço
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-sm text-green-800">
                        Alta Conversão
                      </div>
                      <div className="text-sm text-green-600">
                        +5% - +15% no preço
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="font-medium text-sm text-purple-800">
                        Usuário Premium
                      </div>
                      <div className="text-sm text-purple-600">
                        +10% - +25% no preço
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Detecção Automática</Label>
                  <Switch
                    checked={config.autoDetection}
                    onCheckedChange={(checked) =>
                      setConfig((prev) => ({ ...prev, autoDetection: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Integração Stripe</Label>
                  <Switch
                    checked={config.stripeEnabled}
                    onCheckedChange={(checked) =>
                      setConfig((prev) => ({ ...prev, stripeEnabled: checked }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Frequência de Análise</Label>
                  <Select defaultValue="hourly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Tempo Real</SelectItem>
                      <SelectItem value="hourly">A cada hora</SelectItem>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertas e Notificações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">
                      Nova oportunidade detectada
                    </Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">
                      Conteúdo gratuito com alta demanda
                    </Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Inadimplência detectada</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Meta de receita atingida</Label>
                    <Switch />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Label className="text-sm">Canais de Notificação</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="email" defaultChecked />
                      <Label htmlFor="email" className="text-sm">
                        Email
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="dashboard" defaultChecked />
                      <Label htmlFor="dashboard" className="text-sm">
                        Dashboard
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="slack" />
                      <Label htmlFor="slack" className="text-sm">
                        Slack
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
