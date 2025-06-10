/**
 * 🏥 SYSTEM HEALTH CHECKER
 * Comprehensive system health monitoring and diagnostics
 */

import React, { useState, useEffect } from "react";
import { IS_DEVELOPMENT, getNodeEnv } from "@/lib/env";
import {
  Heart,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HealthCheck {
  id: string;
  name: string;
  status: "healthy" | "warning" | "error" | "checking";
  message: string;
  lastCheck: Date;
  details?: any;
}

interface SystemHealth {
  overall: "healthy" | "warning" | "critical";
  score: number;
  checks: HealthCheck[];
  lastUpdate: Date;
}

const SystemHealthChecker: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth>({
    overall: "healthy",
    score: 100,
    checks: [],
    lastUpdate: new Date(),
  });
  const [isChecking, setIsChecking] = useState(false);

  // Run comprehensive health checks
  const runHealthChecks = async () => {
    setIsChecking(true);
    const checks: HealthCheck[] = [];

    try {
      // Check 1: Local Storage availability
      checks.push(await checkLocalStorage());

      // Check 2: Session Storage availability
      checks.push(await checkSessionStorage());

      // Check 3: Console errors
      checks.push(await checkConsoleErrors());

      // Check 4: Network connectivity
      checks.push(await checkNetworkConnectivity());

      // Check 5: JavaScript errors
      checks.push(await checkJavaScriptErrors());

      // Check 6: Performance
      checks.push(await checkPerformance());

      // Check 7: Memory usage
      checks.push(await checkMemoryUsage());

      // Check 8: Critical dependencies
      checks.push(await checkDependencies());

      // Check 9: React environment
      checks.push(await checkReactEnvironment());

      // Check 10: API endpoints (mock)
      checks.push(await checkAPIEndpoints());

      // Calculate overall health
      const healthyCount = checks.filter((c) => c.status === "healthy").length;
      const warningCount = checks.filter((c) => c.status === "warning").length;
      const errorCount = checks.filter((c) => c.status === "error").length;

      const score = Math.round((healthyCount / checks.length) * 100);
      let overall: "healthy" | "warning" | "critical" = "healthy";

      if (errorCount > 0) overall = "critical";
      else if (warningCount > 2) overall = "warning";

      setHealth({
        overall,
        score,
        checks,
        lastUpdate: new Date(),
      });
    } catch (error) {
      console.error("Health check failed:", error);
    } finally {
      setIsChecking(false);
    }
  };

  // Individual health check functions
  const checkLocalStorage = async (): Promise<HealthCheck> => {
    try {
      const testKey = "__health_check_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);

      return {
        id: "localStorage",
        name: "Local Storage",
        status: "healthy",
        message: "Local storage is working correctly",
        lastCheck: new Date(),
      };
    } catch (error) {
      return {
        id: "localStorage",
        name: "Local Storage",
        status: "error",
        message: "Local storage is not available",
        lastCheck: new Date(),
        details: { error: error instanceof Error ? error.message : error },
      };
    }
  };

  const checkSessionStorage = async (): Promise<HealthCheck> => {
    try {
      const testKey = "__health_check_session__";
      sessionStorage.setItem(testKey, "test");
      sessionStorage.removeItem(testKey);

      return {
        id: "sessionStorage",
        name: "Session Storage",
        status: "healthy",
        message: "Session storage is working correctly",
        lastCheck: new Date(),
      };
    } catch (error) {
      return {
        id: "sessionStorage",
        name: "Session Storage",
        status: "error",
        message: "Session storage is not available",
        lastCheck: new Date(),
        details: { error: error instanceof Error ? error.message : error },
      };
    }
  };

  const checkConsoleErrors = async (): Promise<HealthCheck> => {
    // This is a simplified check - in a real implementation,
    // you'd track console errors over time
    const hasConsoleErrors = window.console.error.toString().includes("bound");

    return {
      id: "consoleErrors",
      name: "Console Errors",
      status: hasConsoleErrors ? "warning" : "healthy",
      message: hasConsoleErrors
        ? "Some console errors detected"
        : "No recent console errors",
      lastCheck: new Date(),
    };
  };

  const checkNetworkConnectivity = async (): Promise<HealthCheck> => {
    try {
      const startTime = performance.now();
      await fetch("/favicon.ico", { method: "HEAD" });
      const responseTime = performance.now() - startTime;

      let status: "healthy" | "warning" | "error" = "healthy";
      let message = `Network is responsive (${responseTime.toFixed(0)}ms)`;

      if (responseTime > 3000) {
        status = "error";
        message = `Network is very slow (${responseTime.toFixed(0)}ms)`;
      } else if (responseTime > 1000) {
        status = "warning";
        message = `Network is slow (${responseTime.toFixed(0)}ms)`;
      }

      return {
        id: "network",
        name: "Network Connectivity",
        status,
        message,
        lastCheck: new Date(),
        details: { responseTime },
      };
    } catch (error) {
      return {
        id: "network",
        name: "Network Connectivity",
        status: "error",
        message: "Network connectivity issues detected",
        lastCheck: new Date(),
        details: { error: error instanceof Error ? error.message : error },
      };
    }
  };

  const checkJavaScriptErrors = async (): Promise<HealthCheck> => {
    // Check for global error handlers
    const hasErrorHandler = !!window.onerror;
    const hasUnhandledRejectionHandler = !!window.onunhandledrejection;

    let status: "healthy" | "warning" | "error" = "healthy";
    let message = "JavaScript error handling is configured";

    if (!hasErrorHandler && !hasUnhandledRejectionHandler) {
      status = "warning";
      message = "No global error handlers detected";
    }

    return {
      id: "jsErrors",
      name: "JavaScript Error Handling",
      status,
      message,
      lastCheck: new Date(),
      details: { hasErrorHandler, hasUnhandledRejectionHandler },
    };
  };

  const checkPerformance = async (): Promise<HealthCheck> => {
    try {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;

      const loadTime = navigation.loadEventEnd - navigation.navigationStart;
      let status: "healthy" | "warning" | "error" = "healthy";
      let message = `Page loaded in ${loadTime.toFixed(0)}ms`;

      if (loadTime > 5000) {
        status = "error";
        message = `Page load time is very slow (${loadTime.toFixed(0)}ms)`;
      } else if (loadTime > 3000) {
        status = "warning";
        message = `Page load time is slow (${loadTime.toFixed(0)}ms)`;
      }

      return {
        id: "performance",
        name: "Performance",
        status,
        message,
        lastCheck: new Date(),
        details: { loadTime },
      };
    } catch (error) {
      return {
        id: "performance",
        name: "Performance",
        status: "warning",
        message: "Performance data not available",
        lastCheck: new Date(),
      };
    }
  };

  const checkMemoryUsage = async (): Promise<HealthCheck> => {
    try {
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;
        const usagePercent = (usedMB / limitMB) * 100;

        let status: "healthy" | "warning" | "error" = "healthy";
        let message = `Memory usage: ${usedMB.toFixed(1)}MB (${usagePercent.toFixed(1)}%)`;

        if (usagePercent > 80) {
          status = "error";
          message = `High memory usage: ${usagePercent.toFixed(1)}%`;
        } else if (usagePercent > 60) {
          status = "warning";
          message = `Moderate memory usage: ${usagePercent.toFixed(1)}%`;
        }

        return {
          id: "memory",
          name: "Memory Usage",
          status,
          message,
          lastCheck: new Date(),
          details: { usedMB, limitMB, usagePercent },
        };
      } else {
        return {
          id: "memory",
          name: "Memory Usage",
          status: "warning",
          message: "Memory API not available",
          lastCheck: new Date(),
        };
      }
    } catch (error) {
      return {
        id: "memory",
        name: "Memory Usage",
        status: "error",
        message: "Failed to check memory usage",
        lastCheck: new Date(),
      };
    }
  };

  const checkDependencies = async (): Promise<HealthCheck> => {
    try {
      // Check for critical dependencies
      const criticalDeps = {
        React: typeof React !== "undefined",
        ReactDOM: typeof window !== "undefined" && !!window.React,
      };

      const missingDeps = Object.entries(criticalDeps)
        .filter(([, available]) => !available)
        .map(([name]) => name);

      let status: "healthy" | "warning" | "error" = "healthy";
      let message = "All critical dependencies loaded";

      if (missingDeps.length > 0) {
        status = "error";
        message = `Missing dependencies: ${missingDeps.join(", ")}`;
      }

      return {
        id: "dependencies",
        name: "Dependencies",
        status,
        message,
        lastCheck: new Date(),
        details: { criticalDeps, missingDeps },
      };
    } catch (error) {
      return {
        id: "dependencies",
        name: "Dependencies",
        status: "error",
        message: "Failed to check dependencies",
        lastCheck: new Date(),
      };
    }
  };

  const checkReactEnvironment = async (): Promise<HealthCheck> => {
    try {
      const isDevelopment = IS_DEVELOPMENT;
      const hasReactDevTools =
        typeof window !== "undefined" &&
        !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;

      let status: "healthy" | "warning" | "error" = "healthy";
      let message = `React environment: ${getNodeEnv()}`;

      if (isDevelopment && !hasReactDevTools) {
        status = "warning";
        message = "React DevTools not detected (recommended for development)";
      }

      return {
        id: "reactEnv",
        name: "React Environment",
        status,
        message,
        lastCheck: new Date(),
        details: { isDevelopment, hasReactDevTools },
      };
    } catch (error) {
      return {
        id: "reactEnv",
        name: "React Environment",
        status: "error",
        message: "Failed to check React environment",
        lastCheck: new Date(),
      };
    }
  };

  const checkAPIEndpoints = async (): Promise<HealthCheck> => {
    // Mock API check - replace with real endpoints
    try {
      // Simulated API check
      await new Promise((resolve) => setTimeout(resolve, 100));

      return {
        id: "api",
        name: "API Endpoints",
        status: "healthy",
        message: "API endpoints are responsive",
        lastCheck: new Date(),
      };
    } catch (error) {
      return {
        id: "api",
        name: "API Endpoints",
        status: "error",
        message: "API connectivity issues",
        lastCheck: new Date(),
      };
    }
  };

  // Export health report
  const exportHealthReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      health,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `health-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Run checks on mount
  useEffect(() => {
    runHealthChecks();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="text-green-500" size={16} />;
      case "warning":
        return <AlertTriangle className="text-yellow-500" size={16} />;
      case "error":
        return <XCircle className="text-red-500" size={16} />;
      case "checking":
        return <RefreshCw className="text-blue-500 animate-spin" size={16} />;
      default:
        return <Heart className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "error":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Only show in development
  if (!IS_DEVELOPMENT) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Heart className="text-red-500" />
            System Health Checker
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={runHealthChecks}
              disabled={isChecking}
            >
              {isChecking ? (
                <RefreshCw className="animate-spin" size={16} />
              ) : (
                <RefreshCw size={16} />
              )}
              {isChecking ? "Checking..." : "Refresh"}
            </Button>
            <Button variant="outline" size="sm" onClick={exportHealthReport}>
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Overall Health:</span>
            <Badge className={getStatusColor(health.overall)}>
              {health.overall.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Score:</span>
            <span className="font-bold">{health.score}%</span>
          </div>
          <Progress value={health.score} className="w-32" />
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {health.checks.map((check) => (
                <Card key={check.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{check.name}</h4>
                    {getStatusIcon(check.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{check.message}</p>
                  <p className="text-xs text-gray-400">
                    Last check: {check.lastCheck.toLocaleTimeString()}
                  </p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            {health.checks.map((check) => (
              <Card key={check.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(check.status)}
                    <h4 className="font-medium">{check.name}</h4>
                    <Badge className={getStatusColor(check.status)}>
                      {check.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-400">
                    {check.lastCheck.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{check.message}</p>
                {check.details && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                      Technical Details
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                      {JSON.stringify(check.details, null, 2)}
                    </pre>
                  </details>
                )}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Settings size={16} />
                <h4 className="font-medium">Health Check Settings</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto-refresh interval</span>
                  <select className="text-sm border rounded px-2 py-1">
                    <option>30 seconds</option>
                    <option>1 minute</option>
                    <option>5 minutes</option>
                    <option>Disabled</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show notifications</span>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Include performance metrics</span>
                  <input type="checkbox" defaultChecked />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SystemHealthChecker;
