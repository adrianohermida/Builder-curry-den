import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Download,
  Upload,
  Eye,
  Trash2,
  Settings,
  Search,
  Filter,
  Calendar,
  User,
  Monitor,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Globe,
  Smartphone,
  Laptop,
  Tablet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  userType: "ADVOGADO" | "ESTAGIARIO" | "CLIENTE" | "ADMIN" | "SISTEMA";
  ipAddress: string;
  userAgent: string;
  deviceType: "DESKTOP" | "MOBILE" | "TABLET";
  action:
    | "UPLOAD"
    | "DOWNLOAD"
    | "DELETE"
    | "VIEW"
    | "SHARE"
    | "CONFIG_CHANGE"
    | "LOGIN"
    | "LOGOUT";
  module:
    | "CRM"
    | "PROCESSOS"
    | "ATENDIMENTO"
    | "IA"
    | "AGENDA"
    | "CONTRATOS"
    | "CONFIGURACOES";
  entityType: string;
  entityId: string;
  fileName?: string;
  fileSize?: number;
  result: "SUCCESS" | "FAILURE" | "PARTIAL";
  details: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  location?: string;
}

interface AuditStats {
  totalLogs: number;
  successRate: number;
  criticalEvents: number;
  uniqueUsers: number;
  todayLogs: number;
  actionBreakdown: Record<string, number>;
  moduleBreakdown: Record<string, number>;
  riskBreakdown: Record<string, number>;
}

