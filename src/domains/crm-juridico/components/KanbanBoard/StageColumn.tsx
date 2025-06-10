/**
 * Stage Column Component
 *
 * Column component for Kanban board stages
 */

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BusinessCard } from "./BusinessCard";
import type { Business, Stage } from "../../types/business";

interface StageMetrics {
  count: number;
  totalValue: number;
  avgValue: number;
  probability: number;
}

interface StageColumnProps {
  stage: Stage;
  businesses: Business[];
  metrics: StageMetrics;
  compactMode?: boolean;
  onAddBusiness: (stageId: string) => void;
  onBusinessClick: (business: Business) => void;
  onStageUpdate?: (stageId: string, updates: any) => void;
  enableVirtualization?: boolean;
}

export const StageColumn: React.FC<StageColumnProps> = ({
  stage,
  businesses,
  metrics,
  compactMode = false,
  onAddBusiness,
  onBusinessClick,
  onStageUpdate,
  enableVirtualization = false,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div
      className={cn(
        "flex flex-col min-w-[280px] max-w-[320px] bg-gray-50 rounded-lg",
        "border-2 border-transparent transition-colors",
        isOver && "border-blue-200 bg-blue-50",
        compactMode && "min-w-[240px] max-w-[280px]",
      )}
    >
      {/* Stage Header */}
      <div className="p-4 border-b bg-white rounded-t-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: stage.color }}
            />
            <h3 className="font-semibold text-gray-900">{stage.name}</h3>
            <Badge variant="secondary" className="text-xs">
              {metrics.count}
            </Badge>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onAddBusiness(stage.id)}
            className="h-6 w-6 p-0"
          >
            <svg
              className="w-4 h-4"
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
          </Button>
        </div>

        {/* Stage Metrics */}
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Total:</span>
            <span className="font-medium">
              {formatCurrency(metrics.totalValue)}
            </span>
          </div>
          {metrics.count > 0 && (
            <div className="flex justify-between">
              <span>Média:</span>
              <span className="font-medium">
                {formatCurrency(metrics.avgValue)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Probabilidade:</span>
            <span className="font-medium">{stage.probability}%</span>
          </div>
        </div>
      </div>

      {/* Business Cards */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-2 space-y-2 min-h-[200px] overflow-y-auto",
          "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent",
        )}
      >
        <SortableContext
          items={businesses.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {businesses.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
              <div className="text-center">
                <svg
                  className="w-8 h-8 mx-auto mb-2 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p>Nenhum negócio</p>
                <p className="text-xs">Arraste aqui ou clique em +</p>
              </div>
            </div>
          ) : (
            businesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                compact={compactMode}
                onClick={onBusinessClick}
              />
            ))
          )}
        </SortableContext>
      </div>

      {/* Stage Footer */}
      <div className="p-2 border-t bg-white rounded-b-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddBusiness(stage.id)}
          className="w-full justify-center text-gray-600 hover:text-gray-900"
        >
          <svg
            className="w-4 h-4 mr-2"
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
          Adicionar Negócio
        </Button>
      </div>
    </div>
  );
};

export default StageColumn;
