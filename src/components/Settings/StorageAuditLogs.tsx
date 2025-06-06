import { useState, useEffect } from "react";
import {
  Activity,
  Download,
  Filter,
  Search,
  Calendar,
  User,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Upload,
  Trash2,
  Edit,
  Settings,
  Shield,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { DatePicker } from "@/components/ui/date-picker";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action:
    | "upload"
    | "download"
    | "delete"
    | "move"
    | "rename"
    | "config_change"
    | "provider_switch"
    | "access_denied";
  user: string;
  userRole: string;
  resource: string;
  resourceType: "file" | "folder" | "config" | "provider";
  details: string;
  ipAddress: string;
  userAgent: string;
  result: "success" | "failure" | "partial";
  source: string;
  size?: number;
  clientId?: string;
  processId?: string;
}

export function StorageAuditLogs() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [resultFilter, setResultFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  // Generate mock audit logs
  useEffect(() => {
    const generateMockLogs = () => {
      const users = [
        { name: "Dr. Pedro Costa", role: "Advogado Sênior" },
        { name: "Dra. Ana Lima", role: "Advogada" },
        { name: "Carlos Oliveira", role: "Secretário" },
        { name: "Maria Santos", role: "Estagiária" },
        { name: "Admin Sistema", role: "Administrador" },
      ];

      const actions: AuditLogEntry["action"][] = [
        "upload",
        "download",
        "delete",
        "move",
        "rename",
        "config_change",
        "provider_switch",
        "access_denied",
      ];

      const sources = [
        "Lawdesk Cloud",
        "Google Drive",
        "Servidor Local",
        "Supabase",
      ];

      const mockLogs: AuditLogEntry[] = [];

      for (let i = 0; i < 50; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const source = sources[Math.floor(Math.random() * sources.length)];
        const result: AuditLogEntry["result"] =
          Math.random() > 0.1
            ? "success"
            : Math.random() > 0.5
              ? "failure"
              : "partial";

        const log: AuditLogEntry = {
          id: `log_${i + 1}`,
          timestamp: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
          ), // Last 7 days
          action,
          user: user.name,
          userRole: user.role,
          resource: getResourceName(action, i),
          resourceType: getResourceType(action),
          details: getActionDetails(action, user.name, source),
          ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          result,
          source,
          size:
            action === "upload" || action === "download"
              ? Math.floor(Math.random() * 10 * 1024 * 1024)
              : undefined,
          clientId:
            Math.random() > 0.5
              ? `cliente_${Math.floor(Math.random() * 100)}`
              : undefined,
          processId:
            Math.random() > 0.7
              ? `processo_${Math.floor(Math.random() * 200)}`
              : undefined,
        };

        mockLogs.push(log);
      }

      // Sort by timestamp (newest first)
      mockLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setLogs(mockLogs);
      setLoading(false);
    };

    setTimeout(generateMockLogs, 1000);
  }, []);

  const getResourceName = (action: string, index: number): string => {
    switch (action) {
      case "upload":
      case "download":
      case "delete":
        return `documento_${index + 1}.pdf`;
      case "move":
        return `pasta_cliente_${index}`;
      case "rename":
        return `arquivo_renomeado_${index}.docx`;
      case "config_change":
        return "Configurações de Armazenamento";
      case "provider_switch":
        return "Provedor de Armazenamento";
      case "access_denied":
        return `arquivo_protegido_${index}.pdf`;
      default:
        return `recurso_${index}`;
    }
  };

  const getResourceType = (action: string): AuditLogEntry["resourceType"] => {
    switch (action) {
      case "config_change":
        return "config";
      case "provider_switch":
        return "provider";
      case "move":
        return "folder";
      default:
        return "file";
    }
  };

  const getActionDetails = (
    action: string,
    user: string,
    source: string,
  ): string => {
    switch (action) {
      case "upload":
        return `Arquivo enviado para ${source}`;
      case "download":
        return `Arquivo baixado de ${source}`;
      case "delete":
        return `Arquivo excluído de ${source}`;
      case "move":
        return `Pasta movida dentro de ${source}`;
      case "rename":
        return `Arquivo renomeado em ${source}`;
      case "config_change":
        return `Configurações de armazenamento alteradas`;
      case "provider_switch":
        return `Provedor alterado para ${source}`;
      case "access_denied":
        return `Acesso negado ao arquivo em ${source}`;
      default:
        return `Ação realizada em ${source}`;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "upload":
        return <Upload className="h-4 w-4 text-green-500" />;
      case "download":
        return <Download className="h-4 w-4 text-blue-500" />;
      case "delete":
        return <Trash2 className="h-4 w-4 text-red-500" />;
      case "move":
        return <ExternalLink className="h-4 w-4 text-purple-500" />;
      case "rename":
        return <Edit className="h-4 w-4 text-orange-500" />;
      case "config_change":
        return <Settings className="h-4 w-4 text-indigo-500" />;
      case "provider_switch":
        return <Shield className="h-4 w-4 text-pink-500" />;
      case "access_denied":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-500">
            Sucesso
          </Badge>
        );
      case "failure":
        return <Badge variant="destructive">Falha</Badge>;
      case "partial":
        return (
          <Badge
            variant="outline"
            className="border-orange-500 text-orange-600"
          >
            Parcial
          </Badge>
        );
      default:
        return <Badge variant="secondary">{result}</Badge>;
    }
  };

  const getActionLabel = (action: string) => {
    const labels: { [key: string]: string } = {
      upload: "Upload",
      download: "Download",
      delete: "Exclusão",
      move: "Movimentação",
      rename: "Renomeação",
      config_change: "Config. Alterada",
      provider_switch: "Troca Provedor",
      access_denied: "Acesso Negado",
    };
    return labels[action] || action;
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const exportLogs = () => {
    const csvContent = [
      "Data/Hora,Ação,Usuário,Recurso,Resultado,IP,Detalhes",
      ...filteredLogs.map(
        (log) =>
          `${log.timestamp.toLocaleString("pt-BR")},${getActionLabel(log.action)},${log.user},${log.resource},${log.result},${log.ipAddress},"${log.details}"`,
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `logs_armazenamento_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Logs exportados com sucesso!");
  };

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesResult = resultFilter === "all" || log.result === resultFilter;
    const matchesUser = userFilter === "all" || log.user === userFilter;

    const logDate = log.timestamp;
    const matchesDateFrom = !dateFrom || logDate >= dateFrom;
    const matchesDateTo = !dateTo || logDate <= dateTo;

    return (
      matchesSearch &&
      matchesAction &&
      matchesResult &&
      matchesUser &&
      matchesDateFrom &&
      matchesDateTo
    );
  });

  const uniqueUsers = Array.from(new Set(logs.map((log) => log.user)));
  const actionCounts = logs.reduce(
    (acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    },
    {} as { [key: string]: number },
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="h-96 bg-muted rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Logs de Auditoria</h2>
          <p className="text-muted-foreground">
            Registro completo de atividades no sistema de armazenamento
          </p>
        </div>
        <Button
          onClick={exportLogs}
          className="bg-[rgb(var(--theme-primary))] hover:bg-[rgb(var(--theme-primary))]/90"
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar Logs
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Eventos
                </p>
                <p className="text-2xl font-bold">{logs.length}</p>
              </div>
              <Activity className="h-8 w-8 text-[rgb(var(--theme-primary))]" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Uploads Hoje
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    logs.filter(
                      (log) =>
                        log.action === "upload" &&
                        log.timestamp.toDateString() ===
                          new Date().toDateString(),
                    ).length
                  }
                </p>
              </div>
              <Upload className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Falhas
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {logs.filter((log) => log.result === "failure").length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Usuários Ativos
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {uniqueUsers.length}
                </p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por usuário, arquivo ou atividade..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Ações</SelectItem>
                  <SelectItem value="upload">Upload</SelectItem>
                  <SelectItem value="download">Download</SelectItem>
                  <SelectItem value="delete">Exclusão</SelectItem>
                  <SelectItem value="config_change">
                    Config. Alterada
                  </SelectItem>
                  <SelectItem value="provider_switch">
                    Troca Provedor
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={resultFilter} onValueChange={setResultFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Resultado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="success">Sucesso</SelectItem>
                  <SelectItem value="failure">Falha</SelectItem>
                  <SelectItem value="partial">Parcial</SelectItem>
                </SelectContent>
              </Select>

              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Usuários</SelectItem>
                  {uniqueUsers.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <DatePicker
                date={dateFrom}
                onDateChange={setDateFrom}
                placeholder="Data inicial"
              />

              <DatePicker
                date={dateTo}
                onDateChange={setDateTo}
                placeholder="Data final"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Eventos de Auditoria ({filteredLogs.length})</span>
            <div className="text-sm text-muted-foreground">
              Últimos 20 eventos • {logs.length} total
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Recurso</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.slice(0, 20).map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="text-sm">
                        <div>{log.timestamp.toLocaleDateString("pt-BR")}</div>
                        <div className="text-muted-foreground">
                          {log.timestamp.toLocaleTimeString("pt-BR")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getActionIcon(log.action)}
                        <span className="font-medium">
                          {getActionLabel(log.action)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.user}</div>
                        <div className="text-xs text-muted-foreground">
                          {log.userRole}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.resource}</div>
                        {log.size && (
                          <div className="text-xs text-muted-foreground">
                            {formatFileSize(log.size)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getResultBadge(log.result)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-mono">
                          {log.ipAddress}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm text-muted-foreground truncate">
                          {log.details}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {log.source}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">
                Nenhum evento encontrado
              </h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros para ver mais resultados
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
