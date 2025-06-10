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
import MinimalistRouter from "@/router/minimalist";

// Sistema de tema corrigido completo
import ThemeInitializer from "@/components/ThemeInitializer";

// Global styles corrigidos
import "@/styles/globals.css";

// Import environment utilities
import { IS_DEVELOPMENT } from "@/lib/env";

// Development tools
import DebugPanel from "@/components/Debug/DebugPanel";

function App() {
  return (
    <ThemeInitializer>
      <MinimalistRouter />

      {/* Development Tools - Development Only */}
      {IS_DEVELOPMENT && <DebugPanel />}
    </ThemeInitializer>
  );
}

export default App;
