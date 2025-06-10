/**
 * 🎯 UNIFIED TOPBAR - CABEÇALHO PRINCIPAL UNIFICADO
 *
 * Cabeçalho consolidado do sistema com:
 * - Controles de navegação
 * - Busca global
 * - Notificações
 * - Perfil do usuário
 * - Breadcrumbs
 * - Tema switcher
 */

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  Settings,
  User,
  Moon,
  Sun,
  Monitor,
  LogOut,
  ChevronRight,
  Home,
  Maximize2,
  Minimize2,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Context
import { useUnifiedLayout } from "./UnifiedLayout";

// ===== TYPES =====
interface UnifiedTopbarProps {
  className?: string;
}

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "page" | "client" | "process" | "document";
  path: string;
}

// ===== MOCK DATA =====
const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "Nova mensagem",
    description: "Ana Silva enviou uma mensagem",
    time: "2 min",
    unread: true,
  },
  {
    id: "2",
    title: "Processo atualizado",
    description: "Processo 1234567-89.2024 teve novo andamento",
    time: "15 min",
    unread: true,
  },
  {
    id: "3",
    title: "Reunião em 30 min",
    description: "Reunião com cliente João Silva",
    time: "30 min",
    unread: false,
  },
];

const MOCK_SEARCH_RESULTS: SearchResult[] = [
  {
    id: "1",
    title: "João Silva",
    description: "Cliente - Direito Civil",
    type: "client",
    path: "/crm-modern?module=clientes&id=1",
  },
  {
    id: "2",
    title: "Processo 1234567-89.2024",
    description: "Ação de Cobrança",
    type: "process",
    path: "/crm-modern?module=processos&id=2",
  },
  {
    id: "3",
    title: "Contrato de Prestação de Serviços",
    description: "Documento PDF",
    type: "document",
    path: "/crm-modern?module=documentos&id=3",
  },
];

// ===== UNIFIED TOPBAR COMPONENT =====
const UnifiedTopbar: React.FC<UnifiedTopbarProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { layoutState, toggleSidebar, setTheme } = useUnifiedLayout();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock user data
  const currentUser = {
    name: "Usuário Admin",
    email: "admin@lawdesk.com",
    avatar: "/avatars/admin.jpg",
    role: "Administrador",
  };

  // Generate breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = React.useMemo(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const crumbs: BreadcrumbItem[] = [{ label: "Início", path: "/" }];

    const pathMap: Record<string, string> = {
      painel: "Dashboard",
      feed: "Feed",
      "crm-modern": "CRM Jurídico",
      agenda: "Calendário",
      publicacoes: "Publicações",
      atendimento: "Comunicação",
      analytics: "Relatórios",
      beta: "Beta",
      configuracoes: "Configurações",
      "configuracao-armazenamento": "Armazenamento",
      ajuda: "Ajuda",
    };

    let currentPath = "";
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const label =
        pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      crumbs.push({ label, path: currentPath });
    });

    return crumbs;
  }, [location.pathname]);

  // Filter search results
  const filteredResults = MOCK_SEARCH_RESULTS.filter(
    (result) =>
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle theme change
  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    setTheme(theme);
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle search navigation
  const handleSearchSelect = (result: SearchResult) => {
    navigate(result.path);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const unreadNotifications = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div
      className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 ${className}`}
    >
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              <Menu size={20} />
            </Button>

            {/* Breadcrumbs */}
            <nav className="hidden md:flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.path || crumb.label}>
                  {index > 0 && (
                    <ChevronRight size={14} className="text-gray-400" />
                  )}
                  {crumb.path ? (
                    <button
                      onClick={() => navigate(crumb.path!)}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {index === 0 ? (
                        <Home size={14} />
                      ) : (
                        <span>{crumb.label}</span>
                      )}
                    </button>
                  ) : (
                    <span className="text-gray-900 dark:text-white font-medium">
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-md mx-4">
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    placeholder="Buscar clientes, processos, documentos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900"
                    onFocus={() => setSearchOpen(true)}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-96" align="center">
                <Command>
                  <CommandInput
                    placeholder="Digite para buscar..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    {filteredResults.length > 0 ? (
                      <CommandGroup heading="Resultados">
                        {filteredResults.map((result) => (
                          <CommandItem
                            key={result.id}
                            onSelect={() => handleSearchSelect(result)}
                            className="cursor-pointer"
                          >
                            <div className="flex-1">
                              <div className="font-medium">{result.title}</div>
                              <div className="text-sm text-gray-500">
                                {result.description}
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {result.type}
                            </Badge>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ) : searchQuery ? (
                      <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
                    ) : (
                      <CommandGroup heading="Busca rápida">
                        <CommandItem disabled>
                          <span className="text-gray-500">
                            Digite para começar a buscar...
                          </span>
                        </CommandItem>
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              {/* Fullscreen Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="hidden md:flex"
                  >
                    {isFullscreen ? (
                      <Minimize2 size={18} />
                    ) : (
                      <Maximize2 size={18} />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFullscreen ? "Sair da tela cheia" : "Tela cheia"}</p>
                </TooltipContent>
              </Tooltip>

              {/* Theme Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {layoutState.theme === "dark" ? (
                      <Moon size={18} />
                    ) : layoutState.theme === "light" ? (
                      <Sun size={18} />
                    ) : (
                      <Monitor size={18} />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Tema</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleThemeChange("light")}>
                    <Sun size={16} className="mr-2" />
                    Claro
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
                    <Moon size={16} className="mr-2" />
                    Escuro
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleThemeChange("system")}>
                    <Monitor size={16} className="mr-2" />
                    Sistema
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell size={18} />
                    {unreadNotifications > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs"
                      >
                        {unreadNotifications}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {MOCK_NOTIFICATIONS.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex items-start space-x-2 p-3"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          notification.unread ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {notification.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-center justify-center">
                    Ver todas as notificações
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={currentUser.avatar}
                        alt={currentUser.name}
                      />
                      <AvatarFallback>
                        {currentUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{currentUser.name}</p>
                      <p className="text-xs text-gray-500">
                        {currentUser.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {currentUser.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User size={16} className="mr-2" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings size={16} className="mr-2" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut size={16} className="mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedTopbar;
