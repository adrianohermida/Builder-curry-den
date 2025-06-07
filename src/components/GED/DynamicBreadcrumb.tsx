import { ChevronRight, Home, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";

export interface BreadcrumbSegment {
  id: string;
  name: string;
  type: "root" | "client" | "process" | "folder";
  path: string[];
}

interface DynamicBreadcrumbProps {
  segments: BreadcrumbSegment[];
  canGoBack: boolean;
  canGoForward: boolean;
  onNavigate: (path: string[]) => void;
  onGoBack: () => void;
  onGoForward: () => void;
  fileCount?: number;
  className?: string;
}

export function DynamicBreadcrumb({
  segments,
  canGoBack,
  canGoForward,
  onNavigate,
  onGoBack,
  onGoForward,
  fileCount,
  className = "",
}: DynamicBreadcrumbProps) {
  const getSegmentIcon = (type: BreadcrumbSegment["type"]) => {
    switch (type) {
      case "root":
        return "🏠";
      case "client":
        return "👤";
      case "process":
        return "⚖️";
      case "folder":
        return "📁";
      default:
        return "📁";
    }
  };

  const getTypeColor = (type: BreadcrumbSegment["type"]) => {
    switch (type) {
      case "client":
        return "text-blue-600";
      case "process":
        return "text-purple-600";
      case "folder":
        return "text-amber-600";
      default:
        return "text-gray-600";
    }
  };

  if (segments.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Navigation Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onGoBack}
          disabled={!canGoBack}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onGoForward}
          disabled={!canGoForward}
          className="h-8 w-8 p-0"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="flex-1 min-w-0">
        <Breadcrumb>
          <BreadcrumbList>
            {segments.map((segment, index) => {
              const isLast = index === segments.length - 1;
              const isClickable = !isLast && segment.path.length > 0;

              return (
                <div key={segment.id} className="flex items-center">
                  <BreadcrumbItem>
                    {isClickable ? (
                      <BreadcrumbLink
                        onClick={() => onNavigate(segment.path)}
                        className={`flex items-center gap-1 cursor-pointer hover:${getTypeColor(segment.type)} transition-colors`}
                      >
                        <span className="text-lg leading-none">
                          {getSegmentIcon(segment.type)}
                        </span>
                        <span className="hidden sm:inline">{segment.name}</span>
                        <span className="sm:hidden">
                          {segment.name.length > 12
                            ? `${segment.name.substring(0, 12)}...`
                            : segment.name}
                        </span>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage
                        className={`flex items-center gap-1 ${getTypeColor(segment.type)}`}
                      >
                        <span className="text-lg leading-none">
                          {getSegmentIcon(segment.type)}
                        </span>
                        <span className="hidden sm:inline font-medium">
                          {segment.name}
                        </span>
                        <span className="sm:hidden font-medium">
                          {segment.name.length > 12
                            ? `${segment.name.substring(0, 12)}...`
                            : segment.name}
                        </span>
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>

                  {!isLast && (
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-4 w-4" />
                    </BreadcrumbSeparator>
                  )}
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* File Count Badge */}
      {fileCount !== undefined && (
        <Badge variant="secondary" className="hidden sm:flex">
          {fileCount} arquivo{fileCount !== 1 ? "s" : ""}
        </Badge>
      )}
    </div>
  );
}
