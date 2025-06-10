import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";

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

// Páginas principais com lazy loading
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

// Onboarding Pages
const OnboardingPage = createLazyPage(
  () => import("./pages/Onboarding"),
  "Configuração Inicial",
);

const OnboardingLandingPage = createLazyPage(
  () => import("./pages/OnboardingLanding"),
  "Bem-vindo ao Lawdesk",
);

// CRM Error Boundary
import CRMErrorBoundary from "./components/CRM/CRMErrorBoundary";

// Páginas Gerenciais
const TarefasGerencialPage = createLazyPage(
  () => import("./pages/TarefasGerencial"),
  "Tarefas Gerenciais",
);

const GEDOrganizacionalPage = createLazyPage(
  () => import("./pages/GEDOrganizacional"),
  "GED Organizacional",
);

const FinanceiroGerencialPage = createLazyPage(
  () => import("./pages/FinanceiroGerencial"),
  "Financeiro Gerencial",
);

// Páginas Beta (órfãs)
const BetaDashboard = createLazyPage(
  () => import("./pages/Beta/BetaDashboard"),
  "Beta Dashboard",
);

const BetaReportsPage = createLazyPage(
  () => import("./pages/Beta/BetaReports"),
  "Relatórios Beta",
);

const CodeOptimizationPage = createLazyPage(
  () => import("./pages/Beta/CodeOptimization"),
  "Higienização de Código",
);

// Configuração do QueryClient otimizada
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

// Wrapper para páginas com tratamento de erro
const PageWrapper: React.FC<{
  children: React.ReactNode;
  title?: string;
}> = ({ children, title }) => {
  React.useEffect(() => {
    if (title) {
      document.title = `${title} - Lawdesk CRM`;
    }
  }, [title]);

  return <div className="w-full h-full overflow-auto fade-in">{children}</div>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Suspense fallback={<GlobalLoadingFallback />}>
            <Routes>
              {/* Ultimate Optimized Layout - Single unified system */}
              {/* Public Routes */}
              <Route path="/login" element={<PublicLayout variant="centered" />}>
                <Route index element={<div>Login Page</div>} />
              </Route>
              <Route path="/registro" element={<PublicLayout variant="centered" />}>
                <Route index element={<div>Registro Page</div>} />
              </Route>
              <Route path="/onboarding-start" element={<PublicLayout variant="default" />}>
                <Route index element={<OnboardingLandingPage />} />
              </Route>

              {/* Private Routes with Main Layout */}
              <Route path="/" element={<MainLayout />}>
                {/* Home redirect */}
                <Route index element={<Navigate to="/painel" replace />} />

                {/* Painel de Controle */}
                <Route
                  path="painel"
                  element={
                    <PageWrapper title="Painel de Controle">
                      <PainelControle />
                    </PageWrapper>
                  }
                />

                {/* CRM Jurídico - Sistema Unificado */}
                <Route path="crm-modern/*">
                  <Route
                    index
                    element={
                      <PageWrapper title="CRM Jurídico">
                        <CRMErrorBoundary>
                          <CRMUnificado />
                        </CRMErrorBoundary>
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="clientes"
                    element={
                      <PageWrapper title="Clientes">
                        <CRMErrorBoundary>
                          <CRMUnificado defaultModule="clientes" />
                        </CRMErrorBoundary>
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="processos"
                    element={
                      <PageWrapper title="Processos">
                        <CRMErrorBoundary>
                          <CRMUnificado defaultModule="processos" />
                        </CRMErrorBoundary>
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="tarefas"
                    element={
                      <PageWrapper title="Tarefas">
                        <CRMErrorBoundary>
                          <CRMUnificado defaultModule="tarefas" />
                        </CRMErrorBoundary>
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="contratos"
                    element={
                      <PageWrapper title="Contratos">
                        <CRMErrorBoundary>
                          <CRMUnificado defaultModule="contratos" />
                        </CRMErrorBoundary>
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="financeiro"
                    element={
                      <PageWrapper title="Financeiro">
                        <CRMErrorBoundary>
                          <CRMUnificado defaultModule="financeiro" />
                        </CRMErrorBoundary>
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="documentos"
                    element={
                      <PageWrapper title="Documentos">
                        <CRMErrorBoundary>
                          <CRMUnificado defaultModule="documentos" />
                        </CRMErrorBoundary>
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="publicacoes"
                    element={
                      <PageWrapper title="Publicações">
                        <CRMErrorBoundary>
                          <CRMUnificado defaultModule="publicacoes" />
                        </CRMErrorBoundary>
                      </PageWrapper>
                    }
                  />
                </Route>

                {/* Outras páginas principais */}
                <Route
                  path="agenda"
                  element={
                    <PageWrapper title="Agenda">
                      <AgendaPage />
                    </PageWrapper>
                  }
                />

                <Route
                  path="publicacoes"
                  element={
                    <PageWrapper title="Publicações">
                      <PublicacoesPage />
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
                  path="tempo"
                  element={
                    <PageWrapper title="Controle de Tempo">
                      <TarefasPage />
                    </PageWrapper>
                  }
                />

                <Route
                  path="configuracoes-usuario"
                  element={
                    <PageWrapper title="Configurações">
                      <ConfiguracoesPage />
                    </PageWrapper>
                  }
                />

                {/* Páginas Gerenciais */}
                <Route
                  path="tarefas-gerencial"
                  element={
                    <PageWrapper title="Tarefas Gerenciais">
                      <TarefasGerencialPage />
                    </PageWrapper>
                  }
                />

                <Route
                  path="ged-organizacional"
                  element={
                    <PageWrapper title="GED Organizacional">
                      <GEDOrganizacionalPage />
                    </PageWrapper>
                  }
                />

                <Route
                  path="financeiro-gerencial"
                  element={
                    <PageWrapper title="Financeiro Gerencial">
                      <FinanceiroGerencialPage />
                    </PageWrapper>
                  }
                />

                {/* Seção Beta - Páginas Órfãs (Admin Only) */}
                <Route path="beta/*">
                  <Route
                    index
                    element={
                      <PageWrapper title="Beta - Páginas Órfãs">
                        <BetaDashboard />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="reports"
                    element={
                      <PageWrapper title="Beta - Relatórios">
                        <BetaReportsPage />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="optimization"
                    element={
                      <PageWrapper title="Beta - Higienização de Código">
                        <CodeOptimizationPage />
                      </PageWrapper>
                    }
                  />
                </Route>
              </Route>

              {/* Onboarding Routes - Outside main layout for clean experience */}
              <Route
                path="/onboarding-start"
                element={
                  <PageWrapper title="Bem-vindo ao Lawdesk">
                    <OnboardingLandingPage />
                  </PageWrapper>
                }
              />
              <Route
                path="onboarding"
                element={
                  <PageWrapper title="Configuração Inicial">
                    <OnboardingPage />
                  </PageWrapper>
                }
              />

              {/* Fallback para rotas não encontradas */}
              <Route path="*" element={<Navigate to="/painel" replace />} />
            </Route>

              {/* SaaS Routes with Enhanced Layout */}
              <Route path="/saas" element={<LawdeskLayoutSaaS />}>
                <Route index element={<Navigate to="/saas/dashboard" replace />} />
                <Route path="dashboard" element={<PainelControle />} />
                <Route path="crm/*" element={<CRMUnificado />} />
                <Route path="analytics" element={<div>SaaS Analytics</div>} />
                <Route path="billing" element={<div>SaaS Billing</div>} />
              </Route>
            </Routes>
          </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;