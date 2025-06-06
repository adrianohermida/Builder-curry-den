import { useState, useEffect } from "react";
import {
  Bell,
  X,
  Scale,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "process" | "publication" | "deadline" | "system";
  priority: "low" | "medium" | "high" | "critical";
  timestamp: Date;
  isRead: boolean;
  clientName?: string;
  processNumber?: string;
  actionUrl?: string;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  // Mock notifications - in real app, this would come from API/WebSocket
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "Novo Andamento Processual",
        message: "Juntada de petição no processo 1234567-89.2024.8.26.0001",
        type: "process",
        priority: "high",
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        isRead: false,
        clientName: "João Silva",
        processNumber: "1234567-89.2024.8.26.0001",
      },
      {
        id: "2",
        title: "Nova Publicação Detectada",
        message: "Intimação para manifestação em 15 dias",
        type: "publication",
        priority: "critical",
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        isRead: false,
        clientName: "Maria Santos",
      },
      {
        id: "3",
        title: "Prazo Próximo do Vencimento",
        message: "Recurso deve ser interposto até 23/12/2024",
        type: "deadline",
        priority: "critical",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        isRead: false,
        clientName: "Carlos Oliveira",
        processNumber: "7777777-77.2024.8.26.0004",
      },
      {
        id: "4",
        title: "Sistema Atualizado",
        message: "Nova versão do Lawdesk CRM disponível",
        type: "system",
        priority: "low",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: true,
      },
    ];

    setNotifications(mockNotifications);

    // Simulate real-time notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.9) {
        // 10% chance every 30 seconds
        const newNotification: Notification = {
          id: `${Date.now()}`,
          title: "Nova Atualização",
          message: "Novo andamento detectado automaticamente",
          type: "process",
          priority: "medium",
          timestamp: new Date(),
          isRead: false,
          clientName: "Cliente Exemplo",
        };

        setNotifications((prev) => [newNotification, ...prev]);

        // Show toast notification
        toast.info("Nova atualização processual detectada");
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true })),
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId),
    );
  };

  const getNotificationIcon = (
    type: Notification["type"],
    priority: Notification["priority"],
  ) => {
    const iconClass =
      priority === "critical"
        ? "text-red-500"
        : priority === "high"
          ? "text-orange-500"
          : priority === "medium"
            ? "text-blue-500"
            : "text-gray-500";

    switch (type) {
      case "process":
        return <Scale className={`h-4 w-4 ${iconClass}`} />;
      case "publication":
        return <FileText className={`h-4 w-4 ${iconClass}`} />;
      case "deadline":
        return <AlertTriangle className={`h-4 w-4 ${iconClass}`} />;
      case "system":
        return <Bell className={`h-4 w-4 ${iconClass}`} />;
      default:
        return <Bell className={`h-4 w-4 ${iconClass}`} />;
    }
  };

  const getPriorityBadge = (priority: Notification["priority"]) => {
    switch (priority) {
      case "critical":
        return (
          <Badge variant="destructive" className="text-xs">
            Crítico
          </Badge>
        );
      case "high":
        return <Badge className="bg-orange-600 text-xs">Alto</Badge>;
      case "medium":
        return (
          <Badge variant="default" className="text-xs">
            Médio
          </Badge>
        );
      case "low":
        return (
          <Badge variant="secondary" className="text-xs">
            Baixo
          </Badge>
        );
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}min atrás`;
    return "Agora";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-[rgb(var(--theme-primary))]">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notificações</h3>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <CheckCircle className="h-4 w-4 mr-1" />
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma notificação</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-accent/50 transition-colors ${
                    !notification.isRead ? "bg-blue-50 dark:bg-blue-950/20" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getNotificationIcon(
                        notification.type,
                        notification.priority,
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-sm">
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 rounded-full bg-[rgb(var(--theme-primary))]" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNotification(notification.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getPriorityBadge(notification.priority)}
                          {notification.clientName && (
                            <span className="text-xs text-muted-foreground">
                              {notification.clientName}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(notification.timestamp)}
                          </span>
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {notification.processNumber && (
                        <div className="text-xs text-muted-foreground font-mono">
                          {notification.processNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-4 border-t">
            <Button variant="outline" className="w-full" size="sm">
              Ver Todas as Notificações
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
