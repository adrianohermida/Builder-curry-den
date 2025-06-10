/**
 * 🎯 APP COMPONENT - CLEAN AND MODERN
 *
 * Main application component using the modern router system
 * with domain-based architecture and existing pages.
 */

import React from "react";
import OptimizedRouter from "@/router/optimized";

// Import environment utilities
import { IS_DEVELOPMENT } from "@/lib/env";

// Development tools
import DebugPanel from "@/components/Debug/DebugPanel";

function App() {
  return (
    <>
      <OptimizedRouter />

      {/* Development Tools - Development Only */}
      {IS_DEVELOPMENT && <DebugPanel />}
    </>
  );
}

export default App;
