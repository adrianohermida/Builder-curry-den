import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  FileText,
  Clock,
  Target,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  ChevronRight,
  Activity,
  Award,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Mock data para demonstração
const MONTHLY_REVENUE = [
  { mes: "Jan", valor: 125000, meta: 120000 },
  { mes: "Fev", valor: 138000, meta: 125000 },
  { mes: "Mar", valor: 142000, meta: 130000 },
  { mes: "Abr", valor: 156000, meta: 135000 },
  { mes: "Mai", valor: 148000, meta: 140000 },
  { mes: "Jun", valor: 162000, meta: 145000 },
];

const CASES_BY_AREA = [
  { area: "Trabalhista", casos: 45, valor: 85000, cor: "#3B82F6" },
  { area: "Família", casos: 38, valor: 62000, cor: "#10B981" },
  { area: "Cível", casos: 32, valor: 58000, cor: "#F59E0B" },
  { area: "Criminal", casos: 28, valor: 48000, cor: "#EF4444" },
  { area: "Empresarial", casos: 22, valor: 72000, cor: "#8B5CF6" },
];

const PRODUCTIVITY_DATA = [
  { dia: "Seg", tarefas: 45, concluidas: 38 },
  { dia: "Ter", tarefas: 52, concluidas: 48 },
  { dia: "Qua", tarefas: 38, concluidas: 35 },
  { dia: "Qui", tarefas: 61, concluidas: 52 },
  { dia: "Sex", tarefas: 55, concluidas: 49 },
  { dia: "Sab", tarefas: 28, concluidas: 25 },
  { dia: "Dom", tarefas: 15, concluidas: 12 },
];

const CLIENT_SATISFACTION = [
  { categoria: "Muito Satisfeito", valor: 45, cor: "#10B981" },
  { categoria: "Satisfeito", valor: 32, cor: "#3B82F6" },
  { categoria: "Neutro", valor: 15, cor: "#F59E0B" },
  { categoria: "Insatisfeito", valor: 8, cor: "#EF4444" },
];

const TEAM_PERFORMANCE = [
  {
    advogado: "Ana Silva",
    casos: 28,
    concluidos: 24,
    receita: 85000,
    satisfacao: 4.8,
    status: "excelente",
  },
  {
    advogado: "Carlos Oliveira",
    casos: 25,
    concluidos: 20,
    receita: 72000,
    satisfacao: 4.6,
    status: "bom",
  },
  {
    advogado: "Maria Costa",
    casos: 22,
    concluidos: 19,
    receita: 68000,
    satisfacao: 4.7,
    status: "bom",
  },
  {
    advogado: "João Santos",
    casos: 18,
    concluidos: 14,
    receita: 52000,
    satisfacao: 4.2,
    status: "regular",
  },
];

