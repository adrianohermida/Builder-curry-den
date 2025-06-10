/**
 * 🛡️ SAFE DRAG DROP CONTEXT - ENHANCED
 *
 * Wrapper robusto para DragDropContext que previne erros de useId
 * Implementa múltiplas camadas de proteção para React 19
 */

import React, { useEffect, useState, useRef } from "react";

interface SafeDragDropContextProps {
  children: React.ReactNode;
  onDragEnd: (result: any) => void;
  onDragStart?: (start: any) => void;
  onDragUpdate?: (update: any) => void;
  fallback?: React.ReactNode;
}

export const SafeDragDropContext: React.FC<SafeDragDropContextProps> = ({
  children,
  fallback = null,
  ...props
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isDndReady, setIsDndReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const initTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Aguardar montagem completa
    const timer = setTimeout(() => {
      setIsMounted(true);

      // Aguardar mais um tick para garantir que React.useId está disponível
      const dndTimer = setTimeout(() => {
        try {
          // Verificar se React.useId está disponível
          if (typeof React.useId === "function") {
            setIsDndReady(true);
          } else {
            console.warn("React.useId não disponível, usando fallback");
            setHasError(true);
          }
        } catch (error) {
          console.error("Erro ao verificar React.useId:", error);
          setHasError(true);
        }
      }, 100);

      initTimeoutRef.current = dndTimer;
    }, 50);

    return () => {
      clearTimeout(timer);
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, []);

  // Não renderizar até estar completamente pronto
  if (!isMounted || !isDndReady || hasError) {
    return <div className="drag-drop-fallback">{fallback || children}</div>;
  }

  // Carregar DragDropContext dinamicamente apenas quando necessário
  try {
    const { DragDropContext } = require("@hello-pangea/dnd");
    return <DragDropContext {...props}>{children}</DragDropContext>;
  } catch (error) {
    console.error("Erro ao carregar DragDropContext:", error);
    return <div className="drag-drop-error">{fallback || children}</div>;
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
