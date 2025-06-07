import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  FileText,
  Eye,
  DollarSign,
  Users,
  Clock,
  Download,
  Share2,
  Star,
  HardDrive,
  Activity,
  Calendar,
  Target,
  Zap,
  Shield,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw,
  Filter,
  Download as DownloadIcon,
  FileSpreadsheet,
  FileBarChart,
  Printer,
  Mail,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Plus,
  Settings,
  ChevronRight,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DashboardMetrics {
  overview: {
    totalFiles: number;
    totalSize: number;
    clientVisibleFiles: number;
    monetizedFiles: number;
    totalRevenue: number;
    storageUsed: number;
    storageLimit: number;
    activeUsers: number;
  };

  trends: {
    filesGrowth: number;
    revenueGrowth: number;
    usageGrowth: number;
    period: "day" | "week" | "month";
  };

  topFiles: {
    id: string;
    name: string;
    views: number;
    downloads: number;
    revenue: number;
    lastAccessed: string;
    clientName: string;
  }[];

  categoryBreakdown: {
    category: string;
    count: number;
    percentage: number;
    revenue: number;
    color: string;
  }[];

  clientMetrics: {
    clientId: string;
    clientName: string;
    clientType: "fisica" | "juridica";
    totalFiles: number;
    totalSize: number;
    visibleFiles: number;
    lastActivity: string;
    revenue: number;
    status: "active" | "inactive" | "premium";
  }[];

  timeSeriesData: {
    date: string;
    uploads: number;
    views: number;
    downloads: number;
    revenue: number;
  }[];

  deviceBreakdown: {
    device: "desktop" | "mobile" | "tablet";
    users: number;
    percentage: number;
  }[];

  performance: {
    averageUploadTime: number;
    averageLoadTime: number;
    errorRate: number;
    uptime: number;
  };
}

interface ExecutiveDashboardProps {
  className?: string;
  refreshInterval?: number;
}

