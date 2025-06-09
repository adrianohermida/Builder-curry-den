import React, { Suspense, ErrorBoundary } from "react";
import { BarChart3, TrendingUp, PieChart, Activity } from "lucide-react";

interface ChartErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ChartErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ChartErrorBoundaryState
> {
  constructor(props: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ChartErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Chart Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ChartErrorFallback />;
    }

    return this.props.children;
  }
}

const ChartErrorFallback: React.FC = () => (
  <div className="w-full h-[200px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
    <div className="text-center">
      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-600">Erro ao carregar gráfico</p>
      <button
        onClick={() => window.location.reload()}
        className="text-xs text-blue-600 hover:text-blue-800 mt-1"
      >
        Tentar novamente
      </button>
    </div>
  </div>
);

const ChartLoadingFallback: React.FC = () => (
  <div className="w-full h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
      <p className="text-sm text-gray-600">Carregando gráfico...</p>
    </div>
  </div>
);

interface SafeChartProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
  className?: string;
}

export const SafeChart: React.FC<SafeChartProps> = ({
  children,
  fallback,
  loading = <ChartLoadingFallback />,
  className = "",
}) => {
  return (
    <div className={`safe-chart-container ${className}`}>
      <ChartErrorBoundary fallback={fallback}>
        <Suspense fallback={loading}>{children}</Suspense>
      </ChartErrorBoundary>
    </div>
  );
};

// Simple chart placeholders for when Recharts fails
interface SimpleChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: SimpleChartData[];
  title?: string;
  height?: number;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
  data,
  title,
  height = 200,
}) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="w-full p-4" style={{ height }}>
      {title && (
        <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
      )}
      <div className="flex items-end justify-between h-full space-x-2">
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 60);
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="w-full flex flex-col items-center">
                <div className="text-xs text-gray-600 mb-1">{item.value}</div>
                <div
                  className={`w-full rounded-t ${item.color || "bg-blue-500"} transition-all hover:opacity-80`}
                  style={{ height: `${barHeight}px`, minHeight: "4px" }}
                />
                <div className="text-xs text-gray-500 mt-2 text-center">
                  {item.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface SimpleLineChartProps {
  data: SimpleChartData[];
  title?: string;
  height?: number;
}

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({
  data,
  title,
  height = 200,
}) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue;

  const points = data
    .map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((item.value - minValue) / range) * 80;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="w-full p-4" style={{ height }}>
      {title && (
        <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
      )}
      <div className="relative w-full h-full">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polyline
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            points={points}
            className="transition-all"
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((item.value - minValue) / range) * 80;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="#3B82F6"
                className="hover:r-4 transition-all"
              >
                <title>{`${item.label}: ${item.value}`}</title>
              </circle>
            );
          })}
        </svg>
        <div className="flex justify-between mt-2">
          {data.map((item, index) => (
            <span key={index} className="text-xs text-gray-500">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend = "neutral",
  icon: Icon = BarChart3,
  color = "text-blue-600",
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "↗";
      case "down":
        return "↘";
      default:
        return "→";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                {getTrendIcon()} {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-gray-50`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );
};

// Export safe chart utilities
export { ChartErrorBoundary, ChartErrorFallback, ChartLoadingFallback };
