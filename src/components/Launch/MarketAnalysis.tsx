import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Globe,
  Target,
  BarChart3,
  PieChart,
  DollarSign,
  Star,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const MarketAnalysis: React.FC = () => {
  const marketData = {
    totalMarketSize: 15000000,
    targetMarketSize: 5000000,
    marketGrowthRate: 24,
    competitorCount: 12,
    marketShare: 8.5,
    segments: [
      { name: "Escritórios Pequenos", size: 40, growth: 18, potential: "high" },
      {
        name: "Escritórios Médios",
        size: 35,
        growth: 22,
        potential: "very-high",
      },
      {
        name: "Escritórios Grandes",
        size: 20,
        growth: 15,
        potential: "medium",
      },
      {
        name: "Departamentos Jurídicos",
        size: 5,
        growth: 35,
        potential: "very-high",
      },
    ],
    competitors: [
      {
        name: "LegalSoft Pro",
        marketShare: 25,
        strengths: ["Tradição", "Recursos"],
        weaknesses: ["UX", "Preço"],
      },
      {
        name: "JurisTech",
        marketShare: 18,
        strengths: ["Inovação", "Cloud"],
        weaknesses: ["Suporte", "Integração"],
      },
      {
        name: "AdvocaciaPlus",
        marketShare: 15,
        strengths: ["Preço", "Simplicidade"],
        weaknesses: ["Recursos", "Escalabilidade"],
      },
      { name: "Outros", marketShare: 33.5, strengths: [], weaknesses: [] },
    ],
    opportunities: [
      {
        title: "IA Jurídica",
        impact: 9,
        difficulty: 7,
        description: "Automatização de análises legais",
      },
      {
        title: "Mobile First",
        impact: 8,
        difficulty: 5,
        description: "Soluções otimizadas para mobile",
      },
      {
        title: "API Economy",
        impact: 7,
        difficulty: 6,
        description: "Integrações com terceiros",
      },
      {
        title: "Compliance Automático",
        impact: 9,
        difficulty: 8,
        description: "Adequação automática às normas",
      },
    ],
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case "very-high":
        return "bg-green-100 text-green-800";
      case "high":
        return "bg-blue-100 text-blue-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tamanho do Mercado
                </p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(marketData.totalMarketSize)}
                </p>
              </div>
              <Globe className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <Badge className="bg-blue-100 text-blue-800">
                +{marketData.marketGrowthRate}% a.a.
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Mercado Alvo
                </p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(marketData.targetMarketSize)}
                </p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Progress value={33} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Market Share
                </p>
                <p className="text-xl font-bold text-purple-600">
                  {marketData.marketShare}%
                </p>
              </div>
              <PieChart className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <Badge className="bg-purple-100 text-purple-800">
                4ª posição
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Concorrentes
                </p>
                <p className="text-xl font-bold text-orange-600">
                  {marketData.competitorCount}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-2">
              <Badge className="bg-orange-100 text-orange-800">
                Mercado competitivo
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Analysis Tabs */}
      <Tabs defaultValue="segments" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="segments">Segmentos</TabsTrigger>
          <TabsTrigger value="competitors">Concorrência</TabsTrigger>
          <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
          <TabsTrigger value="forecast">Previsões</TabsTrigger>
        </TabsList>

        {/* Market Segments */}
        <TabsContent value="segments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Segmentos de Mercado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketData.segments.map((segment, index) => (
                    <motion.div
                      key={segment.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{segment.name}</h4>
                        <Badge className={getPotentialColor(segment.potential)}>
                          {segment.potential}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Participação</span>
                          <span>{segment.size}%</span>
                        </div>
                        <Progress value={segment.size} className="h-2" />

                        <div className="flex justify-between text-sm">
                          <span>Crescimento</span>
                          <span className="text-green-600">
                            +{segment.growth}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Análise de Crescimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                    <p>Gráfico de crescimento por segmento</p>
                    <p className="text-sm">Projeção para os próximos 3 anos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Competitor Analysis */}
        <TabsContent value="competitors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-500" />
                Análise Competitiva
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketData.competitors.map((competitor, index) => (
                  <motion.div
                    key={competitor.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-lg">{competitor.name}</h4>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {competitor.marketShare}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Market Share
                        </div>
                      </div>
                    </div>

                    {competitor.strengths.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-green-700 mb-2">
                            Pontos Fortes
                          </h5>
                          <div className="space-y-1">
                            {competitor.strengths.map((strength, idx) => (
                              <Badge
                                key={idx}
                                className="bg-green-100 text-green-800 mr-1"
                              >
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-red-700 mb-2">
                            Pontos Fracos
                          </h5>
                          <div className="space-y-1">
                            {competitor.weaknesses.map((weakness, idx) => (
                              <Badge
                                key={idx}
                                className="bg-red-100 text-red-800 mr-1"
                              >
                                {weakness}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Opportunities */}
        <TabsContent value="opportunities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Oportunidades de Mercado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {marketData.opportunities.map((opportunity, index) => (
                  <motion.div
                    key={opportunity.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-medium mb-2">{opportunity.title}</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      {opportunity.description}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Impacto Potencial</span>
                          <span>{opportunity.impact}/10</span>
                        </div>
                        <Progress
                          value={opportunity.impact * 10}
                          className="h-2"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Dificuldade</span>
                          <span>{opportunity.difficulty}/10</span>
                        </div>
                        <Progress
                          value={opportunity.difficulty * 10}
                          className="h-2"
                        />
                      </div>

                      <div className="pt-2">
                        <Badge
                          className={
                            opportunity.impact > 7 && opportunity.difficulty < 7
                              ? "bg-green-100 text-green-800"
                              : opportunity.impact > 6
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {opportunity.impact > 7 && opportunity.difficulty < 7
                            ? "Alta Prioridade"
                            : opportunity.impact > 6
                              ? "Média Prioridade"
                              : "Baixa Prioridade"}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Forecast */}
        <TabsContent value="forecast" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Projeções de Crescimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      +127%
                    </div>
                    <div className="text-sm text-blue-700">
                      Crescimento esperado em 3 anos
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>2025</span>
                      <span className="font-medium">
                        {formatCurrency(6200000)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>2026</span>
                      <span className="font-medium">
                        {formatCurrency(7700000)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>2027</span>
                      <span className="font-medium">
                        {formatCurrency(9500000)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Potencial de Receita
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(2800000)}
                    </div>
                    <div className="text-sm text-green-700">
                      Receita projetada para 2025
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cenário Conservador</span>
                      <span>{formatCurrency(2100000)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cenário Realista</span>
                      <span className="font-medium">
                        {formatCurrency(2800000)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cenário Otimista</span>
                      <span>{formatCurrency(3600000)}</span>
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