export function GEDExecutiveDashboard({
  className = "",
  refreshInterval = 30000, // 30 segundos
}: ExecutiveDashboardProps) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "7d" | "30d" | "90d" | "1y"
  >("30d");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Simular carregamento de dados
  useEffect(() => {
    loadDashboardMetrics();

    const interval = setInterval(() => {
      loadDashboardMetrics();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [selectedPeriod, refreshInterval]);

  const loadDashboardMetrics = async () => {
    setLoading(true);

    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockMetrics: DashboardMetrics = {
        overview: {
          totalFiles: 2847,
          totalSize: 15.7 * 1024 * 1024 * 1024, // 15.7 GB
          clientVisibleFiles: 1203,
          monetizedFiles: 145,
          totalRevenue: 23450.8,
          storageUsed: 15.7 * 1024 * 1024 * 1024,
          storageLimit: 50 * 1024 * 1024 * 1024, // 50 GB
          activeUsers: 87,
        },

        trends: {
          filesGrowth: 12.5,
          revenueGrowth: 18.3,
          usageGrowth: 8.7,
          period: "month",
        },

        topFiles: [
          {
            id: "file_001",
            name: "Manual Prático de Direito do Trabalho 2024.pdf",
            views: 1247,
            downloads: 523,
            revenue: 2840.5,
            lastAccessed: new Date(
              Date.now() - 2 * 60 * 60 * 1000,
            ).toISOString(),
            clientName: "João Silva Advocacia",
          },
          {
            id: "file_002",
            name: "Modelos de Petições Cíveis.pdf",
            views: 892,
            downloads: 341,
            revenue: 1920.25,
            lastAccessed: new Date(
              Date.now() - 4 * 60 * 60 * 1000,
            ).toISOString(),
            clientName: "Santos & Associados",
          },
          {
            id: "file_003",
            name: "Jurisprudência STF - Direitos Fundamentais.pdf",
            views: 756,
            downloads: 298,
            revenue: 1580.75,
            lastAccessed: new Date(
              Date.now() - 6 * 60 * 60 * 1000,
            ).toISOString(),
            clientName: "Maria Paula Advocacia",
          },
        ],

        categoryBreakdown: [
          {
            category: "Contratos",
            count: 834,
            percentage: 29.3,
            revenue: 8920.5,
            color: "#3B82F6",
          },
          {
            category: "Petições",
            count: 627,
            percentage: 22.0,
            revenue: 6240.8,
            color: "#10B981",
          },
          {
            category: "Estudos",
            count: 445,
            percentage: 15.6,
            revenue: 4890.25,
            color: "#F59E0B",
          },
          {
            category: "Manuais",
            count: 332,
            percentage: 11.7,
            revenue: 3120.45,
            color: "#EF4444",
          },
          {
            category: "Jurisprudência",
            count: 289,
            percentage: 10.1,
            revenue: 1890.3,
            color: "#8B5CF6",
          },
          {
            category: "Outros",
            count: 320,
            percentage: 11.3,
            revenue: 980.5,
            color: "#6B7280",
          },
        ],

        clientMetrics: [
          {
            clientId: "client_001",
            clientName: "João Silva Advocacia",
            clientType: "juridica",
            totalFiles: 234,
            totalSize: 1.2 * 1024 * 1024 * 1024,
            visibleFiles: 156,
            lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            revenue: 4520.8,
            status: "premium",
          },
          {
            clientId: "client_002",
            clientName: "Maria Santos",
            clientType: "fisica",
            totalFiles: 89,
            totalSize: 450 * 1024 * 1024,
            visibleFiles: 67,
            lastActivity: new Date(
              Date.now() - 2 * 60 * 60 * 1000,
            ).toISOString(),
            revenue: 1240.5,
            status: "active",
          },
          {
            clientId: "client_003",
            clientName: "Santos & Associados",
            clientType: "juridica",
            totalFiles: 445,
            totalSize: 2.8 * 1024 * 1024 * 1024,
            visibleFiles: 298,
            lastActivity: new Date(
              Date.now() - 1 * 60 * 60 * 1000,
            ).toISOString(),
            revenue: 7890.25,
            status: "premium",
          },
        ],

        timeSeriesData: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          uploads: Math.floor(Math.random() * 50) + 10,
          views: Math.floor(Math.random() * 500) + 100,
          downloads: Math.floor(Math.random() * 100) + 20,
          revenue: Math.random() * 1000 + 200,
        })),

        deviceBreakdown: [
          { device: "desktop", users: 52, percentage: 59.8 },
          { device: "mobile", users: 28, percentage: 32.2 },
          { device: "tablet", users: 7, percentage: 8.0 },
        ],

        performance: {
          averageUploadTime: 2.4,
          averageLoadTime: 1.8,
          errorRate: 0.2,
          uptime: 99.9,
        },
      };

      setMetrics(mockMetrics);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Erro ao carregar métricas:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return TrendingUp;
    if (value < 0) return TrendingDown;
    return Minus;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "desktop":
        return Monitor;
      case "mobile":
        return Smartphone;
      case "tablet":
        return Smartphone;
      default:
        return Monitor;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "premium":
        return "bg-purple-100 text-purple-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const OverviewCards = () => {
    if (!metrics) return null;

    const cards = [
      {
        title: "Total de Arquivos",
        value: metrics.overview.totalFiles.toLocaleString(),
        trend: metrics.trends.filesGrowth,
        icon: FileText,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        title: "Visíveis ao Cliente",
        value: metrics.overview.clientVisibleFiles.toLocaleString(),
        trend: 8.2,
        icon: Eye,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        title: "Receita Total",
        value: formatCurrency(metrics.overview.totalRevenue),
        trend: metrics.trends.revenueGrowth,
        icon: DollarSign,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
      {
        title: "Usuários Ativos",
        value: metrics.overview.activeUsers.toString(),
        trend: metrics.trends.usageGrowth,
        icon: Users,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const TrendIcon = getTrendIcon(card.trend);
          const trendColor = getTrendColor(card.trend);

          return (
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
                      <div
                        className={`flex items-center space-x-1 mt-2 ${trendColor}`}
                      >
                        <TrendIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {formatPercentage(card.trend)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          vs mês anterior
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${card.bgColor}`}>
                      <card.icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const StorageProgress = () => {
    if (!metrics) return null;

    const usagePercentage =
      (metrics.overview.storageUsed / metrics.overview.storageLimit) * 100;

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <HardDrive className="h-5 w-5" />
            <span>Uso de Armazenamento</span>
          </CardTitle>
          <Badge variant={usagePercentage > 80 ? "destructive" : "default"}>
            {usagePercentage.toFixed(1)}% usado
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={usagePercentage} className="h-3" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {formatFileSize(metrics.overview.storageUsed)} usado
              </span>
              <span className="text-muted-foreground">
                {formatFileSize(metrics.overview.storageLimit)} total
              </span>
            </div>
            {usagePercentage > 80 && (
              <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm">
                  Armazenamento quase cheio. Considere arquivar documentos
                  antigos ou fazer upgrade do plano.
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const CategoryChart = () => {
    if (!metrics) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Distribuição por Categoria</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.categoryBreakdown.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{category.count}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(category.revenue)}
                    </div>
                  </div>
                </div>
                <Progress
                  value={category.percentage}
                  className="h-2"
                  style={{
                    ["--progress-background" as any]: category.color,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const TopFilesTable = () => {
    if (!metrics) return null;

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Arquivos Mais Acessados</span>
          </CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Arquivo</TableHead>
                <TableHead className="text-center">Visualizações</TableHead>
                <TableHead className="text-center">Downloads</TableHead>
                <TableHead className="text-center">Receita</TableHead>
                <TableHead className="text-center">Último Acesso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.topFiles.map((file, index) => (
                <TableRow key={file.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          #{index + 1}
                        </span>
                        <span className="truncate">{file.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {file.clientName}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className="flex items-center space-x-1"
                    >
                      <Eye className="h-3 w-3" />
                      <span>{file.views}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className="flex items-center space-x-1"
                    >
                      <Download className="h-3 w-3" />
                      <span>{file.downloads}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium text-green-600">
                      {formatCurrency(file.revenue)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm text-muted-foreground">
                      {new Date(file.lastAccessed).toLocaleString("pt-BR")}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  const ClientMetricsTable = () => {
    if (!metrics) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Métricas por Cliente</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-center">Arquivos</TableHead>
                <TableHead className="text-center">Tamanho</TableHead>
                <TableHead className="text-center">Visíveis</TableHead>
                <TableHead className="text-center">Receita</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.clientMetrics.map((client) => (
                <TableRow key={client.clientId} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          client.clientType === "fisica"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {client.clientType === "fisica" ? "PF" : "PJ"}
                      </div>
                      <div>
                        <div className="font-medium">{client.clientName}</div>
                        <div className="text-xs text-muted-foreground">
                          Última atividade:{" "}
                          {new Date(client.lastActivity).toLocaleString(
                            "pt-BR",
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {client.totalFiles}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatFileSize(client.totalSize)}
                  </TableCell>
                  <TableCell className="text-center">
                    {client.visibleFiles}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium text-green-600">
                      {formatCurrency(client.revenue)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={getStatusColor(client.status)}>
                      {client.status === "premium" && "Premium"}
                      {client.status === "active" && "Ativo"}
                      {client.status === "inactive" && "Inativo"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  const PerformanceMetrics = () => {
    if (!metrics) return null;

    const performanceCards = [
      {
        title: "Tempo Médio de Upload",
        value: `${metrics.performance.averageUploadTime}s`,
        status: metrics.performance.averageUploadTime < 3 ? "good" : "warning",
        icon: Upload,
      },
      {
        title: "Tempo Médio de Carregamento",
        value: `${metrics.performance.averageLoadTime}s`,
        status: metrics.performance.averageLoadTime < 2 ? "good" : "warning",
        icon: Zap,
      },
      {
        title: "Taxa de Erro",
        value: `${metrics.performance.errorRate}%`,
        status: metrics.performance.errorRate < 1 ? "good" : "error",
        icon: AlertTriangle,
      },
      {
        title: "Uptime",
        value: `${metrics.performance.uptime}%`,
        status: metrics.performance.uptime > 99 ? "good" : "warning",
        icon: Activity,
      },
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Performance do Sistema</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {performanceCards.map((card) => {
              const statusColor =
                card.status === "good"
                  ? "text-green-600 bg-green-50"
                  : card.status === "warning"
                    ? "text-yellow-600 bg-yellow-50"
                    : "text-red-600 bg-red-50";

              const StatusIcon =
                card.status === "good"
                  ? CheckCircle
                  : card.status === "warning"
                    ? AlertTriangle
                    : XCircle;

              return (
                <div key={card.title} className="text-center space-y-2">
                  <div
                    className={`p-3 rounded-full mx-auto w-fit ${statusColor}`}
                  >
                    <card.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{card.value}</div>
                    <div className="text-sm text-muted-foreground">
                      {card.title}
                    </div>
                    <StatusIcon
                      className={`h-4 w-4 mx-auto ${statusColor.split(" ")[0]}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <TooltipProvider>
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Dashboard Executivo</h2>
            <p className="text-muted-foreground">
              Visão geral do sistema GED Jurídico
              {lastUpdated && (
                <span className="ml-2">
                  • Atualizado {lastUpdated.toLocaleTimeString("pt-BR")}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Select
              value={selectedPeriod}
              onValueChange={(value: any) => setSelectedPeriod(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 dias</SelectItem>
                <SelectItem value="30d">30 dias</SelectItem>
                <SelectItem value="90d">90 dias</SelectItem>
                <SelectItem value="1y">1 ano</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={loadDashboardMetrics}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Atualizar
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Exportar Relatório
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Exportar Relatório</DialogTitle>
                  <DialogDescription>
                    Escolha o formato e período para exportação
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Excel (.xlsx)</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <FileBarChart className="h-4 w-4" />
                    <span>PDF</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Enviar por Email</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Imprimir</span>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Overview Cards */}
        <OverviewCards />

        {/* Storage Progress */}
        <StorageProgress />

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="files">Arquivos</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryChart />

              {/* Device Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Monitor className="h-5 w-5" />
                    <span>Acesso por Dispositivo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.deviceBreakdown.map((device, index) => {
                      const DeviceIcon = getDeviceIcon(device.device);

                      return (
                        <div
                          key={device.device}
                          className="flex items-center space-x-4"
                        >
                          <DeviceIcon className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium capitalize">
                                {device.device}
                              </span>
                              <span className="text-sm">
                                {device.users} usuários
                              </span>
                            </div>
                            <Progress
                              value={device.percentage}
                              className="h-2"
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {device.percentage.toFixed(1)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="files" className="space-y-6">
            <TopFilesTable />
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <ClientMetricsTable />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceMetrics />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
