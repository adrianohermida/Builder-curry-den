import { useState } from "react";
import { Sun, Moon, Monitor, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/providers/ThemeProvider";

export function ThemeSwitcher() {
  const { config, setMode, setColorTheme, isDark } = useTheme();

  const handleModeChange = (mode: "light" | "dark" | "system") => {
    setMode(mode);
  };

  const handleColorChange = (
    colorTheme: "default" | "blue" | "green" | "purple" | "orange" | "red",
  ) => {
    setColorTheme(colorTheme);
  };

  return (
    <div className="flex items-center space-x-1">
      {/* Quick theme toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const modes = ["light", "dark", "system"] as const;
          const currentIndex = modes.indexOf(config.mode);
          const nextMode = modes[(currentIndex + 1) % modes.length];
          handleModeChange(nextMode);
        }}
        className="px-2"
      >
        {config.mode === "light" ? (
          <Sun className="h-5 w-5" />
        ) : config.mode === "dark" ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Monitor className="h-5 w-5" />
        )}
      </Button>

      {/* Color picker */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="px-2">
            <Palette className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-2 py-1.5 text-sm font-medium">Modo do Tema</div>
          <DropdownMenuItem onClick={() => handleModeChange("light")}>
            <Sun className="mr-2 h-4 w-4" />
            Claro
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleModeChange("dark")}>
            <Moon className="mr-2 h-4 w-4" />
            Escuro
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleModeChange("system")}>
            <Monitor className="mr-2 h-4 w-4" />
            Sistema
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <div className="px-2 py-1.5 text-sm font-medium">Cor do Tema</div>
          <DropdownMenuItem onClick={() => handleColorChange("default")}>
            <div className="mr-2 h-4 w-4 rounded-full bg-blue-500 border" />
            Padrão
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleColorChange("green")}>
            <div className="mr-2 h-4 w-4 rounded-full bg-green-500 border" />
            Verde
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleColorChange("purple")}>
            <div className="mr-2 h-4 w-4 rounded-full bg-purple-500 border" />
            Roxo
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleColorChange("orange")}>
            <div className="mr-2 h-4 w-4 rounded-full bg-orange-500 border" />
            Laranja
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleColorChange("red")}>
            <div className="mr-2 h-4 w-4 rounded-full bg-red-500 border" />
            Vermelho
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
