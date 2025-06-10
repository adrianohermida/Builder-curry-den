/**
 * 🎯 COLOR PICKER - PERSONALIZAÇÃO DE CORES DE TEMA
 *
 * Componente para personalizar as cores do tema:
 * - Color picker nativo do browser
 * - Cores predefinidas populares
 * - Preview em tempo real
 * - Reset para padrões
 */

import React, { useState, useCallback } from "react";
import { Palette, RotateCcw, Check } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

// Theme system
import { useTheme } from "@/lib/themeSystem";

// ===== TYPES =====
interface ColorPickerProps {
  trigger?: React.ReactNode;
  className?: string;
}

interface PresetColor {
  name: string;
  color: string;
  description?: string;
}

// ===== PRESET COLORS =====
const PRESET_COLORS: PresetColor[] = [
  // Blues (Client Mode)
  {
    name: "Azul Clássico",
    color: "#3b82f6",
    description: "Azul padrão cliente",
  },
  { name: "Azul Céu", color: "#0ea5e9", description: "Azul claro" },
  { name: "Azul Índigo", color: "#6366f1", description: "Azul roxeado" },
  { name: "Azul Escuro", color: "#1e40af", description: "Azul profundo" },

  // Reds (Admin Mode)
  {
    name: "Vermelho Clássico",
    color: "#dc2626",
    description: "Vermelho padrão admin",
  },
  { name: "Vermelho Rosa", color: "#e11d48", description: "Vermelho rosado" },
  {
    name: "Vermelho Escuro",
    color: "#991b1b",
    description: "Vermelho profundo",
  },

  // Greens
  { name: "Verde Esmeralda", color: "#10b981", description: "Verde moderno" },
  { name: "Verde Limão", color: "#84cc16", description: "Verde claro" },
  { name: "Verde Escuro", color: "#047857", description: "Verde profundo" },

  // Purples
  { name: "Roxo Violeta", color: "#8b5cf6", description: "Roxo moderno" },
  { name: "Roxo Rosa", color: "#a855f7", description: "Roxo rosado" },
  { name: "Roxo Escuro", color: "#6b21a8", description: "Roxo profundo" },

  // Others
  { name: "Laranja", color: "#f97316", description: "Laranja vibrante" },
  { name: "Amarelo", color: "#eab308", description: "Amarelo dourado" },
  { name: "Rosa", color: "#ec4899", description: "Rosa moderno" },
  { name: "Teal", color: "#14b8a6", description: "Verde azulado" },
  { name: "Cinza", color: "#6b7280", description: "Cinza neutro" },
];

// ===== COLOR PICKER COMPONENT =====
const ColorPicker: React.FC<ColorPickerProps> = ({
  trigger,
  className = "",
}) => {
  const {
    colors,
    config,
    setPrimaryColor,
    resetToDefault,
    isAdminMode,
    isClientMode,
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors.primary);

  // ===== HANDLERS =====
  const handleColorChange = useCallback(
    (color: string) => {
      setSelectedColor(color);
      setPrimaryColor(color);
    },
    [setPrimaryColor],
  );

  const handlePresetClick = useCallback(
    (preset: PresetColor) => {
      handleColorChange(preset.color);
    },
    [handleColorChange],
  );

  const handleReset = useCallback(() => {
    resetToDefault();
    setSelectedColor(colors.primary);
  }, [resetToDefault, colors.primary]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const color = e.target.value;
      handleColorChange(color);
    },
    [handleColorChange],
  );

  // ===== RENDER HELPERS =====
  const renderPresetColors = () => {
    // Filter presets based on current mode
    const relevantColors = PRESET_COLORS.filter((preset) => {
      if (isAdminMode()) {
        return (
          preset.name.includes("Vermelho") ||
          (!preset.name.includes("Azul") && !preset.name.includes("Verde"))
        );
      }
      if (isClientMode()) {
        return (
          preset.name.includes("Azul") || !preset.name.includes("Vermelho")
        );
      }
      return true;
    });

    return (
      <div className="grid grid-cols-4 gap-2">
        {relevantColors.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handlePresetClick(preset)}
            className="group relative w-8 h-8 rounded-lg border-2 transition-all duration-200 hover:scale-110 hover:shadow-md"
            style={{
              backgroundColor: preset.color,
              borderColor:
                selectedColor === preset.color ? "#fff" : "transparent",
              boxShadow:
                selectedColor === preset.color
                  ? `0 0 0 2px ${preset.color}`
                  : "none",
            }}
            title={preset.description}
          >
            {selectedColor === preset.color && (
              <Check size={14} className="absolute inset-0 m-auto text-white" />
            )}
          </button>
        ))}
      </div>
    );
  };

  const renderColorInput = () => (
    <div className="space-y-3">
      <Label className="text-sm font-medium" style={{ color: colors.text }}>
        Cor Personalizada
      </Label>
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={selectedColor}
          onChange={handleInputChange}
          className="w-12 h-12 rounded-lg border cursor-pointer"
          style={{ borderColor: colors.border }}
        />
        <div className="flex-1">
          <input
            type="text"
            value={selectedColor}
            onChange={(e) => {
              const value = e.target.value;
              if (/^#[0-9A-F]{6}$/i.test(value)) {
                handleColorChange(value);
              }
            }}
            className="w-full px-3 py-2 text-sm border rounded-lg font-mono"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text,
            }}
            placeholder="#000000"
          />
        </div>
      </div>
    </div>
  );

  const renderModeInfo = () => (
    <div
      className="p-3 rounded-lg border"
      style={{
        backgroundColor: `${colors.primary}10`,
        borderColor: `${colors.primary}30`,
      }}
    >
      <div className="flex items-center space-x-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: colors.primary }}
        />
        <span className="text-sm font-medium" style={{ color: colors.primary }}>
          {isAdminMode() ? "Modo Admin" : "Modo Cliente"}
        </span>
      </div>
      <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
        {isAdminMode()
          ? "Cores vermelhas recomendadas para administração"
          : "Cores azuis recomendadas para área do cliente"}
      </p>
    </div>
  );

  // ===== DEFAULT TRIGGER =====
  const defaultTrigger = (
    <Button
      variant="ghost"
      size="sm"
      className={`rounded-xl ${className}`}
      style={{
        color: colors.textMuted,
        backgroundColor: "transparent",
      }}
    >
      <Palette size={16} className="mr-2" />
      Personalizar Cores
    </Button>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{trigger || defaultTrigger}</PopoverTrigger>
      <PopoverContent
        className="w-80 p-6"
        align="start"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3
              className="font-semibold text-lg"
              style={{ color: colors.text }}
            >
              Personalizar Tema
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-xs"
              style={{ color: colors.textMuted }}
            >
              <RotateCcw size={14} className="mr-1" />
              Reset
            </Button>
          </div>

          {/* Mode Info */}
          {renderModeInfo()}

          {/* Preset Colors */}
          <div className="space-y-3">
            <Label
              className="text-sm font-medium"
              style={{ color: colors.text }}
            >
              Cores Predefinidas
            </Label>
            {renderPresetColors()}
          </div>

          {/* Custom Color Input */}
          {renderColorInput()}

          {/* Current Theme Status */}
          <div
            className="text-xs p-2 rounded border"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border,
              color: colors.textMuted,
            }}
          >
            <strong>Status:</strong>{" "}
            {config.themeMode === "custom" ? "Personalizado" : "Padrão"} •
            {config.userMode === "admin" ? " Admin" : " Cliente"} •
            {config.themeMode === "dark" ? " Escuro" : " Claro"}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
