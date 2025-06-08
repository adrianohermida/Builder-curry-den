import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  Settings,
  CreditCard,
  Headphones,
  MessageSquare,
  Package,
  Lock,
  TrendingUp,
  Activity,
  Shield,
  Zap,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const modules = [
  {
    id: "bi",
    title: "Business Intelligence",
    description: "Analytics, métricas de uso e performance",
    icon: BarChart3,
    href: "/admin/bi",
    color: "from-blue-500 to-blue-600",
    stats: { value: "2.8M", label: "Receita MRR" },
  },
  {
    id: "equipe",
    title: "Gestão de Equipe",
    description: "Controle de acessos e permissões",
    icon: Users,
    href: "/admin/equipe",
    color: "from-green-500 to-green-600",
    stats: { value: "23", label: "Membros Ativos" },
  },
  {
    id: "desenvolvimento",
    title: "Desenvolvimento",
    description: "Blueprint Builder, builds e deploys",
    icon: Settings,
    href: "/admin/desenvolvimento",
    color: "from-purple-500 to-purple-600",
    stats: { value: "47", label: "Deploys Este Mês" },
  },
  {
    id: "faturamento",
    title: "Faturamento",
    description: "Receitas, Stripe e gestão financeira",
    icon: CreditCard,
    href: "/admin/faturamento",
    color: "from-orange-500 to-orange-600",
    stats: { value: "94%", label: "Taxa Cobrança" },
  },
  {
    id: "suporte",
    title: "Suporte B2B",
    description: "Tickets e atendimento aos clientes",
    icon: Headphones,
    href: "/admin/suporte",
    color: "from-cyan-500 to-cyan-600",
    stats: { value: "4.8", label: "Satisfação Média" },
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Campanhas e comunicação",
    icon: MessageSquare,
    href: "/admin/marketing",
    color: "from-pink-500 to-pink-600",
    stats: { value: "31%", label: "Open Rate" },
  },
  {
    id: "produtos",
    title: "Gestão de Produtos",
    description: "Planos SaaS e monetização",
    icon: Package,
    href: "/admin/produtos",
    color: "from-indigo-500 to-indigo-600",
    stats: { value: "8", label: "Planos Ativos" },
  },
  {
    id: "seguranca",
    title: "Segurança",
    description: "Auditoria e conformidade LGPD",
    icon: Lock,
    href: "/admin/seguranca",
    color: "from-red-500 to-red-600",
    stats: { value: "100%", label: "Compliance Score" },
  },
];

const quickStats = [
  {
    label: "Clientes Ativos",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: Users,
  },
  {
    label: "Receita Mensal",
    value: "R$ 2.8M",
    change: "+8.3%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    label: "Uptime Sistema",
    value: "99.9%",
    change: "Estável",
    trend: "stable",
    icon: Activity,
  },
  {
    label: "Tarefas IA/Mês",
    value: "47.2K",
    change: "+23%",
    trend: "up",
    icon: Zap,
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Painel Administrativo Lawdesk
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sistema completo de administração interna para gestão de negócio,
            equipe, produtos e operações da Lawdesk CRM.
          </p>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <Badge
                    variant={stat.trend === "up" ? "default" : "secondary"}
                    className={
                      stat.trend === "up"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Modules Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Módulos Administrativos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link to={module.href}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${module.color} flex items-center justify-center`}
                      >
                        <module.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {module.stats.value}
                        </div>
                        <div className="text-xs text-gray-500">
                          {module.stats.label}
                        </div>
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {module.description}
                    </p>

                    <div className="mt-4">
                      <Progress value={Math.random() * 100} className="h-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Status do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                Operacional
              </div>
              <div className="text-sm text-green-700">
                Todos os sistemas funcionando
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">127 dias</div>
              <div className="text-sm text-blue-700">Uptime contínuo</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">v2025.1</div>
              <div className="text-sm text-purple-700">Versão atual</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
