import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Scale,
  Save,
  X,
  Calendar,
  DollarSign,
  User,
  Building,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Tag,
  Upload,
  MapPin,
  Phone,
  Mail,
  Gavel,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCRM, type Processo, type Cliente } from "@/hooks/useCRM";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/date-picker";

interface ProcessoFormProps {
  isOpen: boolean;
  onClose: () => void;
  processo?: Processo;
  clienteId?: string;
}

interface ProcessoFormData {
  numero: string;
  clienteId: string;
  area: string;
  status: "ativo" | "arquivado" | "suspenso" | "encerrado";
  valor: number;
  dataInicio: Date;
  dataEncerramento?: Date;
  responsavel: string;
  tribunal: string;
  vara: string;
  assunto: string;
  observacoes?: string;
  tags: string[];
  proximaAudiencia?: Date;
  risco: "baixo" | "medio" | "alto";
  prioridade: "baixa" | "media" | "alta" | "critica";
  instancia: "primeira" | "segunda" | "superior" | "supremo";
  rito: "comum" | "sumario" | "sumarissimo" | "especial";
  segredoJustica: boolean;
  valorCausa?: number;
  custas?: number;
  honorarios?: number;
  enderecoTribunal?: string;
  telefoneCartorio?: string;
  emailCartorio?: string;
  numeroDistribuicao?: string;
  classeJudicial?: string;
  competencia?: string;
}

const areasJuridicas = [
  "Cível",
  "Criminal",
  "Trabalhista",
  "Família",
  "Tributário",
  "Administrativo",
  "Constitucional",
  "Previdenciário",
  "Empresarial",
  "Consumidor",
  "Ambiental",
  "Eleitoral",
];

const tribunais = [
  "TJSP - Tribunal de Justiça de São Paulo",
  "TJRJ - Tribunal de Justiça do Rio de Janeiro",
  "TJMG - Tribunal de Justiça de Minas Gerais",
  "TRT-2 - Tribunal Regional do Trabalho 2ª Região",
  "TRT-15 - Tribunal Regional do Trabalho 15ª Região",
  "TRF-3 - Tribunal Regional Federal 3ª Região",
  "STJ - Superior Tribunal de Justiça",
  "STF - Supremo Tribunal Federal",
  "TST - Tribunal Superior do Trabalho",
];

const responsaveis = [
  "Dr. Pedro Santos",
  "Dra. Ana Costa",
  "Dr. Carlos Silva",
  "Dra. Maria Oliveira",
  "Dr. João Pereira",
  "Dra. Fernanda Lima",
];

