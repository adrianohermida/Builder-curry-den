import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Users,
  User,
  Gavel,
  FileText,
  Plus,
  MoreHorizontal,
  Edit2,
  Copy,
  Trash2,
  FolderPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export interface TreeNode {
  id: string;
  name: string;
  type: "folder" | "client" | "process" | "root";
  icon?: string;
  children?: TreeNode[];
  parentId?: string;
  isExpanded?: boolean;
  fileCount?: number;
  createdAt?: string;
  metadata?: {
    clientId?: string;
    processNumber?: string;
    description?: string;
  };
}

interface TreeViewProps {
  data: TreeNode[];
  selectedPath?: string[];
  onSelectPath: (path: string[], node: TreeNode) => void;
  onCreateFolder: (
    parentId: string,
    name: string,
    type: TreeNode["type"],
  ) => void;
  onRenameNode: (nodeId: string, newName: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onDuplicateNode: (nodeId: string) => void;
  onMoveNode: (nodeId: string, targetParentId: string) => void;
  className?: string;
}

interface TreeItemProps {
  node: TreeNode;
  level: number;
  selectedPath: string[];
  onSelectPath: (path: string[], node: TreeNode) => void;
  onCreateFolder: (
    parentId: string,
    name: string,
    type: TreeNode["type"],
  ) => void;
  onRenameNode: (nodeId: string, newName: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onDuplicateNode: (nodeId: string) => void;
  onToggleExpand: (nodeId: string) => void;
  parentPath: string[];
}

function TreeItem({
  node,
  level,
  selectedPath,
  onSelectPath,
  onCreateFolder,
  onRenameNode,
  onDeleteNode,
  onDuplicateNode,
  onToggleExpand,
  parentPath,
}: TreeItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(node.name);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderType, setNewFolderType] =
    useState<TreeNode["type"]>("folder");

  const currentPath = [...(parentPath || []), node.id];
  const isSelected = (selectedPath || []).join("/") === currentPath.join("/");
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = node.isExpanded || false;

  const handleToggle = () => {
    if (hasChildren) {
      onToggleExpand(node.id);
    }
  };

  const handleSelect = () => {
    onSelectPath(currentPath, node);
  };

  const handleRename = () => {
    if (editName.trim() && editName !== node.name) {
      onRenameNode(node.id, editName.trim());
    }
    setIsEditing(false);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(node.id, newFolderName.trim(), newFolderType);
      setNewFolderName("");
      setShowCreateDialog(false);
      toast.success("Pasta criada com sucesso!");
    }
  };

  const getIcon = () => {
    switch (node.type) {
      case "client":
        return Users;
      case "process":
        return Gavel;
      case "folder":
        return isExpanded ? FolderOpen : Folder;
      default:
        return isExpanded ? FolderOpen : Folder;
    }
  };

  const Icon = getIcon();

  const getTypeColor = () => {
    switch (node.type) {
      case "client":
        return "text-blue-600";
      case "process":
        return "text-purple-600";
      case "folder":
        return "text-amber-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger>
          <motion.div
            initial={false}
            className={`
              flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer
              hover:bg-accent/50 transition-colors relative group
              ${isSelected ? "bg-accent text-accent-foreground" : ""}
            `}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={handleSelect}
          >
            {/* Expand/Collapse Button */}
            {hasChildren && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle();
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            )}

            {/* Icon */}
            <Icon className={`h-4 w-4 ${getTypeColor()}`} />

            {/* Name */}
            {isEditing ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename();
                  if (e.key === "Escape") setIsEditing(false);
                }}
                className="h-6 text-sm"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="text-sm font-medium truncate flex-1">
                {node.name}
              </span>
            )}

            {/* File Count Badge */}
            {node.fileCount !== undefined && node.fileCount > 0 && (
              <Badge variant="secondary" className="h-5 text-xs">
                {node.fileCount}
              </Badge>
            )}

            {/* Actions Menu */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowCreateDialog(true)}>
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Nova Pasta
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Renomear
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicateNode(node.id)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDeleteNode(node.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem onClick={() => setShowCreateDialog(true)}>
            <FolderPlus className="h-4 w-4 mr-2" />
            Nova Pasta
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Renomear
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onDuplicateNode(node.id)}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicar
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => onDeleteNode(node.id)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Children */}
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {node.children?.map((child) => (
              <TreeItem
                key={child.id}
                node={child}
                level={level + 1}
                selectedPath={selectedPath}
                onSelectPath={onSelectPath}
                onCreateFolder={onCreateFolder}
                onRenameNode={onRenameNode}
                onDeleteNode={onDeleteNode}
                onDuplicateNode={onDuplicateNode}
                onToggleExpand={onToggleExpand}
                parentPath={currentPath}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Folder Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Pasta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="folder-name">Nome da Pasta</Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Ex: Contratos, Procurações..."
              />
            </div>
            <div>
              <Label htmlFor="folder-type">Tipo</Label>
              <select
                id="folder-type"
                value={newFolderType}
                onChange={(e) =>
                  setNewFolderType(e.target.value as TreeNode["type"])
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="folder">Pasta Comum</option>
                <option value="client">Pasta de Cliente</option>
                <option value="process">Pasta de Processo</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateFolder}>Criar Pasta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function TreeView({
  data,
  selectedPath = [],
  onSelectPath,
  onCreateFolder,
  onRenameNode,
  onDeleteNode,
  onDuplicateNode,
  onMoveNode,
  className,
}: TreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(["root"]),
  );

  const handleToggleExpand = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  // Update node expansion state
  const updateNodeExpansion = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.map((node) => ({
      ...node,
      isExpanded: expandedNodes.has(node.id),
      children: node.children ? updateNodeExpansion(node.children) : undefined,
    }));
  };

  const updatedData = updateNodeExpansion(data);

  return (
    <div className={`h-full overflow-y-auto ${className}`}>
      <div className="space-y-1 p-2">
        {updatedData.map((node) => (
          <TreeItem
            key={node.id}
            node={node}
            level={0}
            selectedPath={selectedPath}
            onSelectPath={onSelectPath}
            onCreateFolder={onCreateFolder}
            onRenameNode={onRenameNode}
            onDeleteNode={onDeleteNode}
            onDuplicateNode={onDuplicateNode}
            onToggleExpand={handleToggleExpand}
            parentPath={[]}
          />
        ))}
      </div>
    </div>
  );
}
