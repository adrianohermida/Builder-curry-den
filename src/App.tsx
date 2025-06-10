import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";

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

// Páginas principais com lazy loading
// Storage Management
const StorageManagement = createLazyPage(
  () => import("@/pages/Storage"),
  "Gestão de Armazenamento",
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
  "Tarefas Gerencial",
);

const UsersGerencialPage = createLazyPage(
  () => import("./pages/UsersGerencial"),
  "Gestão de Usuários",
);

const MetricsGerencialPage = createLazyPage(
  () => import("./pages/MetricsGerencial"),
  "Métricas Gerenciais",
);

const CodeOptimizationPage = createLazyPage(
  () => import("./pages/Beta/CodeOptimization"),
  "Code Optimization",
);

// Wrapper para páginas com título
const PageWrapper: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  React.useEffect(() => {
    document.title = title;
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
      <TooltipProvider>
        <BrowserRouter>
          <Suspense fallback={<GlobalLoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/login"
                element={<PublicLayout variant="centered" />}
              >
                <Route
                  index
                  element={
                    <div className="p-8 text-center">
                      Login Page - Em construção
                    </div>
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
                    <div className="p-8 text-center">
                      Registro Page - Em construção
                    </div>
                  }
                />
              </Route>

              <Route
                path="/onboarding-start"
                element={<PublicLayout variant="default" />}
              >
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

                {/* Publicações */}
                <Route
                  path="publicacoes"
                  element={
                    <PageWrapper title="Publicações">
                      <PublicacoesPage />
                    </PageWrapper>
                  }
                />

                {/* Agenda */}
                <Route
                  path="agenda"
                  element={
                    <PageWrapper title="Agenda">
                      <AgendaPage />
                    </PageWrapper>
                  }
                />

                {/* Atendimento */}
                <Route
                  path="atendimento"
                  element={
                    <PageWrapper title="Atendimento">
                      <AtendimentoPage />
                    </PageWrapper>
                  }
                />

                {/* Financeiro */}
                <Route
                  path="financeiro"
                  element={
                    <PageWrapper title="Financeiro">
                      <FinanceiroPage />
                    </PageWrapper>
                  }
                />

                {/* Contratos */}
                <Route
                  path="contratos"
                  element={
                    <PageWrapper title="Contratos">
                      <ContratosPage />
                    </PageWrapper>
                  }
                />

                {/* Tarefas */}
                <Route
                  path="tarefas"
                  element={
                    <PageWrapper title="Tarefas">
                      <TarefasPage />
                    </PageWrapper>
                  }
                />

                {/* Configurações */}
                <Route
                  path="configuracoes"
                  element={
                    <PageWrapper title="Configurações">
                      <ConfiguracoesPage />
                    </PageWrapper>
                  }
                />

                {/* Gestão/Admin Routes */}
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
                    path="code-optimization"
                    element={
                      <PageWrapper title="Code Optimization">
                        <CodeOptimizationPage />
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

                {/* Fallback para rotas não encontradas */}
                <Route path="*" element={<Navigate to="/painel" replace />} />
              </Route>

              {/* SaaS Routes with Enhanced Layout */}
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
            </Routes>
          </Suspense>
        </BrowserRouter>

        {/* Debug Panel - Development Only */}
        <DebugPanel />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
