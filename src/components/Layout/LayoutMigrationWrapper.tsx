/**
 * 🎯 LAYOUT MIGRATION WRAPPER - TRANSIÇÃO ENTRE LAYOUTS
 *
 * Componente de transição para migração gradual entre layouts:
 * - Permite alternar entre layout antigo e novo
 * - Configurável via feature flag ou query parameter
 * - Mantém compatibilidade durante migração
 * - Facilita testes A/B de layout
 */

import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

// Layouts
import MainLayout from "./MainLayout";
import UnifiedLayout from "./UnifiedLayout";

// Environment utilities
import { IS_DEVELOPMENT } from "@/lib/env";

// ===== TYPES =====
interface LayoutMigrationWrapperProps {
  children?: React.ReactNode;
  forceLayout?: "legacy" | "unified";
  featureFlag?: boolean;
}

// ===== CONFIGURATION =====
const MIGRATION_CONFIG = {
  // Feature flag para habilitar novo layout globalmente
  enableUnifiedLayout: false, // DESABILITADO - usar ProfessionalCleanLayout

  // Permitir override via query parameter em desenvolvimento
  allowQueryOverride: IS_DEVELOPMENT,

  // Query parameter para testar layouts
  queryParamName: "layout",

  // Lista de rotas que devem usar apenas o layout unificado
  unifiedOnlyRoutes: ["/beta", "/configuracao-armazenamento"],

  // Lista de rotas que devem manter o layout legado
  legacyOnlyRoutes: ["/legacy"],
};

// ===== UTILS =====
const getLayoutFromQuery = (
  searchParams: URLSearchParams,
): "legacy" | "unified" | null => {
  if (!MIGRATION_CONFIG.allowQueryOverride) return null;

  const layoutParam = searchParams.get(MIGRATION_CONFIG.queryParamName);
  return layoutParam === "legacy" || layoutParam === "unified"
    ? layoutParam
    : null;
};

const shouldUseUnifiedLayout = (
  pathname: string,
  forceLayout?: "legacy" | "unified",
  queryLayout?: "legacy" | "unified" | null,
  featureFlag?: boolean,
): boolean => {
  // 1. Force layout tem prioridade máxima
  if (forceLayout === "unified") return true;
  if (forceLayout === "legacy") return false;

  // 2. Query parameter override (apenas em desenvolvimento)
  if (queryLayout === "unified") return true;
  if (queryLayout === "legacy") return false;

  // 3. Rotas que devem usar apenas layout unificado
  if (
    MIGRATION_CONFIG.unifiedOnlyRoutes.some((route) =>
      pathname.startsWith(route),
    )
  ) {
    return true;
  }

  // 4. Rotas que devem manter layout legado
  if (
    MIGRATION_CONFIG.legacyOnlyRoutes.some((route) =>
      pathname.startsWith(route),
    )
  ) {
    return false;
  }

  // 5. Feature flag ou configuração global
  return featureFlag ?? MIGRATION_CONFIG.enableUnifiedLayout;
};

// ===== LAYOUT MIGRATION WRAPPER COMPONENT =====
const LayoutMigrationWrapper: React.FC<LayoutMigrationWrapperProps> = ({
  children,
  forceLayout,
  featureFlag,
}) => {
  const [searchParams] = useSearchParams();

  // Determinar qual layout usar
  const { useUnified, activeLayout, migrationInfo } = useMemo(() => {
    const currentPath = window.location.pathname;
    const queryLayout = getLayoutFromQuery(searchParams);
    const useUnified = shouldUseUnifiedLayout(
      currentPath,
      forceLayout,
      queryLayout,
      featureFlag,
    );

    return {
      useUnified,
      activeLayout: useUnified ? "unified" : "legacy",
      migrationInfo: {
        currentPath,
        forceLayout,
        queryLayout,
        featureFlag,
        enabledGlobally: MIGRATION_CONFIG.enableUnifiedLayout,
        allowQueryOverride: MIGRATION_CONFIG.allowQueryOverride,
      },
    };
  }, [searchParams, forceLayout, featureFlag]);

  // Log de migração em desenvolvimento
  if (IS_DEVELOPMENT) {
    console.group("🔄 Layout Migration Info");
    console.log("Active Layout:", activeLayout);
    console.log("Migration Info:", migrationInfo);
    console.groupEnd();
  }

  // Renderizar layout apropriado
  if (useUnified) {
    return <UnifiedLayout />;
  } else {
    return <MainLayout />;
  }
};

// ===== LAYOUT SWITCHER COMPONENT (PARA DESENVOLVIMENTO) =====
export const LayoutSwitcher: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  if (!IS_DEVELOPMENT || !MIGRATION_CONFIG.allowQueryOverride) {
    return null;
  }

  const currentLayout = getLayoutFromQuery(searchParams) || "default";

  const switchToLayout = (layout: "legacy" | "unified" | "default") => {
    const newParams = new URLSearchParams(searchParams);

    if (layout === "default") {
      newParams.delete(MIGRATION_CONFIG.queryParamName);
    } else {
      newParams.set(MIGRATION_CONFIG.queryParamName, layout);
    }

    setSearchParams(newParams);
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
        🔄 Layout Switcher (Dev)
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => switchToLayout("default")}
          className={`px-2 py-1 text-xs rounded ${
            currentLayout === "default"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          Auto
        </button>
        <button
          onClick={() => switchToLayout("legacy")}
          className={`px-2 py-1 text-xs rounded ${
            currentLayout === "legacy"
              ? "bg-orange-500 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          Legacy
        </button>
        <button
          onClick={() => switchToLayout("unified")}
          className={`px-2 py-1 text-xs rounded ${
            currentLayout === "unified"
              ? "bg-green-500 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          Unified
        </button>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Current: <span className="font-mono">{currentLayout}</span>
      </div>
    </div>
  );
};

// ===== MIGRATION STATUS COMPONENT =====
export const MigrationStatus: React.FC = () => {
  const [searchParams] = useSearchParams();

  if (!IS_DEVELOPMENT) return null;

  const currentPath = window.location.pathname;
  const queryLayout = getLayoutFromQuery(searchParams);
  const useUnified = shouldUseUnifiedLayout(
    currentPath,
    undefined,
    queryLayout,
    undefined,
  );

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg max-w-xs">
      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
        📊 Migration Status
      </div>
      <div className="space-y-1 text-xs">
        <div>
          <span className="text-gray-500">Layout:</span>{" "}
          <span
            className={`font-semibold ${useUnified ? "text-green-600" : "text-orange-600"}`}
          >
            {useUnified ? "Unified" : "Legacy"}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Global Flag:</span>{" "}
          <span
            className={
              MIGRATION_CONFIG.enableUnifiedLayout
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {MIGRATION_CONFIG.enableUnifiedLayout ? "ON" : "OFF"}
          </span>
        </div>
        {queryLayout && (
          <div>
            <span className="text-gray-500">Query Override:</span>{" "}
            <span className="font-mono text-blue-600">{queryLayout}</span>
          </div>
        )}
        <div>
          <span className="text-gray-500">Path:</span>{" "}
          <span className="font-mono">{currentPath}</span>
        </div>
      </div>
    </div>
  );
};

export default LayoutMigrationWrapper;

// ===== EXPORT CONFIGURATION FOR EXTERNAL USE =====
export { MIGRATION_CONFIG };
