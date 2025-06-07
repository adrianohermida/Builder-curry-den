import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  Search,
  Users,
  Building2,
  User,
  Folder,
  FolderOpen,
  Plus,
  MoreHorizontal,
  Filter,
  MapPin,
  Calendar,
  Star,
  Eye,
  EyeOff,
  Archive,
  Trash2,
  Edit3,
  Copy,
  FileText,
  DollarSign,
  Scale,
  Home,
  BookOpen,
  Crown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface ClientData {
  id: string;
  name: string;
  type: "fisica" | "juridica";
  cpfCnpj: string;
  email?: string;
  phone?: string;
  lastAccess?: string;
  fileCount: number;
  activeProcesses: number;
  favoriteCount: number;
  tags: string[];
  status: "active" | "inactive" | "archived";
  createdAt: string;
  avatar?: string;
}

interface FolderStructure {
  id: string;
  name: string;
  icon: string;
  type:
    | "contratos"
    | "processos"
    | "financeiro"
    | "documentos"
    | "estante"
    | "custom";
  fileCount: number;
  lastModified: string;
  isVisible: boolean;
  children?: FolderStructure[];
}

interface GEDTreeProps {
  clients: ClientData[];
  selectedPath: string[];
  onNavigate: (path: string[], clientData?: ClientData) => void;
  onCreateClient: (type: "fisica" | "juridica") => void;
  onCreateFolder: (
    clientId: string,
    folderData: Partial<FolderStructure>,
  ) => void;
  onApplyTemplate: (clientId: string, templateId: string) => void;
  className?: string;
}

const alphabetGroups = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const defaultFolderStructure: FolderStructure[] = [
  {
    id: "contratos",
    name: "Contratos",
    icon: "📝",
    type: "contratos",
    fileCount: 0,
    lastModified: new Date().toISOString(),
    isVisible: true,
  },
  {
    id: "processos",
    name: "Processos",
    icon: "⚖️",
    type: "processos",
    fileCount: 0,
    lastModified: new Date().toISOString(),
    isVisible: true,
  },
  {
    id: "financeiro",
    name: "Financeiro",
    icon: "💰",
    type: "financeiro",
    fileCount: 0,
    lastModified: new Date().toISOString(),
    isVisible: true,
  },
  {
    id: "documentos",
    name: "Documentos Pessoais",
    icon: "👤",
    type: "documentos",
    fileCount: 0,
    lastModified: new Date().toISOString(),
    isVisible: true,
  },
  {
    id: "estante",
    name: "Estante Digital",
    icon: "📚",
    type: "estante",
    fileCount: 0,
    lastModified: new Date().toISOString(),
    isVisible: true,
  },
];

