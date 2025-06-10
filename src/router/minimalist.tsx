/**
 * 🚀 MINIMALIST ROUTER - CRM-V3-MINIMALIA
 *
 * Router otimizado com layout minimalista:
 * - Layout SaaS 2025 clean
 * - Performance otimizada
 * - Rotas corrigidas e organizadas
 * - Breadcrumbs automáticos
 * - Navegação fluida
 */

import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";

// Minimalist Layout
import MinimalistSaaSLayout from "@/components/Layout/MinimalistSaaSLayout";
import PublicLayout from "@/components/Layout/PublicLayout";

// Configuration
import { CACHE_CONFIG } from "@/config/api";
import { IS_DEVELOPMENT } from "@/lib/env";

// ===== LOADING COMPONENTS =====
const GlobalLoadingFallback = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-4">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Lawdesk CRM
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Carregando sistema...
          </p>
        </div>
      </div>
    </div>
  );
};

const PageLoadingFallback = ({ title }: { title?: string }) => {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-3">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Carregando {title || "página"}...
        </p>
      </div>
    </div>
  );
};

// ===== LAZY LOADED PAGES =====
// Public pages
const LoginPage = lazy(() => import("@/pages/Login"));
const OnboardingLanding = lazy(() => import("@/pages/OnboardingLanding"));

// Dashboard pages
const CleanPainelControle = lazy(() => import("@/pages/CleanPainelControle"));
const ModernDashboard = lazy(() => import("@/pages/ModernDashboard"));

// CRM pages - Minimalist versions
const CRMMinimalist = lazy(() => import("@/pages/CRM/CRMMinimalist"));
const CRMClientes = lazy(() => import("@/pages/CRM/Clientes/index"));
const CRMProcessos = lazy(() => import("@/pages/CRM/Processos/index"));
const CRMContratos = lazy(() => import("@/pages/CRM/Contratos/index"));
const ProcessosEnhanced = lazy(
  () => import("@/pages/CRM/Processos/ProcessosEnhanced"),
);

// Intelligence modules
const DiagnosticoConclusaoPage = lazy(
  () => import("@/pages/DiagnosticoConclusao"),
);

