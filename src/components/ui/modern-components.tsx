import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Modern Card Component with enhanced animations and styling
interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "glass" | "gradient";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: boolean;
  clickable?: boolean;
}

export const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(
  (
    {
      className,
      variant = "default",
      padding = "md",
      hover = false,
      clickable = false,
      children,
      ...props
    },
    ref,
  ) => {
    const variants = {
      default: "bg-card border border-border",
      elevated:
        "bg-card border border-border shadow-lg hover:shadow-xl transition-shadow duration-300",
      glass: "bg-card/80 backdrop-blur-xl border border-border/50 shadow-lg",
      gradient:
        "bg-gradient-to-br from-card via-card to-muted border border-border",
    };

    const paddings = {
      none: "",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
      xl: "p-8",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-xl transition-all duration-300",
          variants[variant],
          paddings[padding],
          hover && "hover:shadow-md hover:-translate-y-1",
          clickable && "cursor-pointer select-none",
          className,
        )}
        initial={hover ? { y: 0, scale: 1 } : false}
        whileHover={
          hover
            ? {
                y: -2,
                scale: 1.01,
                transition: { duration: 0.2, ease: "easeOut" },
              }
            : undefined
        }
        whileTap={
          clickable
            ? {
                scale: 0.98,
                transition: { duration: 0.1 },
              }
            : undefined
        }
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);
ModernCard.displayName = "ModernCard";

// Modern Button Component with enhanced states and animations
interface ModernButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "gradient";
  size?: "default" | "sm" | "lg" | "icon" | "xs";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const ModernButton = React.forwardRef<
  HTMLButtonElement,
  ModernButtonProps
>(
  (
    {
      className,
      variant = "default",
      size = "default",
      loading = false,
      icon,
      iconPosition = "left",
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const variants = {
      default:
        "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md",
      outline:
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      gradient:
        "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg shadow-sm",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
      xs: "h-8 rounded-md px-2 text-xs",
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        disabled={disabled || loading}
        whileHover={
          !disabled && !loading
            ? {
                scale: 1.02,
                transition: { duration: 0.2, ease: "easeOut" },
              }
            : undefined
        }
        whileTap={
          !disabled && !loading
            ? {
                scale: 0.98,
                transition: { duration: 0.1 },
              }
            : undefined
        }
        {...props}
      >
        {loading && (
          <motion.div
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
        {icon && iconPosition === "left" && !loading && icon}
        {children}
        {icon && iconPosition === "right" && !loading && icon}
      </motion.button>
    );
  },
);
ModernButton.displayName = "ModernButton";

// Modern Input Component with enhanced styling and states
interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "filled" | "ghost";
  inputSize?: "default" | "sm" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  error?: boolean;
  success?: boolean;
}

export const ModernInput = React.forwardRef<HTMLInputElement, ModernInputProps>(
  (
    {
      className,
      variant = "default",
      inputSize = "default",
      type,
      icon,
      iconPosition = "left",
      error = false,
      success = false,
      ...props
    },
    ref,
  ) => {
    const variants = {
      default:
        "border border-input bg-background hover:border-ring focus:border-ring",
      filled: "border-0 bg-muted hover:bg-muted/80 focus:bg-background",
      ghost: "border-0 bg-transparent hover:bg-muted focus:bg-muted",
    };

    const sizes = {
      default: "h-10 px-3 py-2",
      sm: "h-9 px-3 py-1",
      lg: "h-12 px-4 py-3",
    };

    const inputClasses = cn(
      "flex w-full rounded-lg text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      variants[variant],
      sizes[inputSize],
      icon && iconPosition === "left" && "pl-10",
      icon && iconPosition === "right" && "pr-10",
      error && "border-destructive focus:border-destructive ring-destructive",
      success && "border-green-500 focus:border-green-500 ring-green-500",
      className,
    );

    if (icon) {
      return (
        <div className="relative">
          <input type={type} className={inputClasses} ref={ref} {...props} />
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 text-muted-foreground",
              iconPosition === "left" ? "left-3" : "right-3",
            )}
          >
            {icon}
          </div>
        </div>
      );
    }

    return <input type={type} className={inputClasses} ref={ref} {...props} />;
  },
);
ModernInput.displayName = "ModernInput";

