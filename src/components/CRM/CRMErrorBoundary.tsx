/**
 * CRM ERROR BOUNDARY
 * Specific error boundary for CRM module to handle dynamic import failures
 */

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Card from "@/components/ui/OptimizedCard";
import Button from "@/components/ui/OptimizedButton";

interface CRMErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface CRMErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

class CRMErrorBoundary extends React.Component<
  CRMErrorBoundaryProps,
  CRMErrorBoundaryState
> {
  constructor(props: CRMErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): CRMErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("CRM Error Boundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    // Force a page reload to clear any cached modules
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/painel";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error!}
            retry={this.handleRetry}
          />
        );
      }

      return (
        <div
          style={{
            padding: "2rem",
            maxWidth: "600px",
            margin: "2rem auto",
          }}
        >
          <Card padding="lg">
            <div style={{ textAlign: "center" }}>
              <AlertTriangle
                size={64}
                style={{
                  color: "var(--color-error)",
                  marginBottom: "1rem",
                }}
              />
              <h2
                style={{
                  margin: "0 0 1rem",
                  color: "var(--text-primary)",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                }}
              >
                Erro no Módulo CRM
              </h2>
              <p
                style={{
                  margin: "0 0 1.5rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                Ocorreu um erro ao carregar o módulo CRM. Isso pode ser devido a
                um problema temporário de rede ou módulo em atualização.
              </p>

              {this.state.error && (
                <details
                  style={{
                    marginBottom: "1.5rem",
                    textAlign: "left",
                    backgroundColor: "var(--surface-secondary)",
                    padding: "1rem",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      fontWeight: "600",
                      color: "var(--text-primary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Detalhes do erro
                  </summary>
                  <pre
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {this.state.error.message}
                  </pre>
                </details>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="primary"
                  icon={RefreshCw}
                  onClick={this.handleRetry}
                >
                  Tentar Novamente
                </Button>
                <Button
                  variant="secondary"
                  icon={Home}
                  onClick={this.handleGoHome}
                >
                  Ir para o Painel
                </Button>
              </div>

              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1rem",
                  backgroundColor: "var(--surface-secondary)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                }}
              >
                <strong>Soluções rápidas:</strong>
                <ul style={{ margin: "0.5rem 0 0 1rem", textAlign: "left" }}>
                  <li>Verifique sua conexão com a internet</li>
                  <li>Tente recarregar a página (F5 ou Ctrl+R)</li>
                  <li>Limpe o cache do navegador</li>
                  <li>
                    Se o problema persistir, entre em contato com o suporte
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default CRMErrorBoundary;
