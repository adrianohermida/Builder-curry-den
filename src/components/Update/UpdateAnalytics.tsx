import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Target,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const UpdateAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState("30d");

  const analytics = {
    performanceMetrics: {
      updateCompletionRate: 87,
      averageUpdateTime: 2.4,
      systemUptime: 99.8,
      errorRate: 0.2,
    },
    trends: {
      updatesThisMonth: 24,
      previousMonth: 18,
      efficiency: 15,
      timeReduction: 12,
    },
    categories: [
      { name: "Performance", count: 8, percentage: 33 },
      { name: "Security", count: 6, percentage: 25 },
      { name: "Features", count: 5, percentage: 21 },
      { name: "Bug Fixes", count: 3, percentage: 13 },
      { name: "Maintenance", count: 2, percentage: 8 },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Taxa de Conclusão
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {analytics.performanceMetrics.updateCompletionRate}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Progress
                value={analytics.performanceMetrics.updateCompletionRate}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                <p className="text-2xl font-bold text-blue-600">
                  {analytics.performanceMetrics.averageUpdateTime}h
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <Badge className="bg-blue-100 text-blue-800">
                -12% vs mês anterior
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Uptime Sistema
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {analytics.performanceMetrics.systemUptime}%
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800">Excelente</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Taxa de Erro
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {analytics.performanceMetrics.errorRate}%
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800">
                Dentro do limite
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Tendências de Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Updates Concluídos</p>
                  <p className="text-sm text-gray-600">Este mês vs anterior</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    {analytics.trends.updatesThisMonth}
                  </p>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      +{analytics.trends.efficiency}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">Eficiência Temporal</p>
                  <p className="text-sm text-gray-600">
                    Redução no tempo médio
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    -{analytics.trends.timeReduction}%
                  </p>
                  <div className="flex items-center text-blue-600">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    <span className="text-sm">Melhora</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              Distribuição por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-sm text-gray-600">
                      {category.count} ({category.percentage}%)
                    </span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="efficiency">Eficiência</TabsTrigger>
          <TabsTrigger value="quality">Qualidade</TabsTrigger>
          <TabsTrigger value="impact">Impacto</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tempo de Resposta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center text-gray-400">
                  <BarChart3 className="h-12 w-12 mb-2" />
                  <div className="text-center">
                    <p>Gráfico de tempo de resposta</p>
                    <p className="text-sm">Últimos 30 dias</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Throughput</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center text-gray-400">
                  <Activity className="h-12 w-12 mb-2" />
                  <div className="text-center">
                    <p>Updates processados por hora</p>
                    <p className="text-sm">Média: 4.2 updates/h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Métricas de Eficiência</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">92%</div>
                  <div className="text-sm text-gray-600">Automação Rate</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">2.1x</div>
                  <div className="text-sm text-gray-600">Speed Improvement</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">85%</div>
                  <div className="text-sm text-gray-600">
                    Resource Optimization
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Indicadores de Qualidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span>Taxa de Sucesso</span>
                  <div className="flex items-center gap-2">
                    <Progress value={95} className="w-24 h-2" />
                    <span className="text-sm font-medium">95%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span>Rollback Rate</span>
                  <div className="flex items-center gap-2">
                    <Progress value={5} className="w-24 h-2" />
                    <span className="text-sm font-medium">5%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span>Test Coverage</span>
                  <div className="flex items-center gap-2">
                    <Progress value={88} className="w-24 h-2" />
                    <span className="text-sm font-medium">88%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Impacto nos Negócios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">
                      Benefícios Realizados
                    </h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Redução de 15% no tempo de resposta</li>
                      <li>• Melhoria de 23% na satisfação do usuário</li>
                      <li>• Economia de R$ 45k em recursos</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">
                      Próximos Objetivos
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Alcançar 95% de automação</li>
                      <li>• Reduzir tempo médio para 2h</li>
                      <li>• Zero-downtime deployments</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
