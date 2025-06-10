/**
 * CRM Jurídico - Kanban Board
 *
 * Componente Kanban inspirado no Bitrix24 para gestão visual de negócios
 * com drag & drop, real-time updates e customização completa.
 */

import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useCRMStore, useCRMSelectors } from "../../store";
import { BusinessCard } from "./BusinessCard";
import { StageColumn } from "./StageColumn";
import { KanbanFilters } from "./KanbanFilters";
import { KanbanToolbar } from "./KanbanToolbar";
import { AddBusinessModal } from "../Modals/AddBusinessModal";
import { BusinessDetailsModal } from "../Modals/BusinessDetailsModal";
import type { Business, Stage } from "../../types/business";
import { cn } from "@/lib/utils";
import { useHotkeys } from "react-hotkeys-hook";
import { useVirtualizer } from "@tanstack/react-virtual";

interface KanbanBoardProps {
  className?: string;
  showFilters?: boolean;
  showToolbar?: boolean;
  enableVirtualization?: boolean;
  onBusinessClick?: (business: Business) => void;
  onStageUpdate?: (stageId: string, updates: any) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  className,
  showFilters = true,
  showToolbar = true,
  enableVirtualization = false,
  onBusinessClick,
  onStageUpdate,
}) => {
  // Store state
  const {
    stages,
    selectedBusiness,
    isLoading,
    currentPipeline,
    moveBusiness,
    selectBusiness,
    addBusiness,
  } = useCRMStore();

  const { businessesByStage } = useCRMSelectors();

  // Local state
  const [draggedBusiness, setDraggedBusiness] = useState<Business | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStageForAdd, setSelectedStageForAdd] = useState<string>("");
  const [compactMode, setCompactMode] = useState(false);
  const [stageWidths, setStageWidths] = useState<Record<string, number>>({});

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // DnD sensors
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

  // Memoized data
  const stageBusinesses = useMemo(
    () => businessesByStage(),
    [businessesByStage],
  );

  // Virtualização para performance
  const parentRef = useRef<HTMLDivElement>(null);

  // Hotkeys
  useHotkeys("ctrl+n, cmd+n", () => {
    setShowAddModal(true);
  });

  useHotkeys("escape", () => {
    if (selectedBusiness) {
      selectBusiness(null);
    }
    setShowAddModal(false);
    setShowDetailsModal(false);
  });

  useHotkeys("ctrl+f, cmd+f", () => {
    // Focus on search input
    const searchInput = document.querySelector(
      "[data-search-input]",
    ) as HTMLInputElement;
    searchInput?.focus();
  });

  // Event handlers
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const business = stages
        .flatMap((stage) => stageBusinesses[stage.id] || [])
        .find((b) => b.id === active.id);

      if (business) {
        setDraggedBusiness(business);
      }
    },
    [stages, stageBusinesses],
  );

  const handleDragOver = useCallback((event: DragOverEvent) => {
    // Aqui você pode adicionar lógica para hover effects
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setDraggedBusiness(null);

      if (!over || active.id === over.id) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      // Se o drop foi em uma stage
      const targetStage = stages.find((stage) => stage.id === overId);
      if (targetStage) {
        moveBusiness(activeId, targetStage.id);
        return;
      }

      // Se o drop foi em outro business (reordenação dentro da stage)
      const activeBusiness = stages
        .flatMap((stage) => stageBusinesses[stage.id] || [])
        .find((b) => b.id === activeId);

      const overBusiness = stages
        .flatMap((stage) => stageBusinesses[stage.id] || [])
        .find((b) => b.id === overId);

      if (
        activeBusiness &&
        overBusiness &&
        activeBusiness.stageId === overBusiness.stageId
      ) {
        // Reordenar na mesma stage
        const stageId = activeBusiness.stageId;
        const businesses = stageBusinesses[stageId] || [];
        const activeIndex = businesses.findIndex((b) => b.id === activeId);
        const overIndex = businesses.findIndex((b) => b.id === overId);

        const reorderedBusinesses = arrayMove(
          businesses,
          activeIndex,
          overIndex,
        );
        // Aqui você implementaria a lógica de reordenação no store
      }
    },
    [stages, stageBusinesses, moveBusiness],
  );

  const handleBusinessClick = useCallback(
    (business: Business) => {
      selectBusiness(business);
      if (onBusinessClick) {
        onBusinessClick(business);
      } else {
        setShowDetailsModal(true);
      }
    },
    [selectBusiness, onBusinessClick],
  );

  const handleAddBusiness = useCallback((stageId: string) => {
    setSelectedStageForAdd(stageId);
    setShowAddModal(true);
  }, []);

  const handleBusinessCreated = useCallback(
    (business: Business) => {
      addBusiness(business);
      setShowAddModal(false);
      setSelectedStageForAdd("");
    },
    [addBusiness],
  );

  // Calculate stage metrics
  const getStageMetrics = useCallback(
    (stage: Stage) => {
      const businesses = stageBusinesses[stage.id] || [];
      return {
        count: businesses.length,
        totalValue: businesses.reduce((sum, b) => sum + b.value, 0),
        avgValue:
          businesses.length > 0
            ? businesses.reduce((sum, b) => sum + b.value, 0) /
              businesses.length
            : 0,
        probability: stage.probability,
      };
    },
    [stageBusinesses],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentPipeline || stages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h3 className="text-lg font-semibold mb-2">
          Nenhum pipeline configurado
        </h3>
        <p className="text-muted-foreground mb-4">
          Configure um pipeline para começar a gerenciar seus negócios.
        </p>
        <button className="btn-primary">Configurar Pipeline</button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Toolbar */}
      {showToolbar && (
        <KanbanToolbar
          pipeline={currentPipeline}
          onAddBusiness={() => setShowAddModal(true)}
          onToggleCompact={() => setCompactMode(!compactMode)}
          compactMode={compactMode}
        />
      )}

      {/* Filters */}
      {showFilters && <KanbanFilters />}

      {/* Board */}
      <div
        ref={containerRef}
        className="flex-1 overflow-x-auto overflow-y-hidden"
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 p-4 min-h-full">
            {stages.map((stage) => {
              const businesses = stageBusinesses[stage.id] || [];
              const metrics = getStageMetrics(stage);

              return (
                <StageColumn
                  key={stage.id}
                  stage={stage}
                  businesses={businesses}
                  metrics={metrics}
                  compactMode={compactMode}
                  onAddBusiness={() => handleAddBusiness(stage.id)}
                  onBusinessClick={handleBusinessClick}
                  onStageUpdate={onStageUpdate}
                  enableVirtualization={enableVirtualization}
                />
              );
            })}

            {/* Add Stage Button */}
            <div className="min-w-[280px] p-4">
              <button
                className={cn(
                  "w-full h-12 border-2 border-dashed border-muted-foreground/30",
                  "rounded-lg flex items-center justify-center gap-2",
                  "text-muted-foreground hover:border-primary hover:text-primary",
                  "transition-colors duration-200",
                )}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Adicionar Etapa
              </button>
            </div>
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {draggedBusiness && (
              <BusinessCard
                business={draggedBusiness}
                compact={compactMode}
                isDragging
                onClick={() => {}}
              />
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Modals */}
      <AddBusinessModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedStageForAdd("");
        }}
        initialStageId={selectedStageForAdd}
        onBusinessCreated={handleBusinessCreated}
      />

      <BusinessDetailsModal
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        business={selectedBusiness}
      />
    </div>
  );
};

export default KanbanBoard;
