import { useState } from "react";
import {
  List,
  LayoutGrid,
  Kanban,
  Clock,
  CalendarDays,
  BarChart3,
  Workflow,
  Smartphone,
  ArrowUpDown,
  Filter,
  Search,
  Settings2,
  Crown,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type ViewType =
  | "list"
  | "kanban"
  | "pipeline"
  | "gantt"
  | "timeline"
  | "cards"
  | "calendar";

export interface ViewOption {
  type: ViewType;
  label: string;
  icon: any;
  description: string;
  premium?: boolean;
  availableFor: string[];
  shortcut?: string;
}

interface ViewSelectorProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  module: "crm" | "tasks" | "calendar" | "publications" | "tickets";
  userPlan?: "basic" | "pro" | "premium";
  className?: string;
}

const viewOptions: ViewOption[] = [
  {
    type: "list",
    label: "Lista",
    icon: List,
    description: "Visualização em tabela tradicional",
    availableFor: ["crm", "tasks", "calendar", "publications", "tickets"],
    shortcut: "L",
  },
  {
    type: "kanban",
    label: "Kanban",
    icon: Kanban,
    description: "Quadros por status, área ou responsável",
    availableFor: ["crm", "tasks", "tickets"],
    shortcut: "K",
  },
  {
    type: "pipeline",
    label: "Pipeline",
    icon: Workflow,
    description: "Funil de vendas e etapas processuais",
    premium: true,
    availableFor: ["crm"],
    shortcut: "P",
  },
  {
    type: "gantt",
    label: "Gantt",
    icon: BarChart3,
    description: "Cronograma e dependências",
    premium: true,
    availableFor: ["tasks", "calendar"],
    shortcut: "G",
  },
  {
    type: "timeline",
    label: "Timeline",
    icon: Clock,
    description: "Linha do tempo vertical com eventos",
    availableFor: ["publications", "tasks", "crm"],
    shortcut: "T",
  },
  {
    type: "cards",
    label: "Cards",
    icon: LayoutGrid,
    description: "Cards compactos - ideal para mobile",
    availableFor: ["crm", "tasks", "publications", "tickets"],
    shortcut: "C",
  },
  {
    type: "calendar",
    label: "Calendário",
    icon: CalendarDays,
    description: "Visualização mensal/semanal/diária",
    availableFor: ["calendar", "tasks"],
    shortcut: "M",
  },
];

export function ViewSelector({
  currentView,
  onViewChange,
  module,
  userPlan = "basic",
  className,
}: ViewSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const availableViews = viewOptions.filter((view) =>
    view.availableFor.includes(module),
  );

  const currentViewOption = availableViews.find(
    (view) => view.type === currentView,
  );

  const canUseView = (view: ViewOption) => {
    if (!view.premium) return true;
    return userPlan === "pro" || userPlan === "premium";
  };

  const handleViewChange = (viewType: ViewType) => {
    const view = viewOptions.find((v) => v.type === viewType);
    if (view && !canUseView(view)) {
      // Show upgrade modal/toast
      return;
    }
    onViewChange(viewType);
    setIsOpen(false);
  };

  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-2", className)}>
        {/* Main View Selector */}
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 min-w-[120px]">
              {currentViewOption && (
                <currentViewOption.icon className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {currentViewOption?.label || "Visualização"}
              </span>
              <Badge variant="secondary" className="ml-auto">
                {availableViews.length}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-80">
            <DropdownMenuLabel className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Visualizações Disponíveis
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {availableViews.map((view) => {
              const canUse = canUseView(view);
              const isActive = currentView === view.type;

              return (
                <DropdownMenuItem
                  key={view.type}
                  onClick={() => handleViewChange(view.type)}
                  disabled={!canUse}
                  className={cn(
                    "flex flex-col items-start gap-1 p-3 cursor-pointer",
                    isActive && "bg-accent",
                    !canUse && "opacity-50",
                  )}
                >
                  <div className="flex items-center gap-2 w-full">
                    <view.icon className="h-4 w-4" />
                    <span className="font-medium">{view.label}</span>
                    {view.shortcut && (
                      <Badge variant="outline" className="ml-auto text-xs">
                        {view.shortcut}
                      </Badge>
                    )}
                    {view.premium && (
                      <Crown className="h-3 w-3 text-amber-500" />
                    )}
                    {isActive && (
                      <div className="w-2 h-2 bg-primary rounded-full ml-auto" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {view.description}
                  </span>
                  {!canUse && (
                    <div className="flex items-center gap-1 mt-1">
                      <Crown className="h-3 w-3 text-amber-500" />
                      <span className="text-xs text-amber-600">
                        Disponível no plano Pro
                      </span>
                    </div>
                  )}
                </DropdownMenuItem>
              );
            })}

            {userPlan === "basic" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-amber-600" />
                      <span className="font-medium text-amber-800">
                        Upgrade para Pro
                      </span>
                    </div>
                    <span className="text-xs text-amber-700">
                      Desbloqueie Pipeline, Gantt e recursos avançados
                    </span>
                    <Button
                      size="sm"
                      className="mt-2 bg-amber-600 hover:bg-amber-700"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Fazer Upgrade
                    </Button>
                  </div>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quick Actions */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Busca Global (Ctrl+K)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Filtros Avançados</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ordenação</TooltipContent>
          </Tooltip>

          {/* Mobile Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => handleViewChange("cards")}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Modo Mobile</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

// Hook for keyboard shortcuts
export function useViewShortcuts(
  onViewChange: (view: ViewType) => void,
  module: string,
) {
  useState(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        const shortcuts: Record<string, ViewType> = {
          l: "list",
          k: "kanban",
          p: "pipeline",
          g: "gantt",
          t: "timeline",
          c: "cards",
          m: "calendar",
        };

        if (shortcuts[key]) {
          e.preventDefault();
          const viewType = shortcuts[key];
          const view = viewOptions.find((v) => v.type === viewType);
          if (view && view.availableFor.includes(module)) {
            onViewChange(viewType);
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  });
}
