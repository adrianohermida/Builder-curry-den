import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Filter,
  Search,
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Clock,
  User,
  Bot,
  Settings,
  Database,
  Globe,
  Code,
  Smartphone,
  Eye,
  Trash2,
  Calendar,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

import ActionPlanService from "@/services/actionPlanService";
import {
  ActionPlanState,
  ExecutionLog,
  LogLevel,
  ModuleName,
} from "@/types/actionPlan";

type SortField = "timestamp" | "modulo" | "resultado" | "origem";
type SortDirection = "asc" | "desc";

interface LogFilter {
  search: string;
  resultado: LogLevel | "all";
  origem: "manual" | "IA" | "automatizada" | "all";
  modulo: ModuleName | "all";
  dateRange: {
    start: string;
    end: string;
  };
}

function LogViewer() {
  const [state, setState] = useState<ActionPlanState | null>(null);
  const [selectedLog, setSelectedLog] = useState<ExecutionLog | null>(null);
  const [filter, setFilter] = useState<LogFilter>({
    search: "",
    resultado: "all",
    origem: "all",
    modulo: "all",
    dateRange: {
      start: "",
      end: "",
    },
  });
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [selectedLogs, setSelectedLogs] = useState<Set<string>>(new Set());

  const service = useMemo(() => ActionPlanService.getInstance(), []);

  useEffect(() => {
    const unsubscribe = service.subscribe((newState) => {
      setState(newState);
    });

    // Initial load
    setState(service.getState());

    return unsubscribe;
  }, [service]);

  // Filter and sort logs
  const filteredLogs = useMemo(() => {
    if (!state) return [];

    let logs = [...state.logs_execucao];

    // Search filter
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      logs = logs.filter(
        (log) =>
          log.acao_executada.toLowerCase().includes(searchLower) ||
          log.detalhes.some(
            (detail) =>
              detail.mensagem.toLowerCase().includes(searchLower) ||
              detail.recurso.toLowerCase().includes(searchLower),
          ),
      );
    }

    // Result filter
    if (filter.resultado !== "all") {
      logs = logs.filter((log) => log.resultado === filter.resultado);
    }

    // Origin filter
    if (filter.origem !== "all") {
      logs = logs.filter((log) => log.origem === filter.origem);
    }

    // Module filter
    if (filter.modulo !== "all") {
      logs = logs.filter((log) => log.modulo_afetado === filter.modulo);
    }

    // Date range filter
    if (filter.dateRange.start) {
      logs = logs.filter((log) => log.timestamp >= filter.dateRange.start);
    }
    if (filter.dateRange.end) {
      logs = logs.filter((log) => log.timestamp <= filter.dateRange.end);
    }

    // Sort logs
    logs.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "timestamp":
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
          break;
        case "modulo":
          aValue = a.modulo_afetado;
          bValue = b.modulo_afetado;
          break;
        case "resultado":
          aValue = a.resultado;
          bValue = b.resultado;
          break;
        case "origem":
          aValue = a.origem;
          bValue = b.origem;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return logs;
  }, [state, filter, sortField, sortDirection]);

  // Pagination
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  // Log statistics
  const logStats = useMemo(() => {
    if (!state) return null;

    const totalLogs = state.logs_execucao.length;
    const successLogs = state.logs_execucao.filter(
      (log) => log.resultado === "sucesso",
    ).length;
    const errorLogs = state.logs_execucao.filter(
      (log) => log.resultado === "erro",
    ).length;
    const warningLogs = state.logs_execucao.filter(
      (log) => log.resultado === "warning",
    ).length;

    const logsByOrigin = state.logs_execucao.reduce(
      (acc, log) => {
        acc[log.origem] = (acc[log.origem] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const logsByModule = state.logs_execucao.reduce(
      (acc, log) => {
        acc[log.modulo_afetado] = (acc[log.modulo_afetado] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const avgExecutionTime =
      totalLogs > 0
        ? state.logs_execucao.reduce(
            (sum, log) => sum + log.tempo_execucao,
            0,
          ) / totalLogs
        : 0;

    return {
      totalLogs,
      successLogs,
      errorLogs,
      warningLogs,
      logsByOrigin,
      logsByModule,
      avgExecutionTime,
      successRate: totalLogs > 0 ? (successLogs / totalLogs) * 100 : 0,
    };
  }, [state]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleLogSelection = (logId: string, checked: boolean) => {
    const newSelection = new Set(selectedLogs);
    if (checked) {
      newSelection.add(logId);
    } else {
      newSelection.delete(logId);
    }
    setSelectedLogs(newSelection);
  };

  const handleBulkDelete = () => {
    if (selectedLogs.size === 0) return;

    if (window.confirm(`Excluir ${selectedLogs.size} log(s) selecionado(s)?`)) {
      // Note: In a real implementation, you'd call a service method to delete logs
      console.log("Deleting logs:", Array.from(selectedLogs));
      setSelectedLogs(new Set());
    }
  };

  const handleExportLogs = () => {
    const logsToExport =
      selectedLogs.size > 0
        ? filteredLogs.filter((log) => selectedLogs.has(log.id))
        : filteredLogs;

    const csvContent = [
      "Timestamp,Ação,Resultado,Origem,Módulo,Tempo Execução,Detalhes",
      ...logsToExport.map((log) =>
        [
          log.timestamp,
          log.acao_executada,
          log.resultado,
          log.origem,
          log.modulo_afetado,
          log.tempo_execucao,
          log.detalhes.map((d) => d.mensagem).join("; "),
        ]
          .map((field) => `"${field}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lawdesk-logs-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getResultIcon = (resultado: string) => {
    switch (resultado) {
      case "sucesso":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "erro":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getResultColor = (resultado: string) => {
    switch (resultado) {
      case "sucesso":
        return "bg-green-100 text-green-800 border-green-200";
      case "erro":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getOriginIcon = (origem: string) => {
    switch (origem) {
      case "IA":
        return <Bot className="h-4 w-4" />;
      case "manual":
        return <User className="h-4 w-4" />;
      case "automatizada":
        return <Settings className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getOriginColor = (origem: string) => {
    switch (origem) {
      case "IA":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "manual":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "automatizada":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDetailTypeIcon = (tipo: string) => {
    switch (tipo) {
      case "arquivo":
        return <FileText className="h-3 w-3" />;
      case "banco":
        return <Database className="h-3 w-3" />;
      case "api":
        return <Globe className="h-3 w-3" />;
      case "ui":
        return <Smartphone className="h-3 w-3" />;
      case "integracao":
        return <Code className="h-3 w-3" />;
      default:
        return <Info className="h-3 w-3" />;
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    );
  };

  if (!state || !logStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Carregando logs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            📊 Logs de Execução
          </h2>
          <p className="text-muted-foreground">
            {logStats.totalLogs} logs registrados •{" "}
            {Math.round(logStats.successRate)}% taxa de sucesso
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedLogs.size > 0 && (
            <>
              <Button variant="outline" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir ({selectedLogs.size})
              </Button>
              <Separator orientation="vertical" className="h-6" />
            </>
          )}
          <Button variant="outline" onClick={handleExportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Log Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Logs
                </p>
                <p className="text-2xl font-bold">{logStats.totalLogs}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary">
                {logStats.avgExecutionTime.toFixed(0)}ms médio
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Sucessos
                </p>
                <p className="text-2xl font-bold text-success">
                  {logStats.successLogs}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800">
                {Math.round(logStats.successRate)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Erros
                </p>
                <p className="text-2xl font-bold text-destructive">
                  {logStats.errorLogs}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <div className="mt-2">
              <Badge className="bg-red-100 text-red-800">
                {logStats.totalLogs > 0
                  ? Math.round((logStats.errorLogs / logStats.totalLogs) * 100)
                  : 0}
                %
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avisos
                </p>
                <p className="text-2xl font-bold text-warning">
                  {logStats.warningLogs}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
            <div className="mt-2">
              <Badge className="bg-yellow-100 text-yellow-800">
                {logStats.totalLogs > 0
                  ? Math.round(
                      (logStats.warningLogs / logStats.totalLogs) * 100,
                    )
                  : 0}
                %
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="card-enhanced">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar logs..."
                  value={filter.search}
                  onChange={(e) =>
                    setFilter((prev) => ({ ...prev, search: e.target.value }))
                  }
                />
              </div>
            </div>

            <Select
              value={filter.resultado}
              onValueChange={(value: LogLevel | "all") =>
                setFilter((prev) => ({ ...prev, resultado: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Resultados</SelectItem>
                <SelectItem value="sucesso">Sucesso</SelectItem>
                <SelectItem value="erro">Erro</SelectItem>
                <SelectItem value="warning">Aviso</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filter.origem}
              onValueChange={(
                value: "manual" | "IA" | "automatizada" | "all",
              ) => setFilter((prev) => ({ ...prev, origem: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Origens</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="IA">IA</SelectItem>
                <SelectItem value="automatizada">Automática</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filter.modulo}
              onValueChange={(value: ModuleName | "all") =>
                setFilter((prev) => ({ ...prev, modulo: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Módulos</SelectItem>
                <SelectItem value="CRM Jurídico">CRM Jurídico</SelectItem>
                <SelectItem value="IA Jurídica">IA Jurídica</SelectItem>
                <SelectItem value="GED">GED</SelectItem>
                <SelectItem value="Tarefas">Tarefas</SelectItem>
                <SelectItem value="Publicações">Publicações</SelectItem>
                <SelectItem value="Atendimento">Atendimento</SelectItem>
                <SelectItem value="Agenda">Agenda</SelectItem>
                <SelectItem value="Financeiro">Financeiro</SelectItem>
                <SelectItem value="Configurações">Configurações</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter Summary */}
          {(filter.search ||
            filter.resultado !== "all" ||
            filter.origem !== "all" ||
            filter.modulo !== "all") && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Filtros ativos:
              </span>
              {filter.search && (
                <Badge variant="outline">Busca: "{filter.search}"</Badge>
              )}
              {filter.resultado !== "all" && (
                <Badge variant="outline">Resultado: {filter.resultado}</Badge>
              )}
              {filter.origem !== "all" && (
                <Badge variant="outline">Origem: {filter.origem}</Badge>
              )}
              {filter.modulo !== "all" && (
                <Badge variant="outline">Módulo: {filter.modulo}</Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setFilter({
                    search: "",
                    resultado: "all",
                    origem: "all",
                    modulo: "all",
                    dateRange: { start: "", end: "" },
                  })
                }
              >
                Limpar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="card-enhanced">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Logs de Execução ({filteredLogs.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 text-left">
                    <Checkbox
                      checked={
                        selectedLogs.size === paginatedLogs.length &&
                        paginatedLogs.length > 0
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedLogs(
                            new Set(paginatedLogs.map((log) => log.id)),
                          );
                        } else {
                          setSelectedLogs(new Set());
                        }
                      }}
                    />
                  </th>
                  <th className="p-3 text-left">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("timestamp")}
                      className="font-medium"
                    >
                      Timestamp
                      {getSortIcon("timestamp")}
                    </Button>
                  </th>
                  <th className="p-3 text-left">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("origem")}
                      className="font-medium"
                    >
                      Origem
                      {getSortIcon("origem")}
                    </Button>
                  </th>
                  <th className="p-3 text-left">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("modulo")}
                      className="font-medium"
                    >
                      Módulo
                      {getSortIcon("modulo")}
                    </Button>
                  </th>
                  <th className="p-3 text-left">Ação</th>
                  <th className="p-3 text-left">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("resultado")}
                      className="font-medium"
                    >
                      Resultado
                      {getSortIcon("resultado")}
                    </Button>
                  </th>
                  <th className="p-3 text-left">Tempo</th>
                  <th className="p-3 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginatedLogs.map((log, index) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-3">
                        <Checkbox
                          checked={selectedLogs.has(log.id)}
                          onCheckedChange={(checked) =>
                            handleLogSelection(log.id, checked as boolean)
                          }
                        />
                      </td>
                      <td className="p-3 text-sm">
                        <div>
                          {new Date(log.timestamp).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={getOriginColor(log.origem)}>
                          {getOriginIcon(log.origem)}
                          <span className="ml-1">{log.origem}</span>
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-xs">
                          {log.modulo_afetado}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm max-w-xs truncate">
                        {log.acao_executada}
                      </td>
                      <td className="p-3">
                        <Badge className={getResultColor(log.resultado)}>
                          {getResultIcon(log.resultado)}
                          <span className="ml-1">{log.resultado}</span>
                        </Badge>
                      </td>
                      <td className="p-3 text-sm">{log.tempo_execucao}ms</td>
                      <td className="p-3">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedLog(log)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Detalhes do Log</DialogTitle>
                              <DialogDescription>
                                {log.acao_executada}
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">
                                    Timestamp
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(log.timestamp).toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Tempo de Execução
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {log.tempo_execucao}ms
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <label className="text-sm font-medium">
                                    Origem
                                  </label>
                                  <Badge className={getOriginColor(log.origem)}>
                                    {getOriginIcon(log.origem)}
                                    <span className="ml-1">{log.origem}</span>
                                  </Badge>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Módulo
                                  </label>
                                  <Badge variant="outline">
                                    {log.modulo_afetado}
                                  </Badge>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Resultado
                                  </label>
                                  <Badge
                                    className={getResultColor(log.resultado)}
                                  >
                                    {getResultIcon(log.resultado)}
                                    <span className="ml-1">
                                      {log.resultado}
                                    </span>
                                  </Badge>
                                </div>
                              </div>

                              {log.usuario && (
                                <div>
                                  <label className="text-sm font-medium">
                                    Usuário
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {log.usuario}
                                  </p>
                                </div>
                              )}

                              {log.stack_trace && (
                                <div>
                                  <label className="text-sm font-medium">
                                    Stack Trace
                                  </label>
                                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                    {log.stack_trace}
                                  </pre>
                                </div>
                              )}

                              <div>
                                <label className="text-sm font-medium">
                                  Detalhes ({log.detalhes.length})
                                </label>
                                <ScrollArea className="h-48 border rounded p-2">
                                  <div className="space-y-2">
                                    {log.detalhes.map((detail, idx) => (
                                      <div
                                        key={idx}
                                        className="border rounded p-2 text-sm"
                                      >
                                        <div className="flex items-center gap-2 mb-1">
                                          {getDetailTypeIcon(detail.tipo)}
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            {detail.tipo}
                                          </Badge>
                                          <Badge
                                            className={getResultColor(
                                              detail.status,
                                            )}
                                          >
                                            {detail.status}
                                          </Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground mb-1">
                                          <strong>Recurso:</strong>{" "}
                                          {detail.recurso}
                                        </div>
                                        <div className="text-xs text-muted-foreground mb-1">
                                          <strong>Ação:</strong> {detail.acao}
                                        </div>
                                        <div className="text-xs">
                                          {detail.mensagem}
                                        </div>
                                        {detail.tempo_execucao && (
                                          <div className="text-xs text-muted-foreground mt-1">
                                            Executado em {detail.tempo_execucao}
                                            ms
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </ScrollArea>
                              </div>

                              {(log.metricas_antes || log.metricas_depois) && (
                                <div className="grid grid-cols-2 gap-4">
                                  {log.metricas_antes && (
                                    <div>
                                      <label className="text-sm font-medium">
                                        Métricas Antes
                                      </label>
                                      <pre className="text-xs bg-muted p-2 rounded">
                                        {JSON.stringify(
                                          log.metricas_antes,
                                          null,
                                          2,
                                        )}
                                      </pre>
                                    </div>
                                  )}
                                  {log.metricas_depois && (
                                    <div>
                                      <label className="text-sm font-medium">
                                        Métricas Depois
                                      </label>
                                      <pre className="text-xs bg-muted p-2 rounded">
                                        {JSON.stringify(
                                          log.metricas_depois,
                                          null,
                                          2,
                                        )}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {paginatedLogs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhum log encontrado com os filtros aplicados</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics by Origin and Module */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Logs por Origem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(logStats.logsByOrigin).map(([origem, count]) => (
                <div key={origem} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getOriginIcon(origem)}
                    <Badge className={getOriginColor(origem)}>{origem}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {count} logs
                    </span>
                    <Badge variant="outline">
                      {Math.round((count / logStats.totalLogs) * 100)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Logs por Módulo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(logStats.logsByModule)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 6)
                .map(([modulo, count]) => (
                  <div
                    key={modulo}
                    className="flex items-center justify-between"
                  >
                    <Badge variant="outline" className="text-xs">
                      {modulo}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {count} logs
                      </span>
                      <Badge variant="outline">
                        {Math.round((count / logStats.totalLogs) * 100)}%
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Named export for destructuring imports
export { LogViewer };

// Default export for backward compatibility
export default LogViewer;
