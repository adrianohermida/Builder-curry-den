/**
 * 🎯 CRM UNIFICADO - SISTEMA CONSOLIDADO
 *
 * Sistema unificado que substitui todos os módulos CRM anteriores:
 * - CRMJuridico.tsx, CRMJuridicoV3.tsx, CRMUnicorn.tsx
 * - ModernCRMHub.tsx, ModernCRMHubV2.tsx
 * - Todos os módulos em /Modules/
 *
 * Features consolidadas:
 * - Gestão de clientes, processos, contratos, tarefas
 * - Financeiro, documentos, publicações
 * - Performance otimizada com lazy loading
 * - Design system oficial integrado
 * - Responsividade total
 */

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
  lazy,
} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Users,
  Scale,
  FileSignature,
  CheckSquare,
  DollarSign,
  FolderOpen,
  Bell,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  BarChart3,
  Settings,
  RefreshCw,
  Briefcase,
} from "lucide-react";

// Design System Components
import Card from "@/components/ui/OptimizedCard";
import Button from "@/components/ui/OptimizedButton";
import Input from "@/components/ui/OptimizedInput";
import { ultimateDesignSystem } from "@/lib/ultimateDesignSystem";
import { performanceUtils } from "@/lib/performanceUtils";

// Unified Hook
import { useCRMUnificado } from "@/hooks/useCRMUnificado";

// Lazy-loaded subcomponents for performance
const ContatosCard = lazy(() => import("@/components/CRM/ContatosCard"));
const ClientesModule = lazy(() => import("@/pages/CRM/Clientes"));
const NegociosCard = lazy(() => import("@/components/CRM/NegociosCard"));
const ProcessosTimeline = lazy(
  () => import("@/components/CRM/ProcessosTimeline"),
);
const TarefasKanban = lazy(() => import("@/components/CRM/TarefasKanban"));
const ContratosGrid = lazy(() => import("@/components/CRM/ContratosGrid"));
const FinanceiroMetrics = lazy(
  () => import("@/components/CRM/FinanceiroMetrics"),
);
const DocumentosGallery = lazy(
  () => import("@/components/CRM/DocumentosGallery"),
);

// ===== TYPES =====
export type CRMModule =
  | "dashboard"
  | "contatos"
  | "clientes"
  | "negocios"
  | "processos"
  | "contratos"
  | "tarefas"
  | "financeiro"
  | "documentos";

export type ViewMode = "cards" | "table" | "kanban" | "timeline";

interface CRMUnificadoProps {
  defaultModule?: CRMModule;
  compact?: boolean;
}

interface ModuleConfig {
  id: CRMModule;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  shortcut: string;
  color: string;
  enabled: boolean;
}

// ===== MODULE CONFIGURATION =====
const MODULE_CONFIG: ModuleConfig[] = [
  {
    id: "contatos",
    title: "Contatos",
    description: "Gestão completa de contatos PF/PJ",
    icon: Users,
    component: ContatosCard,
    shortcut: "1",
    color: "var(--primary-500)",
    enabled: true,
  },
  {
    id: "clientes",
    title: "Clientes",
    description: "Gestão de clientes e relacionamentos",
    icon: Users,
    component: ClientesModule,
    shortcut: "2",
    color: "var(--primary-600)",
    enabled: true,
  },
  {
    id: "negocios",
    title: "Negócios",
    description: "Pipeline de negócios e oportunidades",
    icon: Briefcase,
    component: NegociosCard,
    shortcut: "3",
    color: "var(--color-success)",
    enabled: true,
  },
  {
    id: "processos",
    title: "Processos",
    description: "Acompanhamento processual",
    icon: Scale,
    component: ProcessosTimeline,
    shortcut: "4",
    color: "var(--color-info)",
    enabled: true,
  },
  {
    id: "contratos",
    title: "Contratos",
    description: "Gestão de contratos e documentos",
    icon: FileSignature,
    component: ContratosGrid,
    shortcut: "5",
    color: "var(--color-warning)",
    enabled: true,
  },
  {
    id: "tarefas",
    title: "Tarefas",
    description: "Organização e produtividade",
    icon: CheckSquare,
    component: TarefasKanban,
    shortcut: "6",
    color: "var(--text-accent)",
    enabled: true,
  },
  {
    id: "financeiro",
    title: "Financeiro",
    description: "Controle financeiro e faturamento",
    icon: DollarSign,
    component: FinanceiroMetrics,
    shortcut: "7",
    color: "var(--color-success)",
    enabled: true,
  },
  {
    id: "documentos",
    title: "Documentos",
    description: "GED e biblioteca de documentos",
    icon: FolderOpen,
    component: DocumentosGallery,
    shortcut: "8",
    color: "var(--text-secondary)",
    enabled: true,
  },
];

