/**
 * 📊 BETA ACCESS LOGGER - SISTEMA DE LOGS PARA PÁGINAS ÓRFÃS
 *
 * Sistema de auditoria específico para páginas Beta:
 * ✅ Log de acesso a páginas órfãs
 * ✅ Métricas de uso para decisões
 * ✅ Exportação de relatórios
 * ✅ Integração com auditoria global
 */

import { useGlobalStore } from "@/stores/useGlobalStore";

export interface BetaPageAccess {
  id: string;
  pageName: string;
  pageUrl: string;
  category:
    | "desconectado"
    | "obsoleto"
    | "duplicado"
    | "em_testes"
    | "pendente";
  userId: string;
  userEmail: string;
  timestamp: string;
  sessionId: string;
  duration?: number; // em segundos
  actions: string[]; // ações realizadas na página
  exitPath?: string; // para onde o usuário foi após sair
  userAgent: string;
  referrer?: string;
}

export interface BetaUsageReport {
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalAccesses: number;
    uniqueUsers: number;
    totalPages: number;
    averageDuration: number;
    mostAccessedPages: Array<{
      page: string;
      accesses: number;
      uniqueUsers: number;
    }>;
  };
  recommendations: Array<{
    page: string;
    category: string;
    currentStatus: string;
    usage: "high" | "medium" | "low" | "none";
    recommendation: "promote" | "improve" | "archive" | "remove";
    reasoning: string;
  }>;
  detailedLogs: BetaPageAccess[];
}

class BetaAccessLogger {
  private static instance: BetaAccessLogger;
  private currentSession: Map<string, BetaPageAccess> = new Map();

  public static getInstance(): BetaAccessLogger {
    if (!BetaAccessLogger.instance) {
      BetaAccessLogger.instance = new BetaAccessLogger();
    }
    return BetaAccessLogger.instance;
  }

