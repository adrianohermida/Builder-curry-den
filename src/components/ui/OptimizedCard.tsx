/**
 * OPTIMIZED CARD COMPONENT V2
 * Standardized card following design system
 * Focus: Performance, Accessibility, Visual Hierarchy
 */

import React, { forwardRef, useMemo } from "react";

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
      className = "",
      style,
      ...props
    },
    ref,
  ) => {
    // ===== COMPUTED STYLES =====
    const cardStyles = useMemo(() => {
      const baseStyles = {
        borderRadius: "var(--radius-lg)",
        transition: "all var(--duration-normal) var(--easing-default)",
        position: "relative" as const,
        overflow: "hidden",
        cursor: interactive ? "pointer" : "default",
      };

      // Variant styles
      const variantStyles = {
        default: {
          backgroundColor: "var(--surface-primary)",
          border: "1px solid var(--border-primary)",
          boxShadow: "var(--shadow-sm)",
        },
        elevated: {
          backgroundColor: "var(--surface-primary)",
          border: "1px solid var(--border-primary)",
          boxShadow: "var(--shadow-md)",
        },
        outlined: {
          backgroundColor: "transparent",
          border: "2px solid var(--border-primary)",
          boxShadow: "none",
        },
        ghost: {
          backgroundColor: "transparent",
          border: "none",
          boxShadow: "none",
        },
      };

      // Padding styles
      const paddingStyles = {
        none: { padding: "0" },
        sm: { padding: "var(--spacing-md)" },
        md: { padding: "var(--spacing-lg)" },
        lg: { padding: "var(--spacing-xl)" },
      };

      return {
        ...baseStyles,
        ...variantStyles[variant],
        ...paddingStyles[padding],
        ...style,
      };
    }, [variant, padding, interactive, style]);

    // ===== HOVER HANDLERS =====
    const handleMouseEnter = React.useCallback(
      (e: React.MouseEvent) => {
        if (!hover && !interactive) return;

        const card = e.currentTarget as HTMLDivElement;
        card.style.transform = "translateY(-2px)";
        card.style.boxShadow =
          variant === "ghost" ? "var(--shadow-sm)" : "var(--shadow-lg)";
      },
      [hover, interactive, variant],
    );

    const handleMouseLeave = React.useCallback(
      (e: React.MouseEvent) => {
        if (!hover && !interactive) return;

        const card = e.currentTarget as HTMLDivElement;
        card.style.transform = "translateY(0)";
        card.style.boxShadow =
          variant === "ghost" ? "none" : (cardStyles.boxShadow as string);
      },
      [hover, interactive, variant, cardStyles.boxShadow],
    );

    // ===== LOADING OVERLAY =====
    const LoadingOverlay = useMemo(() => {
      if (!loading) return null;

      return (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <div
            className="loading-skeleton"
            style={{ width: "60%", height: "20px" }}
          />
        </div>
      );
    }, [loading]);

    // ===== RENDER =====
    return (
      <div
        ref={ref}
        style={cardStyles}
        className={`optimized-card ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        {...props}
      >
        {LoadingOverlay}
        {children}
      </div>
    );
  },
);

// ===== CARD HEADER COMPONENT =====
const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    { title, subtitle, actions, children, className = "", style, ...props },
    ref,
  ) => {
    const headerStyles = useMemo(
      () => ({
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: "var(--spacing-md)",
        ...style,
      }),
      [style],
    );

    return (
      <div
        ref={ref}
        style={headerStyles}
        className={`card-header ${className}`}
        {...props}
      >
        <div style={{ flex: 1 }}>
          {title && (
            <h3
              style={{
                margin: 0,
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "var(--text-primary)",
                lineHeight: 1.4,
              }}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p
              style={{
                margin: "var(--spacing-xs) 0 0 0",
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </p>
          )}
          {children}
        </div>
        {actions && (
          <div style={{ marginLeft: "var(--spacing-md)" }}>{actions}</div>
        )}
      </div>
    );
  },
);

// ===== CARD CONTENT COMPONENT =====
const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className = "", style, ...props }, ref) => {
    const contentStyles = useMemo(
      () => ({
        fontSize: "0.875rem",
        lineHeight: 1.6,
        color: "var(--text-primary)",
        ...style,
      }),
      [style],
    );

    return (
      <div
        ref={ref}
        style={contentStyles}
        className={`card-content ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  },
);

// ===== CARD FOOTER COMPONENT =====
const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className = "", style, ...props }, ref) => {
    const footerStyles = useMemo(
      () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "var(--spacing-sm)",
        marginTop: "var(--spacing-lg)",
        paddingTop: "var(--spacing-md)",
        borderTop: "1px solid var(--border-primary)",
        ...style,
      }),
      [style],
    );

    return (
      <div
        ref={ref}
        style={footerStyles}
        className={`card-footer ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  },
);

// ===== MEMOIZED EXPORTS =====
const OptimizedCardMemo = React.memo(OptimizedCard);
const CardHeaderMemo = React.memo(CardHeader);
const CardContentMemo = React.memo(CardContent);
const CardFooterMemo = React.memo(CardFooter);

// Set display names
OptimizedCardMemo.displayName = "OptimizedCard";
CardHeaderMemo.displayName = "CardHeader";
CardContentMemo.displayName = "CardContent";
CardFooterMemo.displayName = "CardFooter";

// ===== COMPOUND COMPONENT =====
const Card = Object.assign(OptimizedCardMemo, {
  Header: CardHeaderMemo,
  Content: CardContentMemo,
  Footer: CardFooterMemo,
});

export default Card;
export {
  CardHeaderMemo as CardHeader,
  CardContentMemo as CardContent,
  CardFooterMemo as CardFooter,
};