// ===== LOADING COMPONENT =====
const ModuleLoader: React.FC<{ module: string }> = ({ module }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "400px",
      backgroundColor: "var(--surface-primary)",
    }}
  >
    <div style={{ textAlign: "center" }}>
      <div
        className="loading-skeleton"
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          marginBottom: "1rem",
        }}
      />
      <h3 style={{ margin: "0 0 0.5rem", color: "var(--text-primary)" }}>
        Carregando {module}
      </h3>
      <p style={{ margin: 0, color: "var(--text-secondary)" }}>
        Preparando dados...
      </p>
    </div>
  </div>
);

// ===== MAIN COMPONENT =====
const CRMUnificado: React.FC<CRMUnificadoProps> = ({
  defaultModule = "dashboard",
  compact = false,
}) => {
  // ===== HOOKS =====
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize activeModule from URL or default
  const [activeModule, setActiveModule] = useState<CRMModule>(() => {
    const urlModule = searchParams.get("module") as CRMModule;
    if (urlModule && MODULE_CONFIG.find((m) => m.id === urlModule)) {
      return urlModule;
    }
    return defaultModule;
  });

  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Unified CRM hook with all data and operations
  const {
    dashboardStats,
    clientes,
    processos,
    contratos,
    tarefas,
    isLoadingData,
    refreshData,
    createClient,
    createProcess,
    updateData,
    deleteData,
    searchData,
    filterData,
    exportData,
  } = useCRMUnificado();

  // ===== URL PARAMETER HANDLING =====
  useEffect(() => {
    const module = searchParams.get("module") as CRMModule;
    const action = searchParams.get("action");

    // Handle the module parameter - ensure it's valid
    if (module && MODULE_CONFIG.find((m) => m.id === module)) {
      setActiveModule(module);
    } else if (module) {
      // If module is not found but provided, default to dashboard
      console.warn(`Unknown module: ${module}, defaulting to dashboard`);
      setActiveModule("dashboard");
      setSearchParams((prev) => {
        prev.set("module", "dashboard");
        return prev;
      });
    } else {
      // No module specified, default to dashboard
      setActiveModule("dashboard");
    }

    // Handle quick actions from URL
    if (action) {
      handleQuickAction(action);
      setSearchParams((prev) => {
        prev.delete("action");
        return prev;
      });
    }
  }, [searchParams, setSearchParams]);

  // ===== QUICK ACTIONS =====
  const handleQuickAction = useCallback((action: string) => {
    switch (action) {
      case "new-contato":
        setActiveModule("contatos");
        // TODO: Open new contact modal
        break;
      case "new-negocio":
        setActiveModule("negocios");
        // TODO: Open new business modal
        break;
      case "new-processo":
        setActiveModule("processos");
        // TODO: Open new process modal
        break;
      case "new-contrato":
        setActiveModule("contratos");
        // TODO: Open new contract modal
        break;
      case "new-tarefa":
        setActiveModule("tarefas");
        // TODO: Open new task modal
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  }, []);

  // ===== MODULE NAVIGATION =====
  const handleModuleChange = useCallback(
    (moduleId: CRMModule) => {
      setActiveModule(moduleId);
      setSearchParams((prev) => {
        prev.set("module", moduleId);
        return prev;
      });

      // Announce for accessibility
      const moduleConfig = MODULE_CONFIG.find((m) => m.id === moduleId);
      if (moduleConfig) {
        performanceUtils.accessibilityUtils.announce(
          `Navegando para ${moduleConfig.title}`,
          "polite",
        );
      }
    },
    [setSearchParams],
  );

  // ===== SEARCH FUNCTIONALITY =====
  const debouncedSearch = useMemo(
    () =>
      performanceUtils.componentOptimization.debounce((query: string) => {
        if (query.trim()) {
          searchData(activeModule, query);
        }
      }, 300),
    [activeModule, searchData],
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  // ===== KEYBOARD SHORTCUTS =====
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        const moduleConfig = MODULE_CONFIG.find(
          (m) => m.shortcut === event.key,
        );
        if (moduleConfig) {
          event.preventDefault();
          handleModuleChange(moduleConfig.id);
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [handleModuleChange]);

  // ===== COMPUTED VALUES =====
  const activeModuleConfig = useMemo(
    () => MODULE_CONFIG.find((m) => m.id === activeModule),
    [activeModule],
  );

  const enabledModules = useMemo(
    () => MODULE_CONFIG.filter((m) => m.enabled),
    [],
  );

  // ===== DASHBOARD STATS =====
  const renderDashboard = () => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {/* Quick Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        {dashboardStats.map((stat, index) => (
          <Card
            key={index}
            padding="lg"
            hover
            interactive
            onClick={() => handleModuleChange(stat.module as CRMModule)}
            style={{ cursor: "pointer" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: `${stat.color}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <stat.icon size={24} style={{ color: stat.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    margin: "0 0 0.25rem",
                    fontSize: "2rem",
                    fontWeight: "700",
                    color: "var(--text-primary)",
                  }}
                >
                  {stat.value}
                </h3>
                <p
                  style={{
                    margin: "0 0 0.25rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "var(--text-primary)",
                  }}
                >
                  {stat.label}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  {stat.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card padding="lg">
        <Card.Header
          title="Atividade Recente"
          subtitle="Últimas atualizações no CRM"
        />
        <Card.Content>
          <div style={{ display: "grid", gap: "1rem" }}>
            {/* TODO: Implement recent activity list */}
            <p style={{ color: "var(--text-secondary)" }}>
              Carregando atividades recentes...
            </p>
          </div>
        </Card.Content>
      </Card>
    </div>
  );

  // ===== ACTIVE MODULE COMPONENT =====
  const renderActiveModule = () => {
    if (activeModule === "dashboard") {
      return renderDashboard();
    }

    const ActiveComponent = activeModuleConfig?.component;
    if (!ActiveComponent) {
      return (
        <Card padding="lg">
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <h3>Módulo não encontrado</h3>
            <p>O módulo "{activeModule}" não foi configurado.</p>
          </div>
        </Card>
      );
    }

    return (
      <Suspense fallback={<ModuleLoader module={activeModuleConfig.title} />}>
        <ActiveComponent
          searchQuery={searchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </Suspense>
    );
  };

  // ===== RENDER =====
  return (
    <div
      style={{
        padding: compact ? "1rem" : "1.5rem",
        backgroundColor: "var(--bg-primary)",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h1
              style={{
                margin: "0 0 0.25rem",
                fontSize: "2rem",
                fontWeight: "700",
                color: "var(--text-primary)",
              }}
            >
              {activeModuleConfig?.title || "CRM Jurídico"}
            </h1>
            <p
              style={{
                margin: 0,
                color: "var(--text-secondary)",
                fontSize: "1rem",
              }}
            >
              {activeModuleConfig?.description ||
                "Sistema unificado de gestão jurídica"}
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <Button
              variant="secondary"
              icon={RefreshCw}
              onClick={() => refreshData()}
              loading={isLoadingData}
            >
              Atualizar
            </Button>
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => {
                let action = "new-contato";
                if (activeModule !== "dashboard") {
                  switch (activeModule) {
                    case "contatos":
                      action = "new-contato";
                      break;
                    case "negocios":
                      action = "new-negocio";
                      break;
                    case "processos":
                      action = "new-processo";
                      break;
                    case "contratos":
                      action = "new-contrato";
                      break;
                    case "tarefas":
                      action = "new-tarefa";
                      break;
                    default:
                      action = "new-contato";
                  }
                }
                handleQuickAction(action);
              }}
            >
              Adicionar
            </Button>
          </div>
        </div>

        {/* Module Navigation */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "1rem",
            overflowX: "auto",
            paddingBottom: "0.5rem",
          }}
        >
          <Button
            variant={activeModule === "dashboard" ? "primary" : "ghost"}
            icon={BarChart3}
            onClick={() => handleModuleChange("dashboard")}
            size="sm"
            title="Dashboard (⌘+D)"
          >
            Dashboard
          </Button>
          {enabledModules.map((module) => (
            <Button
              key={module.id}
              variant={activeModule === module.id ? "primary" : "ghost"}
              icon={module.icon}
              onClick={() => handleModuleChange(module.id)}
              size="sm"
              title={`${module.title} (⌘+${module.shortcut})`}
              style={{
                minWidth: "fit-content",
                whiteSpace: "nowrap",
                position: "relative",
              }}
            >
              {module.title}
              <span
                style={{
                  fontSize: "0.625rem",
                  opacity: 0.7,
                  marginLeft: "0.25rem",
                  fontWeight: "400",
                }}
              >
                ⌘{module.shortcut}
              </span>
            </Button>
          ))}
        </div>

        {/* Search and Filters */}
        {activeModule !== "dashboard" && (
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: "300px" }}>
              <Input
                placeholder={`Buscar em ${activeModuleConfig?.title}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </div>
            <Button variant="secondary" icon={Filter} size="sm">
              Filtros
            </Button>
            <Button variant="secondary" icon={MoreHorizontal} size="sm">
              Mais opções
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ position: "relative" }}>
        {isLoadingData && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <div
              className="loading-skeleton"
              style={{ width: "60px", height: "60px", borderRadius: "50%" }}
            />
          </div>
        )}
        {renderActiveModule()}
      </div>
    </div>
  );
};

export default React.memo(CRMUnificado);
