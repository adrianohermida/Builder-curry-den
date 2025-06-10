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
import ModernMainLayout from "@/components/Layout/ModernMainLayout";
import PublicLayout from "@/components/Layout/PublicLayout";

// Componentes de loading
import {
  DomainLoadingFallback,
  GlobalLoadingFallback,
} from "@/shared/components/organisms/LoadingFallbacks";

// Debug Panel
import DebugPanel from "@/components/Debug/DebugPanel";

// Lazy loading de domínios funcionais EXISTENTES
const CRMJuridicoModule = React.lazy(() =>
  import("@/domains/crm-juridico").then((module) => ({
    default: module.CRMJuridicoRoutes,
  })),
);

// Páginas principais
const ModernDashboard = React.lazy(() => import("@/pages/ModernDashboard"));
const LoginPage = React.lazy(() => import("@/pages/Login"));
const OnboardingPage = React.lazy(() => import("@/pages/Onboarding"));
const NotFoundPage = React.lazy(() => import("@/pages/NotFound"));

// Meta-dados dos domínios EXISTENTES
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
];

// Loading global importado de LoadingFallbacks

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
                        <Suspense fallback={<div>Carregando login...</div>}>
                          <div className="p-8 text-center">
                            <h1 className="text-2xl font-bold mb-4">Login</h1>
                            <p>Página de login em desenvolvimento</p>
                          </div>
                        </Suspense>
                      </PageWrapper>
                    }
                  />
                </Route>

                <Route path={ROUTES.ONBOARDING} element={<PublicLayout />}>
                  <Route
                    index
                    element={
                      <PageWrapper title="Bem-vindo">
                        <Suspense
                          fallback={<div>Carregando onboarding...</div>}
                        >
                          <div className="p-8 text-center">
                            <h1 className="text-2xl font-bold mb-4">
                              Bem-vindo ao Lawdesk
                            </h1>
                            <p>Página de onboarding em desenvolvimento</p>
                          </div>
                        </Suspense>
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

                  {/* Painel (route legada que aponta para dashboard) */}
                  <Route
                    path="painel"
                    element={
                      <PageWrapper title="Painel de Controle">
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

                  {/* ===== ROTAS TEMPORÁRIAS PARA MÓDULOS NÃO IMPLEMENTADOS ===== */}
                  <Route
                    path="agenda-juridica/*"
                    element={
                      <PageWrapper title="Agenda Jurídica">
                        <div className="p-8 text-center">
                          <h1 className="text-2xl font-bold mb-4">
                            📅 Agenda Jurídica
                          </h1>
                          <p className="text-muted-foreground mb-6">
                            Este módulo está em desenvolvimento
                          </p>
                          <div className="space-y-2">
                            <p>• Calendário jurídico</p>
                            <p>• Gestão de prazos</p>
                            <p>• Agendamento de audiências</p>
                          </div>
                        </div>
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="processos-publicacoes/*"
                    element={
                      <PageWrapper title="Processos e Publicações">
                        <div className="p-8 text-center">
                          <h1 className="text-2xl font-bold mb-4">
                            ⚖️ Processos e Publicações
                          </h1>
                          <p className="text-muted-foreground mb-6">
                            Este módulo está em desenvolvimento
                          </p>
                          <div className="space-y-2">
                            <p>• Acompanhamento processual</p>
                            <p>• Gestão de publicações</p>
                            <p>• Monitoramento automático</p>
                          </div>
                        </div>
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="contratos-financeiro/*"
                    element={
                      <PageWrapper title="Contratos e Financeiro">
                        <div className="p-8 text-center">
                          <h1 className="text-2xl font-bold mb-4">
                            💰 Contratos e Financeiro
                          </h1>
                          <p className="text-muted-foreground mb-6">
                            Este módulo está em desenvolvimento
                          </p>
                          <div className="space-y-2">
                            <p>• Gestão de contratos</p>
                            <p>• Controle financeiro</p>
                            <p>• Faturamento</p>
                          </div>
                        </div>
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="atendimento-comunicacao/*"
                    element={
                      <PageWrapper title="Atendimento e Comunicação">
                        <div className="p-8 text-center">
                          <h1 className="text-2xl font-bold mb-4">
                            💬 Atendimento e Comunicação
                          </h1>
                          <p className="text-muted-foreground mb-6">
                            Este módulo está em desenvolvimento
                          </p>
                          <div className="space-y-2">
                            <p>• Central de atendimento</p>
                            <p>• Gestão de tickets</p>
                            <p>• Comunicação com clientes</p>
                          </div>
                        </div>
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="ia-juridica/*"
                    element={
                      <PageWrapper title="IA Jurídica">
                        <div className="p-8 text-center">
                          <h1 className="text-2xl font-bold mb-4">
                            🤖 IA Jurídica
                          </h1>
                          <p className="text-muted-foreground mb-6">
                            Este módulo está em desenvolvimento
                          </p>
                          <div className="space-y-2">
                            <p>• Assistente jurídico IA</p>
                            <p>• Análise de documentos</p>
                            <p>• Predições jurídicas</p>
                          </div>
                        </div>
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="ged-documentos/*"
                    element={
                      <PageWrapper title="GED e Documentos">
                        <div className="p-8 text-center">
                          <h1 className="text-2xl font-bold mb-4">
                            📁 GED e Documentos
                          </h1>
                          <p className="text-muted-foreground mb-6">
                            Este módulo está em desenvolvimento
                          </p>
                          <div className="space-y-2">
                            <p>• Gestão eletrônica de documentos</p>
                            <p>• Repositório de arquivos</p>
                            <p>• Pesquisa avançada</p>
                          </div>
                        </div>
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="admin-configuracoes/*"
                    element={
                      <PageWrapper title="Administração e Configurações">
                        <div className="p-8 text-center">
                          <h1 className="text-2xl font-bold mb-4">
                            ⚙️ Administração e Configurações
                          </h1>
                          <p className="text-muted-foreground mb-6">
                            Este módulo está em desenvolvimento
                          </p>
                          <div className="space-y-2">
                            <p>• Gestão de usuários</p>
                            <p>• Configurações do sistema</p>
                            <p>• Permissões e roles</p>
                          </div>
                        </div>
                      </PageWrapper>
                    }
                  />

                  {/* Compatibilidade com rotas legadas */}
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
                        <div className="p-8 text-center">
                          <h1 className="text-2xl font-bold mb-4">
                            404 - Página não encontrada
                          </h1>
                          <p className="text-muted-foreground">
                            A página solicitada não foi encontrada.
                          </p>
                        </div>
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
