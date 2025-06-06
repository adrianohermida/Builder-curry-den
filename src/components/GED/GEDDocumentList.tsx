import { useState } from "react";
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
  MoreHorizontal,
  Undo,
  X,
  Copy,
  Share2,
  Globe,
  Lock,
  Building,
  Gavel,
  Calendar,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { GEDDocument } from "@/hooks/useGEDDocuments";
import { cn } from "@/lib/utils";

interface GEDDocumentListProps {
  documents: GEDDocument[];
  onToggleFavorite: (id: string) => void;
  onMoveToTrash: (id: string) => void;
  onRestore: (id: string) => void;
  onDeletePermanently: (id: string) => void;
}

export function GEDDocumentList({
  documents,
  onToggleFavorite,
  onMoveToTrash,
  onRestore,
  onDeletePermanently,
}: GEDDocumentListProps) {
  const [deleteDocumentId, setDeleteDocumentId] = useState<string | null>(null);

  const getFileIcon = (extension: string) => {
    switch (extension.toLowerCase()) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "docx":
      case "doc":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "xlsx":
      case "xls":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return <Image className="h-4 w-4 text-purple-500" />;
      case "mp4":
      case "avi":
      case "mov":
        return <Video className="h-4 w-4 text-pink-500" />;
      case "zip":
      case "rar":
        return <Archive className="h-4 w-4 text-orange-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSourceLabel = (source: string) => {
    const sources = {
      UPLOAD_DIRETO: "Upload Direto",
      CRM: "CRM",
      ATENDIMENTO: "Atendimento",
      IA: "IA",
      AGENDA: "Agenda",
      PORTAL_CLIENTE: "Portal Cliente",
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownload = (document: GEDDocument) => {
    toast.success(`📥 Baixando ${document.name}...`);
    // Simular download
    setTimeout(() => {
      toast.success(`✅ ${document.name} baixado com sucesso!`);
    }, 2000);
  };

  const handleCopyLink = (document: GEDDocument) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/ged/document/${document.id}`,
    );
    toast.success("🔗 Link copiado para a área de transferência");
  };

  const handleShare = (document: GEDDocument) => {
    if (navigator.share) {
      navigator.share({
        title: document.friendlyName || document.name,
        text: document.description || "Documento do GED Jurídico",
        url: `${window.location.origin}/ged/document/${document.id}`,
      });
    } else {
      handleCopyLink(document);
    }
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <ScrollArea className="h-[calc(100vh-400px)]">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Cliente/Processo</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead>Modificado</TableHead>
                <TableHead>Visibilidade</TableHead>
                <TableHead>Estatísticas</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow
                  key={document.id}
                  className={cn(
                    "hover:bg-muted/50 transition-colors",
                    document.isDeleted && "opacity-75",
                    document.isFavorite && "bg-yellow-50 dark:bg-yellow-950/10",
                  )}
                >
                  {/* Ícone do arquivo */}
                  <TableCell>{getFileIcon(document.extension)}</TableCell>

                  {/* Nome e detalhes */}
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium line-clamp-1">
                          {document.friendlyName || document.name}
                        </span>
                        {document.isFavorite && (
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        )}
                      </div>

                      {document.friendlyName &&
                        document.friendlyName !== document.name && (
                          <div className="text-xs text-muted-foreground font-mono">
                            {document.name}
                          </div>
                        )}

                      {document.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {document.tags.slice(0, 3).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {document.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{document.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Cliente/Processo */}
                  <TableCell>
                    <div className="space-y-1">
                      {document.clientName && (
                        <div className="flex items-center space-x-1 text-xs">
                          <Building className="h-3 w-3 text-blue-500" />
                          <span className="truncate max-w-32">
                            {document.clientName}
                          </span>
                        </div>
                      )}
                      {document.processNumber && (
                        <div className="flex items-center space-x-1 text-xs">
                          <Gavel className="h-3 w-3 text-green-500" />
                          <span className="font-mono text-xs">
                            {document.processNumber}
                          </span>
                        </div>
                      )}
                      {!document.clientName && !document.processNumber && (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Origem */}
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {getSourceIcon(document.source)}
                      <span className="text-xs">
                        {getSourceLabel(document.source)}
                      </span>
                    </div>
                  </TableCell>

                  {/* Tamanho */}
                  <TableCell>
                    <div className="space-y-1">
                      <span className="text-sm">
                        {formatFileSize(document.size)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {document.extension}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Data */}
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-xs">
                        {formatDate(document.modifiedAt)}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="text-xs">
                            {document.uploadedBy
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground truncate max-w-20">
                          {document.uploadedBy}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Visibilidade */}
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {document.visibility === "VISIVEL_CLIENTE" ? (
                            <div className="flex items-center space-x-1 text-green-600">
                              <Globe className="h-4 w-4" />
                              <span className="text-xs">Cliente</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 text-gray-500">
                              <Lock className="h-4 w-4" />
                              <span className="text-xs">Interno</span>
                            </div>
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          {document.visibility === "VISIVEL_CLIENTE"
                            ? "Visível no Portal do Cliente"
                            : "Apenas uso interno"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>

                  {/* Estatísticas */}
                  <TableCell>
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
                  </TableCell>

                  {/* Ações */}
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onToggleFavorite(document.id)}
                              className="h-8 w-8 p-0"
                            >
                              {document.isFavorite ? (
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              ) : (
                                <StarOff className="h-3 w-3" />
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleDownload(document)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Baixar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleCopyLink(document)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copiar Link
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleShare(document)}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Compartilhar
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {document.isDeleted ? (
                            <>
                              <DropdownMenuItem
                                onClick={() => onRestore(document.id)}
                              >
                                <Undo className="h-4 w-4 mr-2" />
                                Restaurar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteDocumentId(document.id)}
                                className="text-red-600"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Excluir Permanentemente
                              </DropdownMenuItem>
                            </>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => onMoveToTrash(document.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Mover para Lixeira
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog
        open={!!deleteDocumentId}
        onOpenChange={() => setDeleteDocumentId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Permanentemente</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir permanentemente este documento?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDocumentId(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteDocumentId) {
                  onDeletePermanently(deleteDocumentId);
                  setDeleteDocumentId(null);
                }
              }}
            >
              Excluir Permanentemente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
