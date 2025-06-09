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
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { StorageProvider } from "@/hooks/useStorageConfig";
import { RegrasProcessuaisProvider } from "@/contexts/RegrasProcessuaisContext";
import { PermissionProvider } from "@/hooks/usePermissions";
import { ViewModeProvider } from "@/contexts/ViewModeContext";
import { Layout } from "@/components/Layout/Layout";
import { EnhancedLayout } from "@/components/Layout/EnhancedLayout";
import { ResponsiveEnhancedLayout } from "@/components/Layout/ResponsiveEnhancedLayout";
import { MobileOptimizedLayout } from "@/components/Layout/MobileOptimizedLayout";
import { FinalOptimizedLayout } from "@/components/Layout/FinalOptimizedLayout";
import { CorrectedLayout } from "@/components/Layout/CorrectedLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PageLoading } from "@/components/ui/simple-loading";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AdminErrorBoundary } from "@/components/ui/admin-error-boundary";
import { RouteGuard } from "@/components/RouteGuard";
import { EnhancedRouteGuard } from "@/components/Enhanced/EnhancedRouteGuard";
import { ThemeInitializer } from "@/components/ThemeInitializer";
import NotFound from "./pages/NotFound";
import EnhancedNotFound from "./pages/EnhancedNotFound";

// Import the modern global styles and design system
import "@/styles/globals.css";

// Import monitoring services (auto-start)
import { performanceMonitor } from "@/services/performanceMonitor";
import { healthChecker } from "@/services/healthCheck";
import { automaticDiagnostics } from "@/services/automaticDiagnostics";

// Lazy load all pages for better performance with error boundaries
const createLazyComponent = (importFunc: () => Promise<any>) => {
  return lazy(() => {
    return importFunc().catch((error) => {
      console.error("Failed to load component:", error);
      // Return a fallback component
      return {
        default: () => (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Erro ao carregar componente
              </h2>
              <p className="text-gray-600 mb-4">
                Houve um problema ao carregar esta página.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Recarregar
              </button>
            </div>
          </div>
        ),
      };
    });
  });
};

// Lazy load all pages for better performance
const Dashboard = createLazyComponent(() =>
  import("./pages/Dashboard").catch(() => import("./pages/TestDashboard")),
);
const MobileDashboard = createLazyComponent(
  () => import("./pages/MobileDashboard"),
);
const MobileCRM = createLazyComponent(() => import("./pages/MobileCRM"));
const MobileAdminDashboard = createLazyComponent(
  () => import("./pages/MobileAdminDashboard"),
);
const ResponsiveDashboard = createLazyComponent(
  () => import("./pages/ResponsiveDashboard"),
);
const ResponsiveCRM = createLazyComponent(
  () => import("./pages/ResponsiveCRM"),
);
const CompleteResponsiveDashboard = createLazyComponent(
  () => import("./pages/CompleteResponsiveDashboard"),
);
const DashboardExecutivo = createLazyComponent(
  () => import("./pages/DashboardExecutivo"),
);
const CRM = createLazyComponent(() => import("./pages/CRM"));
const CRMEnhanced = createLazyComponent(() => import("./pages/CRMEnhanced"));
const CRMModerno = createLazyComponent(() => import("./pages/CRM"));
const Tickets = createLazyComponent(() => import("./pages/Tickets"));
const AtendimentoEnhanced = createLazyComponent(
  () => import("./pages/AtendimentoEnhanced"),
);
const AgendaJuridica = createLazyComponent(() => import("./pages/Agenda"));
const AI = createLazyComponent(() => import("./pages/AI"));
const AIEnhanced = createLazyComponent(() => import("./pages/AIEnhanced"));
const Settings = createLazyComponent(() => import("./pages/Settings"));
const Tarefas = createLazyComponent(() => import("./pages/Tarefas"));
const Publicacoes = createLazyComponent(() => import("./pages/Publicacoes"));
const Contratos = createLazyComponent(() => import("./pages/Contratos"));
const ContratosEnhanced = createLazyComponent(
  () => import("./pages/CRM/Contratos/ContratosEnhanced"),
);
const TestContratosEnhanced = createLazyComponent(
  () => import("./pages/TestContratosEnhanced"),
);
const TestProcessos = createLazyComponent(
  () => import("./pages/TestProcessos"),
);
const TestAgenda = createLazyComponent(() => import("./pages/TestAgenda"));
const Financeiro = createLazyComponent(() => import("./pages/Financeiro"));
const GEDJuridico = createLazyComponent(() => import("./pages/GEDJuridico"));
const GEDJuridicoV2 = createLazyComponent(
  () => import("./pages/GEDJuridicoV2"),
);
const ConfiguracaoArmazenamento = createLazyComponent(
  () => import("./pages/ConfiguracaoArmazenamento"),
);
const ConfiguracoesPrazosPage = createLazyComponent(
  () => import("./pages/ConfiguracoesPrazosPage"),
);
const WidgetConversacao = createLazyComponent(
  () => import("./pages/Configuracoes/WidgetConversacao"),
);

