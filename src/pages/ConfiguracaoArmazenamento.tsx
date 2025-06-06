import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

export default function ConfiguracaoArmazenamento() {
  const [activeTab, setActiveTab] = useState("configuracao");
  const [storageConfig, setStorageConfig] = useState(null);
  const [hasTestData, setHasTestData] = useState(false);

  // Load storage configuration on mount
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem("lawdesk-storage-config");
      if (savedConfig) {
        setStorageConfig(JSON.parse(savedConfig));
      }
    } catch (error) {
      console.error("Error loading storage config:", error);
    }
  }, []);

  const generateTestData = () => {
    // Simulate generating test data
    setHasTestData(true);
    toast.success("Dados de teste gerados com sucesso!");
  };

  const clearTestData = () => {
    setHasTestData(false);
    toast.info("Dados de teste removidos");
  };

  const navigateToTest = () => {
    window.open("/teste-configuracao-storage", "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/settings" className="flex items-center space-x-1">
                <Settings className="h-4 w-4" />
                <span>Configurações</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage className="flex items-center space-x-1">
            <HardDrive className="h-4 w-4" />
            <span>Armazenamento de Documentos</span>
          </BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <HardDrive className="h-8 w-8 text-[rgb(var(--theme-primary))]" />
            <span>Armazenamento de Documentos</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure e gerencie onde os documentos jurídicos são armazenados na
            plataforma
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={navigateToTest}
            className="flex items-center space-x-2"
          >
            <TestTube className="h-4 w-4" />
            <span>Ver Simulação</span>
            <ExternalLink className="h-3 w-3" />
          </Button>

          {!hasTestData ? (
            <Button
              onClick={generateTestData}
              className="bg-[rgb(var(--theme-primary))] hover:bg-[rgb(var(--theme-primary))]/90"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Simular Dados
            </Button>
          ) : (
            <Button variant="outline" onClick={clearTestData}>
              Limpar Dados de Teste
            </Button>
          )}
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link to="/crm" className="block">
          <Card className="rounded-2xl shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-[rgb(var(--theme-primary))]/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    CRM Jurídico
                  </p>
                  <p className="text-lg font-bold">Upload de Documentos</p>
                </div>
                <Upload className="h-8 w-8 text-[rgb(var(--theme-primary))]" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Configurar destino dos documentos de clientes
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/tickets" className="block">
          <Card className="rounded-2xl shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-[rgb(var(--theme-primary))]/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Atendimento
                  </p>
                  <p className="text-lg font-bold">Anexos de Tickets</p>
                </div>
                <Download className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Onde salvar anexos de atendimento
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/ai" className="block">
          <Card className="rounded-2xl shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-[rgb(var(--theme-primary))]/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    IA Jurídica
                  </p>
                  <p className="text-lg font-bold">Documentos Gerados</p>
                </div>
                <Shield className="h-8 w-8 text-purple-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Destino dos documentos criados por IA
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/agenda" className="block">
          <Card className="rounded-2xl shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-[rgb(var(--theme-primary))]/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Agenda Jurídica
                  </p>
                  <p className="text-lg font-bold">Arquivos de Eventos</p>
                </div>
                <Activity className="h-8 w-8 text-orange-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Anexos de audiências e compromissos
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Current Configuration Status */}
      {storageConfig && (
        <Card className="rounded-2xl shadow-md border-l-4 border-l-[rgb(var(--theme-primary))]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Configuração Atual
                </h3>
                <div className="flex items-center space-x-4">
                  <Badge
                    variant="default"
                    className="bg-[rgb(var(--theme-primary))]"
                  >
                    Provedor:{" "}
                    {storageConfig.provider === "lawdesk-cloud"
                      ? "Lawdesk Cloud"
                      : storageConfig.provider === "supabase-external"
                        ? "Supabase Externo"
                        : storageConfig.provider === "google-drive"
                          ? "Google Drive"
                          : storageConfig.provider === "ftp-sftp"
                            ? "Servidor Local"
                            : storageConfig.provider === "api-custom"
                              ? "API Customizada"
                              : "Desconhecido"}
                  </Badge>
                  <Badge
                    variant={
                      storageConfig.connectionStatus === "connected"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {storageConfig.connectionStatus === "connected"
                      ? "✓ Conectado"
                      : "✗ Desconectado"}
                  </Badge>
                  {storageConfig.encryption && (
                    <Badge
                      variant="outline"
                      className="border-green-500 text-green-600"
                    >
                      🔒 Criptografia Ativa
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                onClick={() => setActiveTab("configuracao")}
                variant="outline"
              >
                <Settings className="h-4 w-4 mr-2" />
                Alterar Configuração
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="configuracao"
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Configuração</span>
          </TabsTrigger>
          <TabsTrigger
            value="dashboard"
            className="flex items-center space-x-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Painel de Controle</span>
          </TabsTrigger>
          <TabsTrigger
            value="auditoria"
            className="flex items-center space-x-2"
          >
            <Activity className="h-4 w-4" />
            <span>Logs de Auditoria</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configuracao" className="space-y-6">
          <ConfigStorageProvider />
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          {!hasTestData ? (
            <Card className="rounded-2xl shadow-md">
              <CardContent className="p-12 text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">
                  Painel de Controle de Armazenamento
                </h3>
                <p className="text-muted-foreground mb-6">
                  Para visualizar estatísticas e métricas, gere dados de teste
                  ou comece a usar o sistema.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={generateTestData}
                    className="bg-[rgb(var(--theme-primary))] hover:bg-[rgb(var(--theme-primary))]/90"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Simular Dados de Teste
                  </Button>
                  <Button variant="outline" onClick={navigateToTest}>
                    <TestTube className="h-4 w-4 mr-2" />
                    Ver Página de Testes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <StorageDashboard />
          )}
        </TabsContent>

        <TabsContent value="auditoria" className="space-y-6">
          <StorageAuditLogs />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
