/**
 * 📄 MÓDULO CONTRATOS - CRM Unicorn
 *
 * Gestão inteligente de contratos com IA e assinatura digital
 * - Recomendação de modelos via IA
 * - Assinatura digital integrada
 * - Workflow automatizado
 * - Versionamento inteligente
 */

import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Users,
  Edit,
  Eye,
  Download,
  Share,
  Signature,
  Brain,
  Zap,
  FileSignature,
  History,
  Lock,
  Unlock,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Hooks
import { useContratosUnicorn } from "@/hooks/useContratosUnicorn";
import { useAIContractRecommendations } from "@/hooks/useAIContractRecommendations";
import { useDigitalSignature } from "@/hooks/useDigitalSignature";

// Tipos
interface Contrato {
  id: string;
  numero: string;
  titulo: string;
  clienteId: string;
  clienteNome: string;
  tipo: string;
  status:
    | "rascunho"
    | "revisao"
    | "aguardando_assinatura"
    | "assinado"
    | "vigente"
    | "vencido"
    | "cancelado";
  valor: number;
  dataInicio: Date;
  dataVencimento: Date;
  dataRenovacao?: Date;
  responsavel: string;
  signatarios: Array<{
    nome: string;
    email: string;
    assinado: boolean;
    dataAssinatura?: Date;
  }>;
  versao: number;
  arquivo?: string;
  observacoes?: string;
  clausulas: string[];
  tags: string[];
  progresso: number;
  alertasVencimento: number;
  recomendacoesIA: number;
  valorMensal: number;
  renovacaoAutomatica: boolean;
  // IA
  classificacaoIA: string;
  riscoCancelamento: "baixo" | "medio" | "alto";
  probabilidadeRenovacao: number;
}

interface ContratosModuleProps {
  searchQuery?: string;
  onNotification?: (message: string) => void;
  className?: string;
}

// Dados mock de contratos
const MOCK_CONTRATOS: Contrato[] = [
  {
    id: "cont-001",
    numero: "CTR-2024-001",
    titulo: "Prestação de Serviços Jurídicos Empresariais",
    clienteId: "cli-001",
    clienteNome: "Maria Silva Advocacia",
    tipo: "Prestação de Serviços",
    status: "vigente",
    valor: 540000,
    dataInicio: new Date("2024-01-15"),
    dataVencimento: new Date("2025-01-15"),
    dataRenovacao: new Date("2025-01-01"),
    responsavel: "Dr. João Santos",
    signatarios: [
      {
        nome: "Maria Silva",
        email: "maria@mariasilva.adv.br",
        assinado: true,
        dataAssinatura: new Date("2024-01-10"),
      },
      {
        nome: "João Santos",
        email: "joao@escritorio.com",
        assinado: true,
        dataAssinatura: new Date("2024-01-10"),
      },
    ],
    versao: 2,
    arquivo: "contrato-001-v2.pdf",
    clausulas: [
      "Prestação de serviços jurídicos",
      "Confidencialidade",
      "Pagamento mensal",
      "Renovação automática",
    ],
    tags: ["Empresarial", "Mensal", "VIP"],
    progresso: 100,
    alertasVencimento: 0,
    recomendacoesIA: 1,
    valorMensal: 45000,
    renovacaoAutomatica: true,
    classificacaoIA: "Alto Valor",
    riscoCancelamento: "baixo",
    probabilidadeRenovacao: 95,
  },
  {
    id: "cont-002",
    numero: "CTR-2024-002",
    titulo: "Consultoria Trabalhista",
    clienteId: "cli-002",
    clienteNome: "Carlos Mendes",
    tipo: "Consultoria",
    status: "aguardando_assinatura",
    valor: 24000,
    dataInicio: new Date("2025-02-01"),
    dataVencimento: new Date("2025-08-01"),
    responsavel: "Dra. Ana Costa",
    signatarios: [
      {
        nome: "Carlos Mendes",
        email: "carlos.mendes@email.com",
        assinado: false,
      },
      {
        nome: "Ana Costa",
        email: "ana@escritorio.com",
        assinado: true,
        dataAssinatura: new Date("2025-01-20"),
      },
    ],
    versao: 1,
    clausulas: ["Consultoria mensal", "Suporte telefônico", "Relatórios"],
    tags: ["Trabalhista", "Consultoria"],
    progresso: 75,
    alertasVencimento: 0,
    recomendacoesIA: 0,
    valorMensal: 4000,
    renovacaoAutomatica: false,
    classificacaoIA: "Padrão",
    riscoCancelamento: "medio",
    probabilidadeRenovacao: 70,
  },
  {
    id: "cont-003",
    numero: "CTR-2023-015",
    titulo: "Representação Judicial",
    clienteId: "cli-003",
    clienteNome: "Tech Solutions Ltda",
    tipo: "Representação",
    status: "vencido",
    valor: 120000,
    dataInicio: new Date("2023-06-01"),
    dataVencimento: new Date("2024-12-01"),
    responsavel: "Dr. Pedro Oliveira",
    signatarios: [
      {
        nome: "Tech Solutions",
        email: "juridico@techsolutions.com",
        assinado: true,
        dataAssinatura: new Date("2023-05-28"),
      },
    ],
    versao: 1,
    clausulas: ["Representação processual", "Honorários de êxito"],
    tags: ["Representação", "Vencido"],
    progresso: 100,
    alertasVencimento: 2,
    recomendacoesIA: 3,
    valorMensal: 0,
    renovacaoAutomatica: false,
    classificacaoIA: "Renovação Necessária",
    riscoCancelamento: "alto",
    probabilidadeRenovacao: 30,
  },
];

