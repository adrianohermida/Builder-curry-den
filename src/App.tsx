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
import { PageLoading } from "@/components/ui/simple-loading";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { RouteGuard } from "@/components/RouteGuard";
import { EnhancedRouteGuard } from "@/components/Enhanced/EnhancedRouteGuard";
import NotFound from "./pages/NotFound";

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

// Lazy load only existing pages
const Dashboard = createLazyComponent(
  () =>
    import("./pages/Dashboard").catch(() => import("./pages/TestDashboard")),
  "Dashboard",
);
const Login = createLazyComponent(() => import("./pages/Login"), "Login");
const Painel = createLazyComponent(() => import("./pages/Painel"), "Painel");
const Index = createLazyComponent(() => import("./pages/Index"), "Index");
const CRM = createLazyComponent(() => import("./pages/CRM"), "CRM");
const CRMJuridico = createLazyComponent(
  () => import("./pages/CRM/CRMJuridico"),
  "CRM Jurídico",
);
const RouteTest = createLazyComponent(
  () => import("./components/CRM/RouteTest"),
  "Route Test",
);
const AIEnhanced = createLazyComponent(
  () => import("./pages/AIEnhanced"),
  "IA Jurídico",
);
const AIEnhancedTest = createLazyComponent(
  () => import("./pages/AIEnhancedTest"),
  "IA Jurídico Test",
);
const FinanceiroTest = createLazyComponent(
  () => import("./pages/FinanceiroTest"),
  "Financeiro Test",
);
const Tarefas = createLazyComponent(() => import("./pages/Tarefas"), "Tarefas");
const Contratos = createLazyComponent(
  () => import("./pages/Contratos"),
  "Contratos",
);
const Financeiro = createLazyComponent(
  () => import("./pages/Financeiro"),
  "Financeiro",
);
const AgendaJuridica = createLazyComponent(
  () => import("./pages/Agenda"),
  "Agenda Jurídica",
);
const TestAgenda = createLazyComponent(
  () => import("./pages/TestAgenda"),
  "Test Agenda",
);
const TestProcessos = createLazyComponent(
  () => import("./pages/TestProcessos"),
  "Test Processos",
);
const TestContratosEnhanced = createLazyComponent(
  () => import("./pages/TestContratosEnhanced"),
  "Test Contratos Enhanced",
);

// Admin Module Components
const AdminDashboard = createLazyComponent(
  () => import("./modules/LawdeskAdmin/AdminDashboard"),
  "Admin Dashboard",
);
const AdminLayout = createLazyComponent(
  () => import("./modules/LawdeskAdmin/AdminLayout"),
  "Admin Layout",
);
const ExecutiveDashboard = createLazyComponent(
  () => import("./modules/LawdeskAdmin/ExecutiveDashboard"),
  "Executive Dashboard",
);
const BIPage = createLazyComponent(
  () => import("./modules/LawdeskAdmin/BIPage"),
  "BI Dashboard",
);
const TeamPage = createLazyComponent(
  () => import("./modules/LawdeskAdmin/TeamPage"),
  "Team Management",
);
const DevToolsPage = createLazyComponent(
  () => import("./modules/LawdeskAdmin/DevToolsPage"),
  "Development Tools",
);
const BillingPage = createLazyComponent(
  () => import("./modules/LawdeskAdmin/BillingPage"),
  "Billing Management",
);
const SupportPage = createLazyComponent(
  () => import("./modules/LawdeskAdmin/SupportPage"),
  "Support Dashboard",
);
const MarketingPage = createLazyComponent(
  () => import("./modules/LawdeskAdmin/MarketingPage"),
  "Marketing Dashboard",
);
const ProductsPage = createLazyComponent(
  () => import("./modules/LawdeskAdmin/ProductsPage"),
  "Products Management",
);
const SecurityPage = createLazyComponent(
  () => import("./modules/LawdeskAdmin/SecurityPage"),
  "Security Dashboard",
);

// ConfiguracoesPrazos from the correct path (components, not pages)
const ConfiguracoesPrazosPage = createLazyComponent(
  () => import("./components/Publicacoes/ConfiguracoesPrazos"),
  "Configurações Prazos",
);

