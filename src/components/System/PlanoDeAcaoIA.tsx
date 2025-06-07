import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Settings,
  BarChart3,
  FileText,
  Calendar,
  MessageSquare,
  FolderOpen,
  DollarSign,
  Scale,
  Download,
  Eye,
  Filter,
  Sparkles,
  Activity,
  Code,
  Lock,
  Cpu,
  Database,
  Globe,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Star,
  Flag,
  ArrowRight,
  Lightbulb,
  Bug,
  Wrench,
  Rocket,
  Link,
  Heart,
  Gauge,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePermissions } from "@/hooks/usePermissions";
import {
  useAuditSystem,
  AUDIT_ACTIONS,
  AUDIT_MODULES,
} from "@/hooks/useAuditSystem";
import { toast } from "sonner";

// Interfaces para os planos de ação
interface ModuleAnalysis {
  modulo: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "excelente" | "bom" | "medio" | "critico";
  completude: number;
  diagnostico: {
    pendencias: string[];
    interligacao: boolean;
    performance: string[];
    bugs: string[];
  };
  acoes_imediatas: Array<{
    titulo: string;
    prioridade: "baixa" | "media" | "alta" | "critica";
    estimativa: string;
    impacto: string;
  }>;
  desenvolvimento_recomendado: Array<{
    funcionalidade: string;
    benchmark: string;
    complexidade: "simples" | "media" | "complexa";
    roi_esperado: string;
  }>;
  integracoes: string[];
  inteligencia: Array<{
    feature: string;
    tipo: "resumo" | "predicao" | "analise" | "automacao" | "classificacao";
    beneficio: string;
  }>;
  seguranca: Array<{
    area: string;
    acao: string;
    conformidade: "LGPD" | "OAB" | "GERAL";
  }>;
  eficiencia: Array<{
    otimizacao: string;
    economia_esperada: string;
    implementacao: string;
  }>;
  satisfacao: Array<{
    metrica: string;
    objetivo: string;
    medicao: string;
  }>;
  roadmap: Array<{
    sprint: number;
    entregaveis: string[];
    responsavel: string;
  }>;
}

