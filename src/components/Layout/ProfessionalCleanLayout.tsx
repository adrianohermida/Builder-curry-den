import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Settings,
  User,
  Menu,
  X,
  Home,
  Users,
  Scale,
  FileText,
  Calendar,
  BarChart3,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  LogOut,
  Rss,
  MessageCircle,
  FolderOpen,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { usePermissions } from "@/hooks/usePermissions";
import GlobalNotificationsWidget from "@/components/Feed/GlobalNotificationsWidget";
import { cn } from "@/lib/utils";

// Types
interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  children?: NavigationItem[];
  isActive?: boolean;
}

const ProfessionalCleanLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = usePermissions();

  // State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<string[]>(["crm"]);

  // Navigation structure - COMPLETA COM FEED E INTEGRAÇÕES
  const navigationItems: NavigationItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/painel",
      isActive: location.pathname === "/painel",
    },
    {
      id: "feed",
      label: "Feed",
      icon: Rss,
      path: "/feed",
      isActive: location.pathname.startsWith("/feed"),
    },
    {
      id: "crm",
      label: "CRM",
      icon: Users,
      path: "/crm",
      isActive: location.pathname.startsWith("/crm"),
      children: [
        {
          id: "clients",
          label: "Clientes",
          icon: Users,
          path: "/crm/clientes",
          isActive: location.pathname.startsWith("/crm/clientes"),
        },
        {
          id: "processes",
          label: "Casos e Processos",
          icon: Scale,
          path: "/crm/processos",
          isActive: location.pathname.startsWith("/crm/processos"),
        },
        {
          id: "contracts",
          label: "Contratos",
          icon: FileText,
          path: "/crm/contratos",
          isActive: location.pathname.startsWith("/crm/contratos"),
        },
        {
          id: "tasks",
          label: "Tarefas",
          icon: Target,
          path: "/crm/tarefas",
          isActive: location.pathname.startsWith("/crm/tarefas"),
        },
      ],
    },
    {
      id: "calendar",
      label: "Calendário",
      icon: Calendar,
      path: "/agenda",
      isActive: location.pathname.startsWith("/agenda"),
    },
    {
      id: "communication",
      label: "Comunicação",
      icon: MessageCircle,
      path: "/comunicacao",
      isActive: location.pathname.startsWith("/comunicacao"),
    },
    {
      id: "documents",
      label: "Documentos",
      icon: FolderOpen,
      path: "/ged",
      isActive: location.pathname.startsWith("/ged"),
    },
    {
      id: "reports",
      label: "Relatórios",
      icon: BarChart3,
      path: "/relatorios",
      isActive: location.pathname.startsWith("/relatorios"),
    },
  ];

  // Toggle expanded items
  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  // Handle navigation
  const handleNavigate = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("global-search")?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header - LIMPO E SIMPLES */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16">
        <div className="flex items-center justify-between px-6 h-full">
          {/* Left section */}
          <div className="flex items-center gap-4">
            {/* Mobile menu */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden p-2">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 bg-gray-50">
                <MobileSidebar
                  navigationItems={navigationItems}
                  expandedItems={expandedItems}
                  onToggleExpanded={toggleExpanded}
                  onNavigate={handleNavigate}
                />
              </SheetContent>
            </Sheet>

            {/* Logo - SIMPLES */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900 text-lg">
                Lawdesk
              </span>
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="global-search"
                placeholder="Buscar... (⌘K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:border-gray-900 focus:ring-0"
              />
            </div>
          </div>

          {/* Right section - MINIMALISTA */}
          <div className="flex items-center gap-3">
            <GlobalNotificationsWidget
              variant="header"
              className="text-gray-600 hover:text-gray-900"
            />

            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <Settings className="w-5 h-5" />
            </Button>

            {/* User Menu - SIMPLES */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-gray-200 text-gray-700 text-sm">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium text-gray-700">
                    {user?.name || "Usuário"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Ajuda
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Desktop Sidebar - SUPER LIMPO */}
        <aside className="hidden md:block w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
          <nav className="p-4">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <NavigationItem
                  key={item.id}
                  item={item}
                  expandedItems={expandedItems}
                  onToggleExpanded={toggleExpanded}
                  onNavigate={handleNavigate}
                />
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white">{children}</main>
      </div>
    </div>
  );
};

// Navigation Item Component - SIMPLES
const NavigationItem: React.FC<{
  item: NavigationItem;
  expandedItems: string[];
  onToggleExpanded: (id: string) => void;
  onNavigate: (path: string) => void;
  level?: number;
}> = ({ item, expandedItems, onToggleExpanded, onNavigate, level = 0 }) => {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems.includes(item.id);

  return (
    <div>
      <button
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-colors",
          "hover:bg-white hover:shadow-sm",
          item.isActive
            ? "bg-white shadow-sm text-gray-900 font-medium"
            : "text-gray-600",
          level > 0 && "ml-4 text-sm",
        )}
        onClick={() => {
          if (hasChildren) {
            onToggleExpanded(item.id);
          } else {
            onNavigate(item.path);
          }
        }}
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        <span className="flex-1">{item.label}</span>
        {hasChildren && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        )}
      </button>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-1 space-y-1">
              {item.children?.map((child) => (
                <NavigationItem
                  key={child.id}
                  item={child}
                  expandedItems={expandedItems}
                  onToggleExpanded={onToggleExpanded}
                  onNavigate={onNavigate}
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

// Mobile Sidebar - LIMPO
const MobileSidebar: React.FC<{
  navigationItems: NavigationItem[];
  expandedItems: string[];
  onToggleExpanded: (id: string) => void;
  onNavigate: (path: string) => void;
}> = ({ navigationItems, expandedItems, onToggleExpanded, onNavigate }) => {
  return (
    <div className="h-full bg-gray-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900">Lawdesk</span>
        </div>
      </div>

      <nav className="p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              expandedItems={expandedItems}
              onToggleExpanded={onToggleExpanded}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </nav>
    </div>
  );
};

export default ProfessionalCleanLayout;
