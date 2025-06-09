import React, {
  Suspense,
  lazy,
  useTransition,
  useEffect,
  useState,
  startTransition,
} from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ViewModeProvider } from "@/contexts/ViewModeContext";
import { PermissionsProvider } from "@/contexts/PermissionsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuditProvider } from "@/contexts/AuditContext";
import { CorrectedLayout } from "@/components/Layout/CorrectedLayout";
import { ThemeInitializer } from "@/components/ThemeInitializer";
import { StorageProvider } from "@/hooks/useStorageConfig";
import { RegrasProcessuaisProvider } from "@/contexts/RegrasProcessuaisContext";
import { PermissionProvider } from "@/hooks/usePermissions";
import { Layout } from "@/components/Layout/Layout";
import { EnhancedLayout } from "@/components/Layout/EnhancedLayout";
import { ResponsiveEnhancedLayout } from "@/components/Layout/ResponsiveEnhancedLayout";
import { MobileOptimizedLayout } from "@/components/Layout/MobileOptimizedLayout";
import { FinalOptimizedLayout } from "@/components/Layout/FinalOptimizedLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PageLoading } from "@/components/ui/simple-loading";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AdminErrorBoundary } from "@/components/ui/admin-error-boundary";
import { RouteGuard } from "@/components/RouteGuard";
import { EnhancedRouteGuard } from "@/components/Enhanced/EnhancedRouteGuard";
import NotFound from "./pages/NotFound";
import EnhancedNotFound from "./pages/EnhancedNotFound";

// Import the modern global styles and design system
import "@/styles/globals.css";

// Create React Query client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

// Enhanced lazy loading with better error handling
const createLazyComponent = (
  importFunc: () => Promise<any>,
  fallbackName?: string,
) => {
  return lazy(() => {
    return importFunc().catch((error) => {
      console.error(
        `Failed to load component ${fallbackName || "unknown"}:`,
        error,
      );

      // Return a proper fallback component
      return {
        default: () => (
          <div className="flex items-center justify-center min-h-[400px] p-8">
            <div className="text-center max-w-md">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Erro ao carregar {fallbackName || "componente"}
              </h2>
              <p className="text-gray-600 mb-4">
                Houve um problema ao carregar esta página. Tente recarregar ou
                volte à página inicial.
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Recarregar
                </button>
                <button
                  onClick={() => (window.location.href = "/painel")}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Ir ao Painel
                </button>
              </div>
            </div>
          </div>
        ),
      };
    });
  });
};

