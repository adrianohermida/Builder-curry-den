/**
 * Input Atom - Migrated from existing UI component
 *
 * Enhanced version of the original input component with:
 * - Improved validation states
 * - Icon support
 * - Better accessibility
 * - Consistent with atomic design principles
 */

import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors",
  {
    variants: {
      variant: {
        default: "border-input",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-green-500 focus-visible:ring-green-500",
        warning: "border-yellow-500 focus-visible:ring-yellow-500",
      },
      size: {
        sm: "h-8 text-xs px-2",
        default: "h-10 text-sm px-3",
        lg: "h-12 text-base px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  /**
   * Icon to show before the input
   */
  leftIcon?: React.ReactNode;
  /**
   * Icon to show after the input
   */
  rightIcon?: React.ReactNode;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Success message to display
   */
  success?: string;
  /**
   * Warning message to display
   */
  warning?: string;
  /**
   * Helper text to display below the input
   */
  helperText?: string;
  /**
   * Label for the input
   */
  label?: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Container className for the entire field
   */
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      variant,
      size,
      leftIcon,
      rightIcon,
      error,
      success,
      warning,
      helperText,
      label,
      required,
      id,
      containerClassName,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Determine variant based on validation state
    const currentVariant = error
      ? "error"
      : success
        ? "success"
        : warning
          ? "warning"
          : variant;

    const hasIcons = leftIcon || rightIcon;
    const hasValidationMessage = error || success || warning;

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block",
              {
                "text-destructive": error,
                "text-green-600": success && !error,
                "text-yellow-600": warning && !error && !success,
              },
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            type={type}
            className={cn(
              inputVariants({ variant: currentVariant, size }),
              {
                "pl-10": leftIcon,
                "pr-10": rightIcon,
              },
              className,
            )}
            ref={ref}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Validation messages */}
        {error && (
          <p className="text-sm text-destructive mt-1" role="alert">
            {error}
          </p>
        )}

        {success && !error && (
          <p className="text-sm text-green-600 mt-1">{success}</p>
        )}

        {warning && !error && !success && (
          <p className="text-sm text-yellow-600 mt-1">{warning}</p>
        )}

        {helperText && !hasValidationMessage && (
          <p className="text-sm text-muted-foreground mt-1">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input, inputVariants };
export type { InputProps };
