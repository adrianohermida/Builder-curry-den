import React, { useState } from "react";
import {
  Sun,
  Moon,
  Monitor,
  Palette,
  Eye,
  Type,
  Accessibility,
  Download,
  Upload,
  RotateCcw,
  Check,
  Smartphone,
  Tablet,
  Monitor as DesktopIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useTheme,
  themePresets,
  type ThemeMode,
  type ColorTheme,
} from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ThemeToggleProps {
  variant?: "button" | "dropdown" | "full";
  showLabel?: boolean;
  className?: string;
}

const modeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const colorThemes: Array<{ key: ColorTheme; name: string; color: string }> = [
  { key: "default", name: "Padrão", color: "hsl(221.2, 83.2%, 53.3%)" },
  { key: "blue", name: "Azul", color: "hsl(221.2, 83.2%, 53.3%)" },
  { key: "green", name: "Verde", color: "hsl(142.1, 76.2%, 36.3%)" },
  { key: "purple", name: "Roxo", color: "hsl(262.1, 83.3%, 57.8%)" },
  { key: "orange", name: "Laranja", color: "hsl(24.6, 95%, 53.1%)" },
  { key: "red", name: "Vermelho", color: "hsl(0, 72.2%, 50.6%)" },
];

const responsiveBreakpoints = [
  { name: "Mobile", width: 360, icon: Smartphone },
  { name: "Tablet", width: 768, icon: Tablet },
  { name: "Desktop", width: 1280, icon: DesktopIcon },
];

