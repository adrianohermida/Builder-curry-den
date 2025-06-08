import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Clock,
  Star,
  BarChart3,
  Activity,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const LaunchMetrics: React.FC = () => {
  const metrics = {
    revenue: {
      projected: 2800000,
      actual: 1950000,
      growth: 127,
      monthlyRecurring: 245000,
    },
    users: {
      total: 15200,
      newThisMonth: 1850,
      churnRate: 2.3,
      satisfaction: 4.7,
    },
    performance: {
      launchSuccessRate: 87,
      timeToMarket: 3.2,
      featureAdoption: 68,
      supportTickets: 156,
    },
    financial: {
      costPerAcquisition: 125,
      lifetimeValue: 2800,
      roiRatio: 22.4,
      burnRate: 85000,
    },
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const recentLaunches = [
    { name: "LawBot AI v2.0", revenue: 450000, users: 2100, success: 92 },
    { name: "Mobile App", revenue: 280000, users: 3200, success: 88 },
    { name: "API Gateway", revenue: 520000, users: 850, success: 94 },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Receita Total
                </p>
                <p className="text-2xl font-bold text-green-700">
                  {formatCurrency(metrics.revenue.actual)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800">
                +{metrics.revenue.growth}% crescimento
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Usuários Ativos
                </p>
                <p className="text-2xl font-bold text-blue-700">
                  {metrics.users.total.toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <Badge className="bg-blue-100 text-blue-800">
                +{metrics.users.newThisMonth} este mês
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">
                  Taxa de Sucesso
                </p>
                <p className="text-2xl font-bold text-purple-700">
                  {metrics.performance.launchSuccessRate}%
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <Progress
                value={metrics.performance.launchSuccessRate}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">
                  Time to Market
                </p>
                <p className="text-2xl font-bold text-orange-700">
                  {metrics.performance.timeToMarket} meses
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-2">
              <Badge className="bg-orange-100 text-orange-800">
                -15% vs média
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              Métricas Financeiras
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(metrics.revenue.monthlyRecurring)}
                </div>
                <div className="text-sm text-green-700">MRR</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {metrics.financial.roiRatio}x
                </div>
                <div className="text-sm text-blue-700">ROI</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Meta vs Real</span>
                  <span className="text-sm font-medium">
                    {Math.round(
                      (metrics.revenue.actual / metrics.revenue.projected) *
                        100,
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    (metrics.revenue.actual / metrics.revenue.projected) * 100
                  }
                  className="h-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">CAC</span>
                  <div className="font-medium">
                    {formatCurrency(metrics.financial.costPerAcquisition)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">LTV</span>
                  <div className="font-medium">
                    {formatCurrency(metrics.financial.lifetimeValue)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Métricas de Usuário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {metrics.users.churnRate}%
                </div>
                <div className="text-sm text-blue-700">Churn Rate</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-lg font-bold text-yellow-600">
                  {metrics.users.satisfaction}/5
                </div>
                <div className="text-sm text-yellow-700">Satisfação</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Adoção de Features</span>
                  <span className="text-sm font-medium">
                    {metrics.performance.featureAdoption}%
                  </span>
                </div>
                <Progress
                  value={metrics.performance.featureAdoption}
                  className="h-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Novos Usuários</span>
                  <div className="font-medium">
                    +{metrics.users.newThisMonth}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Tickets Suporte</span>
                  <div className="font-medium">
                    {metrics.performance.supportTickets}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Launches Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            Performance dos Lançamentos Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentLaunches.map((launch, index) => (
              <motion.div
                key={launch.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 border rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{launch.name}</h4>
                  <Badge
                    className={
                      launch.success >= 90
                        ? "bg-green-100 text-green-800"
                        : launch.success >= 80
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {launch.success}% sucesso
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(launch.revenue)}
                    </div>
                    <div className="text-sm text-green-700">Receita</div>
                  </div>

                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      {launch.users.toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-700">Usuários</div>
                  </div>

                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                      {launch.success}%
                    </div>
                    <div className="text-sm text-purple-700">Taxa Sucesso</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Tendências Positivas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">Crescimento de Receita</div>
                  <div className="text-sm text-gray-600">
                    +127% vs ano anterior
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Star className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-medium">Satisfação do Cliente</div>
                  <div className="text-sm text-gray-600">4.7/5 estrelas</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Activity className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="font-medium">Eficiência de Lançamento</div>
                  <div className="text-sm text-gray-600">
                    Time to market reduzido em 15%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-500" />
              Áreas de Melhoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border border-orange-200 rounded-lg">
                <div className="font-medium text-orange-700">Churn Rate</div>
                <div className="text-sm text-gray-600">
                  Atual: 2.3% | Meta: &lt;2%
                </div>
                <Progress value={77} className="h-2 mt-2" />
              </div>

              <div className="p-3 border border-yellow-200 rounded-lg">
                <div className="font-medium text-yellow-700">
                  Adoção de Features
                </div>
                <div className="text-sm text-gray-600">
                  Atual: 68% | Meta: 80%
                </div>
                <Progress value={68} className="h-2 mt-2" />
              </div>

              <div className="p-3 border border-red-200 rounded-lg">
                <div className="font-medium text-red-700">Support Tickets</div>
                <div className="text-sm text-gray-600">
                  156 tickets | Meta: &lt;100
                </div>
                <Progress value={64} className="h-2 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
