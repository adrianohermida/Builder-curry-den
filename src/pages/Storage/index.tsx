import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  HardDrive,
  Settings,
  BarChart3,
  Activity,
  TestTube,
  ArrowLeft,
  ExternalLink,
  Upload,
  Download,
  Shield,
  FileText,
  Users,
  MessageSquare,
  Brain,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ConfigStorageProvider } from "@/components/Settings/ConfigStorageProvider";
import { StorageDashboard } from "@/components/Settings/StorageDashboard";
import { StorageAuditLogs } from "@/components/Settings/StorageAuditLogs";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function StorageManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("configuracao");
  const [storageConfig, setStorageConfig] = useState(null);
  const [hasTestData, setHasTestData] = useState(false);

  // Carregar configuração de armazenamento no mount
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem("lawdesk-storage-config");
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        setStorageConfig(config);
      }

      // Verificar se há dados de teste
      const testFiles = localStorage.getItem("lawdesk-storage-files");
      const testLogs = localStorage.getItem("lawdesk-audit-logs");
      setHasTestData(
        (testFiles && JSON.parse(testFiles).length > 0) ||
          (testLogs && JSON.parse(testLogs).length > 0),
      );
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    }
  }, []);

  // Sincronizar URL com tab ativo
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["configuracao", "dashboard", "auditoria"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleConfigChange = (config: any) => {
    setStorageConfig(config);
    toast.success("Configuração de armazenamento atualizada!");
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/painel">Painel</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/configuracoes">Configurações</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Armazenamento</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Gestão de Armazenamento</h1>
            <p className="text-muted-foreground">
              Configure provedores, monitore arquivos e visualize logs de
              auditoria
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {storageConfig && (
            <Badge variant="outline" className="flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              {storageConfig.isActive ? "Ativo" : "Inativo"}
            </Badge>
          )}
          <Button
            variant="outline"
            onClick={() => navigate("/teste-configuracao-storage")}
          >
            <TestTube className="h-4 w-4 mr-2" />
            Página de Teste
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg mr-4">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Configuração</h3>
                <p className="text-sm text-muted-foreground">
                  {storageConfig ? "Configurado" : "Pendente"}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg mr-4">
                <HardDrive className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Arquivos</h3>
                <p className="text-sm text-muted-foreground">
                  {hasTestData ? "Com dados" : "Sem dados"}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg mr-4">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Auditoria</h3>
                <p className="text-sm text-muted-foreground">
                  Logs em tempo real
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HardDrive className="h-5 w-5 mr-2" />
            Sistema de Armazenamento Jurídico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="configuracao" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Configuração
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Painel de Controle
              </TabsTrigger>
              <TabsTrigger value="auditoria" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Logs de Auditoria
              </TabsTrigger>
            </TabsList>

            <TabsContent value="configuracao" className="space-y-6">
              <ConfigStorageProvider onConfigChange={handleConfigChange} />
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-6">
              <StorageDashboard />
            </TabsContent>

            <TabsContent value="auditoria" className="space-y-6">
              <StorageAuditLogs />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
