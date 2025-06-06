import { useState, useEffect } from "react";
import {
  BarChart3,
  PieChart,
  HardDrive,
  Users,
  Scale,
  FileText,
  Filter,
  Download,
  Trash2,
  Eye,
  RefreshCw,
  Calendar,
  Search,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatePicker } from "@/components/ui/date-picker";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface StorageStats {
  totalFiles: number;
  totalSize: number;
  sizeBySource: {
    source: string;
    size: number;
    files: number;
    color: string;
  }[];
  filesByEntity: {
    entity: string;
    count: number;
    size: number;
  }[];
  recentActivity: {
    id: string;
    action: string;
    fileName: string;
    user: string;
    timestamp: Date;
    size: number;
    source: string;
  }[];
}

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  source: string;
  entity: string;
  entityId: string;
  uploadedBy: string;
  uploadedAt: Date;
  lastAccessed?: Date;
  syncStatus: "synced" | "pending" | "error";
  isEncrypted: boolean;
}

export function StorageDashboard() {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  // Mock data generation
  useEffect(() => {
    const generateMockData = () => {
      const mockStats: StorageStats = {
        totalFiles: 1247,
        totalSize: 15.3 * 1024 * 1024 * 1024, // 15.3 GB in bytes
        sizeBySource: [
          {
            source: "Lawdesk Cloud",
            size: 8.2 * 1024 * 1024 * 1024,
            files: 687,
            color: "#3b82f6",
          },
          {
            source: "Google Drive",
            size: 4.1 * 1024 * 1024 * 1024,
            files: 312,
            color: "#10b981",
          },
          {
            source: "Servidor Local",
            size: 2.1 * 1024 * 1024 * 1024,
            files: 156,
            color: "#f59e0b",
          },
          {
            source: "Supabase",
            size: 0.9 * 1024 * 1024 * 1024,
            files: 92,
            color: "#ef4444",
          },
        ],
        filesByEntity: [
          { entity: "Clientes", count: 456, size: 6.2 * 1024 * 1024 * 1024 },
          { entity: "Processos", count: 523, size: 7.1 * 1024 * 1024 * 1024 },
          { entity: "Contratos", count: 178, size: 1.8 * 1024 * 1024 * 1024 },
          { entity: "Tickets", count: 90, size: 0.2 * 1024 * 1024 * 1024 },
        ],
        recentActivity: [
          {
            id: "1",
            action: "upload",
            fileName: "Contrato_Cliente_Silva.pdf",
            user: "Dr. Pedro Costa",
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            size: 2.3 * 1024 * 1024,
            source: "Lawdesk Cloud",
          },
          {
            id: "2",
            action: "delete",
            fileName: "Rascunho_Petição_v1.docx",
            user: "Dra. Ana Lima",
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            size: 0.8 * 1024 * 1024,
            source: "Google Drive",
          },
          {
            id: "3",
            action: "download",
            fileName: "Procuração_João_Santos.pdf",
            user: "Carlos Oliveira",
            timestamp: new Date(Date.now() - 32 * 60 * 1000),
            size: 1.2 * 1024 * 1024,
            source: "Lawdesk Cloud",
          },
        ],
      };

      const mockFiles: FileItem[] = [
        {
          id: "1",
          name: "RG_João_Silva.pdf",
          type: "application/pdf",
          size: 2.3 * 1024 * 1024,
          source: "Lawdesk Cloud",
          entity: "Clientes",
          entityId: "cliente_001",
          uploadedBy: "Dr. Pedro Costa",
          uploadedAt: new Date("2024-12-15T10:30:00"),
          lastAccessed: new Date("2024-12-16T14:20:00"),
          syncStatus: "synced",
          isEncrypted: true,
        },
        {
          id: "2",
          name: "Petição_Inicial_Processo_123.docx",
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          size: 1.8 * 1024 * 1024,
          source: "Google Drive",
          entity: "Processos",
          entityId: "processo_123",
          uploadedBy: "Dra. Ana Lima",
          uploadedAt: new Date("2024-12-14T16:45:00"),
          syncStatus: "pending",
          isEncrypted: false,
        },
        {
          id: "3",
          name: "Contrato_Prestação_Serviços.pdf",
          type: "application/pdf",
          size: 3.2 * 1024 * 1024,
          source: "Servidor Local",
          entity: "Contratos",
          entityId: "contrato_456",
          uploadedBy: "Carlos Oliveira",
          uploadedAt: new Date("2024-12-13T09:15:00"),
          lastAccessed: new Date("2024-12-15T11:30:00"),
          syncStatus: "error",
          isEncrypted: true,
        },
      ];

      setStats(mockStats);
      setFiles(mockFiles);
      setLoading(false);
    };

    // Simulate loading
    setTimeout(generateMockData, 1000);
  }, []);

  const formatFileSize = (bytes: number): string => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const getSourceColor = (source: string) => {
    const sourceColors: { [key: string]: string } = {
      "Lawdesk Cloud": "bg-blue-500",
      "Google Drive": "bg-green-500",
      "Servidor Local": "bg-yellow-500",
      Supabase: "bg-red-500",
      "API Custom": "bg-purple-500",
    };
    return sourceColors[source] || "bg-gray-500";
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case "synced":
        return <div className="w-2 h-2 rounded-full bg-green-500" />;
      case "pending":
        return (
          <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
        );
      case "error":
        return <div className="w-2 h-2 rounded-full bg-red-500" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-500" />;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "upload":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "download":
        return <Download className="h-4 w-4 text-blue-500" />;
      case "delete":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource =
      sourceFilter === "all" || file.source === sourceFilter;
    const matchesEntity =
      entityFilter === "all" || file.entity === entityFilter;

    const fileDate = file.uploadedAt;
    const matchesDateFrom = !dateFrom || fileDate >= dateFrom;
    const matchesDateTo = !dateTo || fileDate <= dateTo;

    return (
      matchesSearch &&
      matchesSource &&
      matchesEntity &&
      matchesDateFrom &&
      matchesDateTo
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-muted rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard de Armazenamento</h2>
          <p className="text-muted-foreground">
            Visualização completa dos arquivos e estatísticas de uso
          </p>
        </div>
        <Button
          onClick={() => {
            toast.success("Dados atualizados");
            setLoading(true);
            setTimeout(() => setLoading(false), 1000);
          }}
          variant="outline"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Arquivos
                </p>
                <p className="text-2xl font-bold">
                  {stats.totalFiles.toLocaleString("pt-BR")}
                </p>
              </div>
              <FileText className="h-8 w-8 text-[rgb(var(--theme-primary))]" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Espaço Ocupado
                </p>
                <p className="text-2xl font-bold">
                  {formatFileSize(stats.totalSize)}
                </p>
              </div>
              <HardDrive className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Arquivos de Clientes
                </p>
                <p className="text-2xl font-bold">
                  {stats.filesByEntity.find((e) => e.entity === "Clientes")
                    ?.count || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Arquivos de Processos
                </p>
                <p className="text-2xl font-bold">
                  {stats.filesByEntity.find((e) => e.entity === "Processos")
                    ?.count || 0}
                </p>
              </div>
              <Scale className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storage by Source Chart */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Espaço por Origem</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.sizeBySource.map((source, index) => {
                const percentage = (source.size / stats.totalSize) * 100;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: source.color }}
                        />
                        <span className="font-medium">{source.source}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatFileSize(source.size)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {source.files} arquivos
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: source.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Files by Entity */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Arquivos por Entidade</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.filesByEntity.map((entity, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{entity.entity}</span>
                    <div className="text-right">
                      <div className="font-medium">{entity.count} arquivos</div>
                      <div className="text-xs text-muted-foreground">
                        {formatFileSize(entity.size)}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-[rgb(var(--theme-primary))] h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(entity.count / stats.totalFiles) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Atividade Recente</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-3 border rounded-lg"
              >
                <div className="mt-1">{getActionIcon(activity.action)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{activity.fileName}</p>
                    <Badge variant="outline" className="text-xs">
                      {activity.source}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {activity.action === "upload" && "Enviado por "}
                    {activity.action === "download" && "Baixado por "}
                    {activity.action === "delete" && "Excluído por "}
                    {activity.user} •{" "}
                    {activity.timestamp.toLocaleString("pt-BR")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(activity.size)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Files Table */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Arquivos do Sistema</CardTitle>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar arquivos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Origens</SelectItem>
                  {stats.sizeBySource.map((source) => (
                    <SelectItem key={source.source} value={source.source}>
                      {source.source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Entidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {stats.filesByEntity.map((entity) => (
                    <SelectItem key={entity.entity} value={entity.entity}>
                      {entity.entity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <DatePicker
                date={dateFrom}
                onDateChange={setDateFrom}
                placeholder="Data inicial"
              />

              <DatePicker
                date={dateTo}
                onDateChange={setDateTo}
                placeholder="Data final"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Nome do Arquivo</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Enviado por</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getSyncStatusIcon(file.syncStatus)}
                        {file.isEncrypted && (
                          <div
                            className="w-3 h-3 rounded-full bg-blue-500"
                            title="Criptografado"
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.type}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getSourceColor(file.source)} text-white`}
                      >
                        {file.source}
                      </Badge>
                    </TableCell>
                    <TableCell>{file.entity}</TableCell>
                    <TableCell>{formatFileSize(file.size)}</TableCell>
                    <TableCell>{file.uploadedBy}</TableCell>
                    <TableCell>
                      {file.uploadedAt.toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