// Lazy load all pages for better performance
const Dashboard = createLazyComponent(
  () =>
    import("./pages/Dashboard").catch(() => import("./pages/TestDashboard")),
  "Dashboard",
);
const MobileDashboard = createLazyComponent(
  () => import("./pages/MobileDashboard"),
  "Mobile Dashboard",
);
const MobileCRM = createLazyComponent(
  () => import("./pages/MobileCRM"),
  "Mobile CRM",
);
const MobileAdminDashboard = createLazyComponent(
  () => import("./pages/MobileAdminDashboard"),
  "Mobile Admin Dashboard",
);
const ResponsiveDashboard = createLazyComponent(
  () => import("./pages/ResponsiveDashboard"),
  "Responsive Dashboard",
);
const ResponsiveCRM = createLazyComponent(
  () => import("./pages/ResponsiveCRM"),
  "Responsive CRM",
);
const CompleteResponsiveDashboard = createLazyComponent(
  () => import("./pages/CompleteResponsiveDashboard"),
  "Complete Responsive Dashboard",
);
const DashboardExecutivo = createLazyComponent(
  () => import("./pages/DashboardExecutivo"),
  "Dashboard Executivo",
);
const CRM = createLazyComponent(() => import("./pages/CRM"), "CRM");
const CRMEnhanced = createLazyComponent(
  () => import("./pages/CRMEnhanced"),
  "CRM Enhanced",
);
const CRMModerno = createLazyComponent(
  () => import("./pages/CRM"),
  "CRM Moderno",
);
const Tickets = createLazyComponent(() => import("./pages/Tickets"), "Tickets");
const AtendimentoEnhanced = createLazyComponent(
  () => import("./pages/AtendimentoEnhanced"),
  "Atendimento Enhanced",
);
const AgendaJuridica = createLazyComponent(
  () => import("./pages/Agenda"),
  "Agenda Jurídica",
);
const AI = createLazyComponent(() => import("./pages/AI"), "IA");
const AIEnhanced = createLazyComponent(
  () => import("./pages/AIEnhanced"),
  "IA Enhanced",
);
const Settings = createLazyComponent(
  () => import("./pages/Settings"),
  "Configurações",
);
const Tarefas = createLazyComponent(() => import("./pages/Tarefas"), "Tarefas");
const Publicacoes = createLazyComponent(
  () => import("./pages/Publicacoes"),
  "Publicações",
);
const Contratos = createLazyComponent(
  () => import("./pages/Contratos"),
  "Contratos",
);
const ContratosEnhanced = createLazyComponent(
  () => import("./pages/CRM/Contratos/ContratosEnhanced"),
  "Contratos Enhanced",
);
const TestContratosEnhanced = createLazyComponent(
  () => import("./pages/TestContratosEnhanced"),
  "Test Contratos Enhanced",
);
const TestProcessos = createLazyComponent(
  () => import("./pages/TestProcessos"),
  "Test Processos",
);
const TestAgenda = createLazyComponent(
  () => import("./pages/TestAgenda"),
  "Test Agenda",
);
const Financeiro = createLazyComponent(
  () => import("./pages/Financeiro"),
  "Financeiro",
);
const GEDJuridico = createLazyComponent(
  () => import("./pages/GEDJuridico"),
  "GED Jurídico",
);
const GEDJuridicoV2 = createLazyComponent(
  () => import("./pages/GEDJuridicoV2"),
  "GED Jurídico V2",
);
const ConfiguracaoArmazenamento = createLazyComponent(
  () => import("./pages/ConfiguracaoArmazenamento"),
  "Configuração Armazenamento",
);
const ConfiguracoesPrazosPage = createLazyComponent(
  () => import("./pages/Publicacoes/ConfiguracoesPrazos"),
  "Configurações Prazos",
);
const WidgetConversacao = createLazyComponent(
  () => import("./pages/Configuracoes/WidgetConversacao"),
  "Widget Conversação",
);

const Update = createLazyComponent(() => import("./pages/Update"), "Update");
const Launch = createLazyComponent(() => import("./pages/Launch"), "Launch");
const SystemHealth = createLazyComponent(
  () => import("./pages/SystemHealth"),
  "System Health",
);
const Login = createLazyComponent(() => import("./pages/Login"), "Login");
const Painel = createLazyComponent(() => import("./pages/Painel"), "Painel");
const Index = createLazyComponent(() => import("./pages/Index"), "Index");

// Admin modules with enhanced error handling
const AdminLayout = createLazyComponent(
  () => import("./modules/LawdeskAdmin/AdminLayout"),
  "Admin Layout",
);

// ... Other admin components (omitting for brevity but same pattern)

// Enhanced Page wrapper with improved error boundary and loading
const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    startTransition(() => {
      setContent(children);
    });
  }, [children]);

  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <PageLoading message="Carregando página..." />
          </div>
        }
      >
        {isPending ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <PageLoading message="Preparando conteúdo..." />
          </div>
        ) : (
          content || children
        )}
      </Suspense>
    </ErrorBoundary>
  );
};

// Safe Route wrapper with enhanced error handling
const SafeRoute = ({ element }: { element: React.ReactElement }) => {
  const [isPending, startTransition] = useTransition();
  const [currentElement, setCurrentElement] = useState(element);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      startTransition(() => {
        setCurrentElement(element);
        setError(null);
      });
    } catch (err) {
      setError(err as Error);
    }
  }, [element]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Erro na navegação
          </h2>
          <p className="text-gray-600 mb-4">
            Ocorreu um erro ao navegar para esta página.
          </p>
          <button
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <PageLoading message="Navegando..." />
      </div>
    );
  }

  return currentElement;
};

