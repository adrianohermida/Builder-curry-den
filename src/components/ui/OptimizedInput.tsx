/**
 * OPTIMIZED INPUT COMPONENT V2
 * Standardized input following design system
 * Focus: Performance, Accessibility, User Experience
 */

import React, { forwardRef, useMemo, useState, useCallback } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

// ===== TYPES =====
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  description?: string;
  error?: string;
  success?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outlined" | "filled";
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  iconPosition?: "left" | "right";
  showPasswordToggle?: boolean;
  loading?: boolean;
}

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  error?: string;
  success?: string;
  resize?: "none" | "vertical" | "horizontal" | "both";
  loading?: boolean;
}

// ===== INPUT COMPONENT =====
const OptimizedInput = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      description,
      error,
      success,
      size = "md",
      variant = "default",
      icon: Icon,
      iconPosition = "left",
      showPasswordToggle = false,
      loading = false,
      type = "text",
      className = "",
      style,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // ===== COMPUTED STYLES =====
    const containerStyles = useMemo(
      () => ({
        display: "flex",
        flexDirection: "column" as const,
        gap: "var(--spacing-xs)",
        width: "100%",
      }),
      [],
    );

    const labelStyles = useMemo(
      () => ({
        fontSize: "0.875rem",
        fontWeight: "500",
        color: error ? "var(--color-error)" : "var(--text-primary)",
        marginBottom: "var(--spacing-xs)",
      }),
      [error],
    );

    const inputWrapperStyles = useMemo(() => {
      const baseStyles = {
        position: "relative" as const,
        display: "flex",
        alignItems: "center",
        transition: "all var(--duration-normal) var(--easing-default)",
        borderRadius: "var(--radius-md)",
      };

      // Size styles
      const sizeStyles = {
        sm: { minHeight: "2rem" },
        md: { minHeight: "2.5rem" },
        lg: { minHeight: "3rem" },
      };

      // Variant styles
      const variantStyles = {
        default: {
          backgroundColor: "var(--surface-primary)",
          border: `1px solid ${
            error
              ? "var(--color-error)"
              : success
                ? "var(--color-success)"
                : isFocused
                  ? "var(--primary-500)"
                  : "var(--border-primary)"
          }`,
          boxShadow: isFocused
            ? `0 0 0 3px ${
                error ? "rgba(239, 68, 68, 0.1)" : "rgba(59, 130, 246, 0.1)"
              }`
            : "none",
        },
        outlined: {
          backgroundColor: "transparent",
          border: `2px solid ${
            error
              ? "var(--color-error)"
              : success
                ? "var(--color-success)"
                : isFocused
                  ? "var(--primary-500)"
                  : "var(--border-primary)"
          }`,
        },
        filled: {
          backgroundColor: "var(--surface-secondary)",
          border: "1px solid transparent",
          borderBottomColor: error
            ? "var(--color-error)"
            : success
              ? "var(--color-success)"
              : isFocused
                ? "var(--primary-500)"
                : "var(--border-primary)",
        },
      };

      return {
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
      };
    }, [variant, size, error, success, isFocused]);

    const inputStyles = useMemo(() => {
      const paddingLeft =
        Icon && iconPosition === "left" ? "2.5rem" : "var(--spacing-md)";
      const paddingRight =
        (showPasswordToggle && type === "password") ||
        (Icon && iconPosition === "right")
          ? "2.5rem"
          : "var(--spacing-md)";

      return {
        width: "100%",
        height: "100%",
        padding: `var(--spacing-sm) ${paddingRight} var(--spacing-sm) ${paddingLeft}`,
        backgroundColor: "transparent",
        border: "none",
        outline: "none",
        color: "var(--text-primary)",
        fontSize:
          size === "sm" ? "0.75rem" : size === "lg" ? "1rem" : "0.875rem",
        fontFamily: "inherit",
        borderRadius: "var(--radius-md)",
      };
    }, [Icon, iconPosition, showPasswordToggle, type, size]);

    const iconStyles = useMemo(
      () => ({
        position: "absolute" as const,
        top: "50%",
        transform: "translateY(-50%)",
        color: error
          ? "var(--color-error)"
          : success
            ? "var(--color-success)"
            : "var(--text-tertiary)",
        pointerEvents: "none" as const,
        zIndex: 1,
      }),
      [error, success],
    );

    const leftIconStyles = useMemo(
      () => ({
        ...iconStyles,
        left: "var(--spacing-sm)",
      }),
      [iconStyles],
    );

    const rightIconStyles = useMemo(
      () => ({
        ...iconStyles,
        right: "var(--spacing-sm)",
        pointerEvents: showPasswordToggle
          ? ("auto" as const)
          : ("none" as const),
        cursor: showPasswordToggle ? "pointer" : "default",
      }),
      [iconStyles, showPasswordToggle],
    );

    // ===== HANDLERS =====
    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        props.onFocus?.(e);
      },
      [props],
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        props.onBlur?.(e);
      },
      [props],
    );

    const togglePasswordVisibility = useCallback(() => {
      setShowPassword((prev) => !prev);
    }, []);

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

    // ===== VALIDATION ICON =====
    const ValidationIcon = useMemo(() => {
      if (loading) {
        return (
          <div
            style={{
              ...rightIconStyles,
              right: showPasswordToggle ? "2.5rem" : "var(--spacing-sm)",
            }}
          >
            <div
              style={{
                width: `${iconSize}px`,
                height: `${iconSize}px`,
                border: "2px solid transparent",
                borderTop: "2px solid currentColor",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
          </div>
        );
      }

      if (error) {
        return (
          <div
            style={{
              ...rightIconStyles,
              right: showPasswordToggle ? "2.5rem" : "var(--spacing-sm)",
            }}
          >
            <AlertCircle size={iconSize} />
          </div>
        );
      }

      if (success) {
        return (
          <div
            style={{
              ...rightIconStyles,
              right: showPasswordToggle ? "2.5rem" : "var(--spacing-sm)",
            }}
          >
            <CheckCircle size={iconSize} />
          </div>
        );
      }

      return null;
    }, [
      loading,
      error,
      success,
      rightIconStyles,
      showPasswordToggle,
      iconSize,
    ]);

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
        <div
          style={containerStyles}
          className={`optimized-input-container ${className}`}
        >
          {/* Label */}
          {label && (
            <label style={labelStyles} htmlFor={props.id}>
              {label}
              {props.required && (
                <span
                  style={{ color: "var(--color-error)", marginLeft: "2px" }}
                >
                  *
                </span>
              )}
            </label>
          )}

          {/* Input Wrapper */}
          <div style={inputWrapperStyles}>
            {/* Left Icon */}
            {Icon && iconPosition === "left" && (
              <div style={leftIconStyles}>
                <Icon size={iconSize} />
              </div>
            )}

            {/* Input */}
            <input
              ref={ref}
              type={showPasswordToggle && showPassword ? "text" : type}
              style={inputStyles}
              disabled={disabled || loading}
              onFocus={handleFocus}
              onBlur={handleBlur}
              aria-invalid={!!error}
              aria-describedby={
                error || success || description
                  ? `${props.id}-feedback`
                  : undefined
              }
              {...props}
            />

            {/* Right Icon */}
            {Icon && iconPosition === "right" && !showPasswordToggle && (
              <div style={rightIconStyles}>
                <Icon size={iconSize} />
              </div>
            )}

            {/* Password Toggle */}
            {showPasswordToggle && type === "password" && (
              <button
                type="button"
                style={rightIconStyles}
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={iconSize} />
                ) : (
                  <Eye size={iconSize} />
                )}
              </button>
            )}

            {/* Validation Icon */}
            {ValidationIcon}
          </div>

          {/* Description/Error/Success */}
          {(description || error || success) && (
            <div
              id={`${props.id}-feedback`}
              style={{
                fontSize: "0.75rem",
                color: error
                  ? "var(--color-error)"
                  : success
                    ? "var(--color-success)"
                    : "var(--text-secondary)",
                lineHeight: 1.4,
              }}
            >
              {error || success || description}
            </div>
          )}
        </div>
      </>
    );
  },
);