export function ThemeToggle({
  variant = "dropdown",
  showLabel = false,
  className,
}: ThemeToggleProps) {
  const {
    config,
    setMode,
    setColorTheme,
    setAccessibility,
    setBranding,
    resetTheme,
    exportTheme,
    importTheme,
    isDark,
    effectiveMode,
  } = useTheme();

  const [importText, setImportText] = useState("");
  const [responsiveMode, setResponsiveMode] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState(1280);

  const handleModeChange = (mode: ThemeMode) => {
    setMode(mode);
    toast.success(
      `Tema alterado para ${mode === "system" ? "sistema" : mode === "dark" ? "escuro" : "claro"}`,
    );
  };

  const handleColorThemeChange = (colorTheme: ColorTheme) => {
    setColorTheme(colorTheme);
    const themeName =
      colorThemes.find((t) => t.key === colorTheme)?.name || colorTheme;
    toast.success(`Cor do tema alterada para ${themeName}`);
  };

  const handleExportTheme = () => {
    const themeData = exportTheme();
    navigator.clipboard
      .writeText(themeData)
      .then(() => {
        toast.success("Tema copiado para área de transferência");
      })
      .catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = themeData;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        toast.success("Tema copiado para área de transferência");
      });
  };

  const handleImportTheme = () => {
    if (importTheme(importText)) {
      toast.success("Tema importado com sucesso");
      setImportText("");
    } else {
      toast.error("Erro ao importar tema. Verifique o formato dos dados.");
    }
  };

  const applyPreset = (presetKey: keyof typeof themePresets) => {
    const preset = themePresets[presetKey];
    setMode(preset.mode);
    setColorTheme(preset.colorTheme);
    setAccessibility(preset.accessibility);
    toast.success(`Preset "${presetKey}" aplicado com sucesso`);
  };

  const toggleResponsiveMode = () => {
    setResponsiveMode(!responsiveMode);
    if (!responsiveMode) {
      // Enable responsive mode
      document.body.style.width = `${currentBreakpoint}px`;
      document.body.style.margin = "0 auto";
      document.body.style.border = "2px solid hsl(var(--border))";
      document.body.style.boxShadow = "0 4px 6px -1px rgb(0 0 0 / 0.1)";
      toast.success(`Modo responsivo ativado (${currentBreakpoint}px)`);
    } else {
      // Disable responsive mode
      document.body.style.width = "";
      document.body.style.margin = "";
      document.body.style.border = "";
      document.body.style.boxShadow = "";
      toast.success("Modo responsivo desativado");
    }
  };

  const changeBreakpoint = (width: number) => {
    setCurrentBreakpoint(width);
    if (responsiveMode) {
      document.body.style.width = `${width}px`;
      toast.success(`Viewport alterado para ${width}px`);
    }
  };

  if (variant === "button") {
    const ModeIcon = modeIcons[config.mode];
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const modes: ThemeMode[] = ["light", "dark", "system"];
          const currentIndex = modes.indexOf(config.mode);
          const nextMode = modes[(currentIndex + 1) % modes.length];
          handleModeChange(nextMode);
        }}
        className={cn("gap-2", className)}
      >
        <ModeIcon className="h-4 w-4" />
        {showLabel && (
          <span className="hidden sm:inline">
            {config.mode === "system"
              ? "Sistema"
              : config.mode === "dark"
                ? "Escuro"
                : "Claro"}
          </span>
        )}
      </Button>
    );
  }

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn("gap-2", className)}
          >
            <Palette className="h-4 w-4" />
            {showLabel && <span className="hidden sm:inline">Tema</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Configurações de Tema
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Theme Mode */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2">
              {React.createElement(modeIcons[config.mode], {
                className: "h-4 w-4",
              })}
              Modo do Tema
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {(["light", "dark", "system"] as ThemeMode[]).map((mode) => {
                const Icon = modeIcons[mode];
                return (
                  <DropdownMenuCheckboxItem
                    key={mode}
                    checked={config.mode === mode}
                    onCheckedChange={() => handleModeChange(mode)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {mode === "system"
                      ? "Sistema"
                      : mode === "dark"
                        ? "Escuro"
                        : "Claro"}
                    {mode === "system" && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {effectiveMode === "dark" ? "Escuro" : "Claro"}
                      </Badge>
                    )}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Color Theme */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border border-border"
                style={{
                  backgroundColor: colorThemes.find(
                    (t) => t.key === config.colorTheme,
                  )?.color,
                }}
              />
              Cor do Tema
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {colorThemes.map((theme) => (
                <DropdownMenuCheckboxItem
                  key={theme.key}
                  checked={config.colorTheme === theme.key}
                  onCheckedChange={() => handleColorThemeChange(theme.key)}
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: theme.color }}
                  />
                  {theme.name}
                  {config.colorTheme === theme.key && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Accessibility */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2">
              <Accessibility className="h-4 w-4" />
              Acessibilidade
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuCheckboxItem
                checked={config.accessibility.highContrast}
                onCheckedChange={(checked) =>
                  setAccessibility({
                    ...config.accessibility,
                    highContrast: checked,
                  })
                }
              >
                <Eye className="mr-2 h-4 w-4" />
                Alto Contraste
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={config.accessibility.largeText}
                onCheckedChange={(checked) =>
                  setAccessibility({
                    ...config.accessibility,
                    largeText: checked,
                  })
                }
              >
                <Type className="mr-2 h-4 w-4" />
                Texto Grande
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={config.accessibility.reducedMotion}
                onCheckedChange={(checked) =>
                  setAccessibility({
                    ...config.accessibility,
                    reducedMotion: checked,
                  })
                }
              >
                Movimento Reduzido
              </DropdownMenuCheckboxItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Responsive Inspector */}
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Inspetor Responsivo
              {responsiveMode && (
                <Badge variant="secondary" className="text-xs">
                  Ativo
                </Badge>
              )}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={toggleResponsiveMode}>
                {responsiveMode ? "Desativar" : "Ativar"} Modo Responsivo
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {responsiveBreakpoints.map((breakpoint) => {
                const Icon = breakpoint.icon;
                return (
                  <DropdownMenuCheckboxItem
                    key={breakpoint.width}
                    checked={currentBreakpoint === breakpoint.width}
                    onCheckedChange={() => changeBreakpoint(breakpoint.width)}
                    disabled={!responsiveMode}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {breakpoint.name} ({breakpoint.width}px)
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Presets */}
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Presets</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => applyPreset("corporate")}>
                Corporativo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyPreset("modern")}>
                Moderno
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyPreset("accessible")}>
                Acessível
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          {/* Advanced Settings */}
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Palette className="mr-2 h-4 w-4" />
              Configurações Avançadas
            </DropdownMenuItem>
          </DialogTrigger>

          {/* Export/Import */}
          <DropdownMenuItem onClick={handleExportTheme}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Tema
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => resetTheme()}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Resetar Tema
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Configurações Avançadas de Tema
          </DialogTitle>
          <DialogDescription>
            Personalize completamente a aparência e comportamento do sistema.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="colors">Cores</TabsTrigger>
            <TabsTrigger value="accessibility">Acessibilidade</TabsTrigger>
            <TabsTrigger value="branding">Marca</TabsTrigger>
            <TabsTrigger value="import-export">Import/Export</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Modo do Tema</Label>
                <div className="flex gap-2 mt-2">
                  {(["light", "dark", "system"] as ThemeMode[]).map((mode) => {
                    const Icon = modeIcons[mode];
                    return (
                      <Button
                        key={mode}
                        variant={config.mode === mode ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleModeChange(mode)}
                        className="flex items-center gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {mode === "system"
                          ? "Sistema"
                          : mode === "dark"
                            ? "Escuro"
                            : "Claro"}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label>Paleta de Cores</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {colorThemes.map((theme) => (
                    <Button
                      key={theme.key}
                      variant={
                        config.colorTheme === theme.key ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleColorThemeChange(theme.key)}
                      className="flex items-center gap-2 justify-start"
                    >
                      <div
                        className="w-3 h-3 rounded-full border border-border"
                        style={{ backgroundColor: theme.color }}
                      />
                      {theme.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alto Contraste</Label>
                  <div className="text-sm text-muted-foreground">
                    Aumenta o contraste para melhor legibilidade
                  </div>
                </div>
                <Switch
                  checked={config.accessibility.highContrast}
                  onCheckedChange={(checked) =>
                    setAccessibility({
                      ...config.accessibility,
                      highContrast: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Texto Grande</Label>
                  <div className="text-sm text-muted-foreground">
                    Aumenta o tamanho da fonte em 20%
                  </div>
                </div>
                <Switch
                  checked={config.accessibility.largeText}
                  onCheckedChange={(checked) =>
                    setAccessibility({
                      ...config.accessibility,
                      largeText: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Movimento Reduzido</Label>
                  <div className="text-sm text-muted-foreground">
                    Reduz animações e transições
                  </div>
                </div>
                <Switch
                  checked={config.accessibility.reducedMotion}
                  onCheckedChange={(checked) =>
                    setAccessibility({
                      ...config.accessibility,
                      reducedMotion: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Foco Visível</Label>
                  <div className="text-sm text-muted-foreground">
                    Destaca elementos em foco para navegação por teclado
                  </div>
                </div>
                <Switch
                  checked={config.accessibility.focusVisible}
                  onCheckedChange={(checked) =>
                    setAccessibility({
                      ...config.accessibility,
                      focusVisible: checked,
                    })
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="branding" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="company-name">Nome da Empresa</Label>
                <Input
                  id="company-name"
                  value={config.branding.companyName}
                  onChange={(e) =>
                    setBranding({
                      ...config.branding,
                      companyName: e.target.value,
                    })
                  }
                  placeholder="Nome da sua empresa"
                />
              </div>

              <div>
                <Label htmlFor="font-family">Família da Fonte</Label>
                <Input
                  id="font-family"
                  value={config.branding.fontFamily}
                  onChange={(e) =>
                    setBranding({
                      ...config.branding,
                      fontFamily: e.target.value,
                    })
                  }
                  placeholder="Inter, system-ui, sans-serif"
                />
              </div>

              <div>
                <Label>Raio da Borda: {config.branding.borderRadius}px</Label>
                <Slider
                  value={[config.branding.borderRadius]}
                  onValueChange={(value) =>
                    setBranding({ ...config.branding, borderRadius: value[0] })
                  }
                  max={20}
                  min={0}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="import-export" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Exportar Configurações</Label>
                <Button onClick={handleExportTheme} className="w-full mt-2">
                  <Download className="mr-2 h-4 w-4" />
                  Copiar Tema para Área de Transferência
                </Button>
              </div>

              <div>
                <Label htmlFor="import-textarea">Importar Configurações</Label>
                <Textarea
                  id="import-textarea"
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Cole aqui as configurações de tema exportadas..."
                  rows={6}
                  className="mt-2"
                />
                <Button
                  onClick={handleImportTheme}
                  disabled={!importText.trim()}
                  className="w-full mt-2"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Importar Tema
                </Button>
              </div>

              <div>
                <Button
                  onClick={() => {
                    resetTheme();
                    toast.success("Tema resetado para configurações padrão");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Resetar para Padrão
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
