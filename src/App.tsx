/**
 * 🎯 APP COMPONENT - CLEAN AND MODERN
 *
 * Main application component using the modern router system
 * with domain-based architecture and existing pages.
 */

import React from "react";
import AppRouter from "@/router";

// Import environment and theme utilities
import { IS_DEVELOPMENT } from "@/lib/env";

// Development tools
import DebugPanel from "@/components/Debug/DebugPanel";
import {
  LayoutSwitcher,
  MigrationStatus,
} from "@/components/Layout/LayoutMigrationWrapper";

function App() {
  return (
    <>
      <AppRouter />

      {/* Development Tools - Development Only */}
      {IS_DEVELOPMENT && (
        <>
          <DebugPanel />
          <LayoutSwitcher />
          <MigrationStatus />
        </>
      )}
    </>
  );
}

export default App;
