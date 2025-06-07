import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Sparkles,
  FileText,
  MessageSquare,
  Download,
  Copy,
  Share2,
  History,
  Star,
  Zap,
  Search,
  Filter,
  Upload,
  RotateCcw,
  Check,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Edit,
  Save,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  BarChart3,
  Users,
  Gavel,
  Scale,
  BookOpen,
  Lightbulb,
  Workflow,
  Shield,
  Cpu,
  Database,
  Network,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { usePermissions } from "@/hooks/usePermissions";
import {
  useAuditSystem,
  AUDIT_ACTIONS,
  AUDIT_MODULES,
} from "@/hooks/useAuditSystem";
import { toast } from "sonner";

interface AITemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  area: string;
  prompt: string;
  variables: Array<{
    name: string;
    label: string;
    type: "text" | "number" | "date" | "select";
    required: boolean;
    options?: string[];
  }>;
  usage: number;
  rating: number;
  lastUsed?: string;
  favorite: boolean;
  complexity: "baixa" | "media" | "alta";
  estimatedTime: number; // in minutes
}

interface AIGeneration {
  id: string;
  templateId: string;
  templateName: string;
  prompt: string;
  result: string;
  timestamp: string;
  userId: string;
  userName: string;
  tokens: number;
  cost: number;
  quality: number;
  feedback?: "positive" | "negative";
  category: string;
  metadata: Record<string, any>;
}

interface AIAnalysis {
  id: string;
  type: "document" | "contract" | "process" | "invoice";
  title: string;
  status: "analyzing" | "completed" | "error";
  progress: number;
  insights: Array<{
    type: "risk" | "opportunity" | "compliance" | "suggestion";
    severity: "low" | "medium" | "high" | "critical";
    title: string;
    description: string;
    confidence: number;
  }>;
  summary: string;
  timestamp: string;
}