  // Registrar acesso a uma página beta
  logPageAccess(
    pageName: string,
    pageUrl: string,
    category: BetaPageAccess["category"],
  ): string {
    const { user, addAuditLog } = useGlobalStore.getState();

    if (!user) return "";

    const accessId = `beta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const sessionId = this.getOrCreateSessionId();

    const access: BetaPageAccess = {
      id: accessId,
      pageName,
      pageUrl,
      category,
      userId: user.id,
      userEmail: user.email,
      timestamp: new Date().toISOString(),
      sessionId,
      actions: [],
      userAgent: navigator.userAgent,
      referrer: document.referrer || undefined,
    };

    // Armazenar na sessão atual
    this.currentSession.set(accessId, access);

    // Log de auditoria global
    addAuditLog({
      usuario: user.email,
      acao: "acesso_beta",
      modulo: "beta",
      detalhes: `Acessou página órfã: ${pageName} (${category}) - URL: ${pageUrl}`,
    });

    // Armazenar no localStorage para persistência
    this.persistAccess(access);

    return accessId;
  }

  // Registrar ação na página
  logPageAction(accessId: string, action: string): void {
    const access = this.currentSession.get(accessId);
    if (access) {
      access.actions.push(`${new Date().toISOString()}: ${action}`);
      this.currentSession.set(accessId, access);
      this.persistAccess(access);
    }
  }

  // Registrar saída da página
  logPageExit(accessId: string, exitPath?: string): void {
    const access = this.currentSession.get(accessId);
    if (access) {
      const now = new Date();
      const startTime = new Date(access.timestamp);
      access.duration = Math.round(
        (now.getTime() - startTime.getTime()) / 1000,
      );
      access.exitPath = exitPath;

      this.persistAccess(access);
      this.currentSession.delete(accessId);

      // Log de auditoria para saída
      const { user, addAuditLog } = useGlobalStore.getState();
      if (user) {
        addAuditLog({
          usuario: user.email,
          acao: "saida_beta",
          modulo: "beta",
          detalhes: `Saiu da página órfã: ${access.pageName} após ${access.duration}s${exitPath ? ` -> ${exitPath}` : ""}`,
        });
      }
    }
  }

  // Gerar relatório de uso
  generateUsageReport(days: number = 30): BetaUsageReport {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = this.getStoredAccesses().filter((access) => {
      const accessDate = new Date(access.timestamp);
      return accessDate >= startDate && accessDate <= endDate;
    });

    // Calcular métricas
    const totalAccesses = logs.length;
    const uniqueUsers = new Set(logs.map((log) => log.userId)).size;
    const totalPages = new Set(logs.map((log) => log.pageName)).size;
    const validDurations = logs
      .filter((log) => log.duration)
      .map((log) => log.duration!);
    const averageDuration =
      validDurations.length > 0
        ? Math.round(
            validDurations.reduce((a, b) => a + b, 0) / validDurations.length,
          )
        : 0;

    // Páginas mais acessadas
    const pageAccesses = logs.reduce(
      (acc, log) => {
        if (!acc[log.pageName]) {
          acc[log.pageName] = { accesses: 0, users: new Set() };
        }
        acc[log.pageName].accesses++;
        acc[log.pageName].users.add(log.userId);
        return acc;
      },
      {} as Record<string, { accesses: number; users: Set<string> }>,
    );

    const mostAccessedPages = Object.entries(pageAccesses)
      .map(([page, data]) => ({
        page,
        accesses: data.accesses,
        uniqueUsers: data.users.size,
      }))
      .sort((a, b) => b.accesses - a.accesses)
      .slice(0, 10);

    // Gerar recomendações
    const recommendations = this.generateRecommendations(logs, pageAccesses);

    return {
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
      summary: {
        totalAccesses,
        uniqueUsers,
        totalPages,
        averageDuration,
        mostAccessedPages,
      },
      recommendations,
      detailedLogs: logs,
    };
  }

  // Exportar logs como CSV
  exportLogsAsCSV(report: BetaUsageReport): string {
    const headers = [
      "Data",
      "Página",
      "URL",
      "Categoria",
      "Usuário",
      "Duração (s)",
      "Ações",
      "Saída",
    ].join(",");

    const rows = report.detailedLogs.map((log) =>
      [
        new Date(log.timestamp).toLocaleString(),
        `"${log.pageName}"`,
        `"${log.pageUrl}"`,
        log.category,
        `"${log.userEmail}"`,
        log.duration || 0,
        `"${log.actions.length} ações"`,
        `"${log.exitPath || "N/A"}"`,
      ].join(","),
    );

    return [headers, ...rows].join("\n");
  }

  // Limpar logs antigos
  cleanOldLogs(daysToKeep: number = 90): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const storedAccesses = this.getStoredAccesses();
    const filteredAccesses = storedAccesses.filter((access) => {
      return new Date(access.timestamp) > cutoffDate;
    });

    localStorage.setItem("lawdesk_beta_logs", JSON.stringify(filteredAccesses));
  }

  // Métodos privados
  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem("lawdesk_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem("lawdesk_session_id", sessionId);
    }
    return sessionId;
  }

  private persistAccess(access: BetaPageAccess): void {
    const stored = this.getStoredAccesses();
    const index = stored.findIndex((s) => s.id === access.id);

    if (index >= 0) {
      stored[index] = access;
    } else {
      stored.push(access);
    }

    // Manter apenas os últimos 1000 registros
    const trimmed = stored.slice(-1000);
    localStorage.setItem("lawdesk_beta_logs", JSON.stringify(trimmed));
  }

  private getStoredAccesses(): BetaPageAccess[] {
    try {
      const stored = localStorage.getItem("lawdesk_beta_logs");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Erro ao carregar logs beta:", error);
      return [];
    }
  }

  private generateRecommendations(
    logs: BetaPageAccess[],
    pageAccesses: Record<string, { accesses: number; users: Set<string> }>,
  ): BetaUsageReport["recommendations"] {
    const recommendations: BetaUsageReport["recommendations"] = [];

    Object.entries(pageAccesses).forEach(([page, data]) => {
      const pageLog = logs.find((log) => log.pageName === page);
      if (!pageLog) return;

      const usage = this.categorizeUsage(data.accesses, data.users.size);
      const recommendation = this.getRecommendation(pageLog.category, usage);

      recommendations.push({
        page,
        category: pageLog.category,
        currentStatus: "órfã",
        usage,
        recommendation: recommendation.action,
        reasoning: recommendation.reasoning,
      });
    });

    return recommendations.sort((a, b) => {
      const priority = { promote: 4, improve: 3, archive: 2, remove: 1 };
      return priority[b.recommendation] - priority[a.recommendation];
    });
  }

  private categorizeUsage(
    accesses: number,
    uniqueUsers: number,
  ): "high" | "medium" | "low" | "none" {
    if (accesses >= 50 && uniqueUsers >= 5) return "high";
    if (accesses >= 20 && uniqueUsers >= 3) return "medium";
    if (accesses >= 5 && uniqueUsers >= 1) return "low";
    return "none";
  }

  private getRecommendation(
    category: BetaPageAccess["category"],
    usage: "high" | "medium" | "low" | "none",
  ): {
    action: "promote" | "improve" | "archive" | "remove";
    reasoning: string;
  } {
    if (usage === "high") {
      return {
        action: "promote",
        reasoning:
          "Alto uso indica necessidade de integração ao menu principal",
      };
    }

    if (usage === "medium") {
      if (category === "em_testes") {
        return {
          action: "improve",
          reasoning: "Uso moderado em página de teste - melhorar e promover",
        };
      }
      return {
        action: "promote",
        reasoning: "Uso moderado justifica integração",
      };
    }

    if (usage === "low") {
      if (category === "obsoleto" || category === "duplicado") {
        return {
          action: "remove",
          reasoning: "Baixo uso em página obsoleta/duplicada",
        };
      }
      return {
        action: "improve",
        reasoning:
          "Baixo uso pode indicar problemas de UX ou falta de divulgação",
      };
    }

    // usage === "none"
    if (category === "obsoleto" || category === "duplicado") {
      return {
        action: "remove",
        reasoning: "Sem uso e categoria indica que pode ser removida",
      };
    }

    return {
      action: "archive",
      reasoning: "Sem uso recente - arquivar para revisão futura",
    };
  }
}

// Instância singleton
export const betaAccessLogger = BetaAccessLogger.getInstance();

// Hook para usar o logger
export const useBetaAccessLogger = () => {
  return {
    logAccess: betaAccessLogger.logPageAccess.bind(betaAccessLogger),
    logAction: betaAccessLogger.logPageAction.bind(betaAccessLogger),
    logExit: betaAccessLogger.logPageExit.bind(betaAccessLogger),
    generateReport: betaAccessLogger.generateUsageReport.bind(betaAccessLogger),
    exportCSV: betaAccessLogger.exportLogsAsCSV.bind(betaAccessLogger),
    cleanOld: betaAccessLogger.cleanOldLogs.bind(betaAccessLogger),
  };
};

// Funções utilitárias para tracking Beta
export const trackBetaPageAccess = (
  pageName: string,
  pageUrl: string,
  category: BetaPageAccess["category"],
): string => {
  return betaAccessLogger.logPageAccess(pageName, pageUrl, category);
};

export const trackBetaPageAction = (accessId: string, action: string): void => {
  betaAccessLogger.logPageAction(accessId, action);
};

export const trackBetaPageExit = (
  accessId: string,
  exitPath?: string,
): void => {
  betaAccessLogger.logPageExit(accessId, exitPath);
};
