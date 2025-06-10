/**
 * OPTIMIZED BUTTON COMPONENT V2
 * Standardized button following design system
 * Focus: Performance, Accessibility, Consistency
 */

import React, { forwardRef, useMemo, useCallback } from "react";
import { performanceUtils } from "@/lib/performanceUtils";

// ===== TYPES =====
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "danger"
    | "success"
    | "warning";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

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
      className = "",
      style,
      ...props
    },
    ref,
  ) => {
    // ===== COMPUTED STYLES =====
    const buttonStyles = useMemo(() => {
      const baseStyles = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--spacing-xs)",
        border: "1px solid transparent",
        borderRadius: "var(--radius-md)",
        fontWeight: "500",
        textAlign: "center" as const,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        transition: "all var(--duration-normal) var(--easing-default)",
        position: "relative" as const,
        overflow: "hidden",
        textDecoration: "none",
        width: fullWidth ? "100%" : "auto",
        opacity: disabled ? 0.6 : 1,
      };

      // Size variants
      const sizeStyles = {
        sm: {
          padding: "var(--spacing-xs) var(--spacing-sm)",
          fontSize: "0.75rem",
          minHeight: "2rem",
        },
        md: {
          padding: "var(--spacing-sm) var(--spacing-md)",
          fontSize: "0.875rem",
          minHeight: "2.5rem",
        },
        lg: {
          padding: "var(--spacing-md) var(--spacing-lg)",
          fontSize: "1rem",
          minHeight: "3rem",
        },
      };

      // Variant styles
      const variantStyles = {
        primary: {
          backgroundColor: "var(--primary-500)",
          color: "white",
          borderColor: "var(--primary-500)",
        },
        secondary: {
          backgroundColor: "transparent",
          color: "var(--primary-600)",
          borderColor: "var(--border-primary)",
        },
        ghost: {
          backgroundColor: "transparent",
          color: "var(--text-secondary)",
          borderColor: "transparent",
        },
        danger: {
          backgroundColor: "var(--color-error)",
          color: "white",
          borderColor: "var(--color-error)",
        },
        success: {
          backgroundColor: "var(--color-success)",
          color: "white",
          borderColor: "var(--color-success)",
        },
        warning: {
          backgroundColor: "var(--color-warning)",
          color: "white",
          borderColor: "var(--color-warning)",
        },
      };

      return {
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      };
    }, [variant, size, disabled, loading, fullWidth, style]);

    // ===== HOVER STYLES =====
    const handleMouseEnter = useCallback(
      (e: React.MouseEvent) => {
        if (disabled || loading) return;

        const button = e.currentTarget as HTMLButtonElement;
        const variantHoverStyles = {
          primary: {
            backgroundColor: "var(--primary-600)",
            borderColor: "var(--primary-600)",
            transform: "translateY(-1px)",
            boxShadow: "var(--shadow-md)",
          },
          secondary: {
            backgroundColor: "var(--surface-secondary)",
            borderColor: "var(--border-accent)",
            color: "var(--text-primary)",
          },
          ghost: {
            backgroundColor: "var(--surface-secondary)",
            color: "var(--text-primary)",
          },
          danger: {
            backgroundColor: "#dc2626",
            borderColor: "#dc2626",
            transform: "translateY(-1px)",
            boxShadow: "var(--shadow-md)",
          },
          success: {
            backgroundColor: "#059669",
            borderColor: "#059669",
            transform: "translateY(-1px)",
            boxShadow: "var(--shadow-md)",
          },
          warning: {
            backgroundColor: "#d97706",
            borderColor: "#d97706",
            transform: "translateY(-1px)",
            boxShadow: "var(--shadow-md)",
          },
        };

        Object.assign(button.style, variantHoverStyles[variant]);
      },
      [variant, disabled, loading],
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent) => {
        if (disabled || loading) return;

        const button = e.currentTarget as HTMLButtonElement;
        Object.assign(button.style, buttonStyles);
      },
      [buttonStyles, disabled, loading],
    );

    // ===== LOADING SPINNER =====
    const LoadingSpinner = useMemo(() => {
      if (!loading) return null;

      return (
        <div
          style={{
            width: "16px",
            height: "16px",
            border: "2px solid transparent",
            borderTop: "2px solid currentColor",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
      );
    }, [loading]);

    // ===== ICON SIZE =====
    const iconSize = useMemo(() => {
      switch (size) {
        case "sm":
          return 14;
        case "lg":
          return 20;
        default:
          return 16;
      }
    }, [size]);

    // ===== RENDER =====
    return (
      <>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <button
          ref={ref}
          style={buttonStyles}
          className={`optimized-button ${className}`}
          disabled={disabled || loading}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-disabled={disabled || loading}
          {...props}
        >
          {loading && LoadingSpinner}

          {Icon && iconPosition === "left" && !loading && (
            <Icon size={iconSize} />
          )}

          {children && <span style={{ lineHeight: 1 }}>{children}</span>}

          {Icon && iconPosition === "right" && !loading && (
            <Icon size={iconSize} />
          )}
        </button>
      </>
    );
  },
);

// ===== MEMOIZED EXPORT =====
const OptimizedButtonMemo = React.memo(OptimizedButton);
OptimizedButtonMemo.displayName = "OptimizedButton";

export default OptimizedButtonMemo;

// Re-export for convenience
export { OptimizedButtonMemo as Button };
