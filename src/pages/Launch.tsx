import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  Target,
  Brain,
  CheckCircle,
  TrendingUp,
  Users,
  DollarSign,
  Star,
  Zap,
  Globe,
  Package,
  BarChart3,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Import Launch components from existing ActionPlan
import { ReleaseFrameworkDashboard } from "@/components/ActionPlan/ReleaseFrameworkDashboard";
import { IntelligentMonitor } from "@/components/ActionPlan/IntelligentMonitor";
import { AIAnalyzer } from "@/components/ActionPlan/AIAnalyzer";

// Import new Launch specific components
import { ProductLaunchManager } from "@/components/Launch/ProductLaunchManager";
import { MarketAnalysis } from "@/components/Launch/MarketAnalysis";
import { LaunchMetrics } from "@/components/Launch/LaunchMetrics";

export default function Launch() {
  const [activeTab, setActiveTab] = useState("framework");
  const [selectedLaunch, setSelectedLaunch] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🚀 Launch - Sistema de Lançamentos
          </h1>
          <p className="text-muted-foreground">
            Governança Inteligente para Lançamento de Produtos e Serviços
          </p>
        </motion.div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            <Target className="h-4 w-4 mr-2" />
            Novo Lançamento
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Rocket className="h-4 w-4 mr-2" />
            Dashboard Executivo
          </Button>
        </div>
      </div>

      {/* Launch Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Em Planejamento
                </p>
                <p className="text-2xl font-bold text-blue-700">12</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">
                  Em Desenvolvimento
                </p>
                <p className="text-2xl font-bold text-yellow-700">8</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="mt-2">
              <Progress value={60} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">
                  Em Validação
                </p>
                <p className="text-2xl font-bold text-purple-700">5</p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <Progress value={40} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Prontos para Lançar
                </p>
                <p className="text-2xl font-bold text-green-700">3</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Progress value={100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-pink-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600">Lançados</p>
                <p className="text-2xl font-bold text-pink-700">28</p>
              </div>
              <Globe className="h-8 w-8 text-pink-500" />
            </div>
            <div className="mt-2">
              <Badge className="bg-pink-100 text-pink-800">+5 este mês</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Impact */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">R$ 2.8M</div>
              <div className="text-purple-100">Receita Projetada</div>
            </div>
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">+127%</div>
              <div className="text-purple-100">Crescimento Esperado</div>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">15.2K</div>
              <div className="text-purple-100">Novos Usuários</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="framework" className="flex items-center gap-2">
            <Rocket className="h-4 w-4" />
            Framework
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="market" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Mercado
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Métricas
          </TabsTrigger>
          <TabsTrigger value="intelligence" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Inteligência
          </TabsTrigger>
        </TabsList>

        {/* Release Framework Tab */}
        <TabsContent value="framework" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-purple-500" />
                  Framework de Lançamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReleaseFrameworkDashboard />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Product Management Tab */}
        <TabsContent value="products" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  Gestão de Produtos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProductLaunchManager
                  onLaunchSelect={setSelectedLaunch}
                  selectedLaunch={selectedLaunch}
                />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Market Analysis Tab */}
        <TabsContent value="market" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  Análise de Mercado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MarketAnalysis />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Launch Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  Métricas de Lançamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LaunchMetrics />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* AI Intelligence Tab */}
        <TabsContent value="intelligence" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    Monitor Inteligente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <IntelligentMonitor />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Análise IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AIAnalyzer
                    onTaskGenerated={(task) =>
                      console.log("Task generated:", task)
                    }
                  />
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Launch Calendar */}
      <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-500" />
            Calendário de Lançamentos 2025
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="font-medium">Q1 2025</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• LawBot AI v2.0</div>
                <div>• Mobile App Redesign</div>
                <div>• API Gateway</div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="font-medium">Q2 2025</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Advanced Analytics</div>
                <div>• Client Portal v3</div>
                <div>• WhatsApp Integration</div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="font-medium">Q3 2025</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Blockchain Documents</div>
                <div>• AI Legal Assistant</div>
                <div>• Enterprise Suite</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
