import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeInitializer } from "@/components/ThemeInitializer";
import OptimizedTraditionalLayout from "@/components/Layout/OptimizedTraditionalLayout";

// Lazy loading function
const createLazyComponent = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  componentName: string,
) => {
  const LazyComponent = React.lazy(importFn);
  return React.forwardRef<any, any>((props, ref) => (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando {componentName}...</p>
          </div>
        </div>
      }
    >
      <LazyComponent {...props} ref={ref} />
    </Suspense>
  ));
};

// Lazy components - apenas os que existem
const PainelControle = createLazyComponent(
  () => import("./pages/PainelControle"),
  "Painel de Controle",
);
const Dashboard = createLazyComponent(
  () => import("./pages/Dashboard"),
  "Dashboard",
);
const ModernCRMHubV2 = createLazyComponent(
  () => import("./pages/CRM/ModernCRMHubV2"),
  "CRM Moderno V2",
);
const Agenda = createLazyComponent(() => import("./pages/Agenda"), "Agenda");
const Configuracoes = createLazyComponent(
  () => import("./pages/Configuracoes"),
  "Configurações",
);
const Atendimento = createLazyComponent(
  () => import("./pages/AtendimentoEnhanced"),
  "Atendimento",
);
const Publicacoes = createLazyComponent(
  () => import("./pages/Publicacoes"),
  "Publicações",
);
const Financeiro = createLazyComponent(
  () => import("./pages/Financeiro"),
  "Financeiro",
);
const Contratos = createLazyComponent(
  () => import("./pages/Contratos"),
  "Contratos",
);
const Tarefas = createLazyComponent(() => import("./pages/Tarefas"), "Tarefas");

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Safe route wrapper
const SafeRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  return <div className="w-full h-full">{element}</div>;
};

// Page wrapper
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="w-full h-full overflow-auto">{children}</div>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeInitializer />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Main Application Routes with Traditional Layout */}
            <OptimizedTraditionalLayout />
            <Route path="/" element={<TraditionalLayout />}>
              <Route index element={<Navigate to="/painel" replace />} />

              {/* Painel de Controle */}
              <Route
                path="painel"
                element={
                  <SafeRoute
                    element={
                      <PageWrapper>
                        <PainelControle />
                      </PageWrapper>
                    }
                  />
                }
              />

              {/* Dashboard */}
              <Route
                path="dashboard"
                element={
                  <SafeRoute
                    element={
                      <PageWrapper>
                        <Dashboard />
                      </PageWrapper>
                    }
                  />
                }
              />

              {/* Modern CRM Routes */}
              <Route path="crm-modern/*">
                <Route
                  index
                  element={
                    <SafeRoute
                      element={
                        <PageWrapper>
                          <ModernCRMHubV2 />
                        </PageWrapper>
                      }
                    />
                  }
                />
                <Route
                  path="clientes"
                  element={
                    <SafeRoute
                      element={
                        <PageWrapper>
                          <ModernCRMHubV2 defaultModule="clientes" />
                        </PageWrapper>
                      }
                    />
                  }
                />
                <Route
                  path="processos"
                  element={
                    <SafeRoute
                      element={
                        <PageWrapper>
                          <ModernCRMHubV2 defaultModule="processos" />
                        </PageWrapper>
                      }
                    />
                  }
                />
                <Route
                  path="tarefas"
                  element={
                    <SafeRoute
                      element={
                        <PageWrapper>
                          <ModernCRMHubV2 defaultModule="tarefas" />
                        </PageWrapper>
                      }
                    />
                  }
                />
                <Route
                  path="contratos"
                  element={
                    <SafeRoute
                      element={
                        <PageWrapper>
                          <ModernCRMHubV2 defaultModule="contratos" />
                        </PageWrapper>
                      }
                    />
                  }
                />
                <Route
                  path="financeiro"
                  element={
                    <SafeRoute
                      element={
                        <PageWrapper>
                          <ModernCRMHubV2 defaultModule="financeiro" />
                        </PageWrapper>
                      }
                    />
                  }
                />
                <Route
                  path="documentos"
                  element={
                    <SafeRoute
                      element={
                        <PageWrapper>
                          <ModernCRMHubV2 defaultModule="documentos" />
                        </PageWrapper>
                      }
                    />
                  }
                />
              </Route>

              {/* Other Application Routes */}
              <Route
                path="agenda"
                element={
                  <SafeRoute
                    element={
                      <PageWrapper>
                        <Agenda />
                      </PageWrapper>
                    }
                  />
                }
              />

              <Route
                path="publicacoes"
                element={
                  <SafeRoute
                    element={
                      <PageWrapper>
                        <Publicacoes />
                      </PageWrapper>
                    }
                  />
                }
              />

              <Route
                path="atendimento"
                element={
                  <SafeRoute
                    element={
                      <PageWrapper>
                        <Atendimento />
                      </PageWrapper>
                    }
                  />
                }
              />

              <Route
                path="financeiro"
                element={
                  <SafeRoute
                    element={
                      <PageWrapper>
                        <Financeiro />
                      </PageWrapper>
                    }
                  />
                }
              />

              <Route
                path="contratos"
                element={
                  <SafeRoute
                    element={
                      <PageWrapper>
                        <Contratos />
                      </PageWrapper>
                    }
                  />
                }
              />

              <Route
                path="tarefas"
                element={
                  <SafeRoute
                    element={
                      <PageWrapper>
                        <Tarefas />
                      </PageWrapper>
                    }
                  />
                }
              />

              <Route
                path="configuracoes-usuario"
                element={
                  <SafeRoute
                    element={
                      <PageWrapper>
                        <Configuracoes />
                      </PageWrapper>
                    }
                  />
                }
              />

              <Route
                path="configuracoes"
                element={
                  <SafeRoute
                    element={
                      <PageWrapper>
                        <Configuracoes />
                      </PageWrapper>
                    }
                  />
                }
              />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/painel" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
