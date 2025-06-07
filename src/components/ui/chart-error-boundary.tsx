import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./button";
import { Alert, AlertDescription, AlertTitle } from "./alert";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ChartErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Chart error caught by boundary:", error, errorInfo);

    // Call the optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI or use provided fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full h-64 flex items-center justify-center">
          <Alert className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro no Gráfico</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>
                Ocorreu um erro ao carregar este gráfico. Isso pode ser
                temporário.
              </p>
              {this.state.error && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    Detalhes técnicos
                  </summary>
                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={this.handleRetry}
                className="w-full"
              >
                <RefreshCw className="h-3 w-3 mr-2" />
                Tentar Novamente
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper component for easy usage
interface ChartWrapperProps {
  children: ReactNode;
  title?: string;
  className?: string;
  height?: number;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  children,
  title,
  className = "",
  height = 300,
}) => (
  <ChartErrorBoundary
    onError={(error, errorInfo) => {
      // Log to analytics or error reporting service
      console.warn(`Chart error in ${title}:`, error);
    }}
    fallback={
      <div
        className={`w-full flex items-center justify-center bg-muted/30 rounded-lg ${className}`}
        style={{ height }}
      >
        <div className="text-center text-muted-foreground">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">
            {title ? `Erro no gráfico: ${title}` : "Erro no gráfico"}
          </p>
          <p className="text-xs">Dados indisponíveis no momento</p>
        </div>
      </div>
    }
  >
    <div className={className} style={{ height }}>
      {children}
    </div>
  </ChartErrorBoundary>
);
