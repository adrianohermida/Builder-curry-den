import { useState, useCallback, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  User,
  Building,
  Calendar,
  DollarSign,
  FileSignature,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  X,
  Upload,
  Download,
  Eye,
  Copy,
  Zap,
  Bot,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

// Validation schema
const contratoSchema = z.object({
  titulo: z.string().min(5, "Título deve ter pelo menos 5 caracteres"),
  descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  clienteId: z.string().min(1, "Cliente é obrigatório"),
  advogadoId: z.string().min(1, "Advogado responsável é obrigatório"),
  tipo: z.enum([
    "prestacao_servicos",
    "retainer",
    "success_fee",
    "fixo",
    "por_audiencia",
  ]),
  valor: z.number().min(0, "Valor deve ser positivo"),
  tipoPagamento: z.enum(["mensal", "avulso", "por_sucesso", "parcelas"]),
  dataInicio: z.string().min(1, "Data de início é obrigatória"),
  dataFim: z.string().optional(),
  clausulas: z
    .array(z.string())
    .min(1, "Pelo menos uma cláusula é obrigatória"),
  configFaturamento: z.object({
    frequencia: z.enum(["mensal", "trimestral", "semestral", "anual"]),
    diaVencimento: z.number().min(1).max(31),
    multaAtraso: z.number().min(0).max(100),
    jurosAtraso: z.number().min(0).max(10),
    diasLembrete: z.array(z.number()),
  }),
  stripeConfig: z.object({
    habilitado: z.boolean(),
    precoId: z.string().optional(),
  }),
  templateId: z.string().optional(),
});

type ContratoFormData = z.infer<typeof contratoSchema>;

interface ContratoFormProps {
  contrato?: Partial<ContratoFormData>;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContratoFormData) => void;
  templates?: ContractTemplate[];
  clientes?: Cliente[];
  advogados?: Advogado[];
  isLoading?: boolean;
}

interface ContractTemplate {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  clausulasPadrao: string[];
  camposPersonalizados: {
    nome: string;
    tipo: string;
    obrigatorio: boolean;
  }[];
}

interface Cliente {
  id: string;
  nome: string;
  tipo: "fisica" | "juridica";
  email: string;
  telefone: string;
  documento: string;
}

interface Advogado {
  id: string;
  nome: string;
  oab: string;
  email: string;
  especialidades: string[];
}