export default function ProcessoForm({
  isOpen,
  onClose,
  processo,
  clienteId,
}: ProcessoFormProps) {
  const { clientes, adicionarProcesso, editarProcesso } = useCRM();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState("");

  const [formData, setFormData] = useState<ProcessoFormData>({
    numero: "",
    clienteId: clienteId || "",
    area: "",
    status: "ativo",
    valor: 0,
    dataInicio: new Date(),
    responsavel: "",
    tribunal: "",
    vara: "",
    assunto: "",
    observacoes: "",
    tags: [],
    risco: "baixo",
    prioridade: "media",
    instancia: "primeira",
    rito: "comum",
    segredoJustica: false,
    valorCausa: 0,
    custas: 0,
    honorarios: 0,
  });

  useEffect(() => {
    if (processo) {
      setFormData({
        numero: processo.numero,
        clienteId: processo.clienteId,
        area: processo.area,
        status: processo.status,
        valor: processo.valor,
        dataInicio: processo.dataInicio,
        dataEncerramento: processo.dataEncerramento,
        responsavel: processo.responsavel,
        tribunal: processo.tribunal,
        vara: processo.vara,
        assunto: processo.assunto,
        observacoes: processo.observacoes || "",
        tags: processo.tags,
        proximaAudiencia: processo.proximaAudiencia,
        risco: processo.risco,
        prioridade: "media",
        instancia: "primeira",
        rito: "comum",
        segredoJustica: false,
        valorCausa: processo.valor,
        custas: 0,
        honorarios: 0,
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        clienteId: clienteId || "",
      }));
    }
  }, [processo, clienteId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.numero.trim()) {
      newErrors.numero = "Número do processo é obrigatório";
    } else if (
      !/^\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2}\.\d{4}$/.test(formData.numero)
    ) {
      newErrors.numero = "Formato inválido. Use: 1234567-89.2024.8.26.0100";
    }

    if (!formData.clienteId) {
      newErrors.clienteId = "Cliente é obrigatório";
    }

    if (!formData.area) {
      newErrors.area = "Área jurídica é obrigatória";
    }

    if (!formData.assunto.trim()) {
      newErrors.assunto = "Assunto é obrigatório";
    }

    if (!formData.responsavel) {
      newErrors.responsavel = "Responsável é obrigatório";
    }

    if (!formData.tribunal) {
      newErrors.tribunal = "Tribunal é obrigatório";
    }

    if (!formData.vara.trim()) {
      newErrors.vara = "Vara é obrigatória";
    }

    if (formData.valor <= 0) {
      newErrors.valor = "Valor deve ser maior que zero";
    }

    if (!formData.dataInicio) {
      newErrors.dataInicio = "Data de início é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    setLoading(true);
    try {
      const cliente = clientes.find((c) => c.id === formData.clienteId);
      const processoData = {
        ...formData,
        cliente: cliente?.nome || "",
        id: processo?.id,
      };

      if (processo) {
        await editarProcesso(processo.id, processoData);
        toast.success("Processo atualizado com sucesso!");
      } else {
        await adicionarProcesso(processoData);
        toast.success("Processo criado com sucesso!");
      }

      onClose();
    } catch (error) {
      toast.error("Erro ao salvar processo");
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const updateFormData = (field: keyof ProcessoFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const cliente = clientes.find((c) => c.id === formData.clienteId);

  const getStepIcon = (stepNumber: number) => {
    if (step > stepNumber)
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (step === stepNumber) return <Clock className="h-5 w-5 text-blue-600" />;
    return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-blue-600" />
            {processo ? "Editar Processo" : "Novo Processo"}
          </DialogTitle>
          <DialogDescription>
            {processo
              ? "Atualize as informações do processo jurídico"
              : "Cadastre um novo processo jurídico no sistema"}
          </DialogDescription>
        </DialogHeader>

        {/* Steps indicator */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            {getStepIcon(1)}
            <span
              className={`text-sm font-medium ${step >= 1 ? "text-gray-900" : "text-gray-500"}`}
            >
              Dados Básicos
            </span>
          </div>
          <div className="flex-1 h-px bg-gray-300 mx-4" />
          <div className="flex items-center gap-2">
            {getStepIcon(2)}
            <span
              className={`text-sm font-medium ${step >= 2 ? "text-gray-900" : "text-gray-500"}`}
            >
              Detalhes Judiciais
            </span>
          </div>
          <div className="flex-1 h-px bg-gray-300 mx-4" />
          <div className="flex items-center gap-2">
            {getStepIcon(3)}
            <span
              className={`text-sm font-medium ${step >= 3 ? "text-gray-900" : "text-gray-500"}`}
            >
              Configurações
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-1">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {step === 1 && (
              <div className="space-y-6">
                {/* Dados básicos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Informações Básicas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="numero">Número do Processo *</Label>
                        <Input
                          id="numero"
                          placeholder="1234567-89.2024.8.26.0100"
                          value={formData.numero}
                          onChange={(e) =>
                            updateFormData("numero", e.target.value)
                          }
                          className={errors.numero ? "border-red-500" : ""}
                        />
                        {errors.numero && (
                          <p className="text-sm text-red-500">
                            {errors.numero}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cliente">Cliente *</Label>
                        <Select
                          value={formData.clienteId}
                          onValueChange={(value) =>
                            updateFormData("clienteId", value)
                          }
                        >
                          <SelectTrigger
                            className={errors.clienteId ? "border-red-500" : ""}
                          >
                            <SelectValue placeholder="Selecione o cliente" />
                          </SelectTrigger>
                          <SelectContent>
                            {clientes.map((cliente) => (
                              <SelectItem key={cliente.id} value={cliente.id}>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  {cliente.nome}
                                  <Badge variant="outline">
                                    {cliente.tipo}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.clienteId && (
                          <p className="text-sm text-red-500">
                            {errors.clienteId}
                          </p>
                        )}
                        {cliente && (
                          <div className="p-2 bg-blue-50 rounded border text-sm">
                            <div className="font-medium">{cliente.nome}</div>
                            <div className="text-gray-600">{cliente.email}</div>
                            <div className="text-gray-600">
                              {cliente.telefone}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assunto">Assunto do Processo *</Label>
                      <Input
                        id="assunto"
                        placeholder="Ex: Ação de divórcio consensual"
                        value={formData.assunto}
                        onChange={(e) =>
                          updateFormData("assunto", e.target.value)
                        }
                        className={errors.assunto ? "border-red-500" : ""}
                      />
                      {errors.assunto && (
                        <p className="text-sm text-red-500">{errors.assunto}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="area">Área Jurídica *</Label>
                        <Select
                          value={formData.area}
                          onValueChange={(value) =>
                            updateFormData("area", value)
                          }
                        >
                          <SelectTrigger
                            className={errors.area ? "border-red-500" : ""}
                          >
                            <SelectValue placeholder="Selecione a área" />
                          </SelectTrigger>
                          <SelectContent>
                            {areasJuridicas.map((area) => (
                              <SelectItem key={area} value={area}>
                                {area}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.area && (
                          <p className="text-sm text-red-500">{errors.area}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) =>
                            updateFormData("status", value as any)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="suspenso">Suspenso</SelectItem>
                            <SelectItem value="arquivado">Arquivado</SelectItem>
                            <SelectItem value="encerrado">Encerrado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="risco">Nível de Risco</Label>
                        <Select
                          value={formData.risco}
                          onValueChange={(value) =>
                            updateFormData("risco", value as any)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="baixo">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                Baixo
                              </div>
                            </SelectItem>
                            <SelectItem value="medio">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-yellow-600" />
                                Médio
                              </div>
                            </SelectItem>
                            <SelectItem value="alto">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                Alto
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dataInicio">Data de Início *</Label>
                        <DatePicker
                          date={formData.dataInicio}
                          onSelect={(date) =>
                            updateFormData("dataInicio", date)
                          }
                          className={errors.dataInicio ? "border-red-500" : ""}
                        />
                        {errors.dataInicio && (
                          <p className="text-sm text-red-500">
                            {errors.dataInicio}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="proximaAudiencia">
                          Próxima Audiência
                        </Label>
                        <DatePicker
                          date={formData.proximaAudiencia}
                          onSelect={(date) =>
                            updateFormData("proximaAudiencia", date)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="responsavel">Responsável *</Label>
                      <Select
                        value={formData.responsavel}
                        onValueChange={(value) =>
                          updateFormData("responsavel", value)
                        }
                      >
                        <SelectTrigger
                          className={errors.responsavel ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Selecione o responsável" />
                        </SelectTrigger>
                        <SelectContent>
                          {responsaveis.map((responsavel) => (
                            <SelectItem key={responsavel} value={responsavel}>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {responsavel}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.responsavel && (
                        <p className="text-sm text-red-500">
                          {errors.responsavel}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {/* Detalhes judiciais */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gavel className="h-5 w-5" />
                      Detalhes Judiciais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tribunal">Tribunal *</Label>
                        <Select
                          value={formData.tribunal}
                          onValueChange={(value) =>
                            updateFormData("tribunal", value)
                          }
                        >
                          <SelectTrigger
                            className={errors.tribunal ? "border-red-500" : ""}
                          >
                            <SelectValue placeholder="Selecione o tribunal" />
                          </SelectTrigger>
                          <SelectContent>
                            {tribunais.map((tribunal) => (
                              <SelectItem key={tribunal} value={tribunal}>
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4" />
                                  {tribunal}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.tribunal && (
                          <p className="text-sm text-red-500">
                            {errors.tribunal}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vara">Vara *</Label>
                        <Input
                          id="vara"
                          placeholder="Ex: 1ª Vara de Família"
                          value={formData.vara}
                          onChange={(e) =>
                            updateFormData("vara", e.target.value)
                          }
                          className={errors.vara ? "border-red-500" : ""}
                        />
                        {errors.vara && (
                          <p className="text-sm text-red-500">{errors.vara}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="instancia">Instância</Label>
                        <Select
                          value={formData.instancia}
                          onValueChange={(value) =>
                            updateFormData("instancia", value as any)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="primeira">
                              1ª Instância
                            </SelectItem>
                            <SelectItem value="segunda">
                              2ª Instância
                            </SelectItem>
                            <SelectItem value="superior">
                              Tribunais Superiores
                            </SelectItem>
                            <SelectItem value="supremo">Supremo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rito">Rito Processual</Label>
                        <Select
                          value={formData.rito}
                          onValueChange={(value) =>
                            updateFormData("rito", value as any)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="comum">Comum</SelectItem>
                            <SelectItem value="sumario">Sumário</SelectItem>
                            <SelectItem value="sumarissimo">
                              Sumaríssimo
                            </SelectItem>
                            <SelectItem value="especial">Especial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="prioridade">Prioridade</Label>
                        <Select
                          value={formData.prioridade}
                          onValueChange={(value) =>
                            updateFormData("prioridade", value as any)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="baixa">Baixa</SelectItem>
                            <SelectItem value="media">Média</SelectItem>
                            <SelectItem value="alta">Alta</SelectItem>
                            <SelectItem value="critica">Crítica</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="numeroDistribuicao">
                          Número de Distribuição
                        </Label>
                        <Input
                          id="numeroDistribuicao"
                          placeholder="Número de distribuição"
                          value={formData.numeroDistribuicao || ""}
                          onChange={(e) =>
                            updateFormData("numeroDistribuicao", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="classeJudicial">Classe Judicial</Label>
                        <Input
                          id="classeJudicial"
                          placeholder="Ex: Ação de Divórcio"
                          value={formData.classeJudicial || ""}
                          onChange={(e) =>
                            updateFormData("classeJudicial", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="competencia">Competência</Label>
                      <Input
                        id="competencia"
                        placeholder="Ex: Direito de Família"
                        value={formData.competencia || ""}
                        onChange={(e) =>
                          updateFormData("competencia", e.target.value)
                        }
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="segredoJustica"
                        checked={formData.segredoJustica}
                        onCheckedChange={(checked) =>
                          updateFormData("segredoJustica", checked)
                        }
                      />
                      <Label
                        htmlFor="segredoJustica"
                        className="flex items-center gap-2"
                      >
                        <Shield className="h-4 w-4 text-red-500" />
                        Processo em segredo de justiça
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Valores */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Valores e Custas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="valor">Valor dos Honorários *</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="valor"
                            type="number"
                            placeholder="0,00"
                            className={`pl-10 ${errors.valor ? "border-red-500" : ""}`}
                            value={formData.valor}
                            onChange={(e) =>
                              updateFormData("valor", Number(e.target.value))
                            }
                          />
                        </div>
                        {errors.valor && (
                          <p className="text-sm text-red-500">{errors.valor}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="valorCausa">Valor da Causa</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="valorCausa"
                            type="number"
                            placeholder="0,00"
                            className="pl-10"
                            value={formData.valorCausa || 0}
                            onChange={(e) =>
                              updateFormData(
                                "valorCausa",
                                Number(e.target.value),
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="custas">Custas Processuais</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="custas"
                            type="number"
                            placeholder="0,00"
                            className="pl-10"
                            value={formData.custas || 0}
                            onChange={(e) =>
                              updateFormData("custas", Number(e.target.value))
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="honorarios">
                          Honorários de Sucumbência
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="honorarios"
                            type="number"
                            placeholder="0,00"
                            className="pl-10"
                            value={formData.honorarios || 0}
                            onChange={(e) =>
                              updateFormData(
                                "honorarios",
                                Number(e.target.value),
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                {/* Tags e observações */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Tags e Observações
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Digite uma tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addTag()}
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          variant="outline"
                        >
                          Adicionar
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => removeTag(tag)}
                          >
                            {tag} <X className="h-3 w-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="observacoes">Observações</Label>
                      <Textarea
                        id="observacoes"
                        placeholder="Observações gerais sobre o processo..."
                        value={formData.observacoes || ""}
                        onChange={(e) =>
                          updateFormData("observacoes", e.target.value)
                        }
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Contatos do cartório */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Contatos do Cartório/Tribunal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="enderecoTribunal">
                        Endereço do Tribunal
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                        <Textarea
                          id="enderecoTribunal"
                          placeholder="Endereço completo do tribunal"
                          value={formData.enderecoTribunal || ""}
                          onChange={(e) =>
                            updateFormData("enderecoTribunal", e.target.value)
                          }
                          className="pl-10"
                          rows={2}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="telefoneCartorio">
                          Telefone do Cartório
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="telefoneCartorio"
                            placeholder="(11) 99999-9999"
                            value={formData.telefoneCartorio || ""}
                            onChange={(e) =>
                              updateFormData("telefoneCartorio", e.target.value)
                            }
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emailCartorio">
                          E-mail do Cartório
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="emailCartorio"
                            placeholder="cartorio@tribunal.jus.br"
                            value={formData.emailCartorio || ""}
                            onChange={(e) =>
                              updateFormData("emailCartorio", e.target.value)
                            }
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Resumo final */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Resumo do Processo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Número:</span>{" "}
                        {formData.numero}
                      </div>
                      <div>
                        <span className="font-medium">Cliente:</span>{" "}
                        {cliente?.nome}
                      </div>
                      <div>
                        <span className="font-medium">Área:</span>{" "}
                        {formData.area}
                      </div>
                      <div>
                        <span className="font-medium">Tribunal:</span>{" "}
                        {formData.tribunal}
                      </div>
                      <div>
                        <span className="font-medium">Valor:</span>{" "}
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(formData.valor)}
                      </div>
                      <div>
                        <span className="font-medium">Responsável:</span>{" "}
                        {formData.responsavel}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer com navegação */}
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={loading}
              >
                Anterior
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>

            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)}>Próximo</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {processo ? "Atualizar" : "Criar"} Processo
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
