import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Scissors,
  Merge,
  Compress,
  Lock,
  Unlock,
  RotateCw,
  Download,
  Upload,
  Layers,
  SplitSquareHorizontal,
  Shield,
  Key,
  Zap,
  Sparkles,
  Image,
  FileImage,
  FileSpreadsheet,
  Crown,
  AlertTriangle,
  CheckCircle,
  Settings,
  X,
  Plus,
  Trash2,
  Move,
  Eye,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
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
import { toast } from "sonner";

interface PDFToolsProps {
  file: {
    id: string;
    name: string;
    type: string;
    size: number;
    pages?: number;
  };
  userPlan: "free" | "pro" | "premium";
  onToolComplete: (result: any) => void;
  className?: string;
}

interface PDFTool {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  requiredPlan: "free" | "pro" | "premium";
  limits: {
    free: string;
    pro: string;
    premium: string;
  };
}

const pdfTools: PDFTool[] = [
  {
    id: "merge",
    name: "Mesclar PDFs",
    description: "Combinar múltiplos PDFs em um único documento",
    icon: Merge,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    requiredPlan: "free",
    limits: {
      free: "Até 2 arquivos",
      pro: "Até 10 arquivos",
      premium: "Ilimitado",
    },
  },
  {
    id: "split",
    name: "Dividir PDF",
    description: "Separar páginas ou intervalos em arquivos distintos",
    icon: Scissors,
    color: "text-green-600",
    bgColor: "bg-green-50",
    requiredPlan: "free",
    limits: {
      free: "Até 10 páginas",
      pro: "Até 100 páginas",
      premium: "Ilimitado",
    },
  },
  {
    id: "compress",
    name: "Comprimir PDF",
    description: "Reduzir tamanho mantendo qualidade",
    icon: Compress,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    requiredPlan: "pro",
    limits: {
      free: "Não disponível",
      pro: "Até 50MB",
      premium: "Ilimitado",
    },
  },
  {
    id: "protect",
    name: "Proteger com Senha",
    description: "Adicionar senha e criptografia ao PDF",
    icon: Lock,
    color: "text-red-600",
    bgColor: "bg-red-50",
    requiredPlan: "pro",
    limits: {
      free: "Não disponível",
      pro: "Criptografia básica",
      premium: "Criptografia avançada",
    },
  },
  {
    id: "unlock",
    name: "Remover Senha",
    description: "Remover proteção de PDFs com senha",
    icon: Unlock,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    requiredPlan: "pro",
    limits: {
      free: "Não disponível",
      pro: "Senhas básicas",
      premium: "Todas as proteções",
    },
  },
  {
    id: "extract",
    name: "Extrair Páginas",
    description: "Extrair páginas específicas para novo PDF",
    icon: Layers,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    requiredPlan: "free",
    limits: {
      free: "Até 5 páginas",
      pro: "Até 50 páginas",
      premium: "Ilimitado",
    },
  },
  {
    id: "rotate",
    name: "Girar Páginas",
    description: "Rotacionar páginas em 90°, 180° ou 270°",
    icon: RotateCw,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    requiredPlan: "free",
    limits: {
      free: "Todas as páginas",
      pro: "Páginas específicas",
      premium: "Rotação avançada",
    },
  },
  {
    id: "convert",
    name: "Converter Formato",
    description: "PDF ↔ DOCX, XLSX, JPG, PNG",
    icon: FileImage,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    requiredPlan: "pro",
    limits: {
      free: "Não disponível",
      pro: "Formatos básicos",
      premium: "Todos os formatos",
    },
  },
  {
    id: "sign",
    name: "Assinatura Digital",
    description: "Assinar digitalmente com certificado",
    icon: Shield,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    requiredPlan: "premium",
    limits: {
      free: "Não disponível",
      pro: "Não disponível",
      premium: "Certificado A1/A3",
    },
  },
];

