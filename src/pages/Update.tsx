import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Brain,
  Target,
  TrendingUp,
  BarChart3,
  Zap,
  CheckCircle,
  Clock,
  Activity,
  FileText,
  Wrench,
  PlayCircle,
  RefreshCw,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Import Update submodules
import { AutomatedPlanningDashboard } from "@/components/Update/AutomatedPlanningDashboard";
import { TechnicalActionManager } from "@/components/Update/TechnicalActionManager";
import { UpdateAnalytics } from "@/components/Update/UpdateAnalytics";
import { SystemUpdateMonitor } from "@/components/Update/SystemUpdateMonitor";

export default function Update() {
  const [activeTab, setActiveTab] = useState("planning");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartAutomatedAnalysis = async () => {
    setIsProcessing(true);
    // Simulate automated analysis
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🔄 Update - Sistema de Atualizações
          </h1>
          <p className="text-muted-foreground">
            Análise e Planejamento Automático + Gestão de Ações Técnicas
          </p>
        </motion.div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleStartAutomatedAnalysis}
            disabled={isProcessing}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4 mr-2" />
                Iniciar Análise
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Análises Automatizadas
                </p>
                <p className="text-2xl font-bold text-blue-700">24</p>
              </div>
              <Brain className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <Badge className="bg-blue-100 text-blue-800">
                +12% esta semana
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">
                  Ações Técnicas
                </p>
                <p className="text-2xl font-bold text-purple-700">156</p>
              </div>
              <Wrench className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <Badge className="bg-purple-100 text-purple-800">
                89% concluídas
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Planejamentos Ativos
                </p>
                <p className="text-2xl font-bold text-green-700">8</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800">Em execução</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">
                  Performance Score
                </p>
                <p className="text-2xl font-bold text-orange-700">94%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-2">
              <Badge className="bg-orange-100 text-orange-800">Excelente</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="planning" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Planejamento Automático
          </TabsTrigger>
          <TabsTrigger value="technical" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Ações Técnicas
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="monitor" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Monitor Sistema
          </TabsTrigger>
        </TabsList>

        {/* Automated Planning Tab */}
        <TabsContent value="planning" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  Análise e Planejamento Automático
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AutomatedPlanningDashboard />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Technical Actions Tab */}
        <TabsContent value="technical" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-purple-500" />
                  Gestão de Ações Técnicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TechnicalActionManager />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  Analytics de Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UpdateAnalytics />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* System Monitor Tab */}
        <TabsContent value="monitor" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-500" />
                  Monitor do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SystemUpdateMonitor />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* System Status Footer */}
      <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium">Sistema Operacional</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Última atualização: {new Date().toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">
                Update v2025.1
              </Badge>
              <Badge className="bg-green-100 text-green-800">
                Sistema Estável
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
