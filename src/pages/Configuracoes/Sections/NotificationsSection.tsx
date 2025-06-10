/**
 * 📢 NOTIFICATIONS SECTION - USER SETTINGS
 *
 * Seção de notificações com:
 * - Canais preferenciais (email, sistema, push)
 * - Tipos de eventos personalizáveis
 * - Frequência configurável
 * - Sons e lembretes
 * - Integração com browser
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Mail,
  Smartphone,
  Volume2,
  VolumeX,
  Clock,
  Calendar,
  FileText,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Settings,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface NotificationsSectionProps {
  onUnsavedChanges: (hasChanges: boolean) => void;
  userRole: string;
}

interface NotificationChannel {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
  description: string;
}

interface NotificationEvent {
  id: string;
  name: string;
  description: string;
  category: string;
  channels: {
    email: boolean;
    system: boolean;
    push: boolean;
  };
  frequency: "immediate" | "daily" | "weekly" | "disabled";
  sound: boolean;
  priority: "low" | "medium" | "high";
}

const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  onUnsavedChanges,
  userRole,
}) => {
  const [browserPermission, setBrowserPermission] =
    useState<NotificationPermission>("default");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState([75]);
  const [quietHours, setQuietHours] = useState({
    enabled: true,
    start: "22:00",
    end: "08:00",
  });

  // Check browser notification permission
  useEffect(() => {
    setBrowserPermission(Notification.permission);
  }, []);

  const requestBrowserPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setBrowserPermission(permission);
    }
  };

  // Notification channels configuration
  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: "email",
      name: "Email",
      icon: <Mail className="w-4 h-4" />,
      enabled: true,
      description: "Receber notificações por email",
    },
    {
      id: "system",
      name: "Sistema",
      icon: <Bell className="w-4 h-4" />,
      enabled: true,
      description: "Notificações dentro do sistema",
    },
    {
      id: "push",
      name: "Push",
      icon: <Smartphone className="w-4 h-4" />,
      enabled: browserPermission === "granted",
      description: "Notificações do navegador",
    },
  ]);

  // Notification events configuration
  const [events, setEvents] = useState<NotificationEvent[]>([
    {
      id: "task-assigned",
      name: "Tarefa Atribuída",
      description: "Quando uma tarefa é atribuída a você",
      category: "Tarefas",
      channels: { email: true, system: true, push: true },
      frequency: "immediate",
      sound: true,
      priority: "high",
    },
    {
      id: "task-due",
      name: "Prazo de Tarefa",
      description: "Quando uma tarefa está próxima do vencimento",
      category: "Tarefas",
      channels: { email: true, system: true, push: true },
      frequency: "immediate",
      sound: true,
      priority: "high",
    },
    {
      id: "appointment-reminder",
      name: "Lembrete de Compromisso",
      description: "Lembrete de compromissos agendados",
      category: "Agenda",
      channels: { email: false, system: true, push: true },
      frequency: "immediate",
      sound: true,
      priority: "medium",
    },
    {
      id: "process-update",
      name: "Atualização de Processo",
      description: "Quando há mudanças em processos que você acompanha",
      category: "Processos",
      channels: { email: true, system: true, push: false },
      frequency: "daily",
      sound: false,
      priority: "medium",
    },
    {
      id: "client-message",
      name: "Mensagem de Cliente",
      description: "Nova mensagem de cliente no sistema",
      category: "CRM",
      channels: { email: true, system: true, push: true },
      frequency: "immediate",
      sound: true,
      priority: "high",
    },
    {
      id: "document-shared",
      name: "Documento Compartilhado",
      description: "Quando um documento é compartilhado com você",
      category: "Documentos",
      channels: { email: false, system: true, push: false },
      frequency: "immediate",
      sound: false,
      priority: "low",
    },
    {
      id: "payment-received",
      name: "Pagamento Recebido",
      description: "Confirmação de pagamento de cliente",
      category: "Financeiro",
      channels: { email: true, system: true, push: false },
      frequency: "immediate",
      sound: false,
      priority: "medium",
    },
    {
      id: "contract-expiry",
      name: "Vencimento de Contrato",
      description: "Quando um contrato está próximo do vencimento",
      category: "Contratos",
      channels: { email: true, system: true, push: true },
      frequency: "immediate",
      sound: true,
      priority: "high",
    },
  ]);

  const toggleChannel = (channelId: string) => {
    setChannels((prev) =>
      prev.map((channel) =>
        channel.id === channelId
          ? { ...channel, enabled: !channel.enabled }
          : channel,
      ),
    );
    onUnsavedChanges(true);
  };

  const updateEventChannel = (
    eventId: string,
    channel: keyof NotificationEvent["channels"],
  ) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              channels: {
                ...event.channels,
                [channel]: !event.channels[channel],
              },
            }
          : event,
      ),
    );
    onUnsavedChanges(true);
  };

  const updateEventFrequency = (
    eventId: string,
    frequency: NotificationEvent["frequency"],
  ) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, frequency } : event,
      ),
    );
    onUnsavedChanges(true);
  };

  const toggleEventSound = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, sound: !event.sound } : event,
      ),
    );
    onUnsavedChanges(true);
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels = {
      immediate: "Imediato",
      daily: "Resumo Diário",
      weekly: "Resumo Semanal",
      disabled: "Desabilitado",
    };
    return labels[frequency as keyof typeof labels] || frequency;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      Tarefas: <CheckCircle className="w-4 h-4" />,
      Agenda: <Calendar className="w-4 h-4" />,
      Processos: <FileText className="w-4 h-4" />,
      CRM: <Users className="w-4 h-4" />,
      Documentos: <FileText className="w-4 h-4" />,
      Financeiro: <DollarSign className="w-4 h-4" />,
      Contratos: <FileText className="w-4 h-4" />,
    };
    return (
      icons[category as keyof typeof icons] || <Bell className="w-4 h-4" />
    );
  };

  // Group events by category
  const eventsByCategory = events.reduce(
    (acc, event) => {
      if (!acc[event.category]) {
        acc[event.category] = [];
      }
      acc[event.category].push(event);
      return acc;
    },
    {} as Record<string, NotificationEvent[]>,
  );

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Canais de Notificação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {channels.map((channel) => (
            <div
              key={channel.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">{channel.icon}</div>
                <div>
                  <h4 className="font-medium text-gray-900">{channel.name}</h4>
                  <p className="text-sm text-gray-600">{channel.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {channel.id === "push" && browserPermission !== "granted" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={requestBrowserPermission}
                  >
                    Permitir
                  </Button>
                )}
                <Switch
                  checked={channel.enabled}
                  onCheckedChange={() => toggleChannel(channel.id)}
                  disabled={
                    channel.id === "push" && browserPermission !== "granted"
                  }
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sound Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
            Sons e Alertas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Sons de Notificação</Label>
              <p className="text-sm text-gray-600">
                Reproduzir sons para notificações importantes
              </p>
            </div>
            <Switch
              checked={soundEnabled}
              onCheckedChange={(checked) => {
                setSoundEnabled(checked);
                onUnsavedChanges(true);
              }}
            />
          </div>

          {/* Volume Control */}
          {soundEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3"
            >
              <Label>Volume</Label>
              <div className="flex items-center gap-4">
                <VolumeX className="w-4 h-4 text-gray-400" />
                <Slider
                  value={soundVolume}
                  onValueChange={(value) => {
                    setSoundVolume(value);
                    onUnsavedChanges(true);
                  }}
                  max={100}
                  step={1}
                  className="flex-grow"
                />
                <Volume2 className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 w-10 text-right">
                  {soundVolume[0]}%
                </span>
              </div>
              <Button variant="outline" size="sm">
                Testar Som
              </Button>
            </motion.div>
          )}

          {/* Quiet Hours */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Horário Silencioso</Label>
                <p className="text-sm text-gray-600">
                  Não enviar notificações durante este período
                </p>
              </div>
              <Switch
                checked={quietHours.enabled}
                onCheckedChange={(checked) => {
                  setQuietHours((prev) => ({ ...prev, enabled: checked }));
                  onUnsavedChanges(true);
                }}
              />
            </div>

            {quietHours.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <Label className="text-sm">Início</Label>
                  <Select
                    value={quietHours.start}
                    onValueChange={(value) => {
                      setQuietHours((prev) => ({ ...prev, start: value }));
                      onUnsavedChanges(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, "0");
                        return (
                          <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">Fim</Label>
                  <Select
                    value={quietHours.end}
                    onValueChange={(value) => {
                      setQuietHours((prev) => ({ ...prev, end: value }));
                      onUnsavedChanges(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, "0");
                        return (
                          <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Event Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Tipos de Eventos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(eventsByCategory).map(
              ([category, categoryEvents]) => (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    {getCategoryIcon(category)}
                    <h3 className="font-medium text-gray-900">{category}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {categoryEvents.length}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {categoryEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-4 border border-gray-200 rounded-lg space-y-3"
                      >
                        {/* Event Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-grow">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">
                                {event.name}
                              </h4>
                              <Badge
                                variant="secondary"
                                className={`text-xs ${getPriorityColor(event.priority)}`}
                              >
                                {event.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {event.description}
                            </p>
                          </div>
                        </div>

                        {/* Event Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {/* Channels */}
                          <div>
                            <Label className="text-xs text-gray-600">
                              Canais
                            </Label>
                            <div className="flex gap-2 mt-1">
                              <Button
                                variant={
                                  event.channels.email ? "default" : "outline"
                                }
                                size="sm"
                                className="h-8 px-2"
                                onClick={() =>
                                  updateEventChannel(event.id, "email")
                                }
                              >
                                <Mail className="w-3 h-3" />
                              </Button>
                              <Button
                                variant={
                                  event.channels.system ? "default" : "outline"
                                }
                                size="sm"
                                className="h-8 px-2"
                                onClick={() =>
                                  updateEventChannel(event.id, "system")
                                }
                              >
                                <Bell className="w-3 h-3" />
                              </Button>
                              <Button
                                variant={
                                  event.channels.push ? "default" : "outline"
                                }
                                size="sm"
                                className="h-8 px-2"
                                onClick={() =>
                                  updateEventChannel(event.id, "push")
                                }
                              >
                                <Smartphone className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Frequency */}
                          <div>
                            <Label className="text-xs text-gray-600">
                              Frequência
                            </Label>
                            <Select
                              value={event.frequency}
                              onValueChange={(value) =>
                                updateEventFrequency(
                                  event.id,
                                  value as NotificationEvent["frequency"],
                                )
                              }
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="immediate">
                                  Imediato
                                </SelectItem>
                                <SelectItem value="daily">
                                  Resumo Diário
                                </SelectItem>
                                <SelectItem value="weekly">
                                  Resumo Semanal
                                </SelectItem>
                                <SelectItem value="disabled">
                                  Desabilitado
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Sound */}
                          <div className="flex items-center gap-2">
                            <Label className="text-xs text-gray-600">Som</Label>
                            <Switch
                              checked={event.sound && soundEnabled}
                              onCheckedChange={() => toggleEventSound(event.id)}
                              disabled={!soundEnabled}
                            />
                          </div>

                          {/* Priority Badge */}
                          <div className="flex items-center">
                            <Badge
                              variant="outline"
                              className={`text-xs ${getPriorityColor(event.priority)}`}
                            >
                              Prioridade {event.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsSection;
