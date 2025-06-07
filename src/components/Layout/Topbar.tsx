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
    <header
      className={cn(
        "topbar sticky top-0 z-30",
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "border-b border-border",
        "px-4 sm:px-6 lg:px-8",
        "h-16 flex items-center justify-between",
        "transition-all duration-200",
      )}
    >
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Navigation */}
        {showMobileNav ? (
          <MobileNav />
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className={cn(
              "lg:hidden touch-target",
              "h-10 w-10 p-0",
              "hover:bg-accent focus-visible:ring-ring",
            )}
            aria-label="Alternar menu lateral"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Logo for mobile when sidebar is closed */}
        {showMobileNav && (
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center shadow-sm">
              <Scale className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm text-foreground">Lawdesk</span>
          </div>
        )}

        {/* App Switcher - Hidden on mobile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "hidden sm:flex items-center gap-2",
                "text-foreground hover:text-foreground",
                "hover:bg-accent focus-visible:ring-ring",
              )}
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
          className={cn(
            "hidden md:flex items-center gap-2",
            "text-muted-foreground hover:text-foreground",
            "hover:bg-accent focus-visible:ring-ring",
            "h-9 px-3",
          )}
          onClick={() => {
            document.dispatchEvent(new CustomEvent("open-global-search"));
          }}
          aria-label="Abrir busca global"
        >
          <Search className="h-4 w-4" />
          <span className="hidden lg:inline text-sm">Buscar...</span>
          <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle
          variant="button"
          showLabel={false}
          className={cn(
            "touch-target h-9 w-9 p-0",
            "hover:bg-accent focus-visible:ring-ring",
          )}
        />

        {/* Notifications */}
        <NotificationCenter />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "flex items-center gap-2 px-2 touch-target",
                "hover:bg-accent focus-visible:ring-ring",
                "h-10",
              )}
              aria-label="Menu do usuário"
            >
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                <AvatarImage src="" />
                <AvatarFallback
                  className={cn(
                    "text-xs bg-primary text-primary-foreground",
                    "font-medium",
                  )}
                >
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium text-foreground">
                  {user?.name || "Usuário"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user?.email || "user@lawdesk.com"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 hidden sm:inline text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground font-medium">
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
            <DropdownMenuItem className="focus:bg-accent">
              <User className="mr-2 h-4 w-4" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-accent">
              Configurações da Conta
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-accent">
              Central de Ajuda
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
              Sair do Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
