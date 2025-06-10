/**
 * 👥 MÓDULO CLIENTES V3 - MINIMALISTA
 *
 * Gestão de clientes com foco em:
 * - Pipeline visual Lead → Cliente
 * - Score de engajamento dinâmico
 * - Visão 360° do cliente
 * - Detecção de duplicatas via IA
 * - Ações contextuais e colaboração
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { DropResult } from "@hello-pangea/dnd";
import {
  Users,
  Star,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Phone,
  Mail,
  Building,
  DollarSign,
  FileText,
  MessageCircle,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Grid3X3,
  List,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useCRMV3, ViewMode } from "@/hooks/useCRMV3";
import KanbanBoard, {
  KanbanColumn,
  KanbanItem,
} from "@/components/CRM/KanbanBoard";
import ContextualMenu, {
  getClientActions,
  ContextualAction,
} from "@/components/CRM/ContextualMenu";

const ClientesV3Module: React.FC = () => {
  const { clientes, dashboardStats, viewMode, setViewMode } = useCRMV3();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  // Configurar colunas do pipeline
  const pipelineColumns: KanbanColumn[] = [
    {
      id: "prospecto",
      title: "Prospects",
      color: "#3B82F6",
      items: [],
    },
    {
      id: "qualificado",
      title: "Qualificados",
      color: "#F59E0B",
      items: [],
    },
    {
      id: "negociacao",
      title: "Negociação",
      color: "#EF4444",
      items: [],
    },
    {
      id: "ativo",
      title: "Clientes Ativos",
      color: "#10B981",
      items: [],
    },
    {
      id: "vip",
      title: "VIP",
      color: "#8B5CF6",
      items: [],
    },
  ];

  // Converter clientes para itens do kanban
  const clientesToKanbanItems = (): KanbanColumn[] => {
    const columns = [...pipelineColumns];

    clientes.forEach((cliente) => {
      const columnIndex = columns.findIndex((col) => col.id === cliente.status);
      if (columnIndex !== -1) {
        const kanbanItem: KanbanItem = {
          id: cliente.id,
          title: cliente.nome,
          subtitle: cliente.empresa || cliente.email,
          description: cliente.proximaAcao?.descricao,
          initials: cliente.nome
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
          value: cliente.valorPotencial,
          date: cliente.proximaAcao?.prazo,
          tags: [
            cliente.processos.length > 0 &&
              `${cliente.processos.length} processos`,
            cliente.contratos.length > 0 &&
              `${cliente.contratos.length} contratos`,
            `${cliente.scoreEngajamento}% engajamento`,
          ].filter(Boolean) as string[],
          metrics: {
            scoreEngajamento: cliente.scoreEngajamento,
            ultimaInteracao: cliente.ultimaInteracao,
            valorPotencial: cliente.valorPotencial,
          },
          actions: getClientActions(cliente.id),
        };

        columns[columnIndex].items.push(kanbanItem);
      }
    });

    return columns;
  };

  const kanbanColumns = clientesToKanbanItems();

  // Handler para drag & drop
  const handleDrop = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;

    // TODO: Atualizar status do cliente
    console.log(
      `Cliente ${draggableId} movido de ${source.droppableId} para ${destination.droppableId}`,
    );
  };

  // Handler para ações do menu contextual
  const handleAction = (clientId: string, actionId: string) => {
    switch (actionId) {
      case "view":
        setSelectedClient(clientId);
        break;
      case "edit":
        // TODO: Abrir modal de edição
        console.log("Editar cliente:", clientId);
        break;
      case "call":
        // TODO: Iniciar chamada
        console.log("Ligar para cliente:", clientId);
        break;
      case "email":
        // TODO: Abrir composição de email
        console.log("Enviar email para cliente:", clientId);
        break;
      case "new-process":
        // TODO: Criar novo processo
        console.log("Novo processo para cliente:", clientId);
        break;
      case "new-task":
        // TODO: Criar nova tarefa
        console.log("Nova tarefa para cliente:", clientId);
        break;
      case "new-contract":
        // TODO: Criar novo contrato
        console.log("Novo contrato para cliente:", clientId);
        break;
      case "discuss":
        // TODO: Abrir discussão interna
        console.log("Iniciar discussão sobre cliente:", clientId);
        break;
      case "delete":
        // TODO: Confirmar e excluir
        if (confirm("Tem certeza que deseja excluir este cliente?")) {
          console.log("Excluir cliente:", clientId);
        }
        break;
      default:
        console.log("Ação não implementada:", actionId);
    }
  };

  // Handler para adicionar novo item
  const handleAddItem = (columnId: string) => {
    console.log("Adicionar novo cliente no estágio:", columnId);
    // TODO: Abrir modal de novo cliente com status pré-definido
  };

  // Renderizar cartões de estatísticas
  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {dashboardStats.clientes.total}
              </p>
              <p className="text-xs text-gray-600">Total de Clientes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {dashboardStats.clientes.vips}
              </p>
              <p className="text-xs text-gray-600">Clientes VIP</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {dashboardStats.clientes.scoreEngajamentoMedio}%
              </p>
              <p className="text-xs text-gray-600">Score Médio</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                +{dashboardStats.clientes.crescimentoMensal}%
              </p>
              <p className="text-xs text-gray-600">Crescimento</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Renderizar toolbar
  const renderToolbar = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-900">
          Pipeline de Clientes
        </h2>
        <Badge variant="secondary" className="text-xs">
          {clientes.length} total
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        {/* Seletor de visualização */}
        <div className="flex items-center border border-gray-200 rounded-lg p-0.5">
          <Button
            variant={viewMode === "kanban" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("kanban")}
            className="h-7 px-2 text-xs"
          >
            <Grid3X3 className="w-3 h-3 mr-1" />
            Kanban
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="h-7 px-2 text-xs"
          >
            <List className="w-3 h-3 mr-1" />
            Lista
          </Button>
          <Button
            variant={viewMode === "360" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("360")}
            className="h-7 px-2 text-xs"
          >
            <BarChart3 className="w-3 h-3 mr-1" />
            360°
          </Button>
        </div>

        {/* Botão de novo cliente */}
        <Button size="sm" className="h-8 px-3 text-xs">
          <UserPlus className="w-3 h-3 mr-1.5" />
          Novo Cliente
        </Button>
      </div>
    </div>
  );

  // Renderizar lista de clientes
  const renderListView = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Lista de Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {clientes.map((cliente) => (
            <div
              key={cliente.id}
              className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                  {cliente.nome
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm text-gray-900 truncate">
                    {cliente.nome}
                  </h4>
                  <Badge
                    variant="secondary"
                    className={`text-xs h-4 px-1.5 ${cliente.status === "vip" ? "bg-amber-100 text-amber-700" : ""}`}
                  >
                    {cliente.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-gray-600 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {cliente.email}
                  </span>
                  <span className="text-xs text-gray-600 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {cliente.telefone}
                  </span>
                  <span className="text-xs text-gray-600">
                    Score: {cliente.scoreEngajamento}%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Ver
                </Button>

                <ContextualMenu
                  actions={getClientActions(cliente.id)}
                  onAction={(actionId) => handleAction(cliente.id, actionId)}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Renderizar visão 360°
  const render360View = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Visão 360° dos Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Selecione um cliente para ver informações detalhadas, histórico de
              interações, processos relacionados e oportunidades.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <FileText className="w-4 h-4 mr-2" />
              Importar Dados
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Discussões Ativas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Cards de estatísticas */}
      {renderStatsCards()}

      {/* Toolbar */}
      {renderToolbar()}

      {/* Conteúdo baseado no modo de visualização */}
      {viewMode === "kanban" && (
        <KanbanBoard
          columns={kanbanColumns}
          onDrop={handleDrop}
          onAction={handleAction}
          onAddItem={handleAddItem}
          type="clients"
        />
      )}

      {viewMode === "list" && renderListView()}

      {viewMode === "360" && render360View()}
    </motion.div>
  );
};

export default ClientesV3Module;
