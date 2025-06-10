/**
 * 🎯 MODERN PAGE HEADER - LAWDESK REDESIGN
 *
 * Header inteligente e compacto:
 * - Nome dinâmico da página (zero redundância)
 * - Busca global única
 * - Menu de perfil compacto
 * - Theme toggle (light/dark)
 * - Design minimalista
 * - Responsivo
 */

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Monitor,
  Command,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getCurrentTheme, setTheme, type ThemeMode } from "@/lib/theme";

interface ModernPageHeaderProps {
  className?: string;
  showSearch?: boolean;
}

export const ModernPageHeader: React.FC<ModernPageHeaderProps> = ({
  className,
  showSearch = true,
}) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>("light");

  // Mock user
  const user = {
    name: "Dr. João Silva",
    email: "joao.silva@lawdesk.com",
    role: "Advogado Sênior",
    avatar: null,
    notifications: 3,
  };

  // Update theme state
  useEffect(() => {
    setCurrentTheme(getCurrentTheme());
  }, []);

  // Generate dynamic page title based on route
  const getPageInfo = () => {
    const path = location.pathname;

    const pageMap: Record<string, { title: string; subtitle?: string }> = {
      "/": {
        title: "Painel de Controle",
        subtitle: "Visão geral do escritório",
      },
      "/painel": {
        title: "Painel de Controle",
        subtitle: "Visão geral do escritório",
      },
      "/crm-modern": {
        title: "CRM Jurídico",
        subtitle: "Gestão inteligente e colaborativa",
      },
      "/crm-modern/clientes": {
        title: "Clientes",
        subtitle: "Gestão de relacionamento",
      },
      "/crm-modern/processos": {
        title: "Processos",
        subtitle: "Acompanhamento processual",
      },
      "/crm-modern/tarefas": {
        title: "Tarefas",
        subtitle: "Organização e produtividade",
      },
      "/crm-modern/documentos": {
        title: "Documentos",
        subtitle: "Gestão documental",
      },
      "/crm-modern/contratos": {
        title: "Contratos",
        subtitle: "Gestão contratual",
      },
      "/crm-modern/financeiro": {
        title: "Financeiro",
        subtitle: "Pipeline de cobrança",
      },
      "/agenda": { title: "Agenda", subtitle: "Compromissos e eventos" },
      "/publicacoes": {
        title: "Publicações",
        subtitle: "Diário oficial e acompanhamento",
      },
      "/atendimento": {
        title: "Atendimento",
        subtitle: "Suporte e comunicação",
      },
      "/configuracoes-usuario": {
        title: "Configurações",
        subtitle: "Personalização do sistema",
      },
      "/tempo": {
        title: "Controle de Tempo",
        subtitle: "Timesheet e produtividade",
      },
      "/beta": { title: "Beta", subtitle: "Recursos em desenvolvimento" },
      "/beta/reports": {
        title: "Relatórios Beta",
        subtitle: "Analytics de páginas órfãs",
      },
      "/beta/optimization": {
        title: "Higienização de Código",
        subtitle: "Otimização automática",
      },
    };

    // Try exact match first
    if (pageMap[path]) {
      return pageMap[path];
    }

    // Try partial matches for dynamic routes
    for (const [route, info] of Object.entries(pageMap)) {
      if (path.startsWith(route) && route !== "/") {
        return info;
      }
    }

    return { title: "Lawdesk", subtitle: "CRM Jurídico Moderno" };
  };

  const pageInfo = getPageInfo();

  const handleThemeChange = (theme: ThemeMode) => {
    setTheme(theme);
    setCurrentTheme(theme);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Implement global search here
    }
  };

  return (
    <header
      className={cn(
        "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40",
        className,
      )}
    >
      {/* Left - Page Info */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
            {pageInfo.title}
          </h1>
          {pageInfo.subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {pageInfo.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Center - Global Search */}
      {showSearch && (
        <div className="flex-1 max-w-md mx-6">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Busca global..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-12 w-full bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 transition-colors"
            />
            <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <Command className="w-3 h-3" />K
            </kbd>
          </form>
        </div>
      )}

      {/* Right - Actions and User */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {currentTheme === "light" && <Sun className="w-4 h-4" />}
              {currentTheme === "dark" && <Moon className="w-4 h-4" />}
              {currentTheme === "auto" && <Monitor className="w-4 h-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={currentTheme}
              onValueChange={(value) => handleThemeChange(value as ThemeMode)}
            >
              <DropdownMenuRadioItem value="light">
                <Sun className="w-4 h-4 mr-2" />
                Claro
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">
                <Moon className="w-4 h-4 mr-2" />
                Escuro
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="auto">
                <Monitor className="w-4 h-4 mr-2" />
                Sistema
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 relative hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Bell className="w-4 h-4" />
              {user.notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-3 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">Notificações</h3>
                <Badge variant="secondary" className="text-xs">
                  {user.notifications}
                </Badge>
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <div className="p-3 border-b hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Nova mensagem recebida
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Cliente João Silva enviou uma mensagem
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      2 min atrás
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 border-b hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Prazo se aproximando
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Petição vence em 2 dias
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      1 hora atrás
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-2 border-t">
              <Button variant="ghost" className="w-full text-sm">
                Ver todas as notificações
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 h-8 px-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-white">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              </div>
              <span className="text-sm font-medium hidden sm:block max-w-24 truncate">
                {user.name.split(" ")[0]}
              </span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-3 border-b">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
              <Badge variant="secondary" className="text-xs mt-1">
                {user.role}
              </Badge>
            </div>
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 dark:text-red-400">
              <LogOut className="w-4 h-4 mr-2" />
              Sair do Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default ModernPageHeader;
