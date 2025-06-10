/**
 * 🎯 FEED HEADER - CABEÇALHO DO MÓDULO FEED
 *
 * Cabeçalho principal do módulo Feed com:
 * - Navegação por abas
 * - Indicadores de atividade
 * - Ações rápidas
 * - Status online/offline
 */

import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MessageSquare,
  Calendar,
  BarChart3,
  Users,
  Bell,
  Settings,
  Wifi,
  WifiOff,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ===== TYPES =====
interface FeedTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  path: string;
  badge?: number;
  description: string;
}

// ===== CONFIGURATION =====
const FEED_TABS: FeedTab[] = [
  {
    id: "timeline",
    label: "Timeline",
    icon: MessageSquare,
    path: "/feed",
    badge: 3,
    description: "Feed principal de atividades",
  },
  {
    id: "messages",
    label: "Mensagens",
    icon: MessageSquare,
    path: "/feed/messages",
    badge: 5,
    description: "Mensagens diretas e conversas",
  },
  {
    id: "events",
    label: "Eventos",
    icon: Calendar,
    path: "/feed/events",
    badge: 2,
    description: "Eventos e compromissos da empresa",
  },
  {
    id: "polls",
    label: "Enquetes",
    icon: BarChart3,
    path: "/feed/polls",
    description: "Pesquisas e enquetes ativas",
  },
  {
    id: "teams",
    label: "Equipes",
    icon: Users,
    path: "/feed/teams",
    description: "Atividades das equipes",
  },
];

// ===== FEED HEADER COMPONENT =====
const FeedHeader: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get current tab from URL
  const currentPath = window.location.pathname;
  const activeTab =
    FEED_TABS.find((tab) => tab.path === currentPath)?.id || "timeline";

  // Online status (mock)
  const isOnline = true;
  const onlineUsers = 24;

  const handleTabChange = (tabId: string) => {
    const tab = FEED_TABS.find((t) => t.id === tabId);
    if (tab) {
      navigate(tab.path);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Title and Status */}
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <MessageSquare size={28} className="mr-3 text-blue-600" />
                Feed Colaborativo
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center mt-1">
                {isOnline ? (
                  <>
                    <Wifi size={14} className="mr-1 text-green-500" />
                    <span className="text-green-600 dark:text-green-400">
                      Online
                    </span>
                    <span className="mx-2">•</span>
                    <span>{onlineUsers} usuários conectados</span>
                  </>
                ) : (
                  <>
                    <WifiOff size={14} className="mr-1 text-red-500" />
                    <span className="text-red-600 dark:text-red-400">
                      Offline
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="relative">
                    <Bell size={16} />
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs"
                    >
                      3
                    </Badge>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>3 novas notificações</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Configurações do Feed</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4 pb-2">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="flex-1"
          >
            <TabsList className="grid grid-cols-5 w-full max-w-2xl">
              {FEED_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center space-x-2 relative"
                  >
                    <Icon size={16} />
                    <span className="hidden sm:inline">{tab.label}</span>
                    {tab.badge && tab.badge > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 h-5 w-5 p-0 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      >
                        {tab.badge}
                      </Badge>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>

          {/* Tab Actions */}
          <div className="hidden lg:flex items-center space-x-2 ml-4">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <MessageSquare size={16} className="mr-2" />
              Nova Publicação
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedHeader;
