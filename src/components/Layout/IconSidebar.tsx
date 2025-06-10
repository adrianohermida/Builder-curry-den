/**
 * 🎯 ICON SIDEBAR - DESIGN VERTICAL COM ÍCONES
 *
 * Sidebar vertical com ícones como mostrado na imagem:
 * - Coluna vertical estreita com ícones
 * - Design tradicional e limpo
 * - Tooltips nos ícones
 * - Logo no topo
 */

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Users,
  Scale,
  CheckSquare,
  FolderOpen,
  FileSignature,
  Calendar,
  FileText,
  MessageCircle,
  BarChart3,
  DollarSign,
  Settings,
  Clock,
  Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IconSidebarProps {
  className?: string;
}

interface SidebarIcon {
  id: string;
  title: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

export const IconSidebar: React.FC<IconSidebarProps> = ({ className }) => {
  const location = useLocation();

  const sidebarIcons: SidebarIcon[] = [
    {
      id: "home",
      title: "Painel de Controle",
      path: "/painel",
      icon: <Home className="w-6 h-6" />,
    },
    {
      id: "users",
      title: "CRM Jurídico",
      path: "/crm-modern",
      icon: <Users className="w-6 h-6" />,
      badge: 247,
    },
    {
      id: "processes",
      title: "Processos",
      path: "/crm-modern/processos",
      icon: <Scale className="w-6 h-6" />,
      badge: 12,
    },
    {
      id: "tasks",
      title: "Tarefas",
      path: "/crm-modern/tarefas",
      icon: <CheckSquare className="w-6 h-6" />,
      badge: 47,
    },
    {
      id: "calendar",
      title: "Agenda",
      path: "/agenda",
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      id: "documents",
      title: "Documentos",
      path: "/crm-modern/documentos",
      icon: <FolderOpen className="w-6 h-6" />,
    },
    {
      id: "contracts",
      title: "Contratos",
      path: "/crm-modern/contratos",
      icon: <FileSignature className="w-6 h-6" />,
    },
    {
      id: "financial",
      title: "Financeiro",
      path: "/crm-modern/financeiro",
      icon: <DollarSign className="w-6 h-6" />,
    },
    {
      id: "publications",
      title: "Publicações",
      path: "/publicacoes",
      icon: <FileText className="w-6 h-6" />,
    },
    {
      id: "support",
      title: "Atendimento",
      path: "/atendimento",
      icon: <Headphones className="w-6 h-6" />,
    },
    {
      id: "time",
      title: "Controle de Tempo",
      path: "/tempo",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      id: "settings",
      title: "Configurações",
      path: "/configuracoes-usuario",
      icon: <Settings className="w-6 h-6" />,
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 shadow-sm",
          className,
        )}
      >
        {/* Logo */}
        <div className="mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Scale className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Navigation Icons */}
        <nav className="flex-1 flex flex-col items-center space-y-2 w-full">
          {sidebarIcons.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Link
                  to={item.path}
                  className={cn(
                    "relative w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 group",
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-600 border-r-3 border-blue-600"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
                  )}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center"
                  >
                    {item.icon}
                  </motion.div>

                  {/* Badge */}
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}

                  {/* Active Indicator */}
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r"
                      initial={false}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                <p className="font-medium">{item.title}</p>
                {item.badge && (
                  <p className="text-xs text-gray-500">
                    {item.badge} pendentes
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>

        {/* Status Indicator */}
        <div className="mt-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Sistema Online</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default IconSidebar;
