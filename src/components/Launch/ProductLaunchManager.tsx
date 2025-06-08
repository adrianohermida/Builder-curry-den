import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Calendar,
  Users,
  DollarSign,
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  Rocket,
  BarChart3,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductLaunch {
  id: string;
  name: string;
  description: string;
  category: "feature" | "module" | "service" | "integration";
  stage: "planning" | "development" | "testing" | "ready" | "launched";
  priority: "low" | "medium" | "high" | "critical";
  targetDate: string;
  progress: number;
  team: string[];
  estimatedRevenue: number;
  marketSize: number;
  confidence: number;
  risks: string[];
  milestones: { name: string; completed: boolean; date: string }[];
}

interface ProductLaunchManagerProps {
  onLaunchSelect?: (launch: ProductLaunch) => void;
  selectedLaunch: string | null;
}

export const ProductLaunchManager: React.FC<ProductLaunchManagerProps> = ({
  onLaunchSelect,
  selectedLaunch,
}) => {
  const [launches] = useState<ProductLaunch[]>([
    {
      id: "1",
      name: "LawBot AI Assistant v2.0",
      description:
        "Assistente virtual com IA avançada para consultas jurídicas automatizadas",
      category: "feature",
      stage: "development",
      priority: "high",
      targetDate: "2025-03-15",
      progress: 65,
      team: ["Ana Silva", "Carlos Santos", "Maria Costa"],
      estimatedRevenue: 850000,
      marketSize: 5000000,
      confidence: 87,
      risks: ["Complexidade técnica", "Treinamento de dados"],
      milestones: [
        { name: "Prototipo MVP", completed: true, date: "2025-01-10" },
        { name: "Testes Alpha", completed: true, date: "2025-02-01" },
        { name: "Testes Beta", completed: false, date: "2025-02-20" },
        { name: "Lançamento", completed: false, date: "2025-03-15" },
      ],
    },
    {
      id: "2",
      name: "Mobile App Redesign",
      description:
        "Nova interface mobile com UX otimizada e funcionalidades offline",
      category: "module",
      stage: "testing",
      priority: "medium",
      targetDate: "2025-02-28",
      progress: 85,
      team: ["Pedro Lima", "Julia Rodrigues"],
      estimatedRevenue: 450000,
      marketSize: 2000000,
      confidence: 92,
      risks: ["Compatibilidade de dispositivos"],
      milestones: [
        { name: "Design System", completed: true, date: "2024-12-15" },
        { name: "Desenvolvimento", completed: true, date: "2025-01-30" },
        { name: "Testes QA", completed: true, date: "2025-02-10" },
        { name: "App Store Review", completed: false, date: "2025-02-25" },
      ],
    },
    {
      id: "3",
      name: "API Gateway Enterprise",
      description:
        "Gateway de APIs com autenticação avançada e rate limiting para clientes enterprise",
      category: "service",
      stage: "ready",
      priority: "critical",
      targetDate: "2025-01-30",
      progress: 95,
      team: ["Roberto Silva", "Fernanda Costa", "João Santos"],
      estimatedRevenue: 1200000,
      marketSize: 8000000,
      confidence: 94,
      risks: ["Escalabilidade", "Segurança"],
      milestones: [
        { name: "Arquitetura", completed: true, date: "2024-11-20" },
        { name: "Desenvolvimento", completed: true, date: "2025-01-10" },
        { name: "Testes de Carga", completed: true, date: "2025-01-20" },
        { name: "Homologação", completed: true, date: "2025-01-25" },
      ],
    },
    {
      id: "4",
      name: "WhatsApp Business Integration",
      description:
        "Integração completa com WhatsApp Business API para atendimento automatizado",
      category: "integration",
      stage: "planning",
      priority: "medium",
      targetDate: "2025-04-10",
      progress: 25,
      team: ["Mariana Oliveira", "Diego Santos"],
      estimatedRevenue: 320000,
      marketSize: 1500000,
      confidence: 78,
      risks: ["API do WhatsApp", "Regulamentações"],
      milestones: [
        { name: "Análise de Requisitos", completed: true, date: "2025-01-05" },
        { name: "Prototipo", completed: false, date: "2025-02-15" },
        { name: "Desenvolvimento", completed: false, date: "2025-03-20" },
        { name: "Testes", completed: false, date: "2025-04-05" },
      ],
    },
  ]);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "planning":
        return "bg-gray-100 text-gray-800";
      case "development":
        return "bg-blue-100 text-blue-800";
      case "testing":
        return "bg-yellow-100 text-yellow-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "launched":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "feature":
        return <Star className="h-4 w-4" />;
      case "module":
        return <Package className="h-4 w-4" />;
      case "service":
        return <Rocket className="h-4 w-4" />;
      case "integration":
        return <Target className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalRevenue = launches.reduce(
    (sum, launch) => sum + launch.estimatedRevenue,
    0,
  );
  const averageConfidence =
    launches.reduce((sum, launch) => sum + launch.confidence, 0) /
    launches.length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total de Lançamentos
                </p>
                <p className="text-2xl font-bold">{launches.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Receita Estimada
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Confiança Média
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(averageConfidence)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Prontos para Lançar
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {launches.filter((l) => l.stage === "ready").length}
                </p>
              </div>
              <Rocket className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Launches List */}
      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-4">
          <ScrollArea className="h-[800px]">
            <div className="space-y-4">
              {launches.map((launch, index) => (
                <motion.div
                  key={launch.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    className={`cursor-pointer transition-all ${
                      selectedLaunch === launch.id
                        ? "ring-2 ring-blue-500 shadow-md"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => onLaunchSelect?.(launch)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getCategoryIcon(launch.category)}
                            <h3 className="font-semibold text-lg">
                              {launch.name}
                            </h3>
                          </div>
                          <p className="text-gray-600 mb-3">
                            {launch.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge className={getStageColor(launch.stage)}>
                              {launch.stage}
                            </Badge>
                            <Badge
                              className={getPriorityColor(launch.priority)}
                            >
                              {launch.priority}
                            </Badge>
                            <Badge variant="outline">{launch.category}</Badge>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            Receita Estimada
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            {formatCurrency(launch.estimatedRevenue)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Data Alvo
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            {new Date(launch.targetDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Equipe
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            {launch.team.length} membros
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <BarChart3 className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Confiança
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            {launch.confidence}%
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">
                              Progresso
                            </span>
                            <span className="text-sm font-medium">
                              {launch.progress}%
                            </span>
                          </div>
                          <Progress value={launch.progress} className="h-2" />
                        </div>
                      </div>

                      {/* Milestones */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Marcos Principais</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                          {launch.milestones.map((milestone, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              {milestone.completed ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Clock className="h-4 w-4 text-gray-400" />
                              )}
                              <span
                                className={`text-xs ${
                                  milestone.completed
                                    ? "text-green-600"
                                    : "text-gray-600"
                                }`}
                              >
                                {milestone.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Risks */}
                      {launch.risks.length > 0 && (
                        <div className="border-t pt-4 mt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            <h4 className="font-medium text-orange-700">
                              Riscos Identificados
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {launch.risks.map((risk, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-orange-600 border-orange-200"
                              >
                                {risk}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cronograma de Lançamentos 2025</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {launches
                  .sort(
                    (a, b) =>
                      new Date(a.targetDate).getTime() -
                      new Date(b.targetDate).getTime(),
                  )
                  .map((launch, index) => (
                    <div
                      key={launch.id}
                      className="flex items-center gap-4 p-3 border rounded-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div className="flex-1">
                        <div className="font-medium">{launch.name}</div>
                        <div className="text-sm text-gray-600">
                          {launch.description}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {new Date(launch.targetDate).toLocaleDateString()}
                        </div>
                        <Badge className={getStageColor(launch.stage)}>
                          {launch.stage}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Estágio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "planning",
                    "development",
                    "testing",
                    "ready",
                    "launched",
                  ].map((stage) => {
                    const count = launches.filter(
                      (l) => l.stage === stage,
                    ).length;
                    const percentage = (count / launches.length) * 100;
                    return (
                      <div key={stage} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="capitalize">{stage}</span>
                          <span>{count}</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Receita por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["feature", "module", "service", "integration"].map(
                    (category) => {
                      const revenue = launches
                        .filter((l) => l.category === category)
                        .reduce((sum, l) => sum + l.estimatedRevenue, 0);
                      const percentage = (revenue / totalRevenue) * 100;
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="capitalize">{category}</span>
                            <span>{formatCurrency(revenue)}</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    },
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
