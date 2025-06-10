import { useState, useEffect } from "react";
import {
  Cloud,
  Database,
  HardDrive,
  Link,
  CheckCircle,
  AlertTriangle,
  Shield,
  Key,
  Settings,
  TestTube,
  Save,
  Loader2,
  Info,
  ExternalLink,
  Lock,
  Unlock,
  Globe,
  Server,
  Folder,
  Upload,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  FileText,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Link as RouterLink, useNavigate } from "react-router-dom";

export type StorageProvider =
  | "lawdesk-cloud"
  | "supabase-external"
  | "google-drive"
  | "ftp-sftp"
  | "api-custom";

export interface StorageConfig {
  provider: StorageProvider;
  isActive: boolean;
  encryption: boolean;
  config: Record<string, any>;
  connectionStatus: "connected" | "error" | "pending" | "untested";
  lastTested?: Date;
  errorDetails?: {
    message: string;
    statusCode?: number;
    timestamp: Date;
  };
}

interface StorageProviderOption {
  id: StorageProvider;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  recommended?: boolean;
  features: string[];
  compliance: {
    lgpd: boolean;
    backup: boolean;
    encryption: boolean;
  };
}

const storageProviders: StorageProviderOption[] = [
  {
    id: "lawdesk-cloud",
    name: "Lawdesk Cloud",
    description:
      "Armazenamento padrão da plataforma com infraestrutura otimizada para escritórios de advocacia",
    icon: Cloud,
    color: "bg-blue-500",
    recommended: true,
    features: [
      "Backup automático diário",
      "Conformidade LGPD nativa",
      "Criptografia AES-256",
      "CDN global para acesso rápido",
      "Suporte técnico incluído",
    ],
    compliance: { lgpd: true, backup: true, encryption: true },
  },
  {
    id: "supabase-external",
    name: "Supabase Externo",
    description:
      "Banco de dados PostgreSQL com armazenamento de objetos integrado",
    icon: Database,
    color: "bg-green-500",
    features: [
      "PostgreSQL em tempo real",
      "API REST automática",
      "Autenticação integrada",
      "Destinos configuráveis",
      "Transformação de imagens",
    ],
    compliance: { lgpd: false, backup: true, encryption: true },
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description:
      "Integração com Google Workspace para sincronização empresarial",
    icon: HardDrive,
    color: "bg-yellow-500",
    features: [
      "Sincronização automática",
      "Controle de versões",
      "Compartilhamento granular",
      "Busca avançada",
      "Apps Script automação",
    ],
    compliance: { lgpd: false, backup: true, encryption: true },
  },
  {
    id: "ftp-sftp",
    name: "FTP/SFTP",
    description: "Servidor de arquivos próprio com protocolo seguro",
    icon: Server,
    color: "bg-purple-500",
    features: [
      "Controle total do servidor",
      "SFTP criptografado",
      "Estrutura personalizada",
      "Backup próprio",
      "Acesso direto via terminal",
    ],
    compliance: { lgpd: true, backup: false, encryption: true },
  },
  {
    id: "api-custom",
    name: "API Personalizada",
    description: "Integração com sistema proprietário via REST/GraphQL",
    icon: Link,
    color: "bg-red-500",
    features: [
      "Endpoints customizados",
      "Autenticação Bearer",
      "Webhooks bidirecionais",
      "Transformações personalizadas",
      "Log de auditoria completo",
    ],
    compliance: { lgpd: false, backup: false, encryption: false },
  },
];

interface ConfigStorageProviderProps {
  onConfigChange?: (config: StorageConfig) => void;
}

