import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Save,
  Trash2,
  Copy,
  Edit3,
  FolderOpen,
  Users,
  Scale,
  FileText,
  Settings,
  ChevronRight,
  Star,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  useGEDCRMIntegration,
  FolderTemplate,
} from "@/hooks/useGEDCRMIntegration";

interface FolderItem {
  name: string;
  icon: string;
  description: string;
  subfolders?: string[];
}

interface TemplateEditorProps {
  template?: FolderTemplate;
  onSave: (template: FolderTemplate) => void;
  onCancel: () => void;
}

function TemplateEditor({ template, onSave, onCancel }: TemplateEditorProps) {
  const [name, setName] = useState(template?.name || "");
  const [description, setDescription] = useState(template?.description || "");
  const [type, setType] = useState<"client" | "process" | "contract">(
    template?.type || "client",
  );
  const [folders, setFolders] = useState<FolderItem[]>(template?.folders || []);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderIcon, setNewFolderIcon] = useState("📁");
  const [newFolderDescription, setNewFolderDescription] = useState("");

  const iconOptions = [
    "📁",
    "📄",
    "📝",
    "⚖️",
    "🏛️",
    "👤",
    "💼",
    "🔒",
    "📋",
    "📊",
    "💰",
    "📧",
    "📞",
    "🏠",
    "🚗",
    "📅",
    "⏰",
    "🎯",
    "📈",
    "🔍",
    "✅",
    "❌",
    "⚠️",
    "🔔",
    "💡",
    "🎉",
    "🏆",
    "🔧",
    "⚙️",
    "🌟",
  ];

  const addFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder: FolderItem = {
      name: newFolderName,
      icon: newFolderIcon,
      description: newFolderDescription,
      subfolders: [],
    };

    setFolders([...folders, newFolder]);
    setNewFolderName("");
    setNewFolderDescription("");
    setNewFolderIcon("📁");
  };

  const removeFolder = (index: number) => {
    setFolders(folders.filter((_, i) => i !== index));
  };

  const updateFolder = (index: number, updatedFolder: FolderItem) => {
    const updatedFolders = [...folders];
    updatedFolders[index] = updatedFolder;
    setFolders(updatedFolders);
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Nome do template é obrigatório");
      return;
    }

    if (folders.length === 0) {
      toast.error("Adicione pelo menos uma pasta ao template");
      return;
    }

    const newTemplate: FolderTemplate = {
      id: template?.id || `template_${Date.now()}`,
      name,
      description,
      type,
      folders,
    };

    onSave(newTemplate);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="template-name">Nome do Template</Label>
          <Input
            id="template-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Processo Cível Completo"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="template-type">Tipo</Label>
          <Select value={type} onValueChange={(value: any) => setType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client">Cliente</SelectItem>
              <SelectItem value="process">Processo</SelectItem>
              <SelectItem value="contract">Contrato</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="template-description">Descrição</Label>
        <Textarea
          id="template-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva quando usar este template..."
          rows={3}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="text-lg font-semibold flex items-center space-x-2">
          <FolderOpen className="h-5 w-5" />
          <span>Estrutura de Pastas</span>
        </h4>

        {/* Add New Folder */}
        <Card className="border-dashed">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <div className="space-y-2">
                <Label>Nome da Pasta</Label>
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Ex: Documentos Pessoais"
                />
              </div>
              <div className="space-y-2">
                <Label>Ícone</Label>
                <Select value={newFolderIcon} onValueChange={setNewFolderIcon}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        <span className="flex items-center space-x-2">
                          <span>{icon}</span>
                          <span>{icon}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input
                  value={newFolderDescription}
                  onChange={(e) => setNewFolderDescription(e.target.value)}
                  placeholder="Descrição opcional"
                />
              </div>
              <Button
                onClick={addFolder}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Adicionar</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Folder List */}
        <div className="space-y-3">
          {folders.map((folder, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-4 p-4 border rounded-lg bg-background"
            >
              <div className="text-2xl">{folder.icon}</div>
              <div className="flex-1">
                <div className="font-medium">{folder.name}</div>
                {folder.description && (
                  <div className="text-sm text-muted-foreground">
                    {folder.description}
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeFolder(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>

        {folders.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma pasta adicionada ainda</p>
            <p className="text-sm">Adicione pastas usando o formulário acima</p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave} className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Salvar Template</span>
        </Button>
      </div>
    </div>
  );
}

interface GEDFolderTemplatesProps {
  onApplyTemplate: (templateId: string, entityId: string) => void;
}

export function GEDFolderTemplates({
  onApplyTemplate,
}: GEDFolderTemplatesProps) {
  const { folderTemplates, saveFolderAsTemplate } = useGEDCRMIntegration();
  const [customTemplates, setCustomTemplates] = useState<FolderTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<FolderTemplate | null>(
    null,
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedEntityId, setSelectedEntityId] = useState("");

  useEffect(() => {
    loadCustomTemplates();
  }, []);

  const loadCustomTemplates = () => {
    try {
      const stored = localStorage.getItem("lawdesk-ged-templates");
      if (stored) {
        setCustomTemplates(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Erro ao carregar templates personalizados:", error);
    }
  };

  const saveTemplate = async (template: FolderTemplate) => {
    try {
      const isEditing = editingTemplate?.id === template.id;
      let updatedTemplates;

      if (isEditing) {
        updatedTemplates = customTemplates.map((t) =>
          t.id === template.id ? template : t,
        );
      } else {
        updatedTemplates = [...customTemplates, template];
      }

      setCustomTemplates(updatedTemplates);
      localStorage.setItem(
        "lawdesk-ged-templates",
        JSON.stringify(updatedTemplates),
      );

      if (!isEditing) {
        await saveFolderAsTemplate("", template.name);
      }

      toast.success(
        isEditing ? "Template atualizado!" : "Template criado com sucesso!",
      );
      setEditingTemplate(null);
      setCreateDialogOpen(false);
    } catch (error) {
      console.error("Erro ao salvar template:", error);
      toast.error("Erro ao salvar template");
    }
  };

  const deleteTemplate = (templateId: string) => {
    const updatedTemplates = customTemplates.filter((t) => t.id !== templateId);
    setCustomTemplates(updatedTemplates);
    localStorage.setItem(
      "lawdesk-ged-templates",
      JSON.stringify(updatedTemplates),
    );
    toast.success("Template excluído");
  };

  const duplicateTemplate = (template: FolderTemplate) => {
    const duplicated: FolderTemplate = {
      ...template,
      id: `template_${Date.now()}`,
      name: `${template.name} (Cópia)`,
    };
    saveTemplate(duplicated);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "client":
        return Users;
      case "process":
        return Scale;
      case "contract":
        return FileText;
      default:
        return FolderOpen;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "client":
        return "bg-blue-100 text-blue-800";
      case "process":
        return "bg-green-100 text-green-800";
      case "contract":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const allTemplates = [...folderTemplates, ...customTemplates];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Templates de Pastas</h3>
          <p className="text-sm text-muted-foreground">
            Crie estruturas automáticas para organizar documentos
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Novo Template</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? "Editar Template" : "Criar Novo Template"}
              </DialogTitle>
              <DialogDescription>
                Configure a estrutura de pastas que será criada automaticamente
              </DialogDescription>
            </DialogHeader>
            <TemplateEditor
              template={editingTemplate || undefined}
              onSave={saveTemplate}
              onCancel={() => {
                setEditingTemplate(null);
                setCreateDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allTemplates.map((template, index) => {
          const Icon = getTypeIcon(template.type);
          const isCustom = !folderTemplates.find((t) => t.id === template.id);

          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-200 group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {template.name}
                        </CardTitle>
                        <Badge
                          className={`text-xs ${getTypeBadgeColor(template.type)}`}
                        >
                          {template.type === "client" && "Cliente"}
                          {template.type === "process" && "Processo"}
                          {template.type === "contract" && "Contrato"}
                        </Badge>
                      </div>
                    </div>
                    {!isCustom && <Star className="h-4 w-4 text-amber-500" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {template.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="font-medium">
                        {template.folders.length}
                      </span>
                      <span className="text-muted-foreground"> pastas</span>
                    </div>

                    <div className="space-y-2">
                      {template.folders
                        .slice(0, 3)
                        .map((folder, folderIndex) => (
                          <div
                            key={folderIndex}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <span>{folder.icon}</span>
                            <span className="truncate">{folder.name}</span>
                          </div>
                        ))}
                      {template.folders.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{template.folders.length - 3} mais...
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          // Simulate applying template - in real app, would need entity selection
                          toast.success(
                            `Template "${template.name}" aplicado!`,
                          );
                        }}
                        className="flex-1"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Aplicar
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => duplicateTemplate(template)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>

                      {isCustom && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingTemplate(template);
                              setCreateDialogOpen(true);
                            }}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteTemplate(template.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {allTemplates.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h4 className="text-lg font-medium mb-2">
            Nenhum template encontrado
          </h4>
          <p className="text-muted-foreground mb-6">
            Crie seu primeiro template para automatizar a organização de
            documentos
          </p>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Criar Primeiro Template</span>
          </Button>
        </div>
      )}
    </div>
  );
}
