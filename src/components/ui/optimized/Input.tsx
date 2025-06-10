/**
 * 📝 INPUT COMPONENT - OTIMIZADO PARA SAAS 2025+
 *
 * Input moderno com:
 * - Variants semânticas
 * - Estados visuais claros
 * - Acessibilidade completa
 * - Performance otimizada
 * - Feedback visual imediato
 */

import React, { forwardRef, InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ===== INPUT VARIANTS =====
const inputVariants = cva(
  // Base styles
  "flex w-full rounded-lg border bg-white px-3 py-2 text-sm transition-colors duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        // Default - Estilo padrão
        default:
          "border-gray-300 focus-visible:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)]/20",

        // Error - Para campos com erro
        error:
          "border-red-300 bg-red-50 focus-visible:border-red-500 focus-visible:ring-red-500/20",

        // Success - Para campos validados
        success:
          "border-green-300 bg-green-50 focus-visible:border-green-500 focus-visible:ring-green-500/20",

        // Warning - Para campos com aviso
        warning:
          "border-yellow-300 bg-yellow-50 focus-visible:border-yellow-500 focus-visible:ring-yellow-500/20",

        // Ghost - Sem borda visível
        ghost:
          "border-transparent bg-gray-50 hover:bg-gray-100 focus-visible:bg-white focus-visible:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)]/20",
      },
      size: {
        sm: "h-8 px-2.5 text-xs", // 32px height
        md: "h-10 px-3 text-sm", // 40px height - padrão
        lg: "h-12 px-4 text-base", // 48px height
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

// ===== TYPES =====
export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  error?: string;
  helperText?: string;
  label?: string;
  required?: boolean;
}

// ===== LOADING SPINNER =====
const LoadingSpinner = () => (
  <svg
    className="h-4 w-4 animate-spin text-gray-400"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// ===== INPUT COMPONENT =====
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      type = "text",
      leftIcon,
      rightIcon,
      loading = false,
      error,
      helperText,
      label,
      required = false,
      id,
      ...props
    },
    ref,
  ) => {
    // Auto-generate ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Determine variant based on error state
    const effectiveVariant = error ? "error" : variant;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-gray-400">{leftIcon}</div>
            </div>
          )}

          {/* Input */}
          <input
            id={inputId}
            type={type}
            className={cn(
              inputVariants({ variant: effectiveVariant, size }),
              leftIcon && "pl-10",
              (rightIcon || loading) && "pr-10",
              className,
            )}
            ref={ref}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            {...props}
          />

          {/* Right Icon / Loading */}
          {(rightIcon || loading) && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {loading ? (
                <LoadingSpinner />
              ) : (
                <div className="text-gray-400">{rightIcon}</div>
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-red-600 flex items-center gap-1"
            role="alert"
          >
            <span className="text-red-500">⚠</span>
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-gray-600">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

// ===== SPECIALIZED INPUT COMPONENTS =====

// Search Input
export interface SearchInputProps
  extends Omit<InputProps, "leftIcon" | "type"> {
  onClear?: () => void;
  clearable?: boolean;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, clearable = true, value, className, ...props }, ref) => {
    const handleClear = () => {
      if (onClear) {
        onClear();
      }
    };

    return (
      <Input
        ref={ref}
        type="search"
        leftIcon={
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
        rightIcon={
          clearable && value ? (
            <button
              type="button"
              onClick={handleClear}
              className="hover:text-gray-600 transition-colors"
              aria-label="Limpar busca"
            >
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          ) : undefined
        }
        value={value}
        className={className}
        {...props}
      />
    );
  },
);
SearchInput.displayName = "SearchInput";

// ===== EXPORTS =====
export {
  Input,
  SearchInput,
  inputVariants,
  type InputProps,
  type SearchInputProps,
};
export default Input;
