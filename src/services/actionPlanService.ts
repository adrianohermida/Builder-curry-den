// Enhanced Action Plan Service with AI Analysis and Real-time Intelligence
import {
  ActionPlanState,
  ActionPlanTask,
  ModuleStatus,
  ExecutionLog,
  AIAnalysisResult,
  TechnicalIssue,
  AISuggestion,
  ActionPlanFilter,
  ModuleName,
  TaskStatus,
  TaskPriority,
  AIAnalysisType,
  ActionPlanVersion as ActionPlanVersionType,
  ActionPlanNotification,
  ExportOptions,
  ImportResult,
} from "@/types/actionPlan";

class ActionPlanService {
  private static instance: ActionPlanService;
  private state: ActionPlanState;
  private listeners: ((state: ActionPlanState) => void)[] = [];
  private analysisInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.state = this.initializeState();
    this.startAutoAnalysis();
  }

  static getInstance(): ActionPlanService {
    if (!ActionPlanService.instance) {
      ActionPlanService.instance = new ActionPlanService();
    }
    return ActionPlanService.instance;
  }

  // Initialize default state
  private initializeState(): ActionPlanState {
    const now = new Date().toISOString();

    return {
      versao_atual: {
        versao: "v2.0",
        data_criacao: now,
        usuario: "IA",
        resumo_alteracoes: "Sistema completo de plano de ação com IA integrada",
        status: "ativa",
        modulos_afetados: [
          "CRM Jurídico",
          "IA Jurídica",
          "GED",
          "Tarefas",
          "Publicações",
          "Atendimento",
          "Agenda",
          "Financeiro",
          "Configurações",
        ],
        total_tarefas_adicionadas: 0,
        total_tarefas_removidas: 0,
        hash_conteudo: this.generateHash(),
      },
      historico_versoes: [],
      modulos: this.initializeModules(),
      logs_execucao: [],
      analises_ia: [],
      configuracoes: {
        auto_analysis_enabled: true,
        analysis_frequency_hours: 6,
        notification_channels: ["in-app", "email"],
        escalation_rules: [
          {
            condition: "critical_tasks_overdue",
            threshold: 3,
            action: "notify_admin",
            recipients: ["admin@lawdesk.com"],
            enabled: true,
          },
        ],
        integration_endpoints: [],
        backup_retention_days: 30,
      },
      estatisticas_globais: {
        total_tarefas_sistema: 0,
        taxa_conclusao_global: 0,
        tempo_medio_resolucao: 0,
        modulos_criticos: 0,
        ia_sugestoes_implementadas: 0,
        economia_tempo_estimada: 0,
        roi_global_estimado: "R$ 0",
        ultima_atualizacao: now,
      },
    };
  }

  // Initialize modules with sample data
  private initializeModules(): ModuleStatus[] {
    const modules: ModuleName[] = [
      "CRM Jurídico",
      "IA Jurídica",
      "GED",
      "Tarefas",
      "Publicações",
      "Atendimento",
      "Agenda",
      "Financeiro",
      "Configurações",
    ];

    return modules.map((modulo) => ({
      modulo,
      tarefas_pendentes: [],
      em_execucao: [],
      concluidas: [],
      erros_pendencias: [],
      melhorias_sugeridas: [],
      ultima_atualizacao: new Date().toISOString(),
      metricas: {
        total_tarefas: 0,
        tarefas_concluidas: 0,
        taxa_conclusao: 0,
        tempo_medio_execucao: 0,
        bugs_ativos: 0,
        performance_score: 85,
        satisfaction_score: 80,
        last_deployment: new Date().toISOString(),
        uptime_percentage: 99.5,
        error_rate: 0.1,
      },
      integracoes_ativas: [],
      saude_geral: "boa",
    }));
  }

  // Subscribe to state changes
  subscribe(listener: (state: ActionPlanState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Notify listeners of state changes
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  // Get current state
  getState(): ActionPlanState {
    return { ...this.state };
  }

  // Version Management
  createVersion(
    resumo: string,
    usuario: "IA" | "dev" | "admin" = "IA",
  ): ActionPlanVersionType {
    const version = {
      versao: this.generateVersionNumber(),
      data_criacao: new Date().toISOString(),
      usuario,
      resumo_alteracoes: resumo,
      status: "ativa" as const,
      modulos_afetados: this.state.modulos.map((m) => m.modulo),
      total_tarefas_adicionadas: 0,
      total_tarefas_removidas: 0,
      hash_conteudo: this.generateHash(),
    };

    // Archive current version
    this.state.versao_atual.status = "archivada";
    this.state.historico_versoes.push(this.state.versao_atual);

    // Set new version
    this.state.versao_atual = version;

    this.notifyListeners();
    return version;
  }

  // Task Management
  addTask(
    task: Omit<ActionPlanTask, "id" | "data_criacao" | "progresso_percentual">,
  ): ActionPlanTask {
    const newTask: ActionPlanTask = {
      ...task,
      id: this.generateId(),
      data_criacao: new Date().toISOString(),
      progresso_percentual: 0,
    };

    const moduleIndex = this.state.modulos.findIndex(
      (m) => m.modulo === task.modulo,
    );
    if (moduleIndex !== -1) {
      const module = this.state.modulos[moduleIndex];

      switch (task.status) {
        case "pendente":
          module.tarefas_pendentes.push(newTask);
          break;
        case "em_execucao":
          module.em_execucao.push(newTask);
          break;
        case "concluida":
          module.concluidas.push(newTask);
          break;
      }

      module.ultima_atualizacao = new Date().toISOString();
      this.updateModuleMetrics(moduleIndex);
    }

    this.logAction(
      "task_created",
      "sucesso",
      "IA",
      task.modulo,
      `Tarefa criada: ${task.tarefa}`,
    );
    this.notifyListeners();

    return newTask;
  }

  updateTask(taskId: string, updates: Partial<ActionPlanTask>): boolean {
    for (const module of this.state.modulos) {
      const allTasks = [
        ...module.tarefas_pendentes,
        ...module.em_execucao,
        ...module.concluidas,
      ];

      const taskIndex = allTasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        const task = allTasks[taskIndex];
        const oldStatus = task.status;
        Object.assign(task, updates, {
          data_atualizacao: new Date().toISOString(),
        });

        // Move task between lists if status changed
        if (updates.status && updates.status !== oldStatus) {
          this.moveTaskBetweenLists(module, task, oldStatus, updates.status);
        }

        module.ultima_atualizacao = new Date().toISOString();
        this.updateModuleMetrics(
          this.state.modulos.findIndex((m) => m.modulo === module.modulo),
        );

        this.logAction(
          "task_updated",
          "sucesso",
          "manual",
          module.modulo,
          `Tarefa atualizada: ${task.tarefa}`,
        );

        this.notifyListeners();
        return true;
      }
    }
    return false;
  }

  deleteTask(taskId: string): boolean {
    for (const module of this.state.modulos) {
      const lists = ["tarefas_pendentes", "em_execucao", "concluidas"] as const;

      for (const listName of lists) {
        const taskIndex = module[listName].findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
          const task = module[listName][taskIndex];
          module[listName].splice(taskIndex, 1);

          module.ultima_atualizacao = new Date().toISOString();
          this.updateModuleMetrics(
            this.state.modulos.findIndex((m) => m.modulo === module.modulo),
          );

          this.logAction(
            "task_deleted",
            "sucesso",
            "manual",
            module.modulo,
            `Tarefa excluída: ${task.tarefa}`,
          );

          this.notifyListeners();
          return true;
        }
      }
    }
    return false;
  }

  // Move task between status lists
  private moveTaskBetweenLists(
    module: ModuleStatus,
    task: ActionPlanTask,
    oldStatus: TaskStatus,
    newStatus: TaskStatus,
  ): void {
    // Remove from old list
    const oldListMap = {
      pendente: "tarefas_pendentes",
      em_execucao: "em_execucao",
      concluida: "concluidas",
      erro: "tarefas_pendentes", // errors go back to pending
      cancelada: "tarefas_pendentes",
    } as const;

    const newListMap = {
      pendente: "tarefas_pendentes",
      em_execucao: "em_execucao",
      concluida: "concluidas",
      erro: "tarefas_pendentes",
      cancelada: "tarefas_pendentes",
    } as const;

    const oldList = module[oldListMap[oldStatus]];
    const newList = module[newListMap[newStatus]];

    const index = oldList.findIndex((t) => t.id === task.id);
    if (index !== -1) {
      oldList.splice(index, 1);
      newList.push(task);
    }
  }

  // AI Analysis System
  async runAIAnalysis(
    type: AIAnalysisType,
    scope: ModuleName | "global" = "global",
  ): Promise<AIAnalysisResult> {
    const analysisId = this.generateId();
    const timestamp = new Date().toISOString();

    // Simulate AI analysis (in real implementation, this would call actual AI services)
    const analysis = await this.performAnalysis(type, scope);

    const result: AIAnalysisResult = {
      id: analysisId,
      tipo_analise: type,
      timestamp,
      escopo: scope,
      resultados: analysis,
      recomendacoes: this.generateRecommendations(analysis, scope),
      confidence_level: this.calculateConfidenceLevel(analysis),
      proxima_analise_recomendada: new Date(
        Date.now() + 6 * 60 * 60 * 1000,
      ).toISOString(),
    };

    this.state.analises_ia.push(result);

    // Apply AI suggestions as tasks
    result.recomendacoes.forEach((task) => {
      this.addTask(task);
    });

    this.logAction(
      "ai_analysis_completed",
      "sucesso",
      "IA",
      scope === "global" ? "Configurações" : scope,
      `Análise ${type} concluída com ${result.recomendacoes.length} recomendações`,
    );

    this.notifyListeners();
    return result;
  }

  // Perform actual analysis logic
  private async performAnalysis(
    type: AIAnalysisType,
    scope: ModuleName | "global",
  ) {
    // Simulate analysis delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const baseFindings = {
      problemas_identificados: [],
      oportunidades_melhoria: [],
      metricas_performance: {
        load_time_avg: Math.random() * 3000 + 500,
        bundle_size: Math.random() * 500 + 200,
        memory_usage: Math.random() * 100 + 50,
        cpu_usage: Math.random() * 50 + 10,
        network_requests: Math.floor(Math.random() * 50 + 10),
        error_rate: Math.random() * 2,
        lighthouse_score: Math.floor(Math.random() * 20 + 80),
      },
      gaps_integracao: [],
      problemas_ux: [],
      comportamento_usuario: [],
    };

    // Add type-specific findings
    switch (type) {
      case "performance":
        baseFindings.problemas_identificados.push({
          id: this.generateId(),
          titulo: "Bundle size elevado detectado",
          descricao: "O tamanho do bundle JavaScript está acima do recomendado",
          tipo: "performance",
          severidade: "media",
          modulo: scope === "global" ? "Configurações" : scope,
          data_identificacao: new Date().toISOString(),
          status: "aberto",
          solucao_proposta: "Implementar lazy loading e code splitting",
        });
        break;

      case "integracao":
        if (scope !== "global") {
          baseFindings.gaps_integracao.push({
            modulo_origem: scope,
            modulo_destino: "CRM Jurídico",
            tipo_integracao: "dados",
            problema: "Sincronização de dados incompleta",
            impacto: "Dados podem ficar desatualizados",
            solucao_sugerida: "Implementar webhook real-time",
          });
        }
        break;

      case "ux":
        baseFindings.problemas_ux.push({
          componente: scope === "global" ? "Navigation" : `${scope}MainView`,
          problema: "Tempo de resposta lento em dispositivos móveis",
          impacto_usuario: "Frustração e abandono da funcionalidade",
          dispositivos_afetados: ["mobile"],
          solucao_recomendada:
            "Otimizar renderização e adicionar loading states",
          prioridade: "media",
        });
        break;

      case "comportamento":
        baseFindings.comportamento_usuario.push({
          padrao: "Usuários abandonam formulários longos",
          frequencia: 0.35,
          impacto_business: "Redução de 35% na conversão",
          oportunidade_melhoria: "Implementar wizard multi-step",
          acao_recomendada: "Quebrar formulários em etapas menores",
        });
        break;
    }

    return baseFindings;
  }

  // Generate AI recommendations based on analysis
  private generateRecommendations(
    analysis: any,
    scope: ModuleName | "global",
  ): ActionPlanTask[] {
    const recommendations: Omit<
      ActionPlanTask,
      "id" | "data_criacao" | "progresso_percentual"
    >[] = [];

    // Convert problems to tasks
    analysis.problemas_identificados.forEach((problema: TechnicalIssue) => {
      recommendations.push({
        tarefa: `Corrigir: ${problema.titulo}`,
        modulo: problema.modulo,
        prioridade: problema.severidade,
        status: "pendente",
        sugestao_IA: problema.solucao_proposta,
        detalhamento: problema.descricao,
        estimativa_horas: this.estimateHours(problema.severidade),
        tags: ["ia-gerada", "bug-fix", problema.tipo],
      });
    });

    // Convert UX issues to tasks
    analysis.problemas_ux.forEach((ux: any) => {
      recommendations.push({
        tarefa: `Melhorar UX: ${ux.componente}`,
        modulo: scope === "global" ? "Configurações" : scope,
        prioridade: ux.prioridade,
        status: "pendente",
        sugestao_IA: ux.solucao_recomendada,
        detalhamento: `${ux.problema}. Impacto: ${ux.impacto_usuario}`,
        estimativa_horas: this.estimateHours(ux.prioridade),
        tags: ["ia-gerada", "ux-improvement"],
      });
    });

    // Convert integration gaps to tasks
    analysis.gaps_integracao.forEach((gap: any) => {
      recommendations.push({
        tarefa: `Integração: ${gap.modulo_origem} ↔ ${gap.modulo_destino}`,
        modulo: gap.modulo_origem,
        prioridade: "alta",
        status: "pendente",
        sugestao_IA: gap.solucao_sugerida,
        detalhamento: `${gap.problema}. ${gap.impacto}`,
        estimativa_horas: 16,
        tags: ["ia-gerada", "integration", gap.tipo_integracao],
      });
    });

    return recommendations.map((rec) => ({
      ...rec,
      id: this.generateId(),
      data_criacao: new Date().toISOString(),
      progresso_percentual: 0,
    }));
  }

  // Estimate hours based on priority
  private estimateHours(priority: TaskPriority): number {
    switch (priority) {
      case "critica":
        return 24;
      case "alta":
        return 16;
      case "media":
        return 8;
      case "baixa":
        return 4;
      default:
        return 8;
    }
  }

  // Calculate confidence level for analysis
  private calculateConfidenceLevel(analysis: any): number {
    let score = 70; // Base confidence

    // More findings = higher confidence
    const totalFindings =
      analysis.problemas_identificados.length +
      analysis.problemas_ux.length +
      analysis.gaps_integracao.length;

    score += Math.min(totalFindings * 5, 25);

    // Good performance metrics = higher confidence
    if (analysis.metricas_performance.lighthouse_score > 90) score += 5;
    if (analysis.metricas_performance.error_rate < 1) score += 5;

    return Math.min(score, 95);
  }

  // Start automatic analysis
  private startAutoAnalysis(): void {
    if (this.state.configuracoes.auto_analysis_enabled) {
      const intervalMs =
        this.state.configuracoes.analysis_frequency_hours * 60 * 60 * 1000;

      this.analysisInterval = setInterval(() => {
        // Run different types of analysis in rotation
        const analysisTypes: AIAnalysisType[] = [
          "performance",
          "integracao",
          "ux",
          "comportamento",
        ];
        const randomType =
          analysisTypes[Math.floor(Math.random() * analysisTypes.length)];

        this.runAIAnalysis(randomType, "global").catch(console.error);
      }, intervalMs);
    }
  }

  // Stop automatic analysis
  stopAutoAnalysis(): void {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }
  }

  // Logging system
  private logAction(
    acao: string,
    resultado: "sucesso" | "erro" | "warning",
    origem: "manual" | "IA" | "automatizada",
    modulo: ModuleName,
    detalhes: string,
    tempoExecucao: number = 0,
  ): void {
    const log: ExecutionLog = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      acao_executada: acao,
      resultado,
      origem,
      modulo_afetado: modulo,
      tempo_execucao: tempoExecucao,
      detalhes: [
        {
          tipo: "ui",
          recurso: modulo,
          acao,
          status: resultado === "sucesso" ? "info" : resultado,
          mensagem: detalhes,
        },
      ],
    };

    this.state.logs_execucao.unshift(log);

    // Keep only last 1000 logs
    if (this.state.logs_execucao.length > 1000) {
      this.state.logs_execucao = this.state.logs_execucao.slice(0, 1000);
    }
  }

  // Update module metrics
  private updateModuleMetrics(moduleIndex: number): void {
    if (moduleIndex < 0 || moduleIndex >= this.state.modulos.length) return;

    const module = this.state.modulos[moduleIndex];
    const totalTasks =
      module.tarefas_pendentes.length +
      module.em_execucao.length +
      module.concluidas.length;

    module.metricas = {
      ...module.metricas,
      total_tarefas: totalTasks,
      tarefas_concluidas: module.concluidas.length,
      taxa_conclusao:
        totalTasks > 0 ? (module.concluidas.length / totalTasks) * 100 : 0,
      bugs_ativos: module.erros_pendencias.filter((e) => e.tipo === "bug")
        .length,
    };

    // Update module health
    if (module.metricas.taxa_conclusao > 90) {
      module.saude_geral = "excelente";
    } else if (module.metricas.taxa_conclusao > 75) {
      module.saude_geral = "boa";
    } else if (module.metricas.taxa_conclusao > 50) {
      module.saude_geral = "regular";
    } else {
      module.saude_geral = "critica";
    }
  }

  // Filter and search
  filterTasks(filter: ActionPlanFilter): ActionPlanTask[] {
    let allTasks: ActionPlanTask[] = [];

    this.state.modulos.forEach((module) => {
      if (!filter.modulos || filter.modulos.includes(module.modulo)) {
        allTasks = allTasks.concat([
          ...module.tarefas_pendentes,
          ...module.em_execucao,
          ...module.concluidas,
        ]);
      }
    });

    // Apply filters
    if (filter.status) {
      allTasks = allTasks.filter((task) =>
        filter.status!.includes(task.status),
      );
    }

    if (filter.prioridade) {
      allTasks = allTasks.filter((task) =>
        filter.prioridade!.includes(task.prioridade),
      );
    }

    if (filter.responsavel) {
      allTasks = allTasks.filter(
        (task) =>
          task.responsavel && filter.responsavel!.includes(task.responsavel),
      );
    }

    if (filter.tags) {
      allTasks = allTasks.filter(
        (task) =>
          task.tags && filter.tags!.some((tag) => task.tags!.includes(tag)),
      );
    }

    if (filter.apenas_ia_sugeridas) {
      allTasks = allTasks.filter((task) => !!task.sugestao_IA);
    }

    if (filter.data_inicio) {
      allTasks = allTasks.filter(
        (task) => task.data_criacao >= filter.data_inicio!,
      );
    }

    if (filter.data_fim) {
      allTasks = allTasks.filter(
        (task) => task.data_criacao <= filter.data_fim!,
      );
    }

    return allTasks;
  }

  // Export functionality
  exportData(options: ExportOptions): string {
    const data = {
      metadata: {
        versao: this.state.versao_atual.versao,
        data_exportacao: new Date().toISOString(),
        formato: options.formato,
        escopo: options.escopo,
      },
      modulos: this.state.modulos,
      ...(options.incluir_logs && { logs: this.state.logs_execucao }),
      ...(options.incluir_historico && {
        historico: this.state.historico_versoes,
      }),
    };

    switch (options.formato) {
      case "json":
        return JSON.stringify(data, null, 2);
      case "csv":
        return this.convertToCSV(data);
      default:
        return JSON.stringify(data, null, 2);
    }
  }

  // Convert data to CSV format
  private convertToCSV(data: any): string {
    const headers = [
      "Módulo",
      "Tarefa",
      "Status",
      "Prioridade",
      "Data Criação",
      "Progresso %",
      "Responsável",
      "Estimativa Horas",
    ];

    const rows = [headers.join(",")];

    data.modulos.forEach((module: ModuleStatus) => {
      const allTasks = [
        ...module.tarefas_pendentes,
        ...module.em_execucao,
        ...module.concluidas,
      ];

      allTasks.forEach((task) => {
        const row = [
          module.modulo,
          `"${task.tarefa}"`,
          task.status,
          task.prioridade,
          task.data_criacao,
          task.progresso_percentual,
          task.responsavel || "",
          task.estimativa_horas || "",
        ];
        rows.push(row.join(","));
      });
    });

    return rows.join("\n");
  }

  // Utility functions
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateVersionNumber(): string {
    const current = this.state.versao_atual.versao;
    const match = current.match(/v(\d+)\.(\d+)/);
    if (match) {
      const major = parseInt(match[1]);
      const minor = parseInt(match[2]);
      return `v${major}.${minor + 1}`;
    }
    return "v2.1";
  }

  private generateHash(): string {
    const content = JSON.stringify(this.state.modulos);
    return btoa(content).substr(0, 8);
  }

  // Cleanup
  dispose(): void {
    this.stopAutoAnalysis();
    this.listeners = [];
  }
}

export default ActionPlanService;
