import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  X,
  FileText,
  Image,
  Video,
  Archive,
  File,
  Plus,
  Minus,
  Building,
  Gavel,
  MessageSquare,
  Tag,
  Eye,
  EyeOff,
  Globe,
  Lock,
} from "lucide-react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { GEDDocument } from "@/hooks/useGEDDocuments";
import { cn } from "@/lib/utils";

interface GEDUploadDialogProps {
  onUpload: (files: File[], metadata: Partial<GEDDocument>) => Promise<void>;
}

interface FileWithMetadata extends File {
  id: string;
  friendlyName: string;
  tags: string[];
  description: string;
}

export function GEDUploadDialog({ onUpload }: GEDUploadDialogProps) {
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Metadados globais
  const [globalMetadata, setGlobalMetadata] = useState({
    clientId: "",
    clientName: "",
    processNumber: "",
    contractId: "",
    ticketId: "",
    source: "UPLOAD_DIRETO" as const,
    visibility: "INTERNO" as const,
    tags: [] as string[],
    description: "",
  });

  // Estado para tags
  const [newTag, setNewTag] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      ...file,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      friendlyName: file.name.split(".").slice(0, -1).join("."),
      tags: [],
      description: "",
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "video/*": [".mp4", ".avi", ".mov"],
      "application/zip": [".zip"],
      "application/x-rar-compressed": [".rar"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: true,
  });

  const getFileIcon = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return <FileText className="h-6 w-6 text-red-500" />;
      case "docx":
      case "doc":
        return <FileText className="h-6 w-6 text-blue-500" />;
      case "xlsx":
      case "xls":
        return <FileText className="h-6 w-6 text-green-500" />;
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return <Image className="h-6 w-6 text-purple-500" />;
      case "mp4":
      case "avi":
      case "mov":
        return <Video className="h-6 w-6 text-pink-500" />;
      case "zip":
      case "rar":
        return <Archive className="h-6 w-6 text-orange-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const updateFileMetadata = (fileId: string, field: string, value: any) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, [field]: value } : f)),
    );
  };

  const addGlobalTag = () => {
    if (newTag.trim() && !globalMetadata.tags.includes(newTag.trim())) {
      setGlobalMetadata((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeGlobalTag = (tag: string) => {
    setGlobalMetadata((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const addFileTag = (fileId: string) => {
    if (newTag.trim()) {
      updateFileMetadata(fileId, "tags", [
        ...(files.find((f) => f.id === fileId)?.tags || []),
        newTag.trim(),
      ]);
      setNewTag("");
    }
  };

  const removeFileTag = (fileId: string, tag: string) => {
    const file = files.find((f) => f.id === fileId);
    if (file) {
      updateFileMetadata(
        fileId,
        "tags",
        file.tags.filter((t) => t !== tag),
      );
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Selecione pelo menos um arquivo para upload");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simular progresso
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Combinar metadados globais com individuais
      const combinedMetadata = {
        ...globalMetadata,
        tags: [...globalMetadata.tags],
      };

      // Upload dos arquivos
      await onUpload(files, combinedMetadata);

      setUploadProgress(100);

      // Limpar formulário
      setFiles([]);
      setGlobalMetadata({
        clientId: "",
        clientName: "",
        processNumber: "",
        contractId: "",
        ticketId: "",
        source: "UPLOAD_DIRETO",
        visibility: "INTERNO",
        tags: [],
        description: "",
      });

      toast.success(`✅ ${files.length} arquivo(s) enviado(s) com sucesso!`);
    } catch (error) {
      toast.error("❌ Erro no upload dos arquivos");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
      <DialogHeader>
        <DialogTitle>Upload de Documentos</DialogTitle>
        <DialogDescription>
          Faça upload de documentos para o GED Jurídico
        </DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(90vh-200px)]">
          <div className="space-y-6 pr-4">
            {/* Área de Drop */}
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                isDragActive
                  ? "border-[rgb(var(--theme-primary))] bg-[rgb(var(--theme-primary))]/5"
                  : "border-muted-foreground/25 hover:border-[rgb(var(--theme-primary))]/50",
              )}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">
                {isDragActive
                  ? "Solte os arquivos aqui"
                  : "Arraste arquivos ou clique para selecionar"}
              </h3>
              <p className="text-sm text-muted-foreground">
                PDF, DOCX, XLSX, JPG, PNG, MP4, ZIP - Máximo 50MB por arquivo
              </p>
            </div>

            {/* Lista de Arquivos */}
            {files.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    Arquivos Selecionados ({files.length})
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    Total: {formatFileSize(totalSize)}
                  </div>
                </div>

                <div className="space-y-3">
                  {files.map((file) => (
                    <div key={file.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file)}
                          <div>
                            <h4 className="font-medium">{file.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`friendly-name-${file.id}`}>
                            Nome Amigável
                          </Label>
                          <Input
                            id={`friendly-name-${file.id}`}
                            value={file.friendlyName}
                            onChange={(e) =>
                              updateFileMetadata(
                                file.id,
                                "friendlyName",
                                e.target.value,
                              )
                            }
                            placeholder="Nome descritivo do documento"
                          />
                        </div>

                        <div>
                          <Label>Tags Específicas</Label>
                          <div className="flex space-x-2">
                            <Input
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              placeholder="Adicionar tag"
                              onKeyPress={(e) =>
                                e.key === "Enter" && addFileTag(file.id)
                              }
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addFileTag(file.id)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          {file.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {file.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                  <button
                                    onClick={() => removeFileTag(file.id, tag)}
                                    className="ml-1 hover:text-red-500"
                                  >
                                    <X className="h-2 w-2" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="col-span-2">
                          <Label htmlFor={`description-${file.id}`}>
                            Descrição
                          </Label>
                          <Textarea
                            id={`description-${file.id}`}
                            value={file.description}
                            onChange={(e) =>
                              updateFileMetadata(
                                file.id,
                                "description",
                                e.target.value,
                              )
                            }
                            placeholder="Descrição opcional do documento"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadados Globais */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Metadados Gerais</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client-name">Cliente</Label>
                  <Input
                    id="client-name"
                    value={globalMetadata.clientName}
                    onChange={(e) =>
                      setGlobalMetadata((prev) => ({
                        ...prev,
                        clientName: e.target.value,
                      }))
                    }
                    placeholder="Nome do cliente"
                  />
                </div>

                <div>
                  <Label htmlFor="process-number">Número do Processo</Label>
                  <Input
                    id="process-number"
                    value={globalMetadata.processNumber}
                    onChange={(e) =>
                      setGlobalMetadata((prev) => ({
                        ...prev,
                        processNumber: e.target.value,
                      }))
                    }
                    placeholder="0000000-00.0000.0.00.0000"
                  />
                </div>

                <div>
                  <Label htmlFor="source">Origem</Label>
                  <Select
                    value={globalMetadata.source}
                    onValueChange={(value: any) =>
                      setGlobalMetadata((prev) => ({ ...prev, source: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UPLOAD_DIRETO">
                        Upload Direto
                      </SelectItem>
                      <SelectItem value="CRM">CRM Jurídico</SelectItem>
                      <SelectItem value="ATENDIMENTO">Atendimento</SelectItem>
                      <SelectItem value="IA">IA Jurídica</SelectItem>
                      <SelectItem value="AGENDA">Agenda Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="visibility">Visibilidade</Label>
                  <Select
                    value={globalMetadata.visibility}
                    onValueChange={(value: any) =>
                      setGlobalMetadata((prev) => ({
                        ...prev,
                        visibility: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INTERNO">
                        <div className="flex items-center space-x-2">
                          <Lock className="h-4 w-4" />
                          <span>Apenas Interno</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="VISIVEL_CLIENTE">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <span>Visível ao Cliente</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags Globais */}
              <div>
                <Label>Tags Globais</Label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Adicionar tag global"
                    onKeyPress={(e) => e.key === "Enter" && addGlobalTag()}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addGlobalTag}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {globalMetadata.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {globalMetadata.tags.map((tag, index) => (
                      <Badge key={index} variant="default" className="text-xs">
                        <Tag className="h-2 w-2 mr-1" />
                        {tag}
                        <button
                          onClick={() => removeGlobalTag(tag)}
                          className="ml-1 hover:text-red-200"
                        >
                          <X className="h-2 w-2" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Descrição Global */}
              <div>
                <Label htmlFor="global-description">Descrição Geral</Label>
                <Textarea
                  id="global-description"
                  value={globalMetadata.description}
                  onChange={(e) =>
                    setGlobalMetadata((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Descrição que será aplicada a todos os arquivos"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Enviando arquivos...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      <DialogFooter>
        <div className="flex items-center justify-between w-full">
          <div className="text-sm text-muted-foreground">
            {files.length > 0 &&
              `${files.length} arquivo(s) • ${formatFileSize(totalSize)}`}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setFiles([])}
              disabled={uploading || files.length === 0}
            >
              Limpar
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
            >
              {uploading ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Enviar {files.length > 0 && `(${files.length})`}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
