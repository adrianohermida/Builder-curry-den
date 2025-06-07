import { useMemo } from "react";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  FileText,
  Users,
  Eye,
  Star,
  Download,
  Upload,
  Calendar,
  Activity,
  Archive,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { GEDStats as StatsType } from "@/hooks/useGEDAdvanced";
import { FileItem } from "./FileContextMenu";
import { TreeNode } from "./TreeView";

interface GEDStatsProps {
  stats: StatsType;
  files: FileItem[];
  treeData: TreeNode[];
  className?: string;
}

export function GEDStats({
  stats,
  files,
  treeData,
  className = "",
}: GEDStatsProps) {
  // Calculate additional statistics
  const additionalStats = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentFiles = files.filter((f) => new Date(f.createdAt) > oneWeekAgo);
    const monthlyFiles = files.filter(
      (f) => new Date(f.createdAt) > oneMonthAgo,
    );

    // File type distribution
    const typeDistribution = files.reduce(
      (acc, file) => {
        const extension = file.name.split(".").pop()?.toUpperCase() || "OTHER";
        acc[extension] = (acc[extension] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Upload trends by day
    const uploadTrends = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayFiles = files.filter((f) => {
        const fileDate = new Date(f.createdAt);
        return fileDate.toDateString() === date.toDateString();
      }).length;

      return {
        day: date.toLocaleDateString("pt-BR", { weekday: "short" }),
        files: dayFiles,
      };
    }).reverse();

    // Popular files (most favorited or most accessed)
    const popularFiles = files
      .filter((f) => f.isFavorite)
      .sort((a, b) => b.name.localeCompare(a.name))
      .slice(0, 5);

    // Client access stats
    const clientAccessStats = {
      totalClientVisible: files.filter((f) => f.clientVisible).length,
      totalPrivate: files.filter((f) => !f.clientVisible).length,
      clientPercentage:
        Math.round(
          (files.filter((f) => f.clientVisible).length / files.length) * 100,
        ) || 0,
    };

    // Storage by user
    const userStats = files.reduce(
      (acc, file) => {
        const user = file.uploadedBy;
        if (!acc[user]) {
          acc[user] = { count: 0, size: 0 };
        }
        acc[user].count++;
        acc[user].size += file.size;
        return acc;
      },
      {} as Record<string, { count: number; size: number }>,
    );

    return {
      recentFiles: recentFiles.length,
      monthlyFiles: monthlyFiles.length,
      typeDistribution,
      uploadTrends,
      popularFiles,
      clientAccessStats,
      userStats,
    };
  }, [files]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileTypeIcon = (extension: string) => {
    switch (extension) {
      case "PDF":
        return "📄";
      case "DOCX":
      case "DOC":
        return "📝";
      case "XLSX":
      case "XLS":
        return "📊";
      case "JPG":
      case "JPEG":
      case "PNG":
      case "GIF":
        return "🖼️";
      case "MP4":
      case "AVI":
        return "🎥";
      case "MP3":
      case "WAV":
        return "🎵";
      case "ZIP":
      case "RAR":
        return "📦";
      default:
        return "📄";
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total de Arquivos
                </p>
                <p className="text-2xl font-bold">{stats.totalFiles}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />+
                  {additionalStats.recentFiles} esta semana
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Armazenamento</p>
                <p className="text-2xl font-bold">
                  {formatFileSize(stats.totalSize)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stats.folderCount} pastas
                </p>
              </div>
              <Archive className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Favoritos</p>
                <p className="text-2xl font-bold">{stats.favoriteFiles}</p>
                <p className="text-xs text-yellow-600 flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Marcados
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Acesso Cliente</p>
                <p className="text-2xl font-bold">
                  {additionalStats.clientAccessStats.clientPercentage}%
                </p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {stats.clientVisibleFiles} visíveis
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Distribuição por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(additionalStats.typeDistribution)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 6)
                .map(([type, count]) => {
                  const percentage = Math.round((count / files.length) * 100);
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {getFileTypeIcon(type)}
                          </span>
                          <span>{type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            {count} arquivos
                          </span>
                          <Badge variant="secondary">{percentage}%</Badge>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Upload Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Uploads da Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {additionalStats.uploadTrends.map((day, index) => {
                const maxFiles = Math.max(
                  ...additionalStats.uploadTrends.map((d) => d.files),
                );
                const percentage =
                  maxFiles > 0 ? (day.files / maxFiles) * 100 : 0;

                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{day.day}</span>
                      <span className="text-muted-foreground">
                        {day.files} arquivo{day.files !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Files and User Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Files */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Arquivos Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            {additionalStats.popularFiles.length > 0 ? (
              <div className="space-y-3">
                {additionalStats.popularFiles.map((file, index) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                  >
                    <Badge
                      variant="outline"
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                    >
                      {index + 1}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)} • {file.uploadedBy}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {file.clientVisible && (
                        <Eye className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhum arquivo foi marcado como favorito ainda</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Atividade por Usuário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(additionalStats.userStats)
                .sort(([, a], [, b]) => b.count - a.count)
                .slice(0, 5)
                .map(([user, stats]) => (
                  <div key={user} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium">{user}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{stats.count} arquivos</p>
                        <p className="text-muted-foreground text-xs">
                          {formatFileSize(stats.size)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Resumo de Atividade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Upload className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Uploads Recentes</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {additionalStats.recentFiles}
              </p>
              <p className="text-sm text-muted-foreground">Últimos 7 dias</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-green-500" />
                <span className="font-medium">Este Mês</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {additionalStats.monthlyFiles}
              </p>
              <p className="text-sm text-muted-foreground">Arquivos enviados</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Eye className="h-5 w-5 text-purple-500" />
                <span className="font-medium">Acesso Cliente</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {additionalStats.clientAccessStats.clientPercentage}%
              </p>
              <p className="text-sm text-muted-foreground">Arquivos visíveis</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-orange-500" />
                <span className="font-medium">Eficiência</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">
                {Math.round((stats.favoriteFiles / stats.totalFiles) * 100) ||
                  0}
                %
              </p>
              <p className="text-sm text-muted-foreground">
                Arquivos organizados
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