// Other modules
const Agenda = lazy(() => import("@/pages/Agenda"));
const Publicacoes = lazy(() => import("@/pages/Publicacoes"));
const Atendimento = lazy(() => import("@/pages/Atendimento"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const ConfiguracaoArmazenamento = lazy(
  () => import("@/pages/ConfiguracaoArmazenamento"),
);
const Configuracoes = lazy(() => import("@/pages/Configuracoes"));
const Beta = lazy(() => import("@/pages/Beta"));
const Ajuda = lazy(() => import("@/pages/Ajuda"));

// Error pages
const NotFound = lazy(() => import("@/pages/NotFound"));

// ===== PAGE WRAPPER =====
const PageWrapper: React.FC<{
  title: string;
  breadcrumb?: string[];
  children: React.ReactNode;
}> = ({ title, breadcrumb, children }) => {
  // Set document title
  React.useEffect(() => {
    document.title = `${title} - Lawdesk CRM`;
  }, [title]);

  // Update breadcrumb context if needed
  React.useEffect(() => {
    if (breadcrumb) {
      // Store breadcrumb in context or state management
      console.log("Breadcrumb:", breadcrumb);
    }
  }, [breadcrumb]);

  return <>{children}</>;
};

// ===== QUERY CLIENT =====
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_CONFIG.DEFAULT_STALE_TIME,
      cacheTime: CACHE_CONFIG.DEFAULT_CACHE_TIME,
      refetchOnWindowFocus: false,
      retry: 1,
      refetchOnMount: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// ===== ERROR BOUNDARY =====
class MinimalistErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Minimalist Router Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="text-center space-y-4 p-8 max-w-md">
            <div className="text-6xl">😵</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Ops! Algo deu errado
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Ocorreu um erro inesperado. Tente recarregar a página.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Recarregar página
              </button>
              <button
                onClick={() => (window.location.href = "/painel")}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Ir para o início
              </button>
            </div>
            {IS_DEVELOPMENT && this.state.error && (
              <details className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-left">
                <summary className="font-medium text-red-800 dark:text-red-400 cursor-pointer">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <pre className="mt-2 text-xs text-red-700 dark:text-red-300 overflow-auto">
                  {this.state.error.message}
                  {"\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ===== MINIMALIST ROUTER COMPONENT =====
const MinimalistRouter: React.FC = () => {
  return (
    <MinimalistErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <Suspense fallback={<GlobalLoadingFallback />}>
              <Routes>
                {/* ===== PUBLIC ROUTES ===== */}
                <Route path="/login" element={<PublicLayout />}>
                  <Route
                    index
                    element={
                      <PageWrapper title="Login">
                        <Suspense
                          fallback={<PageLoadingFallback title="login" />}
                        >
                          <LoginPage />
                        </Suspense>
                      </PageWrapper>
                    }
                  />
                </Route>

                <Route path="/onboarding-start" element={<PublicLayout />}>
                  <Route
                    index
                    element={
                      <PageWrapper title="Bem-vindo">
                        <Suspense
                          fallback={<PageLoadingFallback title="onboarding" />}
                        >
                          <OnboardingLanding />
                        </Suspense>
                      </PageWrapper>
                    }
                  />
                </Route>

                {/* ===== PRIVATE ROUTES (MINIMALIST LAYOUT) ===== */}
                <Route path="/" element={<MinimalistSaaSLayout />}>
                  {/* Home redirect */}
                  <Route index element={<Navigate to="/painel" replace />} />

                  {/* Dashboard */}
                  <Route
                    path="painel"
                    element={
                      <PageWrapper
                        title="Painel de Controle"
                        breadcrumb={["Home", "Painel"]}
                      >
                        <Suspense
                          fallback={<PageLoadingFallback title="painel" />}
                        >
                          <CleanPainelControle />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* Dashboard alternativo */}
                  <Route
                    path="dashboard"
                    element={
                      <PageWrapper
                        title="Dashboard"
                        breadcrumb={["Home", "Dashboard"]}
                      >
                        <Suspense
                          fallback={<PageLoadingFallback title="dashboard" />}
                        >
                          <ModernDashboard />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* Diagnóstico de Conclusão */}
                  <Route
                    path="diagnostico-conclusao"
                    element={
                      <PageWrapper
                        title="Diagnóstico de Conclusão"
                        breadcrumb={["Home", "Intelligence", "Diagnóstico"]}
                      >
                        <Suspense
                          fallback={<PageLoadingFallback title="diagnóstico" />}
                        >
                          <DiagnosticoConclusaoPage />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* ===== CRM ROUTES =====  */}
                  {/* CRM Main - Minimalist Version */}
                  <Route
                    path="crm"
                    element={
                      <PageWrapper
                        title="CRM Jurídico"
                        breadcrumb={["Home", "CRM"]}
                      >
                        <Suspense
                          fallback={<PageLoadingFallback title="CRM" />}
                        >
                          <CRMMinimalist />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* CRM Clientes */}
                  <Route
                    path="crm/clientes"
                    element={
                      <PageWrapper
                        title="Clientes"
                        breadcrumb={["Home", "CRM", "Clientes"]}
                      >
                        <Suspense
                          fallback={<PageLoadingFallback title="clientes" />}
                        >
                          <CRMClientes />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* CRM Processos */}
                  <Route
                    path="crm/processos"
                    element={
                      <PageWrapper
                        title="Casos e Processos"
                        breadcrumb={["Home", "CRM", "Processos"]}
                      >
                        <Suspense
                          fallback={<PageLoadingFallback title="processos" />}
                        >
                          <CRMProcessos />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* CRM Processos Enhanced */}
                  <Route
                    path="crm/processos/enhanced"
                    element={
                      <PageWrapper
                        title="Processos Enhanced"
                        breadcrumb={["Home", "CRM", "Processos", "Enhanced"]}
                      >
                        <Suspense
                          fallback={
                            <PageLoadingFallback title="processos enhanced" />
                          }
                        >
                          <ProcessosEnhanced />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* CRM Contratos */}
                  <Route
                    path="crm/contratos"
                    element={
                      <PageWrapper
                        title="Contratos"
                        breadcrumb={["Home", "CRM", "Contratos"]}
                      >
                        <Suspense
                          fallback={<PageLoadingFallback title="contratos" />}
                        >
                          <CRMContratos />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* CRM Tarefas */}
                  <Route
                    path="crm/tarefas"
                    element={
                      <PageWrapper
                        title="Tarefas"
                        breadcrumb={["Home", "CRM", "Tarefas"]}
                      >
                        <Suspense
                          fallback={<PageLoadingFallback title="tarefas" />}
                        >
                          <div className="p-6">
                            <h1 className="text-2xl font-bold mb-4">
                              Tarefas CRM
                            </h1>
                            <p className="text-gray-600">
                              Sistema de tarefas será implementado aqui.
                            </p>
                          </div>
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* ===== OTHER MODULES ===== */}
                  {/* Agenda/Calendário */}
                  <Route
                    path="agenda"
                    element={
                      <PageWrapper
                        title="Calendário"
                        breadcrumb={["Home", "Calendário"]}
                      >
                        <Suspense
                          fallback={<PageLoadingFallback title="agenda" />}
                        >
                          <Agenda />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* Comunicação */}
                  <Route
                    path="comunicacao"
                    element={
                      <PageWrapper
                        title="Comunicação"
                        breadcrumb={["Home", "Comunicação"]}
                      >
                        <Suspense
                          fallback={<PageLoadingFallback title="comunicação" />}
                        >
                          <div className="p-6">
                            <h1 className="text-2xl font-bold mb-4">
                              Comunicação
                            </h1>
                            <p className="text-gray-600">
                              Sistema de comunicação será implementado aqui.
                            </p>
                          </div>
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* Relatórios */}
                  <Route
                    path="relatorios"
                    element={
                      <PageWrapper
                        title="Relatórios"
                        breadcrumb={["Home", "Relatórios"]}
                      >
                        <Suspense
                          fallback={<PageLoadingFallback title="relatórios" />}
                        >
                          <Analytics />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* Financeiro */}
                  <Route
                    path="financeiro"
                    element={
                      <PageWrapper
                        title="Financeiro"
                        breadcrumb={["Home", "Financeiro"]}
                      >
                        <Suspense
                          fallback={<PageLoadingFallback title="financeiro" />}
                        >
                          <div className="p-6">
                            <h1 className="text-2xl font-bold mb-4">
                              Financeiro
                            </h1>
                            <p className="text-gray-600">
                              Sistema financeiro será implementado aqui.
                            </p>
                          </div>
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* Documentos/GED */}
                  <Route
                    path="ged"
                    element={
                      <PageWrapper
                        title="Documentos"
                        breadcrumb={["Home", "Documentos"]}
                      >
                        <Suspense
                          fallback={<PageLoadingFallback title="documentos" />}
                        >
                          <div className="p-6">
                            <h1 className="text-2xl font-bold mb-4">
                              Gestão Eletrônica de Documentos
                            </h1>
                            <p className="text-gray-600">
                              Sistema GED será implementado aqui.
                            </p>
                          </div>
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* Publicações */}
                  <Route
                    path="publicacoes"
                    element={
                      <PageWrapper
                        title="Publicações"
                        breadcrumb={["Home", "Publicações"]}
                      >
                        <Suspense
                          fallback={<PageLoadingFallback title="publicações" />}
                        >
                          <Publicacoes />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* Atendimento */}
                  <Route
                    path="atendimento"
                    element={
                      <PageWrapper
                        title="Atendimento"
                        breadcrumb={["Home", "Atendimento"]}
                      >
                        <Suspense
                          fallback={<PageLoadingFallback title="atendimento" />}
                        >
                          <Atendimento />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* Configurações */}
                  <Route
                    path="configuracoes"
                    element={
                      <PageWrapper
                        title="Configurações"
                        breadcrumb={["Home", "Configurações"]}
                      >
                        <Suspense
                          fallback={
                            <PageLoadingFallback title="configurações" />
                          }
                        >
                          <Configuracoes />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* Beta Features */}
                  <Route
                    path="beta"
                    element={
                      <PageWrapper
                        title="Beta Features"
                        breadcrumb={["Home", "Beta"]}
                      >
                        <Suspense
                          fallback={<PageLoadingFallback title="beta" />}
                        >
                          <Beta />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* Ajuda */}
                  <Route
                    path="ajuda"
                    element={
                      <PageWrapper title="Ajuda" breadcrumb={["Home", "Ajuda"]}>
                        <Suspense
                          fallback={<PageLoadingFallback title="ajuda" />}
                        >
                          <Ajuda />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* Catch all - 404 */}
                  <Route
                    path="*"
                    element={
                      <PageWrapper title="Página não encontrada">
                        <Suspense fallback={<PageLoadingFallback />}>
                          <NotFound />
                        </Suspense>
                      </PageWrapper>
                    }
                  />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </MinimalistErrorBoundary>
  );
};

export default MinimalistRouter;
