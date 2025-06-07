import { motion } from "framer-motion";
import { Loader2, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  showLogo?: boolean;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size = "md",
  message = "Carregando...",
  showLogo = true,
  fullScreen = true,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <Card className="border-none shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            {showLogo && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-2"
              >
                <Scale className="h-8 w-8 text-primary-foreground" />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-3"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Loader2 className={`${sizeClasses[size]} text-primary`} />
              </motion.div>

              {message && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm font-medium text-muted-foreground"
                >
                  {message}
                </motion.span>
              )}
            </motion.div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              className="h-1 bg-primary/20 rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-full w-1/3 bg-primary rounded-full"
              />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Skeleton loaders for specific components
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-3 animate-pulse">
          <div className="w-10 h-10 bg-muted rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
          <div className="w-20 h-8 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="flex space-x-2 mt-4">
                <div className="h-8 bg-muted rounded w-20" />
                <div className="h-8 bg-muted rounded w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-8 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="h-6 bg-muted rounded w-1/3" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex space-x-3">
                  <div className="w-10 h-10 bg-muted rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="h-6 bg-muted rounded w-1/3" />
            <div className="h-40 bg-muted rounded" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
