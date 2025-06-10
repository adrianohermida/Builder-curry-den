import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/ThemeProvider";

// Debug Panel (development only)
import DebugPanel from "@/components/Debug/DebugPanel";

// New Consolidated Layout System
import MainLayout from "@/components/Layout/MainLayout";
import LawdeskLayoutSaaS from "@/components/Layout/LawdeskLayoutSaaS";
import PublicLayout from "@/components/Layout/PublicLayout";

// Componente de Loading global
const GlobalLoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Lawdesk CRM</h3>
      <p className="text-gray-600">Carregando sistema...</p>
    </div>
  </div>
);

// Função para criar componentes lazy com fallback personalizado
const createLazyPage = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  pageName: string,
) => {
  const LazyComponent = React.lazy(importFn);

  return React.forwardRef<any, any>((props, ref) => (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando {pageName}...</p>
          </div>
        </div>
      }
    >
      <LazyComponent {...props} ref={ref} />
    </Suspense>
  ));
};

// ===== PÁGINAS PRINCIPAIS =====
// Storage Management
const StorageManagement = createLazyPage(
  () => import("@/pages/Storage"),
  "Gestão de Armazenamento",
);

const TesteConfiguracaoStorage = createLazyPage(
  () => import("@/pages/TesteConfiguracaoStorage"),
  "Teste de Configuração de Storage",
);

const PainelControle = createLazyPage(
  () => import("./pages/CleanPainelControle"),
  "Painel de Controle",
);

const CRMUnificado = createLazyPage(
  () => import("./pages/CRM/CRMUnificado"),
  "CRM Jurídico",
);

const PublicacoesPage = createLazyPage(
  () => import("./pages/Publicacoes"),
  "Publicações",
);

const AgendaPage = createLazyPage(() => import("./pages/Agenda"), "Agenda");

const AtendimentoPage = createLazyPage(
  () => import("./pages/AtendimentoEnhanced"),
  "Atendimento",
);

const FinanceiroPage = createLazyPage(
  () => import("./pages/Financeiro"),
  "Financeiro",
);

const ContratosPage = createLazyPage(
  () => import("./pages/Contratos"),
  "Contratos",
);

const TarefasPage = createLazyPage(() => import("./pages/Tarefas"), "Tarefas");

const ConfiguracoesPage = createLazyPage(
  () => import("./pages/Configuracoes/UserSettingsHub"),
  "Configurações",
);

// ===== PÁGINAS PÚBLICAS =====
const LoginPage = createLazyPage(() => import("./pages/Login"), "Login");

// Onboarding Pages
const OnboardingPage = createLazyPage(
  () => import("./pages/Onboarding"),
  "Configuração Inicial",
);

const OnboardingLandingPage = createLazyPage(
  () => import("./pages/OnboardingLanding"),
  "Bem-vindo ao Lawdesk",
);

// ===== PÁGINAS ADMINISTRATIVAS =====
const TarefasGerencialPage = createLazyPage(
  () => import("./pages/TarefasGerencial"),
  "Gestão de Tarefas",
);

const UsersGerencialPage = createLazyPage(
  () => import("./pages/UsersGerencial"),
  "Gestão de Usuários",
);

const MetricsGerencialPage = createLazyPage(
  () => import("./pages/MetricsGerencial"),
  "Métricas Gerenciais",
);

const FinanceiroGerencialPage = createLazyPage(
  () => import("./pages/FinanceiroGerencial"),
  "Financeiro Gerencial",
);

const DashboardExecutivoPage = createLazyPage(
  () => import("./pages/DashboardExecutivo"),
  "Dashboard Executivo",
);

const SystemHealthPage = createLazyPage(
  () => import("./pages/SystemHealth"),
  "Saúde do Sistema",
);

const UpdatePage = createLazyPage(
  () => import("./pages/Update"),
  "Atualizações",
);

// ===== PÁGINAS DE MÓDULOS =====
const AIPage = createLazyPage(() => import("./pages/AI"), "IA Jurídica");

const ActionPlanPage = createLazyPage(
  () => import("./pages/ActionPlan"),
  "Plano de Ação",
);

const GEDPage = createLazyPage(
  () => import("./pages/GEDJuridico"),
  "GED Jurídico",
);

const GEDOrganizacionalPage = createLazyPage(
  () => import("./pages/GEDOrganizacional"),
  "GED Organizacional",
);

const TicketsPage = createLazyPage(() => import("./pages/Tickets"), "Tickets");

const PortalClientePage = createLazyPage(
  () => import("./pages/PortalCliente"),
  "Portal do Cliente",
);

const ConfiguracoesPrazosPage = createLazyPage(
  () => import("./pages/ConfiguracoesPrazosPage"),
  "Configurações de Prazos",
);

// ===== PÁGINAS BETA/EXPERIMENTAL =====
const BetaDashboardPage = createLazyPage(
  () => import("./pages/Beta/BetaDashboard"),
  "Beta Dashboard",
);

const BetaReportsPage = createLazyPage(
  () => import("./pages/Beta/BetaReports"),
  "Beta Reports",
);

