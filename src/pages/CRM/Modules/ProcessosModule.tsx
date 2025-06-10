/**
 * ⚖️ MÓDULO PROCESSOS - CRM Unicorn
 *
 * Acompanhamento processual inteligente com integração Advise API
 * - Sincronização automática de dados processuais
 * - Análise de risco com IA
 * - Recomendações de tarefas baseadas em prazos
 * - Timeline inteligente de movimentações
 */

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Scale,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  FileText,
  Bell,
  Target,
  Activity,
  MapPin,
  User,
  DollarSign,
  Zap,
  Brain,
  RefreshCw,
} from "lucide-react";

// Using existing UI components from the project
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Simplified components for now
const Progress = ({ value, className }: any) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <div
      className="bg-blue-600 h-2 rounded-full"
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

const Select = ({ children, value, onValueChange }: any) => (
  <select
    value={value}
    onChange={(e) => onValueChange?.(e.target.value)}
    className="border rounded px-3 py-2"
  >
    {children}
  </select>
);
const SelectTrigger = ({ children }: any) => <>{children}</>;
const SelectValue = ({ placeholder }: any) => (
  <option value="">{placeholder}</option>
);
const SelectContent = ({ children }: any) => <>{children}</>;
const SelectItem = ({ value, children }: any) => (
  <option value={value}>{children}</option>
);

const DropdownMenu = ({ children }: any) => (
  <div className="relative">{children}</div>
);
const DropdownMenuTrigger = ({ children, asChild }: any) => <>{children}</>;
const DropdownMenuContent = ({ children }: any) => (
  <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg">
    {children}
  </div>
);
const DropdownMenuItem = ({ children, onClick }: any) => (
  <div onClick={onClick} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
    {children}
  </div>
);
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Hooks (using temporary stubs)
const useProcessosUnicorn = () => ({
  processos: [],
  loading: false,
  createProcess: async () => {},
  updateProcess: async () => {},
  deleteProcess: async () => {},
  syncProcessData: async () => {},
});

const useAdviseAPI = () => ({
  getProcessUpdates: async () => {},
  syncClientProcesses: async () => {},
  loading: false,
});

const useAIRecommendations = () => ({
  processRecommendations: [],
  deadlineAlerts: [],
  riskAnalysis: {},
});

// Tipos
interface Processo {
  id: string;
  numero: string;
  clienteId: string;
  clienteNome: string;
  area: string;
  status: "ativo" | "arquivado" | "suspenso" | "encerrado";
  valor: number;
  dataInicio: Date;
  dataEncerramento?: Date;
  responsavel: string;
  tribunal: string;
  vara: string;
  assunto: string;
  risco: "baixo" | "medio" | "alto";
  progresso: number;
  proximaAudiencia?: Date;
  proximoPrazo?: Date;
  tags: string[];
  ultimaMovimentacao: Date;
  totalMovimentacoes: number;
  valorCausa: number;
  probabilidadeExito: number;
  tempoMedioResolucao: number;
  // IA e automação
  recomendacoesPendentes: number;
  alertasPrazos: number;
  classificacaoIA: string;
}

interface ProcessosModuleProps {
  searchQuery?: string;
  onNotification?: (message: string) => void;
  className?: string;
}

