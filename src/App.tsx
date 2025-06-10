import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeInitializer } from "@/components/ThemeInitializer";
import { ErrorBoundary } from "@/components/ui/error-boundary";

// Layout principal otimizado
import OptimizedTraditionalLayout from "@/components/Layout/OptimizedTraditionalLayout";

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
    <ErrorBoundary>
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
    </ErrorBoundary>
  ));
};

// Páginas principais com lazy loading
const PainelControle = createLazyPage(
  () => import("./pages/PainelControle"),
  "Painel de Controle",
);

const ModernCRMHub = createLazyPage(
  () => import("./pages/CRM/ModernCRMHubV2"),
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

// Páginas Beta (órfãs)
const BetaDashboard = createLazyPage(
  () => import("./pages/Beta/BetaDashboard"),
  "Beta Dashboard",
);

const AIEnhancedPage = createLazyPage(
  () => import("./pages/AIEnhanced"),
  "IA Avançada",
);

const TestDashboardPage = createLazyPage(
  () => import("./pages/TestDashboard"),
  "Dashboard de Testes",
);

const MobileDashboardPage = createLazyPage(
  () => import("./pages/MobileDashboard"),
  "Dashboard Mobile",
);

const TicketsPage = createLazyPage(
  () => import("./pages/Tickets"),
  "Sistema de Tickets",
);

const ThemeTestPage = createLazyPage(
  () => import("./pages/ThemeTestPage"),
  "Teste de Tema",
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
      cacheTime: 1000 * 60 * 10, // 10 minutos
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
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeInitializer />
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<GlobalLoadingFallback />}>
              <Routes>
                {/* Layout principal com todas as rotas aninhadas */}
                <Route path="/" element={<OptimizedTraditionalLayout />}>
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

                  {/* CRM Jurídico - Rotas unificadas */}
                  <Route path="crm-modern/*">
                    <Route
                      index
                      element={
                        <PageWrapper title="CRM Jurídico">
                          <ModernCRMHub />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="clientes"
                      element={
                        <PageWrapper title="Clientes">
                          <ModernCRMHub defaultModule="clientes" />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="processos"
                      element={
                        <PageWrapper title="Processos">
                          <ModernCRMHub defaultModule="processos" />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="tarefas"
                      element={
                        <PageWrapper title="Tarefas">
                          <ModernCRMHub defaultModule="tarefas" />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="contratos"
                      element={
                        <PageWrapper title="Contratos">
                          <ModernCRMHub defaultModule="contratos" />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="financeiro"
                      element={
                        <PageWrapper title="Financeiro">
                          <ModernCRMHub defaultModule="financeiro" />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="documentos"
                      element={
                        <PageWrapper title="Documentos">
                          <ModernCRMHub defaultModule="documentos" />
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
                      path="aienhanced"
                      element={
                        <PageWrapper title="Beta - IA Avançada">
                          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-4">
                            <div className="flex items-center gap-2 text-purple-800">
                              <span className="text-sm font-medium">
                                🧪 Página Beta: Não conectada ao menu principal
                              </span>
                            </div>
                          </div>
                          <AIEnhancedPage />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="testdashboard"
                      element={
                        <PageWrapper title="Beta - Dashboard de Testes">
                          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-4">
                            <div className="flex items-center gap-2 text-purple-800">
                              <span className="text-sm font-medium">
                                🧪 Página Beta: Não conectada ao menu principal
                              </span>
                            </div>
                          </div>
                          <TestDashboardPage />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="mobiledashboard"
                      element={
                        <PageWrapper title="Beta - Dashboard Mobile">
                          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-4">
                            <div className="flex items-center gap-2 text-purple-800">
                              <span className="text-sm font-medium">
                                🧪 Página Beta: Não conectada ao menu principal
                              </span>
                            </div>
                          </div>
                          <MobileDashboardPage />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="tickets"
                      element={
                        <PageWrapper title="Beta - Sistema de Tickets">
                          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-4">
                            <div className="flex items-center gap-2 text-purple-800">
                              <span className="text-sm font-medium">
                                🧪 Página Beta: Não conectada ao menu principal
                              </span>
                            </div>
                          </div>
                          <TicketsPage />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="themetest"
                      element={
                        <PageWrapper title="Beta - Teste de Tema">
                          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-4">
                            <div className="flex items-center gap-2 text-purple-800">
                              <span className="text-sm font-medium">
                                🧪 Página Beta: Não conectada ao menu principal
                              </span>
                            </div>
                          </div>
                          <ThemeTestPage />
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

                {/* Fallback para rotas não encontradas */}
                <Route path="*" element={<Navigate to="/painel" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