const CodeOptimizationPage = createLazyPage(
  () => import("./pages/Beta/CodeOptimization"),
  "Code Optimization",
);

const TestDashboardPage = createLazyPage(
  () => import("./pages/TestDashboard"),
  "Test Dashboard",
);

const PublicacoesExamplePage = createLazyPage(
  () => import("./pages/PublicacoesExample"),
  "Publicações Example",
);

const CompleteResponsiveDashboardPage = createLazyPage(
  () => import("./pages/CompleteResponsiveDashboard"),
  "Complete Responsive Dashboard",
);

const ThemeTestPage = createLazyPage(
  () => import("./pages/ThemeTestPage"),
  "Theme Test",
);

const LaunchPage = createLazyPage(() => import("./pages/Launch"), "Launch");

// ===== PÁGINAS DE ERRO =====
const EnhancedNotFoundPage = createLazyPage(
  () => import("./pages/EnhancedNotFound"),
  "Página Não Encontrada",
);

// CRM Error Boundary
import CRMErrorBoundary from "./components/CRM/CRMErrorBoundary";

// Wrapper para páginas com título
const PageWrapper: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  React.useEffect(() => {
    document.title = `${title} - Lawdesk CRM`;
  }, [title]);

  return <>{children}</>;
};

// Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// ===== MAIN APP COMPONENT =====
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Suspense fallback={<GlobalLoadingFallback />}>
              <Routes>
                {/* ===== ROTAS PÚBLICAS ===== */}
                <Route
                  path="/login"
                  element={<PublicLayout variant="centered" />}
                >
                  <Route
                    index
                    element={
                      <PageWrapper title="Login">
                        <LoginPage />
                      </PageWrapper>
                    }
                  />
                </Route>

                <Route
                  path="/registro"
                  element={<PublicLayout variant="centered" />}
                >
                  <Route
                    index
                    element={
                      <PageWrapper title="Registro">
                        <div className="p-8 text-center">
                          <h1 className="text-2xl font-bold mb-4">Registro</h1>
                          <p>Página de registro - Em construção</p>
                        </div>
                      </PageWrapper>
                    }
                  />
                </Route>

                <Route
                  path="/onboarding-start"
                  element={<PublicLayout variant="default" />}
                >
                  <Route
                    index
                    element={
                      <PageWrapper title="Bem-vindo">
                        <OnboardingLandingPage />
                      </PageWrapper>
                    }
                  />
                </Route>

                {/* ===== ROTAS PRIVADAS (MAIN LAYOUT) ===== */}
                <Route path="/" element={<MainLayout />}>
                  {/* Home redirect */}
                  <Route index element={<Navigate to="/painel" replace />} />

                  {/* ===== PÁGINAS PRINCIPAIS ===== */}
                  <Route
                    path="painel"
                    element={
                      <PageWrapper title="Painel de Controle">
                        <PainelControle />
                      </PageWrapper>
                    }
                  />

                  {/* CRM Jurídico - Sistema Unificado */}
                  <Route
                    path="crm-modern/*"
                    element={
                      <PageWrapper title="CRM Jurídico">
                        <CRMErrorBoundary>
                          <CRMUnificado />
                        </CRMErrorBoundary>
                      </PageWrapper>
                    }
                  />

                  {/* ===== MÓDULOS PRINCIPAIS ===== */}
                  <Route
                    path="publicacoes"
                    element={
                      <PageWrapper title="Publicações">
                        <PublicacoesPage />
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="agenda"
                    element={
                      <PageWrapper title="Agenda">
                        <AgendaPage />
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="atendimento"
                    element={
                      <PageWrapper title="Atendimento">
                        <AtendimentoPage />
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="financeiro"
                    element={
                      <PageWrapper title="Financeiro">
                        <FinanceiroPage />
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="contratos"
                    element={
                      <PageWrapper title="Contratos">
                        <ContratosPage />
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="tarefas"
                    element={
                      <PageWrapper title="Tarefas">
                        <TarefasPage />
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="tickets"
                    element={
                      <PageWrapper title="Tickets">
                        <TicketsPage />
                      </PageWrapper>
                    }
                  />

                  {/* ===== MÓDULOS ESPECIALIZADOS ===== */}
                  <Route
                    path="ia"
                    element={
                      <PageWrapper title="IA Jurídica">
                        <AIPage />
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="ged"
                    element={
                      <PageWrapper title="GED Jurídico">
                        <GEDPage />
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="ged/organizacional"
                    element={
                      <PageWrapper title="GED Organizacional">
                        <GEDOrganizacionalPage />
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="portal-cliente"
                    element={
                      <PageWrapper title="Portal do Cliente">
                        <PortalClientePage />
                      </PageWrapper>
                    }
                  />

                  {/* ===== CONFIGURAÇÕES ===== */}
                  <Route
                    path="configuracoes"
                    element={
                      <PageWrapper title="Configurações">
                        <ConfiguracoesPage />
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="configuracoes/prazos"
                    element={
                      <PageWrapper title="Configurações de Prazos">
                        <ConfiguracoesPrazosPage />
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="configuracao-armazenamento"
                    element={
                      <PageWrapper title="Gestão de Armazenamento">
                        <StorageManagement />
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="teste-configuracao-storage"
                    element={
                      <PageWrapper title="Teste de Configuração de Storage">
                        <TesteConfiguracaoStorage />
                      </PageWrapper>
                    }
                  />

                  {/* ===== ROTAS ADMINISTRATIVAS ===== */}
                  <Route path="admin">
                    <Route
                      path="action-plan"
                      element={
                        <PageWrapper title="Plano de Ação">
                          <ActionPlanPage />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="system-health"
                      element={
                        <PageWrapper title="Saúde do Sistema">
                          <SystemHealthPage />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="updates"
                      element={
                        <PageWrapper title="Atualizações">
                          <UpdatePage />
                        </PageWrapper>
                      }
                    />
                  </Route>

                  {/* ===== ROTAS GERENCIAIS ===== */}
                  <Route path="gestao">
                    <Route
                      path="tarefas"
                      element={
                        <PageWrapper title="Gestão de Tarefas">
                          <TarefasGerencialPage />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="usuarios"
                      element={
                        <PageWrapper title="Gestão de Usuários">
                          <UsersGerencialPage />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="metricas"
                      element={
                        <PageWrapper title="Métricas Gerenciais">
                          <MetricsGerencialPage />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="financeiro"
                      element={
                        <PageWrapper title="Financeiro Gerencial">
                          <FinanceiroGerencialPage />
                        </PageWrapper>
                      }
                    />
                  </Route>

                  {/* ===== ROTAS EXECUTIVAS ===== */}
                  <Route path="executivo">
                    <Route
                      path="dashboard"
                      element={
                        <PageWrapper title="Dashboard Executivo">
                          <DashboardExecutivoPage />
                        </PageWrapper>
                      }
                    />
                  </Route>

                  {/* ===== ROTAS BETA/EXPERIMENTAL ===== */}
                  <Route path="beta">
                    <Route
                      index
                      element={
                        <PageWrapper title="Beta Dashboard">
                          <BetaDashboardPage />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="dashboard"
                      element={
                        <PageWrapper title="Beta Dashboard">
                          <BetaDashboardPage />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="reports"
                      element={
                        <PageWrapper title="Beta Reports">
                          <BetaReportsPage />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="code-optimization"
                      element={
                        <PageWrapper title="Code Optimization">
                          <CodeOptimizationPage />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="test-dashboard"
                      element={
                        <PageWrapper title="Test Dashboard">
                          <TestDashboardPage />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="publicacoes-example"
                      element={
                        <PageWrapper title="Publicações Example">
                          <PublicacoesExamplePage />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="responsive-dashboard"
                      element={
                        <PageWrapper title="Responsive Dashboard">
                          <CompleteResponsiveDashboardPage />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="theme-test"
                      element={
                        <PageWrapper title="Theme Test">
                          <ThemeTestPage />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="launch"
                      element={
                        <PageWrapper title="Launch">
                          <LaunchPage />
                        </PageWrapper>
                      }
                    />
                  </Route>

                  {/* Onboarding Routes - Inside main layout for authenticated users */}
                  <Route
                    path="onboarding"
                    element={
                      <PageWrapper title="Configuração Inicial">
                        <OnboardingPage />
                      </PageWrapper>
                    }
                  />

                  {/* 404 - Página não encontrada */}
                  <Route
                    path="404"
                    element={
                      <PageWrapper title="Página Não Encontrada">
                        <EnhancedNotFoundPage />
                      </PageWrapper>
                    }
                  />

                  {/* Fallback para rotas não encontradas */}
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Route>

                {/* ===== ROTAS SAAS (LAYOUT ADMINISTRATIVO) ===== */}
                <Route path="/saas" element={<LawdeskLayoutSaaS />}>
                  <Route
                    index
                    element={<Navigate to="/saas/dashboard" replace />}
                  />
                  <Route
                    path="dashboard"
                    element={
                      <PageWrapper title="SaaS Dashboard">
                        <PainelControle />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="crm/*"
                    element={
                      <PageWrapper title="SaaS CRM">
                        <CRMErrorBoundary>
                          <CRMUnificado />
                        </CRMErrorBoundary>
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="analytics"
                    element={
                      <PageWrapper title="SaaS Analytics">
                        <div className="p-8">
                          <h1 className="text-2xl font-bold mb-4">
                            SaaS Analytics
                          </h1>
                          <p>Advanced analytics dashboard para planos SaaS</p>
                        </div>
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="billing"
                    element={
                      <PageWrapper title="SaaS Billing">
                        <div className="p-8">
                          <h1 className="text-2xl font-bold mb-4">
                            SaaS Billing
                          </h1>
                          <p>Gerenciamento de faturamento e planos SaaS</p>
                        </div>
                      </PageWrapper>
                    }
                  />
                </Route>

                {/* Fallback global para rotas completamente não encontradas */}
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>

          {/* Debug Panel - Development Only */}
          <DebugPanel />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
