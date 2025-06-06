import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userAgent: string;
  ipAddress: string;
  module:
    | "CRM"
    | "AGENDA"
    | "ATENDIMENTO"
    | "IA"
    | "CONFIGURACOES"
    | "PUBLICACOES"
    | "PROCESSOS"
    | "ARMAZENAMENTO";
  action:
    | "CREATE"
    | "READ"
    | "UPDATE"
    | "DELETE"
    | "DOWNLOAD"
    | "UPLOAD"
    | "LOGIN"
    | "LOGOUT"
    | "ACCESS"
    | "SHARE";
  entityType: string;
  entityId: string;
  details: string;
  result: "SUCCESS" | "FAILURE" | "PARTIAL";
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  metadata?: {
    fileSize?: number;
    fileName?: string;
    clientId?: string;
    processNumber?: string;
    previousValue?: any;
    newValue?: any;
  };
}

export interface AuditFilters {
  dateFrom?: string;
  dateTo?: string;
  user?: string;
  module?: string;
  action?: string;
  result?: string;
  riskLevel?: string;
  searchTerm?: string;
}

export interface AuditStatistics {
  totalLogs: number;
  successfulActions: number;
  failedActions: number;
  highRiskActions: number;
  moduleBreakdown: Record<string, number>;
  actionBreakdown: Record<string, number>;
  hourlyActivity: Array<{ hour: number; count: number }>;
  topUsers: Array<{ user: string; count: number }>;
}

