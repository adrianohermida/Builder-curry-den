/**
 * ✅ MÓDULO TAREFAS POR CLIENTE - CRM Jurídico
 *
 * Gestão de tarefas personalizada por cliente
 * - Sistema Kanban drag & drop
 * - Tarefas automáticas e manuais
 * - Discussões por tarefa
 * - Workflow inteligente
 */

import React, { useState, useMemo } from "react";
import {
  CheckSquare,
  Plus,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  User,
  Zap,
  Repeat,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ConfigurableList,
  ColumnConfig,
  ListItem,
  Discussion,
} from "@/components/CRM/ConfigurableList";

// Tipos específicos
interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  cliente: string;
  clienteId: string;
  tipo: "manual" | "automatica" | "recorrente" | "prazo_processual";
  status: "pendente" | "em_andamento" | "concluida" | "cancelada";
  prioridade: "baixa" | "media" | "alta" | "critica";
  dataVencimento: Date;
  dataCriacao: Date;
  responsavel: string;
  tempoEstimado: number; // em horas
  tempoGasto?: number;
  observacoes?: string;
  tags: string[];
  vinculadoProcesso?: string;
}

interface TarefasClienteModuleProps {
  searchQuery?: string;
  viewMode?: "list" | "kanban";
  onNotification?: (message: string) => void;
  className?: string;
}

// Mock data
const MOCK_TAREFAS: Tarefa[] = [
  {
    id: "1",
    titulo: "Preparar petição inicial",
    descricao: "Elaborar petição inicial para ação trabalhista",
    cliente: "João Silva & Associados",
    clienteId: "1",
    tipo: "manual",
    status: "em_andamento",
    prioridade: "alta",
    dataVencimento: new Date(Date.now() + 86400000 * 2),
    dataCriacao: new Date(Date.now() - 86400000),
    responsavel: "Maria Santos",
    tempoEstimado: 4,
    tempoGasto: 2.5,
    tags: ["petição", "trabalhista"],
    vinculadoProcesso: "1001234-12.2024.8.26.0100",
  },
  {
    id: "2",
    titulo: "Prazo para contestação",
    descricao: "Prazo para apresentar contestação",
    cliente: "TechCorp Ltda",
    clienteId: "2",
    tipo: "prazo_processual",
    status: "pendente",
    prioridade: "critica",
    dataVencimento: new Date(Date.now() + 86400000 * 3),
    dataCriacao: new Date(Date.now() - 86400000 * 2),
    responsavel: "Carlos Oliveira",
    tempoEstimado: 6,
    tags: ["contestação", "prazo"],
    vinculadoProcesso: "5005678-34.2024.4.03.6100",
  },
  {
    id: "3",
    titulo: "Reunião de alinhamento",
    descricao: "Reunião mensal com o cliente",
    cliente: "Ana Costa",
    clienteId: "3",
    tipo: "recorrente",
    status: "concluida",
    prioridade: "media",
    dataVencimento: new Date(Date.now() - 86400000),
    dataCriacao: new Date(Date.now() - 86400000 * 7),
    responsavel: "João Silva",
    tempoEstimado: 1,
    tempoGasto: 1.5,
    tags: ["reunião", "mensal"],
  },
  {
    id: "4",
    titulo: "Análise de documentos",
    descricao: "Analisar documentos enviados pelo cliente",
    cliente: "Pedro Almeida",
    clienteId: "4",
    tipo: "automatica",
    status: "pendente",
    prioridade: "baixa",
    dataVencimento: new Date(Date.now() + 86400000 * 5),
    dataCriacao: new Date(),
    responsavel: "Ana Silva",
    tempoEstimado: 2,
    tags: ["análise", "documentos"],
  },
];

// Configuração das colunas
const DEFAULT_COLUMNS: ColumnConfig[] = [
  { key: "titulo", label: "Título", visible: true, sortable: true },
  { key: "cliente", label: "Cliente", visible: true, sortable: true },
  { key: "tipo", label: "Tipo", visible: true, sortable: true },
  { key: "status", label: "Status", visible: true, sortable: true },
  { key: "prioridade", label: "Prioridade", visible: true, sortable: true },
  { key: "dataVencimento", label: "Vencimento", visible: true, sortable: true },
  { key: "responsavel", label: "Responsável", visible: true, sortable: true },
  { key: "tempoEstimado", label: "Tempo Est.", visible: false, sortable: true },
  { key: "progresso", label: "Progresso", visible: false, sortable: false },
];

