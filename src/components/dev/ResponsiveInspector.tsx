import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Tablet,
  Monitor,
  RotateCcw,
  Maximize2,
  Minimize2,
  Ruler,
  Eye,
  EyeOff,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Breakpoint {
  name: string;
  width: number;
  height: number;
  icon: React.ComponentType<any>;
  description: string;
}

const breakpoints: Breakpoint[] = [
  {
    name: "Mobile Portrait",
    width: 360,
    height: 640,
    icon: Smartphone,
    description: "Galaxy S, iPhone 13 Mini",
  },
  {
    name: "Mobile Landscape",
    width: 640,
    height: 360,
    icon: Smartphone,
    description: "Mobile rotated",
  },
  {
    name: "Tablet Portrait",
    width: 768,
    height: 1024,
    icon: Tablet,
    description: "iPad, Galaxy Tab",
  },
  {
    name: "Tablet Landscape",
    width: 1024,
    height: 768,
    icon: Tablet,
    description: "Tablet rotated",
  },
  {
    name: "Desktop",
    width: 1280,
    height: 720,
    icon: Monitor,
    description: "Standard desktop",
  },
  {
    name: "Large Desktop",
    width: 1920,
    height: 1080,
    icon: Monitor,
    description: "Full HD display",
  },
  {
    name: "Ultrawide",
    width: 2560,
    height: 1440,
    icon: Monitor,
    description: "Ultrawide monitor",
  },
];

interface ResponsiveInspectorProps {
  className?: string;
}