// Análises detalhadas dos módulos
const moduleAnalyses: ModuleAnalysis[] = [
  {
    modulo: "CRM Jurídico",
    icon: Users,
    status: "bom",
    completude: 85,
    diagnostico: {
      pendencias: [
        "Falta integração completa com WhatsApp Business API",
        "Campos customizáveis por tipo de cliente não implementados",
        "Relatórios de conversion funnel em desenvolvimento",
      ],
      interligacao: true,
      performance: [
        "Carregamento lento na lista de clientes com +1000 registros",
        "Ausência de virtualização na tabela de processos",
      ],
      bugs: [
        "Filtro por data não persiste após reload",
        "Modal de edição não valida CPF/CNPJ corretamente",
      ],
    },
    acoes_imediatas: [
      {
        titulo: "Implementar virtualização de tabelas",
        prioridade: "alta",
        estimativa: "2-3 dias",
        impacto: "Performance 300% melhor com grandes volumes",
      },
      {
        titulo: "Corrigir validação de documentos",
        prioridade: "media",
        estimativa: "4 horas",
        impacto: "Redução de erros de cadastro em 90%",
      },
      {
        titulo: "Persistência de filtros com localStorage",
        prioridade: "baixa",
        estimativa: "2 horas",
        impacao: "UX mais fluida para usuários power",
      },
    ],
    desenvolvimento_recomendado: [
      {
        funcionalidade: "Pipeline visual de vendas estilo Pipedrive",
        benchmark: "HubSpot CRM",
        complexidade: "media",
        roi_esperado: "25% aumento na conversão de prospects",
      },
      {
        funcionalidade: "Timeline interativa de relacionamento com cliente",
        benchmark: "Salesforce",
        complexidade: "complexa",
        roi_esperado: "40% melhoria na retenção de clientes",
      },
      {
        funcionalidade: "Campos customizáveis por área de atuação",
        benchmark: "Monday.com",
        complexidade: "media",
        roi_esperado: "Adaptação para 15+ áreas jurídicas",
      },
    ],
    integracoes: [
      "IA Jurídica",
      "GED Jurídico",
      "Financeiro",
      "Tarefas",
      "Publicações",
      "Agenda",
    ],
    inteligencia: [
      {
        feature: "Score de satisfação do cliente baseado em interações",
        tipo: "analise",
        beneficio: "Identificação proativa de clientes em risco",
      },
      {
        feature: "Predição de potencial de receita por cliente",
        tipo: "predicao",
        beneficio: "Priorização de esforços comerciais",
      },
      {
        feature: "Classificação automática de leads por perfil",
        tipo: "classificacao",
        beneficio: "Aumento de 35% na eficiência comercial",
      },
    ],
    seguranca: [
      {
        area: "Dados pessoais de clientes",
        acao: "Implementar criptografia end-to-end para campos sensíveis",
        conformidade: "LGPD",
      },
      {
        area: "Histórico de acessos",
        acao: "Log detalhado de visualizações de dados de clientes",
        conformidade: "LGPD",
      },
      {
        area: "Segregação de dados",
        acao: "Controle granular por escritório/advogado",
        conformidade: "OAB",
      },
    ],
    eficiencia: [
      {
        otimizacao: "Cache inteligente de consultas frequentes",
        economia_esperada: "70% redução em tempo de carregamento",
        implementacao: "React Query + Redis backend",
      },
      {
        otimizacao: "Lazy loading de componentes pesados",
        economia_esperada: "50% redução no bundle inicial",
        implementacao: "Code splitting + Suspense",
      },
    ],
    satisfacao: [
      {
        metrica: "Tempo para cadastrar novo cliente",
        objetivo: "Menos de 2 minutos",
        medicao: "Timer automático no formulário",
      },
      {
        metrica: "Cliques para visualizar histórico completo",
        objetivo: "Máximo 2 cliques",
        medicao: "Event tracking via analytics",
      },
    ],
    roadmap: [
      {
        sprint: 1,
        entregaveis: ["Virtualização de tabelas", "Correção de bugs críticos"],
        responsavel: "Dev Frontend",
      },
      {
        sprint: 2,
        entregaveis: ["Pipeline visual", "Campos customizáveis"],
        responsavel: "Dev Fullstack",
      },
      {
        sprint: 3,
        entregaveis: ["Timeline interativa", "IA de scoring"],
        responsavel: "Dev + Data Scientist",
      },
    ],
  },
  {
    modulo: "GED Jurídico",
    icon: FolderOpen,
    status: "medio",
    completude: 75,
    diagnostico: {
      pendencias: [
        "Visualização Flipbook não monetizada",
        "Regras de automação de pastas incompletas",
        "OCR para documentos digitalizados não implementado",
        "Controle de versões de documentos básico",
      ],
      interligacao: true,
      performance: [
        "Upload de arquivos grandes (+50MB) trava a interface",
        "Busca em conteúdo de PDFs não otimizada",
        "Thumbnails não são gerados em background",
      ],
      bugs: [
        "Árvore de pastas não atualiza após criação",
        "Drag & drop falha ocasionalmente no Safari",
      ],
    },
    acoes_imediatas: [
      {
        titulo: "Implementar upload progressivo com chunks",
        prioridade: "critica",
        estimativa: "3-4 dias",
        impacto: "Upload de arquivos de até 2GB sem travamento",
      },
      {
        titulo: "OCR básico com Tesseract.js",
        prioridade: "alta",
        estimativa: "5-6 dias",
        impacto: "Busca em texto de documentos digitalizados",
      },
      {
        titulo: "Corrigir atualização da árvore de pastas",
        prioridade: "media",
        estimativa: "4 horas",
        impacto: "UX mais responsiva",
      },
    ],
    desenvolvimento_recomendado: [
      {
        funcionalidade: "Editor Flipbook com anotações e monetização",
        benchmark: "DocuSign + Adobe Acrobat",
        complexidade: "complexa",
        roi_esperado: "Nova fonte de receita: R$ 50/mês por usuário",
      },
      {
        funcionalidade: "Controle avançado de versões estilo Git",
        benchmark: "GitHub + Box",
        complexidade: "complexa",
        roi_esperado: "Zero perda de documentos, +60% produtividade",
      },
      {
        funcionalidade: "Workspace colaborativo com comentários",
        benchmark: "Google Drive + Notion",
        complexidade: "media",
        roi_esperado: "40% redução em emails internos",
      },
    ],
    integracoes: [
      "CRM Jurídico",
      "IA Jurídica",
      "Publicações",
      "Contratos",
      "Tarefas",
    ],
    inteligencia: [
      {
        feature: "Classificação automática de documentos por tipo",
        tipo: "classificacao",
        beneficio: "85% redução em organização manual",
      },
      {
        feature: "Extração automática de metadados de contratos",
        tipo: "analise",
        beneficio: "Indexação inteligente e busca semântica",
      },
      {
        feature: "Detecção de duplicatas e similares",
        tipo: "analise",
        beneficio: "Limpeza automática do repositório",
      },
      {
        feature: "Resumo automático de documentos longos",
        tipo: "resumo",
        beneficio: "Review 10x mais rápido",
      },
    ],
    seguranca: [
      {
        area: "Controle de acesso granular",
        acao: "Permissões por pasta, documento e ação (view/edit/share)",
        conformidade: "LGPD",
      },
      {
        area: "Trilha de auditoria completa",
        acao: "Log de todos os acessos, downloads e modificações",
        conformidade: "OAB",
      },
      {
        area: "Criptografia de arquivos",
        acao: "Encryption at rest e in transit",
        conformidade: "GERAL",
      },
    ],
    eficiencia: [
      {
        otimizacao: "CDN para arquivos estáticos",
        economia_esperada: "80% redução em tempo de download",
        implementacao: "CloudFlare + AWS S3",
      },
      {
        otimizacao: "Compressão inteligente baseada em tipo",
        economia_esperada: "60% economia em storage",
        implementacao: "Algoritmos adaptativos por extensão",
      },
    ],
    satisfacao: [
      {
        metrica: "Tempo de upload para arquivo de 10MB",
        objetivo: "Menos de 30 segundos",
        medicao: "Performance API do browser",
      },
      {
        metrica: "Tempo para encontrar documento específico",
        objetivo: "Menos de 10 segundos",
        medicao: "Search analytics",
      },
    ],
    roadmap: [
      {
        sprint: 1,
        entregaveis: ["Upload progressivo", "OCR básico"],
        responsavel: "Dev Frontend + DevOps",
      },
      {
        sprint: 2,
        entregaveis: ["Editor Flipbook", "Controle de versões"],
        responsavel: "Dev Fullstack",
      },
      {
        sprint: 3,
        entregaveis: ["IA de classificação", "Workspace colaborativo"],
        responsavel: "Dev + Data Engineer",
      },
    ],
  },
  {
    modulo: "IA Jurídica",
    icon: Brain,
    status: "bom",
    completude: 80,
    diagnostico: {
      pendencias: [
        "Templates de minutas limitados a 5 áreas do direito",
        "Análise de jurisprudência não implementada",
        "Revisão automática de contratos básica",
        "Integração com bases jurídicas externas pendente",
      ],
      interligacao: true,
      performance: [
        "Geração de documentos grandes (+20 páginas) lenta",
        "Não há cache de respostas similares",
        "Rate limiting não implementado",
      ],
      bugs: [
        "Templates com variáveis complexas falham ocasionalmente",
        "Histórico de gerações não persiste corretamente",
      ],
    },
    acoes_imediatas: [
      {
        titulo: "Implementar cache inteligente de respostas",
        prioridade: "alta",
        estimativa: "2-3 dias",
        impacto: "90% redução em custo de API para consultas similares",
      },
      {
        titulo: "Rate limiting e quota management",
        prioridade: "alta",
        estimativa: "1-2 dias",
        impacto: "Controle de custos e uso justo",
      },
      {
        titulo: "Corrigir persistência do histórico",
        prioridade: "media",
        estimativa: "4 horas",
        impacto: "Usuários não perdem histórico de trabalho",
      },
    ],
    desenvolvimento_recomendado: [
      {
        funcionalidade: "Análise jurisprudencial com busca semântica",
        benchmark: "Westlaw + LexisNexis",
        complexidade: "complexa",
        roi_esperado: "70% redução em tempo de pesquisa",
      },
      {
        funcionalidade: "Review automático de contratos com score de risco",
        benchmark: "LawGeex + Kira Systems",
        complexidade: "complexa",
        roi_esperado: "50% redução em tempo de análise",
      },
      {
        funcionalidade: "Marketplace de templates da comunidade",
        benchmark: "Notion Templates + Zapier",
        complexidade: "media",
        roi_esperado: "Nova receita: R$ 10/template vendido",
      },
    ],
    integracoes: [
      "CRM Jurídico",
      "GED Jurídico",
      "Publicações",
      "Tarefas",
      "Contratos",
    ],
    inteligencia: [
      {
        feature: "Predição de sucesso de processos baseada em dados históricos",
        tipo: "predicao",
        beneficio: "Estratégia jurídica data-driven",
      },
      {
        feature: "Sugestão automática de jurisprudência relevante",
        tipo: "analise",
        beneficio: "Fundamentação mais robusta de petições",
      },
      {
        feature: "Detecção de inconsistências em contratos",
        tipo: "analise",
        beneficio: "Redução de 80% em erros contratuais",
      },
    ],
    seguranca: [
      {
        area: "Dados sensíveis em prompts",
        acao: "Sanitização automática de informações pessoais",
        conformidade: "LGPD",
      },
      {
        area: "Auditoria de uso de IA",
        acao: "Log completo de prompts e respostas",
        conformidade: "OAB",
      },
    ],
    eficiencia: [
      {
        otimizacao: "Modelos locais para tarefas simples",
        economia_esperada: "40% redução em custos de API",
        implementacao: "Ollama + modelos open source",
      },
      {
        otimizacao: "Batch processing para documentos múltiplos",
        economia_esperada: "60% redução em tempo de processamento",
        implementacao: "Queue system com Redis",
      },
    ],
    satisfacao: [
      {
        metrica: "Tempo para gerar petição de 10 páginas",
        objetivo: "Menos de 2 minutos",
        medicao: "Timer de geração",
      },
      {
        metrica: "Qualidade percebida do conteúdo gerado",
        objetivo: "Nota média 4.5/5",
        medicao: "Sistema de rating pós-geração",
      },
    ],
    roadmap: [
      {
        sprint: 1,
        entregaveis: ["Cache inteligente", "Rate limiting"],
        responsavel: "Dev Backend",
      },
      {
        sprint: 2,
        entregaveis: ["Análise jurisprudencial", "Review de contratos"],
        responsavel: "Data Scientist + Dev",
      },
      {
        sprint: 3,
        entregaveis: ["Marketplace de templates", "Modelos locais"],
        responsavel: "Dev Fullstack + ML Engineer",
      },
    ],
  },
  {
    modulo: "Tarefas",
    icon: CheckCircle,
    status: "bom",
    completude: 82,
    diagnostico: {
      pendencias: [
        "Recorrência de tarefas não suporta padrões complexos",
        "Kanban não permite swimlanes customizadas",
        "Automação baseada em regras limitada",
        "Integração com calendário externo (Google/Outlook) pendente",
      ],
      interligacao: true,
      performance: [
        "Filtros complexos com muitas tarefas são lentos",
        "Atualização em tempo real não implementada",
      ],
      bugs: [
        "Drag & drop no Kanban ocasionalmente não salva",
        "Notificações push não funcionam no mobile",
      ],
    },
    acoes_imediatas: [
      {
        titulo: "Implementar WebSocket para updates em tempo real",
        prioridade: "alta",
        estimativa: "3-4 dias",
        impacto: "Colaboração em equipe 300% mais eficiente",
      },
      {
        titulo: "Corrigir persistência do Kanban",
        prioridade: "alta",
        estimativa: "1 dia",
        impacto: "Zero perda de alterações de status",
      },
      {
        titulo: "Push notifications para mobile",
        prioridade: "media",
        estimativa: "2-3 dias",
        impacto: "Engagement 50% maior",
      },
    ],
    desenvolvimento_recomendado: [
      {
        funcionalidade: "Kanban avançado com swimlanes e WIP limits",
        benchmark: "Jira + Trello Power-Ups",
        complexidade: "media",
        roi_esperado: "35% aumento na produtividade da equipe",
      },
      {
        funcionalidade: "Automação avançada de workflows",
        benchmark: "Zapier + Monday.com",
        complexidade: "complexa",
        roi_esperado: "60% redução em tarefas manuais",
      },
      {
        funcionalidade: "Time tracking integrado com billing",
        benchmark: "Toggl + Harvest",
        complexidade: "media",
        roi_esperado: "20% aumento na precisão de cobrança",
      },
    ],
    integracoes: [
      "CRM Jurídico",
      "Agenda",
      "Publicações",
      "IA Jurídica",
      "Financeiro",
    ],
    inteligencia: [
      {
        feature: "Estimativa automática de tempo baseada em histórico",
        tipo: "predicao",
        beneficio: "Planejamento 40% mais preciso",
      },
      {
        feature: "Sugestão de priorização baseada em impacto",
        tipo: "analise",
        beneficio: "Foco nas tarefas de maior valor",
      },
      {
        feature: "Detecção de gargalos no workflow",
        tipo: "analise",
        beneficio: "Otimização contínua de processos",
      },
    ],
    seguranca: [
      {
        area: "Acesso a tarefas sensíveis",
        acao: "Controle granular por área e cliente",
        conformidade: "OAB",
      },
      {
        area: "Histórico de alterações",
        acao: "Audit trail completo de modificações",
        conformidade: "GERAL",
      },
    ],
    eficiencia: [
      {
        otimizacao: "Virtualização para listas grandes",
        economia_esperada: "80% melhoria em performance com +1000 tarefas",
        implementacao: "React Window + pagination inteligente",
      },
    ],
    satisfacao: [
      {
        metrica: "Tempo para criar nova tarefa",
        objetivo: "Menos de 30 segundos",
        medicao: "Formulário com timer",
      },
      {
        metrica: "Taxa de conclusão de tarefas no prazo",
        objetivo: "85% ou mais",
        medicao: "Analytics de deadline compliance",
      },
    ],
    roadmap: [
      {
        sprint: 1,
        entregaveis: ["WebSocket updates", "Correções de Kanban"],
        responsavel: "Dev Frontend + Backend",
      },
      {
        sprint: 2,
        entregaveis: ["Kanban avançado", "Time tracking"],
        responsavel: "Dev Fullstack",
      },
    ],
  },
  {
    modulo: "Publicações",
    icon: FileText,
    status: "medio",
    completude: 70,
    diagnostico: {
      pendencias: [
        "Integração com APIs dos tribunais limitada a 3 tribunais",
        "Classificação automática de intimações incompleta",
        "Sistema de alertas não personalizable",
        "Export em lote não implementado",
      ],
      interligacao: true,
      performance: [
        "Sincronização com tribunais demora mais de 5 minutos",
        "Busca por palavra-chave não indexada",
      ],
      bugs: [
        "Marcação como lida não persiste em alguns casos",
        "Filtros por data apresentam inconsistências",
      ],
    },
    acoes_imediatas: [
      {
        titulo: "Otimizar sincronização com search indexing",
        prioridade: "critica",
        estimativa: "4-5 dias",
        impacto: "Sync 10x mais rápida + busca instantânea",
      },
      {
        titulo: "Corrigir persistência de status de leitura",
        prioridade: "alta",
        estimativa: "2 horas",
        impacto: "UX consistente",
      },
      {
        titulo: "Fix filtros de data com timezone",
        prioridade: "media",
        estimativa: "4 horas",
        impacto: "Dados sempre precisos",
      },
    ],
    desenvolvimento_recomendado: [
      {
        funcionalidade: "IA para classificação automática de intimações",
        benchmark: "Legal AI + Custom ML",
        complexidade: "complexa",
        roi_esperado: "90% redução em triagem manual",
      },
      {
        funcionalidade: "Dashboard preditivo de prazos críticos",
        benchmark: "Tableau + Custom Analytics",
        complexidade: "media",
        roi_esperado: "Zero prazos perdidos",
      },
      {
        funcionalidade: "Integração com 15+ tribunais via APIs",
        benchmark: "Comprehensive coverage",
        complexidade: "complexa",
        roi_esperado: "Cobertura 95% dos processos do Brasil",
      },
    ],
    integracoes: ["CRM Jurídico", "Tarefas", "IA Jurídica", "Agenda", "GED"],
    inteligencia: [
      {
        feature: "Extração automática de prazos e datas importantes",
        tipo: "analise",
        beneficio: "Criação automática de lembretes",
      },
      {
        feature: "Análise de sentimento em decisões judiciais",
        tipo: "analise",
        beneficio: "Insight sobre tendências dos magistrados",
      },
      {
        feature: "Predição de probabilidade de recurso",
        tipo: "predicao",
        beneficio: "Estratégia jurídica mais informada",
      },
    ],
    seguranca: [
      {
        area: "Dados processuais sensíveis",
        acao: "Encryption + access controls",
        conformidade: "LGPD",
      },
    ],
    eficiencia: [
      {
        otimizacao: "Background sync com queue system",
        economia_esperada: "Interface sempre responsiva",
        implementacao: "Redis + job scheduler",
      },
    ],
    satisfacao: [
      {
        metrica: "Tempo para encontrar publicação específica",
        objetivo: "Menos de 5 segundos",
        medicao: "Search performance tracking",
      },
    ],
    roadmap: [
      {
        sprint: 1,
        entregaveis: ["Search indexing", "Correções críticas"],
        responsavel: "Dev Backend + DevOps",
      },
      {
        sprint: 2,
        entregaveis: ["IA de classificação", "Dashboard preditivo"],
        responsavel: "ML Engineer + Dev",
      },
    ],
  },
  {
    modulo: "Atendimento",
    icon: MessageSquare,
    status: "bom",
    completude: 78,
    diagnostico: {
      pendencias: [
        "Chatbot para primeiro atendimento não implementado",
        "Integração com WhatsApp Business limitada",
        "Sistema de tickets não tem escalação automática",
        "Base de conhecimento para respostas padrão vazia",
      ],
      interligacao: true,
      performance: [
        "Carregamento de conversas longas (+100 mensagens) lento",
        "Notificações em tempo real consomem muita bateria no mobile",
      ],
      bugs: [
        "Anexos grandes ocasionalmente falham no upload",
        "Status de ticket não sincroniza em tempo real",
      ],
    },
    acoes_imediatas: [
      {
        titulo: "Implementar lazy loading para conversas",
        prioridade: "alta",
        estimativa: "2-3 dias",
        impacto: "Performance 5x melhor em conversas longas",
      },
      {
        titulo: "WebSocket para status de tickets em tempo real",
        prioridade: "alta",
        estimativa: "2 dias",
        impacto: "Colaboração perfeita entre atendentes",
      },
      {
        titulo: "Corrigir upload de anexos grandes",
        prioridade: "media",
        estimativa: "1 dia",
        impacto: "Clientes podem enviar qualquer documento",
      },
    ],
    desenvolvimento_recomendado: [
      {
        funcionalidade: "Chatbot inteligente com NLP para triagem",
        benchmark: "Intercom + Zendesk",
        complexidade: "complexa",
        roi_esperado: "60% redução em tickets básicos",
      },
      {
        funcionalidade: "Unified inbox para todos os canais",
        benchmark: "HubSpot Service Hub",
        complexidade: "media",
        roi_esperado: "40% aumento na eficiência de atendimento",
      },
      {
        funcionalidade: "SLA automático com escalação inteligente",
        benchmark: "Zendesk + Freshdesk",
        complexidade: "media",
        roi_esperado: "95% compliance com SLA",
      },
    ],
    integracoes: ["CRM Jurídico", "Tarefas", "IA Jurídica", "GED"],
    inteligencia: [
      {
        feature: "Análise de sentimento do cliente em tempo real",
        tipo: "analise",
        beneficio: "Identificação proativa de clientes insatisfeitos",
      },
      {
        feature: "Sugestão automática de respostas baseada em contexto",
        tipo: "automacao",
        beneficio: "50% redução em tempo de resposta",
      },
      {
        feature: "Predição de churn baseada em padrões de atendimento",
        tipo: "predicao",
        beneficio: "Retenção proativa de clientes",
      },
    ],
    seguranca: [
      {
        area: "Conversas com dados sensíveis",
        acao: "End-to-end encryption",
        conformidade: "LGPD",
      },
    ],
    eficiencia: [
      {
        otimizacao: "Compression de mensagens antigas",
        economia_esperada: "70% redução em storage",
        implementacao: "Algoritmos de compressão + archiving",
      },
    ],
    satisfacao: [
      {
        metrica: "Tempo médio de primeira resposta",
        objetivo: "Menos de 5 minutos",
        medicao: "SLA tracking automático",
      },
    ],
    roadmap: [
      {
        sprint: 1,
        entregaveis: ["Lazy loading", "WebSocket", "Upload fixes"],
        responsavel: "Dev Frontend + Backend",
      },
      {
        sprint: 2,
        entregaveis: ["Chatbot", "Unified inbox"],
        responsavel: "Dev + ML Engineer",
      },
    ],
  },
  {
    modulo: "Agenda Jurídica",
    icon: Calendar,
    status: "medio",
    completude: 72,
    diagnostico: {
      pendencias: [
        "Visualização de calendário mensal não implementada completamente",
        "Sincronização com Google Calendar/Outlook pendente",
        "Detecção de conflitos de horário básica",
        "Lembretes inteligentes não personalizáveis",
      ],
      interligacao: true,
      performance: [
        "Carregamento de eventos de vários meses lento",
        "Interface trava com +200 eventos simultâneos",
      ],
      bugs: [
        "Eventos recorrentes não criam instâncias corretamente",
        "Timezone não é respeitado para clientes de outros estados",
      ],
    },
    acoes_imediatas: [
      {
        titulo: "Implementar visualização mensal completa",
        prioridade: "critica",
        estimativa: "5-6 dias",
        impacto: "Feature esperada por 90% dos usuários",
      },
      {
        titulo: "Corrigir eventos recorrentes",
        prioridade: "alta",
        estimativa: "3 dias",
        impacto: "Confiabilidade total em compromissos repetitivos",
      },
      {
        titulo: "Fix timezone handling",
        prioridade: "alta",
        estimativa: "2 dias",
        impacto: "Precisão para escritórios multi-estado",
      },
    ],
    desenvolvimento_recomendado: [
      {
        funcionalidade: "Calendario inteligente com detecção de conflitos",
        benchmark: "Calendly + Google Calendar",
        complexidade: "media",
        roi_esperado: "Zero conflitos de agendamento",
      },
      {
        funcionalidade: "Sincronização bidirecional com calendários externos",
        benchmark: "Outlook + Apple Calendar",
        complexidade: "complexa",
        roi_esperado: "Unified calendar experience",
      },
      {
        funcionalidade: "Agendamento automático baseado em disponibilidade",
        benchmark: "Calendly + Acuity",
        complexidade: "media",
        roi_esperado: "50% redução em back-and-forth de agendamento",
      },
    ],
    integracoes: ["CRM Jurídico", "Tarefas", "Publicações", "Atendimento"],
    inteligencia: [
      {
        feature: "Sugestão de melhor horário baseada em padrões históricos",
        tipo: "predicao",
        beneficio: "Otimização automática de agenda",
      },
      {
        feature: "Lembretes contextuais com documentos relevantes",
        tipo: "automacao",
        beneficio: "Preparação automática para reuniões",
      },
    ],
    seguranca: [
      {
        area: "Dados de agenda",
        acao: "Controle de visibilidade granular",
        conformidade: "GERAL",
      },
    ],
    eficiencia: [
      {
        otimizacao: "Virtualização de eventos",
        economia_esperada: "Interface fluida com milhares de eventos",
        implementacao: "React virtualization",
      },
    ],
    satisfacao: [
      {
        metrica: "Tempo para agendar novo compromisso",
        objetivo: "Menos de 1 minuto",
        medicao: "Timer no formulário",
      },
    ],
    roadmap: [
      {
        sprint: 1,
        entregaveis: ["Visualização mensal", "Eventos recorrentes", "Timezone"],
        responsavel: "Dev Frontend",
      },
      {
        sprint: 2,
        entregaveis: ["Sync external calendars", "Conflict detection"],
        responsavel: "Dev Backend + Integrations",
      },
    ],
  },
  {
    modulo: "Financeiro",
    icon: DollarSign,
    status: "bom",
    completude: 83,
    diagnostico: {
      pendencias: [
        "Reconciliação bancária não automatizada",
        "Relatórios gerenciais básicos",
        "Controle de center de custo limitado",
        "Integração com ERPs externos pendente",
      ],
      interligacao: true,
      performance: [
        "Relatórios com grandes volumes demoram +30 segundos",
        "Dashboard financeiro não atualiza em tempo real",
      ],
      bugs: [
        "Cálculo de juros em atraso impreciso",
        "Export de relatórios ocasionalmente falha",
      ],
    },
    acoes_imediatas: [
      {
        titulo: "Corrigir cálculo de juros e multas",
        prioridade: "critica",
        estimativa: "2 dias",
        impacto: "Precisão financeira 100%",
      },
      {
        titulo: "Otimizar geração de relatórios",
        prioridade: "alta",
        estimativa: "3-4 dias",
        impacto: "Relatórios em menos de 5 segundos",
      },
      {
        titulo: "Dashboard real-time com WebSocket",
        prioridade: "media",
        estimativa: "2-3 dias",
        impacto: "Visão financeira sempre atualizada",
      },
    ],
    desenvolvimento_recomendado: [
      {
        funcionalidade: "Reconciliação bancária automática via Open Banking",
        benchmark: "QuickBooks + Sage",
        complexidade: "complexa",
        roi_esperado: "90% redução em trabalho manual",
      },
      {
        funcionalidade: "BI integrado com drill-down analytics",
        benchmark: "Power BI + Tableau",
        complexidade: "complexa",
        roi_esperado: "Insights acionáveis para crescimento",
      },
      {
        funcionalidade: "Centro de custo por área jurídica",
        benchmark: "SAP + Oracle",
        complexidade: "media",
        roi_esperado: "Visibilidade total de rentabilidade",
      },
    ],
    integracoes: ["CRM Jurídico", "Contratos", "Tarefas", "Stripe"],
    inteligencia: [
      {
        feature: "Predição de fluxo de caixa baseada em histórico",
        tipo: "predicao",
        beneficio: "Planejamento financeiro 6 meses à frente",
      },
      {
        feature: "Detecção automática de inadimplência",
        tipo: "analise",
        beneficio: "Ação proativa em cobrança",
      },
      {
        feature: "Sugestão de preços baseada em rentabilidade",
        tipo: "analise",
        beneficio: "Otimização de margens",
      },
    ],
    seguranca: [
      {
        area: "Dados financeiros",
        acao: "Encryption + access logs",
        conformidade: "LGPD",
      },
    ],
    eficiencia: [
      {
        otimizacao: "Cache de relatórios frequentes",
        economia_esperada: "80% redução em tempo de geração",
        implementacao: "Redis + background jobs",
      },
    ],
    satisfacao: [
      {
        metrica: "Tempo para gerar relatório mensal",
        objetivo: "Menos de 10 segundos",
        medicao: "Performance monitoring",
      },
    ],
    roadmap: [
      {
        sprint: 1,
        entregaveis: ["Correções críticas", "Otimização relatórios"],
        responsavel: "Dev Backend + FinTech specialist",
      },
      {
        sprint: 2,
        entregaveis: ["Open Banking", "BI analytics"],
        responsavel: "Dev Fullstack + Data Engineer",
      },
    ],
  },
  {
    modulo: "Configurações",
    icon: Settings,
    status: "medio",
    completude: 65,
    diagnostico: {
      pendencias: [
        "Configurações de empresa não completamente implementadas",
        "Gestão de usuários e permissões básica",
        "Backup e restore manual",
        "Monitoramento de sistema limitado",
      ],
      interligacao: false,
      performance: [
        "Salvamento de configurações sem feedback",
        "Carregamento inicial lento",
      ],
      bugs: [
        "Reset de configurações não funciona completamente",
        "Algumas configurações não persistem após logout",
      ],
    },
    acoes_imediatas: [
      {
        titulo: "Implementar gestão avançada de usuários",
        prioridade: "alta",
        estimativa: "4-5 dias",
        impacto: "Controle granular de acesso",
      },
      {
        titulo: "Corrigir persistência de configurações",
        prioridade: "alta",
        estimativa: "1 dia",
        impacto: "Configurações sempre salvas",
      },
      {
        titulo: "Backup automático das configurações",
        prioridade: "media",
        estimativa: "2-3 dias",
        impacto: "Disaster recovery completo",
      },
    ],
    desenvolvimento_recomendado: [
      {
        funcionalidade: "Admin panel completo estilo WordPress",
        benchmark: "WordPress Admin + Firebase Console",
        complexidade: "complexa",
        roi_esperado: "Gestão self-service completa",
      },
      {
        funcionalidade: "Monitoramento em tempo real do sistema",
        benchmark: "New Relic + DataDog",
        complexidade: "media",
        roi_esperado: "99.9% uptime",
      },
    ],
    integracoes: ["Todos os módulos", "Sistema de auditoria"],
    inteligencia: [
      {
        feature: "Sugestão de configurações otimizadas",
        tipo: "analise",
        beneficio: "Setup automático baseado em uso",
      },
    ],
    seguranca: [
      {
        area: "Configurações do sistema",
        acao: "Audit trail completo",
        conformidade: "GERAL",
      },
    ],
    eficiencia: [
      {
        otimizacao: "Lazy loading de seções",
        economia_esperada: "Interface mais responsiva",
        implementacao: "Component splitting",
      },
    ],
    satisfacao: [
      {
        metrica: "Tempo para encontrar configuração específica",
        objetivo: "Menos de 10 segundos",
        medicao: "Search analytics",
      },
    ],
    roadmap: [
      {
        sprint: 1,
        entregaveis: ["Gestão de usuários", "Correções críticas"],
        responsavel: "Dev Fullstack",
      },
      {
        sprint: 2,
        entregaveis: ["Admin panel", "Monitoring"],
        responsavel: "Dev + DevOps",
      },
    ],
  },
];