// Modern Badge Component
interface ModernBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning"
    | "info";
  size?: "default" | "sm" | "lg";
  dot?: boolean;
  pulse?: boolean;
}

export const ModernBadge = React.forwardRef<HTMLDivElement, ModernBadgeProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      dot = false,
      pulse = false,
      children,
      ...props
    },
    ref,
  ) => {
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/80",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/80",
      outline: "text-foreground border border-input hover:bg-accent",
      success:
        "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300",
      warning:
        "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300",
      info: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300",
    };

    const sizes = {
      default: "px-2.5 py-0.5 text-xs",
      sm: "px-2 py-0.5 text-xs",
      lg: "px-3 py-1 text-sm",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 rounded-full font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          variants[variant],
          sizes[size],
          pulse && "animate-pulse",
          className,
        )}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        {...props}
      >
        {dot && (
          <div
            className={cn(
              "h-2 w-2 rounded-full",
              pulse && "animate-pulse",
              variant === "default" && "bg-primary-foreground",
              variant === "secondary" && "bg-secondary-foreground",
              variant === "destructive" && "bg-destructive-foreground",
              variant === "success" && "bg-green-600",
              variant === "warning" && "bg-yellow-600",
              variant === "info" && "bg-blue-600",
            )}
          />
        )}
        {children}
      </motion.div>
    );
  },
);
ModernBadge.displayName = "ModernBadge";

// Modern Loading Spinner
interface ModernSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "sm" | "lg";
  variant?: "default" | "primary" | "muted";
}

export const ModernSpinner = React.forwardRef<
  HTMLDivElement,
  ModernSpinnerProps
>(({ className, size = "default", variant = "default", ...props }, ref) => {
  const sizes = {
    default: "h-6 w-6",
    sm: "h-4 w-4",
    lg: "h-8 w-8",
  };

  const variants = {
    default: "text-foreground",
    primary: "text-primary",
    muted: "text-muted-foreground",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        sizes[size],
        variants[variant],
        className,
      )}
      {...props}
    />
  );
});
ModernSpinner.displayName = "ModernSpinner";

// Modern Skeleton Loader
interface ModernSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "circular" | "rectangular";
  animation?: "pulse" | "wave" | "none";
}

export const ModernSkeleton = React.forwardRef<
  HTMLDivElement,
  ModernSkeletonProps
>(
  (
    { className, variant = "default", animation = "pulse", children, ...props },
    ref,
  ) => {
    const variants = {
      default: "rounded-md",
      circular: "rounded-full",
      rectangular: "rounded-none",
    };

    const animations = {
      pulse: "animate-pulse",
      wave: "skeleton",
      none: "",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-muted",
          variants[variant],
          animations[animation],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
ModernSkeleton.displayName = "ModernSkeleton";

// Modern Notification Toast Component
interface ModernToastProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "success" | "warning" | "error" | "info";
  title?: string;
  description?: string;
  action?: React.ReactNode;
  onClose?: () => void;
}

export const ModernToast = React.forwardRef<HTMLDivElement, ModernToastProps>(
  (
    {
      className,
      variant = "default",
      title,
      description,
      action,
      onClose,
      children,
      ...props
    },
    ref,
  ) => {
    const variants = {
      default: "bg-background border border-border",
      success:
        "bg-green-50 border border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-800 dark:text-green-100",
      warning:
        "bg-yellow-50 border border-yellow-200 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-100",
      error:
        "bg-red-50 border border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-100",
      info: "bg-blue-50 border border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg p-4 pr-8 shadow-lg transition-all",
          variants[variant],
          className,
        )}
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        {...props}
      >
        <div className="grid gap-1">
          {title && <div className="text-sm font-semibold">{title}</div>}
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
          {children}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </motion.div>
    );
  },
);
ModernToast.displayName = "ModernToast";
