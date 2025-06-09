import { Suspense, lazy, useTransition, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
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
import { RouteGuard } from "@/components/RouteGuard";
import { EnhancedRouteGuard } from "@/components/Enhanced/EnhancedRouteGuard";
import NotFound from "./pages/NotFound";
import EnhancedNotFound from "./pages/EnhancedNotFound";

// Import the enhanced theme styles
import "@/styles/themes.css";

// Lazy load all pages for better performance
const Dashboard = lazy(() =>
  import("./pages/Dashboard").catch(() => import("./pages/TestDashboard")),
);
const MobileDashboard = lazy(() => import("./pages/MobileDashboard"));
const MobileCRM = lazy(() => import("./pages/MobileCRM"));
const MobileAdminDashboard = lazy(() => import("./pages/MobileAdminDashboard"));
const ResponsiveDashboard = lazy(() => import("./pages/ResponsiveDashboard"));
const ResponsiveCRM = lazy(() => import("./pages/ResponsiveCRM"));
const CompleteResponsiveDashboard = lazy(
  () => import("./pages/CompleteResponsiveDashboard"),
);
const DashboardExecutivo = lazy(() => import("./pages/DashboardExecutivo"));
const CRM = lazy(() => import("./pages/CRM"));
const CRMEnhanced = lazy(() => import("./pages/CRMEnhanced"));
const CRMModerno = lazy(() => import("./pages/CRM"));
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
const WidgetConversacao = lazy(
  () => import("./pages/Configuracoes/WidgetConversacao"),
);

const Update = lazy(() => import("./pages/Update"));
const Launch = lazy(() => import("./pages/Launch"));
const SystemHealth = lazy(() => import("./pages/SystemHealth"));
const Login = lazy(() => import("./pages/Login"));

// Admin modules (lazy loaded)
const AdminLayout = lazy(() => import("./modules/LawdeskAdmin/AdminLayout"));
const AdminDashboard = lazy(
  () => import("./modules/LawdeskAdmin/AdminDashboard"),
);
const ExecutiveDashboard = lazy(
  () => import("./modules/LawdeskAdmin/ExecutiveDashboard"),
);
const BIPage = lazy(() => import("./modules/LawdeskAdmin/BIPage"));
const TeamPage = lazy(() => import("./modules/LawdeskAdmin/TeamPage"));
const DevToolsPage = lazy(() => import("./modules/LawdeskAdmin/DevToolsPage"));
const BillingPage = lazy(() => import("./modules/LawdeskAdmin/BillingPage"));
const SupportPage = lazy(() => import("./modules/LawdeskAdmin/SupportPage"));
const MarketingPage = lazy(
  () => import("./modules/LawdeskAdmin/MarketingPage"),
);
const ProductsPage = lazy(() => import("./modules/LawdeskAdmin/ProductsPage"));
const SecurityPage = lazy(() => import("./modules/LawdeskAdmin/SecurityPage"));

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

// Page wrapper with error boundary and loading - simplified for React 18
const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <Suspense fallback={<PageLoading />}>{children}</Suspense>
  </ErrorBoundary>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <ThemeProvider>
        <StorageProvider>
          <RegrasProcessuaisProvider>
            <PermissionProvider>
              <ViewModeProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route
                        path="/"
                        element={<Navigate to="/dashboard" replace />}
                      />

                      {/* Authentication Route */}
                      <Route
                        path="/login"
                        element={
                          <PageWrapper>
                            <Login />
                          </PageWrapper>
                        }
                      />

                      <Route path="/" element={<CorrectedLayout />}>
                        {/* Core Application Routes */}
                        <Route
                          path="dashboard"
                          element={
                            <PageWrapper>
                              <CompleteResponsiveDashboard />
                            </PageWrapper>
                          }
                        />
                        <Route
                          path="dashboard-executivo"
                          element={
                            <PageWrapper>
                              <EnhancedRouteGuard requireAdmin>
                                <DashboardExecutivo />
                              </EnhancedRouteGuard>
                            </PageWrapper>
                          }
                        />
                        <Route
                          path="crm"
                          element={
                            <PageWrapper>
                              <CRMModerno />
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
                          path="update"
                          element={
                            <PageWrapper>
                              <EnhancedRouteGuard adminModeOnly requireAdmin>
                                <Update />
                              </EnhancedRouteGuard>
                            </PageWrapper>
                          }
                        />
                        <Route
                          path="launch"
                          element={
                            <PageWrapper>
                              <EnhancedRouteGuard adminModeOnly requireAdmin>
                                <Launch />
                              </EnhancedRouteGuard>
                            </PageWrapper>
                          }
                        />

                        {/* Admin Routes */}
                        <Route
                          path="admin"
                          element={
                            <EnhancedRouteGuard adminModeOnly requireAdmin>
                              <AdminLayout />
                            </EnhancedRouteGuard>
                          }
                        >
                          <Route index element={<AdminDashboard />} />
                          <Route
                            path="executive"
                            element={
                              <EnhancedRouteGuard
                                requireExecutive
                                adminModeOnly
                              >
                                <ExecutiveDashboard />
                              </EnhancedRouteGuard>
                            }
                          />
                          <Route path="bi" element={<BIPage />} />
                          <Route path="equipe" element={<TeamPage />} />
                          <Route
                            path="desenvolvimento"
                            element={<DevToolsPage />}
                          />
                          <Route path="faturamento" element={<BillingPage />} />
                          <Route path="suporte" element={<SupportPage />} />
                          <Route path="marketing" element={<MarketingPage />} />
                          <Route path="produtos" element={<ProductsPage />} />
                          <Route path="seguranca" element={<SecurityPage />} />
                        </Route>

                        {/* System Health (Admin Only) */}
                        <Route
                          path="system-health"
                          element={
                            <PageWrapper>
                              <EnhancedRouteGuard adminModeOnly requireAdmin>
                                <SystemHealth />
                              </EnhancedRouteGuard>
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
                        <Route
                          path="profile"
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
                          <Route
                            path="widget-conversacao"
                            element={
                              <PageWrapper>
                                <EnhancedRouteGuard requireAdmin>
                                  <WidgetConversacao />
                                </EnhancedRouteGuard>
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
                      <Route path="*" element={<EnhancedNotFound />} />
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

export default App;