// Widget from the correct path
const WidgetConversacao = createLazyComponent(
  () => import("./pages/Configuracoes/WidgetConversacao"),
  "Widget Conversação",
);

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

                          {/* CRM Jurídico Routes */}
                          <Route path="crm/*">
                            <Route
                              index
                              element={
                                <SafeRoute
                                  element={
                                    <PageWrapper>
                                      <CRMJuridico />
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
                                      <CRMJuridico defaultModule="clientes" />
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
                                      <CRMJuridico defaultModule="processos" />
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
                                      <CRMJuridico defaultModule="contratos" />
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
                                      <CRMJuridico defaultModule="tarefas" />
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
                                      <CRMJuridico defaultModule="financeiro" />
                                    </PageWrapper>
                                  }
                                />
                              }
                            />
                            <Route
                              path="ged"
                              element={
                                <SafeRoute
                                  element={
                                    <PageWrapper>
                                      <CRMJuridico defaultModule="ged" />
                                    </PageWrapper>
                                  }
                                />
                              }
                            />
                            {/* Legacy CRM route for compatibility */}
                            <Route
                              path="legacy"
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

                          {/* AI Jurídico Enhanced */}
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

                          {/* AI Enhanced Test Route */}
                          <Route
                            path="ai-enhanced-test"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <AIEnhancedTest />
                                  </PageWrapper>
                                }
                              />
                            }
                          />

                          {/* Financeiro Test Route */}
                          <Route
                            path="financeiro-test"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <FinanceiroTest />
                                  </PageWrapper>
                                }
                              />
                            }
                          />

                          {/* Redirect legacy GED route to CRM GED */}
                          <Route
                            path="ged-juridico"
                            element={<Navigate to="/crm/ged" replace />}
                          />

                          {/* Temporary route test - remove after verification */}
                          <Route
                            path="teste-rotas-crm"
                            element={
                              <SafeRoute
                                element={
                                  <PageWrapper>
                                    <RouteTest />
                                  </PageWrapper>
                                }
                              />
                            }
                          />

                          {/* Test Routes */}
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
                            path="teste-contratos"
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

                          {/* Admin Routes */}
                          <Route path="admin/*">
                            {/* Admin Dashboard as main route */}
                            <Route
                              index
                              element={
                                <SafeRoute
                                  element={
                                    <PageWrapper>
                                      <AdminLayout />
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
                                      <AdminDashboard />
                                    </PageWrapper>
                                  }
                                />
                              }
                            />
                            <Route
                              path="executive"
                              element={
                                <SafeRoute
                                  element={
                                    <PageWrapper>
                                      <ExecutiveDashboard />
                                    </PageWrapper>
                                  }
                                />
                              }
                            />
                            <Route
                              path="bi"
                              element={
                                <SafeRoute
                                  element={
                                    <PageWrapper>
                                      <BIPage />
                                    </PageWrapper>
                                  }
                                />
                              }
                            />
                            <Route
                              path="equipe"
                              element={
                                <SafeRoute
                                  element={
                                    <PageWrapper>
                                      <TeamPage />
                                    </PageWrapper>
                                  }
                                />
                              }
                            />
                            <Route
                              path="desenvolvimento"
                              element={
                                <SafeRoute
                                  element={
                                    <PageWrapper>
                                      <DevToolsPage />
                                    </PageWrapper>
                                  }
                                />
                              }
                            />
                            <Route
                              path="faturamento"
                              element={
                                <SafeRoute
                                  element={
                                    <PageWrapper>
                                      <BillingPage />
                                    </PageWrapper>
                                  }
                                />
                              }
                            />
                            <Route
                              path="suporte"
                              element={
                                <SafeRoute
                                  element={
                                    <PageWrapper>
                                      <SupportPage />
                                    </PageWrapper>
                                  }
                                />
                              }
                            />
                            <Route
                              path="marketing"
                              element={
                                <SafeRoute
                                  element={
                                    <PageWrapper>
                                      <MarketingPage />
                                    </PageWrapper>
                                  }
                                />
                              }
                            />
                            <Route
                              path="produtos"
                              element={
                                <SafeRoute
                                  element={
                                    <PageWrapper>
                                      <ProductsPage />
                                    </PageWrapper>
                                  }
                                />
                              }
                            />
                            <Route
                              path="seguranca"
                              element={
                                <SafeRoute
                                  element={
                                    <PageWrapper>
                                      <SecurityPage />
                                    </PageWrapper>
                                  }
                                />
                              }
                            />
                          </Route>

                          {/* Configuration Routes */}
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
                            path="widget-conversacao"
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
