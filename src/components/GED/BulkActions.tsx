import { useState } from "react";
import {
  Download,
  Trash2,
  Eye,
  EyeOff,
  Brain,
  FolderOpen,
  Share2,
  Archive,
  CheckSquare,
  Square,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export interface SelectedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  clientVisible: boolean;
  folderId: string;
}

interface BulkActionsProps {
  selectedFiles: SelectedFile[];
  onClearSelection: () => void;
  onDeleteFiles: (fileIds: string[]) => void;
  onToggleVisibility: (fileIds: string[], visible: boolean) => void;
  onMoveFiles: (fileIds: string[], targetFolderId: string) => void;
  onSendToAI: (fileIds: string[], action: string) => void;
  availableFolders: Array<{ id: string; name: string; path: string }>;
  className?: string;
}

export function BulkActions({
  selectedFiles,
  onClearSelection,
  onDeleteFiles,
  onToggleVisibility,
  onMoveFiles,
  onSendToAI,
  availableFolders,
  className = "",
}: BulkActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [showVisibilityDialog, setShowVisibilityDialog] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [targetFolderId, setTargetFolderId] = useState("");
  const [newVisibility, setNewVisibility] = useState(true);
  const [aiAction, setAiAction] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const selectedCount = selectedFiles.length;

  if (selectedCount === 0) {
    return null;
  }

  const handleDownloadAsZip = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();

      // Simular download dos arquivos
      for (const file of selectedFiles) {
        // Em produção, você faria fetch dos arquivos reais
        const content = `Arquivo simulado: ${file.name}`;
        zip.file(file.name, content);
      }

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `documentos_${new Date().toISOString().split("T")[0]}.zip`);

      toast.success(`${selectedCount} arquivos baixados como ZIP`);
    } catch (error) {
      toast.error("Erro ao criar arquivo ZIP");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDeleteFiles = () => {
    onDeleteFiles(selectedFiles.map((f) => f.id));
    setShowDeleteDialog(false);
    onClearSelection();
    toast.success(`${selectedCount} arquivo(s) movido(s) para a lixeira`);
  };

  const handleMoveFiles = () => {
    if (!targetFolderId) {
      toast.error("Selecione uma pasta de destino");
      return;
    }

    onMoveFiles(
      selectedFiles.map((f) => f.id),
      targetFolderId,
    );
    setShowMoveDialog(false);
    setTargetFolderId("");
    onClearSelection();

    const targetFolder = availableFolders.find((f) => f.id === targetFolderId);
    toast.success(
      `${selectedCount} arquivo(s) movido(s) para ${targetFolder?.name}`,
    );
  };

  const handleToggleVisibility = () => {
    onToggleVisibility(
      selectedFiles.map((f) => f.id),
      newVisibility,
    );
    setShowVisibilityDialog(false);
    onClearSelection();

    const action = newVisibility ? "tornados visíveis" : "ocultados";
    toast.success(`${selectedCount} arquivo(s) ${action} para clientes`);
  };

  const handleSendToAI = () => {
    if (!aiAction) {
      toast.error("Selecione uma ação de IA");
      return;
    }

    onSendToAI(
      selectedFiles.map((f) => f.id),
      aiAction,
    );
    setShowAIDialog(false);
    setAiAction("");
    onClearSelection();

    toast.success(`${selectedCount} arquivo(s) enviado(s) para IA Jurídica`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

  return (
    <>
      <div
        className={`bg-primary text-primary-foreground p-4 rounded-lg ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckSquare className="h-5 w-5" />
            <div>
              <p className="font-medium">
                {selectedCount} arquivo{selectedCount !== 1 ? "s" : ""}{" "}
                selecionado{selectedCount !== 1 ? "s" : ""}
              </p>
              <p className="text-sm opacity-90">
                {formatFileSize(totalSize)} total
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download ZIP */}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownloadAsZip}
              disabled={isDownloading}
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? "Gerando..." : "Baixar ZIP"}
            </Button>

            {/* Move to Folder */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowMoveDialog(true)}
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Mover
            </Button>

            {/* Toggle Visibility */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowVisibilityDialog(true)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Visibilidade
            </Button>

            {/* Send to AI */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAIDialog(true)}
            >
              <Brain className="h-4 w-4 mr-2" />
              IA Jurídica
            </Button>

            {/* Delete */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>

            {/* Clear Selection */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="text-primary-foreground hover:text-primary-foreground/80"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Deseja realmente mover {selectedCount} arquivo
              {selectedCount !== 1 ? "s" : ""} para a lixeira? Esta ação pode
              ser desfeita posteriormente.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-32 overflow-y-auto">
            <ul className="text-sm space-y-1">
              {selectedFiles.map((file) => (
                <li key={file.id} className="truncate">
                  • {file.name}
                </li>
              ))}
            </ul>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteFiles}>
              Mover para Lixeira
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move Files Dialog */}
      <Dialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mover Arquivos</DialogTitle>
            <DialogDescription>
              Selecione a pasta de destino para {selectedCount} arquivo
              {selectedCount !== 1 ? "s" : ""}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="target-folder">Pasta de Destino</Label>
              <Select value={targetFolderId} onValueChange={setTargetFolderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma pasta" />
                </SelectTrigger>
                <SelectContent>
                  {availableFolders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.path}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMoveDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleMoveFiles} disabled={!targetFolderId}>
              Mover Arquivos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Visibility Dialog */}
      <Dialog
        open={showVisibilityDialog}
        onOpenChange={setShowVisibilityDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Visibilidade</DialogTitle>
            <DialogDescription>
              Configure a visibilidade para clientes dos {selectedCount} arquivo
              {selectedCount !== 1 ? "s" : ""} selecionado
              {selectedCount !== 1 ? "s" : ""}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="client-visible"
                checked={newVisibility}
                onCheckedChange={(checked) => setNewVisibility(!!checked)}
              />
              <Label htmlFor="client-visible">
                Tornar visível para clientes
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Arquivos visíveis para clientes aparecerão no portal do cliente e
              podem ser compartilhados.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowVisibilityDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleToggleVisibility}>Aplicar Alteração</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Actions Dialog */}
      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>IA Jurídica</DialogTitle>
            <DialogDescription>
              Selecione a ação que deseja realizar com {selectedCount} arquivo
              {selectedCount !== 1 ? "s" : ""} usando IA.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="ai-action">Ação da IA</Label>
              <Select value={aiAction} onValueChange={setAiAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Gerar Resumo</SelectItem>
                  <SelectItem value="petition">Sugerir Petição</SelectItem>
                  <SelectItem value="analysis">Análise Jurídica</SelectItem>
                  <SelectItem value="case-study">Estudo de Caso</SelectItem>
                  <SelectItem value="tasks">Sugerir Tarefas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              A IA analisará os documentos selecionados e fornecerá insights
              jurídicos baseados no conteúdo.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAIDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSendToAI} disabled={!aiAction}>
              Enviar para IA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
