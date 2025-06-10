/**
 * Kanban Filters Component
 *
 * Filter controls for the Kanban board
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useCRMStore } from "../../store";

export const KanbanFilters: React.FC = () => {
  const { filters, setFilters, searchQuery, setSearchQuery } = useCRMStore();

  const handleClearFilters = () => {
    setFilters({
      stage: [],
      assignedTo: [],
      dateRange: null,
      value: { min: 0, max: null },
      tags: [],
      status: "all",
    });
    setSearchQuery("");
  };

  const hasActiveFilters = () => {
    return (
      searchQuery ||
      filters.stage.length > 0 ||
      filters.assignedTo.length > 0 ||
      filters.dateRange ||
      filters.value.min > 0 ||
      filters.value.max ||
      filters.tags.length > 0 ||
      filters.status !== "all"
    );
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-white border-b">
      {/* Search */}
      <div className="flex-1 max-w-sm">
        <Input
          placeholder="Buscar negócios..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-search-input
          className="w-full"
        />
      </div>

      {/* Status Filter */}
      <Select
        value={filters.status}
        onValueChange={(value) => setFilters({ status: value as any })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="open">Aberto</SelectItem>
          <SelectItem value="won">Ganho</SelectItem>
          <SelectItem value="lost">Perdido</SelectItem>
          <SelectItem value="postponed">Adiado</SelectItem>
          <SelectItem value="on_hold">Em espera</SelectItem>
        </SelectContent>
      </Select>

      {/* Value Range Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-40">
            Valor
            {(filters.value.min > 0 || filters.value.max) && (
              <Badge variant="secondary" className="ml-2">
                1
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <h4 className="font-medium">Filtrar por valor</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">Valor mínimo</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.value.min || ""}
                  onChange={(e) =>
                    setFilters({
                      value: {
                        ...filters.value,
                        min: Number(e.target.value) || 0,
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Valor máximo</label>
                <Input
                  type="number"
                  placeholder="Sem limite"
                  value={filters.value.max || ""}
                  onChange={(e) =>
                    setFilters({
                      value: {
                        ...filters.value,
                        max: Number(e.target.value) || null,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Date Range Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-40">
            Data
            {filters.dateRange && (
              <Badge variant="secondary" className="ml-2">
                1
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={
              filters.dateRange
                ? {
                    from: filters.dateRange.start,
                    to: filters.dateRange.end,
                  }
                : undefined
            }
            onSelect={(range) => {
              if (range?.from && range?.to) {
                setFilters({
                  dateRange: {
                    start: range.from,
                    end: range.to,
                  },
                });
              } else {
                setFilters({ dateRange: null });
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* Tags Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-32">
            Tags
            {filters.tags.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {filters.tags.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <h4 className="font-medium">Filtrar por tags</h4>
            <Input placeholder="Digite uma tag..." />
            <div className="flex flex-wrap gap-2">
              {/* Popular tags would be loaded here */}
              {["Urgente", "VIP", "Grande Cliente", "Recorrente"].map((tag) => (
                <Badge
                  key={tag}
                  variant={filters.tags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    const newTags = filters.tags.includes(tag)
                      ? filters.tags.filter((t) => t !== tag)
                      : [...filters.tags, tag];
                    setFilters({ tags: newTags });
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear Filters */}
      {hasActiveFilters() && (
        <Button variant="ghost" onClick={handleClearFilters}>
          Limpar filtros
        </Button>
      )}

      {/* View Options */}
      <div className="flex items-center space-x-2 border-l pl-4">
        <Button size="sm" variant="ghost">
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
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
        </Button>
        <Button size="sm" variant="ghost">
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-4a2 2 0 01-2-2z"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default KanbanFilters;
