import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  RefreshCw,
  WifiOff,
  Clock,
  Zap,
  Search,
  FileX,
  Users,
  Download,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Enhanced Loading Spinner with variants
interface EnhancedLoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "dots" | "pulse" | "skeleton";
  text?: string;
  className?: string;
}

export function EnhancedLoading({
  size = "md",
  variant = "spinner",
  text,
  className,
}: EnhancedLoadingProps) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  if (variant === "spinner") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <motion.div
          className={cn(
            "animate-spin rounded-full border-2 border-current border-t-transparent text-primary",
            sizes[size],
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        {text && (
          <span className={cn("text-muted-foreground", textSizes[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={cn(
                "bg-primary rounded-full",
                size === "sm" && "h-2 w-2",
                size === "md" && "h-3 w-3",
                size === "lg" && "h-4 w-4",
                size === "xl" && "h-6 w-6",
              )}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
        {text && (
          <span className={cn("text-muted-foreground", textSizes[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <motion.div
          className={cn("bg-primary rounded-full", sizes[size])}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {text && (
          <span className={cn("text-muted-foreground", textSizes[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === "skeleton") {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </div>
        {text && (
          <span className={cn("text-muted-foreground block", textSizes[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  return null;
}

// Enhanced Error Component
interface EnhancedErrorProps {
  title?: string;
  message?: string;
  type?: "error" | "warning" | "network" | "404" | "empty" | "unauthorized";
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function EnhancedError({
  title,
  message,
  type = "error",
  action,
  className,
  size = "md",
}: EnhancedErrorProps) {
  const getIcon = () => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-12 w-12 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-12 w-12 text-yellow-500" />;
      case "network":
        return <WifiOff className="h-12 w-12 text-muted-foreground" />;
      case "404":
        return <FileX className="h-12 w-12 text-muted-foreground" />;
      case "empty":
        return <Search className="h-12 w-12 text-muted-foreground" />;
      case "unauthorized":
        return <Users className="h-12 w-12 text-destructive" />;
      default:
        return <AlertTriangle className="h-12 w-12 text-destructive" />;
    }
  };

  const getDefaultContent = () => {
    switch (type) {
      case "network":
        return {
          title: "Sem conexão",
          message: "Verifique sua conexão com a internet e tente novamente.",
        };
      case "404":
        return {
          title: "Página não encontrada",
          message: "A página que você está procurando não existe.",
        };
      case "empty":
        return {
          title: "Nenhum resultado",
          message: "Não foram encontrados dados para exibir.",
        };
      case "unauthorized":
        return {
          title: "Acesso negado",
          message: "Você não tem permissão para acessar este recurso.",
        };
      case "warning":
        return {
          title: "Atenção",
          message: "Algo precisa da sua atenção.",
        };
      default:
        return {
          title: "Erro",
          message: "Ocorreu um erro inesperado. Tente novamente.",
        };
    }
  };

  const defaultContent = getDefaultContent();
  const finalTitle = title || defaultContent.title;
  const finalMessage = message || defaultContent.message;

  const sizeClasses = {
    sm: "p-6",
    md: "p-8",
    lg: "p-12",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        sizeClasses[size],
        className,
      )}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mb-4"
      >
        {getIcon()}
      </motion.div>

      <h3 className="text-lg font-semibold text-foreground mb-2">
        {finalTitle}
      </h3>

      <p className="text-muted-foreground mb-6 max-w-md">{finalMessage}</p>

      {action && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button onClick={action.onClick} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

// Enhanced Empty State Component
interface EnhancedEmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline";
  };
  className?: string;
}

export function EnhancedEmptyState({
  icon,
  title = "Nenhum item encontrado",
  description = "Não há dados para exibir no momento.",
  action,
  className,
}: EnhancedEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col items-center justify-center text-center p-12",
        className,
      )}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        {icon || <Search className="h-16 w-16 text-muted-foreground/50" />}
      </motion.div>

      <motion.h3
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-foreground mb-2"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground mb-6 max-w-sm"
      >
        {description}
      </motion.p>

      {action && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={action.onClick}
            variant={action.variant || "default"}
          >
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

// Enhanced Progress Component
interface EnhancedProgressProps {
  value: number;
  max?: number;
  label?: string;
  description?: string;
  variant?: "default" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

export function EnhancedProgress({
  value,
  max = 100,
  label,
  description,
  variant = "default",
  size = "md",
  showPercentage = true,
  animated = true,
  className,
}: EnhancedProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variants = {
    default: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-destructive",
  };

  const sizes = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-sm font-medium text-foreground">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm text-muted-foreground">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          "w-full bg-muted rounded-full overflow-hidden",
          sizes[size],
        )}
      >
        <motion.div
          className={cn("h-full rounded-full", variants[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: animated ? 0.8 : 0,
            ease: "easeOut",
          }}
        />
      </div>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

// Enhanced Status Indicator
interface StatusIndicatorProps {
  status: "online" | "offline" | "busy" | "away" | "loading";
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatusIndicator({
  status,
  label,
  size = "md",
  className,
}: StatusIndicatorProps) {
  const sizes = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };

  const colors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    busy: "bg-red-500",
    away: "bg-yellow-500",
    loading: "bg-blue-500",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div
          className={cn(
            "rounded-full",
            sizes[size],
            colors[status],
            status === "loading" && "animate-pulse",
          )}
        />
        {status === "online" && (
          <motion.div
            className={cn("absolute inset-0 rounded-full bg-green-400")}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </div>
      {label && (
        <span className="text-sm text-foreground capitalize">{status}</span>
      )}
    </div>
  );
}

// Enhanced File Upload State
interface FileUploadStateProps {
  state: "idle" | "uploading" | "success" | "error";
  progress?: number;
  fileName?: string;
  fileSize?: string;
  error?: string;
  onRetry?: () => void;
  onCancel?: () => void;
  className?: string;
}

export function FileUploadState({
  state,
  progress = 0,
  fileName,
  fileSize,
  error,
  onRetry,
  onCancel,
  className,
}: FileUploadStateProps) {
  const getIcon = () => {
    switch (state) {
      case "uploading":
        return <Upload className="h-5 w-5 text-blue-500 animate-pulse" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default:
        return <Upload className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (state) {
      case "uploading":
        return "Enviando...";
      case "success":
        return "Upload concluído";
      case "error":
        return "Erro no upload";
      default:
        return "Pronto para envio";
    }
  };

  return (
    <motion.div
      layout
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border",
        state === "success" &&
          "border-green-200 bg-green-50 dark:bg-green-900/20",
        state === "error" && "border-red-200 bg-red-50 dark:bg-red-900/20",
        state === "uploading" &&
          "border-blue-200 bg-blue-50 dark:bg-blue-900/20",
        className,
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex-shrink-0">{getIcon()}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground truncate">
            {fileName || "Arquivo"}
          </p>
          {fileSize && (
            <span className="text-xs text-muted-foreground ml-2">
              {fileSize}
            </span>
          )}
        </div>

        <p className="text-xs text-muted-foreground">{getStatusText()}</p>

        {state === "uploading" && (
          <div className="mt-2">
            <EnhancedProgress
              value={progress}
              size="sm"
              variant="default"
              showPercentage={false}
              animated={true}
            />
          </div>
        )}

        {state === "error" && error && (
          <p className="text-xs text-destructive mt-1">{error}</p>
        )}
      </div>

      <div className="flex items-center gap-1">
        {state === "error" && onRetry && (
          <Button size="sm" variant="ghost" onClick={onRetry}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
        {state === "uploading" && onCancel && (
          <Button size="sm" variant="ghost" onClick={onCancel}>
            ×
          </Button>
        )}
      </div>
    </motion.div>
  );
}

// Enhanced Page Loading with skeleton
export function PageLoading({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6 p-6", className)}>
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-8 bg-muted rounded-lg w-1/3 animate-pulse" />
        <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-2/3" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
