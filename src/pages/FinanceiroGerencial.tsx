/**
 * 💰 FINANCEIRO GERENCIAL - GESTÃO FINANCEIRA CORPORATIVA
 *
 * Sistema completo de gestão financeira:
 * - Dashboard executivo
 * - Fluxo de caixa
 * - Relatórios gerenciais
 * - Zero amarelo
 */

import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  PieChart,
  FileText,
  CreditCard,
  Banknote,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: Date;
  status: "pending" | "confirmed" | "cancelled";
  account: string;
}

interface KPI {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  color: string;
}

export default function FinanceiroGerencial() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedView, setSelectedView] = useState<
    "dashboard" | "cashflow" | "reports"
  >("dashboard");

  // Mock data
  const kpis: KPI[] = [
    {
      title: "Receita Total",
      value: "R$ 847.320",
      change: "+12.5%",
      changeType: "positive",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "green",
    },
    {
      title: "Despesas",
      value: "R$ 234.890",
      change: "-8.3%",
      changeType: "positive",
      icon: <TrendingDown className="w-5 h-5" />,
      color: "red",
    },
    {
      title: "Lucro Líquido",
      value: "R$ 612.430",
      change: "+18.7%",
      changeType: "positive",
      icon: <Target className="w-5 h-5" />,
      color: "blue",
    },
    {
      title: "Margem de Lucro",
      value: "72.3%",
      change: "+4.2%",
      changeType: "positive",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "purple",
    },
  ];

  const transactions: Transaction[] = [
    {
      id: "1",
      description: "Honorários Advocatícios - Caso Silva",
      amount: 45000,
      type: "income",
      category: "Honorários",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: "confirmed",
      account: "Conta Corrente Principal",
    },
    {
      id: "2",
      description: "Pagamento de Aluguel - Escritório",
      amount: -8500,
      type: "expense",
      category: "Operacional",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: "confirmed",
      account: "Conta Corrente Principal",
    },
    {
      id: "3",
      description: "Consultoria Jurídica - Empresa XYZ",
      amount: 25000,
      type: "income",
      category: "Consultoria",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: "pending",
      account: "Conta Poupança",
    },
    {
      id: "4",
      description: "Software Jurídico - Licença Anual",
      amount: -12000,
      type: "expense",
      category: "Tecnologia",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: "confirmed",
      account: "Conta Corrente Principal",
    },
  ];

  const categoryData = [
    { name: "Honorários", value: 450000, percentage: 65, color: "blue" },
    { name: "Consultoria", value: 180000, percentage: 26, color: "green" },
    { name: "Outros Serviços", value: 62000, percentage: 9, color: "purple" },
  ];

  const expenseCategories = [
    { name: "Operacional", value: 85000, percentage: 45, color: "red" },
    { name: "Pessoal", value: 65000, percentage: 35, color: "orange" },
    { name: "Tecnologia", value: 25000, percentage: 13, color: "blue" },
    { name: "Marketing", value: 13000, percentage: 7, color: "purple" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Math.abs(amount));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              Financeiro Gerencial
            </h1>
            <p className="text-gray-600 mt-1">
              Gestão financeira e relatórios executivos
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Esta Semana</option>
              <option value="month">Este Mês</option>
              <option value="quarter">Este Trimestre</option>
              <option value="year">Este Ano</option>
            </select>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setSelectedView("dashboard")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              selectedView === "dashboard"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            Dashboard
          </button>
          <button
            onClick={() => setSelectedView("cashflow")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              selectedView === "cashflow"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            Fluxo de Caixa
          </button>
          <button
            onClick={() => setSelectedView("reports")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              selectedView === "reports"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            Relatórios
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {selectedView === "dashboard" && (
            <div className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          kpi.color === "green" &&
                            "bg-green-100 text-green-600",
                          kpi.color === "red" && "bg-red-100 text-red-600",
                          kpi.color === "blue" && "bg-blue-100 text-blue-600",
                          kpi.color === "purple" &&
                            "bg-purple-100 text-purple-600",
                        )}
                      >
                        {kpi.icon}
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {kpi.value}
                        </p>
                        <p className="text-sm text-gray-600">{kpi.title}</p>
                        <div className="flex items-center gap-1">
                          {kpi.changeType === "positive" ? (
                            <ArrowUpRight className="w-3 h-3 text-green-600" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-red-600" />
                          )}
                          <p
                            className={cn(
                              "text-xs font-medium",
                              kpi.changeType === "positive"
                                ? "text-green-600"
                                : "text-red-600",
                            )}
                          >
                            {kpi.change}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue by Category */}
                <Card className="p-6">
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-blue-600" />
                      Receitas por Categoria
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-3">
                      {categoryData.map((category, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-4 h-4 rounded-full",
                              category.color === "blue" && "bg-blue-500",
                              category.color === "green" && "bg-green-500",
                              category.color === "purple" && "bg-purple-500",
                            )}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900">
                                {category.name}
                              </span>
                              <span className="text-sm text-gray-600">
                                {category.percentage}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className={cn(
                                  "h-2 rounded-full",
                                  category.color === "blue" && "bg-blue-500",
                                  category.color === "green" && "bg-green-500",
                                  category.color === "purple" &&
                                    "bg-purple-500",
                                )}
                                style={{
                                  width: `${category.percentage}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatCurrency(category.value)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Expenses by Category */}
                <Card className="p-6">
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-red-600" />
                      Despesas por Categoria
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-3">
                      {expenseCategories.map((category, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-4 h-4 rounded-full",
                              category.color === "red" && "bg-red-500",
                              category.color === "orange" && "bg-orange-500",
                              category.color === "blue" && "bg-blue-500",
                              category.color === "purple" && "bg-purple-500",
                            )}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900">
                                {category.name}
                              </span>
                              <span className="text-sm text-gray-600">
                                {category.percentage}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className={cn(
                                  "h-2 rounded-full",
                                  category.color === "red" && "bg-red-500",
                                  category.color === "orange" &&
                                    "bg-orange-500",
                                  category.color === "blue" && "bg-blue-500",
                                  category.color === "purple" &&
                                    "bg-purple-500",
                                )}
                                style={{
                                  width: `${category.percentage}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatCurrency(category.value)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Transactions */}
              <Card className="p-6">
                <CardHeader className="p-0 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      Transações Recentes
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      Ver Todas
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center",
                              transaction.type === "income"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600",
                            )}
                          >
                            {transaction.type === "income" ? (
                              <ArrowUpRight className="w-5 h-5" />
                            ) : (
                              <ArrowDownRight className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {transaction.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-gray-600">
                                {transaction.category} •{" "}
                                {formatDate(transaction.date)}
                              </p>
                              <Badge
                                className={getStatusColor(transaction.status)}
                              >
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(transaction.status)}
                                  {transaction.status === "confirmed"
                                    ? "Confirmado"
                                    : transaction.status === "pending"
                                      ? "Pendente"
                                      : "Cancelado"}
                                </div>
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={cn(
                              "font-bold text-lg",
                              transaction.type === "income"
                                ? "text-green-600"
                                : "text-red-600",
                            )}
                          >
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.account}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedView === "cashflow" && (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Fluxo de Caixa
              </h3>
              <p className="text-gray-600">Visualização em desenvolvimento</p>
            </div>
          )}

          {selectedView === "reports" && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Relatórios Gerenciais
              </h3>
              <p className="text-gray-600">Visualização em desenvolvimento</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
