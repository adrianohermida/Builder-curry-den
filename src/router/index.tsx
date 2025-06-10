/**
 * Router Principal - Reestruturado por Domínios Funcionais
 *
 * Roteamento principal com suporte a domínios independentes,
 * lazy loading por módulo e code splitting avançado.
 */

import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/ThemeProvider";

// Configurações
import { CACHE_CONFIG } from "@/config/api";
import { DEBUG_FLAGS } from "@/config/environment";
import { ROUTES } from "@/config/constants";

// Layout principal
import MainLayout from "@/components/Layout/MainLayout";
import ModernMainLayout from "@/components/Layout/ModernMainLayout";
import PublicLayout from "@/components/Layout/PublicLayout";

// Componentes de loading
import { DomainLoadingFallback } from "@/shared/components/organisms/LoadingFallbacks";

// Debug Panel
import DebugPanel from "@/components/Debug/DebugPanel";

// Lazy loading de domínios funcionais
const CRMJuridicoModule = React.lazy(() =>
  import("@/domains/crm-juridico").then((module) => ({
    default: module.CRMJuridicoRoutes,
  })),
);

const AgendaJuridicaModule = React.lazy(() =>
  import("@/domains/agenda-juridica").then((module) => ({
    default: module.AgendaJuridicaRoutes,
  })),
);

const ProcessosPublicacoesModule = React.lazy(() =>
  import("@/domains/processos-publicacoes").then((module) => ({
    default: module.ProcessosPublicacoesRoutes,
  })),
);

const ContratosFinanceiroModule = React.lazy(() =>
  import("@/domains/contratos-financeiro").then((module) => ({
    default: module.ContratosFinanceiroRoutes,
  })),
);

const AtendimentoComunicacaoModule = React.lazy(() =>
  import("@/domains/atendimento-comunicacao").then((module) => ({
    default: module.AtendimentoComunicacaoRoutes,
  })),
);

const IAJuridicaModule = React.lazy(() =>
  import("@/domains/ia-juridica").then((module) => ({
    default: module.IAJuridicaRoutes,
  })),
);

const GEDDocumentosModule = React.lazy(() =>
  import("@/domains/ged-documentos").then((module) => ({
    default: module.GEDDocumentosRoutes,
  })),
);

const AdminConfiguraciesModule = React.lazy(() =>
  import("@/domains/admin-configuracoes").then((module) => ({
    default: module.AdminConfiguracoesRoutes,
  })),
);

// Páginas gerais (fora de domínios específicos)
const DashboardPrincipal = React.lazy(
  () => import("@/pages/DashboardPrincipal"),
);
const ModernDashboard = React.lazy(() => import("@/pages/ModernDashboard"));
const LoginPage = React.lazy(() => import("@/pages/Login"));
const OnboardingPage = React.lazy(() => import("@/pages/Onboarding"));
const NotFoundPage = React.lazy(() => import("@/pages/NotFound"));

// Meta-dados dos domínios para roteamento
const DOMAIN_ROUTES = [
  {
    path: "/crm-juridico/*",
    element: <CRMJuridicoModule />,
    preload: true,
    permissions: ["crm_juridico_read"],
    meta: {
      domain: "crm-juridico",
      title: "CRM Jurídico",
      description: "Gestão de relacionamento com clientes jurídicos",
    },
  },
  {
    path: "/agenda-juridica/*",
    element: <AgendaJuridicaModule />,
    preload: true,
    permissions: ["agenda_juridica_read"],
    meta: {
      domain: "agenda-juridica",
      title: "Agenda Jurídica",
      description: "Calendário jurídico e gestão de prazos",
    },
  },
  {
    path: "/processos-publicacoes/*",
    element: <ProcessosPublicacoesModule />,
    preload: false,
    permissions: ["processos_read"],
    meta: {
      domain: "processos-publicacoes",
      title: "Processos e Publicações",
      description: "Acompanhamento processual e publicações",
    },
  },
  {
    path: "/contratos-financeiro/*",
    element: <ContratosFinanceiroModule />,
    preload: false,
    permissions: ["financeiro_read"],
    meta: {
      domain: "contratos-financeiro",
      title: "Contratos e Financeiro",
      description: "Gestão de contratos e controle financeiro",
    },
  },
  {
    path: "/atendimento-comunicacao/*",
    element: <AtendimentoComunicacaoModule />,
    preload: false,
    permissions: ["atendimento_read"],
    meta: {
      domain: "atendimento-comunicacao",
      title: "Atendimento e Comunicação",
      description: "Central de atendimento e comunicação",
    },
  },
  {
    path: "/ia-juridica/*",
    element: <IAJuridicaModule />,
    preload: false,
    permissions: ["ia_juridica_read"],
    meta: {
      domain: "ia-juridica",
      title: "IA Jurídica",
      description: "Inteligência Artificial aplicada ao Direito",
    },
  },
  {
    path: "/ged-documentos/*",
    element: <GEDDocumentosModule />,
    preload: false,
    permissions: ["ged_read"],
    meta: {
      domain: "ged-documentos",
      title: "GED e Documentos",
      description: "Gestão eletrônica de documentos",
    },
  },
  {
    path: "/admin-configuracoes/*",
    element: <AdminConfiguraciesModule />,
    preload: false,
    permissions: ["admin_read"],
    meta: {
      domain: "admin-configuracoes",
      title: "Administração e Configurações",
      description: "Configurações do sistema e administração",
    },
  },
];