export default function PlanoDeAcaoIA() {
  const [selectedModule, setSelectedModule] = useState<string>("todos");
  const [selectedPriority, setSelectedPriority] = useState<string>("todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [exportFormat, setExportFormat] = useState<"json" | "markdown">("json");
  const [showRoadmap, setShowRoadmap] = useState(false);

  const { isAdmin } = usePermissions();
  const { logAction } = useAuditSystem();

  // Filter modules based on search and filters
  const filteredModules = useMemo(() => {
    let filtered = moduleAnalyses;

    if (selectedModule !== "todos") {
      filtered = filtered.filter((module) => module.modulo === selectedModule);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (module) =>
          module.modulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          module.diagnostico.pendencias.some((p) =>
            p.toLowerCase().includes(searchTerm.toLowerCase()),
          ) ||
          module.acoes_imediatas.some((a) =>
            a.titulo.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    return filtered;
  }, [selectedModule, searchTerm]);

  // Export functionality
  const handleExport = async () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      modules: filteredModules,
      summary: {
        total_modules: filteredModules.length,
        average_completude: Math.round(
          filteredModules.reduce((sum, m) => sum + m.completude, 0) /
            filteredModules.length,
        ),
        critical_actions: filteredModules.reduce(
          (sum, m) =>
            sum +
            m.acoes_imediatas.filter((a) => a.prioridade === "critica").length,
          0,
        ),
        high_priority_actions: filteredModules.reduce(
          (sum, m) =>
            sum +
            m.acoes_imediatas.filter((a) => a.prioridade === "alta").length,
          0,
        ),
      },
    };

    if (exportFormat === "json") {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `lawdesk-action-plan-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }

    await logAction(AUDIT_ACTIONS.DOWNLOAD, AUDIT_MODULES.DASHBOARD, {
      type: "action_plan_export",
      format: exportFormat,
      modules_count: filteredModules.length,
    });

    toast.success("Plano de ação exportado com sucesso");
  };

  if (!isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Acesso Restrito</h3>
          <p className="text-muted-foreground">
            Apenas administradores podem acessar os planos de ação da IA.
          </p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              Planos de Ação IA - Lawdesk CRM
            </h1>
            <p className="text-muted-foreground">
              Análise dinâmica e recomendações personalizadas para cada módulo
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={exportFormat}
              onValueChange={(value: "json" | "markdown") =>
                setExportFormat(value)
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="markdown">Markdown</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button
              variant={showRoadmap ? "default" : "outline"}
              size="sm"
              onClick={() => setShowRoadmap(!showRoadmap)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Roadmap
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Módulos Analisados
                  </p>
                  <p className="text-2xl font-bold">{moduleAnalyses.length}</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Completude Média
                  </p>
                  <p className="text-2xl font-bold">
                    {Math.round(
                      moduleAnalyses.reduce((sum, m) => sum + m.completude, 0) /
                        moduleAnalyses.length,
                    )}
                    %
                  </p>
                </div>
                <Gauge className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Ações Críticas
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {moduleAnalyses.reduce(
                      (sum, m) =>
                        sum +
                        m.acoes_imediatas.filter(
                          (a) => a.prioridade === "critica",
                        ).length,
                      0,
                    )}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Features IA</p>
                  <p className="text-2xl font-bold">
                    {moduleAnalyses.reduce(
                      (sum, m) => sum + m.inteligencia.length,
                      0,
                    )}
                  </p>
                </div>
                <Sparkles className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-64">
                <Input
                  placeholder="Buscar módulos, ações ou funcionalidades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por módulo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Módulos</SelectItem>
                  {moduleAnalyses.map((module) => (
                    <SelectItem key={module.modulo} value={module.modulo}>
                      {module.modulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedPriority}
                onValueChange={setSelectedPriority}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as Prioridades</SelectItem>
                  <SelectItem value="critica">Crítica</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Module Analysis */}
        <div className="space-y-6">
          {filteredModules.map((module, index) => {
            const IconComponent = module.icon;

            return (
              <motion.div
                key={module.modulo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {module.modulo}
                            <Badge
                              variant={
                                module.status === "excelente"
                                  ? "default"
                                  : module.status === "bom"
                                    ? "secondary"
                                    : module.status === "medio"
                                      ? "outline"
                                      : "destructive"
                              }
                            >
                              {module.status}
                            </Badge>
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-muted-foreground">
                              Completude:
                            </span>
                            <Progress
                              value={module.completude}
                              className="w-32 h-2"
                            />
                            <span className="text-sm font-medium">
                              {module.completude}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {module.interligacao ? (
                          <Badge variant="outline" className="text-green-600">
                            <Link className="h-3 w-3 mr-1" />
                            Integrado
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Isolado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <Accordion
                      type="multiple"
                      defaultValue={["diagnostico", "acoes"]}
                      className="w-full"
                    >
                      {/* Diagnóstico Atual */}
                      <AccordionItem value="diagnostico">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-2">
                            <Bug className="h-4 w-4 text-orange-500" />
                            <span>1. Diagnóstico Atual</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Pendências Técnicas
                              </h4>
                              <ul className="space-y-1">
                                {module.diagnostico.pendencias.map(
                                  (pendencia, idx) => (
                                    <li
                                      key={idx}
                                      className="text-sm text-muted-foreground flex items-start gap-2"
                                    >
                                      <div className="w-1 h-1 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                                      {pendencia}
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <Activity className="h-4 w-4" />
                                Performance & Bugs
                              </h4>
                              <div className="space-y-2">
                                {module.diagnostico.performance.map(
                                  (perf, idx) => (
                                    <div
                                      key={idx}
                                      className="text-sm text-muted-foreground flex items-start gap-2"
                                    >
                                      <Cpu className="h-3 w-3 mt-0.5 text-blue-500" />
                                      {perf}
                                    </div>
                                  ),
                                )}
                                {module.diagnostico.bugs.map((bug, idx) => (
                                  <div
                                    key={idx}
                                    className="text-sm text-muted-foreground flex items-start gap-2"
                                  >
                                    <Bug className="h-3 w-3 mt-0.5 text-red-500" />
                                    {bug}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Ações Imediatas */}
                      <AccordionItem value="acoes">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-yellow-500" />
                            <span>2. Ações Imediatas</span>
                            <Badge variant="outline">
                              {module.acoes_imediatas.length} ações
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            {module.acoes_imediatas.map((acao, idx) => (
                              <div key={idx} className="border rounded-lg p-3">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-medium">{acao.titulo}</h4>
                                  <Badge
                                    variant={
                                      acao.prioridade === "critica"
                                        ? "destructive"
                                        : acao.prioridade === "alta"
                                          ? "default"
                                          : acao.prioridade === "media"
                                            ? "secondary"
                                            : "outline"
                                    }
                                  >
                                    {acao.prioridade}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    <span>Estimativa: {acao.estimativa}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Target className="h-3 w-3" />
                                    <span>Impacto: {acao.impacto}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Desenvolvimento Recomendado */}
                      <AccordionItem value="desenvolvimento">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-2">
                            <Rocket className="h-4 w-4 text-green-500" />
                            <span>3. Desenvolvimento Recomendado</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            {module.desenvolvimento_recomendado.map(
                              (dev, idx) => (
                                <div
                                  key={idx}
                                  className="border rounded-lg p-3"
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-medium">
                                      {dev.funcionalidade}
                                    </h4>
                                    <Badge variant="outline">
                                      {dev.complexidade}
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                      <Star className="h-3 w-3" />
                                      <span>Benchmark: {dev.benchmark}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <TrendingUp className="h-3 w-3" />
                                      <span>ROI: {dev.roi_esperado}</span>
                                    </div>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* IA Aplicada */}
                      <AccordionItem value="ia">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-purple-500" />
                            <span>5. IA Aplicada</span>
                            <Badge variant="outline">
                              {module.inteligencia.length} features
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            {module.inteligencia.map((ia, idx) => (
                              <div key={idx} className="border rounded-lg p-3">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-medium">{ia.feature}</h4>
                                  <Badge variant="secondary">{ia.tipo}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {ia.beneficio}
                                </p>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Roadmap */}
                      {showRoadmap && (
                        <AccordionItem value="roadmap">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span>Roadmap de Execução</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3">
                              {module.roadmap.map((sprint, idx) => (
                                <div
                                  key={idx}
                                  className="border rounded-lg p-3"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="default">
                                      Sprint {sprint.sprint}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                      Responsável: {sprint.responsavel}
                                    </span>
                                  </div>
                                  <ul className="space-y-1">
                                    {sprint.entregaveis.map(
                                      (entregavel, entIdx) => (
                                        <li
                                          key={entIdx}
                                          className="text-sm flex items-center gap-2"
                                        >
                                          <CheckCircle className="h-3 w-3 text-green-500" />
                                          {entregavel}
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Global Action Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Resumo Executivo de Ações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-3 text-red-600">
                  Ações Críticas (Imediatas)
                </h3>
                <div className="space-y-2">
                  {moduleAnalyses
                    .flatMap((m) =>
                      m.acoes_imediatas.filter(
                        (a) => a.prioridade === "critica",
                      ),
                    )
                    .slice(0, 5)
                    .map((acao, idx) => (
                      <div
                        key={idx}
                        className="text-sm p-2 border-l-2 border-red-500 bg-red-50"
                      >
                        {acao.titulo}
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-orange-600">
                  Ações Altas (Esta Semana)
                </h3>
                <div className="space-y-2">
                  {moduleAnalyses
                    .flatMap((m) =>
                      m.acoes_imediatas.filter((a) => a.prioridade === "alta"),
                    )
                    .slice(0, 5)
                    .map((acao, idx) => (
                      <div
                        key={idx}
                        className="text-sm p-2 border-l-2 border-orange-500 bg-orange-50"
                      >
                        {acao.titulo}
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-blue-600">
                  Top Features IA
                </h3>
                <div className="space-y-2">
                  {moduleAnalyses
                    .flatMap((m) => m.inteligencia)
                    .slice(0, 5)
                    .map((ia, idx) => (
                      <div
                        key={idx}
                        className="text-sm p-2 border-l-2 border-blue-500 bg-blue-50"
                      >
                        {ia.feature}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
