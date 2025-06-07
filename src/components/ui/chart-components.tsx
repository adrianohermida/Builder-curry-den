// Wrapper components for Recharts to prevent defaultProps warnings
import React from "react";
import {
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  Pie as RechartsPie,
  XAxisProps,
  YAxisProps,
  PieProps,
} from "recharts";

// Enhanced XAxis component with explicit defaults
export const XAxis: React.FC<XAxisProps> = ({
  type = "category",
  allowDataOverflow = false,
  allowDecimals = true,
  allowDuplicatedCategory = true,
  ...props
}) => (
  <RechartsXAxis
    type={type}
    allowDataOverflow={allowDataOverflow}
    allowDecimals={allowDecimals}
    allowDuplicatedCategory={allowDuplicatedCategory}
    {...props}
  />
);

// Enhanced YAxis component with explicit defaults
export const YAxis: React.FC<YAxisProps> = ({
  type = "number",
  allowDataOverflow = false,
  allowDecimals = true,
  allowDuplicatedCategory = true,
  ...props
}) => (
  <RechartsYAxis
    type={type}
    allowDataOverflow={allowDataOverflow}
    allowDecimals={allowDecimals}
    allowDuplicatedCategory={allowDuplicatedCategory}
    {...props}
  />
);

// Enhanced Pie component with explicit defaults
export const Pie: React.FC<PieProps> = ({
  cx = "50%",
  cy = "50%",
  outerRadius = 80,
  label = false,
  ...props
}) => (
  <RechartsPie
    cx={cx}
    cy={cy}
    outerRadius={outerRadius}
    label={label}
    {...props}
  />
);

// Chart container with consistent styling
interface ChartContainerProps {
  children: React.ReactNode;
  height?: number;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  height = 300,
  className = "",
}) => (
  <div className={`w-full ${className}`} style={{ height }}>
    {children}
  </div>
);

// Common chart props
export const chartDefaults = {
  margin: { top: 5, right: 30, left: 20, bottom: 5 },
  cartesianGrid: { strokeDasharray: "3 3" },
  tooltip: {
    contentStyle: {
      backgroundColor: "hsl(var(--background))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "var(--radius)",
    },
  },
};

// Utility function to format currency for tooltips
export const formatCurrency = (value: number): string => {
  return `R$ ${value.toLocaleString("pt-BR")}`;
};

// Utility function to format percentage for tooltips
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Custom legend component
interface ChartLegendProps {
  data: Array<{
    name: string;
    color: string;
    value?: number;
  }>;
  className?: string;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({
  data,
  className = "",
}) => (
  <div className={`grid grid-cols-2 gap-4 mt-4 ${className}`}>
    {data.map((item, index) => (
      <div key={index} className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: item.color }}
        />
        <span className="text-sm">{item.name}</span>
        {item.value && (
          <span className="text-sm font-medium ml-auto">{item.value}</span>
        )}
      </div>
    ))}
  </div>
);
