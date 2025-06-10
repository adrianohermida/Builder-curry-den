import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/contexts/UserContext";
import { PermissionProvider } from "@/contexts/PermissionContext";
import { ViewModeProvider } from "@/contexts/ViewModeContext";
import { ThemeInitializer } from "@/components/ThemeInitializer";
import { SafeRoute } from "@/components/SafeRoute";
import { PageWrapper } from "@/components/PageWrapper";
import { TraditionalLayout } from "@/components/Layout/TraditionalLayout";

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

// Lazy components
const Login = createLazyComponent(() => import("./pages/Login"), "Login");
const Dashboard = createLazyComponent(
  () => import("./pages/Dashboard"),
  "Dashboard",
);
const PainelControle = createLazyComponent(
  () => import("./pages/PainelControle"),
  "Painel de Controle",
);
const ModernCRMHub = createLazyComponent(
  () => import("./pages/CRM/ModernCRMHub"),
  "CRM Moderno",
);
const ModernCRMHubV2 = createLazyComponent(
  () => import("./pages/CRM/ModernCRMHubV2"),
  "CRM Moderno V2",
);
const CRMJuridicoV3 = createLazyComponent(
  () => import("./pages/CRM/CRMJuridicoV3"),
  "CRM Jurídico V3",
);
const UserSettingsHub = createLazyComponent(
  () => import("./pages/Configuracoes/UserSettingsHub"),
  "Configurações de Usuário",
);
const Configuracoes = createLazyComponent(
  () => import("./pages/Configuracoes"),
  "Configurações",
);
const GEDJuridicoV2 = createLazyComponent(
  () => import("./pages/GED/GEDJuridicoV2"),
  "GED Jurídico V2",
);
const TarefasV2 = createLazyComponent(
  () => import("./pages/Tarefas/TarefasV2"),
  "Tarefas V2",
);
const FinanceiroSaaS = createLazyComponent(
  () => import("./pages/Financeiro/FinanceiroSaaS"),
  "Financeiro SaaS",
);
const CRMSaaS = createLazyComponent(
  () => import("./pages/CRM/CRMSaaS"),
  "CRM SaaS",
);
const ContratosV2 = createLazyComponent(
  () => import("./pages/Contratos/ContratosV2"),
  "Contratos V2",
);
const AtendimentoV2 = createLazyComponent(
  () => import("./pages/Atendimento/AtendimentoV2"),
  "Atendimento V2",
);
const Agenda = createLazyComponent(() => import("./pages/Agenda"), "Agenda");
const Publicacoes = createLazyComponent(
  () => import("./pages/Publicacoes"),
  "Publicações",
);
const Atendimento = createLazyComponent(
  () => import("./pages/Atendimento"),
  "Atendimento",
);
const ConfiguracoesV2 = createLazyComponent(
  () => import("./pages/Configuracoes/ConfiguracoesV2"),
  "Configurações V2",
);

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <PermissionProvider>
          <ViewModeProvider>
            <ThemeInitializer />
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Login Route */}
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

                  {/* Main Application Routes with Traditional Layout */}
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

                    {/* CRM V3 Routes */}
                    <Route path="crm-v3/*">
                      <Route
                        index
                        element={
                          <SafeRoute
                            element={
                              <PageWrapper>
                                <CRMJuridicoV3 />
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
                                <CRMJuridicoV3 defaultModule="clientes" />
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
                                <CRMJuridicoV3 defaultModule="processos" />
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
                      path="atendimento-v2"
                      element={
                        <SafeRoute
                          element={
                            <PageWrapper>
                              <AtendimentoV2 />
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

                    <Route
                      path="configuracoes-usuario"
                      element={
                        <SafeRoute
                          element={
                            <PageWrapper>
                              <UserSettingsHub />
                            </PageWrapper>
                          }
                        />
                      }
                    />

                    <Route
                      path="configuracoes-v2"
                      element={
                        <SafeRoute
                          element={
                            <PageWrapper>
                              <ConfiguracoesV2 />
                            </PageWrapper>
                          }
                        />
                      }
                    />

                    {/* Settings Routes */}
                    <Route path="settings/*">
                      <Route
                        index
                        element={
                          <SafeRoute
                            element={
                              <PageWrapper>
                                <UserSettingsHub />
                              </PageWrapper>
                            }
                          />
                        }
                      />
                      <Route
                        path="profile"
                        element={
                          <SafeRoute
                            element={
                              <PageWrapper>
                                <UserSettingsHub />
                              </PageWrapper>
                            }
                          />
                        }
                      />
                      <Route
                        path="notifications"
                        element={
                          <SafeRoute
                            element={
                              <PageWrapper>
                                <UserSettingsHub />
                              </PageWrapper>
                            }
                          />
                        }
                      />
                    </Route>

                    {/* Additional Routes */}
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
                      path="tarefas-v2"
                      element={
                        <SafeRoute
                          element={
                            <PageWrapper>
                              <TarefasV2 />
                            </PageWrapper>
                          }
                        />
                      }
                    />

                    <Route
                      path="financeiro-saas"
                      element={
                        <SafeRoute
                          element={
                            <PageWrapper>
                              <FinanceiroSaaS />
                            </PageWrapper>
                          }
                        />
                      }
                    />

                    <Route
                      path="crm-saas"
                      element={
                        <SafeRoute
                          element={
                            <PageWrapper>
                              <CRMSaaS />
                            </PageWrapper>
                          }
                        />
                      }
                    />

                    <Route
                      path="contratos-v2"
                      element={
                        <SafeRoute
                          element={
                            <PageWrapper>
                              <ContratosV2 />
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
          </ViewModeProvider>
        </PermissionProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
