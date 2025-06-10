/**
 * Loading Fallbacks Components
 *
 * Consistent loading components for different scenarios
 */

import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingFallbackProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

interface DomainLoadingFallbackProps {
  domain: string;
  title?: string;
  description?: string;
}

// Global loading fallback for the entire app
export const GlobalLoadingFallback: React.FC<LoadingFallbackProps> = ({
  message = "Carregando sistema...",
  size = "lg",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <Loader2
          className={`${sizeClasses[size]} border-b-2 border-blue-600 mx-auto mb-4 animate-spin`}
        />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Lawdesk CRM
        </h3>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

// Domain-specific loading fallback
export const DomainLoadingFallback: React.FC<DomainLoadingFallbackProps> = ({
  domain,
  title,
  description,
}) => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <Loader2 className="h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4 animate-spin" />
        <p className="text-gray-600">
          Carregando {title || domain}
          {description && "..."}
        </p>
        {description && (
          <p className="text-sm text-gray-500 mt-2">{description}</p>
        )}
      </div>
    </div>
  );
};

// Page loading fallback
export const PageLoadingFallback: React.FC<LoadingFallbackProps> = ({
  message = "Carregando página...",
}) => {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <Loader2 className="h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2 animate-spin" />
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
};

// Component loading fallback (smaller)
export const ComponentLoadingFallback: React.FC<LoadingFallbackProps> = ({
  message = "Carregando...",
}) => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="text-center">
        <Loader2 className="h-4 w-4 border-b-2 border-blue-600 mx-auto mb-2 animate-spin" />
        <p className="text-xs text-gray-500">{message}</p>
      </div>
    </div>
  );
};

// Skeleton loading for lists
export const SkeletonLoadingFallback: React.FC<{ items?: number }> = ({
  items = 3,
}) => {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse flex space-x-4 p-4 bg-gray-100 rounded-lg"
        >
          <div className="rounded-full bg-gray-300 h-10 w-10"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 rounded"></div>
              <div className="h-3 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default {
  GlobalLoadingFallback,
  DomainLoadingFallback,
  PageLoadingFallback,
  ComponentLoadingFallback,
  SkeletonLoadingFallback,
};