export default function AIEnhanced() {
  const [activeTab, setActiveTab] = useState("generator");
  const [selectedTemplate, setSelectedTemplate] = useState<AITemplate | null>(
    null,
  );
  const [prompt, setPrompt] = useState("");
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedContent, setGeneratedContent] = useState("");
  const [generations, setGenerations] = useState<AIGeneration[]>([]);
  const [analyses, setAnalyses] = useState<AIAnalysis[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedArea, setSelectedArea] = useState("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const [aiSettings, setAiSettings] = useState({
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 2000,
    autoSave: true,
    qualityCheck: true,
  });

  const { user, hasPermission } = usePermissions();
  const { logAction } = useAuditSystem();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mock AI templates
  const templates: AITemplate[] = [
    {
      id: "peticao-inicial-civil",
      name: "Petição Inicial - Direito Civil",
      description: "Gera petição inicial para ações de direito civil",
      category: "Petições",
      area: "Direito Civil",
      prompt:
        "Elabore uma petição inicial para ação de {tipoAcao} entre {autor} e {reu}, com os seguintes fatos: {fatos}. Valor da causa: {valorCausa}.",
      variables: [
        {
          name: "tipoAcao",
          label: "Tipo de Ação",
          type: "select",
          required: true,
          options: [
            "Indenização por Danos Morais",
            "Cobrança",
            "Revisional",
            "Declaratória",
          ],
        },
        { name: "autor", label: "Autor", type: "text", required: true },
        { name: "reu", label: "Réu", type: "text", required: true },
        {
          name: "fatos",
          label: "Descrição dos Fatos",
          type: "text",
          required: true,
        },
        {
          name: "valorCausa",
          label: "Valor da Causa",
          type: "text",
          required: true,
        },
      ],
      usage: 245,
      rating: 4.8,
      lastUsed: "2024-01-15",
      favorite: true,
      complexity: "media",
      estimatedTime: 15,
    },
    {
      id: "contestacao-trabalhista",
      name: "Contestação - Direito Trabalhista",
      description: "Gera contestação para reclamações trabalhistas",
      category: "Contestações",
      area: "Direito Trabalhista",
      prompt:
        "Elabore uma contestação para reclamação trabalhista onde {reclamante} alega {alegacoes} contra {reclamada}. Defesas: {defesas}.",
      variables: [
        {
          name: "reclamante",
          label: "Reclamante",
          type: "text",
          required: true,
        },
        { name: "reclamada", label: "Reclamada", type: "text", required: true },
        {
          name: "alegacoes",
          label: "Alegações do Reclamante",
          type: "text",
          required: true,
        },
        { name: "defesas", label: "Defesas", type: "text", required: true },
      ],
      usage: 189,
      rating: 4.7,
      lastUsed: "2024-01-14",
      favorite: false,
      complexity: "alta",
      estimatedTime: 25,
    },
    {
      id: "contrato-prestacao-servicos",
      name: "Contrato de Prestação de Serviços",
      description: "Gera contrato de prestação de serviços jurídicos",
      category: "Contratos",
      area: "Direito Empresarial",
      prompt:
        "Elabore contrato de prestação de serviços jurídicos entre {contratante} e {contratado}, com objeto: {objeto}, valor: {valor}, prazo: {prazo}.",
      variables: [
        {
          name: "contratante",
          label: "Contratante",
          type: "text",
          required: true,
        },
        {
          name: "contratado",
          label: "Contratado",
          type: "text",
          required: true,
        },
        {
          name: "objeto",
          label: "Objeto do Contrato",
          type: "text",
          required: true,
        },
        { name: "valor", label: "Valor", type: "text", required: true },
        { name: "prazo", label: "Prazo", type: "text", required: true },
      ],
      usage: 156,
      rating: 4.9,
      lastUsed: "2024-01-13",
      favorite: true,
      complexity: "baixa",
      estimatedTime: 10,
    },
  ];

  // Load generations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("lawdesk-ai-generations");
    if (saved) {
      try {
        setGenerations(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading AI generations:", e);
      }
    }
  }, []);

  // Filter templates
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    const matchesArea =
      selectedArea === "all" || template.area === selectedArea;
    const matchesFavorites = !showFavorites || template.favorite;

    return matchesSearch && matchesCategory && matchesArea && matchesFavorites;
  });

  // Handle template selection
  const handleTemplateSelect = (template: AITemplate) => {
    setSelectedTemplate(template);
    setPrompt(template.prompt);
    setVariables({});

    logAction(AUDIT_ACTIONS.AI_GENERATE, AUDIT_MODULES.AI, {
      templateId: template.id,
      templateName: template.name,
      action: "template_selected",
    });
  };

  // Handle variable changes
  const handleVariableChange = (name: string, value: string) => {
    setVariables((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Generate content
  const handleGenerate = async () => {
    if (!selectedTemplate || !hasPermission("ai", "write")) {
      toast.error("Permissão insuficiente para gerar conteúdo");
      return;
    }

    // Validate required variables
    const missingVariables = selectedTemplate.variables
      .filter((v) => v.required && !variables[v.name])
      .map((v) => v.label);

    if (missingVariables.length > 0) {
      toast.error(
        `Preencha os campos obrigatórios: ${missingVariables.join(", ")}`,
      );
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate AI generation progress
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      // Replace variables in prompt
      let finalPrompt = selectedTemplate.prompt;
      Object.entries(variables).forEach(([key, value]) => {
        finalPrompt = finalPrompt.replace(new RegExp(`{${key}}`, "g"), value);
      });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock generated content
      const mockContent = `# ${selectedTemplate.name}

## Dados do Processo
${Object.entries(variables)
  .map(
    ([key, value]) =>
      `**${selectedTemplate.variables.find((v) => v.name === key)?.label}:** ${value}`,
  )
  .join("\n")}

## Documento Gerado

[CONTEÚDO GERADO PELA IA]

Esta é uma simulação do conteúdo que seria gerado pela IA baseado no template "${selectedTemplate.name}" e nas variáveis fornecidas.

Em um sistema real, aqui seria exibido o documento jurídico completo gerado pelo modelo de linguagem, formatado adequadamente e pronto para revisão e uso.

**Observações importantes:**
- Este conteúdo deve ser sempre revisado por um profissional jurídico
- Adapte o texto conforme as especificidades do caso
- Verifique a jurisprudência mais recente sobre o tema

---
*Gerado por IA em ${new Date().toLocaleString("pt-BR")}*`;

      setGeneratedContent(mockContent);
      setGenerationProgress(100);

      // Save generation
      const newGeneration: AIGeneration = {
        id: crypto.randomUUID(),
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        prompt: finalPrompt,
        result: mockContent,
        timestamp: new Date().toISOString(),
        userId: user?.id || "",
        userName: user?.name || "",
        tokens: Math.floor(Math.random() * 2000) + 500,
        cost: Math.random() * 5 + 1,
        quality: Math.random() * 0.3 + 0.7, // 0.7 to 1.0
        category: selectedTemplate.category,
        metadata: { variables },
      };

      const updatedGenerations = [newGeneration, ...generations];
      setGenerations(updatedGenerations);
      localStorage.setItem(
        "lawdesk-ai-generations",
        JSON.stringify(updatedGenerations),
      );

      // Log action
      await logAction(AUDIT_ACTIONS.AI_GENERATE, AUDIT_MODULES.AI, {
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        tokens: newGeneration.tokens,
        cost: newGeneration.cost,
        variables,
      });

      toast.success("Conteúdo gerado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar conteúdo");
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy to clipboard
  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Conteúdo copiado para a área de transferência");
    } catch (error) {
      toast.error("Erro ao copiar conteúdo");
    }
  };

  // Save generation
  const handleSave = (generation: AIGeneration) => {
    // In a real app, this would save to a database or file system
    toast.success("Geração salva com sucesso");
  };

  if (!hasPermission("ai", "read")) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Acesso Negado</h3>
          <p className="text-muted-foreground">
            Você não tem permissão para acessar o módulo de IA Jurídica.
          </p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              IA Jurídica Avançada
            </h1>
            <p className="text-muted-foreground">
              Assistente inteligente para geração de documentos e análises
              jurídicas
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configurações da IA</DialogTitle>
                  <DialogDescription>
                    Ajuste as configurações do modelo de IA
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Modelo de IA</Label>
                    <Select
                      value={aiSettings.model}
                      onValueChange={(value) =>
                        setAiSettings((prev) => ({ ...prev, model: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">
                          GPT-4 (Mais Avançado)
                        </SelectItem>
                        <SelectItem value="gpt-3.5">
                          GPT-3.5 (Econômico)
                        </SelectItem>
                        <SelectItem value="claude">
                          Claude (Analítico)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Criatividade: {aiSettings.temperature}</Label>
                    <Slider
                      value={[aiSettings.temperature]}
                      onValueChange={(value) =>
                        setAiSettings((prev) => ({
                          ...prev,
                          temperature: value[0],
                        }))
                      }
                      max={1}
                      min={0}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Tokens Máximos: {aiSettings.maxTokens}</Label>
                    <Slider
                      value={[aiSettings.maxTokens]}
                      onValueChange={(value) =>
                        setAiSettings((prev) => ({
                          ...prev,
                          maxTokens: value[0],
                        }))
                      }
                      max={4000}
                      min={100}
                      step={100}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={aiSettings.autoSave}
                      onCheckedChange={(checked) =>
                        setAiSettings((prev) => ({
                          ...prev,
                          autoSave: checked,
                        }))
                      }
                    />
                    <Label>Salvar automaticamente</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={aiSettings.qualityCheck}
                      onCheckedChange={(checked) =>
                        setAiSettings((prev) => ({
                          ...prev,
                          qualityCheck: checked,
                        }))
                      }
                    />
                    <Label>Verificação de qualidade</Label>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Novo Template
            </Button>
          </div>
        </div>

        {/* AI Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Gerações Hoje</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <Sparkles className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tokens Usados</p>
                  <p className="text-2xl font-bold">12.5K</p>
                </div>
                <Cpu className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Economia</p>
                  <p className="text-2xl font-bold">R$ 450</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Qualidade Média
                  </p>
                  <p className="text-2xl font-bold">94%</p>
                </div>
                <Star className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="generator">Gerador</TabsTrigger>
            <TabsTrigger value="analysis">Análise</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          {/* Document Generator */}
          <TabsContent value="generator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Template Selection */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Templates Disponíveis
                  </CardTitle>
                  <div className="flex flex-col gap-2">
                    <Input
                      placeholder="Buscar templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-8"
                    />
                    <div className="flex gap-2">
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          <SelectItem value="Petições">Petições</SelectItem>
                          <SelectItem value="Contestações">
                            Contestações
                          </SelectItem>
                          <SelectItem value="Contratos">Contratos</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant={showFavorites ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowFavorites(!showFavorites)}
                      >
                        <Star className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-2">
                      {filteredTemplates.map((template) => (
                        <motion.div
                          key={template.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all ${
                              selectedTemplate?.id === template.id
                                ? "ring-2 ring-primary bg-accent"
                                : "hover:bg-accent"
                            }`}
                            onClick={() => handleTemplateSelect(template)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-sm leading-tight">
                                  {template.name}
                                </h4>
                                {template.favorite && (
                                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                {template.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex gap-1">
                                  <Badge variant="outline" className="text-xs">
                                    {template.area}
                                  </Badge>
                                  <Badge
                                    variant={
                                      template.complexity === "alta"
                                        ? "destructive"
                                        : template.complexity === "media"
                                          ? "default"
                                          : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {template.complexity}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {template.estimatedTime}min
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Template Configuration */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    {selectedTemplate
                      ? selectedTemplate.name
                      : "Selecione um Template"}
                  </CardTitle>
                  {selectedTemplate && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {selectedTemplate.category}
                      </Badge>
                      <Badge variant="outline">{selectedTemplate.area}</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3" />
                        {selectedTemplate.rating}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {selectedTemplate.usage} usos
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {selectedTemplate ? (
                    <div className="space-y-4">
                      {/* Variables */}
                      <div className="space-y-3">
                        {selectedTemplate.variables.map((variable) => (
                          <div key={variable.name}>
                            <Label
                              htmlFor={variable.name}
                              className="text-sm font-medium"
                            >
                              {variable.label}
                              {variable.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </Label>
                            {variable.type === "select" ? (
                              <Select
                                value={variables[variable.name] || ""}
                                onValueChange={(value) =>
                                  handleVariableChange(variable.name, value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={`Selecione ${variable.label.toLowerCase()}`}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {variable.options?.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : variable.type === "text" ? (
                              <Textarea
                                id={variable.name}
                                placeholder={`Digite ${variable.label.toLowerCase()}`}
                                value={variables[variable.name] || ""}
                                onChange={(e) =>
                                  handleVariableChange(
                                    variable.name,
                                    e.target.value,
                                  )
                                }
                                rows={3}
                              />
                            ) : (
                              <Input
                                id={variable.name}
                                type={variable.type}
                                placeholder={`Digite ${variable.label.toLowerCase()}`}
                                value={variables[variable.name] || ""}
                                onChange={(e) =>
                                  handleVariableChange(
                                    variable.name,
                                    e.target.value,
                                  )
                                }
                              />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Generation */}
                      <div className="space-y-4">
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Pronto para gerar?</p>
                            <p className="text-sm text-muted-foreground">
                              Tempo estimado: {selectedTemplate.estimatedTime}{" "}
                              minutos
                            </p>
                          </div>
                          <Button
                            onClick={handleGenerate}
                            disabled={
                              isGenerating || !hasPermission("ai", "write")
                            }
                            className="min-w-32"
                          >
                            {isGenerating ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Gerando...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Gerar
                              </>
                            )}
                          </Button>
                        </div>

                        {isGenerating && (
                          <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span>Progresso da geração</span>
                              <span>{Math.round(generationProgress)}%</span>
                            </div>
                            <Progress
                              value={generationProgress}
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Selecione um template para começar a gerar conteúdo</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Generated Content */}
            {generatedContent && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Conteúdo Gerado
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(generatedContent)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Compartilhar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="whitespace-pre-wrap font-mono text-sm">
                      {generatedContent}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Document Analysis */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="text-center py-12">
              <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">
                Análise de Documentos
              </h3>
              <p className="text-muted-foreground mb-4">
                Upload documentos para análise automática com IA
              </p>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Fazer Upload
              </Button>
            </div>
          </TabsContent>

          {/* Generation History */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Histórico de Gerações
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma geração encontrada</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {generations.map((generation) => (
                      <Card key={generation.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium">
                                {generation.templateName}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(generation.timestamp).toLocaleString(
                                  "pt-BR",
                                )}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {generation.category}
                              </Badge>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Cpu className="h-3 w-3" />
                                {generation.tokens}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Por: {generation.userName}</span>
                              <span>
                                Custo: R$ {generation.cost.toFixed(2)}
                              </span>
                              <span>
                                Qualidade:{" "}
                                {Math.round(generation.quality * 100)}%
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3 mr-1" />
                                Ver
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopy(generation.result)}
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copiar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Template Management */}
          <TabsContent value="templates" className="space-y-6">
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">
                Gerenciamento de Templates
              </h3>
              <p className="text-muted-foreground mb-4">
                Crie e gerencie templates personalizados para sua prática
                jurídica
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Criar Template
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
