import { Suspense, lazy, memo } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy loading para componentes pesados
const Sidebar = lazy(() => import("./Sidebar"));
const Header = lazy(() => import("./Header"));
const IntegratedDashboard = lazy(
  () => import("../Dashboard/IntegratedDashboard"),
);

// Componente de Loading otimizado
const LoadingSpinner = memo(() => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[rgb(var(--theme-primary))]" />
      <p className="text-sm text-muted-foreground">Carregando...</p>
    </div>
  </div>
));

// Skeleton para layout da página
const PageSkeleton = memo(() => (
  <div className="p-6 space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-8 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-1/3 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
));

// Componente de Error Boundary
interface ErrorFallbackProps {
  error?: Error;
  onRetry?: () => void;
}

const ErrorFallback = memo(({ error, onRetry }: ErrorFallbackProps) => (
  <div className="flex items-center justify-center min-h-screen p-6">
    <Card className="max-w-md w-full">
      <CardContent className="p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Ops! Algo deu errado</h2>
        <p className="text-muted-foreground mb-4">
          {error?.message || "Ocorreu um erro inesperado. Tente novamente."}
        </p>
        {onRetry && (
          <Button onClick={onRetry} className="w-full">
            Tentar Novamente
          </Button>
        )}
      </CardContent>
    </Card>
  </div>
));

// Componente de Suspense personalizado
interface SuspenseWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const SuspenseWrapper = memo(({ children, fallback }: SuspenseWrapperProps) => (
  <Suspense fallback={fallback || <LoadingSpinner />}>{children}</Suspense>
));

// Layout principal otimizado
export const OptimizedLayout = memo(() => {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar com lazy loading */}
        <aside className="hidden lg:block w-64 border-r bg-card">
          <SuspenseWrapper fallback={<SidebarSkeleton />}>
            <Sidebar />
          </SuspenseWrapper>
        </aside>

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header com lazy loading */}
          <header className="border-b bg-card">
            <SuspenseWrapper fallback={<HeaderSkeleton />}>
              <Header />
            </SuspenseWrapper>
          </header>

          {/* Área de conteúdo */}
          <main className="flex-1 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <SuspenseWrapper fallback={<PageSkeleton />}>
                <Outlet />
              </SuspenseWrapper>
            </motion.div>
          </main>
        </div>
      </div>

      {/* Notificações flutuantes */}
      <SuspenseWrapper>
        <FloatingNotifications />
      </SuspenseWrapper>
    </div>
  );
});

// Skeleton components otimizados
const SidebarSkeleton = memo(() => (
  <div className="p-4 space-y-4">
    <Skeleton className="h-8 w-32" />
    <div className="space-y-2">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  </div>
));

const HeaderSkeleton = memo(() => (
  <div className="flex items-center justify-between p-4">
    <Skeleton className="h-8 w-48" />
    <div className="flex space-x-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-8 w-32" />
    </div>
  </div>
));

// Componente de notificações flutuantes
const FloatingNotifications = lazy(() =>
  import("../Notifications/FloatingNotifications").then((module) => ({
    default: module.FloatingNotifications,
  })),
);

// Hook para otimização de performance
export function usePerformanceOptimization() {
  // Implementar lazy loading dinâmico
  const loadComponent = (componentPath: string) => {
    return lazy(() => import(componentPath));
  };

  // Implementar preload de componentes críticos
  const preloadCriticalComponents = () => {
    // Preload componentes que provavelmente serão usados
    import("../Dashboard/IntegratedDashboard");
    import("../CRM/PublicacaoDetalhada");
    import("../IA/IAAssistant");
  };

  // Cleanup de recursos
  const cleanup = () => {
    // Limpar timers, event listeners, etc.
    if (typeof window !== "undefined") {
      // Cleanup específico do browser
    }
  };

  return {
    loadComponent,
    preloadCriticalComponents,
    cleanup,
  };
}

// Provider de contexto para otimizações
export const PerformanceProvider = memo(
  ({ children }: { children: React.ReactNode }) => {
    const { preloadCriticalComponents } = usePerformanceOptimization();

    // Preload componentes após o mount inicial
    React.useEffect(() => {
      const timer = setTimeout(preloadCriticalComponents, 1000);
      return () => clearTimeout(timer);
    }, [preloadCriticalComponents]);

    return <>{children}</>;
  },
);

// Componente para métricas de performance
export const PerformanceMonitor = memo(() => {
  const [metrics, setMetrics] = React.useState<{
    loadTime: number;
    renderTime: number;
    memoryUsage: number;
  } | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && "performance" in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === "navigation") {
            const navEntry = entry as PerformanceNavigationTiming;
            setMetrics({
              loadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
              renderTime:
                navEntry.domContentLoadedEventEnd -
                navEntry.domContentLoadedEventStart,
              memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
            });
          }
        });
      });

      observer.observe({ entryTypes: ["navigation"] });

      return () => observer.disconnect();
    }
  }, []);

  // Mostrar métricas apenas em desenvolvimento
  if (process.env.NODE_ENV !== "development" || !metrics) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs font-mono z-50">
      <div>Load: {metrics.loadTime.toFixed(2)}ms</div>
      <div>Render: {metrics.renderTime.toFixed(2)}ms</div>
      <div>Memory: {(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB</div>
    </div>
  );
});

OptimizedLayout.displayName = "OptimizedLayout";
LoadingSpinner.displayName = "LoadingSpinner";
PageSkeleton.displayName = "PageSkeleton";
ErrorFallback.displayName = "ErrorFallback";
SuspenseWrapper.displayName = "SuspenseWrapper";
SidebarSkeleton.displayName = "SidebarSkeleton";
HeaderSkeleton.displayName = "HeaderSkeleton";
PerformanceProvider.displayName = "PerformanceProvider";
PerformanceMonitor.displayName = "PerformanceMonitor";

export default OptimizedLayout;
