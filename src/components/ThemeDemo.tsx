/**
 * 🎨 THEME DEMO - DEMONSTRAÇÃO DE TEMAS
 *
 * Componente para demonstrar e testar o sistema de temas:
 * - Troca entre claro, escuro e sistema
 * - Cores primárias personalizáveis
 * - Visualização em tempo real
 */

import React, { useState, useEffect } from "react";
import { Sun, Moon, Monitor, Palette, Settings } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Theme utilities
import {
  loadThemeConfig,
  saveThemeConfig,
  applyThemeConfig,
  getNextTheme,
  getThemeDisplayName,
  getPrimaryColorDisplayName,
  type ThemeConfig,
  type ThemeMode,
  type PrimaryColor,
} from "@/utils/themeUtils";

interface ThemeDemoProps {
  className?: string;
}

const THEME_COLORS: Array<{
  value: PrimaryColor;
  name: string;
  color: string;
}> = [
  { value: "blue", name: "Azul", color: "#3b82f6" },
  { value: "green", name: "Verde", color: "#10b981" },
  { value: "purple", name: "Roxo", color: "#8b5cf6" },
  { value: "orange", name: "Laranja", color: "#f59e0b" },
];

export const ThemeDemo: React.FC<ThemeDemoProps> = ({ className }) => {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() =>
    loadThemeConfig(),
  );

  // Update theme when config changes
  useEffect(() => {
    applyThemeConfig(themeConfig);
    saveThemeConfig(themeConfig);
  }, [themeConfig]);

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeConfig((prev) => ({
      ...prev,
      mode,
    }));
  };

  const handleColorChange = (primaryColor: PrimaryColor) => {
    setThemeConfig((prev) => ({
      ...prev,
      primaryColor,
    }));
  };

  const toggleTheme = () => {
    const nextTheme = getNextTheme(themeConfig.mode);
    handleThemeChange(nextTheme);
  };

  const getThemeIcon = (mode: ThemeMode) => {
    switch (mode) {
      case "light":
        return <Sun size={16} />;
      case "dark":
        return <Moon size={16} />;
      case "system":
        return <Monitor size={16} />;
      default:
        return <Monitor size={16} />;
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Quick Theme Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="p-2"
        title={`Tema atual: ${getThemeDisplayName(themeConfig.mode)}`}
      >
        {getThemeIcon(themeConfig.mode)}
      </Button>

      {/* Advanced Theme Options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <Palette size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Aparência</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Tema
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleThemeChange("light")}>
            <Sun size={16} className="mr-2" />
            <span>Claro</span>
            {themeConfig.mode === "light" && (
              <Badge variant="secondary" className="ml-auto text-xs">
                Ativo
              </Badge>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
            <Moon size={16} className="mr-2" />
            <span>Escuro</span>
            {themeConfig.mode === "dark" && (
              <Badge variant="secondary" className="ml-auto text-xs">
                Ativo
              </Badge>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("system")}>
            <Monitor size={16} className="mr-2" />
            <span>Sistema</span>
            {themeConfig.mode === "system" && (
              <Badge variant="secondary" className="ml-auto text-xs">
                Ativo
              </Badge>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Cor Principal
          </DropdownMenuLabel>
          {THEME_COLORS.map((color) => (
            <DropdownMenuItem
              key={color.value}
              onClick={() => handleColorChange(color.value)}
            >
              <div
                className="w-4 h-4 rounded-full mr-2 border"
                style={{ backgroundColor: color.color }}
              />
              <span>{color.name}</span>
              {themeConfig.primaryColor === color.value && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  Ativo
                </Badge>
              )}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-xs text-muted-foreground">
            <Settings size={14} className="mr-2" />
            <span>
              {getThemeDisplayName(themeConfig.mode)} •{" "}
              {getPrimaryColorDisplayName(themeConfig.primaryColor)}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ThemeDemo;
