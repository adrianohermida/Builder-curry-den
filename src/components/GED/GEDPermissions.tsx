import { useState } from "react";
import {
  Shield,
  Users,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  User,
  UserCheck,
  UserX,
  Settings,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { FileItem } from "./FileContextMenu";

export type UserRole = "master" | "colaborador" | "cliente" | "estagiario";

export interface UserPermission {
  userId: string;
  userName: string;
  role: UserRole;
  email: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
  canUpload: boolean;
  canCreateFolders: boolean;
  restrictedFolders?: string[];
  clientId?: string; // Para usuários tipo 'cliente'
}

interface GEDPermissionsProps {
  file?: FileItem;
  folderId?: string;
  onUpdatePermissions: (permissions: UserPermission[]) => void;
  className?: string;
}

export function GEDPermissions({
  file,
  folderId,
  onUpdatePermissions,
  className = "",
}: GEDPermissionsProps) {
  const [permissions, setPermissions] = useState<UserPermission[]>([
    {
      userId: "user_001",
      userName: "Advogado Silva",
      role: "master",
      email: "silva@lawdesk.com",
      canView: true,
      canEdit: true,
      canDelete: true,
      canShare: true,
      canUpload: true,
      canCreateFolders: true,
    },
    {
      userId: "user_002",
      userName: "Assistente Maria",
      role: "colaborador",
      email: "maria@lawdesk.com",
      canView: true,
      canEdit: true,
      canDelete: false,
      canShare: true,
      canUpload: true,
      canCreateFolders: true,
      restrictedFolders: ["confidential"],
    },
    {
      userId: "user_003",
      userName: "João Silva (Cliente)",
      role: "cliente",
      email: "joao@email.com",
      canView: true,
      canEdit: false,
      canDelete: false,
      canShare: false,
      canUpload: true,
      canCreateFolders: false,
      clientId: "client_001",
    },
  ]);

  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("colaborador");

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "master":
        return <Shield className="h-4 w-4 text-red-600" />;
      case "colaborador":
        return <UserCheck className="h-4 w-4 text-blue-600" />;
      case "cliente":
        return <User className="h-4 w-4 text-green-600" />;
      case "estagiario":
        return <UserX className="h-4 w-4 text-orange-600" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "master":
        return "bg-red-100 text-red-800 border-red-200";
      case "colaborador":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cliente":
        return "bg-green-100 text-green-800 border-green-200";
      case "estagiario":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case "master":
        return "Acesso total ao sistema, pode gerenciar todos os documentos e usuários";
      case "colaborador":
        return "Pode criar, editar e compartilhar documentos, com algumas restrições";
      case "cliente":
        return "Acesso apenas aos seus documentos e pastas específicas";
      case "estagiario":
        return "Acesso limitado, pode visualizar e fazer upload básico";
      default:
        return "";
    }
  };

  const updateUserPermission = (
    userId: string,
    field: keyof UserPermission,
    value: any,
  ) => {
    setPermissions((prev) =>
      prev.map((user) =>
        user.userId === userId ? { ...user, [field]: value } : user,
      ),
    );
  };

  const removeUser = (userId: string) => {
    setPermissions((prev) => prev.filter((user) => user.userId !== userId));
  };

  const addUser = () => {
    if (newUserEmail) {
      const newUser: UserPermission = {
        userId: `user_${Date.now()}`,
        userName: newUserEmail.split("@")[0],
        role: newUserRole,
        email: newUserEmail,
        canView: true,
        canEdit: newUserRole !== "cliente",
        canDelete: newUserRole === "master",
        canShare: newUserRole !== "cliente",
        canUpload: true,
        canCreateFolders:
          newUserRole !== "cliente" && newUserRole !== "estagiario",
      };

      setPermissions((prev) => [...prev, newUser]);
      setNewUserEmail("");
      setShowAddUserDialog(false);
    }
  };

  const getPermissionSummary = (user: UserPermission) => {
    const permissions = [];
    if (user.canView) permissions.push("Visualizar");
    if (user.canEdit) permissions.push("Editar");
    if (user.canDelete) permissions.push("Excluir");
    if (user.canShare) permissions.push("Compartilhar");
    if (user.canUpload) permissions.push("Upload");
    if (user.canCreateFolders) permissions.push("Criar Pastas");

    return permissions.join(", ");
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Permissões e Segurança
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {file
                  ? `Gerenciar acesso ao arquivo: ${file.name}`
                  : "Gerenciar permissões da pasta"}
              </p>
            </div>

            <Dialog
              open={showAddUserDialog}
              onOpenChange={setShowAddUserDialog}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Adicionar Usuário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Usuário</DialogTitle>
                  <DialogDescription>
                    Conceder acesso a um novo usuário
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="user-email">E-mail do Usuário</Label>
                    <input
                      id="user-email"
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="usuario@email.com"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-role">Função</Label>
                    <Select
                      value={newUserRole}
                      onValueChange={(value: UserRole) => setNewUserRole(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="colaborador">Colaborador</SelectItem>
                        <SelectItem value="estagiario">Estagiário</SelectItem>
                        <SelectItem value="cliente">Cliente</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getRoleDescription(newUserRole)}
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddUserDialog(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={addUser} disabled={!newUserEmail}>
                    Adicionar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Security Status */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              {file?.clientVisible ? (
                <Eye className="h-4 w-4 text-green-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-orange-600" />
              )}
              <span className="font-medium">
                {file?.clientVisible
                  ? "Visível para clientes"
                  : "Apenas interno"}
              </span>
            </div>
            <Badge variant={file?.clientVisible ? "default" : "secondary"}>
              {file?.clientVisible ? "Público" : "Privado"}
            </Badge>
          </div>

          {/* Users List */}
          <div className="space-y-4">
            <h4 className="font-medium">Usuários com Acesso</h4>

            {permissions.map((user) => (
              <div
                key={user.userId}
                className="border rounded-lg p-4 space-y-3"
              >
                {/* User Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getRoleIcon(user.role)}
                    <div>
                      <p className="font-medium">{user.userName}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRoleColor(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                    {user.role !== "master" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUser(user.userId)}
                        className="text-destructive hover:text-destructive"
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                </div>

                {/* Permissions Grid */}
                {user.role !== "master" && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={`view-${user.userId}`}
                        className="text-sm"
                      >
                        Visualizar
                      </Label>
                      <Switch
                        id={`view-${user.userId}`}
                        checked={user.canView}
                        onCheckedChange={(checked) =>
                          updateUserPermission(user.userId, "canView", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={`edit-${user.userId}`}
                        className="text-sm"
                      >
                        Editar
                      </Label>
                      <Switch
                        id={`edit-${user.userId}`}
                        checked={user.canEdit}
                        onCheckedChange={(checked) =>
                          updateUserPermission(user.userId, "canEdit", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={`delete-${user.userId}`}
                        className="text-sm"
                      >
                        Excluir
                      </Label>
                      <Switch
                        id={`delete-${user.userId}`}
                        checked={user.canDelete}
                        onCheckedChange={(checked) =>
                          updateUserPermission(
                            user.userId,
                            "canDelete",
                            checked,
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={`share-${user.userId}`}
                        className="text-sm"
                      >
                        Compartilhar
                      </Label>
                      <Switch
                        id={`share-${user.userId}`}
                        checked={user.canShare}
                        onCheckedChange={(checked) =>
                          updateUserPermission(user.userId, "canShare", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={`upload-${user.userId}`}
                        className="text-sm"
                      >
                        Upload
                      </Label>
                      <Switch
                        id={`upload-${user.userId}`}
                        checked={user.canUpload}
                        onCheckedChange={(checked) =>
                          updateUserPermission(
                            user.userId,
                            "canUpload",
                            checked,
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={`folders-${user.userId}`}
                        className="text-sm"
                      >
                        Criar Pastas
                      </Label>
                      <Switch
                        id={`folders-${user.userId}`}
                        checked={user.canCreateFolders}
                        onCheckedChange={(checked) =>
                          updateUserPermission(
                            user.userId,
                            "canCreateFolders",
                            checked,
                          )
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Master user info */}
                {user.role === "master" && (
                  <div className="pt-3 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Acesso total ao sistema (não editável)</span>
                    </div>
                  </div>
                )}

                {/* Restricted folders for non-master users */}
                {user.restrictedFolders &&
                  user.restrictedFolders.length > 0 && (
                    <div className="pt-3 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span>Acesso restrito a algumas pastas</span>
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>

          {/* Security Summary */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Resumo de Segurança</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Total de usuários:</span>
                <span className="ml-2">{permissions.length}</span>
              </div>
              <div>
                <span className="font-medium">Usuários com acesso total:</span>
                <span className="ml-2">
                  {permissions.filter((u) => u.role === "master").length}
                </span>
              </div>
              <div>
                <span className="font-medium">Clientes com acesso:</span>
                <span className="ml-2">
                  {permissions.filter((u) => u.role === "cliente").length}
                </span>
              </div>
              <div>
                <span className="font-medium">Visibilidade:</span>
                <span className="ml-2">
                  {file?.clientVisible
                    ? "Pública para clientes"
                    : "Apenas interna"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button onClick={() => onUpdatePermissions(permissions)}>
              <Settings className="h-4 w-4 mr-2" />
              Salvar Permissões
            </Button>
            <Button variant="outline">
              <Lock className="h-4 w-4 mr-2" />
              Gerar Relatório de Acesso
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
