/**
 * 🔘 BUTTON COMPONENT - OTIMIZADO PARA SAAS 2025+
 *
 * Botão optimizado com:
 * - Performance máxima
 * - Acessibilidade completa
 * - Design system tokens
 * - Variants semânticas
 * - Estados visuais claros
 */

import React, { forwardRef, ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ===== BUTTON VARIANTS =====
const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary - Cor do modo (azul cliente / vermelho admin)
        primary:
          "bg-[var(--color-primary)] text-white shadow-sm hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)] focus-visible:ring-[var(--color-primary)]",

        // Secondary - Cinza neutro
        secondary:
          "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200 active:bg-gray-300 focus-visible:ring-gray-500",

        // Outline - Apenas borda
        outline:
          "border border-[var(--color-border)] bg-transparent text-gray-900 shadow-sm hover:bg-gray-50 active:bg-gray-100 focus-visible:ring-[var(--color-primary)]",

        // Ghost - Transparente
        ghost:
          "bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-gray-500",

        // Destructive - Vermelho para ações perigosas
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-600",

        // Success - Verde para ações positivas
        success:
          "bg-green-600 text-white shadow-sm hover:bg-green-700 active:bg-green-800 focus-visible:ring-green-600",

        // Warning - Amarelo para atenção
        warning:
          "bg-yellow-500 text-white shadow-sm hover:bg-yellow-600 active:bg-yellow-700 focus-visible:ring-yellow-500",

        // Link - Estilo de link
        link: "text-[var(--color-primary)] underline-offset-4 hover:underline focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-0",
      },
      size: {
        xs: "h-7 px-2.5 text-xs", // 28px height
        sm: "h-8 px-3 text-xs", // 32px height
        md: "h-10 px-4 text-sm", // 40px height - padrão
        lg: "h-11 px-6 text-base", // 44px height
        xl: "h-12 px-8 text-base", // 48px height
        icon: "h-10 w-10", // Quadrado para ícones
      },
      loading: {
        true: "cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      loading: false,
    },
  },
);

// ===== TYPES =====
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// ===== LOADING SPINNER =====
const LoadingSpinner = ({ size = "sm" }: { size?: "xs" | "sm" | "md" }) => {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
  };

  return (
    <svg
      className={cn("animate-spin", sizeClasses[size])}
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
};

// ===== BUTTON COMPONENT =====
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(
          buttonVariants({ variant, size, loading }),
          fullWidth && "w-full",
          className,
        )}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {/* Left Icon ou Loading */}
        {loading ? (
          <LoadingSpinner size={size === "xs" ? "xs" : "sm"} />
        ) : (
          leftIcon
        )}

        {/* Content */}
        {children}

        {/* Right Icon (apenas se não estiver loading) */}
        {!loading && rightIcon}
      </button>
    );
  },
);

Button.displayName = "Button";

// ===== EXPORTS =====
export { Button, buttonVariants, type ButtonProps };
export default Button;
