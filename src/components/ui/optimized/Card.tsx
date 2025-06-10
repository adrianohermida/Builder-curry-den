/**
 * 🃏 CARD COMPONENT - OTIMIZADO PARA SAAS 2025+
 *
 * Card moderno e flexível com:
 * - Design minimalista
 * - Variants para diferentes contextos
 * - Performance otimizada
 * - Acessibilidade completa
 * - Responsive design
 */

import React, { forwardRef, HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ===== CARD VARIANTS =====
const cardVariants = cva(
  // Base styles
  "rounded-lg border bg-white text-gray-900 transition-colors duration-150",
  {
    variants: {
      variant: {
        // Default - Card padrão
        default: "border-gray-200 shadow-sm",

        // Outlined - Apenas borda
        outlined: "border-gray-200 shadow-none",

        // Elevated - Com sombra elevada
        elevated: "border-gray-200 shadow-md",

        // Interactive - Hover states
        interactive:
          "border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 cursor-pointer",

        // Danger - Para alertas/erros
        danger: "border-red-200 bg-red-50 text-red-900",

        // Warning - Para avisos
        warning: "border-yellow-200 bg-yellow-50 text-yellow-900",

        // Success - Para sucessos
        success: "border-green-200 bg-green-50 text-green-900",

        // Info - Para informações
        info: "border-blue-200 bg-blue-50 text-blue-900",

        // Glass - Efeito glassmorphism sutil
        glass: "border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm",
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      spacing: {
        none: "",
        tight: "space-y-2",
        normal: "space-y-4",
        loose: "space-y-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      spacing: "normal",
    },
  },
);

// ===== TYPES =====
export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// ===== CARD COMPONENTS =====
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, spacing, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, size, spacing }), className)}
      {...props}
    >
      {children}
    </div>
  ),
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5", className)}
      {...props}
    >
      {children}
    </div>
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-semibold leading-none tracking-tight text-lg",
      className,
    )}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 leading-relaxed", className)}
    {...props}
  >
    {children}
  </p>
));
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props}>
      {children}
    </div>
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between pt-4 border-t border-gray-100",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
CardFooter.displayName = "CardFooter";

// ===== SPECIALIZED CARD COMPONENTS =====

// Stats Card - Para métricas e KPIs
export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: "increase" | "decrease" | "neutral";
  };
  icon?: React.ReactNode;
  className?: string;
}

const StatsCard = forwardRef<HTMLDivElement, StatsCardProps>(
  ({ title, value, change, icon, className }, ref) => {
    const changeColors = {
      increase: "text-green-600 bg-green-50",
      decrease: "text-red-600 bg-red-50",
      neutral: "text-gray-600 bg-gray-50",
    };

    return (
      <Card ref={ref} variant="default" className={cn("", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {change && (
                <div className="flex items-center mt-2">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                      changeColors[change.type],
                    )}
                  >
                    {change.value}
                  </span>
                </div>
              )}
            </div>
            {icon && (
              <div className="flex-shrink-0 ml-4">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
                  {icon}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  },
);
StatsCard.displayName = "StatsCard";

// Info Card - Para informações importantes
export interface InfoCardProps {
  type: "info" | "success" | "warning" | "danger";
  title: string;
  description: string;
  action?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const InfoCard = forwardRef<HTMLDivElement, InfoCardProps>(
  (
    { type, title, description, action, dismissible, onDismiss, className },
    ref,
  ) => {
    const typeConfig = {
      info: { variant: "info" as const, icon: "ℹ️" },
      success: { variant: "success" as const, icon: "✅" },
      warning: { variant: "warning" as const, icon: "⚠️" },
      danger: { variant: "danger" as const, icon: "❌" },
    };

    const config = typeConfig[type];

    return (
      <Card ref={ref} variant={config.variant} className={cn("", className)}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <span className="text-lg leading-none">{config.icon}</span>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium mb-1">{title}</h4>
                <p className="text-sm opacity-90">{description}</p>
                {action && <div className="mt-3">{action}</div>}
              </div>
            </div>
            {dismissible && (
              <button
                onClick={onDismiss}
                className="ml-4 flex-shrink-0 text-sm opacity-60 hover:opacity-100 transition-opacity"
                aria-label="Fechar"
              >
                ✕
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  },
);
InfoCard.displayName = "InfoCard";

// ===== EXPORTS =====
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  StatsCard,
  InfoCard,
  cardVariants,
  type CardProps,
  type StatsCardProps,
  type InfoCardProps,
};

export default Card;
