import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service (in production)
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // In production, you would send this to an error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDevelopment = import.meta.env?.MODE === "development";

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-2xl text-red-600 dark:text-red-400">
                Ops! Algo deu errado
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Encontramos um erro inesperado. Nossa equipe foi notificada
                automaticamente.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex items-center justify-center space-x-2">
                <Badge variant="outline" className="font-mono text-xs">
                  ID: {this.state.errorId}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {new Date().toLocaleString("pt-BR")}
                </Badge>
              </div>

              <Separator />

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={this.handleRetry}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Tentar Novamente
                </Button>

                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Ir para Dashboard
                </Button>

                <Button
                  variant="outline"
                  onClick={this.handleReload}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Recarregar Página
                </Button>
              </div>

              {isDevelopment && this.state.error && (
                <>
                  <Separator />
                  <details className="group">
                    <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                      <Bug className="w-4 h-4" />
                      Detalhes do Erro (Desenvolvimento)
                      <span className="ml-auto group-open:rotate-90 transition-transform">
                        ▶
                      </span>
                    </summary>

                    <div className="mt-4 space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-red-600">
                          Mensagem:
                        </h4>
                        <code className="block p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs font-mono text-red-800 dark:text-red-200 overflow-x-auto">
                          {this.state.error.message}
                        </code>
                      </div>

                      {this.state.error.stack && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-red-600">
                            Stack Trace:
                          </h4>
                          <code className="block p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs font-mono text-red-800 dark:text-red-200 overflow-x-auto whitespace-pre-wrap max-h-40 overflow-y-auto">
                            {this.state.error.stack}
                          </code>
                        </div>
                      )}

                      {this.state.errorInfo && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-red-600">
                            Component Stack:
                          </h4>
                          <code className="block p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs font-mono text-red-800 dark:text-red-200 overflow-x-auto whitespace-pre-wrap max-h-40 overflow-y-auto">
                            {this.state.errorInfo.componentStack}
                          </code>
                        </div>
                      )}
                    </div>
                  </details>
                </>
              )}

              <div className="text-center text-xs text-muted-foreground">
                <p>
                  Se o problema persistir, entre em contato com o suporte
                  técnico informando o ID do erro acima.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error("Error caught by useErrorHandler:", error, errorInfo);

    // In production, send to error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });

    // You could also trigger a toast notification
    // toast.error(`Erro: ${error.message}`);
  };
}

// Simple error fallback component
export function ErrorFallback({
  error,
  resetError,
}: {
  error: Error;
  resetError: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-4 text-center">
      <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
      <h3 className="text-lg font-semibold mb-1">Algo deu errado</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {error.message || "Erro inesperado"}
      </p>
      <Button onClick={resetError} size="sm">
        <RefreshCw className="w-4 h-4 mr-2" />
        Tentar novamente
      </Button>
    </div>
  );
}
