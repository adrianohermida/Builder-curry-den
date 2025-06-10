/**
 * 🎯 LAWDESK LAYOUT SAAS - LAYOUT PARA PLANO SAAS
 *
 * Layout específico para usuários SaaS com:
 * - Branding enhanced com recursos premium
 * - Sidebar SaaS com recursos avançados
 * - Header SaaS com ferramentas específicas
 * - Indicadores de plano e limites
 * - Integração com billing
 */

import React, { useMemo } from "react";
import { Outlet } from "react-router-dom";

// Layout Components
import HeaderSaaS from "./HeaderSaaS";
import SidebarSaaS from "./SidebarSaaS";

// Context
import { useLayout } from "./MainLayout";

// Design System
import { ultimateDesignSystem } from "@/lib/ultimateDesignSystem";

// ===== TYPES =====
interface LawdeskLayoutSaaSProps {
  children?: React.ReactNode;
}

interface SaaSFeatures {
  plan: "starter" | "professional" | "enterprise";
  features: string[];
  limits: {
    clients: number;
    processes: number;
    storage: number; // GB
    users: number;
  };
  usage: {
    clients: number;
    processes: number;
    storage: number; // GB
    users: number;
  };
}

// ===== SAAS CONFIGURATION =====
const SAAS_FEATURES: Record<string, SaaSFeatures> = {
  starter: {
    plan: "starter",
    features: ["CRM Básico", "5 Usuários", "10GB Armazenamento"],
    limits: { clients: 100, processes: 50, storage: 10, users: 5 },
    usage: { clients: 25, processes: 12, storage: 2.5, users: 2 },
  },
  professional: {
    plan: "professional",
    features: [
      "CRM Avançado",
      "20 Usuários",
      "100GB Armazenamento",
      "Integrações",
      "Relatórios Avançados",
    ],
    limits: { clients: 1000, processes: 500, storage: 100, users: 20 },
    usage: { clients: 245, processes: 87, storage: 45.2, users: 8 },
  },
  enterprise: {
    plan: "enterprise",
    features: [
      "CRM Ilimitado",
      "Usuários Ilimitados",
      "Armazenamento Ilimitado",
      "Todas as Integrações",
      "Suporte Prioritário",
    ],
    limits: { clients: -1, processes: -1, storage: -1, users: -1 },
    usage: { clients: 1250, processes: 342, storage: 250.8, users: 25 },
  },
};

// ===== LAWDESK LAYOUT SAAS COMPONENT =====
const LawdeskLayoutSaaS: React.FC<LawdeskLayoutSaaSProps> = ({ children }) => {
  const { layoutConfig, isMobile, userRole } = useLayout();

  // ===== SAAS DATA =====
  const saasData = useMemo(() => {
    // Mock: Get from user subscription data
    return SAAS_FEATURES.professional;
  }, []);

  const usagePercentages = useMemo(() => {
    const { limits, usage } = saasData;
    return {
      clients:
        limits.clients === -1 ? 0 : (usage.clients / limits.clients) * 100,
      processes:
        limits.processes === -1
          ? 0
          : (usage.processes / limits.processes) * 100,
      storage:
        limits.storage === -1 ? 0 : (usage.storage / limits.storage) * 100,
      users: limits.users === -1 ? 0 : (usage.users / limits.users) * 100,
    };
  }, [saasData]);

  // ===== RENDER USAGE INDICATOR =====
  const renderUsageIndicator = (
    type: keyof typeof usagePercentages,
    label: string,
  ) => {
    const percentage = usagePercentages[type];
    const isUnlimited = saasData.limits[type] === -1;

    if (isUnlimited) return null;

    const getColor = () => {
      if (percentage >= 90) return "text-red-600 bg-red-100";
      if (percentage >= 75) return "text-yellow-600 bg-yellow-100";
      return "text-green-600 bg-green-100";
    };

    return (
      <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {saasData.usage[type]}/{saasData.limits[type]}
          </span>
          <div
            className={`
              px-2 py-1 rounded text-xs font-medium
              ${getColor()}
            `}
          >
            {percentage.toFixed(0)}%
          </div>
        </div>
      </div>
    );
  };

  // ===== PLAN BADGE =====
  const renderPlanBadge = () => {
    const planColors = {
      starter: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      professional:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      enterprise:
        "bg-gold-100 text-gold-800 dark:bg-gold-900 dark:text-gold-300",
    };

    return (
      <div
        className={`
          inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
          ${planColors[saasData.plan]}
        `}
      >
        {saasData.plan.charAt(0).toUpperCase() + saasData.plan.slice(1)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* SaaS Header */}
      <HeaderSaaS
        plan={saasData.plan}
        planBadge={renderPlanBadge()}
        usageData={saasData}
      />

      {/* Main Layout */}
      <div className="flex">
        {/* SaaS Sidebar */}
        {layoutConfig.showSidebar && (
          <SidebarSaaS
            variant={layoutConfig.sidebarVariant}
            saasFeatures={saasData.features}
            plan={saasData.plan}
            className={`
              ${isMobile ? "fixed inset-y-0 left-0 z-40" : ""}
              ${layoutConfig.sidebarVariant === "collapsed" ? "w-16" : "w-64"}
            `}
          />
        )}

        {/* Main Content */}
        <div
          className={`
            flex-1 flex flex-col min-h-screen transition-all duration-300
            ${layoutConfig.showSidebar && layoutConfig.sidebarVariant === "expanded" && !isMobile ? "ml-64" : ""}
            ${layoutConfig.showSidebar && layoutConfig.sidebarVariant === "collapsed" && !isMobile ? "ml-16" : ""}
          `}
        >
          {/* Content Area */}
          <main className="flex-1 p-6">{children || <Outlet />}</main>

          {/* SaaS Footer with Usage Stats */}
          <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Plan Info */}
                <div className="flex items-center gap-4">
                  {renderPlanBadge()}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Plano {saasData.plan} ativo
                  </span>
                </div>

                {/* Usage Indicators */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 flex-1 max-w-2xl">
                  {renderUsageIndicator("clients", "Clientes")}
                  {renderUsageIndicator("processes", "Processos")}
                  {renderUsageIndicator("storage", "Armazenamento")}
                  {renderUsageIndicator("users", "Usuários")}
                </div>

                {/* Upgrade Button */}
                {saasData.plan !== "enterprise" && (
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors">
                      Fazer Upgrade
                    </button>
                  </div>
                )}
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile &&
        layoutConfig.showSidebar &&
        layoutConfig.sidebarVariant !== "hidden" && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => {
              // Close sidebar on mobile
            }}
          />
        )}
    </div>
  );
};

export default React.memo(LawdeskLayoutSaaS);
