/**
 * SearchBox Molecule
 *
 * A search input component with search icon, clear functionality,
 * and optional filters. Used for searching and filtering data.
 */

import React, { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { Input } from "../../atoms/Input";
import { Button } from "../../atoms/Button";

// Search icon component
const SearchIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

// Clear icon component
const ClearIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// Filter icon component
const FilterIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
    />
  </svg>
);

export interface SearchBoxProps {
  /**
   * Current search value
   */
  value?: string;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Callback fired when search value changes
   */
  onSearch?: (query: string) => void;
  /**
   * Callback fired when search is submitted
   */
  onSubmit?: (query: string) => void;
  /**
   * Callback fired when search is cleared
   */
  onClear?: () => void;
  /**
   * Whether to show clear button
   */
  showClear?: boolean;
  /**
   * Whether to show filter button
   */
  showFilter?: boolean;
  /**
   * Callback fired when filter button is clicked
   */
  onFilterClick?: () => void;
  /**
   * Whether search is loading
   */
  loading?: boolean;
  /**
   * Debounce delay in milliseconds
   */
  debounceDelay?: number;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Size variant
   */
  size?: "sm" | "default" | "lg";
}

const SearchBox: React.FC<SearchBoxProps> = ({
  value = "",
  placeholder = "Buscar...",
  onSearch,
  onSubmit,
  onClear,
  showClear = true,
  showFilter = false,
  onFilterClick,
  loading = false,
  debounceDelay = 300,
  className,
  size = "default",
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced search function
  const debouncedSearch = useCallback(
    (query: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        onSearch?.(query);
      }, debounceDelay);
    },
    [onSearch, debounceDelay],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    debouncedSearch(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(internalValue);
  };

  const handleClear = () => {
    setInternalValue("");
    onSearch?.("");
    onClear?.();
  };

  const showClearButton = showClear && internalValue.length > 0;

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative flex">
        <Input
          type="text"
          value={internalValue}
          onChange={handleChange}
          placeholder={placeholder}
          size={size}
          leftIcon={<SearchIcon />}
          rightIcon={
            <div className="flex items-center space-x-1">
              {showClearButton && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleClear}
                  className="h-6 w-6 hover:bg-transparent"
                >
                  <ClearIcon />
                </Button>
              )}
              {showFilter && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onFilterClick}
                  className="h-6 w-6 hover:bg-transparent"
                >
                  <FilterIcon />
                </Button>
              )}
            </div>
          }
          className="pr-16"
        />
      </div>
    </form>
  );
};

export { SearchBox };
export type { SearchBoxProps };
