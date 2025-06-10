/**
 * 🔄 LOADING FALLBACKS - COMPONENTES DE CARREGAMENTO
 *
 * Componentes de fallback para carregamento de domínios
 */

import React from "react";

interface DomainLoadingFallbackProps {
  domain: string;
  title?: string;
  description?: string;
}

export const DomainLoadingFallback: React.FC<DomainLoadingFallbackProps> = ({
  domain,
  title,
  description,
}) => {
  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case "crm-juridico":
        return "👥";
      case "agenda-juridica":
        return "📅";
      case "processos-publicacoes":
        return "⚖️";
      case "contratos-financeiro":
        return "💰";
      case "atendimento-comunicacao":
        return "💬";
      case "ia-juridica":
        return "🤖";
      case "ged-documentos":
        return "📁";
      case "admin-configuracoes":
        return "⚙️";
      case "dashboard":
        return "📊";
      default:
        return "⏳";
    }
  };

  const getDomainName = (domain: string) => {
    switch (domain) {
      case "crm-juridico":
        return "CRM Jurídico";
      case "agenda-juridica":
        return "Agenda Jurídica";
      case "processos-publicacoes":
        return "Processos e Publicações";
      case "contratos-financeiro":
        return "Contratos e Financeiro";
      case "atendimento-comunicacao":
        return "Atendimento e Comunicação";
      case "ia-juridica":
        return "IA Jurídica";
      case "ged-documentos":
        return "GED e Documentos";
      case "admin-configuracoes":
        return "Administração";
      case "dashboard":
        return "Dashboard";
      default:
        return "Módulo";
    }
  };

  return (
    <div className="flex items-center justify-center h-64 w-full">
      <div className="text-center space-y-4">
        {/* Loading Animation */}
        <div className="relative">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-2xl animate-pulse">
            {getDomainIcon(domain)}
          </div>
          <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-primary/20 border-t-primary rounded-xl animate-spin"></div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            {title || `Carregando ${getDomainName(domain)}`}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            {description || "Preparando módulo..."}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="w-48 mx-auto">
          <div className="h-1 bg-accent rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const GlobalLoadingFallback: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="text-center space-y-6">
        {/* Logo */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto">
          <span className="text-white font-bold text-xl">L</span>
        </div>

        {/* Loading Animation */}
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">Lawdesk CRM</h3>
          <p className="text-muted-foreground">Carregando sistema...</p>
        </div>

        {/* Version */}
        <div className="text-xs text-muted-foreground">
          v2.0 • Sistema Jurídico Integrado
        </div>
      </div>
    </div>
  );
};

export default DomainLoadingFallback;
