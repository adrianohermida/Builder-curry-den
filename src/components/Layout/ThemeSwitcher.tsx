import { useState } from "react";
import { Sun, Moon, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
  const { theme, themeColor, setTheme, setThemeColor, toggleTheme } =
    useTheme();
  const [customColor, setCustomColor] = useState(themeColor);
  const [open, setOpen] = useState(false);

  const handleColorChange = (color: string) => {
    setThemeColor(color);
    setCustomColor(color);
  };

  const isValidHex = (color: string) => {
    return /^#([0-9A-F]{3}){1,2}$/i.test(color);
  };

  return (
    <div className="flex items-center space-x-1">
      {/* Theme toggle */}
      <Button variant="ghost" size="sm" onClick={toggleTheme} className="px-2">
        {theme === "light" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>

      {/* Color picker */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="px-2">
            <Palette className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="end">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Cor do Tema</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Escolha uma cor para personalizar o sistema
              </p>
            </div>

            {/* Color presets */}
            <div>
              <Label className="text-xs text-muted-foreground">
                Cores Recomendadas
              </Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {defaultPresets.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={cn(
                      "w-8 h-8 rounded-lg border-2 transition-all",
                      themeColor === color
                        ? "border-foreground scale-110"
                        : "border-border hover:border-muted-foreground",
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Custom color input */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Cor Personalizada
              </Label>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="#3b82f6"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (isValidHex(customColor)) {
                      handleColorChange(customColor);
                    }
                  }}
                  disabled={!isValidHex(customColor)}
                >
                  Aplicar
                </Button>
              </div>
              {customColor && !isValidHex(customColor) && (
                <p className="text-xs text-red-500">
                  Formato inválido. Use #000000
                </p>
              )}
            </div>

            {/* Color preview */}
            <div className="p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between">
                <span className="text-sm">Prévia</span>
                <Button
                  size="sm"
                  style={{
                    backgroundColor: `rgb(${document.documentElement.style.getPropertyValue("--theme-primary") || "59 130 246"})`,
                    color: "white",
                  }}
                >
                  Botão Exemplo
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
