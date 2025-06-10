/**
 * ⚙️ USER SETTINGS HUB - LAWDESK CRM
 *
 * Hub principal de configurações do usuário com:
 * - Interface tabada moderna
 * - Permissões baseadas em roles
 * - Mobile-first responsive
 * - Performance otimizada
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Bell,
  Calendar,
  FolderOpen,
  Brain,
  Users,
  Zap,
  Settings,
  Smartphone,
  Monitor,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import ProfileSection from "./Sections/ProfileSection";
import NotificationsSection from "./Sections/NotificationsSection";
import CalendarSection from "./Sections/CalendarSection";
import DocumentsSection from "./Sections/DocumentsSection";
import AISection from "./Sections/AISection";
import CRMSection from "./Sections/CRMSection";
import IntegrationsSection from "./Sections/IntegrationsSection";
import ModulesSection from "./Sections/ModulesSection";

type SettingsTab =
  | "profile"
  | "notifications"
  | "calendar"
  | "documents"
  | "ai"
  | "crm"
  | "integrations"
  | "modules";

interface SettingsTabConfig {
  id: SettingsTab;
  label: string;
  icon: React.ReactNode;
  description: string;
  badge?: string;
  permission?: string;
  component: React.ComponentType;
}

const UserSettingsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [isMobile, setIsMobile] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { userRole, hasPermission } = useUserPermissions();

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Tab configuration with permissions
  const settingsTabs: SettingsTabConfig[] = [
    {
      id: "profile",
      label: "Perfil e Conta",
      icon: <User className="w-4 h-4" />,
      description: "Dados pessoais, avatar, tema e segurança",
      component: ProfileSection,
    },
    {
      id: "notifications",
      label: "Notificações",
      icon: <Bell className="w-4 h-4" />,
      description: "Canais, eventos e frequência de alertas",
      badge: "3",
      component: NotificationsSection,
    },
    {
      id: "calendar",
      label: "Agenda",
      icon: <Calendar className="w-4 h-4" />,
      description: "Calendário, integração e horários",
      component: CalendarSection,
    },
    {
      id: "documents",
      label: "Documentos",
      icon: <FolderOpen className="w-4 h-4" />,
      description: "GED, integração Drive e OCR",
      component: DocumentsSection,
    },
    {
      id: "ai",
      label: "IA Jurídica",
      icon: <Brain className="w-4 h-4" />,
      description: "Estilo, modelos e preferências de IA",
      component: AISection,
    },
    {
      id: "crm",
      label: "CRM Personalizado",
      icon: <Users className="w-4 h-4" />,
      description: "Campos, etiquetas e visualização",
      component: CRMSection,
    },
    {
      id: "integrations",
      label: "Integrações",
      icon: <Zap className="w-4 h-4" />,
      description: "Apps conectados e automações",
      badge: "5",
      component: IntegrationsSection,
    },
    {
      id: "modules",
      label: "Módulos",
      icon: <Settings className="w-4 h-4" />,
      description: "Preferências por módulo do sistema",
      permission: "settings.modules",
      component: ModulesSection,
    },
  ];

  // Filter tabs based on permissions
  const availableTabs = settingsTabs.filter((tab) =>
    tab.permission ? hasPermission(tab.permission) : true,
  );

  const activeTabConfig = availableTabs.find((tab) => tab.id === activeTab);
  const ActiveComponent = activeTabConfig?.component || ProfileSection;

  // Handle tab change with unsaved warning
  const handleTabChange = (newTab: SettingsTab) => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "Você tem alterações não salvas. Deseja continuar?",
      );
      if (!confirmed) return;
    }
    setActiveTab(newTab);
    setHasUnsavedChanges(false);
  };

  // Render mobile tab selector
  const renderMobileTabSelector = () => (
    <div className="md:hidden bg-white border-b border-gray-200 p-4">
      <select
        value={activeTab}
        onChange={(e) => handleTabChange(e.target.value as SettingsTab)}
        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
      >
        {availableTabs.map((tab) => (
          <option key={tab.id} value={tab.id}>
            {tab.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Configurações
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Personalize sua experiência no Lawdesk
              </p>
            </div>

            {/* User Role Badge */}
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="hidden sm:inline-flex capitalize"
              >
                <User className="w-3 h-3 mr-1" />
                {userRole}
              </Badge>

              {hasUnsavedChanges && (
                <Badge variant="destructive" className="animate-pulse">
                  Alterações não salvas
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Selector */}
      {isMobile && renderMobileTabSelector()}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar Navigation */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <nav className="space-y-2">
              {availableTabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    w-full text-left p-3 rounded-lg transition-all duration-200
                    ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">{tab.icon}</div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{tab.label}</span>
                        {tab.badge && (
                          <Badge
                            variant="secondary"
                            className="h-4 px-1.5 text-xs"
                          >
                            {tab.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {tab.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </nav>

            {/* Quick Theme Switcher */}
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Tema Rápido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex flex-col items-center p-2 h-auto"
                  >
                    <Sun className="w-4 h-4 mb-1" />
                    <span className="text-xs">Claro</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex flex-col items-center p-2 h-auto"
                  >
                    <Moon className="w-4 h-4 mb-1" />
                    <span className="text-xs">Escuro</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex flex-col items-center p-2 h-auto"
                  >
                    <Monitor className="w-4 h-4 mb-1" />
                    <span className="text-xs">Sistema</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Content Area */}
          <main className="flex-grow min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ActiveComponent
                  onUnsavedChanges={setHasUnsavedChanges}
                  userRole={userRole}
                />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Floating Save Button for Mobile */}
      <AnimatePresence>
        {hasUnsavedChanges && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-4 left-4 right-4 z-50"
          >
            <div className="bg-blue-600 text-white p-4 rounded-lg shadow-lg flex items-center justify-between">
              <span className="text-sm font-medium">Alterações não salvas</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-blue-700"
                  onClick={() => setHasUnsavedChanges(false)}
                >
                  Descartar
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    // Handle save
                    setHasUnsavedChanges(false);
                  }}
                >
                  Salvar
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserSettingsHub;
