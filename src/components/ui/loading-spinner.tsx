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
      <Card className="w-fit">
        <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            {showLogo ? (
              <Scale className={`${sizeClasses[size]} text-blue-600`} />
            ) : (
              <Loader2 className={`${sizeClasses[size]} text-blue-600`} />
            )}
          </motion.div>

          {message && (
            <p className="text-sm text-muted-foreground text-center">
              {message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default LoadingSpinner;
