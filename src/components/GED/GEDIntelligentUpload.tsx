import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Image,
  Film,
  FileArchive,
  File,
  X,
  Check,
  AlertTriangle,
  Eye,
  Star,
  Users,
  Folder,
  BookOpen,
  Zap,
  Brain,
  Target,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Share2,
  Tag,
  MapPin,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  status: "pending" | "uploading" | "processing" | "success" | "error";
  progress: number;
  error?: string;

  // Configurações do arquivo
  settings: {
    isFavorite: boolean;
    isClientVisible: boolean;
    targetFolder: string;
    tags: string[];
    description: string;
    category: string;
    autoProcess: boolean;
  };

  // Processamento de IA
  aiProcessing?: {
    status: "pending" | "processing" | "completed" | "failed";
    results?: {
      documentType: string;
      extractedText: string;
      suggestedTags: string[];
      suggestedCategory: string;
      detectedDeadlines: { date: string; description: string }[];
      confidence: number;
    };
  };
}

interface FolderOption {
  id: string;
  name: string;
  path: string;
  icon: string;
  type:
    | "contratos"
    | "processos"
    | "financeiro"
    | "documentos"
    | "estante"
    | "custom";
}

interface IntelligentUploadProps {
  isOpen: boolean;
  onClose: () => void;
  currentFolder?: FolderOption;
  availableFolders: FolderOption[];
  onUploadComplete: (files: UploadFile[]) => void;
  onAIProcess?: (file: UploadFile) => Promise<any>;
  maxFileSize?: number;
  acceptedTypes?: string[];
  className?: string;
}

const predefinedTags = [
  "Contrato",
  "Petição",
  "Procuração",
  "Certidão",
  "Comprovante",
  "Recurso",
  "Sentença",
  "Despacho",
  "Intimação",
  "Mandado",
  "Urgente",
  "Confidencial",
  "Público",
  "Arquivo",
  "Rascunho",
];

const documentCategories = [
  { value: "contrato", label: "Contrato", icon: "📝" },
  { value: "peticao", label: "Petição", icon: "⚖️" },
  { value: "procuracao", label: "Procuração", icon: "✍️" },
  { value: "certidao", label: "Certidão", icon: "📋" },
  { value: "comprovante", label: "Comprovante", icon: "🧾" },
  { value: "sentenca", label: "Sentença", icon: "⚡" },
  { value: "recurso", label: "Recurso", icon: "📤" },
  { value: "estudo", label: "Material de Estudo", icon: "📚" },
  { value: "outro", label: "Outro", icon: "📄" },
];

