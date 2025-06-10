/**
 * 🔄 DND KIT WRAPPER - REACT 19 COMPATIBLE
 *
 * Wrapper usando @dnd-kit/core que é totalmente compatível com React 19
 * Substitui @hello-pangea/dnd para resolver problemas de useId
 */

import React from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable, SortableTransition } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DndKitWrapperProps {
  children: React.ReactNode;
  onDragEnd: (result: {
    source: { droppableId: string; index: number };
    destination: { droppableId: string; index: number } | null;
    draggableId: string;
  }) => void;
  onDragStart?: (start: {
    draggableId: string;
    source: { droppableId: string; index: number };
  }) => void;
}

export const DndKitWrapper: React.FC<DndKitWrapperProps> = ({
  children,
  onDragEnd,
  onDragStart,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      onDragEnd({
        source: { droppableId: "", index: 0 },
        destination: null,
        draggableId: active.id.toString(),
      });
      return;
    }

    // Extrair informações do drag & drop
    const sourceContainer = active.data.current?.sortable?.containerId || "";
    const sourceIndex = active.data.current?.sortable?.index || 0;
    const destContainer =
      over.data.current?.sortable?.containerId || over.id.toString();
    const destIndex = over.data.current?.sortable?.index || 0;

    onDragEnd({
      source: { droppableId: sourceContainer, index: sourceIndex },
      destination: { droppableId: destContainer, index: destIndex },
      draggableId: active.id.toString(),
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (onDragStart) {
      const { active } = event;
      const sourceContainer = active.data.current?.sortable?.containerId || "";
      const sourceIndex = active.data.current?.sortable?.index || 0;

      onDragStart({
        draggableId: active.id.toString(),
        source: { droppableId: sourceContainer, index: sourceIndex },
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      {children}
    </DndContext>
  );
};

// Componente Droppable compatível
interface DroppableProps {
  droppableId: string;
  children: React.ReactNode;
  className?: string;
}

export const Droppable: React.FC<DroppableProps> = ({
  droppableId,
  children,
  className,
}) => {
  return (
    <SortableContext
      id={droppableId}
      items={[]} // Os items serão gerenciados pelos Draggable individuais
      strategy={verticalListSortingStrategy}
    >
      <div className={className} data-droppable-id={droppableId}>
        {children}
      </div>
    </SortableContext>
  );
};

// Componente Draggable compatível
interface DraggableProps {
  draggableId: string;
  index: number;
  children: (provided: {
    draggableProps: any;
    dragHandleProps: any;
    innerRef: (element: HTMLElement | null) => void;
  }) => React.ReactNode;
}

export const Draggable: React.FC<DraggableProps> = ({
  draggableId,
  index,
  children,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: draggableId,
    data: {
      index,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({
        draggableProps: { ...attributes, style },
        dragHandleProps: listeners,
        innerRef: () => {}, // Não necessário com @dnd-kit
      })}
    </div>
  );
};

// Hook para verificar se DnD está disponível (sempre true com @dnd-kit)
export const useDragDropAvailable = () => {
  return true; // @dnd-kit é sempre compatível
};