export function ResponsiveInspector({ className }: ResponsiveInspectorProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>(
    breakpoints[4],
  );
  const [customWidth, setCustomWidth] = useState(1280);
  const [customHeight, setCustomHeight] = useState(720);
  const [showRuler, setShowRuler] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get current viewport dimensions
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Apply responsive mode
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    if (isActive) {
      // Store original styles
      const originalBodyStyle = {
        width: body.style.width,
        height: body.style.height,
        margin: body.style.margin,
        border: body.style.border,
        boxShadow: body.style.boxShadow,
        overflow: body.style.overflow,
      };

      const originalHtmlStyle = {
        overflow: html.style.overflow,
      };

      // Apply responsive styles
      body.style.width = `${currentBreakpoint.width}px`;
      body.style.height = `${currentBreakpoint.height}px`;
      body.style.margin = "20px auto";
      body.style.border = "2px solid hsl(var(--border))";
      body.style.boxShadow =
        "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)";
      body.style.overflow = "auto";
      body.style.opacity = opacity.toString();

      html.style.overflow = "auto";

      // Add grid overlay if enabled
      if (showGrid) {
        body.style.backgroundImage = `
          linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
        `;
        body.style.backgroundSize = "20px 20px";
      } else {
        body.style.backgroundImage = "";
        body.style.backgroundSize = "";
      }

      // Cleanup function
      return () => {
        Object.assign(body.style, originalBodyStyle);
        Object.assign(html.style, originalHtmlStyle);
        body.style.backgroundImage = "";
        body.style.backgroundSize = "";
        body.style.opacity = "";
      };
    }
  }, [isActive, currentBreakpoint, opacity, showGrid]);

  const toggleResponsiveMode = () => {
    setIsActive(!isActive);
  };

  const selectBreakpoint = (breakpoint: Breakpoint) => {
    setCurrentBreakpoint(breakpoint);
    setCustomWidth(breakpoint.width);
    setCustomHeight(breakpoint.height);
  };

  const applyCustomDimensions = () => {
    setCurrentBreakpoint({
      name: "Custom",
      width: customWidth,
      height: customHeight,
      icon: Monitor,
      description: `${customWidth}x${customHeight}`,
    });
  };

  const resetToViewport = () => {
    setIsActive(false);
    setCurrentBreakpoint(breakpoints[4]);
    setCustomWidth(1280);
    setCustomHeight(720);
    setOpacity(1);
    setShowGrid(false);
    setShowRuler(false);
  };

  // Only show in development mode
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <div className={cn("fixed bottom-4 right-4 z-50", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={isActive ? "default" : "outline"}
              size="sm"
              className="shadow-lg"
            >
              <Ruler className="h-4 w-4 mr-2" />
              {isActive ? currentBreakpoint.name : "Responsivo"}
              {isActive && (
                <Badge variant="secondary" className="ml-2">
                  {currentBreakpoint.width}x{currentBreakpoint.height}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Inspetor Responsivo
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={toggleResponsiveMode}>
              {isActive ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Desativar Modo Responsivo
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Ativar Modo Responsivo
                </>
              )}
            </DropdownMenuItem>

            {isActive && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Breakpoints Predefinidos</DropdownMenuLabel>
                {breakpoints.map((breakpoint) => {
                  const Icon = breakpoint.icon;
                  const isSelected =
                    currentBreakpoint.width === breakpoint.width &&
                    currentBreakpoint.height === breakpoint.height;

                  return (
                    <DropdownMenuItem
                      key={breakpoint.name}
                      onClick={() => selectBreakpoint(breakpoint)}
                      className={cn("flex items-center gap-2", {
                        "bg-accent": isSelected,
                      })}
                    >
                      <Icon className="h-4 w-4" />
                      <div className="flex-1">
                        <div className="font-medium">{breakpoint.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {breakpoint.width}x{breakpoint.height} •{" "}
                          {breakpoint.description}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  );
                })}

                <DropdownMenuSeparator />
                <DialogTrigger asChild>
                  <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações Avançadas
                  </DropdownMenuItem>
                </DialogTrigger>
              </>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={resetToViewport}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Resetar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Viewport Info Display */}
      {isActive && (
        <div className="fixed top-4 right-4 z-50">
          <Card className="shadow-lg">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-sm">
                <currentBreakpoint.icon className="h-4 w-4" />
                <span className="font-medium">{currentBreakpoint.name}</span>
                <Badge variant="outline">
                  {currentBreakpoint.width}x{currentBreakpoint.height}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Viewport atual: {viewportWidth}x{viewportHeight}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Grid Overlay Toggle */}
      {isActive && showGrid && (
        <div className="fixed top-20 right-4 z-50">
          <Badge variant="secondary" className="shadow-lg">
            Grade ativa (20px)
          </Badge>
        </div>
      )}

      {/* Advanced Settings Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações do Inspetor
            </DialogTitle>
            <DialogDescription>
              Ajuste as configurações do modo responsivo para teste detalhado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Custom Dimensions */}
            <div className="space-y-3">
              <Label>Dimensões Personalizadas</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label
                    htmlFor="custom-width"
                    className="text-xs text-muted-foreground"
                  >
                    Largura (px)
                  </Label>
                  <input
                    id="custom-width"
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Number(e.target.value))}
                    className="w-full px-2 py-1 text-sm border rounded"
                    min={200}
                    max={4000}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="custom-height"
                    className="text-xs text-muted-foreground"
                  >
                    Altura (px)
                  </Label>
                  <input
                    id="custom-height"
                    type="number"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Number(e.target.value))}
                    className="w-full px-2 py-1 text-sm border rounded"
                    min={200}
                    max={3000}
                  />
                </div>
              </div>
              <Button
                onClick={applyCustomDimensions}
                size="sm"
                className="w-full"
              >
                Aplicar Dimensões
              </Button>
            </div>

            {/* Opacity Control */}
            <div className="space-y-3">
              <Label>Opacidade: {Math.round(opacity * 100)}%</Label>
              <Slider
                value={[opacity]}
                onValueChange={(value) => setOpacity(value[0])}
                max={1}
                min={0.1}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Visual Aids */}
            <div className="space-y-4">
              <Label>Auxiliares Visuais</Label>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Grade de Layout</Label>
                  <p className="text-xs text-muted-foreground">
                    Mostra uma grade de 20px para alinhamento
                  </p>
                </div>
                <Switch checked={showGrid} onCheckedChange={setShowGrid} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Régua de Medidas</Label>
                  <p className="text-xs text-muted-foreground">
                    Exibe réguas nas bordas da viewport
                  </p>
                </div>
                <Switch checked={showRuler} onCheckedChange={setShowRuler} />
              </div>
            </div>

            {/* Current Viewport Info */}
            <div className="space-y-2 p-3 bg-muted rounded-lg">
              <Label className="text-sm">Informações da Viewport</Label>
              <div className="text-xs space-y-1">
                <div>
                  Atual: {viewportWidth}x{viewportHeight}px
                </div>
                <div>
                  Simulando: {currentBreakpoint.width}x
                  {currentBreakpoint.height}px
                </div>
                <div>
                  Breakpoint:{" "}
                  {viewportWidth < 640
                    ? "sm"
                    : viewportWidth < 768
                      ? "md"
                      : viewportWidth < 1024
                        ? "lg"
                        : viewportWidth < 1280
                          ? "xl"
                          : "2xl"}{" "}
                  (Tailwind CSS)
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Hook to use responsive inspector programmatically
export function useResponsiveInspector() {
  const [isActive, setIsActive] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>("desktop");

  const activate = (breakpoint?: string) => {
    setIsActive(true);
    if (breakpoint) {
      setCurrentBreakpoint(breakpoint);
    }
  };

  const deactivate = () => {
    setIsActive(false);
  };

  const getCurrentBreakpoint = () => {
    const width = window.innerWidth;
    if (width < 640) return "sm";
    if (width < 768) return "md";
    if (width < 1024) return "lg";
    if (width < 1280) return "xl";
    return "2xl";
  };

  return {
    isActive,
    currentBreakpoint,
    activate,
    deactivate,
    getCurrentBreakpoint,
  };
}

// Utility function to detect mobile devices
export function isMobile() {
  return window.innerWidth < 768;
}

// Utility function to detect tablet devices
export function isTablet() {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}

// Utility function to detect desktop devices
export function isDesktop() {
  return window.innerWidth >= 1024;
}
