import React from "react";

interface SimpleLoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export const SimpleLoading: React.FC<SimpleLoadingProps> = ({
  size = "md",
  className = "",
  text = "Carregando...",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <div
          className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}
        />
        {text && <p className="text-sm text-gray-500">{text}</p>}
      </div>
    </div>
  );
};

// Loading específico para páginas
export const PageLoading: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p className="text-sm text-gray-600">Carregando página...</p>
    </div>
  </div>
);

// Loading específico para componentes
export const ComponentLoading: React.FC = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
  </div>
);
