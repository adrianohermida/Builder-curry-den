/**
 * 🎯 APP COMPONENT - Updated to Standardized Architecture
 *
 * Main application component using the new standardized architecture with:
 * - Clean import paths following feature structure
 * - Centralized configuration
 * - Improved type safety
 * - Proper separation of concerns
 */

import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/ThemeProvider";

// Configuration
import { ROUTES } from "@/config/constants";
import { CACHE_CONFIG } from "@/config/api";
import { DEBUG_FLAGS } from "@/config/environment";

// Layout Components
import MainLayout from "@/components/Layout/MainLayout";
import PublicLayout from "@/components/Layout/PublicLayout";

// Debug Panel (development only)
import DebugPanel from "@/components/Debug/DebugPanel";

// Global loading fallback component
const GlobalLoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Lawdesk CRM
      </h3>
      <p className="text-gray-600 dark:text-gray-400">Carregando sistema...</p>
    </div>
  </div>
);

// Function to create lazy-loaded components with proper fallback
const createLazyPage = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  pageName: string,
) => {
  const LazyComponent = React.lazy(importFn);

  return React.forwardRef<any, any>((props, ref) => (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Carregando {pageName}...
            </p>
          </div>
        </div>
      }
    >
      <LazyComponent {...props} ref={ref} />
    </Suspense>
  ));
};

// ===== MAIN PAGES =====
const StorageManagement = createLazyPage(
  () => import("@/pages/Storage"),
  "Gestão de Armazenamento",
);

const PainelControle = createLazyPage(
  () => import("@/pages/CleanPainelControle"),
  "Painel de Controle",
);

const CRMUnificado = createLazyPage(
  () => import("@/pages/CRM/CRMUnificado"),
  "CRM Jurídico",
);

const PublicacoesPage = createLazyPage(
  () => import("@/pages/Publicacoes"),
  "Publicações",
);

const AgendaPage = createLazyPage(() => import("@/pages/Agenda"), "Agenda");

const AtendimentoPage = createLazyPage(
  () => import("@/pages/AtendimentoEnhanced"),
  "Atendimento",
);

const ConfiguracoesPage = createLazyPage(
  () => import("@/pages/Configuracoes/UserSettingsHub"),
  "Configurações",
);

// ===== PUBLIC PAGES =====
const LoginPage = createLazyPage(() => import("@/pages/Login"), "Login");

const OnboardingPage = createLazyPage(
  () => import("@/pages/Onboarding"),
  "Configuração Inicial",
);

// ===== ERROR PAGES =====
const EnhancedNotFoundPage = createLazyPage(
  () => import("@/pages/EnhancedNotFound"),
  "Página Não Encontrada",
);

// Error Boundary for CRM
import CRMErrorBoundary from "@/components/CRM/CRMErrorBoundary";

// Page wrapper component for title management
const PageWrapper: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  React.useEffect(() => {
    document.title = `${title} - Lawdesk CRM`;
  }, [title]);

  return <>{children}</>;
};

// React Query client with standardized configuration
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

// ===== MAIN APP COMPONENT =====
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Suspense fallback={<GlobalLoadingFallback />}>
              <Routes>
                {/* ===== PUBLIC ROUTES ===== */}
                <Route path={ROUTES.LOGIN} element={<PublicLayout />}>
                  <Route
                    index
                    element={
                      <PageWrapper title="Login">
                        <LoginPage />
                      </PageWrapper>
                    }
                  />
                </Route>

                <Route path={ROUTES.REGISTER} element={<PublicLayout />}>
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

                <Route path={ROUTES.ONBOARDING} element={<PublicLayout />}>
                  <Route
                    index
                    element={
                      <PageWrapper title="Bem-vindo">
                        <OnboardingPage />
                      </PageWrapper>
                    }
                  />
                </Route>

                {/* ===== PRIVATE ROUTES (MAIN LAYOUT) ===== */}
                <Route path={ROUTES.HOME} element={<MainLayout />}>
                  {/* Home redirect */}
                  <Route
                    index
                    element={<Navigate to={ROUTES.DASHBOARD} replace />}
                  />

                  {/* ===== MAIN PAGES ===== */}
                  <Route
                    path="painel"
                    element={
                      <PageWrapper title="Painel de Controle">
                        <PainelControle />
                      </PageWrapper>
                    }
                  />

                  {/* CRM Jurídico - Sistema Unificado */}
                  <Route
                    path="crm-modern/*"
                    element={
                      <PageWrapper title="CRM Jurídico">
                        <CRMErrorBoundary>
                          <CRMUnificado />
                        </CRMErrorBoundary>
                      </PageWrapper>
                    }
                  />

                  {/* ===== CORE MODULES ===== */}
                  <Route
                    path="publicacoes"
                    element={
                      <PageWrapper title="Publicações">
                        <PublicacoesPage />
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="agenda"
                    element={
                      <PageWrapper title="Agenda">
                        <AgendaPage />
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

                  {/* ===== SETTINGS ===== */}
                  <Route
                    path="configuracoes"
                    element={
                      <PageWrapper title="Configurações">
                        <ConfiguracoesPage />
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="configuracao-armazenamento"
                    element={
                      <PageWrapper title="Gestão de Armazenamento">
                        <StorageManagement />
                      </PageWrapper>
                    }
                  />

                  {/* 404 - Page not found */}
                  <Route
                    path="404"
                    element={
                      <PageWrapper title="Página Não Encontrada">
                        <EnhancedNotFoundPage />
                      </PageWrapper>
                    }
                  />

                  {/* Fallback for unmatched routes */}
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Route>

                {/* Global fallback for completely unmatched routes */}
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>

          {/* Debug Panel - Development Only */}
          {DEBUG_FLAGS.ENABLE_LOGGING && <DebugPanel />}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