const Update = createLazyComponent(() => import("./pages/Update"));
const Launch = createLazyComponent(() => import("./pages/Launch"));
const SystemHealth = createLazyComponent(() => import("./pages/SystemHealth"));
const Login = createLazyComponent(() => import("./pages/Login"));
const Painel = createLazyComponent(() => import("./pages/Painel"));
const Index = createLazyComponent(() => import("./pages/Index"));

// Admin modules - Only lazy load the layout, not individual pages to prevent nested suspension
const AdminLayout = createLazyComponent(
  () => import("./modules/LawdeskAdmin/AdminLayout"),
);

// Import admin pages directly to avoid nested lazy loading
import AdminDashboard from "./modules/LawdeskAdmin/AdminDashboard";
import ExecutiveDashboard from "./modules/LawdeskAdmin/ExecutiveDashboard";
import BIPage from "./modules/LawdeskAdmin/BIPage";
import TeamPage from "./modules/LawdeskAdmin/TeamPage";
import DevToolsPage from "./modules/LawdeskAdmin/DevToolsPage";
import BillingPage from "./modules/LawdeskAdmin/BillingPage";
import SupportPage from "./modules/LawdeskAdmin/SupportPage";
import MarketingPage from "./modules/LawdeskAdmin/MarketingPage";
import ProductsPage from "./modules/LawdeskAdmin/ProductsPage";
import SecurityPage from "./modules/LawdeskAdmin/SecurityPage";

// Test pages (lazy loaded)
const ClienteDetalhesTest = createLazyComponent(
  () => import("./pages/ClienteDetalhesTest"),
);
const TesteConfiguracaoStorage = createLazyComponent(
  () => import("./pages/TesteConfiguracaoStorage"),
);
const ThemeTestPage = createLazyComponent(
  () => import("./pages/ThemeTestPage"),
);

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
            <PageLoading />
          </div>
        }
      >
        {isPending ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <PageLoading />
          </div>
        ) : (
          content || children
        )}
      </Suspense>
    </ErrorBoundary>
  );
};

// Safe Route wrapper to handle navigation transitions
const SafeRoute = ({ element }: { element: React.ReactElement }) => {
  const [isPending, startTransition] = useTransition();
  const [currentElement, setCurrentElement] = useState(element);

  useEffect(() => {
    startTransition(() => {
      setCurrentElement(element);
    });
  }, [element]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <PageLoading />
      </div>
    );
  }

  return currentElement;
};

