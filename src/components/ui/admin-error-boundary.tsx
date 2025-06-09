import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Home, Shield } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class AdminErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Admin Error Boundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = () => {
    window.location.href = "/painel";
  };

  private handleGoToAdmin = () => {
    window.location.href = "/admin";
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isReactSuspenseError =
        this.state.error?.message?.includes(
          "suspended while responding to synchronous input",
        ) || this.state.error?.message?.includes("startTransition");

      return (
        <div className="min-h-[600px] flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
          <Card className="max-w-lg w-full border-red-200 dark:border-red-800">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Erro no Painel Admin
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {isReactSuspenseError
                  ? "Erro de carregamento do React 18. Isso pode ser resolvido recarregando a página."
                  : "Ocorreu um erro inesperado no painel administrativo."}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {isReactSuspenseError && (
                <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
                  <Shield className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                    <strong>React 18 Suspense Error:</strong> Este erro é
                    conhecido e pode ser resolvido recarregando a página.
                    Estamos trabalhando em uma correção permanente.
                  </AlertDescription>
                </Alert>
              )}

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Detalhes do erro:
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all">
                  {this.state.error?.message || "Erro desconhecido"}
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={this.handleRetry}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={this.handleGoToAdmin}
                    variant="outline"
                    className="w-full"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Home
                  </Button>

                  <Button
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="w-full"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Painel Principal
                  </Button>
                </div>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                <details>
                  <summary className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                    Informações técnicas (clique para expandir)
                  </summary>
                  <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
                    <div>
                      <strong>Error:</strong> {this.state.error?.name}
                    </div>
                    <div>
                      <strong>Message:</strong> {this.state.error?.message}
                    </div>
                    <div>
                      <strong>Stack:</strong>
                    </div>
                    <pre className="whitespace-pre-wrap text-xs">
                      {this.state.error?.stack}
                    </pre>
                    {this.state.errorInfo && (
                      <>
                        <div className="mt-2">
                          <strong>Component Stack:</strong>
                        </div>
                        <pre className="whitespace-pre-wrap text-xs">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </>
                    )}
                  </div>
                </details>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
