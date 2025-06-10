/**
 * FormField Molecule
 *
 * A complete form field component that combines label, input, and validation
 * messages into a cohesive unit. Provides consistent form styling and behavior.
 */

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Label } from "../../atoms/Label";
import { Input, type InputProps } from "../../atoms/Input";

export interface FormFieldProps extends Omit<InputProps, "id"> {
  /**
   * Unique identifier for the field
   */
  id?: string;
  /**
   * Field label
   */
  label?: string;
  /**
   * Helper text to display below the input
   */
  helperText?: string;
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
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Additional className for the field container
   */
  containerClassName?: string;
  /**
   * Whether to show the field inline
   */
  inline?: boolean;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      id,
      label,
      helperText,
      error,
      success,
      warning,
      required,
      containerClassName,
      inline = false,
      className,
      ...inputProps
    },
    ref,
  ) => {
    const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;
    const hasValidationMessage = error || success || warning;

    return (
      <div
        className={cn(
          "space-y-2",
          {
            "flex items-center space-y-0 space-x-3": inline,
          },
          containerClassName,
        )}
      >
        {label && (
          <Label
            htmlFor={fieldId}
            required={required}
            variant={error ? "error" : success ? "success" : "default"}
            className={cn({
              "min-w-0 flex-shrink-0": inline,
            })}
          >
            {label}
          </Label>
        )}

        <div className={cn({ "flex-1": inline })}>
          <Input
            id={fieldId}
            ref={ref}
            variant={
              error
                ? "error"
                : success
                  ? "success"
                  : warning
                    ? "warning"
                    : "default"
            }
            className={className}
            {...inputProps}
          />

          {/* Validation and helper messages */}
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
      </div>
    );
  },
);

FormField.displayName = "FormField";

export { FormField };
export type { FormFieldProps };
