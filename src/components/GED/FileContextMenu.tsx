import { useState } from "react";
import {
  Eye,
  Edit2,
  Share2,
  Download,
  Link,
  Brain,
  Trash2,
  Star,
  StarOff,
  Copy,
  Tag,
  ExternalLink,
  MessageSquare,
  FileText,
  Users,
  Gavel,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  clientVisible: boolean;
  isFavorite: boolean;
  tags: string[];
  associatedWith?: {
    type: "client" | "process" | "contract";
    id: string;
    name: string;
  };
  createdAt: string;
  uploadedBy: string;
}

interface FileContextMenuProps {
  file: FileItem;
  onPreview: (file: FileItem) => void;
  onDownload: (file: FileItem) => void;
  onEdit: (file: FileItem, updates: Partial<FileItem>) => void;
  onDelete: (file: FileItem) => void;
  onToggleFavorite: (file: FileItem) => void;
  onShare: (file: FileItem, method: string) => void;
  onSendToAI: (file: FileItem, action: string) => void;
  onAssociate: (file: FileItem, type: string, id: string) => void;
  children: React.ReactNode;
  asDropdown?: boolean;
}

export function FileContextMenu({
  file,
  onPreview,
  onDownload,
  onEdit,
  onDelete,
  onToggleFavorite,
  onShare,
  onSendToAI,
  onAssociate,
  children,
  asDropdown = false,
}: FileContextMenuProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAssociateDialog, setShowAssociateDialog] = useState(false);
  const [editData, setEditData] = useState({
    name: file.name,
    clientVisible: file.clientVisible,
    tags: file.tags.join(", "),
  });
  const [associateType, setAssociateType] = useState("");
  const [associateId, setAssociateId] = useState("");

  const handleEdit = () => {
    const updates: Partial<FileItem> = {
      name: editData.name,
      clientVisible: editData.clientVisible,
      tags: editData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    onEdit(file, updates);
    setShowEditDialog(false);
    toast.success("Arquivo atualizado!");
  };

  const handleAssociate = () => {
    if (associateType && associateId) {
      onAssociate(file, associateType, associateId);
      setShowAssociateDialog(false);
      setAssociateType("");
      setAssociateId("");
      toast.success("Arquivo associado!");
    }
  };

  const handleShare = (method: string) => {
    onShare(file, method);

    if (method === "whatsapp") {
      const message = `📎 Documento: ${file.name}\n\nCompartilhado via Lawdesk GED`;
      const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    } else if (method === "link") {
      navigator.clipboard.writeText(
        `${window.location.origin}/ged/file/${file.id}`,
      );
      toast.success("Link copiado para a área de transferência!");
    }
  };

  const handleSendToAI = (action: string) => {
    onSendToAI(file, action);

    const actionNames = {
      summary: "Resumo",
      petition: "Petição",
      analysis: "Análise",
      tasks: "Tarefas",
    };

    toast.success(
      `Arquivo enviado para IA: ${actionNames[action as keyof typeof actionNames]}`,
    );
  };

  const canPreview = () => {
    const previewableTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "text/plain",
    ];
    return previewableTypes.includes(file.type);
  };

  const MenuComponent = asDropdown ? DropdownMenu : ContextMenu;
  const MenuTrigger = asDropdown ? DropdownMenuTrigger : ContextMenuTrigger;
  const MenuContent = asDropdown ? DropdownMenuContent : ContextMenuContent;
  const MenuItem = asDropdown ? DropdownMenuItem : ContextMenuItem;
  const MenuSeparator = asDropdown
    ? DropdownMenuSeparator
    : ContextMenuSeparator;
  const MenuSub = asDropdown ? DropdownMenuSub : ContextMenuSub;
  const MenuSubTrigger = asDropdown
    ? DropdownMenuSubTrigger
    : ContextMenuSubTrigger;
  const MenuSubContent = asDropdown
    ? DropdownMenuSubContent
    : ContextMenuSubContent;

  return (
    <>
      <MenuComponent>
        <MenuTrigger asChild={!asDropdown}>
          {asDropdown ? (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          ) : (
            children
          )}
        </MenuTrigger>

        <MenuContent className="w-56">
          {/* Preview */}
          {canPreview() && (
            <MenuItem onClick={() => onPreview(file)}>
              <Eye className="h-4 w-4 mr-2" />
              Visualizar
            </MenuItem>
          )}

          {/* Download */}
          <MenuItem onClick={() => onDownload(file)}>
            <Download className="h-4 w-4 mr-2" />
            Baixar
          </MenuItem>

          <MenuSeparator />

          {/* Edit */}
          <MenuItem onClick={() => setShowEditDialog(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Editar
          </MenuItem>

          {/* Favorite */}
          <MenuItem onClick={() => onToggleFavorite(file)}>
            {file.isFavorite ? (
              <>
                <StarOff className="h-4 w-4 mr-2" />
                Remover dos Favoritos
              </>
            ) : (
              <>
                <Star className="h-4 w-4 mr-2" />
                Adicionar aos Favoritos
              </>
            )}
          </MenuItem>

          <MenuSeparator />

          {/* Share Submenu */}
          <MenuSub>
            <MenuSubTrigger>
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </MenuSubTrigger>
            <MenuSubContent>
              <MenuItem onClick={() => handleShare("whatsapp")}>
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp
              </MenuItem>
              <MenuItem onClick={() => handleShare("link")}>
                <Link className="h-4 w-4 mr-2" />
                Copiar Link
              </MenuItem>
              <MenuItem onClick={() => handleShare("email")}>
                <ExternalLink className="h-4 w-4 mr-2" />
                E-mail
              </MenuItem>
            </MenuSubContent>
          </MenuSub>

          {/* AI Submenu */}
          <MenuSub>
            <MenuSubTrigger>
              <Brain className="h-4 w-4 mr-2" />
              IA Jurídica
            </MenuSubTrigger>
            <MenuSubContent>
              <MenuItem onClick={() => handleSendToAI("summary")}>
                <FileText className="h-4 w-4 mr-2" />
                Gerar Resumo
              </MenuItem>
              <MenuItem onClick={() => handleSendToAI("petition")}>
                <Gavel className="h-4 w-4 mr-2" />
                Sugerir Petição
              </MenuItem>
              <MenuItem onClick={() => handleSendToAI("analysis")}>
                <Eye className="h-4 w-4 mr-2" />
                Análise Jurídica
              </MenuItem>
              <MenuItem onClick={() => handleSendToAI("tasks")}>
                <Calendar className="h-4 w-4 mr-2" />
                Sugerir Tarefas
              </MenuItem>
            </MenuSubContent>
          </MenuSub>

          {/* Associate */}
          <MenuItem onClick={() => setShowAssociateDialog(true)}>
            <Link className="h-4 w-4 mr-2" />
            Associar
          </MenuItem>

          <MenuSeparator />

          {/* Delete */}
          <MenuItem
            onClick={() => onDelete(file)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </MenuItem>
        </MenuContent>
      </MenuComponent>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Arquivo</DialogTitle>
            <DialogDescription>
              Altere as informações e configurações do arquivo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="file-name">Nome do Arquivo</Label>
              <Input
                id="file-name"
                value={editData.name}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="client-visible">Visível para Cliente</Label>
                <p className="text-sm text-muted-foreground">
                  Permitir que o cliente veja este arquivo
                </p>
              </div>
              <Switch
                id="client-visible"
                checked={editData.clientVisible}
                onCheckedChange={(checked) =>
                  setEditData((prev) => ({ ...prev, clientVisible: checked }))
                }
              />
            </div>

            <div>
              <Label htmlFor="file-tags">Tags (separadas por vírgula)</Label>
              <Input
                id="file-tags"
                value={editData.tags}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="contrato, importante, 2025"
              />
            </div>

            {/* Current associations */}
            {file.associatedWith && (
              <div>
                <Label>Associação Atual</Label>
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  {file.associatedWith.type === "client" && (
                    <Users className="h-4 w-4" />
                  )}
                  {file.associatedWith.type === "process" && (
                    <Gavel className="h-4 w-4" />
                  )}
                  {file.associatedWith.type === "contract" && (
                    <FileText className="h-4 w-4" />
                  )}
                  <span className="text-sm">{file.associatedWith.name}</span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Associate Dialog */}
      <Dialog open={showAssociateDialog} onOpenChange={setShowAssociateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Associar Arquivo</DialogTitle>
            <DialogDescription>
              Vincule este arquivo a um cliente, processo ou contrato.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="associate-type">Tipo de Associação</Label>
              <select
                id="associate-type"
                value={associateType}
                onChange={(e) => setAssociateType(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Selecione...</option>
                <option value="client">Cliente</option>
                <option value="process">Processo</option>
                <option value="contract">Contrato</option>
              </select>
            </div>

            {associateType && (
              <div>
                <Label htmlFor="associate-id">
                  {associateType === "client" && "Cliente"}
                  {associateType === "process" && "Número do Processo"}
                  {associateType === "contract" && "Contrato"}
                </Label>
                <Input
                  id="associate-id"
                  value={associateId}
                  onChange={(e) => setAssociateId(e.target.value)}
                  placeholder={
                    associateType === "client"
                      ? "Nome do cliente"
                      : associateType === "process"
                        ? "0000000-00.0000.0.00.0000"
                        : "Nome do contrato"
                  }
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAssociateDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAssociate}
              disabled={!associateType || !associateId}
            >
              Associar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
