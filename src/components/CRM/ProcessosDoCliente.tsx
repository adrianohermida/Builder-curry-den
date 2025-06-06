import { useState, useEffect } from "react";
import {
  Scale,
  Loader2,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Clock,
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle,
  FileText,
  TrendingUp,
  Award,
  Building,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ProcessMovement {
  id: string;
  date: string;
  description: string;
  type: string;
  isRecent: boolean;
  isRead: boolean;
}

interface Process {
  id: string;
  number: string;
  area: string;
  instance: string;
  court: string;
  lastMovement: string;
  lastMovementDate: string;
  status: "ativo" | "arquivado" | "suspenso";
  hasRecentActivity: boolean;
  movements: ProcessMovement[];
  createdAt: string;
  priority: "low" | "medium" | "high" | "critical";
}

interface ProcessosDoClienteProps {
  cpf: string;
  clienteName?: string;
  onProcessSelect?: (process: Process) => void;
}

export function ProcessosDoCliente({
  cpf,
  clienteName,
  onProcessSelect,
}: ProcessosDoClienteProps) {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [instanceFilter, setInstanceFilter] = useState<string>("all");
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isGroupedView, setIsGroupedView] = useState(false);

  // Fetch processes from Advise API
  const fetchProcesses = async (showToast = true) => {
    if (!cpf) return;

    setLoading(true);

    try {
      if (showToast) {
        toast.loading("Consultando processos na API Advise...", {
          id: "fetch-processes",
        });
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockProcesses: Process[] = [
        {
          id: "1",
          number: "1234567-89.2024.8.26.0001",
          area: "Direito Civil",
          instance: "1ª Instância",
          court: "Comarca de São Paulo",
          lastMovement: "Juntada de petição de defesa",
          lastMovementDate: new Date(
            Date.now() - 2 * 60 * 60 * 1000,
          ).toISOString(), // 2 hours ago
          status: "ativo",
          hasRecentActivity: true,
          priority: "high",
          createdAt: "2024-10-15",
          movements: [
            {
              id: "1",
              date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              description: "Juntada de petição de defesa",
              type: "juntada",
              isRecent: true,
              isRead: false,
            },
            {
              id: "2",
              date: "2024-12-10",
              description: "Audiência de conciliação designada",
              type: "audiencia",
              isRecent: false,
              isRead: true,
            },
          ],
        },
        {
          id: "2",
          number: "9876543-21.2024.8.26.0002",
          area: "Direito Trabalhista",
          instance: "1ª Instância",
          court: "TRT 2ª Região",
          lastMovement: "Sentença publicada",
          lastMovementDate: "2024-12-10",
          status: "ativo",
          hasRecentActivity: false,
          priority: "medium",
          createdAt: "2024-09-20",
          movements: [
            {
              id: "3",
              date: "2024-12-10",
              description: "Sentença publicada - Procedente",
              type: "sentenca",
              isRecent: false,
              isRead: true,
            },
          ],
        },
        {
          id: "3",
          number: "5555555-55.2024.8.26.0003",
          area: "Direito Penal",
          instance: "2ª Instância",
          court: "TJSP",
          lastMovement: "Recurso de apelação interposto",
          lastMovementDate: "2024-11-30",
          status: "ativo",
          hasRecentActivity: false,
          priority: "critical",
          createdAt: "2024-08-15",
          movements: [
            {
              id: "4",
              date: "2024-11-30",
              description: "Recurso de apelação interposto",
              type: "recurso",
              isRecent: false,
              isRead: false,
            },
          ],
        },
      ];

      setProcesses(mockProcesses);
      setLastUpdate(new Date());

      if (showToast) {
        const recentCount = mockProcesses.filter(
          (p) => p.hasRecentActivity,
        ).length;
        toast.success(
          `${mockProcesses.length} processos encontrados${recentCount > 0 ? ` (${recentCount} com atividade recente)` : ""}`,
          { id: "fetch-processes" },
        );
      }
    } catch (error) {
      toast.error("Erro ao consultar processos", { id: "fetch-processes" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcesses(false);
  }, [cpf]);

  // Filter processes
  const filteredProcesses = processes.filter((process) => {
    const matchesSearch =
      process.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.court.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesArea = areaFilter === "all" || process.area === areaFilter;
    const matchesStatus =
      statusFilter === "all" || process.status === statusFilter;
    const matchesInstance =
      instanceFilter === "all" || process.instance === instanceFilter;

    return matchesSearch && matchesArea && matchesStatus && matchesInstance;
  });

  // Group processes for large volumes
  const groupedProcesses = filteredProcesses.reduce(
    (groups, process) => {
      const key = isGroupedView ? process.instance : "all";
      if (!groups[key]) groups[key] = [];
      groups[key].push(process);
      return groups;
    },
    {} as Record<string, Process[]>,
  );

  const getStatusBadge = (status: Process["status"]) => {
    switch (status) {
      case "ativo":
        return <Badge variant="default">Ativo</Badge>;
      case "arquivado":
        return <Badge variant="secondary">Arquivado</Badge>;
      case "suspenso":
        return <Badge variant="outline">Suspenso</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityColor = (priority: Process["priority"]) => {
    switch (priority) {
      case "critical":
        return "border-l-red-500 bg-red-50 dark:bg-red-950/10";
      case "high":
        return "border-l-orange-500 bg-orange-50 dark:bg-orange-950/10";
      case "medium":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/10";
      case "low":
        return "border-l-green-500 bg-green-50 dark:bg-green-950/10";
      default:
        return "";
    }
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case "juntada":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "audiencia":
        return <Calendar className="h-4 w-4 text-green-500" />;
      case "sentenca":
        return <Award className="h-4 w-4 text-purple-500" />;
      case "recurso":
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const isRecentActivity = (dateString: string) => {
    const activityDate = new Date(dateString);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return activityDate > twentyFourHoursAgo;
  };

  const areas = Array.from(new Set(processes.map((p) => p.area)));
  const instances = Array.from(new Set(processes.map((p) => p.instance)));

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Processos do Cliente</h2>
            {clienteName && (
              <p className="text-muted-foreground">Cliente: {clienteName}</p>
            )}
            <p className="text-sm text-muted-foreground">CPF: {cpf}</p>
          </div>
          <div className="flex items-center space-x-2">
            {lastUpdate && (
              <p className="text-sm text-muted-foreground">
                Última atualização: {lastUpdate.toLocaleTimeString("pt-BR")}
              </p>
            )}
            <Button
              onClick={() => fetchProcesses(true)}
              disabled={loading}
              variant="outline"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Atualizar
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total
                  </p>
                  <p className="text-2xl font-bold">{processes.length}</p>
                </div>
                <Scale className="h-8 w-8 text-[rgb(var(--theme-primary))]" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Ativos
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {processes.filter((p) => p.status === "ativo").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Atividade 24h
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {processes.filter((p) => p.hasRecentActivity).length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Críticos
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {processes.filter((p) => p.priority === "critical").length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por número, área ou comarca..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Select value={areaFilter} onValueChange={setAreaFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Áreas</SelectItem>
                    {areas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="ativo">Ativos</SelectItem>
                    <SelectItem value="arquivado">Arquivados</SelectItem>
                    <SelectItem value="suspenso">Suspensos</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={instanceFilter}
                  onValueChange={setInstanceFilter}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Instância" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {instances.map((instance) => (
                      <SelectItem key={instance} value={instance}>
                        {instance}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filteredProcesses.length > 10 && (
                  <Button
                    variant="outline"
                    onClick={() => setIsGroupedView(!isGroupedView)}
                  >
                    <Building className="h-4 w-4 mr-2" />
                    {isGroupedView ? "Lista" : "Agrupar"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processes List */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="rounded-2xl shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : Object.keys(groupedProcesses).length === 0 ? (
            <Card className="rounded-2xl shadow-md">
              <CardContent className="p-12 text-center">
                <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">
                  Nenhum processo encontrado
                </h3>
                <p className="text-muted-foreground">
                  {processes.length === 0
                    ? 'Clique em "Atualizar" para consultar processos'
                    : "Tente ajustar os filtros de busca"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <AnimatePresence>
              {Object.entries(groupedProcesses).map(
                ([group, groupProcesses]) => (
                  <div key={group} className="space-y-4">
                    {isGroupedView && group !== "all" && (
                      <div className="flex items-center space-x-2">
                        <Building className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">{group}</h3>
                        <Badge variant="outline">{groupProcesses.length}</Badge>
                      </div>
                    )}

                    {groupProcesses.map((process, index) => (
                      <motion.div
                        key={process.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card
                          className={`rounded-2xl shadow-md hover:shadow-lg transition-all border-l-4 ${getPriorityColor(process.priority)} ${process.hasRecentActivity ? "ring-2 ring-[rgb(var(--theme-primary))]/20" : ""}`}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center space-x-3">
                                  <div className="relative">
                                    <Scale className="h-8 w-8 text-[rgb(var(--theme-primary))]" />
                                    {process.hasRecentActivity && (
                                      <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{
                                          repeat: Infinity,
                                          duration: 2,
                                        }}
                                        className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"
                                      />
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-lg">
                                      {process.number}
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                      <Badge variant="outline">
                                        {process.area}
                                      </Badge>
                                      {getStatusBadge(process.status)}
                                      {process.hasRecentActivity && (
                                        <Badge className="bg-orange-500 text-white">
                                          Nova Atividade
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{process.court}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Badge variant="secondary">
                                      {process.instance}
                                    </Badge>
                                  </div>
                                </div>

                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors">
                                      <p className="text-sm font-medium">
                                        Último Andamento:
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {process.lastMovement}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(
                                          process.lastMovementDate,
                                        ).toLocaleString("pt-BR")}
                                      </p>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-sm">
                                    <p>Clique para ver todos os andamentos</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>

                              <div className="flex flex-col items-end space-y-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        setSelectedProcess(process)
                                      }
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      Ver Timeline
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center space-x-2">
                                        <Scale className="h-5 w-5" />
                                        <span>Timeline - {process.number}</span>
                                      </DialogTitle>
                                    </DialogHeader>
                                    <ScrollArea className="h-96 w-full">
                                      <div className="space-y-4 p-4">
                                        {process.movements.map(
                                          (movement, index) => (
                                            <motion.div
                                              key={movement.id}
                                              initial={{ opacity: 0, x: -20 }}
                                              animate={{ opacity: 1, x: 0 }}
                                              transition={{
                                                delay: index * 0.1,
                                              }}
                                              className={`flex items-start space-x-4 p-4 border rounded-lg ${
                                                movement.isRecent
                                                  ? "bg-orange-50 dark:bg-orange-950/20 border-orange-200"
                                                  : ""
                                              } ${
                                                !movement.isRead
                                                  ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200"
                                                  : ""
                                              }`}
                                            >
                                              <div className="mt-1">
                                                {getMovementIcon(movement.type)}
                                              </div>
                                              <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                  <p className="font-medium">
                                                    {movement.description}
                                                  </p>
                                                  <div className="flex items-center space-x-2">
                                                    {movement.isRecent && (
                                                      <Badge
                                                        variant="destructive"
                                                        className="text-xs"
                                                      >
                                                        Últimas 24h
                                                      </Badge>
                                                    )}
                                                    {!movement.isRead && (
                                                      <Badge
                                                        variant="default"
                                                        className="text-xs"
                                                      >
                                                        Novo
                                                      </Badge>
                                                    )}
                                                  </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                  {new Date(
                                                    movement.date,
                                                  ).toLocaleString("pt-BR")}
                                                </p>
                                              </div>
                                            </motion.div>
                                          ),
                                        )}
                                      </div>
                                    </ScrollArea>
                                  </DialogContent>
                                </Dialog>

                                {process.priority === "critical" && (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    Crítico
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ),
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