export const TarefasClienteModule: React.FC<TarefasClienteModuleProps> = ({
  searchQuery = "",
  viewMode = "list",
  onNotification,
  className,
}) => {
  const [tarefas, setTarefas] = useState<Tarefa[]>(MOCK_TAREFAS);
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [filterPrioridade, setFilterPrioridade] = useState<string>("todos");
  const [filterCliente, setFilterCliente] = useState<string>("todos");

  // Filtrar tarefas
  const filteredTarefas = useMemo(() => {
    return tarefas.filter((tarefa) => {
      const matchesSearch =
        searchQuery === "" ||
        tarefa.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tarefa.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tarefa.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesStatus =
        filterStatus === "todos" || tarefa.status === filterStatus;

      const matchesPrioridade =
        filterPrioridade === "todos" || tarefa.prioridade === filterPrioridade;

      const matchesCliente =
        filterCliente === "todos" || tarefa.clienteId === filterCliente;

      return (
        matchesSearch && matchesStatus && matchesPrioridade && matchesCliente
      );
    });
  }, [tarefas, searchQuery, filterStatus, filterPrioridade, filterCliente]);

  // Converter para formato da lista
  const listItems: ListItem[] = useMemo(() => {
    return filteredTarefas.map((tarefa) => {
      const progresso = tarefa.tempoGasto
        ? Math.round((tarefa.tempoGasto / tarefa.tempoEstimado) * 100)
        : 0;

      const diasRestantes = Math.ceil(
        (tarefa.dataVencimento.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      );

      return {
        id: tarefa.id,
        status: tarefa.status,
        data: {
          titulo: tarefa.titulo,
          cliente: tarefa.cliente,
          tipo: getTipoLabel(tarefa.tipo),
          status: tarefa.status,
          prioridade: getPrioridadeLabel(tarefa.prioridade),
          dataVencimento: `${tarefa.dataVencimento.toLocaleDateString()} (${diasRestantes}d)`,
          responsavel: tarefa.responsavel,
          tempoEstimado: `${tarefa.tempoEstimado}h`,
          progresso: `${progresso}%`,
          tags: tarefa.tags.join(", "),
          descricao: tarefa.descricao,
        },
        discussions: [
          {
            id: "1",
            author: tarefa.responsavel,
            message: "Tarefa em andamento, aguardando documentos",
            timestamp: new Date(),
            internal: true,
          },
        ],
      };
    });
  }, [filteredTarefas]);

  // Status columns para Kanban
  const statusColumns = ["pendente", "em_andamento", "concluida", "cancelada"];

  // Clientes únicos para filtro
  const clientesUnicos = useMemo(() => {
    const clientes = tarefas.reduce(
      (acc, tarefa) => {
        if (!acc.find((c) => c.id === tarefa.clienteId)) {
          acc.push({ id: tarefa.clienteId, nome: tarefa.cliente });
        }
        return acc;
      },
      [] as { id: string; nome: string }[],
    );
    return clientes;
  }, [tarefas]);

  // Handlers
  const handleItemUpdate = (item: ListItem) => {
    const updatedTarefas = tarefas.map((tarefa) => {
      if (tarefa.id === item.id) {
        return { ...tarefa, status: item.status as Tarefa["status"] };
      }
      return tarefa;
    });
    setTarefas(updatedTarefas);
    onNotification?.("Tarefa atualizada com sucesso");
  };

  const handleDiscussion = (
    itemId: string,
    discussion: Omit<Discussion, "id" | "timestamp">,
  ) => {
    onNotification?.("Discussão adicionada à tarefa");
  };

  // Estatísticas
  const stats = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const atrasadas = tarefas.filter(
      (t) => t.dataVencimento < hoje && t.status !== "concluida",
    ).length;

    const vencemHoje = tarefas.filter((t) => {
      const vencimento = new Date(t.dataVencimento);
      vencimento.setHours(0, 0, 0, 0);
      return (
        vencimento.getTime() === hoje.getTime() && t.status !== "concluida"
      );
    }).length;

    return {
      total: tarefas.length,
      pendentes: tarefas.filter((t) => t.status === "pendente").length,
      emAndamento: tarefas.filter((t) => t.status === "em_andamento").length,
      concluidas: tarefas.filter((t) => t.status === "concluida").length,
      atrasadas,
      vencemHoje,
    };
  }, [tarefas]);

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      {/* Estatísticas */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Tarefas</p>
                <p className="text-xl font-semibold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Em Andamento</p>
                <p className="text-xl font-semibold">{stats.emAndamento}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Atrasadas</p>
                <p className="text-xl font-semibold">{stats.atrasadas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Vencem Hoje</p>
                <p className="text-xl font-semibold">{stats.vencemHoje}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="em_andamento">Em Andamento</SelectItem>
              <SelectItem value="concluida">Concluída</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPrioridade} onValueChange={setFilterPrioridade}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas</SelectItem>
              <SelectItem value="critica">Crítica</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCliente} onValueChange={setFilterCliente}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Clientes</SelectItem>
              {clientesUnicos.map((cliente) => (
                <SelectItem key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>

      {/* Lista configurável */}
      <ConfigurableList
        items={listItems}
        columns={columns}
        viewMode={viewMode}
        onItemUpdate={handleItemUpdate}
        onColumnUpdate={setColumns}
        onDiscussion={handleDiscussion}
        statusColumns={statusColumns}
      />
    </div>
  );
};

// Fun��ões auxiliares
const getTipoLabel = (tipo: Tarefa["tipo"]): string => {
  const labels = {
    manual: "Manual",
    automatica: "Automática",
    recorrente: "Recorrente",
    prazo_processual: "Prazo Processual",
  };
  return labels[tipo];
};

const getPrioridadeLabel = (prioridade: Tarefa["prioridade"]): string => {
  const labels = {
    baixa: "Baixa",
    media: "Média",
    alta: "Alta",
    critica: "Crítica",
  };
  return labels[prioridade];
};

export default TarefasClienteModule;
