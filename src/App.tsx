import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { StorageProvider } from "@/hooks/useStorageConfig";
import { RegrasProcessuaisProvider } from "@/contexts/RegrasProcessuaisContext";
import { PermissionProvider } from "@/hooks/usePermissions";
import { Layout } from "@/components/Layout/Layout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import NotFound from "./pages/NotFound";

// Import the enhanced theme styles
import "@/styles/themes.css";

// Lazy load all pages for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DashboardExecutivo = lazy(() => import("./pages/DashboardExecutivo"));
const CRM = lazy(() => import("./pages/CRM"));
const CRMEnhanced = lazy(() => import("./pages/CRMEnhanced"));
const Tickets = lazy(() => import("./pages/Tickets"));
const AtendimentoEnhanced = lazy(() => import("./pages/AtendimentoEnhanced"));
const Calendar = lazy(() => import("./pages/Calendar"));
const AI = lazy(() => import("./pages/AI"));
const AIEnhanced = lazy(() => import("./pages/AIEnhanced"));
const Settings = lazy(() => import("./pages/Settings"));
const Tarefas = lazy(() => import("./pages/Tarefas"));
const Publicacoes = lazy(() => import("./pages/Publicacoes"));
const Contratos = lazy(() => import("./pages/Contratos"));
const Financeiro = lazy(() => import("./pages/Financeiro"));
const GEDJuridico = lazy(() => import("./pages/GEDJuridico"));
const GEDJuridicoV2 = lazy(() => import("./pages/GEDJuridicoV2"));
const ConfiguracaoArmazenamento = lazy(
  () => import("./pages/ConfiguracaoArmazenamento"),
);
const ConfiguracoesPrazosPage = lazy(
  () => import("./pages/ConfiguracoesPrazosPage"),
);
const PlanoDeAcaoIA = lazy(() => import("./components/System/PlanoDeAcaoIA"));
const ActionPlan = lazy(() => import("./pages/ActionPlan"));

// Test pages (lazy loaded)
const ClienteDetalhesTest = lazy(() => import("./pages/ClienteDetalhesTest"));
const TesteConfiguracaoStorage = lazy(
  () => import("./pages/TesteConfiguracaoStorage"),
);
const ThemeTestPage = lazy(() => import("./pages/ThemeTestPage"));

// Configure React Query with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Page wrapper with error boundary and loading
const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
  </ErrorBoundary>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <ThemeProvider>
        <StorageProvider>
          <RegrasProcessuaisProvider>
            <PermissionProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route
                      path="/"
                      element={<Navigate to="/dashboard" replace />}
                    />
                    <Route path="/" element={<Layout />}>
                      {/* Core Application Routes */}
                      <Route
                        path="dashboard"
                        element={
                          <PageWrapper>
                            <Dashboard />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="dashboard-executivo"
                        element={
                          <PageWrapper>
                            <DashboardExecutivo />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="crm"
                        element={
                          <PageWrapper>
                            <CRMEnhanced />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="crm-legacy"
                        element={
                          <PageWrapper>
                            <CRM />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="tarefas"
                        element={
                          <PageWrapper>
                            <Tarefas />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="publicacoes"
                        element={
                          <PageWrapper>
                            <Publicacoes />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="contratos"
                        element={
                          <PageWrapper>
                            <Contratos />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="financeiro"
                        element={
                          <PageWrapper>
                            <Financeiro />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="tickets"
                        element={
                          <PageWrapper>
                            <Tickets />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="atendimento"
                        element={
                          <PageWrapper>
                            <AtendimentoEnhanced />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="agenda"
                        element={
                          <PageWrapper>
                            <Calendar />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="ai"
                        element={
                          <PageWrapper>
                            <AI />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="ai-enhanced"
                        element={
                          <PageWrapper>
                            <AIEnhanced />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="plano-acao-ia"
                        element={
                          <PageWrapper>
                            <PlanoDeAcaoIA />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="action-plan"
                        element={
                          <PageWrapper>
                            <ActionPlan />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="plano-acao"
                        element={
                          <PageWrapper>
                            <ActionPlan />
                          </PageWrapper>
                        }
                      />

                      {/* GED Routes */}
                      <Route
                        path="ged"
                        element={
                          <PageWrapper>
                            <GEDJuridicoV2 />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="ged-juridico"
                        element={
                          <PageWrapper>
                            <GEDJuridicoV2 />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="ged-legacy"
                        element={
                          <PageWrapper>
                            <GEDJuridico />
                          </PageWrapper>
                        }
                      />

                      {/* Settings and Configuration Routes */}
                      <Route
                        path="settings"
                        element={
                          <PageWrapper>
                            <Settings />
                          </PageWrapper>
                        }
                      />
                      <Route path="configuracoes">
                        <Route
                          path="armazenamento"
                          element={
                            <PageWrapper>
                              <ConfiguracaoArmazenamento />
                            </PageWrapper>
                          }
                        />
                        <Route
                          path="prazos"
                          element={
                            <PageWrapper>
                              <ConfiguracoesPrazosPage />
                            </PageWrapper>
                          }
                        />
                      </Route>

                      {/* Development/Test Routes */}
                      <Route
                        path="cliente-detalhes-test"
                        element={
                          <PageWrapper>
                            <ClienteDetalhesTest />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="teste-configuracao-storage"
                        element={
                          <PageWrapper>
                            <TesteConfiguracaoStorage />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="theme-test"
                        element={
                          <PageWrapper>
                            <ThemeTestPage />
                          </PageWrapper>
                        }
                      />

                      {/* Legacy route for backward compatibility */}
                      <Route
                        path="publicacoes-example"
                        element={<Navigate to="/publicacoes" replace />}
                      />
                    </Route>

                    {/* Catch-all route for 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </PermissionProvider>
          </RegrasProcessuaisProvider>
        </StorageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </QueryClientProvider>
);

export default App;
