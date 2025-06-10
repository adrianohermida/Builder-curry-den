/**
 * 🔒 DRAG DROP FALLBACK - UI SEM DRAG
 *
 * Componente de fallback que mantém a UI do kanban
 * mas desabilita funcionalidade de drag & drop quando há problemas
 */

import React from "react";

interface DragDropFallbackProps {
  children: React.ReactNode;
  onDragEnd?: (result: any) => void;
  onDragStart?: (start: any) => void;
  disabled?: boolean;
}

export const DragDropFallback: React.FC<DragDropFallbackProps> = ({
  children,
  disabled = true,
}) => {
  return (
    <div
      className={disabled ? "drag-disabled" : ""}
      data-drag-disabled={disabled}
      style={{
        opacity: disabled ? 0.9 : 1,
        cursor: disabled ? "default" : "grab",
      }}
    >
      {children}
    </div>
  );
};

// Droppable de fallback (apenas container)
interface FallbackDroppableProps {
  droppableId: string;
  children: React.ReactNode;
  className?: string;
}

export const FallbackDroppable: React.FC<FallbackDroppableProps> = ({
  droppableId,
  children,
  className,
}) => {
  return (
    <div
      className={className}
      data-droppable-id={droppableId}
      data-fallback-droppable="true"
    >
      {children}
    </div>
  );
};

// Draggable de fallback (apenas visual)
interface FallbackDraggableProps {
  draggableId: string;
  index: number;
  children: (provided: {
    draggableProps: any;
    dragHandleProps: any;
    innerRef: (element: HTMLElement | null) => void;
  }) => React.ReactNode;
}

export const FallbackDraggable: React.FC<FallbackDraggableProps> = ({
  draggableId,
  index,
  children,
}) => {
  return (
    <div data-draggable-id={draggableId} data-fallback-draggable="true">
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

// Hook que sempre retorna false para fallback
export const useFallbackDragDrop = () => {
  return false;
};
