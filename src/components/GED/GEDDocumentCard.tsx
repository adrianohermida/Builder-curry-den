import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Image,
  Video,
  Archive,
  File,
  Star,
  StarOff,
  Trash2,
  Download,
  Eye,
  MessageSquare,
  Tag,
  Calendar,
  User,
  Building,
  Gavel,
  ExternalLink,
  MoreHorizontal,
  Undo,
  X,
  Copy,
  Share2,
  Edit,
  Globe,
  Lock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { GEDDocument } from "@/hooks/useGEDDocuments";
import { cn } from "@/lib/utils";

interface GEDDocumentCardProps {
  document: GEDDocument;
  onToggleFavorite: () => void;
  onMoveToTrash: () => void;
  onRestore: () => void;
  onDeletePermanently: () => void;
  isInTrash?: boolean;
}

export function GEDDocumentCard({
  document,
  onToggleFavorite,
  onMoveToTrash,
  onRestore,
  onDeletePermanently,
  isInTrash = false,
}: GEDDocumentCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const getFileIcon = (type: string, extension: string) => {
    switch (extension.toLowerCase()) {
      case "pdf":
        return {
          icon: FileText,
          color: "text-red-500",
          bgColor: "bg-red-50 dark:bg-red-950/20",
        };
      case "docx":
      case "doc":
        return {
          icon: FileText,
          color: "text-blue-500",
          bgColor: "bg-blue-50 dark:bg-blue-950/20",
        };
      case "xlsx":
      case "xls":
        return {
          icon: FileText,
          color: "text-green-500",
          bgColor: "bg-green-50 dark:bg-green-950/20",
        };
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return {
          icon: Image,
          color: "text-purple-500",
          bgColor: "bg-purple-50 dark:bg-purple-950/20",
        };
      case "mp4":
      case "avi":
      case "mov":
        return {
          icon: Video,
          color: "text-pink-500",
          bgColor: "bg-pink-50 dark:bg-pink-950/20",
        };
      case "zip":
      case "rar":
        return {
          icon: Archive,
          color: "text-orange-500",
          bgColor: "bg-orange-50 dark:bg-orange-950/20",
        };
      default:
        return {
          icon: File,
          color: "text-gray-500",
          bgColor: "bg-gray-50 dark:bg-gray-950/20",
        };
    }
  };

  const getSourceLabel = (source: string) => {
    const sources = {
      UPLOAD_DIRETO: "Upload Direto",
      CRM: "CRM Jurídico",
      ATENDIMENTO: "Atendimento",
      IA: "IA Jurídica",
      AGENDA: "Agenda",
      PORTAL_CLIENTE: "Portal do Cliente",
    };
    return sources[source as keyof typeof sources] || source;
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "CRM":
        return <Building className="h-3 w-3" />;
      case "ATENDIMENTO":
        return <MessageSquare className="h-3 w-3" />;
      case "IA":
        return <Eye className="h-3 w-3" />;
      case "AGENDA":
        return <Calendar className="h-3 w-3" />;
      case "PORTAL_CLIENTE":
        return <User className="h-3 w-3" />;
      default:
        return <File className="h-3 w-3" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDownload = () => {
    toast.success(`📥 Baixando ${document.name}...`);
    // Simular download
    setTimeout(() => {
      toast.success(`✅ ${document.name} baixado com sucesso!`);
    }, 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/ged/document/${document.id}`,
    );
    toast.success("🔗 Link copiado para a área de transferência");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.friendlyName || document.name,
        text: document.description || "Documento do GED Jurídico",
        url: `${window.location.origin}/ged/document/${document.id}`,
      });
    } else {
      handleCopyLink();
    }
  };

  const {
    icon: FileIcon,
    color: iconColor,
    bgColor,
  } = getFileIcon(document.type, document.extension);

  return (
    <>
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
        <Card
          className={cn(
            "group cursor-pointer transition-all duration-200",
            isInTrash ? "opacity-75 border-dashed" : "hover:shadow-lg",
            document.isFavorite && "ring-1 ring-yellow-200",
          )}
        >
          <CardContent className="p-4">
            {/* Header com ícone e ações */}
            <div className="flex items-start justify-between mb-3">
              <div className={cn("p-3 rounded-lg", bgColor)}>
                <FileIcon className={cn("h-8 w-8", iconColor)} />
              </div>

              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite();
                        }}
                        className="h-8 w-8 p-0"
                      >
                        {document.isFavorite ? (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {document.isFavorite
                        ? "Remover dos favoritos"
                        : "Adicionar aos favoritos"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsPreviewOpen(true)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopyLink}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Link
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartilhar
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {isInTrash ? (
                      <>
                        <DropdownMenuItem onClick={onRestore}>
                          <Undo className="h-4 w-4 mr-2" />
                          Restaurar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setShowDeleteDialog(true)}
                          className="text-red-600"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Excluir Permanentemente
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem
                        onClick={onMoveToTrash}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Mover para Lixeira
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Nome do arquivo */}
            <div className="mb-3">
              <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                {document.friendlyName || document.name}
              </h3>
              {document.friendlyName &&
                document.friendlyName !== document.name && (
                  <p className="text-xs text-muted-foreground font-mono truncate">
                    {document.name}
                  </p>
                )}
            </div>

            {/* Metadados */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatFileSize(document.size)}</span>
                <Badge variant="outline" className="text-xs">
                  {document.extension}
                </Badge>
              </div>

              {/* Cliente/Processo */}
              {document.clientName && (
                <div className="flex items-center space-x-1 text-xs">
                  <Building className="h-3 w-3 text-blue-500" />
                  <span className="truncate">{document.clientName}</span>
                </div>
              )}

              {document.processNumber && (
                <div className="flex items-center space-x-1 text-xs">
                  <Gavel className="h-3 w-3 text-green-500" />
                  <span className="font-mono truncate">
                    {document.processNumber}
                  </span>
                </div>
              )}

              {/* Tags */}
              {document.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {document.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Tag className="h-2 w-2 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                  {document.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{document.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <Separator className="my-3" />

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                {getSourceIcon(document.source)}
                <span>{getSourceLabel(document.source)}</span>
              </div>

              <div className="flex items-center space-x-2">
                {document.visibility === "VISIVEL_CLIENTE" ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Globe className="h-3 w-3 text-green-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Visível no Portal do Cliente
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Lock className="h-3 w-3 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>Apenas uso interno</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                <span className="text-xs text-muted-foreground">
                  {formatDate(document.createdAt)}
                </span>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t">
              <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{document.viewCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="h-3 w-3" />
                  <span>{document.downloadCount}</span>
                </div>
                {document.comments.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{document.comments.length}</span>
                  </div>
                )}
              </div>

              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {document.uploadedBy
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Permanentemente</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir permanentemente "
              {document.friendlyName || document.name}"? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDeletePermanently();
                setShowDeleteDialog(false);
              }}
            >
              Excluir Permanentemente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog (placeholder) */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{document.friendlyName || document.name}</DialogTitle>
            <DialogDescription>
              Preview do documento - {formatFileSize(document.size)}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
            <div className="text-center">
              <FileIcon className={cn("h-16 w-16 mx-auto mb-4", iconColor)} />
              <p className="text-muted-foreground">
                Preview não disponível para este tipo de arquivo
              </p>
              <Button onClick={handleDownload} className="mt-4">
                <Download className="h-4 w-4 mr-2" />
                Baixar Arquivo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
