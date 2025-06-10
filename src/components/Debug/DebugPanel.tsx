/**
 * 🔧 DEBUG PANEL - PAINEL DE DEBUG
 *
 * Painel de debug para desenvolvimento
 */

import React, { useState } from "react";

const DebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-[9999]">
      {isOpen && (
        <div className="bg-black text-white p-4 rounded-lg shadow-lg mb-2 max-w-xs">
          <h3 className="font-bold text-sm mb-2">Debug Info</h3>
          <div className="text-xs space-y-1">
            <div>Environment: {process.env.NODE_ENV}</div>
            <div>Route: {window.location.pathname}</div>
            <div>Theme: {document.documentElement.classList.toString()}</div>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white px-2 py-1 rounded text-xs"
      >
        {isOpen ? "Hide" : "Debug"}
      </button>
    </div>
  );
};

export default DebugPanel;