export function useAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [statistics, setStatistics] = useState<AuditStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<AuditFilters>({});

  useEffect(() => {
    loadAuditLogs();
  }, [filters]);

  const loadAuditLogs = async () => {
    setLoading(true);

    try {
      // Simular carregamento de logs
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockLogs: AuditLog[] = [
        {
          id: "log_001",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          user: "Advogado Silva",
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          ipAddress: "192.168.1.100",
          module: "PUBLICACOES",
          action: "READ",
          entityType: "PUBLICACAO",
          entityId: "pub_12345",
          details: "Visualização de publicação urgente do TJSP",
          result: "SUCCESS",
          riskLevel: "LOW",
          metadata: {
            processNumber: "0001234-56.2024.8.26.0001",
          },
        },
        {
          id: "log_002",
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          user: "Sistema",
          userAgent: "Lawdesk-Bot/1.0",
          ipAddress: "127.0.0.1",
          module: "IA",
          action: "CREATE",
          entityType: "AI_ANALYSIS",
          entityId: "analysis_678",
          details: "Geração automática de resumo de publicação",
          result: "SUCCESS",
          riskLevel: "LOW",
        },
        {
          id: "log_003",
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          user: "Estagiário João",
          userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
          ipAddress: "192.168.1.101",
          module: "CRM",
          action: "UPDATE",
          entityType: "CLIENTE",
          entityId: "cliente_789",
          details: "Atualização de dados do cliente Maria Santos",
          result: "SUCCESS",
          riskLevel: "MEDIUM",
          metadata: {
            clientId: "cliente_789",
            previousValue: { telefone: "(11) 9999-8888" },
            newValue: { telefone: "(11) 9999-7777" },
          },
        },
        {
          id: "log_004",
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          user: "Cliente Portal",
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
          ipAddress: "189.123.45.67",
          module: "ARMAZENAMENTO",
          action: "DOWNLOAD",
          entityType: "DOCUMENTO",
          entityId: "doc_456",
          details: "Download de contrato pelo portal do cliente",
          result: "SUCCESS",
          riskLevel: "MEDIUM",
          metadata: {
            fileName: "contrato_prestacao_servicos.pdf",
            fileSize: 2048576,
            clientId: "cliente_789",
          },
        },
        {
          id: "log_005",
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          user: "Admin System",
          userAgent: "curl/7.68.0",
          ipAddress: "10.0.0.1",
          module: "CONFIGURACOES",
          action: "UPDATE",
          entityType: "STORAGE_CONFIG",
          entityId: "config_001",
          details: "Alteração de configuração de armazenamento",
          result: "SUCCESS",
          riskLevel: "HIGH",
          metadata: {
            previousValue: { provider: "local" },
            newValue: { provider: "supabase" },
          },
        },
        {
          id: "log_006",
          timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
          user: "Advogado Silva",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          ipAddress: "192.168.1.100",
          module: "PROCESSOS",
          action: "CREATE",
          entityType: "PROCESSO",
          entityId: "proc_999",
          details: "Criação de novo processo judicial",
          result: "SUCCESS",
          riskLevel: "MEDIUM",
          metadata: {
            processNumber: "0007890-12.2024.8.26.0002",
            clientId: "cliente_456",
          },
        },
        {
          id: "log_007",
          timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          user: "Usuário Externo",
          userAgent: "Postman/9.0.0",
          ipAddress: "203.45.67.89",
          module: "CRM",
          action: "ACCESS",
          entityType: "CLIENTE",
          entityId: "cliente_123",
          details: "Tentativa de acesso não autorizado a dados de cliente",
          result: "FAILURE",
          riskLevel: "CRITICAL",
        },
      ];

      // Aplicar filtros
      let filteredLogs = [...mockLogs];

      if (filters.dateFrom) {
        filteredLogs = filteredLogs.filter(
          (log) => new Date(log.timestamp) >= new Date(filters.dateFrom!),
        );
      }

      if (filters.dateTo) {
        filteredLogs = filteredLogs.filter(
          (log) => new Date(log.timestamp) <= new Date(filters.dateTo!),
        );
      }

      if (filters.user) {
        filteredLogs = filteredLogs.filter((log) =>
          log.user.toLowerCase().includes(filters.user!.toLowerCase()),
        );
      }

      if (filters.module) {
        filteredLogs = filteredLogs.filter(
          (log) => log.module === filters.module,
        );
      }

      if (filters.action) {
        filteredLogs = filteredLogs.filter(
          (log) => log.action === filters.action,
        );
      }

      if (filters.result) {
        filteredLogs = filteredLogs.filter(
          (log) => log.result === filters.result,
        );
      }

      if (filters.riskLevel) {
        filteredLogs = filteredLogs.filter(
          (log) => log.riskLevel === filters.riskLevel,
        );
      }

      if (filters.searchTerm) {
        filteredLogs = filteredLogs.filter(
          (log) =>
            log.details
              .toLowerCase()
              .includes(filters.searchTerm!.toLowerCase()) ||
            log.entityId
              .toLowerCase()
              .includes(filters.searchTerm!.toLowerCase()),
        );
      }

      setLogs(filteredLogs);

      // Calcular estatísticas
      const stats: AuditStatistics = {
        totalLogs: filteredLogs.length,
        successfulActions: filteredLogs.filter(
          (log) => log.result === "SUCCESS",
        ).length,
        failedActions: filteredLogs.filter((log) => log.result === "FAILURE")
          .length,
        highRiskActions: filteredLogs.filter((log) =>
          ["HIGH", "CRITICAL"].includes(log.riskLevel),
        ).length,
        moduleBreakdown: {},
        actionBreakdown: {},
        hourlyActivity: [],
        topUsers: [],
      };

      // Breakdown por módulo
      filteredLogs.forEach((log) => {
        stats.moduleBreakdown[log.module] =
          (stats.moduleBreakdown[log.module] || 0) + 1;
      });

      // Breakdown por ação
      filteredLogs.forEach((log) => {
        stats.actionBreakdown[log.action] =
          (stats.actionBreakdown[log.action] || 0) + 1;
      });

      // Atividade por hora (últimas 24h)
      for (let i = 0; i < 24; i++) {
        const hour = new Date();
        hour.setHours(hour.getHours() - i);
        const hourStart = new Date(hour);
        hourStart.setMinutes(0, 0, 0);
        const hourEnd = new Date(hour);
        hourEnd.setMinutes(59, 59, 999);

        const count = filteredLogs.filter((log) => {
          const logTime = new Date(log.timestamp);
          return logTime >= hourStart && logTime <= hourEnd;
        }).length;

        stats.hourlyActivity.unshift({ hour: 23 - i, count });
      }

      // Top usuários
      const userCounts: Record<string, number> = {};
      filteredLogs.forEach((log) => {
        userCounts[log.user] = (userCounts[log.user] || 0) + 1;
      });

      stats.topUsers = Object.entries(userCounts)
        .map(([user, count]) => ({ user, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStatistics(stats);
    } catch (error) {
      console.error("Erro ao carregar logs de auditoria:", error);
      toast.error("Erro ao carregar logs de auditoria");
    } finally {
      setLoading(false);
    }
  };

  const createAuditLog = async (
    logData: Omit<AuditLog, "id" | "timestamp" | "userAgent" | "ipAddress">,
  ): Promise<void> => {
    try {
      const newLog: AuditLog = {
        ...logData,
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ipAddress: "192.168.1.100", // Simulado - em produção seria obtido do servidor
      };

      // Simular salvamento
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Adicionar log à lista local
      setLogs((prev) => [newLog, ...prev]);

      console.log("Log de auditoria criado:", newLog);
    } catch (error) {
      console.error("Erro ao criar log de auditoria:", error);
    }
  };

  const exportLogs = async (format: "CSV" | "JSON" | "PDF"): Promise<void> => {
    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      switch (format) {
        case "CSV":
          const csvHeaders =
            "Timestamp,User,Module,Action,Entity Type,Entity ID,Details,Result,Risk Level,IP Address\n";
          const csvRows = logs
            .map(
              (log) =>
                `"${log.timestamp}","${log.user}","${log.module}","${log.action}","${log.entityType}","${log.entityId}","${log.details}","${log.result}","${log.riskLevel}","${log.ipAddress}"`,
            )
            .join("\n");
          content = csvHeaders + csvRows;
          filename = `audit_logs_${new Date().toISOString().split("T")[0]}.csv`;
          mimeType = "text/csv";
          break;

        case "JSON":
          content = JSON.stringify(logs, null, 2);
          filename = `audit_logs_${new Date().toISOString().split("T")[0]}.json`;
          mimeType = "application/json";
          break;

        case "PDF":
          // Simular geração de PDF
          toast.info("Geração de PDF em desenvolvimento");
          return;

        default:
          throw new Error(`Formato não suportado: ${format}`);
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Logs exportados em ${format} com sucesso`);
    } catch (error) {
      console.error("Erro ao exportar logs:", error);
      toast.error("Erro ao exportar logs");
    }
  };

  const analyzeSecurityRisks = (): Array<{
    type: string;
    description: string;
    count: number;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  }> => {
    const risks = [];

    // Analisar tentativas de acesso falho
    const failedAccess = logs.filter(
      (log) => log.result === "FAILURE" && log.action === "ACCESS",
    );
    if (failedAccess.length > 0) {
      risks.push({
        type: "Tentativas de acesso não autorizado",
        description: `${failedAccess.length} tentativas de acesso falharam`,
        count: failedAccess.length,
        severity:
          failedAccess.length > 5 ? "HIGH" : ("MEDIUM" as "HIGH" | "MEDIUM"),
      });
    }

    // Analisar ações de alto risco
    const highRiskActions = logs.filter(
      (log) => log.riskLevel === "HIGH" || log.riskLevel === "CRITICAL",
    );
    if (highRiskActions.length > 0) {
      risks.push({
        type: "Ações de alto risco",
        description: `${highRiskActions.length} ações críticas ou de alto risco executadas`,
        count: highRiskActions.length,
        severity: "HIGH" as const,
      });
    }

    // Analisar acessos externos
    const externalAccess = logs.filter(
      (log) =>
        !log.ipAddress.startsWith("192.168.") &&
        !log.ipAddress.startsWith("127.0."),
    );
    if (externalAccess.length > 0) {
      risks.push({
        type: "Acessos externos",
        description: `${externalAccess.length} acessos de IPs externos identificados`,
        count: externalAccess.length,
        severity: "MEDIUM" as const,
      });
    }

    // Analisar downloads por clientes
    const clientDownloads = logs.filter(
      (log) =>
        log.action === "DOWNLOAD" &&
        log.user.includes("Cliente") &&
        new Date(log.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000),
    );
    if (clientDownloads.length > 10) {
      risks.push({
        type: "Volume alto de downloads",
        description: `${clientDownloads.length} downloads por clientes nas últimas 24h`,
        count: clientDownloads.length,
        severity: "MEDIUM" as const,
      });
    }

    return risks;
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "CRITICAL":
        return "text-red-600 bg-red-50 border-red-200";
      case "HIGH":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-green-600 bg-green-50 border-green-200";
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "CREATE":
        return "➕";
      case "READ":
        return "👁️";
      case "UPDATE":
        return "✏️";
      case "DELETE":
        return "🗑️";
      case "DOWNLOAD":
        return "⬇️";
      case "UPLOAD":
        return "⬆️";
      case "LOGIN":
        return "🔐";
      case "LOGOUT":
        return "🚪";
      case "ACCESS":
        return "🔍";
      case "SHARE":
        return "📤";
      default:
        return "❓";
    }
  };

  return {
    logs,
    statistics,
    loading,
    filters,
    setFilters,
    loadAuditLogs,
    createAuditLog,
    exportLogs,
    analyzeSecurityRisks,
    getRiskColor,
    getActionIcon,
  };
}
