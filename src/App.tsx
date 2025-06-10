/**
 * 🎯 APP COMPONENT - SISTEMA CORRIGIDO ATIVO
 *
 * Main application component usando o sistema totalmente corrigido:
 * - CorrectedRouter com layout responsivo
 * - ThemeInitializer para tema completo
 * - Mobile-first design
 * - Cores sólidas sem transparências
 */

import React from "react";
import RobustRouter from "@/router/robust";

// Sistema de tema corrigido completo
import ThemeInitializer from "@/components/ThemeInitializer";

// Global styles corrigidos
import "@/styles/globals.css";
import "@/styles/professional.css";

// Import environment utilities
import { IS_DEVELOPMENT } from "@/lib/env";

// Development tools
import DebugPanel from "@/components/Debug/DebugPanel";
import DesignFixer from "@/components/DesignFixer";

function App() {
  return (
    <ThemeInitializer>
      <RobustRouter />

      {/* Development Tools - Development Only */}
      {IS_DEVELOPMENT && <DebugPanel />}

      {/* Design Fixer - Always Available */}
      <DesignFixer />
    </ThemeInitializer>
  );
}

export default App;
