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
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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
    name: "Supabase Próprio",
    description:
      "Use sua própria instância do Supabase com controle total sobre os dados",
    icon: Database,
    color: "bg-green-500",
    features: [
      "Controle total dos dados",
      "APIs REST e GraphQL",
      "Row Level Security (RLS)",
      "Backup configurável",
      "Integração com PostgreSQL",
    ],
    compliance: { lgpd: false, backup: false, encryption: true },
  },
  {
    id: "google-drive",
    name: "Google Drive API",
    description:
      "Integração com Google Drive usando OAuth2, organizando por cliente e processo",
    icon: Globe,
    color: "bg-yellow-500",
    features: [
      "Autenticação OAuth2 segura",
      "Organização automática em pastas",
      "Compartilhamento controlado",
      "Versionamento de arquivos",
      "Acesso via Google Workspace",
    ],
    compliance: { lgpd: false, backup: false, encryption: false },
  },
  {
    id: "ftp-sftp",
    name: "Servidor Local",
    description: "Conecte com seu servidor FTP/SFTP local ou dedicado",
    icon: Server,
    color: "bg-purple-500",
    features: [
      "Controle total do servidor",
      "Acesso via FTP/SFTP",
      "Configuração personalizada",
      "Sem limitações de espaço",
      "Integração com infraestrutura existente",
    ],
    compliance: { lgpd: false, backup: false, encryption: false },
  },
  {
    id: "api-custom",
    name: "API Personalizada",
    description: "Integre com sua API REST ou GraphQL personalizada",
    icon: Link,
    color: "bg-indigo-500",
    features: [
      "Endpoint REST/GraphQL",
      "Cabeçalhos personalizados",
      "Autenticação flexível",
      "Webhook de notificações",
      "Estrutura de dados personalizada",
    ],
    compliance: { lgpd: false, backup: false, encryption: false },
  },
];

