/**
 * 🔍 BARRA DE FILTROS FIXA - CRM V3 MINIMALIA
 *
 * Barra de filtros sticky com:
 * - Filtros rápidos contextuais
 * - Busca inteligente
 * - Botão de limpar todos os filtros
 * - Indicadores de contagem
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  RotateCcw,
  Star,
  AlertTriangle,
  Clock,
  CheckCircle,
  DollarSign,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { QuickFilter } from "@/hooks/useCRMV3";

interface StickyFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  quickFilters: QuickFilter[];
  onToggleFilter: (key: string) => void;
  onClearAll: () => void;
  className?: string;
  placeholder?: string;
}

const getFilterIcon = (key: string) => {
  const icons: Record<string, React.ReactNode> = {
    vip: <Star className="w-3 h-3" />,
    ativo: <CheckCircle className="w-3 h-3" />,
    prospecto: <Users className="w-3 h-3" />,
    inadimplente: <DollarSign className="w-3 h-3" />,
    urgente: <AlertTriangle className="w-3 h-3" />,
    atrasada: <Clock className="w-3 h-3" />,
    "prazo-hoje": <AlertTriangle className="w-3 h-3" />,
    pendente: <Clock className="w-3 h-3" />,
    juridica: <Scale className="w-3 h-3" />,
    comercial: <DollarSign className="w-3 h-3" />,
  };

  return icons[key] || <Filter className="w-3 h-3" />;
};

export const StickyFilterBar: React.FC<StickyFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  quickFilters,
  onToggleFilter,
  onClearAll,
  className = "",
  placeholder = "Buscar...",
}) => {
  const activeFiltersCount = quickFilters.filter((f) => f.active).length;
  const hasActiveFilters = activeFiltersCount > 0 || searchQuery.length > 0;

  return (
    <div
      className={`
      sticky top-0 z-40 bg-white border-b border-gray-200
      ${className}
    `}
    >
      <div className="px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Busca principal */}
          <div className="flex-grow max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-10 h-9 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0.5 rounded hover:bg-gray-100"
                >
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Filtros rápidos */}
          <div className="flex items-center gap-2 flex-wrap">
            <AnimatePresence>
              {quickFilters.map((filter) => (
                <motion.div
                  key={filter.key}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <Button
                    variant={filter.active ? "default" : "outline"}
                    size="sm"
                    onClick={() => onToggleFilter(filter.key)}
                    className={`
                      h-8 px-3 text-xs font-medium
                      ${
                        filter.active
                          ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                      }
                      transition-all duration-150
                    `}
                  >
                    <span className="mr-1.5">{getFilterIcon(filter.key)}</span>
                    {filter.label}
                    {filter.count !== undefined && (
                      <Badge
                        variant="secondary"
                        className={`
                          ml-1.5 h-4 px-1.5 text-xs
                          ${
                            filter.active
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-600"
                          }
                        `}
                      >
                        {filter.count}
                      </Badge>
                    )}
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Separador */}
          {quickFilters.length > 0 && <div className="w-px h-6 bg-gray-200" />}

          {/* Filtros avançados */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs text-gray-600 hover:text-gray-800"
            title="Filtros avançados"
          >
            <SlidersHorizontal className="w-3 h-3 mr-1.5" />
            Filtros
          </Button>

          {/* Botão limpar tudo */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAll}
                  className="h-8 px-3 text-xs text-gray-500 hover:text-gray-700"
                  title="Limpar todos os filtros"
                >
                  <RotateCcw className="w-3 h-3 mr-1.5" />
                  Limpar
                  {activeFiltersCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1.5 h-4 px-1.5 text-xs"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default StickyFilterBar;
