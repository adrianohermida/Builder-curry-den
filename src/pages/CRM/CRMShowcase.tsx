import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Users,
  Scale,
  FileText,
  Target,
  Zap,
  Star,
  TrendingUp,
  Eye,
  Edit,
  Link,
  MessageSquare,
  Trash2,
  Grid3X3,
  List,
  Calendar,
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Keyboard,
  MousePointer,
  Layers,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const CRMShowcase: React.FC = () => {
  const navigate = useNavigate();
  const [highlightFeature, setHighlightFeature] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [collapsedWidgets, setCollapsedWidgets] = useState<string[]>([]);

  // Demo data
  const clients = [
    {
      id: "1",
      name: "Tech Corp LTDA",
      status: "vip",
      engagement: 95,
      lastContact: "Hoje",
      value: 450000,
      cases: 8,
      avatar: "/api/placeholder/40/40",
    },
    {
      id: "2",
      name: "João Silva",
      status: "active",
      engagement: 78,
      lastContact: "2 dias",
      value: 85000,
      cases: 3,
      avatar: "/api/placeholder/40/40",
    },
    {
      id: "3",
      name: "Startup Legal",
      status: "prospect",
      engagement: 65,
      lastContact: "1 semana",
      value: 120000,
      cases: 1,
      avatar: "/api/placeholder/40/40",
    },
  ];

  const processes = [
    {
      id: "p1",
      title: "Ação Trabalhista #2024-001",
      client: "João Silva",
      status: "urgent",
      progress: 75,
      dueDate: "Amanhã",
    },
    {
      id: "p2",
      title: "Revisão Contratual #2024-002",
      client: "Tech Corp LTDA",
      status: "progress",
      progress: 45,
      dueDate: "5 dias",
    },
  ];

  // Features showcase
  const features = [
    {
      id: "global-search",
      title: "Busca Global",
      description: "Busque qualquer coisa instantaneamente",
      shortcut: "⌘K",
      element: "global-search-input",
    },
    {
      id: "quick-actions",
      title: "Quick Actions",
      description: "Crie registros rapidamente",
      shortcut: "⌘C, ⌘P, ⌘T",
      element: "quick-actions",
    },
    {
      id: "contextual-menu",
      title: "Menu Contextual",
      description: "Ações em cada item",
      shortcut: "⋯",
      element: "contextual-menu",
    },
    {
      id: "collapsible",
      title: "Widgets Colapsáveis",
      description: "Organize sua visualização",
      shortcut: "Clique nos títulos",
      element: "collapsible-widget",
    },
  ];

  // Toggle widget collapse
  const toggleWidget = (widgetId: string) => {
    setCollapsedWidgets((prev) =>
      prev.includes(widgetId)
        ? prev.filter((id) => id !== widgetId)
        : [...prev, widgetId],
    );
  };

  // Feature highlight
  const highlightFeatureDemo = (featureId: string) => {
    setHighlightFeature(featureId);
    setDemoMode(true);

    // Auto-remove highlight after 3 seconds
    setTimeout(() => {
      setHighlightFeature(null);
      setDemoMode(false);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vip":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "prospect":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Feature Demo Banner */}
      <AnimatePresence>
        {demoMode && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-14 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 shadow-lg"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 animate-pulse" />
                <div>
                  <h3 className="font-semibold">
                    Demonstrando:{" "}
                    {features.find((f) => f.id === highlightFeature)?.title}
                  </h3>
                  <p className="text-sm opacity-90">
                    {
                      features.find((f) => f.id === highlightFeature)
                        ?.description
                    }
                  </p>
                </div>
              </div>
              <Badge className="bg-white/20 text-white">
                {features.find((f) => f.id === highlightFeature)?.shortcut}
              </Badge>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Global Search */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                CRM Minimalista
                <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  V3-MINIMALIA
                </Badge>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Layout SaaS 2025 com inteligência contextual
              </p>
            </div>

            {/* Feature Demo Buttons */}
            <div className="flex items-center gap-2">
              {features.map((feature) => (
                <Button
                  key={feature.id}
                  variant="outline"
                  size="sm"
                  onClick={() => highlightFeatureDemo(feature.id)}
                  className={cn(
                    "transition-all",
                    highlightFeature === feature.id &&
                      "ring-2 ring-indigo-500 bg-indigo-50",
                  )}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Demo {feature.title}
                </Button>
              ))}
            </div>
          </div>

          {/* Global Search - Feature 1 */}
          <div
            className={cn(
              "relative max-w-2xl transition-all duration-300",
              highlightFeature === "global-search" &&
                "ring-4 ring-indigo-300 rounded-lg",
            )}
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="global-search-input"
              placeholder="🔍 Buscar clientes, processos, tarefas... (⌘K para ativar)"
              className="pl-12 py-3 text-lg bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-indigo-500"
            />
            {highlightFeature === "global-search" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-4"
              >
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Keyboard className="w-4 h-4" />
                  <span>
                    Pressione{" "}
                    <kbd className="px-2 py-1 bg-gray-200 rounded">⌘K</kbd> para
                    busca instantânea
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Bar - Feature 2 */}
      <div
        className={cn(
          "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-3 transition-all duration-300",
          highlightFeature === "quick-actions" &&
            "bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-300",
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ações Rápidas:
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Cliente <kbd className="ml-2 text-xs opacity-70">⌘C</kbd>
              </Button>
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Scale className="w-4 h-4 mr-2" />
                Processo <kbd className="ml-2 text-xs opacity-70">⌘P</kbd>
              </Button>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Target className="w-4 h-4 mr-2" />
                Tarefa <kbd className="ml-2 text-xs opacity-70">⌘T</kbd>
              </Button>
              <Button
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Contrato <kbd className="ml-2 text-xs opacity-70">⌘O</kbd>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* AI Insights Button */}
            <Button variant="ghost" size="sm" className="relative">
              <Zap className="w-4 h-4 mr-2" />
              Insights IA
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </Button>

            {/* Filters */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>👥 Todos os clientes</DropdownMenuItem>
                <DropdownMenuItem>⭐ Apenas VIP</DropdownMenuItem>
                <DropdownMenuItem>✅ Ativos</DropdownMenuItem>
                <DropdownMenuItem>🎯 Prospectos</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {highlightFeature === "quick-actions" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg border"
          >
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MousePointer className="w-4 h-4" />
              <span>
                Use os atalhos de teclado para criar registros instantaneamente
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Collapsible Widget - Feature 4 */}
          <Card
            className={cn(
              "lg:col-span-2 transition-all duration-300",
              highlightFeature === "collapsible" &&
                "ring-4 ring-indigo-300 shadow-lg",
            )}
          >
            <CardHeader
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => toggleWidget("clients")}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  Pipeline de Clientes
                  <Badge variant="outline">Interativo</Badge>
                </div>
                <motion.div
                  animate={{
                    rotate: collapsedWidgets.includes("clients") ? 180 : 0,
                  }}
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </CardTitle>
            </CardHeader>

            <AnimatePresence>
              {!collapsedWidgets.includes("clients") && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="space-y-4">
                    {clients.map((client, index) => (
                      <motion.div
                        key={client.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          "flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer",
                          highlightFeature === "contextual-menu" &&
                            index === 0 &&
                            "ring-2 ring-indigo-300 bg-indigo-50",
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {client.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{client.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Badge
                                className={getStatusColor(client.status)}
                                variant="outline"
                              >
                                {client.status.toUpperCase()}
                              </Badge>
                              <span>•</span>
                              <span>{client.lastContact}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-medium">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                                notation: "compact",
                              }).format(client.value)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {client.engagement}% engajamento
                            </div>
                          </div>

                          {/* Contextual Menu - Feature 3 */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "w-8 h-8 p-0 transition-all",
                                  highlightFeature === "contextual-menu" &&
                                    index === 0 &&
                                    "ring-2 ring-indigo-500 bg-indigo-100",
                                )}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                Ver perfil completo
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar informações
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link className="w-4 h-4 mr-2" />
                                Vincular processo
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Iniciar discussão
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remover cliente
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    ))}

                    {highlightFeature === "contextual-menu" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border-l-4 border-indigo-500"
                      >
                        <div className="flex items-center gap-3 text-sm text-indigo-700">
                          <MoreHorizontal className="w-4 h-4" />
                          <span>
                            Clique nos 3 pontos para acessar ações contextuais
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>

            {highlightFeature === "collapsible" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-6 mb-6 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500"
              >
                <div className="flex items-center gap-3 text-sm text-green-700">
                  <Layers className="w-4 h-4" />
                  <span>Clique no título para colapsar/expandir seções</span>
                </div>
              </motion.div>
            )}
          </Card>

          {/* Processes & Insights */}
          <div className="space-y-6">
            {/* Recent Processes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Processos Urgentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {processes.map((process) => (
                  <div
                    key={process.id}
                    className="p-3 border rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{process.title}</h4>
                      <Badge className={getStatusColor(process.status)}>
                        {process.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{process.client}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progresso</span>
                        <span>{process.progress}%</span>
                      </div>
                      <Progress value={process.progress} className="h-2" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>Prazo: {process.dueDate}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Insights IA
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert>
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Cliente VIP sem contato:</strong> Tech Corp LTDA não
                    tem interações há 3 dias.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Star className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Oportunidade:</strong> 2 clientes podem
                    interessar-se por consultoria mensal.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <CheckCircle className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Duplicata detectada:</strong> João Silva e J. Santos
                    podem ser o mesmo cliente.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-8 h-8 text-indigo-600" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Explore o CRM Minimalista
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Experimente todas as funcionalidades do novo layout: busca
                global, quick actions, widgets colapsáveis, menu contextual e
                insights de IA. Tudo otimizado para aumentar sua produtividade.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => navigate("/crm/clientes")}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Gerenciar Clientes
                </Button>
                <Button
                  onClick={() => navigate("/crm/processos")}
                  variant="outline"
                  className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                >
                  <Scale className="w-4 h-4 mr-2" />
                  Ver Processos
                </Button>
                <Button
                  onClick={() => navigate("/diagnostico-conclusao")}
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Diagnóstico Completo
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CRMShowcase;
