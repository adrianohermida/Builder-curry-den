/**
 * OPTIMIZED CARD COMPONENT V3
 * Standardized card using TailwindCSS classes
 * Focus: Performance, Accessibility, Visual Hierarchy
 */

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

// ===== TYPES =====
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "ghost";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  interactive?: boolean;
  loading?: boolean;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

// ===== VARIANT STYLES =====
const cardVariants = {
  default: "bg-white border border-gray-200 shadow-sm",
  elevated: "bg-white border border-gray-200 shadow-lg",
  outlined: "bg-white border-2 border-gray-300 shadow-none",
  ghost: "bg-transparent border-0 shadow-none",
};

const paddingVariants = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

// ===== MAIN CARD COMPONENT =====
const OptimizedCard = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      hover = false,
      interactive = false,
      loading = false,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    // ===== COMPUTED CLASSES =====
    const cardClasses = cn(
      // Base styles
      "rounded-lg transition-all duration-200",

      // Variant styles
      cardVariants[variant],

      // Padding
      paddingVariants[padding],

      // Interactive states
      hover && "hover:shadow-md",
      interactive && "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",

      // Loading state
      loading && "opacity-60 pointer-events-none",

      // Custom className
      className,
    );

    // ===== RENDER =====
    return (
      <div ref={ref} className={cardClasses} {...props}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
          </div>
        )}
        {children}
      </div>
    );
  },
);

// ===== CARD HEADER =====
const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, actions, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-start justify-between mb-4", className)}
        {...props}
      >
        <div className="min-w-0 flex-1">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {title}
            </h3>
          )}
          {subtitle && <p className="text-sm text-gray-600 mb-2">{subtitle}</p>}
          {children}
        </div>
        {actions && <div className="ml-4 flex-shrink-0">{actions}</div>}
      </div>
    );
  },
);

// ===== CARD CONTENT =====
const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("text-gray-700", className)} {...props} />
    );
  },
);

// ===== CARD FOOTER =====
const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between pt-4 mt-4 border-t border-gray-200",
          className,
        )}
        {...props}
      />
    );
  },
);

// ===== DISPLAY NAMES =====
OptimizedCard.displayName = "OptimizedCard";
CardHeader.displayName = "CardHeader";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";

// ===== EXPORTS =====
export default OptimizedCard;
export { CardHeader, CardContent, CardFooter };

// ===== COMPOUND COMPONENT =====
const Card = Object.assign(OptimizedCard, {
  Header: CardHeader,
  Content: CardContent,
  Footer: CardFooter,
});

export { Card };
