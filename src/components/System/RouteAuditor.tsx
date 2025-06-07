import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Navigation,
  Route,
  Link,
  Globe,
  Eye,
  Settings,
  RefreshCw,
  Download,
  Search,
  Filter,
  BarChart3,
  Activity,
  Zap,
  Bug,
  Target,
  MapPin,
  ArrowRight,
  X,
  Hash,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePermissions } from "@/hooks/usePermissions";
import {
  useAuditSystem,
  AUDIT_ACTIONS,
  AUDIT_MODULES,
} from "@/hooks/useAuditSystem";
import { toast } from "sonner";

interface RouteDefinition {
  path: string;
  name: string;
  component: string;
  permission?: string;
  isPublic: boolean;
  isActive: boolean;
  hasMetaTags: boolean;
  hasBreadcrumb: boolean;
  isMobile: boolean;
  loadTime?: number;
  errorRate?: number;
  lastAccessed?: string;
  accessCount: number;
  category: "core" | "admin" | "client" | "config" | "legacy" | "test";
}

interface AuditResult {
  route: string;
  status: "active" | "broken" | "orphan" | "deprecated";
  issues: string[];
  recommendations: string[];
  score: number;
  priority: "low" | "medium" | "high" | "critical";
}

interface NavigationIssue {
  type:
    | "broken_link"
    | "missing_permission"
    | "404"
    | "slow_load"
    | "no_mobile";
  route: string;
  description: string;
  impact: "low" | "medium" | "high" | "critical";
  fix: string;
}

