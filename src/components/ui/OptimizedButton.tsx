/**
 * OPTIMIZED BUTTON COMPONENT V3
 * Standardized button using TailwindCSS classes
 * Focus: Performance, Accessibility, Consistency
 */

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// ===== TYPES =====
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "danger"
    | "success"
    | "warning"
    | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

// ===== VARIANT STYLES =====
const buttonVariants = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border-blue-600",
  secondary:
    "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 border-gray-200",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 border-transparent",
  outline:
    "bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-blue-500 border-gray-300",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border-red-600",
  success:
    "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 border-green-600",
  warning:
    "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 border-yellow-600",
};

const sizeVariants = {
  sm: "px-3 py-1.5 text-sm h-8",
  md: "px-4 py-2 text-sm h-10",
  lg: "px-6 py-3 text-base h-12",
};

// ===== COMPONENT =====
const OptimizedButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon: Icon,
      iconPosition = "left",
      fullWidth = false,
      children,
      disabled,
      className,
      ...props
    },
    ref,
  ) => {
    // ===== COMPUTED CLASSES =====
    const buttonClasses = cn(
      // Base styles
      "inline-flex items-center justify-center gap-2",
      "font-medium rounded-lg border",
      "transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "active:scale-95",

      // Variant styles
      buttonVariants[variant],

      // Size styles
      sizeVariants[size],

      // Width
      fullWidth && "w-full",

      // Loading state
      loading && "pointer-events-none",

      // Custom className
      className,
    );

    // ===== ICON SIZE =====
    const iconSize = size === "sm" ? 14 : size === "lg" ? 20 : 16;

    // ===== RENDER =====
    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        {...props}
      >
        {/* Loading Spinner */}
        {loading && <Loader2 size={iconSize} className="animate-spin" />}

        {/* Left Icon */}
        {!loading && Icon && iconPosition === "left" && (
          <Icon size={iconSize} className="shrink-0" />
        )}

        {/* Button Text */}
        {children && (
          <span className={cn(loading && "opacity-70", !children && "sr-only")}>
            {children}
          </span>
        )}

        {/* Right Icon */}
        {!loading && Icon && iconPosition === "right" && (
          <Icon size={iconSize} className="shrink-0" />
        )}
      </button>
    );
  },
);

OptimizedButton.displayName = "OptimizedButton";

export default OptimizedButton;
