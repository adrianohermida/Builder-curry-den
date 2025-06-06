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

export default function ConfiguracaoArmazenamento() {
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
        setStorageConfig(JSON.parse(savedConfig));
      }
    } catch (error) {
      console.error("Erro ao carregar configuração:", error);
    }
  }, []);

  // Gerenciar tab ativa via URL
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["configuracao", "dashboard", "logs"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  const toggleTestData = () => {
    if (hasTestData) {
      // Limpar dados de teste
      localStorage.removeItem("lawdesk-storage-files");
      localStorage.removeItem("lawdesk-audit-logs");
      setHasTestData(false);
      toast.success("🗑️ Dados de teste removidos");
    } else {
      // Simular dados de teste para todos os módulos
      simulateTestData();
      setHasTestData(true);
      toast.success("🧪 Dados de teste simulados para demonstração");
    }
  };

  const simulateTestData = () => {
    // Dados simulados para arquivos
    const testFiles = [
      {
        id: "file_001",
        name: "Contrato_Prestacao_Servicos_Silva.pdf",
        size: 2048576,
        type: "application/pdf",
        extension: "PDF",
        module: "CRM",
        entityId: "cliente_001",
        entityName: "João Silva & Associados",
        uploadedBy: "Advogado Silva",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        lastAccessed: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        downloadCount: 5,
        path: "/clientes/cliente_001/documentos/Contrato_Prestacao_Servicos_Silva.pdf",
        isPublic: false,
      },
      {
        id: "file_002",
        name: "Inicial_Acao_Indenizacao.docx",
        size: 512000,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        extension: "DOCX",
        module: "PROCESSOS",
        entityId: "proc_001",
        entityName: "Processo 0001234-56.2024.8.26.0001",
        uploadedBy: "Advogado Silva",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        downloadCount: 8,
        path: "/processos/0001234-56.2024.8.26.0001/anexos/Inicial_Acao_Indenizacao.docx",
        isPublic: false,
      },
      {
        id: "file_003",
        name: "Ticket_Duvida_Cliente_Screenshot.png",
        size: 1024000,
        type: "image/png",
        extension: "PNG",
        module: "ATENDIMENTO",
        entityId: "ticket_001",
        entityName: "Ticket #001 - Dúvida sobre processo",
        uploadedBy: "Cliente Portal",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        downloadCount: 1,
        path: "/tickets/ticket_001/arquivos/Ticket_Duvida_Cliente_Screenshot.png",
        isPublic: false,
      },
      {
        id: "file_004",
        name: "Analise_IA_Jurisprudencia.json",
        size: 256000,
        type: "application/json",
        extension: "JSON",
        module: "IA",
        entityId: "analysis_001",
        entityName: "Análise de Jurisprudência - Danos Morais",
        uploadedBy: "Sistema IA",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
        downloadCount: 12,
        path: "/ia-juridica/analysis_001/Analise_IA_Jurisprudencia.json",
        isPublic: false,
      },
    ];

    // Dados simulados para logs de auditoria
    const testLogs = [
      {
        id: "log_001",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        user: "Advogado Silva",
        userType: "ADVOGADO",
        ipAddress: "192.168.1.100",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        deviceType: "DESKTOP",
        action: "DOWNLOAD",
        module: "CRM",
        entityType: "DOCUMENTO_CLIENTE",
        entityId: "doc_12345",
        fileName: "Contrato_Silva.pdf",
        fileSize: 2048576,
        result: "SUCCESS",
        details: "Download de contrato pelo advogado responsável",
        riskLevel: "LOW",
        location: "São Paulo, SP",
      },
      {
        id: "log_002",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        user: "Cliente João",
        userType: "CLIENTE",
        ipAddress: "189.123.45.67",
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
        deviceType: "MOBILE",
        action: "VIEW",
        module: "CRM",
        entityType: "DOCUMENTO_CLIENTE",
        entityId: "doc_12346",
        fileName: "Procuracao.pdf",
        result: "SUCCESS",
        details: "Visualização de procuração via portal do cliente",
        riskLevel: "MEDIUM",
        location: "Rio de Janeiro, RJ",
      },
      {
        id: "log_003",
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        user: "Usuário Externo",
        userType: "CLIENTE",
        ipAddress: "203.45.67.89",
        userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
        deviceType: "DESKTOP",
        action: "DOWNLOAD",
        module: "CRM",
        entityType: "DOCUMENTO_CLIENTE",
        entityId: "doc_12347",
        fileName: "Documento_Confidencial.pdf",
        result: "FAILURE",
        details: "Tentativa de download não autorizado bloqueada",
        riskLevel: "CRITICAL",
        location: "Localização desconhecida",
      },
    ];

    localStorage.setItem("lawdesk-storage-files", JSON.stringify(testFiles));
    localStorage.setItem("lawdesk-audit-logs", JSON.stringify(testLogs));
  };

  // Verificar se há dados de teste ao carregar
  useEffect(() => {
    const filesData = localStorage.getItem("lawdesk-storage-files");
    const logsData = localStorage.getItem("lawdesk-audit-logs");
    setHasTestData(
      (filesData && JSON.parse(filesData).length > 0) ||
        (logsData && JSON.parse(logsData).length > 0),
    );
  }, []);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/settings">Configurações</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Armazenamento de Documentos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <HardDrive className="h-8 w-8 text-[rgb(var(--theme-primary))]" />
            <span>Armazenamento de Documentos</span>
          </h1>
          <p className="text-muted-foreground">
            Configure provedores, monitore uploads e visualize logs de auditoria
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate("/settings")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/teste-configuracao-storage")}
          >
            <TestTube className="h-4 w-4 mr-2" />
            Teste Completo
          </Button>
          <Button
            variant={hasTestData ? "destructive" : "default"}
            onClick={toggleTestData}
          >
            {hasTestData ? (
              <>
                <Activity className="h-4 w-4 mr-2" />
                Limpar Dados de Teste
              </>
            ) : (
              <>
                <Activity className="h-4 w-4 mr-2" />
                Simular Dados
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Cards de Acesso Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/crm")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">CRM Jurídico</h3>
              <p className="text-sm text-muted-foreground">
                Upload em clientes, processos e contratos
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/tickets")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Atendimento</h3>
              <p className="text-sm text-muted-foreground">
                Anexos em tickets e solicitações
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/agenda")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Agenda Jurídica</h3>
              <p className="text-sm text-muted-foreground">
                Documentos de audiências e prazos
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/ai")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Brain className="h-6 w-6 text-orange-600" />
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">IA Jurídica</h3>
              <p className="text-sm text-muted-foreground">
                Upload para análise e petições
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Status do Provedor Atual */}
      {storageConfig && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <HardDrive className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200">
                    Provedor Ativo: {storageConfig.provider || "Lawdesk Cloud"}
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Status:{" "}
                    {storageConfig.connectionStatus === "connected"
                      ? "✅ Conectado"
                      : "⚠️ Verificar conexão"}
                    {storageConfig.encryption &&
                      " • 🔒 Criptografia AES-256 ativa"}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="border-green-300 text-green-700"
              >
                Configurado
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs Principais */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
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
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Logs de Auditoria</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configuracao" className="space-y-6">
          <ConfigStorageProvider
            onConfigChange={(config) => setStorageConfig(config)}
          />
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <StorageDashboard />
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <StorageAuditLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
}
