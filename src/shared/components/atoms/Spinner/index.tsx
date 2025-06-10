/**
 * Spinner Atom
 *
 * A loading spinner component with different sizes and variants.
 * Used to indicate loading states throughout the application.
 */

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  "animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]",
  {
    variants: {
      size: {
        xs: "h-3 w-3 border",
        sm: "h-4 w-4 border",
        default: "h-5 w-5 border-2",
        lg: "h-6 w-6 border-2",
        xl: "h-8 w-8 border-2",
        "2xl": "h-10 w-10 border-2",
      },
      variant: {
        default: "text-primary",
        white: "text-white",
        muted: "text-muted-foreground",
        destructive: "text-destructive",
        success: "text-green-600",
        warning: "text-yellow-600",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  /**
   * Screen reader label for accessibility
   */
  label?: string;
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, label = "Loading", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(spinnerVariants({ size, variant }), className)}
        role="status"
        aria-label={label}
        {...props}
      >
        <span className="sr-only">{label}</span>
      </div>
    );
  },
);

Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
export type { SpinnerProps };

// Alias for backward compatibility
export { Spinner as LoadingSpinner };
