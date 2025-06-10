import React from "react";
import { AlertTriangle, RefreshCw, Home, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CRMErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface CRMErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
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
    this.setState({
      error,
      errorInfo,
    });

    // Log do erro para monitoramento
    console.error("CRM Error Boundary caught an error:", error, errorInfo);

    // Aqui você pode integrar com serviços de monitoramento como Sentry
    // Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });
  };

  render() {
    if (this.state.hasError) {
      // Se um componente de fallback customizado foi fornecido, use-o
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={this.resetError}
          />
        );
      }

      // Fallback padrão
      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

// Componente de fallback padrão
const DefaultErrorFallback: React.FC<{
  error?: Error;
  errorInfo?: React.ErrorInfo;
  resetError: () => void;
}> = ({ error, errorInfo, resetError }) => {
  const isDevelopment = process.env.NODE_ENV === "development";

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/painel";
  };

  const handleReportIssue = () => {
    // Implementar lógica de reportar issue
    const errorDetails = {
      message: error?.message,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    console.error("Error reported:", errorDetails);
    // Aqui você pode enviar para um sistema de tickets ou email
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">
            Ops! Algo deu errado no CRM
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600">
              Encontramos um problema inesperado no sistema CRM. Não se
              preocupe, suas informações estão seguras.
            </p>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error?.message || "Erro desconhecido ocorreu no sistema"}
            </AlertDescription>
          </Alert>

          {/* Ações de recuperação */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={resetError} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Tentar Novamente
            </Button>
            <Button
              variant="outline"
              onClick={handleReload}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Recarregar Página
            </Button>
            <Button
              variant="outline"
              onClick={handleGoHome}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Ir para Dashboard
            </Button>
          </div>

          {/* Informações de suporte */}
          <div className="text-center border-t pt-4">
            <p className="text-sm text-gray-500 mb-3">
              Se o problema persistir, entre em contato com o suporte técnico.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReportIssue}
              className="text-blue-600 hover:text-blue-700"
            >
              <Settings className="w-4 h-4 mr-2" />
              Reportar Problema
            </Button>
          </div>

          {/* Detalhes técnicos para desenvolvimento */}
          {isDevelopment && error && (
            <details className="mt-6">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                Detalhes Técnicos (Desenvolvimento)
              </summary>
              <div className="mt-3 p-4 bg-gray-50 rounded-lg text-xs font-mono">
                <div className="mb-2">
                  <strong>Erro:</strong> {error.message}
                </div>
                {error.stack && (
                  <div className="mb-2">
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap mt-1 text-red-600">
                      {error.stack}
                    </pre>
                  </div>
                )}
                {errorInfo?.componentStack && (
                  <div>
                    <strong>Component Stack:</strong>
                    <pre className="whitespace-pre-wrap mt-1 text-blue-600">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Hook para usar o Error Boundary funcionalmente
export const useCRMErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    setError(error);
    console.error("CRM Error handled:", error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { handleError, resetError };
};

// HOC para envolver componentes com error boundary
export const withCRMErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>,
) => {
  const WrappedComponent = (props: P) => (
    <CRMErrorBoundary fallback={fallback}>
      <Component {...props} />
    </CRMErrorBoundary>
  );

  WrappedComponent.displayName = `withCRMErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

export default CRMErrorBoundary;
