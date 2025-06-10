/**
 * OPTIMIZED INPUT COMPONENT V3
 * Standardized input using TailwindCSS classes
 * Focus: Performance, Accessibility, User Experience
 */

import React, { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

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

// ===== VARIANT STYLES =====
const inputVariants = {
  default:
    "border border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500",
  outlined:
    "border-2 border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500",
  filled: "border-0 bg-gray-100 focus:bg-white focus:ring-blue-500",
};

const sizeVariants = {
  sm: "px-3 py-1.5 text-sm h-8",
  md: "px-3 py-2 text-sm h-10",
  lg: "px-4 py-3 text-base h-12",
};

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
      className,
      id,
      ...props
    },
    ref,
  ) => {
    // ===== STATE =====
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // ===== COMPUTED VALUES =====
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const inputType =
      showPasswordToggle && type === "password"
        ? showPassword
          ? "text"
          : "password"
        : type;

    const hasError = Boolean(error);
    const hasSuccess = Boolean(success);
    const hasIcon = Boolean(Icon);
    const hasPasswordToggle = showPasswordToggle && type === "password";

    // ===== ICON SIZE =====
    const iconSize = size === "sm" ? 14 : size === "lg" ? 20 : 16;

    // ===== COMPUTED CLASSES =====
    const containerClasses = cn("relative w-full");

    const inputClasses = cn(
      // Base styles
      "w-full rounded-lg transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-0",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "placeholder:text-gray-400",

      // Variant styles
      inputVariants[variant],

      // Size styles
      sizeVariants[size],

      // Icon padding
      hasIcon && iconPosition === "left" && "pl-10",
      hasIcon && iconPosition === "right" && "pr-10",
      hasPasswordToggle && "pr-10",
      hasIcon && hasPasswordToggle && "pr-16",

      // Error/Success states
      hasError && "border-red-500 focus:border-red-500 focus:ring-red-500",
      hasSuccess &&
        "border-green-500 focus:border-green-500 focus:ring-green-500",

      // Loading state
      loading && "opacity-60",

      className,
    );

    const labelClasses = cn(
      "block text-sm font-medium mb-1",
      hasError
        ? "text-red-700"
        : hasSuccess
          ? "text-green-700"
          : "text-gray-700",
    );

    // ===== RENDER =====
    return (
      <div className={containerClasses}>
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {Icon && iconPosition === "left" && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Icon
                size={iconSize}
                className={cn(
                  "transition-colors duration-200",
                  hasError
                    ? "text-red-500"
                    : hasSuccess
                      ? "text-green-500"
                      : "text-gray-400",
                  isFocused && !hasError && !hasSuccess && "text-blue-500",
                )}
              />
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={inputClasses}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          {/* Right Icon */}
          {Icon && iconPosition === "right" && !hasPasswordToggle && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Icon
                size={iconSize}
                className={cn(
                  "transition-colors duration-200",
                  hasError
                    ? "text-red-500"
                    : hasSuccess
                      ? "text-green-500"
                      : "text-gray-400",
                  isFocused && !hasError && !hasSuccess && "text-blue-500",
                )}
              />
            </div>
          )}

          {/* Loading Spinner */}
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 size={iconSize} className="animate-spin text-blue-500" />
            </div>
          )}

          {/* Password Toggle */}
          {hasPasswordToggle && !loading && (
            <button
              type="button"
              className={cn(
                "absolute top-1/2 transform -translate-y-1/2 p-1",
                "text-gray-400 hover:text-gray-600 transition-colors duration-200",
                Icon && iconPosition === "right" ? "right-8" : "right-3",
              )}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={iconSize} />
              ) : (
                <Eye size={iconSize} />
              )}
            </button>
          )}

          {/* Status Icons */}
          {hasError && !loading && !hasPasswordToggle && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <AlertCircle size={iconSize} className="text-red-500" />
            </div>
          )}

          {hasSuccess && !loading && !hasPasswordToggle && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <CheckCircle size={iconSize} className="text-green-500" />
            </div>
          )}
        </div>

        {/* Description */}
        {description && !error && !success && (
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} />
            {error}
          </p>
        )}

        {/* Success Message */}
        {success && (
          <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
            <CheckCircle size={14} />
            {success}
          </p>
        )}
      </div>
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
      className,
      id,
      ...props
    },
    ref,
  ) => {
    // ===== STATE =====
    const [isFocused, setIsFocused] = useState(false);

    // ===== COMPUTED VALUES =====
    const textareaId =
      id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);
    const hasSuccess = Boolean(success);

    // ===== COMPUTED CLASSES =====
    const textareaClasses = cn(
      // Base styles
      "w-full px-3 py-2 rounded-lg border border-gray-300 bg-white",
      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
      "transition-all duration-200",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "placeholder:text-gray-400",

      // Resize options
      resize === "none" && "resize-none",
      resize === "vertical" && "resize-y",
      resize === "horizontal" && "resize-x",
      resize === "both" && "resize",

      // Error/Success states
      hasError && "border-red-500 focus:border-red-500 focus:ring-red-500",
      hasSuccess &&
        "border-green-500 focus:border-green-500 focus:ring-green-500",

      // Loading state
      loading && "opacity-60",

      className,
    );

    const labelClasses = cn(
      "block text-sm font-medium mb-1",
      hasError
        ? "text-red-700"
        : hasSuccess
          ? "text-green-700"
          : "text-gray-700",
    );

    // ===== RENDER =====
    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label htmlFor={textareaId} className={labelClasses}>
            {label}
          </label>
        )}

        {/* Textarea */}
        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            className={textareaClasses}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          {/* Loading Spinner */}
          {loading && (
            <div className="absolute top-3 right-3">
              <Loader2 size={16} className="animate-spin text-blue-500" />
            </div>
          )}
        </div>

        {/* Description */}
        {description && !error && !success && (
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} />
            {error}
          </p>
        )}

        {/* Success Message */}
        {success && (
          <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
            <CheckCircle size={14} />
            {success}
          </p>
        )}
      </div>
    );
  },
);

// ===== DISPLAY NAMES =====
OptimizedInput.displayName = "OptimizedInput";
OptimizedTextarea.displayName = "OptimizedTextarea";

// ===== EXPORTS =====
export default OptimizedInput;
export { OptimizedTextarea };

// ===== COMPOUND EXPORTS =====
const Input = Object.assign(OptimizedInput, {
  Textarea: OptimizedTextarea,
});

export { Input };