// Dados mock avançados
const MOCK_PROCESSOS: Processo[] = [
  {
    id: "proc-001",
    numero: "1234567-89.2024.8.26.0100",
    clienteId: "cli-001",
    clienteNome: "Maria Silva Advocacia",
    area: "Tributário",
    status: "ativo",
    valor: 450000,
    dataInicio: new Date("2024-03-15"),
    responsavel: "Dr. João Santos",
    tribunal: "TJSP",
    vara: "4ª Vara Cível",
    assunto: "Repetição de Indébito Tributário",
    risco: "baixo",
    progresso: 75,
    proximaAudiencia: new Date("2025-02-10"),
    proximoPrazo: new Date("2025-01-25"),
    tags: ["ICMS", "Repetição", "Alta Complexidade"],
    ultimaMovimentacao: new Date("2025-01-15"),
    totalMovimentacoes: 23,
    valorCausa: 2500000,
    probabilidadeExito: 85,
    tempoMedioResolucao: 18,
    recomendacoesPendentes: 3,
    alertasPrazos: 1,
    classificacaoIA: "Alto Valor",
  },
  {
    id: "proc-002",
    numero: "9876543-21.2024.5.02.0001",
    clienteId: "cli-002",
    clienteNome: "Carlos Mendes",
    area: "Trabalhista",
    status: "ativo",
    valor: 85000,
    dataInicio: new Date("2024-06-20"),
    responsavel: "Dra. Ana Costa",
    tribunal: "TRT-2",
    vara: "15ª Vara do Trabalho",
    assunto: "Horas Extras e Adicional Noturno",
    risco: "medio",
    progresso: 45,
    proximoPrazo: new Date("2025-01-30"),
    tags: ["Horas Extras", "CLT"],
    ultimaMovimentacao: new Date("2025-01-12"),
    totalMovimentacoes: 8,
    valorCausa: 125000,
    probabilidadeExito: 70,
    tempoMedioResolucao: 12,
    recomendacoesPendentes: 2,
    alertasPrazos: 0,
    classificacaoIA: "Rotineiro",
  },
  {
    id: "proc-003",
    numero: "5555444-33.2023.4.03.6100",
    clienteId: "cli-003",
    clienteNome: "Tech Solutions Ltda",
    area: "Cível",
    status: "suspenso",
    valor: 0,
    dataInicio: new Date("2023-11-10"),
    responsavel: "Dr. Pedro Oliveira",
    tribunal: "TRF-3",
    vara: "3ª Vara Federal",
    assunto: "Cobrança de Serviços",
    risco: "alto",
    progresso: 25,
    tags: ["Cobrança", "Suspenso"],
    ultimaMovimentacao: new Date("2024-12-05"),
    totalMovimentacoes: 12,
    valorCausa: 75000,
    probabilidadeExito: 45,
    tempoMedioResolucao: 24,
    recomendacoesPendentes: 5,
    alertasPrazos: 3,
    classificacaoIA: "Atenção Requerida",
  },
];

