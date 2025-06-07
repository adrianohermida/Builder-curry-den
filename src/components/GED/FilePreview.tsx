import { useState } from "react";
import {
  X,
  Download,
  Share2,
  Maximize2,
  Minimize2,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Eye,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  File,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileItem } from "./FileContextMenu";

interface FilePreviewProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (file: FileItem) => void;
  onShare: (file: FileItem, method: string) => void;
}

export function FilePreview({
  file,
  isOpen,
  onClose,
  onDownload,
  onShare,
}: FilePreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!file) return null;

  const getFileIcon = () => {
    if (file.type.startsWith("image/")) return Image;
    if (file.type.startsWith("video/")) return Video;
    if (file.type.startsWith("audio/")) return Music;
    if (file.type === "application/pdf") return FileText;
    if (file.type.includes("zip") || file.type.includes("rar")) return Archive;
    return File;
  };

  const getFileColor = () => {
    if (file.type.startsWith("image/")) return "text-green-600";
    if (file.type.startsWith("video/")) return "text-purple-600";
    if (file.type.startsWith("audio/")) return "text-pink-600";
    if (file.type === "application/pdf") return "text-red-600";
    if (file.type.includes("word")) return "text-blue-600";
    if (file.type.includes("excel")) return "text-emerald-600";
    return "text-gray-600";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canPreview = () => {
    const previewableTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "text/plain",
    ];
    return previewableTypes.includes(file.type);
  };

  const renderPreview = () => {
    if (!canPreview()) {
      const FileIcon = getFileIcon();
      return (
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <FileIcon className={`h-24 w-24 mb-4 ${getFileColor()}`} />
          <h3 className="text-lg font-semibold mb-2">Preview não disponível</h3>
          <p className="text-muted-foreground mb-4">
            Este tipo de arquivo não pode ser visualizado diretamente no
            navegador.
          </p>
          <Button onClick={() => onDownload(file)}>
            <Download className="h-4 w-4 mr-2" />
            Baixar arquivo
          </Button>
        </div>
      );
    }

    if (file.type.startsWith("image/")) {
      return (
        <div className="flex items-center justify-center min-h-96 bg-black/5 rounded-lg">
          <img
            src={`/api/files/${file.id}/preview`} // Em produção, seria a URL real
            alt={file.name}
            className="max-w-full max-h-96 object-contain"
            style={{
              transform: `rotate(${rotation}deg) scale(${zoom / 100})`,
              transition: "transform 0.2s ease-in-out",
            }}
            onError={(e) => {
              // Fallback para imagem de exemplo
              (e.target as HTMLImageElement).src =
                `data:image/svg+xml;base64,${btoa(`
                <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100%" height="100%" fill="#f3f4f6"/>
                  <text x="50%" y="50%" font-family="Arial" font-size="18" fill="#6b7280" text-anchor="middle" dy=".3em">
                    Preview da Imagem
                  </text>
                </svg>
              `)}`;
            }}
          />
        </div>
      );
    }

    if (file.type === "application/pdf") {
      return (
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-red-600" />
            <p className="text-lg font-semibold mb-2">Documento PDF</p>
            <p className="text-muted-foreground mb-4">
              Clique para baixar e visualizar no seu leitor de PDF preferido
            </p>
            <Button onClick={() => onDownload(file)}>
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </div>
      );
    }

    if (file.type === "text/plain") {
      return (
        <div className="h-96 border rounded-lg">
          <ScrollArea className="h-full p-4">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {/* Em produção, carregaria o conteúdo real do arquivo */}
              Conteúdo do arquivo de texto seria exibido aqui... Este é um
              preview simulado do arquivo: {file.name}
              Tamanho: {formatFileSize(file.size)}
              Criado em: {formatDate(file.createdAt)}
              Enviado por: {file.uploadedBy}
            </pre>
          </ScrollArea>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">
          Formato não suportado para preview
        </p>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-4xl ${isFullscreen ? "h-[90vh]" : "max-h-[80vh]"}`}
      >
        <DialogHeader className="border-b pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl truncate">
                {file.name}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <span>{formatFileSize(file.size)}</span>
                <Separator orientation="vertical" className="h-4" />
                <span>Criado em {formatDate(file.createdAt)}</span>
                <Separator orientation="vertical" className="h-4" />
                <span>Por {file.uploadedBy}</span>
              </DialogDescription>
            </div>

            <div className="flex items-center gap-1 ml-4">
              {/* Zoom Controls for Images */}
              {file.type.startsWith("image/") && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setZoom(Math.max(25, zoom - 25))}
                    disabled={zoom <= 25}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground px-2">
                    {zoom}%
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setZoom(Math.min(200, zoom + 25))}
                    disabled={zoom >= 200}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRotation(rotation + 90)}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDownload(file)}
              >
                <Download className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShare(file, "link")}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* File Info */}
        <div className="flex flex-wrap gap-2 py-2">
          {file.isFavorite && <Badge variant="secondary">⭐ Favorito</Badge>}
          {file.clientVisible && (
            <Badge variant="outline">
              <Eye className="h-3 w-3 mr-1" />
              Visível ao Cliente
            </Badge>
          )}
          {file.associatedWith && (
            <Badge variant="outline">🔗 {file.associatedWith.name}</Badge>
          )}
          {file.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Preview Area */}
        <div className={`${isFullscreen ? "flex-1" : ""} overflow-hidden`}>
          {renderPreview()}
        </div>

        {/* Actions Footer */}
        <div className="border-t pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Tipo: {file.type}
            </span>
            {file.associatedWith && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm text-muted-foreground">
                  Vinculado a: {file.associatedWith.name}
                </span>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onShare(file, "whatsapp")}>
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            <Button onClick={() => onDownload(file)}>
              <Download className="h-4 w-4 mr-2" />
              Baixar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