export function GEDIntelligentUpload({
  isOpen,
  onClose,
  currentFolder,
  availableFolders,
  onUploadComplete,
  onAIProcess,
  maxFileSize = 50 * 1024 * 1024, // 50MB
  acceptedTypes = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".txt"],
  className = "",
}: IntelligentUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [globalSettings, setGlobalSettings] = useState({
    autoFavorite: false,
    autoClientVisible: false,
    defaultFolder: currentFolder?.id || "",
    autoAIProcess: true,
    batchTags: [] as string[],
  });

  const dropzoneRef = useRef<HTMLDivElement>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: "pending",
        progress: 0,
        settings: {
          isFavorite: globalSettings.autoFavorite,
          isClientVisible: globalSettings.autoClientVisible,
          targetFolder: globalSettings.defaultFolder || currentFolder?.id || "",
          tags: [...globalSettings.batchTags],
          description: "",
          category: "outro",
          autoProcess: globalSettings.autoAIProcess,
        },
      }));

      // Gerar previews para imagens
      newFiles.forEach((uploadFile) => {
        if (uploadFile.file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setUploadFiles((prev) =>
              prev.map((f) =>
                f.id === uploadFile.id
                  ? { ...f, preview: e.target?.result as string }
                  : f,
              ),
            );
          };
          reader.readAsDataURL(uploadFile.file);
        }
      });

      setUploadFiles((prev) => [...prev, ...newFiles]);

      // Auto-processar com IA se habilitado
      if (globalSettings.autoAIProcess && onAIProcess) {
        newFiles.forEach((file) => {
          if (file.settings.autoProcess) {
            processFileWithAI(file.id);
          }
        });
      }
    },
    [globalSettings, currentFolder, onAIProcess],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
        "image/*": [".jpeg", ".jpg", ".png"],
        "text/plain": [".txt"],
      },
      maxSize: maxFileSize,
      multiple: true,
    });

  const processFileWithAI = async (fileId: string) => {
    const file = uploadFiles.find((f) => f.id === fileId);
    if (!file || !onAIProcess) return;

    setUploadFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? {
              ...f,
              aiProcessing: { status: "processing" },
            }
          : f,
      ),
    );

    try {
      const results = await onAIProcess(file);

      setUploadFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                aiProcessing: { status: "completed", results },
                settings: {
                  ...f.settings,
                  tags: [...f.settings.tags, ...results.suggestedTags],
                  category: results.suggestedCategory || f.settings.category,
                },
              }
            : f,
        ),
      );

      toast.success(
        `IA processou ${file.name} com ${(results.confidence * 100).toFixed(0)}% de confiança`,
      );
    } catch (error) {
      setUploadFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                aiProcessing: { status: "failed" },
              }
            : f,
        ),
      );
      toast.error(`Erro ao processar ${file.name} com IA`);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const updateFileSettings = (
    fileId: string,
    updates: Partial<UploadFile["settings"]>,
  ) => {
    setUploadFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, settings: { ...f.settings, ...updates } } : f,
      ),
    );
  };

  const startUpload = async () => {
    if (uploadFiles.length === 0) return;

    setIsUploading(true);

    try {
      // Simular upload com progresso
      for (const file of uploadFiles) {
        setUploadFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, status: "uploading" } : f,
          ),
        );

        // Simular progresso de upload
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setUploadFiles((prev) =>
            prev.map((f) => (f.id === file.id ? { ...f, progress } : f)),
          );
        }

        // Simular processamento
        setUploadFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, status: "processing" } : f,
          ),
        );

        await new Promise((resolve) => setTimeout(resolve, 500));

        setUploadFiles((prev) =>
          prev.map((f) => (f.id === file.id ? { ...f, status: "success" } : f)),
        );
      }

      toast.success(`${uploadFiles.length} arquivo(s) enviado(s) com sucesso!`);

      // Chamar callback de conclusão
      onUploadComplete(uploadFiles);

      // Limpar lista após 2 segundos
      setTimeout(() => {
        setUploadFiles([]);
        onClose();
      }, 2000);
    } catch (error) {
      toast.error("Erro durante o upload");
      setUploadFiles((prev) =>
        prev.map((f) => ({
          ...f,
          status: "error",
          error: "Erro no upload",
        })),
      );
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return FileText;
    if (type.includes("image")) return Image;
    if (type.includes("video")) return Film;
    if (type.includes("zip") || type.includes("rar")) return FileArchive;
    return File;
  };

  const getStatusIcon = (status: UploadFile["status"]) => {
    switch (status) {
      case "pending":
        return Clock;
      case "uploading":
        return Upload;
      case "processing":
        return Zap;
      case "success":
        return CheckCircle;
      case "error":
        return AlertCircle;
      default:
        return File;
    }
  };

  const getStatusColor = (status: UploadFile["status"]) => {
    switch (status) {
      case "pending":
        return "text-gray-500";
      case "uploading":
        return "text-blue-500";
      case "processing":
        return "text-purple-500";
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const FileSettingsPanel = ({ file }: { file: UploadFile }) => (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Configurações - {file.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pasta de destino */}
        <div className="space-y-2">
          <Label>Pasta de destino</Label>
          <Select
            value={file.settings.targetFolder}
            onValueChange={(value) =>
              updateFileSettings(file.id, { targetFolder: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableFolders.map((folder) => (
                <SelectItem key={folder.id} value={folder.id}>
                  <div className="flex items-center space-x-2">
                    <span>{folder.icon}</span>
                    <span>{folder.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Categoria */}
        <div className="space-y-2">
          <Label>Categoria</Label>
          <Select
            value={file.settings.category}
            onValueChange={(value) =>
              updateFileSettings(file.id, { category: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {documentCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  <div className="flex items-center space-x-2">
                    <span>{category.icon}</span>
                    <span>{category.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-1 mb-2">
            {file.settings.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-red-100"
                onClick={() =>
                  updateFileSettings(file.id, {
                    tags: file.settings.tags.filter((t) => t !== tag),
                  })
                }
              >
                {tag} <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {predefinedTags
              .filter((tag) => !file.settings.tags.includes(tag))
              .map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs cursor-pointer hover:bg-blue-50"
                  onClick={() =>
                    updateFileSettings(file.id, {
                      tags: [...file.settings.tags, tag],
                    })
                  }
                >
                  + {tag}
                </Badge>
              ))}
          </div>
        </div>

        {/* Descrição */}
        <div className="space-y-2">
          <Label>Descrição</Label>
          <Textarea
            placeholder="Descrição opcional do documento..."
            value={file.settings.description}
            onChange={(e) =>
              updateFileSettings(file.id, { description: e.target.value })
            }
            rows={2}
          />
        </div>

        {/* Opções */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label
              htmlFor={`favorite-${file.id}`}
              className="flex items-center space-x-2"
            >
              <Star className="h-4 w-4" />
              <span>Marcar como favorito</span>
            </Label>
            <Switch
              id={`favorite-${file.id}`}
              checked={file.settings.isFavorite}
              onCheckedChange={(checked) =>
                updateFileSettings(file.id, { isFavorite: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label
              htmlFor={`visible-${file.id}`}
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Visível ao cliente</span>
            </Label>
            <Switch
              id={`visible-${file.id}`}
              checked={file.settings.isClientVisible}
              onCheckedChange={(checked) =>
                updateFileSettings(file.id, { isClientVisible: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label
              htmlFor={`ai-${file.id}`}
              className="flex items-center space-x-2"
            >
              <Brain className="h-4 w-4" />
              <span>Processar com IA</span>
            </Label>
            <Switch
              id={`ai-${file.id}`}
              checked={file.settings.autoProcess}
              onCheckedChange={(checked) =>
                updateFileSettings(file.id, { autoProcess: checked })
              }
            />
          </div>
        </div>

        {/* Resultados da IA */}
        {file.aiProcessing && (
          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">
                Análise da IA
              </span>
            </div>

            {file.aiProcessing.status === "processing" && (
              <div className="flex items-center space-x-2 text-sm text-purple-600">
                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                <span>Processando documento...</span>
              </div>
            )}

            {file.aiProcessing.status === "completed" &&
              file.aiProcessing.results && (
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Tipo identificado:</span>{" "}
                    <Badge variant="secondary">
                      {file.aiProcessing.results.documentType}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Confiança:</span>{" "}
                    <span className="text-green-600">
                      {(file.aiProcessing.results.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  {file.aiProcessing.results.suggestedTags.length > 0 && (
                    <div>
                      <span className="font-medium">Tags sugeridas:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {file.aiProcessing.results.suggestedTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {file.aiProcessing.results.detectedDeadlines.length > 0 && (
                    <div>
                      <span className="font-medium">Prazos detectados:</span>
                      <div className="space-y-1 mt-1">
                        {file.aiProcessing.results.detectedDeadlines.map(
                          (deadline, index) => (
                            <div
                              key={index}
                              className="text-xs bg-amber-50 p-2 rounded border border-amber-200"
                            >
                              <span className="font-medium">
                                {deadline.date}
                              </span>{" "}
                              - {deadline.description}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

            {file.aiProcessing.status === "failed" && (
              <div className="text-sm text-red-600">
                Erro ao processar com IA. Tente novamente.
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => processFileWithAI(file.id)}
                  className="ml-2"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Tentar novamente
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Upload Inteligente</span>
              <Badge variant="secondary">IA Integrada</Badge>
            </DialogTitle>
            <DialogDescription>
              Arraste arquivos ou clique para selecionar. A IA processará
              automaticamente os documentos.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
            {/* Área de upload */}
            <div className="lg:col-span-2 space-y-4">
              {/* Dropzone */}
              <div
                {...getRootProps()}
                ref={dropzoneRef}
                className={`
                  relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
                  ${
                    isDragActive
                      ? isDragReject
                        ? "border-red-400 bg-red-50"
                        : "border-blue-400 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }
                `}
              >
                <input {...getInputProps()} />

                <motion.div
                  animate={{
                    scale: isDragActive ? 1.05 : 1,
                    y: isDragActive ? -5 : 0,
                  }}
                  className="space-y-4"
                >
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-white" />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      {isDragActive
                        ? isDragReject
                          ? "Arquivo não suportado"
                          : "Solte os arquivos aqui"
                        : "Arraste arquivos ou clique para selecionar"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Suporte a PDF, DOC, DOCX, JPG, PNG, TXT até{" "}
                      {formatFileSize(maxFileSize)}
                    </p>
                  </div>

                  <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Brain className="h-3 w-3" />
                      <span>IA Automática</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Sparkles className="h-3 w-3" />
                      <span>Tags Inteligentes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="h-3 w-3" />
                      <span>Organização Auto</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Lista de arquivos */}
              {uploadFiles.length > 0 && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">
                      Arquivos selecionados ({uploadFiles.length})
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSettings(!showSettings)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {showSettings ? "Ocultar" : "Configurar"}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {uploadFiles.map((file, index) => {
                      const FileIcon = getFileIcon(file.type);
                      const StatusIcon = getStatusIcon(file.status);

                      return (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="p-4">
                            <div className="flex items-center space-x-4">
                              {/* Preview/Icon */}
                              <div className="relative">
                                {file.preview ? (
                                  <img
                                    src={file.preview}
                                    alt={file.name}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                    <FileIcon className="h-6 w-6 text-gray-500" />
                                  </div>
                                )}

                                {/* Status overlay */}
                                <div
                                  className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs ${
                                    file.status === "success"
                                      ? "bg-green-500"
                                      : file.status === "error"
                                        ? "bg-red-500"
                                        : file.status === "uploading"
                                          ? "bg-blue-500"
                                          : file.status === "processing"
                                            ? "bg-purple-500"
                                            : "bg-gray-500"
                                  }`}
                                >
                                  <StatusIcon className="h-3 w-3" />
                                </div>
                              </div>

                              {/* Informações do arquivo */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <h5 className="font-medium truncate">
                                    {file.name}
                                  </h5>
                                  {file.settings.isFavorite && (
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  )}
                                  {file.settings.isClientVisible && (
                                    <Eye className="h-4 w-4 text-green-500" />
                                  )}
                                </div>

                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <span>{formatFileSize(file.size)}</span>
                                  {file.settings.targetFolder && (
                                    <span className="flex items-center space-x-1">
                                      <Folder className="h-3 w-3" />
                                      <span>
                                        {
                                          availableFolders.find(
                                            (f) =>
                                              f.id ===
                                              file.settings.targetFolder,
                                          )?.name
                                        }
                                      </span>
                                    </span>
                                  )}
                                  {file.settings.tags.length > 0 && (
                                    <span className="flex items-center space-x-1">
                                      <Tag className="h-3 w-3" />
                                      <span>
                                        {file.settings.tags.length} tag(s)
                                      </span>
                                    </span>
                                  )}
                                </div>

                                {/* Progresso */}
                                {(file.status === "uploading" ||
                                  file.status === "processing") && (
                                  <div className="mt-2">
                                    <Progress
                                      value={file.progress}
                                      className="h-2"
                                    />
                                  </div>
                                )}

                                {/* Erro */}
                                {file.status === "error" && file.error && (
                                  <div className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span>{file.error}</span>
                                  </div>
                                )}
                              </div>

                              {/* Ações */}
                              <div className="flex items-center space-x-2">
                                {showSettings && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      setSelectedFileId(
                                        selectedFileId === file.id
                                          ? null
                                          : file.id,
                                      )
                                    }
                                  >
                                    <Settings className="h-4 w-4" />
                                  </Button>
                                )}

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(file.id)}
                                  disabled={isUploading}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Painel de configurações */}
            <div className="space-y-4 overflow-y-auto">
              {selectedFileId &&
                uploadFiles.find((f) => f.id === selectedFileId) && (
                  <FileSettingsPanel
                    file={uploadFiles.find((f) => f.id === selectedFileId)!}
                  />
                )}

              {!selectedFileId && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Configurações Globais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Pasta padrão</Label>
                      <Select
                        value={globalSettings.defaultFolder}
                        onValueChange={(value) =>
                          setGlobalSettings((prev) => ({
                            ...prev,
                            defaultFolder: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar pasta" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableFolders.map((folder) => (
                            <SelectItem key={folder.id} value={folder.id}>
                              <div className="flex items-center space-x-2">
                                <span>{folder.icon}</span>
                                <span>{folder.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Auto-favoritar</Label>
                        <Switch
                          checked={globalSettings.autoFavorite}
                          onCheckedChange={(checked) =>
                            setGlobalSettings((prev) => ({
                              ...prev,
                              autoFavorite: checked,
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Auto visível ao cliente</Label>
                        <Switch
                          checked={globalSettings.autoClientVisible}
                          onCheckedChange={(checked) =>
                            setGlobalSettings((prev) => ({
                              ...prev,
                              autoClientVisible: checked,
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Processar com IA</Label>
                        <Switch
                          checked={globalSettings.autoAIProcess}
                          onCheckedChange={(checked) =>
                            setGlobalSettings((prev) => ({
                              ...prev,
                              autoAIProcess: checked,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <DialogFooter>
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-muted-foreground">
                {uploadFiles.length > 0 && (
                  <span>
                    {uploadFiles.length} arquivo(s) •{" "}
                    {formatFileSize(
                      uploadFiles.reduce((sum, f) => sum + f.size, 0),
                    )}
                  </span>
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isUploading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={startUpload}
                  disabled={uploadFiles.length === 0 || isUploading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  {isUploading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Enviar {uploadFiles.length} arquivo(s)</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
