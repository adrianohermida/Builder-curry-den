import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FolderOpen,
  Users,
  Gavel,
  Star,
  Trash2,
  FileText,
  BarChart3,
  Eye,
  EyeOff,
  TrendingUp,
  Calendar,
  Plus,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { DocumentStats } from "@/hooks/useGEDDocuments";

interface GEDSidebarProps {
  stats: DocumentStats | null;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function GEDSidebar({
  stats,
  activeSection,
  onSectionChange,
}: GEDSidebarProps) {
  const location = useLocation();

  const menuItems = [
    {
      id: "todos",
      title: "Todos os Documentos",
      icon: FolderOpen,
      href: "/ged",
      count: stats?.total || 0,
      color: "text-blue-500",
    },
    {
      id: "favoritos",
      title: "Favoritos",
      icon: Star,
      href: "/ged/favoritos",
      count: stats?.favorites || 0,
      color: "text-yellow-500",
    },
    {
      id: "lixeira",
      title: "Lixeira",
      icon: Trash2,
      href: "/ged/lixeira",
      count: stats?.deleted || 0,
      color: "text-red-500",
    },
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getStoragePercentage = () => {
    if (!stats?.totalSize) return 0;
    // Simular limite de 10GB
    const limitBytes = 10 * 1024 * 1024 * 1024;
    return Math.min((stats.totalSize / limitBytes) * 100, 100);
  };

  return (
    <div className="w-80 border-r bg-card overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Menu Principal */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            NAVEGAÇÃO
          </h3>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-[rgb(var(--theme-primary))] text-white",
                )}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className={cn("h-4 w-4 mr-3", item.color)} />
                <span className="flex-1 text-left">{item.title}</span>
                <Badge
                  variant={isActive ? "secondary" : "outline"}
                  className="ml-2"
                >
                  {item.count}
                </Badge>
              </Button>
            );
          })}
        </div>

        <Separator />

        {/* Filtros Rápidos por Cliente */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            POR CLIENTE
          </h3>
          <div className="space-y-2">
            {stats &&
              Object.entries(stats.byClient)
                .slice(0, 5)
                .map(([client, count]) => (
                  <Link
                    key={client}
                    to={`/ged?client=${encodeURIComponent(client)}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-sm truncate">{client}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {count}
                    </Badge>
                  </Link>
                ))}

            {stats && Object.keys(stats.byClient).length > 5 && (
              <Link
                to="/ged?view=clients"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center"
              >
                <Plus className="h-3 w-3 mr-1" />
                Ver todos os clientes
              </Link>
            )}
          </div>
        </div>

        <Separator />

        {/* Filtros por Processo */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            POR PROCESSO
          </h3>
          <div className="space-y-2">
            {stats &&
              Object.entries(stats.byProcess)
                .slice(0, 3)
                .map(([process, count]) => (
                  <Link
                    key={process}
                    to={`/ged?process=${encodeURIComponent(process)}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Gavel className="h-4 w-4 text-green-500" />
                      <span className="text-xs font-mono truncate">
                        {process}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {count}
                    </Badge>
                  </Link>
                ))}

            {stats && Object.keys(stats.byProcess).length > 3 && (
              <Link
                to="/ged?view=processes"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center"
              >
                <Plus className="h-3 w-3 mr-1" />
                Ver todos os processos
              </Link>
            )}
          </div>
        </div>

        <Separator />

        {/* Estatísticas de Armazenamento */}
        <Card className="bg-muted/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <BarChart3 className="h-4 w-4 mr-2 text-purple-500" />
              Uso de Armazenamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Espaço Usado</span>
                <span className="font-medium">
                  {formatFileSize(stats?.totalSize || 0)}
                </span>
              </div>
              <Progress value={getStoragePercentage()} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                <span>{getStoragePercentage().toFixed(1)}% usado</span>
                <span>10 GB limite</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Eye className="h-3 w-3 text-green-500" />
                  <span>Visível Cliente</span>
                </div>
                <span className="font-medium">{stats?.clientVisible || 0}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <EyeOff className="h-3 w-3 text-gray-500" />
                  <span>Apenas Interno</span>
                </div>
                <span className="font-medium">
                  {(stats?.total || 0) - (stats?.clientVisible || 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tipos de Arquivo */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            TIPOS DE ARQUIVO
          </h3>
          <div className="space-y-2">
            {stats &&
              Object.entries(stats.byType)
                .slice(0, 4)
                .map(([type, count]) => {
                  const getTypeIcon = (extension: string) => {
                    switch (extension.toLowerCase()) {
                      case "pdf":
                        return { icon: FileText, color: "text-red-500" };
                      case "docx":
                      case "doc":
                        return { icon: FileText, color: "text-blue-500" };
                      case "xlsx":
                      case "xls":
                        return { icon: FileText, color: "text-green-500" };
                      default:
                        return { icon: FileText, color: "text-gray-500" };
                    }
                  };

                  const { icon: Icon, color } = getTypeIcon(type);

                  return (
                    <div
                      key={type}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className={cn("h-3 w-3", color)} />
                        <span className="text-xs">{type}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {count}
                      </Badge>
                    </div>
                  );
                })}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            AÇÕES RÁPIDAS
          </h3>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            asChild
          >
            <Link to="/ged?search=hoje">
              <Calendar className="h-4 w-4 mr-2" />
              Adicionados Hoje
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            asChild
          >
            <Link to="/ged?search=cliente">
              <Search className="h-4 w-4 mr-2" />
              Busca Avançada
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            asChild
          >
            <Link to="/configuracoes/armazenamento">
              <BarChart3 className="h-4 w-4 mr-2" />
              Configurações
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
