import React from "react";
import { motion } from "framer-motion";
import { Loader2, Scale, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useViewMode } from "@/contexts/ViewModeContext";

interface ResponsiveLoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  showLogo?: boolean;
  className?: string;
}

export function ResponsiveLoading({
  size = "md",
  text = "Carregando...",
  showLogo = true,
  className,
}: ResponsiveLoadingProps) {
  const { isAdminMode } = useViewMode();

  const sizeClasses = {
    sm: {
      container: "gap-2",
      spinner: "w-4 h-4",
      logo: "w-6 h-6",
      text: "text-sm",
    },
    md: {
      container: "gap-3",
      spinner: "w-6 h-6",
      logo: "w-8 h-8",
      text: "text-base",
    },
    lg: {
      container: "gap-4",
      spinner: "w-8 h-8",
      logo: "w-12 h-12",
      text: "text-lg",
    },
  };

  const currentSize = sizeClasses[size];
  const LogoIcon = isAdminMode ? Shield : Scale;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-4",
        currentSize.container,
        className,
      )}
    >
      {showLogo && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "flex items-center justify-center rounded-full",
            isAdminMode
              ? "bg-red-100 dark:bg-red-900/20"
              : "bg-blue-100 dark:bg-blue-900/20",
            size === "lg"
              ? "w-16 h-16"
              : size === "md"
                ? "w-12 h-12"
                : "w-8 h-8",
          )}
        >
          <LogoIcon
            className={cn(
              currentSize.logo,
              isAdminMode
                ? "text-red-600 dark:text-red-400"
                : "text-blue-600 dark:text-blue-400",
            )}
          />
        </motion.div>
      )}

      <div className="flex items-center gap-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2
            className={cn(
              currentSize.spinner,
              isAdminMode
                ? "text-red-500 dark:text-red-400"
                : "text-blue-500 dark:text-blue-400",
            )}
          />
        </motion.div>

        {text && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn(
              "font-medium",
              currentSize.text,
              isAdminMode
                ? "text-slate-700 dark:text-slate-300"
                : "text-gray-700 dark:text-gray-300",
            )}
          >
            {text}
          </motion.span>
        )}
      </div>

      {/* Loading dots animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex gap-1"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className={cn(
              "rounded-full",
              size === "lg"
                ? "w-2 h-2"
                : size === "md"
                  ? "w-1.5 h-1.5"
                  : "w-1 h-1",
              isAdminMode
                ? "bg-red-400 dark:bg-red-500"
                : "bg-blue-400 dark:bg-blue-500",
            )}
          />
        ))}
      </motion.div>
    </div>
  );
}

// Full screen loading overlay
export function FullScreenLoading({
  text = "Carregando sistema...",
}: {
  text?: string;
}) {
  const { isAdminMode } = useViewMode();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        isAdminMode
          ? "bg-slate-900/80 backdrop-blur"
          : "bg-white/80 dark:bg-slate-900/80 backdrop-blur",
      )}
    >
      <ResponsiveLoading size="lg" text={text} />
    </motion.div>
  );
}

// Inline loading for components
export function InlineLoading({ text = "Carregando..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <ResponsiveLoading size="sm" text={text} showLogo={false} />
    </div>
  );
}

export default ResponsiveLoading;