// ===== TEXTAREA COMPONENT =====
const OptimizedTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      description,
      error,
      success,
      resize = "vertical",
      loading = false,
      className = "",
      style,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const containerStyles = useMemo(
      () => ({
        display: "flex",
        flexDirection: "column" as const,
        gap: "var(--spacing-xs)",
        width: "100%",
      }),
      [],
    );

    const labelStyles = useMemo(
      () => ({
        fontSize: "0.875rem",
        fontWeight: "500",
        color: error ? "var(--color-error)" : "var(--text-primary)",
        marginBottom: "var(--spacing-xs)",
      }),
      [error],
    );

    const textareaStyles = useMemo(
      () => ({
        width: "100%",
        minHeight: "5rem",
        padding: "var(--spacing-sm) var(--spacing-md)",
        backgroundColor: "var(--surface-primary)",
        border: `1px solid ${
          error
            ? "var(--color-error)"
            : success
              ? "var(--color-success)"
              : isFocused
                ? "var(--primary-500)"
                : "var(--border-primary)"
        }`,
        borderRadius: "var(--radius-md)",
        outline: "none",
        color: "var(--text-primary)",
        fontSize: "0.875rem",
        fontFamily: "inherit",
        lineHeight: 1.5,
        resize,
        transition: "all var(--duration-normal) var(--easing-default)",
        boxShadow: isFocused
          ? `0 0 0 3px ${
              error ? "rgba(239, 68, 68, 0.1)" : "rgba(59, 130, 246, 0.1)"
            }`
          : "none",
        ...style,
      }),
      [error, success, isFocused, resize, style],
    );

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setIsFocused(true);
        props.onFocus?.(e);
      },
      [props],
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setIsFocused(false);
        props.onBlur?.(e);
      },
      [props],
    );

    return (
      <div
        style={containerStyles}
        className={`optimized-textarea-container ${className}`}
      >
        {/* Label */}
        {label && (
          <label style={labelStyles} htmlFor={props.id}>
            {label}
            {props.required && (
              <span style={{ color: "var(--color-error)", marginLeft: "2px" }}>
                *
              </span>
            )}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          style={textareaStyles}
          disabled={disabled || loading}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-invalid={!!error}
          aria-describedby={
            error || success || description ? `${props.id}-feedback` : undefined
          }
          {...props}
        />

        {/* Description/Error/Success */}
        {(description || error || success) && (
          <div
            id={`${props.id}-feedback`}
            style={{
              fontSize: "0.75rem",
              color: error
                ? "var(--color-error)"
                : success
                  ? "var(--color-success)"
                  : "var(--text-secondary)",
              lineHeight: 1.4,
            }}
          >
            {error || success || description}
          </div>
        )}
      </div>
    );
  },
);

// ===== MEMOIZED EXPORTS =====
const OptimizedInputMemo = React.memo(OptimizedInput);
const OptimizedTextareaMemo = React.memo(OptimizedTextarea);

OptimizedInputMemo.displayName = "OptimizedInput";
OptimizedTextareaMemo.displayName = "OptimizedTextarea";

export default OptimizedInputMemo;
export { OptimizedTextareaMemo as Textarea };
