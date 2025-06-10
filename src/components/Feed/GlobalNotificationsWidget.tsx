import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  Users,
  Scale,
  Target,
  Calendar,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  AtSign,
  Heart,
  MessageSquare,
  TrendingUp,
  Eye,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import useFeedIntegration from "@/hooks/useFeedIntegration";
import { cn } from "@/lib/utils";

interface GlobalNotificationsWidgetProps {
  className?: string;
  variant?: "header" | "sidebar" | "popup";
  maxItems?: number;
}

const GlobalNotificationsWidget: React.FC<GlobalNotificationsWidgetProps> = ({
  className,
  variant = "header",
  maxItems = 5,
}) => {
  const {
    notifications,
    unreadCount,
    recentActivities,
    markAsRead,
    markAllAsRead,
    navigateToNotification,
    navigateToEntity,
    getActivityFeed,
  } = useFeedIntegration();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "mention":
        return <AtSign className="w-4 h-4 text-blue-600" />;
      case "like":
        return <Heart className="w-4 h-4 text-red-600" />;
      case "comment":
        return <MessageSquare className="w-4 h-4 text-green-600" />;
      case "task_assigned":
        return <Target className="w-4 h-4 text-orange-600" />;
      case "deadline":
        return <Clock className="w-4 h-4 text-red-600" />;
      case "client_update":
        return <Users className="w-4 h-4 text-blue-600" />;
      case "process_update":
        return <Scale className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "client":
        return <Users className="w-4 h-4 text-blue-600" />;
      case "process":
        return <Scale className="w-4 h-4 text-purple-600" />;
      case "task":
        return <Target className="w-4 h-4 text-green-600" />;
      case "meeting":
        return <Calendar className="w-4 h-4 text-orange-600" />;
      case "contract":
        return <FileText className="w-4 h-4 text-indigo-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    navigateToNotification(notification);
    setIsOpen(false);
  };

  const handleActivityClick = (activity: any) => {
    navigateToEntity(activity);
    setIsOpen(false);
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notif.isRead;
    return notif.type === activeTab;
  });

  const activityFeed = getActivityFeed();

  // Header variant (bell icon with dropdown)
  if (variant === "header") {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn("relative p-2", className)}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-96 p-0">
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-gray-200 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Notificações</CardTitle>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      Marcar todas como lidas
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-3 bg-gray-50 border-b">
                  <TabsTrigger value="all" className="text-xs">
                    Todas
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="text-xs">
                    Não lidas ({unreadCount})
                  </TabsTrigger>
                  <TabsTrigger value="mention" className="text-xs">
                    Menções
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                  <div className="max-h-96 overflow-y-auto">
                    {activityFeed.slice(0, maxItems).map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors",
                          item.type === "notification" &&
                            !item.isRead &&
                            "bg-blue-50",
                        )}
                        onClick={() => {
                          if (item.type === "notification") {
                            handleNotificationClick(item.data);
                          } else {
                            handleActivityClick(item.data);
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {item.type === "notification"
                              ? getNotificationIcon(item.data.type)
                              : getActivityIcon(item.data.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {item.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {item.timestamp}
                            </p>
                          </div>
                          {item.type === "notification" && !item.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="unread" className="mt-0">
                  <div className="max-h-96 overflow-y-auto">
                    {filteredNotifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                        <p className="text-sm text-gray-600">
                          Todas as notificações foram lidas!
                        </p>
                      </div>
                    ) : (
                      filteredNotifications.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {notification.description}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {notification.timestamp}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="mention" className="mt-0">
                  <div className="max-h-96 overflow-y-auto">
                    {notifications
                      .filter((n) => n.type === "mention")
                      .map((notification, index) => (
                        <div
                          key={notification.id}
                          className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-3">
                            <AtSign className="w-4 h-4 text-blue-600 mt-1" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {notification.description}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {notification.timestamp}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* View All Link */}
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to full notifications page
                  }}
                >
                  Ver todas as notificações
                </Button>
              </div>
            </CardContent>
          </Card>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Sidebar variant (simplified list)
  if (variant === "sidebar") {
    return (
      <Card className={cn("border-gray-200", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>Atividades Recentes</span>
            <Badge variant="outline" className="text-xs">
              {unreadCount}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {activityFeed.slice(0, maxItems).map((item) => (
              <div
                key={item.id}
                className="p-3 hover:bg-gray-50 cursor-pointer text-sm"
                onClick={() => {
                  if (item.type === "notification") {
                    handleNotificationClick(item.data);
                  } else {
                    handleActivityClick(item.data);
                  }
                }}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-0.5">
                    {item.type === "notification"
                      ? getNotificationIcon(item.data.type)
                      : getActivityIcon(item.data.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {item.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Popup variant (full widget)
  return (
    <Card className={cn("max-w-md", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Centro de Notificações</span>
          <Badge>{unreadCount}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="unread">Não lidas</TabsTrigger>
            <TabsTrigger value="activities">Atividades</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3 mt-4">
            {activityFeed.slice(0, maxItems).map((item) => (
              <div
                key={item.id}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  if (item.type === "notification") {
                    handleNotificationClick(item.data);
                  } else {
                    handleActivityClick(item.data);
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  {item.type === "notification"
                    ? getNotificationIcon(item.data.type)
                    : getActivityIcon(item.data.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {item.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {item.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GlobalNotificationsWidget;
