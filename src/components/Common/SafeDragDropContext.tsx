/**
 * 🛡️ SAFE DRAG DROP CONTEXT
 *
 * Wrapper para DragDropContext que previne erros de useId em React 19
 * Inclui fallback e tratamento de erro para problemas de hidratação
 */

import React, { useEffect, useState } from "react";
import { DragDropContext, DragDropContextProps } from "@hello-pangea/dnd";

interface SafeDragDropContextProps extends DragDropContextProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const SafeDragDropContext: React.FC<SafeDragDropContextProps> = ({
  children,
  fallback = null,
  ...props
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Garantir que o componente está montado no cliente
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{fallback}</>;
  }

  if (hasError) {
    console.warn("DragDropContext failed to initialize, rendering fallback");
    return <>{fallback || children}</>;
  }

  try {
    return <DragDropContext {...props}>{children}</DragDropContext>;
  } catch (error) {
    console.error("DragDropContext error:", error);
    setHasError(true);
    return <>{fallback || children}</>;
  }
};

// Hook para verificar se drag and drop está disponível
export const useDragDropAvailable = () => {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    try {
      // Verificar se React.useId está disponível
      if (typeof React.useId === "function") {
        setIsAvailable(true);
      }
    } catch (error) {
      console.warn("Drag and drop not available:", error);
      setIsAvailable(false);
    }
  }, []);

  return isAvailable;
};
