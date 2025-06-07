import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch,
  Clock,
  User,
  FileText,
  Download,
  Upload,
  RotateCcw,
  Save,
  AlertTriangle,
  CheckCircle,
  Archive,
  Tag,
  Calendar,
  Hash,
  Activity,
  Plus,
  Minus,
  Eye,
  Copy,
  Trash2,
  RefreshCw,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import ActionPlanService from "@/services/actionPlanService";
import {
  ActionPlanState,
  ActionPlanVersion as ActionPlanVersionType,
  ModuleName,
} from "@/types/actionPlan";

interface VersionControlProps {
  onVersionChange?: (version: ActionPlanVersionType) => void;
}

export default function VersionControl({
  onVersionChange,
}: VersionControlProps) {
  const [state, setState] = useState<ActionPlanState | null>(null);
  const [isCreateVersionOpen, setIsCreateVersionOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] =
    useState<ActionPlanVersionType | null>(null);
  const [versionForm, setVersionForm] = useState({
    resumo: "",
    usuario: "dev" as "IA" | "dev" | "admin",
  });
  const [exportFormat, setExportFormat] = useState<"json" | "csv" | "pdf">(
    "json",
  );

  const service = useMemo(() => ActionPlanService.getInstance(), []);

  useEffect(() => {
    const unsubscribe = service.subscribe((newState) => {
      setState(newState);
    });

    // Initial load
    setState(service.getState());

    return unsubscribe;
  }, [service]);

  // Get version timeline
  const versionTimeline = useMemo(() => {
    if (!state) return [];

    const allVersions = [state.versao_atual, ...state.historico_versoes];
    return allVersions.sort(
      (a, b) =>
        new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime(),
    );
  }, [state]);

  // Version statistics
  const versionStats = useMemo(() => {
    if (!state) return null;

    const totalVersions = versionTimeline.length;
    const activeVersions = versionTimeline.filter(
      (v) => v.status === "ativa",
    ).length;
    const archivedVersions = versionTimeline.filter(
      (v) => v.status === "archivada",
    ).length;

    const totalTasksAdded = versionTimeline.reduce(
      (sum, v) => sum + v.total_tarefas_adicionadas,
      0,
    );
    const totalTasksRemoved = versionTimeline.reduce(
      (sum, v) => sum + v.total_tarefas_removidas,
      0,
    );

    const versionsByUser = versionTimeline.reduce(
      (acc, v) => {
        acc[v.usuario] = (acc[v.usuario] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalVersions,
      activeVersions,
      archivedVersions,
      totalTasksAdded,
      totalTasksRemoved,
      versionsByUser,
    };
  }, [versionTimeline]);

  const handleCreateVersion = () => {
    if (!versionForm.resumo.trim()) return;

    const newVersion = service.createVersion(
      versionForm.resumo,
      versionForm.usuario,
    );

    setVersionForm({ resumo: "", usuario: "dev" });
    setIsCreateVersionOpen(false);

    onVersionChange?.(newVersion);
  };

  const handleExport = () => {
    const data = service.exportData({
      formato: exportFormat,
      escopo: "completo",
      incluir_logs: true,
      incluir_historico: true,
    });

    const mimeTypes = {
      json: "application/json",
      csv: "text/csv",
      pdf: "application/pdf",
    };

    const blob = new Blob([data], { type: mimeTypes[exportFormat] });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lawdesk-action-plan-${state?.versao_atual.versao}-${new Date().toISOString().split("T")[0]}.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsExportOpen(false);
  };

  const getVersionStatusColor = (status: string) => {
    switch (status) {
      case "ativa":
        return "bg-green-100 text-green-800 border-green-200";
      case "archivada":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "rollback":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getUserColor = (usuario: string) => {
    switch (usuario) {
      case "IA":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "dev":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "admin":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getUserIcon = (usuario: string) => {
    switch (usuario) {
      case "IA":
        return <RefreshCw className="h-3 w-3" />;
      case "dev":
        return <User className="h-3 w-3" />;
      case "admin":
        return <User className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  if (!state || !versionStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Carregando controle de versão...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">🔁 Controle de Versão</h2>
          <p className="text-muted-foreground">
            Versão atual: {state.versao_atual.versao} • {versionTimeline.length}{" "}
            versões registradas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Exportar Plano de Ação</DialogTitle>
                <DialogDescription>
                  Escolha o formato para exportar o plano de ação atual
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label>Formato</Label>
                  <Select
                    value={exportFormat}
                    onValueChange={(value: "json" | "csv" | "pdf") =>
                      setExportFormat(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON (Estruturado)</SelectItem>
                      <SelectItem value="csv">CSV (Planilha)</SelectItem>
                      <SelectItem value="pdf">PDF (Relatório)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsExportOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isCreateVersionOpen}
            onOpenChange={setIsCreateVersionOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                Nova Versão
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Versão</DialogTitle>
                <DialogDescription>
                  Crie um novo ponto de versionamento para o plano de ação
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="resumo">Resumo das Alterações</Label>
                  <Textarea
                    id="resumo"
                    value={versionForm.resumo}
                    onChange={(e) =>
                      setVersionForm((prev) => ({
                        ...prev,
                        resumo: e.target.value,
                      }))
                    }
                    placeholder="Descreva as principais alterações desta versão..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="usuario">Tipo de Usuário</Label>
                  <Select
                    value={versionForm.usuario}
                    onValueChange={(value: "IA" | "dev" | "admin") =>
                      setVersionForm((prev) => ({ ...prev, usuario: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dev">Desenvolvedor</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="IA">Sistema IA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateVersionOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleCreateVersion}>
                  <Save className="h-4 w-4 mr-2" />
                  Criar Versão
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Version Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Versões
                </p>
                <p className="text-2xl font-bold">
                  {versionStats.totalVersions}
                </p>
              </div>
              <GitBranch className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <Badge className={getVersionStatusColor("ativa")}>
                {versionStats.activeVersions} ativa
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tarefas Adicionadas
                </p>
                <p className="text-2xl font-bold text-success">
                  +{versionStats.totalTasksAdded}
                </p>
              </div>
              <Plus className="h-8 w-8 text-success" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary">Total de incrementos</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tarefas Removidas
                </p>
                <p className="text-2xl font-bold text-destructive">
                  -{versionStats.totalTasksRemoved}
                </p>
              </div>
              <Minus className="h-8 w-8 text-destructive" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary">Total de decrementos</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Versão Atual
                </p>
                <p className="text-2xl font-bold">
                  {state.versao_atual.versao}
                </p>
              </div>
              <Tag className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <Badge className={getUserColor(state.versao_atual.usuario)}>
                {state.versao_atual.usuario}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Version Details */}
      <Card className="card-enhanced border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Versão Ativa: {state.versao_atual.versao}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Criada em:</span>
                <span>
                  {new Date(state.versao_atual.data_criacao).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                {getUserIcon(state.versao_atual.usuario)}
                <span className="font-medium">Criada por:</span>
                <Badge className={getUserColor(state.versao_atual.usuario)}>
                  {state.versao_atual.usuario}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Hash:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {state.versao_atual.hash_conteudo}
                </code>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="font-medium text-sm">
                  Resumo das Alterações:
                </span>
                <p className="text-sm text-muted-foreground mt-1">
                  {state.versao_atual.resumo_alteracoes}
                </p>
              </div>

              <div className="flex flex-wrap gap-1">
                <span className="font-medium text-sm">Módulos Afetados:</span>
                {state.versao_atual.modulos_afetados
                  .slice(0, 3)
                  .map((modulo, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {modulo}
                    </Badge>
                  ))}
                {state.versao_atual.modulos_afetados.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{state.versao_atual.modulos_afetados.length - 3} mais
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Version Timeline */}
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Histórico de Versões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {versionTimeline.map((version, index) => (
                <motion.div
                  key={`${version.versao}-${version.data_criacao}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg p-4 transition-all hover:shadow-sm ${
                    version.status === "ativa"
                      ? "border-primary/50 bg-primary/5"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{version.versao}</h4>
                        <Badge
                          className={getVersionStatusColor(version.status)}
                        >
                          {version.status}
                        </Badge>
                        <Badge className={getUserColor(version.usuario)}>
                          {getUserIcon(version.usuario)}
                          <span className="ml-1">{version.usuario}</span>
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {version.resumo_alteracoes}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(version.data_criacao).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(version.data_criacao).toLocaleTimeString()}
                        </div>
                        {version.total_tarefas_adicionadas > 0 && (
                          <div className="flex items-center gap-1 text-success">
                            <Plus className="h-3 w-3" />
                            {version.total_tarefas_adicionadas}
                          </div>
                        )}
                        {version.total_tarefas_removidas > 0 && (
                          <div className="flex items-center gap-1 text-destructive">
                            <Minus className="h-3 w-3" />
                            {version.total_tarefas_removidas}
                          </div>
                        )}
                      </div>

                      {version.modulos_afetados.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {version.modulos_afetados
                            .slice(0, 4)
                            .map((modulo, modIndex) => (
                              <Badge
                                key={modIndex}
                                variant="outline"
                                className="text-xs"
                              >
                                {modulo}
                              </Badge>
                            ))}
                          {version.modulos_afetados.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{version.modulos_afetados.length - 4}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedVersion(version)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Ver detalhes</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                version.hash_conteudo,
                              );
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copiar hash</TooltipContent>
                      </Tooltip>

                      {version.status === "ativa" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const data = service.exportData({
                                  formato: "json",
                                  escopo: "completo",
                                });
                                const blob = new Blob([data], {
                                  type: "application/json",
                                });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `backup-${version.versao}.json`;
                                a.click();
                                URL.revokeObjectURL(url);
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Fazer backup</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Version Details Dialog */}
      <Dialog
        open={!!selectedVersion}
        onOpenChange={() => setSelectedVersion(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Detalhes da Versão {selectedVersion?.versao}
            </DialogTitle>
            <DialogDescription>
              Informações completas sobre esta versão do plano de ação
            </DialogDescription>
          </DialogHeader>

          {selectedVersion && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Badge
                    className={getVersionStatusColor(selectedVersion.status)}
                  >
                    {selectedVersion.status}
                  </Badge>
                </div>
                <div>
                  <Label>Criado por</Label>
                  <Badge className={getUserColor(selectedVersion.usuario)}>
                    {selectedVersion.usuario}
                  </Badge>
                </div>
              </div>

              <div>
                <Label>Data de Criação</Label>
                <p className="text-sm">
                  {new Date(selectedVersion.data_criacao).toLocaleString()}
                </p>
              </div>

              <div>
                <Label>Resumo das Alterações</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedVersion.resumo_alteracoes}
                </p>
              </div>

              <div>
                <Label>Hash do Conteúdo</Label>
                <code className="text-xs bg-muted px-2 py-1 rounded block">
                  {selectedVersion.hash_conteudo}
                </code>
              </div>

              <div>
                <Label>Módulos Afetados</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedVersion.modulos_afetados.map((modulo, index) => (
                    <Badge key={index} variant="outline">
                      {modulo}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tarefas Adicionadas</Label>
                  <p className="text-lg font-bold text-success">
                    +{selectedVersion.total_tarefas_adicionadas}
                  </p>
                </div>
                <div>
                  <Label>Tarefas Removidas</Label>
                  <p className="text-lg font-bold text-destructive">
                    -{selectedVersion.total_tarefas_removidas}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedVersion(null)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Version Stats by User */}
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Contribuições por Usuário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(versionStats.versionsByUser).map(
              ([usuario, count]) => (
                <div
                  key={usuario}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {getUserIcon(usuario)}
                    <span className="font-medium">{usuario}</span>
                    <Badge className={getUserColor(usuario)}>{usuario}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {count} versões
                    </span>
                    <Badge variant="outline">
                      {Math.round((count / versionStats.totalVersions) * 100)}%
                    </Badge>
                  </div>
                </div>
              ),
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