// Main App component with enhanced initialization
const App: React.FC = () => {
  // Force light mode initialization
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // Force light mode
    html.classList.remove("dark");
    html.classList.add("light");
    body.classList.remove("dark");
    body.classList.add("light");

    // Force light styles
    body.style.backgroundColor = "#ffffff";
    body.style.color = "#0f172a";

    // Set color scheme
    html.style.colorScheme = "light";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <ThemeProvider>
          <StorageProvider>
            <RegrasProcessuaisProvider>
              <PermissionProvider>
                <ViewModeProvider>
                  <ThemeInitializer />
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                      <Routes>
                        <Route
                          path="/"
                          element={<Navigate to="/painel" replace />}
                        />

                        {/* Authentication Route */}
                        <Route
                          path="/login"
                          element={
                            <SafeRoute
                              element={
                                <PageWrapper>
                                  <Login />
                                </PageWrapper>
                              }
                            />
                          }
                        />

                        {/* Main Application Routes with CorrectedLayout */}
                        <Route path="/" element={<CorrectedLayout />}>
                          <Route
                            path="index"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <Index />
                                  </PageWrapper>
                                }
                              />
                            }
                          />
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
                          <Route
                            path="dashboard-responsivo"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <CompleteResponsiveDashboard />
                                  </PageWrapper>
                                }
                              />
                            }
                          />
                          <Route
                            path="painel"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <Painel />
                                  </PageWrapper>
                                }
                              />
                            }
                          />
                          <Route
                            path="dashboard-executivo"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <EnhancedRouteGuard requireAdmin>
                                      <DashboardExecutivo />
                                    </EnhancedRouteGuard>
                                  </PageWrapper>
                                }
                              />
                            }
                          />

                          {/* CRM Routes */}
                          <Route path="crm/*">
                            <Route
                              index
                              element={
                                <SafeRoute
                                  element={
                                    <PageWrapper>
                                      <CRM />
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
                                      <CRM />
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
                                      <CRM />
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
                                      <CRM />
                                    </PageWrapper>
                                  }
                                />
                              }
                            />
                            <Route
                              path="agenda"
                              element={
                                <SafeRoute
                                  element={
                                    <PageWrapper>
                                      <CRM />
                                    </PageWrapper>
                                  }
                                />
                              }
                            />
                          </Route>

                          <Route
                            path="crm-enhanced"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <CRMEnhanced />
                                  </PageWrapper>
                                }
                              />
                            }
                          />
                          <Route
                            path="crm-moderno"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <CRMModerno />
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
                            path="tickets"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <Tickets />
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
                                    <AtendimentoEnhanced />
                                  </PageWrapper>
                                }
                              />
                            }
                          />
                          <Route
                            path="agenda"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <AgendaJuridica />
                                  </PageWrapper>
                                }
                              />
                            }
                          />
                          <Route
                            path="ai"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <AI />
                                  </PageWrapper>
                                }
                              />
                            }
                          />
                          <Route
                            path="ai-enhanced"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <AIEnhanced />
                                  </PageWrapper>
                                }
                              />
                            }
                          />

                          <Route
                            path="update"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <EnhancedRouteGuard
                                      adminModeOnly
                                      requireAdmin
                                    >
                                      <Update />
                                    </EnhancedRouteGuard>
                                  </PageWrapper>
                                }
                              />
                            }
                          />
                          <Route
                            path="launch"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <EnhancedRouteGuard
                                      adminModeOnly
                                      requireAdmin
                                    >
                                      <Launch />
                                    </EnhancedRouteGuard>
                                  </PageWrapper>
                                }
                              />
                            }
                          />
                          <Route
                            path="system-health"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <EnhancedRouteGuard
                                      adminModeOnly
                                      requireAdmin
                                    >
                                      <SystemHealth />
                                    </EnhancedRouteGuard>
                                  </PageWrapper>
                                }
                              />
                            }
                          />

                          <Route
                            path="ged-juridico"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <GEDJuridico />
                                  </PageWrapper>
                                }
                              />
                            }
                          />
                          <Route
                            path="ged-juridico-v2"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <GEDJuridicoV2 />
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
                                    <Settings />
                                  </PageWrapper>
                                }
                              />
                            }
                          />
                          <Route
                            path="configuracao-armazenamento"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <ConfiguracaoArmazenamento />
                                  </PageWrapper>
                                }
                              />
                            }
                          />

                          {/* Catch all for 404 */}
                          <Route path="*" element={<NotFound />} />
                        </Route>
                      </Routes>
                    </BrowserRouter>
                  </TooltipProvider>
                </ViewModeProvider>
              </PermissionProvider>
            </RegrasProcessuaisProvider>
          </StorageProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