export default function RouteAuditor() {
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [navigationIssues, setNavigationIssues] = useState<NavigationIssue[]>(
    [],
  );
  const [isAuditing, setIsAuditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  const location = useLocation();
  const navigate = useNavigate();
  const { user, hasPermission, isAdmin } = usePermissions();
  const { logAction } = useAuditSystem();

  // Definição completa de rotas do sistema
  const systemRoutes: RouteDefinition[] = [
    // Core Routes
    {
      path: "/dashboard",
      name: "Dashboard Principal",
      component: "Dashboard",
      isPublic: false,
      isActive: true,
      hasMetaTags: true,
      hasBreadcrumb: true,
      isMobile: true,
      accessCount: 1250,
      category: "core",
    },
    {
      path: "/dashboard-executivo",
      name: "Dashboard Executivo",
      component: "DashboardExecutivo",
      permission: "admin",
      isPublic: false,
      isActive: true,
      hasMetaTags: true,
      hasBreadcrumb: true,
      isMobile: true,
      accessCount: 89,
      category: "admin",
    },
    {
      path: "/crm",
      name: "CRM Jurídico",
      component: "CRMEnhanced",
      isPublic: false,
      isActive: true,
      hasMetaTags: true,
      hasBreadcrumb: true,
      isMobile: true,
      accessCount: 892,
      category: "core",
    },
    {
      path: "/ged-juridico",
      name: "GED Jurídico",
      component: "GEDJuridicoV2",
      isPublic: false,
      isActive: true,
      hasMetaTags: true,
      hasBreadcrumb: true,
      isMobile: true,
      accessCount: 567,
      category: "core",
    },
    {
      path: "/tarefas",
      name: "Gestão de Tarefas",
      component: "Tarefas",
      isPublic: false,
      isActive: true,
      hasMetaTags: true,
      hasBreadcrumb: true,
      isMobile: true,
      accessCount: 734,
      category: "core",
    },
    {
      path: "/publicacoes",
      name: "Publicações Oficiais",
      component: "Publicacoes",
      isPublic: false,
      isActive: true,
      hasMetaTags: true,
      hasBreadcrumb: true,
      isMobile: true,
      accessCount: 445,
      category: "core",
    },
    {
      path: "/contratos",
      name: "Gestão de Contratos",
      component: "Contratos",
      isPublic: false,
      isActive: true,
      hasMetaTags: true,
      hasBreadcrumb: true,
      isMobile: true,
      accessCount: 323,
      category: "core",
    },
    {
      path: "/financeiro",
      name: "Módulo Financeiro",
      component: "Financeiro",
      isPublic: false,
      isActive: true,
      hasMetaTags: true,
      hasBreadcrumb: true,
      isMobile: true,
      accessCount: 412,
      category: "core",
    },
    {
      path: "/atendimento",
      name: "Sistema de Atendimento",
      component: "AtendimentoEnhanced",
      isPublic: false,
      isActive: true,
      hasMetaTags: true,
      hasBreadcrumb: true,
      isMobile: true,
      accessCount: 198,
      category: "core",
    },
    {
      path: "/agenda",
      name: "Agenda Jurídica",
      component: "CalendarEnhanced",
      isPublic: false,
      isActive: true,
      hasMetaTags: true,
      hasBreadcrumb: true,
      isMobile: true,
      accessCount: 298,
      category: "core",
    },
    {
      path: "/ai-enhanced",
      name: "IA Jurídica Avançada",
      component: "AIEnhanced",
      isPublic: false,
      isActive: true,
      hasMetaTags: true,
      hasBreadcrumb: true,
      isMobile: true,
      accessCount: 156,
      category: "core",
    },

    // Admin Routes
    {
      path: "/plano-acao-ia",
      name: "Planos de Ação IA",
      component: "PlanoDeAcaoIA",
      permission: "admin",
      isPublic: false,
      isActive: true,
      hasMetaTags: true,
      hasBreadcrumb: true,
      isMobile: true,
      accessCount: 23,
      category: "admin",
    },
    {
      path: "/settings",
      name: "Configurações",
      component: "Settings",
      isPublic: false,
      isActive: true,
      hasMetaTags: true,
      hasBreadcrumb: true,
      isMobile: true,
      accessCount: 167,
      category: "admin",
    },
    {
      path: "/configuracoes/armazenamento",
      name: "Config. Armazenamento",
      component: "ConfiguracaoArmazenamento",
      permission: "admin",
      isPublic: false,
      isActive: true,
      hasMetaTags: false,
      hasBreadcrumb: false,
      isMobile: false,
      accessCount: 45,
      category: "config",
    },
    {
      path: "/configuracoes/prazos",
      name: "Config. Prazos",
      component: "ConfiguracoesPrazosPage",
      permission: "admin",
      isPublic: false,
      isActive: true,
      hasMetaTags: false,
      hasBreadcrumb: false,
      isMobile: false,
      accessCount: 34,
      category: "config",
    },

    // Legacy Routes
    {
      path: "/crm-legacy",
      name: "CRM Legacy",
      component: "CRM",
      isPublic: false,
      isActive: false,
      hasMetaTags: false,
      hasBreadcrumb: false,
      isMobile: false,
      accessCount: 12,
      category: "legacy",
    },
    {
      path: "/tickets",
      name: "Tickets Legacy",
      component: "Tickets",
      isPublic: false,
      isActive: false,
      hasMetaTags: false,
      hasBreadcrumb: false,
      isMobile: false,
      accessCount: 8,
      category: "legacy",
    },
    {
      path: "/ai",
      name: "IA Legacy",
      component: "AI",
      isPublic: false,
      isActive: false,
      hasMetaTags: false,
      hasBreadcrumb: false,
      isMobile: false,
      accessCount: 5,
      category: "legacy",
    },
    {
      path: "/ged-legacy",
      name: "GED Legacy",
      component: "GEDJuridico",
      isPublic: false,
      isActive: false,
      hasMetaTags: false,
      hasBreadcrumb: false,
      isMobile: false,
      accessCount: 3,
      category: "legacy",
    },

    // Test Routes
    {
      path: "/cliente-detalhes-test",
      name: "Teste Cliente Detalhes",
      component: "ClienteDetalhesTest",
      permission: "admin",
      isPublic: false,
      isActive: true,
      hasMetaTags: false,
      hasBreadcrumb: false,
      isMobile: false,
      accessCount: 15,
      category: "test",
    },
    {
      path: "/teste-configuracao-storage",
      name: "Teste Storage",
      component: "TesteConfiguracaoStorage",
      permission: "admin",
      isPublic: false,
      isActive: true,
      hasMetaTags: false,
      hasBreadcrumb: false,
      isMobile: false,
      accessCount: 7,
      category: "test",
    },
  ];

  // Mock data de problemas de navegação
  const mockNavigationIssues: NavigationIssue[] = [
    {
      type: "missing_permission",
      route: "/dashboard-executivo",
      description: "Usuários não-admin conseguem acessar rota restrita",
      impact: "high",
      fix: "Implementar guard de permissão na rota",
    },
    {
      type: "no_mobile",
      route: "/configuracoes/armazenamento",
      description: "Interface não responsiva para mobile",
      impact: "medium",
      fix: "Aplicar design mobile-first",
    },
    {
      type: "broken_link",
      route: "/publicacoes-example",
      description: "Redirect não funciona corretamente",
      impact: "low",
      fix: "Corrigir redirect para /publicacoes",
    },
    {
      type: "slow_load",
      route: "/ged-juridico",
      description: "Carregamento inicial lento (+3s)",
      impact: "medium",
      fix: "Implementar lazy loading e code splitting",
    },
    {
      type: "404",
      route: "/portal-cliente",
      description: "Rota referenciada mas não implementada",
      impact: "critical",
      fix: "Implementar portal do cliente ou remover referências",
    },
  ];

  // Executar auditoria
  const runAudit = async () => {
    setIsAuditing(true);
    await logAction(AUDIT_ACTIONS.MODULE_ACCESS, AUDIT_MODULES.DASHBOARD, {
      feature: "route_audit",
      timestamp: new Date().toISOString(),
    });

    // Simular auditoria
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const results: AuditResult[] = systemRoutes.map((route) => {
      const issues: string[] = [];
      const recommendations: string[] = [];
      let score = 100;

      // Verificar problemas
      if (!route.hasMetaTags) {
        issues.push("Meta tags ausentes");
        score -= 10;
      }
      if (!route.hasBreadcrumb) {
        issues.push("Breadcrumb não implementado");
        score -= 5;
      }
      if (!route.isMobile) {
        issues.push("Não otimizado para mobile");
        score -= 15;
      }
      if (route.accessCount < 50 && route.category === "core") {
        issues.push("Baixo uso para módulo principal");
        score -= 10;
      }
      if (route.category === "legacy") {
        issues.push("Componente legado - considerar remoção");
        score -= 20;
      }

      // Gerar recomendações
      if (!route.hasMetaTags) {
        recommendations.push("Adicionar meta tags SEO");
      }
      if (!route.isMobile) {
        recommendations.push("Implementar design responsivo");
      }
      if (route.category === "legacy") {
        recommendations.push("Migrar para versão moderna ou remover");
      }

      let priority: "low" | "medium" | "high" | "critical" = "low";
      if (score < 60) priority = "critical";
      else if (score < 75) priority = "high";
      else if (score < 90) priority = "medium";

      return {
        route: route.path,
        status: route.isActive
          ? "active"
          : route.category === "legacy"
            ? "deprecated"
            : "broken",
        issues,
        recommendations,
        score,
        priority,
      };
    });

    setAuditResults(results);
    setNavigationIssues(mockNavigationIssues);
    setIsAuditing(false);

    toast.success(`Auditoria concluída: ${results.length} rotas analisadas`);
  };

  // Filtrar resultados
  const filteredResults = auditResults.filter((result) => {
    const matchesSearch = result.route
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || result.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Estatísticas da auditoria
  const auditStats = {
    total: auditResults.length,
    active: auditResults.filter((r) => r.status === "active").length,
    broken: auditResults.filter((r) => r.status === "broken").length,
    deprecated: auditResults.filter((r) => r.status === "deprecated").length,
    critical: auditResults.filter((r) => r.priority === "critical").length,
    averageScore: Math.round(
      auditResults.reduce((sum, r) => sum + r.score, 0) / auditResults.length ||
        0,
    ),
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "broken":
        return <X className="h-4 w-4 text-red-500" />;
      case "deprecated":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-50";
      case "high":
        return "text-orange-600 bg-orange-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (!isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Acesso Restrito</h3>
          <p className="text-muted-foreground">
            Apenas administradores podem acessar a auditoria de rotas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Route className="h-8 w-8 text-primary" />
            Auditoria de Rotas e Navegação
          </h1>
          <p className="text-muted-foreground">
            Diagnóstico automático de integridade modular e navegação
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
          <Button size="sm" onClick={runAudit} disabled={isAuditing}>
            {isAuditing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Auditando...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Executar Auditoria
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {auditResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Rotas</p>
                  <p className="text-2xl font-bold">{auditStats.total}</p>
                </div>
                <Navigation className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ativas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {auditStats.active}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Quebradas</p>
                  <p className="text-2xl font-bold text-red-600">
                    {auditStats.broken}
                  </p>
                </div>
                <X className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Legadas</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {auditStats.deprecated}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Críticas</p>
                  <p className="text-2xl font-bold text-red-600">
                    {auditStats.critical}
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
                  <p className="text-sm text-muted-foreground">Score Médio</p>
                  <p className="text-2xl font-bold">
                    {auditStats.averageScore}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Issues Alert */}
      {navigationIssues.filter((issue) => issue.impact === "critical").length >
        0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-600">
            Problemas Críticos Detectados
          </AlertTitle>
          <AlertDescription>
            Foram encontrados{" "}
            {
              navigationIssues.filter((issue) => issue.impact === "critical")
                .length
            }{" "}
            problemas críticos que requerem atenção imediata para manter a
            integridade do sistema.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="routes">Rotas</TabsTrigger>
          <TabsTrigger value="issues">Problemas</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Ativas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={(auditStats.active / auditStats.total) * 100}
                        className="w-24 h-2"
                      />
                      <span className="text-sm font-medium">
                        {auditStats.active}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Legadas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={(auditStats.deprecated / auditStats.total) * 100}
                        className="w-24 h-2"
                      />
                      <span className="text-sm font-medium">
                        {auditStats.deprecated}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <X className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Quebradas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={(auditStats.broken / auditStats.total) * 100}
                        className="w-24 h-2"
                      />
                      <span className="text-sm font-medium">
                        {auditStats.broken}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Route Info */}
            <Card>
              <CardHeader>
                <CardTitle>Rota Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {location.pathname}
                    </code>
                  </div>

                  {systemRoutes.find((r) => r.path === location.pathname) && (
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          Componente:
                        </span>{" "}
                        {
                          systemRoutes.find((r) => r.path === location.pathname)
                            ?.component
                        }
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          Categoria:
                        </span>{" "}
                        <Badge variant="outline">
                          {
                            systemRoutes.find(
                              (r) => r.path === location.pathname,
                            )?.category
                          }
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Acessos:</span>{" "}
                        {
                          systemRoutes.find((r) => r.path === location.pathname)
                            ?.accessCount
                        }
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="routes" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-64">
                  <Input
                    placeholder="Buscar rotas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="active">Ativas</SelectItem>
                    <SelectItem value="broken">Quebradas</SelectItem>
                    <SelectItem value="deprecated">Legadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Routes List */}
          <div className="space-y-4">
            {filteredResults.map((result, index) => (
              <motion.div
                key={result.route}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <h4 className="font-medium">{result.route}</h4>
                          <p className="text-sm text-muted-foreground">
                            {
                              systemRoutes.find((r) => r.path === result.route)
                                ?.name
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={getPriorityColor(result.priority)}
                        >
                          {result.priority}
                        </Badge>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {result.score}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Score
                          </div>
                        </div>
                      </div>
                    </div>

                    {result.issues.length > 0 && (
                      <div className="mb-3">
                        <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                          <Bug className="h-3 w-3" />
                          Problemas ({result.issues.length})
                        </h5>
                        <div className="space-y-1">
                          {result.issues.map((issue, idx) => (
                            <div
                              key={idx}
                              className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded"
                            >
                              {issue}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.recommendations.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          Recomendações ({result.recommendations.length})
                        </h5>
                        <div className="space-y-1">
                          {result.recommendations.map((rec, idx) => (
                            <div
                              key={idx}
                              className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded"
                            >
                              {rec}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="issues" className="space-y-6">
          <div className="space-y-4">
            {navigationIssues.map((issue, index) => (
              <motion.div
                key={`${issue.route}-${issue.type}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <AlertTriangle
                          className={`h-5 w-5 mt-0.5 ${
                            issue.impact === "critical"
                              ? "text-red-500"
                              : issue.impact === "high"
                                ? "text-orange-500"
                                : issue.impact === "medium"
                                  ? "text-yellow-500"
                                  : "text-green-500"
                          }`}
                        />
                        <div>
                          <h4 className="font-medium">{issue.description}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {issue.route}
                            </code>
                            <Badge variant="outline" className="text-xs">
                              {issue.type.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <Badge
                        variant={
                          issue.impact === "critical"
                            ? "destructive"
                            : issue.impact === "high"
                              ? "default"
                              : issue.impact === "medium"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {issue.impact}
                      </Badge>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Settings className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <h5 className="text-sm font-medium text-green-800">
                            Solução Recomendada
                          </h5>
                          <p className="text-sm text-green-700 mt-1">
                            {issue.fix}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Melhorias Prioritárias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Smartphone className="h-5 w-5 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Mobile-First Design</h4>
                      <p className="text-sm text-muted-foreground">
                        Implementar responsividade em rotas de configuração
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Globe className="h-5 w-5 text-green-500" />
                    <div>
                      <h4 className="font-medium">SEO e Meta Tags</h4>
                      <p className="text-sm text-muted-foreground">
                        Adicionar meta tags em rotas principais
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Shield className="h-5 w-5 text-purple-500" />
                    <div>
                      <h4 className="font-medium">Guards de Permissão</h4>
                      <p className="text-sm text-muted-foreground">
                        Reforçar controle de acesso em rotas admin
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limpeza de Código</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <div>
                      <h4 className="font-medium">Remover Rotas Legacy</h4>
                      <p className="text-sm text-muted-foreground">
                        {auditStats.deprecated} rotas podem ser removidas
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Zap className="h-5 w-5 text-orange-500" />
                    <div>
                      <h4 className="font-medium">Otimizar Carregamento</h4>
                      <p className="text-sm text-muted-foreground">
                        Implementar lazy loading em rotas pesadas
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Activity className="h-5 w-5 text-red-500" />
                    <div>
                      <h4 className="font-medium">Monitoramento</h4>
                      <p className="text-sm text-muted-foreground">
                        Adicionar analytics de uso por rota
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
