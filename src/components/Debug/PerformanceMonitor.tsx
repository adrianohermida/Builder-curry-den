/**
 * 📊 PERFORMANCE MONITOR
 * Real-time performance monitoring component for development
 */

import React, { useState, useEffect, useCallback } from "react";
import { Activity, Zap, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte

  // Memory
  usedJSHeapSize?: number;
  totalJSHeapSize?: number;
  jsHeapSizeLimit?: number;

  // Network
  effectiveType?: string;
  downlink?: number;
  rtt?: number;

  // React specific
  renderTime?: number;
  componentCount?: number;
}

interface PerformanceMonitorProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  minimal?: boolean;
  updateInterval?: number;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  position = "bottom-right",
  minimal = false,
  updateInterval = 1000,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(!minimal);

  // Collect performance metrics
  const collectMetrics = useCallback(() => {
    const newMetrics: PerformanceMetrics = {};

    // Core Web Vitals
    if ("performance" in window) {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;

      if (navigation) {
        newMetrics.ttfb = navigation.responseStart - navigation.requestStart;
      }

      // Try to get Web Vitals from PerformanceObserver if available
      try {
        const paintEntries = performance.getEntriesByType("paint");
        const fcpEntry = paintEntries.find(
          (entry) => entry.name === "first-contentful-paint",
        );
        if (fcpEntry) {
          newMetrics.fcp = fcpEntry.startTime;
        }
      } catch (error) {
        console.debug("Performance API not fully supported");
      }
    }

    // Memory information
    if ("memory" in performance) {
      const memory = (performance as any).memory;
      newMetrics.usedJSHeapSize = memory.usedJSHeapSize;
      newMetrics.totalJSHeapSize = memory.totalJSHeapSize;
      newMetrics.jsHeapSizeLimit = memory.jsHeapSizeLimit;
    }

    // Network information
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      newMetrics.effectiveType = connection.effectiveType;
      newMetrics.downlink = connection.downlink;
      newMetrics.rtt = connection.rtt;
    }

    // React render time (approximate)
    const renderStart = performance.now();
    setTimeout(() => {
      newMetrics.renderTime = performance.now() - renderStart;
    }, 0);

    setMetrics(newMetrics);
  }, []);

  // Update metrics periodically
  useEffect(() => {
    collectMetrics();
    const interval = setInterval(collectMetrics, updateInterval);
    return () => clearInterval(interval);
  }, [collectMetrics, updateInterval]);

  // Format bytes to human readable
  const formatBytes = (bytes?: number): string => {
    if (!bytes) return "N/A";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  // Format milliseconds
  const formatMs = (ms?: number): string => {
    if (ms === undefined) return "N/A";
    return `${ms.toFixed(1)}ms`;
  };

  // Get performance status color
  const getStatusColor = (value?: number, thresholds = [100, 300]): string => {
    if (!value) return "gray";
    if (value <= thresholds[0]) return "green";
    if (value <= thresholds[1]) return "yellow";
    return "red";
  };

  // Position classes
  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className={`fixed z-50 ${positionClasses[position]} opacity-50 hover:opacity-100`}
      >
        <Activity size={16} />
      </Button>
    );
  }

  if (!isExpanded) {
    return (
      <Card
        className={`fixed z-50 ${positionClasses[position]} w-64 opacity-90 hover:opacity-100 transition-opacity cursor-pointer`}
        onClick={() => setIsExpanded(true)}
      >
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-blue-500" />
              <span className="text-sm font-medium">Performance</span>
            </div>
            <div className="flex gap-1">
              <Badge
                variant="outline"
                className={`text-xs bg-${getStatusColor(metrics.fcp)}-100`}
              >
                FCP: {formatMs(metrics.fcp)}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVisible(false);
                }}
                className="h-5 w-5 p-0"
              >
                ×
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`fixed z-50 ${positionClasses[position]} w-80 opacity-95 hover:opacity-100 transition-opacity`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity size={16} className="text-blue-500" />
            Performance Monitor
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-6 w-6 p-0"
            >
              −
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Core Web Vitals */}
        <div>
          <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
            <Zap size={12} />
            Core Web Vitals
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-600">FCP:</span>
              <Badge
                variant="outline"
                className={`ml-1 text-xs bg-${getStatusColor(metrics.fcp, [1800, 3000])}-100`}
              >
                {formatMs(metrics.fcp)}
              </Badge>
            </div>
            <div>
              <span className="text-gray-600">TTFB:</span>
              <Badge
                variant="outline"
                className={`ml-1 text-xs bg-${getStatusColor(metrics.ttfb, [800, 1800])}-100`}
              >
                {formatMs(metrics.ttfb)}
              </Badge>
            </div>
            <div>
              <span className="text-gray-600">LCP:</span>
              <Badge
                variant="outline"
                className={`ml-1 text-xs bg-${getStatusColor(metrics.lcp, [2500, 4000])}-100`}
              >
                {formatMs(metrics.lcp)}
              </Badge>
            </div>
            <div>
              <span className="text-gray-600">CLS:</span>
              <Badge
                variant="outline"
                className={`ml-1 text-xs bg-${getStatusColor((metrics.cls || 0) * 1000, [100, 250])}-100`}
              >
                {(metrics.cls || 0).toFixed(3)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Memory */}
        {metrics.usedJSHeapSize && (
          <div>
            <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
              <Clock size={12} />
              Memory Usage
            </h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Used:</span>
                <span>{formatBytes(metrics.usedJSHeapSize)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span>{formatBytes(metrics.totalJSHeapSize)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Limit:</span>
                <span>{formatBytes(metrics.jsHeapSizeLimit)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{
                    width: `${((metrics.usedJSHeapSize || 0) / (metrics.totalJSHeapSize || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Network */}
        {metrics.effectiveType && (
          <div>
            <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
              <AlertTriangle size={12} />
              Network
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-600">Type:</span>
                <Badge variant="outline" className="ml-1 text-xs">
                  {metrics.effectiveType}
                </Badge>
              </div>
              <div>
                <span className="text-gray-600">RTT:</span>
                <span className="ml-1">{metrics.rtt}ms</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Downlink:</span>
                <span className="ml-1">{metrics.downlink} Mbps</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={collectMetrics}
            className="text-xs h-6"
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("Performance Metrics:", metrics);
              console.log("Performance Timeline:", performance.getEntries());
            }}
            className="text-xs h-6"
          >
            Log to Console
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Development-only wrapper
const PerformanceMonitorWrapper: React.FC<PerformanceMonitorProps> = (
  props,
) => {
  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return <PerformanceMonitor {...props} />;
};

export default PerformanceMonitorWrapper;
export { PerformanceMonitor };
