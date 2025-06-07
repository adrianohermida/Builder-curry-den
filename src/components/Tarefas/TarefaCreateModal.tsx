import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Calendar,
  Clock,
  Users,
  FileText,
  Brain,
  Tag,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { CreateTarefaParams } from "@/hooks/useTarefaIntegration";

interface TarefaCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialParams?: Partial<CreateTarefaParams>;
  onSuccess?: (tarefa: any) => void;
}

export function TarefaCreateModal({
  open,
  onOpenChange,
  initialParams,
  onSuccess,
}: TarefaCreateModalProps) {
  const [formData, setFormData] = useState<Partial<CreateTarefaParams>>({
    titulo: "",
    descricao: "",
    prioridade: "media",
    origem: "manual",
    tags: [],
    integracaoAgenda: false,
    integracaoIA: {
      sugestoesPeticao: false,
      elaboracaoRascunho: false,
      resumoAutomatico: false,
    },
  });

  const [customTags, setCustomTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for selects
  const mockClientes = [
    { id: "cli-001", nome: "João Silva", tipo: "fisica" as const },
    { id: "cli-002", nome: "XYZ Tecnologia Ltda", tipo: "juridica" as const },
    { id: "cli-003", nome: "Maria Oliveira", tipo: "fisica" as const },
    { id: "cli-004", nome: "ABC Consultoria", tipo: "juridica" as const },
  ];

  const mockProcessos = [
    {
      id: "proc-001",
      numero: "1001234-12.2024.5.02.0001",
      assunto: "Ação Trabalhista - Horas Extras",
    },
    {
      id: "proc-002",
      numero: "5001234-12.2023.5.02.0001",
      assunto: "Ação de Cobrança",
    },
    {
      id: "proc-003",
      numero: "2001234-12.2024.5.03.0001",
      assunto: "Rescisão Contratual",
    },
  ];

  const mockResponsaveis = [
    { id: "user-001", nome: "Dr. Maria Santos" },
    { id: "user-002", nome: "Dr. Carlos Oliveira" },
    { id: "user-003", nome: "Ana Paula Costa" },
    { id: "user-004", nome: "Dr. Roberto Lima" },
  ];

  const commonTags = [
    "urgente",
    "trabalhista",
    "civil",
    "tributario",
    "penal",
    "contrato",
    "publicacao",
    "prazo",
    "recurso",
    "peticao",
  ];

  // Initialize form with params when modal opens
  useEffect(() => {
    if (open && initialParams) {
      setFormData((prev) => ({
        ...prev,
        ...initialParams,
        integracaoIA: {
          sugestoesPeticao: false,
          elaboracaoRascunho: false,
          resumoAutomatico: false,
          ...initialParams.integracaoIA,
        },
      }));

      if (initialParams.tags) {
        setCustomTags(
          initialParams.tags.filter((tag) => !commonTags.includes(tag)),
        );
      }
    }
  }, [open, initialParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titulo || !formData.responsavel) {
      toast.error("Título e responsável são obrigatórios");
      return;
    }

    if (!formData.dataVencimento) {
      toast.error("Data de vencimento é obrigatória");
      return;
    }

    setIsSubmitting(true);

    try {
      // Combine common tags with custom tags
      const allTags = [...(formData.tags || []), ...customTags].filter(
        (tag, index, arr) => arr.indexOf(tag) === index,
      );

      const novaTarefa = {
        id: `tarefa-${Date.now()}`,
        ...formData,
        tags: allTags,
        status: "pendente",
        dataCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
        historico: [
          {
            data: new Date().toISOString(),
            acao: "Criada",
            usuario: formData.responsavel?.nome || "Sistema",
            detalhes: formData.origemDetalhes
              ? `Criada a partir de: ${formData.origemDetalhes.modulo}`
              : "Criada manualmente",
          },
        ],
      };

      // Save to localStorage (in a real app, this would be an API call)
      const tarefasExistentes = JSON.parse(
        localStorage.getItem("lawdesk_tarefas") || "[]",
      );
      tarefasExistentes.push(novaTarefa);
      localStorage.setItem(
        "lawdesk_tarefas",
        JSON.stringify(tarefasExistentes),
      );

      // If integration with agenda is enabled
      if (formData.integracaoAgenda) {
        const agendaItem = {
          id: `agenda-${Date.now()}`,
          titulo: formData.titulo,
          descricao: formData.descricao,
          data: formData.dataVencimento,
          tipo: "tarefa",
          tarefaId: novaTarefa.id,
          cliente: formData.cliente,
        };

        const agendaExistente = JSON.parse(
          localStorage.getItem("lawdesk_agenda") || "[]",
        );
        agendaExistente.push(agendaItem);
        localStorage.setItem("lawdesk_agenda", JSON.stringify(agendaExistente));
      }

      toast.success("Tarefa criada com sucesso!");

      if (onSuccess) {
        onSuccess(novaTarefa);
      }

      // Reset form
      setFormData({
        titulo: "",
        descricao: "",
        prioridade: "media",
        origem: "manual",
        tags: [],
        integracaoAgenda: false,
        integracaoIA: {
          sugestoesPeticao: false,
          elaboracaoRascunho: false,
          resumoAutomatico: false,
        },
      });
      setCustomTags([]);

      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao criar tarefa");
      console.error("Erro:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCustomTag = () => {
    if (
      newTag.trim() &&
      !customTags.includes(newTag.trim()) &&
      !commonTags.includes(newTag.trim())
    ) {
      setCustomTags((prev) => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeCustomTag = (tag: string) => {
    setCustomTags((prev) => prev.filter((t) => t !== tag));
  };

  const toggleCommonTag = (tag: string) => {
    const currentTags = formData.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];

    setFormData((prev) => ({ ...prev, tags: newTags }));
  };

  const getPrioridadeInfo = (prioridade: string) => {
    switch (prioridade) {
      case "baixa":
        return {
          color: "text-blue-600",
          icon: <CheckCircle className="h-4 w-4" />,
        };
      case "media":
        return {
          color: "text-yellow-600",
          icon: <Clock className="h-4 w-4" />,
        };
      case "alta":
        return {
          color: "text-orange-600",
          icon: <AlertTriangle className="h-4 w-4" />,
        };
      case "urgente":
        return {
          color: "text-red-600",
          icon: <AlertTriangle className="h-4 w-4" />,
        };
      default:
        return { color: "text-gray-600", icon: <Clock className="h-4 w-4" /> };
    }
  };

  const prioridadeInfo = getPrioridadeInfo(formData.prioridade || "media");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Criar Nova Tarefa
            {formData.origemDetalhes && (
              <Badge variant="outline" className="ml-2">
                {formData.origemDetalhes.modulo}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {formData.origemDetalhes
              ? `Criando tarefa a partir de: ${formData.origemDetalhes.itemTitulo}`
              : "Crie uma nova tarefa e conecte-a com outros módulos do sistema."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:col-span-2 space-y-2">
                <Label htmlFor="titulo" className="text-sm font-medium">
                  Título *
                </Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, titulo: e.target.value }))
                  }
                  placeholder="Ex: Elaborar petição inicial para ação trabalhista..."
                  required
                />
              </div>

              <div className="lg:col-span-2 space-y-2">
                <Label htmlFor="descricao" className="text-sm font-medium">
                  Descrição
                </Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      descricao: e.target.value,
                    }))
                  }
                  placeholder="Descreva os detalhes da tarefa..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="prioridade"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  Prioridade *{prioridadeInfo.icon}
                </Label>
                <Select
                  value={formData.prioridade}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      prioridade: value as any,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        Baixa
                      </div>
                    </SelectItem>
                    <SelectItem value="media">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        Média
                      </div>
                    </SelectItem>
                    <SelectItem value="alta">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        Alta
                      </div>
                    </SelectItem>
                    <SelectItem value="urgente">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        Urgente
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataVencimento" className="text-sm font-medium">
                  Data/Hora Vencimento *
                </Label>
                <Input
                  id="dataVencimento"
                  type="datetime-local"
                  value={formData.dataVencimento}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dataVencimento: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Associações */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Associações
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cliente" className="text-sm">
                  Cliente
                </Label>
                <Select
                  value={formData.cliente?.id}
                  onValueChange={(value) => {
                    const cliente = mockClientes.find((c) => c.id === value);
                    setFormData((prev) => ({ ...prev, cliente }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        <div className="flex items-center gap-2">
                          <span>{cliente.nome}</span>
                          <Badge variant="outline" className="text-xs">
                            {cliente.tipo}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="processo" className="text-sm">
                  Processo
                </Label>
                <Select
                  value={formData.processo?.id}
                  onValueChange={(value) => {
                    const processo = mockProcessos.find((p) => p.id === value);
                    setFormData((prev) => ({ ...prev, processo }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProcessos.map((processo) => (
                      <SelectItem key={processo.id} value={processo.id}>
                        <div className="space-y-1">
                          <div className="font-mono text-xs">
                            {processo.numero}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {processo.assunto}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsavel" className="text-sm">
                  Responsável *
                </Label>
                <Select
                  value={formData.responsavel?.id}
                  onValueChange={(value) => {
                    const responsavel = mockResponsaveis.find(
                      (r) => r.id === value,
                    );
                    setFormData((prev) => ({ ...prev, responsavel }));
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockResponsaveis.map((responsavel) => (
                      <SelectItem key={responsavel.id} value={responsavel.id}>
                        {responsavel.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tags */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </h4>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {commonTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={
                      formData.tags?.includes(tag) ? "default" : "outline"
                    }
                    className="cursor-pointer hover:bg-primary/20"
                    onClick={() => toggleCommonTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {customTags.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Tags personalizadas:
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {customTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 w-4 h-4"
                          onClick={() => removeCustomTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar tag personalizada..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addCustomTag())
                  }
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={addCustomTag}>
                  Adicionar
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Integrações */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Integrações
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agenda"
                    checked={formData.integracaoAgenda}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        integracaoAgenda: checked as boolean,
                      }))
                    }
                  />
                  <Label
                    htmlFor="agenda"
                    className="text-sm flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Adicionar à Agenda Jurídica
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ia-resumo"
                    checked={formData.integracaoIA?.resumoAutomatico}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        integracaoIA: {
                          ...prev.integracaoIA,
                          resumoAutomatico: checked as boolean,
                        },
                      }))
                    }
                  />
                  <Label htmlFor="ia-resumo" className="text-sm">
                    Resumo automático via IA
                  </Label>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ia-peticao"
                    checked={formData.integracaoIA?.sugestoesPeticao}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        integracaoIA: {
                          ...prev.integracaoIA,
                          sugestoesPeticao: checked as boolean,
                        },
                      }))
                    }
                  />
                  <Label htmlFor="ia-peticao" className="text-sm">
                    Sugestões de petição via IA
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ia-rascunho"
                    checked={formData.integracaoIA?.elaboracaoRascunho}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        integracaoIA: {
                          ...prev.integracaoIA,
                          elaboracaoRascunho: checked as boolean,
                        },
                      }))
                    }
                  />
                  <Label htmlFor="ia-rascunho" className="text-sm">
                    Elaboração de rascunho via IA
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Tarefa
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
