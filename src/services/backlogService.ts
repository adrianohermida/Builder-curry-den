// Enhanced Backlog Service with AI Integration
import {
  BacklogItem,
  BacklogState,
  BacklogColumn,
  BacklogCategory,
  BacklogPriority,
  BacklogStatus,
  BacklogFilter,
  AIBacklogAnalysis,
  ViabilityAnalysis,
  ProcessingHistory,
  BacklogStatistics,
  BacklogExportOptions,
  BacklogImportOptions,
  ChecklistItem,
  BacklogAttachment,
  BacklogComment,
  AIProcessingQueue,
  ImpactAnalysis,
  BacklogTemplate,
} from "@/types/backlog";

import ActionPlanService from "./actionPlanService";
import { ActionPlanTask } from "@/types/actionPlan";

class BacklogService {
  private static instance: BacklogService;
  private state: BacklogState;
  private listeners: ((state: BacklogState) => void)[] = [];
  private processingQueue: AIProcessingQueue;
  private processingInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.state = this.initializeState();
    this.processingQueue = this.initializeProcessingQueue();
    this.startAutoProcessing();
  }

  static getInstance(): BacklogService {
    if (!BacklogService.instance) {
      BacklogService.instance = new BacklogService();
    }
    return BacklogService.instance;
  }

  // Initialize default state
  private initializeState(): BacklogState {
    const now = new Date().toISOString();

    return {
      items: this.generateSampleBacklogItems(),
      colunas: [
        {
          id: "ideias",
          titulo: "💡 Ideias / Brainstorms",
          descricao: "Novas ideias e sugestões para melhorias",
          cor: "#3B82F6",
          ordem: 1,
          auto_movimento: false,
        },
        {
          id: "em_analise",
          titulo: "📋 Em Análise",
          descricao: "Itens sendo analisados pela equipe ou IA",
          cor: "#F59E0B",
          ordem: 2,
          auto_movimento: true,
        },
        {
          id: "em_execucao",
          titulo: "⚙️ Em Execução",
          descricao: "Itens aprovados e em desenvolvimento",
          cor: "#EF4444",
          ordem: 3,
          auto_movimento: true,
        },
        {
          id: "concluido",
          titulo: "✅ Concluído",
          descricao: "Itens finalizados e implementados",
          cor: "#10B981",
          ordem: 4,
          auto_movimento: true,
        },
        {
          id: "arquivado",
          titulo: "🗂️ Arquivado",
          descricao: "Itens descartados ou cancelados",
          cor: "#6B7280",
          ordem: 5,
          auto_movimento: true,
        },
      ],
      filtros: {
        apenas_com_ia: false,
        apenas_aprovados: false,
      },
      configuracoes: {
        auto_analysis_enabled: true,
        analysis_frequency_hours: 2,
        auto_move_approved: true,
        require_approval_for_execution: false,
        max_items_per_column: 50,
        notification_settings: {
          notify_new_items: true,
          notify_ia_analysis: true,
          notify_status_changes: true,
          notify_approvals: true,
          channels: ["in_app"],
          recipients: [],
        },
        integration_settings: {
          sync_with_action_plan: true,
          auto_create_tasks: true,
          connect_related_items: true,
          import_external_backlog: false,
          export_formats: ["json", "csv"],
        },
      },
      estatisticas: this.calculateStatistics([]),
      historico_processamento: [],
    };
  }

  // Initialize processing queue
  private initializeProcessingQueue(): AIProcessingQueue {
    return {
      items_pendentes: [],
      status: "idle",
      configuracao: {
        batch_size: 5,
        timeout_per_item: 30000, // 30 seconds
        retry_attempts: 3,
      },
    };
  }

  // Generate sample backlog items
  private generateSampleBacklogItems(): BacklogItem[] {
    const now = new Date().toISOString();

    return [
      {
        id: "backlog_1",
        titulo: "Implementar Dark Mode Inteligente",
        descricao:
          "Sistema de dark mode que se adapta automaticamente baseado no horário e preferências do usuário, com transições suaves e preservação de contraste para acessibilidade.",
        categoria: "UX",
        modulo_impactado: "Configurações",
        prioridade: "alta",
        status: "aprovado",
        coluna: "ideias",
        usuario_criador: "design_team",
        data_criacao: now,
        tags: ["ui", "acessibilidade", "user-experience"],
        checklist: [
          {
            id: "check_1",
            texto: "Pesquisar padrões de dark mode",
            concluido: true,
            data_criacao: now,
          },
          {
            id: "check_2",
            texto: "Definir paleta de cores",
            concluido: false,
            data_criacao: now,
          },
        ],
        tempo_estimado: 40,
        progresso_percentual: 15,
      },
      {
        id: "backlog_2",
        titulo: "IA para Análise Automática de Contratos",
        descricao:
          "Desenvolvimento de IA capaz de analisar contratos jurídicos, identificar cláusulas problemáticas, prazos importantes e sugerir melhorias baseadas em precedentes.",
        categoria: "LegalTech",
        modulo_impactado: "IA Jurídica",
        prioridade: "critica",
        status: "aprovado",
        coluna: "em_analise",
        usuario_criador: "legal_team",
        data_criacao: now,
        tags: ["ia", "nlp", "contratos", "automation"],
        tempo_estimado: 120,
        progresso_percentual: 0,
        analise_ia: {
          id: "ai_analysis_1",
          data_analise: now,
          confidence_score: 92,
          classificacao: {
            acao_imediata: true,
            necessita_validacao: false,
            sugestao_futura: false,
            rejeitada: false,
            motivo_classificacao:
              "Alto valor de negócio e viabilidade técnica comprovada",
          },
          analise_tecnica: {
            complexidade_estimada: "complexa",
            riscos_identificados: [
              "Necessita treinamento de modelo específico",
              "Integração com APIs de NLP",
              "Validação jurídica obrigatória",
            ],
            dependencias_tecnicas: [
              "Azure OpenAI Service",
              "Sistema de upload de documentos",
              "Base de conhecimento jurídico",
            ],
            recursos_necessarios: [
              "Especialista em NLP",
              "Advogado para validação",
              "Dataset de contratos",
            ],
          },
          recomendacoes: [
            "Implementar MVP com funcionalidades básicas",
            "Criar pipeline de validação humana",
            "Desenvolver interface intuitiva para lawyers",
          ],
        },
      },
      {
        id: "backlog_3",
        titulo: "Otimização de Performance Mobile",
        descricao:
          "Melhoria significativa da performance em dispositivos móveis, incluindo lazy loading inteligente, otimização de imagens e cache estratégico.",
        categoria: "Performance",
        modulo_impactado: "Global",
        prioridade: "media",
        status: "rascunho",
        coluna: "ideias",
        usuario_criador: "mobile_team",
        data_criacao: now,
        tags: ["mobile", "performance", "optimization"],
        tempo_estimado: 60,
        progresso_percentual: 0,
      },
      {
        id: "backlog_4",
        titulo: "Sistema de Notificações Push Inteligentes",
        descricao:
          "Sistema de notificações que aprende com o comportamento do usuário para enviar notificações relevantes no momento certo, evitando spam.",
        categoria: "AI",
        modulo_impactado: "Atendimento",
        prioridade: "alta",
        status: "aprovado",
        coluna: "em_execucao",
        usuario_criador: "product_team",
        data_criacao: now,
        tags: ["notifications", "ai", "personalization"],
        tempo_estimado: 80,
        progresso_percentual: 45,
      },
      {
        id: "backlog_5",
        titulo: "Dashboard Executivo com Métricas Jurídicas",
        descricao:
          "Dashboard especializado para sócios com KPIs jurídicos específicos: taxa de sucesso em processos, ROI por tipo de caso, análise de rentabilidade por advogado.",
        categoria: "Analytics",
        modulo_impactado: "Dashboard",
        prioridade: "alta",
        status: "concluido",
        coluna: "concluido",
        usuario_criador: "executive_team",
        data_criacao: now,
        tags: ["dashboard", "kpi", "executive"],
        tempo_estimado: 50,
        progresso_percentual: 100,
      },
    ];
  }

  // Subscribe to state changes
  subscribe(listener: (state: BacklogState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Notify listeners
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  // Get current state
  getState(): BacklogState {
    return { ...this.state };
  }

  // Create new backlog item
  createBacklogItem(
    item: Omit<BacklogItem, "id" | "data_criacao" | "progresso_percentual">,
  ): BacklogItem {
    const newItem: BacklogItem = {
      ...item,
      id: this.generateId(),
      data_criacao: new Date().toISOString(),
      progresso_percentual: 0,
    };

    this.state.items.push(newItem);
    this.updateStatistics();

    // Queue for AI analysis if enabled
    if (this.state.configuracoes.auto_analysis_enabled) {
      this.queueForAnalysis(newItem.id);
    }

    this.notifyListeners();
    return newItem;
  }

  // Update backlog item
  updateBacklogItem(id: string, updates: Partial<BacklogItem>): boolean {
    const itemIndex = this.state.items.findIndex((item) => item.id === id);
    if (itemIndex === -1) return false;

    const currentItem = this.state.items[itemIndex];
    const updatedItem = {
      ...currentItem,
      ...updates,
      data_atualizacao: new Date().toISOString(),
    };

    // Track column movement
    if (updates.coluna && updates.coluna !== currentItem.coluna) {
      this.trackMovement(id, currentItem.coluna, updates.coluna, false);
    }

    this.state.items[itemIndex] = updatedItem;
    this.updateStatistics();
    this.notifyListeners();

    return true;
  }

  // Move item between columns
  moveItem(
    id: string,
    targetColumn: BacklogColumn,
    usuario: string = "system",
  ): boolean {
    const item = this.state.items.find((item) => item.id === id);
    if (!item) return false;

    const oldColumn = item.coluna;

    this.updateBacklogItem(id, { coluna: targetColumn });
    this.trackMovement(id, oldColumn, targetColumn, false, usuario);

    return true;
  }

  // Delete backlog item
  deleteBacklogItem(id: string): boolean {
    const initialLength = this.state.items.length;
    this.state.items = this.state.items.filter((item) => item.id !== id);

    if (this.state.items.length < initialLength) {
      this.updateStatistics();
      this.notifyListeners();
      return true;
    }

    return false;
  }

  // Queue item for AI analysis
  private queueForAnalysis(itemId: string): void {
    if (!this.processingQueue.items_pendentes.includes(itemId)) {
      this.processingQueue.items_pendentes.push(itemId);
    }
  }

  // Start auto processing
  private startAutoProcessing(): void {
    if (this.state.configuracoes.auto_analysis_enabled) {
      const intervalMs =
        this.state.configuracoes.analysis_frequency_hours * 60 * 60 * 1000;

      this.processingInterval = setInterval(() => {
        this.processBacklogWithAI();
      }, intervalMs);
    }
  }

  // Stop auto processing
  stopAutoProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }

  // Process backlog with AI
  async processBacklogWithAI(): Promise<void> {
    if (this.processingQueue.status === "processing") return;

    this.processingQueue.status = "processing";
    this.processingQueue.ultima_execucao = new Date().toISOString();

    const startTime = Date.now();
    let processedItems = 0;
    let approvedItems = 0;
    let rejectedItems = 0;
    let movedItems = 0;
    let createdTasks = 0;

    try {
      // Get items in "ideias" column for analysis
      const itemsToAnalyze = this.state.items
        .filter((item) => item.coluna === "ideias" && !item.analise_ia)
        .slice(0, this.processingQueue.configuracao.batch_size);

      for (const item of itemsToAnalyze) {
        try {
          // Simulate AI analysis
          const analysis = await this.performAIAnalysis(item);

          // Update item with analysis
          this.updateBacklogItem(item.id, {
            analise_ia: analysis,
            data_atualizacao: new Date().toISOString(),
          });

          processedItems++;

          // Apply AI recommendations
          if (analysis.classificacao.acao_imediata) {
            // Move to execution or create task
            if (this.state.configuracoes.auto_create_tasks) {
              await this.createActionPlanTask(item);
              createdTasks++;
            }

            if (this.state.configuracoes.auto_move_approved) {
              this.moveItem(item.id, "em_execucao", "IA");
              movedItems++;
            }

            approvedItems++;
          } else if (analysis.classificacao.sugestao_futura) {
            this.moveItem(item.id, "em_analise", "IA");
            movedItems++;
          } else if (analysis.classificacao.rejeitada) {
            this.moveItem(item.id, "arquivado", "IA");
            movedItems++;
            rejectedItems++;
          }

          // Connect with existing tasks if synergy detected
          if (analysis.sinergia_detectada) {
            await this.processSynergy(item, analysis.sinergia_detectada);
          }
        } catch (error) {
          console.error(`Error processing item ${item.id}:`, error);
        }
      }

      // Record processing history
      const processingTime = Date.now() - startTime;
      this.recordProcessingHistory({
        items_processados: processedItems,
        items_aprovados: approvedItems,
        items_rejeitados: rejectedItems,
        items_movidos: movedItems,
        tarefas_criadas: createdTasks,
        tempo_processamento: processingTime,
      });
    } catch (error) {
      console.error("Error in AI processing:", error);
      this.processingQueue.status = "error";
    } finally {
      this.processingQueue.status = "idle";
      this.processingQueue.proxima_execucao = new Date(
        Date.now() +
          this.state.configuracoes.analysis_frequency_hours * 60 * 60 * 1000,
      ).toISOString();
    }

    this.updateStatistics();
    this.notifyListeners();
  }

  // Perform AI analysis on item
  private async performAIAnalysis(
    item: BacklogItem,
  ): Promise<AIBacklogAnalysis> {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const analysis: AIBacklogAnalysis = {
      id: this.generateId(),
      data_analise: new Date().toISOString(),
      confidence_score: Math.floor(Math.random() * 30) + 70, // 70-100%

      classificacao: this.classifyItem(item),

      analise_tecnica: {
        complexidade_estimada: this.estimateComplexity(item),
        riscos_identificados: this.identifyRisks(item),
        dependencias_tecnicas: this.identifyDependencies(item),
        recursos_necessarios: this.identifyResources(item),
      },

      recomendacoes: this.generateRecommendations(item),
    };

    // Check for synergy with existing tasks
    analysis.sinergia_detectada = await this.detectSynergy(item);

    return analysis;
  }

  // Classify item based on AI analysis
  private classifyItem(item: BacklogItem) {
    const score = this.calculateItemScore(item);

    if (score >= 80) {
      return {
        acao_imediata: true,
        necessita_validacao: false,
        sugestao_futura: false,
        rejeitada: false,
        motivo_classificacao: "Alto valor de negócio e viabilidade técnica",
      };
    } else if (score >= 60) {
      return {
        acao_imediata: false,
        necessita_validacao: true,
        sugestao_futura: true,
        rejeitada: false,
        motivo_classificacao: "Boa ideia, necessita validação técnica",
      };
    } else if (score >= 40) {
      return {
        acao_imediata: false,
        necessita_validacao: false,
        sugestao_futura: true,
        rejeitada: false,
        motivo_classificacao: "Implementação futura recomendada",
      };
    } else {
      return {
        acao_imediata: false,
        necessita_validacao: false,
        sugestao_futura: false,
        rejeitada: true,
        motivo_classificacao: "Baixo retorno ou alta complexidade",
      };
    }
  }

  // Calculate item score
  private calculateItemScore(item: BacklogItem): number {
    let score = 50; // Base score

    // Priority weight
    switch (item.prioridade) {
      case "critica":
        score += 30;
        break;
      case "alta":
        score += 20;
        break;
      case "media":
        score += 10;
        break;
      case "baixa":
        score += 0;
        break;
    }

    // Category weight
    const categoryWeights = {
      LegalTech: 25,
      AI: 20,
      Performance: 15,
      UX: 15,
      Segurança: 20,
      Backend: 10,
      Visual: 5,
      Integração: 15,
      Mobile: 10,
      Analytics: 12,
      Compliance: 18,
      Workflow: 12,
    };

    score += categoryWeights[item.categoria] || 5;

    // Description quality
    if (item.descricao.length > 100) score += 10;
    if (item.descricao.length > 200) score += 5;

    // Has checklist
    if (item.checklist && item.checklist.length > 0) score += 5;

    // Randomness for simulation
    score += Math.floor(Math.random() * 20) - 10;

    return Math.max(0, Math.min(100, score));
  }

  // Estimate complexity
  private estimateComplexity(
    item: BacklogItem,
  ): "simples" | "media" | "complexa" {
    const complexityIndicators = {
      AI: "complexa",
      LegalTech: "complexa",
      Backend: "media",
      Integração: "media",
      UX: "simples",
      Visual: "simples",
      Performance: "media",
      Segurança: "complexa",
      Mobile: "media",
      Analytics: "media",
      Compliance: "complexa",
      Workflow: "media",
    };

    return complexityIndicators[item.categoria] || "media";
  }

  // Identify risks
  private identifyRisks(item: BacklogItem): string[] {
    const risks: string[] = [];

    if (item.categoria === "AI") {
      risks.push("Necessita treinamento de modelo", "Accuracy pode variar");
    }

    if (item.categoria === "Segurança") {
      risks.push("Impacto em dados sensíveis", "Requer auditoria de segurança");
    }

    if (item.prioridade === "critica") {
      risks.push("Pressão de tempo", "Pode impactar outros projetos");
    }

    if (!item.tempo_estimado) {
      risks.push("Estimativa de tempo indefinida");
    }

    return risks;
  }

  // Identify dependencies
  private identifyDependencies(item: BacklogItem): string[] {
    const deps: string[] = [];

    if (item.categoria === "AI") {
      deps.push("Azure OpenAI Service", "Dataset de treinamento");
    }

    if (item.categoria === "Mobile") {
      deps.push("React Native atualizado", "Testes em dispositivos");
    }

    if (item.categoria === "Backend") {
      deps.push("Database migration", "API documentation");
    }

    return deps;
  }

  // Identify resources
  private identifyResources(item: BacklogItem): string[] {
    const resources: string[] = [];

    const categoryResources = {
      AI: ["Especialista em ML", "Dataset", "GPU para treinamento"],
      LegalTech: ["Advogado especialista", "Base de conhecimento jurídico"],
      UX: ["UI/UX Designer", "Testes de usabilidade"],
      Backend: ["Desenvolvedor Backend", "DBA"],
      Mobile: ["Desenvolvedor Mobile", "Dispositivos para teste"],
      Performance: ["Especialista em Performance", "Ferramentas de profiling"],
      Segurança: ["Especialista em Segurança", "Auditoria externa"],
    };

    return categoryResources[item.categoria] || ["Desenvolvedor Full-stack"];
  }

  // Generate recommendations
  private generateRecommendations(item: BacklogItem): string[] {
    const recommendations: string[] = [];

    if (!item.tempo_estimado) {
      recommendations.push("Definir estimativa de tempo mais precisa");
    }

    if (!item.checklist || item.checklist.length === 0) {
      recommendations.push("Criar checklist detalhado de implementação");
    }

    if (item.categoria === "AI") {
      recommendations.push("Implementar MVP para validação inicial");
      recommendations.push("Criar pipeline de validação humana");
    }

    if (item.prioridade === "critica") {
      recommendations.push("Alocar desenvolvedor sênior");
      recommendations.push("Implementar monitoramento especial");
    }

    return recommendations;
  }

  // Detect synergy with existing tasks
  private async detectSynergy(
    item: BacklogItem,
  ): Promise<AIBacklogAnalysis["sinergia_detectada"]> {
    const actionPlanService = ActionPlanService.getInstance();
    const actionPlanState = actionPlanService.getState();

    const synergies: NonNullable<AIBacklogAnalysis["sinergia_detectada"]> = [];

    // Check all existing tasks
    for (const module of actionPlanState.modulos) {
      const allTasks = [
        ...module.tarefas_pendentes,
        ...module.em_execucao,
        ...module.concluidas,
      ];

      for (const task of allTasks) {
        const similarity = this.calculateSimilarity(item, task);

        if (similarity > 0.7) {
          synergies.push({
            tarefa_relacionada_id: task.id,
            tipo_relacao: similarity > 0.9 ? "duplicata" : "complemento",
            descricao_relacao: `${Math.round(similarity * 100)}% de similaridade com "${task.tarefa}"`,
            acao_recomendada: similarity > 0.9 ? "fundir" : "conectar",
          });
        }
      }
    }

    return synergies.length > 0 ? synergies : undefined;
  }

  // Calculate similarity between backlog item and task
  private calculateSimilarity(item: BacklogItem, task: ActionPlanTask): number {
    let similarity = 0;

    // Title similarity (basic keyword matching)
    const itemWords = item.titulo.toLowerCase().split(" ");
    const taskWords = task.tarefa.toLowerCase().split(" ");
    const commonWords = itemWords.filter((word) => taskWords.includes(word));
    similarity +=
      (commonWords.length / Math.max(itemWords.length, taskWords.length)) * 0.4;

    // Module similarity
    if (item.modulo_impactado === task.modulo) {
      similarity += 0.3;
    }

    // Priority similarity
    const priorityMap = { baixa: 1, media: 2, alta: 3, critica: 4 };
    const itemPriority = priorityMap[item.prioridade];
    const taskPriority = priorityMap[task.prioridade];
    if (Math.abs(itemPriority - taskPriority) <= 1) {
      similarity += 0.2;
    }

    // Tags similarity
    if (item.tags && task.tags) {
      const commonTags = item.tags.filter((tag) => task.tags!.includes(tag));
      similarity +=
        (commonTags.length / Math.max(item.tags.length, task.tags.length)) *
        0.1;
    }

    return Math.min(1, similarity);
  }

  // Process synergy
  private async processSynergy(
    item: BacklogItem,
    synergies: NonNullable<AIBacklogAnalysis["sinergia_detectada"]>,
  ): Promise<void> {
    for (const synergy of synergies) {
      if (synergy.acao_recomendada === "conectar") {
        // Link items
        this.updateBacklogItem(item.id, {
          tarefas_relacionadas: [
            ...(item.tarefas_relacionadas || []),
            synergy.tarefa_relacionada_id,
          ],
        });
      }
    }
  }

  // Create action plan task from backlog item
  private async createActionPlanTask(item: BacklogItem): Promise<void> {
    const actionPlanService = ActionPlanService.getInstance();

    const task = {
      tarefa: item.titulo,
      modulo: item.modulo_impactado as any,
      prioridade: item.prioridade as any,
      status: "pendente" as const,
      detalhamento: item.descricao,
      sugestao_IA: `Originado do backlog: ${item.id}`,
      estimativa_horas: item.tempo_estimado,
      tags: [...(item.tags || []), "backlog-originated"],
    };

    const createdTask = actionPlanService.addTask(task);

    // Link back to backlog item
    this.updateBacklogItem(item.id, {
      tarefas_relacionadas: [
        ...(item.tarefas_relacionadas || []),
        createdTask.id,
      ],
    });
  }

  // Track movement history
  private trackMovement(
    itemId: string,
    fromColumn: BacklogColumn,
    toColumn: BacklogColumn,
    automatic: boolean,
    usuario: string = "system",
  ): void {
    const item = this.state.items.find((i) => i.id === itemId);
    if (!item) return;

    const movement = {
      id: this.generateId(),
      de_coluna: fromColumn,
      para_coluna: toColumn,
      data_movimento: new Date().toISOString(),
      usuario,
      automatico: automatic,
    };

    if (!item.historico_movimentacao) {
      item.historico_movimentacao = [];
    }

    item.historico_movimentacao.push(movement);
  }

  // Record processing history
  private recordProcessingHistory(data: Partial<ProcessingHistory>): void {
    const history: ProcessingHistory = {
      id: this.generateId(),
      data_processamento: new Date().toISOString(),
      items_processados: 0,
      items_aprovados: 0,
      items_rejeitados: 0,
      items_movidos: 0,
      tarefas_criadas: 0,
      tempo_processamento: 0,
      confianca_media: 0,
      detalhes: [],
      ...data,
    };

    this.state.historico_processamento.unshift(history);

    // Keep only last 50 records
    if (this.state.historico_processamento.length > 50) {
      this.state.historico_processamento =
        this.state.historico_processamento.slice(0, 50);
    }
  }

  // Calculate statistics
  private calculateStatistics(
    items: BacklogItem[] = this.state.items,
  ): BacklogStatistics {
    const total = items.length;

    const itemsPorColuna = items.reduce(
      (acc, item) => {
        acc[item.coluna] = (acc[item.coluna] || 0) + 1;
        return acc;
      },
      {} as Record<BacklogColumn, number>,
    );

    const itemsPorCategoria = items.reduce(
      (acc, item) => {
        acc[item.categoria] = (acc[item.categoria] || 0) + 1;
        return acc;
      },
      {} as Record<BacklogCategory, number>,
    );

    const itemsPorPrioridade = items.reduce(
      (acc, item) => {
        acc[item.prioridade] = (acc[item.prioridade] || 0) + 1;
        return acc;
      },
      {} as Record<BacklogPriority, number>,
    );

    const itemsAprovados = items.filter((i) => i.status === "aprovado").length;
    const itemsConcluidos = items.filter(
      (i) => i.coluna === "concluido",
    ).length;

    return {
      total_items: total,
      items_por_coluna: itemsPorColuna,
      items_por_categoria: itemsPorCategoria,
      items_por_prioridade: itemsPorPrioridade,
      taxa_aprovacao: total > 0 ? (itemsAprovados / total) * 100 : 0,
      taxa_execucao: total > 0 ? (itemsConcluidos / total) * 100 : 0,
      tempo_medio_ciclo: this.calculateAverageCycleTime(items),
      items_processados_mes: this.countItemsThisMonth(items),
      roi_total_estimado: this.calculateTotalROI(items),
      score_viabilidade_media: this.calculateAverageViabilityScore(items),
      ultima_atualizacao: new Date().toISOString(),
    };
  }

  // Calculate average cycle time
  private calculateAverageCycleTime(items: BacklogItem[]): number {
    const completedItems = items.filter((i) => i.coluna === "concluido");
    if (completedItems.length === 0) return 0;

    const totalDays = completedItems.reduce((sum, item) => {
      const created = new Date(item.data_criacao).getTime();
      const completed = new Date(
        item.data_atualizacao || item.data_criacao,
      ).getTime();
      return sum + (completed - created) / (1000 * 60 * 60 * 24);
    }, 0);

    return totalDays / completedItems.length;
  }

  // Count items created this month
  private countItemsThisMonth(items: BacklogItem[]): number {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    return items.filter((item) => new Date(item.data_criacao) >= thisMonth)
      .length;
  }

  // Calculate total ROI
  private calculateTotalROI(items: BacklogItem[]): number {
    return items.reduce((sum, item) => {
      if (item.roi_estimado) {
        const value =
          parseFloat(item.roi_estimado.replace(/[^\d.-]/g, "")) || 0;
        return sum + value;
      }
      return sum;
    }, 0);
  }

  // Calculate average viability score
  private calculateAverageViabilityScore(items: BacklogItem[]): number {
    const itemsWithViability = items.filter(
      (i) => i.viabilidade?.score_viabilidade,
    );
    if (itemsWithViability.length === 0) return 0;

    const totalScore = itemsWithViability.reduce(
      (sum, item) => sum + (item.viabilidade!.score_viabilidade || 0),
      0,
    );

    return totalScore / itemsWithViability.length;
  }

  // Update statistics
  private updateStatistics(): void {
    this.state.estatisticas = this.calculateStatistics();
  }

  // Filter items
  filterItems(filter: BacklogFilter): BacklogItem[] {
    let filtered = [...this.state.items];

    if (filter.categoria && filter.categoria.length > 0) {
      filtered = filtered.filter((item) =>
        filter.categoria!.includes(item.categoria),
      );
    }

    if (filter.prioridade && filter.prioridade.length > 0) {
      filtered = filtered.filter((item) =>
        filter.prioridade!.includes(item.prioridade),
      );
    }

    if (filter.status && filter.status.length > 0) {
      filtered = filtered.filter((item) =>
        filter.status!.includes(item.status),
      );
    }

    if (filter.modulo && filter.modulo.length > 0) {
      filtered = filtered.filter((item) =>
        filter.modulo!.includes(item.modulo_impactado),
      );
    }

    if (filter.usuario_criador && filter.usuario_criador.length > 0) {
      filtered = filtered.filter((item) =>
        filter.usuario_criador!.includes(item.usuario_criador),
      );
    }

    if (filter.apenas_com_ia) {
      filtered = filtered.filter((item) => !!item.analise_ia);
    }

    if (filter.apenas_aprovados) {
      filtered = filtered.filter((item) => item.status === "aprovado");
    }

    if (filter.texto_busca) {
      const search = filter.texto_busca.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.titulo.toLowerCase().includes(search) ||
          item.descricao.toLowerCase().includes(search) ||
          item.tags.some((tag) => tag.toLowerCase().includes(search)),
      );
    }

    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter((item) =>
        filter.tags!.some((tag) => item.tags.includes(tag)),
      );
    }

    if (filter.data_inicio) {
      filtered = filtered.filter(
        (item) => item.data_criacao >= filter.data_inicio!,
      );
    }

    if (filter.data_fim) {
      filtered = filtered.filter(
        (item) => item.data_criacao <= filter.data_fim!,
      );
    }

    return filtered;
  }

  // Export backlog
  exportBacklog(options: BacklogExportOptions): string {
    const items = options.filtros
      ? this.filterItems(options.filtros)
      : this.state.items;

    const exportData = {
      metadata: {
        exported_at: new Date().toISOString(),
        format: options.formato,
        total_items: items.length,
        version: "2.0",
      },
      items: items.map((item) => ({
        ...item,
        ...(options.incluir_analises ? { analise_ia: item.analise_ia } : {}),
        ...(options.incluir_historico
          ? { historico_movimentacao: item.historico_movimentacao }
          : {}),
      })),
      statistics: this.state.estatisticas,
    };

    switch (options.formato) {
      case "json":
        return JSON.stringify(exportData, null, 2);
      case "csv":
        return this.convertToCSV(items);
      case "trello_json":
        return this.convertToTrelloFormat(items);
      default:
        return JSON.stringify(exportData, null, 2);
    }
  }

  // Convert to CSV
  private convertToCSV(items: BacklogItem[]): string {
    const headers = [
      "ID",
      "Título",
      "Descrição",
      "Categoria",
      "Módulo",
      "Prioridade",
      "Status",
      "Coluna",
      "Usuário",
      "Data Criação",
      "Tags",
      "Tempo Estimado",
    ];

    const rows = [headers.join(",")];

    items.forEach((item) => {
      const row = [
        item.id,
        `"${item.titulo}"`,
        `"${item.descricao}"`,
        item.categoria,
        item.modulo_impactado,
        item.prioridade,
        item.status,
        item.coluna,
        item.usuario_criador,
        item.data_criacao,
        `"${item.tags.join(";")}"`,
        item.tempo_estimado || "",
      ];
      rows.push(row.join(","));
    });

    return rows.join("\n");
  }

  // Convert to Trello format
  private convertToTrelloFormat(items: BacklogItem[]): string {
    const trelloData = {
      name: "Lawdesk CRM - Backlog",
      lists: this.state.colunas.map((col) => ({
        id: col.id,
        name: col.titulo,
        cards: items
          .filter((item) => item.coluna === col.id)
          .map((item) => ({
            id: item.id,
            name: item.titulo,
            desc: item.descricao,
            labels: [
              {
                name: item.categoria,
                color: this.getCategoryColor(item.categoria),
              },
              {
                name: item.prioridade,
                color: this.getPriorityColor(item.prioridade),
              },
            ],
            members: [{ username: item.usuario_criador }],
            checklists: item.checklist
              ? [
                  {
                    name: "Checklist",
                    checkItems: item.checklist.map((check) => ({
                      name: check.texto,
                      state: check.concluido ? "complete" : "incomplete",
                    })),
                  },
                ]
              : [],
          })),
      })),
    };

    return JSON.stringify(trelloData, null, 2);
  }

  // Helper methods
  private getCategoryColor(category: BacklogCategory): string {
    const colors = {
      AI: "blue",
      LegalTech: "purple",
      UX: "green",
      Backend: "red",
      Performance: "orange",
      Visual: "pink",
      Segurança: "black",
      Mobile: "sky",
      Analytics: "lime",
      Integração: "yellow",
      Compliance: "purple",
      Workflow: "gray",
    };
    return colors[category] || "gray";
  }

  private getPriorityColor(priority: BacklogPriority): string {
    const colors = {
      baixa: "green",
      media: "yellow",
      alta: "orange",
      critica: "red",
    };
    return colors[priority];
  }

  private generateId(): string {
    return `backlog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Cleanup
  dispose(): void {
    this.stopAutoProcessing();
    this.listeners = [];
  }
}

// Create singleton instance
export const backlogService = BacklogService.getInstance();

export default BacklogService;
