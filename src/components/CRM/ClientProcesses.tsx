import { useState, useEffect } from "react";
import {
  Scale,
  Loader2,
  Search,
  Filter,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  ExternalLink,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  MapPin,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ProcessMovement {
  id: string;
  date: string;
  description: string;
  type: string;
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
  isRead: boolean;
  movements: ProcessMovement[];
  createdAt: string;
  updatedAt: string;
}

interface ClientProcessesProps {
  clientCpf: string;
  clientName: string;
  onBack: () => void;
}

export function ClientProcesses({
  clientCpf,
  clientName,
  onBack,
}: ClientProcessesProps) {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [readFilter, setReadFilter] = useState<string>("all");
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Mock API simulation
  const fetchProcesses = async (showToast = true) => {
    setLoading(true);

    try {
      if (showToast) {
        toast.loading("Consultando processos na API Advise...", {
          id: "fetch-processes",
        });
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock data - in real app, this would be actual API call
      const mockProcesses: Process[] = [
        {
          id: "1",
          number: "1234567-89.2024.8.26.0001",
          area: "Direito Civil",
          instance: "1ª Instância",
          court: "Comarca de São Paulo",
          lastMovement: "Juntada de petição de defesa",
          lastMovementDate: "2024-12-15",
          status: "ativo",
          isRead: false,
          createdAt: "2024-10-15",
          updatedAt: "2024-12-15",
          movements: [
            {
              id: "1",
              date: "2024-12-15",
              description: "Juntada de petição de defesa",
              type: "juntada",
              isRead: false,
            },
            {
              id: "2",
              date: "2024-12-10",
              description: "Audiência de conciliação designada",
              type: "audiencia",
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
          isRead: true,
          createdAt: "2024-09-20",
          updatedAt: "2024-12-10",
          movements: [
            {
              id: "3",
              date: "2024-12-10",
              description: "Sentença publicada - Procedente",
              type: "sentenca",
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
          isRead: false,
          createdAt: "2024-08-15",
          updatedAt: "2024-11-30",
          movements: [
            {
              id: "4",
              date: "2024-11-30",
              description: "Recurso de apelação interposto",
              type: "recurso",
              isRead: false,
            },
          ],
        },
      ];

      setProcesses(mockProcesses);
      setLastUpdate(new Date());

      if (showToast) {
        toast.success(`${mockProcesses.length} processos encontrados`, {
          id: "fetch-processes",
        });
      }

      // Check for new movements
      const newMovements = mockProcesses.reduce(
        (count, process) =>
          count + process.movements.filter((m) => !m.isRead).length,
        0,
      );

      if (newMovements > 0 && showToast) {
        toast.info(`${newMovements} novos andamentos encontrados`);
      }
    } catch (error) {
      toast.error("Erro ao consultar processos", { id: "fetch-processes" });
    } finally {
      setLoading(false);
    }
  };

  // Mark processes as read
  const markAsRead = async (processIds: string[]) => {
    try {
      toast.loading("Marcando como lido...", { id: "mark-read" });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setProcesses((prev) =>
        prev.map((process) =>
          processIds.includes(process.id)
            ? {
                ...process,
                isRead: true,
                movements: process.movements.map((m) => ({
                  ...m,
                  isRead: true,
                })),
              }
            : process,
        ),
      );

      toast.success("Marcado como lido", { id: "mark-read" });
      setSelectedProcesses([]);
    } catch (error) {
      toast.error("Erro ao marcar como lido", { id: "mark-read" });
    }
  };

  // Filter processes
  const filteredProcesses = processes.filter((process) => {
    const matchesSearch =
      process.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.court.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || process.status === statusFilter;
    const matchesRead =
      readFilter === "all" ||
      (readFilter === "read" && process.isRead) ||
      (readFilter === "unread" && !process.isRead);

    return matchesSearch && matchesStatus && matchesRead;
  });

  // Auto-fetch on component mount
  useEffect(() => {
    fetchProcesses(false);
  }, [clientCpf]);

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

  const getMovementIcon = (type: string) => {
    switch (type) {
      case "juntada":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "audiencia":
        return <Calendar className="h-4 w-4 text-green-500" />;
      case "sentenca":
        return <Scale className="h-4 w-4 text-purple-500" />;
      case "recurso":
        return <ExternalLink className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-2">
            ← Voltar para Clientes
          </Button>
          <h1 className="text-2xl font-bold">Processos de {clientName}</h1>
          <p className="text-muted-foreground">CPF: {clientCpf}</p>
        </div>
        <div className="flex items-center space-x-2">
          {lastUpdate && (
            <p className="text-sm text-muted-foreground">
              Última atualização: {lastUpdate.toLocaleString("pt-BR")}
            </p>
          )}
          <Button
            onClick={() => fetchProcesses(true)}
            disabled={loading}
            className="bg-[rgb(var(--theme-primary))] hover:bg-[rgb(var(--theme-primary))]/90"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Atualizar Dados
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
                  Total de Processos
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
                  Não Lidos
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {processes.filter((p) => !p.isRead).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Novos Andamentos
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {processes.reduce(
                    (count, p) =>
                      count + p.movements.filter((m) => !m.isRead).length,
                    0,
                  )}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="arquivado">Arquivados</SelectItem>
                  <SelectItem value="suspenso">Suspensos</SelectItem>
                </SelectContent>
              </Select>
              <Select value={readFilter} onValueChange={setReadFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="read">Lidos</SelectItem>
                  <SelectItem value="unread">Não Lidos</SelectItem>
                </SelectContent>
              </Select>
              {selectedProcesses.length > 0 && (
                <Button
                  onClick={() => markAsRead(selectedProcesses)}
                  variant="outline"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Marcar como Lido ({selectedProcesses.length})
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processes Table */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Lista de Processos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedProcesses.length === filteredProcesses.length &&
                        filteredProcesses.length > 0
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedProcesses(
                            filteredProcesses.map((p) => p.id),
                          );
                        } else {
                          setSelectedProcesses([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Número do Processo</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Instância</TableHead>
                  <TableHead>Comarca</TableHead>
                  <TableHead>Último Andamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcesses.map((process) => (
                  <TableRow
                    key={process.id}
                    className={
                      !process.isRead ? "bg-blue-50 dark:bg-blue-950/20" : ""
                    }
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedProcesses.includes(process.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedProcesses((prev) => [
                              ...prev,
                              process.id,
                            ]);
                          } else {
                            setSelectedProcesses((prev) =>
                              prev.filter((id) => id !== process.id),
                            );
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm">
                          {process.number}
                        </span>
                        {!process.isRead && (
                          <div className="w-2 h-2 rounded-full bg-[rgb(var(--theme-primary))]" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{process.area}</Badge>
                    </TableCell>
                    <TableCell>{process.instance}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{process.court}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">{process.lastMovement}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(
                            process.lastMovementDate,
                          ).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(process.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedProcess(process)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>
                                Andamentos do Processo {process.number}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {process.movements.map((movement) => (
                                <div
                                  key={movement.id}
                                  className={`flex items-start space-x-3 p-3 border rounded-lg ${
                                    !movement.isRead
                                      ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200"
                                      : ""
                                  }`}
                                >
                                  {getMovementIcon(movement.type)}
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <p className="font-medium">
                                        {movement.description}
                                      </p>
                                      {!movement.isRead && (
                                        <Badge
                                          variant="default"
                                          className="text-xs"
                                        >
                                          Novo
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(
                                        movement.date,
                                      ).toLocaleDateString("pt-BR")}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead([process.id])}
                          disabled={process.isRead}
                        >
                          {process.isRead ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!loading && filteredProcesses.length === 0 && (
            <div className="text-center py-8">
              <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">
                Nenhum processo encontrado
              </h3>
              <p className="text-muted-foreground">
                {processes.length === 0
                  ? 'Clique em "Atualizar Dados" para consultar processos'
                  : "Tente ajustar os filtros de busca"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
