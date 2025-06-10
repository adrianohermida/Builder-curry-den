/**
 * 🛠️ DEBUG DEVELOPMENT PANEL
 * Comprehensive debugging interface for development
 */

import React, { useState, useEffect } from "react";
import {
  Bug,
  Monitor,
  Activity,
  Database,
  Settings,
  Download,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import PerformanceMonitor from "./PerformanceMonitor";
import SystemHealthChecker from "./SystemHealthChecker";
import { getErrorStats, exportErrorReports } from "@/lib/errorHandler";

interface DebugPanelProps {
  defaultOpen?: boolean;
}

interface LogEntry {
  id: string;
  timestamp: Date;
  level: "log" | "info" | "warn" | "error";
  message: string;
  data?: any;
  source?: string;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isCapturingLogs, setIsCapturingLogs] = useState(true);
  const [errorStats, setErrorStats] = useState<any>(null);

  // Capture console logs
  useEffect(() => {
    if (!isCapturingLogs) return;

    const originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
    };

    const createLogCapture = (level: keyof typeof originalConsole) => {
      return (...args: any[]) => {
        // Call original console method
        originalConsole[level](...args);

        // Capture for our debug panel
        const logEntry: LogEntry = {
          id: Date.now().toString() + Math.random(),
          timestamp: new Date(),
          level: level as LogEntry["level"],
          message: args
            .map((arg) =>
              typeof arg === "object"
                ? JSON.stringify(arg, null, 2)
                : String(arg),
            )
            .join(" "),
          data:
            args.length === 1 && typeof args[0] === "object" ? args[0] : args,
          source: getCallerSource(),
        };

        setLogs((prev) => [...prev.slice(-99), logEntry]); // Keep last 100 logs
      };
    };

    // Override console methods
    console.log = createLogCapture("log");
    console.info = createLogCapture("info");
    console.warn = createLogCapture("warn");
    console.error = createLogCapture("error");

    // Cleanup on unmount
    return () => {
      console.log = originalConsole.log;
      console.info = originalConsole.info;
      console.warn = originalConsole.warn;
      console.error = originalConsole.error;
    };
  }, [isCapturingLogs]);

  // Get caller source (simplified)
  const getCallerSource = (): string => {
    try {
      throw new Error();
    } catch (error) {
      const stack = (error as Error).stack;
      if (stack) {
        const lines = stack.split("\n");
        // Try to find the relevant stack line
        const relevantLine = lines.find(
          (line) => line.includes(".tsx") || line.includes(".ts"),
        );
        if (relevantLine) {
          const match = relevantLine.match(/([^/\\]+\.(tsx?|jsx?)):\d+:\d+/);
          return match ? match[1] : "unknown";
        }
      }
      return "unknown";
    }
  };

  // Update error stats
  useEffect(() => {
    const updateStats = () => {
      try {
        setErrorStats(getErrorStats());
      } catch (error) {
        console.warn("Could not get error stats:", error);
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  // Clear logs
  const clearLogs = () => {
    setLogs([]);
  };

  // Export logs
  const exportLogs = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      logs,
      errorStats,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `debug-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export error reports
  const exportErrors = () => {
    try {
      const errorReports = exportErrorReports("json");
      const blob = new Blob([errorReports], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `error-reports-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export error reports:", error);
    }
  };

  // Get log level color
  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "text-red-600 bg-red-50";
      case "warn":
        return "text-yellow-600 bg-yellow-50";
      case "info":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <>
      {/* Floating toggle button */}
      {!isOpen && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 left-4 z-50 bg-purple-600 text-white hover:bg-purple-700 shadow-lg"
        >
          <Bug size={16} />
          Debug
        </Button>
      )}

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-6xl h-full max-h-[90vh] bg-white">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bug className="text-purple-600" />
                  Development Debug Panel
                  <Badge variant="outline" className="bg-purple-100">
                    {process.env.NODE_ENV}
                  </Badge>
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCapturingLogs(!isCapturingLogs)}
                  >
                    {isCapturingLogs ? <Eye size={16} /> : <EyeOff size={16} />}
                    {isCapturingLogs ? "Stop" : "Start"} Logging
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    ×
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 h-full">
              <Tabs defaultValue="logs" className="h-full flex flex-col">
                <TabsList className="w-full justify-start rounded-none border-b bg-gray-50">
                  <TabsTrigger value="logs" className="flex items-center gap-2">
                    <Monitor size={16} />
                    Console Logs ({logs.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="performance"
                    className="flex items-center gap-2"
                  >
                    <Activity size={16} />
                    Performance
                  </TabsTrigger>
                  <TabsTrigger
                    value="health"
                    className="flex items-center gap-2"
                  >
                    <Database size={16} />
                    System Health
                  </TabsTrigger>
                  <TabsTrigger
                    value="errors"
                    className="flex items-center gap-2"
                  >
                    <Bug size={16} />
                    Error Reports
                    {errorStats?.last24h > 0 && (
                      <Badge variant="destructive" className="ml-1">
                        {errorStats.last24h}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="flex items-center gap-2"
                  >
                    <Settings size={16} />
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="logs" className="flex-1 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Console Logs</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={exportLogs}>
                        <Download size={16} />
                        Export
                      </Button>
                      <Button variant="outline" size="sm" onClick={clearLogs}>
                        <Trash2 size={16} />
                        Clear
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="h-[calc(100vh-300px)] border rounded">
                    <div className="p-4 space-y-2">
                      {logs.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          No logs captured yet.{" "}
                          {!isCapturingLogs &&
                            "Start logging to see console output."}
                        </p>
                      ) : (
                        logs.map((log) => (
                          <div
                            key={log.id}
                            className="border rounded p-3 bg-gray-50 hover:bg-gray-100"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge className={getLogLevelColor(log.level)}>
                                  {log.level.toUpperCase()}
                                </Badge>
                                {log.source && (
                                  <Badge variant="outline" className="text-xs">
                                    {log.source}
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">
                                {log.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <pre className="text-sm whitespace-pre-wrap break-all">
                              {log.message}
                            </pre>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="performance" className="flex-1 p-4">
                  <PerformanceMonitor position="top-left" minimal={false} />
                </TabsContent>

                <TabsContent
                  value="health"
                  className="flex-1 p-4 overflow-auto"
                >
                  <SystemHealthChecker />
                </TabsContent>

                <TabsContent value="errors" className="flex-1 p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Error Reports</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={exportErrors}
                      >
                        <Download size={16} />
                        Export Error Reports
                      </Button>
                    </div>

                    {errorStats ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <Card className="p-4">
                          <div className="text-2xl font-bold">
                            {errorStats.total}
                          </div>
                          <div className="text-sm text-gray-600">
                            Total Errors
                          </div>
                        </Card>
                        <Card className="p-4">
                          <div className="text-2xl font-bold text-red-600">
                            {errorStats.last24h}
                          </div>
                          <div className="text-sm text-gray-600">Last 24h</div>
                        </Card>
                        <Card className="p-4">
                          <div className="text-2xl font-bold text-yellow-600">
                            {errorStats.bySeverity?.medium || 0}
                          </div>
                          <div className="text-sm text-gray-600">
                            Medium Priority
                          </div>
                        </Card>
                        <Card className="p-4">
                          <div className="text-2xl font-bold text-red-800">
                            {errorStats.bySeverity?.critical || 0}
                          </div>
                          <div className="text-sm text-gray-600">Critical</div>
                        </Card>
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        Loading error statistics...
                      </p>
                    )}

                    {errorStats?.byCategory && (
                      <Card className="p-4">
                        <h4 className="font-semibold mb-3">
                          Errors by Category
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(errorStats.byCategory).map(
                            ([category, count]) => (
                              <div
                                key={category}
                                className="flex justify-between items-center"
                              >
                                <span className="capitalize">{category}</span>
                                <Badge variant="outline">
                                  {count as number}
                                </Badge>
                              </div>
                            ),
                          )}
                        </div>
                      </Card>
                    )}

                    {errorStats?.latestError && (
                      <Card className="p-4">
                        <h4 className="font-semibold mb-3">Latest Error</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-red-100 text-red-800">
                              {errorStats.latestError.severity}
                            </Badge>
                            <Badge variant="outline">
                              {errorStats.latestError.category}
                            </Badge>
                          </div>
                          <p className="text-sm">
                            {errorStats.latestError.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(
                              errorStats.latestError.timestamp,
                            ).toLocaleString()}
                          </p>
                        </div>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="flex-1 p-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Debug Settings
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">
                            Auto-capture console logs
                          </label>
                          <input
                            type="checkbox"
                            checked={isCapturingLogs}
                            onChange={(e) =>
                              setIsCapturingLogs(e.target.checked)
                            }
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">
                            Max logs to retain
                          </label>
                          <select className="border rounded px-2 py-1">
                            <option value="50">50</option>
                            <option value="100" selected>
                              100
                            </option>
                            <option value="200">200</option>
                            <option value="500">500</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Environment Info</h4>
                      <div className="bg-gray-100 p-4 rounded text-sm font-mono">
                        <div>NODE_ENV: {process.env.NODE_ENV}</div>
                        <div>React Version: {React.version}</div>
                        <div>User Agent: {navigator.userAgent}</div>
                        <div>URL: {window.location.href}</div>
                        <div>
                          Viewport: {window.innerWidth}x{window.innerHeight}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default DebugPanel;
