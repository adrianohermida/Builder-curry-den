import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  BarChart3,
  Users,
  Settings,
  CreditCard,
  Headphones,
  MessageSquare,
  Package,
  Lock,
  ChevronLeft,
  Menu,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { RouteGuard } from "@/components/RouteGuard";

const adminModules = [
  {
    id: "bi",
    title: "Business Intelligence",
    description: "Gráficos, analytics e métricas",
    icon: BarChart3,
    href: "/admin/bi",
    color: "text-blue-600",
    badge: "BI",
  },
  {
    id: "equipe",
    title: "Gestão de Equipe",
    description: "Controle de acessos e permissões",
    icon: Users,
    href: "/admin/equipe",
    color: "text-green-600",
    badge: "Team",
  },
  {
    id: "desenvolvimento",
    title: "Painel de Desenvolvimento",
    description: "Blueprint Builder e deploys",
    icon: Settings,
    href: "/admin/desenvolvimento",
    color: "text-purple-600",
    badge: "Dev",
  },
  {
    id: "faturamento",
    title: "Faturamento",
    description: "Receitas, Stripe e financeiro",
    icon: CreditCard,
    href: "/admin/faturamento",
    color: "text-orange-600",
    badge: "💰",
  },
  {
    id: "suporte",
    title: "Suporte B2B",
    description: "Tickets e atendimento clientes",
    icon: Headphones,
    href: "/admin/suporte",
    color: "text-cyan-600",
    badge: "Support",
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Campanhas e comunicação",
    icon: MessageSquare,
    href: "/admin/marketing",
    color: "text-pink-600",
    badge: "📢",
  },
  {
    id: "produtos",
    title: "Gestão de Produtos",
    description: "Planos SaaS e monetização",
    icon: Package,
    href: "/admin/produtos",
    color: "text-indigo-600",
    badge: "Product",
  },
  {
    id: "seguranca",
    title: "Segurança",
    description: "Auditoria e conformidade LGPD",
    icon: Lock,
    href: "/admin/seguranca",
    color: "text-red-600",
    badge: "🔐",
  },
];

export default function AdminLayout() {
  const location = useLocation();
  const { isAdmin } = usePermissions();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Redirect if not admin
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const isModuleActive = (href: string) => {
    return location.pathname.startsWith(href);
  };

  const getCurrentModule = () => {
    return adminModules.find((module) => isModuleActive(module.href));
  };

  const currentModule = getCurrentModule();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Admin Sidebar */}
      <div
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300",
          sidebarOpen ? "w-72" : "w-16",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div
              className={cn(
                "flex items-center gap-3",
                !sidebarOpen && "justify-center",
              )}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    Admin Panel
                  </h1>
                  <p className="text-xs text-gray-500">Lawdesk Internal</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-8 w-8 p-0"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              {adminModules.map((module) => {
                const isActive = isModuleActive(module.href);

                return (
                  <Link
                    key={module.id}
                    to={module.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    )}
                  >
                    <module.icon className={cn("w-5 h-5", module.color)} />
                    {sidebarOpen && (
                      <>
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {module.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {module.description}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {module.badge}
                        </Badge>
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-4 h-4" />
              {sidebarOpen && "Voltar ao Sistema"}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Breadcrumb Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Link to="/admin" className="hover:text-gray-700">
                  Admin
                </Link>
                {currentModule && (
                  <>
                    <span>/</span>
                    <span className="text-gray-900">{currentModule.title}</span>
                  </>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentModule ? currentModule.title : "Painel Administrativo"}
              </h1>
              {currentModule && (
                <p className="text-gray-600">{currentModule.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
                Admin Access
              </Badge>
              <Badge variant="outline">Lawdesk Internal</Badge>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