export function ContratoForm({
  contrato,
  isOpen,
  onClose,
  onSubmit,
  templates = [],
  clientes = [],
  advogados = [],
  isLoading = false,
}: ContratoFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] =
    useState<ContractTemplate | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset,
    trigger,
  } = useForm<ContratoFormData>({
    resolver: zodResolver(contratoSchema),
    defaultValues: {
      clausulas: [""],
      configFaturamento: {
        frequencia: "mensal",
        diaVencimento: 10,
        multaAtraso: 2,
        jurosAtraso: 1,
        diasLembrete: [7, 3, 1],
      },
      stripeConfig: {
        habilitado: false,
      },
      ...contrato,
    },
  });

  const watchedValues = watch();
  const completionPercentage = Math.round(
    (Object.values(watchedValues).filter(
      (value) => value !== undefined && value !== "" && value !== null,
    ).length /
      Object.keys(contratoSchema.shape).length) *
      100,
  );

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      if (contrato) {
        reset(contrato);
      } else {
        reset({
          clausulas: [""],
          configFaturamento: {
            frequencia: "mensal",
            diaVencimento: 10,
            multaAtraso: 2,
            jurosAtraso: 1,
            diasLembrete: [7, 3, 1],
          },
          stripeConfig: {
            habilitado: false,
          },
        });
      }
      setCurrentStep(1);
      setSelectedTemplate(null);
      setPreviewMode(false);
    }
  }, [isOpen, contrato, reset]);

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOpen && watchedValues.titulo) {
        localStorage.setItem("contrato_draft", JSON.stringify(watchedValues));
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [watchedValues, isOpen]);

  const handleTemplateSelect = useCallback(
    (template: ContractTemplate) => {
      setSelectedTemplate(template);
      setValue("templateId", template.id);
      setValue("clausulas", template.clausulasPadrao);
      toast.success(`Template "${template.nome}" aplicado!`);
    },
    [setValue],
  );

  const handleGenerateAIContent = useCallback(async () => {
    setIsGeneratingAI(true);
    try {
      // Simular chamada de IA
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const suggestions = [
        "O CONTRATADO prestará serviços advocatícios especializados na área escolhida",
        "O pagamento será realizado mensalmente até o dia especificado",
        "Este contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de 30 dias",
        "Todas as despesas processuais serão de responsabilidade do CONTRATANTE",
        "O CONTRATADO manterá sigilo absoluto sobre todas as informações do cliente",
      ];

      setAiSuggestions(suggestions);
      toast.success("Sugestões de cláusulas geradas pela IA!");
    } catch (error) {
      toast.error("Erro ao gerar sugestões");
    } finally {
      setIsGeneratingAI(false);
    }
  }, []);

  const addClausula = useCallback(() => {
    const currentClausulas = watchedValues.clausulas || [];
    setValue("clausulas", [...currentClausulas, ""]);
  }, [watchedValues.clausulas, setValue]);

  const removeClausula = useCallback(
    (index: number) => {
      const currentClausulas = watchedValues.clausulas || [];
      setValue(
        "clausulas",
        currentClausulas.filter((_, i) => i !== index),
      );
    },
    [watchedValues.clausulas, setValue],
  );

  const nextStep = useCallback(async () => {
    const stepFields: Record<number, (keyof ContratoFormData)[]> = {
      1: ["titulo", "descricao", "clienteId", "advogadoId"],
      2: ["tipo", "valor", "tipoPagamento", "dataInicio"],
      3: ["clausulas"],
    };

    const fieldsToValidate = stepFields[currentStep];
    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  }, [currentStep, trigger]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleFormSubmit = useCallback(
    (data: ContratoFormData) => {
      onSubmit(data);
      toast.success("Contrato criado com sucesso!");
    },
    [onSubmit],
  );

  const stepTitles = {
    1: "Informações Básicas",
    2: "Configurações Financeiras",
    3: "Cláusulas e Termos",
    4: "Revisão e Finalização",
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-6">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === currentStep
                ? "bg-blue-600 text-white"
                : step < currentStep
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-600"
            }`}
          >
            {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
          </div>
          {step < 4 && (
            <div
              className={`w-12 h-0.5 mx-2 ${
                step < currentStep ? "bg-green-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="titulo">Título do Contrato *</Label>
          <Controller
            name="titulo"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Ex: Contrato de Prestação de Serviços Jurídicos"
                className={errors.titulo ? "border-red-500" : ""}
              />
            )}
          />
          {errors.titulo && (
            <p className="text-sm text-red-600">{errors.titulo.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="templateId">Template (Opcional)</Label>
          <Select
            value={selectedTemplate?.id || ""}
            onValueChange={(value) => {
              const template = templates.find((t) => t.id === value);
              if (template) handleTemplateSelect(template);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Escolher template..." />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{template.nome}</div>
                      <div className="text-xs text-muted-foreground">
                        {template.categoria}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição dos Serviços *</Label>
        <Controller
          name="descricao"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="Descreva detalhadamente os serviços a serem prestados..."
              rows={4}
              className={errors.descricao ? "border-red-500" : ""}
            />
          )}
        />
        {errors.descricao && (
          <p className="text-sm text-red-600">{errors.descricao.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clienteId">Cliente *</Label>
          <Controller
            name="clienteId"
            control={control}
            render={({ field }) => (
              <Select {...field} onValueChange={field.onChange}>
                <SelectTrigger
                  className={errors.clienteId ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Selecionar cliente..." />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      <div className="flex items-center gap-2">
                        {cliente.tipo === "juridica" ? (
                          <Building className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                        <div>
                          <div className="font-medium">{cliente.nome}</div>
                          <div className="text-xs text-muted-foreground">
                            {cliente.email}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.clienteId && (
            <p className="text-sm text-red-600">{errors.clienteId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="advogadoId">Advogado Responsável *</Label>
          <Controller
            name="advogadoId"
            control={control}
            render={({ field }) => (
              <Select {...field} onValueChange={field.onChange}>
                <SelectTrigger
                  className={errors.advogadoId ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Selecionar advogado..." />
                </SelectTrigger>
                <SelectContent>
                  {advogados.map((advogado) => (
                    <SelectItem key={advogado.id} value={advogado.id}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{advogado.nome}</div>
                          <div className="text-xs text-muted-foreground">
                            OAB: {advogado.oab}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.advogadoId && (
            <p className="text-sm text-red-600">{errors.advogadoId.message}</p>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de Contrato *</Label>
          <Controller
            name="tipo"
            control={control}
            render={({ field }) => (
              <Select {...field} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar tipo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prestacao_servicos">
                    Prestação de Serviços
                  </SelectItem>
                  <SelectItem value="retainer">Retainer</SelectItem>
                  <SelectItem value="success_fee">Taxa de Sucesso</SelectItem>
                  <SelectItem value="fixo">Valor Fixo</SelectItem>
                  <SelectItem value="por_audiencia">Por Audiência</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipoPagamento">Forma de Pagamento *</Label>
          <Controller
            name="tipoPagamento"
            control={control}
            render={({ field }) => (
              <Select {...field} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar forma..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mensal">Mensal</SelectItem>
                  <SelectItem value="avulso">À Vista</SelectItem>
                  <SelectItem value="por_sucesso">Por Sucesso</SelectItem>
                  <SelectItem value="parcelas">Parcelado</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="valor">Valor (R$) *</Label>
          <Controller
            name="valor"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                onChange={(e) =>
                  field.onChange(parseFloat(e.target.value) || 0)
                }
                className={errors.valor ? "border-red-500" : ""}
              />
            )}
          />
          {errors.valor && (
            <p className="text-sm text-red-600">{errors.valor.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataInicio">Data de Início *</Label>
          <Controller
            name="dataInicio"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="date"
                className={errors.dataInicio ? "border-red-500" : ""}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataFim">Data de Fim (Opcional)</Label>
          <Controller
            name="dataFim"
            control={control}
            render={({ field }) => <Input {...field} type="date" />}
          />
        </div>
      </div>

      {/* Configurações de Faturamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Configurações de Faturamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Frequência</Label>
              <Controller
                name="configFaturamento.frequencia"
                control={control}
                render={({ field }) => (
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mensal">Mensal</SelectItem>
                      <SelectItem value="trimestral">Trimestral</SelectItem>
                      <SelectItem value="semestral">Semestral</SelectItem>
                      <SelectItem value="anual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Dia do Vencimento</Label>
              <Controller
                name="configFaturamento.diaVencimento"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    max="31"
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 10)
                    }
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Multa Atraso (%)</Label>
              <Controller
                name="configFaturamento.multaAtraso"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 2)
                    }
                  />
                )}
              />
            </div>
          </div>

          {/* Integração Stripe */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <div>
                <div className="font-medium">Integração Stripe</div>
                <div className="text-sm text-muted-foreground">
                  Cobrança automática via cartão de crédito
                </div>
              </div>
            </div>
            <Controller
              name="stripeConfig.habilitado"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Cláusulas do Contrato</h3>
          <p className="text-sm text-muted-foreground">
            Adicione as cláusulas e termos específicos do contrato
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGenerateAIContent}
            disabled={isGeneratingAI}
          >
            {isGeneratingAI ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                Gerando...
              </div>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                IA Sugestões
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addClausula}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>

      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Bot className="h-5 w-5" />
              Sugestões da IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 bg-white rounded border"
                >
                  <div className="flex-1 text-sm">{suggestion}</div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const currentClausulas = watchedValues.clausulas || [];
                      setValue("clausulas", [...currentClausulas, suggestion]);
                      toast.success("Cláusula adicionada!");
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cláusulas */}
      <div className="space-y-3">
        {(watchedValues.clausulas || [""]).map((_, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-1">
              <Controller
                name={`clausulas.${index}`}
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder={`Cláusula ${index + 1}...`}
                    rows={3}
                    className="resize-none"
                  />
                )}
              />
            </div>
            {(watchedValues.clausulas || []).length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeClausula(index)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {errors.clausulas && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errors.clausulas.message}</AlertDescription>
        </Alert>
      )}
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">Revisão Final</h3>
        <p className="text-muted-foreground">
          Revise todas as informações antes de criar o contrato
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm font-medium">Título:</span>
              <p className="text-sm text-muted-foreground">
                {watchedValues.titulo || "-"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium">Tipo:</span>
              <p className="text-sm text-muted-foreground">
                {watchedValues.tipo || "-"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium">Valor:</span>
              <p className="text-sm text-muted-foreground">
                {watchedValues.valor
                  ? `R$ ${watchedValues.valor.toLocaleString("pt-BR")}`
                  : "-"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configurações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm font-medium">Stripe:</span>
              <p className="text-sm text-muted-foreground">
                {watchedValues.stripeConfig?.habilitado
                  ? "Habilitado"
                  : "Desabilitado"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium">Cláusulas:</span>
              <p className="text-sm text-muted-foreground">
                {(watchedValues.clausulas || []).filter(Boolean).length}{" "}
                definidas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Contrato Pronto para Criação</AlertTitle>
        <AlertDescription>
          Todas as informações foram preenchidas. O contrato será criado e
          ficará disponível para assinatura.
        </AlertDescription>
      </Alert>
    </motion.div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {contrato ? "Editar Contrato" : "Novo Contrato"}
          </DialogTitle>
          <DialogDescription>
            {stepTitles[currentStep]} - {completionPercentage}% completo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {renderStepIndicator()}

          <div className="mb-4">
            <Progress value={completionPercentage} className="h-2" />
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
            </AnimatePresence>

            <DialogFooter className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Anterior
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>

                {currentStep < 4 ? (
                  <Button type="button" onClick={nextStep}>
                    Próximo
                  </Button>
                ) : (
                  <Button type="submit" disabled={!isValid || isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Criando...
                      </div>
                    ) : (
                      "Criar Contrato"
                    )}
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
