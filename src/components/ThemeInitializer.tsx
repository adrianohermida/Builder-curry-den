/**
 * 🎯 THEME INITIALIZER - INICIALIZADOR DO SISTEMA DE TEMAS
 *
 * Componente para inicializar o sistema de temas:
 * - Configura tema inicial
 * - Aplica CSS custom properties
 * - Executa diagnóstico
 * - Corrige problemas automaticamente
 */

import React, { useEffect } from "react";
import { useTheme } from "@/lib/themeSystem";
import { runThemeDiagnostic } from "@/lib/themeDiagnostic";
import { IS_DEVELOPMENT } from "@/lib/env";

interface ThemeInitializerProps {
  children: React.ReactNode;
}

const ThemeInitializer: React.FC<ThemeInitializerProps> = ({ children }) => {
  const { colors, config, getModeClass } = useTheme();

  // Inicializar tema ao montar
  useEffect(() => {
    // Aplicar classes de tema no body
    document.body.className = getModeClass();

    // Aplicar variáveis CSS globais
    const root = document.documentElement;

    // Cores do tema
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    // Variáveis específicas do modo
    root.style.setProperty("--mode-primary", colors.primary);
    root.style.setProperty("--mode-accent", colors.accent);

    // Variáveis para compatibilidade com Tailwind
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--primary-foreground", colors.primaryText);
    root.style.setProperty("--background", colors.background);
    root.style.setProperty("--foreground", colors.text);
    root.style.setProperty("--muted", colors.textMuted);
    root.style.setProperty("--border", colors.border);
    root.style.setProperty("--accent", colors.accent);

    // Meta theme-color para mobile
    let metaThemeColor = document.querySelector(
      'meta[name="theme-color"]',
    ) as HTMLMetaElement;
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.name = "theme-color";
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = colors.primary;

    // Meta viewport se não existir
    if (!document.querySelector('meta[name="viewport"]')) {
      const metaViewport = document.createElement("meta");
      metaViewport.name = "viewport";
      metaViewport.content = "width=device-width, initial-scale=1";
      document.head.appendChild(metaViewport);
    }

    // CSS reset para remover animações indesejadas
    const style = document.createElement("style");
    style.textContent = `
      /* Reset de animações para sidebar */
      [data-sidebar="true"] {
        transition: none !important;
        transform: none !important;
      }

      /* Cores dinâmicas baseadas no tema */
      .theme-primary {
        background-color: var(--theme-primary) !important;
        color: var(--theme-primaryText) !important;
      }

      .theme-surface {
        background-color: var(--theme-surface) !important;
        color: var(--theme-text) !important;
      }

      .theme-border {
        border-color: var(--theme-border) !important;
      }

      /* Responsividade aprimorada */
      @media (max-width: 767px) {
        [data-sidebar="true"] {
          width: 100% !important;
          max-width: 280px !important;
        }
      }

      /* Modo cliente - azul */
      .client-mode {
        --mode-color: #3b82f6;
        --mode-color-hover: #2563eb;
        --mode-color-active: #1d4ed8;
      }

      /* Modo admin - vermelho */
      .admin-mode {
        --mode-color: #dc2626;
        --mode-color-hover: #b91c1c;
        --mode-color-active: #991b1b;
      }
    `;
    document.head.appendChild(style);

    // Rodar diagnóstico em desenvolvimento
    if (IS_DEVELOPMENT) {
      setTimeout(() => {
        runThemeDiagnostic();
      }, 500);
    }

    console.log("🎨 Sistema de temas inicializado:", {
      mode: config.userMode,
      theme: config.themeMode,
      colors: colors,
    });
  }, [colors, config, getModeClass]);

  // Re-aplicar tema quando mudanças ocorrerem
  useEffect(() => {
    document.body.className = getModeClass();
  }, [getModeClass]);

  return <>{children}</>;
};

export default ThemeInitializer;
