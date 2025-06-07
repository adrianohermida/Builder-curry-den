import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Menu,
  Sun,
  Moon,
  Monitor,
  Crown,
  Shield,
  Users,
  BarChart3,
  HelpCircle,
  MessageSquare,
  Plus,
  Command,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GlobalSearch } from "@/components/ui/global-search";
import { usePermissions } from "@/hooks/usePermissions";
import { useTheme } from "@/contexts/ThemeContext";
import {
  useAuditSystem,
  AUDIT_ACTIONS,
  AUDIT_MODULES,
} from "@/hooks/useAuditSystem";
import { toast } from "sonner";

interface TopbarProps {
  onMenuClick: () => void;
}

export function EnhancedTopbar({ onMenuClick }: TopbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications] = useState([
    {
      id: 1,
      title: "Nova publicação encontrada",
      message: "Intimação - Processo 123456",
      time: "há 5 min",
      read: false,
      priority: "high",
    },
    {
      id: 2,
      title: "Tarefa vencendo",
      message: "Preparar defesa - João Silva",
      time: "há 15 min",
      read: false,
      priority: "medium",
    },
    {
      id: 3,
      title: "Cliente aguardando",
      message: "Maria Santos solicitou reunião",
      time: "há 1 hora",
      read: true,
      priority: "low",
    },
  ]);

  const { user, logout, isAdmin, hasPermission } = usePermissions();
  const { theme, setTheme } = useTheme();
  const { logAction } = useAuditSystem();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = async () => {
    await logAction(AUDIT_ACTIONS.LOGOUT, AUDIT_MODULES.AUTH, {
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });
    logout();
    toast.success("Logout realizado com sucesso");
  };

  const handleSearchOpen = () => {
    setIsSearchOpen(true);
    logAction(AUDIT_ACTIONS.MODULE_ACCESS, AUDIT_MODULES.DASHBOARD, {
      feature: "global_search",
      timestamp: new Date().toISOString(),
    });
  };

  const roleConfig = {
    admin: { label: "Administrador", icon: Crown, color: "text-yellow-600" },
    advogado: { label: "Advogado", icon: Shield, color: "text-blue-600" },
    estagiario: { label: "Estagiário", icon: Users, color: "text-green-600" },
    secretaria: { label: "Secretária", icon: User, color: "text-purple-600" },
    cliente: { label: "Cliente", icon: User, color: "text-gray-600" },
  };

  const userRole = user ? roleConfig[user.role] : null;

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Quick Actions */}
            <div className="hidden sm:flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/crm?action=novo-cliente">
                      <Plus className="h-4 w-4 mr-2" />
                      Cliente
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Novo Cliente</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/tarefas?action=nova">
                      <Plus className="h-4 w-4 mr-2" />
                      Tarefa
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Nova Tarefa</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Center section - Search */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground"
                onClick={handleSearchOpen}
              >
                <Search className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">
                  Buscar clientes, processos...
                </span>
                <span className="sm:hidden">Buscar...</span>
                <kbd className="hidden sm:inline-flex ml-auto pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100">
                  <Command className="h-3 w-3" />K
                </kbd>
              </Button>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Help */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ajuda e Suporte</p>
              </TooltipContent>
            </Tooltip>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  Notificações
                  <Badge variant="secondary">{unreadCount} novas</Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex flex-col items-start p-3 cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-medium text-sm">
                          {notification.title}
                        </span>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                          <Badge
                            variant={
                              notification.priority === "high"
                                ? "destructive"
                                : notification.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {notification.priority}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.time}
                      </p>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center">
                  <Link
                    to="/notifications"
                    className="text-sm text-muted-foreground"
                  >
                    Ver todas as notificações
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="h-4 w-4 mr-2" />
                  Claro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="h-4 w-4 mr-2" />
                  Escuro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Monitor className="h-4 w-4 mr-2" />
                  Sistema
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
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                    {userRole && (
                      <div className="flex items-center gap-1 mt-1">
                        <userRole.icon
                          className={`h-3 w-3 ${userRole.color}`}
                        />
                        <span className="text-xs text-muted-foreground">
                          {userRole.label}
                        </span>
                      </div>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Perfil
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações
                  </Link>
                </DropdownMenuItem>

                {hasPermission("dashboard", "read") && (
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard-executivo">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Dashboard Executivo
                    </Link>
                  </DropdownMenuItem>
                )}

                {isAdmin() && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Shield className="h-4 w-4 mr-2" />
                        Administração
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem asChild>
                          <Link to="/admin/users">
                            <Users className="h-4 w-4 mr-2" />
                            Usuários
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/admin/audit">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Logs de Auditoria
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/admin/settings">
                            <Settings className="h-4 w-4 mr-2" />
                            Configurações Globais
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Global Search Modal */}
        <GlobalSearch open={isSearchOpen} onOpenChange={setIsSearchOpen} />
      </header>
    </TooltipProvider>
  );
}

// Keyboard shortcut for global search
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    // This would be handled by the parent component
    document.dispatchEvent(new CustomEvent("open-global-search"));
  }
});
