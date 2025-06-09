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
  disabled?: boolean;
}

const viewOptions: ViewOption[] = [
  {
    type: "list",
    label: "Lista",
    icon: List,
    description: "Visualização em tabela tradicional",
  },
  {
    type: "kanban",
    label: "Kanban",
    icon: Kanban,
    description: "Quadro visual estilo Trello",
  },
  {
    type: "cards",
    label: "Cards",
    icon: LayoutGrid,
    description: "Grade de cartões informativos",
  },
  {
    type: "pipeline",
    label: "Pipeline",
    icon: Workflow,
    description: "Funil de vendas/processos",
    premium: true,
  },
  {
    type: "timeline",
    label: "Timeline",
    icon: Clock,
    description: "Linha do tempo cronológica",
    premium: true,
  },
  {
    type: "calendar",
    label: "Calendário",
    icon: CalendarDays,
    description: "Visualização por data",
  },
  {
    type: "gantt",
    label: "Gantt",
    icon: BarChart3,
    description: "Gráfico de Gantt para projetos",
    premium: true,
  },
];

export interface ViewSelectorProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  module?: string;
  userPlan?: "free" | "pro" | "enterprise";
  className?: string;
  compact?: boolean;
}

export function ViewSelector({
  currentView,
  onViewChange,
  module = "general",
  userPlan = "pro",
  className,
  compact = false,
}: ViewSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getCurrentViewOption = () => {
    return viewOptions.find((option) => option.type === currentView);
  };

  const isViewAvailable = (option: ViewOption) => {
    if (option.premium && userPlan === "free") {
      return false;
    }
    return !option.disabled;
  };

  const handleViewChange = (view: ViewType) => {
    const option = viewOptions.find((opt) => opt.type === view);
    if (option && isViewAvailable(option)) {
      onViewChange(view);
      setIsOpen(false);
    }
  };

  const currentOption = getCurrentViewOption();

  if (compact) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {viewOptions.slice(0, 3).map((option) => {
          const Icon = option.icon;
          const isActive = option.type === currentView;
          const isAvailable = isViewAvailable(option);

          return (
            <TooltipProvider key={option.type}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleViewChange(option.type)}
                    disabled={!isAvailable}
                    className={cn(
                      "h-8 w-8 p-0",
                      !isAvailable && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {option.description}
                    </div>
                    {option.premium && userPlan === "free" && (
                      <Badge variant="outline" className="mt-1">
                        <Crown className="h-3 w-3 mr-1" />
                        Pro
                      </Badge>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}

        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Settings2 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mais Visualizações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {viewOptions.slice(3).map((option) => {
              const Icon = option.icon;
              const isActive = option.type === currentView;
              const isAvailable = isViewAvailable(option);

              return (
                <DropdownMenuItem
                  key={option.type}
                  onClick={() => handleViewChange(option.type)}
                  disabled={!isAvailable}
                  className={cn(isActive && "bg-accent")}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span>{option.label}</span>
                      {option.premium && userPlan === "free" && (
                        <Badge variant="outline" className="text-xs">
                          <Crown className="h-2 w-2 mr-1" />
                          Pro
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {option.description}
                    </div>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn("gap-2", className)}>
          {currentOption && <currentOption.icon className="h-4 w-4" />}
          <span>{currentOption?.label || "Visualização"}</span>
          <ArrowUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Visualizações Disponíveis
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {viewOptions.map((option) => {
          const Icon = option.icon;
          const isActive = option.type === currentView;
          const isAvailable = isViewAvailable(option);

          return (
            <DropdownMenuItem
              key={option.type}
              onClick={() => handleViewChange(option.type)}
              disabled={!isAvailable}
              className={cn(
                "flex items-start gap-3 p-3",
                isActive && "bg-accent",
                !isAvailable && "opacity-50 cursor-not-allowed",
              )}
            >
              <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{option.label}</span>
                  {option.premium && userPlan === "free" && (
                    <Badge variant="outline" className="text-xs">
                      <Crown className="h-2 w-2 mr-1" />
                      Pro
                    </Badge>
                  )}
                  {isActive && (
                    <Badge variant="secondary" className="text-xs">
                      Ativo
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {option.description}
                </p>
              </div>
            </DropdownMenuItem>
          );
        })}

        {userPlan === "free" && (
          <>
            <DropdownMenuSeparator />
            <div className="p-3 text-center">
              <p className="text-xs text-muted-foreground mb-2">
                Desbloqueie todas as visualizações
              </p>
              <Button size="sm" variant="default" className="w-full">
                <Crown className="h-3 w-3 mr-1" />
                Upgrade para Pro
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
