import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Upload,
  FolderPlus,
  FileText,
  Cloud,
  X,
  Sparkles,
  FileUp,
  Download,
  Share,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface FloatingAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  action: () => void;
}

interface GEDFloatingButtonProps {
  onUpload: (files: File[]) => void;
  onCreateFolder: (name: string, type: string) => void;
  onCreateDocument: (name: string, template: string) => void;
  onSyncDrive: () => void;
}

export function GEDFloatingButton({
  onUpload,
  onCreateFolder,
  onCreateDocument,
  onSyncDrive,
}: GEDFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderType, setFolderType] = useState("folder");
  const [documentName, setDocumentName] = useState("");
  const [documentTemplate, setDocumentTemplate] = useState("blank");

  const actions: FloatingAction[] = [
    {
      id: "upload",
      title: "Novo Upload",
      description: "Enviar documentos",
      icon: Upload,
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      action: () => {
        setUploadDialogOpen(true);
        setIsOpen(false);
      },
    },
    {
      id: "folder",
      title: "Criar Pasta",
      description: "Nova estrutura",
      icon: FolderPlus,
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100",
      action: () => {
        setFolderDialogOpen(true);
        setIsOpen(false);
      },
    },
    {
      id: "document",
      title: "Novo Documento",
      description: "Criar em branco",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50 hover:bg-purple-100",
      action: () => {
        setDocumentDialogOpen(true);
        setIsOpen(false);
      },
    },
    {
      id: "sync",
      title: "Sincronizar",
      description: "Drive externo",
      icon: Cloud,
      color: "text-orange-600",
      bgColor: "bg-orange-50 hover:bg-orange-100",
      action: () => {
        onSyncDrive();
        setIsOpen(false);
        toast.success("Sincronização iniciada");
      },
    },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onUpload(Array.from(files));
      setUploadDialogOpen(false);
      event.target.value = ""; // Reset input
    }
  };

  const handleCreateFolder = () => {
    if (!folderName.trim()) {
      toast.error("Nome da pasta é obrigatório");
      return;
    }
    onCreateFolder(folderName, folderType);
    setFolderName("");
    setFolderType("folder");
    setFolderDialogOpen(false);
    toast.success("Pasta criada com sucesso");
  };

  const handleCreateDocument = () => {
    if (!documentName.trim()) {
      toast.error("Nome do documento é obrigatório");
      return;
    }
    onCreateDocument(documentName, documentTemplate);
    setDocumentName("");
    setDocumentTemplate("blank");
    setDocumentDialogOpen(false);
    toast.success("Documento criado com sucesso");
  };

  const floatingButtonVariants = {
    closed: {
      rotate: 0,
      scale: 1,
    },
    open: {
      rotate: 45,
      scale: 1.1,
    },
  };

  const actionItemVariants = {
    closed: {
      opacity: 0,
      scale: 0,
      y: 20,
    },
    open: (index: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    }),
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-4 space-y-3"
            >
              {actions.map((action, index) => (
                <motion.div
                  key={action.id}
                  custom={index}
                  variants={actionItemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="flex items-center justify-end space-x-3"
                >
                  <div className="bg-white rounded-lg shadow-lg border px-3 py-2 max-w-xs">
                    <div className="text-sm font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                  <Button
                    size="lg"
                    onClick={action.action}
                    className={`rounded-full w-14 h-14 shadow-lg ${action.bgColor} border-2 border-white hover:scale-110 transition-all duration-200`}
                  >
                    <action.icon className={`h-6 w-6 ${action.color}`} />
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB */}
        <motion.div
          variants={floatingButtonVariants}
          animate={isOpen ? "open" : "closed"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90 shadow-xl border-4 border-white"
          >
            {isOpen ? (
              <X className="h-8 w-8 text-white" />
            ) : (
              <Plus className="h-8 w-8 text-white" />
            )}
          </Button>
        </motion.div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Novo Upload</span>
            </DialogTitle>
            <DialogDescription>
              Selecione os arquivos que deseja enviar
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Card className="border-dashed border-2 border-muted hover:border-primary transition-colors">
              <CardContent className="p-8 text-center">
                <FileUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Selecione seus arquivos</p>
                  <p className="text-sm text-muted-foreground">
                    Clique no botão abaixo para escolher arquivos
                  </p>
                </div>
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Button className="mt-4" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Escolher Arquivos
                    </span>
                  </Button>
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  />
                </Label>
                <div className="mt-4 text-xs text-muted-foreground">
                  <p>Formatos suportados: PDF, DOC, DOCX, JPG, PNG, TXT</p>
                  <p>Tamanho máximo: 50MB por arquivo</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <Download className="h-8 w-8 mx-auto text-blue-600" />
                <div className="text-sm font-medium">Drag & Drop</div>
                <div className="text-xs text-muted-foreground">
                  Arraste arquivos aqui
                </div>
              </div>
              <div className="space-y-2">
                <Share className="h-8 w-8 mx-auto text-green-600" />
                <div className="text-sm font-medium">Upload Múltiplo</div>
                <div className="text-xs text-muted-foreground">
                  Vários arquivos de uma vez
                </div>
              </div>
              <div className="space-y-2">
                <Archive className="h-8 w-8 mx-auto text-purple-600" />
                <div className="text-sm font-medium">Auto-Organização</div>
                <div className="text-xs text-muted-foreground">
                  Organização automática
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Folder Dialog */}
      <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FolderPlus className="h-5 w-5" />
              <span>Criar Nova Pasta</span>
            </DialogTitle>
            <DialogDescription>
              Configure a nova pasta para organizar documentos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="folder-name">Nome da Pasta</Label>
              <Input
                id="folder-name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Ex: Contratos 2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="folder-type">Tipo de Pasta</Label>
              <Select value={folderType} onValueChange={setFolderType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="folder">📁 Pasta Comum</SelectItem>
                  <SelectItem value="client">👤 Pasta de Cliente</SelectItem>
                  <SelectItem value="process">⚖️ Pasta de Processo</SelectItem>
                  <SelectItem value="contract">📝 Pasta de Contrato</SelectItem>
                  <SelectItem value="template">��� Pasta de Modelos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setFolderDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateFolder}>
                <FolderPlus className="h-4 w-4 mr-2" />
                Criar Pasta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Document Dialog */}
      <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Criar Novo Documento</span>
            </DialogTitle>
            <DialogDescription>
              Crie um documento usando modelos pré-definidos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="document-name">Nome do Documento</Label>
              <Input
                id="document-name"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Ex: Contrato de Prestação de Serviços"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document-template">Template</Label>
              <Select
                value={documentTemplate}
                onValueChange={setDocumentTemplate}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blank">📄 Documento em Branco</SelectItem>
                  <SelectItem value="contract">
                    📝 Contrato de Prestação
                  </SelectItem>
                  <SelectItem value="petition">⚖️ Petição Inicial</SelectItem>
                  <SelectItem value="power">👥 Procuração</SelectItem>
                  <SelectItem value="receipt">
                    🧾 Recibo de Honorários
                  </SelectItem>
                  <SelectItem value="letter">✉️ Carta Advocatícia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="bg-muted/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Funcionalidades do Template</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      IA
                    </Badge>
                    <span>Preenchimento automático</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      Legal
                    </Badge>
                    <span>Termos jurídicos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      Format
                    </Badge>
                    <span>Formatação padrão</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      Save
                    </Badge>
                    <span>Auto-salvamento</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setDocumentDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateDocument}>
                <FileText className="h-4 w-4 mr-2" />
                Criar Documento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
