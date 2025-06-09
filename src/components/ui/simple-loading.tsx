import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageLoadingProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PageLoading({
  message = "Carregando...",
  className,
  size = "md",
}: PageLoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "flex flex-col items-center justify-center space-y-3",
        className,
      )}
    >
      <Loader2
        className={cn("animate-spin text-blue-600", sizeClasses[size])}
      />
      <p className="text-sm text-muted-foreground">{message}</p>
    </motion.div>
  );
}

interface SimpleLoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function SimpleLoading({ className, size = "md" }: SimpleLoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Loader2 className={cn("animate-spin", sizeClasses[size], className)} />
  );
}

export default PageLoading;
