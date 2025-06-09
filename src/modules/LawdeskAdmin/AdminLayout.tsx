import React, { useState, useTransition, Suspense } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  BarChart3,
  Users,
  Code,
  CreditCard,
  Headphones,
  MessageSquare,
  Package,
  Lock,
  ChevronLeft,
  Menu,
  X,
  Crown,
  PieChart,
  TrendingUp,
  Settings,
  ArrowLeft,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/providers/ThemeProvider";
import { useViewMode } from "@/contexts/ViewModeContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PageLoading } from "@/components/ui/simple-loading";

const adminModules = [
  {
    id: "executive",
    title: "Dashboard Executivo",
    description: "Visão estratégica e KPIs executivos",
    icon: Crown,
    href: "/admin/executive",
    gradient: "from-purple-600 to-indigo-600",
    badge: "Executive",
    badgeColor:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  {
    id: "bi",
    title: "Business Intelligence",
    description: "Analytics, métricas e relatórios",
    icon: PieChart,
    href: "/admin/bi",
    gradient: "from-blue-600 to-cyan-600",
    badge: "BI",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  {
    id: "equipe",
    title: "Gestão de Equipe",
    description: "Usuários, permissões e acessos",
    icon: Users,
    href: "/admin/equipe",
    gradient: "from-green-600 to-emerald-600",
    badge: "Team",
    badgeColor:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  {
    id: "desenvolvimento",
    title: "Desenvolvimento",
    description: "Blueprint, deploys e releases",
    icon: Code,
    href: "/admin/desenvolvimento",
    gradient: "from-orange-600 to-red-600",
    badge: "Dev",
    badgeColor:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
  {
    id: "faturamento",
    title: "Faturamento",
    description: "Receitas, Stripe e financeiro",
    icon: CreditCard,
    href: "/admin/faturamento",
    gradient: "from-emerald-600 to-green-600",
    badge: "Finance",
    badgeColor:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  },
  {
    id: "suporte",
    title: "Suporte B2B",
    description: "Tickets e atendimento clientes",
    icon: Headphones,
    href: "/admin/suporte",
    gradient: "from-cyan-600 to-blue-600",
    badge: "Support",
    badgeColor: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Campanhas, leads e conversão",
    icon: TrendingUp,
    href: "/admin/marketing",
    gradient: "from-pink-600 to-rose-600",
    badge: "Marketing",
    badgeColor: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  },
  {
    id: "produtos",
    title: "Gestão de Produtos",
    description: "Planos, features e roadmap",
    icon: Package,
    href: "/admin/produtos",
    gradient: "from-indigo-600 to-purple-600",
    badge: "Product",
    badgeColor:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  },
  {
    id: "seguranca",
    title: "Segurança",
    description: "Auditoria, compliance e LGPD",
    icon: Lock,
    href: "/admin/seguranca",
    gradient: "from-red-600 to-pink-600",
    badge: "Security",
    badgeColor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { theme, isDark } = useTheme();
  const { switchMode } = useViewMode();

  // Responsive behavior
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isModuleActive = (href: string) => {
    return location.pathname.startsWith(href);
  };

  const getCurrentModule = () => {
    return adminModules.find((module) => isModuleActive(module.href));
  };

  const currentModule = getCurrentModule();

  const handleExitAdmin = () => {
    switchMode("client");
    navigate("/painel");
  };

  const sidebarClasses = cn(
    "fixed inset-y-0 left-0 z-50 transition-all duration-300",
    "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700",
    "shadow-lg",
    sidebarOpen ? "w-72" : "w-16",
    isMobile && !sidebarOpen && "-translate-x-full",
  );

  const mainContentClasses = cn(
    "flex-1 transition-all duration-300",
    "bg-gray-50 dark:bg-gray-950",
    sidebarOpen && !isMobile ? "ml-72" : !isMobile ? "ml-16" : "ml-0",
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar - SEM DUPLICIDADE */}
      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div
              className={cn(
                "flex items-center gap-3",
                !sidebarOpen && "justify-center",
              )}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                      Lawdesk Admin
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Painel Administrativo
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {sidebarOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Admin Badge */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div
              className={cn(
                "flex items-center",
                sidebarOpen ? "justify-center" : "justify-center",
              )}
            >
              <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white border-0 shadow-md">
                <Shield className="w-3 h-3 mr-1" />
                {sidebarOpen ? "Acesso Administrativo" : "Admin"}
              </Badge>
            </div>
          </div>

          {/* Navigation - SEM DUPLICIDADE */}
          <ScrollArea className="flex-1 p-2">
            <nav className="space-y-1">
              {adminModules.map((module) => {
                const isActive = isModuleActive(module.href);
                const Icon = module.icon;

                if (!sidebarOpen) {
                  return (
                    <Tooltip key={module.id}>
                      <TooltipTrigger asChild>
                        <Link
                          to={module.href}
                          className={cn(
                            "flex items-center justify-center w-12 h-12 rounded-lg transition-all mx-auto",
                            isActive
                              ? "bg-gradient-to-r " +
                                  module.gradient +
                                  " text-white shadow-lg"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="w-64">
                        <div className="p-2">
                          <div className="font-medium text-sm">
                            {module.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {module.description}
                          </div>
                          <Badge
                            className={cn("mt-2 text-xs", module.badgeColor)}
                          >
                            {module.badge}
                          </Badge>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return (
                  <Link
                    key={module.id}
                    to={module.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg transition-all group",
                      isActive
                        ? "bg-gradient-to-r " +
                            module.gradient +
                            " text-white shadow-lg"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {module.title}
                      </div>
                      <div
                        className={cn(
                          "text-xs truncate",
                          isActive
                            ? "text-white/80"
                            : "text-gray-500 dark:text-gray-400",
                        )}
                      >
                        {module.description}
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        "text-xs flex-shrink-0",
                        isActive
                          ? "bg-white/20 text-white border-white/30"
                          : module.badgeColor,
                      )}
                    >
                      {module.badge}
                    </Badge>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={handleExitAdmin}
              variant="outline"
              size="sm"
              className={cn(
                "w-full border-gray-300 dark:border-gray-600",
                !sidebarOpen && "p-2",
              )}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {sidebarOpen && "Sair do Admin"}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content - SEM MENU DUPLICADO */}
      <main className={mainContentClasses}>
        <div className="flex flex-col h-screen">
          {/* Simple Header - SEM NAVEGAÇÃO DUPLICADA */}
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Mobile menu button */}
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                )}

                {/* Breadcrumb */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                    <Link
                      to="/admin"
                      className="hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Admin
                    </Link>
                    {currentModule && (
                      <>
                        <span>/</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {currentModule.title}
                        </span>
                      </>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentModule
                      ? currentModule.title
                      : "Painel Administrativo"}
                  </h1>
                  {currentModule && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      {currentModule.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Status badges */}
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
                  ✅ Sistema Online
                </Badge>
                <Badge
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600"
                >
                  v2025.1
                </Badge>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-auto p-6">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Suspense
                fallback={
                  <div className="flex items-center justify-center min-h-[400px]">
                    <PageLoading />
                  </div>
                }
              >
                {isPending ? (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <PageLoading />
                  </div>
                ) : (
                  <Outlet />
                )}
              </Suspense>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
