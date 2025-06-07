import { Menu, Bell, User, ChevronDown, Search, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NotificationCenter } from "@/components/CRM/NotificationCenter";
import { MobileNav } from "@/components/ui/mobile-nav";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/usePermissions";

interface TopbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
  showMobileNav?: boolean;
}

export function Topbar({
  onMenuClick,
  sidebarOpen,
  showMobileNav = false,
}: TopbarProps) {
  const { user } = usePermissions();

  return (
    <header className="topbar">
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Navigation */}
        {showMobileNav ? (
          <MobileNav />
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden touch-target"
            aria-label="Alternar menu lateral"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Logo for mobile when sidebar is closed */}
        {showMobileNav && (
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Scale className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm">Lawdesk</span>
          </div>
        )}

        {/* App Switcher - Hidden on mobile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="hidden sm:flex items-center gap-2"
            >
              <span className="font-medium">Lawdesk CRM</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem>
              <div className="flex flex-col">
                <span className="font-medium">Lawdesk CRM</span>
                <span className="text-xs text-muted-foreground">
                  Sistema Principal
                </span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <div className="flex flex-col">
                <span className="font-medium">Lawdesk Docs</span>
                <span className="text-xs text-muted-foreground">Em breve</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <div className="flex flex-col">
                <span className="font-medium">Lawdesk Analytics</span>
                <span className="text-xs text-muted-foreground">Em breve</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {/* Quick Search - Desktop only */}
        <Button
          variant="ghost"
          size="sm"
          className="hidden md:flex items-center gap-2 text-muted-foreground"
          onClick={() => {
            document.dispatchEvent(new CustomEvent("open-global-search"));
          }}
        >
          <Search className="h-4 w-4" />
          <span className="hidden lg:inline text-sm">Buscar...</span>
          <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle
          variant="button"
          showLabel={false}
          className="touch-target"
        />

        {/* Notifications */}
        <NotificationCenter />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 touch-target"
            >
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium">
                  {user?.name || "Usuário"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user?.email || "user@lawdesk.com"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 hidden sm:inline" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {user?.name || "Usuário"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user?.role === "admin"
                    ? "Administrador"
                    : user?.role === "advogado"
                      ? "Advogado"
                      : user?.role === "estagiario"
                        ? "Estagiário"
                        : user?.role === "secretaria"
                          ? "Secretária"
                          : "Cliente"}
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>Configurações da Conta</DropdownMenuItem>
            <DropdownMenuItem>Central de Ajuda</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Sair do Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
