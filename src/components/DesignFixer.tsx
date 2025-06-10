/**
 * 🔧 DESIGN FIXER - CORRETOR AUTOMÁTICO DE DESIGN
 *
 * Componente que roda diagnóstico e aplica correções automáticas:
 * - Monitora problemas de layout
 * - Aplica fixes automaticamente
 * - Mostra status das correções
 * - Interface para debugging
 */

import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Settings, RefreshCw } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Diagnostic utilities
import {
  runDesignDiagnostic,
  fixDesignIssues,
  DesignDiagnostic,
} from "@/utils/designDiagnostic";

// Types
interface DiagnosticResult {
  issue: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  solution: string;
}

interface DiagnosticReport {
  timestamp: string;
  totalIssues: number;
  criticalIssues: number;
  issues: DiagnosticResult[];
  fixesApplied: number;
}

const DesignFixer: React.FC = () => {
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [fixesApplied, setFixesApplied] = useState(0);
  const [autoFixEnabled, setAutoFixEnabled] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // ===== AUTO-RUN DIAGNOSTIC =====
  useEffect(() => {
    // Run diagnostic on mount
    runDiagnostic();

    // Set up interval to check periodically
    const interval = setInterval(() => {
      if (autoFixEnabled) {
        runDiagnostic();
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [autoFixEnabled]);

  // ===== DIAGNOSTIC FUNCTIONS =====
  const runDiagnostic = async () => {
    try {
      setIsRunning(true);
      const newReport = runDesignDiagnostic();
      setReport(newReport);

      // Auto-apply fixes for critical issues
      if (autoFixEnabled && newReport.criticalIssues > 0) {
        const applied = await fixDesignIssues();
        setFixesApplied((prev) => prev + applied);
      }
    } catch (error) {
      console.error("Erro no diagnóstico:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const applyFixes = async () => {
    try {
      setIsRunning(true);
      const applied = await fixDesignIssues();
      setFixesApplied((prev) => prev + applied);

      // Re-run diagnostic after fixes
      setTimeout(() => {
        runDiagnostic();
      }, 1000);
    } catch (error) {
      console.error("Erro ao aplicar correções:", error);
    } finally {
      setIsRunning(false);
    }
  };

  // ===== RENDER HELPERS =====
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return <AlertCircle size={16} />;
      case "medium":
        return <AlertCircle size={16} />;
      case "low":
        return <CheckCircle size={16} />;
      default:
        return <CheckCircle size={16} />;
    }
  };

  // ===== RENDER =====
  if (!report) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="w-80">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <RefreshCw size={16} className="animate-spin" />
              <span className="text-sm">Executando diagnóstico...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="mb-2 shadow-lg bg-white"
          >
            <Settings size={16} className="mr-2" />
            Design Fix ({report.totalIssues} issues)
            {report.criticalIssues > 0 && (
              <Badge variant="destructive" className="ml-2">
                {report.criticalIssues} críticos
              </Badge>
            )}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <Card className="w-96 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span>Diagnóstico de Design</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={runDiagnostic}
                  disabled={isRunning}
                >
                  <RefreshCw
                    size={16}
                    className={isRunning ? "animate-spin" : ""}
                  />
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Status Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {report.totalIssues}
                  </div>
                  <div className="text-sm text-gray-600">Total Issues</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {fixesApplied}
                  </div>
                  <div className="text-sm text-green-700">Fixes Applied</div>
                </div>
              </div>

              {/* Critical Issues Alert */}
              {report.criticalIssues > 0 && (
                <Alert variant="destructive">
                  <AlertCircle size={16} />
                  <AlertDescription>
                    {report.criticalIssues} problema(s) crítico(s) encontrado(s)
                    que podem afetar a funcionalidade.
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  onClick={applyFixes}
                  disabled={isRunning || report.totalIssues === 0}
                  className="flex-1"
                >
                  {isRunning ? (
                    <RefreshCw size={16} className="animate-spin mr-2" />
                  ) : (
                    <CheckCircle size={16} className="mr-2" />
                  )}
                  Aplicar Correções
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setAutoFixEnabled(!autoFixEnabled)}
                  className={autoFixEnabled ? "bg-green-50" : ""}
                >
                  Auto {autoFixEnabled ? "ON" : "OFF"}
                </Button>
              </div>

              {/* Issues List */}
              {report.issues.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <h4 className="text-sm font-medium text-gray-900">
                    Problemas Encontrados:
                  </h4>
                  {report.issues.map((issue, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg bg-gray-50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="text-sm font-medium text-gray-900">
                          {issue.issue}
                        </h5>
                        <Badge variant={getSeverityColor(issue.severity)}>
                          {getSeverityIcon(issue.severity)}
                          {issue.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        {issue.description}
                      </p>
                      <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                        💡 {issue.solution}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Success State */}
              {report.totalIssues === 0 && (
                <Alert>
                  <CheckCircle size={16} />
                  <AlertDescription>
                    ✅ Nenhum problema de design encontrado! O sistema está
                    funcionando corretamente.
                  </AlertDescription>
                </Alert>
              )}

              {/* Debug Info */}
              <div className="text-xs text-gray-500 pt-2 border-t">
                <div>
                  Última verificação:{" "}
                  {new Date(report.timestamp).toLocaleTimeString()}
                </div>
                <div>Auto-fix: {autoFixEnabled ? "Ativo" : "Inativo"}</div>
                <div>Correções aplicadas: {fixesApplied}</div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default DesignFixer;
