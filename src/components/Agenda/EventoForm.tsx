import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  Clock,
  MapPin,
  Users,
  FileText,
  Bell,
  Plus,
  X,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// Importar tipos da agenda
import type { Appointment } from "@/pages/Agenda";

interface EventoFormProps {
  evento?: Partial<Appointment>;
  onSave: (evento: Partial<Appointment>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function EventoForm({
  evento = {},
  onSave,
  onCancel,
  isEditing = false,
}: EventoFormProps) {
  const [formData, setFormData] = useState<Partial<Appointment>>({
    tipo: "reuniao",
    status: "agendado",
    prioridade: "media",
    diaInteiro: false,
    participantes: [],
    lembretes: [
      { tipo: "email", antecedencia: 30, ativo: true },
      { tipo: "push", antecedencia: 15, ativo: true },
    ],
    anexos: [],
    ...evento,
  });

  const [novoParticipante, setNovoParticipante] = useState({
    nome: "",
    email: "",
    telefone: "",
    tipo: "cliente" as const,
  });

  const [novoLembrete, setNovoLembrete] = useState({
    tipo: "email" as const,
    antecedencia: 30,
    ativo: true,
  });

  // Configurações de tipos
  const tiposEvento = {
    audiencia: { label: "Audiência", icon: CalendarIcon, color: "blue" },
    reuniao: { label: "Reunião", icon: Users, color: "green" },
    video: { label: "Videoconferência", icon: CalendarIcon, color: "purple" },
    telefone: { label: "Ligação", icon: CalendarIcon, color: "orange" },
    prazo: { label: "Prazo", icon: AlertTriangle, color: "red" },
    outro: { label: "Outro", icon: Clock, color: "gray" },
  };

  const statusOptions = {
    agendado: { label: "Agendado", color: "blue" },
    confirmado: { label: "Confirmado", color: "green" },
    cancelado: { label: "Cancelado", color: "red" },
    adiado: { label: "Adiado", color: "yellow" },
    concluido: { label: "Concluído", color: "gray" },
  };

  const prioridadeOptions = {
    baixa: { label: "Baixa", color: "gray" },
    media: { label: "Média", color: "blue" },
    alta: { label: "Alta", color: "orange" },
    urgente: { label: "Urgente", color: "red" },
  };

  const tiposParticipante = {
    cliente: "Cliente",
    advogado: "Advogado",
    juiz: "Juiz",
    parte_contraria: "Parte Contrária",
    testemunha: "Testemunha",
    outro: "Outro",
  };

  const tiposLembrete = {
    email: "E-mail",
    sms: "SMS",
    push: "Notificação",
    whatsapp: "WhatsApp",
  };

  // Funções para manipular formulário
  const handleInputChange = (field: keyof Appointment, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocalChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      local: {
        ...prev.local,
        [field]: value,
      },
    }));
  };

  const adicionarParticipante = () => {
    if (!novoParticipante.nome.trim()) {
      toast.error("Nome do participante é obrigatório");
      return;
    }

    const participante = {
      id: `part-${Date.now()}`,
      nome: novoParticipante.nome,
      email: novoParticipante.email,
      telefone: novoParticipante.telefone,
      tipo: novoParticipante.tipo,
      confirmado: false,
    };

    setFormData((prev) => ({
      ...prev,
      participantes: [...(prev.participantes || []), participante],
    }));

    setNovoParticipante({
      nome: "",
      email: "",
      telefone: "",
      tipo: "cliente",
    });

    toast.success("Participante adicionado com sucesso!");
  };

  const removerParticipante = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      participantes: prev.participantes?.filter((p) => p.id !== id) || [],
    }));
  };

  const adicionarLembrete = () => {
    const lembrete = {
      tipo: novoLembrete.tipo,
      antecedencia: novoLembrete.antecedencia,
      ativo: novoLembrete.ativo,
    };

    setFormData((prev) => ({
      ...prev,
      lembretes: [...(prev.lembretes || []), lembrete],
    }));

    setNovoLembrete({
      tipo: "email",
      antecedencia: 30,
      ativo: true,
    });

    toast.success("Lembrete adicionado com sucesso!");
  };

  const removerLembrete = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      lembretes: prev.lembretes?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas
    if (!formData.titulo?.trim()) {
      toast.error("Título é obrigatório");
      return;
    }

    if (!formData.dataInicio) {
      toast.error("Data de início é obrigatória");
      return;
    }

    // Se não houver data fim, usar a data de início
    const eventoFinal = {
      ...formData,
      dataFim: formData.dataFim || formData.dataInicio,
    };

    onSave(eventoFinal);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={formData.titulo || ""}
                onChange={(e) => handleInputChange("titulo", e.target.value)}
                placeholder="Ex: Audiência de Conciliação"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => handleInputChange("tipo", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(tiposEvento).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusOptions).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="prioridade">Prioridade</Label>
              <Select
                value={formData.prioridade}
                onValueChange={(value) =>
                  handleInputChange("prioridade", value)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(prioridadeOptions).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="diaInteiro"
                checked={formData.diaInteiro}
                onCheckedChange={(checked) =>
                  handleInputChange("diaInteiro", checked)
                }
              />
              <Label htmlFor="diaInteiro">Dia inteiro</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao || ""}
              onChange={(e) => handleInputChange("descricao", e.target.value)}
              placeholder="Detalhes sobre o compromisso..."
              rows={3}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Data e Hora */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Data e Hora
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dataInicio">Data de Início *</Label>
              <Input
                id="dataInicio"
                type={formData.diaInteiro ? "date" : "datetime-local"}
                value={formData.dataInicio || ""}
                onChange={(e) =>
                  handleInputChange("dataInicio", e.target.value)
                }
                className="mt-1"
              />
            </div>
            {!formData.diaInteiro && (
              <div>
                <Label htmlFor="dataFim">Data de Fim</Label>
                <Input
                  id="dataFim"
                  type="datetime-local"
                  value={formData.dataFim || ""}
                  onChange={(e) => handleInputChange("dataFim", e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Local */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Local
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="localNome">Nome do Local</Label>
              <Input
                id="localNome"
                value={formData.local?.nome || ""}
                onChange={(e) => handleLocalChange("nome", e.target.value)}
                placeholder="Ex: Fórum Central"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="localTipo">Tipo</Label>
              <Select
                value={formData.local?.tipo || "presencial"}
                onValueChange={(value) => handleLocalChange("tipo", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="hibrido">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="localEndereco">Endereço</Label>
            <Input
              id="localEndereco"
              value={formData.local?.endereco || ""}
              onChange={(e) => handleLocalChange("endereco", e.target.value)}
              placeholder="Endereço completo"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="localSala">Sala/Auditório</Label>
              <Input
                id="localSala"
                value={formData.local?.sala || ""}
                onChange={(e) => handleLocalChange("sala", e.target.value)}
                placeholder="Ex: Sala 5"
                className="mt-1"
              />
            </div>
            {(formData.local?.tipo === "online" ||
              formData.local?.tipo === "hibrido") && (
              <div>
                <Label htmlFor="localLink">Link da Reunião</Label>
                <Input
                  id="localLink"
                  value={formData.local?.link || ""}
                  onChange={(e) => handleLocalChange("link", e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="mt-1"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Participantes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Participantes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Lista de Participantes */}
          {formData.participantes && formData.participantes.length > 0 && (
            <div className="space-y-2">
              <ScrollArea className="max-h-40">
                {formData.participantes.map((participante) => (
                  <motion.div
                    key={participante.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{participante.nome}</div>
                      <div className="text-sm text-muted-foreground">
                        {tiposParticipante[participante.tipo]}
                        {participante.email && ` • ${participante.email}`}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removerParticipante(participante.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </ScrollArea>
            </div>
          )}

          {/* Adicionar Participante */}
          <Separator />
          <div className="space-y-3">
            <h5 className="font-medium">Adicionar Participante</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Nome *"
                value={novoParticipante.nome}
                onChange={(e) =>
                  setNovoParticipante((prev) => ({
                    ...prev,
                    nome: e.target.value,
                  }))
                }
              />
              <Select
                value={novoParticipante.tipo}
                onValueChange={(value: any) =>
                  setNovoParticipante((prev) => ({ ...prev, tipo: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(tiposParticipante).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="E-mail"
                type="email"
                value={novoParticipante.email}
                onChange={(e) =>
                  setNovoParticipante((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
              <Input
                placeholder="Telefone"
                value={novoParticipante.telefone}
                onChange={(e) =>
                  setNovoParticipante((prev) => ({
                    ...prev,
                    telefone: e.target.value,
                  }))
                }
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={adicionarParticipante}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Participante
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lembretes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Lembretes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Lista de Lembretes */}
          {formData.lembretes && formData.lembretes.length > 0 && (
            <div className="space-y-2">
              {formData.lembretes.map((lembrete, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {tiposLembrete[lembrete.tipo]}
                    </Badge>
                    <span className="text-sm">
                      {lembrete.antecedencia} min antes
                    </span>
                    {lembrete.ativo && (
                      <Badge variant="default" className="text-xs">
                        Ativo
                      </Badge>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removerLembrete(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Adicionar Lembrete */}
          <Separator />
          <div className="space-y-3">
            <h5 className="font-medium">Adicionar Lembrete</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select
                value={novoLembrete.tipo}
                onValueChange={(value: any) =>
                  setNovoLembrete((prev) => ({ ...prev, tipo: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(tiposLembrete).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Minutos antes"
                value={novoLembrete.antecedencia}
                onChange={(e) =>
                  setNovoLembrete((prev) => ({
                    ...prev,
                    antecedencia: parseInt(e.target.value) || 0,
                  }))
                }
              />
              <div className="flex items-center space-x-2">
                <Switch
                  checked={novoLembrete.ativo}
                  onCheckedChange={(checked) =>
                    setNovoLembrete((prev) => ({ ...prev, ativo: checked }))
                  }
                />
                <Label>Ativo</Label>
              </div>
            </div>
            <Button type="button" variant="outline" onClick={adicionarLembrete}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Lembrete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Observações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Observações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.observacoes || ""}
            onChange={(e) => handleInputChange("observacoes", e.target.value)}
            placeholder="Observações adicionais sobre o compromisso..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {isEditing ? "Atualizar" : "Criar"} Compromisso
        </Button>
      </div>
    </form>
  );
}