export function ProcessosModule({
  searchQuery = "",
  onNotification,
  className,
}: ProcessosModuleProps) {
  // Estados
  const [viewMode, setViewMode] = useState<"cards" | "timeline">("cards");
  const [selectedArea, setSelectedArea] = useState<string>("todas");
  const [selectedStatus, setSelectedStatus] = useState<string>("todos");
  const [selectedProcess, setSelectedProcess] = useState<Processo | null>(null);
  const [syncingAdvise, setSyncingAdvise] = useState(false);

  // Hooks
  const {
    processos,
    loading,
    createProcess,
    updateProcess,
    deleteProcess,
    syncProcessData,
  } = useProcessosUnicorn();

  const {
    getProcessUpdates,
    syncClientProcesses,
    loading: adviseLoading,
  } = useAdviseAPI();

  const { processRecommendations, deadlineAlerts, riskAnalysis } =
    useAIRecommendations();

  // Dados filtrados
  const filteredProcessos = useMemo(() => {
    let filtered = MOCK_PROCESSOS;

    if (searchQuery) {
      filtered = filtered.filter(
        (processo) =>
          processo.numero.includes(searchQuery) ||
          processo.clienteNome
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          processo.assunto.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedArea !== "todas") {
      filtered = filtered.filter((processo) => processo.area === selectedArea);
    }

    if (selectedStatus !== "todos") {
      filtered = filtered.filter(
        (processo) => processo.status === selectedStatus,
      );
    }

    return filtered.sort((a, b) => {
      // Priorizar por alertas e recomendações
      const aUrgency = a.alertasPrazos + a.recomendacoesPendentes;
      const bUrgency = b.alertasPrazos + b.recomendacoesPendentes;
      return bUrgency - aUrgency;
    });
  }, [searchQuery, selectedArea, selectedStatus]);

  // Estatísticas avançadas
  const stats = useMemo(() => {
    const total = MOCK_PROCESSOS.length;
    const ativos = MOCK_PROCESSOS.filter((p) => p.status === "ativo").length;
    const suspensos = MOCK_PROCESSOS.filter(
      (p) => p.status === "suspenso",
    ).length;
    const valorTotal = MOCK_PROCESSOS.reduce((acc, p) => acc + p.valor, 0);
    const alertasTotal = MOCK_PROCESSOS.reduce(
      (acc, p) => acc + p.alertasPrazos,
      0,
    );
    const recomendacoesTotal = MOCK_PROCESSOS.reduce(
      (acc, p) => acc + p.recomendacoesPendentes,
      0,
    );

    return {
      total,
      ativos,
      suspensos,
      valorTotal,
      alertasTotal,
      recomendacoesTotal,
    };
  }, []);

  // Sincronização com Advise API
  const handleAdviseSync = useCallback(async () => {
    setSyncingAdvise(true);
    try {
      await syncClientProcesses();
      onNotification?.("Sincronização com Advise API concluída");
    } catch (error) {
      toast.error("Erro na sincronização com Advise API");
    } finally {
      setSyncingAdvise(false);
    }
  }, [syncClientProcesses, onNotification]);

  // Renderizador de card de processo
  const renderProcessCard = (processo: Processo) => (
    <motion.div
      key={processo.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "relative overflow-hidden cursor-pointer transition-all",
          "hover:shadow-lg border-l-4",
          processo.risco === "alto" && "border-l-red-500 bg-red-50",
          processo.risco === "medio" && "border-l-yellow-500 bg-yellow-50",
          processo.risco === "baixo" && "border-l-green-500 bg-green-50",
        )}
        onClick={() => setSelectedProcess(processo)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge
                  variant={
                    processo.status === "ativo"
                      ? "default"
                      : processo.status === "suspenso"
                        ? "destructive"
                        : "secondary"
                  }
                  className="text-xs"
                >
                  {processo.status.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {processo.area}
                </Badge>
                {processo.classificacaoIA && (
                  <Badge variant="secondary" className="text-xs">
                    🤖 {processo.classificacaoIA}
                  </Badge>
                )}
              </div>

              <h3 className="font-semibold text-sm mb-1">{processo.assunto}</h3>
              <p className="text-xs text-muted-foreground mb-1">
                {processo.numero}
              </p>
              <p className="text-xs text-muted-foreground">
                {processo.clienteNome}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="h-4 w-4 mr-2" />
                  Documentos
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Activity className="h-4 w-4 mr-2" />
                  Timeline
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sincronizar Advise
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Progresso */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Progresso</span>
              <span className="text-xs font-medium">{processo.progresso}%</span>
            </div>
            <Progress value={processo.progresso} className="h-2" />
          </div>

          {/* Informações principais */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground">Valor do Processo</p>
              <p className="font-semibold text-green-600">
                R$ {(processo.valor / 1000).toFixed(0)}k
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Prob. de Êxito</p>
              <p className="font-semibold text-blue-600">
                {processo.probabilidadeExito}%
              </p>
            </div>
          </div>

          {/* Tribunal e Vara */}
          <div className="mb-4">
            <div className="flex items-center text-xs text-muted-foreground mb-1">
              <MapPin className="h-3 w-3 mr-1" />
              {processo.tribunal} - {processo.vara}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <User className="h-3 w-3 mr-1" />
              {processo.responsavel}
            </div>
          </div>

          {/* Próximos prazos */}
          {processo.proximoPrazo && (
            <div className="mb-4">
              <div className="flex items-center text-xs mb-1">
                <Clock className="h-3 w-3 mr-1 text-orange-500" />
                <span className="text-muted-foreground">Próximo prazo:</span>
              </div>
              <p className="text-xs font-medium">
                {processo.proximoPrazo.toLocaleDateString("pt-BR")}
              </p>
            </div>
          )}

          {/* Alertas e recomendações */}
          <div className="flex items-center justify-between mb-3">
            {processo.alertasPrazos > 0 && (
              <div className="flex items-center text-xs text-red-600">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {processo.alertasPrazos} alerta(s)
              </div>
            )}

            {processo.recomendacoesPendentes > 0 && (
              <div className="flex items-center text-xs text-blue-600">
                <Brain className="h-3 w-3 mr-1" />
                {processo.recomendacoesPendentes} IA
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {processo.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {processo.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{processo.tags.length - 2}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header do módulo */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Processos</h2>
          <p className="text-muted-foreground">
            Acompanhamento processual inteligente
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAdviseSync}
            disabled={syncingAdvise}
          >
            <RefreshCw
              className={cn("h-4 w-4 mr-2", syncingAdvise && "animate-spin")}
            />
            Sincronizar Advise
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setViewMode(viewMode === "cards" ? "timeline" : "cards")
            }
          >
            {viewMode === "cards" ? "Timeline" : "Cards"}
          </Button>

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Processo
          </Button>
        </div>
      </div>

      {/* Estatísticas e alertas */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Total",
            value: stats.total,
            icon: Scale,
            color: "text-blue-600",
          },
          {
            title: "Ativos",
            value: stats.ativos,
            icon: TrendingUp,
            color: "text-green-600",
          },
          {
            title: "Suspensos",
            value: stats.suspensos,
            icon: TrendingDown,
            color: "text-red-600",
          },
          {
            title: "Valor Total",
            value: `R$ ${(stats.valorTotal / 1000).toFixed(0)}k`,
            icon: DollarSign,
            color: "text-emerald-600",
          },
          {
            title: "Alertas",
            value: stats.alertasTotal,
            icon: AlertTriangle,
            color: "text-orange-600",
          },
          {
            title: "IA Recs",
            value: stats.recomendacoesTotal,
            icon: Brain,
            color: "text-purple-600",
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className={cn(
                stat.title === "Alertas" &&
                  stats.alertasTotal > 0 &&
                  "ring-2 ring-orange-500",
                stat.title === "IA Recs" &&
                  stats.recomendacoesTotal > 0 &&
                  "ring-2 ring-purple-500",
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={cn("h-8 w-8", stat.color)} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filtros avançados */}
      <div className="flex items-center space-x-4">
        <Select value={selectedArea} onValueChange={setSelectedArea}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as Áreas</SelectItem>
            <SelectItem value="Tributário">Tributário</SelectItem>
            <SelectItem value="Trabalhista">Trabalhista</SelectItem>
            <SelectItem value="Cível">Cível</SelectItem>
            <SelectItem value="Criminal">Criminal</SelectItem>
            <SelectItem value="Empresarial">Empresarial</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Status</SelectItem>
            <SelectItem value="ativo">Ativos</SelectItem>
            <SelectItem value="suspenso">Suspensos</SelectItem>
            <SelectItem value="arquivado">Arquivados</SelectItem>
            <SelectItem value="encerrado">Encerrados</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtros Avançados
        </Button>

        <Button variant="outline" size="sm">
          <Zap className="h-4 w-4 mr-2" />
          Recomendações IA
        </Button>
      </div>

      {/* Lista de processos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProcessos.map(renderProcessCard)}
      </div>

      {/* Loading state */}
      {(loading || adviseLoading) && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {filteredProcessos.length === 0 && !loading && (
        <div className="text-center py-12">
          <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Nenhum processo encontrado
          </h3>
          <p className="text-muted-foreground mb-4">
            Comece adicionando processos ou sincronize com a Advise API
          </p>
          <div className="flex items-center justify-center space-x-3">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Processo
            </Button>
            <Button variant="outline" onClick={handleAdviseSync}>
              <Sync className="h-4 w-4 mr-2" />
              Sincronizar Advise
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
