/**
 * 🎯 HEADER SAAS - HEADER ESPECÍFICO PARA PLANO SAAS
 *
 * Header com recursos SaaS:
 * - Indicador de plano ativo
 * - Notificações de billing
 * - Limites de uso em tempo real
 * - Acesso rápido ao upgrade
 * - Métricas de performance
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Crown,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Settings,
  HelpCircle,
  ExternalLink,
  Zap,
  Shield,
  Star,
} from "lucide-react";

// Components
import Button from "@/components/ui/OptimizedButton";

// ===== TYPES =====
interface HeaderSaaSProps {
  plan: "starter" | "professional" | "enterprise";
  planBadge: React.ReactNode;
  usageData: {
    plan: string;
    limits: {
      clients: number;
      processes: number;
      storage: number;
      users: number;
    };
    usage: {
      clients: number;
      processes: number;
      storage: number;
      users: number;
    };
  };
}

interface BillingNotification {
  id: string;
  type: "warning" | "info" | "success" | "error";
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ===== HEADER SAAS COMPONENT =====
const HeaderSaaS: React.FC<HeaderSaaSProps> = ({
  plan,
  planBadge,
  usageData,
}) => {
  const navigate = useNavigate();

  // ===== STATE =====
  const [showBillingMenu, setShowBillingMenu] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // ===== COMPUTED VALUES =====
  const billingNotifications = useMemo((): BillingNotification[] => {
    const notifications: BillingNotification[] = [];

    // Check usage limits
    Object.entries(usageData.usage).forEach(([key, value]) => {
      const limit = usageData.limits[key as keyof typeof usageData.limits];
      if (limit !== -1) {
        const percentage = (value / limit) * 100;
        if (percentage >= 90) {
          notifications.push({
            id: `limit-${key}`,
            type: "warning",
            message: `${key.charAt(0).toUpperCase() + key.slice(1)} próximo do limite (${percentage.toFixed(0)}%)`,
            action: {
              label: "Fazer Upgrade",
              onClick: () => setShowUpgradeModal(true),
            },
          });
        }
      }
    });

    // Mock billing notifications
    if (plan === "starter") {
      notifications.push({
        id: "trial-ending",
        type: "info",
        message: "Seu trial termina em 7 dias",
        action: {
          label: "Escolher Plano",
          onClick: () => navigate("/billing"),
        },
      });
    }

    return notifications;
  }, [usageData, plan, navigate]);

  const planFeatures = useMemo(() => {
    const features = {
      starter: {
        icon: TrendingUp,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        features: ["CRM Básico", "5 Usuários", "10GB"],
      },
      professional: {
        icon: Star,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        features: ["CRM Avançado", "20 Usuários", "100GB", "Integrações"],
      },
      enterprise: {
        icon: Crown,
        color: "text-gold-600",
        bgColor: "bg-gold-50",
        features: ["Ilimitado", "Suporte Premium", "API Completa"],
      },
    };

    return features[plan];
  }, [plan]);

  // ===== HANDLERS =====
  const handleUpgrade = () => {
    navigate("/billing/upgrade");
  };

  const handleBilling = () => {
    navigate("/billing");
  };

  // ===== RENDER FUNCTIONS =====
  const renderBillingNotifications = () => {
    if (billingNotifications.length === 0) return null;

    return (
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          icon={AlertTriangle}
          onClick={() => setShowBillingMenu(!showBillingMenu)}
          className="relative p-2"
        >
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          </span>
        </Button>

        {showBillingMenu && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                Alertas do Plano
              </h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {billingNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {notification.message}
                  </p>
                  {notification.action && (
                    <button
                      onClick={notification.action.onClick}
                      className="mt-2 text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {notification.action.label}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderQuickStats = () => {
    const stats = [
      {
        label: "Clientes",
        value: usageData.usage.clients,
        limit: usageData.limits.clients,
        icon: TrendingUp,
      },
      {
        label: "Processos",
        value: usageData.usage.processes,
        limit: usageData.limits.processes,
        icon: BarChart3,
      },
    ];

    return (
      <div className="hidden lg:flex items-center gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-2">
            <stat.icon size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}: {stat.value}
              {stat.limit !== -1 && `/${stat.limit}`}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderPlanActions = () => {
    return (
      <div className="flex items-center gap-2">
        {/* Plan Badge */}
        {planBadge}

        {/* Quick Actions */}
        <div className="flex items-center gap-1">
          {/* Billing */}
          <Button
            variant="ghost"
            size="sm"
            icon={CreditCard}
            onClick={handleBilling}
            className="p-2"
            title="Faturamento"
          />

          {/* Upgrade (if not enterprise) */}
          {plan !== "enterprise" && (
            <Button
              variant="ghost"
              size="sm"
              icon={Crown}
              onClick={handleUpgrade}
              className="p-2 text-primary-600 hover:text-primary-700"
              title="Fazer Upgrade"
            />
          )}

          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            icon={Settings}
            onClick={() => navigate("/configuracoes/plano")}
            className="p-2"
            title="Configurações do Plano"
          />
        </div>
      </div>
    );
  };

  // ===== MAIN RENDER =====
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section - Plan Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`
                  p-2 rounded-lg ${planFeatures.bgColor}
                `}
              >
                <planFeatures.icon size={20} className={planFeatures.color} />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                  Plano {plan.charAt(0).toUpperCase() + plan.slice(1)}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {planFeatures.features.join(" • ")}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            {renderQuickStats()}
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            {/* Billing Notifications */}
            {renderBillingNotifications()}

            {/* Plan Actions */}
            {renderPlanActions()}
          </div>
        </div>

        {/* Progress Bars for Usage (Mobile) */}
        <div className="lg:hidden mt-3 grid grid-cols-2 gap-3">
          {Object.entries(usageData.usage).map(([key, value]) => {
            const limit =
              usageData.limits[key as keyof typeof usageData.limits];
            if (limit === -1) return null;

            const percentage = (value / limit) * 100;
            return (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                  <span className="text-gray-500">
                    {value}/{limit}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`
                      h-full transition-all duration-500
                      ${percentage >= 90 ? "bg-red-500" : percentage >= 75 ? "bg-yellow-500" : "bg-green-500"}
                    `}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default React.memo(HeaderSaaS);