export function StorageAuditLogs() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterModule, setFilterModule] = useState("all");
  const [filterResult, setFilterResult] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");
  const [filterUser, setFilterUser] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasTestData, setHasTestData] = useState(false);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    setLoading(true);

    try {
      // Verificar se há dados simulados
      const savedLogs = localStorage.getItem("lawdesk-audit-logs");
      const hasData = savedLogs && JSON.parse(savedLogs).length > 0;

      if (hasData) {
        const logData = JSON.parse(savedLogs);
        setLogs(logData);
        generateStats(logData);
        setHasTestData(true);
      } else {
        // Dados vazios
        setLogs([]);
        setStats(null);
        setHasTestData(false);
      }
    } catch (error) {
      console.error("Erro ao carregar logs de auditoria:", error);
      toast.error("Erro ao carregar logs de auditoria");
    } finally {
      setLoading(false);
    }
  };

  const generateTestData = () => {
    const testLogs: AuditLogEntry[] = [
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
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        user: "Sistema IA",
        userType: "SISTEMA",
        ipAddress: "127.0.0.1",
        userAgent: "Lawdesk-AI-Bot/1.0",
        deviceType: "DESKTOP",
        action: "UPLOAD",
        module: "IA",
        entityType: "ANALISE_DOCUMENTO",
        entityId: "analysis_678",
        fileName: "Resumo_Automatico.json",
        fileSize: 512000,
        result: "SUCCESS",
        details: "Upload automático de análise gerada pela IA",
        riskLevel: "LOW",
      },
      {
        id: "log_004",
        timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
        user: "Estagiário João",
        userType: "ESTAGIARIO",
        ipAddress: "192.168.1.101",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        deviceType: "DESKTOP",
        action: "UPLOAD",
        module: "PROCESSOS",
        entityType: "ANEXO_PROCESSO",
        entityId: "proc_001",
        fileName: "Peticao_Inicial.docx",
        fileSize: 1024000,
        result: "SUCCESS",
        details: "Upload de petição inicial para processo judicial",
        riskLevel: "MEDIUM",
        location: "São Paulo, SP",
      },
      {
        id: "log_005",
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
      {
        id: "log_006",
        timestamp: new Date(Date.now() - 1000 * 60 * 105).toISOString(),
        user: "Admin Sistema",
        userType: "ADMIN",
        ipAddress: "10.0.0.1",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        deviceType: "DESKTOP",
        action: "CONFIG_CHANGE",
        module: "CONFIGURACOES",
        entityType: "STORAGE_CONFIG",
        entityId: "config_001",
        result: "SUCCESS",
        details: "Alteração do provedor de armazenamento para Supabase",
        riskLevel: "HIGH",
        location: "São Paulo, SP",
      },
      {
        id: "log_007",
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        user: "Cliente Maria",
        userType: "CLIENTE",
        ipAddress: "179.98.76.54",
        userAgent: "Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)",
        deviceType: "TABLET",
        action: "UPLOAD",
        module: "ATENDIMENTO",
        entityType: "ANEXO_TICKET",
        entityId: "ticket_123",
        fileName: "Comprovante_Pagamento.jpg",
        fileSize: 768000,
        result: "SUCCESS",
        details: "Upload de comprovante via portal do cliente",
        riskLevel: "LOW",
        location: "Belo Horizonte, MG",
      },
      {
        id: "log_008",
        timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
        user: "Advogado Silva",
        userType: "ADVOGADO",
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        deviceType: "DESKTOP",
        action: "DELETE",
        module: "CRM",
        entityType: "DOCUMENTO_CLIENTE",
        entityId: "doc_old_001",
        fileName: "Documento_Obsoleto.pdf",
        result: "SUCCESS",
        details: "Exclusão de documento obsoleto conforme LGPD",
        riskLevel: "MEDIUM",
        location: "São Paulo, SP",
      },
    ];

    localStorage.setItem("lawdesk-audit-logs", JSON.stringify(testLogs));
    setLogs(testLogs);
    generateStats(testLogs);
    setHasTestData(true);
    toast.success("📋 Dados de auditoria simulados gerados com sucesso!");
  };

  const generateStats = (logData: AuditLogEntry[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats: AuditStats = {
      totalLogs: logData.length,
      successRate:
        (logData.filter((log) => log.result === "SUCCESS").length /
          logData.length) *
        100,
      criticalEvents: logData.filter((log) => log.riskLevel === "CRITICAL")
        .length,
      uniqueUsers: new Set(logData.map((log) => log.user)).size,
      todayLogs: logData.filter((log) => new Date(log.timestamp) >= today)
        .length,
      actionBreakdown: {},
      moduleBreakdown: {},
      riskBreakdown: {},
    };

    // Breakdown por ação
    logData.forEach((log) => {
      stats.actionBreakdown[log.action] =
        (stats.actionBreakdown[log.action] || 0) + 1;
    });

    // Breakdown por módulo
    logData.forEach((log) => {
      stats.moduleBreakdown[log.module] =
        (stats.moduleBreakdown[log.module] || 0) + 1;
    });

    // Breakdown por risco
    logData.forEach((log) => {
      stats.riskBreakdown[log.riskLevel] =
        (stats.riskBreakdown[log.riskLevel] || 0) + 1;
    });

    setStats(stats);
  };

  const exportToCSV = () => {
    const headers = [
      "Timestamp",
      "Usuário",
      "Tipo de Usuário",
      "IP",
      "Dispositivo",
      "Ação",
      "Módulo",
      "Tipo de Entidade",
      "ID da Entidade",
      "Nome do Arquivo",
      "Tamanho do Arquivo",
      "Resultado",
      "Detalhes",
      "Nível de Risco",
      "Localização",
    ];

    const csvContent = [
      headers.join(";"),
      ...filteredLogs.map((log) =>
        [
          new Date(log.timestamp).toLocaleString("pt-BR"),
          log.user,
          log.userType,
          log.ipAddress,
          log.deviceType,
          log.action,
          log.module,
          log.entityType,
          log.entityId,
          log.fileName || "",
          log.fileSize ? formatFileSize(log.fileSize) : "",
          log.result,
          `"${log.details.replace(/"/g, '""')}"`,
          log.riskLevel,
          log.location || "",
        ].join(";"),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `audit_logs_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("📊 Logs exportados em CSV com sucesso!");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "UPLOAD":
        return <Upload className="h-4 w-4" />;
      case "DOWNLOAD":
        return <Download className="h-4 w-4" />;
      case "VIEW":
        return <Eye className="h-4 w-4" />;
      case "DELETE":
        return <Trash2 className="h-4 w-4" />;
      case "SHARE":
        return <Globe className="h-4 w-4" />;
      case "CONFIG_CHANGE":
        return <Settings className="h-4 w-4" />;
      case "LOGIN":
        return <User className="h-4 w-4" />;
      case "LOGOUT":
        return <User className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case "SUCCESS":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "FAILURE":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "PARTIAL":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "CRITICAL":
        return "bg-red-500 text-white";
      case "HIGH":
        return "bg-orange-500 text-white";
      case "MEDIUM":
        return "bg-yellow-500 text-white";
      default:
        return "bg-green-500 text-white";
    }
  };

  const getRiskLabel = (riskLevel: string) => {
    switch (riskLevel) {
      case "CRITICAL":
        return "Crítico";
      case "HIGH":
        return "Alto";
      case "MEDIUM":
        return "Médio";
      case "LOW":
        return "Baixo";
      default:
        return riskLevel;
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "MOBILE":
        return <Smartphone className="h-4 w-4" />;
      case "TABLET":
        return <Tablet className="h-4 w-4" />;
      default:
        return <Laptop className="h-4 w-4" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "UPLOAD":
        return "Upload";
      case "DOWNLOAD":
        return "Download";
      case "VIEW":
        return "Visualização";
      case "DELETE":
        return "Exclusão";
      case "SHARE":
        return "Compartilhamento";
      case "CONFIG_CHANGE":
        return "Mudança de Config";
      case "LOGIN":
        return "Login";
      case "LOGOUT":
        return "Logout";
      default:
        return action;
    }
  };

  const getResultLabel = (result: string) => {
    switch (result) {
      case "SUCCESS":
        return "Sucesso";
      case "FAILURE":
        return "Falha";
      case "PARTIAL":
        return "Parcial";
      default:
        return result;
    }
  };

  // Filtrar logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.fileName &&
          log.fileName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesAction =
        filterAction === "all" || log.action === filterAction;
      const matchesModule =
        filterModule === "all" || log.module === filterModule;
      const matchesResult =
        filterResult === "all" || log.result === filterResult;
      const matchesRisk = filterRisk === "all" || log.riskLevel === filterRisk;
      const matchesUser =
        !filterUser ||
        log.user.toLowerCase().includes(filterUser.toLowerCase());

      const logDate = new Date(log.timestamp);
      const matchesDateFrom = !dateFrom || logDate >= new Date(dateFrom);
      const matchesDateTo =
        !dateTo || logDate <= new Date(dateTo + " 23:59:59");

      return (
        matchesSearch &&
        matchesAction &&
        matchesModule &&
        matchesResult &&
        matchesRisk &&
        matchesUser &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
  }, [
    logs,
    searchTerm,
    filterAction,
    filterModule,
    filterResult,
    filterRisk,
    filterUser,
    dateFrom,
    dateTo,
  ]);

  // Paginação
  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!hasTestData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Nenhum log de auditoria encontrado
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Ainda não há registros de auditoria no sistema. Execute ações nos
              módulos ou gere dados de teste para visualizar os logs.
            </p>
            <Button onClick={generateTestData} size="lg">
              <FileText className="h-4 w-4 mr-2" />
              Simular Dados
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total de Logs
                  </p>
                  <p className="text-2xl font-bold">{stats?.totalLogs || 0}</p>
                </div>
                <Shield className="h-8 w-8 text-blue-500" />
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
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Taxa de Sucesso
                  </p>
                  <p className="text-2xl font-bold">
                    {stats?.successRate.toFixed(1) || 0}%
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
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
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Eventos Críticos
                  </p>
                  <p className="text-2xl font-bold">
                    {stats?.criticalEvents || 0}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Usuários Únicos
                  </p>
                  <p className="text-2xl font-bold">
                    {stats?.uniqueUsers || 0}
                  </p>
                </div>
                <User className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Logs Hoje
                  </p>
                  <p className="text-2xl font-bold">{stats?.todayLogs || 0}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Alertas de Segurança */}
      {stats && stats.criticalEvents > 0 && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <strong>Atenção!</strong> {stats.criticalEvents} evento(s)
            crítico(s) detectado(s). Revise imediatamente os logs com risco
            CRÍTICO.
          </AlertDescription>
        </Alert>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtros de Auditoria
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={loadAuditLogs}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              <Button
                onClick={exportToCSV}
                disabled={filteredLogs.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Usuário, arquivo, detalhes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="filter-action">Ação</Label>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as ações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="UPLOAD">Upload</SelectItem>
                  <SelectItem value="DOWNLOAD">Download</SelectItem>
                  <SelectItem value="VIEW">Visualização</SelectItem>
                  <SelectItem value="DELETE">Exclusão</SelectItem>
                  <SelectItem value="SHARE">Compartilhamento</SelectItem>
                  <SelectItem value="CONFIG_CHANGE">Mudança Config</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="filter-module">Módulo</Label>
              <Select value={filterModule} onValueChange={setFilterModule}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os módulos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="CRM">CRM</SelectItem>
                  <SelectItem value="PROCESSOS">Processos</SelectItem>
                  <SelectItem value="ATENDIMENTO">Atendimento</SelectItem>
                  <SelectItem value="IA">IA Jurídica</SelectItem>
                  <SelectItem value="AGENDA">Agenda</SelectItem>
                  <SelectItem value="CONTRATOS">Contratos</SelectItem>
                  <SelectItem value="CONFIGURACOES">Configurações</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="filter-risk">Nível de Risco</Label>
              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os níveis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="LOW">Baixo</SelectItem>
                  <SelectItem value="MEDIUM">Médio</SelectItem>
                  <SelectItem value="HIGH">Alto</SelectItem>
                  <SelectItem value="CRITICAL">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="filter-user">Usuário</Label>
              <Input
                id="filter-user"
                placeholder="Nome do usuário"
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="date-from">Data Inicial</Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="date-to">Data Final</Label>
              <Input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredLogs.length} de {logs.length} registros
            </p>
            <div className="flex items-center space-x-2">
              <Label htmlFor="page-size">Registros por página:</Label>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(parseInt(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Registros de Auditoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Módulo</TableHead>
                  <TableHead>Arquivo</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead>Risco</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.map((log) => (
                  <Collapsible key={log.id}>
                    <CollapsibleTrigger asChild>
                      <TableRow className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <div className="text-sm">
                            {new Date(log.timestamp).toLocaleDateString(
                              "pt-BR",
                            )}
                            <br />
                            <span className="text-xs text-muted-foreground">
                              {new Date(log.timestamp).toLocaleTimeString(
                                "pt-BR",
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getDeviceIcon(log.deviceType)}
                            <div>
                              <p className="font-medium">{log.user}</p>
                              <Badge variant="outline" className="text-xs">
                                {log.userType}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {getActionIcon(log.action)}
                            <span>{getActionLabel(log.action)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.module}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            {log.fileName ? (
                              <div>
                                <p className="font-medium truncate">
                                  {log.fileName}
                                </p>
                                {log.fileSize && (
                                  <p className="text-xs text-muted-foreground">
                                    {formatFileSize(log.fileSize)}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {getResultIcon(log.result)}
                            <span>{getResultLabel(log.result)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRiskColor(log.riskLevel)}>
                            {getRiskLabel(log.riskLevel)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-mono">
                            {log.ipAddress}
                            {log.location && (
                              <p className="text-xs text-muted-foreground">
                                {log.location}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm truncate max-w-xs">
                              {log.details}
                            </p>
                            {expandedLog === log.id ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    </CollapsibleTrigger>
                    <CollapsibleContent asChild>
                      <TableRow>
                        <TableCell colSpan={9}>
                          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <Label className="font-medium">
                                  User Agent
                                </Label>
                                <p className="text-muted-foreground font-mono text-xs break-all">
                                  {log.userAgent}
                                </p>
                              </div>
                              <div>
                                <Label className="font-medium">
                                  Tipo de Entidade
                                </Label>
                                <p className="text-muted-foreground">
                                  {log.entityType}
                                </p>
                              </div>
                              <div>
                                <Label className="font-medium">
                                  ID da Entidade
                                </Label>
                                <p className="text-muted-foreground font-mono">
                                  {log.entityId}
                                </p>
                              </div>
                              <div>
                                <Label className="font-medium">
                                  Dispositivo
                                </Label>
                                <p className="text-muted-foreground">
                                  {log.deviceType}
                                </p>
                              </div>
                            </div>
                            <Separator />
                            <div>
                              <Label className="font-medium">
                                Detalhes Completos
                              </Label>
                              <p className="text-muted-foreground mt-1">
                                {log.details}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
