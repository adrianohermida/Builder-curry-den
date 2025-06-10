/**
 * ⚖️ MÓDULO PROCESSOS - CRM Jurídico
 *
 * Acompanhamento processual inteligente
 * - Visualização lista e Kanban
 * - Drag & drop por status
 * - Discussões contextuais
 * - Integração com publicações
 */

import React, { useState, useMemo } from "react";
import {
  Scale,
  Plus,
  Calendar,
  AlertTriangle,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
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
interface Processo {
  id: string;
  numero: string;
  cliente: string;
  tipoAcao: string;
  tribunal: string;
  comarca: string;
  status: "ativo" | "suspenso" | "arquivado" | "sentenciado";
  dataDistribuicao: Date;
  proximoPrazo?: Date;
  valorCausa: number;
  responsavel: string;
  probabilidadeSucesso: number;
  faseProcessual: string;
  observacoes?: string;
}

interface ProcessosModuleProps {
  searchQuery?: string;
  viewMode?: "list" | "kanban";
  onNotification?: (message: string) => void;
  className?: string;
}

// Mock data
const MOCK_PROCESSOS: Processo[] = [
  {
    id: "1",
    numero: "1001234-12.2024.8.26.0100",
    cliente: "João Silva & Associados",
    tipoAcao: "Ação Trabalhista",
    tribunal: "TRT 2ª Região",
    comarca: "São Paulo",
    status: "ativo",
    dataDistribuicao: new Date(2024, 0, 15),
    proximoPrazo: new Date(Date.now() + 86400000 * 5),
    valorCausa: 50000,
    responsavel: "Maria Santos",
    probabilidadeSucesso: 75,
    faseProcessual: "Instrução Probatória",
  },
  {
    id: "2",
    numero: "5005678-34.2024.4.03.6100",
    cliente: "TechCorp Ltda",
    tipoAcao: "Ação Cível",
    tribunal: "TJSP",
    comarca: "Campinas",
    status: "ativo",
    dataDistribuicao: new Date(2024, 1, 20),
    proximoPrazo: new Date(Date.now() + 86400000 * 2),
    valorCausa: 250000,
    responsavel: "Carlos Oliveira",
    probabilidadeSucesso: 85,
    faseProcessual: "Contestação",
  },
  {
    id: "3",
    numero: "2002345-67.2023.8.26.0224",
    cliente: "Ana Costa",
    tipoAcao: "Família",
    tribunal: "TJSP",
    comarca: "Guarulhos",
    status: "sentenciado",
    dataDistribuicao: new Date(2023, 8, 10),
    valorCausa: 15000,
    responsavel: "João Silva",
    probabilidadeSucesso: 90,
    faseProcessual: "Transitado em Julgado",
  },
];

// Configuração das colunas
const DEFAULT_COLUMNS: ColumnConfig[] = [
  { key: "numero", label: "Número", visible: true, sortable: true },
  { key: "cliente", label: "Cliente", visible: true, sortable: true },
  { key: "tipoAcao", label: "Tipo", visible: true, sortable: true },
  { key: "status", label: "Status", visible: true, sortable: true },
  { key: "faseProcessual", label: "Fase", visible: true, sortable: true },
  {
    key: "proximoPrazo",
    label: "Próximo Prazo",
    visible: true,
    sortable: true,
  },
  { key: "responsavel", label: "Responsável", visible: true, sortable: true },
  {
    key: "probabilidadeSucesso",
    label: "Prob. Sucesso",
    visible: false,
    sortable: true,
  },
  { key: "valorCausa", label: "Valor", visible: false, sortable: true },
];

export const ProcessosModule: React.FC<ProcessosModuleProps> = ({
  searchQuery = "",
  viewMode = "list",
  onNotification,
  className,
}) => {
  const [processos, setProcessos] = useState<Processo[]>(MOCK_PROCESSOS);
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [filterTribunal, setFilterTribunal] = useState<string>("todos");

  // Filtrar processos
  const filteredProcessos = useMemo(() => {
    return processos.filter((processo) => {
      const matchesSearch =
        searchQuery === "" ||
        processo.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
        processo.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
        processo.tipoAcao.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === "todos" || processo.status === filterStatus;

      const matchesTribunal =
        filterTribunal === "todos" || processo.tribunal === filterTribunal;

      return matchesSearch && matchesStatus && matchesTribunal;
    });
  }, [processos, searchQuery, filterStatus, filterTribunal]);

  // Converter para formato da lista
  const listItems: ListItem[] = useMemo(() => {
    return filteredProcessos.map((processo) => ({
      id: processo.id,
      status: processo.status,
      data: {
        numero: processo.numero,
        cliente: processo.cliente,
        tipoAcao: processo.tipoAcao,
        status: processo.status,
        faseProcessual: processo.faseProcessual,
        proximoPrazo: processo.proximoPrazo
          ? processo.proximoPrazo.toLocaleDateString()
          : "Sem prazo",
        responsavel: processo.responsavel,
        probabilidadeSucesso: `${processo.probabilidadeSucesso}%`,
        valorCausa: `R$ ${processo.valorCausa.toLocaleString()}`,
        tribunal: processo.tribunal,
        comarca: processo.comarca,
      },
      discussions: [
        {
          id: "1",
          author: "Maria Santos",
          message: "Prazo para contestação se aproximando",
          timestamp: new Date(),
          internal: true,
        },
      ],
    }));
  }, [filteredProcessos]);

  // Status columns para Kanban
  const statusColumns = ["ativo", "suspenso", "sentenciado", "arquivado"];

  // Handlers
  const handleItemUpdate = (item: ListItem) => {
    const updatedProcessos = processos.map((processo) => {
      if (processo.id === item.id) {
        return { ...processo, status: item.status as Processo["status"] };
      }
      return processo;
    });
    setProcessos(updatedProcessos);
    onNotification?.("Processo atualizado com sucesso");
  };

  const handleDiscussion = (
    itemId: string,
    discussion: Omit<Discussion, "id" | "timestamp">,
  ) => {
    onNotification?.("Discussão adicionada");
  };

  // Estatísticas
  const stats = useMemo(() => {
    const prazosProximos = processos.filter(
      (p) =>
        p.proximoPrazo && p.proximoPrazo.getTime() - Date.now() <= 86400000 * 7,
    ).length;

    return {
      total: processos.length,
      ativos: processos.filter((p) => p.status === "ativo").length,
      prazosProximos,
      valorTotal: processos.reduce((acc, p) => acc + p.valorCausa, 0),
    };
  }, [processos]);

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      {/* Estatísticas */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Processos</p>
                <p className="text-xl font-semibold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ativos</p>
                <p className="text-xl font-semibold">{stats.ativos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Prazos Próximos</p>
                <p className="text-xl font-semibold">{stats.prazosProximos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Valor em Causa</p>
                <p className="text-xl font-semibold">
                  R$ {(stats.valorTotal / 1000000).toFixed(1)}M
                </p>
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
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="suspenso">Suspenso</SelectItem>
              <SelectItem value="sentenciado">Sentenciado</SelectItem>
              <SelectItem value="arquivado">Arquivado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterTribunal} onValueChange={setFilterTribunal}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tribunal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos Tribunais</SelectItem>
              <SelectItem value="TJSP">TJSP</SelectItem>
              <SelectItem value="TRT 2ª Região">TRT 2ª Região</SelectItem>
              <SelectItem value="STJ">STJ</SelectItem>
              <SelectItem value="STF">STF</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Processo
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

export default ProcessosModule;