export function ConfigStorageProvider({
  onConfigChange,
}: ConfigStorageProviderProps) {
  const navigate = useNavigate();
  const [selectedProvider, setSelectedProvider] =
    useState<StorageProvider>("lawdesk-cloud");
  const [config, setConfig] = useState<StorageConfig>({
    provider: "lawdesk-cloud",
    isActive: false,
    encryption: true,
    config: {},
    connectionStatus: "untested",
  });

  const [providerConfigs, setProviderConfigs] = useState<Record<string, any>>({
    "lawdesk-cloud": {
      region: "sa-east-1",
      storageClass: "standard",
      autoBackup: true,
    },
    "supabase-external": {
      url: "",
      anonKey: "",
      serviceKey: "",
      bucket: "lawdesk-documents",
    },
    "google-drive": {
      clientId: "",
      clientSecret: "",
      rootFolder: "Lawdesk CRM",
      sharedDrive: false,
    },
    "ftp-sftp": {
      host: "",
      port: 22,
      username: "",
      password: "",
      useSFTP: true,
      basePath: "/lawdesk/",
    },
    "api-custom": {
      baseUrl: "",
      token: "",
      apiType: "rest",
      endpoints: {
        upload: "/upload",
        download: "/download/{id}",
        delete: "/delete/{id}",
      },
    },
  });

  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [testProgress, setTestProgress] = useState(0);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [uploadTest, setUploadTest] = useState(false);
  const [connectionFeedback, setConnectionFeedback] = useState<string>("");

  // Carregar configuração salva
  useEffect(() => {
    const savedConfig = localStorage.getItem("lawdesk-storage-config");
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(parsed);
        setSelectedProvider(parsed.provider);

        // Carregar configurações específicas do provedor
        const savedProviderConfigs = localStorage.getItem(
          "lawdesk-provider-configs",
        );
        if (savedProviderConfigs) {
          setProviderConfigs(JSON.parse(savedProviderConfigs));
        }
      } catch (error) {
        console.error("Erro ao carregar configuração:", error);
        toast.error("Erro ao carregar configuração salva");
      }
    }
  }, []);

  const handleProviderChange = (newProvider: StorageProvider) => {
    setSelectedProvider(newProvider);
    setConfig((prev) => ({
      ...prev,
      provider: newProvider,
      connectionStatus: "untested",
    }));
    setConnectionFeedback("");
  };

  const handleConfigChange = (key: string, value: any) => {
    setProviderConfigs((prev) => ({
      ...prev,
      [selectedProvider]: {
        ...prev[selectedProvider],
        [key]: value,
      },
    }));

    // Salvar automaticamente no localStorage para evitar perda de dados
    const updatedConfigs = {
      ...providerConfigs,
      [selectedProvider]: {
        ...providerConfigs[selectedProvider],
        [key]: value,
      },
    };
    localStorage.setItem(
      "lawdesk-provider-configs",
      JSON.stringify(updatedConfigs),
    );
  };

  const testConnection = async () => {
    setTesting(true);
    setTestProgress(0);
    setConnectionFeedback("");

    try {
      const provider = storageProviders.find((p) => p.id === selectedProvider);
      const currentConfig = providerConfigs[selectedProvider];

      // Simular teste de conexão com progresso em tempo real
      const steps = [
        {
          name: "Validando configuração",
          delay: 500,
          feedback: "Verificando parâmetros de conexão...",
        },
        {
          name: "Conectando ao provedor",
          delay: 1000,
          feedback: `Estabelecendo conexão com ${provider?.name}...`,
        },
        {
          name: "Testando permissões",
          delay: 800,
          feedback: "Verificando permissões de acesso...",
        },
        {
          name: "Verificando estrutura",
          delay: 600,
          feedback: "Validando estrutura de pastas...",
        },
        {
          name: "Finalizando teste",
          delay: 400,
          feedback: "Concluindo verificações...",
        },
      ];

      for (let i = 0; i < steps.length; i++) {
        setTestProgress((i / steps.length) * 100);
        setConnectionFeedback(steps[i].feedback);
        await new Promise((resolve) => setTimeout(resolve, steps[i].delay));

        // Simular falha baseada na configuração
        if (selectedProvider === "supabase-external" && !currentConfig.url) {
          throw new Error("URL do Supabase é obrigatória");
        }
        if (selectedProvider === "google-drive" && !currentConfig.clientId) {
          throw new Error("Client ID do Google é obrigatório");
        }
        if (selectedProvider === "ftp-sftp" && !currentConfig.host) {
          throw new Error("Host do servidor é obrigatório");
        }
        if (selectedProvider === "api-custom" && !currentConfig.baseUrl) {
          throw new Error("URL base da API é obrigatória");
        }
      }

      setTestProgress(100);
      setConnectionFeedback("Conexão estabelecida com sucesso!");

      // Sucesso
      setConfig((prev) => ({
        ...prev,
        connectionStatus: "connected",
        lastTested: new Date(),
        errorDetails: undefined,
      }));

      toast.success(
        `✅ Conexão com ${provider?.name} estabelecida com sucesso!`,
        {
          description: "Todas as verificações foram aprovadas",
        },
      );
    } catch (error: any) {
      setConnectionFeedback(`Erro: ${error.message}`);

      setConfig((prev) => ({
        ...prev,
        connectionStatus: "error",
        lastTested: new Date(),
        errorDetails: {
          message: error.message,
          statusCode: error.status || 500,
          timestamp: new Date(),
        },
      }));

      toast.error(`❌ Falha na conexão: ${error.message}`, {
        description: "Verifique as configurações e tente novamente",
        action: {
          label: "Reportar Erro",
          onClick: () => setShowErrorDialog(true),
        },
      });
    } finally {
      setTesting(false);
      setTimeout(() => {
        setTestProgress(0);
        if (!testing) setConnectionFeedback("");
      }, 2000);
    }
  };

  const saveConfiguration = async () => {
    setSaving(true);

    try {
      const newConfig: StorageConfig = {
        ...config,
        provider: selectedProvider,
        config: providerConfigs[selectedProvider],
        isActive: true,
      };

      // Salvar no localStorage
      localStorage.setItem("lawdesk-storage-config", JSON.stringify(newConfig));
      localStorage.setItem(
        "lawdesk-provider-configs",
        JSON.stringify(providerConfigs),
      );

      setConfig(newConfig);
      onConfigChange?.(newConfig);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("✅ Configuração salva com sucesso!", {
        description: `Provedor ${storageProviders.find((p) => p.id === selectedProvider)?.name} ativado`,
      });
    } catch (error) {
      toast.error("❌ Erro ao salvar configuração");
    } finally {
      setSaving(false);
    }
  };

  const testUpload = async () => {
    setUploadTest(true);

    try {
      // Simular upload de teste
      toast.loading("📤 Iniciando upload de teste...", { id: "upload-test" });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("📤 Upload de teste realizado com sucesso!", {
        id: "upload-test",
        description: "Arquivo simulado enviado para o destino configurado",
      });
    } catch (error) {
      toast.error("❌ Falha no upload de teste", { id: "upload-test" });
    } finally {
      setUploadTest(false);
    }
  };

  const generateErrorReport = () => {
    const report = {
      usuarioId: "user_12345",
      provedorSelecionado: selectedProvider,
      ultimoErro: config.errorDetails,
      configuracao: providerConfigs[selectedProvider],
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `erro-armazenamento-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("📋 Relatório de erro gerado e baixado");
  };

  const currentProvider = storageProviders.find(
    (p) => p.id === selectedProvider,
  );
  const currentConfig = providerConfigs[selectedProvider] || {};

  return (
    <div className="space-y-6">
      {/* Header com navegação */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configuração de Armazenamento</h2>
          <p className="text-muted-foreground">
            Configure onde e como os documentos jurídicos são armazenados na
            plataforma
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate("/teste-configuracao-storage")}
          >
            <TestTube className="h-4 w-4 mr-2" />
            Ver Simulação
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              navigate("/configuracao-armazenamento?tab=dashboard")
            }
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Painel de Controle
          </Button>
        </div>
      </div>

      {/* Seleção de Provedor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Folder className="h-5 w-5 mr-2" />
            Escolha do Provedor de Armazenamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {storageProviders.map((provider) => {
              const Icon = provider.icon;
              const isSelected = selectedProvider === provider.id;

              return (
                <motion.div
                  key={provider.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? "ring-2 ring-[rgb(var(--theme-primary))] bg-[rgb(var(--theme-primary))]/5"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => handleProviderChange(provider.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`p-2 rounded-lg ${provider.color} text-white`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        {provider.recommended && (
                          <Badge variant="default" className="text-xs">
                            Recomendado
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-semibold mb-1">{provider.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {provider.description}
                      </p>

                      <div className="flex items-center space-x-2 mb-3">
                        {provider.compliance.lgpd && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="outline" className="text-xs">
                                  <Shield className="h-3 w-3 mr-1" />
                                  LGPD
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Conformidade com LGPD</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {provider.compliance.encryption && (
                          <Badge variant="outline" className="text-xs">
                            <Lock className="h-3 w-3 mr-1" />
                            AES-256
                          </Badge>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {provider.features.slice(0, 2).map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Status de Conexão */}
          {config.connectionStatus !== "untested" && (
            <Alert
              className={
                config.connectionStatus === "connected"
                  ? "border-green-200 bg-green-50 dark:bg-green-950/20"
                  : "border-red-200 bg-red-50 dark:bg-red-950/20"
              }
            >
              {config.connectionStatus === "connected" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
              <AlertTitle
                className={
                  config.connectionStatus === "connected"
                    ? "text-green-800"
                    : "text-red-800"
                }
              >
                {config.connectionStatus === "connected"
                  ? "✅ Conexão Estabelecida"
                  : "❌ Erro de Conexão"}
              </AlertTitle>
              <AlertDescription
                className={
                  config.connectionStatus === "connected"
                    ? "text-green-700"
                    : "text-red-700"
                }
              >
                {config.connectionStatus === "connected"
                  ? `Conectado ao ${currentProvider?.name} com sucesso. Última verificação: ${config.lastTested?.toLocaleString("pt-BR")}`
                  : config.errorDetails?.message ||
                    "Falha na conexão com o provedor"}
              </AlertDescription>
            </Alert>
          )}

          {/* Feedback de Teste em Tempo Real */}
          {testing && connectionFeedback && (
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 mt-4">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                {connectionFeedback}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Configuração Específica do Provedor */}
      {currentProvider && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Configuração - {currentProvider.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Lawdesk Cloud */}
            {selectedProvider === "lawdesk-cloud" && (
              <div className="space-y-4">
                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    O Lawdesk Cloud é configurado automaticamente. Não são
                    necessárias configurações adicionais.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Região</Label>
                    <Select defaultValue={currentConfig.region} disabled>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sa-east-1">
                          São Paulo (sa-east-1)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Classe de Armazenamento</Label>
                    <Select defaultValue={currentConfig.storageClass} disabled>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Padrão</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Supabase */}
            {selectedProvider === "supabase-external" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="supabase-url">
                    URL do Projeto Supabase *
                  </Label>
                  <Input
                    id="supabase-url"
                    placeholder="https://xyz.supabase.co"
                    value={currentConfig.url || ""}
                    onChange={(e) => handleConfigChange("url", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="supabase-anon-key">
                    Chave Anônima (anon key) *
                  </Label>
                  <div className="relative">
                    <Input
                      id="supabase-anon-key"
                      type={showPassword.anonKey ? "text" : "password"}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={currentConfig.anonKey || ""}
                      onChange={(e) =>
                        handleConfigChange("anonKey", e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          anonKey: !prev.anonKey,
                        }))
                      }
                    >
                      {showPassword.anonKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="supabase-service-key">
                    Chave de Serviço (service key)
                  </Label>
                  <div className="relative">
                    <Input
                      id="supabase-service-key"
                      type={showPassword.serviceKey ? "text" : "password"}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={currentConfig.serviceKey || ""}
                      onChange={(e) =>
                        handleConfigChange("serviceKey", e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          serviceKey: !prev.serviceKey,
                        }))
                      }
                    >
                      {showPassword.serviceKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="supabase-bucket">Nome do Destino</Label>
                  <Input
                    id="supabase-bucket"
                    placeholder="lawdesk-documents"
                    value={currentConfig.bucket || ""}
                    onChange={(e) =>
                      handleConfigChange("bucket", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            {/* Google Drive */}
            {selectedProvider === "google-drive" && (
              <div className="space-y-4">
                <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                    É necessário configurar um projeto no Google Cloud Console e
                    ativar a API do Google Drive.
                  </AlertDescription>
                </Alert>

                <div>
                  <Label htmlFor="google-client-id">Client ID *</Label>
                  <Input
                    id="google-client-id"
                    placeholder="123456789-abc.apps.googleusercontent.com"
                    value={currentConfig.clientId || ""}
                    onChange={(e) =>
                      handleConfigChange("clientId", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="google-client-secret">Client Secret *</Label>
                  <div className="relative">
                    <Input
                      id="google-client-secret"
                      type={showPassword.clientSecret ? "text" : "password"}
                      placeholder="GOCSPX-..."
                      value={currentConfig.clientSecret || ""}
                      onChange={(e) =>
                        handleConfigChange("clientSecret", e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          clientSecret: !prev.clientSecret,
                        }))
                      }
                    >
                      {showPassword.clientSecret ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="google-root-folder">Pasta Raiz</Label>
                  <Input
                    id="google-root-folder"
                    placeholder="Lawdesk CRM"
                    value={currentConfig.rootFolder || ""}
                    onChange={(e) =>
                      handleConfigChange("rootFolder", e.target.value)
                    }
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="google-shared-drive"
                    checked={currentConfig.sharedDrive || false}
                    onCheckedChange={(checked) =>
                      handleConfigChange("sharedDrive", checked)
                    }
                  />
                  <Label htmlFor="google-shared-drive">
                    Usar Drive Compartilhado
                  </Label>
                </div>
              </div>
            )}

            {/* FTP/SFTP */}
            {selectedProvider === "ftp-sftp" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ftp-host">Servidor (Host) *</Label>
                    <Input
                      id="ftp-host"
                      placeholder="ftp.seudominio.com"
                      value={currentConfig.host || ""}
                      onChange={(e) =>
                        handleConfigChange("host", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="ftp-port">Porta</Label>
                    <Input
                      id="ftp-port"
                      type="number"
                      placeholder="22"
                      value={currentConfig.port || ""}
                      onChange={(e) =>
                        handleConfigChange("port", parseInt(e.target.value))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ftp-username">Usuário *</Label>
                    <Input
                      id="ftp-username"
                      placeholder="usuario"
                      value={currentConfig.username || ""}
                      onChange={(e) =>
                        handleConfigChange("username", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="ftp-password">Senha *</Label>
                    <div className="relative">
                      <Input
                        id="ftp-password"
                        type={showPassword.password ? "text" : "password"}
                        placeholder="••••••••"
                        value={currentConfig.password || ""}
                        onChange={(e) =>
                          handleConfigChange("password", e.target.value)
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            password: !prev.password,
                          }))
                        }
                      >
                        {showPassword.password ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="ftp-base-path">
                    Caminho de Armazenamento
                  </Label>
                  <Input
                    id="ftp-base-path"
                    placeholder="/lawdesk/"
                    value={currentConfig.basePath || ""}
                    onChange={(e) =>
                      handleConfigChange("basePath", e.target.value)
                    }
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="ftp-use-sftp"
                    checked={currentConfig.useSFTP !== false}
                    onCheckedChange={(checked) =>
                      handleConfigChange("useSFTP", checked)
                    }
                  />
                  <Label htmlFor="ftp-use-sftp">Usar SFTP (Recomendado)</Label>
                </div>
              </div>
            )}

            {/* API Custom */}
            {selectedProvider === "api-custom" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="api-base-url">URL Base da API *</Label>
                  <Input
                    id="api-base-url"
                    placeholder="https://api.seudominio.com/v1"
                    value={currentConfig.baseUrl || ""}
                    onChange={(e) =>
                      handleConfigChange("baseUrl", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="api-token">Token de Autenticação *</Label>
                  <div className="relative">
                    <Input
                      id="api-token"
                      type={showPassword.token ? "text" : "password"}
                      placeholder="Bearer token ou API key"
                      value={currentConfig.token || ""}
                      onChange={(e) =>
                        handleConfigChange("token", e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          token: !prev.token,
                        }))
                      }
                    >
                      {showPassword.token ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Tipo de API</Label>
                  <Select
                    value={currentConfig.apiType || "rest"}
                    onValueChange={(value) =>
                      handleConfigChange("apiType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rest">REST API</SelectItem>
                      <SelectItem value="graphql">GraphQL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Endpoints Personalizados</Label>
                  <div className="space-y-2">
                    <Input
                      placeholder="Upload: /upload"
                      value={currentConfig.endpoints?.upload || ""}
                      onChange={(e) =>
                        handleConfigChange("endpoints", {
                          ...currentConfig.endpoints,
                          upload: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Download: /download/{id}"
                      value={currentConfig.endpoints?.download || ""}
                      onChange={(e) =>
                        handleConfigChange("endpoints", {
                          ...currentConfig.endpoints,
                          download: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Exclusão: /delete/{id}"
                      value={currentConfig.endpoints?.delete || ""}
                      onChange={(e) =>
                        handleConfigChange("endpoints", {
                          ...currentConfig.endpoints,
                          delete: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Configurações de Segurança */}
            <Separator />

            <div className="space-y-4">
              <h4 className="font-semibold flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Configurações de Segurança
              </h4>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="encryption">Criptografia AES-256</Label>
                  <p className="text-sm text-muted-foreground">
                    Criptografar documentos antes do envio
                  </p>
                </div>
                <Switch
                  id="encryption"
                  checked={config.encryption}
                  onCheckedChange={(checked) =>
                    setConfig((prev) => ({ ...prev, encryption: checked }))
                  }
                />
              </div>
            </div>

            {/* Progresso do Teste */}
            {testing && testProgress > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Testando conexão...</span>
                  <span>{Math.round(testProgress)}%</span>
                </div>
                <Progress value={testProgress} className="h-2" />
              </div>
            )}

            {/* Ações */}
            <div className="flex space-x-3">
              <Button
                onClick={testConnection}
                disabled={testing}
                variant="outline"
                className="flex-1"
              >
                {testing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Testar Conexão
              </Button>

              <Button
                onClick={testUpload}
                disabled={config.connectionStatus !== "connected" || uploadTest}
                variant="outline"
              >
                {uploadTest ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Upload de Teste
              </Button>

              <Button
                onClick={saveConfiguration}
                disabled={saving || config.connectionStatus !== "connected"}
                className="flex-1"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar Configuração
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Aviso LGPD */}
      {currentProvider && !currentProvider.compliance.lgpd && (
        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <Shield className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800 dark:text-orange-200">
            Atenção - Conformidade LGPD
          </AlertTitle>
          <AlertDescription className="text-orange-700 dark:text-orange-300">
            Este provedor pode não atender todos os requisitos da LGPD.
            Certifique-se de que o tratamento de dados pessoais está em
            conformidade com a legislação brasileira.{" "}
            <RouterLink
              to="/configuracoes/lgpd"
              className="underline font-medium hover:no-underline"
            >
              Saiba mais sobre LGPD
            </RouterLink>
          </AlertDescription>
        </Alert>
      )}

      {/* Modal de Erro */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reportar Erro de Conexão</DialogTitle>
            <DialogDescription>
              As informações abaixo serão incluídas no relatório de erro:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg text-sm font-mono">
              <div>
                <strong>Usuário:</strong> user_12345
              </div>
              <div>
                <strong>Provedor:</strong> {selectedProvider}
              </div>
              <div>
                <strong>Erro:</strong> {config.errorDetails?.message}
              </div>
              <div>
                <strong>Código:</strong> {config.errorDetails?.statusCode}
              </div>
              <div>
                <strong>Timestamp:</strong>{" "}
                {config.errorDetails?.timestamp?.toLocaleString("pt-BR")}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowErrorDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                generateErrorReport();
                setShowErrorDialog(false);
              }}
            >
              <FileText className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