export function ContratosModule({
  searchQuery = "",
  onNotification,
  className,
}: ContratosModuleProps) {
  // Estados
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid");
  const [selectedTipo, setSelectedTipo] = useState<string>("todos");
  const [selectedStatus, setSelectedStatus] = useState<string>("todos");
  const [selectedContract, setSelectedContract] = useState<Contrato | null>(
    null,
  );
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  // Hooks
  const { contratos, loading, createContract, updateContract, deleteContract } =
    useContratosUnicorn();

  const { getTemplateRecommendations, analyzeContract } =
    useAIContractRecommendations();

  const { signContract, sendForSignature, checkSignatureStatus } =
    useDigitalSignature();

  // Dados filtrados
  const filteredContratos = useMemo(() => {
    let filtered = MOCK_CONTRATOS;

    if (searchQuery) {
      filtered = filtered.filter(
        (contrato) =>
          contrato.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contrato.numero.includes(searchQuery) ||
          contrato.clienteNome
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedTipo !== "todos") {
      filtered = filtered.filter((contrato) => contrato.tipo === selectedTipo);
    }

    if (selectedStatus !== "todos") {
      filtered = filtered.filter(
        (contrato) => contrato.status === selectedStatus,
      );
    }

    return filtered.sort((a, b) => {
      // Priorizar contratos com alertas e recomendações
      const aUrgency = a.alertasVencimento + a.recomendacoesIA;
      const bUrgency = b.alertasVencimento + b.recomendacoesIA;
      return bUrgency - aUrgency;
    });
  }, [searchQuery, selectedTipo, selectedStatus]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = MOCK_CONTRATOS.length;
    const vigentes = MOCK_CONTRATOS.filter(
      (c) => c.status === "vigente",
    ).length;
    const aguardandoAssinatura = MOCK_CONTRATOS.filter(
      (c) => c.status === "aguardando_assinatura",
    ).length;
    const vencidos = MOCK_CONTRATOS.filter(
      (c) => c.status === "vencido",
    ).length;
    const valorTotal = MOCK_CONTRATOS.reduce((acc, c) => acc + c.valor, 0);
    const receitaMensal = MOCK_CONTRATOS.filter(
      (c) => c.status === "vigente",
    ).reduce((acc, c) => acc + c.valorMensal, 0);

    return {
      total,
      vigentes,
      aguardandoAssinatura,
      vencidos,
      valorTotal,
      receitaMensal,
    };
  }, []);

  // Handlers
  const handleSendForSignature = useCallback(
    async (contratoId: string) => {
      try {
        await sendForSignature(contratoId);
        onNotification?.("Contrato enviado para assinatura");
      } catch (error) {
        toast.error("Erro ao enviar contrato para assinatura");
      }
    },
    [sendForSignature, onNotification],
  );

  const handleCreateFromTemplate = useCallback(async () => {
    try {
      const recommendations = await getTemplateRecommendations();
      // Abrir modal de seleção de template
      onNotification?.("Recomendações de template carregadas");
    } catch (error) {
      toast.error("Erro ao carregar recomendações de template");
    }
  }, [getTemplateRecommendations, onNotification]);

  // Renderizador de card de contrato
  const renderContractCard = (contrato: Contrato) => (
    <motion.div
      key={contrato.id}
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
          contrato.status === "vigente" && "border-l-green-500 bg-green-50",
          contrato.status === "aguardando_assinatura" &&
            "border-l-yellow-500 bg-yellow-50",
          contrato.status === "vencido" && "border-l-red-500 bg-red-50",
          contrato.status === "rascunho" && "border-l-blue-500 bg-blue-50",
        )}
        onClick={() => setSelectedContract(contrato)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge
                  variant={
                    contrato.status === "vigente"
                      ? "default"
                      : contrato.status === "aguardando_assinatura"
                        ? "secondary"
                        : contrato.status === "vencido"
                          ? "destructive"
                          : "outline"
                  }
                  className="text-xs"
                >
                  {contrato.status.replace("_", " ").toUpperCase()}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {contrato.tipo}
                </Badge>
                {contrato.classificacaoIA && (
                  <Badge variant="secondary" className="text-xs">
                    🤖 {contrato.classificacaoIA}
                  </Badge>
                )}
              </div>

              <h3 className="font-semibold text-sm mb-1">{contrato.titulo}</h3>
              <p className="text-xs text-muted-foreground mb-1">
                {contrato.numero}
              </p>
              <p className="text-xs text-muted-foreground">
                {contrato.clienteNome}
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
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Signature className="h-4 w-4 mr-2" />
                  Assinar/Enviar
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <History className="h-4 w-4 mr-2" />
                  Histórico
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
              <span className="text-xs font-medium">{contrato.progresso}%</span>
            </div>
            <Progress value={contrato.progresso} className="h-2" />
          </div>

          {/* Valor e vigência */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground">Valor Total</p>
              <p className="font-semibold text-green-600">
                R$ {(contrato.valor / 1000).toFixed(0)}k
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Mensal</p>
              <p className="font-semibold text-blue-600">
                R$ {(contrato.valorMensal / 1000).toFixed(0)}k
              </p>
            </div>
          </div>

          {/* Datas importantes */}
          <div className="mb-4">
            <div className="flex items-center text-xs text-muted-foreground mb-1">
              <Calendar className="h-3 w-3 mr-1" />
              Vigência até:{" "}
              {contrato.dataVencimento.toLocaleDateString("pt-BR")}
            </div>
            {contrato.renovacaoAutomatica && (
              <div className="flex items-center text-xs text-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Renovação automática
              </div>
            )}
          </div>

          {/* Signatários */}
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Signatários:</p>
            <div className="flex items-center space-x-2">
              {contrato.signatarios.map((signatario, index) => (
                <div key={index} className="flex items-center">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {signatario.nome.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {signatario.assinado ? (
                    <CheckCircle className="h-3 w-3 text-green-500 ml-1" />
                  ) : (
                    <Clock className="h-3 w-3 text-orange-500 ml-1" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Alertas e recomendações */}
          <div className="flex items-center justify-between mb-3">
            {contrato.alertasVencimento > 0 && (
              <div className="flex items-center text-xs text-red-600">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {contrato.alertasVencimento} alerta(s)
              </div>
            )}

            {contrato.recomendacoesIA > 0 && (
              <div className="flex items-center text-xs text-blue-600">
                <Brain className="h-3 w-3 mr-1" />
                {contrato.recomendacoesIA} IA
              </div>
            )}

            {contrato.riscoCancelamento === "alto" && (
              <div className="flex items-center text-xs text-red-600">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Alto risco
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {contrato.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {contrato.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{contrato.tags.length - 2}
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
          <h2 className="text-3xl font-bold text-gray-900">Contratos</h2>
          <p className="text-muted-foreground">
            Gestão inteligente com assinatura digital
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateFromTemplate}
          >
            <Brain className="h-4 w-4 mr-2" />
            IA Template
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setViewMode(viewMode === "grid" ? "timeline" : "grid")
            }
          >
            {viewMode === "grid" ? "Timeline" : "Grid"}
          </Button>

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Contrato
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Total",
            value: stats.total,
            icon: FileText,
            color: "text-blue-600",
          },
          {
            title: "Vigentes",
            value: stats.vigentes,
            icon: CheckCircle,
            color: "text-green-600",
          },
          {
            title: "Aguardando",
            value: stats.aguardandoAssinatura,
            icon: Clock,
            color: "text-yellow-600",
          },
          {
            title: "Vencidos",
            value: stats.vencidos,
            icon: AlertTriangle,
            color: "text-red-600",
          },
          {
            title: "Valor Total",
            value: `R$ ${(stats.valorTotal / 1000).toFixed(0)}k`,
            icon: DollarSign,
            color: "text-emerald-600",
          },
          {
            title: "Receita/mês",
            value: `R$ ${(stats.receitaMensal / 1000).toFixed(0)}k`,
            icon: DollarSign,
            color: "text-purple-600",
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
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

      {/* Filtros */}
      <div className="flex items-center space-x-4">
        <Select value={selectedTipo} onValueChange={setSelectedTipo}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Tipos</SelectItem>
            <SelectItem value="Prestação de Serviços">
              Prestação de Serviços
            </SelectItem>
            <SelectItem value="Consultoria">Consultoria</SelectItem>
            <SelectItem value="Representação">Representação</SelectItem>
            <SelectItem value="Assessoria">Assessoria</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Status</SelectItem>
            <SelectItem value="rascunho">Rascunho</SelectItem>
            <SelectItem value="revisao">Em Revisão</SelectItem>
            <SelectItem value="aguardando_assinatura">
              Aguardando Assinatura
            </SelectItem>
            <SelectItem value="vigente">Vigente</SelectItem>
            <SelectItem value="vencido">Vencido</SelectItem>
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

      {/* Lista de contratos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredContratos.map(renderContractCard)}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {filteredContratos.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Nenhum contrato encontrado
          </h3>
          <p className="text-muted-foreground mb-4">
            Comece criando contratos ou use recomendações de IA
          </p>
          <div className="flex items-center justify-center space-x-3">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Contrato
            </Button>
            <Button variant="outline" onClick={handleCreateFromTemplate}>
              <Brain className="h-4 w-4 mr-2" />
              Template IA
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
