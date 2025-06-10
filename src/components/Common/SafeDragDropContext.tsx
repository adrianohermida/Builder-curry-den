/**
 * 🛡️ SAFE DRAG DROP CONTEXT - FALLBACK AUTOMÁTICO
 *
 * Wrapper que tenta @hello-pangea/dnd primeiro e usa @dnd-kit como fallback
 * Resolve problemas de React 19 automaticamente
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
  fallback,
  ...props
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [useKitFallback, setUseKitFallback] = useState(false);
  const [hasError, setHasError] = useState(false);
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (!attemptedRef.current) {
      attemptedRef.current = true;

      // Aguardar montagem completa
      const timer = setTimeout(() => {
        setIsMounted(true);

        // Tentar inicializar @hello-pangea/dnd
        try {
          // Verificar React.useId
          if (typeof React.useId !== "function") {
            console.warn("React.useId não disponível, usando @dnd-kit");
            setUseKitFallback(true);
            return;
          }

          // Tentar carregar @hello-pangea/dnd
          const { DragDropContext } = require("@hello-pangea/dnd");
          if (!DragDropContext) {
            throw new Error("DragDropContext não disponível");
          }
        } catch (error) {
          console.warn("@hello-pangea/dnd falhou, usando @dnd-kit:", error);
          setUseKitFallback(true);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  // Aguardar montagem
  if (!isMounted) {
    return <div className="opacity-50">{fallback || children}</div>;
  }

  // Usar @dnd-kit como fallback
  if (useKitFallback) {
    return <DndKitFallback {...props}>{children}</DndKitFallback>;
  }

  // Tentar usar @hello-pangea/dnd
  try {
    const { DragDropContext } = require("@hello-pangea/dnd");
    return (
      <ErrorBoundary
        onError={() => setUseKitFallback(true)}
        fallback={<DndKitFallback {...props}>{children}</DndKitFallback>}
      >
        <DragDropContext {...props}>{children}</DragDropContext>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error("Erro final ao carregar DragDropContext:", error);
    return <DndKitFallback {...props}>{children}</DndKitFallback>;
  }
};

// Componente de fallback usando @dnd-kit
const DndKitFallback: React.FC<SafeDragDropContextProps> = ({
  children,
  onDragEnd,
  onDragStart,
}) => {
  try {
    const {
      DndContext,
      useSensor,
      useSensors,
      PointerSensor,
    } = require("@dnd-kit/core");

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: { distance: 8 },
      }),
    );

    const handleDragEnd = (event: any) => {
      const { active, over } = event;

      // Converter para formato @hello-pangea/dnd
      const result = {
        draggableId: active.id.toString(),
        source: {
          droppableId: active.data.current?.droppableId || "",
          index: 0,
        },
        destination: over
          ? {
              droppableId: over.data.current?.droppableId || over.id.toString(),
              index: 0,
            }
          : null,
      };

      onDragEnd(result);
    };

    return (
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {children}
      </DndContext>
    );
  } catch (error) {
    console.error("Fallback @dnd-kit também falhou:", error);
    return <div>{children}</div>;
  }
};

// Error Boundary simples
class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  fallback: React.ReactNode;
  onError: () => void;
}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("SafeDragDropContext Error:", error, errorInfo);
    this.props.onError();
  }

  render() {
    if ((this.state as any).hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

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
