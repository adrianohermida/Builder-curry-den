import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  FileText,
  Activity,
  BarChart3,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PlanningItem {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "planned" | "analyzing" | "ready" | "executing";
  aiConfidence: number;
  estimatedImpact: number;
  category: "performance" | "features" | "security" | "maintenance";
  createdAt: string;
}

interface AutomatedPlanningDashboardProps {
  onPlanSelect?: (plan: PlanningItem) => void;
}

export const AutomatedPlanningDashboard: React.FC<
  AutomatedPlanningDashboardProps
> = ({ onPlanSelect }) => {
  const [planningItems, setPlanningItems] = useState<PlanningItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    // Simulate loading planning items
    const mockItems: PlanningItem[] = [
      {
        id: "1",
        title: "Otimização do Sistema de Busca",
        description: "Implementar indexação avançada e cache distribuído",
        priority: "high",
        status: "analyzing",
        aiConfidence: 92,
        estimatedImpact: 8.5,
        category: "performance",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Modernização da Interface de Tarefas",
        description: "Redesign com componentes reutilizáveis e UX melhorada",
        priority: "medium",
        status: "ready",
        aiConfidence: 87,
        estimatedImpact: 7.2,
        category: "features",
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        title: "Implementação de Autenticação 2FA",
        description: "Sistema de autenticação em duas etapas obrigatório",
        priority: "critical",
        status: "planned",
        aiConfidence: 95,
        estimatedImpact: 9.1,
        category: "security",
        createdAt: new Date().toISOString(),
      },
      {
        id: "4",
        title: "Limpeza do Banco de Dados",
        description: "Remoção de dados obsoletos e otimização de índices",
        priority: "low",
        status: "executing",
        aiConfidence: 78,
        estimatedImpact: 6.8,
        category: "maintenance",
        createdAt: new Date().toISOString(),
      },
    ];

    setPlanningItems(mockItems);
  }, []);

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "text-blue-600 bg-blue-100";
      case "analyzing":
        return "text-purple-600 bg-purple-100";
      case "ready":
        return "text-green-600 bg-green-100";
      case "executing":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "performance":
        return <TrendingUp className="h-4 w-4" />;
      case "features":
        return <Zap className="h-4 w-4" />;
      case "security":
        return <AlertTriangle className="h-4 w-4" />;
      case "maintenance":
        return <Activity className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredItems =
    selectedCategory === "all"
      ? planningItems
      : planningItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleStartAnalysis}
            disabled={isAnalyzing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isAnalyzing ? (
              <>
                <Brain className="h-4 w-4 mr-2 animate-pulse" />
                Analisando...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Iniciar Análise IA
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800">
            {filteredItems.length} itens
          </Badge>
          <Badge className="bg-green-100 text-green-800">IA Ativa</Badge>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Planejamentos Ativos</p>
                <p className="text-2xl font-bold">{planningItems.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confiança Média IA</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    planningItems.reduce(
                      (acc, item) => acc + item.aiConfidence,
                      0,
                    ) / planningItems.length,
                  )}
                  %
                </p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Impacto Estimado</p>
                <p className="text-2xl font-bold">
                  {(
                    planningItems.reduce(
                      (acc, item) => acc + item.estimatedImpact,
                      0,
                    ) / planningItems.length
                  ).toFixed(1)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tempo Médio</p>
                <p className="text-2xl font-bold">3.2h</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filters */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="maintenance">Manutenção</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onPlanSelect?.(item)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getCategoryIcon(item.category)}
                            <h3 className="font-semibold text-lg">
                              {item.title}
                            </h3>
                          </div>
                          <p className="text-gray-600 mb-3">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">
                              Confiança IA
                            </span>
                            <span className="text-sm font-medium">
                              {item.aiConfidence}%
                            </span>
                          </div>
                          <Progress value={item.aiConfidence} className="h-2" />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">
                              Impacto Estimado
                            </span>
                            <span className="text-sm font-medium">
                              {item.estimatedImpact}/10
                            </span>
                          </div>
                          <Progress
                            value={item.estimatedImpact * 10}
                            className="h-2"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* AI Recommendations */}
      {isAnalyzing && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600 animate-pulse" />
              Análise IA em Andamento...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <span className="text-sm">
                  Analisando dependências do sistema...
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <span className="text-sm">
                  Calculando impacto das mudanças...
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-sm">
                  Gerando recomendações otimizadas...
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
