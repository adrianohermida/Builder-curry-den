import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  FileText,
  DollarSign,
  Calendar,
  MessageSquare,
  Download,
  Eye,
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle,
  Bell,
  Settings,
  LogOut,
  Shield,
  Lock,
  Unlock,
  Star,
  Heart,
  BookOpen,
  FolderOpen,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Building,
  Hash,
  Archive,
  FileSignature,
  Receipt,
  Wallet,
  PiggyBank,
  TrendingUp,
  BarChart3,
  Users,
  Scale,
  Gavel,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { usePermissions } from "@/hooks/usePermissions";
import {
  useAuditSystem,
  AUDIT_ACTIONS,
  AUDIT_MODULES,
} from "@/hooks/useAuditSystem";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ClientData {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  tipo: "fisica" | "juridica";
  endereco: {
    rua: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  advocado: {
    nome: string;
    oab: string;
    telefone: string;
    email: string;
  };
  plano: {
    nome: string;
    tipo: "basico" | "premium" | "empresarial";
    vigencia: string;
    valor: number;
    status: "ativo" | "suspenso" | "cancelado";
  };
  estatisticas: {
    processos: number;
    contratos: number;
    documentos: number;
    atendimentos: number;
    satisfacao: number;
  };
}

interface ProcessoCliente {
  id: string;
  numero: string;
  assunto: string;
  area: string;
  status: "ativo" | "arquivado" | "suspenso";
  dataInicio: string;
  ultimaMovimentacao: string;
  valor: number;
  tribunal: string;
  fase: string;
  proximaAudiencia?: string;
  documentos: number;
  tarefas: {
    total: number;
    pendentes: number;
    concluidas: number;
  };
}

interface ContratoCliente {
  id: string;
  titulo: string;
  tipo: "prestacao_servicos" | "retainer" | "success_fee" | "consultoria";
  status: "ativo" | "vencido" | "cancelado" | "suspenso";
  valor: number;
  dataInicio: string;
  dataVencimento: string;
  pagamento: "mensal" | "trimestral" | "anual" | "unico";
  servicos: string[];
  proximaCobranca?: string;
  faturas: {
    total: number;
    pagas: number;
    pendentes: number;
    vencidas: number;
  };
}

interface FaturaCliente {
  id: string;
  numero: string;
  descricao: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: "pendente" | "paga" | "vencida" | "cancelada";
  servicos: Array<{
    descricao: string;
    quantidade: number;
    valor: number;
  }>;
  contrato?: {
    id: string;
    titulo: string;
  };
  processo?: {
    id: string;
    numero: string;
  };
  linkPagamento?: string;
}

interface DocumentoCliente {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  categoria: "processo" | "contrato" | "financeiro" | "geral";
  dataUpload: string;
  processo?: {
    id: string;
    numero: string;
  };
  contrato?: {
    id: string;
    titulo: string;
  };
  permissoes: {
    visualizar: boolean;
    baixar: boolean;
  };
  status: "disponivel" | "processando" | "erro";
}

interface AtendimentoCliente {
  id: string;
  assunto: string;
  status: "aberto" | "respondido" | "fechado";
  prioridade: "baixa" | "media" | "alta";
  dataAbertura: string;
  ultimaResposta?: string;
  responsavel: string;
  canal: "email" | "whatsapp" | "telefone" | "presencial";
  mensagens: number;
}

export default function PortalCliente() {
  const [activeTab, setActiveTab] = useState("overview");
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [processos, setProcessos] = useState<ProcessoCliente[]>([]);
  const [contratos, setContratos] = useState<ContratoCliente[]>([]);
  const [faturas, setFaturas] = useState<FaturaCliente[]>([]);
  const [documentos, setDocumentos] = useState<DocumentoCliente[]>([]);
  const [atendimentos, setAtendimentos] = useState<AtendimentoCliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const { user, hasPermission } = usePermissions();
  const { logAction } = useAuditSystem();

  // Mock data loading
  useEffect(() => {
    const loadClientData = async () => {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock client data
      const mockClientData: ClientData = {
        id: "cli-001",
        nome: "João Silva",
        email: "joao.silva@email.com",
        telefone: "(11) 99999-9999",
        documento: "123.456.789-00",
        tipo: "fisica",
        endereco: {
          rua: "Rua das Flores, 123",
          cidade: "São Paulo",
          estado: "SP",
          cep: "01234-567",
        },
        advocado: {
          nome: "Dr. Pedro Costa",
          oab: "OAB/SP 123.456",
          telefone: "(11) 88888-8888",
          email: "pedro.costa@lawdesk.com",
        },
        plano: {
          nome: "Plano Premium",
          tipo: "premium",
          vigencia: "2024-12-31",
          valor: 299.9,
          status: "ativo",
        },
        estatisticas: {
          processos: 3,
          contratos: 2,
          documentos: 45,
          atendimentos: 12,
          satisfacao: 4.8,
        },
      };

      const mockProcessos: ProcessoCliente[] = [
        {
          id: "proc-001",
          numero: "1001234-12.2024.5.02.0001",
          assunto: "Ação Trabalhista - Horas Extras",
          area: "Direito Trabalhista",
          status: "ativo",
          dataInicio: "2024-01-15",
          ultimaMovimentacao: "2024-01-20",
          valor: 15000,
          tribunal: "TRT 2ª Região",
          fase: "Instrução",
          proximaAudiencia: "2024-02-15T14:30:00",
          documentos: 12,
          tarefas: { total: 8, pendentes: 3, concluidas: 5 },
        },
        {
          id: "proc-002",
          numero: "2002345-34.2024.5.02.0002",
          assunto: "Recurso Ordinário - Adicional de Insalubridade",
          area: "Direito Trabalhista",
          status: "ativo",
          dataInicio: "2024-02-01",
          ultimaMovimentacao: "2024-02-10",
          valor: 8000,
          tribunal: "TRT 2ª Região",
          fase: "Recursal",
          documentos: 8,
          tarefas: { total: 5, pendentes: 2, concluidas: 3 },
        },
      ];

      const mockContratos: ContratoCliente[] = [
        {
          id: "cont-001",
          titulo: "Prestação de Serviços Jurídicos",
          tipo: "prestacao_servicos",
          status: "ativo",
          valor: 2500,
          dataInicio: "2024-01-01",
          dataVencimento: "2024-12-31",
          pagamento: "mensal",
          servicos: ["Consultoria Trabalhista", "Acompanhamento Processual"],
          proximaCobranca: "2024-02-01",
          faturas: { total: 12, pagas: 10, pendentes: 1, vencidas: 1 },
        },
      ];

      const mockFaturas: FaturaCliente[] = [
        {
          id: "fat-001",
          numero: "2024-001",
          descricao: "Prestação de Serviços - Janeiro 2024",
          valor: 2500,
          dataVencimento: "2024-02-01",
          status: "pendente",
          servicos: [
            {
              descricao: "Consultoria Trabalhista",
              quantidade: 20,
              valor: 2000,
            },
            { descricao: "Elaboração de Petição", quantidade: 1, valor: 500 },
          ],
          contrato: {
            id: "cont-001",
            titulo: "Prestação de Serviços Jurídicos",
          },
          linkPagamento: "https://checkout.stripe.com/pay/xxx",
        },
      ];

      setClientData(mockClientData);
      setProcessos(mockProcessos);
      setContratos(mockContratos);
      setFaturas(mockFaturas);
      setIsLoading(false);

      await logAction(AUDIT_ACTIONS.PAGE_VISIT, AUDIT_MODULES.CRM, {
        page: "portal_cliente",
        client_id: mockClientData.id,
      });
    };

    loadClientData();
  }, [logAction]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
      case "paga":
      case "disponivel":
        return "text-green-600 bg-green-50";
      case "pendente":
      case "aberto":
        return "text-yellow-600 bg-yellow-50";
      case "vencida":
      case "vencido":
      case "suspenso":
        return "text-red-600 bg-red-50";
      case "cancelado":
      case "cancelada":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-blue-600 bg-blue-50";
    }
  };

  const getTipoPlanoColor = (tipo: string) => {
    switch (tipo) {
      case "empresarial":
        return "text-purple-600 bg-purple-50";
      case "premium":
        return "text-blue-600 bg-blue-50";
      case "basico":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const handlePayment = async (faturaId: string) => {
    const fatura = faturas.find((f) => f.id === faturaId);
    if (!fatura?.linkPagamento) {
      toast.error("Link de pagamento não disponível");
      return;
    }

    await logAction(AUDIT_ACTIONS.CREATE, AUDIT_MODULES.FINANCIAL, {
      action: "payment_initiated",
      fatura_id: faturaId,
      valor: fatura.valor,
    });

    // Abrir link de pagamento em nova janela
    window.open(fatura.linkPagamento, "_blank");
    toast.success("Redirecionando para pagamento...");
  };

  const downloadDocument = async (documentId: string) => {
    await logAction(AUDIT_ACTIONS.DOWNLOAD, AUDIT_MODULES.GED, {
      document_id: documentId,
      action: "download",
    });

    // Simular download
    toast.success("Download iniciado");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Carregando portal do cliente...
          </p>
        </div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Dados Não Encontrados</h3>
          <p className="text-muted-foreground">
            Não foi possível carregar os dados do cliente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header do Cliente */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-white/20">
              <AvatarFallback className="bg-white/20 text-white text-lg">
                {clientData.nome
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{clientData.nome}</h1>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <span className="flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  {clientData.documento}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {clientData.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {clientData.telefone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-white/80">Plano Atual</div>
              <Badge
                className={`${getTipoPlanoColor(clientData.plano.tipo)} text-sm`}
              >
                {clientData.plano.nome}
              </Badge>
            </div>
            <Button variant="secondary" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processos</p>
                <p className="text-2xl font-bold">
                  {clientData.estatisticas.processos}
                </p>
              </div>
              <Scale className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Contratos</p>
                <p className="text-2xl font-bold">
                  {clientData.estatisticas.contratos}
                </p>
              </div>
              <FileSignature className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Documentos</p>
                <p className="text-2xl font-bold">
                  {clientData.estatisticas.documentos}
                </p>
              </div>
              <FolderOpen className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Atendimentos</p>
                <p className="text-2xl font-bold">
                  {clientData.estatisticas.atendimentos}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Satisfação</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold">
                    {clientData.estatisticas.satisfacao}
                  </p>
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                </div>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo Principal */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="processos">Processos</TabsTrigger>
          <TabsTrigger value="contratos">Contratos</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="atendimento">Atendimento</TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dados do Advocado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Seu Advocado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {clientData.advocado.nome
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">
                        {clientData.advocado.nome}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {clientData.advocado.oab}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3" />
                      {clientData.advocado.telefone}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3" />
                      {clientData.advocado.email}
                    </div>
                  </div>

                  <Button className="w-full" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Entrar em Contato
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Informações do Plano */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Plano e Pagamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Plano Atual
                    </span>
                    <Badge className={getTipoPlanoColor(clientData.plano.tipo)}>
                      {clientData.plano.nome}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Valor Mensal
                    </span>
                    <span className="font-medium">
                      R$ {clientData.plano.valor.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Status
                    </span>
                    <Badge className={getStatusColor(clientData.plano.status)}>
                      {clientData.plano.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Vigência
                    </span>
                    <span className="text-sm">
                      até{" "}
                      {format(
                        new Date(clientData.plano.vigencia),
                        "dd/MM/yyyy",
                      )}
                    </span>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <Receipt className="h-4 w-4 mr-2" />
                      Faturas
                    </Button>
                    <Button variant="outline" size="sm">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Upgrade
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Atividade Recente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="p-2 rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Processo atualizado</h4>
                    <p className="text-sm text-muted-foreground">
                      Nova movimentação no processo 1001234-12.2024.5.02.0001
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      há 2 horas
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="p-2 rounded-full bg-blue-100">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Documento disponível</h4>
                    <p className="text-sm text-muted-foreground">
                      Novo documento "Petição Inicial" foi adicionado
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      há 1 dia
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="p-2 rounded-full bg-yellow-100">
                    <DollarSign className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Fatura gerada</h4>
                    <p className="text-sm text-muted-foreground">
                      Fatura 2024-001 no valor de R$ 2.500,00
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      há 3 dias
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Processos */}
        <TabsContent value="processos" className="space-y-6">
          <div className="space-y-4">
            {processos.map((processo) => (
              <Card key={processo.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{processo.assunto}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Hash className="h-3 w-3" />
                          {processo.numero}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {processo.tribunal}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {processo.fase}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(processo.status)}>
                        {processo.status}
                      </Badge>
                      <Badge variant="outline">{processo.area}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold">
                        R$ {processo.valor.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Valor da Causa
                      </div>
                    </div>

                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold">
                        {processo.documentos}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Documentos
                      </div>
                    </div>

                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold">
                        {processo.tarefas.pendentes}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Tarefas Pendentes
                      </div>
                    </div>

                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold">
                        {format(new Date(processo.ultimaMovimentacao), "dd/MM")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Última Movimentação
                      </div>
                    </div>
                  </div>

                  {processo.proximaAudiencia && (
                    <Alert className="mb-4">
                      <Calendar className="h-4 w-4" />
                      <AlertTitle>Próxima Audiência</AlertTitle>
                      <AlertDescription>
                        {format(
                          new Date(processo.proximaAudiencia),
                          "dd/MM/yyyy 'às' HH:mm",
                          { locale: ptBR },
                        )}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Documentos
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contatar Advogado
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Contratos */}
        <TabsContent value="contratos" className="space-y-6">
          <div className="space-y-4">
            {contratos.map((contrato) => (
              <Card key={contrato.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{contrato.titulo}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>
                          Vigência:{" "}
                          {format(new Date(contrato.dataInicio), "dd/MM/yyyy")}{" "}
                          -{" "}
                          {format(
                            new Date(contrato.dataVencimento),
                            "dd/MM/yyyy",
                          )}
                        </span>
                        <span>Pagamento: {contrato.pagamento}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(contrato.status)}>
                        {contrato.status}
                      </Badge>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          R$ {contrato.valor.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          /{contrato.pagamento}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Serviços Incluídos</h4>
                    <div className="flex flex-wrap gap-2">
                      {contrato.servicos.map((servico, index) => (
                        <Badge key={index} variant="outline">
                          {servico}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {contrato.faturas.pagas}
                      </div>
                      <div className="text-xs text-muted-foreground">Pagas</div>
                    </div>

                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-yellow-600">
                        {contrato.faturas.pendentes}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Pendentes
                      </div>
                    </div>

                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-red-600">
                        {contrato.faturas.vencidas}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Vencidas
                      </div>
                    </div>

                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold">
                        {contrato.faturas.total}
                      </div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Contrato
                    </Button>
                    <Button variant="outline" size="sm">
                      <Receipt className="h-4 w-4 mr-2" />
                      Faturas
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Aditivos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Financeiro */}
        <TabsContent value="financeiro" className="space-y-6">
          <div className="space-y-4">
            {faturas.map((fatura) => (
              <Card key={fatura.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Fatura #{fatura.numero}</h3>
                      <p className="text-sm text-muted-foreground">
                        {fatura.descricao}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>
                          Vencimento:{" "}
                          {format(
                            new Date(fatura.dataVencimento),
                            "dd/MM/yyyy",
                          )}
                        </span>
                        {fatura.dataPagamento && (
                          <span>
                            Pago em:{" "}
                            {format(
                              new Date(fatura.dataPagamento),
                              "dd/MM/yyyy",
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        R$ {fatura.valor.toFixed(2)}
                      </div>
                      <Badge className={getStatusColor(fatura.status)}>
                        {fatura.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Serviços */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Serviços</h4>
                    <div className="space-y-2">
                      {fatura.servicos.map((servico, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm border rounded p-2"
                        >
                          <span>{servico.descricao}</span>
                          <span className="font-medium">
                            {servico.quantidade}x R$ {servico.valor.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Fatura
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                    {fatura.status === "pendente" && fatura.linkPagamento && (
                      <Button
                        size="sm"
                        onClick={() => handlePayment(fatura.id)}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pagar Agora
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Documentos */}
        <TabsContent value="documentos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estante Digital</CardTitle>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-xs"
                />
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="processo">Processo</SelectItem>
                    <SelectItem value="contrato">Contrato</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="geral">Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Estante Digital</h3>
                <p>Seus documentos estarão disponíveis aqui em breve</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Atendimento */}
        <TabsContent value="atendimento" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Central de Atendimento</span>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Solicitação
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Atendimento</h3>
                <p>Sistema de atendimento integrado será implementado aqui</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
