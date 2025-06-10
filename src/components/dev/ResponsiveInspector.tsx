/**
 * 🔍 RESPONSIVE INSPECTOR - INSPETOR DE RESPONSIVIDADE
 *
 * Componente para testar e visualizar breakpoints em tempo real
 * Apenas disponível em modo desenvolvimento
 */

import React, { useState, useEffect, useCallback } from "react";
import { IS_DEVELOPMENT } from "@/lib/env";
import {
  Monitor,
  Smartphone,
  Tablet,
  Maximize,
  Minimize,
  Eye,
  EyeOff,
  Settings,
  Ruler,
  Grid,
  Palette,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ResponsiveInspectorProps {
  enabled?: boolean;
}

interface ViewportSize {
  name: string;
  width: number;
  height: number;
  device: string;
  icon: React.ComponentType<{ size?: number }>;
}

const VIEWPORT_SIZES: ViewportSize[] = [
  {
    name: "iPhone 13 Mini",
    width: 375,
    height: 667,
    device: "Mobile",
    icon: Smartphone,
  },
  {
    name: "iPhone 13",
    width: 390,
    height: 844,
    device: "Mobile",
    icon: Smartphone,
  },
  {
    name: "iPhone 13 Pro Max",
    width: 428,
    height: 926,
    device: "Mobile",
    icon: Smartphone,
  },
  {
    name: "Galaxy S21",
    width: 360,
    height: 800,
    device: "Mobile",
    icon: Smartphone,
  },
  {
    name: "iPad Mini",
    width: 768,
    height: 1024,
    device: "Tablet",
    icon: Tablet,
  },
  {
    name: "iPad Air",
    width: 820,
    height: 1180,
    device: "Tablet",
    icon: Tablet,
  },
  {
    name: "iPad Pro 11",
    width: 834,
    height: 1194,
    device: "Tablet",
    icon: Tablet,
  },
  {
    name: "iPad Pro 12.9",
    width: 1024,
    height: 1366,
    device: "Tablet",
    icon: Tablet,
  },
  {
    name: "MacBook Air",
    width: 1280,
    height: 800,
    device: "Desktop",
    icon: Monitor,
  },
  {
    name: "MacBook Pro 14",
    width: 1512,
    height: 982,
    device: "Desktop",
    icon: Monitor,
  },
  {
    name: "MacBook Pro 16",
    width: 1728,
    height: 1117,
    device: "Desktop",
    icon: Monitor,
  },
  {
    name: "Desktop 1080p",
    width: 1920,
    height: 1080,
    device: "Desktop",
    icon: Monitor,
  },
  {
    name: "Desktop 1440p",
    width: 2560,
    height: 1440,
    device: "Desktop",
    icon: Monitor,
  },
  {
    name: "Desktop 4K",
    width: 3840,
    height: 2160,
    device: "Desktop",
    icon: Monitor,
  },
];

const TAILWIND_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export const ResponsiveInspector: React.FC<ResponsiveInspectorProps> = ({
  enabled = IS_DEVELOPMENT,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentViewport, setCurrentViewport] = useState<ViewportSize | null>(
    null,
  );
  const [showRuler, setShowRuler] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showBreakpoints, setShowBreakpoints] = useState(true);
  const [realTime, setRealTime] = useState(true);

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  // Real-time window size tracking
  useEffect(() => {
    if (!realTime) return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [realTime]);

  // Get current breakpoint
  const getCurrentBreakpoint = () => {
    const width = currentViewport?.width || windowSize.width;

    if (width >= TAILWIND_BREAKPOINTS["2xl"]) return "2xl";
    if (width >= TAILWIND_BREAKPOINTS.xl) return "xl";
    if (width >= TAILWIND_BREAKPOINTS.lg) return "lg";
    if (width >= TAILWIND_BREAKPOINTS.md) return "md";
    if (width >= TAILWIND_BREAKPOINTS.sm) return "sm";
    return "xs";
  };

  const getDeviceType = () => {
    const width = currentViewport?.width || windowSize.width;

    if (width < 768) return "Mobile";
    if (width < 1024) return "Tablet";
    return "Desktop";
  };

  const applyViewport = (viewport: ViewportSize) => {
    setCurrentViewport(viewport);
    // Simulate viewport change (in a real implementation, this would resize the viewport)
    setWindowSize({ width: viewport.width, height: viewport.height });
  };

  const resetViewport = () => {
    setCurrentViewport(null);
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  // Don't render if not enabled or in production
  if (!enabled) return null;

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-20 right-4 z-50 rounded-full h-12 w-12 p-0 shadow-lg"
        variant="secondary"
        title="🔍 Inspetor de Responsividade"
      >
        <Ruler size={20} />
      </Button>

      {/* Inspector Panel */}
      {isVisible && (
        <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-2xl border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center">
                  <Ruler size={18} className="mr-2" />
                  Responsividade
                </CardTitle>
                <CardDescription>
                  Teste de breakpoints e dispositivos
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-8 w-8 p-0"
              >
                <EyeOff size={16} />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Current Status */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <Label className="text-xs text-muted-foreground">
                  Resolução
                </Label>
                <p className="font-mono">
                  {currentViewport?.width || windowSize.width} ×{" "}
                  {currentViewport?.height || windowSize.height}
                </p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Breakpoint
                </Label>
                <Badge variant="outline" className="font-mono">
                  {getCurrentBreakpoint()}
                </Badge>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Dispositivo
                </Label>
                <p>{getDeviceType()}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Badge
                  variant={currentViewport ? "default" : "secondary"}
                  className="text-xs"
                >
                  {currentViewport ? "Simulando" : "Real"}
                </Badge>
              </div>
            </div>

            {/* Viewport Selector */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Dispositivo de Teste
              </Label>
              <Select
                value={currentViewport?.name || ""}
                onValueChange={(value) => {
                  const viewport = VIEWPORT_SIZES.find((v) => v.name === value);
                  if (viewport) {
                    applyViewport(viewport);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um dispositivo" />
                </SelectTrigger>
                <SelectContent>
                  {VIEWPORT_SIZES.map((viewport) => {
                    const Icon = viewport.icon;
                    return (
                      <SelectItem key={viewport.name} value={viewport.name}>
                        <div className="flex items-center">
                          <Icon size={14} className="mr-2" />
                          <span>{viewport.name}</span>
                          <span className="ml-auto text-xs text-muted-foreground">
                            {viewport.width}×{viewport.height}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetViewport}
                disabled={!currentViewport}
                className="flex-1"
              >
                <Maximize size={14} className="mr-1" />
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRealTime(!realTime)}
                className="flex-1"
              >
                {realTime ? (
                  <Eye size={14} className="mr-1" />
                ) : (
                  <EyeOff size={14} className="mr-1" />
                )}
                {realTime ? "Pausar" : "Ativar"}
              </Button>
            </div>

            {/* Visual Aids */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Auxiliares Visuais</Label>

              <div className="flex items-center justify-between">
                <Label htmlFor="ruler" className="text-sm">
                  Régua
                </Label>
                <Switch
                  id="ruler"
                  checked={showRuler}
                  onCheckedChange={setShowRuler}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="grid" className="text-sm">
                  Grade
                </Label>
                <Switch
                  id="grid"
                  checked={showGrid}
                  onCheckedChange={setShowGrid}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="breakpoints" className="text-sm">
                  Breakpoints
                </Label>
                <Switch
                  id="breakpoints"
                  checked={showBreakpoints}
                  onCheckedChange={setShowBreakpoints}
                />
              </div>
            </div>

            {/* Breakpoint Reference */}
            {showBreakpoints && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Referência Tailwind
                </Label>
                <div className="text-xs space-y-1 font-mono">
                  {Object.entries(TAILWIND_BREAKPOINTS).map(([name, size]) => (
                    <div
                      key={name}
                      className={`flex justify-between ${
                        getCurrentBreakpoint() === name
                          ? "text-primary font-bold"
                          : "text-muted-foreground"
                      }`}
                    >
                      <span>{name}:</span>
                      <span>{size}px+</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Visual Overlays */}
      {showRuler && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {/* Horizontal Ruler */}
          <div className="absolute top-0 left-0 w-full h-6 bg-black/80 text-white text-xs font-mono flex items-center px-2">
            Largura: {currentViewport?.width || windowSize.width}px
          </div>
          {/* Vertical Ruler */}
          <div className="absolute top-0 left-0 w-6 h-full bg-black/80 text-white text-xs font-mono flex items-start justify-center pt-8">
            <div
              className="transform -rotate-90 origin-center"
              style={{ writingMode: "vertical-lr" }}
            >
              Altura: {currentViewport?.height || windowSize.height}px
            </div>
          </div>
        </div>
      )}

      {showGrid && (
        <div
          className="fixed inset-0 pointer-events-none z-40 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />
      )}
    </>
  );
};

export default ResponsiveInspector;
