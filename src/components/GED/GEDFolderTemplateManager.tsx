import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen,
  Plus,
  Edit3,
  Copy,
  Trash2,
  Save,
  X,
  Eye,
  Users,
  Building2,
  Scale,
  FileText,
  DollarSign,
  BookOpen,
  Briefcase,
  Home,
  Settings,
  Star,
  Zap,
  Crown,
  Target,
  Layers,
  TreePine,
  Workflow,
  Template,
  Magic,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderPlus,
  Download,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";

interface FolderTemplateNode {
  id: string;
  name: string;
  icon: string;
  description?: string;
  children?: FolderTemplateNode[];
  metadata?: {
    autoCreate?: boolean;
    clientVisible?: boolean;
    permissions?: string[];
    tags?: string[];
  };
}

interface FolderTemplate {
  id: string;
  name: string;
  description: string;
  category: "client" | "process" | "contract" | "custom";
  type: "pessoa_fisica" | "pessoa_juridica" | "both";
  structure: FolderTemplateNode[];
  isDefault: boolean;
  isSystem: boolean;
  createdBy: string;
  createdAt: string;
  usageCount: number;
  tags: string[];
}

interface TemplateManagerProps {
  onTemplateSelect: (template: FolderTemplate) => void;
  onTemplateApply: (templateId: string, clientId: string) => void;
  className?: string;
}