const KPI_CARDS = [
  {
    title: "Receita Total",
    value: "R$ 962.000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Novos Clientes",
    value: "47",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Casos Ativos",
    value: "163",
    change: "-2.1%",
    trend: "down",
    icon: FileText,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    title: "Taxa de Sucesso",
    value: "94.2%",
    change: "+1.8%",
    trend: "up",
    icon: Target,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

export default function MetricsGerencial() {
  const [timeRange, setTimeRange] = useState("6m");
  const [selectedArea, setSelectedArea] = useState("");

  const totalCases = useMemo(() => {
    return CASES_BY_AREA.reduce((sum, area) => sum + area.casos, 0);
  }, []);

  const avgSatisfaction = useMemo(() => {
    const total = CLIENT_SATISFACTION.reduce(
      (sum, item) => sum + item.valor,
      0,
    );
    const weighted = CLIENT_SATISFACTION.reduce((sum, item, index) => {
      const weight = index === 0 ? 5 : index === 1 ? 4 : index === 2 ? 3 : 2;
      return sum + item.valor * weight;
    }, 0);
    return (weighted / (total * 5)) * 5;
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value.toLocaleString("pt-BR")}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Métricas Gerenciais
          </h1>
          <p className="text-gray-600 mt-1">
            Análise de performance e indicadores do escritório
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Último mês</SelectItem>
              <SelectItem value="3m">Últimos 3 meses</SelectItem>
              <SelectItem value="6m">Últimos 6 meses</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {kpi.value}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {kpi.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          kpi.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {kpi.change}
                      </span>
                      <span className="text-sm text-gray-500">
                        vs mês anterior
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                    <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Receita</TabsTrigger>
          <TabsTrigger value="cases">Casos</TabsTrigger>
          <TabsTrigger value="productivity">Produtividade</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfação</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Receita Mensal vs Meta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={MONTHLY_REVENUE}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis
                      tickFormatter={(value) =>
                        `R$ ${(value / 1000).toFixed(0)}k`
                      }
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="valor" fill="#3B82F6" name="Receita Real" />
                    <Bar dataKey="meta" fill="#E5E7EB" name="Meta" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Receita por Área Jurídica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={CASES_BY_AREA}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="valor"
                      nameKey="area"
                    >
                      {CASES_BY_AREA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.cor} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [
                        `R$ ${value.toLocaleString("pt-BR")}`,
                        "Receita",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {CASES_BY_AREA.map((area) => (
                    <div
                      key={area.area}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: area.cor }}
                        />
                        <span className="text-sm text-gray-600">
                          {area.area}
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        R$ {area.valor.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cases" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Distribuição de Casos por Área
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={CASES_BY_AREA} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="area" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="casos" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo por Área</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {CASES_BY_AREA.map((area) => (
                  <div key={area.area} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{area.area}</h4>
                      <Badge variant="secondary">{area.casos} casos</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Receita:</span>
                        <span className="font-medium text-green-600">
                          R$ {area.valor.toLocaleString("pt-BR")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">% do total:</span>
                        <span className="font-medium">
                          {((area.casos / totalCases) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="productivity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Produtividade Semanal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={PRODUCTIVITY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="tarefas"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                      name="Tarefas Criadas"
                    />
                    <Area
                      type="monotone"
                      dataKey="concluidas"
                      stackId="2"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.8}
                      name="Tarefas Concluídas"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Performance da Equipe
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {TEAM_PERFORMANCE.map((member) => (
                  <div key={member.advogado} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        {member.advogado}
                      </h4>
                      <Badge
                        variant={
                          member.status === "excelente"
                            ? "default"
                            : member.status === "bom"
                              ? "secondary"
                              : "outline"
                        }
                        className={
                          member.status === "excelente"
                            ? "bg-green-100 text-green-800"
                            : member.status === "bom"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {member.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Casos</p>
                        <p className="font-medium">{member.casos}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Concluídos</p>
                        <p className="font-medium text-green-600">
                          {member.concluidos}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Receita</p>
                        <p className="font-medium">
                          R$ {member.receita.toLocaleString("pt-BR")}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Satisfação</p>
                        <p className="font-medium">⭐ {member.satisfacao}/5</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Taxa de conclusão</span>
                        <span className="font-medium">
                          {((member.concluidos / member.casos) * 100).toFixed(
                            1,
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={(member.concluidos / member.casos) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="satisfaction" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Satisfação dos Clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {avgSatisfaction.toFixed(1)}/5.0
                  </div>
                  <p className="text-gray-600">Nota média de satisfação</p>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={CLIENT_SATISFACTION}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="valor"
                      nameKey="categoria"
                    >
                      {CLIENT_SATISFACTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.cor} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Satisfação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {CLIENT_SATISFACTION.map((item) => (
                  <div
                    key={item.categoria}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.cor }}
                      />
                      <span className="text-gray-900">{item.categoria}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{item.valor}%</span>
                    </div>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Insights</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      77% dos clientes estão satisfeitos ou muito satisfeitos
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      15% dos clientes estão neutros - oportunidade de melhoria
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                      8% insatisfeitos - requer atenção imediata
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