export function ConfigStorageProvider() {
  const [selectedProvider, setSelectedProvider] =
    useState<StorageProvider>("lawdesk-cloud");
  const [storageConfig, setStorageConfig] = useState<StorageConfig>({
    provider: "lawdesk-cloud",
    isActive: true,
    encryption: true,
    config: {},
    connectionStatus: "connected",
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [testResult, setTestResult] = useState<string>("");

  // Load existing configuration
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const savedConfig = localStorage.getItem("lawdesk-storage-config");
        if (savedConfig) {
          const config = JSON.parse(savedConfig);
          setStorageConfig(config);
          setSelectedProvider(config.provider);
        }
      } catch (error) {
        console.error("Erro ao carregar configuração de armazenamento:", error);
        toast.error("Erro ao carregar configuração salva");
      }
    };

    loadConfig();
  }, []);

  const handleProviderSelect = (providerId: StorageProvider) => {
    setSelectedProvider(providerId);
    setStorageConfig((prev) => ({
      ...prev,
      provider: providerId,
      config: {},
      connectionStatus: "untested",
    }));
    setTestResult("");
  };

  const handleConfigChange = (key: string, value: any) => {
    setStorageConfig((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value,
      },
    }));
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    setTestResult("");

    try {
      toast.loading("Testando conexão...", { id: "test-connection" });

      // Simulate connection test
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Validate required fields based on provider
      const isConfigValid = validateConfiguration();

      if (!isConfigValid) {
        throw new Error("Configuração incompleta");
      }

      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.2; // 80% success rate

      if (isSuccess) {
        setStorageConfig((prev) => ({
          ...prev,
          connectionStatus: "connected",
          lastTested: new Date(),
        }));
        setTestResult(
          "Conexão estabelecida com sucesso! Todas as funcionalidades estão operacionais.",
        );
        toast.success("Conexão testada com sucesso!", {
          id: "test-connection",
        });
      } else {
        setStorageConfig((prev) => ({
          ...prev,
          connectionStatus: "error",
          lastTested: new Date(),
        }));
        setTestResult(
          "Falha na conexão. Verifique as credenciais e configurações de rede.",
        );
        toast.error("Falha na conexão. Verifique as credenciais.", {
          id: "test-connection",
        });
      }
    } catch (error: any) {
      setStorageConfig((prev) => ({
        ...prev,
        connectionStatus: "error",
        lastTested: new Date(),
      }));
      setTestResult(`Erro: ${error.message}`);
      toast.error("Erro ao testar conexão: " + error.message, {
        id: "test-connection",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const validateConfiguration = (): boolean => {
    switch (selectedProvider) {
      case "lawdesk-cloud":
        return true; // Always valid for Lawdesk Cloud
      case "supabase-external":
        return !!(storageConfig.config.url && storageConfig.config.anonKey);
      case "google-drive":
        return !!(
          storageConfig.config.clientId && storageConfig.config.clientSecret
        );
      case "ftp-sftp":
        return !!(
          storageConfig.config.host &&
          storageConfig.config.username &&
          storageConfig.config.password
        );
      case "api-custom":
        return !!storageConfig.config.baseUrl;
      default:
        return false;
    }
  };

  const saveConfiguration = async () => {
    setIsSaving(true);
    try {
      if (!validateConfiguration()) {
        toast.error("Preencha todos os campos obrigatórios antes de salvar");
        return;
      }

      // Simulate API save
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save to localStorage for demo
      localStorage.setItem(
        "lawdesk-storage-config",
        JSON.stringify(storageConfig),
      );

      // Update global config
      window.dispatchEvent(
        new CustomEvent("storage-config-updated", { detail: storageConfig }),
      );

      toast.success("Configuração salva com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configuração");
      console.error("Erro ao salvar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getConnectionStatusIcon = () => {
    switch (storageConfig.connectionStatus) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <TestTube className="h-4 w-4 text-gray-500" />;
    }
  };

  const getConnectionStatusText = () => {
    switch (storageConfig.connectionStatus) {
      case "connected":
        return "Conectado";
      case "error":
        return "Erro na Conexão";
      case "pending":
        return "Testando...";
      default:
        return "Não Testado";
    }
  };

  const selectedProviderData = storageProviders.find(
    (p) => p.id === selectedProvider,
  );

  const renderProviderConfig = () => {
    switch (selectedProvider) {
      case "lawdesk-cloud":
        return (
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Configuração Automática</AlertTitle>
              <AlertDescription>
                O Lawdesk Cloud está configurado automaticamente. Não são
                necessárias credenciais adicionais.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Região do Servidor</Label>
                <Select
                  defaultValue="sa-east-1"
                  onValueChange={(value) => handleConfigChange("region", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sa-east-1">
                      São Paulo (sa-east-1)
                    </SelectItem>
                    <SelectItem value="us-east-1">
                      Virgínia (us-east-1)
                    </SelectItem>
                    <SelectItem value="eu-west-1">
                      Irlanda (eu-west-1)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Classe de Armazenamento</Label>
                <Select
                  defaultValue="standard"
                  onValueChange={(value) =>
                    handleConfigChange("storageClass", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">
                      Padrão (acesso frequente)
                    </SelectItem>
                    <SelectItem value="ia">Acesso Infrequente</SelectItem>
                    <SelectItem value="archive">Arquivo (backup)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "supabase-external":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supabase-url">URL do Projeto Supabase *</Label>
                <Input
                  id="supabase-url"
                  placeholder="https://xyz.supabase.co"
                  value={storageConfig.config.url || ""}
                  onChange={(e) => handleConfigChange("url", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="supabase-key">Chave Pública (anon key) *</Label>
                <Input
                  id="supabase-key"
                  type="password"
                  placeholder="eyJ0eXAiOiJKV1QiLCJhbGc..."
                  value={storageConfig.config.anonKey || ""}
                  onChange={(e) =>
                    handleConfigChange("anonKey", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="service-role-key">
                Chave de Serviço (opcional)
              </Label>
              <Input
                id="service-role-key"
                type="password"
                placeholder="Para operações administrativas"
                value={storageConfig.config.serviceRoleKey || ""}
                onChange={(e) =>
                  handleConfigChange("serviceRoleKey", e.target.value)
                }
              />
            </div>

            <div>
              <Label htmlFor="bucket-name">Nome do Destino</Label>
              <Input
                id="bucket-name"
                placeholder="lawdesk-documentos"
                value={storageConfig.config.bucket || "lawdesk-documentos"}
                onChange={(e) => handleConfigChange("bucket", e.target.value)}
              />
            </div>
          </div>
        );

      case "google-drive":
        return (
          <div className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>Autenticação OAuth2</AlertTitle>
              <AlertDescription>
                A autenticação será realizada via OAuth2 do Google. Suas
                credenciais ficam seguras.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client-id">ID do Cliente Google *</Label>
                <Input
                  id="client-id"
                  placeholder="123456789-xyz.apps.googleusercontent.com"
                  value={storageConfig.config.clientId || ""}
                  onChange={(e) =>
                    handleConfigChange("clientId", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="client-secret">
                  Chave Secreta do Cliente *
                </Label>
                <Input
                  id="client-secret"
                  type="password"
                  placeholder="GOCSPX-..."
                  value={storageConfig.config.clientSecret || ""}
                  onChange={(e) =>
                    handleConfigChange("clientSecret", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="root-folder">Pasta Raiz (opcional)</Label>
              <Input
                id="root-folder"
                placeholder="Lawdesk CRM - Documentos"
                value={storageConfig.config.rootFolder || ""}
                onChange={(e) =>
                  handleConfigChange("rootFolder", e.target.value)
                }
              />
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => toast.info("OAuth2 seria iniciado aqui")}
            >
              <Globe className="h-4 w-4 mr-2" />
              Autorizar via Google OAuth2
            </Button>
          </div>
        );

      case "ftp-sftp":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ftp-host">Servidor (Host) *</Label>
                <Input
                  id="ftp-host"
                  placeholder="ftp.seuescritorio.com.br"
                  value={storageConfig.config.host || ""}
                  onChange={(e) => handleConfigChange("host", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="ftp-port">Porta</Label>
                <Input
                  id="ftp-port"
                  type="number"
                  placeholder="21 (FTP) ou 22 (SFTP)"
                  value={storageConfig.config.port || ""}
                  onChange={(e) => handleConfigChange("port", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ftp-user">Usuário *</Label>
                <Input
                  id="ftp-user"
                  placeholder="usuario_lawdesk"
                  value={storageConfig.config.username || ""}
                  onChange={(e) =>
                    handleConfigChange("username", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="ftp-password">Senha *</Label>
                <Input
                  id="ftp-password"
                  type="password"
                  placeholder="••••••••"
                  value={storageConfig.config.password || ""}
                  onChange={(e) =>
                    handleConfigChange("password", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="ftp-path">Caminho de Armazenamento</Label>
              <Input
                id="ftp-path"
                placeholder="/public_html/lawdesk/"
                value={storageConfig.config.remotePath || ""}
                onChange={(e) =>
                  handleConfigChange("remotePath", e.target.value)
                }
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="use-sftp"
                checked={storageConfig.config.useSFTP || false}
                onCheckedChange={(checked) =>
                  handleConfigChange("useSFTP", checked)
                }
              />
              <Label htmlFor="use-sftp">
                Usar SFTP (recomendado para segurança)
              </Label>
            </div>
          </div>
        );

      case "api-custom":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="api-base-url">URL Base da API *</Label>
              <Input
                id="api-base-url"
                placeholder="https://api.seuescritorio.com.br/v1"
                value={storageConfig.config.baseUrl || ""}
                onChange={(e) => handleConfigChange("baseUrl", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="api-token">Token de Autenticação</Label>
                <Input
                  id="api-token"
                  type="password"
                  placeholder="Bearer token ou chave da API"
                  value={storageConfig.config.token || ""}
                  onChange={(e) => handleConfigChange("token", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="api-type">Tipo de API</Label>
                <Select
                  value={storageConfig.config.apiType || "rest"}
                  onValueChange={(value) =>
                    handleConfigChange("apiType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rest">REST</SelectItem>
                    <SelectItem value="graphql">GraphQL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="custom-headers">
                Cabeçalhos Personalizados (JSON)
              </Label>
              <Textarea
                id="custom-headers"
                placeholder='{"X-Custom-Header": "valor", "Content-Type": "application/json"}'
                value={storageConfig.config.customHeaders || ""}
                onChange={(e) =>
                  handleConfigChange("customHeaders", e.target.value)
                }
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="webhook-url">
                Webhook para Notificações (opcional)
              </Label>
              <Input
                id="webhook-url"
                placeholder="https://seuescritorio.com.br/webhook/armazenamento"
                value={storageConfig.config.webhookUrl || ""}
                onChange={(e) =>
                  handleConfigChange("webhookUrl", e.target.value)
                }
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold">Configuração de Armazenamento</h1>
          <p className="text-muted-foreground">
            Configure onde e como os documentos e arquivos serão armazenados na
            plataforma
          </p>
        </div>

        {/* Provider Selection */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Folder className="h-5 w-5" />
              <span>Selecionar Provedor de Armazenamento</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {storageProviders.map((provider) => (
                <motion.div
                  key={provider.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative p-4 border-2 rounded-xl cursor-pointer transition-all
                    ${
                      selectedProvider === provider.id
                        ? "border-[rgb(var(--theme-primary))] bg-[rgb(var(--theme-primary))]/5"
                        : "border-border hover:border-[rgb(var(--theme-primary))]/50"
                    }
                  `}
                  onClick={() => handleProviderSelect(provider.id)}
                >
                  {provider.recommended && (
                    <Badge className="absolute -top-2 -right-2 bg-orange-500">
                      Recomendado
                    </Badge>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-lg ${provider.color} flex items-center justify-center`}
                      >
                        <provider.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{provider.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {provider.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-xs">
                        <div
                          className={`w-2 h-2 rounded-full ${provider.compliance.lgpd ? "bg-green-500" : "bg-gray-400"}`}
                        />
                        <span>LGPD Nativa</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <div
                          className={`w-2 h-2 rounded-full ${provider.compliance.backup ? "bg-green-500" : "bg-gray-400"}`}
                        />
                        <span>Backup Automático</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <div
                          className={`w-2 h-2 rounded-full ${provider.compliance.encryption ? "bg-green-500" : "bg-gray-400"}`}
                        />
                        <span>Criptografia</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Provider Configuration */}
        <AnimatePresence mode="wait">
          {selectedProviderData && (
            <motion.div
              key={selectedProvider}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="rounded-2xl shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <selectedProviderData.icon className="h-5 w-5" />
                      <span>Configurar {selectedProviderData.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getConnectionStatusIcon()}
                      <span className="text-sm text-muted-foreground">
                        {getConnectionStatusText()}
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {renderProviderConfig()}

                  {/* Test Result Display */}
                  {testResult && (
                    <Alert
                      className={
                        storageConfig.connectionStatus === "connected"
                          ? "border-green-200 bg-green-50 dark:bg-green-950/20"
                          : "border-red-200 bg-red-50 dark:bg-red-950/20"
                      }
                    >
                      {storageConfig.connectionStatus === "connected" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <AlertTitle>Resultado do Teste de Conexão</AlertTitle>
                      <AlertDescription>{testResult}</AlertDescription>
                    </Alert>
                  )}

                  <Separator />

                  {/* Security Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Configurações de Segurança</span>
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Criptografia de Arquivos (AES-256)</Label>
                        <p className="text-sm text-muted-foreground">
                          Criptografar arquivos antes do upload para maior
                          segurança
                        </p>
                      </div>
                      <Switch
                        checked={storageConfig.encryption}
                        onCheckedChange={(checked) =>
                          setStorageConfig((prev) => ({
                            ...prev,
                            encryption: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Configurações Avançadas</Label>
                        <p className="text-sm text-muted-foreground">
                          Mostrar opções avançadas de configuração
                        </p>
                      </div>
                      <Switch
                        checked={showAdvanced}
                        onCheckedChange={setShowAdvanced}
                      />
                    </div>

                    <AnimatePresence>
                      {showAdvanced && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 border-l-2 border-[rgb(var(--theme-primary))] pl-4"
                        >
                          <div>
                            <Label htmlFor="max-file-size">
                              Tamanho Máximo por Arquivo (MB)
                            </Label>
                            <Input
                              id="max-file-size"
                              type="number"
                              placeholder="50"
                              value={storageConfig.config.maxFileSize || "50"}
                              onChange={(e) =>
                                handleConfigChange(
                                  "maxFileSize",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div>
                            <Label htmlFor="allowed-types">
                              Tipos de Arquivo Permitidos
                            </Label>
                            <Input
                              id="allowed-types"
                              placeholder="pdf,doc,docx,jpg,png"
                              value={
                                storageConfig.config.allowedTypes ||
                                "pdf,doc,docx,jpg,png"
                              }
                              onChange={(e) =>
                                handleConfigChange(
                                  "allowedTypes",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div>
                            <Label htmlFor="retention-days">
                              Retenção de Backups (dias)
                            </Label>
                            <Input
                              id="retention-days"
                              type="number"
                              placeholder="30"
                              value={storageConfig.config.retentionDays || "30"}
                              onChange={(e) =>
                                handleConfigChange(
                                  "retentionDays",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* LGPD Compliance Warning */}
                  {selectedProvider !== "lawdesk-cloud" && (
                    <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
                      <div className="flex items-start space-x-2">
                        <div className="text-2xl">⚖️</div>
                        <div>
                          <AlertTitle className="text-orange-800 dark:text-orange-200">
                            Responsabilidade sobre Conformidade LGPD
                          </AlertTitle>
                          <AlertDescription className="text-orange-700 dark:text-orange-300">
                            <div className="space-y-2">
                              <p>
                                Ao usar provedores externos, você assume a
                                responsabilidade pela:
                              </p>
                              <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>
                                  Conformidade com a LGPD (Lei Geral de Proteção
                                  de Dados)
                                </li>
                                <li>
                                  Segurança e backup dos dados armazenados
                                </li>
                                <li>Controle de acesso e permissões</li>
                                <li>
                                  Política de retenção e exclusão de dados
                                </li>
                              </ul>
                              <div className="flex items-center space-x-2 mt-3">
                                <ExternalLink className="h-4 w-4" />
                                <a
                                  href="https://lawdesk.com.br/politica-privacidade"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm underline hover:no-underline"
                                >
                                  Consulte nossa Política de Privacidade
                                </a>
                              </div>
                            </div>
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  )}

                  {/* Data Loss Warning */}
                  {storageConfig.provider !== selectedProvider && (
                    <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertTitle className="text-red-800 dark:text-red-200">
                        Aviso de Mudança de Provedor
                      </AlertTitle>
                      <AlertDescription className="text-red-700 dark:text-red-300">
                        Alterar o provedor de armazenamento pode resultar em:
                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                          <li>Perda de acesso aos arquivos existentes</li>
                          <li>Necessidade de migração manual dos dados</li>
                          <li>Interrupção temporária do serviço</li>
                        </ul>
                        <p className="mt-2 text-sm font-medium">
                          Certifique-se de fazer backup antes de alterar.
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4 pt-6">
                    <Button
                      onClick={testConnection}
                      disabled={isTestingConnection}
                      variant="outline"
                      className="flex-1"
                    >
                      {isTestingConnection ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <TestTube className="h-4 w-4 mr-2" />
                      )}
                      Testar Conexão
                    </Button>

                    <Button
                      onClick={saveConfiguration}
                      disabled={
                        isSaving || storageConfig.connectionStatus === "error"
                      }
                      className="flex-1 bg-[rgb(var(--theme-primary))] hover:bg-[rgb(var(--theme-primary))]/90"
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Salvar Configuração
                    </Button>
                  </div>

                  {storageConfig.lastTested && (
                    <p className="text-xs text-muted-foreground text-center">
                      Última conexão testada em:{" "}
                      {storageConfig.lastTested.toLocaleString("pt-BR")}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </TooltipProvider>
  );
}
