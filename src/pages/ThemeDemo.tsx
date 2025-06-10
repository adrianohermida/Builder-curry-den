/**
 * 🎯 THEME DEMO - DEMONSTRAÇÃO DO SISTEMA DE TEMAS
 *
 * Página para demonstrar e testar:
 * - Novo sidebar sem cor preta no hover
 * - Sistema de cores por modo (cliente/admin)
 * - Switch de modo escuro
 * - Color picker personalizado
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Palette,
  Moon,
  Sun,
  User,
  Settings,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";

// Theme system
import { useTheme } from "@/lib/themeSystem";

// Color picker
import ColorPicker from "@/components/Layout/ColorPicker";

const ThemeDemo: React.FC = () => {
  const {
    colors,
    config,
    toggleTheme,
    setUserMode,
    isAdminMode,
    isClientMode,
    resetToDefault,
  } = useTheme();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: colors.text }}>
            Sistema de Temas Refatorado
          </h1>
          <p className="text-lg mt-2" style={{ color: colors.textMuted }}>
            Demonstração das novas funcionalidades de personalização
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Badge
            variant="outline"
            className="px-3 py-1"
            style={{
              borderColor: colors.primary,
              color: colors.primary,
              backgroundColor: `${colors.primary}10`,
            }}
          >
            {isAdminMode() ? "Modo Admin" : "Modo Cliente"}
          </Badge>
          <Badge
            variant="outline"
            className="px-3 py-1"
            style={{
              borderColor: colors.border,
              color: colors.textMuted,
            }}
          >
            {config.themeMode === "dark" ? "Tema Escuro" : "Tema Claro"}
          </Badge>
        </div>
      </div>

      <Separator style={{ backgroundColor: colors.border }} />

      {/* Controles Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controle de Modo de Usuário */}
        <Card
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <CardHeader>
            <CardTitle
              className="flex items-center"
              style={{ color: colors.text }}
            >
              <User size={20} className="mr-2" />
              Modo de Usuário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button
                variant={isClientMode() ? "default" : "outline"}
                onClick={() => setUserMode("client")}
                className="w-full justify-start"
                style={
                  isClientMode()
                    ? { backgroundColor: "#3b82f6", color: "white" }
                    : { borderColor: colors.border, color: colors.text }
                }
              >
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                Modo Cliente (Azul)
              </Button>

              <Button
                variant={isAdminMode() ? "default" : "outline"}
                onClick={() => setUserMode("admin")}
                className="w-full justify-start"
                style={
                  isAdminMode()
                    ? { backgroundColor: "#dc2626", color: "white" }
                    : { borderColor: colors.border, color: colors.text }
                }
              >
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                Modo Admin (Vermelho)
              </Button>
            </div>

            <p className="text-xs" style={{ color: colors.textMuted }}>
              {isAdminMode()
                ? "Tema vermelho para funcionalidades administrativas"
                : "Tema azul para área do cliente"}
            </p>
          </CardContent>
        </Card>

        {/* Controle de Tema Claro/Escuro */}
        <Card
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <CardHeader>
            <CardTitle
              className="flex items-center"
              style={{ color: colors.text }}
            >
              {config.themeMode === "dark" ? (
                <Moon size={20} className="mr-2" />
              ) : (
                <Sun size={20} className="mr-2" />
              )}
              Modo de Exibição
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={toggleTheme}
              className="w-full"
              style={{
                backgroundColor: colors.primary,
                color: colors.primaryText,
              }}
            >
              {config.themeMode === "dark" ? (
                <>
                  <Sun size={16} className="mr-2" />
                  Ativar Modo Claro
                </>
              ) : (
                <>
                  <Moon size={16} className="mr-2" />
                  Ativar Modo Escuro
                </>
              )}
            </Button>

            <p className="text-xs" style={{ color: colors.textMuted }}>
              Switch entre tema claro e escuro com ícone de ativação/desativação
            </p>
          </CardContent>
        </Card>

        {/* Color Picker */}
        <Card
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <CardHeader>
            <CardTitle
              className="flex items-center"
              style={{ color: colors.text }}
            >
              <Palette size={20} className="mr-2" />
              Cores Personalizadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ColorPicker />

            <Button
              variant="outline"
              onClick={resetToDefault}
              className="w-full"
              style={{
                borderColor: colors.border,
                color: colors.textMuted,
              }}
            >
              Restaurar Padrão
            </Button>

            <p className="text-xs" style={{ color: colors.textMuted }}>
              Personalize as cores do tema ou use as predefinições
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Demonstração Visual */}
      <Card
        style={{ backgroundColor: colors.surface, borderColor: colors.border }}
      >
        <CardHeader>
          <CardTitle style={{ color: colors.text }}>
            Demonstração Visual das Cores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Cor Primária */}
            <div className="text-center space-y-2">
              <div
                className="w-16 h-16 rounded-lg mx-auto border"
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.border,
                }}
              />
              <p className="text-sm font-medium" style={{ color: colors.text }}>
                Primária
              </p>
              <p
                className="text-xs font-mono"
                style={{ color: colors.textMuted }}
              >
                {colors.primary}
              </p>
            </div>

            {/* Cor Secundária */}
            <div className="text-center space-y-2">
              <div
                className="w-16 h-16 rounded-lg mx-auto border"
                style={{
                  backgroundColor: colors.secondary,
                  borderColor: colors.border,
                }}
              />
              <p className="text-sm font-medium" style={{ color: colors.text }}>
                Secundária
              </p>
              <p
                className="text-xs font-mono"
                style={{ color: colors.textMuted }}
              >
                {colors.secondary}
              </p>
            </div>

            {/* Cor de Fundo */}
            <div className="text-center space-y-2">
              <div
                className="w-16 h-16 rounded-lg mx-auto border"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                }}
              />
              <p className="text-sm font-medium" style={{ color: colors.text }}>
                Fundo
              </p>
              <p
                className="text-xs font-mono"
                style={{ color: colors.textMuted }}
              >
                {colors.background}
              </p>
            </div>

            {/* Cor de Destaque */}
            <div className="text-center space-y-2">
              <div
                className="w-16 h-16 rounded-lg mx-auto border"
                style={{
                  backgroundColor: colors.accent,
                  borderColor: colors.border,
                }}
              />
              <p className="text-sm font-medium" style={{ color: colors.text }}>
                Destaque
              </p>
              <p
                className="text-xs font-mono"
                style={{ color: colors.textMuted }}
              >
                {colors.accent}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demonstração de Componentes */}
      <Card
        style={{ backgroundColor: colors.surface, borderColor: colors.border }}
      >
        <CardHeader>
          <CardTitle style={{ color: colors.text }}>
            Componentes com Nova Paleta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Botões */}
          <div className="space-y-2">
            <p className="font-medium" style={{ color: colors.text }}>
              Botões
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                style={{
                  backgroundColor: colors.primary,
                  color: colors.primaryText,
                }}
              >
                Primário
              </Button>
              <Button
                variant="outline"
                style={{
                  borderColor: colors.primary,
                  color: colors.primary,
                }}
              >
                Outline
              </Button>
              <Button variant="ghost" style={{ color: colors.textMuted }}>
                Ghost
              </Button>
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-2">
            <p className="font-medium" style={{ color: colors.text }}>
              Badges
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge
                style={{
                  backgroundColor: `${colors.primary}20`,
                  color: colors.primary,
                }}
              >
                Informação
              </Badge>
              <Badge
                style={{
                  backgroundColor: "#10b98120",
                  color: "#10b981",
                }}
              >
                Sucesso
              </Badge>
              <Badge
                style={{
                  backgroundColor: "#f59e0b20",
                  color: "#f59e0b",
                }}
              >
                Aviso
              </Badge>
              <Badge
                style={{
                  backgroundColor: "#ef444420",
                  color: "#ef4444",
                }}
              >
                Erro
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instruções */}
      <Card
        style={{ backgroundColor: colors.surface, borderColor: colors.border }}
      >
        <CardHeader>
          <CardTitle style={{ color: colors.text }}>
            Como Testar as Melhorias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: colors.primary }}
              >
                1
              </div>
              <div>
                <p className="font-medium" style={{ color: colors.text }}>
                  Teste o Sidebar
                </p>
                <p className="text-sm" style={{ color: colors.textMuted }}>
                  Navegue pelos itens do menu lateral e observe que não há mais
                  cor preta no hover
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: colors.primary }}
              >
                2
              </div>
              <div>
                <p className="font-medium" style={{ color: colors.text }}>
                  Mude os Modos
                </p>
                <p className="text-sm" style={{ color: colors.textMuted }}>
                  Alterne entre Modo Cliente (azul) e Admin (vermelho) e veja as
                  cores mudarem
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: colors.primary }}
              >
                3
              </div>
              <div>
                <p className="font-medium" style={{ color: colors.text }}>
                  Toggle Tema Escuro
                </p>
                <p className="text-sm" style={{ color: colors.textMuted }}>
                  Use o switch com ícone de lua/sol para alternar entre claro e
                  escuro
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: colors.primary }}
              >
                4
              </div>
              <div>
                <p className="font-medium" style={{ color: colors.text }}>
                  Personalize Cores
                </p>
                <p className="text-sm" style={{ color: colors.textMuted }}>
                  Use o color picker no sidebar para escolher cores
                  personalizadas
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeDemo;
