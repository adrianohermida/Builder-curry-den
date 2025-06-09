import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Target,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Clock,
  Play,
  Pause,
  Square,
  Settings,
  BarChart3,
  Globe,
  Zap,
  Shield,
  Bell,
  Activity,
  Star,
  Award,
  Flag,
  Sparkles,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/providers/ThemeProvider";
import { usePermissions } from "@/hooks/usePermissions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Campaign {
  id: string;
  name: string;
  status: "draft" | "scheduled" | "active" | "completed" | "paused";
  progress: number;
  startDate: string;
  endDate: string;
  target: number;
  reached: number;
  budget: number;
  spent: number;
  conversion: number;
  type: "product" | "feature" | "event" | "promotion";
}

interface LaunchMetric {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ElementType;
  gradient: string;
  description: string;
}

export default function Launch() {
  const { isAdmin } = usePermissions();
  const { isDark } = useTheme();

  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchProgress, setLaunchProgress] = useState(0);

  const metrics: LaunchMetric[] = [
    {
      title: "Campanhas Ativas",
      value: "12",
      change: "+3 esta semana",
      trend: "up",
      icon: Rocket,
      gradient: "from-orange-600 to-red-600",
      description: "Lançamentos em execução",
    },
    {
      title: "Taxa de Conversão",
      value: "23.4%",
      change: "+2.1% vs anterior",
      trend: "up",
      icon: Target,
      gradient: "from-green-600 to-emerald-600",
      description: "Trial para assinatura paga",
    },
    {
      title: "ROI Médio",
      value: "340%",
      change: "+15% este mês",
      trend: "up",
      icon: TrendingUp,
      gradient: "from-blue-600 to-cyan-600",
      description: "Retorno sobre investimento",
    },
    {
      title: "Leads Gerados",
      value: "1,247",
      change: "+89 hoje",
      trend: "up",
      icon: Users,
      gradient: "from-purple-600 to-indigo-600",
      description: "Novos leads qualificados",
    },
  ];

  const campaigns: Campaign[] = [
    {
      id: "1",
      name: "Lançamento Lawdesk IA 2025",
      status: "active",
      progress: 67,
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      target: 5000,
      reached: 3350,
      budget: 50000,
      spent: 33500,
      conversion: 23.4,
      type: "feature",
    },
    {
      id: "2",
      name: "Campanha Plano Enterprise",
      status: "scheduled",
      progress: 0,
      startDate: "2024-02-01",
      endDate: "2024-03-01",
      target: 1000,
      reached: 0,
      budget: 75000,
      spent: 0,
      conversion: 0,
      type: "product",
    },
    {
      id: "3",
      name: "Webinar Automação Jurídica",
      status: "completed",
      progress: 100,
      startDate: "2024-01-01",
      endDate: "2024-01-20",
      target: 2000,
      reached: 2340,
      budget: 25000,
      spent: 23500,
      conversion: 31.2,
      type: "event",
    },
    {
      id: "4",
      name: "Promoção Black Friday",
      status: "draft",
      progress: 15,
      startDate: "2024-11-25",
      endDate: "2024-11-30",
      target: 10000,
      reached: 0,
      budget: 100000,
      spent: 0,
      conversion: 0,
      type: "promotion",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "launch",
      title: "Campanha IA iniciada",
      description: "Lançamento Lawdesk IA 2025 está ativa",
      time: "2h atrás",
      icon: Rocket,
      color: "text-orange-600",
    },
    {
      id: 2,
      type: "milestone",
      title: "Meta de conversão atingida",
      description: "Webinar ultrapassou 30% de conversão",
      time: "4h atrás",
      icon: Target,
      color: "text-green-600",
    },
    {
      id: 3,
      type: "alert",
      title: "Orçamento próximo do limite",
      description: "Campanha Enterprise em 85% do budget",
      time: "6h atrás",
      icon: AlertTriangle,
      color: "text-yellow-600",
    },
    {
      id: 4,
      type: "success",
      title: "Nova landing page publicada",
      description: "Página de conversão otimizada está ativa",
      time: "8h atrás",
      icon: CheckCircle,
      color: "text-green-600",
    },
  ];

  const handleLaunchCampaign = async (campaignId: string) => {
    setSelectedCampaign(campaignId);
    setIsLaunching(true);
    setLaunchProgress(0);

    toast.success("Iniciando campanha...");

    // Simulate launch progress
    const interval = setInterval(() => {
      setLaunchProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLaunching(false);
          toast.success("Campanha lançada com sucesso!");
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 800);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <Play className="w-3 h-3 mr-1" />
            Ativa
          </Badge>
        );
      case "scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            Agendada
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Concluída
          </Badge>
        );
      case "paused":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Pause className="w-3 h-3 mr-1" />
            Pausada
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            <Square className="w-3 h-3 mr-1" />
            Rascunho
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "product":
        return <Sparkles className="h-4 w-4" />;
      case "feature":
        return <Zap className="h-4 w-4" />;
      case "event":
        return <Calendar className="h-4 w-4" />;
      case "promotion":
        return <Star className="h-4 w-4" />;
      default:
        return <Flag className="h-4 w-4" />;
    }
  };

  if (!isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertTitle>Acesso Restrito</AlertTitle>
          <AlertDescription>
            Esta página requer permissões de administrador para visualização.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white border-0">
              Launch Control
            </Badge>
            <Badge variant="outline">12 campanhas ativas</Badge>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Centro de Lançamentos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerenciamento de campanhas, produtos e eventos de marketing
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            <Rocket className="h-4 w-4 mr-2" />
            Nova Campanha
          </Button>
        </div>
      </div>

      {/* Launch Progress */}
      <AnimatePresence>
        {isLaunching && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
              <Rocket className="h-4 w-4" />
              <AlertTitle>Lançamento em Andamento</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso do lan��amento</span>
                    <span>{launchProgress.toFixed(1)}%</span>
                  </div>
                  <Progress value={launchProgress} className="h-2" />
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    Ativando campanha e configurando métricas...
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;

          return (
            <motion.div
              key={metric.title}
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
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-600">
                          {metric.change}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {metric.description}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "p-3 rounded-lg bg-gradient-to-r",
                        metric.gradient,
                        "text-white",
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Campanhas */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Campanhas de Marketing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    {getTypeIcon(campaign.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{campaign.name}</h3>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Progresso: {campaign.progress}%
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {campaign.reached.toLocaleString()} /{" "}
                          {campaign.target.toLocaleString()} leads
                        </span>
                      </div>
                      <Progress value={campaign.progress} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {new Date(campaign.startDate).toLocaleDateString(
                            "pt-BR",
                          )}{" "}
                          -{" "}
                          {new Date(campaign.endDate).toLocaleDateString(
                            "pt-BR",
                          )}
                        </span>
                        <span>
                          Orçamento:{" "}
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                            maximumFractionDigits: 0,
                          }).format(campaign.budget)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {campaign.conversion > 0 && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {campaign.conversion}% conversão
                    </Badge>
                  )}
                  {campaign.status === "draft" ||
                  campaign.status === "scheduled" ? (
                    <Button
                      size="sm"
                      onClick={() => handleLaunchCampaign(campaign.id)}
                      disabled={isLaunching}
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                    >
                      <Rocket className="h-4 w-4 mr-1" />
                      Lançar
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Ver Dados
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Atividades Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <activity.icon className={cn("h-4 w-4", activity.color)} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Resumo de Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  340%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ROI Médio das Campanhas
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="text-lg font-bold text-green-600">67%</div>
                  <div className="text-xs text-green-600">Taxa de Sucesso</div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">4.8★</div>
                  <div className="text-xs text-blue-600">Satisfação</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Meta Mensal</span>
                  <span className="text-sm font-medium">87%</span>
                </div>
                <Progress value={87} className="h-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  13 de 15 campanhas atingiram as metas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