// Loading global
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

// React Query client
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

// Component principal do router
export const AppRouter: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Suspense fallback={<GlobalLoadingFallback />}>
              <Routes>
                {/* ===== ROTAS PÚBLICAS ===== */}
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

                {/* ===== ROTAS PRIVADAS (MODERN MAIN LAYOUT) ===== */}
                <Route path="/" element={<ModernMainLayout />}>
                  {/* Home redirect */}
                  <Route
                    index
                    element={<Navigate to={ROUTES.DASHBOARD} replace />}
                  />

                  {/* Dashboard Principal */}
                  <Route
                    path="dashboard"
                    element={
                      <PageWrapper title="Dashboard Principal">
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

                  {/* ===== DOMÍNIOS FUNCIONAIS ===== */}
                  {DOMAIN_ROUTES.map((domain) => (
                    <Route
                      key={domain.meta.domain}
                      path={domain.path}
                      element={
                        <Suspense
                          fallback={
                            <DomainLoadingFallback
                              domain={domain.meta.domain}
                              title={domain.meta.title}
                              description={domain.meta.description}
                            />
                          }
                        >
                          {domain.element}
                        </Suspense>
                      }
                    />
                  ))}

                  {/* Compatibilidade com rotas legadas */}
                  <Route
                    path="painel"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route
                    path="crm-modern/*"
                    element={<Navigate to="/crm-juridico" replace />}
                  />
                  <Route
                    path="agenda"
                    element={<Navigate to="/agenda-juridica" replace />}
                  />
                  <Route
                    path="publicacoes"
                    element={<Navigate to="/processos-publicacoes" replace />}
                  />
                  <Route
                    path="financeiro"
                    element={<Navigate to="/contratos-financeiro" replace />}
                  />
                  <Route
                    path="atendimento"
                    element={<Navigate to="/atendimento-comunicacao" replace />}
                  />
                  <Route
                    path="ia"
                    element={<Navigate to="/ia-juridica" replace />}
                  />
                  <Route
                    path="ged"
                    element={<Navigate to="/ged-documentos" replace />}
                  />
                  <Route
                    path="configuracoes"
                    element={<Navigate to="/admin-configuracoes" replace />}
                  />

                  {/* 404 - Página não encontrada */}
                  <Route
                    path="404"
                    element={
                      <PageWrapper title="Página Não Encontrada">
                        <NotFoundPage />
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

          {/* Debug Panel - Development Only */}
          {DEBUG_FLAGS.ENABLE_LOGGING && <DebugPanel />}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

// Função para pre-carregar domínios críticos
export const preloadCriticalDomains = async () => {
  const criticalDomains = DOMAIN_ROUTES.filter((domain) => domain.preload);

  const preloadPromises = criticalDomains.map(async (domain) => {
    try {
      // Pre-carrega o módulo em background
      switch (domain.meta.domain) {
        case "crm-juridico":
          await import("@/domains/crm-juridico");
          break;
        case "agenda-juridica":
          await import("@/domains/agenda-juridica");
          break;
        default:
          break;
      }
    } catch (error) {
      console.warn(`Failed to preload domain ${domain.meta.domain}:`, error);
    }
  });

  await Promise.allSettled(preloadPromises);
};

// Export metadata dos domínios para uso externo
export { DOMAIN_ROUTES };

export default AppRouter;
