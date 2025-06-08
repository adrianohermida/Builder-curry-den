// Enhanced Recharts components to avoid defaultProps warnings
// These components use JavaScript default parameters instead of defaultProps
import React from "react";
import {
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer as RechartsResponsiveContainer,
  AreaChart as RechartsAreaChart,
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  Line as RechartsLine,
  Area as RechartsArea,
  Bar as RechartsBar,
  Pie as RechartsPie,
  Cell as RechartsCell,
  XAxisProps,
  YAxisProps,
  CartesianGridProps,
  TooltipProps,
  ResponsiveContainerProps,
  AreaChartProps,
  LineChartProps,
  BarChartProps,
  PieChartProps,
  LineProps,
  AreaProps,
  BarProps,
  PieProps,
  CellProps,
} from "recharts";

// Enhanced XAxis with explicit defaults
export const XAxis: React.FC<XAxisProps> = ({
  type = "category",
  allowDataOverflow = false,
  allowDecimals = true,
  allowDuplicatedCategory = true,
  hide = false,
  mirror = false,
  reversed = false,
  ...props
}) => (
  <RechartsXAxis
    type={type}
    allowDataOverflow={allowDataOverflow}
    allowDecimals={allowDecimals}
    allowDuplicatedCategory={allowDuplicatedCategory}
    hide={hide}
    mirror={mirror}
    reversed={reversed}
    {...props}
  />
);

// Enhanced YAxis with explicit defaults
export const YAxis: React.FC<YAxisProps> = ({
  type = "number",
  allowDataOverflow = false,
  allowDecimals = true,
  allowDuplicatedCategory = true,
  hide = false,
  mirror = false,
  reversed = false,
  ...props
}) => (
  <RechartsYAxis
    type={type}
    allowDataOverflow={allowDataOverflow}
    allowDecimals={allowDecimals}
    allowDuplicatedCategory={allowDuplicatedCategory}
    hide={hide}
    mirror={mirror}
    reversed={reversed}
    {...props}
  />
);

// Enhanced CartesianGrid with explicit defaults
export const CartesianGrid: React.FC<CartesianGridProps> = ({
  horizontal = true,
  vertical = true,
  horizontalPoints = [],
  verticalPoints = [],
  strokeDasharray = "3 3",
  ...props
}) => (
  <RechartsCartesianGrid
    horizontal={horizontal}
    vertical={vertical}
    horizontalPoints={horizontalPoints}
    verticalPoints={verticalPoints}
    strokeDasharray={strokeDasharray}
    {...props}
  />
);

// Enhanced Tooltip with explicit defaults
export const Tooltip: React.FC<TooltipProps<any, any>> = ({
  active = true,
  allowEscapeViewBox = { x: false, y: false },
  animationDuration = 400,
  animationEasing = "ease",
  coordinate = { x: 0, y: 0 },
  cursor = true,
  filterNull = true,
  isAnimationActive = true,
  offset = 10,
  position = { x: 0, y: 0 },
  reverseDirection = { x: false, y: false },
  separator = " : ",
  trigger = "hover",
  useTranslate3d = false,
  viewBox = { x: 0, y: 0, width: 0, height: 0 },
  wrapperStyle = {},
  ...props
}) => (
  <RechartsTooltip
    active={active}
    allowEscapeViewBox={allowEscapeViewBox}
    animationDuration={animationDuration}
    animationEasing={animationEasing}
    coordinate={coordinate}
    cursor={cursor}
    filterNull={filterNull}
    isAnimationActive={isAnimationActive}
    offset={offset}
    position={position}
    reverseDirection={reverseDirection}
    separator={separator}
    trigger={trigger}
    useTranslate3d={useTranslate3d}
    viewBox={viewBox}
    wrapperStyle={wrapperStyle}
    {...props}
  />
);

// Enhanced ResponsiveContainer with explicit defaults
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  aspect = undefined,
  width = "100%",
  height = "100%",
  minHeight = 0,
  minWidth = 0,
  maxHeight = undefined,
  debounce = 0,
  ...props
}) => (
  <RechartsResponsiveContainer
    aspect={aspect}
    width={width}
    height={height}
    minHeight={minHeight}
    minWidth={minWidth}
    maxHeight={maxHeight}
    debounce={debounce}
    {...props}
  />
);

// Enhanced AreaChart with explicit defaults
export const AreaChart: React.FC<AreaChartProps> = ({
  layout = "horizontal",
  syncId = undefined,
  width = 0,
  height = 0,
  data = [],
  margin = { top: 5, right: 5, bottom: 5, left: 5 },
  stackOffset = "none",
  ...props
}) => (
  <RechartsAreaChart
    layout={layout}
    syncId={syncId}
    width={width}
    height={height}
    data={data}
    margin={margin}
    stackOffset={stackOffset}
    {...props}
  />
);

// Enhanced LineChart with explicit defaults
export const LineChart: React.FC<LineChartProps> = ({
  layout = "horizontal",
  syncId = undefined,
  width = 0,
  height = 0,
  data = [],
  margin = { top: 5, right: 5, bottom: 5, left: 5 },
  ...props
}) => (
  <RechartsLineChart
    layout={layout}
    syncId={syncId}
    width={width}
    height={height}
    data={data}
    margin={margin}
    {...props}
  />
);

