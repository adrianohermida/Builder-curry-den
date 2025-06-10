/**
 * 🛡️ SAFE DRAG DROP CONTEXT - REACT 19 COMPATIBLE
 *
 * Wrapper seguro que resolve problemas de React hooks com @hello-pangea/dnd
 * Fallback inteligente em caso de problemas
 */

import React, { useState, useEffect, ErrorBoundary } from "react";

// Conditional import para evitar erros
let DragDropContext: any = null;
let Droppable: any = null;
let Draggable: any = null;
let DropResult: any = null;

try {
  const dndModule = require("@hello-pangea/dnd");
  DragDropContext = dndModule.DragDropContext;
  Droppable = dndModule.Droppable;
  Draggable = dndModule.Draggable;
  DropResult = dndModule.DropResult;
} catch (error) {
  console.warn("@hello-pangea/dnd não disponível, usando fallback", error);
}

interface SafeDragDropContextProps {
  children: React.ReactNode;
  onDragEnd?: (result: any) => void;
  onDragStart?: (start: any) => void;
  onDragUpdate?: (update: any) => void;
  fallback?: React.ReactNode;
}

// Error Boundary interno
class DragDropErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error("Drag & Drop Error:", error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("DragDropContext Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export const SafeDragDropContext: React.FC<SafeDragDropContextProps> = ({
  children,
  fallback,
  onDragEnd,
  onDragStart,
  onDragUpdate,
  ...props
}) => {
  const [isDragEnabled, setIsDragEnabled] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Verificar se o drag & drop está disponível
    try {
      if (DragDropContext && typeof DragDropContext === "function") {
        setIsDragEnabled(true);
        console.log("✅ SafeDragDropContext: Drag & Drop habilitado");
      } else {
        console.warn("⚠️ SafeDragDropContext: Usando modo fallback");
        setIsDragEnabled(false);
      }
    } catch (error) {
      console.error("❌ SafeDragDropContext: Erro ao inicializar", error);
      setHasError(true);
      setIsDragEnabled(false);
    }
  }, []);

  // Fallback renderizado
  const FallbackContent = () => (
    <div className="drag-drop-disabled" data-safe-mode="true">
      {fallback || children}
    </div>
  );

  // Se houve erro ou drag não está disponível
  if (hasError || !isDragEnabled || !DragDropContext) {
    return <FallbackContent />;
  }

  // Tentar renderizar com drag & drop real
  try {
    return (
      <DragDropErrorBoundary fallback={<FallbackContent />}>
        <DragDropContext
          onDragEnd={onDragEnd || (() => {})}
          onDragStart={onDragStart}
          onDragUpdate={onDragUpdate}
          {...props}
        >
          {children}
        </DragDropContext>
      </DragDropErrorBoundary>
    );
  } catch (error) {
    console.error("❌ SafeDragDropContext render error:", error);
    return <FallbackContent />;
  }
};

// Safe Droppable Component
export const SafeDroppable: React.FC<{
  droppableId: string;
  children: (provided: any, snapshot: any) => React.ReactNode;
  className?: string;
  type?: string;
  direction?: "vertical" | "horizontal";
  isDropDisabled?: boolean;
}> = ({
  droppableId,
  children,
  className,
  type = "DEFAULT",
  direction = "vertical",
  isDropDisabled = false,
}) => {
  const [isDragEnabled, setIsDragEnabled] = useState(false);

  useEffect(() => {
    setIsDragEnabled(!!Droppable);
  }, []);

  // Fallback quando drag não está disponível
  if (!isDragEnabled || !Droppable) {
    const providedMock = {
      innerRef: () => {},
      droppableProps: {
        "data-droppable-id": droppableId,
        "data-safe-droppable": true,
      },
      placeholder: null,
    };

    const snapshotMock = {
      isDraggingOver: false,
      draggingOverWith: null,
      draggingFromThisWith: null,
      isUsingPlaceholder: false,
    };

    return (
      <div className={className} data-droppable-fallback="true">
        {children(providedMock, snapshotMock)}
      </div>
    );
  }

  // Drag & drop real
  try {
    return (
      <Droppable
        droppableId={droppableId}
        type={type}
        direction={direction}
        isDropDisabled={isDropDisabled}
      >
        {children}
      </Droppable>
    );
  } catch (error) {
    console.error("❌ SafeDroppable error:", error);
    // Fallback em caso de erro
    const providedMock = {
      innerRef: () => {},
      droppableProps: { "data-droppable-id": droppableId },
      placeholder: null,
    };
    const snapshotMock = { isDraggingOver: false };

    return (
      <div className={className}>{children(providedMock, snapshotMock)}</div>
    );
  }
};

// Safe Draggable Component
export const SafeDraggable: React.FC<{
  draggableId: string;
  index: number;
  children: (provided: any, snapshot: any) => React.ReactNode;
  isDragDisabled?: boolean;
}> = ({ draggableId, index, children, isDragDisabled = false }) => {
  const [isDragEnabled, setIsDragEnabled] = useState(false);

  useEffect(() => {
    setIsDragEnabled(!!Draggable);
  }, []);

  // Fallback quando drag não está disponível
  if (!isDragEnabled || !Draggable) {
    const providedMock = {
      innerRef: () => {},
      draggableProps: {
        style: {},
        "data-index": index,
        "data-draggable-id": draggableId,
        "data-safe-draggable": true,
      },
      dragHandleProps: {
        style: { cursor: isDragDisabled ? "default" : "grab" },
        "data-drag-handle": true,
      },
    };

    const snapshotMock = {
      isDragging: false,
      isDropAnimating: false,
      draggingOver: null,
      dropAnimation: null,
      mode: null,
    };

    return (
      <div data-draggable-fallback="true">
        {children(providedMock, snapshotMock)}
      </div>
    );
  }

  // Drag & drop real
  try {
    return (
      <Draggable
        draggableId={draggableId}
        index={index}
        isDragDisabled={isDragDisabled}
      >
        {children}
      </Draggable>
    );
  } catch (error) {
    console.error("❌ SafeDraggable error:", error);
    // Fallback em caso de erro
    const providedMock = {
      innerRef: () => {},
      draggableProps: { style: {}, "data-draggable-id": draggableId },
      dragHandleProps: { style: { cursor: "default" } },
    };
    const snapshotMock = { isDragging: false };

    return <div>{children(providedMock, snapshotMock)}</div>;
  }
};

// Hook para verificar disponibilidade do drag & drop
export const useDragDropAvailable = () => {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    try {
      setIsAvailable(!!(DragDropContext && Droppable && Draggable));
    } catch (error) {
      setIsAvailable(false);
    }
  }, []);

  return isAvailable;
};

// Export types para compatibilidade
export type { DropResult };

// Re-exportar para compatibilidade
export { SafeDroppable as Droppable };
export { SafeDraggable as Draggable };

export default SafeDragDropContext;
