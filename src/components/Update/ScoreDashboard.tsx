import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Shield,
  DollarSign,
  Eye,
  Target,
  AlertTriangle,
  CheckCircle,
  Calendar,
  BarChart3,
  Zap,
  Globe,
  Lock,
  Accessibility,
  Gauge,
  ArrowUp,
  ArrowDown,
  Minus,
  RefreshCw,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ModuleScore {
  id: string;
  name: string;
  prontidaoTecnica: number;
  prontidaoMonetizacao: number;
  conformidadeLGPD: number;
  overallScore: number;
  trend: "up" | "down" | "stable";
  lastUpdate: string;
  criticalIssues: number;
  recommendations: string[];
  category: "core" | "admin" | "ai" | "monetization";
}

interface ScoreMetrics {
  global: {
    avgTechnical: number;
    avgMonetization: number;
    avgCompliance: number;
    readyForLaunch: number;
  };
  trends: {
    technical: "up" | "down" | "stable";
    monetization: "up" | "down" | "stable";
    compliance: "up" | "down" | "stable";
  };
}

export function ScoreDashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);
  const [activeView, setActiveView] = useState("overview");

  // Mock data - In production, this would come from real log analysis and action plan services
  const [moduleScores, setModuleScores] = useState<ModuleScore[]>([
    {
      id: "ged",
      name: "GED - Gestão Eletrônica",
      prontidaoTecnica: 92,
      prontidaoMonetizacao: 78,
      conformidadeLGPD: 95,
      overallScore: 88,
      trend: "up",
      lastUpdate: "2025-01-15T10:30:00",
      criticalIssues: 1,
      recommendations: [
        "Implementar paywall para documentos premium",
        "Adicionar analytics de uso avançadas",
        "Melhorar cache de documentos grandes",
      ],
      category: "core",
    },
    {
      id: "crm",
      name: "CRM - Relacionamento",
      prontidaoTecnica: 85,
      prontidaoMonetizacao: 88,
      conformidadeLGPD: 92,
      overallScore: 88,
      trend: "up",
      lastUpdate: "2025-01-15T09:15:00",
      criticalIssues: 0,
      recommendations: [
        "Expandir recursos de automação",
        "Integrar IA para lead scoring",
        "Adicionar módulo de upselling",
      ],
      category: "core",
    },
    {
      id: "ia-juridica",
      name: "IA Jurídica",
      prontidaoTecnica: 88,
      prontidaoMonetizacao: 95,
      conformidadeLGPD: 89,
      overallScore: 91,
      trend: "up",
      lastUpdate: "2025-01-15T11:00:00",
      criticalIssues: 0,
      recommendations: [
        "Otimizar tempo de resposta da IA",
        "Implementar modelos especializados",
        "Adicionar auditoria de decisões",
      ],
      category: "ai",
    },
    {
      id: "atendimento",
      name: "Atendimento & Tickets",
      prontidaoTecnica: 82,
      prontidaoMonetizacao: 72,
      conformidadeLGPD: 88,
      overallScore: 81,
      trend: "stable",
      lastUpdate: "2025-01-15T08:45:00",
      criticalIssues: 2,
      recommendations: [
        "Melhorar sistema de priorização",
        "Adicionar chatbot com IA",
        "Implementar SLA automático",
      ],
      category: "core",
    },
    {
      id: "admin",
      name: "Painel Administrativo",
      prontidaoTecnica: 95,
      prontidaoMonetizacao: 65,
      conformidadeLGPD: 98,
      overallScore: 86,
      trend: "up",
      lastUpdate: "2025-01-15T12:00:00",
      criticalIssues: 0,
      recommendations: [
        "Adicionar marketplace interno",
        "Implementar billing automatizado",
        "Expandir analytics de receita",
      ],
      category: "admin",
    },
    {
      id: "monetization",
      name: "Monetização Inteligente",
      prontidaoTecnica: 78,
      prontidaoMonetizacao: 98,
      conformidadeLGPD: 85,
      overallScore: 87,
      trend: "up",
      lastUpdate: "2025-01-15T11:30:00",
      criticalIssues: 1,
      recommendations: [
        "Finalizar integração Stripe",
        "Adicionar mais modelos de pricing",
        "Implementar A/B testing para preços",
      ],
      category: "monetization",
    },
  ]);

  const [scoreMetrics, setScoreMetrics] = useState<ScoreMetrics>({
    global: {
      avgTechnical: 87,
      avgMonetization: 83,
      avgCompliance: 91,
      readyForLaunch: 75,
    },
    trends: {
      technical: "up",
      monetization: "up",
      compliance: "stable",
    },
  });

  const runAnalysis = async () => {
    setIsAnalyzing(true);

    // Simulate analysis process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Update scores with slight variations
    setModuleScores((prev) =>
      prev.map((module) => ({
        ...module,
        prontidaoTecnica: Math.min(
          100,
          module.prontidaoTecnica + Math.random() * 4 - 2,
        ),
        prontidaoMonetizacao: Math.min(
          100,
          module.prontidaoMonetizacao + Math.random() * 4 - 2,
        ),
        conformidadeLGPD: Math.min(
          100,
          module.conformidadeLGPD + Math.random() * 4 - 2,
        ),
        lastUpdate: new Date().toISOString(),
      })),
    );

    setLastAnalysis(new Date());
    setIsAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 80) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 70) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-blue-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "core":
        return <Target className="h-5 w-5" />;
      case "admin":
        return <Shield className="h-5 w-5" />;
      case "ai":
        return <Zap className="h-5 w-5" />;
      case "monetization":
        return <DollarSign className="h-5 w-5" />;
      default:
        return <BarChart3 className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Dashboard de Escalabilidade & Go-to-Market
          </h2>
          <p className="text-gray-600">
            Análise abrangente de prontidão dos módulos para lançamento e
            monetização
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastAnalysis && (
            <div className="text-sm text-gray-500">
              Última análise: {lastAnalysis.toLocaleString()}
            </div>
          )}
          <Button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <BarChart3 className="h-4 w-4 mr-2" />
                Executar Análise
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Prontidão Técnica Média
                </p>
                <p className="text-2xl font-bold text-blue-700">
                  {scoreMetrics.global.avgTechnical.toFixed(1)}%
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="h-8 w-8 text-blue-500" />
                {getTrendIcon(scoreMetrics.trends.technical)}
              </div>
            </div>
            <Progress
              value={scoreMetrics.global.avgTechnical}
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Prontidão Monetização
                </p>
                <p className="text-2xl font-bold text-green-700">
                  {scoreMetrics.global.avgMonetization.toFixed(1)}%
                </p>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-8 w-8 text-green-500" />
                {getTrendIcon(scoreMetrics.trends.monetization)}
              </div>
            </div>
            <Progress
              value={scoreMetrics.global.avgMonetization}
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">
                  Conformidade LGPD/UX
                </p>
                <p className="text-2xl font-bold text-purple-700">
                  {scoreMetrics.global.avgCompliance.toFixed(1)}%
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-purple-500" />
                {getTrendIcon(scoreMetrics.trends.compliance)}
              </div>
            </div>
            <Progress
              value={scoreMetrics.global.avgCompliance}
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">
                  Pronto para Lançamento
                </p>
                <p className="text-2xl font-bold text-orange-700">
                  {scoreMetrics.global.readyForLaunch}%
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-8 w-8 text-orange-500" />
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <Progress
              value={scoreMetrics.global.readyForLaunch}
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Module Analysis */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="detailed">Análise Detalhada</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {moduleScores.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`border-2 ${getScoreColor(module.overallScore)}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {getCategoryIcon(module.category)}
                        {module.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(module.trend)}
                        <Badge className={getScoreColor(module.overallScore)}>
                          {module.overallScore.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Technical Readiness */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium flex items-center gap-1">
                          <Gauge className="h-4 w-4" />
                          Prontidão Técnica
                        </span>
                        <span className="text-sm font-semibold">
                          {module.prontidaoTecnica.toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={module.prontidaoTecnica}
                        className="h-2"
                      />
                    </div>

                    {/* Monetization Readiness */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          Prontidão Monetização
                        </span>
                        <span className="text-sm font-semibold">
                          {module.prontidaoMonetizacao.toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={module.prontidaoMonetizacao}
                        className="h-2"
                      />
                    </div>

                    {/* LGPD Compliance */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium flex items-center gap-1">
                          <Shield className="h-4 w-4" />
                          Conformidade LGPD/UX
                        </span>
                        <span className="text-sm font-semibold">
                          {module.conformidadeLGPD.toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={module.conformidadeLGPD}
                        className="h-2"
                      />
                    </div>

                    {/* Critical Issues */}
                    {module.criticalIssues > 0 && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          {module.criticalIssues} problema(s) crítico(s)
                          detectado(s)
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Last Update */}
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Atualizado: {new Date(module.lastUpdate).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise Detalhada por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Core Modules */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Módulos Core
                  </h4>
                  {moduleScores
                    .filter((m) => m.category === "core")
                    .map((module) => (
                      <div key={module.id} className="p-2 border rounded-lg">
                        <div className="text-sm font-medium">{module.name}</div>
                        <div className="text-xs text-gray-600">
                          Score: {module.overallScore.toFixed(1)}%
                        </div>
                      </div>
                    ))}
                </div>

                {/* Admin Modules */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-purple-600 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Administração
                  </h4>
                  {moduleScores
                    .filter((m) => m.category === "admin")
                    .map((module) => (
                      <div key={module.id} className="p-2 border rounded-lg">
                        <div className="text-sm font-medium">{module.name}</div>
                        <div className="text-xs text-gray-600">
                          Score: {module.overallScore.toFixed(1)}%
                        </div>
                      </div>
                    ))}
                </div>

                {/* AI Modules */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-yellow-600 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Inteligência Artificial
                  </h4>
                  {moduleScores
                    .filter((m) => m.category === "ai")
                    .map((module) => (
                      <div key={module.id} className="p-2 border rounded-lg">
                        <div className="text-sm font-medium">{module.name}</div>
                        <div className="text-xs text-gray-600">
                          Score: {module.overallScore.toFixed(1)}%
                        </div>
                      </div>
                    ))}
                </div>

                {/* Monetization Modules */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Monetização
                  </h4>
                  {moduleScores
                    .filter((m) => m.category === "monetization")
                    .map((module) => (
                      <div key={module.id} className="p-2 border rounded-lg">
                        <div className="text-sm font-medium">{module.name}</div>
                        <div className="text-xs text-gray-600">
                          Score: {module.overallScore.toFixed(1)}%
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {moduleScores.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getCategoryIcon(module.category)}
                    {module.name}
                    <Badge className={getScoreColor(module.overallScore)}>
                      {module.overallScore.toFixed(1)}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700">
                      Recomendações para Melhoria:
                    </h4>
                    <ul className="space-y-2">
                      {module.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
