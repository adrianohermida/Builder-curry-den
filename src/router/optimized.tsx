/**
 * 🚀 OPTIMIZED ROUTER - ROTEADOR SAAS 2025+ OTIMIZADO
 *
 * Router otimizado com:
 * - Lazy loading otimizado
 * - Code splitting inteligente
 * - Performance máxima
 * - Error boundaries
 * - Loading states consistentes
 */

import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";

// Optimized Layout
import OptimizedLayout from "@/components/Layout/OptimizedLayout";
import PublicLayout from "@/components/Layout/PublicLayout";

// Theme initializer
import ThemeInitializer from "@/components/ThemeInitializer";

// Configuration
import { CACHE_CONFIG } from "@/config/api";
import { IS_DEVELOPMENT } from "@/lib/env";

// ===== LOADING COMPONENTS =====
const GlobalLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center space-y-4">
      <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Lawdesk</h3>
        <p className="text-gray-600">Carregando sistema...</p>
      </div>
    </div>
  </div>
);

const PageLoadingFallback = ({ title }: { title?: string }) => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="text-center space-y-4">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      <p className="text-sm text-gray-600">Carregando {title || "página"}...</p>
    </div>
  </div>
);

// ===== LAZY LOADED PAGES =====
// Public pages
const LoginPage = lazy(() => import("@/pages/Login"));
const OnboardingLanding = lazy(() => import("@/pages/OnboardingLanding"));

// Dashboard pages
const CleanPainelControle = lazy(() => import("@/pages/CleanPainelControle"));
const ModernDashboard = lazy(() => import("@/pages/ModernDashboard"));

// CRM pages
const CRMUnificado = lazy(() => import("@/pages/CRM/CRMUnificado"));
const CRMModerno = lazy(() => import("@/pages/CRM/index"));

// Feed module
const FeedModule = lazy(() => import("@/pages/Feed/index"));

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
  children: React.ReactNode;
}> = ({ title, children }) => {
  // Set document title
  React.useEffect(() => {
    document.title = `${title} - Lawdesk`;
  }, [title]);

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
      // Optimize for performance
      refetchOnMount: false,
      refetchInterval: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// ===== ERROR BOUNDARY =====
class RouterErrorBoundary extends React.Component<
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
    console.error("Router Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center space-y-4 p-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Ops! Algo deu errado
            </h2>
            <p className="text-gray-600">
              Ocorreu um erro inesperado. Tente recarregar a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ===== OPTIMIZED ROUTER COMPONENT =====
const OptimizedRouter: React.FC = () => {
  return (
    <RouterErrorBoundary>
      <ThemeInitializer>
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
                            fallback={
                              <PageLoadingFallback title="onboarding" />
                            }
                          >
                            <OnboardingLanding />
                          </Suspense>
                        </PageWrapper>
                      }
                    />
                  </Route>

                  {/* ===== PRIVATE ROUTES (OPTIMIZED LAYOUT) ===== */}
                  <Route path="/" element={<OptimizedLayout />}>
                    {/* Home redirect */}
                    <Route index element={<Navigate to="/painel" replace />} />

                    {/* Dashboard */}
                    <Route
                      path="painel"
                      element={
                        <PageWrapper title="Painel de Controle">
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
                        <PageWrapper title="Dashboard">
                          <Suspense
                            fallback={<PageLoadingFallback title="dashboard" />}
                          >
                            <ModernDashboard />
                          </Suspense>
                        </PageWrapper>
                      }
                    />

                    {/* Feed */}
                    <Route
                      path="feed/*"
                      element={
                        <PageWrapper title="Feed Colaborativo">
                          <Suspense
                            fallback={<PageLoadingFallback title="feed" />}
                          >
                            <FeedModule />
                          </Suspense>
                        </PageWrapper>
                      }
                    />

                    {/* CRM Unificado */}
                    <Route
                      path="crm/*"
                      element={
                        <PageWrapper title="CRM Unificado">
                          <Suspense
                            fallback={<PageLoadingFallback title="CRM" />}
                          >
                            <CRMUnificado />
                          </Suspense>
                        </PageWrapper>
                      }
                    />

                    {/* CRM Moderno */}
                    <Route
                      path="crm-modern/*"
                      element={
                        <PageWrapper title="CRM Jurídico">
                          <Suspense
                            fallback={<PageLoadingFallback title="CRM" />}
                          >
                            <CRMModerno />
                          </Suspense>
                        </PageWrapper>
                      }
                    />

                    {/* Agenda */}
                    <Route
                      path="agenda/*"
                      element={
                        <PageWrapper title="Agenda">
                          <Suspense
                            fallback={<PageLoadingFallback title="agenda" />}
                          >
                            <Agenda />
                          </Suspense>
                        </PageWrapper>
                      }
                    />

                    {/* Publicações */}
                    <Route
                      path="publicacoes/*"
                      element={
                        <PageWrapper title="Publicações">
                          <Suspense
                            fallback={
                              <PageLoadingFallback title="publicações" />
                            }
                          >
                            <Publicacoes />
                          </Suspense>
                        </PageWrapper>
                      }
                    />

                    {/* Atendimento */}
                    <Route
                      path="atendimento/*"
                      element={
                        <PageWrapper title="Central de Atendimento">
                          <Suspense
                            fallback={
                              <PageLoadingFallback title="atendimento" />
                            }
                          >
                            <Atendimento />
                          </Suspense>
                        </PageWrapper>
                      }
                    />

                    {/* Analytics */}
                    <Route
                      path="analytics/*"
                      element={
                        <PageWrapper title="Relatórios e Analytics">
                          <Suspense
                            fallback={
                              <PageLoadingFallback title="relatórios" />
                            }
                          >
                            <Analytics />
                          </Suspense>
                        </PageWrapper>
                      }
                    />

                    {/* Beta */}
                    <Route
                      path="beta/*"
                      element={
                        <PageWrapper title="Recursos Beta">
                          <Suspense
                            fallback={<PageLoadingFallback title="beta" />}
                          >
                            <Beta />
                          </Suspense>
                        </PageWrapper>
                      }
                    />

                    {/* Configurações */}
                    <Route
                      path="configuracoes/*"
                      element={
                        <PageWrapper title="Configurações">
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

                    {/* Configuração Armazenamento */}
                    <Route
                      path="configuracao-armazenamento"
                      element={
                        <PageWrapper title="Configuração de Armazenamento">
                          <Suspense
                            fallback={
                              <PageLoadingFallback title="armazenamento" />
                            }
                          >
                            <ConfiguracaoArmazenamento />
                          </Suspense>
                        </PageWrapper>
                      }
                    />

                    {/* Ajuda */}
                    <Route
                      path="ajuda/*"
                      element={
                        <PageWrapper title="Central de Ajuda">
                          <Suspense
                            fallback={<PageLoadingFallback title="ajuda" />}
                          >
                            <Ajuda />
                          </Suspense>
                        </PageWrapper>
                      }
                    />

                    {/* 404 - Not Found */}
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
      </ThemeInitializer>
    </RouterErrorBoundary>
  );
};

export default OptimizedRouter;
