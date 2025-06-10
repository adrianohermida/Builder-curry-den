import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Filter,
  Menu,
  X,
  Bell,
  Settings,
  User,
  Home,
  Users,
  Scale,
  FileText,
  Calendar,
  MessageSquare,
  BarChart3,
  DollarSign,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Zap,
  Star,
  Clock,
  Target,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Hooks
import { usePermissions } from "@/hooks/usePermissions";
import { useViewMode } from "@/contexts/ViewModeContext";
import { cn } from "@/lib/utils";

// Types
interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  color: string;
  shortcut?: string;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: string | number;
  children?: NavigationItem[];
  isActive?: boolean;
}

interface AIInsight {
  id: string;
  type: "suggestion" | "alert" | "insight";
  title: string;
  description: string;
  action?: string;
  priority: "low" | "medium" | "high";
}

const MinimalistSaaSLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin } = usePermissions();
  const { isAdminMode } = useViewMode();

  // State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);

  // Quick Actions for different modules
  const quickActions = useMemo(
    (): QuickAction[] => [
      {
        id: "new-client",
        label: "Cliente",
        icon: Users,
        path: "/crm/clientes?action=new",
        color: "bg-blue-500",
        shortcut: "C",
      },
      {
        id: "new-process",
        label: "Processo",
        icon: Scale,
        path: "/crm/processos?action=new",
        color: "bg-purple-500",
        shortcut: "P",
      },
      {
        id: "new-task",
        label: "Tarefa",
        icon: Target,
        path: "/crm/tarefas?action=new",
        color: "bg-green-500",
        shortcut: "T",
      },
      {
        id: "new-contract",
        label: "Contrato",
        icon: FileText,
        path: "/crm/contratos?action=new",
        color: "bg-orange-500",
        shortcut: "O",
      },
    ],
    [],
  );

  // Navigation structure
  const navigationItems = useMemo((): NavigationItem[] => {
    const currentPath = location.pathname;

    return [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: Home,
        path: "/painel",
        isActive: currentPath === "/painel",
      },
      {
        id: "crm",
        label: "CRM",
        icon: Users,
        path: "/crm",
        isActive: currentPath.startsWith("/crm"),
        children: [
          {
            id: "clientes",
            label: "Clientes",
            icon: Users,
            path: "/crm/clientes",
            badge: "124",
            isActive: currentPath.startsWith("/crm/clientes"),
          },
          {
            id: "processos",
            label: "Casos e Processos",
            icon: Scale,
            path: "/crm/processos",
            badge: "47",
            isActive: currentPath.startsWith("/crm/processos"),
          },
          {
            id: "contratos",
            label: "Contratos",
            icon: FileText,
            path: "/crm/contratos",
            badge: "12",
            isActive: currentPath.startsWith("/crm/contratos"),
          },
          {
            id: "tarefas",
            label: "Tarefas",
            icon: Target,
            path: "/crm/tarefas",
            badge: "8",
            isActive: currentPath.startsWith("/crm/tarefas"),
          },
        ],
      },
      {
        id: "agenda",
        label: "Calendário",
        icon: Calendar,
        path: "/agenda",
        badge: "3",
        isActive: currentPath.startsWith("/agenda"),
      },
      {
        id: "comunicacao",
        label: "Comunicação",
        icon: MessageSquare,
        path: "/comunicacao",
        badge: "2",
        isActive: currentPath.startsWith("/comunicacao"),
      },
      {
        id: "relatorios",
        label: "Relatórios",
        icon: BarChart3,
        path: "/relatorios",
        isActive: currentPath.startsWith("/relatorios"),
      },
      {
        id: "financeiro",
        label: "Financeiro",
        icon: DollarSign,
        path: "/financeiro",
        isActive: currentPath.startsWith("/financeiro"),
      },
      {
        id: "documentos",
        label: "Documentos",
        icon: FolderOpen,
        path: "/ged",
        badge: "15",
        isActive: currentPath.startsWith("/ged"),
      },
    ];
  }, [location.pathname]);

  // AI Insights simulation
  const aiInsights = useMemo(
    (): AIInsight[] => [
      {
        id: "client-engagement",
        type: "insight",
        title: "Engajamento de Clientes",
        description: "3 clientes VIP não interagiram nos últimos 7 dias",
        action: "Ver clientes",
        priority: "medium",
      },
      {
        id: "duplicate-clients",
        type: "suggestion",
        title: "Clientes Duplicados",
        description: "2 possíveis duplicatas detectadas",
        action: "Revisar",
        priority: "low",
      },
      {
        id: "deadline-alert",
        type: "alert",
        title: "Prazos Próximos",
        description: "5 processos com prazos em 48h",
        action: "Verificar",
        priority: "high",
      },
    ],
    [],
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "k":
            e.preventDefault();
            // Focus search
            document.getElementById("global-search")?.focus();
            break;
          case "c":
            e.preventDefault();
            navigate("/crm/clientes?action=new");
            break;
          case "p":
            e.preventDefault();
            navigate("/crm/processos?action=new");
            break;
          case "t":
            e.preventDefault();
            navigate("/crm/tarefas?action=new");
            break;
        }
      }

      if (e.key === "Escape") {
        setSidebarOpen(false);
        setSearchQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate]);

  // Filter management
  const handleFilterToggle = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchQuery("");
  };

  // Section collapse toggle
  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Minimalist Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Left section */}
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <MobileSidebar
                  navigationItems={navigationItems}
                  onNavigate={(path) => {
                    navigate(path);
                    setSidebarOpen(false);
                  }}
                />
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                Lawdesk
              </span>
            </div>

            {/* Quick Actions */}
            <div className="hidden lg:flex items-center gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  onClick={() => navigate(action.path)}
                  size="sm"
                  className={cn(
                    "flex items-center gap-2 text-white hover:opacity-90",
                    action.color,
                  )}
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden xl:inline">{action.label}</span>
                  {action.shortcut && (
                    <kbd className="hidden xl:inline-flex h-5 select-none items-center gap-1 rounded border bg-white/20 px-1.5 font-mono text-xs text-white">
                      ⌘{action.shortcut}
                    </kbd>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Center section - Global Search */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="global-search"
                placeholder="Buscar clientes, processos, tarefas... (⌘K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 bg-gray-50 dark:bg-gray-800 border-0 focus:bg-white dark:focus:bg-gray-700"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Filters */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Filter className="w-4 h-4" />
                  {activeFilters.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                      {activeFilters.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <h4 className="font-medium text-sm mb-2">Filtros Rápidos</h4>
                  {["Ativos", "VIP", "Prospectos", "Inadimplentes"].map(
                    (filter) => (
                      <label
                        key={filter}
                        className="flex items-center gap-2 py-1 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={activeFilters.includes(filter)}
                          onChange={() => handleFilterToggle(filter)}
                          className="rounded"
                        />
                        <span className="text-sm">{filter}</span>
                      </label>
                    ),
                  )}
                  {activeFilters.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="w-full justify-start"
                      >
                        Limpar todos
                      </Button>
                    </>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* AI Insights */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Zap className="w-4 h-4" />
                  {aiInsights.filter((i) => i.priority === "high").length >
                    0 && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-3">
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Insights IA
                  </h4>
                  <div className="space-y-3">
                    {aiInsights.map((insight) => (
                      <Card key={insight.id} className="p-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full mt-2",
                              insight.priority === "high"
                                ? "bg-red-500"
                                : insight.priority === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-blue-500",
                            )}
                          />
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">
                              {insight.title}
                            </h5>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {insight.description}
                            </p>
                            {insight.action && (
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 h-auto text-xs mt-2"
                              >
                                {insight.action}
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm">
                    {user?.name || "Usuário"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Active Filters Bar */}
        <AnimatePresence>
          {(activeFilters.length > 0 || searchQuery) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"
            >
              <div className="flex items-center gap-2 px-4 py-2">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Filtros ativos:
                </span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Busca: "{searchQuery}"
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => setSearchQuery("")}
                    />
                  </Badge>
                )}
                {activeFilters.map((filter) => (
                  <Badge key={filter} variant="secondary" className="gap-1">
                    {filter}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => handleFilterToggle(filter)}
                    />
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="ml-auto text-xs"
                >
                  Limpar tudo
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Desktop Layout */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-[calc(100vh-56px)]">
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.id}
                item={item}
                onNavigate={navigate}
                collapsedSections={collapsedSections}
                onToggleSection={toggleSection}
              />
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-56px)]">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

// Navigation Item Component
const NavigationItem: React.FC<{
  item: NavigationItem;
  onNavigate: (path: string) => void;
  collapsedSections: string[];
  onToggleSection: (id: string) => void;
  level?: number;
}> = ({ item, onNavigate, collapsedSections, onToggleSection, level = 0 }) => {
  const hasChildren = item.children && item.children.length > 0;
  const isCollapsed = collapsedSections.includes(item.id);

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer group transition-colors",
          item.isActive
            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
          level > 0 && "ml-4",
        )}
        onClick={() => {
          if (hasChildren) {
            onToggleSection(item.id);
          } else {
            onNavigate(item.path);
          }
        }}
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        <span className="flex-1 text-sm font-medium">{item.label}</span>
        {item.badge && (
          <Badge variant="secondary" className="text-xs">
            {item.badge}
          </Badge>
        )}
        {hasChildren && (
          <motion.div
            animate={{ rotate: isCollapsed ? 0 : 90 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {hasChildren && !isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-1 mt-1">
              {item.children?.map((child) => (
                <NavigationItem
                  key={child.id}
                  item={child}
                  onNavigate={onNavigate}
                  collapsedSections={collapsedSections}
                  onToggleSection={onToggleSection}
                  level={level + 1}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Mobile Sidebar Component
const MobileSidebar: React.FC<{
  navigationItems: NavigationItem[];
  onNavigate: (path: string) => void;
}> = ({ navigationItems, onNavigate }) => {
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  return (
    <div className="h-full bg-white dark:bg-gray-900">
      <SheetHeader className="p-4 border-b border-gray-200 dark:border-gray-800">
        <SheetTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Scale className="w-5 h-5 text-white" />
          </div>
          Lawdesk CRM
        </SheetTitle>
      </SheetHeader>

      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.id}
            item={item}
            onNavigate={onNavigate}
            collapsedSections={collapsedSections}
            onToggleSection={toggleSection}
          />
        ))}
      </nav>
    </div>
  );
};

export default MinimalistSaaSLayout;