// FIXED: Force light theme application on app startup
const App = () => {
  // Force light theme on initial load
  React.useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // Remove any existing dark classes
    html.classList.remove("dark");
    body.classList.remove("dark");

    // Force light theme
    html.classList.add("light");
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

                        <Route path="/" element={<CorrectedLayout />}>
                          {/* Home Page */}
                          <Route
                            path="home"
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

                          {/* Core Application Routes */}
                          <Route
                            path="dashboard"
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
                          {/* CRM Routes with nested routing */}
                          <Route path="crm">
                            <Route
                              index
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

                            {/* Nested CRM routes for direct access */}
                            <Route
                              path="clientes"
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
                              path="clientes/:id"
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
                              path="processos"
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
                              path="processos/:id"
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
                              path="contratos"
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
                              path="contratos/:id"
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
                          </Route>
                          <Route
                            path="crm-legacy"
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
                                    <ContratosEnhanced />
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

                          {/* Admin Routes */}
                          <Route
                            path="admin"
                            element={
                              <SafeRoute
                                element={
                                  <AdminErrorBoundary>
                                    <EnhancedRouteGuard
                                      adminModeOnly
                                      requireAdmin
                                    >
                                      <AdminLayout />
                                    </EnhancedRouteGuard>
                                  </AdminErrorBoundary>
                                }
                              />
                            }
                          >
                            <Route
                              index
                              element={
                                <Suspense fallback={<PageLoading />}>
                                  <AdminDashboard />
                                </Suspense>
                              }
                            />
                            <Route
                              path="executive"
                              element={
                                <Suspense fallback={<PageLoading />}>
                                  <EnhancedRouteGuard
                                    requireExecutive
                                    adminModeOnly
                                  >
                                    <ExecutiveDashboard />
                                  </EnhancedRouteGuard>
                                </Suspense>
                              }
                            />
                            <Route
                              path="bi"
                              element={
                                <Suspense fallback={<PageLoading />}>
                                  <BIPage />
                                </Suspense>
                              }
                            />
                            <Route
                              path="equipe"
                              element={
                                <Suspense fallback={<PageLoading />}>
                                  <TeamPage />
                                </Suspense>
                              }
                            />
                            <Route
                              path="desenvolvimento"
                              element={
                                <Suspense fallback={<PageLoading />}>
                                  <DevToolsPage />
                                </Suspense>
                              }
                            />
                            <Route
                              path="faturamento"
                              element={
                                <Suspense fallback={<PageLoading />}>
                                  <BillingPage />
                                </Suspense>
                              }
                            />
                            <Route
                              path="suporte"
                              element={
                                <Suspense fallback={<PageLoading />}>
                                  <SupportPage />
                                </Suspense>
                              }
                            />
                            <Route
                              path="marketing"
                              element={
                                <Suspense fallback={<PageLoading />}>
                                  <MarketingPage />
                                </Suspense>
                              }
                            />
                            <Route
                              path="produtos"
                              element={
                                <Suspense fallback={<PageLoading />}>
                                  <ProductsPage />
                                </Suspense>
                              }
                            />
                            <Route
                              path="seguranca"
                              element={
                                <Suspense fallback={<PageLoading />}>
                                  <SecurityPage />
                                </Suspense>
                              }
                            />
                          </Route>

                          {/* System Health (Admin Only) */}
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

                          {/* GED Routes */}
                          <Route
                            path="ged"
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
                            path="ged-juridico"
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
                            path="ged-legacy"
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

                          {/* Settings Routes */}
                          <Route
                            path="settings"
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
                          <Route
                            path="configuracoes-prazos"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <ConfiguracoesPrazosPage />
                                  </PageWrapper>
                                }
                              />
                            }
                          />
                          <Route
                            path="configuracoes/widget-conversacao"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <WidgetConversacao />
                                  </PageWrapper>
                                }
                              />
                            }
                          />

                          {/* Test Routes */}
                          <Route
                            path="teste-cliente-detalhes"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <ClienteDetalhesTest />
                                  </PageWrapper>
                                }
                              />
                            }
                          />
                          <Route
                            path="teste-configuracao-storage"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <TesteConfiguracaoStorage />
                                  </PageWrapper>
                                }
                              />
                            }
                          />
                          <Route
                            path="teste-contratos-enhanced"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <TestContratosEnhanced />
                                  </PageWrapper>
                                }
                              />
                            }
                          />
                          <Route
                            path="teste-processos"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <TestProcessos />
                                  </PageWrapper>
                                }
                              />
                            }
                          />
                          <Route
                            path="teste-agenda"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <TestAgenda />
                                  </PageWrapper>
                                }
                              />
                            }
                          />
                          <Route
                            path="agenda-integrada"
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
                            path="theme-test"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <ThemeTestPage />
                                  </PageWrapper>
                                }
                              />
                            }
                          />

                          {/* Mobile Specific Routes */}
                          <Route
                            path="mobile/dashboard"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <MobileDashboard />
                                  </PageWrapper>
                                }
                              />
                            }
                          />
                          <Route
                            path="mobile/crm"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <MobileCRM />
                                  </PageWrapper>
                                }
                              />
                            }
                          />
                          <Route
                            path="mobile/admin"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <EnhancedRouteGuard requireAdmin>
                                      <MobileAdminDashboard />
                                    </EnhancedRouteGuard>
                                  </PageWrapper>
                                }
                              />
                            }
                          />

                          {/* 404 Route */}
                          <Route
                            path="*"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <EnhancedNotFound />
                                  </PageWrapper>
                                }
                              />
                            }
                          />
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
