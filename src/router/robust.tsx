/**
 * 🛡️ ROBUST ROUTER - Anti-404 Loop System
 *
 * Router com tratamento robusto de 404 que evita loops:
 * - Fallback garantido para rotas não encontradas
 * - Error boundaries para casos extremos
 * - Sistema de detecção de loops
 * - Página 404 sempre acessível
 */

import React, { Suspense, lazy, useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";

// Professional Clean Layout
import ProfessionalCleanLayout from "@/components/Layout/ProfessionalCleanLayout";
import PublicLayout from "@/components/Layout/PublicLayout";

// Configuration
import { CACHE_CONFIG } from "@/config/api";
import { IS_DEVELOPMENT } from "@/lib/env";

// ===== SAFE LOADING COMPONENTS =====
const SafeGlobalLoadingFallback = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center space-y-4">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-900 border-t-transparent"></div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Lawdesk</h3>
          <p className="text-gray-600">Carregando sistema...</p>
        </div>
      </div>
    </div>
  );
};

const SafePageLoadingFallback = ({ title }: { title?: string }) => {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-3">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></div>
        <p className="text-sm text-gray-600">
          Carregando {title || "página"}...
        </p>
      </div>
    </div>
  );
};

// ===== FALLBACK 404 COMPONENT (sempre disponível) =====
const FallbackNotFound: React.FC = () => {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleGoHome = () => {
    setIsNavigating(true);
    // Use window.location para garantir navegação
    window.location.href = "/painel";
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    try {
      window.history.back();
    } catch {
      handleGoHome();
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Página não encontrada
          </h2>
          <p className="text-gray-600 mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            disabled={isNavigating}
            className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {isNavigating ? "Redirecionando..." : "Ir para Dashboard"}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleGoBack}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={handleReload}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Recarregar
            </button>
          </div>
        </div>

        {IS_DEVELOPMENT && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left">
            <h3 className="font-medium text-gray-900 mb-2">Debug Info:</h3>
            <p className="text-sm text-gray-600">
              Path: {window.location.pathname}
            </p>
            <p className="text-sm text-gray-600">
              Search: {window.location.search}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ===== LAZY LOADED PAGES =====
// Public pages
const LoginPage = lazy(() =>
  import("@/pages/Login").catch(() => ({ default: FallbackNotFound })),
);
const OnboardingLanding = lazy(() =>
  import("@/pages/OnboardingLanding").catch(() => ({
    default: FallbackNotFound,
  })),
);

// Dashboard pages
const CleanProfessionalDashboard = lazy(() =>
  import("@/pages/CleanProfessionalDashboard").catch(() => ({
    default: FallbackNotFound,
  })),
);

// Feed module
const FeedPage = lazy(() =>
  import("@/pages/Feed/index").catch(() => ({ default: FallbackNotFound })),
);

// CRM pages
const CRMProfessional = lazy(() =>
  import("@/pages/CRM/CRMProfessional").catch(() => ({
    default: FallbackNotFound,
  })),
);
const CRMClientes = lazy(() =>
  import("@/pages/CRM/Clientes/index").catch(() => ({
    default: FallbackNotFound,
  })),
);
const CRMProcessos = lazy(() =>
  import("@/pages/CRM/Processos/index").catch(() => ({
    default: FallbackNotFound,
  })),
);
const CRMContratos = lazy(() =>
  import("@/pages/CRM/Contratos/index").catch(() => ({
    default: FallbackNotFound,
  })),
);

// Intelligence modules
const DiagnosticoConclusaoPage = lazy(() =>
  import("@/pages/DiagnosticoConclusao").catch(() => ({
    default: FallbackNotFound,
  })),
);

// Other modules with fallback
const Agenda = lazy(() =>
  import("@/pages/Agenda").catch(() => ({
    default: () => <FallbackNotFound />,
  })),
);
const Publicacoes = lazy(() =>
  import("@/pages/Publicacoes").catch(() => ({
    default: () => <FallbackNotFound />,
  })),
);
const Atendimento = lazy(() =>
  import("@/pages/Atendimento").catch(() => ({
    default: () => <FallbackNotFound />,
  })),
);
const Analytics = lazy(() =>
  import("@/pages/Analytics").catch(() => ({
    default: () => <FallbackNotFound />,
  })),
);
const Configuracoes = lazy(() =>
  import("@/pages/Configuracoes").catch(() => ({
    default: () => <FallbackNotFound />,
  })),
);
const Beta = lazy(() =>
  import("@/pages/Beta").catch(() => ({ default: () => <FallbackNotFound /> })),
);
const Ajuda = lazy(() =>
  import("@/pages/Ajuda").catch(() => ({
    default: () => <FallbackNotFound />,
  })),
);

// Safe NotFound - with extra fallback
const SafeNotFound = lazy(() =>
  import("@/pages/NotFound").catch(() => ({ default: FallbackNotFound })),
);

// ===== LOOP DETECTION =====
const LoopDetection: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const [visitedPaths, setVisitedPaths] = useState<string[]>([]);

  useEffect(() => {
    const currentPath = location.pathname;

    // Detectar loop: se a mesma rota foi visitada mais de 3 vezes
    setVisitedPaths((prev) => {
      const newPaths = [...prev, currentPath].slice(-10); // manter apenas os últimos 10
      const pathCount = newPaths.filter((path) => path === currentPath).length;

      if (pathCount > 3 && currentPath !== "/painel") {
        console.warn("Loop detected, redirecting to safe route");
        window.location.href = "/painel";
        return [];
      }

      return newPaths;
    });
  }, [location.pathname]);

  return <>{children}</>;
};

// ===== PAGE WRAPPER =====
const SafePageWrapper: React.FC<{
  title: string;
  breadcrumb?: string[];
  children: React.ReactNode;
}> = ({ title, breadcrumb, children }) => {
  useEffect(() => {
    try {
      document.title = `${title} - Lawdesk CRM`;
    } catch (error) {
      console.warn("Failed to set document title:", error);
    }
  }, [title]);

  return <>{children}</>;
};

// ===== QUERY CLIENT =====
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_CONFIG?.DEFAULT_STALE_TIME || 5 * 60 * 1000,
      cacheTime: CACHE_CONFIG?.DEFAULT_CACHE_TIME || 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
      refetchOnMount: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// ===== SAFE ERROR BOUNDARY =====
class SafeErrorBoundary extends React.Component<
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
    console.error("Router Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackNotFound />;
    }

    return this.props.children;
  }
}

