import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  PieChart,
  HardDrive,
  File,
  Download,
  Upload,
  Eye,
  Search,
  Filter,
  RefreshCw,
  FileText,
  Image,
  Archive,
  Video,
  Music,
  Calendar,
  User,
  Building,
  Gavel,
  MessageSquare,
  Brain,
  TrendingUp,
  Activity,
  Users,
  FolderOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface FileRecord {
  id: string;
  name: string;
  size: number;
  type: string;
  extension: string;
  module: "CRM" | "PROCESSOS" | "ATENDIMENTO" | "IA" | "AGENDA" | "CONTRATOS";
  entityId: string;
  entityName: string;
  uploadedBy: string;
  uploadedAt: string;
  lastAccessed?: string;
  downloadCount: number;
  path: string;
  isPublic: boolean;
}

interface StorageStats {
  totalFiles: number;
  totalSize: number;
  totalDownloads: number;
  moduleDistribution: Record<string, { count: number; size: number }>;
  typeDistribution: Record<string, { count: number; size: number }>;
  recentActivity: Array<{
    action: string;
    file: string;
    user: string;
    time: string;
  }>;
  topFiles: Array<{ name: string; downloads: number; size: number }>;
  growthTrend: Array<{ month: string; files: number; size: number }>;
}

export function StorageDashboard() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModule, setFilterModule] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "size" | "date" | "downloads">(
    "date",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [hasTestData, setHasTestData] = useState(false);

  // Carregar dados
  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    setLoading(true);

    try {
      // Verificar se há dados simulados
      const savedData = localStorage.getItem("lawdesk-storage-files");
      const hasData = savedData && JSON.parse(savedData).length > 0;

      if (hasData) {
        const fileData = JSON.parse(savedData);
        setFiles(fileData);
        generateStats(fileData);
        setHasTestData(true);
      } else {
        // Dados vazios
        setFiles([]);
        setStats(null);
        setHasTestData(false);
      }
    } catch (error) {
      console.error("Erro ao carregar dados de armazenamento:", error);
      toast.error("Erro ao carregar dados de armazenamento");
    } finally {
      setLoading(false);
    }
  };

  const generateTestData = () => {
    const testFiles: FileRecord[] = [
      {
        id: "file_001",
        name: "Contrato_Prestacao_Servicos_Silva.pdf",
        size: 2048576, // 2MB
        type: "application/pdf",
        extension: "PDF",
        module: "CRM",
        entityId: "cliente_001",
        entityName: "João Silva & Associados",
        uploadedBy: "Advogado Silva",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        lastAccessed: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        downloadCount: 5,
        path: "/clientes/cliente_001/documentos/Contrato_Prestacao_Servicos_Silva.pdf",
        isPublic: false,
      },
      {
        id: "file_002",
        name: "Procuracao_Maria_Santos.pdf",
        size: 1536000, // 1.5MB
        type: "application/pdf",
        extension: "PDF",
        module: "CRM",
        entityId: "cliente_002",
        entityName: "Maria Santos",
        uploadedBy: "Estagiário João",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        downloadCount: 2,
        path: "/clientes/cliente_002/documentos/Procuracao_Maria_Santos.pdf",
        isPublic: true,
      },
      {
        id: "file_003",
        name: "Inicial_Acao_Indenizacao.docx",
        size: 512000, // 500KB
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        extension: "DOCX",
        module: "PROCESSOS",
        entityId: "proc_001",
        entityName: "Processo 0001234-56.2024.8.26.0001",
        uploadedBy: "Advogado Silva",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        downloadCount: 8,
        path: "/processos/0001234-56.2024.8.26.0001/anexos/Inicial_Acao_Indenizacao.docx",
        isPublic: false,
      },
      {
        id: "file_004",
        name: "Ticket_Duvida_Cliente_Screenshot.png",
        size: 1024000, // 1MB
        type: "image/png",
        extension: "PNG",
        module: "ATENDIMENTO",
        entityId: "ticket_001",
        entityName: "Ticket #001 - Dúvida sobre processo",
        uploadedBy: "Cliente Portal",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        downloadCount: 1,
        path: "/tickets/ticket_001/arquivos/Ticket_Duvida_Cliente_Screenshot.png",
        isPublic: false,
      },
      {
        id: "file_005",
        name: "Analise_IA_Jurisprudencia.json",
        size: 256000, // 250KB
        type: "application/json",
        extension: "JSON",
        module: "IA",
        entityId: "analysis_001",
        entityName: "Análise de Jurisprudência - Danos Morais",
        uploadedBy: "Sistema IA",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
        downloadCount: 12,
        path: "/ia-juridica/analysis_001/Analise_IA_Jurisprudencia.json",
        isPublic: false,
      },
      {
        id: "file_006",
        name: "Agenda_Audiencias_Janeiro.xlsx",
        size: 768000, // 750KB
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        extension: "XLSX",
        module: "AGENDA",
        entityId: "agenda_001",
        entityName: "Agenda Janeiro 2025",
        uploadedBy: "Secretária Ana",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
        downloadCount: 3,
        path: "/agenda/agenda_001/Agenda_Audiencias_Janeiro.xlsx",
        isPublic: false,
      },
      {
        id: "file_007",
        name: "Contrato_Sociedade_XYZ.pdf",
        size: 3072000, // 3MB
        type: "application/pdf",
        extension: "PDF",
        module: "CONTRATOS",
        entityId: "contrato_001",
        entityName: "Contrato de Sociedade XYZ",
        uploadedBy: "Advogado Silva",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
        downloadCount: 7,
        path: "/contratos/contrato_001/Contrato_Sociedade_XYZ.pdf",
        isPublic: false,
      },
      {
        id: "file_008",
        name: "Parecer_Juridico_Trabalhista.pdf",
        size: 1792000, // 1.75MB
        type: "application/pdf",
        extension: "PDF",
        module: "IA",
        entityId: "parecer_001",
        entityName: "Parecer Jurídico - Direito Trabalhista",
        uploadedBy: "IA Jurídica",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
        downloadCount: 15,
        path: "/ia-juridica/parecer_001/Parecer_Juridico_Trabalhista.pdf",
        isPublic: true,
      },
    ];

    localStorage.setItem("lawdesk-storage-files", JSON.stringify(testFiles));
    setFiles(testFiles);
    generateStats(testFiles);
    setHasTestData(true);
    toast.success("📊 Dados de teste simulados gerados com sucesso!");
  };

  const generateStats = (fileData: FileRecord[]) => {
    const stats: StorageStats = {
      totalFiles: fileData.length,
      totalSize: fileData.reduce((sum, file) => sum + file.size, 0),
      totalDownloads: fileData.reduce(
        (sum, file) => sum + file.downloadCount,
        0,
      ),
      moduleDistribution: {},
      typeDistribution: {},
      recentActivity: [],
      topFiles: [],
      growthTrend: [],
    };

    // Distribuição por módulo
    fileData.forEach((file) => {
      if (!stats.moduleDistribution[file.module]) {
        stats.moduleDistribution[file.module] = { count: 0, size: 0 };
      }
      stats.moduleDistribution[file.module].count++;
      stats.moduleDistribution[file.module].size += file.size;
    });

    // Distribuição por tipo
    fileData.forEach((file) => {
      if (!stats.typeDistribution[file.extension]) {
        stats.typeDistribution[file.extension] = { count: 0, size: 0 };
      }
      stats.typeDistribution[file.extension].count++;
      stats.typeDistribution[file.extension].size += file.size;
    });

    // Atividade recente
    stats.recentActivity = fileData
      .sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
      )
      .slice(0, 10)
      .map((file) => ({
        action: "Upload",
        file: file.name,
        user: file.uploadedBy,
        time: file.uploadedAt,
      }));

    // Top arquivos
    stats.topFiles = fileData
      .sort((a, b) => b.downloadCount - a.downloadCount)
      .slice(0, 5)
      .map((file) => ({
        name: file.name,
        downloads: file.downloadCount,
        size: file.size,
      }));

    // Tendência de crescimento (simulada)
    stats.growthTrend = [
      { month: "Nov 24", files: 45, size: 89 },
      { month: "Dez 24", files: 62, size: 118 },
      {
        month: "Jan 25",
        files: fileData.length,
        size: Math.round(stats.totalSize / 1024 / 1024),
      },
    ];

    setStats(stats);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case "CRM":
        return <Users className="h-4 w-4" />;
      case "PROCESSOS":
        return <Gavel className="h-4 w-4" />;
      case "ATENDIMENTO":
        return <MessageSquare className="h-4 w-4" />;
      case "IA":
        return <Brain className="h-4 w-4" />;
      case "AGENDA":
        return <Calendar className="h-4 w-4" />;
      case "CONTRATOS":
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getFileIcon = (extension: string) => {
    switch (extension.toLowerCase()) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "docx":
      case "doc":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "xlsx":
      case "xls":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return <Image className="h-4 w-4 text-purple-500" />;
      case "zip":
      case "rar":
        return <Archive className="h-4 w-4 text-orange-500" />;
      case "mp4":
      case "avi":
        return <Video className="h-4 w-4 text-pink-500" />;
      case "mp3":
      case "wav":
        return <Music className="h-4 w-4 text-cyan-500" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  // Filtrar e ordenar arquivos
  const filteredAndSortedFiles = useMemo(() => {
    let filtered = files.filter((file) => {
      const matchesSearch =
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.entityName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesModule = !filterModule || file.module === filterModule;
      const matchesType = !filterType || file.extension === filterType;

      return matchesSearch && matchesModule && matchesType;
    });

    // Ordenar
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "size":
          aValue = a.size;
          bValue = b.size;
          break;
        case "date":
          aValue = new Date(a.uploadedAt).getTime();
          bValue = new Date(b.uploadedAt).getTime();
          break;
        case "downloads":
          aValue = a.downloadCount;
          bValue = b.downloadCount;
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [files, searchTerm, filterModule, filterType, sortBy, sortOrder]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!hasTestData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <HardDrive className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Nenhum arquivo encontrado
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Ainda não há arquivos armazenados no sistema. Faça upload de
              documentos nos módulos ou gere dados de teste para visualizar o
              dashboard.
            </p>
            <Button onClick={generateTestData} size="lg">
              <Activity className="h-4 w-4 mr-2" />
              Simular Dados
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total de Arquivos
                  </p>
                  <p className="text-2xl font-bold">{stats?.totalFiles || 0}</p>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <File className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+12% este mês</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Espaço Usado
                  </p>
                  <p className="text-2xl font-bold">
                    {formatFileSize(stats?.totalSize || 0)}
                  </p>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <HardDrive className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2">
                <Progress value={35} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  35% do limite usado
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Downloads
                  </p>
                  <p className="text-2xl font-bold">
                    {stats?.totalDownloads || 0}
                  </p>
                </div>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Download className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <Activity className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-blue-600">15 hoje</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Uploads Hoje
                  </p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Upload className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+3 que ontem</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="files">Arquivos</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="activity">Atividade</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribuição por Módulo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Distribuição por Módulo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats &&
                    Object.entries(stats.moduleDistribution).map(
                      ([module, data]) => {
                        const percentage =
                          (data.count / stats.totalFiles) * 100;
                        return (
                          <div key={module} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {getModuleIcon(module)}
                                <span className="font-medium">{module}</span>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">
                                  {data.count} arquivos
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(data.size)}
                                </p>
                              </div>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      },
                    )}
                </div>
              </CardContent>
            </Card>

            {/* Tipos de Arquivo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Tipos de Arquivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats &&
                    Object.entries(stats.typeDistribution).map(
                      ([type, data]) => {
                        const percentage =
                          (data.count / stats.totalFiles) * 100;
                        return (
                          <div key={type} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {getFileIcon(type)}
                                <span className="font-medium">{type}</span>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">
                                  {data.count} arquivos
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(data.size)}
                                </p>
                              </div>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      },
                    )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Arquivos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Arquivos Mais Baixados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.topFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <div>
                        <p className="font-medium truncate max-w-xs">
                          {file.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {file.downloads} downloads
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
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
                <Select value={filterModule} onValueChange={setFilterModule}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Módulo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="CRM">CRM</SelectItem>
                    <SelectItem value="PROCESSOS">Processos</SelectItem>
                    <SelectItem value="ATENDIMENTO">Atendimento</SelectItem>
                    <SelectItem value="IA">IA Jurídica</SelectItem>
                    <SelectItem value="AGENDA">Agenda</SelectItem>
                    <SelectItem value="CONTRATOS">Contratos</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="DOCX">DOCX</SelectItem>
                    <SelectItem value="XLSX">XLSX</SelectItem>
                    <SelectItem value="PNG">PNG</SelectItem>
                    <SelectItem value="JSON">JSON</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={`${sortBy}-${sortOrder}`}
                  onValueChange={(value) => {
                    const [sort, order] = value.split("-");
                    setSortBy(sort as any);
                    setSortOrder(order as any);
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Mais Recente</SelectItem>
                    <SelectItem value="date-asc">Mais Antigo</SelectItem>
                    <SelectItem value="name-asc">Nome A-Z</SelectItem>
                    <SelectItem value="name-desc">Nome Z-A</SelectItem>
                    <SelectItem value="size-desc">Maior Tamanho</SelectItem>
                    <SelectItem value="size-asc">Menor Tamanho</SelectItem>
                    <SelectItem value="downloads-desc">
                      Mais Downloads
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterModule("");
                    setFilterType("");
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Limpar
                </Button>
                <Button variant="outline" onClick={loadStorageData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabela de Arquivos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FolderOpen className="h-5 w-5 mr-2" />
                  Arquivos ({filteredAndSortedFiles.length})
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Lista
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Arquivo</TableHead>
                      <TableHead>Módulo</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Tamanho</TableHead>
                      <TableHead>Enviado por</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Downloads</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedFiles.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getFileIcon(file.extension)}
                            <div>
                              <p className="font-medium truncate max-w-xs">
                                {file.name}
                              </p>
                              {file.isPublic && (
                                <Badge variant="outline" className="text-xs">
                                  <Globe className="h-3 w-3 mr-1" />
                                  Público
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {getModuleIcon(file.module)}
                            <span>{file.module}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{file.extension}</Badge>
                        </TableCell>
                        <TableCell>{formatFileSize(file.size)}</TableCell>
                        <TableCell>{file.uploadedBy}</TableCell>
                        <TableCell>
                          {new Date(file.uploadedAt).toLocaleDateString(
                            "pt-BR",
                          )}
                        </TableCell>
                        <TableCell>{file.downloadCount}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Crescimento ao Longo do Tempo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Crescimento do Armazenamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.growthTrend.map((period, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{period.month}</span>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {period.files} arquivos
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {period.size} MB
                        </p>
                      </div>
                    </div>
                    <Progress
                      value={(period.files / (stats.totalFiles || 1)) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          {/* Atividade Recente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {stats?.recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg border"
                    >
                      <div className="p-1 bg-blue-100 dark:bg-blue-900/20 rounded">
                        <Upload className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.action}: {activity.file}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          por {activity.user} •{" "}
                          {new Date(activity.time).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
