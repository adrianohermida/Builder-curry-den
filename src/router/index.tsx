/**
 * Router Principal - Sistema Moderno com Páginas Existentes
 *
 * Roteamento principal usando páginas já existentes no projeto,
 * organizadas por domínios funcionais com lazy loading.
 */

import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/ThemeProvider";

// Configurações
import { CACHE_CONFIG } from "@/config/api";
import { IS_DEVELOPMENT } from "@/lib/env";

// Layouts existentes
import MainLayout from "@/components/Layout/MainLayout";
import UnifiedLayout from "@/components/Layout/UnifiedLayout";
import PublicLayout from "@/components/Layout/PublicLayout";

// Componente de loading global
const GlobalLoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Lawdesk CRM</h3>
      <p className="text-gray-600">Carregando sistema...</p>
    </div>
  </div>
);

// Loading para domínios
const DomainLoadingFallback = ({
  domain,
  title,
}: {
  domain: string;
  title?: string;
}) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Carregando {title || domain}...</p>
    </div>
  </div>
);

// ===== PÁGINAS PRINCIPAIS EXISTENTES =====
const CleanPainelControle = React.lazy(
  () => import("@/pages/CleanPainelControle"),
);
const ModernDashboard = React.lazy(() => import("@/pages/ModernDashboard"));

// CRM - Usando páginas existentes
const CRMUnificado = React.lazy(() => import("@/pages/CRM/CRMUnificado"));
const CRMIndex = React.lazy(() => import("@/pages/CRM/index"));

// Módulos principais existentes
const PublicacoesPage = React.lazy(() => import("@/pages/Publicacoes"));
const AgendaPage = React.lazy(() => import("@/pages/Agenda"));
const AtendimentoEnhanced = React.lazy(
  () => import("@/pages/AtendimentoEnhanced"),
);
const FinanceiroPage = React.lazy(() => import("@/pages/Financeiro"));
const ContratosPage = React.lazy(() => import("@/pages/Contratos"));
const TarefasPage = React.lazy(() => import("@/pages/Tarefas"));
const TicketsPage = React.lazy(() => import("@/pages/Tickets"));

// Módulos especializados existentes
const AIPage = React.lazy(() => import("@/pages/AI"));
const GEDJuridico = React.lazy(() => import("@/pages/GEDJuridico"));
const GEDOrganizacional = React.lazy(() => import("@/pages/GEDOrganizacional"));
const PortalCliente = React.lazy(() => import("@/pages/PortalCliente"));

// Configurações existentes
const UserSettingsHub = React.lazy(
  () => import("@/pages/Configuracoes/UserSettingsHub"),
);
const ConfiguracoesPrazosPage = React.lazy(
  () => import("@/pages/ConfiguracoesPrazosPage"),
);
const StorageManagement = React.lazy(() => import("@/pages/Storage"));
const TesteConfiguracaoStorage = React.lazy(
  () => import("@/pages/TesteConfiguracaoStorage"),
);

// Páginas administrativas existentes
const ActionPlan = React.lazy(() => import("@/pages/ActionPlan"));
const SystemHealth = React.lazy(() => import("@/pages/SystemHealth"));
const UpdatePage = React.lazy(() => import("@/pages/Update"));
const TarefasGerencial = React.lazy(() => import("@/pages/TarefasGerencial"));
const UsersGerencial = React.lazy(() => import("@/pages/UsersGerencial"));
const MetricsGerencial = React.lazy(() => import("@/pages/MetricsGerencial"));
const FinanceiroGerencial = React.lazy(
  () => import("@/pages/FinanceiroGerencial"),
);
const DashboardExecutivo = React.lazy(
  () => import("@/pages/DashboardExecutivo"),
);

// Páginas públicas existentes
const LoginPage = React.lazy(() => import("@/pages/Login"));
const OnboardingPage = React.lazy(() => import("@/pages/Onboarding"));
const OnboardingLanding = React.lazy(() => import("@/pages/OnboardingLanding"));

// Páginas Beta existentes
const BetaDashboard = React.lazy(() => import("@/pages/Beta/BetaDashboard"));
const BetaReports = React.lazy(() => import("@/pages/Beta/BetaReports"));
const CodeOptimization = React.lazy(
  () => import("@/pages/Beta/CodeOptimization"),
);

// Páginas de erro existentes
const EnhancedNotFound = React.lazy(() => import("@/pages/EnhancedNotFound"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));