// ===== ROBUST ROUTER COMPONENT =====
const RobustRouter: React.FC = () => {
  return (
    <SafeErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <LoopDetection>
              <Suspense fallback={<SafeGlobalLoadingFallback />}>
                <Routes>
                  {/* ===== PUBLIC ROUTES ===== */}
                  <Route path="/login" element={<PublicLayout />}>
                    <Route
                      index
                      element={
                        <SafePageWrapper title="Login">
                          <Suspense
                            fallback={<SafePageLoadingFallback title="login" />}
                          >
                            <LoginPage />
                          </Suspense>
                        </SafePageWrapper>
                      }
                    />
                  </Route>

                  <Route path="/onboarding-start" element={<PublicLayout />}>
                    <Route
                      index
                      element={
                        <SafePageWrapper title="Bem-vindo">
                          <Suspense
                            fallback={
                              <SafePageLoadingFallback title="onboarding" />
                            }
                          >
                            <OnboardingLanding />
                          </Suspense>
                        </SafePageWrapper>
                      }
                    />
                  </Route>

                  {/* ===== PRIVATE ROUTES ===== */}
                  <Route path="/" element={<ProfessionalCleanLayout />}>
                    {/* Home redirect */}
                    <Route index element={<Navigate to="/painel" replace />} />

                    {/* Dashboard */}
                    <Route
                      path="painel"
                      element={
                        <SafePageWrapper
                          title="Dashboard"
                          breadcrumb={["Home", "Dashboard"]}
                        >
                          <Suspense
                            fallback={
                              <SafePageLoadingFallback title="dashboard" />
                            }
                          >
                            <CleanProfessionalDashboard />
                          </Suspense>
                        </SafePageWrapper>
                      }
                    />

                    {/* Feed */}
                    <Route
                      path="feed"
                      element={
                        <SafePageWrapper
                          title="Feed"
                          breadcrumb={["Home", "Feed"]}
                        >
                          <Suspense
                            fallback={<SafePageLoadingFallback title="feed" />}
                          >
                            <FeedPage />
                          </Suspense>
                        </SafePageWrapper>
                      }
                    />

                    {/* CRM */}
                    <Route
                      path="crm"
                      element={
                        <SafePageWrapper
                          title="CRM Jurídico"
                          breadcrumb={["Home", "CRM"]}
                        >
                          <Suspense
                            fallback={<SafePageLoadingFallback title="CRM" />}
                          >
                            <CRMProfessional />
                          </Suspense>
                        </SafePageWrapper>
                      }
                    />

                    <Route
                      path="crm/clientes"
                      element={
                        <SafePageWrapper
                          title="Clientes"
                          breadcrumb={["Home", "CRM", "Clientes"]}
                        >
                          <Suspense
                            fallback={
                              <SafePageLoadingFallback title="clientes" />
                            }
                          >
                            <CRMClientes />
                          </Suspense>
                        </SafePageWrapper>
                      }
                    />

                    <Route
                      path="crm/processos"
                      element={
                        <SafePageWrapper
                          title="Processos"
                          breadcrumb={["Home", "CRM", "Processos"]}
                        >
                          <Suspense
                            fallback={
                              <SafePageLoadingFallback title="processos" />
                            }
                          >
                            <CRMProcessos />
                          </Suspense>
                        </SafePageWrapper>
                      }
                    />

                    <Route
                      path="crm/contratos"
                      element={
                        <SafePageWrapper
                          title="Contratos"
                          breadcrumb={["Home", "CRM", "Contratos"]}
                        >
                          <Suspense
                            fallback={
                              <SafePageLoadingFallback title="contratos" />
                            }
                          >
                            <CRMContratos />
                          </Suspense>
                        </SafePageWrapper>
                      }
                    />

                    <Route
                      path="crm/tarefas"
                      element={
                        <SafePageWrapper
                          title="Tarefas"
                          breadcrumb={["Home", "CRM", "Tarefas"]}
                        >
                          <div className="p-6">
                            <h1 className="text-2xl font-bold mb-4">
                              Tarefas CRM
                            </h1>
                            <p className="text-gray-600">
                              Sistema de tarefas será implementado aqui.
                            </p>
                          </div>
                        </SafePageWrapper>
                      }
                    />

                    {/* Other modules */}
                    <Route
                      path="agenda"
                      element={
                        <SafePageWrapper
                          title="Calendário"
                          breadcrumb={["Home", "Calendário"]}
                        >
                          <Suspense
                            fallback={
                              <SafePageLoadingFallback title="agenda" />
                            }
                          >
                            <Agenda />
                          </Suspense>
                        </SafePageWrapper>
                      }
                    />

                    <Route
                      path="comunicacao"
                      element={
                        <SafePageWrapper
                          title="Comunicação"
                          breadcrumb={["Home", "Comunicação"]}
                        >
                          <div className="p-6">
                            <h1 className="text-2xl font-bold mb-4">
                              Comunicação
                            </h1>
                            <p className="text-gray-600">
                              Sistema de comunicação será implementado aqui.
                            </p>
                          </div>
                        </SafePageWrapper>
                      }
                    />

                    <Route
                      path="relatorios"
                      element={
                        <SafePageWrapper
                          title="Relatórios"
                          breadcrumb={["Home", "Relatórios"]}
                        >
                          <Suspense
                            fallback={
                              <SafePageLoadingFallback title="relatórios" />
                            }
                          >
                            <Analytics />
                          </Suspense>
                        </SafePageWrapper>
                      }
                    />

                    <Route
                      path="financeiro"
                      element={
                        <SafePageWrapper
                          title="Financeiro"
                          breadcrumb={["Home", "Financeiro"]}
                        >
                          <div className="p-6">
                            <h1 className="text-2xl font-bold mb-4">
                              Financeiro
                            </h1>
                            <p className="text-gray-600">
                              Sistema financeiro será implementado aqui.
                            </p>
                          </div>
                        </SafePageWrapper>
                      }
                    />

                    <Route
                      path="ged"
                      element={
                        <SafePageWrapper
                          title="Documentos"
                          breadcrumb={["Home", "Documentos"]}
                        >
                          <div className="p-6">
                            <h1 className="text-2xl font-bold mb-4">
                              Gestão Eletrônica de Documentos
                            </h1>
                            <p className="text-gray-600">
                              Sistema GED será implementado aqui.
                            </p>
                          </div>
                        </SafePageWrapper>
                      }
                    />

                    <Route
                      path="publicacoes"
                      element={
                        <SafePageWrapper
                          title="Publicações"
                          breadcrumb={["Home", "Publicações"]}
                        >
                          <Suspense
                            fallback={
                              <SafePageLoadingFallback title="publicações" />
                            }
                          >
                            <Publicacoes />
                          </Suspense>
                        </SafePageWrapper>
                      }
                    />

                    <Route
                      path="atendimento"
                      element={
                        <SafePageWrapper
                          title="Atendimento"
                          breadcrumb={["Home", "Atendimento"]}
                        >
                          <Suspense
                            fallback={
                              <SafePageLoadingFallback title="atendimento" />
                            }
                          >
                            <Atendimento />
                          </Suspense>
                        </SafePageWrapper>
                      }
                    />

                    <Route
                      path="configuracoes"
                      element={
                        <SafePageWrapper
                          title="Configurações"
                          breadcrumb={["Home", "Configurações"]}
                        >
                          <Suspense
                            fallback={
                              <SafePageLoadingFallback title="configurações" />
                            }
                          >
                            <Configuracoes />
                          </Suspense>
                        </SafePageWrapper>
                      }
                    />

                    <Route
                      path="beta"
                      element={
                        <SafePageWrapper
                          title="Beta Features"
                          breadcrumb={["Home", "Beta"]}
                        >
                          <Suspense
                            fallback={<SafePageLoadingFallback title="beta" />}
                          >
                            <Beta />
                          </Suspense>
                        </SafePageWrapper>
                      }
                    />

                    <Route
                      path="ajuda"
                      element={
                        <SafePageWrapper
                          title="Ajuda"
                          breadcrumb={["Home", "Ajuda"]}
                        >
                          <Suspense
                            fallback={<SafePageLoadingFallback title="ajuda" />}
                          >
                            <Ajuda />
                          </Suspense>
                        </SafePageWrapper>
                      }
                    />

                    <Route
                      path="diagnostico-conclusao"
                      element={
                        <SafePageWrapper
                          title="Diagnóstico"
                          breadcrumb={["Home", "Diagnóstico"]}
                        >
                          <Suspense
                            fallback={
                              <SafePageLoadingFallback title="diagnóstico" />
                            }
                          >
                            <DiagnosticoConclusaoPage />
                          </Suspense>
                        </SafePageWrapper>
                      }
                    />

                    {/* Explicit 404 route */}
                    <Route
                      path="404"
                      element={
                        <SafePageWrapper title="Página não encontrada">
                          <FallbackNotFound />
                        </SafePageWrapper>
                      }
                    />

                    {/* Catch all routes - MULTIPLE FALLBACKS */}
                    <Route
                      path="*"
                      element={
                        <SafePageWrapper title="Página não encontrada">
                          <Suspense fallback={<FallbackNotFound />}>
                            <SafeNotFound />
                          </Suspense>
                        </SafePageWrapper>
                      }
                    />
                  </Route>

                  {/* Global catch-all - LAST RESORT */}
                  <Route path="*" element={<FallbackNotFound />} />
                </Routes>
              </Suspense>
            </LoopDetection>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </SafeErrorBoundary>
  );
};

export default RobustRouter;
