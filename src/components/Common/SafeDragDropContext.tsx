/**
 * 🛡️ SAFE DRAG DROP CONTEXT - EMERGENCY FALLBACK
 *
 * Wrapper totalmente seguro que previne erros de React hooks
 * Renderiza interface visual sem funcionalidade de drag & drop
 */

import React from "react";

interface SafeDragDropContextProps {
  children: React.ReactNode;
  onDragEnd?: (result: any) => void;
  onDragStart?: (start: any) => void;
  onDragUpdate?: (update: any) => void;
  fallback?: React.ReactNode;
}

export const SafeDragDropContext: React.FC<SafeDragDropContextProps> = ({
  children,
  fallback,
  onDragEnd,
  onDragStart,
  ...props
}) => {
  // EMERGENCY MODE: Apenas renderiza os children sem drag & drop
  console.warn(
    "SafeDragDropContext: Usando modo seguro sem drag & drop para prevenir erros React hooks",
  );

  return (
    <div className="drag-drop-disabled" data-safe-mode="true">
      {children}
    </div>
  );
};

// Componentes de fallback que não usam hooks problemáticos
export const SafeDroppable: React.FC<{
  droppableId: string;
  children: React.ReactNode;
  className?: string;
}> = ({ droppableId, children, className }) => {
  return (
    <div
      className={className}
      data-droppable-id={droppableId}
      data-safe-droppable="true"
    >
      {children}
    </div>
  );
};

export const SafeDraggable: React.FC<{
  draggableId: string;
  index: number;
  children: (provided: {
    draggableProps: any;
    dragHandleProps: any;
    innerRef: (element: HTMLElement | null) => void;
  }) => React.ReactNode;
}> = ({ draggableId, index, children }) => {
  return (
    <div data-draggable-id={draggableId} data-safe-draggable="true">
      {children({
        draggableProps: {
          style: {},
          "data-index": index,
          "data-draggable-id": draggableId,
        },
        dragHandleProps: {
          style: { cursor: "default" },
        },
        innerRef: () => {},
      })}
    </div>
  );
};

// Hook seguro que sempre retorna false
export const useDragDropAvailable = () => {
  return false;
};

// Re-exportar para compatibilidade
export { SafeDroppable as Droppable };
export { SafeDraggable as Draggable };

export default SafeDragDropContext;
