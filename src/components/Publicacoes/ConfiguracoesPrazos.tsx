import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Save,
  RotateCcw,
  Download,
  Upload,
  Settings,
  Bot,
  Clock,
  Calendar,
  Gavel,
  AlertTriangle,
  CheckCircle,
  FileText,
  Plus,
  Trash2,
  Edit,
  Copy,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRegrasProcessuais } from "@/contexts/RegrasProcessuaisContext";
import { useAdviseAPI } from "@/hooks/useAdviseAPI";
import { toast } from "sonner";

interface ConfiguracoesPrazosProps {
  onClose?: () => void;
}

export function ConfiguracoesPrazos({ onClose }: ConfiguracoesPrazosProps) {
  const {
    regras,
    configuracao,
    updateConfiguracao,
    exportarRegras,
    importarRegras,
    resetarRegras,
  } = useRegrasProcessuais();

  const {
    config: configAdvise,
    updateConfig: updateAdviseConfig,
    testarConexao,
    loading: adviseLoading,
  } = useAdviseAPI();

  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState("");
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleExportarRegras = () => {
    const dataStr = exportarRegras();
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `regras-processuais-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Regras exportadas com sucesso!");
  };

  const handleImportarRegras = () => {
    if (!importData.trim()) {
      toast.error("Insira os dados JSON para importar");
      return;
    }

    const sucesso = importarRegras(importData);
    if (sucesso) {
      toast.success("Regras importadas com sucesso!");
      setShowImportDialog(false);
      setImportData("");
    } else {
      toast.error("Erro ao importar regras. Verifique o formato JSON.");
    }
  };

  const handleResetarRegras = () => {
    resetarRegras();
    toast.success("Regras resetadas para o padrão!");
  };

  const handleTestarConexaoAdvise = async () => {
    setTestingConnection(true);
    try {
      const sucesso = await testarConexao();
      setConnectionStatus(sucesso ? "success" : "error");
      toast[sucesso ? "success" : "error"](
        sucesso
          ? "Conexão com API Advise bem-sucedida!"
          : "Erro na conexão com API Advise",
      );
    } finally {
      setTestingConnection(false);
    }
  };

  const tiposProcessoOptions = [
    { value: "cpc", label: "Código de Processo Civil" },
    { value: "penal", label: "Processo Penal" },
    { value: "trabalhista", label: "Processo Trabalhista" },
    { value: "jef", label: "Juizados Especiais Federais" },
  ];

  const modoContagemOptions = [
    {
      value: "manual",
      label: "Manual",
      description: "Usuário define os prazos manualmente",
    },
    {
      value: "automatica",
      label: "Automática",
      description: "Sistema calcula baseado nas regras",
    },
    {
      value: "ia",
      label: "Inteligência Artificial",
      description: "IA analisa e sugere prazos",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Configurações de Prazos Processuais
          </h2>
          <p className="text-muted-foreground mt-1">
            Configure regras de cálculo de prazos e integração com APIs
          </p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        )}
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="geral">Configuração Geral</TabsTrigger>
          <TabsTrigger value="regras">Regras Processuais</TabsTrigger>
          <TabsTrigger value="advise">Integração Advise</TabsTrigger>
          <TabsTrigger value="backup">Backup & Sync</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 md:grid-cols-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Configurações de Cálculo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="modo-contagem">Modo de Contagem</Label>
                  <Select
                    value={configuracao.modoContagem}
                    onValueChange={(value: any) =>
                      updateConfiguracao({ modoContagem: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {modoContagemOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-muted-foreground">
                              {option.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo-processo-padrao">
                    Tipo de Processo Padrão
                  </Label>
                  <Select
                    value={configuracao.tipoProcessoPadrao}
                    onValueChange={(value: any) =>
                      updateConfiguracao({ tipoProcessoPadrao: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposProcessoOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notificacao-antecipada">
                    Notificação Antecipada (dias)
                  </Label>
                  <Input
                    id="notificacao-antecipada"
                    type="number"
                    min="1"
                    max="30"
                    value={configuracao.notificacaoAntecipada}
                    onChange={(e) =>
                      updateConfiguracao({
                        notificacaoAntecipada: parseInt(e.target.value) || 3,
                      })
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Notificar quando faltam X dias para o vencimento
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Recursos Avançados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="integracao-ia">Integração com IA</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite análise automática de publicações
                    </p>
                  </div>
                  <Switch
                    id="integracao-ia"
                    checked={configuracao.integracaoIA}
                    onCheckedChange={(checked) =>
                      updateConfiguracao({ integracaoIA: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="backup-local">Backup Local</Label>
                    <p className="text-sm text-muted-foreground">
                      Salva automaticamente no storage local
                    </p>
                  </div>
                  <Switch
                    id="backup-local"
                    checked={configuracao.backupLocal}
                    onCheckedChange={(checked) =>
                      updateConfiguracao({ backupLocal: checked })
                    }
                  />
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Todas as configurações são criptografadas e armazenadas
                    localmente conforme LGPD.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="regras" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5" />
                  Regras por Tipo de Processo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {Object.entries(regras.tiposProcesso).map(
                    ([key, processo]) => (
                      <Card key={key} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">
                            {processo.nome}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            {Object.entries(processo.prazos)
                              .slice(0, 3)
                              .map(([ato, regra]) => (
                                <div
                                  key={ato}
                                  className="flex justify-between text-sm"
                                >
                                  <span className="text-muted-foreground">
                                    {ato}
                                  </span>
                                  <Badge variant="secondary">
                                    {regra.prazo}{" "}
                                    {regra.unidade === "dias_uteis"
                                      ? "úteis"
                                      : "corridos"}
                                  </Badge>
                                </div>
                              ))}
                            {Object.keys(processo.prazos).length > 3 && (
                              <p className="text-xs text-muted-foreground">
                                +{Object.keys(processo.prazos).length - 3}{" "}
                                regras...
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Multiplicadores por Tipo de Parte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {Object.entries(regras.tiposPartes).map(([key, parte]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {parte.descricao}
                        </p>
                      </div>
                      <Badge
                        variant={
                          parte.multiplicador > 1 ? "destructive" : "default"
                        }
                      >
                        {parte.multiplicador}x
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advise" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Configuração API Advise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Insira sua API Key"
                    value={configAdvise.apiKey}
                    onChange={(e) =>
                      updateAdviseConfig({ apiKey: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endpoint">Endpoint</Label>
                  <Input
                    id="endpoint"
                    placeholder="https://api.advise.com.br/v1"
                    value={configAdvise.endpoint}
                    onChange={(e) =>
                      updateAdviseConfig({ endpoint: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interval-sync">
                    Intervalo de Sincronização (minutos)
                  </Label>
                  <Input
                    id="interval-sync"
                    type="number"
                    min="5"
                    max="1440"
                    value={configAdvise.intervalSync}
                    onChange={(e) =>
                      updateAdviseConfig({
                        intervalSync: parseInt(e.target.value) || 30,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status da Conexão</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTestarConexaoAdvise}
                      disabled={testingConnection || !configAdvise.apiKey}
                    >
                      {testingConnection ? "Testando..." : "Testar Conexão"}
                    </Button>
                    {connectionStatus === "success" && (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Conectado
                      </Badge>
                    )}
                    {connectionStatus === "error" && (
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Erro
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Filtros de Sincronização</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sincronização Ativa</Label>
                    <p className="text-sm text-muted-foreground">
                      Ativar sincronização automática com API Advise
                    </p>
                  </div>
                  <Switch
                    checked={configAdvise.ativo}
                    onCheckedChange={(checked) =>
                      updateAdviseConfig({ ativo: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Apenas Urgentes</Label>
                    <p className="text-sm text-muted-foreground">
                      Sincronizar apenas publicações urgentes
                    </p>
                  </div>
                  <Switch
                    checked={configAdvise.filtros.apenas_urgentes}
                    onCheckedChange={(checked) =>
                      updateAdviseConfig({
                        filtros: {
                          ...configAdvise.filtros,
                          apenas_urgentes: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Exportar Configurações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Baixe um backup de todas as regras e configurações em formato
                  JSON.
                </p>
                <Button onClick={handleExportarRegras} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Regras
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Importar Configurações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Restaure regras de um arquivo de backup anteriormente
                  exportado.
                </p>
                <Dialog
                  open={showImportDialog}
                  onOpenChange={setShowImportDialog}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Importar Regras
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Importar Regras Processuais</DialogTitle>
                      <DialogDescription>
                        Cole o conteúdo JSON do arquivo de backup abaixo:
                      </DialogDescription>
                    </DialogHeader>
                    <Textarea
                      placeholder="Cole o JSON aqui..."
                      value={importData}
                      onChange={(e) => setImportData(e.target.value)}
                      rows={10}
                    />
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowImportDialog(false)}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleImportarRegras}>Importar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Resetar Configurações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Atenção:</strong> Esta ação irá restaurar todas as
                    configurações para os valores padrão. Esta operação não pode
                    ser desfeita.
                  </AlertDescription>
                </Alert>
                <Button variant="destructive" onClick={handleResetarRegras}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restaurar Padrões
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