// Enhanced BarChart with explicit defaults
export const BarChart: React.FC<BarChartProps> = ({
  layout = "horizontal",
  syncId = undefined,
  width = 0,
  height = 0,
  data = [],
  margin = { top: 5, right: 5, bottom: 5, left: 5 },
  maxBarSize = undefined,
  barCategoryGap = "10%",
  barGap = 4,
  ...props
}) => (
  <RechartsBarChart
    layout={layout}
    syncId={syncId}
    width={width}
    height={height}
    data={data}
    margin={margin}
    maxBarSize={maxBarSize}
    barCategoryGap={barCategoryGap}
    barGap={barGap}
    {...props}
  />
);

// Enhanced PieChart with explicit defaults
export const PieChart: React.FC<PieChartProps> = ({
  width = 0,
  height = 0,
  margin = { top: 5, right: 5, bottom: 5, left: 5 },
  ...props
}) => (
  <RechartsPieChart width={width} height={height} margin={margin} {...props} />
);

// Enhanced Line with explicit defaults
export const Line: React.FC<LineProps> = ({
  type = "linear",
  dataKey = "",
  stroke = "#8884d8",
  strokeWidth = 1,
  fill = "none",
  fillOpacity = 0.6,
  strokeDasharray = undefined,
  strokeOpacity = 1,
  dot = true,
  activeDot = true,
  isAnimationActive = true,
  animationDuration = 1500,
  animationEasing = "ease",
  connectNulls = false,
  ...props
}) => (
  <RechartsLine
    type={type}
    dataKey={dataKey}
    stroke={stroke}
    strokeWidth={strokeWidth}
    fill={fill}
    fillOpacity={fillOpacity}
    strokeDasharray={strokeDasharray}
    strokeOpacity={strokeOpacity}
    dot={dot}
    activeDot={activeDot}
    isAnimationActive={isAnimationActive}
    animationDuration={animationDuration}
    animationEasing={animationEasing}
    connectNulls={connectNulls}
    {...props}
  />
);

// Enhanced Area with explicit defaults
export const Area: React.FC<AreaProps> = ({
  type = "linear",
  dataKey = "",
  stroke = "#8884d8",
  strokeWidth = 1,
  fill = "#8884d8",
  fillOpacity = 0.6,
  strokeDasharray = undefined,
  strokeOpacity = 1,
  dot = false,
  activeDot = true,
  isAnimationActive = true,
  animationDuration = 1500,
  animationEasing = "ease",
  connectNulls = false,
  stackId = undefined,
  ...props
}) => (
  <RechartsArea
    type={type}
    dataKey={dataKey}
    stroke={stroke}
    strokeWidth={strokeWidth}
    fill={fill}
    fillOpacity={fillOpacity}
    strokeDasharray={strokeDasharray}
    strokeOpacity={strokeOpacity}
    dot={dot}
    activeDot={activeDot}
    isAnimationActive={isAnimationActive}
    animationDuration={animationDuration}
    animationEasing={animationEasing}
    connectNulls={connectNulls}
    stackId={stackId}
    {...props}
  />
);

// Enhanced Bar with explicit defaults
export const Bar: React.FC<BarProps> = ({
  dataKey = "",
  fill = "#8884d8",
  fillOpacity = 1,
  stroke = "none",
  strokeWidth = 0,
  isAnimationActive = true,
  animationDuration = 400,
  animationEasing = "ease",
  stackId = undefined,
  maxBarSize = undefined,
  minPointSize = 0,
  ...props
}) => (
  <RechartsBar
    dataKey={dataKey}
    fill={fill}
    fillOpacity={fillOpacity}
    stroke={stroke}
    strokeWidth={strokeWidth}
    isAnimationActive={isAnimationActive}
    animationDuration={animationDuration}
    animationEasing={animationEasing}
    stackId={stackId}
    maxBarSize={maxBarSize}
    minPointSize={minPointSize}
    {...props}
  />
);

// Enhanced Pie with explicit defaults
export const Pie: React.FC<PieProps> = ({
  cx = "50%",
  cy = "50%",
  startAngle = 0,
  endAngle = 360,
  innerRadius = 0,
  outerRadius = "80%",
  paddingAngle = 0,
  dataKey = "",
  nameKey = "name",
  valueKey = "value",
  data = [],
  fill = "#8884d8",
  stroke = "none",
  strokeWidth = 1,
  label = false,
  labelLine = true,
  isAnimationActive = true,
  animationDuration = 400,
  animationEasing = "ease",
  ...props
}) => (
  <RechartsPie
    cx={cx}
    cy={cy}
    startAngle={startAngle}
    endAngle={endAngle}
    innerRadius={innerRadius}
    outerRadius={outerRadius}
    paddingAngle={paddingAngle}
    dataKey={dataKey}
    nameKey={nameKey}
    valueKey={valueKey}
    data={data}
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    label={label}
    labelLine={labelLine}
    isAnimationActive={isAnimationActive}
    animationDuration={animationDuration}
    animationEasing={animationEasing}
    {...props}
  />
);

// Enhanced Cell with explicit defaults
export const Cell: React.FC<CellProps> = ({
  fill = undefined,
  stroke = undefined,
  strokeWidth = undefined,
  ...props
}) => (
  <RechartsCell
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    {...props}
  />
);

// Utility functions
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("pt-BR").format(value);
};
