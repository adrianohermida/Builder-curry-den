import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileX,
  FolderX,
  HardDrive,
  RefreshCw,
  Settings,
  X,
  Eye,
  EyeOff,
  Download,
  Archive,
  Trash2,
  Link,
  Database,
  Activity,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ValidationIssue {
  id: string;
  type:
    | "orphaned_folder"
    | "unlinked_files"
    | "storage_limit"
    | "failed_uploads"
    | "permission_errors"
    | "sync_errors"
    | "duplicate_files"
    | "broken_links";
  severity: "info" | "warning" | "error" | "critical";
  title: string;
  description: string;
  count: number;
  affectedItems: any[];
  autoFixable: boolean;
  recommendations: string[];
  lastDetected: string;
}

interface WatchdogSettings {
  enabled: boolean;
  checkInterval: number; // minutes
  autoFix: boolean;
  notifications: boolean;
  checkedTypes: {
    orphanedFolders: boolean;
    unlinkedFiles: boolean;
    storageLimit: boolean;
    failedUploads: boolean;
    permissionErrors: boolean;
    syncErrors: boolean;
    duplicateFiles: boolean;
    brokenLinks: boolean;
  };
}

interface GEDWatchdogProps {
  compact?: boolean;
  className?: string;
}

export function GEDWatchdog({ compact = false, className }: GEDWatchdogProps) {
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [settings, setSettings] = useState<WatchdogSettings>({
    enabled: true,
    checkInterval: 30,
    autoFix: false,
    notifications: true,
    checkedTypes: {
      orphanedFolders: true,
      unlinkedFiles: true,
      storageLimit: true,
      failedUploads: true,
      permissionErrors: true,
      syncErrors: true,
      duplicateFiles: true,
      brokenLinks: true,
    },
  });
  const [isRunning, setIsRunning] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [expandedIssues, setExpandedIssues] = useState<{
    [key: string]: boolean;
  }>({});
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("lawdesk_ged_watchdog_settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Run initial check
    runValidation();
  }, []);

  // Set up interval for automatic checks
  useEffect(() => {
    if (!settings.enabled) return;

    const interval = setInterval(
      () => {
        runValidation();
      },
      settings.checkInterval * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [settings.enabled, settings.checkInterval]);

  // Save settings when changed
  useEffect(() => {
    localStorage.setItem(
      "lawdesk_ged_watchdog_settings",
      JSON.stringify(settings),
    );
  }, [settings]);

  const runValidation = useCallback(async () => {
    setIsRunning(true);
    const foundIssues: ValidationIssue[] = [];

    try {
      const treeData = JSON.parse(
        localStorage.getItem("lawdesk_ged_tree") || "[]",
      );
      const files = JSON.parse(
        localStorage.getItem("lawdesk_ged_files") || "[]",
      );
      const crmClients = JSON.parse(
        localStorage.getItem("lawdesk-crm-clients") || "[]",
      );
      const crmProcesses = JSON.parse(
        localStorage.getItem("lawdesk-crm-processes") || "[]",
      );
      const crmContracts = JSON.parse(
        localStorage.getItem("lawdesk-crm-contracts") || "[]",
      );

      // Check for orphaned folders
      if (settings.checkedTypes.orphanedFolders) {
        const orphanedFolders = findOrphanedFolders(treeData, [
          ...crmClients,
          ...crmProcesses,
          ...crmContracts,
        ]);
        if (orphanedFolders.length > 0) {
          foundIssues.push({
            id: "orphaned_folders",
            type: "orphaned_folder",
            severity: "warning",
            title: "Pastas Órfãs Detectadas",
            description: `${orphanedFolders.length} pasta(s) não possuem vinculação com entidades do CRM`,
            count: orphanedFolders.length,
            affectedItems: orphanedFolders,
            autoFixable: false,
            recommendations: [
              "Revisar manualmente cada pasta órfã",
              "Verificar se as entidades do CRM foram excluídas",
              "Arquivar ou reorganizar pastas não utilizadas",
            ],
            lastDetected: new Date().toISOString(),
          });
        }
      }

      // Check for unlinked files
      if (settings.checkedTypes.unlinkedFiles) {
        const unlinkedFiles = files.filter((file: any) => !file.associatedWith);
        if (unlinkedFiles.length > 0) {
          foundIssues.push({
            id: "unlinked_files",
            type: "unlinked_files",
            severity: "info",
            title: "Arquivos Sem Vinculação",
            description: `${unlinkedFiles.length} arquivo(s) não estão vinculados a nenhuma entidade`,
            count: unlinkedFiles.length,
            affectedItems: unlinkedFiles,
            autoFixable: true,
            recommendations: [
              "Vincular arquivos a clientes, processos ou contratos",
              "Organizar arquivos em pastas apropriadas",
              "Implementar regras automáticas de vinculação",
            ],
            lastDetected: new Date().toISOString(),
          });
        }
      }

      // Check storage limit
      if (settings.checkedTypes.storageLimit) {
        const totalSize = files.reduce(
          (sum: number, file: any) => sum + (file.size || 0),
          0,
        );
        const maxStorage = 5 * 1024 * 1024 * 1024; // 5GB simulado
        const usagePercent = (totalSize / maxStorage) * 100;

        if (usagePercent > 80) {
          foundIssues.push({
            id: "storage_limit",
            type: "storage_limit",
            severity: usagePercent > 95 ? "critical" : "warning",
            title: "Limite de Armazenamento",
            description: `${usagePercent.toFixed(1)}% do armazenamento está sendo usado`,
            count: 1,
            affectedItems: [{ totalSize, maxStorage, usagePercent }],
            autoFixable: false,
            recommendations: [
              "Arquivar documentos antigos",
              "Comprimir arquivos grandes",
              "Revisar duplicatas",
              "Considerar upgrade do plano",
            ],
            lastDetected: new Date().toISOString(),
          });
        }
      }

      // Check for failed uploads (simulated)
      if (settings.checkedTypes.failedUploads) {
        const failedUploads = JSON.parse(
          localStorage.getItem("lawdesk_ged_failed_uploads") || "[]",
        );
        if (failedUploads.length > 0) {
          foundIssues.push({
            id: "failed_uploads",
            type: "failed_uploads",
            severity: "error",
            title: "Uploads Falharam",
            description: `${failedUploads.length} arquivo(s) falharam no upload`,
            count: failedUploads.length,
            affectedItems: failedUploads,
            autoFixable: true,
            recommendations: [
              "Tentar reenviar arquivos",
              "Verificar conexão de internet",
              "Reduzir tamanho dos arquivos",
            ],
            lastDetected: new Date().toISOString(),
          });
        }
      }

      // Check for duplicate files
      if (settings.checkedTypes.duplicateFiles) {
        const duplicates = findDuplicateFiles(files);
        if (duplicates.length > 0) {
          foundIssues.push({
            id: "duplicate_files",
            type: "duplicate_files",
            severity: "info",
            title: "Arquivos Duplicados",
            description: `${duplicates.length} arquivo(s) duplicados encontrados`,
            count: duplicates.length,
            affectedItems: duplicates,
            autoFixable: true,
            recommendations: [
              "Revisar arquivos duplicados",
              "Manter apenas uma versão",
              "Implementar validação de duplicatas no upload",
            ],
            lastDetected: new Date().toISOString(),
          });
        }
      }

      // Check for permission errors (simulated)
      if (settings.checkedTypes.permissionErrors) {
        const permissionErrors = files.filter(
          (file: any) => file.metadata?.permissionError || Math.random() < 0.02, // 2% chance for demo
        );
        if (permissionErrors.length > 0) {
          foundIssues.push({
            id: "permission_errors",
            type: "permission_errors",
            severity: "warning",
            title: "Erros de Permissão",
            description: `${permissionErrors.length} arquivo(s) com problemas de acesso`,
            count: permissionErrors.length,
            affectedItems: permissionErrors,
            autoFixable: false,
            recommendations: [
              "Verificar permissões de usuário",
              "Revisar configurações de acesso",
              "Contatar administrador do sistema",
            ],
            lastDetected: new Date().toISOString(),
          });
        }
      }

      setIssues(foundIssues);
      setLastCheck(new Date());

      // Show notifications if enabled
      if (settings.notifications && foundIssues.length > 0) {
        const criticalIssues = foundIssues.filter(
          (i) => i.severity === "critical",
        );
        const errorIssues = foundIssues.filter((i) => i.severity === "error");

        if (criticalIssues.length > 0) {
          toast.error(
            `${criticalIssues.length} problema(s) crítico(s) detectado(s) no GED`,
          );
        } else if (errorIssues.length > 0) {
          toast.warning(`${errorIssues.length} erro(s) encontrado(s) no GED`);
        }
      }

      // Auto-fix if enabled
      if (settings.autoFix) {
        await autoFixIssues(foundIssues.filter((i) => i.autoFixable));
      }
    } catch (error) {
      console.error("Erro na validação do Watchdog:", error);
      toast.error("Erro ao executar validação do sistema");
    } finally {
      setIsRunning(false);
    }
  }, [settings]);

  const findOrphanedFolders = (treeData: any[], crmEntities: any[]): any[] => {
    const orphaned: any[] = [];
    const entityIds = new Set(crmEntities.map((e) => e.id));

    const checkFolder = (folder: any) => {
      if (
        folder.metadata?.entityId &&
        !entityIds.has(folder.metadata.entityId)
      ) {
        orphaned.push(folder);
      }
      if (folder.children) {
        folder.children.forEach(checkFolder);
      }
    };

    treeData.forEach(checkFolder);
    return orphaned;
  };

  const findDuplicateFiles = (files: any[]): any[] => {
    const fileMap = new Map();
    const duplicates: any[] = [];

    files.forEach((file) => {
      const key = `${file.name}_${file.size}`;
      if (fileMap.has(key)) {
        duplicates.push(file);
      } else {
        fileMap.set(key, file);
      }
    });

    return duplicates;
  };

  const autoFixIssues = async (fixableIssues: ValidationIssue[]) => {
    for (const issue of fixableIssues) {
      try {
        switch (issue.type) {
          case "unlinked_files":
            // Auto-link files based on folder location
            await autoLinkFiles(issue.affectedItems);
            break;
          case "failed_uploads":
            // Retry failed uploads
            await retryFailedUploads(issue.affectedItems);
            break;
          case "duplicate_files":
            // Handle duplicates (keep newest)
            await handleDuplicates(issue.affectedItems);
            break;
        }
        toast.success(`Auto-correção aplicada: ${issue.title}`);
      } catch (error) {
        console.error(`Erro na auto-correção de ${issue.type}:`, error);
      }
    }
  };

  const autoLinkFiles = async (files: any[]) => {
    // Implementation for auto-linking files
    console.log("Auto-linking files:", files);
  };

  const retryFailedUploads = async (uploads: any[]) => {
    // Implementation for retrying uploads
    console.log("Retrying uploads:", uploads);
  };

  const handleDuplicates = async (duplicates: any[]) => {
    // Implementation for handling duplicates
    console.log("Handling duplicates:", duplicates);
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      info: "text-blue-600 bg-blue-50 border-blue-200",
      warning: "text-yellow-600 bg-yellow-50 border-yellow-200",
      error: "text-red-600 bg-red-50 border-red-200",
      critical: "text-red-900 bg-red-100 border-red-300",
    };
    return colors[severity as keyof typeof colors] || colors.info;
  };

  const getSeverityIcon = (severity: string) => {
    const icons = {
      info: CheckCircle,
      warning: AlertTriangle,
      error: X,
      critical: AlertTriangle,
    };
    return icons[severity as keyof typeof icons] || CheckCircle;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  const issuesBySevetiry = {
    critical: issues.filter((i) => i.severity === "critical"),
    error: issues.filter((i) => i.severity === "error"),
    warning: issues.filter((i) => i.severity === "warning"),
    info: issues.filter((i) => i.severity === "info"),
  };

  if (compact) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 rounded-lg ${
                  issues.length === 0
                    ? "bg-green-50"
                    : issuesBySevetiry.critical.length > 0
                      ? "bg-red-50"
                      : issuesBySevetiry.error.length > 0
                        ? "bg-red-50"
                        : "bg-yellow-50"
                }`}
              >
                {isRunning ? (
                  <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                ) : issues.length === 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Shield className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  {isRunning
                    ? "Verificando..."
                    : issues.length === 0
                      ? "Sistema OK"
                      : `${issues.length} problema(s)`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {lastCheck
                    ? `Última verificação: ${formatDate(lastCheck.toISOString())}`
                    : "Nunca verificado"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => runValidation()}
              disabled={isRunning}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRunning ? "animate-spin" : ""}`}
              />
            </Button>
          </div>

          {issues.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {issuesBySevetiry.critical.length > 0 && (
                <Badge className="bg-red-100 text-red-800">
                  {issuesBySevetiry.critical.length} crítico
                </Badge>
              )}
              {issuesBySevetiry.error.length > 0 && (
                <Badge className="bg-red-100 text-red-800">
                  {issuesBySevetiry.error.length} erro
                </Badge>
              )}
              {issuesBySevetiry.warning.length > 0 && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  {issuesBySevetiry.warning.length} aviso
                </Badge>
              )}
              {issuesBySevetiry.info.length > 0 && (
                <Badge className="bg-blue-100 text-blue-800">
                  {issuesBySevetiry.info.length} info
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Watchdog GED</span>
              <Badge variant={settings.enabled ? "default" : "secondary"}>
                {settings.enabled ? "Ativo" : "Inativo"}
              </Badge>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => runValidation()}
                disabled={isRunning}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRunning ? "animate-spin" : ""} mr-2`}
                />
                {isRunning ? "Verificando..." : "Verificar Agora"}
              </Button>
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configurações do Watchdog</DialogTitle>
                    <DialogDescription>
                      Configure o monitoramento automático do sistema GED
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enabled">Monitoramento Ativo</Label>
                      <Switch
                        id="enabled"
                        checked={settings.enabled}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({ ...prev, enabled: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications">Notificações</Label>
                      <Switch
                        id="notifications"
                        checked={settings.notifications}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            notifications: checked,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autofix">Auto-correção</Label>
                      <Switch
                        id="autofix"
                        checked={settings.autoFix}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({ ...prev, autoFix: checked }))
                        }
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {lastCheck ? (
              <>Última verificação: {formatDate(lastCheck.toISOString())}</>
            ) : (
              "Nenhuma verificação executada ainda"
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {issuesBySevetiry.critical.length}
              </div>
              <div className="text-sm text-muted-foreground">Críticos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">
                {issuesBySevetiry.error.length}
              </div>
              <div className="text-sm text-muted-foreground">Erros</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {issuesBySevetiry.warning.length}
              </div>
              <div className="text-sm text-muted-foreground">Avisos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {issuesBySevetiry.info.length}
              </div>
              <div className="text-sm text-muted-foreground">Informações</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      {issues.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Problemas Detectados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence>
              {issues.map((issue) => {
                const Icon = getSeverityIcon(issue.severity);
                const isExpanded = expandedIssues[issue.id];

                return (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Collapsible
                      open={isExpanded}
                      onOpenChange={(open) =>
                        setExpandedIssues((prev) => ({
                          ...prev,
                          [issue.id]: open,
                        }))
                      }
                    >
                      <Card
                        className={`border-l-4 ${getSeverityColor(issue.severity)}`}
                      >
                        <CollapsibleTrigger asChild>
                          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Icon className="h-5 w-5" />
                                <div>
                                  <CardTitle className="text-base">
                                    {issue.title}
                                  </CardTitle>
                                  <p className="text-sm text-muted-foreground">
                                    {issue.description}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary">{issue.count}</Badge>
                                {issue.autoFixable && (
                                  <Badge className="bg-green-100 text-green-800">
                                    Auto-corrigível
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="pt-0">
                            <div className="space-y-4">
                              <Separator />

                              <div>
                                <h5 className="font-medium mb-2">
                                  Recomendações:
                                </h5>
                                <ul className="text-sm space-y-1">
                                  {issue.recommendations.map((rec, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start space-x-2"
                                    >
                                      <span className="text-muted-foreground">
                                        •
                                      </span>
                                      <span>{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="text-xs text-muted-foreground">
                                  Detectado em: {formatDate(issue.lastDetected)}
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      // Implementation for viewing details
                                      console.log("View details:", issue);
                                    }}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Ver Detalhes
                                  </Button>
                                  {issue.autoFixable && (
                                    <Button
                                      size="sm"
                                      onClick={() => autoFixIssues([issue])}
                                    >
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Auto-Corrigir
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
            <h3 className="text-lg font-medium mb-2">
              Sistema em Perfeito Estado
            </h3>
            <p className="text-muted-foreground">
              Nenhum problema detectado no sistema GED Jurídico
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
