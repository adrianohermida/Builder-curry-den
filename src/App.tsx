import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { StorageProvider } from "@/hooks/useStorageConfig";
import { RegrasProcessuaisProvider } from "@/contexts/RegrasProcessuaisContext";
import { Layout } from "@/components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import CRM from "./pages/CRM";
import Tickets from "./pages/Tickets";
import Calendar from "./pages/Calendar";
import AI from "./pages/AI";
import Settings from "./pages/Settings";
import ClienteDetalhesTest from "./pages/ClienteDetalhesTest";
import TesteConfiguracaoStorage from "./pages/TesteConfiguracaoStorage";
import ConfiguracaoArmazenamento from "./pages/ConfiguracaoArmazenamento";
import PublicacoesExample from "./pages/PublicacoesExample";
import GEDJuridico from "./pages/GEDJuridico";
import GEDJuridicoV2 from "./pages/GEDJuridicoV2";
import ConfiguracoesPrazosPage from "./pages/ConfiguracoesPrazosPage";
import Tarefas from "./pages/Tarefas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <StorageProvider>
        <RegrasProcessuaisProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/" element={<Layout />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="crm" element={<CRM />} />
                  <Route path="ged" element={<GEDJuridicoV2 />} />
                  <Route path="ged-juridico" element={<GEDJuridicoV2 />} />
                  <Route path="ged-legacy" element={<GEDJuridico />} />
                  <Route path="tickets" element={<Tickets />} />
                  <Route path="agenda" element={<Calendar />} />
                  <Route path="ai" element={<AI />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="configuracoes">
                    <Route
                      path="armazenamento"
                      element={<ConfiguracaoArmazenamento />}
                    />
                    <Route
                      path="prazos"
                      element={<ConfiguracoesPrazosPage />}
                    />
                  </Route>
                  <Route
                    path="cliente-detalhes-test"
                    element={<ClienteDetalhesTest />}
                  />
                  <Route
                    path="teste-configuracao-storage"
                    element={<TesteConfiguracaoStorage />}
                  />
                  <Route
                    path="publicacoes-example"
                    element={<PublicacoesExample />}
                  />
                </Route>
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </RegrasProcessuaisProvider>
      </StorageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
