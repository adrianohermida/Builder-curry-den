import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  File,
  FileText,
  Image,
  Video,
  Archive,
  Music,
  Pause,
  Play,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface UploadFile {
  id: string;
  file: File;
  status: "pending" | "uploading" | "success" | "error" | "paused";
  progress: number;
  error?: string;
  uploadedAt?: Date;
  cancelToken?: AbortController;
}

interface DropzoneUploadProps {
  currentFolderId: string;
  onUploadComplete: (files: UploadFile[]) => void;
  onUploadProgress?: (fileId: string, progress: number) => void;
  maxFileSize?: number; // em MB
  acceptedTypes?: string[];
  className?: string;
}

export function DropzoneUpload({
  currentFolderId,
  onUploadComplete,
  onUploadProgress,
  maxFileSize = 50,
  acceptedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/*",
    "video/*",
    "audio/*",
  ],
  className = "",
}: DropzoneUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
        id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        file,
        status: "pending",
        progress: 0,
      }));

      setUploadFiles((prev) => [...prev, ...newFiles]);

      // Iniciar upload automaticamente
      newFiles.forEach((uploadFile) => {
        startUpload(uploadFile);
      });
    },
    [currentFolderId],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxFileSize * 1024 * 1024,
    onDragEnter: () => setIsDragOver(true),
    onDragLeave: () => setIsDragOver(false),
    onDropAccepted: () => setIsDragOver(false),
    onDropRejected: (fileRejections) => {
      setIsDragOver(false);
      fileRejections.forEach((rejection) => {
        const errors = rejection.errors
          .map((error) => error.message)
          .join(", ");
        toast.error(`Erro no arquivo ${rejection.file.name}: ${errors}`);
      });
    },
  });

  const startUpload = async (uploadFile: UploadFile) => {
    const controller = new AbortController();

    setUploadFiles((prev) =>
      prev.map((f) =>
        f.id === uploadFile.id
          ? { ...f, status: "uploading", cancelToken: controller }
          : f,
      ),
    );

    try {
      // Simular upload com progresso
      await simulateUpload(
        uploadFile,
        (progress) => {
          setUploadFiles((prev) =>
            prev.map((f) => (f.id === uploadFile.id ? { ...f, progress } : f)),
          );
          onUploadProgress?.(uploadFile.id, progress);
        },
        controller.signal,
      );

      setUploadFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: "success", progress: 100, uploadedAt: new Date() }
            : f,
        ),
      );

      toast.success(`Arquivo ${uploadFile.file.name} enviado com sucesso!`);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setUploadFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, status: "paused" } : f,
          ),
        );
      } else {
        setUploadFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, status: "error", error: "Erro no upload" }
              : f,
          ),
        );
        toast.error(`Erro ao enviar ${uploadFile.file.name}`);
      }
    }
  };

  const simulateUpload = (
    uploadFile: UploadFile,
    onProgress: (progress: number) => void,
    signal: AbortSignal,
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        if (signal.aborted) {
          clearInterval(interval);
          reject(new Error("AbortError"));
          return;
        }

        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          resolve();
        }
        onProgress(progress);
      }, 200);
    });
  };

  const pauseUpload = (fileId: string) => {
    setUploadFiles((prev) =>
      prev.map((f) => {
        if (f.id === fileId && f.cancelToken) {
          f.cancelToken.abort();
          return { ...f, status: "paused" };
        }
        return f;
      }),
    );
  };

  const resumeUpload = (fileId: string) => {
    const file = uploadFiles.find((f) => f.id === fileId);
    if (file && file.status === "paused") {
      startUpload(file);
    }
  };

  const retryUpload = (fileId: string) => {
    const file = uploadFiles.find((f) => f.id === fileId);
    if (file && file.status === "error") {
      setUploadFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, status: "pending", progress: 0, error: undefined }
            : f,
        ),
      );
      startUpload(file);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadFiles((prev) => {
      const file = prev.find((f) => f.id === fileId);
      if (file?.cancelToken) {
        file.cancelToken.abort();
      }
      return prev.filter((f) => f.id !== fileId);
    });
  };

  const clearCompleted = () => {
    setUploadFiles((prev) => prev.filter((f) => f.status !== "success"));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return Image;
    if (file.type.startsWith("video/")) return Video;
    if (file.type.startsWith("audio/")) return Music;
    if (file.type === "application/pdf") return FileText;
    if (file.type.includes("zip") || file.type.includes("rar")) return Archive;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const totalFiles = uploadFiles.length;
  const completedFiles = uploadFiles.filter(
    (f) => f.status === "success",
  ).length;
  const uploadingFiles = uploadFiles.filter(
    (f) => f.status === "uploading",
  ).length;
  const errorFiles = uploadFiles.filter((f) => f.status === "error").length;

  if (totalFiles === 0) {
    return (
      <Card
        className={`border-2 border-dashed hover:border-primary/50 transition-colors ${className}`}
      >
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={`
              text-center cursor-pointer transition-colors rounded-lg p-6
              ${
                isDragActive || isDragOver
                  ? "bg-primary/5 border-primary/20"
                  : "hover:bg-muted/50"
              }
            `}
          >
            <input {...getInputProps()} ref={fileInputRef} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {isDragActive ? "Solte os arquivos aqui" : "Enviar Documentos"}
            </h3>
            <p className="text-muted-foreground mb-4">
              Arraste arquivos aqui ou clique para selecionar
            </p>
            <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
              <Badge variant="secondary">PDF</Badge>
              <Badge variant="secondary">DOC</Badge>
              <Badge variant="secondary">XLS</Badge>
              <Badge variant="secondary">IMG</Badge>
              <Badge variant="secondary">Até {maxFileSize}MB</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            <h3 className="font-semibold">
              Uploads ({completedFiles}/{totalFiles})
            </h3>
            {uploadingFiles > 0 && (
              <Badge variant="secondary" className="animate-pulse">
                {uploadingFiles} enviando...
              </Badge>
            )}
            {errorFiles > 0 && (
              <Badge variant="destructive">{errorFiles} erros</Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCompleted}
              disabled={completedFiles === 0}
            >
              Limpar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? "Expandir" : "Minimizar"}
            </Button>
          </div>
        </div>

        {/* Upload List */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 max-h-60 overflow-y-auto"
            >
              {uploadFiles.map((uploadFile) => {
                const FileIcon = getFileIcon(uploadFile.file);

                return (
                  <motion.div
                    key={uploadFile.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <FileIcon className="h-8 w-8 text-muted-foreground" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium truncate">
                          {uploadFile.file.name}
                        </p>
                        <div className="flex items-center gap-2">
                          {uploadFile.status === "success" && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                          {uploadFile.status === "error" && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                          {uploadFile.status === "uploading" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => pauseUpload(uploadFile.id)}
                            >
                              <Pause className="h-3 w-3" />
                            </Button>
                          )}
                          {uploadFile.status === "paused" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => resumeUpload(uploadFile.id)}
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                          )}
                          {uploadFile.status === "error" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => retryUpload(uploadFile.id)}
                            >
                              <RotateCw className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(uploadFile.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatFileSize(uploadFile.file.size)}</span>
                        <span>
                          {uploadFile.status === "success" && "Concluído"}
                          {uploadFile.status === "error" && uploadFile.error}
                          {uploadFile.status === "uploading" &&
                            `${Math.round(uploadFile.progress)}%`}
                          {uploadFile.status === "paused" && "Pausado"}
                          {uploadFile.status === "pending" && "Pendente"}
                        </span>
                      </div>

                      {uploadFile.status === "uploading" && (
                        <Progress
                          value={uploadFile.progress}
                          className="h-1 mt-2"
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add More Files */}
        <Separator className="my-4" />
        <div
          {...getRootProps()}
          className="p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors text-center"
        >
          <input {...getInputProps()} />
          <Plus className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Adicionar mais arquivos
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
