import { useState, useRef, useCallback } from "react";
import {
  Upload,
  X,
  File,
  Image,
  FileText,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Cloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useStorageConfig, getUploadPath } from "@/hooks/useStorageConfig";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
  uploadPath: string;
  acceptedFileTypes?: string[];
  maxFiles?: number;
  maxSizeInMB?: number;
  onFilesUploaded?: (files: UploadedFile[]) => void;
  onUploadError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
  showStorageProvider?: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
  provider: string;
}

interface FileWithProgress extends File {
  id: string;
  progress: number;
  status: "uploading" | "completed" | "error";
  url?: string;
}

export function FileUpload({
  uploadPath,
  acceptedFileTypes = ["pdf", "doc", "docx", "jpg", "jpeg", "png"],
  maxFiles = 5,
  maxSizeInMB = 50,
  onFilesUploaded,
  onUploadError,
  disabled = false,
  className = "",
  showStorageProvider = true,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isConfigured, currentProvider } = useStorageConfig();

  const handleFileSelect = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles || !isConfigured) return;

      const newFiles = Array.from(selectedFiles).map((file) => ({
        ...file,
        id: Math.random().toString(36).substr(2, 9),
        progress: 0,
        status: "uploading" as const,
      }));

      // Check max files limit
      if (files.length + newFiles.length > maxFiles) {
        toast.error(`Máximo de ${maxFiles} arquivos permitidos`);
        return;
      }

      // Validate file types and sizes
      const invalidFiles = newFiles.filter((file) => {
        const extension = file.name.split(".").pop()?.toLowerCase();
        const isValidType = extension && acceptedFileTypes.includes(extension);
        const isValidSize = file.size <= maxSizeInMB * 1024 * 1024;
        return !isValidType || !isValidSize;
      });

      if (invalidFiles.length > 0) {
        toast.error(
          `Alguns arquivos são inválidos. Tipos aceitos: ${acceptedFileTypes.join(", ")}`,
        );
        return;
      }

      setFiles((prev) => [...prev, ...newFiles]);

      // Start upload for each file
      newFiles.forEach((file) => uploadFileWithProgress(file));
    },
    [
      files,
      maxFiles,
      acceptedFileTypes,
      maxSizeInMB,
      isConfigured,
      uploadFile,
      uploadPath,
    ],
  );

  const uploadFileWithProgress = async (fileWithProgress: FileWithProgress) => {
    try {
      const result = await uploadFile(fileWithProgress, uploadPath, {
        encrypt: true,
        onProgress: (progress) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileWithProgress.id ? { ...f, progress } : f,
            ),
          );
        },
      });

      if (result.success) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileWithProgress.id
              ? { ...f, status: "completed", url: result.url }
              : f,
          ),
        );

        // Call success callback
        const uploadedFile: UploadedFile = {
          id: fileWithProgress.id,
          name: fileWithProgress.name,
          size: fileWithProgress.size,
          type: fileWithProgress.type,
          url: result.url || "",
          uploadedAt: new Date(),
          provider: currentProvider,
        };

        onFilesUploaded?.([uploadedFile]);
        toast.success(`${fileWithProgress.name} enviado com sucesso`);
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileWithProgress.id ? { ...f, status: "error" } : f,
          ),
        );

        onUploadError?.(result.error || "Erro no upload");
        toast.error(`Erro ao enviar ${fileWithProgress.name}: ${result.error}`);
      }
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileWithProgress.id ? { ...f, status: "error" } : f,
        ),
      );

      toast.error(`Erro no upload: ${error}`);
      onUploadError?.(`Erro no upload: ${error}`);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "jpg":
      case "jpeg":
      case "png":
        return <Image className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: FileWithProgress["status"]) => {
    switch (status) {
      case "uploading":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  if (!isConfigured) {
    return (
      <div className="p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
        <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          Configuração de armazenamento necessária
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Configure o provedor de armazenamento nas configurações
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Storage Provider Info */}
      {showStorageProvider && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2">
            <Cloud className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Armazenamento: {currentProvider}
            </span>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all
          ${
            isDragOver
              ? "border-[rgb(var(--theme-primary))] bg-[rgb(var(--theme-primary))]/5"
              : "border-muted-foreground/25 hover:border-[rgb(var(--theme-primary))]/50"
          }
          ${disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFileTypes.map((type) => `.${type}`).join(",")}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <h3 className="text-lg font-medium mb-1">
          {isDragOver ? "Solte os arquivos aqui" : "Enviar arquivos"}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Arraste e solte ou clique para selecionar arquivos
        </p>

        <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
          <span>
            Tipos aceitos: {acceptedFileTypes.join(", ").toUpperCase()}
          </span>
          <span>•</span>
          <span>Máximo: {maxSizeInMB}MB por arquivo</span>
          <span>•</span>
          <span>Até {maxFiles} arquivos</span>
        </div>

        <Button
          type="button"
          variant="outline"
          className="mt-4"
          disabled={disabled}
        >
          <Upload className="h-4 w-4 mr-2" />
          Escolher Arquivos
        </Button>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center space-x-3 p-3 border rounded-lg bg-card"
              >
                {getFileIcon(file.name)}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium truncate">
                      {file.name}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(file.status)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatFileSize(file.size)}</span>
                    {file.status === "uploading" && (
                      <span>{file.progress}%</span>
                    )}
                  </div>

                  {file.status === "uploading" && (
                    <Progress value={file.progress} className="mt-1 h-1" />
                  )}

                  {file.status === "completed" && file.url && (
                    <div className="mt-1">
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Enviado com sucesso
                      </Badge>
                    </div>
                  )}

                  {file.status === "error" && (
                    <div className="mt-1">
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Erro no envio
                      </Badge>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
