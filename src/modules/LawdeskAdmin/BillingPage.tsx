import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Download,
  Plus,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";

const revenueMetrics = [
  {
    id: "mrr",
    title: "MRR Total",
    value: "R$ 2.847.320",
    change: "+12.3%",
    trend: "up",
    icon: DollarSign,
    gradient: "from-emerald-600 to-green-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950",
    description: "Receita Recorrente Mensal",
  },
  {
    id: "arr",
    title: "ARR Projetado",
    value: "R$ 34.16M",
    change: "+15.7%",
    trend: "up",
    icon: TrendingUp,
    gradient: "from-blue-600 to-cyan-600",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    description: "Receita Anual Recorrente",
  },
  {
    id: "churn",
    title: "Taxa de Churn",
    value: "2.4%",
    change: "-0.8%",
    trend: "down",
    icon: Users,
    gradient: "from-orange-600 to-red-600",
    bgColor: "bg-orange-50 dark:bg-orange-950",
    description: "Cancelamentos mensais",
  },
  {
    id: "ltv",
    title: "LTV Médio",
    value: "R$ 15.240",
    change: "+8.2%",
    trend: "up",
    icon: Target,
    gradient: "from-purple-600 to-indigo-600",
    bgColor: "bg-purple-50 dark:bg-purple-950",
    description: "Lifetime Value por cliente",
  },
];

const plansPerformance = [
  {
    plan: "Starter",
    revenue: "R$ 284.320",
    customers: 1247,
    growth: "+12%",
    color: "bg-blue-500",
    percentage: 25,
  },
  {
    plan: "Professional",
    revenue: "R$ 1.423.160",
    customers: 823,
    growth: "+18%",
    color: "bg-emerald-500",
    percentage: 50,
  },
  {
    plan: "Enterprise",
    revenue: "R$ 1.139.840",
    customers: 156,
    growth: "+22%",
    color: "bg-purple-500",
    percentage: 25,
  },
];

const recentTransactions = [
  {
    id: 1,
    customer: "Advocacia Santos & Silva",
    plan: "Enterprise",
    amount: "R$ 2.450",
    status: "paid",
    date: "2024-01-25",
    method: "cartao",
  },
  {
    id: 2,
    customer: "Escritório Oliveira",
    plan: "Professional",
    amount: "R$ 890",
    status: "paid",
    date: "2024-01-25",
    method: "pix",
  },
  {
    id: 3,
    customer: "Dr. João Pereira",
    plan: "Starter",
    amount: "R$ 229",
    status: "pending",
    date: "2024-01-24",
    method: "boleto",
  },
  {
    id: 4,
    customer: "Barbosa Advogados",
    plan: "Enterprise",
    amount: "R$ 2.450",
    status: "failed",
    date: "2024-01-24",
    method: "cartao",
  },
  {
    id: 5,
    customer: "Consultoria Legal Tech",
    plan: "Professional",
    amount: "R$ 890",
    status: "paid",
    date: "2024-01-23",
    method: "cartao",
  },
];

const monthlyData = [
  { month: "Set", revenue: 2234000, customers: 1156 },
  { month: "Out", revenue: 2456000, customers: 1203 },
  { month: "Nov", revenue: 2589000, customers: 1298 },
  { month: "Dez", revenue: 2723000, customers: 1367 },
  { month: "Jan", revenue: 2847320, customers: 1423 },
];

export default function BillingPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [searchTerm, setSearchTerm] = useState("");
  const { isDark } = useTheme();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Pago
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Falhou
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "cartao":
        return <CreditCard className="w-4 h-4" />;
      case "pix":
        return <Zap className="w-4 h-4" />;
      case "boleto":
        return <Calendar className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <Badge className="bg-gradient-to-r from-emerald-600 to-green-600 text-white border-0">
              Faturamento
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Centro Financeiro
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Receitas, cobrança e análise financeira do SaaS
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar transações..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.trend === "up";

          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {metric.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                        {metric.value}
                      </p>
                      <div className="flex items-center mt-3">
                        {isPositive ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span
                          className={cn(
                            "text-sm font-medium",
                            isPositive ? "text-green-600" : "text-red-600",
                          )}
                        >
                          {metric.change}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                          vs mês anterior
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {metric.description}
                      </p>
                    </div>
                    <div className={cn("p-3 rounded-lg", metric.bgColor)}>
                      <Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Gráficos e Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolução da Receita */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Evolução da Receita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div
                  key={data.month}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 w-8">
                      {data.month}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                            maximumFractionDigits: 0,
                          }).format(data.revenue)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {data.customers} clientes
                        </span>
                      </div>
                      <Progress
                        value={(data.revenue / 3000000) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance por Plano */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Performance por Plano
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plansPerformance.map((plan, index) => (
                <div key={plan.plan} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", plan.color)} />
                      <span className="font-medium">{plan.plan}</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {plan.growth}
                    </Badge>
                  </div>
                  <div className="ml-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {plan.revenue} • {plan.customers} clientes
                      </span>
                      <span className="font-medium">{plan.percentage}%</span>
                    </div>
                    <Progress value={plan.percentage} className="h-2 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transações Recentes */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Transações Recentes
            </CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nova Cobrança
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      {getPaymentMethodIcon(transaction.method)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {transaction.customer}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.plan} •{" "}
                        {new Intl.DateTimeFormat("pt-BR").format(
                          new Date(transaction.date),
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {transaction.amount}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {transaction.method}
                      </p>
                    </div>
                    {getStatusBadge(transaction.status)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-center">
            <Button variant="outline" className="w-full max-w-xs">
              Ver Todas as Transações
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md bg-gradient-to-r from-emerald-600 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100">Receita Hoje</p>
                <p className="text-2xl font-bold">R$ 14.230</p>
                <p className="text-sm text-emerald-200 mt-1">23 transações</p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Novos Clientes</p>
                <p className="text-2xl font-bold">47</p>
                <p className="text-sm text-blue-200 mt-1">este mês</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Taxa Conversão</p>
                <p className="text-2xl font-bold">23.4%</p>
                <p className="text-sm text-purple-200 mt-1">trial → pago</p>
              </div>
              <Target className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