const systemTemplates: FolderTemplate[] = [
  {
    id: "template_client_standard",
    name: "Cliente Padrão",
    description: "Estrutura básica para qualquer tipo de cliente",
    category: "client",
    type: "both",
    isDefault: true,
    isSystem: true,
    createdBy: "Sistema",
    createdAt: "2024-01-01T00:00:00Z",
    usageCount: 1250,
    tags: ["padrão", "básico", "geral"],
    structure: [
      {
        id: "processos",
        name: "Processos",
        icon: "⚖️",
        description: "Processos judiciais e administrativos",
        metadata: { autoCreate: true, clientVisible: true },
        children: [
          {
            id: "processos_civel",
            name: "Cível",
            icon: "🏛️",
            metadata: { autoCreate: false },
          },
          {
            id: "processos_trabalhista",
            name: "Trabalhista",
            icon: "👥",
            metadata: { autoCreate: false },
          },
          {
            id: "processos_criminal",
            name: "Criminal",
            icon: "🚔",
            metadata: { autoCreate: false },
          },
        ],
      },
      {
        id: "contratos",
        name: "Contratos",
        icon: "📝",
        description: "Contratos e acordos",
        metadata: { autoCreate: true, clientVisible: true },
      },
      {
        id: "financeiro",
        name: "Financeiro",
        icon: "💰",
        description: "Documentos financeiros",
        metadata: { autoCreate: true, clientVisible: false },
        children: [
          {
            id: "financeiro_honorarios",
            name: "Honorários",
            icon: "💳",
            metadata: { autoCreate: true },
          },
          {
            id: "financeiro_despesas",
            name: "Despesas",
            icon: "🧾",
            metadata: { autoCreate: true },
          },
        ],
      },
      {
        id: "documentos",
        name: "Documentos Pessoais",
        icon: "👤",
        description: "Documentos de identificação",
        metadata: { autoCreate: true, clientVisible: false },
      },
      {
        id: "estante",
        name: "Estante Digital",
        icon: "📚",
        description: "Flipbooks e materiais de estudo",
        metadata: { autoCreate: true, clientVisible: true },
      },
    ],
  },
  {
    id: "template_process_civil",
    name: "Processo Cível Completo",
    description: "Estrutura detalhada para processos cíveis",
    category: "process",
    type: "both",
    isDefault: false,
    isSystem: true,
    createdBy: "Sistema",
    createdAt: "2024-01-01T00:00:00Z",
    usageCount: 890,
    tags: ["cível", "processo", "completo"],
    structure: [
      {
        id: "inicial",
        name: "Petição Inicial",
        icon: "📋",
        description: "Peça inaugural do processo",
        metadata: { autoCreate: true, clientVisible: true },
        children: [
          { id: "inicial_principal", name: "Petição Principal", icon: "📄" },
          { id: "inicial_documentos", name: "Documentos", icon: "📎" },
          { id: "inicial_procuracao", name: "Procuração", icon: "✍️" },
        ],
      },
      {
        id: "contestacao",
        name: "Contestação",
        icon: "🛡️",
        description: "Defesa do réu",
        metadata: { autoCreate: false, clientVisible: true },
      },
      {
        id: "provas",
        name: "Provas",
        icon: "🔍",
        description: "Documentos probatórios",
        metadata: { autoCreate: true, clientVisible: true },
        children: [
          { id: "provas_documentais", name: "Provas Documentais", icon: "📋" },
          { id: "provas_periciais", name: "Perícias", icon: "🔬" },
          { id: "provas_testemunhais", name: "Testemunhas", icon: "👥" },
        ],
      },
      {
        id: "audiencias",
        name: "Audiências",
        icon: "🎙️",
        description: "Atas e gravações",
        metadata: { autoCreate: true, clientVisible: true },
      },
      {
        id: "sentenca",
        name: "Sentença",
        icon: "⚖️",
        description: "Decisões judiciais",
        metadata: { autoCreate: false, clientVisible: true },
      },
      {
        id: "recursos",
        name: "Recursos",
        icon: "📤",
        description: "Recursos e contrarrazões",
        metadata: { autoCreate: false, clientVisible: true },
      },
    ],
  },
  {
    id: "template_process_trabalhista",
    name: "Processo Trabalhista",
    description: "Estrutura específica para processos trabalhistas",
    category: "process",
    type: "both",
    isDefault: false,
    isSystem: true,
    createdBy: "Sistema",
    createdAt: "2024-01-01T00:00:00Z",
    usageCount: 654,
    tags: ["trabalhista", "processo", "CLT"],
    structure: [
      {
        id: "reclamacao",
        name: "Reclamação Trabalhista",
        icon: "📋",
        description: "Petição inicial trabalhista",
        metadata: { autoCreate: true, clientVisible: true },
      },
      {
        id: "defesa",
        name: "Defesa",
        icon: "🛡️",
        description: "Contestação da empresa",
        metadata: { autoCreate: false, clientVisible: true },
      },
      {
        id: "documentos_trabalhistas",
        name: "Documentos Trabalhistas",
        icon: "📄",
        description: "CTPS, contratos, holerites",
        metadata: { autoCreate: true, clientVisible: false },
        children: [
          { id: "ctps", name: "CTPS", icon: "📘" },
          {
            id: "contratos_trabalho",
            name: "Contratos de Trabalho",
            icon: "📝",
          },
          { id: "holerites", name: "Holerites", icon: "💰" },
          { id: "rescisao", name: "Rescisão", icon: "📋" },
        ],
      },
      {
        id: "pericias",
        name: "Perícias",
        icon: "🔬",
        description: "Laudos e assistente técnico",
        metadata: { autoCreate: false, clientVisible: true },
      },
      {
        id: "acordos",
        name: "Acordos",
        icon: "🤝",
        description: "Propostas e termos de acordo",
        metadata: { autoCreate: false, clientVisible: true },
      },
    ],
  },
  {
    id: "template_contract_complete",
    name: "Contrato Empresarial Completo",
    description: "Gestão completa de contratos empresariais",
    category: "contract",
    type: "pessoa_juridica",
    isDefault: false,
    isSystem: true,
    createdBy: "Sistema",
    createdAt: "2024-01-01T00:00:00Z",
    usageCount: 432,
    tags: ["contrato", "empresarial", "completo"],
    structure: [
      {
        id: "minuta",
        name: "Minuta Original",
        icon: "📝",
        description: "Versão original do contrato",
        metadata: { autoCreate: true, clientVisible: true },
      },
      {
        id: "negociacao",
        name: "Negociação",
        icon: "💬",
        description: "E-mails e comunicações",
        metadata: { autoCreate: true, clientVisible: false },
      },
      {
        id: "aditivos",
        name: "Aditivos",
        icon: "➕",
        description: "Termos aditivos e alterações",
        metadata: { autoCreate: false, clientVisible: true },
      },
      {
        id: "garantias",
        name: "Garantias",
        icon: "🛡️",
        description: "Seguros e garantias",
        metadata: { autoCreate: false, clientVisible: true },
      },
      {
        id: "execucao",
        name: "Execução",
        icon: "⚡",
        description: "Documentos de execução",
        metadata: { autoCreate: true, clientVisible: false },
        children: [
          { id: "cronograma", name: "Cronograma", icon: "📅" },
          { id: "entregas", name: "Entregas", icon: "📦" },
          { id: "medicoes", name: "Medições", icon: "📏" },
        ],
      },
      {
        id: "pagamentos",
        name: "Pagamentos",
        icon: "💰",
        description: "Faturas e comprovantes",
        metadata: { autoCreate: true, clientVisible: false },
      },
    ],
  },
];

