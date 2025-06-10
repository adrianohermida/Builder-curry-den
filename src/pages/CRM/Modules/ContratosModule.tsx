/**
 * 📄 MÓDULO CONTRATOS - CRM Jurídico
 *
 * Gestão inteligente de contratos
 * - Assinatura digital integrada
 * - Templates automáticos
 * - Controle de versões
 * - Renovações automáticas
 */

import React, { useState, useMemo } from "react";
import {
  FileText,
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  FileSignature,
  Repeat,
  Eye,
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
interface Contrato {
  id: string;
  numero: string;
  titulo: string;
  cliente: string;
  clienteId: string;
  tipoContrato: string;
  status:
    | "rascunho"
    | "aguardando_assinatura"
    | "ativo"
    | "vencido"
    | "cancelado";
  valor: number;
  dataInicio: Date;
  dataVencimento: Date;
  responsavel: string;
  template: string;
  versao: number;
  assinaturaDigital: boolean;
  percentualAssinado: number;
  proximaRenovacao?: Date;
  observacoes?: string;
  tags: string[];
}

interface ContratosModuleProps {
  searchQuery?: string;
  viewMode?: "list" | "kanban";
  onNotification?: (message: string) => void;
  className?: string;
}

// Mock data
const MOCK_CONTRATOS: Contrato[] = [
  {
    id: "1",
    numero: "CTR-2024-001",
    titulo: "Contrato de Prestação de Serviços Jurídicos",
    cliente: "João Silva & Associados",
    clienteId: "1",
    tipoContrato: "Prestação de Serviços",
    status: "ativo",
    valor: 15000,
    dataInicio: new Date(2024, 0, 1),
    dataVencimento: new Date(2024, 11, 31),
    responsavel: "Maria Santos",
    template: "Prestação de Serviços v2.1",
    versao: 1,
    assinaturaDigital: true,
    percentualAssinado: 100,
    proximaRenovacao: new Date(2024, 10, 1),
    tags: ["premium", "anual"],
  },
  {
    id: "2",
    numero: "CTR-2024-002",
    titulo: "Assessoria Jurídica Empresarial",
    cliente: "TechCorp Ltda",
    clienteId: "2",
    tipoContrato: "Assessoria",
    status: "aguardando_assinatura",
    valor: 25000,
    dataInicio: new Date(2024, 1, 15),
    dataVencimento: new Date(2025, 1, 14),
    responsavel: "Carlos Oliveira",
    template: "Assessoria Empresarial v1.3",
    versao: 2,
    assinaturaDigital: true,
    percentualAssinado: 50,
    tags: ["corporativo", "mensal"],
  },
  {
    id: "3",
    numero: "CTR-2024-003",
    titulo: "Consultoria Trabalhista",
    cliente: "Ana Costa",
    clienteId: "3",
    tipoContrato: "Consultoria",
    status: "ativo",
    valor: 5000,
    dataInicio: new Date(2024, 2, 1),
    dataVencimento: new Date(2024, 8, 1),
    responsavel: "João Silva",
    template: "Consultoria Básica v1.0",
    versao: 1,
    assinaturaDigital: false,
    percentualAssinado: 100,
    tags: ["individual", "semestral"],
  },
  {
    id: "4",
    numero: "CTR-2024-004",
    titulo: "Representação Processual",
    cliente: "Pedro Almeida",
    clienteId: "4",
    tipoContrato: "Representação",
    status: "rascunho",
    valor: 8000,
    dataInicio: new Date(2024, 3, 1),
    dataVencimento: new Date(2024, 9, 1),
    responsavel: "Ana Silva",
    template: "Representação v1.5",
    versao: 1,
    assinaturaDigital: true,
    percentualAssinado: 0,
    tags: ["processual"],
  },
];

// Configuração das colunas
const DEFAULT_COLUMNS: ColumnConfig[] = [
  { key: "numero", label: "Número", visible: true, sortable: true },
  { key: "titulo", label: "Título", visible: true, sortable: true },
  { key: "cliente", label: "Cliente", visible: true, sortable: true },
  { key: "tipoContrato", label: "Tipo", visible: true, sortable: true },
  { key: "status", label: "Status", visible: true, sortable: true },
  { key: "valor", label: "Valor", visible: true, sortable: true },
  { key: "dataVencimento", label: "Vencimento", visible: true, sortable: true },
  { key: "responsavel", label: "Responsável", visible: true, sortable: true },
  {
    key: "percentualAssinado",
    label: "% Assinado",
    visible: false,
    sortable: true,
  },
  {
    key: "proximaRenovacao",
    label: "Renovação",
    visible: false,
    sortable: true,
  },
];

export const ContratosModule: React.FC<ContratosModuleProps> = ({
  searchQuery = "",
  viewMode = "list",
  onNotification,
  className,
}) => {
  const [contratos, setContratos] = useState<Contrato[]>(MOCK_CONTRATOS);
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [filterTipo, setFilterTipo] = useState<string>("todos");

  // Filtrar contratos
  const filteredContratos = useMemo(() => {
    return contratos.filter((contrato) => {
      const matchesSearch =
        searchQuery === "" ||
        contrato.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contrato.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contrato.cliente.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === "todos" || contrato.status === filterStatus;

      const matchesTipo =
        filterTipo === "todos" || contrato.tipoContrato === filterTipo;

      return matchesSearch && matchesStatus && matchesTipo;
    });
  }, [contratos, searchQuery, filterStatus, filterTipo]);

  // Converter para formato da lista
  const listItems: ListItem[] = useMemo(() => {
    return filteredContratos.map((contrato) => {
      const diasParaVencimento = Math.ceil(
        (contrato.dataVencimento.getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      );

      return {
        id: contrato.id,
        status: contrato.status,
        data: {
          numero: contrato.numero,
          titulo: contrato.titulo,
          cliente: contrato.cliente,
          tipoContrato: contrato.tipoContrato,
          status: getStatusLabel(contrato.status),
          valor: `R$ ${contrato.valor.toLocaleString()}`,
          dataVencimento: `${contrato.dataVencimento.toLocaleDateString()} (${diasParaVencimento}d)`,
          responsavel: contrato.responsavel,
          percentualAssinado: `${contrato.percentualAssinado}%`,
          proximaRenovacao: contrato.proximaRenovacao
            ? contrato.proximaRenovacao.toLocaleDateString()
            : "Não aplicável",
          template: contrato.template,
          versao: `v${contrato.versao}`,
          assinaturaDigital: contrato.assinaturaDigital ? "Sim" : "Não",
          tags: contrato.tags.join(", "),
        },
        discussions: [
          {
            id: "1",
            author: contrato.responsavel,
            message: "Contrato em fase de revisão",
            timestamp: new Date(),
            internal: true,
          },
        ],
      };
    });
  }, [filteredContratos]);

  // Status columns para Kanban
  const statusColumns = [
    "rascunho",
    "aguardando_assinatura",
    "ativo",
    "vencido",
    "cancelado",
  ];

  // Handlers
  const handleItemUpdate = (item: ListItem) => {
    const updatedContratos = contratos.map((contrato) => {
      if (contrato.id === item.id) {
        return { ...contrato, status: item.status as Contrato["status"] };
      }
      return contrato;
    });
    setContratos(updatedContratos);
    onNotification?.("Contrato atualizado com sucesso");
  };

  const handleDiscussion = (
    itemId: string,
    discussion: Omit<Discussion, "id" | "timestamp">,
  ) => {
    onNotification?.("Discussão adicionada ao contrato");
  };

  // Estatísticas
  const stats = useMemo(() => {
    const hoje = new Date();
    const proximos30Dias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);

    const vencendoEm30Dias = contratos.filter(
      (c) => c.dataVencimento <= proximos30Dias && c.dataVencimento >= hoje,
    ).length;

    const aguardandoAssinatura = contratos.filter(
      (c) => c.status === "aguardando_assinatura",
    ).length;

    return {
      total: contratos.length,
      ativos: contratos.filter((c) => c.status === "ativo").length,
      vencendoEm30Dias,
      aguardandoAssinatura,
      valorTotal: contratos
        .filter((c) => c.status === "ativo")
        .reduce((acc, c) => acc + c.valor, 0),
    };
  }, [contratos]);

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      {/* Estatísticas */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Contratos</p>
                <p className="text-xl font-semibold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
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
                <p className="text-sm text-gray-500">Vencem em 30d</p>
                <p className="text-xl font-semibold">
                  {stats.vencendoEm30Dias}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Valor Total</p>
                <p className="text-xl font-semibold">
                  R$ {(stats.valorTotal / 1000).toFixed(0)}k
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas importantes */}
      {stats.aguardandoAssinatura > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FileSignature className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">
                  {stats.aguardandoAssinatura} contrato(s) aguardando assinatura
                </p>
                <p className="text-sm text-yellow-600">
                  Acompanhe o status das assinaturas digitais
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="rascunho">Rascunho</SelectItem>
              <SelectItem value="aguardando_assinatura">
                Aguardando Assinatura
              </SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="vencido">Vencido</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterTipo} onValueChange={setFilterTipo}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Tipos</SelectItem>
              <SelectItem value="Prestação de Serviços">
                Prestação de Serviços
              </SelectItem>
              <SelectItem value="Assessoria">Assessoria</SelectItem>
              <SelectItem value="Consultoria">Consultoria</SelectItem>
              <SelectItem value="Representação">Representação</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Contrato
          </Button>
        </div>
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

// Função auxiliar para status
const getStatusLabel = (status: Contrato["status"]): string => {
  const labels = {
    rascunho: "Rascunho",
    aguardando_assinatura: "Aguardando Assinatura",
    ativo: "Ativo",
    vencido: "Vencido",
    cancelado: "Cancelado",
  };
  return labels[status];
};

export default ContratosModule;
