/**
 * CRM Jurídico - Rotas do Domínio
 *
 * Definição de rotas independentes e lazy-loaded para o domínio CRM Jurídico.
 * Inclui code splitting e proteção de rotas.
 */

import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CRMJuridicoProvider } from "../provider";
import { LoadingSpinner } from "@/shared/components/atoms/Spinner";

// Lazy loading dos componentes
const CRMJuridiroDashboard = React.lazy(() => import("../pages/Dashboard"));
const ClientesPage = React.lazy(() => import("../pages/Clientes"));
const ClienteDetalhes = React.lazy(() => import("../pages/ClienteDetalhes"));
const ProcessosPage = React.lazy(() => import("../pages/Processos"));
const ProcessoDetalhes = React.lazy(() => import("../pages/ProcessoDetalhes"));
const ContratosPage = React.lazy(() => import("../pages/Contratos"));
const ContratoDetalhes = React.lazy(() => import("../pages/ContratoDetalhes"));
const TarefasPage = React.lazy(() => import("../pages/Tarefas"));
const RelatoriosPage = React.lazy(() => import("../pages/Relatorios"));
const ConfiguracoesPage = React.lazy(() => import("../pages/Configuracoes"));

// Layout específico do domínio
const CRMJuridicoLayout = React.lazy(() => import("../components/Layout"));

// Fallback de loading
const DomainLoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="text-muted-foreground mt-4">Carregando CRM Jurídico...</p>
    </div>
  </div>
);

// Wrapper para páginas com título
const PageWrapper: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  React.useEffect(() => {
    document.title = `${title} - CRM Jurídico - Lawdesk`;
  }, [title]);

  return <>{children}</>;
};

// Rotas principais do domínio
export const CRMJuridicoRoutes: React.FC = () => {
  return (
    <CRMJuridicoProvider>
      <Suspense fallback={<DomainLoadingFallback />}>
        <Routes>
          {/* Layout wrapper para todas as rotas do domínio */}
          <Route path="/" element={<CRMJuridicoLayout />}>
            {/* Redirect para dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* Dashboard principal */}
            <Route
              path="dashboard"
              element={
                <PageWrapper title="Dashboard">
                  <CRMJuridiroDashboard />
                </PageWrapper>
              }
            />

            {/* Gestão de Clientes */}
            <Route path="clientes">
              <Route
                index
                element={
                  <PageWrapper title="Clientes">
                    <ClientesPage />
                  </PageWrapper>
                }
              />
              <Route
                path=":clienteId"
                element={
                  <PageWrapper title="Detalhes do Cliente">
                    <ClienteDetalhes />
                  </PageWrapper>
                }
              />
            </Route>

            {/* Gestão de Processos */}
            <Route path="processos">
              <Route
                index
                element={
                  <PageWrapper title="Processos">
                    <ProcessosPage />
                  </PageWrapper>
                }
              />
              <Route
                path=":processoId"
                element={
                  <PageWrapper title="Detalhes do Processo">
                    <ProcessoDetalhes />
                  </PageWrapper>
                }
              />
            </Route>

            {/* Gestão de Contratos */}
            <Route path="contratos">
              <Route
                index
                element={
                  <PageWrapper title="Contratos">
                    <ContratosPage />
                  </PageWrapper>
                }
              />
              <Route
                path=":contratoId"
                element={
                  <PageWrapper title="Detalhes do Contrato">
                    <ContratoDetalhes />
                  </PageWrapper>
                }
              />
            </Route>

            {/* Gestão de Tarefas */}
            <Route
              path="tarefas"
              element={
                <PageWrapper title="Tarefas">
                  <TarefasPage />
                </PageWrapper>
              }
            />

            {/* Relatórios e Analytics */}
            <Route
              path="relatorios"
              element={
                <PageWrapper title="Relatórios">
                  <RelatoriosPage />
                </PageWrapper>
              }
            />

            {/* Configurações do domínio */}
            <Route
              path="configuracoes"
              element={
                <PageWrapper title="Configurações">
                  <ConfiguracoesPage />
                </PageWrapper>
              }
            />

            {/* 404 específico do domínio */}
            <Route
              path="*"
              element={
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold mb-4">
                    Página não encontrada
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    A página solicitada não existe no módulo CRM Jurídico.
                  </p>
                  <Navigate to="/crm-juridico/dashboard" replace />
                </div>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </CRMJuridicoProvider>
  );
};

// Configuração de rotas para o router principal
export const crmJuridicoRoutes = {
  path: "/crm-juridico/*",
  element: <CRMJuridicoRoutes />,
  meta: {
    domain: "crm-juridico",
    title: "CRM Jurídico",
    description: "Gestão de relacionamento com clientes jurídicos",
    permissions: ["crm_juridico_read"],
    preload: true, // Pre-carrega o módulo
  },
};

export { CRMJuridicoRoutes };
export default CRMJuridicoRoutes;