// Páginas de teste existentes
const TestDashboard = React.lazy(() => import("@/pages/TestDashboard"));
const TestContratosEnhanced = React.lazy(
  () => import("@/pages/TestContratosEnhanced"),
);
const PublicacoesExample = React.lazy(
  () => import("@/pages/PublicacoesExample"),
);
const CompleteResponsiveDashboard = React.lazy(
  () => import("@/pages/CompleteResponsiveDashboard"),
);
const ThemeTestPage = React.lazy(() => import("@/pages/ThemeTestPage"));
const LaunchPage = React.lazy(() => import("@/pages/Launch"));

// Domínio CRM Jurídico (nova arquitetura)
const CRMJuridicoRoutes = React.lazy(() =>
  import("@/domains/crm-juridico").then((module) => ({
    default: module.CRMJuridicoRoutes,
  })),
);

// Wrapper para páginas com título
const PageWrapper: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  React.useEffect(() => {
    document.title = `${title} - Lawdesk CRM`;
  }, [title]);

  return <>{children}</>;
};

// Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_CONFIG.DEFAULT_STALE_TIME,
      cacheTime: CACHE_CONFIG.DEFAULT_CACHE_TIME,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// ===== MAIN ROUTER COMPONENT =====
const AppRouter: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Suspense fallback={<GlobalLoadingFallback />}>
              <Routes>
                {/* ===== ROTAS PÚBLICAS ===== */}
                <Route
                  path="/login"
                  element={<PublicLayout variant="centered" />}
                >
                  <Route
                    index
                    element={
                      <PageWrapper title="Login">
                        <LoginPage />
                      </PageWrapper>
                    }
                  />
                </Route>

                <Route
                  path="/registro"
                  element={<PublicLayout variant="centered" />}
                >
                  <Route
                    index
                    element={
                      <PageWrapper title="Registro">
                        <div className="p-8 text-center">
                          <h1 className="text-2xl font-bold mb-4">Registro</h1>
                          <p>Página de registro - Em construção</p>
                        </div>
                      </PageWrapper>
                    }
                  />
                </Route>

                <Route
                  path="/onboarding-start"
                  element={<PublicLayout variant="default" />}
                >
                  <Route
                    index
                    element={
                      <PageWrapper title="Bem-vindo">
                        <OnboardingLanding />
                      </PageWrapper>
                    }
                  />
                </Route>

                {/* ===== ROTAS PRIVADAS (MAIN LAYOUT) ===== */}
                <Route path="/" element={<MainLayout />}>
                  {/* Home redirect para painel */}
                  <Route index element={<Navigate to="/painel" replace />} />

                  {/* ===== DASHBOARDS ===== */}
                  {/* Painel principal (CleanPainelControle é o principal) */}
                  <Route
                    path="painel"
                    element={
                      <PageWrapper title="Painel de Controle">
                        <Suspense
                          fallback={<DomainLoadingFallback domain="painel" />}
                        >
                          <CleanPainelControle />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* Dashboard moderno (alternativo) */}
                  <Route
                    path="dashboard"
                    element={
                      <PageWrapper title="Dashboard">
                        <Suspense
                          fallback={
                            <DomainLoadingFallback domain="dashboard" />
                          }
                        >
                          <ModernDashboard />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* ===== CRM - MÚLTIPLAS VERSÕES ===== */}
                  {/* CRM Unificado (principal) */}
                  <Route
                    path="crm/*"
                    element={
                      <PageWrapper title="CRM Jurídico">
                        <Suspense
                          fallback={
                            <DomainLoadingFallback
                              domain="CRM"
                              title="CRM Jurídico"
                            />
                          }
                        >
                          <CRMUnificado />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* CRM Moderno (alternativo) */}
                  <Route
                    path="crm-modern/*"
                    element={
                      <PageWrapper title="CRM Moderno">
                        <Suspense
                          fallback={
                            <DomainLoadingFallback
                              domain="CRM"
                              title="CRM Moderno"
                            />
                          }
                        >
                          <CRMIndex />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* CRM Jurídico (nova arquitetura por domínios) */}
                  <Route
                    path="crm-juridico/*"
                    element={
                      <PageWrapper title="CRM Jurídico v2">
                        <Suspense
                          fallback={
                            <DomainLoadingFallback
                              domain="CRM Jurídico"
                              title="CRM Jurídico v2"
                            />
                          }
                        >
                          <CRMJuridicoRoutes />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* ===== MÓDULOS PRINCIPAIS ===== */}
                  <Route
                    path="publicacoes"
                    element={
                      <PageWrapper title="Publicações">
                        <Suspense
                          fallback={
                            <DomainLoadingFallback domain="publicacoes" />
                          }
                        >
                          <PublicacoesPage />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="agenda"
                    element={
                      <PageWrapper title="Agenda">
                        <Suspense
                          fallback={<DomainLoadingFallback domain="agenda" />}
                        >
                          <AgendaPage />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="atendimento"
                    element={
                      <PageWrapper title="Atendimento">
                        <Suspense
                          fallback={
                            <DomainLoadingFallback domain="atendimento" />
                          }
                        >
                          <AtendimentoEnhanced />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="financeiro"
                    element={
                      <PageWrapper title="Financeiro">
                        <Suspense
                          fallback={
                            <DomainLoadingFallback domain="financeiro" />
                          }
                        >
                          <FinanceiroPage />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="contratos"
                    element={
                      <PageWrapper title="Contratos">
                        <Suspense
                          fallback={
                            <DomainLoadingFallback domain="contratos" />
                          }
                        >
                          <ContratosPage />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="tarefas"
                    element={
                      <PageWrapper title="Tarefas">
                        <Suspense
                          fallback={<DomainLoadingFallback domain="tarefas" />}
                        >
                          <TarefasPage />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="tickets"
                    element={
                      <PageWrapper title="Tickets">
                        <Suspense
                          fallback={<DomainLoadingFallback domain="tickets" />}
                        >
                          <TicketsPage />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* ===== MÓDULOS ESPECIALIZADOS ===== */}
                  <Route
                    path="ia"
                    element={
                      <PageWrapper title="IA Jurídica">
                        <Suspense
                          fallback={<DomainLoadingFallback domain="ia" />}
                        >
                          <AIPage />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="ged"
                    element={
                      <PageWrapper title="GED Jurídico">
                        <Suspense
                          fallback={<DomainLoadingFallback domain="ged" />}
                        >
                          <GEDJuridico />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="ged/organizacional"
                    element={
                      <PageWrapper title="GED Organizacional">
                        <Suspense
                          fallback={<DomainLoadingFallback domain="ged-org" />}
                        >
                          <GEDOrganizacional />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="portal-cliente"
                    element={
                      <PageWrapper title="Portal do Cliente">
                        <Suspense
                          fallback={<DomainLoadingFallback domain="portal" />}
                        >
                          <PortalCliente />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* ===== CONFIGURAÇÕES ===== */}
                  <Route
                    path="configuracoes"
                    element={
                      <PageWrapper title="Configurações">
                        <Suspense
                          fallback={
                            <DomainLoadingFallback domain="configuracoes" />
                          }
                        >
                          <UserSettingsHub />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="configuracoes/prazos"
                    element={
                      <PageWrapper title="Configurações de Prazos">
                        <Suspense
                          fallback={<DomainLoadingFallback domain="prazos" />}
                        >
                          <ConfiguracoesPrazosPage />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="configuracao-armazenamento"
                    element={
                      <PageWrapper title="Gestão de Armazenamento">
                        <Suspense
                          fallback={<DomainLoadingFallback domain="storage" />}
                        >
                          <StorageManagement />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="teste-configuracao-storage"
                    element={
                      <PageWrapper title="Teste de Configuração de Storage">
                        <Suspense
                          fallback={
                            <DomainLoadingFallback domain="storage-test" />
                          }
                        >
                          <TesteConfiguracaoStorage />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* ===== ROTAS ADMINISTRATIVAS ===== */}
                  <Route path="admin">
                    <Route
                      path="action-plan"
                      element={
                        <PageWrapper title="Plano de Ação">
                          <Suspense
                            fallback={
                              <DomainLoadingFallback domain="action-plan" />
                            }
                          >
                            <ActionPlan />
                          </Suspense>
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="system-health"
                      element={
                        <PageWrapper title="Saúde do Sistema">
                          <Suspense
                            fallback={
                              <DomainLoadingFallback domain="system-health" />
                            }
                          >
                            <SystemHealth />
                          </Suspense>
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="updates"
                      element={
                        <PageWrapper title="Atualizações">
                          <Suspense
                            fallback={
                              <DomainLoadingFallback domain="updates" />
                            }
                          >
                            <UpdatePage />
                          </Suspense>
                        </PageWrapper>
                      }
                    />
                  </Route>

                  {/* ===== ROTAS GERENCIAIS ===== */}
                  <Route path="gestao">
                    <Route
                      path="tarefas"
                      element={
                        <PageWrapper title="Gestão de Tarefas">
                          <Suspense
                            fallback={
                              <DomainLoadingFallback domain="gestao-tarefas" />
                            }
                          >
                            <TarefasGerencial />
                          </Suspense>
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="usuarios"
                      element={
                        <PageWrapper title="Gestão de Usuários">
                          <Suspense
                            fallback={
                              <DomainLoadingFallback domain="gestao-usuarios" />
                            }
                          >
                            <UsersGerencial />
                          </Suspense>
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="metricas"
                      element={
                        <PageWrapper title="Métricas Gerenciais">
                          <Suspense
                            fallback={
                              <DomainLoadingFallback domain="metricas" />
                            }
                          >
                            <MetricsGerencial />
                          </Suspense>
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="financeiro"
                      element={
                        <PageWrapper title="Financeiro Gerencial">
                          <Suspense
                            fallback={
                              <DomainLoadingFallback domain="financeiro-gerencial" />
                            }
                          >
                            <FinanceiroGerencial />
                          </Suspense>
                        </PageWrapper>
                      }
                    />
                  </Route>

                  {/* ===== ROTAS EXECUTIVAS ===== */}
                  <Route path="executivo">
                    <Route
                      path="dashboard"
                      element={
                        <PageWrapper title="Dashboard Executivo">
                          <Suspense
                            fallback={
                              <DomainLoadingFallback domain="dashboard-executivo" />
                            }
                          >
                            <DashboardExecutivo />
                          </Suspense>
                        </PageWrapper>
                      }
                    />
                  </Route>

                  {/* ===== ROTAS BETA/EXPERIMENTAL ===== */}
                  <Route path="beta">
                    <Route
                      index
                      element={
                        <PageWrapper title="Beta Dashboard">
                          <Suspense
                            fallback={<DomainLoadingFallback domain="beta" />}
                          >
                            <BetaDashboard />
                          </Suspense>
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="dashboard"
                      element={
                        <PageWrapper title="Beta Dashboard">
                          <Suspense
                            fallback={<DomainLoadingFallback domain="beta" />}
                          >
                            <BetaDashboard />
                          </Suspense>
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="reports"
                      element={
                        <PageWrapper title="Beta Reports">
                          <Suspense
                            fallback={
                              <DomainLoadingFallback domain="beta-reports" />
                            }
                          >
                            <BetaReports />
                          </Suspense>
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="code-optimization"
                      element={
                        <PageWrapper title="Code Optimization">
                          <Suspense
                            fallback={
                              <DomainLoadingFallback domain="code-opt" />
                            }
                          >
                            <CodeOptimization />
                          </Suspense>
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="test-dashboard"
                      element={
                        <PageWrapper title="Test Dashboard">
                          <Suspense
                            fallback={
                              <DomainLoadingFallback domain="test-dashboard" />
                            }
                          >
                            <TestDashboard />
                          </Suspense>
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="publicacoes-example"
                      element={
                        <PageWrapper title="Publicações Example">
                          <Suspense
                            fallback={
                              <DomainLoadingFallback domain="pub-example" />
                            }
                          >
                            <PublicacoesExample />
                          </Suspense>
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="responsive-dashboard"
                      element={
                        <PageWrapper title="Responsive Dashboard">
                          <Suspense
                            fallback={
                              <DomainLoadingFallback domain="responsive" />
                            }
                          >
                            <CompleteResponsiveDashboard />
                          </Suspense>
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="theme-test"
                      element={
                        <PageWrapper title="Theme Test">
                          <Suspense
                            fallback={
                              <DomainLoadingFallback domain="theme-test" />
                            }
                          >
                            <ThemeTestPage />
                          </Suspense>
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="launch"
                      element={
                        <PageWrapper title="Launch">
                          <Suspense
                            fallback={<DomainLoadingFallback domain="launch" />}
                          >
                            <LaunchPage />
                          </Suspense>
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="contratos-enhanced"
                      element={
                        <PageWrapper title="Contratos Enhanced">
                          <Suspense
                            fallback={
                              <DomainLoadingFallback domain="contratos-enhanced" />
                            }
                          >
                            <TestContratosEnhanced />
                          </Suspense>
                        </PageWrapper>
                      }
                    />
                  </Route>

                  {/* Onboarding Routes - Inside main layout for authenticated users */}
                  <Route
                    path="onboarding"
                    element={
                      <PageWrapper title="Configuração Inicial">
                        <Suspense
                          fallback={
                            <DomainLoadingFallback domain="onboarding" />
                          }
                        >
                          <OnboardingPage />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* ===== PÁGINAS DE ERRO ===== */}
                  <Route
                    path="404"
                    element={
                      <PageWrapper title="Página Não Encontrada">
                        <Suspense
                          fallback={<DomainLoadingFallback domain="404" />}
                        >
                          <EnhancedNotFound />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="not-found"
                    element={
                      <PageWrapper title="Não Encontrada">
                        <Suspense
                          fallback={
                            <DomainLoadingFallback domain="not-found" />
                          }
                        >
                          <NotFound />
                        </Suspense>
                      </PageWrapper>
                    }
                  />

                  {/* Fallback para rotas não encontradas */}
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Route>

                {/* Fallback global para rotas completamente não encontradas */}
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default AppRouter;
