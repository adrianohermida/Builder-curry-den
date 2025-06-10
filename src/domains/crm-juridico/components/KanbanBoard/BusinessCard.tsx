/**
 * Business Card Component
 *
 * Card component for displaying business information in Kanban board
 */

import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Business } from "../../types/business";

interface BusinessCardProps {
  business: Business;
  compact?: boolean;
  isDragging?: boolean;
  onClick: (business: Business) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  compact = false,
  isDragging = false,
  onClick,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: business.currency || "BRL",
    }).format(value);
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 80) return "text-green-600";
    if (priority >= 60) return "text-yellow-600";
    if (priority >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "open":
        return "default";
      case "won":
        return "secondary";
      case "lost":
        return "destructive";
      case "postponed":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div
      className={cn(
        "bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer",
        "p-3 space-y-2",
        compact && "p-2 space-y-1",
        isDragging && "opacity-50 rotate-2 shadow-lg",
      )}
      onClick={() => onClick(business)}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <h4
          className={cn(
            "font-medium text-gray-900 line-clamp-2",
            compact ? "text-sm" : "text-base",
          )}
        >
          {business.title}
        </h4>
        <Badge
          variant={getStatusBadgeVariant(business.status)}
          className={cn("text-xs", compact && "text-[10px] px-1")}
        >
          {business.status}
        </Badge>
      </div>

      {/* Contact Info */}
      <div className="flex items-center space-x-2">
        <Avatar className={cn("h-6 w-6", compact && "h-4 w-4")}>
          <AvatarFallback className="text-xs">
            {business.contact?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <span
          className={cn(
            "text-gray-600 truncate",
            compact ? "text-xs" : "text-sm",
          )}
        >
          {business.contact?.name || "Sem contato"}
        </span>
      </div>

      {/* Value and Probability */}
      <div className="flex items-center justify-between">
        <div>
          <div className={cn("font-semibold", compact ? "text-sm" : "text-lg")}>
            {formatCurrency(business.value)}
          </div>
          <div className={cn("text-gray-500", compact ? "text-xs" : "text-sm")}>
            Prob: {business.probability}%
          </div>
        </div>
        <div
          className={cn(
            "text-right",
            getPriorityColor(business.probability),
            compact ? "text-xs" : "text-sm",
          )}
        >
          <div className="font-medium">{business.legalService}</div>
          <div className="text-gray-500">{business.caseType}</div>
        </div>
      </div>

      {/* Tags */}
      {!compact && business.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {business.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {business.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{business.tags.length - 2}
            </Badge>
          )}
        </div>
      )}

      {/* Expected Close Date */}
      {business.expectedCloseDate && (
        <div className={cn("text-gray-500", compact ? "text-xs" : "text-sm")}>
          Prev: {new Date(business.expectedCloseDate).toLocaleDateString()}
        </div>
      )}

      {/* Assignment */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Resp: {business.assignedUser?.name || "Não atribuído"}</span>
        {business.lastActivityAt && (
          <span>
            Último: {new Date(business.lastActivityAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default BusinessCard;
