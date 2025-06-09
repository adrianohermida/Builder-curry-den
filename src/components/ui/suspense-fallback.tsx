import React from "react";
import { motion } from "framer-motion";

interface SuspenseFallbackProps {
  message?: string;
  className?: string;
  minimal?: boolean;
}

export const SuspenseFallback: React.FC<SuspenseFallbackProps> = ({
  message = "Carregando...",
  className = "",
  minimal = false,
}) => {
  if (minimal) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center min-h-[400px] ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center space-y-4 p-8"
      >
        {/* Animated loader */}
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
        </div>

        {/* Loading message */}
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 mb-1">{message}</p>
          <p className="text-sm text-gray-500">
            Por favor, aguarde um momento...
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-600 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Componente específico para fallback de rotas
export const RouteFallback: React.FC = () => (
  <SuspenseFallback message="Carregando página..." />
);

// Componente específico para fallback de componentes lazy
export const ComponentFallback: React.FC = () => (
  <SuspenseFallback message="Carregando componente..." minimal />
);

// Wrapper ErrorBoundary + Suspense para uso geral
interface SafeComponentWrapperProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
  errorMessage?: string;
}

export const SafeComponentWrapper: React.FC<SafeComponentWrapperProps> = ({
  children,
  fallback: FallbackComponent = SuspenseFallback,
  errorMessage = "Erro ao carregar componente",
}) => {
  return (
    <React.Suspense fallback={<FallbackComponent />}>{children}</React.Suspense>
  );
};
