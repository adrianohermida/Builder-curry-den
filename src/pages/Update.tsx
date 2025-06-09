import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Package,
  Code,
  GitBranch,
  Play,
  Pause,
  Square,
  Settings,
  Calendar,
  Users,
  Shield,
  Zap,
  Database,
  Globe,
  Terminal,
  FileText,
  Activity,
  Target,
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

interface UpdateInfo {
  version: string;
  buildNumber: number;
  releaseDate: string;
  size: string;
  status: "available" | "downloading" | "installing" | "completed" | "failed";
  progress: number;
  features: string[];
  fixes: string[];
  breaking: string[];
}

interface DeploymentEnvironment {
  name: string;
  status: "running" | "deploying" | "stopped" | "error";
  version: string;
  lastDeploy: string;
  health: number;
  instances: number;
}

export default function Update() {
  const { isAdmin } = usePermissions();
  const { isDark } = useTheme();

  const [currentVersion] = useState("v2025.1.1");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);

  const [availableUpdate] = useState<UpdateInfo>({
    version: "v2025.1.2",
    buildNumber: 1234,
    releaseDate: "2024-01-25",
    size: "45.2 MB",
    status: "available",
    progress: 0,
    features: [
      "Nova interface de relatórios avançados",
      "Integração aprimorada com IA",
      "Performance otimizada em 35%",
      "Novo módulo de automação jurídica",
      "Dashboard executivo redesenhado",
    ],
    fixes: [
      "Correção de bug na sincronização de dados",
      "Melhoria na responsividade mobile",
      "Otimização de consultas do banco de dados",
      "Correção de problemas de cache",
      "Melhoria na segurança de autenticação",
    ],
    breaking: [
      "API v1 será descontinuada",
      "Migração obrigatória para novo formato de dados",
    ],
  });

  const [environments] = useState<DeploymentEnvironment[]>([
    {
      name: "Production",
      status: "running",
      version: "v2025.1.1",
      lastDeploy: "2024-01-20T14:30:00Z",
      health: 99.8,
      instances: 8,
    },
    {
      name: "Staging",
      status: "running",
      version: "v2025.1.2",
      lastDeploy: "2024-01-25T09:15:00Z",
      health: 100,
      instances: 2,
    },
    {
      name: "Development",
      status: "running",
      version: "v2025.1.3-beta",
      lastDeploy: "2024-01-25T16:45:00Z",
      health: 95.2,
      instances: 1,
    },
  ]);

  const handleUpdate = async () => {
    setIsDeploying(true);
    setDeployProgress(0);

    toast.success("Iniciando atualização do sistema...");

    // Simulate deployment progress
    const interval = setInterval(() => {
      setDeployProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDeploying(false);
          toast.success("Atualização concluída com sucesso!");
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 1000);
  };

  const getEnvironmentStatus = (status: string) => {
    switch (status) {
      case "running":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Rodando
          </Badge>
        );
      case "deploying":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            Deployando
          </Badge>
        );
      case "stopped":
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            <Square className="w-3 h-3 mr-1" />
            Parado
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Erro
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
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
            <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg">
              <Download className="w-5 h-5 text-white" />
            </div>
            <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0">
              Update Manager
            </Badge>
            <Badge variant="outline">Atual: {currentVersion}</Badge>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gerenciador de Atualizações
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Deploy, versionamento e controle de releases do sistema
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <GitBranch className="h-4 w-4 mr-2" />
            Ver Histórico
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
          <Button
            size="sm"
            onClick={handleUpdate}
            disabled={isDeploying}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            {isDeploying ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Atualizar Sistema
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Deployment Progress */}
      <AnimatePresence>
        {isDeploying && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <AlertTitle>Deployment em Andamento</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso da atualização</span>
                    <span>{deployProgress.toFixed(1)}%</span>
                  </div>
                  <Progress value={deployProgress} className="h-2" />
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Atualizando para {availableUpdate.version}... Por favor, não
                    feche esta página.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Available Update */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Atualização Disponível
            </CardTitle>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {availableUpdate.version}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Code className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{availableUpdate.version}</p>
                <p className="text-sm text-gray-500">Versão</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 dark:bg-green-950 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">
                  {new Date(availableUpdate.releaseDate).toLocaleDateString(
                    "pt-BR",
                  )}
                </p>
                <p className="text-sm text-gray-500">Lançamento</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <Database className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">{availableUpdate.size}</p>
                <p className="text-sm text-gray-500">Tamanho</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <Target className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium">
                  Build {availableUpdate.buildNumber}
                </p>
                <p className="text-sm text-gray-500">Build Number</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="features">Novidades</TabsTrigger>
              <TabsTrigger value="fixes">Correções</TabsTrigger>
              <TabsTrigger value="breaking">Breaking Changes</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="space-y-3">
              {availableUpdate.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg"
                >
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="fixes" className="space-y-3">
              {availableUpdate.fixes.map((fix, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg"
                >
                  <Zap className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{fix}</span>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="breaking" className="space-y-3">
              {availableUpdate.breaking.map((change, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950 rounded-lg"
                >
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{change}</span>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Environments */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Ambientes de Deploy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {environments.map((env, index) => (
              <motion.div
                key={env.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Terminal className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{env.name}</h3>
                      {getEnvironmentStatus(env.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Versão: {env.version}</span>
                      <span>•</span>
                      <span>Instâncias: {env.instances}</span>
                      <span>•</span>
                      <span>Health: {env.health}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Último deploy:{" "}
                    {new Date(env.lastDeploy).toLocaleDateString("pt-BR")}
                  </span>
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Sistema Atual</p>
                <p className="text-2xl font-bold">{currentVersion}</p>
                <p className="text-sm text-blue-200 mt-1">
                  Estável • 99.9% uptime
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Próximo Release</p>
                <p className="text-2xl font-bold">v2025.2.0</p>
                <p className="text-sm text-green-200 mt-1">15 de Fevereiro</p>
              </div>
              <Calendar className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Deploy Automático</p>
                <p className="text-2xl font-bold">Ativo</p>
                <p className="text-sm text-purple-200 mt-1">CI/CD Pipeline</p>
              </div>
              <Activity className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