export function GEDSmartTreeNavigation({
  clients,
  selectedPath,
  onNavigate,
  onCreateClient,
  onCreateFolder,
  onApplyTemplate,
  className = "",
}: GEDTreeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<{
    [key: string]: boolean;
  }>({
    fisica: true,
    juridica: true,
  });
  const [expandedLetters, setExpandedLetters] = useState<{
    [key: string]: boolean;
  }>({});
  const [expandedClients, setExpandedClients] = useState<{
    [key: string]: boolean;
  }>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Agrupar clientes por tipo e letra
  const groupedClients = useMemo(() => {
    const filtered = clients.filter(
      (client) =>
        searchQuery === "" ||
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.cpfCnpj.includes(searchQuery) ||
        client.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    );

    const grouped = {
      fisica: {} as { [letter: string]: ClientData[] },
      juridica: {} as { [letter: string]: ClientData[] },
    };

    alphabetGroups.forEach((letter) => {
      grouped.fisica[letter] = [];
      grouped.juridica[letter] = [];
    });

    filtered.forEach((client) => {
      const firstLetter = client.name.charAt(0).toUpperCase();
      const letter = alphabetGroups.includes(firstLetter) ? firstLetter : "Z";
      grouped[client.type][letter].push(client);
    });

    // Ordenar por nome dentro de cada letra
    Object.keys(grouped.fisica).forEach((letter) => {
      grouped.fisica[letter].sort((a, b) => a.name.localeCompare(b.name));
    });
    Object.keys(grouped.juridica).forEach((letter) => {
      grouped.juridica[letter].sort((a, b) => a.name.localeCompare(b.name));
    });

    return grouped;
  }, [clients, searchQuery]);

  const handleToggleGroup = (type: "fisica" | "juridica") => {
    setExpandedGroups((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleToggleLetter = (type: "fisica" | "juridica", letter: string) => {
    const key = `${type}_${letter}`;
    setExpandedLetters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleClient = (clientId: string) => {
    setExpandedClients((prev) => ({ ...prev, [clientId]: !prev[clientId] }));
  };

  const handleExpandAll = (type: "fisica" | "juridica") => {
    const updates: { [key: string]: boolean } = {};
    alphabetGroups.forEach((letter) => {
      if (groupedClients[type][letter].length > 0) {
        updates[`${type}_${letter}`] = true;
      }
    });
    setExpandedLetters((prev) => ({ ...prev, ...updates }));
  };

  const getClientIcon = (client: ClientData) => {
    if (client.type === "fisica") return User;
    return Building2;
  };

  const getFolderIcon = (folder: FolderStructure) => {
    switch (folder.type) {
      case "contratos":
        return FileText;
      case "processos":
        return Scale;
      case "financeiro":
        return DollarSign;
      case "documentos":
        return User;
      case "estante":
        return BookOpen;
      default:
        return Folder;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600";
      case "inactive":
        return "text-gray-500";
      case "archived":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const breadcrumbs = useMemo(() => {
    if (selectedPath.length === 0) return [];

    const segments = [];
    const currentClient = clients.find((c) => c.id === selectedPath[0]);

    if (currentClient) {
      segments.push({
        label: currentClient.name,
        path: [currentClient.id],
        icon: currentClient.type === "fisica" ? "👤" : "🏢",
      });

      if (selectedPath.length > 1) {
        const folderName = selectedPath[1];
        const folder = defaultFolderStructure.find((f) => f.id === folderName);
        segments.push({
          label: folder?.name || folderName,
          path: selectedPath.slice(0, 2),
          icon: folder?.icon || "📁",
        });
      }
    }

    return segments;
  }, [selectedPath, clients]);

  const ClientItem = ({ client }: { client: ClientData }) => {
    const isExpanded = expandedClients[client.id];
    const isSelected = selectedPath[0] === client.id;
    const Icon = getClientIcon(client);

    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="space-y-1">
            <div
              className={`group flex items-center space-x-2 px-2 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-muted/60"
              }`}
              onClick={() => {
                onNavigate([client.id], client);
                handleToggleClient(client.id);
              }}
              onMouseEnter={() => setHoveredItem(client.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleClient(client.id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>

              <div className="relative">
                {client.avatar ? (
                  <img
                    src={client.avatar}
                    alt={client.name}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      client.type === "fisica"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                  </div>
                )}
                {client.status === "active" && (
                  <div className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-green-500 rounded-full border border-white" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium truncate">
                    {client.name}
                  </span>
                  {client.favoriteCount > 0 && (
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  )}
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>{client.fileCount} docs</span>
                  {client.activeProcesses > 0 && (
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      {client.activeProcesses} proc.
                    </Badge>
                  )}
                </div>
              </div>

              <div
                className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                  hoveredItem === client.id ? "opacity-100" : ""
                }`}
              >
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <Collapsible open={isExpanded}>
              <CollapsibleContent>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-6 space-y-1 border-l border-muted pl-2"
                >
                  {defaultFolderStructure.map((folder) => {
                    const FolderIcon = getFolderIcon(folder);
                    const isFolderSelected =
                      selectedPath[0] === client.id &&
                      selectedPath[1] === folder.id;

                    return (
                      <div
                        key={folder.id}
                        className={`flex items-center space-x-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                          isFolderSelected
                            ? "bg-primary/20 text-primary border border-primary/30"
                            : "hover:bg-muted/40"
                        }`}
                        onClick={() =>
                          onNavigate([client.id, folder.id], client)
                        }
                      >
                        <div className="text-base">{folder.icon}</div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium">
                            {folder.name}
                          </span>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>{folder.fileCount} itens</span>
                            {!folder.isVisible && (
                              <EyeOff className="h-3 w-3" />
                            )}
                          </div>
                        </div>
                        {folder.type === "estante" && (
                          <Crown className="h-3 w-3 text-amber-500" />
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem onClick={() => onNavigate([client.id], client)}>
            <Eye className="h-4 w-4 mr-2" />
            Abrir Cliente
          </ContextMenuItem>
          <ContextMenuItem>
            <Edit3 className="h-4 w-4 mr-2" />
            Editar Dados
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <Plus className="h-4 w-4 mr-2" />
              Nova Pasta
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem
                onClick={() =>
                  onCreateFolder(client.id, {
                    name: "Nova Pasta",
                    type: "custom",
                  })
                }
              >
                <Folder className="h-4 w-4 mr-2" />
                Pasta Personalizada
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => onApplyTemplate(client.id, "template_civel")}
              >
                <Scale className="h-4 w-4 mr-2" />
                Modelo Cível
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() =>
                  onApplyTemplate(client.id, "template_trabalhista")
                }
              >
                <Users className="h-4 w-4 mr-2" />
                Modelo Trabalhista
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <Copy className="h-4 w-4 mr-2" />
            Duplicar Estrutura
          </ContextMenuItem>
          <ContextMenuItem>
            <Archive className="h-4 w-4 mr-2" />
            Arquivar Cliente
          </ContextMenuItem>
          <ContextMenuItem className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir Cliente
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  return (
    <TooltipProvider>
      <div className={`h-full flex flex-col bg-card border-r ${className}`}>
        {/* Header com busca */}
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Navegação GED</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="h-3 w-3" />
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes, documentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Home className="h-3 w-3" />
              {breadcrumbs.map((segment, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-xs">{segment.icon}</span>
                  <button
                    onClick={() => onNavigate(segment.path)}
                    className="hover:text-foreground transition-colors"
                  >
                    {segment.label}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Área de navegação */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          {/* Pessoa Física */}
          <div className="space-y-2">
            <Collapsible open={expandedGroups.fisica}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-8 px-2"
                  onClick={() => handleToggleGroup("fisica")}
                >
                  {expandedGroups.fisica ? (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-2" />
                  )}
                  <User className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="font-medium">Pessoa Física</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {Object.values(groupedClients.fisica).flat().length}
                  </Badge>
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="ml-4 space-y-1">
                  {alphabetGroups.map((letter) => {
                    const letterClients = groupedClients.fisica[letter];
                    if (letterClients.length === 0) return null;

                    const letterKey = `fisica_${letter}`;
                    const isLetterExpanded = expandedLetters[letterKey];

                    return (
                      <div key={letter} className="space-y-1">
                        <Collapsible open={isLetterExpanded}>
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-start h-7 px-2 text-xs"
                              onClick={() =>
                                handleToggleLetter("fisica", letter)
                              }
                            >
                              {isLetterExpanded ? (
                                <ChevronDown className="h-3 w-3 mr-2" />
                              ) : (
                                <ChevronRight className="h-3 w-3 mr-2" />
                              )}
                              <span className="font-medium bg-blue-100 text-blue-700 rounded px-1.5 py-0.5">
                                {letter}
                              </span>
                              <Badge
                                variant="outline"
                                className="ml-auto text-xs"
                              >
                                {letterClients.length}
                              </Badge>
                            </Button>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <div className="ml-4 space-y-1">
                              {letterClients.map((client) => (
                                <ClientItem key={client.id} client={client} />
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => handleExpandAll("fisica")}
                  >
                    Expandir Todos
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <Separator />

          {/* Pessoa Jurídica */}
          <div className="space-y-2">
            <Collapsible open={expandedGroups.juridica}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-8 px-2"
                  onClick={() => handleToggleGroup("juridica")}
                >
                  {expandedGroups.juridica ? (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-2" />
                  )}
                  <Building2 className="h-4 w-4 mr-2 text-purple-600" />
                  <span className="font-medium">Pessoa Jurídica</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {Object.values(groupedClients.juridica).flat().length}
                  </Badge>
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="ml-4 space-y-1">
                  {alphabetGroups.map((letter) => {
                    const letterClients = groupedClients.juridica[letter];
                    if (letterClients.length === 0) return null;

                    const letterKey = `juridica_${letter}`;
                    const isLetterExpanded = expandedLetters[letterKey];

                    return (
                      <div key={letter} className="space-y-1">
                        <Collapsible open={isLetterExpanded}>
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-start h-7 px-2 text-xs"
                              onClick={() =>
                                handleToggleLetter("juridica", letter)
                              }
                            >
                              {isLetterExpanded ? (
                                <ChevronDown className="h-3 w-3 mr-2" />
                              ) : (
                                <ChevronRight className="h-3 w-3 mr-2" />
                              )}
                              <span className="font-medium bg-purple-100 text-purple-700 rounded px-1.5 py-0.5">
                                {letter}
                              </span>
                              <Badge
                                variant="outline"
                                className="ml-auto text-xs"
                              >
                                {letterClients.length}
                              </Badge>
                            </Button>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <div className="ml-4 space-y-1">
                              {letterClients.map((client) => (
                                <ClientItem key={client.id} client={client} />
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => handleExpandAll("juridica")}
                  >
                    Expandir Todos
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Footer com ações rápidas */}
        <div className="p-3 border-t space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCreateClient("fisica")}
              className="text-xs"
            >
              <User className="h-3 w-3 mr-1" />
              P. Física
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCreateClient("juridica")}
              className="text-xs"
            >
              <Building2 className="h-3 w-3 mr-1" />
              P. Jurídica
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            {clients.length} cliente(s) •{" "}
            {clients.reduce((sum, c) => sum + c.fileCount, 0)} doc(s)
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