export function GEDPDFTools({
  file,
  userPlan,
  onToolComplete,
  className = "",
}: PDFToolsProps) {
  const [selectedTool, setSelectedTool] = useState<PDFTool | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toolDialogOpen, setToolDialogOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [toolSettings, setToolSettings] = useState<any>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const canUseTool = (tool: PDFTool) => {
    const planPriority = { free: 0, pro: 1, premium: 2 };
    return planPriority[userPlan] >= planPriority[tool.requiredPlan];
  };

  const getToolLimit = (tool: PDFTool) => {
    return tool.limits[userPlan];
  };

  const handleToolSelect = (tool: PDFTool) => {
    if (!canUseTool(tool)) {
      toast.error(
        `Esta ferramenta requer plano ${tool.requiredPlan.toUpperCase()}`,
      );
      return;
    }

    setSelectedTool(tool);
    setToolDialogOpen(true);
    setToolSettings({});
    setUploadedFiles([]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const processTool = async () => {
    if (!selectedTool) return;

    setProcessing(true);
    setProgress(0);

    try {
      // Simular processamento com progresso
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setProgress(i);
      }

      // Simular resultado baseado na ferramenta
      const result = await simulateToolProcessing(
        selectedTool,
        file,
        uploadedFiles,
        toolSettings,
      );

      onToolComplete(result);
      toast.success(`${selectedTool.name} concluído com sucesso!`);
      setToolDialogOpen(false);
    } catch (error) {
      toast.error(`Erro ao processar: ${error}`);
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  const simulateToolProcessing = async (
    tool: PDFTool,
    originalFile: any,
    additionalFiles: File[],
    settings: any,
  ) => {
    // Simular diferentes resultados baseados na ferramenta
    switch (tool.id) {
      case "merge":
        return {
          type: "merge",
          originalFile: originalFile.name,
          additionalFiles: additionalFiles.map((f) => f.name),
          resultFile: `merged_${Date.now()}.pdf`,
          pages: (originalFile.pages || 10) + additionalFiles.length * 5,
        };

      case "split":
        return {
          type: "split",
          originalFile: originalFile.name,
          splitType: settings.splitType || "pages",
          resultFiles:
            settings.pageRanges?.map(
              (range: string, index: number) =>
                `${originalFile.name.replace(".pdf", "")}_part${index + 1}.pdf`,
            ) || [],
        };

      case "compress":
        return {
          type: "compress",
          originalFile: originalFile.name,
          originalSize: originalFile.size,
          compressedSize: Math.floor(originalFile.size * 0.6),
          compressionRatio: "40%",
          quality: settings.quality || "balanced",
        };

      case "protect":
        return {
          type: "protect",
          originalFile: originalFile.name,
          protectedFile: `protected_${originalFile.name}`,
          encryption: settings.encryption || "AES-256",
          permissions: settings.permissions || ["print", "copy"],
        };

      case "extract":
        return {
          type: "extract",
          originalFile: originalFile.name,
          extractedPages: settings.selectedPages || [1, 2, 3],
          resultFile: `extracted_${originalFile.name}`,
        };

      case "convert":
        return {
          type: "convert",
          originalFile: originalFile.name,
          targetFormat: settings.targetFormat || "docx",
          resultFile: `converted_${originalFile.name.replace(".pdf", "")}.${settings.targetFormat}`,
        };

      default:
        return {
          type: tool.id,
          originalFile: originalFile.name,
          processed: true,
        };
    }
  };

  const ToolCard = ({ tool }: { tool: PDFTool }) => {
    const Icon = tool.icon;
    const canUse = canUseTool(tool);

    return (
      <motion.div
        whileHover={{ y: canUse ? -2 : 0, scale: canUse ? 1.02 : 1 }}
        whileTap={{ scale: canUse ? 0.98 : 1 }}
      >
        <Card
          className={`cursor-pointer transition-all duration-200 ${
            canUse
              ? "hover:shadow-lg border-gray-200"
              : "opacity-60 cursor-not-allowed border-gray-100"
          }`}
          onClick={() => handleToolSelect(tool)}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div
                className={`p-3 rounded-lg ${tool.bgColor} ${canUse ? "" : "grayscale"}`}
              >
                <Icon className={`h-6 w-6 ${tool.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-sm">{tool.name}</h3>
                  {!canUse && <Crown className="h-4 w-4 text-amber-500" />}
                </div>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {tool.description}
                </p>
                <div className="flex items-center justify-between">
                  <Badge
                    variant={canUse ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {tool.requiredPlan.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {getToolLimit(tool)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const MergeToolSettings = () => (
    <div className="space-y-4">
      <div>
        <Label>Arquivos para mesclar</Label>
        <div className="mt-2">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar PDFs
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <Label>Arquivos selecionados ({uploadedFiles.length + 1})</Label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">{file.name}</span>
              <Badge variant="secondary" className="text-xs">
                Original
              </Badge>
            </div>
            {uploadedFiles.map((f, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-2 bg-gray-50 rounded"
              >
                <FileText className="h-4 w-4 text-gray-600" />
                <span className="text-sm">{f.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setUploadedFiles((prev) =>
                      prev.filter((_, i) => i !== index),
                    )
                  }
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const SplitToolSettings = () => (
    <div className="space-y-4">
      <div>
        <Label>Tipo de divisão</Label>
        <Select
          value={toolSettings.splitType || "pages"}
          onValueChange={(value) =>
            setToolSettings((prev) => ({ ...prev, splitType: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pages">Por páginas específicas</SelectItem>
            <SelectItem value="ranges">Por intervalos</SelectItem>
            <SelectItem value="equal">Dividir igualmente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {toolSettings.splitType === "pages" && (
        <div>
          <Label>Páginas a extrair (ex: 1,3,5-8)</Label>
          <Input
            placeholder="1,3,5-8"
            value={toolSettings.pageNumbers || ""}
            onChange={(e) =>
              setToolSettings((prev) => ({
                ...prev,
                pageNumbers: e.target.value,
              }))
            }
          />
        </div>
      )}

      {toolSettings.splitType === "equal" && (
        <div>
          <Label>Número de partes</Label>
          <Input
            type="number"
            min="2"
            max="10"
            value={toolSettings.parts || 2}
            onChange={(e) =>
              setToolSettings((prev) => ({
                ...prev,
                parts: parseInt(e.target.value),
              }))
            }
          />
        </div>
      )}
    </div>
  );

  const CompressToolSettings = () => (
    <div className="space-y-4">
      <div>
        <Label>Qualidade da compressão</Label>
        <Select
          value={toolSettings.quality || "balanced"}
          onValueChange={(value) =>
            setToolSettings((prev) => ({ ...prev, quality: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">
              Baixa qualidade (máxima compressão)
            </SelectItem>
            <SelectItem value="balanced">Qualidade balanceada</SelectItem>
            <SelectItem value="high">
              Alta qualidade (compressão mínima)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2 text-blue-800">
          <Zap className="h-4 w-4" />
          <span className="text-sm font-medium">Estimativa</span>
        </div>
        <div className="text-sm text-blue-700 mt-1">
          Tamanho atual: {(file.size / 1024 / 1024).toFixed(2)} MB
          <br />
          Tamanho estimado: {((file.size * 0.6) / 1024 / 1024).toFixed(2)} MB
          (40% menor)
        </div>
      </div>
    </div>
  );

  const ProtectToolSettings = () => (
    <div className="space-y-4">
      <div>
        <Label>Senha do documento</Label>
        <Input
          type="password"
          placeholder="Digite uma senha forte"
          value={toolSettings.password || ""}
          onChange={(e) =>
            setToolSettings((prev) => ({ ...prev, password: e.target.value }))
          }
        />
      </div>

      <div>
        <Label>Nível de criptografia</Label>
        <Select
          value={toolSettings.encryption || "AES-128"}
          onValueChange={(value) =>
            setToolSettings((prev) => ({ ...prev, encryption: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AES-128">AES-128 (Padrão)</SelectItem>
            <SelectItem value="AES-256">AES-256 (Alta segurança)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Permissões</Label>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="allow-print">Permitir impressão</Label>
            <Switch
              id="allow-print"
              checked={toolSettings.allowPrint !== false}
              onCheckedChange={(checked) =>
                setToolSettings((prev) => ({ ...prev, allowPrint: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="allow-copy">Permitir copiar texto</Label>
            <Switch
              id="allow-copy"
              checked={toolSettings.allowCopy !== false}
              onCheckedChange={(checked) =>
                setToolSettings((prev) => ({ ...prev, allowCopy: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="allow-edit">Permitir edição</Label>
            <Switch
              id="allow-edit"
              checked={toolSettings.allowEdit === true}
              onCheckedChange={(checked) =>
                setToolSettings((prev) => ({ ...prev, allowEdit: checked }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );

  const ConvertToolSettings = () => (
    <div className="space-y-4">
      <div>
        <Label>Formato de destino</Label>
        <Select
          value={toolSettings.targetFormat || "docx"}
          onValueChange={(value) =>
            setToolSettings((prev) => ({ ...prev, targetFormat: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="docx">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>Microsoft Word (.docx)</span>
              </div>
            </SelectItem>
            <SelectItem value="xlsx">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                <span>Microsoft Excel (.xlsx)</span>
              </div>
            </SelectItem>
            <SelectItem value="jpg">
              <div className="flex items-center space-x-2">
                <Image className="h-4 w-4 text-orange-600" />
                <span>Imagem JPG</span>
              </div>
            </SelectItem>
            <SelectItem value="png">
              <div className="flex items-center space-x-2">
                <Image className="h-4 w-4 text-purple-600" />
                <span>Imagem PNG</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(toolSettings.targetFormat === "jpg" ||
        toolSettings.targetFormat === "png") && (
        <div>
          <Label>Qualidade da imagem</Label>
          <Slider
            value={[toolSettings.imageQuality || 90]}
            onValueChange={(value) =>
              setToolSettings((prev) => ({ ...prev, imageQuality: value[0] }))
            }
            max={100}
            min={50}
            step={10}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>50% (menor)</span>
            <span>{toolSettings.imageQuality || 90}%</span>
            <span>100% (maior)</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderToolSettings = () => {
    if (!selectedTool) return null;

    switch (selectedTool.id) {
      case "merge":
        return <MergeToolSettings />;
      case "split":
        return <SplitToolSettings />;
      case "compress":
        return <CompressToolSettings />;
      case "protect":
        return <ProtectToolSettings />;
      case "convert":
        return <ConvertToolSettings />;
      default:
        return (
          <div className="text-center py-8">
            <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Configurações específicas para {selectedTool.name} em
              desenvolvimento
            </p>
          </div>
        );
    }
  };

  return (
    <TooltipProvider>
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span>Ferramentas PDF</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Edite e processe arquivos PDF com ferramentas profissionais
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Badge
              className={
                userPlan === "premium"
                  ? "bg-purple-600"
                  : userPlan === "pro"
                    ? "bg-blue-600"
                    : "bg-gray-600"
              }
            >
              Plano {userPlan.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* File Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-50 rounded-lg">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{file.name}</h4>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  {file.pages && <span>{file.pages} páginas</span>}
                  <span>PDF</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pdfTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {/* Plan Upgrade Notice */}
        {userPlan !== "premium" && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Crown className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-amber-800">
                    Desbloqueie mais ferramentas
                  </h4>
                  <p className="text-sm text-amber-700 mt-1">
                    {userPlan === "free"
                      ? "Upgrade para Pro ou Premium para acessar ferramentas avançadas de PDF"
                      : "Upgrade para Premium para acessar assinatura digital e recursos ilimitados"}
                  </p>
                  <Button
                    size="sm"
                    className="mt-2 bg-amber-600 hover:bg-amber-700"
                  >
                    Ver Planos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tool Dialog */}
        <Dialog open={toolDialogOpen} onOpenChange={setToolDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {selectedTool && (
                  <selectedTool.icon
                    className={`h-5 w-5 ${selectedTool.color}`}
                  />
                )}
                <span>{selectedTool?.name}</span>
              </DialogTitle>
              <DialogDescription>{selectedTool?.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Tool Settings */}
              {renderToolSettings()}

              {/* Processing Progress */}
              {processing && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Processando...</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    {progress}% concluído
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setToolDialogOpen(false)}
                disabled={processing}
              >
                Cancelar
              </Button>
              <Button
                onClick={processTool}
                disabled={
                  processing ||
                  (selectedTool?.id === "merge" && uploadedFiles.length === 0)
                }
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {processing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4" />
                    <span>Processar</span>
                  </div>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
