import { useState, useEffect } from "react";
import {
  Cloud,
  Database,
  Upload,
  CheckCircle,
  AlertTriangle,
  Eye,
  Settings,
  Activity,
  BarChart3,
  TestTube,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ConfigStorageProvider,
  StorageProvider,
} from "@/components/Settings/ConfigStorageProvider";
import { StorageDashboard } from "@/components/Settings/StorageDashboard";
import { StorageAuditLogs } from "@/components/Settings/StorageAuditLogs";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface TestStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "running" | "completed" | "error";
  details?: string;
}

interface SimulatedFile {
  id: string;
  name: string;
  size: number;
  uploadProgress: number;
  syncStatus: "pending" | "syncing" | "synced" | "error";
}

export default function TesteConfiguracaoStorage() {
  const [testPhase, setTestPhase] = useState<
    "config" | "upload" | "preview" | "complete"
  >("config");
  const [selectedProvider, setSelectedProvider] =
    useState<StorageProvider>("lawdesk-cloud");
  const [testSteps, setTestSteps] = useState<TestStep[]>([]);
  const [simulatedFiles, setSimulatedFiles] = useState<SimulatedFile[]>([]);
  const [isRunningTest, setIsRunningTest] = useState(false);

  const initialTestSteps: TestStep[] = [
    {
      id: "config",
      title: "Configuração do Provedor",
      description: "Validar configurações do provedor selecionado",
      status: "pending",
    },
    {
      id: "connection",
      title: "Teste de Conexão",
      description: "Verificar conectividade com o serviço",
      status: "pending",
    },
    {
      id: "auth",
      title: "Autenticação",
      description: "Validar credenciais e permissões",
      status: "pending",
    },
    {
      id: "upload",
      title: "Upload de Teste",
      description: "Simular upload de arquivos",
      status: "pending",
    },
    {
      id: "sync",
      title: "Sincronização",
      description: "Verificar sincronização entre sistemas",
      status: "pending",
    },
  ];

  const mockFiles: SimulatedFile[] = [
    {
      id: "1",
      name: "RG_Cliente_Silva.pdf",
      size: 2.3 * 1024 * 1024,
      uploadProgress: 0,
      syncStatus: "pending",
    },
    {
      id: "2",
      name: "Contrato_Prestacao_Servicos.docx",
      size: 1.8 * 1024 * 1024,
      uploadProgress: 0,
      syncStatus: "pending",
    },
    {
      id: "3",
      name: "Procuracao_Joao_Santos.pdf",
      size: 0.9 * 1024 * 1024,
      uploadProgress: 0,
      syncStatus: "pending",
    },
  ];

  useEffect(() => {
    setTestSteps(initialTestSteps);
    setSimulatedFiles(mockFiles);
  }, []);

  const runAutomatedTest = async () => {
    setIsRunningTest(true);
    setTestPhase("upload");

    // Reset test steps
    setTestSteps((prev) =>
      prev.map((step) => ({ ...step, status: "pending" })),
    );

    // Run each test step
    for (let i = 0; i < testSteps.length; i++) {
      const step = testSteps[i];

      // Update step to running
      setTestSteps((prev) =>
        prev.map((s) => (s.id === step.id ? { ...s, status: "running" } : s)),
      );

      // Simulate test duration
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate random success/failure (mostly success for demo)
      const isSuccess = Math.random() > 0.15; // 85% success rate

      setTestSteps((prev) =>
        prev.map((s) =>
          s.id === step.id
            ? {
                ...s,
                status: isSuccess ? "completed" : "error",
                details: isSuccess
                  ? `${step.title} executado com sucesso`
                  : `Falha no ${step.title.toLowerCase()}: erro de conexão simulado`,
              }
            : s,
        ),
      );

      if (!isSuccess) {
        toast.error(`Falha no teste: ${step.title}`);
        setIsRunningTest(false);
        return;
      } else {
        toast.success(`${step.title} concluído`);
      }

      // If this is the upload step, simulate file uploads
      if (step.id === "upload") {
        await simulateFileUploads();
      }
    }

    setTestPhase("preview");
    setIsRunningTest(false);
    toast.success("Todos os testes concluídos com sucesso!");
  };

  const simulateFileUploads = async () => {
    // Simulate uploading each file
    for (let fileIndex = 0; fileIndex < simulatedFiles.length; fileIndex++) {
      const file = simulatedFiles[fileIndex];

      // Update file status to syncing
      setSimulatedFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, syncStatus: "syncing" } : f,
        ),
      );

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setSimulatedFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, uploadProgress: progress } : f,
          ),
        );
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Complete upload
      setSimulatedFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? { ...f, uploadProgress: 100, syncStatus: "synced" }
            : f,
        ),
      );

      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const getStepIcon = (status: TestStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "running":
        return (
          <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        );
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return (
          <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
        );
    }
  };

  const getSyncStatusBadge = (status: SimulatedFile["syncStatus"]) => {
    switch (status) {
      case "synced":
        return (
          <Badge variant="default" className="bg-green-500">
            Sincronizado
          </Badge>
        );
      case "syncing":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            Sincronizando
          </Badge>
        );
      case "error":
        return <Badge variant="destructive">Erro</Badge>;
      default:
        return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  const getProviderIcon = (provider: StorageProvider) => {
    switch (provider) {
      case "lawdesk-cloud":
        return <Cloud className="h-5 w-5 text-blue-500" />;
      case "supabase-external":
        return <Database className="h-5 w-5 text-green-500" />;
      default:
        return <Database className="h-5 w-5 text-gray-500" />;
    }
  };

  const getProviderName = (provider: StorageProvider) => {
    switch (provider) {
      case "lawdesk-cloud":
        return "Lawdesk Cloud";
      case "supabase-external":
        return "Supabase Externo";
      case "google-drive":
        return "Google Drive";
      case "ftp-sftp":
        return "Servidor Local";
      case "api-custom":
        return "API Customizada";
      default:
        return provider;
    }
  };

  return (
    <div className="space-y-6">
      {/* Test Header */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TestTube className="h-6 w-6 text-[rgb(var(--theme-primary))]" />
            <span>Teste Completo - Configuração de Armazenamento</span>
          </CardTitle>
          <div className="flex items-center space-x-4">
            <Badge variant="outline">Ambiente de Teste</Badge>
            <Badge variant={testPhase === "complete" ? "default" : "secondary"}>
              Fase:{" "}
              {testPhase === "config"
                ? "Configuração"
                : testPhase === "upload"
                  ? "Upload"
                  : testPhase === "preview"
                    ? "Prévia"
                    : "Completo"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-bold">Provedor Selecionado</div>
              <div className="flex items-center justify-center space-x-2 mt-2">
                {getProviderIcon(selectedProvider)}
                <span className="text-sm">
                  {getProviderName(selectedProvider)}
                </span>
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-bold">Arquivos de Teste</div>
              <div className="text-sm text-muted-foreground mt-2">
                {simulatedFiles.length} arquivos
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-bold">Status dos Testes</div>
              <div className="text-sm text-muted-foreground mt-2">
                {testSteps.filter((s) => s.status === "completed").length}/
                {testSteps.length} concluídos
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-bold">Progresso Geral</div>
              <Progress
                value={
                  (testSteps.filter((s) => s.status === "completed").length /
                    testSteps.length) *
                  100
                }
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={testPhase} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="config" onClick={() => setTestPhase("config")}>
            <Settings className="h-4 w-4 mr-2" />
            Configuração
          </TabsTrigger>
          <TabsTrigger value="upload" onClick={() => setTestPhase("upload")}>
            <Upload className="h-4 w-4 mr-2" />
            Upload de Teste
          </TabsTrigger>
          <TabsTrigger value="preview" onClick={() => setTestPhase("preview")}>
            <Eye className="h-4 w-4 mr-2" />
            Prévia de Arquivos
          </TabsTrigger>
          <TabsTrigger
            value="complete"
            onClick={() => setTestPhase("complete")}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard Completo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-6">
          <ConfigStorageProvider />

          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6 text-center">
              <Button
                onClick={runAutomatedTest}
                disabled={isRunningTest}
                size="lg"
                className="bg-[rgb(var(--theme-primary))] hover:bg-[rgb(var(--theme-primary))]/90"
              >
                {isRunningTest ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Executando Testes...
                  </>
                ) : (
                  <>
                    <TestTube className="h-4 w-4 mr-2" />
                    Iniciar Teste Automatizado
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Testa conexão, upload de arquivos e sincronização
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          {/* Test Steps Progress */}
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle>Progresso dos Testes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {testSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  {getStepIcon(step.status)}
                  <div className="flex-1">
                    <h4 className="font-medium">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                    {step.details && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {step.details}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={
                      step.status === "completed"
                        ? "default"
                        : step.status === "running"
                          ? "outline"
                          : step.status === "error"
                            ? "destructive"
                            : "secondary"
                    }
                  >
                    {step.status === "completed"
                      ? "Concluído"
                      : step.status === "running"
                        ? "Executando"
                        : step.status === "error"
                          ? "Erro"
                          : "Pendente"}
                  </Badge>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* File Upload Simulation */}
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle>Simulação de Upload de Arquivos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {simulatedFiles.map((file) => (
                <div key={file.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    {getSyncStatusBadge(file.syncStatus)}
                  </div>

                  {file.syncStatus === "syncing" && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progresso</span>
                        <span>{file.uploadProgress}%</span>
                      </div>
                      <Progress value={file.uploadProgress} />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle>Prévia dos Arquivos Sincronizados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {simulatedFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-red-600 font-bold text-xs">
                          PDF
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{file.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          <span>•</span>
                          <span>Enviado agora</span>
                          <span>•</span>
                          <span>
                            Origem: {getProviderName(selectedProvider)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {getSyncStatusBadge(file.syncStatus)}
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">
                Teste Concluído com Sucesso!
              </h3>
              <p className="text-muted-foreground mb-6">
                Todos os arquivos foram sincronizados corretamente com o
                provedor {getProviderName(selectedProvider)}
              </p>
              <Button
                onClick={() => setTestPhase("complete")}
                className="bg-[rgb(var(--theme-primary))] hover:bg-[rgb(var(--theme-primary))]/90"
              >
                Ver Dashboard Completo
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complete" className="space-y-6">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="config">Configuração</TabsTrigger>
              <TabsTrigger value="logs">Logs de Auditoria</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <StorageDashboard />
            </TabsContent>

            <TabsContent value="config">
              <ConfigStorageProvider />
            </TabsContent>

            <TabsContent value="logs">
              <StorageAuditLogs />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
