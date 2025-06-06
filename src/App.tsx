import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Layout } from "@/components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import CRM from "./pages/CRM";
import Tickets from "./pages/Tickets";
import Calendar from "./pages/Calendar";
import AI from "./pages/AI";
import Settings from "./pages/Settings";
import ClienteDetalhesTest from "./pages/ClienteDetalhesTest";
import TesteConfiguracaoStorage from "./pages/TesteConfiguracaoStorage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/" element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="crm" element={<CRM />} />
              <Route path="tickets" element={<Tickets />} />
              <Route path="agenda" element={<Calendar />} />
              <Route path="ai" element={<AI />} />
              <Route path="settings" element={<Settings />} />
              <Route
                path="cliente-detalhes-test"
                element={<ClienteDetalhesTest />}
              />
              <Route
                path="teste-configuracao-storage"
                element={<TesteConfiguracaoStorage />}
              />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
