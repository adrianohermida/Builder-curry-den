import React from "react";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  Clock,
  MapPin,
  Users,
  FileText,
  Bell,
  Phone,
  Mail,
  ExternalLink,
  Download,
  Edit,
  Trash2,
  Copy,
  Share2,
  CheckCircle,
  AlertTriangle,
  User,
  Building,
  Gavel,
  Video,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, parseISO, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

// Importar tipos da agenda
import type { Appointment } from "@/pages/Agenda";

interface EventoDetalhesProps {
  evento: Appointment;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onShare?: () => void;
  className?: string;
}

export default function EventoDetalhes({
  evento,
  onEdit,
  onDelete,
  onDuplicate,
  onShare,
  className = "",
}: EventoDetalhesProps) {
  // Configurações de tipos
  const typeConfig = {
    audiencia: {
      label: "Audiência",
      icon: CalendarIcon,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    reuniao: {
      label: "Reunião",
      icon: Users,
      color: "bg-green-500",
      textColor: "text-green-600",
      borderColor: "border-green-200",
    },
    video: {
      label: "Videoconferência",
      icon: Video,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      borderColor: "border-purple-200",
    },
    telefone: {
      label: "Ligação",
      icon: Phone,
      color: "bg-orange-500",
      textColor: "text-orange-600",
      borderColor: "border-orange-200",
    },
    prazo: {
      label: "Prazo",
      icon: AlertTriangle,
      color: "bg-red-500",
      textColor: "text-red-600",
      borderColor: "border-red-200",
    },
    outro: {
      label: "Outro",
      icon: Clock,
      color: "bg-gray-500",
      textColor: "text-gray-600",
      borderColor: "border-gray-200",
    },
  };

  const statusConfig = {
    agendado: {
      label: "Agendado",
      color: "bg-blue-100 text-blue-800",
      icon: Clock,
    },
    confirmado: {
      label: "Confirmado",
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
    },
    cancelado: {
      label: "Cancelado",
      color: "bg-red-100 text-red-800",
      icon: AlertTriangle,
    },
    adiado: {
      label: "Adiado",
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
    },
    concluido: {
      label: "Concluído",
      color: "bg-gray-100 text-gray-800",
      icon: CheckCircle,
    },
  };

  const priorityConfig = {
    baixa: {
      label: "Baixa",
      color: "bg-gray-100 text-gray-600",
    },
    media: {
      label: "Média",
      color: "bg-blue-100 text-blue-600",
    },
    alta: {
      label: "Alta",
      color: "bg-orange-100 text-orange-600",
    },
    urgente: {
      label: "Urgente",
      color: "bg-red-100 text-red-600",
    },
  };

  const IconComponent = typeConfig[evento.tipo]?.icon || CalendarIcon;
  const isOverdue =
    isPast(parseISO(evento.dataInicio)) && evento.status !== "concluido";

  const handleCopyLink = () => {
    if (evento.local?.link) {
      navigator.clipboard.writeText(evento.local.link);
      toast.success("Link copiado para a área de transferência!");
    }
  };

  const formatDuration = () => {
    const inicio = parseISO(evento.dataInicio);
    const fim = parseISO(evento.dataFim);
    const diffMs = fim.getTime() - inicio.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h${diffMinutes > 0 ? ` ${diffMinutes}min` : ""}`;
    }
    return `${diffMinutes}min`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className={`${isOverdue ? "border-red-200 bg-red-50" : ""}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-lg ${typeConfig[evento.tipo]?.color}`}
              >
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{evento.titulo}</h1>
                  {isOverdue && (
                    <Badge variant="destructive" className="text-xs">
                      Em atraso
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={statusConfig[evento.status]?.color}>
                    {statusConfig[evento.status]?.label}
                  </Badge>
                  <Badge className={priorityConfig[evento.prioridade]?.color}>
                    Prioridade {priorityConfig[evento.prioridade]?.label}
                  </Badge>
                  <Badge variant="outline">
                    {typeConfig[evento.tipo]?.label}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-2">
              {onEdit && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={onEdit}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Editar</TooltipContent>
                </Tooltip>
              )}
              {onDuplicate && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={onDuplicate}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Duplicar</TooltipContent>
                </Tooltip>
              )}
              {onShare && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={onShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Compartilhar</TooltipContent>
                </Tooltip>
              )}
              {onDelete && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={onDelete}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Excluir</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </CardHeader>

        {evento.descricao && (
          <CardContent className="pt-0">
            <p className="text-muted-foreground">{evento.descricao}</p>
          </CardContent>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações de Data e Hora */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Data e Hora
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">
                  {format(
                    parseISO(evento.dataInicio),
                    "EEEE, dd 'de' MMMM 'de' yyyy",
                    {
                      locale: ptBR,
                    },
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {evento.diaInteiro ? (
                    "Dia inteiro"
                  ) : (
                    <>
                      {format(parseISO(evento.dataInicio), "HH:mm")} -{" "}
                      {format(parseISO(evento.dataFim), "HH:mm")}
                      <span className="ml-2">({formatDuration()})</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {evento.recorrencia && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Recorrência</div>
                  <div className="text-sm text-muted-foreground">
                    {evento.recorrencia.tipo} (intervalo:{" "}
                    {evento.recorrencia.intervalo})
                    {evento.recorrencia.dataFim && (
                      <>
                        {" "}
                        até{" "}
                        {format(
                          parseISO(evento.recorrencia.dataFim),
                          "dd/MM/yyyy",
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Local */}
        {evento.local && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Local
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-medium flex items-center gap-2">
                  {evento.local.nome}
                  <Badge variant="outline" className="text-xs">
                    {evento.local.tipo}
                  </Badge>
                </div>
                {evento.local.endereco && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {evento.local.endereco}
                  </div>
                )}
                {evento.local.sala && (
                  <div className="text-sm text-muted-foreground">
                    {evento.local.sala}
                  </div>
                )}
              </div>

              {evento.local.link && (
                <div className="space-y-2">
                  <Separator />
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-1"
                    >
                      <a
                        href={evento.local.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Acessar Reunião
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyLink}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Informações de Processo e Cliente */}
      {(evento.processo || evento.cliente) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5" />
              Processo e Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {evento.cliente && (
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Cliente</div>
                    <div className="text-sm text-muted-foreground">
                      {evento.cliente.nome}
                    </div>
                  </div>
                </div>
              )}

              {evento.processo && (
                <div className="flex items-start gap-3">
                  <Gavel className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Processo</div>
                    <div className="text-sm font-mono">
                      {evento.processo.numero}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {evento.processo.nome}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {evento.responsavel && (
              <div className="flex items-center gap-3 pt-2 border-t">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Responsável</div>
                  <div className="text-sm text-muted-foreground">
                    {evento.responsavel.nome}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Participantes */}
      {evento.participantes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Participantes ({evento.participantes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-60">
              <div className="space-y-3">
                {evento.participantes.map((participante) => (
                  <motion.div
                    key={participante.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {participante.nome.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{participante.nome}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {participante.tipo.replace("_", " ")}
                        </div>
                        {participante.email && (
                          <div className="text-xs text-muted-foreground">
                            {participante.email}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {participante.email && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`mailto:${participante.email}`}>
                            <Mail className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {participante.telefone && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`tel:${participante.telefone}`}>
                            <Phone className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Badge
                        variant={
                          participante.confirmado ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {participante.confirmado ? "Confirmado" : "Pendente"}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Lembretes */}
      {evento.lembretes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Lembretes ({evento.lembretes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {evento.lembretes.map((lembrete, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    lembrete.ativo
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Bell
                      className={`h-4 w-4 ${lembrete.ativo ? "text-green-600" : "text-gray-400"}`}
                    />
                    <div>
                      <div className="text-sm font-medium capitalize">
                        {lembrete.tipo}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {lembrete.antecedencia} minutos antes
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={lembrete.ativo ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {lembrete.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Anexos */}
      {evento.anexos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Anexos ({evento.anexos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {evento.anexos.map((anexo) => (
                <div
                  key={anexo.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{anexo.nome}</div>
                      <div className="text-xs text-muted-foreground">
                        {anexo.tipo}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={anexo.url} download>
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Observações */}
      {evento.observacoes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Observações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {evento.observacoes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Metadados */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Criado em:</span>{" "}
              {format(parseISO(evento.criado), "dd/MM/yyyy HH:mm", {
                locale: ptBR,
              })}
            </div>
            <div>
              <span className="font-medium">Última atualização:</span>{" "}
              {format(parseISO(evento.atualizado), "dd/MM/yyyy HH:mm", {
                locale: ptBR,
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
