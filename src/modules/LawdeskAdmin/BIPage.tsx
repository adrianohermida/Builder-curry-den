import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Brain,
  Zap,
  Globe,
  CreditCard,
  AlertTriangle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function BIPage() {
  const [timeRange, setTimeRange] = useState("30d");

  const kpis = [
    {
      title: "MRR (Receita Recorrente)",
      value: "R$ 2.847.392",
      change: "+12.3%",
      trend: "up",
      icon: DollarSign,
      description: "vs mês anterior",
    },
    {
      title: "Clientes Ativos",
      value: "1,247",
      change: "+8.7%",
      trend: "up",
      icon: Users,
      description: "total de clientes",
    },
    {
      title: "Taxa de Churn",
      value: "2.4%",
      change: "-0.8%",
      trend: "down",
      icon: AlertTriangle,
      description: "mensal",
    },
    {
      title: "Tarefas IA Geradas",
      value: "47.236",
      change: "+23.1%",
      trend: "up",
      icon: Brain,
      description: "este mês",
    },
  ];

  const moduleUsage = [
    { name: "CRM Jurídico", usage: 94, users: 1180, growth: 8.2 },
    { name: "GED", usage: 87, users: 950, growth: 12.1 },
    { name: "IA Jurídica", usage: 76, users: 820, growth: 34.5 },
    { name: "Publicações", usage: 83, users: 740, growth: 5.7 },
    { name: "Financeiro", usage: 72, users: 650, growth: 15.3 },
    { name: "Tarefas", usage: 89, users: 1050, growth: 9.8 },
  ];

  const stripeMetrics = [
    { metric: "Volume Transacionado", value: "R$ 3.2M", change: "+15.2%" },
    { metric: "Taxa de Aprovação", value: "96.8%", change: "+0.3%" },
    { metric: "Inadimplência", value: "1.8%", change: "-0.5%" },
    { metric: "Upgrades/Mês", value: "47", change: "+12%" },
  ];

  const conversionFunnel = [
    { stage: "Visitantes", value: 12450, conversion: 100 },
    { stage: "Leads", value: 3780, conversion: 30.4 },
    { stage: "Trials", value: 892, conversion: 23.6 },
    { stage: "Clientes", value: 267, conversion: 29.9 },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <kpi.icon className="w-8 h-8 text-blue-600" />
                  <Badge
                    variant={kpi.trend === "up" ? "default" : "destructive"}
                    className={
                      kpi.trend === "up"
                        ? "bg-green-100 text-green-800"
                        : kpi.trend === "down"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                    }
                  >
                    {kpi.change}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    {kpi.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {kpi.value}
                  </p>
                  <p className="text-sm text-gray-500">{kpi.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="modules">Módulos</TabsTrigger>
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
          <TabsTrigger value="conversion">Conversão</TabsTrigger>
          <TabsTrigger value="ia">Analytics IA</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 w-5 text-green-600" />
                  Crescimento de Receita
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700">
                      Gráfico de Receita
                    </p>
                    <p className="text-sm text-gray-500">
                      Crescimento de 127% nos últimos 12 meses
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 w-5 text-blue-600" />
                  Clientes por Região
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { region: "São Paulo", clients: 487, percentage: 39 },
                    { region: "Rio de Janeiro", clients: 312, percentage: 25 },
                    { region: "Minas Gerais", clients: 198, percentage: 16 },
                    { region: "Outros Estados", clients: 250, percentage: 20 },
                  ].map((region) => (
                    <div
                      key={region.region}
                      className="flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            {region.region}
                          </span>
                          <span className="text-sm text-gray-600">
                            {region.clients} clientes
                          </span>
                        </div>
                        <Progress value={region.percentage} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance por Módulo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {moduleUsage.map((module, index) => (
                  <motion.div
                    key={module.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{module.name}</h4>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-blue-100 text-blue-800">
                          {module.users} usuários
                        </Badge>
                        <Badge className="bg-green-100 text-green-800">
                          +{module.growth}%
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Taxa de Uso</span>
                        <span>{module.usage}%</span>
                      </div>
                      <Progress value={module.usage} className="h-2" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stripe Tab */}
        <TabsContent value="stripe" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  Métricas Stripe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stripeMetrics.map((metric) => (
                    <div
                      key={metric.metric}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{metric.metric}</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {metric.value}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {metric.change}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Planos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      plan: "Starter",
                      users: 543,
                      revenue: "R$ 271K",
                      color: "bg-blue-500",
                    },
                    {
                      plan: "Professional",
                      users: 432,
                      revenue: "R$ 864K",
                      color: "bg-purple-500",
                    },
                    {
                      plan: "Enterprise",
                      users: 272,
                      revenue: "R$ 1.7M",
                      color: "bg-green-500",
                    },
                  ].map((plan) => (
                    <div key={plan.plan} className="flex items-center gap-4">
                      <div
                        className={`w-4 h-4 rounded-full ${plan.color}`}
                      ></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{plan.plan}</span>
                          <span className="text-sm text-gray-600">
                            {plan.users} usuários
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {plan.revenue} mensais
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conversion Tab */}
        <TabsContent value="conversion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Funil de Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnel.map((stage, index) => (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{stage.stage}</h4>
                          <p className="text-sm text-gray-600">
                            {stage.value.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {stage.conversion}%
                      </Badge>
                    </div>
                    {index < conversionFunnel.length - 1 && (
                      <div className="flex justify-center my-2">
                        <div className="w-px h-4 bg-gray-300"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Analytics Tab */}
        <TabsContent value="ia" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Tarefas Geradas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    47.236
                  </div>
                  <div className="text-sm text-gray-600">este mês</div>
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    +23.1%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Minutas IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    12.847
                  </div>
                  <div className="text-sm text-gray-600">
                    documentos gerados
                  </div>
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    +18.7%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Petições IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">8.492</div>
                  <div className="text-sm text-gray-600">petições criadas</div>
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    +31.2%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
