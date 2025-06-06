import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Video,
  Phone,
  Filter,
  Grid3X3,
  List,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Calendar() {
  const [view, setView] = useState("month");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const appointments = [
    {
      id: 1,
      title: "Audiência de Conciliação",
      client: "João Silva",
      process: "1234567-89.2024.8.26.0001",
      date: "2024-12-20",
      time: "14:30",
      duration: "1h",
      type: "audiencia",
      location: "Fórum Central - Sala 5",
      lawyer: "Dr. Pedro Costa",
      status: "confirmado",
    },
    {
      id: 2,
      title: "Reunião com Cliente",
      client: "Maria Santos",
      process: "",
      date: "2024-12-20",
      time: "10:00",
      duration: "1h 30min",
      type: "reuniao",
      location: "Escritório - Sala de Reuniões",
      lawyer: "Dra. Ana Lima",
      status: "confirmado",
    },
    {
      id: 3,
      title: "Audiência de Instrução",
      client: "Carlos Oliveira",
      process: "9876543-21.2024.8.26.0001",
      date: "2024-12-22",
      time: "09:00",
      duration: "2h",
      type: "audiencia",
      location: "Tribunal de Justiça - Sala 12",
      lawyer: "Dr. Pedro Costa",
      status: "pendente",
    },
    {
      id: 4,
      title: "Videoconferência - Consulta",
      client: "Empresa XYZ",
      process: "",
      date: "2024-12-21",
      time: "16:00",
      duration: "45min",
      type: "video",
      location: "Online - Google Meet",
      lawyer: "Dra. Ana Lima",
      status: "confirmado",
    },
  ];

  const getAppointmentIcon = (type: string) => {
    switch (type) {
      case "audiencia":
        return <CalendarIcon className="h-4 w-4 text-blue-600" />;
      case "reuniao":
        return <Users className="h-4 w-4 text-green-600" />;
      case "video":
        return <Video className="h-4 w-4 text-purple-600" />;
      case "telefone":
        return <Phone className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getAppointmentType = (type: string) => {
    switch (type) {
      case "audiencia":
        return "Audiência";
      case "reuniao":
        return "Reunião";
      case "video":
        return "Videoconferência";
      case "telefone":
        return "Ligação";
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmado":
        return <Badge variant="default">Confirmado</Badge>;
      case "pendente":
        return <Badge variant="outline">Pendente</Badge>;
      case "cancelado":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  };

  const todayAppointments = appointments.filter(
    (apt) => apt.date === new Date().toISOString().split("T")[0],
  );

  const upcomingAppointments = appointments
    .filter((apt) => new Date(apt.date) >= new Date())
    .sort(
      (a, b) =>
        new Date(a.date + "T" + a.time).getTime() -
        new Date(b.date + "T" + b.time).getTime(),
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agenda Jurídica</h1>
          <p className="text-muted-foreground">
            Gestão de audiências, reuniões e compromissos
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button className="bg-[rgb(var(--theme-primary))] hover:bg-[rgb(var(--theme-primary))]/90">
            <Plus className="h-4 w-4 mr-2" />
            Novo Compromisso
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Hoje
                </p>
                <p className="text-2xl font-bold">{todayAppointments.length}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-[rgb(var(--theme-primary))]" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Esta Semana
                </p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Este Mês
                </p>
                <p className="text-2xl font-bold">48</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pendentes
                </p>
                <p className="text-2xl font-bold text-yellow-600">5</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl capitalize">
                  {formatMonth(selectedDate)}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center ml-4">
                    <Button
                      variant={view === "month" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setView("month")}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={view === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setView("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {view === "month" ? (
                <div className="grid grid-cols-7 gap-1">
                  {/* Calendar header */}
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                    (day) => (
                      <div
                        key={day}
                        className="p-2 text-center text-sm font-medium text-muted-foreground"
                      >
                        {day}
                      </div>
                    ),
                  )}

                  {/* Calendar days - simplified view */}
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 6; // Adjust for month start
                    const isToday = day === new Date().getDate();
                    const hasAppointments =
                      day > 0 && day <= 31 && Math.random() > 0.7; // Simplified logic

                    return (
                      <div
                        key={i}
                        className={`
                          p-2 h-20 border border-border/50 relative cursor-pointer hover:bg-accent/50 transition-colors
                          ${isToday ? "bg-[rgb(var(--theme-primary))]/10 border-[rgb(var(--theme-primary))]" : ""}
                          ${day <= 0 || day > 31 ? "text-muted-foreground" : ""}
                        `}
                      >
                        {day > 0 && day <= 31 && (
                          <>
                            <span className="text-sm">{day}</span>
                            {hasAppointments && (
                              <div className="absolute bottom-1 left-1 w-2 h-2 bg-[rgb(var(--theme-primary))] rounded-full" />
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingAppointments.slice(0, 10).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        {getAppointmentIcon(appointment.type)}
                        <div>
                          <p className="font-medium">{appointment.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.client}
                          </p>
                        </div>
                      </div>
                      <div className="flex-1" />
                      <div className="text-right">
                        <p className="text-sm">
                          {new Date(appointment.date).toLocaleDateString(
                            "pt-BR",
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <div className="space-y-6">
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle>Próximos Compromissos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.slice(0, 5).map((appointment) => (
                <div
                  key={appointment.id}
                  className="space-y-3 p-4 border rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        {getAppointmentIcon(appointment.type)}
                        <h4 className="font-medium text-sm">
                          {appointment.title}
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {appointment.client}
                      </p>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>

                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(appointment.date).toLocaleDateString("pt-BR")}{" "}
                        às {appointment.time}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{appointment.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Avatar className="h-3 w-3">
                        <AvatarFallback className="text-xs">
                          {appointment.lawyer
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{appointment.lawyer}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Agendar Audiência
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Marcar Reunião
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Video className="h-4 w-4 mr-2" />
                Videoconferência
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Ligação Telefônica
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
