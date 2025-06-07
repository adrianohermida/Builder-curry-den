import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  File,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Grid3X3,
  List,
  Eye,
  EyeOff,
  Star,
  Download,
  Calendar,
  User,
  Tag,
  Link,
  CheckSquare,
  Square,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileContextMenu, FileItem } from "./FileContextMenu";
import { cn } from "@/lib/utils";

interface FileViewerProps {
  files: FileItem[];
  viewMode: "grid" | "list";
  selectedFiles: string[];
  onSelectFile: (fileId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onPreview: (file: FileItem) => void;
  onDownload: (file: FileItem) => void;
  onEdit: (file: FileItem, updates: Partial<FileItem>) => void;
  onDelete: (file: FileItem) => void;
  onToggleFavorite: (file: FileItem) => void;
  onShare: (file: FileItem, method: string) => void;
  onSendToAI: (file: FileItem, action: string) => void;
  onAssociate: (file: FileItem, type: string, id: string) => void;
  className?: string;
}

export function FileViewer({
  files,
  viewMode,
  selectedFiles,
  onSelectFile,
  onSelectAll,
  onPreview,
  onDownload,
  onEdit,
  onDelete,
  onToggleFavorite,
  onShare,
  onSendToAI,
  onAssociate,
  className = "",
}: FileViewerProps) {
  const [hoveredFile, setHoveredFile] = useState<string | null>(null);

  const getFileIcon = (file: FileItem) => {
    if (file.type.startsWith("image/")) return Image;
    if (file.type.startsWith("video/")) return Video;
    if (file.type.startsWith("audio/")) return Music;
    if (file.type === "application/pdf") return FileText;
    if (file.type.includes("zip") || file.type.includes("rar")) return Archive;
    return File;
  };

  const getFileColor = (file: FileItem) => {
    if (file.type.startsWith("image/")) return "text-green-600";
    if (file.type.startsWith("video/")) return "text-purple-600";
    if (file.type.startsWith("audio/")) return "text-pink-600";
    if (file.type === "application/pdf") return "text-red-600";
    if (file.type.includes("word")) return "text-blue-600";
    if (file.type.includes("excel")) return "text-emerald-600";
    if (file.type.includes("zip") || file.type.includes("rar"))
      return "text-orange-600";
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

  const allSelected =
    files.length > 0 && files.every((file) => selectedFiles.includes(file.id));
  const someSelected = selectedFiles.length > 0 && !allSelected;

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <File className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Nenhum arquivo encontrado
        </h3>
        <p className="text-muted-foreground max-w-md">
          Esta pasta está vazia. Faça upload de documentos ou mova arquivos para
          cá.
        </p>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className={className}>
        {/* Select All Header */}
        <div className="flex items-center gap-2 mb-4 p-2">
          <Checkbox
            checked={allSelected}
            ref={(el) => {
              if (el) {
                el.indeterminate = someSelected;
              }
            }}
            onCheckedChange={(checked) => onSelectAll(!!checked)}
          />
          <span className="text-sm text-muted-foreground">
            {selectedFiles.length > 0
              ? `${selectedFiles.length} selecionado${selectedFiles.length !== 1 ? "s" : ""}`
              : "Selecionar todos"}
          </span>
        </div>

        {/* Grid View */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {files.map((file, index) => {
            const FileIcon = getFileIcon(file);
            const isSelected = selectedFiles.includes(file.id);
            const isHovered = hoveredFile === file.id;

            return (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => setHoveredFile(file.id)}
                onMouseLeave={() => setHoveredFile(null)}
                className="group"
              >
                <FileContextMenu
                  file={file}
                  onPreview={onPreview}
                  onDownload={onDownload}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleFavorite={onToggleFavorite}
                  onShare={onShare}
                  onSendToAI={onSendToAI}
                  onAssociate={onAssociate}
                >
                  <Card
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105",
                      isSelected && "ring-2 ring-primary bg-primary/5",
                      "relative",
                    )}
                    onClick={() => onSelectFile(file.id, !isSelected)}
                  >
                    {/* Selection Checkbox */}
                    <div className="absolute top-2 left-2 z-10">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          onSelectFile(file.id, !!checked)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Actions Menu */}
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FileContextMenu
                        file={file}
                        onPreview={onPreview}
                        onDownload={onDownload}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onToggleFavorite={onToggleFavorite}
                        onShare={onShare}
                        onSendToAI={onSendToAI}
                        onAssociate={onAssociate}
                        asDropdown
                      >
                        <div />
                      </FileContextMenu>
                    </div>

                    <CardContent className="p-4 text-center">
                      {/* File Icon */}
                      <div className="mb-3">
                        <FileIcon
                          className={`h-12 w-12 mx-auto ${getFileColor(file)}`}
                        />
                      </div>

                      {/* File Name */}
                      <h3 className="font-medium text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
                        {file.name}
                      </h3>

                      {/* File Info */}
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <p>{formatFileSize(file.size)}</p>
                        <p>{formatDate(file.createdAt)}</p>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1 mt-3 justify-center">
                        {file.isFavorite && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Favorito
                          </Badge>
                        )}
                        {file.clientVisible && (
                          <Badge variant="outline" className="text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            Cliente
                          </Badge>
                        )}
                        {file.associatedWith && (
                          <Badge variant="outline" className="text-xs">
                            <Link className="h-3 w-3 mr-1" />
                            Vinculado
                          </Badge>
                        )}
                      </div>

                      {/* Tags */}
                      {file.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2 justify-center">
                          {file.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {file.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{file.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </FileContextMenu>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className={className}>
      {/* Select All Header */}
      <div className="flex items-center gap-2 mb-4 p-2 border-b">
        <Checkbox
          checked={allSelected}
          ref={(el) => {
            if (el) {
              el.indeterminate = someSelected;
            }
          }}
          onCheckedChange={(checked) => onSelectAll(!!checked)}
        />
        <span className="text-sm text-muted-foreground">
          {selectedFiles.length > 0
            ? `${selectedFiles.length} selecionado${selectedFiles.length !== 1 ? "s" : ""}`
            : "Selecionar todos"}
        </span>
      </div>

      {/* List Headers */}
      <div className="grid grid-cols-12 gap-4 p-3 text-sm font-medium text-muted-foreground border-b bg-muted/30">
        <div className="col-span-5">Nome</div>
        <div className="col-span-2">Tamanho</div>
        <div className="col-span-2">Modificado</div>
        <div className="col-span-2">Por</div>
        <div className="col-span-1">Ações</div>
      </div>

      {/* List Items */}
      <div className="space-y-1">
        {files.map((file, index) => {
          const FileIcon = getFileIcon(file);
          const isSelected = selectedFiles.includes(file.id);

          return (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              onMouseEnter={() => setHoveredFile(file.id)}
              onMouseLeave={() => setHoveredFile(null)}
            >
              <FileContextMenu
                file={file}
                onPreview={onPreview}
                onDownload={onDownload}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleFavorite={onToggleFavorite}
                onShare={onShare}
                onSendToAI={onSendToAI}
                onAssociate={onAssociate}
              >
                <div
                  className={cn(
                    "grid grid-cols-12 gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group",
                    isSelected && "bg-primary/5 border border-primary/20",
                  )}
                  onClick={() => onSelectFile(file.id, !isSelected)}
                >
                  {/* Name Column */}
                  <div className="col-span-5 flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        onSelectFile(file.id, !!checked)
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                    <FileIcon className={`h-5 w-5 ${getFileColor(file)}`} />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {file.isFavorite && (
                          <Star className="h-3 w-3 text-yellow-500" />
                        )}
                        {file.clientVisible && (
                          <Eye className="h-3 w-3 text-green-500" />
                        )}
                        {!file.clientVisible && (
                          <EyeOff className="h-3 w-3 text-gray-400" />
                        )}
                        {file.associatedWith && (
                          <Link className="h-3 w-3 text-blue-500" />
                        )}
                        {file.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Size Column */}
                  <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </div>

                  {/* Modified Column */}
                  <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                    {formatDate(file.createdAt)}
                  </div>

                  {/* Uploaded By Column */}
                  <div className="col-span-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {file.uploadedBy
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{file.uploadedBy}</span>
                  </div>

                  {/* Actions Column */}
                  <div className="col-span-1 flex items-center justify-end">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              onPreview(file);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Visualizar</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDownload(file);
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Baixar</TooltipContent>
                      </Tooltip>

                      <FileContextMenu
                        file={file}
                        onPreview={onPreview}
                        onDownload={onDownload}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onToggleFavorite={onToggleFavorite}
                        onShare={onShare}
                        onSendToAI={onSendToAI}
                        onAssociate={onAssociate}
                        asDropdown
                      >
                        <div />
                      </FileContextMenu>
                    </div>
                  </div>
                </div>
              </FileContextMenu>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
