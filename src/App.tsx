/**
 * 🎯 APP COMPONENT - CLEAN AND MODERN
 *
 * Main application component using the modern router system
 * with domain-based architecture and existing pages.
 */

import React, { useEffect } from "react";
import OptimizedRouter from "@/router/optimized";

// Corrected theme system
import { applyThemeToDocument } from "@/lib/correctedThemeSystem";

// Global styles
import "@/styles/globals.css";

// Import environment utilities
import { IS_DEVELOPMENT } from "@/lib/env";

// Development tools
import DebugPanel from "@/components/Debug/DebugPanel";

function App() {
  // Apply corrected theme on mount
  useEffect(() => {
    applyThemeToDocument();
  }, []);

  return (
    <>
      <OptimizedRouter />

      {/* Development Tools - Development Only */}
      {IS_DEVELOPMENT && <DebugPanel />}
    </>
  );
}

export default App;