export function GEDFolderTemplateManager({
  onTemplateSelect,
  onTemplateApply,
  className = "",
}: TemplateManagerProps) {
  const [templates, setTemplates] = useState<FolderTemplate[]>(systemTemplates);
  const [customTemplates, setCustomTemplates] = useState<FolderTemplate[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<FolderTemplate | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newTemplate, setNewTemplate] = useState<Partial<FolderTemplate>>({
    name: "",
    description: "",
    category: "custom",
    type: "both",
    tags: [],
    structure: [],
  });

  // Carregar templates personalizados
  useEffect(() => {
    const saved = localStorage.getItem("lawdesk_ged_custom_templates");
    if (saved) {
      setCustomTemplates(JSON.parse(saved));
    }
  }, []);

  const allTemplates = [...templates, ...customTemplates];

  const filteredTemplates = allTemplates.filter((template) => {
    const matchesSearch =
      searchQuery === "" ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    const matchesType =
      selectedType === "all" ||
      template.type === selectedType ||
      template.type === "both";

    return matchesSearch && matchesCategory && matchesType;
  });

  const saveCustomTemplate = () => {
    if (!newTemplate.name || !newTemplate.description) {
      toast.error("Nome e descrição são obrigatórios");
      return;
    }

    const template: FolderTemplate = {
      id: `template_custom_${Date.now()}`,
      name: newTemplate.name,
      description: newTemplate.description,
      category: newTemplate.category as any,
      type: newTemplate.type as any,
      structure: newTemplate.structure || [],
      isDefault: false,
      isSystem: false,
      createdBy: "Usuário",
      createdAt: new Date().toISOString(),
      usageCount: 0,
      tags: newTemplate.tags || [],
    };

    const updated = [...customTemplates, template];
    setCustomTemplates(updated);
    localStorage.setItem(
      "lawdesk_ged_custom_templates",
      JSON.stringify(updated),
    );

    toast.success("Template criado com sucesso!");
    setCreateDialogOpen(false);
    setNewTemplate({
      name: "",
      description: "",
      category: "custom",
      type: "both",
      tags: [],
      structure: [],
    });
  };

  const duplicateTemplate = (template: FolderTemplate) => {
    const duplicated: FolderTemplate = {
      ...template,
      id: `template_custom_${Date.now()}`,
      name: `${template.name} (Cópia)`,
      isDefault: false,
      isSystem: false,
      createdBy: "Usuário",
      createdAt: new Date().toISOString(),
      usageCount: 0,
    };

    const updated = [...customTemplates, duplicated];
    setCustomTemplates(updated);
    localStorage.setItem(
      "lawdesk_ged_custom_templates",
      JSON.stringify(updated),
    );

    toast.success("Template duplicado com sucesso!");
  };

  const deleteTemplate = (templateId: string) => {
    const updated = customTemplates.filter((t) => t.id !== templateId);
    setCustomTemplates(updated);
    localStorage.setItem(
      "lawdesk_ged_custom_templates",
      JSON.stringify(updated),
    );

    toast.success("Template excluído com sucesso!");
  };

  const exportTemplate = (template: FolderTemplate) => {
    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `template_${template.name.replace(/\s+/g, "_")}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "client":
        return Users;
      case "process":
        return Scale;
      case "contract":
        return FileText;
      case "custom":
        return Settings;
      default:
        return Folder;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "client":
        return "text-blue-600 bg-blue-50";
      case "process":
        return "text-green-600 bg-green-50";
      case "contract":
        return "text-purple-600 bg-purple-50";
      case "custom":
        return "text-orange-600 bg-orange-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pessoa_fisica":
        return Users;
      case "pessoa_juridica":
        return Building2;
      case "both":
        return Home;
      default:
        return Folder;
    }
  };

  const FolderTreePreview = ({
    structure,
  }: {
    structure: FolderTemplateNode[];
  }) => {
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

    const toggleNode = (nodeId: string) => {
      const newExpanded = new Set(expandedNodes);
      if (newExpanded.has(nodeId)) {
        newExpanded.delete(nodeId);
      } else {
        newExpanded.add(nodeId);
      }
      setExpandedNodes(newExpanded);
    };

    const renderNode = (node: FolderTemplateNode, level: number = 0) => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedNodes.has(node.id);

      return (
        <div key={node.id} className="space-y-1">
          <div
            className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 cursor-pointer"
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={() => hasChildren && toggleNode(node.id)}
          >
            {hasChildren && (
              <Button variant="ghost" size="sm" className="p-0 h-4 w-4">
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            )}
            {!hasChildren && <div className="w-4" />}

            <span className="text-base">{node.icon}</span>
            <span className="text-sm font-medium">{node.name}</span>

            {node.metadata?.autoCreate && (
              <Badge variant="secondary" className="text-xs">
                Auto
              </Badge>
            )}
            {node.metadata?.clientVisible && (
              <Eye className="h-3 w-3 text-green-600" />
            )}
          </div>

          {hasChildren && isExpanded && (
            <div>
              {node.children!.map((child) => renderNode(child, level + 1))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="max-h-48 overflow-y-auto border rounded-lg p-2 bg-muted/20">
        {structure.map((node) => renderNode(node))}
      </div>
    );
  };

  const TemplateCard = ({ template }: { template: FolderTemplate }) => {
    const CategoryIcon = getCategoryIcon(template.category);
    const TypeIcon = getTypeIcon(template.type);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="group"
      >
        <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-3 rounded-lg ${getCategoryColor(template.category)}`}
                >
                  <CategoryIcon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-base flex items-center space-x-2">
                    <span>{template.name}</span>
                    {template.isDefault && (
                      <Star className="h-4 w-4 text-amber-500 fill-current" />
                    )}
                    {template.isSystem && (
                      <Crown className="h-4 w-4 text-purple-500" />
                    )}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <TypeIcon className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {template.type === "both"
                          ? "Ambos"
                          : template.type === "pessoa_fisica"
                            ? "PF"
                            : "PJ"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center space-x-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTemplateSelect(template);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Visualizar estrutura</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateTemplate(template);
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Duplicar template</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          exportTemplate(template);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Exportar template</TooltipContent>
                  </Tooltip>

                  {!template.isSystem && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTemplate(template.id);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Excluir template</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {template.description}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estrutura:</span>
                <span className="font-medium">
                  {template.structure.length} pasta(s)
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Usado:</span>
                <span className="font-medium">{template.usageCount}x</span>
              </div>

              {template.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <Button
                className="w-full mt-3"
                onClick={() => onTemplateSelect(template)}
              >
                <Zap className="h-4 w-4 mr-2" />
                Usar Template
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <TooltipProvider>
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <TreePine className="h-6 w-6 text-green-600" />
              <span>Templates de Estruturas</span>
            </h2>
            <p className="text-muted-foreground">
              Modelos pré-configurados para criação automática de pastas
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-600 to-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Criar Novo Template</DialogTitle>
                  <DialogDescription>
                    Configure um modelo reutilizável de estrutura de pastas
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome do Template</Label>
                      <Input
                        value={newTemplate.name || ""}
                        onChange={(e) =>
                          setNewTemplate((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Ex: Processo Criminal Completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Select
                        value={newTemplate.category}
                        onValueChange={(value) =>
                          setNewTemplate((prev) => ({
                            ...prev,
                            category: value as any,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="client">Cliente</SelectItem>
                          <SelectItem value="process">Processo</SelectItem>
                          <SelectItem value="contract">Contrato</SelectItem>
                          <SelectItem value="custom">Personalizado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea
                      value={newTemplate.description || ""}
                      onChange={(e) =>
                        setNewTemplate((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Descreva quando e como usar este template..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Cliente</Label>
                    <Select
                      value={newTemplate.type}
                      onValueChange={(value) =>
                        setNewTemplate((prev) => ({
                          ...prev,
                          type: value as any,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pessoa_fisica">
                          Pessoa Física
                        </SelectItem>
                        <SelectItem value="pessoa_juridica">
                          Pessoa Jurídica
                        </SelectItem>
                        <SelectItem value="both">Ambos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setCreateDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={saveCustomTemplate}>
                    <Save className="h-4 w-4 mr-2" />
                    Criar Template
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <Input
              placeholder="Buscar templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="client">Cliente</SelectItem>
              <SelectItem value="process">Processo</SelectItem>
              <SelectItem value="contract">Contrato</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pessoa_fisica">Pessoa Física</SelectItem>
              <SelectItem value="pessoa_juridica">Pessoa Jurídica</SelectItem>
              <SelectItem value="both">Ambos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <TreePine className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Nenhum template encontrado
            </h3>
            <p className="text-muted-foreground mb-6">
              Ajuste os filtros ou crie um novo template personalizado
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Template
            </Button>
          </div>
        )}

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Estatísticas de Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {templates.length}
                </div>
                <div className="text-sm text-muted-foreground">Sistema</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {customTemplates.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Personalizados
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {allTemplates.reduce((sum, t) => sum + t.usageCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total de usos
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {allTemplates.reduce((sum, t) => sum + t.structure.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Pastas totais
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
