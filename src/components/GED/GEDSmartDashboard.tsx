import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  FileText,
  HardDrive,
  Users,
  TrendingUp,
  Pie,
  Archive,
  Clock,
  AlertTriangle,
  Download,
  Eye,
  Settings,
  RefreshCw,
  ChevronRight,
  Calendar,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GEDDashboardStats {
  totalDocuments: number;
  totalSize: number;
  usedSpace: number;
  availableSpace: number;
  clientVisibleFiles: number;
  favoriteFiles: number;
  recentUploads: number;
  storageUsagePercent: number;
  documentsByType: { [key: string]: number };
  documentsByClient: {
    clientId: string;
    clientName: string;
    count: number;
    size: number;
  }[];
  recentActivity: {
    id: string;
    action: string;
    fileName: string;
    user: string;
    timestamp: string;
    type: "upload" | "download" | "delete" | "share" | "edit";
  }[];
  largestFiles: {
    id: string;
    name: string;
    size: number;
    type: string;
    uploadedBy: string;
    uploadDate: string;
  }[];
  uploadTrends: {
    date: string;
    uploads: number;
    size: number;
  }[];
}

interface GEDSmartDashboardProps {
  className?: string;
  compact?: boolean;
}

export function GEDSmartDashboard({
  className,
  compact = false,
}: GEDSmartDashboardProps) {
  const [stats, setStats] = useState<GEDDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      // Simular carregamento de estatísticas
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Calcular estatísticas baseadas nos dados locais
      const files = JSON.parse(
        localStorage.getItem("lawdesk_ged_files") || "[]",
      );
      const treeData = JSON.parse(
        localStorage.getItem("lawdesk_ged_tree") || "[]",
      );

      const totalSize = files.reduce(
        (sum: number, file: any) => sum + (file.size || 0),
        0,
      );
      const maxStorage = 5 * 1024 * 1024 * 1024; // 5GB simulado

      const documentsByType: { [key: string]: number } = {};
      const documentsByClient: {
        [key: string]: { name: string; count: number; size: number };
      } = {};

      files.forEach((file: any) => {
        // Por tipo
        const extension = file.name.split(".").pop()?.toLowerCase() || "other";
        documentsByType[extension] = (documentsByType[extension] || 0) + 1;

        // Por cliente
        if (file.associatedWith?.type === "client") {
          const clientId = file.associatedWith.id;
          if (!documentsByClient[clientId]) {
            documentsByClient[clientId] = {
              name: file.associatedWith.name,
              count: 0,
              size: 0,
            };
          }
          documentsByClient[clientId].count++;
          documentsByClient[clientId].size += file.size || 0;
        }
      });

      const mockStats: GEDDashboardStats = {
        totalDocuments: files.length,
        totalSize,
        usedSpace: totalSize,
        availableSpace: maxStorage - totalSize,
        storageUsagePercent: (totalSize / maxStorage) * 100,
        clientVisibleFiles: files.filter((f: any) => f.clientVisible).length,
        favoriteFiles: files.filter((f: any) => f.isFavorite).length,
        recentUploads: files.filter((f: any) => {
          const uploadDate = new Date(f.createdAt || Date.now());
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return uploadDate > weekAgo;
        }).length,
        documentsByType,
        documentsByClient: Object.entries(documentsByClient).map(
          ([clientId, data]) => ({
            clientId,
            clientName: data.name,
            count: data.count,
            size: data.size,
          }),
        ),
        recentActivity: [
          {
            id: "1",
            action: "Upload",
            fileName: "Contrato_Prestacao_Servicos.pdf",
            user: "Dr. Carlos Santos",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            type: "upload",
          },
          {
            id: "2",
            action: "Compartilhamento",
            fileName: "Inicial_Acao_Indenizacao.docx",
            user: "Dra. Ana Paula",
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            type: "share",
          },
          {
            id: "3",
            action: "Download",
            fileName: "Sentenca_Processo_123.pdf",
            user: "Cliente João Silva",
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            type: "download",
          },
        ],
        largestFiles: files
          .sort((a: any, b: any) => (b.size || 0) - (a.size || 0))
          .slice(0, 5)
          .map((file: any) => ({
            id: file.id,
            name: file.name,
            size: file.size || 0,
            type: file.type || "unknown",
            uploadedBy: file.uploadedBy || "Sistema",
            uploadDate: file.createdAt || new Date().toISOString(),
          })),
        uploadTrends: [
          { date: "2024-12-01", uploads: 12, size: 45000000 },
          { date: "2024-12-02", uploads: 8, size: 32000000 },
          { date: "2024-12-03", uploads: 15, size: 67000000 },
          { date: "2024-12-04", uploads: 6, size: 23000000 },
          { date: "2024-12-05", uploads: 11, size: 41000000 },
          { date: "2024-12-06", uploads: 9, size: 35000000 },
          { date: "2024-12-07", uploads: 13, size: 52000000 },
        ],
      };

      setStats(mockStats);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setLoading(false);
    }
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

  const chartColors = [
    "rgb(99, 102, 241)",
    "rgb(236, 72, 153)",
    "rgb(34, 197, 94)",
    "rgb(251, 191, 36)",
    "rgb(239, 68, 68)",
    "rgb(168, 85, 247)",
    "rgb(14, 165, 233)",
    "rgb(245, 101, 101)",
  ];

  const summaryCards = useMemo(() => {
    if (!stats) return [];

    return [
      {
        title: "Total de Documentos",
        value: stats.totalDocuments.toLocaleString(),
        icon: FileText,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        title: "Espaço Ocupado",
        value: formatFileSize(stats.totalSize),
        icon: HardDrive,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
      {
        title: "Visível ao Cliente",
        value: stats.clientVisibleFiles.toString(),
        icon: Eye,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        title: "Uploads Recentes",
        value: stats.recentUploads.toString(),
        icon: TrendingUp,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      },
    ];
  }, [stats]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  if (compact) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold">{card.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {card.title}
                    </p>
                    <p className="text-3xl font-bold">{card.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${card.bgColor}`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Storage Usage */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <HardDrive className="h-5 w-5" />
            <span>Uso do Armazenamento</span>
          </CardTitle>
          <Badge
            variant={stats.storageUsagePercent > 80 ? "destructive" : "default"}
          >
            {stats.storageUsagePercent.toFixed(1)}% usado
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={stats.storageUsagePercent} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatFileSize(stats.usedSpace)} usado</span>
              <span>{formatFileSize(stats.availableSpace)} disponível</span>
            </div>
            {stats.storageUsagePercent > 80 && (
              <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm">
                  Armazenamento quase cheio. Considere arquivar documentos
                  antigos.
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Pie className="h-5 w-5" />
              <span>Documentos por Tipo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.documentsByType)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 6)
                .map(([type, count], index) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{
                          backgroundColor:
                            chartColors[index % chartColors.length],
                        }}
                      />
                      <span className="text-sm font-medium uppercase">
                        {type}
                      </span>
                    </div>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Documentos por Cliente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.documentsByClient
                .sort((a, b) => b.count - a.count)
                .slice(0, 6)
                .map((client, index) => (
                  <div
                    key={client.clientId}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {client.clientName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(client.size)}
                      </p>
                    </div>
                    <Badge variant="secondary">{client.count}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Atividade Recente</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardStats}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Atualizar</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="p-2 rounded-full bg-blue-50">
                  {activity.type === "upload" && (
                    <FileText className="h-4 w-4 text-blue-600" />
                  )}
                  {activity.type === "download" && (
                    <Download className="h-4 w-4 text-green-600" />
                  )}
                  {activity.type === "share" && (
                    <Users className="h-4 w-4 text-purple-600" />
                  )}
                  {activity.type === "edit" && (
                    <Settings className="h-4 w-4 text-orange-600" />
                  )}
                  {activity.type === "delete" && (
                    <Archive className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {activity.action}: {activity.fileName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    por {activity.user} • {formatDate(activity.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed View Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">
            <BarChart3 className="h-4 w-4 mr-2" />
            Ver Detalhamento Completo
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Relatório Detalhado do GED</DialogTitle>
            <DialogDescription>
              Análise completa dos documentos e uso do sistema
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="clients" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="clients">Por Cliente</TabsTrigger>
              <TabsTrigger value="files">Maiores Arquivos</TabsTrigger>
              <TabsTrigger value="trends">Tendências</TabsTrigger>
            </TabsList>

            <TabsContent value="clients" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Documentos</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Última Atividade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.documentsByClient.map((client) => (
                    <TableRow key={client.clientId}>
                      <TableCell className="font-medium">
                        {client.clientName}
                      </TableCell>
                      <TableCell>{client.count}</TableCell>
                      <TableCell>{formatFileSize(client.size)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Hoje</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="files" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Arquivo</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Enviado por</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.largestFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">{file.name}</TableCell>
                      <TableCell>{formatFileSize(file.size)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {file.type.split("/")[1]?.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{file.uploadedBy}</TableCell>
                      <TableCell>{formatDate(file.uploadDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <div className="text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Gráficos de tendência de upload em desenvolvimento</p>
                <p className="text-sm">Dados dos últimos 7 dias disponíveis</p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
